const fs = require('fs');

const data = JSON.parse(fs.readFileSync('firestore.indexes.json', 'utf8'));
const indexes = data.indexes || [];

function getNormalizedKey(idx) {
    if (!idx.fields || idx.fields.length === 0) return idx.collectionGroup;
    
    // In Firestore, all fields except the last one are typically equality fields.
    // The last field is usually the sorting/range field.
    // If all fields are ASCENDING, they are all equality fields.
    const fields = [...idx.fields];
    const lastField = fields[fields.length - 1];
    
    let equalityFields = [];
    let sortField = null;
    
    // If the last field is DESCENDING, it is a sort field.
    if (lastField.order === 'DESCENDING') {
        equalityFields = fields.slice(0, -1);
        sortField = lastField;
    } else {
        equalityFields = fields;
    }
    
    // Sort equality fields alphabetically by fieldPath to normalize order
    equalityFields.sort((a, b) => a.fieldPath.localeCompare(b.fieldPath));
    
    // Reconstruct key
    const parts = [idx.collectionGroup];
    for (const f of equalityFields) {
        parts.push(`${f.fieldPath}:${f.order || f.arrayConfig}`);
    }
    if (sortField) {
        parts.push(`SORT:${sortField.fieldPath}:${sortField.order}`);
    }
    return parts.join('|');
}

const seenKeys = new Set();
const uniqueIndexes = [];
let duplicatesRemoved = 0;

for (const idx of indexes) {
    const key = getNormalizedKey(idx);
    if (seenKeys.has(key)) {
        console.log(`Removing duplicate index: ${idx.collectionGroup} on ${JSON.stringify(idx.fields)}`);
        duplicatesRemoved++;
    } else {
        seenKeys.add(key);
        uniqueIndexes.push(idx);
    }
}

console.log(`Total indexes before: ${indexes.length}`);
console.log(`Duplicates removed: ${duplicatesRemoved}`);
console.log(`Total indexes after: ${uniqueIndexes.length}`);

data.indexes = uniqueIndexes;
fs.writeFileSync('firestore.indexes.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Normalized firestore.indexes.json successfully!');
