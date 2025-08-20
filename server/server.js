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

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
