const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

// Determine if the application is running in development mode
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3109;

// Create a Next.js app instance
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  // Create an HTTP server with the Next.js request handler
  const httpServer = createServer(handler);

  // Initialize the Socket.IO server
  const io = new Server(httpServer);

  // Handle socket connections
  io.on("connection", (socket) => {
    // Event for a user joining a room
    socket.on("join-room", (room) => {
      socket.join(room); // Add the user to the specified room
      // Notify others in the room that a new user has joined
      io.to(room).emit(
        "user-joined",
        `${socket.id} has joined the room ${room}`
      );
    });

    // Event for sending a song to a room
    socket.on("send-song", ({ room, data }) => {
      io.to(room).emit("receive-song", data); // Send the song data to the room
    });

    // Event for sending session data to a room
    socket.on("send-session", ({ room, data }) => {
      io.to(room).emit("receive-session", data); // Send session data to the room
    });

    // Event for sending allowing song request
    socket.on("send-allowRequest", ({ room, data }) => {
      io.to(room).emit("receive-allowRequest", data); // Send session data to the room
    });

    // Event for sending live participants
    socket.on("send-participants", ({ room, data }) => {
      io.to(room).emit("receive-participants", data); // Send session data to the room
    });

    // Event for sending limit data to a room
    socket.on("send-limit", ({ room, data }) => {
      io.to(room).emit("receive-limit", data); // Send limit data to the room
    });

    socket.on("send-session-config", ({ room, data }) => {
      io.to(room).emit("receive-session-config", data); // Send limit data to the room
    });

    // Event for a user leaving a room
    socket.on("leave-room", (room) => {
      socket.leave(room); // Remove the user from the specified room
      // Notify others in the room that a user has left
      io.to(room).emit("user-left", `${socket.id} has left the room ${room}`);
    });

    // Handle when a user disconnects
    socket.on("disconnect", () => {
      // Handle any cleanup or state changes when a user disconnects
    });
  });

  // Start the HTTP server
  httpServer
    .once("error", (err) => {
      console.error("Server error:", err); // Log any server errors
      process.exit(1); // Exit the process on error
    })
    .listen(port, () => {
      // Log the server startup message
    });
});
