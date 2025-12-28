import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './KorxonalarApp.scss';
import { supabase, Company } from '@/lib/supabase';

// Helper to map Supabase zone to status
const mapZoneToStatus = (zone: string) => {
    switch (zone) {
        case 'green': return 'active';
        case 'yellow': return 'warning';
        case 'red': return 'danger';
        default: return 'active';
    }
}

// MOCK DATA FOR FALLBACK
const MOCK_COMPANIES: Company[] = [
    { id: '1', name: 'Toshkent MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1250, total_hours: 156000, overall_index: 85, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 90 }, 'Texnika Xavfsizligi': { value: 0, score: 80 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '2', name: 'Qo\'qon MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 980, total_hours: 120000, overall_index: 72, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 70 }, 'Texnika Xavfsizligi': { value: 0, score: 75 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '3', name: 'Buxoro MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1100, total_hours: 140000, overall_index: 65, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 60 }, 'Texnika Xavfsizligi': { value: 0, score: 70 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '4', name: 'Qarshi MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 850, total_hours: 100000, overall_index: 45, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 40 }, 'Texnika Xavfsizligi': { value: 0, score: 50 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '5', name: 'Termiz MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 600, total_hours: 80000, overall_index: 92, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 95 }, 'Texnika Xavfsizligi': { value: 0, score: 90 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '6', name: 'Urganch MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 750, total_hours: 95000, overall_index: 55, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 50 }, 'Texnika Xavfsizligi': { value: 0, score: 60 } }, updated_at: '', date_added: '', raw_data: {} },
];

const KorxonalarApp: React.FC = () => {
    const [state] = useContext(store);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const blankForm = useMemo(() => ({
        name: '',
        parent: '',
        profile: '',
        employees: '',
        totalHours: '',
        overallIndex: '',
        zone: 'green',
    }), []);

    const [newCompanyForm, setNewCompanyForm] = useState(blankForm);

    const loadCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('overall_index', { ascending: false });

            if (error || !data || data.length === 0) {
                console.warn('Using mock data due to Supabase error/empty:', error);
                setCompanies(MOCK_COMPANIES);
            } else {
                setCompanies(data);
            }
        } catch (error) {
            console.error('Error loading companies:', error);
            setCompanies(MOCK_COMPANIES); // Fallback on catch
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!state.korxonalarWindow?.closed) {
            void loadCompanies();
        }
    }, [state.korxonalarWindow?.closed, loadCompanies]);

    if (state.korxonalarWindow?.closed) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#34C759';
            case 'warning': return '#FF9500';
            case 'danger': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Faol';
            case 'warning': return 'Ogohlantirish';
            case 'danger': return 'Xavfli';
            default: return 'Noma\'lum';
        }
    }

    // Filter logic
    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setNewCompanyForm(blankForm);
        setFormError(null);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        if (savingCompany) return;
        setIsAddModalOpen(false);
    };

    const handleFormChange = (field: keyof typeof newCompanyForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setNewCompanyForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddCompany = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        const employees = Number(newCompanyForm.employees);
        const totalHours = newCompanyForm.totalHours ? Number(newCompanyForm.totalHours) : Math.max(0, Math.round(employees * 160));
        const overallIndex = Number(newCompanyForm.overallIndex);

        if (!newCompanyForm.name.trim()) {
            setFormError('Korxona nomini kiriting.');
            return;
        }

        if (Number.isNaN(employees) || employees <= 0) {
            setFormError('Xodimlar sonini to\'g\'ri kiriting.');
            return;
        }

        if (Number.isNaN(overallIndex) || overallIndex < 0 || overallIndex > 100) {
            setFormError('Umumiy indeks 0-100 oralig\'ida bo\'lishi kerak.');
            return;
        }

        const payload = {
            id: crypto.randomUUID(),
            name: newCompanyForm.name.trim(),
            level: 'management' as Company['level'],
            parent: newCompanyForm.parent.trim() || null,
            profile: newCompanyForm.profile.trim() || 'Regional',
            employees,
            total_hours: totalHours,
            kpis: {},
            overall_index: overallIndex,
            zone: newCompanyForm.zone as Company['zone'],
            date_added: new Date().toISOString(),
            raw_data: {},
            updated_at: new Date().toISOString(),
        } satisfies Company;

        setSavingCompany(true);

        try {
            const { data, error } = await supabase
                .from('companies')
                .insert(payload)
                .select('*');

            if (error) {
                console.error('Supabase insert error (local fallback used):', error);
            }

            const record = (data && data[0]) ? data[0] as Company : payload;

            setCompanies(prev => [record, ...prev]);
            setIsAddModalOpen(false);
            setSelectedCompany(record);
        } catch (err) {
            console.error('Company creation failed:', err);
            setFormError('Serverga ulanishda xatolik. Keyinroq urinib ko\'ring.');
        } finally {
            setSavingCompany(false);
        }
    };

    return (
        <AppWindow
            appId="korxonalar"
            title="Korxonalar"
            defaultWidth={1000}
            defaultHeight={650}
            defaultX={120}
            defaultY={60}
        >
            <div className="korxonalar-app">
                <div className="app-header">
                    <div className="header-left">
                        <h1>Korxonalar</h1>
                        <span className="count">{filteredCompanies.length} ta korxona</span>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="search-icon">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Korxonalarni qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-btn" onClick={handleOpenAddModal}>
                            + Yangi qo'shish
                        </button>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-icon">🏢</span>
                        <div className="stat-info">
                            <span className="stat-value">{companies.length}</span>
                            <span className="stat-label">Jami korxonalar</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <div className="stat-info">
                            <span className="stat-value">{companies.reduce((a, c) => a + (c.employees || 0), 0).toLocaleString()}</span>
                            <span className="stat-label">Jami xodimlar</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📊</span>
                        <div className="stat-info">
                            <span className="stat-value">
                                {companies.length > 0
                                    ? Math.round(companies.reduce((a, c) => a + (c.overall_index || 0), 0) / companies.length)
                                    : 0}%
                            </span>
                            <span className="stat-label">O'rtacha ball</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-info">
                            <span className="stat-value">{companies.filter(c => c.zone === 'green').length}</span>
                            <span className="stat-label">Yashil zona</span>
                        </div>
                    </div>
                </div>

                <div className="companies-table">
                    <div className="table-header">
                        <span className="col-name">Nomi</span>
                        <span className="col-region">Xodimlar</span>
                        <span className="col-score">Ball (Index)</span>
                        <span className="col-status">Holat</span>
                        <span className="col-actions">Amallar</span>
                    </div>
                    <div className="table-body">
                        {loading ? (
                            <div className="loading-state">
                                <span>Yuklanmoqda...</span>
                            </div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="empty-state">
                                <span>Hech narsa topilmadi</span>
                            </div>
                        ) : (
                            filteredCompanies.map((company) => {
                                const status = mapZoneToStatus(company.zone);
                                return (
                                    <div key={company.id} className="table-row">
                                        <span className="col-name">
                                            <span className="company-icon">🏢</span>
                                            {company.name}
                                        </span>
                                        <span className="col-region">{company.employees?.toLocaleString() || 0}</span>
                                        <span className="col-score">
                                            <div className="score-bar">
                                                <div
                                                    className="score-fill"
                                                    style={{
                                                        width: `${company.overall_index}%`,
                                                        background: getStatusColor(status)
                                                    }}
                                                />
                                            </div>
                                            <span>{company.overall_index}%</span>
                                        </span>
                                        <span className="col-status">
                                            <span
                                                className="status-badge"
                                                style={{ background: `${getStatusColor(status)}20`, color: getStatusColor(status) }}
                                            >
                                                {getStatusText(status)}
                                            </span>
                                        </span>
                                        <span className="col-actions">
                                            <button className="action-btn" onClick={() => setSelectedCompany(company)}>Ko'rish</button>
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {isAddModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseAddModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Yangi korxona qo'shish</h2>
                                <button className="close-btn" onClick={handleCloseAddModal} disabled={savingCompany}>✕</button>
                            </div>
                            <form className="modal-body company-form" onSubmit={handleAddCompany}>
                                <div className="form-grid">
                                    <label>
                                        <span>Nomi</span>
                                        <input
                                            type="text"
                                            value={newCompanyForm.name}
                                            onChange={handleFormChange('name')}
                                            placeholder="Korxona nomi"
                                        />
                                    </label>
                                    <label>
                                        <span>Hudud / Ota tashkilot</span>
                                        <input
                                            type="text"
                                            value={newCompanyForm.parent}
                                            onChange={handleFormChange('parent')}
                                            placeholder="Masalan: Toshkent MTU"
                                        />
                                    </label>
                                    <label>
                                        <span>Profil</span>
                                        <input
                                            type="text"
                                            value={newCompanyForm.profile}
                                            onChange={handleFormChange('profile')}
                                            placeholder="Masalan: Regional"
                                        />
                                    </label>
                                    <label>
                                        <span>Xodimlar soni</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={newCompanyForm.employees}
                                            onChange={handleFormChange('employees')}
                                            placeholder="Masalan: 1200"
                                        />
                                    </label>
                                    <label>
                                        <span>Yillik ish soatlari</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={newCompanyForm.totalHours}
                                            onChange={handleFormChange('totalHours')}
                                            placeholder="Masalan: 160000"
                                        />
                                    </label>
                                    <label>
                                        <span>Umumiy indeks (%)</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={newCompanyForm.overallIndex}
                                            onChange={handleFormChange('overallIndex')}
                                            placeholder="Masalan: 82"
                                        />
                                    </label>
                                    <label>
                                        <span>Zonasi</span>
                                        <select value={newCompanyForm.zone} onChange={handleFormChange('zone')}>
                                            <option value="green">Yashil</option>
                                            <option value="yellow">Sariq</option>
                                            <option value="red">Qizil</option>
                                        </select>
                                    </label>
                                </div>

                                {formError && <p className="form-error">{formError}</p>}

                                <div className="modal-footer">
                                    <button type="button" className="secondary" onClick={handleCloseAddModal} disabled={savingCompany}>
                                        Bekor qilish
                                    </button>
                                    <button type="submit" className="primary" disabled={savingCompany}>
                                        {savingCompany ? 'Saqlanmoqda…' : 'Saqlash'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Company Details Modal */}
                {selectedCompany && (
                    <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{selectedCompany.name}</h2>
                                <button className="close-btn" onClick={() => setSelectedCompany(null)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="detail-row">
                                    <span className="label">ID:</span>
                                    <span className="value">{selectedCompany.id}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Hudud:</span>
                                    <span className="value">{selectedCompany.parent || 'Boshqarma'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Xodimlar soni:</span>
                                    <span className="value">{selectedCompany.employees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Umumiy Ball:</span>
                                    <span className="value highlight" style={{ color: getStatusColor(mapZoneToStatus(selectedCompany.zone)) }}>
                                        {selectedCompany.overall_index}%
                                    </span>
                                </div>
                                <div className="kpi-breakdown">
                                    <h3>KPI Ko'rsatkichlari</h3>
                                    {Object.entries(selectedCompany.kpis || {}).map(([key, value]: [string, any]) => (
                                        <div key={key} className="kpi-item">
                                            <span className="kpi-label">{key}</span>
                                            <div className="kpi-score-bar">
                                                <div className="fill" style={{ width: `${value.score}%`, background: value.score >= 80 ? '#34C759' : value.score >= 60 ? '#FF9500' : '#FF3B30' }}></div>
                                            </div>
                                            <span className="kpi-value">{value.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppWindow>
    );
};

export default KorxonalarApp;
