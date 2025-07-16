
import type { Product, Order, User } from './types';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDocs } from 'firebase/firestore';


// This will hold products fetched from Firestore
export let products: Product[] = [];

export let orders: Order[] = [];

// Simulate a user database
export let users: User[] = [
    { fullName: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
];

// Function to fetch all products from Firestore
export const fetchProducts = async () => {
    try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return products;
    } catch (e) {
        console.error("Error fetching products: ", e);
        return [];
    }
}

// Function to add a new product to Firestore
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Product written with ID: ", docRef.id);
    await fetchProducts(); // Refresh the local cache
  } catch (e) {
    console.error("Error adding product: ", e);
  }
};

// Function to add a new user to Firestore
export const addUser = async (uid: string, user: Omit<User, 'password'>) => {
  try {
    await setDoc(doc(db, "users", uid), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};


// Function to update a user in Firestore
export const updateUser = async (uid: string, updates: Partial<User>) => {
    const userDocRef = doc(db, 'users', uid);
    try {
        await updateDoc(userDocRef, updates);
    } catch (error) {
        console.error("Error updating user: ", error);
    }
};
