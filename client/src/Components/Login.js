import { useState } from "react";
import "../Style/CssPages/Login.css";
import ButtonComponent from "./ButtonComponent";
import { PostItems } from "../Service";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await PostItems("users/login", {
        userName: username,
        passwordHash: password
      });
      if (response.success) {
        toast.success("התחברת בהצלחה!", { autoClose: 3000 });
        localStorage.setItem("user", JSON.stringify(response.user));
        const userID=response.user.userId;
        if (response.user.userRole === "admin") {
          navigate(`/admin-dashboard/${userID}`);
        } else {
          navigate(`/dashboard/${userID}`);
        }
      }
      else {
        alert(response.message);
      }

    } catch (error) {
      console.log(error);
      alert("שגיאה בשרת");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="back-button">
          <ButtonComponent text="← חזור לדף הבית" onClick={() => navigate("/")} />
        </div>
        <h2 className="login-title">התחברות</h2>
        <input type="text" placeholder="שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} required className="login-input"/>
        <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-input" />
        <button type="submit" className="login-button" > התחבר </button>
      </form>
    </div>
  );
}

export default Login;