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

export const recalibratedMock6Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `The regional auditorium in Sunyani was packed to capacity for the grand finale of the Junior High Schools Debate Competition. Fourteen-year-old Serwaa sat behind the speakers' podium for Berekum Presby JHS, her palms damp with nervous sweat. Across the aisle sat the defending champions, Saint Joseph's JHS, looking poised, experienced, and confident. 

The motion before the house was: "Practical Vocational Training is More Beneficial to Ghanaian Youth than Purely Academic Grammar Education." Berekum Presby had been drawn to argue for the motion.

When the chief judge rang the first bell, Serwaa's knees trembled as she stepped to the microphone. At first, her voice shook slightly, and she stumbled over her opening greetings. Laughter rippled across the back rows of the audience, threatening to shatter her composure.

However, Serwaa caught the encouraging eye of her English tutor, Mr. Addo, seated in the second row. He gave her a calm, firm nod that steadied her racing heart. Taking a deep breath, Serwaa pushed aside her fear and began her substantive presentation.

She spoke clearly and passionately about the economic realities of modern Ghana. Drawing examples from her own community, she contrasted unemployed university graduates with skilled electricians, modern carpenters, and solar technicians who earned decent incomes while providing essential community services. Her arguments were well-structured, supported with practical facts, and delivered with conviction.

When the final bell chimed, the entire hall rose in thunderous applause. The judges scored the contest with great care. When the chief adjudicator announced Berekum Presby JHS as the new regional champions, tears of joy streamed down Serwaa’s cheeks. She had proven that determination can turn fear into triumphant success.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What debate motion was debated during the regional competition finale?",
      answer: "Practical Vocational Training is More Beneficial to Ghanaian Youth than Purely Academic Grammar Education."
    },
    {
      subQuestion: "(b)",
      question: "Why did laughter ripple across the audience when Serwaa began her presentation?",
      answer: "Because her voice was trembling and she stumbled over her opening greetings due to nervousness."
    },
    {
      subQuestion: "(c)",
      question: "How did Mr. Addo help Serwaa regain her confidence on stage?",
      answer: "He caught her eye and gave her a calm, firm nod of encouragement from the second row."
    },
    {
      subQuestion: "(d)",
      question: "Mention two practical examples Serwaa gave to support vocational education.",
      answer: "She contrasted unemployed university graduates with skilled electricians, modern carpenters, or solar technicians who earned steady incomes."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... packed to capacity;\nII. ... caught the encouraging eye;\nIII. ... rose in thunderous applause.",
      answer: "I. 'packed to capacity' means completely filled with people; crowded to the maximum limit.\nII. 'caught the encouraging eye' means noticed a supportive and reassuring look from someone.\nIII. 'rose in thunderous applause' means stood up and clapped loudly and enthusiastically."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. poised;\nII. stumbled;\nIII. composure;\nIV. conviction.",
      answer: "I. poised: calm, composed, self-assured, confident.\nII. stumbled: hesitated, faltered, tripped over words.\nIII. composure: calmness, self-control, poise.\nIV. conviction: confidence, firmness, certainty."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the outcome of the competition.",
      answer: "1. Serwaa delivered a powerful presentation.\n2. Berekum Presby won the championship trophy."
    }
  ]
};

export const recalibratedMock7Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the bustling market town of Aboabo, Friday afternoons were always noisy and crowded. Shoppers bargained for food items while commercial tricycles weaved through pedestrian lanes. However, beneath this lively commercial activity lay an unsightly environmental eyesore: open storm gutters choked to the brim with garbage.

Instead of disposing of rubbish responsibly, many traders and commuters treated the drainage channels as dumping pits. Discarded single-use black polythene bags, empty water sachets, plastic bottles, and rotting vegetable peels formed thick, smelly dams along the concrete drains. The stagnant black water emitted a foul stench and served as an active breeding nursery for swarms of mosquitoes and houseflies.

Disaster struck on a Tuesday evening when an unexpected two-hour downpour pounded the town. The heavy volume of rainwater could not flow through the blocked culverts. Within thirty minutes, contaminated black runoff breached the gutters, flooding the main market street. The swirling floodwaters submerged thirty market stalls, washing bags of rice, dried fish, and cartons of soap into the mud.

Worse still, several residential compounds nearby were inundated with dirty sewage. Families scrambled onto tabletops to keep their infant children safe. In the weeks that followed, clinics in Aboabo recorded alarming outbreaks of cholera and severe malaria cases.

Troubled by this recurring disaster, fourteen-year-old Kweku and his classmates in the school's Environmental Club took the initiative. Armed with rakes, shovels, and protective gloves, they partnered with local market women for a weekend desilting exercise. They cleared three truckloads of plastic waste from the drains and placed labelled refuse bins along the street. Kweku demonstrated that keeping gutters clear is not just a government duty, but a civic responsibility that saves lives and property.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What unsightly environmental problem plagued the town of Aboabo?",
      answer: "Open storm gutters were choked and filled with plastic waste and garbage."
    },
    {
      subQuestion: "(b)",
      question: "Mention three specific items of refuse that blocked the drainage culverts.",
      answer: "Black polythene bags, empty water sachets, plastic bottles, or rotting vegetable peels."
    },
    {
      subQuestion: "(c)",
      question: "What happened when a two-hour downpour struck the town?",
      answer: "Rainwater could not flow through the choked drains, causing flash floods that submerged market stalls and residential homes."
    },
    {
      subQuestion: "(d)",
      question: "State two waterborne or vector-borne illnesses that broke out after the flood.",
      answer: "Cholera and malaria."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... choked to the brim;\nII. ... environmental eyesore;\nIII. ... took the initiative.",
      answer: "I. 'choked to the brim' means completely filled to the top with debris; tightly blocked.\nII. 'environmental eyesore' means an unpleasant, ugly, and offensive feature in the surroundings.\nIII. 'took the initiative' means took bold first action to solve a problem without waiting for orders."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. bustling;\nII. stagnant;\nIII. breached;\nIV. desilting.",
      answer: "I. bustling: busy, lively, active, crowded.\nII. stagnant: still, motionless, foul, unmoving.\nIII. breached: overflowed, broke through, burst over.\nIV. desilting: cleaning, dredging, clearing silt/rubbish."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the action taken by Kweku and his club.",
      answer: "1. The club desilted the choked market drains.\n2. Students placed refuse bins along the street."
    }
  ]
};

export const recalibratedMock8Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the farming village of Sefwi-Wiawso, the arrival of October brought an air of joyful expectation. The cocoa pods hanging from the mature trees had ripened into golden-yellow and bright orange fruits. Thirteen-year-old Yaw spent his mid-term break helping his grandfather, Opanyin Kwame, on his twenty-acre cocoa plantation.

Harvesting cocoa was a communal affair built on the traditional practice of 'nnoboa', where neighboring families took turns assisting one another on their farms without paying cash wages. Early on Monday morning, five neighbors arrived with curved harvesting sickles attached to long bamboo poles. Working together, they cut the ripe pods from the branches without injuring the delicate bark where next season's flowers would bloom.

By midday, enormous mounds of yellow pods were piled under the shade of giant plantain trees. Armed with short wooden clubs, Yaw, his cousins, and the women cracked the pods open and scooped the wet, sweet white beans into woven palm-frond baskets. 

"Look closely, Yaw," his grandfather said, laying fresh green plantain leaves on the forest floor. "Cocoa must be fermented properly to develop its rich chocolate aroma. We heap the wet beans here and cover them tightly with leaves for six days. The heat inside works a quiet miracle."

After fermentation, the beans were hauled to the village drying mats. For two weeks, Yaw helped turn the beans under the hot sun until they crackled like dry leaves and turned a deep, glossy brown. When the licensed buying clerk weighed the forty bags and handed Opanyin Kwame his payment voucher, his grandfather smiled with satisfaction. He set aside money for Yaw’s school fees and bought him a new pair of boots, teaching him that honest farm labor brings enduring blessings.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "How did cocoa farmers know that the cocoa pods were ready for harvest?",
      answer: "The pods had changed color and ripened into golden-yellow and bright orange fruits."
    },
    {
      subQuestion: "(b)",
      question: "Explain the traditional concept of 'nnoboa' as practiced by the farmers.",
      answer: "It is a communal labor practice where neighboring families take turns helping one another on farms without paying cash wages."
    },
    {
      subQuestion: "(c)",
      question: "Why did the harvesters take care not to injure the bark of the cocoa trees?",
      answer: "Because injuring the bark would damage the cushion where next season's flowers and pods would grow."
    },
    {
      subQuestion: "(d)",
      question: "According to Opanyin Kwame, why was fermenting cocoa under plantain leaves necessary?",
      answer: "To develop the rich chocolate aroma and flavor of the cocoa beans through natural heat."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... an air of joyful expectation;\nII. ... works a quiet miracle;\nIII. ... set aside money.",
      answer: "I. 'an air of joyful expectation' means a pleasant feeling of looking forward to a rewarding time.\nII. 'works a quiet miracle' means produces a wonderful natural transformation without noise or fuss.\nIII. 'set aside money' means saved or reserved funds for a specific important purpose."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. communal;\nII. delicate;\nIII. scooped;\nIV. satisfaction.",
      answer: "I. communal: shared, collective, joint.\nII. delicate: fragile, tender, soft.\nIII. scooped: spooned out, scraped, gathered.\nIV. satisfaction: contentment, joy, pleasure, pride."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize how Opanyin Kwame used his harvest earnings.",
      answer: "1. He paid Yaw's school fees promptly.\n2. Grandfather bought Yaw new school boots."
    }
  ]
};

export const recalibratedMock9Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `For generations, the River Birim was the pride of Kyebi and its surrounding villages. Its clean, crystal-clear waters flowed gracefully over smooth pebbles, providing the community with cool drinking water, freshwater fish, and a refreshing place where school children swam on hot afternoons.

