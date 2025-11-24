import { useEffect } from 'react';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wifi
} from 'lucide-react';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { formatCurrency } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function Dashboard() {
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-8 pb-8">
      {/* Left Main Column */}
      <div className="col-span-12 lg:col-span-8 space-y-6 lg:space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Income Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-white">{t.dashboard.income}</span>
              <MoreHorizontal className="text-gray-300 h-5 w-5 cursor-pointer hover:text-white" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-white">$9,580.00</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/30">
                +40%
              </span>
            </div>
            <p className="text-gray-300 text-sm">{t.dashboard.thanLastMonth}</p>
      </div>

          {/* Expenses Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-white">{t.dashboard.expenses}</span>
              <MoreHorizontal className="text-gray-300 h-5 w-5 cursor-pointer hover:text-white" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-white">$1,580.00</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/30">
                +5%
              </span>
                </div>
            <p className="text-gray-300 text-sm">{t.dashboard.thanLastMonth}</p>
      </div>

          {/* Savings Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-white">{t.dashboard.savings}</span>
              <MoreHorizontal className="text-gray-300 h-5 w-5 cursor-pointer hover:text-white" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-white">$8,000.00</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/30">
                +30%
              </span>
            </div>
            <p className="text-gray-300 text-sm">{t.dashboard.thanLastMonth}</p>
          </div>
                </div>

        {/* Total Balance Chart Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{t.dashboard.totalBalance}</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-white">$9,580.00</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30">
                  <ArrowUpRight className="h-3 w-3" /> +5%
                </span>
                </div>
                </div>
            <div className="flex bg-black/20 rounded-full p-1 border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors">{t.common.week}</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white/20 shadow-sm text-white border border-white/10 backdrop-blur-md">{t.common.month}</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors">{t.common.year}</button>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="h-56 sm:h-64 flex items-end justify-between gap-1 sm:gap-4">
            {/* Y-axis labels */}
            <div className="hidden sm:flex flex-col justify-between h-full text-xs text-gray-300 pb-6 pr-2">
              <span>$10k</span>
              <span>$8k</span>
              <span>$6k</span>
              <span>$4k</span>
              <span>$2k</span>
              <span>$0</span>
            </div>
            
            {/* Bars */}
            {[65, 60, 55, 58, 68, 64, 90, 75, 72, 78, 95, 98].map((height, i) => {
              const isSelected = i === 6; // July
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  {isSelected && (
                    <div className="hidden sm:block absolute -top-12 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs py-1 px-2 rounded-lg mb-2 whitespace-nowrap z-10 shadow-lg">
                      <div className="font-bold">$9.6k</div>
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white/20 rotate-45 border-r border-b border-white/20"></div>
                    </div>
                  )}
                  <div className="w-full bg-black/20 rounded-t-lg sm:rounded-t-xl relative h-full overflow-hidden border border-white/5">
                    {/* Striped background pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent, #ffffff 100%)', backgroundSize: '8px 8px' }}></div>
                    {/* Fill */}
                    <div 
                      style={{ height: `${height}%` }} 
                      className={`absolute bottom-0 w-full rounded-t-lg sm:rounded-t-xl transition-all duration-500 ${isSelected ? 'bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'bg-white/30 group-hover:bg-white/40'}`}
                    ></div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 font-medium">
                    {t.months[i].substring(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-white">{t.dashboard.transactionHistory}</h3>
            <div className="flex w-full sm:w-auto gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={t.common.search}
                  className="w-full sm:w-auto pl-9 pr-4 py-2 rounded-full border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 placeholder-gray-500 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-all">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t.common.filter}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-5 lg:mx-0">
            <div className="min-w-[800px] px-5 lg:px-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    <th className="pb-4 pl-4">{t.dashboard.table.platform}</th>
                    <th className="pb-4">{t.dashboard.table.date}</th>
                    <th className="pb-4">{t.dashboard.table.amount}</th>
                    <th className="pb-4">{t.dashboard.table.status}</th>
                    <th className="pb-4">{t.dashboard.table.type}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                              {tx.id.substring(0, 1)}
                            </div>
                            <span className="font-medium text-white">Transaction {tx.id.substring(0, 4)}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-300">
                          {new Date(tx.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                          <span className="text-xs ml-2 text-gray-500">{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td className="py-4 text-sm font-bold text-white">
                          {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            tx.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                            tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {tx.status === 'COMPLETED' ? t.status.completed : tx.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-300">
                          {tx.type === 'TRANSFER' ? t.status.transfer : t.status.onlinePurchase}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Mock data if empty
                    [1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner">A</div>
                            <span className="font-medium text-white">Amazon</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-300">03 March, 2025 <span className="text-xs ml-1">at 10:00 PM</span></td>
                        <td className="py-4 text-sm font-bold text-white">-$750.00</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {t.status.completed}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-300">{t.status.onlinePurchase}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-6">
        
        {/* Savings Donut Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">{t.dashboard.savings}</h3>
            <button className="text-xs font-medium text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white px-2 py-1 rounded-md transition-colors">{t.common.all}</button>
          </div>
          
          <div className="relative h-64 w-full flex items-center justify-center mb-6">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#059669" strokeWidth="8" strokeDasharray="180 251.2" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="8" strokeDasharray="50 251.2" strokeDashoffset="-180" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="8" strokeDasharray="21 251.2" strokeDashoffset="-230" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-300">{t.common.total}</span>
              <span className="text-2xl font-bold text-white">$23,000</span>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white">{t.dashboard.goals.home}</span>
                <span className="text-gray-300">$15k / $20k</span>
              </div>
              <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '75%' }}></div>
                <div className="absolute top-0 left-0 h-full w-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 40%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.2) 80%, transparent 80%)', backgroundSize: '20px 100%' }}></div>
              </div>
            </div>
                  <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white">{t.dashboard.goals.emergencyFund}</span>
                <span className="text-gray-300">$7.5k / $15k</span>
                  </div>
              <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '50%' }}></div>
                  </div>
                </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white">{t.dashboard.goals.vacation}</span>
                <span className="text-gray-300">$5k / $2k</span>
              </div>
              <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Cards Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 lg:p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">{t.dashboard.myCards} <span className="text-gray-400 font-normal">(3)</span></h3>
            <button className="flex items-center gap-1 text-sm font-medium text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <Plus className="h-4 w-4" /> {t.dashboard.addCard}
            </button>
          </div>

          {/* Card Stack Visual */}
          <div className="relative h-48 w-full mb-8">
            {/* Card 3 (Back) */}
            <div className="absolute top-0 w-full h-40 bg-purple-500/30 backdrop-blur-sm rounded-2xl transform scale-90 -translate-y-4 z-0 border border-white/10"></div>
            {/* Card 2 (Middle) */}
            <div className="absolute top-2 w-full h-40 bg-blue-500/30 backdrop-blur-md rounded-2xl transform scale-95 -translate-y-2 z-10 border border-white/10">
              <div className="p-4">
                <p className="text-xs font-bold text-white opacity-80">Bank of Alaska</p>
              </div>
            </div>
            {/* Card 1 (Front) */}
            <div className="absolute top-4 w-full h-48 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-2xl z-20 shadow-2xl border border-white/30 overflow-hidden">
              {/* Card design pattern */}
              <div className="absolute right-0 top-0 h-full w-2/3 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/30 rounded-full blur-2xl"></div>
              
              <div className="p-6 flex flex-col justify-between h-full relative">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white tracking-wider">Bank of Merina</span>
                  <Wifi className="h-6 w-6 text-white rotate-90 opacity-80" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-8 bg-yellow-500/80 rounded-md flex items-center justify-center relative overflow-hidden shadow-lg">
                    <div className="absolute w-full h-[1px] bg-yellow-600 top-1/3"></div>
                    <div className="absolute w-full h-[1px] bg-yellow-600 bottom-1/3"></div>
                    <div className="absolute h-full w-[1px] bg-yellow-600 left-1/3"></div>
                    <div className="absolute h-full w-[1px] bg-yellow-600 right-1/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-mono font-bold text-white tracking-widest drop-shadow-md">3234 8678 4234 7628</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase mb-1">{t.dashboard.card.holderName}</p>
                      <p className="text-sm font-bold text-white">Maya Singh</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase mb-1">{t.dashboard.card.expiryDate}</p>
                      <p className="text-sm font-bold text-white">08/24</p>
                    </div>
                    <div className="text-xl font-bold font-style-italic text-white drop-shadow-md">VISA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all shadow-lg backdrop-blur-sm">
              <ArrowDownLeft className="h-4 w-4" /> {t.dashboard.receiveMoney}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all shadow-lg backdrop-blur-sm">
              <ArrowUpRight className="h-4 w-4" /> {t.dashboard.sendMoney}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}