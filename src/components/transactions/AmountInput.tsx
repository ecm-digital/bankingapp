import { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface AmountInputProps {
  value: number;
  currency: string;
  onChange: (amount: number, currency: string) => void;
  onNext: () => void;
}

export function AmountInput({ value, currency, onChange, onNext }: AmountInputProps) {
  const [amount, setAmount] = useState(value.toString());
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleNext = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Kwota musi być większa od 0');
      return;
    }

    if (numAmount > 1000000) {
      setError('Kwota przekracza dzienny limit (1,000,000 PLN)');
      return;
    }

    onChange(numAmount, selectedCurrency);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Wprowadź kwotę transakcji</h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Kwota
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full pl-12 pr-4 py-4 rounded-lg border ${
                error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
              } text-slate-900 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400`}
              placeholder="0.00"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Waluta
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['PLN', 'EUR', 'USD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`p-3 border rounded-lg font-semibold transition-all ${
                  selectedCurrency === curr
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Szybki wybór
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="p-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                {quickAmount.toLocaleString('pl-PL')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!amount || parseFloat(amount) <= 0}
      >
        Dalej
      </button>
    </div>
  );
}