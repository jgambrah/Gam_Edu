/**
 * "Efua’s Honest Business": the first premium-benchmark story. Revised manuscript, activities, glossary, teacher’s guide,
 * character and setting bible and shot list.
 *
 * EDITORIAL STATUS: revised draft, NOT yet reviewed by a Ghanaian educator, a native speaker, or a financial-literacy
 * reviewer. Prices are illustrative. Illustrations: briefs and a shot list only; NO image exists. Narration in the preview
 * is robotic placeholder audio. See docs/story-spark/EFUA-MANUSCRIPT-REVIEW.md for what changed and why.
 */
import type { Activity, GlossaryEntry } from '../premium';
import type { CharacterSheet, IllustrationPlan, SettingSheet, Shot } from '../illustration/plan';
import { STORY_SPARK_CINEMATIC_3D } from '../illustration/style';
import type { TeacherGuide } from './teacher-guide';

export interface EfuaPage { text: string; alt: string; motif: string; brief: string; narration: string }

export const EFUA_PAGES: EfuaPage[] = [
  { text: 'On Saturday mornings, Nana Ama’s kitchen smelled of roasting groundnuts. Efua stood beside her grandmother, stirring the bubbling sugar and watching the nuts turn golden. ‘Quick hands and patient eyes,’ said Nana Ama. ‘That is the whole secret.’',
    alt: 'A thirteen-year-old girl stirs a pot beside her grandmother in a warm kitchen, golden groundnuts and sugar glowing in the pot.', motif: '🥜👵',
    brief: 'See shot list, page 1.', narration: 'Warm, unhurried, a smile in the voice. Let "quick hands and patient eyes" sound like a saying Nana Ama repeats.' },
  { text: 'Efua had a plan. If she learned the recipe, she could sell groundnut cakes at the school gate after lessons and earn enough to buy her own exercise books and pens. ‘A plan is only a wish until you do the sums,’ said Nana Ama, smiling. ‘Go and count.’',
    alt: 'Efua holds a wooden spoon and looks hopefully at her grandmother, who points playfully towards an exercise book on the table.', motif: '💡📒',
    brief: 'See shot list, page 2.', narration: 'Bright and hopeful for the plan; Nana Ama gentle and teasing.' },
  { text: 'That night, Efua did the arithmetic in her exercise book. The ingredients for twenty packs cost twelve cedis. If she sold each pack for one cedi, she would make eight cedis profit. ‘Eight cedis a day,’ she whispered. ‘Over five school days, that is forty cedis a week.’',
    alt: 'Efua writes costs and profit in an exercise book under a lamp, concentrating.', motif: '🧮📒',
    brief: 'See shot list, page 3.', narration: 'Measured, working-it-out pace; slow and clear on every number (twelve, one, eight, forty).' },
  { text: 'On Monday she sold fourteen packs, and six were left over. On Tuesday she sold sixteen. People said the cakes were crunchy, fresh and not too sweet. But by Wednesday, the leftover cakes had gone a little soft in the damp air.',
    alt: 'Efua at the school gate hands a small pack to a student; a bag of leftover packs sits at her feet.', motif: '🏫💰',
    brief: 'See shot list, page 4.', narration: 'Picks up pace for the sales, then slows and dips on "gone a little soft".' },
  { text: 'On Wednesday, Kwabena pulled her aside near the school gate. He glanced at the soft cakes in her bag. ‘You are wasting money,’ he said. ‘Use fewer groundnuts and a bit more sugar. Nobody will notice.’',
    alt: 'Kwabena leans in towards Efua near the school gate, speaking quietly while she looks uncertain.', motif: '🤫😬',
    brief: 'See shot list, page 5.', narration: 'Kwabena smooth, friendly, reasonable-sounding. Not a villain.' },
  { text: '‘And those old packs?’ said Kwabena. ‘Tell people they are fresh today. Do all this and you will make twice the profit.’ He smiled as if it were the most sensible idea in the world, and Efua did not know what to say.',
    alt: 'Kwabena smiles confidently, pointing at the bag of old packs; Efua hesitates, biting her lip.', motif: '😏🤔',
    brief: 'See shot list, page 6.', narration: 'Confident, easy. A beat of silence after "fresh today" before the final clause. Efua’s silence lands.' },
  { text: 'Efua did the sums again that night, by the light of a small lamp. With fewer groundnuts, twenty packs would cost nine cedis, so she would make eleven cedis profit. That was not twice as much, as Kwabena had promised. It was only three cedis more. Still, he was right about one thing: she could make more. But she kept thinking about her customers. They trusted her, and trust, she realised, was worth more than three cedis a day.',
    alt: 'Efua sits alone by lamplight with her exercise book, thinking hard; a window shows the night sky.', motif: '🕯️🤔',
    brief: 'See shot list, page 7.', narration: 'Slow, reflective. Let each number breathe. Slow further on "trust" and lower the voice on the last line.' },
  { text: 'The next morning, Efua visited Auntie Dede, who sold vegetables at the market. ‘Customers are like a garden,’ said Auntie Dede, arranging her tomatoes. ‘Treat them well and they return all year. Cheat them once and they will remember it forever.’',
    alt: 'A kind market trader arranges tomatoes at her stall and speaks to Efua, who listens carefully.', motif: '🍅🧑‍🌾',
    brief: 'See shot list, page 8.', narration: 'Auntie Dede warm, firm, experienced; a gentle smile in the voice on "garden".' },
  { text: 'Efua kept her recipe honest. She even added a few extra groundnuts to every pack, which raised her cost to thirteen cedis for twenty. She wrote the day each batch was made on a small label. And she put the leftover cakes in a separate bag marked ‘Yesterday, half price’.',
    alt: 'Efua’s hands fill a pack with groundnut cakes and write the date on a label; a second bag is marked as half price.', motif: '🏷️🥜',
    brief: 'See shot list, page 9.', narration: 'Quiet pride, steady pace. Read the label text clearly.' },
  { text: 'Some days, Efua made less profit. But students liked knowing exactly what they were buying, and many of them bought the half-price packs gladly. Every week, the line at the school gate grew a little longer.',
    alt: 'A longer queue of cheerful students at the school gate, Efua serving with a smile.', motif: '🚶‍♀️🚶‍♂️',
    brief: 'See shot list, page 10.', narration: 'Even, content, building quietly.' },
  { text: 'One afternoon, Kwabena stood in the line like everyone else. ‘I said you were wasting money,’ he admitted. ‘But it turns out the extra groundnuts were never wasted.’ Efua smiled and held out a fresh pack. ‘That will be one cedi,’ she said.',
    alt: 'Kwabena, at the front of the queue, sheepishly smiles as Efua holds out a pack of groundnut cakes.', motif: '🤝🌟',
    brief: 'See shot list, page 11.', narration: 'Kwabena a little sheepish, honest. Efua’s last line dry and warm: she charges him, and it is funny.' },
  { text: 'By the end of the month, Efua was selling twenty-five packs a day. She was making a little more profit than she had first planned, and her customers trusted her cakes. That night she opened her exercise book and wrote the date at the top of a new page. Then she began, carefully and honestly, to do the sums.',
    alt: 'Efua writes the date at the top of a fresh page in her exercise book, smiling quietly, a jar of groundnuts beside her.', motif: '📒✨',
    brief: 'See shot list, page 12.', narration: 'Satisfied, understated; slow down on the last sentence and let "honestly" settle.' },
];

