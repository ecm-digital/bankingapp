import { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { ProductCard, ProductDetailsModal } from '@/components/products';
import { useProductsStore } from '@/stores/productsStore';
import { useCustomersStore } from '@/stores/customersStore';
import { BankProduct } from '@/types';

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<BankProduct | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BankProduct['category'] | 'ALL'>('ALL');
  const [showPromotionalOnly, setShowPromotionalOnly] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const { products, fetchProducts, applyForProduct } = useProductsStore();
  const { customers, fetchCustomers } = useCustomersStore();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, [fetchProducts, fetchCustomers]);

  const handleViewDetails = (product: BankProduct) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleApply = async (product: BankProduct) => {
    if (!selectedCustomerId) {
      alert('Proszę wybrać klienta przed złożeniem wniosku');
      return;
    }

    try {
      const result = await applyForProduct(product.id, selectedCustomerId, {
        // Mock application data
        requestedAmount: product.category === 'LOAN' ? 50000 : undefined,
      });

      alert(`Wniosek został złożony!\nNumer wniosku: ${result.applicationId}\nStatus: ${result.status}`);
    } catch (error) {
      alert('Wystąpił błąd podczas składania wniosku');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesPromotional = !showPromotionalOnly || product.isPromotional;

    return matchesSearch && matchesCategory && matchesPromotional;
  });

  const promotionalProducts = filteredProducts.filter(p => p.isPromotional);
  const regularProducts = filteredProducts.filter(p => !p.isPromotional);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Katalog Produktów Bankowych</h1>
        <p className="mt-1 text-sm text-gray-400">
          Przeglądaj i oferuj produkty bankowe klientom
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Klient
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            >
              <option value="" className="bg-[#0f172a]">Wybierz klienta...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id} className="bg-[#0f172a]">
                  {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Szukaj
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kategoria
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as BankProduct['category'] | 'ALL')}
                className="w-full pl-10 px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="ALL" className="bg-[#0f172a]">Wszystkie kategorie</option>
                <option value="ACCOUNT" className="bg-[#0f172a]">Konta</option>
                <option value="LOAN" className="bg-[#0f172a]">Kredyty</option>
                <option value="INVESTMENT" className="bg-[#0f172a]">Inwestycje</option>
                <option value="INSURANCE" className="bg-[#0f172a]">Ubezpieczenia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Promotional Filter */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={showPromotionalOnly}
                onChange={(e) => setShowPromotionalOnly(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <div className="flex items-center ml-3">
              <Sparkles className={`h-4 w-4 mr-2 transition-colors ${showPromotionalOnly ? 'text-yellow-400' : 'text-gray-500'}`} />
              <span className={`text-sm transition-colors ${showPromotionalOnly ? 'text-white' : 'text-gray-400'}`}>
                Pokaż tylko produkty promocyjne
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Znaleziono <strong className="text-white">{filteredProducts.length}</strong> produktów
          {promotionalProducts.length > 0 && (
            <span className="text-yellow-400 ml-2">
              ({promotionalProducts.length} promocyjnych)
            </span>
          )}
        </p>
      </div>

      {/* Promotional Products */}
      {promotionalProducts.length > 0 && !showPromotionalOnly && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 mr-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Produkty Promocyjne</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onApply={selectedCustomerId ? handleApply : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Products */}
      {regularProducts.length > 0 && !showPromotionalOnly && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {promotionalProducts.length > 0 && (
            <h2 className="text-lg font-semibold text-white mb-4 mt-8">Wszystkie Produkty</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onApply={selectedCustomerId ? handleApply : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show all when promotional only filter is active */}
      {showPromotionalOnly && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
              onApply={selectedCustomerId ? handleApply : undefined}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-gray-400">
            Nie znaleziono produktów spełniających kryteria wyszukiwania
          </p>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onApply={selectedCustomerId ? handleApply : undefined}
        />
      )}
    </div>
  );
}