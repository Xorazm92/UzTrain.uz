
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Save, Calculator, CheckCircle2, ArrowLeft, Percent, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { calculateCompanyKPIs, calculateOverallIndex } from '@/lib/utils/kpi-calculator';
import { UZ_RAILWAY_DATA } from '@/lib/data/organization-data';
import { DEPARTMENT_PROFILES, KPI_CONFIG } from '@/lib/constants/kpi-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// 1. Zod Schema Definition
const companyFormSchema = z.object({
    name: z.string().min(2, "Korxona nomi kamida 2 harf bo'lishi kerak"),
    level: z.enum(['management', 'supervisor', 'subsidiary']),
    parent: z.string().optional(),
    profile: z.string().min(1, "Profil tanlanishi shart"),
    employees: z.number().min(1, "Xodimlar soni 0 bo'lishi mumkin emas"),
    totalHours: z.number().optional(),

    // KPI Fields - Numbers with min 0
    fatal: z.number().min(0).default(0),
    severe: z.number().min(0).default(0),
    group: z.number().min(0).default(0),
    light: z.number().min(0).default(0),

    hseStaffActual: z.number().min(0).default(0),
    hseStaffRequired: z.number().min(0).default(0),

    noincident: z.number().min(0).max(366).default(0),

    trainingPassed: z.number().min(0).default(0),
    trainingRequired: z.number().min(0).default(0),

    assessedWorkplaces: z.number().min(0).default(0),
    plannedWorkplaces: z.number().min(0).default(0),
    completedActions: z.number().min(0).default(0),
    plannedActions: z.number().min(0).default(0),

    stoppageInternal: z.number().min(0).default(0),
    stoppageExternal: z.number().min(0).default(0),

    insurancePayment: z.number().min(0).default(0),
    payrollFund: z.number().min(0).default(0),

    mmBudgetActual: z.number().min(0).default(0),
    mmBudgetPlanned: z.number().min(0).default(0),

    ppeEquipped: z.number().min(0).default(0),
    ppeRequired: z.number().min(0).default(0),

    equipmentInspected: z.number().min(0).default(0),
    equipmentTotal: z.number().min(0).default(0),
    authorizedStaff: z.number().min(0).default(0),
    totalStaffEquipment: z.number().min(0).default(0),

    inspectionDone: z.number().min(0).default(0),
    inspectionPlanned: z.number().min(0).default(0),

    occupational: z.number().min(0).default(0),

    auditIssues: z.number().min(0).default(0),
    auditTotal: z.number().min(0).default(0),

    emergencyParticipated: z.number().min(0).default(0),
    emergencyPlanned: z.number().min(0).default(0),

    ticketRed: z.number().min(0).default(0),
    ticketYellow: z.number().min(0).default(0),
    ticketGreen: z.number().min(0).default(0),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
    const [calculatedZone, setCalculatedZone] = useState<string | null>(null);

    // 2. React Hook Form Setup
    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: '',
            level: 'subsidiary',
            parent: '',
            profile: 'locomotive',
            employees: 100,
            totalHours: 0,
            fatal: 0, severe: 0, group: 0, light: 0,
            hseStaffActual: 0, hseStaffRequired: 0,
            noincident: 0,
            trainingPassed: 0, trainingRequired: 0,
            assessedWorkplaces: 0, plannedWorkplaces: 0,
            completedActions: 0, plannedActions: 0,
            stoppageInternal: 0, stoppageExternal: 0,
            insurancePayment: 0, payrollFund: 0,
            mmBudgetActual: 0, mmBudgetPlanned: 0,
            ppeEquipped: 0, ppeRequired: 0,
            equipmentInspected: 0, equipmentTotal: 0,
            authorizedStaff: 0, totalStaffEquipment: 0,
            inspectionDone: 0, inspectionPlanned: 0,
            occupational: 0,
            auditIssues: 0, auditTotal: 0,
            emergencyParticipated: 0, emergencyPlanned: 0,
            ticketRed: 0, ticketYellow: 0, ticketGreen: 0,
        }
    });

    const { control, handleSubmit, setValue, watch, register, formState: { errors } } = form;

    // Watch values for real-time calculation preview
    const watchedValues = watch();

    useEffect(() => {
        if (id) {
            loadCompany(id);
        }
    }, [id]);

    const loadCompany = async (companyId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('id', companyId)
                .single();

            if (error) throw error;

            if (data) {
                // Get raw_data or empty object
                const rawData = data.raw_data || {};

                // Merge with default values to ensure all fields exist
                const formValues = {
                    // Start with form defaults
                    fatal: 0, severe: 0, group: 0, light: 0,
                    hseStaffActual: 0, hseStaffRequired: 0,
                    noincident: 0,
                    trainingPassed: 0, trainingRequired: 0,
                    assessedWorkplaces: 0, plannedWorkplaces: 0,
                    completedActions: 0, plannedActions: 0,
                    stoppageInternal: 0, stoppageExternal: 0,
                    insurancePayment: 0, payrollFund: 0,
                    mmBudgetActual: 0, mmBudgetPlanned: 0,
                    ppeEquipped: 0, ppeRequired: 0,
                    equipmentInspected: 0, equipmentTotal: 0,
                    authorizedStaff: 0, totalStaffEquipment: 0,
                    inspectionDone: 0, inspectionPlanned: 0,
                    occupational: 0,
                    auditIssues: 0, auditTotal: 0,
                    emergencyParticipated: 0, emergencyPlanned: 0,
                    ticketRed: 0, ticketYellow: 0, ticketGreen: 0,
                    // Override with raw_data values
                    ...rawData,
                    // Override with root-level data (these are always authoritative)
                    name: data.name,
                    level: data.level,
                    parent: data.parent || '',
                    profile: data.profile,
                    employees: data.employees,
                    totalHours: data.total_hours || 0,
                };

                // Reset form with merged data
                form.reset(formValues);

                setCalculatedScore(data.overall_index);
                setCalculatedZone(data.zone);
            }
        } catch (error) {
            console.error('Error loading company:', error);
            toast({ title: "Xatolik", description: "Ma'lumotlarni yuklashda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const calculatePreview = () => {
        try {
            const formData = form.getValues();
            // @ts-ignore - mismatch between form types and calc utility types (calc expects specific shape, form has it)
            const kpiResults = calculateCompanyKPIs(formData);
            // @ts-ignore
            const overallIndex = calculateOverallIndex(kpiResults, formData.profile);

            setCalculatedScore(overallIndex);

            let zone = 'red';
            if (overallIndex >= 80) zone = 'green';
            else if (overallIndex >= 50) zone = 'yellow';
            setCalculatedZone(zone);

            toast({
                title: "Hisob-kitob natijasi",
                description: `Joriy ball: ${overallIndex.toFixed(1)} (${zone === 'green' ? 'Yaxshi' : zone === 'yellow' ? 'Qoniqarli' : 'Xavfli'})`,
            });
            return overallIndex;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    const onSubmit = async (data: CompanyFormValues) => {
        setLoading(true);
        try {
            // @ts-ignore
            const kpiResults = calculateCompanyKPIs(data);
            // @ts-ignore
            const overallIndex = calculateOverallIndex(kpiResults, data.profile);

            let zone: 'green' | 'yellow' | 'red' = 'red';
            if (overallIndex >= 80) zone = 'green';
            else if (overallIndex >= 50) zone = 'yellow';

            const companyData = {
                name: data.name,
                level: data.level,
                parent: data.parent || null,
                profile: data.profile,
                employees: data.employees,
                total_hours: data.totalHours || data.employees * 1820,
                kpis: kpiResults,
                overall_index: overallIndex,
                zone: zone,
                raw_data: data,
                updated_at: new Date().toISOString()
            };

            const query = id
                ? supabase.from('companies').update(companyData).eq('id', id)
                : supabase.from('companies').insert([{
                    id: `company_${Date.now()}`,
                    ...companyData,
                    date_added: new Date().toISOString(),
                }]);

            const { error } = await query;
            if (error) throw error;

            toast({
                title: "Muvaffaqiyatli saqlandi",
                description: `Ball: ${overallIndex.toFixed(1)}`,
            });
            navigate('/dashboard');

        } catch (error) {
            console.error('Save error:', error);
            toast({ title: "Xatolik", description: "Saqlashda xatolik yuz berdi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Render helper for number inputs using register (no Controller = no re-render issues)
    const renderNumberInput = (name: keyof CompanyFormValues, label: string, suffix?: string) => (
        <div className="space-y-1.5">
            <Label htmlFor={name} className="text-sm font-medium text-foreground/80">{label}</Label>
            <div className="relative">
                <Input
                    id={name}
                    type="number"
                    {...register(name, { valueAsNumber: true })}
                    className={cn("border-orange-200 dark:border-orange-800 focus:border-orange-500 font-mono", suffix && "pr-12", errors[name] && "border-red-500")}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground text-xs font-semibold">
                        {suffix}
                    </div>
                )}
            </div>
            {errors[name] && <span className="text-xs text-red-500">{errors[name]?.message}</span>}
        </div>
    );

    const renderTextInput = (name: keyof CompanyFormValues, label: string) => (
        <div className="space-y-1.5">
            <Label htmlFor={name} className="text-sm font-medium text-foreground/80">{label}</Label>
            <Input
                id={name}
                type="text"
                {...register(name)}
                className={cn("border-orange-200 dark:border-orange-800 focus:border-orange-500", errors[name] && "border-red-500")}
            />
            {errors[name] && <span className="text-xs text-red-500">{errors[name]?.message}</span>}
        </div>
    );

    // KPI Row with inline inputs
    const renderKPIRow = (title: string, actualName: keyof CompanyFormValues, plannedName: keyof CompanyFormValues, icon: string) => {
        const actVal = Number(watch(actualName) || 0);
        const planVal = Number(watch(plannedName) || 0);
        const percent = (planVal > 0) ? Math.round((actVal / planVal) * 100) : 0;

        return (
            <div className="p-4 rounded-lg border border-orange-100 dark:border-orange-800 bg-card hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">{icon}</span>
                        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
                    </div>
                    <div className={cn("text-xs font-bold px-2 py-1 rounded", percent >= 100 ? "bg-green-100 text-green-700" : percent >= 80 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>
                        {percent}%
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {renderNumberInput(actualName, "Fakt")}
                    {renderNumberInput(plannedName, "Reja")}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6 pb-20">

                {/* Header Action Bar */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                {id ? 'Korxona Ma\'lumotlarini Tahrirlash' : 'Yangi Korxona Kiritish'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={calculatePreview}>
                            <Calculator className="w-4 h-4 mr-2" />
                            Prevyu
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} className="gradient-primary shadow-etsy">
                            <Save className="w-4 h-4 mr-2" />
                            Saqlash
                        </Button>
                    </div>
                </div>

                {/* Score Alert */}
                {calculatedScore !== null && (
                    <Alert className={cn("shadow-sm border-l-4", calculatedZone === 'green' ? "border-l-green-500 bg-green-50/50" : calculatedZone === 'yellow' ? "border-l-amber-500 bg-amber-50/50" : "border-l-red-500 bg-red-50/50")}>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className={cn("w-5 h-5", calculatedZone === 'green' ? "text-green-600" : calculatedZone === 'yellow' ? "text-amber-600" : "text-red-600")} />
                            <div>
                                <AlertTitle className="text-base font-bold">Natija: {calculatedScore.toFixed(1)} ball</AlertTitle>
                                <AlertDescription className="text-muted-foreground text-sm">
                                    {calculatedZone === 'green' ? "A'lo natija! Barcha ko'rsatkichlar me'yorda." : calculatedZone === 'yellow' ? "O'rtacha natija. Ba'zi ko'rsatkichlarni yaxshilash kerak." : "Qoniqarsiz natija! Zudlik bilan choralar ko'rish lozim."}
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Step 1: Basic Info */}
                    <Card className="shadow-etsy-lg border-orange-100 dark:border-orange-800">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-orange-500" />
                                Tashkilot Pasporti
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                {renderTextInput("name", "Korxona nomi")}
                            </div>

                            <Controller
                                control={control}
                                name="level"
                                render={({ field }) => (
                                    <div className="space-y-1.5">
                                        <Label>Ierarxiya</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="management">Boshqaruv (Dep/Bosh)</SelectItem>
                                                <SelectItem value="supervisor">Nazoratchi (MTU)</SelectItem>
                                                <SelectItem value="subsidiary">Korxona (PCH/TCH/etc)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name="parent"
                                render={({ field }) => (
                                    <div className="space-y-1.5">
                                        <Label>Yuqori Tashkilot</Label>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                                            <SelectContent>
                                                {UZ_RAILWAY_DATA.map(org => (
                                                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name="profile"
                                render={({ field }) => (
                                    <div className="space-y-1.5">
                                        <Label>Faoliyat Turi</Label>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {DEPARTMENT_PROFILES.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            {renderNumberInput("employees", "Xodimlar Soni")}
                            {renderNumberInput("totalHours", "Ish soatlari")}
                        </CardContent>
                    </Card>

                    {/* Step 2: Critical KPIs */}
                    <Card className="shadow-etsy-lg border-red-100 dark:border-red-900 overflow-hidden">
                        <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900">
                            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Baxtsiz Hodisalar (LTIFR)
                            </CardTitle>
                            <CardDescription>Ushbu bo'lim o'ta muhim va xatoliklarga yo'l qo'yilmaydi</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-red-100/50 rounded-lg border border-red-200 text-center">
                                    <div className="text-3xl mb-2">💀</div>
                                    {renderNumberInput("fatal", "O'lim")}
                                </div>
                                <div className="p-4 bg-orange-100/50 rounded-lg border border-orange-200 text-center">
                                    <div className="text-3xl mb-2">🚑</div>
                                    {renderNumberInput("severe", "Og'ir")}
                                </div>
                                <div className="p-4 bg-amber-100/50 rounded-lg border border-amber-200 text-center">
                                    <div className="text-3xl mb-2">👥</div>
                                    {renderNumberInput("group", "Guruhli")}
                                </div>
                                <div className="p-4 bg-yellow-100/50 rounded-lg border border-yellow-200 text-center">
                                    <div className="text-3xl mb-2">🩹</div>
                                    {renderNumberInput("light", "Yengil")}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 3: Planned vs Actual Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {renderKPIRow("MM Xizmati Xodimlari", "hseStaffActual", "hseStaffRequired", "👥")}
                            {renderKPIRow("O'qitish Qamrovi", "trainingPassed", "trainingRequired", "📚")}
                            {renderKPIRow("SHHV Ta'minoti", "ppeEquipped", "ppeRequired", "🦺")}
                            {renderKPIRow("Tekshiruvlar Ijrosi", "inspectionDone", "inspectionPlanned", "📋")}
                            {renderKPIRow("Audit Natijasi", "auditIssues", "auditTotal", "✅")}

                            {/* XICHO Bo'limi - to'liq */}
                            <div className="p-4 rounded-lg border border-orange-100 dark:border-orange-800 bg-card hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="text-orange-500">🔧</span>
                                    XICHO bo'yicha identifikatsiya
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderNumberInput("equipmentInspected", "Tekshirilgan uskunalar")}
                                    {renderNumberInput("equipmentTotal", "Jami uskunalar")}
                                    {renderNumberInput("authorizedStaff", "Ruxsatli xodimlar")}
                                    {renderNumberInput("totalStaffEquipment", "Jami xodimlar (uskuna)")}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {renderKPIRow("Ish O'rinlarini Baholash", "assessedWorkplaces", "plannedWorkplaces", "🎯")}
                            {renderKPIRow("Favqulodda Mashg'ulotlar", "emergencyParticipated", "emergencyPlanned", "🚨")}

                            <div className="p-4 rounded-lg border border-blue-100 dark:border-blue-800 bg-card hover:bg-blue-50/30">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Percent className="w-4 h-4 text-blue-500" /> MM Budjet Ijrosi (mln so'm)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderNumberInput("mmBudgetActual", "Fakt", "mln")}
                                    {renderNumberInput("mmBudgetPlanned", "Reja", "mln")}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-800 bg-card hover:bg-purple-50/30">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-purple-500" /> To'xtatishlar</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderNumberInput("stoppageInternal", "Ichki (Ijobiy)", "+2")}
                                    {renderNumberInput("stoppageExternal", "Tashqi (Jarima)", "-20")}
                                </div>
                            </div>

                            {/* Sug'urta va Kompensatsiya */}
                            <div className="p-4 rounded-lg border border-teal-100 dark:border-teal-800 bg-card hover:bg-teal-50/30">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <span className="text-teal-500">🏥</span>
                                    Sug'urta va Kompensatsiya
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderNumberInput("insurancePayment", "Sug'urta to'lovi", "mln")}
                                    {renderNumberInput("payrollFund", "Ish haqi fondi", "mln")}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-card">
                                <h4 className="font-semibold text-sm mb-3">Boshqa Ko'rsatkichlar</h4>
                                <div className="space-y-3">
                                    {renderNumberInput("noincident", "Baxtsiz Hodisasiz Kunlar", "kun")}
                                    {renderNumberInput("occupational", "Kasb Kasalliklari Soni")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Violations */}
                    <Card className="shadow-etsy border-orange-100 overflow-hidden">
                        <CardHeader className="bg-orange-50/30">
                            <CardTitle className="text-base">Intizomiy Choralar (Talonlar)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-3 gap-6">
                            <div className="text-center space-y-2">
                                <div className="w-full h-2 bg-red-500 rounded-full mb-2"></div>
                                {renderNumberInput("ticketRed", "Qizil Talon")}
                            </div>
                            <div className="text-center space-y-2">
                                <div className="w-full h-2 bg-yellow-400 rounded-full mb-2"></div>
                                {renderNumberInput("ticketYellow", "Sariq Talon")}
                            </div>
                            <div className="text-center space-y-2">
                                <div className="w-full h-2 bg-green-500 rounded-full mb-2"></div>
                                {renderNumberInput("ticketGreen", "Yashil Talon")}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button Area */}
                    <div className="flex justify-end pt-6">
                        <Button type="submit" size="lg" className="px-8 gradient-primary font-bold shadow-etsy hover:scale-105 transition-transform">
                            {loading ? "Saqlanmoqda..." : "Saqlash va Reytingni Yangilash"}
                        </Button>
                    </div>

                </form>
            </div>
        </Layout>
    );
}

