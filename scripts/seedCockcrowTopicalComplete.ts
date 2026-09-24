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

// =========================================================================
// TEXTBOOK-GRADE NACCA CONCEPT NOTES (MARKDOWN FOR TAB 1: B7, B8, B9)
// =========================================================================

const B7_NOTES_MARKDOWN = `### The Cockcrow: Literary Devices & Foundational Short Fiction (Basic 7 / JHS 1)

---

#### 1. Master Literary Devices & Figures of Speech Toolkit

Literary devices are artistic techniques and figurative linguistic tools used by writers to enrich prose, heighten dramatic tension, and communicate deep thematic resonance.

##### A. Figures of Comparison and Association

| Device | Definition & Analytical Function | Authentic Textual Example | Diagnostic Identification Test |
| :--- | :--- | :--- | :--- |
| **Simile** | An explicit comparison between two fundamentally dissimilar entities using comparative markers such as **'like'** or **'as'**. | *"His voice cut through the silence like a sharp cutlass."* | Check for **'like'** or **'as'** directly establishing a comparative bridge. |
| **Metaphor** | An implicit, direct equation of two unrelated entities without comparative markers, asserting that one entity is another. | *"The classroom was a tempestuous ocean of rebellious whispers."* | Ask: Is Entity A directly declared to **BE** Entity B without comparative words? |
| **Personification** | Attributing human characteristics, feelings, psychological motives, or bodily actions to animals, objects, or abstractions. | *"The fierce drought strangled the dying cocoa seedlings."* | Is an inanimate object or natural force performing an intentional human action? |
| **Hyperbole** | Deliberate, extravagant exaggeration used to heighten emotional impact or create dramatic/comic emphasis. | *"Nana wept oceans of bitter tears over Adjoa's spindly legs."* | Is the statement physically impossible or exaggerated beyond literal truth? |
| **Apostrophe** | A direct rhetorical address to an absent individual, a deceased ancestor, or an abstract entity as if present. | *"O ancestral spirits of Hasodzi, why have you endowed our daughter with spindly legs?"* | Look for an emotional invocation (*"O...", "Thou..."*) directed to someone who cannot physically reply. |
| **Litotes (Understatement)**| An ironic understatement where an affirmative assertion is expressed by negating its contrary. | *"Winning the inter-district athletic trophy was no small achievement for the village."* | Look for negative constructions (*"no small", "not unfamiliar"*) asserting an achievement. |

##### B. Sound and Rhythmic Devices

* **Alliteration:** Repetition of identical consonant sounds at the beginning of adjacent or closely connected words (*"The slimy sea snail slid slowly southward"*).
* **Assonance:** Repetition of identical or matching vowel sounds within nearby words possessing different consonants (*"The true blue moon illuminated the cool roof"*).
* **Consonance:** Recurrence of consonant sounds within or at the end of words in close proximity (*"The blunt flint sent the spent lint into the tent"*).
* **Onomatopoeia:** Words whose phonetic structure directly imitates the natural sound of the object, creature, or action described (*"The dry palm fronds rustled, clattered, and hissed under the harmattan squall"*).

##### C. Structural and Dramatic Devices

* **Dramatic Irony:** A condition where the reader or audience possesses vital knowledge that the executing character is ignorant of. *(In Hemingway's 'A Day's Wait', the father and reader know 102°F is a mild fever, whereas Schatz believes it means certain death based on French Celsius).*
* **Situational Irony:** A sharp, incongruous divergence between expected outcomes based on circumstances and what actually occurs. *(In 'The Girl Who Can', the spindly legs dismissed as useless liabilities become the exact instruments of district sporting glory).*
* **Foreshadowing:** Narrative clues strategically planted by the author to hint at pivotal developments yet to unfold.

---

#### 2. Prose Analysis 1: Ama Ata Aidoo — *"The Girl Who Can"*

##### A. Context, Setting & Point of View
* **Author:** Ama Ata Aidoo (celebrated Ghanaian playwright, novelist, and poet).
* **Setting:** Hasodzi, a rural agrarian village in the Central Region of Ghana.
* **Narrative Point of View:** First-person subjective narrator (seven-year-old Adjoa).

##### B. Plot Architecture
Adjoa is an introspective seven-year-old girl born with unusually slender, spindly legs. In Hasodzi, traditional female beauty and functional worth are strictly measured by fleshy, robust calves capable of balancing heavy farm harvest loads and supporting childbearing. Her grandmother, **Nana**, constantly laments Adjoa's physique, engaging in endless domestic arguments with Adjoa's mother, **Maami**. However, upon enrolling in primary school, Adjoa's natural sprinting speed is recognized by the school sports master. She enters competitive sprinting, wins the inter-district primary school championship cup, and returns home triumphant. The story ends with Nana carrying the trophy cup on her head like a ceremonial vessel, showing how traditional elders can adapt when confronted with modern female achievement.

##### C. Key Character Profiles
1. **Adjoa (Protagonist):** Reflective, observant, resilient, and quietly confident. She embodies modern female potential beyond traditional domestic expectations.
2. **Nana (Family Matriarch):** Traditional, outspoken, strict, yet capable of pride and transformation. She represents communal Akan ancestral expectations regarding womanhood.
3. **Maami (Adjoa's Mother):** Gentle, submissive, and socially constrained. She represents the transitional generation of African women caught between maternal love and elder authority.

##### D. Thematic Matrix
* **Tradition vs. Modernity & Female Empowerment:** Traditional rural communities measure women by physical labor and childbearing capacity. Adjoa's athletic triumph proves that modern institutions (school, sports) unlock alternative paths for female excellence.
* **The Silencing of Children:** Traditional culture discourages children from speaking in adult discussions (*"a child does not talk when elders are speaking"*). Adjoa's sports trophy serves as her undeniable physical voice.

##### E. Key Extract & Critical Analysis
> *"Nana would look at my legs and shake her head, as though mourning a national catastrophe."*
* **Literary Devices:** Hyperbole & Simile.
* **Significance:** Exaggerates Nana's dramatic distress over Adjoa's slender legs, highlighting how deeply ingrained traditional physical norms were in Hasodzi.

---

#### 3. Prose Analysis 2: Ernest Hemingway — *"A Day's Wait"*

##### A. Context, Setting & Point of View
* **Author:** Ernest Hemingway (American Nobel laureate).
* **Setting:** A rural American home during a freezing winter day.
* **Narrative Point of View:** First-person objective narrator (Schatz's father).

##### B. Plot Architecture
Nine-year-old Schatz falls ill with influenza during a winter freeze. The attending physician takes his temperature, announcing it is 102 degrees Fahrenheit. Unknown to his father, Schatz previously attended school in France, where temperature is measured in Celsius (where 44 degrees is fatal). Schatz erroneously assumes that 102 degrees means certain death. With quiet bravery, he spends the entire day in bed, refusing to let anyone enter so as not to pass along the fatal disease. Meanwhile, his father reads Howard Pyle's pirate tales and goes quail hunting on the sleet. In the evening, the misunderstanding is clarified, and the boy's stoic composure gives way to emotional relief.

##### C. Key Character Profiles & Thematic Matrix
1. **Schatz:** Courageous, stoic, disciplined, and selfless. He exemplifies Hemingway's code hero of **"grace under pressure"**—facing what he believes is impending death with quiet dignity.
2. **The Father:** Affectionate yet unperceptive; he fails to notice the silent existential crisis his son is enduring.
3. **Core Themes:** Heroic Stoicism; The Agony of Unvoiced Miscommunication (Fahrenheit vs. Celsius).

##### D. Key Extract & Critical Analysis
> *"You don't have to stay in here with me, Papa, if it bothers you... You mustn't get what I have."*
* **Literary Device:** Dramatic Irony.
* **Significance:** Highlights Schatz's heroic selflessness. While his father assumes the boy is simply resting, Schatz believes he is shielding his father from lethal contagion.

---

#### 4. Step-by-Step Methodology for BECE Literature Context Questions
* **Step 1:** State the **Speaker**, **Addressee**, and **Physical Location**.
* **Step 2:** Summarize the **Immediate Preceding Event** (what provoked this dialogue?).
* **Step 3:** Identify explicit **Literary Devices** (metaphor, simile, irony, hyperbole).
* **Step 4:** State the **Thematic Connection** (what does this line reveal about character motivation or central conflict?).`;

