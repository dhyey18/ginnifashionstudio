"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlass, ShoppingBag, Heart, List, X, User } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "New Arrivals", occasion: null },
  { label: "Sarees", occasion: null },
  { label: "Anarkalis", occasion: null },
  { label: "Lehengas", occasion: null },
  { label: "Festive", occasion: "festival" },
  { label: "Collections", occasion: null },
];

export function Header() {
  const { cartCount, setRoute, setBagOpen, setSearchOpen, setActiveOccasion } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const count = cartCount();

  function handleNavClick(occasion: string | null) {
    setActiveOccasion(occasion);
    setRoute("listing");
    setMobileOpen(false);
  }

  return (
    <>
      <div className="g-announce">
        <span>Free shipping on orders above ₹999 &nbsp;·&nbsp; Easy 15-day returns &nbsp;·&nbsp; COD available</span>
      </div>

      <header className="g-header" data-scrolled={scrolled} style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="g-header-row">
          {/* Left nav */}
          <nav className="g-nav" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <button key={link.label} className="g-nav-link" onClick={() => handleNavClick(link.occasion)}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Centre logo */}
          <Logo onClick={() => setRoute("home")} />

          {/* Right nav + icons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0 }}>
            <nav className="g-nav" style={{ marginRight: "var(--sp-3)" }} aria-label="Secondary navigation">
              {NAV_LINKS.slice(3).map((link) => (
                <button key={link.label} className="g-nav-link" onClick={() => handleNavClick(link.occasion)}>
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="g-header-icons">
              <button className="g-icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <MagnifyingGlass size={22} />
              </button>
              <button className="g-icon-btn" aria-label="Wishlist" onClick={() => setRoute("favorites")}>
                <Heart size={22} />
              </button>
              <button className="g-icon-btn" aria-label="Profile" onClick={() => setRoute("profile")}>
                <User size={22} />
              </button>
              <button
                className="g-icon-btn"
                aria-label={`Shopping bag, ${count} item${count !== 1 ? "s" : ""}`}
                onClick={() => setBagOpen(true)}
                style={{ position: "relative" }}
              >
                <ShoppingBag size={22} />
                {count > 0 && (
                  <span className="g-badge" aria-hidden>{count > 9 ? "9+" : count}</span>
                )}
              </button>
              <button
                className="g-icon-btn"
                style={{ display: "none" }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
