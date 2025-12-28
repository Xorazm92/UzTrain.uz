import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './BannerlarApp.scss';

const banners = [
    { id: 1, title: "Yangi yil bayramingiz muborak!", status: "Faol", startDate: "2024-12-25", endDate: "2025-01-05", views: 12500 },
    { id: 2, title: "Xavfsizlik oylik o'qitish dasturi", status: "Faol", startDate: "2024-01-01", endDate: "2024-01-31", views: 8900 },
    { id: 3, title: "Yangi qoidalar e'lon qilindi", status: "Kutilmoqda", startDate: "2024-02-01", endDate: "2024-02-28", views: 0 },
    { id: 4, title: "Texnik xizmat ko'rsatish jadvali", status: "Yakunlangan", startDate: "2023-11-01", endDate: "2023-11-30", views: 15200 },
];

const BannerlarApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.bannerlarWindow?.closed) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Faol': return { bg: 'rgba(52, 199, 89, 0.2)', color: '#34C759' };
            case 'Kutilmoqda': return { bg: 'rgba(255, 149, 0, 0.2)', color: '#FF9500' };
            default: return { bg: 'rgba(142, 142, 147, 0.2)', color: '#8E8E93' };
        }
    };

    return (
        <AppWindow appId="bannerlar" title="Bannerlar" defaultWidth={900} defaultHeight={550} defaultX={100} defaultY={50}>
            <div className="bannerlar-app">
                <div className="header">
                    <h1>📢 Bannerlar va E'lonlar</h1>
                    <button className="add-btn">+ Yangi banner</button>
                </div>
                <div className="banners-list">
                    {banners.map((banner) => (
                        <div key={banner.id} className="banner-card">
                            <div className="banner-preview">📣</div>
                            <div className="banner-info">
                                <h3>{banner.title}</h3>
                                <div className="banner-meta">
                                    <span className="dates">{banner.startDate} → {banner.endDate}</span>
                                    <span className="views">👁 {banner.views.toLocaleString()}</span>
                                </div>
                            </div>
                            <span className="status" style={{ background: getStatusStyle(banner.status).bg, color: getStatusStyle(banner.status).color }}>
                                {banner.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </AppWindow>
    );
};

export default BannerlarApp;
