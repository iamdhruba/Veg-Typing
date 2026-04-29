const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // for production
].filter(Boolean);

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }
});

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/results', require('./routes/results.js'));
app.use('/api/leaderboard', require('./routes/leaderboard.js'));

// Socket.io
require('./socketHandlers')(io);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

server.listen(port, () => console.log(`Server started on port ${port}`));
