import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminUsers, getAdminStats, getAdminPayments } from '../../services/adminService';
import { getPlans } from '../../services/planService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activePaid: 0, revenue: 0 });
  const [payments, setPayments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, statsRes, paymentsRes, plansRes] = await Promise.all([
          getAdminUsers(),
          getAdminStats(),
          getAdminPayments(),
          getPlans()
        ]);
        
        setUsers(usersRes.data.users || []);
        if (statsRes.data.stats) setStats(statsRes.data.stats);
        else {
          const tUsers = usersRes.data.users.length;
          const aPaid = usersRes.data.users.filter(u => u.is_paid).length;
          setStats({ totalUsers: tUsers, activePaid: aPaid, revenue: aPaid * 2499 });
        }
        
        setPayments(paymentsRes.data.payments || []);
        setPrograms(plansRes.data.plans || []);
      } catch (err) {
        toast.error('Failed to load admin real-time data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const renderContent = () => {
    if (loading) return <div className="p-8 text-center text-gray-500">Loading system data...</div>;

    if (activeTab === 'programs') {
      return (
        <>
          <header className="dash-header">
            <div><h1 className="dash-h1">Training Programs</h1><p className="dash-sub">Manage global fitness regimens.</p></div>
            <button className="btn-primary" style={{ padding: '10px 20px' }}>+ New Program</button>
          </header>
          <div className="admin-table-container mt-8">
            <table className="admin-table">
              <thead><tr><th>Program Name</th><th>Description</th><th>Frequency</th><th>Intensity</th></tr></thead>
              <tbody>
                {programs.length === 0 ? <tr><td colSpan="4">No programs synced.</td></tr> : programs.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-gray-900">{p.name}</td>
                    <td className="text-gray-500">{p.description}</td>
                    <td><span className="status-badge admin">{p.frequency}</span></td>
                    <td><span className="status-badge active">{p.intensity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (activeTab === 'payments') {
      return (
        <>
          <header className="dash-header">
            <div><h1 className="dash-h1">Payment Ledger</h1><p className="dash-sub">Real-time Razorpay transaction logs.</p></div>
          </header>
          <div className="admin-table-container mt-8">
            <table className="admin-table">
              <thead><tr><th>Transaction ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.length === 0 ? <tr><td colSpan="5" className="text-center">No payment history.</td></tr> : payments.map(p => (
                  <tr key={p.id}>
                    <td className="text-sm font-mono text-gray-500">{p.razorpay_order_id || p.id.slice(0,8)}</td>
                    <td>{p.users?.name || 'Unknown'}<br/><span className="text-xs text-gray-400">{p.users?.email}</span></td>
                    <td className="font-medium">₹{(p.amount / 100).toLocaleString()}</td>
                    <td><span className={`status-badge ${p.status === 'success' ? 'active' : 'inactive'}`}>{p.status}</span></td>
                    <td className="text-gray-500 text-sm">{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return (
      <>
        <header className="dash-header">
          <div><h1 className="dash-h1">Admin Overview</h1><p className="dash-sub">Monitor platform members, subscriptions, and revenue.</p></div>
          <button className="btn-primary" style={{ padding: '10px 20px' }}>Export CSV</button>
        </header>

        <section className="stat-grid">
          <div className="dash-stat-card">
            <div className="stat-icon" style={{background: '#e0f2fe'}}><svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <div className="stat-val">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon" style={{background: '#dcfce7'}}><svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <div className="stat-val">{stats.activePaid}</div>
            <div className="stat-label">Paid Members</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon" style={{background: '#fef3c7'}}><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
            <div className="stat-val">₹{(stats.revenue || 0).toLocaleString()}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </section>

        <div className="panel-title" style={{ marginTop: '3rem', marginBottom: '1rem' }}>Recent Registrations</div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Member</th><th>Goal</th><th>Joined Date</th><th>Status</th><th>Role</th></tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan="5">No users found.</td></tr> : users.map(u => (
                <tr key={u.id}>
                  <td><div className="font-medium text-gray-900">{u.name}</div><div className="text-xs text-gray-500">{u.email}</div></td>
                  <td style={{textTransform: 'capitalize'}}>{u.goal}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td><span className={`status-badge ${u.is_paid ? 'active' : 'inactive'}`}>{u.is_paid ? 'Pro Member' : 'Free Trial'}</span></td>
                  <td>{u.role === 'admin' ? <span className="status-badge admin">Admin</span> : 'Customer'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-layout animate-left">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <button className="mobile-dash-toggle" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '3rem' }}>
          <Link to="/" className="dash-logo" style={{ marginBottom: 0 }}>FitWithRam <span style={{fontSize: '12px', color: '#888', fontWeight: 'normal'}}>ADMIN</span></Link>
          <button className="mobile-dash-toggle" style={{ position: 'relative', top: 0, left: 0, display: sidebarOpen ? 'flex' : 'none', border: 'none', boxShadow: 'none' }} onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        
        <nav className="dash-nav">
          <button onClick={() => {setActiveTab('overview'); setSidebarOpen(false)}} className={`dash-link ${activeTab === 'overview' ? 'active' : ''}`} style={{border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'overview' ? '' : 'transparent', cursor: 'pointer'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customers
          </button>
          <button onClick={() => {setActiveTab('programs'); setSidebarOpen(false)}} className={`dash-link ${activeTab === 'programs' ? 'active' : ''}`} style={{border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'programs' ? '' : 'transparent', cursor: 'pointer'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M21 12H3M12 3v18" /></svg>
            Programs
          </button>
          <button onClick={() => {setActiveTab('payments'); setSidebarOpen(false)}} className={`dash-link ${activeTab === 'payments' ? 'active' : ''}`} style={{border: 'none', width: '100%', textAlign: 'left', background: activeTab === 'payments' ? '' : 'transparent', cursor: 'pointer'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Payments
          </button>
        </nav>

        <button onClick={handleLogout} className="dash-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Sign out
        </button>
      </aside>

      <main className="dash-main animate-up">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
