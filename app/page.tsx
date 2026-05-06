"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeScreen } from "@/components/HomeScreen";
import { ListingScreen } from "@/components/ListingScreen";
import { PDPScreen } from "@/components/PDPScreen";
import { BagDrawer } from "@/components/BagDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { ToastNotification } from "@/components/ToastNotification";
import { Chatbot } from "@/components/Chatbot";
import { FavoritesScreen } from "@/components/FavoritesScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { useStore } from "@/lib/store";
import { getProductById } from "@/lib/data";
import type { Product } from "@/lib/types";

function generateOrderNumber() {
  // Called only inside event handlers — impure functions are allowed there
  return `GF${Date.now().toString().slice(-8)}`;
}

export default function Page() {
  const {
    route,
    setRoute,
    activeProductId,
    setActiveProduct,
    setActiveOccasion,
  } = useStore();

  const [orderNumber, setOrderNumber] = useState("");

  const activeProduct = activeProductId ? getProductById(activeProductId) : null;

  const handleViewProduct = useCallback(
    (product: Product) => {
      setActiveProduct(product.id);
      setRoute("pdp");
    },
    [setActiveProduct, setRoute]
  );

  const handleViewListing = useCallback(
    (occasion?: string) => {
      setActiveOccasion(occasion ?? null);
      setRoute("listing");
    },
    [setActiveOccasion, setRoute]
  );

  const handleCheckout = useCallback(() => {
    setRoute("checkout");
  }, [setRoute]);

  const handleConfirm = useCallback(() => {
    setOrderNumber(generateOrderNumber());
    setRoute("confirmation");
  }, [setRoute]);

  const handleContinueShopping = useCallback(() => {
    setRoute("home");
    setActiveProduct(null);
  }, [setRoute, setActiveProduct]);

  const handlePDPBack = useCallback(() => {
    setRoute("listing");
    setActiveProduct(null);
  }, [setRoute, setActiveProduct]);

  const showHeaderFooter = route !== "checkout" && route !== "confirmation";

  return (
    <>
      {showHeaderFooter && <Header />}

      {route === "home" && (
        <HomeScreen
          onViewProduct={handleViewProduct}
          onViewListing={handleViewListing}
        />
      )}

      {route === "listing" && (
        <ListingScreen onViewProduct={handleViewProduct} />
      )}

      {route === "pdp" && activeProduct ? (
        <PDPScreen product={activeProduct} onBack={handlePDPBack} />
      ) : route === "pdp" ? (
        <ListingScreen onViewProduct={handleViewProduct} />
      ) : null}

      {route === "checkout" && (
        <CheckoutScreen
          onBack={() => setRoute("home")}
          onConfirm={handleConfirm}
        />
      )}

      {route === "confirmation" && (
        <ConfirmationScreen
          onContinueShopping={handleContinueShopping}
          orderNumber={orderNumber}
        />
      )}

      {route === "favorites" && (
        <FavoritesScreen onViewProduct={handleViewProduct} />
      )}

      {route === "profile" && <ProfileScreen />}

      {showHeaderFooter && <Footer />}

      {/* Global overlays — always mounted */}
      <BagDrawer onCheckout={handleCheckout} />
      <SearchOverlay onViewProduct={handleViewProduct} />
      <ToastNotification />
      <Chatbot />
    </>
  );
}
