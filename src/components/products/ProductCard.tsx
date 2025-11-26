import { Sparkles, Info } from 'lucide-react';
import { BankProduct } from '@/types';

interface ProductCardProps {
  product: BankProduct;
  onViewDetails: (product: BankProduct) => void;
  onApply?: (product: BankProduct) => void;
}

const categoryColors = {
  ACCOUNT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LOAN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  INVESTMENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  INSURANCE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const categoryLabels = {
  ACCOUNT: 'Konto',
  LOAN: 'Kredyt',
  INVESTMENT: 'Inwestycja',
  INSURANCE: 'Ubezpieczenie',
};

export function ProductCard({ product, onViewDetails, onApply }: ProductCardProps) {
  return (
    <div className={`glass-panel rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col h-full ${product.isPromotional ? 'border-yellow-500/30' : ''
      }`}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Promotional Badge */}
        {product.isPromotional && (
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">
                Promocja
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors flex-1 mr-2">
              {product.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[product.category]
              }`}>
              {categoryLabels[product.category]}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Interest Rate */}
        {product.interestRate !== undefined && (
          <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-400 mb-1">Oprocentowanie</p>
            <p className="text-2xl font-bold text-white">
              {product.interestRate}%
            </p>
          </div>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-6 flex-1">
            <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Kluczowe cechy:</p>
            <ul className="space-y-2">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
            {product.features.length > 3 && (
              <p className="text-xs text-gray-500 mt-2 pl-3">
                +{product.features.length - 3} więcej
              </p>
            )}
          </div>
        )}

        {/* Promotional Details */}
        {product.isPromotional && product.promotionDetails && (
          <div className="mb-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-yellow-400 mb-1">
              {product.promotionDetails.title}
            </p>
            <p className="text-xs text-yellow-200/80 mb-2">
              {product.promotionDetails.description}
            </p>
            {product.promotionDetails.validUntil && (
              <p className="text-xs text-yellow-500/60">
                Ważne do: {new Date(product.promotionDetails.validUntil).toLocaleDateString('pl-PL')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 mt-auto pt-4 border-t border-white/5">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
          >
            <Info className="h-4 w-4" />
            Szczegóły
          </button>
          {onApply && (
            <button
              onClick={() => onApply(product)}
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              Złóż wniosek
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
