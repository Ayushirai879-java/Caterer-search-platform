import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import CatererCard from "../components/CatererCard.jsx";
import FiltersBar from "../components/FiltersBar.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CaterersPage() {
  const [caterers, setCaterers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const detectedMaxPrice = useMemo(() => {
    if (caterers.length === 0) {
      return 1000;
    }

    return Math.max(...caterers.map((item) => item.pricePerPlate), 1000);
  }, [caterers]);

  useEffect(() => {
    if (maxPrice === null) {
      setMaxPrice(detectedMaxPrice);
    }
  }, [detectedMaxPrice, maxPrice]);

  async function fetchCaterers() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/caterers`);
      if (!response.ok) {
        throw new Error("Failed to fetch caterers.");
      }

      const payload = await response.json();
      setCaterers(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load caterers.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCaterers();
  }, []);

  const filteredCaterers = useMemo(() => {
    return caterers.filter((caterer) => {
      const matchesName = caterer.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesPrice =
        typeof maxPrice === "number" ? caterer.pricePerPlate <= maxPrice : true;
      return matchesName && matchesPrice;
    });
  }, [caterers, searchTerm, maxPrice]);

  function handleReset() {
    setSearchTerm("");
    setMaxPrice(detectedMaxPrice);
  }

  return (
    <main className="page-shell">
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="hero-badge">Caterer Discovery</p>
        <h1>Book the Right Catering Partner with Confidence</h1>
        <p className="hero-copy">
          Browse all available caterers, search by name, and narrow results by budget per plate.
        </p>
      </motion.section>

      <section className="content-section">
        <FiltersBar
          searchTerm={searchTerm}
          maxPrice={maxPrice ?? detectedMaxPrice}
          priceCeiling={detectedMaxPrice}
          onSearchChange={setSearchTerm}
          onMaxPriceChange={setMaxPrice}
          onReset={handleReset}
        />

        {isLoading ? (
          <div className="cards-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton-card" />
            ))}
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="status-panel">
            <h3>Unable to fetch caterers</h3>
            <p>{errorMessage}</p>
            <button type="button" className="secondary-btn" onClick={fetchCaterers}>
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <motion.div
              className="cards-grid"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.35,
                    staggerChildren: 0.08
                  }
                }
              }}
            >
              <AnimatePresence>
                {filteredCaterers.map((caterer) => (
                  <motion.div
                    key={caterer.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CatererCard caterer={caterer} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredCaterers.length === 0 ? (
              <div className="status-panel">
                <h3>No caterers found</h3>
                <p>Try a different name or increase your maximum price filter.</p>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