const B8_NOTES_MARKDOWN = `### The Cockcrow: Novella Dissection & Social Stratification (Basic 8 / JHS 2)

---

#### 1. Advanced Literary Devices & Satirical Techniques

In prose novellas, authors employ advanced narrative and rhetorical strategies to critique societal inequities:

| Device | Definition | Textual Function in Prose & Novellas |
| :--- | :--- | :--- |
| **Satire** | The use of humor, irony, exaggeration, or ridicule to expose and criticize human folly, institutional corruption, or social injustice. | Charles Dickens uses satire in *Oliver Twist* to expose the hypocrisy of the Victorian Poor Law Board who claim to care for orphans while starving them. |
| **Caricature** | A grotesque, exaggerated portrayal of a character's physical traits or personality to make them ridiculous. | Mr. Bumble's pompous walk, oversized cocked hat, and cane represent the bloated vanity of petty officials. |
| **Situational Irony** | An occurrence that is contrary to what was expected, revealing deeper truths. | Workhouse guardians feast on roast beef and wine while deciding that paupers are "lazy" and deserve only thin gruel. |
| **Allegory** | A narrative with two levels of meaning: a literal surface story and a deeper symbolic, moral, or political meaning. | Oliver represents natural innocence and goodness uncorrupted by societal depravity. |
| **Symbolism** | An object, person, or situation that represents an abstract concept beyond its literal identity. | Oliver's request for "more gruel" symbolizes the cry of the oppressed working class against institutional exploitation. |

---

#### 2. Novella Dissection: Charles Dickens — *"Oliver Twist"*

##### A. Historical & Social Context
* **Author:** Charles Dickens (Victorian England's preeminent social reformer and novelist).
* **Historical Milestone:** Written as a direct protest against the **Poor Law Amendment Act of 1834**, which criminalized poverty and forced destitute citizens into penal workhouses where families were separated and starved.

##### B. Comprehensive Plot Synopsis
1. **The Workhouse & The Famous Request:** Oliver is born in a parish workhouse where his mother dies without revealing her identity. Under the tyrannical beadle **Mr. Bumble**, the starving boys cast lots; Oliver draws the short straw and famously asks for more gruel. For this "rebellious crime", he is confined and offered as an apprentice.
2. **Apprenticeship & Escape:** Apprenticed to the undertaker **Mr. Sowerberry**, Oliver is mistreated by the bully **Noah Claypole**. After defending his dead mother's honor, Oliver flees and walks seventy miles to London.
3. **The Criminal Underworld:** In London, Oliver is befriended by the **Artful Dodger** (Jack Dawkins) and introduced to **Fagin**, an elderly fence who trains abandoned children to pick pockets.
4. **Arrest & Rescue:** Wrongly arrested for a theft committed by the Dodger, Oliver is rescued by the benevolent gentleman **Mr. Brownlow**, in whose house he experiences genuine love for the first time.
5. **Recapture & The Burglary:** The brutal housebreaker **Bill Sikes** and his companion **Nancy** kidnap Oliver back. Sikes forces Oliver to assist in a burglary at the Maylie home, where Oliver is shot and left behind, only to be nursed by **Rose Maylie**.
6. **Nancy's Sacrifice & Resolution:** Moved by Oliver's innocence, Nancy secretly meets Mr. Brownlow to protect the boy. Sikes discovers her betrayal and brutally bludgeons her to death. Sikes is pursued by an enraged mob and accidentally hangs himself. Fagin is convicted and executed. Oliver's noble lineage is revealed, his villainous half-brother **Monks** is unmasked, and Mr. Brownlow formally adopts Oliver.

##### C. Master Character Profiles & Allegorical Roles
* **Oliver Twist:** The embodiment of pure, innate goodness that survives moral and physical contamination.
* **Mr. Bumble (The Beadle):** Pompous, hypocritical, corrupt. Dickens uses him to satirize bureaucratic cruelty.
* **Fagin:** Cunning, manipulative, predatory. Represents the exploitation of homeless children by organized crime.
* **Bill Sikes:** Raw, unrepentant brutality. Represents the violent criminal element produced by urban squalor.
* **Nancy:** Morally complex, empathetic, courageous, and self-sacrificing. She proves that conscience and redemption can flourish even in the darkest criminal underworld.
* **Mr. Brownlow:** Practical Christian charity, paternal benevolence, and moral justice.

##### D. Thematic Matrix
* **Cruelty of Institutional Bureaucracy:** Dickens attacks Victorian society for treating poverty as a moral failing rather than an economic misfortune.
* **Innate Purity vs. Environmental Depravity:** Despite living among thieves and murderers, Oliver remains truthful and compassionate.
* **Moral Ambiguity and Redemption:** Nancy's sacrifice demonstrates that human beings are capable of noble choices regardless of their past.

##### E. Iconic Extract & Deep Dissection
> *"The master, in his cook's uniform, was stationed at the copper; his pauper assistants were ranged behind him; the ladles were put into commission... Child as he was, he was desperate with hunger, and reckless with misery... He rose from the table; and advancing to the master, basin and spoon in hand, said: 'Please, sir, I want some more.'"*
* **Literary Device:** Dramatic Climax & Understatement.
* **Critical Significance:** A starving child's modest request for food is treated as high treason by the workhouse board, exposing the utter absurdity and cruelty of the Victorian Poor Law.`;

