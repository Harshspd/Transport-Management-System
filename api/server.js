
import http from 'http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load env vars
dotenv.config();
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("It's working");
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import consignerRoutes from './routes/consignerRoutes.js';
import consigneeRoutes from './routes/consigneeRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/consigners', consignerRoutes);
app.use('/api/consignees', consigneeRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/shipments', shipmentRoutes);

// Socket.io Setup
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('joined', ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit('userjoined', { user: "Admin", message: `${user} has joined` });
    socket.emit('welcome', { user: "Admin", message: `Welcome to the chat ${user}` });
  });

  socket.on('message', ({ message }) => {
    io.emit('sendMessage', {
      user: users[socket.id],
      message,
      id: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete users[socket.id];
  });
});

// OpenAI Chat Route
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
