
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/user-context";
import { updateUser } from "@/lib/data";
import { auth } from "@/lib/firebase";

export default function EditProfilePage() {
    const { toast } = useToast();
    const router = useRouter();
    const { userName, setUserName, address, city, zip, setAddress, setCity, setZip, userType } = useUser();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Local state for form fields to avoid re-rendering on every keystroke in context
    const [formState, setFormState] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
        farmDescription: ''
    });

    useEffect(() => {
        // Initialize form state once user data is available
        if (userName !== 'Guest') {
            setFormState({
                name: userName,
                address: address || '',
                city: city || '',
                zip: zip || '',
                farmDescription: '' // Assuming this is not stored yet
            });
        }
    }, [userName, address, city, zip]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const currentUser = auth.currentUser;
        if (currentUser) {
            const updates = {
                fullName: formState.name,
                address: formState.address,
                city: formState.city,
                zip: formState.zip,
            };
            await updateUser(currentUser.uid, updates);

            // Update context
            setUserName(formState.name);
            setAddress(formState.address);
            setCity(formState.city);
            setZip(formState.zip);
        }
        
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been saved.",
        });
        
        router.push('/profile');
        setIsSubmitting(false);
    }

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

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/profile" legacyBehavior>
                    <Button asChild variant="ghost" className="mb-4">
                        <a>
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Profile
                        </a>
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold font-headline">Edit Profile</h1>
                <p className="text-muted-foreground">Update your personal and shipping information below.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                                <AvatarImage src={imagePreview || `https://i.pravatar.cc/100?u=${userName}`} alt="User" />
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="profileImage">Profile Image</Label>
                                <Input id="profileImage" type="file" accept="image/*" onChange={handleImageChange} suppressHydrationWarning />
                                <p className="text-xs text-muted-foreground">Upload a new display picture.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">{userType === 'farmer' ? 'Farm Name' : 'Full Name'}</Label>
                            <Input id="name" name="name" value={formState.name} onChange={handleInputChange} placeholder="e.g., Green Valley Farms" required suppressHydrationWarning/>
                        </div>
                         {userType === 'farmer' && (
                             <div className="space-y-2">
                                <Label htmlFor="farmDescription">Farm Description</Label>
                                <Textarea id="farmDescription" name="farmDescription" value={formState.farmDescription} onChange={handleInputChange} placeholder="Tell us about your farm..." suppressHydrationWarning/>
                            </div>
                         )}

                        <div className="border-t pt-6 space-y-4">
                            <h3 className="font-semibold">Shipping Address</h3>
                             <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input id="address" name="address" value={formState.address} onChange={handleInputChange} placeholder="123 Farmhouse Ln" suppressHydrationWarning/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" value={formState.city} onChange={handleInputChange} placeholder="Green Valley" suppressHydrationWarning/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input id="zip" name="zip" value={formState.zip} onChange={handleInputChange} placeholder="12345" suppressHydrationWarning/>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11" suppressHydrationWarning disabled={isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
