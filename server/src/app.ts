import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import companyRoutes from "./routes/company.routes";
import applicationRoutes from "./routes/application.routes";
import profileRoutes from "./routes/profile.routes";
import savedJobRoutes from "./routes/savedJob.routes";

import { notFound, errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const uploadsDir = path.resolve("uploads");
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(uploadsDir, req.path);
  if (!filePath.startsWith(uploadsDir)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-jobs", savedJobRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
