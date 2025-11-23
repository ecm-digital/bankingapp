import { Sparkles, Info } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { BankProduct } from '@/types';

interface ProductCardProps {
  product: BankProduct;
  onViewDetails: (product: BankProduct) => void;
  onApply?: (product: BankProduct) => void;
}

const categoryColors = {
  ACCOUNT: 'bg-blue-100 text-blue-800',
  LOAN: 'bg-green-100 text-green-800',
  INVESTMENT: 'bg-purple-100 text-purple-800',
  INSURANCE: 'bg-orange-100 text-orange-800',
};

const categoryLabels = {
  ACCOUNT: 'Konto',
  LOAN: 'Kredyt',
  INVESTMENT: 'Inwestycja',
  INSURANCE: 'Ubezpieczenie',
};

export function ProductCard({ product, onViewDetails, onApply }: ProductCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${
      product.isPromotional ? 'border-2 border-yellow-400' : ''
    }`}>
      <CardContent className="p-6">
        {/* Promotional Badge */}
        {product.isPromotional && (
          <div className="flex items-center mb-3">
            <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-xs font-semibold text-yellow-700 uppercase">
              Promocja
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {product.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[product.category]
            }`}>
              {categoryLabels[product.category]}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Interest Rate */}
        {product.interestRate !== undefined && (
          <div className="mb-4 bg-primary-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Oprocentowanie</p>
            <p className="text-2xl font-bold text-primary-600">
              {product.interestRate}%
            </p>
          </div>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Kluczowe cechy:</p>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
            {product.features.length > 3 && (
              <p className="text-xs text-gray-500 mt-1">
                +{product.features.length - 3} więcej
              </p>
            )}
          </div>
        )}

        {/* Promotional Details */}
        {product.isPromotional && product.promotionDetails && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-900 mb-1">
              {product.promotionDetails.title}
            </p>
            <p className="text-xs text-yellow-700">
              {product.promotionDetails.description}
            </p>
            {product.promotionDetails.validUntil && (
              <p className="text-xs text-yellow-600 mt-1">
                Ważne do: {new Date(product.promotionDetails.validUntil).toLocaleDateString('pl-PL')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(product)}
            className="flex-1"
          >
            <Info className="h-4 w-4 mr-2" />
            Szczegóły
          </Button>
          {onApply && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApply(product)}
              className="flex-1"
            >
              Złóż wniosek
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
