import { useEffect, useState } from "react";
import { GetItems } from "../../Service";
import "../../Style/CssPages/Contact.css";

function UserMessagesPanel({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchMessages();
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const data = await GetItems(`messages/user/${userId}`);
      if (data) setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">טוען הודעות...</p>;
  if (messages.length === 0) return <p className="no-messages">אין הודעות עדיין.</p>;

  // הפרדה בין הודעות שהמשתמש שלח להודעות שקיבל מהמנהל
  const sent = messages.filter((m) => m.senderUserId === userId);
  const received = messages.filter((m) => m.recipientUserId === userId);

  return (
    <div className="admin-messages-container">
      {sent.length > 0 && (
        <>
          <h2 className="contact-title" style={{ fontSize: "1.2rem" }}>📤 הודעות ששלחתי</h2>
          <div className="messages-list">
            {sent.map((msg) => (
              <div key={msg.messageId} className="message-card">
                <div className="message-header">
                  <h3>{msg.subject}</h3>
                </div>
                <p className="message-body">{msg.messageText}</p>
                {msg.adminResponse ? (
                  <div className="admin-response">
                    <strong>תשובת המנהל:</strong>
                    <p>{msg.adminResponse}</p>
                  </div>
                ) : (
                  <span className="status-badge pending">⏳ ממתין לתשובה</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {received.length > 0 && (
        <>
          <h2 className="contact-title" style={{ fontSize: "1.2rem", marginTop: "2rem" }}>📥 הודעות שקיבלתי</h2>
          <div className="messages-list">
            {received.map((msg) => (
              <div key={msg.messageId} className="message-card">
                <div className="message-header">
                  <h3>{msg.subject}</h3>
                  <span className="user-badge מזוהה">💬 מהמנהל</span>
                </div>
                <p className="message-body">{msg.messageText}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UserMessagesPanel;