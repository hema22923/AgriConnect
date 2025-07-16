
export type Product = {
  id: string;
  uid: string; // ID of the farmer who created the product
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  aiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  buyerName: string;
  buyerQuestion?: string;
};

export type User = {
  fullName: string;
  email: string;
  password?: string; // Optional for security reasons in a real app
  role: 'buyer' | 'farmer' | 'admin';
};
