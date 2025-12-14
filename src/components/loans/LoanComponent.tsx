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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {loanTypeLabels[loan.loanType]}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {loan.id}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${loan.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
            loan.status === 'PAID_OFF' ? 'bg-blue-100 text-blue-700' :
              loan.status === 'DELINQUENT' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
          }`}>
          {loan.status === 'ACTIVE' ? 'Aktywny' :
            loan.status === 'PAID_OFF' ? 'Spłacony' :
              loan.status === 'DELINQUENT' ? 'Zaległość' : 'Niespłacony'}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center text-slate-500 text-xs mb-1">
            <DollarSign className="h-3 w-3 mr-1" />
            Kwota kredytu
          </div>
          <p className="text-base font-bold text-slate-900">
            {formatCurrency(loan.principalAmount, 'PLN')}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center text-slate-500 text-xs mb-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            Do spłaty
          </div>
          <p className="text-base font-bold text-green-600">
            {formatCurrency(loan.currentBalance, 'PLN')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-500">Postęp spłaty</span>
          <span className="font-medium text-slate-900">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Loan Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Miesięczna rata:</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(loan.monthlyPayment, 'PLN')}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Oprocentowanie:</span>
          <span className="font-medium text-slate-900">{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500">Pozostało rat:</span>
          <span className="font-medium text-slate-900">
            {monthsRemaining} / {loan.termMonths}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500">Następna płatność:</span>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 text-blue-600 mr-1" />
            <span className="font-medium text-slate-900">
              {formatDate(loan.nextPaymentDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(loan)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
      >
        <Info className="h-4 w-4" />
        Zobacz szczegóły
      </button>
    </div>
  );
}