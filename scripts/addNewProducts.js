import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(
  process.cwd(),
  "scripts",
  "serviceAccountKey.json",
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const newProducts = [
  {
    id: "maison-asrar-vanilla-voyage",
    name: "Vanilla Voyage",
    brand: "Maison Asrar",
    category: "unisex",
    type: "EDP",
    price: 60000,
    originalPrice: null,
    discount: null,
    size: "100ml",
    image: "/images/may/Vanilla-Voyage-display.jpg",
    images: [
      "/images/may/Vanilla-Voyage-display.jpg",
      "/images/may/Vanilla-Voyage-pack.jpg",
    ],
    description:
      "Vanilla Voyage is a warm, gourmand oriental that charts a course through exotic sweetness and sensual depth. A luminous opening of bergamot and cardamom gives way to a creamy heart of iris and tonka bean, before the voyage anchors in a deeply comforting base of sandalwood, caramelised amber and soft musk — a fragrance that feels like a destination in itself.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Benzoate, Citronellol, Geraniol, Eugenol, Benzyl Salicylate, Benzyl Alcohol, Bergamot, Cardamom, Iris Root, Tonka Bean, Jasmine, Sandalwood, Amber, Musk, Vanilla, Caramel",
    details: {
      topNotes: ["Bergamot, Vanilla, Cardamom"],
      heartNotes: ["Iris, Tonka Bean, Jasmine"],
      baseNotes: ["Sandalwood, Amber, Musk, Caramel"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: "armaf-club-de-nuit-milestone",
    name: "Club de Nuit Milestone",
    brand: "Armaf",
    category: "men",
    type: "EDP",
    price: 75000,
    originalPrice: null,
    discount: null,
    size: "105ml",
    image: "/images/may/Club-de-nuit-milestone-display.jpg",
    images: [
      "/images/may/Club-de-nuit-milestone-display.jpg",
      "/images/may/Club-de-nuit-milestone-pack.jpg",
    ],
    description:
      "Club de Nuit Milestone is a bold declaration of masculine achievement — an opulent oriental woody fragrance built for the man who commands attention. Vibrant citrus and tropical fruit open theatrically, evolving into a sophisticated floral-woody heart before settling into a rich, sensual base of vanilla, musk and ambergris that lingers with quiet authority.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Salicylate, Citronellol, Geraniol, Eugenol, Citral, Benzyl Benzoate, Benzyl Alcohol, Apple, Pineapple, Blackcurrant, Bergamot, Lemon, Jasmine, Birch, Rose, Vanilla, Musk, Ambergris, Patchouli",
    details: {
      topNotes: ["Apple, Pineapple, Blackcurrant, Bergamot"],
      heartNotes: ["Jasmine, Birch, Rose"],
      baseNotes: ["Vanilla, Musk, Ambergris, Patchouli"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: "amouage-guidance-46-edp",
    name: "Guidance 46 EDP",
    brand: "Amouage",
    category: "men",
    type: "EDP",
    price: 865000,
    originalPrice: null,
    discount: null,
    size: "100ml",
    image: "/images/may/Amouage-Guidance-46-display.jpg",
    images: [
      "/images/may/Amouage-Guidance-46-display.jpg",
      "/images/may/Amouage-Guidance-46-pack.jpg",
      "/images/may/Amouage-Guidance-46.jpg",
    ],
    description:
      "Amouage Guidance 46 is an authoritative statement from the house that defined Arabian luxury perfumery. A luminous accord of bergamot and cardamom charts a bold course into a complex heart of geranium, jasmine and elemi resin. The journey culminates in a commanding foundation of sandalwood, oud and labdanum — a fragrance that projects with effortless, quiet confidence.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Salicylate, Citronellol, Geraniol, Eugenol, Citral, Benzyl Benzoate, Benzyl Alcohol, Bergamot, Cardamom, Elemi, Geranium, Jasmine, Rose Absolute, Sandalwood, Oud, Labdanum, Vetiver",
    details: {
      topNotes: ["Bergamot, Cardamom, Elemi"],
      heartNotes: ["Geranium, Jasmine, Rose Absolute"],
      baseNotes: ["Sandalwood, Oud, Labdanum, Vetiver"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: "armaf-club-de-nuit-precieux-iv",
    name: "Club de Nuit Precieux IV",
    brand: "Armaf",
    category: "men",
    type: "EDP",
    price: 115000,
    originalPrice: null,
    discount: null,
    size: "100ml",
    image: "/images/armaf-precieux-i-club-de-nuit-extrait-display.jpeg",
    images: [
      "/images/armaf-precieux-i-club-de-nuit-extrait-display.jpeg",
      "/images/armaf-precieux-i-club-de-nuit-extrait-pack.jpeg",
    ],
    description:
      "Club de Nuit Precieux IV is the crown jewel of Armaf's prestige collection — an intensely rich oriental with oud at its soul. Spiced citrus and elemi open with theatrical force before yielding to a smoky, resinous heart of oud and tobacco. A commanding base of amber, vanilla and sandalwood completes this sumptuous composition with extraordinary depth and longevity.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Salicylate, Citronellol, Geraniol, Eugenol, Citral, Benzyl Benzoate, Benzyl Alcohol, Bergamot, Elemi, Cardamom, Oud, Tobacco, Jasmine, Amber, Vanilla, Sandalwood, Musk",
    details: {
      topNotes: ["Bergamot, Elemi, Cardamom"],
      heartNotes: ["Oud, Tobacco, Jasmine"],
      baseNotes: ["Amber, Vanilla, Sandalwood, Musk"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: "smoky-leather",
    name: "Smoky Leather",
    brand: "Armaf",
    category: "men",
    type: "EDP",
    price: 40000,
    originalPrice: null,
    discount: null,
    size: "100ml",
    image: "/images/may/smoky-leather-display.jpg",
    images: ["/images/may/smoky-leather-display.jpg"],
    description:
      "Smoky Leather is a raw, unapologetic masculine statement for those who make an impression without trying. A sharp opening of bergamot and black pepper cuts through to a rich heart of birch tar, vetiver and supple leather. The dry-down smoulders with smokewood, amber and earthy oakmoss — a trail that commands a room long after you have left it.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Salicylate, Citronellol, Geraniol, Eugenol, Benzyl Benzoate, Benzyl Alcohol, Bergamot, Black Pepper, Birch Tar, Vetiver, Leather, Smokewood, Amber, Musk, Oakmoss",
    details: {
      topNotes: ["Bergamot, Black Pepper, Aldehydes"],
      heartNotes: ["Birch Tar, Vetiver, Leather"],
      baseNotes: ["Smokewood, Amber, Musk, Oakmoss"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: "penhaligons-halfeti-edp",
    name: "Halfeti EDP",
    brand: "Penhaligon's",
    category: "men",
    type: "EDP",
    price: 635000,
    originalPrice: null,
    discount: null,
    size: "100ml",
    image: "/images/may/Penhaligons-Halfeti-edp-display.jpg",
    images: [
      "/images/may/Penhaligons-Halfeti-edp-display.jpg",
      "/images/may/Penhaligons-Halfeti-edp-pack.jpg",
    ],
    description:
      'Named after the legendary "Valley of Disappearing Villages" on the Euphrates, Halfeti is Penhaligon\'s darkest and most opulent creation. Turkish black rose and aromatic oud intertwine with cardamom, saffron and pink pepper to form an unforgettable floral-oriental heart, before settling into a warm, vanillic amber base of devastating depth and lasting power.',
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Salicylate, Citronellol, Geraniol, Eugenol, Citral, Benzyl Benzoate, Benzyl Alcohol, Bergamot, Cardamom, Saffron, Pink Pepper, Turkish Rose, Oud, Jasmine, Sandalwood, Vanilla, Amber, Musk",
    details: {
      topNotes: ["Bergamot, Cardamom, Saffron, Pink Pepper"],
      heartNotes: ["Turkish Rose, Oud, Jasmine"],
      baseNotes: ["Vanilla, Amber, Sandalwood, Musk"],
    },
    isNew: true,
    inStock: true,
    featured: false,
    collection: null,
    rating: null,
    reviewCount: null,
    createdAt: FieldValue.serverTimestamp(),
  },
];

async function run() {
  const productsCol = db.collection("products");

  // Step 1: flip all existing isNew=true products to false
  console.log("Clearing existing isNew flags...");
  const existingSnap = await productsCol.where("isNew", "==", true).get();
  const batch1 = db.batch();
  existingSnap.docs.forEach((d) => batch1.update(d.ref, { isNew: false }));
  if (!existingSnap.empty) await batch1.commit();
  console.log(`  Cleared isNew on ${existingSnap.size} product(s)`);

  // Step 2: add/overwrite new products
  console.log("Writing new products...");
  const batch2 = db.batch();
  for (const product of newProducts) {
    const ref = productsCol.doc(product.id);
    batch2.set(ref, product, { merge: true });
  }
  await batch2.commit();
  console.log(`  Wrote ${newProducts.length} product(s)`);

  console.log("Done.");
}

run().catch(console.error);
