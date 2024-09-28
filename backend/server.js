const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

db.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to database');
    }
});

app.use(express.json());

app.post('/login', (req, res) => {
    const sql = "SELECT password FROM users WHERE name = ? AND email = ?";
    db.query(sql, [req.body.name, req.body.email], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error");
        }
        if (data.length > 0) {
            const hashedPassword = data[0].password;
            // let userHashed = bcrypt.hashSync(req.body.password, 10);
            let userhashed=req.body.password;
            console.log(`Recieved password: ${userhashed}`);
            console.log(`Stored password: ${data[0].password}`);
            const isValidPassword = userhashed == hashedPassword;
            console.log(`Is valid password: ${isValidPassword}`);
            if (isValidPassword) {
                console.log("Login successful");
                return res.json("Login Success");
            } else {
                console.log("Login failed");
                return res.json("Login Failed");
            }
        } else {
            console.log("User not found");
            return res.json("Login Failed");
        }
    });
});

app.post('/signup', (req, res) => {
    try {
        let hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [req.body.name, req.body.email, req.body.password], (err, data) => {
            if (err) {
                console.error(err);
                return res.json("Error");
            }
            console.log("Signup successful");
            return res.json("Signup Success");
        });
    } catch (error) {
        console.error(error);
        return res.json("Error");
    }
});

app.get('/admin/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Error fetching users' });
      } else {
        res.send(results);
      }
    });
  });
  
  app.post('/admin/accept/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query(`UPDATE users SET status = 'accepted' WHERE id = ${userId}`, (err) => {
      if (err) {
        res.status(500).send({ message: 'Error accepting user' });
      } else {
        res.send({ message: 'User accepted successfully' });
      }
    });
  });
  
  app.post('/admin/reject/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query(`UPDATE users SET status = 'rejected' WHERE id = ${userId}`, (err) => {
      if (err) {
        res.status(500).send({ message: 'Error rejecting user' });
      } else {
        res.send({ message: 'User rejected successfully' });
      }
    });
  });
  
const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});





// const port = 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });