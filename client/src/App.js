
// export default App;
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import Register from "./Components/Register";
import HomePage from "./Components/HomePage";
import MapShelters from "./Components/MapShelters";
import UserDashboard from "./Components/UserDashboard";
import EmergencyGuide from "./Components/EmergencyGuide";
import AllShelters from "./Components/AllShelters";
import AddShelter from "./Components/AddShelter";
import Requests from "./Components/Requests";
import AdminDashboard from "./Components/AdminDashboard";
import Profile from "./Components/Profile";
import ShowUser from "./Components/ShowUser";
// import AdminShelters from "./Components/AdminShelters";
import MyShelterRequests from "./Components/MyShelterRequests";
import SheltersMapOverview from "./Components/SheltersMapOverview";

function App() {
  return (
    <>
      <Routes>

        {/* public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapShelters />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/emergency" element={<EmergencyGuide />} />

        {/* USER */}
        <Route path="/dashboard/:id" element={<UserDashboard />}>
          <Route path="add-shelter" element={<AddShelter />} />
          <Route path="safe-places" element={<AllShelters />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contact" element={<Contact />} />
          <Route path="my-requests" element={<MyShelterRequests />} />
          <Route path="shelters-map" element={<SheltersMapOverview />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />}>
          {/* <Route path="shelters" element={<MapShelters />} /> */}
          <Route path="add-shelter" element={<AddShelter />} />
          <Route path="safe-places" element={<AllShelters />} />
          <Route path="contact" element={<Contact />} />
          <Route path="requests" element={<Requests />} />
          <Route path="users" element={<ShowUser />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />

    </>
  );
}

export default App;

//  <Routes>
//         {/* דף הבית */}
//         <Route path="/" element={<HomePage />} />
//         {/* דפי התחברות והרשמה */}
//         <Route path="/Login" element={<Login />} />
//         <Route path="/Register" element={<Register />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         {/* דף של כל המיגוניות */}
//         <Route path="/map" element={<MapShelters />} />
//         <Route path="/dashboard/:id" element={<UserDashboard />} />
//         <Route path="/emergency" element={<EmergencyGuide />} />
//         <Route path="/all-shelters" element={<AllShelters />} />
//         <Route path="/add-shelter" element={<AddShelter />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/admin-dashboard/:id" element={<AdminDashboard />}>
//           <Route path="/admin-dashboard/:id/show-user" element={<ShowUser />} />
//           <Route path="/admin-shelters" element={<AdminShelters />} />
//         </Route>
//         <Route path="/my-requests" element={<MyShelterRequests />} />

//       </Routes>