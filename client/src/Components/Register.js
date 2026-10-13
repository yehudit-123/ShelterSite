import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PostItems } from "../Service";
import "../Style/CssPages/Register.css";
import ButtonComponent from "./ButtonComponent";

function Register() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userName || !email || !phone || !password) {
      toast.warning("יש למלא את כל השדות");
      return;
    }
    try {
      const response = await PostItems("users/register", {
        userName,
        email,
        phone,
        passwordHash: password,
        userRole: "user"
      });

      if (response) {
        toast.success("נרשמת בהצלחה!");
        localStorage.setItem("user", JSON.stringify(response.user));
        const userID = response.user.userId;
        navigate(`/dashboard/${userID}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בהרשמה");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="back-button">
          <ButtonComponent text="← חזור לדף הבית" onClick={() => navigate("/")} />
        </div>
        <h2 className="register-title">הרשמה</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <input type="text" placeholder="שם משתמש" value={userName} onChange={(e) => setUserName(e.target.value)} className="register-input" />
          <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className="register-input" />
          <input type="text" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} className="register-input" />
          <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} className="register-input" />
          <button type="submit" className="register-button">הירשם</button>
        </form>
      </div>
    </div>
  );
}

export default Register;