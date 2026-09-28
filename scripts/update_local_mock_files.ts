const fs = require('fs');

const {
  recalibratedMock1Comprehension,
  recalibratedMock2Comprehension,
  recalibratedMock3Comprehension,
  recalibratedMock4Comprehension,
  recalibratedMock5Comprehension
} = require('./updateAllMocks1to5Comprehension.ts');

function updateMockFile(fileNum, compData) {
  const filePath = `src/lib/data/bece-english-mock-${fileNum}.ts`;
  let content = fs.readFileSync(filePath, 'utf8');

  // Find partB_comprehension in the file
  const startMarker = 'partB_comprehension:';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    // Try quoted "partB_comprehension":
    const qMarker = '"partB_comprehension":';
    const qIdx = content.indexOf(qMarker);
    if (qIdx === -1) {
      console.error(`Could not find partB_comprehension in Mock ${fileNum}`);
      return;
    }
    // For json-style mock 3, 4, 5
    // Find next section: "partC_literature":
    const endMarker = '"partC_literature":';
    const endIdx = content.indexOf(endMarker, qIdx);
    if (endIdx === -1) {
      console.error(`Could not find endMarker in Mock ${fileNum}`);
      return;
    }

    const before = content.slice(0, qIdx);
    const after = content.slice(endIdx);
    const replacement = `"partB_comprehension": ${JSON.stringify(compData, null, 6)},\n    `;
    content = before + replacement + after;
  } else {
    // For ts object-style mock 1, 2
    // Find next section: partC_literature:
    const endMarker = 'partC_literature:';
    const endIdx = content.indexOf(endMarker, startIdx);
    if (endIdx === -1) {
      console.error(`Could not find endMarker in Mock ${fileNum}`);
      return;
    }

    const before = content.slice(0, startIdx);
    const after = content.slice(endIdx);
    const replacement = `partB_comprehension: ${JSON.stringify(compData, null, 2)},\n  `;
    content = before + replacement + after;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated local file: src/lib/data/bece-english-mock-${fileNum}.ts`);
}

updateMockFile(1, recalibratedMock1Comprehension);
updateMockFile(2, recalibratedMock2Comprehension);
updateMockFile(3, recalibratedMock3Comprehension);
updateMockFile(4, recalibratedMock4Comprehension);
updateMockFile(5, recalibratedMock5Comprehension);
console.log('All local mock files 1-5 updated!');
