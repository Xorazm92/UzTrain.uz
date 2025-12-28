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
            </div>
        </AppWindow>
    );
};

export default GlobalDashboardApp;
