import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [newGovernor, setNewGovernor] = useState({ username: '', password: '' });
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteUserType, setDeleteUserType] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(res.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        navigate('/admin/login');
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Function to add a new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.post(
        'http://localhost:8000/admin/admin',
        newAdmin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('New admin added successfully');
      setNewAdmin({ username: '', password: '' });
    } catch (error) {
      setError('Error adding admin: ' + error.response.data.message);
    }
  };

  // Function to add a new tourism governor
  const handleAddGovernor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.post(
        'http://localhost:8000/admin/tourism-governor',
        newGovernor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('New tourism governor added successfully');
      setNewGovernor({ username: '', password: '' });
    } catch (error) {
      setError('Error adding tourism governor: ' + error.response.data.message);
    }
  };

  // Function to delete a user by type
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.delete(
        `http://localhost:8000/admin/${deleteUserType}/${deleteUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`${deleteUserType} deleted successfully`);
      setDeleteUserId('');
      setDeleteUserType('');
    } catch (error) {
      setError('Error deleting user: ' + error.response.data.message);
    }
  };

  if (!adminData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {adminData.username}</p>

      {/* Form to add a new admin */}
      <div>
        <h3>Add New Admin</h3>
        <form onSubmit={handleAddAdmin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={newAdmin.username}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Add Admin</button>
        </form>
      </div>

      {/* Form to add a new tourism governor */}
      <div>
        <h3>Add New Tourism Governor</h3>
        <form onSubmit={handleAddGovernor}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={newGovernor.username}
              onChange={(e) =>
                setNewGovernor({ ...newGovernor, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={newGovernor.password}
              onChange={(e) =>
                setNewGovernor({ ...newGovernor, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Add Tourism Governor</button>
        </form>
      </div>

      {/* Form to delete a user */}
      <div>
        <h3>Delete User</h3>
        <form onSubmit={handleDeleteUser}>
          <div>
            <label>User ID:</label>
            <input
              type="text"
              value={deleteUserId}
              onChange={(e) => setDeleteUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <label>User Type:</label>
            <input
              type="text"
              value={deleteUserType}
              onChange={(e) => setDeleteUserType(e.target.value)}
              placeholder="tourist, advertiser, tourguide, seller, tourismgovernor, admin"
              required
            />
          </div>
          <button type="submit">Delete User</button>
        </form>
      </div>

      {/* Display messages */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={() => {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
