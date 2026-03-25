import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { Product, GetProductsOptions, ProductsResult } from "../types";

const PRODUCTS_PER_PAGE = 8;
const productsRef = collection(db, "products");

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<ProductsResult> {
  const {
    category = null,
    brand = null,
    collection: col = null,
    isNew = null,
    sortBy = "createdAt",
    sortDir = "desc",
    pageSize = PRODUCTS_PER_PAGE,
    lastDoc = null,
  } = options;

  // NOTE: We avoid leading where() + orderBy() on different fields because
  // that requires a Firestore composite index. Instead, filters go first and
  // we only orderBy when no composite-index-triggering where clauses are used.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const constraints: any[] = [];

  if (category) constraints.push(where("category", "==", category));
  if (isNew) constraints.push(where("isNew", "==", true));

  // Only add orderBy when there are no where clauses (avoids composite index requirement)
  // When filters are active, results are sorted client-side below.
  const hasFilters = category || brand || col || isNew;
  if (!hasFilters) {
    const sortField =
      sortBy === "name" ? "name" : sortBy === "price" ? "price" : "name";
    constraints.push(orderBy(sortField, sortDir as "asc" | "desc"));
  }

  // If we have client-side filters (brand/col), fetch more to ensure we don't miss matches
  constraints.push(limit(brand || col ? 200 : pageSize));

  // startAfter doesn't work well with client-side filtering, but we keep it for normal pagination
  if (lastDoc && !brand && !col) constraints.push(startAfter(lastDoc));

  const q = query(productsRef, ...constraints);
  const snap = await getDocs(q);

  let products = snap.docs.map(
    (d) => ({ ...d.data(), _docRef: d }) as unknown as Product,
  );

  // Client-side filter for brand and collection because they might not exist as root fields
  if (brand) {
    const lowerBrand = brand.toLowerCase();
    products = products.filter(
      (p) =>
        (p.brand && p.brand.toLowerCase() === lowerBrand) ||
        p.name.toLowerCase().includes(lowerBrand),
    );
  }

  if (col) {
    const lowerCol = col.toLowerCase();
    products = products.filter(
      (p) => p.collection && p.collection.toLowerCase() === lowerCol,
    );
  }

  // Client-side sort when filters are active (Firestore can't combine where+orderBy without index)
  if (hasFilters) {
    if (sortBy === "price") {
      products.sort((a, b) =>
        sortDir === "asc" ? a.price - b.price : b.price - a.price,
      );
    } else {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return {
    products,
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const ref = doc(db, "products", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Product;
}

export async function getFeaturedProducts(count = 4): Promise<Product[]> {
  // Simple query — no composite index needed (single where, no orderBy)
  const q = query(productsRef, where("isNew", "==", true), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Product);
}

export async function getRelatedProducts(
  currentSlug: string,
  brand: string,
  _col: string | null,
  count = 6,
): Promise<Product[]> {
  // Fallback: fetch all products then filter client-side
  // (avoids composite index requirement for brand+inStock+orderBy)
  const q = query(productsRef, limit(50));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Product)
    .filter((p) => p.id !== currentSlug && p.inStock !== false)
    .slice(0, count);
}

export async function searchProducts(term: string): Promise<Product[]> {
  if (!term || term.length < 2) return [];

  const snap = await getDocs(query(productsRef, orderBy("name")));
  const lower = term.toLowerCase();

  return snap.docs
    .map((d) => d.data() as Product)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.brand?.toLowerCase().includes(lower) ?? false) ||
        (p.description?.toLowerCase().includes(lower) ?? false),
    )
    .slice(0, 12);
}

// Helper to get last document cursor for pagination
export async function getPageCursor(
  pageNum: number,
  pageSize: number,
): Promise<DocumentSnapshot | null> {
  if (pageNum <= 1) return null;
  const skipCount = (pageNum - 1) * pageSize;
  const q = query(productsRef, orderBy("createdAt", "desc"), limit(skipCount));
  const snap = await getDocs(q);
  return snap.docs[snap.docs.length - 1] || null;
}

// Temporary connection test — remove after confirming ──────
export async function testConnection() {
  const q = query(collection(db, "products"), limit(1));
  const snap = await getDocs(q);
  console.log("Total docs found:", snap.size);
  console.log("First doc:", snap.docs[0]?.data());
}
