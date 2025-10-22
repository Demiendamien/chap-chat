import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import path from 'path';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import { io, app, server } from './lib/socket.js';

import { connectDB } from './lib/db.js';




dotenv.config();
// après dotenv.config();
console.log("MONGO URI (preview):", process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0,60) + "..." : "undefined");
console.log("CLOUDINARY keys present:", !!process.env.CLOUDINARY_API_KEY);


const PORT = process.env.PORT 

const _dirname = path.resolve();

app.use(cookieParser());

app.use(express.json(({limit: '10mb'})));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname, '/frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log('Server is running on PORT:'+ PORT);
  connectDB();
}); 