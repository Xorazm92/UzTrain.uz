import React, { useContext } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import './TemirYolApp.scss';

const documents = [
    { id: 1, title: "Temir yo'l harakati xavfsizligi qoidalari", code: "TYX-001", type: "Standart", date: "2024-01-01" },
    { id: 2, title: "Lokomotivlar texnik xizmati", code: "TYX-002", type: "Texnik", date: "2023-12-15" },
    { id: 3, title: "Relslarda ta'mirlash ishlari tartibi", code: "TYX-003", type: "Texnik", date: "2023-12-01" },
    { id: 4, title: "Yo'lovchilar tashish qoidalari", code: "TYX-004", type: "Xizmat", date: "2023-11-20" },
    { id: 5, title: "Yuk tashish xavfsizligi", code: "TYX-005", type: "Xavfsizlik", date: "2023-11-10" },
    { id: 6, title: "O'tish joylari xavfsizligi", code: "TYX-006", type: "Xavfsizlik", date: "2023-10-25" },
];

const TemirYolApp: React.FC = () => {
    const [state] = useContext(store);

    if (state.temiryolWindow?.closed) return null;

    return (
        <AppWindow
            appId="temiryol"
            title="Temir Yo'l Hujjatlari"
            defaultWidth={950}
            defaultHeight={600}
            defaultX={70}
            defaultY={35}
        >
            <div className="temiryol-app">
                <div className="app-header">
                    <div className="header-icon">🚂</div>
                    <div className="header-info">
                        <h1>Temir Yo'l Hujjatlari</h1>
                        <p>O'zbekiston Temir Yo'llari standartlari va qoidalari</p>
                    </div>
                </div>

                <div className="stats-bar">
                    <div className="stat">
                        <span className="value">{documents.length}</span>
                        <span className="label">Hujjatlar</span>
                    </div>
                    <div className="stat">
                        <span className="value">4</span>
                        <span className="label">Toifalar</span>
                    </div>
                    <div className="stat">
                        <span className="value">2024</span>
                        <span className="label">Yangilangan</span>
                    </div>
                </div>

                <div className="documents-grid">
                    {documents.map((doc) => (
                        <div key={doc.id} className="doc-card">
                            <div className="doc-icon">📄</div>
                            <div className="doc-content">
                                <span className="doc-code">{doc.code}</span>
                                <h3>{doc.title}</h3>
                                <div className="doc-meta">
                                    <span className="type">{doc.type}</span>
                                    <span className="date">{doc.date}</span>
                                </div>
                            </div>
                            <button className="view-btn">Ko'rish →</button>
                        </div>
                    ))}
                </div>
            </div>
        </AppWindow>
    );
};

export default TemirYolApp;
