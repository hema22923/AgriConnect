'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { products } from "@/lib/data"
import Image from "next/image"
import { Edit, PlusCircle, Package } from "lucide-react"

export default function ProfilePage() {
    const farmerProducts = products.filter(p => p.seller === "My Farm");

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src="https://placehold.co/100x100" alt="Farmer" data-ai-hint="farmer portrait" />
                        <AvatarFallback>MF</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">My Farm Dashboard</h1>
                        <p className="text-muted-foreground">Manage your farm and product listings.</p>
                    </div>
                </div>
                <Button asChild variant="outline">
                    <Link href="/profile/edit">
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit Profile
                    </Link>
                </Button>
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
                        {farmerProducts.map(product => (
                            <div key={product.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50">
                                <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={product.aiHint}/>
                                <div className="flex-1">
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                        ))}
                    </div>
                     {farmerProducts.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            <Package className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold">No products yet</h3>
                            <p>Click "Add New Product" to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
