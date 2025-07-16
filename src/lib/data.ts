import type { Product, Order } from './types';

// Let's start with some dummy products
export let products: Product[] = [];

export let orders: Order[] = [];

// Function to add a new product
export const addProduct = (product: Product) => {
  products.unshift(product);
};
