/**
 * Parse USA trending searches CSV and produce grouped keywords JSON.
 * Usage:
 *  - Place CSV at ./data/usa-trending.csv
 *  - Run: npm run parse:keywords
 *  - Output: ./lib/usaKeywords.json
 *
 * CSV expectations:
 *  - Columns: keyword, volume, intent, category
 *  - intent/category may be blank; script will infer basic groups by keyword tokens
 */

import fs from 'fs';
import path from 'path';

type Row = { keyword: string; volume?: number; intent?: string; category?: string };

function parseCSV(csv: string): Row[] {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idx = {
    keyword: header.indexOf('keyword'),
    volume: header.indexOf('volume'),
    intent: header.indexOf('intent'),
    category: header.indexOf('category'),
  };
  if (idx.keyword < 0) throw new Error('CSV must include a "keyword" column');
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const keyword = cols[idx.keyword];
    if (!keyword) continue;
    const volume = idx.volume >= 0 ? Number(cols[idx.volume]) || undefined : undefined;
    const intent = idx.intent >= 0 ? cols[idx.intent] || undefined : undefined;
    const category = idx.category >= 0 ? cols[idx.category] || undefined : undefined;
    rows.push({ keyword, volume, intent, category });
  }
  return rows;
}

function groupByIntent(rows: Row[]) {
  const groups = {
    liveSports: [] as Row[],
    tvShows: [] as Row[],
    movies: [] as Row[],
    americanSports: [] as Row[],
  };
  const sportsTokens = ['nfl', 'nba', 'mlb', 'nhl', 'live sports', 'college football', 'march madness'];
  const tvTokens = ['series', 'tv shows', 'show', 'episode'];
  const movieTokens = ['movie', 'movies', 'blockbuster'];

  for (const r of rows) {
    const k = r.keyword.toLowerCase();
    if (sportsTokens.some(t => k.includes(t))) {
      groups.americanSports.push(r);
      groups.liveSports.push(r);
      continue;
    }
    if (tvTokens.some(t => k.includes(t))) {
      groups.tvShows.push(r);
      continue;
    }
    if (movieTokens.some(t => k.includes(t))) {
      groups.movies.push(r);
      continue;
    }
  }
  return groups;
}

function selectTop(rows: Row[], count: number) {
  return [...rows]
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, count)
    .map(r => r.keyword);
}

function main() {
  const csvPath = path.resolve(process.cwd(), 'data', 'usa-trending.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found at', csvPath);
    process.exit(1);
  }
  const csv = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csv);
  const groups = groupByIntent(rows);

  const output = {
    primary: selectTop(rows, 20),
    secondary: selectTop(rows, 50),
    groups: {
      liveSports: selectTop(groups.liveSports, 30),
      tvShows: selectTop(groups.tvShows, 30),
      movies: selectTop(groups.movies, 30),
      americanSports: selectTop(groups.americanSports, 30),
    },
  };

  const outPath = path.resolve(process.cwd(), 'lib', 'usaKeywords.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log('Wrote', outPath);
}

main();
