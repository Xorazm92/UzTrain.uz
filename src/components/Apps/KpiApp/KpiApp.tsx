import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './KpiApp.scss';
import { supabase, Company } from '@/lib/supabase';
import {
    KPI_METADATA,
    STATUS_LABELS,
    DEPARTMENT_PROFILES,
    evaluateStatus,
    fallbackMeta,
    normalizeKpiKey,
} from '@/lib/kpi/metadata';
import type { KPIMetadata, KPIStatus } from '@/lib/kpi/metadata';
import {
    calculateCompanyKPIs,
    calculateOverallIndex,
    determineZone,
    type CompanyKpiInput,
} from '@/lib/kpi/calculator';

interface KPIExtrema {
    company: string;
    score: number;
}

interface KPIAggregate {
    key: string;
    meta: KPIMetadata;
    avgScore: number;
    avgValue: number;
    count: number;
    status: KPIStatus;
    best?: KPIExtrema;
    worst?: KPIExtrema;
    updatedAt?: string;
}

type CompanyFormState = {
    name: string;
    level: Company['level'];
    parent: string;
    profile: string;
    profileRisk: string;
    employees: string;
    totalHours: string;
    month: string;
    year: string;
    zone: Company['zone'];
    raw: CompanyKpiInput;
    kpis: Record<string, number>;
    overallPreview: number | null;
};

type ViolationColor = 'red' | 'yellow' | 'green';

const createEmptyCompanyForm = (): CompanyFormState => {
    const initialKpis = KPI_METADATA.reduce<Record<string, number>>((acc, meta) => {
        acc[meta.key] = meta.target;
        return acc;
    }, {});

    return {
        name: '',
        level: 'management',
        parent: '',
        profile: 'Regional',
        profileRisk: 'locomotive',
        employees: '',
        totalHours: '',
        month: '',
        year: String(new Date().getFullYear()),
        zone: 'green',
        raw: {
            employees: 0,
            profile: 'locomotive',
        },
        kpis: initialKpis,
        overallPreview: null,
    };
};

const createSeedAggregate = (meta: KPIMetadata): KPIAggregate => ({
    key: meta.key,
    meta,
    avgScore: 0,
    avgValue: meta.target,
    count: 0,
    status: 'yellow',
});

const aggregateKpis = (companies: Company[]): KPIAggregate[] => {
    const aggregates = new Map<string, KPIAggregate>(
        KPI_METADATA.map(meta => [meta.key, createSeedAggregate(meta)])
    );

    companies.forEach(company => {
        Object.entries(company.kpis ?? {}).forEach(([key, metric]) => {
            if (!metric || typeof metric.score !== 'number') return;

            const normalizedKey = normalizeKpiKey(key);
            const meta = KPI_METADATA.find(item => item.key === normalizedKey) ?? fallbackMeta(normalizedKey);
            const current = aggregates.get(normalizedKey) ?? createSeedAggregate(meta);

            const nextCount = current.count + 1;
            const nextScoreTotal = current.avgScore * current.count + metric.score;
            const nextValueTotal = current.avgValue * current.count + (metric.value ?? metric.score);

            const best = !current.best || metric.score > current.best.score
                ? { company: company.name, score: metric.score }
                : current.best;

            const worst = !current.worst || metric.score < current.worst.score
                ? { company: company.name, score: metric.score }
                : current.worst;

            const updatedAt = company.updated_at && (!current.updatedAt || company.updated_at > current.updatedAt)
                ? company.updated_at
                : current.updatedAt;

            const avgScore = nextScoreTotal / nextCount;

            aggregates.set(normalizedKey, {
                key: normalizedKey,
                meta,
                avgScore,
                avgValue: nextValueTotal / nextCount,
                count: nextCount,
                status: evaluateStatus(avgScore, meta),
                best,
                worst,
                updatedAt,
            });
        });
    });

    const ordered = KPI_METADATA.map(meta => aggregates.get(meta.key) ?? createSeedAggregate(meta));
    const extras = Array.from(aggregates.entries())
        .filter(([key]) => !KPI_METADATA.find(meta => meta.key === key))
        .map(([, value]) => value)
        .sort((a, b) => a.meta.label.localeCompare(b.meta.label, 'uz'));

    return [...ordered, ...extras];
};

const buildMockKpiScores = (overrides: Partial<Record<string, number>> = {}): Record<string, { value: number; score: number }> => {
    return KPI_METADATA.reduce<Record<string, { value: number; score: number }>>((acc, meta) => {
        const defaultScore = meta.direction === 'lower' ? 12 : 88;
        const baseScore = overrides[meta.key] ?? defaultScore;
        const clamped = Math.max(0, Math.min(100, baseScore));
        acc[meta.key] = { value: clamped, score: clamped };
        return acc;
    }, {});
};

