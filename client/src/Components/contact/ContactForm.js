import { useState } from "react";
import { PostItems } from "../../Service";
import { toast } from "react-toastify";
import "../../Style/CssPages/Contact.css";


function ContactForm({ user }) {
  const [name, setName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !messageText.trim()) {
      toast.warn("אנא מלא את כל השדות לפני השליחה");
      return;
    }

    const response = await PostItems("messages", {
      senderUserId: user?.userId || null,
      senderName: name,
      senderEmail: email,
      subject,
      messageText
    });

    if (response) {
      toast.success("ההודעה נשלחה בהצלחה");
      setSubject("");
      setMessageText("");
    }
  };

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSend}>
        <h1 className="contact-title">צור קשר</h1>
        <input type="text" placeholder="שם מלא" value={name}
          onChange={(e) => setName(e.target.value)} className="contact-input" required />
        <input type="email" placeholder="אימייל" value={email}
          onChange={(e) => setEmail(e.target.value)} className="contact-input" required />
        <input type="text" placeholder="נושא הפנייה" value={subject}
          onChange={(e) => setSubject(e.target.value)} className="contact-input" required />
        <textarea placeholder="כתוב הודעה..." value={messageText}
          onChange={(e) => setMessageText(e.target.value)} className="contact-textarea" required />
        <button type="submit" className="contact-button">שלח הודעה</button>
      </form>
    </div>
  );
}

export default ContactForm;