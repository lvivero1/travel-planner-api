import "dotenv/config";
import cors from "cors";
import express from "express";

import activityRoutes from "./routes/activityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", authenticateToken, tripRoutes);
app.use("/api/destinations", authenticateToken, destinationRoutes);
app.use("/api/activities", authenticateToken, activityRoutes);

app.get("/api/protected/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
