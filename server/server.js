import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import initRoutes from "./src/routes/index.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS linh hoạt hơn
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true,
    }),
  );
}

// Khởi tạo routes của bạn
initRoutes(app);

// Serve Frontend ở môi trường Production
if (isProduction) {
  // Đi ngược từ server/ ra thư mục gốc rồi vào client/build hoặc client/dist (nếu dùng Vite)
  const clientBuildPath = path.resolve(__dirname, "..", "client", "build");

  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

const port = process.env.PORT || 8888;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB. Server is halting...", err);
    process.exit(1);
  });
