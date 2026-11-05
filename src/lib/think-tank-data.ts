export type ThinkTankTargetGroup =
  | 'Novice (Basic 1-3)'
  | 'Apprentice (Basic 4-6)'
  | 'Scholar (JHS)'
  | 'Master (SHS)';

export interface ThinkTankParadoxItem {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  targetGroup: ThinkTankTargetGroup;
  difficulty: string;
  isCentral?: boolean;
}

export interface ThinkTankDetectiveCaseItem {
  id: string;
  caseType: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  targetGroup: ThinkTankTargetGroup;
  isCentral?: boolean;
}

export interface ThinkTankRiddleItem {
  id: string;
  category: 'Word Riddle' | 'Math & Logic' | 'Science & Nature' | 'African Wisdom' | 'Lateral Thinking';
  question: string;
  hint1: string;
  hint2: string;
  answer: string;
  acceptedKeywords: string[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetGroup: ThinkTankTargetGroup;
  isCentral?: boolean;
}

export interface ThinkTankDebateItem {
  id: string;
  topic: string;
  context: string;
  targetGroup: ThinkTankTargetGroup;
  isCentral?: boolean;
}

export const THINK_TANK_PARADOXES: ThinkTankParadoxItem[] = [
  {
    "id": "tt-paradox-nov-1",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Kofi and Ama were born on the exact same day, in the same month, and in the same year to the same mother and father, yet they are NOT twins. How is this possible?",
    "answer": "They are part of triplets (or quadruplets).",
    "explanation": "We often assume two children born together must be twins, forgetting that three babies born at once are triplets!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "A rooster sits right on the sharp peak of a slanted barn roof facing North. If the wind blows hard from the East, which side of the roof will the egg roll down?",
    "answer": "Neither side — roosters do not lay eggs!",
    "explanation": "Only hens lay eggs. The wind direction and roof slant are distractions designed to make you skip checking who is on the roof.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Some months have 30 days, and some months have 31 days. How many months in the year have 28 days?",
    "answer": "All 12 months have at least 28 days!",
    "explanation": "February has 28 (or 29) days, and every other month also passes through day 28 before reaching 30 or 31.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-4",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "You are running in a school sports race and you overtake the runner who is in 2nd place. What place are you in now?",
    "answer": "2nd place (not 1st place).",
    "explanation": "When you pass the person in 2nd place, you take their position (2nd). The person in 1st place is still ahead of you!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-5",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "An electric train is travelling South from Kumasi to Accra at 80 km/h. The wind is blowing North at 40 km/h. Which way does the smoke from the train blow?",
    "answer": "There is no smoke — it is an electric train!",
    "explanation": "Electric trains run on electricity and do not burn coal or diesel to produce smoke.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-6",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Before Mount Afadjato was discovered as the highest mountain peak in Ghana, what was the highest mountain peak in Ghana?",
    "answer": "Mount Afadjato was still the highest!",
    "explanation": "A mountain exists at its full height even before people measure or name it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-7",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Number Sense",
    "question": "There are 5 mangoes in a basket. How can you divide them among 5 children so that each child gets 1 whole mango, and 1 mango still stays inside the basket?",
    "answer": "Give the 5th child the basket with the last mango inside it.",
    "explanation": "Every child has 1 mango, and 1 mango is still in the basket because one child is holding both!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-8",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "A father and his son are in a minor bicycle accident. The boy is taken to the hospital, and the surgeon says, \"I cannot operate on him — he is my son!\" How can this be?",
    "answer": "The surgeon is the boy’s mother.",
    "explanation": "Our minds sometimes assume a surgeon must be a man, overlooking the simple fact that his mother is the doctor.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-1",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A man walks into a restaurant and orders a glass of water. The waiter suddenly claps loudly, startles the man, and the man smiles, says \"Thank you!\", and walks out without drinking the water. Why?",
    "answer": "The man had the hiccups!",
    "explanation": "He asked for water to cure his hiccups. When the waiter startled him, his hiccups stopped immediately, so he no longer needed the water.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "Which is heavier: one kilogram of solid iron nails or one kilogram of soft kapok cotton?",
    "answer": "Neither — both weigh exactly one kilogram!",
    "explanation": "Iron is denser (takes up less space), so it feels heavier in a small handful, but 1 kg of any material has the exact same mass as 1 kg of another.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A woman lives on the 12th floor of an apartment building. Every morning she takes the elevator all the way down to the ground floor. On rainy days she rides straight back up to the 12th floor, but on sunny days she stops at the 8th floor and walks up the last 4 flights. Why?",
    "answer": "She is too short to reach the button for the 12th floor unless she uses her umbrella on rainy days.",
    "explanation": "She can always reach the lowest button (\"Ground\" / \"1\") in the morning, and on rainy days her umbrella helps her press \"12\".",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-4",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Logic",
    "question": "A lily pad in a pond doubles in size every single day. If it takes 20 days for the lily pad to cover the entire pond, on which day was the pond half-covered?",
    "answer": "Day 19 (not Day 10!).",
    "explanation": "Because the lily pad doubles every day, it only needs 1 day to go from half the pond to the whole pond. So half the pond was covered on Day 19.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-5",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "River Crossing",
    "question": "A farmer must cross a river in a small canoe with a goat, a wolf, and a basket of cassava leaves. The canoe can only hold the farmer and ONE item at a time. Left alone, the wolf will eat the goat, and the goat will eat the cassava leaves. How does he get all three across safely?",
    "answer": "Take the goat across first; return alone; take the wolf across and bring the goat back; leave the goat and take the cassava across; return alone to fetch the goat.",
    "explanation": "The secret is bringing the goat BACK on the second return trip so the wolf and goat are never left together.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-6",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "Two girls play 5 games of draughts (checkers). Each girl wins the exact same number of games, and there are no draws or ties. How is that possible?",
    "answer": "They were not playing against each other!",
    "explanation": "Each girl was playing against different opponents in a tournament.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-7",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Measurement Logic",
    "question": "You have an empty 5-litre jug, an empty 3-litre jug, and a tap with unlimited water. How can you measure out exactly 4 litres of water?",
    "answer": "Fill the 5L jug, pour into the 3L jug (leaving 2L in the 5L jug). Empty the 3L jug, pour the 2L into the 3L jug, refill the 5L jug, and top up the 3L jug (which takes 1L), leaving 4L in the 5L jug.",
    "explanation": "By using the difference (5 - 3 = 2 litres) and then subtracting 1 more litre from a full 5L jug, you get 4 litres.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-8",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Calendar Logic",
    "question": "Kwame turned 11 years old the day before yesterday, and next year he will turn 14. How can this be true?",
    "answer": "Today is January 1st, and Kwame’s birthday is December 31st.",
    "explanation": "On Dec 30 he was 10; on Dec 31 (yesterday) he turned 11; this year (on Dec 31) he will turn 12... wait: if he turned 11 on Dec 31 of last year, on Dec 31 of THIS year he turns 12, and on Dec 31 of NEXT year he turns 13 (or if he was 11 on Dec 30 and turned 12 on Dec 31, he turns 13 this year and 14 next year!).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-1",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "The Barber Paradox: In a small town, the barber shaves all men, and ONLY those men, who do not shave themselves. Does the male barber shave himself?",
    "answer": "It is a logical contradiction — neither \"yes\" nor \"no\" works!",
    "explanation": "If the barber shaves himself, then he is a man who shaves himself, so by rule he must NOT shave himself. If he does not shave himself, then by rule he MUST shave himself. Bertrand Russell used this to show contradictions in naive set theory.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Identity Paradox",
    "question": "The Ship of Theseus: A wooden fishing boat has every single plank, nail, and mast replaced one by one over 20 years as parts rot. Is it still the same boat? What if someone builds a second boat out of all the old discarded planks?",
    "answer": "Identity depends on whether we define an object by its physical matter or by its continuous history and form.",
    "explanation": "This ancient paradox shows that our concept of \"sameness\" splits into material continuity (the original wood) vs. functional/historical continuity (the working vessel). Just like human cells replace themselves over time!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "Three sealed boxes are on a table. One contains only Gold coins, one contains only Silver coins, and one contains a Mix of both. All three labels (\"Gold\", \"Silver\", \"Mix\") are guaranteed to be on the WRONG boxes. By drawing just ONE coin from ONE box without looking inside, how can you label all three correctly?",
    "answer": "Draw one coin from the box labeled \"Mix\".",
    "explanation": "Since every label is wrong, the box labeled \"Mix\" cannot be a mix — it must be pure Gold or pure Silver. If you pull a Gold coin from it, that box is \"Gold\". Then the box labeled \"Silver\" cannot be Silver or Gold, so it must be \"Mix\", leaving the last box as \"Silver\"!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-4",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You are in a dark room with a drawer containing 10 blue socks and 10 black socks mixed together. What is the minimum number of socks you must pull out to be 100% certain you have a matching pair of the same colour?",
    "answer": "Only 3 socks!",
    "explanation": "By the Pigeonhole Principle, there are only 2 colours (pigeonholes). Even in the worst case where your first 2 socks are different (1 blue, 1 black), the 3rd sock MUST match one of them.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-5",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Self-Reference",
    "question": "The Liar Paradox: Pinocchio’s nose grows if and only if he tells a lie. What happens if Pinocchio says, \"My nose will grow right now\"?",
    "answer": "It creates a self-referential logical loop.",
    "explanation": "If his nose does not grow, then his statement was false (a lie), which forces his nose to grow. But if his nose grows, then his statement was true, which means it should not have grown!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-6",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Lateral Physics",
    "question": "You are sitting in a small boat floating inside a closed swimming pool. Inside your boat is a heavy iron anchor. If you toss the iron anchor overboard so it sinks to the bottom of the pool, does the water level of the pool rise, fall, or stay the same?",
    "answer": "The water level falls slightly!",
    "explanation": "While inside the floating boat, the heavy anchor displaces an amount of water equal to its WEIGHT (which is large because iron is dense). Once at the bottom of the pool, it only displaces water equal to its small VOLUME.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-7",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Truth & Lies",
    "question": "You reach a fork in the road where one path leads to Techiman and the other to a swamp. Two twins stand there: one ALWAYS tells the truth and one ALWAYS lies, and you do not know which is which. What single Yes/No question can you ask ONE twin to find the road to Techiman?",
    "answer": "Ask either twin: \"If I asked your twin whether the left road leads to Techiman, what would they say?\" — then do the OPPOSITE of the answer.",
    "explanation": "Both paths pass through one truth-teller and one liar, so the combined answer is guaranteed to be a lie! Reversing it gives you the guaranteed truth.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-8",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Arithmetic Illusion",
    "question": "Three friends pay GH₵ 30 total (GH₵ 10 each) for a hostel room. Realizing the room only costs GH₵ 25, the receptionist gives GH₵ 5 to the porter to return. The porter gives GH₵ 1 back to each friend (so each paid GH₵ 9, totaling GH₵ 27) and keeps GH₵ 2. Where did the missing GH₵ 1 from GH₵ 30 go?",
    "answer": "Nowhere — adding the porter’s GH₵ 2 to the GH₵ 27 paid is a math trick!",
    "explanation": "The friends paid GH₵ 27 in total: GH₵ 25 is with the receptionist and GH₵ 2 is with the porter (25 + 2 = 27). Plus the GH₵ 3 returned to the friends makes GH₵ 30!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-1",
    "targetGroup": "Master (SHS)",
    "difficulty": "Statistical Paradox",
    "question": "Survivorship Bias (Abraham Wald’s Aircraft Paradox): During WWII, engineers examined returning planes and found most bullet holes on the wings and fuselage, with almost none on the engines. Commanders wanted to add heavy armor to the wings where the most holes were. Why did mathematician Abraham Wald tell them to armor the engines instead?",
    "answer": "Because planes hit in the engines never returned to be counted!",
    "explanation": "The sample of returning planes only showed where a plane could be hit and SURVIVE. The missing bullet holes on the engines proved that hits there were fatal. This is called Survivorship Bias.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-2",
    "targetGroup": "Master (SHS)",
    "difficulty": "Probability Paradox",
    "question": "The Monty Hall Paradox: On a game show, there are 3 doors: behind one is a scholarship prize, and behind two are goats. You pick Door 1. The host (who knows what is behind every door) opens Door 3 to reveal a goat, then asks if you want to switch to Door 2. Does switching increase your chance of winning?",
    "answer": "Yes! Switching doubles your probability of winning from 1/3 (33.3%) to 2/3 (66.7%).",
    "explanation": "Your initial choice (Door 1) had a 1/3 chance of being right, meaning there was a 2/3 chance the prize was behind Doors 2 or 3. When the host intentionally eliminates Door 3, the entire 2/3 probability concentrates onto Door 2.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-3",
    "targetGroup": "Master (SHS)",
    "difficulty": "Infinite Series",
    "question": "Zeno’s Paradox of Achilles and the Tortoise: Achilles gives a slow tortoise a 100-metre head start. By the time Achilles runs 100m, the tortoise has moved 10m. By the time Achilles runs that 10m, the tortoise moves 1m, and so on infinitely. Why does Zeno claim Achilles can never overtake the tortoise, and how does calculus resolve it?",
    "answer": "An infinite number of decreasing time intervals can sum to a finite time!",
    "explanation": "Zeno assumed that an infinite number of steps must take an infinite amount of time. However, a geometric series (100 + 10 + 1 + 0.1 + ...) converges to a finite sum (111.11 metres), which Achilles crosses in a few seconds.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-4",
    "targetGroup": "Master (SHS)",
    "difficulty": "Epistemic Logic",
    "question": "The Unexpected Hanging (Surprise Quiz) Paradox: A teacher announces on Friday: \"There will be a surprise quiz next week (Mon–Fri); you will not know on the morning of the quiz that it will happen that day.\" A student argues it can never happen: it cannot be Friday (or you’d know by Thursday night), so by elimination it cannot be Thursday, Wednesday, Tuesday, or Monday. On Wednesday the teacher gives the quiz — and the student is completely surprised! Where did the student’s deduction fail?",
    "answer": "The student treated a conditional belief about future knowledge as an absolute fact.",
    "explanation": "To eliminate Friday, the student had to assume the teacher’s entire statement was true — but then concluded the statement was impossible, contradicting their own starting assumption!",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-5",
    "targetGroup": "Master (SHS)",
    "difficulty": "Data & Statistics",
    "question": "Simpson’s Paradox: Hospital A has a higher survival rate than Hospital B for mild cases AND a higher survival rate than Hospital B for severe cases. Yet when all patients are combined into one table, Hospital B has a higher overall survival rate! How is that mathematically possible?",
    "answer": "Hospital A treats a much larger proportion of severe cases, which pulls down its combined average.",
    "explanation": "Simpson’s Paradox occurs when a lurking variable (case severity) weights the denominators unequally across groups, reversing the trend when data is aggregated.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-6",
    "targetGroup": "Master (SHS)",
    "difficulty": "Game Theory",
    "question": "Braess’s Paradox: In a busy city road network, engineers build a brand-new, ultra-fast shortcut connecting two main highways. Instead of speeding up traffic, average travel time for EVERY driver gets worse! Why?",
    "answer": "Selfish routing shifts drivers onto the shared bottleneck feeding the shortcut, overloading the network’s Nash Equilibrium.",
    "explanation": "When every driver independently chooses what looks fastest for themselves, they abandon distributed routes and jam the entry and exit roads of the shortcut.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-7",
    "targetGroup": "Master (SHS)",
    "difficulty": "Economics & Value",
    "question": "Adam Smith’s Diamond-Water Paradox: Water is essential for all human survival while diamonds are mostly ornamental, yet a tiny diamond costs thousands of cedis while a litre of water costs very little. Why?",
    "answer": "Prices are driven by marginal utility and scarcity, not total utility.",
    "explanation": "Total utility of water is immense, but because water is relatively abundant, the marginal utility of one extra glass is low. Diamonds are scarce, so the marginal utility of one diamond remains high.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-mas-8",
    "targetGroup": "Master (SHS)",
    "difficulty": "Astrophysics",
    "question": "Olbers’ Paradox: If the universe were infinitely old, infinitely large, and filled uniformly with stars, every line of sight in the night sky would eventually hit a star’s surface. Why, then, is the night sky dark instead of blazing as bright as the Sun?",
    "answer": "The universe has a finite age (~13.8 billion years) and is expanding.",
    "explanation": "Light from the most distant stars has not had time to reach us yet, and cosmic expansion redshifts distant starlight out of the visible spectrum into microwaves.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-101",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Kofi gives away his red pencil to Ama. Now Kofi has no red pencil, but Ama has one. Can Kofi still draw with a red pencil if Ama lends it right back to him?",
    "answer": "Yes, because sharing allows the same object to be used without owning it permanently.",
    "explanation": "Giving something away changes ownership, but borrowing or sharing lets you use it again. Logic separates owning an object from using an object.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-102",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "The more holes you dig out of a mound of wet clay behind the school kitchen, the bigger the hole becomes, but where does the clay go?",
    "answer": "The clay is removed to make space, so the hole gets bigger as substance is taken away.",
    "explanation": "A hole is defined by the absence of matter rather than the addition of matter. Taking away material makes the void larger.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-103",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If you shout 'I am completely quiet!' at the top of your voice during assembly, are you telling the truth?",
    "answer": "No, because the act of shouting contradicts the statement.",
    "explanation": "The moment you speak to say you are quiet, you create sound. This is a self-defeating action.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-104",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Esi stands behind Kwame in a queue at the water pump, and Kwame stands behind Esi at the exact same moment. How can this be?",
    "answer": "They are standing back-to-back.",
    "explanation": "Being 'behind' depends on the direction each person is facing. If both face away from each other, each is behind the other's back.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-105",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "You drop a dry sponge into a bucket of water from the well. The sponge gets heavier, but does the total water in the bucket become lighter?",
    "answer": "The remaining water in the bucket decreases, but the overall weight of bucket plus sponge stays balanced.",
    "explanation": "The sponge soaks up liquid from the bucket. The water didn't disappear; it simply changed location inside the sponge.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-106",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A teacher tells the class: 'Every rule has an exception.' Does this rule itself have an exception?",
    "answer": "Yes, which means either it breaks itself or some rules have no exceptions.",
    "explanation": "If every rule has an exception, then that statement must also have an exception. This creates a circular loop of logic.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-107",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you blow air into a balloon until it pops, was the balloon filled with something or nothing?",
    "answer": "It was filled with air, which is real matter taking up space.",
    "explanation": "Air cannot be seen with our eyes, but it has mass and volume. Invisible things are still real matter.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-108",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Akosua walks forward toward a big mirror in the hall. Why does her reflection walk forward toward her instead of walking backward?",
    "answer": "The mirror reverses front-to-back direction relative to the surface.",
    "explanation": "A mirror reflects light straight back along the line it arrives. Moving closer to the surface makes the reflection appear closer too.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-109",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have three ripe mangoes on a table and you take away two mangoes, how many mangoes do you have?",
    "answer": "You have two mangoes.",
    "explanation": "The question asks how many you have in your possession, not how many remain on the table. You took two, so you hold two.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-110",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A sign on a wooden gate at Kejetia market says: 'Do not read this sign.' Can anyone obey the instruction?",
    "answer": "No, because to know what not to do, you must read the sign first.",
    "explanation": "Understanding the instruction requires performing the very action the sign prohibits. By reading it, you have already disobeyed.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-102",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "To walk across a 10-metre football pitch, you must first reach the halfway mark (5m), then half of the remaining distance (2.5m), and so on forever. Can you ever reach the goal line?",
    "answer": "Yes, because an infinite number of decreasing intervals sums to a finite total distance.",
    "explanation": "Zeno's Dichotomy paradox divides space infinitely in thought, but in real physics, time and distance accumulate continuously to finish the journey.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-103",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A pile of 10,000 cocoa beans is definitely a heap. If you remove one bean, it is still a heap. If you keep removing one bean at a time, at what exact single bean does it stop being a heap?",
    "answer": "There is no single threshold bean because 'heap' is a vague qualitative term.",
    "explanation": "Known as the Sorites paradox, this shows that language often uses fuzzy boundaries that cannot be pinpointed to an exact quantitative step.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-104",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A heavy cocoa sack of 50kg and a light football of 0.5kg are dropped from the top of the school water tower in a vacuum tube with no air resistance. Which hits the ground first?",
    "answer": "Both land at the exact same instant.",
    "explanation": "Gravity accelerates all masses at the identical rate (g ≈ 9.8 m/s²) when air drag is removed. Greater mass requires more force to accelerate, keeping acceleration constant.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-105",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A crocodile snatches a papaya from a farmer and says: 'I will return this papaya if you correctly guess what I will do next.' The farmer says: 'You will not return it.' What must the crocodile do?",
    "answer": "The crocodile faces a logical contradiction and cannot act consistently.",
    "explanation": "If the crocodile keeps it, the farmer was right, meaning it must return it. If the crocodile returns it, the farmer was wrong, meaning it should keep it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-107",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "In a village council, the head elder declares: 'I only trust people who say they never tell lies.' Why is this dangerous logic?",
    "answer": "Because anyone claiming to never tell a lie is almost certainly lying.",
    "explanation": "Human beings occasionally make errors or tell untruths. Believing absolute perfection invites deception from skilled liars.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-108",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "Cold water freezes, but in some kitchen tests hot water appears to freeze faster than cool tap water in the deep freezer. How is this possible?",
    "answer": "Evaporation reduces the volume of hot water and convection currents speed heat transfer.",
    "explanation": "The Mpemba effect occurs under specific conditions where hot water loses mass through rapid steam loss and develops stronger convective currents.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-101",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "A traveler builds a time machine, travels back 60 years to colonial Gold Coast, and accidentally prevents their grandparents from meeting. Does the traveler exist to travel back in time?",
    "answer": "The scenario forms an unresolved causal loop known as the Grandfather Paradox.",
    "explanation": "If the grandparents never meet, the traveler is never born. If the traveler is never born, no one travels back to prevent the meeting.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-102",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "A philosopher from Cape Coast states: 'This statement is completely false.' Is the statement true or false?",
    "answer": "It is neither; it is an inherently self-referential paradox with no stable truth value.",
    "explanation": "If the statement is true, then by its own definition it is false. If it is false, then what it asserts is correct, making it true.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-103",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a school of 367 students in Tamale, can we guarantee with 100% certainty that at least two students share the exact same calendar birthday?",
    "answer": "Yes, by the Pigeonhole Principle.",
    "explanation": "A standard calendar has at most 366 days (including leap years). If 367 students are assigned to 366 possible calendar dates, at least one date must hold two students.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-107",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "Every green plant uses chlorophyll. Does observing a black goat in Bolgatanga provide scientific evidence that all green plants use chlorophyll?",
    "answer": "Logically yes, via contrapositive equivalence, though the confirmation value is infinitesimally tiny.",
    "explanation": "Hempel's Raven Paradox shows that 'All A are B' is logically equivalent to 'All non-B are non-A'. A non-green non-plant confirms the contrapositive.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-108",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a classroom of just 23 JHS students, is it more likely than not (greater than 50% chance) that two students share the exact same birthday?",
    "answer": "Yes, the probability is approximately 50.7%.",
    "explanation": "The Birthday Paradox counts pairwise comparisons (23 × 22 / 2 = 253 distinct pairs). The probability that all 23 people have unique birthdays is below 50%.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-109",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "A ladder moving horizontally at 90% of the speed of light is physically longer than a small shed. Due to length contraction, can it momentarily fit inside the closed shed?",
    "answer": "Yes from the shed's perspective, but the doors do not close simultaneously from the ladder's perspective.",
    "explanation": "Special relativity dictates that simultaneity is relative. Observers in different reference frames disagree on whether the front and back doors closed at the exact same moment.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-110",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "If an omnipotent being can do absolutely anything, can that being create a boulder so heavy that the being cannot lift it?",
    "answer": "The question presents a logical contradiction rather than a test of real power.",
    "explanation": "Omnipotence paradoxes demonstrate that combining mutually contradictory definitions ('can do everything' versus 'a task that cannot be done') produces semantic nonsense.",
    "isCentral": true
  }
];

export const THINK_TANK_DETECTIVE_CASES: ThinkTankDetectiveCaseItem[] = [
  {
    "id": "tt-case-nov-1",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "During science class, Esi says: \"Ice melts into liquid water when left in the warm sun.\" Her friend Yaw says: \"Ice cream is the most delicious food in the whole world.\"",
    "question": "Which statement is a FACT that can be tested and proven true for everyone?",
    "options": [
      "Esi’s statement about ice melting in the sun",
      "Yaw’s statement about ice cream being the most delicious food",
      "Both statements are opinions",
      "Neither statement can be tested"
    ],
    "correctAnswer": "Esi’s statement about ice melting in the sun",
    "explanation": "A fact can be measured and proven by anyone (ice melts above 0°C). \"Most delicious\" is a personal feeling or opinion that differs from person to person.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Someone ate the last slice of mango cake from the kitchen table between 2:00 PM and 2:30 PM. Muddy footprints lead from the back garden door straight to the table. Kofi was reading in his clean socks upstairs, Amina just came in from playing football in the muddy garden, and Dad was at work.",
    "question": "Based on the physical evidence, who is the most likely suspect?",
    "options": [
      "Amina, who was playing in the muddy garden",
      "Kofi, who was reading upstairs in clean socks",
      "Dad, who was away at work",
      "A bird flying outside the window"
    ],
    "correctAnswer": "Amina, who was playing in the muddy garden",
    "explanation": "The muddy footprints match Amina’s muddy shoes from the garden, whereas Kofi had clean socks and Dad was not home.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "A school poster reads: (1) \"Ghana gained independence on 6th March 1957.\" (2) \"Red is the prettiest colour on the Ghana flag.\"",
    "question": "How should a Junior Detective classify these two sentences?",
    "options": [
      "Sentence 1 is a Fact; Sentence 2 is an Opinion",
      "Sentence 1 is an Opinion; Sentence 2 is a Fact",
      "Both are Facts",
      "Both are Opinions"
    ],
    "correctAnswer": "Sentence 1 is a Fact; Sentence 2 is an Opinion",
    "explanation": "6th March 1957 is a historical date that can be verified in records (Fact). Which colour looks \"prettiest\" is a personal preference (Opinion).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-4",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Tetteh claims he could not have spilled paint on the art table at 10:00 AM because he was watching the live noon news on TV at that exact moment.",
    "question": "Why does Tetteh’s alibi not make sense?",
    "options": [
      "The noon news airs at 12:00 PM, not 10:00 AM",
      "Paint cannot spill on a table",
      "TVs do not work in the morning",
      "Art class only happens on Saturdays"
    ],
    "correctAnswer": "The noon news airs at 12:00 PM, not 10:00 AM",
    "explanation": "\"Noon\" means 12:00 PM. Tetteh could not be watching a live 12:00 PM broadcast at 10:00 AM!",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-5",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "Every morning when the school bell rings at 8:00 AM, the birds in the mango tree fly away. Little Kwesi says, \"The birds flying away is what makes the school bell ring!\"",
    "question": "What mistake did Kwesi make?",
    "options": [
      "He mixed up the cause (the loud bell) and the effect (the birds flying away)",
      "Birds cannot hear loud bells",
      "Mango trees do not have branches",
      "School bells only ring at night"
    ],
    "correctAnswer": "He mixed up the cause (the loud bell) and the effect (the birds flying away)",
    "explanation": "The loud sound of the bell startles the birds (cause), making them fly away (effect) — not the other way around!",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-6",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Weather Evidence",
    "scenario": "Araba walks into the classroom carrying a dripping wet umbrella and wearing a raincoat covered in water droplets. The floor outside the door is dry.",
    "question": "What is the most reasonable deduction about where Araba just came from?",
    "options": [
      "It is raining outside",
      "She went swimming with her umbrella",
      "It hasn’t rained for a month",
      "The classroom roof is made of glass"
    ],
    "correctAnswer": "It is raining outside",
    "explanation": "A dripping umbrella and wet raincoat are strong clues that she just walked through the rain outdoors.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-7",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Look at these four statements about elephants in Mole National Park. Three are facts and one is an opinion.",
    "question": "Which statement is an OPINION?",
    "options": [
      "Elephants are the cutest animals in the whole park",
      "Elephants use their trunks to drink water and pick up food",
      "African elephants are larger than Asian elephants",
      "Elephants are herbivores that eat plants, bark, and fruit"
    ],
    "correctAnswer": "Elephants are the cutest animals in the whole park",
    "explanation": "What someone finds \"cutest\" is a personal opinion, whereas diet, size, and trunk use are scientific facts.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-8",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Missing Item Mystery",
    "scenario": "Mrs. Mensah left 4 blue markers on her desk before break. After break, only 3 blue markers are on the desk, and Kojo is drawing a bright blue sky on his poster using a marker that has Mrs. Mensah’s name sticker on it.",
    "question": "What is the best conclusion?",
    "options": [
      "Kojo borrowed the 4th blue marker from Mrs. Mensah’s desk",
      "The marker vanished into thin air",
      "Mrs. Mensah only had 2 markers before break",
      "Blue markers turn invisible at break time"
    ],
    "correctAnswer": "Kojo borrowed the 4th blue marker from Mrs. Mensah’s desk",
    "explanation": "The name sticker on Kojo’s blue marker directly matches the missing 4th marker from Mrs. Mensah’s desk.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-1",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A company that sells sugary fizzy drinks pays for a poster that says: \"9 out of 10 kids at our company party said fizzy soda is better for morning energy than plain water!\"",
    "question": "Why should a smart thinker question this claim?",
    "options": [
      "Conflict of interest & biased sample: the soda company ran the survey at its own party",
      "9 out of 10 is less than half",
      "Kids cannot drink water in the morning",
      "Posters are illegal in schools"
    ],
    "correctAnswer": "Conflict of interest & biased sample: the soda company ran the survey at its own party",
    "explanation": "When the seller of a product tests only guests at its own party and asks about taste/preference rather than medical nutrition, the result is heavily biased.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "The school trophy case was opened on Saturday. Suspect A says: \"I was at the library reading on Page 45 and 46 of the Science textbook, and I put a bookmark between pages 45 and 46 before closing the book.\"",
    "question": "How does the detective immediately know Suspect A is making up the story?",
    "options": [
      "In standard books, odd page 45 is on the right and even page 46 is printed on the back of the exact same sheet!",
      "Libraries are never open on Saturdays",
      "Science textbooks only have 30 pages",
      "Bookmarks cannot fit inside textbooks"
    ],
    "correctAnswer": "In standard books, odd page 45 is on the right and even page 46 is printed on the back of the exact same sheet!",
    "explanation": "Because page 1 is on the right-hand side of a book, every odd page (like 45) has the next even page (46) on its reverse side. You cannot place a bookmark between the front and back of a single sheet of paper!",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "Bola asked her 2 best friends if they want the school canteen to serve only banku every day. Both friends said yes, so Bola wrote in the school newsletter: \"100% of students in our school want banku every single day!\"",
    "question": "What is the flaw in Bola’s conclusion?",
    "options": [
      "Her sample size (only 2 friends) is way too small to represent the whole school",
      "2 out of 2 is actually 50%",
      "Newsletters cannot print percentages",
      "Her friends do not attend the school"
    ],
    "correctAnswer": "Her sample size (only 2 friends) is way too small to represent the whole school",
    "explanation": "Surveying only 2 friends out of hundreds of students is an unrepresentative, tiny sample size.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-4",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "During a power outage at night, someone took laptops from the ICT lab. Suspect Yaw says: \"I walked into the dark ICT lab, saw that the thief was wearing a dark green shirt and a brown belt, and ran to call security.\"",
    "question": "Why is Yaw’s testimony suspicious?",
    "options": [
      "In total darkness without light, human eyes cannot distinguish colours like dark green and brown",
      "Laptops glow brightly even when turned off",
      "ICT labs do not have doors",
      "Security guards do not work at night"
    ],
    "correctAnswer": "In total darkness without light, human eyes cannot distinguish colours like dark green and brown",
    "explanation": "Cone cells in the human retina require light to detect colour; in a dark room during a power outage, you cannot tell dark green from brown.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-5",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A survey asks students: \"Don’t you agree that reckless, noisy football games during break should be banned so peaceful, hardworking students can relax?\"",
    "question": "What kind of bias is built into this survey question?",
    "options": [
      "Loaded / Leading Question: it uses emotional words (\"reckless, noisy\" vs \"peaceful, hardworking\") to push one answer",
      "Math error: it does not include numbers",
      "Time bias: break time is in the afternoon",
      "There is no bias at all"
    ],
    "correctAnswer": "Loaded / Leading Question: it uses emotional words (\"reckless, noisy\" vs \"peaceful, hardworking\") to push one answer",
    "explanation": "A fair survey uses neutral wording (\"Should football be allowed in the main yard during break?\"). Emotional adjectives steer people toward a predetermined answer.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-6",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Physical Clues",
    "scenario": "A window in the science classroom was broken by a stone. All the broken glass shards are lying OUTSIDE on the veranda grass rather than inside the classroom floor.",
    "question": "What does the position of the broken glass tell the detective?",
    "options": [
      "The window was broken from the INSIDE pushing outward, not from outside",
      "A strong wind sucked the glass through the wall",
      "Someone threw the stone from outside in the garden",
      "Glass always falls toward the sun"
    ],
    "correctAnswer": "The window was broken from the INSIDE pushing outward, not from outside",
    "explanation": "When an object strikes a window, most of the shattered glass falls in the direction the force was travelling. Glass on the outside means the impact came from inside the room!",
    "isCentral": true
  },
  {
    "id": "tt-case-app-7",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sequence Deduction",
    "scenario": "Four houses on Independence Avenue are painted Red, Blue, Green, and Yellow in a row from left to right. (1) The Green house is immediately to the left of the Yellow house. (2) The Blue house is at one of the far ends. (3) The Red house is right next to the Blue house.",
    "question": "If the Blue house is on the far left (Position 1), what is the exact order from left to right?",
    "options": [
      "Blue, Red, Green, Yellow",
      "Blue, Green, Yellow, Red",
      "Red, Blue, Yellow, Green",
      "Green, Yellow, Red, Blue"
    ],
    "correctAnswer": "Blue, Red, Green, Yellow",
    "explanation": "Blue is at Position 1. Since Red is next to Blue, Red is at Position 2. That leaves Positions 3 and 4 for Green and Yellow, with Green immediately to the left of Yellow!",
    "isCentral": true
  },
  {
    "id": "tt-case-app-8",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Source Credibility",
    "scenario": "You are writing a science report on how malaria is transmitted. You find two sources: Source A is a peer-reviewed guide from the Ghana Health Service & WHO; Source B is an anonymous WhatsApp voice note claiming eating spicy pepper prevents mosquito bites.",
    "question": "Which source is credible and why?",
    "options": [
      "Source A, because it comes from verified medical experts backed by scientific research",
      "Source B, because voice notes are faster to listen to",
      "Both sources are equally reliable",
      "Neither, because mosquitoes do not transmit malaria"
    ],
    "correctAnswer": "Source A, because it comes from verified medical experts backed by scientific research",
    "explanation": "Credible scientific claims come from accountable health institutions and tested evidence, not unverified anonymous forwards.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-1",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral blog post with the headline \"SHOCKING! Scientists Prove Drinking Lemon Water Charges Your Smartphone Battery!\" has no author name, cites an \"unnamed lab\", and ends with a link to buy \"Miracle Lemon Drops\" for GH₵ 150.",
    "question": "Which combination of red flags exposes this article as Fake News / Clickbait?",
    "options": [
      "Sensational all-caps headline, unverified anonymous source, scientific impossibility, and a commercial sales link",
      "The article mentions lemons, which only grow in Europe",
      "Smartphones do not have batteries",
      "The price is listed in Ghana Cedis"
    ],
    "correctAnswer": "Sensational all-caps headline, unverified anonymous source, scientific impossibility, and a commercial sales link",
    "explanation": "Disinformation often combines emotional/sensational headlines (\"SHOCKING!\"), vague uncheckable sources (\"unnamed lab\"), and a hidden financial motive.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "City records show that in months when ice cream sales are highest, swimming pool accidents also increase. A commentator claims: \"Eating ice cream causes people to have accidents in swimming pools!\"",
    "question": "What is the hidden third variable (confounding factor) that explains both trends?",
    "options": [
      "Hot weather: sunny, hot months cause more people to buy ice cream AND more people to go swimming",
      "Ice cream makes water heavier",
      "Swimming pools sell all the ice cream in the city",
      "Accidents make people hungry for dessert"
    ],
    "correctAnswer": "Hot weather: sunny, hot months cause more people to buy ice cream AND more people to go swimming",
    "explanation": "Just because two variables rise together (correlation) does not mean one causes the other (causation). Hot weather independently drives both.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A rare bronze statue was stolen from the museum at 9:00 PM. Suspect A claims he was at the beach in Ada all evening and never came near the museum’s freshwater lily pond. However, a water sample from his wet boots contains microscopic freshwater pond algae and zero salt (NaCl).",
    "question": "What does the lab report prove?",
    "options": [
      "Suspect A’s beach alibi is false — his boots were soaked in freshwater pond water, not salty ocean water",
      "The Atlantic Ocean at Ada has no salt at night",
      "Freshwater algae only grow inside bronze statues",
      "Boots naturally produce pond algae when dry"
    ],
    "correctAnswer": "Suspect A’s beach alibi is false — his boots were soaked in freshwater pond water, not salty ocean water",
    "explanation": "Seawater contains ~3.5% dissolved salt. Absence of salt plus freshwater algae links his boots directly to the museum’s freshwater pond.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-4",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A new tutoring app advertises: \"Students who used our app doubled their test scores — a 100% increase!\" When you inspect the fine print, only 1 student was tested, and their score went from 1/50 to 2/50.",
    "question": "How is this statistic misleading?",
    "options": [
      "It uses a relative percentage (100% increase) on a tiny baseline (1 point to 2 points) and a sample size of 1 to hide poor actual performance",
      "Going from 1 to 2 is actually a 500% increase",
      "Apps cannot track test scores",
      "2 out of 50 is a passing grade of 80%"
    ],
    "correctAnswer": "It uses a relative percentage (100% increase) on a tiny baseline (1 point to 2 points) and a sample size of 1 to hide poor actual performance",
    "explanation": "Always check both the absolute numbers (1/50 → 2/50) and the sample size behind impressive-sounding percentages!",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-5",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Digital Forensics",
    "scenario": "A student claims they submitted their assignment on Tuesday at 4:00 PM, and presents a screenshot showing \"Submitted: Tuesday 4:00 PM\". However, the file’s server metadata shows the document was first created on Thursday at 8:15 AM.",
    "question": "What is the most logical conclusion?",
    "options": [
      "The screenshot was edited or staged after the deadline because a file cannot be submitted two days before it was created",
      "Servers always record dates two days in the future",
      "Thursday comes before Tuesday",
      "Screenshots automatically erase server logs"
    ],
    "correctAnswer": "The screenshot was edited or staged after the deadline because a file cannot be submitted two days before it was created",
    "explanation": "Client-side screenshots can be easily altered, whereas server creation timestamps and audit logs record the actual chronological event.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-6",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral photo shows a giant shark swimming down a flooded street in Accra after heavy rain. You perform a reverse image search and discover the exact same shark photo appeared in a 2011 magazine article, and in fake posts about hurricanes in Miami, Houston, and Sydney.",
    "question": "What media literacy technique just solved this case?",
    "options": [
      "Reverse image searching / provenance verification to expose recycled doctored imagery",
      "Counting the shark’s teeth",
      "Measuring the rainfall in Accra",
      "Asking the person who forwarded the photo"
    ],
    "correctAnswer": "Reverse image searching / provenance verification to expose recycled doctored imagery",
    "explanation": "Checking the original source and date of viral images (provenance) quickly reveals recycled hoaxes that get re-shared during every storm.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-7",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Deductive Elimination",
    "scenario": "Four students (Abena, Boateng, Ceci, Dede) competed in a Science Fair, finishing 1st, 2nd, 3rd, and 4th. (1) Abena finished ahead of Boateng. (2) Ceci did NOT finish 1st. (3) Dede finished immediately behind Boateng. (4) Ceci finished ahead of Abena.",
    "question": "Wait — examine clues (1), (2), and (4) carefully! Why is this witness report impossible?",
    "options": [
      "If Ceci finished ahead of Abena, Abena ahead of Boateng, and Dede behind Boateng, then Ceci MUST be 1st — which contradicts Clue 2!",
      "Four students cannot enter the same Science Fair",
      "Boateng and Dede have the same number of letters",
      "Abena must always finish 4th"
    ],
    "correctAnswer": "If Ceci finished ahead of Abena, Abena ahead of Boateng, and Dede behind Boateng, then Ceci MUST be 1st — which contradicts Clue 2!",
    "explanation": "Ordering the chain gives: Ceci > Abena > Boateng > Dede. Since there are only 4 positions, Ceci has to be 1st, contradicting Clue 2 (\"Ceci did not finish 1st\").",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-8",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Echo Chamber Analysis",
    "scenario": "Mensah watches one video claiming the Moon is made of hollow titanium. Within two days, his video feed shows 50 more videos making the same claim. Mensah says, \"Every video on the internet agrees, so it must be true!\"",
    "question": "Why is Mensah seeing only those videos?",
    "options": [
      "Algorithmic filter bubble: recommendation algorithms feed him more of what he clicked on, not a balanced view of reality",
      "All scientists recently agreed the Moon is hollow",
      "The internet deleted all astronomy textbooks",
      "His phone screen can only display titanium videos"
    ],
    "correctAnswer": "Algorithmic filter bubble: recommendation algorithms feed him more of what he clicked on, not a balanced view of reality",
    "explanation": "Social media recommendation engines optimize for watch time by showing similar content, creating an illusion of consensus called a filter bubble.",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-1",
    "targetGroup": "Master (SHS)",
    "caseType": "Fallacy Spotter",
    "scenario": "In a student council debate, Candidate A proposes extending library hours by one hour for exam prep. Candidate B replies: \"My opponent wants students locked in the library all night until they collapse from exhaustion and never see their families again!\"",
    "question": "Which logical fallacy did Candidate B commit?",
    "options": [
      "Strawman Fallacy (exaggerating and distorting the opponent’s actual proposal to make it easy to attack)",
      "Ad Hominem (attacking the opponent’s personal background)",
      "Appeal to Authority (citing a famous person)",
      "Circular Reasoning (assuming the conclusion in the premise)"
    ],
    "correctAnswer": "Strawman Fallacy (exaggerating and distorting the opponent’s actual proposal to make it easy to attack)",
    "explanation": "Instead of addressing the real proposal (1 extra hour), Candidate B replaced it with an extreme caricature (\"locked in all night\") — a classic Strawman.",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-2",
    "targetGroup": "Master (SHS)",
    "caseType": "Fallacy Spotter",
    "scenario": "A nutritionist presents clinical data showing that excessive trans-fat intake raises cardiovascular risk. A commentator responds: \"Why should anyone listen to her data? She wore mismatched shoes to the conference last year!\"",
    "question": "Identify the logical fallacy in the commentator’s rebuttal.",
    "options": [
      "Ad Hominem (attacking the person’s appearance/character instead of refuting their evidence)",
      "False Dilemma (presenting only two extremes)",
      "Post Hoc Ergo Propter Hoc (assuming sequence equals cause)",
      "Sunk Cost Fallacy (continuing because of past investment)"
    ],
    "correctAnswer": "Ad Hominem (attacking the person’s appearance/character instead of refuting their evidence)",
    "explanation": "Ad Hominem (\"against the person\") attempts to discredit an argument by attacking irrelevant personal traits of the speaker rather than addressing the data.",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-3",
    "targetGroup": "Master (SHS)",
    "caseType": "Fallacy Spotter",
    "scenario": "During a policy meeting, a speaker declares: \"Either we ban all smartphones from the entire country today, or every single teenager will fail their WASSCE exams!\"",
    "question": "Which logical fallacy is operating here?",
    "options": [
      "False Dilemma / False Dichotomy (forcing a choice between two extreme options while ignoring middle-ground solutions)",
      "Bandwagon Fallacy (claiming it is true because it is popular)",
      "Equivocation (shifting the meaning of a word mid-argument)",
      "Appeal to Ignorance (claiming something is true because it hasn’t been disproven)"
    ],
    "correctAnswer": "False Dilemma / False Dichotomy (forcing a choice between two extreme options while ignoring middle-ground solutions)",
    "explanation": "The speaker ignores practical middle options (such as classroom device rules, study schedules, or educational apps) and pretends only two extreme outcomes exist.",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-4",
    "targetGroup": "Master (SHS)",
    "caseType": "Base Rate Neglect",
    "scenario": "A rare plant disease affects only 1 in 1,000 cocoa trees (0.1%). A rapid sensor is 99% accurate (it correctly flags 99% of diseased trees, and has a 1% false-positive rate on healthy trees). Out of 1,000 trees tested, 1 diseased tree tests positive and ~10 healthy trees also test positive.",
    "question": "If a randomly selected cocoa tree tests positive, what is the approximate probability that it actually has the disease?",
    "options": [
      "About 9% (1 true positive out of ~11 total positive alarms), NOT 99%!",
      "99%, because the sensor is 99% accurate",
      "100%, sensors never make mistakes",
      "50%, because either it has the disease or it doesn’t"
    ],
    "correctAnswer": "About 9% (1 true positive out of ~11 total positive alarms), NOT 99%!",
    "explanation": "This is Bayes’ Theorem / Base Rate Neglect: when a condition is very rare (1 in 1,000), a 1% false-positive rate across 999 healthy trees produces ~10 false alarms for every 1 real case (1 / 11 ≈ 9.1%).",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-5",
    "targetGroup": "Master (SHS)",
    "caseType": "Fallacy Spotter",
    "scenario": "An investor says: \"I already spent GH₵ 50,000 repairing this broken generator that still doesn’t work and costs more to fix than buying a new GH₵ 15,000 solar system. I MUST spend another GH₵ 25,000 on the old generator so my first GH₵ 50,000 isn’t wasted!\"",
    "question": "What cognitive trap is the investor caught in?",
    "options": [
      "The Sunk Cost Fallacy (making poor future decisions to justify past unrecoverable spending)",
      "Confirmation Bias (only reading positive reviews)",
      "The Gambler’s Fallacy (believing a coin flip is due for heads)",
      "Appeal to Tradition (doing it because it is old)"
    ],
    "correctAnswer": "The Sunk Cost Fallacy (making poor future decisions to justify past unrecoverable spending)",
    "explanation": "The past GH₵ 50,000 is already gone (a sunk cost) regardless of what he chooses next. Rational decisions compare only future costs and benefits (GH₵ 15k new solar vs GH₵ 25k old generator).",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-6",
    "targetGroup": "Master (SHS)",
    "caseType": "Research Methodology",
    "scenario": "A pharmaceutical trial tests a new memory tea on 100 volunteers. All 100 volunteers are told they are drinking a \"genius memory formula\", and there is no control group drinking a placebo tea. After a week, 60% say they feel sharper.",
    "question": "Why does this study fail scientific standards?",
    "options": [
      "Lack of a blinded Placebo Control Group and reliance on subjective self-reporting instead of objective memory tests",
      "100 volunteers is an odd number",
      "Tea cannot be served warm in a laboratory",
      "A week is 10 days long"
    ],
    "correctAnswer": "Lack of a blinded Placebo Control Group and reliance on subjective self-reporting instead of objective memory tests",
    "explanation": "Without a double-blind placebo control group and objective cognitive testing, the improvement can be entirely explained by the Placebo Effect and expectation bias.",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-7",
    "targetGroup": "Master (SHS)",
    "caseType": "Formal Logic",
    "scenario": "Premise 1: \"If a student is in the Robotics Club, then they know how to code.\" Premise 2: \"Serwaa knows how to code.\" Conclusion: \"Therefore, Serwaa must be in the Robotics Club.\"",
    "question": "What formal logical error did the speaker make?",
    "options": [
      "Affirming the Consequent (If P then Q; Q is true; therefore P — ignoring that students outside Robotics can also know how to code)",
      "Modus Ponens (valid deduction)",
      "Modus Tollens (valid contrapositive)",
      "Begging the Question"
    ],
    "correctAnswer": "Affirming the Consequent (If P then Q; Q is true; therefore P — ignoring that students outside Robotics can also know how to code)",
    "explanation": "\"If P then Q\" guarantees Q when P is true, but does NOT mean P is the only way to have Q. Serwaa could have learned coding in Python Academy without joining Robotics!",
    "isCentral": true
  },
  {
    "id": "tt-case-mas-8",
    "targetGroup": "Master (SHS)",
    "caseType": "Data Integrity",
    "scenario": "A researcher tests 20 different herbal extracts against bacteria using a significance threshold of p < 0.05 (a 1-in-20 chance of a random fluke). 19 extracts show zero effect, and 1 extract crosses p = 0.04. The researcher hides the 19 failed tests and publishes only the 1 positive result as a breakthrough.",
    "question": "What unethical statistical practice is this?",
    "options": [
      "P-Hacking / Cherry-Picking (testing many hypotheses and reporting only the random false positive while hiding negative trials)",
      "Double-blind randomization",
      "Peer review replication",
      "Standard deviation normalization"
    ],
    "correctAnswer": "P-Hacking / Cherry-Picking (testing many hypotheses and reporting only the random false positive while hiding negative trials)",
    "explanation": "At p < 0.05, testing 20 ineffective substances will produce ~1 false positive purely by chance. Hiding the other 19 tests misleads readers unless a multiple-testing correction (like Bonferroni) is applied.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-101",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four children shared roasted plantain during break time at school. Each child made one statement about the snack.",
    "question": "Which statement is a verifiable FACT rather than a personal opinion?",
    "options": [
      "Roasted plantain is the tastiest snack in Ghana.",
      "Yellow ripe plantain is much prettier than green plantain.",
      "Plantains grow on large herbaceous plants with broad leaves.",
      "Plantain tastes much better when eaten with groundnuts."
    ],
    "correctAnswer": "Plantains grow on large herbaceous plants with broad leaves.",
    "explanation": "A fact can be scientifically observed and proven. Taste preferences and attractiveness are personal opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-102",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Someone walked across the freshly swept compound sand early in the morning and left distinct footprint marks.",
    "question": "The detective notices deep heel prints with curved lines like tire treads. Who made the tracks?",
    "options": [
      "A barefoot pupil rushing to class",
      "A person wearing rubber-soled car-tire sandals (kyorkyor)",
      "A stray goat searching for dropped bread",
      "A domestic cat chasing a field mouse"
    ],
    "correctAnswer": "A person wearing rubber-soled car-tire sandals (kyorkyor)",
    "explanation": "Tire-tread patterns indicate footwear carved from rubber tires, ruling out bare feet and animals.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-103",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "Kofi left his metal toy car outside in the damp grass behind the veranda for three weeks during the rainy season.",
    "question": "What is the direct physical cause of the reddish-brown flakes covering the toy?",
    "options": [
      "Termites chewed the outer coat of paint.",
      "The sun bleached the iron surface.",
      "Exposure to water and oxygen created iron oxide (rust).",
      "Red soil blew across the yard and stuck to the metal."
    ],
    "correctAnswer": "Exposure to water and oxygen created iron oxide (rust).",
    "explanation": "Rust forms when iron chemically reacts with moisture and oxygen over time.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-104",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Ama ate breakfast at 7:00 AM, walked into assembly at 7:45 AM, and wrote her spelling test at 9:00 AM. Her teacher noticed her ink-stained fingers right after assembly.",
    "question": "Between which two times did Ama most likely stain her fingers with ink?",
    "options": [
      "After 9:00 AM during the spelling test",
      "Between 7:00 AM and 7:45 AM while packing her bag",
      "Before 6:30 AM before waking up",
      "At 12:00 PM during lunch break"
    ],
    "correctAnswer": "Between 7:00 AM and 7:45 AM while packing her bag",
    "explanation": "Since the ink was spotted right after assembly at 7:45 AM, the stain had to occur before assembly and after waking up.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-105",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "During nature walk, four pupils observed an African honeybee landing on a bright yellow sunflower.",
    "question": "Which of these statements represents a scientifically verifiable FACT?",
    "options": [
      "Honeybees are scary creatures that should be avoided.",
      "Honey is the most delicious food on earth.",
      "Honeybees have six legs and two pairs of wings.",
      "Yellow flowers are far friendlier than red flowers."
    ],
    "correctAnswer": "Honeybees have six legs and two pairs of wings.",
    "explanation": "Anatomical counts (six legs, four wings) are objective facts, while emotional reactions and taste preferences are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-106",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A box of biscuits in the kitchen cupboard was opened without permission. The culprit left a white powdery smudge on the kitchen stool.",
    "question": "Which suspect left this powdery clue?",
    "options": [
      "Kwame, who was painting green grass outside",
      "Yaw, who was carrying damp charcoal to the stove",
      "Kofi, who was helping his aunt sift cassava flour for fufu",
      "Esi, who was washing black school shoes with water"
    ],
    "correctAnswer": "Kofi, who was helping his aunt sift cassava flour for fufu",
    "explanation": "Cassava flour produces a fine white powder that transfers easily onto furniture.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-107",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "The classroom clock suddenly stopped ticking at exactly 10:15 AM on Tuesday morning.",
    "question": "What is the most direct and logical reason for the wall clock stopping?",
    "options": [
      "The wind blew through the open window.",
      "The chemical energy in its AA battery was fully depleted.",
      "The teacher closed her textbook on the front desk.",
      "The pupils recited their multiplication tables too loudly."
    ],
    "correctAnswer": "The chemical energy in its AA battery was fully depleted.",
    "explanation": "Battery-powered quartz wall clocks stop when their internal electrical power source runs out of energy.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-108",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "The school garden was dry at 2:00 PM. A heavy downpour occurred from 3:00 PM to 4:00 PM. At 5:00 PM, Abena noticed earthworms crawling across the walking path.",
    "question": "Why were the earthworms on the surface at 5:00 PM?",
    "options": [
      "They wanted to sunbathe before sunset.",
      "They emerged after the rain flooded their underground soil burrows.",
      "They climbed out before the rain started at 1:00 PM.",
      "The dry soil at 2:00 PM pushed them out."
    ],
    "correctAnswer": "They emerged after the rain flooded their underground soil burrows.",
    "explanation": "Waterlogged soil depletes oxygen in worm burrows, prompting earthworms to surface directly after heavy rainfall.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-109",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends visited Lake Bosomtwe in the Ashanti Region and described their trip.",
    "question": "Which statement about Lake Bosomtwe is a FACT?",
    "options": [
      "It is the most relaxing body of water in West Africa.",
      "It is Ghana's only natural lake, formed in a meteorite impact crater.",
      "Swimming in the lake is much more exciting than walking around it.",
      "The surrounding green hills are prettier than coastal beaches."
    ],
    "correctAnswer": "It is Ghana's only natural lake, formed in a meteorite impact crater.",
    "explanation": "Geological origin and classification as Ghana's sole natural crater lake are verified scientific facts.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-110",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective examines four cups of water left on the sill. Cup A is crystal clear, Cup B has floating oil droplets, Cup C is warm, and Cup D smells strongly of fresh palm fruit.",
    "question": "Which cup definitely had palm oil mixed into it?",
    "options": [
      "Cup A",
      "Cup C",
      "Cup D",
      "Cup B"
    ],
    "correctAnswer": "Cup D",
    "explanation": "The distinct aroma of fresh palm fruit provides direct sensory evidence linking the liquid to palm oil.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-101",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A solar battery disappeared from the school ICT room in Koforidua on Friday at 8:30 PM. Suspect Kweku claims he was watching the live 8:00 PM evening news broadcast on national TV at home.",
    "question": "Which evidence instantly breaks Kweku's alibi?",
    "options": [
      "His neighbor saw him drinking water at 6:00 PM.",
      "The entire township experienced a scheduled electrical blackout from 7:00 PM to 10:00 PM.",
      "The ICT room door was locked with a brass key.",
      "The solar battery weighed 15 kilograms."
    ],
    "correctAnswer": "The entire township experienced a scheduled electrical blackout from 7:00 PM to 10:00 PM.",
    "explanation": "A complete area power outage without backup power makes watching home television at 8:30 PM impossible.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-103",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A shopkeeper at Makola Market opened her stall at 6:00 AM. Her assistant arrived at 7:15 AM. A customer bought cloth at 7:45 AM. At 8:00 AM, the cash box was found empty. CCTV was disconnected between 6:30 AM and 7:00 AM.",
    "question": "Who was the only person present on site when the CCTV was turned off?",
    "options": [
      "The assistant",
      "The shopkeeper",
      "The customer",
      "A market security guard"
    ],
    "correctAnswer": "The shopkeeper",
    "explanation": "The assistant arrived at 7:15 AM and the customer at 7:45 AM. Only the shopkeeper was present between 6:30 AM and 7:00 AM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-104",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A student tested a new organic fertilizer on just two maize plants in his backyard. One grew 10 cm taller than the other. He concluded: 'This fertilizer guarantees double crop yield across all farms in Ghana.'",
    "question": "Why is the student's scientific deduction flawed?",
    "options": [
      "Maize only grows in the northern savannah.",
      "Testing two plants is an insignificantly small sample size that cannot rule out natural variation.",
      "Organic fertilizer should never be applied to cereal crops.",
      "Backyard soil contains too many minerals."
    ],
    "correctAnswer": "Testing two plants is an insignificantly small sample size that cannot rule out natural variation.",
    "explanation": "Generalizing an outcome from a sample size of two fails elementary scientific rigour and statistical significance.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-105",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A thief broke into the biology laboratory through a high glass louvre window. Investigators found bright red clay mud smeared on the window ledge.",
    "question": "Which suspect is most strongly connected to this physical clue?",
    "options": [
      "The library prefect who spent the afternoon in the air-conditioned reading room",
      "A groundskeeper who spent the afternoon weeding by the red clay drainage ditch",
      "The computer teacher wearing clean leather dress shoes",
      "A student who was sitting on the concrete assembly court"
    ],
    "correctAnswer": "A groundskeeper who spent the afternoon weeding by the red clay drainage ditch",
    "explanation": "Direct physical contact with the specific red clay ditch accounts for the wet mud transferred to the high sill.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-106",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "Farmers along the Densu River noticed fish floating belly-up two days after a heavy rainstorm that washed runoff from a nearby chemical warehouse into the stream.",
    "question": "What is the most plausible causal chain explaining the event?",
    "options": [
      "The fish fell asleep due to the sound of rainfall.",
      "Chemical pollutants poisoned the water or caused sudden dissolved oxygen depletion.",
      "The river water became too cold for tropical fish species.",
      "The fish swam too fast to escape the rising water currents."
    ],
    "correctAnswer": "Chemical pollutants poisoned the water or caused sudden dissolved oxygen depletion.",
    "explanation": "Chemical runoff directly causes toxicity or severe eutrophication that rapidly deprives aquatic life of dissolved oxygen.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-107",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A laboratory thermometer was broken during prep on Monday at 3:30 PM. Suspect Mansa claims she was walking across the school football field under bright sunshine at that exact time.",
    "question": "What official record would dismantle Mansa's alibi?",
    "options": [
      "The school weather station recorded torrential rain and thunder between 3:00 PM and 4:00 PM.",
      "The football pitch was cut with a lawnmower on Saturday morning.",
      "Mansa owns a blue school uniform dress.",
      "The laboratory thermometer contained colored alcohol instead of mercury."
    ],
    "correctAnswer": "The school weather station recorded torrential rain and thunder between 3:00 PM and 4:00 PM.",
    "explanation": "Documented heavy rain directly refutes the claim of walking under bright sunshine during that exact hour.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-108",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A review of a school canteen by the canteen manager's own son awarded the food a perfect 10/10 rating, while 80% of independent students rated it 4/10.",
    "question": "What factor best explains why the son's review contradicts the majority?",
    "options": [
      "The son has superior taste buds compared to all other pupils.",
      "Personal familial bias and loyalty distorted his objective assessment.",
      "The canteen uses too much salt in the jollof rice.",
      "The survey was carried out on a Wednesday afternoon."
    ],
    "correctAnswer": "Personal familial bias and loyalty distorted his objective assessment.",
    "explanation": "Close family ties create strong personal bias that undermines objective evaluation.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-109",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A mobile phone vendor in Sunyani interviewed three customers who bought Brand X phones. All three had cracked screens. He declared: 'Every single Brand X phone ever manufactured has a cracked screen.'",
    "question": "What error in reasoning did the phone vendor commit?",
    "options": [
      "Hasty generalization from an unrepresentative, minuscule sample.",
      "Confusing screen brightness with battery life.",
      "Ignoring the cost of shipping spare parts from Accra.",
      "Assuming touchscreens operate using heat rather than capacitance."
    ],
    "correctAnswer": "Hasty generalization from an unrepresentative, minuscule sample.",
    "explanation": "Drawing sweeping conclusions about thousands of manufactured units based on three examples is a classic hasty generalization.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-110",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A white cotton handkerchief left at a crime scene contains traces of yellow pollen grains that only bloom from the Baobab tree between November and December.",
    "question": "What does this botanical evidence tell the forensic team?",
    "options": [
      "The owner of the handkerchief must be a licensed farmer.",
      "The handkerchief was exposed to blooming Baobab trees during that specific dry season window.",
      "Baobab trees cannot survive in the savanna regions of West Africa.",
      "The crime occurred inside an enclosed concrete basement."
    ],
    "correctAnswer": "The handkerchief was exposed to blooming Baobab trees during that specific dry season window.",
    "explanation": "Specific seasonal pollen establishes environmental contact linked to that exact botanical blooming timeline.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-102",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A sensational WhatsApp forward claims: 'Drinking boiled neem leaf tea mixed with battery acid kills 100% of all viruses instantly! Share before the Ministry deletes this!'",
    "question": "Which critical red flag indicates this message is dangerous misinformation?",
    "options": [
      "It uses words from a local indigenous tree species.",
      "It was transmitted via a mobile messaging application.",
      "It promotes consuming highly toxic corrosive substances alongside urgency and conspiracy tropes without medical peer review.",
      "It does not list the Latin binomial botanical name for neem."
    ],
    "correctAnswer": "It promotes consuming highly toxic corrosive substances alongside urgency and conspiracy tropes without medical peer review.",
    "explanation": "Urgency framing, conspiracy claims ('Ministry deletes this'), and recommending deadly corrosive chemicals are hallmarks of dangerous fake news.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-103",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "During a JHS parliamentary debate on school uniforms, Speaker A argues: 'We should consider lighter fabrics for the hot season.' Speaker B responds: 'Speaker A wants our students to come to school in beachwear and destroy our cultural morals!'",
    "question": "Which logical fallacy did Speaker B commit?",
    "options": [
      "Ad Hominem attack on Speaker A's ancestry",
      "Straw Man fallacy, by exaggerating and misrepresenting the original argument into an extreme stance",
      "Circular Reasoning, by repeating the premise as the conclusion",
      "Appeal to Ignorance, by demanding unprovable evidence"
    ],
    "correctAnswer": "Straw Man fallacy, by exaggerating and misrepresenting the original argument into an extreme stance",
    "explanation": "A Straw Man occurs when an opponent distorts or exaggerates an original proposal to make it easier to attack.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-104",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A suspect denies touching a bag of fertilizer containing high ammonium nitrate concentrations. Forensic investigators swab his palms and add Nessler's reagent, producing a deep brown-yellow precipitate.",
    "question": "What conclusion does this chemical reaction support?",
    "options": [
      "The suspect's hands contain high amounts of ammonia ions, directly contradicting his statement.",
      "The suspect recently washed his hands with clean distilled water.",
      "The fertilizer was made entirely of crushed limestone rock.",
      "The reaction indicates the presence of simple glucose sugars on the skin."
    ],
    "correctAnswer": "The suspect's hands contain high amounts of ammonia ions, directly contradicting his statement.",
    "explanation": "Nessler's reagent specifically produces a yellow-brown precipitate in the presence of ammonium ions, providing empirical physical evidence.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-105",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A private academy advertises: 'Our average graduating teacher salary is 15,000 Cedis per month!' Investigation reveals the owner earns 110,000 Cedis, while the remaining nine teachers earn 4,444 Cedis each.",
    "question": "Why is the school's advertised statistic deceptive?",
    "options": [
      "They should have reported the salary in US Dollars.",
      "The extreme outlier (the owner's salary) severely skews the arithmetic mean upward, misrepresenting the median experience.",
      "Nine teachers is an uneven number for calculating percentages.",
      "Private schools are legally forbidden from calculating averages."
    ],
    "correctAnswer": "The extreme outlier (the owner's salary) severely skews the arithmetic mean upward, misrepresenting the median experience.",
    "explanation": "The mean is highly sensitive to extreme outliers. The median (4,444 Cedis) accurately reflects the real staff earnings.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-106",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A student prefect argues: 'We must ban all ball games during break time. If we allow football, students will kick balls into windows, shattering all the glass, leading to the collapse of the school buildings and the permanent closure of the school!'",
    "question": "Which logical fallacy is illustrated here?",
    "options": [
      "Slippery Slope fallacy",
      "Red Herring fallacy",
      "Equivocation",
      "False Dilemma"
    ],
    "correctAnswer": "Slippery Slope fallacy",
    "explanation": "A Slippery Slope fallacy assumes without evidence that one minor event will inevitably trigger a chain reaction of catastrophic consequences.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-108",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A healthcare survey in the Northern Region shows that villages with more health clinics report higher total registered malaria cases than remote villages with no clinics at all.",
    "question": "Why would villages with clinics register more malaria cases?",
    "options": [
      "Health clinics actively manufacture and release mosquitoes.",
      "Villages with clinics have diagnostic testing and record-keeping, whereas cases in remote villages go undiagnosed and unrecorded.",
      "Medical doctors attract malaria parasites to their offices.",
      "Rural villagers without clinics have biological immunity to Plasmodium."
    ],
    "correctAnswer": "Villages with clinics have diagnostic testing and record-keeping, whereas cases in remote villages go undiagnosed and unrecorded.",
    "explanation": "Diagnostic infrastructure increases case reporting (detection bias). The lack of clinics leads to underreporting, not lower actual disease rates.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-110",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A laboratory safe was opened using an unknown clear acidic liquid to dissolve a copper latch. The forensic analyst treats the residual liquid with excess aqueous ammonia (NH₃), producing an intense deep blue complex solution.",
    "question": "What metal cation is positively confirmed by this deep blue coordination complex?",
    "options": [
      "Iron (Fe²⁺)",
      "Lead (Pb²⁺)",
      "Copper (Cu²⁺)",
      "Zinc (Zn²⁺)"
    ],
    "correctAnswer": "Copper (Cu²⁺)",
    "explanation": "Copper ions react with excess aqueous ammonia to form the characteristic deep blue tetraamminecopper(II) complex [Cu(NH₃)₄]²⁺.",
    "isCentral": true
  }
];

export const THINK_TANK_RIDDLES: ThinkTankRiddleItem[] = [
  {
    "id": "tt-riddle-nov-1",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have hands and a round face, but I cannot clap or smile. I stand on the classroom wall and tell everyone when it is break time. What am I?",
    "hint1": "Look up at the wall when you want to know the time.",
    "hint2": "My two hands point to numbers from 1 to 12.",
    "answer": "A clock (or watch)",
    "acceptedKeywords": [
      "clock",
      "watch",
      "wall clock"
    ],
    "explanation": "A clock has a face (dial) and hands (hour and minute pointers), even though it is not a person.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I follow you everywhere you go when the sun is shining brightly, but as soon as you step into a dark room, I disappear! What am I?",
    "hint1": "You can see me on the ground right beside your feet outside.",
    "hint2": "I happen when your body blocks the sunlight.",
    "answer": "Your shadow",
    "acceptedKeywords": [
      "shadow",
      "my shadow"
    ],
    "explanation": "A shadow forms when an opaque object (your body) blocks light rays. Without light, there is no shadow.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has to be broken before you can fry or boil it for breakfast?",
    "hint1": "Hens lay me on the farm.",
    "hint2": "I have a hard shell outside and a yellow yolk inside.",
    "answer": "An egg",
    "acceptedKeywords": [
      "egg",
      "eggs",
      "an egg"
    ],
    "explanation": "You must crack (break) an eggshell to cook the egg inside.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-4",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I get wetter and wetter the more I dry your hands and face after a bath. What am I?",
    "hint1": "You hang me in the bathroom.",
    "hint2": "I am made of soft cloth that soaks up water.",
    "answer": "A towel",
    "acceptedKeywords": [
      "towel",
      "napkin",
      "cloth"
    ],
    "explanation": "As a towel dries your skin, it absorbs the water and becomes wet itself.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-5",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I wear a green crown on my head and golden-yellow armour covered in many \"eyes\" on the outside, and I am sweet and juicy inside. What tropical fruit am I?",
    "hint1": "I grow across Ghana and make delicious fruit juice.",
    "hint2": "My name combines a tree (\"pine\") and a fruit (\"apple\").",
    "answer": "A pineapple",
    "acceptedKeywords": [
      "pineapple",
      "pineapples"
    ],
    "explanation": "A pineapple has a leafy green crown on top and patterned scales (\"eyes\") around its golden skin.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-6",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am an odd number. If you take away just one letter from my English word, I become \"even\"! What number am I?",
    "hint1": "Count from 1 to 10 and look at how each number is spelled.",
    "hint2": "Put the letter \"S\" in front of the word \"EVEN\".",
    "answer": "Seven (7)",
    "acceptedKeywords": [
      "seven",
      "7"
    ],
    "explanation": "Remove the letter \"S\" from \"SEVEN\" and you are left with the word \"EVEN\"!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-7",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I am tall when I am young, and I am short when I am old. When the lights go out at night, I glow and melt away. What am I?",
    "hint1": "You light my wick with a match.",
    "hint2": "I am made of wax.",
    "answer": "A candle",
    "acceptedKeywords": [
      "candle",
      "candles",
      "pencil"
    ],
    "explanation": "A new candle starts tall, and as its wax melts while burning, it grows shorter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-8",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What is full of holes all over, yet can still hold plenty of water without leaking until you squeeze it?",
    "hint1": "You use me with soap to wash plates or bathe.",
    "hint2": "I am soft and squishy.",
    "answer": "A sponge",
    "acceptedKeywords": [
      "sponge",
      "foam"
    ],
    "explanation": "A sponge’s tiny pores trap and hold water by capillary action until squeezed.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-9",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have teeth in a neat row, but I cannot bite or chew food. You use me every morning to make your hair neat. What am I?",
    "hint1": "Look on your dressing mirror table.",
    "hint2": "Barbers use me with scissors and clippers.",
    "answer": "A comb",
    "acceptedKeywords": [
      "comb",
      "hair comb"
    ],
    "explanation": "The thin prongs on a comb are called teeth.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-10",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "Which word in the English dictionary is always spelled \"wrong\"?",
    "hint1": "Read the question very carefully — it is a wordplay trick!",
    "hint2": "It has 5 letters and starts with W-R-O...",
    "answer": "The word \"wrong\"",
    "acceptedKeywords": [
      "wrong",
      "\"wrong\""
    ],
    "explanation": "The word \"wrong\" is literally spelled W-R-O-N-G!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-1",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I speak without a mouth and hear without ears. I have no body, but I come alive when you shout near a mountain or an empty hall. What am I?",
    "hint1": "Sound waves bounce off hard walls to create me.",
    "hint2": "If you shout \"Hello!\", I repeat \"Hello!\" back to you.",
    "answer": "An echo",
    "acceptedKeywords": [
      "echo",
      "an echo",
      "sound wave"
    ],
    "explanation": "An echo is a reflected sound wave bouncing back from a distant surface.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I have cities, but no houses. I have mountains, but no trees. I have rivers and oceans, but no water or fish. What am I?",
    "hint1": "You open me in Social Studies or Geography class.",
    "hint2": "I show countries, borders, and roads on a flat sheet.",
    "answer": "A map (or globe)",
    "acceptedKeywords": [
      "map",
      "atlas",
      "globe"
    ],
    "explanation": "A map draws cities, mountains, and rivers as symbols on paper without the physical objects.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "The more of me there is in a room, the less you can see. Turn on a torchlight and I run away instantly. What am I?",
    "hint1": "I happen every night after sunset.",
    "hint2": "I am the opposite of light.",
    "answer": "Darkness (the dark)",
    "acceptedKeywords": [
      "darkness",
      "dark",
      "fog",
      "smoke"
    ],
    "explanation": "Darkness is the absence of visible light; as darkness increases, visibility drops.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-4",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I have keys, but no locks or doors. I have space, but no rooms. You can enter, but you cannot go outside. What am I?",
    "hint1": "You are probably touching me or looking at one right now in ICT!",
    "hint2": "I have a Spacebar, an Enter key, and letters A to Z.",
    "answer": "A computer keyboard",
    "acceptedKeywords": [
      "keyboard",
      "computer keyboard",
      "laptop"
    ],
    "explanation": "A keyboard has letter keys, a Space key, and an Enter key!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-5",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Ghanaian Wisdom Riddle: Two brothers live on opposite sides of a small hill. They hear everything together all day long, yet they can never look across the hill to see each other. Who are they?",
    "hint1": "Touch the sides of your own head!",
    "hint2": "The \"hill\" between them is your nose and head.",
    "answer": "Your two ears (or eyes)",
    "acceptedKeywords": [
      "ears",
      "ear",
      "two ears",
      "eyes"
    ],
    "explanation": "This classic West African riddle describes our two ears positioned on opposite sides of the head.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-6",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "When my father was 31 years old, I was 8 years old. Today my father is twice as old as I am. How old am I today?",
    "hint1": "First find the age difference between the father and child (31 - 8). That difference never changes!",
    "hint2": "31 minus 8 is 23 years. When is someone’s age equal to the age gap?",
    "answer": "23 years old",
    "acceptedKeywords": [
      "23",
      "twenty-three",
      "twenty three"
    ],
    "explanation": "The father is always 23 years older (31 - 8 = 23). When the child is 23, the father is 23 + 23 = 46, which is exactly twice 23!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-7",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "If you feed me dry wood and leaves, I grow bigger and dance brightly. If you give me water to drink, I die immediately. What am I?",
    "hint1": "We use me for cooking, but we must handle me carefully.",
    "hint2": "I produce heat, light, and smoke.",
    "answer": "Fire (a flame)",
    "acceptedKeywords": [
      "fire",
      "flame",
      "flames"
    ],
    "explanation": "Combustion (fire) consumes fuel (wood) and oxygen, while water cools it below ignition temperature and smothers it.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-8",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "What belongs solely to you, yet your teachers, friends, and parents use it much more often than you do?",
    "hint1": "People say it when they call you in class.",
    "hint2": "It is written on the front of your exercise books.",
    "answer": "Your name",
    "acceptedKeywords": [
      "name",
      "my name",
      "your name"
    ],
    "explanation": "Your name belongs to you, but other people speak it aloud to get your attention.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-9",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What starts with the letter \"E\", ends with the letter \"E\", and usually contains only one letter inside it?",
    "hint1": "You put a postage stamp on its corner.",
    "hint2": "You fold a paper letter and slide it inside me before mailing.",
    "answer": "An envelope",
    "acceptedKeywords": [
      "envelope",
      "an envelope"
    ],
    "explanation": "\"Envelope\" starts and ends with \"E\" and holds a written letter inside.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-10",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am a three-digit number. My tens digit is 5 more than my ones digit. My hundreds digit is 8 less than my tens digit. What number am I?",
    "hint1": "Since a digit can only be 0 to 9, and the hundreds digit cannot be 0, what must the tens digit be if it is 8 more than the hundreds digit?",
    "hint2": "Hundreds digit = 1, so Tens digit = 1 + 8 = 9. Now find the ones digit (9 - 5)!",
    "answer": "194",
    "acceptedKeywords": [
      "194",
      "one hundred and ninety-four"
    ],
    "explanation": "For a 3-digit number, the hundreds digit must be at least 1. Since hundreds = tens - 8, hundreds = 1 and tens = 9. Then ones = 9 - 5 = 4, giving 194!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-1",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "The person who makes it has no need of it; the person who buys it has no use for it; and the person who uses it can neither see nor feel it. What is it?",
    "hint1": "Carpenters build it, families buy it for a funeral, and it is placed underground.",
    "hint2": "It is a wooden box used for burial.",
    "answer": "A coffin (or casket)",
    "acceptedKeywords": [
      "coffin",
      "casket",
      "grave"
    ],
    "explanation": "The carpenter makes it to sell, a grieving relative buys it for someone else, and the deceased person inside cannot see or feel it.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "At night I come without being fetched; by day I am lost without being stolen. Sailors used me for centuries to navigate across the ocean. What am I?",
    "hint1": "Look up at the clear night sky away from city lights.",
    "hint2": "Our Sun is actually the closest one to Earth!",
    "answer": "The stars",
    "acceptedKeywords": [
      "stars",
      "star",
      "starlight"
    ],
    "explanation": "Stars are always in the sky, but daytime sunlight scatters in the atmosphere and outshines them until nightfall.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What 8-letter English word can have a letter removed one at a time, eight times in a row, and still form a valid English word at every single step down to one letter?",
    "hint1": "It means beginning a race (\"S-T-A-R-T-I-N-G\").",
    "hint2": "Starting -> Staring -> String -> Sting -> Sing -> Sin -> In -> I!",
    "answer": "STARTING",
    "acceptedKeywords": [
      "starting",
      "staring",
      "startling"
    ],
    "explanation": "STARTING (8) -> STARING (7) -> STRING (6) -> STING (5) -> SING (4) -> SIN (3) -> IN (2) -> I (1).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-4",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "A bat and a ball cost GH₵ 110 in total. The bat costs GH₵ 100 MORE than the ball. How much does the ball cost?",
    "hint1": "Careful! If the ball were GH₵ 10 and the bat were GH₵ 100, the difference would only be GH₵ 90 (100 - 10 = 90), not GH₵ 100!",
    "hint2": "Solve x + (x + 100) = 110, so 2x = 10.",
    "answer": "GH₵ 5 (and the bat costs GH₵ 105)",
    "acceptedKeywords": [
      "5",
      "five",
      "ghc 5",
      "5 cedis"
    ],
    "explanation": "If the ball is GH₵ 5 and the bat is GH₵ 105, their difference is 105 - 5 = GH₵ 100, and their sum is 105 + 5 = GH₵ 110! This famous cognitive test by Nobel laureate Daniel Kahneman shows how fast intuition can trick us.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-5",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the lightest chemical element in the universe, with just 1 proton. Yet when two of my atoms bond with one oxygen atom, I form the heavy liquid that fills Earth’s oceans. What element am I?",
    "hint1": "My symbol is #1 on the Periodic Table (\"H\").",
    "hint2": "Combined with oxygen, I make H2O.",
    "answer": "Hydrogen",
    "acceptedKeywords": [
      "hydrogen",
      "h"
    ],
    "explanation": "Hydrogen (atomic number 1) is a light gas on its own, but covalently bonded as H₂O it forms liquid water.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-6",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Akan Wisdom Riddle: I walk on four legs in the early morning, on two legs at midday, and on three legs in the evening of life. What creature am I?",
    "hint1": "Morning, midday, and evening represent the stages of a lifetime (baby, adult, elder).",
    "hint2": "What is the \"third leg\" that an elderly person holds to walk?",
    "answer": "A human being",
    "acceptedKeywords": [
      "human",
      "person",
      "man",
      "woman",
      "people"
    ],
    "explanation": "A baby crawls on all fours (morning), an adult walks upright on two legs (midday), and an elder uses a walking stick as a third leg (evening).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-7",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "If you have me, you want to share me with your best friend. Perform that action and share me, and you no longer have me! What am I?",
    "hint1": "People whisper me quietly so others cannot hear.",
    "hint2": "Once everyone knows me, I am no longer hidden.",
    "answer": "A secret",
    "acceptedKeywords": [
      "secret",
      "a secret"
    ],
    "explanation": "A secret remains a secret only while it is kept; once told, it ceases to be a secret.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-8",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "If 5 bricklayers take 5 hours to build 5 walls, how many hours will it take 100 bricklayers working at the same speed to build 100 walls?",
    "hint1": "Don’t jump to \"100 hours\"! Figure out how long 1 bricklayer takes to build 1 wall.",
    "hint2": "If 5 bricklayers working in parallel build 5 walls in 5 hours, each bricklayer builds 1 wall in 5 hours.",
    "answer": "5 hours",
    "acceptedKeywords": [
      "5",
      "five",
      "5 hours",
      "five hours"
    ],
    "explanation": "Each bricklayer builds 1 wall in 5 hours. So 100 bricklayers working simultaneously will finish 100 walls in that exact same 5 hours!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-9",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "Most liquids shrink when they freeze into a solid, but I expand by about 9% when I freeze — which is why I float on top of my own liquid self! What am I?",
    "hint1": "You put cubes of me into a cold drink.",
    "hint2": "I am solid H2O.",
    "answer": "Ice (frozen water)",
    "acceptedKeywords": [
      "ice",
      "water"
    ],
    "explanation": "Water molecules form a hexagonal crystal lattice when freezing, making ice less dense than liquid water so it floats.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-10",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "Forward I am heavy, but spell me backward and I am NOT! What 3-letter unit of mass am I?",
    "hint1": "I equal 1,000 kilograms.",
    "hint2": "Spell the word \"NOT\" backward!",
    "answer": "A ton (T-O-N)",
    "acceptedKeywords": [
      "ton",
      "a ton"
    ],
    "explanation": "\"TON\" is a heavy unit of weight, and spelled backward (N-O-T) it spells \"NOT\".",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-1",
    "targetGroup": "Master (SHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "You have 8 identical-looking gold coins, but 1 coin is counterfeit and slightly lighter than the other 7. Using a two-pan balance scale without weights, what is the MINIMUM number of weighings needed to guarantee finding the lighter counterfeit coin?",
    "hint1": "Do not weigh 4 against 4! Divide the 8 coins into THREE groups (3, 3, and 2).",
    "hint2": "Weigh 3 coins vs 3 coins first. Whether they balance or tilt, how many weighings are left?",
    "answer": "2 weighings",
    "acceptedKeywords": [
      "2",
      "two",
      "2 weighings",
      "two weighings"
    ],
    "explanation": "Weigh 3 vs 3 first. If they balance, the fake is in the remaining 2 coins (1 more weighing finds it). If one pan of 3 is lighter, take 2 coins from that lighter group and weigh 1 vs 1 (if they balance, it’s the 3rd coin). Total: 2 weighings!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-2",
    "targetGroup": "Master (SHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "You have two ropes and a box of matches. Each rope takes exactly 60 minutes to burn from one end to the other, but they burn unevenly (half the rope might burn in 10 minutes and the other half in 50 minutes). How can you measure exactly 45 minutes?",
    "hint1": "What happens if you light BOTH ends of one rope at the exact same time? How long will it take to burn completely?",
    "hint2": "Light Rope 1 at BOTH ends AND Rope 2 at ONE end simultaneously. When Rope 1 finishes (at 30 mins), light the other end of Rope 2!",
    "answer": "Light both ends of Rope 1 and one end of Rope 2; when Rope 1 finishes (30 min), light the second end of Rope 2 (15 min) = 45 minutes.",
    "acceptedKeywords": [
      "both ends",
      "45",
      "30",
      "rope"
    ],
    "explanation": "Lighting both ends of Rope 1 burns it completely in 30 minutes regardless of uneven speed. At that 30-minute mark, Rope 2 has 30 minutes of burn left — lighting its second end halves that remaining time to 15 minutes (30 + 15 = 45 mins).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-3",
    "targetGroup": "Master (SHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I have no mass and no electric charge, I travel at 299,792 kilometres per second in a vacuum, and I behave as both a wave and a particle. What quantum packet am I?",
    "hint1": "Albert Einstein won the Nobel Prize for explaining how I knock electrons out of metal (the photoelectric effect).",
    "hint2": "I am a quantum of electromagnetic radiation (light).",
    "answer": "A photon",
    "acceptedKeywords": [
      "photon",
      "light",
      "photons"
    ],
    "explanation": "A photon is the elementary massless particle (quantum) of light and all electromagnetic radiation, exhibiting wave-particle duality.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-4",
    "targetGroup": "Master (SHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "Three switches outside a closed, windowless room control three incandescent light bulbs inside. You can flip the switches however you like, but you may open the door and enter the room only ONCE. How do you determine with certainty which switch controls which bulb?",
    "hint1": "Incandescent bulbs produce something else besides visible light when left on for a few minutes!",
    "hint2": "Use HEAT as well as light: turn Switch 1 on for 5 minutes, turn it off, turn Switch 2 on, and walk in!",
    "answer": "Use heat + light: turn Switch 1 on for 5 mins then off (warm dark bulb), turn Switch 2 on (lit bulb), leave Switch 3 off (cold dark bulb).",
    "acceptedKeywords": [
      "heat",
      "warm",
      "hot",
      "temperature",
      "touch"
    ],
    "explanation": "By combining two physical properties — light (on/off) and thermal energy (warm/cold) — you create 3 distinct states for the 3 bulbs in a single visit.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-5",
    "targetGroup": "Master (SHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "Look at this sequence: 1, 11, 21, 1211, 111221, ... What is the next term in this famous \"Look-and-Say\" sequence?",
    "hint1": "Read the digits of each term out loud to generate the next term! \"1\" is \"one 1\" (11). \"11\" is \"two 1s\" (21).",
    "hint2": "Read \"111221\" out loud: how many 1s, how many 2s, and how many 1s?",
    "answer": "312211",
    "acceptedKeywords": [
      "312211"
    ],
    "explanation": "John Conway’s Look-and-Say sequence describes the previous term’s digits: \"111221\" has \"three 1s, two 2s, and one 1\", which writes out as 312211!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-6",
    "targetGroup": "Master (SHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a double-stranded molecule coiled like a twisted ladder inside nearly every cell of your body. Written in an alphabet of just four chemical letters (A, T, C, G), I store the blueprint for building an entire organism. What am I?",
    "hint1": "Rosalind Franklin, James Watson, and Francis Crick helped reveal my double-helix structure.",
    "hint2": "My three-letter abbreviation stands for Deoxyribonucleic Acid.",
    "answer": "DNA (Deoxyribonucleic Acid)",
    "acceptedKeywords": [
      "dna",
      "deoxyribonucleic acid"
    ],
    "explanation": "DNA stores genetic information using four nucleotide bases: Adenine (A), Thymine (T), Cytosine (C), and Guanine (G).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-7",
    "targetGroup": "Master (SHS)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "In a knockout table-tennis tournament with 64 players, every match eliminates exactly 1 loser and has no draws. Without adding 32 + 16 + 8 + 4 + 2 + 1, what is the exact total number of matches played to crown 1 champion?",
    "hint1": "Think about how many players must be eliminated in total to leave just 1 undefeated champion.",
    "hint2": "Every match eliminates exactly 1 player, and 63 players must be eliminated!",
    "answer": "63 matches",
    "acceptedKeywords": [
      "63",
      "sixty-three",
      "sixty three"
    ],
    "explanation": "In any single-elimination tournament of N players, N - 1 players must lose once to leave 1 champion. So 64 - 1 = 63 matches!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-8",
    "targetGroup": "Master (SHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A hunter leaves his camp, walks 5 km due South, then walks 5 km due East, spots a white bear, and walks 5 km due North — arriving right back at his starting camp! Where on Earth is his camp, and what species is the bear?",
    "hint1": "On a flat grid, South -> East -> North forms three sides of a square. Where on a sphere do lines of longitude meet at a single point?",
    "hint2": "He started at the North Pole!",
    "answer": "The North Pole (and the bear is a Polar Bear)",
    "acceptedKeywords": [
      "north pole",
      "polar bear",
      "pole"
    ],
    "explanation": "Because lines of longitude converge at the North Pole, walking 5 km South, 5 km East along a circle of latitude, and 5 km North returns you to the exact same point at the North Pole.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-9",
    "targetGroup": "Master (SHS)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am an irrational mathematical constant. Divide any circle’s circumference by its diameter and you will find me, yet my decimal digits (3.14159...) go on forever without ever repeating. Who am I?",
    "hint1": "My symbol is the 16th letter of the Greek alphabet (π).",
    "hint2": "I sound just like a baked pastry!",
    "answer": "Pi (π)",
    "acceptedKeywords": [
      "pi",
      "3.14",
      "π"
    ],
    "explanation": "Pi (π ≈ 3.14159265...) is the ratio of a circle’s circumference to its diameter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-mas-10",
    "targetGroup": "Master (SHS)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Philosophical Riddle: I devour iron, rust steel, grind hard mountains into sand, and topple kings and empires — yet no human hand can hold me back even for a second. What am I?",
    "hint1": "Clocks measure me, but cannot slow me down.",
    "hint2": "Past, present, and future are my three faces.",
    "answer": "Time",
    "acceptedKeywords": [
      "time"
    ],
    "explanation": "Over centuries, time weathers rock, oxidizes metal, and outlasts every civilization.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-101",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have no legs, but I travel across the sky. I weep when I am heavy, and the crops in the farm drink my tears. What am I?",
    "hint1": "Look above you on a cloudy day.",
    "hint2": "I bring water that falls as rain.",
    "answer": "A raincloud",
    "acceptedKeywords": [
      "raincloud",
      "cloud",
      "a cloud",
      "clouds",
      "rain cloud"
    ],
    "explanation": "Clouds collect evaporated water vapor until condensation causes precipitation in the form of raindrops.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-104",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I sleep during the night and rise in the east. Without my golden rays, no maize or cassava plant can grow. What am I?",
    "hint1": "Look at the brightest object in the daytime sky.",
    "hint2": "I provide light and warmth to planet Earth.",
    "answer": "The sun",
    "acceptedKeywords": [
      "sun",
      "the sun",
      "sunlight"
    ],
    "explanation": "The sun is our solar system's central star, providing radiant energy essential for photosynthesis.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-108",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I wear a hard protective house upon my back wherever I crawl. When danger comes, I pull in my head and legs. What am I?",
    "hint1": "I move very slowly across the garden soil.",
    "hint2": "I am a reptile known for longevity.",
    "answer": "A tortoise",
    "acceptedKeywords": [
      "tortoise",
      "a tortoise",
      "turtle",
      "a turtle"
    ],
    "explanation": "Tortoises possess a bony protective carapace fused directly to their skeleton.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-110",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have a spine, but I have no bones. I have many leaves, but I am not a tree. You open me to learn. What am I?",
    "hint1": "You carry several of me inside your school bag.",
    "hint2": "My pages are filled with stories and facts.",
    "answer": "A book",
    "acceptedKeywords": [
      "book",
      "a book",
      "textbook",
      "notebook"
    ],
    "explanation": "A book's binding edge is called a spine, and individual sheets of paper are termed leaves.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-111",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a small red or black seed wrapped in a green pod. When roasted with salt, I am the best partner to roasted plantain (Kofi Brokeman). What am I?",
    "hint1": "I grow underground in pods.",
    "hint2": "Some people call me peanut.",
    "answer": "Groundnut",
    "acceptedKeywords": [
      "groundnut",
      "peanut",
      "groundnuts",
      "peanuts",
      "a groundnut"
    ],
    "explanation": "Groundnuts (peanuts) are legumes that flower above ground but develop their seed pods subterraneanly.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-113",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I have no teeth to bite, but I can eat away iron gates over years of rainy days. What am I?",
    "hint1": "I am reddish-brown flakes on old metal.",
    "hint2": "Water and air create me.",
    "answer": "Rust",
    "acceptedKeywords": [
      "rust",
      "iron rust",
      "corrosion"
    ],
    "explanation": "Rust is the product of iron oxidation, which degrades and corrodes structural metals.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-114",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has one eye at its tail end, but cannot see anything, and pulls thread through cloth?",
    "hint1": "Tailors hold me between their fingers.",
    "hint2": "I am sharp, pointed, and made of polished steel.",
    "answer": "A sewing needle",
    "acceptedKeywords": [
      "needle",
      "a needle",
      "sewing needle",
      "a sewing needle"
    ],
    "explanation": "The hole at the blunt top of a sewing needle through which thread passes is known as its eye.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-115",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What begins with the letter 'P', ends with the letter 'E', and has thousands of letters inside it?",
    "hint1": "Think of a government building where parcels and mail arrive.",
    "hint2": "It is two words: Post ...",
    "answer": "A post office",
    "acceptedKeywords": [
      "post office",
      "a post office",
      "post-office"
    ],
    "explanation": "The words 'Post Office' begin with P and end with E, and the facility physically stores thousands of postal letters.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-102",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "An Akan proverb says: 'When the king of the forest falls, the small birds make noise.' What animal's mighty trunk and tusks command silence in Mole National Park?",
    "hint1": "It is the largest living terrestrial mammal on Earth.",
    "hint2": "It uses large ears to regulate body temperature.",
    "answer": "An elephant",
    "acceptedKeywords": [
      "elephant",
      "an elephant",
      "african elephant",
      "the elephant"
    ],
    "explanation": "The African bush elephant is the largest land mammal, holding keystone ecological dominance across savannah habitats.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-104",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a silver metal liquid at room temperature. Doctors once trapped me inside glass tubes to measure body fever. What element am I?",
    "hint1": "My chemical symbol is Hg.",
    "hint2": "Another common name for me is quicksilver.",
    "answer": "Mercury",
    "acceptedKeywords": [
      "mercury",
      "quicksilver",
      "hg"
    ],
    "explanation": "Mercury is the only metallic element that remains liquid under standard room temperature and pressure.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-105",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What occurs once in every minute, twice in every single moment, but never ever in one thousand years?",
    "hint1": "Do not count units of elapsed time.",
    "hint2": "Look closely at the letters in the words 'minute' and 'moment'.",
    "answer": "The letter M",
    "acceptedKeywords": [
      "m",
      "the letter m",
      "letter m"
    ],
    "explanation": "The letter 'm' appears once in 'minute', twice in 'moment', and zero times in 'one thousand years'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-107",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "In West African lore, I am the eight-legged master of wit, trickery, and web-spinning tales. What creature am I?",
    "hint1": "My folklore stories are called Anansesem.",
    "hint2": "I weave silk threads to capture flying insects.",
    "answer": "Kweku Ananse the spider",
    "acceptedKeywords": [
      "ananse",
      "spider",
      "a spider",
      "kweku ananse",
      "anansi"
    ],
    "explanation": "Ananse the spider is the archetypal trickster hero across Akan folklore, symbolizing ingenuity and lateral wit.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-108",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I produce food for the plant using sunlight, carbon dioxide, and water. What microscopic green pigment inside plant cells am I?",
    "hint1": "I absorb red and blue light while reflecting green light.",
    "hint2": "My name starts with 'chloro-'.",
    "answer": "Chlorophyll",
    "acceptedKeywords": [
      "chlorophyll",
      "chlorophil"
    ],
    "explanation": "Chlorophyll is the green pigment in chloroplasts that absorbs light energy to drive photosynthesis.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-109",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A snail at the bottom of a 10-metre well climbs up 3 metres every day, but slips down 2 metres every night while sleeping. On which day will it reach the top?",
    "hint1": "It gains 1 net metre per full 24-hour cycle.",
    "hint2": "Once it reaches the top rim during daytime, it climbs out without slipping back down.",
    "answer": "The 8th day",
    "acceptedKeywords": [
      "8th day",
      "day 8",
      "8",
      "eight",
      "the 8th day"
    ],
    "explanation": "After 7 days and nights, it is at 7 metres. On the 8th day, its 3-metre daytime climb reaches 10 metres, escaping before nightfall.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-110",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am pronounced as one letter, written with five letters, and contain two identical pairs of letters separated by an 'e'. I see all. What am I?",
    "hint1": "I am an organ of sight.",
    "hint2": "Spell the plural form of the organ: E-Y-E-S.",
    "answer": "Eye",
    "acceptedKeywords": [
      "eye",
      "an eye",
      "the eye",
      "eyes"
    ],
    "explanation": "The word 'EYE' is pronounced like the letter 'I'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-111",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "Two mothers and two daughters sat down at a restaurant in Osu and ordered three bowls of groundnut soup. Every person received a full bowl. How was this possible?",
    "hint1": "There were only three people present at the table.",
    "hint2": "Think of family generations: grandmother, mother, and daughter.",
    "answer": "A grandmother, mother, and daughter",
    "acceptedKeywords": [
      "grandmother mother daughter",
      "grandmother",
      "three generations",
      "3 generations"
    ],
    "explanation": "The mother is both a daughter to the grandmother and a mother to the youngest girl, making two mothers and two daughters across three people.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-112",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the invisible shield around planet Earth that deflects lethal solar wind particles into the polar auroras. What protective force am I?",
    "hint1": "A magnetic compass needle aligns with my field lines.",
    "hint2": "I am generated by the swirling molten iron in Earth's outer core.",
    "answer": "Earth's magnetic field",
    "acceptedKeywords": [
      "magnetic field",
      "earth's magnetic field",
      "geomagnetic field",
      "magnetosphere"
    ],
    "explanation": "The geomagnetic field (magnetosphere) shields Earth's atmosphere and biosphere from harmful cosmic radiation and solar winds.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-113",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Golden inside, encased in a hard woody pod on forest trees, I fueled Ghana's agricultural economy for over a century. Tetteh Quarshie brought my seeds from Fernando Po. What crop am I?",
    "hint1": "My fermented beans are dried, roasted, and ground into chocolate.",
    "hint2": "I am the key ingredient in cocoa powder.",
    "answer": "Cocoa",
    "acceptedKeywords": [
      "cocoa",
      "cacao",
      "cocoa bean",
      "cocoa tree"
    ],
    "explanation": "Tetteh Quarshie introduced cocoa pods to the Gold Coast (Mampong-Akuapem) in 1879, sparking Ghana's historic cocoa industry.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-115",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can run all day long without having legs, murmurs softly without a tongue, and has a bed but never sleeps?",
    "hint1": "The Volta, Pra, and Densu are famous examples in Ghana.",
    "hint2": "It is a flowing natural stream of freshwater.",
    "answer": "A river",
    "acceptedKeywords": [
      "river",
      "a river",
      "stream",
      "a stream"
    ],
    "explanation": "A river has a riverbed and riverbanks, runs toward the sea, and makes natural rushing sounds.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-101",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the physical boundary surrounding a black hole where the escape velocity exactly equals the speed of light. Cross me, and not even photons can ever return. What am I?",
    "hint1": "My radius is calculated using the Schwarzschild formula Rs = 2GM/c².",
    "hint2": "I am called the event...",
    "answer": "The event horizon",
    "acceptedKeywords": [
      "event horizon",
      "the event horizon",
      "schwarzschild radius"
    ],
    "explanation": "The event horizon marks the gravitational boundary of a black hole beyond which nothing, including light, can escape.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-103",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am an allotrope of pure carbon. Under intense underground heat and pressure, my tetrahedral crystal lattice became the hardest naturally occurring mineral on Mohs scale. What am I?",
    "hint1": "My rating on Mohs hardness scale is a perfect 10.",
    "hint2": "Geologists mine me in places like Akwatia.",
    "answer": "Diamond",
    "acceptedKeywords": [
      "diamond",
      "a diamond",
      "diamonds"
    ],
    "explanation": "Diamond is composed of pure carbon bonded in a rigid tetrahedral lattice, making it the hardest natural mineral.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-104",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Carved with sacred Adinkra symbols, I am made of sacred Osese wood. In Ashanti history, Okomfo Anokye commanded me to descend from the skies onto King Osei Tutu I's knees. What am I?",
    "hint1": "I contain the soul (Sunsum) of the entire Ashanti nation.",
    "hint2": "No king or human is ever permitted to sit upon me.",
    "answer": "The Golden Stool (Sika Dwa Kofi)",
    "acceptedKeywords": [
      "golden stool",
      "the golden stool",
      "sika dwa kofi",
      "sika dwa"
    ],
    "explanation": "Sika Dwa Kofi (The Golden Stool) is the sacred royal throne embodying the unified spiritual soul of the Ashanti Kingdom.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-105",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A boat sits in the harbor with a rope ladder hanging over the side. The rungs are 25 cm apart. At low tide, 4 rungs are above the water. If the high tide rises by 1 metre, how many rungs are above the water?",
    "hint1": "Does a floating boat stay anchored to the sea floor while water rises?",
    "hint2": "The boat rises alongside the water level.",
    "answer": "Still 4 rungs",
    "acceptedKeywords": [
      "4",
      "4 rungs",
      "four",
      "four rungs",
      "still 4"
    ],
    "explanation": "Because the boat floats on the water's surface, it rises along with the rising tide. The relative position of the ladder rungs remains unchanged.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-106",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "Known as the powerhouse of eukaryotic cells, I generate cellular energy via ATP through the Krebs cycle and oxidative phosphorylation. What organelle am I?",
    "hint1": "I have my own circular mitochondrial DNA.",
    "hint2": "My name starts with 'mito-'.",
    "answer": "Mitochondria",
    "acceptedKeywords": [
      "mitochondria",
      "mitochondrion",
      "the mitochondria"
    ],
    "explanation": "Mitochondria generate the majority of cellular adenosine triphosphate (ATP) through aerobic respiration.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-107",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a nine-letter word in English. If you remove my first letter, I still sound the same. Remove another letter, and another, until only one remains, and I STILL sound the same. What word am I?",
    "hint1": "Think of people waiting in line at the bank.",
    "hint2": "I begin with Q and end with E.",
    "answer": "Queueing (or Queue)",
    "acceptedKeywords": [
      "queueing",
      "queue",
      "a queue"
    ],
    "explanation": "The word 'QUEUEING' (or 'QUEUE') sounds like the letter 'Q'. Successively stripping trailing vowels leaves the phonetic pronunciation 'Q'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-108",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In cryptographic mathematics, I am a natural number strictly greater than 1 that cannot be formed by multiplying two smaller positive integers. What type of number am I?",
    "hint1": "Examples include 2, 3, 5, 7, 11, and 13.",
    "hint2": "I have exactly two distinct positive divisors: 1 and myself.",
    "answer": "A prime number",
    "acceptedKeywords": [
      "prime number",
      "prime",
      "a prime number",
      "primes"
    ],
    "explanation": "Prime numbers are integers greater than 1 whose only divisors are 1 and the number itself.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-109",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A man looks at a portrait on the wall and says: 'Brothers and sisters I have none, but this man's father is my father's son.' Whose portrait is he looking at?",
    "hint1": "Break down 'my father's son' when the speaker has no brothers or sisters.",
    "hint2": "Since the speaker has no brothers, 'my father's son' is the speaker himself! So 'this man's father is ME'.",
    "answer": "His own son",
    "acceptedKeywords": [
      "his son",
      "son",
      "his own son"
    ],
    "explanation": "Since the speaker has no brothers, 'my father's son' is the speaker himself. Substituting 'myself' gives: 'This man's father is myself' — meaning the portrait is of his son!",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-110",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the principle in quantum mechanics stating that one cannot simultaneously measure both the precise position and precise momentum of a particle. Whose uncertainty principle am I?",
    "hint1": "Formulated by a German physicist named Werner.",
    "hint2": "My formula involves Planck's constant: Δx · Δp ≥ ħ/2.",
    "answer": "Heisenberg's Uncertainty Principle",
    "acceptedKeywords": [
      "heisenberg",
      "uncertainty principle",
      "werner heisenberg"
    ],
    "explanation": "Heisenberg's Uncertainty Principle sets a fundamental limit on the precision of simultaneous measurements of conjugate variables.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-111",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Built in 1965 to impound the Volta River, I created the world's largest man-made reservoir by surface area and generate hydroelectric power for Ghana. What engineering structure am I?",
    "hint1": "I am located in the Eastern Region near Senchi.",
    "hint2": "Constructed under President Kwame Nkrumah.",
    "answer": "The Akosombo Dam",
    "acceptedKeywords": [
      "akosombo dam",
      "the akosombo dam",
      "akosombo",
      "volta dam"
    ],
    "explanation": "The Akosombo Dam impounds the Volta River, forming Lake Volta and generating hydroelectricity for Ghana and neighboring nations.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-112",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "You have 12 identical-looking gold coins, but one is counterfeit and has a slightly different weight (either heavier or lighter). What is the minimum weighings on a balance scale to find it?",
    "hint1": "You divide the coins into three groups of 4 on the first weighing.",
    "hint2": "Information theory states each balance test gives 3 possible outcomes: left, right, or equal.",
    "answer": "3 weighings",
    "acceptedKeywords": [
      "3",
      "three",
      "3 weighings",
      "three weighings"
    ],
    "explanation": "With 3³ = 27 possible decision outcomes, 3 weighings are sufficient to isolate the counterfeit coin and determine if it is heavier or lighter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-113",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the process by which liquid water changes directly into gaseous water vapor through plant leaf stomata. What biological process am I?",
    "hint1": "It creates a negative suction pressure pulling water up from roots.",
    "hint2": "It sounds similar to respiration and evaporation combined.",
    "answer": "Transpiration",
    "acceptedKeywords": [
      "transpiration",
      "evapotranspiration"
    ],
    "explanation": "Transpiration is the evaporation of water from plant leaves through stomata, generating the transpirational pull that draws water from roots.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-114",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "A five-letter word meaning ahead of time: remove my first letter and you get an organ used to hear. What word am I?",
    "hint1": "The five-letter word is the opposite of 'late'.",
    "hint2": "Starts with E-A-R...",
    "answer": "Early",
    "acceptedKeywords": [
      "early",
      "nearly"
    ],
    "explanation": "In 'EARLY', the first three letters spell 'EAR' (or in 'NEARLY', removing 'N' leaves 'EARLY').",
    "isCentral": true
  }
];

export const THINK_TANK_DEBATES: ThinkTankDebateItem[] = [
  {
    "id": "tt-debate-nov-1",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every primary school should have a class pet or a school garden.",
    "context": "Caring for plants or gentle animals teaches children responsibility and science firsthand, though critics worry about allergies, weekend care, and classroom distractions.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Weekend homework should be replaced with outdoor play and reading storybooks.",
    "context": "Supporters say young children learn best through rest, family time, and curiosity on weekends, while opponents argue short practice worksheets help reinforce weekday lessons.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Students should be allowed to choose their own school uniform colours on Fridays.",
    "context": "Uniforms build equality and school pride, whereas Friday dress choices could boost creativity and student happiness.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-4",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Morning break time should be 15 minutes longer every day.",
    "context": "Extra physical play helps children refresh their brains and focus better in class, though teachers need enough instructional hours to finish lessons.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-5",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Paper storybooks are better for young readers than tablet screens.",
    "context": "Printed books protect eyes from screen glare and help focus, while tablets offer audio pronunciation and thousands of books in one device.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-6",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every child should learn how to cook a simple meal at school.",
    "context": "Cooking teaches nutrition, measurement, and independence, though schools must ensure kitchen safety for younger learners.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-1",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Coding and robotics should be a core subject just like Mathematics and English.",
    "context": "As technology shapes every career, early coding builds problem-solving skills, though some educators argue schools should first master reading, writing, and arithmetic.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Single-use plastic water sachets and bottles should be banned on school campuses.",
    "context": "Banning single-use plastics keeps drains clean and protects the environment, while opponents point out that sachet water is affordable and convenient for students.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Group projects are a fairer way to test students than written exams.",
    "context": "Team projects build collaboration and real-world communication, whereas exams measure each individual student’s personal mastery fairly.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-4",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Children under 13 should not have personal smartphones.",
    "context": "Delaying smartphones protects sleep, outdoor play, and focus, while supporters argue phones help parents stay in touch and give access to learning apps.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-5",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should teach all Science and Maths lessons in both English and local Ghanaian languages.",
    "context": "Bilingual instruction helps students grasp deep concepts in their mother tongue while still preparing them for international scientific terminology.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-6",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Zoos do more good for endangered animals than harm.",
    "context": "Modern conservation zoos protect endangered species from poaching and educate the public, while critics argue wild animals belong in natural habitats and national parks.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-1",
    "targetGroup": "Scholar (JHS)",
    "topic": "Artificial Intelligence tutors will improve education more than they encourage laziness.",
    "context": "AI coaches can give every JHS student instant, personalized 1-on-1 explanations at any hour, but critics warn students may copy answers without developing deep independent thinking.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2",
    "targetGroup": "Scholar (JHS)",
    "topic": "Social media platforms should be legally restricted to users aged 16 and above.",
    "context": "Age verification could protect teenagers from cyberbullying, addictive algorithms, and misinformation, while opponents argue teens use social media for learning communities and self-expression.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3",
    "targetGroup": "Scholar (JHS)",
    "topic": "Final BECE grades should be 50% continuous practical projects and 50% written examination.",
    "context": "A high-stakes single exam can penalize nervous students and reward cramming, whereas project-based assessment tests real-world skills but requires strict fairness standards across schools.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-4",
    "targetGroup": "Scholar (JHS)",
    "topic": "Developing countries should prioritize solar and renewable energy over fossil fuels for industrialization.",
    "context": "Solar and hydro power protect the climate and lower long-term energy costs, while others argue rapid manufacturing growth needs the cheapest, most immediate baseload power available.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-5",
    "targetGroup": "Scholar (JHS)",
    "topic": "Space exploration budgets should be spent solving problems on Earth first.",
    "context": "Critics say billions spent on rockets could fund hospitals, clean water, and schools today, while supporters point out that satellites drive weather forecasting, GPS, climate monitoring, and medical breakthroughs.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-6",
    "targetGroup": "Scholar (JHS)",
    "topic": "Cashless digital payments (Mobile Money & cards) should completely replace paper money.",
    "context": "Digital transactions reduce robbery, track corruption, and speed up commerce, but cash remains vital when networks fail or for citizens without phones.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-1",
    "targetGroup": "Master (SHS)",
    "topic": "Automation and AI will create more high-value jobs in Africa than they displace.",
    "context": "Historically, technological revolutions boosted productivity and created new industries (fintech, AI engineering, precision agriculture), yet rapid automation threatens traditional entry-level clerical and service roles.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-2",
    "targetGroup": "Master (SHS)",
    "topic": "Economic growth and environmental conservation are fundamentally compatible in resource-rich nations.",
    "context": "Nations with gold, bauxite, timber, and oil face pressure to extract resources for immediate revenue, yet illegal mining (galamsey) and deforestation destroy water bodies, cocoa farmlands, and long-term GDP.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-3",
    "targetGroup": "Master (SHS)",
    "topic": "Genetic engineering (CRISPR) should be used not only to cure hereditary diseases like Sickle Cell, but also to enhance human traits.",
    "context": "Gene editing offers a historic cure for painful genetic disorders like Sickle Cell Disease, but using it for non-medical enhancement raises ethical alarms over inequality and unintended mutations.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-4",
    "targetGroup": "Master (SHS)",
    "topic": "Universal Basic Income (UBI) is a more effective poverty-reduction tool than targeted government subsidies.",
    "context": "Direct cash transfers empower families to invest in food, education, or micro-businesses without bureaucratic waste, whereas critics argue targeted infrastructure (schools, clinics, roads) delivers more lasting public value.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-5",
    "targetGroup": "Master (SHS)",
    "topic": "Tech companies should be held legally liable for algorithmic amplification of disinformation on their platforms.",
    "context": "Holding platforms accountable could curb viral hoaxes and election interference, while opponents warn that strict liability could lead to over-censorship of legitimate public debate.",
    "isCentral": true
  },
  {
    "id": "tt-debate-mas-6",
    "targetGroup": "Master (SHS)",
    "topic": "University admission should be based on holistic community leadership and portfolios rather than WASSCE grades alone.",
    "context": "Standardized exams provide an objective national benchmark resistant to nepotism, whereas holistic admissions recognize entrepreneurship, coding projects, and leadership that a timed paper cannot capture.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-104",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "All school break-time games should be cooperative rather than competitive.",
    "context": "Supporters believe cooperative play fosters team unity and prevents children from feeling left out or upset by losing. Opponents argue that friendly competition teaches resilience, sportsmanship, and motivation.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-105",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every primary school pupil should help clean their classroom every afternoon.",
    "context": "Proponents argue that classroom chores instill humility, responsibility, and civic duty from an early age. Opponents believe that cleaning duties take away from study time and should be handled by custodial staff.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-102",
    "targetGroup": "Scholar (JHS)",
    "topic": "African nations should prioritize nuclear energy over solar power for baseload industrial electrification.",
    "context": "Supporters argue that nuclear reactors deliver massive, reliable, zero-carbon electricity unaffected by weather or day-night cycles. Opponents highlight high capital costs, long construction timelines, and severe nuclear waste disposal concerns relative to abundant solar resources.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-104",
    "targetGroup": "Scholar (JHS)",
    "topic": "The voting age in national elections should be lowered from 18 to 16 years old.",
    "context": "Supporters argue that 16-year-olds pay taxes on work and will live longest with climate, economic, and education policies. Opponents argue that neurological brain maturity and civic knowledge are still developing at 16, making youth vulnerable to political manipulation.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-105",
    "targetGroup": "Scholar (JHS)",
    "topic": "Governments should levy a targeted sugar and salt tax on processed fast foods to fund national health care.",
    "context": "Proponents argue that public health taxes successfully reduce rates of diabetes, hypertension, and obesity while funding hospital care. Opponents argue that sin taxes disproportionately burden lower-income households and intrude on personal dietary freedom.",
    "isCentral": true
  }
];
