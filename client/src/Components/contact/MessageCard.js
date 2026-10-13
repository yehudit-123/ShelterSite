import SenderInfo from "./SenderInfo";
import "../../Style/CssPages/Contact.css";
import ReplyBox from "./ReplyBox";

function MessageCard({ message, onReply }) {
  return (
    <div className="message-card">
      <div className="message-header">
        <h3>{message.subject}</h3>
        <SenderInfo message={message} />
      </div>

      <p className="message-body">{message.messageText}</p>

      {message.status === "answered" ? (
        <div className="admin-response">
          <strong>התגובה שנשלחה:</strong>
          <p>{message.adminResponse}</p>
        </div>
      ) : (
        message.senderUserId && (
          <ReplyBox messageId={message.messageId} onSubmit={onReply} />
        )
      )}
    </div>
  );
}

export default MessageCard;