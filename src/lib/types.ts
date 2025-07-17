
export type Product = {
  id: string;
  uid: string; // ID of the farmer who created the product
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  aiHint: string;
  stock: number;
  rating: number;
  reviewCount: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  sellerId: string; // The farmer's UID
  name: string;
  price: number;
  quantity: number;
  image: string;
  aiHint: string;
  isRated: boolean;
}

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: any; // Using 'any' for Firestore Timestamp compatibility
  buyerName: string;
  shippingAddress?: string;
  buyerQuestion?: string;
};

export type User = {
  fullName: string;
  email: string;
  password?: string; // Optional for security reasons in a real app
  role: 'buyer' | 'farmer' | 'admin';
  address?: string;
  city?: string;
  zip?: string;
};
