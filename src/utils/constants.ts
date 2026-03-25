export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;

export const BRANDS = [
  'Afnan',
  'Amouage',
  'Armaf',
  'Azzaro',
  'Bentley',
  'Bulgari',
  'Calvin Klein',
  'Chanel',
  'Dior',
  'Hugo Boss',
  'Tom Ford',
  'YSL',
];

export const FILTER_PILLS = [
  { label: 'All', value: null as string | null, param: null as string | null },
  { label: "Men's", value: 'men', param: 'category' },
  { label: "Women's", value: 'women', param: 'category' },
  { label: 'New Arrivals', value: 'true', param: 'isNew' },
  { label: 'Limited Edition', value: 'limited', param: 'collection' },
  { label: 'Signature', value: 'signature', param: 'collection' },
];

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'A–Z', value: 'az' },
];

export const PRODUCTS_PER_PAGE = 8;

export const STORE_INFO = {
  name: 'Emrickscents Flagship Boutique',
  address: 'Ogudu Mall, Suite 12B, Ogudu Rd, Ojota, Lagos',
  hours: 'Mon–Sat 10:00–20:00 · Sun 12:00–18:00',
  coords: { lat: 6.5793, lng: 3.3843 },
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Build Your Box', path: '/build-your-box' },
  { label: 'About', path: '/about' },
  { label: 'Store Locator', path: '/store-locator' },
  { label: 'Contact', path: '/contact' },
];
