import { useEffect, useState } from "react";
import { GetItems, PostItems, DeleteItems } from "../Service";
import ButtonComponent from "./ButtonComponent";
import "../Style/CssPages/AllShelters.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// ✨ גוגל מפות במקום leaflet
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px"
};

function AllShelters() {
  const [shelters, setShelters] = useState([]);
  const [likedShelters, setLikedShelters] = useState(new Set());

  const [searchText, setSearchText] = useState("");
const [selectedType, setSelectedType] = useState("");
const [sortBy, setSortBy] = useState("");

  // סטייט לניהול תגובות
  const [activeCommentsShelterId, setActiveCommentsShelterId] = useState(null);
  const [reviews, setReviews] = useState({});

  // סטייט לניהול אזור הדיווח
  const [activeReportShelterId, setActiveReportShelterId] = useState(null);
  const [reportText, setReportText] = useState("");

  // סטייט לניהול הצגת המפה לפי shelterId קשורה
  const [activeMapShelterId, setActiveMapShelterId] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // מזהה המשתמש המחובר מה-URL

  // ✨ טעינת סקריפט גוגל מפות - id זהה ל-MapShelters כדי שהוא ייטען פעם אחת בלבד
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  //מדבר ואמר כמה מיגוניות נמצאו
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "he-IL";
    window.speechSynthesis.cancel(); // כדי שלא יצטברו קולות
    window.speechSynthesis.speak(msg);
  };
  useEffect(() => {
    loadShelters();
    loadUserLikes();
  }, []);
  useEffect(() => {
    if (shelters.length > 0) {
      speak(`נמצאו ${shelters.length} מיגוניות ברשימה`);
    }
  }, [shelters]);



  async function loadShelters() {
    try {
      const data = await GetItems("shelters");
      setShelters(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadUserLikes() {
    if (!id) return;
    try {
      const data = await GetItems(`likes/user/${id}`);
      const likedKeys = new Set(data.map(like => `${like.shelterType}_${like.shelterId}`));
      setLikedShelters(likedKeys);
    } catch (err) {
      console.log(err);
    }
  }

  const handleLike = async (shelter) => {
    if (!id) {
      toast.warning("יש להתחבר כדי לעשות לייק");
      return;
    }
    const likeKey = `${shelter.type}_${shelter.shelterId}`;
    try {
      const result = await PostItems(`likes/${shelter.shelterId}/${id}`, {});

      if (result.success) {
        if (result.action === "removed") {
          setLikedShelters(prev => { const next = new Set(prev); next.delete(likeKey); return next; });
          setShelters(prev => prev.map(s => s.shelterId === shelter.shelterId ? { ...s, likesCount: Math.max(0, (s.likesCount || 0) - 1) } : s));
        } else {
          setLikedShelters(prev => new Set(prev).add(likeKey));
          setShelters(prev => prev.map(s => s.shelterId === shelter.shelterId ? { ...s, likesCount: (s.likesCount || 0) + 1 } : s));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (shelterId) => {
    if (activeCommentsShelterId === shelterId) {
      setActiveCommentsShelterId(null);
      return;
    }
    try {
      const data = await GetItems(`reviews/shelter/${shelterId}`);
      setReviews(prev => ({ ...prev, [shelterId]: data }));
      setActiveCommentsShelterId(shelterId);
    } catch (err) {
      console.error("שגיאה בטעינת חוות דעת:", err);
    }
  };

  const handleReportClick = (shelterId) => {
    if (activeReportShelterId === shelterId) {
      setActiveReportShelterId(null);
      setReportText("");
    } else {
      if (!id) {
        toast.warning("יש להתחבר כדי לדווח על מיגונית");
        return;
      }
      setActiveReportShelterId(shelterId);
      setReportText("");
    }
  };

  const handleReportSubmit = async (shelterId) => {
    if (!reportText.trim()) {
      toast.warning("נא לכתוב פירוט קצר על הדיווח");
      return;
    }

    try {
      const reviewData = {
        userId: id,
        shelterId: shelterId,
        content: `${reportText}`
      };
      
      await PostItems("reviews", reviewData);
      toast.success("הדיווח נשלח בהצלחה ויועבר לטיפול המנהל!");

      const updatedData = await GetItems(`reviews/shelter/${shelterId}`);
      
      setReviews(prev => ({
        ...prev,
        [shelterId]: updatedData
      }));

      setActiveReportShelterId(null);
      setReportText("");
      setActiveCommentsShelterId(shelterId);

    } catch (err) {
      console.error("שגיאה בשליחת הדיווח:", err);
      toast.error("אירעה שגיאה בשליחת הדיווח.");
    }
  };

  const handleMapClick = (shelterId) => {
    if (activeMapShelterId === shelterId) {
      setActiveMapShelterId(null);
    } else {
      setActiveMapShelterId(shelterId);
    }
  };

  let filteredShelters = [...shelters];

// חיפוש לפי שם או כתובת
if (searchText) {
  filteredShelters = filteredShelters.filter(
    (shelter) =>
      shelter.shelterName?.toLowerCase().includes(searchText.toLowerCase()) ||
      shelter.address?.toLowerCase().includes(searchText.toLowerCase())
  );
}

// סינון לפי סוג
if (selectedType) {
  filteredShelters = filteredShelters.filter(
    (shelter) => shelter.type === selectedType
  );
}

// מיון לפי לייקים
if (sortBy === "likes") {
  filteredShelters.sort(
    (a, b) => (b.likesCount || 0) - (a.likesCount || 0)
  );
}

  return (
    <div className="all-shelters-page">
      <h1 className="page-title">רשימת מיגוניות</h1>
      <div className="filters-container">

  <input
    type="text"
    placeholder="חיפוש לפי שם או כתובת..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  <select
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
  >
    <option value="">כל הסוגים</option>
    <option value="מיגונית">מיגונית</option>
    <option value="מקלט">מקלט</option>
    <option value="מרחב מוגן">מרחב מוגן</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="">ללא מיון</option>
    <option value="likes">הכי אהובות ❤️</option>
  </select>

</div>
      <ButtonComponent text="← חזור לדף הבית" onClick={() => navigate(-1)} />
      <ButtonComponent text="לתצוגה במפה" onClick={() => navigate(`/dashboard/${id}/shelters-map`) } />
      <h1 className="page-title">רשימת מיגוניות</h1>
      <div className="shelters-grid">
      {filteredShelters.map((shelter) =>  {
          const liked = likedShelters.has(`${shelter.type}_${shelter.shelterId}`);
          const isCommentsOpen = activeCommentsShelterId === shelter.shelterId;
          const isReportOpen = activeReportShelterId === shelter.shelterId;
          const isMapOpen = activeMapShelterId === shelter.shelterId;
          const shelterReviews = reviews[shelter.shelterId] || [];

          const center = {
            lat: Number(shelter.latitude),
            lng: Number(shelter.longitude)
          };

          return (
            <div key={shelter.shelterId} className="shelter-card">
              <h2>{shelter.shelterName}</h2>
              <p><strong>כתובת:</strong><br />{shelter.address}</p>
              <p><strong>סוג:</strong> {shelter.type}</p>

              <div className="card-actions">
                <ButtonComponent text={liked ? `💙 ${shelter.likesCount}` : `👍 ${shelter.likesCount}`} onClick={() => handleLike(shelter)} />
                <ButtonComponent text={isCommentsOpen ? "❌ סגור תגובות" : "💬 חוות דעת"} onClick={() => handleComment(shelter.shelterId)} />
                <ButtonComponent text={isReportOpen ? "❌ ביטול" : "🚩 דיווח"} onClick={() => handleReportClick(shelter.shelterId)} />
                <ButtonComponent text={isMapOpen ? "❌ סגור מפה" : "🗺️ מפה"} onClick={() => handleMapClick(shelter.shelterId)} />
              </div>

              {/* אזור המפה - גוגל מפות */}
              {isMapOpen && shelter.latitude && shelter.longitude && (
                <div className="map-card-container">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={center}
                      zoom={16}
                    >
                      <MarkerF position={center} />
                    </GoogleMap>
                  ) : (
                    <p>טוען מפה...</p>
                  )}
                </div>
              )}

              {/* אזור כתיבת הדיווח */}
              {isReportOpen && (
                <div className="report-box-container">
                  <h4>דיווח על תקלה / בעיה במיגונית:</h4>
                  <textarea
                    className="report-textarea"
                    placeholder="תאר בקצר מה הבעיה (למשל: המיגונית נעולה, מלוכלכת, אין תאורה...)"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    rows={3}
                  />
                  <div className="report-box-actions">
                    <button className="submit-report-btn" onClick={() => handleReportSubmit(shelter.shelterId)}>
                      שלח דיווח לעירייה 🚀
                    </button>
                  </div>
                </div>
              )}

              {/* אזור רשימת הגלילה של חוות הדעת */}
              {isCommentsOpen && (
                <div className="reviews-dropdown-container">
                  <h4>חוות דעת מהתושבים:</h4>
                  {shelterReviews.length === 0 ? (
                    <p className="no-reviews">אין עדיין חוות דעת למיגונית זו.</p>
                  ) : (
                    <div className="reviews-scroll-list">
                      {shelterReviews.map((review) => (
                        <div key={review.reviewId} className="review-item">
                          <p className="review-content">{review.content}</p>
                          <small className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('he-IL')}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllShelters;