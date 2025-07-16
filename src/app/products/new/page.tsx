'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addProduct } from '@/lib/data';

export default function NewProductPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);

        // In a real app, image would be uploaded to storage and URL saved
        const newProduct = {
            id: `prod_${Date.now()}`,
            name,
            description,
            price,
            image: `https://placehold.co/600x400`,
            seller: 'My Farm', // Assuming the current user is 'My Farm'
            aiHint: 'fresh produce',
        };

        addProduct(newProduct);
        
        setTimeout(() => {
            toast({
                title: "Product Added!",
                description: "Your new product has been successfully listed.",
            });
            router.push('/profile');
            setIsLoading(false);
        }, 1000);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/profile">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
                <p className="text-muted-foreground">Fill in the details below to list a new item.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Organic Strawberries" required/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your product..." required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 5.99" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Product Image</Label>
                                <Input id="image" type="file" />
                                <p className="text-xs text-muted-foreground">Image upload is simulated.</p>
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-11 bg-accent hover:bg-accent/90">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
