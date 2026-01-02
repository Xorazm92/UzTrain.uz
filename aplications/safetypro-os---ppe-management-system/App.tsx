
import React, { useState, useEffect } from 'react';
import { PPE_DATA, PLANNING_DATA } from './constants';
import { PPEItem, Category } from './types';
import PPECard from './components/PPECard';
import DetailsModal from './components/DetailsModal';
import { getPPESuggestions } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'planning' | 'ai'>('dashboard');
  const [selectedItem, setSelectedItem] = useState<PPEItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = PPE_DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.gost.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAskAi = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    // Passing OTY Context to Gemini via the task description
    const otyContext = "OTY AJ 2025 xarid rejasi va O'z DSt 12.4.280 normalari asosida: ";
    const result = await getPPESuggestions(otyContext + aiInput);
    setAiOutput(result || 'Natija topilmadi.');
    setIsAiLoading(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col p-4 relative select-none overflow-hidden">
      {/* Top Menu Bar - Mac OS Style */}
      <div className="h-8 absolute top-0 left-0 right-0 glass z-50 flex items-center justify-between px-6 text-[13px] font-semibold text-gray-800 border-b border-black/10">
        <div className="flex items-center space-x-4">
          <i className="fab fa-apple text-lg"></i>
          <span className="font-bold">SafetyPro OS</span>
          <span className="font-normal opacity-60">OTY AJ</span>
          <span className="font-normal opacity-60">Xarid-2025</span>
          <span className="font-normal opacity-60">Normalar</span>
        </div>
        <div className="flex items-center space-x-4">
          <i className="fas fa-signal"></i>
          <i className="fas fa-battery-three-quarters"></i>
          <span className="font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full h-full max-w-7xl dark-glass rounded-2xl mac-shadow flex overflow-hidden border border-white/20 animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* Mac OS Sidebar */}
          <aside className="w-64 bg-white/25 border-r border-white/10 flex flex-col backdrop-blur-3xl">
            <div className="p-6 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            
            <nav className="flex-1 px-4 space-y-1">
              <SidebarItem 
                icon="fas fa-home" 
                label="Monitor" 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
              />
              <SidebarItem 
                icon="fas fa-th-large" 
                label="SHHV Katalogi" 
                active={activeTab === 'catalog'} 
                onClick={() => setActiveTab('catalog')} 
              />
              <SidebarItem 
                icon="fas fa-table" 
                label="Reja-jadval 2025" 
                active={activeTab === 'planning'} 
                onClick={() => setActiveTab('planning')} 
              />
              <SidebarItem 
                icon="fas fa-brain" 
                label="AI Ekspert" 
                active={activeTab === 'ai'} 
                onClick={() => setActiveTab('ai')} 
              />
            </nav>

            <div className="p-4 mt-auto">
              <div className="bg-white/40 rounded-xl p-3 flex items-center space-x-3 border border-white/20">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">OTY</div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">Mehnat Muhofazasi</p>
                  <p className="text-[9px] text-gray-600">Boshqarma boshlig'i</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-white/30 p-8 backdrop-blur-md">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <header>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">Boshqaruv Paneli</h1>
                  <p className="text-gray-500 font-medium">OTY tarkibidagi ishchi-xodimlarni maxsus kiyim bilan ta'minlash holati.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="Jami Ehtiyoj" value="218K" trend="+4.1%" icon="fas fa-users" color="blue" />
                  <StatCard label="Xarid Rejasi" value="69 tur" trend="Tasdiq" icon="fas fa-file-invoice" color="green" />
                  <StatCard label="Budjet" value="14.5B" trend="UZS" icon="fas fa-wallet" color="purple" />
                  <StatCard label="Xavfsizlik" value="100%" trend="Standart" icon="fas fa-shield-alt" color="blue" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/50 p-6 rounded-2xl border border-white/20 mac-shadow">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Filiallar kesimida taqsimot</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PLANNING_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                          <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                          <Bar dataKey="total" fill="#007AFF" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white/50 p-6 rounded-2xl border border-white/20 mac-shadow flex flex-col items-center">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6 w-full text-left">Kategoriyalar ulushi</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Mavsumiy', value: 45 },
                              { name: 'Poyabzal', value: 20 },
                              { name: 'Elektr', value: 15 },
                              { name: 'Boshqa', value: 20 },
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {[0, 1, 2, 3].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">SHHV Katalogi</h1>
                  <div className="relative w-full md:w-96">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input 
                      type="text" 
                      placeholder="Nomi yoki GOST bo'yicha..." 
                      className="w-full pl-12 pr-4 py-2.5 bg-white/60 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map(item => (
                    <PPECard key={item.id} item={item} onClick={setSelectedItem} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'planning' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">Xarid Reja-jadvali 2025</h1>
                <div className="bg-white/60 rounded-2xl border border-white/20 overflow-hidden mac-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/40 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-black/5">
                          <th className="px-6 py-4">Filial / Boshqarma</th>
                          <th className="px-6 py-4">Jami Ehtiyoj (dona)</th>
                          <th className="px-6 py-4">Asosiy Pozitsiyalar</th>
                          <th className="px-6 py-4">Holat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 text-sm text-gray-700">
                        {PLANNING_DATA.map((plan, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                            <td className="px-6 py-4 font-bold">{plan.branch}</td>
                            <td className="px-6 py-4 font-mono text-blue-600">{plan.total.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1">
                                {plan.items.map((it, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-[10px] rounded-md border border-gray-200">{it}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center space-x-2 text-[11px] font-semibold text-green-600">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span>Tasdiqlangan</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic">* Ushbu ma'lumotlar rasmda taqdim etilgan 1-ILOVA (reja-jadval) asosida shakllantirildi.</p>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6 h-full flex flex-col animate-in fade-in zoom-in duration-500">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">AI Mehnat Muhofazasi Eksperti</h1>
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-200">
                    <p className="text-blue-800 text-xs font-medium leading-relaxed">
                      <i className="fas fa-info-circle mr-2"></i>
                      Ushbu AI model "O'zbekiston Temir Yo'llari" AJ kiyim-kechak normalari va Lex.uz dagi namunaviy nizom asosida sozlangan. 
                      Qanday ish turi uchun SHHV kerakligini so'rang.
                    </p>
                  </div>
                  
                  <textarea 
                    className="flex-1 p-6 bg-white/60 border border-white/40 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-800 shadow-inner"
                    placeholder="Masalan: Tungi smenada vagonlarni ko'rikdan o'tkazuvchi xodim uchun qishki kiyimlar to'plami normalari qanday?"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  ></textarea>
                  
                  <button 
                    onClick={handleAskAi}
                    disabled={isAiLoading || !aiInput.trim()}
                    className="bg-[#007AFF] hover:bg-[#0056B3] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                    <span>Normativlarni tekshirish</span>
                  </button>

                  {aiOutput && (
                    <div className="p-6 bg-white/80 border border-white/50 rounded-2xl animate-in slide-in-from-bottom-4 duration-500 mac-shadow overflow-y-auto max-h-[300px]">
                      <div className="flex items-center space-x-2 text-blue-600 font-bold text-[10px] uppercase mb-4 tracking-widest">
                        <i className="fas fa-robot"></i>
                        <span>Ekspert Xulosasi</span>
                      </div>
                      <div className="prose prose-sm text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                        {aiOutput}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

// Sub-components
const SidebarItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-[13px] font-medium ${
      active ? 'bg-blue-500/10 text-blue-600' : 'text-gray-600 hover:bg-black/5'
    }`}
  >
    <i className={`${icon} w-4 text-center ${active ? 'text-blue-600' : 'text-gray-400'}`}></i>
    <span>{label}</span>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: string; color: 'blue' | 'green' | 'purple' }> = ({ label, value, trend, icon, color }) => {
  const bgStyles = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };
  return (
    <div className="bg-white/40 p-5 rounded-2xl border border-white/30 mac-shadow flex flex-col justify-between hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg ${bgStyles[color]} text-white shadow-md`}>
          <i className={`${icon} text-sm`}></i>
        </div>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${trend.includes('+') || trend === 'Tasdiq' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-gray-800 mt-0.5 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default App;
