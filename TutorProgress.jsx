import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function TutorProgress() {
  const { user } = useAuth();
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.error("Tutor not logged in");
      setLoading(false);
      return;
    }

    const fetchTutorData = async () => {
      try {
        // Step 1: Fetch tutor's courses
        const coursesRef = collection(db, "courses");
        const tutorCoursesQuery = query(coursesRef, where("tutorId", "==", user.uid));
        const tutorCoursesSnapshot = await getDocs(tutorCoursesQuery);

        const tutorCourses = tutorCoursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Tutor's courses:", tutorCourses);

        if (tutorCourses.length === 0) {
          console.log("No courses found for this tutor.");
          setStudentProgress([]);
          setLoading(false);
          return;
        }

        const courseIds = tutorCourses.map((course) => course.id);

        // Step 2: Fetch all student progress and manually filter it
        const progressRef = collection(db, "progress");
        const studentProgressSnapshot = await getDocs(progressRef);

        const allProgress = studentProgressSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("All student progress:", allProgress);

        // Step 3: Filter progress only for courses uploaded by this tutor
        const filteredProgress = allProgress.filter((progress) =>
          courseIds.includes(progress.courseId)
        );

        console.log("Filtered progress for tutor:", filteredProgress);
        setStudentProgress(filteredProgress);
      } catch (error) {
        console.error("Error fetching student progress:", error);
      }
      setLoading(false);
    };

    fetchTutorData();
  }, [user]);

  if (loading) return <p>Loading student progress...</p>;

  return (
    <div>
      <h2>Student Progress for Your Courses</h2>
      {studentProgress.length > 0 ? (
        <ul>
          {studentProgress.map((progress) => (
            <li key={progress.id}>
              <h3>Student Email: {progress.studentEmail || "Unknown"}</h3>
              <p>Course Taken: {progress.courseTitle || "Unknown Course"}</p>
              <p>Skill Level: {progress.skillLevel || "Unknown"}</p>
              <p>Latest Score: {progress.latestScore}%</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No student progress found for your courses.</p>
      )}
    </div>
  );
}
