
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { fetchProductById, updateProduct, deleteProduct } from '@/lib/data';
import { useUser } from '@/context/user-context';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditProductPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const { uid } = useUser();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const productId = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        if (!productId) return;
        
        const loadProduct = async () => {
            setIsLoading(true);
            const fetchedProduct = await fetchProductById(productId);
            if (fetchedProduct) {
                // Security check: ensure the current user owns this product
                if (fetchedProduct.uid !== uid) {
                    toast({ title: "Unauthorized", description: "You don't have permission to edit this product.", variant: "destructive" });
                    router.push('/profile');
                    return;
                }
                setProduct(fetchedProduct);
                setImagePreview(fetchedProduct.image);
            } else {
                 toast({ title: "Product not found", variant: "destructive" });
                 router.push('/profile');
            }
            setIsLoading(false);
        };

        if (uid) { // Only fetch if user is loaded
          loadProduct();
        }

    }, [productId, uid, router, toast]);

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
        if (!product) return;

        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const stock = parseFloat(formData.get('stock') as string);
        const aiHint = formData.get('aiHint') as string;
        const image = imagePreview || product.image;

        const updatedProductData = {
            name,
            description,
            price,
            stock,
            aiHint,
            image,
        };

        await updateProduct(product.id, updatedProductData);
        
        toast({
            title: "Product Updated!",
            description: "Your product has been successfully updated.",
        });
        
        router.push('/profile');
        setIsSaving(false);
    }

    const handleDelete = async () => {
      if (!product) return;
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast({
        title: "Product Removed",
        description: "The product has been successfully removed.",
        variant: "destructive"
      });
      router.push('/profile');
      setIsDeleting(false);
    }

    if (isLoading || !product) {
        return (
            <div className="max-w-2xl mx-auto">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-10 w-full mb-6" />
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-20 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <Skeleton className="h-11 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
                        <p className="text-muted-foreground">Update the details for &quot;{product.name}&quot;.</p>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your product
                                and remove it from the store.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Removing..." : "Continue"}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" defaultValue={product.name} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={product.description} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="price">Price (per Kg)</Label>
                                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity (in Kg)</Label>
                                <Input id="stock" name="stock" type="number" step="0.1" defaultValue={product.stock} required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="aiHint">Image AI Hint</Label>
                            <Input id="aiHint" name="aiHint" defaultValue={product.aiHint} required />
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
                                <Input id="image" type="file" onChange={handleImageChange} accept="image/*" className="flex-1" />
                            </div>
                        </div>
                        <Button type="submit" disabled={isSaving} className="w-full h-11 bg-accent hover:bg-accent/90">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
