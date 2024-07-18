import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { sequelize } from './db/models/index.js';
import routes from './routes/index.js';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook middleware
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('testing');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const server = http.createServer(app);
//create http server

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
//create socket.io server

let rooms = {}; //store rooms

io.on('connection', (socket) => {
  socket.on('findMatch', (data) => {
    //data contain user info
    let roomId;
    //implement logic to find match
    if (Object.keys(rooms).length === 0) {
      rooms[data.userId] = [];
      roomId = data.userId;
      socket.join(roomId);
      socket.emit('joinedRoom', { roomId: roomId });
    } else {
      roomId = Object.keys(rooms)[0];
      delete rooms[roomId];
      socket.join(roomId);
      socket.emit('joinedRoom', { roomId: roomId });

      io.to(roomId).emit('matchFound', { roomId: roomId });
    }
    console.log(`${data.userId} joined room: `, roomId);
  });

  socket.on('sendSignal', (data) => {
    //data contain signal info (maybe how many words left)
    console.log(data);
    io.to(data.roomId).emit('signal', {
      userId: data.user,
      signal: data.signal,
    });
  });

  socket.on('disconnect', () => {
    //handle logic when a client disconnects
  });

  socket.on('startGame', (data) => {
    //handle logic when a client starts game
    io.to(data.roomId).emit('startGame', {
      userId: data.userId,
      timer: data.timer,
      showOutline: data.showOutline,
      difficulty: data.difficulty,
      showHintAfterMisses: data.showHintAfterMisses,
    });
  });

  socket.on('leaveRoom', (data) => {
    console.log('leaving');
    socket.leave(data.roomId);
    io.to(data.roomId).emit('destroyRoom', { roomId: data.roomId });
    console.log(rooms);
    console.log(data.roomId);

    delete rooms[data.roomId];
    console.log(rooms);
  });
}); //handle logic when a client connects to the web socket (when finding a match)

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

export default app;
