import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './KpiApp.scss';

const kpiIndicators = [
    { id: 1, name: "Baxtsiz hodisalar (LTI)", value: 0, target: 0, formula: "Jami baxtsiz hodisalar soni", status: "yashil" },
    { id: 2, name: "O'lim bilan tugagan hodisalar", value: 0, target: 0, formula: "O'lim holatlari soni", status: "yashil" },
    { id: 3, name: "Xavfsizlik ko'rsatkichi (LTIFR)", value: 0.5, target: 1.0, formula: "(LTI × 1,000,000) / ish soatlari", status: "yashil" },
    { id: 4, name: "O'qitish qamrovi", value: 89, target: 100, formula: "(O'qitilganlar / Jami) × 100%", status: "sariq" },
    { id: 5, name: "Tibbiy ko'rik", value: 95, target: 100, formula: "(Ko'rikdan o'tganlar / Jami) × 100%", status: "yashil" },
    { id: 6, name: "Profilaktika", value: 78, target: 85, formula: "Rejali/Bajarilgan profilaktika %", status: "sariq" },
];

const KpiApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.kpiWindow?.closed) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'yashil': return '#34C759';
            case 'sariq': return '#FF9500';
            case 'qizil': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    return (
        <AppWindow appId="kpi" title="KPI Ko'rsatkichlari" defaultWidth={1000} defaultHeight={650} defaultX={90} defaultY={45}>
            <div className="kpi-app">
                <div className="header">
                    <h1>📊 KPI Ko'rsatkichlari</h1>
                    <p>Xavfsizlik samaradorligi ko'rsatkichlari</p>
                </div>

                <div className="kpi-table">
                    <div className="table-header">
                        <span>Ko'rsatkich nomi</span>
                        <span>Joriy qiymat</span>
                        <span>Maqsad</span>
                        <span>Formula</span>
                        <span>Holat</span>
                    </div>
                    <div className="table-body">
                        {kpiIndicators.map((kpi) => (
                            <div key={kpi.id} className="table-row">
                                <span className="name">{kpi.name}</span>
                                <span className="value">{kpi.value}{typeof kpi.value === 'number' && kpi.value > 1 ? '%' : ''}</span>
                                <span className="target">{kpi.target}{typeof kpi.target === 'number' && kpi.target > 1 ? '%' : ''}</span>
                                <span className="formula">{kpi.formula}</span>
                                <span className="status">
                                    <span className="badge" style={{ background: `${getStatusColor(kpi.status)}20`, color: getStatusColor(kpi.status) }}>
                                        {kpi.status === 'yashil' ? '✓ Yaxshi' : kpi.status === 'sariq' ? '! Ogohlantirish' : '✕ Xavfli'}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-box">
                    <h3>📌 KPI hisoblash qoidalari</h3>
                    <ul>
                        <li>LTIFR = (LTI × 1,000,000) / Jami ish soatlari</li>
                        <li>Yashil zona: maqsadga erishilgan yoki undan yaxshi</li>
                        <li>Sariq zona: maqsaddan 10% oraliqda</li>
                        <li>Qizil zona: maqsaddan 10% dan ko'p farq</li>
                    </ul>
                </div>
            </div>
        </AppWindow>
    );
};

export default KpiApp;
