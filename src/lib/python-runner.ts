/**
 * Runs pupils' Python in the browser (Pyodide) inside a Web Worker.
 *
 * - Free: no AI credits, no server, no Firestore reads.
 * - Real results: the output is what Python actually prints.
 * - Safe for the page: a never-ending loop is stopped after a time limit
 *   (the worker is thrown away and a fresh one is started), so the tab never freezes.
 * - Each run starts with a clean set of variables, so an old run cannot make a new answer "pass".
 */

const PYODIDE_VERSION = '0.25.1';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export type PythonRunOptions = {
  /** Lines fed to input(), one per call. */
  stdin?: string;
  /**
   * When true, never invent fallback inputs ('18', 'blue', 'quit') when supplied stdin is exhausted,
   * and preserve empty supplied lines (e.g. `""` or `"\n"`). Exhausted input signals EOF (EOFError).
   * Defaults to false to preserve legacy Python Academy missions.
   */
  strictInput?: boolean;
  /** A Python expression checked after the program runs, in the program's own variables. */
  validation?: string;
  /** Folder to start in (os.getcwd()). */
  cwd?: string;
  /** Stop the program after this long (milliseconds), not counting package downloads. */
  timeoutMs?: number;
};

/**
 * Builds a deterministic stdin line reader matching the worker's `py.setStdin` contract.
 * Exported for unit tests (sufficient, exhausted, empty supplied lines, and multiline input).
 */
