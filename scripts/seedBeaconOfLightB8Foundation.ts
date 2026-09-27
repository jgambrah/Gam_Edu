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
    "title": "Basic 8 Literature Diagnostic Lab - Foundation Tier (Comprehensive 100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 8 (JHS 2)",
    "tier": "Foundation",
    "total_questions": 100,
    "breakdown": {
      "section_a_objectives": 90,
      "section_b_theory_extracts": 10
    },
    "prescribed_texts": [
      "The Monday Breeze (Poetry)",
      "Dawuni\u2019s Dream (Heroic Drama)",
      "A Calabash of Saha (Prose Narrative)",
      "Forest Gold (Prose Narrative)"
    ]
  },
  "objectives": [
    {
      "item_number": 1,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structure & Form",
      "question": "How many stanzas make up the poem 'The Monday Breeze'?",
      "options": {
        "A": "8 stanzas",
        "B": "5 stanzas",
        "C": "3 stanzas",
        "D": "10 stanzas"
      },
      "correct_answer": "B",
      "explanation": "The poem 'The Monday Breeze' consists of 5 stanzas."
    },
    {
      "item_number": 2,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Foils",
      "question": "Who serves as the antagonist representing dangerous ambition and political greed in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "Anzansi",
        "B": "Anfani",
        "C": "Alheri",
        "D": "Dawuni"
      },
      "correct_answer": "A",
      "explanation": "Anzansi is the antagonist who represents unchecked ambition and greed."
    },
    {
      "item_number": 3,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Setting & Plot",
      "question": "In which rural hometown does the story of Abubakar and Abidatu's Saha system begin and end?",
      "options": {
        "A": "Tamale",
        "B": "Accra",
        "C": "Karaga",
        "D": "Daakye Asem"
      },
      "correct_answer": "C",
      "explanation": "Karaga is the duo's hometown where their journey begins and where they implement the Saha system."
    },
    {
      "item_number": 4,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Setting & Conflict",
      "question": "What is the name of the life-giving river that suffers severe pollution in the village of Daakye Asem?",
      "options": {
        "A": "Pra River",
        "B": "Birim River",
        "C": "Ankobra River",
        "D": "Daakye River"
      },
      "correct_answer": "D",
      "explanation": "The Daakye River is the central water body that is devastated by illegal gold mining."
    },
    {
      "item_number": 5,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structure & Form",
      "question": "What specific two-line structural form is used for each stanza in 'The Monday Breeze'?",
      "options": {
        "A": "Quatrain",
        "B": "Couplet",
        "C": "Sestet",
        "D": "Octave"
      },
      "correct_answer": "B",
      "explanation": "Each of the 5 stanzas is constructed as a two-line couplet."
    },
    {
      "item_number": 6,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Dynamics",
      "question": "What personal struggle does Prince Dawuni contend with at the opening of the play?",
      "options": {
        "A": "Physical blindness",
        "B": "Alcoholism and irresponsibility",
        "C": "Banishment to the coast",
        "D": "Poverty"
      },
      "correct_answer": "B",
      "explanation": "Dawuni is initially depicted as weak-willed, irresponsible, and struggling with alcoholism."
    },
    {
      "item_number": 7,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Technical Innovation",
      "question": "What critical component did Abubakar and Abidatu struggle to find when designing their prototype?",
      "options": {
        "A": "A diesel generator",
        "B": "A copper pipe",
        "C": "The right UV lamp",
        "D": "A glass condenser"
      },
      "correct_answer": "C",
      "explanation": "Finding the appropriate UV lamp for water sterilization was one of their major initial technical challenges."
    },
    {
      "item_number": 8,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Who is the external prospector whose discovery of gold transforms Daakye Asem into a mining hub?",
      "options": {
        "A": "Zakari",
        "B": "Elder Onyimdze",
        "C": "Osmond",
        "D": "Chief Daakye Asem"
      },
      "correct_answer": "C",
      "explanation": "Osmond is the outside prospector driven by economic interests who sparks the gold rush."
    },
    {
      "item_number": 9,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Devices & Irony",
      "question": "Why is the title 'The Monday Breeze' considered situationally ironic?",
      "options": {
        "A": "Monday is an official public holiday",
        "B": "The title suggests gentle calmness, but the poem portrays frantic morning stress and blaring horns",
        "C": "The poem is set entirely during a quiet Sunday evening",
        "D": "The family lives by a quiet lake"
      },
      "correct_answer": "B",
      "explanation": "A 'breeze' implies cool tranquility, which sharply contradicts the hectic rushing and shouting of the morning commute."
    },
    {
      "item_number": 10,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting & Culture",
      "question": "In which geographic region and historical era is 'Dawuni\u2019s Dream' set?",
      "options": {
        "A": "Coastal Ghana during British colonial rule",
        "B": "Pre-colonial tribal kingdoms in Northern Ghana",
        "C": "Urban Accra in the late 1990s",
        "D": "The Ashanti Kingdom during the Sagrenti War"
      },
      "correct_answer": "B",
      "explanation": "The play is set in a traditional tribal kingdom in Northern Ghana during the pre-colonial era."
    },
    {
      "item_number": 11,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Mentorship",
      "question": "Who provides scientific guidance and academic encouragement to Abubakar and Abidatu from Tamale?",
      "options": {
        "A": "Sir Nii",
        "B": "Dr. Iddrisu",
        "C": "Mr. Alhasan",
        "D": "Chief Daakye Asem"
      },
      "correct_answer": "B",
      "explanation": "Dr. Iddrisu is an experienced lecturer in Tamale and Abubakar's uncle who mentors the students."
    },
    {
      "item_number": 12,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "Which young farmer leads the grassroots resistance against illegal mining in Daakye Asem?",
      "options": {
        "A": "Zakari",
        "B": "Iddrisu",
        "C": "Dawuni",
        "D": "Abubakar"
      },
      "correct_answer": "A",
      "explanation": "Zakari evolves from personal frustration into a determined environmental activist leading the youth."
    },
    {
      "item_number": 13,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Devices",
      "question": "Which poetic device is demonstrated when a sentence runs past the end of a line without terminal punctuation, as in 'Mummy runs out and returns / Daddy yells'?",
      "options": {
        "A": "Oxymoron",
        "B": "Enjambment",
        "C": "Caesura",
        "D": "Internal Rhyme"
      },
      "correct_answer": "B",
      "explanation": "Enjambment occurs when an idea or sentence carries over into the next poetic line without terminal punctuation."
    },
    {
      "item_number": 14,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Roles",
      "question": "Who serves as the steadfast romantic partner and moral catalyst for Prince Dawuni's transformation?",
      "options": {
        "A": "Abidatu",
        "B": "Asantewaa",
        "C": "Alheri",
        "D": "Ama"
      },
      "correct_answer": "C",
      "explanation": "Alheri provides continuous love, spiritual stability, and counsel that sparks Dawuni's redemption."
    },
    {
      "item_number": 15,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does the indigenous word 'Saha' mean in the context of the story?",
      "options": {
        "A": "Morning Dew",
        "B": "Clear Water",
        "C": "Golden Sunlight",
        "D": "Sacred River"
      },
      "correct_answer": "B",
      "explanation": "In the text, 'Saha' translates to and represents 'Clear Water'."
    },
    {
      "item_number": 16,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Roles",
      "question": "Which elder embodies traditional wisdom, cultural memory, and ecological stewardship in Daakye Asem?",
      "options": {
        "A": "Elder Onyimdze",
        "B": "Old Soldier",
        "C": "Anfani",
        "D": "Nene Attiapa"
      },
      "correct_answer": "A",
      "explanation": "Elder Onyimdze provides moral and spiritual guidance, cautioning the village against environmental destruction."
    },
    {
      "item_number": 17,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Diction & Stereotyping",
      "question": "Which line from 'The Monday Breeze' reflects everyday gender stereotyping within the domestic setting?",
      "options": {
        "A": "'Blurring horns / Screaming voice'",
        "B": "'Women / They always forget their purse'",
        "C": "'children settle in van'",
        "D": "'Running legs'"
      },
      "correct_answer": "B",
      "explanation": "The line 'Women / They always forget their purse' expresses casual societal stereotyping during morning stress."
    },
    {
      "item_number": 18,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "In Act 2, Scene 1 of 'Dawuni\u2019s Dream', Anzansi warns: 'You'll never succeed. I'll make sure of it.' What literary technique is used here?",
      "options": {
        "A": "Foreshadowing",
        "B": "Euphemism",
        "C": "Apostrophe",
        "D": "Simile"
      },
      "correct_answer": "A",
      "explanation": "Anzansi's statement hints at his future treasonous actions, functioning as foreshadowing."
    },
    {
      "item_number": 19,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "Which continental event in Accra serves as the turning point for Abubakar and Abidatu's invention?",
      "options": {
        "A": "The All-African Games",
        "B": "The Pan African Science Festival",
        "C": "The West African Trade Fair",
        "D": "The ECOWAS Youth Assembly"
      },
      "correct_answer": "B",
      "explanation": "The Pan African Science Festival in Accra gives their invention international visibility and funding."
    },
    {
      "item_number": 20,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Simile & Imagery",
      "question": "In 'Forest Gold', how is the polluted color of the Daakye River described through simile?",
      "options": {
        "A": "'like black charcoal soot'",
        "B": "'like an angry coiled snake'",
        "C": "'a murky brown, like over-steeped tea'",
        "D": "'like melted brass'"
      },
      "correct_answer": "C",
      "explanation": "The contaminated river water is explicitly compared to 'a murky brown, like over-steeped tea'."
    },
    {
      "item_number": 21,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Symbolism",
      "question": "In 'The Monday Breeze', what does 'the purse' primarily symbolize?",
      "options": {
        "A": "Accumulated family financial debt",
        "B": "Domestic organization and the mental burden of maternal responsibilities",
        "C": "A birthday gift from Daddy",
        "D": "Greed for material possessions"
      },
      "correct_answer": "B",
      "explanation": "The purse symbolizes the mother's domestic logistics, multitasking, and organization."
    },
    {
      "item_number": 22,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Symbolism",
      "question": "What does the communal 'rain dance' represent in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "A military drill preparing for civil war",
        "B": "Recreational play for village children",
        "C": "Spiritual communion with the ancestors and nature to end the drought",
        "D": "A celebration of a successful royal wedding"
      },
      "correct_answer": "C",
      "explanation": "The rain dance symbolizes spiritual communion with ancestral powers and the earth."
    },
    {
      "item_number": 23,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective",
      "question": "From which narrative point of view is 'A Calabash of Saha' told?",
      "options": {
        "A": "Third-Person Narrative",
        "B": "First-Person Protagonist (Abubakar)",
        "C": "Second-Person Subjective",
        "D": "First-Person Minor (Dr. Iddrisu)"
      },
      "correct_answer": "A",
      "explanation": "The story uses third-person narration to provide an objective view of the characters' thoughts and actions."
    },
    {
      "item_number": 24,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Irony",
      "question": "What makes the creaking village sign reading 'Daakye Asem - Land of Gold' deeply ironic?",
      "options": {
        "A": "No gold was ever discovered in the area",
        "B": "The pursuit of gold devastated the community's river, farming, and health instead of bringing true prosperity",
        "C": "The sign was painted by foreign miners",
        "D": "The villagers prefer diamond mining to gold mining"
      },
      "correct_answer": "B",
      "explanation": "The sign proclaims glory and wealth, but gold extraction brought environmental devastation and sickness."
    },
    {
      "item_number": 25,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sensory Imagery",
      "question": "Which lines appeal directly to the auditory sense in 'The Monday Breeze'?",
      "options": {
        "A": "'children settle in van'",
        "B": "'Blurring horns / Screaming voice'",
        "C": "'Running legs'",
        "D": "'Mummy runs out and returns'"
      },
      "correct_answer": "B",
      "explanation": "'Blurring horns / Screaming voice' appeals directly to hearing (auditory imagery)."
    },
    {
      "item_number": 26,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "Identify the figure of speech used in Act 4, Scene 1 of 'Dawuni\u2019s Dream': 'Our land is reborn!'",
      "options": {
        "A": "Metaphor",
        "B": "Simile",
        "C": "Irony",
        "D": "Apostrophe"
      },
      "correct_answer": "A",
      "explanation": "Equating the rejuvenated, rain-watered land to a newborn being is a metaphor."
    },
    {
      "item_number": 27,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What literary device is used in the line: 'The community's struggles whispered in their ears'?",
      "options": {
        "A": "Personification",
        "B": "Hyperbole",
        "C": "Simile",
        "D": "Oxymoron"
      },
      "correct_answer": "A",
      "explanation": "Attributing the human act of whispering to 'community struggles' is personification."
    },
    {
      "item_number": 28,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Metaphor",
      "question": "What is the meaning of the metaphor: 'His initial discovery had unleashed a tidal wave'?",
      "options": {
        "A": "A literal tsunami flooded the inland forests of Ghana",
        "B": "The gold find triggered an overwhelming, unstoppable rush of prospectors and rapid change",
        "C": "The mining operations broke an underground dam",
        "D": "Osmond decided to abandon mining and take up fishing"
      },
      "correct_answer": "B",
      "explanation": "The metaphor compares the sudden social upheaval and influx of miners to an unstoppable tidal wave."
    },
    {
      "item_number": 29,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Focus",
      "question": "What central conflict is depicted between Daddy and Mummy in 'The Monday Breeze'?",
      "options": {
        "A": "Disagreements over where the children should attend school",
        "B": "Workplace punctuality and commuter stress versus domestic coordination",
        "C": "Arguments over buying a new family car",
        "D": "Refusal to take the children to morning assembly"
      },
      "correct_answer": "B",
      "explanation": "The morning panic highlights tension between domestic obligations and the pressure to reach work on time."
    },
    {
      "item_number": 30,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "In Act 4, Scene 1 of 'Dawuni\u2019s Dream', 'The land cries out for help' is an example of:",
      "options": {
        "A": "Personification",
        "B": "Litotes",
        "C": "Euphemism",
        "D": "Alliteration"
      },
      "correct_answer": "A",
      "explanation": "Giving the parched earth the human ability to cry out for help is personification."
    },
    {
      "item_number": 31,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Metaphor",
      "question": "In 'A Calabash of Saha', what does the phrase 'Their innovation was a drop of water in the ocean' mean?",
      "options": {
        "A": "Their purification model was lost during transport to Accra",
        "B": "Their invention was a small yet meaningful contribution toward solving a widespread crisis",
        "C": "The Saha system could only filter saltwater",
        "D": "The machine completely malfunctioned during the competition"
      },
      "correct_answer": "B",
      "explanation": "The metaphor indicates that although the invention addresses a vast issue, it is a significant step forward."
    },
    {
      "item_number": 32,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Narrative POV",
      "question": "Which narrative perspective is utilized in 'Forest Gold' to present the perspectives of the chief, prospector, and villagers?",
      "options": {
        "A": "Third-Person Omniscient",
        "B": "First-Person Protagonist (Zakari)",
        "C": "Third-Person Objective",
        "D": "Second-Person Direct Address"
      },
      "correct_answer": "A",
      "explanation": "The omniscient viewpoint allows the narrator to share the internal thoughts and remorse of multiple characters."
    },
    {
      "item_number": 33,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sensory Imagery",
      "question": "What type of imagery is emphasized by the phrase 'Running legs' in 'The Monday Breeze'?",
      "options": {
        "A": "Kinetic imagery",
        "B": "Olfactory imagery",
        "C": "Gustatory imagery",
        "D": "Tactile imagery"
      },
      "correct_answer": "A",
      "explanation": "Kinetic imagery conveys physical movement and rapid action."
    },
    {
      "item_number": 34,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Alliteration",
      "question": "Which phrase from Act 7, Scene 1 of 'Dawuni\u2019s Dream' features alliteration?",
      "options": {
        "A": "'Royal throne'",
        "B": "'Sacred staff'",
        "C": "'Golden crown'",
        "D": "'Ancient elders'"
      },
      "correct_answer": "B",
      "explanation": "'Sacred staff' repeats the initial /s/ consonant sound, creating alliteration."
    },
    {
      "item_number": 35,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Hyperbole",
      "question": "Which statement from 'A Calabash of Saha' is an example of hyperbole?",
      "options": {
        "A": "'They took the bus to Tamale'",
        "B": "'Their innovation would change the world'",
        "C": "'Dr. Iddrisu was a lecturer'",
        "D": "'Abidatu smiled at her partner'"
      },
      "correct_answer": "B",
      "explanation": "Claiming their initial school project 'would change the world' is deliberate exaggeration (hyperbole)."
    },
    {
      "item_number": 36,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "What motivated Chief Daakye Asem to initially welcome the gold prospectors into his village?",
      "options": {
        "A": "Fear of military invasion",
        "B": "Anticipated economic benefits and communal wealth",
        "C": "Orders from regional magistrates",
        "D": "A desire to build a factory on the river"
      },
      "correct_answer": "B",
      "explanation": "The chief was initially enthusiastic about the promised economic development and riches for his community."
    },
    {
      "item_number": 37,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Rhyme Scheme",
      "question": "How is the rhyme scheme of 'The Monday Breeze' described?",
      "options": {
        "A": "Strict alternate rhyme (ABAB)",
        "B": "Irregular / free verse (ABCD)",
        "C": "Monorhyme (AAAA)",
        "D": "Enclosed rhyme (ABBA)"
      },
      "correct_answer": "B",
      "explanation": "The poem uses an irregular/free verse structure (ABCD) without fixed end rhymes."
    },
    {
      "item_number": 38,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Idioms",
      "question": "What does the idiom 'Put the past behind us' mean in Act 5, Scene 1 of 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "To rewrite the historical annals of the tribe",
        "B": "To practice forgiveness and move forward constructively",
        "C": "To banish elderly historians",
        "D": "To conceal stolen royal jewels"
      },
      "correct_answer": "B",
      "explanation": "The idiom conveys forgiveness, reconciliation, and leaving old errors behind."
    },
    {
      "item_number": 39,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "Whom do Abubakar and Abidatu meet following their national victory, validating their project at the highest level?",
      "options": {
        "A": "The Chief Justice of Ghana",
        "B": "The President of Ghana",
        "C": "The Director of UNESCO",
        "D": "The Mayor of Tamale"
      },
      "correct_answer": "B",
      "explanation": "Their success culminates in meeting the President, which provides validation and institutional support."
    },
    {
      "item_number": 40,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Climax",
      "question": "What action marks the dramatic climax of 'Forest Gold'?",
      "options": {
        "A": "The village being sold to international mining corporations",
        "B": "A violent conflict between police and villagers",
        "C": "The youth and elders uniting to shut down the illegal mining site",
        "D": "The dried-up Daakye River overflowing during a storm"
      },
      "correct_answer": "C",
      "explanation": "The climax occurs when the united villagers confront the operators and shut down the mining site."
    },
    {
      "item_number": 41,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Symbolism",
      "question": "In 'The Monday Breeze', what does 'the van' symbolize?",
      "options": {
        "A": "The transition vehicle moving family members from home to public life",
        "B": "The family's commercial delivery business",
        "C": "The breakdown of mechanical transportation",
        "D": "The escape from urban city life"
      },
      "correct_answer": "A",
      "explanation": "The van represents the vessel carrying individuals from the private domestic space to the public world."
    },
    {
      "item_number": 42,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Rhetorical Question",
      "question": "Which character asks the reflective rhetorical question 'What will the future hold?' in Act 8, Scene 1?",
      "options": {
        "A": "Anzansi",
        "B": "Dawuni",
        "C": "Anfani",
        "D": "The Royal Guard"
      },
      "correct_answer": "B",
      "explanation": "Prince Dawuni reflects on the future of his kingdom as he prepares to lead wisely as king."
    },
    {
      "item_number": 43,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Growth",
      "question": "How does Abidatu evolve as a character over the course of the story?",
      "options": {
        "A": "She decides to drop out of school to become a trader",
        "B": "She evolves from a supportive friend into an equal co-innovator and leader",
        "C": "She leaves Karaga to live permanently in Accra",
        "D": "She gives up science in favor of athletics"
      },
      "correct_answer": "B",
      "explanation": "Abidatu moves from being a helpful companion to an assertive, equal scientific partner."
    },
    {
      "item_number": 44,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does the pristine forest symbolize before the arrival of the gold prospectors?",
      "options": {
        "A": "Untamed wildness that must be cleared",
        "B": "Natural balance, ancestral resources, and cultural identity",
        "C": "A barrier separating rural tribes",
        "D": "Unusable agricultural land"
      },
      "correct_answer": "B",
      "explanation": "The forest represents biodiversity, ancestral inheritance, and harmonious cultural life."
    },
    {
      "item_number": 45,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Pacing & Diction",
      "question": "How does the pacing of the short lines in 'The Monday Breeze' mirror its theme?",
      "options": {
        "A": "It creates a slow, meditative rhythm suitable for sleep",
        "B": "It mimics the hurried, breathless movements of a rushed morning",
        "C": "It reflects the long, unhurried passage of time on a farm",
        "D": "It mirrors funeral laments"
      },
      "correct_answer": "B",
      "explanation": "The terse, abrupt couplets reflect the rapid, fragmented nature of a morning rush."
    },
    {
      "item_number": 46,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Irony",
      "question": "What is the irony surrounding Anzansi's defeat in Act 3, Scene 1 of 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "He had already been crowned king before the play began",
        "B": "Despite his supreme confidence and plotting, he suffers an unexpected early defeat",
        "C": "He was trying to protect the prince from enemies",
        "D": "He decided to give away his wealth to the poor"
      },
      "correct_answer": "B",
      "explanation": "Anzansi's downfall is an irony of fate: his boastful confidence is followed by collapse."
    },
    {
      "item_number": 47,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Cultural Realism",
      "question": "How do Abubakar and Abidatu celebrate their cultural identity at the Pan African Science Festival?",
      "options": {
        "A": "By refusing to speak English on stage",
        "B": "By wearing traditional Ghanaian attire during their presentations",
        "C": "By presenting their research through traditional drumming",
        "D": "By distributing local foods to the judges"
      },
      "correct_answer": "B",
      "explanation": "The duo wears traditional northern Ghanaian clothing, connecting innovation with cultural pride."
    },
    {
      "item_number": 48,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Resolution",
      "question": "Why is the resolution of 'Forest Gold' considered bittersweet rather than entirely triumphant?",
      "options": {
        "A": "The mining company arrested Zakari and Elder Onyimdze",
        "B": "Although the site was shut down, the river remained permanently scarred by pollution",
        "C": "The villagers were forced to abandon Daakye Asem",
        "D": "Chief Daakye Asem refused to speak to the elders"
      },
      "correct_answer": "B",
      "explanation": "The resistance succeeded, but the ecological damage to the Daakye River was irreversible."
    },
    {
      "item_number": 49,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Tone",
      "question": "Which pair of adjectives best describes the tone of 'The Monday Breeze'?",
      "options": {
        "A": "Solemn and mournful",
        "B": "Hectic and realistic",
        "C": "Romantic and whimsical",
        "D": "Mystical and supernatural"
      },
      "correct_answer": "B",
      "explanation": "The poem realistically portrays the chaotic, hurried atmosphere of the morning commute."
    },
    {
      "item_number": 50,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Symbolism",
      "question": "In 'Dawuni\u2019s Dream', what does the 'Sacred Cloth' in Act 7, Scene 1 symbolize?",
      "options": {
        "A": "The military flags of foreign invaders",
        "B": "The royal family's heritage, status, and leadership duties",
        "C": "Ordinary clothing worn by rural farmers",
        "D": "A shroud used in royal funerals"
      },
      "correct_answer": "B",
      "explanation": "The sacred cloth represents royal lineage, cultural heritage, and the responsibilities of leadership."
    },
    {
      "item_number": 51,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "Where does the Saha project earn its first competitive victory before moving to the national stage?",
      "options": {
        "A": "The Tamale Municipal Expo",
        "B": "The Karaga Senior High School Science Fair",
        "C": "The University of Ghana Labs",
        "D": "The Northern Regional Exhibition"
      },
      "correct_answer": "B",
      "explanation": "Their first success occurs when they win the science fair at Karaga Senior High School."
    },
    {
      "item_number": 52,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Simile",
      "question": "What are the plastic fuel containers at the mining site compared to in 'Forest Gold'?",
      "options": {
        "A": "'like dead fish on the rocks'",
        "B": "'their translucent walls glowing like lanterns in the dim light'",
        "C": "'like piles of broken skulls'",
        "D": "'like discarded yellow leaves'"
      },
      "correct_answer": "B",
      "explanation": "The plastic containers are described as 'their translucent walls glowing like lanterns in the dim light'."
    },
    {
      "item_number": 53,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structure & Lines",
      "question": "What is the total line count of the poem 'The Monday Breeze'?",
      "options": {
        "A": "14 lines",
        "B": "10 lines",
        "C": "8 lines",
        "D": "20 lines"
      },
      "correct_answer": "B",
      "explanation": "The poem consists of 5 two-line couplets, totaling 10 lines."
    },
    {
      "item_number": 54,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting & Theme",
      "question": "What role does the quiet rural village of Anfani's cousin play in Dawuni's journey?",
      "options": {
        "A": "It is where Anzansi launches his rebellion",
        "B": "It provides a peaceful sanctuary away from palace politics, allowing Dawuni to reflect and reform",
        "C": "It is where the royal army is trained",
        "D": "It serves as a trading post for foreign merchants"
      },
      "correct_answer": "B",
      "explanation": "The rural setting offers tranquility, supporting Dawuni's path to sobriety and transformation."
    },
    {
      "item_number": 55,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sensory Imagery",
      "question": "The phrase 'the sun-baked streets of Karaga' appeals primarily to which sense?",
      "options": {
        "A": "Visual and tactile imagery (heat/sight)",
        "B": "Auditory imagery",
        "C": "Gustatory imagery",
        "D": "Olfactory imagery"
      },
      "correct_answer": "A",
      "explanation": "'Sun-baked' evokes visual and tactile impressions of dry heat and drought."
    },
    {
      "item_number": 56,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Personification",
      "question": "What literary device is demonstrated when 'The water itself seemed to have turned against its inhabitants'?",
      "options": {
        "A": "Simile",
        "B": "Personification",
        "C": "Hyperbole",
        "D": "Understatement"
      },
      "correct_answer": "B",
      "explanation": "Attributing human hostility and intent to water is personification."
    },
    {
      "item_number": 57,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Conflict",
      "question": "In 'The Monday Breeze', what statement from Mummy exposes domestic friction?",
      "options": {
        "A": "'We should stay home today'",
        "B": "'If you had helped me, we would have been gone'",
        "C": "'The children are still asleep'",
        "D": "'I don't want to go to the office'"
      },
      "correct_answer": "B",
      "explanation": "Mummy responds to Daddy's shouting by highlighting the lack of shared domestic help."
    },
    {
      "item_number": 58,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting Symbolism",
      "question": "What does the Royal Palace represent in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "Power, royal authority, and state governance",
        "B": "Rural agricultural labor",
        "C": "Spiritual isolation from the ancestors",
        "D": "Poverty"
      },
      "correct_answer": "A",
      "explanation": "The palace symbolizes political sovereignty, ruling authority, and governance."
    },
    {
      "item_number": 59,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Growth",
      "question": "How does Dr. Iddrisu's role develop throughout the narrative?",
      "options": {
        "A": "From a critical lecturer into an unsupportive relative",
        "B": "From an academic advisor into a proud advocate for the students' innovation",
        "C": "From a partner into a competitor",
        "D": "From a mentor into an investor taking all the profits"
      },
      "correct_answer": "B",
      "explanation": "Dr. Iddrisu evolves from a guiding academic mentor into an active, proud champion of their work."
    },
    {
      "item_number": 60,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Social Criticism",
      "question": "What real-world socio-environmental issue in Ghana is addressed in 'Forest Gold'?",
      "options": {
        "A": "Urban electronic waste dumping",
        "B": "Illegal surface gold mining (galamsey) and water contamination",
        "C": "Depletion of ocean fish stocks",
        "D": "Industrial air pollution in Kumasi"
      },
      "correct_answer": "B",
      "explanation": "The story directly critiques illegal surface gold mining (galamsey) and its impact on water bodies."
    },
    {
      "item_number": 61,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Atmosphere",
      "question": "What atmosphere is created by the repetition of hurried morning actions in 'The Monday Breeze'?",
      "options": {
        "A": "Peaceful reflection",
        "B": "Agitated, rushed tension",
        "C": "Melancholy grief",
        "D": "Celebratory rejoicing"
      },
      "correct_answer": "B",
      "explanation": "The hurried actions and dialogue establish a tense, agitated morning atmosphere."
    },
    {
      "item_number": 62,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Figures of Speech",
      "question": "In Act 6, Scene 2 of 'Dawuni\u2019s Dream', 'The ancestors smile upon us' is an example of:",
      "options": {
        "A": "Metaphor",
        "B": "Simile",
        "C": "Onomatopoeia",
        "D": "Oxymoron"
      },
      "correct_answer": "A",
      "explanation": "Equating ancestral favor to a warm physical smile functions as a metaphor."
    },
    {
      "item_number": 63,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does 'light' symbolize within the thematic framework of 'A Calabash of Saha'?",
      "options": {
        "A": "Physical electricity alone",
        "B": "Knowledge, scientific understanding, and guidance",
        "C": "The dry season in northern Ghana",
        "D": "Material wealth and fame"
      },
      "correct_answer": "B",
      "explanation": "Light symbolizes intellectual clarity, education, and constructive guidance."
    },
    {
      "item_number": 64,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Tone",
      "question": "Why is the tone of 'Forest Gold' described as urgent?",
      "options": {
        "A": "The characters must catch a train to Accra",
        "B": "It emphasizes that environmental destruction requires immediate action before resources are lost forever",
        "C": "The mining company's lease is about to expire",
        "D": "A wild animal is threatening the village"
      },
      "correct_answer": "B",
      "explanation": "The urgent tone reflects the critical need to stop pollution before damage becomes irreversible."
    },
    {
      "item_number": 65,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft & Irony",
      "question": "How does the poet contrast Daddy's impatience with Mummy's reality?",
      "options": {
        "A": "Daddy is quietly praying while Mummy shouts",
        "B": "Daddy yells about punctuality while Mummy handles the practical burden of morning prep",
        "C": "Daddy prepares breakfast while Mummy rests",
        "D": "Daddy takes the bus while Mummy drives"
      },
      "correct_answer": "B",
      "explanation": "Daddy focuses on delays, while Mummy bears the load of getting the household moving."
    },
    {
      "item_number": 66,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Genre",
      "question": "What specific dramatic sub-genre does 'Dawuni\u2019s Dream' belong to?",
      "options": {
        "A": "Farce",
        "B": "Heroic Drama",
        "C": "Melodrama",
        "D": "Domestic Comedy"
      },
      "correct_answer": "B",
      "explanation": "The text classifies 'Dawuni's Dream' specifically as a heroic drama."
    },
    {
      "item_number": 67,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Core Themes",
      "question": "What overarching theme unites both the scientific and social elements of 'A Calabash of Saha'?",
      "options": {
        "A": "The dangers of modern technology",
        "B": "Empowerment through Innovation",
        "C": "The superiority of city life over rural life",
        "D": "Political rivalry in academia"
      },
      "correct_answer": "B",
      "explanation": "The central theme is 'Empowerment through Innovation' for individuals and communities."
    },
    {
      "item_number": 68,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "How does Elder Onyimdze serve as a foil to Osmond in 'Forest Gold'?",
      "options": {
        "A": "Onyimdze values ancestral preservation, while Osmond is driven by extractive greed",
        "B": "Onyimdze seeks gold, while Osmond protects the river",
        "C": "Onyimdze wants foreign intervention, while Osmond relies on villagers",
        "D": "Onyimdze is a youth leader, while Osmond is an elderly farmer"
      },
      "correct_answer": "A",
      "explanation": "Onyimdze represents long-term communal stewardship, contrasting with Osmond's short-term exploitation."
    },
    {
      "item_number": 69,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sound Devices",
      "question": "What sound effect is suggested by the phrase 'Blurring horns' in 'The Monday Breeze'?",
      "options": {
        "A": "Gentle whispering",
        "B": "Jarring, continuous street noise",
        "C": "Rhythmic ocean waves",
        "D": "Soothing music"
      },
      "correct_answer": "B",
      "explanation": "'Blurring horns' conveys persistent, overlapping traffic sounds."
    },
    {
      "item_number": 70,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Symbolism",
      "question": "In 'Dawuni\u2019s Dream', what does 'The Throne' in Act 5, Scene 2 represent?",
      "options": {
        "A": "Material luxury",
        "B": "Legitimate power, responsible leadership, and royal duty",
        "C": "A place of punishment",
        "D": "Subjugation to foreign empires"
      },
      "correct_answer": "B",
      "explanation": "The throne symbolizes legitimate authority and the moral obligation of just governance."
    },
    {
      "item_number": 71,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Thematic Focus",
      "question": "What environmental challenge motivates Abubakar and Abidatu to design the Saha system?",
      "options": {
        "A": "Air pollution from motorbikes",
        "B": "Acute water scarcity and contaminated drinking sources",
        "C": "Loss of farmland to erosion",
        "D": "Deforestation from logging"
      },
      "correct_answer": "B",
      "explanation": "The project is prompted by their community's ongoing struggle to access clean drinking water."
    },
    {
      "item_number": 72,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Symbolism",
      "question": "What does the Daakye River symbolize before its destruction by illegal miners?",
      "options": {
        "A": "A dangerous border to be avoided",
        "B": "Life, purity, and community nourishment",
        "C": "An obstacle to farming",
        "D": "Commercial waterway transport"
      },
      "correct_answer": "B",
      "explanation": "The pristine river symbolizes vitality, life, and the sustenance of the community."
    },
    {
      "item_number": 73,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Theme",
      "question": "Which broader social issue is highlighted by the morning commute in 'The Monday Breeze'?",
      "options": {
        "A": "Poor educational standards",
        "B": "Urban traffic congestion and the pressure of work-life balance",
        "C": "Lack of school buses in rural areas",
        "D": "High fuel prices"
      },
      "correct_answer": "B",
      "explanation": "The poem captures the universal stress of balancing home duties with urban work commitments."
    },
    {
      "item_number": 74,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Simile",
      "question": "In Act 7, Scene 2 of 'Dawuni\u2019s Dream', Prince Dawuni is compared using a simile to:",
      "options": {
        "A": "'a roaring lion'",
        "B": "'the great king who founded our kingdom'",
        "C": "'the sacred baobab'",
        "D": "'a shining spear'"
      },
      "correct_answer": "B",
      "explanation": "He is compared to 'the great king who founded our kingdom' using 'like'."
    },
    {
      "item_number": 75,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Setting Symbolism",
      "question": "What does the city of Tamale represent in 'A Calabash of Saha'?",
      "options": {
        "A": "Recreational tourism",
        "B": "Academic mentorship, guidance, and technical development",
        "C": "International trade",
        "D": "Political rallies"
      },
      "correct_answer": "B",
      "explanation": "Tamale represents the step up to professional academic guidance under Dr. Iddrisu."
    },
    {
      "item_number": 76,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Plot Progression",
      "question": "What health problem begins to afflict the residents of Daakye Asem after the gold rush begins?",
      "options": {
        "A": "Malaria outbreaks",
        "B": "Waterborne illnesses from contaminated river water",
        "C": "Respiratory diseases from dust",
        "D": "Malnutrition from crop failure"
      },
      "correct_answer": "B",
      "explanation": "Pollution of the drinking water source leads directly to waterborne illnesses among villagers."
    },
    {
      "item_number": 77,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sensory Devices",
      "question": "The phrase 'Daddy yells' primarily contributes to which sensory layer of the poem?",
      "options": {
        "A": "Visual imagery",
        "B": "Auditory imagery",
        "C": "Tactile imagery",
        "D": "Olfactory imagery"
      },
      "correct_answer": "B",
      "explanation": "'Daddy yells' contributes to the loud auditory experience of the frantic morning."
    },
    {
      "item_number": 78,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Growth",
      "question": "What is the defining trait of Prince Dawuni's leadership at the end of the play?",
      "options": {
        "A": "Autocratic command and revenge",
        "B": "Wisdom, compassion, and responsible decision-making",
        "C": "Isolation from commoners",
        "D": "Focus on personal wealth"
      },
      "correct_answer": "B",
      "explanation": "Dawuni completes his transformation into a wise, compassionate, and responsible ruler."
    },
    {
      "item_number": 79,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Structure",
      "question": "What structural format does the plot of 'A Calabash of Saha' follow?",
      "options": {
        "A": "Non-linear flashback structure",
        "B": "Linear, chronological narrative structure",
        "C": "Epistolary diary format",
        "D": "In medias res"
      },
      "correct_answer": "B",
      "explanation": "The story follows a straightforward, chronological linear sequence."
    },
    {
      "item_number": 80,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Structural Devices",
      "question": "What is the function of caesura in the narrative prose of 'Forest Gold'?",
      "options": {
        "A": "To create rhyming musicality",
        "B": "To create reflective pauses that emphasize moments of grief, shock, or resolve",
        "C": "To indicate a change in narrator",
        "D": "To show the passage of several decades"
      },
      "correct_answer": "B",
      "explanation": "Deliberate pauses within sentences highlight key moments of contemplation and resolve."
    },
    {
      "item_number": 81,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft & Structure",
      "question": "Why are the stanzas kept uniform at two lines each?",
      "options": {
        "A": "To allow children to memorize the poem for church recitals",
        "B": "To create rapid, balanced units mirroring hurried, back-and-forth morning interactions",
        "C": "Because the poet ran out of words",
        "D": "To imitate traditional French sonnets"
      },
      "correct_answer": "B",
      "explanation": "Two-line couplets create quick, alternating glimpses that reflect the frantic morning tempo."
    },
    {
      "item_number": 82,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting Symbolism",
      "question": "What does the Village Square represent in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "The private residence of royal concubines",
        "B": "Public community gathering, social life, and collective voice",
        "C": "A site reserved exclusively for trade negotiations",
        "D": "The cemetery of ancient kings"
      },
      "correct_answer": "B",
      "explanation": "The village square represents the heart of community gatherings, shared opinions, and public life."
    },
    {
      "item_number": 83,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Foreshadowing",
      "question": "How does winning the school science fair serve the plot of 'A Calabash of Saha'?",
      "options": {
        "A": "It ends the conflict of the story",
        "B": "It foreshadows their eventual success on the national and continental stage",
        "C": "It causes Dr. Iddrisu to withdraw his help",
        "D": "It leads to the immediate destruction of their machine"
      },
      "correct_answer": "B",
      "explanation": "The early victory at Karaga SHS foreshadows their wider success at the Pan African festival."
    },
    {
      "item_number": 84,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Transformation",
      "question": "What internal shift does Zakari undergo over the course of the story?",
      "options": {
        "A": "From a greedy prospector to a peaceful monk",
        "B": "From feelings of helplessness to confident, active community leadership",
        "C": "From an elder into a royal spokesperson",
        "D": "From a teacher into a municipal inspector"
      },
      "correct_answer": "B",
      "explanation": "Zakari channels his initial anger and helplessness into organized civic defense."
    },
    {
      "item_number": 85,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Theme",
      "question": "What final action marks the conclusion of the domestic chaos in 'The Monday Breeze'?",
      "options": {
        "A": "The family goes back to sleep",
        "B": "The children settle into the van",
        "C": "The car engine fails to start",
        "D": "Daddy leaves everyone behind"
      },
      "correct_answer": "B",
      "explanation": "The poem ends with the children finally seated in the van as the trip begins."
    },
    {
      "item_number": 86,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Theme",
      "question": "What core message does 'Dawuni\u2019s Dream' deliver regarding personal failure and redemption?",
      "options": {
        "A": "Once an individual makes moral mistakes, they can never be trusted to lead",
        "B": "Through sincere humility, supportive relationships, and ancestral guidance, reform is possible",
        "C": "Rulers are above traditional morality and community expectations",
        "D": "Revenge against rivals is necessary to secure power"
      },
      "correct_answer": "B",
      "explanation": "The play shows that with humility, proper counsel, and positive support, an individual can reform."
    },
    {
      "item_number": 87,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Style",
      "question": "Which statement best characterizes the author's literary style in 'A Calabash of Saha'?",
      "options": {
        "A": "Abstract, dense, and difficult to comprehend",
        "B": "Clear, accessible language paired with descriptive, inspiring storytelling",
        "C": "Satirical and biting criticism of rural people",
        "D": "Tragic, sorrowful lamentation"
      },
      "correct_answer": "B",
      "explanation": "The prose uses clear, engaging language designed to inspire readers through descriptive narrative."
    },
    {
      "item_number": 88,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Analysis",
      "question": "What defining psychological state characterizes Chief Daakye Asem by the end of the narrative?",
      "options": {
        "A": "Triumphant celebration",
        "B": "Deep remorse, accountability, and regret over his earlier decisions",
        "C": "Indifference to the community's plight",
        "D": "Anger at Elder Onyimdze"
      },
      "correct_answer": "B",
      "explanation": "The chief is sobered by the outcome, feeling profound remorse for allowing the miners in."
    },
    {
      "item_number": 89,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Theme",
      "question": "How does Alheri's character contrast with Dawuni throughout the plot?",
      "options": {
        "A": "Dawuni changes over time, while Alheri remains a steady, consistent moral anchor",
        "B": "Alheri turns to alcoholism, while Dawuni stays sober",
        "C": "Alheri joins Anzansi, while Dawuni flees the village",
        "D": "Alheri demands the crown, while Dawuni renounces it"
      },
      "correct_answer": "A",
      "explanation": "Dawuni undergoes dynamic growth, while Alheri provides unwavering stability and values."
    },
    {
      "item_number": 90,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "What lasting legacy does the village of Daakye Asem create despite the environmental damage to their river?",
      "options": {
        "A": "They establish the largest gold refinery in the region",
        "B": "Their unified resistance inspires neighboring communities to stand against environmental exploitation",
        "C": "They abandon their village and relocate to Accra",
        "D": "They pass laws banning farming"
      },
      "correct_answer": "B",
      "explanation": "Their collective stand becomes a model of environmental defense for surrounding communities."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "The Monday Breeze",
      "strand": "Poetry Extract & Appreciation",
      "extract": "Blurring horns\nScreaming voice\nRunning legs\nWomen\nThey always forget their purse\nI am late, Daddy yells\nIf you had helped me, we would have been gone\nchildren settle in van",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the structural form of the stanzas in this poem.",
          "marks": 2,
          "expected_answer": "The poem is structured into two-line stanzas known as couplets."
        },
        {
          "label": "(b)",
          "question": "Explain the situational irony contained in the poem's title, 'The Monday Breeze'.",
          "marks": 3,
          "expected_answer": "The word 'breeze' suggests gentle, cooling calmness and relaxation. In contrast, the poem depicts frantic panic, blaring horns, shouting parents, and commuter stress."
        },
        {
          "label": "(c)",
          "question": "Identify one example of enjambment in the extract and explain its poetic effect.",
          "marks": 3,
          "expected_answer": "Example: 'Blurring horns / Screaming voice' or 'Mummy runs out and returns / Daddy yells'. Poetic effect: The lack of terminal punctuation creates a rushed, breathless pace that mirrors the family's morning hurry."
        },
        {
          "label": "(d)",
          "question": "What does 'the purse' symbolize regarding maternal roles in the household?",
          "marks": 2,
          "expected_answer": "It symbolizes domestic coordination, family logistics, and the mental burden of maternal responsibilities."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Appreciation",
      "extract": "ANZANSI: (Sneering, stepping close to Dawuni) You think a few sober mornings make you a king? You'll never succeed. I'll make sure of it.\nALHERI: (Stepping between them, voice calm and resolute) The throne does not belong to your greed, Anzansi. The ancestors hear our plea, and this land will breathe again.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "In what act and scene does this dramatic confrontation occur, and what literary device is found in Anzansi's speech?",
          "marks": 2,
          "expected_answer": "Act 2, Scene 1. Anzansi's threat functions as foreshadowing of his future treasonous plots."
        },
        {
          "label": "(b)",
          "question": "Identify the figure of speech used by Alheri in the phrase 'this land will breathe again'.",
          "marks": 2,
          "expected_answer": "Personification (or Metaphor), attributing the living human capacity of breathing to the parched earth."
        },
        {
          "label": "(c)",
          "question": "Contrast the character traits of Anzansi and Alheri as revealed in this extract.",
          "marks": 3,
          "expected_answer": "Anzansi is arrogant, menacing, and driven by self-serving political greed. Alheri is protective, composed, courageous, and grounded in ancestral faith."
        },
        {
          "label": "(d)",
          "question": "What does 'the throne' symbolize in the context of the drama?",
          "marks": 3,
          "expected_answer": "The throne symbolizes legitimate authority, state governance, and the sacred moral duty of wise and selfless leadership."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Appreciation",
      "extract": "ANFANI: (Holding up the sacred staff toward the gathering clouds) Put the past behind us, my children. When the rain pours down, let it wash away the bitter thirst of our mistakes.\nDAWUNI: (Kneeling, voice clear) Our kingdom will thrive once more! What will the future hold?",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the idiom used by Anfani and explain its meaning.",
          "marks": 2,
          "expected_answer": "Idiom: 'Put the past behind us'. It means practicing forgiveness, letting go of past missteps, and moving forward constructively."
        },
        {
          "label": "(b)",
          "question": "Identify the figure of speech in Dawuni's proclamation: 'Our kingdom will thrive once more!'",
          "marks": 2,
          "expected_answer": "Hyperbole (deliberate, grand exaggeration expressing renewed hope and future prosperity)."
        },
        {
          "label": "(c)",
          "question": "What literary device is used in the closing sentence, 'What will the future hold?', and what is its dramatic purpose?",
          "marks": 3,
          "expected_answer": "Rhetorical Question. Its purpose is to encourage thoughtful reflection on the challenges and responsibilities of future leadership."
        },
        {
          "label": "(d)",
          "question": "Analyze how the physical setting shifts alongside Dawuni's transformation across the play.",
          "marks": 3,
          "expected_answer": "Dawuni moves from the stressful palace environment to the peaceful rural village and sacred grove for reflection, before returning to the palace as a reformed leader."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Appreciation",
      "extract": "The sun-baked streets of Karaga seemed to shimmer with heat. Abubakar adjusted the wire on the prototype, his hands trembling slightly. 'If this UV lamp fails, Abidatu, we have nothing.' Abidatu looked at him, her eyes bright with resolve. 'The community's struggles whispered in our ears, Abubakar. We are not turning back.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify two distinct figures of speech used in the extract.",
          "marks": 2,
          "expected_answer": "1. Sensory/tactile imagery: 'sun-baked streets'. 2. Personification: 'community's struggles whispered in our ears'."
        },
        {
          "label": "(b)",
          "question": "What concrete technical challenge were Abubakar and Abidatu wrestling with at this point?",
          "marks": 2,
          "expected_answer": "Sourcing and properly wiring the correct UV lamp needed for their water sterilization prototype."
        },
        {
          "label": "(c)",
          "question": "How does Abidatu's response demonstrate her character growth in the narrative?",
          "marks": 3,
          "expected_answer": "She steps up as a confident, assertive co-innovator, providing steady emotional and moral support when Abubakar experiences self-doubt."
        },
        {
          "label": "(d)",
          "question": "What is the symbolic meaning of 'Saha' (Clear Water) in the story?",
          "marks": 3,
          "expected_answer": "It symbolizes scientific innovation, renewal, good health, and community empowerment through local problem-solving."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Appreciation",
      "extract": "Standing under the brilliant lights of the auditorium in Accra, Abubakar and Abidatu's journey was a shining example to youth across the continent. When the judges announced the Saha System as first prize winner, Dr. Iddrisu wiped a tear of pride from his cheek. Their innovation was a drop of water in the ocean, yet it had stirred an entire nation.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the two metaphors contained in this extract.",
          "marks": 2,
          "expected_answer": "1. 'journey was a shining example' (comparing their path to an illuminating light). 2. 'innovation was a drop of water in the ocean'."
        },
        {
          "label": "(b)",
          "question": "What does the location of Accra symbolize in contrast to their hometown of Karaga?",
          "marks": 3,
          "expected_answer": "Accra symbolizes national opportunity, wider exposure, and competitive achievement, whereas Karaga represents humble roots and local challenges."
        },
        {
          "label": "(c)",
          "question": "How did Dr. Iddrisu's role shift between the beginning of their research and this moment?",
          "marks": 3,
          "expected_answer": "He evolved from an academic lecturer offering guidance in Tamale into a dedicated, proud advocate celebrating their success."
        },
        {
          "label": "(d)",
          "question": "What major national event follows this victory to cement their achievement?",
          "marks": 2,
          "expected_answer": "They meet the President of Ghana, receiving official government validation and funding."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Forest Gold",
      "strand": "Prose Extract & Appreciation",
      "extract": "The Daakye River, once a shimmering ribbon of crystal clarity, had darkened to a murky brown, like over-steeped tea. On the bank, plastic fuel containers glowed like lanterns in the dim light. Chief Daakye Asem stood silent, his chest heavy with regret. His initial discovery had unleashed a tidal wave, and now his people drank from poisoned shallows.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify two distinct similes used in this extract to illustrate environmental damage.",
          "marks": 2,
          "expected_answer": "1. 'like over-steeped tea' (describing the murky river). 2. 'glowed like lanterns in the dim light' (describing plastic containers)."
        },
        {
          "label": "(b)",
          "question": "Explain the metaphor 'His initial discovery had unleashed a tidal wave'.",
          "marks": 3,
          "expected_answer": "It compares the discovery of gold to a massive, uncontrollable wave of outside miners, social upheaval, and environmental destruction."
        },
        {
          "label": "(c)",
          "question": "Why does Chief Daakye Asem experience deep remorse in this scene?",
          "marks": 3,
          "expected_answer": "He realizes that his choice to welcome the miners brought pollution, disease, and suffering to his people rather than true prosperity."
        },
        {
          "label": "(d)",
          "question": "What does the river symbolize in its polluted state?",
          "marks": 2,
          "expected_answer": "It symbolizes the toll of corporate greed, human negligence, and the harm inflicted on vital community resources."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Forest Gold",
      "strand": "Prose Extract & Appreciation",
      "extract": "Zakari raised his hand, gesturing toward the excavators lined along the scarred riverbank. 'We do not wait for another child to fall sick!' Beside him, Elder Onyimdze nodded, his carved walking stick planted firmly in the red mud. 'The water itself has turned against us because we allowed greed to sit where reverence once lived.' Together, the village moved forward to shut down the pits.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What narrative stage of the plot does this extract depict?",
          "marks": 2,
          "expected_answer": "The climax of the story (the direct confrontation where villagers shut down the mining site)."
        },
        {
          "label": "(b)",
          "question": "Identify the personification used by Elder Onyimdze and explain its meaning.",
          "marks": 3,
          "expected_answer": "Personification: 'The water itself has turned against us'. It portrays the polluted river as a wounded entity reacting against human abuse."
        },
        {
          "label": "(c)",
          "question": "How does the partnership between Zakari and Elder Onyimdze highlight the theme of community mobilization?",
          "marks": 3,
          "expected_answer": "It shows that effective action bridges generations, combining the moral authority and wisdom of elders with the energy and resolve of the youth."
        },
        {
          "label": "(d)",
          "question": "State the final outcome of the community's action.",
          "marks": 2,
          "expected_answer": "The mining site is shut down, and although the river remains scarred, the village's stand inspires neighboring communities."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "The Monday Breeze & Dawuni\u2019s Dream",
      "strand": "Comparative Literature",
      "extract": "TEXT 1 (The Monday Breeze):\n'I am late, Daddy yells / If you had helped me, we would have been gone'\n\nTEXT 2 (Dawuni\u2019s Dream):\n'ANZANSI: You think a few sober mornings make you a king? You'll never succeed.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does interpersonal dialogue generate tension in both Text 1 and Text 2?",
          "marks": 3,
          "expected_answer": "In Text 1, domestic dialogue exposes stress and friction over household labor and punctuality. In Text 2, dialogue reveals political jealousy and threats to undermine leadership."
        },
        {
          "label": "(b)",
          "question": "Identify the underlying tone of the speaker in Text 1 compared to the speaker in Text 2.",
          "marks": 3,
          "expected_answer": "Text 1 carries an irritated, impatient, and rushed tone. Text 2 expresses a malicious, hostile, and threatening tone."
        },
        {
          "label": "(c)",
          "question": "Explain how gender roles or domestic dynamics are examined in Text 1.",
          "marks": 4,
          "expected_answer": "Text 1 touches on patriarchal impatience and the unequal division of morning domestic labor, as Mummy notes that shared assistance would have prevented the delay."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "A Calabash of Saha & Forest Gold",
      "strand": "Comparative Literature",
      "extract": "TEXT 1 (A Calabash of Saha):\n'The community's struggles whispered in their ears... The Saha system would bring clean water back to the children of Karaga.'\n\nTEXT 2 (Forest Gold):\n'In the distance, a faded sign creaked in the wind: Daakye Asem - Land of Gold. The pursuit of wealth had destroyed the community's livelihood.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What common natural resource forms the core conflict in both texts?",
          "marks": 2,
          "expected_answer": "Clean water (water bodies / drinking water)."
        },
        {
          "label": "(b)",
          "question": "Contrast how youth respond to environmental challenges in Text 1 versus Text 2.",
          "marks": 4,
          "expected_answer": "In Text 1, the youth use scientific innovation and engineering to clean contaminated water. In Text 2, the youth engage in direct civic activism and community organizing to halt illegal mining."
        },
        {
          "label": "(c)",
          "question": "Explain the irony present in the faded sign in Text 2.",
          "marks": 4,
          "expected_answer": "The sign calls the village the 'Land of Gold', promising prosperity, but the search for gold ended up ruining the river and the community's way of life."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis (All Basic 8 Texts)",
      "strand": "General Literature & Essay Methodology",
      "extract": "Literature under the NaCCA curriculum uses setting, character transformation, and symbolism to address real-world community development.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "State the three steps of the P-E-E essay formulation methodology used in WAEC BECE literature examinations.",
          "marks": 3,
          "expected_answer": "P - Point (clear topic sentence asserting the claim). E - Evidence (textual quotation or specific incident). E - Explanation (analysis of literary devices, character motivations, and thematic relevance)."
        },
        {
          "label": "(b)",
          "question": "Select two texts from Basic 8 and identify one dynamic character from each, stating how they transform.",
          "marks": 4,
          "expected_answer": "1. 'Dawuni's Dream': Prince Dawuni transforms from an irresponsible alcoholic into a wise, compassionate king. 2. 'Forest Gold': Zakari transforms from a frustrated farmer into an active community leader."
        },
        {
          "label": "(c)",
          "question": "State two ways in which traditional culture supports positive change across the Basic 8 selections.",
          "marks": 3,
          "expected_answer": "1. In 'Dawuni's Dream', ancestral guidance and elder counsel anchor Dawuni's reform. 2. In 'Forest Gold', traditional ecological respect voiced by Elder Onyimdze unites the village to defend their land."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB8Foundation() {
  console.log("Seeding Basic 8 Foundation Practice Lab (100 Items) for The Beacon of Light...");
  const db = await getFirestoreDb();

  const allItems: any[] = [];

  // 1. Process Section A: 90 Objectives
  // Let's create balanced target option positions (23 A, 23 B, 22 C, 22 D)
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
      id: `B8_BL_F_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "foundation",
      category: `${item.strand} Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Recall key details, structure, and literary figures in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Demonstrate foundational comprehension of prescribed The Beacon of Light texts (${item.text}), analyzing poetic structure, dramatic conflicts, narrative setting, characterization, and figures of speech.`
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
      id: `B8_BL_F_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B8",
      difficulty: "foundation",
      category: `${item.strand}`,
      title: `${item.text} - Literary Appreciation`,
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
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Accurately answers sub-question ${sq.label}`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Terminology & Analytical Precision",
            maxMarks: 5,
            scoringGuidelines: ["Accurate identification of literary devices (enjambment, irony, personification, couplets, allegory)", "Clear, grammatically sound answers"],
            diagnosticChecklist: ["Demonstrates clear literary diction and adherence to WAEC answering conventions"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Carefully examine the extract from '${item.text}' to identify literary devices, character motivations, and thematic significance.`,
      competencyTarget: `${item.strand}: Extract Analysis & Literary Appreciation`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Analyze literature extracts from The Beacon of Light across poetry, drama, and prose, evaluating poetic structure, character dynamics, dramatic techniques, and thematic significance.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B8",
    difficulty: "foundation",
    title: "Basic 8 Literature Diagnostic Lab: The Beacon of Light (Foundation Tier - 100 Items)",
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
          id: `B8_BL_F_TH_${t.item_number}`,
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B8_foundation`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // 2. Update parent doc practice pool for B8 low/foundation
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b8: {
            practicePool: {
              low: allItems
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool to: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B8 Foundation Lab!`);
}

seedBeaconOfLightB8Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Foundation Lab:", err);
    process.exit(1);
  });
