const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'users.json');

function readUsers() {
    if (!fs.existsSync(dbPath)) return [];
    const data = fs.readFileSync(dbPath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

function addUser(username, password) {
    const users = readUsers();
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Username already exists.' };
    }
    users.push({ username, password });
    writeUsers(users);
    return { success: true };
}

function authenticate(username, password) {
    const users = readUsers();
    return users.some(u => u.username === username && u.password === password);
}

module.exports = { addUser, authenticate };
