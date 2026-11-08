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

export const BATCH_3_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. Ama's Journey Above the Rainforest (Primary 3-4, 10 pages, Ecotourism, Biodiversity & Conservation)
  // ====================================================================================================================
  {
    key: 'amas-journey-above-the-rainforest',
    set: 'extension',
    title: 'Ama’s Journey Above the Rainforest',
    summary:
      'Nine-year-old Ama welcomes her cousin Jayden from London to Kakum National Park in the Central Region, where their walk across the high canopy bridges reveals how responsible ecotourism protects Ghana’s rainforests, wildlife and fresh water.',
    classification: base({
      classIds: ['primary-3', 'primary-4'],
      ageMin: 8,
      ageMax: 10,
      readingLevel: 'developing',
      difficulty: 3,
      genres: ['adventure', 'nature', 'educational'],
      themes: ['animals-and-habitats', 'family', 'citizenship'],
      objectives: ['environmental-awareness', 'cultural-heritage', 'scientific-curiosity', 'reading-comprehension', 'vocabulary', 'respect'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 340,
    }),
    palette: ['#14532d', '#fbbf24'],
    characters: [
      'Ama: a nine-year-old Ghanaian girl in Primary 4, braided hair with bright yellow beads, wearing a coral-orange polo shirt, denim shorts and green canvas shoes.',
      'Jayden: Ama’s ten-year-old cousin visiting Ghana from London, curly short hair, wearing a light blue t-shirt, beige cargo shorts and carrying a small digital camera.',
      'Ranger Kweku: a friendly Kakum National Park guide in his thirties, wearing a forest-green ranger uniform and cap.',
    ],
    pages: [
      {
        text: 'Early morning mist curled around the giant trees of Kakum National Park in Ghana’s Central Region. Nine-year-old Ama smiled proudly at her cousin Jayden, who was visiting from London for the very first time. ‘Welcome to our rainforest, Jayden!’ said Ama. ‘Wait until you see where we are walking today!’',
        alt: 'Ama and her cousin Jayden stand at the lush green entrance of Kakum National Park with Ranger Kweku in the morning mist.',
        motif: '🌳🧒',
        brief: 'Lush tropical rainforest entrance at Kakum National Park in morning sunlight. Ama (9, braided hair with yellow beads, coral-orange polo shirt, denim shorts) welcoming Jayden (10, light blue t-shirt, beige shorts, small camera) beside Ranger Kweku (forest-green uniform).',
        narration: 'Bright, welcoming and proud. Emphasise "Welcome to our rainforest, Jayden!".',
      },
      {
        text: 'At the visitor centre, Ranger Kweku pointed to a wooden map of the park. ‘Before we climb,’ he said, ‘every visitor learns the ecotourism rules. Keep every wrapper in your bag, stay on the marked trail, speak softly so we do not frighten wildlife, and never pick plants or feed the animals. A good visitor leaves only footprints!’',
        alt: 'Ranger Kweku points to a carved wooden trail map while Ama and Jayden tuck their water bottles into their backpacks.',
        motif: '🗺️🎒',
        brief: 'Wooden visitor pavilion at Kakum: Ranger Kweku gesturing toward a carved wooden trail map (no text or letters) while Ama and Jayden check their backpacks.',
        narration: 'Clear, friendly authority for Ranger Kweku.',
      },
      {
        text: 'They hiked up the shaded forest steps until they reached the first wooden platform high in the trees. Stretching ahead of them hung the famous Kakum Canopy Walkway, seven suspension bridges made of strong ropes, cables and wooden planks, three hundred and fifty metres long in total!',
        alt: 'Ama and Jayden look out at the rope-and-plank suspension bridge of the Kakum Canopy Walkway high among the green treetops.',
        motif: '🌉🌲',
        brief: 'High wooden tree platform at Kakum: a narrow suspension bridge of wooden planks and high safety rope nets stretches between giant rainforest trees, with Ama and Jayden looking excited.',
        narration: 'Build wonder and excitement on "Kakum Canopy Walkway".',
      },
      {
        text: 'Jayden held the side ropes tightly as his canvas shoes stepped onto the first bridge. Forty metres below, the forest floor looked like a deep green carpet! ‘It sways a little!’ Jayden gasped. Ama held his hand and smiled. ‘Look at the thick steel cables and safety nets, Jayden. Step steadily in the middle of the planks, and look out at the treetops!’',
        alt: 'Ama encourages Jayden as they walk across the high rope-and-plank canopy bridge forty metres above the forest floor.',
        motif: '👣🌿',
        brief: 'Mid-bridge view on the Kakum Canopy Walkway: Jayden holding the side ropes while Ama smiles reassuringly beside him, surrounded by high green safety netting and sunlit rainforest canopy.',
        narration: 'Gentle reassurance from Ama as Jayden finds his courage.',
      },
      {
        text: 'On the third tree platform, Jayden forgot his fear and lifted his camera. Across the sunlit upper canopy, a yellow-casqued hornbill glided on wide dark wings, and two mona monkeys leaped from branch to branch. ‘Most rainforest animals live high up here in the canopy where flowers and fruits grow in the sunshine,’ whispered Ranger Kweku.',
        alt: 'From the wooden platform high in an emergent tree, Jayden and Ama watch a hornbill and two monkeys in the sunlit branches.',
        motif: '🦜🐒',
        brief: 'High wooden platform wrapped around a massive tree trunk: Jayden looking through his camera and Ama pointing as a hornbill and two mona monkeys move through fruiting canopy branches.',
        narration: 'Hushed, excited whisper on the platform.',
      },
      {
        text: '‘Why did people build a walkway up in the trees instead of cutting a wide road through the forest?’ asked Jayden. ‘Because a road would cut down ancient trees and break the animals’ home apart,’ said Ranger Kweku. ‘The canopy walkway lets visitors experience the forest from above while leaving the ground and roots undisturbed below.’',
        alt: 'Ranger Kweku points down to the unbroken green forest floor far beneath the suspension bridge.',
        motif: '🌳🛡️',
        brief: 'Ranger Kweku pointing downward from the tree platform toward the dense, undisturbed green rainforest floor and winding stream far below.',
        narration: 'Thoughtful question from Jayden, clear explanation from Ranger Kweku.',
      },
      {
        text: '‘Even more importantly,’ Ranger Kweku continued, ‘Kakum protects the headwaters of the Kakum River and other streams that supply clean drinking water to Cape Coast and surrounding towns. The forest trees also absorb carbon dioxide and release fresh oxygen. Protecting these trees protects thousands of families!’',
        alt: 'A clear forest stream sparkles among mossy rocks and giant buttress roots on the floor of Kakum National Park.',
        motif: '💧🏞️',
        brief: 'Sunbeams filtering down to a crystal-clear forest stream flowing gently past giant buttress roots and ferns on the floor of Kakum rainforest.',
        narration: 'Warm and emphatic on how the forest provides clean water for Cape Coast and nearby towns.',
      },
      {
        text: '‘How does our ticket help the forest?’ asked Ama. ‘That is the heart of ecotourism,’ said Ranger Kweku. ‘When visitors pay entrance fees, hire trained local guides, and buy crafts or food from nearby villages, the community earns income from keeping the forest standing rather than cutting trees for timber or hunting wild animals.’',
        alt: 'Near the park craft stalls, visitors buy woven baskets and cocoa snacks from smiling local community vendors.',
        motif: '🧺🤝',
        brief: 'Shaded craft pavilion near the park entrance: smiling Ghanaian women and artisans displaying colourful woven baskets and carvings (no text signs) as visitors admire them.',
        narration: 'Clear explanation of how ecotourism supports local livelihoods and conservation.',
      },
      {
        text: 'Back on the ground trail, Jayden spotted a plastic bottle someone had dropped near a fern. Before Ranger Kweku could bend down, Jayden picked it up and placed it in the recycling bin at the trailhead. ‘Wait, Ranger Kweku,’ Jayden asked, ‘is Kakum a UNESCO World Heritage Site like Cape Coast Castle?’ ‘Cape Coast Castle is an inscribed World Heritage Site,’ explained Ranger Kweku, ‘and Kakum is on Ghana’s UNESCO Tentative List as a national treasure we must keep protecting!’',
        alt: 'Jayden places a stray plastic bottle into a bin at the trailhead while Ama and Ranger Kweku smile approvingly.',
        motif: '♻️🌟',
        brief: 'At the wooden trailhead bin, Jayden placing a clear plastic bottle into a neat wooden waste bin while Ama gives him a thumbs-up and Ranger Kweku smiles.',
        narration: 'Proud, accurate distinction between inscribed World Heritage Sites and the Tentative List.',
      },
      {
        text: 'As they rode back toward Cape Coast in the afternoon sunshine, Jayden looked through his photos of giant trees and hornbills. ‘In London, I will show my class that Ghana’s rainforest is a living treasure,’ he said. Ama beamed. ‘And we will keep guarding it from the roots to the treetops!’ The end.',
        alt: 'Ama and Jayden sit together looking at rainforest photos on Jayden’s camera with the green hills of Kakum behind them.',
        motif: '📸💚',
        brief: 'Warm afternoon light: Ama and Jayden smiling together as they look at a hornbill photo on the back of Jayden’s camera, with green rainforest hills in the background.',
        narration: 'Warm, joyful ending. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'kakum-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Which of these is one of the responsible ecotourism rules Ranger Kweku taught at Kakum?',
        options: [
          'Keep all litter in your bag, stay on the trail and speak softly',
          'Pick wildflowers and feed snacks to the monkeys',
          'Shout loudly so birds fly out of the trees',
          'Carve your name into the bark of ancient trees',
        ],
        correctIndex: 0,
        explanation: 'Responsible visitors leave no litter, stay on marked trails, speak quietly, and never disturb plants or wildlife.',
      },
      {
        id: 'kakum-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'Besides protecting wildlife, how does Kakum National Park help families in Cape Coast and nearby towns?',
        options: [
          'It protects the forest streams that supply clean drinking water',
          'It sends ocean waves up to the hilltops',
          'It makes plastic bottles out of tree leaves',
          'It keeps the sun from shining in the daytime',
        ],
        correctIndex: 0,
        explanation: 'Kakum protects the watershed of the Kakum River and streams that provide fresh drinking water to Cape Coast and surrounding communities.',
      },
      {
        id: 'kakum-v1',
        type: 'vocabulary',
        afterPage: 8,
        word: 'ecotourism',
        definition: 'Responsible travel to natural areas that conserves the environment and supports local communities.',
        distractors: [
          'Cutting down forests to build large factories',
          'Keeping wild animals locked in small cages at home',
        ],
      },
      {
        id: 'kakum-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'How does ecotourism help protect the trees and animals of Kakum?',
        options: [
          'Ticket fees and guide jobs help locals earn income keeping trees safe',
          'Visitors bring axes to cut down the tallest trees',
          'Tourists take wild monkeys home on aeroplanes',
          'Rangers pave the whole forest floor with concrete',
        ],
        correctIndex: 0,
        explanation: 'Ecotourism funds park rangers and creates local jobs so protecting the living forest benefits everyone.',
      },
      {
        id: 'kakum-pred',
        type: 'prediction',
        afterPage: 6,
        prompt: 'What would happen to the animals and the Kakum River if people cut down the trees around the stream headwaters?',
      },
      {
        id: 'kakum-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put Ama and Jayden’s Kakum adventure in order.',
        items: [
          'Ranger Kweku teaches the ecotourism rules at the visitor centre.',
          'Ama helps Jayden walk bravely across the high canopy bridge.',
          'They spot a hornbill and monkeys in the sunlit upper canopy.',
          'Jayden picks up a stray plastic bottle to keep the trail clean.',
        ],
      },
      {
        id: 'kakum-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did Ama help Jayden when he felt nervous on the first high bridge, and how did Jayden feel afterwards?',
        feelingOptions: ['Kind', 'Brave', 'Proud', 'Grateful'],
      },
    ],
    glossary: [
      { word: 'ecotourism', definition: 'Careful travel to natural places that protects wildlife and helps local communities.', pages: [2, 8] },
      { word: 'canopy', definition: 'The high, leafy roof formed by the tops of tall rainforest trees.', pages: [3, 5, 6] },
      { word: 'headwaters', definition: 'The small streams where a river begins.', pages: [7] },
      { word: 'treasure', definition: 'Something very valuable and precious that must be protected.', pages: [9, 10] },
    ],
    teacherGuide: {
      overview:
        'Set at Kakum National Park in the Central Region, this Primary 3–4 story introduces the Kakum Canopy Walkway, rainforest canopy habitats, watershed protection for Cape Coast, the economics and ethics of responsible ecotourism, and the accurate distinction between inscribed UNESCO World Heritage Sites and Ghana’s UNESCO Tentative List.',
      lessonMinutes: 40,
      learningGoals: [
        'Explain what ecotourism is and state at least three responsible visitor rules in a national park.',
        'Describe why the canopy walkway allows visitors to observe upper-canopy wildlife without destroying the forest floor.',
        'Explain how Kakum’s rainforest protects the Kakum River watershed that supplies drinking water to Cape Coast.',
        'Understand how tourism revenue and local jobs support conservation.',
      ],
      subjectLinks: [
        { subject: 'Our World Our People / Social Studies', link: 'Tourist sites in Ghana, environmental conservation, and national heritage.', status: 'to-verify' },
        { subject: 'Science (Lower/Upper Primary)', link: 'Rainforest habitats, water cycle / watersheds, and human impact on ecosystems.', status: 'to-verify' },
        { subject: 'English Language', link: 'Reading comprehension, descriptive vocabulary, and oral communication.', status: 'to-verify' },
      ],
      beforeReading: [
        'Locate the Central Region, Cape Coast, and Kakum National Park on a map of Ghana.',
        'Ask learners: "If a cousin or friend from another country visited Ghana, what natural place would you be proud to show them, and how would you keep it clean?"',
      ],
      whileReading: [
        'Pause after page 4 to note the numbers: 7 bridges, 350 metres total length, up to 40 metres above the forest floor.',
        'Pause after page 8 to trace where visitor money goes (park rangers, trail maintenance, local guides, village artisans).',
      ],
      afterReading: [
        'Have learners design a "Welcome to Kakum, Leave Only Footprints" poster listing three rules for visitors.',
      ],
      discussion: [
        'Why do more birds and monkeys live high in the rainforest canopy than on the dark forest floor?',
        'How does protecting trees in Kakum help someone turning on a water tap in Cape Coast?',
        'What is the difference between tourism that harms nature (littering, disturbing animals) and ecotourism that protects nature?',
      ],
      reflection: [
        'What natural place in your own community, a stream, grove, park, or beach, needs people to care for it the way rangers care for Kakum?',
      ],
      mathsExtension: [
        {
          task: 'The Kakum Canopy Walkway has 7 bridges with a total length of 350 metres. What is the average length of each bridge if they were equal?',
          answer: '350 ÷ 7 = 50 metres per bridge.',
        },
        {
          task: 'If a school group of 10 children visits the walkway and each child’s ticket is 15 cedis, how much does the group pay in total toward park conservation?',
          answer: '10 × 15 = 150 cedis.',
        },
      ],
      differentiation: {
        support: [
          'Act out the four ecotourism rules from page 2 using simple hand gestures.',
        ],
        stretch: [
          'Write a postcard from Jayden to his school in London explaining three things he learned about Ghana’s rainforest.',
        ],
      },
      culturalNotes: [
        'Kakum National Park was gazetted as a national park in 1992 and its Canopy Walkway opened in 1995 through collaboration between the Wildlife Division (Forestry Commission), the Ghana Heritage Conservation Trust, and Conservation International.',
        'Accurate heritage note: Ghana’s inscribed UNESCO World Heritage Sites are the Forts and Castles (Volta, Greater Accra, Central and Western Regions, 1979) and the Asante Traditional Buildings (1980). Kakum National Park (Assin Attandanso Reserve) was placed on Ghana’s UNESCO World Heritage Tentative List in 2000.',
      ],
      localiseThis: [
        'Connect to the nearest protected forest reserve, wildlife sanctuary, waterfall, or river catchment in your region.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Tropical rainforest canopies house the majority of forest biodiversity because sunlight drives flowering and fruiting in the upper tree crowns.',
          'Forested watersheds like Kakum regulate stream flow, filter sediment, and sustain municipal water supplies for Cape Coast and surrounding districts.',
        ],
        whatWeAreStillDiscovering: [
          'Canopy biologists are still cataloging hundreds of insect, orchid, and epiphyte species that live exclusively in the high crowns of West African upper-Guinean rainforests.',
        ],
      },
      investigation: {
        title: 'See How Forest Roots and Leaves Keep Water Clean',
        materials: [
          'Two cut plastic bottle funnels (or two small flowerpots with drainage holes)',
          'Two clear cups',
          'Loose bare soil for Funnel A',
          'Soil covered with dead leaves, grass roots, or moss for Funnel B',
          'A cup of water',
        ],
        steps: [
          'Place bare loose soil in Funnel A over Cup A, and soil covered with a thick layer of leaves and roots in Funnel B over Cup B.',
          'Pour the same amount of water slowly over both funnels to imitate rain falling on a bare hill versus a forested Kakum hill.',
          'Compare how muddy or clear the water is in Cup A versus Cup B!',
        ],
        whatToNotice:
          'The water filtering through the leaves and roots (Funnel B) comes out much clearer and flows more steadily, showing how forest cover protects rivers like the Kakum River!',
        safetyNote:
          'Wash hands with soap and clean water after handling soil and leaves, and do not drink the test water.',
      },
      factCheck: [
        {
          claim: 'The Kakum Canopy Walkway consists of 7 bridges spanning ~350 metres at heights up to 40 metres, and Kakum is on Ghana’s UNESCO Tentative List while protecting the Kakum River watershed.',
          explanation: 'Kakum National Park (375 km²) protects the headwaters of the Kakum, Nemimi, and Nbuakosua rivers supplying Cape Coast; it is listed on the UNESCO World Heritage Tentative List (Ref. 1393, submitted 2000).',
          reference: 'UNESCO World Heritage Centre, Kakum National Park (Assin Attandanso Reserve) Tentative List Ref. 1393; Forestry Commission of Ghana (Wildlife Division).',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, lively Ghanaian English storyteller (`Kore`) for Primary 3–4.',
      pace: 'Medium (about 115 words per minute).',
      notes: [
        'Use phonetic hints for Ama and Kakum while keeping standard written spellings.',
      ],
    },
    music: 'Optional rainforest birdsong and soft acoustic guitar, off by default.',
    culturalNotes: [
      'Highlights Kakum National Park in the Central Region and accurate UNESCO World Heritage vs Tentative List status.',
    ],
    reviewQuestions: [
      'Confirm that the watershed connection between Kakum River and Cape Coast water supply is clear for Primary 3–4.',
    ],
  },

  // ====================================================================================================================
  // 2. The Courage of Yaa Asantewaa (Primary 5-JHS 1, 12 pages, Ghanaian History, Leadership, Colonial Resistance)
  // ====================================================================================================================
  {
    key: 'the-courage-of-yaa-asantewaa',
    set: 'extension',
    title: 'The Courage of Yaa Asantewaa',
    summary:
      'On a school visit to the Manhyia Palace Museum in Kumasi, eleven-year-old Kwaku and his sister Abena explore the verified history of Nana Yaa Asantewaa, the sacred Golden Stool, and the 1900 resistance against British colonial rule, learning how historians use evidence.',
    classification: base({
      classIds: ['primary-5', 'primary-6', 'jhs-1'],
      ageMin: 10,
      ageMax: 13,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['historical', 'cultural', 'educational'],
      themes: ['leadership', 'fear-and-courage', 'identity', 'citizenship'],
      objectives: ['cultural-heritage', 'critical-thinking', 'reading-comprehension', 'vocabulary', 'respect', 'summarising'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 420,
    }),
    palette: ['#78350f', '#f59e0b'],
    characters: [
      'Kwaku: an eleven-year-old Ghanaian boy in Primary 6, wearing a neat cream-and-brown school uniform and carrying a history notebook.',
      'Abena: his thirteen-year-old sister in JHS 1, braided hair tied neatly, wearing the same cream-and-brown uniform.',
      'Curator Agyeman: a knowledgeable Ghanaian museum historian at Manhyia Palace Museum in Kumasi, wearing a rich kente scarf over a black suit jacket and glasses.',
      'Historical portrayal (in museum paintings and exhibits): Nana Yaa Asantewaa, Queen Mother of Ejisu (born c. 1840s), dignified elder leader in traditional battle smock (batakari) and kente.',
    ],
    pages: [
      {
        text: 'Inside the courtyard of the Manhyia Palace Museum in Kumasi, eleven-year-old Kwaku opened his history notebook beside his sister Abena. Before them stood a life-sized statue and archival photographs of a dignified Ashanti woman. ‘Welcome,’ said museum historian Curator Agyeman. ‘Today we are investigating the true historical story of Nana Yaa Asantewaa, Queen Mother of Ejisu.’',
        alt: 'At the Manhyia Palace Museum in Kumasi, Kwaku and Abena stand with Curator Agyeman before a museum display of Nana Yaa Asantewaa.',
        motif: '🏛️👑',
        brief: 'Courtyard and gallery of Manhyia Palace Museum in Kumasi. Kwaku (11, cream-and-brown uniform, notebook) and Abena (13, same uniform) standing with Curator Agyeman (glasses, kente scarf over dark jacket) beside a dignified bronze statue of Nana Yaa Asantewaa.',
        narration: 'Respectful, engaging opening. Clear pronunciation of "Manhyia", "Kumasi", "Asantewaa", and "Ejisu".',
      },
      {
        text: '‘Before we begin,’ Curator Agyeman said, holding up an old photograph and a notebook, ‘how do historians know what happened over a hundred years ago? We compare written records, colonial telegrams, photographs, museum artefacts, and Asante oral traditions passed down by elders. Where sources agree, we have established historical facts; where no word-for-word transcript was written down at the moment, historians say so honestly.’',
        alt: 'Curator Agyeman shows Kwaku and Abena archival photographs and historical documents inside a glass display case.',
        motif: '📜🔍',
        brief: 'Inside the museum gallery: Curator Agyeman pointing to sepia historical photographs and bound archival ledgers inside a glass display case (no readable text) while Kwaku and Abena look closely.',
        narration: 'Clear, thoughtful explanation of historical evidence versus invented quotes.',
      },
      {
        text: 'Curator Agyeman guided them to a display about nineteenth-century Asante. ‘Nana Yaa Asantewaa was born in the eighteen-forties in Besease near Ejisu,’ he explained. ‘In the Asante matrilineal system, the Queen Mother, or Ohemmaa, holds deep constitutional responsibility: she nominates the ruler, advises the council on peace and justice, and guards the welfare of the community.’',
        alt: 'A museum painting shows Nana Yaa Asantewaa seated in council at Ejisu advising elders and community members.',
        motif: '🪑🌿',
        brief: 'Warmly lit museum painting showing Nana Yaa Asantewaa dressed in traditional kente seated in a courtyard at Ejisu, listening to and advising elders with calm dignity.',
        narration: 'Steady, respectful tone explaining the constitutional role of the Queen Mother.',
      },
      {
        text: '‘By the eighteen-nineties,’ Curator Agyeman continued, ‘the British Empire sought control over the gold-rich Asante kingdom. In eighteen ninety-six, British troops entered Kumasi and arrested the Asantehene, Nana Prempeh the First, along with his mother Nana Yaa Akyaa and several chiefs, including Yaa Asantewaa’s own grandson, exiling them far away, first to Sierra Leone and later to the Seychelles islands in the Indian Ocean.’',
        alt: 'A historical map display traces the long sea route from the Gold Coast to Sierra Leone and the Seychelles islands.',
        motif: '🗺️⛵',
        brief: 'Museum wall map of Africa and the Indian Ocean (no text labels) with a glowing line tracing the sea journey from the Gold Coast to Sierra Leone and the Seychelles, watched by Abena and Kwaku.',
        narration: 'Sombre and clear. Emphasise the year "eighteen ninety-six" and "Nana Prempeh the First".',
      },
      {
        text: 'Kwaku looked at a carved golden emblem in the gallery. ‘Even after exiling the King, what were the British still searching for?’ he asked. ‘The Golden Stool, Sika Dwa Kofi,’ said Curator Agyeman. ‘Since the time of Osei Tutu the First and Okomfo Anokye, the Golden Stool has been sacred to the Asante nation. It is never sat upon by anyone, not even the King. It represents the soul, unity and living spirit of the entire people.’',
        alt: 'A museum exhibit illustrates the sacred Golden Stool resting on its own special throne cushion flanked by royal attendants.',
        motif: '✨🪑',
        brief: 'Respectful museum illustration showing the sacred Golden Stool resting upon its own raised ceremonial chair and embroidered cushion, surrounded by attendants under royal umbrellas.',
        narration: 'Reverent and clear: "never sat upon by anyone" and "represents the soul, unity and living spirit".',
      },
      {
        text: '‘On the twenty-eighth of March, nineteen hundred,’ said Curator Agyeman, ‘the British Governor, Sir Frederick Hodgson, called a meeting of Asante leaders at the fort in Kumasi. In a speech recorded in British colonial dispatches, Hodgson declared that Nana Prempeh would not return and demanded that the Asante hand over the Golden Stool so that he, the Governor, could sit upon it!’',
        alt: 'A historical illustration shows the tense meeting outside the Kumasi fort on 28 March 1900 as Asante chiefs listen in stunned silence.',
        motif: '🏰😠',
        brief: 'Historical museum panel depicting the outdoor durbar at Kumasi in March 1900: British colonial officials on a veranda facing rows of dignified Asante chiefs seated under umbrellas in solemn silence.',
        narration: 'Dramatic but measured historical narration.',
      },
      {
        text: 'Abena gasped. ‘He wanted to sit on the sacred symbol of the nation’s soul?’ ‘Yes,’ said Curator Agyeman. ‘To the Asante, that demand was not just an insult; it was an attempt to destroy the sovereignty and unity of the nation. That evening, the remaining chiefs and Nana Yaa Asantewaa gathered in council to decide how to respond. At first, several chiefs hesitated, fearing the power of British cannons and Maxim guns.’',
        alt: 'In a lamplit council courtyard, Nana Yaa Asantewaa stands upright among hesitating chiefs to speak with courage.',
        motif: '🔥🗣️',
        brief: 'Warm lamplit historical scene: Nana Yaa Asantewaa standing tall and resolute in the centre of a council of seated Asante elders at night, her hand raised in a gesture of firm resolve.',
        narration: 'Quiet tension building to Yaa Asantewaa’s moment of leadership.',
      },
      {
        text: '‘What did Nana Yaa Asantewaa say to them?’ asked Kwaku eagerly. ‘No tape recorder existed in nineteen hundred,’ Curator Agyeman explained carefully, ‘so historians do not claim a word-for-word transcript. However, eyewitness oral traditions and early twentieth-century historians record the clear message of her speech: she challenged the chiefs’ hesitation and declared that if the men of Asante would not go forward to defend the Golden Stool, she and the women would stand up to protect it!’',
        alt: 'Curator Agyeman points to a plaque explaining how oral traditions preserved the meaning of Yaa Asantewaa’s call to courage.',
        motif: '📖🦁',
        brief: 'Curator Agyeman speaking to Kwaku and Abena beside a museum display showing Nana Yaa Asantewaa inspiring the council of chiefs.',
        narration: 'Honest historical framing ("historians do not claim a word-for-word transcript") paired with inspiring delivery of her recorded message.',
      },
      {
        text: '‘Her courage united the council,’ said Curator Agyeman. ‘The chiefs swore an oath to defend the Golden Stool and chose Nana Yaa Asantewaa, then around sixty years old, as Sahene, commander-in-chief of the resistance! For months during the War of the Golden Stool in nineteen hundred, Asante forces built timber stockades, planned strategy, and besieged the British fort in Kumasi.’',
        alt: 'A museum diorama shows Nana Yaa Asantewaa in a traditional batakari smock directing strategy with Asante commanders.',
        motif: '🛡️🌲',
        brief: 'Dignified museum portrait of Nana Yaa Asantewaa wearing a traditional woven batakari smock, holding a ceremonial staff as she consults calmly with Asante leaders in the forest (non-graphic, no violence).',
        narration: 'Strong, respectful cadence highlighting her strategic leadership at age sixty.',
      },
      {
        text: '‘What happened at the end of the war?’ asked Abena. ‘The British brought thousands of reinforcements and heavy artillery from across West Africa and overseas,’ said Curator Agyeman. ‘Eventually, Nana Yaa Asantewaa and fifteen other leaders were captured and exiled to the Seychelles to join Nana Prempeh the First. She lived there with dignity until she passed away in October nineteen twenty-one.’',
        alt: 'An archival sepia portrait in the museum shows Nana Yaa Asantewaa and fellow Asante leaders during their exile in the Seychelles.',
        motif: '🖼️🌊',
        brief: 'Kwaku and Abena looking respectfully at a framed sepia portrait on the museum wall showing elderly Asante royals seated with quiet dignity during their exile in the Seychelles.',
        narration: 'Gentle, solemn respect.',
      },
      {
        text: '‘Did the British ever capture the Golden Stool?’ asked Kwaku. Curator Agyeman smiled. ‘Never! Because of the unity and sacrifice of Nana Yaa Asantewaa and the people, the Golden Stool was kept hidden and safe. Years later, in nineteen twenty-four, Nana Prempeh the First returned home from exile, and today the Golden Stool remains at the heart of Asante heritage and modern Ghana.’',
        alt: 'Curator Agyeman smiles warmly as Kwaku and Abena write notes beside the exhibit of Asante royal heritage.',
        motif: '🌟📓',
        brief: 'Inside the bright museum hall, Curator Agyeman smiling as Kwaku writes in his notebook and Abena looks up with pride.',
        narration: 'Triumphant clarity on "Never! ... the Golden Stool was kept hidden and safe".',
      },
      {
        text: 'Stepping back into the Kumasi sunshine, Abena looked at her brother. ‘Nana Yaa Asantewaa showed that true leadership is not about seeking comfort,’ she said. ‘It is about standing up for unity, dignity and what matters most when others are afraid.’ Kwaku nodded, closing his notebook carefully. ‘And preserving honest historical evidence ensures her courage will guide Ghana forever.’ The end.',
        alt: 'Outside the Manhyia Palace Museum in Kumasi, Kwaku and Abena wave goodbye to Curator Agyeman in the warm sunlight.',
        motif: '🇬🇭🌅',
        brief: 'Sunny courtyard of Manhyia Palace Museum: Kwaku and Abena smiling and waving goodbye to Curator Agyeman near the museum gardens.',
        narration: 'Inspiring, thoughtful conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'yaa-hist-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How do historians study events from 1900 honestly and accurately?',
        options: [
          'They compare archival records, photos, artefacts and oral traditions',
          'They invent new speeches and pretend they were recorded on tape',
          'They only read stories written in comic books',
          'They guess without checking any dates or places',
        ],
        correctIndex: 0,
        explanation: 'Historians cross-check written dispatches, photographs, artefacts, and oral traditions, and distinguish verified facts from summaries.',
      },
      {
        id: 'yaa-hist-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does the Golden Stool (Sika Dwa Kofi) represent to the Asante people?',
        options: [
          'The sacred soul, unity and living spirit of the Asante nation',
          'An ordinary wooden chair that anyone can sit on at meetings',
          'A box used for storing British coins',
          'A musical instrument played at markets',
        ],
        correctIndex: 0,
        explanation: 'The Golden Stool is never sat upon; it embodies the soul, unity, and spirit of the Asante nation.',
      },
      {
        id: 'yaa-hist-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'What triggered the 1900 resistance led by Nana Yaa Asantewaa?',
        options: [
          'Governor Hodgson demanded the Golden Stool to sit on after exiling the King',
          'A heavy rainstorm washed away the roads in Ejisu',
          'The British asked to buy cocoa beans at the market',
          'A dispute over a football match in Kumasi',
        ],
        correctIndex: 0,
        explanation: 'Following the 1896 exile of Nana Prempeh I, Governor Hodgson’s March 1900 demand to sit on the Golden Stool sparked the resistance.',
      },
      {
        id: 'yaa-hist-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'sovereignty',
        definition: 'The authority and right of a nation or people to govern themselves.',
        distractors: [
          'A glass case used inside a museum',
          'A long sea voyage to an island',
        ],
      },
      {
        id: 'yaa-hist-pred',
        type: 'prediction',
        afterPage: 8,
        prompt: 'Why is it important for history books to explain when a famous speech comes from oral tradition rather than a word-for-word recording?',
      },
      {
        id: 'yaa-hist-seq',
        type: 'sequencing',
        afterPage: 11,
        prompt: 'Put these verified historical events in chronological order.',
        items: [
          'In 1896, the British exile Asantehene Nana Prempeh I from Kumasi.',
          'On 28 March 1900, Governor Hodgson demands the sacred Golden Stool.',
          'Nana Yaa Asantewaa rallies the council and leads the 1900 resistance.',
          'The Golden Stool remains safe, and Nana Prempeh I returns in 1924.',
        ],
      },
      {
        id: 'yaa-hist-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'What qualities of Nana Yaa Asantewaa’s leadership can inspire young people in Ghana today?',
        feelingOptions: ['Courageous', 'Responsible', 'United', 'Principled'],
      },
    ],
    glossary: [
      { word: 'artefacts', definition: 'Historical objects made or used by people in the past and preserved in museums.', pages: [2] },
      { word: 'exiling', definition: 'Forcing a person or leader to live far away from their homeland.', pages: [4, 5] },
      { word: 'sacred', definition: 'Deeply respected, holy, and dedicated to a high spiritual or national purpose.', pages: [5, 7] },
      { word: 'sovereignty', definition: 'The freedom and authority of a nation to govern itself independently.', pages: [7] },
      { word: 'stockades', definition: 'Strong defensive barriers built from thick timber logs during the 1900 war.', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'Framed through a guided visit to the Manhyia Palace Museum in Kumasi, this Primary 5–JHS 1 story presents the verified historical context of Nana Yaa Asantewaa (Queen Mother of Ejisu), the 1896 exile of Asantehene Nana Prempeh I, the sacred meaning of the Golden Stool (Sika Dwa Kofi), Governor Frederick Hodgson’s demand on 28 March 1900, and the 1900 War of the Golden Stool, while explicitly teaching learners how historians distinguish primary records and oral traditions from invented dialogue.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain the constitutional role of the Queen Mother (Ohemmaa) in Asante governance and identify Nana Yaa Asantewaa as Queen Mother of Ejisu.',
        'Explain why the Golden Stool (Sika Dwa Kofi) is sacred to the Asante nation and why Governor Hodgson’s demand on 28 March 1900 provoked resistance.',
        'Distinguish between verified historical facts, oral traditions of speeches, and modern museum framing.',
        'Reflect on how courage, sacrifice, and unity protect national dignity.',
      ],
      subjectLinks: [
        { subject: 'History of Ghana / Social Studies (Upper Primary & JHS)', link: 'Colonial rule, resistance movements, Nana Yaa Asantewaa and the 1900 War of the Golden Stool.', status: 'to-verify' },
        { subject: 'Our World Our People', link: 'Leadership, women in Ghanaian history, and national symbols.', status: 'to-verify' },
        { subject: 'English Language', link: 'Historical narrative comprehension, source evaluation, and vocabulary.', status: 'to-verify' },
      ],
      beforeReading: [
        'Locate Kumasi and Ejisu in the Ashanti Region on a map of Ghana, and locate Sierra Leone and the Seychelles on a map of Africa and the Indian Ocean.',
        'Ask learners: "How do we know what happened in Ghana before anyone now living was born?"',
      ],
      whileReading: [
        'Pause after page 2 to discuss why historians cross-check multiple sources (written dispatches, photos, and oral traditions).',
        'Pause after page 8 to note why Curator Agyeman explains that Yaa Asantewaa’s speech is preserved in meaning through oral history rather than a tape recording.',
      ],
      afterReading: [
        'Create a two-column chart on the board: "Verified Historical Facts (with dates)" and "Lessons on Leadership for Today".',
      ],
      discussion: [
        'Why was the Golden Stool never sat upon, and why did Governor Hodgson’s demand show a deep misunderstanding of Asante culture and sovereignty?',
        'What role did women play in leadership and governance in traditional Ghanaian societies as shown by Nana Yaa Asantewaa?',
        'Even though Nana Yaa Asantewaa was eventually captured and exiled to the Seychelles, why do historians consider the defence of the Golden Stool a lasting triumph?',
      ],
      reflection: [
        'When is a time in school or community life when standing up for what is right requires quiet courage?',
      ],
      mathsExtension: [
        {
          task: 'Nana Prempeh I was exiled in 1896 and returned to Kumasi in 1924. How many years was he in exile?',
          answer: '1924 − 1896 = 28 years.',
        },
        {
          task: 'The War of the Golden Stool began in March 1900 and Nana Yaa Asantewaa passed away in the Seychelles in 1921. How many years passed between March 1900 and 1921?',
          answer: '1921 − 1900 = 21 years.',
        },
      ],
      differentiation: {
        support: [
          'Use a visual timeline with four dates: 1896 (Exile of Prempeh I), 28 March 1900 (Hodgson’s demand & Yaa Asantewaa’s leadership), 1921 (Yaa Asantewaa’s passing in Seychelles), and 1924 (Return of Prempeh I).',
        ],
        stretch: [
          'Write a short historical essay explaining how comparing British colonial records and Asante oral traditions gives a fuller picture of the 1900 war than reading only one side.',
        ],
      },
      culturalNotes: [
        'Nana Yaa Asantewaa (c. 1840–1921) was the Edwesohemmaa (Queen Mother of Ejisu/Edweso). Manhyia Palace Museum in Kumasi preserves royal Asante history and artefacts.',
      ],
      localiseThis: [
        'Connect to respected historical leaders (male and female) from your own region or traditional area in Ghana.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'In 1896 British authorities exiled Asantehene Nana Prempeh I; on 28 March 1900 Governor Sir Frederick Hodgson demanded the Golden Stool at Kumasi.',
          'Nana Yaa Asantewaa, Queen Mother of Ejisu, led the 1900 resistance (War of the Golden Stool); she was later exiled to the Seychelles where she died in October 1921, while the Golden Stool was never captured.',
        ],
        whatWeAreStillDiscovering: [
          'Ghanaian and international historians continue archiving local family oral histories, photographs from the Seychelles exile, and regional accounts of the 1900 stockade defences across Ashanti towns.',
        ],
      },
      investigation: {
        title: 'Be a Historian: Compare Two Eyewitness Accounts',
        materials: [
          'Exercise books and pencils',
          'A short 1-minute classroom action (for example, the teacher walks to the board, draws a star, puts down the chalk, and opens a window)',
        ],
        steps: [
          'Have the teacher perform a short 4-step action in front of the class without announcing it beforehand.',
          'Ask three learners sitting in different parts of the room to write down what they saw, and ask a fourth learner to interview them and combine the evidence.',
          'Compare the accounts: which details did every witness agree on, and which details were only visible from one angle?',
        ],
        whatToNotice:
          'Different witnesses notice different details, so historians compare multiple independent accounts and physical clues to reconstruct what truly happened!',
        safetyNote:
          'Standard classroom activity; treat every classmate’s written observation respectfully.',
      },
      factCheck: [
        {
          claim: 'On 28 March 1900, British Governor Sir Frederick Hodgson demanded the Golden Stool in Kumasi, and Nana Yaa Asantewaa (Queen Mother of Ejisu) led the subsequent resistance.',
          explanation: 'Hodgson’s demand is documented in British Colonial Office dispatches (Gold Coast Confidential, 1900), and Yaa Asantewaa’s leadership of the 1900 uprising and subsequent exile to the Seychelles (d. 17 October 1921) are established in Ghanaian and imperial historiography.',
          reference: 'Boahen, A. A. (2003). Yaa Asantewaa and the Asante-British War of 1900–1. James Currey / Sub-Saharan Publishers; Arhin, K. (2000). The Role of Yaa Asantewaa in the 1900 Asante War of Resistance; Manhyia Palace Museum Historical Archives.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Dignified, warm Ghanaian English storyteller (`Kore`) for Upper Primary and JHS 1.',
      pace: 'Medium (about 130 words per minute).',
      notes: [
        'Use phonetic hints for Asantewaa, Ejisu, Prempeh, Manhyia, Kumasi, Kwaku, and Abena while keeping standard written spellings.',
      ],
    },
    music: 'Optional solemn fontomfrom and kora historical underscore, off by default.',
    culturalNotes: [
      'Strictly separates verified historical facts and oral-tradition summaries from invented verbatim dialogue.',
    ],
    reviewQuestions: [
      'Confirm with an Ashanti history reviewer whether both "Ejisu" and "Edweso" should be noted in classroom materials.',
    ],
  },

  // ====================================================================================================================
  // 3. Kojo's Amazing Greenhouse Farm (Primary 5-6, 12 pages, Agricultural Science, Greenhouse vs Atmospheric Effect, Budget)
  // ====================================================================================================================
  {
    key: 'kojos-amazing-greenhouse-farm',
    set: 'extension',
    title: 'Kojo’s Amazing Greenhouse Farm',
    summary:
      'When heavy rains and whiteflies damage his uncle’s open tomato field on the Accra Plains, eleven-year-old Kojo investigates how a tropical greenhouse manages light, heat, ventilation, drip irrigation, pests and farm budgets, and how a farm greenhouse differs from Earth’s atmospheric greenhouse effect.',
    classification: base({
      classIds: ['primary-5', 'primary-6'],
      ageMin: 10,
      ageMax: 12,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['farm-and-garden', 'technology', 'money-and-enterprise'],
      objectives: ['scientific-curiosity', 'financial-literacy', 'problem-solving', 'critical-thinking', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'local-food'],
      estimatedDurationSec: 420,
    }),
    palette: ['#dcfce7', '#dc2626'],
    characters: [
      'Kojo: an eleven-year-old Ghanaian boy in Primary 6, wearing a green check shirt, denim trousers and rubber farm boots, carrying a clipboard.',
      'Uncle Ofori: Kojo’s uncle, a thirty-five-year-old Ghanaian agricultural scientist and vegetable farmer near Dawhenya, wearing a light blue collared work shirt, khaki trousers and a straw sun hat.',
      'Ama: Kojo’s eleven-year-old neighbour and farm club partner, wearing a yellow t-shirt, overalls and rubber boots.',
    ],
    pages: [
      {
        text: 'On Saturday morning at Uncle Ofori’s vegetable farm near Dawhenya on the Accra Plains, eleven-year-old Kojo and his friend Ama crouched beside an open plot of tomato plants. Yesterday’s heavy rainstorm had knocked yellow blossoms into the mud, and tiny whiteflies buzzed under curling leaves. ‘Farming outdoors is tough!’ sighed Kojo.',
        alt: 'Kojo and Ama crouch with Uncle Ofori beside an outdoor tomato bed where rain has splashed mud onto drooping leaves.',
        motif: '🍅🌧️',
        brief: 'Outdoor vegetable plot in Ghana after rain: Kojo (11, green check shirt, denim trousers, rubber boots, clipboard) and Ama (11, yellow t-shirt, overalls) crouching with Uncle Ofori (blue work shirt, straw hat) examining mud-splashed tomato seedlings.',
        narration: 'Sympathetic and observant opening.',
      },
      {
        text: 'Uncle Ofori smiled and pointed across the yard to a tall, arched structure covered with clear UV-protected roof film and fine white mesh netting along the sides. ‘That is why we are testing controlled-environment farming,’ he said. ‘Welcome to our tropical greenhouse! Let us step through the double-door entry and wash our boots in the disinfectant tray.’',
        alt: 'Uncle Ofori leads Kojo and Ama toward a bright arched tropical greenhouse with mesh side walls and a double-door entrance.',
        motif: '🏡🌱',
        brief: 'Sunny Ghanaian farmyard: Uncle Ofori leading Kojo and Ama toward a neat arched tropical greenhouse with a translucent roof and white insect-mesh side walls; Kojo steps into a shallow boot-wash tray at the double-door entry.',
        narration: 'Warm, inviting tone. Emphasise the double-door entry and boot wash.',
      },
      {
        text: 'Inside the greenhouse, neat rows of tall tomato vines climbed up strings, heavy with clusters of smooth red and green tomatoes! ‘Look how healthy the leaves are!’ said Ama. ‘How does a greenhouse work, Uncle Ofori?’ ‘First,’ he explained, ‘the clear roof lets sunlight shine through so the green leaves can perform photosynthesis, using light, water and carbon dioxide to make sugars for the fruit.’',
        alt: 'Inside the sunlit greenhouse, healthy tomato vines climb vertical strings heavy with red and green tomatoes.',
        motif: '☀️🍅',
        brief: 'Inside the bright greenhouse: lush green tomato vines trained up vertical strings heavy with red and green tomatoes, as Uncle Ofori points up at the sunlit translucent roof for Kojo and Ama.',
        narration: 'Bright wonder on the healthy tomato vines, then clear explanation of photosynthesis.',
      },
      {
        text: '‘At the same time,’ Uncle Ofori continued, ‘the roof shields the delicate tomato flowers from pounding rainstorms that bruise fruit and splash soil fungi onto the leaves. And because the roof and walls enclose the space, warm air stays inside instead of blowing away on the wind.’',
        alt: 'Uncle Ofori points to the curved roof sheltering yellow tomato blossoms from outdoor wind and rain.',
        motif: '🛡️🌼',
        brief: 'Close view of delicate yellow tomato blossoms and young green tomatoes dry and sheltered beneath the greenhouse roof.',
        narration: 'Clear and steady.',
      },
      {
        text: 'Kojo raised his pencil. ‘Uncle, in science class we heard about the atmospheric greenhouse effect warming the whole Earth. Is that the exact same thing as this farm greenhouse?’ ‘Great question, Kojo!’ said Uncle Ofori. ‘They share a name, but they work differently. A farm greenhouse stays warm mainly because its solid roof and walls physically stop warm air from rising and blowing away.’',
        alt: 'Kojo holds his clipboard and asks Uncle Ofori about the difference between a farm greenhouse and Earth’s atmosphere.',
        motif: '🌍🤔',
        brief: 'Kojo holding up his clipboard and pencil to ask Uncle Ofori a question between the neat rows of tomato plants, while Ama listens.',
        narration: 'Emphasise this key scientific distinction clearly.',
      },
      {
        text: '‘In Earth’s atmosphere,’ Uncle Ofori explained, ‘there is no plastic roof in the sky! Instead, gases like carbon dioxide, water vapour and methane absorb invisible heat radiation rising from the ground and send some of it back toward Earth. So our farm greenhouse is a physical shelter for plants, whereas the atmospheric greenhouse effect is about heat-absorbing gases around the planet.’',
        alt: 'Uncle Ofori shows a sketch comparing a roofed farm greenhouse with Earth surrounded by heat-absorbing gases.',
        motif: '☀️🌏',
        brief: 'Uncle Ofori holding a visual diagram card with two simple pictures side by side: an arched greenhouse shelter on the left and a blue-and-green Earth globe surrounded by a soft atmosphere layer on the right (no text or words).',
        narration: 'Measured and crystal clear so learners grasp both mechanisms.',
      },
      {
        text: 'Ama looked at a thermometer hanging at plant height: it read twenty-eight degrees Celsius. ‘Wait,’ she said, ‘in hot Ghanaian sunshine, wouldn’t a closed plastic box get far too hot inside?’ ‘Exactly right!’ said Uncle Ofori. ‘If a greenhouse has poor ventilation in our tropical climate, temperatures can shoot above thirty-eight degrees, spoiling tomato pollen and wilting the crop!’',
        alt: 'Ama checks a hanging thermometer while Uncle Ofori points to the high roof vents and breathable mesh walls.',
        motif: '🌡️💨',
        brief: 'Ama looking at a hanging thermometer among the tomato vines while Uncle Ofori points upward to the open ridge vent along the top of the greenhouse roof and the mesh side walls.',
        narration: 'Lively praise on "Exactly right!" and clear warning about overheating.',
      },
      {
        text: '‘That is why tropical greenhouses in Ghana are designed with high roof vents and roll-up side walls covered with fine mesh,’ Uncle Ofori showed them. ‘Hot air rises and escapes out of the top vent while cooler air flows in through the sides. We also watch humidity carefully: if the air stays too damp without airflow, mould and fungi can attack the leaves.’',
        alt: 'Gentle airflow arrows in the sunlit space show hot air rising out of the roof vent while fresh air enters through the side netting.',
        motif: '🌬️🌿',
        brief: 'Wide interior view of the tropical greenhouse showing the high open ridge vent at the peak of the roof and bright breezy mesh side walls keeping the tall tomato plants comfortable.',
        narration: 'Clear explanation of convection, ventilation, and humidity control.',
      },
      {
        text: 'Kojo knelt by the base of a plant where a thin black tube released slow, steady drops of water right at the roots. ‘Why don’t you spray water over the whole room with a hose?’ he asked. ‘This is drip irrigation,’ said Uncle Ofori. ‘Greenhouses still need plenty of clean water, Kojo, but drip lines deliver measured water and plant nutrients straight to the roots. Less water evaporates into the air, and the leaves stay dry and healthy!’',
        alt: 'Kojo kneels beside a black drip-irrigation tube releasing small drops of water directly at the base of a tomato stem.',
        motif: '💧🌱',
        brief: 'Close view of Kojo kneeling in his rubber boots to inspect a narrow black drip-irrigation pipe resting on the soil bed, with a glistening drop of water watering the base of a healthy tomato stem.',
        narration: 'Clear explanation of drip irrigation and water conservation.',
      },
      {
        text: '‘And what about the whiteflies we saw outside?’ asked Ama, pointing to a small yellow sticky card hanging near the door. ‘The fine side netting blocks most insects from flying in,’ said Uncle Ofori, ‘so we spray far less pesticide. However, a greenhouse never eliminates all pests by magic! Tiny pests can still sneak in on clothes or tools. That is why we use yellow sticky traps to monitor insects and inspect every row each morning.’',
        alt: 'Ama and Uncle Ofori inspect a yellow sticky pest-monitoring card hanging near the greenhouse entrance.',
        motif: '🟨🔍',
        brief: 'Uncle Ofori and Ama examining a bright yellow rectangular sticky trap card suspended on a string near the greenhouse door, while Kojo takes notes.',
        narration: 'Honest trade-off: reduces pesticide use, but requires strict hygiene and daily scouting.',
      },
      {
        text: 'At the farm table, Uncle Ofori opened his account book. ‘Does a greenhouse guarantee easy money?’ he asked. ‘No! Building the frame, replacing torn nets, pumping water and buying quality seeds all cost money. This season, our seeds and compost cost three hundred cedis, water and nutrients cost two hundred and fifty cedis, labour and routine maintenance cost two hundred and fifty cedis, and our net-and-frame upkeep cost two hundred cedis. That is one thousand cedis in total costs.’',
        alt: 'At a wooden table outside the greenhouse, Uncle Ofori reviews his farm budget notebook with Kojo and Ama.',
        motif: '📓🧮',
        brief: 'Wooden table outside the greenhouse with crates of bright red tomatoes: Uncle Ofori showing his open farm ledger (neat columns, no readable text) to Kojo and Ama.',
        narration: 'Read the budget numbers clearly: "three hundred", "two hundred and fifty", "two hundred and fifty", "two hundred", "one thousand cedis in total costs".',
      },
      {
        text: 'Kojo calculated quickly on his clipboard. ‘We harvested eighty crates of firm, clean tomatoes and sold them at twenty cedis per crate. Eighty times twenty is one thousand six hundred cedis in sales! Subtracting the one thousand cedis of costs leaves six hundred cedis of real profit!’ Uncle Ofori beamed. ‘When science, careful ventilation and honest budgeting work together, smart farming can feed Ghana’s future!’ The end.',
        alt: 'Kojo, Ama and Uncle Ofori smile proudly beside crates of shiny red greenhouse tomatoes ready for market.',
        motif: '🍅🎉',
        brief: 'Warm afternoon light: Kojo holding his clipboard, Ama holding a ripe red tomato, and Uncle Ofori smiling proudly behind neat wooden crates filled with glossy red tomatoes.',
        narration: 'Energetic, proud verification of the maths (`80 × 20 = 1,600`; `1,600 − 1,000 = 600`). Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'gh-c1',
        type: 'comprehension',
        afterPage: 6,
        question: 'How does a farm greenhouse structure differ from Earth’s atmospheric greenhouse effect?',
        options: [
          'A farm greenhouse traps air with a roof; the atmosphere uses gases',
          'Earth has a giant plastic sheet floating in space above the clouds',
          'A farm greenhouse works without any sunlight at all',
          'There is no difference; both are made of wooden poles and netting',
        ],
        correctIndex: 0,
        explanation: 'A farm greenhouse physically encloses air with a roof and walls, whereas the atmospheric greenhouse effect involves gases absorbing and re-emitting infrared heat.',
      },
      {
        id: 'gh-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'What happens in a Ghanaian greenhouse if it has poor ventilation on a hot day?',
        options: [
          'It overheats above 38 °C and traps damp air, harming pollen and leaves',
          'It turns into a freezer and covers the tomatoes in snow',
          'The plants grow ten times faster without needing any water',
          'Whiteflies disappear forever without netting',
        ],
        correctIndex: 0,
        explanation: 'Without roof vents and mesh airflow, tropical greenhouses overheat quickly and high humidity promotes fungal diseases.',
      },
      {
        id: 'gh-v1',
        type: 'vocabulary',
        afterPage: 9,
        word: 'irrigation',
        definition: 'Supplying water to crops through pipes, channels or drip lines to help them grow.',
        distractors: [
          'Cutting down old tomato vines after harvest',
          'Selling crates of vegetables at the market',
        ],
      },
      {
        id: 'gh-c3',
        type: 'comprehension',
        afterPage: 12,
        question: 'Uncle Ofori sold 80 crates at 20 cedis each (1,600 cedis) and spent 1,000 cedis on costs. What was his profit?',
        options: [
          '600 cedis profit',
          '1,600 cedis profit',
          '2,600 cedis profit',
          '1,000 cedis profit',
        ],
        correctIndex: 0,
        explanation: 'Revenue (80 × 20 = 1,600 cedis) minus Total Costs (300 + 250 + 250 + 200 = 1,000 cedis) equals 600 cedis profit.',
      },
      {
        id: 'gh-pred',
        type: 'prediction',
        afterPage: 10,
        prompt: 'Why must greenhouse farmers still wash their boots and check yellow sticky traps even when insect netting covers the walls?',
      },
      {
        id: 'gh-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Put the steps of Uncle Ofori’s greenhouse management in order.',
        items: [
          'Wash boots at the double-door entry to keep soil pests out.',
          'Use roof vents and mesh walls to keep temperature around 28 °C.',
          'Deliver water and nutrients straight to roots with drip irrigation.',
          'Record all 1,000 cedis of costs and subtract from 1,600 cedis of sales.',
        ],
      },
      {
        id: 'gh-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How do you feel when you see how science, hard work and careful maths can help farmers grow healthy food in Ghana?',
        feelingOptions: ['Inspired', 'Curious', 'Capable', 'Proud'],
      },
    ],
    glossary: [
      { word: 'photosynthesis', definition: 'The process by which green plants use sunlight, water and carbon dioxide to make food.', pages: [3] },
      { word: 'ventilation', definition: 'The movement of fresh air through a space to control heat and dampness.', pages: [7, 12] },
      { word: 'humidity', definition: 'The amount of invisible water vapour held in the air.', pages: [8] },
      { word: 'irrigation', definition: 'A system for supplying measured water to farm crops; drip irrigation waters the roots directly.', pages: [9] },
      { word: 'profit', definition: 'The money left over from sales after every business cost has been subtracted.', pages: [12] },
    ],
    teacherGuide: {
      overview:
        'Set on a vegetable farm near Dawhenya on the Accra Plains, this Primary 5–6 story teaches the science and economics of tropical greenhouse farming: photosynthesis, rain and pest protection, the critical scientific distinction between a physical greenhouse structure and the planetary atmospheric greenhouse effect, tropical ventilation and humidity management, drip irrigation, integrated pest management, and a verified Ghana cedi farm budget.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain how a greenhouse controls growing conditions (sunlight for photosynthesis, shelter from heavy rain, drip irrigation for roots, mesh netting against pests).',
        'Distinguish clearly between how a farm greenhouse traps warm air physically (suppressing convection/wind) and how Earth’s atmospheric greenhouse effect works (gases absorbing and re-emitting infrared radiation).',
        'Explain realistic limitations and trade-offs: poor ventilation causes severe overheating in Ghana’s climate, pests can still enter without strict hygiene, and construction/maintenance costs require careful budgeting.',
        'Calculate total costs (1,000 cedis), revenue (1,600 cedis), and net profit (600 cedis).',
      ],
      subjectLinks: [
        { subject: 'Science (Upper Primary)', link: 'Photosynthesis, plant growth conditions, water conservation, and the greenhouse effect.', status: 'to-verify' },
        { subject: 'Mathematics (Upper Primary)', link: 'Multiplication, addition, subtraction, and financial literacy (revenue, cost, profit).', status: 'to-verify' },
        { subject: 'Our World Our People / Agriculture', link: 'Sustainable farming, agricultural technology, and entrepreneurship in Ghana.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "Have you ever sat inside a parked car or trotro with the windows rolled up in the sun? What happened to the temperature inside, and what happened when you opened the windows?"',
      ],
      whileReading: [
        'Pause after page 6 to review the difference between a roofed farm greenhouse and Earth’s atmosphere.',
        'Pause after page 12 to write Uncle Ofori’s budget on the board and check every number together.',
      ],
      afterReading: [
        'Have learners list three advantages of a greenhouse and three real challenges or costs a farmer must manage to succeed.',
      ],
      discussion: [
        'Why is a greenhouse designed for cold European winters dangerous for tomato plants in tropical Ghana unless it has high vents and mesh sides?',
        'Why does drip irrigation save water and reduce leaf diseases compared to splashing water over the whole plant?',
        'Why would a farmer fail if they counted the 1,600 cedis of tomato sales as pure profit without setting aside money for seeds, water, labour, and net repairs?',
      ],
      reflection: [
        'What crop grown in your community could benefit from better water management or pest protection?',
      ],
      mathsExtension: [
        {
          task: 'Verify Uncle Ofori’s costs: 300 cedis (seeds/compost) + 250 cedis (water/nutrients) + 250 cedis (labour/maintenance) + 200 cedis (frame repair reserve). What is the total cost?',
          answer: '300 + 250 + 250 + 200 = 1,000 cedis.',
        },
        {
          task: 'If a storm tore a section of side netting that cost 150 cedis to repair out of the 600-cedi profit, how much profit would remain?',
          answer: '600 − 150 = 450 cedis.',
        },
      ],
      differentiation: {
        support: [
          'Use two clear plastic cups outdoors (one completely sealed and one with small air holes near the top and sides) to feel why ventilation matters.',
        ],
        stretch: [
          'Design a simple seasonal budget for a school garden bed growing kontomire or okra, listing expected costs and expected sales.',
        ],
      },
      culturalNotes: [
        'Greenhouse vegetable production (especially tomatoes, bell peppers, and cucumbers) has expanded around Dawhenya, Dodowa, Kumasi, and Youth in Greenhouse Enterprise initiatives in Ghana.',
        'Kojo, Ama, and Ofori are Akan names.',
      ],
      localiseThis: [
        'Connect to local irrigation schemes (such as Dawhenya, Kpong, Tono, or Vea) or school agricultural plots in your district.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Physical greenhouses warm primarily by suppressing convective air mixing with the outside atmosphere, whereas the planetary greenhouse effect is driven by radiative absorption and re-emission by greenhouse gases (CO2, H2O, CH4).',
          'In tropical climates, passive roof-and-side ventilation and insect-exclusion netting are essential to keep daytime temperatures below ~32–35 °C where tomato pollen viability drops.',
          'Drip irrigation significantly increases water-use efficiency and reduces foliar fungal pathogens compared to overhead watering.',
        ],
        whatWeAreStillDiscovering: [
          'Agronomists in Ghana are breeding heat-tolerant tomato varieties and testing solar-powered cooling fans and locally made cocopeat growing media to lower greenhouse startup costs for young farmers.',
        ],
      },
      investigation: {
        title: 'Test How Ventilation Controls Heat in a Mini-Greenhouse',
        materials: [
          'Three identical clear plastic bowls or cut clear plastic bottles',
          'Three small strips of cardboard or soil beds',
          'A sunny windowsill or outdoor table',
          'A classroom thermometer',
        ],
        steps: [
          'Place Bowl A upside down completely closed over a cardboard base in the sun (no ventilation).',
          'Place Bowl B upside down with two small gaps propped open at the bottom and a vent hole at the top (ventilated greenhouse), and leave Base C uncovered in the open air.',
          'After 15 minutes in the sun, measure the air temperature inside Bowl A, inside Bowl B, and on open Base C.',
        ],
        whatToNotice:
          'Closed Bowl A becomes dangerously hot very quickly, while ventilated Bowl B stays sheltered from wind while keeping a moderate temperature closer to the healthy range for plants!',
        safetyNote:
          'Teacher should pre-cut any vent holes in plastic bottles; do not leave sealed containers in extreme heat for long periods.',
      },
      factCheck: [
        {
          claim: 'A physical greenhouse warms primarily by preventing convective heat loss (trapping warm air), whereas the atmospheric greenhouse effect operates via infrared radiative absorption by greenhouse gases.',
          explanation: 'As demonstrated by R. W. Wood (1909) and standard atmospheric physics, a physical greenhouse suppresses air convection; atmospheric warming is governed by infrared-active gases.',
          analogyNote: 'Calling atmospheric warming the "greenhouse effect" is a historical metaphor; teachers should highlight Uncle Ofori’s explanation on pages 5–6 so pupils do not think there is a literal glass roof in the sky.',
          reference: 'IPCC Sixth Assessment Report (AR6) WGI Glossary & FAQ; American Meteorological Society Education Resources.',
        },
        {
          claim: 'In tropical climates like Ghana, tomato fruit set fails when daytime temperatures exceed ~35–38 °C, making ventilation, drip irrigation, and integrated pest scouting essential.',
          explanation: 'High heat (>35 °C) impairs pollen germination in Solanum lycopersicum; tropical net-houses require passive ridge ventilation and IPM scouting.',
          reference: 'FAO (2017). Good Agricultural Practices for Greenhouse Vegetable Production in the Mediterranean and Tropical Regions; CSIR–Crops Research Institute (Ghana) Vegetable Production Guides.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Clear, encouraging Ghanaian English storyteller (`Kore`) for Primary 5–6.',
      pace: 'Medium (about 125 words per minute).',
      notes: [
        'Use phonetic hints for Kojo, Ofori, and Ama while keeping standard written spellings.',
      ],
    },
    music: 'Optional light farm morning acoustic guitar, off by default.',
    culturalNotes: [
      'Grounded in real greenhouse vegetable farming on the Accra Plains (Dawhenya) with realistic Ghanaian costs and trade-offs.',
    ],
    reviewQuestions: [
      'All budget arithmetic (300 + 250 + 250 + 200 = 1,000; 80 × 20 = 1,600; 1,600 − 1,000 = 600) is verified.',
    ],
  },

  // ====================================================================================================================
  // 4. Akosua's Prayer and the Unfinished Homework (Primary 4-6, 10 pages, Faith in God, Diligence, Responsibility & Service)
  // ====================================================================================================================
  {
    key: 'akosuas-prayer-and-the-unfinished-homework',
    set: 'extension',
    title: 'Akosua’s Prayer and the Unfinished Homework',
    summary:
      'Ten-year-old Akosua believes deeply in God as Supreme and prays earnestly for exam success, yet leaves her mathematics and science workbook unfinished. Her grandmother Nana Esi lovingly helps her see how genuine faith inspires diligence, preparation, humility and service to others.',
    classification: base({
      classIds: ['primary-4', 'primary-5', 'primary-6'],
      ageMin: 9,
      ageMax: 12,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['moral', 'family', 'school-life', 'educational'],
      themes: ['family', 'school', 'identity', 'helping-others'],
      objectives: ['responsibility', 'perseverance', 'honesty', 'respect', 'emotional-intelligence', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'proverb'],
      estimatedDurationSec: 340,
    }),
    palette: ['#fef3c7', '#7c3aed'],
    characters: [
      'Akosua: a ten-year-old Ghanaian girl in Primary 5, neat braided hair tied with a purple ribbon, wearing a lavender blouse and navy skirt at home (and a brown-and-yellow school uniform at school).',
      'Nana Esi: Akosua’s loving Christian grandmother in her sixties, silver-streaked hair under a warm gold headscarf, wearing a purple-and-gold wax-print dress, gentle and wise.',
      'Amina: Akosua’s ten-year-old classmate and friend, wearing the school uniform with a neat white hijab, kind and encouraging.',
      'Tetteh: their ten-year-old classmate, wearing the brown-and-yellow school uniform and glasses.',
    ],
    pages: [
      {
        text: 'Every evening in their warm compound house in Sunyani, ten-year-old Akosua gathered with her parents and her grandmother, Nana Esi, for family devotion. They sang hymns of gratitude and thanked God, the Supreme Creator of heaven and earth, for life, health and the gift of learning.',
        alt: 'Akosua sits warmly with her grandmother Nana Esi and her parents in their living room during evening family prayer and gratitude.',
        motif: '🙏🏠',
        brief: 'Warm evening living room in Ghana: Akosua (10, purple hair ribbon, lavender blouse, navy skirt) sitting peacefully with Nana Esi (gold headscarf, purple-and-gold wax-print dress) and her parents in reverent family prayer.',
        narration: 'Warm, reverent and peaceful opening.',
      },
      {
        text: 'After prayers on Tuesday night, Nana Esi reminded her, ‘Akosua, your mid-term mathematics and science test is on Thursday. Have you finished your fraction problems and your science revision?’ ‘Not yet, Grandma,’ said Akosua, watching cartoons on television and playing with her skipping rope. ‘Do not worry! I will pray very hard tonight, and God will help me get every question right.’',
        alt: 'Akosua holds a skipping rope in the living room while her closed mathematics workbook sits untouched on the table.',
        motif: '📺📕',
        brief: 'Akosua holding a skipping rope and smiling toward the television while her mathematics workbook and pencil sit closed on the wooden table beside her; Nana Esi looks on with gentle concern.',
        narration: 'Gentle, loving tone for Nana Esi; cheerful overconfidence for Akosua.',
      },
      {
        text: 'Before bed, Akosua knelt beside her mattress and prayed with all her heart: ‘Dear God, You know everything in the universe. Please help me pass my practice quiz tomorrow with top marks. Amen.’ She went to sleep without opening her mathematics exercise book or reviewing her science notes.',
        alt: 'Akosua kneels peacefully beside her bed in prayer while her schoolbag and unopened books rest on the desk behind her.',
        motif: '🌙🙏',
        brief: 'Soft lamplit bedroom: Akosua kneeling sincerely by her bedside in prayer, while on her desk behind her, her schoolbooks remain closed in a neat stack.',
        narration: 'Sincere and gentle, never mocking her prayer.',
      },
      {
        text: 'On Wednesday morning, the teacher gave a short practice quiz to check who was ready for Thursday’s examination. Akosua stared at the first question: Add one-half and one-quarter. She had skipped the lesson exercises on common denominators! Her pencil stayed still, and her eyes filled with tears when she got only four out of ten.',
        alt: 'At her school desk, Akosua looks sadly at her practice quiz paper while holding her pencil.',
        motif: '✏️😢',
        brief: 'Classroom scene: Akosua in her brown-and-yellow school uniform sitting at her desk looking down sadly at her practice paper (no readable text or numbers), while classmates write quietly.',
        narration: 'Quiet disappointment and confusion.',
      },
      {
        text: 'That afternoon on the veranda, Akosua showed her practice paper to Nana Esi with trembling lips. ‘Grandma, I prayed so hard last night, and I truly believe in God! Why didn’t I know the answers today? Did God not hear my prayer?’',
        alt: 'On the shady veranda, Akosua holds out her quiz paper to Nana Esi, who puts a comforting arm around her shoulders.',
        motif: '👵💛',
        brief: 'Shaded home veranda with potted plants: Nana Esi sitting on a wooden bench with a loving arm around Akosua’s shoulder as Akosua shows her practice sheet.',
        narration: 'Tender, honest confusion from Akosua.',
      },
      {
        text: 'Nana Esi hugged her warmly and pointed to the small maize and garden-egg patch in their backyard. ‘God heard every word of your prayer, Akosua, and God loves you deeply. Look at our garden. God created the sun, the rain and the rich soil, which no human being could ever make. But what would happen if I prayed for a harvest and left the seeds locked inside the cupboard without planting, watering or weeding?’',
        alt: 'Nana Esi points toward the green backyard garden of maize and garden eggs while speaking gently to Akosua.',
        motif: '🌱☀️',
        brief: 'From the veranda, Nana Esi pointing gently toward their thriving backyard garden of green maize stalks and white garden-egg plants in the afternoon sun.',
        narration: 'Warm, wise, unhurried grandparent storytelling.',
      },
      {
        text: '‘Nothing would grow!’ said Akosua softly. ‘Exactly,’ smiled Nana Esi. ‘Faith in God is never an excuse to leave our work undone. God gave you a bright mind, caring teachers, books and time. When we pray for wisdom, we honour God by opening our books, practising diligently, asking for help when we do not understand, and taking proper medicine and rest when we are unwell.’',
        alt: 'Akosua listens attentively to Nana Esi as they open her mathematics workbook together on the veranda table.',
        motif: '📖💡',
        brief: 'Nana Esi and Akosua sitting at the veranda table opening the mathematics workbook and pencil case together, with Akosua nodding thoughtfully.',
        narration: 'Clear, uplifting emphasis on how prayer and diligent preparation belong together.',
      },
      {
        text: '‘And remember something very important, Akosua,’ Nana Esi added gently. ‘In life, even when people have deep faith and work very hard, they can still face illness, money struggles or hard days. We must never judge anyone or think that poverty or trouble means a person lacks faith. Instead, true faith moves us to be humble, honest, hardworking and kind to everyone who needs help.’',
        alt: 'Nana Esi holds Akosua’s hands warmly as they talk on the veranda.',
        motif: '🤝❤️',
        brief: 'Close warm portrait of Nana Esi holding Akosua’s hands across the table, both smiling with kindness and understanding.',
        narration: 'Gentle, compassionate clarity on dignity and empathy.',
      },
      {
        text: 'With fresh determination, Akosua invited her classmates Amina and Tetteh to study together under the mango tree. Amina, who was Muslim, and Akosua, who was Christian, respected each other’s faith and loved learning side by side. Together they converted one-half into two-quarters, added one-quarter to get three-quarters, and quizzed each other on science until every step made sense!',
        alt: 'Under a mango tree, Akosua, Amina in her neat white hijab, and Tetteh study fractions and science together.',
        motif: '🌳📚',
        brief: 'Shaded bench under a mango tree: Akosua, her friend Amina (wearing a neat white hijab over her school uniform), and Tetteh (wearing glasses) happily working through fraction diagrams in their notebooks together.',
        narration: 'Warm, cooperative energy. Read the fraction steps clearly: "two-quarters plus one-quarter equals three-quarters".',
      },
      {
        text: 'That night, after finishing every practice problem and packing her ruler and pencils, Akosua knelt to pray again: ‘Thank You, Lord, for the mind You gave me, for Grandma’s wisdom, and for my friends. Help me remember what I have studied and use what I learn to serve others.’ On Thursday, she wrote her examination with a calm, honest heart and a bright smile. The end.',
        alt: 'In the classroom on Thursday morning, a calm and prepared Akosua writes her examination with a confident smile.',
        motif: '🌟✍️',
        brief: 'Bright Thursday morning classroom: Akosua sitting calmly at her desk with her ruler and pencil, writing her test paper with a peaceful, confident smile.',
        narration: 'Peaceful, grateful, and inspiring close. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'faith-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Akosua struggle on Wednesday’s practice quiz even though she had prayed the night before?',
        options: [
          'She left her workbook closed instead of studying and practising',
          'The teacher wrote the questions in a secret language',
          'Her pencil broke before the quiz started',
          'Prayer is not allowed on school days',
        ],
        correctIndex: 0,
        explanation: 'Akosua prayed sincerely, but she had skipped her fraction and science practice instead of preparing diligently.',
      },
      {
        id: 'faith-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Nana Esi’s garden comparison teach Akosua about faith and responsibility?',
        options: [
          'God gives us minds and abilities, and we honour God by studying hard',
          'Farmers only need to pray and never need to plant seeds or weed the soil',
          'Studying hard means we no longer need to be thankful or humble',
          'Only adults need to prepare for their work',
        ],
        correctIndex: 0,
        explanation: 'Just as a farmer trusts God while planting and tending seeds, a student honours God by combining prayer with diligent study.',
      },
      {
        id: 'faith-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'What important truth did Nana Esi share about people who face poverty, illness or hard times?',
        options: [
          'Hardships happen to faithful people too; never blame trouble on weak faith',
          'Good people never experience any difficult days or sickness',
          'Anyone who struggles with money must have forgotten to pray',
          'We should ignore classmates who need help with their lessons',
        ],
        correctIndex: 0,
        explanation: 'Nana Esi explained that difficulties do not mean a person lacks faith; true faith inspires humility, compassion, and service.',
      },
      {
        id: 'faith-v1',
        type: 'vocabulary',
        afterPage: 9,
        word: 'diligently',
        definition: 'With steady, careful effort and attention to one’s work.',
        distractors: [
          'Carelessly and in a big hurry',
          'Only when someone is offering a prize',
        ],
      },
      {
        id: 'faith-pred',
        type: 'prediction',
        afterPage: 9,
        prompt: 'How did studying together with Amina and Tetteh help all three classmates prepare better than studying alone?',
      },
      {
        id: 'faith-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put Akosua’s journey of growth in order.',
        items: [
          'Akosua prays for top marks but leaves her homework unfinished.',
          'She struggles on the practice quiz and asks Nana Esi why.',
          'Nana Esi explains how faith and diligent preparation work together.',
          'Akosua studies with Amina and Tetteh, then prays with gratitude.',
        ],
      },
      {
        id: 'faith-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did Akosua’s prayer on Wednesday night differ from her prayer on Tuesday night, and how did she feel on Thursday morning?',
        feelingOptions: ['Grateful', 'Prepared', 'Humble', 'Calm'],
      },
    ],
    glossary: [
      { word: 'devotion', definition: 'Time set aside by a family or person for prayer, worship and gratitude to God.', pages: [1] },
      { word: 'gratitude', definition: 'A warm feeling of thankfulness and appreciation.', pages: [1] },
      { word: 'denominators', definition: 'The bottom numbers in fractions that show how many equal parts a whole is divided into.', pages: [4] },
      { word: 'diligently', definition: 'Working carefully, steadily and thoroughly without giving up.', pages: [7] },
      { word: 'humble', definition: 'Modest and respectful, not proud or looking down on others.', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'Set in Sunyani, this Primary 4–6 character and values story portrays a Ghanaian Christian family that reveres God as Supreme while teaching a vital life lesson: genuine faith inspires diligence, honesty, preparation, and service, never replacing study, planning, or medical care. It also models warm interfaith respect between Christian and Muslim classmates and explicitly affirms that poverty or misfortune never results from insufficient faith.',
      lessonMinutes: 40,
      learningGoals: [
        'Explain how faith, gratitude, and personal responsibility (studying, planning, asking questions) work together harmoniously.',
        'Demonstrate honesty, humility, and perseverance when correcting a mistake.',
        'Practice mutual respect and teamwork across Ghana’s religious diversity.',
        'Add simple fractions with unlike denominators (1/2 + 1/4 = 2/4 + 1/4 = 3/4).',
      ],
      subjectLinks: [
        { subject: 'Our World Our People / Religious and Moral Education', link: 'Commitment to God, responsibility, diligence, humility, and peaceful coexistence.', status: 'to-verify' },
        { subject: 'Mathematics (Upper Primary)', link: 'Adding fractions with related denominators (halves and quarters).', status: 'to-verify' },
        { subject: 'English Language', link: 'Character development, cause-and-effect comprehension, and reflective discussion.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If a football team wants to win a match on Saturday, what do they do from Monday to Friday to get ready?"',
      ],
      whileReading: [
        'Pause after page 6 to discuss Nana Esi’s garden analogy: what gifts come from nature/God, and what work belongs to the farmer?',
        'Pause after page 9 to work out the fraction problem on the board: 1/2 = 2/4, and 2/4 + 1/4 = 3/4.',
      ],
      afterReading: [
        'Compare Akosua’s two prayers (page 3 vs page 10) and discuss how her understanding of responsibility grew.',
      ],
      discussion: [
        'Why did Nana Esi tell Akosua that God heard her prayer and loved her, while still explaining why she needed to open her workbook?',
        'Why is it wrong and unkind to blame someone’s illness or financial hardship on a lack of faith?',
        'How did Akosua, Amina, and Tetteh show that classmates of different religious backgrounds can be wonderful study partners and friends?',
      ],
      reflection: [
        'What is one goal you are hoping for this term, and what daily habit will you practice this week to prepare for it?',
      ],
      mathsExtension: [
        {
          task: 'On Wednesday’s practice quiz, Akosua needed to add 1/2 + 1/4. Convert 1/2 into quarters and find the sum.',
          answer: '1/2 = 2/4; 2/4 + 1/4 = 3/4.',
        },
        {
          task: 'If Akosua studies for 3/4 of an hour on Wednesday and 1/4 of an hour on Thursday morning, how many hours did she study in total?',
          answer: '3/4 + 1/4 = 4/4 = 1 whole hour (60 minutes).',
        },
      ],
      differentiation: {
        support: [
          'Fold a rectangular strip of paper in half, then fold it in half again to show 4 equal quarters so learners can see visually that 1/2 equals 2/4.',
        ],
        stretch: [
          'Write a short personal study timetable for the week balancing homework, household chores, rest, and helping a classmate.',
        ],
      },
      culturalNotes: [
        'Evening family devotion and morning prayers are cherished traditions in many Ghanaian homes, alongside peaceful everyday friendships among Christian, Muslim, and traditional neighbours.',
        'Akosua and Esi are Akan names; Amina is a common Muslim name; Tetteh is a Ga-Dangme name.',
      ],
      localiseThis: [
        'Encourage learners to share proverbs in Twi, Ewe, Ga, Dagbani, or English about diligence, preparation, and humility.',
      ],
    },
    narrationPlan: {
      voice: 'Warm, reverent, and encouraging Ghanaian English storyteller (`Kore`) for Primary 4–6.',
      pace: 'Medium (about 120 words per minute).',
      notes: [
        'Use phonetic hints for Akosua and Esi while preserving standard written spellings.',
      ],
    },
    music: 'Optional gentle acoustic guitar and soft piano reflection, off by default.',
    culturalNotes: [
      'Affirms belief in God as Supreme while honouring Ghana’s religious diversity and teaching that faith inspires diligence, responsibility, and compassion.',
    ],
    reviewQuestions: [
      'Confirm that the balance of reverence for God, practical study responsibility, and interfaith respect aligns with RME / OWOP expectations.',
    ],
  },

  // ====================================================================================================================
  // 5. Efua and the Business That Almost Failed (JHS 1-3, 12 pages, Revenue vs Profit, Fixed/Variable Costs, Cash Flow)
  // ====================================================================================================================
  {
    key: 'efua-and-the-business-that-almost-failed',
    set: 'extension',
    title: 'Efua and the Business That Almost Failed',
    summary:
      'In this sequel to Efua’s Honest Business, thirteen-year-old Efua sells a record one hundred packs of groundnut cakes in a single week, yet her cash tin runs short when she goes to restock! With Nana Ama and Auntie Dede, she learns to separate revenue, fixed and variable costs, profit, and cash flow.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['realistic-fiction', 'school-life', 'educational'],
      themes: ['money-and-enterprise', 'leadership', 'peer-pressure', 'community'],
      objectives: ['financial-literacy', 'critical-thinking', 'problem-solving', 'reasoning', 'honesty', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-food', 'market', 'local-names'],
      estimatedDurationSec: 440,
    }),
    palette: ['#fff7ed', '#ea580c'],
    characters: [
      'Efua: a thirteen-year-old Ghanaian JHS student in a neat blue-and-white school uniform (or yellow apron when baking), practical, honest and determined.',
      'Nana Ama: Efua’s wise grandmother in her sixties, wearing a warm patterned cloth and headwrap.',
      'Auntie Dede: an experienced market trader who sells groundnuts and mentors Efua, wearing a vibrant green-and-gold dress.',
      'Kwabena: Efua’s confident classmate in JHS uniform, quick to suggest risky shortcuts.',
    ],
    pages: [
      {
        text: 'Ever since thirteen-year-old Efua refused to cut corners on her crunchy groundnut cakes, word of her honest quality had spread across town. Now two school canteens and the Saturday community football club wanted her nkate cakes! In one busy week, Efua and her grandmother Nana Ama roasted, wrapped and delivered a record one hundred packs at two cedis per pack.',
        alt: 'Efua and Nana Ama pack neat trays of golden groundnut cakes (nkate cake) in their clean kitchen.',
        motif: '🥜📦',
        brief: 'Warm Ghanaian kitchen: Efua (13, yellow apron over blue-and-white dress) and Nana Ama (patterned cloth and headwrap) packing 100 neat wrapped portions of golden groundnut cakes into trays.',
        narration: 'Warm, upbeat continuation of Efua’s journey. Clear pronunciation of "Efua", "Nana Ama", and "nkate".',
      },
      {
        text: 'On Friday afternoon, Efua wrote in her notebook: One hundred packs times two cedis equals two hundred cedis! ‘Nana!’ Efua cheered, dancing around the veranda. ‘Last month we sold twenty packs a week, and now we have made two hundred cedis of profit! Our business is booming!’',
        alt: 'Efua holds up her notebook happily on the veranda while Nana Ama watches with a gentle, knowing smile.',
        motif: '🎉📓',
        brief: 'Veranda scene: Efua holding up her notebook with a huge celebratory smile while Nana Ama sits on a stool watching her with a calm, thoughtful expression.',
        narration: 'Excited and triumphant for Efua.',
      },
      {
        text: 'Saturday morning arrived, and Efua walked to the market to buy groundnuts, sugar and wrappers for the new week’s orders from Auntie Dede. But when Efua opened her money tin at home before leaving, her smile vanished. Inside lay only a few notes, nowhere near two hundred cedis! Even worse, she needed one hundred and ten cedis just for raw ingredients, and she did not have enough cash in the tin!',
        alt: 'Efua stares in shock into her nearly empty metal cash tin on the kitchen table.',
        motif: '🥫😮',
        brief: 'Close medium shot of Efua looking worriedly into a small open metal cash tin on the wooden table containing only a few cedi notes, while Nana Ama walks over.',
        narration: 'Sudden drop from excitement to shock and confusion.',
      },
      {
        text: '‘Did someone steal from my tin?’ Efua asked in panic. Nana Ama sat down beside her and opened a fresh ruled ledger book. ‘Nobody stole a pesewa, Efua. You have just discovered the most important lesson in business: high sales do not automatically mean high profit, and revenue is not the same as cash in your hand. Let us trace every cedi together.’',
        alt: 'Nana Ama opens a clean ruled ledger book on the table beside Efua and her receipts.',
        motif: '📒👵',
        brief: 'Nana Ama sitting calmly with Efua at the table, opening a large ruled accounting ledger beside small paper receipts and a calculator.',
        narration: 'Calm, reassuring authority from Nana Ama.',
      },
      {
        text: '‘First,’ said Nana Ama, ‘the two hundred cedis from selling one hundred packs at two cedis each is your revenue, the total sales price before any expenses are paid. Confusing revenue with profit is why many growing businesses fail! To find your true profit, we must subtract both your variable costs and your fixed costs.’',
        alt: 'Efua writes the heading Revenue at the top of her ledger page while listening to Nana Ama.',
        motif: '✏️📊',
        brief: 'Close view of Efua writing neatly in her ledger book with a ruler and pen (no readable text on the image) as Nana Ama points to the top line.',
        narration: 'Clear distinction between "revenue", "variable costs", and "fixed costs".',
      },
      {
        text: '‘Variable costs are expenses that go up with every pack you make,’ Nana Ama explained. ‘This week, groundnuts, sugar and clean wrappers cost one cedi and ten pesewas per pack. For one hundred packs, that was one hundred and ten cedis. Plus, when Wednesday’s heavy rainstorm flooded the footpath, you paid thirty cedis for a taxi so the school order would not get soaked. One hundred and ten plus thirty equals one hundred and forty cedis in variable costs.’',
        alt: 'Efua adds up her ingredient and rainy-day transport receipts on her calculator.',
        motif: '🧮🚕',
        brief: 'Efua pressing buttons on a desktop calculator beside sacks of groundnuts and small paper receipts while Nana Ama checks the figures.',
        narration: 'Read the numbers clearly: "one hundred and ten plus thirty equals one hundred and forty cedis".',
      },
      {
        text: '‘What are fixed costs?’ asked Efua. ‘Fixed costs are regular business expenses you must pay every week even if your sales go up or down,’ said Nana Ama. ‘This week you rented the Saturday stall table and contributed to our kitchen charcoal and electricity, which cost twenty-five cedis in total. Adding one hundred and forty cedis of variable costs and twenty-five cedis of fixed costs gives one hundred and sixty-five cedis in total expenses!’',
        alt: 'Nana Ama points to the two cost columns in the ledger as Efua totals 140 plus 25 to get 165 cedis.',
        motif: '📋💡',
        brief: 'Nana Ama pointing to two neat columns in the open ledger while Efua writes the total with an expression of sudden understanding.',
        narration: 'Clear step-by-step arithmetic: "one hundred and forty plus twenty-five gives one hundred and sixty-five cedis".',
      },
      {
        text: 'Efua subtracted one hundred and sixty-five cedis of total expenses from the two hundred cedis of revenue. ‘My actual profit for the week was thirty-five cedis, not two hundred!’ she gasped. ‘Wait, Nana, if I earned thirty-five cedis in profit, why does my tin have less cash than I need to buy next week’s groundnuts?’',
        alt: 'Efua looks puzzled as she compares her ledger profit of 35 cedis with the small amount of cash in her tin.',
        motif: '🤔💵',
        brief: 'Efua holding her ledger in one hand and looking into the cash tin with the other, asking Nana Ama a thoughtful question.',
        narration: 'Crucial pivot from accounting profit to cash flow!',
      },
      {
        text: 'At the market, Auntie Dede listened to Efua’s puzzle and nodded knowingly. ‘That is the difference between accounting profit and cash flow, Efua! Did every customer pay you in cash this week?’ Efua clapped her hand to her forehead. ‘No! The Hilltop School canteen took thirty packs worth sixty cedis on credit, promising to pay at the end of the month!’',
        alt: 'At the market stall, Auntie Dede explains cash flow to Efua, who suddenly remembers the unpaid 60-cedi credit order.',
        motif: '🏪💡',
        brief: 'Busy Ghanaian market stall with sacks of groundnuts: Auntie Dede (vibrant green-and-gold dress) speaking warmly to Efua, who claps a hand to her forehead in sudden realization.',
        narration: 'Aha-moment energy on "difference between accounting profit and cash flow".',
      },
      {
        text: '‘Let us check your cash flow,’ said Auntie Dede. ‘Out of two hundred cedis in sales, sixty cedis is still sitting in the canteen’s pocket, so you only collected one hundred and forty cedis in actual cash. Yet you already paid out one hundred and sixty-five cedis in cash for ingredients, transport and stall rent! You had a twenty-five-cedi cash shortfall, plus you spent ten cedis on snacks when you thought you were rich!’',
        alt: 'Auntie Dede uses three small bowls of groundnuts on her counter to show Cash In, Cash Out, and Unpaid Credit.',
        motif: '🥣🥜',
        brief: 'Auntie Dede arranging three small wooden bowls on her market counter to illustrate Cash In, Cash Out, and Credit Owed for Efua.',
        narration: 'Clear, practical breakdown of the cash-flow crunch (`200 − 60 = 140` cash in vs `165` cash out).',
      },
      {
        text: 'On the way home, Efua’s classmate Kwabena rode by on his bicycle. ‘If costs are high, Efua, just put fewer groundnuts in each pack and print a fancy label saying Made with Pure Wild Honey even if it is plain sugar!’ Efua shook her head firmly. ‘Never, Kwabena. Dishonest marketing destroys trust. I will fix my business with real financial management, not lies.’',
        alt: 'Along the roadside, Kwabena leans on his bicycle suggesting a shortcut while Efua shakes her head firmly.',
        motif: '🚲✋',
        brief: 'Sunny town street: Kwabena leaning on his bicycle talking to Efua, who stands tall holding her ledger and shakes her head firmly with integrity.',
        narration: 'Sly, casual tone for Kwabena; firm, principled refusal from Efua.',
      },
      {
        text: 'With Auntie Dede’s advice, Efua made three smart changes: she required a fifty-percent cash deposit on all bulk canteen orders, joined Auntie Dede’s wholesale purchase to lower her ingredient cost to ninety pesewas per pack, and saved ten cedis every week in an emergency reserve fund for rainy days or sudden price rises. By month’s end, her ledger balanced and her business stood strong! The end.',
        alt: 'Efua, Nana Ama and Auntie Dede smile together over a balanced ledger, a full cash box and a labelled emergency reserve jar.',
        motif: '📈🌟',
        brief: 'Sunny veranda: Efua, Nana Ama and Auntie Dede smiling proudly around the table with a neat balanced ledger, trays of groundnut cakes, and a separate savings jar for emergencies (no text on image).',
        narration: 'Confident, satisfying conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'efua2-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'What is the difference between revenue and profit in Efua’s business?',
        options: [
          'Revenue is total sales (200 cedis); profit is what remains after costs',
          'Revenue and profit mean the exact same thing',
          'Profit is the money paid for taxi fares and charcoal',
          'Revenue is only the money kept inside a bank account',
        ],
        correctIndex: 0,
        explanation: 'Revenue is total sales (100 × 2 = 200 cedis), whereas profit is Revenue minus all Variable and Fixed Costs.',
      },
      {
        id: 'efua2-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'Efua had 200 cedis in revenue, 140 cedis in variable costs, and 25 cedis in fixed costs. What was her actual profit?',
        options: [
          '35 cedis profit (200 − 165 = 35)',
          '200 cedis profit',
          '60 cedis profit',
          '165 cedis profit',
        ],
        correctIndex: 0,
        explanation: 'Total expenses were 140 + 25 = 165 cedis; subtracting 165 from 200 cedis of revenue leaves 35 cedis of accounting profit.',
      },
      {
        id: 'efua2-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'Why did Efua run short of cash to buy ingredients even though her business made a 35-cedi profit on paper?',
        options: [
          '60 cedis was on unpaid credit, so cash in (140) was less than cash out (165)',
          'She lost her money tin on the way to school',
          'She gave away all 100 packs for free',
          'Groundnuts stopped growing on farms',
        ],
        correctIndex: 0,
        explanation: 'Selling 60 cedis on credit meant she only received 140 cedis in cash while paying 165 cedis in cash expenses, a cash-flow crunch!',
      },
      {
        id: 'efua2-v1',
        type: 'vocabulary',
        afterPage: 10,
        word: 'revenue',
        definition: 'The total income a business earns from selling its goods or services before any costs are deducted.',
        distractors: [
          'The money left over after all bills are paid',
          'A loan borrowed from a supplier at the market',
        ],
      },
      {
        id: 'efua2-pred',
        type: 'prediction',
        afterPage: 11,
        prompt: 'What would have happened to Efua’s school canteen contracts if she had followed Kwabena’s advice to fake honey labels and shrink portions?',
      },
      {
        id: 'efua2-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Put Efua’s financial turnaround in order.',
        items: [
          'Efua sells 100 packs for 200 cedis and mistakes revenue for profit.',
          'Nana Ama helps her subtract 165 cedis of variable and fixed costs.',
          'Auntie Dede shows how 60 cedis of unpaid credit caused a cash shortfall.',
          'Efua sets deposit rules, lowers bulk costs and builds an emergency reserve.',
        ],
      },
      {
        id: 'efua2-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did keeping honest records and asking experienced mentors help Efua turn a scary mistake into wisdom?',
        feelingOptions: ['Resilient', 'Honest', 'Capable', 'Wise'],
      },
    ],
    glossary: [
      { word: 'revenue', definition: 'Total money received from selling goods or services before subtracting any expenses.', pages: [4, 5, 8] },
      { word: 'variable', definition: 'In business, variable costs are expenses like raw materials that change with the number of items produced.', pages: [5, 6, 7] },
      { word: 'fixed', definition: 'In business, fixed costs are regular expenses like stall rent that stay the same each week regardless of sales volume.', pages: [5, 7] },
      { word: 'credit', definition: 'An arrangement where a customer receives goods now and agrees to pay for them later.', pages: [9] },
      { word: 'reserve', definition: 'Money saved and set aside by a business to handle unexpected emergencies or price increases.', pages: [12] },
    ],
    teacherGuide: {
      overview:
        'Serving as both a standalone JHS entrepreneurship story and a direct sequel to Efua’s Honest Business, this 12-page story teaches essential real-world financial management: why sales growth can trigger a cash-flow crisis, how to separate revenue from variable and fixed costs, how credit sales affect cash flow versus accounting profit, why emergency reserves matter for external shocks (like rainstorms or price rises), and why ethical marketing outperforms deception.',
      lessonMinutes: 45,
      learningGoals: [
        'Distinguish clearly between revenue (total sales), expenses (variable + fixed costs), and net profit.',
        'Explain the difference between accounting profit and cash flow, showing how unpaid credit sales can starve a profitable business of working capital.',
        'Calculate unit variable costs, total costs, net profit, and net cash flow from a realistic Ghana cedi scenario.',
        'Evaluate ethical versus deceptive responses to rising business costs.',
      ],
      subjectLinks: [
        { subject: 'Social Studies / Career Technology / Business (JHS)', link: 'Entrepreneurship, bookkeeping, cost pricing, cash flow, and business ethics.', status: 'to-verify' },
        { subject: 'Mathematics (JHS)', link: 'Financial arithmetic: revenue, cost, profit, unit cost reductions, and percentages (50% deposit).', status: 'to-verify' },
        { subject: 'English Language (JHS)', link: 'Analytical reading comprehension, business vocabulary, and ethical debate.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If a shopkeeper sells 200 cedis worth of goods in a week, did the shopkeeper make 200 cedis of profit? Why or why not?"',
      ],
      whileReading: [
        'Pause after page 8 to write Efua’s Income Statement on the board: Revenue (200) − Variable Costs (140) − Fixed Costs (25) = Profit (35).',
        'Pause after page 10 to write Efua’s Cash Flow Statement alongside it: Cash In (200 − 60 credit = 140) − Cash Out (165 expenses + 10 snacks = 175) = −35 cash change!',
      ],
      afterReading: [
        'Have learners work in pairs to calculate Efua’s new weekly profit after she lowers her ingredient cost from 1.10 cedis to 0.90 cedis per pack (see Maths Extension).',
      ],
      discussion: [
        'Why do many promising small businesses get into trouble right when their orders suddenly grow larger?',
        'How did Wednesday’s rainstorm (requiring a 30-cedi taxi) show that financial difficulties can come from unexpected external events rather than laziness?',
        'Why was requiring a 50% cash deposit on bulk canteen orders fair to both Efua and the school canteen?',
      ],
      reflection: [
        'How can separating "money coming in", "expenses to pay", and "emergency savings" help a family or student club manage money wisely?',
      ],
      mathsExtension: [
        {
          task: 'In the following week, Efua sells 100 packs at 2 cedis each (200 cedis revenue). Her wholesale ingredient cost is now 0.90 cedis per pack (90 cedis), there is no taxi emergency (0 cedis), and fixed costs are 25 cedis. What are her new total expenses and new weekly profit?',
          answer: 'Total expenses = 90 + 25 = 115 cedis; New profit = 200 − 115 = 85 cedis.',
        },
        {
          task: 'Under her new rule, the school canteen orders 30 packs (60 cedis total) and pays a 50% deposit upfront. How much cash does Efua receive immediately when the order is placed?',
          answer: '50% of 60 cedis = 30 cedis upfront.',
        },
      ],
      differentiation: {
        support: [
          'Use play cedi notes and three labelled envelopes ("Ingredients & Rent", "Unpaid IOU Note", "My Profit") to act out pages 6–10.',
        ],
        stretch: [
          'Prepare a two-column comparison table explaining 4 differences between an Income Statement (Revenue & Profit) and a Cash Flow Statement (Cash In & Cash Out).',
        ],
      },
      culturalNotes: [
        'Builds directly on the characters of Efua, Nana Ama, Kwabena, and Auntie Dede from Efua’s Honest Business while remaining completely understandable on its own.',
      ],
      localiseThis: [
        'Invite learners to identify fixed costs and variable costs for a familiar local enterprise (such as a seamstress shop, barbering salon, kenkey kitchen, or provision store).',
      ],
    },
    narrationPlan: {
      voice: 'Mature, expressive Ghanaian English storyteller (`Kore`) for JHS 1–3.',
      pace: 'Medium (about 135 words per minute).',
      notes: [
        'Fix any typo on page 3 before TTS generation and speak all cedi amounts clearly.',
      ],
    },
    music: 'No background music by default for JHS text-first focus; optional soft piano toggle.',
    culturalNotes: [
      'Demonstrates sophisticated SME bookkeeping, working-capital management, and business ethics in a Ghanaian market and school-supply context.',
    ],
    reviewQuestions: [
      'All financial calculations (100 × 2 = 200; 110 + 30 = 140; 140 + 25 = 165; 200 − 165 = 35; 200 − 60 = 140; 140 − 165 = −25) are verified.',
    ],
  },

  // ====================================================================================================================
  // 6. The Door That Remembered (JHS 1-3, 12 pages, Cape Coast Castle, Transatlantic Slave Trade, Dignity & Memory)
  // ====================================================================================================================
  {
    key: 'the-door-that-remembered',
    set: 'extension',
    title: 'The Door That Remembered',
    summary:
      'On an educational visit to Cape Coast Castle, JHS students Kojo and Esi walk with a Ghana Museums and Monuments Board educator and visitors from the African diaspora, learning why preserving the history of the transatlantic slave trade teaches human dignity, justice and our responsibility to future generations.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['historical', 'cultural', 'educational'],
      themes: ['identity', 'citizenship', 'community'],
      objectives: ['cultural-heritage', 'critical-thinking', 'respect', 'citizenship', 'reading-comprehension', 'author-purpose'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 440,
    }),
    palette: ['#1e293b', '#f59e0b'],
    characters: [
      'Kojo: a fourteen-year-old Ghanaian JHS 2 student wearing a neat burgundy-and-cream school uniform, thoughtful and observant.',
      'Esi: his thirteen-year-old classmate, braided hair tied neatly, wearing the same burgundy-and-cream school uniform and carrying a notebook.',
      'Mr Mensah: an educator and historian with the Ghana Museums and Monuments Board (GMMB) at Cape Coast Castle, wearing a cream african-print shirt and glasses.',
      'Mrs Robinson: an African-American teacher in her fifties visiting from Atlanta with her teenage son Marcus, wearing a white linen blouse and kente stole.',
    ],
    pages: [
      {
        text: 'Atlantic waves crashed against the dark coastal rocks of Cape Coast as fourteen-year-old Kojo and his classmate Esi stood before the tall whitewashed walls of Cape Coast Castle. Above the sea breeze, fishermen mended nets along the shore while school buses and international visitors gathered quietly at the entrance.',
        alt: 'Kojo and Esi stand with their class before the whitewashed walls of Cape Coast Castle overlooking the Atlantic Ocean.',
        motif: '🏰🌊',
        brief: 'Exterior view of Cape Coast Castle overlooking the Atlantic surf and rocky shore in Ghana. Kojo (14, burgundy-and-cream uniform) and Esi (13, same uniform, notebook) standing respectfully with educator Mr Mensah (cream African-print shirt, glasses).',
        narration: 'Solemn, measured and respectful opening.',
      },
      {
        text: 'Their guide, Mr Mensah from the Ghana Museums and Monuments Board, welcomed the students alongside Mrs Robinson and her teenage son Marcus, who had travelled from the United States. ‘Cape Coast Castle is an inscribed UNESCO World Heritage Site,’ Mr Mensah explained quietly. ‘We do not come here for entertainment. We come as witnesses to history, to honour human dignity and to learn the truth through preserved evidence.’',
        alt: 'In the castle courtyard, Mr Mensah welcomes Kojo, Esi, and diaspora visitors Mrs Robinson and Marcus.',
        motif: '🤝🏛️',
        brief: 'Sunlit stone courtyard of Cape Coast Castle: Mr Mensah speaking respectfully to Kojo, Esi, and African-American visitors Mrs Robinson (white blouse with kente stole) and her teenage son Marcus.',
        narration: 'Dignified, earnest tone: "We come as witnesses to history, to honour human dignity".',
      },
      {
        text: 'Inside the Castle Museum upstairs, Mr Mensah pointed to maps of pre-colonial West Africa and early Atlantic trade. ‘Long before European ships arrived, Ghanaian societies had rich agriculture, ironworking, gold mining, scholarship and governance. When Portuguese, Dutch, Swedish, Danish and British traders came to the coast in the fifteenth to seventeenth centuries, they first traded for gold and timber.’',
        alt: 'Inside the Castle Museum, Kojo, Esi and Marcus examine historical maps and West African cultural artefacts.',
        motif: '🗺️⚖️',
        brief: 'Upstairs museum gallery in Cape Coast Castle: Mr Mensah pointing to a historical display of traditional Akan goldweights, brass vessels and early maps (no readable text) as Kojo, Esi and Marcus observe.',
        narration: 'Clear historical context establishing pre-colonial West African civilisation and early gold trade.',
      },
      {
        text: '‘At this site,’ Mr Mensah continued, ‘a timber lodge built by the Swedes in sixteen fifty-three named Carolusborg was later expanded into a stone fortress and taken by the British in sixteen sixty-four. Over time, as European powers established sugar, cotton and tobacco plantations across the Americas and the Caribbean, the trade along this coast shifted to a terrible crime against humanity: the transatlantic slave trade.’',
        alt: 'Mr Mensah stands beside an archival timeline panel showing the 1653 and 1664 construction phases and Atlantic trade routes.',
        motif: '⏳📜',
        brief: 'Museum gallery: Mr Mensah pointing to an educational wall map of the Atlantic Ocean showing triangular shipping routes between West Africa, the Americas and Europe (no text labels).',
        narration: 'Steady, serious historical delivery.',
      },
      {
        text: 'Esi looked at the triangular map connecting West Africa, the Americas and Europe. ‘How could human beings be treated as cargo?’ she asked softly. ‘Greed and racism led empires and traders to deny the shared humanity of African people,’ said Mr Mensah. ‘Millions of men, women and children, including farmers, artisans, parents and youths your own age, were captured, marched to coastal forts, and separated from their families and homelands forever.’',
        alt: 'Esi, Kojo and Marcus look thoughtfully at the Atlantic map while Mrs Robinson places a comforting hand on her son’s shoulder.',
        motif: '🌍💔',
        brief: 'Close medium shot in the museum: Esi and Kojo looking thoughtfully at the map while Mrs Robinson rests a hand gently on Marcus’s shoulder.',
        narration: 'Quiet empathy and moral clarity without graphic sensationalism.',
      },
      {
        text: 'Mr Mensah led the group down the stone steps toward the lower courtyards and underground chambers. The air grew cool and dim, and the sound of the ocean waves echoed through high small vents. Everyone walked in respectful silence. ‘These stone chambers were the holding dungeons where captives waited for weeks or months in darkness before ships arrived,’ Mr Mensah said softly.',
        alt: 'The group walks in quiet, respectful silence down the stone steps toward the dimly lit lower chambers of the castle.',
        motif: '🕯️🪨',
        brief: 'Dignified, sombre architectural view of the weathered stone archway and steps leading to the lower courtyard at Cape Coast Castle, with soft light filtering from a high window as Mr Mensah, Kojo, Esi, Mrs Robinson and Marcus stand in quiet reflection.',
        narration: 'Hushed, reverent pace.',
      },
      {
        text: '‘Notice the contrast in the building’s architecture,’ said Mr Mensah as they stepped back into the light. ‘Directly above the dark lower chambers stood airy halls, the governor’s residence, and even a chapel. Preserving this real building matters because no one who stands here and sees these stones can ever deny the injustice that took place, or pretend it was gentle.’',
        alt: 'In the courtyard, Mr Mensah points upward to the upper windows built directly above the lower stone arches.',
        motif: '🏛️👁️',
        brief: 'In the castle courtyard, Mr Mensah gesturing upward toward the high whitewashed windows and balcony built above the heavy lower stone arches, as Kojo and Esi look up thoughtfully.',
        narration: 'Thoughtful emphasis on why physical preservation protects historical truth.',
      },
      {
        text: 'They walked to a heavy wooden portal facing the crashing Atlantic surf. Above the inner side hung the words Door of No Return. ‘Through this narrow doorway,’ Mr Mensah said, ‘men and women took their last steps on African soil before being forced onto boats waiting in the surf. They lost their freedom and often their birth names, yet they carried their resilience, music, wisdom and courage across the ocean.’',
        alt: 'The group stands quietly before the heavy wooden portal opening out toward the bright Atlantic Ocean.',
        motif: '🚪🌊',
        brief: 'View from inside the stone passage looking toward the open heavy wooden double doors framing the bright blue Atlantic Ocean and fishing canoes outside (no text baked into image), as the group stands in quiet tribute.',
        narration: 'Slow, deeply respectful tribute to resilience and humanity.',
      },
      {
        text: 'Mrs Robinson wiped a quiet tear as Marcus stood beside Kojo and Esi. ‘For generations in America,’ Mrs Robinson told the students, ‘my ancestors did not know which town or family they had been taken from. Coming to Ghana and standing here with you feels like reconnecting a broken thread of family history.’ Kojo and Esi reached out and shook Marcus’s hand warmly.',
        alt: 'Kojo and Esi clasp hands warmly with Marcus and Mrs Robinson beside the sunlit doorway overlooking the sea.',
        motif: '🤝🌍',
        brief: 'Warm, moving moment by the sunlit doorway: Kojo and Esi shaking hands warmly with Marcus while Mrs Robinson and Mr Mensah smile with quiet emotion.',
        narration: 'Tender warmth and solidarity between Ghanaian youths and the diaspora.',
      },
      {
        text: 'Mr Mensah guided them just outside the portal and pointed back toward the exterior archway facing the sea. ‘In nineteen ninety-eight, when Ghana marked the first Emancipation Day in Africa, elders and historians placed a sign on this outer side reading Door of Return. It proclaims that while ancestors were forced out in chains, their descendants are welcomed home in freedom, dignity and brotherhood.’',
        alt: 'Outside on the seafront rampart, Mr Mensah points back toward the exterior entrance of the portal.',
        motif: '🕊️🚪',
        brief: 'Outside on the sunlit stone sea wall above the ocean waves: Mr Mensah gesturing back toward the outer archway of the portal as sea birds glide overhead.',
        narration: 'Uplifting, dignified explanation of the "Door of Return".',
      },
      {
        text: '‘Even after Britain passed the Act of Parliament abolishing the Atlantic slave trade in eighteen zero seven and slavery across its empire in eighteen thirty-three,’ Mr Mensah explained, ‘hundreds of thousands of people had already suffered, and colonial rule followed later. That is why every generation must guard human rights, equal justice and education.’',
        alt: 'Kojo and Esi take notes in their history notebooks while sitting on the stone rampart overlooking the coast.',
        motif: '📓⚖️',
        brief: 'Kojo and Esi writing thoughtfully in their notebooks on the sunlit courtyard bench while Marcus and Mr Mensah talk beside them.',
        narration: 'Clear historical dates ("eighteen zero seven" and "eighteen thirty-three") connected to universal human rights.',
      },
      {
        text: 'Before leaving, Esi, Kojo and Marcus stood together looking out over the bright Cape Coast bay where colourful wooden canoes rode the tide. ‘The stone walls remember the pain of the past,’ said Esi quietly, ‘so that we will build a future where every human being is treated with dignity and freedom.’ ‘Together,’ agreed Marcus and Kojo. The end.',
        alt: 'Kojo, Esi and Marcus stand side by side on the sunny terrace looking out over the peaceful Cape Coast bay and fishing canoes.',
        motif: '🌅🇬🇭',
        brief: 'Golden afternoon light at Cape Coast: Kojo, Esi and Marcus standing side by side looking out over the sparkling blue ocean and colourful wooden fishing canoes along the beach.',
        narration: 'Quietly powerful, hopeful conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'door-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'What was Cape Coast Castle originally built to trade before the transatlantic slave trade dominated the coast?',
        options: [
          'Gold and timber',
          'Cars and aeroplanes',
          'Plastic goods and petroleum',
          'Snow and ice from Europe',
        ],
        correctIndex: 0,
        explanation: 'Early European lodges on the Gold Coast initially traded in gold and timber before expanding into holding fortresses for the transatlantic slave trade.',
      },
      {
        id: 'door-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why does Mr Mensah explain that preserving physical sites like Cape Coast Castle is essential for humanity?',
        options: [
          'Preserved buildings and records stop people from denying past injustice',
          'So that movie companies can use the dungeons as playgrounds',
          'To hide what happened from students and visitors',
          'Because stone walls never need maintenance',
        ],
        correctIndex: 0,
        explanation: 'Preserving authentic UNESCO World Heritage sites protects historical truth, honours those who suffered, and educates future generations.',
      },
      {
        id: 'door-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'Why was the outer side of the sea portal symbolically named the "Door of Return" in 1998?',
        options: [
          'To welcome descendants of the diaspora back to Ghana in dignity',
          'Because merchant ships still use the doorway to load gold today',
          'To lock the museum doors during the rainy season',
          'To mark where fishermen store their nets',
        ],
        correctIndex: 0,
        explanation: 'During Ghana’s 1998 Emancipation Day observance, the exterior was designated the "Door of Return" to welcome the diaspora home in remembrance and healing.',
      },
      {
        id: 'door-v1',
        type: 'vocabulary',
        afterPage: 9,
        word: 'resilience',
        definition: 'The inner strength to endure hardship and keep one’s spirit and dignity alive.',
        distractors: [
          'A type of mortar used to build stone walls',
          'A ticket bought at a museum gate',
        ],
      },
      {
        id: 'door-pred',
        type: 'prediction',
        afterPage: 9,
        prompt: 'Why is a visit to Cape Coast Castle deeply meaningful for both Ghanaian students and visitors from the African diaspora?',
      },
      {
        id: 'door-seq',
        type: 'sequencing',
        afterPage: 11,
        prompt: 'Put these historical milestones from the story in chronological order.',
        items: [
          'West African societies develop rich gold mining, farming and governance.',
          'European powers expand coastal forts like Cape Coast Castle (1653–1664).',
          'Britain passes the 1807 Act abolishing the Atlantic slave trade.',
          'Cape Coast Castle is preserved as a UNESCO World Heritage Site.',
        ],
      },
      {
        id: 'door-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How does learning difficult history with respect help us stand up for human dignity and fairness today?',
        feelingOptions: ['Respectful', 'Empathetic', 'Responsible', 'United'],
      },
    ],
    glossary: [
      { word: 'dignity', definition: 'The inherent worth and right of every human being to be treated with respect and freedom.', pages: [2, 10, 12] },
      { word: 'fortress', definition: 'A large, heavily fortified stone building constructed for military defence and control.', pages: [4] },
      { word: 'dungeons', definition: 'Dark underground chambers where captives were held inside the coastal castles.', pages: [6] },
      { word: 'resilience', definition: 'The strength of spirit to endure suffering without losing one’s humanity and hope.', pages: [8] },
      { word: 'emancipation', definition: 'The act of setting people free from slavery or legal bondage.', pages: [10] },
    ],
    teacherGuide: {
      overview:
        'Set at Cape Coast Castle in the Central Region, this JHS 1–3 history and citizenship story models a respectful, evidence-based educational visit led by the Ghana Museums and Monuments Board (GMMB). It establishes West Africa’s pre-colonial achievements, traces the 1653 Swedish and 1664 British history of the fortress, confronts the injustice of the transatlantic slave trade without graphic sensationalism or invented survivor quotes, explains the symbolic "Door of No Return" / "Door of Return", and connects historical memory to universal human rights.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain the historical significance of Cape Coast Castle as an inscribed UNESCO World Heritage Site managed by the Ghana Museums and Monuments Board.',
        'Trace how coastal trade shifted from gold and timber to the transatlantic slave trade linking West Africa, the Americas/Caribbean, and Europe.',
        'Explain why visitors from Ghana, the African diaspora, and around the world visit Cape Coast Castle to remember and reconnect.',
        'Articulate why preserving painful historical evidence protects human rights and dignity today.',
      ],
      subjectLinks: [
        { subject: 'Social Studies / History of Ghana (JHS)', link: 'European presence on the Gold Coast, the transatlantic slave trade, abolition, diaspora relations, and human rights.', status: 'to-verify' },
        { subject: 'English Language (JHS)', link: 'Reflective and historical reading comprehension, tone, author’s purpose, and respectful discussion.', status: 'to-verify' },
        { subject: 'Religious and Moral Education / Citizenship', link: 'Human dignity, empathy, justice, and historical responsibility.', status: 'to-verify' },
      ],
      beforeReading: [
        'Locate Cape Coast in the Central Region on a map of Ghana, and display a world map showing the Atlantic Ocean between West Africa and the Americas.',
        'Establish a respectful classroom norm: we study this history quietly and seriously because it involves real human beings and families.',
      ],
      whileReading: [
        'Pause after page 3 to emphasize that West African societies had advanced metallurgy, agriculture, gold trade, and governance long before European ships arrived.',
        'Pause after page 10 to discuss the meaning of both sides of the portal: "Door of No Return" (historical reality of forced departure) and "Door of Return" (1998 Emancipation Day welcome to the diaspora).',
      ],
      afterReading: [
        'Discuss Esi’s closing sentence on page 12: how does remembering past injustice help us protect freedom and human rights today?',
      ],
      discussion: [
        'Why did Mr Mensah point out the architectural contrast between the dark lower chambers and the airy governor’s rooms and chapel directly above?',
        'Why do descendants of enslaved Africans in the Americas and the Caribbean travel thousands of kilometres to stand inside Cape Coast and Elmina Castles?',
        'How can young Ghanaians welcome diaspora visitors while also protecting and maintaining Ghana’s historical monuments?',
      ],
      reflection: [
        'What does the word "dignity" mean to you in how we treat classmates, strangers, and people from every background?',
      ],
      mathsExtension: [
        {
          task: 'The Swedish timber fort Carolusborg was built at Cape Coast in 1653, and Cape Coast Castle was inscribed on the UNESCO World Heritage List in 1979. How many years passed between 1653 and 1979?',
          answer: '1979 − 1653 = 326 years.',
        },
        {
          task: 'Britain passed the Abolition of the Slave Trade Act in 1807 and the Slavery Abolition Act in 1833. How many years separated those two laws?',
          answer: '1833 − 1807 = 26 years.',
        },
      ],
      differentiation: {
        support: [
          'Use a world map to trace the three sides of the Atlantic trade triangle and review the five glossary terms before reading.',
        ],
        stretch: [
          'Write a reflective museum journal entry from Kojo’s or Esi’s perspective explaining three reasons why UNESCO World Heritage preservation matters.',
        ],
      },
      culturalNotes: [
        'Cape Coast Castle (along with Elmina Castle and other coastal fortifications) was inscribed on the UNESCO World Heritage List in 1979 under "Forts and Castles, Volta, Greater Accra, Central and Western Regions" and is conserved by the Ghana Museums and Monuments Board (GMMB).',
        'Avoid role-playing or dramatising the suffering of enslaved captives in class; keep all activities analytical, empathetic, and respectful.',
      ],
      localiseThis: [
        'Connect to any historical monuments, museums, or heritage sites preserved by the Ghana Museums and Monuments Board in your region.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Inscribed on the UNESCO World Heritage List in 1979, Cape Coast Castle grew from a 1555 Portuguese lodge and 1653 Swedish fort (Carolusborg) into the British headquarters on the Gold Coast (1664–1877) and a major holding fortress of the transatlantic slave trade.',
          'Historians estimate that over 12.5 million African men, women, and children were forced onto transatlantic slave ships between the 16th and 19th centuries.',
        ],
        whatWeAreStillDiscovering: [
          'Archaeologists, historians, and geneticists in Ghana and the diaspora continue researching archival shipping manifests, oral histories along inland slave routes (such as Assin Manso and Salaga), and conservation methods to protect coastal stone monuments from sea-level rise and salt erosion.',
        ],
      },
      investigation: {
        title: 'Heritage Conservation Observation: How Salt Air Affects Stone and Metal',
        materials: [
          'Two small pieces of chalk or porous limestone/brick',
          'Two small iron nails (clean, handled carefully)',
          'Two shallow dishes: Dish A with plain tap water, Dish B with salty water (1 spoon of salt stirred in)',
          'Observation notebook',
        ],
        steps: [
          'Place one piece of chalk/stone and one nail in Dish A (fresh water) and the second pair in Dish B (salt water), then lift them onto paper towels to dry in the air each day for 3 days.',
          'Observe how salt crystals form inside the pores of the chalk/stone as water evaporates and how salt speeds up rust on iron.',
        ],
        whatToNotice:
          'Salt water and sea spray speed up rusting and leave salt crystals that weather porous stone and lime mortar, showing why GMMB conservators must work continually to preserve coastal monuments like Cape Coast Castle!',
        safetyNote:
          'Wash hands after handling rusty nails or salt solutions, and dispose of rusted nails safely with the teacher.',
      },
      factCheck: [
        {
          claim: 'Cape Coast Castle was expanded as Carolusborg by the Swedes in 1653, taken by the British in 1664, and inscribed as a UNESCO World Heritage Site in 1979 under the stewardship of the Ghana Museums and Monuments Board.',
          explanation: 'Historical and architectural documentation by GMMB and UNESCO World Heritage Convention (Ref. 34) confirm the 1653 Swedish construction under Heinrich Caarlof, 1664 British capture, and 1979 UNESCO inscription.',
          reference: 'UNESCO World Heritage Centre, Forts and Castles, Volta, Greater Accra, Central and Western Regions (Ref. 34); Anquandah, J. (1999). Castles & Forts of Ghana. Ghana Museums and Monuments Board; Trans-Atlantic Slave Trade Database (SlaveVoyages.org).',
        },
      ],
    },
    narrationPlan: {
      voice: 'Solemn, warm, dignified Ghanaian English storyteller (`Kore`) for JHS 1–3.',
      pace: 'Measured and unhurried (about 125 words per minute).',
      notes: [
        'Use phonetic hints for Kojo, Esi, and Mensah while keeping standard written spellings.',
      ],
    },
    music: 'No background music by default; respectful silence and clear narration.',
    culturalNotes: [
      'Presented with solemn dignity, historical accuracy, and zero sensationalism or invented survivor quotes.',
    ],
    reviewQuestions: [
      'Confirm that the distinction between UNESCO inscribed status (Cape Coast Castle, 1979) and Tentative List (Kakum, Story 1) is consistent across the batch.',
    ],
  },
];

