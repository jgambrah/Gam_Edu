const path = require('path');

const artifactDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\0e9c78d2-47f6-471d-b0d4-8dd821856080';
const p1 = '/C:/Users/LENOVO/.gemini/antigravity-ide/brain/0e9c78d2-47f6-471d-b0d4-8dd821856080/student_discipline_subtab_view_1782313708851.png';
const p2 = '/Users/LENOVO/.gemini/antigravity-ide/brain/0e9c78d2-47f6-471d-b0d4-8dd821856080/student_discipline_subtab_view_1782313708851.png';

console.log("artifactDir normalized:", path.normalize(artifactDir));
console.log("p1 resolved:", path.resolve(p1));
console.log("p2 resolved:", path.resolve(p2));
console.log("p1 normalized:", path.normalize(p1));
console.log("p2 normalized:", path.normalize(p2));

console.log("p1.startsWith(artifactDir):", path.resolve(p1).startsWith(path.normalize(artifactDir)));
console.log("p2.startsWith(artifactDir):", path.resolve(p2).startsWith(path.normalize(artifactDir)));
console.log("p2 normalized startsWith:", path.normalize(p2).startsWith(path.normalize(artifactDir)));
console.log("p2 normalized startsWith (casing check):", path.normalize(p2).toLowerCase().startsWith(path.normalize(artifactDir).toLowerCase()));
