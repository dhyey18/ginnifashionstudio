"use client";

import { Heart } from "@phosphor-icons/react";
import { ProductImage } from "./ProductImage";
import { useStore } from "@/lib/store";
import { fmtINR } from "@/lib/data";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export function ProductCard({ product, onView }: ProductCardProps) {
  const { toggleFavourite, isFavourite, addToCart } = useStore();
  const fav = isFavourite(product.id);

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    const defaultSize = product.sizes[1] ?? product.sizes[0];
    addToCart(product, defaultSize, product.colors[0]);
  }

  return (
    <article className="g-card" onClick={() => onView(product)}>
      <div className="g-card-img">
        <ProductImage color={product.colors[0]} pattern={product.pattern} name={product.name} />

        {(product.isNew || product.isBestseller) && (
          <span className="g-card-tag">
            {product.isNew ? "New" : "Bestseller"}
          </span>
        )}

        <button
          className="g-card-fav"
          aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={fav}
          data-on={fav}
          onClick={(e) => { e.stopPropagation(); toggleFavourite(product.id); }}
        >
          <Heart weight={fav ? "fill" : "regular"} size={18} />
        </button>

        <button className="g-card-quick" onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>

      <div className="g-card-info">
        <p className="g-card-cat">{product.category}</p>
        <h3 className="g-card-title">{product.name}</h3>
        <div className="g-card-price">
          {fmtINR(product.price)}
          {product.originalPrice && (
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: "var(--fg-3)", textDecoration: "line-through" }}>
              {fmtINR(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="g-card-swatches">
          {product.colors.map((c) => (
            <span key={c} className="g-card-swatch" style={{ background: c }} aria-label={c} />
          ))}
        </div>
      </div>
    </article>
  );
}
