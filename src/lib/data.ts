
import type { Product, Order, User } from './types';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, setDoc, getDocs, getDoc, deleteDoc, query, where, writeBatch, runTransaction, Timestamp, onSnapshot } from 'firebase/firestore';


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

// Real-time subscription to a buyer's orders
export const subscribeToOrders = (userId: string, callback: (orders: Order[]) => void) => {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        const sortedOrders = userOrders.sort((a, b) => (b.date as Timestamp).seconds - (a.date as Timestamp).seconds);
        callback(sortedOrders);
    }, (error) => {
        console.error("Error subscribing to orders: ", error);
    });

    return unsubscribe; // Return the unsubscribe function to be called on cleanup
};


// Function to fetch orders for a specific farmer
export const fetchOrdersForFarmer = async (farmerId: string): Promise<Order[]> => {
    try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, where("items", "array-contains-any", [{ sellerId: farmerId }]));
        const allOrdersSnapshot = await getDocs(ordersCollection);

        const farmerOrders: Order[] = [];
        allOrdersSnapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() } as Order;
            if (order.items.some(item => item.sellerId === farmerId)) {
                farmerOrders.push(order);
            }
        });

        return farmerOrders.sort((a, b) => (b.date as Timestamp).seconds - (a.date as Timestamp).seconds);
    } catch (e) {
        console.error("Error fetching farmer orders: ", e);
        return [];
    }
};

// Real-time subscription to a farmer's orders
export const subscribeToFarmerOrders = (farmerId: string, callback: (orders: Order[]) => void) => {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where('items.sellerId', '==', farmerId)); // This query won't work as intended.
    
    // Firestore can't query inside an array of objects like this. We fetch all and filter client-side.
    // This is not efficient for large scale, but acceptable for this project's scope.
    // For a production app, a Cloud Function would be used to denormalize data.
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const farmerOrders: Order[] = [];
        snapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data() } as Order;
            if (order.items.some(item => item.sellerId === farmerId)) {
                farmerOrders.push(order);
            }
        });

        const sortedOrders = farmerOrders.sort((a, b) => (b.date as Timestamp).seconds - (a.date as Timestamp).seconds);
        callback(sortedOrders);
    }, (error) => {
        console.error("Error subscribing to farmer orders: ", error);
    });

    return unsubscribe;
};

// Function for a farmer to update the status of an order
export const updateOrderStatus = async (orderId: string, status: 'Delivered' | 'Cancelled') => {
    const orderRef = doc(db, 'orders', orderId);
    try {
        await updateDoc(orderRef, { status: status });
    } catch (error) {
        console.error("Error updating order status: ", error);
        throw error;
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
