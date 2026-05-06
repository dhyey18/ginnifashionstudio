export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  occasion: string[];
  colors: string[];
  sizes: string[];
  fabric: string;
  pattern: string;
  description: string;
  care: string;
  sku: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  accent: string;
}

export interface Occasion {
  id: string;
  name: string;
  emoji: string;
}

export interface CartLine {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  message: string;
  variant: ToastVariant;
}

export type Route = "home" | "listing" | "pdp" | "checkout" | "confirmation";
