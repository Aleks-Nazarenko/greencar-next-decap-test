import fs from 'fs';
import path from 'path';

export async function getPkwAustauschfilter() {
    const filePath = path.join(process.cwd(), 'public/pkw_austauschfilter.json');

    if (!fs.existsSync(filePath)) {
        console.warn('❗ JSON file not found:', filePath);
        return [];
    }

    const file = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(file);
}
