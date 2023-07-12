const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const app = require('./app');
const server = http.createServer(app);
const io = new Server(server);
const DB = process.env.DATABASE_URL.replace('<<PASSWORD>>', process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('DB connection success..');
  })
server.listen(8080, () => console.log('hello, connection successfull!'));
// CURRENTLY NOT WORKING
io.on('connection', (socket) => {
  console.log('a user connected');
});
