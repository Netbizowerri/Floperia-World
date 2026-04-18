import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { CATEGORIES, PRODUCTS } from '../src/data/mock';

const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
serviceAccount.private_key = serviceAccount.private_key
  .replace(/\\n/g, '\n')
  .split('\n')
  .map((line: string) => line.trim())
  .join('\n');
console.log('🔑 Private Key Preview:', serviceAccount.private_key.substring(0, 50) + '...');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
  console.log('🚀 Starting Backend Migration to floperia-c37bf...');

  // Migrate Categories
  console.log('📦 Migrating Categories...');
  for (const cat of CATEGORIES) {
    await db.collection('categories').doc(cat.id).set(cat);
    console.log(`✅ Category: ${cat.label}`);
  }

  // Migrate Products
  console.log('🛍️ Migrating Products...');
  for (const prod of PRODUCTS) {
    await db.collection('products').doc(prod.id).set({
      ...prod,
      stockCount: 50,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Product: ${prod.name}`);
  }

  // Setup Admin User
  console.log('👤 Setting up Admin User...');
  const adminEmail = 'service.floperia@gmail.com';
  try {
    const user = await admin.auth().getUserByEmail(adminEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`👑 Admin claims set for ${adminEmail}`);
  } catch (error) {
    console.log(`⚠️ User ${adminEmail} not found in Auth yet. They will need to sign up first.`);
  }

  console.log('🎉 Migration Complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration Failed:', err);
  process.exit(1);
});
