export interface ProductDetails {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: 'men' | 'women' | 'unisex';
  type: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  size: string;
  image: string;
  images: string[];
  description: string;
  ingredients?: string;
  details: ProductDetails;
  isNew: boolean;
  inStock: boolean;
  featured: boolean;
  collection: 'limited' | 'signature' | '' | null;
  rating: number;
  reviewCount: number;
  createdAt?: unknown;
}

export interface BoxProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  type: string;
  category?: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  type: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  // Legacy box fields (kept for backward compat)
  isCustomBox?: boolean;
  boxItems?: Product[];
  ribbon?: string;
  recipientName?: string;
  giftMessage?: string;
  // New box fields
  isBox?: boolean;
  boxProducts?: BoxProduct[];
  boxRibbon?: { name: string; color: string } | null;
  boxGiftMessage?: string;
  boxCategory?: 'men' | 'women' | 'unisex';
}

export interface ActiveFilters {
  category: string | null;
  brand: string | null;
  collection: string | null;
  isNew: boolean | null;
  sortBy: string;
  size: string | null;
  priceRange: string | null;
}

export interface ProductsResult {
  products: Product[];
  lastDoc: unknown;
  hasMore: boolean;
}

export interface GetProductsOptions {
  category?: string | null;
  brand?: string | null;
  collection?: string | null;
  isNew?: boolean | null;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  pageSize?: number;
  lastDoc?: unknown;
}
