import { randomUUID } from "crypto";
import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import sampleCaterers from "../data/sampleCaterers.js";
import Caterer from "../models/Caterer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonStorePath = path.join(__dirname, "..", "data", "caterers.json");

export function isUsingMongo() {
  return mongoose.connection.readyState === 1;
}

async function ensureJsonStore() {
  let existingData = [];

  try {
    await fs.access(jsonStorePath);
    const existing = await fs.readFile(jsonStorePath, "utf-8");
    existingData = existing.trim() ? JSON.parse(existing) : [];
    if (!Array.isArray(existingData)) {
      existingData = [];
    }
  } catch (_error) {
    existingData = [];
  }

  const normalizedExisting = existingData.map((item) => ({
    ...item,
    id: item.id || randomUUID()
  }));

  const existingNames = new Set(
    normalizedExisting.map((item) => item.name.trim().toLowerCase())
  );
  const missingSamples = sampleCaterers
    .filter((item) => !existingNames.has(item.name.trim().toLowerCase()))
    .map((item) => ({
      id: randomUUID(),
      ...item
    }));

  const finalData =
    normalizedExisting.length === 0 ? missingSamples : [...normalizedExisting, ...missingSamples];

  await fs.writeFile(jsonStorePath, JSON.stringify(finalData, null, 2), "utf-8");
}

async function readJsonCaterers() {
  await ensureJsonStore();
  const content = await fs.readFile(jsonStorePath, "utf-8");
  return JSON.parse(content);
}

async function writeJsonCaterers(caterers) {
  await fs.writeFile(jsonStorePath, JSON.stringify(caterers, null, 2), "utf-8");
}

function applyFilters(caterers, { search = "", maxPrice }) {
  const nameNeedle = search.trim().toLowerCase();
  const parsedMaxPrice = Number(maxPrice);
  const hasPriceFilter = !Number.isNaN(parsedMaxPrice) && parsedMaxPrice > 0;

  return caterers
    .filter((item) => {
      const matchesName = nameNeedle ? item.name.toLowerCase().includes(nameNeedle) : true;
      const matchesPrice = hasPriceFilter ? item.pricePerPlate <= parsedMaxPrice : true;
      return matchesName && matchesPrice;
    })
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });
}

export async function ensureDefaultCaterers() {
  if (isUsingMongo()) {
    const existing = await Caterer.find({}, { name: 1 }).lean();
    const existingNames = new Set(existing.map((item) => item.name.trim().toLowerCase()));
    const missingSamples = sampleCaterers.filter(
      (item) => !existingNames.has(item.name.trim().toLowerCase())
    );

    if (missingSamples.length > 0) {
      await Caterer.insertMany(missingSamples);
      console.log(`Inserted ${missingSamples.length} sample caterers in MongoDB.`);
    }
    return;
  }

  await ensureJsonStore();
  console.log("Using JSON data store:", jsonStorePath);
}

export async function findCaterers(filters) {
  if (isUsingMongo()) {
    const query = {};
    if (filters.search?.trim()) {
      query.name = { $regex: filters.search.trim(), $options: "i" };
    }

    if (filters.maxPrice !== undefined) {
      const parsed = Number(filters.maxPrice);
      if (!Number.isNaN(parsed) && parsed > 0) {
        query.pricePerPlate = { $lte: parsed };
      }
    }

    return Caterer.find(query).sort({ rating: -1, name: 1 });
  }

  const caterers = await readJsonCaterers();
  return applyFilters(caterers, filters);
}

export async function findCatererById(id) {
  if (isUsingMongo()) {
    return Caterer.findById(id);
  }

  const caterers = await readJsonCaterers();
  return caterers.find((item) => item.id === id) || null;
}

export async function addCaterer(payload) {
  if (isUsingMongo()) {
    return Caterer.create(payload);
  }

  const caterers = await readJsonCaterers();
  const created = {
    id: randomUUID(),
    name: payload.name,
    location: payload.location,
    pricePerPlate: payload.pricePerPlate,
    cuisines: payload.cuisines,
    rating: payload.rating
  };

  caterers.push(created);
  await writeJsonCaterers(caterers);
  return created;
}
