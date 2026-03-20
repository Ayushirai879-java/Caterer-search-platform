import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getStoredAdminKey } from "../utils/adminAuth.js";

export default function HomePage() {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  useEffect(() => {
    setIsAdminUnlocked(Boolean(getStoredAdminKey()));
  }, []);

  return (
    <main className="page-shell homepage-shell">
      <motion.section
        className="hero-section home-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="hero-badge">Caterers Near me..s</p>
        <h1>Find the Perfect Caterer for Every Event</h1>
        <p className="hero-copy">
          Explore verified caterers, compare pricing, and filter by cuisine preferences in a
          smooth, modern and responsive interface.
        </p>
        <div className="hero-links">
          <Link to="/caterers" className="primary-btn hero-action-btn">
            Explore Caterers
          </Link>
          <Link
            to="/add-caterer"
            className="primary-btn hero-action-btn"
          >
            {isAdminUnlocked ? "Add Caterers" : "Admin Login"}
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
