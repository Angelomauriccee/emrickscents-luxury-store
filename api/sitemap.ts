import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const SITE_URL = 'https://emrickscents.com';

const STATIC_PATHS = ['/', '/shop', '/about', '/contact', '/store-locator', '/build-your-box'];

function getDb() {
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
    });
  }
  return getFirestore();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(_req: any, res: any) {
  try {
    const db = getDb();
    const snap = await getDocs(collection(db, 'products'));
    const productPaths = snap.docs.map((d) => `/product/${d.id}`);

    const urls = [...STATIC_PATHS, ...productPaths]
      .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(xml);
  } catch {
    // Fall back to the static pages only — a Firestore hiccup shouldn't take the whole sitemap down
    const urls = STATIC_PATHS.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  }
}
