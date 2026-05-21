import { useState } from "react";
import { db } from "../firebase/firebaseConfig"; // Firestore
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

export default function TutorUpload() {
  const { user } = useAuth(); // Get logged-in tutor
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [courseLink, setCourseLink] = useState(""); // Store the external link
  const [quiz, setQuiz] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);

  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    if (field === "question") {
      updatedQuiz[index].question = value;
    } else if (field === "correctAnswer") {
      updatedQuiz[index].correctAnswer = value;
    } else {
      updatedQuiz[index].options[field] = value;
    }
    setQuiz(updatedQuiz);
  };

  const addQuizQuestion = () => {
    if (quiz.length < 5) {
      setQuiz([...quiz, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in as a tutor to upload a course.");
      return;
    }

    if (!courseTitle || !category || !skillLevel || !courseLink) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "courses"), {
        courseTitle,
        category,
        skillLevel,
        courseLink, // Store the external link
        quiz,
        tutorId: user.uid, // Attach the tutor's ID
        createdAt: new Date(),
      });

      alert("Course uploaded successfully!");
      setCourseTitle("");
      setCategory("");
      setSkillLevel("");
      setCourseLink("");
      setQuiz([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (error) {
      console.error("Error uploading course:", error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a New Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Course Title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="maths">Maths</option>
          <option value="physics">Physics</option>
          <option value="programming">Programming</option>
        </select>
        <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} required>
          <option value="">Select Skill Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* External Course Link */}
        <input type="url" placeholder="Course File Link (Google Drive, Dropbox, etc.)" value={courseLink} onChange={(e) => setCourseLink(e.target.value)} required />

        <h3>Quiz Questions</h3>
        {quiz.map((q, index) => (
          <div key={index} className="quiz-question">
            <input type="text" placeholder={`Question ${index + 1}`} value={q.question} onChange={(e) => handleQuizChange(index, "question", e.target.value)} required />
            {q.options.map((option, i) => (
              <input key={i} type="text" placeholder={`Option ${i + 1}`} value={option} onChange={(e) => handleQuizChange(index, i, e.target.value)} required />
            ))}
            <select value={q.correctAnswer} onChange={(e) => handleQuizChange(index, "correctAnswer", e.target.value)} required>
              <option value="">Select Correct Answer</option>
              {q.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        {quiz.length < 5 && <button className="custom-button" type="button" onClick={addQuizQuestion}>Add Question</button>}
        <button className="custom-button" type="submit">Upload Course</button>
      </form>
    </div>
  );
}
