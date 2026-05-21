import React from "react";
import { useNavigate } from "react-router-dom";

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="documentation-container fade-in">
      <h1>📖 System Documentation</h1>

      <h2>1️⃣ Project Overview</h2>
      <p>
        The <b>Personalized Learning Platform</b> is a web-based educational tool designed to deliver tailored learning experiences. It evaluates student quiz performance and uses rule-based logic to guide learners on whether to revisit or advance through learning materials.
      </p>

      <h2>2️⃣ Features</h2>
      <ul>
        <li>🔹 Student and Tutor Authentication (Login & Signup)</li>
        <li>🔹 Course Search & Enrollment</li>
        <li>🔹 Objective-Based Quiz System</li>
        <li>🔹 Real-Time Student Progress Tracking</li>
        <li>🔹 Tutor Dashboard to Upload and Manage Courses</li>
        <li>🔹 Rule-Based Course Recommendations Based on Quiz Scores</li>
      </ul>

      <h2>3️⃣ Recommendation Logic</h2>
      <p>
        The system applies a simple rule-based model to recommend next steps after each quiz:
      </p>
      <ul>
        <li>🔸 <b>Score &lt; 50%:</b> Recommends retaking the course for better understanding.</li>
        <li>🔸 <b>Score 50–69%:</b> Suggests reviewing key concepts before moving forward.</li>
        <li>🔸 <b>Score ≥ 70%:</b> Allows the student to proceed to a more advanced course.</li>
      </ul>

      <h2>4️⃣ User Guide</h2>
      <h3>🔹 For Students</h3>
      <ul>
        <li>📌 Create an account or login.</li>
        <li>📌 Search for and enroll in available courses.</li>
        <li>📌 Study materials and take quizzes.</li>
        <li>📌 View your progress and receive personalized recommendations.</li>
      </ul>

      <h3>🔹 For Tutors</h3>
      <ul>
        <li>📌 Create an account or login.</li>
        <li>📌 Upload course materials and define quiz questions with answers.</li>
        <li>📌 Monitor student engagement and performance from your dashboard.</li>
      </ul>

      <button className="custom-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
