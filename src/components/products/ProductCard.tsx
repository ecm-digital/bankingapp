import { Sparkles, Info } from 'lucide-react';
import { BankProduct } from '@/types';

interface ProductCardProps {
  product: BankProduct;
  onViewDetails: (product: BankProduct) => void;
  onApply?: (product: BankProduct) => void;
}

const categoryColors = {
  ACCOUNT: 'bg-blue-100 text-blue-700',
  LOAN: 'bg-green-100 text-green-700',
  INVESTMENT: 'bg-purple-100 text-purple-700',
  INSURANCE: 'bg-orange-100 text-orange-700',
};

const categoryLabels = {
  ACCOUNT: 'Konto',
  LOAN: 'Kredyt',
  INVESTMENT: 'Inwestycja',
  INSURANCE: 'Ubezpieczenie',
};

export function ProductCard({ product, onViewDetails, onApply }: ProductCardProps) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full ${product.isPromotional ? 'border-amber-300' : 'border-slate-200'}`}>
      <div className="p-5 flex-1 flex flex-col">
        {/* Promotional Badge */}
        {product.isPromotional && (
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Promocja
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold text-slate-900 flex-1 mr-2">
              {product.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[product.category]}`}>
              {categoryLabels[product.category]}
            </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Interest Rate */}
        {product.interestRate !== undefined && (
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-0.5">Oprocentowanie</p>
            <p className="text-2xl font-bold text-slate-900">
              {product.interestRate}%
            </p>
          </div>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-4 flex-1">
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Kluczowe cechy:</p>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">•</span>
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
            {product.features.length > 3 && (
              <p className="text-xs text-slate-400 mt-1 pl-3">
                +{product.features.length - 3} więcej
              </p>
            )}
          </div>
        )}

        {/* Promotional Details */}
        {product.isPromotional && product.promotionDetails && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">
              {product.promotionDetails.title}
            </p>
            <p className="text-xs text-amber-600 mb-1">
              {product.promotionDetails.description}
            </p>
            {product.promotionDetails.validUntil && (
              <p className="text-xs text-amber-500">
                Ważne do: {new Date(product.promotionDetails.validUntil).toLocaleDateString('pl-PL')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 mt-auto pt-4 border-t border-slate-200">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            <Info className="h-4 w-4" />
            Szczegóły
          </button>
          {onApply && (
            <button
              onClick={() => onApply(product)}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Złóż wniosek
            </button>
          )}
        </div>
      </div>
    </div>
  );
}