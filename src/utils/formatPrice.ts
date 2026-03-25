export function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return '';
  return '₦' + Number(amount).toLocaleString('en-NG');
}
