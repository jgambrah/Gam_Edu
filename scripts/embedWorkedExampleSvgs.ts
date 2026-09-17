import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'payloads', 'topics', 'topic_geometry_and_trigonometry.json');
const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// 1. Basic 7: Add inline SVG to we_geom_b7_01 problem
const b7AngleSvg = `<svg viewBox="0 0 320 120" width="100%" height="110" xmlns="http://www.w3.org/2000/svg" class="my-2"><line x1="20" y1="90" x2="300" y2="90" stroke="#334155" stroke-width="2.5"/><line x1="160" y1="90" x2="240" y2="20" stroke="#2563eb" stroke-width="3"/><path d="M 190 90 A 30 30 0 0 0 181 69" fill="none" stroke="#dc2626" stroke-width="2"/><text x="195" y="80" font-size="12" font-weight="bold" fill="#dc2626">A°</text><path d="M 130 90 A 30 30 0 0 1 181 69" fill="none" stroke="#16a34a" stroke-width="2"/><text x="135" y="80" font-size="12" font-weight="bold" fill="#16a34a">135°</text><circle cx="160" cy="90" r="4" fill="#0f172a"/><text x="155" y="105" font-size="11" fill="#64748b">O</text></svg>`;

payload.levels.b7.workedExamples[0].problem = `In the road intersection diagram, an angle of $135^\\circ$ forms a straight line with an angle marked $A^\\circ$:\n\n${b7AngleSvg}\n\nDetermine the numerical value of angle $A^\\circ$.`;

// 2. Basic 8: Add TV screen right triangle SVG to we_geom_b8_02 problem
const b8ScreenSvg = `<svg viewBox="0 0 320 150" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" class="my-2"><rect x="40" y="20" width="240" height="100" rx="6" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/><line x1="40" y1="120" x2="280" y2="20" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4"/><text x="130" y="65" font-size="12" font-weight="bold" fill="#2563eb">Diagonal c = 41 in.</text><text x="120" y="136" font-size="12" font-weight="bold" fill="#334155">Width a = 40 in.</text><text x="285" y="75" font-size="12" font-weight="bold" fill="#dc2626">Height h = ?</text><rect x="265" y="105" width="15" height="15" fill="none" stroke="#334155" stroke-width="1.5"/></svg>`;

payload.levels.b8.workedExamples[1].problem = `A television screen has a $41\\text{-inch}$ diagonal and a horizontal width of $40\\text{ inches}$:\n\n${b8ScreenSvg}\n\nCalculate the vertical screen height $h$.`;

// 3. Basic 9: Add tower angle of depression SVG to we_geom_b9_01 problem
const b9TowerExampleSvg = `<svg viewBox="0 0 320 160" width="100%" height="150" xmlns="http://www.w3.org/2000/svg" class="my-2"><line x1="60" y1="30" x2="160" y2="30" stroke="#64748b" stroke-dasharray="4" stroke-width="2"/><line x1="60" y1="30" x2="60" y2="130" stroke="#0f172a" stroke-width="4"/><text x="10" y="85" font-size="12" font-weight="bold" fill="#0f172a">Tower (h = ?)</text><line x1="40" y1="130" x2="280" y2="130" stroke="#334155" stroke-width="3"/><text x="105" y="148" font-size="12" font-weight="bold" fill="#334155">Ground Distance = 120m</text><line x1="60" y1="30" x2="240" y2="130" stroke="#2563eb" stroke-width="2.5"/><path d="M 100 30 A 40 40 0 0 1 93 48" fill="none" stroke="#dc2626" stroke-width="2"/><text x="105" y="45" font-size="11" font-weight="bold" fill="#dc2626">45° (Depression)</text><path d="M 200 130 A 40 40 0 0 1 206 111" fill="none" stroke="#16a34a" stroke-width="2"/><text x="155" y="122" font-size="11" font-weight="bold" fill="#16a34a">45° (Elevation)</text><circle cx="240" cy="130" r="5" fill="#e11d48"/><text x="248" y="130" font-size="11" font-weight="bold" fill="#e11d48">Stone</text></svg>`;

payload.levels.b9.workedExamples[0].problem = `The angle of depression of a stone from the top of an observation tower to the ground is $45^\\circ$:\n\n${b9TowerExampleSvg}\n\nIf the stone is $120\\text{ metres}$ away from the base of the tower, find the height of the tower. (Take $\\tan 45^\\circ = 1$).`;

// 4. Basic 9 Question Hard 1 (Hunter on tower 18m)
const b9HunterSvg = `<svg viewBox="0 0 320 160" width="100%" height="150" xmlns="http://www.w3.org/2000/svg" class="my-2"><line x1="60" y1="30" x2="160" y2="30" stroke="#64748b" stroke-dasharray="4" stroke-width="2"/><line x1="60" y1="30" x2="60" y2="130" stroke="#0f172a" stroke-width="4"/><text x="15" y="85" font-size="12" font-weight="bold" fill="#0f172a">Tower (18m)</text><line x1="40" y1="130" x2="280" y2="130" stroke="#334155" stroke-width="3"/><line x1="60" y1="30" x2="240" y2="130" stroke="#2563eb" stroke-width="2.5"/><path d="M 100 30 A 40 40 0 0 1 93 48" fill="none" stroke="#dc2626" stroke-width="2"/><text x="105" y="45" font-size="11" font-weight="bold" fill="#dc2626">30° (Depression)</text><path d="M 200 130 A 40 40 0 0 1 206 111" fill="none" stroke="#16a34a" stroke-width="2"/><text x="160" y="122" font-size="11" font-weight="bold" fill="#16a34a">30° (Elevation)</text><circle cx="240" cy="130" r="5" fill="#e11d48"/><text x="248" y="130" font-size="11" font-weight="bold" fill="#e11d48">Fire</text><text x="130" y="80" font-size="12" font-weight="bold" fill="#2563eb">Direct Distance d = ?</text></svg>`;

payload.levels.b9.practicePool.hard[0].prompt = `A hunter on top of an $18\\text{ m}$ observation tower sees a bush fire at an angle of depression of $30^\\circ$:\n\n${b9HunterSvg}\n\nCalculate the direct distance between the hunter and the fire. (Take $\\sin 30^\\circ = 0.5$).`;

// Dual key mirroring
payload.levels.jhs1 = payload.levels.b7;
payload.levels.jhs2 = payload.levels.b8;
payload.levels.jhs3 = payload.levels.b9;
payload.updatedAt = new Date().toISOString();

// Write back
const dest1 = path.join(__dirname, 'payloads', 'topic_geometry_and_trigonometry.json');
const dest2 = path.join(__dirname, 'payloads', 'topics', 'topic_geometry_and_trigonometry.json');

fs.writeFileSync(dest1, JSON.stringify(payload, null, 2), 'utf-8');
fs.writeFileSync(dest2, JSON.stringify(payload, null, 2), 'utf-8');

console.log('✅ Successfully embedded inline SVGs into Topic 07 worked examples and questions!');
console.log('Document Size:', Buffer.byteLength(JSON.stringify(payload), 'utf8'), 'bytes');
