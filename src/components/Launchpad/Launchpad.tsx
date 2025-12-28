import React, { useContext, useState } from 'react';
import { store } from '../../App';
import './Launchpad.scss';

interface AppItem {
    id: string;
    name: string;
    icon: string;
    category: 'mehnat' | 'safety' | 'system';
}

const apps: AppItem[] = [
    // Mehnat Platform Apps
    { id: 'qonunlar', name: 'Qonunlar', icon: '/apps/qonunlar.png', category: 'mehnat' },
    { id: 'qoidalar', name: 'Qoidalar', icon: '/apps/qoidalar.png', category: 'mehnat' },
    { id: 'video', name: 'Video Materiallar', icon: '/apps/video.png', category: 'mehnat' },
    { id: 'slaydlar', name: 'Slaydlar', icon: '/apps/slide.png', category: 'mehnat' },
    { id: 'temiryol', name: "Temir Yo'l", icon: '/apps/temiryol.png', category: 'mehnat' },
    { id: 'bannerlar', name: 'Bannerlar', icon: '/apps/banner.png', category: 'mehnat' },
    { id: 'kasb', name: "Kasb Yo'riqnomalari", icon: '/apps/kasb.png', category: 'mehnat' },

    // Safety Scoreboard Apps
    { id: 'dashboard', name: 'Dashboard', icon: '/apps/dashboard.png', category: 'safety' },
    { id: 'globaldash', name: 'Global Dashboard', icon: '/apps/global_dashboard.png', category: 'safety' },
    { id: 'korxonalar', name: 'Korxonalar', icon: '/apps/korxonalar.png', category: 'safety' },
    { id: 'kpi', name: "KPI Ko'rsatkichlari", icon: '/apps/KPI.jpg', category: 'safety' },
    { id: 'admin', name: 'Admin', icon: '/apps/admin.png', category: 'safety' },
    { id: 'profil', name: 'Profil', icon: '/apps/profile.png', category: 'safety' },
];

const Launchpad: React.FC = () => {
    const [state, dispatch] = useContext(store);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'mehnat' | 'safety'>('all');

    if (!state.launchpadOpen) return null;

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAppClick = (appId: string) => {
        dispatch({ type: `${appId}/OPEN` });
        dispatch({ type: 'launchpad/CLOSE' });
    };

    const handleClose = () => {
        dispatch({ type: 'launchpad/CLOSE' });
    };

    return (
        <div className="launchpad-overlay" onClick={handleClose}>
            <div className="launchpad-container" onClick={(e) => e.stopPropagation()}>
                <div className="launchpad-header">
                    <div className="search-bar">
                        <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="category-tabs">
                        <button
                            className={activeCategory === 'all' ? 'active' : ''}
                            onClick={() => setActiveCategory('all')}
                        >
                            Barchasi
                        </button>
                        <button
                            className={activeCategory === 'mehnat' ? 'active' : ''}
                            onClick={() => setActiveCategory('mehnat')}
                        >
                            Mehnat Xavfsizligi
                        </button>
                        <button
                            className={activeCategory === 'safety' ? 'active' : ''}
                            onClick={() => setActiveCategory('safety')}
                        >
                            KPI Boshqaruv
                        </button>
                    </div>
                </div>

                <div className="apps-grid">
                    {filteredApps.map((app) => (
                        <div
                            key={app.id}
                            className="app-item"
                            onClick={() => handleAppClick(app.id)}
                        >
                            <div className="app-icon-wrapper">
                                <img src={app.icon} alt={app.name} className="app-icon" />
                            </div>
                            <span className="app-name">{app.name}</span>
                        </div>
                    ))}
                </div>

                <div className="launchpad-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    );
};

export default Launchpad;
