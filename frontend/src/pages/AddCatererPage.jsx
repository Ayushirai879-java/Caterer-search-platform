import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCatererForm from "../components/AddCatererForm.jsx";
import { clearAdminKey, getStoredAdminKey, saveAdminKey } from "../utils/adminAuth.js";

export default function AddCatererPage() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (stored) {
      setAdminKey(stored);
      setInputKey(stored);
    }
  }, []);

  function handleAccessSubmit(event) {
    event.preventDefault();
    const cleaned = inputKey.trim();
    if (!cleaned) {
      setStatusMessage("Please enter admin key.");
      return;
    }

    saveAdminKey(cleaned);
    setAdminKey(cleaned);
    setStatusMessage("Admin access enabled on this browser.");
  }

  function handleLogout() {
    clearAdminKey();
    setAdminKey("");
    setInputKey("");
    setStatusMessage("Admin access removed.");
  }

  return (
    <main className="page-shell">
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="hero-badge">Admin Area</p>
        <h1>Add New Caterers</h1>
        <p className="hero-copy">
          This page is restricted to admin users. Enter admin key to unlock the add-caterer form.
        </p>
        <div className="hero-links">
          <Link to="/" className="secondary-btn">
            Home
          </Link>
          <Link to="/caterers" className="secondary-btn">
            View Caterers
          </Link>
        </div>
      </motion.section>

      <section className="content-section">
        <div className="add-form-panel">
          <h2>Admin Access</h2>
          <p>Enter backend `ADMIN_KEY` to create caterers.</p>
          <form className="admin-access-form" onSubmit={handleAccessSubmit}>
            <input
              type="password"
              placeholder="Enter admin key"
              value={inputKey}
              onChange={(event) => setInputKey(event.target.value)}
            />
            <button type="submit" className="primary-btn">
              Unlock
            </button>
            {adminKey ? (
              <button type="button" className="secondary-btn" onClick={handleLogout}>
                Logout Admin
              </button>
            ) : null}
          </form>
          {statusMessage ? <p className="form-success">{statusMessage}</p> : null}
        </div>

        {adminKey ? (
          <AddCatererForm
            adminKey={adminKey}
            onCreated={() => {
              setStatusMessage("Caterer added successfully.");
            }}
            onUnauthorized={() => {
              clearAdminKey();
              setAdminKey("");
              setStatusMessage("Admin session expired or invalid key.");
            }}
          />
        ) : (
          <div className="status-panel">
            <h3>Admin key required</h3>
            <p>Unlock admin access first to open the add caterer form.</p>
          </div>
        )}
      </section>
    </main>
  );
}
