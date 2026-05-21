import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, "courses");
        const tutorQuery = query(coursesRef, where("tutorId", "==", user.uid));
        const snapshot = await getDocs(tutorQuery);

        if (!snapshot.empty) {
          setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching tutor courses:", error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [user]);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteDoc(doc(db, "courses", courseId));
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      alert("Course deleted successfully.");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course.");
    }
  };

  if (loading) return <p>Loading your courses...</p>;

  return (
    <div className="manage-courses-container">
      <h2>📚 Manage Your Courses</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h3>{course.courseTitle}</h3>
              <p>Category: {course.category}</p>
              <p>Skill Level: {course.skillLevel}</p>
              <button className="delete-button" onClick={() => handleDelete(course.id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses uploaded yet.</p>
      )}

      <button className="custom-button" onClick={() => navigate("/tutor-dashboard")}>Back to Dashboard</button>
    </div>
  );
}
