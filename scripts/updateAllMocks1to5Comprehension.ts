import * as admin from 'firebase-admin';
import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';

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
  try {
    const { OAuth2Client } = require('google-auth-library');
    const { Firestore } = require('@google-cloud/firestore');
    const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
    return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }) as any;
  } catch (e) {
    const adminInst = (admin as any)?.apps ? admin : ((admin as any)?.default || require('firebase-admin'));
    if (!adminInst?.apps?.length) {
      adminInst.initializeApp({
        credential: adminInst.credential.applicationDefault(),
        projectId: 'gamedu-69888475-f5783'
      });
    }
    return adminInst.firestore();
  }
}

export const recalibratedMock1Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `Every Saturday morning, Kejetia Market in Kumasi wakes up to a loud hum of human activity. Hawkers call out their wares, commercial buses blare their horns, and porters carrying heavy wooden trays navigate through the crowded aisles. On one such morning, fourteen-year-old Ama followed her grandmother to sell fresh vegetables near the central lorry station.

While arranging green bell peppers on her wooden table, Ama noticed a well-dressed woman hurrying toward a departing minibus. In her haste to board the bus before it pulled away, a thick leather purse slipped from the woman's shoulder bag and fell quietly onto a sack of onions. The crowd moved on, unaware of what had happened.

Ama ran forward and picked up the heavy purse. When she opened the outer zipper, her heart skipped a beat. Inside were clean bundles of fifty-cedi notes, an official hospital identity card bearing the name Dr. Grace Mensah, and a silver wedding ring. 

A young truck pusher standing nearby nudged Ama with his elbow. "Keep quiet and hide it, little girl," he whispered hurriedly. "No one saw you. This money can buy you fine clothes for the Christmas holidays."

Ama hesitated for only a second. The gentle voice of her school headmaster echoed in her mind: "A good name is far better than stolen silver and gold." Without listening to the porter, she sprinted after the bus, which was already revving its engine to leave the station.

Waving the purse high in the air, Ama shouted Dr. Mensah's name. A passenger seated near the window tapped the driver on the shoulder, and the bus screeched to an abrupt halt. When Dr. Mensah received her lost purse intact, tears filled her eyes. The purse contained the emergency surgical fee for a critically ill patient awaiting surgery at Komfo Anokye Teaching Hospital.

Dr. Mensah praised Ama's honesty before the entire market crowd. Beside a generous cash gift to support her basic education, the doctor promised to sponsor Ama through secondary school. Standing proudly beside her grandmother, Ama learned that integrity brings lasting honor.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What business brought Ama and her grandmother to Kejetia Market?",
      answer: "They went to the market to sell fresh vegetables (or fresh bell peppers)."
    },
    {
      subQuestion: "(b)",
      question: "How did Dr. Mensah lose her leather purse?",
      answer: "She was rushing to catch a departing minibus when the purse slipped from her shoulder bag."
    },
    {
      subQuestion: "(c)",
      question: "What bad advice did the young truck pusher give to Ama?",
      answer: "He urged her to keep quiet, hide the purse, and use the money to purchase fine Christmas clothes."
    },
    {
      subQuestion: "(d)",
      question: "Why was the recovery of the purse especially urgent for Dr. Mensah?",
      answer: "The purse contained emergency money needed for a surgery on a critically ill patient at the hospital."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... her heart skipped a beat;\nII. ... screeched to an abrupt halt;\nIII. ... brings lasting honor.",
      answer: "I. 'her heart skipped a beat' means she felt a sudden shock of surprise, excitement, or nervousness.\nII. 'screeched to an abrupt halt' means stopped suddenly with a loud, sharp braking sound.\nIII. 'brings lasting honor' means earns enduring respect, praise, and a good reputation."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. haste;\nII. hesitated;\nIII. sprinted;\nIV. praised.",
      answer: "I. haste: hurry, rush, speed.\nII. hesitated: paused, delayed, wavered.\nIII. sprinted: ran, dashed, rushed.\nIV. praised: commended, lauded, congratulated."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize how Ama was rewarded for her honesty.",
      answer: "1. She received an educational cash gift.\n2. Dr. Mensah sponsored her secondary education."
    }
  ]
};

export const recalibratedMock2Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `The annual Inter-Schools Athletics Championship at Bekwai Sports Arena had reached its most tense moment: the senior boys' 4x100-meter relay final. The stands were packed with cheering students waving colorful flags. For three years in a row, the defending champions, Methodist JHS, had held the gold trophy. However, this afternoon, their arch-rivals, Saint Peter's JHS, looked fast, confident, and determined to unseat them.

