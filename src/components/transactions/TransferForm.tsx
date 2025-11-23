import { useState } from 'react';
import { Input, Button } from '@/components/ui';

interface TransferFormProps {
  description: string;
  category: string;
  onChange: (description: string, category: string) => void;
  onNext: () => void;
}

const categories = [
  { value: 'FOOD', label: 'Jedzenie', color: 'bg-green-100 text-green-800' },
  { value: 'TRANSPORT', label: 'Transport', color: 'bg-blue-100 text-blue-800' },
  { value: 'SHOPPING', label: 'Zakupy', color: 'bg-purple-100 text-purple-800' },
  { value: 'BILLS', label: 'Rachunki', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ENTERTAINMENT', label: 'Rozrywka', color: 'bg-pink-100 text-pink-800' },
  { value: 'OTHER', label: 'Inne', color: 'bg-gray-100 text-gray-800' },
];

export function TransferForm({ description, category, onChange, onNext }: TransferFormProps) {
  const [desc, setDesc] = useState(description);
  const [selectedCategory, setSelectedCategory] = useState(category);
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
      <h3 className="text-lg font-medium text-gray-900">Szczegóły transakcji</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opis transakcji *
        </label>
        <Input
          type="text"
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
            setError('');
          }}
          placeholder="np. Przelew za zakupy"
          error={error}
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500">
          {desc.length}/100 znaków
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Kategoria
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <span className={`inline-block px-2 py-1 rounded ${cat.color} text-xs mb-1`}>
                {cat.label}
              </span>
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

      <Button
        variant="primary"
        onClick={handleNext}
        className="w-full"
        disabled={!desc.trim()}
      >
        Dalej
      </Button>
    </div>
  );
}