However, over the past three years, the tranquil river valley turned into a scene of ruin. Lured by the promise of instant wealth, groups of illegal gold miners, locally called galamsey operators, invaded the river basin. Armed with heavy earth-moving excavators and mechanical washing plants, they tore down ancient trees and gouged deep trenches along the riverbanks.

The most heartbreaking transformation was the destruction of the water itself. The miners directed muddy slurries back into the river, washing gold with dangerous chemicals like mercury. Within a year, the clean, sparkling stream was converted into a thick, yellowish-brown sludge. River fish and crabs died off completely, and community taps running from the municipal water plant shut down because treatment filters could no longer handle the heavy mud.

To make matters worse, deep mining pits were left uncovered across farmland trails. During heavy rains, these trenches filled with water, becoming hidden death traps. Two young schoolboys grazing cattle barely escaped drowning when the edge of an abandoned pit collapsed beneath their feet.

Realizing that silence was no longer an option, the local youth association and village elders held an emergency town gathering. Led by the chief, the community passed a firm resolution banning all illegal mining machinery from their lands. Together with police protection, they impounded the excavators and began planting indigenous bamboo along the riverbanks to halt erosion and restore their water. They proved that gold can never replace clean water for human survival.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "Mention two benefits the River Birim provided to the community before illegal mining began.",
      answer: "It provided clean drinking water, freshwater fish, and a safe place for children to swim."
    },
    {
      subQuestion: "(b)",
      question: "How did illegal gold miners destroy the natural riverbanks?",
      answer: "They used heavy excavators to tear down trees and dig deep trenches along the riverbanks."
    },
    {
      subQuestion: "(c)",
      question: "Why did the municipal water treatment plant shut down its taps?",
      answer: "The river had turned into thick yellow mud and chemicals, which clogged and overwhelmed the treatment filters."
    },
    {
      subQuestion: "(d)",
      question: "What danger did abandoned mining pits pose to children walking along farmland paths?",
      answer: "The water-filled pits had crumbling edges, creating hidden death traps where children could fall in and drown."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... clean, crystal-clear waters;\nII. ... silence was no longer an option;\nIII. ... gold can never replace clean water.",
      answer: "I. 'clean, crystal-clear waters' means pure, unpolluted, and completely transparent stream water.\nII. 'silence was no longer an option' means people could not continue to ignore the danger; action had to be taken.\nIII. 'gold can never replace clean water' means material wealth is useless if the essential water needed for life is destroyed."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. invaded;\nII. converted;\nIII. impounded;\nIV. restore.",
      answer: "I. invaded: overran, entered forcefully, occupied.\nII. converted: changed, transformed, turned into.\nIII. impounded: seized, confiscated, held by authority.\nIV. restore: recover, revive, bring back, repair."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the actions taken by the community to save the river.",
      answer: "1. The community seized the illegal excavators.\n2. Residents planted bamboo to stop erosion."
    }
  ]
};