export const EFUA_ACTIVITIES: Activity[] = [
  { id: 'efua-c-profit', type: 'comprehension', afterPage: 3, question: 'How much profit did Efua expect each day from twenty packs?', options: ['Eight cedis', 'Twelve cedis', 'Twenty cedis'], correctIndex: 0, explanation: 'She would take in twenty cedis and spend twelve on ingredients, so the profit is eight cedis.' },
  { id: 'efua-v-profit', type: 'vocabulary', afterPage: 3, word: 'profit', definition: 'The money left over after you pay the costs.', distractors: ['The money you borrow', 'The cost of the ingredients'] },
  { id: 'efua-c-leftover', type: 'comprehension', afterPage: 4, question: 'Why did Efua have six packs left over on Monday?', options: ['She made twenty packs but sold only fourteen', 'She dropped six packs on the way', 'She gave six packs away'], correctIndex: 0, explanation: 'Twenty packs minus the fourteen she sold leaves six.' },
  { id: 'efua-pred', type: 'prediction', afterPage: 6, prompt: 'What do you think Efua will do? What would you do, and why?' },
  { id: 'efua-c-claim', type: 'comprehension', afterPage: 7, question: 'Kwabena promised twice the profit. What do Efua’s sums show?', options: ['Only three cedis more, not twice as much', 'Exactly twice as much', 'Less profit than before'], correctIndex: 0, explanation: 'Eleven cedis is three more than eight. Twice eight would be sixteen. Kwabena’s claim was bigger than the truth.' },
  { id: 'efua-v-trust', type: 'vocabulary', afterPage: 7, word: 'trust', definition: 'Believing that someone is honest and will treat you fairly.', distractors: ['A kind of money', 'A shop at the market'] },
  { id: 'efua-inf', type: 'comprehension', afterPage: 8, question: 'What did Auntie Dede mean by "Customers are like a garden"?', options: ['Good treatment brings customers back again and again', 'Customers need to be watered', 'Efua should sell vegetables'], correctIndex: 0, explanation: 'A garden grows when you look after it, and so does a business.' },
  { id: 'efua-c-cost', type: 'comprehension', afterPage: 9, question: 'Each pack with extra groundnuts costs 65 pesewas to make. What do twenty packs cost?', options: ['Thirteen cedis', 'Twelve cedis', 'Sixty-five cedis'], correctIndex: 0, explanation: '65 pesewas times 20 is 1,300 pesewas, which is 13 cedis (100 pesewas make one cedi).' },
  { id: 'efua-c-half', type: 'comprehension', afterPage: 9, question: 'Why was the half-price bag an honest way to sell the leftover cakes?', options: ['Customers were told the truth and got a lower price', 'It hid that the cakes were old', 'It cost Efua more to make'], correctIndex: 0, explanation: 'Selling old cakes at a fair lower price, clearly labelled, is honest. Calling them fresh is not.' },
  { id: 'efua-think', type: 'prediction', afterPage: 10, prompt: 'Some days Efua made less profit. Was honesty still a good business choice? Use the story to explain.' },
  { id: 'efua-sel', type: 'sel', afterPage: 11, prompt: 'Think of a time someone pushed you to take a shortcut. What helped you decide?', feelingOptions: ['Pressured', 'Confident', 'Unsure', 'Proud'] },
  { id: 'efua-seq', type: 'sequencing', afterPage: 12, prompt: 'Put these events in order.', items: ['Efua works out her costs and profit.', 'Kwabena suggests a shortcut.', 'Auntie Dede gives advice.', 'Efua starts labelling each batch.', 'Kwabena joins the line.'] },
  { id: 'efua-life', type: 'sel', afterPage: 12, prompt: 'If you sold something, what would you want your customers to say about you?' },
];

