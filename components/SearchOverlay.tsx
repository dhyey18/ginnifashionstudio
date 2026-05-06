"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { ProductImage } from "./ProductImage";
import { useStore } from "@/lib/store";
import { PRODUCTS, fmtINR } from "@/lib/data";
import type { Product } from "@/lib/types";

interface SearchOverlayProps {
  onViewProduct: (product: Product) => void;
}

export function SearchOverlay({ onViewProduct }: SearchOverlayProps) {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length >= 2
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.fabric.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const close = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, [setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen, close]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  return (
    <>
      <div className="g-search-scrim" data-open={searchOpen} onClick={close} aria-hidden />

      <div className="g-search-panel" data-open={searchOpen} role="dialog" aria-modal aria-label="Search">
        <div className="g-search-bar">
          <MagnifyingGlass size={24} style={{ color: "var(--fg-3)", flexShrink: 0 }} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search sarees, anarkalis, fabrics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button className="g-icon-btn" onClick={close} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <div className="g-search-results">
          {/* Suggestions */}
          <div className="g-search-suggest">
            <h4>Popular searches</h4>
            <ul>
              {["Banarasi saree", "Anarkali suits", "Block print", "Lehenga choli", "Festive wear"].map((term) => (
                <li key={term} onClick={() => setQuery(term)}>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div>
            {query.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="g-search-prod-grid">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { onViewProduct(p); close(); }}
                      style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}
                      aria-label={`View ${p.name}`}
                    >
                      <div style={{ aspectRatio: "3/4", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                        <ProductImage color={p.colors[0]} pattern={p.pattern} name={p.name} />
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 14 }}>{p.name}</p>
                      <p style={{ fontWeight: 700, color: "var(--fg-brand)" }}>{fmtINR(p.price)}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ padding: "var(--sp-5)", color: "var(--fg-2)" }}>No results for &ldquo;{query}&rdquo;</p>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
