const {createServer} = require("http");
const next = require("next");
const {Server} = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3109;
// when using middleware `hostname` and `port` must be provided below
const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("send-song", (obj) => {
      io.emit("receive-song", obj);
    });

    socket.on("send-session", (obj) => {
      io.emit("receive-session", obj);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
