import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Account } from '@/types';
import { formatCurrency } from '@/utils';

interface BalanceCardProps {
  account: Account;
  onNewTransaction?: () => void;
}

export function BalanceCard({ account, onNewTransaction }: BalanceCardProps) {
  // Mock monthly trend calculation
  const monthlyTrend = Math.random() > 0.5 ? 'up' : 'down';
  const trendPercentage = (Math.random() * 15).toFixed(1);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-700 p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium opacity-90">Saldo Konta</h3>
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-4xl font-bold mb-2 tracking-tight">
            {formatCurrency(account.balance, account.currency)}
          </p>
          <div className="flex items-center text-sm">
            <span className={`flex items-center px-2 py-1 rounded-lg ${monthlyTrend === 'up' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'
              }`}>
              {monthlyTrend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{monthlyTrend === 'up' ? '+' : '-'}{trendPercentage}% w tym miesiącu</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs opacity-75 mb-1">Typ konta</p>
            <p className="text-sm font-medium">
              {account.type === 'PERSONAL_CHECKING' ? 'Osobiste' :
                account.type === 'SAVINGS' ? 'Oszczędnościowe' :
                  account.type === 'BUSINESS' ? 'Biznesowe' :
                    'Inwestycyjne'}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75 mb-1">Waluta</p>
            <p className="text-sm font-medium">{account.currency}</p>
          </div>
        </div>

        {onNewTransaction && (
          <button
            className="w-full py-2.5 rounded-xl bg-white text-emerald-600 font-medium hover:bg-emerald-50 transition-colors shadow-lg"
            onClick={onNewTransaction}
          >
            Nowa Transakcja
          </button>
        )}
      </div>
    </div>
  );
}