const B9_NOTES_MARKDOWN = `### The Cockcrow: Modern African Drama & Prescribed Poetry (Basic 9 / JHS 3)

---

#### 1. Dramatic Frameworks & Theatrical Conventions

Drama is literature composed for performance by actors on a stage before an audience.

* **Tragicomedy:** A dramatic composition that blends elements of both tragedy and comedy, often ending with reconciliation after serious domestic or social crisis.
* **The Prologue:** An introductory monologue or performance delivered before the main dramatic action commences to establish atmospheric tone, historical context, and central thematic dilemmas.
* **The Chorus:** A group or commentator who speaks directly to the audience, interpreting actions, expressing community norms, and providing moral commentary.
* **Dramatic Motif:** A recurring symbol, song, or dialogue that deepens the central theme (e.g., the children's rhyme in *The Dilemma of a Ghost*).

---

#### 2. Modern African Drama: Ama Ata Aidoo — *"The Dilemma of a Ghost"*

##### A. Dramatic Setting & Structural Overview
* **Playwright:** Ama Ata Aidoo.
* **Form:** Modern African cross-cultural drama in five acts with a verse prologue.
* **Setting:** The ancestral courtyard of the **Odumna Clan** in Hasodzi/rural Fante village, Ghana.

##### B. Comprehensive Plot Synopsis
1. **Prologue:** **The Bird of the Wayside** introduces the fundamental clash between ancient ancestral continuity and modern European individualism.
2. **Act 1 (The Secret Marriage):** **Ato Yawson**, an educated Ghanaian man, returns from university studies in the United States with **Eulalie Rush**, an African-American bride. They marry abroad without informing or consulting Ato's rural Fante family.
3. **Act 2 (Communal Misunderstandings):** The Odumna family (led by Ato's mother **Esi Kom** and grandmother **Nana**) expect traditional greetings, communal obligations, and immediate childbearing to sustain the ancestral lineage. Unknown to them, Ato and Eulalie have agreed to use modern contraception to delay having children.
4. **Act 3 (Cultural Alienation):** Eulalie feels isolated and misunderstood. She drinks alcohol and smokes cigarettes in the village courtyard, actions that scandalize the community. The **1st and 2nd Village Women** act as a traditional chorus, gossiping about Eulalie's perceived barrenness.
5. **Act 4 (The Confrontation):** The family visits with herbs and ancestral concoctions to cleanse Eulalie's "barrenness". Ato cowers in indecision, refusing to confess their use of contraception. During an explosive domestic argument, Eulalie mocks Ato's traditionalism, and Ato slaps her. Eulalie flees into the night.
6. **Act 5 (The Resolution & Maternal Reconciliation):** Ato wanders in existential distress, haunted by the children's song of the ghost at the crossroads. Eulalie returns exhausted and weeping. Surprisingly, **Esi Kom** intervenes, rebuking Ato for failing to guide his wife and keep honest communication. Esi Kom gently leads Eulalie into her own room, cementing cross-cultural reconciliation through maternal empathy.

##### C. Character Profiles & Dramatic Significance
* **Ato Yawson ("The Ghost"):** Paralyzed between Western individualism and Fante communal duty. His cowardice and secrecy catalyze the crisis.
* **Eulalie Rush Yawson:** African-American diaspora returnee searching for ancestral belonging, but traumatized by cultural dislocation and hostility.
* **Esi Kom (Ato's Mother):** Practical, loving, and hardworking. She transcends cultural rigidity by demonstrating maternal compassion and welcoming Eulalie.
* **Nana (Ato's Grandmother):** Traditional clan matriarch and ancestral gatekeeper. She laments that Ato has married a descendant of enslaved ancestors without a known clan.
* **The 1st & 2nd Village Women:** Communal chorus reflecting societal expectations regarding fertility, marriage, and conformity.

##### D. Master Thematic Matrix
* **The Dilemma of the Cultural Returnee:** The educated African who belongs fully neither to the ancestral village nor to the Western world.
* **The Transatlantic Legacy of Slavery:** Explores the painful historical divide between continental Africans and the African diaspora.
* **Destructive Secrecy vs. Honest Communication:** Ato's cowardly refusal to discuss contraception with his family causes needless heartbreak.

##### E. Key Dramatic Devices & Motifs
* **The Bird of the Wayside:** Represents the authorial voice and detached observer of human folly.
* **The Ghost at the Crossroads Rhyme:**
  > *"One early morning, when the moon was up / I saw a ghost, / As I walked along / I said, 'Ghost, who are you?' / The ghost said, 'I am a stranger from Elmina / Going to Cape Coast...' / Shall I go to Cape Coast, / Or to Elmina / I don't know..."*
  * **Symbolism:** Symbolizes Ato's psychological paralysis, unable to choose between ancestral roots (Elmina) and Western modernity (Cape Coast).

---

#### 3. Prescribed Poetry Analysis

##### A. *"The Desert Rivers"* — L. H. Ofosu-Appiah
* **Form & Meter:** Free verse with irregular stanzas structured around nature imagery.
* **Subject Matter:** Reflects on seasonal African rivers that dry into dusty ditches during the harmattan, only to surge with life when the rains return.
* **Thematic Core:** The cyclical nature of existence; endurance during seasons of drought; resilience in adversity.
* **Key Figures of Speech:**
  * **Metaphor:** The dry riverbed compared to a dormant serpent awaiting the rain.
  * **Personification:** The scorching sun portrayed as an unyielding taskmaster parching the earth.

##### B. *"The Colour of God"* — P. K. Foli
* **Form & Meter:** Regular four-line stanzas (quatrains) using accessible question-and-answer dialogue.
* **Subject Matter:** A child asks their mother whether God is Black, White, Red, or Yellow. The mother responds that God is not defined by any single racial tone; rather, God encompasses all humanity like sunlight.
* **Thematic Core:** Universal human dignity; divine transcendence over racial prejudice; racial equality.
* **Key Figures of Speech:**
  * **Light Imagery / Simile:** God's presence compared to pure sunlight that divides into all vibrant colors of the prism.
  * **Catechetical Dialogue:** Frame of innocent inquiry and parental wisdom emphasizing unity.

---

#### 4. Step-by-Step BECE Essay Formulation Blueprint (P-E-E Formula)
* **P — Point:** Begin each body paragraph with a clear, direct topic sentence asserting your claim.
* **E — Evidence:** Quote or accurately paraphrase specific incidents, dialogue, or stage directions from the text.
* **E — Explanation:** Analyze the literary devices, character motivations, and thematic significance of the evidence, concluding with the broader moral or societal takeaway.`;

