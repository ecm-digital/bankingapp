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
  { value: 'FOOD', label: 'Jedzenie', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'TRANSPORT', label: 'Transport', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'SHOPPING', label: 'Zakupy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'BILLS', label: 'Rachunki', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'ENTERTAINMENT', label: 'Rozrywka', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'OTHER', label: 'Inne', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
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
      <h3 className="text-lg font-medium text-white">Szczegóły transakcji</h3>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Opis transakcji *
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
            setError('');
          }}
          placeholder="np. Przelew za zakupy"
          className={`w-full px-4 py-3 rounded-xl border ${
            error ? 'border-red-500/50' : 'border-white/10'
          } bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent placeholder-gray-600 transition-all`}
          maxLength={100}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-red-400 h-4">{error}</p>
          <p className="text-xs text-gray-500">
            {desc.length}/100 znaków
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Kategoria
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value as TransactionCategory)}
              className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? `border-white/20 bg-white/10 shadow-lg`
                  : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <span className={`inline-block px-2 py-1 rounded-lg border ${cat.color} text-xs mb-1`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-300">
          <strong>Uwaga:</strong> Upewnij się, że wszystkie dane są poprawne przed przejściem dalej.
          Po zatwierdzeniu transakcji nie będzie można jej anulować.
        </p>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!desc.trim()}
      >
        Dalej
      </button>
    </div>
  );
}