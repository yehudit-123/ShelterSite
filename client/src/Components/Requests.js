import { useEffect, useState } from "react";
import { GetItems, PutItems } from "../Service";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import { toast } from "react-toastify";
import "../Style/CssPages/Requests.css";


function Requests() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const getPendingShelters = async () => {
    try {
      const data = await GetItems("shelters/pending");

      setShelters(data);
      console.log(data);
      
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בטעינת הבקשות");
    } finally {
      setLoading(false);
    }
  };
const approveShelter = async (shelterId) => {
    try {
      await PutItems(`shelters/${shelterId}/approved`, {});
      toast.success("הבקשה אושרה");
      setShelters((prev) =>
        prev.filter((s) => s.shelterId !== shelterId)
      );
    } catch (error) {
      console.log(error);
      toast.error("שגיאה באישור הבקשה");
    }
  };

  const rejectShelter = async (shelterId) => {
    try {
      await PutItems(`shelters/${shelterId}/reject`);

      toast.success("הבקשה נדחתה");

      setShelters((prev) =>
        prev.filter((s) => s.shelterId !== shelterId)
      );
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בדחיית הבקשה");
    }
  };

  useEffect(() => {
    getPendingShelters();
  }, []);

  return (
    <div className="requests-page">
      <div className="requests-top-bar">
        <ButtonComponent text="חזור" onClick={() => navigate(`/admin-dashboard/${id}`)}/>
      </div>
      <h2 className="requests-title">בקשות ממתינות לאישור</h2>
      {loading ? (<p className="loading-text">טוען...</p>) : shelters.length === 0 ? (<p className="loading-text">אין בקשות ממתינות</p>
      ) : (
        <div className="requests-list">
          {shelters.map((shelter) => (<div key={shelter.shelterId} className="request-card">
              <div className="request-details">
                <h3>{shelter.shelterName}</h3>
                <p><strong>כתובת:</strong> {shelter.address}</p>
                <p><strong>סוג:</strong> {shelter.type}</p>
                <p><strong>יוצר הבקשה:</strong> {shelter.createdByUserId}</p>
                <p><strong>סטטוס:</strong> {shelter.status}</p>
              </div>
              <div className="request-actions">
                <ButtonComponent text="אישור" onClick={() =>approveShelter(shelter.shelterId)}/>
                <ButtonComponent text="דחייה" onClick={() =>rejectShelter(shelter.shelterId)}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;