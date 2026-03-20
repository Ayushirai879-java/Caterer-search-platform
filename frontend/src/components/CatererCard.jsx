import { motion } from "framer-motion";

export default function CatererCard({ caterer }) {
  return (
    <motion.article
      className="caterer-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      <div className="card-header">
        <h3>{caterer.name}</h3>
        <p>{caterer.location}</p>
      </div>

      <div className="card-meta">
        <span className="price-tag">INR {caterer.pricePerPlate} / plate</span>
        <span className="rating-tag">Rating {Number(caterer.rating).toFixed(1)} / 5</span>
      </div>

      <div className="cuisine-wrap">
        {caterer.cuisines.map((cuisine) => (
          <span className="cuisine-chip" key={`${caterer.id}-${cuisine}`}>
            {cuisine}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
