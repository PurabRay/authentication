import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Admin.css';
function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      },[])
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAccept = (userId) => {
    axios.post(`http://localhost:8080/admin/accept/${userId}`)
      .then(response => {
        console.log(response.data);
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleReject = (userId) => {
    axios.post(`http://localhost:8080/admin/reject/${userId}`)
      .then(response => {
        console.log(response.data);
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleAccept(user.id)}>Accept</button>
                <button onClick={() => handleReject(user.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;