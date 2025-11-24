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
      <div className="col-span-12 xl:col-span-8 space-y-6 lg:space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Income Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 lg:p-6 shadow-lg hover:bg-white/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-base font-medium text-gray-200">{t.dashboard.income}</span>
              <MoreHorizontal className="text-gray-400 h-5 w-5 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">$9,580.00</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{t.dashboard.thanLastMonth}</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  +40%
                </span>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 lg:p-6 shadow-lg hover:bg-white/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-base font-medium text-gray-200">{t.dashboard.expenses}</span>
              <MoreHorizontal className="text-gray-400 h-5 w-5 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">$1,580.00</span>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-400">{t.dashboard.thanLastMonth}</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  +5%
                </span>
              </div>
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 lg:p-6 shadow-lg hover:bg-white/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-base font-medium text-gray-200">{t.dashboard.savings}</span>
              <MoreHorizontal className="text-gray-400 h-5 w-5 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">$8,000.00</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{t.dashboard.thanLastMonth}</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  +30%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Balance Chart Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-200 mb-1">{t.dashboard.totalBalance}</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">$9,580.00</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30 mt-2">
                  <ArrowUpRight className="h-3 w-3" /> +5%
                </span>
              </div>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-white transition-colors">{t.common.week}</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold bg-white/10 shadow-sm text-white border border-white/10 backdrop-blur-sm">{t.common.month}</button>
              <button className="flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-white transition-colors">{t.common.year}</button>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="h-64 lg:h-80 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-t border-white/5 relative">
             {/* Grid lines */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-full h-px bg-white/5 border-t border-dashed border-white/5"></div>
                ))}
             </div>

            {/* Y-axis labels */}
            <div className="hidden sm:flex flex-col justify-between h-full text-[10px] text-gray-500 pb-6 pr-2 font-mono">
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
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end z-10">
                  {isSelected && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold py-1 px-2 rounded mb-2 whitespace-nowrap shadow-lg z-20">
                      $9.6k
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45 border-r border-b border-white/20"></div>
                    </div>
                  )}
                  <div className="w-full max-w-[24px] sm:max-w-[32px] bg-white/5 rounded-t-sm relative h-full flex items-end overflow-hidden group-hover:bg-white/10 transition-colors duration-300">
                    {/* Fill */}
                    <div 
                      style={{ height: `${height}%` }} 
                      className={`w-full rounded-t-sm transition-all duration-700 ease-out ${isSelected ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-white/20 group-hover:bg-white/30'}`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-wider">
                    {t.months[i].substring(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold text-white">{t.dashboard.transactionHistory}</h3>
            <div className="flex w-full sm:w-auto gap-3">
              <div className="relative flex-1 sm:flex-initial group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder={t.common.search}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 placeholder-gray-600 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-all">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t.common.filter}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 lg:mx-0">
            <div className="min-w-[700px] px-6 lg:px-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
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
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner group-hover:bg-white/10 transition-colors">
                              {tx.id.substring(0, 1)}
                            </div>
                            <span className="font-medium text-white text-sm">Transaction {tx.id.substring(0, 4)}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-400">
                          {new Date(tx.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 text-sm font-bold text-white">
                          {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {tx.status === 'COMPLETED' ? t.status.completed : tx.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-400">
                          {tx.type === 'TRANSFER' ? t.status.transfer : t.status.onlinePurchase}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Mock data
                    [1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner group-hover:bg-white/10 transition-colors">A</div>
                            <span className="font-medium text-white text-sm">Amazon</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-400">Mar 03, 2025</td>
                        <td className="py-4 text-sm font-bold text-white">-$750.00</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {t.status.completed}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-400">{t.status.onlinePurchase}</td>
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
      <div className="col-span-12 xl:col-span-4 space-y-6 lg:space-y-8">
        
        {/* Savings Donut Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-white">{t.dashboard.savings}</h3>
            <button className="text-xs font-medium text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white px-2 py-1 rounded transition-colors">{t.common.all}</button>
          </div>
          
          <div className="relative h-56 w-full flex items-center justify-center mb-8">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              
              {/* Segments */}
              {/* Green - Home (75%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="10" strokeDasharray="188 251.2" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              
              {/* Blue - Emergency (15%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="10" strokeDasharray="37 251.2" strokeDashoffset="-195" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              
              {/* Yellow - Vacation (10%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="10" strokeDasharray="25 251.2" strokeDashoffset="-240" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-400 font-medium mb-1">{t.common.total}</span>
              <span className="text-3xl font-bold text-white tracking-tight">$23,000</span>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-white">{t.dashboard.goals.home}</span>
                <span className="text-gray-400">$15k / $20k</span>
              </div>
              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 {/* Segmented progress bar style */}
                 <div className="absolute top-0 left-0 h-full w-full flex gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full ${i < 15 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                    ))}
                 </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-white">{t.dashboard.goals.emergencyFund}</span>
                <span className="text-gray-400">$7.5k / $15k</span>
              </div>
              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-white">{t.dashboard.goals.vacation}</span>
                <span className="text-gray-400">$5k / $2k</span>
              </div>
              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Cards Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">{t.dashboard.myCards} <span className="text-gray-400 font-normal">(3)</span></h3>
            <button className="flex items-center gap-1 text-xs font-medium text-white border border-white/20 px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              <Plus className="h-3.5 w-3.5" /> {t.dashboard.addCard}
            </button>
          </div>

          {/* Card Stack Visual */}
          <div className="relative h-52 w-full mb-8 flex justify-center perspective-1000">
            {/* Card 3 (Back) */}
            <div className="absolute top-0 w-[90%] h-40 bg-purple-500/20 backdrop-blur-sm rounded-2xl transform scale-90 -translate-y-6 z-0 border border-white/5 shadow-inner"></div>
            {/* Card 2 (Middle) */}
            <div className="absolute top-3 w-[95%] h-40 bg-blue-500/20 backdrop-blur-md rounded-2xl transform scale-95 -translate-y-3 z-10 border border-white/10 shadow-md">
              <div className="p-4">
                <p className="text-[10px] font-bold text-white/60">Bank of Alaska</p>
              </div>
            </div>
            {/* Card 1 (Front) */}
            <div className="absolute top-6 w-full h-44 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl z-20 shadow-2xl border border-white/20 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-5 flex flex-col justify-between h-full relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-white/70 block">Bank of Merina</span>
                    <span className="text-lg font-bold text-white tracking-wide">BankApp</span>
                  </div>
                  <Wifi className="h-5 w-5 text-white/80 rotate-90" />
                </div>
                
                <div className="flex items-center gap-3 my-2">
                  <div className="w-11 h-8 bg-amber-400/80 rounded flex items-center justify-center relative overflow-hidden shadow-sm border border-amber-300/50">
                     <div className="w-full h-[1px] bg-black/20 absolute top-1/3"></div>
                     <div className="w-full h-[1px] bg-black/20 absolute bottom-1/3"></div>
                     <div className="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
                     <div className="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-mono font-bold text-white tracking-widest drop-shadow-sm mb-3">3234 8678 4234 7628</p>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-4">
                        <div>
                        <p className="text-[8px] text-gray-300 uppercase mb-0.5">{t.dashboard.card.holderName}</p>
                        <p className="text-xs font-bold text-white">Maya Singh</p>
                        </div>
                        <div>
                        <p className="text-[8px] text-gray-300 uppercase mb-0.5">{t.dashboard.card.expiryDate}</p>
                        <p className="text-xs font-bold text-white">08/24</p>
                        </div>
                    </div>
                    <div className="text-lg font-bold italic text-white/90">VISA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-all hover:border-white/20 group">
              <div className="p-2 rounded-full bg-white/5 mb-1 group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
              {t.dashboard.receiveMoney}
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-all hover:border-white/20 group">
              <div className="p-2 rounded-full bg-white/5 mb-1 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              {t.dashboard.sendMoney}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}