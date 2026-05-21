import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setCourseData(courseSnap.data());
          setQuiz(courseSnap.data().quiz || []);
        } else {
          console.error("No such course!");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [courseId]);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleQuizSubmission = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const totalQuestions = quiz.length;
    const correctAnswers = quiz.filter(
      (q, index) => answers[index] === q.correctAnswer
    ).length;
    const latestScore = (correctAnswers / totalQuestions) * 100;

    console.log("Quiz Completed. Score:", latestScore);
    setScore(latestScore);
    setSubmitted(true);

    // 🔥 Save progress as a new document in "progress" collection
    try {
      await addDoc(collection(db, "progress"), {
        studentEmail: user.email,
        courseId: courseId, // 🔥 Ensure this is stored
        courseTitle: courseData?.courseTitle || "Unknown Course",
        skillLevel: courseData?.skillLevel || "N/A",
        latestScore,
        courseLink: courseData?.courseLink || "No Link"
      });

      console.log("✅ Progress saved successfully!");
    } catch (error) {
      console.error("❌ Error saving progress:", error);
    }
  };

  const handleRecommendation = (action) => {
    if (action === "retake") {
      navigate(`/student-search`);
    } else if (action === "next") {
      navigate("/student-progress");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div>
      <h2>Quiz</h2>
      {quiz.length > 0 ? (
        <form onSubmit={(e) => e.preventDefault()}>
          {quiz.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((option, optIndex) => (
                <label key={optIndex}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleOptionChange(index, option)}
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          {!submitted ? (
            <button type="button" onClick={handleQuizSubmission}>
              Submit Quiz
            </button>
          ) : (
            <div>
              <p>Your Score: {score}%</p>
              {score < 50 ? (
                <p>Strongly recommended to retake the course.</p>
              ) : score < 60 ? (
                <p>Recommended to retake the course.</p>
              ) : (
                <p>You can proceed to the next level.</p>
              )}
              <button className="custom-button" onClick={() => handleRecommendation("retake")}>
                Retake Course
              </button>
              {score >= 60 && (
                <button className="custom-button" onClick={() => handleRecommendation("next")}>
                  My Progress
                </button>
              )}
              <button className="custom-button" onClick={() => handleRecommendation("dashboard")}>
                Go to Dashboard
              </button>
            </div>
          )}
        </form>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
}
