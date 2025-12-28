import React, { useContext, useEffect, useState } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './DashboardApp.scss';
import { supabase, Company } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_COMPANIES: Company[] = [
    { id: '1', name: 'Toshkent MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1250, total_hours: 156000, overall_index: 85, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 90 }, 'Texnika Xavfsizligi': { value: 0, score: 80 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '2', name: 'Qo\'qon MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 980, total_hours: 120000, overall_index: 72, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 70 }, 'Texnika Xavfsizligi': { value: 0, score: 75 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '3', name: 'Buxoro MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 1100, total_hours: 140000, overall_index: 65, zone: 'yellow', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 60 }, 'Texnika Xavfsizligi': { value: 0, score: 70 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '4', name: 'Qarshi MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 850, total_hours: 100000, overall_index: 45, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 40 }, 'Texnika Xavfsizligi': { value: 0, score: 50 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '5', name: 'Termiz MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 600, total_hours: 80000, overall_index: 92, zone: 'green', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 95 }, 'Texnika Xavfsizligi': { value: 0, score: 90 } }, updated_at: '', date_added: '', raw_data: {} },
    { id: '6', name: 'Urganch MTU', parent: 'Boshqarma', level: 'management', profile: 'Regional', employees: 750, total_hours: 95000, overall_index: 55, zone: 'red', kpis: { 'Mehnat Muhofazasi': { value: 0, score: 50 }, 'Texnika Xavfsizligi': { value: 0, score: 60 } }, updated_at: '', date_added: '', raw_data: {} },
];

const DashboardApp: React.FC = () => {
    const [state] = useContext(store);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state.dashboardWindow?.closed) {
            loadCompanies();
        }
    }, [state.dashboardWindow?.closed]);

    if (state.dashboardWindow?.closed) return null;

    const loadCompanies = async () => {
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
            setCompanies(MOCK_COMPANIES);
        } finally {
            setLoading(false);
        }
    };


    // Calculate Stats
    const totalCompanies = companies.length;
    const totalEmployees = companies.reduce((acc, curr) => acc + (curr.employees || 0), 0);
    const avgScore = totalCompanies > 0
        ? Math.round(companies.reduce((acc, curr) => acc + (curr.overall_index || 0), 0) / totalCompanies)
        : 0;

    const greenZone = companies.filter(c => c.zone === 'green').length;
    const yellowZone = companies.filter(c => c.zone === 'yellow').length;
    const redZone = companies.filter(c => c.zone === 'red').length;

    const topCompanies = [...companies]
        .sort((a, b) => (b.overall_index || 0) - (a.overall_index || 0))
        .slice(0, 5);

    const getStatusColor = (zone: string) => {
        switch (zone) {
            case 'green': return '#34C759';
            case 'yellow': return '#FF9500';
            case 'red': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    return (
        <AppWindow
            appId="dashboard"
            title="Dashboard - KPI Boshqaruv"
            defaultWidth={1100}
            defaultHeight={700}
            defaultX={60}
            defaultY={30}
        >
            <div className="dashboard-app">
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1>KPI Dashboard</h1>
                        <span className="subtitle">Xavfsizlik ko'rsatkichlari real vaqtda</span>
                    </div>
                    <div className="header-right">
                        <select className="period-select">
                            <option>Bu oy</option>
                            <option>O'tgan oy</option>
                            <option>Bu yil</option>
                        </select>
                        <button className="refresh-btn" onClick={loadCompanies}>
                            <span>🔄</span> Yangilash
                        </button>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">Jami Korxonalar</span>
                            <span className="kpi-trend" style={{ color: '#34C759' }}>🏢</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : totalCompanies}
                            <span className="kpi-unit">ta</span>
                        </div>
                        <div className="kpi-target">
                            Faol monitoringda
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">O'rtacha Ball</span>
                            <span className="kpi-trend" style={{ color: '#007AFF' }}>📊</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : avgScore}
                            <span className="kpi-unit">%</span>
                        </div>
                        <div className="kpi-progress">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${avgScore}%`,
                                    background: getStatusColor(avgScore >= 80 ? 'green' : avgScore >= 60 ? 'yellow' : 'red')
                                }}
                            />
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">Yashil Zona</span>
                            <span className="kpi-trend" style={{ color: '#34C759' }}>✅</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : greenZone}
                            <span className="kpi-unit">ta</span>
                        </div>
                        <div className="kpi-target">
                            Yaxshi ko'rsatkich
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">Sariq Zona</span>
                            <span className="kpi-trend" style={{ color: '#FF9500' }}>⚠️</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : yellowZone}
                            <span className="kpi-unit">ta</span>
                        </div>
                        <div className="kpi-target">
                            E'tibor talab
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">Qizil Zona</span>
                            <span className="kpi-trend" style={{ color: '#FF3B30' }}>🚫</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : redZone}
                            <span className="kpi-unit">ta</span>
                        </div>
                        <div className="kpi-target">
                            Xavfli holat
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-name">Jami Xodimlar</span>
                            <span className="kpi-trend" style={{ color: '#5856D6' }}>👥</span>
                        </div>
                        <div className="kpi-value">
                            {loading ? '...' : totalEmployees.toLocaleString()}
                            <span className="kpi-unit">nafar</span>
                        </div>
                        <div className="kpi-target">
                            Xavfsizligi ta'minlangan
                        </div>
                    </div>
                </div>

                <div className="dashboard-bottom">
                    <div className="chart-section">
                        <h3>Hududlar bo'yicha tahlil</h3>
                        {/* Placeholder for chart - requires chart lib */}
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={[
                                        { name: 'Yashil', value: greenZone, color: '#34C759' },
                                        { name: 'Sariq', value: yellowZone, color: '#FF9500' },
                                        { name: 'Qizil', value: redZone, color: '#FF3B30' }
                                    ]}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#8E8E93" tick={{ fill: '#8E8E93' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(28, 28, 30, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {
                                            [
                                                { name: 'Yashil', value: greenZone, color: '#34C759' },
                                                { name: 'Sariq', value: yellowZone, color: '#FF9500' },
                                                { name: 'Qizil', value: redZone, color: '#FF3B30' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="ranking-section">
                        <h3>TOP 5 Korxonalar</h3>
                        <div className="ranking-list">
                            {topCompanies.map((company, index) => (
                                <div key={company.id} className="ranking-item">
                                    <span className="rank">#{index + 1}</span>
                                    <span className="name">{company.name}</span>
                                    <div className="score-bar">
                                        <div
                                            className="score-fill"
                                            style={{ width: `${company.overall_index}%`, background: getStatusColor(company.zone) }}
                                        />
                                    </div>
                                    <span className="score">{company.overall_index}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppWindow>
    );
};

export default DashboardApp;