export const recalibratedMock10Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the northern savannah plains of Walewale, thirteen-year-old Alhassan looked forward to Saturday afternoons. His primary responsibility was grazing his father's herd of thirty cattle across the open pastures along the edge of the Gambaga escarpment.

On one overcast afternoon, while the herd grazed peacefully, dark bruised clouds gathered rapidly on the northern horizon. The dry savannah wind turned cool and gusty, signaling an approaching storm. Alhassan quickly gathered his herd and began driving them toward the safety of the village pen.

As the first heavy raindrops struck the dry earth, Alhassan conducted a quick count of his animals. To his horror, he noticed that a four-month-old brown calf, named Baako, was missing. Baako’s mother stood by the trail, lowing plaintively into the whistling wind.

Leaving the main herd in the care of his younger brother, who was already near the village gate, Alhassan turned back into the gathering gloom. Thunder rolled across the sky, and lightning flashed through the acacia trees. He called Baako’s name over and over, his voice swallowed by the storm.

After searching the scrubland for twenty minutes, Alhassan heard a faint, frightened bleat from a nearby rocky hollow. Hurrying down the slippery slope, he found the young calf trapped in a thorny tangle of acacia bushes, its hind leg caught between two rocks.

Speaking soothingly to calm the shivering animal, Alhassan worked carefully to free its leg from the thorns. Though the sharp thorns scratched his arms, he did not give up. Hoisting the wet, heavy calf onto his shoulders, Alhassan trudged through the driving rain until he reached his father's courtyard. 

