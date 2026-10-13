import { useEffect, useState } from "react";
import { GetItems, PutItems } from "../Service";
import { toast } from "react-toastify";


function AdminShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShelters = async () => {
    try {
      const data = await GetItems("shelters");
      console.log(data);

      setShelters(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, []);

  // אישור מיגונית
  const approveShelter = async (id) => {
    try {
      await PutItems(`shelters/${id}`, {
        status: "approved",
      });

      loadShelters(); // רענון
    } catch (err) {
      console.log(err);
      toast.error("שגיאה באישור מיגונית");
    }
  };


  const pending = shelters.filter((s) => s.status === "pending");
  const approved = shelters.filter((s) => s.status === "approved");
  const reject = shelters.filter((s) => s.status === "reject");
  console.log(pending, approved, reject);

  return (
    <div style={{ padding: "30px", direction: "rtl" }}>
      <h1>ניהול מיגוניות</h1>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <>
          <h2>ממתינות לאישור</h2>
          <table border="1" cellPadding="10" width="100%">
            <thead><tr>
              <th>כתובת</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s.shelterId}>
                  <td>{s.address}</td>
                  <td>pending</td>
                  <td><button onClick={() => approveShelter(s.shelterId)}
                    style={{ backgroundColor: "green", color: "white", padding: "5px 10px", }}>
                    אשר</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ marginTop: "40px" }}>מאושרות</h2>
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>כתובת</th>
                <th>סטטוס</th>
              </tr>
            </thead>

            <tbody>
              {approved.map((s) => (
                <tr key={s.shelterId}>
                  <td>{s.address}</td>
                  <td>approved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminShelters;