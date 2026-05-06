"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "./ProductCard";
import { ProductImage } from "./ProductImage";
import { PRODUCTS, COLLECTIONS, OCCASIONS, getNewArrivals, getBestsellers } from "@/lib/data";
import type { Product } from "@/lib/types";

const REVIEWS = [
  { id: "r1", name: "Priya S.", location: "Mumbai", text: "Absolutely love the Rashmika Anarkali! The quality is exceptional and the embroidery is so intricate. Got so many compliments at the wedding.", rating: 5, product: "Rashmika Floral Anarkali" },
  { id: "r2", name: "Ananya R.", location: "Bangalore", text: "The Meena Zari Silk Saree drapes beautifully. Fast shipping and the packaging was gorgeous. Will definitely buy again!", rating: 5, product: "Meena Zari Silk Saree" },
  { id: "r3", name: "Kavita M.", location: "Delhi", text: "Great quality block print kurta. Very comfortable for office wear. The colours are vibrant and true to pictures.", rating: 4, product: "Priya Block Print Kurta Set" },
];

interface HomeScreenProps {
  onViewProduct: (product: Product) => void;
  onViewListing: (occasion?: string) => void;
}

export function HomeScreen({ onViewProduct, onViewListing }: HomeScreenProps) {
  const newArrivals = getNewArrivals();
  const bestsellers = getBestsellers();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="g-hero">
        <div className="g-hero-copy">
          <span className="g-hero-eyebrow">New Season · Festive 2025</span>
          <h1 className="g-hero-title">
            Wear the Art of<br /><em>Indian Craft</em>
          </h1>
          <p className="g-hero-lede">
            Handpicked ethnic wear for every occasion. From Banarasi silks to block-print cotton — curated with love.
          </p>
          <div className="g-hero-actions">
            <button className="g-btn g-btn--primary" onClick={() => onViewListing()}>Shop the Edit</button>
            <button className="g-btn g-btn--ghost" onClick={() => onViewListing("wedding")}>Bridal Collection</button>
          </div>
          <div className="g-hero-trust">
            <span>✦ 10,000+ happy customers</span>
            <span>✦ Free shipping above ₹999</span>
            <span>✦ Easy returns</span>
          </div>
        </div>
        <div className="g-hero-img-wrap">
          <div className="g-hero-arch-deco" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-2)", height: "100%", padding: "var(--sp-5)" }}>
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => onViewProduct(p)}
                aria-label={`View ${p.name}`}
                style={{ borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "3/4", display: "block" }}
              >
                <ProductImage color={p.colors[0]} pattern={p.pattern} name={p.name} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasion strip ── */}
      <section className="g-section g-section--sm">
        <div className="g-container">
          <div className="g-section-head">
            <div className="g-section-head-l">
              <h2 className="g-section-title" style={{ fontSize: 32 }}>Shop by Occasion</h2>
            </div>
          </div>
          <div className="g-occ-grid">
            {OCCASIONS.map((occ) => (
              <button key={occ.id} className="g-occ-card" onClick={() => onViewListing(occ.id)} aria-label={`Shop ${occ.name}`}>
                <ProductImage color={PRODUCTS[OCCASIONS.indexOf(occ) % PRODUCTS.length].colors[0]} pattern={PRODUCTS[OCCASIONS.indexOf(occ) % PRODUCTS.length].pattern} name={occ.name} />
                <div className="g-occ-info">
                  <span className="g-occ-icon" aria-hidden>{occ.emoji}</span>
                  <p className="g-occ-name">{occ.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="g-section">
        <div className="g-container">
          <div className="g-section-head">
            <div className="g-section-head-l">
              <h2 className="g-section-title">New Arrivals</h2>
              <p className="g-section-sub">Fresh styles, just in</p>
            </div>
            <button className="g-view-all" onClick={() => onViewListing()}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="g-grid">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onView={onViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="g-section g-feature">
        <div className="g-container">
          <div className="g-section-head">
            <div className="g-section-head-l">
              <h2 className="g-section-title">Our Collections</h2>
              <p className="g-section-sub">Thoughtfully curated for every chapter of your life</p>
            </div>
          </div>
          <div className="g-collections">
            {COLLECTIONS.map((col, i) => (
              <button key={col.id} className="g-coll-card" onClick={() => onViewListing()} aria-label={`Shop ${col.name}`}>
                <ProductImage color={PRODUCTS[i * 2].colors[0]} pattern={PRODUCTS[i * 2].pattern} name={col.name} />
                <div className="g-coll-info">
                  <p className="g-coll-eyebrow">Collection</p>
                  <h3 className="g-coll-title">{col.name}</h3>
                  <p className="g-coll-note">{col.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers ── */}
      <section className="g-section">
        <div className="g-container">
          <div className="g-section-head">
            <div className="g-section-head-l">
              <h2 className="g-section-title">Bestsellers</h2>
              <p className="g-section-sub">Loved by thousands of women</p>
            </div>
            <button className="g-view-all" onClick={() => onViewListing()}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="g-grid">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} onView={onViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="g-section g-section--sm" style={{ background: "var(--g-cream)" }}>
        <div className="g-container">
          <div className="g-section-head" style={{ justifyContent: "center" }}>
            <div className="g-section-head-l" style={{ alignItems: "center" }}>
              <h2 className="g-section-title">What Our Customers Say</h2>
              <p className="g-section-sub" style={{ textAlign: "center" }}>Real love from real women across India</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--sp-5)" }}>
            {REVIEWS.map((r) => (
              <blockquote key={r.id} style={{ background: "white", borderRadius: "var(--r-xl)", padding: "var(--sp-5)", margin: 0, boxShadow: "var(--sh-sm)" }}>
                <div className="g-review-stars" aria-label={`${r.rating} stars`}>{"★".repeat(r.rating)}</div>
                <p className="g-review-text" style={{ marginTop: "var(--sp-3)" }}>{r.text}</p>
                <footer style={{ marginTop: "var(--sp-4)", paddingTop: "var(--sp-3)", borderTop: "1px solid var(--g-line)" }}>
                  <p className="g-review-name">{r.name}</p>
                  <p className="g-review-meta">{r.location} · on {r.product}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: "linear-gradient(135deg, var(--g-rose-800), var(--g-rose-900))", padding: "var(--sp-9) var(--sp-7)", textAlign: "center" }}>
        <span className="g-eyebrow" style={{ color: "var(--g-gold-400)" }}>Limited time offer</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(36px,4vw,60px)", color: "white", margin: "var(--sp-3) 0" }}>
          Your dream outfit is waiting
        </h2>
        <p style={{ color: "rgba(253,250,247,0.75)", fontSize: 16, marginBottom: "var(--sp-5)" }}>
          Explore 500+ styles curated for the modern Indian woman. Free shipping on your first order.
        </p>
        <button className="g-btn g-btn--white" onClick={() => onViewListing()}>
          Shop Now — Free Shipping
        </button>
      </section>
    </main>
  );
}
