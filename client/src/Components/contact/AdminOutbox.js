import { useEffect, useState } from "react";
import { GetItems } from "../../Service";
import "../../Style/CssPages/Contact.css";

function AdminOutbox() {
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentMessages();
  }, []);

  const fetchSentMessages = async () => {
    try {
      const data = await GetItems("messages/admin/sent");
      if (data) setSentMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">טוען...</p>;

  if (sentMessages.length === 0)
    return <p className="no-messages">לא נשלחו הודעות למשתמשים עדיין.</p>;

  return (
    <div className="messages-list">
      {sentMessages.map((msg) => (
        <div key={msg.messageId} className="message-card">
          <div className="message-header">
            <h3>{msg.subject}</h3>
            <span className="user-badge מזוהה">
              👤 נשלח אל: {msg.recipientName || `משתמש ${msg.recipientUserId}`}
            </span>
          </div>
          <p className="message-body">{msg.messageText}</p>
          {msg.userResponse ? (
            <div className="admin-response">
              <strong>תשובת המשתמש:</strong>
              <p>{msg.userResponse}</p>
            </div>
          ) : (
            <span className="status-badge pending">⏳ ממתין לתשובה</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminOutbox;