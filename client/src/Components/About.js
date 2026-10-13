import "../Style/CssPages/About.css";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
function About() {
  const navigate = useNavigate();
  
  return (
    <div className="about-container">

      <div className="about-box">
                                        <ButtonComponent text="חזור" onClick={() => navigate(-1)}/>

        <h1 className="about-title">אודות</h1>

        <p className="about-text">
          מערכת המיגוניות נועדה לעזור לתושבים למצוא מרחב מוגן במהירות ובקלות.
          המטרה שלנו היא להנגיש מידע חשוב בזמן אמת ולשמור על ביטחון המשתמשים.
        </p>

        <p className="about-subtext">
          הפרויקט פותח כחלק ממערכת חכמה למציאת מיגון קרוב בכל רגע נתון.
        </p>
      </div>
    </div>
  );
}

export default About;