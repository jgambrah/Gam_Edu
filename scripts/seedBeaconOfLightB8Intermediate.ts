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
    "title": "Basic 8 Literature Diagnostic Lab - Intermediate Tier (100-Item Bank)",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 8 (JHS 2)",
    "tier": "Intermediate",
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
      "sub_strand": "Structural Mechanics",
      "question": "How does the poet's decision to omit a rigid end-rhyme scheme reinforce the central subject matter of 'The Monday Breeze'?",
      "options": {
        "A": "It highlights the harmonious musicality of rural Ghanaian folk songs",
        "B": "It mimics the unpredictable, discordant, and uncoordinated nature of a chaotic morning commute",
        "C": "It proves that modern African poetry cannot follow structured patterns",
        "D": "It signals that the poem was composed specifically for choral recitation"
      },
      "correct_answer": "B",
      "explanation": "The irregular ABCD scheme mirrors the disjointed, frantic, and cacophonous reality of urban morning rush rather than smooth harmony."
    },
    {
      "item_number": 2,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Foils & Motivation",
      "question": "How does Alheri's steadfast behavioral consistency function dramatically alongside Dawuni's volatile transformation?",
      "options": {
        "A": "She competes with Prince Dawuni for royal inheritance",
        "B": "She acts as a steady moral and spiritual counterweight, providing the unchanging anchor Dawuni needs to achieve sobriety",
        "C": "She exposes Dawuni's secret plots directly to Anzansi",
        "D": "She encourages Dawuni to ignore ancestral traditions"
      },
      "correct_answer": "B",
      "explanation": "Alheri serves as a static character foil whose emotional consistency and ancestral grounding stabilize Dawuni through his personal reform."
    },
    {
      "item_number": 3,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Architecture",
      "question": "What is the structural effect of organizing Abubakar and Abidatu's journey along a strictly linear, chronological timeline?",
      "options": {
        "A": "It deliberately obscures the true origin of the Saha technology",
        "B": "It systematically documents the step-by-step evolution of scientific inquiry, testing, validation, and real-world implementation",
        "C": "It emphasizes psychological trauma over objective reality",
        "D": "It forces the reader to guess the true chronology of events"
      },
      "correct_answer": "B",
      "explanation": "A linear chronological architecture allows the reader to follow the progressive, empirical development of their invention from inception to execution."
    },
    {
      "item_number": 4,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Psychology",
      "question": "Why is Chief Daakye Asem's moral regret depicted as an agonizing internal struggle rather than immediate outward defiance?",
      "options": {
        "A": "He secretly plans to flee the country with mining proceeds",
        "B": "He is caught between the enticing promise of economic modernization and the painful reality of cultural and ecological ruin",
        "C": "He is physically imprisoned inside his palace by Osmond",
        "D": "He fears losing the respect of foreign mining corporations"
      },
      "correct_answer": "B",
      "explanation": "His internal turmoil stems from the tension between his desire to bring wealth to his people and his realization that he facilitated their environmental destruction."
    },
    {
      "item_number": 5,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Stylistic Devices",
      "question": "In 'The Monday Breeze', what psychological atmosphere is generated by the run-on lines between Mummy's actions and Daddy's yelling?",
      "options": {
        "A": "Lighthearted, playful marital teasing",
        "B": "Breathless domestic friction and sensory overload under the pressure of punctuality",
        "C": "Romantic longing and domestic serenity",
        "D": "Melancholy resignation toward unemployment"
      },
      "correct_answer": "B",
      "explanation": "Enjambment blurs the actions together, capturing the breathless domestic strain and overlapping panic of rushing against the clock."
    },
    {
      "item_number": 6,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Technique",
      "question": "What is the theatrical significance of incorporating ancestral invocations and traditional drumming into the play's staging?",
      "options": {
        "A": "To fill awkward gaps while actors change modern costumes",
        "B": "To authentically root the moral struggle in indigenous Northern Ghanaian spiritual reality and theatrical heritage",
        "C": "To distract the audience from the dialogue's moral themes",
        "D": "To parody historical West African ceremonies"
      },
      "correct_answer": "B",
      "explanation": "Ancestral motifs and performance arts ground the dramatic conflict in authentic pre-colonial cultural and spiritual traditions."
    },
    {
      "item_number": 7,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Foils & Dynamics",
      "question": "How does Abidatu's assertive posture when procuring materials challenge traditional domestic stereotypes in the rural setting?",
      "options": {
        "A": "She refuses to communicate with community elders",
        "B": "She actively leads technical negotiations and logistical tasks rather than settling into a passive, background domestic role",
        "C": "She demands that Abubakar hand over total ownership of the Saha blueprint",
        "D": "She chooses academic study over her cultural heritage"
      },
      "correct_answer": "B",
      "explanation": "Abidatu shatters passive gender norms by taking charge of technical and scientific problem-solving in a rural society."
    },
    {
      "item_number": 8,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Sociological Sub-Text",
      "question": "In 'Forest Gold', what systemic vulnerability allows unregulated mining to take root in rural communities like Daakye Asem?",
      "options": {
        "A": "A total lack of fertile agricultural soil",
        "B": "Poverty, limited economic opportunities, and the allure of immediate cash windfalls",
        "C": "Strict environmental regulations enforced by municipal rangers",
        "D": "Complete isolation from Ghanaian national markets"
      },
      "correct_answer": "B",
      "explanation": "The text demonstrates how chronic rural poverty and economic vulnerability make vulnerable communities susceptible to predatory extraction."
    },
    {
      "item_number": 9,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Diction & Register",
      "question": "Why does the poet select truncated, non-sentential phrasing such as 'Blurring horns' and 'Screaming voice' instead of full grammatical clauses?",
      "options": {
        "A": "The poet was unfamiliar with English sentence structures",
        "B": "To produce an acoustic barrage that mirrors the jarring sensory overload of early morning city noise",
        "C": "To indicate that the poem is spoken by an infant",
        "D": "To mimic the solemn silence of a library"
      },
      "correct_answer": "B",
      "explanation": "Fragmented, abrupt noun phrases simulate the rapid, overlapping acoustic bursts of morning traffic and commotion."
    },
    {
      "item_number": 10,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Conflict",
      "question": "In Act 3, Scene 1 of 'Dawuni\u2019s Dream', why is Anzansi's public setback considered an 'irony of fate'?",
      "options": {
        "A": "He was struck by lightning inside the sacred grove",
        "B": "His calculated schemes were foiled precisely by the prince he dismissed as a helpless drunkard",
        "C": "He voluntarily surrendered his claims to the royal staff",
        "D": "The villagers crowned his younger brother instead"
      },
      "correct_answer": "B",
      "explanation": "The irony of fate lies in Anzansi being defeated by the very adversary he regarded as completely incapable of resistance."
    },
    {
      "item_number": 11,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Figurative Analysis",
      "question": "What is the critical effect of the personification 'The Saha system smiled'?",
      "options": {
        "A": "It indicates that the machine possessed artificial intelligence and robotic speech",
        "B": "It frames their mechanical creation as a living, benevolent ally bringing relief to a suffering community",
        "C": "It warns the reader that the invention might malfunction",
        "D": "It reveals that the machine was named after a village elder"
      },
      "correct_answer": "B",
      "explanation": "Personifying the technology breathes warmth and benevolence into an inanimate scientific mechanism, underscoring its healing role."
    },
    {
      "item_number": 12,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the author connect the physical degradation of the Daakye River with the moral erosion of Daakye Asem village?",
      "options": {
        "A": "The villagers believe the river water was naturally poisonous for generations",
        "B": "The poisoning of the clean river mirrors the community's loss of ancestral reverence in exchange for quick wealth",
        "C": "The mining operations uncover ancient cultural artifacts that cause civil strife",
        "D": "The physical erosion causes the Chief to abdicate his throne"
      },
      "correct_answer": "B",
      "explanation": "The river's contamination serves as a visible objective correlative for the village's moral decay when greed overrides ethical stewardship."
    },
    {
      "item_number": 13,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Tone & Perspective",
      "question": "How does the poet prevent 'The Monday Breeze' from turning into a harsh, bitter indictment of domestic dysfunction?",
      "options": {
        "A": "By ending the poem with a violent physical confrontation",
        "B": "By framing the chaotic morning rush through a humorous, realistic, and universally relatable lens",
        "C": "By having the father abandon the family before getting in the car",
        "D": "By describing an idyllic, wealthy upper-class estate"
      },
      "correct_answer": "B",
      "explanation": "The observational humor and relatable depiction of morning pandemonium keep the tone light and recognizable rather than tragic."
    },
    {
      "item_number": 14,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Symbolic Resonance",
      "question": "In 'Dawuni\u2019s Dream', what does the 'Sacred Staff' represent regarding traditional political legitimacy?",
      "options": {
        "A": "Absolute military tyranny backed by armed force",
        "B": "Spiritual continuity, ancestral stewardship, and righteous, justice-centered governance",
        "C": "The personal financial fortune amassed by the king",
        "D": "A magical artifact capable of controlling the weather"
      },
      "correct_answer": "B",
      "explanation": "The sacred staff symbolizes that authority in the pre-colonial kingdom is a sacred trust grounded in justice and ancestral heritage."
    },
    {
      "item_number": 15,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Pedagogical Function",
      "question": "Why is Dr. Iddrisu's guidance situated in Tamale rather than within Karaga itself?",
      "options": {
        "A": "To prove that rural schools in Ghana are entirely incapable of teaching basic science",
        "B": "To illustrate the constructive bridge between grassroots rural innovation and professional tertiary academic institutions",
        "C": "Because Karaga banned high school science fairs",
        "D": "Dr. Iddrisu was under house arrest in the Northern regional capital"
      },
      "correct_answer": "B",
      "explanation": "Positioning mentorship in Tamale highlights how provincial ideas can be refined through higher academic partnerships."
    },
    {
      "item_number": 16,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Figurative Analysis",
      "question": "What is revealed by the metaphor 'The forest... became a magnet for opportunists'?",
      "options": {
        "A": "The soil contained rich magnetic iron ores that disturbed compasses",
        "B": "The promise of effortless mineral wealth exerted an irresistible pull on predatory outsiders seeking exploitation",
        "C": "The trees emitted a supernatural force field that trapped visitors",
        "D": "The government designated the forest as a protected tourist nature reserve"
      },
      "correct_answer": "B",
      "explanation": "The metaphor captures how quickly unchecked resource discoveries attract opportunistic extractors."
    },
    {
      "item_number": 17,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Criticism",
      "question": "In 'The Monday Breeze', what social reality is underscored by Mummy's retort: 'If you had helped me, we would have been gone'?",
      "options": {
        "A": "The refusal of modern women to drive family vehicles",
        "B": "The unequal domestic division of labor where fathers demand punctuality while expecting mothers to manage logistics alone",
        "C": "The lack of reliable public buses across metropolitan Ghana",
        "D": "The difficulty of dressing school pupils without housemaids"
      },
      "correct_answer": "B",
      "explanation": "Her retort highlights the unfair double burden placed on women, who must coordinate the family before facing outside work pressure."
    },
    {
      "item_number": 18,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Synthesis",
      "question": "What does Dawuni's journey convey about the concept of heroic transformation in African drama?",
      "options": {
        "A": "True heroes never display moral flaws or physical weaknesses",
        "B": "Heroism involves personal redemption, learning humility, and turning away from destructive self-indulgence to serve the community",
        "C": "Heroism requires conquering neighboring territories through physical warfare",
        "D": "A hero must separate himself permanently from ancestral traditions"
      },
      "correct_answer": "B",
      "explanation": "His heroism is defined by moral awakening and self-mastery, transforming his flaws into responsible leadership."
    },
    {
      "item_number": 19,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Literary Foreshadowing",
      "question": "How does the judges' praise at the Karaga Senior High School Science Fair foreshadow the continental climax?",
      "options": {
        "A": "It warns the students that their design is too primitive to leave the village",
        "B": "It establishes that their invention addresses a real-world problem effectively, previewing their victory at the Pan African festival",
        "C": "It reveals that Dr. Iddrisu was a secret judge on the panel",
        "D": "It indicates that foreign corporations would steal their patent"
      },
      "correct_answer": "B",
      "explanation": "Early validation of their working prototype signals that their local innovation has wider, universal application."
    },
    {
      "item_number": 20,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Tone & Atmosphere",
      "question": "How does the narrative tone of 'Forest Gold' shift between the exposition and the falling action?",
      "options": {
        "A": "From satirical mockery to supernatural horror",
        "B": "From peaceful pastoral beauty to sombre devastation, culminating in resolute civic defiance",
        "C": "From lighthearted romance to violent warfare",
        "D": "From celebratory wealth to hopeless surrender"
      },
      "correct_answer": "B",
      "explanation": "The text moves from rural serenity to environmental grief, ultimately settling into determined community resistance."
    },
    {
      "item_number": 21,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structural Contrast",
      "question": "What ironic contrast exists between the chaotic human rushing and the mechanical motion of the vehicle at the end of 'The Monday Breeze'?",
      "options": {
        "A": "The car explodes while the family laughs",
        "B": "The agitated morning panic resolves into the organized, collective enclosure of the van heading into the urban world",
        "C": "The children refuse to board the vehicle",
        "D": "The father walks to work while the mother drives the children"
      },
      "correct_answer": "B",
      "explanation": "The hectic, fragmented domestic rush concludes with the family organized within the van, entering the wider public sphere."
    },
    {
      "item_number": 22,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Foils",
      "question": "Why does Anfani encourage Prince Dawuni to 'Put the past behind us' rather than seek punitive revenge against Anzansi's supporters?",
      "options": {
        "A": "Anfani is secretly in league with Anzansi's faction",
        "B": "To model restorative justice and heal communal fractures rather than perpetuate cycles of civil retaliation",
        "C": "The kingdom's laws prohibit punishing traitors",
        "D": "Dawuni is too physically weak to enforce tribal laws"
      },
      "correct_answer": "B",
      "explanation": "Elder Anfani knows lasting stability requires forgiveness and unity rather than ongoing vendettas."
    },
    {
      "item_number": 23,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "In 'A Calabash of Saha', what message is conveyed about the role of youth in African national development?",
      "options": {
        "A": "Youth must abandon traditional cultural practices to achieve technological success",
        "B": "Youth possess the insight, resilience, and ingenuity to engineer sustainable solutions to community struggles",
        "C": "Youth should wait until they enter political office before addressing local issues",
        "D": "Technological innovation belongs solely to foreign aid agencies"
      },
      "correct_answer": "B",
      "explanation": "The story demonstrates that young citizens can apply scientific inquiry to solve everyday community challenges."
    },
    {
      "item_number": 24,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Symbolic Resonance",
      "question": "Why does the author specifically compare the plastic containers at the mining site to 'lanterns in the dim light'?",
      "options": {
        "A": "To praise the miners for illuminating the night forest",
        "B": "To create an eerie image where synthetic trash displaces organic beauty under cover of darkness",
        "C": "To indicate that the miners were conducting electrical experiments",
        "D": "To show that the villagers welcomed nighttime mining operations"
      },
      "correct_answer": "B",
      "explanation": "The simile creates an unsettling visual contrast, showing human industrial refuse invading the natural ecosystem."
    },
    {
      "item_number": 25,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft & Rhythm",
      "question": "What is the rhythmic impact of placing the single word 'Women' on its own isolated poetic line?",
      "options": {
        "A": "It creates a quiet prayer for the mothers of the community",
        "B": "It functions as an abrupt, accusatory verbal pause that highlights the father's impatience and societal bias",
        "C": "It indicates a change in stanza formatting to a French villanelle",
        "D": "It signals that the poem was written for female reciters only"
      },
      "correct_answer": "B",
      "explanation": "Isolating 'Women' acts as a stark pause that underscores impatient generalization and domestic tension."
    },
    {
      "item_number": 26,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting Integration",
      "question": "How does the Sacred Grove functionally contrast with the Royal Palace in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "The Sacred Grove represents spiritual truth and ancestral communion, whereas the Palace represents worldly power and political rivalry",
        "B": "The Sacred Grove is where the army lives, while the Palace is a hospital",
        "C": "The Sacred Grove is controlled by Anzansi, while the Palace is protected by Alheri",
        "D": "The Sacred Grove is where prisoners are kept during drought"
      },
      "correct_answer": "A",
      "explanation": "The Sacred Grove serves as an uncorrupted spiritual sanctuary, while the Palace is the center of temporal ambition and power."
    },
    {
      "item_number": 27,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Development",
      "question": "What internal obstacle must Abubakar overcome before the Saha project can succeed?",
      "options": {
        "A": "Debilitating self-doubt and fear of failing his community",
        "B": "Jealousy toward Abidatu's superior academic standing",
        "C": "Resentment toward Dr. Iddrisu's mentorship",
        "D": "A refusal to enter public academic competitions"
      },
      "correct_answer": "A",
      "explanation": "Abubakar's internal battle centers on overcoming feelings of inadequacy and fear of letting down his village."
    },
    {
      "item_number": 28,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Direct vs. Indirect Characterization",
      "question": "How is Osmond's predatory nature primarily communicated to the reader?",
      "options": {
        "A": "Through explicit statements by the village schoolmaster",
        "B": "Indirectly through his single-minded drive for extraction and callous disregard for the polluted water and sick villagers",
        "C": "Through internal soliloquies mourning his lost childhood",
        "D": "Through physical fights with the youth in the marketplace"
      },
      "correct_answer": "B",
      "explanation": "His character is revealed through his ongoing actions: profiting from gold while remaining indifferent to communal suffering."
    },
    {
      "item_number": 29,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Imagery Synthesis",
      "question": "How does the poet bridge auditory and kinetic imagery in the opening couplets of 'The Monday Breeze'?",
      "options": {
        "A": "By contrasting whispering leaves with a floating boat",
        "B": "By weaving the noise of blaring horns and shouting voices directly into the physical motion of running legs",
        "C": "By describing quiet children sitting silently in a dark room",
        "D": "By pairing delicious breakfast scents with classical violin music"
      },
      "correct_answer": "B",
      "explanation": "The text links sensory elements together: the auditory din of horns and shouts drives the kinetic scrambling of running feet."
    },
    {
      "item_number": 30,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Cultural Institutions",
      "question": "In 'Dawuni\u2019s Dream', why is the ancestral connection considered essential to the resolution of the drought?",
      "options": {
        "A": "The ancestors control the kingdom's modern irrigation valves",
        "B": "In indigenous worldview, nature's balance is bound to moral righteousness, and rainfall returns only when moral harmony is restored",
        "C": "The ancestors demand human tribute before permitting agriculture",
        "D": "The ancestors provide foreign currency to purchase clean water"
      },
      "correct_answer": "B",
      "explanation": "In traditional African cosmology, environmental equilibrium reflects moral balance; ending the drought requires spiritual alignment."
    },
    {
      "item_number": 31,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Comparative Dynamics",
      "question": "How does the setting of Karaga Senior High School serve as a catalyst for the overall narrative?",
      "options": {
        "A": "It provides the arena where their prototype is first tested, validated, and propelled onto the national stage",
        "B": "It is where the students are expelled for tampering with electrical wiring",
        "C": "It is where Dr. Iddrisu works as the headmaster",
        "D": "It serves as a temporary medical clinic for waterborne diseases"
      },
      "correct_answer": "A",
      "explanation": "The school science fair is the initial proving ground that gives the students confidence to pursue wider recognition."
    },
    {
      "item_number": 32,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Leadership Ethics",
      "question": "What lesson about leadership responsibility emerges from Chief Daakye Asem's character arc?",
      "options": {
        "A": "A ruler should delegate all land decisions to foreign prospecting corporations",
        "B": "Leaders must look beyond immediate material gains to safeguard the long-term well-being and heritage of their people",
        "C": "Monarchs should use military force to suppress environmental protests",
        "D": "A chief should remain aloof from the daily problems of the village"
      },
      "correct_answer": "B",
      "explanation": "His arc shows that genuine leadership requires prioritizing sustainable communal health over short-term financial promises."
    },
    {
      "item_number": 33,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Poetic Craft & Punctuation",
      "question": "What is the structural effect of ending the poem with 'children settle in van' without an exclamation mark?",
      "options": {
        "A": "It implies the family was involved in a road collision",
        "B": "It marks the quiet, sudden dissipation of morning panic as the day's routine settles in",
        "C": "It reveals that the author left the final couplet unfinished",
        "D": "It signals that the father continues yelling during the journey"
      },
      "correct_answer": "B",
      "explanation": "The plain concluding phrase reflects tension easing as everyone is seated and the morning frenzy subsides."
    },
    {
      "item_number": 34,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the play connect Prince Dawuni's alcoholism to the kingdom's social vulnerability?",
      "options": {
        "A": "His drunken negligence creates a power vacuum that allows Anzansi's corrupt ambition to flourish unchecked",
        "B": "His habits deplete the kingdom's treasury entirely",
        "C": "The drought was caused by excessive beer brewing in the palace",
        "D": "The ancestors refuse to speak to anyone who enters the royal hall"
      },
      "correct_answer": "A",
      "explanation": "Dawuni's initial self-indulgence and absence of leadership leave the community vulnerable to political exploitation."
    },
    {
      "item_number": 35,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sensory Details",
      "question": "What is the thematic value of describing Abidatu's eyes as 'shone with excitement' during prototype assembly?",
      "options": {
        "A": "It indicates that the UV lamp damaged her eyesight",
        "B": "It conveys her passion, intellectual curiosity, and joy in scientific discovery",
        "C": "It reveals her plan to sell the machine for personal profit",
        "D": "It shows that she was exhausted from studying through the night"
      },
      "correct_answer": "B",
      "explanation": "Her shining eyes reflect genuine intellectual engagement and optimism about solving their community's water crisis."
    },
    {
      "item_number": 36,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Intergenerational Resistance",
      "question": "Why was the alliance between Elder Onyimdze and young Zakari essential to the success of the resistance?",
      "options": {
        "A": "Zakari provided financial funding while Onyimdze hired foreign security guards",
        "B": "Onyimdze provided traditional moral authority and wisdom, while Zakari provided youthful energy and mobilizing drive",
        "C": "The mining company refused to negotiate with anyone under sixty years old",
        "D": "They were the only two literate individuals living in Daakye Asem"
      },
      "correct_answer": "B",
      "explanation": "Their collaboration combined the elder's ancestral legitimacy with the youth's active determination to protect their land."
    },
    {
      "item_number": 37,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Commentary",
      "question": "How does 'The Monday Breeze' capture the modern urban Ghanaian commuter experience?",
      "options": {
        "A": "By romanticizing rural farming routines",
        "B": "By highlighting traffic noise, tight work deadlines, and the domestic scramble common to city life",
        "C": "By describing high-speed rail transportation between Kumasi and Accra",
        "D": "By showing a family choosing to work entirely from home"
      },
      "correct_answer": "B",
      "explanation": "The poem mirrors the recognizable morning tensions of modern urban workers balancing home logistics with traffic congestion."
    },
    {
      "item_number": 38,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Exposition",
      "question": "What is the primary function of Act 1, Scene 1 in establishing the dramatic stakes of 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "It shows Dawuni winning a wrestling contest against Anzansi",
        "B": "It exposes Dawuni's inability to articulate a vision for the kingdom, establishing the depth from which he must rise",
        "C": "It dramatizes the coronation of King Dawuni",
        "D": "It depicts the departure of Alheri to a foreign country"
      },
      "correct_answer": "B",
      "explanation": "Act 1, Scene 1 sets up the initial moral low point: a prince unable to govern or articulate a clear future for his people."
    },
    {
      "item_number": 39,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Theme & Culture",
      "question": "How does the story 'A Calabash of Saha' reconcile traditional culture with modern STEM innovation?",
      "options": {
        "A": "By proving that traditional farming tools can completely replace modern water treatment systems",
        "B": "By showing innovators who honor their cultural roots and attire while applying empirical science to solve local issues",
        "C": "By portraying Western-educated scientists taking over village administration",
        "D": "By showing that science fairs are incompatible with northern traditions"
      },
      "correct_answer": "B",
      "explanation": "The protagonists demonstrate that modern scientific thinking and pride in traditional cultural identity can work together."
    },
    {
      "item_number": 40,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Allusion",
      "question": "What is the analytical purpose of including allusions to sacred environmental conservation practices in 'Forest Gold'?",
      "options": {
        "A": "To prove that the villagers were opposed to any form of trade",
        "B": "To remind the reader that African traditions have long maintained sacred, sustainable relationships with nature",
        "C": "To reveal hidden buried treasures beneath the riverbed",
        "D": "To show that the forest was home to mythical creatures"
      },
      "correct_answer": "B",
      "explanation": "Allusions to traditional conservation show that caring for waterways and forests is an established cultural value, not a foreign concept."
    },
    {
      "item_number": 41,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Figure of Speech",
      "question": "In 'The Monday Breeze', what figure of speech is present in the phrase 'Screaming voice'?",
      "options": {
        "A": "Personification",
        "B": "Understatement",
        "C": "Oxymoron",
        "D": "Synecdoche"
      },
      "correct_answer": "A",
      "explanation": "Attributing the autonomous human act of screaming to the voice itself functions as personification (as well as intense auditory imagery)."
    },
    {
      "item_number": 42,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Turning Point",
      "question": "What is the critical moment in Act 1, Scene 2 that sparks Dawuni's transformation?",
      "options": {
        "A": "He finds a chest of gold coins behind the throne",
        "B": "Alheri challenges his self-indulgence and expresses faith in his capacity for leadership",
        "C": "Anzansi physically attacks him in the courtyard",
        "D": "The village elders strip him of his royal robes"
      },
      "correct_answer": "B",
      "explanation": "Alheri's encouragement and firm challenge in Act 1, Scene 2 serve as the spark for his change."
    },
    {
      "item_number": 43,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sociological Insight",
      "question": "Why is the invention named 'A Calabash of Saha' rather than an English technical label?",
      "options": {
        "A": "The inventors were forbidden from using English words",
        "B": "To ground the technical device in an authentic traditional vessel ('calabash') and local language ('saha'), making it culturally embraced",
        "C": "Because the prototype was made entirely out of carved dried squash",
        "D": "To hide their scientific methods from the judges in Accra"
      },
      "correct_answer": "B",
      "explanation": "The title connects the modern purification system to an accessible, recognizable cultural object and local term."
    },
    {
      "item_number": 44,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Conflict Escalation",
      "question": "What development causes the villagers' peaceful concern to escalate into direct collective action in 'Forest Gold'?",
      "options": {
        "A": "The miners attempt to buy the Chief's royal stool",
        "B": "The poisoning of the river leads to widespread waterborne sickness among the village children",
        "C": "The mining company fails to pay the village council its promised royalties",
        "D": "A foreign mining engineer is appointed regional governor"
      },
      "correct_answer": "B",
      "explanation": "When the contaminated river begins harming the health of children, passive worry turns into direct resistance."
    },
    {
      "item_number": 45,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Interconnections",
      "question": "How does the poet connect the ticking clock of urban life with domestic tension in 'The Monday Breeze'?",
      "options": {
        "A": "By having a grandfather clock chime loudly in every couplet",
        "B": "By illustrating how anxiety over workplace lateness triggers impatience and blame between spouses",
        "C": "By describing an office worker receiving a formal warning letter",
        "D": "By setting the entire poem inside a company boardroom"
      },
      "correct_answer": "B",
      "explanation": "The pressure of strict professional hours heightens domestic friction, leading to hasty arguments over household duties."
    },
    {
      "item_number": 46,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Dynamics",
      "question": "In Act 5, Scene 2 of 'Dawuni\u2019s Dream', how is the legitimate claim to the throne dramatized?",
      "options": {
        "A": "Through a duel with iron swords",
        "B": "Through Dawuni's demonstration of sobriety, wisdom, and moral readiness to serve his people",
        "C": "Through the payment of tribute to foreign delegates",
        "D": "Through a secret vote conducted among palace guards"
      },
      "correct_answer": "B",
      "explanation": "True legitimacy is earned through restored character, maturity, and moral commitment to the welfare of the people."
    },
    {
      "item_number": 47,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Teamwork & Collaboration",
      "question": "What does the partnership between Abubakar and Abidatu illustrate about solving community crises?",
      "options": {
        "A": "Scientific innovation requires an individual working in complete isolation",
        "B": "Mutual trust, complementary abilities, and collaborative teamwork yield stronger solutions than solitary effort",
        "C": "One partner must always take sole credit for the work",
        "D": "Financial resources are more important than teamwork"
      },
      "correct_answer": "B",
      "explanation": "Their shared success demonstrates that combining distinct strengths in a supportive partnership overcomes hurdles."
    },
    {
      "item_number": 48,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Authorial Voice",
      "question": "What is the purpose of the reflective authorial commentary found in 'Forest Gold'?",
      "options": {
        "A": "To explain the chemical process of refining raw gold",
        "B": "To invite readers to reflect on real-world ecological damage and consider their civic duty to protect natural resources",
        "C": "To argue that modern farming should be abandoned across Ghana",
        "D": "To praise foreign mining conglomerates for infrastructure development"
      },
      "correct_answer": "B",
      "explanation": "Authorial commentary connects the fictional story to ongoing real-world environmental struggles, urging civic stewardship."
    },
    {
      "item_number": 49,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Structural Symmetry",
      "question": "How does the poem balance domestic interior panic with public exterior noise?",
      "options": {
        "A": "Stanzas 1\u20134 are set in a village, while Stanza 5 is set at an airport",
        "B": "It shifts between exterior street sounds (horns, voices) and interior domestic commotion (purse, yelling, help)",
        "C": "The father remains outside, while the mother locks herself inside the bedroom",
        "D": "The children are described in school, while the parents remain home"
      },
      "correct_answer": "B",
      "explanation": "The poem moves between street noise outside and hurried domestic preparations inside the house."
    },
    {
      "item_number": 50,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Resolution",
      "question": "How does the play 'Dawuni\u2019s Dream' conclude on an open, reflective note in Act 8, Scene 1?",
      "options": {
        "A": "With a tragic civil war that destroys the palace",
        "B": "With the rhetorical question 'What will the future hold?', emphasizing that leadership requires ongoing vigilance and care",
        "C": "With Dawuni resigning his crown to become a wandering hermit",
        "D": "With the total departure of all village subjects to the southern forest"
      },
      "correct_answer": "B",
      "explanation": "Ending with an introspective question shows that responsible leadership is an ongoing duty, not a static status."
    },
    {
      "item_number": 51,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Tropes",
      "question": "Why is the journey of Abubakar and Abidatu described as a 'shining example' in the commentary?",
      "options": {
        "A": "They carried bright electric lanterns during their train journey",
        "B": "It serves as an extended metaphor for intellectual enlightenment, resilience, and youth-led community uplift",
        "C": "They won a cash prize for the cleanest laboratory coats",
        "D": "Their invention reflected sunlight across the streets of Accra"
      },
      "correct_answer": "B",
      "explanation": "The metaphor equates their pathway to a guiding light that inspires other young learners to tackle communal issues."
    },
    {
      "item_number": 52,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Literary Technique: Caesura",
      "question": "How does the author use caesura (pauses within sentences) to convey emotional shock in 'Forest Gold'?",
      "options": {
        "A": "By inserting rhyming couplets into descriptive dialogue",
        "B": "By breaking clauses with abrupt punctuation to capture moments of stunned realization as villagers view their polluted river",
        "C": "By removing all capital letters from character dialogue",
        "D": "By having characters speak in riddles"
      },
      "correct_answer": "B",
      "explanation": "Internal sentence pauses mirror the hesitations of grief, shock, and resolve when characters face the ruined water supply."
    },
    {
      "item_number": 53,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Comparative Dynamics",
      "question": "How does the pacing in 'The Monday Breeze' differ from a conventional pastoral nature poem?",
      "options": {
        "A": "It adopts slow, meditative rhythms praising natural scenery",
        "B": "It uses clipped, urgent lines to reflect modern urban haste rather than peaceful rural meditation",
        "C": "It is written entirely in archaic, complex language",
        "D": "It avoids describing human beings or machines"
      },
      "correct_answer": "B",
      "explanation": "Instead of calm, pastoral lines, the poem employs rapid couplets that convey hurried modern routines."
    },
    {
      "item_number": 54,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Dynamics",
      "question": "In 'Dawuni\u2019s Dream', what is the significance of Dawuni listening to Alheri's advice rather than dismissing her?",
      "options": {
        "A": "It shows he lacks the courage to make decisions independently",
        "B": "It highlights his growing humility and demonstrates respect for female counsel and wisdom",
        "C": "He intends to make her do his royal duties",
        "D": "Palace custom requires princes to obey women in all matters"
      },
      "correct_answer": "B",
      "explanation": "Welcoming Alheri's guidance marks his shift away from arrogant male chauvinism toward mutual respect and shared wisdom."
    },
    {
      "item_number": 55,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Sociological Impact",
      "question": "How does meeting the President of Ghana affect Abubakar and Abidatu's standing in their hometown?",
      "options": {
        "A": "The villagers suspect them of pocketing state funds for private use",
        "B": "It provides national validation that transforms them into respected local leaders, ensuring adoption of the Saha system",
        "C": "They are ordered to relocate permanently to the capital",
        "D": "The municipal assembly shuts down Karaga Senior High School"
      },
      "correct_answer": "B",
      "explanation": "Presidential validation gives their project authority, encouraging community-wide support for their water system."
    },
    {
      "item_number": 56,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "In 'Forest Gold', why does the narrative present the shut-down of the mining pits as an inspiration to neighboring villages?",
      "options": {
        "A": "To prove that grassroots community action can counter environmental exploitation across the region",
        "B": "To encourage other villages to start their own gold mining pits",
        "C": "To demonstrate that regional courts are unnecessary in environmental matters",
        "D": "To show that Daakye Asem became wealthy by charging entry fees to the forest"
      },
      "correct_answer": "A",
      "explanation": "Their successful resistance offers a practical example of how collective civic mobilization can protect natural heritage."
    },
    {
      "item_number": 57,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Mechanics",
      "question": "What is the analytical significance of the couplet 'I am late, Daddy yells / If you had helped me, we would have been gone'?",
      "options": {
        "A": "It shows that the family had plenty of leisure time before leaving",
        "B": "It captures the clash between an outward demand for speed and the practical reality of unshared domestic duties",
        "C": "It proves that the father woke up before everyone else in the house",
        "D": "It reveals that the children had already reached school on foot"
      },
      "correct_answer": "B",
      "explanation": "The couplet highlights the contrast between external demands for punctuality and the domestic reality of unshared preparation."
    },
    {
      "item_number": 58,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Symbolic Setting",
      "question": "In 'Dawuni\u2019s Dream', what is the symbolic significance of the drought that afflicts the kingdom?",
      "options": {
        "A": "It represents an ordinary seasonal cycle with no deeper meaning",
        "B": "It symbolizes moral and spiritual desolation caused by irresponsible leadership and neglect of heritage",
        "C": "It is a sign that the tribe should migrate to the coastal region",
        "D": "It represents the military strength of neighboring kingdoms"
      },
      "correct_answer": "B",
      "explanation": "The physical drought mirrors the kingdom's internal spiritual dryness and lack of responsible guidance."
    },
    {
      "item_number": 59,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "How does Dr. Iddrisu's mentorship model effective educational support in 'A Calabash of Saha'?",
      "options": {
        "A": "He completes the prototype himself and enters his own name into the fair",
        "B": "He offers technical critique, encourages persistence, and respects the students' intellectual ownership of their invention",
        "C": "He demands financial payment before sharing laboratory supplies",
        "D": "He insists that they stop entering public science competitions"
      },
      "correct_answer": "B",
      "explanation": "Dr. Iddrisu provides guidance while ensuring the students retain agency and ownership of their scientific work."
    },
    {
      "item_number": 60,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Literary Atmosphere",
      "question": "What is the rhetorical effect of contrasting 'a shimmering ribbon of crystal clarity' with 'a murky brown, like over-steeped tea'?",
      "options": {
        "A": "To prove that the river had always been unsuitable for human use",
        "B": "To create a sharp sensory contrast that emphasizes the scale of environmental destruction",
        "C": "To indicate that the villagers enjoyed drinking warm river water",
        "D": "To show that the mining company built a tea plantation on the riverbanks"
      },
      "correct_answer": "B",
      "explanation": "Juxtaposing pristine imagery with polluted descriptors highlights the loss caused by extractive mining."
    },
    {
      "item_number": 61,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Literary Devices",
      "question": "In 'The Monday Breeze', what literary device is used when everyday domestic hurry is described as if it were a major emergency?",
      "options": {
        "A": "Litotes",
        "B": "Hyperbolic framing",
        "C": "Euphemism",
        "D": "Apostrophe"
      },
      "correct_answer": "B",
      "explanation": "Treating morning lateness with breathless urgency and shouting gives ordinary domestic rushing a hyperbolic, dramatic quality."
    },
    {
      "item_number": 62,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Dynamics",
      "question": "What makes Anzansi an effective antagonist in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "He possesses supernatural powers that control the village rain",
        "B": "He represents the very real danger of unprincipled ambition, exploiting weaknesses in leadership for personal gain",
        "C": "He is a foreign invader from across the ocean",
        "D": "He tries to force the village to abandon farming entirely"
      },
      "correct_answer": "B",
      "explanation": "Anzansi is a compelling foil because his opportunistic greed takes advantage of Dawuni's early irresponsibility."
    },
    {
      "item_number": 63,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Plot Milestone",
      "question": "Why is the presentation in Accra a critical test for Abubakar and Abidatu?",
      "options": {
        "A": "They must defend their local, low-cost innovation against well-funded projects from elite schools across Africa",
        "B": "They are required to take a written examination in French",
        "C": "They have to dismantle their machine and reassemble it blindfolded",
        "D": "The festival organizers threaten to confiscate their equipment"
      },
      "correct_answer": "A",
      "explanation": "The Pan-African festival tests whether an invention born of rural necessity can hold up against well-resourced continental competition."
    },
    {
      "item_number": 64,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Cultural Preservation",
      "question": "How does Elder Onyimdze use oral tradition to inspire the villagers of Daakye Asem?",
      "options": {
        "A": "By reciting folk tales about foreign merchants",
        "B": "By invoking the ancestral trust, reminding the community that land and water are borrowed from future generations",
        "C": "By composing war songs against neighboring villages",
        "D": "By predicting that gold would turn into dust overnight"
      },
      "correct_answer": "B",
      "explanation": "He draws on traditional proverbs and ancestral responsibility to motivate the community to defend their ecosystem."
    },
    {
      "item_number": 65,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Symbolism",
      "question": "What does the father's yelling primarily represent within the family dynamic?",
      "options": {
        "A": "A desire to start a musical career",
        "B": "The transmission of workplace stress and patriarchal pressure into the domestic space",
        "C": "Joy at the prospect of the work week ahead",
        "D": "Discipline aimed exclusively at the children's studies"
      },
      "correct_answer": "B",
      "explanation": "His shouting reflects the anxious pressure of public workplace punctuality carried into the home."
    },
    {
      "item_number": 66,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Dramatic Structure",
      "question": "How do the stage directions contribute to the dramatic impact of 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "They indicate when the curtain should close for commercial breaks",
        "B": "They provide emotional subtext, physical blocking, and cultural gestures essential for realizing the conflict on stage",
        "C": "They replace the need for spoken dialogue among the characters",
        "D": "They list the market prices of traditional Ghanaian fabrics"
      },
      "correct_answer": "B",
      "explanation": "Stage directions provide crucial performance cues, emotional context, and physical interactions that bring the play to life."
    },
    {
      "item_number": 67,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the significance of clean water being called 'life, hope, and community well-being' in 'A Calabash of Saha'?",
      "options": {
        "A": "It shows that water is an expensive commercial commodity",
        "B": "It frames access to clean drinking water as a fundamental human necessity tied to dignity and communal health",
        "C": "It indicates that the village intended to bottle and export water",
        "D": "It suggests that agricultural farming was no longer practiced"
      },
      "correct_answer": "B",
      "explanation": "The text links potable water directly to human vitality, public health, and communal survival."
    },
    {
      "item_number": 68,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Sociological Reality",
      "question": "In 'Forest Gold', how does the author portray the relationship between modern economic progress and environmental health?",
      "options": {
        "A": "Progress always requires destroying rivers and forests completely",
        "B": "Unregulated economic exploitation under the guise of progress leads to severe long-term ecological and human ruin",
        "C": "Environmental protection is only necessary for wealthy urban areas",
        "D": "Gold mining always improves agricultural productivity"
      },
      "correct_answer": "B",
      "explanation": "The story cautions that extraction focused solely on profit without environmental care brings devastation rather than genuine development."
    },
    {
      "item_number": 69,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Irony of Title",
      "question": "Why is the word 'Breeze' particularly ill-suited to the reality described in the poem?",
      "options": {
        "A": "There was a heavy rainstorm throughout the morning",
        "B": "A breeze is quiet and gentle, whereas the family endures noise, arguments, and hectic rushing",
        "C": "The poem is set during the cold harmattan season",
        "D": "The family travels by airplane rather than road"
      },
      "correct_answer": "B",
      "explanation": "The serene connotation of a gentle breeze stands in sharp ironic contrast to the shouting, blaring horns, and panic."
    },
    {
      "item_number": 70,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Cultural Meaning",
      "question": "What is the symbolic meaning of the ancestral spirits 'hearing our plea' in 'Dawuni\u2019s Dream'?",
      "options": {
        "A": "The ancestors demand that the kingdom conquer neighboring tribes",
        "B": "The restoration of humility and justice in the leadership re-establishes spiritual communion with the guardians of the land",
        "C": "The ancestors instruct Dawuni to abandon the crown entirely",
        "D": "The royal council must be replaced by foreign advisers"
      },
      "correct_answer": "B",
      "explanation": "Spiritual balance is restored because the prince has reformed his conduct and embraced responsible leadership."
    },
    {
      "item_number": 71,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "What primarily drives Abubakar to continue working on the Saha prototype when early tests fail?",
      "options": {
        "A": "A desire to become wealthy and move to Europe",
        "B": "Empathy for his community's daily suffering and a sense of duty to bring clean water to Karaga",
        "C": "Fear of being punished by the school headmaster",
        "D": "An ambition to defeat Abidatu in an academic rivalry"
      },
      "correct_answer": "B",
      "explanation": "His perseverance is rooted in active compassion for his neighbors struggling with unsafe drinking water."
    },
    {
      "item_number": 72,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Evolution",
      "question": "What marks the transition of Zakari from an ordinary farmer into a respected community organizer?",
      "options": {
        "A": "He purchases a large tractor to farm the forest land",
        "B": "He refuses to passively watch the river die and organizes the youth into an active civic resistance",
        "C": "He challenges Chief Daakye Asem to a duel for the chieftaincy",
        "D": "He leaves Daakye Asem to work in an Accra factory"
      },
      "correct_answer": "B",
      "explanation": "Zakari's leadership emerges when he channels his frustration into uniting his peers to stop the mining machinery."
    },
    {
      "item_number": 73,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sensory Devices",
      "question": "What is the cumulative effect of combining kinetic verbs like 'runs' with auditory verbs like 'yells' in 'The Monday Breeze'?",
      "options": {
        "A": "It creates a serene, dreamlike mood",
        "B": "It builds an escalating tempo of domestic stress and hurry",
        "C": "It indicates that the characters are engaged in a theatrical rehearsal",
        "D": "It slows down the reading pace of the poem"
      },
      "correct_answer": "B",
      "explanation": "Pairing rapid movement with loud shouting conveys an intense, escalating domestic morning rush."
    },
    {
      "item_number": 74,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Figure of Speech",
      "question": "In Act 5, Scene 1 of 'Dawuni\u2019s Dream', 'Our kingdom will thrive once more!' functions as hyperbole because:",
      "options": {
        "A": "The kingdom had never experienced prosperity in its history",
        "B": "It expresses an idealized, boundless optimism about future fortunes to rally the community",
        "C": "Dawuni intended to deceive the villagers about their crops",
        "D": "The words were spoken sarcastically by Anzansi"
      },
      "correct_answer": "B",
      "explanation": "The grand proclamation uses deliberate exaggeration to inspire confidence and hope across the struggling kingdom."
    },
    {
      "item_number": 75,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Comparative Dynamics",
      "question": "How does Abidatu's role as a co-innovator challenge traditional gender norms in Northern Ghana?",
      "options": {
        "A": "She refuses to participate in community activities",
        "B": "She demonstrates equal scientific competence, technical problem-solving, and public leadership in a male-dominated field",
        "C": "She demands that only girls be allowed to use clean water in Karaga",
        "D": "She argues that science fairs should replace high school graduation"
      },
      "correct_answer": "B",
      "explanation": "Her active leadership in STEM breaks traditional expectations that technical work is reserved for men."
    },
    {
      "item_number": 76,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Ecological Allegory",
      "question": "In 'Forest Gold', how does the contaminated river function as an allegory for modern societal greed?",
      "options": {
        "A": "It shows that gold naturally cleans water over long periods of time",
        "B": "It illustrates how prioritizing short-term financial enrichment poisons the basic life-support systems of human society",
        "C": "It proves that rural communities prefer industrial mining to farming",
        "D": "It demonstrates that natural rivers can easily heal themselves from chemical pollution"
      },
      "correct_answer": "B",
      "explanation": "The poisoned water allegorizes how unchecked greed harms the fundamental resources that sustain communal life."
    },
    {
      "item_number": 77,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Sociological Analysis",
      "question": "What does 'The Monday Breeze' suggest about the relationship between modern employment and traditional family life?",
      "options": {
        "A": "Employment requirements easily accommodate household routines",
        "B": "Rigid workplace schedules often place intense emotional and logistical strain on the domestic unit",
        "C": "Fathers in modern cities rarely care about reaching work on time",
        "D": "Children are indifferent to whether their parents argue"
      },
      "correct_answer": "B",
      "explanation": "The poem shows how external workplace pressures can disrupt domestic harmony and create family stress."
    },
    {
      "item_number": 78,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Setting Integration",
      "question": "Why is the final reconciliation set in the village square rather than inside the private royal chambers?",
      "options": {
        "A": "The palace roof had collapsed during the storm",
        "B": "Legitimate leadership, communal repentance, and civic renewal must be shared and witnessed openly by the whole community",
        "C": "Anzansi refused to enter the palace grounds",
        "D": "The royal throne had been stolen by outsiders"
      },
      "correct_answer": "B",
      "explanation": "Holding the resolution in the public square confirms that leadership is accountable to the entire community."
    },
    {
      "item_number": 79,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Narrative Craft",
      "question": "What is the artistic function of describing the physical search for the UV lamp in such detail?",
      "options": {
        "A": "To fill extra pages in the storybook",
        "B": "To highlight the realistic hurdles, resource scarcity, and persistence required for grassroots African innovation",
        "C": "To show that the students lacked proper funding from Dr. Iddrisu",
        "D": "To criticize the lack of electrical shops in Accra"
      },
      "correct_answer": "B",
      "explanation": "Detailing their struggle to find parts emphasizes the resourcefulness required to innovate in rural settings."
    },
    {
      "item_number": 80,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Resolution Dynamics",
      "question": "Why does 'Forest Gold' refuse to provide a simple fairy-tale ending where the river instantly turns pure again?",
      "options": {
        "A": "The author intended to write a direct sequel to the novel",
        "B": "To preserve realism, acknowledging that while collective activism can halt exploitation, ecological damage leaves lasting scars",
        "C": "Because the mining company returned the following morning",
        "D": "The villagers decided to permanently abandon the settlement"
      },
      "correct_answer": "B",
      "explanation": "The realistic conclusion underscores that chemical pollution causes lasting harm, warning against environmental neglect."
    },
    {
      "item_number": 81,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Thematic Synthesis",
      "question": "What broader human truth does 'The Monday Breeze' reveal through its portrayal of morning routines?",
      "options": {
        "A": "Family members should live in separate houses to avoid morning arguments",
        "B": "Everyday domestic life involves shared emotional burdens that require mutual cooperation and understanding to navigate",
        "C": "Commuters should always travel on foot to avoid traffic horns",
        "D": "Children are unaffected by domestic tension around them"
      },
      "correct_answer": "B",
      "explanation": "The poem shows that daily family routines require mutual support and shared responsibility rather than unilateral blame."
    },
    {
      "item_number": 82,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Character Evolution",
      "question": "What is the significance of Prince Dawuni kneeling before Elder Anfani in Act 5, Scene 1?",
      "options": {
        "A": "He is pleading for his life after losing a battle",
        "B": "It visually demonstrates his genuine humility, respect for elder wisdom, and submission to righteous governance",
        "C": "He is suffering from a physical ailment caused by the drought",
        "D": "Palace law requires all princes to remain on their knees during rainstorms"
      },
      "correct_answer": "B",
      "explanation": "Kneeling symbolizes his moral maturation: turning away from royal arrogance to seek the guidance of wise elders."
    },
    {
      "item_number": 83,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'A Calabash of Saha' redefine youth agency in community problem-solving?",
      "options": {
        "A": "By showing that youth must wait for external municipal funding before taking action",
        "B": "By illustrating that young people can identify crises and mobilize practical solutions with local resources and mentorship",
        "C": "By showing that rural innovation cannot succeed outside large capital cities",
        "D": "By arguing that theoretical classroom study is superior to hands-on invention"
      },
      "correct_answer": "B",
      "explanation": "The story highlights young people taking immediate, hands-on initiative to solve community challenges rather than waiting passively."
    },
    {
      "item_number": 84,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "How does the author use Chief Daakye Asem's character to explore accountability?",
      "options": {
        "A": "The Chief blames the villagers for bringing miners into Daakye Asem",
        "B": "The Chief confronts the direct consequences of his choice and acknowledges his role in the community's suffering",
        "C": "The Chief abdicates his throne and moves to another country",
        "D": "The Chief arrests Elder Onyimdze for organizing the youth"
      },
      "correct_answer": "B",
      "explanation": "His arc explores accountability: a leader recognizing that his initial concessions contributed to his people's hardship."
    },
    {
      "item_number": 85,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Figurative Analysis",
      "question": "Why is 'The Monday Breeze' classified as realistic modern poetry rather than romantic verse?",
      "options": {
        "A": "It discusses international political diplomacy",
        "B": "It focuses on everyday domestic friction, traffic noise, and commuter deadlines rather than idealized nature",
        "C": "It was composed without using descriptive imagery",
        "D": "It avoids describing human emotions"
      },
      "correct_answer": "B",
      "explanation": "It earns its realistic classification by examining the familiar, unvarnished friction of everyday family life."
    },
    {
      "item_number": 86,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Thematic Resolution",
      "question": "How does 'Dawuni\u2019s Dream' demonstrate that true leadership requires moral integrity?",
      "options": {
        "A": "By showing that a king should never consult advisors or commoners",
        "B": "By illustrating that genuine authority is validated by personal character, self-control, and care for community well-being",
        "C": "By showing that kings should focus entirely on amassing personal wealth",
        "D": "By proving that only military victories produce legitimate monarchs"
      },
      "correct_answer": "B",
      "explanation": "The play shows that leadership gains true legitimacy through moral discipline and dedication to the common good."
    },
    {
      "item_number": 87,
      "text": "A Calabash of Saha",
      "strand": "Prose",
      "sub_strand": "Cultural Pride",
      "question": "Why was the inventors' choice to wear traditional clothing at the Pan African festival meaningful?",
      "options": {
        "A": "They were prohibited from wearing modern shirts in Accra",
        "B": "It demonstrated pride in their cultural heritage while asserting that African solutions belong on global platforms",
        "C": "It was a requirement for all secondary school science competitions",
        "D": "They wished to conceal their identities from competing schools"
      },
      "correct_answer": "B",
      "explanation": "Wearing traditional dress signaled that technological advancement does not require shedding cultural heritage."
    },
    {
      "item_number": 88,
      "text": "Forest Gold",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "What is the ultimate warning delivered by 'Forest Gold' regarding the exploitation of natural resources?",
      "options": {
        "A": "Gold mining should be conducted only by teenage farmers",
        "B": "Pursuing short-term mineral wealth at the expense of rivers and forests risks the long-term survival of human communities",
        "C": "Rural villages should welcome mining companies without demanding environmental oversight",
        "D": "Farming is an outdated economic activity that should be replaced by surface mining"
      },
      "correct_answer": "B",
      "explanation": "The story warns that sacrificing essential ecosystems for quick mineral profits threatens community survival."
    },
    {
      "item_number": 89,
      "text": "The Monday Breeze",
      "strand": "Poetry",
      "sub_strand": "Craft Analysis",
      "question": "How does the poet create dramatic urgency in 'The Monday Breeze'?",
      "options": {
        "A": "Through long, elaborate descriptions of morning breakfasts",
        "B": "Through short, clipped lines, enjambment, and shouting dialogue that simulate a rushed countdown",
        "C": "By using archaic vocabulary that slows the reading pace",
        "D": "By setting the entire scene in a quiet bedroom"
      },
      "correct_answer": "B",
      "explanation": "Terse lines, run-on syntax, and sudden dialogue create an authentic sense of racing against the clock."
    },
    {
      "item_number": 90,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama",
      "sub_strand": "Sociological Insight",
      "question": "What does the play reveal about the importance of positive mentors in human life?",
      "options": {
        "A": "Mentors always demand full financial compensation before offering advice",
        "B": "Supportive figures like Alheri and Anfani can help individuals recognize self-destructive habits and realize their potential",
        "C": "Mentors are only necessary for people who lack formal schooling",
        "D": "A prince should rely exclusively on his own instincts without seeking counsel"
      },
      "correct_answer": "B",
      "explanation": "The drama shows that personal growth is nurtured when individuals welcome the counsel of positive, principled mentors."
    }
  ],
  "theory": [
    {
      "item_number": 91,
      "text": "The Monday Breeze",
      "strand": "Poetry Extract & Appreciation",
      "extract": "Women\nThey always forget their purse\nI am late, Daddy yells\nIf you had helped me, we would have been gone\nchildren settle in van",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does the structural placement of the word 'Women' on its own line influence the tone of the poem?",
          "marks": 2,
          "expected_answer": "It creates an abrupt, accusatory verbal pause that highlights the speaker's impatience and reflects casual societal stereotyping under stress."
        },
        {
          "label": "(b)",
          "question": "Analyze the domestic conflict revealed between Mummy and Daddy in these lines.",
          "marks": 3,
          "expected_answer": "The lines contrast Daddy's impatience to reach work on time with Mummy's response, which points out that unshared domestic burdens caused the delay."
        },
        {
          "label": "(c)",
          "question": "What is the symbolic function of 'the van' in resolving the poem's tension?",
          "marks": 3,
          "expected_answer": "The van represents the transition from the private home to the public world; once the children are settled inside, the morning panic gives way to daily routine."
        },
        {
          "label": "(d)",
          "question": "State the rhyme scheme of this extract and explain why it fits the theme.",
          "marks": 2,
          "expected_answer": "It uses an irregular/free verse rhyme scheme (ABCD), mirroring the chaotic, unpredictable nature of morning rush hour."
        }
      ]
    },
    {
      "item_number": 92,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Appreciation",
      "extract": "ALHERI: (Placing a gentle hand on Dawuni's shoulder) The drought in our soil is nothing compared to the drought in your heart, Dawuni. Put down the calabash of wine. The ancestors did not preserve this royal bloodline for you to drown it in stupor.\nDAWUNI: (Staring at his trembling hands) And if I fail them, Alheri? What if Anzansi is right?",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the metaphor used by Alheri in the first sentence and explain its meaning.",
          "marks": 3,
          "expected_answer": "Metaphor: 'the drought in your heart'. It compares Dawuni's lack of purpose, self-discipline, and moral clarity to the parched earth of the physical drought."
        },
        {
          "label": "(b)",
          "question": "What internal conflict does Dawuni express through his trembling hands and question?",
          "marks": 2,
          "expected_answer": "He reveals acute self-doubt, fear of failure, and anxiety that Anzansi's mockery regarding his unfitness to rule might be true."
        },
        {
          "label": "(c)",
          "question": "Explain Alheri's role as a character foil to Dawuni in this scene.",
          "marks": 3,
          "expected_answer": "While Dawuni is fearful, hesitant, and struggling with alcoholism, Alheri remains clear-minded, steady, and spiritually grounded, providing the moral clarity he lacks."
        },
        {
          "label": "(d)",
          "question": "How does this interaction serve as a catalyst for the play's plot progression?",
          "marks": 2,
          "expected_answer": "It marks the turning point where Dawuni begins to confront his self-indulgence and take his first steps toward sobriety and responsible leadership."
        }
      ]
    },
    {
      "item_number": 93,
      "text": "Dawuni\u2019s Dream",
      "strand": "Drama Extract & Appreciation",
      "extract": "ANFANI: (Raising the sacred staff before the assembled elders in the village square) Power without justice is a wild bushfire that consumes both the hunter and the forest. Today, Prince Dawuni returns not as one who demands a stool, but as one who offers his hands to rebuild what has fallen.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the metaphor used by Elder Anfani and explain what it illustrates about governance.",
          "marks": 3,
          "expected_answer": "Metaphor: 'Power without justice is a wild bushfire'. It warns that authority exercised without fairness destroys both the ruler and the community."
        },
        {
          "label": "(b)",
          "question": "Analyze the symbolic importance of the setting where these words are spoken.",
          "marks": 3,
          "expected_answer": "The village square represents the heart of community gatherings and collective life, confirming that royal authority is accountable to the people."
        },
        {
          "label": "(c)",
          "question": "What does the 'sacred staff' symbolize in this dramatic moment?",
          "marks": 2,
          "expected_answer": "It symbolizes ancestral authority, spiritual continuity, and the moral duty of righteous, service-centered governance."
        },
        {
          "label": "(d)",
          "question": "Contrast Dawuni's attitude here with his behavior in Act 1.",
          "marks": 2,
          "expected_answer": "In Act 1, he was weak-willed, irresponsible, and self-indulgent; here, he shows humility and a commitment to rebuild his kingdom."
        }
      ]
    },
    {
      "item_number": 94,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Appreciation",
      "extract": "Abubakar looked at the turbid water sample drawn from the communal well. 'The test strips still show bacteria, Abidatu. The filter is not enough.' Abidatu did not flinch; she reached for their notebook, pointing to Dr. Iddrisu's notes on UV wavelengths. 'Then we do not stop at filtration. We add the light. Our people deserve water that gives life, not disease.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What practical scientific challenge are the young protagonists working through in this scene?",
          "marks": 2,
          "expected_answer": "Physical filtration alone was leaving harmful bacteria in the drinking water, requiring them to integrate UV light sterilization."
        },
        {
          "label": "(b)",
          "question": "How does this extract illustrate the application of Dr. Iddrisu's mentorship?",
          "marks": 3,
          "expected_answer": "It shows the students actively using his scientific notes to solve practical engineering hurdles, demonstrating how mentorship guides their work."
        },
        {
          "label": "(c)",
          "question": "Identify the contrast between 'life' and 'disease' and explain its thematic significance.",
          "marks": 3,
          "expected_answer": "The antithesis underscores that clean water is a fundamental matter of survival, emphasizing the humanitarian purpose behind their invention."
        },
        {
          "label": "(d)",
          "question": "What character traits of Abidatu are highlighted in this interaction?",
          "marks": 2,
          "expected_answer": "Determination, composure, persistence, and an unwillingness to accept defeat when faced with setbacks."
        }
      ]
    },
    {
      "item_number": 95,
      "text": "A Calabash of Saha",
      "strand": "Prose Extract & Appreciation",
      "extract": "As they mounted the podium in Accra, the contrast was unmistakable. While other teams displayed expensive imported equipment, Abubakar and Abidatu held up a polished calabash fitted with locally assembled UV tubes. When they demonstrated clear, drinkable water flowing from the basin, the hall erupted in applause. The judges saw that ingenuity was not measured by foreign funding, but by the will to heal one's own community.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What thematic contrast is established between Abubakar and Abidatu's project and those of their competitors?",
          "marks": 3,
          "expected_answer": "It contrasts expensive, imported technology with local, low-cost ingenuity that makes practical use of accessible materials."
        },
        {
          "label": "(b)",
          "question": "What is the symbolic meaning of fitting modern UV tubes into a traditional calabash?",
          "marks": 3,
          "expected_answer": "It symbolizes the harmony between traditional cultural vessels and modern scientific technology in African development."
        },
        {
          "label": "(c)",
          "question": "Identify the figure of speech in 'the hall erupted in applause' and state its effect.",
          "marks": 2,
          "expected_answer": "Metaphor (or Hyperbole/Onomatopoeic imagery), emphasizing the sudden, overwhelming approval of the audience and judges."
        },
        {
          "label": "(d)",
          "question": "What institutional outcome followed their presentation in Accra?",
          "marks": 2,
          "expected_answer": "They won first prize at the festival, gained national recognition, and secured support from the Ghanaian government and President."
        }
      ]
    },
    {
      "item_number": 96,
      "text": "Forest Gold",
      "strand": "Prose Extract & Appreciation",
      "extract": "Elder Onyimdze walked slowly along the edge of the pit, his eyes lingering on the scarred earth where giant odum trees once stood. Beside him, Osmond wiped dust from his goggles, calculating the tonnage of ore in his ledger. 'You look at this dirt and see gold, young man,' Onyimdze spoke softly. 'I look at it and see the graves of our children's future.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How does the dialogue reveal the contrasting worldviews of Elder Onyimdze and Osmond?",
          "marks": 3,
          "expected_answer": "Osmond views nature strictly as a commercial resource for short-term profit, while Onyimdze sees it as an ancestral trust sustaining future generations."
        },
        {
          "label": "(b)",
          "question": "Identify the metaphor in Onyimdze's words: 'the graves of our children's future'.",
          "marks": 2,
          "expected_answer": "It metaphorically equates the destroyed land to a cemetery, warning that environmental devastation will end the community's future."
        },
        {
          "label": "(c)",
          "question": "What do the 'giant odum trees' symbolize in their absence?",
          "marks": 3,
          "expected_answer": "They symbolize lost biodiversity, historical endurance, and the protective ecological canopy destroyed by mining greed."
        },
        {
          "label": "(d)",
          "question": "What character trait of Osmond is emphasized by his action of calculating tonnage in his ledger?",
          "marks": 2,
          "expected_answer": "Indifference and mercenary greed, showing his focus on financial figures while ignoring the surrounding ecological ruin."
        }
      ]
    },
    {
      "item_number": 97,
      "text": "Forest Gold",
      "strand": "Prose Extract & Appreciation",
      "extract": "The youth of Daakye Asem stood in an unbroken line across the dirt path, their farming cutlasses resting harmlessly across their shoulders. Zakari stepped forward to confront the earthmovers. 'Take your machines,' his voice rang clear through the clearing. 'The gold beneath our feet is worthless if our children have no clean river to drink from.' For the first time, the engines cut out, and silence settled over the forest.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What specific moment in the plot does this extract capture?",
          "marks": 2,
          "expected_answer": "The dramatic climax of the story, where the community takes direct, non-violent action to shut down the illegal mining site."
        },
        {
          "label": "(b)",
          "question": "Analyze the moral principle expressed in Zakari's statement regarding gold versus water.",
          "marks": 3,
          "expected_answer": "He asserts that material wealth is meaningless if the basic environmental resources required for life and community health are ruined."
        },
        {
          "label": "(c)",
          "question": "What does the sudden silence of the engines symbolize in this scene?",
          "marks": 3,
          "expected_answer": "The silence marks the halt of extractive destruction and the victory of united community resistance over corporate greed."
        },
        {
          "label": "(d)",
          "question": "How does Zakari's conduct here complete his personal transformation?",
          "marks": 2,
          "expected_answer": "He finishes his journey from an angry, frustrated farmer into an articulate, courageous community leader."
        }
      ]
    },
    {
      "item_number": 98,
      "text": "Comparative Literature: The Monday Breeze & A Calabash of Saha",
      "strand": "Comparative Appreciation",
      "extract": "TEXT 1 (The Monday Breeze):\n'Blurring horns / Screaming voice / Running legs... children settle in van'\n\nTEXT 2 (A Calabash of Saha):\n'The sun-baked streets of Karaga seemed to shimmer with heat... but Abubakar and Abidatu kept their hands steady on the filter tubes.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Contrast the physical environments depicted in Text 1 and Text 2.",
          "marks": 3,
          "expected_answer": "Text 1 depicts a crowded urban environment filled with vehicular traffic and commuter noise; Text 2 depicts a hot, rural northern settlement facing water scarcity."
        },
        {
          "label": "(b)",
          "question": "How do human characters respond to stress in Text 1 compared to Text 2?",
          "marks": 4,
          "expected_answer": "In Text 1, stress leads to verbal friction, shouting, and domestic impatience; in Text 2, the protagonists respond with quiet resolve, focus, and teamwork."
        },
        {
          "label": "(c)",
          "question": "Identify one sensory device common to both excerpts.",
          "marks": 3,
          "expected_answer": "Kinetic/visual imagery: 'Running legs' in Text 1 and 'hands steady on the filter tubes' under shimmering heat in Text 2."
        }
      ]
    },
    {
      "item_number": 99,
      "text": "Comparative Literature: Dawuni\u2019s Dream & Forest Gold",
      "strand": "Comparative Appreciation",
      "extract": "TEXT 1 (Dawuni\u2019s Dream):\n'ANZANSI: You'll never succeed. I'll make sure of it... The throne belongs to those with the will to take it.'\n\nTEXT 2 (Forest Gold):\n'OSMOND: The gold is in the earth, Chief. If we do not dig it today, someone else will. Progress does not wait for sentiment.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "How do Anzansi in Text 1 and Osmond in Text 2 embody similar antagonistic motives?",
          "marks": 3,
          "expected_answer": "Both represent self-serving ambition and greed, pursuing power and wealth while disregarding community well-being."
        },
        {
          "label": "(b)",
          "question": "How do traditional leaders respond to the pressures introduced in each text?",
          "marks": 4,
          "expected_answer": "In Text 1, Dawuni overcomes early weakness to reject Anzansi's corrupt ambition; in Text 2, Chief Daakye Asem initially yields to economic temptation before feeling deep remorse."
        },
        {
          "label": "(c)",
          "question": "What moral lesson about societal stewardship emerges from comparing these passages?",
          "marks": 3,
          "expected_answer": "Both show that communities suffer when self-interest overrides moral duty, and that leadership requires ethical principles over opportunism."
        }
      ]
    },
    {
      "item_number": 100,
      "text": "Curriculum Synthesis & Advanced Essay Blueprint",
      "strand": "Essay Formulation & Critical Synthesis",
      "extract": "Across the prescribed Basic 8 texts in The Beacon of Light anthology, characters face crises of environmental destruction, governance, family stress, and basic resource deprivation.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Using the Point-Evidence-Explanation (P-E-E) formula, write a model paragraph on the theme of 'Community Resilience' in 'Forest Gold'.",
          "marks": 4,
          "expected_answer": "P: In 'Forest Gold', unity enables ordinary citizens to defend their environment against corporate exploitation. E: When child illnesses break out, Zakari and Elder Onyimdze lead the youth to physically shut down the mining pits. E: This demonstrates that grassroots solidarity can overcome powerful extractive interests to protect ancestral resources."
        },
        {
          "label": "(b)",
          "question": "Explain how female characters across two Basic 8 texts serve as catalysts for positive reform.",
          "marks": 3,
          "expected_answer": "1. In 'Dawuni's Dream', Alheri's steadfast support motivates Dawuni to reform. 2. In 'A Calabash of Saha', Abidatu's persistence ensures the successful development of the water purification system."
        },
        {
          "label": "(c)",
          "question": "State two ways in which the environment functions as a character rather than merely a background setting in these texts.",
          "marks": 3,
          "expected_answer": "1. In 'Forest Gold', the river is personified as turning against its inhabitants due to human abuse. 2. In 'Dawuni's Dream', the parched land 'cries out for help', reflecting the kingdom's moral state."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB8Intermediate() {
  console.log("Seeding Basic 8 Intermediate Practice Lab (100 Items) for The Beacon of Light...");
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
      id: `B8_BL_I_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "intermediate",
      category: `${item.strand} Analysis`,
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Analyze the deeper literary devices, character motivations, and thematic undertones in '${item.text}' related to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Demonstrate intermediate literary appreciation of prescribed The Beacon of Light texts (${item.text}), evaluating structural mechanics, character psychology, thematic interconnections, tone, and sociological sub-text.`
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
      id: `B8_BL_I_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B8",
      difficulty: "intermediate",
      category: `${item.strand}`,
      title: `${item.text} - Intermediate Appreciation & Analysis`,
      shortSummary: `In-depth extract analysis, thematic critique, and stylistic appreciation for '${item.text}' (10 Marks).`,
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
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Thoroughly addresses sub-question ${sq.label} with direct textual evidence`)
          },
          expression: {
            name: "expression",
            displayName: "Literary Diction, Critical Synthesis & P-E-E Structure",
            maxMarks: 5,
            scoringGuidelines: ["Accurate identification and explanation of stylistic and thematic devices", "Point-Evidence-Explanation (P-E-E) synthesis and clear prose"],
            diagnosticChecklist: ["Demonstrates critical synthesis, appropriate literary terminology, and standard WAEC BECE presentation"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Analyze the nuanced figurative language, character dynamics, and moral/societal commentary in '${item.text}'.`,
      competencyTarget: `${item.strand}: Intermediate Extract Appreciation & Synthesis`,
      learningCompetency: `B8.2.2.1 / B8.2.3.1: Critically evaluate literary excerpts from The Beacon of Light across poetry, drama, and prose, applying the P-E-E method, analyzing authorial craft, character foils, and comparative thematic structures.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (90 Objective + 10 Theory Extracts)`);

  const labPayload = {
    level: "B8",
    difficulty: "intermediate",
    title: "Basic 8 Literature Diagnostic Lab: The Beacon of Light (Intermediate Tier - 100 Items)",
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
          id: `B8_BL_I_TH_${t.item_number}`,
          title: `${t.text} - Intermediate Appreciation`,
          category: t.strand,
          shortSummary: `Extract analysis, figurative appreciation, and critical synthesis of ${t.text}`
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
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B8_intermediate`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // 2. Update parent doc practice pool for B8 medium/intermediate
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b8: {
            practicePool: {
              medium: allItems
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool to: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 100 items for The Beacon of Light B8 Intermediate Lab!`);
}

seedBeaconOfLightB8Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Intermediate Lab:", err);
    process.exit(1);
  });
