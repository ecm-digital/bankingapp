import { Check, DollarSign, FileText } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { BankProduct } from '@/types';
import { formatCurrency } from '@/utils';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BankProduct;
  onApply?: (product: BankProduct) => void;
}

export function ProductDetailsModal({ isOpen, onClose, product, onApply }: ProductDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-6">
        {/* Description */}
        <div>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {/* Interest Rate */}
        {product.interestRate !== undefined && (
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Oprocentowanie</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                {product.interestRate}%
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Check className="h-4 w-4 text-green-600 mr-2" />
            Korzyści i cechy
          </h4>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        {product.requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 text-gray-600 mr-2" />
              Wymagania
            </h4>
            <ul className="space-y-2">
              {product.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-gray-400 mr-2 mt-0.5">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fees */}
        {product.fees.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Opłaty</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {product.fees.map((fee, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{fee.name}</p>
                    <p className="text-xs text-gray-500">
                      {fee.frequency === 'MONTHLY' ? 'Miesięcznie' :
                       fee.frequency === 'YEARLY' ? 'Rocznie' : 'Jednorazowo'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(fee.amount, fee.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promotional Details */}
        {product.isPromotional && product.promotionDetails && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-400">
                  <span className="text-lg">🎉</span>
                </span>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                  {product.promotionDetails.title}
                </h4>
                <p className="text-sm text-yellow-800 mb-2">
                  {product.promotionDetails.description}
                </p>
                {product.promotionDetails.discountPercentage && (
                  <p className="text-sm font-medium text-yellow-900">
                    Rabat: {product.promotionDetails.discountPercentage}%
                  </p>
                )}
                {product.promotionDetails.specialOffer && (
                  <p className="text-sm text-yellow-800">
                    {product.promotionDetails.specialOffer}
                  </p>
                )}
                {product.promotionDetails.validUntil && (
                  <p className="text-xs text-yellow-700 mt-2">
                    Oferta ważna do: {new Date(product.promotionDetails.validUntil).toLocaleDateString('pl-PL')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Zamknij
          </Button>
          {onApply && (
            <Button
              variant="primary"
              onClick={() => {
                onApply(product);
                onClose();
              }}
              className="flex-1"
            >
              Złóż wniosek
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
