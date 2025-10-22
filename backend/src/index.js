// // import express from 'express';
// // import dotenv from 'dotenv';
// // import cookieParser from 'cookie-parser';
// // import authRoutes from './routes/auth.route.js';
// // import path from 'path';
// // import messageRoutes from './routes/message.route.js';
// // import cors from 'cors';
// // import { io, app, server } from './lib/socket.js';

// // import { connectDB } from './lib/db.js';

// // dotenv.config();
// // // après dotenv.config();
// // console.log("MONGO URI (preview):", process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0,60) + "..." : "undefined");
// // console.log("CLOUDINARY keys present:", !!process.env.CLOUDINARY_API_KEY);

// // const PORT = process.env.PORT

// // const _dirname = path.resolve();

// // app.use(cookieParser());

// // app.use(express.json(({limit: '10mb'})));

// // app.use(cors({
// //   origin: 'http://localhost:5173',
// //   credentials: true,
// // }));

// // app.use("/api/auth", authRoutes);

// // app.use("/api/messages", messageRoutes);

// // // if (process.env.NODE_ENV === 'production') {
// // //   // Sert les fichiers statiques de React
// // //   app.use(express.static(path.join(_dirname, 'frontend', 'dist')));

// // //   // Pour toutes les autres routes, renvoyer index.html
// // //   app.get('/*', (req, res) => {
// // //     res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'));
// // //   });
// // // }

// // server.listen(PORT, () => {
// //   console.log('Server is running on PORT:'+ PORT);
// //   connectDB();
// // });

// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import cors from 'cors';

// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';
// import { connectDB } from './lib/db.js';
// import { io, app, server } from './lib/socket.js';

// dotenv.config();

// // 🔹 Debug environnement
// console.log("MONGO URI (preview):", process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0,60) + "..." : "undefined");
// console.log("CLOUDINARY keys present:", !!process.env.CLOUDINARY_API_KEY);

// const PORT = process.env.PORT || 5000;
// const _dirname = path.resolve();

// // 🔹 Middlewares
// app.use(cookieParser());
// app.use(express.json({ limit: '10mb' }));
// app.use(cors({
//   origin: 'http://localhost:5173', // adapter si besoin
//   credentials: true,
// }));

// // 🔹 Routes API
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // 🔹 Production static files (Vite build)
// if (process.env.NODE_ENV === 'production') {
//   const distPath = path.join(_dirname, '/frontend/dist');
//   app.use(express.static(distPath));

//   // ✅ middleware global au lieu d'un app.get('*')
//   app.use((req, res, next) => {
//     res.sendFile(path.join(distPath, 'index.html'), (err) => {
//       if (err) next(err);
//     });
//   });
// }

// // 🔹 Démarrage serveur et connexion DB
// server.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
//   connectDB();
// });

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { io, app, server } from "./lib/socket.js";

dotenv.config();

// 🔹 Debug environnement
console.log(
  "MONGO URI (preview):",
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.slice(0, 60) + "..."
    : "undefined"
);
console.log("CLOUDINARY keys present:", !!process.env.CLOUDINARY_API_KEY);

const PORT = process.env.PORT || 5000;
const _dirname = path.resolve();

// 🔹 Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://chap-chat-ybdz.onrender.com", // ton domaine Render
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 🔹 Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 Production static files (Vite build)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(_dirname, "../frontend/dist"); // ✅ Chemin corrigé
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

// 🔹 Lancement du serveur + DB
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
