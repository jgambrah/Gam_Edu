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
    "title": "Basic 9 Literature Diagnostic Assessment Lab - Foundation Tier (100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 9 (JHS 3)",
    "tier": "Foundation",
    "total_questions": 100,
    "breakdown": {
      "section_a_objectives": 90,
      "section_b_theory_extracts": 10
    },
    "prescribed_texts": [
      "A Beacon of Light (Novella)",
      "Spreading Light (Contemporary Drama)",
      "The Golden Stool / Okomfo Anokye (Poetry)",
      "The Unseen Painter (Poetry)",
      "Beyond Light and Shadow (Prose Narrative)",
      "Real Illusioned Beckley (Poetry)",
      "Oliver Asks for More (Classical Prose Excerpt)",
      "Mark Antony Mourns Caesar (Classical Drama Excerpt)"
    ]
  },
  "objectives": [
    {
      "item_number": 1,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Setting & Plot",
      "question": "From which rural settlement does Osmond commence his journey before relocating to urban Accra?",
      "options": {
        "A": "Karaga",
        "B": "Daakye Asem",
        "C": "Obane",
        "D": "Tema Gulf City"
      },
      "correct_answer": "C",
      "explanation": "Osmond's humble beginnings and musical development originate in the rural village of Obane."
    },
    {
      "item_number": 2,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Motivation",
      "question": "What primary motive drives Kwansah to sabotage the solar project designed by his classmates?",
      "options": {
        "A": "He wanted to sell the copper wiring for cash",
        "B": "Intense jealousy and an underlying sense of inadequacy regarding Asantewaa's success",
        "C": "Sir Nii instructed him to test the system's security",
        "D": "He feared electrical fire hazards in the classroom square"
      },
      "correct_answer": "B",
      "explanation": "Kwansah is motivated by petty jealousy, insecurity, and resentment of Asantewaa's academic and technical achievements."
    },
    {
      "item_number": 3,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Figures of Speech",
      "question": "Which literary term describes using the word 'Stool' to signify the entire sovereign Ashanti realm?",
      "options": {
        "A": "Synecdoche",
        "B": "Oxymoron",
        "C": "Onomatopoeia",
        "D": "Hyperbole"
      },
      "correct_answer": "A",
      "explanation": "Using a representative physical object (the Stool) to denote the collective nation and people is synecdoche."
    },
    {
      "item_number": 4,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Form & Design",
      "question": "What verse format characterizes the structural composition of 'The Unseen Painter'?",
      "options": {
        "A": "Strict Shakespearean sonnet",
        "B": "Free verse without a rigid end-rhyme scheme",
        "C": "Ballad meter in alternating quatrains",
        "D": "Monorhyming heroic couplets"
      },
      "correct_answer": "B",
      "explanation": "The poem is crafted in free verse, allowing natural cadence and unrhymed fluidity."
    },
    {
      "item_number": 5,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Setting & Plot",
      "question": "What is the name of the troubled educational institution where the narrative is staged?",
      "options": {
        "A": "Karaga Senior High School",
        "B": "Cedar of Lebanon School",
        "C": "Gulf City Academy",
        "D": "Golden Voice Institute"
      },
      "correct_answer": "B",
      "explanation": "The setting is Cedar of Lebanon School, a campus struggling under fear and intimidation."
    },
    {
      "item_number": 6,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Setting & Context",
      "question": "In which industrial urban enclave is the legend of Dr. Beckley situated?",
      "options": {
        "A": "Tema Gulf City",
        "B": "Kumasi Central Market",
        "C": "Obane Quarters",
        "D": "Daakye River Basin"
      },
      "correct_answer": "A",
      "explanation": "The poem is rooted in the urban lore and secluded mansions of the Tema Gulf City area."
    },
    {
      "item_number": 7,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Plot Milestone",
      "question": "Why is young Oliver chosen by the boys in the dining hall to ask for an extra portion of gruel?",
      "options": {
        "A": "He was the oldest and strongest apprentice in the workhouse",
        "B": "Lots were cast among the famished boys, and the duty fell to him by lot",
        "C": "Mrs. Mann instructed him to test the board's generosity",
        "D": "He volunteered to impress the beadle"
      },
      "correct_answer": "B",
      "explanation": "Desperate from starvation, the boys cast lots, and Oliver drew the straw compelling him to walk up to the master."
    },
    {
      "item_number": 8,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Setting & Context",
      "question": "In what historical setting and year does Mark Antony deliver his public funeral oration?",
      "options": {
        "A": "Athens during the Peloponnesian War (404 BC)",
        "B": "The Roman Forum in 44 BC, following Caesar's assassination",
        "C": "Alexandria in Egypt under Cleopatra's court (30 BC)",
        "D": "The Roman Senate House during Pompey's reign"
      },
      "correct_answer": "B",
      "explanation": "The confrontation takes place in the public marketplace/forum of Rome in 44 BC immediately following Julius Caesar's death."
    },
    {
      "item_number": 9,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Which influential educator and mentor assists Osmond in polishing his raw singing talent?",
      "options": {
        "A": "Mrs. Janet Acquah",
        "B": "Ms. Adjei",
        "C": "Mrs. Mann",
        "D": "Alheri"
      },
      "correct_answer": "B",
      "explanation": "Ms. Adjei provides dedicated musical guidance and encouragement to nurture Osmond's vocal talent."
    },
    {
      "item_number": 10,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Dynamics",
      "question": "How does Asantewaa overturn conventional communal expectations through her academic pursuit?",
      "options": {
        "A": "She becomes a professional singer in Accra",
        "B": "She takes the lead in electrical engineering and renewable solar innovation",
        "C": "She abandons modern schooling to manage local trade",
        "D": "She rejects all assistance from male classmates"
      },
      "correct_answer": "B",
      "explanation": "Asantewaa shatters gender stereotypes by excelling in technical STEM problem-solving in a rural setting."
    },
    {
      "item_number": 11,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Central Historical Figure",
      "question": "Who is portrayed in the poem as the spiritual priest bridging the heavenly and earthly spheres?",
      "options": {
        "A": "Elder Onyimdze",
        "B": "Okomfo Anokye",
        "C": "Chief Daakye Asem",
        "D": "Prince Dawuni"
      },
      "correct_answer": "B",
      "explanation": "Okomfo Anokye is celebrated as the legendary high priest whose invocations brought forth the Golden Stool."
    },
    {
      "item_number": 12,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Metaphor",
      "question": "What central metaphor governs the entire thematic progression of 'The Unseen Painter'?",
      "options": {
        "A": "The universe as an ocean full of predatory sharks",
        "B": "The Creator depicted as a master artist painting a cosmic canvas",
        "C": "Human existence as an unbending clock",
        "D": "Life as an exhausting morning rush hour"
      },
      "correct_answer": "B",
      "explanation": "The primary figurative device is viewing God as an artisan/painter who decorates the world with natural and human variety."
    },
    {
      "item_number": 13,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Who functions as the sinister student cabal terrorizing students at Cedar of Lebanon?",
      "options": {
        "A": "The Potters Gold Syndicate",
        "B": "Ashes Flame",
        "C": "The Gulf City Guardians",
        "D": "The Roman Plebeians"
      },
      "correct_answer": "B",
      "explanation": "Ashes Flame is the clandestine gang responsible for bullying, disorder, and intimidation on campus."
    },
    {
      "item_number": 14,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Imagery & Setting",
      "question": "What physical barrier isolates Dr. Beckley's mansion from the surrounding neighborhood?",
      "options": {
        "A": "A deep water-filled moat",
        "B": "Secluded high walls and overgrown tall grasses",
        "C": "A dense line of modern electronic tollgates",
        "D": "A ring of municipal police checkpoints"
      },
      "correct_answer": "B",
      "explanation": "The mansion is enclosed by high perimeter walls and secluded amidst wild grasses, creating an air of secrecy."
    },
    {
      "item_number": 15,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "How does Mrs. Mann abuse her position as parish farm caretaker?",
      "options": {
        "A": "She forces children to attend night classes",
        "B": "She embezzles maintenance allowances meant to feed the orphans while feigning deep affection",
        "C": "She donates workhouse funds to rival schools",
        "D": "She permits children to roam the streets without chores"
      },
      "correct_answer": "B",
      "explanation": "Dickens satirizes Mrs. Mann's hypocrisy: she pockets parish funds and starves the children while pretending tenderness."
    },
    {
      "item_number": 16,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Devices",
      "question": "What rhetorical phrase does Antony repeatedly employ with growing verbal irony to undermine the conspirators?",
      "options": {
        "A": "'Caesar was an autocrat'",
        "B": "'Brutus is an honourable man'",
        "C": "'Rome belongs to the senators'",
        "D": "'Weep for your fallen master'"
      },
      "correct_answer": "B",
      "explanation": "By relentlessly repeating that Brutus is an 'honourable man,' Antony steadily converts a literal compliment into an indictment of treachery."
    },
    {
      "item_number": 17,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What cultural garment does Osmond proudly wear during his public breakthrough in Accra?",
      "options": {
        "A": "A European woolen business suit",
        "B": "Traditional Ghanaian handwoven Kente cloth",
        "C": "A modern academic gown",
        "D": "An imported naval blazer"
      },
      "correct_answer": "B",
      "explanation": "Wearing authentic Kente symbolizes cultural grounding, dignity, and national identity on a national platform."
    },
    {
      "item_number": 18,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Mentorship",
      "question": "Who serves as the inspiring teacher guiding the pupils toward scientific experimentation?",
      "options": {
        "A": "Mr. Bumble",
        "B": "Dr. Iddrisu",
        "C": "Sir Nii",
        "D": "Uncle Ato"
      },
      "correct_answer": "C",
      "explanation": "Sir Nii is the dedicated village educator whose classroom square activities stimulate inquiry and teamwork."
    },
    {
      "item_number": 19,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Symbolic Resonance",
      "question": "What does the sacred Golden Stool fundamentally represent in Akan historical consciousness?",
      "options": {
        "A": "An ordinary seat crafted for royal durbars",
        "B": "The spiritual authority, collective soul, and unity of the nation",
        "C": "The kingdom's store of foreign export bullion",
        "D": "A trophy captured during coastal wars"
      },
      "correct_answer": "B",
      "explanation": "The Golden Stool (Sika Dwa Kofi) embodies the spiritual soul, political sovereignty, and cohesion of the Ashanti people."
    },
    {
      "item_number": 20,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Focus",
      "question": "How does 'The Unseen Painter' address racial and ethnic prejudice?",
      "options": {
        "A": "By arguing that certain pigments are superior on the canvas",
        "B": "By presenting distinct racial complexions as harmonious, deliberate brushstrokes on God's universal canvas",
        "C": "By demanding that everyone dress in uniform clothing",
        "D": "By separating ethnic groups into different galleries"
      },
      "correct_answer": "B",
      "explanation": "The poet views all racial varieties (black, white, Indian, Caucasian) as intentional artistic touches within divine creation."
    },
    {
      "item_number": 21,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Plot Milestone",
      "question": "What decisive act by Mrs. Janet Acquah proves her personal dedication to transforming Cedar of Lebanon?",
      "options": {
        "A": "She hires armed guards from outside Kansas",
        "B": "She enrolls her biological daughter, Tina Bells, into the troubled student body",
        "C": "She expels all senior prefects without an investigation",
        "D": "She demolishes the school's boundary fencing"
      },
      "correct_answer": "B",
      "explanation": "Mrs. Acquah inspires confidence and demonstrates faith in the school by enrolling her own daughter, Tina Bells."
    },
    {
      "item_number": 22,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Tone & Atmosphere",
      "question": "Which combination of adjectives best reflects the prevailing mood in 'Real Illusioned Beckley'?",
      "options": {
        "A": "Joyful and celebratory",
        "B": "Eerie, suspenseful, and reflective",
        "C": "Satirical and comical",
        "D": "Mournful and defeated"
      },
      "correct_answer": "B",
      "explanation": "The text generates an eerie, suspenseful atmosphere saturated with childhood anxiety and rumor."
    },
    {
      "item_number": 23,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Literary Satire",
      "question": "What visual image conveys the workhouse boys' chronic starvation?",
      "options": {
        "A": "Spilling excess food across dining tables",
        "B": "Polishing the wooden gruel bowls with their spoons until they shone",
        "C": "Refusing to report to the kitchen staff",
        "D": "Hiding bread loaves inside their dormitories"
      },
      "correct_answer": "B",
      "explanation": "Dickens highlights their starvation by noting that the bowls never required washing because the boys scraped them clean."
    },
    {
      "item_number": 24,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Audience Psychology",
      "question": "How are the Roman commoners (plebeians) portrayed during the funeral speeches?",
      "options": {
        "A": "Steadfast scholars committed to written republican statutes",
        "B": "A volatile, impressionable crowd easily swayed by emotional rhetoric and self-interest",
        "C": "Armed conspirators loyal to Pompey's relatives",
        "D": "Silent bystanders who refuse to take sides"
      },
      "correct_answer": "B",
      "explanation": "The plebeians are fickle political pawns, quickly shifting loyalty from Brutus to Antony based on emotional appeals."
    },
    {
      "item_number": 25,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the thematic core of Osmond's musical signature song, 'Someone to Lean On'?",
      "options": {
        "A": "Personal wealth and individual ambition",
        "B": "Gratitude, mutual human support, and uplifting others",
        "C": "The inevitability of defeat in urban centers",
        "D": "Military victory over rival musicians"
      },
      "correct_answer": "B",
      "explanation": "The anthem celebrates interdependence, gratitude to mentors, and compassionate support for struggling peers."
    },
    {
      "item_number": 26,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Plot Progression",
      "question": "Where does the recovery of the stolen solar panels occur?",
      "options": {
        "A": "Inside the sacred royal grove",
        "B": "Along the village path, exposing Kwansah and his complicit mother",
        "C": "At a commercial hardware store in Accra",
        "D": "In the headteacher's private office"
      },
      "correct_answer": "B",
      "explanation": "The stolen materials are tracked along the public village path, uncovering Kwansah's deceit in front of the community."
    },
    {
      "item_number": 27,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Setting Symbolism",
      "question": "What symbolic threshold is marked by the 'twilight's hush' in the poem?",
      "options": {
        "A": "The complete collapse of traditional kingdoms",
        "B": "The meeting point between the physical world and the ancestral spiritual realm",
        "C": "The end of agricultural harvesting seasons",
        "D": "The arrival of European colonial gunboats"
      },
      "correct_answer": "B",
      "explanation": "Twilight represents the liminal boundary where the physical earth meets the divine and ancestral forces."
    },
    {
      "item_number": 28,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Sensory Devices",
      "question": "What imagery evokes life, growth, and fertility in 'The Unseen Painter'?",
      "options": {
        "A": "An abandoned desert battlefield",
        "B": "A pregnant woman and a mother with a cuddled child in the sun",
        "C": "A dark cellar with rusty padlocks",
        "D": "A silent museum hall"
      },
      "correct_answer": "B",
      "explanation": "Images of maternity and children basking in sunlight celebrate fertility, care, and continuous creation."
    },
    {
      "item_number": 29,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Plot Twists",
      "question": "What unexpected secret identity is revealed concerning Benson, the charismatic head prefect?",
      "options": {
        "A": "He was an undercover police investigator",
        "B": "He lived a double life as a leader within the Ashes Flame cabal",
        "C": "He was the biological son of Mrs. Janet Acquah",
        "D": "He was secretly enrolled at an overseas academy"
      },
      "correct_answer": "B",
      "explanation": "The dramatic plot twist reveals that the head prefect was simultaneously entangled as a leader within Ashes Flame."
    },
    {
      "item_number": 30,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Figures of Speech",
      "question": "Identify the figure of speech in the line: 'The quiet house lived'.",
      "options": {
        "A": "Simile",
        "B": "Personification",
        "C": "Hyperbole",
        "D": "Alliteration"
      },
      "correct_answer": "B",
      "explanation": "Attributing the living quality of breathing life to an inanimate architectural structure is personification."
    },
    {
      "item_number": 31,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "How do the workhouse board members view the pauper boys under their custody?",
      "options": {
        "A": "As cherished future leaders of the British Empire",
        "B": "As lazy, ungrateful burdens whose hunger must be suppressed to discourage poverty",
        "C": "As gifted artisans in need of technical universities",
        "D": "As innocent victims of industrial economic depression"
      },
      "correct_answer": "B",
      "explanation": "The board callously treats the poor as moral failures who must be starved into compliance."
    },
    {
      "item_number": 32,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Character Motivations",
      "question": "What justification does Brutus provide to the Roman crowd for participating in Caesar's assassination?",
      "options": {
        "A": "He wanted to take the imperial treasury for his personal family",
        "B": "He loved Caesar dearly, but loved the preservation of Roman liberty and the Republic more",
        "C": "Antony commanded him to strike down the dictator",
        "D": "Caesar had refused to lead Roman legions against foreign invaders"
      },
      "correct_answer": "B",
      "explanation": "Brutus argues that although he loved Caesar, his loyalty to the freedom of Roman citizens outweighed his personal affections."
    },
    {
      "item_number": 33,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Narrative Climax",
      "question": "What public platform represents the pinnacle of Osmond's journey in the novella?",
      "options": {
        "A": "The Karaga Village Square",
        "B": "The Golden Voice Records national music showcase in Accra",
        "C": "The Tema Port Industrial Wharf",
        "D": "The Cedar of Lebanon Auditorium"
      },
      "correct_answer": "B",
      "explanation": "Osmond's musical growth culminates in his triumphant appearance at the national recording showcase in the capital."
    },
    {
      "item_number": 34,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Foils",
      "question": "How does Iddrisu's attitude shift across the course of the drama?",
      "options": {
        "A": "From initial apathy into an active, dedicated collaborator with Asantewaa",
        "B": "From an energetic inventor to an associate of Kwansah",
        "C": "From an obedient student to a school runaway",
        "D": "From a supporting friend to a rival politician"
      },
      "correct_answer": "A",
      "explanation": "Iddrisu starts off somewhat detached but matures into an indispensable, reliable partner."
    },
    {
      "item_number": 35,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Stylistic Craft",
      "question": "What is the structural effect of enjambment in the poem's description of Okomfo Anokye's incantations?",
      "options": {
        "A": "It stops the rhythm to indicate death",
        "B": "It creates unbroken syntactic flow that mirrors continuous spiritual communion with the divine",
        "C": "It breaks the lines into separate rhyming couplets",
        "D": "It signals that the speaker is uncertain of historical facts"
      },
      "correct_answer": "B",
      "explanation": "Carrying lines across stanzas without end punctuation captures the fluid, unbroken connection between the priest and the heavens."
    },
    {
      "item_number": 36,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Symbolism",
      "question": "What do 'Light' and 'Dark' symbolize within the cosmic framework of 'The Unseen Painter'?",
      "options": {
        "A": "Good human deeds versus illegal criminal acts",
        "B": "Complementary, balanced dual forces harmonized by the Creator",
        "C": "European colonization versus African resistance",
        "D": "Daytime agricultural work versus nighttime leisure"
      },
      "correct_answer": "B",
      "explanation": "Light and dark represent natural balances and contrasts orchestrated by divine craft."
    },
    {
      "item_number": 37,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "Who is unmasked as the adult criminal mastermind sponsoring Ashes Flame from behind the scenes?",
      "options": {
        "A": "Mr. Limbkins",
        "B": "Nkrabea",
        "C": "Dr. Beckley",
        "D": "Abeka"
      },
      "correct_answer": "B",
      "explanation": "The mastermind orchestrating the extortion and intimidation behind Ashes Flame is Nkrabea."
    },
    {
      "item_number": 38,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Structure & Lines",
      "question": "How many stanzas make up the narrative architecture of 'Real Illusioned Beckley'?",
      "options": {
        "A": "3 stanzas",
        "B": "5 stanzas",
        "C": "7 stanzas",
        "D": "12 stanzas"
      },
      "correct_answer": "C",
      "explanation": "The poem is organized into 7 distinct stanzas of variable line length."
    },
    {
      "item_number": 39,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Literary Diction",
      "question": "What is the tone of the beadle, Mr. Bumble, during his interactions with Mrs. Mann?",
      "options": {
        "A": "Timid and self-effacing",
        "B": "Pompous, self-important, and authoritarian",
        "C": "Gentle and compassionate",
        "D": "Despairing and tearful"
      },
      "correct_answer": "B",
      "explanation": "Mr. Bumble acts with bloated vanity, constantly emphasizing his official parish authority."
    },
    {
      "item_number": 40,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Plot Progression",
      "question": "What tangible document does Antony hold back before finally reading it to inflame the Roman crowd?",
      "options": {
        "A": "Brutus's private diary",
        "B": "Caesar\u2019s official will, bequeathing gifts to every citizen",
        "C": "A military surrender treaty from Egypt",
        "D": "A list of senators to be executed"
      },
      "correct_answer": "B",
      "explanation": "Antony displays and eventually reads Caesar's generous will to prove Caesar's care for commoners."
    },
    {
      "item_number": 41,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Growth",
      "question": "What personal difficulty does Osmond overcome during his transition to the capital?",
      "options": {
        "A": "A severe physical disability",
        "B": "Material poverty, cultural disorientation, and self-doubt",
        "C": "Hostility from his school headmaster",
        "D": "Legal disputes regarding copyright"
      },
      "correct_answer": "B",
      "explanation": "Osmond endures initial dislocation, economic scarcity, and insecurity before finding firm footing in Accra."
    },
    {
      "item_number": 42,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "In Act 6 of 'Spreading Light', what figure of speech is used when Sir Nii tells his students: 'You children are like lights as well!'?",
      "options": {
        "A": "Metaphor",
        "B": "Simile",
        "C": "Personification",
        "D": "Hyperbole"
      },
      "correct_answer": "B",
      "explanation": "Using 'like' to compare students to illuminating sources of wisdom makes the statement an explicit simile."
    },
    {
      "item_number": 43,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Tone",
      "question": "Which set of terms accurately characterizes the speaker's tone in 'The Golden Stool / Okomfo Anokye'?",
      "options": {
        "A": "Cynical and dismissive",
        "B": "Reverent, mystical, and celebratory",
        "C": "Sorrowful and mournful",
        "D": "Humorous and lighthearted"
      },
      "correct_answer": "B",
      "explanation": "The poem treats the historical emergence of the Golden Stool with sacred reverence and pride."
    },
    {
      "item_number": 44,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "Why does the poet repeat the phrase 'God must be a painter' in the text?",
      "options": {
        "A": "To meet a strict rhyming syllable quota",
        "B": "To emphasize the divine creative role and anchor the central metaphor",
        "C": "Because the speaker forgot earlier lines",
        "D": "To parody classical religious hymns"
      },
      "correct_answer": "B",
      "explanation": "Repetition reinforces the core theme, keeping God's craftsmanship central in the reader's mind."
    },
    {
      "item_number": 45,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Setting Symbolism",
      "question": "What is the symbolic significance of the school's name, 'Cedar of Lebanon'?",
      "options": {
        "A": "It shows that the campus was imported from the Middle East",
        "B": "It alludes to biblical resilience and strength, foreshadowing eventual revitalization",
        "C": "It indicates that the compound is surrounded by cedar lumber mills",
        "D": "It proves that the school was built for foreign diplomats"
      },
      "correct_answer": "B",
      "explanation": "The biblical allusion suggests enduring strength and integrity, foreshadowing the school's moral renewal."
    },
    {
      "item_number": 46,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "What idea is conveyed by the metaphor 'Strange known land'?",
      "options": {
        "A": "The author emigrated to a foreign country",
        "B": "A chilling sensation where a familiar childhood neighborhood feels unsettling due to dark rumors",
        "C": "The industrial city was erased by severe flooding",
        "D": "The streets were renamed by city authorities"
      },
      "correct_answer": "B",
      "explanation": "The oxymoronic phrase captures how fear and urban legend can make a home neighborhood feel frighteningly alien."
    },
    {
      "item_number": 47,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Situational Irony",
      "question": "What makes the workhouse board's reaction to Oliver's request ironic?",
      "options": {
        "A": "Oliver was actually offering them money",
        "B": "A small child asking for sustenance to survive is treated as a dangerous act of rebellion",
        "C": "The board members had already prepared a feast for the boys",
        "D": "Mr. Bumble joined Oliver in demanding higher food rations"
      },
      "correct_answer": "B",
      "explanation": "A modest request for basic nutrition is treated by the authorities as a criminal, seditious uprising."
    },
    {
      "item_number": 48,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Sensory Devices",
      "question": "How does Antony utilize Caesar's torn, blood-stained mantle during his speech?",
      "options": {
        "A": "He hides it away to spare the plebeians' feelings",
        "B": "He displays each dagger tear, naming individual conspirators to stir up sympathy and anger",
        "C": "He burns it in the forum fire immediately",
        "D": "He offers it to Brutus as a sign of truce"
      },
      "correct_answer": "B",
      "explanation": "Displaying the pierced garment serves as physical proof of betrayal, transforming grief into collective fury."
    },
    {
      "item_number": 49,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Who serves as Osmond's steady childhood confidante in Obane?",
      "options": {
        "A": "Tina Bells",
        "B": "Ama",
        "C": "Mrs. Mann",
        "D": "Abidatu"
      },
      "correct_answer": "B",
      "explanation": "Ama provides grounded domestic encouragement and friendship to Osmond in his village."
    },
    {
      "item_number": 50,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis",
      "question": "What societal lesson does the disgrace of Kwansah and his protective mother demonstrate?",
      "options": {
        "A": "Parental pampering and jealousy end up causing shame and ruin",
        "B": "High school projects should be guarded by military personnel",
        "C": "Rural schools should rely entirely on kerosene lamps",
        "D": "Mothers should avoid attending village community gatherings"
      },
      "correct_answer": "A",
      "explanation": "Kwansah's downfall proves that jealousy and blind parental indulgence lead to exposure and disgrace."
    },
    {
      "item_number": 51,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Figures of Speech",
      "question": "What poetic device is found in the line 'Treasure of infinite worth'?",
      "options": {
        "A": "Litotes",
        "B": "Hyperbole",
        "C": "Euphemism",
        "D": "Onomatopoeia"
      },
      "correct_answer": "B",
      "explanation": "Describing the Stool's value as 'infinite' is deliberate exaggeration to emphasize its sacred status."
    },
    {
      "item_number": 52,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Vocabulary & Meaning",
      "question": "In 'The Unseen Painter', what does the phrase 'Cloudy Humans' suggest about mankind?",
      "options": {
        "A": "Humans can forecast stormy weather",
        "B": "The complex, varied, and unique nature of the human experience",
        "C": "People enjoy flying through clouds",
        "D": "People are physically invisible to the Creator"
      },
      "correct_answer": "B",
      "explanation": "'Cloudy Humans' highlights the psychological complexity, depth, and distinctiveness of people."
    },
    {
      "item_number": 53,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Transformation",
      "question": "What catalyst ultimately awakens Benson's conscience, leading him to defect from Ashes Flame?",
      "options": {
        "A": "An offer of money from Abeka's parents",
        "B": "His growing love, respect, and protective concern for Tina Bells",
        "C": "Expulsion threats issued by the regional director",
        "D": "A desire to take over Nkrabea's business empire"
      },
      "correct_answer": "B",
      "explanation": "Benson's love for Tina awakens his moral resolve, driving him to reject the cabal's violence."
    },
    {
      "item_number": 54,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Repetition",
      "question": "What effect is created by repeating the word 'Somewhere' in 'Real Illusioned Beckley'?",
      "options": {
        "A": "It identifies the exact street address of the building",
        "B": "It emphasizes spatial uncertainty, mystery, and pervasive unease",
        "C": "It shows that the narrator had relocated to Kumasi",
        "D": "It signals that the mansion was torn down"
      },
      "correct_answer": "B",
      "explanation": "Repeating 'Somewhere' highlights vague rumors and the looming presence of hidden danger."
    },
    {
      "item_number": 55,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective",
      "question": "Which narrative point of view is utilized by Charles Dickens in Chapter 2 of Oliver Twist?",
      "options": {
        "A": "First-Person Protagonist (Oliver)",
        "B": "Third-Person Limited / Selective Omniscient",
        "C": "Second-Person Direct Address",
        "D": "First-Person Peripheral (Mr. Bumble)"
      },
      "correct_answer": "B",
      "explanation": "Dickens uses third-person limited narration to observe actions and dialogue while critiquing the scene."
    },
    {
      "item_number": 56,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "What literary device is demonstrated in: 'I have not come to praise Caesar; I have come to bury him'?",
      "options": {
        "A": "Parallelism and Antithesis",
        "B": "Hyperbolic Simile",
        "C": "Apostrophe to the gods",
        "D": "Mixed Onomatopoeia"
      },
      "correct_answer": "A",
      "explanation": "The balanced parallel clauses present contrasting ideas (burying versus praising) to disarm the crowd."
    },
    {
      "item_number": 57,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Sociological Insight",
      "question": "What does Osmond's trajectory suggest about rural youth talent in modern Ghana?",
      "options": {
        "A": "Talent thrives only when individuals abandon their families permanently",
        "B": "Untapped potential in rural communities can flourish with mentorship and opportunity",
        "C": "Rural youth must give up creative arts in favor of subsistence farming",
        "D": "Success in the creative arts is restricted to the wealthy elite"
      },
      "correct_answer": "B",
      "explanation": "Osmond's path shows that with sincere mentorship, rural youths can achieve excellence on national stages."
    },
    {
      "item_number": 58,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Sensory Imagery",
      "question": "In 'Spreading Light', what sensory imagery describes the community's reaction when the solar lights turn on?",
      "options": {
        "A": "Absolute, fearful silence across the compounds",
        "B": "Buzzing with excitement throughout the pathways",
        "C": "Grumbling over high electric tariffs",
        "D": "Mournful weeping inside the classrooms"
      },
      "correct_answer": "B",
      "explanation": "Auditory and kinetic imagery describes the village as 'buzzing with excitement' when light fills the dark streets."
    },
    {
      "item_number": 59,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Allusion",
      "question": "What is meant by the phrase 'celestial halls' in the poem?",
      "options": {
        "A": "The parliament house in Accra",
        "B": "The heavenly ancestral realm from which the Golden Stool descended",
        "C": "The residence of coastal trading governors",
        "D": "A modern astronomical observatory"
      },
      "correct_answer": "B",
      "explanation": "'Celestial halls' alludes to the heavenly, ancestral realm in Akan cosmological tradition."
    },
    {
      "item_number": 60,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Tone",
      "question": "What is the primary mood evoked in readers by the cosmic imagery of 'The Unseen Painter'?",
      "options": {
        "A": "Anxiety and dread of natural catastrophes",
        "B": "Wonder, reverent reflection, and peace",
        "C": "Anger over environmental exploitation",
        "D": "Indifference to natural scenery"
      },
      "correct_answer": "B",
      "explanation": "The contemplation of stars, sun, moon, and human diversity inspires awe and reverence."
    },
    {
      "item_number": 61,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Narrative Structure",
      "question": "What narrative structure is used in 'Beyond Light and Shadow' to reveal past secrets?",
      "options": {
        "A": "Strict, forward-moving diary entries",
        "B": "Non-linear storytelling using flashbacks and character introspections",
        "C": "A series of formal stage directions without prose",
        "D": "A single extended monologue delivered by Abeka"
      },
      "correct_answer": "B",
      "explanation": "The prose uses a non-linear structure with flashbacks to provide psychological depth."
    },
    {
      "item_number": 62,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Sociological Reality",
      "question": "What social contrast is explored in 'Real Illusioned Beckley'?",
      "options": {
        "A": "Modern industrial expansion alongside lingering fear and urban superstition",
        "B": "Traditional fishing methods versus mechanized trawlers",
        "C": "Agricultural cocoa farming versus rubber production",
        "D": "Government schools versus private home tutoring"
      },
      "correct_answer": "A",
      "explanation": "The poem contrasts modern industrial development with the dark, superstitious fears that grip communities."
    },
    {
      "item_number": 63,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "In 'Oliver Asks for More', how does Dickens satirically describe Mrs. Mann pocketing relief funds?",
      "options": {
        "A": "'In her cruel robbery...'",
        "B": "'...in her wisdom, saved most of the money for herself'",
        "C": "'With honest parish thrift...'",
        "D": "'To feed the local church ministers...'"
      },
      "correct_answer": "B",
      "explanation": "Describing her theft as 'in her wisdom' is a sarcastic euphemism highlighting her greed."
    },
    {
      "item_number": 64,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Dramatic Irony",
      "question": "What is ironic about Brutus stepping away to let Antony address the plebeians alone?",
      "options": {
        "A": "Brutus assumed Antony lacked the oratory skill to undo his defense",
        "B": "Brutus had planned to assassinate Antony outside the gates",
        "C": "The commoners were already preparing to burn Brutus's house",
        "D": "Antony had sworn an oath of allegiance to Brutus's family"
      },
      "correct_answer": "A",
      "explanation": "Brutus's naive idealism leads him to trust Antony, creating dramatic irony as Antony dismantles his case."
    },
    {
      "item_number": 65,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does Osmond's final public concert symbolize?",
      "options": {
        "A": "The triumph of youth resilience, artistic integrity, and community uplift",
        "B": "The complete abandonment of his ancestral roots in Obane",
        "C": "The commercial dominance of international music syndicates",
        "D": "The end of his educational aspirations"
      },
      "correct_answer": "A",
      "explanation": "The final performance celebrates how talent, character, and proper mentorship can transform an underdog's life."
    },
    {
      "item_number": 66,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Symbolism",
      "question": "What does the working solar device symbolize for the rural village?",
      "options": {
        "A": "Expensive machinery that commoners cannot touch",
        "B": "Progress, local empowerment, and the practical value of STEM education",
        "C": "An intrusion into quiet rural nighttime habits",
        "D": "A temporary science fair toy with no long-term use"
      },
      "correct_answer": "B",
      "explanation": "The solar device represents progress, self-reliance, and the tangible benefits of education for rural communities."
    },
    {
      "item_number": 67,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Cultural Significance",
      "question": "What lasting contribution does Okomfo Anokye\u2019s legend make to Ghanaian identity?",
      "options": {
        "A": "It records coastal maritime shipping regulations",
        "B": "It reinforces pride in indigenous heritage, unity, and spiritual self-determination",
        "C": "It proves that ancient tribes avoided cultural alliances",
        "D": "It encourages communities to abandon oral traditions"
      },
      "correct_answer": "B",
      "explanation": "The legacy provides a foundation of pride, reminding citizens of the power of unity and cultural roots."
    },
    {
      "item_number": 68,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What does 'The Unseen Painter' conclude about human differences?",
      "options": {
        "A": "Differences are errors that need correction",
        "B": "Differences are deliberate, beautiful expressions of a single shared humanity",
        "C": "Differences should divide people into separate classes",
        "D": "Differences are created entirely by human fashion"
      },
      "correct_answer": "B",
      "explanation": "The poem celebrates diversity as intentional brushstrokes that enrich the shared canvas of humanity."
    },
    {
      "item_number": 69,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Thematic Climax",
      "question": "What comparison describes Cedar of Lebanon School's renewal in Chapter 15?",
      "options": {
        "A": "'like a ship sinking beneath heavy ocean waves'",
        "B": "'like a phoenix rising from the ashes, forged in the hearts of its students'",
        "C": "'like an abandoned fortress crumbling into clay'",
        "D": "'like a dark forest cleared for timber export'"
      },
      "correct_answer": "B",
      "explanation": "The author compares the reformed school to a phoenix rising renewed from the destruction of Ashes Flame."
    },
    {
      "item_number": 70,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Atmosphere",
      "question": "Why does the poet describe children's play as subdued near the high-tension lines?",
      "options": {
        "A": "The children were tired after running errands",
        "B": "An atmosphere of dread and suspicion stifles innocent childhood play",
        "C": "The electrical cables produced sparks across the field",
        "D": "Municipal officials had banned outdoor recreation"
      },
      "correct_answer": "B",
      "explanation": "Sensational rumors and fear cast a shadow that subdues normal childhood activities."
    },
    {
      "item_number": 71,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Sensory Details",
      "question": "How does Dickens physically contrast the master with the hungry boys?",
      "options": {
        "A": "The master is thin and frail, while the boys are healthy",
        "B": "The master is fat, healthy, and armed with a ladle, while the boys are emaciated and trembling",
        "C": "The master wears rags, while the boys wear expensive wool coats",
        "D": "The master shares his meals equally with the apprentices"
      },
      "correct_answer": "B",
      "explanation": "Dickens visually contrasts the well-fed, comfortable master with the starving, emaciated children."
    },
    {
      "item_number": 72,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Figure of Speech",
      "question": "What figure of speech is used in: 'His eyes are red as fire with weeping'?",
      "options": {
        "A": "Simile and Hyperbole",
        "B": "Synecdoche and Litotes",
        "C": "Euphemism and Irony",
        "D": "Metonymy and Paradox"
      },
      "correct_answer": "A",
      "explanation": "Comparing eyes to fire using 'as' is a simile, while exaggerating his redness to fire functions as hyperbole."
    },
    {
      "item_number": 73,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "How does Brother Kofi support Osmond during his early struggles in Accra?",
      "options": {
        "A": "He lends him money to travel overseas",
        "B": "He offers shelter, brotherhood, and practical encouragement",
        "C": "He takes ownership of Osmond's musical copyrights",
        "D": "He convinces Osmond to abandon the music industry"
      },
      "correct_answer": "B",
      "explanation": "Brother Kofi provides vital domestic shelter and encouragement during Osmond's early days in Accra."
    },
    {
      "item_number": 74,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Setting Integration",
      "question": "What happens in Asantewaa's domestic hut before the project's completion?",
      "options": {
        "A": "Her mother encourages her to become a mechanical engineer",
        "B": "She deals with her mother's skepticism before using the hut to assemble the solar device",
        "C": "The hut is burned down by Kwansah's associates",
        "D": "The village elders establish a trade center there"
      },
      "correct_answer": "B",
      "explanation": "Initially an area of domestic tension, the hut becomes the workspace where she builds the device."
    },
    {
      "item_number": 75,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "What does the metaphor 'A treasure trove, of stories yet untold' mean?",
      "options": {
        "A": "A wooden box containing lost gold jewelry",
        "B": "The Stool holds the unwritten history, sacrifices, and destiny of the nation",
        "C": "A library cataloging European trade journals",
        "D": "An oral folktale performed only for tourists"
      },
      "correct_answer": "B",
      "explanation": "The metaphor indicates that the Golden Stool preserves the collective heritage and untold memories of the people."
    },
    {
      "item_number": 76,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Pedagogical Sub-Text",
      "question": "What philosophical warning does 'The Unseen Painter' issue to humanity?",
      "options": {
        "A": "Humans should stop painting on canvas",
        "B": "People should not limit the Creator through narrow personal prejudices",
        "C": "Artists should work only in daylight hours",
        "D": "Science and religion cannot coexist in schools"
      },
      "correct_answer": "B",
      "explanation": "The poem cautions that individuals often project their own narrow biases onto divine creation."
    },
    {
      "item_number": 77,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Theme & Morality",
      "question": "How does 'Beyond Light and Shadow' illustrate that moral courage requires vulnerability?",
      "options": {
        "A": "By showing teachers carrying weapons into classrooms",
        "B": "Through Mrs. Acquah risking her own daughter's safety to restore communal trust",
        "C": "By having the student body boycott all term examinations",
        "D": "Through Nkrabea transferring his wealth to the school board"
      },
      "correct_answer": "B",
      "explanation": "Mrs. Acquah shows courage by placing her daughter inside the troubled system to lead by example."
    },
    {
      "item_number": 78,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "In 'Real Illusioned Beckley', how is Dr. Beckley described through simile?",
      "options": {
        "A": "'like a roaring ocean'",
        "B": "'like a monster'",
        "C": "'like an unmoving statue'",
        "D": "'like a whispering shadow'"
      },
      "correct_answer": "B",
      "explanation": "The text explicitly uses the simile 'like a monster' to capture childhood fear of his elusive persona."
    },
    {
      "item_number": 79,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "What immediate punishment does the workhouse board hand down after Oliver's request?",
      "options": {
        "A": "He is sent home to his biological parents",
        "B": "He is confined to a dark room and offered as an apprentice with a five-pound reward",
        "C": "He is appointed head boy of the dining hall",
        "D": "He is sentenced to hard labor in London"
      },
      "correct_answer": "B",
      "explanation": "The board locks him away and advertises him on the gate with a five-pound premium for anyone who takes him."
    },
    {
      "item_number": 80,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Sensory Devices",
      "question": "What visual evidence does Antony display to dispute that Caesar was overly ambitious?",
      "options": {
        "A": "A chest of gold coins meant for the army",
        "B": "Caesar's torn mantle, his open wounds, and his generous will",
        "C": "A letter written by Cassius to the senate",
        "D": "A statue of Brutus overturned in the dirt"
      },
      "correct_answer": "B",
      "explanation": "Antony points to Caesar's physical wounds and reads his will leaving money to the public."
    },
    {
      "item_number": 81,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Figurative Language",
      "question": "Why is the title 'A Beacon of Light' fitting for Osmond's story?",
      "options": {
        "A": "He operated a coastal lighthouse in Accra",
        "B": "His journey serves as a guiding light of hope and perseverance for disadvantaged youth",
        "C": "His music was performed only during daytime hours",
        "D": "He invented solar lanterns for his village"
      },
      "correct_answer": "B",
      "explanation": "The metaphor frames Osmond's breakthrough as a guiding light inspiring other marginalized youths."
    },
    {
      "item_number": 82,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Literary Mechanics",
      "question": "What device is used in Kwansah's line: 'Why should she always succeed?'?",
      "options": {
        "A": "Rhetorical question expressing bitter envy",
        "B": "Euphemistic understatement",
        "C": "Apostrophe to the gods",
        "D": "Direct personification of nature"
      },
      "correct_answer": "A",
      "explanation": "His envious question expects no reply, functioning as a rhetorical expression of jealousy."
    },
    {
      "item_number": 83,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Juxtaposition",
      "question": "What two elements are juxtaposed to emphasize the mystic's spiritual power?",
      "options": {
        "A": "Loud brass trumpets and heavy drumming",
        "B": "The quiet hush of twilight and his low, whispered incantations",
        "C": "A blazing forest fire and ocean waves",
        "D": "A marketplace crowd and marching soldiers"
      },
      "correct_answer": "B",
      "explanation": "Contrasting the quiet hush of dusk with whispered incantations underscores his supernatural calm."
    },
    {
      "item_number": 84,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Style & Syntax",
      "question": "What is the effect of using active voice verbs to describe the Painter's actions?",
      "options": {
        "A": "It suggests the speaker is exhausted",
        "B": "It emphasizes purposeful divine agency and deliberate creative power",
        "C": "It indicates the artwork was produced by accident",
        "D": "It slows down the reading pace of the poem"
      },
      "correct_answer": "B",
      "explanation": "Active verbs highlight intentional craftsmanship, portraying God as a deliberate creator."
    },
    {
      "item_number": 85,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Literary Pathos",
      "question": "What scene in Chapter 10 evokes strong pathos regarding Benson's double life?",
      "options": {
        "A": "Benson celebrating an academic prize with his mother",
        "B": "Benson lying battered on the ground, paying the physical price of his betrayal",
        "C": "Benson signing a business contract with Nkrabea",
        "D": "Benson giving a speech at graduation"
      },
      "correct_answer": "B",
      "explanation": "The image of Benson battered on the ground highlights the painful cost of breaking away from the cabal."
    },
    {
      "item_number": 86,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Theme",
      "question": "What psychological impact did the legends surrounding Dr. Beckley have on local youth?",
      "options": {
        "A": "They motivated children to pursue careers in medicine",
        "B": "They created persistent childhood fears, suspicion, and caution",
        "C": "They inspired children to explore industrial engineering",
        "D": "They led to regular neighborhood street celebrations"
      },
      "correct_answer": "B",
      "explanation": "Sensational urban legends fostered an atmosphere of fear that left lasting impressions on children."
    },
    {
      "item_number": 87,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What central moral lesson does Dickens deliver in this excerpt?",
      "options": {
        "A": "Children in parish institutions should remain completely silent",
        "B": "Genuine charity requires empathy and dignity, not bureaucratic cruelty and self-serving greed",
        "C": "Starvation is an effective tool to reform young minds",
        "D": "Workhouse boards should be run by military officers"
      },
      "correct_answer": "B",
      "explanation": "Dickens critiques institutions that preach Christian charity while starving the vulnerable in their care."
    },
    {
      "item_number": 88,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Resolution Dynamics",
      "question": "What consequence directly results from Mark Antony's funeral speech?",
      "options": {
        "A": "The Roman citizens elect Brutus king of the Republic",
        "B": "The plebeians form an enraged mob that drives the conspirators out of Rome",
        "C": "Caesar's body is refused a burial in the city",
        "D": "Antony resigns his commission and departs for Egypt"
      },
      "correct_answer": "B",
      "explanation": "Antony's speech incites the plebeians into mutiny, driving Brutus, Cassius, and the plotters from the city."
    },
    {
      "item_number": 89,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Arcs",
      "question": "How does Tina Bells develop as a character across the narrative?",
      "options": {
        "A": "From a fearful student into a reclusive bystander",
        "B": "From an innocent newcomer into an empowered, courageous agent of truth",
        "C": "From an assistant teacher into a school administrator",
        "D": "From an outspoken critic into an Ashes Flame supporter"
      },
      "correct_answer": "B",
      "explanation": "Tina evolves from an innocent student into an active participant who helps uncover the cabal."
    },
    {
      "item_number": 90,
      "text": "The Unseen Painter & The Golden Stool",
      "strand": "Comparative Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What common theme unites both 'The Unseen Painter' and 'The Golden Stool / Okomfo Anokye'?",
      "options": {
        "A": "Both focus on industrial machinery and locomotive engines",
        "B": "Both examine the connection between the divine realm and human identity on earth",
        "C": "Both describe commuter traffic across Accra",
        "D": "Both depict life inside an 18th-century workhouse"
      },
      "correct_answer": "B",
      "explanation": "Both poems bridge the celestial and the earthly, exploring divine purpose and human identity."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "A Beacon of Light",
      "strand": "Prose Extract & Appreciation",
      "extract": "Osmond adjusted the collar of his handwoven Kente cloth, listening to the gentle hum of the studio instruments. Across the control glass, Ms. Adjei gave him a firm, reassuring nod. When the backing track began to play, his thoughts drifted back to the dusty lanes of Obane and the late nights spent singing under the neem tree. He stepped to the microphone, his voice rising clear, confident, and full of gratitude.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the geographical shift in setting described in this extract.",
          "marks": 2,
          "expected_answer": "The setting moves from the rural village of Obane to the modern recording studio in Accra."
        },
        {
          "label": "(b)",
          "question": "What does Osmond's handwoven Kente cloth symbolize during this performance?",
          "marks": 3,
          "expected_answer": "It symbolizes cultural grounding, pride in African heritage, and dignity on a national platform."
        },
        {
          "label": "(c)",
          "question": "Explain Ms. Adjei's role as a mentor in Osmond's personal and creative journey.",
          "marks": 3,
          "expected_answer": "Ms. Adjei acts as an encouraging mentor who recognizes his potential, refines his talent, and gives him the confidence to perform."
        },
        {
          "label": "(d)",
          "question": "State the central theme reflected in Osmond singing with 'gratitude'.",
          "marks": 2,
          "expected_answer": "The theme of gratitude and remembering those who supported him along his path to success."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Spreading Light",
      "strand": "Drama Extract & Appreciation",
      "extract": "ASANTEWAA: (Holding the solar inverter steady as Iddrisu connects the circuit) If we wait for someone from the city to give us light, Iddrisu, we will read by smoky lanterns forever.\nKWANSAH: (Watching bitterly from the doorway, muttering) Why should she always succeed? She is only a girl from the lower village.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What central conflict is highlighted between Asantewaa and Kwansah in this extract?",
          "marks": 3,
          "expected_answer": "The conflict between Asantewaa's proactive innovation and Kwansah's envious resentment rooted in prejudice."
        },
        {
          "label": "(b)",
          "question": "Identify the literary device in Kwansah's muttering: 'Why should she always succeed?'",
          "marks": 2,
          "expected_answer": "Rhetorical question, expressing his bitter jealousy and refusal to accept her success."
        },
        {
          "label": "(c)",
          "question": "How does Asantewaa's technical leadership challenge traditional gender expectations?",
          "marks": 3,
          "expected_answer": "She leads a renewable energy project, breaking the stereotype that technical STEM work is for boys."
        },
        {
          "label": "(d)",
          "question": "What does 'smoky lanterns' represent in contrast to solar light?",
          "marks": 2,
          "expected_answer": "Smoky lanterns represent stagnation and neglected infrastructure, while solar light represents modern progress and education."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry Extract & Appreciation",
      "extract": "With whispered incantations, he calls\nA treasure from the celestial halls;\nThe Golden Stool descends through twilight's hush,\nA sacred bond no earthly sword can crush.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the figure of speech in 'A treasure from the celestial halls'.",
          "marks": 2,
          "expected_answer": "Metaphor and allusion, referring to the Stool descending from the heavenly ancestral realm."
        },
        {
          "label": "(b)",
          "question": "What is the symbolic meaning of 'twilight's hush' in the setting?",
          "marks": 3,
          "expected_answer": "Twilight represents the liminal threshold where the physical earth connects with the spiritual realm."
        },
        {
          "label": "(c)",
          "question": "Explain how the 'Golden Stool' functions as a synecdoche in this poem.",
          "marks": 3,
          "expected_answer": "The Stool represents the collective Ashanti Kingdom, its sovereignty, and the unity of its people."
        },
        {
          "label": "(d)",
          "question": "What tone is conveyed by the speaker in these lines?",
          "marks": 2,
          "expected_answer": "A reverent, mystical, and celebratory tone."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "The Unseen Painter",
      "strand": "Poetry Extract & Appreciation",
      "extract": "The very white canvas\nSuddenly turned darker,\nPainting them bright with sunlight\nAnd dark with the moon and twinkling stars.\nGod must be a painter,\nMixing every shade of skin\nTo show that in His gallery,\nAll hues belong within.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the central metaphor in this excerpt and explain its meaning.",
          "marks": 3,
          "expected_answer": "God is depicted as a painter, framing the universe as an artistic canvas woven with natural beauty and human variety."
        },
        {
          "label": "(b)",
          "question": "What does the contrast between 'sunlight' and 'the moon and twinkling stars' symbolize?",
          "marks": 2,
          "expected_answer": "It symbolizes opposing natural forces balanced and harmonized within creation."
        },
        {
          "label": "(c)",
          "question": "How do these lines address racial prejudice?",
          "marks": 3,
          "expected_answer": "By portraying different skin complexions as intentional shades in a divine gallery, affirming that all people share equal worth."
        },
        {
          "label": "(d)",
          "question": "What verse format is used in this poem?",
          "marks": 2,
          "expected_answer": "Free verse with variable line lengths."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "Beyond Light and Shadow",
      "strand": "Prose Extract & Appreciation",
      "extract": "Mrs. Acquah stood firmly by the assembly hall doorway as the whispers spread across the courtyard. Beside her stood Tina Bells, her school uniform neatly pressed. In the shadows of the corridor, Benson stared at the new girl, his heart pounding against his ribs. He felt the cold grip of Ashes Flame pulling at his sleeve, yet looking into Tina's calm eyes, the dark oath he had sworn felt like a noose tightening around his neck.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What internal conflict does Benson experience in this scene?",
          "marks": 3,
          "expected_answer": "He is torn between his secret loyalty to Ashes Flame and his awakening conscience inspired by Tina's arrival."
        },
        {
          "label": "(b)",
          "question": "Explain the metaphor 'the dark oath he had sworn felt like a noose tightening around his neck'.",
          "marks": 3,
          "expected_answer": "It compares his oath to Ashes Flame to an executioner's noose, conveying that his loyalty to the cabal was suffocating his integrity."
        },
        {
          "label": "(c)",
          "question": "Why is Mrs. Acquah's enrollment of Tina considered a turning point for the school?",
          "marks": 2,
          "expected_answer": "It shows her commitment to the school, inspiring parents and beginning the breakdown of fear."
        },
        {
          "label": "(d)",
          "question": "What character traits of Tina Bells are highlighted in this interaction?",
          "marks": 2,
          "expected_answer": "Composure, innocence, quiet strength, and moral courage."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry Extract & Appreciation",
      "extract": "Somewhere behind the wall so high,\nBeneath the gray and smoky sky,\nThe quiet house lived, aloof and cold,\nWhile whispered tales of horror rolled.\nA thinner path, the tall grass grew,\nAnd fear was all the children knew.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify two distinct figures of speech in this extract.",
          "marks": 2,
          "expected_answer": "1. Personification: 'The quiet house lived'. 2. Sensory imagery: 'wall so high' or 'gray and smoky sky'."
        },
        {
          "label": "(b)",
          "question": "How does the industrial setting contribute to the ominous mood of the poem?",
          "marks": 3,
          "expected_answer": "The smoky sky, high-tension lines, and neglected paths create an unsettling backdrop for neighborhood urban legends."
        },
        {
          "label": "(c)",
          "question": "What does the 'high wall' symbolize regarding Dr. Beckley?",
          "marks": 3,
          "expected_answer": "It symbolizes secrecy, isolation, and concealment from the community."
        },
        {
          "label": "(d)",
          "question": "What effect did these rumors have on the neighborhood children?",
          "marks": 2,
          "expected_answer": "They created lasting childhood fear and suspicion, stifling carefree play."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Oliver Asks for More",
      "strand": "Prose Extract & Appreciation",
      "extract": "The master, in his cook's uniform, stared in stupefied astonishment at the small rebel. The ladle shook in his hand; the assistants stood paralyzed with horror; the boys with fear.\n'Please, sir,' repeated Oliver, his small voice echoing in the chilly dining hall, 'I want some more.'\nThe master aimed a blow at Oliver\u2019s head with the ladle, pinioned him in his arms, and shrieked aloud for the beadle.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What narrative stage of the plot does this extract represent?",
          "marks": 2,
          "expected_answer": "The dramatic climax of the workhouse dining hall episode."
        },
        {
          "label": "(b)",
          "question": "Explain the situational irony in the master's reaction to Oliver's request.",
          "marks": 3,
          "expected_answer": "A small boy asking for food to survive starvation is treated as a dangerous, treasonous act of rebellion."
        },
        {
          "label": "(c)",
          "question": "How does Dickens use sensory details to evoke sympathy (pathos) for Oliver?",
          "marks": 3,
          "expected_answer": "He contrasts Oliver's small voice and emaciated body with the chilly hall and the large master wielding a heavy ladle."
        },
        {
          "label": "(d)",
          "question": "Who is summoned by the master, and what official role does that character hold?",
          "marks": 2,
          "expected_answer": "Mr. Bumble, the parish beadle."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama Extract & Appreciation",
      "extract": "ANTONY: He was my friend, faithful and just to me;\nBut Brutus says he was ambitious,\nAnd Brutus is an honourable man.\nHe hath brought many captives home to Rome,\nWhose ransoms did the general coffers fill;\nDid this in Caesar seem ambitious?\nWhen that the poor have cried, Caesar hath wept;\nAmbition should be made of sterner stuff:\nYet Brutus says he was ambitious,\nAnd Brutus is an honourable man.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does Antony use verbal irony in his repeated characterization of Brutus as an 'honourable man'?",
          "marks": 3,
          "expected_answer": "By pairing the compliment with evidence of Caesar's generosity, the word 'honourable' gradually comes to mean treasonous and untruthful."
        },
        {
          "label": "(b)",
          "question": "Identify two factual proofs Antony offers to refute the claim that Caesar was ambitious.",
          "marks": 3,
          "expected_answer": "1. Caesar brought captive ransoms into the public treasury. 2. Caesar wept with compassion when the poor cried."
        },
        {
          "label": "(c)",
          "question": "What rhetorical device is used in 'Did this in Caesar seem ambitious?' and what is its purpose?",
          "marks": 2,
          "expected_answer": "Rhetorical question; it leads the plebeians to conclude on their own that Caesar was not ambitious."
        },
        {
          "label": "(d)",
          "question": "What emotional shift does Antony produce in the audience through these lines?",
          "marks": 2,
          "expected_answer": "He shifts the commoners from supporting Brutus to feeling grief for Caesar and anger toward the conspirators."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "Comparative Literature: Spreading Light & Beyond Light and Shadow",
      "strand": "Comparative Appreciation",
      "extract": "TEXT 1 (Spreading Light):\n'ASANTEWAA: The light is for the whole village, Sir Nii. Kwansah hid the panels, but he could not hide the truth.'\n\nTEXT 2 (Beyond Light and Shadow):\n'TINA: Cedar of Lebanon will not live in fear anymore, Benson. You do not belong to the ashes; you belong to the light.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does the symbol of 'light' function in both Text 1 and Text 2?",
          "marks": 3,
          "expected_answer": "In Text 1, light represents STEM education and communal progress. In Text 2, light represents moral truth, integrity, and institutional renewal."
        },
        {
          "label": "(b)",
          "question": "Contrast how Asantewaa in Text 1 and Tina in Text 2 confront deceit in their schools.",
          "marks": 4,
          "expected_answer": "Asantewaa relies on technical persistence and public exposure of Kwansah's theft. Tina relies on moral courage and empathy, appealing to Benson's conscience to break down the cabal."
        },
        {
          "label": "(c)",
          "question": "What shared message regarding youthful integrity emerges from comparing these texts?",
          "marks": 3,
          "expected_answer": "Both show that young people have the power to dismantle corruption when they stand firmly for truth."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis: Classical and Modern Literature",
      "strand": "Comprehensive BECE Paper 2 Essay Methodology",
      "extract": "The NaCCA Basic 9 literature syllabus pairs modern Ghanaian texts with world classics to explore themes of governance, justice, leadership, and human dignity.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Using the Point-Evidence-Explanation (P-E-E) structure, write an analytical paragraph on the theme of 'Abuse of Power' in either 'Oliver Asks for More' or 'Mark Antony Mourns Caesar'.",
          "marks": 4,
          "expected_answer": "Point: In 'Oliver Asks for More', authority figures use institutional power to exploit rather than protect vulnerable charges. Evidence: When starving Oliver asks for more gruel, the workhouse master strikes him with a ladle and locks him in a dark room. Explanation: This illustrates how institutional power can turn cruel when administrators view the poor as moral failures rather than human beings in need."
        },
        {
          "label": "(b)",
          "question": "Compare the leadership of Mrs. Janet Acquah in 'Beyond Light and Shadow' with that of Mark Antony in 'Mark Antony Mourns Caesar'.",
          "marks": 3,
          "expected_answer": "Mrs. Acquah leads through personal sacrifice and moral example to restore communal order. Mark Antony uses emotional manipulation and persuasive rhetoric to incite a mob to vengeance and seize power."
        },
        {
          "label": "(c)",
          "question": "Identify two ways in which classical texts like 'Julius Caesar' and 'Oliver Twist' remain relevant to contemporary Ghanaian junior high school students.",
          "marks": 3,
          "expected_answer": "1. 'Julius Caesar' teaches students to evaluate political rhetoric critically and avoid mob mentality. 2. 'Oliver Twist' encourages empathy for underprivileged children and warns against institutional neglect."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB9Foundation() {
  console.log("Seeding Basic 9 Foundation Practice Lab (100 Items) for The Beacon of Light...");
  const db = await getFirestoreDb();

  const allItems: any[] = [];

  // 1. Process Section A: 90 Objectives
  // Create balanced target option positions (23 A, 23 B, 22 C, 22 D)
  const targetPositions: number[] = [];
  for (let i = 0; i < 23; i++) targetPositions.push(0);
  for (let i = 0; i < 23; i++) targetPositions.push(1);
  for (let i = 0; i < 22; i++) targetPositions.push(2);
  for (let i = 0; i < 22; i++) targetPositions.push(3);
  const shuffledTargetPositions = shuffleArray(targetPositions);

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

    const qNumStr = qNum < 10 ? "00" + qNum : (qNum < 100 ? "0" + qNum : "" + qNum);
    allItems.push({
      id: `B9_BL_F_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "foundation",
      category: `${item.strand} Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Recall core characters, plot turning points, settings, and literary devices in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Demonstrate foundational comprehension of prescribed The Beacon of Light texts (${item.text}), evaluating plot architecture, character motivations, figurative devices, and societal themes.`
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
  console.log(`   📊 Shuffled Option Distribution (90 Items): A: ${dist.A}, B: ${dist.B}, C: ${dist.C}, D: ${dist.D}`);

  // 2. Process Section B: 10 Theory Extracts (Items 91 to 100)
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
      id: `B9_BL_F_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B9",
      difficulty: "foundation",
      category: `${item.strand}`,
      title: `${item.text} - Literary Appreciation & Comprehension`,
      shortSummary: `In-depth extract appreciation, device identification, and thematic synthesis for '${item.text}' (10 Marks).`,
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
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Accurately addresses sub-question ${sq.label} using textual evidence`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Diction, Analytical Clarity & Structure",
            maxMarks: 5,
            scoringGuidelines: ["Accurate identification of literary devices (synecdoche, metaphor, personification, irony, rhetorical question)", "Clear prose and adherence to WAEC answering conventions"],
            diagnosticChecklist: ["Demonstrates clear literary register and organized answering methodology"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Carefully examine the extract from '${item.text}' to identify literary devices, character motivations, and thematic significance.`,
      competencyTarget: `${item.strand}: Extract Analysis & Literary Appreciation`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Analyze literature extracts from The Beacon of Light across poetry, drama, and prose, evaluating poetic structure, character dynamics, dramatic techniques, and thematic significance.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B9",
    difficulty: "foundation",
    title: "Basic 9 Literature Diagnostic Assessment Lab: The Beacon of Light (Foundation Tier - 100 Items)",
    totalItemsCount: allItems.length,
    objectiveDrillsCount: 90,
    structuredEssaysCount: 10,
    sections: {
      objective: {
        startIndex: 0,
        endIndex: 89,
        count: 90,
        format: "multiple_choice"
      },
      theory: {
        startIndex: 90,
        endIndex: 99,
        count: 10,
        format: "structured_essay",
        allowsDirectTopicFlipping: true,
        topicList: ASSESSMENT_DATA.theory.map((t: any, idx: number) => ({
          questionNumber: t.item_number,
          theoryIndex: idx + 1,
          id: `B9_BL_F_TH_${t.item_number}`,
          title: `${t.text} - Literary Appreciation`,
          category: t.strand,
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
    'cockcrow_literary_devices',
    'literature_cockcrow_canon'
  ];
  const targetCols = ['topical', 'topics', 'topical_units'];

  // 1. Deploy practice lab subcollection document
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B9_foundation`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // 2. Ensure parent document practicePool has clean container for B9 to prevent 1MB overflow
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b9: {
            practicePool: {
              low: [],
              medium: [],
              hard: []
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Maintained Optimized Practice Pool container on: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B9 Foundation Lab!`);
}

seedBeaconOfLightB9Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Foundation Lab:", err);
    process.exit(1);
  });
