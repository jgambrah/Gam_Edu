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
  'Dem dey beat me',
  'He dey touch me when nobody is there',
  'Someone is touching me in a bad way',
  'My teacher touched my private part',
  'I am scared at home',
  'I am afraid to go home today',
  'I feel unsafe at home',
  'I am scared of my father',
  'I am being hit at home',
  'I am being bullied at school',
  'I am being abused',
  'I am being beaten every day',
  'He slaps me when I ask for food',
  'Nobody loves me',
  'Nobody wants me at home',
  'No one cares if I die',
  'I want to end my life',
  'I cut myself yesterday',
  'My teacher is hurting me',
  'I am going to run away from home',
];

const MUST_NOT_TRIGGER: string[] = [
  // Benign science, health, and environmental safety questions (must reach the teacher LLM!)
  'Can polluted river water harm me?',
  'Does dirty water hurt me?',
  'Is roof rainwater going to hurt me?',
  'Will hail hit me?',
  'Can lightning hit me during rain?',
  'Does Harmattan dust hurt me?',
  'Can the flood hurt me?',
  'How can I cut myself off from wasting water?',
  'Can boiling steam burn or hurt me?',
  'Will drinking borehole water harm me?',
  'Can mosquitoes near stagnant water hurt me?',
  'Does acid rain hurt me if it touches my skin?',
  'Can strong wind hit me during a storm?',
  'Will germs in stream water harm me?',
  'Can loud thunder hurt me?',
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
  const total = MUST_TRIGGER.length + MUST_NOT_TRIGGER.length;
  if (res.failed.length > 0) {
    console.error('Safeguarding checks FAILED:\n - ' + res.failed.join('\n - '));
    process.exit(1);
  }
  console.log(`Safeguarding checks PASSED (${res.passed}/${total} phrases).`);
}
