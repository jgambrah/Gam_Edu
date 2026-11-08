/**
 * Two additional sample stories prepared for EDITORIAL REVIEW (not for publication): one for upper primary (science and
 * environmental responsibility) and one for KG 2 (counting and market life). Original text. Unreviewed. Illustrations:
 * briefs only (no images exist). Narration in the preview is robotic placeholder audio.
 */
import type { Activity, GlossaryEntry } from '../premium';
import type { EfuaPage } from './efua-premium';
import type { TeacherGuide } from './teacher-guide';

export interface EditorialSample {
  key: string; title: string; summary: string;
  pages: EfuaPage[]; activities: Activity[]; glossary: GlossaryEntry[]; characters: string[];
  teacherGuide: TeacherGuide; culturalNotes: string[]; reviewQuestions: string[];
}

// ------------------------------------------------------------------------------------------------ Primary 4: Yaa and the Blocked Drain
export const YAA_DRAIN: EditorialSample = {
  key: 'yaa-and-the-blocked-drain',
  title: 'Yaa and the Blocked Drain',
  summary: 'After heavy rain floods the lane outside her home, Yaa investigates why the water will not drain and leads her neighbours in clearing the drain and keeping it clear.',
  pages: [
    { text: 'The rain came down all night. In the morning, Yaa opened the door and gasped. The lane outside her house was a brown river, and her school shoes were floating in it.',
      alt: 'A girl in a doorway looks out at a flooded lane with her school shoes floating on the water.', motif: '🌧️🏠', brief: 'Morning after rain, a flooded lane in a Ghanaian neighbourhood, Yaa at the doorway, shoes afloat. Surprised, not frightened.', narration: 'Wide-eyed and lively; slow on "a brown river".' },
    { text: '‘Why is the water still here?’ Yaa asked. Her brother Kofi shrugged. ‘It is only rain,’ he said. But Yaa remembered what her teacher said: when something puzzles you, do not guess. Look closely, and find out.',
      alt: 'Yaa crouches at the edge of the water, looking closely, while her younger brother shrugs.', motif: '🔍🤔', brief: 'Yaa crouching to look, Kofi shrugging behind her; curiosity in her face.', narration: 'Curious, a little determined. Kofi casual.' },
    { text: 'Yaa followed the water along the lane to the open drain beside the road. It was supposed to carry the rain away to the stream. But today, the water was piling up in front of it like a crowd at a gate.',
      alt: 'Yaa walks beside the flooded lane to an open roadside drain where water is piling up.', motif: '🚶‍♀️🌊', brief: 'Yaa at the edge of an open concrete drain, water backed up in front of it, a clear sense of a blockage.', narration: 'Building curiosity; the "crowd at a gate" image is playful.' },
    { text: 'Yaa knelt and looked in. The drain was packed with plastic bottles, torn sachets, old bags and mud. ‘The rain cannot get through,’ she said slowly. ‘It has nowhere to go.’',
      alt: 'Yaa kneels at the drain and sees it packed with plastic bottles, bags and mud.', motif: '🧴🗑️', brief: 'Close view into the drain full of plastic bottles, sachets, bags and mud (no brand names or readable text). Yaa’s thoughtful face.', narration: 'Slower, quiet realisation.' },
    { text: 'That afternoon, Yaa made a plan. She drew a map of the lane in her exercise book and marked every place where rubbish was dropped. Then she counted. In one afternoon, she counted forty-two bottles and sachets near the drain.',
      alt: 'Yaa draws a map of the lane in her exercise book and counts rubbish, with numbers beside her marks.', motif: '🗺️📒', brief: 'Yaa at a table with a hand-drawn lane map (simple marks and numbers only), pencil in hand, a sense of focus.', narration: 'Clear, factual; clearly say the number forty-two.' },
    { text: 'At the weekend, Yaa knocked on doors. ‘Please, can we clear the drain together?’ she asked. Some neighbours said they were too busy. But Auntie Akosua brought a broom, Mr Mensah brought a wheelbarrow, and soon a whole line of people stood by the drain.',
      alt: 'Neighbours with brooms, a wheelbarrow and gloves gather beside the drain with Yaa.', motif: '🧹🛒', brief: 'A friendly group of neighbours of different ages at the drain with brooms, gloves and a wheelbarrow. Community energy.', narration: 'Warm, building; each neighbour named clearly.' },
    { text: 'They worked all morning. They scooped out the mud and sorted the rubbish into piles: plastic to be collected for recycling, and the rest to be taken to the proper bin. Slowly, with a gurgle and a rush, the water began to move.',
      alt: 'Neighbours scoop mud and sort plastic into piles beside the drain as the water begins to flow.', motif: '♻️💧', brief: 'The team sorting plastic into labelled piles (symbols, no text) and water starting to flow in the drain; light, hopeful.', narration: 'Energetic, then a soft sense of release at the gurgle.' },
    { text: '‘It works!’ cried Kofi. The water ran down the drain and away to the stream, and the lane slowly turned from river to road again. Yaa smiled. But she knew the job was not finished.',
      alt: 'The lane drying out as water flows away down the cleared drain; Kofi cheering.', motif: '🎉🌈', brief: 'The flow in the cleared drain, the lane reappearing, Kofi cheering; Yaa smiling but thoughtful.', narration: 'Joyful, then a quieter turn on the last line.' },
    { text: 'On Monday, Yaa spoke at her school assembly. ‘A drain only works if we keep it clear,’ she said. ‘Every bottle in the drain is a little wall. If we put it in the bin, we keep the water moving.’ Her classmates nodded, and the head teacher asked her to lead a Clean Lane Club.',
      alt: 'Yaa speaks at a school assembly while classmates listen and the head teacher smiles.', motif: '🏫📣', brief: 'Yaa speaking at assembly in front of classmates in uniform; head teacher smiling; confident but not showy.', narration: 'Confident and clear; gentle pride.' },
    { text: 'By the next rainy season, the lane stayed dry. Each week, the club checked the drain, counted the rubbish and wrote the number on a chart. After one month, the number had gone from forty-two to six. Yaa looked at the chart and smiled. Counting had shown her the problem, and counting showed her it was getting better.',
      alt: 'Yaa and club members beside the clean drain, pointing at a chart of falling numbers.', motif: '📉✅', brief: 'The Clean Lane Club by the clean drain with a simple chart (numbers falling, no readable words), dry lane, sunshine.', narration: 'Steady, satisfied, a smile at the end; clear on "forty-two to six".' },
  ],
  activities: [
    { id: 'yaa-c1', type: 'comprehension', afterPage: 4, question: 'Why was the water piling up in front of the drain?', options: ['The drain was blocked by rubbish and mud', 'The stream was empty', 'The rain had stopped'], correctIndex: 0, explanation: 'Plastic and mud filled the drain, so the rain had nowhere to go.' },
    { id: 'yaa-v1', type: 'vocabulary', afterPage: 4, word: 'blocked', definition: 'Stopped from moving or passing through.', distractors: ['Very wet', 'Painted brightly'] },
    { id: 'yaa-pred', type: 'prediction', afterPage: 5, prompt: 'What do you think Yaa should do now? Who might help her?' },
    { id: 'yaa-c2', type: 'comprehension', afterPage: 5, question: 'How many bottles and sachets did Yaa count near the drain?', options: ['Forty-two', 'Fourteen', 'Four'], correctIndex: 0, explanation: 'Yaa counted forty-two bottles and sachets in one afternoon.' },
    { id: 'yaa-seq', type: 'sequencing', afterPage: 9, prompt: 'Put these events in order.', items: ['Yaa notices the flooded lane.', 'Yaa finds the blocked drain.', 'Neighbours clear the drain together.', 'Yaa speaks at school assembly.'] },
    { id: 'yaa-c3', type: 'comprehension', afterPage: 10, question: 'The rubbish count went from forty-two to six. How many fewer is that?', options: ['Thirty-six', 'Forty-eight', 'Six'], correctIndex: 0, explanation: '42 − 6 = 36 fewer pieces of rubbish.' },
    { id: 'yaa-think', type: 'prediction', afterPage: 10, prompt: 'Why did counting help Yaa solve the problem? What else could we count to improve our school?' },
    { id: 'yaa-sel', type: 'sel', afterPage: 10, prompt: 'What is one small thing you could do to look after your own street or school?', feelingOptions: ['Proud', 'Hopeful', 'Unsure', 'Ready'] },
  ],
  glossary: [
    { word: 'drain', definition: 'A channel that carries water away.', pages: [3, 4] },
    { word: 'plastic', definition: 'A light material used to make bottles and bags, which does not rot away.', pages: [4, 7] },
    { word: 'neighbours', definition: 'People who live near you.', pages: [6] },
    { word: 'rubbish', definition: 'Things that people throw away.', pages: [5, 7] },
    { word: 'recycling', definition: 'Using old materials again to make something new.', pages: [7] },
  ],
  characters: ['Yaa: a girl of nine, curious and determined, with a notebook.', 'Kofi: her younger brother, cheerful and casual.', 'Auntie Akosua and Mr Mensah: helpful neighbours.', 'The head teacher: encouraging.'],
  teacherGuide: {
    overview: 'A girl investigates why the lane floods, counts the rubbish, leads her community to clear the drain and starts a school club that tracks the improvement with numbers. Models the scientific habit of observing, counting and checking.',
    lessonMinutes: 40,
    learningGoals: ['Explain how a blocked drain causes flooding.', 'Use counting and subtraction to show a change over time.', 'Describe one small action that protects the local environment.'],
    subjectLinks: [
      { subject: 'Science', link: 'Water, rain and drainage; observing and recording.', status: 'to-verify' },
      { subject: 'Mathematics', link: 'Counting, subtraction, reading a simple chart.', status: 'to-verify' },
      { subject: 'Our World Our People / Social Studies', link: 'Community action and caring for the environment.', status: 'to-verify' },
    ],
    beforeReading: ['Ask: "What happens to rainwater after it falls on our school?"', 'Look at a photo or drawing of a drain (use a local one).'],
    whileReading: ['Pause after page 4 and ask learners to explain, in a sentence, why the water was stuck.', 'After page 5, ask what Yaa should do next.'],
    afterReading: ['Do a 10-minute rubbish count of a safe area at school and chart it.', 'Compare with a count a week later.'],
    discussion: ['Why did Yaa count the rubbish instead of just clearing it?', 'Why did some neighbours say they were too busy? How did Yaa persuade them?', 'What could our class do that is like the Clean Lane Club?'],
    reflection: ['What problem near your home or school could you investigate like Yaa?', 'Who would you ask to help you?'],
    mathsExtension: [
      { task: '42 − 6 = ?', answer: '36.' },
      { task: 'Weekly counts were 42, 30, 18, 9 and 6. How many fewer is the last than the first? Which week saw the biggest drop?', answer: '36 fewer. The biggest drop is from 42 to 30 (12) and from 30 to 18 (12): both are 12.' },
    ],
    differentiation: { support: ['Count with objects first; use a number line to subtract.'], stretch: ['Draw a bar chart of the weekly counts and write two sentences about it.'] },
    culturalNotes: ['Yaa is an Akan day name for a girl born on Thursday, Kofi for a boy born on Friday and Akosua for a girl born on Sunday; Mensah is a family name. A native speaker should verify pronunciation.'],
    localiseThis: ['Replace the drain, stream and market details with what learners see locally; do not use a real named community without permission.'],
  },
  culturalNotes: ['The drain, flooded lane and recycling collection are common in many Ghanaian towns; confirm local recycling practice before the final version (is plastic actually collected locally?).', 'Names are Akan; pronunciation needs native review.'],
  reviewQuestions: ['Is the recycling description accurate for most schools (is collection available)?', 'Is Yaa leading the neighbours (an adult-led community) plausible, or should an adult guide her more explicitly?', 'Is the safety of children working at a drain addressed (gloves, adult supervision)? Consider adding a line about an adult supervising.'],
};

