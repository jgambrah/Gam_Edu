// Synthetic, isolated test harness for the Python-sandbox audit. Contains NO real data.
// victim origin  : http://localhost:4173  (stands in for the GAM EDU origin: cookie + IndexedDB + API)
// attacker origin: http://localhost:4174  (logs any request that reaches it = exfiltration evidence)
const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const hits = [];

const victim = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:4173');
  if (url.pathname === '/api/whoami') {
    const cookie = req.headers.cookie || '';
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ user: 'SYNTHETIC-STUDENT', cookieSeen: cookie, origin: req.headers.origin || null }));
  }
  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html', 'set-cookie': 'session=SYNTHETIC-SESSION-TOKEN; Path=/; HttpOnly; SameSite=Lax' });
    return res.end('<h1>victim origin</h1>');
  }
  const file = path.join(dir, path.basename(url.pathname));
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const type = file.endsWith('.js') ? 'application/javascript' : 'text/html';
    res.writeHead(200, { 'content-type': type });
    return res.end(fs.readFileSync(file));
  }
  res.writeHead(404); res.end('not found');
});

const attacker = http.createServer((req, res) => {
  hits.push({ url: req.url, origin: req.headers.origin || null, cookie: req.headers.cookie || null, t: Date.now() });
  res.writeHead(200, { 'access-control-allow-origin': '*', 'content-type': 'text/plain' });
  res.end('ok');
});
const control = http.createServer((req, res) => {
  if (req.url === '/reset') hits.length = 0; // lets automated runs start from a clean attacker log
  res.writeHead(200, { 'access-control-allow-origin': '*', 'content-type': 'application/json' });
  res.end(JSON.stringify(hits));
});
victim.listen(4173); attacker.listen(4174); control.listen(4175);
console.log('probe servers up: 4173 victim, 4174 attacker, 4175 attacker-log');
