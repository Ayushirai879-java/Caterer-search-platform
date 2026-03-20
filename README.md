# Catering Search Platform - Developer Evaluation Task

This repository contains the completed full stack catering search platform.

## Objective

Build a small catering search platform with:

- Backend APIs (Node.js + Express)
- Frontend interface (React)
- Full stack integration

## Tech Stack

- MongoDB + Mongoose (primary storage)
- JSON file fallback storage (used automatically if MongoDB is unavailable; allowed by task)
- Express.js + Node.js
- React.js (Vite) + React Router
- Framer Motion for UI animations

## Task Requirements Coverage

- `GET /api/caterers` implemented
- `GET /api/caterers/:id` implemented
- `POST /api/caterers` implemented
- Caterer fields implemented:
  - `id`
  - `name`
  - `location`
  - `pricePerPlate`
  - `cuisines`
  - `rating`
- Basic validation for POST implemented
- Frontend listing page implemented at `/caterers`
- Search by caterer name implemented
- Filter by price per plate implemented
- Clean, responsive UI with animation implemented

## Additional Feature

- Admin-only add-caterer page at `/add-caterer`
- Home page has both buttons side-by-side:
  - `Explore Caterers`
  - `Add Caterers (Admin)`
- Backend protects creation endpoint with admin key (`ADMIN_KEY`)

## Project Structure

```text
caterer/
  backend/
  frontend/
  task.pdf
  README.md
```

## Backend Setup

1. Open terminal:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
copy .env.example .env
```

4. Configure `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/caterer_app
ADMIN_KEY=admin123
```

5. Start backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

Health check: `GET http://localhost:5000/api/health`

## Frontend Setup

1. Open terminal:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
copy .env.example .env
```

4. `.env` value:

```env
VITE_API_URL=http://localhost:5000/api
```

5. Start frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Documentation

### `GET /api/caterers`

Return all caterers.

Optional query params:

- `search`: filter by name (case-insensitive)
- `maxPrice`: filter by `pricePerPlate <= maxPrice`

### `GET /api/caterers/:id`

Return single caterer by id.

### `POST /api/caterers` (Admin only)

Create a new caterer.

Required header:

- `x-admin-key: <ADMIN_KEY>`

Request body:

```json
{
  "name": "Skyline Caterers",
  "location": "Nashik",
  "pricePerPlate": 650,
  "cuisines": ["North Indian", "Live Counters"],
  "rating": 4.4
}
```

Validation rules:

- `name`: non-empty string
- `location`: non-empty string
- `pricePerPlate`: positive number
- `cuisines`: non-empty array of non-empty strings
- `rating`: number between 0 and 5

## Admin Flow (Frontend)

1. Open `/add-caterer`
2. Enter admin key (`ADMIN_KEY` from backend `.env`)
3. Submit the form to add caterers

## Available Scripts

Backend:

- `npm run dev` - run API with nodemon
- `npm start` - run API
- `npm run seed` - ensure sample caterers exist

Frontend:

- `npm run dev` - run development server
- `npm run build` - production build
- `npm run preview` - preview production build
