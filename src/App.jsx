import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ItemSelector from './components/ItemSelector';
import ComparisonCards from './components/ComparisonCards';
import WikiDatabase from './components/WikiDatabase';
import { translations } from './data/translations';

// Datasets
import kegEng from './data/keg_eng.json';
import jarEng from './data/jar_eng.json';
import kegTr from './data/keg_tr.json';
import jarTr from './data/jar_tr.json';

// Hardcoded overrides for items with duplicate prices to avoid mapping ambiguity
const nameMap = {
  // English -> Turkish
  'Apple': 'Elma',
  'Coconut': 'Hindistan Cevizi',
  'Orange': 'Portakal',
  'Apricot': 'Kayısı',
  'Blueberry': 'Yaban Mersini',
  'Beet': 'Pancar',
  'Taro Root': 'Gölevez Kökü',
  'Bok Choy': 'Çin Lahanası',
  'Potato': 'Patates',
  'Carrot': 'Havuç',
  'Parsnip': 'Yaban Havucu',
  'Cherry': 'Kiraz',
  'Grape': 'Üzüm',
  'Spice Berry': 'Baharat Meyvesi',
  'Wild Plum': 'Çakaleriği',
  'Eggplant': 'Patlıcan',
  'Garlic': 'Sarımsak',
  'Tomato': 'Domates',
  'Peach': 'Şeftali',
  'Pomegranate': 'Nar',
  'Radish': 'Turp',
  'Fiddlehead Fern': 'Eğrelti Otu',

  // Turkish -> English
  'Elma': 'Apple',
  'Hindistan Cevizi': 'Coconut',
  'Portakal': 'Orange',
  'Kayısı': 'Apricot',
  'Yaban Mersini': 'Blueberry',
  'Pancar': 'Beet',
  'Gölevez Kökü': 'Taro Root',
  'Çin Lahanası': 'Bok Choy',
  'Patates': 'Potato',
  'Havuç': 'Carrot',
  'Yaban Havucu': 'Parsnip',
  'Kiraz': 'Cherry',
  'Üzüm': 'Grape',
  'Baharat Meyvesi': 'Spice Berry',
  'Çakaleriği': 'Wild Plum',
  'Patlıcan': 'Eggplant',
  'Sarımsak': 'Garlic',
  'Domates': 'Tomato',
  'Şeftali': 'Peach',
  'Nar': 'Pomegranate',
  'Turp': 'Radish',
  'Eğrelti Otu': 'Fiddlehead Fern'
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentTheme, setCurrentTheme] = useState('stardew');
  const [activeTab, setActiveTab] = useState('calculator');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('Regular');
  
  // Professions checkboxes
  const [tillerChecked, setTillerChecked] = useState(false);
  const [artisanChecked, setArtisanChecked] = useState(false);

  const t = translations[lang];

  // Active datasets based on language
  const activeKeg = lang === 'en' ? kegEng : kegTr;
  const activeJar = lang === 'en' ? jarEng : jarTr;

  // List of unique items for searchable dropdown
  const uniqueItemsList = useMemo(() => {
    const set = new Set();
    activeKeg.forEach(r => set.add(r.item));
    activeJar.forEach(r => set.add(r.item));
    return Array.from(set).sort();
  }, [activeKeg, activeJar]);

  // Quality translation helper
  const translateQuality = (q, toLang) => {
    if (toLang === 'tr') {
      if (q === 'Regular') return 'Normal';
      if (q === 'Silver') return 'Gümüş';
      if (q === 'Gold') return 'Altın';
      if (q === 'Iridium') return 'İridyum';
    } else {
      if (q === 'Normal') return 'Regular';
      if (q === 'Gümüş') return 'Silver';
      if (q === 'Altın') return 'Gold';
      if (q === 'İridyum') return 'Iridium';
    }
    return q;
  };

  // Switch selected item translated name when language changes
  useEffect(() => {
    if (!selectedItem) return;

    // 1. Check direct override mapping
    if (nameMap[selectedItem]) {
      setSelectedItem(nameMap[selectedItem]);
      setSelectedQuality(translateQuality(selectedQuality, lang));
      return;
    }

    // 2. Fallback to matching by prices and properties
    const fromKeg = lang === 'en' ? kegTr : kegEng;
    const toKeg = lang === 'en' ? kegEng : kegTr;
    const fromJar = lang === 'en' ? jarTr : jarEng;
    const toJar = lang === 'en' ? jarEng : jarTr;

    const fromItemRow = fromKeg.find(r => r.item === selectedItem) || fromJar.find(r => r.item === selectedItem);
    if (!fromItemRow) {
      setSelectedItem('');
      return;
    }

    // Find row in other language's datasets with same prices and type/quality
    let match = toKeg.find(r => r.inputPrice === fromItemRow.inputPrice && r.processedPrice === fromItemRow.processedPrice);
    if (!match) {
      match = toJar.find(r => r.inputPrice === fromItemRow.inputPrice && r.processedPrice === fromItemRow.processedPrice);
    }

    if (match) {
      setSelectedItem(match.item);
    } else {
      // If no match found, clear selection
      setSelectedItem('');
    }

    // Update quality translation
    setSelectedQuality(translateQuality(selectedQuality, lang));
  }, [lang]);

  // Find rows in dataset for selected item and quality
  const currentKegRow = useMemo(() => {
    if (!selectedItem) return null;
    const csvQuality = lang === 'tr' ? translateQuality(selectedQuality, 'tr') : selectedQuality;
    return activeKeg.find(r => r.item === selectedItem && r.quality === csvQuality);
  }, [selectedItem, selectedQuality, activeKeg, lang]);

  const currentJarRow = useMemo(() => {
    if (!selectedItem) return null;
    const csvQuality = lang === 'tr' ? translateQuality(selectedQuality, 'tr') : selectedQuality;
    return activeJar.find(r => r.item === selectedItem && r.quality === csvQuality);
  }, [selectedItem, selectedQuality, activeJar, lang]);

  // Get list of qualities available in either machine for the selected item
  const availableQualities = useMemo(() => {
    if (!selectedItem) return ['Regular', 'Normal', 'Silver', 'Gümüş', 'Gold', 'Altın', 'Iridium', 'İridyum'];
    
    const qualities = new Set();
    activeKeg.filter(r => r.item === selectedItem).forEach(r => qualities.add(r.quality));
    activeJar.filter(r => r.item === selectedItem).forEach(r => qualities.add(r.quality));
    
    return Array.from(qualities);
  }, [selectedItem, activeKeg, activeJar]);

  // Safety guard: if selected quality is not available for new item, reset to Regular/Normal
  useEffect(() => {
    if (!selectedItem) return;
    
    const isTr = lang === 'tr';
    const regQuality = isTr ? 'Normal' : 'Regular';
    
    // Check if currently selected quality exists in available list
    const hasQuality = availableQualities.some(q => 
      q.toLowerCase() === selectedQuality.toLowerCase() ||
      translateQuality(q, lang === 'en' ? 'tr' : 'en').toLowerCase() === selectedQuality.toLowerCase()
    );

    if (!hasQuality) {
      setSelectedQuality(regQuality);
    }
  }, [selectedItem, availableQualities]);

  return (
    <div className={`theme-${currentTheme} min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme flex flex-col font-sans`}>
      
      {/* Navigation Header */}
      <Header 
        currentTheme={currentTheme} 
        setCurrentTheme={setCurrentTheme} 
        lang={lang} 
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Professions Settings Cards */}
        <div className="w-full bg-[var(--bg-secondary)]/40 border border-[var(--border)] rounded-3xl p-5 mb-8 transition-theme">
          <div className="flex flex-col md:flex-row gap-5 items-stretch">
            
            {/* Tiller Checkbox Card */}
            <label className={`flex-1 flex items-start gap-4 p-4 rounded-2xl border transition-theme cursor-pointer select-none ${
              tillerChecked 
                ? 'bg-[var(--bg-primary)] border-[var(--accent)] shadow-sm' 
                : 'border-[var(--border)]/60 hover:border-[var(--accent)]/40 bg-[var(--bg-secondary)]/20'
            }`}>
              <input 
                type="checkbox" 
                checked={tillerChecked}
                onChange={() => setTillerChecked(!tillerChecked)}
                className="w-5 h-5 mt-0.5 accent-[var(--accent)] rounded border-[var(--border)] cursor-pointer focus:ring-[var(--accent)]/20"
              />
              <div>
                <span className="block font-heading text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                  {t.tillerLabel}
                </span>
                <span className="block text-xs text-[var(--text-secondary)] mt-1">
                  {t.tillerDesc}
                </span>
              </div>
            </label>

            {/* Artisan Checkbox Card */}
            <label className={`flex-1 flex items-start gap-4 p-4 rounded-2xl border transition-theme cursor-pointer select-none ${
              artisanChecked 
                ? 'bg-[var(--bg-primary)] border-[var(--accent)] shadow-sm' 
                : 'border-[var(--border)]/60 hover:border-[var(--accent)]/40 bg-[var(--bg-secondary)]/20'
            }`}>
              <input 
                type="checkbox" 
                checked={artisanChecked}
                onChange={() => setArtisanChecked(!artisanChecked)}
                className="w-5 h-5 mt-0.5 accent-[var(--accent)] rounded border-[var(--border)] cursor-pointer focus:ring-[var(--accent)]/20"
              />
              <div>
                <span className="block font-heading text-sm font-semibold text-[var(--text-primary)] tracking-wide">
                  {t.artisanLabel}
                </span>
                <span className="block text-xs text-[var(--text-secondary)] mt-1">
                  {t.artisanDesc}
                </span>
              </div>
            </label>

          </div>
        </div>

        {/* Dynamic Tab Rendering */}
        {activeTab === 'calculator' ? (
          <div>
            {/* Search Combobox & Quality Segmented Control */}
            <ItemSelector 
              items={uniqueItemsList}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              selectedQuality={selectedQuality}
              setSelectedQuality={setSelectedQuality}
              lang={lang}
              availableQualities={availableQualities}
            />

            {/* Side-by-Side Comparison Cards */}
            <ComparisonCards 
              selectedItem={selectedItem}
              selectedQuality={selectedQuality}
              kegRow={currentKegRow}
              jarRow={currentJarRow}
              tillerChecked={tillerChecked}
              artisanChecked={artisanChecked}
              lang={lang}
            />
          </div>
        ) : (
          /* Wiki Database Table view */
          <WikiDatabase 
            kegData={activeKeg}
            jarData={activeJar}
            tillerChecked={tillerChecked}
            artisanChecked={artisanChecked}
            lang={lang}
          />
        )}

        {/* Informative Footer / Notes Section */}
        <div className="w-full mt-12 bg-[var(--bg-secondary)]/25 border border-[var(--border)]/50 rounded-3xl p-6 transition-theme text-xs text-[var(--text-secondary)]/90">
          <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-3">
            {t.notesTitle}
          </h4>
          <ul className="list-disc pl-5 space-y-2.5 leading-relaxed">
            <li>{t.notesText1}</li>
            <li>{t.notesText2}</li>
            <li>{t.notesText3}</li>
            <li>{t.notesText4}</li>
          </ul>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] bg-[var(--bg-secondary)]/20 transition-theme py-6 text-center text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © 2026 Stardew Valley Calculator. Made for pairs and farmers. By{' '}
            <a 
              href="https://github.com/K4hveci" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent)] transition-colors font-semibold"
            >
              K4hveci
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
