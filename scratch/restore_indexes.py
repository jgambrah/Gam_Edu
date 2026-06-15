import re
import json

raw_indexes_text = """
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
"""

# Load existing indexes
with open('firestore.indexes.json', 'r') as f:
    existing_data = json.load(f)

existing_indexes = existing_data.get('indexes', [])
existing_overrides = existing_data.get('fieldOverrides', [])

# Parse lines
parsed_indexes = []
lines = [l.strip() for l in raw_indexes_text.strip().split('\n') if l.strip()]

for line in lines:
    # Match the collection group
    col_match = re.match(r'^\((.*?)\)\s*--\s*(.*)$', line)
    if not col_match:
        print(f"Skipping line: {line}")
        continue
    
    col_group = col_match.group(1)
    fields_part = col_match.group(2).split('--')[0].strip()
    
    # Match each field declaration like (schoolId,ASCENDING) or (participants,CONTAINS)
    field_matches = re.findall(r'\(([^,]+),([^)]+)\)', fields_part)
    
    fields_list = []
    for path, order in field_matches:
        path = path.strip()
        order = order.strip()
        fields_list.append({
            "fieldPath": path,
            "order": order
        })
        
    index_obj = {
        "collectionGroup": col_group,
        "queryScope": "COLLECTION",
        "fields": fields_list
    }
    parsed_indexes.append(index_obj)

# Helper function to check if two indexes are duplicate
def is_duplicate(idx1, idx2):
    if idx1['collectionGroup'] != idx2['collectionGroup']:
        return False
    if len(idx1['fields']) != len(idx2['fields']):
        return False
    for f1, f2 in zip(idx1['fields'], idx2['fields']):
        if f1['fieldPath'] != f2['fieldPath'] or f1['order'] != f2['order']:
            return False
    return True

# Merge parsed indexes into existing ones, avoiding duplicates
merged_indexes = list(existing_indexes)
added_count = 0

for new_idx in parsed_indexes:
    dup = False
    for existing in merged_indexes:
        if is_duplicate(new_idx, existing):
            dup = True
            break
    if not dup:
        merged_indexes.append(new_idx)
        added_count += 1

print(f"Parsed {len(parsed_indexes)} indexes. Added {added_count} new (non-duplicate) indexes.")

# Update JSON data
existing_data['indexes'] = merged_indexes

# Write back to file
with open('firestore.indexes.json', 'w') as f:
    json.dump(existing_data, f, indent=2)

print("firestore.indexes.json updated successfully!")
