import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Rule-Based AI Recommendation Logic
  function getAIRecommendation(skillLevel, latestScore) {
    if (latestScore < 50) {
      return `You scored ${latestScore}%. We recommend retaking the course for better understanding.`;
    } else if (latestScore >= 50 && latestScore < 70) {
      return `You scored ${latestScore}%. You should review key topics before moving to the next level.`;
    } else {
      return `You scored ${latestScore}%. Congratulations! You can proceed to a higher level.`;
    }
  }

  useEffect(() => {
    if (!user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        console.log("Fetching progress for student:", user.email);

        const progressRef = collection(db, "progress");
        const progressQuery = query(progressRef, where("studentEmail", "==", user.email));
        const progressSnapshot = await getDocs(progressQuery);

        if (progressSnapshot.empty) {
          console.warn("No progress found for this student.");
          setProgress([]);
          setLoading(false);
          return;
        }

        // Organize progress by courseId, keeping only the latest entry per course
        const latestProgressMap = new Map();

        progressSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const courseId = data.courseId;
          const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(); // Ensure it's a valid date

          // Store only the latest entry per course
          if (!latestProgressMap.has(courseId) || timestamp > latestProgressMap.get(courseId).timestamp) {
            latestProgressMap.set(courseId, { id: doc.id, ...data, timestamp });
          }
        });

        // Convert the map back to an array for rendering
        const latestProgress = Array.from(latestProgressMap.values()).sort((a, b) => b.timestamp - a.timestamp);
        console.log("✅ Filtered Student Progress Data:", latestProgress);
        setProgress(latestProgress);
      } catch (error) {
        console.error("❌ Error fetching student progress:", error);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  if (loading) return <p>Loading progress...</p>;

  return (
    <div>
      <h2>My Progress</h2>
      {progress.length > 0 ? (
        <ul>
          {progress.map((data) => {
            const aiRecommendation = getAIRecommendation(data.skillLevel, data.latestScore);

            return (
              <li key={data.id} className="progress-item">
                <h3>{data.courseTitle}</h3>
                <p>Skill Level: {data.skillLevel}</p>
                <p>Latest Score: {data.latestScore}%</p>
                <p>
                  Link To Course:{" "}
                  <a href={data.courseLink} target="_blank" rel="noopener noreferrer">
                    {data.courseTitle}
                  </a>
                </p>

                {/* AI Recommendation for this course */}
                <div className="ai-recommendation">
                  <h4>📌Recommendation</h4>
                  <p>{aiRecommendation}</p>
                </div>

                <button onClick={() => navigate("/student-search")}>Find More Courses</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No progress found.</p>
      )}
    </div>
  );
}
