'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        toast({
            title: "Product Added!",
            description: "Your new product has been successfully listed.",
        });
        router.push('/profile');
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/profile">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Profile
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
                            <Input id="name" placeholder="e.g., Organic Strawberries" required/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe your product..." required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" type="number" step="0.01" placeholder="e.g., 5.99" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Product Image</Label>
                                <Input id="image" type="file" required/>
                                <p className="text-xs text-muted-foreground">Image upload is simulated.</p>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90">
                            Add Product
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
