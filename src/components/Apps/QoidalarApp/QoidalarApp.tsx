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
    const [isPreviewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [previewKey, setPreviewKey] = useState(0);
    const previewTimeoutRef = React.useRef<number | null>(null);

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

    const totalDocs = docsForActiveTab.length;
    const filteredCount = filteredDocs.length;
    const activeCategoryLabel = activeCategory ?? 'Barcha yo‘nalishlar';

    const docsToRender: DocItem[] = filteredDocs;

    const handleDocumentSelect = (doc: DocItem) => {
        setSelectedDoc(doc);
        setPreviewExpanded(false);
        setPreviewLoading(true);
        setPreviewError(null);
        setPreviewKey(prev => prev + 1);
    };

    const handleClearSelection = () => {
        setSelectedDoc(null);
        setPreviewExpanded(false);
        setPreviewLoading(false);
        setPreviewError(null);
    };

    const handleOpenInNewTab = (link: string) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopyStatus('copied');
        } catch (error) {
            console.error('Havolani nusxalashda xato:', error);
            setCopyStatus('error');
        } finally {
            window.setTimeout(() => setCopyStatus('idle'), 1500);
        }
    };

    useEffect(() => {
        if (!selectedDoc) {
            setPreviewExpanded(false);
            setPreviewLoading(false);
            setPreviewError(null);
            if (previewTimeoutRef.current) {
                window.clearTimeout(previewTimeoutRef.current);
            }
        }
    }, [selectedDoc]);

    useEffect(() => {
        if (!selectedDoc) return;

        const stillVisible = filteredDocs.some(doc => doc.id === selectedDoc.id);
        if (!stillVisible) {
            setSelectedDoc(null);
        }
    }, [filteredDocs, selectedDoc]);

    useEffect(() => {
        if (!selectedDoc) {
            return;
        }

        if (previewTimeoutRef.current) {
            window.clearTimeout(previewTimeoutRef.current);
        }

        previewTimeoutRef.current = window.setTimeout(() => {
            setPreviewLoading(false);
            setPreviewError('Hujjatni ichki oynada ko‘rsatib bo‘lmadi. Iltimos, to‘liq ko‘rish tugmasidan yoki yangi oynada ochishdan foydalaning.');
        }, 7000);

        return () => {
            if (previewTimeoutRef.current) {
                window.clearTimeout(previewTimeoutRef.current);
            }
        };
    }, [selectedDoc, previewKey]);

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
            defaultWidth={1380}
            defaultHeight={840}
            defaultX={72}
            defaultY={36}
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
                    <header className="document-toolbar">
                        <div className="document-toolbar__meta">
                            <span className="document-toolbar__eyebrow">Normativ ma'lumotnoma</span>
                            <h1>Normativ hujjatlar</h1>
                            <p>
                                {getTabLabel(activeTab)} · {filteredCount} ta hujjat · {activeCategoryLabel}
                            </p>
                        </div>
                        <div className="document-toolbar__actions">
                            <div className="segmented-control" role="tablist" aria-label="Hujjat bo‘limlari">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === 'qonunlar'}
                                    className={`segmented-control__item ${activeTab === 'qonunlar' ? 'is-active' : ''}`}
                                    onClick={() => { setActiveTab('qonunlar'); setActiveCategory(null); setSelectedDoc(null); }}
                                >
                                    ⚖️ Qonunlar
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === 'qarorlar'}
                                    className={`segmented-control__item ${activeTab === 'qarorlar' ? 'is-active' : ''}`}
                                    onClick={() => { setActiveTab('qarorlar'); setActiveCategory(null); setSelectedDoc(null); }}
                                >
                                    📜 Qarorlar
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === 'qoidalar'}
                                    className={`segmented-control__item ${activeTab === 'qoidalar' ? 'is-active' : ''}`}
                                    onClick={() => { setActiveTab('qoidalar'); setActiveCategory(null); setSelectedDoc(null); }}
                                >
                                    📋 Qoidalar
                                </button>
                            </div>
                            <div className="document-toolbar__search">
                                <input
                                    type="text"
                                    placeholder="Hujjat nomi yoki yo‘nalishi..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedDoc(null); }}
                                />
                            </div>
                        </div>
                    </header>

                    <div className="workspace">
                        <section className="workspace__list">
                            <header className="workspace__list-header">
                                <div>
                                    <span className="workspace__list-eyebrow">Ro‘yxat</span>
                                    <h2>{getTabLabel(activeTab)} hujjatlari</h2>
                                </div>
                                <span className="workspace__badge">{filteredCount} / {totalDocs}</span>
                            </header>

                            <div className="workspace__summary">
                                <span className="workspace__chip">{activeCategoryLabel}</span>
                                <span className="workspace__chip workspace__chip--muted">
                                    {selectedDoc ? 'Tanlangan: ' + selectedDoc.title : 'Hujjat tanlanmagan'}
                                </span>
                            </div>

                            <div className="workspace__documents">
                                {docsToRender.map(doc => (
                                    <button
                                        type="button"
                                        key={doc.id}
                                        className={`document-card ${selectedDoc?.id === doc.id ? 'is-active' : ''}`}
                                        onClick={() => handleDocumentSelect(doc)}
                                    >
                                        <div className="document-card__icon" aria-hidden>
                                            📄
                                        </div>
                                        <div className="document-card__body">
                                            <span className="document-card__title">{doc.title}</span>
                                            <span className="document-card__subtitle">{doc.category}</span>
                                        </div>
                                        <div className="document-card__chevron" aria-hidden>
                                            ➜
                                        </div>
                                    </button>
                                ))}

                                {filteredDocs.length === 0 && (
                                    <div className="workspace__empty">
                                        <div className="workspace__empty-icon">🔍</div>
                                        <h3>Hujjat topilmadi</h3>
                                        <p>Qidiruv so‘zini o‘zgartiring yoki boshqa toifani tanlab ko‘ring.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className={`workspace__viewer ${selectedDoc ? 'has-doc' : 'is-empty'}`}>
                            {selectedDoc ? (
                                <>
                                    <header className="viewer-header">
                                        <div className="viewer-header__tag">{selectedDoc.category}</div>
                                        <h2>{selectedDoc.title}</h2>
                                        <p>
                                            Ushbu hujjat rasmiy manbadan olingan. Quyidagi oynada to‘liq matnni ko‘rishingiz yoki
                                            tezkor amallardan foydalanishingiz mumkin.
                                        </p>
                                        <div className="viewer-header__actions">
                                            <button type="button" className="viewer-action viewer-action--ghost" onClick={handleClearSelection}>
                                                Tanlovni tozalash
                                            </button>
                                            <button type="button" className="viewer-action viewer-action--ghost" onClick={() => setPreviewExpanded(true)}>
                                                To‘liq ko‘rish
                                            </button>
                                            <button
                                                type="button"
                                                className="viewer-action viewer-action--primary"
                                                onClick={() => handleOpenInNewTab(selectedDoc.link)}
                                            >
                                                Yangi oynada ochish
                                            </button>
                                            <button
                                                type="button"
                                                className="viewer-action viewer-action--ghost viewer-action--compact"
                                                onClick={() => handleCopyLink(selectedDoc.link)}
                                                aria-live="polite"
                                            >
                                                {copyStatus === 'copied' ? 'Havola nusxalandi' : copyStatus === 'error' ? 'Xatolik' : 'Havolani nusxalash'}
                                            </button>
                                        </div>
                                    </header>
                                    <div className="viewer-frame">
                                        <div className="viewer-frame__stage">
                                            {isPreviewLoading && !previewError && (
                                                <div className="viewer-frame__overlay" role="status" aria-live="polite">
                                                    <span className="viewer-frame__spinner" />
                                                    <span>Hujjat yuklanmoqda…</span>
                                                </div>
                                            )}

                                            {previewError ? (
                                                <div className="viewer-frame__fallback">
                                                    <div className="viewer-frame__fallback-icon">⚠️</div>
                                                    <h3>Hujjatni ko‘rsatib bo‘lmadi</h3>
                                                    <p>{previewError}</p>
                                                    <div className="viewer-frame__fallback-actions">
                                                        <button type="button" onClick={() => handleOpenInNewTab(selectedDoc.link)}>
                                                            Havolani ochish
                                                        </button>
                                                        <button type="button" onClick={() => handleCopyLink(selectedDoc.link)}>
                                                            Havolani nusxalash
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <iframe
                                                    key={`preview-${previewKey}`}
                                                    src={selectedDoc.link}
                                                    title={selectedDoc.title}
                                                    referrerPolicy="no-referrer"
                                                    allow="fullscreen; clipboard-read; clipboard-write"
                                                    onLoad={() => {
                                                        setPreviewLoading(false);
                                                        setPreviewError(null);
                                                        if (previewTimeoutRef.current) {
                                                            window.clearTimeout(previewTimeoutRef.current);
                                                        }
                                                    }}
                                                    onError={() => {
                                                        setPreviewLoading(false);
                                                        setPreviewError('Hujjatni ichki oynada ko‘rsatib bo‘lmadi. Iltimos, havolani tashqi oynada oching.');
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="viewer-empty">
                                    <div className="viewer-empty__icon">🗂️</div>
                                    <h3>Hujjat tanlanmagan</h3>
                                    <p>Chap tomondagi ro‘yxatdan hujjatni tanlab, shu oynada ko‘rib chiqing.</p>
                                </div>
                            )}
                        </section>
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
                            <div className="doc-preview-modal__stage">
                                <iframe
                                    key={`modal-${previewKey}`}
                                    src={selectedDoc.link}
                                    title={`${selectedDoc.title} — kengaytirilgan ko‘rinish`}
                                    referrerPolicy="no-referrer"
                                    allow="fullscreen; clipboard-read; clipboard-write"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppWindow>
    );
};

export default QoidalarApp;
