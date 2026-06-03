import fs from 'fs';
import path from 'path';

const SRC_DATA_DIR = './src/data';

// Create src/data directory if it doesn't exist
if (!fs.existsSync(SRC_DATA_DIR)) {
  fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
}

function parseCSV(filePath, isKeg, isTurkish) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Split lines and clean carriage returns
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Determine headers and skip offset
  // English Keg: 2 lines header
  // Turkish Keg: 2 lines header
  // English Jar: 1 line header
  // Turkish Jar: 1 line header
  const skipHeaderLines = isKeg ? 2 : 1;
  const dataLines = lines.slice(skipHeaderLines);

  const items = [];

  for (const line of dataLines) {
    // Simple comma split since names don't have commas
    // Handles fields with quotes (e.g. header had quotes, but check for data line quotes just in case)
    const rawParts = [];
    let currentPart = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        rawParts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    rawParts.push(currentPart.trim());

    if (rawParts.length < 5) continue; // Skip malformed lines

    let item, type, quality, inputPriceStr, processedPriceStr, valueIncreaseStr, productivityStr, approxGDayStr;

    if (isKeg) {
      // Keg Data Columns:
      // EN: Input Item, Quality, Input Item Sell Price, Processed Sell Price, Increase in Value (g), Productivity (g/minute), Approximate g/day [1]
      // TR: Giriş Ögesi, Kalite, Giriş Ürün Satış Fiyatı, İşlenmiş Ürün Satış Fiyatı, Değer Artışı (g), Verimlilik (g/dakika), Yaklaşık g/gün [1]
      item = rawParts[0];
      type = null; // Keg doesn't have type in CSV
      quality = rawParts[1];
      inputPriceStr = rawParts[2];
      processedPriceStr = rawParts[3];
      valueIncreaseStr = rawParts[4];
      productivityStr = rawParts[5];
      approxGDayStr = rawParts[6];
    } else {
      // Jar Data Columns:
      // EN: Input Item, Type, Quality, Input Item Sell Price, Processed Sell Price, Increase in Value (g), Productivity (g/minute), Approximate g/day [1]
      // TR: Giriş Ögesi, Tür, Kalite, Giriş Ürün Satış Fiyatı, İşlenmiş Ürün Satış Fiyatı, Değer Artışı (g), Verimlilik (g/dakika), Yaklaşık g/gün [1]
      item = rawParts[0];
      type = rawParts[1];
      quality = rawParts[2];
      inputPriceStr = rawParts[3];
      processedPriceStr = rawParts[4];
      valueIncreaseStr = rawParts[5];
      productivityStr = rawParts[6];
      approxGDayStr = rawParts[7];
    }

    // Clean brackets/footnotes from numeric values: e.g. "75 [2]" -> 75
    const cleanNumber = (val) => {
      if (!val) return 0;
      const cleanVal = val.split('[')[0].trim().replace(/,/g, '');
      const parsed = parseFloat(cleanVal);
      return isNaN(parsed) ? 0 : parsed;
    };

    const inputPrice = cleanNumber(inputPriceStr);
    const processedPrice = cleanNumber(processedPriceStr);
    const valueIncrease = cleanNumber(valueIncreaseStr);
    const productivity = cleanNumber(productivityStr);
    const approxGDay = cleanNumber(approxGDayStr);

    items.push({
      item,
      type,
      quality,
      inputPrice,
      processedPrice,
      valueIncrease,
      productivity,
      approxGDay
    });
  }

  // Calculate and assign processing time
  // First, group by item name to find any quality with productivity > 0
  const itemTimes = {};
  
  for (const row of items) {
    if (row.productivity > 0 && row.valueIncrease > 0) {
      // processingTime = (valueIncrease / productivity) * 1000
      const calcTime = (row.valueIncrease / row.productivity) * 1000;
      // Snapping to standard Stardew Valley processing times
      const standards = [120, 180, 600, 1750, 2250, 4000, 6000, 10000];
      let snapped = standards[0];
      let minDiff = Math.abs(calcTime - snapped);
      
      for (const std of standards) {
        const diff = Math.abs(calcTime - std);
        if (diff < minDiff) {
          minDiff = diff;
          snapped = std;
        }
      }
      itemTimes[row.item] = snapped;
    }
  }

  // Fallback function for items with 0 productivity or all negative profits
  const getFallbackTime = (itemName, itemType) => {
    const lowerName = itemName.toLowerCase();
    if (isKeg) {
      if (lowerName.includes('coffee') || lowerName.includes('kahve')) return 120;
      if (lowerName.includes('tea') || lowerName.includes('çay')) return 180;
      if (lowerName.includes('honey') || lowerName.includes('bal')) return 600;
      if (lowerName.includes('rice') || lowerName.includes('pirinç')) return 600;
      if (lowerName.includes('wheat') || lowerName.includes('buğday')) return 1750;
      if (lowerName.includes('hops') || lowerName.includes('şerbetçi')) return 2250;
      
      // Check vegetable vs fruit
      const vegetables = ['amaranth', 'artichoke', 'beet', 'bok choy', 'carrot', 'cauliflower', 'corn', 'eggplant', 'fiddlehead fern', 'garlic', 'green bean', 'kale', 'parsnip', 'potato', 'pumpkin', 'radish', 'red cabbage', 'taro root', 'tomato', 'yam',
                          'acı biber', 'bal kabağı', 'brokoli', 'çin lahanası', 'domates', 'eğrelti otu', 'enginar', 'gölevez kökü', 'havuç', 'karnabahar', 'kırmızı lahana', 'lahana', 'mısır', 'pancar', 'patates', 'patlıcan', 'sarımsak', 'tatlı patates', 'turp', 'yaban havucu', 'yeşil fasulye'];
      const isVeg = vegetables.some(v => lowerName.includes(v)) || (itemType && (itemType.toLowerCase().includes('veg') || itemType.toLowerCase().includes('sebze')));
      return isVeg ? 6000 : 10000;
    } else {
      // Preserves Jar
      if (lowerName.includes('sturgeon') || lowerName.includes('mersinbalığı')) return 6000;
      return 4000;
    }
  };

  // Assign processing time to each row
  for (const row of items) {
    row.processingTime = itemTimes[row.item] || getFallbackTime(row.item, row.type);
  }

  return items;
}

// English files
const kegEng = parseCSV('keg_data_eng.csv', true, false);
const jarEng = parseCSV('jar_data_eng.csv', false, false);

// Turkish files
const kegTr = parseCSV('fıcı_deger_tr.csv', true, true);
const jarTr = parseCSV('kavanoz_deger_tr.csv', false, true);

// Write to JSON files
fs.writeFileSync(path.join(SRC_DATA_DIR, 'keg_eng.json'), JSON.stringify(kegEng, null, 2));
fs.writeFileSync(path.join(SRC_DATA_DIR, 'jar_eng.json'), JSON.stringify(jarEng, null, 2));
fs.writeFileSync(path.join(SRC_DATA_DIR, 'keg_tr.json'), JSON.stringify(kegTr, null, 2));
fs.writeFileSync(path.join(SRC_DATA_DIR, 'jar_tr.json'), JSON.stringify(jarTr, null, 2));

console.log('Successfully compiled all CSV datasets to JSON files in src/data/');
