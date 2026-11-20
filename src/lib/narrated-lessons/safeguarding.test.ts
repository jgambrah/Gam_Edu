import { isSafeguardingConcern } from './safeguarding';

const MUST_TRIGGER: string[] = [
  'I want to kill myself',
  'I am going to hurt myself tonight',
  'I feel suicidal',
  'I wish I was dead',
  'I wish I were dead',
  'I want to die',
  'I wan die',
  'I do not want to live anymore',
  'I dont want to live',
  'I am tired of living',
  'My uncle hits me every evening',
  'Someone is hurting me at home',
  'He is hitting me',
  'My stepfather beats me',
  'My uncle dey beat me',
  'He dey touch me when nobody is there',
  'Someone is touching me in a bad way',
  'He touched my private parts',
  'I am scared at home',
  'I am afraid to go home today',
  'I feel unsafe at home',
  'I am afraid of my father',
  'I am being hit at home',
  'I am being bullied at school',
  'I am being abused',
  'I am being beaten every day',
  'He slaps me when I ask for food',
  'Nobody loves me',
  'No one cares if I die',
  'I want to end my life',
  'I cut myself yesterday',
  'My teacher is hurting me',
];

const MUST_NOT_TRIGGER: string[] = [
  'Does boiling water kill bacteria?',
  'Why does rain fall from clouds?',
  'What is a cloud made of?',
  'How does Akosombo Dam make electricity?',
  'Can dirty water harm fish in rivers?',
  'Why do crops die during a long drought?',
  'How do trees help the water cycle?',
  'Is borehole water safe to drink?',
  'Why does Harmattan feel so dry?',
  'What happens when water hits the ground?',
];

export function runSafeguardingChecks(): { passed: number; failed: string[] } {
  const failed: string[] = [];
  let passed = 0;

  for (const phrase of MUST_TRIGGER) {
    if (isSafeguardingConcern(phrase)) passed++;
    else failed.push(`MISSED trigger: "${phrase}"`);
  }
  for (const phrase of MUST_NOT_TRIGGER) {
    if (!isSafeguardingConcern(phrase)) passed++;
    else failed.push(`FALSE POSITIVE: "${phrase}"`);
  }
  return { passed, failed };
}

if (require.main === module) {
  const res = runSafeguardingChecks();
  if (res.failed.length > 0) {
    console.error('Safeguarding checks FAILED:\n - ' + res.failed.join('\n - '));
    process.exit(1);
  }
  console.log(`Safeguarding checks PASSED (${res.passed}/${MUST_TRIGGER.length + MUST_NOT_TRIGGER.length} phrases).`);
}
