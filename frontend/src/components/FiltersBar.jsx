export default function FiltersBar({
  searchTerm,
  maxPrice,
  priceCeiling,
  onSearchChange,
  onMaxPriceChange,
  onReset
}) {
  const sliderMax = Math.max(100, priceCeiling);
  const sliderValue = Math.min(maxPrice, sliderMax);

  return (
    <section className="filter-bar">
      <label className="field-group" htmlFor="searchCaterer">
        <span>Search by name</span>
        <input
          id="searchCaterer"
          type="text"
          placeholder="Type caterer name"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field-group" htmlFor="priceFilter">
        <span>Price per plate up to INR {sliderValue}</span>
        <input
          id="priceFilter"
          type="range"
          min="100"
          max={sliderMax}
          step="50"
          value={sliderValue}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        />
      </label>

      <button type="button" className="secondary-btn" onClick={onReset}>
        Reset filters
      </button>
    </section>
  );
}
