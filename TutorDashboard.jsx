import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const TutorDashboard = () => {
  const navigate = useNavigate(); 
  return (
    <div className="dashboard-container">
      <h2>Welcome, Tutor!</h2>
      <p>Manage your courses and track student performance.</p>
      <button className='custom-button' onClick={() => navigate("/upload-course")}>Upload Course</button>
      <button className='custom-button' onClick={() => navigate("/tutor-progress")}>Student Progress</button>
      <button className="custom-button" onClick={() => navigate("/manage-courses")}>Manage Courses</button>

    </div>
  );
};

export default TutorDashboard;
