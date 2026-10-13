import React from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ButtonComponent from "./ButtonComponent";
import "../Style/CssPages/UserDashboard.css";

function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === `/dashboard/${id}`;
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.userName || "משתמש";

  const logout = () => {
    localStorage.removeItem("user");
    toast.success("יצאת בבטחה מחשבונך");
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.userId.toString() !== id) {
      toast.error("אין הרשאת גישה!!!");
      navigate(`/dashboard/${user.userId}`);
    }
  }, [id, user, navigate]);

  return (
    <div className="user-dashboard">

      {/* Header */}
      <header className="user-header">
        <h2>שלום {userName}</h2>
        <ButtonComponent text="התנתק" onClick={logout} />
      </header>
      {isHome && (
        <>
          {/* Title */}
          <div className="user-title">
            <h1>מערכת חיפוש מיגוניות</h1>
            <p>ברוך הבא לאזור האישי שלך</p>
          </div>

          {/* Buttons */}
          <div className="user-buttons">
            <div className="critical-button-container">
              <ButtonComponent text="חיפוש מיגונית קרובה" onClick={() => navigate("/map")} className="critical-btn" />
            </div>
            <ButtonComponent text="הוספת מיגונית" onClick={() => navigate("add-shelter")} />
            <ButtonComponent text="רשימת מקומות בטוחים" onClick={() => navigate("safe-places")} />
            <ButtonComponent text="פרופיל" onClick={() => navigate("profile")} />
            <ButtonComponent text="הבקשות שלי" onClick={() => navigate("my-requests")} />
                      <ButtonComponent text="צור קשר" onClick={() => navigate("contact")} />
              
            <ButtonComponent text="אתר צבע אדום" onClick={() => window.open("https://www.oref.org.il/", "_blank")} className="red-alert-btn" />
          </div>
        </>
      )}
      <div className="admin-content">
        <Outlet />
      </div>
      {/* Footer */}
      <footer className="user-footer">
        © 2026 מערכת מיגוניות
      </footer>

    </div>
  );
}

export default UserDashboard;