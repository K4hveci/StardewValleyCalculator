import React, { useState, useRef, useEffect } from 'react';
import { npcThemes } from '../data/npcThemes';
import { translations } from '../data/translations';
import { Globe, Palette, ExternalLink, Calculator, Database, HelpCircle } from 'lucide-react';

export default function Header({ currentTheme, setCurrentTheme, lang, setLang, activeTab, setActiveTab }) {
  const t = translations[lang];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const wikiUrl = lang === 'tr' 
    ? 'https://tr.stardewvalleywiki.com/Stardew_Valley_Wiki' 
    : 'https://stardewvalleywiki.com/Stardew_Valley_Wiki';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme circles for visual indicator in dropdown
  const themeColors = {
    stardew: 'bg-[#d48325]',
    abigail: 'bg-[#905cf6]',
    sebastian: 'bg-[#4f46e5]',
    emily: 'bg-[#ef4444]',
    leah: 'bg-[#854d0e]',
    penny: 'bg-[#ea580c]',
    robin: 'bg-[#dc2626]',
    sam: 'bg-[#ea580c]',
    lewis: 'bg-[#ca8a04]'
  };

  const selectedThemeObj = npcThemes.find(theme => theme.id === currentTheme) || npcThemes[0];

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg-secondary)]/40 backdrop-blur-md sticky top-0 z-50 transition-theme px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-[var(--bg-primary)] shadow-lg border border-[var(--card-border)]/30">
            <span className="font-heading text-xl font-bold tracking-tight">SV</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-wide m-0 leading-none">
              {t.appTitle}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
              {t.appSub}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[var(--bg-secondary)]/80 p-1 rounded-xl border border-[var(--border)] shadow-inner">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'calculator'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/50'
            }`}
          >
            <Calculator size={16} />
            {t.tabCalculator}
          </button>
          <button
            onClick={() => setActiveTab('wiki')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'wiki'
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/50'
            }`}
          >
            <Database size={16} />
            {t.tabWiki}
          </button>
        </div>

        {/* Settings and Switchers */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          
          {/* Theme Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] text-sm font-medium shadow-sm transition-theme cursor-pointer"
            >
              <Palette size={16} className="text-[var(--text-secondary)]" />
              <span>{lang === 'tr' ? selectedThemeObj.nameTr : selectedThemeObj.nameEng}</span>
              <span className={`w-3.5 h-3.5 rounded-full border border-[var(--bg-primary)] ${themeColors[selectedThemeObj.id]}`}></span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {t.themeLabel}
                </div>
                {npcThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[var(--bg-primary)] transition-colors ${
                      currentTheme === theme.id 
                        ? 'text-[var(--accent)] font-semibold bg-[var(--bg-primary)]/50' 
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{lang === 'tr' ? theme.nameTr : theme.nameEng}</span>
                    <span className={`w-3 h-3 rounded-full border border-[var(--bg-primary)] ${themeColors[theme.id]}`}></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] text-sm font-medium shadow-sm transition-theme cursor-pointer"
          >
            <Globe size={16} className="text-[var(--text-secondary)]" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Official Wiki Button */}
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-hover)] hover:text-[var(--bg-primary)] text-sm font-medium shadow-md transition-theme cursor-pointer"
          >
            <span>{t.officialWiki}</span>
            <ExternalLink size={14} />
          </a>

        </div>

      </div>
    </header>
  );
}
