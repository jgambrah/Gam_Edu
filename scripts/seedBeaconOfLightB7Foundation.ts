import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function getFirestoreDb(): Promise<admin.firestore.Firestore> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const adminInst = (admin as any)?.apps ? admin : ((admin as any)?.default || require('firebase-admin'));
    if (!adminInst?.apps?.length) {
      adminInst.initializeApp({
        credential: adminInst.credential.applicationDefault(),
        projectId: 'gamedu-69888475-f5783'
      });
    }
    return adminInst.firestore();
  }

  // Use Firebase CLI OAuth credentials when running locally
  const { OAuth2Client } = require('google-auth-library');
  const { Firestore } = require('@google-cloud/firestore');
  const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }) as any;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ASSESSMENT_DATA: any = {
  "metadata": {
    "title": "Basic 7 Literature Diagnostic Lab - Foundation Tier",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 7 (JHS 1)",
    "tier": "Foundation",
    "total_questions": 42,
    "breakdown": {
      "section_a_objectives": 40,
      "section_b_theory_extracts": 2
    },
    "prescribed_texts": [
      "Kissiwaa \u2013 The Heroine (Joshlyn Yayra Diabo)",
      "A Medal from Grandpa (Adam Ankrah)",
      "Fly Like an Eagle",
      "The Family That Cared (Lucas Zanyoh)"
    ]
  },
  "objectives": [
    {
      "item_number": 1,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Recall & Plot Elements",
      "question": "What traditional board game serves as the central contest between Kissiwaa and Bediako?",
      "options": {
        "A": "Oware",
        "B": "Draughts",
        "C": "Chess",
        "D": "Ludo"
      },
      "correct_answer": "B",
      "explanation": "The central contest takes place on the communal draughts board known as Obunumankoma."
    },
    {
      "item_number": 2,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Recall & Setting",
      "question": "Which specific coastal location in Ghana serves as the primary setting for the environmental cleanup in 'A Medal from Grandpa'?",
      "options": {
        "A": "Titanic Beach",
        "B": "Labadi Pleasure Beach",
        "C": "Kokrobite Beach",
        "D": "Busua Beach"
      },
      "correct_answer": "A",
      "explanation": "The story takes place primarily at Titanic Beach in Ghana, where the protagonist witnesses environmental degradation."
    },
    {
      "item_number": 3,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Plot & Character Conflict",
      "question": "Which school subject causes Maame Tutuwa severe distress and feelings of self-doubt before her breakthrough?",
      "options": {
        "A": "Integrated Science",
        "B": "Social Studies",
        "C": "Mathematics",
        "D": "English Language"
      },
      "correct_answer": "C",
      "explanation": "Maame Tutuwa struggles with academic challenges specifically centered on mathematics."
    },
    {
      "item_number": 4,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Plot Catalysts",
      "question": "Why is Samuel initially mocked by several classmates during morning break?",
      "options": {
        "A": "He arrives late to school assembly",
        "B": "He wears torn school sandals",
        "C": "He stumbles while reading aloud",
        "D": "He eats a makeshift breakfast of gari and sachet water"
      },
      "correct_answer": "D",
      "explanation": "Samuel faces mockery from peers over his impoverished makeshift meal of gari and sachet water."
    },
    {
      "item_number": 5,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Who serves as the impartial moral arbiter and umpire during the draughts match?",
      "options": {
        "A": "Ababio",
        "B": "Old Soldier",
        "C": "Teacher Mensah",
        "D": "The Assemblyman"
      },
      "correct_answer": "B",
      "explanation": "Old Soldier serves as the umpire and moral guide who insists on fair play and civility."
    },
    {
      "item_number": 6,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Which teacher does the protagonist approach to propose the beach cleanup initiative?",
      "options": {
        "A": "Mr. Mensah",
        "B": "Mr. Owusu",
        "C": "Mr. Alhasan",
        "D": "Mr. Boateng"
      },
      "correct_answer": "C",
      "explanation": "The protagonist pitches the environmental project directly to their teacher, Mr. Alhasan."
    },
    {
      "item_number": 7,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "Where does Maame Tutuwa meet Akua and first encounter the inspirational book about eagles?",
      "options": {
        "A": "In a local bookstore",
        "B": "At the school library",
        "C": "Under the school verandah",
        "D": "At Auntie Ama's grocery shop"
      },
      "correct_answer": "A",
      "explanation": "Maame Tutuwa meets Akua in a bookstore, where she discovers the book about eagles."
    },
    {
      "item_number": 8,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Setting & Context",
      "question": "Where do Samuel and Abigail sit when she consoles him over his lunchtime distress?",
      "options": {
        "A": "Behind the school canteen",
        "B": "Under the sprawling branches of a large tree",
        "C": "Inside the empty assembly hall",
        "D": "Near the headteacher's office"
      },
      "correct_answer": "B",
      "explanation": "Under the tree serves as the comforting sanctuary where Samuel eats his breakfast and Abigail comforts him."
    },
    {
      "item_number": 9,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Setting & Symbolism",
      "question": "What is the name of the sacred tree in the village square under which the draughts match takes place?",
      "options": {
        "A": "Baobab",
        "B": "Odum",
        "C": "Nyamedua",
        "D": "Onyaa"
      },
      "correct_answer": "C",
      "explanation": "The village match is held in Asempayetia square directly under the Nyamedua tree."
    },
    {
      "item_number": 10,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "How are the protagonist's environmental cleanup efforts formally recognized in the wider community?",
      "options": {
        "A": "Through a national television documentary",
        "B": "Through a published newspaper article",
        "C": "By a municipal monetary award",
        "D": "With a chieftaincy title from the local elders"
      },
      "correct_answer": "B",
      "explanation": "The cleanup initiative receives formal public recognition through a published newspaper feature."
    },
    {
      "item_number": 11,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Climax & Resolution",
      "question": "What critical event marks the turning point of Maame Tutuwa's confidence in class?",
      "options": {
        "A": "Winning an inter-school debate",
        "B": "Earning an athletics medal",
        "C": "Reading a poem aloud during assembly",
        "D": "Solving a challenging math problem on the chalkboard"
      },
      "correct_answer": "D",
      "explanation": "The narrative climax occurs when Maame Tutuwa steps forward and successfully solves the difficult math problem."
    },
    {
      "item_number": 12,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "Why is Abigail motivated to defend and comfort Samuel when others tease him?",
      "options": {
        "A": "She is Samuel's biological sister",
        "B": "She has experienced similar poverty and emotional scars in her past",
        "C": "She was ordered by Mrs. Adjei to be the class monitor",
        "D": "She wanted to win a school prize for good conduct"
      },
      "correct_answer": "B",
      "explanation": "Abigail relates deeply to Samuel because she has endured past trauma and childhood hunger pangs herself."
    },
    {
      "item_number": 13,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Symbolism & Lexis",
      "question": "What historic name is inscribed upon or given to the communal draughts board in Asempayetia?",
      "options": {
        "A": "Obunumankoma",
        "B": "Osei Tutu",
        "C": "Sankofa",
        "D": "Yaa Asantewaa"
      },
      "correct_answer": "A",
      "explanation": "The communal board carries the name Obunumankoma, symbolizing historical wisdom and tactical strategy."
    },
    {
      "item_number": 14,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Which literature teacher delivers the classroom lesson titled 'The Family That Cared'?",
      "options": {
        "A": "Mrs. Owusu",
        "B": "Ms. Konadu",
        "C": "Mrs. Adjei",
        "D": "Auntie Ama"
      },
      "correct_answer": "C",
      "explanation": "Mrs. Adjei conducts the English lesson on 'The Family That Cared', fostering empathy among her pupils."
    },
    {
      "item_number": 15,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does Grandpa's heirloom medal symbolize to the protagonist?",
      "options": {
        "A": "Grandpa's legacy, moral endurance, and family pride",
        "B": "A gold currency token for high school fees",
        "C": "A military citation for battlefield bravery",
        "D": "A trophy won in a municipal swimming competition"
      },
      "correct_answer": "A",
      "explanation": "The medal represents Grandpa's life lessons, enduring legacy, and pride in civic initiative."
    },
    {
      "item_number": 16,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "Identify the literary device used in: 'Her marbles lined up like elite soldiers.'",
      "options": {
        "A": "Metaphor",
        "B": "Simile",
        "C": "Personification",
        "D": "Apostrophe"
      },
      "correct_answer": "B",
      "explanation": "The comparison uses 'like' to compare draughts pieces to soldiers, making it a simile."
    },
    {
      "item_number": 17,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What figure of speech is present in: 'Loneliness wrapped around her like a dark cloud'?",
      "options": {
        "A": "Simile",
        "B": "Metaphor",
        "C": "Hyperbole",
        "D": "Oxymoron"
      },
      "correct_answer": "A",
      "explanation": "Comparing the feeling of loneliness to a dark cloud using 'like' is an explicit simile."
    },
    {
      "item_number": 18,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "Identify the figure of speech used in the line: 'The classroom became a sanctuary.'",
      "options": {
        "A": "Simile",
        "B": "Personification",
        "C": "Metaphor",
        "D": "Synecdoche"
      },
      "correct_answer": "C",
      "explanation": "Directly asserting that the classroom is a sanctuary without comparative words ('like' or 'as') is a metaphor."
    },
    {
      "item_number": 19,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "When the restored shore is described as a 'hopeful paradise', which literary device is used?",
      "options": {
        "A": "Metaphor",
        "B": "Irony",
        "C": "Euphemism",
        "D": "Onomatopoeia"
      },
      "correct_answer": "A",
      "explanation": "Equating the clean beach to a 'hopeful paradise' is a direct metaphor."
    },
    {
      "item_number": 20,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What figure of speech is used in: 'Maame Tutuwa's stomach growled in anticipation'?",
      "options": {
        "A": "Metonymy",
        "B": "Personification",
        "C": "Litotes",
        "D": "Simile"
      },
      "correct_answer": "B",
      "explanation": "Attributing human anticipation to an involuntary body organ is personification."
    },
    {
      "item_number": 21,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What literary technique is featured in: 'They were a family bound by shared humanity, woven together by threads of joy and sorrow'?",
      "options": {
        "A": "Simile",
        "B": "Metaphor",
        "C": "Paradox",
        "D": "Alliteration"
      },
      "correct_answer": "B",
      "explanation": "Comparing the school pupils to a family and relationships to woven fabric without 'like' or 'as' is an extended metaphor."
    },
    {
      "item_number": 22,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "Identify the literary device in: 'Maame Tutuwa's hand shot up by itself.'",
      "options": {
        "A": "Personification",
        "B": "Simile",
        "C": "Irony",
        "D": "Understatement"
      },
      "correct_answer": "A",
      "explanation": "Giving the physical hand autonomous power and human agency is personification."
    },
    {
      "item_number": 23,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Literary Techniques",
      "question": "The expression 'Like a Ghanaian proverb, Abigail's words spoke truth and wisdom' employs which literary device?",
      "options": {
        "A": "Allusion",
        "B": "Parody",
        "C": "Pun",
        "D": "Sarcasm"
      },
      "correct_answer": "A",
      "explanation": "Explicitly referencing the wisdom tradition of Ghanaian oral folklore functions as an allusion."
    },
    {
      "item_number": 24,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "In '...her radiant smile dispelling the evening\u2019s gloom', Maame Tutuwa's smile is metaphorically compared to:",
      "options": {
        "A": "An eagle's beak",
        "B": "A sharp breeze",
        "C": "A shining, illuminating light",
        "D": "A flowing mountain river"
      },
      "correct_answer": "C",
      "explanation": "The metaphor compares her radiant smile directly to an illuminating light that dispels darkness."
    },
    {
      "item_number": 25,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Sensory Imagery",
      "question": "The phrase 'The aroma of steaming jollof rice and grilled chicken' appeals directly to which senses?",
      "options": {
        "A": "Kinetic and visual",
        "B": "Auditory and tactile",
        "C": "Olfactory and gustatory",
        "D": "Visual and tactile"
      },
      "correct_answer": "C",
      "explanation": "Describing scents and tastes appeals specifically to olfactory (smell) and gustatory (taste) sensory imagery."
    },
    {
      "item_number": 26,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "Which combination of literary devices is present in: 'The words wove a spell of empathy, wrapping around their hearts like a warm blanket'?",
      "options": {
        "A": "Personification and Simile",
        "B": "Metaphor and Oxymoron",
        "C": "Alliteration and Onomatopoeia",
        "D": "Hyperbole and Pun"
      },
      "correct_answer": "A",
      "explanation": "'Words wove' personifies words as weavers, while 'like a warm blanket' forms a simile."
    },
    {
      "item_number": 27,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "Describing the sea and ocean waves as active entities capable of feeling and acting with human purpose is an example of:",
      "options": {
        "A": "Personification",
        "B": "Hyperbole",
        "C": "Simile",
        "D": "Understatement"
      },
      "correct_answer": "A",
      "explanation": "Attributing human qualities and agency to inanimate natural elements like waves is personification."
    },
    {
      "item_number": 28,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "The line 'The book transported her to vast savannas, rugged mountains, and serene forests' uses metaphor to compare:",
      "options": {
        "A": "Classroom desks to trees",
        "B": "Her mathematics textbook to a prison",
        "C": "The act of reading to a physical journey",
        "D": "Akua's friendship to an eagle's nest"
      },
      "correct_answer": "C",
      "explanation": "The text directly equates reading the book to experiencing a literal, physical journey."
    },
    {
      "item_number": 29,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Literary Devices",
      "question": "What device is illustrated when Jerry, who mocked Samuel's breakfast, later needs Samuel's support after misreading in class?",
      "options": {
        "A": "Dramatic Monologue",
        "B": "Situational Irony",
        "C": "Foreshadowing",
        "D": "Bathos"
      },
      "correct_answer": "B",
      "explanation": "It is situationally ironic when the teaser unexpectedly finds himself vulnerable and reliant on the victim's grace."
    },
    {
      "item_number": 30,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Literary Techniques",
      "question": "What narrative device is used when the text reveals Abigail's past childhood hunger pangs through her memories?",
      "options": {
        "A": "Flashback",
        "B": "Foreshadowing",
        "C": "Epilogue",
        "D": "Soliloquy"
      },
      "correct_answer": "A",
      "explanation": "Presenting past events through a character's interior memories constitutes a flashback."
    },
    {
      "item_number": 31,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Narrative Technique",
      "question": "From which narrative point of view is 'A Medal from Grandpa' told?",
      "options": {
        "A": "Third-Person Omniscient",
        "B": "Third-Person Limited",
        "C": "Second-Person Objective",
        "D": "First-Person Narrative"
      },
      "correct_answer": "D",
      "explanation": "The story is narrated directly by the young protagonist using the first-person perspective ('I', 'we')."
    },
    {
      "item_number": 32,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Narrative Technique",
      "question": "What is the narrative point of view used in 'Fly Like an Eagle'?",
      "options": {
        "A": "Third-Person Limited",
        "B": "First-Person Central",
        "C": "Second-Person Subjective",
        "D": "Third-Person Omniscient"
      },
      "correct_answer": "A",
      "explanation": "The narrative is written in third-person limited, focusing closely on Maame Tutuwa's internal thoughts and feelings."
    },
    {
      "item_number": 33,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Narrative Technique",
      "question": "Which narrative point of view is utilized in 'The Family That Cared'?",
      "options": {
        "A": "First-Person Eyewitness",
        "B": "Third-Person Limited",
        "C": "Third-Person Omniscient",
        "D": "First-Person Protagonist"
      },
      "correct_answer": "C",
      "explanation": "The narrator operates omnisciently, knowing and revealing the internal motivations of Samuel, Abigail, and Mrs. Adjei."
    },
    {
      "item_number": 34,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "In 'A Medal from Grandpa', what does the accumulation of trash on Titanic Beach primarily represent?",
      "options": {
        "A": "Civic apathy, neglect, and environmental degradation",
        "B": "Industrial growth in Accra",
        "C": "A natural occurrence caused by sea currents",
        "D": "Lack of waste recycling machinery in Ghana"
      },
      "correct_answer": "A",
      "explanation": "The accumulated shoreline garbage symbolizes human neglect, apathy, and environmental ruin."
    },
    {
      "item_number": 35,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What do the eagle and its soaring flight symbolize throughout Maame Tutuwa's journey?",
      "options": {
        "A": "Freedom, strength, patience, and personal empowerment",
        "B": "Physical dominance over academic competitors",
        "C": "Escaping from family duties into isolation",
        "D": "A literal transition to life in the wilderness"
      },
      "correct_answer": "A",
      "explanation": "The eagle symbolizes patience, focus, strength, and soaring above life's limitations."
    },
    {
      "item_number": 36,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does the large tree in the schoolyard symbolize in 'The Family That Cared'?",
      "options": {
        "A": "Physical punishment and discipline",
        "B": "Strict academic rules and regulations",
        "C": "Comfort, protection, and understanding",
        "D": "Social division and playground barriers"
      },
      "correct_answer": "C",
      "explanation": "The tree's shade provides a physical haven symbolizing emotional solace, security, and mutual care."
    },
    {
      "item_number": 37,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Symbolism & Culture",
      "question": "What does the Nyamedua tree signify within the cultural setting of Asempayetia?",
      "options": {
        "A": "Divinely witnessed justice, truth, and community cohesion",
        "B": "A physical fortress against enemy warfare",
        "C": "Agricultural abundance and rainfall fertility",
        "D": "An exclusively male assembly post"
      },
      "correct_answer": "A",
      "explanation": "The Nyamedua (God's tree) represents divine presence, sacred assembly, and moral justice."
    },
    {
      "item_number": 38,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Setting & Mood",
      "question": "What atmosphere is established in the home setting of Maame Tutuwa?",
      "options": {
        "A": "Strict, demanding, and stressful",
        "B": "Cozy, nurturing, warm, and supportive",
        "C": "Distant, quiet, and emotionally detached",
        "D": "Chaotic, noisy, and competitive"
      },
      "correct_answer": "B",
      "explanation": "The home setting provides a cozy, nurturing atmosphere of emotional support and security."
    },
    {
      "item_number": 39,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Tone",
      "question": "Which trio of adjectives accurately reflects the overall tone of 'A Medal from Grandpa'?",
      "options": {
        "A": "Pessimistic, satirical, and bitter",
        "B": "Inspirational, reflective, and heartwarming",
        "C": "Suspenseful, humorous, and ironic",
        "D": "Solemn, mournful, and tragic"
      },
      "correct_answer": "B",
      "explanation": "The tone of the story is defined as inspirational, reflective, and heartwarming."
    },
    {
      "item_number": 40,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What overarching message is reinforced when the classroom becomes a supportive community?",
      "options": {
        "A": "Individual competition is the key to academic success",
        "B": "Teachers are solely responsible for solving student poverty",
        "C": "Empathy, kindness, and human solidarity break down social barriers",
        "D": "Classroom rules are more effective than emotional understanding"
      },
      "correct_answer": "C",
      "explanation": "The story emphasizes that kindness, active compassion, and mutual understanding transform relationships and bridge divides."
    }
  ],
  "theory": [
    {
      "item_number": 41,
      "text": "The Family That Cared (Lucas Zanyoh)",
      "strand": "Prose Extract & Appreciation",
      "extract": "They were a family bound by shared humanity, woven together by threads of joy and sorrow. The classroom became a sanctuary, a place where they found solace and support.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the narrative perspective (point of view) used in the story.",
          "marks": 1,
          "expected_answer": "Third-Person Omniscient narrative perspective (an all-knowing third-person narrator)."
        },
        {
          "label": "(b)",
          "question": "Identify the two main figures of speech used in the extract.",
          "marks": 2,
          "expected_answer": "Metaphor (comparing the class to a family, relationships to woven fabric, or the room to a sanctuary) and Personification ('bound by shared humanity' / words weaving empathy)."
        },
        {
          "label": "(c)",
          "question": "State the specific classroom incident that triggered the transformation of the pupils into a supportive community.",
          "marks": 3,
          "expected_answer": "Samuel was mocked by his classmates for bringing a makeshift breakfast of gari and sachet water. Abigail intervened with empathy, and Mrs. Adjei reinforced compassion through her English lesson on 'The Family That Cared'."
        },
        {
          "label": "(d)",
          "question": "Explain how Jerry's character evolves from the beginning of the narrative to the climax.",
          "marks": 4,
          "expected_answer": "Jerry begins as a thoughtless jokester who participates in teasing Samuel. After experiencing vulnerability himself when making a reading mistake, his defensive jokester facade falls away. He becomes a compassionate friend who actively assists Abigail in bringing and sharing food for Samuel."
        }
      ]
    },
    {
      "item_number": 42,
      "text": "A Medal from Grandpa (Adam Ankrah)",
      "strand": "Prose Extract & Appreciation",
      "extract": "The beach, once choked with neglect, stood transformed into a hopeful paradise under the afternoon sun. Grandpa held out his worn brass medal, its weight carrying years of quiet endurance.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Name the specific coastal setting where the beach restoration took place.",
          "marks": 1,
          "expected_answer": "Titanic Beach in Ghana."
        },
        {
          "label": "(b)",
          "question": "Identify the figure of speech used in the phrase 'choked with neglect'.",
          "marks": 1,
          "expected_answer": "Personification (or Metaphor)."
        },
        {
          "label": "(c)",
          "question": "Identify the figure of speech used in the phrase 'hopeful paradise'.",
          "marks": 1,
          "expected_answer": "Metaphor."
        },
        {
          "label": "(d)",
          "question": "What does the 'worn brass medal' symbolize in the story?",
          "marks": 3,
          "expected_answer": "It symbolizes Grandpa's moral legacy, life endurance, family pride, and the celebration of selfless civic problem-solving."
        },
        {
          "label": "(e)",
          "question": "State two concrete actions taken by the protagonist that brought about the transformation of the beach.",
          "marks": 4,
          "expected_answer": "First, the protagonist refused to remain passive and formally presented a cleanup proposal to their teacher, Mr. Alhasan. Second, the protagonist organized peers, helped establish school environmental clubs, and physically led the cleanup of the shoreline."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB7Foundation() {
  console.log("Seeding Basic 7 Foundation Practice Lab for The Beacon of Light Anthology...");
  const db = await getFirestoreDb();

  const allItems: any[] = [];

  // Generate balanced target positions for 40 objective questions (10 A, 10 B, 10 C, 10 D)
  const targetPositions: number[] = [];
  for (let i = 0; i < 10; i++) targetPositions.push(0);
  for (let i = 0; i < 10; i++) targetPositions.push(1);
  for (let i = 0; i < 10; i++) targetPositions.push(2);
  for (let i = 0; i < 10; i++) targetPositions.push(3);
  const shuffledTargetPositions = shuffleArray(targetPositions);

  // 1. Process Section A: 40 Objectives
  ASSESSMENT_DATA.objectives.forEach((item: any, index: number) => {
    const qNum = item.item_number;
    const correctLetter = item.correct_answer;
    const correctOptionText = (item.options as any)[correctLetter];

    const targetPos = shuffledTargetPositions[index];
    const otherOptionTexts = shuffleArray(
      Object.entries(item.options)
        .filter(([key]) => key !== correctLetter)
        .map(([, val]) => val as string)
    );

    const finalOptions: string[] = [];
    let otherIdx = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === targetPos) {
        finalOptions.push(correctOptionText);
      } else {
        finalOptions.push(otherOptionTexts[otherIdx++]);
      }
    }

    const qNumStr = qNum < 10 ? "0" + qNum : "" + qNum;
    allItems.push({
      id: `B7_BL_F_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "foundation",
      category: "Prose Analysis",
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Recall key details and literary devices in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Demonstrate comprehension of prescribed The Beacon of Light prose texts (${item.text}), analyzing plot, setting, figures of speech, characterization, and symbolism.`
    });
  });

  // Verify option balance
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  allItems.forEach(it => {
    const idx = it.options.indexOf(it.correctAnswer);
    if (idx === 0) dist.A++;
    else if (idx === 1) dist.B++;
    else if (idx === 2) dist.C++;
    else if (idx === 3) dist.D++;
  });
  console.log(`   📊 Shuffled Option Distribution (40 Items): A: ${dist.A}, B: ${dist.B}, C: ${dist.C}, D: ${dist.D}`);

  // 2. Process Section B: 2 Theory Extracts (Items 41 and 42)
  ASSESSMENT_DATA.theory.forEach((item: any, index: number) => {
    const qNum = item.item_number;
    const theoryIdx = index + 1;

    let subQuestionsFormatted = "";
    item.sub_questions.forEach((sq: any) => {
      subQuestionsFormatted += `\n${sq.label} ${sq.question} [${sq.marks} mark${sq.marks > 1 ? "s" : ""}]`;
    });

    let modelAnswerFormatted = "";
    item.sub_questions.forEach((sq: any) => {
      modelAnswerFormatted += `\n${sq.label} ${sq.expected_answer} [${sq.marks} mark${sq.marks > 1 ? "s" : ""}]`;
    });

    const promptText = `📖 PRESCRIBED TEXT EXTRACT:\n"${item.extract}"\n— ${item.text}\n\n❓ COMPREHENSIVE APPRECIATION QUESTIONS (Total: ${item.total_marks} Marks):${subQuestionsFormatted}`;

    allItems.push({
      id: `B7_BL_F_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B7",
      difficulty: "foundation",
      category: "Prose Extract & Appreciation",
      title: `${item.text} - Prose Appreciation`,
      shortSummary: `Detailed literary appreciation and extract analysis for '${item.text}' (10 Marks).`,
      extract: item.extract,
      subQuestions: item.sub_questions,
      prompt: promptText,
      points: item.total_marks,
      rubric: {
        totalMarks: item.total_marks,
        timeAllowedMinutes: 15,
        criteria: {
          content: {
            name: "content",
            displayName: "Textual Comprehension & Factual Accuracy",
            maxMarks: 5,
            scoringGuidelines: item.sub_questions.map((sq: any) => `${sq.label} ${sq.question} (${sq.marks}m)`),
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Accurately answers sub-question ${sq.label}`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Terminology & Clarity",
            maxMarks: 5,
            scoringGuidelines: ["Appropriate use of literary terminology (metaphor, point of view, personification, symbolism)"],
            diagnosticChecklist: ["Clear sentence construction with precise literary phrasing"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Carefully examine the extract from '${item.text}' to identify literary devices, narrative voice, and character developments.`,
      competencyTarget: `${item.strand} Appreciation: Extract Analysis & Literary Synthesis`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Analyze prose extracts from The Beacon of Light, identifying narrative point of view, figures of speech, plot progression, and moral character evolution.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (40 Objective + 2 Theory Extracts)`);

  const labPayload = {
    level: "B7",
    difficulty: "foundation",
    title: "Basic 7 Literature Diagnostic Lab: The Beacon of Light Anthology (Foundation Tier)",
    totalItemsCount: allItems.length,
    objectiveDrillsCount: 40,
    structuredEssaysCount: 2,
    sections: {
      objective: {
        startIndex: 0,
        endIndex: 39,
        count: 40,
        format: "multiple_choice"
      },
      theory: {
        startIndex: 40,
        endIndex: 41,
        count: 2,
        format: "structured_essay",
        allowsDirectTopicFlipping: true,
        topicList: ASSESSMENT_DATA.theory.map((t: any, idx: number) => ({
          questionNumber: t.item_number,
          theoryIndex: idx + 1,
          id: `B7_BL_F_TH_${t.item_number}`,
          title: `${t.text} - Prose Appreciation`,
          category: "Prose Extract & Appreciation",
          shortSummary: `Extract analysis and comprehension of ${t.text}`
        }))
      }
    },
    tasks: allItems,
    questions: allItems,
    metadata: {
      curriculum: "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
      strand: "Strand 1: Oral Language & Literature",
      subStrand: "Sub-Strand 2: The Beacon of Light Anthology & Literary Devices",
      prescribedTexts: ASSESSMENT_DATA.metadata.prescribed_texts,
      totalQuestions: allItems.length,
      updatedAt: new Date().toISOString()
    }
  };

  const targetDocIds = [
    'beacon_of_light_anthology_literary_devices',
    'cockcrow_literary_devices'
  ];
  const targetCols = ['topical', 'topics', 'topical_units'];

  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B7_foundation`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // Update parent doc practice pool for B7 low/foundation
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b7: {
            practicePool: {
              low: allItems.map(item => ({
                id: item.id,
                section: item.section,
                type: item.type,
                format: item.format,
                category: item.category,
                points: item.points
              }))
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool to: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 42 items for The Beacon of Light B7 Foundation Lab!`);
}

seedBeaconOfLightB7Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Foundation Lab:", err);
    process.exit(1);
  });
