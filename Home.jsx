import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homepage-hero fade-in">
      <h1>Welcome to the Personalized Learning Platform</h1>
      <p>
        Empower your learning journey at your own pace. Whether you’re a student aiming to sharpen your skills or a tutor sharing knowledge, this platform is tailored to you.
      </p>

      <div className="Homenavbtn">
        <a onClick={() => navigate("/signup")}>Get Started</a>
        <a onClick={() => navigate("/login")}>Login</a>
        <a onClick={() => navigate("/documentations")}>Help</a>
      </div>
    </div>
  );
}
