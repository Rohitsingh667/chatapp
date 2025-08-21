const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const conversationRoutes = require('./src/routes/conversations');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/conversations', conversationRoutes);

const socketAuth = require('./src/middleware/socketAuth');
const socketHandlers = require('./src/sockets/socketHandlers');

io.use(socketAuth);
io.on('connection', (socket) => {
  socketHandlers(io, socket);
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - ChatApp</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; width: 90%; text-align: center; }
            .back-btn { color: #007AFF; text-decoration: none; margin-bottom: 20px; display: inline-block; }
            h1 { color: #333; margin-bottom: 30px; }
            .mobile-info { background: #e3f2fd; padding: 20px; border-radius: 8px; color: #1565c0; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-btn">← Back to Home</a>
            <h1>📱 Login</h1>
            <div class="mobile-info">
                <p><strong>Mobile App Required</strong></p>
                <p>Login functionality is available in the React Native mobile application. Please install and run the mobile app to sign in to your account.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register - ChatApp</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; width: 90%; text-align: center; }
            .back-btn { color: #007AFF; text-decoration: none; margin-bottom: 20px; display: inline-block; }
            h1 { color: #333; margin-bottom: 30px; }
            .mobile-info { background: #e8f5e8; padding: 20px; border-radius: 8px; color: #2e7d32; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-btn">← Back to Home</a>
            <h1>🚀 Get Started</h1>
            <div class="mobile-info">
                <p><strong>Mobile App Required</strong></p>
                <p>Account registration is available in the React Native mobile application. Please install and run the mobile app to create your new account.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
