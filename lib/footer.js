// lib/footer.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getFooterData() {
    const filePath = path.join(process.cwd(), 'content/footer.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data;
}
