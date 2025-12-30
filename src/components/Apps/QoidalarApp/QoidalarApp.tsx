import React, { useContext, useState, useMemo, useEffect } from 'react';
import { store } from '../../../App';
import AppWindow from '../../AppWindow/AppWindow';
import { docsData, DocType, DocItem } from './docsData';
import './QoidalarApp.scss';

const QoidalarApp: React.FC = () => {
    const [state] = useContext(store);
    const [activeTab, setActiveTab] = useState<DocType>('qonunlar');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
    const [isPreviewExpanded, setPreviewExpanded] = useState(false);

    const isWindowClosed = state.qoidalarWindow?.closed;

    const docsForActiveTab = useMemo<DocItem[]>(() => {
        return docsData[activeTab];
    }, [activeTab]);

    // Get unique categories for the current tab
    const categories = useMemo<string[]>(() => {
        const cats = Array.from(new Set(docsForActiveTab.map(doc => doc.category)));
        return cats.sort();
    }, [docsForActiveTab]);

    // Filter documents based on active tab, category, and search term
    const filteredDocs = useMemo((): DocItem[] => {
        return docsForActiveTab.filter((doc) => {
            const matchesCategory = activeCategory ? doc.category === activeCategory : true;
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [docsForActiveTab, activeCategory, searchTerm]);

    const docsToRender: DocItem[] = filteredDocs;

    const handleDocumentSelect = (doc: DocItem) => {
        setSelectedDoc(doc);
    };

    const handleClearSelection = () => {
        setSelectedDoc(null);
        setPreviewExpanded(false);
    };

    const handleOpenInNewTab = (link: string) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        if (!selectedDoc) {
            setPreviewExpanded(false);
        }
    }, [selectedDoc]);

    useEffect(() => {
        if (!selectedDoc) return;

        const stillVisible = filteredDocs.some(doc => doc.id === selectedDoc.id);
        if (!stillVisible) {
            setSelectedDoc(null);
        }
    }, [filteredDocs, selectedDoc]);

    const getTabLabel = (tab: DocType) => {
        switch (tab) {
            case 'qonunlar': return 'Qonunlar';
            case 'qarorlar': return 'Qarorlar';
            case 'qoidalar': return 'Qoidalar';
            default: return tab;
        }
    };

    if (isWindowClosed) {
        return null;
    }

    return (
        <AppWindow
            appId="qoidalar"
            title="Normativ Hujjatlar"
            defaultWidth={1000}
            defaultHeight={700}
            defaultX={110}
            defaultY={55}
        >
            <div className="qoidalar-app">
                <div className="app-sidebar">
                    <div className="sidebar-header">
                        <h3>Bo'limlar</h3>
                    </div>
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'qonunlar' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('qonunlar'); setActiveCategory(null); setSelectedDoc(null); }}
                        >
                            ⚖️ Qonunlar
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'qarorlar' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('qarorlar'); setActiveCategory(null); setSelectedDoc(null); }}
                        >
                            📜 Qarorlar
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'qoidalar' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('qoidalar'); setActiveCategory(null); setSelectedDoc(null); }}
                        >
                            📋 Qoidalar
                        </button>
                    </nav>

                    <div className="sidebar-divider"></div>

                    <div className="sidebar-section">
                        <h3>Toifalar</h3>
                        <nav className="category-nav">
                            <button
                                className={`category-item ${activeCategory === null ? 'active' : ''}`}
                                onClick={() => { setActiveCategory(null); setSelectedDoc(null); }}
                            >
                                Barchasi
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => { setActiveCategory(cat); setSelectedDoc(null); }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="app-main">
                    <div className="main-header">
                        <h2>{getTabLabel(activeTab)}</h2>
                        <div className="header-actions">
                            <input
                                type="text"
                                placeholder="Hujjatni qidirish..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setSelectedDoc(null); }}
                            />
                        </div>
                    </div>

                    <div className="docs-layout">
                        <div className="docs-content">
                            <table className="docs-table">
                                <thead>
                                    <tr>
                                        <th>Nomi</th>
                                        <th>Toifa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docsToRender.map((doc: DocItem) => (
                                        <tr
                                            key={doc.id}
                                            className={`document-row ${selectedDoc?.id === doc.id ? 'is-active' : ''}`}
                                            onClick={() => handleDocumentSelect(doc)}
                                        >
                                            <td className="doc-title-cell">
                                                <div className="doc-icon">📄</div>
                                                <div className="doc-info">
                                                    <span className="doc-name">{doc.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-badge">{doc.category}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDocs.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="no-data">
                                                Hujjatlar topilmadi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <aside className={`doc-preview ${selectedDoc ? 'has-doc' : 'is-empty'}`}>
                            {selectedDoc ? (
                                <>
                                    <div className="doc-preview__header">
                                        <div className="doc-preview__meta">
                                            <span className="doc-preview__category">{selectedDoc.category}</span>
                                            <h2 className="doc-preview__title">{selectedDoc.title}</h2>
                                        </div>
                                        <div className="doc-preview__actions">
                                            <button
                                                type="button"
                                                className="doc-preview__action"
                                                onClick={() => handleClearSelection()}
                                            >
                                                Tanlovni tozalash
                                            </button>
                                            <button
                                                type="button"
                                                className="doc-preview__action doc-preview__action--ghost"
                                                onClick={() => setPreviewExpanded(true)}
                                            >
                                                To‘liq ko‘rish
                                            </button>
                                            <button
                                                type="button"
                                                className="doc-preview__action doc-preview__action--primary"
                                                onClick={() => handleOpenInNewTab(selectedDoc.link)}
                                            >
                                                Yangi oynada ochish
                                            </button>
                                        </div>
                                    </div>
                                    <div className="doc-preview__frame">
                                        <iframe
                                            key={selectedDoc.id}
                                            src={selectedDoc.link}
                                            title={selectedDoc.title}
                                            referrerPolicy="no-referrer"
                                            allow="fullscreen; clipboard-read; clipboard-write"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="doc-preview__empty">
                                    <div className="doc-preview__empty-icon">📄</div>
                                    <h3>Hujjat tanlanmagan</h3>
                                    <p>Chap tomondagi roʻyxatdan hujjatni tanlang yoki qidiruvdan foydalaning.</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>

            {selectedDoc && isPreviewExpanded && (
                <div className="doc-preview-modal" role="dialog" aria-modal="true" aria-label={`${selectedDoc.title} hujjatini to‘liq ko‘rish`}>
                    <div className="doc-preview-modal__content">
                        <header className="doc-preview-modal__header">
                            <div className="doc-preview-modal__meta">
                                <span className="doc-preview-modal__category">{selectedDoc.category}</span>
                                <h3>{selectedDoc.title}</h3>
                            </div>
                            <div className="doc-preview-modal__actions">
                                <button
                                    type="button"
                                    className="doc-preview-modal__action"
                                    onClick={() => setPreviewExpanded(false)}
                                    aria-label="Yopish"
                                >
                                    ✕
                                </button>
                            </div>
                        </header>
                        <div className="doc-preview-modal__frame">
                            <iframe
                                key={`modal-${selectedDoc.id}`}
                                src={selectedDoc.link}
                                title={`${selectedDoc.title} — kengaytirilgan ko‘rinish`}
                                referrerPolicy="no-referrer"
                                allow="fullscreen; clipboard-read; clipboard-write"
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppWindow>
    );
};

export default QoidalarApp;
