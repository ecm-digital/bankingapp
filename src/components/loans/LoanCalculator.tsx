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
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 mr-3">
          <Calculator className="h-6 w-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Kalkulator Kredytowy</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kwota kredytu (PLN)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1000"
            step="1000"
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Oprocentowanie roczne (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Okres kredytowania (miesiące)
          </label>
          <input
            type="number"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            min="12"
            step="12"
            className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">
            {Math.round(parseInt(termMonths) / 12)} lat
          </p>
        </div>

        <button
          onClick={calculateLoan}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          Oblicz ratę
        </button>

        {result && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-300 mb-1">Miesięczna rata</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(result.monthlyPayment, 'PLN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Całkowity koszt</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(result.totalAmount, 'PLN')}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Odsetki</p>
                <p className="text-lg font-semibold text-emerald-400">
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
