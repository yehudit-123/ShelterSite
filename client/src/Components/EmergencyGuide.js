import "../Style/CssPages/EmergencyGuide.css";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";

function EmergencyGuide() {
    const navigate = useNavigate();
  
  return (
    <div className="emergency-container">
      <div className="emergency-box">
        <ButtonComponent text="חזור" onClick={() => navigate(-1)}/>

        <h1 className="emergency-title">
          הנחיות חירום ובטיחות
        </h1>

        <h2 className="emergency-subtitle">🚨 מה עושים בזמן אזעקה?</h2>
        <ul className="emergency-list">
          <li>נכנסים מיד למרחב מוגן הקרוב</li>
          <li>נשארים שם לפחות 10 דקות</li>
          <li>לא יוצאים עד הודעה רשמית</li>
        </ul>

        <h2 className="emergency-subtitle">⏱️ כמה זמן יש להגיע?</h2>
        <p className="emergency-text">
          ברוב האזורים יש כ־<b>30 עד 90 שניות</b> להגיע למיגונית,
          תלוי במרחק ובמצב ההתרעה.
        </p>

        <h2 className="emergency-subtitle">⚠️ כללי בטיחות חשובים</h2>
        <ul className="emergency-list">
          <li>לא להשתמש במעלית בזמן אזעקה</li>
          <li>להתרחק מחלונות ודלתות זכוכית</li>
          <li>לשמור על רוגע ולא להיכנס לפאניקה</li>
          <li>לעזור לילדים וקשישים להגיע למיגון</li>
        </ul>

        <div className="emergency-highlight">
          💡 חשוב לזכור: מיגונית קרובה יכולה להציל חיים
        </div>

      </div>
    </div>
  );
}

export default EmergencyGuide;