import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `http://complaint-portal-backend-production.up.railway.app/api/auth/forgot-password?email=${email}`
      );
      setMessage(res.data);
      setError('');
    } catch (err) {
      setError('Email not found! Please check your email.');
      setMessage('');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🏛️ Complaint Portal</h2>
        <h3 style={styles.subtitle}>Forgot Password</h3>
        <p style={styles.desc}>Enter your email — we will send you a reset link!</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={styles.link}>
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', color: '#1a73e8', marginBottom: '5px' },
  subtitle: { textAlign: 'center', color: '#555', marginBottom: '10px' },
  desc: { textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  success: { color: 'green', textAlign: 'center', fontSize: '14px' },
  error: { color: 'red', textAlign: 'center', fontSize: '14px' },
  link: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};

export default ForgotPassword;