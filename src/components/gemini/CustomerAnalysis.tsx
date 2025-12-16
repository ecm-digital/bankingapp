import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { Customer, Transaction } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomerAnalysisProps {
  customer: Customer;
  transactions: Transaction[];
}

export function CustomerAnalysis({ customer, transactions }: CustomerAnalysisProps) {
  const { language } = useLanguage();
  const { analyzeCustomer, isLoading, isAvailable } = useGemini();
  const [analysis, setAnalysis] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = async () => {
    setShowAnalysis(true);
    const result = await analyzeCustomer(customer, transactions);
    if (result) {
      setAnalysis(result);
    }
  };

  if (!isAvailable) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-amber-600">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm">
            {language === 'pl' 
              ? 'Analiza AI wymaga skonfigurowanego Gemini API'
              : 'AI analysis requires configured Gemini API'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">
            {language === 'pl' ? 'Analiza AI Klienta' : 'AI Customer Analysis'}
          </h3>
        </div>
        {!showAnalysis && (
          <Button onClick={handleAnalyze} disabled={isLoading} size="sm">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              language === 'pl' ? 'Przeanalizuj' : 'Analyze'
            )}
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-slate-600">
            {language === 'pl' ? 'Analizowanie...' : 'Analyzing...'}
          </span>
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* Summary */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              {language === 'pl' ? 'Podsumowanie' : 'Summary'}
            </h4>
            <p className="text-sm text-slate-600">{analysis.summary}</p>
          </div>

          {/* Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                {language === 'pl' ? 'Wnioski' : 'Insights'}
              </h4>
              <ul className="space-y-1">
                {analysis.insights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                {language === 'pl' ? 'Rekomendacje' : 'Recommendations'}
              </h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Level */}
          {analysis.riskLevel && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                {language === 'pl' ? 'Poziom Ryzyka' : 'Risk Level'}
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  analysis.riskLevel === 'LOW'
                    ? 'bg-green-100 text-green-700'
                    : analysis.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {analysis.riskLevel}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

