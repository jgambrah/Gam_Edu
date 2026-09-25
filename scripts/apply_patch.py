import base64

with open('scripts/seedStrand4LetterWritingB9FoundationClean.ts', 'r', encoding='utf-8') as f:
    content = f.read()

types_marker = '// ======================================================================\n// TYPES & SCHEMAS'
types_idx = content.find(types_marker)
if types_idx == -1:
    print('types_marker not found!')
    exit(1)

new_header_b64 = 'aW13b3J0IGogYXMgYWRtaW4gZnJvbSAnZmlyZWJhc2UtYWRtaW4nOwopaW1wb3J0IHggY3JlYXRlRmVxdWlyZSBsIGZyb20g'0 + \
    'aW1wb3JlJs4KCnNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCkzKigpasyucXBvc3RvbiBhZg=='

# Actual header b64:
new_header_b64 = 'aW1wb3JlIGogYXMgYWRtaW4gZnJvbSAnZmlyZWJhc2UtYWRtaW4nOwopaW1wb3J0IHwgY3JlYXRlRmVxdWlyZSBlIGZyb20g'\
    ''aW1wb3JlJs4KCnNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCkzKigpasyucXBvc3RvbiBhZg=='

