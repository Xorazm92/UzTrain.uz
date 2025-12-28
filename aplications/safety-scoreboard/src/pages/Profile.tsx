import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCurrentUser, getRoleLabel, getRoleColor, User } from '@/lib/auth/auth';
import { User as UserIcon, Building2, Shield, Key, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Profile() {
    const { toast } = useToast();
    const currentUser = getCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    // In a real app, we would update this in the backend/localStorage
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

    if (!currentUser) return null;

    const handleSave = () => {
        // Here we would save the changes. For now, just simulate it.
        // We might need to update the auth.ts to support updating user details if we want it to persist.
        // For this step, I'll just show a toast.
        toast({
            title: "Muvaffaqiyatli saqlandi",
            description: "Profil ma'lumotlari yangilandi",
        });
        setIsEditing(false);
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="relative">
                    <div className="absolute inset-0 gradient-warm opacity-50 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-card rounded-2xl shadow-etsy-lg dark:shadow-none p-8 border border-orange-100 dark:border-orange-800 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-etsy border-4 border-background">
                            <UserIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                                {currentUser.displayName}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className={cn("px-3 py-1 rounded-full text-sm font-semibold", getRoleColor(currentUser.role))}>
                                    {getRoleLabel(currentUser.role)}
                                </span>
                                {currentUser.organizationId && (
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-muted text-muted-foreground flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {currentUser.organizationId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <Card className="md:col-span-2 shadow-etsy dark:shadow-none border-orange-100 dark:border-orange-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-orange-500" />
                                Shaxsiy Ma'lumotlar
                            </CardTitle>
                            <CardDescription>Profil ma'lumotlarini boshqarish</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Foydalanuvchi nomi (Login)</Label>
                                <Input value={currentUser.username} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ism Familiya</Label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>Bekor qilish</Button>
                                        <Button onClick={handleSave} className="gradient-primary">
                                            <Save className="w-4 h-4 mr-2" />
                                            Saqlash
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} variant="outline">
                                        O'zgartirish
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className="shadow-etsy dark:shadow-none border-orange-100 dark:border-orange-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-orange-500" />
                                Xavfsizlik
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Key className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    <span className="font-semibold text-orange-700 dark:text-orange-400">Parolni o'zgartirish</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Xavfsizlik uchun parolni muntazam yangilab turing
                                </p>
                                <Button variant="outline" className="w-full text-xs" disabled>
                                    Tez kunda...
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
