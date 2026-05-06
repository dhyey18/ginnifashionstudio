"use client";

import { create } from "zustand";
import type { CartLine, Product, Toast, Route } from "./types";

interface AppState {
  // Cart
  cartLines: CartLine[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;

  // Favourites
  favourites: Set<string>;
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;

  // UI State
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Navigation
  route: Route;
  setRoute: (route: Route) => void;
  activeProductId: string | null;
  setActiveProduct: (id: string | null) => void;
  activeOccasion: string | null;
  setActiveOccasion: (occasion: string | null) => void;

  // User Profile
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setUser: (user: Partial<AppState["user"]>) => void;

  // Toast

export const useStore = create<AppState>((set, get) => ({
  // Cart
  cartLines: [],

  addToCart: (product, size, color) => {
    const lines = get().cartLines;
    const existing = lines.find(
      (l) =>
        l.product.id === product.id && l.size === size && l.color === color
    );
    if (existing) {
      set({
        cartLines: lines.map((l) =>
          l.product.id === product.id && l.size === size && l.color === color
            ? { ...l, quantity: l.quantity + 1 }
            : l
        ),
      });
    } else {
      set({ cartLines: [...lines, { product, size, color, quantity: 1 }] });
    }
    get().showToast(`${product.name} added to bag`, "success");
  },

  removeFromCart: (productId, size, color) => {
    set({
      cartLines: get().cartLines.filter(
        (l) =>
          !(
            l.product.id === productId &&
            l.size === size &&
            l.color === color
          )
      ),
    });
  },

  updateQuantity: (productId, size, color, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, size, color);
      return;
    }
    set({
      cartLines: get().cartLines.map((l) =>
        l.product.id === productId && l.size === size && l.color === color
          ? { ...l, quantity }
          : l
      ),
    });
  },

  clearCart: () => set({ cartLines: [] }),

  cartCount: () =>
    get().cartLines.reduce((sum, l) => sum + l.quantity, 0),

  cartTotal: () =>
    get().cartLines.reduce(
      (sum, l) => sum + l.product.price * l.quantity,
      0
    ),

  // Favourites
  favourites: new Set<string>(),

  toggleFavourite: (productId) => {
    const favs = new Set(get().favourites);
    if (favs.has(productId)) {
      favs.delete(productId);
    } else {
      favs.add(productId);
    }
    set({ favourites: favs });
  },

  isFavourite: (productId) => get().favourites.has(productId),

  // UI State
  bagOpen: false,
  setBagOpen: (open) => set({ bagOpen: open }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  // Navigation
  route: "home",
  setRoute: (route) => set({ route }),
  activeProductId: null,
  setActiveProduct: (id) => set({ activeProductId: id }),
  activeOccasion: null,
  setActiveOccasion: (occasion) => set({ activeOccasion: occasion }),

  // User Profile
  user: {
    name: "Ginni Fashion",
    email: "ginni@fashion.studio",
    phone: "+91 98765 43210",
    address: "123, Fashion Hub, Surat, Gujarat, India",
  },
  setUser: (userData) =>
    set((state) => ({ user: { ...state.user, ...userData } })),

  // Toast
  toast: null,
  showToast: (message, variant = "success") => {
    set({ toast: { message, variant } });
    setTimeout(() => get().dismissToast(), 3500);
  },
  dismissToast: () => set({ toast: null }),
}));
