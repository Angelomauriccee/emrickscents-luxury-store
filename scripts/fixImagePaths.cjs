const admin = require('firebase-admin')
const path = require('path')

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'emrickscents-dd8d0',
})

const db = admin.firestore()

async function fixImagePaths() {
  console.log('Fetching all products...')

  const snapshot = await db.collection('products').get()
  console.log(`Found ${snapshot.size} products`)

  const BATCH_SIZE = 499
  let batch = db.batch()
  let count = 0
  let updated = 0

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    let needsUpdate = false
    const updates = {}

    // Fix primary image path
    if (data.image && data.image !== data.image.toLowerCase()) {
      updates.image = data.image.toLowerCase()
      needsUpdate = true
    }

    // Fix all images in the images array
    if (Array.isArray(data.images)) {
      const fixedImages = data.images.map(img =>
        typeof img === 'string' ? img.toLowerCase() : img
      )
      const hasChanges = fixedImages.some(
        (img, i) => img !== data.images[i]
      )
      if (hasChanges) {
        updates.images = fixedImages
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      batch.update(docSnap.ref, updates)
      count++
      updated++

      if (count === BATCH_SIZE) {
        await batch.commit()
        console.log(`Committed batch — ${updated} updated so far`)
        batch = db.batch()
        count = 0
      }
    }
  }

  // Commit remaining
  if (count > 0) {
    await batch.commit()
  }

  console.log(`\nDone. ${updated} products had image paths updated.`)
  process.exit(0)
}

fixImagePaths().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
