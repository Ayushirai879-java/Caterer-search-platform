import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureDefaultCaterers } from "./services/catererRepository.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureDefaultCaterers();
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
