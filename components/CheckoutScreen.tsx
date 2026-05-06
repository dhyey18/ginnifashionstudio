"use client";

import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { fmtINR } from "@/lib/data";

type Step = "address" | "payment" | "review";
const STEP_ORDER: Step[] = ["address", "payment", "review"];
const STEPS = [{ id: "address", label: "Address" }, { id: "payment", label: "Payment" }, { id: "review", label: "Review" }];

interface Address {
  name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string;
}

interface CheckoutScreenProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function CheckoutScreen({ onBack, onConfirm }: CheckoutScreenProps) {
  const { cartLines, cartTotal } = useStore();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");

  const total = cartTotal();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;
  const currentStepIdx = STEP_ORDER.indexOf(step);

  function field(label: string, id: keyof Address, placeholder: string, type = "text") {
    return (
      <div className="g-field">
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} placeholder={placeholder} value={address[id]} onChange={(e) => setAddress((a) => ({ ...a, [id]: e.target.value }))} />
      </div>
    );
  }

  return (
    <main className="g-checkout">
      <div className="g-checkout-top">
        <button className="g-btn g-btn--text" onClick={onBack} style={{ fontSize: 13 }}>
          <ArrowLeft size={14} /> Continue Shopping
        </button>
        <div className="g-stepper">
          {STEPS.map((s, i) => (
            <span key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-3)" }}>
              <span className="g-step" data-active={step === s.id} data-done={i < currentStepIdx}>
                <span className="g-step-num">{i < currentStepIdx ? "✓" : i + 1}</span>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="g-step-sep" />}
            </span>
          ))}
        </div>
        <div />
      </div>

      <div className="g-checkout-body">
        {/* Left: form */}
        <div>
          {step === "address" && (
            <form className="g-form-section" onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} noValidate>
              <h3>Delivery Address</h3>
              <div className="g-field-row">{field("Full Name *", "name", "Priya Sharma")} {field("Phone *", "phone", "9876543210", "tel")}</div>
              {field("Address Line 1 *", "line1", "House / Flat No., Street")}
              {field("Address Line 2", "line2", "Area, Landmark (optional)")}
              <div className="g-field-row col3">
                {field("City *", "city", "Mumbai")}
                {field("State *", "state", "Maharashtra")}
                {field("Pincode *", "pincode", "400001")}
              </div>
              <button type="submit" className="g-btn g-btn--primary">Continue to Payment</button>
            </form>
          )}

          {step === "payment" && (
            <div className="g-form-section">
              <h3>Payment Method</h3>
              {([ { id: "upi", label: "UPI / QR Code", emoji: "📱" }, { id: "card", label: "Credit / Debit Card", emoji: "💳" }, { id: "cod", label: "Cash on Delivery", emoji: "💵" } ] as const).map((opt) => (
                <div key={opt.id} className="g-pay-opt" data-on={paymentMethod === opt.id} onClick={() => setPaymentMethod(opt.id)} role="radio" aria-checked={paymentMethod === opt.id} tabIndex={0}>
                  <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                  <div><p className="g-pay-opt-name">{opt.label}</p></div>
                </div>
              ))}
              {paymentMethod === "upi" && (
                <div className="g-field"><label htmlFor="upi-id">UPI ID</label><input id="upi-id" type="text" placeholder="yourname@upi" /></div>
              )}
              <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-3)" }}>
                <button className="g-btn g-btn--ghost" onClick={() => setStep("address")}>Back</button>
                <button className="g-btn g-btn--primary" onClick={() => setStep("review")}>Review Order</button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="g-form-section">
              <h3>Review & Place Order</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", padding: "var(--sp-4)", background: "var(--g-cream)", borderRadius: "var(--r-md)" }}>
                <p style={{ fontWeight: 600 }}>Delivering to</p>
                <p style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.7 }}>
                  {address.name}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
                  {address.city}, {address.state} — {address.pincode}<br />{address.phone}
                </p>
              </div>
              <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-3)" }}>
                <button className="g-btn g-btn--ghost" onClick={() => setStep("payment")}>Back</button>
                <button className="g-btn g-btn--primary" onClick={onConfirm}>Place Order — {fmtINR(grandTotal)}</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <aside className="g-summary" aria-label="Order summary">
          <h3>Order Summary</h3>
          {cartLines.map((line) => (
            <div key={`${line.product.id}-${line.size}`} className="g-summary-line">
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
          <div className="g-summary-row"><span>Subtotal</span><span>{fmtINR(total)}</span></div>
          <div className="g-summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : fmtINR(shipping)}</span></div>
          <div className="g-summary-row total"><span>Total</span><span>{fmtINR(grandTotal)}</span></div>
        </aside>
      </div>
    </main>
  );
}
