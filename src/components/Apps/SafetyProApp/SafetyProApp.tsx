import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppWindow from '../../AppWindow/AppWindow';
import { store } from '../../../App';
import { PPE_DATA, PLANNING_DATA } from './data';
import { Category, type PPEItem } from './types';
import './SafetyProApp.scss';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TAB_CONFIG = [
  { id: 'dashboard', label: 'Boshqaruv paneli' },
  { id: 'catalog', label: "SHHV katalogi" },
  { id: 'planning', label: "Xarid reja-jadvali" },
  { id: 'advisor', label: 'SHHV bo‘yicha maslahatchi' },
] as const;

type TabId = typeof TAB_CONFIG[number]['id'];

const CATEGORY_COLORS: Record<Category, string> = {
  [Category.SEASONAL]: '#7E8BFF',
  [Category.WINTER]: '#B3A0FF',
  [Category.FOOTWEAR]: '#FF8A65',
  [Category.HEADWEAR]: '#64B5F6',
  [Category.EYE]: '#4DD0E1',
  [Category.RESPIRATORY]: '#81C784',
  [Category.HEIGHT]: '#FFD54F',
  [Category.WELDING]: '#FF7043',
  [Category.ELECTRICAL]: '#9575CD',
  [Category.HANDS]: '#4DB6AC',
  [Category.HEARING]: '#BA68C8',
  [Category.HYGIENE]: '#F06292',
};

const RADIAL_COLORS = ['#7E8BFF', '#5D6BFF', '#9EA7FF', '#C9CFFF', '#E4E7FF'];

