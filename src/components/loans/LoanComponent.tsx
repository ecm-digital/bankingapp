import { DollarSign, Calendar, TrendingDown, Info } from 'lucide-react';
import { Loan } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface LoanComponentProps {
  loan: Loan;
  onViewDetails: (loan: Loan) => void;
}

const loanTypeLabels = {
  PERSONAL: 'Kredyt Osobisty',
  MORTGAGE: 'Kredyt Hipoteczny',
  AUTO: 'Kredyt Samochodowy',
  BUSINESS: 'Kredyt Biznesowy',
};

export function LoanComponent({ loan, onViewDetails }: LoanComponentProps) {
  const progressPercentage = ((loan.principalAmount - loan.currentBalance) / loan.principalAmount) * 100;
  const monthsRemaining = Math.ceil(loan.currentBalance / loan.monthlyPayment);

  return (
    <div className="glass-panel rounded-2xl p-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {loanTypeLabels[loan.loanType]}
          </h3>
          <p className="text-sm text-gray-500 font-mono mt-1">ID: {loan.id}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${loan.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            loan.status === 'PAID_OFF' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              loan.status === 'DELINQUENT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
          {loan.status === 'ACTIVE' ? 'Aktywny' :
            loan.status === 'PAID_OFF' ? 'Spłacony' :
              loan.status === 'DELINQUENT' ? 'Zaległość' : 'Niespłacony'}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <DollarSign className="h-3 w-3 mr-1" />
            Kwota kredytu
          </div>
          <p className="text-lg font-bold text-white">
            {formatCurrency(loan.principalAmount, 'PLN')}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            Do spłaty
          </div>
          <p className="text-lg font-bold text-emerald-400">
            {formatCurrency(loan.currentBalance, 'PLN')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Postęp spłaty</span>
          <span className="font-medium text-white">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Loan Details */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Miesięczna rata:</span>
          <span className="font-semibold text-white">
            {formatCurrency(loan.monthlyPayment, 'PLN')}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Oprocentowanie:</span>
          <span className="font-medium text-white">{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Pozostało rat:</span>
          <span className="font-medium text-white">
            {monthsRemaining} / {loan.termMonths}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-400">Następna płatność:</span>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 text-emerald-400 mr-1" />
            <span className="font-medium text-white">
              {formatDate(loan.nextPaymentDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(loan)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors font-medium group-hover:border-emerald-500/30"
      >
        <Info className="h-4 w-4" />
        Zobacz szczegóły
      </button>
    </div>
  );
}
