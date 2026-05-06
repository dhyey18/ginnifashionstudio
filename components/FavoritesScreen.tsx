"use client";

import { useStore } from "@/lib/store";
import { getProductById } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface FavoritesScreenProps {
  onViewProduct: (product: Product) => void;
}

export function FavoritesScreen({ onViewProduct }: FavoritesScreenProps) {
  const { favourites, setRoute } = useStore();
  const favoriteProducts = Array.from(favourites)
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          <button
            onClick={() => setRoute("listing")}
            className="text-sm font-medium text-pink-600 hover:text-pink-700 underline underline-offset-4"
          >
            Continue Shopping
          </button>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={() => onViewProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Save items you love so you can find them later and add them to your bag.
            </p>
            <button
              onClick={() => setRoute("listing")}
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
