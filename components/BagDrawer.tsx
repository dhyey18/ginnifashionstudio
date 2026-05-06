"use client";

import { useEffect, useRef } from "react";
import { X, Trash } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { fmtINR } from "@/lib/data";

interface BagDrawerProps {
  onCheckout: () => void;
}

export function BagDrawer({ onCheckout }: BagDrawerProps) {
  const { bagOpen, setBagOpen, cartLines, updateQuantity, removeFromCart, cartTotal } = useStore();
  const drawerRef = useRef<HTMLElement>(null);
  const total = cartTotal();

  useEffect(() => {
    if (!bagOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setBagOpen(false); };
    document.addEventListener("keydown", handler);
    drawerRef.current?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [bagOpen, setBagOpen]);

  useEffect(() => {
    document.body.style.overflow = bagOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bagOpen]);

  return (
    <>
      <div className="g-scrim" data-open={bagOpen} onClick={() => setBagOpen(false)} aria-hidden />

      <aside
        ref={drawerRef}
        className="g-drawer"
        data-open={bagOpen}
        role="dialog"
        aria-modal
        aria-label="Shopping bag"
        tabIndex={-1}
      >
        <div className="g-drawer-head">
          <h2 className="g-drawer-title">
            Your Bag
            {cartLines.length > 0 && (
              <span style={{ fontSize: 16, fontFamily: "var(--font-sans)", fontStyle: "normal", color: "var(--fg-2)", marginLeft: 8 }}>
                ({cartLines.reduce((s, l) => s + l.quantity, 0)})
              </span>
            )}
          </h2>
          <button className="g-icon-btn" onClick={() => setBagOpen(false)} aria-label="Close bag">
            <X size={20} />
          </button>
        </div>

        <div className="g-drawer-body">
          {cartLines.length === 0 ? (
            <div className="g-drawer-empty">
              <span className="g-drawer-empty-icon" aria-hidden>🛍️</span>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20 }}>Your bag is empty</p>
              <p style={{ fontSize: 14, color: "var(--fg-2)" }}>Discover beautiful ethnic wear and add your favourites here.</p>
              <button className="g-btn g-btn--primary" onClick={() => setBagOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
              {cartLines.map((line) => (
                <li key={`${line.product.id}-${line.size}-${line.color}`} className="g-bag-line">
                  <div className="g-bag-img">
                    <div style={{ width: "100%", height: "100%", background: line.color, borderRadius: "var(--r-sm)" }} />
                  </div>
                  <div>
                    <p className="g-bag-cat">{line.product.category}</p>
                    <p className="g-bag-name">{line.product.name}</p>
                    <p className="g-bag-meta">Size: {line.size} · Colour: {line.color}</p>
                    <div className="g-bag-actions">
                      <button onClick={() => updateQuantity(line.product.id, line.size, line.color, line.quantity - 1)}>−</button>
                      <span style={{ color: "var(--fg-1)", padding: "0 8px" }}>{line.quantity}</span>
                      <button onClick={() => updateQuantity(line.product.id, line.size, line.color, line.quantity + 1)}>+</button>
                      <button onClick={() => removeFromCart(line.product.id, line.size, line.color)} style={{ marginLeft: "var(--sp-2)", color: "var(--fg-3)" }}>
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="g-bag-price">{fmtINR(line.product.price * line.quantity)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartLines.length > 0 && (
          <div className="g-drawer-foot">
            <div className="g-drawer-row">
              <span>Subtotal</span>
              <span>{fmtINR(total)}</span>
            </div>
            <div className="g-drawer-row">
              <span>Shipping</span>
              <span>{total >= 999 ? "FREE ✓" : fmtINR(99)}</span>
            </div>
            <div className="g-drawer-row is-total">
              <span>Total</span>
              <span>{fmtINR(total >= 999 ? total : total + 99)}</span>
            </div>
            <button
              className="g-btn g-btn--primary g-btn--block"
              onClick={() => { setBagOpen(false); onCheckout(); }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
