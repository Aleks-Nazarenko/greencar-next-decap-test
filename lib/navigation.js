import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getNavigation() {
    const filePath = path.join(process.cwd(), 'content/navi.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data.items || [];
}