His father embraced him with relief and pride. Alhassan proved that responsibility and compassion toward animals are the true hallmarks of character.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What duty was assigned to Alhassan on Saturday afternoons?",
      answer: "Grazing his father's herd of thirty cattle across the savannah pastures."
    },
    {
      subQuestion: "(b)",
      question: "What two signs indicated that a heavy storm was approaching?",
      answer: "Dark bruised clouds gathered rapidly, and the wind turned cool and gusty."
    },
    {
      subQuestion: "(c)",
      question: "Where did Alhassan discover the missing young calf?",
      answer: "In a rocky hollow, trapped in thorny acacia bushes with its leg wedged between two rocks."
    },
    {
      subQuestion: "(d)",
      question: "How did Alhassan bring the rescued calf back home through the rain?",
      answer: "He hoisted the heavy calf onto his shoulders and carried it all the way home."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... conducting a quick count;\nII. ... swallowed by the storm;\nIII. ... hallmarks of character.",
      answer: "I. 'conducting a quick count' means rapidly tallying or numbering the animals to ensure none were lost.\nII. 'swallowed by the storm' means drowned out or completely muffled by the loud roar of wind and thunder.\nIII. 'hallmarks of character' means distinct, noble qualities that show good personal upbringing and maturity."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. overcast;\nII. plaintively;\nIII. gloom;\nIV. trudged.",
      answer: "I. overcast: cloudy, gray, dull, gloomy.\nII. plaintively: mournfully, sorrowfully, sadly.\nIII. gloom: darkness, dimness, shadow.\nIV. trudged: walked heavily, struggled forward, marched wearily."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize Alhassan's heroic rescue.",
      answer: "1. Alhassan searched the stormy forest bravely.\n2. He carried the injured calf home."
    }
  ]
};

