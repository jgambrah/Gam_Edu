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
    "title": "Basic 9 Literature Diagnostic Assessment Lab - Intermediate Tier (100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 9 (JHS 3)",
    "tier": "Intermediate",
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
      "sub_strand": "Character Dynamics & Mentorship",
      "question": "How does Ms. Adjei's pedagogical guidance differ from mere technical vocal training in Osmond's development?",
      "options": {
        "A": "She demands financial compensation before offering assistance",
        "B": "She nurtures his emotional resilience and cultural self-worth alongside his technical singing skills",
        "C": "She insists that he abandon all traditional Ghanaian melodies",
        "D": "She limits his musical practice exclusively to European choral hymns"
      },
      "correct_answer": "B",
      "explanation": "Ms. Adjei provides holistic mentorship, combining technical instruction with psychological encouragement and cultural grounding."
    },
    {
      "item_number": 2,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Dramatic Technique & Irony",
      "question": "Why is the public exposure of Kwansah\u2019s theft considered an 'irony of fate' in Act 5, Scene 2?",
      "options": {
        "A": "He was praised by the village elders for securing the equipment",
        "B": "His calculated attempt to humiliate Asantewaa resulted directly in his own public disgrace and familial shame",
        "C": "The stolen solar panels generated electricity inside his mother\u2019s room",
        "D": "Sir Nii awarded him the school science prize by mistake"
      },
      "correct_answer": "B",
      "explanation": "The irony of fate lies in his malicious scheme reversing upon him, producing his own public humiliation instead of Asantewaa's ruin."
    },
    {
      "item_number": 3,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Craft & Sound Devices",
      "question": "What acoustic effect is created by juxtaposing 'twilight's hush' with 'whispered incantations' in the poem?",
      "options": {
        "A": "It simulates the deafening roar of military artillery",
        "B": "It generates an ethereal, sacred atmosphere that emphasizes the mystic's spiritual composure amidst the stillness of dusk",
        "C": "It indicates that the speaker is frightened of the dark",
        "D": "It creates an upbeat, comical rhythm suitable for children's games"
      },
      "correct_answer": "B",
      "explanation": "Contrasting evening silence with soft sacred incantations produces an atmosphere of solemn awe and metaphysical reverence."
    },
    {
      "item_number": 4,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "In 'The Unseen Painter', why does the poet employ an active voice when describing the Creator's brushstrokes?",
      "options": {
        "A": "To prove that the speaker is a professional painter by trade",
        "B": "To emphasize deliberate divine agency, creative authority, and purposeful universal design",
        "C": "To conform to the rigid grammatical rules of Victorian sonnets",
        "D": "To show that the artwork was completed in a single afternoon"
      },
      "correct_answer": "B",
      "explanation": "Active voice syntax foregrounds God's conscious, direct craftsmanship across every element of creation."
    },
    {
      "item_number": 5,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Sociological Commentary",
      "question": "How does the author use Abeka\u2019s domestic background to illustrate urban working-class vulnerability?",
      "options": {
        "A": "His parents are wealthy diplomats who neglect his education",
        "B": "His mother\u2019s grueling work schedule forces her to choose geographical proximity over school safety, leaving him vulnerable to institutional chaos",
        "C": "He is forced to work as a miner along the Daakye River",
        "D": "His family lacks the resources to purchase school uniforms"
      },
      "correct_answer": "B",
      "explanation": "Abeka's situation highlights how economic pressures force low-income parents into painful compromises regarding school safety."
    },
    {
      "item_number": 6,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Structural Design & Pacing",
      "question": "What is the structural function of dividing the poem into seven variable stanzas?",
      "options": {
        "A": "To replicate the seven days of biblical creation",
        "B": "To mirror the dynamic, fragmented progression of neighborhood rumors from initial setting to lasting psychological trauma",
        "C": "To allow seven different narrators to recite the poem in unison",
        "D": "To match the musical beats of traditional highlife drumming"
      },
      "correct_answer": "B",
      "explanation": "The seven-part division tracks the unfolding of urban legend: environment, rumors, collective fear, and reflective aftermath."
    },
    {
      "item_number": 7,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Satire",
      "question": "How does Dickens employ dramatic understatement when describing the workhouse diet?",
      "options": {
        "A": "By claiming the boys were fed lavish three-course banquets daily",
        "B": "By presenting starvation through detached institutional terms, exposing the board's moral blindness",
        "C": "By blaming the boys' hunger on their refusal to eat vegetables",
        "D": "By omitting all descriptions of food from the chapter"
      },
      "correct_answer": "B",
      "explanation": "Dickens satirizes the Poor Law by describing calculated starvation as orderly, benevolent administrative efficiency."
    },
    {
      "item_number": 8,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Craft",
      "question": "Why does Antony deliberately emphasize that Caesar wept when the poor cried?",
      "options": {
        "A": "To show that Caesar was emotionally unstable and unfit to govern",
        "B": "To dismantle Brutus's charge of ruthless ambition by providing tangible proof of Caesar's empathy for common citizens",
        "C": "To encourage the plebeians to join the Roman priesthood",
        "D": "To prove that Roman senators were naturally cold-hearted"
      },
      "correct_answer": "B",
      "explanation": "Antony contrasts genuine compassion with cold political ambition, undermining the moral foundation of Brutus's defense."
    },
    {
      "item_number": 9,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Symbolic Resonance",
      "question": "In 'A Beacon of Light', how does the recording studio function as an arena of transformation?",
      "options": {
        "A": "It isolates Osmond from his Ghanaian identity",
        "B": "It validates rural talent on a professional, national level, turning past hardship into creative empowerment",
        "C": "It forces him to sign predatory financial contracts",
        "D": "It serves as a political meeting hall for youth activists"
      },
      "correct_answer": "B",
      "explanation": "The studio represents professional validation, showing how dedication and mentorship can elevate raw talent."
    },
    {
      "item_number": 10,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Interpersonal Conflict",
      "question": "What does Kwansah's mother\u2019s defensive posture ('arms tightly folded') signify during the confrontation?",
      "options": {
        "A": "She was shivering from the evening cold along the path",
        "B": "Her stubborn denial, moral defensiveness, and enabling of her son's misconduct",
        "C": "Her readiness to physically attack Sir Nii",
        "D": "Her prayerful submission to the village elders"
      },
      "correct_answer": "B",
      "explanation": "Her folded arms visually signal emotional resistance and complicity in shielding her son from accountability."
    },
    {
      "item_number": 11,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the poem connect divine intervention with national political unification?",
      "options": {
        "A": "By asserting that political alliances can only be established through armed conquest",
        "B": "By illustrating that the Golden Stool descended from the heavens to bind separate clans into an enduring, sacred union",
        "C": "By showing that Okomfo Anokye crowned himself emperor of West Africa",
        "D": "By arguing that traditional laws must be replaced by modern decrees"
      },
      "correct_answer": "B",
      "explanation": "The descent of the Stool provides divine authority that unites rival Akan chiefdoms into one nation."
    },
    {
      "item_number": 12,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Sensory Imagery & Design",
      "question": "What is the analytical purpose of contrasting 'The very white canvas' with 'Suddenly turned darker'?",
      "options": {
        "A": "To illustrate a sudden storm destroying an artist\u2019s outdoor studio",
        "B": "To represent the transition from nothingness into balanced, structured cosmic reality",
        "C": "To show that the speaker preferred night over day",
        "D": "To symbolize the arrival of industrial pollution across the landscape"
      },
      "correct_answer": "B",
      "explanation": "The shift from white to dark mirrors the emergence of light and shadow, forming a balanced cosmos."
    },
    {
      "item_number": 13,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Psychological Conflict",
      "question": "Why is Benson described as 'a prisoner of his own making' in Chapter 10?",
      "options": {
        "A": "He was locked in the school guardroom by Mrs. Acquah",
        "B": "His calculated involvement with Ashes Flame trapped him in a cycle of deceit, fear, and compromised integrity",
        "C": "He built the perimeter walls surrounding Cedar of Lebanon",
        "D": "He owed financial debts to the student union"
      },
      "correct_answer": "B",
      "explanation": "The irony lies in his double life: while appearing as a free leader, his loyalty to the cabal left him morally trapped."
    },
    {
      "item_number": 14,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Atmospheric Resonance",
      "question": "How do the 'tall grasses' function as an objective correlative for neighborhood fear?",
      "options": {
        "A": "They provide raw materials for local thatch roof construction",
        "B": "Their wild, unkempt growth physicalizes neglect, secrecy, and the concealment of sinister activities",
        "C": "They show that the residents practiced communal agriculture",
        "D": "They serve as a decorative garden around the mansion"
      },
      "correct_answer": "B",
      "explanation": "The overgrown grasses visually reflect moral neglect, secrecy, and the looming presence of hidden danger."
    },
    {
      "item_number": 15,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "How does Mr. Limbkins' physical appearance contrast with Oliver's?",
      "options": {
        "A": "Limbkins is young and athletic, while Oliver is elderly",
        "B": "Limbkins' round, red face and well-fed frame contrast sharply with Oliver's pale, emaciated vulnerability",
        "C": "Limbkins wears rags while Oliver wears fine parish garments",
        "D": "Both characters are depicted as frail and malnourished"
      },
      "correct_answer": "B",
      "explanation": "Dickens uses physical contrast to expose the disparity between well-fed administrators and starving children."
    },
    {
      "item_number": 16,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Dramatic Irony",
      "question": "In what way is Antony's modest disclaimer\u2014'I am no orator, as Brutus is'\u2014a masterful piece of verbal manipulation?",
      "options": {
        "A": "He genuinely forgot the speech he had written the previous night",
        "B": "He feigns plainness to lower the crowd's defenses while skillfully playing upon their raw emotions",
        "C": "He intended to invite Cassius to take over the pulpit",
        "D": "He was conceding defeat to the conspirators"
      },
      "correct_answer": "B",
      "explanation": "Antony's pretended humility is a deliberate rhetorical tactic that makes his emotional appeal even more persuasive."
    },
    {
      "item_number": 17,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does Osmond's refusal to forget Obane reinforce the novella's moral message?",
      "options": {
        "A": "He uses his platform to mock the rural lifestyle of his ancestors",
        "B": "He demonstrates that genuine success involves honoring one's origins and lifting up others",
        "C": "He buys out the village farmland to build private factories",
        "D": "He intends to run for political office in his hometown"
      },
      "correct_answer": "B",
      "explanation": "His grounded loyalty shows that true maturity requires staying connected to one's roots and community."
    },
    {
      "item_number": 18,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Setting Symbolism",
      "question": "Why is the Classroom Square the central setting for innovation in the play?",
      "options": {
        "A": "It was the only space with tiled floors in the district",
        "B": "It represents modern education, critical inquiry, and collaboration under Sir Nii's guidance",
        "C": "It served as a temporary marketplace on weekends",
        "D": "The village elders held criminal trials inside the classroom"
      },
      "correct_answer": "B",
      "explanation": "The classroom square symbolizes enlightenment, collaborative learning, and progressive inquiry."
    },
    {
      "item_number": 19,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "What is the meaning of the idiom 'weave his way' in describing Okomfo Anokye?",
      "options": {
        "A": "He was a skilled artisan who wove royal kente fabric",
        "B": "He possessed the mystical authority to navigate complex metaphysical forces and bridge spiritual realms",
        "C": "He struggled to walk through the crowded streets of Kumasi",
        "D": "He designed diplomatic trade networks across the Sahara"
      },
      "correct_answer": "B",
      "explanation": "The idiom conveys his supernatural ability to move between the spiritual and physical worlds."
    },
    {
      "item_number": 20,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Sociological Criticism",
      "question": "How does 'The Unseen Painter' challenge human racial boundaries?",
      "options": {
        "A": "By suggesting that all skin colors should merge into a single tone",
        "B": "By portraying distinct racial complexions as deliberate, equal colors chosen by the same master artist",
        "C": "By arguing that ancient civilizations were superior in artistry",
        "D": "By separating different ethnic groups across distinct galleries"
      },
      "correct_answer": "B",
      "explanation": "The poem frames human diversity as intentional variety that enriches the shared canvas of mankind."
    },
    {
      "item_number": 21,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "How does Tina Bells act as a moral catalyst within Cedar of Lebanon School?",
      "options": {
        "A": "She uses wealth to bribe members of Ashes Flame into submission",
        "B": "Her integrity, courage, and refusal to be intimidated prompt others to confront systemic corruption",
        "C": "She takes over the administrative duties of her mother",
        "D": "She organizes a student strike against final examinations"
      },
      "correct_answer": "B",
      "explanation": "Tina's principled stance inspires classmates and elders alike to challenge the culture of fear."
    },
    {
      "item_number": 22,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Thematic Interconnections",
      "question": "What does the phrase 'Strange known land' reveal about the impact of urban rumors?",
      "options": {
        "A": "The city landscape had been completely transformed by earthquakes",
        "B": "Fear and paranoia can turn a familiar childhood home into an unsettling, alien environment",
        "C": "The residents had forgotten their native languages",
        "D": "Industrial zoning laws prohibited residential settlement"
      },
      "correct_answer": "B",
      "explanation": "The oxymoron captures how pervasive rumors can make familiar surroundings feel sinister and strange."
    },
    {
      "item_number": 23,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Sociological Reality",
      "question": "What broader historical injustice of 19th-century Britain is critiqued in this excerpt?",
      "options": {
        "A": "The lack of voting rights for aristocratic landowners",
        "B": "The harsh Poor Law system that treated poverty as a crime and penalized vulnerable children",
        "C": "The expansion of passenger railway lines into rural districts",
        "D": "The regulation of international maritime shipping tariffs"
      },
      "correct_answer": "B",
      "explanation": "Dickens attacks the Victorian Poor Laws, which punished orphans and treated poverty as moral failing."
    },
    {
      "item_number": 24,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Mechanics",
      "question": "How does Antony's use of pauses (caesura) during his funeral speech affect the plebeians?",
      "options": {
        "A": "It gives them time to organize an orderly voting ballot",
        "B": "It displays overwhelming personal grief, allowing his words to settle and ignite communal outrage",
        "C": "It allows Brutus to return to the pulpit to offer clarification",
        "D": "It signals the Roman guards to disperse the assembly"
      },
      "correct_answer": "B",
      "explanation": "His pauses convey grief and give the crowd space to absorb his words and grow angry."
    },
    {
      "item_number": 25,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Growth",
      "question": "What internal conflict does Osmond face before walking onto the stage in Accra?",
      "options": {
        "A": "He fears that his rural background will expose him to public ridicule",
        "B": "He considers abandoning his music career to study law",
        "C": "He worries that Brother Kofi will steal his stage costume",
        "D": "He is reluctant to perform in front of Ms. Adjei"
      },
      "correct_answer": "A",
      "explanation": "His primary struggle centers on overcoming the fear that his humble village roots make him inferior."
    },
    {
      "item_number": 26,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Pedagogical Sub-Text",
      "question": "How does Sir Nii\u2019s teaching method differ from rote classroom instruction?",
      "options": {
        "A": "He assigns excessive manual labor on his personal farm",
        "B": "He fosters hands-on problem-solving, encouraging pupils to apply science directly to community needs",
        "C": "He relies exclusively on European textbooks without practical experiments",
        "D": "He forbids girls from speaking during science practicals"
      },
      "correct_answer": "B",
      "explanation": "Sir Nii encourages experiential learning, guiding students to use science to solve real-world problems."
    },
    {
      "item_number": 27,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "Why is the Golden Stool described as a 'treasure of infinite worth'?",
      "options": {
        "A": "It was cast from millions of imported gold coins",
        "B": "Its cultural, spiritual, and unifying value transcends any material or financial calculation",
        "C": "It contained the private savings of past paramount kings",
        "D": "It could be bartered for modern armaments during wartime"
      },
      "correct_answer": "B",
      "explanation": "Calling its value 'infinite' emphasizes that its worth is sacred and communal rather than monetary."
    },
    {
      "item_number": 28,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What message regarding human perception is delivered in 'The Unseen Painter'?",
      "options": {
        "A": "Humans understand the cosmos with complete scientific perfection",
        "B": "Human beings often restrict their understanding of the divine through narrow prejudices and cultural biases",
        "C": "Artistic paintings are more accurate than astronomy",
        "D": "Natural wonders are visible only during daytime hours"
      },
      "correct_answer": "B",
      "explanation": "The poem observes that humans frequently project their own limited viewpoints onto universal creation."
    },
    {
      "item_number": 29,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Plot Architecture",
      "question": "What structural role does Tina\u2019s discovery of the cabal play in the narrative arc?",
      "options": {
        "A": "It serves as the exposition introducing the school compound",
        "B": "It acts as the rising action that accelerates conflict toward the climactic confrontation",
        "C": "It marks the peaceful resolution of the novel",
        "D": "It causes Mrs. Acquah to resign her post"
      },
      "correct_answer": "B",
      "explanation": "Her discovery escalates the narrative tension, leading to the direct exposure and dismantling of the gang."
    },
    {
      "item_number": 30,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Sociological Insight",
      "question": "How does 'Real Illusioned Beckley' explore the concept of mass hysteria?",
      "options": {
        "A": "By describing how unsubstantiated rumors can take hold of a community and distort reality",
        "B": "By illustrating a political election rally that turns into a street riot",
        "C": "By showing factory workers striking for higher daily wages",
        "D": "By describing medical quarantine during an infectious epidemic"
      },
      "correct_answer": "A",
      "explanation": "The narrative poem shows how unverified stories can spread through a neighborhood and fuel mass anxiety."
    },
    {
      "item_number": 31,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does Dickens use Mrs. Mann's hypocritical gentility to critique Victorian middle-class morality?",
      "options": {
        "A": "By showing her donating personal wealth to orphanages",
        "B": "By revealing that outward polite speech often concealed callous exploitation of the weak",
        "C": "By illustrating her willingness to adopt Oliver as her own child",
        "D": "By proving that parish matrons were underpaid by town councils"
      },
      "correct_answer": "B",
      "explanation": "Dickens exposes how performative piety and polite language often masked institutional cruelty."
    },
    {
      "item_number": 32,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Political Psychology",
      "question": "What strategic purpose is served by Antony reading Caesar's will last?",
      "options": {
        "A": "He needed daylight to read the Latin script accurately",
        "B": "It seals his emotional argument with concrete material evidence, ensuring the mob takes decisive action",
        "C": "He waited for Brutus to return to sign the parchment",
        "D": "The Roman senate ordered him to keep the will confidential"
      },
      "correct_answer": "B",
      "explanation": "Revealing the inheritance at the very end provides material confirmation that turns grief into action."
    },
    {
      "item_number": 33,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Narrative Craft",
      "question": "How does the author use flashbacks to enrich Osmond's narrative journey?",
      "options": {
        "A": "To reveal that he had lived in foreign countries before Obane",
        "B": "To juxtapose his humble rural beginnings with his rising success, deepening the emotional payoff",
        "C": "To show that his parents had forbidden him from singing",
        "D": "To explain the technical acoustics of recording microphones"
      },
      "correct_answer": "B",
      "explanation": "Contrasting his past hardships with his present triumph gives emotional weight to his breakthrough."
    },
    {
      "item_number": 34,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Motivation",
      "question": "Why does Asantewaa refuse to abandon the solar project despite her mother's initial disapproval?",
      "options": {
        "A": "She wished to humiliate her family publicly",
        "B": "She was driven by conviction that education and innovation could transform their village",
        "C": "Sir Nii promised her a monetary salary from the district assembly",
        "D": "She planned to leave the village permanently after completion"
      },
      "correct_answer": "B",
      "explanation": "Her resilience is fueled by a desire to see her community emerge from darkness and neglect."
    },
    {
      "item_number": 35,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Cultural Institutions",
      "question": "In Akan cosmological belief, why could the Golden Stool never touch the bare ground?",
      "options": {
        "A": "The soil of Kumasi was too damp for gold preservation",
        "B": "It is a sacred vessel housing the collective soul (Sunsum) of the nation and must remain elevated and pure",
        "C": "It was too heavy for palace servants to lift from the earth",
        "D": "Traditional taboos required all furniture to be kept indoors"
      },
      "correct_answer": "B",
      "explanation": "As the sacred repository of the people's soul, the Stool must never be defiled by touching the ground."
    },
    {
      "item_number": 36,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Structural Design",
      "question": "How does the absence of a rigid rhyme scheme support the philosophical theme of the poem?",
      "options": {
        "A": "It indicates that the author composed the lines without planning",
        "B": "It allows the ideas to unfold with fluid freedom, reflecting the boundless creativity of the universe",
        "C": "It forces readers to memorize the text more quickly",
        "D": "It proves that free verse is the only modern poetry format"
      },
      "correct_answer": "B",
      "explanation": "Free verse provides an open structure that mirrors the organic diversity of creation."
    },
    {
      "item_number": 37,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "How does Mrs. Janet Acquah function as a character foil to Nkrabea?",
      "options": {
        "A": "Mrs. Acquah is an experienced teacher, while Nkrabea is an uneducated farmer",
        "B": "Mrs. Acquah embodies selfless leadership and transparency, while Nkrabea represents covert manipulation and intimidation",
        "C": "Mrs. Acquah leads Ashes Flame, while Nkrabea protects the students",
        "D": "Both characters use physical violence to maintain discipline"
      },
      "correct_answer": "B",
      "explanation": "She represents moral leadership and light, standing in direct contrast to Nkrabea's hidden corruption."
    },
    {
      "item_number": 38,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Symbolic Resonance",
      "question": "What is the symbolic function of the 'high-tension zone' in the poem's geography?",
      "options": {
        "A": "It highlights the successful completion of an electrical power plant",
        "B": "It physicalizes atmospheric tension, danger, and the boundary between safe play and lurking threat",
        "C": "It marks the location of a busy railway terminal",
        "D": "It shows that the residents were protesting high utility bills"
      },
      "correct_answer": "B",
      "explanation": "The high-voltage lines serve as an objective correlative for the psychological danger surrounding the estate."
    },
    {
      "item_number": 39,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Figurative Analysis",
      "question": "What is the satirical purpose of describing Oliver's request as an 'impious' act?",
      "options": {
        "A": "Oliver had intentionally broken sacred church vessels",
        "B": "It mocks the authorities, who equate a hungry child's cry with a sin against God",
        "C": "The parish laws required orphans to take religious vows",
        "D": "Dickens intended to criticize religious fasting practices"
      },
      "correct_answer": "B",
      "explanation": "Dickens uses satire to show how the board dressed up their cruelty in religious terminology."
    },
    {
      "item_number": 40,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Devices",
      "question": "How does Antony employ paralipsis when discussing Caesar\u2019s will?",
      "options": {
        "A": "He reads the document aloud without offering any commentary",
        "B": "He repeatedly claims he must not read the will, which inflames the crowd's curiosity and desire to hear it",
        "C": "He pretends that the will was destroyed by Cassius",
        "D": "He translates the will into foreign languages for the merchants"
      },
      "correct_answer": "B",
      "explanation": "Paralipsis involves drawing intense attention to a subject while pretending to pass over it."
    },
    {
      "item_number": 41,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Cultural Pride",
      "question": "Why is Osmond\u2019s choice to sing in his native tongue during parts of his performance significant?",
      "options": {
        "A": "He was unable to pronounce English lyrics accurately",
        "B": "It asserts that indigenous languages possess rich artistic dignity and belong in professional contemporary music",
        "C": "The studio managers required him to translate foreign songs",
        "D": "He wished to conceal his message from the judges"
      },
      "correct_answer": "B",
      "explanation": "Using his mother tongue affirms cultural pride, demonstrating that African languages hold artistic value."
    },
    {
      "item_number": 42,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the play illustrate that poverty is not a barrier to intellectual ingenuity?",
      "options": {
        "A": "By showing that rural pupils can purchase expensive equipment from abroad",
        "B": "By illustrating how pupils use locally available resources and science to solve infrastructure problems",
        "C": "By having foreign donors build modern laboratories in the village",
        "D": "By proving that traditional farming generates more wealth than schoolwork"
      },
      "correct_answer": "B",
      "explanation": "The story shows that determination and scientific knowledge allow rural youths to innovate despite scarcity."
    },
    {
      "item_number": 43,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Historical Synthesis",
      "question": "Why did Okomfo Anokye insist that the Stool belong to no single clan?",
      "options": {
        "A": "He planned to sell the golden regalia to European merchants",
        "B": "To ensure that all Akan chiefdoms felt equal ownership, preventing internal civil strife",
        "C": "The stool was manufactured by foreign craftsmen",
        "D": "Traditional customs forbade individual families from owning gold"
      },
      "correct_answer": "B",
      "explanation": "Making the Stool communal prevented clan jealousy, providing a shared symbol of national unity."
    },
    {
      "item_number": 44,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Resonance",
      "question": "What does the line 'All hues belong within' assert about human society?",
      "options": {
        "A": "Art galleries should display only colorful landscape paintings",
        "B": "Every racial and ethnic group has equal dignity, purpose, and worth in the human family",
        "C": "Clothing fashion should incorporate all natural dyes",
        "D": "School curricula should prioritize visual art over science"
      },
      "correct_answer": "B",
      "explanation": "The line affirms human equality, stating that all people share inherent dignity."
    },
    {
      "item_number": 45,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Narrative Mechanics",
      "question": "How does the author use sensory imagery to depict the climate of fear at Cedar of Lebanon?",
      "options": {
        "A": "By describing children singing hymns in the assembly hall",
        "B": "By describing fear whispering through corridors and footsteps echoing down empty hallways",
        "C": "By describing busy sports competitions on the athletic field",
        "D": "By detailing delicious meals served in the dining hall"
      },
      "correct_answer": "B",
      "explanation": "Describing whispered rumors and tense corridors creates a palpable atmosphere of dread."
    },
    {
      "item_number": 46,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "Why is Dr. Beckley described through auditory absence ('The quiet house')?",
      "options": {
        "A": "The mansion was completely abandoned for decades",
        "B": "Unsettling silence heightens mystery and tension more effectively than loud confrontation",
        "C": "The owner was deaf and mute",
        "D": "The residents were away on vacation"
      },
      "correct_answer": "B",
      "explanation": "Silence creates suspense, leaving the imagination to fill the quiet with rumors and fear."
    },
    {
      "item_number": 47,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Character Evolution",
      "question": "What shifts in Oliver\u2019s character during the dining hall episode?",
      "options": {
        "A": "He becomes a cruel bully toward younger apprentices",
        "B": "He moves from passive misery to desperate, courageous action",
        "C": "He decides to train as a workhouse beadle",
        "D": "He loses all desire to seek a better life"
      },
      "correct_answer": "B",
      "explanation": "Desperation pushes Oliver past fear to step forward and speak, marking a decisive shift."
    },
    {
      "item_number": 48,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Thematic Interconnections",
      "question": "How does Antony expose the gap between abstract political theories and human reality?",
      "options": {
        "A": "By reciting complex legal statutes from the Roman Senate",
        "B": "By showing Caesar\u2019s wounds and gifts to commoners, countering Brutus's philosophical justifications",
        "C": "By challenging Brutus to a duel in the forum",
        "D": "By offering to resign from political life"
      },
      "correct_answer": "B",
      "explanation": "Antony counters Brutus's claims with physical evidence of Caesar's generosity and suffering."
    },
    {
      "item_number": 49,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Foils",
      "question": "How does Brother Kofi\u2019s steadfast character contrast with fair-weather companions Osmond meets in the city?",
      "options": {
        "A": "Kofi demands half of Osmond's royalties",
        "B": "Kofi offers loyalty and shelter when Osmond has nothing to offer in return",
        "C": "Kofi discourages Osmond from attending rehearsals",
        "D": "Kofi leaves Accra when times become difficult"
      },
      "correct_answer": "B",
      "explanation": "Brother Kofi embodies sincere friendship, supporting Osmond before fame arrives."
    },
    {
      "item_number": 50,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Gender Dynamics",
      "question": "How does the partnership between Asantewaa and Iddrisu model gender equity?",
      "options": {
        "A": "Iddrisu makes all final decisions while Asantewaa cleans the tools",
        "B": "They collaborate as equals, valuing each other's technical skills and ideas",
        "C": "Asantewaa forces Iddrisu to do all the physical installation alone",
        "D": "They compete against each other to win individual prizes"
      },
      "correct_answer": "B",
      "explanation": "Their working relationship demonstrates mutual respect and shared responsibility."
    },
    {
      "item_number": 51,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "Why is Okomfo Anokye's voice described as 'whispered' rather than shouted?",
      "options": {
        "A": "He had lost his voice during military battles",
        "B": "True spiritual authority is serene and focused, needing no theatrical volume",
        "C": "He was hiding his incantations from rival chiefs",
        "D": "Traditional Akan prayers must always be recited silently"
      },
      "correct_answer": "B",
      "explanation": "Whispering suggests quiet confidence and spiritual connection, contrasting with bluster."
    },
    {
      "item_number": 52,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Imagery Synthesis",
      "question": "How do the images of the sun, moon, and stars function in 'The Unseen Painter'?",
      "options": {
        "A": "They indicate that the speaker is studying modern astronomy",
        "B": "They illustrate divine mastery over cosmic space and beauty",
        "C": "They show that the earth is in danger of cosmic collisions",
        "D": "They serve as background decorations with no symbolic meaning"
      },
      "correct_answer": "B",
      "explanation": "Celestial imagery emphasizes order, beauty, and scale across creation."
    },
    {
      "item_number": 53,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Sociological Reality",
      "question": "What does Cedar of Lebanon School's initial state reveal about institutions run through intimidation?",
      "options": {
        "A": "Fear promotes academic excellence and student discipline",
        "B": "Intimidation silences victims, breeds corruption, and erodes trust",
        "C": "Students thrive when left entirely without adult supervision",
        "D": "Schools require secret student societies to maintain order"
      },
      "correct_answer": "B",
      "explanation": "The story shows that fear-based management destroys morale and invites corruption."
    },
    {
      "item_number": 54,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "Why is Dr. Beckley described 'like a monster' in the minds of local children?",
      "options": {
        "A": "He suffered from a disfiguring physical ailment",
        "B": "Sensational rumors turned an elusive figure into an imaginary menace",
        "C": "He wore theatrical costumes through neighborhood streets",
        "D": "He openly threatened school pupils on their way to class"
      },
      "correct_answer": "B",
      "explanation": "Childhood imagination and unchecked gossip magnify elusive figures into monsters."
    },
    {
      "item_number": 55,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Irony of Nomenclature",
      "question": "Why is Mr. Bumble's name considered an example of apt patronymic satire?",
      "options": {
        "A": "It honors his achievements as an educator",
        "B": "It mimics his clumsy, pompous, and blundering bureaucratic incompetence",
        "C": "It proves that he was related to the British royal house",
        "D": "It highlights his physical agility during workhouse inspections"
      },
      "correct_answer": "B",
      "explanation": "Dickens uses the name Bumble to poke fun at his clumsy, pompous nature."
    },
    {
      "item_number": 56,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Dramatic Technique",
      "question": "What is the theatrical function of Antony stepping down from the pulpit into the circle of commoners?",
      "options": {
        "A": "He was physically fatigued and needed to sit upon the forum steps",
        "B": "It closes the status gap, creating an intimate connection and uniting the crowd with him in grief",
        "C": "He intended to escape before Brutus's guards arrived",
        "D": "Roman law required speakers to kneel during funerals"
      },
      "correct_answer": "B",
      "explanation": "Stepping down levels the playing field, making the plebeians feel that Antony is one of them."
    },
    {
      "item_number": 57,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What does the title 'A Beacon of Light' suggest about an individual's role in society?",
      "options": {
        "A": "One should amass private wealth before offering assistance to others",
        "B": "Overcoming hardship allows a person to guide, inspire, and support others facing struggle",
        "C": "Artists should avoid getting involved in community problems",
        "D": "Success is meaningful only if recognized by foreign critics"
      },
      "correct_answer": "B",
      "explanation": "The metaphor indicates that personal triumph should become a guiding light for others."
    },
    {
      "item_number": 58,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Plot Progression",
      "question": "How is the communal recovery of the solar panels resolved on stage?",
      "options": {
        "A": "Through a physical brawl between Sir Nii and Kwansah\u2019s father",
        "B": "Through peaceful exposure where truth is presented before the villagers",
        "C": "The police arrest the entire student body of the school",
        "D": "Kwansah flees the district to live in a neighboring town"
      },
      "correct_answer": "B",
      "explanation": "The resolution relies on moral clarity: confronting deceit in daylight before the community."
    },
    {
      "item_number": 59,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Thematic Interconnections",
      "question": "Why does the poem describe the bond forged by the Stool as something 'no earthly sword can crush'?",
      "options": {
        "A": "The stool was manufactured from tempered iron armor",
        "B": "The spiritual and cultural unity of a people runs deeper than physical force or military defeat",
        "C": "Traditional Akan armies were forbidden from carrying swords",
        "D": "The regalia was hidden beneath a deep subterranean vault"
      },
      "correct_answer": "B",
      "explanation": "Spiritual unity grounded in shared identity outlasts military conquest and physical weapons."
    },
    {
      "item_number": 60,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "What is the relationship between the natural world and human beings in 'The Unseen Painter'?",
      "options": {
        "A": "Humans are separate from nature and must conquer it",
        "B": "Both nature and humanity are interconnected elements painted upon the same divine canvas",
        "C": "Nature exists solely to provide commercial materials for human factories",
        "D": "Humans are an accidental flaw on an otherwise perfect canvas"
      },
      "correct_answer": "B",
      "explanation": "The poem views humanity and nature as harmonious parts of one unified creation."
    },
    {
      "item_number": 61,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Growth",
      "question": "What is the significance of Benson turning over the cabal's secret ledger to Mrs. Acquah?",
      "options": {
        "A": "He was attempting to negotiate a cash reward from the board",
        "B": "It marks his complete break from deceit and his commitment to truth and redemption",
        "C": "He wished to frame Abeka for his own past crimes",
        "D": "Nkrabea ordered him to dispose of old records"
      },
      "correct_answer": "B",
      "explanation": "Handing over the ledger represents tangible repentance, completing his turn away from the gang."
    },
    {
      "item_number": 62,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Narrative Perspective",
      "question": "From what perspective does the speaker in 'Real Illusioned Beckley' reflect upon childhood events?",
      "options": {
        "A": "From the viewpoint of an outside police inspector",
        "B": "From an adult looking back at the rumors and atmosphere of fear that marked his youth",
        "C": "From the perspective of Dr. Beckley writing a private journal",
        "D": "From a child hiding inside the mansion\u2019s cellar"
      },
      "correct_answer": "B",
      "explanation": "The mature reflective perspective looks back at childhood rumors with adult understanding."
    },
    {
      "item_number": 63,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Sensory Details",
      "question": "How does Dickens evoke the chill of the workhouse dining hall?",
      "options": {
        "A": "By describing massive stone fireplaces roaring with oak logs",
        "B": "By highlighting the bare stone walls, thin copper kettles, and shivering, ill-clad children",
        "C": "By describing windows open to a pleasant summer afternoon breeze",
        "D": "By focusing on the rich wool carpets lining the corridors"
      },
      "correct_answer": "B",
      "explanation": "Cold stone, thin kettles, and shivering bodies underline the physical cheerlessness of the hall."
    },
    {
      "item_number": 64,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Craft",
      "question": "What is the function of Antony calling Caesar\u2019s stab wounds 'poor dumb mouths'?",
      "options": {
        "A": "To suggest that Caesar died without speaking a final word",
        "B": "To personify the wounds, making them speak of betrayal and treason to the crowd",
        "C": "To criticize Caesar for not defending himself against the senators",
        "D": "To show that the conspirators had used poisoned daggers"
      },
      "correct_answer": "B",
      "explanation": "Personifying the wounds allows the physical violence of the murder to tell its own story."
    },
    {
      "item_number": 65,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does Osmond's story critique urban elitism in Ghana?",
      "options": {
        "A": "By demonstrating that rural youths possess equal creative brilliance and character",
        "B": "By arguing that only people born in rural villages understand highlife music",
        "C": "By showing that urban recording companies should be boycotted",
        "D": "By proving that formal music education is entirely unnecessary"
      },
      "correct_answer": "A",
      "explanation": "His success challenges the assumption that talent and refinement belong exclusively to cities."
    },
    {
      "item_number": 66,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Symbolism",
      "question": "What do the stolen solar panels represent while hidden in Kwansah's mother's compound?",
      "options": {
        "A": "The community's financial savings",
        "B": "Progress suppressed by jealousy, dishonesty, and misplaced family protection",
        "C": "A dangerous device that threatened rural traditions",
        "D": "An offering prepared for the village chief"
      },
      "correct_answer": "B",
      "explanation": "The hidden panels symbolize progressive ideas smothered by envy and dishonesty."
    },
    {
      "item_number": 67,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Craft & Style",
      "question": "Why does the poet describe the Stool's descent as quiet rather than violent?",
      "options": {
        "A": "The clouds were too thick for thunder to be heard",
        "B": "To emphasize divine grace, spiritual harmony, and sacred legitimacy rather than destructive force",
        "C": "The assembly took place inside a soundproof palace",
        "D": "The author wished to avoid writing battle scenes"
      },
      "correct_answer": "B",
      "explanation": "A gentle descent underlines that legitimate unity arrives through spiritual harmony, not violence."
    },
    {
      "item_number": 68,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the ultimate purpose of the divine gallery described in 'The Unseen Painter'?",
      "options": {
        "A": "To charge admission fees to human observers",
        "B": "To showcase harmony, unity in diversity, and the shared beauty of all creation",
        "C": "To preserve paintings before environmental destruction occurs",
        "D": "To show that human painters are in competition with God"
      },
      "correct_answer": "B",
      "explanation": "The divine gallery celebrates how contrasting elements unite into a harmonious whole."
    },
    {
      "item_number": 69,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Transformation",
      "question": "How does Tina Bells' initial innocence contrast with her final empowerment?",
      "options": {
        "A": "She begins as an athlete and ends as a scholar",
        "B": "She enters unaware of the cabal and grows into a courageous investigator who helps dismantle it",
        "C": "She starts as an ally of Nkrabea and ends as a head prefect",
        "D": "She drops out of school to become a youth counselor"
      },
      "correct_answer": "B",
      "explanation": "Her arc moves from naive newcomer to clear-sighted leader standing against corruption."
    },
    {
      "item_number": 70,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "What is the effect of using the word ' aloof' to describe the mansion?",
      "options": {
        "A": "It shows that the building was situated upon an ocean cliff",
        "B": "It personifies the estate as cold, detached, and secretive from the surrounding community",
        "C": "It proves that the house was constructed with European imported bricks",
        "D": "It indicates that the property was up for commercial sale"
      },
      "correct_answer": "B",
      "explanation": "Describing the house as 'aloof' lends it a distant, secretive personality."
    },
    {
      "item_number": 71,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Literary Pathos",
      "question": "How does the image of Oliver being locked in the dark cellar evoke pathos?",
      "options": {
        "A": "It highlights his criminal defiance against parish authority",
        "B": "It emphasizes the vulnerability and isolation of an innocent child punished for hunger",
        "C": "It reveals that the workhouse had run out of bedroom space",
        "D": "It proves that Oliver intended to escape to London that night"
      },
      "correct_answer": "B",
      "explanation": "Confinement in a dark cellar evokes deep sympathy for a small child punished for wanting food."
    },
    {
      "item_number": 72,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Audience Manipulation",
      "question": "Why does Antony invite the plebeians to form a circle around Caesar\u2019s corpse?",
      "options": {
        "A": "To protect himself from being attacked by conspirator soldiers",
        "B": "To ensure every citizen sees the physical violence done to Caesar, provoking collective outrage",
        "C": "To collect monetary donations for Caesar\u2019s burial monument",
        "D": "To conduct a traditional Roman religious purification rite"
      },
      "correct_answer": "B",
      "explanation": "Drawing them near the corpse makes the violence personal, turning grief into anger."
    },
    {
      "item_number": 73,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the significance of Osmond's final performance taking place in Accra rather than Obane?",
      "options": {
        "A": "It shows that artistic success is recognized on national platforms while honoring rural roots",
        "B": "It proves that he had disowned his family in Obane",
        "C": "It indicates that Obane lacked musical instruments",
        "D": "It reveals that the national government had banned village performances"
      },
      "correct_answer": "A",
      "explanation": "The capital setting shows his talent reaching nationwide acclaim while remaining tied to his origins."
    },
    {
      "item_number": 74,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Foils",
      "question": "How does Asantewaa's work ethic contrast with Kwansah\u2019s sense of entitlement?",
      "options": {
        "A": "Asantewaa relies on family wealth, while Kwansah works after school",
        "B": "Asantewaa earns success through dedication and teamwork, while Kwansah expects status without effort",
        "C": "Asantewaa copies her designs from foreign textbooks",
        "D": "Kwansah is an expert inventor who was unfairly disqualified"
      },
      "correct_answer": "B",
      "explanation": "Her success is built on hard work and study, while Kwansah expects unearned privilege."
    },
    {
      "item_number": 75,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Symbolic Resonance",
      "question": "What does the Golden Stool signify regarding political leadership in Ghana?",
      "options": {
        "A": "Power is absolute and accountable to no higher spiritual law",
        "B": "Leadership is a sacred trust grounded in ancestral wisdom, justice, and the well-being of the people",
        "C": "Rulers must use military conquest to maintain authority",
        "D": "Chieftaincy should be replaced by foreign administrative models"
      },
      "correct_answer": "B",
      "explanation": "The stool reminds leaders that authority is a sacred duty exercised on behalf of the ancestors and people."
    },
    {
      "item_number": 76,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "How does 'The Unseen Painter' promote empathy among diverse cultural groups?",
      "options": {
        "A": "By demanding that all communities adopt identical customs",
        "B": "By illustrating that every human being is crafted by the same divine creator with purpose and care",
        "C": "By showing that ancient civilizations were without cultural bias",
        "D": "By arguing that differences should be hidden from view"
      },
      "correct_answer": "B",
      "explanation": "Recognizing all people as parts of one design nurtures mutual empathy and respect."
    },
    {
      "item_number": 77,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Leadership Ethics",
      "question": "What principle of educational leadership is demonstrated by Mrs. Janet Acquah?",
      "options": {
        "A": "Authoritarian control is necessary to maintain order in struggling schools",
        "B": "Transformative leadership requires empathy, presence, and personal sacrifice to rebuild trust",
        "C": "School heads should delegate all disciplinary matters to student leaders",
        "D": "Academic performance matters more than student safety and well-being"
      },
      "correct_answer": "B",
      "explanation": "Her actions show that reform succeeds when leaders lead by example and show personal commitment."
    },
    {
      "item_number": 78,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "How does the poet create suspense in 'Real Illusioned Beckley' without showing physical violence?",
      "options": {
        "A": "By detailing police autopsy reports in the stanzas",
        "B": "Through suggestive imagery, rumors, secluded architecture, and fearful whispers",
        "C": "By having characters shout warnings in every stanza",
        "D": "By describing battle scenes between citizens and guards"
      },
      "correct_answer": "B",
      "explanation": "Suspense is built on the unseen: secluded walls, quiet corridors, and spreading rumors."
    },
    {
      "item_number": 79,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Satirical Techniques",
      "question": "How does Dickens use irony when describing the workhouse board as 'benevolent'?",
      "options": {
        "A": "They had established healthcare funds for all children",
        "B": "The word mocks their utter lack of charity, as they starved the children under their care",
        "C": "They were recognized by Parliament for exemplary welfare administration",
        "D": "The board members had donated their own salaries to the workhouse"
      },
      "correct_answer": "B",
      "explanation": "Calling the board 'benevolent' is sharp sarcasm highlighting their cold neglect."
    },
    {
      "item_number": 80,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Mechanics",
      "question": "What is the psychological effect of Antony repeatedly delaying the reading of the will?",
      "options": {
        "A": "The plebeians lose interest and begin wandering away from the forum",
        "B": "It heightens anticipation and desperation, making the final revelation overwhelming",
        "C": "It allows the conspirators time to gather armed support",
        "D": "It proves that Antony was hesitant about challenging Brutus"
      },
      "correct_answer": "B",
      "explanation": "Withholding the will builds suspense and ensures maximum emotional impact when read."
    },
    {
      "item_number": 81,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "How does Osmond's final breakthrough validate the support he received from his mentors?",
      "options": {
        "A": "By proving that their belief and guidance were vital to his transformation",
        "B": "By allowing him to pay off his debts and cut ties with his past",
        "C": "By showing that individual talent needs no external guidance",
        "D": "By enabling him to establish a commercial recording label to compete with them"
      },
      "correct_answer": "A",
      "explanation": "His performance confirms that potential flourishes when supported by dedicated mentorship."
    },
    {
      "item_number": 82,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Social Criticism",
      "question": "What critique of rural society is presented through Kwansah\u2019s jealousy of Asantewaa?",
      "options": {
        "A": "Traditional societies always welcome female leadership without hesitation",
        "B": "Ingrained gender bias can lead some to resent and sabotage female achievement",
        "C": "Rural communities prefer farming to technology",
        "D": "Schools in rural areas are too well-funded to require solar power"
      },
      "correct_answer": "B",
      "explanation": "Kwansah's resentment illustrates how traditional prejudices can push people to undermine capable women."
    },
    {
      "item_number": 83,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Craft & Meter",
      "question": "How does the rhythm of the poem reflect its ceremonial subject matter?",
      "options": {
        "A": "It uses irregular staccato beats that mirror a frantic modern commute",
        "B": "It employs a dignified, measured cadence that evokes solemn spiritual rituals",
        "C": "It mimics the fast beat of urban highlife dance music",
        "D": "It consists of chaotic fragments without poetic flow"
      },
      "correct_answer": "B",
      "explanation": "A measured, stately rhythm creates a solemn atmosphere fitting for a sacred national legend."
    },
    {
      "item_number": 84,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Philosophy & Art",
      "question": "Why is the Creator envisioned as a painter rather than an engineer or architect?",
      "options": {
        "A": "Painting is viewed as an easier profession than building",
        "B": "A painter emphasizes beauty, color, diversity, and expressive care rather than rigid utilitarian mechanics",
        "C": "The author was a painter by training",
        "D": "To show that the earth requires regular maintenance and touch-ups"
      },
      "correct_answer": "B",
      "explanation": "Envisioning God as a painter highlights artistic care, color, and expressive harmony."
    },
    {
      "item_number": 85,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the symbolic meaning of the school emerging from 'shadow into light'?",
      "options": {
        "A": "The school installed modern electrical floodlights across the campus",
        "B": "The campus was transformed from fear and corruption into transparency, truth, and hope",
        "C": "The student body adopted bright yellow uniforms",
        "D": "The academic year moved from rainy season into dry season"
      },
      "correct_answer": "B",
      "explanation": "Moving from shadow to light symbolizes the victory of truth, accountability, and renewal over intimidation."
    },
    {
      "item_number": 86,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Psychological Insight",
      "question": "How does 'Real Illusioned Beckley' demonstrate the lingering effects of childhood fears?",
      "options": {
        "A": "By showing that the speaker continues to avoid all industrial zones in Ghana",
        "B": "By illustrating how childhood anxieties remain etched in memory even after maturity brings rational perspective",
        "C": "By proving that Dr. Beckley was innocent of all rumors",
        "D": "By showing that urban myths disappear as soon as one grows up"
      },
      "correct_answer": "B",
      "explanation": "The speaker's vivid memories show that early encounters with fear leave lasting impressions."
    },
    {
      "item_number": 87,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Stylistic Contrast",
      "question": "How does Dickens juxtapose Oliver's gentle character with the cruelty of the workhouse officials?",
      "options": {
        "A": "Oliver carries a weapon while the officials are unarmed",
        "B": "Oliver's politeness ('Please, sir') contrasts sharply with the master's violent blow and the board's fury",
        "C": "Oliver refuses to speak while the officials shout",
        "D": "Oliver is dressed in velvet while the officials wear rags"
      },
      "correct_answer": "B",
      "explanation": "Oliver's polite, small voice makes the adults' violent, outsized reaction look even more cruel."
    },
    {
      "item_number": 88,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Political Rhetoric",
      "question": "What lesson does Shakespeare offer regarding the power of public oratory?",
      "options": {
        "A": "Public speeches have little effect on political events",
        "B": "Masterful rhetoric that taps into human emotions can reshape political outcomes and redirect history",
        "C": "Audiences always make choices based on calm logic rather than emotion",
        "D": "Political leaders should avoid addressing common citizens directly"
      },
      "correct_answer": "B",
      "explanation": "Antony's speech shows that skillful rhetoric can sway public opinion and alter the course of an empire."
    },
    {
      "item_number": 89,
      "text": "Comparative Literature: Spreading Light & A Beacon of Light",
      "strand": "Comparative Prose & Drama",
      "sub_strand": "Thematic Synthesis",
      "question": "How do both Asantewaa in 'Spreading Light' and Osmond in 'A Beacon of Light' overcome adversity?",
      "options": {
        "A": "By relying entirely on municipal government grants",
        "B": "Through resilience, dedication to their gifts, and supportive mentors who believe in them",
        "C": "By leaving Ghana to pursue opportunities overseas",
        "D": "By abandoning their cultural heritage to fit in"
      },
      "correct_answer": "B",
      "explanation": "Both protagonists succeed through personal persistence, focus on their craft, and trusted mentors."
    },
    {
      "item_number": 90,
      "text": "Comparative Literature: Oliver Asks for More & Beyond Light and Shadow",
      "strand": "Comparative Prose",
      "sub_strand": "Institutional Critique",
      "question": "What shared institutional flaw is critiqued in both 'Oliver Asks for More' and 'Beyond Light and Shadow'?",
      "options": {
        "A": "The lack of modern sports complexes in schools",
        "B": "How institutions meant to nurture youth can degenerate into places of exploitation and fear when unchecked",
        "C": "The refusal of students to take national examinations",
        "D": "The influence of foreign languages on traditional education"
      },
      "correct_answer": "B",
      "explanation": "Both texts warn that institutions meant to protect the young can become cruel when moral leadership is absent."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "A Beacon of Light",
      "strand": "Prose Extract & Appreciation",
      "extract": "Osmond listened to the playback in the soundproof booth. The notes of 'Someone to Lean On' resonated through the monitors, rich and steady. Ms. Adjei rested her hands on the mixer console, smiling. 'You didn't just sing notes, Osmond. You told the story of everyone who has ever carried a load alone.' Outside the double doors, Accra was rushing by, but in that studio room, his small village of Obane had found its voice.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What does Ms. Adjei mean when she observes that Osmond 'told the story of everyone who has ever carried a load alone'?",
          "marks": 3,
          "expected_answer": "She means his singing taps into a universal human experience of hardship, turning his personal struggles into an anthem of mutual support and shared resilience."
        },
        {
          "label": "(b)",
          "question": "How does the author use contrast between the interior studio and the exterior city of Accra?",
          "marks": 3,
          "expected_answer": "The text contrasts the hectic, indifferent pace of urban Accra outside with the quiet focus and cultural authenticity of Obane preserved within the studio."
        },
        {
          "label": "(c)",
          "question": "Identify the metaphor in 'his small village of Obane had found its voice' and explain its significance.",
          "marks": 2,
          "expected_answer": "The metaphor equates Osmond's musical success to his entire village gaining visibility and pride, showing that his triumph belongs to his community."
        },
        {
          "label": "(d)",
          "question": "State one key character trait of Ms. Adjei revealed in this scene.",
          "marks": 2,
          "expected_answer": "Encouraging, perceptive, supportive, and dedicated to bringing out the best in her student."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Spreading Light",
      "strand": "Drama Extract & Appreciation",
      "extract": "SIR NII: (Placing the recovered inverter on the demonstration table) Science is not magic, Kwansah. It is patience, sweat, and care for those who sit in the dark. You hid the panels behind your mother\u2019s goat shed, but you could not extinguish the light in their minds.\nKWANSAH: (Looking down at the floor, fists clenched) She had no right to stand before the whole village as if she were a chief.\nASANTEWAA: (Stepping forward, calm) I did not stand as a chief, Kwansah. I stood as a daughter who wanted her brothers and sisters to read without burning their eyes on kerosene fumes.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What underlying prejudice is revealed by Kwansah\u2019s complaint about Asantewaa standing 'as if she were a chief'?",
          "marks": 3,
          "expected_answer": "It reveals his deep-seated gender prejudice and resentment of a female peer taking leadership in a traditionally male-dominated space."
        },
        {
          "label": "(b)",
          "question": "Analyze Sir Nii's definition of science in the opening lines.",
          "marks": 3,
          "expected_answer": "He defines science as hard work, ethical persistence, and compassionate service to improve communal life, rather than mere technical display."
        },
        {
          "label": "(c)",
          "question": "How does Asantewaa's response reflect servant leadership rather than personal ambition?",
          "marks": 2,
          "expected_answer": "She explains that her motivation was practical and altruistic: helping village children study safely without breathing smoky kerosene fumes."
        },
        {
          "label": "(d)",
          "question": "What does Kwansah's physical gesture of clenched fists signify?",
          "marks": 2,
          "expected_answer": "It signifies suppressed anger, wounded pride, and lingering defiance despite being exposed."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry Extract & Appreciation",
      "extract": "The Golden Stool descends through twilight's hush,\nA sacred bond no earthly sword can crush;\nA treasure trove, of stories yet untold,\nForging a nation in its shining gold.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Explain the metaphor 'A treasure trove, of stories yet untold'.",
          "marks": 3,
          "expected_answer": "It equates the Stool to a treasure chest holding the unwritten history, sacrifices, cultural memory, and future destiny of the Ashanti people."
        },
        {
          "label": "(b)",
          "question": "What is the historical significance of the Stool 'forging a nation'?",
          "marks": 3,
          "expected_answer": "It refers to Okomfo Anokye using the Stool to unite previously divided Akan clans into a unified empire under Osei Tutu I."
        },
        {
          "label": "(c)",
          "question": "Identify the end-rhyme scheme of these lines and comment on its poetic effect.",
          "marks": 2,
          "expected_answer": "The rhyme scheme is AABB (hush/crush, untold/gold); the rhyming couplets lend a dignified, memorable musicality fitting for an anthem."
        },
        {
          "label": "(d)",
          "question": "What tone does the poet maintain throughout this stanza?",
          "marks": 2,
          "expected_answer": "Reverent, celebratory, and patriotic."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "The Unseen Painter",
      "strand": "Poetry Extract & Appreciation",
      "extract": "God must be a painter,\nMixing every shade of skin\nTo show that in His gallery,\nAll hues belong within.\nNo single brushstroke claims the light,\nNo pigment owns the frame;\nEach soul a deliberate tint,\nTo glorify His name.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct the extended metaphor comparing human diversity to an art gallery.",
          "marks": 3,
          "expected_answer": "Humanity is depicted as an art exhibition where diverse ethnic and racial groups are intentional, harmonious colors painted on the same canvas."
        },
        {
          "label": "(b)",
          "question": "Explain the philosophical meaning of 'No single brushstroke claims the light'.",
          "marks": 3,
          "expected_answer": "It asserts that no race, culture, or ethnicity can claim superiority over others; all are equal parts of the same design."
        },
        {
          "label": "(c)",
          "question": "How does the poet use diction to challenge racial prejudice in this extract?",
          "marks": 2,
          "expected_answer": "Words like 'deliberate tint' and 'all hues belong within' portray human differences as purposeful, dignified, and essential to creation."
        },
        {
          "label": "(d)",
          "question": "Identify one example of personification or active voice in these lines.",
          "marks": 2,
          "expected_answer": "'No single brushstroke claims the light' personifies the brushstroke with the human capacity to make claims."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "Beyond Light and Shadow",
      "strand": "Prose Extract & Appreciation",
      "extract": "Benson stood in the headteacher's office, his hands trembling slightly as he laid the red notebook on Mrs. Acquah's desk. 'This contains the meeting places of Ashes Flame, Nana,' he said, his voice dropping to a whisper. 'And the names of those who pay Nkrabea.' Mrs. Acquah looked up, her gaze steady and compassionate. 'It takes more courage to turn away from the fire, Benson, than it ever took to carry the torch.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What is the symbolic importance of Benson surrendering the red notebook?",
          "marks": 3,
          "expected_answer": "It represents his decisive break from the cabal, renouncing secrecy and choosing transparency and accountability."
        },
        {
          "label": "(b)",
          "question": "Explain Mrs. Acquah's metaphor: 'It takes more courage to turn away from the fire... than it ever took to carry the torch'.",
          "marks": 3,
          "expected_answer": "She points out that breaking away from a corrupt group and admitting past wrongs requires deeper moral bravery than running along with the gang."
        },
        {
          "label": "(c)",
          "question": "How does this extract illustrate restorative leadership rather than punitive vengeance?",
          "marks": 2,
          "expected_answer": "Instead of simply expelling Benson, Mrs. Acquah receives his confession with compassion, guiding him toward redemption."
        },
        {
          "label": "(d)",
          "question": "What adult figure is revealed as the criminal sponsor of the school cabal?",
          "marks": 2,
          "expected_answer": "Nkrabea."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry Extract & Appreciation",
      "extract": "The industrial city hummed with smoke and steel,\nYet primitive fear was all the streets could feel.\nBehind the high walls, where the tall grasses grew,\nDr. Beckley\u2019s quiet house kept secrets few men knew.\nWe ran past the gates with our hearts in our chest,\nFor rumors of horror gave children no rest.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Analyze the irony of setting presented in the opening couplet.",
          "marks": 3,
          "expected_answer": "It contrasts modern industrial progress ('smoke and steel') with primitive superstition and fear, showing that development does not automatically dispel irrational dread."
        },
        {
          "label": "(b)",
          "question": "What does the 'quiet house' symbolize in relation to community trauma?",
          "marks": 3,
          "expected_answer": "It symbolizes hidden horrors, institutional secrecy, and the unknown threats that prey upon childhood imagination."
        },
        {
          "label": "(c)",
          "question": "Identify the kinetic imagery in the extract and state its effect.",
          "marks": 2,
          "expected_answer": "'We ran past the gates with our hearts in our chest'; it captures children fleeing past the estate in panic."
        },
        {
          "label": "(d)",
          "question": "What rhyme scheme is utilized across these six lines?",
          "marks": 2,
          "expected_answer": "AABBCC (steel/feel, grew/knew, chest/rest), creating an orderly narrative rhythm."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Oliver Asks for More",
      "strand": "Prose Extract & Appreciation",
      "extract": "The board were sitting in solemn conclave, when Mr. Bumble rushed into the room in great excitement, and addressing the gentleman in the high chair, said,\n'Mr. Limbkins, I beg your pardon, sir! Oliver Twist has asked for more!'\nThere was a general start. Horror was depicted on every countenance.\n'For more!' said Mr. Limbkins. 'Compose yourself, Bumble, and answer me distinctly. Do I understand that he asked for more, after he had eaten the supper allotted by the dietary?'\n'He did, sir,' replied Bumble.\n'That boy will be hung,' said the gentleman in the white waistcoat. 'I know that boy will be hung.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does Dickens use situational irony in the board's reaction to Oliver's request?",
          "marks": 3,
          "expected_answer": "The board treats a starving boy asking for porridge as if he had committed treason or attempted murder, turning a basic plea into an outrage."
        },
        {
          "label": "(b)",
          "question": "Explain the significance of the gentleman in the white waistcoat repeatedly predicting: 'That boy will be hung'.",
          "marks": 3,
          "expected_answer": "It exposes the callousness of the middle-class board, who view poverty as an inherent criminal flaw that will inevitably lead to the gallows."
        },
        {
          "label": "(c)",
          "question": "What is satirical about referring to the board meeting as a 'solemn conclave'?",
          "marks": 2,
          "expected_answer": "It sarcastically compares a parish committee gathered to starve orphans to a holy council of church cardinals."
        },
        {
          "label": "(d)",
          "question": "Identify the visual detail associated with Mr. Limbkins in this extract.",
          "marks": 2,
          "expected_answer": "He sits elevated in the 'high chair', visually symbolizing authority over the helpless paupers."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama Extract & Appreciation",
      "extract": "ANTONY: You all did see that on the Lupercal\nI thrice presented him a kingly crown,\nWhich he did thrice refuse: was this ambition?\nYet Brutus says he was ambitious;\nAnd, sure, he is an honourable man.\nI speak not to disprove what Brutus spoke,\nBut here I am to speak what I do know.\nYou all did love him once, not without cause:\nWhat cause withholds you then, to mourn for him?\nO judgment! thou art fled to brutish beasts,\nAnd men have lost their reason.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does Antony combine historical evidence with rhetorical questioning in the opening lines?",
          "marks": 3,
          "expected_answer": "He points to Caesar refusing the crown three times at the Lupercal, asking whether that refusal fits ambition to make the crowd question Brutus."
        },
        {
          "label": "(b)",
          "question": "Identify the apostrophe in the extract and explain its dramatic purpose.",
          "marks": 3,
          "expected_answer": "'O judgment! thou art fled to brutish beasts' addresses judgment directly, dramatizing Antony's grief at the crowd's loss of reason."
        },
        {
          "label": "(c)",
          "question": "Explain the pun on Brutus\u2019s name in the phrase 'brutish beasts'.",
          "marks": 2,
          "expected_answer": "Shakespeare plays on the name 'Brutus' and the word 'brutish', subtly hinting that Brutus's logic was animalistic and savage."
        },
        {
          "label": "(d)",
          "question": "What emotional change does Antony produce in the plebeians through this speech?",
          "marks": 2,
          "expected_answer": "He shifts them from cheering Brutus's defense into weeping for Caesar and turning their anger against the conspirators."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "Comparative Literature: Beyond Light and Shadow & Oliver Asks for More",
      "strand": "Comparative Appreciation",
      "extract": "TEXT 1 (Beyond Light and Shadow):\n'Mrs. Acquah refused to let Cedar of Lebanon remain in the grip of fear. She enrolled her own daughter, Tina, showing that an educator must share the risks of her students.'\n\nTEXT 2 (Oliver Asks for More):\n'The board decided to make the workhouse uncomfortable, in order to discourage poor people from coming there. As a result, the boys were always hungry.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Contrast the philosophy of leadership demonstrated by Mrs. Acquah in Text 1 with that of the workhouse board in Text 2.",
          "marks": 4,
          "expected_answer": "Mrs. Acquah practices servant leadership, risking her own family's security to protect students. The board practices bureaucratic cruelty, intentionally starving vulnerable boys to deter reliance on relief."
        },
        {
          "label": "(b)",
          "question": "How do both excerpts examine the vulnerability of children within institutional settings?",
          "marks": 3,
          "expected_answer": "Both show that children depend entirely on institutional integrity; without caring leadership, they become targets of neglect or extortion."
        },
        {
          "label": "(c)",
          "question": "What message regarding institutional reform emerges from comparing these two passages?",
          "marks": 3,
          "expected_answer": "Reform requires moral courage and empathy from administrators; bureaucratic detachment leads to systemic cruelty."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis: Advanced Essay Writing Methodology",
      "strand": "BECE Paper 2 Essay Formulation",
      "extract": "In BECE Paper 2, candidates must structure analytical essays using the Point-Evidence-Explanation (P-E-E) technique, drawing on textual details, character motivations, and literary devices.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Using the P-E-E format, write an analytical paragraph on the theme of 'Loyalty and Betrayal' in 'Beyond Light and Shadow'.",
          "marks": 4,
          "expected_answer": "Point: In 'Beyond Light and Shadow', loyalty is portrayed as a moral choice between peer complicity and ethical duty. Evidence: Benson wrestles with his secret oath to Ashes Flame before handing the cabal's records to Mrs. Acquah. Explanation: This illustrates that breaking loyalty with a corrupt group is an act of moral courage that paves the way for redemption."
        },
        {
          "label": "(b)",
          "question": "Compare the rhetorical approach of Brutus with that of Mark Antony in 'Mark Antony Mourns Caesar'.",
          "marks": 3,
          "expected_answer": "Brutus relies on formal prose, abstract logic (logos), and his personal honor to justify the murder. Antony uses verse, rhetorical questions, verbal irony, and emotional appeals (pathos) with Caesar's body to incite the crowd."
        },
        {
          "label": "(c)",
          "question": "State three common errors candidates should avoid when writing BECE literature essay answers.",
          "marks": 3,
          "expected_answer": "1. Merely retelling the plot without identifying literary devices. 2. Making broad claims without quoting or referencing specific scenes. 3. Failing to explain how character choices connect to the overarching theme."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB9Intermediate() {
  console.log("Seeding Basic 9 Intermediate Practice Lab (100 Items) for The Beacon of Light...");
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
      id: `B9_BL_I_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "intermediate",
      category: `${item.strand} Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Analyze literary mechanics, character psychology, rhetorical devices, and societal themes in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Demonstrate intermediate literary appreciation of prescribed The Beacon of Light texts (${item.text}), evaluating structural design, character foils, irony, sensory imagery, and institutional critique.`
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

    const promptText = `📖 PRESCRIBED TEXT EXTRACT:\n"${item.extract}"\n— ${item.text}\n\n❓ INTERMEDIATE CRITICAL APPRECIATION & ESSAY METHODOLOGY (Total: ${item.total_marks} Marks):${subQuestionsFormatted}`;

    allItems.push({
      id: `B9_BL_I_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B9",
      difficulty: "intermediate",
      category: `${item.strand}`,
      title: `${item.text} - Intermediate Appreciation & Analysis`,
      shortSummary: `In-depth extract appreciation, rhetorical analysis, and BECE Paper 2 essay formulation for '${item.text}' (10 Marks).`,
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
            displayName: "Textual Analysis & Contextual Understanding",
            maxMarks: 5,
            scoringGuidelines: item.sub_questions.map((sq: any) => `${sq.label} ${sq.question} (${sq.marks}m)`),
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Accurately addresses ${sq.label} using textual evidence and critical insight`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Terminology, Analytical Clarity & Structure",
            maxMarks: 5,
            scoringGuidelines: ["Accurate identification of stylistic and thematic devices (extended metaphor, irony, synecdoche, paralipsis, apostrophe)", "Point-Evidence-Explanation (P-E-E) synthesis and structured presentation"],
            diagnosticChecklist: ["Demonstrates clear literary register, precise diction, and adherence to WAEC answering conventions"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Carefully examine the extract from '${item.text}' to evaluate underlying motivations, figurative mechanics, and thematic subtext.`,
      competencyTarget: `${item.strand}: Intermediate Extract Analysis & Synthesis`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Critically evaluate literary excerpts from The Beacon of Light across poetry, drama, and prose, applying P-E-E essay formulation, analyzing character foils, verbal irony, and institutional dynamics.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B9",
    difficulty: "intermediate",
    title: "Basic 9 Literature Diagnostic Assessment Lab: The Beacon of Light (Intermediate Tier - 100 Items)",
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
          id: `B9_BL_I_TH_${t.item_number}`,
          title: `${t.text} - Intermediate Appreciation`,
          category: t.strand,
          shortSummary: `Extract analysis and appreciation of ${t.text}`
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B9_intermediate`);
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

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B9 Intermediate Lab!`);
}

seedBeaconOfLightB9Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Intermediate Lab:", err);
    process.exit(1);
  });
