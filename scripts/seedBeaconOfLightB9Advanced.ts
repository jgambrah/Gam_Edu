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
    "title": "Basic 9 Literature Diagnostic Assessment Lab - Advanced Tier (100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 9 (JHS 3)",
    "tier": "Advanced",
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
      "sub_strand": "Sociological Criticism & Agency",
      "question": "How does Osmond's negotiation with Golden Voice Records subvert the historical trope of rural artists being exploited by urban recording syndicates?",
      "options": {
        "A": "He surrenders full ownership of his master recordings in exchange for immediate cash",
        "B": "Backed by Ms. Adjei's counsel, he retains creative control and embeds traditional musical motifs into his commercial release",
        "C": "He leaves Ghana immediately to sign contracts with European distributors",
        "D": "He relies exclusively on informal oral agreements rather than legal contracts"
      },
      "correct_answer": "B",
      "explanation": "Osmond's development demonstrates informed agency; guided by ethical mentorship, he safeguards his intellectual property and cultural integrity rather than succumbing to exploitative industry terms."
    },
    {
      "item_number": 2,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Dramatic Structure & Climax",
      "question": "What is the structural significance of staging the exposure of Kwansah along the village path rather than inside a closed classroom?",
      "options": {
        "A": "The school building was locked for end-of-term vacations",
        "B": "The public path represents communal accountability, where moral arbitration and justice must be witnessed collectively by the entire village",
        "C": "Sir Nii was forbidden from speaking inside domestic premises",
        "D": "Kwansah refused to enter the school compound after stealing the panels"
      },
      "correct_answer": "B",
      "explanation": "The village path serves as an open civic arena; placing the climax there emphasizes that restorative justice and community healing require collective public witnessing."
    },
    {
      "item_number": 3,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Post-Colonial Epistemology",
      "question": "How does the poet's celebration of the Golden Stool (*Sika Dwa Kofi*) dismantle Eurocentric colonial narratives regarding indigenous African statehood?",
      "options": {
        "A": "By demonstrating that African kingdoms were governed solely through British colonial charters",
        "B": "By illustrating a sophisticated, divinely sanctioned constitutional order founded on collective spiritual covenant and democratic consensus among chiefs",
        "C": "By portraying pre-colonial governance as entirely chaotic and unstructured",
        "D": "By arguing that ancient African nations lacked tangible symbols of state sovereignty"
      },
      "correct_answer": "B",
      "explanation": "The text frames the Golden Stool as an enduring constitutional embodiment of sovereign nationhood, refuting colonial assumptions of pre-colonial African political disorganization."
    },
    {
      "item_number": 4,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Metaphysical Aesthetics",
      "question": "In 'The Unseen Painter', why does the author equate theological creation with the fine arts rather than mechanical engineering?",
      "options": {
        "A": "Fine arts emphasize expressive intention, organic diversity, and aesthetic harmony over cold, utilitarian uniformity",
        "B": "Mechanical professions were non-existent during the historical era described",
        "C": "The author considered physical science incompatible with spiritual belief",
        "D": "Engineering requires imported materials, whereas painting uses only natural dyes"
      },
      "correct_answer": "A",
      "explanation": "Artistic metaphors highlight divine intentionality, warmth, and the deliberate celebration of diverse colors, contrasting with sterile mechanical models."
    },
    {
      "item_number": 5,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Institutional Pathology",
      "question": "How does the author dissect the concept of 'institutional silence' within Cedar of Lebanon School?",
      "options": {
        "A": "By illustrating that silent meditation improved academic examination results",
        "B": "By exposing how pervasive fear of the Ashes Flame cabal paralyzed both staff and parents, allowing covert abuse to normalize",
        "C": "By showing that students preferred sign language over spoken dialogue",
        "D": "By documenting the enforcement of rigid library regulations across campus"
      },
      "correct_answer": "B",
      "explanation": "The text explores institutional complicity: fear of retaliation silences victims and guardians alike, entrenching corruption until bold leadership intervenes."
    },
    {
      "item_number": 6,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Urban Spatial Theory",
      "question": "How does the poem use the spatial transformation of Tema Gulf City to reflect socio-economic alienation?",
      "options": {
        "A": "By showing that modern highway construction displaced agricultural workers into luxury beachfront apartments",
        "B": "By contrasting rapid industrial modernization with the psychological alienation and paranoia bred behind gated, secretive mansions",
        "C": "By proving that rural farmlands naturally resist commercial real estate development",
        "D": "By arguing that heavy industries eliminate all traditional neighborhood folklore"
      },
      "correct_answer": "B",
      "explanation": "The industrial landscape creates an atmosphere where rapid urban growth and isolated, fortified homes foster deep communal suspicion and fear."
    },
    {
      "item_number": 7,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Malthusian Political Economy",
      "question": "How does Dickens' portrayal of the workhouse board satirize 19th-century Malthusian economic philosophy?",
      "options": {
        "A": "By showing that the board invested surplus parish capital into overseas shipping",
        "B": "By mocking the utilitarian doctrine that deliberately starving the impoverished deters population growth and discourages reliance on public relief",
        "C": "By illustrating how free market food distribution resolved food scarcity in London",
        "D": "By portraying the board members as radical socialist reformers"
      },
      "correct_answer": "B",
      "explanation": "Dickens satirizes the cold Malthusian logic that framed poverty as an economic burden to be eliminated through calculated privation and institutional cruelty."
    },
    {
      "item_number": 8,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Hegemony",
      "question": "What core philosophical flaw in Brutus's republican oratory allows Mark Antony to dismantle his political defense?",
      "options": {
        "A": "Brutus relied entirely on visual props while Antony spoke without moving",
        "B": "Brutus relied on abstract philosophical logic (*logos*) that assumed an enlightened public, while Antony mastered visceral emotional psychology (*pathos*)",
        "C": "Brutus spoke in Greek while the common plebeians understood only Latin",
        "D": "Brutus admitted openly that he was paid by foreign powers to assassinate Caesar"
      },
      "correct_answer": "B",
      "explanation": "Brutus appeals to abstract honor, naively assuming the crowd will evaluate ideas logically; Antony appeals directly to grief, material interest, and anger."
    },
    {
      "item_number": 9,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective & Irony",
      "question": "How does the omniscient narrative voice in 'A Beacon of Light' heighten dramatic irony during Osmond's first audition in Accra?",
      "options": {
        "A": "By showing that the judges had decided to disqualify him before hearing a single note",
        "B": "By revealing the judges' quiet amazement at his vocal power while Osmond remains crippled by internal feelings of rural inadequacy",
        "C": "By explaining that the microphone was disconnected from the recording console",
        "D": "By informing the reader that Ms. Adjei was a rival performer seeking to steal his song"
      },
      "correct_answer": "B",
      "explanation": "The dual perspective creates dramatic irony: the reader sees the audition panel's genuine admiration while Osmond misinterprets their silence as rejection."
    },
    {
      "item_number": 10,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Cultural & Political Dynamics",
      "question": "In 'Spreading Light', how does Uncle Ato\u2019s evaluation in Act 4, Scene 1 ('She\u2019s the brain behind this?') challenge traditional gerontocratic patriarchy?",
      "options": {
        "A": "He orders the village council to ban female pupils from the marketplace",
        "B": "His astonishment marks the beginning of adult male recognition that transformative intellectual power can reside in a young rural girl",
        "C": "He refuses to believe that electricity can be generated without wood fuel",
        "D": "He demands that Sir Nii take sole legal ownership of the solar invention"
      },
      "correct_answer": "B",
      "explanation": "His reaction captures the cognitive shift required of traditional elders when youth, and particularly young women, lead scientific innovation."
    },
    {
      "item_number": 11,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Cosmological Semiotics",
      "question": "How does the poet utilize the semiotics of gold to bridge material reality with metaphysical transcendence?",
      "options": {
        "A": "Gold is treated solely as an export currency traded with European merchant ships",
        "B": "Gold represents incorruptibility, eternal sovereignty, and the enduring vitality of the ancestral soul (*Sunsum*)",
        "C": "Gold is depicted as an evil mineral that inevitably poisons tribal rivers",
        "D": "Gold symbolizes personal vanity and the private wealth of royal courtesans"
      },
      "correct_answer": "B",
      "explanation": "In Akan cultural metaphysics, gold is not mere bullion; its resistance to rust signifies purity, continuous life, and ancestral sovereignty."
    },
    {
      "item_number": 12,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Ecological Philosophy",
      "question": "How does 'The Unseen Painter' resolve the Cartesian divide between humanity and nature?",
      "options": {
        "A": "By arguing that human intellect is entirely separate from physical ecosystems",
        "B": "By integrating celestial bodies, flora, and human beings into a single, indivisible compositional canvas orchestrated by the Creator",
        "C": "By asserting that nature exists solely to be exploited by industrial machinery",
        "D": "By depicting humanity as an uninvited intruder upon an otherwise pristine earth"
      },
      "correct_answer": "B",
      "explanation": "The poem rejects ecological dualism, presenting humans, stars, and landscapes as interconnected brushstrokes on the same canvas."
    },
    {
      "item_number": 13,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Psychological Duality",
      "question": "In 'Beyond Light and Shadow', how does Benson's role as Head Prefect mirror the psychological concept of the 'split self'?",
      "options": {
        "A": "He suffers from amnesia following a sports injury",
        "B": "He maintains an outward facade of disciplined institutional authority while harboring an inward identity of subversive criminality within Ashes Flame",
        "C": "He pretends to be an overseas exchange student while living in the local village",
        "D": "He acts as an assistant teacher during the day and a night guard after hours"
      },
      "correct_answer": "B",
      "explanation": "His dilemma reflects severe psychological division: enforcing official discipline while secretly enabling student extortion."
    },
    {
      "item_number": 14,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Folklore Dynamics",
      "question": "How does 'Real Illusioned Beckley' demonstrate how modern urban anxieties give birth to contemporary mythologies?",
      "options": {
        "A": "By illustrating how unresolved real-world crimes and industrial isolation transform into supernatural bogeyman legends to explain trauma",
        "B": "By showing that oral storytelling has been replaced by social media communication",
        "C": "By proving that urban myths are created intentionally by municipal authorities",
        "D": "By arguing that children in modern cities lack imaginative capacities"
      },
      "correct_answer": "A",
      "explanation": "The text shows how sensational rumors, fear, and unsolved crimes morph into collective urban folklore to process social vulnerability."
    },
    {
      "item_number": 15,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Discourse Analysis & Irony",
      "question": "In Oliver Twist, what does the recurring phrase 'in their official capacity for official business' expose regarding bureaucratic power?",
      "options": {
        "A": "It highlights the democratic efficiency of the English judicial system",
        "B": "It demonstrates how repetitive bureaucratic jargon is deployed to disguise personal vanity and justify institutional violence against children",
        "C": "It proves that Mr. Bumble was a legally qualified magistrate in London",
        "D": "It indicates that parish orphanages were closely regulated by parliamentary inspectors"
      },
      "correct_answer": "B",
      "explanation": "Dickens repeats the word 'official' to satirize how petty administrators hide behind administrative formulas to justify cruelty."
    },
    {
      "item_number": 16,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Performative Speech Act Theory",
      "question": "According to speech act theory, how does Antony\u2019s repetition of 'Brutus is an honourable man' function performatively?",
      "options": {
        "A": "As a literal pledge of political submission to the conspirators",
        "B": "As an ironic speech act that steadily erodes Brutus's moral legitimacy until the word 'honourable' signifies treason and villainy",
        "C": "As an objective historical evaluation of Roman senatorial integrity",
        "D": "As an official legal pardon clearing the conspirators of criminal charges"
      },
      "correct_answer": "B",
      "explanation": "Through irony and contextual contradiction, the repeated praise performs the act of delegitimizing Brutus's moral standing."
    },
    {
      "item_number": 17,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "How does Osmond's reconciliation with his modest background redefine the narrative's concept of 'light'?",
      "options": {
        "A": "Light is achieved only when an individual completely severs ties with village life",
        "B": "True light is the illumination of character that uses success to uplift one's community, rather than the glare of fame",
        "C": "Light represents the electrical technology used in urban recording soundstages",
        "D": "Light signifies the wealth acquired through private real estate ventures"
      },
      "correct_answer": "B",
      "explanation": "Light shifts from individual public acclaim to a moral quality: using personal gifts to serve and uplift one's home community."
    },
    {
      "item_number": 18,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Dramatic Conflict & Ethics",
      "question": "Why is Kwansah's mother's complicity in Act 5 treated as a graver moral failure than Kwansah's direct theft?",
      "options": {
        "A": "She was an elder whose duty was to uphold truth and discipline, yet she enabled theft out of blind maternal defensiveness",
        "B": "She was an appointed officer of the district education directorate",
        "C": "She had personally disconnected the village electrical generator",
        "D": "She attempted to sell the equipment to foreign traders in Accra"
      },
      "correct_answer": "A",
      "explanation": "Her enabling behavior corrupts adult moral responsibility; she protects dishonesty rather than guiding her son toward ethical conduct."
    },
    {
      "item_number": 19,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Cultural & Political Philosophy",
      "question": "What does the declaration that the Stool represents 'a sacred bond no earthly sword can crush' assert regarding Akan political ontology?",
      "options": {
        "A": "That the empire\u2019s borders were permanently secured by European treaties",
        "B": "That national sovereignty is rooted in transcendent spiritual values and cultural identity that survive physical and military defeat",
        "C": "That the Ashanti state was founded exclusively on iron metallurgy and swordsmanship",
        "D": "That traditional stools should be kept in subterranean sanctuaries during war"
      },
      "correct_answer": "B",
      "explanation": "The line asserts that genuine national identity is spiritual and communal; physical aggression cannot destroy shared cultural consciousness."
    },
    {
      "item_number": 20,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Epistemological Synthesis",
      "question": "In 'The Unseen Painter', what is the philosophical relationship between the 'unseen' nature of the artist and the visible creation?",
      "options": {
        "A": "The artist is absent, leaving the physical world to descend into permanent decay",
        "B": "The invisible Creator's character, benevolence, and love for diversity are revealed through the beauty of the visible universe",
        "C": "Visible nature is an optical illusion that blinds humans to truth",
        "D": "The Creator is visible only to ordained religious priests"
      },
      "correct_answer": "B",
      "explanation": "The poem builds on the classic design argument: the invisible divine artisan is understood and appreciated through the beauty of creation."
    },
    {
      "item_number": 21,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Narrative Ethics & Leadership",
      "question": "How does Mrs. Janet Acquah's strategy of enrolling Tina Bells subvert conventional administrative crisis management?",
      "options": {
        "A": "She relies on armed security units to intimidate troublesome students",
        "B": "She exercises leadership through radical vulnerability, placing her own family into the system to prove genuine commitment",
        "C": "She suspends academic activities until external funding is provided",
        "D": "She negotiates secretly with Nkrabea to divide school authority"
      },
      "correct_answer": "B",
      "explanation": "Rather than issuing detached administrative mandates, she leads through personal stake and moral investment."
    },
    {
      "item_number": 22,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Prosody & Atmosphere",
      "question": "Why does the poet combine unrhymed free verse with enjambment in 'Real Illusioned Beckley'?",
      "options": {
        "A": "To simulate the breathless, uninhibited spread of community gossip and unchecked childhood panic",
        "B": "To conform to classical French lyrical ballad rules",
        "C": "Because the author was translating an ancient oral dirge",
        "D": "To allow the text to be recited without punctuation pauses"
      },
      "correct_answer": "A",
      "explanation": "The flowing, unrhymed structure and run-on lines mirror the rapid, unregulated momentum of rumors moving through a community."
    },
    {
      "item_number": 23,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Deconstruction of Narrative Voice",
      "question": "How does Dickens\u2019 authorial intrusion ('I wish some well-fed gentleman could have seen him') influence the reader\u2019s relationship with the text?",
      "options": {
        "A": "It detaches the reader from the narrative, treating the events as light comedy",
        "B": "It breaks narrative detachment to demand moral complicity and ethical evaluation of real-world poverty",
        "C": "It proves that Dickens was an eyewitness to the events in the chapter",
        "D": "It advises readers to avoid donating to charitable workhouses"
      },
      "correct_answer": "B",
      "explanation": "Direct authorial commentary forces the reader to confront real-world social responsibility rather than treating suffering as mere fiction."
    },
    {
      "item_number": 24,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Sociological Analysis of the Crowd",
      "question": "What does the plebeian proclamation\u2014'Let him be Caesar!'\u2014reveal about the crowd's understanding of republican liberty?",
      "options": {
        "A": "The commoners possessed a sophisticated understanding of democratic checks and balances",
        "B": "The commoners were fundamentally conditioned to autocratic rule, ready to crown the very man who claimed to kill a tyrant to abolish kingship",
        "C": "The commoners intended to execute Brutus on the spot",
        "D": "The crowd was demonstrating against the Roman Senate's military budget"
      },
      "correct_answer": "B",
      "explanation": "Their cry exposes deep political irony: in cheering Brutus for slaying a tyrant, they immediately offer him the exact autocratic crown he fought to abolish."
    },
    {
      "item_number": 25,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Growth & Autonomy",
      "question": "What is the psychological turning point where Osmond ceases to be an insecure rural apprentice and becomes a self-assured artist?",
      "options": {
        "A": "When he receives his first commercial monetary paycheck",
        "B": "When he steps up to the microphone and channels his personal village struggles into universal song rather than trying to imitate foreign singers",
        "C": "When he relocates from Brother Kofi's house to a private luxury residence",
        "D": "When he defeats Ms. Adjei in a public musical debate"
      },
      "correct_answer": "B",
      "explanation": "His maturity is marked by embracing his authentic rural voice and story, finding strength in his roots rather than imitation."
    },
    {
      "item_number": 26,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Semiotic Analysis",
      "question": "In 'Spreading Light', what do the physical solar panels signify when contrasted with the village's kerosene lamps?",
      "options": {
        "A": "The financial divide between urban tourists and rural farmers",
        "B": "The transition from domestic smoke, health hazards, and stagnation to sustainable, enlightened community empowerment",
        "C": "The destruction of traditional agrarian habits by foreign machinery",
        "D": "A political compromise arranged between Sir Nii and the town council"
      },
      "correct_answer": "B",
      "explanation": "Solar panels signify clean innovation, health, and enlightenment, overcoming the hazards and limits of kerosene fumes."
    },
    {
      "item_number": 27,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Historical Realism vs. Myth",
      "question": "How does the poet balance supernatural myth with historical nation-building in 'The Golden Stool / Okomfo Anokye'?",
      "options": {
        "A": "By denying that Osei Tutu I ever existed in historical records",
        "B": "By framing the supernatural descent of the Stool as the unifying spiritual event that cemented practical political treaties among chiefs",
        "C": "By portraying the events as a theatrical comedy performed at festival courts",
        "D": "By arguing that ancient Akan states were unified through foreign conquest"
      },
      "correct_answer": "B",
      "explanation": "The poem harmonizes spiritual legend with political reality, showing how sacred reverence solidified the union of states."
    },
    {
      "item_number": 28,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Diction & Register",
      "question": "What is the poetic effect of describing the diverse human family as 'every shade of skin'?",
      "options": {
        "A": "It reduces complex human beings to purely commercial color charts",
        "B": "It deconstructs racial hierarchies, celebrating varied skin tones as deliberate artistic choices on an equal footing",
        "C": "It proves that the author was discussing chemical fabric dyeing in textile mills",
        "D": "It suggests that certain complexions are unsuited for portraiture"
      },
      "correct_answer": "B",
      "explanation": "The diction treats every human hue as an intentional, valued shade on the divine canvas, dismantling racial bias."
    },
    {
      "item_number": 29,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Structural Pacing",
      "question": "Why does the narrative pace accelerate during the Chapter 10 assault on Benson?",
      "options": {
        "A": "To simulate the violent collapse of the cabal's control and the urgent crisis of Benson's defection",
        "B": "Because the author had to conclude the chapter before end-of-term exams",
        "C": "To indicate that the police had arrived with motorized ambulances",
        "D": "To show that Abeka had run away from the campus grounds"
      },
      "correct_answer": "A",
      "explanation": "Accelerated narrative pacing heightens dramatic tension, reflecting the danger and chaos as Ashes Flame strikes at Benson."
    },
    {
      "item_number": 30,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'Real Illusioned Beckley' explore the vulnerability of children within modern industrial cities?",
      "options": {
        "A": "By documenting their employment in Tema heavy manufacturing plants",
        "B": "By illustrating how industrial sprawl, isolated residences, and adult secrets create an environment of fear where children feel unprotected",
        "C": "By showing that school children preferred rural village life",
        "D": "By arguing that street games are the sole cause of neighborhood rumors"
      },
      "correct_answer": "B",
      "explanation": "The text shows that industrial landscapes and uninvestigated adult rumors leave children vulnerable to deep-seated dread."
    },
    {
      "item_number": 31,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Irony & Hypocrisy",
      "question": "What is the significance of the workhouse master aiming a blow at Oliver's head with the copper ladle?",
      "options": {
        "A": "It was an accidental collision in a crowded, narrow kitchen",
        "B": "The ladle\u2014a tool intended to distribute nourishment\u2014becomes an instrument of physical violence against a hungry orphan",
        "C": "The master was defending himself from an armed apprentice riot",
        "D": "Workhouse rules required physical blows before serving second helpings"
      },
      "correct_answer": "B",
      "explanation": "The scene carries sharp symbolic irony: the utensil that should provide food is turned into a weapon to enforce starvation."
    },
    {
      "item_number": 32,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Theatrical Blocking & Manipulation",
      "question": "How does Mark Antony\u2019s physical positioning of Caesar\u2019s body establish emotional dominance over the assembly?",
      "options": {
        "A": "He hides the body under the senate steps to avoid public distress",
        "B": "He places the mangled corpse at the center of the crowd, turning the physical wound marks into irrefutable evidence of murder",
        "C": "He orders Roman guards to carry the body through the city gates",
        "D": "He demands that Brutus stand directly over the fallen leader"
      },
      "correct_answer": "B",
      "explanation": "Centering the wounded corpse makes the physical reality of the murder undeniable, turning abstract debate into grief."
    },
    {
      "item_number": 33,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Sociological Realism",
      "question": "What critique of rural Ghanaian educational infrastructure is implied in Osmond's journey?",
      "options": {
        "A": "Rural schools are entirely populated by unmotivated instructors",
        "B": "Creative and artistic subjects are often neglected due to resource scarcity, requiring rural youth to seek specialized spaces in cities",
        "C": "Rural communities refuse to support public school infrastructure",
        "D": "Traditional communities forbid children from studying vocal arts"
      },
      "correct_answer": "B",
      "explanation": "His migration to Accra highlights the scarcity of creative arts infrastructure and studios in rural settlements."
    },
    {
      "item_number": 34,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Character Growth & Partnerships",
      "question": "How does Iddrisu's loyalty to Asantewaa during the theft investigation deepen the play's moral theme?",
      "options": {
        "A": "It shows that boys must always take charge of police matters",
        "B": "It proves that true solidarity involves standing by partners facing sabotage, demonstrating mutual respect across gender lines",
        "C": "He planned to take sole credit for tracking the stolen panels",
        "D": "He intended to persuade Asantewaa to drop the charges against Kwansah"
      },
      "correct_answer": "B",
      "explanation": "Iddrisu's active support models loyalty and gender equity, showing that solidarity overcomes sabotage."
    },
    {
      "item_number": 35,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Symbolic Resonance & Memory",
      "question": "Why does the poet describe the Golden Stool as containing 'stories yet untold'?",
      "options": {
        "A": "The regalia contains secret written historical manuscripts inside its frame",
        "B": "The Stool is a dynamic living symbol of ongoing national destiny and cultural endurance, not merely a closed historical artifact",
        "C": "Traditional historians forgot the original folklore surrounding its origin",
        "D": "The poem was left unfinished by the author"
      },
      "correct_answer": "B",
      "explanation": "Calling the stories 'yet untold' frames the Stool as a living, enduring emblem of future hope and cultural continuity."
    },
    {
      "item_number": 36,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Philosophical Synthesis",
      "question": "What is the central paradox explored in 'The Unseen Painter'?",
      "options": {
        "A": "The artist is physically invisible, yet His reality is manifested vividly across every color of creation",
        "B": "The painting was created in darkness, yet it glows without light",
        "C": "The canvas is smaller than the frame that encloses it",
        "D": "Human eyes can see the brush, but cannot see the colors"
      },
      "correct_answer": "A",
      "explanation": "The central theological paradox: an unseen, transcendent artisan whose presence is made tangible in the physical world."
    },
    {
      "item_number": 37,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'Beyond Light and Shadow' illustrate the redemptive power of mentorship?",
      "options": {
        "A": "Mrs. Acquah pays Benson's tuition to ensure his silence",
        "B": "Mrs. Acquah recognizes Benson's inner conflict and guides him toward confession, moral courage, and redemption rather than discard him",
        "C": "Tina Bells takes Benson's place as head prefect",
        "D": "The school board forces Benson to leave the district"
      },
      "correct_answer": "B",
      "explanation": "Mrs. Acquah exercises redemptive guidance, helping a conflicted youth break from criminality to become a true leader."
    },
    {
      "item_number": 38,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Tropes",
      "question": "How does the author use the motif of the 'thinner path' in 'Real Illusioned Beckley'?",
      "options": {
        "A": "To indicate the construction of modern asphalt lanes",
        "B": "As a symbol of vulnerability and marginalization, where children must walk narrow, neglected borders bordered by fear",
        "C": "To prove that the neighborhood was an athletic track club",
        "D": "To show that the mansion\u2019s driveway was accessible to heavy transport"
      },
      "correct_answer": "B",
      "explanation": "The 'thinner path' serves as an objective correlative for the narrow, perilous space children navigate amidst adult rumors."
    },
    {
      "item_number": 39,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Structural Irony",
      "question": "What is the irony behind the board offering five pounds to anyone who will take Oliver as an apprentice?",
      "options": {
        "A": "Oliver possessed personal fortunes inherited from his parents",
        "B": "The parish claims to protect children, yet treats them as cheap commodities, paying outsiders to take them away",
        "C": "The town council had outlawed apprenticeship contracts across Britain",
        "D": "Mr. Bumble intended to adopt Oliver into his own home"
      },
      "correct_answer": "B",
      "explanation": "The financial bounty exposes human commodification: an institution meant to care for orphans pays to dispose of them."
    },
    {
      "item_number": 40,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Deconstruction",
      "question": "How does Antony exploit the plebeians' economic self-interest to overturn their loyalty to the conspirators?",
      "options": {
        "A": "He promises to double the salaries of Roman soldiers",
        "B": "He reveals Caesar\u2019s will bequeathing 75 drachmas and private public gardens to every Roman citizen",
        "C": "He offers to cancel all grain import debts immediately",
        "D": "He threatens to seize the private property of patrician families"
      },
      "correct_answer": "B",
      "explanation": "Revealing Caesar's direct financial gifts transforms theoretical liberty into tangible loyalty to their fallen benefactor."
    },
    {
      "item_number": 41,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Foils & Motivation",
      "question": "In 'A Beacon of Light', how does Ama serve as a moral anchor for Osmond during his visits home to Obane?",
      "options": {
        "A": "She demands that he relocate the recording studio to their village",
        "B": "Her grounded sincerity reminds him of his core human values, preventing the vanity of urban celebrity from blinding him",
        "C": "She advises him to abandon vocal music for cocoa farming",
        "D": "She warns him that Ms. Adjei is deceiving him"
      },
      "correct_answer": "B",
      "explanation": "Ama provides unpretentious friendship, keeping him rooted in modesty and authentic human connection."
    },
    {
      "item_number": 42,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Sociological Realism",
      "question": "How does 'Spreading Light' critique the social passivity of rural adults regarding local development?",
      "options": {
        "A": "By showing adults waiting passively for distant central governments rather than encouraging youth-led local problem-solving",
        "B": "By illustrating that village elders refused to attend school assemblies",
        "C": "By proving that rural communities prefer darkness to electricity",
        "D": "By showing that farming families rejected all secondary education"
      },
      "correct_answer": "A",
      "explanation": "The play contrasts the youth's proactive enterprise with adult resignation, urging communities to back local innovation."
    },
    {
      "item_number": 43,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Aesthetic & Structural Design",
      "question": "How does the poet\u2019s use of couplets contribute to the thematic dignity of 'The Golden Stool / Okomfo Anokye'?",
      "options": {
        "A": "It simulates the frantic tempo of an urban marketplace",
        "B": "Its balanced, paired lines provide solemn, monumental rhythm appropriate for memorializing ancestral statecraft",
        "C": "It breaks the poem into disjointed fragments",
        "D": "It forces readers to recite the lines as light verse"
      },
      "correct_answer": "B",
      "explanation": "Measured couplets lend formal weight, echoing the solemnity of royal oral history and ceremonial praise poetry."
    },
    {
      "item_number": 44,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis & Equality",
      "question": "Why is the artistic canvas depicted as 'very white' before it turns darker in 'The Unseen Painter'?",
      "options": {
        "A": "To demonstrate that white pigments are superior to dark pigments",
        "B": "To represent the pristine state of potentiality before the introduction of creative diversity, balance, and life",
        "C": "To show that the canvas was made of European linen",
        "D": "To indicate that the artwork was completed during winter"
      },
      "correct_answer": "B",
      "explanation": "The white canvas represents raw potential; the arrival of darker tones introduces balance, depth, and human variety."
    },
    {
      "item_number": 45,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Archetypal Criticism",
      "question": "In 'Beyond Light and Shadow', how does Nkrabea fit the archetype of the 'corruptor of youth'?",
      "options": {
        "A": "He provides substandard mathematics textbooks to school libraries",
        "B": "He exploits the poverty, ambition, and insecurity of young students to construct a criminal syndicate for his own profit",
        "C": "He encourages students to abandon secondary school to become musicians",
        "D": "He builds unlicensed boarding facilities in Kansas"
      },
      "correct_answer": "B",
      "explanation": "Nkrabea operates as a predatory patron, manipulating vulnerable youths to run extortion rackets while shielding himself."
    },
    {
      "item_number": 46,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Personification",
      "question": "What is the psychological effect of personifying nature ('The grasses grew tall') in 'Real Illusioned Beckley'?",
      "options": {
        "A": "It portrays nature as an accomplice that conceals mystery and deepens childhood dread",
        "B": "It shows that the municipal council had neglected weed clearance contracts",
        "C": "It proves that the soil was unusually fertile for cash crop farming",
        "D": "It signals that wild animals were prowling the streets of Tema"
      },
      "correct_answer": "A",
      "explanation": "Personifying overgrown vegetation frames nature as a conspiratorial screen hiding the estate's dark secrets."
    },
    {
      "item_number": 47,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Psychological Realism",
      "question": "How does Dickens portray the psychological state of the workhouse boys before the casting of lots?",
      "options": {
        "A": "Content with their chores and eager for evening prayers",
        "B": "Driven by wild, animalistic hunger to the point where one boy threatens to eat his sleeping companion",
        "C": "Organizing a political strike against the parish beadle",
        "D": "Planning an escape across the river into London"
      },
      "correct_answer": "B",
      "explanation": "Dickens realistically depicts extreme starvation: hunger gnaws at their minds until desperate measures become inevitable."
    },
    {
      "item_number": 48,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Mechanics",
      "question": "Why does Antony emphasize that Caesar thrice refused the kingly crown at the Lupercal festival?",
      "options": {
        "A": "To prove that the Roman crown was too small to fit Caesar's head",
        "B": "To dismantle Brutus's core accusation of tyrannical ambition with an undeniable public counter-example",
        "C": "To argue that Antony should be crowned emperor in his place",
        "D": "To show that the festival was disrupted by foreign soldiers"
      },
      "correct_answer": "B",
      "explanation": "The public refusal of the crown provides factual proof that directly challenges Brutus's claim of royal ambition."
    },
    {
      "item_number": 49,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the relationship between mentorship and personal autonomy in 'A Beacon of Light'?",
      "options": {
        "A": "A student must surrender all private judgment to their mentor",
        "B": "True mentorship provides technical skills and moral grounding while empowering the prot\u00e9g\u00e9 to find their own authentic voice",
        "C": "Mentors should demand total financial control over their student's career",
        "D": "Prot\u00e9g\u00e9s should abandon their instructors as soon as commercial fame arrives"
      },
      "correct_answer": "B",
      "explanation": "Ms. Adjei guides Osmond without suppressing his individuality, allowing him to cultivate his own distinctive artistry."
    },
    {
      "item_number": 50,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Gender Theory & Drama",
      "question": "How does Asantewaa's character dismantle the trope of the 'passive female victim' in African rural drama?",
      "options": {
        "A": "She relies on male relatives to confront her rivals",
        "B": "She exercises technical agency, leads scientific initiatives, and defends her project with moral clarity",
        "C": "She refuses to communicate with fellow school pupils",
        "D": "She drops out of school to avoid neighborhood gossip"
      },
      "correct_answer": "B",
      "explanation": "Asantewaa acts as an empowered protagonist who designs technical solutions and confronts injustice directly."
    },
    {
      "item_number": 51,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Spiritual Authority & Politics",
      "question": "Why was Okomfo Anokye's status as a spiritual priest essential to the political unification of the Ashanti state?",
      "options": {
        "A": "He held no military command, so his moral and spiritual authority was trusted as unbiased by competing clan chiefs",
        "B": "He possessed the private financial resources to bribe tribal leaders",
        "C": "He was a foreign emissary appointed by coastal trading merchants",
        "D": "Traditional Akan law barred chiefs from speaking to one another directly"
      },
      "correct_answer": "A",
      "explanation": "His priestly neutrality and spiritual stature allowed him to mediate between rival monarchs without appearing self-serving."
    },
    {
      "item_number": 52,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Synecdoche",
      "question": "In 'The Unseen Painter', how does the 'cuddled child in the sun' function as a synecdoche for human continuity?",
      "options": {
        "A": "It represents an individual pupil enrolled in an infant school",
        "B": "The vulnerable infant in the warm sun represents the entire rising generation nurtured by divine care",
        "C": "It proves that the author was writing a parenting manual",
        "D": "It indicates that the scene was set in a children's medical facility"
      },
      "correct_answer": "B",
      "explanation": "The image of an infant bathed in sunlight serves as a part representing the whole of human generational renewal."
    },
    {
      "item_number": 53,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Sociological Criticism",
      "question": "What does the violent attack on Benson by Ashes Flame reveal about criminal syndicates?",
      "options": {
        "A": "They enforce loyalty through physical violence when an insider attempts to expose their wrongdoing",
        "B": "They dissolve automatically when an adult teacher arrives",
        "C": "They are composed of students who care deeply about school welfare",
        "D": "They operate under written democratic constitutions"
      },
      "correct_answer": "A",
      "explanation": "The assault demonstrates that criminal groups rely on intimidation and violence when their secrecy is threatened."
    },
    {
      "item_number": 54,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Epistemological Synthesis",
      "question": "What boundary does the poet examine in 'Real Illusioned Beckley'?",
      "options": {
        "A": "The geographical border between Ghana and Togo",
        "B": "The fine, porous line separating factual reality from communal myth and collective paranoia",
        "C": "The legal boundary between private real estate and public roads",
        "D": "The linguistic boundary between English and indigenous dialects"
      },
      "correct_answer": "B",
      "explanation": "The poem explores how truth blurs into urban folklore when a community is gripped by fear and suspicion."
    },
    {
      "item_number": 55,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Rhetorical Mechanics",
      "question": "Why does Dickens emphasize the master's turning 'very pale' when Oliver asks for more?",
      "options": {
        "A": "The master suffered from severe biological malnutrition himself",
        "B": "It illustrates his genuine shock that an apprentice would dare breach the unbending barrier of workhouse discipline",
        "C": "The master was terrified that the parish beadle would arrest him",
        "D": "The kitchen was filled with toxic coal smoke from the stoves"
      },
      "correct_answer": "B",
      "explanation": "His physical reaction reflects astonishment: the unbending authoritarian order has been challenged by an orphan."
    },
    {
      "item_number": 56,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Dramatic Irony & Pathos",
      "question": "What is the psychological impact of Antony calling Brutus 'Caesar's angel'?",
      "options": {
        "A": "It proves that Brutus possessed supernatural heavenly powers",
        "B": "It magnifies the horror of Brutus's betrayal, showing that Caesar was struck down by his most trusted friend",
        "C": "It convinces the crowd that Brutus was acting under divine command",
        "D": "It reveals that Brutus was Caesar's biological brother"
      },
      "correct_answer": "B",
      "explanation": "Calling Brutus 'Caesar's angel' emphasizes the personal treachery of the blow, transforming Brutus's defense of honor into treason."
    },
    {
      "item_number": 57,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Cultural Semiotics",
      "question": "How does Osmond's refusal to wear Western concert attire reflect decolonial identity?",
      "options": {
        "A": "He was unable to afford European suits in Accra",
        "B": "Wearing indigenous Kente affirms that African identity and artistry belong proudly on the modern stage",
        "C": "Western garments were prohibited inside the recording studio",
        "D": "He intended to perform a traditional funeral dirge"
      },
      "correct_answer": "B",
      "explanation": "Choosing Kente cloth signals cultural pride and self-worth on a major national platform."
    },
    {
      "item_number": 58,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'Spreading Light' redefine the source of power in a rural Ghanaian community?",
      "options": {
        "A": "Power belongs exclusively to royal bloodlines and political chieftains",
        "B": "True power resides in shared knowledge, technological competence, and communal collaboration",
        "C": "Power is measured by the number of livestock an elder owns",
        "D": "Power belongs to whichever family owns the largest private compound"
      },
      "correct_answer": "B",
      "explanation": "The play shifts power from traditional privilege to practical knowledge and shared innovation."
    },
    {
      "item_number": 59,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "In 'The Golden Stool / Okomfo Anokye', why is the artifact described as uniting 'Ashanti traditions, values, and history'?",
      "options": {
        "A": "It contained written historical records inscribed upon its base",
        "B": "It consolidated oral memory, ancestral reverence, and state sovereignty into an enduring physical emblem",
        "C": "It was used as an educational chalkboard in ancient Kumasi",
        "D": "It served as a boundary stone marking the southern goldfields"
      },
      "correct_answer": "B",
      "explanation": "The Stool serves as a sacred repository where historical memory, ancestral values, and national destiny converge."
    },
    {
      "item_number": 60,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Theological Aesthetics",
      "question": "What does 'The Unseen Painter' conclude about human attempts to divide society by race?",
      "options": {
        "A": "Human racial categorizations are backed by natural law",
        "B": "Prejudices represent narrow human biases that fail to comprehend the intentional, unified beauty of divine artistry",
        "C": "Racial differences will disappear through industrial modernization",
        "D": "Human beings should paint over natural colors to create uniformity"
      },
      "correct_answer": "B",
      "explanation": "The poem observes that human prejudices are small-minded misunderstandings of God's diverse creation."
    },
    {
      "item_number": 61,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "How does the final revitalization of Cedar of Lebanon fulfill the story's title?",
      "options": {
        "A": "The school grounds were painted in alternating black and white patterns",
        "B": "The institution moved past the 'shadow' of corruption and fear into the 'light' of truth, courage, and community renewal",
        "C": "The campus was fitted with imported solar batteries",
        "D": "The students formed an artistic drama club focused on shadow puppetry"
      },
      "correct_answer": "B",
      "explanation": "The resolution brings moral illumination: emerging from the shadow of cabal intimidation into the light of accountability."
    },
    {
      "item_number": 62,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Psychological Analysis",
      "question": "What does 'Real Illusioned Beckley' demonstrate about how rumors impact social cohesion?",
      "options": {
        "A": "Rumors encourage neighbors to organize community athletic clubs",
        "B": "Sensational rumors breed suspicion, isolate households, and erode communal trust",
        "C": "Rumors improve property values across industrial cities",
        "D": "Rumors help law enforcement solve municipal crimes quickly"
      },
      "correct_answer": "B",
      "explanation": "Pervasive gossip turns neighbors suspicious, weakening community solidarity and spreading fear."
    },
    {
      "item_number": 63,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis & Human Dignity",
      "question": "Why does Oliver's simple plea\u2014'I want some more'\u2014resonate as a universal demand for human dignity?",
      "options": {
        "A": "It was an eloquent political speech delivered before Parliament",
        "B": "It asserts the fundamental right of a vulnerable human being to basic survival against systemic institutional cruelty",
        "C": "It proved that parish apprentices were skilled in diplomatic bargaining",
        "D": "It established a legal precedent for commercial restaurant operations"
      },
      "correct_answer": "B",
      "explanation": "Oliver's plea represents a vulnerable child's demand for basic life, exposing the cruelty of institutions that deny food."
    },
    {
      "item_number": 64,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis & Politics",
      "question": "In 'Mark Antony Mourns Caesar', what warning does Shakespeare offer regarding the collapse of political stability?",
      "options": {
        "A": "Assassinating a ruler in the name of liberty often creates a power vacuum that unleashes civil war and worse tyranny",
        "B": "Empires should be governed without formal armies or senators",
        "C": "Public oratory should be banned across marketplace assemblies",
        "D": "Political leaders should rely exclusively on written treatises rather than speeches"
      },
      "correct_answer": "A",
      "explanation": "Shakespeare cautions that violent coups carried out for abstract ideals often unleash civil chaos and deeper despotism."
    },
    {
      "item_number": 65,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Character Foils & Growth",
      "question": "How does Osmond's journey reflect the traditional Ghanaian proverb: 'Wisdom is like a baobab tree; no one individual can embrace it alone'?",
      "options": {
        "A": "By showing that Osmond planted trees in Obane before leaving for Accra",
        "B": "By illustrating that his success was achieved through the collective contributions of mentors, family, and village supporters",
        "C": "By proving that individual singers should avoid studying with teachers",
        "D": "By arguing that rural wisdom is superior to urban university education"
      },
      "correct_answer": "B",
      "explanation": "Osmond's path illustrates interdependence: individual talent flourishes only when supported by community wisdom."
    },
    {
      "item_number": 66,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Literary Mechanics & Dialogue",
      "question": "In Act 4, Scene 2 of 'Spreading Light', how does the dialogue between Asantewaa and Iddrisu reveal their scientific methodology?",
      "options": {
        "A": "They rely on traditional superstitions to diagnose circuit faults",
        "B": "They use precise, empirical terminology\u2014discussing inverters, circuits, and storage\u2014demonstrating rigorous technical problem-solving",
        "C": "They argue over who will sell the equipment to municipal inspectors",
        "D": "They wait for Sir Nii to connect every wire on the board"
      },
      "correct_answer": "B",
      "explanation": "Their dialogue reflects structured scientific inquiry and empirical practice, validating their technical competence."
    },
    {
      "item_number": 67,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Rhyme",
      "question": "What is the artistic significance of rhyming 'calls' with 'celestial halls' in the opening stanza?",
      "options": {
        "A": "It highlights Okomfo Anokye's physical fatigue during prayer",
        "B": "It acoustically connects the human invocation on earth with the divine ancestral realm above",
        "C": "It proves that the poem was translated from Latin scriptures",
        "D": "It signals that the Golden Stool landed inside a stone temple"
      },
      "correct_answer": "B",
      "explanation": "The rhyme acoustically links the earthly priest's voice with the celestial halls of the divine."
    },
    {
      "item_number": 68,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Comparative Literature",
      "question": "How does 'The Unseen Painter' compare with Maya Angelou\u2019s 'Still I Rise' in its social message?",
      "options": {
        "A": "Both focus on agricultural farming techniques in the Caribbean",
        "B": "Both celebrate human dignity, resilience, and the affirmation of diverse racial identity against prejudice",
        "C": "Both poems are written in strict Shakespearean iambic pentameter",
        "D": "Both works criticize modern scientific education in schools"
      },
      "correct_answer": "B",
      "explanation": "Both poems celebrate human dignity and self-worth, rejecting racial prejudice in favor of shared respect."
    },
    {
      "item_number": 69,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Character Psychology",
      "question": "What emotional shift occurs in Benson when Tina Bells refuses to report him to the police immediately?",
      "options": {
        "A": "He feels contempt and plans to rob her family residence",
        "B": "Her grace and belief in his capacity for reform disarm his defenses, inspiring genuine remorse and moral renewal",
        "C": "He leaves Kansas to enroll in a coastal academy",
        "D": "He demands that Nkrabea promote him to supreme leader of Ashes Flame"
      },
      "correct_answer": "B",
      "explanation": "Her restorative response awakens his conscience, proving that grace can inspire change where punishment fails."
    },
    {
      "item_number": 70,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What does the ending of 'Real Illusioned Beckley' suggest about human memory and fear?",
      "options": {
        "A": "Childhood memories fade completely once individuals leave their hometown",
        "B": "Deep-seated childhood anxieties remain etched in human consciousness, leaving lingering unease even in adulthood",
        "C": "Legal investigations always resolve psychological trauma in communities",
        "D": "Industrial cities are naturally free from irrational fears"
      },
      "correct_answer": "B",
      "explanation": "The closing lines show that early experiences of fear leave enduring psychological impressions."
    },
    {
      "item_number": 71,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective & Irony",
      "question": "How does Dickens use dramatic irony when Mr. Bumble informs Mrs. Mann that Oliver's name was chosen alphabetically?",
      "options": {
        "A": "It highlights his deep intellectual erudition and historical scholarship",
        "B": "It exposes bureaucratic detachment: children are named off an arbitrary list rather than treated as individuals with identity and family",
        "C": "It proves that Oliver was descended from aristocratic royalty",
        "D": "It shows that the workhouse maintained detailed ancestral archives"
      },
      "correct_answer": "B",
      "explanation": "Alphabetical naming exposes bureaucratic coldness: orphans are treated as numbers and letters rather than human beings."
    },
    {
      "item_number": 72,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Hegemony",
      "question": "How does Antony's use of hyperbole ('even the stones of Rome would rise for a revolution') inflame the plebeians?",
      "options": {
        "A": "He implies that ancient Roman masonry possessed magical physical life",
        "B": "He suggests that Caesar's murder was so unnatural and monstrous that even inanimate matter would rebel, validating the mob's fury",
        "C": "He orders the commoners to dismantle the forum stone steps",
        "D": "He warns the crowd that an earthquake was approaching the city"
      },
      "correct_answer": "B",
      "explanation": "Suggesting that stones would mutiny frames the assassination as an unnatural outrage that demands collective vengeance."
    },
    {
      "item_number": 73,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Sociological Insight",
      "question": "How does the novella bridge the divide between traditional Ghanaian community values and modern urban capitalism?",
      "options": {
        "A": "By showing that artists must reject all traditional relationships to become successful entrepreneurs",
        "B": "By illustrating that commercial success in urban markets finds its highest purpose when used to support rural communities",
        "C": "By proving that highlife music cannot be sold commercially in modern cities",
        "D": "By arguing that recording companies should be managed by traditional village elders"
      },
      "correct_answer": "B",
      "explanation": "The story reconciles both worlds: commercial success in the capital is used to lift up his rural home community."
    },
    {
      "item_number": 74,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the symbolic meaning of Sir Nii stating: 'You children are like lights as well!' in Act 6?",
      "options": {
        "A": "The pupils were holding illuminated electric torches on stage",
        "B": "The students' intellect, integrity, and innovation illuminate the village, driving away ignorance and underdevelopment",
        "C": "The school curriculum was restricted to electrical physics",
        "D": "The classroom building was fitted with glass windows"
      },
      "correct_answer": "B",
      "explanation": "The simile equates the children's knowledge, character, and problem-solving to lights guiding their community forward."
    },
    {
      "item_number": 75,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Cultural & Political Philosophy",
      "question": "How does the poem present the Golden Stool as an instrument of conflict resolution?",
      "options": {
        "A": "It allowed the paramount king to execute rival chiefs without trial",
        "B": "By serving as a collective sacred emblem belonging to all clans, it dissolved local rivalries in favor of shared national identity",
        "C": "It was traded for peace agreements with coastal tribes",
        "D": "It established a permanent military garrison in Kumasi"
      },
      "correct_answer": "B",
      "explanation": "The Stool served as a shared sacred trust that brought warring factions together into a unified commonwealth."
    },
    {
      "item_number": 76,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis & Craft",
      "question": "What does the phrase 'No single brushstroke claims the light' convey about social justice?",
      "options": {
        "A": "Individual painters should avoid using bright white oils",
        "B": "No single race, ethnic group, or social class holds a monopoly on human dignity, truth, or divine favor",
        "C": "The universe was created without primary colors",
        "D": "Human societies should ban individual artistic exhibitions"
      },
      "correct_answer": "B",
      "explanation": "The line asserts equality: no single group can claim superiority on the shared canvas of creation."
    },
    {
      "item_number": 77,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Institutional Renewal",
      "question": "In 'Beyond Light and Shadow', how does the community's involvement in school affairs seal the defeat of Ashes Flame?",
      "options": {
        "A": "Parents formed vigilante squads that guarded classroom doors with weapons",
        "B": "The breakdown of secrecy and the restoration of parent-school partnership dismantled the isolated environment the cabal relied on",
        "C": "Parents transferred all their children to Kansas private academies",
        "D": "The school was sold to commercial real estate developers"
      },
      "correct_answer": "B",
      "explanation": "Community transparency eliminated the shadows of fear and secrecy where extortion had flourished."
    },
    {
      "item_number": 78,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Metaphor",
      "question": "How does the metaphor of the 'gray and smoky sky' reflect the psychological mood of the community?",
      "options": {
        "A": "It records the meteorological arrival of the rainy season",
        "B": "The somber, obscured sky mirrors moral ambiguity, uncertainty, and the cloud of dread hanging over the neighborhood",
        "C": "It proves that factory emissions had violated national air quality laws",
        "D": "It indicates that the residents relied on wood stoves for cooking"
      },
      "correct_answer": "B",
      "explanation": "The smoky, overcast sky externalizes the community's internal unease and moral confusion."
    },
    {
      "item_number": 79,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Sociological Criticism & Class",
      "question": "Why does the gentleman in the white waistcoat insist that Oliver 'will come to be hung'?",
      "options": {
        "A": "Oliver had stolen parish silver from Mr. Limbkins' desk",
        "B": "His prejudice equates poverty and non-compliance with inherent criminality that inevitably ends upon the gallows",
        "C": "Oliver was known to belong to a gang of London pickpockets",
        "D": "Parish law prescribed the death penalty for wasting gruel"
      },
      "correct_answer": "B",
      "explanation": "His reaction exposes Victorian class prejudice, which treated an orphan's cry for food as proof of criminal nature."
    },
    {
      "item_number": 80,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Rhetorical Analysis",
      "question": "How does Antony turn Caesar's refusal of the crown into proof that Brutus lied?",
      "options": {
        "A": "By arguing that ambitious tyrants seize crowns eagerly, whereas Caesar's threefold public refusal proved he served Rome humbly",
        "B": "By claiming that Brutus had secretly crowned himself in the Senate House",
        "C": "By showing that the Roman crown had been melted down into gold coins",
        "D": "By proving that Antony had forced the crown upon Caesar against his will"
      },
      "correct_answer": "A",
      "explanation": "Antony uses the refusal to dismantle Brutus's case: ambitious tyrants seize crowns, but Caesar turned it down three times."
    },
    {
      "item_number": 81,
      "text": "A Beacon of Light",
      "strand": "Prose",
      "sub_strand": "Literary Pathos & Music",
      "question": "How does the performance of 'Someone to Lean On' evoke pathos in the audience?",
      "options": {
        "A": "By describing graphic scenes of physical destruction in Obane",
        "B": "By giving voice to the vulnerability, loneliness, and mutual dependence of ordinary people, moving the audience to empathy",
        "C": "By incorporating funeral dirges into contemporary highlife rhythms",
        "D": "By criticizing the audience for neglecting rural village schools"
      },
      "correct_answer": "B",
      "explanation": "The song's themes of companionship and shared burdens touch on vulnerability, evoking sincere empathy."
    },
    {
      "item_number": 82,
      "text": "Spreading Light",
      "strand": "Drama",
      "sub_strand": "Dramaturgy & Climax",
      "question": "What is the theatrical impact of Sir Nii producing the recovered solar inverter in Act 5?",
      "options": {
        "A": "It serves as the physical proof that ends debate, silences Kwansah's denials, and establishes justice",
        "B": "It causes an electrical short circuit that plunges the stage into darkness",
        "C": "It proves that the equipment was manufactured in Kumasi",
        "D": "It prompts the village chief to banish Sir Nii from the district"
      },
      "correct_answer": "A",
      "explanation": "Producing the stolen inverter provides undeniable proof, resolving the conflict and vindicating Asantewaa."
    },
    {
      "item_number": 83,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Register",
      "question": "How does the elevated, archaic diction ('he calls', 'celestial halls') reinforce the poem's theme?",
      "options": {
        "A": "It shows that the poet was unable to speak contemporary English",
        "B": "It lends the verse epic dignity, matching the sacred historical legend of Okomfo Anokye",
        "C": "It makes the text intentionally difficult for school pupils to read",
        "D": "It proves that the poem was composed during the 17th century"
      },
      "correct_answer": "B",
      "explanation": "Elevated diction establishes formal majesty, honoring the sacred legend and spiritual history of the Ashanti nation."
    },
    {
      "item_number": 84,
      "text": "The Unseen Painter",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the moral obligation placed upon humanity by the imagery of 'The Unseen Painter'?",
      "options": {
        "A": "To master classical oil painting techniques in secondary schools",
        "B": "To respect, cherish, and protect the harmony and diversity of creation rather than deface it through hatred and bias",
        "C": "To build astronomical observatories across every city",
        "D": "To ensure that all architectural buildings are painted white"
      },
      "correct_answer": "B",
      "explanation": "Viewing the world as divine art obligates humanity to care for creation and respect all people."
    },
    {
      "item_number": 85,
      "text": "Beyond Light and Shadow",
      "strand": "Prose",
      "sub_strand": "Redemptive Philosophy",
      "question": "Why is Benson allowed to remain at Cedar of Lebanon after confessing his crimes?",
      "options": {
        "A": "His parents offered a large financial donation to the library",
        "B": "Mrs. Acquah believes in restorative justice, recognizing that true institutional renewal transforms offenders into moral leaders",
        "C": "The school lacked sufficient prefects to replace him",
        "D": "Nkrabea threatened to sue the school board if Benson was expelled"
      },
      "correct_answer": "B",
      "explanation": "Restorative justice focuses on rehabilitation: guiding a remorseful student to repair harm rather than discarding him."
    },
    {
      "item_number": 86,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry",
      "sub_strand": "Psychological Insight",
      "question": "In 'Real Illusioned Beckley', how does the secluded estate function as a projection of collective guilt?",
      "options": {
        "A": "The residents blamed the mansion for the city\u2019s economic industrial pollution",
        "B": "The community projected its own unacknowledged anxieties, moral failures, and dark suspicions onto the mysterious, silent house",
        "C": "The house was built upon ancient ancestral burial grounds",
        "D": "The owner had sued the town council for unpaid road debts"
      },
      "correct_answer": "B",
      "explanation": "The mysterious house becomes a screen upon which the community projects its own hidden fears and anxieties."
    },
    {
      "item_number": 87,
      "text": "Oliver Asks for More",
      "strand": "Prose",
      "sub_strand": "Tone & Ideology",
      "question": "What is Dickens' underlying tone toward the parish board throughout Chapter 2?",
      "options": {
        "A": "Deferential and admiring of their financial thrift",
        "B": "Bitterly satirical, scornful, and morally indignant toward their institutionalized cruelty",
        "C": "Neutral, objective, and detached from human emotion",
        "D": "Lighthearted, gentle, and forgiving of their human errors"
      },
      "correct_answer": "B",
      "explanation": "Dickens writes with biting moral indignation, using satire to expose the hypocrisy of the parish authorities."
    },
    {
      "item_number": 88,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis & Mob Rule",
      "question": "What does the violent aftermath of Antony\u2019s oration illustrate about mob mentality?",
      "options": {
        "A": "An aroused crowd acts with careful judicial deliberation",
        "B": "When swayed by emotional demagoguery, an inflamed mob acts with destructive, irrational fury, abandoning reason and justice",
        "C": "The plebeians joined the Roman Senate to establish a democratic republic",
        "D": "Crowds naturally disperse peacefully once a funeral concludes"
      },
      "correct_answer": "B",
      "explanation": "The scene shows how an inflamed crowd sheds reason, turning into a destructive mob driven by blind vengeance."
    },
    {
      "item_number": 89,
      "text": "Comparative Literature: The Unseen Painter & The Golden Stool",
      "strand": "Comparative Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "How do both 'The Unseen Painter' and 'The Golden Stool / Okomfo Anokye' treat the relationship between heaven and earth?",
      "options": {
        "A": "Both view heaven as detached and indifferent to human suffering",
        "B": "Both depict the divine realm as actively intervening in human history to establish order, beauty, and national cohesion",
        "C": "Both argue that material science has made spiritual belief obsolete",
        "D": "Both were composed to celebrate maritime trading treaties"
      },
      "correct_answer": "B",
      "explanation": "Both poems portray the divine as purposeful, weaving order, beauty, and unity into the fabric of earthly life."
    },
    {
      "item_number": 90,
      "text": "Comparative Literature: Spreading Light & Beyond Light and Shadow",
      "strand": "Comparative Literature",
      "sub_strand": "Institutional Renewal",
      "question": "What shared truth regarding institutional change unites 'Spreading Light' and 'Beyond Light and Shadow'?",
      "options": {
        "A": "Change is accomplished solely through massive foreign financial loans",
        "B": "Reforming corrupt or neglected systems requires moral courage, transparent exposure of deceit, and collaborative youth action",
        "C": "Traditional schools should be abandoned in favor of home tutoring",
        "D": "Student leadership should operate without adult mentorship"
      },
      "correct_answer": "B",
      "explanation": "Both narratives show that reforming broken institutions requires courage, uncovering the truth, and youth initiative."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "A Beacon of Light",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "Ms. Adjei switched off the red studio recording lamp and stepped into the vocal booth. 'You sang with your heart, Osmond, but remember this: the microphone does not just catch the pitch; it catches your conviction. If you sing thinking only of escaping Obane, you are an exile. If you sing bringing Obane with you into the city, you are an ambassador.' Osmond looked down at his shoes, then out through the glass window where the skyline of Accra rose against the evening sky. A quiet warmth filled his chest.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct the distinction Ms. Adjei makes between an 'exile' and an 'ambassador'.",
          "marks": 3,
          "expected_answer": "An exile flees their origins out of shame, resentment, or a desire to erase their past. An ambassador carries the dignity, cultural roots, and collective story of their community with pride onto the wider stage."
        },
        {
          "label": "(b)",
          "question": "Analyze the symbolic function of the red studio recording lamp in this scene.",
          "marks": 2,
          "expected_answer": "It marks the transition between raw creative performance under high-pressure scrutiny and the intimate, reflective space of mentorship and moral grounding."
        },
        {
          "label": "(c)",
          "question": "Explain the significance of the visual contrast between Osmond's shoes and the rising skyline of Accra.",
          "marks": 3,
          "expected_answer": "Looking down at his shoes grounds him in his humble rural beginnings, while looking up at the Accra skyline visualizes his rising future, creating a tension between his modest roots and his national potential."
        },
        {
          "label": "(d)",
          "question": "What emotional shift is marked by the 'quiet warmth' filling his chest?",
          "marks": 2,
          "expected_answer": "It marks the resolution of his internal conflict: moving from self-doubt and fear of rural inadequacy to grounded cultural pride and artistic self-assurance."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Spreading Light",
      "strand": "Drama Extract & Advanced Critical Appreciation",
      "extract": "KWANSAH\u2019S MOTHER: (Standing with arms tightly folded, her voice sharp) Why do you bring town gossip to my threshold, Sir Nii? My son is a respectable boy. If someone dropped broken glass and scrap metal behind my pen, does that make him a thief?\nSIR NII: (Quietly, unrolling the copper harness bearing the school seal) This is not scrap metal, Madam. This is the wiring Asantewaa measured with her own compass. When an elder shields a crime under the guise of maternal love, she does not protect her child; she digs a pit for his future.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Analyze the semiotic meaning of Kwansah's mother standing with 'arms tightly folded'.",
          "marks": 2,
          "expected_answer": "It visually physicalizes emotional resistance, defensive denial, and a closed moral posture, showing her determination to shield her son from accountability."
        },
        {
          "label": "(b)",
          "question": "How does Sir Nii use the copper harness bearing the school seal as dramatic evidence?",
          "marks": 3,
          "expected_answer": "The stamped seal provides undeniable material proof that dismantles her dismissive claim that the stolen equipment was mere scrap metal."
        },
        {
          "label": "(c)",
          "question": "Deconstruct Sir Nii\u2019s metaphor: 'she digs a pit for his future'.",
          "marks": 3,
          "expected_answer": "It equates enabling misconduct to excavating a snare or grave, warning that blind parental indulgence sets a child up for moral ruin and disaster."
        },
        {
          "label": "(d)",
          "question": "Contrast the communication styles of Kwansah's mother and Sir Nii in this exchange.",
          "marks": 2,
          "expected_answer": "Kwansah's mother speaks with shrill deflection, aggression, and denial, while Sir Nii responds with quiet composure, evidence, and moral authority."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "The Golden Stool / Okomfo Anokye",
      "strand": "Poetry Extract & Advanced Critical Appreciation",
      "extract": "The Golden Stool descends through twilight's hush,\nA sacred bond no earthly sword can crush;\nA treasure trove, of stories yet untold,\nForging a nation in its shining gold.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Examine the philosophical assertion that the bond forged by the Stool is one 'no earthly sword can crush'.",
          "marks": 3,
          "expected_answer": "It affirms that cultural identity and spiritual unity are deeper than physical warfare; while armies can be broken, shared ancestral consciousness cannot be crushed by force."
        },
        {
          "label": "(b)",
          "question": "Analyze the symbolic function of 'twilight's hush' in framing the miracle of the Stool's descent.",
          "marks": 3,
          "expected_answer": "Twilight represents a liminal threshold where the physical world meets the spiritual realm; the hush creates sacred silence fitting for divine intervention."
        },
        {
          "label": "(c)",
          "question": "How does the Stool function both as a material object and as a metaphysical symbol of Ashanti sovereignty?",
          "marks": 2,
          "expected_answer": "Physically, it is an artifact carved of wood and encased in gold; metaphysically, it houses the collective soul (*Sunsum*) and unity of the nation."
        },
        {
          "label": "(d)",
          "question": "State the rhyme scheme of this stanza and comment on its rhythmic dignity.",
          "marks": 2,
          "expected_answer": "AABB (hush/crush, untold/gold); the paired heroic couplet creates a stately, memorable cadence suitable for a national anthem."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "The Unseen Painter",
      "strand": "Poetry Extract & Advanced Critical Appreciation",
      "extract": "No single brushstroke claims the light,\nNo pigment owns the frame;\nEach soul a deliberate tint,\nTo glorify His name.\nIn the vast gallery of earth,\nWhere varied forms reside,\nThe Painter mocks our petty walls,\nAnd shames our racial pride.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct the metaphor 'The Painter mocks our petty walls'.",
          "marks": 3,
          "expected_answer": "It personifies the Creator as rejecting man-made boundaries of race, caste, and ethnicity, showing that human divisions contradict the unity of creation."
        },
        {
          "label": "(b)",
          "question": "Analyze the philosophical argument embedded in 'No single brushstroke claims the light'.",
          "marks": 3,
          "expected_answer": "It asserts equality among all cultures and races; no single group can claim superiority or an exclusive monopoly on human dignity."
        },
        {
          "label": "(c)",
          "question": "What is the poetic effect of calling human skin tones 'deliberate tints'?",
          "marks": 2,
          "expected_answer": "The word 'deliberate' emphasizes purposeful divine craftsmanship, affirming that racial diversity is intentional and valuable rather than accidental."
        },
        {
          "label": "(d)",
          "question": "Identify the tone of the speaker toward racial discrimination in these lines.",
          "marks": 2,
          "expected_answer": "Scornful of human arrogance, morally indignant, and celebratory of universal diversity."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "Beyond Light and Shadow",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "MRS. ACQUAH: (Placing both hands firmly on the conference table, addressing the assembly) You built this school with mortar and stone, but you allowed fear to rot the roof. When Nkrabea pays a boy to break a window, he is not buying glass; he is buying your silence. Today, the silence ends. My daughter sits in class 3A. If Cedar of Lebanon burns, she burns with it.\nBENSON: (Stepping out from behind the screen, head bowed, voice trembling) It will not burn, Nana. Not while I still draw breath.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct Mrs. Acquah's metaphor: 'You built this school with mortar and stone, but you allowed fear to rot the roof'.",
          "marks": 3,
          "expected_answer": "She contrasts physical construction with moral foundation: physical walls are useless if an institution's moral integrity is eroded by cowardice and fear."
        },
        {
          "label": "(b)",
          "question": "Analyze Mrs. Acquah's statement\u2014'If Cedar of Lebanon burns, she burns with it'\u2014as a model of transformative leadership.",
          "marks": 3,
          "expected_answer": "She exercises leadership through personal stake; by placing her daughter inside the troubled student body, she shares the community's risks directly."
        },
        {
          "label": "(c)",
          "question": "What is the psychological turning point marked by Benson stepping out from behind the screen?",
          "marks": 2,
          "expected_answer": "It visualizes his exit from the shadows of secrecy and cabal complicity into the open light of accountability, truth, and redemption."
        },
        {
          "label": "(d)",
          "question": "What role does adult corruption play in sustaining the student cabal, as exposed in Mrs. Acquah's speech?",
          "marks": 2,
          "expected_answer": "She exposes that student delinquency was funded and directed by adult benefactors like Nkrabea, who profited from campus extortion."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Real Illusioned Beckley",
      "strand": "Poetry Extract & Advanced Critical Appreciation",
      "extract": "The high-tension zone buzzed like an angry wasp,\nWhere childhood joy slipped through our trembling grasp.\nThe quiet house stood tall, an island in the grass,\nWhere whispers spoke of horrors that never came to pass,\nOr did they? In the shadows, the boundary lines were blurred,\nAnd truth was just a phantom in every spoken word.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the simile in the opening line and explain its atmospheric effect.",
          "marks": 2,
          "expected_answer": "'buzzed like an angry wasp' compares electrical cables to an aggressive insect, establishing tension and underlying danger."
        },
        {
          "label": "(b)",
          "question": "Analyze the philosophical question\u2014'Or did they?'\u2014in relation to urban legend dynamics.",
          "marks": 3,
          "expected_answer": "It captures the ambiguity of folklore: the speaker cannot fully separate historical fact from communal hysteria, showing how fear blurs memory."
        },
        {
          "label": "(c)",
          "question": "Explain the metaphor 'truth was just a phantom in every spoken word'.",
          "marks": 3,
          "expected_answer": "It equates truth to a ghost, conveying that constant gossip and sensational rumors make objective reality elusive and intangible."
        },
        {
          "label": "(d)",
          "question": "What does the description of the house as 'an island in the grass' symbolize?",
          "marks": 2,
          "expected_answer": "It symbolizes isolation, secrecy, and detachment from the surrounding neighborhood."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Oliver Asks for More",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "'That boy will be hung,' said the gentleman in the white waistcoat. 'I know that boy will be hung.'\n'Nobody can doubt it,' responded Mr. Limbkins. 'He has a reckless, savage look. If he stays here another fortnight, he will corrupt the entire establishment.'\n'Send him away,' whispered the master, holding his bruised knuckles. 'He asked for food as if it were his right to eat!'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct the master's indignant complaint: 'He asked for food as if it were his right to eat!'",
          "marks": 3,
          "expected_answer": "It exposes the cruelty of the workhouse system, which views basic nutrition for poor children as an unearned privilege rather than an essential human right."
        },
        {
          "label": "(b)",
          "question": "Examine the characterization of the gentleman in the white waistcoat as an archetype of Victorian class cruelty.",
          "marks": 3,
          "expected_answer": "He represents the callousness of the wealthy elite, who view poor children as born criminals destined for the gallows without regard for their suffering."
        },
        {
          "label": "(c)",
          "question": "Analyze the irony in Mr. Limbkins' claim that Oliver 'has a reckless, savage look'.",
          "marks": 2,
          "expected_answer": "The irony lies in calling a frail, emaciated, and polite nine-year-old orphan 'savage,' projecting the board's own institutional cruelty onto the child."
        },
        {
          "label": "(d)",
          "question": "How does Dickens use dialogue here to advance his social satire?",
          "marks": 2,
          "expected_answer": "The self-righteous dialogue exposes the authorities' hypocrisy, allowing their own words to condemn their cruelty to the reader."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "Mark Antony Mourns Caesar",
      "strand": "Drama Extract & Advanced Critical Appreciation",
      "extract": "ANTONY: (Pointing down to the rent in the mantle) Look, in this place ran Cassius' dagger through:\nSee what a rent the envious Casca made:\nThrough this the well-beloved Brutus stabb'd;\nAnd as he pluck'd his cursed steel away,\nMark how the blood of Caesar follow'd it,\nAs rushing out of doors, to be resolv'd\nIf Brutus so unkindly knock'd, or no;\nFor Brutus, as you know, was Caesar's angel:\nJudge, O you gods, how dearly Caesar loved him!\nThis was the most unkindest cut of all;",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Examine the personification of Caesar's blood 'rushing out of doors'.",
          "marks": 3,
          "expected_answer": "Caesar's blood is personified as a host rushing to the doorway in disbelief to see whether his trusted friend Brutus was truly striking the blow."
        },
        {
          "label": "(b)",
          "question": "Why does Antony declare Brutus's wound to be 'the most unkindest cut of all'?",
          "marks": 3,
          "expected_answer": "Because the emotional blow of betrayal from a loved friend wounded Caesar deeper than the physical daggers of his enemies, breaking his heart."
        },
        {
          "label": "(c)",
          "question": "How does Antony's naming of individual conspirators (Cassius, Casca, Brutus) manipulate the plebeians?",
          "marks": 2,
          "expected_answer": "It personalizes the crime, turning abstract republican ideals into specific acts of bloody betrayal that direct the mob's vengeance against named targets."
        },
        {
          "label": "(d)",
          "question": "Identify the grammatical device in 'most unkindest' and explain its rhetorical function.",
          "marks": 2,
          "expected_answer": "Double superlative; Shakespeare uses it to heighten emotional impact, emphasizing that Brutus's betrayal was cruel beyond comparison."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "Comparative Literature: Classical & Contemporary Rhetoric",
      "strand": "Comparative Drama",
      "extract": "TEXT 1 (Mark Antony Mourns Caesar):\n'ANTONY: Friends, Romans, countrymen, lend me your ears; I come to bury Caesar, not to praise him. The evil that men do lives after them; the good is oft interred with their bones.'\n\nTEXT 2 (Spreading Light):\n'SIR NII: Fellow villagers, look at these panels. They were built by the hands of your own children. If you smash them because an envious boy whispered lies, you smash your own grandchildren's light.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Compare the rhetorical strategies used by Antony in Text 1 and Sir Nii in Text 2 to capture their audiences' attention.",
          "marks": 3,
          "expected_answer": "Antony disarms a hostile crowd through false humility and parallel antithesis ('bury Caesar, not to praise him'). Sir Nii challenges his village audience directly, appealing to parental duty and community legacy."
        },
        {
          "label": "(b)",
          "question": "How do both speakers link material objects to communal memory?",
          "marks": 4,
          "expected_answer": "Antony links Caesar's body and will to civic betrayal and gratitude. Sir Nii links the solar panels to community progress and the future of their grandchildren."
        },
        {
          "label": "(c)",
          "question": "Contrast the moral outcome of Antony's rhetoric with that of Sir Nii's.",
          "marks": 3,
          "expected_answer": "Antony's speech incites a mob to mutiny and civil war. Sir Nii's speech restores harmony, exposes deceit, and unites the community in support of innovation."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis: Critical Literary Theory & BECE Paper 2",
      "strand": "Comprehensive BECE Paper 2 Essay Methodology",
      "extract": "At the advanced BECE level, students must apply critical frameworks (such as Character Trajectory, Thematic Synthesis, and Discourse Analysis) to evaluate literature.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Using the Point-Evidence-Explanation (P-E-E) model, write an analytical paragraph comparing the moral redemption of Benson in 'Beyond Light and Shadow' with Prince Dawuni in 'Dawuni\u2019s Dream'.",
          "marks": 4,
          "expected_answer": "Point: Both Benson and Prince Dawuni illustrate that moral redemption requires confronting past weaknesses and choosing restorative service over self-indulgence. Evidence: Benson defects from Ashes Flame and hands over the cabal's records to Mrs. Acquah, while Prince Dawuni renounces alcohol, listens to Alheri and Anfani, and leads the rain rites. Explanation: Both arcs show that redemption is an active moral choice that replaces guilt with accountability and service."
        },
        {
          "label": "(b)",
          "question": "Evaluate how 'Oliver Asks for More' and 'Forest Gold' address systemic socio-economic exploitation.",
          "marks": 3,
          "expected_answer": "'Oliver Asks for More' critiques institutional cruelty that starves paupers under the guise of welfare. 'Forest Gold' critiques predatory mining that devastates rural rivers for commercial gain. Both warn against prioritizing profit over human life."
        },
        {
          "label": "(c)",
          "question": "State three advanced essay-writing standards examiners look for on BECE Paper 2 when awarding Grade 1 distinction marks.",
          "marks": 3,
          "expected_answer": "1. Nuanced thesis statements that move beyond simple plot summary. 2. Accurate textual citations of literary devices and character motives. 3. Synthesizing literary analysis with broader sociological and philosophical themes."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB9Advanced() {
  console.log("Seeding Basic 9 Advanced Practice Lab (100 Items) for The Beacon of Light...");
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
      id: `B9_BL_A_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "advanced",
      category: `${item.strand} Critical Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Apply advanced critical theories (Malthusian critique, post-colonial epistemology, speech act theory, and psychological duality) to analyze '${item.text}'.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Critically evaluate complex literary themes, philosophies, and authorial craft across prescribed The Beacon of Light texts (${item.text}), evaluating sociopolitical subtexts, performative rhetoric, institutional pathology, and theatrical blocking.`
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

    const promptText = `📖 PRESCRIBED TEXT EXTRACT:\n"${item.extract}"\n— ${item.text}\n\n❓ ADVANCED CRITICAL APPRECIATION & ESSAY SYNTHESIS (Total: ${item.total_marks} Marks):${subQuestionsFormatted}`;

    allItems.push({
      id: `B9_BL_A_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B9",
      difficulty: "advanced",
      category: `${item.strand}`,
      title: `${item.text} - Advanced Critical Appreciation`,
      shortSummary: `In-depth extract evaluation, comparative synthesis, and BECE Paper 2 essay methodology for '${item.text}' (10 Marks).`,
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
            displayName: "Critical Analysis & Textual Mastery",
            maxMarks: 5,
            scoringGuidelines: item.sub_questions.map((sq: any) => `${sq.label} ${sq.question} (${sq.marks}m)`),
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Thoroughly answers ${sq.label} using sophisticated textual citations and analysis`)
          },
          expression: {
            name: "expression",
            displayName: "Philosophical Depth, P-E-E Synthesis & Literary Register",
            maxMarks: 5,
            scoringGuidelines: ["Mastery of advanced literary devices (paralipsis, personification, double superlative, speech act irony, synecdoche)", "Point-Evidence-Explanation (P-E-E) synthesis and pristine academic prose"],
            diagnosticChecklist: ["Demonstrates exceptional critical synthesis, theoretical fluency, and adherence to WAEC BECE Paper 2 standard conventions"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Apply advanced literary critique, exploring structural craft, symbolic resonance, character foils, and thematic synthesis in '${item.text}'.`,
      competencyTarget: `${item.strand}: Advanced Critical Appreciation & Essay Synthesis`,
      learningCompetency: `B9.2.2.1 / B9.2.3.1: Critically evaluate complex literary excerpts from The Beacon of Light across poetry, drama, and prose, applying the P-E-E essay model, analyzing philosophical subtexts, gender dynamics, and classical/modern comparative rhetoric.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B9",
    difficulty: "advanced",
    title: "Basic 9 Literature Diagnostic Assessment Lab: The Beacon of Light (Advanced Tier - 100 Items)",
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
          id: `B9_BL_A_TH_${t.item_number}`,
          title: `${t.text} - Advanced Critical Appreciation`,
          category: t.strand,
          shortSummary: `Extract critique, rhetorical analysis, and advanced synthesis of ${t.text}`
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B9_advanced`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // 2. Ensure parent document practicePool has clean container for B9 to prevent 1MB overflow & update total count to 730
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        totalPracticeQuestions: 730, // B7: 130 + B8: 300 + B9: 300
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

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B9 Advanced Lab!`);
}

seedBeaconOfLightB9Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Advanced Lab:", err);
    process.exit(1);
  });
