
import type { Product, Order, User } from './types';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';


// Let's start with some dummy products
export let products: Product[] = [];

export let orders: Order[] = [];

// Simulate a user database
export let users: User[] = [
    { fullName: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
];


// Function to add a new product
export const addProduct = (product: Product) => {
  products.unshift(product);
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