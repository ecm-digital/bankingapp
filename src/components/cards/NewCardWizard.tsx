import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { Modal } from '@/components/ui';
import { Card } from '@/types';

interface NewCardWizardProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  onSubmit: (cardType: Card['cardType'], cardBrand: Card['cardBrand'], creditLimit?: number) => void;
}

export function NewCardWizard({ isOpen, onClose, customerId, onSubmit }: NewCardWizardProps) {
  const [step, setStep] = useState<'type' | 'brand' | 'details' | 'confirm'>('type');
  const [cardType, setCardType] = useState<Card['cardType']>('DEBIT');
  const [cardBrand, setCardBrand] = useState<Card['cardBrand']>('VISA');
  const [creditLimit, setCreditLimit] = useState('5000');

  const handleSubmit = () => {
    const limit = cardType === 'CREDIT' ? parseFloat(creditLimit) : undefined;
    onSubmit(cardType, cardBrand, limit);
    handleClose();
  };

  const handleClose = () => {
    setStep('type');
    setCardType('DEBIT');
    setCardBrand('VISA');
    setCreditLimit('5000');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Wniosek o Nową Kartę">
      <div className="space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between px-2">
          {['type', 'brand', 'details', 'confirm'].map((s, index) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step === s
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                    : index < ['type', 'brand', 'details', 'confirm'].indexOf(step)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}
              >
                {index < ['type', 'brand', 'details', 'confirm'].indexOf(step) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${index < ['type', 'brand', 'details', 'confirm'].indexOf(step)
                      ? 'bg-emerald-500/50'
                      : 'bg-white/10'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'type' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Wybierz typ karty</h3>
            <div className="space-y-3">
              {(['DEBIT', 'CREDIT', 'PREPAID'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCardType(type)}
                  className={`w-full p-4 border rounded-xl text-left transition-all ${cardType === type
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  <p className={`font-medium ${cardType === type ? 'text-emerald-400' : 'text-white'}`}>
                    {type === 'DEBIT' ? 'Karta Debetowa' :
                      type === 'CREDIT' ? 'Karta Kredytowa' : 'Karta Przedpłacona'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {type === 'DEBIT' ? 'Płatności bezpośrednio z konta' :
                      type === 'CREDIT' ? 'Płatności z limitem kredytowym' :
                        'Płatności z załadowanego salda'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'brand' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Wybierz markę karty</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['VISA', 'MASTERCARD', 'AMEX'] as const).map((brand) => (
                <button
                  key={brand}
                  onClick={() => setCardBrand(brand)}
                  className={`p-6 border rounded-xl transition-all flex flex-col items-center justify-center gap-3 ${cardBrand === brand
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  <CreditCard className={`h-8 w-8 ${cardBrand === brand ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <p className={`font-medium ${cardBrand === brand ? 'text-emerald-400' : 'text-white'}`}>{brand}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Szczegóły karty</h3>

            {cardType === 'CREDIT' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Limit kredytowy (PLN)
                </label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  min="1000"
                  max="50000"
                  step="1000"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimalny limit: 1,000 PLN, Maksymalny limit: 50,000 PLN
                </p>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-sm font-medium text-white mb-3">Podsumowanie:</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Typ karty:</dt>
                  <dd className="font-medium text-white">
                    {cardType === 'DEBIT' ? 'Debetowa' :
                      cardType === 'CREDIT' ? 'Kredytowa' : 'Przedpłacona'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Marka:</dt>
                  <dd className="font-medium text-white">{cardBrand}</dd>
                </div>
                {cardType === 'CREDIT' && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Limit:</dt>
                    <dd className="font-medium text-emerald-400">
                      {parseFloat(creditLimit).toLocaleString('pl-PL')} PLN
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Potwierdź wniosek</h3>
              <p className="text-sm text-gray-400 mt-2">
                Sprawdź wszystkie dane przed złożeniem wniosku
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">ID Klienta:</span>
                <span className="text-sm font-mono font-medium text-white">{customerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Typ karty:</span>
                <span className="text-sm font-medium text-white">
                  {cardType === 'DEBIT' ? 'Debetowa' :
                    cardType === 'CREDIT' ? 'Kredytowa' : 'Przedpłacona'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Marka:</span>
                <span className="text-sm font-medium text-white">{cardBrand}</span>
              </div>
              {cardType === 'CREDIT' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Limit kredytowy:</span>
                  <span className="text-sm font-medium text-emerald-400">
                    {parseFloat(creditLimit).toLocaleString('pl-PL')} PLN
                  </span>
                </div>
              )}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-sm text-yellow-200">
                <strong className="text-yellow-100">Uwaga:</strong> Wniosek zostanie przesłany do weryfikacji.
                Karta zostanie wydana w ciągu 5-7 dni roboczych.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => {
              if (step === 'type') {
                handleClose();
              } else if (step === 'brand') {
                setStep('type');
              } else if (step === 'details') {
                setStep('brand');
              } else {
                setStep('details');
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
          >
            {step === 'type' ? 'Anuluj' : 'Wstecz'}
          </button>

          <button
            onClick={() => {
              if (step === 'type') {
                setStep('brand');
              } else if (step === 'brand') {
                setStep('details');
              } else if (step === 'details') {
                setStep('confirm');
              } else {
                handleSubmit();
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            {step === 'confirm' ? 'Złóż Wniosek' : 'Dalej'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
