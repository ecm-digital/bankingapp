import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Account } from '@/types';
import { formatCurrency } from '@/utils';

interface BalanceCardProps {
  account: Account;
  onNewTransaction?: () => void;
}

export function BalanceCard({ account, onNewTransaction }: BalanceCardProps) {
  const monthlyTrend = Math.random() > 0.5 ? 'up' : 'down';
  const trendPercentage = (Math.random() * 15).toFixed(1);

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-blue-100">Saldo Konta</h3>
        <div className="p-2 rounded-lg bg-white/10">
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold mb-2">
          {formatCurrency(account.balance, account.currency)}
        </p>
        <div className="flex items-center text-sm">
          <span className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
            monthlyTrend === 'up' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
          }`}>
            {monthlyTrend === 'up' ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {monthlyTrend === 'up' ? '+' : '-'}{trendPercentage}%
          </span>
          <span className="text-blue-200 text-xs ml-2">w tym miesiącu</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/10">
        <div>
          <p className="text-xs text-blue-200 mb-0.5">Typ konta</p>
          <p className="text-sm font-medium">
            {account.type === 'PERSONAL_CHECKING' ? 'Osobiste' :
              account.type === 'SAVINGS' ? 'Oszczędnościowe' :
                account.type === 'BUSINESS' ? 'Biznesowe' :
                  'Inwestycyjne'}
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-200 mb-0.5">Waluta</p>
          <p className="text-sm font-medium">{account.currency}</p>
        </div>
      </div>

      {onNewTransaction && (
        <button
          className="w-full py-2.5 rounded-lg bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
          onClick={onNewTransaction}
        >
          Nowa Transakcja
        </button>
      )}
    </div>
  );
}