// =========================================================================
// STEP-BY-STEP WORKED EXAMPLES (TAB 1: SECTION B)
// =========================================================================

const B7_WORKED_EXAMPLES = [
  {
    id: "we_b7_cockcrow_01",
    title: "Context Question: Ama Ata Aidoo's 'The Girl Who Can'",
    problem: "Read the extract and answer the questions that follow:\n\n'Nana would look at my legs and shake her head, as though mourning a national catastrophe.'\n\n(a) Who is the speaker?\n(b) Identify two literary devices used in the extract.\n(c) What does Nana consider to be the ideal physical build for a girl in Hasodzi?",
    steps: [
      "Step 1 (Speaker Identification): The story is narrated in the first person by seven-year-old Adjoa. Therefore, the speaker is Adjoa.",
      "Step 2 (Literary Devices): 'As though mourning a national catastrophe' explicitly compares Nana's reaction to a national disaster using 'as though' (Simile). Furthermore, calling a child's slender legs a 'national catastrophe' is an extreme, deliberate overstatement (Hyperbole).",
      "Step 3 (Cultural Understanding): In Hasodzi, women are traditionally valued for having robust, fleshy calves capable of balancing heavy farm harvest loads on their heads and supporting successful childbearing."
    ],
    finalAnswer: "(a) Adjoa (the 7-year-old narrator).\n(b) Simile and Hyperbole.\n(c) Robust, fleshy legs capable of supporting heavy harvest loads and childbearing.",
    examinerTip: "Always mention both the term and the direct evidence from the extract when identifying literary devices in BECE exams."
  },
  {
    id: "we_b7_cockcrow_02",
    title: "Context & Irony: Ernest Hemingway's 'A Day's Wait'",
    problem: "Read the extract and answer the question:\n\n'You don't have to stay in here with me, Papa, if it bothers you... You mustn't get what I have.'\n\nExplain the dramatic irony present in Schatz's statement.",
    steps: [
      "Step 1 (Define Dramatic Irony): Dramatic irony occurs when the audience/reader possesses crucial knowledge that a character is unaware of.",
      "Step 2 (Contrast Schatz's belief with reality): Schatz believes that his fever of 102 degrees means certain death (confusing Fahrenheit with Celsius where 44°C is lethal). He heroically thinks he is protecting his father from a fatal disease.",
      "Step 3 (State the reader's knowledge): The father and reader know that 102°F is a mild, normal influenza temperature that is easily treatable.",
      "Step 4 (Synthesize): The irony lies in Schatz's heroic self-sacrifice and courage in the face of what he believes is certain death, while his father assumes he is simply resting."
    ],
    finalAnswer: "The dramatic irony is that Schatz heroically believes he is dying and protecting his father from lethal contagion (confusing Fahrenheit with French Celsius), whereas the father and reader know a 102°F temperature is merely a mild, treatable flu.",
    examinerTip: "When asked about irony, clearly contrast the character's perception with the actual reality."
  }
];

