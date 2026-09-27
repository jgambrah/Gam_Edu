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
    "title": "Basic 8 Literature Diagnostic Lab - Advanced Tier (100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 8 (JHS 2)",
    "tier": "Advanced",
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
      "sub_strand": "Critical Synthesis & Structural Craft",
      "question": "How does the poet's strategic use of enjambment between domestic argument and street noise reflect the blurring of social boundaries in modern urban Ghana?",
      "options": {
        "A": "It shows that public commuters have the legal right to intervene in domestic disputes",
        "B": "It structurally mimics how workplace punctuality and urban traffic aggressively encroach upon private domestic life",
        "C": "It proves that urban Ghanaian residences lack soundproof architectural engineering",
        "D": "It signals that the speaker is a bystander observing the family from a public bus stop"
      },
      "correct_answer": "B",
      "explanation": "Enjambment breaks formal boundaries between lines, mirroring how macroeconomic employment demands dismantle the calm of private domestic sanctuaries."
    },
    {
      "item_number": 2,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Philosophy & African Cosmology",
      "question": "In 'Dawuni\u2019s Dream', how does the resolution of the physical drought through the 'rain dance' affirm indigenous Akan and Northern traditional metaphysics?",
      "options": {
        "A": "It argues that meteorology is entirely subservient to royal decrees",
        "B": "It demonstrates that ecological equilibrium is organically bound to moral righteousness and social justice within the royal stool/skin",
        "C": "It asserts that modern agricultural irrigation methods are completely useless in Africa",
        "D": "It proves that Anzansi held magical control over atmospheric condensation"
      },
      "correct_answer": "B",
      "explanation": "In African cosmological thought, physical nature and moral governance are intertwined; ecological healing (rain) arrives only when ethical leadership and ancestral harmony are restored."
    },
    {
      "item_number": 3,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Post-Colonial STEM Philosophy",
      "question": "What profound philosophical statement is made by Abubakar and Abidatu choosing to house advanced UV purification technology within an indigenous calabash?",
      "options": {
        "A": "Plastic and metallic components were banned by the Karaga Senior High School administration",
        "B": "Authentic sustainable development occurs when modern scientific innovation is integrated into indigenous cultural heritage rather than displacing it",
        "C": "Imported lab containers were too heavy for the students to transport on the bus to Tamale",
        "D": "The calabash was used solely as a deceptive cover to hide the invention from corporate competitors"
      },
      "correct_answer": "B",
      "explanation": "Housing contemporary STEM technology in an indigenous calabash symbolizes the synthesis of modern empirical science with African cultural heritage and local materials."
    },
    {
      "item_number": 4,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Socio-Political Critique & Neocolonialism",
      "question": "How does 'Forest Gold' dissect the socio-political mechanism of 'resource curse' in rural developing economies?",
      "options": {
        "A": "By showing that mineral-rich communities naturally become sovereign independent city-states",
        "B": "By illustrating how the discovery of valuable minerals enriches external prospectors while leaving indigenous communities with poisoned rivers, disease, and destroyed farmland",
        "C": "By proving that rural farmers deliberately abandon agricultural land to invest in stock markets",
        "D": "By arguing that ancient African gold mines were cursed by mythical subterranean serpents"
      },
      "correct_answer": "B",
      "explanation": "The text examines the classic resource curse: mineral wealth brings rapid extractive degradation, water pollution, and disease to locals, while capital flows out to opportunists."
    },
    {
      "item_number": 5,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Criticism & Gender Theory",
      "question": "Why does Mummy's defensive retort\u2014'If you had helped me, we would have been gone'\u2014serve as the thematic fulcrum of 'The Monday Breeze'?",
      "options": {
        "A": "It exposes her complete refusal to support her husband's corporate career",
        "B": "It exposes the structural hypocrisy of the patriarchal division of labor, where men demand punctuality while refusing domestic responsibility",
        "C": "It proves that the family van was suffering from an unaddressed mechanical engine fault",
        "D": "It signals that the mother intended to cancel the children's school attendance for the day"
      },
      "correct_answer": "B",
      "explanation": "Mummy's retort dismantles the father's impatience by exposing the unfair domestic double burden: she is blamed for lateness caused by managing the entire household alone."
    },
    {
      "item_number": 6,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Tragic Foil & Political Psychology",
      "question": "In what way is Anzansi's psychological trajectory a textbook study in hubristic political downfall?",
      "options": {
        "A": "He relies excessively on foreign mercenary soldiers to wage war against Anfani",
        "B": "His overweening pride and contempt for Dawuni blind him to the moral resilience and ancestral loyalty of the village elders, causing his plot to implode",
        "C": "He converts to a foreign religion that forbids him from entering the royal palace",
        "D": "He voluntarily yields the royal throne after suffering a physical injury in the sacred grove"
      },
      "correct_answer": "B",
      "explanation": "Anzansi's hubris leads him to underestimate Dawuni and the power of communal moral integrity, resulting in his total defeat."
    },
    {
      "item_number": 7,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Pedagogical Epistemology",
      "question": "How does Dr. Iddrisu's mentorship style challenge authoritarian pedagogical traditions in West African education?",
      "options": {
        "A": "He does the laboratory calculations himself and forces the students to memorize his work",
        "B": "He adopts a collaborative, inquiry-based model that respects student agency, guiding rather than dictating their research",
        "C": "He encourages the students to reject peer-reviewed scientific methods in favor of guesswork",
        "D": "He demands financial royalties before agreeing to review their notebook blueprints"
      },
      "correct_answer": "B",
      "explanation": "Dr. Iddrisu models progressive mentorship by acting as an encouraging facilitator who values youth inquiry, self-reliance, and independent critical thinking."
    },
    {
      "item_number": 8,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective & Irony",
      "question": "What unique literary effect is achieved by the third-person omniscient narrator granting the reader access to Chief Daakye Asem's internal guilt?",
      "options": {
        "A": "It justifies the Chief's decision to accept bribes from the prospecting syndicate",
        "B": "It transforms the Chief from a cartoonish villain into a tragic, conflicted leader wrestling with the catastrophic fallout of his own short-sightedness",
        "C": "It proves that the Chief was secretly conspiring with Zakari from the very beginning",
        "D": "It removes all moral blame from the foreign miners operating the earthmovers"
      },
      "correct_answer": "B",
      "explanation": "Omniscience reveals the Chief's interior torment and remorse, depicting him as a flawed, tragic figure who failed in his duty of stewardship."
    },
    {
      "item_number": 9,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Acoustic Mechanics & Phonaesthetics",
      "question": "Analyze how the acoustic texture of 'The Monday Breeze' reinforces its thematic agitation.",
      "options": {
        "A": "The poet relies entirely on soothing liquid consonants like /l/ and /m/ to lull the reader to sleep",
        "B": "The harsh plosives and sibilants in 'Blurring horns', 'Screaming', and 'purse' generate an acoustic cacophony mirroring urban traffic stress",
        "C": "The poem mimics the rhythmic cadence of an Akan praise poem performed at a royal durbar",
        "D": "The complete absence of spoken dialogue creates a silent, meditative atmosphere"
      },
      "correct_answer": "B",
      "explanation": "Acoustic harshness and sharp consonant clusters recreate the jarring, stress-inducing auditory environment of commuter rush hour."
    },
    {
      "item_number": 10,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Symbolism & Political Legitimacy",
      "question": "Why is Prince Dawuni's transformation required to take place before he touches the 'Sacred Staff' in Act 7, Scene 1?",
      "options": {
        "A": "The staff was physically locked in a vault that only sober individuals could unlock",
        "B": "In traditional jurisprudence, the regalia is not a magical talisman of power, but a holy covenant that destroys any corrupt ruler who touches it unworthily",
        "C": "Anzansi had replaced the genuine staff with an iron weapon",
        "D": "Elder Anfani required Dawuni to pay an ancestral fee before handling royal property"
      },
      "correct_answer": "B",
      "explanation": "Traditional regalia embodies ancestral purity; spiritual law requires the prince to undergo moral cleansing and sobriety before touching the sacred staff."
    },
    {
      "item_number": 11,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sociological Symbolism",
      "question": "In 'A Calabash of Saha', what does the contrast between the 'sun-baked streets of Karaga' and the 'brilliant lights of the auditorium in Accra' symbolize?",
      "options": {
        "A": "The climatic difference between the Sahara Desert and the Atlantic coastline",
        "B": "The socio-economic disparity between neglected peripheral rural communities and the centralized institutional privilege of the capital",
        "C": "The complete failure of northern schools to participate in national academic competitions",
        "D": "The superiority of urban lifestyle choices over traditional northern culture"
      },
      "correct_answer": "B",
      "explanation": "The juxtaposition highlights the stark divide between underdeveloped rural areas and the centralized wealth, platforms, and visibility of Accra."
    },
    {
      "item_number": 12,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Ecocritical Theory & Symbolism",
      "question": "How does the personification of the Daakye River ('The water itself seemed to have turned against its inhabitants') reflect ecocritical theory?",
      "options": {
        "A": "It shows that the river was possessed by malicious mythological water spirits",
        "B": "It presents the ecosystem as an active, suffering agent that retaliates against human exploitation through disease and poisoned fish",
        "C": "It proves that the villagers had stopped using water for domestic hygiene",
        "D": "It suggests that chemical pollution improves the agricultural fertility of riverbanks"
      },
      "correct_answer": "B",
      "explanation": "Ecocriticism views nature as an interconnected, sentient participant; when degraded by human greed, the ecosystem's toxicity acts as nature's rebellion."
    },
    {
      "item_number": 13,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structural Irony & Title Function",
      "question": "How does the structural brevity of 'The Monday Breeze' (5 couplets) deepen the irony of its pastoral title?",
      "options": {
        "A": "It gives the reader time to reflect on long historical events",
        "B": "The rapid, breathless 10-line structure deprives the reader of the calm, leisurely pace that the word 'Breeze' deceptively promises",
        "C": "It forces the reader to recite the poem in a whisper",
        "D": "It indicates that the poet was unable to complete an entire sonnet"
      },
      "correct_answer": "B",
      "explanation": "The tight, clipped structure creates speed and anxiety, denying the reader the expansive relaxation suggested by a 'breeze'."
    },
    {
      "item_number": 14,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Gender Dynamics & Heroic Agency",
      "question": "Why is Alheri fundamentally defined as a non-traditional heroine in pre-colonial African drama?",
      "options": {
        "A": "She physically leads the royal infantry into battle armed with iron spears",
        "B": "She exercises leadership through intellectual counsel, emotional resilience, and spiritual grounding, serving as the essential catalyst for male redemption",
        "C": "She deposes Dawuni and crowns herself absolute monarch of the northern kingdom",
        "D": "She rejects traditional African marriage customs to establish a trading monopoly"
      },
      "correct_answer": "B",
      "explanation": "Her heroism is intellectual, spiritual, and emotional; she acts as the visionary anchor whose wisdom reshapes the destiny of an entire kingdom."
    },
    {
      "item_number": 15,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Epistemological Synthesis",
      "question": "In 'A Calabash of Saha', how does the resolution redefine the concept of 'wealth' in contemporary northern Ghanaian discourse?",
      "options": {
        "A": "Wealth is measured exclusively by the amount of international foreign currency won at science fairs",
        "B": "True wealth is redefined as community health, youth self-reliance, and clean water restoration rather than private accumulation",
        "C": "Wealth is achieved by abandoning agriculture to take up civil service jobs in Accra",
        "D": "Wealth consists of building luxury shopping malls in the district capital"
      },
      "correct_answer": "B",
      "explanation": "The text redefines wealth away from individual material greed toward collective well-being, public health, and social empowerment."
    },
    {
      "item_number": 16,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Narrative Architecture & Caesura",
      "question": "What is the stylistic significance of the sentence pauses (caesura) during the descriptive depiction of the ruined Daakye River?",
      "options": {
        "A": "They indicate that the printing press suffered mechanical ink shortages",
        "B": "They impose somber moments of silence that force the reader to confront the tragic reality of environmental desecration",
        "C": "They signal the arrival of police detachments from the capital",
        "D": "They indicate that the characters are speaking in traditional proverbs"
      },
      "correct_answer": "B",
      "explanation": "Caesuras break syntactic flow, forcing contemplative pauses that underscore mourning and ecological loss."
    },
    {
      "item_number": 17,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Domestic Semiotics",
      "question": "How does 'the purse' function as a semiotic symbol of the gendered division of mental labor in 'The Monday Breeze'?",
      "options": {
        "A": "It represents excessive personal vanity and spending on cosmetics",
        "B": "It encapsulates the complex, invisible administrative burden of running a household that men overlook during morning panic",
        "C": "It symbolizes a woman's refusal to contribute to school transport fares",
        "D": "It proves that the family was living below the national poverty line"
      },
      "correct_answer": "B",
      "explanation": "The purse holds keys, money, medicines, and lunch logistics\u2014embodying the unseen organizational burden carried by mothers."
    },
    {
      "item_number": 18,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Theatrical Structure & Dramatic Monologue",
      "question": "What function does Prince Dawuni's rhetorical question\u2014'What will the future hold?'\u2014serve at the conclusion of Act 8, Scene 1?",
      "options": {
        "A": "It reveals that he intends to abdicate the stool the following morning",
        "B": "It shatters dramatic complacency, reminding the audience that ethical governance is an unceasing moral trial, not a guaranteed status",
        "C": "It proves that he has relapsed into his former alcoholism",
        "D": "It invites the spectators to vote on whether Anzansi should be executed"
      },
      "correct_answer": "B",
      "explanation": "The closing rhetorical inquiry leaves the drama open-ended, showing that maintaining justice requires continuous moral vigilance."
    },
    {
      "item_number": 19,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Critical Synthesis & Motif Tracking",
      "question": "Why is the recurring phrase 'drop of water in the ocean' analytically significant when evaluating the scale of the Saha System?",
      "options": {
        "A": "It proves that their water purification machine was chemically ineffective",
        "B": "It paradoxically balances humility with monumental impact, showing that localized grassroots innovations catalyze national transformation",
        "C": "It shows that the inventors intended to desalinate the Atlantic Ocean",
        "D": "It indicates that the Ghanaian Ministry of Science rejected their project"
      },
      "correct_answer": "B",
      "explanation": "The metaphor captures paradox: while one machine is a humble drop, its proof-of-concept sparks systemic national policy changes."
    },
    {
      "item_number": 20,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Tragic Irony & Symbolism",
      "question": "In 'Forest Gold', how does the faded signpost ('Daakye Asem - Land of Gold') function as a structural device of tragic situational irony?",
      "options": {
        "A": "It proves that the village sign painter was illiterate",
        "B": "It stands as a mocking monument to unfulfilled greed, where the pursuit of gold destroyed the community's real treasure\u2014its river and health",
        "C": "It shows that the village was established by European prospectors",
        "D": "It demonstrates that the mining company built modern asphalt roads into the forest"
      },
      "correct_answer": "B",
      "explanation": "The sign's proud proclamation mocks the ruined landscape, standing as an ironic testament to how chasing gold destroyed life itself."
    },
    {
      "item_number": 21,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis & Commuter Psychology",
      "question": "How does the final image of children 'settling in van' resolve the emotional tension of the poem?",
      "options": {
        "A": "It shows that the children were terrified of their father's violent anger",
        "B": "It marks the containment of domestic pandemonium into the orderly, mechanical routine of public life",
        "C": "It proves that the family decided to emigrate permanently to another city",
        "D": "It signals that the school day has officially ended"
      },
      "correct_answer": "B",
      "explanation": "The poem concludes with physical containment: the chaotic shouting ceases as the family is packed into the vehicle for school."
    },
    {
      "item_number": 22,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Intersections & Justice",
      "question": "Why does the dramatic code of 'Dawuni\u2019s Dream' forbid the protagonist from executing Anzansi at the climax?",
      "options": {
        "A": "Anzansi was protected by diplomatic immunity from a neighboring kingdom",
        "B": "True heroic redemption is demonstrated through restorative justice and moral superiority rather than tyrannical bloodlust",
        "C": "Dawuni lacked sufficient soldiers to carry out an execution",
        "D": "Anfani demanded that Anzansi be appointed chief justice of the kingdom"
      },
      "correct_answer": "B",
      "explanation": "Executing Anzansi would recreate his tyrannical cruelty; Dawuni proves his fitness to rule by breaking the cycle of violence through justice."
    },
    {
      "item_number": 23,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Linguistic & Cultural Synthesis",
      "question": "What is the rhetorical significance of integrating local terminology ('Saha') within an empirical science narrative?",
      "options": {
        "A": "It shows that the authors were unable to find an appropriate English equivalent",
        "B": "It decolonizes scientific language, asserting that indigenous terms can describe cutting-edge technological innovations",
        "C": "It was intended to prevent southern competitors from understanding the project design",
        "D": "It implies that the purification system can only function in the Northern Region"
      },
      "correct_answer": "B",
      "explanation": "Using 'Saha' elevates local language into technological discourse, proving that indigenous culture and science are harmonious."
    },
    {
      "item_number": 24,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Comparative Character Dynamics",
      "question": "How does Zakari's transformation from frustration to activism contrast with Osmond's stagnation in 'Forest Gold'?",
      "options": {
        "A": "Zakari grows into an enlightened community leader, while Osmond remains trapped in narrow, self-destructive material greed",
        "B": "Zakari becomes an international politician while Osmond takes up organic cocoa farming",
        "C": "Zakari loses his ancestral farmland while Osmond donates his mining profits to the school",
        "D": "Zakari leaves Ghana entirely while Osmond marries into the royal family"
      },
      "correct_answer": "A",
      "explanation": "Zakari evolves through civic courage, while Osmond remains a static caricature of exploitative greed until his isolation."
    },
    {
      "item_number": 25,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Prosody & Meter",
      "question": "Why is the rhythm of 'The Monday Breeze' described as 'staccato'?",
      "options": {
        "A": "It contains extended, flowing epic hexameters resembling Homer's poetry",
        "B": "Its short, abrupt lines and rapid syllable counts create a sharp, detached, and hurried beat",
        "C": "It is accompanied by classical church organ music",
        "D": "It uses monotone end-rhymes across every couplet"
      },
      "correct_answer": "B",
      "explanation": "Staccato rhythm consists of short, sharp, disconnected beats that mirror the abrupt, hurried actions of the morning."
    },
    {
      "item_number": 26,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Sociological Archetypes",
      "question": "In 'Dawuni\u2019s Dream', how does Elder Anfani function as a sociological archetype in African dramaturgy?",
      "options": {
        "A": "The comic court jester who mocks the royal court",
        "B": "The ancestral custodian and moral compass who checks authoritarian excesses and preserves community memory",
        "C": "The corrupt priest who sells spiritual favors to the highest bidder",
        "D": "The foreign diplomat representing imperial interests"
      },
      "correct_answer": "B",
      "explanation": "Anfani embodies the traditional African elder: the moral foundation of society who ensures rulers remain accountable to ancestral ethics."
    },
    {
      "item_number": 27,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Foreshadowing & Narrative Suspense",
      "question": "How does the author generate narrative suspense during the competitive judging at the Pan African Science Festival?",
      "options": {
        "A": "By having a violent thunderstorm cut off electrical power across Accra",
        "B": "By highlighting the contrast between elite, high-budget corporate competitors and the rustic simplicity of the Saha prototype",
        "C": "By having Dr. Iddrisu lose the technical blueprints in a taxi",
        "D": "By having the judges threaten to disqualify all Ghanaian high schools"
      },
      "correct_answer": "B",
      "explanation": "Tension is built on the underdog dynamic: whether their low-cost, local calabash can defeat well-funded international technology."
    },
    {
      "item_number": 28,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Literary Realism & Ecological Law",
      "question": "Why does 'Forest Gold' conclude without restoring the Daakye River to its original crystal purity?",
      "options": {
        "A": "The villagers ran out of water testing strips",
        "B": "It refuses simplistic escapism, honoring environmental realism by showing that chemical pollution causes lasting ecological damage",
        "C": "The author intended to show that mining is stronger than human will",
        "D": "The villagers decided to build a gold refinery over the riverbed"
      },
      "correct_answer": "B",
      "explanation": "A realistic resolution warns readers that stopping mining does not instantly undo chemical contamination; nature bears permanent scars."
    },
    {
      "item_number": 29,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Criticism & Class Politics",
      "question": "What does the ownership of a private family van reveal about the socio-economic class setting of 'The Monday Breeze'?",
      "options": {
        "A": "The family belongs to the destitute rural peasantry",
        "B": "The family represents the rising urban middle class, experiencing the unique strains of professional employment and school logistics",
        "C": "The family lives in an uncontacted traditional fishing settlement",
        "D": "The parents are high-ranking military commanders"
      },
      "correct_answer": "B",
      "explanation": "Owning a car and navigating urban commutes places the family in the contemporary middle-class commuter demographic."
    },
    {
      "item_number": 30,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Technique & Irony",
      "question": "What makes Anzansi's defeat in Act 3, Scene 1 a classic demonstration of dramatic peripeteia (reversal of fortune)?",
      "options": {
        "A": "He was struck by lightning inside the shrine",
        "B": "The very moment he believes he has consolidated power marks the exposure of his treason and the collapse of his ambition",
        "C": "He voluntarily resigns his position to become a subsistence farmer",
        "D": "The King of Dagbon arrives with an army to arrest him"
      },
      "correct_answer": "B",
      "explanation": "Peripeteia occurs when an action produces the exact opposite of the intended result; Anzansi's triumph turns into sudden ruin."
    },
    {
      "item_number": 31,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Epistemological Synthesis",
      "question": "In 'A Calabash of Saha', what separates authentic scientific innovation from mere academic theory?",
      "options": {
        "A": "The ability to memorize difficult German chemistry textbooks",
        "B": "Applying empirical principles directly to alleviate acute human suffering and improve communal living conditions",
        "C": "Winning large financial cash prizes at urban science fairs",
        "D": "Relocating from rural villages to foreign corporate laboratories"
      },
      "correct_answer": "B",
      "explanation": "The text asserts that true science finds its highest purpose in solving real-world human suffering at the community level."
    },
    {
      "item_number": 32,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Foils & Motivation",
      "question": "How does Elder Onyimdze's carved walking stick function symbolically throughout 'Forest Gold'?",
      "options": {
        "A": "A lethal weapon used to smash mining excavators",
        "B": "An emblem of traditional authority, grounded wisdom, and steady resistance against commercial exploitation",
        "C": "A surveyor's tool used to measure mining boundaries",
        "D": "A magical staff that locates underground clean water springs"
      },
      "correct_answer": "B",
      "explanation": "The walking stick planted in the mud symbolizes unwavering elder integrity and deep roots in the ancestral land."
    },
    {
      "item_number": 33,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics & Dialogue",
      "question": "What is the rhetorical impact of inserting direct, unadorned dialogue ('I am late, Daddy yells') into the poem?",
      "options": {
        "A": "It converts the lyric poem into a formal classical Greek play",
        "B": "It injects visceral, dramatic immediacy that shatters poetic detachment and grounds the scene in recognizable family reality",
        "C": "It proves that the poet forgot to use standard punctuation marks",
        "D": "It signals that the father is reciting a dramatic monologue on stage"
      },
      "correct_answer": "B",
      "explanation": "Direct speech injects raw domestic urgency, making the stress immediate, audible, and emotionally authentic."
    },
    {
      "item_number": 34,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Intersections & Ethics",
      "question": "What does Dawuni's path reveal about the nature of royal privilege in pre-colonial Ghana?",
      "options": {
        "A": "Princes were permitted to act with complete impunity without elder review",
        "B": "Royal lineage grants no moral exemption; leadership is a heavy ethical burden that requires discipline and public service",
        "C": "Monarchs were required to amass private merchant empires before taking the throne",
        "D": "The throne belongs automatically to the wealthiest nobleman in the territory"
      },
      "correct_answer": "B",
      "explanation": "The play emphasizes that royalty is a moral covenant; privilege without virtue and service is illegitimate."
    },
    {
      "item_number": 35,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Pedagogical Sub-Text",
      "question": "How does the story 'A Calabash of Saha' model gender parity in secondary education?",
      "options": {
        "A": "By showing that female students should focus entirely on humanities while males handle science",
        "B": "By presenting Abidatu as an equal co-thinker whose assertiveness and intellect are vital to every stage of technical development",
        "C": "By portraying Abubakar as a passive bystander who merely watches Abidatu work",
        "D": "By arguing that boys and girls should attend separate technical high schools"
      },
      "correct_answer": "B",
      "explanation": "The narrative avoids gender tokens, presenting an equitable partnership where both partners contribute equally to innovation."
    },
    {
      "item_number": 36,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis & Grassroots Agency",
      "question": "What structural role does the youth's non-violent blockade play in the climax of 'Forest Gold'?",
      "options": {
        "A": "It shows that the youth were too afraid to use physical force against the miners",
        "B": "It demonstrates that disciplined, united civic resistance possesses the moral authority to halt well-funded corporate exploitation",
        "C": "It proves that the youth intended to negotiate a higher percentage of the gold royalties",
        "D": "It signals that the villagers were waiting for foreign military intervention"
      },
      "correct_answer": "B",
      "explanation": "The peaceful blockade models the power of moral solidarity, proving that community resolve can overpower industrial machinery."
    },
    {
      "item_number": 37,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Stylistic Devices & Tone",
      "question": "Why does the poet refrain from naming specific Ghanaian metropolitan landmarks in 'The Monday Breeze'?",
      "options": {
        "A": "The poet was unfamiliar with the geography of Accra and Kumasi",
        "B": "To elevate the commuter struggle into a universal urban reality experienced across modern African cities",
        "C": "To prevent transportation companies from suing the publisher for defamation",
        "D": "Because the poem is set in a small agrarian fishing village"
      },
      "correct_answer": "B",
      "explanation": "Omitting specific street names gives the domestic rush universal resonance across any contemporary African city."
    },
    {
      "item_number": 38,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Exposition",
      "question": "How does the opening scene of 'Dawuni\u2019s Dream' establish the psychological stakes of the drama?",
      "options": {
        "A": "By showing Dawuni winning a wrestling competition against neighboring princes",
        "B": "By presenting Dawuni in a state of self-indulgence and moral disorientation, establishing the depth from which he must rise",
        "C": "By staging the funeral rites of King Anfani",
        "D": "By showing foreign traders signing mining concessions with Anzansi"
      },
      "correct_answer": "B",
      "explanation": "Showing the prince at his lowest point establishes the dramatic arc of redemption and self-mastery."
    },
    {
      "item_number": 39,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Hyperbole",
      "question": "What is the thematic function of the hyperbolic claim that 'Their innovation would change the world'?",
      "options": {
        "A": "It satirizes the naive, unrealistic dreams of rural schoolchildren",
        "B": "It captures the transformative potential of grassroots innovation, asserting that local solutions have global relevance",
        "C": "It proves that the judges at the science festival were dishonest",
        "D": "It indicates that the Saha System was patented by a multinational corporation"
      },
      "correct_answer": "B",
      "explanation": "The hyperbole elevates youth agency, conveying that local innovations hold the potential to inspire solutions worldwide."
    },
    {
      "item_number": 40,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Narrative Imagery",
      "question": "How does the author use olfactory and visual imagery to depict the desecration of the Daakye River?",
      "options": {
        "A": "By describing sweet-smelling water lilies and crystal cascades",
        "B": "By evoking the chemical stench of stagnant fuel and the murky brown color of over-steeped tea",
        "C": "By describing clear spring water surrounded by fragrant cocoa trees",
        "D": "By describing children swimming happily in the afternoon currents"
      },
      "correct_answer": "B",
      "explanation": "Describing stagnant, tea-colored water and oily chemical smells conveys the visceral reality of industrial poisoning."
    },
    {
      "item_number": 41,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft & Irony",
      "question": "In 'The Monday Breeze', what underlying truth is exposed by the repetition of morning rushing?",
      "options": {
        "A": "Families in modern cities enjoy chaotic mornings as a form of recreation",
        "B": "Modern institutional life imposes repetitive, mechanical stress that strains personal relationships",
        "C": "Commuters deliberate over vehicle routes because fuel prices are low",
        "D": "Mothers prefer staying late at home rather than arriving at offices on time"
      },
      "correct_answer": "B",
      "explanation": "The cyclical scramble shows how modern working hours turn family mornings into a stressful, repetitive routine."
    },
    {
      "item_number": 42,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Theatrical Blocking",
      "question": "What is the symbolic meaning of Prince Dawuni standing between the Sacred Grove and the Royal Palace in Act 4?",
      "options": {
        "A": "He is planning to build a stone wall between the two locations",
        "B": "It visually captures his psychological crossroads: torn between ancestral spiritual ethics and worldly political ambition",
        "C": "He is hiding from Anzansi's royal palace guards",
        "D": "He is conducting a routine boundary survey of kingdom lands"
      },
      "correct_answer": "B",
      "explanation": "Positioning him between the grove and palace dramatizes his internal struggle between spiritual truth and raw power."
    },
    {
      "item_number": 43,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Climax",
      "question": "Why is the validation of the Saha System by the Ghanaian President a structural climax for the narrative?",
      "options": {
        "A": "It allows the inventors to drop out of Karaga Senior High School permanently",
        "B": "It bridges peripheral rural youth initiative with state authority, validating grassroots science at the national level",
        "C": "It proves that the Ministry of Science had designed the machine all along",
        "D": "It forces Dr. Iddrisu to resign his university lecturership in Tamale"
      },
      "correct_answer": "B",
      "explanation": "The presidential meeting marks the highest validation, transforming a village science project into an officially recognized national asset."
    },
    {
      "item_number": 44,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections & Ethics",
      "question": "How does 'Forest Gold' handle the theme of generational accountability?",
      "options": {
        "A": "By arguing that children should be punished for the commercial contracts signed by their parents",
        "B": "By asserting through Elder Onyimdze that each generation is a temporary custodian obligated to pass on clean land and water",
        "C": "By showing that youth should avoid consulting elders regarding natural resources",
        "D": "By proving that ancient traditions have no place in modern environmental law"
      },
      "correct_answer": "B",
      "explanation": "The text frames conservation as an ancestral covenant: the present generation must hold natural resources in trust for the future."
    },
    {
      "item_number": 45,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Poetic Craft & Stanzaic Design",
      "question": "Why does the poet construct 'The Monday Breeze' entirely of couplets rather than longer stanzas?",
      "options": {
        "A": "To save printing paper in school anthologies",
        "B": "The two-line couplets mirror the hurried back-and-forth exchanges between family members under stress",
        "C": "Because the poet was translating an ancient Latin pastoral hymn",
        "D": "To allow two different narrators to recite alternating lines in harmony"
      },
      "correct_answer": "B",
      "explanation": "Couplets create balanced, alternating units that capture rapid dialogue and fragmented morning interactions."
    },
    {
      "item_number": 46,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Cultural Institutions",
      "question": "In 'Dawuni\u2019s Dream', why is the communal 'Rain Dance' in Act 4, Scene 2 placed under the guidance of elders rather than warriors?",
      "options": {
        "A": "The warriors had all been killed in border wars",
        "B": "The dance is a spiritual act of repentance and alignment with nature, requiring moral wisdom rather than physical force",
        "C": "The warriors were busy guarding the palace gold treasury from Anzansi",
        "D": "Traditional northern custom bans men with weapons from dancing"
      },
      "correct_answer": "B",
      "explanation": "Ending the drought requires moral humility and spiritual alignment, which the elders mediate through tradition."
    },
    {
      "item_number": 47,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "Why do Abubakar and Abidatu refuse private corporate buyouts of the Saha System patent?",
      "options": {
        "A": "They were offered foreign currency that was illegal to bank in Ghana",
        "B": "Their core motivation is social service and eradicating waterborne disease in Karaga, not personal enrichment",
        "C": "Dr. Iddrisu forbade them from talking to corporate attorneys in Accra",
        "D": "The machine was too damaged to pass commercial safety inspections"
      },
      "correct_answer": "B",
      "explanation": "Their project is driven by community service; selling out to corporations would compromise their goal of providing free clean water."
    },
    {
      "item_number": 48,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Political Realism",
      "question": "What does the complicity of Chief Daakye Asem reveal about governance in resource-rich rural areas?",
      "options": {
        "A": "Traditional chiefs possess absolute immunity from national environmental courts",
        "B": "Traditional rulers can be misled by the promise of rapid modernisation, sacrificing their people's future for short-term gain",
        "C": "Rural monarchs are completely unaware of mining technologies",
        "D": "Gold mining companies always honor their verbal promises to rural villages"
      },
      "correct_answer": "B",
      "explanation": "His arc critiques how local leadership can be seduced by promises of wealth, allowing predatory extraction to bypass scrutiny."
    },
    {
      "item_number": 49,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Atmosphere",
      "question": "How does the poet sustain the acoustic atmosphere of commuter anxiety throughout 'The Monday Breeze'?",
      "options": {
        "A": "By describing calm, empty streets across the municipality",
        "B": "By layering street sounds over domestic shouting, creating an inescapable wall of noise",
        "C": "By concluding every stanza with a reference to morning birdsong",
        "D": "By alternating between whisperings and long periods of silent pause"
      },
      "correct_answer": "B",
      "explanation": "Layering street cacophony with domestic conflict ensures the tension remains unbroken from first line to last."
    },
    {
      "item_number": 50,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Irony",
      "question": "Where does the dramatic irony lie when Anzansi attempts to weaponize Dawuni's past drunkenness against him in Act 5?",
      "options": {
        "A": "The village elders had also begun drinking palm wine in secret",
        "B": "Anzansi believes Dawuni is still paralyzed by alcohol, unaware that the prince has quietly achieved sobriety and moral clarity",
        "C": "Anzansi himself was intoxicated during the council meeting",
        "D": "Dawuni had already relocated to another kingdom"
      },
      "correct_answer": "B",
      "explanation": "The irony lies in Anzansi attacking a phantom weakness: Dawuni has already reformed, leaving Anzansi's weapon powerless."
    },
    {
      "item_number": 51,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Socio-Environmental Politics",
      "question": "In 'A Calabash of Saha', why is water contamination framed as a violation of human dignity?",
      "options": {
        "A": "It prevents wealthy villagers from operating swimming pools",
        "B": "It forces children to drink contaminated water, spreading illness and trapping families in cycles of poverty and lost schooling",
        "C": "It lowers property values for commercial real estate developers in Karaga",
        "D": "It forces high schools to cancel sporting competitions"
      },
      "correct_answer": "B",
      "explanation": "Unsafe water is presented as a structural injustice that damages health, interrupts education, and undermines human dignity."
    },
    {
      "item_number": 52,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Metonymy",
      "question": "In 'Forest Gold', how does the word 'gold' evolve from a physical mineral into a metonymy for human greed?",
      "options": {
        "A": "The author reveals that the mineral was actually polished iron pyrite",
        "B": "The word ceases to mean a chemical element and comes to represent the destructive obsession with wealth that poisons societal values",
        "C": "The prospectors used gold dust as currency in village shops",
        "D": "The villagers believed gold possessed magical healing properties"
      },
      "correct_answer": "B",
      "explanation": "Through repeated thematic associations, 'gold' shifts from an ore into a metonym for the unchecked greed that ruins community life."
    },
    {
      "item_number": 53,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Insight",
      "question": "What does the father's yell\u2014'I am late'\u2014reveal about the psychological pressures of modern wage labor?",
      "options": {
        "A": "He is planning to resign from his job to become a full-time poet",
        "B": "Modern corporate employment demands rigid obedience to the clock, turning tardiness into an existential anxiety that strains domestic peace",
        "C": "He is eager to arrive at work because he enjoys long meetings",
        "D": "He fears missing the early morning office breakfast buffet"
      },
      "correct_answer": "B",
      "explanation": "His outburst illustrates how the strict discipline of modern wage employment introduces stress into the home."
    },
    {
      "item_number": 54,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Architecture",
      "question": "How does the pacing of 'Dawuni\u2019s Dream' mirror the psychological recovery of the protagonist?",
      "options": {
        "A": "The play begins with fast-paced comedic scenes and ends in slow funeral dirges",
        "B": "It opens with disjointed, chaotic scenes reflecting his drunken confusion, gradually steadying into measured dialogue as he gains discipline",
        "C": "Every act is structured around identical thirty-minute wrestling bouts",
        "D": "The drama moves backwards in time using non-linear flashbacks"
      },
      "correct_answer": "B",
      "explanation": "Dramatic pacing mirrors psychology: erratic, unfocused scenes settle into purposeful, dignified exchanges as Dawuni matures."
    },
    {
      "item_number": 55,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Comparative Epistemology",
      "question": "What is the structural effect of contrasting the rural workshop in Karaga with the air-conditioned conference hall in Accra?",
      "options": {
        "A": "It shows that innovation is impossible in rural areas without corporate air conditioning",
        "B": "It underscores the resourcefulness of the students, showing that breakthrough ideas are born of lived hardship rather than luxury",
        "C": "It proves that Accra is the only city in Ghana where science should be taught",
        "D": "It suggests that Abubakar and Abidatu refused to return home to Karaga"
      },
      "correct_answer": "B",
      "explanation": "The contrast emphasizes that genuine problem-solving emerges from frontline struggle and necessity, not luxury."
    },
    {
      "item_number": 56,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Stylistic Craft",
      "question": "Why does the narrator in 'Forest Gold' refer to the mining excavators as 'monsters' or 'earthmovers' tearing into ancestral soil?",
      "options": {
        "A": "To indicate that the construction equipment was painted with dragon imagery",
        "B": "To frame heavy mining machinery as predatory, unnatural invaders violating the sacred body of the ancestral land",
        "C": "To show that the machines were operated by foreign mythical beasts",
        "D": "Because the villagers had never seen wheeled motor vehicles before"
      },
      "correct_answer": "B",
      "explanation": "Diction depicting machines as monsters reinforces the theme of industrial violence against a living natural ecosystem."
    },
    {
      "item_number": 57,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Stylistic Symmetry",
      "question": "How do the opening and closing couplets of 'The Monday Breeze' frame the central domestic crisis?",
      "options": {
        "A": "Both couplets take place at night inside an empty school classroom",
        "B": "The poem opens with chaotic auditory noise in the public sphere and closes with the family contained inside the van, ready for the journey",
        "C": "The poem opens with a funeral and closes with a wedding celebration",
        "D": "The poem begins in rural Ghana and concludes at a European airport"
      },
      "correct_answer": "B",
      "explanation": "The structural frame moves from open external traffic chaos into domestic enclosure, completing the morning transit arc."
    },
    {
      "item_number": 58,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis & Ubuntu",
      "question": "How does 'Dawuni\u2019s Dream' reflect the African philosophy of Ubuntu ('I am because we are')?",
      "options": {
        "A": "By showing that a king should rule through solitary force without consulting commoners",
        "B": "By demonstrating that the prince's individual recovery is incomplete until it brings reconciliation and rain to the entire community",
        "C": "By proving that only wealthy merchants have a voice in the village council",
        "D": "By arguing that personal wealth is the true indicator of civic virtue"
      },
      "correct_answer": "B",
      "explanation": "Ubuntu is demonstrated in that Dawuni's personal redemption finds meaning only through lifting his people out of drought and discord."
    },
    {
      "item_number": 59,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Pedagogical Realism",
      "question": "What is the pedagogical lesson behind Abubakar's initial failure to source the correct UV lamp?",
      "options": {
        "A": "High school students should abandon science if they lack ready-made commercial components",
        "B": "Engineering requires iterative trial-and-error, resilience, and resourcefulness in the face of material constraints",
        "C": "Imported foreign components are always inferior to domestic tools",
        "D": "Dr. Iddrisu provided the students with incorrect laboratory notes"
      },
      "correct_answer": "B",
      "explanation": "Showing their practical struggle reinforces that real-world scientific inquiry requires persistence through material roadblocks."
    },
    {
      "item_number": 60,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections & Activism",
      "question": "Why does Zakari insist on a non-violent physical shutdown rather than sabotaging the mining machines under cover of night?",
      "options": {
        "A": "The villagers lacked the tools required to dismantle industrial diesel engines",
        "B": "Open, non-violent civic resistance preserves the moral high ground, uniting the community and commanding national respect",
        "C": "Zakari was paid by Osmond to keep the protest peaceful",
        "D": "The Chief threatened to banish any youth who spoke against the mining syndicate"
      },
      "correct_answer": "B",
      "explanation": "Open, dignified resistance establishes moral legitimacy, rallying broad community support and inspiring surrounding villages."
    },
    {
      "item_number": 61,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Figures of Speech",
      "question": "Identify the literary device in 'Blurring horns' and explain its sensory function.",
      "options": {
        "A": "Synecdoche representing the entire automotive industry",
        "B": "Synesthesia combining visual blur with auditory noise to convey overwhelming sensory confusion",
        "C": "Euphemism designed to conceal harsh urban realities",
        "D": "Apostrophe addressing an absent vehicle operator"
      },
      "correct_answer": "B",
      "explanation": "Applying a visual descriptor ('blurring') to an auditory sound ('horns') creates synesthesia, evoking disorienting traffic noise."
    },
    {
      "item_number": 62,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Climax",
      "question": "What is the structural function of Act 6, Scene 2 where 'The ancestors smile upon us'?",
      "options": {
        "A": "It marks the tragic defeat and exile of Prince Dawuni",
        "B": "It marks the spiritual climax: moral alignment is achieved, ancestral approval is granted, and rain breaks the physical drought",
        "C": "It depicts the arrival of Christian missionaries into the northern territory",
        "D": "It signals that Anzansi has successfully seized the royal staff"
      },
      "correct_answer": "B",
      "explanation": "The scene represents the spiritual climax, where moral restoration is rewarded with the life-giving rains that save the kingdom."
    },
    {
      "item_number": 63,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Symbolism & Light",
      "question": "How does the symbolism of 'light' in 'A Calabash of Saha' differ from its use in classical European literature?",
      "options": {
        "A": "Light represents absolute physical destruction by fire",
        "B": "Light represents scientific knowledge and UV sterilization applied directly to preserve human life and solve water contamination",
        "C": "Light is associated entirely with divine judgment upon sinful kings",
        "D": "Light symbolizes the arrival of foreign colonizing armies"
      },
      "correct_answer": "B",
      "explanation": "Light is practical and empirical: it represents the UV wavelength that purifies water and the intellectual clarity that solves real problems."
    },
    {
      "item_number": 64,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Sociological Commentary",
      "question": "In 'Forest Gold', how does the author critique the complicity of the state regulatory machinery?",
      "options": {
        "A": "By showing environmental inspectors inspecting the village every morning",
        "B": "Through the glaring absence of mining inspectors, showing how rural areas are abandoned to unregulated exploitation",
        "C": "By describing national parks taking over the Daakye forest",
        "D": "By showing the police arresting Osmond in the opening chapter"
      },
      "correct_answer": "B",
      "explanation": "The institutional vacuum exposes how distant regulatory authorities leave rural communities to fend for themselves against extractors."
    },
    {
      "item_number": 65,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Linguistic Diction",
      "question": "Why does the poet use the verb 'settle' in the final line: 'children settle in van'?",
      "options": {
        "A": "To indicate that the children were punished and forced into silence",
        "B": "To denote the calming of physical and emotional turmoil as chaos resolves into stillness",
        "C": "To indicate that the vehicle had sunk into muddy potholes",
        "D": "To show that the children refused to travel to school"
      },
      "correct_answer": "B",
      "explanation": "'Settle' carries connotations of calm and resolution, marking the sudden easing of morning agitation once everyone is aboard."
    },
    {
      "item_number": 66,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Irony",
      "question": "How does the staging of the 'Sacred Cloth' in Act 7, Scene 1 heighten dramatic tension?",
      "options": {
        "A": "The cloth is torn into pieces by palace rioters",
        "B": "The audience knows Dawuni has earned the right to wear it through personal reform, while Anzansi remains ignorant of his defeat",
        "C": "The cloth had been cursed by neighboring tribal sorcerers",
        "D": "The cloth is auctioned to pay off kingdom debts"
      },
      "correct_answer": "B",
      "explanation": "Dramatic irony peaks as the audience sees Dawuni clothed in ancestral legitimacy while Anzansi still schemes in vain."
    },
    {
      "item_number": 67,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Development",
      "question": "What is the literary significance of Abubakar weeping with relief when the test strips show pure water?",
      "options": {
        "A": "It shows that he lacks emotional maturity to handle technical research",
        "B": "It humanizes the scientist, revealing that his motivation was deep compassion for his community rather than cold ambition",
        "C": "It proves that he had accidentally splashed acid into his eyes",
        "D": "It signals that Dr. Iddrisu had rejected the project"
      },
      "correct_answer": "B",
      "explanation": "His emotional release underscores that his drive was love for his neighbors, making his scientific triumph deeply moving."
    },
    {
      "item_number": 68,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'Forest Gold' use the image of children falling ill to catalyze communal resistance?",
      "options": {
        "A": "It leads the villagers to seek help from foreign pharmaceutical firms",
        "B": "It transforms environmental destruction from an abstract worry into an immediate moral emergency threatening the village's survival",
        "C": "It causes the Chief to permanently banish all medical doctors from the area",
        "D": "It prompts the villagers to blame Elder Onyimdze's herbal medicines"
      },
      "correct_answer": "B",
      "explanation": "Child illness makes the stakes undeniable, shattering complacency and uniting the entire village in direct action."
    },
    {
      "item_number": 69,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "In the final analysis, what does 'The Monday Breeze' argue about the modern African family unit?",
      "options": {
        "A": "It is completely incompatible with urban industrial civilization",
        "B": "It is a resilient, interdependent structure that endures economic strain through shared effort and mutual endurance",
        "C": "It will dissolve unless traditional rural farming routines are restored",
        "D": "It depends entirely on formal police discipline to maintain order"
      },
      "correct_answer": "B",
      "explanation": "Despite shouting and rushing, the family operates as an interdependent unit that pulls together through stress."
    },
    {
      "item_number": 70,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "African Dramaturgy",
      "question": "Why is 'Dawuni\u2019s Dream' properly designated as a 'Heroic Drama' rather than an ordinary domestic tragedy?",
      "options": {
        "A": "The characters communicate exclusively through traditional rhyming proverbs",
        "B": "The central conflict involves national destiny, kingship, ancestral continuity, and the preservation of an entire people",
        "C": "The play ends with the death of every principal character on stage",
        "D": "It was written to be performed only before traditional paramount chiefs"
      },
      "correct_answer": "B",
      "explanation": "Heroic drama centers on large-scale conflicts\u2014statecraft, ancestral virtue, and community survival\u2014rather than private petty quarrels."
    },
    {
      "item_number": 71,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sociological Synthesis",
      "question": "How does 'A Calabash of Saha' dismantle northern regional stereotypes in contemporary Ghanaian literature?",
      "options": {
        "A": "By portraying northern youth as passive recipients of southern charity",
        "B": "By presenting northern youth as brilliant innovators capable of designing solutions that win national acclaim and state recognition",
        "C": "By showing northern schools abandoning their traditional festivals",
        "D": "By depicting northern communities relying entirely on foreign imported bottled water"
      },
      "correct_answer": "B",
      "explanation": "The story replaces deficit narratives with youth empowerment, portraying northern students as visionary scientific leaders."
    },
    {
      "item_number": 72,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Ecocritical Synthesis",
      "question": "What is the ecocritical significance of the phrase 'the scarred riverbank' in 'Forest Gold'?",
      "options": {
        "A": "It refers to decorative patterns carved into mud by village children",
        "B": "It physicalizes industrial violence, framing the earth as a living body bearing permanent wounds from human exploitation",
        "C": "It proves that the river had dried up centuries before the miners arrived",
        "D": "It indicates that the gold prospectors had built stone retaining walls"
      },
      "correct_answer": "B",
      "explanation": "Framing the damaged earth as 'scarred' portrays mining as physical violence inflicted upon nature's living body."
    },
    {
      "item_number": 73,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft & Irony",
      "question": "How does the poet turn the ordinary search for a 'purse' into an indictment of societal expectations?",
      "options": {
        "A": "By showing that the purse contained stolen state documents",
        "B": "By highlighting how society expects mothers to handle every administrative detail flawlessly, yet ridicules them when pressure causes a delay",
        "C": "By having the father search through the mother's private correspondence",
        "D": "By proving that the purse was an unnecessary luxury item"
      },
      "correct_answer": "B",
      "explanation": "The episode highlights the unfair social double standard: mothers shoulder family logistics alone, yet are blamed when a detail slips."
    },
    {
      "item_number": 74,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Structure",
      "question": "What is the structural effect of placing Prince Dawuni's lowest moral point in Act 1 and his highest triumph in Act 8?",
      "options": {
        "A": "It creates an inverted pyramid structure where the play loses dramatic tension",
        "B": "It creates an expansive classical redemption arc, maximizing the moral distance traveled by the protagonist",
        "C": "It indicates that the middle six acts were written by a different playwright",
        "D": "It forces the audience to view Dawuni with permanent contempt"
      },
      "correct_answer": "B",
      "explanation": "Spacing his moral nadir and his ethical zenith across eight acts emphasizes the earned, gradual nature of true redemption."
    },
    {
      "item_number": 75,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective",
      "question": "Why is the objective third-person narration crucial to the credibility of 'A Calabash of Saha'?",
      "options": {
        "A": "It allows the author to insert personal political speeches into every chapter",
        "B": "It provides a balanced, empirical view of the scientific process without first-person bias or exaggeration",
        "C": "It prevents the reader from understanding Abidatu's internal thoughts",
        "D": "It hides the technical details of the water purification system"
      },
      "correct_answer": "B",
      "explanation": "Objective narration reports the engineering trials, setbacks, and triumphs with realistic, credible balance."
    },
    {
      "item_number": 76,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections & Law",
      "question": "What does 'Forest Gold' reveal about the limits of written law when moral leadership is absent?",
      "options": {
        "A": "Written environmental laws are entirely sufficient to prevent illegal mining",
        "B": "Laws are useless if traditional custodians and political leaders trade environmental stewardship for personal enrichment",
        "C": "Only traditional priests have the authority to interpret national mining statutes",
        "D": "Rural villages should be governed without formal courts or police"
      },
      "correct_answer": "B",
      "explanation": "The story shows that statutes alone cannot protect nature; environmental safety requires ethical leadership and civic resolve."
    },
    {
      "item_number": 77,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Linguistic Registers",
      "question": "Why does the poet use casual, colloquial diction in 'The Monday Breeze' rather than elevated Victorian phrasing?",
      "options": {
        "A": "The poet was unfamiliar with formal English grammar",
        "B": "To ground the poem in contemporary domestic reality, ensuring accessibility and immediate recognition for modern readers",
        "C": "To mock the education levels of modern urban workers",
        "D": "Because the poem was transcribed from an oral radio commercial"
      },
      "correct_answer": "B",
      "explanation": "Accessible everyday diction ensures the domestic scene feels immediate, authentic, and universally relatable."
    },
    {
      "item_number": 78,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Theatrical Design & Symbolism",
      "question": "What is the symbolic function of Prince Dawuni discarding his wine calabash on stage in Act 2?",
      "options": {
        "A": "He was clearing the stage for an upcoming traditional dance troupe",
        "B": "It functions as a decisive physical gesture symbolizing his rejection of escapism and his commitment to self-discipline",
        "C": "The calabash was cracked and leaking wine on his royal sandals",
        "D": "Palace custom required all wine vessels to be shattered at sunset"
      },
      "correct_answer": "B",
      "explanation": "Shattering the wine calabash is a physical act of renunciation: casting aside self-indulgence to embrace responsible duty."
    },
    {
      "item_number": 79,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Literary Realism & Supply Chains",
      "question": "What does the difficulty of finding the correct UV lamp reveal about the realities of rural African innovators?",
      "options": {
        "A": "African markets refuse to sell electrical appliances to students",
        "B": "Grassroots inventors must navigate severe material scarcity and broken supply chains, relying on sheer perseverance to succeed",
        "C": "High school science teachers deliberately hide equipment from students",
        "D": "The Ghanaian Ministry of Education bans science fairs in rural districts"
      },
      "correct_answer": "B",
      "explanation": "The hunt for components illustrates the real infrastructural hurdles rural inventors face, highlighting their resilience."
    },
    {
      "item_number": 80,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Comparative Thematics",
      "question": "How does 'Forest Gold' redefine the concept of a 'hero' compared to Western fantasy literature?",
      "options": {
        "A": "A hero must possess supernatural swords and slay magical monsters",
        "B": "Heroism is grounded in ordinary community members\u2014farmers, elders, and youth\u2014who organize collective resistance to defend life",
        "C": "The hero is always a wealthy merchant who buys out mining syndicates",
        "D": "Heroism requires abandoning the ancestral village to live abroad"
      },
      "correct_answer": "B",
      "explanation": "Heroism here is communal and realistic: ordinary citizens uniting non-violently to protect their shared home and heritage."
    },
    {
      "item_number": 81,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sensory Juxtaposition",
      "question": "How does the poet juxtapose visual and auditory imagery in the opening stanzas of 'The Monday Breeze'?",
      "options": {
        "A": "By contrasting whispering trees with absolute darkness",
        "B": "By setting the visible rushing of legs against the loud acoustic din of screaming voices and blaring horns",
        "C": "By pairing delicious food scents with the sound of running water",
        "D": "By describing children reading silently under bright streetlights"
      },
      "correct_answer": "B",
      "explanation": "The poem pairs the sight of running feet with the sound of shouting and car horns, building an atmosphere of panic."
    },
    {
      "item_number": 82,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Cultural Ethics & Restorative Justice",
      "question": "What is the philosophical foundation of Elder Anfani's counsel in Act 5, Scene 1: 'Put the past behind us'?",
      "options": {
        "A": "He wishes to conceal Anzansi's criminal activities from neighboring chiefs",
        "B": "He recognizes that sustainable civic renewal requires collective reconciliation rather than endless cycles of retribution",
        "C": "He is planning to retire from the elder council",
        "D": "He fears that Anzansi will launch an armed rebellion"
      },
      "correct_answer": "B",
      "explanation": "True restoration requires moving past grievances; vendettas destroy kingdoms, while grace and reconciliation rebuild them."
    },
    {
      "item_number": 83,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis & Community Pride",
      "question": "In 'A Calabash of Saha', how does the implementation of the water system in Karaga complete the narrative arc?",
      "options": {
        "A": "It allows the inventors to sell clean water at high commercial prices to their neighbors",
        "B": "It demonstrates that the true measure of innovation is its tangible ability to heal communal suffering and restore dignity",
        "C": "It prompts the municipal council to close all other wells in the district",
        "D": "It leads to the total abandonment of agriculture in the region"
      },
      "correct_answer": "B",
      "explanation": "The arc ends at home: success is not validated by trophies in Accra, but by clean water flowing in Karaga."
    },
    {
      "item_number": 84,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Sociological Reality & Galamsey",
      "question": "How does 'Forest Gold' reflect the contemporary Ghanaian struggle against galamsey?",
      "options": {
        "A": "It portrays galamsey as an orderly, sustainable economic development model",
        "B": "It depicts how unregulated surface extraction destroys essential river bodies, tears communities apart, and demands civic action",
        "C": "It argues that rivers naturally clean chemical pollutants within days",
        "D": "It suggests that surface mining produces more food than agriculture"
      },
      "correct_answer": "B",
      "explanation": "The narrative mirrors reality: illegal extraction devastates water systems and community health until citizens stand up."
    },
    {
      "item_number": 85,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Atmosphere & Diction",
      "question": "What is the thematic impact of using the term 'screaming voice' rather than 'calling voice' in 'The Monday Breeze'?",
      "options": {
        "A": "It shows that the family was singing traditional songs together",
        "B": "It conveys extreme emotional strain, panic, and loss of composure under the pressure of punctuality",
        "C": "It proves that the family lived next to a busy amusement park",
        "D": "It indicates that the children were refusing to wear school uniforms"
      },
      "correct_answer": "B",
      "explanation": "'Screaming' emphasizes panic, loss of control, and sharp auditory distress, far beyond a normal morning call."
    },
    {
      "item_number": 86,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Foils & Motivation",
      "question": "In 'Dawuni\u2019s Dream', how does Alheri's loyalty serve as a moral mirror for Prince Dawuni?",
      "options": {
        "A": "She constantly threatens to abandon him if he fails to win the crown",
        "B": "Her steadfast virtue and faith expose the wastefulness of his alcoholism, compelling him to live up to her respect",
        "C": "She writes anonymous letters criticizing his palace conduct",
        "D": "She challenges him to public duels in the village square"
      },
      "correct_answer": "B",
      "explanation": "Her unwavering respect and moral consistency act as a mirror, showing him the noble leader he could become."
    },
    {
      "item_number": 87,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Figurative Analysis & Epistemology",
      "question": "In 'A Calabash of Saha', what is the analytical function of describing the prototype as a 'beacon of light'?",
      "options": {
        "A": "It was equipped with maritime lighthouse warning lamps",
        "B": "It symbolizes clarity, hope, and empirical enlightenment guiding a marginalized community out of crisis",
        "C": "It warned villagers to stay away from the polluted wells",
        "D": "It proved that the inventors intended to construct electrical towers"
      },
      "correct_answer": "B",
      "explanation": "The metaphor of light signifies knowledge, hope, and clarity cutting through the darkness of neglect and disease."
    },
    {
      "item_number": 88,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Pacing",
      "question": "How does the author slow down narrative pacing during the confrontation at the mining pits?",
      "options": {
        "A": "By inserting a five-page history of gold mining across Africa",
        "B": "By focusing on physical sensory details\u2014the hum of excavators, cutlasses on shoulders, mud on boots, and heavy silence",
        "C": "By having the characters fall asleep on the dirt road",
        "D": "By switching the narrative perspective to a distant airplane pilot"
      },
      "correct_answer": "B",
      "explanation": "Slowing the pace to describe minute physical details heightens dramatic tension just before the confrontation."
    },
    {
      "item_number": 89,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "Why is 'The Monday Breeze' an essential inclusion in a modern African literature curriculum?",
      "options": {
        "A": "It teaches students how to drive and maintain motor vehicles",
        "B": "It shifts literary study away from idealized colonial pastorals toward the authentic sociological reality of modern urban life",
        "C": "It proves that African families do not care about punctuality",
        "D": "It provides historical records of Ghanaian traffic management laws"
      },
      "correct_answer": "B",
      "explanation": "The poem modernizes literature study by examining real, unvarnished contemporary domestic urban experiences."
    },
    {
      "item_number": 90,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Resolution",
      "question": "In 'Dawuni\u2019s Dream', what is the final moral test Dawuni passes before his coronation is deemed legitimate?",
      "options": {
        "A": "He executes Anzansi in the palace courtyard",
        "B": "He demonstrates forgiveness, listens to elder counsel, and commits to serving his people with humility",
        "C": "He gathers an immense personal fortune in gold",
        "D": "He challenges neighboring kingdoms to war to expand his borders"
      },
      "correct_answer": "B",
      "explanation": "His true coronation happens internally: he passes the test by choosing reconciliation, wisdom, and humble service."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "The Monday Breeze",
      "strand": "Poetry Extract & Advanced Critical Appreciation",
      "extract": "Blurring horns\nScreaming voice\nRunning legs\nWomen\nThey always forget their purse\nI am late, Daddy yells\nIf you had helped me, we would have been gone\nchildren settle in van",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Analyze how the poet's use of synesthesia in 'Blurring horns' establishes the psychological atmosphere of the opening couplet.",
          "marks": 2,
          "expected_answer": "By applying a visual modifier ('blurring') to an auditory stimulus ('horns'), the poet captures sensory overload, evoking the disorienting, frantic chaos of urban commuter traffic."
        },
        {
          "label": "(b)",
          "question": "Examine the feminist critique embedded in Mummy's retort: 'If you had helped me, we would have been gone'.",
          "marks": 3,
          "expected_answer": "Mummy's retort dismantles the patriarchal demand for punctuality by exposing the unequal domestic division of labor. She points out that the morning delay is caused by the mother carrying the mental and physical burden of family preparation without assistance."
        },
        {
          "label": "(c)",
          "question": "Explain the structural function of enjambment throughout this excerpt.",
          "marks": 3,
          "expected_answer": "The run-on lines remove pauses, driving the lines together at a breathless, hurried tempo that formally mimics the stress of rushing against the clock."
        },
        {
          "label": "(d)",
          "question": "What is the symbolic function of 'the van' in the final line?",
          "marks": 2,
          "expected_answer": "The van represents the transition vehicle from private domestic chaos to organized public routine, restoring order as the family departs into the civic world."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Advanced Critical Appreciation",
      "extract": "ANZANSI: (Stepping into the circle under the palace lanterns, his lips curled in a sneer) The stool belongs to the swift, Dawuni. It is not held by a hand that shakes from last night's palm wine. You are an empty shadow of your fathers.\nDAWUNI: (Stepping forward, standing tall, his eyes clear) A shadow passes when the sun climbs high, Anzansi. My hands were weak yesterday, but today they are clean, and they hold the prayers of our people.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Contrast the rhetorical strategies employed by Anzansi and Dawuni in this encounter.",
          "marks": 3,
          "expected_answer": "Anzansi uses personal insults, ad hominem attacks, and mockery of Dawuni's past alcoholism to demoralize him. In contrast, Dawuni uses extended light and shadow metaphors to acknowledge his past failures while asserting his moral renewal and dedication to his people."
        },
        {
          "label": "(b)",
          "question": "Explain the metaphor 'A shadow passes when the sun climbs high'.",
          "marks": 3,
          "expected_answer": "Dawuni equates his former drunken self to a fleeting shadow that vanishes in full sunlight, asserting that his spiritual and moral awakening has permanently dispelled his weakness."
        },
        {
          "label": "(c)",
          "question": "What does Anzansi's failure to recognize Dawuni's sobriety reveal about his character?",
          "marks": 2,
          "expected_answer": "It reveals his hubris, arrogance, and rigid contempt, which blind him to the reality of personal reform and leave him vulnerable to defeat."
        },
        {
          "label": "(d)",
          "question": "How does this confrontation fulfill the requirements of Heroic Drama?",
          "marks": 2,
          "expected_answer": "The conflict is not a petty dispute, but a high-stakes struggle over legitimate kingship, ethical leadership, and the moral destiny of the entire kingdom."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Advanced Critical Appreciation",
      "extract": "ALHERI: (Holding out the gourd of sacred water before the shrine) Let the earth drink, so our children may live. The ancestors do not ask for blood; they ask for a king whose heart beats with the pulse of his people.\nANFANI: (Chanting, as thunder rolls in the distance) The drought is broken not by rain alone, but by truth that returns to the palace.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Analyze the symbolic connection between the gourd of sacred water and the breaking drought.",
          "marks": 3,
          "expected_answer": "The gourd of sacred water is an offering of humility and spiritual communion; it bridges human repentance with natural renewal, showing that physical water returns only when moral purity is restored."
        },
        {
          "label": "(b)",
          "question": "Explain Elder Anfani's philosophical assertion: 'The drought is broken not by rain alone, but by truth that returns to the palace.'",
          "marks": 3,
          "expected_answer": "He articulates traditional African metaphysics: physical drought is an outward symptom of moral corruption. True healing requires ethical truth and justice to be restored to governance first."
        },
        {
          "label": "(c)",
          "question": "Identify the auditory imagery in this extract and state its dramatic function.",
          "marks": 2,
          "expected_answer": "'thunder rolls in the distance' provides dramatic auditory foreshadowing of the breaking drought, confirming that the ancestral spirits have accepted their plea."
        },
        {
          "label": "(d)",
          "question": "What role does Alheri fulfill in this ritual scene?",
          "marks": 2,
          "expected_answer": "She acts as the spiritual mediator, grounding the royal house in ancestral reverence, humility, and care for future generations."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "Dr. Iddrisu leaned across the laboratory bench in Tamale, tapping the glass tube of the UV apparatus. 'A design is not successful when it works in a university lab, Abubakar. It is successful when an old woman in Karaga can turn the valve without fear of cholera.' Abidatu nodded, adjusting the wooden bracket on the calabash. 'That is why we made the shell from what our people already know.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does Dr. Iddrisu define the core objective of scientific innovation in developing communities?",
          "marks": 3,
          "expected_answer": "He asserts that true innovation is measured by social utility, accessibility, and human safety at the grassroots level, rather than theoretical complexity in elite academic settings."
        },
        {
          "label": "(b)",
          "question": "Examine the philosophical rationale behind Abidatu's decision to craft the casing from an indigenous calabash.",
          "marks": 3,
          "expected_answer": "Using a traditional calabash ensures cultural familiarity and low cost, reducing community technophobia and encouraging local adoption of the water technology."
        },
        {
          "label": "(c)",
          "question": "What does this extract reveal about the mentorship dynamic between Dr. Iddrisu and the students?",
          "marks": 2,
          "expected_answer": "It shows a collaborative partnership where the mentor provides philosophical and technical guidance while honoring the students' creative choices."
        },
        {
          "label": "(d)",
          "question": "Identify the contrast in this scene and explain its thematic value.",
          "marks": 2,
          "expected_answer": "Contrasting university lab equipment with a village grandmother's daily struggle emphasizes that science must serve real human needs."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "In the state banquet hall in Accra, Abubakar and Abidatu stood before the Head of State. The polished floor reflected the flash of press cameras. 'You have brought honour to your school and your village,' the President spoke, holding the wooden model aloft. 'You have shown that the solutions to Africa's trials will come from the minds of her own children.' Beside him, Abidatu's mother dabbed her eyes with the corner of her kente cloth.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What is the structural significance of this scene in the narrative trajectory of 'A Calabash of Saha'?",
          "marks": 2,
          "expected_answer": "It serves as the national validation climax, where the students' grassroots initiative is recognized on the country's highest institutional platform."
        },
        {
          "label": "(b)",
          "question": "Analyze the thematic principle stated in the President's address regarding African solutions.",
          "marks": 3,
          "expected_answer": "It affirms self-reliance and intellectual decolonization, emphasizing that sustainable progress across Africa must be driven by home-grown innovation and youth ingenuity."
        },
        {
          "label": "(c)",
          "question": "What does the presence and reaction of Abidatu's mother symbolize in this setting?",
          "marks": 3,
          "expected_answer": "Her tears and kente cloth symbolize family pride, cultural heritage, and the validation of rural mothers whose sacrifices support student success."
        },
        {
          "label": "(d)",
          "question": "Contrast the physical setting of this scene with the opening setting of the story.",
          "marks": 2,
          "expected_answer": "It contrasts the luxury and institutional power of the presidential banquet hall with the hot, impoverished, sun-baked streets of Karaga."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Forest Gold",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "Osmond spat into the yellow slurry at the river's edge, his voice hardening against the crowd. 'Custom does not feed a family, Elder. The gold under this mud can buy tractors, build clinics, and pave roads. Your ancestors are dead; the living must eat.' Elder Onyimdze did not raise his voice. 'If you poison the womb of the earth to buy bread, Osmond, what will your children eat tomorrow?'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Deconstruct the opposing ideological frameworks presented by Osmond and Elder Onyimdze in this exchange.",
          "marks": 4,
          "expected_answer": "Osmond represents short-term utilitarian capitalism, arguing that environmental destruction is justified if it yields immediate financial development. Onyimdze represents sustainable indigenous conservation, arguing that destroying vital ecological lifelines for short-term gain leads to intergenerational ruin."
        },
        {
          "label": "(b)",
          "question": "Explain the metaphor 'poison the womb of the earth' and its ecocritical resonance.",
          "marks": 3,
          "expected_answer": "The metaphor equates the earth and river to a mother's womb that generates life; poisoning it frames industrial contamination as an assault on the planet's capacity to sustain future generations."
        },
        {
          "label": "(c)",
          "question": "What character trait of Osmond is emphasized by his action of spitting into the river?",
          "marks": 2,
          "expected_answer": "Contempt, disrespect, and complete disregard for the sacredness of communal resources and natural life."
        },
        {
          "label": "(d)",
          "question": "How does this dialogue foreshadow the community's eventual shutdown of the mine?",
          "marks": 1,
          "expected_answer": "Onyimdze's unwavering moral clarity signals that the community will reject economic compromises and unite to halt the destruction."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Forest Gold",
      "strand": "Prose Extract & Advanced Critical Appreciation",
      "extract": "Chief Daakye Asem sat upon his stool in the palace courtyard, the shadows of the evening lengthening around him. The royal drums were silent. Before him stood Zakari, his clothes stained with river clay, holding a glass jar of dark, oily water. 'This is the gold we have reaped, Nana,' Zakari spoke softly, setting the jar at the Chief's feet. The Chief looked at the murk, his lips trembling, unable to meet the young man's eyes.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Analyze the symbolic function of the jar of polluted river water placed at the Chief's feet.",
          "marks": 3,
          "expected_answer": "The jar serves as an undeniable piece of physical evidence that shatters the illusion of mining prosperity, confronting the Chief directly with the human and ecological cost of his concessions."
        },
        {
          "label": "(b)",
          "question": "What is the dramatic irony in Zakari's words: 'This is the gold we have reaped'?",
          "marks": 3,
          "expected_answer": "The irony lies in calling toxic, undrinkable water 'gold'; it exposes the grim reality that chasing mineral riches yielded poisoned water instead of true wealth."
        },
        {
          "label": "(c)",
          "question": "Interpret the Chief's physical reaction\u2014his trembling lips and downcast eyes.",
          "marks": 2,
          "expected_answer": "His reaction indicates profound guilt, shame, and remorse, showing a leader facing the realization that he failed to protect his people."
        },
        {
          "label": "(d)",
          "question": "How does the silence of the royal drums contribute to the atmosphere of the scene?",
          "marks": 2,
          "expected_answer": "The silent drums symbolize mourning, loss of royal moral authority, and communal sorrow over the damaged landscape."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "Comparative Literature: The Monday Breeze & Forest Gold",
      "strand": "Comparative Literature & Sociological Critique",
      "extract": "TEXT 1 (The Monday Breeze):\n'I am late, Daddy yells / If you had helped me, we would have been gone / children settle in van'\n\nTEXT 2 (Forest Gold):\n'Zakari looked at the excavators. If we do not stand together today, our river will be a memory by tomorrow.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Compare the nature of the conflicts depicted in Text 1 and Text 2.",
          "marks": 3,
          "expected_answer": "Text 1 depicts an interpersonal domestic conflict centered on commuter stress and unshared family labor. Text 2 depicts a public socio-environmental conflict centered on community survival and corporate exploitation."
        },
        {
          "label": "(b)",
          "question": "How do both texts explore the concept of shared responsibility?",
          "marks": 4,
          "expected_answer": "In Text 1, domestic cooperation is shown as necessary to ease morning family stress. In Text 2, collective community unity is essential to halt environmental degradation. Both demonstrate that individual blame fails, while shared responsibility succeeds."
        },
        {
          "label": "(c)",
          "question": "Analyze the difference in tone between the two excerpts.",
          "marks": 3,
          "expected_answer": "Text 1 carries an urgent, realistic, and slightly satirical domestic tone. Text 2 carries a grave, resolute, and heroic civic tone."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "Comparative Literature: Dawuni\u2019s Dream & A Calabash of Saha",
      "strand": "Comparative Literature & African Philosophy",
      "extract": "TEXT 1 (Dawuni\u2019s Dream):\n'ALHERI: The ancestors hear our plea, and this land will breathe again.'\n\nTEXT 2 (A Calabash of Saha):\n'ABIDATU: The community's struggles whispered in our ears... We add the light, and Karaga will drink pure water.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Compare the roles of Alheri in Text 1 and Abidatu in Text 2 as female agents of renewal.",
          "marks": 3,
          "expected_answer": "Both act as moral and intellectual catalysts: Alheri provides spiritual grounding and ethical wisdom to reform a king, while Abidatu applies scientific persistence to engineer clean water."
        },
        {
          "label": "(b)",
          "question": "How does each text use personification to describe natural or social forces?",
          "marks": 4,
          "expected_answer": "Text 1 personifies the parched land as an entity that will 'breathe again' upon the return of justice and rain. Text 2 personifies social hardship, describing the community's struggles as 'whispering' into the innovators' ears to inspire action."
        },
        {
          "label": "(c)",
          "question": "What shared philosophy regarding service to community unites these two passages?",
          "marks": 3,
          "expected_answer": "Both passages reflect the principle of servant leadership, affirming that personal gifts\u2014whether spiritual wisdom or scientific skill\u2014find their highest purpose in healing the community."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis & Advanced BECE Essay Formulation",
      "strand": "Comprehensive BECE Paper 2 Essay Methodology",
      "extract": "The literature syllabus of the NaCCA Common Core Programme focuses on cultivating civic responsibility, environmental awareness, gender equality, and leadership character.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Using the Point-Evidence-Explanation (P-E-E) formula, compose an analytical body paragraph on the theme of 'Environmental Stewardship' using 'Forest Gold'.",
          "marks": 4,
          "expected_answer": "P: In 'Forest Gold', environmental stewardship is portrayed as a sacred communal duty that demands courage against predatory exploitation. E: When illegal mining turns the Daakye River into a murky brown slurry and sickens children, Zakari and Elder Onyimdze lead the youth to physically shut down the mining pits. E: This demonstrates that protecting essential water bodies requires active grassroots defiance, proving that community survival must always take precedence over mineral greed."
        },
        {
          "label": "(b)",
          "question": "Compare the transformation of Prince Dawuni in 'Dawuni\u2019s Dream' with that of Abubakar in 'A Calabash of Saha'.",
          "marks": 3,
          "expected_answer": "Dawuni overcomes moral dissipation and alcoholism to become a wise, compassionate king who restores justice to his kingdom. Abubakar overcomes self-doubt and resource scarcity to become an empowered inventor who brings clean water to his hometown."
        },
        {
          "label": "(c)",
          "question": "State three specific examiner criteria used on WAEC BECE Paper 2 to evaluate an essay's critical depth.",
          "marks": 3,
          "expected_answer": "1. Clear topic sentences and sustained thesis alignment (Point). 2. Accurate textual citation of character actions, dialogue, or stage directions (Evidence). 3. Nuanced critical analysis connecting literary devices to broader societal themes (Explanation)."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB8Advanced() {
  console.log("Seeding Basic 8 Advanced Practice Lab (100 Items) for The Beacon of Light...");
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
      id: `B8_BL_A_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "advanced",
      category: `${item.strand} Critical Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Apply advanced critical theories (African cosmology, ecocriticism, gender critique, and post-colonial philosophy) to analyze '${item.text}'.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Critically evaluate complex literary themes, philosophies, and authorial craft across prescribed The Beacon of Light texts (${item.text}), evaluating sociopolitical subtexts, metonymy, ecocritical structures, and theatrical dramaturgy.`
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
      id: `B8_BL_A_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B8",
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
            scoringGuidelines: ["Mastery of advanced literary devices (synesthesia, metonymy, ecocritical theory, dramatic peripeteia)", "Point-Evidence-Explanation (P-E-E) synthesis and pristine academic prose"],
            diagnosticChecklist: ["Demonstrates exceptional critical synthesis, theoretical fluency, and adherence to WAEC BECE Paper 2 standard conventions"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Apply advanced literary critique, exploring structural craft, symbolic resonance, character foils, and thematic synthesis in '${item.text}'.`,
      competencyTarget: `${item.strand}: Advanced Critical Appreciation & Essay Synthesis`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Critically evaluate complex literary excerpts from The Beacon of Light across poetry, drama, and prose, applying the P-E-E essay model, analyzing philosophical subtexts, gender dynamics, and ecocritical allegories.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B8",
    difficulty: "advanced",
    title: "Basic 8 Literature Diagnostic Lab: The Beacon of Light (Advanced Tier - 100 Items)",
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
          id: `B8_BL_A_TH_${t.item_number}`,
          title: `${t.text} - Advanced Critical Appreciation`,
          category: t.strand,
          shortSummary: `Extract critique, ecocritical analysis, and advanced synthesis of ${t.text}`
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B8_advanced`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // 2. Update parent doc practice pool for B8 high/advanced
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b8: {
            practicePool: {
              high: allItems
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool to: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B8 Advanced Lab!`);
}

seedBeaconOfLightB8Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Advanced Lab:", err);
    process.exit(1);
  });
