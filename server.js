require("dotenv").config(); // Load environment variables
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { configureApp } = require("./config/app.config");
const uploadRoutes = require("./routes/uploadRoutes");
const { setupWebSocket } = require("./wsHandler"); // Import WebSocket logic

const app = configureApp();

// Load environment variables
const PORT = process.env.PORT || 3000;

let server = http.createServer(app);
console.log(`✅ Using HTTP in development`);

// API Routes
app.use("/api", uploadRoutes);

// Dummy Users Endpoint
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "vishnu", age: 25 },
    { id: 2, name: "varun", age: 30 },
    { id: 3, name: "charan", age: 22 },
  ]);
});

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// Setup WebSockets
setupWebSocket(server);

server.listen(PORT, () => 
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