const B8_WORKED_EXAMPLES = [
  {
    id: "we_b8_cockcrow_01",
    title: "Context Question: Charles Dickens' 'Oliver Twist'",
    problem: "Read the extract and answer the questions that follow:\n\n'Please, sir, I want some more.'\n\n(a) Who is the speaker, and who is he addressing?\n(b) Where does this incident take place?\n(c) What was the immediate consequence of this request?",
    steps: [
      "Step 1 (Speaker & Addressee): Oliver Twist is the speaker. He is addressing the workhouse master in the cook's uniform, who was dishing out gruel.",
      "Step 2 (Setting): The incident takes place in the dining hall of the parish workhouse.",
      "Step 3 (Immediate Consequence): The master struck Oliver with the ladle, shouted for Mr. Bumble the beadle, and the board immediately locked Oliver in solitary confinement and offered five pounds to anyone who would take him as an apprentice."
    ],
    finalAnswer: "(a) Oliver Twist is addressing the workhouse master.\n(b) In the dining hall of the parish workhouse.\n(c) Oliver was struck with a ladle, confined to a dark room, and advertised for apprenticeship with a five-pound bounty.",
    examinerTip: "Provide precise factual details from the plot rather than general statements like 'he got punished'."
  },
  {
    id: "we_b8_cockcrow_02",
    title: "Thematic Analysis: Nancy's Moral Transformation in 'Oliver Twist'",
    problem: "In two concise points, explain how Nancy's character demonstrates the theme of 'Redemption and Moral Ambiguity' in Charles Dickens' 'Oliver Twist'.",
    steps: [
      "Step 1 (Moral Ambiguity): Nancy is an active member of Fagin's criminal syndicate and the companion of the violent thief Bill Sikes. She initially participates in Oliver's kidnapping.",
      "Step 2 (Redemption through Sacrifice): Moved by Oliver's innocence, Nancy risks her life to secretly meet Mr. Brownlow and Rose Maylie on London Bridge to disclose Monks' plot against Oliver.",
      "Step 3 (Refusal of Escape & Martyrdom): Nancy refuses Mr. Brownlow's offer of asylum because of her lingering loyalty to Sikes, resulting in her brutal murder. Her selfless sacrifice redeems her criminal past."
    ],
    finalAnswer: "1. Nancy embodies moral complexity by participating in Fagin's criminal underworld while retaining a tender conscience that refuses to see an innocent child destroyed.\n2. She achieves moral redemption by risking her life to reveal Oliver's identity to Mr. Brownlow and paying for her courage with her life, proving that human compassion can triumph over depraved environments.",
    examinerTip: "For character analysis, always demonstrate the internal conflict and the ultimate choices the character makes."
  }
];

