import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetItems } from "../Service";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import "../Style/CssPages/MyShelterRequests.css";


function MyShelterRequests() {
  const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const getSheltersById = useCallback(async () => {
    try {
      const data = await GetItems(`shelters/${id}`);
      setRequests(data);
    } catch (error) {
      console.log(error);
      toast.error("שגיאה בטעינת הבקשות");
    }
  }, [id]);
  useEffect(() => {
    getSheltersById();
    setLoading(false);
  }, [id, user, getSheltersById]);

  return (
    <div className="page">
            <div className="back"><ButtonComponent text="חזור" onClick={() => navigate(-1)} /></div>

      <h2 className="title">הבקשות שלי</h2>

      {loading ? (
        <p>טוען...</p>
      ) : requests.length === 0 ? (
        <p>אין לך בקשות עדיין</p>
      ) : (
        <div className="table">
          {requests.map((r) => (
            <div key={r.shelterId} className="row">
              <div className="box">{r.shelterName}</div>
              <div className="box">{r.address}</div>

              <div
                className={`status ${r.status === "pending"
                    ? "yellow"
                    : r.status === "reject"
                      ? "red"
                      : "green"
                  }`}
              >
                {r.status === "pending"
                  ? "ממתין לאישור🟡"
                  : r.status === "reject"
                    ? "סורב ❌"
                    : "מאושר 🟢"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyShelterRequests;