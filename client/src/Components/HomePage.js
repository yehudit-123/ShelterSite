import "../Style/CssPages/HomePage.css";
import ButtonComponent from "./ButtonComponent";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const safeLocation = "אופקים";
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-logo">מיגוניות</h1>
        <div className="header-buttons">
          <ButtonComponent text="התחברות" onClick={() => navigate("/Login")} className="header-button" />
          <ButtonComponent text="הרשמה" onClick={() => navigate("/Register")} className="header-button" />
        </div>
      </header>

      {/* אזור עיר מקלט */}
      <div className="safe-location">
        מציאת מקום בטוח ב:
        <span className="safe-city"> {safeLocation} </span>
      </div>

      {/* כפתורים מרכזיים */}
      <div className="main-buttons">
        <ButtonComponent text="צור קשר" onClick={() => navigate("/contact")} />
        <ButtonComponent text="אודותינו" onClick={() => navigate("/about")} />
        <ButtonComponent text="חיפוש מיגנות קרובה" onClick={() => navigate("/map")} />
        <ButtonComponent text="הנחיות חירום" onClick={() => navigate("/emergency")} />
      </div>

      {/* Footer */}
      <footer className="home-footer">
        © 2026 מיגוניות אופקים
      </footer>

    </div>
  );
}

export default HomePage;