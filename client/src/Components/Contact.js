import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import ContactForm from "./contact/ContactForm";
import AdminMessagesPanel from "./contact/AdminMessagesPanel";
import UserMessagesPanel from "./contact/UserMessagesPanel";
import "../Style/CssPages/Contact.css";

function Contact() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("write");

  return (
    <>
      <div className="back">
        <ButtonComponent text="חזור" onClick={() => navigate(-1)} />
      </div>

      {user?.userRole === "admin" ? (
        <AdminMessagesPanel />
      ) : (
        <>
          {user && (
            <div className="messages-tabs">
              <button
                className={`tab-btn ${activeTab === "write" ? "active" : ""}`}
                onClick={() => setActiveTab("write")}
              >
                ✉️ צור קשר
              </button>
              <button
                className={`tab-btn ${activeTab === "messages" ? "active" : ""}`}
                onClick={() => setActiveTab("messages")}>
                💬 ההודעות שלי
              </button>

            </div>
          )}
          {activeTab === "write" ? (
            <ContactForm user={user} />
          ) : (
            <UserMessagesPanel userId={user?.userId} />
          )}
        </>
      )}
    </>
  );
}

export default Contact;