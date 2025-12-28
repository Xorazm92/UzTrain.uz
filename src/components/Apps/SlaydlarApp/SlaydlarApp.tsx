import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './SlaydlarApp.scss';

const slides = [
    { id: 1, title: "Mehnat xavfsizligi asoslari", slides: 24, author: "Xavfsizlik bo'limi", date: "2024-01-15" },
    { id: 2, title: "Temir yo'lda xatti-harakat qoidalari", slides: 32, author: "O'quv markazi", date: "2024-01-10" },
    { id: 3, title: "Yong'in xavfsizligi treningi", slides: 18, author: "FQD bo'limi", date: "2024-01-05" },
    { id: 4, title: "Elektr xavfsizligi", slides: 28, author: "Texnik xizmat", date: "2023-12-20" },
    { id: 5, title: "Shaxsiy himoya vositalari", slides: 15, author: "Xavfsizlik bo'limi", date: "2023-12-15" },
    { id: 6, title: "Xavfli yuklar bilan ishlash", slides: 22, author: "Logistika bo'limi", date: "2023-12-10" },
];

const SlaydlarApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.slaydlarWindow?.closed) return null;

    return (
        <AppWindow
            appId="slaydlar"
            title="Slaydlar"
            defaultWidth={950}
            defaultHeight={600}
            defaultX={90}
            defaultY={45}
        >
            <div className="slaydlar-app">
                <div className="app-toolbar">
                    <div className="toolbar-left">
                        <h2>Taqdimotlar</h2>
                        <span className="count">{slides.length} ta slayd</span>
                    </div>
                    <div className="toolbar-right">
                        <div className="search-box">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input type="text" placeholder="Qidirish..." />
                        </div>
                        <button className="upload-btn">📤 Yuklash</button>
                    </div>
                </div>

                <div className="slides-grid">
                    {slides.map((slide) => (
                        <div key={slide.id} className="slide-card">
                            <div className="slide-preview">
                                <span className="preview-icon">📊</span>
                                <div className="slide-count">{slide.slides} slayd</div>
                            </div>
                            <div className="slide-info">
                                <h3>{slide.title}</h3>
                                <div className="slide-meta">
                                    <span className="author">👤 {slide.author}</span>
                                    <span className="date">📅 {slide.date}</span>
                                </div>
                            </div>
                            <div className="slide-actions">
                                <button className="action-btn primary">Ko'rish</button>
                                <button className="action-btn">Yuklab olish</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppWindow>
    );
};

export default SlaydlarApp;
