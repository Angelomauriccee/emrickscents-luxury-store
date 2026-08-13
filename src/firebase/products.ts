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
  QueryConstraint,
} from "firebase/firestore";
import { Product, GetProductsOptions, ProductsResult } from "../types";

const PRODUCTS_PER_PAGE = 8;
const productsRef = collection(db, "products");

function cleanImgPath(pathStr: unknown): string {
  if (typeof pathStr !== "string" || !pathStr.trim()) return "";
  const trimmed = pathStr.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function formatDocProduct(d: DocumentSnapshot): Product {
  const data = d.data() || {};
  const rawImages = Array.isArray(data.images) ? data.images : [];
  const cleanImages = rawImages.map(cleanImgPath).filter(Boolean);

  const primaryImage = cleanImgPath(data.image) || cleanImages[0] || "/images/placeholder.svg";

  return {
    ...data,
    id: d.id,
    image: primaryImage,
    images: cleanImages.length > 0 ? cleanImages : [primaryImage],
  } as Product;
}

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<ProductsResult> {
  const {
    category = null,
    brand = null,
    collection: col = null,
    isNew = null,
    sortBy = "name",
    sortDir = "asc",
    pageSize = PRODUCTS_PER_PAGE,
    lastDoc = null,
  } = options;

  const constraints: QueryConstraint[] = [];

  if (category) constraints.push(where("category", "==", category));
  if (isNew) constraints.push(where("isNew", "==", true));

  const hasFilters = category || brand || col || isNew;
  if (!hasFilters) {
    const sortField =
      sortBy === "name" ? "name" : sortBy === "price" ? "price" : "name";
    constraints.push(orderBy(sortField, sortDir as "asc" | "desc"));
  }

  constraints.push(limit(brand || col ? 200 : pageSize));

  if (lastDoc && !brand && !col) constraints.push(startAfter(lastDoc));

  const q = query(productsRef, ...constraints);
  const snap = await getDocs(q);

  let products = snap.docs.map(formatDocProduct);

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
    hasMore: snap.docs.length === (brand || col ? 200 : pageSize),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const ref = doc(db, "products", slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return formatDocProduct(snap);
}

export async function getFeaturedProducts(count = 4): Promise<Product[]> {
  const q = query(productsRef, where("isNew", "==", true), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map(formatDocProduct);
}

export async function getRelatedProducts(
  currentSlug: string,
  brand: string,
  _col: string | null,
  count = 6,
): Promise<Product[]> {
  const snap = await getDocs(query(productsRef, limit(50)));
  const lower = brand.toLowerCase();
  const all = snap.docs
    .map(formatDocProduct)
    .filter((p) => p.id !== currentSlug && p.inStock !== false);

  const sameBrand = all.filter(
    (p) => p.brand && p.brand.toLowerCase() === lower,
  );
  return (sameBrand.length >= count ? sameBrand : [...sameBrand, ...all.filter((p) => !sameBrand.includes(p))]).slice(0, count);
}

export async function searchProducts(term: string): Promise<Product[]> {
  if (!term || term.length < 2) return [];

  const snap = await getDocs(query(productsRef, orderBy("name")));
  const lower = term.toLowerCase();

  return snap.docs
    .map(formatDocProduct)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.brand?.toLowerCase().includes(lower) ?? false) ||
        (p.description?.toLowerCase().includes(lower) ?? false),
    )
    .slice(0, 12);
}

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
