import type { Product, Order } from './types';

// Let's start with some dummy products
export let products: Product[] = [
    {
      id: 'prod_1',
      name: 'Organic Strawberries',
      description: 'Freshly picked, sweet, and juicy organic strawberries from our family farm.',
      price: 5.99,
      image: 'https://placehold.co/600x400',
      seller: 'Green Valley Farms',
      aiHint: 'strawberries fruit',
    },
    {
      id: 'prod_2',
      name: 'Heirloom Tomatoes',
      description: 'A colorful assortment of heirloom tomatoes, perfect for salads and sauces.',
      price: 4.50,
      image: 'https://placehold.co/600x400',
      seller: 'Sunny Meadows',
      aiHint: 'tomatoes vegetable',
    },
];

export let orders: Order[] = [];

// Function to add a new product
export const addProduct = (product: Product) => {
  products.unshift(product);
};
