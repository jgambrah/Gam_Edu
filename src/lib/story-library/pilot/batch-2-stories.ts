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

export const BATCH_2_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. The Secret Beneath Lake Bosomtwe (Primary 5-6, 10 pages, Meteorite Crater, Geological Evidence, Earth History)
  // ====================================================================================================================
  {
    key: 'the-secret-beneath-lake-bosomtwe',
    set: 'extension',
    title: 'The Secret Beneath Lake Bosomtwe',
    summary:
      'Visiting Lake Bosomtwe in the Ashanti Region, Kwabena and his cousin Afia hear both the respected traditional oral history of the sacred lake and the geological evidence showing how a meteorite impact formed the crater over a million years ago.',
    classification: base({
      classIds: ['primary-5', 'primary-6'],
      ageMin: 10,
      ageMax: 12,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['science', 'cultural', 'educational'],
      themes: ['community', 'animals-and-habitats', 'school'],
      objectives: ['scientific-curiosity', 'cultural-heritage', 'critical-thinking', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 360,
    }),
    palette: ['#1d4ed8', '#15803d'],
    characters: [
      'Kwabena: an eleven-year-old Ghanaian boy in Primary 6, wearing a bright mustard-yellow polo shirt, khaki shorts and sandals, carrying a small magnifying glass and green field notebook.',
      'Afia: his ten-year-old cousin in Primary 5, wearing a coral-pink patterned top and denim skirt, braided hair with white beads, observant and curious.',
      'Nana Osei: Afia’s grandfather in Abono village, a respected elder wearing a blue-and-brown traditional cloth over his shoulder.',
      'Dr Boateng: a Ghanaian geologist from Kwame Nkrumah University of Science and Technology (KNUST), wearing a light khaki field vest, glasses and sun hat.',
    ],
    pages: [
      {
        text: 'From the high green ridge above Abono in the Ashanti Region, eleven-year-old Kwabena gasped. Below him, Lake Bosomtwe lay like a giant silver bowl surrounded by a steep, unbroken ring of forested hills. ‘Afia!’ he called to his cousin. ‘Why is this lake almost a perfect circle?’',
        alt: 'Kwabena and Afia stand on a green hillside looking down at the nearly circular blue waters of Lake Bosomtwe surrounded by forested crater hills.',
        motif: '🏞️⭕',
        brief: 'Wide view of Lake Bosomtwe from a lush green ridge. Kwabena (11, mustard-yellow polo shirt, khaki shorts, green notebook) and Afia (10, coral-pink top, denim skirt, braided hair with white beads) looking down at the circular lake.',
        narration: 'Warm and filled with wonder. Emphasise "giant silver bowl" and the question at the end.',
      },
      {
        text: 'Down by the water’s edge, their grandfather Nana Osei pointed to fishermen gliding silently across the lake on flat carved wooden planks called padua, propelling themselves with wooden hand pads. ‘In our Ashanti tradition,’ Nana Osei said gently, ‘this lake is sacred. Fishermen use wooden padua rather than iron boats or loud motors.’',
        alt: 'Nana Osei stands with Kwabena and Afia by the lakeshore, pointing toward fishermen paddling flat wooden padua planks.',
        motif: '🛶👴',
        brief: 'Lakeshore of Lake Bosomtwe. Nana Osei in blue-and-brown cloth pointing toward fishermen kneeling/sitting on flat carved wooden padua planks on the calm water, while Kwabena and Afia watch respectfully.',
        narration: 'Respectful, calm storyteller tone for Nana Osei. Clear pronunciation of "padua" and "Bosomtwe".',
      },
      {
        text: '‘Long ago,’ Nana Osei continued, ‘our ancestors told the story of a hunter named Akora Bompe from Asaman, who followed a wounded antelope into this hidden valley and discovered the great waters. That oral tradition taught our communities to respect the lake, avoid polluting it, and protect its fish for generations.’',
        alt: 'Nana Osei speaks warmly to Kwabena and Afia under a shade tree by the lake as birds fly over the water.',
        motif: '🦌🌿',
        brief: 'Close medium shot under a lakeside tree: Nana Osei gesturing warmly as he shares the traditional heritage of the lake with Kwabena and Afia, with calm water and birds behind them.',
        narration: 'Unhurried and warm, honouring the oral tradition.',
      },
      {
        text: 'Near the shoreline stood Dr Boateng, a geologist from Kumasi, examining rocks with a hand lens. Nana Osei greeted her warmly. ‘Tradition tells us how our people met and cared for the lake,’ Nana Osei told the children, ‘and Dr Boateng studies the rocks to learn how the Earth itself shaped this deep bowl long before people lived here.’',
        alt: 'Nana Osei introduces Kwabena and Afia to Dr Boateng, a geologist holding a rock sample and hand lens by the shore.',
        motif: '🪨🔍',
        brief: 'Nana Osei introducing Kwabena and Afia to Dr Boateng (khaki field vest, glasses, sun hat) who holds a rock sample and magnifying lens near the rocky lakeshore.',
        narration: 'Warm bridge between cultural respect and scientific inquiry.',
      },
      {
        text: '‘Wait,’ said Afia, looking around the steep rim of hills. ‘Some people say Lake Bosomtwe is an old volcano. Is that true?’ Dr Boateng shook her head. ‘Scientists tested that idea carefully, Afia. A volcano leaves behind volcanic lava rocks and an opening underneath. Here, there is no volcanic lava at all.’',
        alt: 'Afia points toward the ring of hills while Dr Boateng shakes her head and holds up a non-volcanic rock sample.',
        motif: '⛰️❓',
        brief: 'Afia pointing up at the circular crater rim while Dr Boateng shows Kwabena and Afia the angular rock fragments in her hand.',
        narration: 'Curious voice for Afia, then clear and reassuring for Dr Boateng.',
      },
      {
        text: '‘Instead,’ Dr Boateng explained, ‘about one point zero seven million years ago, a massive stony meteorite from space, about five hundred metres wide, hurtled through Earth’s atmosphere at tremendous speed. When it struck the ancient rocks here, the shock wave carved out a crater ten and a half kilometres wide in seconds!’',
        alt: 'Dr Boateng draws a diagram in the sand with a stick showing a meteorite striking the ground and pushing up a circular rim.',
        motif: '☄️💥',
        brief: 'Dr Boateng kneeling on the sandy shore drawing a simple visual diagram in the damp sand (a falling rock and a bowl-shaped crater rim, no words or numbers) while Kwabena and Afia look on in amazement.',
        narration: 'Exciting and vivid, while keeping the numbers clear: "one point zero seven million years ago" and "ten and a half kilometres wide".',
      },
      {
        text: 'Kwabena held up his magnifying glass. ‘How can scientists be sure a meteorite hit here if nobody was alive to see it?’ Dr Boateng smiled and handed him a speckled rock called breccia. ‘Look closely. Inside these rocks, microscopes reveal quartz crystals with tiny crisscross shock lines that only form under the extreme pressure of a cosmic impact.’',
        alt: 'Kwabena peers through his magnifying glass at a speckled impact breccia rock held by Dr Boateng.',
        motif: '🔬🪨',
        brief: 'Close-up of Kwabena looking through his magnifying glass at a speckled breccia rock in Dr Boateng’s palm, with Afia leaning in.',
        narration: 'Thoughtful question from Kwabena, then clear scientific explanation.',
      },
      {
        text: '‘There is another clue even farther away,’ Dr Boateng added. ‘The impact was so hot that it melted rock and splashed tiny droplets of natural glass high into the sky. Those glassy droplets cooled and fell across Côte d’Ivoire to our west and into the Atlantic Ocean. Geologists call them Ivory Coast tektites, and their age and chemistry match the rocks right here!’',
        alt: 'Dr Boateng shows a small dark glassy tektite pebble in a specimen box to Afia and Kwabena.',
        motif: '✨🌍',
        brief: 'Dr Boateng holding open a small padded specimen box containing a dark, smooth, teardrop-shaped glassy tektite pebble as Afia and Kwabena examine it.',
        narration: 'Build wonder at how clues hundreds of kilometres away match the crater.',
      },
      {
        text: '‘Over thousands of years,’ said Dr Boateng, ‘rainwater filled the crater. Because no river flows out of the bowl, layers of mud settled quietly at the bottom year after year. When scientists drilled deep mud cores from the lake bed, those layers acted like pages in a giant history book, showing wet and dry climate periods across West Africa for a million years.’',
        alt: 'Dr Boateng shows a photograph of striped sediment layers from the bottom of the lake while the blue crater lake sparkles behind them.',
        motif: '📊🌧️',
        brief: 'Dr Boateng holding a visual card showing horizontal light and dark mud layers (no text), with the calm blue water of Lake Bosomtwe in the background.',
        narration: 'Measured and clear. Emphasise "like pages in a giant history book".',
      },
      {
        text: 'Kwabena wrote carefully in his green notebook as the afternoon sun turned the water gold. ‘So traditional wisdom teaches us to protect Lake Bosomtwe with respect,’ said Afia, ‘and geological evidence reveals its million-year story from space!’ Nana Osei and Dr Boateng smiled together. ‘A wise mind,’ said Nana Osei, ‘listens to elders and investigates the evidence.’ The end.',
        alt: 'At golden sunset by Lake Bosomtwe, Kwabena writes in his green notebook beside Afia, Nana Osei and Dr Boateng.',
        motif: '🌅📓',
        brief: 'Golden sunset over Lake Bosomtwe. Kwabena writing in his green notebook, Afia smiling beside him, with Nana Osei and Dr Boateng standing together warmly by the shore.',
        narration: 'Warm, reflective conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'bosomtwe-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What are the traditional flat wooden planks used by fishermen on Lake Bosomtwe called?',
        options: ['Padua', 'Tektites', 'Motorboats', 'Submarines'],
        correctIndex: 0,
        explanation: 'Fishermen on Lake Bosomtwe traditionally use carved wooden planks called padua rather than iron boats or motors.',
      },
      {
        id: 'bosomtwe-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'How did the circular basin of Lake Bosomtwe actually form about 1.07 million years ago?',
        options: [
          'A stony meteorite from space struck the Earth and carved an impact crater',
          'A volcano erupted lava rocks around the village',
          'People dug the basin with iron shovels',
          'An ocean wave washed over the mountains',
        ],
        correctIndex: 0,
        explanation: 'Geological evidence shows that a meteorite about 500 metres wide struck the area 1.07 million years ago, forming a 10.5 km impact crater.',
      },
      {
        id: 'bosomtwe-v1',
        type: 'vocabulary',
        afterPage: 8,
        word: 'crater',
        definition: 'A bowl-shaped hollow in the ground formed by a meteorite impact or explosion.',
        distractors: ['A tall wooden fishing paddle', 'A type of rain cloud in the sky'],
      },
      {
        id: 'bosomtwe-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'Which two pieces of rock evidence prove that Lake Bosomtwe was formed by a meteorite impact?',
        options: [
          'Shocked quartz crystals in breccia and matching glassy Ivory Coast tektites',
          'Fresh lava streams and active steam vents around the shore',
          'Sea shells and coral reefs on the hilltops',
          'Iron anchors left at the bottom of the lake',
        ],
        correctIndex: 0,
        explanation: 'Microscopic shocked quartz in impact breccia and glassy Ivory Coast tektites splashed westward confirm a high-energy meteorite impact.',
      },
      {
        id: 'bosomtwe-pred',
        type: 'prediction',
        afterPage: 9,
        prompt: 'Why is a closed lake with no river flowing out so useful for scientists studying ancient rainfall and climate?',
      },
      {
        id: 'bosomtwe-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put the geological history of Lake Bosomtwe in order from earliest to latest.',
        items: [
          'A meteorite strikes the ancient rock about 1.07 million years ago.',
          'Melted rock droplets cool into glassy tektites and fall to the west.',
          'Rainwater fills the ten-and-a-half-kilometre crater to form a closed lake.',
          'Layers of mud build up on the lake bed, recording ancient climate changes.',
        ],
      },
      {
        id: 'bosomtwe-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did Nana Osei and Dr Boateng show respect for both cultural heritage and scientific evidence?',
        feelingOptions: ['Respectful', 'Curious', 'Thoughtful', 'Proud'],
      },
    ],
    glossary: [
      { word: 'padua', definition: 'A traditional flat carved wooden plank used by fishermen on Lake Bosomtwe.', pages: [2] },
      { word: 'geologist', definition: 'A scientist who studies rocks, soil and how the Earth was formed.', pages: [4] },
      { word: 'meteorite', definition: 'A large piece of rock or metal from space that passes through the atmosphere and hits the Earth.', pages: [6, 7] },
      { word: 'crater', definition: 'A large bowl-shaped basin in the ground carved out by a meteorite impact.', pages: [6, 9] },
      { word: 'breccia', definition: 'Rock made of broken fragments cemented together by the heat and force of an impact.', pages: [7] },
      { word: 'tektites', definition: 'Small natural glass pebbles formed when a meteorite impact melts rock and splashes it into the air.', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'Set at Lake Bosomtwe in the Ashanti Region, this story helps Upper Primary learners distinguish between respected cultural oral traditions (how communities relate to and conserve a sacred place) and empirical geological evidence (how a Pleistocene meteorite impact carved the crater 1.07 million years ago and preserved a million-year West African climate archive).',
      lessonMinutes: 45,
      learningGoals: [
        'Explain how a meteorite impact formed the Lake Bosomtwe crater approximately 1.07 million years ago.',
        'Identify real geological evidence for an impact crater: circular rim, shocked quartz in breccia, and Ivory Coast tektites.',
        'Explain how annual sediment layers at the bottom of a closed (endorheic) lake record past climate changes.',
        'Respectfully distinguish traditional cultural stories and conservation practices from testable geological explanations.',
      ],
      subjectLinks: [
        { subject: 'Science (Upper Primary)', link: 'Earth science, rocks, landforms, and evidence of past environmental change.', status: 'to-verify' },
        { subject: 'Our World Our People / Social Studies', link: 'Major physical features of Ghana (Lake Bosomtwe) and traditional environmental conservation.', status: 'to-verify' },
        { subject: 'English Language', link: 'Informational and narrative reading comprehension, scientific vocabulary.', status: 'to-verify' },
      ],
      beforeReading: [
        'Locate the Ashanti Region and Lake Bosomtwe (about 30 km south-east of Kumasi) on a map of Ghana.',
        'Ask learners: "Have you ever seen a photograph of craters on the Moon? Could a rock from space make a crater on Earth too?"',
      ],
      whileReading: [
        'Pause after page 3 to discuss how the traditional rule against iron boats and loud motors also helps protect the lake from oil pollution and overfishing.',
        'Pause after page 8 to trace the direction from Lake Bosomtwe westward to Côte d’Ivoire where tektites landed.',
      ],
      afterReading: [
        'Compare the two questions: "How did people come to revere and care for Lake Bosomtwe?" (cultural history) and "What physical process carved the 10.5 km rock basin?" (geological science).',
      ],
      discussion: [
        'Why did scientists rule out the idea that Lake Bosomtwe is a volcanic crater?',
        'How can tiny crystals inside a rock or glassy pebbles in Côte d’Ivoire act as clues to an event that happened over a million years ago?',
        'Why are the mud layers at the bottom of Lake Bosomtwe compared to pages in a history book?',
      ],
      reflection: [
        'How can traditional community rules and modern environmental science work together to protect Ghana’s lakes and forests today?',
      ],
      mathsExtension: [
        {
          task: 'The outer crater rim around Lake Bosomtwe is about 10.5 km wide, while the water surface today is about 8.5 km wide. What is the difference between the crater rim width and the water width?',
          answer: '10.5 − 8.5 = 2.0 km (2 kilometres).',
        },
        {
          task: 'The meteorite that formed the crater was about 500 metres wide. How many metres are in 1 kilometre, and what fraction of a kilometre is 500 metres?',
          answer: '1,000 metres = 1 kilometre; 500 metres is 1/2 (0.5) of a kilometre.',
        },
      ],
      differentiation: {
        support: [
          'Use a bowl and a cup of water to show what a "closed lake" (endorheic basin) means: water enters as rain and leaves only by evaporation.',
        ],
        stretch: [
          'Write a short field report explaining three clues you would look for as a geologist to tell an impact crater apart from a volcano.',
        ],
      },
      culturalNotes: [
        'Lake Bosomtwe is sacred in Ashanti tradition. The oral tradition of the hunter Akora Bompe and his dog from Asaman following an antelope (twe) is presented respectfully as cultural heritage, never confused with geological age.',
        'The traditional wooden plank craft is called a padua, propelled with flat wooden hand pads.',
      ],
      localiseThis: [
        'Connect to any notable rock formations, hills, rivers, or sacred groves in your own district and discuss both their cultural story and geological origin.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Lake Bosomtwe occupies a 10.5 km wide meteorite impact crater formed approximately 1.07 million years ago in crystalline Birimian rocks.',
          'Shocked quartz in suevite breccia and radiometrically matched Ivory Coast tektites confirm an extraterrestrial hypervelocity impact.',
          'Deep sediment cores drilled in 2004 (ICDP) preserve over 1 million years of West African monsoon and Sahara dust history.',
        ],
        whatWeAreStillDiscovering: [
          'Scientists continue analysing microscopic pollen, charcoal, and chemical isotopes in the deep lake cores to understand how rapid climate shifts affected early human habitats in West Africa.',
          'Hydrologists are actively studying how modern warming and land-use changes around the rim affect the lake’s water balance and native cichlid fish species.',
        ],
      },
      investigation: {
        title: 'Model an Impact Crater in a Tray',
        materials: [
          'A wide shallow basin or cardboard tray',
          'Dry gari, cornflour, or clean fine sand (about 4 cm deep)',
          'A thin dusting of cocoa powder or dark soil on top',
          'Two or three smooth pebbles or marbles of different sizes',
          'A ruler',
        ],
        steps: [
          'Spread a 4 cm layer of gari or fine sand smoothly in the tray and sprinkle a very thin dark layer of cocoa powder or dark soil on top.',
          'Drop a small pebble from shoulder height straight down into the tray and measure the width of the circular crater rim.',
          'Observe where the lighter lower layer was thrown outward (like tektites and ejecta rays).',
          'Gently toss a pebble at a slight angle and notice that the crater still forms a nearly round bowl!',
        ],
        whatToNotice:
          'Even when a pebble hits at a moderate angle, the shock wave pushes material outward in all directions to make a circular rim with a raised edge.',
        safetyNote:
          'Drop pebbles gently downward into the tray placed on the ground; stand back slightly so sand or powder does not splash near eyes, and wash hands afterwards.',
      },
      factCheck: [
        {
          claim: 'Lake Bosomtwe was formed approximately 1.07 million years ago by a meteorite impact producing a ~10.5 km crater.',
          explanation: 'Argon-argon dating of Ivory Coast tektites and impact glasses, combined with geophysical and drilling studies of the Bosomtwe structure, establish an impact age of 1.07 Myr.',
          reference: 'Koeberl, C., Milkereit, B., Overpeck, J. T., Scholz, C. A., Amoako, P. Y. O., Boamah, D., Danuor, S. et al. (2007). An international and multidisciplinary drilling project into a young complex impact structure: The 2004 Bosomtwe crater drilling project. Meteoritics & Planetary Science, 42(4–5), 483–511.',
        },
        {
          claim: 'Shocked quartz in impact breccia and Ivory Coast tektites provide conclusive geological evidence of hypervelocity impact.',
          explanation: 'Planar deformation features in quartz require shock pressures >5–10 GPa that volcanic processes on Earth cannot generate; Ivory Coast tektites have identical chemical and isotopic signatures to the Birimian target rocks at Bosomtwe.',
          reference: 'Boamah, D., & Koeberl, C. (2003). Geology and geochemistry of shallow drill cores from the Bosomtwe impact crater, Ghana. Meteoritics & Planetary Science, 38(8), 1137–1159; UNESCO Biosphere Reserve Nomination Dossier for Lake Bosomtwe.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, clear Ghanaian English storyteller (`Kore`). Respectful elder cadence for Nana Osei, enthusiastic scientific tone for Dr Boateng.',
      pace: 'Medium (about 125 words per minute).',
      notes: [
        'Use phonetic hints for Bosomtwe, Kwabena, Afia, Boateng, and padua while keeping written text in standard spelling.',
      ],
    },
    music: 'Optional calm water and forest bird ambience, off by default.',
    culturalNotes: [
      'Respectfully separates Ashanti sacred heritage and conservation customs from Pleistocene impact geology.',
    ],
    reviewQuestions: [
      'Confirm the spelling and explanation of padua with an Ashanti Twi cultural reviewer.',
    ],
  },

  // ====================================================================================================================
  // 2. The Ocean That Hides a Thousand Secrets (JHS 1-2, 12 pages, Deep Ocean, Bioluminescence, Hydrothermal Vents)
  // ====================================================================================================================
  {
    key: 'the-ocean-that-hides-a-thousand-secrets',
    set: 'extension',
    title: 'The Ocean That Hides a Thousand Secrets',
    summary:
      'At a marine science laboratory in Tema, thirteen-year-old Tetteh and his classmate Ama explore deep-sea footage from the Atlantic Ocean, discovering how ocean zones, crushing pressure, bioluminescence and hydrothermal vents support life without sunlight.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2'],
      ageMin: 12,
      ageMax: 14,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['animals-and-habitats', 'technology', 'careers'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'inference', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 420,
    }),
    palette: ['#0c4a6e', '#06b6d4'],
    characters: [
      'Tetteh: a thirteen-year-old Ghanaian JHS boy from Tema, wearing a teal school blazer over a white shirt, observant and fascinated by engineering and sea life.',
      'Ama: his thirteen-year-old classmate, braided hair tied in a neat bun, wearing the same teal JHS blazer and carrying a tablet for science notes.',
      'Dr Akua Mensah: a Ghanaian marine biologist and deep-sea expedition researcher in her late thirties, wearing a navy lab coat over a yellow wax-print blouse.',
    ],
    pages: [
      {
        text: 'Outside the marine research centre in Tema, fishing canoes and cargo ships rode the bright blue swells of the Gulf of Guinea. Inside the laboratory, thirteen-year-old Tetteh and his classmate Ama stood beside a bright yellow robotic submarine called a remotely operated vehicle, or ROV.',
        alt: 'Tetteh and Ama stand with Dr Akua Mensah inside a Tema marine laboratory beside a yellow robotic deep-sea ROV.',
        motif: '🤖🌊',
        brief: 'Inside a modern marine science lab in Tema with ocean windows in back. Tetteh (13, teal JHS blazer) and Ama (13, teal JHS blazer, braided bun, tablet) inspecting a compact bright-yellow deep-sea robotic ROV with Dr Akua Mensah (navy lab coat over yellow wax-print blouse).',
        narration: 'Engaging and curious. Clear articulation of "Gulf of Guinea" and "remotely operated vehicle".',
      },
      {
        text: '‘When we stand on the beach at Tema or Cape Coast,’ said Dr Akua Mensah, tapping a wall chart of the Atlantic Ocean, ‘we only see the surface. Yet the ocean averages nearly four thousand metres deep! Most of Earth’s living space hides far beneath the waves in layers that sunlight can never reach.’',
        alt: 'Dr Akua Mensah points to a visual diagram of ocean depth layers from the sunlit surface down to the pitch-black abyss.',
        motif: '🌊📉',
        brief: 'Dr Akua Mensah pointing to a large visual cross-section of the ocean showing bright blue water at the top fading into deep indigo and pitch black at the bottom (no text or numbers), while Tetteh and Ama watch.',
        narration: 'Expressive and clear. Emphasise "nearly four thousand metres deep".',
      },
      {
        text: 'Dr Akua dimmed the laboratory lights and started a video recorded by the yellow ROV during an Atlantic research voyage. ‘The top two hundred metres are the sunlit zone,’ she explained. ‘Here, microscopic plant-like organisms called phytoplankton use sunlight for photosynthesis, producing oxygen and feeding fish like sardines, tuna and mackerel.’',
        alt: 'On a large screen, silver fish swim through bright sunlit blue surface waters filled with tiny glowing green specks.',
        motif: '☀️🐟',
        brief: 'Dimmed marine lab: a large screen shows sunlit turquoise-blue surface water with silver mackerel and tiny shimmering plankton, watched by Tetteh, Ama and Dr Akua.',
        narration: 'Bright and clear. Careful pronunciation of "phytoplankton" and "photosynthesis".',
      },
      {
        text: 'As the ROV camera descended past two hundred metres into the twilight zone, the blue water faded to deep indigo. ‘Why don’t human divers just swim down there with scuba tanks?’ asked Tetteh. ‘Because of hydrostatic pressure,’ said Dr Akua. ‘For every ten metres you go down, the weight of the water above adds another atmosphere of pressure.’',
        alt: 'The ROV camera view shows the water turning dark indigo as Tetteh asks Dr Akua a question about deep water pressure.',
        motif: '⬇️💧',
        brief: 'Tetteh looking amazed as the screen shows the yellow ROV descending into dark indigo water with its headlamps glowing.',
        narration: 'Curious question from Tetteh, followed by clear explanation of hydrostatic pressure.',
      },
      {
        text: '‘At one thousand metres deep,’ Dr Akua continued, ‘the ROV enters the midnight zone, where no sunlight reaches at all and the water is near freezing. There, the pressure is about one hundred times greater than the air pressure at sea level! Our ROV uses thick titanium spheres and special syntactic foam so it will not be crushed.’',
        alt: 'Dr Akua points to the thick round camera housing on the yellow ROV while Ama takes notes on her tablet.',
        motif: '🛡️🤖',
        brief: 'Dr Akua pointing to a thick metallic spherical camera housing on the yellow ROV in the lab, while Ama takes notes on her tablet and Tetteh touches the smooth casing.',
        narration: 'Steady, impressive tone on "one hundred times greater".',
      },
      {
        text: 'Suddenly, on the pitch-black screen, Dr Akua switched off the ROV’s headlamps. Ama leaned forward in surprise. Blue and green sparks flashed in the darkness like living stars! A translucent comb jelly drifted past with rainbow ripples, and a deep-sea squid released a cloud of glowing blue light.',
        alt: 'On the dark monitor, a deep-sea comb jelly and squid glow with vivid blue and green bioluminescent light.',
        motif: '✨🦑',
        brief: 'In the darkened lab, the big monitor shows pitch-black deep ocean water lit by a glowing blue bioluminescent squid and a shimmering comb jelly, reflecting blue light on Tetteh and Ama’s amazed faces.',
        narration: 'Hushed wonder after the lights go out, then vivid delight on "like living stars!".',
      },
      {
        text: '‘That is bioluminescence,’ said Dr Akua. ‘In the twilight and midnight zones, over three-quarters of the animals make their own cold chemical light! Inside their cells, or inside helpful bacteria living in their bodies, a molecule called luciferin reacts with oxygen and an enzyme called luciferase to shine without getting hot.’',
        alt: 'A close view on the screen shows a deep-sea lanternfish with rows of glowing blue light organs along its belly.',
        motif: '🐟💡',
        brief: 'Close-up on the research screen showing a small deep-sea lanternfish with neat rows of glowing cyan photophores along its underside in dark water.',
        narration: 'Clear, unhurried pronunciation of "bioluminescence", "luciferin", and "luciferase".',
      },
      {
        text: '‘Why would an animal want to glow in the dark?’ asked Ama. ‘Wouldn’t predators see it?’ ‘Different species use light in clever ways,’ Dr Akua replied. ‘The anglerfish dangles a glowing lure in front of its mouth to attract prey. Some shrimp squirt glowing clouds to blind predators, while lanternfish glow softly on their bellies to blend in with faint light from above!’',
        alt: 'The screen displays a deep-sea anglerfish with a glowing blue lure arched above its wide jaw.',
        motif: '🎣🐟',
        brief: 'On the lab display, a deep-sea anglerfish in dark water with a glowing cyan bioluminescent lure arching in front of its mouth, while Ama points at the screen.',
        narration: 'Lively and engaging as each survival strategy is explained.',
      },
      {
        text: 'The ROV video jumped deeper, to three thousand metres on the Mid-Atlantic Ridge. Tall rocky chimneys rose from the seafloor, billowing thick dark clouds of mineral-rich water heated by magma far below the crust. ‘These are hydrothermal vents,’ said Dr Akua. ‘The water gushing out can exceed three hundred and fifty degrees Celsius, yet the crushing pressure stops it from boiling!’',
        alt: 'The ROV illuminates tall rocky hydrothermal vent chimneys gushing dark mineral plumes on the ocean floor.',
        motif: '🌋🌊',
        brief: 'Deep seafloor scene illuminated by the yellow ROV: tall craggy hydrothermal vent chimneys ("black smokers") gushing dark mineral plumes surrounded by white crabs and tube worms.',
        narration: 'Dramatic and clear. Emphasise how pressure prevents the superheated water from boiling.',
      },
      {
        text: 'Tetteh stared at the colonies of white vent crabs, pale shrimp and giant red-plumed tube worms crowded around the chimneys. ‘How can so many animals live down here with zero sunlight and no green plants?’ he asked. ‘This discovery in nineteen seventy-seven shocked biologists everywhere,’ Dr Akua said with a smile.',
        alt: 'Tetteh points closely at the monitor showing giant red-plumed tube worms and white crabs thriving beside a hydrothermal vent.',
        motif: '🪱🦀',
        brief: 'Close view of the monitor showing bright red-plumed giant tube worms and small white vent crabs clustered on a rocky vent chimney as Tetteh points in amazement.',
        narration: 'Surprise and curiosity for Tetteh, warm enthusiasm for Dr Akua.',
      },
      {
        text: '‘Instead of sunlight,’ Dr Akua explained, ‘billions of microbes around the vents use chemical energy from hydrogen sulfide dissolved in the vent water to build food. Scientists call this chemosynthesis. Those microbes form the base of an entire dark-ocean food web! It even gives astrobiologists clues about how life might survive beneath the icy oceans of moons like Europa.’',
        alt: 'Dr Akua shows a comparison chart on a tablet: surface life powered by sunlight versus deep-vent life powered by chemical energy.',
        motif: '🦠⚡',
        brief: 'Dr Akua holding a glowing digital tablet showing two simple visual food-web icons side by side (a sun above green plankton vs a seafloor vent chimney with microbes and tube worms, no text), watched by Tetteh and Ama.',
        narration: 'Clear emphasis on "chemosynthesis" in contrast to photosynthesis.',
      },
      {
        text: 'As they stepped back outside into the warm Tema sunshine, Ama looked out at the endless Atlantic horizon. ‘Dr Akua, have scientists mapped the whole ocean floor yet?’ Dr Akua shook her head. ‘More than eighty percent of the global seafloor has never been mapped in high detail, and thousands of deep-sea species await discovery. The ocean still keeps most of its secrets for your generation to explore!’ The end.',
        alt: 'Tetteh, Ama and Dr Akua stand on the sunny balcony of the Tema marine centre looking out over the sparkling Atlantic Ocean.',
        motif: '🌅🌊',
        brief: 'Sunny balcony of the Tema marine research centre overlooking the blue Atlantic Ocean. Dr Akua, Tetteh and Ama looking out toward the horizon with inspired expressions.',
        narration: 'Inspiring and forward-looking. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'ocean-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why does water pressure increase so rapidly as an ROV descends into the deep ocean?',
        options: [
          'The weight of water above adds about one atmosphere every ten metres',
          'The ocean floor has giant magnets pulling downward',
          'Sunlight pushes the surface water down',
          'Salt disappears in deep water',
        ],
        correctIndex: 0,
        explanation: 'Hydrostatic pressure comes from the weight of the water above, adding roughly one atmosphere of pressure for every 10 metres of depth.',
      },
      {
        id: 'ocean-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'bioluminescence',
        definition: 'The production of cold chemical light by living organisms.',
        distractors: [
          'Light reflected from the Moon onto ocean waves',
          'Heat released by underwater volcanoes',
        ],
      },
      {
        id: 'ocean-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'How does the deep-sea lanternfish use bioluminescence on its belly to survive in the twilight zone?',
        options: [
          'It glows softly to match faint light above and hide its shadow from below',
          'It uses its light to perform photosynthesis',
          'It heats up the freezing water around its fins',
          'It signals to fishing boats on the surface',
        ],
        correctIndex: 0,
        explanation: 'Glowing on the underside (counter-illumination) breaks up the fish’s dark silhouette against faint downwelling light.',
      },
      {
        id: 'ocean-c3',
        type: 'comprehension',
        afterPage: 11,
        question: 'What powers the base of the food web around deep-sea hydrothermal vents where no sunlight reaches?',
        options: [
          'Chemosynthetic microbes using chemical energy from hydrogen sulfide',
          'Green seaweed growing on the hot chimneys',
          'Dead leaves blown from coastal forests',
          'Electric currents from robotic submarines',
        ],
        correctIndex: 0,
        explanation: 'Around hydrothermal vents, chemosynthetic bacteria and archaea convert chemical energy (such as hydrogen sulfide) into organic food without sunlight.',
      },
      {
        id: 'ocean-pred',
        type: 'prediction',
        afterPage: 11,
        prompt: 'Why do you think scientists study deep-sea hydrothermal vents when preparing missions to icy moons like Jupiter’s moon Europa?',
      },
      {
        id: 'ocean-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order these ocean zones and features from shallowest to deepest as the ROV descended.',
        items: [
          'The sunlit zone (0 to 200 m), where phytoplankton perform photosynthesis.',
          'The twilight zone (200 to 1,000 m), where sunlight fades to dim indigo.',
          'The midnight zone (below 1,000 m), pitch black with crushing pressure.',
          'Deep-sea hydrothermal vents on the ocean ridge powered by chemosynthesis.',
        ],
      },
      {
        id: 'ocean-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'Knowing that more than eighty percent of the deep ocean floor has not yet been mapped in detail, how do you feel about future ocean exploration?',
        feelingOptions: ['Curious', 'Amazed', 'Eager', 'Inspired'],
      },
    ],
    glossary: [
      { word: 'phytoplankton', definition: 'Microscopic plant-like organisms drifting in sunlit surface water that make food by photosynthesis.', pages: [3] },
      { word: 'pressure', definition: 'The continuous physical force exerted on or against an object by the weight of water or air above it.', pages: [4, 5, 9] },
      { word: 'bioluminescence', definition: 'Light produced by a chemical reaction inside a living organism.', pages: [7] },
      { word: 'luciferin', definition: 'A light-emitting compound found in organisms that produce bioluminescence.', pages: [7] },
      { word: 'chemosynthesis', definition: 'The process by which microbes use chemical energy instead of sunlight to make food.', pages: [11] },
    ],
    teacherGuide: {
      overview:
        'Set at a marine research laboratory in Tema on the Gulf of Guinea coast, this JHS story takes learners on a remotely operated vehicle (ROV) dive through the ocean’s pelagic zones, explaining hydrostatic pressure, the biochemistry and ecological roles of bioluminescence, and chemosynthetic ecosystems at deep-sea hydrothermal vents.',
      lessonMinutes: 45,
      learningGoals: [
        'Compare the sunlit (epipelagic), twilight (mesopelagic), and midnight (bathypelagic) ocean zones in terms of light, temperature, and hydrostatic pressure.',
        'Explain how bioluminescence works chemically (luciferin + luciferase + oxygen) and describe three survival functions (luring prey, startling predators, counter-illumination camouflage).',
        'Contrast photosynthesis at the ocean surface with chemosynthesis at deep-sea hydrothermal vents.',
        'Distinguish established marine biology facts from open questions about unmapped deep-sea ecosystems.',
      ],
      subjectLinks: [
        { subject: 'Science (JHS)', link: 'Ecosystems, food webs, photosynthesis vs chemosynthesis, pressure in fluids, and light.', status: 'to-verify' },
        { subject: 'Social Studies / Career Technology', link: 'Marine science careers and ocean conservation in Ghana and the Atlantic.', status: 'to-verify' },
        { subject: 'English Language (JHS)', link: 'Scientific reading comprehension, domain vocabulary, and explanatory discussion.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "How deep do you think sunlight can travel into the ocean? What happens to plants when there is no light?"',
        'Locate Tema and the Gulf of Guinea on a map and trace how the Gulf opens into the wider Atlantic Ocean.',
      ],
      whileReading: [
        'Pause after page 5 to calculate why a submarine needs special materials at 1,000 m depth.',
        'Pause after page 11 to compare the energy source of a surface food chain (Sun → phytoplankton) with a vent food chain (hydrogen sulfide → chemosynthetic microbes).',
      ],
      afterReading: [
        'Have learners sketch a vertical chart of the ocean zones showing where sunlight ends and how organisms adapt in each layer.',
      ],
      discussion: [
        'Why is bioluminescence called "cold light", and how is it different from a glowing hot metal wire?',
        'Why did scientists before 1977 assume that almost no complex life could thrive on the deep ocean floor without food falling from the sunlit surface?',
        'Why should humanity be careful about disturbing or mining deep-sea hydrothermal vents before scientists finish studying the species that live there?',
      ],
      reflection: [
        'If you could design a sensor or camera for a Ghanaian research ROV exploring the deep Gulf of Guinea, what question would you want it to answer?',
      ],
      mathsExtension: [
        {
          task: 'Water pressure increases by about 1 atmosphere for every 10 metres of depth, plus 1 atmosphere of air pressure at the surface. What is the total pressure in atmospheres at 200 metres depth?',
          answer: '(200 ÷ 10) + 1 = 20 + 1 = 21 atmospheres.',
        },
        {
          task: 'If a deep-sea ROV dives at a steady speed of 30 metres per minute, how many minutes will it take to reach 3,000 metres?',
          answer: '3,000 ÷ 30 = 100 minutes (1 hour and 40 minutes).',
        },
      ],
      differentiation: {
        support: [
          'Use a clear bottle of water and a torch covered with blue cloth layers to model how light dims as depth increases.',
        ],
        stretch: [
          'Write a short comparison table contrasting photosynthesis and chemosynthesis across four columns: Energy source, Producers, Habitat, and Consumers.',
        ],
      },
      culturalNotes: [
        'Tetteh (Ga-Dangme) and Ama / Akua / Mensah (Akan) reflect coastal and southern Ghanaian names; Tema is Ghana’s major port and marine industrial city.',
      ],
      localiseThis: [
        'Connect to local fish species familiar in Ghanaian markets (such as herrings/sardinella, mackerel, and tuna) that live in the sunlit zone of the Gulf of Guinea.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Sunlight sufficient for photosynthesis penetrates only the upper ~200 metres (the photic/epipelagic zone) of the ocean.',
          'Roughly 75% of pelagic animals between 200 m and 4,000 m produce bioluminescence via luciferin-luciferase chemical reactions or symbiotic bacteria.',
          'Hydrothermal vents (discovered in 1977) support thriving ecosystems powered by chemosynthetic microbes oxidizing hydrogen sulfide rather than using sunlight.',
        ],
        whatWeAreStillDiscovering: [
          'Over 80% of the global ocean floor remains unmapped at high acoustic resolution, and marine biologists discover hundreds of new deep-sea species every year.',
          'Biochemists are still investigating unique enzymes and compounds in deep-sea sponges, microbes, and vent organisms that may lead to new medicines.',
          'Ecologists are still studying how deep-sea currents, carbon storage, and potential seabed mining affect fragile abyssal habitats.',
        ],
      },
      investigation: {
        title: 'See How Water Depth Increases Pressure',
        materials: [
          'An empty 1.5-litre clear plastic water bottle',
          'A ruler and marker',
          'A compass point or nail (handled by the teacher)',
          'Waterproof tape',
          'A bucket or outdoor sink and water',
        ],
        steps: [
          'Have the teacher carefully poke three small, equal-sized pinholes in a vertical line down the side of the plastic bottle: one near the top (5 cm down), one in the middle (12 cm down), and one near the bottom (20 cm down).',
          'Cover all three holes with a strip of tape and fill the bottle completely with water (leave the cap off).',
          'Place the bottle at the edge of a table over a bucket or outdoors, peel off the tape all at once, and observe how far each stream of water shoots out horizontally.',
        ],
        whatToNotice:
          'The stream from the bottom hole shoots out the farthest and fastest because there is a taller column of water pressing down above it—demonstrating how hydrostatic pressure increases with depth!',
        safetyNote:
          'Only the teacher should use a sharp point to make the pinholes in the plastic bottle; perform the water test outdoors or over a bucket so floors do not become slippery.',
      },
      factCheck: [
        {
          claim: 'About three-quarters of deep pelagic marine organisms produce bioluminescence using luciferin and luciferase.',
          explanation: 'QuantitativeROV surveys from the surface to 4,000 m show ~76% of macroscopic water-column individuals have bioluminescent capability.',
          reference: 'Martini, S., & Haddock, S. H. D. (2017). Quantification of bioluminescence from the surface to the deep sea demonstrates its predominance as an ecological trait. Scientific Reports, 7, 45750; NOAA Ocean Exploration — Bioluminescence and Deep-Sea Vents.',
        },
        {
          claim: 'Hydrothermal vents host ecosystems powered by chemosynthesis rather than photosynthesis, first discovered in 1977.',
          explanation: 'Discovered along the Galápagos Rift in 1977 and subsequently along the Mid-Atlantic Ridge, vent ecosystems rely on chemoautotrophic bacteria and archaea oxidizing reduced sulfur compounds (H2S).',
          reference: 'Corliss, J. B. et al. (1979). Submarine thermal springs on the Galápagos Rift. Science, 203(4385), 1073–1083; Woods Hole Oceanographic Institution (WHOI) Hydrothermal Vents Fact Sheet.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Clear, engaging Ghanaian English storyteller (`Kore`). Mature, curious delivery suited for JHS learners.',
      pace: 'Medium (about 135 words per minute).',
      notes: [
        'Use phonetic hints for Tetteh, Ama, Akua, and Mensah while keeping standard written spellings.',
      ],
    },
    music: 'Optional deep-water ambient hum, off by default.',
    culturalNotes: [
      'Grounded in Tema and the Gulf of Guinea marine research community.',
    ],
    reviewQuestions: [
      'Confirm whether a specific Ghanaian marine institute name (such as the University of Ghana Department of Marine and Fisheries Sciences or CSIR-WRI) should be cited in the teacher guide.',
    ],
  },

  // ====================================================================================================================
  // 3. Esi and the Elephant's Secret Path (Primary 2-3, 9 pages, Elephant Behaviour, Infrasound, Migration & Safety)
  // ====================================================================================================================
  {
    key: 'esi-and-the-elephants-secret-path',
    set: 'extension',
    title: 'Esi and the Elephant’s Secret Path',
    summary:
      'Near Mole National Park in northern Ghana, eight-year-old Esi learns from Ranger Braimah how elephant families follow their wise grandmother along ancient paths, talk through the ground with low rumbles, and stay safe around farms with beehive fences.',
    classification: base({
      classIds: ['primary-2', 'primary-3'],
      ageMin: 7,
      ageMax: 9,
      readingLevel: 'developing',
      difficulty: 2,
      genres: ['science', 'animal', 'educational'],
      themes: ['animals-and-habitats', 'community', 'helping-others'],
      objectives: ['scientific-curiosity', 'environmental-awareness', 'reading-comprehension', 'vocabulary', 'respect'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 300,
    }),
    palette: ['#fef3c7', '#b45309'],
    characters: [
      'Esi: an eight-year-old Ghanaian girl with two neat puff buns tied with green ribbons, wearing a bright sky-blue t-shirt, khaki trousers and sturdy walking shoes.',
      'Ranger Braimah: a kind wildlife ranger at Mole National Park in his thirties, wearing an olive-green park ranger uniform, wide-brimmed hat and binoculars.',
      'Mama: Esi’s mother, a farmer near the park boundary, wearing a warm orange-and-brown wrapper cloth and headscarf.',
    ],
    pages: [
      {
        text: 'Eight-year-old Esi lived in a village near Mole National Park in northern Ghana. One morning after the rain, she found a line of giant round footprints pressed into the red mud near the edge of her family’s farm. Each footprint was as wide as a cooking pot!',
        alt: 'Eight-year-old Esi kneels beside a row of huge round elephant footprints in the damp red earth near Mole National Park.',
        motif: '🐘👣',
        brief: 'Sunny savannah morning near Mole National Park. Esi (8, two puff buns with green ribbons, sky-blue t-shirt, khaki trousers) crouching beside a trail of huge round elephant footprints in red soil, looking amazed.',
        narration: 'Bright and curious. Emphasise "as wide as a cooking pot!".',
      },
      {
        text: 'Ranger Braimah arrived on his bicycle in his green ranger uniform. ‘Good morning, Esi!’ he smiled. ‘An elephant family walked past here before dawn. Look how the big footprints and little footprints stay close together. They are following an ancient elephant path that leads from the river to the fruiting shea trees.’',
        alt: 'Ranger Braimah in his green uniform points along the trail of large and small elephant footprints while Esi listens.',
        motif: '🧭🌳',
        brief: 'Ranger Braimah (olive-green ranger uniform, wide hat, binoculars) standing with Esi and pointing along the worn path winding toward shea trees in the savannah.',
        narration: 'Warm, reassuring voice for Ranger Braimah.',
      },
      {
        text: 'From a high wooden viewing platform inside the park boundary, Ranger Braimah handed Esi a pair of binoculars. ‘Always stay quiet, downwind, and far back in a safe place with a ranger,’ he reminded her. Down by the waterhole stood six grey African elephants, led by the biggest female with long curved ears.',
        alt: 'From a high wooden platform, Esi looks through binoculars at a family of six elephants by a sunny waterhole.',
        motif: '🔭🐘',
        brief: 'High wooden viewing platform overlooking a savannah waterhole. Esi looking through binoculars beside Ranger Braimah; below them, a family herd of six African elephants with a calf stands by the water.',
        narration: 'Calm and clear on the safety rule: "stay quiet, downwind, and far back".',
      },
      {
        text: '‘Who is the leader in the front?’ whispered Esi. ‘She is the matriarch, the oldest and wisest grandmother of the family,’ said Ranger Braimah. ‘Male elephants leave the herd when they grow up, but mothers, sisters and calves stay together. The matriarch can remember where to find water during dry years, even a place she visited thirty years ago!’',
        alt: 'The wise grandmother elephant leads the herd and a tiny calf along the waterhole edge while flapping her large ears.',
        motif: '👵🐘',
        brief: 'Close view of the elephant family at the waterhole: the tall grandmother matriarch in front with a small calf walking safely beside its mother.',
        narration: 'Gentle whisper for Esi, then warm admiration for the matriarch’s memory.',
      },
      {
        text: 'Esi watched the elephants flap their huge ears and spray cool mud onto their backs with their trunks. ‘Why do they flap their ears and wear mud?’ she asked. ‘An elephant’s ears are full of blood vessels,’ said Ranger Braimah. ‘Flapping them cools the blood like a fan, and wet mud acts like sunscreen to protect their skin from heat and insects!’',
        alt: 'An elephant sprays cool mud over its back with its trunk while flapping its wide ears.',
        motif: '💦👂',
        brief: 'Sunlit waterhole: an African elephant playfully spraying a mist of muddy water over its back with its trunk and flapping its large ears.',
        narration: 'Playful and clear. Emphasise "like a fan" and "like sunscreen".',
      },
      {
        text: 'Suddenly, all six elephants froze. The matriarch lifted her trunk and pressed one big front foot flat against the ground. Yet Esi heard nothing at all! Seconds later, another elephant family appeared from behind the distant baobab trees and walked straight toward them, touching trunks in a friendly greeting.',
        alt: 'The matriarch elephant stands very still with one foot pressed to the ground while another elephant group approaches from the baobab trees.',
        motif: '🦶🔊',
        brief: 'Savannah scene: the matriarch elephant standing alert with her trunk raised and front foot flat on the earth; in the distance by a baobab tree, three more elephants walk toward them.',
        narration: 'Pause after "froze" to build quiet suspense.',
      },
      {
        text: '‘How did they know the other elephants were coming when there was no sound?’ asked Esi. Ranger Braimah smiled. ‘Elephants make deep rumbles called infrasound that are too low for human ears to hear! Those low vibrations travel for kilometres through the air and through the ground, and elephants feel them through the soft pads of their feet.’',
        alt: 'Ranger Braimah taps the wooden railing gently while Esi places her hand flat on the wood to feel the vibration.',
        motif: '〰️✋',
        brief: 'On the wooden platform, Ranger Braimah tapping the wooden railing gently at one end while Esi presses her palm flat on the wood to feel the vibration.',
        narration: 'Clear wonder on "infrasound" and "feel them through the soft pads of their feet".',
      },
      {
        text: 'Walking back toward the village farms, Esi saw her mother hanging wooden beehives along a wire fence between posts around their maize field. ‘Mama, why are we putting beehives by the farm?’ Esi asked. ‘To protect both our crops and the elephants,’ said Mama. ‘Elephants are afraid of honeybees stinging the sensitive skin inside their trunks!’',
        alt: 'Esi’s mother hangs wooden beehives on a wire fence along the edge of a green maize farm while Esi and Ranger Braimah watch.',
        motif: '🐝🌽',
        brief: 'Edge of a green maize farm near the savannah: Mama (orange-and-brown wrapper and headscarf) checking wooden beehives suspended on wires between posts, with Esi and Ranger Braimah smiling.',
        narration: 'Warm, practical voice for Mama.',
      },
      {
        text: '‘When an elephant touches the wire, the hives swing and the bees buzz out,’ said Ranger Braimah. ‘The elephant turns back safely to its forest corridor, and your family harvests both maize and sweet honey!’ Esi smiled at the big footprints in the soil. Now she knew how science helps people and giant neighbours share the land in peace. The end.',
        alt: 'Esi, Mama and Ranger Braimah smile together beside the beehive fence as elephants walk peacefully along the distant park path at sunset.',
        motif: '🍯🌅',
        brief: 'Golden sunset over northern Ghana savannah: Esi, Mama and Ranger Braimah standing happily by the farm’s beehive fence, while in the far distance elephants walk peacefully along their park corridor.',
        narration: 'Joyful and warm conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'esi-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Who leads an African elephant family herd and remembers where to find water?',
        options: [
          'The matriarch, the oldest and wisest grandmother elephant',
          'The youngest baby calf',
          'A tall giraffe that walks in front',
          'The fastest bird in the trees',
        ],
        correctIndex: 0,
        explanation: 'Elephant herds are matriarchal: the oldest female (the matriarch) leads the family and remembers waterholes and migration paths.',
      },
      {
        id: 'esi-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why do elephants flap their big ears and spray mud on their skin?',
        options: [
          'To cool their blood and protect their skin from heat and insects',
          'To help them fly over rivers',
          'To hide from tiny mice',
          'To make their ears grow longer',
        ],
        correctIndex: 0,
        explanation: 'Blood vessels in an elephant’s large ears release heat when flapped, and mud acts like a cooling sunscreen.',
      },
      {
        id: 'esi-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'infrasound',
        definition: 'Deep sound vibrations that are too low for human ears to hear.',
        distractors: [
          'A very high whistle that only birds make',
          'A bright flash of light in the sky',
        ],
      },
      {
        id: 'esi-c3',
        type: 'comprehension',
        afterPage: 9,
        question: 'How does a beehive fence help both farmers and elephants near Mole National Park?',
        options: [
          'Bees safely turn elephants away from crops, and farmers harvest honey',
          'The bees carry the maize into the barn',
          'Elephants eat the wooden beehives instead of corn',
          'The fence traps elephants inside the farm',
        ],
        correctIndex: 0,
        explanation: 'Elephants avoid buzzing honeybees around their sensitive trunks, so beehive fences protect crops peacefully while providing honey.',
      },
      {
        id: 'esi-pred',
        type: 'prediction',
        afterPage: 6,
        prompt: 'Why is it important to leave safe walking corridors between farms so elephants can reach rivers and trees?',
      },
      {
        id: 'esi-seq',
        type: 'sequencing',
        afterPage: 9,
        prompt: 'Put Esi’s discoveries in the right order.',
        items: [
          'Esi finds giant round elephant footprints near the edge of the farm.',
          'From a safe platform, Esi watches the matriarch lead her herd.',
          'Ranger Braimah explains how elephants send low rumbles in the ground.',
          'Mama shows how beehive fences protect the maize farm peacefully.',
        ],
      },
      {
        id: 'esi-sel',
        type: 'sel',
        afterPage: 9,
        prompt: 'How do you feel when people find a kind, clever way to solve a problem without hurting wildlife?',
        feelingOptions: ['Happy', 'Proud', 'Caring', 'Relieved'],
      },
    ],
    glossary: [
      { word: 'matriarch', definition: 'The oldest and wisest female elephant who leads a family herd.', pages: [4, 6] },
      { word: 'infrasound', definition: 'Very low-pitched sound vibrations below the range of human hearing.', pages: [7] },
      { word: 'vibrations', definition: 'Tiny, rapid back-and-forth movements that travel through air, water or solid ground.', pages: [7] },
      { word: 'corridor', definition: 'A safe natural pathway that wildlife use to travel between habitats.', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'Set near Mole National Park in northern Ghana’s Savannah Region, this Lower Primary story introduces elephant social structure (matriarchal herds), physical adaptations (ears and mud for thermoregulation), infrasound seismic communication, wildlife safety rules, and peaceful human-elephant coexistence using beehive fences.',
      lessonMinutes: 40,
      learningGoals: [
        'Describe how African elephant families are led by a matriarch who remembers water and food routes.',
        'Explain how elephants cool themselves using their ears and mud, and how they communicate over long distances using low rumbles (infrasound) and ground vibrations.',
        'State clear wildlife safety rules (never approach wild elephants alone; stay quiet, downwind, and at a safe distance with a ranger).',
        'Explain how beehive fences protect farm crops peacefully while supporting biodiversity.',
      ],
      subjectLinks: [
        { subject: 'Science (Lower Primary)', link: 'Animals, habitats, adaptations, and sound vibrations.', status: 'to-verify' },
        { subject: 'Our World Our People', link: 'National parks of Ghana (Mole National Park) and living peacefully with wildlife.', status: 'to-verify' },
        { subject: 'English Language', link: 'Reading comprehension, sequencing, and oral discussion.', status: 'to-verify' },
      ],
      beforeReading: [
        'Show Mole National Park in the Savannah Region on a map of Ghana.',
        'Ask learners: "How do you talk to a friend who is far across the school field? How do you think elephants talk across the savannah?"',
      ],
      whileReading: [
        'Pause after page 3 to review the three wildlife safety rules Ranger Braimah shares.',
        'Pause after page 7 to let learners tap their desks gently like Ranger Braimah did.',
      ],
      afterReading: [
        'Act out how a beehive fence works: one group plays maize plants, two learners hold an imaginary string with "beehives", and another group plays the elephant family turning safely toward the park corridor.',
      ],
      discussion: [
        'Why is an older grandmother elephant so important to the survival of her herd during a dry season?',
        'Why do elephants avoid buzzing honeybees even though an elephant is huge and a bee is tiny?',
      ],
      reflection: [
        'What can we learn from elephant families about listening to elders and looking after younger children?',
      ],
      mathsExtension: [
        {
          task: 'Esi counted 6 elephants in the first family at the waterhole, and 3 more elephants walked over from the baobab trees. How many elephants were there altogether?',
          answer: '6 + 3 = 9 elephants.',
        },
        {
          task: 'Mama hung 4 beehives on the north side of the maize field and 4 beehives on the east side. How many beehives did she hang in all?',
          answer: '4 + 4 = 8 beehives.',
        },
      ],
      differentiation: {
        support: [
          'Use pictures to match three elephant body parts (ears, trunk, foot pads) to their jobs (cooling, drinking/spraying, feeling ground rumbles).',
        ],
        stretch: [
          'Draw a map of a village near Mole National Park showing farms protected by beehive fences and a clear green corridor leading to the river.',
        ],
      },
      culturalNotes: [
        'Mole National Park is Ghana’s largest wildlife refuge, located in the Savannah Region near Larabanga and Damongo.',
        'Esi (Akan) and Braimah (common northern Ghanaian name) reflect everyday Ghanaian diversity.',
      ],
      localiseThis: [
        'Discuss any wildlife reserves, sanctuaries (such as Kakum, Mole, Boabeng-Fiema, or Wechiau), or farm protection methods known in your area.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'African elephants live in matriarchal family units where the oldest female retains decades of spatial memory for water and food routes.',
          'Elephants produce low-frequency infrasound (<20 Hz) that travels several kilometres through the air and couples into the ground as seismic waves detected via mechanoreceptors in their feet.',
          'Beehive fences and chilli-pepper deterrents significantly reduce crop raiding without harming elephants.',
        ],
        whatWeAreStillDiscovering: [
          'Bioacousticians are still decoding the specific meanings of hundreds of different elephant rumbles, postures, and gestures across African populations.',
          'Conservation scientists in West Africa are using satellite collars and genetic studies to map how fragmented forest and savannah elephant corridors can best be reconnected.',
        ],
      },
      investigation: {
        title: 'Listen to Vibrations Through Solid Wood vs Air',
        materials: [
          'A long wooden classroom desk or table',
          'Your fingertips or a wooden pencil with an eraser end',
        ],
        steps: [
          'Have one learner sit at one end of a long wooden desk and tap the wood very softly with a fingertip so their partner standing at the other end can barely hear it through the air.',
          'Now have the partner rest one ear gently flat against the wooden desktop (or press their palm flat on the wood) while the first learner taps with the exact same gentle force.',
          'Compare how clear the tap sounds and feels through the solid wood compared to through the air.',
        ],
        whatToNotice:
          'Vibrations travel strongly through solid materials like wood and soil—similar to how elephants sense low seismic rumbles through the ground with their feet!',
        safetyNote:
          'Tap only very gently with a fingertip or eraser—never bang hard while a classmate’s ear is resting on the desk.',
      },
      factCheck: [
        {
          claim: 'Elephants communicate using low-frequency infrasound rumbles and detect seismic ground vibrations through their feet.',
          explanation: 'Elephant vocalizations include fundamental frequencies of 14–35 Hz that propagate through air and ground; elephant foot pads contain Pacinian corpuscles and acoustic fat pads sensitive to seismic vibrations.',
          reference: 'O’Connell-Rodwell, C. E. (2007). Keeping an "Ear" to the Ground: Seismic Communication in Elephants. Physiology, 22(4), 287–294; Cornell Lab of Ornithology — Elephant Listening Project.',
        },
        {
          claim: 'Beehive fences deter elephants from crop fields because elephants fear honeybee stings around their eyes and inside their trunks.',
          explanation: 'Field trials across Africa demonstrate that elephants actively avoid African honeybees (Apis mellifera scutellata) and emit specific alarm rumbles when hearing bee buzzes.',
          reference: 'King, L. E., Douglas-Hamilton, I., & Vollrath, F. (2007). African elephants run from the sound of disturbed bees. Current Biology, 17(19), R832–R833; Save the Elephants — Elephants and Bees Project.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, lively Ghanaian English storyteller (`Kore`). Clear, friendly voices for Esi, Ranger Braimah, and Mama.',
      pace: 'Slow to medium (about 115 words per minute) for Primary 2–3.',
      notes: [
        'Use phonetic hints for Esi while keeping standard written spelling.',
      ],
    },
    music: 'Optional gentle savannah morning birdsong and soft kalimba, off by default.',
    culturalNotes: [
      'Highlights Mole National Park in northern Ghana and practical community-based conservation.',
    ],
    reviewQuestions: [
      'Confirm that sentence length and vocabulary suit Primary 2–3 readers.',
    ],
  },

  // ====================================================================================================================
  // 4. Kofi and the Invisible Giant (JHS 2-3, 12 pages, Black Holes, Gravity, Event Horizons, Evidence & Open Questions)
  // ====================================================================================================================
  {
    key: 'kofi-and-the-invisible-giant',
    set: 'extension',
    title: 'Kofi and the Invisible Giant',
    summary:
      'At the Ghana Planetarium in Accra, fourteen-year-old Kofi investigates how black holes form, why they are not cosmic vacuum cleaners, what happens at the event horizon, how astronomers detect invisible giants, and which mysteries of quantum gravity remain unsolved.',
    classification: base({
      classIds: ['jhs-2', 'jhs-3'],
      ageMin: 13,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['night-sky', 'technology', 'school'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'inference', 'reading-comprehension', 'vocabulary', 'reasoning'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 450,
    }),
    palette: ['#090d16', '#f97316'],
    characters: [
      'Kofi: a fourteen-year-old Ghanaian JHS 3 boy wearing round glasses, a sky-blue collared school shirt and navy trousers, carrying a graphing calculator and astronomy sketchbook.',
      'Adwoa: his fourteen-year-old classmate, hair styled in neat twists with a headband, wearing the same sky-blue collared school shirt, sharp and inquisitive.',
      'Dr Afia Boateng: a Ghanaian astrophysicist at the planetarium in Accra, wearing a deep indigo blazer over a gold-patterned top.',
    ],
    pages: [
      {
        text: 'Inside the domed theatre of the Ghana Planetarium in Accra, fourteen-year-old Kofi adjusted his glasses as a glowing river of stars arched overhead. ‘Look toward the constellation Sagittarius,’ said astrophysicist Dr Afia Boateng. ‘Right at the centre of our Milky Way galaxy hides an invisible giant four million times more massive than our Sun.’',
        alt: 'Inside the planetarium dome in Accra, Kofi and Adwoa look up with Dr Afia Boateng at the glowing band of the Milky Way.',
        motif: '🌌🔭',
        brief: 'Inside the domed Ghana Planetarium in Accra. Kofi (14, round glasses, sky-blue collared shirt, navy trousers) and Adwoa (14, neat twists with headband, sky-blue shirt) looking up at the projected Milky Way galaxy while Dr Afia Boateng (indigo blazer over gold-patterned top) points upward.',
        narration: 'Rich, intriguing opening. Emphasise "invisible giant four million times more massive than our Sun".',
      },
      {
        text: '‘You mean a supermassive black hole!’ said Kofi, opening his sketchbook. ‘In movies, black holes act like giant cosmic vacuum cleaners that roam through space and suck in everything. Will the one in our galaxy swallow the Earth one day?’',
        alt: 'Kofi holds his astronomy sketchbook and asks Dr Afia a question while Adwoa listens.',
        motif: '📓❓',
        brief: 'Medium shot of Kofi holding his open sketchbook and pencil under the soft blue planetarium lights, asking Dr Afia a question while Adwoa listens.',
        narration: 'Curious and lively for Kofi.',
      },
      {
        text: 'Dr Afia chuckled and shook her head. ‘That is Hollywood fiction, Kofi! A black hole is not a vacuum cleaner. Far away from it, its gravity pulls just like any normal star of the same mass. If our Sun were magically squeezed into a black hole of the exact same mass today, Earth would not get sucked in at all. We would keep orbiting in the exact same path, though we would freeze without sunlight!’',
        alt: 'Dr Afia holds up a model of the yellow Sun and a tiny dark sphere in the centre of Earth’s unchanged orbit.',
        motif: '☀️🌍',
        brief: 'Dr Afia holding a tabletop orbital model showing Earth on a circular wire track around a glowing yellow Sun sphere, comparing it to a tiny black marble of the same mass.',
        narration: 'Emphatic and clear on "A black hole is not a vacuum cleaner" and "Earth would not get sucked in at all".',
      },
      {
        text: '‘Then what makes a black hole so special?’ asked Adwoa. ‘Extreme density,’ replied Dr Afia. ‘Gravity depends on both mass and distance. When a giant star many times heavier than our Sun runs out of nuclear fuel, its core collapses under its own weight, cramming enormous mass into a tiny space.’',
        alt: 'On the planetarium dome, a massive blue star exhausts its fuel and its core collapses inward under gravity.',
        motif: '⭐⬇️',
        brief: 'Planetarium projection showing a massive glowing blue star whose central core is collapsing inward with bright golden light trails (no text), watched by Adwoa and Kofi.',
        narration: 'Measured and dramatic. Emphasise "Extreme density" and "collapses under its own weight".',
      },
      {
        text: 'Dr Afia picked up a tennis ball. ‘On Earth, if you throw this ball upward at eleven kilometres per second, it escapes Earth’s gravity into space. We call that escape velocity. The more mass you pack into a smaller radius, the faster the escape velocity becomes.’',
        alt: 'Dr Afia tosses a yellow tennis ball upward in her hand as Kofi and Adwoa watch its arc.',
        motif: '🎾🚀',
        brief: 'Dr Afia tossing a bright yellow tennis ball gently upward in the planetarium classroom while Kofi and Adwoa follow its path.',
        narration: 'Clear, step-by-step explanation of escape velocity.',
      },
      {
        text: '‘Around a black hole,’ Dr Afia continued, ‘gravity becomes so intense close to the centre that the escape velocity exceeds three hundred thousand kilometres per second, the speed of light! Since nothing in the universe can travel faster than light, nothing that crosses that boundary can ever escape. Scientists call that one-way boundary the event horizon.’',
        alt: 'A diagram on the dome shows light rays bending near a black hole and unable to escape inside the spherical event horizon.',
        motif: '⚫💡',
        brief: 'Glowing visual projection showing golden beams of light curving around a dark sphere; beams outside curve past, while beams crossing the inner boundary spiral in (no words or labels).',
        narration: 'Slow and clear on "three hundred thousand kilometres per second" and "event horizon".',
      },
      {
        text: '‘Note that the event horizon is not a solid wall you could knock on,’ Dr Afia added, stretching a dark elastic cloth over a round hoop and placing a heavy brass weight in the middle. ‘According to Albert Einstein’s general relativity, mass curves the fabric of spacetime. Near a black hole, spacetime is curved so steeply that all paths inside the event horizon lead inward.’',
        alt: 'Dr Afia places a heavy brass sphere on a stretched dark fabric hoop while Kofi rolls a small marble along the curved dip.',
        motif: '🕳️🔮',
        brief: 'Hands-on demonstration table: a dark elastic fabric stretched over a large circular hoop with a heavy brass sphere pressing a deep funnel in the centre; Kofi rolls a glass marble in an orbit around the dip.',
        narration: 'Thoughtful and clear. Emphasise how mass curves spacetime.',
      },
      {
        text: 'Adwoa frowned thoughtfully. ‘If no light can escape from inside the event horizon, then a black hole is completely dark. How can astronomers prove it is really there instead of just making it up?’ ‘Brilliant question!’ said Dr Afia. ‘We detect an invisible giant by observing how it affects the universe around it.’',
        alt: 'Adwoa raises her hand with a thoughtful expression while Dr Afia points to four evidence panels on the screen.',
        motif: '🕵️‍♀️🔭',
        brief: 'Adwoa asking a sharp question beside Kofi, while Dr Afia smiles encouragingly in front of the planetarium console.',
        narration: 'Warm praise on "Brilliant question!".',
      },
      {
        text: '‘First,’ said Dr Afia, ‘astronomers tracked stars near the centre of our Milky Way for over twenty-five years. One star, called S2, whips around an completely empty-looking spot at thousands of kilometres per second! Using Kepler’s and Newton’s laws, the star’s orbit proves that four million solar masses are concentrated inside that tiny dark region, which we call Sagittarius A-Star.’',
        alt: 'The dome displays elliptical golden star orbits looping tightly around an unseen central point in the Milky Way.',
        motif: '💫🔄',
        brief: 'Planetarium dome showing bright golden elliptical loop tracks of stars orbiting tightly around an unseen central dark point (no text), as Kofi checks his calculator.',
        narration: 'Exciting and precise. Pronounce "Sagittarius A-Star" clearly.',
      },
      {
        text: '‘Second,’ she continued, ‘when gas and dust spiral toward a black hole, friction heats the swirling accretion disk to millions of degrees, making it shine fiercely in X-rays before it crosses the event horizon. Third, when two black holes collide, they send ripples through spacetime called gravitational waves, first detected in twenty fifteen!’',
        alt: 'Two visual scenes glow side by side: a bright orange swirling accretion disk and blue ripples of gravitational waves from two merging black holes.',
        motif: '🌀〰️',
        brief: 'Two glowing scientific visualisations on the dome: a fiery orange swirling disk around a dark shadow, and concentric blue ripples radiating from two orbiting black spheres (no text).',
        narration: 'Energetic and clear across the second and third lines of evidence.',
      },
      {
        text: '‘And in twenty nineteen and twenty twenty-two,’ Dr Afia said proudly, ‘the Event Horizon Telescope linked radio dishes across the globe to capture the first real images of the glowing orange ring of gas framing the dark shadow of M87-Star and our own Milky Way’s Sagittarius A-Star!’ Kofi’s eyes widened at the famous orange-ring photograph.',
        alt: 'Kofi and Adwoa admire the famous glowing orange ring image of a supermassive black hole’s shadow on the planetarium screen.',
        motif: '🟠📸',
        brief: 'Kofi and Adwoa looking in awe at the iconic glowing orange ring surrounding a dark central shadow displayed on the main planetarium screen (no text).',
        narration: 'Sense of awe and triumph at global radio astronomy teamwork.',
      },
      {
        text: '‘Do scientists know what happens at the very centre inside a black hole?’ asked Kofi. ‘Not yet!’ said Dr Afia honestly. ‘General relativity predicts a point of infinite density, while quantum mechanics rules the tiniest particles. Physicists are still searching for a unified theory of quantum gravity to explain what truly happens deep inside, and how information escapes. Perhaps you two will help solve it!’ The end.',
        alt: 'Outside the Ghana Planetarium at twilight, Kofi and Adwoa smile with Dr Afia under the first evening stars.',
        motif: '🌠🤝',
        brief: 'Twilight outside the Ghana Planetarium dome in Accra: Kofi holding his sketchbook, Adwoa beside him, and Dr Afia smiling warmly under an indigo sky with bright evening stars.',
        narration: 'Honest, inspiring close. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'bh-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What would happen to Earth’s orbit if the Sun were suddenly replaced by a black hole of the exact same mass?',
        options: [
          'Earth would keep orbiting in the exact same path around it',
          'Earth would be sucked into the centre like a vacuum cleaner',
          'Earth would fly straight out of the Milky Way galaxy',
          'The black hole would chase the planets around the solar system',
        ],
        correctIndex: 0,
        explanation: 'Black holes are not cosmic vacuum cleaners; at the same distance, a black hole exerts the same gravitational pull as a star of equal mass.',
      },
      {
        id: 'bh-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'horizon',
        definition: 'In astronomy, the event horizon is the one-way boundary around a black hole where escape velocity equals the speed of light.',
        distractors: [
          'A solid iron shell built around a star',
          'The bright surface of a normal yellow star',
        ],
      },
      {
        id: 'bh-c2',
        type: 'comprehension',
        afterPage: 11,
        question: 'Which of these is real observational evidence that astronomers use to detect and study black holes?',
        options: [
          'Star orbits, X-rays from accretion disks, gravitational waves and EHT images',
          'Sending astronauts with flashlights inside the event horizon and back',
          'Listening to sound waves travelling through the vacuum of space',
          'Ancient legends written before telescopes existed',
        ],
        correctIndex: 0,
        explanation: 'Astronomers combine stellar orbit tracking, X-ray observations of accretion disks, gravitational-wave detectors (LIGO/Virgo), and the Event Horizon Telescope.',
      },
      {
        id: 'bh-c3',
        type: 'comprehension',
        afterPage: 12,
        question: 'Why do physicists say that what happens at the very centre inside a black hole is still an unresolved question?',
        options: [
          'Scientists still need a unified theory combining relativity and quantum physics',
          'Astronomers have never detected any black holes in space',
          'Telescopes cannot see the Milky Way galaxy from Earth',
          'Gravity stops working outside the solar system',
        ],
        correctIndex: 0,
        explanation: 'General relativity and quantum mechanics clash at extreme scales inside the event horizon, making quantum gravity an active frontier of research.',
      },
      {
        id: 'bh-pred',
        type: 'prediction',
        afterPage: 7,
        prompt: 'In the stretched-cloth model, what happens when you roll a marble fast near the outer edge versus rolling it slowly right toward the steep dip?',
      },
      {
        id: 'bh-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Put these steps in order showing how a stellar-mass black hole forms and is detected.',
        items: [
          'A massive star exhausts its nuclear fuel after millions of years.',
          'The star’s core collapses under gravity into an extremely dense region.',
          'An event horizon forms where escape velocity exceeds light speed.',
          'Astronomers detect it via star orbits, X-rays or gravitational waves.',
        ],
      },
      {
        id: 'bh-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How do you feel when a scientist admits "We do not know yet" and explains how researchers are working to find out?',
        feelingOptions: ['Curious', 'Respectful', 'Inspired', 'Motivated'],
      },
    ],
    glossary: [
      { word: 'gravity', definition: 'The universal force of attraction between all objects with mass or energy.', pages: [3, 4, 5, 6, 12] },
      { word: 'density', definition: 'How much mass is packed into a given volume of space.', pages: [4, 12] },
      { word: 'velocity', definition: 'Speed in a given direction; escape velocity is the speed needed to break free from gravity.', pages: [5, 6] },
      { word: 'horizon', definition: 'In "event horizon", the boundary around a black hole beyond which light cannot escape.', pages: [6, 7, 8, 10] },
      { word: 'spacetime', definition: 'The four-dimensional fabric combining three dimensions of space and one dimension of time.', pages: [7, 10] },
      { word: 'accretion', definition: 'The coming together of gas and matter under gravity into a swirling disk around a massive object.', pages: [10] },
    ],
    teacherGuide: {
      overview:
        'Set at the Ghana Planetarium in Accra, this JHS 2–3 story demystifies black holes using clear physics: debunking the "cosmic vacuum cleaner" myth, explaining escape velocity and the event horizon, presenting four independent lines of observational evidence (stellar orbits around Sagittarius A*, X-ray accretion disks, gravitational waves, and Event Horizon Telescope radio imaging), and highlighting open questions in quantum gravity.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain why a black hole is not a cosmic vacuum cleaner and how its gravity at a large distance matches any star of equal mass.',
        'Define escape velocity and explain why light cannot escape from inside the event horizon.',
        'Describe four real astronomical methods used to detect black holes (stellar orbits, accretion-disk X-rays, gravitational waves, and EHT shadow imaging).',
        'Distinguish established relativistic physics from unresolved questions about quantum gravity and the interior of black holes.',
      ],
      subjectLinks: [
        { subject: 'Science (JHS)', link: 'Forces, gravity, light, the solar system, stars and galaxies.', status: 'to-verify' },
        { subject: 'Mathematics (JHS)', link: 'Speed, distance, time, large numbers, and inverse-square relationships.', status: 'to-verify' },
        { subject: 'English Language (JHS)', link: 'Complex informational and narrative reading comprehension, scientific argumentation.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If you throw a stone straight up, why does it come back down? How fast would you have to launch a rocket so it never falls back to Earth?"',
        'Ask what learners have seen about black holes in movies or cartoons, and list their ideas on the board to test against evidence in the story.',
      ],
      whileReading: [
        'Pause after page 3 to check understanding of the Sun-replacement thought experiment.',
        'Pause after page 11 to review the four independent lines of evidence that prove black holes exist even though the interior is dark.',
      ],
      afterReading: [
        'Revisit the movie myths on the board and have learners correct each one using scientific evidence from the story.',
      ],
      discussion: [
        'Why does Earth not get pulled into the Sun right now, and how does that same principle apply to stars orbiting a black hole at a safe distance?',
        'Where does the stretched-cloth model of spacetime work well, and what are its limitations? (See Analogy Note in the Fact-Check Sheet.)',
        'Why did the Event Horizon Telescope need radio dishes spread across multiple continents to photograph M87* and Sagittarius A*?',
      ],
      reflection: [
        'How does learning how scientists detect invisible objects in space change the way you think about solving hard problems using indirect clues?',
      ],
      mathsExtension: [
        {
          task: 'Earth’s escape velocity is about 11 km/s, while the speed of light is about 300,000 km/s. Approximately how many times faster than Earth’s escape velocity is the speed of light? (Round to the nearest thousand.)',
          answer: '300,000 ÷ 11 ≈ 27,273, or about 27,000 times faster.',
        },
        {
          task: 'Sagittarius A* is about 26,000 light-years away from Earth. How many years does it take for light or radio waves from the centre of the Milky Way to reach our telescopes?',
          answer: '26,000 years (because 1 light-year is the distance light travels in 1 year).',
        },
      ],
      differentiation: {
        support: [
          'Use the stretched-cloth and marble demonstration in class so learners can physically see stable orbits far from the central weight versus capture close to the steep centre.',
        ],
        stretch: [
          'Research and write a short paragraph on how Ghana’s 32-metre Kuntunse Radio Telescope contributes to Very Long Baseline Interferometry (VLBI) networks in Africa.',
        ],
      },
      culturalNotes: [
        'The Ghana Planetarium in Accra has inspired thousands of Ghanaian schoolchildren in astronomy and space science.',
        'Kofi, Adwoa, and Afia Boateng are Akan names.',
      ],
      localiseThis: [
        'Connect to the Ghana Planetarium (Accra) and the Ghana Radio Astronomy Observatory (Kuntunse).',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Stellar-mass black holes form from the gravitational collapse of massive stars, and supermassive black holes (millions to billions of solar masses) reside at the centres of most large galaxies, including Sagittarius A* in the Milky Way.',
          'Outside the event horizon, a black hole’s gravitational field obeys Einstein’s general relativity (and approximates Newton’s law of gravitation at large distances).',
          'Astronomers have verified black holes through stellar orbits (2020 Nobel Prize in Physics), gravitational waves (LIGO/Virgo, 2015), X-ray accretion disks, and EHT horizon-scale images (2019, 2022).',
        ],
        whatWeAreStillDiscovering: [
          'Physicists do not yet have a complete, experimentally verified theory of quantum gravity to describe what replaces the classical "singularity" inside a black hole.',
          'The black hole information paradox—how quantum information is preserved when a black hole slowly evaporates via Hawking radiation—remains an active theoretical question.',
          'Astronomers are still investigating using the James Webb Space Telescope how the earliest supermassive black holes grew so rapidly in the young universe.',
        ],
      },
      investigation: {
        title: 'Model Gravity and Orbits on a Stretched Cloth',
        materials: [
          'A large plastic basin or bucket (or four students holding the corners of a stretchy cloth taut)',
          'A piece of stretchy T-shirt fabric or lycra cloth',
          'A heavy smooth stone or metal ball',
          'Two or three small glass marbles',
        ],
        steps: [
          'Stretch the cloth smoothly and tightly across the top of the basin (or have four learners hold the edges tight and level).',
          'Roll a small marble straight across the flat cloth and observe that it travels in a straight line.',
          'Place the heavy stone in the middle so the cloth curves downward into a funnel, then roll the small marble sideways near the outer edge at a moderate speed so it curves in an orbit around the stone.',
          'Now roll the marble very slowly or aim it closely at the steep central dip and observe how it spirals inward.',
        ],
        whatToNotice:
          'At a safe distance with enough sideways speed, the marble orbits around the heavy mass without getting "sucked in"; only paths that pass too close or too slowly fall into the steep central well.',
        safetyNote:
          'Hold the heavy stone carefully so it does not drop onto toes, and keep small marbles off the floor so nobody slips.',
      },
      factCheck: [
        {
          claim: 'Replacing the Sun with a black hole of equal mass would not suck in the Earth; Earth would maintain its orbit.',
          explanation: 'By Birkhoff’s theorem in general relativity (and Newton’s shell theorem), the external gravitational field at distances much greater than the Schwarzschild radius (r_s ≈ 3 km for 1 solar mass) is identical to that of the Sun.',
          analogyNote: 'The stretched-cloth analogy helps visualise how mass curves spacetime, but teachers should clarify that real spacetime is 4-dimensional (not a 2D sheet) and balls on a cloth slow down due to friction, whereas space is nearly frictionless.',
          reference: 'NASA Black Hole Safety & Myths FAQ; Thorne, K. S. (1994), Black Holes and Time Warps.',
        },
        {
          claim: 'Sagittarius A* (~4 million solar masses) and M87* have been confirmed through stellar orbits, gravitational waves, and Event Horizon Telescope radio interferometry.',
          explanation: 'Ghez et al. and Genzel et al. tracked star S2 orbiting Sgr A* (2020 Nobel Prize); LIGO detected binary black hole mergers in 2015 (GW150914); the EHT Collaboration published direct shadow images of M87* (2019) and Sgr A* (2022).',
          reference: 'Event Horizon Telescope Collaboration (2019, 2022), Astrophysical Journal Letters; Nobel Prize in Physics 2017 & 2020 Scientific Background.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Mature, engaging Ghanaian English storyteller (`Kore`) for JHS 2–3.',
      pace: 'Medium (about 135 words per minute).',
      notes: [
        'Use phonetic hints for Kofi, Adwoa, Afia, and Boateng while keeping standard written spellings.',
      ],
    },
    music: 'Optional subtle cosmic synth pad, off by default.',
    culturalNotes: [
      'Highlights the Ghana Planetarium in Accra and Ghanaian participation in modern astrophysics.',
    ],
    reviewQuestions: [
      'Confirm that the distinction between the event horizon and the unresolved interior (quantum gravity) is clear for JHS 2–3.',
    ],
  },

  // ====================================================================================================================
  // 5. The Tree That Saved Our Playground (Primary 1-2, 8 pages, Shade, Temperature, Trees & Teamwork)
  // ====================================================================================================================
  {
    key: 'the-tree-that-saved-our-playground',
    set: 'extension',
    title: 'The Tree That Saved Our Playground',
    summary:
      'When the sunny side of their school playground becomes too hot at break time, seven-year-old Kwame and his classmates discover how their big neem tree cools the air and work together to plant and care for new shade trees.',
    classification: base({
      classIds: ['primary-1', 'primary-2'],
      ageMin: 6,
      ageMax: 8,
      readingLevel: 'early',
      difficulty: 2,
      genres: ['science', 'school-life', 'educational'],
      themes: ['school', 'farm-and-garden', 'helping-others', 'community'],
      objectives: ['scientific-curiosity', 'environmental-awareness', 'teamwork', 'responsibility', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 240,
    }),
    palette: ['#dcfce7', '#16a34a'],
    characters: [
      'Kwame: a seven-year-old Ghanaian boy in Primary 2, wearing a cheerful yellow-and-brown check school shirt and brown shorts.',
      'Abena: his six-year-old classmate in Primary 1, braided hair with green ribbons, wearing the same yellow-and-brown school uniform.',
      'Madam Akua: their kind Primary 2 teacher, wearing a bright green patterned dress and carrying a classroom thermometer.',
    ],
    pages: [
      {
        text: 'At midday break, the sun shone brightly over the school playground. Seven-year-old Kwame and his friend Abena wanted to play ampe, but the bare dusty ground felt hot under their sandals. ‘Phew!’ said Kwame, wiping his forehead. ‘The sunny side of the yard is too hot today!’',
        alt: 'Kwame and Abena stand on the sunny, dusty side of their school playground wiping their foreheads under the bright sun.',
        motif: '☀️🥵',
        brief: 'Bright sunny schoolyard in Ghana. Kwame (7, yellow-and-brown check school shirt, brown shorts) and Abena (6, green hair ribbons, same uniform) standing on bare sunny soil wiping their foreheads.',
        narration: 'Warm and expressive. Perform a gentle "Phew!" on Kwame’s line.',
      },
      {
        text: 'Across the yard stood One Big Neem Tree with wide green branches. All the children ran under its leafy roof. Underneath the tree, the ground felt cool and a gentle breeze touched their cheeks. ‘Why is it so much cooler under the tree?’ asked Abena.',
        alt: 'Kwame, Abena and their classmates stand comfortably in the wide green shade of a large neem tree.',
        motif: '🌳😌',
        brief: 'Large leafy green neem tree casting a wide circle of cool shade on the schoolyard; Kwame and Abena smiling with relief under the branches.',
        narration: 'Relaxed, cooling tone as they step into the shade.',
      },
      {
        text: 'Their teacher, Madam Akua, walked over holding two safe red-liquid thermometers. ‘Let us investigate like scientists!’ she smiled. They placed one thermometer on a shaded bench under the neem tree, and the second thermometer on a bench out in the direct sunshine.',
        alt: 'Madam Akua shows Kwame and Abena two red-liquid classroom thermometers to compare the shade and the sun.',
        motif: '🌡️👩‍🏫',
        brief: 'Madam Akua (bright green patterned dress) kneeling with Kwame and Abena under the neem tree, holding two simple red-liquid classroom thermometers.',
        narration: 'Bright, encouraging voice for Madam Akua.',
      },
      {
        text: 'After ten minutes, they checked both thermometers. Out in the sun, the red line had climbed high, to thirty-six degrees! Under the neem tree, the red line stayed much lower, at thirty degrees. ‘The tree made the air six degrees cooler!’ cheered Kwame.',
        alt: 'Kwame and Abena look closely at the two thermometers, seeing the lower red line in the shade.',
        motif: '📉🎉',
        brief: 'Close view of Kwame and Abena comparing two simple thermometer cards side by side (one with a taller red bar and one with a shorter red bar, no text or numbers) while Madam Akua smiles.',
        narration: 'Clear emphasis on "thirty-six degrees", "thirty degrees", and "six degrees cooler!".',
      },
      {
        text: '‘How does a tree cool the playground without a fan or electricity?’ asked Abena, touching a rough brown root. ‘In two clever ways,’ said Madam Akua. ‘First, the thick green leaves block the sun’s hot rays from baking the soil. That gives us shade.’',
        alt: 'Abena touches the trunk while looking up at the thick green canopy blocking the bright sunbeams.',
        motif: '🍃☂️',
        brief: 'Looking up into the lush green neem canopy where overlapping leaves block the bright golden sunbeams like a giant natural umbrella, with Abena and Kwame looking up.',
        narration: 'Curious question, then warm, clear explanation.',
      },
      {
        text: '‘Second,’ said Madam Akua, ‘roots drink water from the soil and send it up to the leaves. The leaves release tiny invisible drops of water vapour into the air. As that water evaporates, it cools the air around the tree, just like water cooling your skin after you wash your hands!’',
        alt: 'Madam Akua points from the tree’s roots up the trunk to the green leaves in the breeze.',
        motif: '💧🌬️',
        brief: 'Madam Akua tracing a hand from the tree roots up the trunk toward the fluttering green leaves, with soft blue sparkles suggesting cool moisture in the breeze.',
        narration: 'Slow and vivid so young children can picture water moving from roots to leaves.',
      },
      {
        text: 'Kwame looked back at the bare, hot side of the playground. ‘One tree cannot shade the whole school,’ he said. ‘Can we plant more trees so everyone has cool shade?’ ‘Yes!’ said Madam Akua. The next morning, the class worked as a team to dig holes, plant four young mango and neem saplings, and spread dry leaves around them as mulch to keep the soil damp.',
        alt: 'Kwame, Abena and their classmates work together digging, planting young saplings, and watering them with watering cans.',
        motif: '🌱🤝',
        brief: 'Sunny morning in the schoolyard: Kwame, Abena and classmates working together with Madam Akua to plant four young green saplings, spreading dry leaf mulch and watering them with watering cans.',
        narration: 'Energetic and proud rhythm of teamwork.',
      },
      {
        text: 'Every morning before class, Team Green gave the young saplings a drink of water and built small wooden guards to protect them from goats. Soon, shiny new leaves sprouted on every sapling! ‘One day,’ smiled Abena, ‘children who come after us will play in the cool shade we planted together.’ The end.',
        alt: 'Kwame and Abena water the thriving young saplings protected by neat wooden guards while smiling at each other.',
        motif: '🌳💚',
        brief: 'Warm morning light: Kwame and Abena watering a healthy young sapling with fresh bright-green leaves inside a neat wooden fence guard, with the big neem tree and happy schoolmates behind them.',
        narration: 'Warm, hopeful conclusion. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'tree-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Kwame and Abena discover when they checked the two thermometers?',
        options: [
          'The air under the neem tree was six degrees cooler than the air in the hot sun',
          'It was hotter under the tree than in the sun',
          'Both thermometers showed zero degrees',
          'Trees make the playground darker at night',
        ],
        correctIndex: 0,
        explanation: 'The thermometer in the sun read 36 degrees while the thermometer in the shade read 30 degrees—6 degrees cooler!',
      },
      {
        id: 'tree-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'What are the two ways a tree cools the playground?',
        options: [
          'Leaves block hot sunbeams for shade and release cooling water vapour',
          'It plugs into a wall socket and spins its branches like a fan',
          'It drops ice cubes onto the grass every afternoon',
          'It pushes the sun behind a mountain',
        ],
        correctIndex: 0,
        explanation: 'Tree leaves block direct sunlight (shade) and release moisture from the soil that evaporates and cools the air.',
      },
      {
        id: 'tree-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'thermometer',
        definition: 'A tool used to measure how hot or cold something is.',
        distractors: [
          'A bucket used to carry soil',
          'A wooden fence around a young tree',
        ],
      },
      {
        id: 'tree-ph',
        type: 'phonics',
        afterPage: 7,
        targetSound: 'sh',
        prompt: 'Which words start with the sh sound, like shade?',
        options: ['shade', 'shiny', 'tree', 'root'],
        correctIndexes: [0, 1],
      },
      {
        id: 'tree-pred',
        type: 'prediction',
        afterPage: 7,
        prompt: 'Why did the children spread dry leaves (mulch) around the base of the young saplings and build wooden guards?',
      },
      {
        id: 'tree-seq',
        type: 'sequencing',
        afterPage: 8,
        prompt: 'Put the playground story in order.',
        items: [
          'The bare playground feels too hot in the midday sun.',
          'Madam Akua and the class measure the temperature in the sun and in the shade.',
          'The children learn how leaves block sunlight and release cooling moisture.',
          'The class plants and waters four new saplings together.',
        ],
      },
      {
        id: 'tree-sel',
        type: 'sel',
        afterPage: 8,
        prompt: 'How does it feel to plant and care for a tree that will help other children in the future?',
        feelingOptions: ['Proud', 'Helpful', 'Happy', 'Caring'],
      },
    ],
    glossary: [
      { word: 'shade', definition: 'A cool, darker area where something blocks direct sunlight.', pages: [5, 7, 8] },
      { word: 'thermometer', definition: 'An instrument that measures temperature, how hot or cold the air is.', pages: [3] },
      { word: 'evaporates', definition: 'Turns from liquid water into invisible water vapour in the air, which cools the surface.', pages: [6] },
      { word: 'saplings', definition: 'Young, small trees that are growing.', pages: [7, 8] },
      { word: 'mulch', definition: 'A layer of dry leaves or grass spread over soil to keep moisture in.', pages: [7] },
    ],
    teacherGuide: {
      overview:
        'Designed for Primary 1–2 learners, this schoolyard story introduces practical observation and measurement (comparing temperatures in sun vs shade), explains in child-friendly terms how trees cool their surroundings through shade and transpiration/evaporation, and models environmental teamwork through tree planting and care.',
      lessonMinutes: 35,
      learningGoals: [
        'Observe and compare temperatures in direct sunlight versus under tree shade.',
        'Explain two ways trees help cool a compound: blocking direct solar rays (shade) and releasing moisture from leaves that evaporates (transpiration).',
        'Identify what young saplings need to survive (water, soil, sunlight, mulch to hold moisture, and protection from browsing animals).',
        'Work cooperatively with classmates to care for the school environment.',
      ],
      subjectLinks: [
        { subject: 'Science (Lower Primary)', link: 'Plants, sun and shade, temperature, and caring for the environment.', status: 'to-verify' },
        { subject: 'Our World Our People', link: 'School environment, teamwork, and tree planting.', status: 'to-verify' },
        { subject: 'Mathematics (Lower Primary)', link: 'Comparing numbers and finding the difference (36 − 30 = 6).', status: 'to-verify' },
      ],
      beforeReading: [
        'Look out of the classroom window and count how many trees are in the school compound.',
        'Ask learners: "Where do you like to stand during midday break on a very hot day? Why?"',
      ],
      whileReading: [
        'Pause after page 4 and count up together from 30 to 36 on fingers to find the 6-degree difference.',
        'Pause after page 6 and have learners blow gently on a damp hand to feel how evaporating water cools skin.',
      ],
      afterReading: [
        'Take a 5-minute walk around the school compound to identify a sunny spot that would benefit from a shade tree.',
      ],
      discussion: [
        'What happens to bare soil when the hot sun shines on it all day with no trees or grass?',
        'Why did the children water the saplings early in the morning and put dry leaves (mulch) around the soil?',
        'Why do young trees in Ghana often need a small fence or basket guard around them?',
      ],
      reflection: [
        'What is one thing you and your friends can do this week to care for plants or trees at school or at home?',
      ],
      mathsExtension: [
        {
          task: 'The temperature in the sun was 36 degrees and the temperature in the shade was 30 degrees. How many degrees cooler was the shade?',
          answer: '36 − 30 = 6 degrees cooler.',
        },
        {
          task: 'Team Green planted 4 saplings. If each sapling needs 2 cans of water in the morning, how many cans of water do they carry altogether?',
          answer: '2 + 2 + 2 + 2 = 8 cans of water (4 × 2 = 8).',
        },
      ],
      differentiation: {
        support: [
          'Do the damp-hand cooling test in class: wet the back of one hand with a drop of clean water, keep the other hand dry, wave both gently, and feel which hand feels cooler.',
        ],
        stretch: [
          'Draw a labelled picture of a tree showing the roots drinking water, the trunk carrying it up, and the leaves making shade and cool air.',
        ],
      },
      culturalNotes: [
        'Neem (Azadirachta indica) and mango trees are among the most common schoolyard and compound shade trees across Ghana; ampe is a beloved Ghanaian jumping and clapping game.',
        'Kwame, Abena, and Akua are Akan day names.',
      ],
      localiseThis: [
        'Name the specific shade trees growing in your own school compound (such as neem, mango, acacia, rain tree, or almond tree).',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Tree canopies intercept incoming solar radiation, reducing surface temperatures beneath them by several degrees Celsius compared to bare sunlit ground.',
          'Trees absorb water through their roots and release water vapour through tiny leaf pores (stomata) in a process called transpiration, which absorbs heat energy and cools surrounding air.',
          'Tree roots bind topsoil and reduce rainwater runoff and erosion on school compounds.',
        ],
        whatWeAreStillDiscovering: [
          'Urban foresters and climate scientists in West Africa are studying which native Ghanaian tree species cool towns best while surviving longer dry spells.',
        ],
      },
      investigation: {
        title: 'Compare Sun and Shade with Two Cups of Water',
        materials: [
          'Two identical plastic cups',
          'Clean water from the same bucket or tap',
          'A sunny spot and a shady spot under a tree or veranda',
          'A classroom thermometer (or clean fingers to compare warmth)',
        ],
        steps: [
          'Fill both cups halfway with water from the same bucket so they start at the exact same temperature.',
          'Place Cup A out in direct sunlight and Cup B in the shade under a tree for 30 minutes during morning lessons.',
          'After 30 minutes, bring both cups together and measure the water temperature with a thermometer (or touch the outside of each cup to compare).',
        ],
        whatToNotice:
          'Cup A from the direct sun feels noticeably warmer than Cup B from the shade, showing how shade blocks solar heat energy!',
        safetyNote:
          'Use plastic cups (not breakable glass), and stay in the shade as much as possible when setting out and collecting the cups at midday.',
      },
      factCheck: [
        {
          claim: 'Trees cool their surroundings both by blocking direct solar radiation (shade) and through evaporative cooling from transpiration.',
          explanation: 'Canopy shading reduces surface radiant heating, while latent heat of vaporization during leaf transpiration cools ambient air temperature (typically 2–8 °C cooler surface/local feel depending on soil moisture and canopy density).',
          reference: 'FAO Urban and Peri-Urban Forestry Guidelines; US EPA — Using Trees and Vegetation to Reduce Heat Islands.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, cheerful Ghanaian English storyteller (`Kore`) for Primary 1–2.',
      pace: 'Slow to medium (about 105 words per minute).',
      notes: [
        'Use phonetic hints for Kwame, Abena, and Akua while preserving standard written spellings.',
      ],
    },
    music: 'Optional cheerful schoolyard birdsong and soft acoustic guitar, off by default.',
    culturalNotes: [
      'Includes the Ghanaian playground game ampe and familiar compound shade trees (neem and mango).',
    ],
    reviewQuestions: [
      'Confirm that "evaporates" and "thermometer" are well-supported by the context and glossary for Primary 1–2.',
    ],
  },

  // ====================================================================================================================
  // 6. Akosua and the Rainfall Puzzle (Primary 4-5, 10 pages, Rainfall Measurement, Graphs, Weather vs Climate)
  // ====================================================================================================================
  {
    key: 'akosua-and-the-rainfall-puzzle',
    set: 'extension',
    title: 'Akosua and the Rainfall Puzzle',
    summary:
      'When her classmates argue about which day of the week had the heaviest rain in Koforidua, ten-year-old Akosua builds a proper rain gauge with her science teacher, records five days of millimetre data in a bar graph, and learns the difference between daily weather and long-term climate.',
    classification: base({
      classIds: ['primary-4', 'primary-5'],
      ageMin: 9,
      ageMax: 11,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['science', 'school-life', 'educational'],
      themes: ['weather', 'school', 'farm-and-garden'],
      objectives: ['scientific-curiosity', 'problem-solving', 'reasoning', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 340,
    }),
    palette: ['#e0f2fe', '#0284c7'],
    characters: [
      'Akosua: a ten-year-old Ghanaian girl in Primary 5, wearing a purple-and-white check school dress, neat braided hair with yellow beads, holding a ruler and weather logbook.',
      'Kojo: her ten-year-old classmate, wearing a purple-and-white school shirt and khaki shorts, energetic and quick to guess before measuring.',
      'Mr Boateng: their Primary 5 science teacher who volunteers with the Ghana Meteorological Agency (GMet), wearing a light blue shirt, glasses and carrying a rain gauge cylinder.',
    ],
    pages: [
      {
        text: 'On Monday morning in Koforidua, rain drummed loudly on the metal roof of the Primary Five classroom. ‘That was the biggest rainstorm of the whole year!’ declared Kojo at break time. Ten-year-old Akosua looked at the puddles in the yard. ‘It sounded loud on the roof, Kojo, but how do we know how much rain actually fell?’',
        alt: 'Akosua and Kojo stand on the school veranda in Koforidua watching rain drip from the roof into puddles.',
        motif: '🌧️🏫',
        brief: 'School veranda in Koforidua after a morning rain. Akosua (10, purple-and-white check school dress, braided hair with yellow beads, weather logbook) and Kojo (10, purple-and-white shirt, khaki shorts) looking at puddles in the schoolyard.',
        narration: 'Lively opening. Confident voice for Kojo, thoughtful and questioning for Akosua.',
      },
      {
        text: 'Kojo pointed to a wide flat basin under the roof gutter and a narrow bucket under the mango tree. ‘Let us just look in those!’ he said. Their science teacher, Mr Boateng, walked over shaking his head with a smile. ‘If a basin sits under a roof gutter or a dripping tree, it catches extra runoff. And if containers have different openings and slanted sides, we cannot compare the depth fairly!’',
        alt: 'Mr Boateng points out why a basin under a dripping roof gutter and a bucket under a tree give unfair rainfall readings.',
        motif: '🪣🌳',
        brief: 'Mr Boateng (light blue shirt, glasses) showing Akosua and Kojo why a basin overflowing under a roof spout and a bucket under a dripping mango tree do not measure rainfall fairly.',
        narration: 'Warm, clear explanation from Mr Boateng.',
      },
      {
        text: 'Mr Boateng showed the class a standard rain gauge from the school weather station. It had a funnel leading into a straight-sided clear measuring cylinder marked in millimetres. ‘Meteorologists at the Ghana Meteorological Agency measure rainfall depth in millimetres,’ he explained. ‘One millimetre of rain means that if the water did not soak in or flow away, it would form a layer one millimetre deep on flat ground.’',
        alt: 'Mr Boateng holds up a clear cylindrical rain gauge with a funnel while Akosua examines the scale with her ruler.',
        motif: '🧪📏',
        brief: 'Mr Boateng holding a transparent cylindrical rain gauge with a top funnel, while Akosua holds her ruler beside the graduated marks (no text or numbers on the image).',
        narration: 'Slow and clear on "Ghana Meteorological Agency" and "millimetres".',
      },
      {
        text: 'Together, Akosua and Kojo set up the rain gauge on a sturdy post in the middle of the open school grass, far away from buildings and trees so wind and splash would not spoil the reading. ‘Every morning at eight o’clock,’ said Akosua, opening her weather logbook, ‘we will kneel to eye level, read the bottom curve of the water, write it down, and empty the cylinder for the next day.’',
        alt: 'Akosua and Kojo mount the rain gauge on a wooden post in an open grassy area of the school compound.',
        motif: '🌱🌧️',
        brief: 'Open grassy area of the schoolyard far from trees and roofs: Akosua and Kojo securing the clear rain gauge onto a sturdy wooden post at chest height.',
        narration: 'Methodical and proud as Akosua explains the daily measurement rule.',
      },
      {
        text: 'Their five-day rainfall investigation began! Monday morning’s storm had left twelve millimetres of water in the cylinder. On Tuesday, the sun shone all day, so the reading was zero millimetres. On Wednesday, steady afternoon rain fell without loud thunder, filling the gauge to eighteen millimetres!',
        alt: 'Akosua kneels at eye level to read the water depth in the rain gauge cylinder while Kojo holds the weather logbook.',
        motif: '👀📓',
        brief: 'Close medium shot of Akosua kneeling at eye level beside the rain gauge post to read the water line accurately, while Kojo holds the open logbook and pencil.',
        narration: 'Count each day clearly: "twelve millimetres", "zero millimetres", "eighteen millimetres".',
      },
      {
        text: 'Kojo looked surprised on Wednesday. ‘Monday’s storm had much louder thunder, yet Wednesday brought eighteen millimetres while Monday only brought twelve! Subtracting twelve from eighteen shows Wednesday had six millimetres more rain!’ ‘That is why scientists measure instead of guessing from noise,’ smiled Akosua.',
        alt: 'Kojo looks surprised at the higher water level in the cylinder while Akosua smiles and points to her notebook.',
        motif: '😮📊',
        brief: 'Kojo looking surprised at the tall column of water in the clear rain gauge cylinder while Akosua smiles and points to her recorded notes.',
        narration: 'Surprise and realisation for Kojo: "eighteen minus twelve is six millimetres more".',
      },
      {
        text: 'On Thursday, a light morning shower measured six millimetres. On Friday, an evening downpour measured fourteen millimetres. In class, Akosua drew a neat bar graph on the board with the five days along the bottom and millimetres up the side. Then the class added all five days together: twelve plus zero, plus eighteen, plus six, plus fourteen equalled fifty millimetres in total!',
        alt: 'Akosua draws a colourful five-bar rainfall graph on the classroom board while Mr Boateng and Kojo check the total.',
        motif: '📊✏️',
        brief: 'Inside the classroom: Akosua drawing five vertical coloured bars of different heights on a grid on the board (no letters or numbers), with Wednesday’s bar the tallest and Tuesday’s flat, while Mr Boateng and Kojo watch.',
        narration: 'Read the addition clearly with a steady beat: "twelve plus zero, plus eighteen, plus six, plus fourteen equalled fifty millimetres".',
      },
      {
        text: '‘If we received fifty millimetres of rain across five days,’ asked Mr Boateng, ‘what was the average, or mean, rainfall per day?’ Kojo divided fifty by five in his head. ‘Ten millimetres per day!’ he answered. ‘Look how clearly the bar graph shows the wettest day, the driest day, and the pattern across the week.’',
        alt: 'Kojo raises his hand happily to answer while Akosua points to the bar graph.',
        motif: '🙋‍♂️🧮',
        brief: 'Kojo raising his hand with a big smile at his desk while Akosua stands by the colourful five-bar chart with a wooden pointer.',
        narration: 'Bright and clear on "fifty divided by five" and "Ten millimetres per day!".',
      },
      {
        text: '‘Does one rainy week in June mean Koforidua’s climate has changed?’ asked Akosua. ‘No,’ said Mr Boateng. ‘Weather is what the atmosphere does from day to day, like Monday’s storm or Tuesday’s sunshine. Climate is the long-term pattern of weather measured over thirty years or more! For example, southern Ghana has two rainy seasons each year, while northern Ghana has one long rainy season, followed by the dry Harmattan wind.’',
        alt: 'Mr Boateng points to a map of Ghana showing the rainy forest zone in the south and the savannah zone in the north.',
        motif: '🗺️🌦️',
        brief: 'Mr Boateng pointing to a colourful physical map of Ghana on the classroom wall (green southern forest belt and golden northern savannah belt, no text) while Akosua and Kojo listen.',
        narration: 'Clear contrast between "Weather" (day to day) and "Climate" (thirty years or more).',
      },
      {
        text: '‘When farmers and hydrologists compare thirty years of rain gauge records,’ Mr Boateng added, ‘they can see how global climate change is making some rainy seasons start later or fall in heavier bursts, and plan when to plant crops or store water.’ Akosua closed her weather logbook proudly. One small cylinder in the schoolyard had connected their class to scientists across Ghana! The end.',
        alt: 'At the school weather station, Akosua, Kojo and Mr Boateng smile together beside their rain gauge under a bright sky with cumulus clouds.',
        motif: '🌤️🤝',
        brief: 'Sunny afternoon at the school weather station in Koforidua: Akosua holding her weather logbook, Kojo beside the rain gauge post, and Mr Boateng smiling with them under a blue sky with white clouds.',
        narration: 'Proud, inspiring ending. Gentle pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'rain-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Where should a rain gauge be placed to get an accurate, fair measurement of rainfall?',
        options: [
          'In an open space away from trees and roofs, read at eye level each morning',
          'Directly under a roof gutter so it fills up faster',
          'Underneath a thick mango tree out of the wind',
          'Inside the classroom cupboard',
        ],
        correctIndex: 0,
        explanation: 'Placing the gauge in an open area prevents extra runoff from roofs or trees and avoids wind blockage.',
      },
      {
        id: 'rain-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'Monday had 12 mm of rain and Wednesday had 18 mm of rain. How many more millimetres fell on Wednesday than on Monday?',
        options: [
          '6 mm more on Wednesday',
          '30 mm more on Wednesday',
          '12 mm more on Monday',
          'They had the exact same amount',
        ],
        correctIndex: 0,
        explanation: '18 mm − 12 mm = 6 mm more rain on Wednesday.',
      },
      {
        id: 'rain-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'Across the five days (12 mm, 0 mm, 18 mm, 6 mm, and 14 mm), what were the total rainfall and the daily average?',
        options: [
          'Total of 50 mm, with an average of 10 mm per day',
          'Total of 40 mm, with an average of 8 mm per day',
          'Total of 18 mm, with an average of 18 mm per day',
          'Total of 100 mm, with an average of 20 mm per day',
        ],
        correctIndex: 0,
        explanation: '12 + 0 + 18 + 6 + 14 = 50 mm total; 50 mm ÷ 5 days = 10 mm per day.',
      },
      {
        id: 'rain-v1',
        type: 'vocabulary',
        afterPage: 9,
        word: 'climate',
        definition: 'The long-term pattern of weather in a place, measured over thirty years or more.',
        distractors: [
          'A single afternoon thunderstorm on a Monday',
          'The plastic funnel on top of a rain gauge',
        ],
      },
      {
        id: 'rain-pred',
        type: 'prediction',
        afterPage: 9,
        prompt: 'How do thirty-year rainfall records help Ghanaian farmers and dam engineers make good decisions?',
      },
      {
        id: 'rain-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put Akosua’s scientific investigation steps in order.',
        items: [
          'Akosua asks how to measure which day truly had the heaviest rain.',
          'The class sets up a rain gauge in an open area away from trees.',
          'Akosua and Kojo record the rainfall in millimetres at 8:00 a.m. daily.',
          'They draw a five-day bar graph and find the total and average.',
        ],
      },
      {
        id: 'rain-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did Kojo show a good scientific attitude when the measurements proved his first guess wrong?',
        feelingOptions: ['Open-minded', 'Curious', 'Honest', 'Happy'],
      },
    ],
    glossary: [
      { word: 'runoff', definition: 'Rainwater that flows over roofs or the ground instead of soaking in.', pages: [2] },
      { word: 'millimetres', definition: 'Units of length (one-thousandth of a metre) used to measure rainfall depth.', pages: [3, 5, 6, 7, 8] },
      { word: 'average', definition: 'A central value found by adding quantities together and dividing by how many there are.', pages: [8] },
      { word: 'weather', definition: 'The state of the atmosphere at a particular place and time from day to day.', pages: [3, 4, 9, 10] },
      { word: 'climate', definition: 'The average pattern of weather in a region over a long period, typically thirty years or more.', pages: [9, 10] },
    ],
    teacherGuide: {
      overview:
        'Set in Koforidua in the Eastern Region, this Upper Primary story integrates scientific observation, fair testing, data representation (bar graphs), verified arithmetic (addition, subtraction, and mean of 5-day rainfall data), and the foundational distinction between daily weather and long-term climate across Ghana’s ecological zones.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain why a rain gauge must have straight sides and be placed in an open site away from roofs and trees.',
        'Read and interpret a 5-day rainfall dataset in millimetres, calculate the total (50 mm), range (18 mm − 0 mm), and mean (10 mm/day), and represent the data on a bar graph.',
        'Clearly distinguish between daily weather and long-term climate (30+ year averages).',
        'Describe how rainfall records help farmers and water managers in Ghana.',
      ],
      subjectLinks: [
        { subject: 'Science (Upper Primary)', link: 'Weather elements, measuring instruments (rain gauge), and climate patterns.', status: 'to-verify' },
        { subject: 'Mathematics (Upper Primary)', link: 'Measurement in millimetres, data handling, bar graphs, addition, subtraction, and finding the mean.', status: 'to-verify' },
        { subject: 'Our World Our People / Social Studies', link: 'Seasonal rainfall zones of Ghana (southern bimodal vs northern unimodal rains, Harmattan).', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If a big bucket and a narrow straight jar stand side by side in the open rain, will the water be deeper in the bucket, deeper in the jar, or the same depth?" (Wait to revisit after page 3!)',
      ],
      whileReading: [
        'Pause after page 6 to check the subtraction: 18 mm − 12 mm = 6 mm.',
        'Pause after page 8 to verify the addition (12 + 0 + 18 + 6 + 14 = 50 mm) and division (50 ÷ 5 = 10 mm).',
      ],
      afterReading: [
        'Have every learner draw the 5-day bar graph in their exercise book with a ruler, labelling the horizontal axis (Monday to Friday) and the vertical axis (Rainfall in mm, counting by 2s from 0 to 20).',
      ],
      discussion: [
        'Why did Monday’s storm seem bigger to Kojo at first even though Wednesday brought more millimetres of rain?',
        'Why do meteorologists empty the rain gauge at the exact same time every morning after recording the reading?',
        'What is the difference between saying "It rained 18 mm on Wednesday" (weather) and saying "Southern Ghana has its major rainy season from April to July" (climate)?',
      ],
      reflection: [
        'When Have you changed your mind about an idea after checking real measurements or facts, just like Kojo did?',
      ],
      mathsExtension: [
        {
          task: 'Using Akosua’s 5-day data (Monday 12 mm, Tuesday 0 mm, Wednesday 18 mm, Thursday 6 mm, Friday 14 mm), how much rain fell on the first three days combined?',
          answer: '12 + 0 + 18 = 30 mm.',
        },
        {
          task: 'If Saturday had 10 mm of rain, what would be the new total for all 6 days, and what would the 6-day mean be?',
          answer: '50 + 10 = 60 mm total; 60 ÷ 6 = 10 mm per day.',
        },
      ],
      differentiation: {
        support: [
          'Use centimetre/millimetre rulers so learners can see how small 1 mm is (one-tenth of a centimetre) and mark 12 mm and 18 mm on paper strips.',
        ],
        stretch: [
          'Compare two weeks of rainfall data using a double bar chart and write three sentences comparing their totals and averages.',
        ],
      },
      culturalNotes: [
        'The Ghana Meteorological Agency (GMet) operates synoptic and agro-meteorological weather stations across all regions of Ghana.',
        'Akosua, Kojo, and Boateng are Akan names; Koforidua is the regional capital of the Eastern Region.',
      ],
      localiseThis: [
        'Discuss whether your school is in the southern bimodal rainfall zone (two wet seasons) or the northern unimodal rainfall zone (one wet season), and when farmers in your community plant maize, yam, or millet.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Rainfall depth is measured in millimetres using a standard funnel-and-cylinder rain gauge sited in an unobstructed open area.',
          'Weather describes short-term atmospheric conditions (hours to days), whereas climate describes statistical weather patterns over at least 30 years (WMO standard).',
          'Ghana’s seasonal rainfall is driven by the north-south movement of the Inter-Tropical Convergence Zone (ITCZ) / West African Monsoon.',
        ],
        whatWeAreStillDiscovering: [
          'Climate scientists at GMet and West African universities are studying how warming oceans in the Gulf of Guinea change the onset dates and intensity of extreme rainfalls for local farmers.',
        ],
      },
      investigation: {
        title: 'Build a Classroom Rain Gauge and Keep a 5-Day Log',
        materials: [
          'A clear, straight-sided 1.5-litre plastic bottle',
          'Scissors (used by the teacher)',
          'A handful of clean small pebbles or marbles',
          'A plastic ruler marked in millimetres (mm) and waterproof tape',
          'Water and a notebook',
        ],
        steps: [
          'Have the teacher cut the top curved shoulder off the plastic bottle (about one-third from the top).',
          'Place a 3 cm layer of pebbles in the bottom of the bottle to weight it down so wind cannot tip it over, and pour water in just to the top of the pebbles—mark that flat water line as your "0 mm" starting line.',
          'Tape a ruler vertically on the outside of the straight-sided bottle with the "0" mark aligned exactly with your starting water line, then invert the cut top into the bottle as a funnel.',
          'Place the gauge in an open spot outdoors during a rainy week, read how many millimetres the water rises above the 0 line at 8:00 a.m. each morning, refill/reset to the 0 line, and draw a 5-day bar graph!',
        ],
        whatToNotice:
          'Adding pebbles and filling water to a marked 0 line above the uneven bottle base gives a flat, straight-sided starting level so every millimetre of rain is measured accurately.',
        safetyNote:
          'Only the teacher should cut the plastic bottle and smooth any sharp plastic edges with tape; never go outside into an open field during active lightning or thunder—wait until the storm has passed to read the gauge.',
      },
      factCheck: [
        {
          claim: 'A standard rain gauge measures precipitation depth in millimetres in an unobstructed open location, and climate is defined over a 30-year baseline.',
          explanation: 'The World Meteorological Organization (WMO) defines precipitation depth in mm (1 mm = 1 litre per square metre) and uses 30-year climatological standard normals to distinguish climate from daily weather.',
          reference: 'World Meteorological Organization (WMO) Guide to Instruments and Methods of Observation (WMO-No. 8); Ghana Meteorological Agency (GMet) Educational Resources.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Clear, lively Ghanaian English storyteller (`Kore`) for Primary 4–5.',
      pace: 'Medium (about 120 words per minute); pause slightly around numbers so learners can follow the arithmetic.',
      notes: [
        'Use phonetic hints for Akosua, Kojo, and Boateng while keeping standard written spellings.',
      ],
    },
    music: 'Optional light rain-on-leaves opening and calm classroom ambience, off by default.',
    culturalNotes: [
      'Grounded in Koforidua (Eastern Region) and the work of the Ghana Meteorological Agency (GMet).',
    ],
    reviewQuestions: [
      'All arithmetic (18 − 12 = 6; 12 + 0 + 18 + 6 + 14 = 50; 50 ÷ 5 = 10) is verified.',
    ],
  },
];

