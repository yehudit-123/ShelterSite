import { toast } from "react-toastify";
import "../../Style/CssPages/Contact.css";


function SenderInfo({ message }) {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(message.senderEmail);
    toast.info("האימייל הועתק ללוח! 📋");
  };

  if (message.senderUserId) {
    return (
      <span className="user-badge מזוהה">
        👤 משתמש רשום (ID: {message.senderUserId}) - {message.senderName}
      </span>
    );
  }

  return (
    <div className="anonymous-sender">
      {message.senderEmail && (
        <div className="copyable-email-wrapper" onClick={handleCopyEmail}
          title="לחץ להעתקת אימייל לקליפבורד">
          <div className="copy-icon-css"></div>
          <span className="email-text">{message.senderEmail}</span>
        </div>
      )}
      <span className="user-badge אנונימי">🌐 פונה אנונימי: {message.senderName}</span>
    </div>
  );
}

export default SenderInfo;