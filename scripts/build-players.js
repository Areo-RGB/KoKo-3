// Build a unified players.json from existing data files
// Sources:
// - data/performance/yoyo-ir1-data.json
// - data/performance/jonglieren-data.json
// - data/sports/sports-data.json
// - data/data-table-demo/players.json (teams/categories)

const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\p{Diacritic}]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function toIsoFromGerman(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const m = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function parseScoreString(score) {
  // Converts e.g. '3,68s' -> { value: 3.68, unit: 's' }
  if (typeof score !== 'string') return { value: null, unit: '' };
  const unitMatch = score.match(/[a-zA-Z\.]+$/);
  const unit = unitMatch ? unitMatch[0] : '';
  const numStr = score.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = parseFloat(numStr);
  return { value: Number.isFinite(value) ? value : null, unit };
}

function main() {
  const base = process.cwd();
  const pYoYo = path.join(base, 'data', 'performance', 'yoyo-ir1-data.json');
  const pJong = path.join(base, 'data', 'performance', 'jonglieren-data.json');
  const pSports = path.join(base, 'data', 'sports', 'sports-data.json');
  const pTeams = path.join(base, 'data', 'data-table-demo', 'players.json');
  const oUnified = path.join(base, 'data', 'players', 'players.json');

  const yoyo = fs.existsSync(pYoYo) ? readJson(pYoYo) : [];
  const jong = fs.existsSync(pJong) ? readJson(pJong) : [];
  const sports = fs.existsSync(pSports) ? readJson(pSports) : [];
  const teams = fs.existsSync(pTeams) ? readJson(pTeams) : {};

  // Alias map for fixing typos/variants
  const ALIASES = {
    Behrat: 'Berat',
  };

  const playersMap = new Map(); // name -> player object
  const ensure = (rawName) => {
    const canonical = ALIASES[rawName] || rawName;
    if (!playersMap.has(canonical)) {
      playersMap.set(canonical, {
        id: slugify(canonical),
        name: canonical,
        aliases: canonical !== rawName ? [rawName] : [],
        team: null,
        videos: {},
        results: {},
      });
    } else if (canonical !== rawName) {
      const p = playersMap.get(canonical);
      if (!p.aliases.includes(rawName)) p.aliases.push(rawName);
    }
    return playersMap.get(canonical);
  };

  // Merge YoYo
  yoyo.forEach((r) => {
    const p = ensure(r.name);
    const date = toIsoFromGerman(r.date) || null;
    p.results.yoyoIr1 = p.results.yoyoIr1 || [];
    p.results.yoyoIr1.push({ date, value: r.distance ?? null, unit: 'm' });
  });

  // Merge Jonglieren
  jong.forEach((r) => {
    const p = ensure(r.name);
    const date = toIsoFromGerman(r.date) || null;
    p.results.jonglieren = p.results.jonglieren || [];
    p.results.jonglieren.push({
      date,
      value: r.repetitions ?? null,
      unit: 'x',
    });
  });

  // Merge DFB exercises from sports-data (single latest values, string format)
  sports.forEach((exercise) => {
    const exName = exercise.name;
    exercise.data.forEach((e) => {
      const p = ensure(e.name);
      const { value, unit } = parseScoreString(e.score);
      const date = null; // unknown, keep null
      p.results[exName] = p.results[exName] || [];
      p.results[exName].push({
        date,
        value,
        unit: unit || (exName === 'Balljonglieren' ? 'pt' : ''),
      });
      if (e.videoUrl) {
        p.videos[exName] = e.videoUrl;
      }
    });
  });

  // Teams/categories
  const catKeys = ['U11', 'U12', 'U13', 'U14', 'U15'];
  catKeys.forEach((cat) => {
    const arr = teams[cat] || [];
    arr.forEach((name) => {
      const p = ensure(name);
      p.team = p.team || cat; // first assignment wins
    });
  });
  if (Array.isArray(teams.realU12)) {
    teams.realU12.forEach((entry) => {
      const p = ensure(entry.name);
      p.team = p.team || 'U12';
    });
  }

  const unified = {
    players: Array.from(playersMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  };
  writeJson(oUnified, unified);
  console.log('Wrote', oUnified, 'players:', unified.players.length);
}

main();
