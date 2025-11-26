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
    // Allow only numbers and decimal point
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
      <h3 className="text-lg font-medium text-white">Wprowadź kwotę transakcji</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kwota
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border ${
                error ? 'border-red-500/50' : 'border-white/10'
              } bg-black/20 text-white text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all placeholder-gray-600`}
              placeholder="0.00"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Waluta
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['PLN', 'EUR', 'USD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`p-3 border rounded-xl font-medium transition-all ${
                  selectedCurrency === curr
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Szybki wybór
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="p-2 border border-white/10 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors"
              >
                {quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!amount || parseFloat(amount) <= 0}
      >
        Dalej
      </button>
    </div>
  );
}