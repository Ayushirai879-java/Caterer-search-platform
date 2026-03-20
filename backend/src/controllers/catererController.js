import mongoose from "mongoose";
import {
  addCaterer,
  findCatererById,
  findCaterers,
  isUsingMongo
} from "../services/catererRepository.js";
import { validateCreateCaterer } from "../utils/validation.js";

export async function getCaterers(req, res, next) {
  try {
    const { search = "", maxPrice } = req.query;

    const caterers = await findCaterers({ search, maxPrice });

    return res.status(200).json({
      count: caterers.length,
      data: caterers
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCatererById(req, res, next) {
  try {
    const { id } = req.params;

    if (isUsingMongo() && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid caterer id." });
    }

    const caterer = await findCatererById(id);

    if (!caterer) {
      return res.status(404).json({ message: "Caterer not found." });
    }

    return res.status(200).json(caterer);
  } catch (error) {
    return next(error);
  }
}

export async function createCaterer(req, res, next) {
  try {
    const { isValid, errors } = validateCreateCaterer(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const payload = {
      name: req.body.name.trim(),
      location: req.body.location.trim(),
      pricePerPlate: req.body.pricePerPlate,
      cuisines: req.body.cuisines.map((item) => item.trim()),
      rating: req.body.rating
    };

    const caterer = await addCaterer(payload);

    return res.status(201).json(caterer);
  } catch (error) {
    return next(error);
  }
}
