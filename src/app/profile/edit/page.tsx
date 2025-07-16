'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been saved.",
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
                <h1 className="text-3xl font-bold font-headline">Edit Profile</h1>
                <p className="text-muted-foreground">Update your farm's information below.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="farmName">Farm Name</Label>
                            <Input id="farmName" defaultValue="My Farm" required/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Farm Description</Label>
                            <Textarea id="description" defaultValue="Your farm description will appear here." required/>
                        </div>
                        <Button type="submit" className="w-full h-11">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}