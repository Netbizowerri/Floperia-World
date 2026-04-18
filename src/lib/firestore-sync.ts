import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncStoreToFirestore = async (collection: string, userId: string, data: any) => {
  if (!userId) return;
  const path = `${collection}/${userId}`;
  try {
    const userDocRef = doc(db, collection, userId);
    await setDoc(userDocRef, { data }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeToFirestoreStore = (collection: string, userId: string, onUpdate: (data: any) => void) => {
  if (!userId) return () => {};
  const path = `${collection}/${userId}`;
  const userDocRef = doc(db, collection, userId);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      onUpdate(doc.data().data);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