export function createStdinReader(
  stdin: string | undefined,
  strictInput: boolean,
  code: string
): () => string | undefined {
  if (strictInput) {
    // Preserve intentional empty lines; only undefined means zero supplied lines.
    const lines = stdin === undefined ? [] : stdin.replace(/\r\n/g, '\n').split('\n');
    let next = 0;
    return () => {
      if (next < lines.length) return lines[next++];
      return undefined; // Pyodide treats undefined as EOF -> raises EOFError
    };
  }
  const rawStdin = (stdin || '').trim();
  const inputs = rawStdin ? rawStdin.split('\n') : [];
  let next = 0;
  return () => {
    if (next < inputs.length) return inputs[next++];
    next++;
    if (next > 2 && /'quit'|"quit"/.test(code)) return 'quit';
    if (/int\s*\(\s*input|float\s*\(\s*input|old|age|number|tall|many/i.test(code)) return '18';
    return 'blue';
  };
}

export type PythonRunResult = {
  ok: boolean;
  /** Everything the program printed (stdout + stderr), newline-joined. */
  output: string;
  /** A short, pupil-friendly error ("NameError: name 'x' is not defined (line 2)"). */
  error?: string;
  /** Result of `validation` (null when none was given or the program failed). */
  passed: boolean | null;
  /** PNG (base64) of the current Matplotlib figure, if the program drew one. */
  image: string | null;
  timedOut?: boolean;
};

const PYODIDE_BOOTSTRAP = `
import os, sys, json, unittest

os.makedirs('/home/pyodide/text_files', exist_ok=True)
os.makedirs('/home/pyodide/images', exist_ok=True)
os.makedirs('/home/pyodide/pygal/maps', exist_ok=True)
os.makedirs('/home/pyodide/pygame', exist_ok=True)
os.makedirs('/home/pyodide/django/db', exist_ok=True)
os.makedirs('/home/pyodide/django/conf', exist_ok=True)
os.makedirs('/home/pyodide/django/contrib/auth', exist_ok=True)
if '/home/pyodide' not in sys.path:
    sys.path.insert(0, '/home/pyodide')

# 1. Sample text & JSON files from Python Crash Course Cheat Sheet
with open('/home/pyodide/siddhartha.txt', 'w') as _f:
    _f.write("The river is everywhere at the same time.\\nSiddhartha listened to the water.\\nWisdom cannot be imparted.\\n")
with open('/home/pyodide/alice.txt', 'w') as _f:
    _f.write("Alice was beginning to get very tired of sitting by her sister on the bank.\\nDown the rabbit-hole she went!\\n")
with open('/home/pyodide/text_files/alice.txt', 'w') as _f:
    _f.write("Alice was beginning to get very tired of sitting by her sister on the bank.\\nDown the rabbit-hole she went!\\n")
with open('/home/pyodide/moby_dick.txt', 'w') as _f:
    _f.write("Call me Ishmael.\\nSome years ago—never mind how long precisely.\\n")
with open('/home/pyodide/little_women.txt', 'w') as _f:
    _f.write("Christmas won't be Christmas without any presents, grumbled Jo.\\n")
with open('/home/pyodide/numbers.json', 'w') as _f:
    json.dump([2, 3, 5, 7, 11, 13], _f)
with open('/home/pyodide/students.csv', 'w') as _f:
    _f.write("name,subject,score\\nAma,Math,92\\nKofi,Science,88\\nEsi,Coding,97\\nYaw,Math,85\\n")

# 2. Helper modules from Cheat Sheet (pizza.py, car.py, full_names.py, accountant.py)
with open('/home/pyodide/pizza.py', 'w') as _f:
    _f.write('''def make_pizza(size, *toppings):
    """Make a pizza."""
    print("\\nMaking a " + str(size) + " pizza.")
    print("Toppings:")
    for topping in toppings:
        print("- " + str(topping))
''')

with open('/home/pyodide/car.py', 'w') as _f:
    _f.write('''"""Represent gas and electric cars."""
class Car:
    """A simple attempt to model a car."""
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.fuel_capacity = 15
        self.fuel_level = 0
    def fill_tank(self):
        self.fuel_level = self.fuel_capacity
        print("Fuel tank is full.")
    def drive(self):
        print("The car is moving.")
    def update_fuel_level(self, new_level):
        if new_level <= self.fuel_capacity:
            self.fuel_level = new_level
        else:
            print("The tank can't hold that much!")
    def add_fuel(self, amount):
        if self.fuel_level + amount <= self.fuel_capacity:
            self.fuel_level += amount
            print("Added fuel.")
        else:
            print("The tank won't hold that much.")

class Battery:
    """A battery for an electric car."""
    def __init__(self, size=70):
        self.size = size
        self.charge_level = 0
    def get_range(self):
        if self.size == 70:
            return 240
        elif self.size == 85:
            return 270
        return 200

class ElectricCar(Car):
    """A simple model of an electric car."""
    def __init__(self, make, model, year):
        super().__init__(make, model, year)
        self.battery = Battery()
    def charge(self):
        self.battery.charge_level = 100
        print("The vehicle is fully charged.")
    def fill_tank(self):
        print("This car has no fuel tank!")
''')

with open('/home/pyodide/full_names.py', 'w') as _f:
    _f.write('''def get_full_name(first, last, middle=''):
    """Return a full name."""
    if middle:
        full_name = "{0} {1} {2}".format(first, middle, last)
    else:
        full_name = "{0} {1}".format(first, last)
    return full_name.title()
''')

with open('/home/pyodide/accountant.py', 'w') as _f:
    _f.write('''class Accountant:
    """Manage a bank account."""
    def __init__(self, balance=0):
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
    def withdraw(self, amount):
        self.balance -= amount
''')

# 3. Patch unittest.main so student TestCase classes in exec globals run cleanly without SystemExit
def _gam_unittest_main(*args, **kwargs):
    caller_globals = sys._getframe(1).f_globals
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    for _val in list(caller_globals.values()):
        if isinstance(_val, type) and issubclass(_val, unittest.TestCase) and _val is not unittest.TestCase:
            suite.addTests(loader.loadTestsFromTestCase(_val))
    runner = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
    result = runner.run(suite)
    return result

unittest.main = _gam_unittest_main

# 4. Lightweight Pygal shim (renders Line, Bar, XY, World charts via matplotlib & writes SVG)
with open('/home/pyodide/pygal/__init__.py', 'w') as _f:
    _f.write('''class Config:
    def __init__(self, **kw):
        self.show_y_guides = True
        self.width = 800
        self.dots_size = 3
        for k, v in kw.items():
            setattr(self, k, v)

class _BaseChart:
    def __init__(self, *args, **kwargs):
        self.title = kwargs.get('title', '')
        self.x_labels = kwargs.get('x_labels', None)
        self.x_title = kwargs.get('x_title', '')
        self.y_title = kwargs.get('y_title', '')
        self.force_uri_protocol = 'http'
        self.series = []
        self.kind = 'line'
    def add(self, label, values, **kwargs):
        if isinstance(values, dict):
            vals = list(values.values())
            if not self.x_labels:
                self.x_labels = [str(k) for k in values.keys()]
        else:
            vals = list(values)
        self.series.append((label, vals, kwargs))
    def render_to_file(self, filename='chart.svg'):
        with open(filename, 'w') as f:
            f.write('<svg xmlns="http://www.w3.org/2000/svg"><title>' + str(self.title) + '</title></svg>')
        try:
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot as plt
            plt.figure(figsize=(7, 4.2))
            for label, vals, _kw in self.series:
                clean = [v['value'] if isinstance(v, dict) and 'value' in v else v for v in vals]
                if self.kind == 'bar':
                    xs = [str(x) for x in (self.x_labels or range(len(clean)))]
                    plt.bar(xs[:len(clean)], clean, label=label)
                elif self.kind == 'xy' and clean and isinstance(clean[0], (tuple, list)):
                    plt.scatter([p[0] for p in clean], [p[1] for p in clean], label=label)
                else:
                    xs = list(self.x_labels) if self.x_labels and len(list(self.x_labels)) == len(clean) else list(range(len(clean)))
                    plt.plot(xs, clean, marker='o', label=label)
            if self.title: plt.title(self.title)
            if self.x_title: plt.xlabel(self.x_title)
            if self.y_title: plt.ylabel(self.y_title)
            if self.series: plt.legend()
        except Exception:
            pass
        print("Rendered chart to " + str(filename))

class Line(_BaseChart):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.kind = 'line'

class Bar(_BaseChart):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.kind = 'bar'

class XY(_BaseChart):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.kind = 'xy'
''')

with open('/home/pyodide/pygal/style.py', 'w') as _f:
    _f.write('''class Style:
    def __init__(self, **kw):
        self.colors = []
        self.plot_background = '#ffffff'
        self.major_label_font_size = 14
        self.label_font_size = 12
class LightGreenStyle(Style): pass
class LightenStyle(Style):
    def __init__(self, color='#336688', **kw):
        super().__init__(**kw)
        self.base_color = color
''')

with open('/home/pyodide/pygal/maps/__init__.py', 'w') as _f:
    _f.write('')

with open('/home/pyodide/pygal/maps/world.py', 'w') as _f:
    _f.write('''from pygal import _BaseChart
COUNTRIES = {'ca': 'Canada', 'mx': 'Mexico', 'us': 'United States', 'gh': 'Ghana', 'ng': 'Nigeria', 'gb': 'United Kingdom', 'fr': 'France', 'de': 'Germany'}
class World(_BaseChart):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.kind = 'bar'
    def add(self, label, data, **kw):
        if isinstance(data, list):
            super().add(label, {c: 1 for c in data}, **kw)
        else:
            super().add(label, data, **kw)
''')

# 5. Lightweight Pygame shim for browser practice (Rects, Sprites, Collisions, Drawing)
with open('/home/pyodide/pygame/__init__.py', 'w') as _f:
    _f.write('''QUIT = 256
KEYDOWN = 768
KEYUP = 769
MOUSEBUTTONDOWN = 1025
K_RIGHT = 1073741903
K_LEFT = 1073741904
K_SPACE = 32
K_q = 113

class Rect:
    def __init__(self, left, top, width, height):
        self.x = int(left)
        self.y = int(top)
        self.width = int(width)
        self.height = int(height)
    @property
    def left(self): return self.x
    @left.setter
    def left(self, v): self.x = int(v)
    @property
    def right(self): return self.x + self.width
    @property
    def top(self): return self.y
    @top.setter
    def top(self, v): self.y = int(v)
    @property
    def bottom(self): return self.y + self.height
    @property
    def centerx(self): return self.x + self.width // 2
    @centerx.setter
    def centerx(self, v): self.x = int(v) - self.width // 2
    @property
    def centery(self): return self.y + self.height // 2
    @centery.setter
    def centery(self, v): self.y = int(v) - self.height // 2
    @property
    def center(self): return (self.centerx, self.centery)
    @center.setter
    def center(self, pt):
        self.centerx, self.centery = pt[0], pt[1]
    @property
    def size(self): return (self.width, self.height)
    @property
    def midbottom(self): return (self.centerx, self.bottom)
    @midbottom.setter
    def midbottom(self, pt):
        self.centerx = pt[0]
        self.y = int(pt[1]) - self.height
    def collidepoint(self, pt):
        px, py = pt[0], pt[1]
        return self.left <= px <= self.right and self.top <= py <= self.bottom
    def colliderect(self, other):
        return not (self.right < other.left or self.left > other.right or self.bottom < other.top or self.top > other.bottom)

class Surface:
    def __init__(self, size=(1200, 800)):
        self._size = size
        self.bg_color = (230, 230, 230)
        self.drawn = []
    def get_rect(self):
        return Rect(0, 0, self._size[0], self._size[1])
    def fill(self, color):
        self.bg_color = color
    def blit(self, img, rect):
        r = rect if isinstance(rect, Rect) else img.get_rect()
        self.drawn.append(('blit', r, getattr(img, 'label', 'sprite')))

_active_screen = Surface((1200, 800))
_caption = "Pygame Window"

def init():
    return (6, 0)

class display:
    @staticmethod
    def set_mode(size=(1200, 800)):
        global _active_screen
        _active_screen = Surface(size)
        return _active_screen
    @staticmethod
    def set_caption(title):
        global _caption
        _caption = str(title)
    @staticmethod
    def flip():
        pass

class draw:
    @staticmethod
    def rect(surface, color, rect):
        surface.drawn.append(('rect', rect, color))

class image:
    @staticmethod
    def load(path):
        s = Surface((60, 48))
        s.label = path
        return s

class _Event:
    def __init__(self, t, key=None):
        self.type = t
        self.key = key

_event_calls = 0
class event:
    @staticmethod
    def get():
        global _event_calls
        _event_calls += 1
        if _event_calls == 1:
            return [_Event(KEYDOWN, K_RIGHT)]
        return [_Event(QUIT)]

class mouse:
    @staticmethod
    def get_pos():
        return (600, 400)
    @staticmethod
    def set_visible(flag):
        pass

class font:
    class SysFont:
        def __init__(self, name, size):
            self.size = size
        def render(self, text, antialias, color, bg=None):
            s = Surface((len(str(text)) * 12, self.size))
            s.label = str(text)
            return s

class _SpriteMod:
    class Sprite:
        def __init__(self):
            self.rect = Rect(0, 0, 16, 16)
        def update(self, *a, **kw):
            pass
    class Group:
        def __init__(self):
            self._items = []
        def add(self, item):
            if item not in self._items:
                self._items.append(item)
        def remove(self, item):
            if item in self._items:
                self._items.remove(item)
        def sprites(self):
            return list(self._items)
        def update(self, *a, **kw):
            for s in list(self._items):
                s.update(*a, **kw)
        def __iter__(self):
            return iter(self._items)
        def __len__(self):
            return len(self._items)
    @staticmethod
    def spritecollideany(sprite, group):
        for g in group:
            if hasattr(sprite, 'rect') and hasattr(g, 'rect') and sprite.rect.colliderect(g.rect):
                return g
        return None
    @staticmethod
    def groupcollide(group1, group2, dokill1, dokill2):
        hits = {}
        for s1 in list(group1):
            for s2 in list(group2):
                if hasattr(s1, 'rect') and hasattr(s2, 'rect') and s1.rect.colliderect(s2.rect):
                    hits.setdefault(s1, []).append(s2)
                    if dokill1: group1.remove(s1)
                    if dokill2: group2.remove(s2)
        return hits

sprite = _SpriteMod()
''')

with open('/home/pyodide/pygame/sprite.py', 'w') as _f:
    _f.write('''from pygame import sprite as _s
Sprite = _s.Sprite
Group = _s.Group
spritecollideany = _s.spritecollideany
groupcollide = _s.groupcollide
''')

# 6. Lightweight Django shim for practicing Models, Views, and URLs in the browser
with open('/home/pyodide/django/__init__.py', 'w') as _f:
    _f.write('')
with open('/home/pyodide/django/db/__init__.py', 'w') as _f:
    _f.write('''class _Field:
    def __init__(self, *a, **kw):
        self.args = a
        self.kwargs = kw
class _QuerySet(list):
    def order_by(self, field):
        rev = str(field).startswith('-')
        key = str(field).lstrip('-')
        return _QuerySet(sorted(self, key=lambda x: getattr(x, key, ''), reverse=rev))
    def filter(self, **kw):
        return _QuerySet([x for x in self if all(getattr(x, k, None) == v for k, v in kw.items())])
class _Manager:
    def __init__(self, cls):
        self.cls = cls
        self._rows = []
    def all(self):
        return _QuerySet(self._rows)
    def get(self, **kw):
        for r in self._rows:
            if all(getattr(r, k, None) == v for k, v in kw.items()):
                return r
        if self._rows:
            return self._rows[0]
        obj = self.cls(id=kw.get('id', 1), text='Chess')
        self._rows.append(obj)
        return obj
    def filter(self, **kw):
        return _QuerySet([r for r in self._rows if all(getattr(r, k, None) == v for k, v in kw.items())])
    def create(self, **kw):
        obj = self.cls(**kw)
        self._rows.append(obj)
        return obj
class _ModelMeta(type):
    def __new__(mcs, name, bases, attrs):
        cls = super().__new__(mcs, name, bases, attrs)
        cls.objects = _Manager(cls)
        return cls
class models:
    CharField = _Field
    TextField = _Field
    DateTimeField = _Field
    ForeignKey = _Field
    class Model(metaclass=_ModelMeta):
        def __init__(self, **kw):
            self.id = kw.get('id', len(self.__class__.objects._rows) + 1)
            for k, v in kw.items():
                setattr(self, k, v)
        def save(self):
            if self not in self.__class__.objects._rows:
                self.__class__.objects._rows.append(self)
        def __repr__(self):
            return f"<{self.__class__.__name__}: {self.__str__()}>"
''')
with open('/home/pyodide/django/shortcuts.py', 'w') as _f:
    _f.write('''def render(request, template_name, context=None):
    return {'template': template_name, 'context': context or {}}
''')
with open('/home/pyodide/django/http.py', 'w') as _f:
    _f.write('''class Http404(Exception): pass
class HttpResponseRedirect(dict):
    def __init__(self, url):
        super().__init__(redirect=url)
''')
with open('/home/pyodide/django/conf/__init__.py', 'w') as _f:
    _f.write('')
with open('/home/pyodide/django/conf/urls.py', 'w') as _f:
    _f.write('''def url(pattern, view, kwargs=None, name=None):
    return {'pattern': pattern, 'view': view, 'name': name}
def include(arg, namespace=None):
    return {'include': arg, 'namespace': namespace}
''')
with open('/home/pyodide/django/contrib/__init__.py', 'w') as _f:
    _f.write('')
with open('/home/pyodide/django/contrib/admin.py', 'w') as _f:
    _f.write('''class _AdminSite:
    def __init__(self):
        self.registered = []
        self.urls = []
    def register(self, model):
        self.registered.append(model)
site = _AdminSite()
''')
with open('/home/pyodide/django/contrib/auth/__init__.py', 'w') as _f:
    _f.write('''def login(request, user): return True
def logout(request): return True
def authenticate(username=None, password=None): return {'username': username}
''')
with open('/home/pyodide/django/contrib/auth/models.py', 'w') as _f:
    _f.write('''from django.db import models
class User(models.Model):
    pass
''')
with open('/home/pyodide/django/contrib/auth/decorators.py', 'w') as _f:
    _f.write('''def login_required(fn):
    fn._login_required = True
    return fn
''')
`;

/**
 * Hard limits applied to learner code and to everything the sandbox sends back.
 * The sandbox is untrusted: pupils can edit and run arbitrary Python, and pasted snippets can come from anywhere.
 */
export const PYTHON_SANDBOX_LIMITS = {
  maxCodeChars: 100_000,
  maxStdinChars: 50_000,
  maxValidationChars: 20_000,
  /** Stdout+stderr kept inside the sandbox; anything beyond is dropped and flagged. */
  maxOutputChars: 200_000,
  maxErrorChars: 2_000,
  maxImageBase64Chars: 8_000_000,
} as const;

/**
 * Content-Security-Policy applied INSIDE the sandbox iframe (the worker inherits it):
 *  - connect-src only the Pyodide CDN path => learner code cannot fetch/XHR/WebSocket anywhere else
 *    (no school API, no attacker server, no PyPI).
 *  - script-src only the Pyodide CDN path + blob: (the worker bootstrap) + eval/wasm that Pyodide itself needs.
 *  - worker-src blob: only; everything else default-src 'none'.
 */
export const PYTHON_SANDBOX_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://cdn.jsdelivr.net/pyodide/`,
  `connect-src https://cdn.jsdelivr.net/pyodide/`,
  "worker-src blob:",
  "img-src data: blob:",
  "style-src 'unsafe-inline'",
  "form-action 'none'",
  "base-uri 'none'",
].join('; ');

const WORKER_SOURCE = `
// Fail closed: the runtime only starts inside a sandbox with an opaque origin. If this worker ever runs with a real
// origin (same-origin as the school app) it could reach cookies, IndexedDB and authenticated APIs, so refuse to start.
if (self.origin !== 'null') {
  postMessage({ type: 'failed', error: 'Python is disabled because the safe sandbox could not be established.' });
  throw new Error('sandbox isolation check failed');
}
importScripts('${PYODIDE_BASE}pyodide.js');
let py = null;
const ready = loadPyodide({ indexURL: '${PYODIDE_BASE}' }).then(async p => {
  py = p;
  await py.runPythonAsync(${JSON.stringify(PYODIDE_BOOTSTRAP)});
  postMessage({ type: 'ready' });
}).catch(e => { postMessage({ type: 'failed', error: String(e && e.message || e) }); });

function friendlyError(msg) {
  const text = String(msg || '');
  const lines = text.split('\\n').map(l => l.trimEnd()).filter(Boolean);
  let lineNo = null;
  for (const l of lines) { const m = l.match(/File "<exec>", line (\\d+)/); if (m) lineNo = m[1]; }
  const last = lines.length ? lines[lines.length - 1] : text;
  return lineNo ? last + ' (line ' + lineNo + ')' : last;
}

onmessage = async (e) => {
  const msg = e.data || {};
  if (msg.type !== 'run') return;
  const { id, code, stdin, strictInput, validation, cwd } = msg;
  await ready;
  if (!py) { postMessage({ type: 'result', id, ok: false, output: '', error: 'Python could not start. Check your internet connection and reload.', passed: null, image: null }); return; }
  const out = [];
  let outLen = 0;
  const MAX_OUT = ${PYTHON_SANDBOX_LIMITS.maxOutputChars};
  const keep = s => {
    if (outLen >= MAX_OUT) return;
    const t = String(s);
    out.push(t); outLen += t.length + 1;
    if (outLen >= MAX_OUT) out.push('[output truncated: too much text]');
  };
  py.setStdout({ batched: keep });
  py.setStderr({ batched: keep });
  if (strictInput) {
    const lines = stdin === undefined ? [] : String(stdin).replace(/\\r\\n/g, '\\n').split('\\n');
    let next = 0;
    py.setStdin({ stdin: () => (next < lines.length ? lines[next++] : undefined) });
  } else {
    const rawStdin = (stdin || '').trim();
    const inputs = rawStdin ? rawStdin.split('\\n') : [];
    let next = 0;
    py.setStdin({ stdin: () => {
      if (next < inputs.length) return inputs[next++];
      next++;
      if (next > 2 && /'quit'|"quit"/.test(code)) return 'quit';
      if (/int\\s*\\(\\s*input|float\\s*\\(\\s*input|old|age|number|tall|many/i.test(code)) return '18';
      return 'blue';
    } });
  }
  let ns = null;
  try {
    await py.loadPackagesFromImports(code);
    const usesPlot = /matplotlib|pygal/.test(code);
    if (usesPlot) await py.loadPackage('matplotlib');
    if (validation) await py.loadPackagesFromImports(validation);
    postMessage({ type: 'started', id });
    ns = py.globals.get('dict')();
    if (usesPlot) await py.runPythonAsync("import matplotlib\\nmatplotlib.use('Agg')\\nimport matplotlib.pyplot as plt\\nplt.close('all')\\nplt.show = lambda *a, **k: None", { globals: ns });
    py.runPython('import os, pygame\\npygame._event_calls = 0\\ntry:\\n    os.chdir(' + JSON.stringify(cwd || '/home/pyodide') + ')\\nexcept Exception:\\n    pass', { globals: ns });
    if (strictInput) {
      py.runPython('import sys\\ndef input(prompt=""):\\n    line = sys.stdin.readline()\\n    if line == "":\\n        raise EOFError("EOF when reading a line")\\n    return line.rstrip("\\\\r\\\\n")\\n', { globals: ns });
    }
    try {
      await py.runPythonAsync(code, { globals: ns });
    } catch (runErr) {
      // Allow sys.exit() inside pygame loops without treating it as a crash
      if (!/SystemExit/.test(String(runErr && runErr.message || runErr))) throw runErr;
    } finally {
      try { py.runPython('import sys\\nsys.stdout.flush()\\nsys.stderr.flush()'); } catch (_) {}
    }
    let passed = null;
    if (validation) {
      try {
        const r = py.runPython(validation, { globals: ns });
        passed = !!(r && typeof r === 'object' && r.toJs ? r.toJs() : r);
        if (r && typeof r === 'object' && r.destroy) r.destroy();
      } catch (ve) { passed = false; }
    }
    let image = null;
    if (usesPlot) {
      image = py.runPython("import io, base64\\nimport matplotlib.pyplot as plt\\n_gam_buf = io.BytesIO()\\nif plt.get_fignums():\\n    plt.savefig(_gam_buf, format='png', bbox_inches='tight')\\nbase64.b64encode(_gam_buf.getvalue()).decode() if _gam_buf.getvalue() else ''", { globals: ns }) || null;
    }
    postMessage({ type: 'result', id, ok: true, output: out.join('\\n'), passed, image });
  } catch (err) {
    postMessage({ type: 'result', id, ok: false, output: out.join('\\n'), error: friendlyError(err && err.message || err), passed: null, image: null });
  } finally {
    try { if (ns) ns.destroy(); } catch (_) {}
  }
};
`;

type Pending = {
  resolve: (r: PythonRunResult) => void;
  timeoutMs: number;
  timer: ReturnType<typeof setTimeout> | null;
};

/**
 * The Python runtime lives in a SANDBOXED IFRAME (sandbox="allow-scripts", never allow-same-origin) whose document
 * carries a restrictive CSP and which starts the Pyodide worker. Because the frame has an opaque origin, learner code
 * cannot read the school app's cookies, IndexedDB (Firebase Auth), Cache Storage or call authenticated same-origin
 * APIs, and the CSP stops it contacting any host except the Pyodide CDN. The page talks to it only through
 * validated postMessage traffic. Removing the iframe is how a runaway program is stopped.
 */
let frame: HTMLIFrameElement | null = null;
let messageListener: ((e: MessageEvent) => void) | null = null;
let readyPromise: Promise<void> | null = null;
let readyListeners: ((ok: boolean) => void)[] = [];
let runSeq = 0;
const pending = new Map<number, Pending>();

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

function buildSandboxDocument(): string {
  // "<" is escaped so the embedded worker source can never close the inline script element early.
  const embedded = JSON.stringify(WORKER_SOURCE).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${PYTHON_SANDBOX_CSP}"></head><body><script>
(function () {
  var w = new Worker(URL.createObjectURL(new Blob([${embedded}], { type: 'application/javascript' })));
  w.onmessage = function (e) { parent.postMessage(e.data, '*'); };
  w.onerror = function (ev) { if (ev && ev.preventDefault) ev.preventDefault(); parent.postMessage({ type: 'crashed' }, '*'); };
  addEventListener('message', function (e) { if (e.source === parent) w.postMessage(e.data); });
})();
</script></body></html>`;
}

/** True when this browser can run Python in a real sandbox. If not, Python is disabled rather than run unsafely. */
export function canRunPythonSafely(): boolean {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false;
  const probe = document.createElement('iframe');
  return 'sandbox' in probe && 'srcdoc' in probe && typeof Worker !== 'undefined';
}

/** Test hooks: the exact worker bootstrap text and the ability to discard the sandbox between tests. */
export const PYTHON_WORKER_SOURCE_FOR_TESTS = WORKER_SOURCE;
export function resetPythonSandbox() {
  failAllPending('Stopped.');
  destroySandbox();
}

function destroySandbox() {
  if (messageListener) window.removeEventListener('message', messageListener);
  messageListener = null;
  try { frame?.remove(); } catch {}
  frame = null;
  readyPromise = null;
}

/** Normalise anything the sandbox sends back: it is untrusted data, never trusted markup. */
function cleanResult(m: any): PythonRunResult {
  const limits = PYTHON_SANDBOX_LIMITS;
  const output = typeof m.output === 'string' ? m.output.slice(0, limits.maxOutputChars + 100) : '';
  const error = typeof m.error === 'string' ? m.error.slice(0, limits.maxErrorChars) : undefined;
  const image =
    typeof m.image === 'string' && m.image.length <= limits.maxImageBase64Chars && BASE64_RE.test(m.image)
      ? m.image
      : null;
  return { ok: m.ok === true, output, error, passed: typeof m.passed === 'boolean' ? m.passed : null, image };
}

function failAllPending(message: string) {
  pending.forEach(p => {
    if (p.timer) clearTimeout(p.timer);
    p.resolve({ ok: false, output: '', passed: null, image: null, error: message });
  });
  pending.clear();
}

function startSandbox() {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts'); // deliberately WITHOUT allow-same-origin
  iframe.setAttribute('referrerpolicy', 'no-referrer');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('title', 'Python sandbox');
  iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  iframe.srcdoc = buildSandboxDocument();

  readyPromise = new Promise<void>((resolve, reject) => {
    let settled = false;
    const failBoot = (errMsg: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(bootTimer);
      if (frame === iframe) destroySandbox();
      reject(new Error(errMsg));
      readyListeners.forEach(f => f(false));
    };
    const bootTimer = setTimeout(() => {
      failBoot('Python runtime took too long to load. Check your internet connection and try again.');
    }, 30000);

    const listener = (e: MessageEvent) => {
      // Only accept messages from OUR sandbox frame, never from any other window.
      if (!frame || e.source !== frame.contentWindow) return;
      const m = e.data;
      if (!m || typeof m !== 'object' || typeof m.type !== 'string') return;
      if (m.type === 'ready') {
        if (!settled) {
          settled = true;
          clearTimeout(bootTimer);
          resolve();
          readyListeners.forEach(f => f(true));
        }
        return;
      }
      if (m.type === 'failed') {
        failBoot(typeof m.error === 'string' ? m.error.slice(0, 300) : 'Python runtime failed to initialize.');
        return;
      }
      if (m.type === 'crashed') {
        // The worker died (for example it ran out of memory): stop everything and start clean next time.
        failAllPending('Your program stopped unexpectedly (it may have used too much memory).');
        if (!settled) failBoot('Python worker failed to load.');
        else destroySandbox();
        return;
      }
      const id = typeof m.id === 'number' ? m.id : NaN;
      const p = pending.get(id);
      if (!p) return;
      if (m.type === 'started') {
        // The clock starts once packages are downloaded.
        p.timer = setTimeout(() => stopRun(id), p.timeoutMs);
        return;
      }
      if (m.type === 'result') {
        if (p.timer) clearTimeout(p.timer);
        pending.delete(id);
        p.resolve(cleanResult(m));
      }
    };
    messageListener = listener;
    window.addEventListener('message', listener);
  });
  readyPromise.catch(() => {});
  frame = iframe;
  document.body.appendChild(iframe);
}

function stopRun(id: number) {
  const p = pending.get(id);
  if (!p) return;
  pending.delete(id);
  // The only way to stop a running Python loop is to destroy the sandbox; a fresh one starts for the next run.
  destroySandbox();
  p.resolve({
    ok: false, output: '', passed: null, image: null, timedOut: true,
    error: 'Your program ran for too long and was stopped. Is there a loop that never ends?',
  });
  failAllPending('Stopped.');
}

/** Start loading Python in the background. Resolves when ready; rejects if it cannot load. */
export function preparePython(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Python needs a browser'));
  if (!canRunPythonSafely()) {
    return Promise.reject(new Error('Python is disabled on this browser because it cannot be run safely.'));
  }
  if (!frame || !readyPromise) startSandbox();
  return readyPromise!;
}

/** Called with true/false each time a (re)started Python finishes loading. */
export function onPythonReady(fn: (ok: boolean) => void) {
  readyListeners.push(fn);
  return () => { readyListeners = readyListeners.filter(f => f !== fn); };
}

export async function runPython(code: string, opts: PythonRunOptions = {}): Promise<PythonRunResult> {
  const limits = PYTHON_SANDBOX_LIMITS;
  if (
    typeof code !== 'string' || code.length > limits.maxCodeChars ||
    (opts.stdin !== undefined && String(opts.stdin).length > limits.maxStdinChars) ||
    (opts.validation !== undefined && String(opts.validation).length > limits.maxValidationChars)
  ) {
    return { ok: false, output: '', passed: null, image: null, error: 'Your program is too long to run here. Please shorten it.' };
  }
  try {
    await preparePython();
  } catch (e) {
    const msg = e instanceof Error && /disabled/i.test(e.message)
      ? e.message
      : 'Python could not start. Check your internet connection and reload the page.';
    return { ok: false, output: '', passed: null, image: null, error: msg };
  }
  const id = ++runSeq;
  return new Promise<PythonRunResult>((resolve) => {
    pending.set(id, { resolve, timeoutMs: opts.timeoutMs ?? 8000, timer: null });
    frame!.contentWindow!.postMessage(
      { type: 'run', id, code, stdin: opts.strictInput ? opts.stdin : (opts.stdin ?? ''), strictInput: Boolean(opts.strictInput), validation: opts.validation, cwd: opts.cwd },
      '*',
    );
  });
}

/** Compare program output with the goal: same lines, ignoring trailing spaces and blank lines at the ends. */
export function outputMatches(actual: string, expected: string): boolean {
  const norm = (s: string) => s.replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
  const a = norm(actual), e = norm(expected);
  if (a === e) return true;
  // Forgive spacing differences only ("Hello  Python" vs "Hello Python"); never extra or missing text.
  return a.replace(/\s+/g, ' ') === e.replace(/\s+/g, ' ');
}
