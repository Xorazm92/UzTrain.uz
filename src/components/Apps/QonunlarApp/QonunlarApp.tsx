import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './QonunlarApp.scss';

// Sample laws data
const laws = [
    {
        id: 1,
        title: "O'zbekiston Respublikasining Mehnat kodeksi",
        date: "2023-04-21",
        category: "Mehnat qonunchiligi",
        description: "Mehnat munosabatlarini tartibga soluvchi asosiy qonun",
    },
    {
        id: 2,
        title: "Mehnat muhofazasi to'g'risida Qonun",
        date: "2023-01-15",
        category: "Mehnat xavfsizligi",
        description: "Ishlab chiqarishda xavfsizlik va gigiyena talablari",
    },
    {
        id: 3,
        title: "Temir yo'l transporti to'g'risida Qonun",
        date: "2022-09-01",
        category: "Transport qonunchiligi",
        description: "Temir yo'l transporti faoliyatini tartibga solish",
    },
    {
        id: 4,
        title: "Texnik jihatdan tartibga solish to'g'risida Qonun",
        date: "2022-06-20",
        category: "Texnik standartlar",
        description: "Mahsulot va xizmatlar xavfsizligini ta'minlash",
    },
    {
        id: 5,
        title: "Ekologik ekspertiza to'g'risida Qonun",
        date: "2021-12-10",
        category: "Atrof-muhit",
        description: "Atrof-muhitni muhofaza qilish va ekologik talablar",
    },
];

const QonunlarApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.qonunlarWindow?.closed) return null;

    return (
        <AppWindow
            appId="qonunlar"
            title="Qonunlar"
            defaultWidth={950}
            defaultHeight={650}
            defaultX={80}
            defaultY={40}
        >
            <div className="qonunlar-app">
                <div className="app-sidebar">
                    <div className="sidebar-header">
                        <h3>Kategoriyalar</h3>
                    </div>
                    <nav className="sidebar-nav">
                        <a href="#" className="nav-item active">
                            <span className="icon">📋</span>
                            Barcha qonunlar
                        </a>
                        <a href="#" className="nav-item">
                            <span className="icon">⚖️</span>
                            Mehnat qonunchiligi
                        </a>
                        <a href="#" className="nav-item">
                            <span className="icon">🛡️</span>
                            Mehnat xavfsizligi
                        </a>
                        <a href="#" className="nav-item">
                            <span className="icon">🚂</span>
                            Transport
                        </a>
                        <a href="#" className="nav-item">
                            <span className="icon">🔧</span>
                            Texnik standartlar
                        </a>
                        <a href="#" className="nav-item">
                            <span className="icon">🌿</span>
                            Atrof-muhit
                        </a>
                    </nav>
                </div>

                <div className="app-main">
                    <div className="app-toolbar">
                        <div className="search-box">
                            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input type="text" placeholder="Qonunlarni qidirish..." />
                        </div>
                        <div className="toolbar-actions">
                            <button className="action-btn">
                                <span>Saralash</span>
                            </button>
                            <button className="action-btn primary">
                                <span>Yangi qo'shish</span>
                            </button>
                        </div>
                    </div>

                    <div className="laws-list">
                        {laws.map((law) => (
                            <div key={law.id} className="law-card">
                                <div className="law-icon">📜</div>
                                <div className="law-content">
                                    <h4 className="law-title">{law.title}</h4>
                                    <p className="law-description">{law.description}</p>
                                    <div className="law-meta">
                                        <span className="category">{law.category}</span>
                                        <span className="date">{law.date}</span>
                                    </div>
                                </div>
                                <button className="view-btn">Ko'rish</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppWindow>
    );
};

export default QonunlarApp;
