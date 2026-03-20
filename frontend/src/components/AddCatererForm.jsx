import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  name: "",
  location: "",
  pricePerPlate: "",
  cuisines: "",
  rating: ""
};

export default function AddCatererForm({ adminKey, onCreated, onUnauthorized }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const cuisines = form.cuisines
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      pricePerPlate: Number(form.pricePerPlate),
      cuisines,
      rating: Number(form.rating)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/caterers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 401) {
        onUnauthorized?.();
        throw new Error(data.message || "Admin access required.");
      }

      if (!response.ok) {
        const joinedErrors = Array.isArray(data.errors) ? data.errors.join(" ") : "";
        throw new Error(joinedErrors || data.message || "Unable to add caterer.");
      }

      setForm(initialForm);
      setStatusMessage("Caterer added successfully.");
      onCreated?.(data);
    } catch (error) {
      setErrorMessage(error.message || "Unable to add caterer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="add-form-panel">
      <h2>Add Caterer</h2>
      <p>Create a new caterer from the admin panel.</p>

      <form className="add-caterer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price per plate"
          value={form.pricePerPlate}
          onChange={(event) => updateField("pricePerPlate", event.target.value)}
          min="1"
          required
        />
        <input
          type="text"
          placeholder="Cuisines (comma separated)"
          value={form.cuisines}
          onChange={(event) => updateField("cuisines", event.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (0 to 5)"
          value={form.rating}
          onChange={(event) => updateField("rating", event.target.value)}
          min="0"
          max="5"
          step="0.1"
          required
        />

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Caterer"}
        </button>
      </form>

      {statusMessage ? <p className="form-success">{statusMessage}</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
    </section>
  );
}
