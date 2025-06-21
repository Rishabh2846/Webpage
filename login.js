document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const message = document.getElementById('message');

    // Simple validation (replace with real authentication in production)
    if (username === 'admin' && password === 'password') {
        message.style.color = '#27ae60';
        message.textContent = 'Login successful!';
        // Redirect or further logic here
    } else {
        message.style.color = '#e74c3c';
        message.textContent = 'Invalid username or password.';
    }
});
