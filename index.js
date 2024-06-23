const express = require('express');
const path = require('path');
const db = require('./config/database.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/userRoute.js');
const adminRouter = require('./routes/adminRoute.js');
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { encrypt } = require('./controllers/encryptionController.js');
const dotenv = require('dotenv');
dotenv.config();



app.set('io', io);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (nim) => {
    console.log(`User with NIM ${nim} joined room`);
    socket.join(nim);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.use((req, res, next) => {
  res.locals.encrypt = encrypt; 
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/preline', express.static(path.join(__dirname, 'node_modules/preline/dist')));
app.use('/sweet', express.static(path.join(__dirname, 'node_modules/sweetalert2/dist')));

app.set('view engine', 'ejs');

const testDatabaseConnection = async () => {
    try {
        await db.authenticate();
        console.log('Koneksi database berhasil.');
    } catch (error) {
        console.error('Gagal terkoneksi ke database:', error);
    }
};

testDatabaseConnection();

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
