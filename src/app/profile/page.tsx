
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchProducts, subscribeToFarmerOrders, updateOrderStatus } from "@/lib/data"
import type { Product, Order } from '@/lib/types'
import Image from "next/image"
import { Edit, PlusCircle, Package, ShoppingCart, DollarSign, Home, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useUser } from "@/context/user-context";
import { useEffect, useState, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Timestamp } from "firebase/firestore"

export default function ProfilePage() {
    const { userName, uid, userType, address, city, zip, isLoading: isUserLoading } = useUser();
    const router = useRouter();
    const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
    const [farmerOrders, setFarmerOrders] = useState<Order[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isUserLoading && userType === 'buyer') {
            router.push('/');
        }
    }, [userType, router, isUserLoading]);

    useEffect(() => {
        if (isUserLoading || userType !== 'farmer' || !uid) return;

        setIsLoadingData(true);

        const loadProducts = async () => {
            const products = await fetchProducts();
            setFarmerProducts(products.filter(p => p.uid === uid));
        };
        
        loadProducts();

        const unsubscribeOrders = subscribeToFarmerOrders(uid, (orders) => {
            setFarmerOrders(orders);
            setIsLoadingData(false);
        });

        // Cleanup subscriptions on component unmount
        return () => {
            unsubscribeOrders();
        };

    }, [uid, userType, isUserLoading]);


    const farmerStats = useMemo(() => {
        if (!uid || userType !== 'farmer') return { totalOrders: 0, totalRevenue: 0 };
        
        const deliveredOrders = farmerOrders.filter(o => o.status === 'Delivered');

        const totalRevenue = deliveredOrders.reduce((acc, order) => {
            const farmerItemsTotal = order.items
                .filter(item => item.sellerId === uid)
                .reduce((itemAcc, item) => itemAcc + (item.price * item.quantity), 0);
            return acc + farmerItemsTotal;
        }, 0);

        return {
            totalOrders: deliveredOrders.length,
            totalRevenue: totalRevenue,
        };
    }, [uid, userType, farmerOrders]);
    
    if (isUserLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-24 w-1/2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={`https://i.pravatar.cc/100?u=${userName}`} alt="Farmer" data-ai-hint="farmer portrait" />
                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{userName}'s Dashboard</h1>
                        <p className="text-muted-foreground">Manage your farm and product listings.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/profile/edit">
                            <Edit className="mr-2 h-4 w-4"/>
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completed Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{farmerStats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Delivered orders
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{farmerStats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            From completed orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Shipping Address
                        </CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {address ? (
                         <div className="text-sm">
                            <p>{address}</p>
                            <p>{city}, {zip}</p>
                        </div>
                       ) : (
                        <p className="text-sm text-muted-foreground">No address set.</p>
                       )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline">Your Products</CardTitle>
                            <CardDescription>You have {farmerProducts.length} product(s) listed.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/products/new">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add New Product
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoadingData ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-2">
                                    <Skeleton className="h-16 w-16 rounded-md"/>
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4"/>
                                        <Skeleton className="h-4 w-1/4"/>
                                    </div>
                                    <Skeleton className="h-9 w-20 rounded-md"/>
                                </div>
                            ))
                        ) : farmerProducts.length > 0 ? (
                            farmerProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50">
                                    <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={product.aiHint}/>
                                    <div className="flex-1">
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">₹{product.price.toFixed(2)} / kg</p>
                                        {product.stock > 0 ? (
                                            <p className="text-xs text-muted-foreground">{product.stock} kg in stock</p>
                                        ) : (
                                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                                        )}
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/products/edit/${product.id}`}>Edit</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                             <div className="text-center text-muted-foreground py-8">
                                <Package className="mx-auto h-12 w-12 mb-4" />
                                <h3 className="text-xl font-semibold">No products yet</h3>
                                <p>Click "Add New Product" to get started.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
