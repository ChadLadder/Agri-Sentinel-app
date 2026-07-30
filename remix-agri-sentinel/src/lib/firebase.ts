import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(config) : getApp();
export const auth = getAuth(app);
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId) 
  : getFirestore(app);

export { signInAnonymously, onAuthStateChanged };
export type { User };

// Helper: Ensure anonymous login for persistent user sessions
export async function ensureAnonymousUser(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Firebase anonymous auth error:', err);
    return null;
  }
}

// Save Advisory Run History to Firestore
export async function saveAdvisoryHistory(userId: string, advisoryData: any) {
  try {
    const historyRef = collection(db, 'users', userId, 'advisoryHistory');
    await addDoc(historyRef, {
      ...advisoryData,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to save advisory to Firestore:', err);
  }
}

// Fetch Advisory Run History from Firestore
export async function fetchAdvisoryHistory(userId: string) {
  try {
    const historyRef = collection(db, 'users', userId, 'advisoryHistory');
    const q = query(historyRef, orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Failed to fetch advisory history:', err);
    return [];
  }
}

// Save Custom Dataset to Firestore
export async function saveUserDatasetCloud(userId: string, csvContent: string) {
  try {
    const docRef = doc(db, 'users', userId, 'datasets', 'custom_csv');
    await setDoc(docRef, {
      csvContent,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to save custom dataset to Firestore:', err);
  }
}

// Fetch Custom Dataset from Firestore
export async function fetchUserDatasetCloud(userId: string): Promise<string | null> {
  try {
    const docRef = doc(db, 'users', userId, 'datasets', 'custom_csv');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().csvContent || null;
    }
  } catch (err) {
    console.warn('Failed to fetch custom dataset from Firestore:', err);
  }
  return null;
}
