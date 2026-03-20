function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateCaterer(payload) {
  const errors = [];

  if (!isNonEmptyString(payload.name)) {
    errors.push("name is required and must be a non-empty string.");
  }

  if (!isNonEmptyString(payload.location)) {
    errors.push("location is required and must be a non-empty string.");
  }

  if (
    typeof payload.pricePerPlate !== "number" ||
    Number.isNaN(payload.pricePerPlate) ||
    payload.pricePerPlate <= 0
  ) {
    errors.push("pricePerPlate is required and must be a positive number.");
  }

  if (!Array.isArray(payload.cuisines) || payload.cuisines.length === 0) {
    errors.push("cuisines is required and must be a non-empty array.");
  } else {
    const allCuisineStrings = payload.cuisines.every(
      (item) => typeof item === "string" && item.trim().length > 0
    );
    if (!allCuisineStrings) {
      errors.push("Each cuisine must be a non-empty string.");
    }
  }

  if (
    typeof payload.rating !== "number" ||
    Number.isNaN(payload.rating) ||
    payload.rating < 0 ||
    payload.rating > 5
  ) {
    errors.push("rating is required and must be a number between 0 and 5.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
