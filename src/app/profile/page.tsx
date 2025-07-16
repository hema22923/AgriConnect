
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchProducts } from "@/lib/data"
import type { Product } from '@/lib/types'
import Image from "next/image"
import { Edit, PlusCircle, Package, LogOut } from "lucide-react"
import { useUser } from "@/context/user-context";
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function ProfilePage() {
    const { userName, uid } = useUser();
    const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    }

    useEffect(() => {
        const loadProducts = async () => {
            if (!uid) return;
            setIsLoading(true);
            const allProducts = await fetchProducts();
            setFarmerProducts(allProducts.filter(p => p.uid === uid));
            setIsLoading(false);
        };
        loadProducts();
    }, [uid]);

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
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Your Products</CardTitle>
                         <Button asChild>
                            <Link href="/products/new">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add New Product
                            </Link>
                        </Button>
                    </div>
                    <CardDescription>Manage your product listings below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
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
                                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
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
