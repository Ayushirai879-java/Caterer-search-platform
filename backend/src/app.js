import cors from "cors";
import express from "express";
import morgan from "morgan";
import catererRoutes from "./routes/catererRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/caterers", catererRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
