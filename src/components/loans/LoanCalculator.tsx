import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils';

export function LoanCalculator() {
  const [amount, setAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('5.5');
  const [termMonths, setTermMonths] = useState('120');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(termMonths);

    if (principal > 0 && rate > 0 && months > 0) {
      const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const totalAmount = monthlyPayment * months;
      const totalInterest = totalAmount - principal;

      setResult({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-blue-100 mr-3">
          <Calculator className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Kalkulator Kredytowy</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Kwota kredytu (PLN)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1000"
            step="1000"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Oprocentowanie roczne (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Okres kredytowania (miesiące)
          </label>
          <input
            type="number"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            min="12"
            step="12"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <p className="text-xs text-slate-500 mt-1">
            {Math.round(parseInt(termMonths) / 12)} lat
          </p>
        </div>

        <button
          onClick={calculateLoan}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Oblicz ratę
        </button>

        {result && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700 mb-1">Miesięczna rata</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(result.monthlyPayment, 'PLN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">Całkowity koszt</p>
                <p className="text-base font-semibold text-slate-900">
                  {formatCurrency(result.totalAmount, 'PLN')}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">Odsetki</p>
                <p className="text-base font-semibold text-red-600">
                  {formatCurrency(result.totalInterest, 'PLN')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}