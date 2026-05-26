import React, { useState } from 'react';
import { ArrowLeft, Check, Plus, Search } from 'lucide-react';
import AppLayout from '../components/app/AppLayout';
import { inspirationLibrary } from '@/data/inspirationLibrary';

const bannerStyle = {
  backgroundColor: '#efc2b6',
  backgroundImage: [
    'linear-gradient(135deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 28px)',
    'linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 28px)'
  ].join(','),
  backgroundSize: '120px 120px'
};

export default function Inspiration() {
  const [search, setSearch] = useState('');
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [shortlistedProducts, setShortlistedProducts] = useState({});

  const filteredInspirations = inspirationLibrary.filter((item) => {
    const haystack = [
      item.title,
      item.category,
      item.segment,
      item.description,
      ...(item.searchTerms || [])
    ].join(' ').toLowerCase();

    return haystack.includes(search.toLowerCase());
  });

  const toggleShortlist = (productId) => {
    setShortlistedProducts((current) => ({
      ...current,
      [productId]: !current[productId]
    }));
  };

  const shortlistedCount = selectedInspiration
    ? selectedInspiration.products.filter((product) => shortlistedProducts[product.id]).length
    : 0;

  return (
    <AppLayout>
      <div className="min-h-full bg-[#f8f4f2]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        {selectedInspiration ? (
          <InspirationDetail
            inspiration={selectedInspiration}
            shortlistedProducts={shortlistedProducts}
            shortlistedCount={shortlistedCount}
            onBack={() => setSelectedInspiration(null)}
            onToggleShortlist={toggleShortlist}
          />
        ) : (
          <InspirationGrid
            search={search}
            results={filteredInspirations}
            onSearchChange={setSearch}
            onSelect={setSelectedInspiration}
          />
        )}
      </div>
    </AppLayout>
  );
}

function InspirationGrid({ search, results, onSearchChange, onSelect }) {
  return (
    <>
      <div className="px-6 py-10 md:py-12 flex justify-center" style={bannerStyle}>
        <div className="w-full max-w-md md:max-w-xl flex items-center gap-0 bg-white shadow-sm overflow-hidden">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="flex-1 h-11 px-4 text-sm outline-none"
            style={{ color: '#333', background: 'transparent' }}
            placeholder="Look for Projects and Designs"
          />
          <button
            type="button"
            className="w-12 h-11 flex items-center justify-center text-white"
            style={{ background: '#111111' }}
            aria-label="Search inspirations"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 md:py-8">
        <h1 className="text-[30px] leading-none font-light mb-3" style={{ color: '#2c2321' }}>
          Inspirations
        </h1>
        <div className="text-[11px] italic underline mb-4" style={{ color: '#c7897e' }}>
          {results.length} Results
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-[#eadad4] bg-white px-6 py-12 text-center">
            <div className="text-lg font-semibold text-slate-900">No matching inspirations found</div>
            <div className="text-sm text-slate-500 mt-2">Try a broader search like kitchen, bathroom, office, or living.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className="text-left bg-white border border-[#e8ddd8] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#efe8e3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="px-3 py-3">
                  <div className="text-[14px] leading-5 font-medium capitalize" style={{ color: '#66514b' }}>
                    {item.title}
                  </div>
                  <div className="flex items-center justify-between mt-2 gap-3">
                    <span className="text-[12px]" style={{ color: '#b59d96' }}>By {item.by}</span>
                    <span className="text-[11px] px-2 py-1 rounded-full" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.08)' }}>
                      {item.productCount} products
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function InspirationDetail({
  inspiration,
  shortlistedProducts,
  shortlistedCount,
  onBack,
  onToggleShortlist
}) {
  return (
    <div className="px-6 py-6 md:py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-slate-900"
        style={{ color: '#6d5a54' }}
      >
        <ArrowLeft size={16} />
        Back to Inspirations
      </button>

      <div className="mt-4">
        <h1 className="text-[30px] leading-none font-light capitalize" style={{ color: '#2c2321' }}>
          {inspiration.title}
        </h1>
        <div className="text-[13px] mt-2" style={{ color: '#b49085' }}>
          {inspiration.category} &gt; {inspiration.segment}
        </div>
        <p className="text-sm mt-5 max-w-3xl leading-6" style={{ color: '#4f433f' }}>
          {inspiration.description}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white border border-[#eadad4] overflow-hidden">
            <div className="aspect-[16/10] bg-[#efe8e3]">
              <img
                src={inspiration.image}
                alt={inspiration.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white border border-[#eadad4] p-5">
            <div className="text-sm font-semibold text-slate-900">Product Mix</div>
            <div className="text-xs text-slate-500 mt-1">
              {inspiration.productCount} products were used across this design.
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {inspiration.productTypes.map((item) => (
                <div
                  key={item.label}
                  className="rounded-full px-3 py-1.5 text-xs font-medium border"
                  style={{ borderColor: '#eddad4', background: '#fcfaf9', color: '#5c4d48' }}
                >
                  {item.label} ({item.count})
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="xl:col-span-1">
          <div className="bg-white border border-[#eadad4] p-5 xl:sticky xl:top-6">
            <button
              type="button"
              className="w-full h-11 border text-sm font-medium transition-colors hover:bg-[#faf5f3]"
              style={{ borderColor: '#dfb7aa', color: '#7a4d42' }}
            >
              Shortlist Products {shortlistedCount > 0 ? `(${shortlistedCount})` : ''}
            </button>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Products</div>
              <div className="text-sm" style={{ color: '#d28376' }}>({inspiration.productCount})</div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {inspiration.productTypes.map((item) => (
                <span
                  key={item.label}
                  className="px-2.5 py-1 rounded-full text-[11px]"
                  style={{ background: '#f8f0ec', color: '#8a6d66' }}
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3 mt-5 max-h-[720px] overflow-y-auto pr-1">
              {inspiration.products.map((product) => {
                const isShortlisted = Boolean(shortlistedProducts[product.id]);

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => onToggleShortlist(product.id)}
                    className="text-left border overflow-hidden transition-all hover:shadow-md"
                    style={{
                      borderColor: isShortlisted ? '#ab00ff' : '#eadad4',
                      background: '#ffffff',
                      boxShadow: isShortlisted ? '0 10px 24px rgba(171, 0, 255, 0.12)' : 'none'
                    }}
                  >
                    <div className="aspect-square relative bg-[#f4efec]">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: isShortlisted ? '#ab00ff' : 'rgba(17,17,17,0.72)',
                          color: '#ffffff'
                        }}
                      >
                        {isShortlisted ? <Check size={12} /> : <Plus size={12} />}
                      </div>
                      <div
                        className="absolute top-2 left-2 px-1.5 py-1 text-[9px] uppercase tracking-wide"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#7a645d' }}
                      >
                        {product.type}
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      <div className="text-[11px] leading-4 font-medium line-clamp-2 text-slate-800">
                        {product.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
