import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${newPassword}`
      );
      setMessage(res.data);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Invalid or expired token!');
      setMessage('');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🏛️ Complaint Portal</h2>
        <h3 style={styles.subtitle}>Reset Password</h3>

        {message && <p style={styles.success}>{message} Redirecting to login...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', color: '#1a73e8', marginBottom: '5px' },
  subtitle: { textAlign: 'center', color: '#555', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  success: { color: 'green', textAlign: 'center', fontSize: '14px' },
  error: { color: 'red', textAlign: 'center', fontSize: '14px' }
};

export default ResetPassword;