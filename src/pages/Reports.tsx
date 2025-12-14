import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Raporty i Analizy</h1>
        <p className="text-slate-500 mt-1">
          Centrum analityczne i raportowanie wyników
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
        <div className="flex justify-center space-x-4 mb-6">
          <div className="p-4 rounded-full bg-blue-100">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="p-4 rounded-full bg-green-100">
            <PieChart className="h-8 w-8 text-green-600" />
          </div>
          <div className="p-4 rounded-full bg-purple-100">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Moduł Raportów w Przygotowaniu</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Pracujemy nad zaawansowanym systemem raportowania, który pozwoli Ci analizować dane w czasie rzeczywistym.
        </p>
        <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-medium transition-colors flex items-center justify-center mx-auto gap-2">
          <Download className="h-5 w-5" />
          Pobierz przykładowy raport
        </button>
      </div>
    </div>
  );
}