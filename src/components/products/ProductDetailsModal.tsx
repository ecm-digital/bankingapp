import { Check, X, DollarSign, FileText } from 'lucide-react';
import { BankProduct } from '@/types';
import { formatCurrency } from '@/utils';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BankProduct;
  onApply?: (product: BankProduct) => void;
}

export function ProductDetailsModal({ isOpen, onClose, product, onApply }: ProductDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {/* Description */}
          <div>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Interest Rate */}
          {product.interestRate !== undefined && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-emerald-500/20 mr-3">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Oprocentowanie</span>
                </div>
                <span className="text-3xl font-bold text-white">
                  {product.interestRate}%
                </span>
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center uppercase tracking-wider">
              <Check className="h-4 w-4 text-emerald-400 mr-2" />
              Korzyści i cechy
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-emerald-400 mr-2 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          {product.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center uppercase tracking-wider">
                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                Wymagania
              </h4>
              <ul className="space-y-2">
                {product.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-400">
                    <span className="text-gray-600 mr-2 mt-0.5">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fees */}
          {product.fees.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Opłaty</h4>
              <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                {product.fees.map((fee, index) => (
                  <div key={index} className={`flex justify-between items-center p-4 ${index !== product.fees.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div>
                      <p className="font-medium text-white">{fee.name}</p>
                      <p className="text-xs text-gray-500">
                        {fee.frequency === 'MONTHLY' ? 'Miesięcznie' :
                          fee.frequency === 'YEARLY' ? 'Rocznie' : 'Jednorazowo'}
                      </p>
                    </div>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(fee.amount, fee.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promotional Details */}
          {product.isPromotional && product.promotionDetails && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-8 -mt-8" />
              <div className="flex items-start relative z-10">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-yellow-500/20 text-xl">
                    🎉
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-bold text-yellow-400 mb-1">
                    {product.promotionDetails.title}
                  </h4>
                  <p className="text-sm text-yellow-200/80 mb-3">
                    {product.promotionDetails.description}
                  </p>
                  {product.promotionDetails.discountPercentage && (
                    <p className="text-sm font-medium text-yellow-400 mb-1">
                      Rabat: {product.promotionDetails.discountPercentage}%
                    </p>
                  )}
                  {product.promotionDetails.specialOffer && (
                    <p className="text-sm text-yellow-200/60 italic">
                      {product.promotionDetails.specialOffer}
                    </p>
                  )}
                  {product.promotionDetails.validUntil && (
                    <p className="text-xs text-yellow-500/50 mt-3 font-mono">
                      Oferta ważna do: {new Date(product.promotionDetails.validUntil).toLocaleDateString('pl-PL')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex space-x-3 bg-black/20 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
          >
            Zamknij
          </button>
          {onApply && (
            <button
              onClick={() => {
                onApply(product);
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              Złóż wniosek
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
