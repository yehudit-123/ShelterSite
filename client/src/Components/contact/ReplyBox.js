import { useState } from "react";
import { toast } from "react-toastify";
import "../../Style/CssPages/Contact.css";


function ReplyBox({ messageId, onSubmit }) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (!replyText.trim()) {
      toast.warn("אנא כתוב תוכן לתגובה");
      return;
    }
    onSubmit(messageId, replyText);
    setReplyText("");
  };

  return (
    <div className="reply-section">
      <textarea
        placeholder="כתוב תגובה לפונה..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="reply-textarea"
      />
      <button onClick={handleSubmit} className="reply-button">
        שלח תגובה
      </button>
    </div>
  );
}

export default ReplyBox;