const B9_WORKED_EXAMPLES = [
  {
    id: "we_b9_cockcrow_01",
    title: "Dramatic Analysis: Ama Ata Aidoo's 'The Dilemma of a Ghost'",
    problem: "Analyze the dramatic significance of the children's song 'The Ghost at the Crossroads' in Ama Ata Aidoo's 'The Dilemma of a Ghost'.",
    steps: [
      "Step 1 (Identify the Device): The children's rhyme about a ghost unable to choose between Elmina and Cape Coast is a recurring dramatic motif and symbol.",
      "Step 2 (Analyze Symbolism): The ghost represents Ato Yawson, an educated returnee paralyzed at the cultural crossroads between his ancestral Akan heritage (symbolized by Elmina) and Western individualism (symbolized by Cape Coast).",
      "Step 3 (Connect to Plot): Just as the ghost is stranded and belongs nowhere, Ato is estranged from his family's expectations while unable to establish a secure home for his American wife, Eulalie.",
      "Step 4 (Dramatic Foreshadowing): It foreshadows the mental anguish and domestic collapse that culminates in Act 5 when Ato wanders aimlessly through the courtyard."
    ],
    finalAnswer: "The rhyme functions as a symbolic motif foreshadowing Ato Yawson's psychological paralysis. Stranded at the crossroads between Elmina (Akan ancestral tradition) and Cape Coast (Western modernity), Ato represents the alienated educated African elite who belongs fully to neither world.",
    examinerTip: "Always unpack both the literal meaning of a dramatic symbol and its metaphorical application to the protagonist."
  },
  {
    id: "we_b9_cockcrow_02",
    title: "Poetry Analysis: P. K. Foli's 'The Colour of God'",
    problem: "Examine the central figure of speech used by the mother in P. K. Foli's poem 'The Colour of God' to explain the nature of God to her child.",
    steps: [
      "Step 1 (Locate the Device): The mother uses light imagery and a scientific simile/metaphor comparing God to pure white sunlight.",
      "Step 2 (Analyze the Mechanism): Pure sunlight appears colorless or white, but when directed through a prism, it refracts into all colors of the rainbow.",
      "Step 3 (Thematic Application): In the same way, God is not confined to any single racial hue (Black, White, Red, or Yellow). Rather, all human races are equal, beautiful reflections of the divine source.",
      "Step 4 (Moral Conclusion): The device dismantles racial discrimination and asserts universal human brotherhood."
    ],
    finalAnswer: "The mother employs light imagery, comparing God to pure sunlight that refracts into all vibrant colors of the spectrum through a prism. This demonstrates that God transcends human racial divisions, and all races are equal reflections of one universal divine creator.",
    examinerTip: "In poetry analysis, explain how the sensory image directly reinforces the moral message of the poem."
  }
];

// =========================================================================
// FOUNDATIONAL PRACTICE QUESTIONS (PRACTICE POOL)
// =========================================================================

const B7_PRACTICE_POOL = {
  low: [
    {
      id: "cockcrow_b7_l_01",
      difficulty: "low" as const,
      prompt: "What figure of speech is used in: 'His voice cut through the silence like a sharp cutlass'?",
      options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
      correctAnswer: "Simile",
      hint: "Notice the explicit comparative marker 'like'.",
      workedSolution: "A comparison using 'like' or 'as' between two different things is a simile.",
      points: 1,
      learningCompetency: "B7.2.2.1: Identify and analyze figures of comparison."
    },
    {
      id: "cockcrow_b7_l_02",
      difficulty: "low" as const,
      prompt: "In Ama Ata Aidoo's 'The Girl Who Can', who is the seven-year-old first-person narrator?",
      options: ["Nana", "Maami", "Adjoa", "Esi Kom"],
      correctAnswer: "Adjoa",
      hint: "She is the young girl born with spindly legs.",
      workedSolution: "Adjoa is the seven-year-old protagonist and narrator of 'The Girl Who Can'.",
      points: 1,
      learningCompetency: "B7.2.3.1: Identify key characters in prescribed short fiction."
    }
  ],
  medium: [
    {
      id: "cockcrow_b7_m_01",
      difficulty: "medium" as const,
      prompt: "In Ernest Hemingway's 'A Day's Wait', what is the root cause of Schatz's day-long silent agony?",
      options: [
        "His father refused to read pirate stories to him",
        "He confused Fahrenheit temperature with French Celsius",
        "The doctor gave him bitter medicine",
        "He was afraid of winter snowstorms"
      ],
      correctAnswer: "He confused Fahrenheit temperature with French Celsius",
      hint: "Remember his previous schooling in France.",
      workedSolution: "Schatz had gone to school in France where Celsius is used (where 44° is fatal). He thought his 102° Fahrenheit fever meant certain death.",
      points: 1,
      learningCompetency: "B7.2.3.1: Analyze plot turning points and dramatic irony."
    }
  ],
  hard: [
    {
      id: "cockcrow_b7_h_01",
      difficulty: "hard" as const,
      prompt: "What is the situational irony in 'The Girl Who Can'?",
      options: [
        "Adjoa fails her school examinations",
        "The spindly legs Nana criticized as useless liabilities become the exact instruments that win the district sprinting championship",
        "Nana moves away from Hasodzi village",
        "Maami becomes a track runner"
      ],
      correctAnswer: "The spindly legs Nana criticized as useless liabilities become the exact instruments that win the district sprinting championship",
      hint: "Contrast Nana's expectation with the final athletic result.",
      workedSolution: "Situational irony occurs when outcomes contradict expectations. Nana believed Adjoa's thin legs made her useless, but they won her the district cup.",
      points: 1,
      learningCompetency: "B7.2.2.1: Decode situational irony in prose fiction."
    }
  ]
};

