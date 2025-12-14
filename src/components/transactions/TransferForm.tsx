import { useState } from 'react';
import { Transaction } from '@/types';

type TransactionCategory = Transaction['category'];

interface TransferFormProps {
  description: string;
  category: TransactionCategory;
  onChange: (description: string, category: TransactionCategory) => void;
  onNext: () => void;
}

const categories = [
  { value: 'FOOD', label: 'Żywność', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'TRANSPORT', label: 'Transport', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'SHOPPING', label: 'Zakupy', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'BILLS', label: 'Rachunki', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'ENTERTAINMENT', label: 'Rozrywka', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'OTHER', label: 'Inne', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export function TransferForm({ description, category, onChange, onNext }: TransferFormProps) {
  const [desc, setDesc] = useState(description);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>(category);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!desc.trim()) {
      setError('Opis transakcji jest wymagany');
      return;
    }

    if (desc.length < 3) {
      setError('Opis musi mieć co najmniej 3 znaki');
      return;
    }

    onChange(desc, selectedCategory);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Szczegóły transakcji</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Opis transakcji <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
            setError('');
          }}
          placeholder="np. Przelew za zakupy"
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
          } text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-all`}
          maxLength={100}
        />
        <div className="flex justify-between mt-1">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-slate-500 ml-auto">
            {desc.length}/100 znaków
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Kategoria
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value as TransactionCategory)}
              className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Uwaga:</strong> Upewnij się, że wszystkie dane są poprawne przed przejściem dalej.
          Po zatwierdzeniu transakcji nie będzie można jej anulować.
        </p>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!desc.trim()}
      >
        Dalej
      </button>
    </div>
  );
}