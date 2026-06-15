const fs = require('fs');

const rawIndexesText = `
        (think_tank_submissions) -- (schoolId,ASCENDING) (score,DESCENDING)  -- Density:SPARSE_ALL
        (school_calendar) -- (schoolId,ASCENDING) (date,ASCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (schoolId,ASCENDING) (teacherId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (inventory) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (report-cards) -- (schoolId,ASCENDING) (studentId,ASCENDING) (status,ASCENDING) (publishedAt,ASCENDING)  -- Density:SPARSE_ALL
        (financialRecords) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (tills) -- (schoolId,ASCENDING) (accountantId,ASCENDING) (status,ASCENDING)  -- Density:SPARSE_ALL
        (notifications) -- (userId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (report-cards) -- (schoolId,ASCENDING) (classId,ASCENDING) (academicYear,ASCENDING) (term,ASCENDING)  -- Density:SPARSE_ALL
        (auditLogs) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (announcements_v2) -- (schoolId,ASCENDING) (publishedAt,DESCENDING)  -- Density:SPARSE_ALL
        (science_learning_history) -- (userId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (schoolId,ASCENDING) (teacherId,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (tills) -- (schoolId,ASCENDING) (status,ASCENDING)  -- Density:SPARSE_ALL
        (tills) -- (accountantId,ASCENDING) (status,ASCENDING) (schoolId,ASCENDING)  -- Density:SPARSE_ALL
        (accountsPayable) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (lesson-plans) -- (schoolId,ASCENDING) (teacherId,ASCENDING) (date,DESCENDING)  -- Density:SPARSE_ALL
        (leaveRequests) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (announcements_v2) -- (schoolId,ASCENDING) (audience,CONTAINS) (publishedAt,DESCENDING)  -- Density:SPARSE_ALL
        (pos_transactions) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (staff_attendance) -- (schoolId,ASCENDING) (staffId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (ela_user_submissions) -- (schoolId,ASCENDING) (userId,ASCENDING) (date_submitted,DESCENDING)  -- Density:SPARSE_ALL
        (staff) -- (schoolId,ASCENDING) (role,ASCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (schoolId,ASCENDING) (classId,ASCENDING) (date,DESCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (teacherId,ASCENDING) (schoolId,ASCENDING)  -- Density:SPARSE_ALL
        (students) -- (schoolId,ASCENDING) (enrollmentStatus,ASCENDING)  -- Density:SPARSE_ALL
        (assessments) -- (schoolId,ASCENDING) (classId,ASCENDING) (term,ASCENDING)  -- Density:SPARSE_ALL
        (accountsPayable) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (assessments) -- (schoolId,ASCENDING) (classId,ASCENDING) (subjectId,ASCENDING) (academicYear,ASCENDING) (term,ASCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (schoolId,ASCENDING) (teacherId,ASCENDING) (dueDate,DESCENDING)  -- Density:SPARSE_ALL
        (tills) -- (schoolId,ASCENDING) (status,ASCENDING) (dateClosed,DESCENDING)  -- Density:SPARSE_ALL
        (staff) -- (schoolId,ASCENDING) (showOnWebsite,ASCENDING)  -- Density:SPARSE_ALL
        (payments) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (journal_entries) -- (schoolId,ASCENDING) (date,ASCENDING)  -- Density:SPARSE_ALL
        (behavioral_records) -- (schoolId,ASCENDING) (studentId,ASCENDING) (date,DESCENDING)  -- Density:SPARSE_ALL
        (journal_entries) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (junior_science_materials) -- (schoolId,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (performanceReviews) -- (staffId,ASCENDING) (schoolId,ASCENDING) (reviewDate,ASCENDING)  -- Density:SPARSE_ALL
        (junior_stickers) -- (userId,ASCENDING) (schoolId,ASCENDING) (earnedAt,DESCENDING)  -- Density:SPARSE_ALL
        (timeSlots) -- (schoolId,ASCENDING) (startTime,ASCENDING)  -- Density:SPARSE_ALL
        (auditLogs) -- (schoolId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (bank_transactions) -- (schoolId,ASCENDING) (status,ASCENDING) (recordedAt,DESCENDING)  -- Density:SPARSE_ALL
        (assessments) -- (schoolId,ASCENDING) (classId,ASCENDING) (academicYear,ASCENDING) (term,ASCENDING)  -- Density:SPARSE_ALL
        (ela_leaderboard) -- (schoolId,ASCENDING) (total_correct_answers,DESCENDING)  -- Density:SPARSE_ALL
        (junior_lifeskills_world) -- (schoolId,ASCENDING) (category,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (junior_stories) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (lesson-plans) -- (schoolId,ASCENDING) (date,DESCENDING)  -- Density:SPARSE_ALL
        (math_learning_history) -- (userId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (schoolId,ASCENDING) (date,ASCENDING)  -- Density:SPARSE_ALL
        (junior_science_world) -- (schoolId,ASCENDING) (tab,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (school_shop_items) -- (schoolId,ASCENDING) (name,ASCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (classId,ASCENDING) (schoolId,ASCENDING) (date,ASCENDING)  -- Density:SPARSE_ALL
        (ela_learning_history) -- (userId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (junior_art_quests) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (staff) -- (schoolId,ASCENDING) (firstName,ASCENDING)  -- Density:SPARSE_ALL
        (payrollRecords) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (junior_stickers) -- (userId,ASCENDING) (earnedAt,DESCENDING)  -- Density:SPARSE_ALL
        (tills) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (staff_attendance) -- (schoolId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (school_shop_items) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (direct_messages) -- (schoolId,ASCENDING) (participants,CONTAINS) (lastMessageTime,DESCENDING)  -- Density:SPARSE_ALL
        (think_tank_submissions) -- (schoolId,ASCENDING) (timestamp,DESCENDING)  -- Density:SPARSE_ALL
        (financialRecords) -- (schoolId,ASCENDING) (dueDate,ASCENDING)  -- Density:SPARSE_ALL
        (junior_phonics_world) -- (schoolId,ASCENDING) (tab,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (teacherId,ASCENDING) (schoolId,ASCENDING) (dueDate,ASCENDING)  -- Density:SPARSE_ALL
        (assessments) -- (schoolId,ASCENDING) (studentId,CONTAINS) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (junior_sorter_items) -- (schoolId,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (assessments) -- (schoolId,ASCENDING) (studentId,ASCENDING) (term,ASCENDING)  -- Density:SPARSE_ALL
        (paymentVouchers) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (junior_phonics) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (schoolId,ASCENDING) (studentId,CONTAINS) (date,DESCENDING)  -- Density:SPARSE_ALL
        (students) -- (schoolId,ASCENDING) (classId,ASCENDING) (enrollmentStatus,ASCENDING)  -- Density:SPARSE_ALL
        (junior_math_world) -- (schoolId,ASCENDING) (category,ASCENDING) (createdAt,ASCENDING)  -- Density:SPARSE_ALL
        (quizAttempts) -- (schoolId,ASCENDING) (studentId,ASCENDING) (completedAt,DESCENDING)  -- Density:SPARSE_ALL
        (assignments) -- (teacherId,ASCENDING) (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (payrollRecords) -- (staffId,ASCENDING) (period,DESCENDING)  -- Density:SPARSE_ALL
        (junior_science) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (behavioral_records) -- (schoolId,ASCENDING) (date,DESCENDING)  -- Density:SPARSE_ALL
        (report-cards) -- (schoolId,ASCENDING) (studentId,ASCENDING) (publishedAt,DESCENDING)  -- Density:SPARSE_ALL
        (attendance) -- (schoolId,ASCENDING) (date,ASCENDING) (status,ASCENDING)  -- Density:SPARSE_ALL
        (library) -- (schoolId,ASCENDING) (createdAt,DESCENDING)  -- Density:SPARSE_ALL
        (tills) -- (schoolId,ASCENDING) (accountantId,ASCENDING) (status,ASCENDING) (dateClosed,DESCENDING)  -- Density:SPARSE_ALL
        (payrollRecords) -- (schoolId,ASCENDING) (period,DESCENDING)  -- Density:SPARSE_ALL
`;

