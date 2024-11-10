
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'signup' // Ensure this matches your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.use(express.json());
// app.post('/login', (req, res) => {
//   const { name, email, password } = req.body;

//   const sql = "SELECT password FROM users WHERE name = ? AND email = ?";
//   db.query(sql, [name, email], async (err, data) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json("Error");
//     }

//     if (data.length > 0) {
//       const storedPasswordHash = data[0].password; // Stored bcrypt hash

//       try {
//         // Directly compare the plaintext input with bcrypt-hashed password
//         const isValidPassword = await bcrypt.compare(password, storedPasswordHash);

//         console.log("Input Password:", password);
//         console.log("Stored Bcrypt Password Hash:", storedPasswordHash);
//         console.log(`Is valid password: ${isValidPassword}`);

//         if (isValidPassword) {
//           console.log("Login successful");
//           return res.json("Login Success");
//         } else {
//           console.log("Login failed");
//           return res.json("Login Failed");
//         }
//       } catch (error) {
//         console.error("Error during password comparison:", error);
//         return res.status(500).json("Internal Server Error");
//       }
//     } else {
//       console.log("User not found");
//       return res.json("Login Failed");
//     }
//   });
// });
app.post('/login', (req, res) => {
  const { name, email, password } = req.body;

  const sql = "SELECT password FROM users WHERE name = ? AND email = ?";
  db.query(sql, [name, email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json("Error");
    }

    if (data.length > 0) {
      const storedPasswordHash = data[0].password; // Stored bcrypt hash

      try {
        const sha256Password = crypto.createHash('sha256').update(password).digest('hex');

        const isValidPassword = await bcrypt.compare(sha256Password, storedPasswordHash);

        if (isValidPassword) {
          console.log("Login successful");
          return res.json("Login Success");
        } else {
          console.log("Login failed");
          return res.json("Login Failed");
        }
      } catch (error) {
        console.error("Error during password comparison:", error);
        return res.status(500).json("Internal Server Error");
      }
    } else {
      console.log("User not found");
      return res.json("Login Failed");
    }
  });
});


// Define the route to get user details by email
app.get('/user/:email', (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.params.email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length > 0) {
      res.json(data[0]);  // Send back the user data
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});
app.get('/admin/users', (req, res) => {
  const sql = "SELECT * FROM users WHERE status = 'waiting'"; 
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data); 
  });
});
app.post('/admin/accept/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(`UPDATE users SET status = 'accepted' WHERE id = ?`, [userId], (err) => {
    if (err) {
      console.error("Error accepting user:", err);
      res.status(500).send({ message: 'Error accepting user' });
    } else {
      res.send({ message: 'User accepted successfully' });
    }
  });
});

app.post('/admin/reject/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(`UPDATE users SET status = 'rejected' WHERE id = ?`, [userId], (err) => {
    if (err) {
      console.error("Error rejecting user:", err);
      res.status(500).send({ message: 'Error rejecting user' });
    } else {
      res.send({ message: 'User rejected successfully' });
    }
  });
});


// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: 'purabray2@gmail.com',  // Your Gmail address
    pass: 'htcf szie afod mvlp'   // Your App Password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Signup route
app.post('/signup', (req, res) => {
  const { email, username } = req.body;
  const temporaryPassword = Math.random().toString(36).substring(2, 12); 

  const query = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;

  db.query(query, [email, username, temporaryPassword], (err, results) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).json({ message: 'Signup failed. Database error.' });
    }

    const mailOptions = {
      from: 'purabray2@gmail.com',
      to: email,
      subject: 'Your Temporary Password',
      text: `Hello ${username},\n\nYour temporary password is: ${temporaryPassword}\nPlease reset it as soon as possible.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message);  // Log the actual email sending error
        return res.status(500).json({ message: 'Failed to send email.', error: error.message });
      }

      console.log('Email sent:', info.response);
      res.json({ message: 'Signup successful. Temporary password sent to your email.', email });
    });
  });
});
// app.post('/password-reset', async (req, res) => {
//   const { newPassword, email, temporaryPassword } = req.body;

//   // Check if the provided temporary password matches what's stored
//   db.query(`SELECT password FROM users WHERE email = ?`, [email], async (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Password reset failed. Please try again.' });
//     }

//     if (data.length > 0) {
//       const storedTempPassword = data[0].password;

//       // Directly compare the provided temporary password
//       if (storedTempPassword === temporaryPassword) {
//         try {
//           // Hash the new password using bcrypt
//           const bcryptNewPassword = await bcrypt.hash(newPassword, 10);

//           // Update the password in the database
//           db.query(`UPDATE users SET password = ? WHERE email = ?`, [bcryptNewPassword, email], (err, results) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ message: 'Failed to update password.' });
//             }
//             res.json({ message: 'Password reset successful.' });
//           });
//         } catch (error) {
//           console.error('Error hashing new password:', error);
//           res.status(500).json({ message: 'Error hashing password.' });
//         }
//       } else {
//         res.status(400).json({ message: 'Invalid temporary password.' });
//       }
//     } else {
//       res.status(404).json({ message: 'User not found.' });
//     }
//   });
// });
app.post('/password-reset', async (req, res) => {
  const { newPassword, email, temporaryPassword } = req.body;

  // Check if the provided temporary password matches what's stored
  db.query(`SELECT password FROM users WHERE email = ?`, [email], async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Password reset failed. Please try again.' });
    }

    if (data.length > 0) {
      const storedTempPassword = data[0].password;

      // Directly compare the provided temporary password (no SHA or bcrypt on temporary password)
      if (storedTempPassword === temporaryPassword) {
        try {
          // Step 1: Hash the new password with SHA-256
          const sha256Password = crypto.createHash('sha256').update(newPassword).digest('hex');

          // Step 2: Hash the SHA-256 result with bcrypt
          const bcryptNewPassword = await bcrypt.hash(sha256Password, 10);

          // Update the password in the database
          db.query(`UPDATE users SET password = ? WHERE email = ?`, [bcryptNewPassword, email], (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Failed to update password.' });
            }
            res.json({ message: 'Password reset successful.' });
          });
        } catch (error) {
          console.error('Error hashing new password:', error);
          res.status(500).json({ message: 'Error hashing password.' });
        }
      } else {
        res.status(400).json({ message: 'Invalid temporary password.' });
      }
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});



const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