// ------------------------------------------------------------------------------------------------ KG 2: Kofi Counts the Market
export const KOFI_MARKET: EditorialSample = {
  key: 'kofi-counts-the-market',
  title: 'Kofi Counts the Market',
  summary: 'Kofi helps Mama at the market and counts everything he sees, from one tomato to ten oranges, until he counts the best thing of all.',
  pages: [
    { text: 'Kofi went to the market with Mama. The market was big and busy and bright. ‘Let us count,’ said Kofi.',
      alt: 'A small boy holds his mother’s hand at the entrance to a colourful market.', motif: '🧺👦', brief: 'Entrance to a colourful, busy Ghanaian market; Kofi holding Mama’s hand, excited.', narration: 'Bright and playful; slow for young listeners.' },
    { text: 'One tomato, round and red. Kofi counted one.',
      alt: 'One big red tomato sits alone on a cloth.', motif: '🍅', brief: 'A single big red tomato in warm light, Kofi pointing, simple composition.', narration: 'Slow, clear; emphasise "one".' },
    { text: 'Two onions, shiny and purple. Kofi counted one, two.',
      alt: 'Two purple onions side by side on a cloth.', motif: '🧅🧅', brief: 'Two onions side by side, clear and countable, Kofi pointing.', narration: 'Slow, count with a gentle beat.' },
    { text: 'Three mangoes, yellow and sweet. Kofi counted one, two, three.',
      alt: 'Three yellow mangoes in a row.', motif: '🥭🥭🥭', brief: 'Three mangoes in a row, clearly separate.', narration: 'Slow count; a smile on "sweet".' },
    { text: 'Four bananas, curved and long. Kofi counted one, two, three, four.',
      alt: 'Four bananas lined up on a basket lid.', motif: '🍌🍌🍌🍌', brief: 'Four bananas in a row on a basket lid.', narration: 'Slow count; lift on "four".' },
    { text: 'Five oranges, round and juicy. Kofi counted one, two, three, four, five.',
      alt: 'Five oranges stacked in a small pyramid.', motif: '🍊🍊🍊🍊🍊', brief: 'Five oranges stacked clearly (3 + 2), countable.', narration: 'Clear count, bright tone.' },
    { text: 'Then Kofi saw a basket of eggs. ‘How many?’ he asked. Mama smiled. ‘Count them with me.’ They counted together: one, two, three, four, five, six.',
      alt: 'Kofi and Mama counting six eggs in a basket together.', motif: '🥚🧺', brief: 'Basket with six eggs, Mama’s hand next to Kofi’s, a shared smile.', narration: 'Warm, shared counting, a little faster, in rhythm.' },
    { text: 'At the end of the market, Kofi saw his friend Ama. She waved with one hand. Then she waved with two. ‘Hello, Kofi!’ she said.',
      alt: 'A girl waves with one hand and then two to a smiling boy.', motif: '👋👧', brief: 'Ama waving, first with one hand then two (show both clearly), Kofi laughing.', narration: 'Playful; pause for the hands.' },
    { text: 'Kofi counted all the way to ten. Ten tomatoes. Ten onions. Ten smiles on the way home. ‘I love counting,’ said Kofi. And he counted his very best thing of all: one Mama, one Kofi, and one big hug.',
      alt: 'Kofi hugs his mother on the way home from the market, baskets beside them.', motif: '🤗❤️', brief: 'Kofi and Mama hugging on the walk home, baskets of goods beside them, a warm sunset.', narration: 'Warm, soft, slowing down to a hug.' },
  ],
  activities: [
    { id: 'kofi-c1', type: 'comprehension', afterPage: 4, question: 'How many mangoes did Kofi count?', options: ['Three', 'Two', 'Five'], correctIndex: 0, explanation: 'Kofi counted one, two, three mangoes.' },
    { id: 'kofi-c2', type: 'comprehension', afterPage: 7, question: 'How many eggs were in the basket?', options: ['Six', 'Four', 'Ten'], correctIndex: 0, explanation: 'They counted one, two, three, four, five, six.' },
    { id: 'kofi-ph', type: 'phonics', afterPage: 4, targetSound: 'm', prompt: 'Which words start with the "m" sound like "mango"?', options: ['mango', 'market', 'tomato', 'banana'], correctIndexes: [0, 1] },
    { id: 'kofi-pred', type: 'prediction', afterPage: 5, prompt: 'What do you think Kofi will count next?' },
    { id: 'kofi-sel', type: 'sel', afterPage: 9, prompt: 'What is the best thing you counted today, and who helped you?', feelingOptions: ['Happy', 'Proud', 'Loved'] },
  ],
  glossary: [
    { word: 'market', definition: 'A place where people buy and sell food and goods.', pages: [1] },
    { word: 'count', definition: 'To say numbers in order to find out how many.', pages: [1] },
    { word: 'mangoes', definition: 'Sweet yellow fruits that grow on trees.', pages: [4] },
  ],
  characters: ['Kofi: a boy of five, bright and excited.', 'Mama: patient and warm.', 'Ama: Kofi’s friend, cheerful.'],
  teacherGuide: {
    overview: 'A counting story from one to ten set in a Ghanaian market. Each page adds one more object, so children hear and see counting grow, then apply it to a shared real-life count.',
    lessonMinutes: 20,
    learningGoals: ['Count objects from one to six with one-to-one correspondence and hear counting to ten.', 'Recognise the initial sound /o/ in "onion" and "orange".', 'Talk about a family helper and a favourite thing.'],
    subjectLinks: [
      { subject: 'Numeracy (early years)', link: 'Counting and one-to-one correspondence.', status: 'to-verify' },
      { subject: 'Language and Literacy (early years)', link: 'Listening, initial sounds, oral language.', status: 'to-verify' },
    ],
    beforeReading: ['Show real fruit or classroom objects and count them together.'],
    whileReading: ['Point to each object as the narrator counts; invite children to count aloud.'],
    afterReading: ['Count children, chairs and shoes in the room.', 'Play "Count with me" using real objects from the school garden.'],
    discussion: ['Which fruit is your favourite? How many can you count in the picture?'],
    reflection: ['Who helps you at home? What can you count together?'],
    mathsExtension: [{ task: 'Show 3 mangoes and 2 oranges. How many fruits in all?', answer: '5 (count them together).' }],
    differentiation: { support: ['Count only to three on the first reading.'], stretch: ['Count by twos with the hands on page 8.'] },
    culturalNotes: ['Kofi is an Akan day name for a boy born on Friday; Ama is a girl born on Saturday.'],
    localiseThis: ['Replace the fruits with those children see in their own market.'],
  },
  culturalNotes: ['Market foods are chosen to be familiar and colourful; a local reviewer should confirm that the items suit the intended region.'],
  reviewQuestions: ['Is counting to six with the eggs correct for KG 2, or should the story stop at five?', 'Is page 9 (counting to ten) supported by objects on the page, or should it show ten clearly?', 'The page 8 hands count (1 then 2) is playful: does it confuse a child who is counting people rather than hands?'],
};