export const EFUA_GLOSSARY: GlossaryEntry[] = [
  { word: 'arithmetic', definition: 'Working with numbers, such as adding and subtracting.', pages: [3] },
  { word: 'ingredients', definition: 'The foods that are mixed together to make a dish.', pages: [3] },
  { word: 'profit', definition: 'The money left over after you pay the costs.', pages: [3, 6, 7] },
  { word: 'leftover', definition: 'Not used or sold, and still there afterwards.', pages: [4, 9] },
  { word: 'customers', definition: 'People who buy things from a shop or seller.', pages: [7, 8] },
  { word: 'trust', definition: 'Believing that someone is honest and will treat you fairly.', pages: [7] },
  { word: 'label', definition: 'A small piece of paper that tells you something about what it is stuck on.', pages: [9] },
  { word: 'honest', definition: 'Telling the truth and not cheating.', pages: [9] },
];

export const EFUA_TEACHER_GUIDE: TeacherGuide = {
  overview: 'Efua starts a small groundnut-cake business and is tempted by a classmate’s shortcuts. The story joins real arithmetic (cost, revenue, profit) to a choice about honesty, and shows that a trustworthy reputation is part of a business’s value.',
  lessonMinutes: 45,
  learningGoals: [
    'Work out cost, income and profit from a simple business and check a claim against the numbers.',
    'Explain why trust and honesty matter to customers and to a business over time.',
    'Infer a character’s reasoning and the meaning of a metaphor ("customers are like a garden").',
    'Apply the story to a real choice in the learner’s own life.',
  ],
  subjectLinks: [
    { subject: 'Mathematics', link: 'Money, cost and profit; checking a claim with calculation.', status: 'to-verify' },
    { subject: 'English Language', link: 'Reading comprehension, inference, vocabulary, discussion.', status: 'to-verify' },
    { subject: 'Career Technology / entrepreneurship', link: 'Costing, pricing, customer care.', status: 'to-verify' },
    { subject: 'Religious and Moral Education', link: 'Honesty and integrity.', status: 'to-verify' },
  ],
  beforeReading: [
    'Ask: "Have you ever bought something from a school-gate seller? What made you go back, or not?"',
    'Pre-teach: profit, cost, trust. Write "profit = money in − money spent" on the board.',
  ],
  whileReading: [
    'After page 3, pause for the profit activity: check every learner can get to eight cedis.',
    'After page 6, ask for predictions before reading on (the prediction activity).',
    'After page 7, let learners check Kwabena’s "twice the profit" claim with Efua’s numbers.',
  ],
  afterReading: [
    'Put the events in order, then retell the story in three sentences.',
    'Have learners recalculate with the final recipe: cost 65 pesewas per pack, selling at one cedi.',
  ],
  discussion: [
    'Was Kwabena a bad person, or someone giving poor advice? How do you know?',
    'Efua made less profit on some days. What did she gain that the sums alone do not show?',
    'How was selling leftover cakes at half price different from calling them fresh?',
    'What does "Customers are like a garden" mean? Can you think of another comparison?',
  ],
  reflection: [
    'Think of a time you were tempted to take a shortcut. What did you do, and what would you do now?',
    'What do people say about you when you are not there? How could you build a reputation you are proud of?',
    'Where in your own life (school, home, a small job, a class project) does honesty cost you something in the short term and pay off later?',
    'Who is your "Auntie Dede", someone whose advice you trust? What makes them trustworthy?',
  ],
  mathsExtension: [
    { task: 'Efua sells all 20 packs at 1 cedi each. Cost 12 cedis. What is the profit?', answer: '20 − 12 = 8 cedis.' },
    { task: 'On Monday she sold 14 packs of the 20 she made. What was her profit?', answer: '14 − 12 = 2 cedis (the six unsold packs were already paid for).' },
    { task: 'With fewer groundnuts, 20 packs cost 9 cedis. What is the profit if all 20 sell? How much more than 8 cedis is that?', answer: '20 − 9 = 11 cedis, which is 3 cedis more. Kwabena promised "twice", which would be 16.' },
    { task: 'The honest recipe costs 65 pesewas a pack. What do 25 packs cost, and what is the profit if all sell at 1 cedi?', answer: '25 × 65 = 1,625 pesewas = 16.25 cedis. Profit 25 − 16.25 = 8.75 cedis, more than the original 8 cedis.' },
    { task: 'Challenge: Efua sells 5 half-price packs (50 pesewas each) and 20 full-price packs a day. Cost: 16.25 cedis for 25 packs. What is the profit?', answer: 'Income 20 + 2.50 = 22.50 cedis. Profit 22.50 − 16.25 = 6.25 cedis. Honest half-price selling costs a little, and still earns trust.' },
  ],
  differentiation: {
    support: ['Use whole-cedi numbers only (pages 3 and 7) and a number line for subtraction.', 'Read pages aloud in "Listen" mode and discuss with a partner before answering.'],
    stretch: ['Ask learners to design their own small business and cost it, including how they would handle leftovers honestly.', 'Compare Kwabena’s claim with Efua’s calculation and write a two-sentence rebuttal.'],
  },
  culturalNotes: [
    'The names are Akan day names: Efua (a girl born on Friday), Kwabena (a boy born on Tuesday), Ama (a girl born on Saturday). Dede is used in several Ghanaian communities; a reviewer should confirm its origin before it is described in print.',
    '"Nana" is a respectful title for an elder or grandparent. "Auntie" is a common courtesy title for a woman who is not necessarily a relative.',
    'Groundnut cakes (nkate cake and similar sweets) are a familiar snack. A local reviewer should confirm the recipe description.',
  ],
  localiseThis: [
    'Prices are illustrative: check that 12 cedis for 20 packs and a 1 cedi selling price suit your area and year, and adjust the numbers and answers together.',
    'Choose a school uniform colour that matches your school if learners will see illustrations of the gate.',
  ],
};

