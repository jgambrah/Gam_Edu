import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (motif: string, text: string, alt: string, narration = 'Clear, warm storyteller voice; a short pause at the end of the page.'): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Strictly no text, letters, numbers or signs inside the artwork. Keep a calm, uncluttered area for text.`,
  narration,
});

interface Guide {
  overview: string;
  lessonMinutes: number;
  goals: string[];
  subjects: Array<[string, string]>;
  before: string[];
  during: string[];
  after: string[];
  discussion: string[];
  reflection: string[];
  maths?: Array<{ task: string; answer: string }>;
  support: string[];
  stretch: string[];
  localise: string[];
  discoveryStatus?: NonNullable<PilotStory['teacherGuide']>['discoveryStatus'];
  investigation?: NonNullable<PilotStory['teacherGuide']>['investigation'];
  factCheck?: NonNullable<PilotStory['teacherGuide']>['factCheck'] | string[];
}

interface Spec {
  key: string;
  title: string;
  summary: string;
  classIds: Classification['classIds'];
  ageMin: number;
  ageMax: number;
  readingLevel: Classification['readingLevel'];
  difficulty: number;
  genres: Classification['genres'];
  themes: Classification['themes'];
  objectives: Classification['objectives'];
  ghanaianContext: Classification['ghanaianContext'];
  culturalTags?: string[];
  wpm: number;
  paceWord: string;
  palette: [string, string];
  voice: string;
  characters: string[];
  music: string;
  pages: Page[];
  activities: Acts;
  glossary: PilotStory['glossary'];
  culturalNotes: string[];
  reviewQuestions: string[];
  guide: Guide;
}

const words = (pages: Page[]) => pages.reduce((n, p) => n + p.text.trim().split(/\s+/).length, 0);

const mk = (s: Spec): PilotStory => {
  const speakingSec = (words(s.pages) / s.wpm) * 60;
  const g = s.guide;
  const classification: Classification = {
    schemaVersion: CLASSIFICATION_VERSION,
    language: 'en',
    narrationLocale: 'en-GH',
    classIds: s.classIds,
    ageMin: s.ageMin,
    ageMax: s.ageMax,
    readingLevel: s.readingLevel,
    difficulty: s.difficulty,
    genres: s.genres,
    themes: s.themes,
    objectives: s.objectives,
    ghanaianContext: s.ghanaianContext,
    ...(s.culturalTags ? { culturalTags: s.culturalTags } : {}),
    estimatedDurationSec: Math.max(60, Math.round((speakingSec * 1.6) / 10) * 10),
  };
  return {
    key: s.key,
    set: 'extension',
    title: s.title,
    summary: s.summary,
    classification,
    palette: s.palette,
    characters: s.characters,
    narrationPlan: {
      voice: s.voice,
      pace: `${s.paceWord} (about ${s.wpm} words per minute)`,
      notes: ['Read dialogue with a different voice for each character.', 'Pause for two seconds at each question activity.', 'Never rush the last page: let the ending land.'],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: ['Is the language right for the stated age band and reading level?', 'Is anything here inaccurate, stereotyped or unsafe for children?', ...s.reviewQuestions],
    pages: s.pages,
    activities: s.activities,
    glossary: s.glossary,
    teacherGuide: {
      overview: g.overview,
      lessonMinutes: g.lessonMinutes,
      learningGoals: g.goals,
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'approved' as const })),
      beforeReading: g.before,
      whileReading: g.during,
      afterReading: g.after,
      discussion: g.discussion,
      reflection: g.reflection,
      mathsExtension: g.maths ?? [],
      differentiation: { support: g.support, stretch: g.stretch },
      culturalNotes: s.culturalNotes,
      localiseThis: g.localise,
      ...(g.discoveryStatus ? { discoveryStatus: g.discoveryStatus } : {}),
      ...(g.investigation ? { investigation: g.investigation } : {}),
      ...(g.factCheck ? { factCheck: g.factCheck.map((fc) => (typeof fc === 'string' ? { claim: s.title, explanation: fc, reference: 'NaCCA Primary Curriculum / Community Review' } : fc)) } : {}),
    },
  };
};

/**
 * Batch 30: Folklore and belief, told honestly. Eight stories for primary 1 to JHS 1: the mmoatia (little forest people) as an
 * Akan belief, how Ananse won Nyame’s stories, a lost boy who stays safe, a new folktale about honey and bees, a
 * classmate with dwarfism, two kinds of truth, a child who writes down an elder's story, and a night of forest sounds.
 *
 * Standing rules: community beliefs are told as beliefs ("elders say"), never as proven fact. Competing accounts are shown.
 * New tales are labelled as new. No real person with dwarfism is linked to any spirit.
 */

export const BATCH_30_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-little-people-of-the-forest',
    title: 'The Little People of the Forest',
    summary: 'Kwamla asks his grandmother about the mmoatia, the little forest people of Akan stories. She tells the belief as a belief, and teaches him that no classmate is ever a character in a story.',
    classIds: ['primary-2', 'primary-3', 'primary-4'], ageMin: 7, ageMax: 10, readingLevel: 'developing', difficulty: 2,
    genres: ['cultural', 'realistic-fiction'], themes: ['family', 'community', 'identity'], objectives: ['cultural-heritage', 'reasoning', 'kindness', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Calm, with a pause for the grandmother’s wise lines', palette: ['#166534', '#78350f'],
    voice: 'A warm, slow grandmother voice for Nana Akyaa; a curious boy’s voice for Kwamla',
    characters: [
      'Kwamla: a nine-year-old Ghanaian boy with short neat hair, wearing a mustard-yellow collared shirt and brown khaki shorts, sitting on a low wooden stool.',
      'Nana Akyaa: his kindly grandmother with silver-threaded hair under a deep-green and gold patterned headwrap and matching cloth wrapper, sitting beside him under a shady neem tree at dusk.',
    ],
    music: 'Soft night insects and a low flute (placeholder)',
    pages: [
      pg('🌳', 'One evening, Kwamla sat with Nana Akyaa under the neem tree. The forest grew dark beyond the farm. “Nana, are there little people in the forest?” he asked.', 'Kwamla and his grandmother Nana Akyaa sitting on low wooden stools under a leafy neem tree in a village courtyard at dusk, with a dark green forest beyond the farm.'),
      pg('📖', 'Nana smiled. “Elders in our part of Ghana tell of the mmoatia, the little people of the forest. In Akan folklore, they are short mythical forest dwarfs. I tell you what we are told. It is a story we keep.”', 'Nana Akyaa speaking gently with warm expressive hands while Kwamla leans forward on his stool listening closely under the evening sky.'),
      pg('❓', 'Kwamla’s eyes grew wide. “Some people say a person was taken by them and came back with special powers.” Nana nodded. “People do say such things. I have seen no proof, so I tell it as a story and a belief, not as something I can show you.”', 'Close view of Kwamla looking wide-eyed and curious while Nana Akyaa nods thoughtfully with a calm, honest expression.'),
      pg('🚶', '“Then what do we do in the forest?” asked Kwamla. “We do what is true and safe,” said Nana. “We walk with grown-ups, we do not go in at night, and we respect the trees and the animals.”', 'Nana Akyaa pointing calmly toward a sunlit-dusk footpath at the edge of the tall forest trees while Kwamla looks toward the path attentively.'),
      pg('🤝', 'Kwamla thought of a girl at school who was short. “Ewuradjoa is not one of the mmoatia, Nana,” he said. “Of course not,” said Nana. “She is a child, just like you. Stories belong to the forest. They never belong to our classmates.”', 'Kwamla and Nana Akyaa talking earnestly face to face under the warm glow of a courtyard lantern, Nana resting a gentle hand on Kwamla’s shoulder.'),
      pg('🌙', 'Kwamla went to bed with two clear thoughts. One was the old story, which he would keep and tell. The other was the truth he knew for certain: every child is a person, and a person is never a spirit.', 'Kwamla tucked peacefully under a patterned blanket in his cosy bedroom at night, smiling thoughtfully as a bright crescent moon and stars shine outside the open window.'),
    ],
    activities: [
      { id: 'lp-c1', type: 'comprehension', afterPage: 3, question: 'How does Nana tell the story of the mmoatia?', options: ['As a story and a belief', 'As proven science', 'As a joke'], correctIndex: 0 },
      { id: 'lp-c2', type: 'comprehension', afterPage: 5, question: 'What does Nana say about classmates?', options: ['Stories never belong to our classmates', 'They can be teased', 'They are spirits'], correctIndex: 0 },
      { id: 'lp-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Kwamla asks about the little people.', 'Nana tells the belief as a belief.', 'Nana says how to stay safe in the forest.', 'Nana says every classmate is a person.'] },
      { id: 'lp-voc', type: 'vocabulary', afterPage: 2, word: 'folklore', definition: 'The traditional stories and beliefs of a community.', distractors: ['A kind of forest tree', 'A school rule'] },
      { id: 'lp-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when someone is teased about how they look?', feelingOptions: ['Sad', 'Angry', 'Protective', 'Kind'] },
    ],
    glossary: [
      { word: 'mmoatia', definition: 'Little forest people in Akan folklore (told as a belief, not proven fact).', pages: [2, 5] },
      { word: 'respect', definition: 'To treat someone or something with care and honour.', pages: [4] },
      { word: 'belief', definition: 'Something that people hold to be true, even when it cannot be proven.', pages: [3] },
    ],
    culturalNotes: ['In Akan folklore, the mmoatia are short mythical forest dwarfs (little people of the forest) depicted as compact, wingless forest dwellers. Beliefs about the little people differ between places and families, and some people hold them as serious beliefs. This story tells the belief as a belief and does not claim it is proven.', 'Stories of people taken by little people and returning with special powers are told in some communities. They should be checked with local elders and recorded respectfully as community accounts.', 'People with dwarfism are ordinary people. The story says clearly that no child is ever a spirit.'],
    reviewQuestions: ['Check the spelling and use of mmoatia (some sources write mmoetia).', 'Ask a local elder whether the wording about the little people matches what is told in your area, and whether anything should not be told to children.'],
    guide: {
      overview: 'A conversation between a boy and his grandmother. It teaches that a community belief can be told with respect and honesty, that no proof is claimed, that children stay safe near the forest, and that a classmate is never a character in a story. Form: realistic dialogue.',
      lessonMinutes: 30, goals: ['Tell the difference between a belief and a proven fact.', 'Name two rules for staying safe near a forest.', 'Explain why we never tease a person with a story.'],
      subjects: [['English Language', 'Reading and discussing dialogue'], ['Our World Our People', 'Respect for others'], ['History', 'Oral tradition']],
      before: ['Ask: what stories do elders tell in your family? Do not correct anyone’s belief; ask how they tell it.'],
      during: ['Pause after page 3 and ask: how does Nana tell the story? What does she say about proof?'],
      after: ['Draw the forest and write two safety rules.', 'Write a sentence that starts: “I respect my classmate because…”'],
      discussion: ['Why is it important to say “elders say” when we tell a belief?', 'How can we respect a belief and still keep our friends safe from teasing?'],
      reflection: ['Was there ever a time you felt hurt by a joke about how you look?'],
      support: ['Read pages aloud together and have children say the safety rules back.'], stretch: ['Write a short dialogue in which a child respectfully asks an elder about a belief.'],
      localise: ['Use the local name for the forest people if different from mmoatia.', 'Invite an elder to share what is told, in their own words.'],
    },
  }),

  // 2
  mk({
    key: 'how-ananse-won-the-stories',
    title: 'How Ananse Won Nyame’s Stories',
    summary: 'In an Akan tale, Ananse climbs his web to the heavens and wins the world’s stories from Nyame, the Creator, by outwitting Ɔnini the python, Mmɔborɔ the stinging hornets, Osebo the leopard, and Mmoatia the forest dwarf.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['cultural', 'moral', 'humour'], themes: ['identity', 'family', 'community'], objectives: ['cultural-heritage', 'oral-language', 'reading-comprehension', 'sequencing'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 85, paceWord: 'Lively storytelling, with a pause for each task', palette: ['#b45309', '#7c3aed'],
    voice: 'A lively storyteller; a booming, warm voice for Nyame and a quick, clever voice for Ananse',
    characters: [
      'Ananse: a charming, expressive folkloric spider character walking upright with a round brown body, clever bright eyes, and a small woven kente sash.',
      'Nyame: the majestic, kindly Supreme Creator in Akan tradition, with a silver beard and golden kente robes, seated on an Adinkra-carved golden stool in radiant heavenly light.',
      'Aso: Ananse’s wise, warm-hearted wife wearing a colourful headscarf and wrapper inside their cosy earthen home.',
      'Mmoatia: a small West African forest dwarf of Akan folklore—depicted as a compact, wingless, earth-toned forest dweller.',
    ],
    music: 'A bright drum and a quick xylophone for Ananse (placeholder)',
    pages: [
      pg('🕸️', 'Long ago, all the stories in the world belonged to Nyame, the Creator. Ananse the spider spun a silver web and climbed up to the heavens to ask Nyame for them. “What price will you pay for my stories?” Nyame asked.', 'Small clever Ananse having climbed his shimmering silver spider-web up to the heavens, looking up respectfully at Nyame, the Creator, in golden kente robes.'),
      pg('🔟', 'Nyame set four hard tasks. “Bring me Ɔnini the python, Mmɔborɔ, the stinging hornets, Osebo the leopard, and Mmoatia the forest dwarf,” he said. Some storytellers change this list a little.', 'Nyame, the Creator, seated in radiant heavenly clouds holding up four fingers clearly while small Ananse listens attentively below.'),
      pg('🏺', 'Ananse went home and asked his wife, Aso, for help. Together they prepared an empty calabash gourd, cool water, and strong vine, because two minds are better than one.', 'Ananse and his thoughtful wife Aso sitting together at a wooden table inside their cosy home with an empty calabash gourd and coiled vine, smiling as they plan.'),
      pg('🌧️', 'In the tale, Ananse sprinkled water like rain so Mmɔborɔ, the stinging hornets, flew into his empty gourd for shelter. Then he measured Ɔnini along a palm branch and outwitted Osebo and Mmoatia the forest dwarf. Never touch or trap real wild animals or hornets!', 'Ananse climbing toward the heavens carrying a closed woven basket and calabash gourd, while far below in the green forest the leopard and python rest free and undisturbed.'),
      pg('🌟', 'Ananse climbed his web back to the heavens with all four. Nyame, the Creator, was amazed. “You have done everything I asked,” he said. “From today, the stories are yours, and they shall be called Spider Stories.”', 'Nyame, the Creator, smiling warmly in the heavens and handing a glowing golden carved wooden story-box to joyful Ananse.'),
      pg('👂', 'That is why many Akan people call folktales Anansesɛm, or Spider Stories. When elders tell them in the evening, children gather round to listen and learn.', 'A Ghanaian village elder seated by a warm evening courtyard fire telling an animated story while happy children sit on mats listening in wonder under starry skies.'),
    ],
    activities: [
      { id: 'an-c1', type: 'comprehension', afterPage: 2, question: 'Who owned all the stories at first?', options: ['Nyame, the Creator', 'Ananse', 'Aso'], correctIndex: 0 },
      { id: 'an-c2', type: 'comprehension', afterPage: 4, question: 'How did Ananse trick Mmɔborɔ, the stinging hornets, in the tale?', options: ['Sprinkled water like rain beside an empty gourd', 'Chased them with a stick', 'Asked Osebo to catch them'], correctIndex: 0 },
      { id: 'an-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Ananse climbs his web to ask Nyame for the stories.', 'Nyame sets four hard tasks.', 'Ananse plans with Aso using a gourd and vine.', 'The stories are called Anansesɛm, or Spider Stories.'] },
      { id: 'an-pr', type: 'prediction', afterPage: 2, prompt: 'What do you think Ananse will do to finish the tasks?', options: ['Use his wits and ask Aso', 'Fight with a stick', 'Give up'] },
      { id: 'an-voc', type: 'vocabulary', afterPage: 6, word: 'folktale', definition: 'A traditional story passed down by word of mouth over many years.', distractors: ['A school test', 'A kind of drum'] },
    ],
    glossary: [
      { word: 'Nyame', definition: 'In Akan tradition, the Supreme God and Creator of heaven and earth.', pages: [1, 2, 5] },
      { word: 'Ɔnini', definition: 'Standard Twi name in Ananse tales for the great African rock python.', pages: [2, 4] },
      { word: 'Mmɔborɔ', definition: 'Traditional Akan folktale name for the stinging hornets.', pages: [2, 4] },
      { word: 'Mmoatia', definition: 'A small West African forest dwarf in Akan folklore.', pages: [2, 4] },
      { word: 'gourd', definition: 'A hard-shelled hollow fruit, such as a calabash, dried and used as a container.', pages: [3, 4] },
      { word: 'Anansesɛm', definition: 'Standard Twi word meaning “spider stories” (folktales).', pages: [6] },
    ],
    culturalNotes: [
      'In Akan and Ghanaian thought, Nyame (Onyame / Onyankopɔn) is the Supreme God, Creator of heaven and earth. Ananse climbs his web up to the heavens to petition Nyame, the Creator.',
      'In the widely told Akan version, Nyame sets four tasks: Ɔnini the African rock python (Standard Twi Ɔnini; ASCII Onini), Mmɔborɔ, the stinging hornets (ASCII Mmoboro—their traditional Anansesɛm name, whereas kotokurodu is the everyday Twi word for hornet or wasp), Osebo (Ɔsebɔ) the leopard, and Mmoatia the forest dwarf (a small wingless West African forest dweller). Regional tellings vary in small details.',
      'In the classic hornet episode, Ananse sprinkles water to mimic rain so Mmɔborɔ fly into an empty calabash gourd for shelter. Anansesɛm means “spider stories”, and the story reminds children plainly never to approach or trap real wild animals or stinging insects.',
    ],
    reviewQuestions: ['Check Standard Twi spelling of Ɔnini, Mmɔborɔ, Osebo (Ɔsebɔ), Mmoatia, Aso, Nyame, and Anansesɛm.', 'Have a storyteller read page 4 and confirm that the gourd rain trick and safety reminder flow naturally together.'],
    guide: {
      overview: 'A retelling of the Akan tale of how Ananse climbed his web to the heavens and won Nyame’s stories, honouring Standard Twi names (Nyame the Creator, Ɔnini, Mmɔborɔ, Mmoatia the forest dwarf, Anansesɛm), noting regional variations, and reminding children never to trap wild animals.',
      lessonMinutes: 25, goals: ['Retell the four tasks set by Nyame, the Creator, in order.', 'Explain how Ananse and Aso used cleverness (such as the gourd and rain trick) instead of force.', 'Describe what a folktale (Anansesɛm) is and how tellings can vary.'],
      subjects: [['English Language', 'Folktales and sequencing'], ['Creative Arts', 'Storytelling and drama'], ['Our World Our People', 'Ghanaian oral heritage']],
      before: ['Ask children what Anansesɛm (Ananse tales) they already know.'], during: ['Hold up four fingers as each task is named on page 2 (Ɔnini, Mmɔborɔ, Osebo, Mmoatia).'],
      after: ['Act out the story in four short scenes.', 'Ask an elder or parent for their version of how Ananse won Nyame’s stories and compare.'],
      discussion: ['Why does the story say two minds are better than one?', 'Why must we never copy folktale tricks around real snakes, hornets, or wild animals?'],
      reflection: ['Who do you ask for help when a task feels too big?'],
      support: ['Use four picture cards for the four tasks (python, hornets in a gourd, leopard, forest dwarf).'], stretch: ['Write the conversation between Ananse and Aso as they plan the rain-and-gourd trick for Mmɔborɔ.'],
      localise: ['Share the version told in your own community, note everyday Twi terms such as kotokurodu alongside Mmɔborɔ, and credit the elder who tells it.'],
      factCheck: [
        {
          claim: 'Akan names and roles in How Ananse Won Nyame’s Stories',
          explanation: 'In Akan cosmology Nyame (Onyame / Onyankopɔn) is the Supreme Creator; the four classic Anansesɛm tasks name Ɔnini the python, Mmɔborɔ the stinging hornets (everyday Twi: kotokurodu), Osebo (Ɔsebɔ) the leopard, and Mmoatia the forest dwarf.',
          reference: 'Christaller Twi Dictionary / Rattray Akan-Ashanti Folk-Tales / NaCCA Primary Curriculum',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'the-boy-who-came-out-of-the-forest',
    title: 'The Boy Who Came Out of the Forest',
    summary: 'Appiagyei gets lost at the edge of the forest. He stays calm, follows his teacher’s safety rules, and is found in the morning. Villagers offer two explanations, and the story shows both.',
    classIds: ['primary-2', 'primary-3', 'primary-4'], ageMin: 7, ageMax: 10, readingLevel: 'developing', difficulty: 2,
    genres: ['realistic-fiction', 'adventure', 'cultural'], themes: ['fear-and-courage', 'community', 'family'], objectives: ['problem-solving', 'reasoning', 'cultural-heritage', 'responsibility'],
    ghanaianContext: 'central', culturalTags: ['village-life'], wpm: 90, paceWord: 'Steady and calm, slowing for the quiet night', palette: ['#14532d', '#1e3a8a'],
    voice: 'A steady narrator voice; a small, brave voice for Appiagyei; warm relief for the searchers',
    characters: [
      'Appiagyei: a ten-year-old Ghanaian boy with short hair, wearing a bright sky-blue T-shirt, khaki shorts, brown sandals, and a bright red safety whistle on a cord around his neck.',
      'His mother: a caring Ghanaian woman in a warm orange-and-indigo wrapper cloth and headscarf.',
      'Village searchers: neighbours in practical farm clothes carrying bright hand torches and walking sticks.',
    ],
    music: 'Night forest sounds and a soft drum; a light flute in the morning (placeholder)',
    pages: [
      pg('🐦', 'Appiagyei went to gather firewood at the edge of the forest with his cousin. He paused to admire a bright blue bird. When he looked around, his cousin was gone, and every tree looked the same.', 'Appiagyei standing alone among tall green forest-edge trees with a small bundle of twigs, looking up at a vivid blue bird on a branch.'),
      pg('🛑', 'Appiagyei remembered what his teacher had taught the class: “If you are lost, stop. Do not run in circles.” He sat down beside the wide roots of a giant silk-cotton tree and took a slow, deep breath.', 'Appiagyei sitting calmly against the buttress roots of a huge forest tree with his hands on his knees, breathing steadily.'),
      pg('📣', 'He called out and blew the red whistle his mother had given him for farm trips. He blew three short blasts, again and again. He did not drink from any pool or eat strange berries. He stayed right by the big tree.', 'Appiagyei standing beside the same giant tree trunk blowing his bright red neck-whistle in late afternoon light, ignoring wild red berries on a nearby bush.'),
      pg('🌙', 'Night fell, and the air grew cool. He tucked dry leaves around his legs and stayed calm. The dark forest was full of sounds, yet they were only tree frogs, crickets, and an owl high overhead.', 'Under a starry indigo sky, Appiagyei sitting bravely among dry leaves against the giant tree, while an owl perches peacefully on a high branch and a tiny green frog sits on a leaf.'),
      pg('🔦', 'At dawn, the village searchers heard his whistle. “Over here!” he called. They found him tired and thirsty, yet safe and unharmed. His mother held him tight for a long time.', 'In golden early-morning light by the giant tree, Appiagyei’s mother kneels to hug him tightly while relieved village searchers with hand torches smile nearby.'),
      pg('💬', 'Some elders said the little people of the forest had watched over him. Others said he stayed safe because he kept calm and used his whistle. Nobody knew for sure, yet everyone agreed: stop, blow your whistle, stay put, and always tell a grown-up where you are going.', 'Back at the sunlit village compound, elders and neighbours gather warmly around Appiagyei and his mother while he holds a cup of clean water.'),
    ],
    activities: [
      { id: 'bf-c1', type: 'comprehension', afterPage: 2, question: 'What does Appiagyei do first when he realises he is lost?', options: ['Stops and sits down calmly', 'Runs in circles', 'Climbs a tall tree'], correctIndex: 0 },
      { id: 'bf-c2', type: 'comprehension', afterPage: 6, question: 'What do the villagers say about how he stayed safe?', options: ['They give two different explanations', 'They all agree it was magic', 'They all say it was luck'], correctIndex: 0 },
      { id: 'bf-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Appiagyei loses sight of his cousin.', 'He sits by a big tree and stays calm.', 'He blows his whistle in sets of three.', 'The searchers find him at dawn.'] },
      { id: 'bf-sel', type: 'sel', afterPage: 5, prompt: 'How would you feel if you were lost and then found safely?', feelingOptions: ['Scared', 'Calm', 'Brave', 'Relieved'] },
    ],
    glossary: [
      { word: 'whistle', definition: 'A small tube you blow into to make a clear, loud sound.', pages: [3, 5, 6] },
      { word: 'searchers', definition: 'People working together to find someone who is lost.', pages: [5] },
      { word: 'calm', definition: 'Steady, quiet, and not panicking.', pages: [4, 6] },
    ],
    culturalNotes: ['In some Ghanaian communities, elders say that people lost in the forest may be watched over by the little people of the forest. This story presents that community belief respectfully alongside the practical safety actions Appiagyei took, without claiming proof.', 'Core outdoor safety rules for children: stop, stay in one safe spot, signal in sets of three, never eat or drink unknown things, and always tell an adult before going out.'],
    reviewQuestions: ['Confirm with a school safety adviser that the lost-child steps (stop, stay put, whistle in threes, tell a grown-up) match local guidance.', 'Check with local elders that the community belief is phrased respectfully.'],
    guide: {
      overview: 'A reassuring outdoor safety story showing exactly what a child should do if separated near a forest, while respectfully showing two community explanations for his safe return. Form: realistic adventure.',
      lessonMinutes: 30, goals: ['Name four safety steps to follow if lost.', 'Explain the two explanations given by the villagers.', 'State why we always tell a grown-up before going out.'],
      subjects: [['Our World Our People', 'Personal safety'], ['English Language', 'Narrative reading']],
      before: ['Ask: what is the safest thing to do first if you get separated from your group?'], during: ['Pause on page 2: what rule from his teacher does Appiagyei remember?'],
      after: ['Create a four-step classroom safety poster.', 'Practise the three-short-blasts signal rhythm by clapping three times with the teacher.'],
      discussion: ['Why do the villagers offer two explanations?', 'Which safety steps in the story can every child practise?'],
      reflection: ['Which trusted adult always knows where you are after school?'],
      support: ['Use four picture cards showing each safety step in order.'], stretch: ['Write a short paragraph telling the morning rescue from the mother’s point of view.'],
      localise: ['Adapt the landscape to the bush, farm, or town paths near your school.'],
      factCheck: ['Stopping immediately, staying in one visible spot, signalling in bursts of three, and avoiding unknown water or berries are standard child outdoor-safety rules.'],
    },
  }),

  // 4
  mk({
    key: 'the-honey-gatherer-and-the-bees',
    title: 'The Honey Gatherer and the Bees',
    summary: 'A new tale in the folktale style (not an old story). Maame Pokua takes only half the honey and leaves half for the bees. Her neighbour takes it all, and the bees fly away.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['moral', 'cultural', 'nature'], themes: ['animals-and-habitats', 'farm-and-garden', 'community'], objectives: ['environmental-awareness', 'reasoning', 'responsibility', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['village-life'], wpm: 85, paceWord: 'Warm storytelling pace, firmer on the closing lesson', palette: ['#ca8a04', '#15803d'],
    voice: 'A warm storyteller; a wise, calm voice for Maame Pokua; a loud, boasting voice for the neighbour',
    characters: [
      'Maame Pokua: a wise older Ghanaian woman wearing an ochre-gold headscarf and earth-toned wrapper cloth, carrying a small clay smoke pot and a round woven basket.',
      'Her neighbour: an impatient man in a bright green shirt and brown trousers.',
      'Bees: golden-brown honeybees buzzing around natural hives high in tall forest-edge trees and farm blossoms.',
    ],
    music: 'A gentle buzzing hum and a warm kalimba (placeholder)',
    pages: [
      pg('🌳', 'Maame Pokua lived at the edge of the forest. She gathered honey from wild hives in the tall trees. Every dry season, she carried a clay smoke pot and a woven basket to the trees.', 'Maame Pokua walking calmly toward a tall forest-edge tree with a natural beehive high on a branch, carrying a small clay pot wisping gentle smoke and a woven basket.'),
      pg('🐝', 'She took only half of the honey. “Half for me, and half for the bees,” she said. “They must eat too.”', 'Maame Pokua placing golden honeycomb into her woven basket while carefully leaving rich golden honeycomb inside the tree hive as calm honeybees hover nearby.'),
      pg('😂', 'Her neighbour laughed. “You are foolish! Take it all and sell it! Be rich!” Maame Pokua shook her head. “If I take it all, what will the bees live on?”', 'The neighbour in his green shirt laughing and gesturing greedily toward the trees while Maame Pokua calmly shakes her head holding her half-filled basket.'),
      pg('💨', 'The neighbour took every drop of honey from the next hive. Thick smoke filled the air, and the bees flew away to find a new home. The next year, that tree stood empty.', 'Thick grey smoke billowing around a bare, empty hollow in a tree branch as a swarm of honeybees flies far away across the sky.'),
      pg('🌼', 'Maame Pokua’s hives stayed full of honey. Her bees also visited the blossoms on her farm, so her fruit trees bore plenty of sweet fruit.', 'Sunlit farm scene where golden honeybees visit white and yellow blossoms on lush orange and mango trees laden with ripe fruit beside Maame Pokua’s thriving tree hive.'),
      pg('💡', 'This tale teaches a clear lesson: take only what you need, and leave enough for others. Nature gives again when we treat it fairly.', 'Maame Pokua sitting peacefully under a shady fruit tree sharing a bowl of golden honey and fruit while her humbled neighbour listens respectfully.'),
    ],
    activities: [
      { id: 'hg-c1', type: 'comprehension', afterPage: 2, question: 'How much honey does Maame Pokua take from the hive?', options: ['Half', 'All of it', 'None'], correctIndex: 0 },
      { id: 'hg-c2', type: 'comprehension', afterPage: 4, question: 'What happens when the neighbour takes every drop of honey?', options: ['The bees fly away', 'The bees grow bigger', 'Nothing changes'], correctIndex: 0 },
      { id: 'hg-pr', type: 'prediction', afterPage: 3, prompt: 'What do you think will happen to the neighbour’s hive next year?', options: ['It will be empty', 'It will have double honey', 'It will turn to gold'] },
      { id: 'hg-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when you share fairly with others?', feelingOptions: ['Proud', 'Happy', 'Fair', 'Kind'] },
    ],
    glossary: [
      { word: 'honey', definition: 'A sweet, golden food that bees make from flower nectar.', pages: [1, 2, 4, 5] },
      { word: 'hives', definition: 'The homes where bees live and store their honey.', pages: [1, 5] },
      { word: 'foolish', definition: 'Unwise; acting without thinking about what will happen later.', pages: [3] },
    ],
    culturalNotes: ['Harvesting wild honey and keeping traditional hives are real livelihoods in forest and savanna communities across Ghana. This is a newly written moral tale in the folktale style, not an ancient traditional story.', 'Honeybees pollinate many fruit trees and farm crops. (Cocoa flowers are pollinated mainly by tiny midges, so this story focuses accurately on fruit trees.)'],
    reviewQuestions: ['Confirm that the honey-gathering details (smoke pot, dry season) fit local practice.', 'Ensure readers know this is a newly written moral tale in folktale style, as stated in the summary and notes.'],
    guide: {
      overview: 'A newly written moral tale about sustainable harvesting and leaving enough for nature to thrive, linking fair sharing with pollination in science.',
      lessonMinutes: 25, goals: ['State the moral of the story in your own words.', 'Explain why Maame Pokua leaves half of the honey.', 'Describe how bees help fruit trees grow fruit.'],
      subjects: [['Integrated Science', 'Bees, flowers and fruit'], ['English Language', 'Moral tales and comprehension']],
      before: ['Ask: where does honey come from, and what else do bees do for farms?'], during: ['Pause on page 3 and ask children whose advice seems wiser and why.'],
      after: ['Draw the two tree hives side by side: the cared-for hive and the empty hive.', 'Tell a short story about sharing water, fish, or firewood fairly.'],
      discussion: ['What is the difference between taking what you need and taking everything?'], reflection: ['How can we avoid wasting food or water at home and at school?'],
      support: ['Fold a paper circle in half to show “half for me, half for the bees”.'], stretch: ['Explain how Maame Pokua’s rule also applies to fishing in a river or cutting firewood.'],
      localise: ['Use local names for honeybees and familiar local fruit trees.', 'Remind learners that honeybees sting and only trained adults with protective methods harvest honey.'],
    },
  }),

  // 5
  mk({
    key: 'fosuaa-joins-class-three',
    title: 'Fosuaa Joins Class Three',
    summary: 'A new girl with dwarfism joins Class Three, and a boy calls her a spirit. A classmate stands up for her, the teacher explains kindly, and Fosuaa shines in the skipping game.',
    classIds: ['primary-2', 'primary-3', 'primary-4'], ageMin: 7, ageMax: 10, readingLevel: 'developing', difficulty: 2,
    genres: ['school-life', 'realistic-fiction', 'friendship'], themes: ['school', 'friendship', 'identity'], objectives: ['kindness', 'emotional-intelligence', 'reasoning', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Gentle and earnest, brightening joyfully at the end', palette: ['#0ea5e9', '#f59e0b'],
    voice: 'A gentle narrator; a clear, dignified voice for Fosuaa; a calm, warm voice for Madam Esi; a brave voice for Nuamah',
    characters: [
      'Fosuaa: a nine-year-old Ghanaian girl with proportionate/skeletal dwarfism (shorter stature than her classmates, depicted with warmth, dignity, and natural proportions), neat braided hair with yellow beads, wearing a crisp yellow-and-blue Ghanaian primary school uniform.',
      'Madam Esi: the kind Class Three teacher in a sky-blue and gold African-print dress.',
      'Nuamah: a nine-year-old Ghanaian boy in a matching yellow-and-blue school uniform who stands up for Fosuaa.',
      'Kofi (the boy who teased): a classmate in the same school uniform who apologises sincerely.',
    ],
    music: 'A soft, hopeful tune that lifts into a lively skipping rhythm at the end (placeholder)',
    pages: [
      pg('🏫', 'A new girl named Fosuaa came to Class Three. She was shorter than the other nine-year-olds. Madam Esi smiled and told the class, “Fosuaa was born with dwarfism. Her bones grow in a different way, and she is just like you in every other way.”', 'Inside a bright Ghanaian classroom, kind teacher Madam Esi stands warmly beside nine-year-old Fosuaa—who is shorter in stature with neat braids and yellow beads in the same school uniform—introducing her to classmates at wooden desks.'),
      pg('😞', 'At break time, a boy whispered, “She is a little forest spirit!” A few children giggled. Fosuaa looked down at her sandals, and her eyes filled with tears.', 'Out in the sunlit schoolyard at break, Fosuaa stands looking down sadly with tearful eyes while two classmates whisper at a short distance.'),
      pg('✋', 'Nuamah felt ashamed because he had laughed at first too. He stepped forward beside Fosuaa and raised his hand. “Stop,” he said clearly. “Her name is Fosuaa. She is a girl, not a spirit.”', 'In the schoolyard, Nuamah stands bravely right beside Fosuaa with one hand raised respectfully to stop the teasing, looking earnest and kind.'),
      pg('📘', 'Back in the classroom, Madam Esi spoke calmly to everyone. “Dwarfism is a medical condition. Fosuaa is a person, just like all of you. Elders tell the old forest stories with respect, and those stories are never about our classmates.”', 'Back inside the quiet classroom, Madam Esi speaks gently and seriously at the front while all the children, including Fosuaa and Nuamah, sit attentively at their desks.'),
      pg('🙏', 'After the lesson, the boy walked over to Fosuaa. “I am sorry, Fosuaa,” he said. “What I said was unkind.” Fosuaa looked up and nodded. “Thank you,” she said. “Please call me by my name.”', 'By the classroom veranda, the apologetic classmate bows his head slightly with hands together saying sorry to Fosuaa, who looks up calmly with dignity while Nuamah watches warmly.'),
      pg('🪢', 'At the next break, Fosuaa joined the skipping game. She jumped lightly and counted higher than anyone else! “Go, Fosuaa!” her classmates cheered together.', 'Joyful sunlit schoolyard scene where two classmates turn a long skipping rope while smiling Fosuaa jumps happily in the middle and Nuamah and friends clap and cheer.'),
    ],
    activities: [
      { id: 'nj-c1', type: 'comprehension', afterPage: 3, question: 'What does Nuamah do after realising teasing is wrong?', options: ['Steps forward and stands up for Fosuaa', 'Keeps laughing', 'Walks away silently'], correctIndex: 0 },
      { id: 'nj-c2', type: 'comprehension', afterPage: 4, question: 'What does Madam Esi explain about dwarfism?', options: ['It is a medical condition', 'It comes from folklore', 'It is a game'], correctIndex: 0 },
      { id: 'nj-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Fosuaa joins Class Three.', 'A boy teases her at break time.', 'Nuamah stands up for her and Madam Esi explains.', 'The boy apologises and Fosuaa shines at skipping.'] },
      { id: 'nj-sel', type: 'sel', afterPage: 5, prompt: 'How does it feel when someone apologises sincerely and calls you by your name?', feelingOptions: ['Relieved', 'Respected', 'Happy', 'Forgiving'] },
    ],
    glossary: [
      { word: 'dwarfism', definition: 'A medical condition in which a person’s bones grow differently, making them much shorter than average.', pages: [1, 4] },
      { word: 'ashamed', definition: 'Feeling sorry and uncomfortable about something wrong you did.', pages: [3] },
      { word: 'unkind', definition: 'Not caring or friendly; hurting someone’s feelings.', pages: [5] },
    ],
    culturalNotes: ['Children and adults with dwarfism are sometimes unfairly teased with names from folklore. This story states plainly that dwarfism is a natural medical condition and every classmate is a person deserving respect.', 'Calling people by their own name—as Fosuaa asks—models everyday dignity and inclusion.', 'The story honours elders’ oral traditions while drawing a firm line against using folklore to tease anyone.'],
    reviewQuestions: ['Invite a disability inclusion educator or advocate to review the wording and illustrations for dignity and accuracy.', 'Confirm that no real pupil in the classroom is singled out during discussion.'],
    guide: {
      overview: 'An inclusive school story about empathy, upstander courage, sincere apology, and why folklore must never be used to tease classmates with dwarfism or any physical difference.',
      lessonMinutes: 30, goals: ['Explain why teasing hurts and why names matter.', 'Demonstrate one respectful way to stand up for a classmate.', 'Distinguish medical facts about human diversity from folklore.'],
      subjects: [['Our World Our People', 'Respect, inclusion and human dignity'], ['English Language', 'Narrative reading and empathy']],
      before: ['Ask: what makes someone feel welcome on their very first day in a new class?'], during: ['Pause after page 3: why was Nuamah brave even though he had laughed at first?'],
      after: ['Practise kind upstander sentences in pairs (“Stop, please use their name”).', 'Make a class welcome banner celebrating everyone’s strengths.'],
      discussion: ['Why did Fosuaa ask her classmates to call her by her name?', 'What makes an apology feel genuine?'],
      reflection: ['How can you help a new classmate feel included at break time?'],
      support: ['Match feeling cards to how Fosuaa feels at the start, middle, and end of the story.'], stretch: ['Write a short diary entry by Nuamah about what he learned that day.'],
      localise: ['Keep discussions general and supportive so every learner feels safe and respected.'],
    },
  }),

  // 6
  mk({
    key: 'two-kinds-of-truth',
    title: 'Two Kinds of Truth',
    summary: 'Ayisi asks her grandfather whether all the old stories are true. He explains that some accounts tell checkable facts about the world, while folktales teach wisdom about how to live.',
    classIds: ['primary-3', 'primary-4', 'jhs-1'], ageMin: 8, ageMax: 11, readingLevel: 'developing', difficulty: 3,
    genres: ['realistic-fiction', 'cultural', 'educational'], themes: ['family', 'identity', 'community'], objectives: ['reasoning', 'cultural-heritage', 'summarising', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Thoughtful and unhurried, with a pause after each question', palette: ['#6d28d9', '#ca8a04'],
    voice: 'A warm, measured grandfather voice for Nana Boakye; an inquisitive girl’s voice for Ayisi',
    characters: [
      'Ayisi: a ten-year-old Ghanaian girl with neat cornrows and a purple blouse over a patterned skirt, holding a blank-paged exercise book and pencil.',
      'Nana Boakye: her wise grandfather with a trimmed white beard, wearing a warm gold-and-violet kente-patterned cloth over his shoulder and holding a carved walking stick on their compound veranda.',
    ],
    music: 'A soft evening guitar and the sound of crickets (placeholder)',
    pages: [
      pg('🌆', 'After supper, Ayisi sat on the veranda with her grandfather and asked, “Nana, is Ananse real? Is every story true?” Nana Boakye set down his cup. “That is a very good question,” he said.', 'Ayisi with her notebook and pencil sitting beside white-bearded Nana Boakye on a warm lantern-lit Ghanaian veranda at dusk, Nana setting a clay cup on a small wooden table.'),
      pg('🔍', '“Some accounts tell us what really happens in nature,” said Nana. “The Earth spins, so we have day and night. We can test and check that in books and with our own eyes. That is one kind of truth.”', 'Nana Boakye pointing gently up toward the twilight sky where the first evening stars glow, while Ayisi looks up thoughtfully from the veranda.'),
      pg('🕸️', '“Other stories are told to teach us how to live,” Nana continued. “When elders tell of Ananse, we cannot check whether a spider won Nyame’s stories. Yet the tale teaches us that clever thinking and teamwork matter. That is another kind of truth.”', 'Nana Boakye gesturing expressively like a traditional storyteller while Ayisi smiles, imagining a tiny friendly spider web glistening on the veranda rail nearby.'),
      pg('⚖️', '“So we must never tell a folktale as if it were a fact we can measure,” said Nana. “And we must never call an old story worthless just because it is a tale. We say clearly what kind of story it is, and we treasure the wisdom it teaches.”', 'On the veranda, Nana Boakye holds out both hands like a balanced scale—a science book on one side of the low table and a carved wooden drum on the other—while Ayisi watches.'),
      pg('📝', 'Ayisi opened her exercise book and drew two neat columns. On one side, she sketched things we can check: day and night, rain clouds, and bees visiting flowers. On the other side, she sketched stories that teach wisdom: Ananse’s gourd and forest tales.', 'Ayisi leaning over the veranda table drawing tiny simple pictures—a sun, rain cloud, and bee on one side, and a gourd and drum on the other—in her open notebook with a pencil while Nana smiles.'),
      pg('🌠', 'Ayisi looked up and smiled. “I can value both,” she said. Nana nodded proudly. “You have understood, my child. Keep asking questions, respect our elders’ tales, and always know which is which.”', 'Ayisi and Nana Boakye smiling warmly together on the peaceful veranda under a deep purple-indigo night sky filled with bright stars.'),
    ],
    activities: [
      { id: 'tk-c1', type: 'comprehension', afterPage: 3, question: 'What is the first kind of truth Nana Boakye describes?', options: ['Facts we can check and observe', 'Rumours nobody checks', 'Secret riddles'], correctIndex: 0 },
      { id: 'tk-c2', type: 'comprehension', afterPage: 4, question: 'What does Nana say we should do with folktales we cannot check as facts?', options: ['Say what kind of story they are and keep their wisdom', 'Throw them away', 'Claim they are scientific proof'], correctIndex: 0 },
      { id: 'tk-s1', type: 'sequencing', prompt: 'Put Nana’s ideas in order.', items: ['Some accounts state checkable facts about the world.', 'Folktales teach wisdom about how to live.', 'We should state clearly which kind a story is.', 'We can value both checkable science and wise tales.'] },
      { id: 'tk-voc', type: 'vocabulary', afterPage: 4, word: 'worthless', definition: 'Having no value, importance, or use.', distractors: ['Very heavy', 'Easy to measure'] },
    ],
    glossary: [
      { word: 'check', definition: 'To test or examine something carefully to see whether it is accurate.', pages: [2, 3, 5] },
      { word: 'elders', definition: 'Older members of a community respected for their experience and wisdom.', pages: [3, 6] },
      { word: 'wisdom', definition: 'Good judgement and understanding about how to live well.', pages: [4, 5] },
    ],
    culturalNotes: ['This story models respectful critical thinking: neither dismissing Ghanaian oral literature nor confusing folktales with empirical science.', 'Examples of checkable phenomena (Earth’s rotation, the water cycle, pollination) link directly to Upper Primary and JHS Integrated Science.', 'Pairs naturally with the rest of Batch 30, giving learners clear language to distinguish checkable facts, community beliefs, and moral tales.'],
    reviewQuestions: ['Confirm that both scientific inquiry and oral tradition are treated with equal dignity.', 'Check whether teachers prefer pairing “checkable facts” with “teaching stories” in classroom charts.'],
    guide: {
      overview: 'A thoughtful intergenerational dialogue that equips learners to distinguish empirical, checkable facts from moral and cultural stories without disrespecting either. Form: reflective dialogue.',
      lessonMinutes: 30, goals: ['Distinguish a checkable fact from a story told to teach wisdom.', 'Sort six statements into “Facts we can check” and “Stories that teach”.', 'Explain why communities preserve traditional folktales.'],
      subjects: [['English Language', 'Reading, reasoning and summarising'], ['Integrated Science', 'Observation and evidence'], ['History', 'Oral tradition']],
      before: ['Ask: how do we check whether it rained last night, and how is that different from learning a lesson in an Ananse tale?'], during: ['Pause after page 4 and ask learners to restate Nana’s balance in their own words.'],
      after: ['Draw a two-column chart like Ayisi’s and place three science facts and three folktales in it.', 'Share one proverb or folktale from home and state the lesson it teaches.'],
      discussion: ['Is a story worthless if it never happened literally? Why or why not?', 'Why is it honest to say “elders tell this story” rather than “science proved this”?'],
      reflection: ['Which family story or proverb has taught you something helpful?'],
      support: ['Provide six illustrated cards for learners to sort into the two columns together.'], stretch: ['Write a short paragraph explaining one scientific fact and one folktale about the night sky.'],
      localise: ['Include folktales and proverbs from the languages spoken in your classroom.'],
    },
  }),

  // 7
  mk({
    key: 'the-girl-who-wrote-down-the-stories',
    title: 'The Girl Who Wrote Down the Stories',
    summary: 'Esaaba asks an elder for permission to write down one of her stories. She listens carefully, asks about unfamiliar words, reads her draft back for checking, and credits the elder by name.',
    classIds: ['primary-3', 'primary-4', 'jhs-1'], ageMin: 8, ageMax: 11, readingLevel: 'developing', difficulty: 3,
    genres: ['realistic-fiction', 'cultural', 'educational'], themes: ['community', 'identity', 'citizenship'], objectives: ['cultural-heritage', 'oral-language', 'summarising', 'responsibility'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Warm, attentive, and steady', palette: ['#b45309', '#1d4ed8'],
    voice: 'A polite, bright girl’s voice for Esaaba; a warm, unhurried elder’s voice for Nana Ama Serwaa',
    characters: [
      'Esaaba: an eleven-year-old Ghanaian girl with braided hair tied back with a blue ribbon, wearing a neat blue-and-amber school uniform and carrying a lined exercise book and pencil.',
      'Nana Ama Serwaa: a dignified elderly Ghanaian woman with silver hair, wearing a warm amber-and-indigo traditional cloth wrapper, seated on a carved low wooden stool in a shady courtyard.',
      'Class teacher: a smiling Ghanaian teacher in a crisp collared shirt holding the bound class storybook.',
    ],
    music: 'A soft, slow drum and gentle humming (placeholder)',
    pages: [
      pg('📓', 'Esaaba’s teacher asked the class to collect a traditional story from an elder. Esaaba visited Nana Ama Serwaa in her courtyard. “Nana, may I have your permission to write down one of your stories?” she asked politely. “I will write your name as the storyteller.”', 'Esaaba bowing slightly in polite Ghanaian greeting with her closed notebook and pencil before elderly Nana Ama Serwaa, who sits on a carved wooden stool under a courtyard mango tree.'),
      pg('👂', 'Nana smiled warmly. “Yes, if you listen well.” Esaaba sat quietly and listened without interrupting. Whenever she heard a word she did not know, she waited for a pause and asked, “How do you say that word, and what does it mean?”', 'Esaaba sitting on a woven mat with her pencil poised attentively while Nana Ama Serwaa speaks with expressive storytelling gestures.'),
      pg('✏️', 'Esaaba wrote the story neatly in her exercise book. She kept the special Twi words Nana used, and she recorded the date and the name of their village at the top of the page.', 'Close warm scene of Esaaba writing carefully with her pencil in her open exercise book resting on her lap under the shade tree while Nana watches kindly.'),
      pg('📖', 'When she finished, Esaaba read every line back to Nana. “Have I written it accurately?” she asked. Nana listened closely and corrected one detail: “The chief’s drum is an atumpan talking drum.” Esaaba fixed the line right away.', 'Esaaba holding up her open notebook and reading aloud to Nana Ama Serwaa, who points gently with one finger as she shares a helpful correction.'),
      pg('🏷️', 'At the top of the clean page, Esaaba wrote that the story was told by Nana Ama Serwaa in their village. Nana nodded with pride. “Now it is written down, and it still carries my name.”', 'Nana Ama Serwaa smiling with pride and placing a warm hand on Esaaba’s shoulder as they look together at the finished notebook in the sunny courtyard.'),
      pg('🌍', 'At school, Esaaba’s teacher bound everyone’s pages into a class storybook. Every story honoured the elder who had shared it. “A story is a gift,” said the teacher. “We take care of it, and we always credit the person who gave it to us.”', 'Inside a cheerful classroom, the teacher holds open a colourful handmade class storybook for Esaaba and her smiling classmates gathered around.'),
    ],
    activities: [
      { id: 'wd-c1', type: 'comprehension', afterPage: 2, question: 'What does Esaaba do when she hears an unfamiliar word?', options: ['Waits politely and asks what it means', 'Ignores it completely', 'Makes up a different word'], correctIndex: 0 },
      { id: 'wd-c2', type: 'comprehension', afterPage: 5, question: 'Why does Esaaba write Nana Ama Serwaa’s name on the story?', options: ['To credit the elder who told it', 'To fill empty space', 'To pretend Nana wrote the homework'], correctIndex: 0 },
      { id: 'wd-s1', type: 'sequencing', prompt: 'Put Esaaba’s steps in order.', items: ['Ask the elder for permission.', 'Listen carefully and ask about unfamiliar words.', 'Write the story neatly with the date and village.', 'Read it back for checking and credit the storyteller.'] },
      { id: 'wd-sel', type: 'sel', afterPage: 6, prompt: 'How would you feel if someone recorded your family’s story carefully and honoured your name?', feelingOptions: ['Proud', 'Respected', 'Happy', 'Honoured'] },
    ],
    glossary: [
      { word: 'elder', definition: 'An older person in the community respected for wisdom and experience.', pages: [1, 6] },
      { word: 'permission', definition: 'Clear agreement allowing someone to do something.', pages: [1] },
      { word: 'interrupting', definition: 'Speaking over someone before they have finished talking.', pages: [2] },
    ],
    culturalNotes: ['Oral traditions belong to the storytellers and communities who carry them. Asking permission, listening without interrupting, checking accuracy, and crediting the teller by name are core ethical practices in oral history.', 'If an elder prefers that a particular family or sacred account not be written down, learners must respect that refusal cheerfully.'],
    reviewQuestions: ['Confirm that the five fieldwork steps align with local community expectations and school project guidelines.'],
    guide: {
      overview: 'A practical, respectful model of oral-history fieldwork for upper primary and JHS learners: permission, active listening, checking back, and attribution.',
      lessonMinutes: 35, goals: ['List the steps for collecting an oral story ethically.', 'Explain why we read a draft back and credit the storyteller.', 'Practise polite interview questions with a partner.'],
      subjects: [['English Language', 'Listening, note-taking and editing'], ['History', 'Oral history methods'], ['Our World Our People', 'Respect for elders and heritage']],
      before: ['Ask: if you tell a friend your own story and they share it as theirs, how do you feel?'], during: ['Pause on page 4: why did Esaaba read her draft back to Nana Ama Serwaa?'],
      after: ['With family permission, collect a short proverb or folktale at home and credit the teller, date, and town.', 'Compile a class anthology celebrating local storytellers.'],
      discussion: ['Why do date, place, and storyteller’s name matter when preserving oral history?'], reflection: ['Which elder in your family or neighbourhood would you love to listen to?'],
      support: ['Give learners a simple interview template: Teller’s Name, Place, Date, Story, Checked With Teller.'], stretch: ['Collect two tellings of a well-known tale from two elders and note how each teller makes it unique.'],
      localise: ['Keep original home-language terms alongside clear English explanations, just as Esaaba kept Nana’s Twi words.'],
    },
  }),

  // 8
  mk({
    key: 'the-night-the-forest-listened',
    title: 'The Night the Forest Listened',
    summary: 'A new tale in the folktale style. Aboagyewaa and her grandmother sit quietly at dusk near their farm, count four signs of night wildlife—frogs, crickets, an owl, and a fruit bat—and walk safely home before dark.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['nature', 'cultural', 'bedtime'], themes: ['night-sky', 'animals-and-habitats', 'family'], objectives: ['scientific-curiosity', 'environmental-awareness', 'oral-language', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['village-life'], wpm: 85, paceWord: 'Slow and hushed, with gentle pauses for listening', palette: ['#1e3a8a', '#166534'],
    voice: 'A hushed, soothing storyteller voice; Aboagyewaa’s soft whisper; Grandma’s calm warmth',
    characters: [
      'Aboagyewaa: an eight-year-old Ghanaian girl with neat braided puffs, wearing a soft indigo-and-yellow cloth skirt and a cosy green cardigan, sitting on a low wooden stool.',
      'Grandma: her calm, loving grandmother in a deep-blue and green patterned wrapper cloth and headwrap, sitting right beside her.',
      'Night wildlife: green stream frogs, tiny grass crickets, a spotted brown owl in a tall tree, and a small fruit bat gliding over mango trees.',
    ],
    music: 'Soft frogs and crickets, then peaceful evening quiet (placeholder)',
    pages: [
      pg('🌆', 'At dusk, Aboagyewaa and her grandmother sat on low wooden stools at the edge of their farm. “Hush,” said Grandma softly. “Tonight we will not talk. Tonight we will listen.”', 'Aboagyewaa in her green cardigan and Grandma in her blue-and-green cloth sitting side by side on low wooden stools at the peaceful edge of a Ghanaian farm under a warm orange-and-indigo sunset sky.'),
      pg('🐸', 'First came the frogs: “Croak, croak.” They were calling from the wet bank by the stream. Aboagyewaa held up one finger. “One sound,” she whispered.', 'Two small green frogs calling on wet stones beside a gentle farm stream at twilight while Aboagyewaa sits beside Grandma holding up one finger clearly and smiling quietly.'),
      pg('🦗', 'Next came the crickets: “Tri-tri-tri.” Tiny insects were singing together in the tall grass. Aboagyewaa held up two fingers. “Two sounds,” she whispered.', 'Tiny brown crickets chirping on blades of tall green grass in the foreground while Aboagyewaa sits peacefully beside Grandma holding up two fingers clearly.'),
      pg('🦉', 'Then came a soft “Hoo, hoo” from a tall tree. An owl was awake! Many animals come out at night to hunt or look for food, and the owl was one of them. Aboagyewaa held up three fingers.', 'A spotted brown owl perched on a leafy tree branch against the deepening blue dusk sky while below Aboagyewaa looks up beside Grandma holding up three fingers clearly.'),
      pg('🦇', 'A small fruit bat glided silently over the mango trees. Aboagyewaa could not hear a sound, yet she watched its dark wings cross the twilight sky in search of ripe fruit. She held up four fingers.', 'A small gentle fruit bat gliding across the violet-blue twilight sky above ripe mango trees while Aboagyewaa watches in wonder beside Grandma, holding up four fingers clearly.'),
      pg('🌠', 'Aboagyewaa smiled. “The forest is not asleep. It is listening and speaking.” Grandma nodded. “That is why we care for it, and why we walk home together before full dark.” Hand in hand, they walked safely home.', 'Aboagyewaa and Grandma walking hand in hand along a warm footpath toward their lantern-lit village house under the first twinkling evening stars.'),
    ],
    activities: [
      { id: 'nf-c1', type: 'comprehension', afterPage: 4, question: 'Which animal made a soft “Hoo, hoo” sound from a tree?', options: ['The owl', 'The frog', 'The cricket'], correctIndex: 0 },
      { id: 'nf-c2', type: 'comprehension', afterPage: 6, question: 'Why do Aboagyewaa and Grandma walk home before full dark?', options: ['To stay safe together', 'To scare the owl', 'To chase the bat'], correctIndex: 0 },
      { id: 'nf-s1', type: 'sequencing', prompt: 'Put the four animals in the order Aboagyewaa noticed them.', items: ['The frogs croak by the stream.', 'The crickets sing in the grass.', 'The owl hoots in a tall tree.', 'A fruit bat glides silently over the mango trees.'] },
      { id: 'nf-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when you sit quietly and listen to nature?', feelingOptions: ['Calm', 'Curious', 'Sleepy', 'Peaceful'] },
    ],
    glossary: [
      { word: 'dusk', definition: 'The quiet time of evening just after sunset, before full dark.', pages: [1] },
      { word: 'crickets', definition: 'Small jumping insects that make a rhythmic chirping sound.', pages: [3] },
      { word: 'glided', definition: 'Moved smoothly and quietly through the air.', pages: [5] },
    ],
    culturalNotes: ['Sitting quietly at dusk and walking home safely before nightfall are familiar rhythms in farming communities across Ghana. This is a newly written nature and bedtime story, not a traditional folktale.', 'Introduces nocturnal animals accurately and gently without frightening young listeners.'],
    reviewQuestions: ['Confirm that frogs, crickets, owls, and fruit bats match familiar farm-edge wildlife in your region.', 'Ensure the story is clearly understood as a newly written nature tale.'],
    guide: {
      overview: 'A calm dusk listening story that builds observation skills, counting to four, knowledge of nocturnal animals, and safe evening habits.',
      lessonMinutes: 20, goals: ['Name the four dusk and night animals in order.', 'Explain why nocturnal animals come out at dusk and night.', 'State why children walk home with a trusted adult before dark.'],
      subjects: [['Integrated Science', 'Nocturnal animals and habitats'], ['English Language', 'Listening, sequencing and vocabulary']],
      before: ['Ask: what gentle nature sounds can you hear outside in the early evening?'], during: ['Have learners hold up one, two, three, and four fingers silently along with Aboagyewaa.'],
      after: ['Sit completely still for thirty seconds and count how many everyday sounds the class can hear.', 'Draw a twilight farm scene showing all four animals.'],
      discussion: ['Which three animals did Aboagyewaa hear, and which one did she notice only with her eyes?', 'Why is it wise to head home with an adult before full dark?'],
      reflection: ['What is your favourite peaceful sound in the evening?'],
      support: ['Match picture cards of the frog, cricket, owl, and fruit bat to 1, 2, 3, and 4 fingers.'], stretch: ['Write four quiet couplet lines describing two evening animal sounds.'],
      localise: ['Include familiar evening sounds from your own town or village, such as geckos or nightjars.'],
    },
  }),
];
