import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // User selects Student or Tutor
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,

  
      });

      alert('Registration successful!');
      navigate('/login'); // Redirect to login after successful registration

     
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is registered. Please log in.');
      } else {
        alert(`Sign-up failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="radio"
            value="student"
            checked={userType === 'student'}
            onChange={() => setUserType('student')}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="tutor"
            checked={userType === 'tutor'}
            onChange={() => setUserType('tutor')}
          />
          Tutor
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
