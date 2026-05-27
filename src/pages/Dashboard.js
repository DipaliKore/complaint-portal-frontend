import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyComplaints } from '../services/api';
import axios from 'axios';

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchText, filterStatus, complaints]);

  const loadComplaints = async () => {
    try {
      const res = await getMyComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;
    if (searchText) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchText.toLowerCase()) ||
        c.category.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    setFilteredComplaints(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      if (file) formData.append('file', file);

      await axios.post('https://complaint-portal-backend-production-5195.up.railway.app/api/complaints/submit', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Complaint submitted successfully!');
      setMessageColor('green');
      setTitle(''); setDescription(''); setCategory(''); setFile(null);
      loadComplaints();
    } catch (err) {
      setMessage('Error submitting complaint!');
      setMessageColor('red');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (status === 'PENDING') return '#ff9800';
    if (status === 'IN_PROGRESS') return '#1a73e8';
    if (status === 'RESOLVED') return '#28a745';
    return '#000';
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🏛️ Complaint Portal</h2>
        <div>
          <span style={styles.emailText}>{email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Left - Submit Form */}
        <div style={styles.card}>
          <h3>📝 New Complaint</h3>
          {message && <p style={{ color: messageColor, textAlign: 'center' }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              style={styles.textarea}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <select
              style={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>

            <div style={styles.fileBox}>
              <label style={styles.fileLabel}>📎 Attach Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />
              {file && <p style={styles.fileName}>✅ {file.name}</p>}
            </div>

            <button style={styles.button} type="submit">Submit Complaint</button>
          </form>
        </div>

        {/* Right - Complaints List */}
        <div style={styles.card}>
          <h3>📋 My Complaints ({filteredComplaints.length})</h3>

          {/* Search & Filter */}
          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="🔍 Search complaints..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              style={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {filteredComplaints.length === 0 ? (
            <p style={styles.noData}>No complaints found!</p>
          ) : (
            filteredComplaints.map((c) => (
              <div key={c.id} style={styles.complaintCard}>
                <div style={styles.complaintHeader}>
                  <strong>{c.title}</strong>
                  <span style={{ ...styles.status, backgroundColor: getStatusColor(c.status) }}>
                    {c.status}
                  </span>
                </div>
                <p style={styles.complaintDesc}>{c.description}</p>
                {c.filePath && (
                  <img
                    src={`http://localhost:8080/uploads/${c.filePath}`}
                    alt="complaint"
                    style={styles.image}
                  />
                )}
                <small style={styles.complaintMeta}>
                  📁 {c.category} | 📅 {new Date(c.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh' },
  navbar: { backgroundColor: '#1a73e8', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', margin: 0 },
  emailText: { color: 'white', marginRight: '15px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'white', color: '#1a73e8', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', height: '100px' },
  fileBox: { margin: '10px 0', padding: '15px', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center' },
  fileLabel: { display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' },
  fileInput: { cursor: 'pointer' },
  fileName: { color: 'green', marginTop: '8px', fontSize: '13px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  searchRow: { display: 'flex', gap: '10px', marginBottom: '15px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  filterSelect: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer' },
  complaintCard: { border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px' },
  complaintHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  status: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  complaintDesc: { color: '#555', fontSize: '14px', margin: '5px 0' },
  complaintMeta: { color: '#999' },
  image: { width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', margin: '8px 0' },
  noData: { color: '#999', textAlign: 'center', padding: '20px' }
};

export default Dashboard;