// ---------------------------------------------------------------------------------------------- illustration plan

const efua: CharacterSheet = {
  id: 'efua', name: 'Efua', role: 'Protagonist, JHS student and young entrepreneur', age: 'thirteen years old', build: 'slim, upright, quick-moving',
  face: 'round face, bright attentive eyes, soft thoughtful brow, a dimple on the left cheek',
  hair: 'neat short natural hair in two puffs with plain dark hair ties', skin: 'deep brown with warm undertones',
  clothing: 'a fictional school uniform (a cream blouse and a forest-green pinafore) at school and at the gate; a simple yellow kitchen apron at home',
  signatureProps: ['a worn blue exercise book with a pencil tucked in the spine', 'a small tray of paper-wrapped groundnut packs'],
  personality: 'practical, careful, kind; thinks before she acts',
  expressionRange: ['hopeful', 'concentrating', 'uncertain', 'quietly proud', 'amused'],
  consistencyAnchors: ['two hair puffs', 'dimple on the left cheek', 'blue exercise book with a pencil in the spine', 'cream blouse and green pinafore when in uniform'],
  doNot: ['change hair style between pages', 'show her in heavy make-up or jewellery', 'sexualised styling of any kind'],
};
const nana: CharacterSheet = {
  id: 'nana-ama', name: 'Nana Ama', role: 'Efua’s grandmother and recipe keeper', age: 'about seventy', build: 'compact, strong forearms, gentle posture',
  face: 'warm lined face, kind eyes, quick smile', hair: 'short grey hair mostly covered by a soft head-wrap', skin: 'medium-deep brown, weathered by the kitchen’s warmth',
  clothing: 'a printed cotton wrapper and blouse in indigo and gold, with a plain apron', signatureProps: ['a long wooden spoon', 'small round spectacles on a cord'],
  personality: 'patient, teasing, wise', expressionRange: ['smiling', 'teasing', 'encouraging', 'proud'],
  consistencyAnchors: ['indigo-and-gold printed wrapper', 'grey hair under a head-wrap', 'wooden spoon', 'spectacles on a cord'],
  doNot: ['frail or helpless depiction', 'ceremonial or costume-like styling'],
};
const kwabena: CharacterSheet = {
  id: 'kwabena', name: 'Kwabena', role: 'Efua’s classmate, confident and always looking for shortcuts', age: 'thirteen years old', build: 'taller than Efua, relaxed posture',
  face: 'easy grin, confident eyebrows, expressive eyes', hair: 'close-cropped', skin: 'rich medium brown',
  clothing: 'the same fictional school uniform: cream shirt, forest-green shorts, shirt untucked at the hem', signatureProps: ['a rolled-up exercise book in one back pocket'],
  personality: 'charming, persuasive, not malicious; learns something', expressionRange: ['smiling persuasively', 'confident', 'sheepish', 'amused'],
  consistencyAnchors: ['close-cropped hair', 'untucked cream shirt', 'rolled exercise book in back pocket'],
  doNot: ['villain styling or menacing lighting', 'sneering expression'],
};
const dede: CharacterSheet = {
  id: 'auntie-dede', name: 'Auntie Dede', role: 'Market vegetable trader and Efua’s advisor', age: 'about forty-five', build: 'sturdy, confident, at home behind her stall',
  face: 'broad warm smile, laughter lines, sharp kind eyes', hair: 'a bold printed head-tie in red and gold', skin: 'deep brown',
  clothing: 'a bright red-and-gold printed blouse and wrapper, a cloth apron with a money pocket', signatureProps: ['a neat pile of tomatoes', 'a woven basket'],
  personality: 'warm, firm, experienced', expressionRange: ['kind', 'knowing', 'firm', 'laughing'],
  consistencyAnchors: ['red-and-gold head-tie', 'cloth apron with money pocket', 'pyramid of tomatoes at her stall'],
  doNot: ['stereotyped loud or comic depiction'],
};

