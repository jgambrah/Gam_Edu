import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

const base = (
  c: Partial<Classification> &
    Pick<
      Classification,
      | 'classIds'
      | 'ageMin'
      | 'ageMax'
      | 'readingLevel'
      | 'difficulty'
      | 'genres'
      | 'themes'
      | 'objectives'
      | 'ghanaianContext'
      | 'estimatedDurationSec'
    >
): Classification => ({
  schemaVersion: CLASSIFICATION_VERSION,
  language: 'en',
  narrationLocale: 'en-GH',
  ...c,
});

export const BATCH_7_STORIES: PilotStory[] = [
  // =================================================================================================
  // 1. THE SEA THAT CAME CLOSER (Primary 4–5 · 8 pages · Coastal erosion, climate & community action)
  // =================================================================================================
  {
    key: 'the-sea-that-came-closer',
    set: 'extension',
    title: 'The Sea That Came Closer',
    summary:
      'When eleven-year-old Teye and his friend Akweley find that the sea has reached their beach football field, Grandpa Nii, Madam Ofori and a visiting coastal scientist help them investigate coastal erosion, test how waves move sediment, reject polluting shortcuts, and present evidence-based solutions at a community meeting.',
    classification: base({
      classIds: ['primary-4', 'primary-5'],
      ageMin: 9,
      ageMax: 11,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['community', 'weather', 'citizenship'],
      objectives: ['scientific-curiosity', 'environmental-awareness', 'critical-thinking', 'reading-comprehension', 'citizenship'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 360,
    }),
    palette: ['#0284c7', '#f59e0b'],
    characters: [
      'Teye: 11-year-old Ghanaian boy with a neat low haircut, wearing a bright yellow football jersey and blue shorts, holding a classic black-and-white football.',
      'Akweley: 11-year-old Ghanaian girl with neat braided hair tied with blue ribbons, wearing a coral-orange top, khaki skirt and carrying a small field notebook.',
      'Grandpa Nii: Warm elderly Ghanaian fisherman with silver-grey hair and beard, wearing a woven straw hat and indigo cotton shirt while mending a fishing net.',
      'Madam Ofori: Kind Primary 5 teacher in a teal-and-gold Ghanaian print dress and spectacles.',
      'Sena: Teye’s classmate living near the shoreline, wearing a green polo shirt.',
    ],
    narrationPlan: {
      voice: 'Warm, expressive Ghanaian-English storyteller voice (Kore) with clear classroom and coastal atmosphere',
      pace: 'Steady, clear developing/fluent reader pace (about 115 words per minute)',
      notes: ['Emphasize the scientific caution around investigating local coastal causes.', 'Keep dialogue natural and distinct for Teye, Akweley, Grandpa Nii and Madam Ofori.'],
    },
    music: 'Gentle Atlantic Breeze Piano (soft, reflective coastal piano melody ducked beneath narration)',
    culturalNotes: [
      'Teye (Dangme), Akweley (Ga), Nii (Ga) and Sena (Ewe) reflect coastal communities along Ghana’s Greater Accra, Volta and Eastern shorelines.',
      'Fishing nets, beach football and community centre meetings are everyday features of life in Ghanaian coastal towns.',
    ],
    reviewQuestions: [
      'Are all causes of coastal erosion presented carefully as requiring local investigation rather than assuming a single cause?',
      'Does the story clearly reject dumping plastic and old tyres on the beach as polluting and ineffective?',
    ],
    pages: [
      {
        motif: 'the-missing-football-field',
        text: `Every evening, eleven-year-old Teye played football near the beach with his friends. One Saturday, he arrived with his football and stopped. "Where is our goalpost?" he asked. The wooden posts lay in the sand, almost touching the waves. "The sea has stolen our football field!" cried his friend Akweley. Grandpa Nii, who was repairing a fishing net nearby, looked up. "The sea has been changing this shore for many years," he said. "But recently, the changes have worried us." Teye stared at the waves. Could something so beautiful also be so powerful?`,
        alt: 'Teye and Akweley standing on a Ghanaian sandy beach looking at fallen wooden football goalposts near the rolling ocean waves while Grandpa Nii repairs a fishing net nearby.',
        brief: '3D animated scene on a sunny Ghanaian sandy beach. 11-year-old Teye in a yellow football jersey holding a football and 11-year-old Akweley in a coral top look surprised at wooden goalposts lying in wet sand touched by foaming ocean waves. Nearby, Grandpa Nii in a straw hat and indigo shirt sits mending a fishing net.',
        narration: 'Open with lively curiosity, surprise on Teye’s question, and thoughtful warmth from Grandpa Nii.',
      },
      {
        motif: 'grandpas-old-photograph',
        text: `Grandpa Nii opened an old wooden box and brought out a photograph. It showed the same beach, but the coconut trees stood much farther from the water. "Was this really our village?" Teye asked. "Yes. I took that photograph many years ago." Akweley compared it with the present shoreline. "Then the land has changed!" Grandpa nodded. "Waves and currents can carry sand away from one place and deposit it somewhere else. This is part of coastal erosion." Teye repeated the new words slowly. "Coastal erosion. So the sea does not simply stay in one place?" "Exactly," said Grandpa. "And different coasts change in different ways."`,
        alt: 'Grandpa Nii showing Teye and Akweley an old photograph from a wooden box where coconut trees stood much farther from the sea than on the current shoreline.',
        brief: '3D animated close-up scene by the beach veranda. Grandpa Nii holds an open carved wooden box and shows an old sepia-toned photograph of wide sandy beach and coconut palms to Teye and Akweley, who compare the photo with the closer ocean waves behind them.',
        narration: 'Read Grandpa Nii’s explanation calmly and clearly, emphasizing the phrase "coastal erosion".',
      },
      {
        motif: 'the-sand-experiment',
        text: `At school, their teacher, Madam Ofori, filled a shallow tray with sand and water. She shaped the sand into a little beach. "Watch carefully." She gently moved the water back and forth. Tiny grains of sand shifted. "The moving water carries sediment," she explained. "Along real coastlines, waves, currents, storms and changes in sea level can all affect the shore." Teye raised his hand. "Is climate change involved?" "It can be," said Madam Ofori. "Rising sea levels can increase coastal risks. But we must investigate local conditions before deciding what causes changes at a particular beach."`,
        alt: 'Madam Ofori in a Ghanaian classroom demonstrating how gently moving water shifts sand in a shallow tray while Teye, Akweley and classmates watch closely.',
        brief: '3D animated bright Ghanaian classroom. Madam Ofori in a teal-and-gold print dress and spectacles gently tilts water in a clear shallow tray half-filled with sloped beach sand, showing sand grains shifting as Teye raises his hand and Akweley takes notes.',
        narration: 'Clear, engaging teacher tone during the tray experiment, highlighting scientific caution.',
      },
      {
        motif: 'a-house-in-danger',
        text: `That afternoon, Teye visited his friend Sena. Sena's mother was moving belongings away from a wall near the beach. "The ground is getting too close to the water," she explained. "Will your family have to leave?" Teye asked. "We are speaking with the local authorities and getting advice. We must make a safe decision." Teye felt worried. He had thought coastal erosion was only about sand and football. Now he understood that it could affect homes, livelihoods, roads and people's safety.`,
        alt: 'Teye visiting his friend Sena while Sena’s mother moves household belongings away from a coastal house wall where the shoreline has come close.',
        brief: '3D animated afternoon scene in a Ghanaian coastal village. Teye and his classmate Sena watch empathetically as Sena’s mother carries household boxes away from a compound wall near the sandy shoreline, with ocean waves visible in the background.',
        narration: 'Gentle, empathetic tone showing Teye’s growing understanding of how erosion affects real families.',
      },
      {
        motif: 'the-wrong-solution',
        text: `Some children suggested piling rubbish along the shore. "Plastic bags and old tyres might stop the waves!" one boy declared. "Wait," Akweley said. "Wouldn't that pollute the sea?" Madam Ofori agreed. "An environmental problem should not be solved by creating another one. Protecting a coastline requires proper scientific assessment." She explained that suitable responses might include protecting coastal vegetation, planning where buildings are located, restoring beaches or constructing carefully designed coastal defences. "No single solution works everywhere," she added.`,
        alt: 'Akweley and Madam Ofori explaining to classmates why dumping plastic bags and tyres on the beach would pollute the sea and why scientific coastal solutions are needed.',
        brief: '3D animated schoolyard discussion. Akweley holds up her hand thoughtfully while speaking to classmates, and Madam Ofori points to an educational chart illustrating healthy coastal mangroves and engineered sea defences.',
        narration: 'Firm, thoughtful voice for Akweley and Madam Ofori explaining why rubbish is not a coastal defence.',
      },
      {
        motif: 'young-coastal-detectives',
        text: `The class began a project called Our Changing Coast. They collected old photographs, interviewed residents and recorded observations from safe locations. A coastal scientist visited their school. "Your observations are useful," she told them. "But accurate measurements and long-term monitoring are needed before we can understand the changes." Teye asked whether the sea could ever be stopped completely. "We cannot control every wave," she replied. "But knowledge helps communities make better decisions."`,
        alt: 'Teye, Akweley and classmates showing their project board of old shoreline photographs and notes to a visiting female Ghanaian coastal scientist.',
        brief: '3D animated classroom scene. Teye and Akweley stand beside a project board showing old and new shoreline photos and interview notes while a visiting Ghanaian female coastal scientist in field attire and a lanyard smiles and explains coastal monitoring instruments.',
        narration: 'Encourage a sense of discovery and respect for long-term scientific measurement.',
      },
      {
        motif: 'the-community-meeting',
        text: `At the community centre, the children presented their findings. They displayed photographs and explained what they had learned. Parents, fishers, engineers and local officials discussed safer building practices, waste management, monitoring and possible coastal protection measures. Teye was nervous when he stood to speak. "Our beach is more than a football field," he said. "It is part of our home. We need to protect people and the environment together." The room applauded.`,
        alt: 'Teye and Akweley presenting their coastal photographs and findings to parents, fishers, engineers and local officials at the community centre.',
        brief: '3D animated community centre meeting in Ghana. Teye stands bravely beside Akweley in front of a display of shoreline photographs, speaking to an attentive audience of parents, Grandpa Nii, fishers, engineers and local officials who applaud warmly.',
        narration: 'Sincere, courageous tone as Teye speaks to the community, building to warm applause.',
      },
      {
        motif: 'a-new-goal',
        text: `Weeks later, the children moved their football games to a safer field away from the shore. Teye still visited the beach with Grandpa Nii. One evening, the sunset painted the sea gold. "Grandpa, I cannot stop the ocean," he said. Grandpa smiled. "No, my boy. But you can learn about it, help people understand it and become someone who develops better solutions." Teye looked toward the horizon. "Then perhaps I will become a coastal engineer." "And I," said Akweley, arriving with her notebook, "will become the scientist who checks your calculations!" They laughed as the waves rolled gently onto the sand.`,
        alt: 'Teye, Grandpa Nii and Akweley with her notebook smiling together at a safe distance overlooking the golden sunset ocean.',
        brief: '3D animated golden sunset scene overlooking the Ghanaian coast from a safe grassy rise. Teye holding his football, Grandpa Nii in his straw hat, and Akweley holding her notebook laugh warmly together as golden sunlight shimmers on the gentle ocean waves.',
        narration: 'Warm, hopeful and joyful ending as Teye and Akweley share their dreams.',
      },
    ],
    activities: [
      {
        id: 'sea-q1-beach-surprise',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why was Teye surprised when he arrived at the beach?',
        options: [
          'His friends had gone home.',
          'The shoreline had reached their football field.',
          'His football had disappeared.',
        ],
        correctIndex: 1,
        explanation: 'The wooden goalposts lay in the sand almost touching the waves because the shoreline had reached their football field.',
      },
      {
        id: 'sea-q2-tray-experiment',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the tray experiment demonstrate?',
        options: [
          'Moving water can transport sand and change a shoreline.',
          'Sand can never be moved by water.',
          'Only storms can move grains of sand.',
        ],
        correctIndex: 0,
        explanation: 'Madam Ofori’s tray experiment showed that moving water can transport sand (sediment) and change the shape of a shoreline.',
      },
      {
        id: 'sea-end-1-comprehension',
        type: 'comprehension',
        question: 'Which of these can contribute to coastal change?',
        options: [
          'Waves, currents, storms or rising sea level',
          'Painting wooden goalposts bright yellow',
          'Playing football on an inland grass pitch',
        ],
        correctIndex: 0,
        explanation: 'Waves, currents, storms and rising sea level can all contribute to coastal change.',
      },
      {
        id: 'sea-end-2-science',
        type: 'vocabulary',
        word: 'erosion',
        definition: 'The wearing away or removal of material such as sand or soil from a coast',
        distractors: [
          'Planting coconut trees far inland on a hill',
          'Repairing a fishing net with cotton thread',
        ],
      },
      {
        id: 'sea-end-3-critical-thinking',
        type: 'comprehension',
        question: 'Why is dumping rubbish on the beach a poor solution to coastal erosion?',
        options: [
          'It causes pollution and is not a properly designed defence.',
          'It makes the ocean water too cold for fish.',
          'It turns plastic bags into heavy rocks.',
        ],
        correctIndex: 0,
        explanation: 'Dumping rubbish causes pollution and does not provide a properly designed coastal defence.',
      },
      {
        id: 'sea-end-4-investigation',
        type: 'comprehension',
        question: 'When comparing photographs of the same shoreline from different years, what should you remember?',
        options: [
          'Identify visible changes, but photos alone do not prove the cause.',
          'One old photograph proves every cause without measurements.',
          'Shorelines never change over many years.',
        ],
        correctIndex: 0,
        explanation: 'Photographs help us identify visible changes over time, while accurate measurements and monitoring are needed to establish causes.',
      },
      {
        id: 'sea-end-5-creative-poster',
        type: 'prediction',
        prompt: 'If you design a poster titled "Protect Our Coast", which message is most scientifically reasonable?',
        options: [
          'Keep beaches clean, protect coastal plants and follow expert advice.',
          'Pile old tyres and plastic bags along the water.',
          'Build houses right on the wet sand next to the waves.',
        ],
      },
    ],
    glossary: [
      { word: 'shoreline', definition: 'The line where a body of water meets the land or beach.', pages: [2] },
      { word: 'currents', definition: 'Steady flows of water moving in a particular direction in the sea.', pages: [2, 3] },
      { word: 'erosion', definition: 'The wearing away and removal of sand, soil or rock by water or wind.', pages: [2, 4] },
      { word: 'sediment', definition: 'Solid material such as sand or silt carried and deposited by water or wind.', pages: [3] },
      { word: 'livelihoods', definition: 'The ways people earn the money or resources needed to support their families.', pages: [4] },
      { word: 'vegetation', definition: 'Plants and trees growing in a particular area, such as coastal grasses and mangroves.', pages: [5] },
      { word: 'monitoring', definition: 'Observing and measuring something regularly over a period of time.', pages: [6, 7] },
    ],
    teacherGuide: {
      overview:
        'Introduce erosion and sediment movement with a supervised tray demonstration. Explain that coastal change has multiple causes and that local evidence matters. Do not take children near unstable cliffs, dangerous surf or eroding structures.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain that coastal erosion is the wearing away or removal of material from a coast by waves, currents and water movement.',
        'Identify factors that can contribute to coastal change, including waves, currents, storms and rising sea level, while recognizing the need for local investigation.',
        'Evaluate why dumping rubbish on the beach is harmful and why coastal protection requires scientific assessment and community planning.',
      ],
      subjectLinks: [
        { subject: 'Science & Environmental Studies', link: 'Erosion, sediment transport, weather, sea level and environmental stewardship', status: 'to-verify' },
        { subject: 'Our World Our People / Social Studies', link: 'Coastal communities, safety, local governance and environmental protection', status: 'to-verify' },
        { subject: 'English Language', link: 'Reading comprehension, scientific vocabulary and oral presentation', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners whether they have ever seen water move sand or soil during heavy rain or at the beach.',
        'Preview the title "The Sea That Came Closer" and ask what might happen if the shoreline moves toward a community.',
      ],
      whileReading: [
        'Pause at Page 1 and Page 3 for the embedded quick questions on why Teye was surprised and what the tray experiment demonstrated.',
        'On Page 5, discuss why Akweley and Madam Ofori rejected the idea of piling plastic bags and tyres on the beach.',
      ],
      afterReading: [
        'Guide learners through the five end-of-story tasks: naming contributors to coastal change, defining coastal erosion, explaining why rubbish dumping fails, comparing shoreline photos carefully, and designing a "Protect Our Coast" poster.',
      ],
      discussion: [
        'Why did Madam Ofori say we must investigate local conditions before deciding what causes changes at a particular beach?',
        'How did Teye, Akweley, parents, fishers, engineers and officials work together at the community meeting?',
      ],
      reflection: [
        'What environmental change have you noticed in your own community, and how could you investigate it safely with adult guidance?',
      ],
      mathsExtension: [
        {
          task: 'Suppose a safe observation marker is placed 35 metres from the high-water line, and after a year of measurements the high-water line is 32 metres from the marker. How many metres closer did the high-water line move that year?',
          answer: '35 metres - 32 metres = 3 metres.',
        },
      ],
      differentiation: {
        support: ['Use the classroom sand-and-water tray demonstration before reading so learners can see sediment movement firsthand.'],
        stretch: ['Have learners write three interview questions they would ask a coastal engineer or local elder about how the environment has changed over time.'],
      },
      culturalNotes: [
        'Coastal fishing and beach football are central to community life in towns along Ghana’s coast.',
      ],
      localiseThis: [
        'For inland schools, connect the tray demonstration to soil erosion along riverbanks, school compounds or gullies after heavy rainfall.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Waves, currents, storms and sea-level changes transport sediment and reshape coastlines through erosion and deposition.',
          'Dumping plastic waste and old tyres pollutes marine ecosystems and does not provide engineered coastal protection.',
        ],
        whatWeAreStillDiscovering: [
          'Coastal scientists and engineers continuously monitor how local currents, sediment supply and long-term sea-level trends interact at specific beaches.',
        ],
      },
      investigation: {
        title: 'Supervised Classroom Sand-and-Water Tray Demonstration',
        materials: ['A shallow plastic or metal tray', 'Clean sand or soil', 'A small cup of water'],
        steps: [
          'Shape clean sand at one end of the shallow tray to model a gentle beach slope.',
          'Pour water carefully into the other end of the tray.',
          'Gently tilt or wave a ruler in the water and observe how grains of sand shift and move.',
        ],
        safetyNote: 'Conduct inside the classroom under teacher supervision. Never take children near unstable cliffs, dangerous surf or eroding coastal structures.',
        whatToNotice: 'Moving water picks up and transports sand grains (sediment), changing the shape of the model shoreline.',
      },
      factCheck: [
        {
          claim: 'Waves, currents, storms and changes in sea level can affect coastlines, and local conditions must be investigated.',
          explanation: 'Coastal morphodynamics depend on wave energy, longshore currents, sediment supply, human activities and relative sea-level change.',
          reference: 'IPCC AR6 Working Group I & II Reports on Coastal Systems; EPA Ghana Coastal Zone Management guidelines',
        },
      ],
    },
  },

  // =================================================================================================
  // 2. THE QUEEN OF THE MARKET (Primary 3–4 · 8 pages · Ghanaian history, women's enterprise & maths)
  // =================================================================================================
  {
    key: 'the-queen-of-the-market',
    set: 'extension',
    title: 'The Queen of the Market',
    summary:
      'Nine-year-old Adom visits a busy Kumasi market with Grandma Akua and meets Auntie Serwaa, a respected trader who solves disputes fairly, keeps honest records, refuses to mix spoiled tomatoes with fresh ones, and inspires Adom’s class to create record books and celebrate the women who help build Ghana’s economy.',
    classification: base({
      classIds: ['primary-3', 'primary-4'],
      ageMin: 8,
      ageMax: 10,
      readingLevel: 'developing',
      difficulty: 2,
      genres: ['realistic-fiction', 'historical', 'educational'],
      themes: ['money-and-enterprise', 'leadership', 'community'],
      objectives: ['financial-literacy', 'honesty', 'counting', 'cultural-heritage', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['market', 'local-names'],
      estimatedDurationSec: 350,
    }),
    palette: ['#d97706', '#059669'],
    characters: [
      'Adom: 9-year-old Ghanaian girl with braided puffs and colourful beads, wearing a cheerful yellow-and-green dress and carrying a small idea notebook.',
      'Grandma Akua: Warm, wise Ashanti grandmother wearing a patterned kente-cloth wrap and headwrap with gentle spectacles.',
      'Auntie Serwaa: Respected Kumasi market trader in a vibrant orange-and-green wax-print dress and apron, with a sales notebook and baskets of fresh oranges and vegetables.',
    ],
    narrationPlan: {
      voice: 'Warm, lively Ghanaian-English storyteller voice (Kore) capturing the bustle of Kumasi market and Grandma Akua’s wisdom',
      pace: 'Clear developing-reader pace (about 110 words per minute)',
      notes: ['Make the market arithmetic on Page 4 clear and easy to follow.', 'Bring out Auntie Serwaa’s calm fairness and Grandma Akua’s warmth.'],
    },
    music: 'Kumasi Morning Market Piano (cheerful, gentle rhythmic piano accompaniment ducked beneath narration)',
    culturalNotes: [
      'Kumasi is home to one of West Africa’s largest open-air markets, where women traders have historically played a central role in commerce and community leadership.',
      'Adom ("grace"), Akua (Wednesday-born) and Serwaa are traditional Akan names.',
    ],
    reviewQuestions: [
      'Are the market arithmetic problems (4 × GH₵15 = GH₵60; GH₵100 - GH₵60 = GH₵40) and the distinction between sales revenue and profit clear and accurate?',
      'Does the historical note avoid overgeneralizing while recognizing the diverse economic, political and community leadership roles of women across Ghana?',
    ],
    pages: [
      {
        motif: 'a-market-full-of-voices',
        text: `"Fresh tomatoes! Sweet oranges! Beautiful cloth!" Nine-year-old Adom held her grandmother's hand as they entered the busy market in Kumasi. "Grandma, how do people remember the prices of so many things?" Grandma Akua laughed. "Some use notebooks. Some use calculators. And some have been doing business for so long that they can calculate faster than you can run!" Adom watched a woman arranging baskets of vegetables while speaking to three customers. "She looks like the queen of the market," Adom whispered. Grandma smiled. "Perhaps she is a leader in more ways than you know."`,
        alt: 'Nine-year-old Adom holding Grandma Akua’s hand as they enter a colourful, busy market in Kumasi and watch Auntie Serwaa arranging baskets of vegetables.',
        brief: '3D animated vibrant Kumasi market scene. 9-year-old Adom in a yellow-and-green dress holds Grandma Akua’s hand among stalls of red tomatoes, sweet oranges and colourful Ghanaian cloths, looking admiringly at Auntie Serwaa arranging woven baskets of fresh vegetables.',
        narration: 'Start with cheerful market calls, then warm curiosity between Adom and Grandma Akua.',
      },
      {
        motif: 'the-woman-who-solved-problems',
        text: `The woman was Auntie Serwaa. When a trader discovered that her delivery had not arrived, Auntie Serwaa helped her contact the driver. When two customers disagreed over an order, she listened carefully to both sides. When an elderly trader struggled to carry a basket, she found someone to help. "Is Auntie Serwaa the richest person here?" Adom asked. "I do not know," Grandma replied. "But leadership is not measured only by money." Adom thought about that. Auntie Serwaa seemed to spend as much time solving problems as selling goods.`,
        alt: 'Auntie Serwaa listening calmly to two customers in the market while Adom and Grandma Akua watch her helpful leadership.',
        brief: '3D animated Kumasi market stall scene. Auntie Serwaa in an orange-and-green wax-print dress listens calmly and fairly to two customers beside baskets of produce while a young helper assists an elderly trader in the background and Adom watches with Grandma Akua.',
        narration: 'Warm, respectful tone highlighting Auntie Serwaa’s fairness and problem-solving.',
      },
      {
        motif: 'a-lesson-from-history',
        text: `That evening, Grandma showed Adom photographs of Ghanaian markets from earlier generations. "Women have played important roles in trade across Ghana for a very long time," she explained. "They have built businesses, supplied communities and supported families." "Did women also become leaders?" Adom asked. "Certainly. Ghanaian history includes women who exercised economic, political and community leadership. Their roles differed across societies and periods." Adom studied the photographs. "Then our history is not only about kings, chiefs and wars." "Exactly. History is also about farmers, traders, craftspeople and ordinary people whose work shaped communities."`,
        alt: 'Grandma Akua sitting with Adom in the evening showing her historical photographs of Ghanaian women traders and community leaders.',
        brief: '3D animated warm living-room scene in Kumasi at evening. Grandma Akua and Adom sit on a sofa looking at a photo album showing historical black-and-white photographs of Ghanaian market traders and community leaders under warm lamplight.',
        narration: 'Reflective, storytelling warmth as Grandma Akua shares the history of Ghanaian women in trade and leadership.',
      },
      {
        motif: 'the-missing-twenty-cedis',
        text: `The next Saturday, Auntie Serwaa asked Adom to help with a simple calculation. A customer bought four baskets of oranges at GH₵15 each. "The total is GH₵60," Adom said. The customer handed over GH₵100. "How much change?" "GH₵40!" Auntie Serwaa counted the money carefully. "Good. Accurate records protect both the seller and the buyer." Then she showed Adom the notebook where she recorded sales and expenses. "Money entering a business is not automatically profit," she explained.`,
        alt: 'Adom helping Auntie Serwaa calculate the cost of four baskets of oranges and the change while looking at Auntie Serwaa’s sales and expenses notebook.',
        brief: '3D animated market stall close-up. Four woven baskets of bright oranges sit on the counter while Adom smiles proudly and Auntie Serwaa shows her a ruled ledger notebook recording sales and expenses.',
        narration: 'Crisp, lively pacing for the mental maths calculation and clear emphasis on recording sales and expenses.',
      },
      {
        motif: 'a-difficult-decision',
        text: `One morning, a trader received a delivery of tomatoes. Some were fresh. Others were badly spoiled. "Mix them together," suggested another seller. "Customers may not notice." Auntie Serwaa shook her head. "That would be dishonest and could harm people." She helped the trader separate the spoiled tomatoes and contact the supplier. Adom watched quietly. Later she asked, "Does honesty always make business easy?" "No," Auntie Serwaa replied. "But trust is valuable, and customers deserve safe products and truthful information."`,
        alt: 'Auntie Serwaa helping a fellow trader separate fresh red tomatoes from spoiled ones into different baskets while Adom watches.',
        brief: '3D animated morning market scene. Auntie Serwaa kneels beside wooden crates of tomatoes, helping another trader sort bright fresh red tomatoes away from bruised spoiled ones while shaking her head at dishonesty as Adom observes attentively.',
        narration: 'Earnest, principled tone as Auntie Serwaa defends customer safety and honesty.',
      },
      {
        motif: 'the-market-improvement-club',
        text: `Adom noticed that some traders struggled to keep records. Others needed better storage or help understanding mobile payments. She shared an idea with her teacher. "What if our class created simple record books and number charts for traders who wanted them?" The teacher helped the children design clear, easy-to-use examples. Auntie Serwaa welcomed the idea. "Young people can learn from experienced traders," she said, "and experienced traders can learn from young people."`,
        alt: 'Adom and her classmates designing simple record books in school and sharing them with Auntie Serwaa and market traders.',
        brief: '3D animated bright classroom and market crossover scene. Adom and her classmates hold neatly ruled handmade record books and colourful number charts, presenting them to a smiling Auntie Serwaa and grateful market traders.',
        narration: 'Enthusiastic, collaborative tone celebrating intergenerational learning.',
      },
      {
        motif: 'a-small-exhibition',
        text: `At school, Adom presented a display called The Women Who Help Build Ghana's Economy. It included photographs used with permission, interviews and examples of businesses run by women. One visitor asked, "Can women build companies that sell products around the world?" Adom stood tall. "Yes! But they need skills, opportunity, access to resources and support, just like other entrepreneurs." Her teacher smiled. "That is an excellent answer."`,
        alt: 'Adom standing confidently beside her school exhibition board about Ghanaian women entrepreneurs while visitors and her teacher listen.',
        brief: '3D animated school exhibition hall. Adom stands tall and confident beside a colourful display board with photographs and interview cards of Ghanaian women entrepreneurs, answering a visitor’s question while her teacher smiles proudly.',
        narration: 'Confident, inspiring delivery on Adom’s answer about skills, opportunity and support.',
      },
      {
        motif: 'a-different-kind-of-crown',
        text: `The following weekend, Adom returned to the market. Auntie Serwaa handed her a small notebook. "For your ideas," she said. "Grandma," Adom whispered, "I finally understand why Auntie Serwaa is like a queen." "Tell me." "She does not need a golden crown. She helps people, makes decisions and builds trust." Grandma nodded. "And what will you become?" Adom opened her notebook. "Perhaps a businesswoman. Perhaps an inventor. Perhaps both."`,
        alt: 'Auntie Serwaa gifting Adom a small notebook in the Kumasi market while Grandma Akua smiles beside them.',
        brief: '3D animated warm sunlit Kumasi market scene. Auntie Serwaa hands a bright new notebook to a beaming Adom while Grandma Akua stands beside her smiling warmly. Adom opens the notebook with excited determination.',
        narration: 'Warm, uplifting conclusion as Adom opens her new notebook of ideas.',
      },
    ],
    activities: [
      {
        id: 'queen-q1-respected-leader',
        type: 'comprehension',
        afterPage: 2,
        question: 'What made Auntie Serwaa a respected leader in the market?',
        options: [
          'She listened, solved problems, acted fairly and helped others.',
          'She wore a golden crown and refused to speak to customers.',
          'She charged customers without counting their change.',
        ],
        correctIndex: 0,
        explanation: 'Auntie Serwaa earned respect because she listened carefully, solved problems, acted fairly and helped others.',
      },
      {
        id: 'queen-end-1-maths-cost',
        type: 'comprehension',
        question: 'Four baskets of oranges cost GH₵15 each. How much do they cost in total?',
        options: ['GH₵60', 'GH₵45', 'GH₵75'],
        correctIndex: 0,
        explanation: '4 baskets × GH₵15 = GH₵60.',
      },
      {
        id: 'queen-end-2-maths-change',
        type: 'comprehension',
        question: 'A customer pays GH₵100 for GH₵60 of goods. What is the change?',
        options: ['GH₵40', 'GH₵20', 'GH₵60'],
        correctIndex: 0,
        explanation: 'GH₵100 - GH₵60 = GH₵40 change.',
      },
      {
        id: 'queen-end-3-financial-literacy',
        type: 'comprehension',
        question: 'Why is sales revenue different from profit?',
        options: [
          'Expenses must be deducted to determine profit.',
          'All money entering a business is pure profit.',
          'Suppliers give goods to traders for free.',
        ],
        correctIndex: 0,
        explanation: 'Money entering a business is sales revenue; expenses must be deducted to determine profit.',
      },
      {
        id: 'queen-end-4-history',
        type: 'comprehension',
        question: 'How do traders contribute to society?',
        options: [
          'Supplying goods, creating livelihoods and supporting community life',
          'Hiding spoiled goods inside fresh baskets',
          'Refusing to keep records of sales and expenses',
        ],
        correctIndex: 0,
        explanation: 'Traders contribute by supplying goods, creating livelihoods, and supporting trade and community life.',
      },
      {
        id: 'queen-end-5-leadership',
        type: 'comprehension',
        question: 'What should a leader do when two people disagree?',
        options: [
          'Listen fairly, seek facts and work toward a reasonable solution.',
          'Shout louder than everyone else without listening.',
          'Pick a side immediately before hearing the facts.',
        ],
        correctIndex: 0,
        explanation: 'A good leader listens fairly to both sides, seeks the facts and works toward a reasonable solution.',
      },
    ],
    glossary: [
      { word: 'calculate', definition: 'To work out an amount or number using mathematics.', pages: [1] },
      { word: 'leadership', definition: 'Guiding, helping and taking responsibility for a group or community.', pages: [2, 3] },
      { word: 'generations', definition: 'Groups of people born and living at different periods of time in history.', pages: [3] },
      { word: 'expenses', definition: 'Money a business spends on goods, transport and running costs.', pages: [4] },
      { word: 'profit', definition: 'The money left over after all business expenses are subtracted from sales.', pages: [4] },
      { word: 'dishonest', definition: 'Not truthful or fair; trying to deceive others.', pages: [5] },
      { word: 'entrepreneurs', definition: 'People who organize, manage and grow businesses to provide goods or services.', pages: [7] },
    ],
    teacherGuide: {
      overview:
        'Discuss the contribution of Ghanaian women to trade without suggesting that all markets or traders operate in the same way. Invite learners to interview a local entrepreneur with permission. Use real-life calculations and explain that historical examples need supporting sources.',
      lessonMinutes: 45,
      learningGoals: [
        'Solve practical multi-step market calculations involving multiplication (4 × GH₵15 = GH₵60) and subtraction for change (GH₵100 - GH₵60 = GH₵40).',
        'Explain why money entering a business (sales revenue) is not automatically profit because expenses must be deducted.',
        'Describe how women traders and entrepreneurs have contributed to Ghana’s economy and community leadership across history.',
      ],
      subjectLinks: [
        { subject: 'Mathematics', link: 'Multiplication, subtraction, money calculations in Ghana cedis (GH₵) and simple record keeping', status: 'to-verify' },
        { subject: 'History / Our World Our People', link: 'Economic, political and community roles of women in Ghanaian history', status: 'to-verify' },
        { subject: 'English Language', link: 'Reading comprehension, dialogue and oral presentation', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners what they notice when they visit a local market with their family and how traders keep track of prices and change.',
      ],
      whileReading: [
        'Pause at Page 2 for the quick question on what made Auntie Serwaa a respected leader.',
        'On Page 4, let learners calculate 4 × GH₵15 and GH₵100 - GH₵60 aloud with Adom.',
      ],
      afterReading: [
        'Complete the five end-of-story activities covering the orange basket cost, change calculation, sales vs profit, traders’ contributions to society, and fair conflict resolution.',
      ],
      discussion: [
        'Why did Auntie Serwaa refuse to mix spoiled tomatoes with fresh ones even though it might have reduced short-term loss?',
        'How did Adom’s class help local traders while also learning from them?',
      ],
      reflection: [
        'How can you practise honesty and fairness when helping at home, at school or in a community project?',
      ],
      mathsExtension: [
        {
          task: 'Four baskets cost GH₵15 each (GH₵60 total) and a customer pays GH₵100 (GH₵40 change). If Auntie Serwaa paid GH₵44 to buy and transport those four baskets, what is her actual profit?',
          answer: 'GH₵60 sales revenue - GH₵44 expenses = GH₵16 profit.',
        },
      ],
      differentiation: {
        support: ['Use play money or counters in denominations of GH₵10, GH₵5 and GH₵20 to act out the Page 4 orange basket purchase.'],
        stretch: ['Design a simple 3-column record book page showing Date, Item Sold / Expense, and Amount (GH₵).'],
      },
      culturalNotes: [
        'Ghanaian markets have long traditions of female entrepreneurship and leadership; roles vary across regions, commodities and historical periods.',
      ],
      localiseThis: [
        'Invite learners (with parent/teacher supervision and permission) to ask a local trader or shopkeeper how they record sales and expenses.',
      ],
      investigation: {
        title: 'Classroom Market Record-Book Design',
        materials: ['Ruled exercise paper', 'Ruler and pencils'],
        steps: [
          'Draw three clear columns labelled "Item", "Money In (Sales)" and "Money Out (Expenses)".',
          'Record the story’s sale of 4 baskets of oranges at GH₵15 each (GH₵60).',
          'Subtract an example supplier and transport expense of GH₵44 to find the remaining profit (GH₵16).',
        ],
        safetyNote: 'Any interviews with local traders must be conducted with adult supervision and informed permission.',
        whatToNotice: 'Keeping clear written records prevents confusion and shows the true difference between total sales and net profit.',
      },
    },
  },

  // =================================================================================================
  // 3. THE MOSQUITO DETECTIVE (Primary 5–6 · 8 pages · Biology, malaria prevention & reasoning)
  // =================================================================================================
  {
    key: 'the-mosquito-detective',
    set: 'extension',
    title: 'The Mosquito Detective',
    summary:
      'When Nana Yaw blames mosquitoes for every fever in Ghana, his sister Abena and their teacher Madam Lamptey turn the class into science detectives—learning that Plasmodium parasites transmitted by infected female Anopheles mosquitoes cause malaria, why standing water and treated bed nets matter, and why fevers require professional medical testing rather than guessing.',
    classification: base({
      classIds: ['primary-5', 'primary-6'],
      ageMin: 10,
      ageMax: 12,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['health-and-wellbeing', 'school', 'family'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'responsibility', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 350,
    }),
    palette: ['#0d9488', '#eab308'],
    characters: [
      'Abena: 11-year-old Ghanaian girl with neat braided hair, wearing a crisp school uniform and carrying her science detective notebook.',
      'Nana Yaw: Abena’s lively 9-year-old younger brother in a blue striped shirt, curious and expressive.',
      'Madam Lamptey: Knowledgeable Primary 6 science teacher wearing a green kaba-and-slit outfit and glasses.',
      'Mother: Caring Ghanaian mother in a warm patterned dress.',
    ],
    narrationPlan: {
      voice: 'Expressive, clear Ghanaian-English storyteller voice (Kore) with playful sibling banter and precise scientific explanation',
      pace: 'Steady fluent-reader pace (about 115 words per minute)',
      notes: ['Pronounce Plasmodium and Anopheles clearly.', 'Emphasize the rule to seek professional clinic testing for fever rather than self-diagnosing.'],
    },
    music: 'Curious Detective Marimba & Piano (light, inquisitive piano melody ducked beneath narration)',
    culturalNotes: [
      'Insecticide-treated bed nets, compound sanitation and clinic malaria testing (RDT/microscopy) are key public-health practices across Ghana.',
      'Abena (Tuesday-born girl) and Nana Yaw (Thursday-born boy) are classic Akan names; Lamptey is a Ga family name.',
    ],
    reviewQuestions: [
      'Does the story clearly distinguish between the Plasmodium parasite (the cause of malaria) and the infected female Anopheles mosquito (the vector)?',
      'Does the story emphasize professional clinic testing for fever and avoid any instruction to self-diagnose or self-medicate?',
    ],
    pages: [
      {
        motif: 'the-night-of-the-buzzing-visitor',
        text: `"Bzzzzzz!" Nana Yaw pulled his blanket over his head. The mosquito returned. "Bzzzzzz!" The next morning, his sister, Abena, found him complaining. "I hate mosquitoes!" he said. "They cause every fever in Ghana." Abena shook her head. "Not every fever is malaria, and not every mosquito carries malaria parasites." "How do you know?" "Our science teacher told us. Come to school early. We are investigating mosquitoes today." Nana Yaw's eyes widened. "Investigating? Like detectives?" "Exactly!"`,
        alt: 'Nana Yaw complaining in the morning after a mosquito buzzed near his bed while his sister Abena invites him to investigate mosquitoes at school.',
        brief: '3D animated bright Ghanaian bedroom morning scene. Young Nana Yaw sits on his bed holding his blanket with a grumpy expression while his older sister Abena in her school uniform holds a science notebook and smiles encouragingly.',
        narration: 'Open with a playful mosquito buzz, grumpy humour for Nana Yaw, and bright confidence for Abena.',
      },
      {
        motif: 'the-tiny-suspect',
        text: `Madam Lamptey displayed an enlarged photograph of a mosquito. "Malaria is caused by Plasmodium parasites," she explained. "In humans, the parasites are commonly transmitted through bites from infected female Anopheles mosquitoes." Nana Yaw frowned. "So the mosquito is not the parasite?" "Correct. The mosquito can carry and transmit it." "Then why doesn't every mosquito bite cause malaria?" "Because not every mosquito is infected, and different mosquito species have different roles." Abena wrote in her notebook: Good detectives must identify the real cause.`,
        alt: 'Madam Lamptey showing an enlarged diagram of an Anopheles mosquito and Plasmodium parasite to Abena, Nana Yaw and classmates.',
        brief: '3D animated Ghanaian science classroom. Madam Lamptey in a green patterned dress points to an educational illustration of a mosquito and microscopic parasites on a board while Abena writes in her detective notebook and Nana Yaw listens intently.',
        narration: 'Clear, careful pronunciation of "Plasmodium" and "Anopheles", emphasizing the distinction between parasite and carrier.',
      },
      {
        motif: 'the-mystery-of-the-water-container',
        text: `During a supervised walk around the school compound, the class noticed an uncovered container holding rainwater. "Look!" cried Nana Yaw. "Something is moving!" Madam Lamptey observed the water from a safe distance. "Those may be mosquito larvae. Mosquitoes develop through several life stages, and many species use standing water for their early development." "Then we should remove places where mosquitoes breed!" Abena said. "Where appropriate and safe, yes. Adults should manage water storage, drainage and sanitation properly." The class reported the container to the school caretaker.`,
        alt: 'Madam Lamptey, Abena and Nana Yaw observing an uncovered rainwater container from a safe distance on the school compound before reporting it to the caretaker.',
        brief: '3D animated outdoor school compound scene in Ghana. Madam Lamptey supervises Abena, Nana Yaw and classmates at a safe distance from an uncovered plastic bucket holding rainwater, while the school caretaker approaches to empty and cover it safely.',
        narration: 'Curious detective tone on the compound walk, with clear emphasis on reporting standing water to adults.',
      },
      {
        motif: 'the-fever',
        text: `A few days later, Nana Yaw developed a fever. "Malaria!" he announced immediately. His mother placed a reassuring hand on his shoulder. "A fever can have several causes. We need a health professional to assess you." At the clinic, a health worker examined him and arranged an appropriate test. "Why test?" Nana Yaw asked. "Because symptoms alone do not reliably tell us whether someone has malaria," the health worker explained. Nana Yaw realized that even a good detective should not guess when reliable testing is available.`,
        alt: 'Nana Yaw and his mother at a Ghanaian clinic where a friendly health worker explains why a medical test is needed to check the cause of a fever.',
        brief: '3D animated clean Ghanaian community clinic. Nana Yaw sits beside his mother while a friendly Ghanaian health worker in a clinical coat explains a diagnostic test with a reassuring smile.',
        narration: 'Warm, reassuring tone from Mother and the health worker explaining why testing is essential before diagnosis.',
      },
      {
        motif: 'protecting-the-family',
        text: `After Nana Yaw recovered, his family reviewed how to reduce mosquito bites. They checked their insecticide-treated bed nets for damage and made sure they were used correctly. They also discussed window screens and the safe management of standing water. "Does a bed net make us completely safe?" Nana Yaw asked. "No single measure removes every risk," his mother replied. "We use recommended prevention measures and seek medical care when someone becomes ill."`,
        alt: 'Nana Yaw, Abena and their mother checking and tucking in an insecticide-treated bed net in their bedroom.',
        brief: '3D animated Ghanaian home bedroom scene. Mother, Abena and recovered Nana Yaw carefully inspect a clean white insecticide-treated mosquito net and tuck it neatly around the mattress near a screened window.',
        narration: 'Calm, practical family discussion showing layered malaria prevention.',
      },
      {
        motif: 'a-surprising-discovery',
        text: `Back at school, Abena presented her findings. "Malaria is not caused by dirty water itself," she explained. "It is caused by parasites. Mosquito breeding sites can increase the number of mosquitoes, but the parasite and its transmission are the key parts of the disease." Madam Lamptey nodded. "Excellent distinction." Nana Yaw raised his hand. "Then cleaning the compound is useful, but it cannot replace testing and treatment." "Precisely."`,
        alt: 'Abena presenting her science findings at the front of the classroom while Madam Lamptey nods and Nana Yaw raises his hand.',
        brief: '3D animated Ghanaian classroom scene. Abena stands at the front holding her detective notebook and explaining malaria transmission while Madam Lamptey nods approvingly and Nana Yaw raises his hand.',
        narration: 'Clear, articulate delivery highlighting the scientific distinction between standing water, mosquito vectors and parasites.',
      },
      {
        motif: 'the-science-fair',
        text: `The class prepared a science exhibition. They built a large paper model showing the mosquito life cycle. Another group made a poster about recognizing illness and seeking professional care. Abena created a diagram explaining how malaria transmission occurs. Parents gathered around the displays. "These children are teaching us important things," one visitor said. Nana Yaw grinned. "And we have learned not to blame every fever on mosquitoes!"`,
        alt: 'Abena, Nana Yaw and classmates presenting their mosquito life-cycle model and public-health posters to parents at a school science exhibition.',
        brief: '3D animated lively school science fair in Ghana. Abena and Nana Yaw stand proudly beside a colourful paper craft model of the mosquito life cycle and transmission diagrams while visiting parents and teachers admire the displays.',
        narration: 'Proud, upbeat atmosphere at the school science exhibition.',
      },
      {
        motif: 'detective-abenas-final-report',
        text: `That evening, Abena closed her notebook. Case: The Mosquito Mystery. Evidence: Malaria parasites can be transmitted by infected mosquitoes. Prevention: Reduce bites and breeding opportunities using recommended measures. Important rule: Seek professional testing and care for suspected malaria. Nana Yaw peered over her shoulder. "Will you become a doctor?" "Maybe," Abena said. "Or a scientist who discovers better ways to prevent disease." "Then I will be your assistant." She laughed. "Only if you stop diagnosing every fever yourself!"`,
        alt: 'Abena closing her detective notebook at home while Nana Yaw peers over her shoulder and they both laugh.',
        brief: '3D animated cosy evening study scene at home. Abena sits at a wooden desk closing her notebook while Nana Yaw leans over her shoulder grinning, and both siblings laugh warmly together.',
        narration: 'Read the case summary crisply like a detective’s report, ending with warm sibling laughter.',
      },
    ],
    activities: [
      {
        id: 'mosquito-q1-cause',
        type: 'comprehension',
        afterPage: 2,
        question: 'What causes malaria?',
        options: [
          'Plasmodium parasites transmitted by infected female Anopheles mosquitoes',
          'Every flying insect that buzzes at night',
          'Drinking clean water after playing football',
        ],
        correctIndex: 0,
        explanation: 'Malaria is caused by Plasmodium parasites, which can be transmitted by infected female Anopheles mosquitoes.',
      },
      {
        id: 'mosquito-end-1-organism',
        type: 'comprehension',
        question: 'What organism causes malaria?',
        options: ['Plasmodium parasite', 'An earthworm', 'A butterfly'],
        correctIndex: 0,
        explanation: 'The Plasmodium parasite is the organism that causes malaria.',
      },
      {
        id: 'mosquito-end-2-vector',
        type: 'comprehension',
        question: 'Which mosquitoes can transmit human malaria?',
        options: [
          'Infected female Anopheles mosquitoes',
          'Every mosquito of every species',
          'Only male mosquitoes that feed on nectar',
        ],
        correctIndex: 0,
        explanation: 'In humans, malaria parasites are transmitted through bites from infected female Anopheles mosquitoes.',
      },
      {
        id: 'mosquito-end-3-fever-reasoning',
        type: 'comprehension',
        question: 'Does every fever mean a person has malaria?',
        options: [
          'No; a fever can have several causes and needs medical assessment.',
          'Yes; every fever is always malaria.',
          'Yes; there is never a need to visit a clinic.',
        ],
        correctIndex: 0,
        explanation: 'No. A fever can have several causes, so a health professional and appropriate testing are needed.',
      },
      {
        id: 'mosquito-end-4-prevention',
        type: 'comprehension',
        question: 'Which two measures help reduce malaria risk?',
        options: [
          'Correct use of treated bed nets and reducing suitable breeding sites',
          'Leaving rainwater containers uncovered outside',
          'Guessing illnesses at home without visiting a clinic',
        ],
        correctIndex: 0,
        explanation: 'Using insecticide-treated bed nets correctly and safely reducing mosquito breeding sites help lower malaria risk.',
      },
      {
        id: 'mosquito-end-5-testing',
        type: 'comprehension',
        question: 'Why is medical testing important when someone has a fever?',
        options: [
          'Symptoms can have different causes, so testing supports diagnosis.',
          'Testing is only done for fun after someone recovers.',
          'Symptoms alone always tell the exact cause.',
        ],
        correctIndex: 0,
        explanation: 'Because symptoms alone do not reliably identify malaria, testing supports accurate diagnosis and treatment.',
      },
    ],
    glossary: [
      { word: 'parasites', definition: 'Organisms that live in or on another organism and can cause disease, such as Plasmodium.', pages: [1, 2, 6, 8] },
      { word: 'transmitted', definition: 'Passed or carried from one person or organism to another.', pages: [2, 8] },
      { word: 'larvae', definition: 'The immature, wingless early stage of insects such as mosquitoes that hatch from eggs.', pages: [3] },
      { word: 'sanitation', definition: 'Systems and practices that keep water, drainage and surroundings clean and healthy.', pages: [3] },
      { word: 'symptoms', definition: 'Signs of illness felt by a person, such as fever, headache or tiredness.', pages: [4] },
      { word: 'prevention', definition: 'Actions taken to stop a disease or problem from happening or spreading.', pages: [5, 8] },
    ],
    teacherGuide: {
      overview:
        'Do not collect or breed live mosquitoes for classroom activities. Use photographs, diagrams and supervised environmental observations. Avoid giving children instructions to self-diagnose or self-medicate. Medical guidance should be reviewed against current Ghana Health Service and WHO recommendations before publication.',
      lessonMinutes: 45,
      learningGoals: [
        'Distinguish between the organism that causes malaria (Plasmodium parasite) and the vector that transmits it (infected female Anopheles mosquito).',
        'Explain why standing water supports mosquito development and how insecticide-treated bed nets, window screens and adult-managed sanitation reduce risk.',
        'Explain why fevers require assessment and testing by a qualified health professional rather than self-diagnosis.',
      ],
      subjectLinks: [
        { subject: 'Science', link: 'Life cycles of insects, parasites and vectors, and communicable disease prevention', status: 'to-verify' },
        { subject: 'Our World Our People / Health Education', link: 'Environmental sanitation, bed-net use and seeking professional healthcare', status: 'to-verify' },
        { subject: 'English Language', link: 'Scientific vocabulary, cause-and-effect reasoning and informational presentation', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners what they know about mosquitoes and how families protect themselves from mosquito bites at night.',
      ],
      whileReading: [
        'Pause at Page 2 for the quick question on what causes malaria, reinforcing the difference between the Plasmodium parasite and the mosquito vector.',
        'On Page 4, discuss why Nana Yaw’s mother took him to the clinic for testing instead of guessing.',
      ],
      afterReading: [
        'Complete the five end-of-story activities covering the Plasmodium parasite, infected female Anopheles mosquitoes, why not every fever is malaria, prevention measures, and the importance of diagnostic testing.',
      ],
      discussion: [
        'Why did Abena say that malaria is not caused by dirty water itself, even though standing water matters?',
        'Why is it important never to self-diagnose or take medicine without a health professional’s advice?',
      ],
      reflection: [
        'What safe steps can your household take this week to check bed nets and report uncovered water containers to adults?',
      ],
      mathsExtension: [
        {
          task: 'If a community clinic tests 40 patients who have a fever and 25 test positive for malaria while 15 have other causes of fever, what fraction of the fever patients did NOT have malaria?',
          answer: '15 out of 40 patients (or 3/8), showing why testing is essential before treatment.',
        },
      ],
      differentiation: {
        support: ['Draw a simple 3-box chain on the board: Plasmodium parasite → Infected female Anopheles mosquito → Transmission to human.'],
        stretch: ['Create a four-stage diagram of the mosquito life cycle (egg, larva, pupa, adult) using paper and coloured pencils.'],
      },
      culturalNotes: [
        'Ghana Health Service and community clinics emphasize testing before treatment ("Test, Treat, Track") and sleeping under insecticide-treated nets.',
      ],
      localiseThis: [
        'Remind learners to report any uncovered water containers or blocked drains at school to the school caretaker or teachers rather than handling stagnant water themselves.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Human malaria is caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.',
          'Insecticide-treated bed nets, vector management and prompt professional testing and treatment reduce malaria illness.',
        ],
        whatWeAreStillDiscovering: [
          'Scientists continue researching more effective malaria vaccines, new antimalarial medicines and ways to overcome insecticide resistance.',
        ],
      },
      investigation: {
        title: 'Paper Model of the Mosquito Life Cycle & Prevention Poster',
        materials: ['Paper or card', 'Coloured pencils or markers', 'Published reference diagrams of the mosquito life cycle'],
        steps: [
          'Draw the four stages of the mosquito life cycle (egg, larva, pupa, adult) on a poster using textbook diagrams.',
          'Mark which stages live in standing water and how adult-managed covering or draining of containers interrupts breeding.',
          'Add a clear reminder box: "Always visit a clinic for a malaria test when someone has a fever."',
        ],
        safetyNote: 'Do NOT collect, keep or breed live mosquitoes or larvae, and do not touch stagnant water.',
        whatToNotice: 'Interrupting breeding sites and using treated bed nets reduce bites, while clinic testing ensures accurate diagnosis.',
      },
      factCheck: [
        {
          claim: 'Malaria is caused by Plasmodium parasites and transmitted by infected female Anopheles mosquitoes; fevers require diagnostic testing.',
          explanation: 'WHO and Ghana Health Service guidelines require parasitological confirmation (by RDT or microscopy) of suspected malaria before treatment.',
          reference: 'World Health Organization (WHO) World Malaria Report & Ghana Health Service Malaria Case Management Guidelines',
        },
      ],
    },
  },

  // =================================================================================================
  // 4. THE VILLAGE THAT OWNED A FACTORY (JHS 1–3 · 9 pages · Cooperative finance, shares, bonds & jobs)
  // =================================================================================================
  {
    key: 'the-village-that-owned-a-factory',
    set: 'extension',
    title: 'The Village That Owned a Factory',
    summary:
      'Near Nsawam, fourteen-year-old Naa and her friend Sadiq ask whether local pineapple farmers could reduce post-harvest losses by forming an adult-run processing cooperative—learning about member ownership, feasibility budgets, capital gaps, shares versus bonds, honest financial reporting and job creation.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['realistic-fiction', 'educational'],
      themes: ['money-and-enterprise', 'community', 'careers'],
      objectives: ['financial-literacy', 'problem-solving', 'honesty', 'teamwork', 'critical-thinking'],
      ghanaianContext: 'central',
      culturalTags: ['village-life', 'local-names'],
      estimatedDurationSec: 400,
    }),
    palette: ['#eab308', '#15803d'],
    characters: [
      'Naa: 14-year-old Ghanaian girl with neat braided hair, wearing a green checkered shirt and jeans, carrying a sketchpad and calculator.',
      'Sadiq: 14-year-old Ghanaian boy in a crisp blue collared shirt and spectacles, thoughtful and analytical.',
      'Naa’s Mother: Hardworking pineapple farmer near Nsawam wearing a colourful headscarf and work apron.',
      'Mr. Boateng: Experienced local pineapple farmer in a woven hat.',
      'Cooperative Adviser: Professional Ghanaian business adviser in a tailored blazer carrying a feasibility folder.',
    ],
    narrationPlan: {
      voice: 'Clear, engaging Ghanaian-English storyteller voice (Kore) suitable for JHS learners',
      pace: 'Steady proficient-reader pace (about 120 words per minute)',
      notes: ['Read the GH₵80,000 illustrative pilot budget clearly on Page 4.', 'Maintain a clear distinction between cooperatives, company shares and bonds.'],
    },
    music: 'Nsawam Harvest & Enterprise Piano (warm, purposeful acoustic piano accompaniment ducked beneath narration)',
    culturalNotes: [
      'Nsawam in the Eastern Region of Ghana is famous for pineapple cultivation and fruit processing.',
      'Naa (Ga), Boateng (Akan) and Sadiq reflect the diversity of Ghanaian farming and school communities.',
    ],
    reviewQuestions: [
      'Are the illustrative pilot budget figures (GH₵40,000 + GH₵20,000 + GH₵20,000 = GH₵80,000; 40 members × GH₵1,000 = GH₵40,000; GH₵40,000 gap) exact and verified?',
      'Does the story clearly distinguish cooperatives, company shares and bonds while emphasizing risk, governance and adult regulatory compliance?',
    ],
    pages: [
      {
        motif: 'the-pineapples-nobody-wanted',
        text: `At a village near Nsawam, farmers gathered beside a mountain of pineapples. Some fruits were beginning to spoil. "The buyers offered us too little," complained Mr. Boateng. "If we wait much longer, we may lose the harvest," said another farmer. Fourteen-year-old Naa watched her mother count the unsold fruit. "Why don't we make pineapple juice ourselves?" she asked. Her mother sighed. "That requires equipment, suitable premises, food-safety controls, workers and money." Naa looked at the farmers. "But there are so many of us. What if we worked together?"`,
        alt: 'Pineapple farmers near Nsawam gathered beside a large pile of harvested pineapples while fourteen-year-old Naa speaks with her mother and Mr. Boateng.',
        brief: '3D animated scene at a pineapple farm collection point near Nsawam, Ghana. Golden-green pineapples are piled high in crates while 14-year-old Naa speaks thoughtfully with her mother and Mr. Boateng.',
        narration: 'Open with the farmers’ concern over spoiling fruit, then Naa’s thoughtful question.',
      },
      {
        motif: 'the-big-idea',
        text: `That evening, Naa drew a picture of a small processing factory. Her friend Sadiq helped her prepare a presentation. They visited the local farmers' association with their teacher. "We are not suggesting that children should operate a factory," Naa began. "We are asking whether adults could investigate a business that processes some of the fruit locally." The farmers listened. One woman raised her hand. "Who would own this business?" Naa smiled. "Perhaps the members could own it together."`,
        alt: 'Naa and Sadiq with their teacher presenting a drawing of a local pineapple processing facility to the adult farmers’ association.',
        brief: '3D animated community meeting hall near Nsawam. 14-year-old Naa and Sadiq stand beside their teacher holding a neat sketch of a small fruit-processing facility while adult farmers listen attentively.',
        narration: 'Respectful, articulate tone as Naa clarifies that adults would investigate and run the business.',
      },
      {
        motif: 'what-is-a-cooperative',
        text: `An experienced cooperative adviser visited the community. "A cooperative is an organization owned and controlled by its members for their shared benefit," she explained. "Its rules determine membership, voting, contributions and how any surplus is used." "Does everyone automatically earn money?" Sadiq asked. "No. A cooperative can make losses, just like other businesses." The adviser explained that the farmers needed a feasibility study, a suitable legal structure, proper records and clear governance. "Working together is powerful," she said, "but good intentions cannot replace sound management."`,
        alt: 'A professional cooperative adviser explaining membership rules, feasibility studies and governance to the farmers, Naa and Sadiq.',
        brief: '3D animated community workshop scene. A Ghanaian female cooperative adviser in a tailored blazer points to a flipchart showing cooperative ownership, voting and governance while Sadiq raises his hand and farmers take notes.',
        narration: 'Clear, authoritative explanation of what a cooperative is and why sound management is required.',
      },
      {
        motif: 'the-numbers-must-work',
        text: `The farmers prepared a simplified classroom budget for a proposed pilot project. In the illustrative pilot budget, equipment was GH₵40,000, facility improvements were GH₵20,000, and initial supplies and working capital were GH₵20,000, giving a total required of GH₵80,000. "If forty members each contribute GH₵1,000, how much will they raise?" the adviser asked. Naa calculated quickly. "GH₵40,000!" "Correct. They would still need GH₵40,000." "Could they borrow it?" Sadiq asked. "Possibly, if suitable financing is available and affordable. But borrowing creates repayment obligations. They must assess the risks first."`,
        alt: 'The cooperative adviser reviewing the GH₵80,000 illustrative pilot budget on a board while Naa calculates the GH₵40,000 member contribution.',
        brief: '3D animated workshop scene. A chalkboard displays clean graphic icons of juice equipment and crates while Naa calculates proudly, Sadiq asks a question, and the adviser explains capital and repayment risk.',
        narration: 'Read the budget figures clearly so learners can follow the arithmetic (GH₵40,000 + GH₵20,000 + GH₵20,000 = GH₵80,000).',
      },
      {
        motif: 'shares-and-bonds',
        text: `At school, their teacher explained two ways businesses and other eligible issuers may raise funds. "When investors buy shares in a company, they acquire an ownership interest. When investors buy bonds, they generally lend money to the issuer under specified terms." "Do shareholders always receive dividends?" Naa asked. "No. Dividends are not guaranteed." "Are bonds always safe?" "No. Issuers can fail to pay, and bond values can change." Naa wrote: Shares = ownership. Bonds = lending. Both involve risk. Their teacher reminded them that a cooperative's member contributions and ownership rules may differ from ordinary company shares.`,
        alt: 'A JHS teacher explaining the difference between company shares, bonds and cooperative member contributions to Naa and Sadiq.',
        brief: '3D animated JHS classroom in Ghana. The teacher stands at the front explaining ownership vs lending while Naa writes neatly in her notebook beside Sadiq.',
        narration: 'Clear, measured instructional tone distinguishing shares, bonds and cooperative contributions.',
      },
      {
        motif: 'the-first-trial',
        text: `After several months of professional advice and planning, the adults organized a small, properly supervised processing trial using suitable licensed facilities. The first batch of juice tasted wonderful. But the packaging cost more than expected. Transport was expensive too. "Then our profit is smaller than we hoped," said the cooperative treasurer. Naa looked disappointed. Her mother smiled. "That is why we test ideas before expanding. A successful trial must include accurate costs, safe production and real customer demand."`,
        alt: 'Adult workers in hygienic food-safety gear inspecting bottled pineapple juice at a licensed trial facility while the treasurer reviews packaging and transport costs.',
        brief: '3D animated clean, hygienic fruit-processing facility. Adult workers in hairnets and white coats inspect golden bottles of pineapple juice while the cooperative treasurer checks an invoice clipboard with Naa’s mother.',
        narration: 'Contrast the excitement of the tasty first batch with the realistic lesson on packaging and transport costs.',
      },
      {
        motif: 'the-honest-treasurer',
        text: `At a members' meeting, the treasurer presented the accounts. "These are our sales, expenses, outstanding bills and cash balance." One member suggested hiding some costs to make the business look more attractive. The chairperson refused. "Investors, lenders and members deserve accurate information." The cooperative arranged appropriate independent financial oversight and agreed to report regularly to members. Naa whispered to Sadiq, "Good governance is part of business success."`,
        alt: 'The cooperative treasurer and chairperson presenting transparent financial accounts to members at a meeting.',
        brief: '3D animated cooperative members’ meeting. The treasurer and chairperson stand at a table with account ledgers, firmly upholding honest reporting while members nod in agreement and Naa whispers to Sadiq.',
        narration: 'Firm, principled tone for the chairperson refusing to hide costs.',
      },
      {
        motif: 'the-first-new-jobs',
        text: `Over time, the cooperative improved its operations and won regular orders. It hired workers for production, quality assurance, logistics and administration. The farmers continued monitoring costs, food safety and market demand. One afternoon, Naa met a young employee who had recently completed vocational training. "This job helps me support my family," he told her. Naa felt proud. The business was not simply selling juice. It was creating opportunities.`,
        alt: 'Naa speaking with a young vocational graduate working in quality assurance and logistics at the pineapple cooperative.',
        brief: '3D animated bright cooperative loading bay and quality lab. A young Ghanaian technician in a neat uniform checks crates of bottled pineapple juice and smiles warmly as he speaks with Naa and her mother.',
        narration: 'Warm, encouraging tone showing how a well-managed enterprise creates real jobs.',
      },
      {
        motif: 'a-factory-with-many-owners',
        text: `At the cooperative's anniversary meeting, Naa stood beside her mother. "Did you ever imagine this?" she asked. "I imagined earning a fair return for our fruit," her mother said. "But I did not know where the journey would lead." Naa looked at the workers and farmers. "One idea brought people together. Knowledge helped them plan. Investment provided resources. Good management helped them continue." Her mother nodded. "And everyone still has to work hard to keep the business healthy." Naa opened a fresh notebook. On the first page, she wrote: What other problems can we solve together?`,
        alt: 'Naa and her mother standing together at the cooperative’s anniversary celebration surrounded by farmers and workers as Naa writes in a fresh notebook.',
        brief: '3D animated celebratory community gathering outside the pineapple cooperative near Nsawam. Farmers and workers smile together while Naa stands beside her mother holding an open notebook with a hopeful expression.',
        narration: 'Thoughtful, inspiring conclusion emphasizing planning, investment, good management and ongoing hard work.',
      },
    ],
    activities: [
      {
        id: 'factory-q1-cooperative-feature',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is one important feature of a cooperative?',
        options: [
          'It is owned and controlled by its members under agreed rules.',
          'It is guaranteed by law never to make a loss.',
          'Only one person makes every decision without rules.',
        ],
        correctIndex: 0,
        explanation: 'A cooperative is owned and controlled by its members for their shared benefit under agreed rules.',
      },
      {
        id: 'factory-end-1-capital-calc',
        type: 'comprehension',
        question: 'Forty members contribute GH₵1,000 each. How much is raised?',
        options: ['GH₵40,000', 'GH₵20,000', 'GH₵80,000'],
        correctIndex: 0,
        explanation: '40 members × GH₵1,000 = GH₵40,000.',
      },
      {
        id: 'factory-end-2-funding-gap',
        type: 'comprehension',
        question: 'Required capital is GH₵80,000 and members raise GH₵40,000. What remains?',
        options: ['GH₵40,000', 'GH₵10,000', 'GH₵60,000'],
        correctIndex: 0,
        explanation: 'GH₵80,000 required - GH₵40,000 raised = GH₵40,000 remaining.',
      },
      {
        id: 'factory-end-3-shares',
        type: 'comprehension',
        question: 'What does owning shares in a company generally mean?',
        options: [
          'Owning an interest in a company',
          'Lending money with a guaranteed fixed payment',
          'Receiving a guaranteed dividend every month',
        ],
        correctIndex: 0,
        explanation: 'When investors buy shares in a company, they acquire an ownership interest.',
      },
      {
        id: 'factory-end-4-bonds',
        type: 'comprehension',
        question: 'What does buying a bond generally mean?',
        options: [
          'Lending to an issuer under specified terms',
          'Becoming the sole owner of a cooperative farm',
          'Eliminating all financial risk',
        ],
        correctIndex: 0,
        explanation: 'When investors buy bonds, they generally lend money to the issuer under specified terms.',
      },
      {
        id: 'factory-end-5-risk',
        type: 'comprehension',
        question: 'Can a cooperative make losses?',
        options: [
          'Yes, a cooperative can make losses just like other businesses.',
          'No, cooperatives automatically earn profits every year.',
          'No, packaging and transport never cost money.',
        ],
        correctIndex: 0,
        explanation: 'Yes. A cooperative can make losses, just like other businesses, which is why sound management and feasibility testing matter.',
      },
      {
        id: 'factory-end-6-governance',
        type: 'comprehension',
        question: 'Why should the treasurer report all expenses honestly?',
        options: [
          'To support transparency, accountability and informed decisions',
          'To hide packaging costs from the members',
          'So members do not know the cash balance',
        ],
        correctIndex: 0,
        explanation: 'Accurate reporting supports transparency, accountability and informed decisions for members, lenders and investors.',
      },
    ],
    glossary: [
      { word: 'cooperative', definition: 'An organization owned and controlled by its members for their shared benefit under agreed rules.', pages: [3, 6, 7, 8] },
      { word: 'feasibility', definition: 'An assessment of whether a proposed project or business plan is practical and financially viable.', pages: [3] },
      { word: 'governance', definition: 'The system of rules, oversight and accountability used to direct and manage an organization.', pages: [3, 7] },
      { word: 'shares', definition: 'Units of ownership interest in a company.', pages: [5] },
      { word: 'bonds', definition: 'Debt instruments where an investor lends money to an issuer under specified terms.', pages: [5] },
      { word: 'dividends', definition: 'Payments made by a company to its shareholders out of profits (not guaranteed).', pages: [5] },
      { word: 'logistics', definition: 'The careful organization of storing, handling and transporting goods to customers.', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'Use a mock cooperative exercise. Learners can propose a product, estimate costs and identify risks. Explain that a cooperative, a limited company and a bond issuer may have different legal structures. The example is fictional and is not an investment recommendation. Any actual fundraising, securities issuance or food processing would require appropriate legal and regulatory compliance.',
      lessonMinutes: 50,
      learningGoals: [
        'Explain what a cooperative is and why member ownership requires clear rules, feasibility studies and honest financial governance.',
        'Calculate capital contributions and funding gaps from an illustrative pilot budget (GH₵40,000 + GH₵20,000 + GH₵20,000 = GH₵80,000; 40 × GH₵1,000 = GH₵40,000).',
        'Distinguish between company shares (ownership interest) and bonds (lending to an issuer), noting that both carry risk and differ from cooperative contributions.',
      ],
      subjectLinks: [
        { subject: 'Business Studies / Career Technology', link: 'Cooperatives, enterprise planning, food processing and governance', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Budgeting, capital calculations, revenue vs expenses and risk assessment', status: 'to-verify' },
        { subject: 'Social Studies', link: 'Agro-processing, rural employment and community development in Ghana', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners why fresh fruits like pineapples or tomatoes sometimes spoil during bumper harvests and what is needed to process food safely.',
      ],
      whileReading: [
        'Pause at Page 3 for the quick question on the defining feature of a cooperative.',
        'On Page 4 and Page 5, check learners’ understanding of the GH₵80,000 pilot budget and the difference between shares and bonds.',
      ],
      afterReading: [
        'Work through the six end-of-story questions: member capital raised (GH₵40,000), remaining funding gap (GH₵40,000), shares, bonds, business risk, and financial transparency.',
      ],
      discussion: [
        'Why did Naa emphasize from the start that adults—not children—would investigate and operate the factory using licensed facilities?',
        'Why did the chairperson refuse to hide costs in the financial report?',
      ],
      reflection: [
        'What agricultural product or local resource in your district could benefit from value addition, and what risks would adults need to study first?',
      ],
      mathsExtension: [
        {
          task: 'In the illustrative pilot budget, Equipment is GH₵40,000, Facility improvements are GH₵20,000, and Initial supplies and working capital are GH₵20,000 (Total GH₵80,000). If 50 members each contributed GH₵1,200, how much would they raise and what funding gap would remain?',
          answer: '50 × GH₵1,200 = GH₵60,000 raised; GH₵80,000 - GH₵60,000 = GH₵20,000 remaining gap.',
        },
      ],
      differentiation: {
        support: ['Create a comparison table on the board contrasting Cooperatives, Company Shares, and Bonds across Ownership, Returns, and Risk.'],
        stretch: ['Have small groups draft a 1-page mock feasibility checklist for a local agro-processing idea, listing equipment, food-safety licensing, packaging, transport and governance.'],
      },
      culturalNotes: [
        'Farmer cooperatives and agro-processing associations play an important role in Ghana’s pineapple, cocoa and shea sectors.',
      ],
      localiseThis: [
        'Adapt the crop example to your region (e.g., pineapples in Nsawam, mangoes in Somanya/Techiman, shea in Northern Ghana, or cassava in Central/Volta regions).',
      ],
      investigation: {
        title: 'Classroom Mock Cooperative Feasibility Exercise',
        materials: ['Exercise books', 'Pens and rulers'],
        steps: [
          'In small groups, choose one local farm product that often spoils after harvest.',
          'List four real cost categories needed to process it safely (equipment, licensed premises, packaging, transport).',
          'Write three governance rules the treasurer and chairperson must follow to keep accounts transparent.',
        ],
        safetyNote: 'This is a classroom educational simulation only; actual food processing and fundraising require adult management and regulatory licensing (e.g., FDA Ghana, Department of Cooperatives, SEC Ghana).',
        whatToNotice: 'Successful enterprises require realistic cost estimates, food-safety compliance and honest financial reporting.',
      },
    },
  },

  // =================================================================================================
  // 5. THE BOY WHO BUILT A VOICE (JHS 1–3 · 9 pages · Assistive technology, inclusion & innovation)
  // =================================================================================================
  {
    key: 'the-boy-who-built-a-voice',
    set: 'extension',
    title: 'The Boy Who Built a Voice',
    summary:
      'When fifteen-year-old Elorm joins the robotics club using a tablet and gestures to communicate, he and Kobby co-design an assistive text-to-speech app that handles Ghanaian names accurately, respects voice privacy and consent, includes offline backup boards, and proves that the best inventions begin by listening to users.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['technology', 'friendship', 'leadership'],
      objectives: ['problem-solving', 'respect', 'teamwork', 'critical-thinking', 'emotional-intelligence'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 400,
    }),
    palette: ['#4f46e5', '#06b6d4'],
    characters: [
      'Elorm: 15-year-old Ghanaian boy with a warm, confident smile, wearing a neat navy school polo shirt and glasses, using a digital tablet for communication.',
      'Kobby: 14-year-old Ghanaian boy in the robotics club wearing a cyan robotics club T-shirt, enthusiastic and collaborative.',
      'Robotics Teacher: Supportive Ghanaian STEM teacher in a smart-casual shirt and lanyard.',
      'Technology Entrepreneur: Visiting Ghanaian female tech founder in a tailored jacket.',
    ],
    narrationPlan: {
      voice: 'Warm, respectful, expressive Ghanaian-English storyteller voice (Kore)',
      pace: 'Steady proficient-reader pace (about 120 words per minute)',
      notes: ['Deliver Elorm’s typed tablet lines with wit, intelligence and warmth.', 'Highlight user co-design, consent/privacy and offline reliability.'],
    },
    music: 'Innovation Lab Gentle Synth & Piano (warm, modern piano melody ducked beneath narration)',
    culturalNotes: [
      'Elorm (Ewe) and Kobby (Akan diminutive for Kwabena/Kobina) are everyday Ghanaian names whose accurate pronunciation matters in speech technology.',
      'Designing for offline reliability reflects real engineering needs across Ghanaian schools and communities.',
    ],
    reviewQuestions: [
      'Does the story show Elorm as intelligent, witty and central to every design decision ("Only if you promise not to make all the decisions for me")?',
      'Are user consent, data privacy, offline fallback reliability and realistic business questions clearly addressed?',
    ],
    pages: [
      {
        motif: 'the-new-student',
        text: `When fifteen-year-old Elorm joined the school's robotics club, everyone wanted to meet him. He enjoyed drawing, mathematics and solving puzzles. But speaking was difficult for him. Sometimes he used gestures. Sometimes he typed words on a tablet. A boy named Kobby spoke loudly. "Can he understand us?" Elorm raised an eyebrow, typed a sentence and pressed the tablet's speaker. "Of course I can. I am standing right here." The room went silent. Then Elorm smiled. Kobby blushed. "Sorry."`,
        alt: 'Fifteen-year-old Elorm smiling in the robotics club after using his tablet speaker to reply to Kobby.',
        brief: '3D animated Ghanaian JHS robotics club room. 15-year-old Elorm in a navy polo shirt and glasses holds a tablet with a warm, witty smile while 14-year-old Kobby in a cyan shirt blushes apologetically beside classmates and robot parts.',
        narration: 'Deliver Elorm’s tablet response with dry, confident wit, followed by warm friendliness.',
      },
      {
        motif: 'a-problem-worth-solving',
        text: `During a club meeting, the teacher asked everyone to identify a problem technology might help solve. Kobby thought about Elorm's tablet. "Could we build a communication tool that works well with Ghanaian names and everyday expressions?" Elorm typed: "Perhaps. But ask people who use these tools what they actually need." Kobby nodded. "Would you help us design it?" Elorm grinned. "Only if you promise not to make all the decisions for me." "Deal!"`,
        alt: 'Kobby and Elorm shaking hands in the robotics club as they agree to co-design a Ghanaian communication tool together.',
        brief: '3D animated robotics club meeting. Kobby and Elorm sit together at a workbench with a laptop and tablet, grinning as they agree to partner on designing an assistive communication tool while their teacher watches approvingly.',
        narration: 'Warm, collaborative tone highlighting co-design and mutual respect.',
      },
      {
        motif: 'the-first-prototype',
        text: `The students created a simple application with large buttons. One button said, "Good morning." Another said, "Please give me a moment." A third said, "I would like to ask a question." The application converted selected text into speech. Kobby pressed the first button. The computer spoke in a strange, hurried voice. Everyone laughed. Then Elorm typed: "Funny voice. Useful idea. More work needed." Their teacher nodded. "That is what prototypes are for."`,
        alt: 'Elorm, Kobby and club members laughing together as they test the first text-to-speech prototype on a tablet.',
        brief: '3D animated robotics lab scene. A tablet screen shows colourful icon buttons while Kobby presses a button and Elorm, Kobby and their teacher laugh good-naturedly at the first prototype test.',
        narration: 'Lighthearted classroom laughter and encouraging feedback on iterative prototyping.',
      },
      {
        motif: 'the-name-problem',
        text: `The students tested the application with several Ghanaian names. Some pronunciations sounded wrong. Elorm shook his head. "People's names matter." Kobby agreed. They began collecting pronunciation examples from volunteers who had given permission. They learned that speech technology could make mistakes, especially when its training and testing did not adequately represent the people using it. "Then good technology needs good data," Kobby said. "And respectful testing," Elorm added.`,
        alt: 'Elorm and Kobby recording volunteer pronunciation examples with permission to improve how the app pronounces Ghanaian names.',
        brief: '3D animated school studio corner. Elorm and Kobby work with a smiling student volunteer holding a microphone and a consent form, testing Ghanaian name pronunciations carefully on their laptop.',
        narration: 'Thoughtful, earnest tone emphasizing why people’s names and representative data matter.',
      },
      {
        motif: 'the-privacy-question',
        text: `One afternoon, a club member suggested recording every conversation automatically. "That will give us more data!" Elorm's expression changed. He typed: "Would you want someone recording you without asking?" The room became quiet. Their teacher explained that collecting voices and personal information required care, permission, security and appropriate safeguards. The students changed their design. The application would not secretly record conversations. They also planned ways to minimize unnecessary data collection.`,
        alt: 'Elorm raising an important privacy question on his tablet while the teacher explains voice consent and data protection to the robotics club.',
        brief: '3D animated robotics club discussion. Elorm looks serious as he shows his tablet to the group, while the teacher explains data privacy and security safeguards to the attentive students.',
        narration: 'Serious, reflective tone on Elorm’s question about privacy and consent.',
      },
      {
        motif: 'a-difficult-demonstration',
        text: `At the school technology exhibition, Kobby proudly introduced the application. Then the internet connection failed. The demonstration stopped. Kobby stared at the screen. "Oh no." Elorm calmly opened an offline communication board they had prepared. He selected a message. "Technology should work for people, even when things go wrong." The visitors applauded. Kobby realized that reliability and accessibility were just as important as impressive features.`,
        alt: 'Elorm calmly using an offline communication board on his tablet during a school technology exhibition after the internet connection fails.',
        brief: '3D animated school technology exhibition. Kobby looks worried beside a laptop with a disconnected signal icon, while Elorm calmly holds up his tablet displaying an offline visual communication board to applauding visitors.',
        narration: 'Build tension when the internet fails, then calm poise from Elorm and warm applause.',
      },
      {
        motif: 'the-investors-questions',
        text: `A local technology entrepreneur visited the club. "Could this become a business?" she asked. "Yes!" Kobby replied. "Who are your users? How will you maintain the software? What will it cost? How will you protect their data? Can people afford it?" Kobby hesitated. Elorm typed: "We need to research those questions before promising anything." The entrepreneur smiled. "That is a good beginning." She encouraged the students to seek guidance from people with disabilities, educators, developers and accessibility specialists.`,
        alt: 'A visiting Ghanaian female technology entrepreneur asking Kobby and Elorm practical questions about users, maintenance, affordability and data protection.',
        brief: '3D animated school innovation hub. A Ghanaian female technology entrepreneur in a smart blazer speaks with Kobby and Elorm beside their prototype table, smiling approvingly at Elorm’s thoughtful response.',
        narration: 'Inquisitive, realistic business tone from the entrepreneur and wise restraint from Elorm.',
      },
      {
        motif: 'a-voice-of-his-own',
        text: `Months later, the students demonstrated an improved prototype. It offered customizable phrases, offline features and more careful pronunciation options. Elorm tested it. The tablet spoke: "I have something important to say." He paused. Then he typed another sentence. "Actually, I have many important things to say." Everyone laughed. Kobby smiled. "The technology did not give you ideas." "No," Elorm typed. "It helps me express them."`,
        alt: 'Elorm smiling brightly as he demonstrates the improved offline-capable communication prototype to cheering classmates and Kobby.',
        brief: '3D animated classroom demonstration. Elorm sits proudly with his tablet speaking through a clear speaker while Kobby and classmates laugh and cheer warmly around him.',
        narration: 'Warm humour on Elorm’s second sentence and a powerful closing distinction between having ideas and expressing them.',
      },
      {
        motif: 'the-next-invention',
        text: `At the end of the school year, the robotics club received an invitation to present its project at a student innovation exhibition. Kobby looked at Elorm. "Do you think we could build something used across Ghana?" Elorm typed: "Maybe. But first, we should make it genuinely useful for the people who need it." Kobby nodded. They had started with the dream of building a clever machine. They had discovered something more important. The best inventions begin by listening to people.`,
        alt: 'Elorm and Kobby looking at an invitation to a student innovation exhibition together in the robotics lab.',
        brief: '3D animated golden-hour scene in the school robotics room. Kobby and Elorm stand side by side holding an official invitation letter, smiling with quiet determination beside their tablet prototype.',
        narration: 'Warm, inspiring conclusion emphasizing that the best inventions begin by listening to people.',
      },
    ],
    activities: [
      {
        id: 'voice-q1-name-problem',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the application mispronounce some Ghanaian names?',
        options: [
          'Better testing and suitable pronunciation data were needed.',
          'The tablet battery was completely empty.',
          'Ghanaian names cannot be spoken aloud.',
        ],
        correctIndex: 0,
        explanation: 'Its pronunciation system did not handle those names accurately; better testing and suitable pronunciation information were needed.',
      },
      {
        id: 'voice-end-1-tts',
        type: 'comprehension',
        question: 'What does text-to-speech software do?',
        options: [
          'Converts written text into spoken audio',
          'Secretly records every conversation in a room',
          'Repairs broken internet cables automatically',
        ],
        correctIndex: 0,
        explanation: 'Text-to-speech software converts written text into spoken audio.',
      },
      {
        id: 'voice-end-2-user-design',
        type: 'comprehension',
        question: 'Why should users help design assistive technology?',
        options: [
          'They understand their own needs and preferences.',
          'Users should never be consulted during design.',
          'Developers already know what everyone wants without asking.',
        ],
        correctIndex: 0,
        explanation: 'People who use assistive tools understand their own lived needs and preferences best.',
      },
      {
        id: 'voice-end-3-ethics-privacy',
        type: 'comprehension',
        question: 'Should the application record people without permission?',
        options: [
          'No; collecting voices requires permission and safeguards.',
          'Yes; secret recording is the best way to gather data.',
          'Yes; privacy rules do not apply to student clubs.',
        ],
        correctIndex: 0,
        explanation: 'No. Collecting voices and personal information requires care, permission, security and safeguards.',
      },
      {
        id: 'voice-end-4-offline-reliability',
        type: 'comprehension',
        question: 'Why are offline features useful in an assistive communication app?',
        options: [
          'They keep essential functions available without internet.',
          'They make the tablet heavier to carry.',
          'They prevent users from customizing phrases.',
        ],
        correctIndex: 0,
        explanation: 'Offline features help keep essential communication functions available even when internet connections fail.',
      },
      {
        id: 'voice-end-5-entrepreneurship',
        type: 'comprehension',
        question: 'Which questions should a founder answer before launching a product?',
        options: [
          'User needs, costs, affordability, maintenance and privacy',
          'Only what colour shirt to wear at the exhibition',
          'How to promise features before researching them',
        ],
        correctIndex: 0,
        explanation: 'Founders must research user needs, maintenance, costs, affordability, privacy and accessibility before making promises.',
      },
      {
        id: 'voice-end-6-creativity',
        type: 'prediction',
        prompt: 'If you sketch an accessible feature for a school app, what makes your design effective?',
        options: [
          'A practical design that addresses a real user need',
          'A complicated screen that requires fast internet at all times',
          'A feature built without asking any users for feedback',
        ],
      },
    ],
    glossary: [
      { word: 'gestures', definition: 'Movements of the hands, head or body used to express meaning or communicate.', pages: [1] },
      { word: 'prototype', definition: 'An early working model of a product built to test an idea and learn what needs improvement.', pages: [8] },
      { word: 'pronunciations', definition: 'The ways in which words or names are spoken aloud.', pages: [4] },
      { word: 'safeguards', definition: 'Protective rules and technical measures that keep people and their personal data safe.', pages: [5] },
      { word: 'reliability', definition: 'The quality of working dependably and consistently, even in difficult conditions.', pages: [6] },
      { word: 'accessibility', definition: 'Designing products and environments so that people with diverse abilities can use them effectively.', pages: [6, 7] },
      { word: 'customizable', definition: 'Able to be adjusted or modified to suit a particular user’s needs and preferences.', pages: [8] },
    ],
    teacherGuide: {
      overview:
        "Emphasize that disability does not determine intelligence, personality or ambition. Do not assume that every person with speech difficulties wants the same technology. Learners should explore accessibility through respectful consultation, not by pretending to know another person's lived experience.",
      lessonMinutes: 45,
      learningGoals: [
        'Explain how text-to-speech assistive technology works and why co-designing with users is essential.',
        'Identify why representative pronunciation data, informed consent, data privacy and offline reliability matter in responsible software engineering.',
        'Evaluate the practical questions an entrepreneur must research (user needs, maintenance, cost, privacy, affordability) before launching a product.',
      ],
      subjectLinks: [
        { subject: 'Computing / ICT', link: 'Text-to-speech systems, training data representation, data privacy and offline resilience', status: 'to-verify' },
        { subject: 'Social Studies / Citizenship', link: 'Inclusion, disability rights, empathy and respectful communication', status: 'to-verify' },
        { subject: 'Career Technology / Entrepreneurship', link: 'Prototyping, user research and responsible innovation', status: 'to-verify' },
      ],
      beforeReading: [
        'Discuss the different ways people communicate every day (speech, writing, sign language, gestures, communication boards and text-to-speech tablets).',
      ],
      whileReading: [
        'Pause at Page 1 and discuss Elorm’s response ("Of course I can. I am standing right here.") and why we should always speak directly and respectfully to people.',
        'Pause at Page 4 for the quick question on why the app mispronounced some Ghanaian names.',
      ],
      afterReading: [
        'Complete the six end-of-story activities covering text-to-speech, user co-design, voice privacy/consent, offline reliability, founder research questions, and sketching an accessible school app feature.',
      ],
      discussion: [
        'What did Kobby and Elorm mean when they said, "The technology did not give you ideas... It helps me express them"?',
        'Why was preparing an offline communication board just as important as the software demonstration?',
      ],
      reflection: [
        'How can your school or classroom make everyday activities more welcoming and accessible for learners with different needs?',
      ],
      mathsExtension: [
        {
          task: 'Suppose the robotics club tests 80 Ghanaian names in Prototype 1 and 52 are pronounced accurately. In Prototype 2, after adding volunteer recordings with permission, 74 out of 80 are pronounced accurately. By how many percentage points did accuracy improve?',
          answer: 'Prototype 1: 52/80 = 65%. Prototype 2: 74/80 = 92.5%. Improvement: 27.5 percentage points.',
        },
      ],
      differentiation: {
        support: ['Have learners design a 6-button paper communication board with everyday classroom phrases that works without electricity or internet.'],
        stretch: ['Have learners write a short privacy and consent checklist that a student technology club must follow before recording voice samples.'],
      },
      culturalNotes: [
        'Respecting the accurate pronunciation of Ghanaian names across Akan, Ewe, Ga, Dagbani and other languages is an important part of inclusive technology.',
      ],
      localiseThis: [
        'Encourage learners to test how standard devices pronounce names from their own community and discuss why diverse linguistic data matters.',
      ],
      investigation: {
        title: 'Accessible Offline Communication Board & App Feature Sketch',
        materials: ['Paper or card', 'Pencils and coloured markers'],
        steps: [
          'Identify one everyday school situation where clear, accessible communication helps everyone.',
          'Sketch an app screen or offline communication board with large, clear buttons and respectful phrases.',
          'Write two sentences explaining how your design protects user privacy and works when the internet is offline.',
        ],
        safetyNote: 'Emphasize respectful consultation; never record anyone’s voice or personal data without explicit permission.',
        whatToNotice: 'Good assistive design combines clear usability, offline reliability and respect for the user’s autonomy.',
      },
    },
  },

  // =================================================================================================
  // 6. THE NIGHT THE STARS ASKED QUESTIONS (Primary 5–JHS 1 · 8 pages · Astronomy & open questions)
  // =================================================================================================
  {
    key: 'the-night-the-stars-asked-questions',
    set: 'extension',
    title: 'The Night the Stars Asked Questions',
    summary:
      'When an evening power cut plunges twelve-year-old Araba’s courtyard into darkness, Grandma Esi and her science teacher guide her through the wonders of distant starlight, exoplanets, dark matter, binary-star planets, evaluating sensational alien headlines, and the excitement of unanswered scientific questions.',
    classification: base({
      classIds: ['primary-5', 'primary-6', 'jhs-1'],
      ageMin: 10,
      ageMax: 13,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['night-sky', 'family', 'school'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 350,
    }),
    palette: ['#1e1b4b', '#f59e0b'],
    characters: [
      'Araba: 12-year-old Ghanaian girl with braided hair, wearing a bright yellow top and patterned skirt, curious and observant.',
      'Grandma Esi: Warm, thoughtful Ghanaian grandmother in an indigo-and-gold wrapper and headtie.',
      'Science Teacher: Enthusiastic Ghanaian science and astronomy club teacher in a neat collared shirt and spectacles.',
    ],
    narrationPlan: {
      voice: 'Warm, wonder-filled Ghanaian-English storyteller voice (Kore)',
      pace: 'Steady fluent-reader pace (about 115 words per minute)',
      notes: ['Separate confirmed astronomical evidence from open scientific questions.', 'Deliver Grandma Esi’s lines with gentle warmth.'],
    },
    music: 'Starlit Courtyard Nocturne Piano (gentle, contemplative night-sky piano melody ducked beneath narration)',
    culturalNotes: [
      'An unexpected evening power cut ("Oh, ECG!") turning into courtyard stargazing with a grandmother is a familiar and relatable Ghanaian moment.',
      'Araba (Tuesday-born) and Esi (Sunday-born) are Fante/Akan day names.',
    ],
    reviewQuestions: [
      'Does the story clearly distinguish established astronomical observations (finite speed of light, exoplanets, cosmic expansion) from open questions (the exact nature of dark matter and dark energy, whether life exists beyond Earth)?',
      'Does the teacher’s guide include the explicit safety warning never to point telescopes or binoculars at the Sun?',
    ],
    pages: [
      {
        motif: 'a-thousand-questions',
        text: `The lights went out just after supper. "Oh, ECG!" exclaimed twelve-year-old Araba. Grandma Esi carried two chairs into the courtyard. "Come outside. The sky has something to show you." Araba looked up. Thousands of stars glittered above the village. "Grandma, how many stars are there?" "Far more than we can count by looking up tonight." "Does every star have planets?" "Not every star is known to have planets, but scientists have discovered thousands of planets around other stars." Araba leaned back. "Then there may be worlds we have never seen." Grandma smiled. "And questions we have not yet answered."`,
        alt: 'Twelve-year-old Araba and Grandma Esi sitting on chairs in their dark courtyard looking up at thousands of glittering stars.',
        brief: '3D animated tranquil Ghanaian courtyard at night during a blackout. 12-year-old Araba in a yellow top and Grandma Esi in an indigo-and-gold cloth sit in chairs looking up in wonder at a breathtaking Milky Way sky filled with glittering stars.',
        narration: 'Begin with a relatable chuckle on "Oh, ECG!", then open into quiet awe beneath the night sky.',
      },
      {
        motif: 'the-light-that-travelled',
        text: `The following day, Araba told her science teacher about the stars. "Some stars are so far away that their light takes years to reach Earth," he explained. "Does that mean we see them as they were in the past?" "Yes. Looking into distant space is also looking back in time." Araba stared at the classroom window. "So a telescope can help us study history?" "The history of the universe," her teacher replied.`,
        alt: 'Araba in her science classroom talking with her teacher about how starlight takes years to travel across space.',
        brief: '3D animated bright Ghanaian classroom. Araba sits at her desk looking amazed while her science teacher stands beside a diagram of starlight travelling across space to Earth.',
        narration: 'Thoughtful, wonder-filled tone explaining why looking into distant space is looking back in time.',
      },
      {
        motif: 'the-mystery-of-invisible-matter',
        text: `During astronomy club, the teacher showed a diagram of a galaxy. "Scientists observe that visible matter alone does not explain all the gravitational effects they measure in galaxies and other cosmic structures." "What is missing?" Araba asked. "Scientists use the name dark matter for a proposed form of matter that helps explain those observations." "Have they caught some in a bottle?" The class laughed. "No confirmed direct detection of a dark-matter particle has yet established its nature. Researchers continue testing ideas." Araba wrote: Evidence can reveal a mystery without solving every part of it.`,
        alt: 'The science teacher showing a spiral galaxy diagram to Araba and the astronomy club while explaining dark matter observations.',
        brief: '3D animated astronomy club meeting in a Ghanaian school. The teacher points to a glowing spiral galaxy illustration while Araba writes in her notebook and classmates smile at her question.',
        narration: 'Keep the scientific nuance exact: dark matter is inferred from gravitational observations while its particle nature remains unconfirmed.',
      },
      {
        motif: 'the-planet-with-two-suns',
        text: `Araba imagined a planet with two suns. "Wouldn't that be wonderful?" Her teacher explained that planets can orbit systems containing more than one star. "Some planets orbit two stars," he said. "But their conditions vary." "Could people live there?" "We do not know of such a planet where humans could live. We must distinguish an exciting possibility from evidence." Araba nodded. "Science is not simply guessing what would be nice." "Exactly. It is asking questions and testing explanations."`,
        alt: 'Araba and her science teacher discussing planets that orbit two stars and the difference between exciting possibilities and scientific evidence.',
        brief: '3D animated classroom scene. Araba looks up thoughtfully as her teacher illustrates a planet orbiting a binary pair of stars on the board, emphasizing careful scientific evidence.',
        narration: 'Warm, clear contrast between imaginative possibilities and verified evidence.',
      },
      {
        motif: 'the-message-from-space',
        text: `One afternoon, Araba read a headline: ALIENS HAVE SENT A MESSAGE TO EARTH! She rushed to school. "Sir! Is this true?" Her teacher asked her to examine the source. The article provided no credible scientific evidence. "Some unusual signals have been investigated," he explained, "but that does not mean they were messages from extraterrestrial beings." Araba sighed. "I wanted it to be true." "Curiosity is wonderful," he replied. "But curiosity also requires patience and honesty."`,
        alt: 'Araba showing a sensational headline to her science teacher, who helps her check whether it has credible scientific evidence.',
        brief: '3D animated school veranda scene. Araba holds up a paper excitedly while her science teacher calmly examines it with her, teaching her how to check sources and evidence.',
        narration: 'Excited rush from Araba, followed by calm, media-literate guidance from her teacher.',
      },
      {
        motif: 'a-question-without-an-answer',
        text: `At home, Araba asked Grandma Esi, "Do you think life exists somewhere else in the universe?" Grandma considered the question. "I do not know. What does your teacher say?" "He says scientists are searching for evidence, but life beyond Earth has not been confirmed." Grandma nodded. "Then it is a question worth exploring." Araba smiled. "Sometimes the most interesting answer is, 'We do not know yet.'"`,
        alt: 'Araba and Grandma Esi talking on their home veranda at dusk about whether life exists beyond Earth.',
        brief: '3D animated warm dusk scene on a Ghanaian home veranda. Araba and Grandma Esi sit together in conversation as the first evening stars appear in the twilight sky.',
        narration: 'Gentle, reflective warmth celebrating the honesty of saying "We do not know yet."',
      },
      {
        motif: 'the-young-astronomers',
        text: `Araba organized a small astronomy evening at school. The children used a star chart and, with adult supervision, a telescope to observe the night sky. They learned to identify some visible celestial objects and record their observations. One student asked whether the universe would keep expanding forever. Their teacher explained that cosmologists study the universe's expansion and its possible long-term future. "Scientists have strong evidence for cosmic expansion," he said, "but important questions remain about dark energy and the universe's ultimate fate."`,
        alt: 'Araba, classmates and their teacher using a telescope and star chart on the school field at night under adult supervision.',
        brief: '3D animated school field at night. Under the science teacher’s supervision, Araba and her classmates gather around a tripod telescope and hold a star chart beneath a clear starry sky.',
        narration: 'Engaging evening observation atmosphere, clearly separating evidence for cosmic expansion from open questions about dark energy.',
      },
      {
        motif: 'the-biggest-discovery',
        text: `That night, Araba returned to the courtyard. Grandma Esi sat beside her. "Did you find the answer to every question?" Grandma asked. "No. I found more questions." "Are you disappointed?" Araba shook her head. "Not anymore. I want to become a scientist." "What will you discover?" Araba looked toward the stars. "I don't know yet." Then she grinned. "That is the exciting part."`,
        alt: 'Araba and Grandma Esi smiling together under the starry night sky in their courtyard.',
        brief: '3D animated peaceful night courtyard scene. Araba sits beside Grandma Esi looking up at the bright stars with a wide, joyful grin.',
        narration: 'Warm, inspiring finale celebrating scientific curiosity and the joy of discovery.',
      },
    ],
    activities: [
      {
        id: 'stars-q1-dark-matter',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why do scientists investigate dark matter?',
        options: [
          'Visible matter alone does not explain all observed gravity effects.',
          'They have already caught bottles of dark matter in school labs.',
          'Galaxies have no gravity at all.',
        ],
        correctIndex: 0,
        explanation: 'Observations of gravity and cosmic structures cannot be fully explained by visible matter alone within the standard cosmological framework.',
      },
      {
        id: 'stars-end-1-starlight',
        type: 'comprehension',
        question: 'Why does distant starlight show us the past?',
        options: [
          'Light takes time to travel across space.',
          'Stars only shine backwards in time.',
          'Telescopes invent pictures of the past.',
        ],
        correctIndex: 0,
        explanation: 'Because light takes time to travel across vast distances, we see distant stars as they were when the light left them.',
      },
      {
        id: 'stars-end-2-life-beyond-earth',
        type: 'comprehension',
        question: 'Is life beyond Earth confirmed by science?',
        options: [
          'No; scientists are searching, but it has not been confirmed.',
          'Yes; aliens have sent confirmed messages to every newspaper.',
          'Yes; humans already live on a planet with two suns.',
        ],
        correctIndex: 0,
        explanation: 'No. Scientists are searching for evidence, but life beyond Earth has not been confirmed.',
      },
      {
        id: 'stars-end-3-cosmology',
        type: 'comprehension',
        question: 'What is dark matter?',
        options: [
          'A proposed form of matter inferred from gravitational observations',
          'Ordinary black clouds of smoke from power stations',
          'A fully understood particle kept in classroom bottles',
        ],
        correctIndex: 0,
        explanation: 'Dark matter is a proposed form of matter inferred from gravitational observations; its exact nature remains unknown.',
      },
      {
        id: 'stars-end-4-media-literacy',
        type: 'comprehension',
        question: 'Should we believe an extraordinary headline without evidence?',
        options: [
          'No; check credible sources and supporting scientific evidence.',
          'Yes; every exciting headline on the internet is true.',
          'Yes; checking sources is a waste of time.',
        ],
        correctIndex: 0,
        explanation: 'No. We should examine the source and check for credible scientific evidence before believing extraordinary claims.',
      },
      {
        id: 'stars-end-5-open-question',
        type: 'prediction',
        prompt: 'Which of these is a genuine scientific question about the universe that researchers are still investigating?',
        options: [
          'What is the exact nature of dark matter and dark energy?',
          'Does light travel instantaneously in zero seconds?',
          'Are there only ten stars in the entire universe?',
        ],
      },
    ],
    glossary: [
      { word: 'telescope', definition: 'An optical instrument that gathers light to make distant objects in space appear closer and clearer.', pages: [2, 7] },
      { word: 'galaxy', definition: 'A vast system of stars, gas and dust held together by gravity.', pages: [3] },
      { word: 'gravitational', definition: 'Relating to gravity, the force of attraction between masses in the universe.', pages: [3] },
      { word: 'orbit', definition: 'The curved path of a planet, moon or spacecraft around a star or another celestial body.', pages: [4] },
      { word: 'extraterrestrial', definition: 'Originating or existing outside Earth and its atmosphere.', pages: [5] },
      { word: 'celestial', definition: 'Positioned in or relating to the sky or outer space, such as stars and planets.', pages: [7] },
      { word: 'cosmologists', definition: 'Scientists who study the origin, structure, expansion and evolution of the universe.', pages: [7] },
    ],
    teacherGuide: {
      overview:
        'Teach the difference between observation, hypothesis, evidence and unanswered questions. Use supervised night-sky observation where practical. Never point telescopes or binoculars at the Sun without appropriate certified solar equipment and expert supervision.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain why looking at distant stars is looking back in time because light takes time to travel.',
        'Distinguish between established astronomical evidence (thousands of known exoplanets, gravitational observations in galaxies, cosmic expansion) and open questions (the particle nature of dark matter, dark energy, and whether life exists beyond Earth).',
        'Apply media literacy by checking sources and requiring credible evidence before accepting sensational claims.',
      ],
      subjectLinks: [
        { subject: 'Science', link: 'Light travel time, stars, planets, gravity and scientific evidence', status: 'to-verify' },
        { subject: 'English Language / Media Literacy', link: 'Evaluating sources, distinguishing fact from speculation and asking inquiry questions', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners what they have noticed when looking up at the night sky on a clear evening and what questions they have wondered about.',
      ],
      whileReading: [
        'Pause at Page 3 for the quick question on why scientists investigate dark matter.',
        'On Page 5 and Page 6, discuss why checking sources matters and why "We do not know yet" is an honest and exciting scientific answer.',
      ],
      afterReading: [
        'Complete the five end-of-story activities covering light travel time, whether life beyond Earth is confirmed, dark matter, media literacy, and open scientific questions.',
      ],
      discussion: [
        'What did Araba mean when she wrote, "Evidence can reveal a mystery without solving every part of it"?',
        'Why is it important to separate an exciting possibility (like life on another planet) from confirmed evidence?',
      ],
      reflection: [
        'What is one scientific question about the universe or nature that you would love to help investigate one day?',
      ],
      mathsExtension: [
        {
          task: 'If light from a bright star takes 25 years to reach Earth, how old was the light we see tonight when it left that star?',
          answer: '25 years old — we see the star as it was 25 years ago.',
        },
      ],
      differentiation: {
        support: ['Create a two-column chart on the board titled "What Scientists Have Confirmed" and "Questions Scientists Are Still Investigating".'],
        stretch: ['Have learners take a sensational science headline and write three questions they would ask to verify whether the source and evidence are credible.'],
      },
      culturalNotes: [
        'Ghana hosts the Ghana Radio Astronomy Observatory at Kuntunse, inspiring young Ghanaian astronomers and engineers.',
      ],
      localiseThis: [
        'Encourage learners to observe the night sky from a safe courtyard or veranda with a parent or guardian and sketch the brightest stars or the Moon’s phase.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Light travels at a finite speed, so light from distant stars takes years to reach Earth.',
          'Astronomers have confirmed thousands of exoplanets orbiting other stars (including some in binary star systems) and strong evidence for cosmic expansion.',
        ],
        whatWeAreStillDiscovering: [
          'No confirmed direct detection has yet established the particle nature of dark matter, the nature of dark energy remains an open question, and life beyond Earth has not been confirmed.',
        ],
      },
      investigation: {
        title: 'Supervised Night-Sky Observation & Evidence vs. Mystery Chart',
        materials: ['Notebook and pencil', 'Printed star chart (optional)'],
        steps: [
          'With a parent or guardian at home in the evening, step into a safe courtyard and observe the night sky for 10 minutes with the naked eye.',
          'Record three things you can directly observe (e.g., Moon phase, differences in star brightness or colour).',
          'Write down two questions that cannot be answered by naked-eye observation alone and explain what tools or evidence scientists would need.',
        ],
        safetyNote: 'CRITICAL SAFETY RULE: Never look at the Sun directly and NEVER point telescopes, binoculars or cameras at the Sun without certified solar filters and expert supervision—doing so causes immediate, permanent blindness.',
        whatToNotice: 'Direct observation is the starting point of astronomy, while careful measurement and evidence separate confirmed facts from open mysteries.',
      },
      factCheck: [
        {
          claim: 'Thousands of exoplanets have been discovered; dark matter is inferred from gravitational observations without confirmed direct particle detection; life beyond Earth is unconfirmed.',
          explanation: 'NASA’s Exoplanet Archive lists over 5,500 confirmed exoplanets (including circumbinary planets such as Kepler-16b); dark matter and dark energy remain active areas of cosmological research.',
          reference: 'NASA Exoplanet Archive; International Astronomical Union (IAU); European Space Agency (ESA) Cosmology briefings',
        },
      ],
    },
  },
];
