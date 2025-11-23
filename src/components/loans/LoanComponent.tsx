import { DollarSign, Calendar, TrendingDown, Info } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
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

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAID_OFF: 'bg-blue-100 text-blue-800',
  DELINQUENT: 'bg-yellow-100 text-yellow-800',
  DEFAULT: 'bg-red-100 text-red-800',
};

const statusLabels = {
  ACTIVE: 'Aktywny',
  PAID_OFF: 'Spłacony',
  DELINQUENT: 'Zaległość',
  DEFAULT: 'Niespłacony',
};

export function LoanComponent({ loan, onViewDetails }: LoanComponentProps) {
  const progressPercentage = ((loan.principalAmount - loan.currentBalance) / loan.principalAmount) * 100;
  const monthsRemaining = Math.ceil(loan.currentBalance / loan.monthlyPayment);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {loanTypeLabels[loan.loanType]}
            </h3>
            <p className="text-sm text-gray-500 font-mono mt-1">ID: {loan.id}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[loan.status]
          }`}>
            {statusLabels[loan.status]}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-500 text-xs mb-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Kwota kredytu
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(loan.principalAmount, 'PLN')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-500 text-xs mb-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              Do spłaty
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(loan.currentBalance, 'PLN')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Postęp spłaty</span>
            <span className="font-medium text-gray-900">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Loan Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Miesięczna rata:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(loan.monthlyPayment, 'PLN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Oprocentowanie:</span>
            <span className="font-medium text-gray-900">{loan.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pozostało rat:</span>
            <span className="font-medium text-gray-900">
              {monthsRemaining} / {loan.termMonths}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Następna płatność:</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
              <span className="font-medium text-gray-900">
                {formatDate(loan.nextPaymentDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="secondary"
          onClick={() => onViewDetails(loan)}
          className="w-full"
        >
          <Info className="h-4 w-4 mr-2" />
          Zobacz szczegóły
        </Button>
      </CardContent>
    </Card>
  );
}