const settings: SettingSheet[] = [
  { id: 'kitchen', name: 'Nana Ama’s kitchen', description: 'A bright, lived-in Ghanaian home kitchen with a charcoal stove, an enamel pot and shelves of jars.', palette: 'laterite red walls, golden light, cream cloth', keyDetails: ['charcoal stove', 'enamel pot of golden groundnuts and sugar', 'jars of groundnuts on a shelf', 'a window with warm morning light'], doNot: ['modern luxury kitchen'] },
  { id: 'bedroom-night', name: 'Efua’s room at night', description: 'A modest, tidy room with a small table and a lamp.', palette: 'kente indigo night, warm lamp glow', keyDetails: ['single warm lamp', 'neat bed with a patterned cover', 'a window with a deep blue night sky', 'school bag on a hook'], doNot: ['frightening shadows'] },
  { id: 'school-gate', name: 'School gate at close of day', description: 'A green-painted school gate and wall, students in uniform, an afternoon sun.', palette: 'forest green, golden afternoon light', keyDetails: ['green gate and wall', 'students in cream-and-green uniforms', 'a shady tree', 'Efua’s small table with a cloth'], doNot: ['readable sign text or school names'] },
  { id: 'market', name: 'Neighbourhood market stall', description: 'A busy market lane with baskets, tomatoes and bright cloth awnings.', palette: 'warm reds and golds with leafy green', keyDetails: ['pyramids of tomatoes', 'woven baskets', 'cloth awning', 'people passing in the lane'], doNot: ['brand names', 'readable signs'] },
];

