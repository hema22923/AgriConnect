
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addProduct } from '@/lib/data';
import { useUser } from '@/context/user-context';
import Image from 'next/image';

export default function NewProductPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { userName, uid } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!uid) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to add a product.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const stock = parseInt(formData.get('stock') as string, 10);
        const aiHint = formData.get('aiHint') as string || 'fresh produce';

        // In a real app, you would upload the image to a storage service (like Firebase Storage)
        // and get a URL back. For now, we'll continue using the placeholder or a data URL.
        const imageUrl = imagePreview || `https://placehold.co/600x400.png`;

        const newProduct = {
            uid,
            name,
            description,
            price,
            stock,
            image: imageUrl,
            seller: userName,
            aiHint,
        };

        await addProduct(newProduct);
        
        toast({
            title: "Product Added!",
            description: "Your new product has been successfully listed.",
        });
        
        router.push('/profile');
        setIsLoading(false);
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
                            <Input id="name" name="name" placeholder="e.g., Organic Strawberries" required suppressHydrationWarning/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your product..." required suppressHydrationWarning/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 5.99" required suppressHydrationWarning/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input id="stock" name="stock" type="number" step="1" placeholder="e.g., 100" required suppressHydrationWarning/>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="aiHint">Image AI Hint</Label>
                            <Input id="aiHint" name="aiHint" placeholder="e.g., fresh strawberries" required suppressHydrationWarning/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Product Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-md border flex items-center justify-center bg-muted/50">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Product preview" width={96} height={96} className="object-cover rounded-md h-full w-full" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <Input id="image" type="file" onChange={handleImageChange} accept="image/*" className="flex-1" suppressHydrationWarning/>
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-11 bg-accent hover:bg-accent/90" suppressHydrationWarning>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
