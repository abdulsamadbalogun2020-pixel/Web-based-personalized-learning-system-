import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading while logging in

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optimized: Fetch user role without delay
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData && userData.userType) {
        alert('Login successful!');
        navigate(userData.userType === 'student' ? '/student-dashboard' : '/tutor-dashboard');
      } else {
        alert('User data not found.');
      }
    } catch (error) {
      const errorMessage =
        error.code === 'auth/user-not-found'
          ? 'No user found with this email.'
          : error.code === 'auth/wrong-password'
          ? 'Incorrect password.'
          : `Login failed: ${error.message}`;
      alert(errorMessage);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
