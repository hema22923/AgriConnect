
import type { Product, Order, User } from './types';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDocs, getDoc, deleteDoc, query, where, writeBatch, runTransaction, Timestamp } from 'firebase/firestore';


// This will hold products fetched from Firestore
export let products: Product[] = [];

// This will hold orders fetched from Firestore
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

// Function to fetch a single product by its ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
        const productDocRef = doc(db, 'products', id);
        const productSnap = await getDoc(productDocRef);
        if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error("Error fetching product by ID: ", error);
        return null;
    }
};

// Function to add a new product to Firestore
export const addProduct = async (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
  try {
    const productWithRating = {
        ...product,
        rating: 0,
        reviewCount: 0,
    };
    const docRef = await addDoc(collection(db, "products"), productWithRating);
    console.log("Product written with ID: ", docRef.id);
    await fetchProducts(); // Refresh the local cache
  } catch (e) {
    console.error("Error adding product: ", e);
  }
};

// Function to update a product in Firestore
export const updateProduct = async (id: string, updates: Partial<Product>) => {
    const productDocRef = doc(db, 'products', id);
    try {
        await updateDoc(productDocRef, updates);
        await fetchProducts(); // Refresh the local cache
    } catch (error) {
        console.error("Error updating product: ", error);
    }
};

// Function to delete a product from Firestore
export const deleteProduct = async (id: string) => {
    const productDocRef = doc(db, 'products', id);
    try {
        await deleteDoc(productDocRef);
        await fetchProducts(); // Refresh the local cache
    } catch (error) {
        console.error("Error deleting product: ", error);
    }
};

// Function to fetch orders for a specific user (buyer)
export const fetchOrdersForUser = async (userId: string): Promise<Order[]> => {
    try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, where("userId", "==", userId));
        const orderSnapshot = await getDocs(q);
        const userOrders = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        // Sort by date descending
        return userOrders.sort((a, b) => (b.date as Timestamp).seconds - (a.date as Timestamp).seconds);
    } catch (e) {
        console.error("Error fetching user orders: ", e);
        return [];
    }
};

// Function to fetch orders for a specific farmer
export const fetchOrdersForFarmer = async (farmerId: string): Promise<Order[]> => {
    try {
        // Firestore does not support querying for a value within an array of objects directly in a scalable way.
        // The correct approach is to fetch all orders and filter them on the client-side or use a more complex data structure/Cloud Function.
        // For this app, client-side filtering is sufficient.
        const ordersCollection = collection(db, 'orders');
        const allOrdersSnapshot = await getDocs(ordersCollection);

        const farmerOrders: Order[] = [];
        allOrdersSnapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() } as Order;
            // Check if any item in the order belongs to the farmer
            if (order.items.some(item => item.sellerId === farmerId)) {
                farmerOrders.push(order);
            }
        });

        // Sort by date descending
        return farmerOrders.sort((a, b) => (b.date as Timestamp).seconds - (a.date as Timestamp).seconds);
    } catch (e) {
        console.error("Error fetching farmer orders: ", e);
        return [];
    }
};

// Function to update a product's rating
export const updateProductRating = async (productId: string, newRating: number) => {
    const productRef = doc(db, 'products', productId);
    try {
        await runTransaction(db, async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists()) {
                throw "Product does not exist!";
            }
            const productData = productDoc.data() as Product;
            const oldRating = productData.rating || 0;
            const oldReviewCount = productData.reviewCount || 0;

            const newReviewCount = oldReviewCount + 1;
            const newAverageRating = ((oldRating * oldReviewCount) + newRating) / newReviewCount;

            transaction.update(productRef, {
                rating: newAverageRating,
                reviewCount: newReviewCount
            });
        });
    } catch (error) {
        console.error("Error updating product rating: ", error);
        throw error; // Re-throw to be caught by the caller
    }
};


// Function to mark an item in an order as rated
export const updateOrderItemAsRated = async (orderId: string, productId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
            const orderData = orderDoc.data() as Order;
            const updatedItems = orderData.items.map(item =>
                item.productId === productId ? { ...item, isRated: true } : item
            );
            await updateDoc(orderRef, { items: updatedItems });
        }
    } catch (error) {
        console.error("Error marking item as rated: ", error);
        throw error;
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
