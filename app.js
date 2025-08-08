var express = require("express");
var router = require("./routes/texts");
var cors = require('cors');
var dotenv = require('dotenv');
var compilerRouter = require('./routes/compiler');
var socketIo = require('socket.io');
var { createServer } = require('http');

dotenv.config({ path: './.env' });
const corsOptions = {
   origin: process.env.FRONTEND_URI,
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true,
};
const app = express();
const httpServer = createServer(app);
const io = socketIo(httpServer, {
   cors: {
      origin: process.env.FRONTEND_URI,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
   }
});
app.use(express.json());


// app.options('*',cors(corsOptions));
app.use(cors(corsOptions));

app.get('/', (req, res) => {
   return res.send('Working');
})

// logger
app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next();
});

app.use('/api/v1', router);
app.use('/api/v1/compiler', compilerRouter);

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
});

// socket.io connection
io.on('connection', (socket) => {
   console.log('A user connected');

   socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      io.to(roomId).emit('roomJoined', { roomId, roomSize: io.sockets.adapter.rooms.get(roomId)?.size || 0 });
   })

   socket.on('shareCode', (data) => {
      const { roomId, code, language } = data;
      console.log(`Sharing code in room ${roomId}:`, code);
      socket.to(roomId).emit('receiveCode', { code, language });
   });

   // Handle delta-based code sharing
   socket.on('shareDelta', (data) => {
      const { roomId, delta, language } = data;
      console.log(`Sharing delta in room ${roomId}:`, delta);
      socket.to(roomId).emit('receiveDelta', { delta, language });
   });

   socket.on('broadcastMessage', (data) => {
      const { roomId, message } = data;
      io.to(roomId).emit('receiveMessage', message);
   });

   socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
      io.to(roomId).emit('roomLeft', { roomId, roomSize: io.sockets.adapter.rooms.get(roomId)?.size || 0 });
   });

   socket.on('disconnect', () => {
      console.log('A user disconnected');
   });
});

module.exports = httpServer;