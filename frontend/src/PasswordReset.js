import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function PasswordReset() {
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');

  const location = useLocation();

  useEffect(() => {
    // Extract the email from the query parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8080/password-reset', { email, newPassword, temporaryPassword })
      .then((response) => {
        alert('Password reset successful!');
        // Redirect user after successful password reset
        window.location.href = '/'; // Change this to your desired redirect route
      })
      .catch((error) => {
        console.error('Password reset error:', error.response ? error.response.data.message : error.message);
        alert('Password reset failed. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} required />
      <br />
      <label>Temporary Password:</label>
      <input
        type="password"
        value={temporaryPassword}
        onChange={(event) => setTemporaryPassword(event.target.value)}
        required
      />
      <br />
      <label>New Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        required
      />
      <br />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default PasswordReset;
