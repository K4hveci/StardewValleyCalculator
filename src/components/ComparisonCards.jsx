import React from 'react';
import { translations } from '../data/translations';
import { Sparkles, ArrowRight, Clock, ShieldAlert, Award } from 'lucide-react';

export default function ComparisonCards({ 
  selectedItem, 
  selectedQuality, 
  kegRow, 
  jarRow, 
  tillerChecked, 
  artisanChecked, 
  lang 
}) {
  const t = translations[lang];

  // Helper to format processing time
  const formatTime = (minutes) => {
    if (!minutes) return '';
    const isTr = lang === 'tr';
    const dayText = t.days;
    const hourText = t.hours;

    if (minutes === 120) return `2 ${hourText}`;
    if (minutes === 180) return `3 ${hourText}`;
    if (minutes === 600) return `10 ${hourText}`;
    if (minutes === 1750) return `29.2 ${hourText} (~1.1 ${dayText})`;
    if (minutes === 2250) return `37.5 ${hourText} (~1.4 ${dayText})`;
    if (minutes === 4000) return `2.5 ${dayText}`;
    if (minutes === 6000) return `3.75 ${dayText}`;
    if (minutes === 10000) return `6.25 ${dayText}`;

    // fallback
    const days = (minutes / 1600).toFixed(2);
    return `${days} ${dayText} (${minutes} m)`;
  };

  // Helper to calculate pricing
  const calculateStats = (row) => {
    if (!row) return null;
    
    // Tiller profession: +10% to Raw Item Sell Price
    const rawPrice = Math.floor(row.inputPrice * (tillerChecked ? 1.10 : 1.0));
    
    // Artisan profession: +40% to Processed Sell Price
    // Note: Artisan modifier applies to processed artisan goods.
    const processedPrice = Math.floor(row.processedPrice * (artisanChecked ? 1.40 : 1.0));
    
    const profit = processedPrice - rawPrice;
    
    // Recalculate efficiency: g/minute and Approx g/day
    // Productivity (g/minute) = (Profit / processingTime) * 1000
    const productivity = row.processingTime > 0 
      ? (profit / row.processingTime) * 1000 
      : 0;
      
    // Approx g/day = productivity * 1.6
    const approxGDay = Math.round(productivity * 1.6);

    return {
      rawPrice,
      processedPrice,
      profit,
      productivity,
      approxGDay,
      processingTime: row.processingTime
    };
  };

  const kegStats = calculateStats(kegRow);
  const jarStats = calculateStats(jarRow);

  // Determine winner
  let winner = null; // 'keg', 'jar', 'equal', or null
  if (kegStats && jarStats) {
    if (kegStats.profit > jarStats.profit) winner = 'keg';
    else if (jarStats.profit > kegStats.profit) winner = 'jar';
    else winner = 'equal';
  } else if (kegStats) {
    winner = 'keg';
  } else if (jarStats) {
    winner = 'jar';
  }

  // Draw machine vector outlines as background decoration
  const KegIcon = () => (
    <svg className="w-16 h-16 opacity-10 text-text-primary absolute right-4 bottom-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A3,3 0 0,0 9,5V6H7A2,2 0 0,0 5,8V18A2,2 0 0,0 7,20H9V21H15V20H17A2,2 0 0,0 19,18V8A2,2 0 0,0 17,6H15V5A3,3 0 0,0 12,2M12,4A1,1 0 0,1 13,5V6H11V5A1,1 0 0,1 12,4M7,8H17V10H7V8M7,12H17V14H7V12M7,16H17V18H7V16Z" />
    </svg>
  );

  const JarIcon = () => (
    <svg className="w-16 h-16 opacity-10 text-text-primary absolute right-4 bottom-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,8H8V6H16V8M18,3H6C4.89,3 4,3.9 4,5V6C4,6.76 4.43,7.42 5.07,7.75C5.03,7.83 5,7.91 5,8V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V8C19,7.91 18.97,7.83 18.93,7.75C19.57,7.42 20,6.76 20,6V5A2,2 0 0,0 18,3M17,20H7V10H17V20Z" />
    </svg>
  );

  const renderCard = (title, stats, isWinner, type) => {
    if (!stats) {
      return (
        <div className="flex-1 flex flex-col justify-center items-center p-8 rounded-3xl bg-[var(--bg-secondary)]/25 border border-dashed border-[var(--border)]/60 opacity-60 text-center min-h-[320px] transition-theme relative">
          <ShieldAlert size={36} className="text-[var(--text-secondary)]/40 mb-3" />
          <h3 className="font-heading text-lg text-[var(--text-secondary)] font-medium mb-1">{title}</h3>
          <p className="text-xs text-[var(--text-secondary)]/60 max-w-xs">{t.notProcessable}</p>
        </div>
      );
    }

    const highlightClass = isWinner 
      ? 'shadow-[0_0_20px_rgba(34,197,94,0.35)] border-green-500 ring-2 ring-green-500/20 bg-[var(--winner-bg)]'
      : 'border-[var(--card-border)]/80 bg-[var(--bg-secondary)]/40';

    return (
      <div className={`flex-1 flex flex-col p-6 rounded-3xl border transition-theme relative overflow-hidden ${highlightClass}`}>
        
        {/* Decorator background SVGs */}
        {type === 'keg' ? <KegIcon /> : <JarIcon />}

        {/* Winner Header Badge */}
        {isWinner && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Award size={10} />
            <span>{winner === 'equal' ? t.equalProfit : t.winnerTag}</span>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
            {title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]/80 mt-1 flex items-center gap-1">
            <Clock size={12} />
            <span>{t.processingTime}: {formatTime(stats.processingTime)}</span>
          </p>
        </div>

        {/* Price Flow (Raw -> Processed) */}
        <div className="bg-[var(--bg-primary)]/50 rounded-2xl p-4 border border-[var(--border)]/50 mb-4 shadow-inner flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <div className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">{t.rawPrice}</div>
            <div className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{stats.rawPrice}g</div>
          </div>
          
          <div className="text-[var(--text-secondary)]/30">
            <ArrowRight size={18} />
          </div>

          <div className="text-center flex-1">
            <div className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">{t.processedPrice}</div>
            <div className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{stats.processedPrice}g</div>
          </div>
        </div>

        {/* Value Increase / Profit */}
        <div className="mb-5">
          <div className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">{t.profit}</div>
          <div className="text-3xl font-black text-[var(--text-primary)] tracking-tight mt-1 flex items-baseline gap-1">
            <span>{stats.profit >= 0 ? `+${stats.profit}` : stats.profit}</span>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">g</span>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="mt-auto border-t border-[var(--border)]/60 pt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">{t.productivity}</div>
            <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
              {stats.productivity.toFixed(3)} <span className="text-[10px] font-normal text-[var(--text-secondary)]">g/m</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">{t.approxDay}</div>
            <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
              {stats.approxGDay} <span className="text-[10px] font-normal text-[var(--text-secondary)]">g/d</span>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="w-full">
      
      {/* Side-by-Side Comparison Container */}
      {!selectedItem ? (
        <div className="w-full flex flex-col justify-center items-center p-12 rounded-3xl bg-[var(--bg-secondary)]/40 border border-[var(--border)]/60 text-center min-h-[300px] transition-theme">
          <Sparkles size={48} className="text-[var(--accent)]/40 mb-4 animate-pulse" />
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
            {lang === 'tr' ? 'Karşılaştırmaya Başlayın' : 'Start Comparing'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            {t.selectPrompt}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          {renderCard(t.keg, kegStats, winner === 'keg' || winner === 'equal', 'keg')}
          {renderCard(t.jar, jarStats, winner === 'jar' || winner === 'equal', 'jar')}
        </div>
      )}

    </div>
  );
}
