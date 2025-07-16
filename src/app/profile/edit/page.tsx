
'use client';

import { useState } from "react";
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
    const { userName, setUserName } = useUser();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const farmName = formData.get('farmName') as string;
        
        const currentUser = auth.currentUser;
        if (farmName && currentUser) {
            await updateUser(currentUser.uid, { fullName: farmName });
            setUserName(farmName);
        }
        
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been saved.",
        });
        
        router.push('/profile');
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
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/profile">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Profile
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">Edit Profile</h1>
                <p className="text-muted-foreground">Update your farm's information below.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-primary/20">
                                <AvatarImage src={imagePreview || `https://i.pravatar.cc/100?u=${userName}`} alt="Farmer" />
                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="farmImage">Farm Image</Label>
                                <Input id="farmImage" type="file" accept="image/*" onChange={handleImageChange} suppressHydrationWarning />
                                <p className="text-xs text-muted-foreground">Upload a new display picture for your farm.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="farmName">Farm Name</Label>
                            <Input id="farmName" name="farmName" defaultValue={userName} placeholder="e.g., Green Valley Farms" required suppressHydrationWarning/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Farm Description</Label>
                            <Textarea id="description" name="description" defaultValue="" placeholder="Tell us about your farm..." required suppressHydrationWarning/>
                        </div>
                        <Button type="submit" className="w-full h-11" suppressHydrationWarning>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}
