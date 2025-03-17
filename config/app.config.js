require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const configureApp = () => {
  const app = express();

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

  console.log("CORS Origin:", process.env.FRONTEND_URL);
  const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Handle preflight
  
  app.use(cookieParser());
  app.set("trust proxy", 1);

    // Increase payload limit for file uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  return app;
};

module.exports = {
  configureApp
};
