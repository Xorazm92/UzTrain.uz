import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, User, Sparkles } from 'lucide-react';
import { authenticateUser, setCurrentUser } from '@/lib/auth/auth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = authenticateUser(username, password);

            if (user) {
                setCurrentUser(user);
                toast({
                    title: "Muvaffaqiyatli kirish",
                    description: `Xush kelibsiz, ${user.displayName}!`,
                });
                navigate('/dashboard');
            } else {
                setError('Login yoki parol noto\'g\'ri');
            }
        } catch (err) {
            setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-background dark:via-background dark:to-background p-4 relative overflow-hidden">
            {/* Decorative Elements - Etsy Style */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-900/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200/20 dark:bg-yellow-900/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-etsy-xl relative hover-lift overflow-hidden bg-white">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                        Mehnat Muhofazasi
                    </h1>
                    <p className="text-muted-foreground font-medium">Reyting va Monitoring Tizimi</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                            ISO 45001
                        </span>
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                            OSHA
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                            ILO
                        </span>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="shadow-etsy-xl dark:shadow-none border-0 backdrop-blur-sm bg-card/90 animate-scale-in">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Tizimga Kirish
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Xavfsizlik platformasiga xush kelibsiz
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="animate-fade-in">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-foreground font-medium">
                                    Login
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Loginni kiriting"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10 h-12 border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground font-medium">
                                    Parol
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Parolni kiriting"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity text-white font-semibold shadow-etsy dark:shadow-none"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Kirish...
                                    </span>
                                ) : (
                                    'Kirish'
                                )}
                            </Button>
                        </form>

                        {/* Test Accounts */}
                        <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                Test Hisoblari
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs bg-background/60 rounded-lg p-2">
                                    <code className="text-foreground font-mono">admin / admin123</code>
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-semibold">
                                        Administrator
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs bg-background/60 rounded-lg p-2">
                                    <code className="text-foreground font-mono">manager / manager123</code>
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
                                        Menejer
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs bg-background/60 rounded-lg p-2">
                                    <code className="text-foreground font-mono">supervisor / super123</code>
                                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">
                                        Nazoratchi
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs bg-background/60 rounded-lg p-2">
                                    <code className="text-foreground font-mono">user / user123</code>
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold">
                                        Foydalanuvchi
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 space-y-2 animate-fade-in">
                    <p className="text-sm text-muted-foreground">
                        © 2025 Mehnat Muhofazasi Reyting Tizimi
                    </p>
                    <p className="text-xs text-muted-foreground">
                        ISO 45001, OSHA, ILO standartlariga asoslangan
                    </p>
                </div>
            </div>
        </div>
    );
}
