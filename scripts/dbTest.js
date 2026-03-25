import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// read sync relatively to script file location correctly
const serviceAccountPath = path.join(process.cwd(), 'scripts', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkDocs() {
  const snapshot = await db.collection('products').limit(5).get();
  snapshot.docs.forEach(doc => {
    console.log(doc.id, '=>', Object.keys(doc.data()));
  });

  const allSnap = await db.collection('products').get();
  
  const brands = new Set();
  allSnap.docs.forEach(d => {
    const data = d.data();
    if (data.brand) {
      brands.add(data.brand);
    } else {
      // derive brand from name
      const name = data.name;
      const firstWord = name.split(' ')[0];
      brands.add(firstWord);
    }
  });

  console.log('Unique Brands found:', Array.from(brands));
  console.log('Total documents:', allSnap.size);
}

checkDocs().catch(console.error);
