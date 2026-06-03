import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../data/translations';
import { Search, ChevronDown, Check, Star } from 'lucide-react';

export default function ItemSelector({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  selectedQuality, 
  setSelectedQuality, 
  lang,
  availableQualities 
}) {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(selectedItem || '');
  const containerRef = useRef(null);

  // Sync searchQuery with selectedItem when it changes externally
  useEffect(() => {
    setSearchQuery(selectedItem || '');
  }, [selectedItem]);

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery(selectedItem || ''); // Reset query if not selected
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedItem]);

  const filteredItems = searchQuery.trim() === ''
    ? items
    : items.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const qualities = [
    { id: 'Regular', idTr: 'Normal', label: t.qNormal, color: 'text-text-secondary', starColor: null },
    { id: 'Silver', idTr: 'Gümüş', label: t.qSilver, color: 'text-slate-400', starColor: '#a1a1aa' },
    { id: 'Gold', idTr: 'Altın', label: t.qGold, color: 'text-amber-500', starColor: '#fbbf24' },
    { id: 'Iridium', idTr: 'İridyum', label: t.qIridium, color: 'text-purple-400', starColor: '#c084fc' }
  ];

  // Helper to draw the star badge based on quality
  const renderStar = (qualityId) => {
    if (qualityId === 'Regular') return null;
    let fill = '#9ca3af';
    if (qualityId === 'Gold') fill = '#eab308';
    if (qualityId === 'Iridium') fill = '#a855f7';
    return (
      <svg className="w-4 h-4 inline-block ml-1 shadow-sm" viewBox="0 0 24 24" fill={fill} stroke="none">
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch gap-6 mb-8">
      
      {/* Searchable Dropdown (Combobox) */}
      <div className="flex-1 relative" ref={containerRef}>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-heading tracking-wide">
          {lang === 'tr' ? 'Öge Seçimi' : 'Item Selection'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]/60">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 font-medium transition-theme shadow-sm cursor-pointer"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)]/60 hover:text-[var(--text-primary)]"
          >
            <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="absolute w-full mt-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl py-2 z-40 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[var(--text-secondary)] text-center italic">
                {t.noResults}
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedItem(item);
                    setSearchQuery(item);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-[var(--bg-primary)] transition-colors ${
                    selectedItem === item 
                      ? 'text-[var(--accent)] font-semibold bg-[var(--bg-primary)]/50' 
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span>{item}</span>
                  {selectedItem === item && <Check size={16} className="text-[var(--accent)]" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Segmented Quality Selector */}
      <div className="flex-1 md:flex-initial md:w-96 flex flex-col">
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 font-heading tracking-wide">
          {t.qualityLabel}
        </label>
        <div className="flex bg-[var(--bg-secondary)]/80 p-1 rounded-2xl border border-[var(--border)] shadow-inner flex-grow">
          {qualities.map((q) => {
            const isTr = lang === 'tr';
            // Quality ID in CSV might be in Turkish for Turkish datasets
            const csvQualityId = isTr ? q.idTr : q.id;
            const isAvailable = availableQualities.includes(csvQualityId) || availableQualities.includes(q.id);
            const isSelected = selectedQuality === q.id;

            return (
              <button
                key={q.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && setSelectedQuality(q.id)}
                className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all relative ${
                  isSelected
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md'
                    : isAvailable
                    ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/50 cursor-pointer'
                    : 'text-[var(--text-secondary)]/30 opacity-40 cursor-not-allowed'
                }`}
              >
                <span>{q.label}</span>
                {isAvailable && renderStar(q.id)}
                {!isAvailable && selectedItem && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
