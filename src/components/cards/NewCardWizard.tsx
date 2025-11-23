import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
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
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {['type', 'brand', 'details', 'confirm'].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-primary-500 text-white'
                    : index < ['type', 'brand', 'details', 'confirm'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
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
                  className={`h-1 flex-1 mx-2 ${
                    index < ['type', 'brand', 'details', 'confirm'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'type' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Wybierz typ karty</h3>
            <div className="space-y-3">
              {(['DEBIT', 'CREDIT', 'PREPAID'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCardType(type)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    cardType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">
                    {type === 'DEBIT' ? 'Karta Debetowa' :
                     type === 'CREDIT' ? 'Karta Kredytowa' : 'Karta Przedpłacona'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
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
            <h3 className="text-lg font-medium text-gray-900">Wybierz markę karty</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['VISA', 'MASTERCARD', 'AMEX'] as const).map((brand) => (
                <button
                  key={brand}
                  onClick={() => setCardBrand(brand)}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    cardBrand === brand
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-center font-medium text-gray-900">{brand}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Szczegóły karty</h3>
            
            {cardType === 'CREDIT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limit kredytowy (PLN)
                </label>
                <Input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  min="1000"
                  max="50000"
                  step="1000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimalny limit: 1,000 PLN, Maksymalny limit: 50,000 PLN
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Podsumowanie:</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Typ karty:</dt>
                  <dd className="font-medium text-gray-900">
                    {cardType === 'DEBIT' ? 'Debetowa' :
                     cardType === 'CREDIT' ? 'Kredytowa' : 'Przedpłacona'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Marka:</dt>
                  <dd className="font-medium text-gray-900">{cardBrand}</dd>
                </div>
                {cardType === 'CREDIT' && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Limit:</dt>
                    <dd className="font-medium text-gray-900">
                      {parseFloat(creditLimit).toLocaleString('pl-PL')} PLN
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Potwierdź wniosek</h3>
              <p className="text-sm text-gray-500 mt-2">
                Sprawdź wszystkie dane przed złożeniem wniosku
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID Klienta:</span>
                <span className="text-sm font-mono font-medium text-gray-900">{customerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Typ karty:</span>
                <span className="text-sm font-medium text-gray-900">
                  {cardType === 'DEBIT' ? 'Debetowa' :
                   cardType === 'CREDIT' ? 'Kredytowa' : 'Przedpłacona'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Marka:</span>
                <span className="text-sm font-medium text-gray-900">{cardBrand}</span>
              </div>
              {cardType === 'CREDIT' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Limit kredytowy:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {parseFloat(creditLimit).toLocaleString('pl-PL')} PLN
                  </span>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Uwaga:</strong> Wniosek zostanie przesłany do weryfikacji.
                Karta zostanie wydana w ciągu 5-7 dni roboczych.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="secondary"
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
          >
            {step === 'type' ? 'Anuluj' : 'Wstecz'}
          </Button>

          <Button
            variant="primary"
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
          >
            {step === 'confirm' ? 'Złóż Wniosek' : 'Dalej'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
