import React from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ButtonComponent from "./ButtonComponent";
import "../Style/CssPages/AdminDashboard.css";

function AdminDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === `/admin-dashboard/${id}`;
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.userName || "מנהל";

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
      toast.warning("אין הרשאת גישה!!!");
      navigate(`/admin-dashboard/${user.userId}`);
    }
  }, [id, user, navigate]);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>שלום {userName}</h2>
        <div className="logout-btn">
          <ButtonComponent text="התנתק" onClick={logout} />
        </div>
      </header>
      {isHome && (
        <>
          <div className="admin-title">
            <h1>אזור מנהל</h1>
            <p>ניהול מערכת המיגוניות</p>
          </div>

          <div className="admin-buttons">
            <div className="dashboard-btn">
              <ButtonComponent text="חיפוש מיגונית קרובה" onClick={() => navigate("/map")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="רשימת מקומות בטוחים" onClick={() => navigate("safe-places")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="הוספת מיגונית" onClick={() => navigate("add-shelter")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="כל הבקשות" onClick={() => navigate("requests")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="כל ההודעות" onClick={() => navigate("contact")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="ניהול משתמשים" onClick={() => navigate("users")} />
            </div>
            <div className="dashboard-btn">
              <ButtonComponent text="פרופיל" onClick={() => navigate("profile")} />
            </div>
          </div>
        </>
      )}

      <div className="admin-content">
        <Outlet />
      </div>

      <footer className="admin-footer">
        © 2026 מערכת מיגוניות
      </footer>
    </div>
  );
}

export default AdminDashboard;