const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const inputPath = path.join(__dirname, '../public/uploads/pkw_austauschfilter.csv');
const outputPath = path.join(__dirname, '../public/pkw_austauschfilter.json');

if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️ CSV file not found: ${inputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify([])); // Write empty list to avoid breaking the app
    process.exit(0);
}

const csv = fs.readFileSync(inputPath, 'utf8').trim();

if (!csv) {
    console.warn(`⚠️ CSV file is empty: ${inputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify([]));
    process.exit(0);
}

const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2));
console.log(`✅ Converted ${inputPath} → ${outputPath}`);
