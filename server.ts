import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import candidateRoutes from "./src/modules/candidate/candidate.route";
import authRoutes from "./src/modules/auth/auth.route";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    mongoose.connect(mongoUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGO_URI not found in environment variables. Database features will not work.");
  }

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for local dev/iframe compatibility
  }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // API Routes
  app.use("/api/candidates", candidateRoutes);
  app.use("/api/auth", authRoutes);

  // Dashboard Stats API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const Candidate = mongoose.model("Candidate");
      const total = await Candidate.countDocuments();
      const stats = await Candidate.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      
      const statusCounts = {
        Applied: 0,
        Interview: 0,
        Hired: 0,
        Rejected: 0
      };

      stats.forEach(s => {
        if (s._id in statusCounts) {
          statusCounts[s._id as keyof typeof statusCounts] = s.count;
        }
      });

      res.json({ total, statusCounts });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });

  // Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ success: false, message });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
