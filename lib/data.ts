import type { Product, Collection, Occasion } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "gf-001",
    name: "Rashmika Floral Anarkali",
    price: 3499,
    originalPrice: 4999,
    category: "Anarkali",
    occasion: ["festival", "wedding", "party"],
    colors: ["#C0392B", "#8E44AD", "#2980B9"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    fabric: "Georgette",
    pattern: "floral",
    description:
      "A stunning full-length anarkali adorned with delicate floral embroidery. Crafted from premium georgette with intricate zari work on the yoke and hem, this piece makes a statement at every festive occasion. Comes with a matching churidar and dupatta.",
    care: "Dry clean only. Store in a breathable garment bag.",
    sku: "GF-ANR-001",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "gf-002",
    name: "Meena Zari Silk Saree",
    price: 6299,
    originalPrice: 8500,
    category: "Saree",
    occasion: ["wedding", "festival", "formal"],
    colors: ["#D4AC0D", "#1A5276", "#A93226"],
    sizes: ["Free Size"],
    fabric: "Pure Silk",
    pattern: "zari",
    description:
      "Timeless Banarasi-inspired silk saree with heavy zari border and pallu. The rich gold weave on deep jewel tones creates a regal look perfect for weddings and festive celebrations. Each piece is handwoven by skilled artisans.",
    care: "Dry clean only. Do not wring or tumble dry.",
    sku: "GF-SAR-002",
    rating: 4.9,
    reviewCount: 89,
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: "gf-003",
    name: "Priya Block Print Kurta Set",
    price: 1899,
    originalPrice: 2499,
    category: "Kurta Set",
    occasion: ["casual", "office", "festival"],
    colors: ["#E8D5C4", "#5D6D7E", "#1E8449"],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Cotton",
    pattern: "block",
    description:
      "Breezy cotton kurta set featuring traditional block-print motifs. The three-piece set includes a straight kurta, palazzo pants, and a printed dupatta. Perfect for everyday elegance with a bohemian flair.",
    care: "Machine wash cold, gentle cycle. Dry in shade.",
    sku: "GF-KRT-003",
    rating: 4.6,
    reviewCount: 203,
    isNew: true,
  },
  {
    id: "gf-004",
    name: "Divya Mirror Work Lehenga",
    price: 8999,
    originalPrice: 12000,
    category: "Lehenga",
    occasion: ["wedding", "party", "festival"],
    colors: ["#922B21", "#1A5276", "#1E8449"],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Raw Silk",
    pattern: "mirror",
    description:
      "Opulent lehenga choli with intricate mirror work and sequin embellishments. The flared skirt features over 500 hand-set mirrors that catch light beautifully. Comes with a heavily embroidered choli and matching dupatta.",
    care: "Dry clean only. Store flat to prevent mirror damage.",
    sku: "GF-LHG-004",
    rating: 4.7,
    reviewCount: 67,
    isBestseller: true,
  },
  {
    id: "gf-005",
    name: "Sunaina Chanderi Suit",
    price: 2799,
    originalPrice: 3500,
    category: "Suit",
    occasion: ["office", "casual", "festival"],
    colors: ["#F0E6D3", "#7D6608", "#117A65"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Chanderi",
    pattern: "floral",
    description:
      "Elegant Chanderi silk suit with fine floral embroidery on the neckline and cuffs. The lightweight fabric drapes beautifully making it ideal for long days at the office or casual outings. Includes an unstitched salwar piece.",
    care: "Hand wash in cold water with mild detergent.",
    sku: "GF-SUT-005",
    rating: 4.5,
    reviewCount: 156,
  },
  {
    id: "gf-006",
    name: "Kavya Palazzo Set",
    price: 1599,
    category: "Palazzo Set",
    occasion: ["casual", "beach", "party"],
    colors: ["#F1948A", "#82E0AA", "#85C1E9"],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Rayon",
    pattern: "block",
    description:
      "Vibrant rayon palazzo set with bold block-print patterns. The relaxed fit palazzo paired with a crop top makes a contemporary style statement. Comfortable enough for day-long wear, stylish enough for evening outings.",
    care: "Machine wash cold. Iron on medium heat.",
    sku: "GF-PAL-006",
    rating: 4.4,
    reviewCount: 178,
    isNew: true,
  },
  {
    id: "gf-007",
    name: "Ananya Embroidered Dupatta",
    price: 899,
    originalPrice: 1200,
    category: "Dupatta",
    occasion: ["wedding", "festival", "formal"],
    colors: ["#F9E79F", "#FDEBD0", "#D5F5E3"],
    sizes: ["Free Size"],
    fabric: "Chiffon",
    pattern: "zari",
    description:
      "Luxurious chiffon dupatta with heavy zari embroidery on all four borders. The delicate fabric with golden thread work adds grace to any outfit. A versatile piece that elevates even a simple kurta.",
    care: "Dry clean only. Handle with care.",
    sku: "GF-DUP-007",
    rating: 4.6,
    reviewCount: 92,
    isBestseller: true,
  },
  {
    id: "gf-008",
    name: "Ishita Bandhani Gown",
    price: 4299,
    originalPrice: 5500,
    category: "Gown",
    occasion: ["party", "wedding", "festival"],
    colors: ["#C0392B", "#8E44AD", "#F39C12"],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Georgette",
    pattern: "mirror",
    description:
      "Contemporary floor-length gown featuring traditional Bandhani tie-dye technique with modern mirror work accents. The flowy georgette creates a dreamy silhouette perfect for destination weddings and cocktail parties.",
    care: "Dry clean recommended. Machine wash cold on delicate cycle.",
    sku: "GF-GWN-008",
    rating: 4.7,
    reviewCount: 53,
    isNew: true,
    isFeatured: true,
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "col-festive",
    name: "Festive Edit",
    tagline: "Celebrate in colour",
    accent: "var(--g-gold-500)",
  },
  {
    id: "col-wedding",
    name: "Bridal Trousseau",
    tagline: "Your forever looks",
    accent: "var(--g-rose-600)",
  },
  {
    id: "col-everyday",
    name: "Everyday Chic",
    tagline: "Effortless ethnic",
    accent: "var(--g-ink-600)",
  },
];

export const OCCASIONS: Occasion[] = [
  { id: "wedding", name: "Wedding", emoji: "💍" },
  { id: "festival", name: "Festival", emoji: "🪔" },
  { id: "party", name: "Party", emoji: "✨" },
  { id: "office", name: "Office", emoji: "💼" },
  { id: "casual", name: "Casual", emoji: "☀️" },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByOccasion(occasion: string): Product[] {
  return PRODUCTS.filter((p) => p.occasion.includes(occasion));
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBestseller);
}

export function fmtINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