In lane four, Kwame was running the third leg for Methodist JHS. He was agile and swift, but he had a habit of starting his sprint too early during practice sessions. His sports master, Coach Owusu, had drilled the squad all week: "Speed alone does not win a relay race; smooth baton exchange and timing are what make champions."

The starter pistol fired with a sharp crack. The lead runners tore out of the blocks. By the time the second runners completed their turn, Saint Peter's held a slight lead of three meters. 

As the second runner from Methodist JHS approached the changeover box, Kwame braced himself. The roar of the stadium was deafening. Kwame felt the urge to dash forward early, but remembering Coach Owusu’s warning, he held his ground until his teammate crossed the yellow checkmark. With perfect timing, Kwame extended his left hand backward. The wooden baton slapped firmly into his palm.

Gripping the baton securely, Kwame accelerated around the bend. His strides were smooth and powerful. Within forty meters, he closed the gap on the Saint Peter's runner, handing the baton cleanly to his anchor-leg teammate, Mensah. 

The stadium erupted as Mensah crossed the finish line a fraction of a second ahead of his rival. Beside the victory podium, Coach Owusu embraced the four boys warmly. The boys realized that winning required trusting each other and following disciplined instructions under pressure.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "Which school had won the senior boys' relay trophy for the past three years?",
      answer: "Methodist Junior High School."
    },
    {
      subQuestion: "(b)",
      question: "What bad habit did Kwame display during training sessions?",
      answer: "He had a habit of starting to run too early before taking the baton."
    },
    {
      subQuestion: "(c)",
      question: "According to Coach Owusu, what two factors are essential for winning a relay race?",
      answer: "Smooth baton exchange and proper timing (not speed alone)."
    },
    {
      subQuestion: "(d)",
      question: "How did Kwame help his team regain the lead during his leg of the race?",
      answer: "He ran a powerful curve, closed the gap on the Saint Peter's runner, and made a clean baton pass to the anchor runner."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... held his ground;\nII. ... closed the gap;\nIII. ... erupted as Mensah crossed.",
      answer: "I. 'held his ground' means waited patiently without rushing forward prematurely.\nII. 'closed the gap' means reduced the distance separating him from the runner ahead.\nIII. 'erupted as Mensah crossed' means burst into loud, joyful cheering and celebration."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. packed;\nII. drilled;\nIII. firm;\nIV. embraced.",
      answer: "I. packed: crowded, filled, jammed.\nII. drilled: trained, instructed, coached.\nIII. firm: securely, tightly, solidly.\nIV. embraced: hugged, held warmly."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two lessons learned by the victorious athletes.",
      answer: "1. Teamwork requires trusting one's teammates.\n2. Athletes must follow discipline under pressure."
    }
  ]
};

export const recalibratedMock3Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the historic town of Bonwire in the Ashanti Region, the rhythmic clatter of wooden looms fills the air from dawn to dusk. Bonwire is celebrated worldwide as the home of authentic Ghanaian Kente cloth. Here, the art of weaving is not merely a job; it is a sacred cultural heritage passed down from generation to generation.

Thirteen-year-old Kofi spent his school holidays sitting on a low wooden bench beside his uncle, Master Agyeman. Master Agyeman was renowned throughout the district for weaving complex royal patterns. In front of him stood a traditional loom built from smooth forest timber, fitted with pedals, shuttles, and spools of bright yellow, green, red, and blue silk threads.

"Weaving Kente requires patience, Kofi," his uncle explained, sliding a polished wooden shuttle back and forth through the warp. "Each color carries a voice. Gold represents royalty and wealth; green symbolizes growth and harvest; while blue stands for peace and pure skies."

At first, Kofi found the rhythm difficult to follow. His hands tangled the threads, and his feet pressed the wooden pedals out of turn. Twice, he snapped the warp strings and wanted to quit out of frustration. But his uncle encouraged him gently: "The best cloth is woven with a calm mind. Rest your hands and try again."

By his third week of practice, Kofi's fingers grew nimble. He learned to weave the narrow four-inch strips that are sewn together to make royal cloths. He even mastered a simple pattern called 'Adwinasa', which means 'all design ideas are exhausted'. 

