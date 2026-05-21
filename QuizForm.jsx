import { db, auth } from "../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function QuizForm({ quizData, courseId, navigate }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let correctAnswers = 0;
    quizData.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quizData.length) * 100;
    setScore(finalScore);

    // Store progress in Firestore
    try {
      const user = auth.currentUser;
      if (user) {
        const progressRef = doc(db, "progress", user.uid);
        await updateDoc(progressRef, {
          courses: arrayUnion({
            courseId,
            score: finalScore,
            timestamp: new Date(),
          }),
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {quizData.map((question, index) => (
          <div key={index}>
            <p>{question.text}</p>
            {question.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleChange(index, option)}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>

      {score !== null && (
        <div>
          <p>Your score: {score}%</p>
          {score < 50 ? <p>Strongly recommended to retake the course.</p> : 
           score < 60 ? <p>Recommended to review the course.</p> : 
           <p>You can proceed to the next level.</p>}
          <button onClick={() => navigate(`/courses/${courseId}`)}>Retake Course</button>
          {score >= 60 && <button onClick={() => navigate("/next-courses")}>Proceed</button>}
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
