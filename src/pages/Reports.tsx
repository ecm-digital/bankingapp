import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Raporty i Analizy</h1>
        <p className="mt-1 text-sm text-gray-400">
          Centrum analityczne i raportowanie wyników
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-white/10">
        <div className="flex justify-center space-x-4 mb-6">
          <div className="p-4 rounded-full bg-blue-500/10 animate-pulse">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
          <div className="p-4 rounded-full bg-emerald-500/10 animate-pulse delay-75">
            <PieChart className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="p-4 rounded-full bg-purple-500/10 animate-pulse delay-150">
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Moduł Raportów w Przygotowaniu</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Pracujemy nad zaawansowanym systemem raportowania, który pozwoli Ci analizować dane w czasie rzeczywistym.
        </p>
        <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors flex items-center justify-center mx-auto gap-2 group">
          <Download className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          Pobierz przykładowy raport
        </button>
      </div>
    </div>
  );
}