import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import initRoutes from "./src/routes/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  }),
);

// API routes: luôn đăng ký, cả local lẫn production
initRoutes(app);

// Serve frontend nếu đã có bản build, KHÔNG phụ thuộc vào NODE_ENV
const clientBuildPath = path.resolve(__dirname, "..", "client", "build");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else if (!isProduction) {
  console.warn(
    "⚠ Chưa có client/build. Chạy 'npm run build-client' nếu muốn server serve luôn frontend.",
  );
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