export const recalibratedMock11Comprehension = {
  title: "Part B: Reading Comprehension",
  instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
  passageText: `In the farming community of Akropong, the basic school faced a persistent academic challenge: poor reading proficiency among junior high school students. The school had no dedicated reading room, and the few old textbooks available were kept locked in a wooden cupboard in the headmaster's office. Consequently, candidates preparing for national examinations struggled with basic English comprehension and composition writing.

Determined to change this narrative, the school's newly formed Youth Literacy Club, led by fourteen-year-old Abigail, launched an initiative called "A Book for Akropong." 

First, the students secured permission from the town chief to renovate an abandoned community post office that had fallen into disuse. On Saturdays, club members gathered to scrub the stained walls, repair broken louver blades, and paint the interior with bright cream emulsion. The village carpenter volunteered his labor to construct sturdy wooden bookshelves and reading tables using spare timber planks.

Next, Abigail wrote a formal letter of appeal to secondary school alumni and charity organizations in Accra. The response was encouraging. Within two months, several boxes of storybooks, junior encyclopedias, dictionaries, and past examination papers were delivered to the school.

When the library was officially commissioned by the district director of education, children from all classes flooded into the hall to borrow books. Every afternoon, the quiet room filled with eager students reading under the supervision of volunteer teachers. 

Within one academic year, students' reading speeds improved remarkably, and English test scores rose across the district. Abigail showed that when young people take action, they can ignite an intellectual revolution in their community.`,
  questions: [
    {
      subQuestion: "(a)",
      question: "What main academic challenge did students at Akropong Basic School face?",
      answer: "Poor reading proficiency and lack of access to library books."
    },
    {
      subQuestion: "(b)",
      question: "What abandoned building did the students renovate into a library?",
      answer: "An old community post office that had fallen into disuse."
    },
    {
      subQuestion: "(c)",
      question: "How did the local carpenter contribute to the library project?",
      answer: "He volunteered his labor to build sturdy wooden bookshelves and reading tables."
    },
    {
      subQuestion: "(d)",
      question: "Mention two types of reading materials donated to the new library.",
      answer: "Storybooks, junior encyclopedias, dictionaries, or past examination papers."
    },
    {
      subQuestion: "(e)",
      question: "Explain the meaning of the following expressions as used in the passage:\nI. ... change this narrative;\nII. ... flooded into the hall;\nIII. ... ignite an intellectual revolution.",
      answer: "I. 'change this narrative' means alter or improve an unsatisfactory situation; reverse a negative trend.\nII. 'flooded into the hall' means entered the room in large, excited numbers.\nIII. 'ignite an intellectual revolution' means inspire a widespread passion for learning and academic excellence."
    },
    {
      subQuestion: "(f)",
      question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. persistent;\nII. initiative;\nIII. sturdy;\nIV. commissioned.",
      answer: "I. persistent: ongoing, continuous, enduring, lasting.\nII. initiative: project, venture, effort, plan.\nIII. sturdy: strong, durable, solid, firm.\nIV. commissioned: opened, inaugurated, launched."
    },
    {
      subQuestion: "(g)",
      question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the positive results of the library project.",
      answer: "1. Students' reading skills improved significantly.\n2. District examination scores rose remarkably."
    }
  ]
};

async function main() {
  const db = await getFirestoreDb();
  console.log("Connected to Firestore. Updating Mocks 6 through 11 Paper 2 Comprehension...");

  const mocks = [
    { num: 6, data: recalibratedMock6Comprehension },
    { num: 7, data: recalibratedMock7Comprehension },
    { num: 8, data: recalibratedMock8Comprehension },
    { num: 9, data: recalibratedMock9Comprehension },
    { num: 10, data: recalibratedMock10Comprehension },
    { num: 11, data: recalibratedMock11Comprehension }
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

  console.log("All 6 Firestore mock comprehensions (6-11) successfully updated!");
}

main().catch(err => {
  console.error("Error updating Firestore:", err);
  process.exit(1);
});
