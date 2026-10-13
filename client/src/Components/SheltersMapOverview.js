import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { GetItems } from "../Service";
import "../Style/CssPages/SheltersMapOverview.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = { lat: 31.3147, lng: 34.6203 }; // אופקים

const shelterIcon = "http://maps.google.com/mapfiles/ms/icons/red-pushpin.png";

function SheltersMapOverview() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [shelters, setShelters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    async function loadShelters() {
      try {
        const data = await GetItems("shelters");
        setShelters(data);
      } catch (err) {
        console.error("שגיאה בטעינת המיגוניות:", err);
      }
    }
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

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // הצגת חלון מידע - יוצרים מופע יחיד ומשתמשים בו תמיד
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

  // ניקוי בעת עזיבת העמוד
  useEffect(() => {
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, []);

  if (!isLoaded) return <div className="loading-screen">טוען מפה...</div>;

  return (
    <div className="shelters-map-page">
      <button className="back-btn shelters-map-back-btn" onClick={() => navigate(-1)}>
        ➔ חזרה
      </button>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={userLocation ? 13 : 11}
        center={userLocation || defaultCenter}
        onLoad={onMapLoad}
      >
        {shelters.map(shelter => {
          const position = {
            lat: Number(shelter.latitude),
            lng: Number(shelter.longitude)
          };

          return (
            <MarkerF
              key={shelter.shelterId}
              position={position}
              icon={{ url: shelterIcon }}
              onMouseOver={() => showInfo(shelter, position)}
              onMouseOut={hideInfo}
              onClick={() => showInfo(shelter, position)}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

export default SheltersMapOverview;