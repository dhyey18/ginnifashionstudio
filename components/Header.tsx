"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlass, ShoppingBag, Heart, List, X, User } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "New Arrivals", occasion: null, category: "All", sort: "newest" },
  { label: "Sarees", occasion: null, category: "Saree", sort: "featured" },
  { label: "Anarkalis", occasion: null, category: "Anarkali", sort: "featured" },
  { label: "Lehengas", occasion: null, category: "Lehenga", sort: "featured" },
  { label: "Festive", occasion: "festival", category: "All", sort: "featured" },
  { label: "Collections", occasion: null, category: "All", sort: "featured" },
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const count = cartCount();

  function handleNavClick(occasion: string | null, category: string, sort: string) {
    setActiveOccasion(occasion);
    useStore.getState().setActiveCategory(category);
    useStore.getState().setActiveSort(sort);
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
          {/* Left nav — hidden on mobile */}
          <nav className="g-nav" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <button key={link.label} className="g-nav-link" onClick={() => handleNavClick(link.occasion, link.category, link.sort)}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Centre logo */}
          <Logo onClick={() => { setRoute("home"); setMobileOpen(false); }} />

          {/* Right nav + icons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0 }}>
            <nav className="g-nav" style={{ marginRight: "var(--sp-3)" }} aria-label="Secondary navigation">
              {NAV_LINKS.slice(3).map((link) => (
                <button key={link.label} className="g-nav-link" onClick={() => handleNavClick(link.occasion, link.category, link.sort)}>
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="g-header-icons">
              <button className="g-icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <MagnifyingGlass size={22} />
              </button>
              <button className="g-icon-btn g-hide-mobile" aria-label="Wishlist" onClick={() => { setRoute("favorites"); setMobileOpen(false); }}>
                <Heart size={22} />
              </button>
              <button className="g-icon-btn g-hide-mobile" aria-label="Profile" onClick={() => { setRoute("profile"); setMobileOpen(false); }}>
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
              {/* Hamburger — visible only on mobile via CSS */}
              <button
                className="g-icon-btn g-hamburger"
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

      {/* Mobile full-screen menu */}
      <div className="g-mobile-menu" data-open={mobileOpen} aria-hidden={!mobileOpen}>
        <div className="g-mobile-menu-head">
          <Logo onClick={() => { setRoute("home"); setMobileOpen(false); }} />
          <button className="g-icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="g-mobile-nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className="g-mobile-nav-link"
              onClick={() => handleNavClick(link.occasion, link.category, link.sort)}
            >
              {link.label}
              <span style={{ fontSize: 18, opacity: 0.4 }}>›</span>
            </button>
          ))}
        </nav>

        <div className="g-mobile-nav-icons">
          <button className="g-icon-btn" aria-label="Search" onClick={() => { setSearchOpen(true); setMobileOpen(false); }}>
            <MagnifyingGlass size={24} />
          </button>
          <button className="g-icon-btn" aria-label="Wishlist" onClick={() => { setRoute("favorites"); setMobileOpen(false); }}>
            <Heart size={24} />
          </button>
          <button className="g-icon-btn" aria-label="Profile" onClick={() => { setRoute("profile"); setMobileOpen(false); }}>
            <User size={24} />
          </button>
          <button
            className="g-icon-btn"
            aria-label={`Shopping bag, ${count} items`}
            onClick={() => { setBagOpen(true); setMobileOpen(false); }}
            style={{ position: "relative" }}
          >
            <ShoppingBag size={24} />
            {count > 0 && (
              <span className="g-badge" aria-hidden>{count > 9 ? "9+" : count}</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
