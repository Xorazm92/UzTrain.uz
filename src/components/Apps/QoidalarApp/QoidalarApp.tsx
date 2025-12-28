import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './QoidalarApp.scss';

const rules = [
    { id: 1, title: "Xodimlar xavfsizligi bo'yicha umumiy qoidalar", category: "Umumiy", priority: "Yuqori", status: "Faol" },
    { id: 2, title: "Temir yo'l transport vositalarida xavfsizlik qoidalari", category: "Transport", priority: "Yuqori", status: "Faol" },
    { id: 3, title: "Yong'in xavfsizligi qoidalari", category: "Favqulodda", priority: "Yuqori", status: "Faol" },
    { id: 4, title: "Elektr uskunalar bilan ishlash qoidalari", category: "Texnik", priority: "O'rta", status: "Faol" },
    { id: 5, title: "Shaxsiy himoya vositalaridan foydalanish qoidalari", category: "Umumiy", priority: "Yuqori", status: "Faol" },
    { id: 6, title: "Kimyoviy moddalar bilan ishlash qoidalari", category: "Maxsus", priority: "Yuqori", status: "Faol" },
    { id: 7, title: "Balandlikda ishlash qoidalari", category: "Maxsus", priority: "O'rta", status: "Faol" },
    { id: 8, title: "Tibbiy yordam ko'rsatish qoidalari", category: "Favqulodda", priority: "O'rta", status: "Faol" },
];

const QoidalarApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.qoidalarWindow?.closed) return null;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Yuqori': return '#FF3B30';
            case "O'rta": return '#FF9500';
            default: return '#34C759';
        }
    };

    return (
        <AppWindow
            appId="qoidalar"
            title="Qoidalar"
            defaultWidth={900}
            defaultHeight={600}
            defaultX={110}
            defaultY={55}
        >
            <div className="qoidalar-app">
                <div className="app-sidebar">
                    <h3>Toifalar</h3>
                    <nav className="sidebar-nav">
                        <button className="nav-item active">📋 Barcha qoidalar</button>
                        <button className="nav-item">📌 Umumiy</button>
                        <button className="nav-item">🚂 Transport</button>
                        <button className="nav-item">⚙️ Texnik</button>
                        <button className="nav-item">🔥 Favqulodda</button>
                        <button className="nav-item">⚠️ Maxsus</button>
                    </nav>
                </div>

                <div className="app-main">
                    <div className="main-header">
                        <h2>Qoidalar ro'yxati</h2>
                        <div className="header-actions">
                            <input type="text" placeholder="Qidirish..." className="search-input" />
                            <button className="add-btn">+ Yangi qoida</button>
                        </div>
                    </div>

                    <div className="rules-list">
                        {rules.map((rule) => (
                            <div key={rule.id} className="rule-item">
                                <div className="rule-icon">📄</div>
                                <div className="rule-content">
                                    <h4>{rule.title}</h4>
                                    <div className="rule-meta">
                                        <span className="category">{rule.category}</span>
                                        <span
                                            className="priority"
                                            style={{ background: `${getPriorityColor(rule.priority)}20`, color: getPriorityColor(rule.priority) }}
                                        >
                                            {rule.priority}
                                        </span>
                                        <span className="status">{rule.status}</span>
                                    </div>
                                </div>
                                <div className="rule-actions">
                                    <button>Ko'rish</button>
                                    <button>Tahrirlash</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppWindow>
    );
};

export default QoidalarApp;
