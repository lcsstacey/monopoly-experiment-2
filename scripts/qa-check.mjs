import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'script.js');
const htmlPath = path.join(repoRoot, 'index.html');

const js = fs.readFileSync(scriptPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

const marker = 'const START_CASH';
const splitAt = js.indexOf(marker);
if (splitAt === -1) {
  throw new Error('Could not locate START_CASH marker in script.js');
}

const boardChanceSrc = `${js.slice(0, splitAt)}\nreturn { BOARD, CHANCE };`;
const { BOARD, CHANCE } = Function(boardChanceSrc)();

const checks = [];

checks.push({
  ok: Array.isArray(BOARD) && BOARD.length === 40,
  label: `BOARD has 40 spaces (found ${Array.isArray(BOARD) ? BOARD.length : 'invalid'})`,
});

const requiredCorners = ['GO', 'Jail', 'Free Parking', 'Go To Jail'];
checks.push({
  ok: requiredCorners.every((corner) => BOARD.some((space) => space.name === corner)),
  label: 'All core corner spaces exist',
});

checks.push({
  ok: Array.isArray(CHANCE) && CHANCE.length >= 10,
  label: `Chance deck has at least 10 cards (found ${Array.isArray(CHANCE) ? CHANCE.length : 'invalid'})`,
});

const htmlIds = [
  'startBtn',
  'rollBtn',
  'endBtn',
  'board',
  'playersPanel',
  'spaceInspector',
  'rollTotal',
  'fullscreenBtn',
];

const jsGeneratedIds = ['dieOne', 'dieTwo'];

checks.push({
  ok: htmlIds.every((id) => html.includes(`id="${id}"`)),
  label: 'Critical UI IDs exist in index.html',
});

checks.push({
  ok: jsGeneratedIds.every((id) => js.includes(`'${id}'`)),
  label: 'JS-generated element IDs exist in script.js',
});

const failed = checks.filter((c) => !c.ok);
checks.forEach((c) => {
  console.log(`${c.ok ? '✅' : '❌'} ${c.label}`);
});

if (failed.length) {
  process.exitCode = 1;
} else {
  console.log('\nAll QA checks passed.');
}
