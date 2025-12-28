import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './ProfilApp.scss';

const ProfilApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.profilWindow?.closed) return null;

    return (
        <AppWindow appId="profil" title="Profil" defaultWidth={700} defaultHeight={550} defaultX={150} defaultY={80}>
            <div className="profil-app">
                <div className="profile-header">
                    <div className="avatar">👤</div>
                    <div className="user-info">
                        <h1>Abdullayev Sardor</h1>
                        <p>Xavfsizlik bo'limi boshlig'i</p>
                        <span className="badge">Faol</span>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="section">
                        <h3>Shaxsiy ma'lumotlar</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Email</span>
                                <span className="value">s.abdullayev@uzrailway.uz</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Telefon</span>
                                <span className="value">+998 90 123 45 67</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Tashkilot</span>
                                <span className="value">O'zbekiston Temir Yo'llari</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Bo'lim</span>
                                <span className="value">Mehnat xavfsizligi</span>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h3>Statistika</h3>
                        <div className="stats-row">
                            <div className="stat">
                                <span className="value">156</span>
                                <span className="label">Ko'rilgan hujjatlar</span>
                            </div>
                            <div className="stat">
                                <span className="value">42</span>
                                <span className="label">Tayyor topshiriqlar</span>
                            </div>
                            <div className="stat">
                                <span className="value">98%</span>
                                <span className="label">Samaradorlik</span>
                            </div>
                        </div>
                    </div>

                    <div className="section actions">
                        <button className="action-btn">✏️ Profilni tahrirlash</button>
                        <button className="action-btn">🔒 Parolni o'zgartirish</button>
                        <button className="action-btn danger">🚪 Chiqish</button>
                    </div>
                </div>
            </div>
        </AppWindow>
    );
};

export default ProfilApp;
