import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
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
    <Card className="bg-gradient-to-br from-primary-500 to-primary-700">
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium opacity-90">Saldo Konta</h3>
          <DollarSign className="h-6 w-6 opacity-75" />
        </div>
        
        <div className="mb-4">
          <p className="text-4xl font-bold mb-2">
            {formatCurrency(account.balance, account.currency)}
          </p>
          <div className="flex items-center text-sm opacity-90">
            {monthlyTrend === 'up' ? (
              <>
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{trendPercentage}% w tym miesiącu</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-{trendPercentage}% w tym miesiącu</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-white/20">
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
          <Button
            variant="secondary"
            className="w-full bg-white text-primary-600 hover:bg-gray-100"
            onClick={onNewTransaction}
          >
            Nowa Transakcja
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
