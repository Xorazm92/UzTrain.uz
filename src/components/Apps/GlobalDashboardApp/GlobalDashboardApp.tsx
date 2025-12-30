import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './GlobalDashboardApp.scss';
import { supabase, Company } from '@/lib/supabase';
import { UZ_RAILWAY_DATA, getAllDescendants } from '@/lib/data/organization-data';
import { FaExclamationTriangle, FaRegCheckCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    PieChart,
    Pie
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface RegionalStat {
    id: string;
    name: string;
    avgRating: number;
    count: number;
    status: 'green' | 'yellow' | 'red';
}

interface TrendPoint {
    label: string;
    value: number;
}

 type DocumentSection = 'Qonunlar' | 'Qarorlar' | 'Qoidalar';

 interface NormativeDocument {
     id: string;
     section: DocumentSection;
     direction: string;
     title: string;
     url: string;
 }

const MOCK_COMPANIES: Company[] = [
    { id: '1', name: 'Toshkent MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1250, total_hours: 156000, overall_index: 85, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 90 }, 'Texnika Xavfsizligi': { value: 0, score: 80 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '2', name: "Qo'qon MTU", parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 980, total_hours: 120000, overall_index: 72, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 70 }, 'Texnika Xavfsizligi': { value: 0, score: 75 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '3', name: 'Buxoro MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1100, total_hours: 140000, overall_index: 65, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 60 }, 'Texnika Xavfsizligi': { value: 0, score: 70 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '4', name: 'Qarshi MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 850, total_hours: 100000, overall_index: 45, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 40 }, 'Texnika Xavfsizligi': { value: 0, score: 50 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '5', name: 'Termiz MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 600, total_hours: 80000, overall_index: 92, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 95 }, 'Texnika Xavfsizligi': { value: 0, score: 90 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '6', name: 'Urganch MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 750, total_hours: 95000, overall_index: 55, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 50 }, 'Texnika Xavfsizligi': { value: 0, score: 60 } }, updated_at: '', date_added: '', raw_data: {} },
];

const STATUS_COPY: Record<'green' | 'yellow' | 'red', string> = {
    green: 'Barqaror',
    yellow: 'Nazorat talab',
    red: 'Kritik',
};

const getStatusColor = (status: 'green' | 'yellow' | 'red' | string) => {
    switch (status) {
        case 'green':
            return '#34C759';
        case 'yellow':
            return '#FF9500';
        case 'red':
            return '#FF3B30';
        default:
            return '#8E8E93';
    }
};

 const NORMATIVE_DOCUMENTS: NormativeDocument[] = [
     {
         id: 'law-1',
         section: 'Qonunlar',
         direction: 'Mehnat muhofazasi',
         title: '“Mehnatni muhofaza qilish toʻgʻrisida”gi Qonun',
         url: 'https://lex.uz/uz/docs/-3031427',
     },
     {
         id: 'law-2',
         section: 'Qonunlar',
         direction: 'Sanoat xavfsizligi',
         title: 'Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisida Qonun',
         url: 'https://www.lex.uz/docs/-1061181',
     },
     {
         id: 'law-3',
         section: 'Qonunlar',
         direction: 'Yong’in xavfsizligi',
         title: 'Yongʻin xavfsizligi toʻgʻrisida Qonun',
         url: 'https://lex.uz/docs/-1521661',
     },
     {
         id: 'law-4',
         section: 'Qonunlar',
         direction: 'Ekologik nazorat',
         title: 'Ekologik nazorat toʻgʻrisida Qonun',
         url: 'http://lex.uz/ru/docs/-2304953',
     },
     {
         id: 'law-5',
         section: 'Qonunlar',
         direction: 'Sog’liqni saqlash',
         title: 'Fuqarolar sogʻligʻini saqlash toʻgʻrisida Qonun',
         url: 'https://lex.uz/ru/docs/-26013',
     },
     {
         id: 'law-6',
         section: 'Qonunlar',
         direction: 'Yo’l harakati',
         title: 'Yoʻl harakati toʻgʻrisida Qonun',
         url: 'https://lex.uz/docs/-6764454',
     },
     {
         id: 'decree-1',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Mehnatni muhofaza qilish sohasiga ayrim nizomlarni tasdiqlash to’g’risidagi qaror',
         url: 'https://lex.uz/ru/docs/-7942768',
     },
     {
         id: 'decree-2',
         section: 'Qarorlar',
         direction: 'Sanoat xavfsizligi',
         title: '“Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisida”gi Qonunni amalga oshirishga doir qoʻshimcha chora-tadbirlar haqida',
         url: 'https://lex.uz/docs/-1413931',
     },
     {
         id: 'decree-3',
         section: 'Qarorlar',
         direction: 'Yong’in xavfsizligi',
         title: '“Yongʻin xavfsizligi toʻgʻrisida”gi Qonunni amalga oshirish chora-tadbirlari haqida',
         url: 'https://lex.uz/docs/-2149546',
     },
     {
         id: 'decree-4',
         section: 'Qarorlar',
         direction: 'Ekologik nazorat',
         title: 'Davlat ekologik nazoratini amalga oshirish tartibi toʻgʻrisidagi nizomni tasdiqlash haqida',
         url: 'https://www.lex.uz/docs/-2443091',
     },
     {
         id: 'decree-5',
         section: 'Qarorlar',
         direction: 'Elektr xavfsizligi',
         title: 'Iste’molchilar elektr qurilmalarini texnik ekspluatatsiya qilish qoidalari va xavfsizlik texnikasi qoidalarini tasdiqlash toʻgʻrisida',
         url: 'https://lex.uz/uz/docs/5091758',
     },
     {
         id: 'decree-6',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Mehnatni muhofaza qilishni boshqarish tizimini joriy etish toʻgʻrisida',
         url: 'https://lex.uz/uz/docs/-7640822',
     },
     {
         id: 'decree-7',
         section: 'Qarorlar',
         direction: 'Sanoat xavfsizligi',
         title: '“Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisida”gi Qonunni amalga oshirishga doir qoʻshimcha chora-tadbirlar toʻgʻrisida',
         url: 'https://lex.uz/docs/4817439',
     },
     {
         id: 'decree-8',
         section: 'Qarorlar',
         direction: 'Sanoat xavfsizligi',
         title: 'Gaz xoʻjaligida xavfsizlik qoidalarini tasdiqlash toʻgʻrisida',
         url: 'https://lex.uz/docs/-4244878',
     },
     {
         id: 'decree-9',
         section: 'Qarorlar',
         direction: 'Elektr xavfsizligi',
         title: 'Elektr qurilmalarini ekspluatatsiya qilishda texnika xavfsizligi qoidalarini tasdiqlash toʻgʻrisida',
         url: 'https://lex.uz/docs/-5038211',
     },
     {
         id: 'decree-10',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Xodimlarga mehnat vazifalarini bajarish bilan bogʻliq holda yetkazilgan zararni toʻlash qoidalarini tasdiqlash toʻgʻrisida',
         url: 'https://lex.uz/ru/docs/-492899',
     },
     {
         id: 'decree-11',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Ishlab chiqarishdagi baxtsiz hodisalarni tekshirish va hisobga olish toʻgʻrisidagi nizomni tasdiqlash haqida',
         url: 'https://lex.uz/docs/-545128',
     },
     {
         id: 'decree-12',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Ish beruvchining fuqarolik javobgarligini majburiy sugʻurta qilish toʻgʻrisidagi Qonunni amalga oshirish chora-tadbirlari haqida',
         url: 'https://lex.uz/docs/-1493389',
     },
     {
         id: 'decree-13',
         section: 'Qarorlar',
         direction: 'Sog’liqni saqlash',
         title: 'Imtiyozli shartlarda pensiyaga chiqish huquqini beruvchi roʻyxat va kiritish tartibi toʻgʻrisidagi nizomni tasdiqlash haqida',
         url: 'https://lex.uz/uz/docs/-7765716',
     },
     {
         id: 'decree-14',
         section: 'Qarorlar',
         direction: 'Mehnat muhofazasi',
         title: 'Xodimlar mehnatini muhofaza qilish chora-tadbirlarini yanada takomillashtirish toʻgʻrisida',
         url: 'https://lex.uz/docs/-2463973',
     },
     {
         id: 'rule-1',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Balandlikda ishlaganda mehnatni muhofaza qilish qoidalarini tasdiqlash haqida',
         url: 'https://lex.uz/docs/1433207',
     },
     {
         id: 'rule-2',
         section: 'Qoidalar',
         direction: 'Sanoat xavfsizligi',
         title: 'Xavfli ishlab chiqarish obyektlarida ishlab chiqarish nazoratini tashkil etish va amalga oshirish qoidalarini tasdiqlash toʻgʻrisida',
         url: 'https://lex.uz/docs/-1808749',
     },
     {
         id: 'rule-3',
         section: 'Qoidalar',
         direction: 'Sanoat xavfsizligi',
         title: 'Gazdan xavfli ishlarni xavfsiz olib borishni tashkillashtirish bo‘yicha namunaviy yo‘riqnoma',
         url: 'https://lex.uz/docs/-1851864',
     },
     {
         id: 'rule-4',
         section: 'Qoidalar',
         direction: 'Sog’liqni saqlash',
         title: 'Xodimlarni tibbiy ko‘rikdan o‘tkazish tartibi to‘g‘risidagi nizomni tasdiqlash haqida',
         url: 'https://lex.uz/docs/2046010',
     },
     {
         id: 'rule-5',
         section: 'Qoidalar',
         direction: 'Elektr xavfsizligi',
         title: 'Elektr uskunalaridan foydalaniladigan himoya vositalarini qo‘llash va sinash qoidalari',
         url: 'https://lex.uz/docs/1958099',
     },
     {
         id: 'rule-6',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: '18 yoshgacha bo‘lgan xodimlar ko‘tarishi va tashishi mumkin bo‘lgan og‘ir yuk normalari',
         url: 'https://lex.uz/ru/docs/-1479061',
     },
     {
         id: 'rule-7',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Yuk ko‘targich (minora)larni o‘rnatish va ulardan foydalanishda xavfsizlik qoidalari',
         url: 'https://lex.uz/ru/docs/-1935733',
     },
     {
         id: 'rule-8',
         section: 'Qoidalar',
         direction: 'Sog’liqni saqlash',
         title: 'Mehnatga layoqatsizlik varaqalarini berish tartibi toʻgʻrisidagi yoʻriqnoma',
         url: 'https://lex.uz/docs/-2625878',
     },
     {
         id: 'rule-9',
         section: 'Qoidalar',
         direction: 'Elektr xavfsizligi',
         title: 'Elektr priborlari va tashkiliy texnika bilan ishlashda mehnatni muhofaza qilish qoidalari',
         url: 'https://lex.uz/uz/docs/-2182278',
     },
     {
         id: 'rule-10',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Temir yo‘l transporti ta’mirlash tashkilotlari xodimlari uchun mehnatni muhofaza qilish qoidalari',
         url: 'https://lex.uz/ru/docs/-1578222',
     },
     {
         id: 'rule-11',
         section: 'Qoidalar',
         direction: 'Sanoat xavfsizligi',
         title: 'Neft bazalari va avtoyoqilgʻi quyish shoxobchalaridan foydalanishda xavfsizlik qoidalari',
         url: 'https://lex.uz/uz/docs/-2386922',
     },
     {
         id: 'rule-13',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Bugʻ va issiq suv quvurlari qurish va ulardan foydalanishda mehnatni muhofaza qilish qoidalari',
         url: 'https://lex.uz/docs/-2514335',
     },
     {
         id: 'rule-14',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Ortiqcha bosimli suv isitish qozonlari va bugʻ qozonlarini oʻrnatish hamda foydalanish qoidalari',
         url: 'https://lex.uz/docs/-2818096',
     },
     {
         id: 'rule-15',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Yuk ko‘tarish mashinalarini xavfsiz ishlatishni nazorat qiluvchi xodimlar uchun namunaviy yo‘riqnoma',
         url: 'https://lex.uz/uz/docs/-2821982',
     },
     {
         id: 'rule-16',
         section: 'Qoidalar',
         direction: 'Mehnat muhofazasi',
         title: 'Yuk ko‘tarish kranlari tuzilishi va ularni xavfsiz ishlatish qoidalari (PDF)',
         url: 'https://api-portal.gov.uz/uploads/c9cc58b8-559d-1fb1-805b-d66981dcc05e_media_.pdf',
     },
 ];

const calculateRegionalStats = (companies: Company[]): RegionalStat[] => {
    const mtuIds = ['14', '15', '16', '17', '18', '19'];

    return mtuIds
        .map(mtuId => {
            const mtuNode = UZ_RAILWAY_DATA.find(n => n.id === mtuId);
            if (!mtuNode) return null;

            const descendants = getAllDescendants(mtuId);
            const descendantIds = descendants.map(d => d.id);

            const regionCompanies = companies.filter(c =>
                c.parent === mtuId || descendantIds.includes(c.parent || '') || descendantIds.includes(c.id)
            );

            const regionTotal = regionCompanies.reduce((acc, c) => acc + (c.overall_index || 0), 0);
            const regionAvg = regionCompanies.length > 0 ? regionTotal / regionCompanies.length : 0;

            return {
                id: mtuId,
                name: mtuNode?.name || mtuId,
                avgRating: regionAvg,
                count: regionCompanies.length,
                status: regionAvg >= 80 ? 'green' : regionAvg >= 60 ? 'yellow' : 'red',
            } as RegionalStat;
        })
        .filter(Boolean)
        .sort((a, b) => (b?.avgRating || 0) - (a?.avgRating || 0)) as RegionalStat[];
};

const buildTrendSeries = (companies: Company[], fallbackValue: number): TrendPoint[] => {
    const months = 6;
    const now = new Date();
    const chunk = Math.max(1, Math.floor(companies.length / months));

    const formatter = new Intl.DateTimeFormat('uz-UZ', { month: 'short' });

    return Array.from({ length: months }).map((_, idx) => {
        const referenceDate = new Date(now.getFullYear(), now.getMonth() - (months - idx - 1), 1);
        const start = idx * chunk;
        const bucket = companies.slice(start, start + chunk);
        const avg = bucket.length > 0
            ? bucket.reduce((acc, c) => acc + (c.overall_index || 0), 0) / bucket.length
            : fallbackValue;

        return {
            label: formatter.format(referenceDate),
            value: Math.round(avg),
        };
    });
};

const TooltipCard: React.FC<{ title: string; value: string; subtitle?: string; status?: 'green' | 'yellow' | 'red' }> = ({
    title,
    value,
    subtitle,
    status,
}) => (
    <div className="tooltip-card">
        <span className="tooltip-card__title">{title}</span>
        <span className="tooltip-card__value">{value}</span>
        {subtitle && <span className="tooltip-card__subtitle">{subtitle}</span>}
        {status && (
            <span className={`tooltip-card__status tooltip-card__status--${status}`}>
                {STATUS_COPY[status]}
            </span>
        )}
    </div>
);

const ZoneTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const item = payload[0];
    const value = Number(item.value ?? 0);

    return (
        <TooltipCard
            title={String(item.name ?? 'Zona')}
            value={`${value.toLocaleString('uz-UZ')} ta`}
        />
    );
};

const TrendTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const value = Number(payload[0].value ?? 0);

    return (
        <TooltipCard
            title={String(label ?? '')}
            value={`${Math.round(value)}%`}
            subtitle="Umumiy indeks"
        />
    );
};

const RegionTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const item = payload[0];
    const data = item.payload as RegionalStat;

    return (
        <TooltipCard
            title={data.name}
            value={`${Math.round(data.avgRating)}%`}
            subtitle={`${data.count} korxona`}
            status={data.status}
        />
    );
};

const GlobalDashboardApp: React.FC = () => {
    const [state] = useContext(store);
    const windowState = state?.globaldashWindow ?? { closed: true };
    const isWindowClosed = windowState.closed;

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [regionalStats, setRegionalStats] = useState<RegionalStat[]>([]);
    const [globalIndex, setGlobalIndex] = useState(0);
    const [trendSeries, setTrendSeries] = useState<TrendPoint[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');

     const [docSection, setDocSection] = useState<DocumentSection>('Qonunlar');
     const [docDirection, setDocDirection] = useState<string>('Barchasi');
     const [docSearch, setDocSearch] = useState<string>('');

    const applyDataset = useCallback((dataset: Company[]) => {
        const totalScore = dataset.reduce((acc, c) => acc + (c.overall_index || 0), 0);
        const avg = dataset.length > 0 ? totalScore / dataset.length : 0;

        setCompanies(dataset);
        setGlobalIndex(Math.round(avg));
        setRegionalStats(calculateRegionalStats(dataset));
        setTrendSeries(buildTrendSeries(dataset, Math.round(avg)));
        setLastUpdated(new Intl.DateTimeFormat('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
        }).format(new Date()));
    }, []);

    const loadGlobalData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('overall_index', { ascending: false });

            if (error || !data || data.length === 0) {
                console.warn('Using mock data for Global Dashboard due to Supabase error/empty response:', error);
                applyDataset(MOCK_COMPANIES);
            } else {
                applyDataset(data as Company[]);
            }
        } catch (error) {
            console.error('Error loading global dashboard data:', error);
            applyDataset(MOCK_COMPANIES);
        } finally {
            setLoading(false);
        }
    }, [applyDataset]);

    useEffect(() => {
        if (!isWindowClosed) {
            void loadGlobalData();
        }
    }, [isWindowClosed, loadGlobalData]);

    const totalCompanies = companies.length;
    const totalEmployees = useMemo(
        () => companies.reduce((acc, curr) => acc + (curr.employees || 0), 0),
        [companies]
    );

    const zoneTotals = useMemo(() => ({
        green: companies.filter(c => c.zone === 'green').length,
        yellow: companies.filter(c => c.zone === 'yellow').length,
        red: companies.filter(c => c.zone === 'red').length,
    }), [companies]);

    const zoneDistribution = useMemo(() => ([
        { name: 'Barqaror', value: zoneTotals.green, color: '#34C759' },
        { name: 'Nazorat', value: zoneTotals.yellow, color: '#FF9500' },
        { name: 'Kritik', value: zoneTotals.red, color: '#FF3B30' },
    ]), [zoneTotals]);

    const coverageRate = totalCompanies > 0 ? Math.round((zoneTotals.green / totalCompanies) * 100) : 0;
    const criticalShare = totalCompanies > 0 ? Math.round((zoneTotals.red / totalCompanies) * 100) : 0;
    const trendDelta = trendSeries.length >= 2
        ? trendSeries[trendSeries.length - 1].value - trendSeries[0].value
        : 0;

    const riskAlerts = useMemo(() => (
        companies
            .filter(c => c.zone === 'red')
            .sort((a, b) => (b.overall_index || 0) - (a.overall_index || 0))
            .slice(0, 4)
    ), [companies]);

    const topPerformers = useMemo(() => (
        [...companies]
            .sort((a, b) => (b.overall_index || 0) - (a.overall_index || 0))
            .slice(0, 5)
    ), [companies]);

    const insightHighlights = useMemo(() => ([
        {
            title: 'Monitoring qamrovi',
            description: `${coverageRate}% korxona yashil zonada va barqaror tarzda ishlamoqda.`
        },
        {
            title: 'Trend dinamikasi',
            description: `Umumiy indeks ${trendDelta >= 0 ? 'o\'sish' : 'pasayish'} trendini ko'rsatmoqda (${trendDelta >= 0 ? '+' : ''}${trendDelta} pt).`
        },
        {
            title: 'Xavflarni boshqarish',
            description: `${riskAlerts.length} ta muhim hudud darhol choralar talab qiladi.`
        },
    ]), [coverageRate, trendDelta, riskAlerts.length]);

    const statusKey: 'green' | 'yellow' | 'red' = globalIndex >= 80 ? 'green' : globalIndex >= 60 ? 'yellow' : 'red';
    const gaugeValue = Math.min(100, Math.max(0, globalIndex));
    const gaugeColor = getStatusColor(statusKey);

    const summaryCards = [
        {
            key: 'companies',
            icon: '🏢',
            label: 'Korxonalar',
            value: loading ? '…' : totalCompanies.toLocaleString('uz-UZ'),
            hint: 'Faol tashkilotlar soni',
            footer: `${zoneTotals.green} ta barqaror hudud`,
        },
        {
            key: 'employees',
            icon: '👥',
            label: 'Xodimlar',
            value: loading ? '…' : totalEmployees.toLocaleString('uz-UZ'),
            hint: 'Monitoring qamrovi',
            footer: `${(totalEmployees / 1000).toFixed(1)} ming soat/hajm`,
        },
        {
            key: 'stability',
            icon: '🟢',
            label: 'Barqarorlik',
            value: loading ? '…' : `${coverageRate}%`,
            hint: 'Yashil zona ulushi',
            footer: `${trendDelta >= 0 ? '▲' : '▼'} ${Math.abs(trendDelta)} pt dinamika`,
        },
        {
            key: 'risk',
            icon: '⚠️',
            label: 'Xavf darajasi',
            value: loading ? '…' : `${criticalShare}%`,
            hint: 'Qizil zonadagi hududlar',
            footer: `${riskAlerts.length} ta shoshilinch reja`,
        },
    ];

     const documentSections: DocumentSection[] = ['Qonunlar', 'Qarorlar', 'Qoidalar'];

     const availableDirections = useMemo(() => {
         const dirs = Array.from(
             new Set(
                 NORMATIVE_DOCUMENTS
                     .filter(d => d.section === docSection)
                     .map(d => d.direction)
             )
         ).sort((a, b) => a.localeCompare(b, 'uz'));

         return ['Barchasi', ...dirs];
     }, [docSection]);

     useEffect(() => {
         if (!availableDirections.includes(docDirection)) {
             setDocDirection('Barchasi');
         }
     }, [availableDirections, docDirection]);

     const filteredDocuments = useMemo(() => {
         const needle = docSearch.trim().toLowerCase();
         return NORMATIVE_DOCUMENTS
             .filter(d => d.section === docSection)
             .filter(d => docDirection === 'Barchasi' ? true : d.direction === docDirection)
             .filter(d => {
                 if (!needle) return true;
                 return (
                     d.title.toLowerCase().includes(needle) ||
                     d.direction.toLowerCase().includes(needle)
                 );
             });
     }, [docDirection, docSearch, docSection]);

     const openDocument = useCallback((url: string) => {
         window.open(url, '_blank', 'noopener,noreferrer');
     }, []);

    if (isWindowClosed) {
        return null;
    }

    return (
        <AppWindow
            appId="globaldash"
            title="Global Dashboard"
            defaultWidth={1260}
            defaultHeight={820}
            defaultX={60}
            defaultY={28}
        >
            <div className="global-dashboard-app">
                <header className="hero">
                    <div className="hero__title">
                        <span className="hero__eyebrow">macOS Safety Intelligence</span>
                        <h1>Global Xavfsizlik Paneli</h1>
                        <p>Butun tizim bo'yicha real vaqtli monitoring va strategik boshqaruv</p>
                    </div>
                    <div className="hero__meta">
                        <div className="hero__badges">
                            <div className="status-badge">
                                <span>Joriy indeks</span>
                                <strong>{loading ? '…' : `${globalIndex}%`}</strong>
                            </div>
                            <div className={`status-chip status-chip--${statusKey}`}>
                                {STATUS_COPY[statusKey]}
                            </div>
                        </div>
                        <div className="hero__controls">
                            <span className="timestamp">Yangilandi: {lastUpdated || '—'}</span>
                            <button className="refresh-btn" onClick={loadGlobalData} disabled={loading}>
                                <span className={loading ? 'spinner' : ''}>🔄</span>
                                {loading ? 'Yuklanmoqda…' : 'Yangilash'}
                            </button>
                        </div>
                    </div>
                </header>

                <section className="glass-grid primary-metrics">
                    {summaryCards.map(card => (
                        <article className="glass-card summary-card" key={card.key}>
                            <div className="summary-card__icon" aria-hidden>{card.icon}</div>
                            <div className="summary-card__body">
                                <span className="summary-card__label">{card.label}</span>
                                <strong className="summary-card__value">{card.value}</strong>
                                <p className="summary-card__hint">{card.hint}</p>
                            </div>
                            <footer className="summary-card__footer">{card.footer}</footer>
                        </article>
                    ))}
                </section>

                <section className="glass-grid analytics-grid">
                    <article className="glass-card global-index-card">
                        <header className="card-header">
                            <h2>Xavfsizlik Indeksi</h2>
                            <span className={`card-chip card-chip--${statusKey}`}>{STATUS_COPY[statusKey]}</span>
                        </header>
                        <div className="radial-meter">
                            <div
                                className="radial-meter__ring"
                                style={{
                                    background: `conic-gradient(${gaugeColor} ${gaugeValue * 3.6}deg, rgba(255,255,255,0.08) ${gaugeValue * 3.6}deg)`
                                }}
                            >
                                <div className="radial-meter__inner">
                                    <strong>{loading ? '…' : `${gaugeValue}%`}</strong>
                                    <span>Umumiy baho</span>
                                </div>
                            </div>
                            <ul className="radial-meter__legend">
                                <li><span className="dot dot--green" />80%+ barqaror</li>
                                <li><span className="dot dot--yellow" />60-79% nazorat</li>
                                <li><span className="dot dot--red" />0-59% kritik</li>
                            </ul>
                        </div>
                    </article>

                    <article className="glass-card zone-distribution">
                        <header className="card-header">
                            <h2>Zona Taqqoslash</h2>
                            <span className="card-subtitle">Risk taqsimoti</span>
                        </header>
                        <div className="zone-distribution__content">
                            <div className="zone-distribution__chart">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={zoneDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={96}
                                            paddingAngle={6}
                                            dataKey="value"
                                            cornerRadius={12}
                                        >
                                            {zoneDistribution.map((entry, index) => (
                                                <Cell key={`zone-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ZoneTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <ul className="zone-distribution__legend">
                                {zoneDistribution.map(item => (
                                    <li key={item.name}>
                                        <span className="legend-dot" style={{ background: item.color }} />
                                        <div>
                                            <span className="legend-label">{item.name}</span>
                                            <span className="legend-value">{item.value} ta</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>

                    <article className="glass-card trend-card">
                        <header className="card-header">
                            <h2>Trend Dinamikasi</h2>
                            <span className="card-subtitle">Oxirgi 6 oy</span>
                        </header>
                        <div className="trend-card__chart">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={trendSeries} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                                    <XAxis dataKey="label" stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip content={<TrendTooltip />} />
                                    <Area type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={3} fill="url(#trendGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <footer className={`trend-card__footer ${trendDelta >= 0 ? 'is-positive' : 'is-negative'}`}>
                            {trendDelta >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            <span>{Math.abs(trendDelta)} punkt o'zgarish</span>
                        </footer>
                    </article>
                </section>

                <section className="glass-grid region-grid">
                    <article className="glass-card region-performance">
                        <header className="card-header">
                            <h2>Hududiy ko'rsatkichlar</h2>
                            <span className="card-subtitle">MTU kesimida</span>
                        </header>
                        <div className="region-performance__chart">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={regionalStats}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" horizontal={true} vertical={false} />
                                    <XAxis type="number" domain={[0, 100]} stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" width={120} stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<RegionTooltip />} />
                                    <Bar dataKey="avgRating" radius={[0, 12, 12, 0]} barSize={18}>
                                        {regionalStats.map((entry, index) => (
                                            <Cell key={`region-${index}`} fill={getStatusColor(entry.status)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </article>

                    <article className="glass-card region-breakdown">
                        <header className="card-header">
                            <h2>Hududiy tafsilotlar</h2>
                            <span className="card-subtitle">Faoliyat va qamrov</span>
                        </header>
                        <ul className="region-list">
                            {regionalStats.map((region, index) => (
                                <li className="region-list__item" key={region.id}>
                                    <span className="region-list__rank">{index + 1}</span>
                                    <div className="region-list__meta">
                                        <span className="region-list__name">{region.name}</span>
                                        <span className="region-list__details">{region.count} korxona · {Math.round(region.avgRating)}%</span>
                                    </div>
                                    <span className={`region-list__status region-list__status--${region.status}`}>
                                        {STATUS_COPY[region.status]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>

                <section className="glass-grid insights-grid">
                    <article className="glass-card risk-alerts">
                        <header className="card-header">
                            <h2>Kritik hududlar</h2>
                            <span className="card-subtitle">Tezkor reja talab etiladi</span>
                        </header>
                        <div className="risk-alerts__list">
                            {riskAlerts.length === 0 ? (
                                <p className="placeholder">Ayni paytda kritik zona aniqlanmadi.</p>
                            ) : (
                                riskAlerts.map((company, index) => (
                                    <div className="risk-alerts__item" key={company.id}>
                                        <div className="risk-alerts__badge">{index + 1}</div>
                                        <div className="risk-alerts__meta">
                                            <span className="risk-alerts__name">{company.name}</span>
                                            <span className="risk-alerts__details">{company.overall_index}% indeks · {company.employees?.toLocaleString('uz-UZ')} xodim</span>
                                        </div>
                                        <FaExclamationTriangle className="risk-alerts__icon" />
                                    </div>
                                ))
                            )}
                        </div>
                    </article>

                    <article className="glass-card top-performers">
                        <header className="card-header">
                            <h2>Eng yaxshi ko'rsatkichlar</h2>
                            <span className="card-subtitle">Yashil zona liderlari</span>
                        </header>
                        <ul className="performer-list">
                            {topPerformers.map((company, index) => (
                                <li className="performer-list__item" key={company.id}>
                                    <span className="performer-list__rank">{index + 1}</span>
                                    <div className="performer-list__meta">
                                        <span className="performer-list__name">{company.name}</span>
                                        <span className="performer-list__details">{company.overall_index}% · {company.employees?.toLocaleString('uz-UZ')} xodim</span>
                                    </div>
                                    <FaRegCheckCircle className="performer-list__icon" />
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="glass-card insights-panel">
                        <header className="card-header">
                            <h2>Operatsion insaytlar</h2>
                            <span className="card-subtitle">AI asosidagi tavsiyalar</span>
                        </header>
                        <ul className="insight-list">
                            {insightHighlights.map((item, index) => (
                                <li className="insight-list__item" key={index}>
                                    <div className="insight-list__icon">✨</div>
                                    <div>
                                        <span className="insight-list__title">{item.title}</span>
                                        <p className="insight-list__description">{item.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>

                 <section className="glass-grid documents-grid">
                     <article className="glass-card normative-documents">
                         <header className="card-header">
                             <h2>Normativ hujjatlar</h2>
                             <span className="card-subtitle">Qonunlar · Qarorlar · Qoidalar</span>
                         </header>

                         <div className="normative-documents__controls">
                             <div className="normative-documents__tabs" role="tablist" aria-label="Hujjatlar bo‘limlari">
                                 {documentSections.map(section => (
                                     <button
                                         key={section}
                                         type="button"
                                         className={`normative-documents__tab ${section === docSection ? 'is-active' : ''}`}
                                         onClick={() => setDocSection(section)}
                                         role="tab"
                                         aria-selected={section === docSection}
                                     >
                                         {section}
                                     </button>
                                 ))}
                             </div>

                             <div className="normative-documents__filters">
                                 <label className="normative-documents__field">
                                     <span>Yo‘nalish</span>
                                     <select value={docDirection} onChange={e => setDocDirection(e.target.value)}>
                                         {availableDirections.map(d => (
                                             <option key={d} value={d}>{d}</option>
                                         ))}
                                     </select>
                                 </label>
                                 <label className="normative-documents__field">
                                     <span>Qidirish</span>
                                     <input
                                         value={docSearch}
                                         onChange={e => setDocSearch(e.target.value)}
                                         placeholder="Nomi bo‘yicha..."
                                     />
                                 </label>
                             </div>
                         </div>

                         <div className="normative-documents__table-wrap">
                             <table className="normative-documents__table">
                                 <thead>
                                     <tr>
                                         <th style={{ width: '34%' }}>Yo‘nalish</th>
                                         <th>Nomi</th>
                                         <th style={{ width: 120, textAlign: 'right' }}>Havola</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {filteredDocuments.length === 0 ? (
                                         <tr>
                                             <td colSpan={3} className="normative-documents__empty">
                                                 Mos hujjat topilmadi.
                                             </td>
                                         </tr>
                                     ) : (
                                         filteredDocuments.map(doc => (
                                             <tr key={doc.id}>
                                                 <td className="normative-documents__direction">{doc.direction}</td>
                                                 <td className="normative-documents__title">{doc.title}</td>
                                                 <td style={{ textAlign: 'right' }}>
                                                     <button
                                                         type="button"
                                                         className="normative-documents__open"
                                                         onClick={() => openDocument(doc.url)}
                                                     >
                                                         Ochish
                                                     </button>
                                                 </td>
                                             </tr>
                                         ))
                                     )}
                                 </tbody>
                             </table>
                         </div>
                     </article>
                 </section>
            </div>
        </AppWindow>
    );
};

export default GlobalDashboardApp;