const B8_PRACTICE_POOL = {
  low: [
    {
      id: "cockcrow_b8_l_01",
      difficulty: "low" as const,
      prompt: "Who authored the novella 'Oliver Twist'?",
      options: ["Ama Ata Aidoo", "Charles Dickens", "Ernest Hemingway", "William Shakespeare"],
      correctAnswer: "Charles Dickens",
      hint: "Victorian English novelist famous for social critiques.",
      workedSolution: "Charles Dickens wrote 'Oliver Twist' in Victorian England.",
      points: 1,
      learningCompetency: "B8.2.3.1: Demonstrate familiarity with prescribed novellas and authors."
    }
  ],
  medium: [
    {
      id: "cockcrow_b8_m_01",
      difficulty: "medium" as const,
      prompt: "What historical British legislation was Charles Dickens directly satirizing in 'Oliver Twist'?",
      options: [
        "The Education Act of 1870",
        "The Poor Law Amendment Act of 1834",
        "The Factory Act of 1847",
        "The Magna Carta"
      ],
      correctAnswer: "The Poor Law Amendment Act of 1834",
      hint: "The law that forced impoverished people into workhouses.",
      workedSolution: "Dickens wrote Oliver Twist as a direct critique of the Poor Law of 1834 which criminalized poverty and established cruel workhouses.",
      points: 1,
      learningCompetency: "B8.2.3.1: Connect literary works to their historical and social context."
    }
  ],
  hard: [
    {
      id: "cockcrow_b8_h_01",
      difficulty: "hard" as const,
      prompt: "Which character in 'Oliver Twist' best illustrates the theme of moral redemption through heroic self-sacrifice?",
      options: ["Bill Sikes", "Mr. Bumble", "Nancy", "Noah Claypole"],
      correctAnswer: "Nancy",
      hint: "She risked her life to reveal the conspiracy to Mr. Brownlow.",
      workedSolution: "Nancy redeems her criminal past by bravely meeting Mr. Brownlow to protect Oliver, paying with her life at the hands of Sikes.",
      points: 1,
      learningCompetency: "B8.2.3.1: Analyze character complexity and moral themes in literature."
    }
  ]
};

const B9_PRACTICE_POOL = {
  low: [
    {
      id: "cockcrow_b9_l_01",
      difficulty: "low" as const,
      prompt: "In Ama Ata Aidoo's drama 'The Dilemma of a Ghost', who is Ato Yawson's African-American wife?",
      options: ["Esi Kom", "Eulalie Rush", "Nana", "Rose Maylie"],
      correctAnswer: "Eulalie Rush",
      hint: "She met Ato at university in the United States.",
      workedSolution: "Eulalie Rush is the African-American bride whom Ato brings home to Ghana.",
      points: 1,
      learningCompetency: "B9.2.3.1: Identify key dramatic figures and relationships."
    }
  ],
  medium: [
    {
      id: "cockcrow_b9_m_01",
      difficulty: "medium" as const,
      prompt: "What does the recurrent musical motif of 'The Ghost at the Crossroads' symbolize in 'The Dilemma of a Ghost'?",
      options: [
        "An actual evil spirit haunting the forest",
        "Ato Yawson's psychological paralysis between Akan tradition and Western modernity",
        "Eulalie's desire to visit Cape Coast",
        "The village women's gossip about food"
      ],
      correctAnswer: "Ato Yawson's psychological paralysis between Akan tradition and Western modernity",
      hint: "The ghost cannot decide whether to go to Elmina or Cape Coast.",
      workedSolution: "The ghost at the crossroads symbolizes Ato, who is culturally torn between his indigenous heritage and Western education.",
      points: 1,
      learningCompetency: "B9.2.2.1: Interpret dramatic symbolism and motifs."
    }
  ],
  hard: [
    {
      id: "cockcrow_b9_h_01",
      difficulty: "hard" as const,
      prompt: "In P. K. Foli's poem 'The Colour of God', what scientific phenomenon does the mother use to illustrate that God belongs to all races?",
      options: [
        "Water evaporating into clouds",
        "White sunlight passing through a prism and refracting into all colors",
        "The lunar eclipse",
        "Magnetic poles attracting"
      ],
      correctAnswer: "White sunlight passing through a prism and refracting into all colors",
      hint: "Think about light and colors.",
      workedSolution: "The mother compares God to pure sunlight that divides into all the radiant hues of the spectrum through a prism, proving all races share the same divine essence.",
      points: 1,
      learningCompetency: "B9.2.2.1: Analyze poetic figures of speech and light imagery."
    }
  ]
};

// =========================================================================
// MAIN PAYLOAD
// =========================================================================

