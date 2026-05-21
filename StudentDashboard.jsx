import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Welcome, Student!</h2>

      {/* Button to navigate to Search Course Page */}
      <button className="custom-button" onClick={() => navigate("/student-search")}>
        Search Course
      </button>

      {/* Button to navigate to Student Progress Page */}
      <button className="custom-button" onClick={() => navigate("/student-progress")}>
        My progress
      </button>
    </div>
  );
}
