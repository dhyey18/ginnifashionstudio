"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Plus } from "@phosphor-icons/react";
import { ProductImage } from "./ProductImage";
import { useStore } from "@/lib/store";
import { fmtINR } from "@/lib/data";
import type { Product } from "@/lib/types";

interface PDPScreenProps {
  product: Product;
  onBack: () => void;
}

const PERKS = [
  { icon: "🚚", title: "Free Delivery", sub: "Orders above ₹999" },
  { icon: "↩️", title: "Easy Returns", sub: "15-day hassle-free" },
  { icon: "🔒", title: "Secure Pay", sub: "100% safe checkout" },
];

export function PDPScreen({ product, onBack }: PDPScreenProps) {
  const { addToCart, toggleFavourite, isFavourite, setBagOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openAcc, setOpenAcc] = useState<string | null>("description");

  const fav = isFavourite(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const galleryColors = product.colors.slice(0, 3);

  function handleAddToBag() {
    if (!selectedSize) { alert("Please select a size"); return; }
    addToCart(product, selectedSize, selectedColor);
    setBagOpen(true);
  }

  const ACCORDIONS = [
    { id: "description", label: "Description", body: product.description },
    { id: "details", label: "Product Details", body: `Fabric: ${product.fabric}\nPattern: ${product.pattern}\nSKU: ${product.sku}` },
    { id: "care", label: "Care Instructions", body: product.care },
    { id: "shipping", label: "Shipping & Returns", body: "Free standard shipping above ₹999. Delivery in 5–7 business days. Easy 15-day returns." },
  ];

  return (
    <main className="g-pdp">
      <div className="g-container">
        <nav className="g-crumb">
          <button onClick={onBack}><ArrowLeft size={14} /> Back</button>
          <span className="sep">/</span>
          <span>{product.category}</span>
          <span className="sep">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="g-pdp-grid">
          {/* Gallery */}
          <div className="g-gallery">
            <div className="g-gallery-thumbs">
              {galleryColors.map((c, i) => (
                <button
                  key={c}
                  className="g-thumb"
                  data-on={activeIdx === i}
                  onClick={() => { setActiveIdx(i); setSelectedColor(c); }}
                  aria-label={`View colour ${i + 1}`}
                >
                  <ProductImage color={c} pattern={product.pattern} name={product.name} />
                </button>
              ))}
            </div>
            <div className="g-gallery-main">
              <ProductImage
                color={galleryColors[activeIdx] ?? product.colors[0]}
                pattern={product.pattern}
                name={product.name}
              />
            </div>
          </div>

          {/* Details */}
          <div className="g-pdp-side">
            <p className="g-pdp-coll">{product.category}</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h1 className="g-pdp-name">{product.name}</h1>
              <button
                className="g-pdp-icon-btn"
                data-on={fav}
                aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={fav}
                onClick={() => toggleFavourite(product.id)}
              >
                <Heart weight={fav ? "fill" : "regular"} size={22} />
              </button>
            </div>

            <div>
              <p className="g-pdp-price">
                {fmtINR(product.price)}
                {product.originalPrice && (
                  <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 400, color: "var(--fg-3)", textDecoration: "line-through" }}>
                    {fmtINR(product.originalPrice)}
                  </span>
                )}
                {discount && (
                  <span style={{ marginLeft: 10, fontSize: 14, color: "var(--g-rose-700)", fontWeight: 700 }}>{discount}% off</span>
                )}
              </p>
              <p className="g-pdp-price-sub">Inclusive of all taxes</p>
            </div>

            {/* Spec grid */}
            <div className="g-pdp-spec">
              {[["Fabric", product.fabric], ["Pattern", product.pattern], ["Rating", `${product.rating}/5 (${product.reviewCount})`], ["SKU", product.sku]].map(([k, v]) => (
                <div key={k}>
                  <p className="g-spec-key">{k}</p>
                  <p className="g-spec-val">{v}</p>
                </div>
              ))}
            </div>

            {/* Colour selector */}
            <div>
              <p className="g-sizes-label">Colour</p>
              <div className="g-color-swatches">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    className="g-color-swatch"
                    data-on={selectedColor === c}
                    style={{ background: c }}
                    aria-label={`Colour ${i + 1}`}
                    onClick={() => { setSelectedColor(c); setActiveIdx(Math.min(i, galleryColors.length - 1)); }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <p className="g-sizes-label">Size {selectedSize && <span style={{ color: "var(--fg-brand)", fontWeight: 700 }}>— {selectedSize}</span>}</p>
              <div className="g-size-grid">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="g-size-btn"
                    data-on={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="g-pdp-cta">
              <button className="g-btn g-btn--primary" onClick={handleAddToBag}>
                <Plus size={16} /> Add to Bag
              </button>
              <button className="g-btn g-btn--ghost" onClick={handleAddToBag}>Buy Now</button>
            </div>

            {/* Perks */}
            <div className="g-perks">
              {PERKS.map((p) => (
                <div key={p.title} className="g-perk">
                  <span className="g-perk-icon" aria-hidden>{p.icon}</span>
                  <p className="g-perk-title">{p.title}</p>
                  <p className="g-perk-sub">{p.sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div>
              {ACCORDIONS.map((acc) => (
                <div key={acc.id} className="g-acc-row" data-open={openAcc === acc.id}>
                  <button
                    className="g-acc-head"
                    aria-expanded={openAcc === acc.id}
                    onClick={() => setOpenAcc(openAcc === acc.id ? null : acc.id)}
                  >
                    <span>{acc.label}</span>
                    <span className="icon"><Plus size={14} /></span>
                  </button>
                  <div className="g-acc-body">
                    <p style={{ whiteSpace: "pre-line" }}>{acc.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
