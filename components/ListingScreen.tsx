"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { PRODUCTS, OCCASIONS } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

const CATEGORIES = ["All", "Saree", "Anarkali", "Lehenga", "Kurta Set", "Suit", "Gown", "Palazzo Set", "Dupatta"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

interface ListingScreenProps {
  onViewProduct: (product: Product) => void;
}

export function ListingScreen({ onViewProduct }: ListingScreenProps) {
  const { 
    activeOccasion, 
    setActiveOccasion,
    activeCategory,
    setActiveCategory,
    activeSort,
    setActiveSort
  } = useStore();
  const [priceMax, setPriceMax] = useState(15000);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (activeOccasion) list = list.filter((p) => p.occasion.includes(activeOccasion));
    list = list.filter((p) => p.price <= priceMax);
    switch (activeSort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [activeCategory, activeOccasion, activeSort, priceMax]);

  function clearFilters() {
    setActiveCategory("All");
    setActiveOccasion(null);
    setActiveSort("featured");
    setPriceMax(15000);
  }

  return (
    <main>
      <div className="g-container" style={{ paddingTop: "var(--sp-7)", paddingBottom: "var(--sp-9)" }}>
        {/* Page header */}
        <div className="g-listing-head">
          <p className="g-listing-eyebrow">Collection</p>
          <h1 className="g-listing-title">{activeOccasion ? OCCASIONS.find(o => o.id === activeOccasion)?.name ?? "All Styles" : "All Styles"}</h1>
          <p className="g-listing-sub">{filtered.length} handpicked styles for you</p>
        </div>

        {/* Toolbar */}
        <div className="g-listing-toolbar">
          <div style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center", flexWrap: "wrap" }}>
            <span className="g-listing-count"><strong>{filtered.length}</strong> styles</span>
            {OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                className="g-chip"
                data-on={activeOccasion === occ.id}
                onClick={() => setActiveOccasion(activeOccasion === occ.id ? null : occ.id)}
              >
                {occ.emoji} {occ.name}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center" }}>
            {(activeCategory !== "All" || activeOccasion || activeSort !== "featured" || priceMax < 15000) && (
              <button className="g-chip" onClick={clearFilters}>Clear filters ×</button>
            )}
            <label htmlFor="sort-select" className="g-listing-count">Sort:</label>
            <select
              id="sort-select"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              style={{
                background: "white", border: "1.5px solid var(--g-line-rose)", padding: "8px 12px",
                borderRadius: "var(--r-pill)", fontSize: 13, fontFamily: "var(--font-sans)",
                color: "var(--fg-1)", cursor: "pointer",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Body: filters + grid */}
        <div className="g-listing-body">
          {/* Sidebar filters */}
          <aside className="g-filters">
            <div className="g-filter-group">
              <p className="g-filter-title">Category</p>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="g-filter-row"
                  data-on={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveCategory(cat)}
                >
                  <span className="g-filter-label">
                    <span className="g-filter-check">{activeCategory === cat ? "✓" : ""}</span>
                    {cat}
                  </span>
                </div>
              ))}
            </div>

            <div className="g-filter-group">
              <p className="g-filter-title">Price (max)</p>
              <p style={{ fontSize: 13, color: "var(--fg-1)", marginBottom: "var(--sp-2)" }}>
                Up to ₹{priceMax.toLocaleString("en-IN")}
              </p>
              <input
                type="range" min={500} max={15000} step={500} value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--g-rose-700)" }}
                aria-label="Maximum price"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                <span>₹500</span><span>₹15,000</span>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--sp-9) 0" }}>
              <p style={{ fontSize: 18, color: "var(--fg-2)", marginBottom: "var(--sp-4)" }}>No styles match your filters.</p>
              <button className="g-btn g-btn--soft" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="g-grid g-grid--3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onView={onViewProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
