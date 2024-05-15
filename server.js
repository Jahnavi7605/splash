const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
    const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    
    // Log all requests
    logStream.write(logMessage);
    console.log(logMessage); // Log to console as well

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Redirect root route to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve login page
app.get('/login', (req, res) => {
    console.log(`[${new Date().toISOString()}] Serving login page`);
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
    console.log(`[${new Date().toISOString()}] Serving signup page`);
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Serve about page
app.get('/about', (req, res) => {
    console.log(`[${new Date().toISOString()}] Serving about page`);
    res.sendFile(path.join(__dirname, 'webapp', 'about.html'));
});

// Sign Up endpoint
app.post('/signup', async (req, res) => {
    const { username, email_id, password } = req.body; // Change 'email' to 'email_id'

    // Here you would typically insert code to store the user's information in your preferred database.

    console.log(`[${new Date().toISOString()}] User ${username} signed up successfully`);
    res.redirect('/login'); // Redirect to the login page after successful signup
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Here you would typically retrieve the user's information from your database and verify the credentials.

    console.log(`[${new Date().toISOString()}] User ${username} logged in successfully`);
    res.redirect('/dashboard');
});

// Logout endpoint
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Error logging out: ${err}`);
            return res.status(500).send('Error logging out');
        }
        console.log(`[${new Date().toISOString()}] User logged out successfully`);
        // Redirect to the login page after logout
        res.redirect('/login');
    });
});


// Dashboard endpoint
app.get('/dashboard', (req, res) => {
    // Check if user is authenticated (session exists)
    if (!req.session.username) {
        console.log(`[${new Date().toISOString()}] User not authenticated, redirecting to login page`);
        return res.redirect('/login');
    }
    // User is authenticated, render the dashboard
    console.log(`[${new Date().toISOString()}] User authenticated, rendering dashboard`);
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Get username endpoint
app.get('/get-username', (req, res) => {
    // Check if user is authenticated (session exists)
    if (!req.session.username) {
        console.log(`[${new Date().toISOString()}] User not authenticated`);
        return res.status(401).send('User not authenticated');
    }
    // User is authenticated, send the username
    console.log(`[${new Date().toISOString()}] Sending username: ${req.session.username}`);
    res.status(200).send(req.session.username);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
