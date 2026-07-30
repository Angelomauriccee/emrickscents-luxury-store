import { Product } from '../types';

/** Brand + name reads better for image search than the bare product name (e.g. "Vanilla Voyage" alone drops "Maison Asrar"). */
export function productAltText(product: Pick<Product, 'name' | 'brand'>): string {
  return product.brand ? `${product.brand} ${product.name}` : product.name;
}