const cockcrowAnthologyPayload = {
  id: "cockcrow_literary_devices",
  topicId: "cockcrow_literary_devices",
  subjectId: "english",
  subject: "English Language",
  tier: "Junior Secondary (JHS)",
  strandCode: "S2",
  strandId: "strand_2_reading_literature",
  strandName: "STRAND 2: READING & LITERATURE",
  strandTitle: "STRAND 2: READING & LITERATURE",
  strand: "STRAND 2: READING & LITERATURE",
  subStrandTitle: "The Cockcrow Anthology & Literary Devices",
  subStrand: "The Cockcrow Anthology & Literary Devices",
  topicTitle: "Prose, Drama & Poetry Analysis",
  title: "The Cockcrow Anthology & Literary Devices",
  badge: "NaCCA Common Core Programme (CCP)",
  summary: "Comprehensive NaCCA-aligned study notes covering literary devices, prose analysis of prescribed Cockcrow short stories ('The Girl Who Can', 'A Day's Wait'), novella dissection (Charles Dickens' 'Oliver Twist'), dramatic analysis (Ama Ata Aidoo's 'The Dilemma of a Ghost'), and prescribed poetry across Basic 7 to Basic 9.",
  description: "Master literary devices, short stories, Victorian novella analysis, African drama, and prescribed poetry in the approved Cockcrow anthology.",
  gradeLevels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
  levelsAvailable: ["B7", "B8", "B9"],
  curriculumIndicators: ["B7.2.2.1", "B7.2.3.1", "B8.2.2.1", "B8.2.3.1", "B9.2.2.1", "B9.2.3.1"],
  totalPracticeQuestions: 9,
  hasNotes: true,
  status: "ready",
  version: 1,

  // Concept Notes for general adapters
  conceptNotes: {
    b7_overview: B7_NOTES_MARKDOWN,
    b8_progression: B8_NOTES_MARKDOWN,
    b9_mastery: B9_NOTES_MARKDOWN
  },

  // TopicalLabRunner Level-Specific Content
  levels: {
    b7: {
      levelTitle: "B7 • Literary Devices & Short Prose Analysis",
      summary: "Foundational figures of speech and deep analysis of 'The Girl Who Can' and 'A Day's Wait'.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: B7_PRACTICE_POOL
    },
    b8: {
      levelTitle: "B8 • Novella Dissection & Social Stratification",
      summary: "Victorian social critique, workhouse bureaucracy, and character allegories in 'Oliver Twist'.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: B8_PRACTICE_POOL
    },
    b9: {
      levelTitle: "B9 • Modern African Drama & Prescribed Poetry",
      summary: "Cross-cultural conflict in 'The Dilemma of a Ghost' and analysis of prescribed BECE poetry.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: B9_PRACTICE_POOL
    },
    jhs1: {
      levelTitle: "JHS 1 • Literary Devices & Short Prose Analysis",
      summary: "Foundational figures of speech and deep analysis of 'The Girl Who Can' and 'A Day's Wait'.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: B7_PRACTICE_POOL
    },
    jhs2: {
      levelTitle: "JHS 2 • Novella Dissection & Social Stratification",
      summary: "Victorian social critique, workhouse bureaucracy, and character allegories in 'Oliver Twist'.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: B8_PRACTICE_POOL
    },
    jhs3: {
      levelTitle: "JHS 3 • Modern African Drama & Prescribed Poetry",
      summary: "Cross-cultural conflict in 'The Dilemma of a Ghost' and analysis of prescribed BECE poetry.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: B9_PRACTICE_POOL
    }
  },

  questions: [
    ...B7_PRACTICE_POOL.low,
    ...B7_PRACTICE_POOL.medium,
    ...B7_PRACTICE_POOL.hard,
    ...B8_PRACTICE_POOL.low,
    ...B8_PRACTICE_POOL.medium,
    ...B8_PRACTICE_POOL.hard,
    ...B9_PRACTICE_POOL.low,
    ...B9_PRACTICE_POOL.medium,
    ...B9_PRACTICE_POOL.hard
  ],

  metadata: {
    curriculum: "NaCCA Common Core Programme (CCP) Standard",
    strand: "Strand 2: Reading & Literature",
    subStrand: "Sub-Strand 2: The Cockcrow Anthology & Literary Devices",
    prescribedAnthology: "The Cockcrow (Selected Approved Texts)",
    hasCompleteCoverage: true,
    hasNotes: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedCockcrowTopicalComplete() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding COMPLETE NaCCA Cockcrow Anthology & Literary Devices module into Firestore...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/cockcrow_literary_devices",
    "global_curriculum/jhs/subjects/english/topics/cockcrow_literary_devices",
    "global_curriculum/jhs/subjects/english/topical_units/cockcrow_literary_devices"
  ];

  for (const p of paths) {
    const docRef = db.doc(p);
    await docRef.set(cockcrowAnthologyPayload, { merge: true });
    console.log(`✅ Successfully deployed Complete Cockcrow Module to: ${p}`);
  }

  // Update English manifests/topical_labs document
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
          title: 'The Cockcrow Anthology & Literary Devices',
          hasNotes: true,
          status: 'ready',
          totalQuestions: cockcrowAnthologyPayload.questions.length,
          questionCount: cockcrowAnthologyPayload.questions.length
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
        status: 'ready',
        totalQuestions: cockcrowAnthologyPayload.questions.length,
        questionCount: cockcrowAnthologyPayload.questions.length
      });
    }
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated with cockcrow_literary_devices status.");
  }

  console.log("\n🎉 ALL DONE! Cockcrow Anthology & Literary Devices has full notes, worked examples, and practice pools across JHS 1, JHS 2, and JHS 3!");
}

seedCockcrowTopicalComplete()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Cockcrow complete module:", err);
    process.exit(1);
  });
