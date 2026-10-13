import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetItems, DeleteItems, PostItems, PutItems } from "../Service";
import ButtonComponent from "./ButtonComponent";
import { toast } from "react-toastify";
import "../Style/CssPages/ShowUser.css";

function ShowUser() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState(null);
  const [editRole, setEditRole] = useState("user");

  // ── הודעה למשתמש ──
  const [messageTargetUser, setMessageTargetUser] = useState(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const getUsers = async () => {
    try {
      const data = await GetItems("users");
      setUsers(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await DeleteItems(`users/${userId}`);
      if (response) {
        toast.success("המשתמש נמחק בהצלחה");
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
      }
    } catch (error) {
      console.log(error);
      toast.error("שגיאה במחיקת משתמש");
    }
  };

  const addUser = async () => {
    try {
      if (!userName || !email || !phone || !password) {
        toast.warning("יש למלא את כל השדות");
        return;
      }
      const response = await PostItems("users/addUser", {
        userName, email, phone, passwordHash: password, userRole
      });
      if (response) {
        toast.success("המשתמש נוסף בהצלחה");
        setUserName(""); setEmail(""); setPhone(""); setPassword(""); setUserRole("user");
        setShowAddUser(false);
        getUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בהוספת משתמש");
    }
  };

  const updateUser = async () => {
    try {
      if (!editingUserId || !editUserName || !editEmail || !editPhone || !editRole) {
        toast.warning("יש למלא את כל השדות");
        return;
      }
      const response = await PutItems(`users/update/${editingUserId}`, {
        userName: editUserName, email: editEmail, phone: editPhone,
        passwordHash: editPassword, userRole: editRole
      });
      if (response) {
        toast.success("המשתמש עודכן בהצלחה");
        setEditingUserId(null); setEditUserName(""); setEditEmail("");
        setEditPhone(""); setEditPassword(null); setEditRole("user");
        setShowAddUser(false);
        getUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בעריכת פרטי משתמש");
    }
  };

  // ── שליחת הודעה מהמנהל למשתמש ──
  const sendMessageToUser = async () => {
    if (!messageSubject.trim() || !messageText.trim()) {
      toast.warning("יש למלא נושא ותוכן הודעה");
      return;
    }
    try {
      const response = await PostItems("messages/to-user", {
        recipientUserId: messageTargetUser.userId,
        subject: messageSubject,
        messageText
      });
      if (response) {
        toast.success("ההודעה נשלחה בהצלחה");
        setMessageTargetUser(null);
        setMessageSubject("");
        setMessageText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בשליחת ההודעה");
    }
  };

  useEffect(() => { getUsers(); }, []);

  return (
    <div className="users-page">
      <div className="users-top-bar">
        <ButtonComponent text="חזור" onClick={() => navigate(`/admin-dashboard/${id}`)} />
        <ButtonComponent text="הוספת משתמש" onClick={() => setShowAddUser(!showAddUser)} />
      </div>

      {showAddUser && (
        <div className="add-user-form">
          <h3>הוספת משתמש חדש</h3>
          <input type="text" placeholder="שם משתמש" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="מספר טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
            <option value="user">משתמש</option>
            <option value="admin">מנהל</option>
          </select>
          <ButtonComponent text="שמור" onClick={addUser} />
        </div>
      )}

      <h2 className="users-title">ניהול משתמשים</h2>

      {loading ? (
        <p className="loading-text">טוען...</p>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user.userId} className="user-card">
              {editingUserId === user.userId ? (
                <div className="edit-user-form">
                  <h3>עריכת משתמש</h3>
                  <input value={editUserName} onChange={(e) => setEditUserName(e.target.value)} />
                  <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                  <input type="password" placeholder="סיסמה חדשה (לא חובה)" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                    <option value="user">משתמש</option>
                    <option value="admin">מנהל</option>
                  </select>
                  <div className="edit-buttons">
                    <ButtonComponent text="שמור" onClick={updateUser} />
                    <ButtonComponent text="ביטול" onClick={() => setEditingUserId(null)} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="user-details">
                    <h3>{user.userName}</h3>
                    <p><strong>מזהה:</strong> {user.userId}</p>
                    <p><strong>תפקיד:</strong>{" "}{user.userRole === "admin" ? "מנהל" : "משתמש"}</p>
                  </div>
                  <div className="user-actions">
                    {/* ── כפתור שלח הודעה מחובר ── */}
                    <ButtonComponent text="שלח הודעה" onClick={() => setMessageTargetUser(user)} />
                    {user.userRole !== "admin" && (
                      <>
                        <ButtonComponent text="עריכה" onClick={() => {
                          setEditingUserId(user.userId);
                          setEditUserName(user.userName);
                          setEditEmail(user.email || "");
                          setEditPhone(user.phone || "");
                          setEditRole(user.userRole);
                        }} />
                        <ButtonComponent text="מחיקה" onClick={() => deleteUser(user.userId)} />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── מודל שליחת הודעה ── */}
      {messageTargetUser && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <h3>שלח הודעה ל-{messageTargetUser.userName}</h3>
            <input
              type="text"
              placeholder="נושא"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
            />
            <textarea
              placeholder="תוכן ההודעה"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="modal-buttons">
              <ButtonComponent text="שלח" onClick={sendMessageToUser} />
              <ButtonComponent text="ביטול" onClick={() => {
                setMessageTargetUser(null);
                setMessageSubject("");
                setMessageText("");
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowUser;