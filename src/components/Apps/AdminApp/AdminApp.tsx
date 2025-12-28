import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './AdminApp.scss';

const AdminApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.adminWindow?.closed) return null;

    return (
        <AppWindow appId="admin" title="Administrator" defaultWidth={1000} defaultHeight={650} defaultX={70} defaultY={35}>
            <div className="admin-app">
                <div className="admin-sidebar">
                    <div className="sidebar-header">
                        <span className="admin-avatar">👤</span>
                        <div className="admin-info">
                            <span className="name">Administrator</span>
                            <span className="role">Super Admin</span>
                        </div>
                    </div>
                    <nav className="sidebar-nav">
                        <button className="nav-item active">📊 Dashboard</button>
                        <button className="nav-item">👥 Foydalanuvchilar</button>
                        <button className="nav-item">🏢 Korxonalar</button>
                        <button className="nav-item">📄 Hujjatlar</button>
                        <button className="nav-item">📈 Hisobotlar</button>
                        <button className="nav-item">⚙️ Sozlamalar</button>
                    </nav>
                </div>

                <div className="admin-main">
                    <h1>Admin Dashboard</h1>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="icon">👥</span>
                            <div className="info">
                                <span className="value">1,250</span>
                                <span className="label">Foydalanuvchilar</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="icon">🏢</span>
                            <div className="info">
                                <span className="value">48</span>
                                <span className="label">Korxonalar</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="icon">📄</span>
                            <div className="info">
                                <span className="value">324</span>
                                <span className="label">Hujjatlar</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="icon">📊</span>
                            <div className="info">
                                <span className="value">89%</span>
                                <span className="label">Faollik</span>
                            </div>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <h2>So'nggi faoliyat</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <span className="time">10:30</span>
                                <span className="desc">Yangi foydalanuvchi qo'shildi</span>
                            </div>
                            <div className="activity-item">
                                <span className="time">09:45</span>
                                <span className="desc">KPI ma'lumotlari yangilandi</span>
                            </div>
                            <div className="activity-item">
                                <span className="time">09:00</span>
                                <span className="desc">Tizim zaxira nusxasi yaratildi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppWindow>
    );
};

export default AdminApp;
