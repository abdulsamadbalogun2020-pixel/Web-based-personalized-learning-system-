// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if user is on a dashboard
  const isDashboard =
    location.pathname === "/studentdashboard" ||
    location.pathname === "/tutordashboard";

  // Determine if the user is logged in (e.g., by checking auth state or localStorage)
  const isLoggedIn = localStorage.getItem("userRole") !== null; // Adjust if needed

  // Get correct dashboard link based on user role
  const userRole = localStorage.getItem("userRole");
  const dashboardLink =
    userRole === "student" ? "/studentdashboard" : "/tutordashboard";

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        localStorage.removeItem("userRole"); // Clear stored role
        navigate("/"); // Redirect to home
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        Personalized Learning Platform Using AI-Powered Recommendations
      </div>
      <div className="navbar-links">
        {isLoggedIn && <Link to={dashboardLink}>Dashboard</Link>}
        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {isDashboard && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
