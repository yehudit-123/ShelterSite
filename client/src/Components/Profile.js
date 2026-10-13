import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetItems } from "../Service";
import ButtonComponent from "./ButtonComponent";
import { toast } from "react-toastify";
import { useCallback } from "react";
import "../Style/CssPages/Profile.css";
import { PutItems } from "../Service";

function Profile() {
  const [myShelters, setMyShelters] = useState([]);
  const [amountRequest, setAmountRequest] = useState(0);
  const [amountShelters, setAmountShelters] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
const [editUserName, setEditUserName] = useState(user?.userName || "");
const [editEmail, setEditEmail] = useState(user?.email || "");

const updateUser = async () => {
  try {
    // 1. יצירת אובייקט המשתמש המעודכן המלא
    const updatedUser = {
      ...user,
      userName: editUserName,
      email: editEmail
    };
    const response = await PutItems(`users/update/${user.userId}`, updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success("הפרטים עודכנו בהצלחה");
  } catch (error) {
    console.log(error);
    toast.error("שגיאה בעדכון המשתמש");
  }
};

  const getSheltersById = useCallback(async () => {
    try {
      const data = await GetItems(`shelters/${id}`);
      setMyShelters(data);
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בטעינת הבקשות");
    }
  }, [id]);

  useEffect(() => {
    getSheltersById();
  }, [id, user, getSheltersById]);

  useEffect(() => {
    setAmountRequest(myShelters.length);
    setAmountShelters(myShelters.filter(shelter => shelter.status === "approved").length);
  }, [myShelters]);

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <h1>הפרופיל שלי</h1>
      </header>
      {/* Profile Card */}
      <div className="profile-card">
        <h2 className="profile-name">
          👤 {user?.userName}
        </h2>
        <hr />
        {isEditing ? (
  <div className="edit-user-form">
    <h3>עריכת פרטים</h3>

    <input
      type="text"
      value={editUserName}
      onChange={(e) => setEditUserName(e.target.value)}
      placeholder="שם משתמש"
    />

    <input
      type="email"
      value={editEmail}
      onChange={(e) => setEditEmail(e.target.value)}
      placeholder="אימייל"
    />

    <div className="edit-buttons">
      <ButtonComponent text="שמור" onClick={updateUser} />
      <ButtonComponent
        text="ביטול"
        onClick={() => setIsEditing(false)}
      />
    </div>
  </div>
) : (
  <>
    <p><strong>מזהה משתמש:</strong> {user?.userId}</p>
    <p><strong>שם משתמש:</strong> {user?.userName}</p>
    <p><strong>אימייל:</strong> {user?.email}</p>

    <ButtonComponent
      text="ערוך פרטים"
      onClick={() => {
        setEditUserName(user?.userName);
        setEditEmail(user?.email);
        setIsEditing(true);
      }}
    />
  </>
)}
        <hr />
        <p><strong>מספר בקשות:</strong> {amountRequest}</p>
        <p><strong>מספר מיגוניות שהוספתי:</strong> {amountShelters}</p>

        <div className="profile-buttons">
          <ButtonComponent text="חזרה לדשבורד" onClick={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
}

export default Profile;