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

app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("api/ping", (req, res) => {
  res.send("man of the math of the tournament of the cricket")
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

