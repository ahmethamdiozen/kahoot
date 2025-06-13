require("dotenv").config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

require("./sockets/quiz")(io);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
