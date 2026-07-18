import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const outDir = path.resolve(__dirname, '../src/data');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function parseCSV(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${filePath}`);
      return [];
  }
  const file = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(file, { header: true, skipEmptyLines: true }).data;
}

const companies = parseCSV('psx_kmi_companies.csv');
const reits = parseCSV('psx_kmi_reits.csv');
const etfs = parseCSV('psx_kmi_etfs.csv');
const pending = parseCSV('psx_kmi_pending_and_changes.csv');
const recomposition = parseCSV('psx_kmi_recomposition_changes.csv');

// We combine them for easier searching, injecting a category
const universe = [
  ...companies.map(c => ({ ...c, category: 'Company' })),
  ...reits.map(r => ({ ...r, category: 'REIT' })),
  ...etfs.map(e => ({ ...e, category: 'ETF' })),
  ...pending.map(p => ({ ...p, category: 'Pending' }))
];

const data = {
  universe,
  recomposition
};

const outPath = path.join(outDir, 'shariah_data.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`Successfully generated ${outPath} with ${universe.length} items and ${recomposition.length} recomposition changes.`);
