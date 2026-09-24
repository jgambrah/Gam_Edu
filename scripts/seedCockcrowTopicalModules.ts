import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
    }
  } catch (e) {
    console.warn("OAuth fallback failed, trying default admin credential:", e);
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

const cockcrowAnthologyPayload = {
  topicId: "cockcrow_literary_devices",
  subjectId: "english",
  strandId: "strand_2_reading_literature",
  strandName: "STRAND 2: READING & LITERATURE",
  subStrandTitle: "The Cockcrow Anthology & Literary Devices",
  topicTitle: "Prose, Drama & Poetry Analysis",
  summary: "Comprehensive NaCCA-aligned study notes covering literary devices, prose analysis of prescribed Cockcrow short stories ('The Girl Who Can', 'A Day's Wait'), novella dissection (Charles Dickens' 'Oliver Twist'), dramatic analysis (Ama Ata Aidoo's 'The Dilemma of a Ghost'), and prescribed poetry across Basic 7 to Basic 9.",
  gradeLevels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
  curriculumIndicators: ["B7.2.2.1", "B7.2.3.1", "B8.2.2.1", "B8.2.3.1", "B9.2.2.1", "B9.2.3.1"],

  // -------------------------------------------------------------------------
  // MODULAR CONCEPT NOTES (DETAILED JHS 1 TO JHS 3 ACCORDING TO NACCA STANDARDS)
  // -------------------------------------------------------------------------
  conceptNotes: {
    // -----------------------------------------------------------------------
    // SECTION 0: THE MASTER LITERARY DEVICES TOOLKIT (B7 - B9 UNIVERSAL FOUNDATION)
    // -----------------------------------------------------------------------
    section0_literary_toolkit: {
      title: "Master Literary Devices & Figures of Speech Toolkit",
      description: "Essential technical terminology and analytical frameworks for dissecting Prose, Drama, and Poetry in BECE examinations.",
      figuresOfComparisonAndAssociation: [
        {
          term: "Simile",
          definition: "An explicit comparison between two fundamentally dissimilar entities using comparative markers such as 'like' or 'as'.",
          example: "'His voice cut through the silence like a sharp cutlass.'",
          diagnosticTest: "Look for 'like' or 'as' directly establishing the comparative bridge."
        },
        {
          term: "Metaphor",
          definition: "An implicit, direct equation of two unrelated entities without comparative markers, asserting that one entity is another.",
          example: "'The classroom was a tempestuous ocean of rebellious whispers.'",
          diagnosticTest: "Ask: Is entity A directly asserted to BE entity B without 'like' or 'as'?"
        },
        {
          term: "Personification",
          definition: "Attributing human qualities, psychological motives, emotions, or bodily movements to inanimate objects, animals, or abstract concepts.",
          example: "'The fierce drought strangled the dying cocoa seedlings.'",
          diagnosticTest: "Is an inanimate object or natural element performing an intentional human action?"
        },
        {
          term: "Apostrophe",
          definition: "A direct rhetorical address to an absent individual, a deceased ancestor, or an abstract personified entity as if it were present and listening.",
          example: "'O ancestral spirits of Hasodzi, why have you endowed our daughter with such spindly legs?'",
          diagnosticTest: "Look for an emotional address ('O...', 'Thou...') to someone or something incapable of physical reply."
        },
        {
          term: "Metonymy",
          definition: "Substituting the name of an attribute, constituent feature, or associated adjunct for the institution or entity meant.",
          example: "'The Golden Stool issued a royal decree to the paramount chiefs.' (Here, 'Golden Stool' represents the Asantehene/Monarch).",
          diagnosticTest: "Is a closely associated symbol or object representing the broader authority or institution?"
        },
        {
          term: "Synecdoche",
          definition: "A figure of speech in which a part is made to represent the whole, or conversely, the whole is made to represent a part.",
          example: "'All hands were summoned to the fishing canoe.' (Here, 'hands' represents the complete fishermen).",
          diagnosticTest: "Is a physical body part or constituent slice used to denote the entire human being or entity?"
        },
        {
          term: "Hyperbole",
          definition: "Deliberate, dramatic overstatement or extravagant exaggeration used to heighten emotional impact or create rhetorical emphasis.",
          example: "'Nana wept oceans of bitter tears over Adjoa's spindly legs.'",
          diagnosticTest: "Is the statement physically impossible or absurdly exaggerated for dramatic emphasis?"
        },
        {
          term: "Litotes (Understatement)",
          definition: "An ironic understatement in which an affirmative assertion is expressed by negating its contrary.",
          example: "'Winning the inter-district athletic trophy was no small achievement for the village.'",
          diagnosticTest: "Look for negative constructions ('no small', 'not unfamiliar') asserting an affirmative accomplishment."
        }
      ],
      soundAndRhythmicDevices: [
        {
          term: "Alliteration",
          definition: "The repetition of identical consonant sounds at the beginning of adjacent or closely connected syllables.",
          example: "'The slimy sea snail slid slowly southward.'"
        },
        {
          term: "Assonance",
          definition: "The repetition of identical or matching vowel sounds within nearby words possessing different consonants.",
          example: "'The true blue moon illuminated the cool roof.'"
        },
        {
          term: "Consonance",
          definition: "The repetitive recurrence of consonant sounds within or at the end of words in close proximity.",
          example: "'The blunt flint sent the spent lint into the tent.'"
        },
        {
          term: "Onomatopoeia",
          definition: "Words whose phonetic structure directly imitates or echoes the natural sound of the object, creature, or action described.",
          example: "'The dry palm fronds rustled, clattered, and hissed under the harmattan squall.'"
        }
      ],
      structuralAndDramaticDevices: [
        {
          term: "Dramatic Irony",
          definition: "A theatrical condition where the audience or reader possesses vital situational facts that the executing character does not know.",
          cockcrowApplication: "In Hemingway's 'A Day's Wait', the father and reader know a 102-degree temperature in Fahrenheit is a mild fever, whereas Schatz believes it means certain death based on French Celsius."
        },
        {
          term: "Situational Irony",
          definition: "A sharp, incongruous divergence between expected outcomes based on circumstances and what actually occurs.",
          cockcrowApplication: "In 'The Girl Who Can', the spindly legs that Nana dismissed as useless liabilities for carrying loads become the exact physical instrument that brings district glory through sprinting."
        },
        {
          term: "Foreshadowing",
          definition: "Literary clues, dialogues, or omens strategically placed by an author to hint at pivotal narrative developments yet to occur.",
          cockcrowApplication: "In 'The Dilemma of a Ghost', the children's song about the 'ghost at the crossroads' foreshadows Ato Yawson's psychological paralysis between Akan tradition and Western values."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // SECTION 1: BASIC 7 (JHS 1) — SHORT FICTION ANALYSIS
    // -----------------------------------------------------------------------
    section1_b7_short_prose: {
      title: "Basic 7 (JHS 1): Foundational Short Fiction Analysis",
      description: "Literary dissection of prescribed short stories in The Cockcrow: Ama Ata Aidoo's 'The Girl Who Can' and Ernest Hemingway's 'A Day's Wait'.",
      
      story1_the_girl_who_can: {
        author: "Ama Ata Aidoo",
        setting: "Hasodzi, a rural agrarian village in the Central Region of Ghana.",
        narrativePointOfView: "First-person subjective narrator (seven-year-old Adjoa).",
        plotSummary: "Adjoa is a reflective seven-year-old girl born with unusually slender, spindly legs. In her village, traditional female beauty and utility are measured by fleshy, robust calves capable of balancing heavy farm harvest loads and supporting successful childbearing. Her grandmother, Nana, constantly laments Adjoa's physical build, engaging in prolonged arguments with Adjoa's mother, Maami. However, upon enrolling in the local primary school, Adjoa's athletic talent is discovered by the school sports master. She enters competitive sprinting and wins the prestigious inter-district primary school athletic cup. The story concludes with Nana carrying the championship cup on her head like a traditional ceremonial water vessel, showing how tradition can adapt to celebrate modern female achievement.",
        characterProfiles: [
          {
            name: "Adjoa",
            role: "Protagonist and first-person narrator.",
            traits: "Reflective, observant, resilient, and quietly confident.",
            literarySignificance: "Represents the emergence of modern female identity, demonstrating that institutional education and sports offer alternative paths beyond traditional domestic expectations."
          },
          {
            name: "Nana",
            role: "Family matriarch and Adjoa's grandmother.",
            traits: "Stern, traditional, outspoken, and status-conscious.",
            literarySignificance: "Serves as the voice of indigenous communal expectations. Her eventual pride shows that traditional elders can adapt when shown tangible success."
          },
          {
            name: "Maami (Adjoa's Mother)",
            role: "Adjoa's mother.",
            traits: "Submissive, gentle, protective, yet socially constrained.",
            literarySignificance: "Represents the transitional generation of rural African women who love their children but lack the traditional authority to challenge senior matriarchs."
          }
        ],
        thematicMatrix: [
          {
            theme: "Tradition vs. Modernity & Female Empowerment",
            analysis: "Hasodzi village values women based on agricultural carrying power and childbearing anatomy. Adjoa's athletic victory demonstrates that female capability is multifaceted and can flourish beyond traditional domestic labor."
          },
          {
            theme: "The Silencing of Children",
            analysis: "Adjoa's internal reflections reveal how children in traditional societies are discouraged from speaking in adult discussions ('a child does not talk when elders are speaking'). Her sports trophy serves as her physical voice."
          }
        ],
        keyExtractsAndAnalysis: [
          {
            extract: "'Nana would look at my legs and shake her head, as though mourning a national catastrophe.'",
            deviceUsed: "Hyperbole and Simile.",
            significance: "Exaggerates Nana's dramatic distress over Adjoa's slender legs, underscoring how deeply traditional expectations prioritize robust calves."
          }
        ]
      },

      story2_a_days_wait: {
        author: "Ernest Hemingway",
        setting: "A rural American household during a winter freeze.",
        narrativePointOfView: "First-person objective narrator (Schatz's father).",
        plotSummary: "Nine-year-old Schatz falls ill with influenza during a winter freeze. The attending physician takes his temperature, announcing it is 102 degrees Fahrenheit. Unknown to his father, Schatz previously attended school in France, where temperature is measured in Celsius (where a body temperature of 44 degrees is lethal). Schatz assumes that a temperature of 102 degrees means certain death. With quiet courage, he spends an entire day lying in bed, refusing to let anyone enter his room so as not to pass along the illness. Meanwhile, his father reads Howard Pyle's pirate stories and goes out hunting quails on the frozen sleet, unaware of his son's quiet struggle. In the evening, the misunderstanding is clarified, and the boy's stoic composure gives way to emotional relief.",
        characterProfiles: [
          {
            name: "Schatz",
            role: "Protagonist (nine-year-old boy).",
            traits: "Stoic, courageous, considerate of others, and disciplined.",
            literarySignificance: "Exemplifies Hemingway's ideal of 'grace under pressure'—facing what he believes is certain death with quiet dignity and protecting his father from contamination."
          },
          {
            name: "The Father",
            role: "Narrator and loving parent.",
            traits: "Attentive, affectionate, yet unperceptive.",
            literarySignificance: "Illustrates parental disconnect; he diagnoses the fever physically but fails to recognize the silent emotional crisis his son is enduring."
          }
        ],
        thematicMatrix: [
          {
            theme: "Heroic Stoicism & Courage Under Pressure",
            analysis: "Schatz confronts what he believes to be his final hours with composure, showing that true courage is often quiet and internal rather than loud or boastful."
          },
          {
            theme: "Cultural Miscommunication",
            analysis: "The gap between Fahrenheit and Celsius demonstrates how unshared assumptions can lead to silent, unnecessary suffering."
          }
        ],
        keyExtractsAndAnalysis: [
          {
            extract: "'You don't have to stay in here with me, Papa, if it bothers you... You mustn't get what I have.'",
            deviceUsed: "Dramatic Irony.",
            significance: "Highlights Schatz's selflessness. While his father assumes the boy is simply resting, Schatz believes he is heroically shielding his father from lethal infection."
          }
        ]
      }
    },

    // -----------------------------------------------------------------------
    // SECTION 2: BASIC 8 (JHS 2) — THE NOVELLA & SOCIAL CRITIQUE
    // -----------------------------------------------------------------------
    section2_b8_novella_drama: {
      title: "Basic 8 (JHS 2): Novella Dissection & Social Stratification",
      description: "Literary exploration of the prescribed Cockcrow novella adaptation: Charles Dickens' 'Oliver Twist'.",
      
      novella_oliver_twist: {
        author: "Charles Dickens",
        historicalContext: "Nineteenth-century Victorian England during the Industrial Revolution; written as a direct critique of the Poor Law Amendment Act of 1834.",
        plotSummary: "Oliver Twist is born in a parish workhouse where his mother dies without revealing her identity. Subjected to starvation and abuse under the parish beadle, Mr. Bumble, Oliver is chosen by lot by his starving companions to ask for an extra portion of gruel. Punished for his request, he is apprenticed to an undertaker, Mr. Sowerberry, but flees to London after being provoked by Noah Claypole. In London, he is recruited by the Artful Dodger into a juvenile pickpocket gang managed by the criminal Fagin. Arrested for a theft committed by the Dodger, Oliver is rescued by the benevolent Mr. Brownlow. The criminal Bill Sikes kidnaps him back to assist in a burglary. Nancy, moved by Oliver's innocence, secretly contacts Mr. Brownlow and Rose Maylie, leading to her brutal murder by Sikes. Sikes dies while attempting to escape, Fagin is arrested and executed, Oliver's true parentage and inheritance are revealed, and he is adopted by Mr. Brownlow.",
        characterProfiles: [
          {
            name: "Oliver Twist",
            role: "Protagonist.",
            traits: "Innocent, pure-hearted, resilient, and morally incorruptible.",
            literarySignificance: "Represents natural goodness that remains uncorrupted despite institutional neglect and criminal environments."
          },
          {
            name: "Mr. Bumble",
            role: "Parish beadle of the workhouse.",
            traits: "Pompous, hypocritical, cruel, and cowardly.",
            literarySignificance: "Embodies the hypocrisy of the Victorian Poor Law bureaucracy, which treated poverty as a moral crime."
          },
          {
            name: "Fagin",
            role: "Criminal leader and receiver of stolen goods.",
            traits: "Cunning, manipulative, greedy, and treacherous.",
            literarySignificance: "Represents the exploitative criminal underworld that takes advantage of abandoned, homeless street children."
          },
          {
            name: "Bill Sikes",
            role: "Hardened housebreaker and burglar.",
            traits: "Brutal, violent, merciless, and aggressive.",
            literarySignificance: "Represents violent criminality, culminating in the brutal murder of Nancy and his own desperate downfall."
          },
          {
            name: "Nancy",
            role: "Thief in Fagin's gang and Sikes's companion.",
            traits: "Conflicted, empathetic, courageous, and self-sacrificing.",
            literarySignificance: "Demonstrates moral complexity and redemption through sacrifice, proving that compassion can survive even in criminal environments."
          },
          {
            name: "Mr. Brownlow",
            role: "Benevolent gentleman and Oliver's protector.",
            traits: "Kind-hearted, discerning, patient, and generous.",
            literarySignificance: "Represents practical Christian charity and justice, helping restore Oliver's identity and inheritance."
          }
        ],
        thematicMatrix: [
          {
            theme: "The Inadequacy and Cruelty of Victorian Social Institutions",
            analysis: "Dickens critiques the workhouse system, where institutions designed to care for the vulnerable instead starved, beat, and exploited them."
          },
          {
            theme: "Innate Goodness vs. Environmental Depravity",
            analysis: "Oliver's character highlights the theme that genuine moral purity can withstand corrupting environments."
          },
          {
            theme: "Redemption and Moral Ambiguity",
            analysis: "Nancy's internal conflict and decision to protect Oliver, despite knowing the danger from Sikes, shows that moral goodness can exist even among the marginalized."
          }
        ],
        keyExtractsAndAnalysis: [
          {
            extract: "'Please, sir, I want some more.'",
            deviceUsed: "Dramatic Climax and Understatement.",
            significance: "Oliver's modest request for food shatters the expected submissiveness of the workhouse, exposing the board's cruelty when they treat his hunger as dangerous rebellion."
          }
        ]
      }
    },

    // -----------------------------------------------------------------------
    // SECTION 3: BASIC 9 (JHS 3) — DRAMA & PRESCRIBED POETRY
    // -----------------------------------------------------------------------
    section3_b9_drama_poetry: {
      title: "Basic 9 (JHS 3): Modern African Drama & Prescribed Poetry",
      description: "Literary analysis of Ama Ata Aidoo's drama 'The Dilemma of a Ghost' and prescribed poetry ('The Desert Rivers', 'The Colour of God').",
      
      drama_the_dilemma_of_a_ghost: {
        author: "Ama Ata Aidoo",
        dramaticForm: "Modern African cross-cultural tragedy/tragicomedy in five acts with a verse prologue.",
        setting: "The ancestral courtyard of the Odumna Clan in a rural Fante village, Ghana.",
        plotSummary: "Ato Yawson, an educated Ghanaian man, returns from university studies in the United States with an African-American bride, Eulalie Rush. They marry without consulting or notifying his rural Fante family. The play traces the resulting cultural misunderstandings: the traditional Odumna family (led by his mother, Esi Kom, and grandmother, Nana) expects communal obligations, mutual visits, and prompt childbearing to honor ancestral lineages. Meanwhile, Eulalie, feeling alienated in an unfamiliar environment, smokes cigarettes, drinks heavily, and uses modern contraception to delay childbirth. Paralyzed between the two worlds, Ato fails to bridge the divide, keeping the contraception a secret and allowing his family to assume Eulalie is barren. The crisis peaks when Ato slaps Eulalie during a heated argument, prompting her to flee. The play concludes with a moment of reconciliation when the family matriarch, Esi Kom, chastises Ato for his passivity and takes Eulalie into her home.",
        characterProfiles: [
          {
            name: "Ato Yawson ('The Ghost')",
            role: "Protagonist and educated returnee.",
            traits: "Indecisive, passive, culturally torn, and emotionally fragile.",
            dramaticSignificance: "Represents the educated African elite caught between Western individualism and indigenous communal duties, unable to bridge either culture."
          },
          {
            name: "Eulalie Rush Yawson",
            role: "Ato's African-American wife.",
            traits: "Traumatized by ancestral displacement, outspoken, vulnerable, and defensive.",
            dramaticSignificance: "Represents the African diaspora searching for ancestral roots in an African society that initially views her as an outsider (a 'black-white woman')."
          },
          {
            name: "Esi Kom",
            role: "Ato's mother and pillar of the Odumna clan.",
            traits: "Hardworking, traditional, loving, yet bewildered by modern ways.",
            dramaticSignificance: "Demonstrates practical maternal wisdom and reconciliation by welcoming Eulalie into her courtyard at the end of the play."
          },
          {
            name: "Nana",
            role: "Ato's elderly grandmother and clan matriarch.",
            traits: "Deeply traditional, status-conscious, and ancestral gatekeeper.",
            dramaticSignificance: "Reflects the pain of ancestral continuity when she laments that Ato has married a descendant of enslaved ancestors without a known clan."
          },
          {
            name: "The 1st and 2nd Village Women",
            role: "Communal chorus / Commentary figures.",
            traits: "Gossiping, observant, and reflective of communal norms.",
            dramaticSignificance: "Function like a traditional Greek chorus, reflecting communal expectations regarding marriage, barrenness, and family continuity."
          }
        ],
        thematicMatrix: [
          {
            theme: "The Dilemma of the Cultural Returnee",
            analysis: "Ato embodies the educated African alienated from traditional ways yet not fully at home in the West, represented by the ghost stranded at the crossroads in the children's song."
          },
          {
            theme: "The Legacy of the Transatlantic Slave Trade",
            analysis: "The play explores the historical divide between continental Africans and the diaspora, as seen when the clan struggles to accept Eulalie because her ancestors were enslaved."
          },
          {
            theme: "Communication Breakdown & Secrecy",
            analysis: "Ato's refusal to tell his family about their decision to use birth control causes the clan to assume Eulalie is barren, fueling avoidable family conflict."
          }
        ],
        dramaticDevices: [
          {
            device: "The Bird of the Wayside (The Prologue)",
            function: "Functions as a dramatic narrator, introducing the central conflict between ancient heritage and modern influences before the main action begins."
          },
          {
            device: "The Children's Rhyme ('The Ghost at the Crossroads')",
            function: "A recurrent musical motif where children sing about a ghost unable to choose between Elmina and Cape Coast, foreshadowing Ato's psychological paralysis between Akan tradition and Western modernity."
          }
        ]
      },

      poetryAnalysis: [
        {
          title: "The Desert Rivers",
          poet: "L. H. Ofosu-Appiah",
          formAndMeter: "Free verse with irregular stanzas structured through contrasting nature imagery.",
          subjectMatter: "The poem reflects on seasonal Ghanaian rivers that dry into dusty channels during the harmattan, only to swell into torrents when the rainy season arrives.",
          thematicCore: "The cyclical rhythm of the natural world, patience through seasons of lack, and resilience during hardship.",
          keyLiteraryDevices: [
            {
              device: "Metaphor",
              illustration: "The dry riverbed is compared to a sleeping serpent waiting for the rains to return.",
              analysis: "Highlights the hidden life within the riverbed, lying dormant until the rains arrive."
            },
            {
              device: "Personification",
              illustration: "The desert sun is portrayed as an unyielding taskmaster parching the moisture from the earth.",
              analysis: "Emphasizes the severity of the dry harmattan season."
            }
          ]
        },
        {
          title: "The Colour of God",
          poet: "P. K. Foli",
          formAndMeter: "Regular four-line stanzas (quatrains) utilizing an accessible question-and-answer format.",
          subjectMatter: "A child asks their mother about the skin color of God, wondering whether the Creator is Black, White, Red, or Yellow. The mother explains that God transcends human racial divisions, encompassing all colors like pure sunlight.",
          thematicCore: "Universal human dignity, the equality of all races, and the divine transcendence of racial labels.",
          keyLiteraryDevices: [
            {
              device: "Light Imagery",
              illustration: "God is compared to pure sunlight that divides into all colors through a prism.",
              analysis: "Shows that all human racial tones are equal reflections of a single divine source."
            },
            {
              device: "Dialogue / Catechetical Structure",
              illustration: "Structured as a conversation between an innocent child and an insightful parent.",
              analysis: "Frames universal human equality through simple, accessible family dialogue."
            }
          ]
        }
      ]
    },

    // -----------------------------------------------------------------------
    // SECTION 4: STEP-BY-STEP SOLVING ALGORITHMS FOR BECE LITERATURE
    // -----------------------------------------------------------------------
    section4_student_answering_methodology: {
      title: "Step-by-Step Student Method for Cockcrow Literature Examinations",
      contextQuestionAlgorithm: [
        "Step 1: Identify the Speaker, Listener, and Location (Who is speaking to whom, and where?).",
        "Step 2: Trace Immediate Preceding Events (What specific event or provocation happened right before this line?).",
        "Step 3: Identify Explicit Literary Devices (Is there a metaphor, simile, irony, hyperbole, or personification?).",
        "Step 4: Connect to the Broader Theme (Why did the author include this line, and what does it reveal about the character or central conflict?)."
      ],
      essayQuestionAlgorithm: [
        "Step 1: Deconstruct the prompt into key components (e.g., 'Discuss the theme of female empowerment in The Girl Who Can').",
        "Step 2: Formulate a clear thesis statement in the introductory paragraph.",
        "Step 3: Dedicate each body paragraph to one clear argument using the P-E-E formula (Point, Evidence, Explanation).",
        "Step 4: Provide accurate textual details and character interactions rather than vague generalizations.",
        "Step 5: Conclude by summarizing main arguments and explaining the lasting moral or cultural significance."
      ]
    }
  },

  metadata: {
    curriculum: "NaCCA Common Core Programme (CCP) Standard",
    strand: "Strand 2: Reading & Literature",
    subStrand: "Sub-Strand 2: The Cockcrow Anthology & Literary Devices",
    prescribedAnthology: "The Cockcrow (Selected Approved Texts)",
    hasCompleteCoverage: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedCockcrowTopicalModules() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding detailed NaCCA Cockcrow Anthology & Literary Devices notes into Firestore...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/cockcrow_literary_devices",
    "global_curriculum/jhs/subjects/english/topics/cockcrow_literary_devices",
    "global_curriculum/jhs/subjects/english/topical_units/cockcrow_literary_devices"
  ];

  for (const p of paths) {
    const docRef = db.doc(p);
    await docRef.set(cockcrowAnthologyPayload, { merge: true });
    console.log(`✅ Successfully deployed Cockcrow Concept Notes to: ${p}`);
  }

  // Update English manifests/topical_labs document if it exists
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    let found = false;
    const newTopics = (mData.topics || []).map((t: any) => {
      if (t.id === 'cockcrow_literary_devices' || t.topicId === 'cockcrow_literary_devices') {
        found = true;
        return {
          ...t,
          hasNotes: true,
          status: 'ready'
        };
      }
      return t;
    });
    if (!found) {
      newTopics.push({
        id: 'cockcrow_literary_devices',
        topicId: 'cockcrow_literary_devices',
        title: 'The Cockcrow Anthology & Literary Devices',
        strandId: 'strand_2_reading_literature',
        hasNotes: true,
        status: 'ready'
      });
    }
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated with cockcrow_literary_devices status.");
  }
}

seedCockcrowTopicalModules()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Cockcrow Concept Notes:", err);
    process.exit(1);
  });
