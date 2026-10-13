import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import '../Style/CssPages/MapShelters.css';
import { GetItems } from "../Service";
import { toast } from "react-toastify";


const mapContainerStyle = {
  width: "100%",
  height: "100vh"
};

const defaultCenter = { lat: 31.3147, lng: 34.6203 }; // אופקים

// פונקציה לחישוב מרחק אווירי בין שתי נקודות ציון
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // רדיוס כדור הארץ בקילומטרים
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  if (distanceKm < 1) {
    return { value: distanceKm, text: `${Math.round(distanceKm * 1000)} מטרים` };
  }
  return { value: distanceKm, text: `${distanceKm.toFixed(1)} ק"מ` };
};

const PAGE_SIZE = 5;

function MapShelters() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const routeRequestId = useRef(0);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [expandedShelter, setExpandedShelter] = useState(null);
  const [routeInfo, setRouteInfo] = useState({});
  const [sortedShelters, setSortedShelters] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  async function loadShelters() {
    try {
      const data = await GetItems("shelters");
      setShelters(data);
    } catch (err) {
      console.error("שגיאה בטעינת המיגוניות:", err);
    }
  }
  useEffect(() => {
    loadShelters();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.error("לא ניתן לקבל מיקום."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // 3. מיון כל המיגוניות לפי מרחק (או לפי הסדר שהתקבל, אם אין מיקום)
  useEffect(() => {
    if (userLocation && shelters.length > 0) {
      const sheltersWithDistance = shelters.map(shelter => {
        const distanceData = calculateDistance(
          userLocation.lat, userLocation.lng,
          Number(shelter.latitude), Number(shelter.longitude)
        );
        return {
          ...shelter,
          distanceValue: distanceData.value,
          distanceText: distanceData.text
        };
      });

      const sorted = sheltersWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);
      setSortedShelters(sorted);
    } else {
      setSortedShelters(shelters);
    }
  }, [userLocation, shelters]);

  // הרשימה שמוצגת בפועל - לפי visibleCount
  const visibleShelters = sortedShelters.slice(0, visibleCount);
  const hasMore = visibleCount < sortedShelters.length;

  // 4. נטען כשהמפה מוכנה - שומרים רפרנס למפה
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 5. ניתוב מסלול ועדכון פרטי דרך
  const calculateRoute = useCallback((shelter) => {
    if (!userLocation) {
      toast.info("אנא אשר הרשאת מיקום כדי לחשב מסלול");
      return;
    }

    const currentRequest = ++routeRequestId.current;
    setSelectedShelter(shelter);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: {
          lat: Number(shelter.latitude),
          lng: Number(shelter.longitude)
        },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (currentRequest !== routeRequestId.current) return;

        if (status === "OK") {
          if (!directionsRendererRef.current && mapRef.current) {
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
            directionsRendererRef.current.setMap(mapRef.current);
          }

          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          }

          const route = result.routes[0].legs[0];
          setRouteInfo({
            shelterId: shelter.shelterId,
            distance: route.distance.text,
            duration: route.duration.text
          });
        } else {
          console.error("שגיאה בחישוב מסלול: ", status);
        }
      }
    );
  }, [userLocation]);

  // 6. חלון מידע (InfoWindow) - מופע יחיד, נפתח/נסגר בלבד
  const showInfo = (shelter, position) => {
    if (!mapRef.current) return;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    const content = `
      <div class="shelter-info-window">
        <h4>${shelter.shelterName}</h4>
        <p>${shelter.address}</p>
        <p>סוג: ${shelter.type}</p>
        <p>👍 ${shelter.likesCount}</p>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.setPosition(position);
    infoWindowRef.current.open(mapRef.current);
  };

  const hideInfo = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  // 7. ניקוי בעת עזיבת העמוד
  useEffect(() => {
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, []);

  // אייקונים למפה
  const userIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  const shelterIcon = "http://maps.google.com/mapfiles/ms/icons/red-pushpin.png";

  if (!isLoaded) return <div className="loading-screen">טוען מפה...</div>;

  return (
    <div className="map-page-container">
      <div className="sidebar">
        <button className="back-btn" onClick={() => navigate(-1)}>➔ חזרה לאזור האישי</button>
        <h2 className="sidebar-title">{visibleShelters.length} המיגוניות הקרובות אלייך</h2>

        {visibleShelters.map((shelter) => (
                   

          <div key={shelter.shelterId} onClick={() => calculateRoute(shelter)}
            className={`shelter-card ${selectedShelter?.shelterId === shelter.shelterId ? 'selected' : ''}`}>
            <h3 className="shelter-name">{shelter.shelterName}</h3>
            <p className="shelter-address">כתובת: {shelter.address}</p>
            <p className="shelter-distance">מרחק אווירי: {shelter.distanceText || "לא ידוע"}</p>

            {shelter.shelterId === routeInfo.shelterId && (
              <div className="route-live-info">
                <p>🚶 זמן הליכה: {routeInfo.duration}</p>
                <p>📍 מרחק במסלול: {routeInfo.distance}</p>
              </div>
            )}

            <div className="card-actions">
    

              <button className="details-btn" onClick={(e) => {
                e.stopPropagation();
                setExpandedShelter(expandedShelter === shelter.shelterId ? null : shelter.shelterId);
              }}>
                {expandedShelter === shelter.shelterId ? "פחות פרטים" : "פרטים נוספים"}
              </button>
            </div>

            {expandedShelter === shelter.shelterId && (
              <div className="extra-details">
                <p>סוג: {shelter.type}</p>
                <p>סטטוס: {shelter.status}</p>
                <p>נוספה ע"י: {shelter.createdByUserId}</p>
                <p>👍 {shelter.likesCount}</p>
              </div>
            )}
          </div>
        ))}

        {hasMore && (
          <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}>
            הצג עוד {Math.min(PAGE_SIZE, sortedShelters.length - visibleCount)} מיגוניות
          </button>
        )}
      </div>
      <div className="map-view">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={userLocation ? 16 : 14}
          center={userLocation || defaultCenter} onLoad={onMapLoad}>
          {userLocation && (
            <MarkerF position={userLocation} icon={{ url: userIcon }} />
          )}

          {visibleShelters.map(shelter => {
            const position = { lat: Number(shelter.latitude), lng: Number(shelter.longitude) };
            return (
              <MarkerF key={shelter.shelterId} position={position} onClick={() => calculateRoute(shelter)}
                onMouseOver={() => showInfo(shelter, position)} onMouseOut={hideInfo} icon={{ url: shelterIcon }}/>
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
}

export default MapShelters;