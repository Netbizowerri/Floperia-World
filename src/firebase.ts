import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { CATEGORIES, PRODUCTS } from './data/mock';
import { Product } from './types';

// Import the provisioned Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// Use the default database if not specified or set to (default)
export const db = (!firebaseConfig.firestoreDatabaseId || firebaseConfig.firestoreDatabaseId === '(default)')
  ? getFirestore(app)
  : getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const ADMIN_EMAILS = ['netbiz0925@gmail.com', 'service.floperia@gmail.com'];
export const ADMIN_UIDS = ['zf1qdx5SvgZ2Weg7bnbhDdngzvh2'];

export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchProductById = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  await setDoc(doc(db, 'products', id), { active: false }, { merge: true });
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: new Date().toISOString(),
    active: true
  });
  return docRef.id;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  await setDoc(doc(db, 'products', id), updates, { merge: true });
};

/**
 * Migration Utility: Mock Data to Firestore
 * Note: Images are stored as URLs in mock, but architecture supports Base64.
 */
export async function migrateData() {
  console.log('🚀 Starting migration to:', firebaseConfig.projectId);
  
  try {
    // Migrate Categories
    console.log('📦 Migrating Categories...');
    for (const cat of CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      console.log(`✅ Category: ${cat.label}`);
    }
    
    // Migrate Products
    console.log('🛍️ Migrating Products...');
    for (const prod of PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), {
        ...prod,
        stockCount: prod.stockCount || 50,
        active: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log(`✅ Product: ${prod.name}`);
    }
    
    console.log('🎉 Migration complete!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Real-time Listeners
 */
export function setupInventoryListener(onLowStock: (products: any[]) => void) {
  const q = query(collection(db, 'products'), where('stockCount', '<=', 5));
  return onSnapshot(q, (snapshot) => {
    const lowStockItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onLowStock(lowStockItems);
  });
}

export function setupCartSync(userId: string, onCartUpdate: (cart: any[]) => void) {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      onCartUpdate(doc.data().cart || []);
    }
  });
}

export const getStats = async () => {
  const productsSnap = await getDocs(collection(db, 'products'));
  const categoriesSnap = await getDocs(collection(db, 'categories'));
  const ordersSnap = await getDocs(collection(db, 'orders'));
  
  return {
    products: productsSnap.size,
    categories: categoriesSnap.size,
    orders: ordersSnap.size,
    revenue: 0 // Placeholder for now
  };
};

export const checkIsAdmin = (user: User | null) => {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email ?? '') || ADMIN_UIDS.includes(user.uid);
};

export const resolveAdminStatus = async (user: User | null) => {
  if (!user) return false;
  if (checkIsAdmin(user)) return true;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.exists() && userDoc.data().role === 'admin';
};