const shot = (page: number, title: string, settingId: string, characters: Shot['characters'], action: string, camera: string, lighting: string, mustShow: string[], calmZone: Shot['calmZone'], alt: string): Shot =>
  ({ page, title, settingId, characters, action, camera, lighting, mustShow, calmZone, alt });

export const EFUA_ILLUSTRATION_PLAN: IllustrationPlan = {
  storyKey: 'efuas-honest-business',
  style: STORY_SPARK_CINEMATIC_3D,
  characters: [efua, nana, kwabena, dede],
  settings,
  shots: [
    shot(0, 'Cover', 'school-gate', [{ id: 'efua', expression: 'quietly proud', pose: 'standing tall holding a small tray of paper-wrapped groundnut packs' }],
      'Efua stands in the afternoon light at the school gate with her tray of groundnut cakes, a long friendly queue of students behind her.', 'medium shot, slightly low, Efua centred', 'golden afternoon, soft rim light',
      ['Efua centred holding the tray', 'blue exercise book tucked under her arm', 'a hint of the queue behind'], 'top', 'Cover: a proud thirteen-year-old girl holds a tray of groundnut cakes at her school gate while students queue behind her.'),
    shot(1, 'The kitchen secret', 'kitchen', [{ id: 'efua', expression: 'concentrating', pose: 'stirring the pot' }, { id: 'nana-ama', expression: 'encouraging', pose: 'guiding Efua’s hand on the spoon' }],
      'Nana Ama and Efua stir a pot of golden sugar and groundnuts together on a charcoal stove, steam rising in the morning light.', 'medium two-shot, slightly above the pot', 'warm window light with golden steam',
      ['the pot of glossy golden groundnuts', 'Nana’s wooden spoon', 'steam in the light'], 'bottom', 'A girl stirs a pot beside her grandmother in a warm kitchen, golden groundnuts and sugar glowing in the pot.'),
    shot(2, 'A plan, and the sums', 'kitchen', [{ id: 'efua', expression: 'hopeful', pose: 'holding the spoon, looking up' }, { id: 'nana-ama', expression: 'teasing', pose: 'pointing at an exercise book on the table' }],
      'Efua, hopeful, looks to her grandmother, who playfully points to an exercise book and pencil on the kitchen table.', 'medium two-shot at table height', 'soft late-morning window light',
      ['blue exercise book with pencil', 'finished groundnut cakes cooling on a tray'], 'top', 'Efua looks hopefully at her grandmother, who points playfully to an exercise book on the table.'),
    shot(3, 'Doing the arithmetic', 'bedroom-night', [{ id: 'efua', expression: 'concentrating', pose: 'writing in her exercise book at a small table' }],
      'Efua writes neat columns of costs and profit in her exercise book at a small table under a warm lamp.', 'close medium shot over her shoulder showing the page', 'single warm lamp, deep indigo background',
      ['exercise book with simple handwritten sums (numbers only, no readable words)', 'pencil in hand', 'lamp glow on her face'], 'none', 'Efua writes costs and profit in an exercise book under a lamp, concentrating.'),
    shot(4, 'The first sales', 'school-gate', [{ id: 'efua', expression: 'amused', pose: 'handing a pack to a student' }],
      'At the school gate, Efua hands a paper-wrapped pack to a smiling student; a cloth bag of leftover packs sits at her feet.', 'medium shot, Efua at right, queue at left', 'late-afternoon golden light',
      ['paper-wrapped packs on a small table', 'a cloth bag of leftover packs at her feet', 'two or three students in uniform'], 'top', 'Efua at the school gate hands a pack to a student; a bag of leftover packs sits at her feet.'),
    shot(5, 'The persuader', 'school-gate', [{ id: 'kwabena', expression: 'smiling persuasively', pose: 'leaning in, speaking quietly' }, { id: 'efua', expression: 'uncertain', pose: 'holding her bag, looking at him' }],
      'Kwabena leans in near the gate, glancing at the bag of soft cakes, while Efua looks uncertain.', 'medium two-shot, slightly low', 'late-afternoon, shade under the tree',
      ['the bag of soft cakes', 'Kwabena’s persuasive grin', 'Efua’s uncertain look'], 'top', 'Kwabena leans in towards Efua near the school gate, speaking quietly while she looks uncertain.'),
    shot(6, 'Too easy', 'school-gate', [{ id: 'kwabena', expression: 'confident', pose: 'smiling, pointing at the old packs' }, { id: 'efua', expression: 'uncertain', pose: 'hesitating, biting her lip' }],
      'Kwabena smiles confidently and points at the old packs, as if it is the most sensible idea in the world; Efua hesitates.', 'two-shot, eye level, shallow depth of field', 'soft shade with warm highlights',
      ['old packs in the bag', 'Kwabena’s confident gesture', 'Efua hesitating'], 'top', 'Kwabena smiles and points at the old packs; Efua hesitates, biting her lip.'),
    shot(7, 'Thinking it through', 'bedroom-night', [{ id: 'efua', expression: 'concentrating', pose: 'sitting still, chin on hand, book open' }],
      'Alone by lamplight, Efua sits still with her exercise book open, thinking hard, a deep blue night sky in the window.', 'medium shot from the side, lamp as the key light', 'warm lamp, indigo night, gentle moonlight',
      ['open exercise book with numbers', 'lamp glow', 'night sky in the window'], 'bottom', 'Efua sits alone by lamplight with her exercise book, thinking hard.'),
    shot(8, 'Advice at the market', 'market', [{ id: 'auntie-dede', expression: 'kind', pose: 'arranging tomatoes, turning to speak to Efua' }, { id: 'efua', expression: 'concentrating', pose: 'listening, hands clasped' }],
      'Auntie Dede arranges a pyramid of tomatoes at her stall and speaks kindly to Efua, who listens carefully.', 'medium two-shot with the tomato pyramid in the foreground', 'warm morning light through the cloth awning',
      ['pyramid of tomatoes', 'Auntie Dede’s red-and-gold head-tie', 'Efua listening'], 'top', 'A market trader arranges tomatoes and speaks kindly to Efua, who listens carefully.'),
    shot(9, 'Keeping it honest', 'kitchen', [{ id: 'efua', expression: 'quietly proud', pose: 'filling a pack and writing a date label' }],
      'Efua’s hands fill a paper pack with extra groundnut cakes and write the date on a small label; a second bag is marked as half price.', 'close-up on her hands and the packs, her face softly visible', 'warm kitchen light',
      ['extra groundnuts in the pack', 'handwritten date on the label (numbers only)', 'a separate bag marked for half price, shown with a simple symbol, no readable words'], 'none', 'Efua fills a pack with groundnut cakes and writes the date on a label; another bag is set aside as half price.'),
    shot(10, 'The line grows', 'school-gate', [{ id: 'efua', expression: 'quietly proud', pose: 'serving with a smile' }],
      'A longer queue of cheerful students at the school gate; Efua serves with a smile.', 'wide medium shot, queue leading the eye to Efua', 'golden afternoon',
      ['the long queue', 'Efua serving', 'the half-price bag on the table'], 'top', 'A longer queue of cheerful students at the school gate, Efua serving with a smile.'),
    shot(11, 'In the queue', 'school-gate', [{ id: 'kwabena', expression: 'sheepish', pose: 'at the front of the queue, scratching his head' }, { id: 'efua', expression: 'amused', pose: 'holding out a pack with a smile' }],
      'Kwabena, at the front of the queue, sheepishly smiles as Efua holds out a fresh pack of groundnut cakes.', 'medium two-shot, warm and friendly', 'golden afternoon, soft rim light',
      ['Kwabena sheepish', 'the pack being held out', 'the queue behind him'], 'top', 'Kwabena sheepishly smiles as Efua holds out a pack of groundnut cakes.'),
    shot(12, 'A new page', 'bedroom-night', [{ id: 'efua', expression: 'quietly proud', pose: 'writing the date at the top of a fresh page' }],
      'Efua writes the date at the top of a fresh page in her exercise book, smiling quietly, a jar of groundnuts beside her.', 'medium close shot, warm and calm', 'warm lamp, soft indigo night',
      ['fresh page', 'jar of groundnuts', 'quiet smile'], 'bottom', 'Efua writes the date at the top of a fresh page in her exercise book, smiling quietly.'),
  ],
};

// The page briefs shown to reviewers are the shot list entries, so there is one source of truth.
EFUA_PAGES.forEach((p, i) => {
  const s = EFUA_ILLUSTRATION_PLAN.shots.find((x) => x.page === i + 1);
  if (s) p.brief = `${s.action} Must show: ${s.mustShow.join('; ')}. Camera: ${s.camera}. Lighting: ${s.lighting}.`;
});