const buildMockCompany = (
    id: string,
    name: string,
    overrides: Partial<Record<string, number>>,
    zone: Company['zone'],
    employees: number,
): Company => {
    const scores = buildMockKpiScores(overrides);
    const overall = calculateOverallIndex(scores, 'locomotive');

    return {
        id,
        name,
        parent: 'Boshqarma',
        level: 'management',
        profile: 'Regional',
        employees,
        total_hours: employees * 160,
        overall_index: Math.round(overall),
        zone,
        kpis: scores,
        date_added: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        raw_data: {},
    };
};

const MOCK_COMPANIES: Company[] = [
    buildMockCompany('1', 'Toshkent MTU', { ltifr: 96, hseStaffing: 98, insurance: 94 }, 'green', 1250),
    buildMockCompany('2', "Qo'qon MTU", { ltifr: 72, equipment: 78, violations: 60 }, 'yellow', 980),
    buildMockCompany('3', 'Buxoro MTU', { ltifr: 68, training: 82, inspection: 75 }, 'yellow', 1100),
    buildMockCompany('4', 'Qarshi MTU', { ltifr: 45, prevention: 58, violations: 40 }, 'red', 850),
    buildMockCompany('5', 'Termiz MTU', { ltifr: 98, equipment: 95, emergency: 92 }, 'green', 600),
];

const normalizeCompanyRecord = (company: Company): Company => {
    const normalizedKpis = Object.entries(company.kpis ?? {}).reduce<Record<string, { value: number; score: number }>>((acc, [rawKey, metric]) => {
        const normalizedKey = normalizeKpiKey(rawKey);
        acc[normalizedKey] = metric;
        return acc;
    }, {});

    return {
        ...company,
        kpis: normalizedKpis,
    };
};

