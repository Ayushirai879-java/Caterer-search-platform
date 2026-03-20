import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { ensureDefaultCaterers, isUsingMongo } from "../services/catererRepository.js";

dotenv.config();

async function runSeed() {
  try {
    await connectDB();
    await ensureDefaultCaterers();
    console.log(`Seed completed successfully using ${isUsingMongo() ? "MongoDB" : "JSON"} store.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

runSeed();