On the town's annual Kente Festival, tourists from across Africa and overseas gathered to admire the weavers. When Master Agyeman displayed a beautiful sash woven entirely by young Kofi, the crowd cheered in admiration. An elderly visitor purchased the sash as a gift for her grandson in Canada. Holding his first earned income, Kofi felt a deep pride in his heritage.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What makes the town of Bonwire famous worldwide?",
      answer: "It is famous for being the traditional home of authentic handwoven Ghanaian Kente cloth."
    },
    {
      subQuestion: "(b)",
      question: "According to Master Agyeman, what do the colors gold and green represent in Kente cloth?",
      answer: "Gold represents royalty and wealth, while green symbolizes growth and harvest."
    },
    {
      subQuestion: "(c)",
      question: "Mention two difficulties young Kofi encountered when he first started learning to weave.",
      answer: "His hands tangled the threads, he pressed the foot pedals at the wrong time, or he broke the warp strings."
    },
    {
      subQuestion: "(d)",
      question: "What does the name of the traditional Kente design 'Adwinasa' literally mean?",
      answer: "It means 'all design ideas are exhausted' (or design ideas have reached their limit)."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... passed down from generation to generation;\nII. ... grew nimble;\nIII. ... cheered in admiration.",
      answer: "I. 'passed down from generation to generation' means taught and handed on from parents or ancestors to children over many years.\nII. 'grew nimble' means became quick, skillful, and flexible in movement.\nIII. 'cheered in admiration' means shouted praises in appreciation and delight."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. renowned;\nII. tangled;\nIII. frustration;\nIV. purchased.",
      answer: "I. renowned: famous, well-known, celebrated.\nII. tangled: knotted, twisted, jumbled.\nIII. frustration: annoyance, disappointment, impatience.\nIV. purchased: bought, acquired."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the advice and result of Kofi's training.",
      answer: "1. Weaving requires patience and a calm mind.\n2. Kofi wove a sash bought by tourists."
    }
  ]
};

export const recalibratedMock4Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the small coastal settlement of Senya Beraku, fourteen-year-old Kwesi loved listening to the sound of the ocean waves crashing against the cliffs. His father and uncles were all fishermen who went out to sea before sunrise in wooden canoes powered by small outboard motors. 

One Saturday afternoon, while walking along the beach with his younger brother Yaw, Kwesi noticed two small boys playing with an inflated rubber tube near the water's edge. The tide was coming in fast, and the afternoon wind was picking up strength. Suddenly, a large wave lifted the rubber tube and swept the two children past the protective surf zone into deep water. 

The boys screamed for help, their small arms splashing wildly as the strong rip current dragged them farther away from the shore. The few market women sitting under coconut sheds cried out in terror, but none of them could swim.

Kwesi did not waste time shouting. Remembering the swimming techniques his father had taught him during calm afternoons, he kicked off his slippers, snatched a coiled nylon mooring rope from an anchored fishing canoe, and plunged into the rolling surf.

Fighting against the heavy pull of the undertow, Kwesi swam with steady, powerful strokes. When he reached the exhausted boys, he instructed the older child to hold onto his shoulders while he tucked the smaller boy under his left arm. Tying one end of the nylon rope securely around his waist, he raised his right hand and waved to the crowd on the beach.

Realizing his plan, several young men on the shore grabbed the free end of the rope and pulled with all their might. Within minutes, Kwesi and the two coughing boys were hauled safely onto the dry sand.

The local chief and village elders praised Kwesi for his presence of mind and bravery. At the next community gathering, Kwesi was presented with a new bicycle and a scholarship citation for saving two lives.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What danger pulled the two boys into the deep sea?",
      answer: "A strong incoming tide (or high wave and rip current) carried their inflated rubber tube past the safe shore zone."
    },
    {
      subQuestion: "(b)",
      question: "Why were the market women on the beach unable to rescue the drowning children?",
      answer: "None of the market women knew how to swim."
    },
    {
      subQuestion: "(c)",
      question: "What equipment did Kwesi take before diving into the water?",
      answer: "He took a coiled nylon mooring rope from an anchored canoe."
    },
    {
      subQuestion: "(d)",
      question: "How did the crowd on the beach assist Kwesi to bring the boys back to land?",
      answer: "They pulled the free end of the nylon rope that Kwesi had tied around his waist."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... picking up strength;\nII. ... did not waste time;\nIII. ... presence of mind.",
      answer: "I. 'picking up strength' means becoming faster, stronger, and more forceful.\nII. 'did not waste time' means acted immediately without delay.\nIII. 'presence of mind' means the ability to stay calm, think clearly, and act sensibly in an emergency."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. swift;\nII. plunged;\nIII. exhausted;\nIV. praised.",
      answer: "I. swift: fast, quick, rapid.\nII. plunged: dived, jumped, leaped.\nIII. exhausted: tired, worn-out, fatigued.\nIV. praised: commended, lauded, congratulated."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the gifts Kwesi received for his courage.",
      answer: "1. The chief gave him a new bicycle.\n2. He received a school scholarship citation."
    }
  ]
};