const KpiApp: React.FC = () => {
    const [state] = useContext(store);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('Barchasi');
    const [statusFilter, setStatusFilter] = useState<'all' | KPIStatus>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [companyForm, setCompanyForm] = useState<CompanyFormState>(() => createEmptyCompanyForm());
    const [formError, setFormError] = useState<string | null>(null);
    const [savingCompany, setSavingCompany] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error || !data || data.length === 0) {
                console.warn('KPI App: Supabase javobi bo‘sh yoki xato. Mock maʼlumot ishlatiladi.', error);
                setCompanies(MOCK_COMPANIES.map(normalizeCompanyRecord));
            } else {
                setCompanies((data as Company[]).map(normalizeCompanyRecord));
            }
        } catch (error) {
            console.error('KPI App: maʼlumot yuklashda xato:', error);
            setCompanies(MOCK_COMPANIES.map(normalizeCompanyRecord));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!state.kpiWindow?.closed) {
            void loadData();
        }
    }, [state.kpiWindow?.closed, loadData]);

    const isWindowClosed = state.kpiWindow?.closed ?? false;

    const kpiAggregates = useMemo(() => aggregateKpis(companies), [companies]);

    const categories = useMemo(() => {
        const unique = new Set<string>();
        kpiAggregates.forEach(item => unique.add(item.meta.category));
        return ['Barchasi', ...Array.from(unique).sort((a, b) => a.localeCompare(b, 'uz'))];
    }, [kpiAggregates]);

    const statusCounts = useMemo(() => {
        return kpiAggregates.reduce<Record<KPIStatus, number>>((acc, item) => {
            acc[item.status] += 1;
            return acc;
        }, { green: 0, yellow: 0, red: 0 });
    }, [kpiAggregates]);

    const filteredKpis = useMemo(() => {
        const needle = searchTerm.trim().toLowerCase();
        return kpiAggregates.filter(item => {
            const matchesCategory = categoryFilter === 'Barchasi' || item.meta.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesSearch = !needle || item.meta.label.toLowerCase().includes(needle) || item.meta.key.toLowerCase().includes(needle);
            return matchesCategory && matchesStatus && matchesSearch;
        });
    }, [kpiAggregates, categoryFilter, statusFilter, searchTerm]);

    const totals = useMemo(() => {
        const totalObservations = kpiAggregates.reduce((acc, item) => acc + item.count, 0);
        const weightedScoreSum = kpiAggregates.reduce((acc, item) => acc + item.avgScore * item.count, 0);
        const overallScore = totalObservations > 0 ? Math.round(weightedScoreSum / totalObservations) : 0;
        const compliant = kpiAggregates.filter(item => item.status === 'green').length;
        const complianceRate = kpiAggregates.length > 0 ? Math.round((compliant / kpiAggregates.length) * 100) : 0;
        const latest = kpiAggregates.reduce<string | undefined>((acc, item) => {
            if (!item.updatedAt) return acc;
            return !acc || item.updatedAt > acc ? item.updatedAt : acc;
        }, undefined);
        return { totalObservations, overallScore, complianceRate, latest };
    }, [kpiAggregates]);

    const lastUpdatedDisplay = useMemo(() => {
        if (!totals.latest) return '—';
        try {
            return new Intl.DateTimeFormat('uz-UZ', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(totals.latest));
        } catch {
            return totals.latest;
        }
    }, [totals.latest]);

    const summaryCards = useMemo(() => ([
        {
            key: 'kpi-count',
            label: 'Monitor qilinayotgan KPI',
            value: loading ? '…' : kpiAggregates.length,
            hint: 'Korxonalar bo‘yicha umumlashtirilgan',
            icon: '📈',
        },
        {
            key: 'avg-score',
            label: 'O‘rtacha ball',
            value: loading ? '…' : `${totals.overallScore}%`,
            hint: 'Vaznli o‘rtacha natija',
            icon: '🎯',
        },
        {
            key: 'compliance',
            label: 'Maqsadga erishish',
            value: loading ? '…' : `${totals.complianceRate}%`,
            hint: 'Yashil status ulushi',
            icon: '✅',
        },
        {
            key: 'observations',
            label: 'O‘lchovlar soni',
            value: loading ? '…' : totals.totalObservations.toLocaleString('uz-UZ'),
            hint: 'Korxona × KPI kombinatsiyalari',
            icon: '🧮',
        },
    ]), [kpiAggregates.length, loading, totals.complianceRate, totals.overallScore, totals.totalObservations]);

    const statusFilters: Array<{ key: 'all' | KPIStatus; label: string; count?: number }> = [
        { key: 'all', label: 'Barchasi' },
        { key: 'green', label: `${STATUS_LABELS.green}`, count: statusCounts.green },
        { key: 'yellow', label: `${STATUS_LABELS.yellow}`, count: statusCounts.yellow },
        { key: 'red', label: `${STATUS_LABELS.red}`, count: statusCounts.red },
    ];

    const resetCompanyForm = useCallback(() => {
        setCompanyForm(createEmptyCompanyForm());
        setFormError(null);
    }, []);

    const openAddModal = () => {
        resetCompanyForm();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        if (savingCompany) return;
        setIsAddModalOpen(false);
    };

    const computeFormPreview = (state: CompanyFormState): number | null => {
        const employees = Number(state.employees);
        if (!Number.isFinite(employees) || employees <= 0) {
            return null;
        }

        const input: CompanyKpiInput = {
            ...state.raw,
            employees,
            profile: state.profileRisk,
            totalHours: state.totalHours ? Number(state.totalHours) : undefined,
        };

        const kpis = calculateCompanyKPIs(input);
        return calculateOverallIndex(kpis, state.profileRisk);
    };

    const handleFormFieldChange = (field: keyof CompanyFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setCompanyForm(prev => {
            const nextState = { ...prev, [field]: value } as CompanyFormState;
            return {
                ...nextState,
                overallPreview: computeFormPreview(nextState),
            };
        });
    };

    const handleNumericRawChange = (field: keyof CompanyKpiInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = Number(event.target.value);
        setCompanyForm(prev => {
            const nextRaw = {
                ...prev.raw,
                [field]: Number.isNaN(rawValue) ? prev.raw[field] : rawValue,
            } as CompanyKpiInput;
            const nextState = { ...prev, raw: nextRaw };
            return {
                ...nextState,
                overallPreview: computeFormPreview(nextState),
            };
        });
    };

    const handleViolationChange = (group: 'internalViolations' | 'externalViolations', color: ViolationColor) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(event.target.value);
            setCompanyForm(prev => {
                const currentGroup = prev.raw[group] ?? { red: 0, yellow: 0, green: 0 };
                const nextGroup = {
                    ...currentGroup,
                    [color]: Number.isNaN(value) ? currentGroup[color] ?? 0 : value,
                } as Record<ViolationColor, number>;
                const nextRaw = {
                    ...prev.raw,
                    [group]: nextGroup,
                } as CompanyKpiInput;
                const nextState = { ...prev, raw: nextRaw };
                return {
                    ...nextState,
                    overallPreview: computeFormPreview(nextState),
                };
            });
        };

    const handleKpiChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setCompanyForm(prev => ({
            ...prev,
            kpis: {
                ...prev.kpis,
                [key]: Number.isNaN(value) ? prev.kpis[key] : value,
            },
        }));
    };

        const handleSubmitCompany = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        const trimmedName = companyForm.name.trim();
        if (!trimmedName) {
            setFormError('Korxona nomini kiriting.');
            return;
        }

        const employees = Number(companyForm.employees);
        if (Number.isNaN(employees) || employees <= 0) {
            setFormError('Xodimlar sonini to‘g‘ri kiriting.');
            return;
        }

        const totalHours = companyForm.totalHours
            ? Number(companyForm.totalHours)
            : Math.max(0, Math.round(employees * 160));

        if (Number.isNaN(totalHours) || totalHours <= 0) {
            setFormError('Jami ish soatlarini to‘g‘ri kiriting.');
            return;
        }

        const normalizedRaw: CompanyKpiInput = {
            ...companyForm.raw,
            employees,
            totalHours,
            profile: companyForm.profileRisk,
        };

        const kpiResults = calculateCompanyKPIs(normalizedRaw);
        const overallIndex = calculateOverallIndex(kpiResults, companyForm.profileRisk);
        const suggestedZone = determineZone(overallIndex);
        const zone: Company['zone'] = companyForm.zone ?? suggestedZone;

        const payload: Company = {
            id: crypto.randomUUID(),
            name: trimmedName,
            level: companyForm.level,
            parent: companyForm.parent.trim() || null,
            profile: companyForm.profile.trim() || 'Regional',
            employees,
            total_hours: totalHours,
            kpis: kpiResults,
            overall_index: overallIndex,
            zone,
            date_added: new Date().toISOString(),
            raw_data: normalizedRaw,
            updated_at: new Date().toISOString(),
        };

        setSavingCompany(true);

        try {
            const { data, error } = await supabase
                .from('companies')
                .insert(payload)
                .select('*');

            if (error) {
                console.error('KPI App: Supabase insert error, local fallback used:', error);
            }

            const record = data && data[0] ? normalizeCompanyRecord(data[0] as Company) : normalizeCompanyRecord(payload);

            setCompanies(prev => [record, ...prev]);
            setIsAddModalOpen(false);
            setTimeout(() => {
                void loadData();
            }, 150);
        } catch (error) {
            console.error('KPI App: yangi korxona qo‘shishda xato:', error);
            setFormError('Saqlashda xatolik. Keyinroq urinib ko‘ring.');
        } finally {
            setSavingCompany(false);
        }
    };

    if (isWindowClosed) {
        return null;
    }

    return (
        <AppWindow
            appId="kpi"
            title="KPI Ko'rsatkichlari"
            defaultWidth={1180}
            defaultHeight={760}
            defaultX={96}
            defaultY={54}
        >
            <div className="kpi-app">
                <header className="kpi-hero">
                    <div className="kpi-hero__titles">
                        <span className="kpi-hero__eyebrow">macOS Safety Analytics</span>
                        <h1>KPI boshqaruv paneli</h1>
                        <p>Xavfsizlik va mehnat muhofazasi ko‘rsatkichlari real vaqt rejimida.</p>
                    </div>
                    <div className="kpi-hero__meta">
                        <span className="kpi-hero__timestamp">Yangilandi: {loading ? 'yuklanmoqda…' : lastUpdatedDisplay}</span>
                        <button className="kpi-hero__refresh" onClick={loadData} disabled={loading}>
                            <span className={loading ? 'is-spinning' : ''}>🔄</span>
                            {loading ? 'Yangilanmoqda…' : 'Yangilash'}
                        </button>
                        <button className="kpi-hero__add" onClick={openAddModal}>
                            + Korxona qo‘shish
                        </button>
                    </div>
                </header>

                <section className="kpi-summary-grid">
                    {summaryCards.map(card => (
                        <article className="kpi-summary-card" key={card.key}>
                            <div className="kpi-summary-card__icon" aria-hidden>{card.icon}</div>
                            <div className="kpi-summary-card__body">
                                <span className="kpi-summary-card__label">{card.label}</span>
                                <strong className="kpi-summary-card__value">{card.value}</strong>
                                <p className="kpi-summary-card__hint">{card.hint}</p>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="kpi-filters">
                    <div className="kpi-filter-group">
                        <span className="kpi-filter-group__label">Kategoriya</span>
                        <div className="kpi-chip-group" role="tablist">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`kpi-chip ${categoryFilter === category ? 'is-active' : ''}`}
                                    onClick={() => setCategoryFilter(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="kpi-filter-group">
                        <span className="kpi-filter-group__label">Status</span>
                        <div className="kpi-chip-group">
                            {statusFilters.map(filter => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    className={`kpi-chip ${statusFilter === filter.key ? 'is-active' : ''}`}
                                    onClick={() => setStatusFilter(filter.key)}
                                >
                                    {filter.label}
                                    {filter.count !== undefined && <span className="kpi-chip__count">{filter.count}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="kpi-search">
                        <input
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Ko‘rsatkich bo‘yicha qidirish..."
                        />
                    </div>
                </section>

                <section className="kpi-table-card">
                    <header className="kpi-table-card__header">
                        <div>
                            <h2>KPI tafsilotlari</h2>
                            <span className="kpi-table-card__subtitle">Korxonalar kesimida agregatsiyalangan qiymatlar</span>
                        </div>
                        <div className="kpi-status-legend">
                            {(['green', 'yellow', 'red'] as KPIStatus[]).map(status => (
                                <span key={status} className={`kpi-status-pill kpi-status-pill--${status}`}>
                                    {STATUS_LABELS[status]} · {statusCounts[status]}
                                </span>
                            ))}
                        </div>
                    </header>

                    {filteredKpis.length === 0 ? (
                        <div className="kpi-empty">
                            <div className="kpi-empty__icon">🔍</div>
                            <h3>Mos KPI topilmadi</h3>
                            <p>Filtrlarni o‘zgartirib ko‘ring yoki qidiruvni kengaytiring.</p>
                        </div>
                    ) : (
                        <div className="kpi-table-wrapper">
                            <table className="kpi-table">
                                <thead>
                                    <tr>
                                        <th>Ko‘rsatkich</th>
                                        <th>Kategoriya</th>
                                        <th>Og‘irlik</th>
                                        <th>O‘rtacha ball</th>
                                        <th>Maqsad</th>
                                        <th>Eng yaxshi korxona</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKpis.map(item => {
                                        const hasObservations = item.count > 0;
                                        const scoreDisplay = Math.round(item.avgScore);
                                        const valueDisplay = item.meta.direction === 'lower'
                                            ? Math.round(item.avgValue * 10) / 10
                                            : scoreDisplay;
                                        const unit = item.meta.direction === 'lower' ? item.meta.unit : '%';
                                        const statusText = hasObservations ? STATUS_LABELS[item.status] : 'Maʼlumot yo‘q';
                                        return (
                                            <tr key={item.key}>
                                                <td>
                                                    <div className="kpi-metric">
                                                        <span className="kpi-metric__label">{item.meta.label}</span>
                                                        <span className="kpi-metric__formula">{item.meta.formula}</span>
                                                    </div>
                                                </td>
                                                <td>{item.meta.category}</td>
                                                <td>{Math.round(item.meta.weight * 100)}%</td>
                                                <td>
                                                    <div className="kpi-score">
                                                        <span className={`kpi-score__value ${hasObservations ? '' : 'is-empty'}`}>
                                                            {hasObservations ? (
                                                                <>
                                                                    {valueDisplay}
                                                                    {unit}
                                                                </>
                                                            ) : '—'}
                                                        </span>
                                                        <div className="kpi-score__bar">
                                                            <div
                                                                className="kpi-score__fill"
                                                                style={{ width: hasObservations ? `${Math.min(100, Math.max(0, item.avgScore))}%` : '0%' }}
                                                            />
                                                        </div>
                                                        <span className="kpi-score__samples">
                                                            {hasObservations ? `${item.count} o‘lchov` : 'Maʼlumot yo‘q'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="kpi-target">
                                                        <strong>{item.meta.target}{item.meta.unit}</strong>
                                                        <span>{item.meta.direction === 'higher' ? '≥ maqsad' : '≤ limit'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="kpi-benchmark">
                                                        <span className="kpi-benchmark__label">{item.best?.company ?? '—'}</span>
                                                        <span className="kpi-benchmark__score">
                                                            {item.best && hasObservations ? `${Math.round(item.best.score)}%` : '—'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`kpi-status-pill kpi-status-pill--${hasObservations ? item.status : 'yellow'}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {isAddModalOpen && (
                    <div className="kpi-modal" onClick={closeAddModal}>
                        <div className="kpi-modal__content" onClick={event => event.stopPropagation()}>
                            <header className="kpi-modal__header">
                                <div>
                                    <span className="kpi-modal__eyebrow">Korxona ro‘yxati</span>
                                    <h2>Yangi korxona qo‘shish</h2>
                                </div>
                                <button type="button" className="kpi-modal__close" onClick={closeAddModal} disabled={savingCompany}>
                                    ✕
                                </button>
                            </header>

                            <form className="kpi-modal__body" onSubmit={handleSubmitCompany}>
                                <div className="kpi-form-grid">
                                    <label>
                                        <span>Nomi</span>
                                        <input
                                            type="text"
                                            value={companyForm.name}
                                            onChange={handleFormFieldChange('name')}
                                            placeholder="Masalan: Samarqand MTU"
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Hudud / Ota tashkilot</span>
                                        <input
                                            type="text"
                                            value={companyForm.parent}
                                            onChange={handleFormFieldChange('parent')}
                                            placeholder="Masalan: Boshqarma"
                                        />
                                    </label>
                                    <label>
                                        <span>Profil yo‘nalishi</span>
                                        <select
                                            value={companyForm.profileRisk}
                                            onChange={event => {
                                                const value = event.target.value;
                                                setCompanyForm(prev => {
                                                    const nextState: CompanyFormState = {
                                                        ...prev,
                                                        profileRisk: value,
                                                        raw: {
                                                            ...prev.raw,
                                                            profile: value,
                                                        },
                                                    };
                                                    return {
                                                        ...nextState,
                                                        overallPreview: computeFormPreview(nextState),
                                                    };
                                                });
                                            }}
                                        >
                                            {DEPARTMENT_PROFILES.map(profile => (
                                                <option key={profile.id} value={profile.id}>
                                                    {profile.icon} {profile.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        <span>Profil tavsifi</span>
                                        <input
                                            type="text"
                                            value={companyForm.profile}
                                            onChange={handleFormFieldChange('profile')}
                                            placeholder="Regional, Ishlab chiqarish..."
                                        />
                                    </label>
                                    <label>
                                        <span>Xodimlar soni</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={companyForm.employees}
                                            onChange={handleFormFieldChange('employees')}
                                            placeholder="1200"
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>Yillik ish soatlari</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={companyForm.totalHours}
                                            onChange={handleFormFieldChange('totalHours')}
                                            placeholder="160000"
                                        />
                                    </label>
                                    <label>
                                        <span>Zona</span>
                                        <select value={companyForm.zone} onChange={handleFormFieldChange('zone')}>
                                            <option value="green">Yashil</option>
                                            <option value="yellow">Sariq</option>
                                            <option value="red">Qizil</option>
                                        </select>
                                    </label>
                                    <label>
                                        <span>Hisobot oyi</span>
                                        <input
                                            type="text"
                                            value={companyForm.month}
                                            onChange={handleFormFieldChange('month')}
                                            placeholder="Yanvar"
                                        />
                                    </label>
                                    <label>
                                        <span>Hisobot yili</span>
                                        <input
                                            type="number"
                                            value={companyForm.year}
                                            onChange={handleFormFieldChange('year')}
                                            placeholder="2025"
                                        />
                                    </label>
                                </div>

                                <div className="kpi-form-kpis">
                                    <h3>KPI ballari</h3>
                                    <p>Har bir ko‘rsatkich uchun 0-100 oralig‘ida ball kiriting.</p>
                                    <div className="kpi-form-kpis__grid">
                                        {Object.entries(companyForm.kpis).map(([key, score]) => {
                                            const meta = KPI_METADATA.find(item => item.key === key) ?? fallbackMeta(key);
                                            return (
                                                <label key={key}>
                                                    <span>
                                                        {meta.label}
                                                        <em>{Math.round(meta.weight * 100)}%</em>
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={score}
                                                        onChange={handleKpiChange(key)}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="kpi-form-kpis">
                                    <h3>Asosiy xom maʼlumot</h3>
                                    <p>Formula bo‘yicha hisoblanadigan ko‘rsatkichlar uchun sonlarni kiriting.</p>
                                    <div className="kpi-preview">
                                        <div className="kpi-preview__label">Vaznli indeks (avto)</div>
                                        <div className="kpi-preview__value">
                                            {companyForm.overallPreview !== null ? `${companyForm.overallPreview.toFixed(1)}%` : 'Maʼlumot yetarli emas'}
                                        </div>
                                        <div className="kpi-preview__hint">Hisoblash xom maʼlumotlar asosida avtomatik yangilanadi</div>
                                    </div>
                                    <div className="kpi-form-kpis__grid">
                                        <label>
                                            <span>O‘lim hollari</span>
                                            <input type="number" min={0} value={companyForm.raw.fatal ?? 0} onChange={handleNumericRawChange('fatal')} />
                                        </label>
                                        <label>
                                            <span>Og‘ir hodisalar</span>
                                            <input type="number" min={0} value={companyForm.raw.severe ?? 0} onChange={handleNumericRawChange('severe')} />
                                        </label>
                                        <label>
                                            <span>Guruhli hodisalar</span>
                                            <input type="number" min={0} value={companyForm.raw.group ?? 0} onChange={handleNumericRawChange('group')} />
                                        </label>
                                        <label>
                                            <span>Yengil hodisalar</span>
                                            <input type="number" min={0} value={companyForm.raw.light ?? 0} onChange={handleNumericRawChange('light')} />
                                        </label>
                                        <label>
                                            <span>MM shtat (fakt)</span>
                                            <input type="number" min={0} value={companyForm.raw.hseStaffActual ?? 0} onChange={handleNumericRawChange('hseStaffActual')} />
                                        </label>
                                        <label>
                                            <span>MM shtat (normativ)</span>
                                            <input type="number" min={0} value={companyForm.raw.hseStaffRequired ?? 0} onChange={handleNumericRawChange('hseStaffRequired')} />
                                        </label>
                                        <label>
                                            <span>Hodisasiz kunlar</span>
                                            <input type="number" min={0} value={companyForm.raw.noincident ?? 0} onChange={handleNumericRawChange('noincident')} />
                                        </label>
                                        <label>
                                            <span>Trening fakt</span>
                                            <input type="number" min={0} value={companyForm.raw.trainingPassed ?? 0} onChange={handleNumericRawChange('trainingPassed')} />
                                        </label>
                                        <label>
                                            <span>Trening reja</span>
                                            <input type="number" min={0} value={companyForm.raw.trainingRequired ?? 0} onChange={handleNumericRawChange('trainingRequired')} />
                                        </label>
                                        <label>
                                            <span>Ish o‘rni baholangan</span>
                                            <input type="number" min={0} value={companyForm.raw.assessedWorkplaces ?? 0} onChange={handleNumericRawChange('assessedWorkplaces')} />
                                        </label>
                                        <label>
                                            <span>Ish o‘rni reja</span>
                                            <input type="number" min={0} value={companyForm.raw.plannedWorkplaces ?? 0} onChange={handleNumericRawChange('plannedWorkplaces')} />
                                        </label>
                                        <label>
                                            <span>Ichki to‘xtatish</span>
                                            <input type="number" min={0} value={companyForm.raw.stoppageInternal ?? 0} onChange={handleNumericRawChange('stoppageInternal')} />
                                        </label>
                                        <label>
                                            <span>Tashqi to‘xtatish</span>
                                            <input type="number" min={0} value={companyForm.raw.stoppageExternal ?? 0} onChange={handleNumericRawChange('stoppageExternal')} />
                                        </label>
                                        <label>
                                            <span>Sug‘urta to‘lovi (mln)</span>
                                            <input type="number" min={0} value={companyForm.raw.insurancePayment ?? 0} onChange={handleNumericRawChange('insurancePayment')} />
                                        </label>
                                        <label>
                                            <span>Ish haqi fondi (mln)</span>
                                            <input type="number" min={0} value={companyForm.raw.payrollFund ?? 0} onChange={handleNumericRawChange('payrollFund')} />
                                        </label>
                                        <label>
                                            <span>Profilaktika fakt</span>
                                            <input type="number" min={0} value={companyForm.raw.mmBudgetActual ?? 0} onChange={handleNumericRawChange('mmBudgetActual')} />
                                        </label>
                                        <label>
                                            <span>Profilaktika reja</span>
                                            <input type="number" min={0} value={companyForm.raw.mmBudgetPlanned ?? 0} onChange={handleNumericRawChange('mmBudgetPlanned')} />
                                        </label>
                                        <label>
                                            <span>SHHV fakt</span>
                                            <input type="number" min={0} value={companyForm.raw.ppeEquipped ?? 0} onChange={handleNumericRawChange('ppeEquipped')} />
                                        </label>
                                        <label>
                                            <span>SHHV reja</span>
                                            <input type="number" min={0} value={companyForm.raw.ppeRequired ?? 0} onChange={handleNumericRawChange('ppeRequired')} />
                                        </label>
                                        <label>
                                            <span>Tekshirilgan uskunalar</span>
                                            <input type="number" min={0} value={companyForm.raw.equipmentInspected ?? 0} onChange={handleNumericRawChange('equipmentInspected')} />
                                        </label>
                                        <label>
                                            <span>Jami uskunalar</span>
                                            <input type="number" min={0} value={companyForm.raw.equipmentTotal ?? 0} onChange={handleNumericRawChange('equipmentTotal')} />
                                        </label>
                                        <label>
                                            <span>Ruxsatli xodimlar</span>
                                            <input type="number" min={0} value={companyForm.raw.authorizedStaff ?? 0} onChange={handleNumericRawChange('authorizedStaff')} />
                                        </label>
                                        <label>
                                            <span>Jami xodim (uskunalar)</span>
                                            <input type="number" min={0} value={companyForm.raw.totalStaffEquipment ?? 0} onChange={handleNumericRawChange('totalStaffEquipment')} />
                                        </label>
                                        <label>
                                            <span>Tekshiruvlar fakt</span>
                                            <input type="number" min={0} value={companyForm.raw.inspectionDone ?? 0} onChange={handleNumericRawChange('inspectionDone')} />
                                        </label>
                                        <label>
                                            <span>Tekshiruvlar reja</span>
                                            <input type="number" min={0} value={companyForm.raw.inspectionPlanned ?? 0} onChange={handleNumericRawChange('inspectionPlanned')} />
                                        </label>
                                        <label>
                                            <span>Audit nomuvofiqliklari</span>
                                            <input type="number" min={0} value={companyForm.raw.auditIssues ?? 0} onChange={handleNumericRawChange('auditIssues')} />
                                        </label>
                                        <label>
                                            <span>Audit ballari</span>
                                            <input type="number" min={0} value={companyForm.raw.auditTotal ?? 0} onChange={handleNumericRawChange('auditTotal')} />
                                        </label>
                                        <label>
                                            <span>Kasbiy kasalliklar</span>
                                            <input type="number" min={0} value={companyForm.raw.occupational ?? 0} onChange={handleNumericRawChange('occupational')} />
                                        </label>
                                        <label>
                                            <span>Favqulodda ishtirok</span>
                                            <input type="number" min={0} value={companyForm.raw.emergencyParticipated ?? 0} onChange={handleNumericRawChange('emergencyParticipated')} />
                                        </label>
                                        <label>
                                            <span>Favqulodda reja</span>
                                            <input type="number" min={0} value={companyForm.raw.emergencyPlanned ?? 0} onChange={handleNumericRawChange('emergencyPlanned')} />
                                        </label>
                                        <label>
                                            <span>Ichki talon (qizil)</span>
                                            <input type="number" min={0} value={companyForm.raw.internalViolations?.red ?? 0} onChange={handleViolationChange('internalViolations', 'red')} />
                                        </label>
                                        <label>
                                            <span>Ichki talon (sariq)</span>
                                            <input type="number" min={0} value={companyForm.raw.internalViolations?.yellow ?? 0} onChange={handleViolationChange('internalViolations', 'yellow')} />
                                        </label>
                                        <label>
                                            <span>Ichki talon (yashil)</span>
                                            <input type="number" min={0} value={companyForm.raw.internalViolations?.green ?? 0} onChange={handleViolationChange('internalViolations', 'green')} />
                                        </label>
                                        <label>
                                            <span>Tashqi talon (qizil)</span>
                                            <input type="number" min={0} value={companyForm.raw.externalViolations?.red ?? 0} onChange={handleViolationChange('externalViolations', 'red')} />
                                        </label>
                                        <label>
                                            <span>Tashqi talon (sariq)</span>
                                            <input type="number" min={0} value={companyForm.raw.externalViolations?.yellow ?? 0} onChange={handleViolationChange('externalViolations', 'yellow')} />
                                        </label>
                                        <label>
                                            <span>Tashqi talon (yashil)</span>
                                            <input type="number" min={0} value={companyForm.raw.externalViolations?.green ?? 0} onChange={handleViolationChange('externalViolations', 'green')} />
                                        </label>
                                    </div>
                                </div>

                                {formError && <div className="kpi-form-error">{formError}</div>}

                                <footer className="kpi-modal__footer">
                                    <button type="button" className="secondary" onClick={closeAddModal} disabled={savingCompany}>
                                        Bekor qilish
                                    </button>
                                    <button type="submit" className="primary" disabled={savingCompany}>
                                        {savingCompany ? 'Saqlanmoqda…' : 'Saqlash'}
                                    </button>
                                </footer>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppWindow>
    );
};

export default KpiApp;
