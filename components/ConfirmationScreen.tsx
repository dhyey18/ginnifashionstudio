"use client";

import { useStore } from "@/lib/store";
import { fmtINR } from "@/lib/data";

interface ConfirmationScreenProps {
  onContinueShopping: () => void;
  orderNumber: string;
}

export function ConfirmationScreen({ onContinueShopping, orderNumber }: ConfirmationScreenProps) {
  const { cartLines, cartTotal, clearCart } = useStore();
  const total = cartTotal();

  function handleContinue() {
    clearCart();
    onContinueShopping();
  }

  return (
    <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <div className="g-confirm">
        <div className="g-confirm-arch">Ginni&apos;s</div>

        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(36px,4vw,52px)", margin: 0 }}>
          Order <em style={{ color: "var(--fg-brand)", fontStyle: "normal" }}>Placed!</em>
        </h1>

        <p style={{ fontSize: 16, color: "var(--fg-2)", maxWidth: 480, textAlign: "center", lineHeight: 1.7 }}>
          Thank you for shopping with Ginni&apos;s Fashion Studio. Your order is confirmed and will be delivered in 5–7 business days.
        </p>

        <div className="g-confirm-meta">
          <div><span>Order ID</span><strong>#{orderNumber}</strong></div>
          <div><span>Payment</span><strong>Confirmed</strong></div>
          <div><span>Delivery</span><strong>5–7 Business Days</strong></div>
        </div>

        {/* Order items */}
        <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {cartLines.map((line) => (
            <div key={`${line.product.id}-${line.size}`} className="g-summary-line" style={{ background: "var(--g-cream)", padding: "var(--sp-3)", borderRadius: "var(--r-md)" }}>
              <div className="g-summary-img">
                <div style={{ width: "100%", height: "100%", background: line.color }} />
              </div>
              <div>
                <p className="g-summary-name">{line.product.name}</p>
                <p className="g-summary-meta">Size {line.size} · Qty {line.quantity}</p>
              </div>
              <p className="g-summary-price">{fmtINR(line.product.price * line.quantity)}</p>
            </div>
          ))}
          <div className="g-summary-row total" style={{ padding: "var(--sp-3) var(--sp-4)", background: "var(--g-rose-50)", borderRadius: "var(--r-md)" }}>
            <span>Total Paid</span>
            <span>{fmtINR(total)}</span>
          </div>
        </div>

        <button className="g-btn g-btn--primary" style={{ marginTop: "var(--sp-3)", padding: "16px 40px" }} onClick={handleContinue}>
          Continue Shopping
        </button>
      </div>
    </main>
  );
}