export const recalibratedMock5Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the farming village of Obuasi-Nkwanta, nightfall usually brought complete darkness. The community was not connected to the national electrical grid, so families depended on small kerosene tin lamps to cook and study. These lamps flickered weakly in the breeze and produced thick black soot that irritated the eyes and made school children cough.

Fourteen-year-old Kofi was determined to find a solution. He was fascinated by simple electrical circuits and spent his afternoons reading science magazines borrowed from his headmaster. 

Using pocket money saved from selling wild berries, Kofi bought two discarded solar cells from an electronics repairer in the neighboring town. He also collected an old rechargeable torch battery, a small switch, and copper wiring from a broken transistor radio. With guidance from his Integrated Science teacher, Mr. Mensah, Kofi mounted the solar cells on a square piece of timber and connected them to the battery.

He placed the device on the thatched roof of his parents' kitchen during the daytime to absorb sunlight. By nightfall, the battery was fully charged. When Kofi flipped the switch, bright white light from three small LED bulbs lit up his family's living room.

For the first time, Kofi and his younger sisters could read their school books without smoke stinging their eyes. Word spread quickly through the village. Neighbors came to view the "miracle box that traps the sun."

The village headman was so impressed by Kofi's invention that he convened an elders' meeting. The community decided to purchase materials for Kofi and his teacher to assemble twenty more solar lanterns for all the elderly widows and primary school pupils in the village. Kofi proved that curiosity and practical science can solve real community problems.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "Why did families in Obuasi-Nkwanta rely on kerosene lamps at night?",
      answer: "The village was not connected to the national electricity grid."
    },
    {
      subQuestion: "(b)",
      question: "Mention two health problems caused by the smoke from the kerosene tin lamps.",
      answer: "It irritated/stung the eyes and made children cough."
    },
    {
      subQuestion: "(c)",
      question: "Name three items Kofi used to build his solar lighting system.",
      answer: "Discarded solar cells, an old rechargeable battery, copper wiring, a switch, or LED bulbs."
    },
    {
      subQuestion: "(d)",
      question: "What decision was taken by the village elders after seeing Kofi's invention?",
      answer: "They decided to buy materials for Kofi and his teacher to build twenty more solar lanterns for widows and school children."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... flickered weakly;\nII. ... word spread quickly;\nIII. ... miracle box that traps the sun.",
      answer: "I. 'flickered weakly' means burned unevenly with a dim, unsteady light.\nII. 'word spread quickly' means news was shared and passed rapidly from person to person.\nIII. 'miracle box that traps the sun' means an amazing device that captures solar energy to produce light."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. depended;\nII. discarded;\nIII. guided;\nIV. assemble.",
      answer: "I. depended: relied, counted, leaned.\nII. discarded: thrown-away, rejected, unused.\nIII. guided: advised, directed, assisted.\nIV. assemble: construct, build, put together."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the benefits of Kofi's invention.",
      answer: "1. It allowed children to study safely.\n2. The village adopted solar lanterns widely."
    }
  ]
};

async function main() {
  const db = await getFirestoreDb();
  console.log("Connected to Firestore. Updating Mocks 1 through 5 Paper 2 Comprehension...");

  const mocks = [
    { num: 1, data: recalibratedMock1Comprehension },
    { num: 2, data: recalibratedMock2Comprehension },
    { num: 3, data: recalibratedMock3Comprehension },
    { num: 4, data: recalibratedMock4Comprehension },
    { num: 5, data: recalibratedMock5Comprehension }
  ];

  for (const m of mocks) {
    const docPath = `global_curriculum/jhs/subjects/english/mocks/mock_${m.num}`;
    const docRef = db.doc(docPath);
    await docRef.set({
      paper2: {
        sections: {
          partB_comprehension: m.data
        }
      }
    }, { merge: true });
    console.log(`✅ Firestore updated: mock_${m.num} Comprehension`);
  }

  console.log("All 5 Firestore mock comprehensions successfully updated!");
}

main().catch(err => {
  console.error("Error updating Firestore:", err);
  process.exit(1);
});
