import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function StudentSearch() {
  const [searchKey, setSearchKey] = useState("");
  const [category, setCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewedCourse, setViewedCourse] = useState(null);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setCourses([]);
    try {
      let q = query(collection(db, "courses"));

      if (category) q = query(q, where("category", "==", category));
      if (skillLevel) q = query(q, where("skillLevel", "==", skillLevel));

      const querySnapshot = await getDocs(q);
      const filteredCourses = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((course) => course.courseTitle.toLowerCase().includes(searchKey.toLowerCase()));

      setCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  const handleViewCourse = (course) => {
    window.open(course.courseLink, "_blank");
    setViewedCourse(course);
    setShowFinishButton(false);
    setTimeout(() => setShowFinishButton(true), 5000);
  };

  const handleFinishCourse = () => {
    setShowFinishButton(false);
    navigate(`/quiz/${viewedCourse.id}`);
  };

  return (
    <div className="course-search-container"> {/* ✅ Added class for styling */}
      <h2>Search Courses</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Enter course title"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      
      <div className="filter-container">
        <div className="filter-group">
          <label>Category:</label>
          <input type="radio" name="category" value="maths" onChange={(e) => setCategory(e.target.value)} /> Maths
          <input type="radio" name="category" value="physics" onChange={(e) => setCategory(e.target.value)} /> Physics
          <input type="radio" name="category" value="programming" onChange={(e) => setCategory(e.target.value)} /> Programming
        </div>

        <div className="filter-group">
          <label>Skill Level:</label>
          <input type="radio" name="skillLevel" value="beginner" onChange={(e) => setSkillLevel(e.target.value)} /> Beginner
          <input type="radio" name="skillLevel" value="intermediate" onChange={(e) => setSkillLevel(e.target.value)} /> Intermediate
          <input type="radio" name="skillLevel" value="advanced" onChange={(e) => setSkillLevel(e.target.value)} /> Advanced
        </div>
      </div>

      <button className="custom-button" onClick={handleSearch}>Search</button>

      {loading ? <p>Loading...</p> : (
        <ul className="course-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course.id} className="course-item">
                <h3>{course.courseTitle}</h3>
                <button className="custom-button" onClick={() => handleViewCourse(course)}>View Course</button>
                {viewedCourse?.id === course.id && showFinishButton && (
                  <button className="custom-button" onClick={handleFinishCourse}>Take Quiz</button>
                )}
              </li>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </ul>
      )}
    </div>
  );
}
