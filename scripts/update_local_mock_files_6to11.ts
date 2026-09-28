const fs = require('fs');

const {
  recalibratedMock6Comprehension,
  recalibratedMock7Comprehension,
  recalibratedMock8Comprehension,
  recalibratedMock9Comprehension,
  recalibratedMock10Comprehension,
  recalibratedMock11Comprehension
} = require('./updateAllMocks6to11Comprehension.ts');

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
    // For json-style mock
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
    // For ts object-style
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

updateMockFile(6, recalibratedMock6Comprehension);
updateMockFile(7, recalibratedMock7Comprehension);
updateMockFile(8, recalibratedMock8Comprehension);
updateMockFile(9, recalibratedMock9Comprehension);
updateMockFile(10, recalibratedMock10Comprehension);
updateMockFile(11, recalibratedMock11Comprehension);
console.log('All local mock files 6-11 updated!');
