console.log("Script initialized")

const socket = new WebSocket("ws://localhost:8000/api/games");

socket.addEventListener("open", (event) => {
  socket.send("[CLIENT] Connected to server\n");
});

socket.addEventListener("message", (event) => {
  console.log(`[CLIENT] Received message from server: ${event.data}\n`);
});