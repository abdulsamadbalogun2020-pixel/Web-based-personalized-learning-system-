import React from 'react';
import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentSearch from "./components/StudentSearch";
import StudentProgress from "./components/StudentProgress";
import TutorProgress from "./components/TutorProgress";
import SignUp from "./pages/SignUp";
import Login from "./pages/login";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import TutorUpload from './pages/TutorUpload';
import Documentation from './pages/Documentation';
import ManageCourses from "./pages/ManageCourses";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './index.css'; // Import your custom CSS

function App() {
  return (
    <div className="app-container">
      <nav className="navbtn">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/documentations">Help</Link>
      </nav>

      <div className="content-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/documentations" element={<Documentation />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/upload-course" element={<TutorUpload />} />
          <Route path="/student-search" element={<StudentSearch />} />
          <Route path="/quiz/:courseId" element={<QuizPage />} />
          <Route path="/student-progress" element={<StudentProgress />} />
          <Route path="/tutor-progress" element={<TutorProgress />} />
          <Route path="/manage-courses" element={<ManageCourses />} />

          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


