import React from "react";
import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
import { toast } from "react-toastify";
import { PostItems } from "../Service";
import { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import "../Style/CssPages/AddShelter.css";


function AddShelter() {
  const navigate = useNavigate();
  const [shelterName, setShelterName] = useState("");
  const [shelterType, setShelterType] = useState("");
  const [city, setCity] = useState("");
  const [numBuild, setNumBuild] = useState("");
  const [street, setStreet] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.userRole === "admin"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !shelterName ||
      !city ||
      !street ||
      !numBuild ||
      !shelterType
    ) {
      toast.warning("יש למלא את כל השדות");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await PostItems("shelters", {
        shelterName,
        address: `${street} ${numBuild} ${city}`,
        type: shelterType,
        createdByUserId: user?.userId,
        status: isAdmin ? "approved" : "pending"
      });
      console.log(response);
      if (isAdmin) {
        toast.success("המיגונית נוספה בהצלחה");
      } else {
        toast.info("הבקשה נשלחה למנהל לאישור");
      }
      setShelterName("");
      setShelterType("");
      setCity("");
      setStreet("");
      setNumBuild("");
    } catch (err) {
      console.log(err);
      toast.error("שגיאה בשליחת הבקשה");
    }
  };
  return (

    <div className="add-shelter-container">
      <div className="add-shelter-buttons"><ButtonComponent text="חזור" onClick={() => navigate(-1)} /></div>
      <h2 className="add-shelter-title"> בקשת הוספת מיגונית</h2>
      <form className="add-shelter-form" onSubmit={handleSubmit}>
        <input placeholder="שם/ כינוי" value={shelterName} onChange={(e) => setShelterName(e.target.value)} />
        <br />
        <input placeholder="עיר" value={city} onChange={(e) => setCity(e.target.value)} />
        <br />
        <input placeholder="רחוב" value={street} onChange={(e) => setStreet(e.target.value)} />
        <br />
        <input placeholder="מספר" value={numBuild} onChange={(e) => setNumBuild(e.target.value)} />
        <br />
        <select value={shelterType} onChange={(e) => setShelterType(e.target.value)}>
          <option value="">בחר סוג מיגונית</option>
          <option value="Protective">מיגונית ציבורית</option>
          <option value="community">מרכז קהילתי</option>
          <option value="school">מקלט ביתי</option>
          <option value="shelter">מקלט ציבורי</option>
        </select>
        <button className="submit-btn" type="submit">שלח בקשה</button>
      </form>
    </div>
  );
}

export default AddShelter;