// Baseline original 12 indexes
const originalIndexes = [
  {
    "collectionGroup": "spot_checks",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "initiatedAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "spot_checks",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "initiatedAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "paymentVouchers",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "journal_entries",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "date", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "attendance",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "date", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "report-cards",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "status", "order": "ASCENDING" },
      { "fieldPath": "publishedAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "financialRecords",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "inventory",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "name", "order": "ASCENDING" }
    ]
  },
  {
    "collectionGroup": "assessments",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "assessments",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "studentId", "order": "ASCENDING" },
      { "fieldPath": "academicYear", "order": "ASCENDING" },
      { "fieldPath": "term", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "assessments",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "assessmentDate", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "depreciation_logs",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "schoolId", "order": "ASCENDING" },
      { "fieldPath": "runDate", "order": "DESCENDING" }
    ]
  }
];

const parsedIndexes = [];
const lines = rawIndexesText.trim().split('\n').map(l => l.trim()).filter(Boolean);

for (const line of lines) {
    const colMatch = line.match(/^\((.*?)\)\s*--\s*(.*)$/);
    if (!colMatch) {
        console.log(`Skipping line: ${line}`);
        continue;
    }
    
    const colGroup = colMatch[1];
    const fieldsPart = colMatch[2].split('--')[0].trim();
    
    // Find fields like (schoolId,ASCENDING) or (participants,CONTAINS)
    const fieldMatches = fieldsPart.match(/\(([^,]+),([^)]+)\)/g) || [];
    
    const fieldsList = [];
    for (const match of fieldMatches) {
        const parts = match.slice(1, -1).split(',');
        const path = parts[0].trim();
        const order = parts[1].trim();
        if (order === 'CONTAINS') {
            fieldsList.push({
                fieldPath: path,
                arrayConfig: 'CONTAINS'
            });
        } else {
            fieldsList.push({
                fieldPath: path,
                order: order
            });
        }
    }
    
    parsedIndexes.push({
        collectionGroup: colGroup,
        queryScope: "COLLECTION",
        fields: fieldsList
    });
}

