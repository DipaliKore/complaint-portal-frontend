import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, updateStatus } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      loadComplaints();
    } catch (err) {
      console.error(err);
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

  const pending = complaints.filter(c => c.status === 'PENDING').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  const pieData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ];

  const categoryData = complaints.reduce((acc, c) => {
    const found = acc.find(item => item.category === c.category);
    if (found) found.count++;
    else acc.push({ category: c.category, count: 1 });
    return acc;
  }, []);

  const COLORS = ['#ff9800', '#1a73e8', '#28a745'];

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(26, 115, 232);
    doc.text('Complaint Portal - Report', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    // Stats
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Summary Statistics', 14, 45);

    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text(`Total Complaints: ${complaints.length}`, 14, 55);
    doc.text(`Pending: ${pending}`, 14, 63);
    doc.text(`In Progress: ${inProgress}`, 80, 63);
    doc.text(`Resolved: ${resolved}`, 150, 63);

    // Table
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Complaint Details', 14, 78);

    autoTable(doc, {
      startY: 83,
      head: [['ID', 'Title', 'Category', 'User', 'Status', 'Date']],
      body: complaints.map(c => [
        c.id,
        c.title,
        c.category,
        c.userName,
        c.status,
        new Date(c.createdAt).toLocaleDateString()
      ]),
      headStyles: { fillColor: [26, 115, 232], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 242, 245] },
      styles: { fontSize: 10 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('Complaint Portal - Confidential Report', 14, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, 195, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    doc.save('complaint-report.pdf');
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🏛️ Admin Dashboard</h2>
        <div>
          <button style={styles.pdfBtn} onClick={downloadPDF}>📥 Download PDF Report</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Stats Cards */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #ff9800' }}>
            <h2 style={styles.statNumber}>{pending}</h2>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #1a73e8' }}>
            <h2 style={styles.statNumber}>{inProgress}</h2>
            <p style={styles.statLabel}>In Progress</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #28a745' }}>
            <h2 style={styles.statNumber}>{resolved}</h2>
            <p style={styles.statLabel}>Resolved</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #555' }}>
            <h2 style={styles.statNumber}>{complaints.length}</h2>
            <p style={styles.statLabel}>Total</p>
          </div>
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📊 Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📈 Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1a73e8" name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints List */}
        <div style={styles.card}>
          <h3>📋 All Complaints</h3>
          {complaints.length === 0 ? (
            <p style={styles.noData}>No complaints found!</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} style={styles.complaintCard}>
                <div style={styles.complaintHeader}>
                  <div>
                    <strong>{c.title}</strong>
                    <span style={styles.userName}>👤 {c.userName}</span>
                  </div>
                  <span style={{ ...styles.status, backgroundColor: getStatusColor(c.status) }}>
                    {c.status}
                  </span>
                </div>
                <p style={styles.complaintDesc}>{c.description}</p>
                <div style={styles.complaintFooter}>
                  <small style={styles.complaintMeta}>📁 {c.category} | 📅 {new Date(c.createdAt).toLocaleDateString()}</small>
                  <select style={styles.select} value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
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
  navbar: { backgroundColor: '#343a40', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', margin: 0 },
  pdfBtn: { padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'white', color: '#343a40', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '30px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' },
  statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  statNumber: { margin: 0, fontSize: '32px', fontWeight: 'bold' },
  statLabel: { margin: '5px 0 0', color: '#666' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  chartCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  chartTitle: { margin: '0 0 15px', color: '#333' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  complaintCard: { border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px' },
  complaintHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  userName: { color: '#888', fontSize: '13px', marginLeft: '10px' },
  status: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  complaintDesc: { color: '#555', fontSize: '14px', margin: '5px 0' },
  complaintFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  complaintMeta: { color: '#999' },
  select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' },
  noData: { color: '#999', textAlign: 'center', padding: '20px' }
};

export default AdminDashboard;