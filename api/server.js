import http from 'http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("It's working");
});

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


const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY}); 

// ChatGPT Endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    console.log('Received message:', message);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });

        console.log('response----------', response);

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('error----', error);
        res.status(500).json({ error: 'Error communicating with OpenAI' });
    }
  });

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
