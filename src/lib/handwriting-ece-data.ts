// Early Childhood Education (ECE) Handwriting Stroke Catalog
// Normalized to virtual coordinate box: viewBox="0 0 100 100"
// Three-line classroom grid:
// Sky line: y = 20
// Midline (belt): y = 50
// Baseline (ground): y = 80
// Worm line (descender): y = 95

export interface StrokeWaypoint {
  x: number; // 0 - 100
  y: number; // 0 - 100
}

export interface LetterStroke {
  id: number;
  order: number;
  startLabel: string; // e.g. "1", "2", "3"
  points: StrokeWaypoint[];
  guidePath: string; // SVG path string (e.g., "M 50 15 L 20 85")
  arrowAngle?: number; // Directional orientation in degrees
}

export interface LetterData {
  char: string;
  isInfantForm: boolean; // Single-story infant forms (e.g., 'ɑ')
  phonemeSound: string;  // e.g. "/æ/"
  strokes: LetterStroke[];
}

// Helper to interpolate points along a linear segment
function linePoints(x1: number, y1: number, x2: number, y2: number, count = 6): StrokeWaypoint[] {
  const pts: StrokeWaypoint[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    pts.push({
      x: Math.round(x1 + (x2 - x1) * t),
      y: Math.round(y1 + (y2 - y1) * t)
    });
  }
  return pts;
}

