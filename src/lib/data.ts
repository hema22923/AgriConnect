
import type { Product, Order, User } from './types';

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

// Function to add a new user
export const addUser = (user: User) => {
  if (users.find(u => u.email === user.email)) {
    console.warn("User with this email already exists");
    return;
  }
  users.push(user);
};

// Function to update a user
export const updateUser = (email: string, updates: Partial<User>) => {
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
    }
};
