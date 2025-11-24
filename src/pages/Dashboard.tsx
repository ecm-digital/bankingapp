import { useEffect } from 'react';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wifi,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function Dashboard() {
  const { currentEmployee } = useAuth();
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Main Column */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-dashboard-text-main">{t.dashboard.income}</span>
              <MoreHorizontal className="text-dashboard-text-muted h-5 w-5 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-dashboard-text-main">$9,580.00</span>
              <span className="bg-dashboard-accent-lightGreen text-dashboard-accent-green text-xs font-bold px-2 py-1 rounded-full">
                +40%
              </span>
            </div>
            <p className="text-dashboard-text-muted text-sm">{t.dashboard.thanLastMonth}</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-dashboard-text-main">{t.dashboard.expenses}</span>
              <MoreHorizontal className="text-dashboard-text-muted h-5 w-5 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-dashboard-text-main">$1,580.00</span>
              <span className="bg-dashboard-accent-lightGreen text-dashboard-accent-green text-xs font-bold px-2 py-1 rounded-full">
                +5%
              </span>
            </div>
            <p className="text-dashboard-text-muted text-sm">{t.dashboard.thanLastMonth}</p>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg font-semibold text-dashboard-text-main">{t.dashboard.savings}</span>
              <MoreHorizontal className="text-dashboard-text-muted h-5 w-5 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-dashboard-text-main">$8,000.00</span>
              <span className="bg-dashboard-accent-lightGreen text-dashboard-accent-green text-xs font-bold px-2 py-1 rounded-full">
                +30%
              </span>
            </div>
            <p className="text-dashboard-text-muted text-sm">{t.dashboard.thanLastMonth}</p>
          </div>
        </div>

        {/* Total Balance Chart Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold text-dashboard-text-main mb-1">{t.dashboard.totalBalance}</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-dashboard-text-main">$9,580.00</span>
                <span className="bg-dashboard-accent-lightGreen text-dashboard-accent-green text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +5%
                </span>
              </div>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button className="px-4 py-1.5 rounded-full text-sm font-medium text-dashboard-text-muted hover:text-dashboard-text-main transition-colors">{t.common.week}</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-white shadow-sm text-dashboard-text-main">{t.common.month}</button>
              <button className="px-4 py-1.5 rounded-full text-sm font-medium text-dashboard-text-muted hover:text-dashboard-text-main transition-colors">{t.common.year}</button>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
            {/* Y-axis labels */}
            <div className="hidden sm:flex flex-col justify-between h-full text-xs text-dashboard-text-muted pb-6 pr-2">
              <span>$10,000</span>
              <span>$8,000</span>
              <span>$6,000</span>
              <span>$4,000</span>
              <span>$2,000</span>
              <span>$0</span>
            </div>
            
            {/* Bars */}
            {[65, 60, 55, 58, 68, 64, 90, 75, 72, 78, 95, 98].map((height, i) => {
              const isSelected = i === 6; // July
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  {isSelected && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dashboard-accent-teal text-white text-xs py-1 px-2 rounded-lg mb-2 whitespace-nowrap z-10 shadow-lg">
                      <div className="font-bold">$9,680 (20%)</div>
                      <div className="text-[10px] opacity-80">$9,580 (20%)</div>
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-dashboard-accent-teal rotate-45"></div>
                    </div>
                  )}
                  <div className="w-full bg-gray-50 rounded-t-xl relative h-full overflow-hidden">
                    {/* Striped background pattern */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 50%, #e5e7eb 50%, #e5e7eb 75%, transparent 75%, transparent, #e5e7eb 100%)', backgroundSize: '8px 8px' }}></div>
                    {/* Fill */}
                    <div 
                      style={{ height: `${height}%` }} 
                      className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-500 ${isSelected ? 'bg-dashboard-accent-teal' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                    ></div>
                  </div>
                  <span className="text-xs text-dashboard-text-muted mt-3 font-medium">
                    {t.months[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-dashboard-text-main">{t.dashboard.transactionHistory}</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dashboard-text-muted" />
                <input 
                  type="text" 
                  placeholder={t.common.search}
                  className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-accent-teal"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-dashboard-text-muted hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                {t.common.filter}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-dashboard-text-muted uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-4 pl-4">{t.dashboard.table.platform}</th>
                  <th className="pb-4">{t.dashboard.table.date}</th>
                  <th className="pb-4">{t.dashboard.table.amount}</th>
                  <th className="pb-4">{t.dashboard.table.status}</th>
                  <th className="pb-4">{t.dashboard.table.type}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                            {tx.id.substring(0, 1)}
                          </div>
                          <span className="font-medium text-dashboard-text-main">Transaction {tx.id.substring(0, 4)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-dashboard-text-muted">
                        {new Date(tx.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        <span className="text-xs ml-2 text-gray-400">{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="py-4 text-sm font-bold text-dashboard-text-main">
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'COMPLETED' ? 'bg-dashboard-accent-lightGreen text-dashboard-accent-green' : 
                          tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'COMPLETED' ? t.status.completed : tx.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-dashboard-text-muted">
                        {tx.type === 'TRANSFER' ? t.status.transfer : t.status.onlinePurchase}
                      </td>
                    </tr>
                  ))
                ) : (
                  // Mock data if empty
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">A</div>
                          <span className="font-medium text-dashboard-text-main">Amazon</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-dashboard-text-muted">03 March, 2025 <span className="text-xs ml-1">at 10:00 PM</span></td>
                      <td className="py-4 text-sm font-bold text-dashboard-text-main">-$750.00</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-dashboard-accent-lightGreen text-dashboard-accent-green">
                          {t.status.completed}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-dashboard-text-muted">{t.status.onlinePurchase}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar Column */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* Savings Donut Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-dashboard-text-main">{t.dashboard.savings}</h3>
            <button className="text-xs font-medium text-dashboard-text-muted border px-2 py-1 rounded-md">{t.common.all}</button>
          </div>
          
          <div className="relative h-64 w-full flex items-center justify-center mb-6">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#004D40" strokeWidth="8" strokeDasharray="180 251.2" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFC107" strokeWidth="8" strokeDasharray="50 251.2" strokeDashoffset="-180" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="8" strokeDasharray="21 251.2" strokeDashoffset="-230" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-dashboard-text-muted">{t.common.total}</span>
              <span className="text-2xl font-bold text-dashboard-text-main">$23,000</span>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-dashboard-text-main">{t.dashboard.goals.home}</span>
                <span className="text-dashboard-text-muted">$15,000 / $20,000</span>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-dashboard-accent-teal rounded-full" style={{ width: '75%' }}></div>
                <div className="absolute top-0 left-0 h-full w-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 40%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.2) 80%, transparent 80%)', backgroundSize: '20px 100%' }}></div>
              </div>
              <div className="text-center mt-1 text-xs text-white bg-dashboard-accent-teal w-8 rounded ml-[70%]">75%</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-dashboard-text-main">{t.dashboard.goals.emergencyFund}</span>
                <span className="text-dashboard-text-muted">$7,500 / $15,000</span>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-dashboard-accent-green rounded-full" style={{ width: '50%' }}></div>
              </div>
              <div className="text-center mt-1 text-xs text-white bg-dashboard-accent-green w-8 rounded ml-[45%]">50%</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-dashboard-text-main">{t.dashboard.goals.vacation}</span>
                <span className="text-dashboard-text-muted">$5,000 / $2,000</span>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="text-center mt-1 text-xs text-gray-800 bg-yellow-400 w-8 rounded ml-[20%]">25%</div>
            </div>
          </div>
        </div>

        {/* My Cards Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-dashboard-text-main">{t.dashboard.myCards} <span className="text-dashboard-text-muted font-normal">(3)</span></h3>
            <button className="flex items-center gap-1 text-sm font-medium text-dashboard-text-main border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Plus className="h-4 w-4" /> {t.dashboard.addCard}
            </button>
          </div>

          {/* Card Stack Visual */}
          <div className="relative h-48 w-full mb-8">
            {/* Card 3 (Back) */}
            <div className="absolute top-0 w-full h-40 bg-purple-100 rounded-2xl transform scale-90 -translate-y-4 z-0"></div>
            {/* Card 2 (Middle) */}
            <div className="absolute top-2 w-full h-40 bg-blue-100 rounded-2xl transform scale-95 -translate-y-2 z-10">
              <div className="p-4">
                <p className="text-xs font-bold text-blue-800">Bank of Alaska</p>
              </div>
            </div>
            {/* Card 1 (Front) */}
            <div className="absolute top-4 w-full h-48 bg-gradient-to-r from-[#EAEAEA] to-[#C4C4C4] rounded-2xl z-20 shadow-lg overflow-hidden">
              {/* Card design pattern */}
              <div className="absolute right-0 top-0 h-full w-2/3 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}></div>
              
              <div className="p-6 flex flex-col justify-between h-full relative">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-600">Bank of Merina</span>
                  <Wifi className="h-6 w-6 text-gray-800 rotate-90" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-8 bg-yellow-500/80 rounded-md flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-full h-[1px] bg-yellow-600 top-1/3"></div>
                    <div className="absolute w-full h-[1px] bg-yellow-600 bottom-1/3"></div>
                    <div className="absolute h-full w-[1px] bg-yellow-600 left-1/3"></div>
                    <div className="absolute h-full w-[1px] bg-yellow-600 right-1/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-mono font-bold text-gray-800 tracking-widest">3234 8678 4234 7628</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase mb-1">{t.dashboard.card.holderName}</p>
                      <p className="text-sm font-bold text-gray-800">Maya Singh</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase mb-1">{t.dashboard.card.expiryDate}</p>
                      <p className="text-sm font-bold text-gray-800">08/24</p>
                    </div>
                    <div className="text-xl font-bold font-style-italic text-gray-800">VISA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 text-dashboard-text-main font-medium hover:bg-gray-50 transition-colors">
              <ArrowDownLeft className="h-4 w-4" /> {t.dashboard.receiveMoney}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 text-dashboard-text-main font-medium hover:bg-gray-50 transition-colors">
              <ArrowUpRight className="h-4 w-4" /> {t.dashboard.sendMoney}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