export const ECE_HANDWRITING_CATALOG: Record<string, LetterData> = {
  // ================= UPPERCASE LETTERS =================
  'A': {
    char: 'A',
    isInfantForm: false,
    phonemeSound: '/æ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 20 L 22 80',
        arrowAngle: 115,
        points: linePoints(50, 20, 22, 80, 8)
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 50 20 L 78 80',
        arrowAngle: 65,
        points: linePoints(50, 20, 78, 80, 8)
      },
      {
        id: 3,
        order: 3,
        startLabel: '3',
        guidePath: 'M 35 56 L 65 56',
        arrowAngle: 0,
        points: linePoints(35, 56, 65, 56, 6)
      }
    ]
  },
  'B': {
    char: 'B',
    isInfantForm: false,
    phonemeSound: '/b/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 30 15 L 30 85',
        arrowAngle: 90,
        points: linePoints(30, 15, 30, 85, 8)
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 30 15 C 70 15, 70 50, 35 50',
        arrowAngle: 0,
        points: [
          { x: 30, y: 15 },
          { x: 45, y: 15 },
          { x: 62, y: 20 },
          { x: 70, y: 32 },
          { x: 62, y: 45 },
          { x: 48, y: 50 },
          { x: 35, y: 50 }
        ]
      },
      {
        id: 3,
        order: 3,
        startLabel: '3',
        guidePath: 'M 35 50 C 75 50, 75 85, 30 85',
        arrowAngle: 0,
        points: [
          { x: 35, y: 50 },
          { x: 52, y: 50 },
          { x: 68, y: 56 },
          { x: 75, y: 68 },
          { x: 68, y: 80 },
          { x: 50, y: 85 },
          { x: 30, y: 85 }
        ]
      }
    ]
  },
  'C': {
    char: 'C',
    isInfantForm: false,
    phonemeSound: '/k/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 72 30 C 48 18, 26 34, 26 50 C 26 66, 48 82, 72 70',
        arrowAngle: 195,
        points: [
          { x: 72, y: 30 }, { x: 55, y: 21 }, { x: 38, y: 28 }, { x: 26, y: 45 }, { x: 26, y: 55 }, { x: 38, y: 72 }, { x: 55, y: 79 }, { x: 72, y: 70 }
        ]
      }
    ]
  },
  'D': {
    char: 'D',
    isInfantForm: false,
    phonemeSound: '/d/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 34 20 L 34 80',
        arrowAngle: 90,
        points: linePoints(34, 20, 34, 80, 8)
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 20 C 76 20, 76 80, 34 80',
        arrowAngle: 0,
        points: [
          { x: 34, y: 20 }, { x: 56, y: 20 }, { x: 72, y: 32 }, { x: 75, y: 50 }, { x: 72, y: 68 }, { x: 56, y: 80 }, { x: 34, y: 80 }
        ]
      }
    ]
  },
  'E': {
    char: 'E',
    isInfantForm: false,
    phonemeSound: '/ɛ/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 32 20 L 32 80', arrowAngle: 90, points: linePoints(32, 20, 32, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 32 20 L 72 20', arrowAngle: 0, points: linePoints(32, 20, 72, 20, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 32 50 L 64 50', arrowAngle: 0, points: linePoints(32, 50, 64, 50, 5) },
      { id: 4, order: 4, startLabel: '4', guidePath: 'M 32 80 L 72 80', arrowAngle: 0, points: linePoints(32, 80, 72, 80, 6) }
    ]
  },
  'F': {
    char: 'F',
    isInfantForm: false,
    phonemeSound: '/f/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 34 20 L 72 20', arrowAngle: 0, points: linePoints(34, 20, 72, 20, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 34 50 L 64 50', arrowAngle: 0, points: linePoints(34, 50, 64, 50, 5) }
    ]
  },
  'G': {
    char: 'G',
    isInfantForm: false,
    phonemeSound: '/ɡ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 74 30 C 48 18, 24 34, 24 50 C 24 66, 46 82, 74 80 L 74 54',
        arrowAngle: 195,
        points: [
          { x: 74, y: 30 }, { x: 54, y: 20 }, { x: 36, y: 28 }, { x: 24, y: 46 }, { x: 24, y: 56 }, { x: 36, y: 74 }, { x: 56, y: 80 }, { x: 74, y: 78 }, { x: 74, y: 54 }
        ]
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 74 54 L 54 54',
        arrowAngle: 180,
        points: linePoints(74, 54, 54, 54, 5)
      }
    ]
  },
  'H': {
    char: 'H',
    isInfantForm: false,
    phonemeSound: '/h/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 32 20 L 32 80', arrowAngle: 90, points: linePoints(32, 20, 32, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 68 20 L 68 80', arrowAngle: 90, points: linePoints(68, 20, 68, 80, 8) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 32 50 L 68 50', arrowAngle: 0, points: linePoints(32, 50, 68, 50, 6) }
    ]
  },
  'I': {
    char: 'I',
    isInfantForm: false,
    phonemeSound: '/ɪ/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 50 20 L 50 80', arrowAngle: 90, points: linePoints(50, 20, 50, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 34 20 L 66 20', arrowAngle: 0, points: linePoints(34, 20, 66, 20, 5) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 34 80 L 66 80', arrowAngle: 0, points: linePoints(34, 80, 66, 80, 5) }
    ]
  },
  'J': {
    char: 'J',
    isInfantForm: false,
    phonemeSound: '/dʒ/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 36 20 L 68 20', arrowAngle: 0, points: linePoints(36, 20, 68, 20, 5) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 58 20 L 58 68 C 58 80, 36 82, 32 68',
        arrowAngle: 90,
        points: [
          { x: 58, y: 20 }, { x: 58, y: 44 }, { x: 58, y: 64 }, { x: 54, y: 76 }, { x: 44, y: 80 }, { x: 32, y: 70 }
        ]
      }
    ]
  },
  'K': {
    char: 'K',
    isInfantForm: false,
    phonemeSound: '/k/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 68 22 L 36 50', arrowAngle: 220, points: linePoints(68, 22, 36, 50, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 36 50 L 70 80', arrowAngle: 40, points: linePoints(36, 50, 70, 80, 6) }
    ]
  },
  'L': {
    char: 'L',
    isInfantForm: false,
    phonemeSound: '/l/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 35 20 L 35 80', arrowAngle: 90, points: linePoints(35, 20, 35, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 35 80 L 72 80', arrowAngle: 0, points: linePoints(35, 80, 72, 80, 6) }
    ]
  },
  'M': {
    char: 'M',
    isInfantForm: false,
    phonemeSound: '/m/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 24 80 L 24 20', arrowAngle: 270, points: linePoints(24, 80, 24, 20, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 24 20 L 50 60', arrowAngle: 55, points: linePoints(24, 20, 50, 60, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 50 60 L 76 20', arrowAngle: 305, points: linePoints(50, 60, 76, 20, 6) },
      { id: 4, order: 4, startLabel: '4', guidePath: 'M 76 20 L 76 80', arrowAngle: 90, points: linePoints(76, 20, 76, 80, 8) }
    ]
  },
  'N': {
    char: 'N',
    isInfantForm: false,
    phonemeSound: '/n/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 28 80 L 28 20', arrowAngle: 270, points: linePoints(28, 80, 28, 20, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 28 20 L 72 80', arrowAngle: 55, points: linePoints(28, 20, 72, 80, 8) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 72 80 L 72 20', arrowAngle: 270, points: linePoints(72, 80, 72, 20, 8) }
    ]
  },
  'O': {
    char: 'O',
    isInfantForm: false,
    phonemeSound: '/ɒ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 20 C 22 20 22 80 50 80 C 78 80 78 20 50 20',
        arrowAngle: 180,
        points: [
          { x: 50, y: 20 }, { x: 32, y: 26 }, { x: 22, y: 44 }, { x: 22, y: 56 }, { x: 32, y: 74 }, { x: 50, y: 80 }, { x: 68, y: 74 }, { x: 78, y: 56 }, { x: 78, y: 44 }, { x: 68, y: 26 }, { x: 50, y: 20 }
        ]
      }
    ]
  },
  'P': {
    char: 'P',
    isInfantForm: false,
    phonemeSound: '/p/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 20 C 70 20 70 52 34 52',
        arrowAngle: 0,
        points: [
          { x: 34, y: 20 }, { x: 54, y: 20 }, { x: 68, y: 28 }, { x: 68, y: 44 }, { x: 54, y: 52 }, { x: 34, y: 52 }
        ]
      }
    ]
  },
  'Q': {
    char: 'Q',
    isInfantForm: false,
    phonemeSound: '/kw/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 20 C 22 20 22 80 50 80 C 78 80 78 20 50 20',
        arrowAngle: 180,
        points: [
          { x: 50, y: 20 }, { x: 32, y: 26 }, { x: 22, y: 44 }, { x: 22, y: 56 }, { x: 32, y: 74 }, { x: 50, y: 80 }, { x: 68, y: 74 }, { x: 78, y: 56 }, { x: 78, y: 44 }, { x: 68, y: 26 }, { x: 50, y: 20 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 58 66 L 78 86', arrowAngle: 45, points: linePoints(58, 66, 78, 86, 5) }
    ]
  },
  'R': {
    char: 'R',
    isInfantForm: false,
    phonemeSound: '/r/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 20 C 70 20 70 52 34 52',
        arrowAngle: 0,
        points: [
          { x: 34, y: 20 }, { x: 54, y: 20 }, { x: 68, y: 28 }, { x: 68, y: 44 }, { x: 54, y: 52 }, { x: 34, y: 52 }
        ]
      },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 48 52 L 74 80', arrowAngle: 47, points: linePoints(48, 52, 74, 80, 6) }
    ]
  },
  'S': {
    char: 'S',
    isInfantForm: false,
    phonemeSound: '/s/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 68 28 C 48 16 30 26 30 38 C 30 52 70 48 70 64 C 70 78 50 82 30 72',
        arrowAngle: 210,
        points: [
          { x: 68, y: 28 }, { x: 52, y: 20 }, { x: 36, y: 26 }, { x: 30, y: 38 }, { x: 42, y: 48 }, { x: 62, y: 54 }, { x: 70, y: 64 }, { x: 66, y: 76 }, { x: 48, y: 80 }, { x: 30, y: 72 }
        ]
      }
    ]
  },
  'T': {
    char: 'T',
    isInfantForm: false,
    phonemeSound: '/t/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 25 20 L 75 20', arrowAngle: 0, points: linePoints(25, 20, 75, 20, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 50 20 L 50 80', arrowAngle: 90, points: linePoints(50, 20, 50, 80, 8) }
    ]
  },
  'U': {
    char: 'U',
    isInfantForm: false,
    phonemeSound: '/ʌ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 30 20 L 30 68 C 30 80 70 80 70 68 L 70 20',
        arrowAngle: 90,
        points: [
          { x: 30, y: 20 }, { x: 30, y: 55 }, { x: 32, y: 70 }, { x: 42, y: 80 }, { x: 58, y: 80 }, { x: 68, y: 70 }, { x: 70, y: 55 }, { x: 70, y: 20 }
        ]
      }
    ]
  },
  'V': {
    char: 'V',
    isInfantForm: false,
    phonemeSound: '/v/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 28 20 L 50 80', arrowAngle: 70, points: linePoints(28, 20, 50, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 50 80 L 72 20', arrowAngle: 290, points: linePoints(50, 80, 72, 20, 8) }
    ]
  },
  'W': {
    char: 'W',
    isInfantForm: false,
    phonemeSound: '/w/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 20 20 L 34 80', arrowAngle: 77, points: linePoints(20, 20, 34, 80, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 34 80 L 50 35', arrowAngle: 290, points: linePoints(34, 80, 50, 35, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 50 35 L 66 80', arrowAngle: 70, points: linePoints(50, 35, 66, 80, 6) },
      { id: 4, order: 4, startLabel: '4', guidePath: 'M 66 80 L 80 20', arrowAngle: 283, points: linePoints(66, 80, 80, 20, 6) }
    ]
  },
  'X': {
    char: 'X',
    isInfantForm: false,
    phonemeSound: '/ks/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 30 20 L 70 80', arrowAngle: 56, points: linePoints(30, 20, 70, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 70 20 L 30 80', arrowAngle: 124, points: linePoints(70, 20, 30, 80, 8) }
    ]
  },
  'Y': {
    char: 'Y',
    isInfantForm: false,
    phonemeSound: '/j/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 28 20 L 50 50', arrowAngle: 54, points: linePoints(28, 20, 50, 50, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 72 20 L 50 50', arrowAngle: 126, points: linePoints(72, 20, 50, 50, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 50 50 L 50 80', arrowAngle: 90, points: linePoints(50, 50, 50, 80, 6) }
    ]
  },
  'Z': {
    char: 'Z',
    isInfantForm: false,
    phonemeSound: '/z/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 30 22 L 70 22', arrowAngle: 0, points: linePoints(30, 22, 70, 22, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 70 22 L 30 78', arrowAngle: 125, points: linePoints(70, 22, 30, 78, 8) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 30 78 L 70 78', arrowAngle: 0, points: linePoints(30, 78, 70, 78, 6) }
    ]
  },

  // ================= LOWERCASE LETTERS (INFANT FORMS) =================
  'a': {
    char: 'ɑ',
    isInfantForm: true,
    phonemeSound: '/æ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 66 54 C 62 46 36 46 34 63 C 32 78 62 82 66 70',
        arrowAngle: 185,
        points: [
          { x: 66, y: 54 }, { x: 52, y: 48 }, { x: 36, y: 56 }, { x: 34, y: 66 }, { x: 42, y: 78 }, { x: 58, y: 80 }, { x: 66, y: 70 }
        ]
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 66 50 L 66 80',
        arrowAngle: 90,
        points: linePoints(66, 50, 66, 80, 6)
      }
    ]
  },
  'b': {
    char: 'b',
    isInfantForm: true,
    phonemeSound: '/b/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 54 C 42 46 68 48 68 64 C 68 80 42 82 34 78',
        arrowAngle: 30,
        points: [
          { x: 34, y: 54 }, { x: 48, y: 48 }, { x: 64, y: 54 }, { x: 68, y: 65 }, { x: 62, y: 76 }, { x: 48, y: 80 }, { x: 34, y: 78 }
        ]
      }
    ]
  },
  'c': {
    char: 'c',
    isInfantForm: true,
    phonemeSound: '/k/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 68 56 C 50 46 32 56 32 65 C 32 76 50 82 68 72',
        arrowAngle: 200,
        points: [
          { x: 68, y: 56 }, { x: 52, y: 49 }, { x: 38, y: 55 }, { x: 32, y: 65 }, { x: 38, y: 76 }, { x: 54, y: 80 }, { x: 68, y: 72 }
        ]
      }
    ]
  },
  'd': {
    char: 'd',
    isInfantForm: true, // Clear tall ascender
    phonemeSound: '/d/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 64 56 C 48 46 32 56 32 65 C 32 76 48 82 64 74',
        arrowAngle: 200,
        points: [
          { x: 64, y: 56 }, { x: 50, y: 48 }, { x: 36, y: 56 }, { x: 32, y: 65 }, { x: 38, y: 76 }, { x: 52, y: 80 }, { x: 64, y: 74 }
        ]
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 64 20 L 64 80',
        arrowAngle: 90,
        points: linePoints(64, 20, 64, 80, 8)
      }
    ]
  },
  'e': {
    char: 'e',
    isInfantForm: true,
    phonemeSound: '/ɛ/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 64 L 66 64', arrowAngle: 0, points: linePoints(34, 64, 66, 64, 5) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 66 64 C 66 48 32 48 32 64 C 32 78 52 82 68 72',
        arrowAngle: 270,
        points: [
          { x: 66, y: 64 }, { x: 64, y: 52 }, { x: 50, y: 48 }, { x: 34, y: 56 }, { x: 32, y: 66 }, { x: 38, y: 76 }, { x: 54, y: 80 }, { x: 68, y: 72 }
        ]
      }
    ]
  },
  'f': {
    char: 'f',
    isInfantForm: true,
    phonemeSound: '/f/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 62 24 C 54 18 44 22 44 36 L 44 80',
        arrowAngle: 210,
        points: [
          { x: 62, y: 24 }, { x: 52, y: 20 }, { x: 44, y: 28 }, { x: 44, y: 50 }, { x: 44, y: 80 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 32 48 L 58 48', arrowAngle: 0, points: linePoints(32, 48, 58, 48, 5) }
    ]
  },
  'g': {
    char: 'g',
    isInfantForm: true, // Distinct descender
    phonemeSound: '/ɡ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 66 56 C 50 46 32 56 32 65 C 32 76 50 80 66 74',
        arrowAngle: 200,
        points: [
          { x: 66, y: 56 }, { x: 50, y: 48 }, { x: 36, y: 56 }, { x: 32, y: 65 }, { x: 38, y: 76 }, { x: 52, y: 80 }, { x: 66, y: 74 }
        ]
      },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 66 50 L 66 86 C 66 96 46 96 36 88',
        arrowAngle: 90,
        points: [
          { x: 66, y: 50 }, { x: 66, y: 72 }, { x: 66, y: 88 }, { x: 54, y: 95 }, { x: 42, y: 94 }, { x: 36, y: 88 }
        ]
      }
    ]
  },
  'h': {
    char: 'h',
    isInfantForm: true,
    phonemeSound: '/h/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 58 C 44 46 66 48 66 62 L 66 80',
        arrowAngle: 40,
        points: [
          { x: 34, y: 58 }, { x: 46, y: 49 }, { x: 60, y: 52 }, { x: 66, y: 64 }, { x: 66, y: 80 }
        ]
      }
    ]
  },
  'i': {
    char: 'i',
    isInfantForm: true,
    phonemeSound: '/ɪ/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 50 50 L 50 80', arrowAngle: 90, points: linePoints(50, 50, 50, 80, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 50 35 L 50 36', arrowAngle: 90, points: [{ x: 50, y: 35 }, { x: 50, y: 36 }] }
    ]
  },
  'j': {
    char: 'j',
    isInfantForm: true,
    phonemeSound: '/dʒ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 54 50 L 54 86 C 54 96 38 96 32 88',
        arrowAngle: 90,
        points: [
          { x: 54, y: 50 }, { x: 54, y: 74 }, { x: 54, y: 88 }, { x: 44, y: 95 }, { x: 32, y: 88 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 54 35 L 54 36', arrowAngle: 90, points: [{ x: 54, y: 35 }, { x: 54, y: 36 }] }
    ]
  },
  'k': {
    char: 'k',
    isInfantForm: true,
    phonemeSound: '/k/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 20 L 34 80', arrowAngle: 90, points: linePoints(34, 20, 34, 80, 8) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 64 50 L 36 65', arrowAngle: 210, points: linePoints(64, 50, 36, 65, 5) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 36 65 L 66 80', arrowAngle: 30, points: linePoints(36, 65, 66, 80, 5) }
    ]
  },
  'l': {
    char: 'l',
    isInfantForm: true, // Gentle curved infant foot
    phonemeSound: '/l/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 20 L 50 74 C 50 78 54 80 60 80',
        arrowAngle: 90,
        points: [
          { x: 50, y: 20 }, { x: 50, y: 45 }, { x: 50, y: 68 }, { x: 52, y: 76 }, { x: 60, y: 80 }
        ]
      }
    ]
  },
  'm': {
    char: 'm',
    isInfantForm: true,
    phonemeSound: '/m/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 26 50 L 26 80', arrowAngle: 90, points: linePoints(26, 50, 26, 80, 6) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 26 58 C 34 46 50 48 50 62 L 50 80',
        arrowAngle: 35,
        points: [
          { x: 26, y: 58 }, { x: 36, y: 49 }, { x: 46, y: 52 }, { x: 50, y: 64 }, { x: 50, y: 80 }
        ]
      },
      {
        id: 3,
        order: 3,
        startLabel: '3',
        guidePath: 'M 50 58 C 58 46 74 48 74 62 L 74 80',
        arrowAngle: 35,
        points: [
          { x: 50, y: 58 }, { x: 60, y: 49 }, { x: 70, y: 52 }, { x: 74, y: 64 }, { x: 74, y: 80 }
        ]
      }
    ]
  },
  'n': {
    char: 'n',
    isInfantForm: true,
    phonemeSound: '/n/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 50 L 34 80', arrowAngle: 90, points: linePoints(34, 50, 34, 80, 6) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 58 C 44 46 66 48 66 62 L 66 80',
        arrowAngle: 40,
        points: [
          { x: 34, y: 58 }, { x: 46, y: 49 }, { x: 60, y: 52 }, { x: 66, y: 64 }, { x: 66, y: 80 }
        ]
      }
    ]
  },
  'o': {
    char: 'o',
    isInfantForm: true,
    phonemeSound: '/ɒ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 50 C 30 50 30 80 50 80 C 70 80 70 50 50 50',
        arrowAngle: 180,
        points: [
          { x: 50, y: 50 }, { x: 36, y: 54 }, { x: 30, y: 65 }, { x: 36, y: 76 }, { x: 50, y: 80 }, { x: 64, y: 76 }, { x: 70, y: 65 }, { x: 64, y: 54 }, { x: 50, y: 50 }
        ]
      }
    ]
  },
  'p': {
    char: 'p',
    isInfantForm: true, // Distinct descender
    phonemeSound: '/p/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 50 L 34 95', arrowAngle: 90, points: linePoints(34, 50, 34, 95, 8) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 34 56 C 44 46 68 48 68 65 C 68 80 44 82 34 78',
        arrowAngle: 30,
        points: [
          { x: 34, y: 56 }, { x: 48, y: 48 }, { x: 64, y: 54 }, { x: 68, y: 65 }, { x: 62, y: 76 }, { x: 48, y: 80 }, { x: 34, y: 78 }
        ]
      }
    ]
  },
  'q': {
    char: 'q',
    isInfantForm: true,
    phonemeSound: '/kw/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 66 56 C 50 46 32 56 32 65 C 32 76 50 80 66 74',
        arrowAngle: 200,
        points: [
          { x: 66, y: 56 }, { x: 50, y: 48 }, { x: 36, y: 56 }, { x: 32, y: 65 }, { x: 38, y: 76 }, { x: 52, y: 80 }, { x: 66, y: 74 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 66 50 L 66 95', arrowAngle: 90, points: linePoints(66, 50, 66, 95, 8) }
    ]
  },
  'r': {
    char: 'r',
    isInfantForm: true,
    phonemeSound: '/r/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 36 50 L 36 80', arrowAngle: 90, points: linePoints(36, 50, 36, 80, 6) },
      {
        id: 2,
        order: 2,
        startLabel: '2',
        guidePath: 'M 36 60 C 44 48 56 48 64 54',
        arrowAngle: 45,
        points: [
          { x: 36, y: 60 }, { x: 46, y: 50 }, { x: 56, y: 50 }, { x: 64, y: 54 }
        ]
      }
    ]
  },
  's': {
    char: 's',
    isInfantForm: true,
    phonemeSound: '/s/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 64 56 C 50 50 36 58 64 72 C 50 80 34 74 34 74',
        arrowAngle: 210,
        points: [
          { x: 64, y: 56 }, { x: 50, y: 50 }, { x: 38, y: 56 }, { x: 48, y: 64 }, { x: 64, y: 70 }, { x: 52, y: 80 }, { x: 34, y: 74 }
        ]
      }
    ]
  },
  't': {
    char: 't',
    isInfantForm: true, // Hooked school font form
    phonemeSound: '/t/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 50 25 L 50 74 C 50 78 54 80 62 80',
        arrowAngle: 90,
        points: [
          { x: 50, y: 25 }, { x: 50, y: 50 }, { x: 50, y: 70 }, { x: 52, y: 76 }, { x: 62, y: 80 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 36 50 L 64 50', arrowAngle: 0, points: linePoints(36, 50, 64, 50, 5) }
    ]
  },
  'u': {
    char: 'u',
    isInfantForm: true,
    phonemeSound: '/ʌ/',
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: 'M 34 50 L 34 72 C 34 80 64 80 64 72 L 64 50',
        arrowAngle: 90,
        points: [
          { x: 34, y: 50 }, { x: 34, y: 68 }, { x: 42, y: 79 }, { x: 56, y: 79 }, { x: 64, y: 68 }, { x: 64, y: 50 }
        ]
      },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 64 50 L 64 80', arrowAngle: 90, points: linePoints(64, 50, 64, 80, 5) }
    ]
  },
  'v': {
    char: 'v',
    isInfantForm: true,
    phonemeSound: '/v/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 32 50 L 50 80', arrowAngle: 60, points: linePoints(32, 50, 50, 80, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 50 80 L 68 50', arrowAngle: 300, points: linePoints(50, 80, 68, 50, 6) }
    ]
  },
  'w': {
    char: 'w',
    isInfantForm: true,
    phonemeSound: '/w/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 24 50 L 36 80', arrowAngle: 70, points: linePoints(24, 50, 36, 80, 5) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 36 80 L 50 60', arrowAngle: 305, points: linePoints(36, 80, 50, 60, 5) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 50 60 L 64 80', arrowAngle: 55, points: linePoints(50, 60, 64, 80, 5) },
      { id: 4, order: 4, startLabel: '4', guidePath: 'M 64 80 L 76 50', arrowAngle: 290, points: linePoints(64, 80, 76, 50, 5) }
    ]
  },
  'x': {
    char: 'x',
    isInfantForm: true,
    phonemeSound: '/ks/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 50 L 66 80', arrowAngle: 43, points: linePoints(34, 50, 66, 80, 6) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 66 50 L 34 80', arrowAngle: 137, points: linePoints(66, 50, 34, 80, 6) }
    ]
  },
  'y': {
    char: 'y',
    isInfantForm: true,
    phonemeSound: '/j/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 35 50 L 50 68', arrowAngle: 50, points: linePoints(35, 50, 50, 68, 5) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 65 50 L 35 95', arrowAngle: 124, points: linePoints(65, 50, 35, 95, 7) }
    ]
  },
  'z': {
    char: 'z',
    isInfantForm: true,
    phonemeSound: '/z/',
    strokes: [
      { id: 1, order: 1, startLabel: '1', guidePath: 'M 34 52 L 66 52', arrowAngle: 0, points: linePoints(34, 52, 66, 52, 5) },
      { id: 2, order: 2, startLabel: '2', guidePath: 'M 66 52 L 34 78', arrowAngle: 140, points: linePoints(66, 52, 34, 78, 6) },
      { id: 3, order: 3, startLabel: '3', guidePath: 'M 34 78 L 66 78', arrowAngle: 0, points: linePoints(34, 78, 66, 78, 5) }
    ]
  }
};

// Safe retrieval with procedural fallback
export function getLetterHandwritingData(char: string, caseMode: 'upper' | 'lower' = 'upper'): LetterData {
  const targetKey = caseMode === 'upper' ? char.toUpperCase() : char.toLowerCase();
  if (ECE_HANDWRITING_CATALOG[targetKey]) {
    return ECE_HANDWRITING_CATALOG[targetKey];
  }
  
  // Fallback procedural letter strokes
  const upper = char.toUpperCase();
  const isUpper = caseMode === 'upper';
  const topY = isUpper ? 20 : 50;
  return {
    char: caseMode === 'lower' && char.toLowerCase() === 'a' ? 'ɑ' : (isUpper ? upper : char.toLowerCase()),
    isInfantForm: !isUpper,
    phonemeSound: `/${char.toLowerCase()}/`,
    strokes: [
      {
        id: 1,
        order: 1,
        startLabel: '1',
        guidePath: `M 50 ${topY} L 50 80`,
        arrowAngle: 90,
        points: linePoints(50, topY, 50, 80, 8)
      }
    ]
  };
}