const SafetyProApp: React.FC = () => {
  const [state] = useContext(store);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PPEItem | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const isWindowClosed = state.safetyproWindow?.closed ?? true;

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    const matchesSearch = PPE_DATA.filter((item) => {
      if (!needle) return true;
      return (
        item.name.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        item.gost.toLowerCase().includes(needle)
      );
    });
    if (activeCategory === 'all') {
      return matchesSearch;
    }
    return matchesSearch.filter((item) => item.category === activeCategory);
  }, [searchTerm, activeCategory]);

  const categoryAggregation = useMemo(() => {
    const map = new Map<Category, number>();
    PPE_DATA.forEach((item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.totalQuantity);
    });
    return Array.from(map.entries()).map(([category, total]) => ({
      category,
      total,
      label: category,
    }));
  }, []);

  const totalInventory = useMemo(
    () => PPE_DATA.reduce((acc, item) => acc + item.totalQuantity, 0),
    []
  );

  const criticalShare = useMemo(() => {
    const electrical = PPE_DATA.filter((item) => item.category === Category.ELECTRICAL)
      .reduce((acc, item) => acc + item.totalQuantity, 0);
    return totalInventory ? Math.round((electrical / totalInventory) * 100) : 0;
  }, [totalInventory]);

  const planningTotal = useMemo(
    () => PLANNING_DATA.reduce((acc, row) => acc + row.total, 0),
    []
  );

  const handleOpenDetails = (item: PPEItem) => {
    setSelectedItem(item);
    setSelectedPreview(item.image);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setSelectedPreview(null);
  };

  useEffect(() => {
    if (selectedItem) {
      setSelectedPreview(selectedItem.image);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (activeTab !== 'catalog') {
      setActiveCategory('all');
      setSearchTerm('');
    }
  }, [activeTab]);

  if (isWindowClosed) {
    return null;
  }

  const handleAskAdvisor = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResult(
        `Tahlil natijasi (SHXV standartlari asosida):\n\n• Tavsiya etilgan asosiy SHHV: ${
          PPE_DATA[0]?.name ?? '—'
        }\n• Qo‘shimcha himoya: Dielektrik qo‘lqop va kaska\n• Normativ: O‘z DSt 12.4.280 va tegishli GOST talablariga rioya qiling\n\nBatafsil tavsiyalar uchun Gemini API kalitini sozlang.`
      );
      setAiLoading(false);
    }, 900);
  };

  return (
    <AppWindow
      appId="safetypro"
      title="SafetyPro OS — SHHV boshqaruvi"
      defaultWidth={1400}
      defaultHeight={860}
      defaultX={80}
      defaultY={40}
    >
      <div className="safetypro-app">
        <aside className="safetypro-app__sidebar">
          <div className="app-identity">
            <div className="app-identity__badge">SHXV</div>
            <div className="app-identity__titles">
              <span>O‘TY AJ · SafetyPro OS</span>
              <h1>SHHV boshqaruv konsoli</h1>
            </div>
          </div>

          <div className="app-quick-stats">
            <div className="stat-card">
              <span className="stat-card__label">Jami nomenklatura</span>
              <strong className="stat-card__value">{PPE_DATA.length}</strong>
              <span className="stat-card__hint">Kategoriya va GOST bo‘yicha</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Ombordagi birliklar</span>
              <strong className="stat-card__value">{totalInventory.toLocaleString('uz-UZ')}</strong>
              <span className="stat-card__hint">Jami birliklar soni</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Elektr xavfsizligi ulushi</span>
              <strong className="stat-card__value">{criticalShare}%</strong>
              <span className="stat-card__hint">Kritik SHHV portfeli</span>
            </div>
          </div>

          <nav className="app-tabs">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`app-tabs__item ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="app-sidebar-meta">
            <div>
              <span className="meta-label">SHXV siyosati</span>
              <p>1-ILOVA xarid rejasi va SHXV bo‘yicha normativ hujjatlar asosida tuzilgan.</p>
            </div>
            <button
              type="button"
              className="meta-link"
              onClick={() => window.open('https://www.lex.uz/docs/3031427', '_blank', 'noopener,noreferrer')}
            >
              Normativ bazani ochish →
            </button>
          </div>
        </aside>

        <main className="safetypro-app__content">
          {activeTab === 'dashboard' && (
            <section className="panel">
              <header className="panel__header">
                <div>
                  <span className="eyebrow">Real vaqtli ko‘rsatkichlar</span>
                  <h2>Boshqaruv paneli</h2>
                </div>
                <div className="panel__actions">
                  <button type="button" className="ghost" onClick={() => setActiveTab('catalog')}>
                    Katalogga o‘tish
                  </button>
                </div>
              </header>

              <div className="dashboard-grid">
                <div className="dashboard-grid__metrics">
                  <article className="metric-card">
                    <div className="metric-card__icon">📦</div>
                    <div className="metric-card__body">
                      <span className="metric-card__label">Yuqori talabdagi pozitsiyalar</span>
                      <strong className="metric-card__value">{filteredItems.slice(0, 3).map((item) => item.name.split(' ')[0]).join(', ')}</strong>
                      <p className="metric-card__hint">So‘nggi xarid rejasi asosida</p>
                    </div>
                  </article>
                  <article className="metric-card">
                    <div className="metric-card__icon">🛡️</div>
                    <div className="metric-card__body">
                      <span className="metric-card__label">Reja–fakt divergens</span>
                      <strong className="metric-card__value">{planningTotal.toLocaleString('uz-UZ')} ta</strong>
                      <p className="metric-card__hint">2025-yil rejadagi birliklar</p>
                    </div>
                  </article>
                  <article className="metric-card">
                    <div className="metric-card__icon">📊</div>
                    <div className="metric-card__body">
                      <span className="metric-card__label">Kategoriya diversifikatsiyasi</span>
                      <strong className="metric-card__value">{categoryAggregation.length} toifa</strong>
                      <p className="metric-card__hint">SHXV portfeli bo‘yicha</p>
                    </div>
                  </article>
                </div>

                <div className="dashboard-grid__chart">
                  <div className="chart-card">
                    <header className="chart-card__header">
                      <h3>Kategoriya kesimida taqsimot</h3>
                    </header>
                    <div className="chart-card__body">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={categoryAggregation}>
                          <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#dfe4ff' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.08)' }} />
                          <Bar dataKey="total" radius={[12, 12, 12, 12]}>
                            {categoryAggregation.map((entry) => (
                              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card">
                    <header className="chart-card__header">
                      <h3>Reja-jadval monitoringi</h3>
                    </header>
                    <div className="chart-card__body chart-card__body--pie">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={PLANNING_DATA}
                            dataKey="total"
                            nameKey="branch"
                            innerRadius={58}
                            outerRadius={88}
                            paddingAngle={4}
                          >
                            {PLANNING_DATA.map((row, index) => (
                              <Cell key={row.branch} fill={RADIAL_COLORS[index % RADIAL_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="chart-summary">
                        <span>Jami {planningTotal.toLocaleString('uz-UZ')} birlik</span>
                        <p>Filiallar bo‘yicha SHHV ehtiyoji</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'catalog' && (
            <section className="panel">
              <header className="panel__header panel__header--wide">
                <div>
                  <span className="eyebrow">Katalog</span>
                  <h2>SHHV nomenklaturasi</h2>
                </div>
                <div className="panel__search">
                  <input
                    type="text"
                    placeholder="Nomi, toifasi yoki GOST bo‘yicha qidirish..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <div className="category-filter" role="tablist" aria-label="Kategoriya filtri">
                    <button
                      type="button"
                      className={`category-filter__chip ${activeCategory === 'all' ? 'is-active' : ''}`}
                      onClick={() => setActiveCategory('all')}
                    >
                      Barcha
                    </button>
                    {Object.values(Category).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`category-filter__chip ${activeCategory === cat ? 'is-active' : ''}`}
                        onClick={() => setActiveCategory(cat as Category)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              <div className="catalog-grid">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="ppe-card"
                    onClick={() => handleOpenDetails(item)}
                  >
                    <div className="ppe-card__thumb" style={{ backgroundImage: `url(${item.image})` }} />
                    <div className="ppe-card__body">
                      <span className="ppe-card__category">{item.category}</span>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <footer className="ppe-card__footer">
                      <span>{item.gost}</span>
                      <span>
                        {item.totalQuantity.toLocaleString('uz-UZ')} {item.unit ?? 'dona'}
                      </span>
                    </footer>
                  </button>
                ))}

                {filteredItems.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state__icon">🔎</div>
                    <h3>Natija topilmadi</h3>
                    <p>GOST yoki toifa nomini qisqartirmasdan yozishga harakat qiling.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'planning' && (
            <section className="panel">
              <header className="panel__header">
                <div>
                  <span className="eyebrow">Reja-jadval</span>
                  <h2>2025-yil SHHV ta’minoti</h2>
                </div>
              </header>

              <div className="planning-table">
                <table>
                  <thead>
                    <tr>
                      <th>Filial / Boshqarma</th>
                      <th>Jami ehtiyoj (dona)</th>
                      <th>Asosiy pozitsiyalar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLANNING_DATA.map((row) => (
                      <tr key={row.branch}>
                        <td>{row.branch}</td>
                        <td>{row.total.toLocaleString('uz-UZ')}</td>
                        <td>
                          <div className="planning-tags">
                            {row.items.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="panel__footer">
                <p>
                  * Ma’lumotlar SHXV bo‘yicha 1-ILOVA (2025-yil xarid rejasi) va ichki "Mehnatni muhofaza qilish" reglamenti
                  asosida shakllantirilgan.
                </p>
              </footer>
            </section>
          )}

          {activeTab === 'advisor' && (
            <section className="panel panel--advisor">
              <header className="panel__header">
                <div>
                  <span className="eyebrow">AI maslahatchi</span>
                  <h2>SHHV normativ tavsiyalari</h2>
                </div>
              </header>

              <div className="advisor-layout">
                <div className="advisor-intro">
                  <div className="advisor-intro__icon">🤖</div>
                  <div>
                    <h3>Gemini asosida SHHV ekspert tizimi</h3>
                    <p>
                      OTY AJ normativlari va GOST standartlari asosida tavsiya beruvchi yordamchi. API kalitini sozlagach, real
                      vaqt talablari bo‘yicha tavsiyalar olinadi.
                    </p>
                  </div>
                </div>

                <textarea
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                  placeholder="Masalan: Vagonlarni ko‘rikdan o‘tkazuvchi xodim uchun qishki smena SHHV to‘plami shakllantiring"
                />

                <div className="advisor-actions">
                  <button
                    type="button"
                    className="primary"
                    onClick={handleAskAdvisor}
                    disabled={aiLoading || !aiInput.trim()}
                  >
                    {aiLoading ? 'Tahlil qilinmoqda…' : 'Normativni tekshirish'}
                  </button>
                  <span className="advisor-hint">
                    Gemini API kalitini <code>process.env.API_KEY</code> orqali kiriting.
                  </span>
                </div>

                {aiResult && (
                  <div className="advisor-response">
                    <div className="advisor-response__label">Ekspert xulosasi</div>
                    <pre>{aiResult}</pre>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {selectedItem && (
          <div className="ppe-modal" role="dialog" aria-modal="true">
            <div className="ppe-modal__content">
              <header className="ppe-modal__header">
                <div>
                  <span className="ppe-modal__category">{selectedItem.category}</span>
                  <h3>{selectedItem.name}</h3>
                  <p>{selectedItem.gost}</p>
                  {selectedItem.department && (
                    <div className="ppe-modal__department">{selectedItem.department}</div>
                  )}
                </div>
                <button type="button" onClick={handleCloseDetails} aria-label="Yopish">
                  ✕
                </button>
              </header>
              <div className="ppe-modal__body">
                <aside className="ppe-modal__gallery">
                  <div className="ppe-modal__image" style={{ backgroundImage: `url(${selectedPreview ?? selectedItem.image})` }} />
                  {selectedItem.gallery && selectedItem.gallery.length > 0 && (
                    <div className="ppe-modal__thumbnails" role="list">
                      {selectedItem.gallery.map((photo, index) => (
                        <button
                          key={`${selectedItem.id}-gallery-${index}`}
                          type="button"
                          className={`ppe-modal__thumbnail ${photo === (selectedPreview ?? selectedItem.image) ? 'is-active' : ''}`}
                          onClick={() => setSelectedPreview(photo)}
                          style={{ backgroundImage: `url(${photo})` }}
                          aria-label={`Foto ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </aside>
                <div className="ppe-modal__info">
                  <section>
                    <h4>Tavsif</h4>
                    <p>{selectedItem.description}</p>
                  </section>
                  <section>
                    <h4>Material va tarkib</h4>
                    <p>{selectedItem.materials}</p>
                  </section>
                  <section>
                    <h4>Texnik parametrlar</h4>
                    <ul>
                      {selectedItem.specs.map((spec) => (
                        <li key={`${selectedItem.id}-${spec.label}`}>
                          <span>{spec.label}</span>
                          <strong>{spec.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4>Rang variantlari</h4>
                    <div className="ppe-modal__tags">
                      {selectedItem.colors.map((color) => (
                        <span key={color}>{color}</span>
                      ))}
                    </div>
                  </section>
                  {selectedItem.documents && selectedItem.documents.length > 0 && (
                    <section>
                      <h4>Normativ hujjatlar</h4>
                      <div className="ppe-modal__attachments">
                        {selectedItem.documents.map((doc) => (
                          <a key={doc.url} href={doc.url} target="_blank" rel="noreferrer" className="attachment-chip">
                            📄 {doc.label}
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
              <footer className="ppe-modal__footer">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => window.open(selectedPreview ?? selectedItem.image, '_blank')}
                >
                  Media faylini ochish
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => window.open('mailto:mehnat@railway.uz?subject=SHHV buyurtma')}
                >
                  Buyurtma berish
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </AppWindow>
  );
};

export default SafetyProApp;
