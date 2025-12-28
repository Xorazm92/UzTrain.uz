import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './KasbApp.scss';

const manuals = [
    { id: 1, title: "Lokomotiv mashinisti", description: "Lokomotiv boshqarish va texnik xizmati", pages: 156, updated: "2024-01-10" },
    { id: 2, title: "Konduktor", description: "Yo'lovchilar xizmati va xavfsizlik", pages: 89, updated: "2024-01-05" },
    { id: 3, title: "Temir yo'l ta'mirchisi", description: "Relslar va infratuzilma ta'miri", pages: 124, updated: "2023-12-20" },
    { id: 4, title: "Signal bo'limi xodimi", description: "Signal tizimlari xizmati", pages: 98, updated: "2023-12-15" },
    { id: 5, title: "Dispetcher", description: "Harakat boshqaruvi va muvofiqlashtirish", pages: 112, updated: "2023-12-10" },
    { id: 6, title: "Elektr ta'minoti mutaxassisi", description: "Elektr tarmoqlari xizmati", pages: 145, updated: "2023-12-01" },
];

const KasbApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.kasbWindow?.closed) return null;

    return (
        <AppWindow appId="kasb" title="Kasb Yo'riqnomalari" defaultWidth={950} defaultHeight={600} defaultX={80} defaultY={40}>
            <div className="kasb-app">
                <div className="header">
                    <div className="header-left">
                        <h1>📚 Kasbiy Yo'riqnomalar</h1>
                        <p>{manuals.length} ta yo'riqnoma mavjud</p>
                    </div>
                    <div className="search-box">
                        <input type="text" placeholder="Kasb bo'yicha qidirish..." />
                    </div>
                </div>

                <div className="manuals-grid">
                    {manuals.map((manual) => (
                        <div key={manual.id} className="manual-card">
                            <div className="manual-icon">📖</div>
                            <div className="manual-content">
                                <h3>{manual.title}</h3>
                                <p>{manual.description}</p>
                                <div className="manual-meta">
                                    <span>📄 {manual.pages} sahifa</span>
                                    <span>📅 {manual.updated}</span>
                                </div>
                            </div>
                            <div className="manual-actions">
                                <button className="primary">O'qish</button>
                                <button>Yuklab olish</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppWindow>
    );
};

export default KasbApp;