function isDuplicate(idx1, idx2) {
    if (idx1.collectionGroup !== idx2.collectionGroup) return false;
    if (idx1.fields.length !== idx2.fields.length) return false;
    for (let i = 0; i < idx1.fields.length; i++) {
        const f1 = idx1.fields[i];
        const f2 = idx2.fields[i];
        if (f1.fieldPath !== f2.fieldPath) return false;
        if (f1.order !== f2.order) return false;
        if (f1.arrayConfig !== f2.arrayConfig) return false;
    }
    return true;
}

const mergedIndexes = [...originalIndexes];
let addedCount = 0;

for (const newIdx of parsedIndexes) {
    let dup = false;
    for (const existing of mergedIndexes) {
        if (isDuplicate(newIdx, existing)) {
            dup = true;
            break;
        }
    }
    if (!dup) {
        mergedIndexes.push(newIdx);
        addedCount++;
    }
}

console.log(`Parsed ${parsedIndexes.length} indexes. Added ${addedCount} new indexes.`);

const outputData = {
  indexes: mergedIndexes,
  fieldOverrides: [
    {
      "collectionGroup": "payments",
      "fieldPath": "paidAt",
      "ttl": false,
      "indexes": [
        {
          "order": "DESCENDING",
          "queryScope": "COLLECTION"
        }
      ]
    },
    {
      "collectionGroup": "routes",
      "fieldPath": "schoolId",
      "ttl": false,
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        }
      ]
    },
    {
      "collectionGroup": "schools",
      "fieldPath": "slug",
      "ttl": false,
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        }
      ]
    },
    {
      "collectionGroup": "staff",
      "fieldPath": "schoolId",
      "ttl": false,
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        }
      ]
    }
  ]
};

fs.writeFileSync('firestore.indexes.json', JSON.stringify(outputData, null, 2), 'utf8');
console.log('firestore.indexes.json updated successfully!');
