import { CartItem } from '../types';
import { formatPrice } from './formatPrice';

export function buildWhatsAppUrl(cartItems: CartItem[]): string {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER as string;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const itemLines = cartItems
    .map(
      (item) =>
        `• ${item.name} (${item.size}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  const message = encodeURIComponent(
    `Hello Emrickscents! I'd like to order:\n\n${itemLines}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm my order. Thank you!`
  );

  return `https://wa.me/${number}?text=${message}`;
}
