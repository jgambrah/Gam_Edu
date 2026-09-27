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
    "title": "Basic 7 Literature Diagnostic Lab - Intermediate Tier",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 7 (JHS 1)",
    "tier": "Intermediate",
    "total_questions": 44,
    "breakdown": {
      "section_a_objectives": 40,
      "section_b_theory_extracts": 4
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
      "sub_strand": "Character Foils & Motivation",
      "question": "How does Bediako's initial attitude toward Kissiwaa serve as a character foil to Old Soldier's demeanor?",
      "options": {
        "A": "Bediako displays humility, whereas Old Soldier is dismissive",
        "B": "Bediako represents chauvinistic overconfidence, whereas Old Soldier upholds impartial decorum and wisdom",
        "C": "Bediako relies on superstitious charms, while Old Soldier relies on tactical skill",
        "D": "Bediako seeks peace, whereas Old Soldier instigates crowd aggression"
      },
      "correct_answer": "B",
      "explanation": "Bediako embodies youthful male chauvinism and arrogance, directly contrasting with Old Soldier's measured, dignified, and fair-minded authority."
    },
    {
      "item_number": 2,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Indirect Characterization",
      "question": "What does Maame Tutuwa's choice to tell bedtime stories to her little sister reveal through indirect characterization?",
      "options": {
        "A": "Her underlying resourcefulness, empathy, and nurturing instincts despite personal struggle",
        "B": "Her desire to avoid doing her evening mathematics assignments",
        "C": "Her ambition to become a professional village playwright",
        "D": "Her resentment toward her parents' domestic demands"
      },
      "correct_answer": "A",
      "explanation": "Indirect characterization shows her patience, warmth, and nurturing nature through domestic devotion rather than overt authorial praise."
    },
    {
      "item_number": 3,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the author connect the theme of 'emotional scars' with the manifestation of empathy in the classroom?",
      "options": {
        "A": "Only students without personal struggles are able to assist others",
        "B": "Abigail's past traumatic experiences with poverty enable her to recognize and comfort Samuel's pain",
        "C": "Mrs. Adjei punishes students who express past emotional trauma",
        "D": "The students conceal their scars behind disciplinary rules"
      },
      "correct_answer": "B",
      "explanation": "Abigail's own background of hardship and childhood hunger pangs serves as the direct source of her courage and sensitivity toward Samuel."
    },
    {
      "item_number": 4,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Structural Turning Points",
      "question": "What is the structural significance of the protagonist presenting the cleanup proposal to Mr. Alhasan?",
      "options": {
        "A": "It marks the tragic decline of the community's coastal fishing trade",
        "B": "It shifts the narrative from private observation to proactive civic mobilization",
        "C": "It introduces an antagonistic conflict between students and teachers",
        "D": "It serves as the final falling action of the plot"
      },
      "correct_answer": "B",
      "explanation": "Approaching Mr. Alhasan transitions the protagonist from an isolated, distressed observer into an active community organizer."
    },
    {
      "item_number": 5,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Cultural Philosophy",
      "question": "Which traditional African ethical philosophy is most clearly demonstrated when the village unites to celebrate Kissiwaa's victory?",
      "options": {
        "A": "Fatalism",
        "B": "Ubuntu ('I am because we are')",
        "C": "Individualism",
        "D": "Nepotism"
      },
      "correct_answer": "B",
      "explanation": "The communal elevation following her victory reflects Ubuntu\u2014individual achievement harmonizing with collective pride and social cohesion."
    },
    {
      "item_number": 6,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Symbolic Function",
      "question": "In what way does the eagle's 'patient hunt' mirror Maame Tutuwa's academic development?",
      "options": {
        "A": "It suggests she must aggressively eliminate her classroom competitors",
        "B": "It illustrates that quiet discipline, focus, and sustained preparation precede breakthrough success",
        "C": "It indicates that academic achievement is based strictly on predatory instincts",
        "D": "It symbolizes her eventual departure from Ghanaian public schools"
      },
      "correct_answer": "B",
      "explanation": "The text links the eagle's silent, patient stalking to the persistent, solitary academic practice required to master complex mathematics."
    },
    {
      "item_number": 7,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Character Development",
      "question": "Why is Jerry categorized as a dynamic character in 'The Family That Cared'?",
      "options": {
        "A": "He transfers to another school before the term ends",
        "B": "He remains the class clown throughout the entire narrative",
        "C": "He evolves from an insensitive mocker into an active, empathetic ally",
        "D": "He challenges Mrs. Adjei's pedagogical authority"
      },
      "correct_answer": "C",
      "explanation": "A dynamic character undergoes an internal transformation; Jerry discards his jokester facade and shows active kindness to Samuel."
    },
    {
      "item_number": 8,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Symbolic Contrast",
      "question": "What thematic contrast is established between the beach's initial state and Grandpa's heirloom medal?",
      "options": {
        "A": "Urban pollution versus Western industrial machinery",
        "B": "Transient modern neglect versus enduring moral principles and heritage",
        "C": "Government corruption versus military victory",
        "D": "Youthful rebellion versus elderly stubbornness"
      },
      "correct_answer": "B",
      "explanation": "The abandoned plastic debris reflects contemporary societal neglect, while Grandpa's brass medal embodies timeless moral endurance and stewardship."
    },
    {
      "item_number": 9,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Narrative Conflict",
      "question": "What socio-cultural barrier does Kissiwaa primarily confront in the village square of Asempayetia?",
      "options": {
        "A": "Religious dogma preventing girls from outdoor recreation",
        "B": "The entrenched patriarchal assumption that intellectual strategy games belong exclusively to men",
        "C": "Economic class warfare between farmers and traders",
        "D": "Hostility between indigenous residents and foreign settlers"
      },
      "correct_answer": "B",
      "explanation": "Her central obstacle is gender prejudice, encapsulated by Ababio's mocking sneer that draughts is strictly an arena for men."
    },
    {
      "item_number": 10,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Narrative Point of View",
      "question": "What is the primary effect of using Third-Person Limited narration in 'Fly Like an Eagle'?",
      "options": {
        "A": "It creates comic distance from Maame Tutuwa's mathematical failures",
        "B": "It allows the reader to intimately experience Maame Tutuwa's interior anxiety, self-doubt, and gradual awakening",
        "C": "It delivers an objective, unemotional report of school test results",
        "D": "It reveals the private thoughts of every student in the classroom simultaneously"
      },
      "correct_answer": "B",
      "explanation": "Third-person limited narrative confines perspective to Maame Tutuwa's inner consciousness, fostering deep reader empathy."
    },
    {
      "item_number": 11,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Sub-Text & Social Commentary",
      "question": "What does Samuel's makeshift breakfast of gari and sachet water reveal about the socio-economic setting?",
      "options": {
        "A": "The strict dietary rules imposed by the school headmaster",
        "B": "The hidden reality of child poverty and food insecurity within ordinary schools",
        "C": "The widespread preference for indigenous grains over continental meals",
        "D": "The lack of potable piped water infrastructure across the whole district"
      },
      "correct_answer": "B",
      "explanation": "Samuel's meal highlights the economic disparities and quiet dignity of impoverished pupils struggling in school without basic sustenance."
    },
    {
      "item_number": 12,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Tone & Atmosphere",
      "question": "How does the author create a 'reflective tone' in 'A Medal from Grandpa'?",
      "options": {
        "A": "Through rapid, chaotic dialogue between market vendors",
        "B": "Through the protagonist's introspective musings on human neglect and personal responsibility",
        "C": "Through angry confrontations between beachcombers and civic authorities",
        "D": "Through sarcastic commentary mocking community passivity"
      },
      "correct_answer": "B",
      "explanation": "The reflective tone is established by the first-person narrator pondering the consequences of human apathy toward nature."
    },
    {
      "item_number": 13,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Figure of Speech Analysis",
      "question": "What does the simile 'Her marbles lined up like elite soldiers' convey regarding Kissiwaa's mental state?",
      "options": {
        "A": "Her violent desire to humiliate Bediako physically",
        "B": "Her strategic precision, discipline, and calculated mastery of the board",
        "C": "Her fear of losing community standing under the Nyamedua tree",
        "D": "Her reliance on luck rather than thoughtful preparation"
      },
      "correct_answer": "B",
      "explanation": "Comparing her game pieces to elite soldiers emphasizes disciplined organization, tactical forethought, and composure under pressure."
    },
    {
      "item_number": 14,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Narrative Architecture",
      "question": "What makes 'The Family That Cared' a meta-narrative (a story within a story)?",
      "options": {
        "A": "The characters write diary entries that contradict the narrator",
        "B": "Mrs. Adjei teaches an English literature lesson titled 'The Family That Cared', which directly mirrors and alters the real classroom dynamic",
        "C": "The protagonist falls asleep and dreams the central plot line",
        "D": "The author appears as an active character in the playground setting"
      },
      "correct_answer": "B",
      "explanation": "The story uses a literary lesson about a caring family to trigger real-life behavioral transformation among the student characters."
    },
    {
      "item_number": 15,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Setting & Characterization",
      "question": "How does the home setting functionally contrast with the school setting in 'Fly Like an Eagle'?",
      "options": {
        "A": "Home offers cultural warmth, security, and emotional recovery, while the classroom represents trial, anxiety, and eventual self-actualization",
        "B": "Home is a place of disciplinary punishment, whereas school is a carefree playground",
        "C": "Home isolates Maame Tutuwa from books, while school provides family affection",
        "D": "Home represents Western modernity, whereas school reinforces traditional rural practices"
      },
      "correct_answer": "A",
      "explanation": "The domestic environment provides unconditional emotional security, whereas the school environment provides the challenge required for intellectual growth."
    },
    {
      "item_number": 16,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What core lesson about leadership does Grandpa's final discussion with the protagonist impart?",
      "options": {
        "A": "True leadership requires holding high political office",
        "B": "Lasting honor is achieved by identifying community degradation and taking selfless initiative to restore it",
        "C": "Environmental protection should be left exclusively to municipal sanitation workers",
        "D": "Material rewards are more important than communal approval"
      },
      "correct_answer": "B",
      "explanation": "Grandpa emphasizes that genuine leadership consists of taking moral responsibility to resolve shared societal problems without waiting for praise."
    },
    {
      "item_number": 17,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Irony",
      "question": "Why does Jerry's sudden reading difficulty qualify as situational irony?",
      "options": {
        "A": "Jerry was known as the brightest academic scholar in the school",
        "B": "The boy who ridiculed another's vulnerability is instantly placed in a position requiring peer compassion",
        "C": "Mrs. Adjei intentionally gave Jerry an impossible text to read",
        "D": "Samuel laughed louder than anyone else in the room"
      },
      "correct_answer": "B",
      "explanation": "Situational irony occurs when an outcome opposes expectations; Jerry's mocking behavior boomerangs when he stumbles and requires Samuel's mercy."
    },
    {
      "item_number": 18,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Character Classification",
      "question": "Why is Old Soldier correctly classified as a static character?",
      "options": {
        "A": "He is unable to walk without physical assistance",
        "B": "His moral convictions, discipline, and role as an impartial community elder remain unchanged from start to finish",
        "C": "He refuses to acknowledge Kissiwaa's victory at the end of the game",
        "D": "He loses his memory during the tournament"
      },
      "correct_answer": "B",
      "explanation": "A static character does not undergo fundamental internal change; Old Soldier maintains his upright moral baseline throughout."
    },
    {
      "item_number": 19,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What literary device is present in the phrase: '...dispelling the evening's gloom'?",
      "options": {
        "A": "Metaphor",
        "B": "Simile",
        "C": "Onomatopoeia",
        "D": "Apostrophe"
      },
      "correct_answer": "A",
      "explanation": "The phrase metaphorically equates psychological joy to light dispelling physical darkness without 'like' or 'as'."
    },
    {
      "item_number": 20,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Pedagogical Critique",
      "question": "What potential limitation in Mrs. Adjei's classroom management is highlighted in the critical commentary?",
      "options": {
        "A": "She was excessively harsh and used physical punishment",
        "B": "She could have proactively intervened to prevent public teasing before it escalated",
        "C": "She refused to teach literature prescribed by the syllabus",
        "D": "She favored affluent students over impoverished ones"
      },
      "correct_answer": "B",
      "explanation": "The commentary notes that while nurturing, Mrs. Adjei could improve by anticipating student emotional crises before public mocking takes place."
    },
    {
      "item_number": 21,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Indirect Characterization",
      "question": "What is revealed when Bediako's shoulders droop and his voice cracks as Kissiwaa corners his final pieces?",
      "options": {
        "A": "He is faking illness to escape the match",
        "B": "His internal collapse from arrogant swagger to stunned, humiliated realization",
        "C": "His anger toward Old Soldier's adjudication",
        "D": "His secret desire for Kissiwaa to win the tournament"
      },
      "correct_answer": "B",
      "explanation": "His physical posture and speech reflect internal deflation, signaling the collapse of his false superiority."
    },
    {
      "item_number": 22,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Sensory Diction",
      "question": "The visual contrast between 'plastic-strewn black sand' and 'sparkling azure tides' functions primarily to:",
      "options": {
        "A": "Establish a humorous mood for coastal tourists",
        "B": "Sharpen the ecological conflict between human pollution and natural beauty",
        "C": "Demonstrate the narrator's lack of scientific knowledge",
        "D": "Encourage people to stop swimming in the ocean"
      },
      "correct_answer": "B",
      "explanation": "Contrasting degraded filth with vibrant natural imagery heightens the narrative's central environmental conflict."
    },
    {
      "item_number": 23,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Symbolic Function",
      "question": "Why does the sprawling tree in the schoolyard function as a sanctuary for Samuel?",
      "options": {
        "A": "It shields him from the physical sun and isolates him from hostile social scrutiny",
        "B": "It is where students are sent for detention",
        "C": "It is the only place on campus where food vendors operate",
        "D": "It marks the boundary of the school's sports field"
      },
      "correct_answer": "A",
      "explanation": "The tree provides physical shade from the harsh sun and emotional shelter from peer judgment."
    },
    {
      "item_number": 24,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "What role does Akua play in Maame Tutuwa's psychological transformation?",
      "options": {
        "A": "She solves the chalkboard mathematics problems for her",
        "B": "She acts as an empathetic catalyst who introduces the eagle imagery that reframes Tutuwa's self-perception",
        "C": "She lends her money to purchase expensive textbooks",
        "D": "She reports the laughing classmates to the headteacher"
      },
      "correct_answer": "B",
      "explanation": "Akua is a mentor-peer who presents the book about eagles, providing the symbolic framework Tutuwa needs to overcome self-doubt."
    },
    {
      "item_number": 25,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Diction & Register",
      "question": "What is the rhetorical effect of Old Soldier's military-style commands during the draughts match?",
      "options": {
        "A": "It shows he intends to arrest the spectators",
        "B": "It establishes unwavering authority, discipline, and order in an emotionally volatile environment",
        "C": "It makes the children laugh and disregard his presence",
        "D": "It demonstrates his inability to understand the rules of draughts"
      },
      "correct_answer": "B",
      "explanation": "Old Soldier's disciplined military demeanor commands instant respect and stops petty bickering around the board."
    },
    {
      "item_number": 26,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective",
      "question": "How would the impact of 'A Medal from Grandpa' change if rewritten in Third-Person Objective point of view?",
      "options": {
        "A": "It would enhance the emotional intimacy of the protagonist's family conversations",
        "B": "It would strip away the protagonist's internal emotional wrestling and passionate personal mission",
        "C": "It would make Grandpa the narrator of the cleanup campaign",
        "D": "It would convert the prose into a dramatic dialogue"
      },
      "correct_answer": "B",
      "explanation": "An objective third-person lens records only outward actions, eliminating the interior emotional convictions that define first-person narration."
    },
    {
      "item_number": 27,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "What literary effect is achieved by the metaphor 'woven together by threads of joy and sorrow'?",
      "options": {
        "A": "It emphasizes that genuine communal bonding requires shared hardship as well as shared triumph",
        "B": "It describes the students' practical needlework lessons in school",
        "C": "It suggests the class members will soon separate permanently",
        "D": "It shows that sorrow is more powerful than joy"
      },
      "correct_answer": "A",
      "explanation": "The woven metaphor illustrates that deep social bonds are strengthened through navigating both painful and happy experiences together."
    },
    {
      "item_number": 28,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the author connect the concept of flight to Maame Tutuwa's mathematical triumph?",
      "options": {
        "A": "Flight represents literal escape from the school compound",
        "B": "Flight symbolizes intellectual liberation and rising above the paralysis of self-doubt",
        "C": "Flight suggests that she plans to become an aviation engineer",
        "D": "Flight indicates that mathematics is an imaginary discipline"
      },
      "correct_answer": "B",
      "explanation": "Soaring flight is the extended metaphor for intellectual freedom and overcoming emotional intimidation."
    },
    {
      "item_number": 29,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What makes Kissiwaa's victory a victory for the entire community of Asempayetia rather than just an individual win?",
      "options": {
        "A": "She won a large cash prize shared among all villagers",
        "B": "It proved that women possess strategic intellectual intellect, breaking limiting cultural barriers for future girls",
        "C": "Bediako was permanently banished from the village square",
        "D": "Old Soldier stepped down to make Kissiwaa the new chief umpire"
      },
      "correct_answer": "B",
      "explanation": "Her victory shatters gender bias, expanding social possibilities and intellectual respect for every girl in the society."
    },
    {
      "item_number": 30,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Character Relationships",
      "question": "How does the relationship between the protagonist and Grandpa illustrate the concept of intergenerational mentorship?",
      "options": {
        "A": "Grandpa does the physical work while the protagonist supervises",
        "B": "Grandpa transmits historical resilience and moral values that guide the youth's contemporary civic actions",
        "C": "The protagonist teaches Grandpa modern environmental science techniques",
        "D": "Grandpa finances the school clubs with his government pension"
      },
      "correct_answer": "B",
      "explanation": "The relationship models how ancestral endurance and ethical wisdom are passed down to empower modern youth initiative."
    },
    {
      "item_number": 31,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Psychological Motivation",
      "question": "Why does Samuel initially express his emotional pain through silence rather than outward anger?",
      "options": {
        "A": "He is planning revenge against Jerry outside the school gates",
        "B": "Poverty and social exclusion have conditioned him to internalize shame and feel powerless",
        "C": "He is physically unable to speak in the classroom",
        "D": "He fears being expelled by Mrs. Adjei"
      },
      "correct_answer": "B",
      "explanation": "Marginalized children often retreat into silence because systemic poverty fosters internal shame and helplessness."
    },
    {
      "item_number": 32,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Literary Foreshadowing",
      "question": "How does Maame Tutuwa's fascination with the eagle book foreshadow her chalkboard breakthrough?",
      "options": {
        "A": "The book contains the exact mathematical answers for her test",
        "B": "Her internal resonance with the eagle's patience prepares her mind to confront difficult tasks with steady focus",
        "C": "The teacher had assigned the eagle book as a graded class project",
        "D": "It causes her to abandon reading in favor of drawing birds"
      },
      "correct_answer": "B",
      "explanation": "Absorbing the eagle's qualities of patience and focus provides the psychological resilience she uses to tackle the math problem."
    },
    {
      "item_number": 33,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Dramatic Pacing",
      "question": "How does the author generate dramatic tension during the draughts endgame?",
      "options": {
        "A": "By having a torrential thunderstorm interrupt play",
        "B": "By slowing the narrative pace to capture the heavy silence, ticking spectators, and minute hand movements",
        "C": "By having Bediako overturn the board in a rage",
        "D": "By introducing sudden physical violence into the crowd"
      },
      "correct_answer": "B",
      "explanation": "Tension is heightened by focusing on intense silence, concentrated stares, and deliberate piece movements under the tree."
    },
    {
      "item_number": 34,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Sociological Insight",
      "question": "What does the transformation of the classroom demonstrate about the nature of schoolyard peer culture?",
      "options": {
        "A": "Cruelty is permanent and cannot be modified by moral education",
        "B": "Peer cruelty often stems from thoughtlessness, and can be redirected toward empathy when moral leadership is shown",
        "C": "Students only behave well when threatened with physical suspension",
        "D": "Academic rivalry prevents students from ever forming real friendships"
      },
      "correct_answer": "B",
      "explanation": "The text shows that peer mocking dissolves when empathetic models (Abigail) and structured guidance (Mrs. Adjei) illuminate shared humanity."
    },
    {
      "item_number": 35,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Environmental Ethics",
      "question": "What broader civic message does the formation of student environmental clubs communicate?",
      "options": {
        "A": "Youth lack the capacity to influence ecological systems",
        "B": "Sustainable ecological change requires institutionalizing grassroots initiatives into permanent collective action",
        "C": "Beaches should be privatized and sold to commercial developers",
        "D": "Cleaning public spaces is exclusively the duty of political leaders"
      },
      "correct_answer": "B",
      "explanation": "Forming clubs moves the movement beyond a one-off cleanup into enduring community stewardship."
    },
    {
      "item_number": 36,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figures of Speech",
      "question": "In 'Maame Tutuwa's hand shot up by itself', how does the personification emphasize her psychological shift?",
      "options": {
        "A": "It shows that she was experiencing an involuntary muscle spasm",
        "B": "It emphasizes that her subconscious confidence bypassed her lingering conscious hesitation",
        "C": "It demonstrates that another classmate forced her hand into the air",
        "D": "It proves she had given up caring about the correct answer"
      },
      "correct_answer": "B",
      "explanation": "Personifying the hand conveys that her inner conviction and readiness surged forward before self-doubt could paralyze her."
    },
    {
      "item_number": 37,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Social Structure",
      "question": "What is significant about Old Soldier checking Ababio's disparaging remarks against Kissiwaa?",
      "options": {
        "A": "It indicates that Old Soldier had bet money on Kissiwaa winning",
        "B": "It proves that true elder leadership defends meritocracy and fairness against inherited prejudice",
        "C": "It shows Old Soldier wanted to play the match himself",
        "D": "It demonstrates that Ababio was the chief's biological son"
      },
      "correct_answer": "B",
      "explanation": "Old Soldier uses his established elder status to silence vulgar prejudice, demonstrating righteous social stewardship."
    },
    {
      "item_number": 38,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Communication Patterns",
      "question": "How do Abigail's communication style and Samuel's communication style differ when processing distress?",
      "options": {
        "A": "Abigail expresses pain through visible tears and emotional release, while Samuel relies on quiet, gentle words",
        "B": "Abigail writes formal letters, while Samuel shouts at his teachers",
        "C": "Abigail remains entirely stoic, while Samuel laughs uncontrollably",
        "D": "Abigail uses physical violence, while Samuel runs away from school"
      },
      "correct_answer": "A",
      "explanation": "The commentary explicitly highlights that Abigail communicates pain through tears, while Samuel processes grief through gentle words."
    },
    {
      "item_number": 39,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Cultural Realism",
      "question": "What is the artistic function of describing the steaming jollof rice and lantern glow in the home setting?",
      "options": {
        "A": "To distract from the serious themes of the story",
        "B": "To anchor the story authentically in warm, recognizable Ghanaian domestic life",
        "C": "To criticize the lack of electricity in rural Ghanaian homes",
        "D": "To show that Maame Tutuwa preferred domestic chores to academic study"
      },
      "correct_answer": "B",
      "explanation": "Sensory markers of Ghanaian cuisine and home comfort ground the emotional narrative in recognizable cultural realities."
    },
    {
      "item_number": 40,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Narrative Arc",
      "question": "Why does the presentation of Grandpa's medal occur in the quiet domestic space rather than at a public durbar?",
      "options": {
        "A": "The community refused to allow Grandpa to speak publicly",
        "B": "It reinforces that the truest validation of character is rooted in family honor, love, and generational heritage",
        "C": "The medal was too old and damaged to show in public",
        "D": "The protagonist was ashamed of receiving the award"
      },
      "correct_answer": "B",
      "explanation": "The intimate home setting emphasizes that internal moral legacy and ancestral approval surpass superficial public spectacle."
    }
  ],
  "theory": [
    {
      "item_number": 41,
      "text": "Kissiwaa \u2013 The Heroine (Joshlyn Yayra Diabo)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "Old Soldier slammed his heavy palm onto the wooden bench, his war medals clinking softly against his chest. 'Silence!' he barked, his eyes sweeping across the sneering crowd under the Nyamedua. 'Draughts is a game of the mind, not of trousers. Sit down, Bediako, and let the girl play.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What specific incident prompts Old Soldier to intervene with such firmness?",
          "marks": 2,
          "expected_answer": "The crowd, led by Ababio and Bediako, was openly mocking and sneering at Kissiwaa, claiming that a young female had no right to sit at the Obunumankoma draughts board or play an intellectual game traditionally reserved for men."
        },
        {
          "label": "(b)",
          "question": "Explain the meaning and literary device in the expression: 'Draughts is a game of the mind, not of trousers.'",
          "marks": 3,
          "expected_answer": "The device is Metonymy (or Synecdoche / Idiomatic Metaphor), where 'trousers' represents the male gender. Old Soldier means that intellectual prowess, tactical strategy, and mental sharpness are human qualities not determined by gender."
        },
        {
          "label": "(c)",
          "question": "Analyze the symbolic importance of the Nyamedua tree in this scene.",
          "marks": 2,
          "expected_answer": "The Nyamedua (God's tree) symbolizes sacred truth, divine witness, and communal justice. Taking place beneath it frames Kissiwaa's challenge not as a mere recreational contest, but as a moral reckoning of equality witnessed by the ancestors and community."
        },
        {
          "label": "(d)",
          "question": "Contrast Bediako's demeanor at this moment with his posture at the end of the match.",
          "marks": 3,
          "expected_answer": "At this point, Bediako is boastful, arrogant, dismissive, and full of chauvinistic bravado. By the end of the match, his posture completely deflates: his shoulders droop in shame, his voice cracks, and he is humbled into quiet respect after Kissiwaa outplays him."
        }
      ]
    },
    {
      "item_number": 42,
      "text": "A Medal from Grandpa (Adam Ankrah)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "I stood at the edge of Titanic Beach watching the plastic wrappers wash up like oily scales upon the sand. The air smelled of decay and forgotten promises. Yet, when Mr. Alhasan looked at my rough sketch and nodded, I knew this stretch of shore would breathe again.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify two figures of speech used to depict environmental degradation in this extract.",
          "marks": 2,
          "expected_answer": "1. Simile: 'like oily scales upon the sand'. 2. Personification / Metaphor: 'forgotten promises' or the shore needing to 'breathe again'."
        },
        {
          "label": "(b)",
          "question": "What character trait of the protagonist is highlighted by the mention of the 'rough sketch'?",
          "marks": 2,
          "expected_answer": "Initiative, foresight, and practical planning. Rather than merely complaining about the trash, the protagonist devised a concrete, actionable proposal to present to authority."
        },
        {
          "label": "(c)",
          "question": "Explain how Mr. Alhasan's nod serves as a catalyst in the narrative arc.",
          "marks": 3,
          "expected_answer": "Mr. Alhasan's validation provides institutional support and adult encouragement. His approval transforms a child's solitary concern into a school-wide mobilization and community cleanup campaign."
        },
        {
          "label": "(d)",
          "question": "State the ultimate outcome of this initiative for both the community and the protagonist.",
          "marks": 3,
          "expected_answer": "For the community, Titanic Beach was restored to environmental cleanliness and student environmental clubs were founded. For the protagonist, the effort earned public newspaper recognition, deep family pride, and Grandpa's heirloom medal of honor."
        }
      ]
    },
    {
      "item_number": 43,
      "text": "Fly Like an Eagle",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "The chalkboard stood before her like an insurmountable cliff. Her fingers trembled around the chalk, and the silence of the room felt suffocating. Then she pictured the eagle's patient hunt\u2014the still wings, the unblinking eye\u2014and her hand moved across the slate.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the simile and the personification contained in the first two sentences.",
          "marks": 2,
          "expected_answer": "Simile: 'The chalkboard stood before her like an insurmountable cliff'. Personification: 'the silence of the room felt suffocating'."
        },
        {
          "label": "(b)",
          "question": "What psychological obstacle is Maame Tutuwa wrestling with in this scene?",
          "marks": 2,
          "expected_answer": "Acute mathematical anxiety, stage fright, fear of peer ridicule, and debilitating self-doubt."
        },
        {
          "label": "(c)",
          "question": "Explain how the memory of the eagle enables her to complete the task.",
          "marks": 3,
          "expected_answer": "The eagle imagery provides a cognitive anchor of calmness, patience, and laser-like focus. By channeling the eagle's steady discipline, she quiets her racing thoughts and methodically works through the arithmetic steps."
        },
        {
          "label": "(d)",
          "question": "How does this moment represent the climax of the narrative?",
          "marks": 3,
          "expected_answer": "It is the peak turning point of highest emotional tension where she overcomes her core internal conflict. Solving the problem permanently shatters her self-image as a struggling failure and establishes her self-confidence."
        }
      ]
    },
    {
      "item_number": 44,
      "text": "The Family That Cared (Lucas Zanyoh)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "Jerry lowered his book, his cheeks burning with shame as a snicker rippled through the back row. He had stumbled on three simple words. Beside him, Samuel reached into his small pocket, placed a clean pencil on Jerry's desk, and whispered, 'Take your time. You can do it.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What literary device is demonstrated by Jerry experiencing mockery after previously mocking Samuel?",
          "marks": 2,
          "expected_answer": "Situational Irony (the mocker is caught in the exact vulnerability he previously ridiculed)."
        },
        {
          "label": "(b)",
          "question": "What does Samuel's reaction to Jerry's embarrassment reveal about his character?",
          "marks": 2,
          "expected_answer": "It demonstrates high emotional maturity, magnanimity, forgiveness, and active empathy. Instead of seeking revenge or gloating, he extends immediate, gentle comfort."
        },
        {
          "label": "(c)",
          "question": "How does this specific interaction contribute to the class becoming a 'sanctuary'?",
          "marks": 3,
          "expected_answer": "Samuel's refusal to retaliate breaks the cycle of schoolyard cruelty. His grace disarms Jerry's defense mechanisms, inspiring the rest of the class to replace ridicule with protective kindness."
        },
        {
          "label": "(d)",
          "question": "Identify two core moral lessons highlighted in this episode that align with the official syllabus commentary.",
          "marks": 3,
          "expected_answer": "1. Forgiveness and magnanimity: Overcoming the urge to gloat when an opponent falters. 2. The transformative power of active empathy: Demonstrating compassion breaks down rigid social divisions and fosters genuine community."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB7Intermediate() {
  console.log("Seeding Basic 7 Intermediate Practice Lab for The Beacon of Light Anthology...");
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
      id: `B7_BL_I_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "intermediate",
      category: "Prose Analysis",
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Analyze key literary nuances, character motivations, and thematic conflicts in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Demonstrate intermediate mastery of prescribed The Beacon of Light prose texts (${item.text}), analyzing character foils, symbolic function, narrative point of view, situational irony, and thematic synthesis.`
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

  // 2. Process Section B: 4 Theory Extracts (Items 41, 42, 43, 44)
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

    const promptText = `📖 PRESCRIBED TEXT EXTRACT:\n"${item.extract}"\n— ${item.text}\n\n❓ COMPREHENSIVE ADVANCED APPRECIATION QUESTIONS (Total: ${item.total_marks} Marks):${subQuestionsFormatted}`;

    allItems.push({
      id: `B7_BL_I_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B7",
      difficulty: "intermediate",
      category: "Prose Extract & Advanced Appreciation",
      title: `${item.text} - Advanced Prose Appreciation`,
      shortSummary: `In-depth extract appreciation, literary device decoding, and character analysis for '${item.text}' (10 Marks).`,
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
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Accurately answers sub-question ${sq.label} with direct textual evidence`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Terminology & Analytical Rigor",
            maxMarks: 5,
            scoringGuidelines: ["Precise application of literary terminology (situational irony, metonymy, symbolic function, narrative climax)"],
            diagnosticChecklist: ["Rigorous sentence structure with sophisticated critical vocabulary"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Carefully examine the extract from '${item.text}' to identify literary devices, psychological motivations, and structural turning points.`,
      competencyTarget: `${item.strand} Appreciation: Extract Analysis & Literary Synthesis`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Analyze prose extracts from The Beacon of Light, identifying narrative point of view, figures of speech, plot progression, and moral character evolution.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (40 Objective + 4 Theory Extracts)`);

  const labPayload = {
    level: "B7",
    difficulty: "intermediate",
    title: "Basic 7 Literature Diagnostic Lab: The Beacon of Light Anthology (Intermediate Tier)",
    totalItemsCount: allItems.length,
    objectiveDrillsCount: 40,
    structuredEssaysCount: 4,
    sections: {
      objective: {
        startIndex: 0,
        endIndex: 39,
        count: 40,
        format: "multiple_choice"
      },
      theory: {
        startIndex: 40,
        endIndex: 43,
        count: 4,
        format: "structured_essay",
        allowsDirectTopicFlipping: true,
        topicList: ASSESSMENT_DATA.theory.map((t: any, idx: number) => ({
          questionNumber: t.item_number,
          theoryIndex: idx + 1,
          id: `B7_BL_I_TH_${t.item_number}`,
          title: `${t.text} - Advanced Prose Appreciation`,
          category: "Prose Extract & Advanced Appreciation",
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B7_intermediate`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // Update parent doc practice pool for B7 medium/intermediate
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b7: {
            practicePool: {
              medium: allItems.map(item => ({
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

  console.log(`\n🎉 SUCCESS: Successfully deployed all 44 items for The Beacon of Light B7 Intermediate Lab!`);
}

seedBeaconOfLightB7Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Intermediate Lab:", err);
    process.exit(1);
  });
