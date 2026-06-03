import React, { useState, useMemo } from 'react';
import { translations } from '../data/translations';
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';

export default function WikiDatabase({ 
  kegData, 
  jarData, 
  tillerChecked, 
  artisanChecked, 
  lang 
}) {
  const t = translations[lang];
  const [activeMachine, setActiveMachine] = useState('keg'); // 'keg' or 'jar'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('profit'); // Default sorting by profit
  const [sortDirection, setSortDirection] = useState('desc'); // Default descending

  const rawData = activeMachine === 'keg' ? kegData : jarData;

  // Process data to apply dynamic formulas for Tiller & Artisan
  const processedData = useMemo(() => {
    return rawData.map(row => {
      const inputPrice = Math.floor(row.inputPrice * (tillerChecked ? 1.10 : 1.0));
      const processedPrice = Math.floor(row.processedPrice * (artisanChecked ? 1.40 : 1.0));
      const profit = processedPrice - inputPrice;
      const productivity = row.processingTime > 0 
        ? (profit / row.processingTime) * 1000 
        : 0;
      const approxGDay = Math.round(productivity * 1.6);

      return {
        ...row,
        // Computed dynamic fields for table
        inputPrice,
        processedPrice,
        profit,
        productivity,
        approxGDay
      };
    });
  }, [rawData, tillerChecked, artisanChecked]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    // Filter
    let result = processedData;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(row => 
        row.item.toLowerCase().includes(q) || 
        (row.type && row.type.toLowerCase().includes(q)) ||
        row.quality.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        // Custom quality sorting order
        if (sortColumn === 'quality') {
          const qualityOrder = {
            'Regular': 0, 'Normal': 0,
            'Silver': 1, 'Gümüş': 1,
            'Gold': 2, 'Altın': 2,
            'Iridium': 3, 'İridyum': 3
          };
          valA = qualityOrder[valA] !== undefined ? qualityOrder[valA] : -1;
          valB = qualityOrder[valB] !== undefined ? qualityOrder[valB] : -1;
        }

        if (typeof valA === 'string') {
          return sortDirection === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          // Numbers
          return sortDirection === 'asc'
            ? valA - valB
            : valB - valA;
        }
      });
    }

    return result;
  }, [processedData, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // default to desc on new column click
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ArrowUpDown size={14} className="text-text-secondary/35 ml-1.5" />;
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} className="text-accent ml-1.5" /> 
      : <ChevronDown size={14} className="text-accent ml-1.5" />;
  };

  // Star badges rendering
  const renderStar = (quality) => {
    const isRegular = quality === 'Regular' || quality === 'Normal';
    if (isRegular) return null;
    let fill = '#9ca3af'; // silver
    if (quality === 'Gold' || quality === 'Altın') fill = '#eab308'; // gold
    if (quality === 'Iridium' || quality === 'İridyum') fill = '#a855f7'; // iridium
    return (
      <svg className="w-3.5 h-3.5 inline-block ml-1 shadow-sm" viewBox="0 0 24 24" fill={fill} stroke="none">
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[var(--bg-secondary)]/40 border border-[var(--border)] rounded-3xl p-6 transition-theme">
      
      {/* Sub-navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border)]/40 pb-4">
        
        {/* Machine Sub-toggles */}
        <div className="flex bg-[var(--bg-primary)]/60 p-1 rounded-xl border border-[var(--border)] shadow-inner self-start">
          <button
            onClick={() => {
              setActiveMachine('keg');
              setSortColumn('profit'); // Reset sort to profit
              setSortDirection('desc');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
              activeMachine === 'keg'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/30'
            }`}
          >
            {t.keg}
          </button>
          <button
            onClick={() => {
              setActiveMachine('jar');
              setSortColumn('profit'); // Reset sort to profit
              setSortDirection('desc');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
              activeMachine === 'jar'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/30'
            }`}
          >
            {t.jar}
          </button>
        </div>

        {/* Database Search filter */}
        <div className="relative md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]/50">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 transition-theme shadow-sm"
            placeholder={t.searchTable}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Header */}
          <thead className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] z-10">
            <tr>
              <th 
                onClick={() => handleSort('item')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnItem}
                  <SortIcon column="item" />
                </div>
              </th>

              {activeMachine === 'jar' && (
                <th 
                  onClick={() => handleSort('type')}
                  className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
                >
                  <div className="flex items-center">
                    {t.columnType}
                    <SortIcon column="type" />
                  </div>
                </th>
              )}

              <th 
                onClick={() => handleSort('quality')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnQuality}
                  <SortIcon column="quality" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('inputPrice')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnRawPrice}
                  <SortIcon column="inputPrice" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('processedPrice')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnProcessedPrice}
                  <SortIcon column="processedPrice" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('profit')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnProfit}
                  <SortIcon column="profit" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('productivity')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnProductivity}
                  <SortIcon column="productivity" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('approxGDay')}
                className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase cursor-pointer hover:bg-[var(--bg-primary)]/60 transition-colors select-none"
              >
                <div className="flex items-center">
                  {t.columnApproxDay}
                  <SortIcon column="approxGDay" />
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border)]/40 text-sm text-[var(--text-primary)]">
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={activeMachine === 'jar' ? 8 : 7}
                  className="px-4 py-8 text-center text-[var(--text-secondary)]/70 italic"
                >
                  {t.noResults}
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-[var(--bg-secondary)]/20 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium">{row.item}</td>
                  {activeMachine === 'jar' && (
                    <td className="px-4 py-3.5 text-[var(--text-secondary)]">{row.type}</td>
                  )}
                  <td className="px-4 py-3.5 flex items-center">
                    <span>{row.quality}</span>
                    {renderStar(row.quality)}
                  </td>
                  <td className="px-4 py-3.5">{row.inputPrice}g</td>
                  <td className="px-4 py-3.5">{row.processedPrice}g</td>
                  <td className={`px-4 py-3.5 font-bold ${
                    row.profit > 0 ? 'text-green-500' : row.profit < 0 ? 'text-red-500' : 'text-[var(--text-secondary)]'
                  }`}>
                    {row.profit >= 0 ? `+${row.profit}` : row.profit}g
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-secondary)]">{row.productivity.toFixed(2)}</td>
                  <td className="px-4 py-3.5 font-medium">{row.approxGDay}g/d</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Table Footer / Counter */}
      <div className="mt-4 flex justify-between items-center text-xs text-[var(--text-secondary)] font-medium">
        <div>
          {lang === 'tr' 
            ? `Toplam: ${filteredAndSortedData.length} öge gösteriliyor` 
            : `Total: Showing ${filteredAndSortedData.length} items`}
        </div>
        <div>
          [1] 1 gün = 1600 dakika / 1 day = 1600 minutes
        </div>
      </div>

    </div>
  );
}
