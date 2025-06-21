const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

// Use environment variables for DB connection (set these in Render dashboard)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    pool.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: 'Username already exists.' });
                }
                return res.status(500).json({ success: false, message: 'Database error.' });
            }
            res.json({ success: true });
        }
    );
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    pool.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error.' });
            if (results.length > 0) {
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }
        }
    );
});

// Serve index.html as base URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
