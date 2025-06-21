const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userdb = require('./userdb');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    const result = userdb.addUser(username, password);
    if (result.success) {
        res.json({ success: true });
    } else {
        res.status(409).json(result);
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (userdb.authenticate(username, password)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
