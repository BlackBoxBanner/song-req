const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3109;

// Create a Next.js app instance
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Initialize the socket.io server
  const io = new Server(httpServer);

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Event for a user joining a room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);

      // Broadcast to the room that a new user has joined
      io.in(room).emit(
        "user-joined",
        `${socket.id} has joined the room ${room}`
      );
    });

    // Event for sending a song to a room
    socket.on("send-song", (obj) => {
      io.in(obj.room).emit("receive-song", obj.data);
      console.log(`Song sent to room ${obj.room}:`, obj.data);
    });

    // Event for sending session data to a room
    socket.on("send-session", (obj) => {
      io.in(obj.room).emit("receive-session", obj.data);
      console.log(`Session sent to room ${obj.room}:`, obj.data);
    });

    // Event for sending limit data to a room
    socket.on("send-limit", (obj) => {
      io.in(obj.room).emit("receive-limit", obj.data);
      console.log(`Limit sent to room ${obj.room}:`, obj.data);
    });

    // Handle when a user disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Start the server
  httpServer
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server ready on http://${hostname}:${port}`);
    });
});
