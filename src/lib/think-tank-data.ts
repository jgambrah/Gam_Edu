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
  },
  {
    "id": "tt-paradox-nov-201",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "A teacher draws a circle in the sand with a stick and says: 'Find where this line starts and where it ends.' Can anyone find the beginning?",
    "answer": "No, because a closed loop connects back onto itself without a starting point.",
    "explanation": "A circle is a continuous closed curve. Every point on its boundary connects to the next, so there is no fixed beginning or end.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-202",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you blow cold breath onto your cold hands in harmattan, they feel warmer, but if you blow fast on hot soup, it cools down. How can the same mouth do both?",
    "answer": "The temperature of your breath is in between your cold hands and hot soup.",
    "explanation": "Heat always flows from warmer things to cooler things. Your breath (around 37°C) transfers heat to colder hands, but absorbs heat away from steaming soup.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-203",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Kofi says: 'Everything I ever say to anyone is a mistake.' Did Kofi make a mistake by saying that?",
    "answer": "Yes, because if the statement is true, making that statement was itself a mistake.",
    "explanation": "If Kofi is right, then his statement was an error. If he is wrong, then not everything he says is an error.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-204",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you cut a long skipping rope in half, you have two pieces. If you tie the two pieces together, do you have one rope or two ropes?",
    "answer": "You have one continuous rope made from two tied pieces.",
    "explanation": "Functionally, it acts as a single tool to skip with, but physically it is two separate cords joined by a knot.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-205",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "You look at the full moon high above Lake Bosomtwe while walking along the path. Why does the moon seem to walk along with you instead of staying behind the palm trees?",
    "answer": "The moon is so extremely far away that your small steps do not change the angle you see it from.",
    "explanation": "Objects very close to you shift quickly against your field of view, but celestial objects hundreds of thousands of kilometers away maintain an almost identical visual angle.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-206",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Ama puts an empty plastic cup upside down and pushes it straight into a bucket of water. Why does the bottom of the cup stay completely dry?",
    "answer": "The trapped air inside takes up physical space and blocks the water from entering.",
    "explanation": "Air is real matter with volume. Pushing the cup down traps the air, creating pressure that stops the water from rushing in.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-207",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can you ever truly stand 'in the middle of nowhere'?",
    "answer": "No, because wherever you stand becomes an actual location.",
    "explanation": "'Nowhere' is a figure of speech, not a physical space. The spot where your feet rest is always somewhere.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-208",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Yaw leaves a bowl of sugar on the veranda and an identical bowl of fine beach sand next to it. Rain falls and soaks both. The sand is still there, but where did the sugar go?",
    "answer": "The sugar dissolved into the rainwater, becoming invisible liquid solution.",
    "explanation": "Sugar molecules break apart and dissolve between water molecules, whereas sand grains are insoluble in water.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-209",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have a basket with 5 ripe oranges and you give 5 children an orange each, how can one orange still remain in the basket?",
    "answer": "You give the fifth child their orange while it is still inside the basket.",
    "explanation": "Giving away an orange does not prevent the child from receiving it inside the container.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-210",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A chalkboard sign in the library reads: 'Silence must be heard.' Can anyone actually hear silence?",
    "answer": "No, silence is the absence of sound rather than a sound you can hear.",
    "explanation": "You experience silence when your ears detect no auditory vibrations. Saying you 'hear silence' is poetic, not literal.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-201",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A village blacksmith makes a sturdy iron hoe. Every month he sharpens the edge, grinding away a few grams of metal until, after ten years, every bit of the original iron has been ground away and replaced with welded patches. Is it the original hoe?",
    "answer": "It preserves functional identity and purpose, but none of the original material substance.",
    "explanation": "This variation of the Ship of Theseus demonstrates that human identity labels often attach to historical continuity and utility rather than raw atoms.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-202",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "You buy a pair of school sandals for 60 Cedis, sell them for 70 Cedis, buy them back for 80 Cedis, and sell them again for 90 Cedis. How much net profit did you make?",
    "answer": "You made 20 Cedis profit in total.",
    "explanation": "Break it into two separate transactions: 70 - 60 = +10 Cedis, and 90 - 80 = +10 Cedis. Total net profit is 10 + 10 = 20 Cedis.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-203",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A wooden block floats in a bucket of water with half its volume submerged. If we take this entire bucket to the top of Mount Afadja where atmospheric air pressure is lower, does the block sink deeper or float higher?",
    "answer": "It floats at the exact same depth.",
    "explanation": "Buoyant force depends on the mass density of water and the mass of the wood, not ambient atmospheric air pressure.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-204",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A town chief announces: 'All citizens must either bring a basket of yams or face a fine of 10 Cedis.' Kwame arrives empty-handed and says: 'I am here to pay the fine.' Does Kwame obey or disobey the decree?",
    "answer": "Kwame obeys the decree because he fulfills one of the two allowable choices.",
    "explanation": "An 'either/or' logical disjunction (A ∨ B) is completely satisfied when either condition is met. Paying the fine satisfies the second condition.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-205",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "Two buses leave Kumasi and Accra at the exact same time heading toward each other on the same road. Bus A travels at 60 km/h and Bus B travels at 80 km/h. When they meet, which bus is closer to Kumasi?",
    "answer": "Both buses are at the exact same distance from Kumasi.",
    "explanation": "When two vehicles meet and pass each other at the same geographic spot, their distance to any reference city is identical.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-206",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A toy boat carrying a heavy iron bolt floats in a plastic basin of water. If you take the iron bolt out of the boat and drop it directly into the water so it sinks, does the water level in the basin rise or fall?",
    "answer": "The water level falls.",
    "explanation": "Floating, the bolt displaced a volume of water equal to its weight. Submerged, it displaces only a volume of water equal to its own small physical volume.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-207",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A farmer has 17 sheep in a pen in Ejura. All but 9 sheep escape through a broken fence. How many sheep does the farmer have left?",
    "answer": "The farmer has 9 sheep left.",
    "explanation": "The phrase 'all but 9' explicitly means that 9 sheep remained inside the pen.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-208",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You stand on a moving flatbed train traveling at 40 km/h and throw a mango forward at 10 km/h. To a person standing on the ground, the mango travels at 50 km/h. What if you shine a flashlight forward?",
    "answer": "The light beam travels at the exact speed of light, not speed of light plus train speed.",
    "explanation": "Einstein's postulate of special relativity proves that light travels at constant speed (c ≈ 300,000 km/s) in a vacuum regardless of the motion of the source.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-209",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If it takes 5 machines 5 minutes to sew 5 school uniforms in a factory in Tema, how many minutes will it take 100 machines to sew 100 uniforms?",
    "answer": "It will take 5 minutes.",
    "explanation": "Each individual machine takes 5 minutes to sew 1 complete uniform. Operating 100 machines in parallel means all 100 finish their uniform in 5 minutes.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-210",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A doctor gives you three pills and instructs you to take one pill every half hour starting immediately. How many minutes will the pills last?",
    "answer": "They will last 60 minutes (1 hour).",
    "explanation": "Pill 1 is taken at minute 0, Pill 2 at minute 30, and Pill 3 at minute 60. The total elapsed time between first and last pill is 60 minutes.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-201",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Fermi's Paradox, scientists note that our galaxy contains billions of stars older than our Sun, many with Earth-like planets. Given billions of years for technological civilizations to develop, where is everybody?",
    "answer": "The contradiction highlights the mystery of why we observe no evidence of extraterrestrial civilizations despite high statistical probabilities.",
    "explanation": "Fermi's Paradox contrasts high astronomical estimates of potential extraterrestrial intelligence with the complete lack of empirical observational evidence.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-202",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a hospital, 1 out of 1,000 people has a rare condition. A screening test is 99% accurate (1% false positive rate). If a patient tests positive, is the probability they actually have the condition above or below 50%?",
    "answer": "It is well below 50% (roughly 9%).",
    "explanation": "Out of 100,000 people, 100 have it (99 test positive) and 99,900 do not (roughly 999 false positives). The true positives are 99 / (99 + 999) ≈ 9%. This is the Base Rate Fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-203",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "A physics laboratory has a box containing a radioactive atom with a 50% chance of decaying in one hour, connected to a sensor that releases sleeping gas. Until the box is opened, is the system in a superposition of states?",
    "answer": "Schrödinger's thought experiment shows the paradoxical consequence of applying microscopic quantum superposition to macroscopic objects.",
    "explanation": "In the Copenhagen interpretation, unobserved quantum systems exist in superposed states until measurement forces wave function collapse.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-204",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "Gabriel's Horn is a mathematical shape created by rotating the curve y = 1/x (for x ≥ 1) around the x-axis. It has a finite volume of π, but an infinite surface area. Can you fill it with paint?",
    "answer": "Yes, you can fill the horn with a finite volume of paint, which paradoxically coats an infinite inner surface.",
    "explanation": "Integrating ∫₁^∞ π (1/x)² dx converges to π, while the surface area integral ∫₁^∞ 2π(1/x)dx diverges infinitely.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-205",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In Braess's Paradox, traffic engineers in Accra add a brand new high-speed highway link between two bottlenecks to reduce congestion, but overall traffic commute times across the network get worse. How?",
    "answer": "Selfish individual driver route choices (Nash equilibrium) can degrade the overall system efficiency compared to coordinated routing.",
    "explanation": "When drivers independently choose what appears to be the quickest shortcut, they overwhelm key junction segments and slow the entire road network.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-206",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In Simpson's Paradox, Hospital A has a higher patient recovery rate than Hospital B for mild cases, AND a higher recovery rate for severe cases. Can Hospital B have a higher overall recovery rate when all patients are combined?",
    "answer": "Yes, if Hospital A treats a vastly higher proportion of severe cases than Hospital B.",
    "explanation": "A confounding variable (case severity distribution) can reverse or hide an association observed within individual sub-groups when data is aggregated.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-207",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "According to the Twin Paradox of special relativity, an astronaut twin travels to Alpha Centauri at 95% the speed of light and returns, while the other twin stays in Cape Coast. Who is older when they meet?",
    "answer": "The twin who remained on Earth is physically older.",
    "explanation": "The traveling twin experiences time dilation and undergoes physical acceleration and deceleration when turning around, breaking reference-frame symmetry.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-208",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "The Unexpected Hanging Paradox: If an announcement states an event will occur on an unexpected day, can perfect deductive logic eliminate every possible date?",
    "answer": "Yes in theory via backward induction, but the real-world execution still catches the recipient by surprise.",
    "explanation": "The paradox reveals an epistemic tension between logical certainty and practical foreknowledge over a bounded timeline.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-209",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You flip a fair Cedi coin. Sequence A is Heads-Tails-Heads (HTH) and Sequence B is Heads-Tails-Tails (HTT). While both individual sequences have a 1/8 chance on three flips, will HTT appear before HTH on average in a long series?",
    "answer": "Yes, because HTH can overlap and reset its own sequence, delaying its first appearance.",
    "explanation": "Penney's Game demonstrates non-transitive probabilities in sequential coin tossing; HTT has an average waiting time shorter than HTH.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-210",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Maxwell's Demon paradox, a tiny hypothetical entity opens a shutter between two gas chambers to sort fast molecules from slow molecules, reducing entropy without doing work. What solves this violation of the Second Law of Thermodynamics?",
    "answer": "The information processing, measurement, and memory erasure by the demon generates entropy.",
    "explanation": "Landauer's Principle proves that erasing binary bits of stored information releases thermodynamic heat (kT ln 2), preserving the Second Law.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-301",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you are running in the school sports race and you run past the person in second place, what position are you in now?",
    "answer": "You are in second place.",
    "explanation": "You took over the spot of the person who was second, so you become second, while the leader remains in first place.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-302",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you look at your clean hand in the bright morning sun, you see one dark shadow on the veranda floor. When you turn on two torches from different sides, why are there two shadows of the same hand?",
    "answer": "Each separate beam of light creates its own shadow when blocked by your hand.",
    "explanation": "A shadow forms wherever light rays cannot reach. Two distinct light sources mean two separate paths of light are blocked.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-303",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can a person write a letter using ink that is completely invisible and truthfully claim they have written nothing?",
    "answer": "No, because words were still formed on the paper even if the eye cannot detect them yet.",
    "explanation": "Writing refers to the action of composing and recording marks, regardless of whether special heat or light is needed to see them.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-304",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you stack three empty calabash bowls inside each other, how many bowls are holding another bowl?",
    "answer": "Two bowls are holding another bowl.",
    "explanation": "The bottom bowl holds the middle one, and the middle bowl holds the top one. The top bowl holds nothing inside it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-305",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you look through a clear glass window, you see the mango tree outside. If you cover the glass with black cloth, why do you see your own faint face instead?",
    "answer": "The black cloth stops incoming outside light, allowing the faint reflection from the front glass surface to show.",
    "explanation": "Glass always reflects a tiny amount of light. When bright sunlight from outside is blocked, the dimmer reflection becomes visible.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-306",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A farmer says: 'I know for a fact that nobody knows anything.' Does the farmer know something?",
    "answer": "Yes, which contradicts the claim that nobody knows anything.",
    "explanation": "Claiming absolute knowledge that no knowledge exists is self-refuting.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-307",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you hold a piece of ice in your warm palm until it turns entirely to liquid water, did the ice disappear?",
    "answer": "No, the ice simply changed its physical state from solid to liquid.",
    "explanation": "Matter does not vanish; heat causes ice molecules to melt into liquid water without changing what substance it is.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-308",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you put a straight wooden ruler into a clear jar of water, why does the ruler look bent or broken at the water's surface?",
    "answer": "Light rays bend as they pass from water into air, creating an optical illusion.",
    "explanation": "This is refraction: light changes speed and bends when moving between materials of different densities, distorting the image.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-309",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If there are 4 papayas on a kitchen tray and you take 3 papayas, how many papayas do you have in your arms?",
    "answer": "You have 3 papayas.",
    "explanation": "The question asks what you took and currently hold, not what remains on the tray.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-310",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can you ever take a step forward into yesterday?",
    "answer": "No, because time only moves forward and physical movement cannot travel into the past.",
    "explanation": "Yesterday is a completed period of time; physical motion only occurs in the present moment.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-301",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A mud-brick house in the village has every single brick replaced with fired clay blocks over ten years. If the original mud bricks are stacked into a second hut nearby, which one is the original house?",
    "answer": "The standing home keeps historical functional continuity, while the new pile holds the original materials.",
    "explanation": "This demonstrates the duality of identity: continuity of place and form versus continuity of the physical atoms.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-302",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A market trader doubles her money on Monday, then spends 40 Cedis on stock. On Tuesday she doubles her remaining money and spends 40 Cedis again, leaving her with zero. How many Cedis did she start with?",
    "answer": "She started with 30 Cedis.",
    "explanation": "Working backwards: Before spending 40 Cedis on Tuesday she had 40, meaning she had 20 before doubling. On Monday before spending 40, she had 60 (20 + 40), meaning she started with half of 60, which is 30 Cedis.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-303",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A heavy solid iron anchor and a light wooden log are placed into Lake Volta. Why does the giant log float while a tiny iron nail sinks immediately?",
    "answer": "The wood is less dense than water, while solid iron is denser than water.",
    "explanation": "Flotation depends on density (mass per unit volume) relative to water, not total weight.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-304",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A village head declares: 'Whoever speaks a true sentence will be rewarded with a hen, and whoever speaks a false sentence will be rewarded with a duck.' What sentence earns neither?",
    "answer": "'You will reward me with a duck.'",
    "explanation": "If it is true, he must receive a hen, making it false. If it is false, he must receive a duck, making it true. It creates an insoluble paradox.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-305",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A father is 36 years old and his daughter is 6 years old. In how many years will the father be exactly three times as old as his daughter?",
    "answer": "In 9 years.",
    "explanation": "In 9 years, the father is 45 (36 + 9) and the daughter is 15 (6 + 9). 45 is 3 × 15.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-306",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you hold an open umbrella upright while running forward through vertical raindrops, why do your knees get wet while your head stays dry?",
    "answer": "Your forward speed creates a relative angle for incoming rain, making it hit you diagonally from the front.",
    "explanation": "Relative velocity combines the downward velocity of the rain with your forward velocity, slanting the apparent angle of impact.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-307",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "Can an accurate weighing scale ever measure something that weighs less than zero grams?",
    "answer": "No, because physical matter cannot have negative mass.",
    "explanation": "Weight is the gravitational force acting on mass. Scales can read negative values only as an offset calibration error (tare), not physical negative matter.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-308",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You place a large ice cube in a glass filled to the absolute brim with water. When the ice melts completely, will the water spill over the glass?",
    "answer": "No, the water level remains exactly at the brim without spilling.",
    "explanation": "Floating ice displaces an amount of liquid water equal to its own total mass. Melting turns it into that exact volume.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-309",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If 3 weavers can weave 3 kente strips in 3 days, how many days will it take 9 weavers to weave 9 kente strips?",
    "answer": "It will take 3 days.",
    "explanation": "One weaver takes 3 days to weave 1 kente strip. Therefore, 9 weavers working simultaneously produce 9 strips in those same 3 days.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-310",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "Two boys are born to the same mother, at the same hour, on the same day of the same year, but they are not twins. How is this possible?",
    "answer": "They are two of a set of triplets.",
    "explanation": "Being born as part of a set of triplets, quadruplets, or more means they share birth timing without being twins.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-301",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Newcomb's Paradox, an omniscient predictor sets two boxes: Box A (containing 1,000 Cedis) and Box B (containing 1,000,000 Cedis if predicted you take only Box B, or empty if predicted you take both). Do you choose Box B or both?",
    "answer": "The problem divides decision theorists between Dominance Principle (two-boxing) and Expected Utility (one-boxing).",
    "explanation": "If the predictor is infallible, taking only Box B guarantees 1,000,000 Cedis, but at the moment of choice the money is already physically placed.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-302",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Paradox of the Heap (Sorites), if removing one grain of sand never turns a heap into a non-heap, does removing 100,000 grains one-by-one mean zero grains is still a heap?",
    "answer": "No, showing that inductive logic breaks down when applied to vague linguistic predicates.",
    "explanation": "Vagueness creates boundary problems where small imperceptible steps lead to logically absurd outcomes via mathematical induction.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-303",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "A family in Accra has two children. You are informed that at least one of them is a girl. What is the probability that both children are girls?",
    "answer": "The probability is 1/3 (approximately 33.3%).",
    "explanation": "Sample space for two children is {BB, BG, GB, GG}. Eliminating BB leaves 3 equally likely outcomes, only one of which is GG.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-304",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In special relativity, can an object with non-zero rest mass ever accelerate up to and surpass the speed of light in a vacuum (c)?",
    "answer": "No, because its relativistic momentum and required kinetic energy approach infinity as speed approaches c.",
    "explanation": "As velocity approaches c, the Lorentz factor γ = 1/√(1 - v²/c²) approaches infinity, requiring infinite work.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-305",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In Russell's Paradox, consider the set R of all sets that do not contain themselves. Does R contain itself?",
    "answer": "R contains itself if and only if it does not contain itself, exposing an inconsistency in naive set theory.",
    "explanation": "If R ∈ R, then by definition R ∉ R. If R ∉ R, then by definition R ∈ R. This necessitated axiomatic set theory (ZFC).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-306",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the St. Petersburg Paradox, a fair coin is flipped until Tails appears. If Tails appears on flip n, you win 2ⁿ Cedis. What is the mathematically expected payout?",
    "answer": "The expected value is mathematically infinite, yet people will only pay a small sum to play.",
    "explanation": "E = Σ(n=1 to ∞) (1/2ⁿ)(2ⁿ) = 1 + 1 + 1 + … = ∈fty. Expected monetary value diverges from real human expected utility.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-307",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Bootstrap Paradox (causal loop), a physicist travels back in time and hands Isaac Newton his own published Principia Mathematica, which Newton then copies and publishes. Who wrote the book?",
    "answer": "The information has no origin, existing within a closed uncaused causal loop.",
    "explanation": "Causal loops in closed timelike curves violate ontological causality: the information exists without ever being created.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-308",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In Arrow's Impossibility Theorem, can any ranked voting system with 3 or more options convert individual preferences into a community-wide ranking while satisfying all fair democratic criteria?",
    "answer": "No, Kenneth Arrow proved mathematically that no ranked voting system can satisfy all fair criteria simultaneously.",
    "explanation": "Criteria like unrestricted domain, non-dictatorship, Pareto efficiency, and independence of irrelevant alternatives cannot coexist without dictatorship.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-309",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In quantum mechanics, if you observe an unstable radioactive particle continuously with extremely rapid measurements, does it decay?",
    "answer": "No, continuous measurement prevents the system from transitioning, freezing its state (the Quantum Zeno Effect).",
    "explanation": "Repeatedly collapsing the wave function back to the initial undecayed state suppresses the transition probability to zero.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-310",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You draw two cards from a standard deck without replacement. Event A: the first card is an Ace. Event B: the second card is an Ace. Are events A and B statistically independent?",
    "answer": "No, they are dependent events because the outcome of the first draw alters the probabilities of the second draw.",
    "explanation": "P(B|A) = 3/51, whereas P(B|not  A) = 4/51. Because P(B|A) ≠ P(B), the events are dependent.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-401",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you hold a small torch inside a completely dark classroom and switch it on, darkness vanishes. Where did the darkness travel to?",
    "answer": "Darkness did not travel anywhere because it is simply the absence of light.",
    "explanation": "Darkness is not a physical substance that moves or hides. When photons of light illuminate a room, the absence of light is replaced immediately.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-402",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you look into a shiny metal spoon from the curved hollow side, your face appears upside down, but on the back rounded side, you are right-side up. How can one spoon do both?",
    "answer": "The concave inner curve crosses reflected light rays upside down, while the convex outer curve spreads rays right-side up.",
    "explanation": "A concave surface bends incoming light rays inward across a focal point so they flip before reaching your eyes. A convex surface reflects rays outward without inverting them.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-403",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can a person truthfully say: 'I have completely lost the ability to speak any words in English'?",
    "answer": "No, because speaking that exact sentence disproves the claim.",
    "explanation": "The speaker must use eleven English words to declare they cannot speak any English words, making the sentence immediately false upon utterance.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-404",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Kofi has an empty wooden crate. He places one ripe pineapple inside, then a second, then a third. At what point did the crate stop being empty?",
    "answer": "The instant the very first pineapple touched the bottom of the crate.",
    "explanation": "'Empty' means containing zero items. The addition of a single object eliminates emptiness; further objects only change how full the container is.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-405",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you blow gently on the surface of hot tea, it cools down. If you seal the same hot tea inside a tightly closed flask, why does it stay piping hot for hours?",
    "answer": "Blowing speeds up evaporative cooling, while a sealed vacuum flask blocks heat from escaping.",
    "explanation": "Moving air carries away high-energy water vapor molecules via forced convection. A sealed double-walled flask traps both vapor and infrared heat radiation inside.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-406",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A village clockmaker hangs a sign reading: 'This clock is broken; it is never correct.' Yet twice every single day, the frozen clock matches the exact real time. Is the sign correct?",
    "answer": "No, because a completely stopped clock shows the exact correct time twice every twenty-four hours.",
    "explanation": "As the true time rotates through all twelve hours twice daily, it aligns precisely with whatever fixed position the stopped clock hands point to.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-407",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you walk four paces forward from the front gate, turn around completely, and walk four paces forward again, are you farther away from the gate or back at it?",
    "answer": "You are back at the gate.",
    "explanation": "Turning around reverses your direction vector. Walking the exact same number of paces forward returns you to your starting origin point.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-408",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "You see a lightning flash across the sky over the Volta River, but you only hear the rumble of thunder several seconds later. Did the flash and the boom occur at different moments?",
    "answer": "They occurred at the exact same moment, but light travels vastly faster than sound.",
    "explanation": "Lightning and thunder are produced simultaneously. Light travels at roughly 300,000 km/s reaching your eyes instantly, while sound travels at only 343 m/s in air, causing a perceptible delay.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-409",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you cut a sheet of paper into two pieces, you have two sheets. If you tear each of those pieces in half, you have four. Can you ever cut it so many times that it turns into zero paper?",
    "answer": "No, physical cutting only divides matter into smaller pieces without destroying the paper's mass.",
    "explanation": "Mechanical division reduces the physical dimensions of individual fragments, but the total matter remains conserved and cannot diminish into nothingness.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-410",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If someone asks you: 'Will you answer NO to this question?', can you give a truthful single-word answer of either Yes or No?",
    "answer": "No, both answers produce an immediate contradiction.",
    "explanation": "Answering 'Yes' means you promised to say No (which you didn't). Answering 'No' means you did say No, which fulfills the condition and contradicts the refusal.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-401",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A potter in Vume shapes a clay cooking pot. Before firing it in the kiln, she decides she dislikes the shape, crushes it back into a ball of wet clay, and sculpts an identical pot. Is it the first pot or a second pot?",
    "answer": "It is a new object made from the continuous material of the dismantled predecessor.",
    "explanation": "Because the functional form and structural integrity were completely broken down and recreated, the identity of the original pot was dissolved and replaced by a second artifact.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-402",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A farmer sells a sack of garden eggs for 100 Cedis. The customer gives him a fake 100 Cedi note. The farmer gives the customer 20 Cedis change and the sack (which cost 80 Cedis to grow). How much total wealth did the farmer lose?",
    "answer": "The farmer lost exactly 100 Cedis in total value.",
    "explanation": "The farmer gave away goods worth 80 Cedis and 20 Cedis in real cash. The counterfeit note has zero value, making his net loss 80 + 20 = 100 Cedis.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-403",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A large cargo ship made of thousands of tonnes of dense steel floats easily on the sea at Tema Harbour, but an iron bolt dropped overboard sinks to the seabed. Why?",
    "answer": "The ship's hollow hull encloses vast volumes of air, lowering its average density below that of seawater.",
    "explanation": "Archimedes' principle states that an object floats if its overall average density is less than the fluid. The ship's hollow design creates an enormous buoyant displacement force.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-404",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A village elder declares: 'I will grant farmlands only to families who do not seek any farmlands.' How can any family acquire farmland under this decree?",
    "answer": "They cannot intentionally acquire it, because taking action to seek it disqualifies them.",
    "explanation": "This Catch-22 paradox creates a contradictory rule where the desire or initiative to obtain the objective immediately revokes the eligibility to receive it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-405",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A water tank in Koforidua has two pipes. Pipe A fills the tank in 2 hours. Pipe B empties the tank in 3 hours. If both pipes are opened simultaneously when the tank is empty, will it ever fill up?",
    "answer": "Yes, it will fill completely in 6 hours.",
    "explanation": "In one hour, Pipe A adds 1/2 and Pipe B removes 1/3. The net filling rate is 1/2 - 1/3 = 1/6 of the tank per hour, meaning it takes 6 hours to fill fully.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-406",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you hold a piece of paper horizontally and blow air forcefully across its upper top surface, why does the paper lift upward instead of being pushed down?",
    "answer": "Fast-moving air on top creates lower static air pressure, allowing higher atmospheric pressure below to push it up.",
    "explanation": "Bernoulli's principle shows that an increase in fluid velocity results in a decrease in static fluid pressure. The pressure differential generates aerodynamic lift.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-407",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A traveler comes to a fork in the road where one path leads to Tamale and the other into a swamp. A signpost was knocked flat on the grass by a storm. How does the traveler determine which way to go without asking anyone?",
    "answer": "He sets the signpost upright so the arm naming the town he just came from points directly back down his road.",
    "explanation": "Since the traveler knows with certainty the town and direction from which he just arrived, orienting that known pointer automatically aligns all other directional arms correctly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-408",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "Why does a spinning bicycle wheel remain upright and resist tipping over, while a stationary bicycle instantly falls to the side when you let go?",
    "answer": "Angular momentum and gyroscopic precession resist changes to the rotational axis.",
    "explanation": "The conservation of angular momentum in spinning wheels creates gyroscopic stability, meaning external torque causes precession rather than an immediate sideways collapse.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-409",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A clock strikes 6 bells at 6:00 AM, taking exactly 5 seconds between the first bell and the sixth bell. How many seconds will it take to strike 12 bells at 12:00 PM?",
    "answer": "It will take 11 seconds.",
    "explanation": "Striking 6 bells involves 5 intervals between chimes (5 seconds / 5 intervals = 1 second per interval). Striking 12 bells involves 11 intervals, taking 11 × 1 = 11 seconds.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-410",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A box contains two coins that sum to 30 Pesewas. One of the coins is not a 10-Pesewa coin. What are the two coins?",
    "answer": "A 20-Pesewa coin and a 10-Pesewa coin.",
    "explanation": "One of the coins is not a 10-Pesewa coin (it is the 20-Pesewa coin); the other coin is indeed the 10-Pesewa coin. The wording tricks the listener into thinking neither can be 10 Pesewas.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-401",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the All Ravens Paradox (Hempel's Paradox), the scientific hypothesis states: 'All ravens are black.' Does finding a green baobab leaf logically confirm that all ravens are black?",
    "answer": "Formally yes in classical first-order logic, through the logical equivalence of contrapositives.",
    "explanation": "'All ravens are black' (R → B) is logically equivalent to its contrapositive 'All non-black things are non-ravens' (≠g B → ≠g R). A green leaf is non-black and a non-raven, though its Bayesian confirmation weight is virtually infinitesimal.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-402",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Curry's Paradox, consider the sentence: 'If this sentence is true, then Kumasi is located on Mars.' Why does this sentence threaten deductive proof systems?",
    "answer": "It uses self-reference and conditional detachment to prove any arbitrary absurd proposition as true.",
    "explanation": "Assuming the sentence is true leads through Modus Ponens to the arbitrary claim being true, which paradoxically proves the conditional itself, demonstrating semantic instability in unrestricted logic.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-403",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Two Envelopes Problem, Envelope A contains X Cedis, and Envelope B contains either 2X or X/2 Cedis with equal 50% probability. Should you always switch envelopes to maximize your expected value?",
    "answer": "No, because assuming a uniform probability distribution over all positive real numbers is mathematically impossible.",
    "explanation": "The expected value calculation E = 0.5(2X) + 0.5(0.5X) = 1.25X is fallacious because it conflates two different values of X across mutually exclusive hypothetical states.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-404",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In Wheeler's Delayed-Choice experiment, a quantum photon traverses a double slit, and the experimenter decides whether to insert a detecting screen or let interference occur after the photon has already passed the slits. How does nature behave?",
    "answer": "The photon's wave or particle manifestation depends on how it is measured, defying classical retro-causal intuition.",
    "explanation": "Quantum phenomena cannot be described as having definite classical histories prior to the act of measurement. Wave-particle duality remains complementary until terminal observation.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-405",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Paradox of the Court (Protagoras and Euathlos), a legal master agrees to train a student on credit, with payment due only after the student wins his first lawsuit. The student never takes a case, so the master sues him. Who wins?",
    "answer": "The case is legally and logically self-referential with no stable non-contradictory verdict.",
    "explanation": "If the court rules for the master, the student loses his first case and per the contract owes nothing. If the court rules for the student, he wins his first case and per the contract must pay.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-406",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Three Prisoners Problem, Prisoners A, B, and C face execution, but one is pardoned at random. Prisoner A asks the warden to name one other prisoner who will be executed. The warden names B. Did A's survival odds improve?",
    "answer": "No, A's survival probability remains 1/3, while C's survival probability jumps to 2/3.",
    "explanation": "The warden can always name at least one doomed co-prisoner regardless of whether A is saved or executed. This is isomorphic to the Monty Hall problem: the extra conditional information concentrates probability into C.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-407",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In the Black Hole Information Paradox, Stephen Hawking showed that black holes emit thermal radiation and eventually evaporate completely. Why did this shock theoretical physicists?",
    "answer": "It violates quantum unitarity, which mandates that quantum information can never be permanently destroyed.",
    "explanation": "If matter collapses into a singularity and evaporates purely as featureless thermal Hawking radiation, the initial pure quantum states are obliterated into mixed states, contradicting quantum mechanics.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-408",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Lottery Paradox, a fair lottery has 1,000,000 tickets and exactly 1 winner. It is rational to believe Ticket 1 will lose, Ticket 2 will lose, ..., and Ticket 1,000,000 will lose. Why does this create a paradox?",
    "answer": "It is rational to believe each ticket loses individually, but irrational to believe all tickets lose collectively.",
    "explanation": "The paradox exposes the limitation of the Conjunction Principle in epistemic logic: believing propositions with high individual probability can yield a conjunction that has a probability of zero.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-409",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In Bertrand's Box Paradox, there are three identical boxes: Box 1 contains two gold coins, Box 2 contains two silver coins, and Box 3 contains one gold and one silver coin. You pick a box at random and draw one gold coin. What is the probability that the other coin is also gold?",
    "answer": "The probability is 2/3, not 1/2.",
    "explanation": "There are three gold coins in total across all boxes (Coin G1a, G1b, and G3). Two of those three specific gold coins reside in the double-gold box, making the conditional probability 2/3.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-410",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Paradox of Tolerance (Karl Popper), what happens if a society extends absolute, unlimited tolerance to all philosophies, including philosophies that promote violent intolerance?",
    "answer": "The intolerant movements will eventually suppress the tolerant society and eliminate tolerance entirely.",
    "explanation": "Popper argued that to maintain a tolerant democratic society, the society must be intolerant of intolerance when it rejects rational discourse and uses violence to dismantle democratic rights.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-501",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you hold an empty calabash under a water pipe and fill it completely to the brim, is it possible to pour in one more drop of water without spilling any on the compound floor?",
    "answer": "No, because any matter added beyond full volume must displace an equal amount over the edge.",
    "explanation": "A container at absolute capacity has no remaining volume. Adding further liquid forces overflow due to physical displacement of matter.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-502",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you strike a metal school bell with a wooden stick, your eyes see the bell shaking slightly, but you hear the ringing sound in your ears. Did the shaking make the sound, or did the sound make the shaking?",
    "answer": "The mechanical impact makes the metal vibrate, and those vibrations produce sound waves in the air.",
    "explanation": "Sound is acoustic energy created by physical vibrations. Striking the bell transfers kinetic energy into rapid oscillation that compresses adjacent air molecules.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-503",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If a sign on the school gate says 'Nobody is allowed to enter without a uniform,' can a teacher wearing a tailored smock walk in legally?",
    "answer": "Yes, because school uniform rules apply specifically to enrolled pupils rather than adult teaching staff.",
    "explanation": "Context defines the scope of institutional rules. Interpreting 'nobody' literally without context creates logical absurdities in daily life.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-504",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Ama blows air into a clean paper bag and claps her hands onto it, making a loud bang. Did the paper explode from too much paper or from trapped moving air?",
    "answer": "It popped from the sudden rapid pressure of trapped air forcing the paper fibers apart.",
    "explanation": "Squashing the bag compresses the enclosed air volume rapidly, building up hydrostatic pressure that tears the structural container.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-505",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you stir sugar into a cup of warm cocoa tea until you cannot see any white grains, did the sugar vanish into thin air?",
    "answer": "No, the sugar dissolved into individual molecules distributed evenly throughout the liquid.",
    "explanation": "Dissolving is a physical process where solute molecules disperse between solvent molecules without disappearing or being destroyed.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-506",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If someone tells you: 'I am not speaking right now,' are they telling the truth?",
    "answer": "No, because the physical act of uttering the statement contradicts the claim itself.",
    "explanation": "A statement that denies the performance of the exact action needed to express it is self-refuting.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-507",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you hold a red book against a mirror, does the mirror switch the top and bottom of the book, or does it switch the front and back direction?",
    "answer": "A mirror reverses front-to-back relative to the glass, not vertical top-to-bottom.",
    "explanation": "Mirrors reflect light directly outward along the normal line of arrival, creating apparent left-right or front-back reversal without flipping vertical coordinates.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-508",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When cold harmattan wind blows over a puddle of water on the veranda, the puddle dries up even when the sun is completely covered by morning clouds. Where does the water go?",
    "answer": "The water evaporates into the dry, thirsty air as invisible water vapor.",
    "explanation": "Evaporation occurs at any temperature above freezing; dry wind sweeps away boundary moisture molecules and accelerates the phase change into gas.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-509",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you place one stone on the left pan of an equal-arm balance scale and three identical stones on the right pan, which pan drops closer to the table?",
    "answer": "The right pan drops because it holds three times as much mass.",
    "explanation": "Gravity exerts three times the downward force on three identical units of mass compared to a single unit, tipping the lever balance.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-510",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can you ever draw a straight line that connects two opposite corners of a soccer pitch without crossing the middle half of the field?",
    "answer": "No, because the shortest path between opposite diagonal corners must cut directly through the center region.",
    "explanation": "In Euclidean geometry, the straight segment between diagonally opposite points on a rectangle traverses the central intersection of the diagonals.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-501",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A basket weaver in Bolgatanga weaves a straw hat. If a goat chews off the brim and the weaver weaves a new brim using fresh elephant grass, does the wearer still own the original hat?",
    "answer": "Yes in practical utility, but physically it is now a hybrid composite of original and replacement materials.",
    "explanation": "Material identity changes piecemeal while social and functional identity persists as long as the core crown structure continues unbroken.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-502",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "Kofi walks 3 kilometers per hour uphill to his cocoa farm and walks 6 kilometers per hour back downhill along the exact same path. What is his average speed for the round trip?",
    "answer": "His average speed is 4 kilometers per hour, not 4.5.",
    "explanation": "Average speed is total distance divided by total time (harmonic mean). If the distance is 6 km each way, uphill takes 2 hours and downhill takes 1 hour (12 km / 3 hours = 4 km/h).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-503",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You place a sealed glass jar containing a sleeping butterfly on a sensitive kitchen scale. If the butterfly wakes up and hovers motionless in the middle of the jar, does the scale reading decrease?",
    "answer": "No, the scale reading remains identical.",
    "explanation": "To hover, the butterfly must push downward on air with a force exactly equal to its weight, transferring that downward force onto the jar's bottom floor.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-504",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A village messenger is instructed: 'Deliver this envelope to the paramount chief, but do not hand it to him yourself.' How can the messenger fulfill the instruction?",
    "answer": "By having an intermediary, like the chief's traditional linguist (Okyeame), deliver it to the chief.",
    "explanation": "The restriction forbids direct hand-to-hand delivery by the messenger, which is resolved by utilizing the formal cultural protocol of a linguist intermediary.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-505",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A school pond has water lilies that double in surface coverage every day. On Day 30, the pond is completely covered. On which day was the pond exactly half covered?",
    "answer": "On Day 29.",
    "explanation": "Because the lily pads double every 24 hours, the day preceding full coverage (Day 30 - 1 = 29) must have been exactly half coverage.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-506",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "When you rub a plastic ruler vigorously with a dry cotton cloth, it attracts tiny bits of paper from the desk. Did the ruler create new electric charges from friction?",
    "answer": "No, friction merely transferred existing electrons from the cloth onto the ruler.",
    "explanation": "The law of conservation of charge dictates that electric charge cannot be created; triboelectric contact separates and redistributes existing subatomic electrons.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-507",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A man stands on one side of a wide river and his dog stands on the other. The man calls the dog, and the dog crosses without using a bridge, boat, or swimming raft, arriving completely dry. How?",
    "answer": "The river was frozen solid into ice, or the stream bed was completely dried up.",
    "explanation": "Seasonal climate shifts can desiccate a river bed into dry dirt or freeze waterways into solid surfaces, enabling dry walking across the span.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-508",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you hold a tennis ball in one hand and a lead shotput ball in the other and drop them together from a school balcony into soft sand, which ball leaves a deeper crater?",
    "answer": "The lead shotput ball leaves a much deeper crater due to greater kinetic energy and momentum upon impact.",
    "explanation": "While both accelerate at g and land at identical terminal impact speeds, the lead ball has vastly greater mass and kinetic energy (Eₖ = ½mv²), doing more displacement work.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-509",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If you buy 10 coconuts at 2 Cedis each and sell 8 coconuts at 3 Cedis each, have you made a profit before selling the remaining 2 coconuts?",
    "answer": "Yes, you have made a cash profit of 4 Cedis with 2 coconuts still in inventory.",
    "explanation": "Total expenditure was 10 × 2 = 20 Cedis. Revenue earned so far is 8 × 3 = 24 Cedis, providing an immediate net cash profit of 24 - 20 = 4 Cedis.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-510",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A woman has 7 daughters, and each daughter has one brother. How many total children does the woman have?",
    "answer": "She has 8 children in total.",
    "explanation": "Each of the 7 daughters shares the exact same single brother. Total offspring: 7 daughters + 1 son = 8 children.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-501",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Ship of Theseus puzzle applied to cellular biology: human red blood cells live about 120 days, and skin cells shed continuously. If virtually all atoms in your body are replaced over a decade, why are you legally and biologically the same person?",
    "answer": "Organismal identity is sustained by continuous somatic pattern, genetic informational coding, and neural structural continuity rather than static atomic material.",
    "explanation": "Biological living systems are dissipative open structures; form and identity persist through continuous metabolic turnover and homeostatic continuity.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-502",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Crocodile Paradox, a crocodile promises to return a stolen textbook if the student predicts correctly what the crocodile will do. If the student answers 'You will keep the book', what must happen?",
    "answer": "A self-contradictory logical deadlock occurs where any physical action taken by the crocodile violates its premise.",
    "explanation": "Returning the book makes the prediction false (justifying keeping it), while keeping it makes the prediction true (requiring its return), generating an insolubilia.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-503",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In an agricultural inspection depot in Tema, a diagnostic test for aflatoxin fungal contamination is 95% sensitive and 95% specific. If 1 in 1,000 grain sacks is truly contaminated, what is the probability that a sack testing positive is actually tainted?",
    "answer": "The probability is less than 2% (approx 1.86%).",
    "explanation": "In 100,000 sacks, 100 are contaminated (95 test positive) and 99,900 are clean (approx 4,995 false positives). True positives are 95 / (95 + 4995) ≈ 1.86%. This illustrates Bayes' theorem with rare base rates.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-504",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In Einstein's thought experiment on equivalence, can an observer sealed inside a closed elevator with no windows tell the difference between resting on Earth's surface and accelerating through deep space at 9.8 m/s²?",
    "answer": "No, local gravitational effects are completely indistinguishable from inertial acceleration.",
    "explanation": "The Equivalence Principle of General Relativity establishes that gravitational mass is identical to inertial mass, forming the foundation of curved spacetime theory.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-505",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "Consider the sentence: 'The following statement is true. The preceding statement is false.' What truth value can formal classical logic assign to this pair?",
    "answer": "Neither statement can be assigned a consistent classical truth value because they generate an infinite cyclic contradiction.",
    "explanation": "This paired variation of the Liar Paradox creates an undecidable semantic oscillation where assuming truth forces falsehood, and assuming falsehood forces truth.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-506",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "A coin is tossed until the sequence Heads-Heads (HH) appears, which takes on average 6 flips. Another coin is tossed until Heads-Tails (HT) appears. Does HT have the same expected average number of flips as HH?",
    "answer": "No, HT takes an average of only 4 flips, whereas HH takes 6 flips.",
    "explanation": "If HH fails on the second flip (HT), the player must restart from scratch. If HT fails on the second flip (HH), the second Head already serves as the first step toward the next attempt.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-507",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "If you submerge a sealed plastic bottle containing air into deep ocean water, why does its buoyant force decrease as it sinks deeper?",
    "answer": "Hydrostatic pressure compresses the bottle and reduces its physical volume, displacing less fluid mass.",
    "explanation": "Buoyancy equals the weight of displaced fluid (F_b = ρ V g). High water pressure at depth compresses flexible gas containers, decreasing volume V and reducing buoyant lift.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-508",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Toxin Puzzle, a billionaire offers 1,000,000 Cedis at midnight if at 9:00 PM you form a genuine intention to drink a harmless non-lethal nauseating toxin tomorrow, though you need not actually drink it. Can you win?",
    "answer": "It is rationally difficult to form a genuine intention when you know in advance that fulfilling the intended action is completely unnecessary to receive the reward.",
    "explanation": "Gavin Kavka's toxin puzzle demonstrates that rational agents cannot freely manipulate their own genuine intentions without rational motivation for the execution of the act itself.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-509",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a hospital maternity ward in Kumasi, 3 babies are born. What is the probability that all 3 are of the exact same gender, assuming male and female births are equally likely?",
    "answer": "The probability is 1/4 (25%).",
    "explanation": "There are 2³ = 8 equally likely gender outcomes: {BBB, BBG, BGB, BGG, GBB, GBG, GGB, GGG}. Only 2 outcomes (BBB and GGG) feature identical genders: 2/8 = 1/4.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-510",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Zeno's Arrow Paradox, at every single instantaneous moment in time, an arrow flying through the air occupies a space exactly equal to its own dimensions and is therefore stationary. How does the arrow ever move?",
    "answer": "Motion is a continuous functional mapping of position across elapsed intervals of time, not a static property of isolated zero-duration instants.",
    "explanation": "Calculus resolves the paradox: instantaneous velocity is defined as the limit of displacement over elapsed time (v = lim(Δt → 0) Δx / Δt), rather than motion occurring within an isolated point in time.",
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
  },
  {
    "id": "tt-case-nov-201",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi examine a baobab tree seedling growing near the school gate. Each makes a claim.",
    "question": "Which pupil states a verifiable FACT rather than a subjective opinion?",
    "options": [
      "The baobab seedling is the most beautiful plant in the school garden.",
      "Baobab tree trunks store water to survive dry savanna seasons.",
      "Planting baobab trees is much more fun than planting mango trees.",
      "Green leaves look friendlier than dry brown bark."
    ],
    "correctAnswer": "Baobab tree trunks store water to survive dry savanna seasons.",
    "explanation": "Botanical water storage in trunk tissues is a scientifically proven fact. Beauty and enjoyment are personal opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-202",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A yellow marker was borrowed from the teacher's table during lunch. The teacher finds yellow stains on a student's workbook page.",
    "question": "Which clue proves the student used the yellow marker on that workbook?",
    "options": [
      "The workbook was placed on a wooden shelf.",
      "The pages smell like fresh rain.",
      "Yellow ink matching the exact shade was used to highlight spelling words in that book.",
      "The workbook has a red plastic cover."
    ],
    "correctAnswer": "Yellow ink matching the exact shade was used to highlight spelling words in that book.",
    "explanation": "Direct physical traces of the identical colored ink on the student's assignment provide conclusive proof of usage.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-203",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A bowl of water left outside on a concrete table under the blazing midday sun in Tamale was half empty by 4:00 PM.",
    "question": "What is the direct physical cause for the missing water?",
    "options": [
      "Solar heat caused liquid water molecules to evaporate into water vapor.",
      "The concrete table soaked all the water through the bottom of the bowl.",
      "The wind carried the plastic bowl away.",
      "The water turned into solid ice cubes."
    ],
    "correctAnswer": "Solar heat caused liquid water molecules to evaporate into water vapor.",
    "explanation": "Heat energy from direct sunlight provides latent heat of vaporization, turning liquid water into airborne vapor.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-204",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Kweku woke up at 6:00 AM, brushed his teeth at 6:15 AM, ate breakfast at 6:45 AM, and arrived at school at 7:30 AM. He dropped his toothbrush on the bathroom floor.",
    "question": "At what time did Kweku drop his toothbrush?",
    "options": [
      "At 7:30 AM upon reaching school",
      "At 6:45 AM while eating porridge",
      "At 6:15 AM while brushing his teeth",
      "At 8:00 AM during morning assembly"
    ],
    "correctAnswer": "At 6:15 AM while brushing his teeth",
    "explanation": "Toothbrushes are handled during brushing. 6:15 AM is the only timeline slot matching the activity.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-205",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A wet paw print with four toe pads and non-retractable claw marks was found near the kitchen water bucket.",
    "question": "Which animal made this print in the mud?",
    "options": [
      "A domestic goat with split hooves",
      "A pet cat whose claws remain retracted when walking",
      "A local domestic dog whose claws leave distinct indentations",
      "A rooster with three forward scaly bird toes"
    ],
    "correctAnswer": "A local domestic dog whose claws leave distinct indentations",
    "explanation": "Canines (dogs) have four padded toes with non-retractable claws that always imprint in mud, unlike felines whose claws retract.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-206",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "During an ICT lesson, pupils discuss computers and mobile phones.",
    "question": "Which of these statements is an objective FACT?",
    "options": [
      "Keyboards with blue letters are much cooler than black ones.",
      "Computer monitors use electrical energy to display images.",
      "Playing computer games is more educational than reading storybooks.",
      "Laptops are nicer to carry than spiral notebooks."
    ],
    "correctAnswer": "Computer monitors use electrical energy to display images.",
    "explanation": "Electrical power conversion to illuminate screens is a testable physical fact. Coolness and preference are subjective.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-207",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A student blows into a whistle during physical education class, producing a loud, piercing sound across the field.",
    "question": "What is the physical cause of the whistling sound?",
    "options": [
      "Vibrations created in the air column as forced air splits across the whistle edge.",
      "The plastic shell of the whistle absorbing sunlight.",
      "The ground reacting to the student's running shoes.",
      "The whistle changing color due to air pressure."
    ],
    "correctAnswer": "Vibrations created in the air column as forced air splits across the whistle edge.",
    "explanation": "Sound is produced by mechanical acoustic vibrations. Rushing air across the edge sets up standing wave oscillations.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-208",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "A rain shower started in Sunyani at 1:00 PM and ended at 2:30 PM. At 1:30 PM, Abena put her white sneakers out on the open grass.",
    "question": "What was the condition of Abena's sneakers at 2:00 PM?",
    "options": [
      "They were completely dry and spotless.",
      "They were soaked with rainwater because the storm was ongoing.",
      "They were frozen in ice.",
      "They had blown away into the stratosphere."
    ],
    "correctAnswer": "They were soaked with rainwater because the storm was ongoing.",
    "explanation": "The shoes were placed outside during an active rain event (1:00 PM to 2:30 PM), so at 2:00 PM they were wet.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-209",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A teacher finds a piece of chalk snapped into three pieces on the floor. White chalk powder dusts the hem of Kwabena's shorts.",
    "question": "What does the chalk dust on Kwabena's shorts suggest to the detective?",
    "options": [
      "Kwabena was drinking milk in the cafeteria.",
      "Kwabena had direct physical contact with the chalk around the time it broke.",
      "Kwabena was sweeping leaves in the mango orchard.",
      "Kwabena was playing football in damp red mud."
    ],
    "correctAnswer": "Kwabena had direct physical contact with the chalk around the time it broke.",
    "explanation": "Locard's exchange principle shows that physical contact transfers residue: the white calcium carbonate dust links him to the broken chalk.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-210",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils discuss foods commonly grown in the Ashanti and Eastern regions of Ghana.",
    "question": "Which statement is an indisputable agricultural FACT?",
    "options": [
      "Cassava tubers contain dietary carbohydrates.",
      "Fufu is far more enjoyable than banku.",
      "Plantains should always be fried rather than boiled.",
      "Cocoyam leaves make the most delicious stew in West Africa."
    ],
    "correctAnswer": "Cassava tubers contain dietary carbohydrates.",
    "explanation": "The biochemical composition of cassava tubers is a verifiable scientific fact, whereas food preference is subjective.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-201",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A laboratory scale went missing from the science store room between 4:00 PM and 4:30 PM on Thursday. Suspect Kofi claims he was in the school library reading under the fluorescent lights.",
    "question": "Which clue dismantles Kofi's alibi?",
    "options": [
      "The librarian logged that the library was locked and closed all Thursday afternoon for pest fumigation.",
      "Kofi borrowed a mathematics textbook on Wednesday morning.",
      "The science store room has an iron padlock.",
      "The laboratory scale weighs 2.5 kilograms."
    ],
    "correctAnswer": "The librarian logged that the library was locked and closed all Thursday afternoon for pest fumigation.",
    "explanation": "An official record verifying that the library was locked and fumigated makes his presence there impossible.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-202",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A brand of imported sports sneakers publishes a survey: '98% of professional sprinters run faster in our shoes!' Fine print reveals they only surveyed 10 athletes on the company's payroll.",
    "question": "What is the critical bias present in this advertisement?",
    "options": [
      "The survey took place on an outdoor asphalt track.",
      "Financial compensation creates self-interest bias and the sample of 10 paid athletes is cherry-picked.",
      "Running shoes have rubber soles that grip running tracks.",
      "Sprinters run 100-meter races in under 12 seconds."
    ],
    "correctAnswer": "Financial compensation creates self-interest bias and the sample of 10 paid athletes is cherry-picked.",
    "explanation": "Paid company spokespeople represent a financial conflict of interest, making their product endorsements biased.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-203",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A batch of dough was mixed at 8:00 AM, set to rise until 9:30 AM, baked until 10:15 AM, and left to cool. A baker noticed the oven thermostat broke while loaves were actively baking.",
    "question": "Between what times did the oven thermostat malfunction?",
    "options": [
      "Between 7:00 AM and 8:00 AM before mixing",
      "Between 8:00 AM and 9:30 AM while rising",
      "Between 9:30 AM and 10:15 AM during baking",
      "After 11:00 AM while bread was in display glass"
    ],
    "correctAnswer": "Between 9:30 AM and 10:15 AM during baking",
    "explanation": "Baking occurred strictly between 9:30 AM and 10:15 AM according to the schedule.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-204",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A student in Takoradi tastes one green orange from a market crate and finds it sour. He announces to the school: 'Every single orange grown in the Western Region is sour.'",
    "question": "What logical flaw did the student commit?",
    "options": [
      "He assumed the quality of an entire regional harvest based on a single unrepresentative specimen.",
      "He forgot that oranges contain citric acid.",
      "He failed to peel the orange with a kitchen knife.",
      "He tested an orange grown during the minor rainy season."
    ],
    "correctAnswer": "He assumed the quality of an entire regional harvest based on a single unrepresentative specimen.",
    "explanation": "Extrapolating a conclusion across millions of oranges from an N=1 sample is an unwarranted hasty generalization.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-205",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "Investigators examine a broken wooden fence in a village near Mole National Park. Large gray hairs and deep circular footprints measuring 40 cm across with five toe pads are found.",
    "question": "Which animal left these forensic traces?",
    "options": [
      "A stray hunting dog",
      "An African bush elephant",
      "A baboon troop",
      "A roan antelope"
    ],
    "correctAnswer": "An African bush elephant",
    "explanation": "40-centimeter round columnar footprints and coarse thick gray bristles are distinct anatomical markers of an elephant.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-206",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "After a community cleared all the mangroves along a coastal lagoon in Keta, severe beach erosion and tidal flooding rapidly destroyed nearby footpaths.",
    "question": "Why did clearing the mangroves lead directly to accelerated coastal erosion?",
    "options": [
      "Mangrove tree roots anchor shoreline sediment and absorb incoming wave energy.",
      "Mangrove leaves attract rainclouds from the Atlantic Ocean.",
      "Local fishermen caught fewer tilapia in the deep sea.",
      "The sand along the beach grew hotter under the sun."
    ],
    "correctAnswer": "Mangrove tree roots anchor shoreline sediment and absorb incoming wave energy.",
    "explanation": "Mangrove root systems physically bind coastal soils and dissipate wave kinetic energy, preventing coastal erosion.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-207",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A generator was drained of diesel at a workshop in Cape Coast at 1:00 PM on Tuesday. Suspect Kwadwo claims he was watching the total solar eclipse from the beach at 1:00 PM.",
    "question": "What astronomical fact destroys Kwadwo's alibi?",
    "options": [
      "No solar eclipse occurred anywhere on Earth on that calendar date.",
      "Diesel fuel produces black exhaust fumes when burned.",
      "The beach in Cape Coast faces the Atlantic Ocean.",
      "Generators convert mechanical energy into electricity."
    ],
    "correctAnswer": "No solar eclipse occurred anywhere on Earth on that calendar date.",
    "explanation": "Solar eclipses are documented astronomical events. Claiming an unrecorded eclipse proves the alibi is fabricated.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-208",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A mobile network provider runs a poll on its own website asking: 'Which cellular network is the most reliable in Ghana?' The network itself wins 92% of the vote.",
    "question": "Why is this poll result statistically untrustworthy?",
    "options": [
      "Mobile phones operate on radio frequency waves.",
      "The sample suffers from selection bias because mostly loyal users visiting their own website participated.",
      "Websites require data bundles to load on smartphones.",
      "Ghana has multiple telecommunication companies."
    ],
    "correctAnswer": "The sample suffers from selection bias because mostly loyal users visiting their own website participated.",
    "explanation": "Hosting a poll on an organization's own portal introduces severe voluntary response and selection bias.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-209",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A headteacher surveys two students in Basic 5 regarding the school lunch menu. Both students say they dislike cabbage stew. The headteacher announces: 'No student in our 600-pupil school likes cabbage stew.'",
    "question": "What is the key methodological failure?",
    "options": [
      "Cabbage stew contains vitamin C and fiber.",
      "A sample of 2 out of 600 students (0.33%) is statistically inadequate to represent school-wide preferences.",
      "The survey took place before Friday sports afternoon.",
      "The headteacher should have surveyed teachers instead of students."
    ],
    "correctAnswer": "A sample of 2 out of 600 students (0.33%) is statistically inadequate to represent school-wide preferences.",
    "explanation": "Surveying only 2 students out of a population of 600 creates an unrepresentative sample with a massive margin of error.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-210",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A document signed with blue fountain pen ink was altered. Chemical testing of the added numbers reveals iron gall ink, while the original text was written with synthetic dye ink.",
    "question": "What does this chemical discrepancy prove?",
    "options": [
      "The paper was manufactured from bamboo pulp.",
      "The added text was written with a completely different ink formulation, confirming document forgery.",
      "The document was stored in a damp drawer.",
      "The writer was left-handed."
    ],
    "correctAnswer": "The added text was written with a completely different ink formulation, confirming document forgery.",
    "explanation": "Different chemical ink formulations prove that alterations were introduced using a separate writing instrument.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-201",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A nationwide public health study found that households that own more air conditioning units have higher average electricity bills. A researcher concludes: 'Air conditioners force utility companies to raise electricity tariff rates.'",
    "question": "What is the logical flaw in the researcher's conclusion?",
    "options": [
      "Air conditioners reduce humidity in tropical climates.",
      "Higher power consumption directly increases total bills under existing rates; the appliances consume power rather than setting utility rates.",
      "Utility companies generate electricity using thermal power plants.",
      "Household electricity meters measure kilowatt-hours."
    ],
    "correctAnswer": "Higher power consumption directly increases total bills under existing rates; the appliances consume power rather than setting utility rates.",
    "explanation": "Running high-wattage air conditioners increases kilowatt-hour usage, driving up the bill without changing the rate itself.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-202",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A trending social media post claims: 'NASA confirms an asteroid will strike Lake Volta next Tuesday at 3:15 PM, evaporating all water in Ghana! Share immediately with 20 groups!'",
    "question": "Which set of indicators proves this post is fraudulent clickbait?",
    "options": [
      "It names a real lake located in the Eastern Region of Ghana.",
      "It uses hyperbolic apocalyptic claims, artificial urgency, and demands viral forwarding without links to NASA peer databases.",
      "NASA employs astrophysicists and operates space telescopes.",
      "Asteroids orbit the Sun within the solar system."
    ],
    "correctAnswer": "It uses hyperbolic apocalyptic claims, artificial urgency, and demands viral forwarding without links to NASA peer databases.",
    "explanation": "Sensationalist claims, chain-letter share quotas, and unverified attribution to agencies are key signs of misinformation.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-203",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "In a municipal council debate in Kumasi, a planner suggests installing solar streetlights. An opponent retorts: 'How can you trust someone whose own house had a leaking roof last year?'",
    "question": "Which logical fallacy did the opponent commit?",
    "options": [
      "Ad Hominem (attacking the person's private life instead of addressing their argument)",
      "Begging the Question (circular reasoning)",
      "Post Hoc Ergo Propter Hoc",
      "False Dilemma"
    ],
    "correctAnswer": "Ad Hominem (attacking the person's private life instead of addressing their argument)",
    "explanation": "An Ad Hominem fallacy attacks personal traits or unrelated circumstances rather than evaluating the merits of the proposal.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-204",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A white powder collected from an illegal mining site suspected of leaching gold is dissolved in water and tested with silver nitrate solution (AgNO₃). A curdy white precipitate forms that dissolves in dilute ammonia.",
    "question": "What halide anion is positively identified by this reaction?",
    "options": [
      "Iodide (I⁻)",
      "Chloride (Cl⁻)",
      "Sulfate (SO₄²⁻)",
      "Bromide (Br⁻)"
    ],
    "correctAnswer": "Chloride (Cl⁻)",
    "explanation": "Silver nitrate reacts with chloride ions to precipitate white silver chloride (AgCl), which dissolves readily in dilute aqueous ammonia.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-205",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A private clinic reports: '50% of our clinical trial patients experienced full symptom relief!' Investigation reveals the clinic enrolled only 2 patients in total, and 1 recovered naturally.",
    "question": "Why is the clinic's published percentage misleading?",
    "options": [
      "Clinical trials must be conducted in public university hospitals.",
      "Reporting percentages on an extremely small sample (N=2) conceals the lack of statistical power and high margin of error.",
      "Patients should never be given pharmaceutical placebos.",
      "Symptoms must be measured in numerical units."
    ],
    "correctAnswer": "Reporting percentages on an extremely small sample (N=2) conceals the lack of statistical power and high margin of error.",
    "explanation": "Converting 1 out of 2 into 50% gives a misleading impression of efficacy while obscuring an inadequate sample size.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-206",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A debater asserts: 'Either we completely shut down all internet access across schools, or students will fail every single BECE examination and never learn to read!'",
    "question": "What logical fallacy is demonstrated by this statement?",
    "options": [
      "False Dilemma (bifurcation, ignoring intermediate solutions)",
      "Appeal to Authority",
      "Genetic Fallacy",
      "Equivocation"
    ],
    "correctAnswer": "False Dilemma (bifurcation, ignoring intermediate solutions)",
    "explanation": "A False Dilemma artificially restricts a multifaceted situation into two extreme binary outcomes while ignoring balanced middle options.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-207",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral video features a prominent government official announcing a free smartphone distribution to all citizens. Lip-sync analysis reveals robotic speech timing, mismatched teeth textures, and flickering edge artifacts around the face.",
    "question": "What technology was used to produce this deceptive media?",
    "options": [
      "Deepfake AI synthetic video generation",
      "Standard high-definition video camera zoom",
      "Closed-circuit analog security recording",
      "Infrared thermal imaging"
    ],
    "correctAnswer": "Deepfake AI synthetic video generation",
    "explanation": "Facial boundary flickering, digital texture smoothing, and desynchronized speech phonemes are classic signs of AI deepfakes.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-208",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Data from Accra reveals a strong positive correlation between the number of umbrellas carried by pedestrians and the number of vehicle traffic delays on the George Walker Bush Highway.",
    "question": "What common factor accounts for this correlation?",
    "options": [
      "Pedestrians using umbrellas distract commercial minibus drivers.",
      "Rainfall independently prompts pedestrians to carry umbrellas while slowing traffic due to wet roads and poor visibility.",
      "Traffic delays cause rainfall from the atmosphere.",
      "Umbrellas create physical blockades on overhead highway ramps."
    ],
    "correctAnswer": "Rainfall independently prompts pedestrians to carry umbrellas while slowing traffic due to wet roads and poor visibility.",
    "explanation": "Rain acts as an underlying confounding variable that simultaneously increases umbrella usage and road delays.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-209",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A graph published by an energy company shows a bar chart of solar output increasing from 48% to 50%. The vertical Y-axis begins at 47% instead of 0%, making the 50% bar appear five times taller than the 48% bar.",
    "question": "What deceptive graphic technique was employed here?",
    "options": [
      "Truncated graph axis (suppressed zero baseline) to exaggerate minor numerical differences visually.",
      "Using 3D drop shadows on bar edges.",
      "Plotting categorical data on a Cartesian plane.",
      "Failing to convert percentages to degrees of a circle."
    ],
    "correctAnswer": "Truncated graph axis (suppressed zero baseline) to exaggerate minor numerical differences visually.",
    "explanation": "Truncating the vertical axis baseline distorts geometric proportions, making a 2% change look like a huge surge.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-210",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "Soil around an industrial site suspected of toxic battery dumping is acidified and treated with potassium iodide (KI). A brilliant canary-yellow precipitate forms that dissolves upon boiling in water and recrystallizes into sparkling golden crystals on cooling.",
    "question": "What toxic heavy metal cation is confirmed by this lead iodide reaction?",
    "options": [
      "Lead (Pb²⁺)",
      "Calcium (Ca²⁺)",
      "Sodium (Na⁺)",
      "Iron (Fe³⁺)"
    ],
    "correctAnswer": "Lead (Pb²⁺)",
    "explanation": "Lead(II) ions react with iodide ions to yield bright yellow lead(II) iodide (PbI₂), famous for forming shimmering 'golden rain' crystals upon cooling.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-301",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi discuss fresh fruits sold outside the school gate.",
    "question": "Which of these statements is a verifiable scientific FACT?",
    "options": [
      "Mangoes contain vitamins and dietary fiber.",
      "Pawpaw tastes much better than sweet orange.",
      "Pineapples are the prettiest fruits in the market.",
      "Watermelon slices look much nicer on blue plates."
    ],
    "correctAnswer": "Mangoes contain vitamins and dietary fiber.",
    "explanation": "Nutritional content is a chemically proven biological fact, while taste preferences and appearance are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-302",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective finds a blue ink mark on the wooden desk. Suspect A has pencil shavings, Suspect B has dry chalk on his palms, Suspect C holds a leaking blue ballpoint pen, and Suspect D has red paint on her fingers.",
    "question": "Which suspect left the blue ink mark?",
    "options": [
      "Suspect A",
      "Suspect C holds a leaking blue ballpoint pen",
      "Suspect B",
      "Suspect D"
    ],
    "correctAnswer": "Suspect C holds a leaking blue ballpoint pen",
    "explanation": "A leaking blue ballpoint pen provides the direct physical source matching the blue ink smudge.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-303",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "Kofi plants a bean seed in a plastic cup with dry sand and puts it inside a completely dark cupboard without adding any water.",
    "question": "Why does the bean seed fail to germinate after two weeks?",
    "options": [
      "Seeds require water and warmth to activate enzymatic germination.",
      "The sand was too clean to hold seeds.",
      "The cupboard door was made of timber wood.",
      "The seed wanted to sleep during the term."
    ],
    "correctAnswer": "Seeds require water and warmth to activate enzymatic germination.",
    "explanation": "Imbibition of water is the essential physiological trigger required for seeds to break dormancy.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-304",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Assembly began at 7:30 AM and ended at 8:00 AM. Class lessons ran from 8:00 AM to 10:00 AM. Break time was from 10:00 AM to 10:30 AM. Yaw bought roasted groundnuts at 10:15 AM.",
    "question": "During which school activity did Yaw buy the groundnuts?",
    "options": [
      "During assembly",
      "During morning class lessons",
      "During break time",
      "After school dismissal"
    ],
    "correctAnswer": "During break time",
    "explanation": "10:15 AM falls directly within the designated break period (10:00 AM to 10:30 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-305",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils discuss weather phenomena during the harmattan season.",
    "question": "Which statement about the harmattan is an objective meteorological FACT?",
    "options": [
      "The harmattan wind is boring and dull.",
      "Harmattan winds carry dry, dusty continental air from the Sahara Desert.",
      "Mornings in harmattan feel much nicer than rainy mornings.",
      "Dust haze makes the sky look ugly."
    ],
    "correctAnswer": "Harmattan winds carry dry, dusty continental air from the Sahara Desert.",
    "explanation": "The northeast trade winds transporting Saharan dust across West Africa is a proven geographical fact.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-306",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A wet footprint showing five toes without any shoe tread pattern was stamped on the dry floor tiles near the washroom.",
    "question": "Who made this footprint?",
    "options": [
      "Someone wearing leather boots",
      "Someone walking barefoot with wet feet",
      "A stray sheep wandering from the field",
      "Someone wearing rubber sandals"
    ],
    "correctAnswer": "Someone walking barefoot with wet feet",
    "explanation": "Distinct individual toe impressions with no sole patterning confirm a bare human foot.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-307",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "An inflated bicycle tire left out in the blazing afternoon sun suddenly pops with a loud bang without touching any sharp nails.",
    "question": "What caused the bicycle tire to pop?",
    "options": [
      "Heat caused the air inside to expand and increase pressure until the rubber burst.",
      "The bright sunlight dissolved the rubber tire.",
      "Termites crawled over the rim and chewed the valve.",
      "Cold wind caused the air inside to collapse."
    ],
    "correctAnswer": "Heat caused the air inside to expand and increase pressure until the rubber burst.",
    "explanation": "Heating trapped gas causes thermal expansion and pressure buildup until structural limits are exceeded.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-308",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Ama put on her clean socks at 6:30 AM, walked through muddy puddles at 7:15 AM, and sat at her school desk at 7:45 AM. Her teacher noticed mud on her socks at 8:00 AM.",
    "question": "When did Ama's socks get muddy?",
    "options": [
      "At 6:30 AM while putting them on at home",
      "At 7:15 AM while walking through puddles",
      "At 8:00 AM during class registration",
      "At 9:00 AM during math class"
    ],
    "correctAnswer": "At 7:15 AM while walking through puddles",
    "explanation": "Stepping into puddles at 7:15 AM is the event that transferred mud to the socks before inspection at 8:00 AM.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-309",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A slice of sweet bread left on the staffroom table has tiny teeth marks and a tail trail left in fine flour dust on the counter.",
    "question": "Which animal investigated the bread?",
    "options": [
      "A house mouse",
      "A barking dog",
      "A crow from the tree",
      "A grasshopper"
    ],
    "correctAnswer": "A house mouse",
    "explanation": "Small incisor bite marks and a dragging tail track in dust are diagnostic traces of rodents like mice.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-310",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends talk about domestic farm animals kept in Ghanaian towns.",
    "question": "Which of these statements represents a verifiable FACT?",
    "options": [
      "Goats are mammals that nurse their kids with milk.",
      "Baby goats are cuter than baby chicks.",
      "Goats are stubborn and difficult to herd.",
      "Goat meat makes the best light soup."
    ],
    "correctAnswer": "Goats are mammals that nurse their kids with milk.",
    "explanation": "Mammalian classification and lactation are biological facts, while cuteness and taste are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-301",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A box of new football jerseys went missing from the sports shed in Sunyani on Wednesday between 2:00 PM and 3:00 PM. Suspect Kwame claims he was watching a live afternoon European football match on television at his uncle's house.",
    "question": "What fact breaks Kwame's alibi?",
    "options": [
      "The football jerseys were dyed green and white.",
      "The European football leagues only kick off evening matches after 7:00 PM GMT.",
      "The sports shed door was made of wooden boards.",
      "Kwame plays as a defender for the school team."
    ],
    "correctAnswer": "The European football leagues only kick off evening matches after 7:00 PM GMT.",
    "explanation": "Time zones and league broadcasting schedules confirm there are no live European matches at 2:00 PM GMT on Wednesdays.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-302",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial bakery issues a brochure stating: 'Children who eat three slices of our sugar-frosted white bread daily memorize poems three times faster!'",
    "question": "What is the primary motive behind this bakery's claim?",
    "options": [
      "To teach children poetry recitation techniques.",
      "To increase corporate bread sales and boost profits through biased health claims.",
      "To help children improve their English exam marks.",
      "To encourage pupils to eat local cassava dishes."
    ],
    "correctAnswer": "To increase corporate bread sales and boost profits through biased health claims.",
    "explanation": "Commercial manufacturers have a direct financial incentive to market exaggerated claims that drive product sales.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-303",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A school bus leaves the station at 6:45 AM, picks up students at Stop A at 7:05 AM, Stop B at 7:20 AM, and arrives at school at 7:40 AM. An umbrella was left on the bus by a student who boarded at Stop A and got off at Stop B.",
    "question": "Between what times was the student with the umbrella on the bus?",
    "options": [
      "Between 6:45 AM and 7:05 AM",
      "Between 7:05 AM and 7:20 AM",
      "Between 7:20 AM and 7:40 AM",
      "After 8:00 AM during lessons"
    ],
    "correctAnswer": "Between 7:05 AM and 7:20 AM",
    "explanation": "The student boarded at Stop A (7:05 AM) and departed at Stop B (7:20 AM), framing their ride to that exact interval.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-304",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A pupil tests a solar battery torch on one rainy morning and finds it ran out of charge in 15 minutes. He writes: 'Solar batteries never last more than 15 minutes in Ghana.'",
    "question": "Why is this conclusion invalid?",
    "options": [
      "Solar batteries only charge on Sundays.",
      "Testing a single battery on an overcast day is an insufficient sample size under poor charging conditions.",
      "Flashlight bulbs do not use electrical energy.",
      "Rainwater prevents flashlights from turning on."
    ],
    "correctAnswer": "Testing a single battery on an overcast day is an insufficient sample size under poor charging conditions.",
    "explanation": "Drawing conclusions from a single trial under atypical charging conditions ignores statistical reliability and variable controls.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-305",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A padlock on a garden tool shed was forced open. Investigators find traces of blue paint on the gouged iron latch matching the chipped paint on a crowbar found behind the workshop.",
    "question": "What does this evidence indicate?",
    "options": [
      "The crowbar was manufactured in Germany.",
      "The crowbar with matching paint transferred residue during forceful contact with the latch.",
      "The padlock was damaged by rainwater rust.",
      "The shed was painted blue last year."
    ],
    "correctAnswer": "The crowbar with matching paint transferred residue during forceful contact with the latch.",
    "explanation": "Paint transfer analysis links the tool directly to the mechanical leverage marks on the forced lock.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-306",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "When builders dug up the grass lawn and replaced it with solid concrete paving, the nearby classroom flooded during the next heavy rainfall.",
    "question": "What caused the increased flooding after paving?",
    "options": [
      "Concrete absorbs more rainwater than porous grass soil.",
      "Impermeable concrete prevents rain from infiltrating the soil, generating heavy surface runoff.",
      "Grass attracts more rainclouds from the Atlantic Ocean.",
      "The concrete made the air cooler."
    ],
    "correctAnswer": "Impermeable concrete prevents rain from infiltrating the soil, generating heavy surface runoff.",
    "explanation": "Replacing permeable vegetative cover with impermeable concrete eliminates infiltration, drastically raising surface runoff volume.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-307",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A radio went missing from the teachers' common room on Friday at 11:30 AM in Cape Coast. Suspect Esi claims she was outside drawing a tree shadow pointing directly toward the South.",
    "question": "Why is Esi's shadow-drawing alibi impossible?",
    "options": [
      "Pencils do not work outside under sunlight.",
      "In Cape Coast (Northern Hemisphere tropics), midday sun casts shadows toward the North, not the South.",
      "Trees lose their leaves during Friday mornings.",
      "Radios cannot play music without electricity."
    ],
    "correctAnswer": "In Cape Coast (Northern Hemisphere tropics), midday sun casts shadows toward the North, not the South.",
    "explanation": "Solar positioning dictates shadow geometry: solar transit from the south casts shadows pointing north, debunking her claim.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-308",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A company selling plastic water tanks publishes a report stating: 'Clay storage pots are dangerous and modern plastic tanks are the only safe way to store water.'",
    "question": "What bias should an apprentice investigator spot?",
    "options": [
      "Commercial interest bias designed to discredit traditional competitors and force sales of plastic tanks.",
      "Clay pots are made by shaping natural wet earth.",
      "Water tanks are installed on concrete platforms.",
      "Rainwater harvesting is practiced in West Africa."
    ],
    "correctAnswer": "Commercial interest bias designed to discredit traditional competitors and force sales of plastic tanks.",
    "explanation": "The business has a clear profit incentive to exaggerate flaws in traditional alternatives.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-309",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A pupil visits two houses in his neighborhood and finds both families own a pet cat. He announces: '100% of all households in Ghana own pet cats.'",
    "question": "What is the flaw in this conclusion?",
    "options": [
      "Cats are carnivorous mammals.",
      "Extrapolating national demographic statistics from two local homes is a hasty generalization with an unrepresentative sample.",
      "Households in Ghana often keep watchdogs.",
      "The survey was done on a Saturday afternoon."
    ],
    "correctAnswer": "Extrapolating national demographic statistics from two local homes is a hasty generalization with an unrepresentative sample.",
    "explanation": "A sample size of two houses is statistically meaningless when generalizing across an entire country.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-310",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A letter was dropped in a damp forest. The handwritten note shows feathery ink spreading outward through capillary action across the paper fibers.",
    "question": "What does the feathering ink tell the investigator?",
    "options": [
      "The writer was angry when writing.",
      "The paper was subjected to moisture or was highly absorbent and un-sized, causing liquid bleeding.",
      "The pen contained invisible lemon juice.",
      "The note was written using a laser printer."
    ],
    "correctAnswer": "The paper was subjected to moisture or was highly absorbent and un-sized, causing liquid bleeding.",
    "explanation": "Feathering occurs when liquid ink diffuses along cellulose paper fibers due to moisture exposure or low sizing.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-301",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A municipal data study in Takoradi reveals that neighborhoods with more street food stalls also report higher total foot traffic injuries.",
    "question": "What is the most likely confounding variable explaining this relationship?",
    "options": [
      "Street food contains hot peppers that blind pedestrians.",
      "Dense commercial pedestrian activity attracts food stalls and naturally increases pedestrian congestion and exposure to traffic.",
      "Food vendors intentionally trip passing shoppers.",
      "Eating food while walking impairs inner-ear vestibular balance."
    ],
    "correctAnswer": "Dense commercial pedestrian activity attracts food stalls and naturally increases pedestrian congestion and exposure to traffic.",
    "explanation": "Pedestrian volume is the common confounding cause that simultaneously attracts food vendors and raises foot traffic accident counts.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-302",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "An online blog post claims: 'Scientists at the University of Ghana discover that eating raw charcoal cures all forms of cancer in 24 hours! Government hiding truth!'",
    "question": "Which indicators prove this is dangerous medical misinformation?",
    "options": [
      "It mentions an accredited public university.",
      "It promises an overnight cure for complex diseases, invokes conspiracy censorship, and cites zero peer-reviewed clinical trials.",
      "Charcoal is used in traditional cooking stoves.",
      "Activated charcoal is used in clinical poison decontamination."
    ],
    "correctAnswer": "It promises an overnight cure for complex diseases, invokes conspiracy censorship, and cites zero peer-reviewed clinical trials.",
    "explanation": "Miracle cure claims, conspiracy framing ('government hiding truth'), and absence of clinical evidence are classic markers of fake health news.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-303",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "In a school council debate, an opponent argues: 'We cannot trust Kwame's proposal for science club funding because Kwame failed his term-one French quiz!'",
    "question": "Which logical fallacy is committed here?",
    "options": [
      "Ad Hominem (attacking Kwame's personal academic record instead of evaluating the funding proposal)",
      "Post Hoc Ergo Propter Hoc",
      "Straw Man Fallacy",
      "Appeal to Tradition"
    ],
    "correctAnswer": "Ad Hominem (attacking Kwame's personal academic record instead of evaluating the funding proposal)",
    "explanation": "Dismissing an argument by attacking the speaker's unrelated personal shortcoming is an ad hominem fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-304",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A clear liquid from an unlabelled bottle found in a chemistry prep room gives off gas bubbles when added to sodium carbonate (Na₂CO₃), and turns blue litmus paper bright red.",
    "question": "What chemical property does this liquid exhibit?",
    "options": [
      "It is a strong base containing hydroxide ions.",
      "It is an acid producing aqueous hydronium (H⁺) ions that liberate carbon dioxide gas from carbonates.",
      "It is a neutral hydrocarbon solvent.",
      "It is saturated sodium chloride solution."
    ],
    "correctAnswer": "It is an acid producing aqueous hydronium (H⁺) ions that liberate carbon dioxide gas from carbonates.",
    "explanation": "Acids turn blue litmus red and react with carbonates to liberate carbon dioxide gas (2H⁺ + CO₃²⁻ → H₂O + CO₂).",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-305",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "An advertising campaign states: 'Our coaching academy doubled student exam success rates!' Data reveals their student pass rate increased from 1% to 2%.",
    "question": "What statistical technique is being used to exaggerate the outcome?",
    "options": [
      "Presenting a 100% relative percentage increase to obscure a negligible 1% absolute increase.",
      "Calculating the median rather than the mean.",
      "Plotting data using scatter diagrams.",
      "Using standard deviation without variance."
    ],
    "correctAnswer": "Presenting a 100% relative percentage increase to obscure a negligible 1% absolute increase.",
    "explanation": "Touting 'doubled' or a 100% relative rise conceals the fact that absolute performance rose by only 1 percentage point.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-306",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A debater asserts: 'Nobody has ever conclusively proven that extraterrestrial microorganisms do not exist on Mars; therefore, Martian life definitely exists!'",
    "question": "What logical fallacy is present in this deduction?",
    "options": [
      "Appeal to Ignorance (Argumentum ad Ignorantiam)",
      "False Analogy",
      "Circular Reasoning",
      "Slippery Slope"
    ],
    "correctAnswer": "Appeal to Ignorance (Argumentum ad Ignorantiam)",
    "explanation": "Claiming that a proposition must be true simply because it has not yet been proven false is an appeal to ignorance.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-307",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A shared image claims to show a tsunami wave hitting the shores of Lake Volta in central Ghana. A meteorologist notes that Lake Volta is an inland freshwater reservoir with no tectonic ocean-trench subduction zones.",
    "question": "What geographical reality refutes this viral image?",
    "options": [
      "Lake Volta is an artificial inland reservoir lacking the oceanic seismic subduction mechanisms that produce tsunamis.",
      "Freshwater cannot form waves of any height.",
      "Rain clouds prevent tsunamis from striking land.",
      "Boats on Lake Volta travel at slow speeds."
    ],
    "correctAnswer": "Lake Volta is an artificial inland reservoir lacking the oceanic seismic subduction mechanisms that produce tsunamis.",
    "explanation": "True tsunamis require massive oceanic tectonic displacement, which cannot occur in an inland river basin reservoir.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-308",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A survey across several towns in Ghana finds that people who sleep with their shoes on are significantly more likely to wake up with headaches.",
    "question": "What common antecedent condition is the real cause?",
    "options": [
      "Rubber shoe soles release toxic neurotoxins into the feet overnight.",
      "Going to bed intoxicated or severely exhausted causes both sleeping without undressing and morning headaches.",
      "Headaches induce sleepwalking into shoes.",
      "Shoelaces compress blood circulation to the skull."
    ],
    "correctAnswer": "Going to bed intoxicated or severely exhausted causes both sleeping without undressing and morning headaches.",
    "explanation": "Severe intoxication or fatigue is the common cause that results in both sleeping in one's clothes and waking with a hangover or headache.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-309",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A company reports an average annual worker salary of 20,000 Cedis across 10 staff members. However, the managing director earns 155,000 Cedis while 9 employees earn 5,000 Cedis each.",
    "question": "Which metric should be used instead of the mean to reflect typical worker pay?",
    "options": [
      "The standard deviation",
      "The median, which is unaffected by extreme skewing outliers",
      "The maximum range",
      "The harmonic variance"
    ],
    "correctAnswer": "The median, which is unaffected by extreme skewing outliers",
    "explanation": "The median (5,000 Cedis) accurately represents the central tendency of skewed distributions with extreme high outliers.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-310",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A forensic analyst tests an unknown white crystalline powder seized at a warehouse. A flame test produces a persistent, intense golden-yellow flame.",
    "question": "What metal cation is positively identified by this flame emission?",
    "options": [
      "Potassium (K⁺)",
      "Sodium (Na⁺)",
      "Copper (Cu²⁺)",
      "Barium (Ba²⁺)"
    ],
    "correctAnswer": "Sodium (Na⁺)",
    "explanation": "The characteristic atomic emission spectrum of sodium yields an intense yellow flame at the 589 nm doublet line.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-401",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Accra inspect an African giant land snail crawling across the damp botanical garden wall.",
    "question": "Which of these statements is an objective biological FACT?",
    "options": [
      "Snails are the slimy and disgusting creatures of the forest.",
      "The snail carries an exoskeleton spiral shell made of calcium carbonate.",
      "Snails move much too slowly to be interesting pets.",
      "Watching snails crawl is more relaxing than watching birds fly."
    ],
    "correctAnswer": "The snail carries an exoskeleton spiral shell made of calcium carbonate.",
    "explanation": "The mineral composition and presence of a spiral calcium shell is a verifiable scientific fact, whereas disgust and relaxation value are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-402",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A teacher notices that someone drank the sweet orange juice from a cup on the shelf. The cup has a bright red circular lipstick smudge on its rim.",
    "question": "Who drank the orange juice?",
    "options": [
      "Master Kwesi, the sports master wearing track shoes",
      "Yaw, who was chewing sugarcane in the compound",
      "Madam Afua, who applied red cosmetic lipstick before assembly",
      "Esi, who was writing her spelling words with a green pencil"
    ],
    "correctAnswer": "Madam Afua, who applied red cosmetic lipstick before assembly",
    "explanation": "The red lipstick residue on the rim matches the cosmetic lipstick worn by Madam Afua, directly identifying the user.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-403",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A fresh loaf of butter bread left exposed on a damp kitchen counter for ten warm days developed fuzzy green and black spots all over its crust.",
    "question": "What is the physical cause of these fuzzy colored spots?",
    "options": [
      "Green grasshoppers hopped on the bread and left paint marks.",
      "Microscopic fungal spores in the air landed on the moist bread and germinated into mold colonies.",
      "The kitchen counter absorbed green pigment from sunlight.",
      "The baker added green pepper powder into the dough."
    ],
    "correctAnswer": "Microscopic fungal spores in the air landed on the moist bread and germinated into mold colonies.",
    "explanation": "Moisture and warm temperatures allow airborne fungal mold spores to colonize organic substrates like bread.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-404",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "The morning school bell rang at 7:15 AM. The class marched into assembly at 7:30 AM, concluded prayers at 7:55 AM, and began English class at 8:00 AM. Kofi dropped his library book under the assembly mango tree at 7:40 AM.",
    "question": "What was happening when Kofi dropped his library book?",
    "options": [
      "English class had already begun inside the classroom",
      "Pupils were actively assembled at morning prayers under the mango tree",
      "The morning school bell had not yet rung",
      "Pupils were eating lunch during afternoon break"
    ],
    "correctAnswer": "Pupils were actively assembled at morning prayers under the mango tree",
    "explanation": "7:40 AM falls squarely within the morning assembly duration (7:30 AM to 7:55 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-405",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends talk about the Atlantic Ocean coastline along Cape Coast.",
    "question": "Which of these statements is an indisputable geographical FACT?",
    "options": [
      "Ocean water has a high concentration of dissolved mineral salts like sodium chloride.",
      "The ocean is much more frightening than Lake Volta.",
      "Swimming in saltwater is more enjoyable than swimming in swimming pools.",
      "Seaside breezes smell far better than inland forest breezes."
    ],
    "correctAnswer": "Ocean water has a high concentration of dissolved mineral salts like sodium chloride.",
    "explanation": "The chemical salinity of seawater is an empirical fact, while fear, enjoyment, and smell preference are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-406",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Someone took a bite out of a ripe mango on the veranda. Two distinct pointed canine punctures are visible alongside four incisor impressions.",
    "question": "What kind of mouth made this bite mark?",
    "options": [
      "A human or mammalian carnivore/omnivore mouth with incisors and prominent canine teeth",
      "A domestic chicken with a toothless hard keratin beak",
      "A goat with only flat lower incisors and no upper front teeth",
      "A catfish with microscopic sandpaper-like tooth plates"
    ],
    "correctAnswer": "A human or mammalian carnivore/omnivore mouth with incisors and prominent canine teeth",
    "explanation": "Incisors paired with pointed canine teeth are characteristic of mammalian omnivores or humans, ruling out birds and herbivores lacking upper front teeth.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-407",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A student leaves an iron nail submerged in clean boiled water inside a test tube that is sealed with a layer of mineral oil on top. After three weeks, the nail has zero rust.",
    "question": "Why did the nail fail to form rust?",
    "options": [
      "Boiling expelled dissolved oxygen, and the oil barrier prevented atmospheric oxygen from contacting the iron.",
      "Iron cannot form rust when submerged under any liquid.",
      "The test tube glass reflected away all ambient light.",
      "Mineral oil chemically dissolves iron oxide overnight."
    ],
    "correctAnswer": "Boiling expelled dissolved oxygen, and the oil barrier prevented atmospheric oxygen from contacting the iron.",
    "explanation": "Rusting requires both water and oxygen simultaneously. Depriving the iron of oxygen prevents oxidation.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-408",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Kwabena ate his lunch at 12:00 PM, washed his plate at 12:20 PM, played football from 12:30 PM to 1:00 PM, and returned to class at 1:05 PM. He ripped his school shorts while diving for a goal.",
    "question": "Between what times did Kwabena rip his shorts?",
    "options": [
      "Between 11:30 AM and 12:00 PM",
      "Between 12:00 PM and 12:20 PM",
      "Between 12:30 PM and 1:00 PM",
      "After 2:00 PM during closing assembly"
    ],
    "correctAnswer": "Between 12:30 PM and 1:00 PM",
    "explanation": "Diving for a goal happened during his football game, which occurred between 12:30 PM and 1:00 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-409",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective enters a dark storage room and finds wet yellow sticky mud on the floor. Only one student has yellow mud on the bottom of their shoes.",
    "question": "What does this clue demonstrate?",
    "options": [
      "The student with matching yellow mud walked through the storage room after walking in yellow mud.",
      "The student was sleeping under a tree.",
      "The storage room floor was painted yellow.",
      "The mud was blown through the roof by the harmattan wind."
    ],
    "correctAnswer": "The student with matching yellow mud walked through the storage room after walking in yellow mud.",
    "explanation": "Locard's principle of contact trace evidence links the matching yellow mud from the student's footwear directly to the scene.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-410",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi examine a metal copper wire used in a simple battery circuit.",
    "question": "Which statement is a verifiable physical FACT?",
    "options": [
      "Copper is an electrical conductor that permits the free flow of electric charge.",
      "Copper looks far more elegant than aluminum metal.",
      "Electric circuits are the most thrilling science experiments to build.",
      "Working with copper wires is much easier than drawing graphs."
    ],
    "correctAnswer": "Copper is an electrical conductor that permits the free flow of electric charge.",
    "explanation": "Electrical conductivity is an intrinsic physical property of elemental copper, whereas beauty and excitement are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-401",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A box of solar lanterns was stolen from a clinic in Navrongo on December 21 at 9:00 PM. Suspect Salifu claims he was sitting outside his house watching the sun setting behind the hills at that exact moment.",
    "question": "What geographical fact destroys Salifu's alibi?",
    "options": [
      "Solar lanterns convert sunlight into electrical potential energy.",
      "In Ghana (near the equator), the sun sets between 5:45 PM and 6:30 PM, making a 9:00 PM sunset impossible.",
      "Navrongo is located in the Upper East Region of Ghana.",
      "The clinic doors were secured with steel bolts."
    ],
    "correctAnswer": "In Ghana (near the equator), the sun sets between 5:45 PM and 6:30 PM, making a 9:00 PM sunset impossible.",
    "explanation": "Equatorial twilight and sunset never occur at 9:00 PM in Ghana, proving his visual alibi was completely fabricated.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-402",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "An import company that sells plastic packaging publishes an article entitled: 'Why Biodegradable Paper Bags Harm Forest Trees More Than Plastic Sacks.'",
    "question": "What fundamental bias should an apprentice analyst detect in this publication?",
    "options": [
      "The paper bags are manufactured in West Africa.",
      "Commercial vested interest bias aiming to protect plastic sales revenue against paper bag competition.",
      "Plastic bags are synthesized from petrochemical polymers.",
      "Paper bags degrade naturally when exposed to soil moisture."
    ],
    "correctAnswer": "Commercial vested interest bias aiming to protect plastic sales revenue against paper bag competition.",
    "explanation": "The plastic supplier has a direct financial motive to publish negative arguments against competing ecological packaging.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-403",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A pharmacist mixed a medicinal suspension at 10:00 AM. The label specifies the compound must sit undisturbed for 4 hours to precipitate, and then be filtered. At 1:30 PM, an assistant filtered the solution.",
    "question": "What operational error did the assistant commit?",
    "options": [
      "The assistant used a glass funnel instead of plastic.",
      "The assistant filtered the mixture 30 minutes too early before the mandatory 4-hour settling period completed at 2:00 PM.",
      "The pharmacist prepared the mixture on a Tuesday.",
      "The solution should have been stored inside a deep freezer."
    ],
    "correctAnswer": "The assistant filtered the mixture 30 minutes too early before the mandatory 4-hour settling period completed at 2:00 PM.",
    "explanation": "Four hours after 10:00 AM is 2:00 PM. Filtering at 1:30 PM violated the chemical protocol by 30 minutes.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-404",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A student plants 3 cowpea seeds in pot X with mineral fertilizer and 3 cowpea seeds in pot Y with plain soil. One plant in pot X dies from an insect bite. He concludes: 'Mineral fertilizer kills cowpea crops.'",
    "question": "Why is the student's experimental deduction invalid?",
    "options": [
      "Cowpea is an indigenous leguminous crop.",
      "The tiny sample size of 3 plants failed to control for extraneous variables like insect pests.",
      "Pot X was painted terracotta red.",
      "Fertilizers contain nitrogen, phosphorus, and potassium."
    ],
    "correctAnswer": "The tiny sample size of 3 plants failed to control for extraneous variables like insect pests.",
    "explanation": "Drawing conclusions from three plants where pest damage was an uncontrolled confounding variable violates scientific rigor.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-405",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "An intruder climbed through an attic window above an oil-palm warehouse. Forensic investigators find palm fruit fibers and dark orange-red oil grease on the suspect's trousers.",
    "question": "What does this chemical and material evidence show?",
    "options": [
      "The suspect's clothing had direct physical contact with unrefined palm oil materials matching the crime scene.",
      "The suspect purchased fresh plantains at the market.",
      "The attic window was made of aluminum louvres.",
      "The suspect was painting classroom walls orange."
    ],
    "correctAnswer": "The suspect's clothing had direct physical contact with unrefined palm oil materials matching the crime scene.",
    "explanation": "Carotenoid-rich unrefined crude palm oil grease and pericarp fibers link the suspect's clothing directly to the processing warehouse.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-406",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "A farmer cleared a steep hillside forest plot in the Akuapem hills to grow maize without terracing. Following the first severe rainy season, the hillside suffered massive landslides and topsoil loss.",
    "question": "What was the direct causal factor behind the hillside erosion?",
    "options": [
      "Maize roots grow taller than tree canopies.",
      "Removing deep tree root networks eliminated the physical reinforcement that bound the hillside soil together.",
      "Rainwater in the Eastern Region has a high acid content.",
      "Maize plants consume all the nitrogen in the soil."
    ],
    "correctAnswer": "Removing deep tree root networks eliminated the physical reinforcement that bound the hillside soil together.",
    "explanation": "Arboreal roots physically anchor soil matrices on slopes; deforestation exposes loose soil to hydraulic sheer forces.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-407",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A copper wire spool disappeared from a workshop in Ho on August 15 at 1:00 PM. Suspect Mawuli claims he was outside staring directly at the North Star (Polaris) to navigate home.",
    "question": "What astronomical fact dismantles Mawuli's alibi?",
    "options": [
      "The North Star is only visible during the dark night, never at 1:00 PM in broad daylight.",
      "Copper is a ductile transition metal.",
      "Ho is the regional capital of the Volta Region.",
      "Spools of copper wire can be recycled."
    ],
    "correctAnswer": "The North Star is only visible during the dark night, never at 1:00 PM in broad daylight.",
    "explanation": "Starlight from Polaris cannot penetrate the brightly scattered daytime solar sky, making optical sighting at 1:00 PM impossible.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-408",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A privately funded laboratory owned by a tobacco conglomerate releases a paper claiming: 'Second-hand smoke causes zero respiratory irritation in young children.'",
    "question": "What severe bias undermines the credibility of this finding?",
    "options": [
      "Tobacco contains the stimulant alkaloid nicotine.",
      "Funding bias and corporate conflict of interest intended to protect cigarette manufacturers from health liability.",
      "Children inhale air through their respiratory passages.",
      "The laboratory had air conditioners installed."
    ],
    "correctAnswer": "Funding bias and corporate conflict of interest intended to protect cigarette manufacturers from health liability.",
    "explanation": "Corporate sponsorship by an industry facing financial liability from negative health findings is a textbook conflict of interest.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-409",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "An IT technician tests one refurbished laptop from a delivery shipment of 500 computers. It turns on smoothly. He immediately marks all 500 laptops as '100% verified functional and bug-free.'",
    "question": "What quality assurance error did the technician commit?",
    "options": [
      "Laptops operate using rechargeable lithium-ion batteries.",
      "Testing a single unit (0.2% sample) is statistically incapable of detecting manufacturing defects across 500 units.",
      "Refurbished electronics should be painted black.",
      "The operating system requires random access memory."
    ],
    "correctAnswer": "Testing a single unit (0.2% sample) is statistically incapable of detecting manufacturing defects across 500 units.",
    "explanation": "A sample size of N=1 out of 500 provides zero statistical confidence against batch variance and individual component failure.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-410",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A vehicle involved in a hit-and-run collision left broken glass fragments at the scene. The glass fragments are safety tempered glass that broke into smooth cubic pebbles rather than sharp jagged shards.",
    "question": "What part of the vehicle did this broken glass originate from?",
    "options": [
      "A regular side window of an automobile designed with tempered safety glass.",
      "An antique hand mirror carried by a passenger.",
      "A glass soda bottle thrown from the roadside.",
      "A clear plastic headlamp lens cover."
    ],
    "correctAnswer": "A regular side window of an automobile designed with tempered safety glass.",
    "explanation": "Side automotive windows are fabricated from tempered glass engineered to fracture into dull cubic pebbles rather than lacerating shards.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-401",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A statistical study across several districts finds that communities with higher rates of cellular mobile phone ownership also report higher average life expectancy.",
    "question": "What is the primary lurking confounding variable driving both metrics?",
    "options": [
      "Radiofrequency signals from mobile towers stimulate cellular longevity.",
      "General economic development and household income independently increase access to modern healthcare and technology.",
      "Higher life expectancy causes older citizens to buy smartphones.",
      "Mobile phones filter contaminants out of drinking water."
    ],
    "correctAnswer": "General economic development and household income independently increase access to modern healthcare and technology.",
    "explanation": "Economic prosperity (GDP per capita) is the confounding driver that simultaneously enables smartphone purchasing and funds sanitation, nutrition, and healthcare.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-402",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral forwarded audio clip features an alarming voice announcing: 'WHO declared that Lake Bosomtwe water has turned into liquid gold; armed troops are barricading the lake! Forward to 15 people to save Ghana!'",
    "question": "Which combination of elements proves this message is fraudulent disinformation?",
    "options": [
      "Lake Bosomtwe is a natural impact crater lake in the Ashanti Region.",
      "Absurd chemical claims (water transmuting to gold), panic generation, military invasion tropes, and chain-forwarding demands.",
      "The World Health Organization focuses on international public health.",
      "The audio file was transmitted via digital cellular networks."
    ],
    "correctAnswer": "Absurd chemical claims (water transmuting to gold), panic generation, military invasion tropes, and chain-forwarding demands.",
    "explanation": "Scientific impossibility combined with urgency, fear-mongering, and viral forwarding quotas are hallmark indicators of digital hoaxes.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-403",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "During a debate on city transit in Accra, a transport minister argues: 'We should invest in bus rapid transit because it is the policy that our transit ministry has decided to implement.'",
    "question": "Which logical fallacy is committed in this statement?",
    "options": [
      "Begging the Question (Petitio Principii / Circular Reasoning)",
      "Post Hoc Ergo Propter Hoc",
      "Straw Man Fallacy",
      "Appeal to Pity"
    ],
    "correctAnswer": "Begging the Question (Petitio Principii / Circular Reasoning)",
    "explanation": "Circular reasoning assumes the truth of the conclusion within the premise itself, providing zero external justification.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-404",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "An unlabelled white powder from a chemical warehouse is tested with dilute hydrochloric acid (HCl). It fizzes vigorously, liberating a colorless gas that turns clear limewater milky.",
    "question": "What chemical anion is definitively identified by this reaction?",
    "options": [
      "Sulfate (SO₄²⁻)",
      "Chloride (Cl⁻)",
      "Carbonate (CO₃²⁻)",
      "Nitrate (NO₃⁻)"
    ],
    "correctAnswer": "Carbonate (CO₃²⁻)",
    "explanation": "Carbonates react with acid to liberate carbon dioxide gas (CO₂), which reacts with calcium hydroxide (limewater) to precipitate white calcium carbonate (CaCO₃).",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-405",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "An online retail platform displays a banner stating: 'Over 99% customer satisfaction!' The survey methodology reveals they only surveyed customers who voluntarily signed up for the VIP Loyalty Club.",
    "question": "What statistical distortion undermines this claim?",
    "options": [
      "Selection bias (sampling only the most dedicated brand enthusiasts rather than a randomized cross-section of all purchasers).",
      "The survey was calculated using standard deviations.",
      "Percentages should only be reported for sample sizes under 50.",
      "Online platforms use secure hypertext transfer protocol."
    ],
    "correctAnswer": "Selection bias (sampling only the most dedicated brand enthusiasts rather than a randomized cross-section of all purchasers).",
    "explanation": "Surveying only the loyalty club introduces severe selection bias, omitting dissatisfied customers who abandon the platform.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-406",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A student prefect argues: 'If we allow students to wear casual sandals on Friday, next term they will refuse to wear uniforms entirely, leading to total anarchy and the destruction of the school's academic reputation.'",
    "question": "Which logical fallacy does this argument exemplify?",
    "options": [
      "Slippery Slope Fallacy",
      "Equivocation",
      "Hasty Generalization",
      "False Analogy"
    ],
    "correctAnswer": "Slippery Slope Fallacy",
    "explanation": "A Slippery Slope asserts without evidence that a small initial step will inevitably cascade into catastrophic extremes.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-407",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "An online news headline states: 'Scientists clone living Tyrannosaurus Rex in Kumasi zoo!' The accompanying photograph has smooth plastic skin textures, identical repeating background trees, and six toes on each claw.",
    "question": "What artificial generation artifact reveals this photograph is a synthetic AI fake?",
    "options": [
      "The image was captured with an ISO 400 digital sensor.",
      "Anatomical hallucination (six toes), texture smoothing, and repeating procedural patterns characteristic of AI diffusion generators.",
      "Kumasi Zoo is located in the Ashanti Region.",
      "Fossilized dinosaur bones are displayed in international museums."
    ],
    "correctAnswer": "Anatomical hallucination (six toes), texture smoothing, and repeating procedural patterns characteristic of AI diffusion generators.",
    "explanation": "Erroneous anatomical features (extra digits) and procedural tiling are telltale indicators of synthetic generative AI imagery.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-408",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A study in a mining municipality notices that when town asphalt road repairs increase, sales of bottled water also rise substantially.",
    "question": "What common seasonal variable explains this correlation?",
    "options": [
      "Hot dry dry-season weather allows municipal road paving while simultaneously driving dehydration and water demand.",
      "Bottled water is used by civil engineers to dilute asphalt bitumen.",
      "Asphalt fumes compel pedestrians to drink bottled water.",
      "Paved roads directly cause rainfall levels to decrease."
    ],
    "correctAnswer": "Hot dry dry-season weather allows municipal road paving while simultaneously driving dehydration and water demand.",
    "explanation": "The hot dry season is the common confounding season that enables road paving projects while boosting beverage sales.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-409",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A company advertises that its battery lasts 500% longer than a competitor's. In truth, the competitor battery runs for 1 minute, and theirs runs for 6 minutes.",
    "question": "What deceptive framing is being used?",
    "options": [
      "Using a massive relative percentage multiplier to disguise an operational lifespan difference of just 5 trivial minutes.",
      "Reporting runtime in minutes instead of seconds.",
      "Using direct current voltage instead of alternating current.",
      "Failing to compute the geometric median."
    ],
    "correctAnswer": "Using a massive relative percentage multiplier to disguise an operational lifespan difference of just 5 trivial minutes.",
    "explanation": "A 500% gain sounds massive, but an absolute operational runtime of 6 minutes remains practically useless for real consumers.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-410",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A piece of cloth suspected of having blood residue is sprayed with a mixture of luminol and hydrogen peroxide (H₂O₂) in a darkened room, producing an immediate glowing blue chemiluminescence.",
    "question": "What biological component in blood acts as the catalyst for this luminol oxidation?",
    "options": [
      "Iron (Fe²⁺) present within the heme group of hemoglobin.",
      "Albumin proteins in blood plasma.",
      "Glucose sugars metabolized by red blood cells.",
      "White blood cell lymphocyte nuclei."
    ],
    "correctAnswer": "Iron (Fe²⁺) present within the heme group of hemoglobin.",
    "explanation": "The iron cation coordinated inside hemoglobin's heme prosthetic group catalyzes the oxidation of luminol, generating chemiluminescent blue light.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-501",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four Basic 2 pupils examine a domestic honeybee hive built in the branch of an acacia tree.",
    "question": "Which statement about the honeybee is an objective scientific FACT?",
    "options": [
      "Bees are insects that possess an exoskeleton and segmented bodies.",
      "Honey produced by bees is the sweetest substance in the universe.",
      "Listening to bees buzzing is very scary.",
      "Worker bees work much harder than queen bees."
    ],
    "correctAnswer": "Bees are insects that possess an exoskeleton and segmented bodies.",
    "explanation": "Arthropod anatomy with an exoskeleton and three tagmata body segments is an objective biological fact, whereas emotional fear and sweetness ratings are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-502",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A box of fresh chalk was tipped over in the class. A powdery trail of white calcium carbonate footprints leads directly across the classroom to a single desk.",
    "question": "What does this footprint trail tell the detective?",
    "options": [
      "The person sitting at that desk walked in chalk dust directly from the spilt box.",
      "The desk was cleaned with soapy water yesterday.",
      "A bird flew through the open window with chalk.",
      "The floor was freshly polished with wax."
    ],
    "correctAnswer": "The person sitting at that desk walked in chalk dust directly from the spilt box.",
    "explanation": "Contiguous footprint trace evidence directly tracks locomotion from the spilled material to the occupant's station.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-503",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil puts an open plastic bottle of clean drinking water into the school freezer overnight. The next morning, the bottle has expanded and cracked open.",
    "question": "What physical cause made the bottle crack?",
    "options": [
      "Water expands in volume when it crystallizes from liquid into solid ice.",
      "The plastic bottle dissolved in cold air.",
      "The freezer motor chewed on the bottle.",
      "The air inside the freezer sucked the water out."
    ],
    "correctAnswer": "Water expands in volume when it crystallizes from liquid into solid ice.",
    "explanation": "Water's anomalous expansion upon freezing creates a crystalline lattice that occupies greater volume, generating force that fractures rigid plastic.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-504",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "School cleanup began at 2:00 PM, sweeping ended at 2:30 PM, mopping took place from 2:30 PM to 3:00 PM, and gates closed at 3:15 PM. Kofi slipped on wet floor tiles at 2:45 PM.",
    "question": "What activity was actively happening when Kofi slipped?",
    "options": [
      "Classrooms were being mopped with water",
      "The school gates were being locked",
      "Compound sweeping was starting",
      "Morning lessons were being taught"
    ],
    "correctAnswer": "Classrooms were being mopped with water",
    "explanation": "2:45 PM falls directly inside the scheduled floor mopping timeframe (2:30 PM to 3:00 PM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-505",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils discuss plants growing around their school compound in Kumasi.",
    "question": "Which of these statements is a verifiable botanical FACT?",
    "options": [
      "Plant roots absorb water and dissolved minerals from surrounding soil.",
      "Flowering hibiscus shrubs look much prettier than bougainvillea shrubs.",
      "Gardening is the most relaxing chore in school.",
      "Tall trees are far more important than grass lawns."
    ],
    "correctAnswer": "Plant roots absorb water and dissolved minerals from surrounding soil.",
    "explanation": "Root absorption of groundwater via osmosis is a biological fact, whereas beauty and relaxation value are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-506",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A wet umbrella left in the corridor has a puddle of clean water underneath, while three neighboring umbrellas are completely dry.",
    "question": "What does the puddle prove about that specific umbrella?",
    "options": [
      "It was recently used outdoors during rainfall or washed with water.",
      "It was kept in a sealed cupboard all morning.",
      "It is made of heavy metal iron.",
      "It belongs to the headteacher."
    ],
    "correctAnswer": "It was recently used outdoors during rainfall or washed with water.",
    "explanation": "Water shedding from the umbrella fabric onto the dry floor confirms recent physical exposure to precipitation.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-507",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A teacher strikes a metal tuning fork and touches it to the surface of a bowl of water, causing water droplets to splash outward violently.",
    "question": "What physical phenomenon caused the water to splash?",
    "options": [
      "The rapid mechanical vibrations of the tuning fork prongs transferred kinetic energy to the water.",
      "The metal tuning fork melted the water instantly.",
      "The water was frightened by the sound.",
      "Static electricity drained all the liquid."
    ],
    "correctAnswer": "The rapid mechanical vibrations of the tuning fork prongs transferred kinetic energy to the water.",
    "explanation": "Rapid oscillation of the metal tines transfers acoustic kinetic energy into surface water, causing cavitation and splashing.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-508",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Yaw washed his hands at 10:00 AM, peeled an orange at 10:05 AM, ate his lunch at 10:15 AM, and did pencil drawing at 10:30 AM. He had sticky citrus juice on his fingers when he greeted his friend at 10:10 AM.",
    "question": "Which action made Yaw's fingers sticky before 10:10 AM?",
    "options": [
      "Peeling the orange at 10:05 AM",
      "Washing hands at 10:00 AM",
      "Doing pencil drawing at 10:30 AM",
      "Walking to school at 7:00 AM"
    ],
    "correctAnswer": "Peeling the orange at 10:05 AM",
    "explanation": "Peeling the citrus fruit at 10:05 AM released sugary orange juices, accounting for sticky fingers at 10:10 AM.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-509",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A piece of paper on the teacher's desk was marked with red ink. Pen A has blue ink, Pen B has green ink, Pen C has red ink, and Pen D has black ink.",
    "question": "Which pen was used to make the mark?",
    "options": [
      "Pen A",
      "Pen C",
      "Pen B",
      "Pen D"
    ],
    "correctAnswer": "Pen C",
    "explanation": "Matching ink color traces directly isolates Pen C as the sole instrument capable of making red marks.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-510",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Sunyani discuss the sun and shadows on the playground.",
    "question": "Which statement is an observational FACT?",
    "options": [
      "Shadows are cast on the side opposite to the light source.",
      "Playing with your shadow is much more fun than playing soccer.",
      "Long afternoon shadows look spooky.",
      "Bright sunlight feels much nicer than gentle morning breeze."
    ],
    "correctAnswer": "Shadows are cast on the side opposite to the light source.",
    "explanation": "Geometric occlusion of rectilinear light rays always produces shadows on the anti-source side, confirming an objective scientific fact.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-501",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A school projector was taken from the multimedia room in Tema on July 10 at 12:00 PM. Suspect Mensah claims he was at the port witnessing seawater boil into steam under direct midday sunlight.",
    "question": "What scientific fact invalidates Mensah's alibi?",
    "options": [
      "Direct tropical solar radiation cannot raise ocean seawater to its boiling point of 100°C.",
      "Tema Harbour is a commercial deepwater seaport.",
      "Projectors require electrical wattage to operate.",
      "July is a month in the rainy season."
    ],
    "correctAnswer": "Direct tropical solar radiation cannot raise ocean seawater to its boiling point of 100°C.",
    "explanation": "Ambient tropical solar irradiance cannot heat open oceanic bodies to 100°C, proving his alibi scenario is physically impossible.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-502",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "An advertisement by a soda beverage manufacturer states: 'Independent science proves drinking cold fizzy soda prevents all tooth decay in children!'",
    "question": "What bias should an apprentice researcher recognize immediately?",
    "options": [
      "Commercial profit bias making fraudulent health claims to conceal the erosive effects of dietary sugars and carbonic acid.",
      "Fizzy drinks are sealed in aluminum cans.",
      "Carbon dioxide gas dissolves in water under pressure.",
      "Children have primary deciduous teeth."
    ],
    "correctAnswer": "Commercial profit bias making fraudulent health claims to conceal the erosive effects of dietary sugars and carbonic acid.",
    "explanation": "Commercial beverage manufacturers face severe conflicts of interest; claiming that sugar and acid prevent tooth decay contradicts established dentistry.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-503",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A laboratory beaker of water was heated from 8:00 AM until it boiled at 8:15 AM, kept boiling until 8:25 AM, and cooled on a bench until 9:00 AM. A thermometer was accidentally shattered by steam expansion while boiling.",
    "question": "In what timeframe was the thermometer shattered?",
    "options": [
      "Between 7:30 AM and 8:00 AM",
      "Between 8:15 AM and 8:25 AM",
      "Between 8:30 AM and 9:00 AM",
      "After 9:30 AM during morning break"
    ],
    "correctAnswer": "Between 8:15 AM and 8:25 AM",
    "explanation": "The beaker was boiling actively strictly between 8:15 AM and 8:25 AM, bounding the incident to that interval.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-504",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A student tests the battery life of one brand-new smartwatch on a rainy afternoon and finds it lasted 18 hours. She concludes: 'Every smartwatch made by this company runs for exactly 18 hours.'",
    "question": "Why is her deduction statistically unsound?",
    "options": [
      "Smartwatches contain microprocessors and optical sensors.",
      "Testing a single unit (N=1) under specific usage conditions fails to account for battery variance, display settings, and network load.",
      "Smartwatches tell time using quartz crystal oscillations.",
      "The student wore the watch on her left wrist."
    ],
    "correctAnswer": "Testing a single unit (N=1) under specific usage conditions fails to account for battery variance, display settings, and network load.",
    "explanation": "A single observation cannot establish a population parameter or control for variable usage factors like screen brightness.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-505",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "Investigators examine tire skid marks left on asphalt following a vehicle accident in Kumasi. The skid marks show distinct chevron tread patterns with a continuous center rib groove.",
    "question": "What information does this tire mark provide to investigators?",
    "options": [
      "The tire tread design can be matched against specific manufacturer tread molds to identify or exclude vehicle tires.",
      "The car engine ran on diesel fuel.",
      "The driver was traveling to Accra.",
      "The road was resurfaced three years ago."
    ],
    "correctAnswer": "The tire tread design can be matched against specific manufacturer tread molds to identify or exclude vehicle tires.",
    "explanation": "Forensic tire mark analysis compares tread groove dimensions, pitch, and patterns against commercial tire manufacturer databases.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-506",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "Farmers along an inland stream in the Ashanti Region began washing empty agrochemical spray tanks in the water, and within days, all frogs and fish downstream were dead.",
    "question": "What was the direct causal factor behind the aquatic die-off?",
    "options": [
      "Synthetic chemical pesticides dissolved in the water, poisoning cellular respiration and nervous systems in aquatic organisms.",
      "The frog population decided to migrate upstream.",
      "Water temperature dropped below zero degrees Celsius.",
      "Fish need land plants to survive."
    ],
    "correctAnswer": "Synthetic chemical pesticides dissolved in the water, poisoning cellular respiration and nervous systems in aquatic organisms.",
    "explanation": "Pesticide residues washed into freshwater introduce toxic compounds like organophosphates or pyrethroids that trigger aquatic mortality.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-507",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A cash drawer was opened at a market stall in Bolgatanga at 3:00 PM on a cloudless day. Suspect Ayisha claims she could not see anything because the moon was blocking the sun in a total solar eclipse.",
    "question": "What meteorological and astronomical fact breaks Ayisha's alibi?",
    "options": [
      "Total solar eclipses are rare, documented astronomical events, and none occurred on that date in Ghana.",
      "Bolgatanga is the capital of the Upper East Region.",
      "Market stalls operate under metal roofing sheets.",
      "Cash drawers contain coins and banknotes."
    ],
    "correctAnswer": "Total solar eclipses are rare, documented astronomical events, and none occurred on that date in Ghana.",
    "explanation": "Astronomical ephemerides verify solar eclipses precisely; fabricating an eclipse contradicts empirical astronomical records.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-508",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A private school owner publishes a pamphlet claiming: 'Students who attend boarding schools earn 100% higher scores than day students, so all day schools should be closed.'",
    "question": "What underlying bias is present in this claim?",
    "options": [
      "Financial commercial bias, as boarding schools charge significantly higher accommodation and tuition fees.",
      "Day students walk to school every morning.",
      "Boarding schools have student dormitories.",
      "Textbooks are used by both boarding and day students."
    ],
    "correctAnswer": "Financial commercial bias, as boarding schools charge significantly higher accommodation and tuition fees.",
    "explanation": "The proprietor benefits financially from boarder enrollments, introducing profit bias into their educational policy assertion.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-509",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A farmer inspects two cocoa pods out of an entire plantation of 5,000 trees. Both pods have black pod disease. He declares: 'All 5,000 trees on my farm are 100% infected and must be cut down.'",
    "question": "What reasoning error did the farmer make?",
    "options": [
      "A hasty generalization based on an insignificant sample (N=2) that cannot represent thousands of trees across diverse field zones.",
      "Cocoa was introduced by Tetteh Quarshie.",
      "Black pod is caused by Phytophthora species.",
      "Cocoa beans are fermented in plantain leaves."
    ],
    "correctAnswer": "A hasty generalization based on an insignificant sample (N=2) that cannot represent thousands of trees across diverse field zones.",
    "explanation": "Extrapolating total plantation infection from an unrepresentative sample of two pods violates scientific sampling methodologies.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-510",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A document written on paper shows embossed indentations in the sheet underneath it, matching the handwriting of a vanished suspect.",
    "question": "What forensic document examination method can recover this indented text?",
    "options": [
      "Electrostatic Detection Apparatus (ESDA) or oblique angled lighting to reveal indented impressions.",
      "Soaking the paper in hot palm oil.",
      "Burning the paper with a candle flame.",
      "Freezing the document in liquid nitrogen."
    ],
    "correctAnswer": "Electrostatic Detection Apparatus (ESDA) or oblique angled lighting to reveal indented impressions.",
    "explanation": "ESDA and side-angled glancing illumination are standard forensic techniques to non-destructively visualize latent handwriting indentations.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-501",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A municipal report in Accra shows that fire department expenditure and the financial damage from urban fires are strongly positively correlated.",
    "question": "What is the true causal explanation for this positive correlation?",
    "options": [
      "Larger, more devastating fires naturally require greater firefighter deployments and simultaneously cause greater property destruction.",
      "Spending money on fire departments directly causes structural fires.",
      "Firefighters start fires to justify annual municipal budget increases.",
      "Fire trucks emit heat that ignites nearby wooden buildings."
    ],
    "correctAnswer": "Larger, more devastating fires naturally require greater firefighter deployments and simultaneously cause greater property destruction.",
    "explanation": "Fire magnitude is the underlying driver that causes both elevated response costs and elevated monetary destruction.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-502",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral social media message states: 'Government secret decree mandates all citizens surrender their SIM cards tomorrow or face immediate drone strikes! Forward to 30 contacts!'",
    "question": "Which indicators prove this is synthetic panic misinformation?",
    "options": [
      "Extreme apocalyptic threats, lack of official gazette verification, forced viral forward quotas, and urgent fear-mongering.",
      "SIM cards contain integrated circuit chips.",
      "Cellular networks operate via base transceiver stations.",
      "Drones are unmanned aerial vehicles."
    ],
    "correctAnswer": "Extreme apocalyptic threats, lack of official gazette verification, forced viral forward quotas, and urgent fear-mongering.",
    "explanation": "Outrageous claims lacking gazetted attribution, coupled with viral forwarding quotas and panic framing, are classic hallmarks of digital disinfo.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-503",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "During an academic board meeting, a speaker states: 'We must not adopt this digital attendance software because our school has maintained paper register books for over sixty years!'",
    "question": "Which logical fallacy did the speaker commit?",
    "options": [
      "Appeal to Tradition (Argumentum ad Antiquitatem)",
      "Post Hoc Ergo Propter Hoc",
      "Straw Man Fallacy",
      "Appeal to Pity"
    ],
    "correctAnswer": "Appeal to Tradition (Argumentum ad Antiquitatem)",
    "explanation": "Asserting that a policy or method is inherently correct solely because it has historical longevity is an appeal to tradition.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-504",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "An unknown clear solution recovered from an industrial effluent pipe produces a dense white precipitate when treated with barium chloride (BaCl₂) in the presence of dilute hydrochloric acid (HCl).",
    "question": "What anion is positively identified by this barium test?",
    "options": [
      "Chloride (Cl⁻)",
      "Nitrate (NO₃⁻)",
      "Sulfate (SO₄²⁻)",
      "Carbonate (CO₃²⁻)"
    ],
    "correctAnswer": "Sulfate (SO₄²⁻)",
    "explanation": "Barium ions react with sulfate ions to form insoluble barium sulfate (BaSO₄), which does not dissolve in dilute hydrochloric acid.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-505",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A fitness club advertises: 'Our members lost an average of 10 kilograms!' A data audit shows 1 member had surgery and lost 91 kilograms, while the other 9 members lost 1 kilogram each.",
    "question": "Why is the club's advertised mean figure misleading?",
    "options": [
      "The arithmetic mean was severely skewed by a single massive outlier, misrepresenting the typical member outcome of 1 kilogram.",
      "Kilograms should be converted to imperial pounds.",
      "Fitness clubs require commercial trade licenses.",
      "Ten members is an even integer."
    ],
    "correctAnswer": "The arithmetic mean was severely skewed by a single massive outlier, misrepresenting the typical member outcome of 1 kilogram.",
    "explanation": "The mean ((91 + 9)/10 = 10 kg) is distorted by the extreme outlier; the median (1 kg) reflects the true typical experience.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-506",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A debater asserts: 'Scientists say climate change is real, but scientists also used to think the Earth was flat thousands of years ago, so modern climate science is completely wrong.'",
    "question": "What logical fallacy is committed here?",
    "options": [
      "Genetic Fallacy / False Analogy (conflating historical misconceptions with rigorous empirical modern scientific consensus)",
      "Circular Reasoning",
      "Slippery Slope",
      "Ad Hominem"
    ],
    "correctAnswer": "Genetic Fallacy / False Analogy (conflating historical misconceptions with rigorous empirical modern scientific consensus)",
    "explanation": "Dismissing modern empirical data by equating peer-reviewed atmospheric physics with pre-scientific ancient myths is a false analogy and genetic fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-507",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A shared video depicts a prominent international leader declaring immediate war on Ghana. Spectral audio analysis indicates unnatural robotic phoneme pacing, zero throat micro-movements, and digital artifacts around the lips.",
    "question": "What digital manipulation technology generated this synthetic video?",
    "options": [
      "Deepfake AI synthetic audiovisual generation",
      "Analog closed-circuit television recording",
      "High-definition optical zoom photography",
      "Satellite thermal imaging"
    ],
    "correctAnswer": "Deepfake AI synthetic audiovisual generation",
    "explanation": "Phoneme pacing defects and lip-boundary blending artifacts characterize neural generative adversarial (GAN) deepfake video synthesis.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-508",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Data from educational testing in Ghana shows that students with larger shoe sizes generally achieve higher reading comprehension scores.",
    "question": "What developmental variable accounts for this correlation?",
    "options": [
      "Student age and grade level: older students have physically larger feet and have received more years of reading instruction.",
      "Large shoes expand brain capacity.",
      "Reading books stimulates foot bone growth.",
      "Small shoes impair optical vision."
    ],
    "correctAnswer": "Student age and grade level: older students have physically larger feet and have received more years of reading instruction.",
    "explanation": "Chronological age is the confounding variable: older primary/JHS students have bigger feet and superior reading ability compared to Basic 1 pupils.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-509",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A food brand displays a pie chart where a 25% slice is drawn with a 3D forward projection that occupies 50% of the visible graphic area, overshadowing a 40% slice.",
    "question": "What visual distortion tactic was used?",
    "options": [
      "3D perspective distortion (exploding/angling slices) to visually exaggerate a smaller percentage share.",
      "Converting degrees of a circle into radians.",
      "Plotting categorical data on a logarithmic scale.",
      "Using primary colors on chart slices."
    ],
    "correctAnswer": "3D perspective distortion (exploding/angling slices) to visually exaggerate a smaller percentage share.",
    "explanation": "Tilting pie charts in 3D projects foreground slices forward, distorting geometric visual areas relative to true underlying percentages.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-510",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A forensic toxicologist treats an organic tissue extract with acidified potassium dichromate (K₂Cr₂O₇). The solution shifts color from vibrant orange to deep emerald green.",
    "question": "What chemical functional group is oxidized in this reaction (such as in breathalyzer tests for ethanol)?",
    "options": [
      "A primary or secondary alcohol group oxidized to an aldehyde, ketone, or carboxylic acid while reducing chromium(VI) to chromium(III).",
      "An alkane hydrocarbon forming carbon dioxide.",
      "A stable quaternary ammonium salt.",
      "An inert noble gas element."
    ],
    "correctAnswer": "A primary or secondary alcohol group oxidized to an aldehyde, ketone, or carboxylic acid while reducing chromium(VI) to chromium(III).",
    "explanation": "Potassium dichromate oxidizes alcohols; in doing so, orange hexavalent Cr₆⁺ is reduced to green trivalent Cr³⁺ ions.",
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
  },
  {
    "id": "tt-riddle-nov-201",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I fall from the sky in millions of drops, but I never get hurt. I wash the dust off mango leaves and fill the rainwater barrel. What am I?",
    "hint1": "You carry an umbrella when I visit.",
    "hint2": "I fall during storms.",
    "answer": "Rain",
    "acceptedKeywords": [
      "rain",
      "rainwater",
      "rainfall",
      "raindrops"
    ],
    "explanation": "Rain is liquid precipitation formed when condensed atmospheric water vapor falls under gravity.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-202",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have two long legs made of shiny steel. I hold a pencil in one foot and spin around on the other to draw round circles. What am I?",
    "hint1": "You keep me inside your mathematical set.",
    "hint2": "My name starts with a 'C'.",
    "answer": "A pair of compasses",
    "acceptedKeywords": [
      "compass",
      "a compass",
      "pair of compasses",
      "compasses",
      "drawing compass"
    ],
    "explanation": "A geometric compass consists of two arms joined by a hinge, used to scribe circles or arcs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-203",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has teeth all along its back, but never bites you when it runs smoothly through your hair?",
    "hint1": "You pick me up after bathing to groom your head.",
    "hint2": "I am made of plastic or wood.",
    "answer": "A comb",
    "acceptedKeywords": [
      "comb",
      "a comb",
      "hair comb"
    ],
    "explanation": "A comb has a row of thin prongs called teeth used to detangle and style hair.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-204",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have no wings, but I make leaves dance and dry clothes on the washing line. You can feel me on your skin, but you can never see me. What am I?",
    "hint1": "I spin the blades of windmills.",
    "hint2": "I am moving air.",
    "answer": "The wind",
    "acceptedKeywords": [
      "wind",
      "the wind",
      "breeze",
      "air"
    ],
    "explanation": "Wind is the macroscopic horizontal movement of air caused by differences in atmospheric pressure.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-205",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Carved from a sturdy tree trunk, I have a hollow hollow heart. Together with a heavy wooden pestle, I help pound boiled cassava and plantain into fufu. What am I?",
    "hint1": "My companion is a pestle.",
    "hint2": "In Akan, they call me Waduro.",
    "answer": "A wooden mortar",
    "acceptedKeywords": [
      "mortar",
      "a mortar",
      "wooden mortar",
      "waduro"
    ],
    "explanation": "A wooden mortar (waduro) is an essential culinary tool used across West Africa to pound tubers into fufu.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-206",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What gets wetter and wetter the more you leave it out in a heavy tropical downpour?",
    "hint1": "It protects you from above.",
    "hint2": "You hold its handle above your head.",
    "answer": "An umbrella",
    "acceptedKeywords": [
      "umbrella",
      "an umbrella",
      "parasol"
    ],
    "explanation": "While an umbrella keeps the person underneath dry, its outer fabric surface gets wetter as it deflects rain.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-207",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am a solid shape with 6 flat square faces, 8 sharp corners, and 12 straight edges. Roll me on a game board to play ludo! What am I?",
    "hint1": "Each of my faces shows dots from 1 to 6.",
    "hint2": "In geometry, my name is a 4-letter word.",
    "answer": "A cube (or die)",
    "acceptedKeywords": [
      "cube",
      "a cube",
      "die",
      "dice",
      "a die"
    ],
    "explanation": "A regular cube has six congruent square faces and is the standard shape for game dice.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-208",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a yellow, crescent-shaped fruit with a soft peel. Monkeys love to eat me, and school children pack me for break time. What am I?",
    "hint1": "You peel my skin before eating my sweet white flesh.",
    "hint2": "I grow in large bunches called hands.",
    "answer": "A banana",
    "acceptedKeywords": [
      "banana",
      "a banana",
      "bananas"
    ],
    "explanation": "Bananas are elongated, edible fruits produced by large herbaceous flowering plants in the genus Musa.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-209",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can fill an entire classroom from corner to corner without taking up any physical floor space?",
    "hint1": "Flip the light switch on the wall.",
    "hint2": "The sun gives it to the earth.",
    "answer": "Light",
    "acceptedKeywords": [
      "light",
      "sunlight",
      "illumination",
      "electric light"
    ],
    "explanation": "Light radiates across an entire volume, illuminating the space without occupying mass or volume like matter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-210",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I am tall when I am new on the teacher's desk, but after writing many spelling words on the chalkboard, I am short and worn down. What am I?",
    "hint1": "I leave white marks on black boards.",
    "hint2": "I am made of soft gypsum limestone.",
    "answer": "A piece of chalk",
    "acceptedKeywords": [
      "chalk",
      "a chalk",
      "piece of chalk",
      "chalk stick"
    ],
    "explanation": "Chalk wears away its soft mineral structure as friction deposits particles onto rough writing surfaces.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-211",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am made of dry, bound palm branches. When held in your hands every morning, I sweep compound leaves and sand clean. What am I?",
    "hint1": "Every Ghanaian home keeps one behind the door.",
    "hint2": "In Akan, they call me Praye.",
    "answer": "A broom",
    "acceptedKeywords": [
      "broom",
      "a broom",
      "praye",
      "palm broom"
    ],
    "explanation": "Traditional brooms (praye) are assembled from bundles of dried palm-frond midribs to sweep swept dirt yards.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-212",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am the only number that cannot be represented by Roman numerals. When you add me to any number, that number stays exactly the same. What am I?",
    "hint1": "I represent the count of having nothing.",
    "hint2": "My shape is an oval ring.",
    "answer": "Zero",
    "acceptedKeywords": [
      "zero",
      "0",
      "the number zero"
    ],
    "explanation": "Zero represents null quantity and serves as the additive identity. The ancient Roman numeral system lacked a zero symbol.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-213",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I live underground in the soil, wriggling without eyes or bones. I swallow earth and turn it into rich compost for the garden. What am I?",
    "hint1": "I surface after heavy downpours.",
    "hint2": "I am a segmented garden creature.",
    "answer": "An earthworm",
    "acceptedKeywords": [
      "earthworm",
      "an earthworm",
      "worm",
      "worms"
    ],
    "explanation": "Earthworms are subterranean annelids that aerate the soil and decompose organic material into nutrient-rich castings.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-214",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has keys that cannot unlock a single wooden door, but can type letters and numbers onto a computer screen?",
    "hint1": "You tap on it to write emails.",
    "hint2": "It has spacebar and enter keys.",
    "answer": "A keyboard",
    "acceptedKeywords": [
      "keyboard",
      "a keyboard",
      "computer keyboard"
    ],
    "explanation": "A keyboard has input buttons referred to as keys that send digital keystroke character codes to an operating system.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-215",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What is clean when it is jet black, but dirty when it is covered in white marks?",
    "hint1": "It hangs on the front wall of your classroom.",
    "hint2": "Your teacher writes lessons on it.",
    "answer": "A chalkboard",
    "acceptedKeywords": [
      "chalkboard",
      "a chalkboard",
      "blackboard",
      "a blackboard"
    ],
    "explanation": "A chalkboard is clean when wiped dark and black, and considered marked or used when covered in white chalk dust.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-201",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the process where an insect transforms completely from an egg to a hungry caterpillar, into a silent pupa, and finally emerges with colorful wings. What am I?",
    "hint1": "It happens to butterflies and moths.",
    "hint2": "The scientific name starts with 'meta-'.",
    "answer": "Metamorphosis",
    "acceptedKeywords": [
      "metamorphosis",
      "complete metamorphosis"
    ],
    "explanation": "Complete metamorphosis (holometabolism) is the four-stage developmental transition across insect life cycles.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-202",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Woven with intricate geometric patterns in Bonwire, Ashanti, my vibrant gold, green, and red silk strips were traditionally reserved for royalty. What sacred cloth am I?",
    "hint1": "Woven on a traditional wooden narrow-strip loom.",
    "hint2": "Famous patterns include 'Adwini Asa'.",
    "answer": "Kente cloth",
    "acceptedKeywords": [
      "kente",
      "kente cloth",
      "the kente cloth"
    ],
    "explanation": "Kente is a traditional Akan ceremonial cloth hand-woven from silk and cotton strips featuring symbolic patterns.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-203",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A basket holds 3 apples. How can you divide them equally between two fathers and two sons so that each person gets exactly one whole apple?",
    "hint1": "Only three people are present.",
    "hint2": "The group consists of grandfather, father, and son.",
    "answer": "The group is grandfather, father, and son",
    "acceptedKeywords": [
      "grandfather father son",
      "grandfather, father and son",
      "three people: grandfather, father, son",
      "grandfather father and son"
    ],
    "explanation": "The father is both a son to the grandfather and a father to the boy. Three individuals represent two fathers and two sons.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-204",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a noble gas that makes up nearly 1% of Earth's atmosphere, more abundant than carbon dioxide. I do not react with anything. What element am I?",
    "hint1": "My atomic number is 18.",
    "hint2": "My chemical symbol is Ar.",
    "answer": "Argon",
    "acceptedKeywords": [
      "argon",
      "ar"
    ],
    "explanation": "Argon is the third most abundant gas in Earth's atmosphere (approx 0.934%), chemically inert with a complete valence shell.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-205",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a five-letter word that sounds like a single letter. When you remove my last four letters, I still sound exactly the same. What line am I?",
    "hint1": "People stand in me while waiting at the bus station.",
    "hint2": "Spelled with two pairs of matching vowels around a consonant.",
    "answer": "Queue",
    "acceptedKeywords": [
      "queue",
      "a queue"
    ],
    "explanation": "The word 'QUEUE' is pronounced identically to the first letter 'Q'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-206",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A truck driver was going down a one-way street in the wrong direction in Kumasi. He passed three police officers, but none of them stopped or arrested him. Why?",
    "answer": "He was walking on foot.",
    "explanation": "One-way street vehicular restrictions apply to driving motor vehicles; pedestrians on foot may walk either direction.",
    "hint1": "Did the scenario say he was driving his truck?",
    "hint2": "He was using his own two legs.",
    "acceptedKeywords": [
      "he was walking",
      "walking",
      "he was on foot",
      "on foot"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-207",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a mythical bird looking backward with an egg in its mouth. My message teaches: 'It is not a taboo to return and fetch that which you forgot.' What am I?",
    "hint1": "My name starts with 'San-'.",
    "hint2": "I represent learning from the past to build the future.",
    "answer": "Sankofa",
    "acceptedKeywords": [
      "sankofa",
      "the sankofa bird",
      "sankofa bird"
    ],
    "explanation": "Sankofa is an Akan philosophical symbol embodying the wisdom of reflecting upon history to inform progress.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-208",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the anatomical organ in humans that continuously filters metabolic waste products and excess ions from the blood, producing urine. What am I?",
    "hint1": "Humans typically possess two of me, shaped like kidney beans.",
    "hint2": "My microscopic filtering units are called nephrons.",
    "answer": "The kidney",
    "acceptedKeywords": [
      "kidney",
      "kidneys",
      "the kidney",
      "the kidneys"
    ],
    "explanation": "Kidneys are paired bean-shaped renal organs containing nephrons that filter blood, regulate electrolyte balance, and produce urine.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-209",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "If you multiply all the single-digit numbers together on the keypad of a standard mobile telephone, what is the final product?",
    "hint1": "Look at the digit at the bottom center of the keypad.",
    "hint2": "Any number multiplied by 0 equals...",
    "answer": "Zero",
    "acceptedKeywords": [
      "0",
      "zero",
      "the product is zero"
    ],
    "explanation": "The phone dial pad includes the digit 0 (1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 × 9 × 0 = 0).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-210",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What English word retains the same pronunciation even if you remove four out of its five letters?",
    "hint1": "Think of people waiting in line.",
    "hint2": "The letters are Q-U-E-U-E.",
    "answer": "Queue",
    "acceptedKeywords": [
      "queue",
      "a queue"
    ],
    "explanation": "Removing 'u-e-u-e' leaves the letter 'Q', maintaining the original phonetic sound.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-211",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "You enter a dark kitchen in Assin Foso during an electricity blackout with a single matchstick. In the room, there is a kerosene lamp, a candle, and a wood stove. Which do you light first?",
    "hint1": "You cannot light anything without fire.",
    "hint2": "Look at what is in your fingers.",
    "answer": "The matchstick",
    "acceptedKeywords": [
      "the match",
      "match",
      "matchstick",
      "the matchstick"
    ],
    "explanation": "Before you can ignite the lamp, candle, or wood stove, you must first ignite the matchstick.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-212",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a geological layer beneath the Earth's crust composed of hot semi-solid rock. Convection currents within me cause tectonic plates to slowly drift. What am I?",
    "hint1": "I sit between the crust and the core.",
    "hint2": "My upper semi-molten zone is the asthenosphere.",
    "answer": "The mantle",
    "acceptedKeywords": [
      "mantle",
      "the mantle",
      "earth's mantle"
    ],
    "explanation": "The mantle is the thickest layer of the Earth, transferring heat via convective loops that drive plate tectonics.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-213",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Harvested from wild savanna trees in northern Ghana, my oily nuts are boiled, crushed, and churned into golden organic butter prized for cooking and skin moisturizing. What am I?",
    "hint1": "Known botanically as Vitellaria paradoxa.",
    "hint2": "Called Nkuto in Akan.",
    "answer": "Shea butter",
    "acceptedKeywords": [
      "shea butter",
      "shea nut",
      "nkuto",
      "shea"
    ],
    "explanation": "Shea butter (nkuto) is an edible fat extracted from the kernels of the shea tree native to the Sahel and Sudan savanna.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-214",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A grandfather, two fathers, and two sons went fishing on Lake Volta. Each caught one tilapia, yet only three fish were caught in total. How?",
    "hint1": "Count the number of actual humans in the boat.",
    "hint2": "The father is a son to the elder man.",
    "answer": "There were only three people: grandfather, father, and son",
    "acceptedKeywords": [
      "three people",
      "grandfather father and son",
      "grandfather father son",
      "three men"
    ],
    "explanation": "Three generations are present: the grandfather, his son (who is a father), and the grandson. Three people caught three fish.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-215",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has branches, leaves, and a trunk, but has never grown in any soil or drank water from rain? It records your family history!",
    "hint1": "It tracks grandparents, parents, and children.",
    "hint2": "It is drawn on paper.",
    "answer": "A family tree",
    "acceptedKeywords": [
      "family tree",
      "a family tree",
      "genealogy tree"
    ],
    "explanation": "A family tree is a graphical pedigree chart illustrating generational genealogical relationships.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-201",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the double-helix molecule carrying genetic information in all living cells, structured with four nitrogenous bases: Adenine, Thymine, Cytosine, and Guanine. What am I?",
    "hint1": "Discovered with the aid of Rosalind Franklin's X-ray crystallography photo 51.",
    "hint2": "My abbreviation is three letters.",
    "answer": "DNA (Deoxyribonucleic acid)",
    "acceptedKeywords": [
      "dna",
      "deoxyribonucleic acid"
    ],
    "explanation": "DNA is the nucleic acid polymer that stores genetic instructions for development and functioning in living organisms.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-202",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "In right-angled trigonometry, I state that the square of the hypotenuse is equal to the sum of the squares of the other two sides (a² + b² = c²). What theorem am I?",
    "hint1": "Named after an ancient Greek philosopher born on Samos.",
    "hint2": "Begins with the letter 'P'.",
    "answer": "The Pythagorean Theorem",
    "acceptedKeywords": [
      "pythagorean theorem",
      "pythagoras theorem",
      "pythagoras",
      "pythagorean"
    ],
    "explanation": "The Pythagorean theorem establishes the fundamental Euclidean geometric relation among the three sides of a right triangle.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-203",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the measure of disorder or randomness in a closed thermodynamic system. The Second Law of Thermodynamics states that I never decrease over time. What am I?",
    "hint1": "Symbolized by the capital letter S.",
    "hint2": "Formula: ΔS ≥ 0.",
    "answer": "Entropy",
    "acceptedKeywords": [
      "entropy",
      "the entropy"
    ],
    "explanation": "Entropy represents the degree of unavailable thermodynamic energy and molecular disorder in a closed physical system.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-204",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "In ancient African history, I was the Mali Empire ruler whose pilgrimage to Mecca in 1324 carried so much gold bullion that it devalued gold across Cairo and the Mediterranean for a decade. Who am I?",
    "hint1": "Regarded as one of the wealthiest individuals in human history.",
    "hint2": "He expanded the scholarly center of Timbuktu.",
    "answer": "Mansa Musa",
    "acceptedKeywords": [
      "mansa musa",
      "musa i of mali",
      "musa"
    ],
    "explanation": "Mansa Musa I of Mali presided over an empire rich in gold and salt trade, famous for his historic 1324 Hajj caravan.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-205",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man in a heavy rainstorm with no hat, no umbrella, and no shelter walked five miles home through Accra. Every piece of his clothing was soaked, but not a single hair on his head got wet. How?",
    "hint1": "Look at the condition of his head.",
    "hint2": "He lacked something that hair follicles grow.",
    "answer": "He was completely bald",
    "acceptedKeywords": [
      "bald",
      "he was bald",
      "he is bald",
      "he had no hair"
    ],
    "explanation": "The man had no hair on his head, so none could get wet.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-206",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the fundamental particle with zero electric charge and a rest mass slightly greater than a proton, residing inside atomic nuclei. James Chadwick discovered me in 1932. What am I?",
    "hint1": "Together with protons, I form nucleons.",
    "hint2": "My name reflects my electrical neutrality.",
    "answer": "A neutron",
    "acceptedKeywords": [
      "neutron",
      "a neutron",
      "neutrons"
    ],
    "explanation": "Neutrons are neutral subatomic baryons located in atomic nuclei alongside protons.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-207",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What 7-letter word contains thousands of letters?",
    "hint1": "Think of a container for sending correspondence.",
    "hint2": "It is installed at postal facilities.",
    "answer": "Mailbox",
    "acceptedKeywords": [
      "mailbox",
      "a mailbox",
      "postbox",
      "post-box"
    ],
    "explanation": "The word 'mailbox' has seven letters and physically contains thousands of written letters and mail.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-208",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a series of numbers where every term is the sum of the two preceding terms: 0, 1, 1, 2, 3, 5, 8, 13... What mathematical sequence am I?",
    "hint1": "The ratio of my consecutive terms approaches the Golden Ratio (φ ≈ 1.618).",
    "hint2": "Named after an Italian mathematician from Pisa.",
    "answer": "The Fibonacci sequence",
    "acceptedKeywords": [
      "fibonacci",
      "fibonacci sequence",
      "the fibonacci sequence"
    ],
    "explanation": "The Fibonacci sequence (Fₙ = Fₙ-₁ + Fₙ-₂) is widely observed in botanical phyllotaxis and geometric spirals.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-209",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A chemist in Tema was found in his lab with a typed suicide note. Next to his body lay a glass with water and crushed ice. The coroner proved the poison was ingested, but the water in the glass was completely pure and non-toxic. How was the poison administered?",
    "hint1": "What happens to ice cubes over time?",
    "hint2": "The poison was frozen into the ice.",
    "answer": "The poison was frozen inside the ice cubes",
    "acceptedKeywords": [
      "poison in the ice",
      "poison was in the ice",
      "frozen in ice",
      "poison was in the ice cubes",
      "ice had the poison"
    ],
    "explanation": "The poison was dissolved and frozen into the ice cubes; as they melted, the victim ingested the poison, leaving pure melted runoff.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-210",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the fundamental biological process where messenger RNA (mRNA) codons are read by ribosomes to assemble specific chains of amino acids into proteins. What am I?",
    "hint1": "It follows transcription in molecular gene expression.",
    "hint2": "Transfer RNA (tRNA) carries the corresponding anticodon.",
    "answer": "Translation",
    "acceptedKeywords": [
      "translation",
      "protein translation"
    ],
    "explanation": "Translation is the molecular biological process whereby genetic code carried by mRNA directs peptide bond synthesis in ribosomes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-211",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Constructed in 1482 by Portuguese traders at São Jorge da Mina, I am the oldest European building in existence south of the Sahara, later serving as a central hub of the transatlantic slave trade. What fortress am I?",
    "hint1": "Located on the coast of the Central Region of Ghana.",
    "hint2": "Designated a UNESCO World Heritage site.",
    "answer": "Elmina Castle",
    "acceptedKeywords": [
      "elmina castle",
      "st george's castle",
      "sao jorge da mina",
      "castle of elmina"
    ],
    "explanation": "Elmina Castle was erected by the Portuguese in 1482 as a fortified trading post and later became a major site of the transatlantic slave trade.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-212",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "You roll two standard fair six-sided dice. What is the most statistically probable sum of the two upward faces?",
    "hint1": "There are 36 possible outcomes (6 × 6).",
    "hint2": "The combinations (1,6), (2,5), (3,4), (4,3), (5,2), and (6,1) all yield this sum.",
    "answer": "Seven (7)",
    "acceptedKeywords": [
      "7",
      "seven",
      "sum of 7"
    ],
    "explanation": "The sum of 7 has 6 favorable combinations out of 36 (P = 6/36 = 1/6), making it the highest probability roll.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-213",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the point on the Earth's surface directly above the underground hypocenter (focus) where an earthquake rupture originates. What geological term am I?",
    "hint1": "Seismographs pinpoint my coordinates first.",
    "hint2": "My name starts with 'epi-'.",
    "answer": "The epicenter",
    "acceptedKeywords": [
      "epicenter",
      "the epicenter",
      "epicentrum"
    ],
    "explanation": "The epicenter is the point on Earth's surface vertically above the focus (hypocenter) of an earthquake.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-214",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a single English word that can mean 'to cling firmly to something' and also mean 'to split or sever something apart'. What auto-antonym am I?",
    "hint1": "Starts with the letter 'C' and has six letters.",
    "hint2": "A heavy butcher's knife is called a...",
    "answer": "Cleave",
    "acceptedKeywords": [
      "cleave",
      "to cleave"
    ],
    "explanation": "'Cleave' is a classic contronym (auto-antonym) meaning both to adhere tightly and to divide/cut into parts.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-215",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A woman shoots her husband, holds him under water for five minutes, and hangs him. Ten minutes later, they go out together and enjoy a lovely dinner at a restaurant in Accra. How?",
    "hint1": "She is not a criminal; she is an artist.",
    "hint2": "She develops film in a darkroom.",
    "answer": "She is a photographer developing his photo",
    "acceptedKeywords": [
      "photographer",
      "she is a photographer",
      "developing a picture",
      "photo development",
      "developing a photo"
    ],
    "explanation": "She took his photograph with a camera, dipped the film print in chemical wash solution, and hung it up to dry.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-301",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am white when I am pure, black when I am dirty from storm clouds, and I drift across the sky without wings. What am I?",
    "hint1": "You look up at me during the day.",
    "hint2": "I bring rain when I get dark and heavy.",
    "answer": "A cloud",
    "acceptedKeywords": [
      "cloud",
      "a cloud",
      "clouds",
      "raincloud"
    ],
    "explanation": "Clouds consist of tiny condensed water droplets or ice crystals floating in the atmosphere.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-302",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have four equal straight sides and four sharp square corners. If you cut me across diagonally from corner to corner, I turn into two triangles. What am I?",
    "hint1": "All my sides are the exact same length.",
    "hint2": "I am a basic flat shape.",
    "answer": "A square",
    "acceptedKeywords": [
      "square",
      "a square"
    ],
    "explanation": "A square is a regular quadrilateral with four equal sides and four right angles.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-303",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What gets sharper the more you use it to write, but gets smaller and shorter until it is just a tiny stub?",
    "hint1": "It has a graphite lead core and a wooden coat.",
    "hint2": "You use a sharpener on it.",
    "answer": "A pencil",
    "acceptedKeywords": [
      "pencil",
      "a pencil",
      "lead pencil"
    ],
    "explanation": "Sharpening a pencil whittles away the outer wood and shapes the inner graphite core, reducing its overall length over time.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-304",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have roots you cannot see, I am taller than the classroom, and every year I wear a crown of green leaves. What am I?",
    "hint1": "Birds build nests in my branches.",
    "hint2": "Mangoes and oranges grow on my arms.",
    "answer": "A tree",
    "acceptedKeywords": [
      "tree",
      "a tree",
      "trees"
    ],
    "explanation": "Trees are perennial plants with an elongated wooden trunk, branches, and root systems.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-305",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a hollow dried gourd. When filled with small seeds or beads and shaken with rhythm, I make music for dancers in the village. What am I?",
    "hint1": "In Ghana, musicians call me a shekere or rattle.",
    "hint2": "I shake to make rhythmic sounds.",
    "answer": "A shekere (calabash rattle)",
    "acceptedKeywords": [
      "shekere",
      "rattle",
      "a rattle",
      "calabash rattle",
      "sekere"
    ],
    "explanation": "The shekere is a traditional West African percussion instrument fashioned from a dried gourd wrapped in bead netting.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-306",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What has a thumb and four fingers, but is not alive and has no flesh or bones of its own?",
    "hint1": "You slip your hand inside it on cold or working days.",
    "hint2": "It covers your hand like clothing.",
    "answer": "A glove",
    "acceptedKeywords": [
      "glove",
      "a glove",
      "gloves"
    ],
    "explanation": "A glove is manufactured to fit the anatomy of a human hand, with four finger sheaths and one thumb sheath.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-307",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "If you have 10 ripe bananas and eat 4 of them during morning break, how many bananas do you have left?",
    "hint1": "Subtract 4 from 10.",
    "hint2": "Count up from 4 to 10.",
    "answer": "6 bananas",
    "acceptedKeywords": [
      "6",
      "six",
      "6 bananas",
      "six bananas"
    ],
    "explanation": "10 - 4 = 6. Six bananas remain.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-308",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I come out at night without being called, and I disappear at dawn without being stolen. What sparkling jewels in the sky am I?",
    "hint1": "Look above you on a clear dark night.",
    "hint2": "The sun is one of my closest cousins.",
    "answer": "The stars",
    "acceptedKeywords": [
      "stars",
      "the stars",
      "star",
      "a star"
    ],
    "explanation": "Stars are luminous astronomical spheres of plasma visible in the night sky when sunlight is absent.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-309",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a neck, wears a round metal or plastic cap, but has no head or shoulders?",
    "hint1": "You drink water or juice from it.",
    "hint2": "It is made of glass or plastic.",
    "answer": "A bottle",
    "acceptedKeywords": [
      "bottle",
      "a bottle",
      "water bottle"
    ],
    "explanation": "A bottle features an upper narrow section called a bottle neck, leading to its opening.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-310",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has legs, four of them in fact, but can never walk, run, or jump?",
    "hint1": "You sit on a chair right next to it.",
    "hint2": "You place your books and plates on its flat top.",
    "answer": "A table",
    "acceptedKeywords": [
      "table",
      "a table",
      "desk",
      "a desk"
    ],
    "explanation": "Tables and desks are supported by vertical structural posts traditionally referred to as legs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-311",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am dried cassava flakes roasted until crisp and golden. When soaked in cold water with sugar, milk, and roasted groundnuts, I am a favorite quick student meal. What am I?",
    "hint1": "Students call my meal 'gari soakings'.",
    "hint2": "Made from grated fermented cassava root.",
    "answer": "Gari",
    "acceptedKeywords": [
      "gari",
      "garri",
      "cassava gari"
    ],
    "explanation": "Gari is a traditional West African staple made from fermented, grated, and roasted cassava tubers.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-312",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "How many days are in one full calendar week?",
    "hint1": "From Monday all the way through Sunday.",
    "hint2": "It is an odd number between 5 and 9.",
    "answer": "7 days",
    "acceptedKeywords": [
      "7",
      "seven",
      "7 days",
      "seven days"
    ],
    "explanation": "A standard calendar week consists of seven 24-hour solar days.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-313",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I hatch from an egg as a tiny swimming tadpole with gills and a tail, but when I grow up, I lose my tail and hop on land with four legs. What am I?",
    "hint1": "I croak near ponds and ditches.",
    "hint2": "I am an amphibian.",
    "answer": "A frog (or toad)",
    "acceptedKeywords": [
      "frog",
      "a frog",
      "toad",
      "a toad"
    ],
    "explanation": "Frogs undergo metamorphosis from aquatic, gill-breathing tadpoles into air-breathing, four-legged adult amphibians.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-314",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "If you throw a white pebble into the blue water of Lake Bosomtwe, what does it become?",
    "hint1": "Think about what water does to dry things.",
    "hint2": "It does not change color.",
    "answer": "It becomes wet",
    "acceptedKeywords": [
      "wet",
      "it becomes wet",
      "it gets wet"
    ],
    "explanation": "Submerging any solid rock into a lake makes it wet.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-315",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What starts with the letter 'T', is filled with 'T', and ends with 'T'?",
    "hint1": "You pour hot breakfast brew from it.",
    "hint2": "It holds tea inside.",
    "answer": "A teapot",
    "acceptedKeywords": [
      "teapot",
      "a teapot"
    ],
    "explanation": "The word 'TEAPOT' begins with T, ends with T, and holds tea ('T') inside.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-301",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the green organelle inside plant leaf cells where light energy is captured to convert water and carbon dioxide into glucose. What am I?",
    "hint1": "I contain chlorophyll pigments.",
    "hint2": "My name starts with 'chloro-'.",
    "answer": "A chloroplast",
    "acceptedKeywords": [
      "chloroplast",
      "a chloroplast",
      "chloroplasts"
    ],
    "explanation": "Chloroplasts are specialized plant organelles that conduct photosynthesis.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-302",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol shaped like two interlocking crocodile bodies sharing a single stomach. My proverb warns that fighting over food is foolish when the food goes to the same belly. What am I?",
    "hint1": "Funtunfunefu Denkyemfunefu.",
    "hint2": "It represents unity and shared destiny.",
    "answer": "Funtunfunefu Denkyemfunefu (Siamese Crocodiles)",
    "acceptedKeywords": [
      "funtunfunefu",
      "funtunfunefu denkyemfunefu",
      "siamese crocodiles",
      "denkyemfunefu"
    ],
    "explanation": "This Akan symbol teaches the senselessness of tribal conflict, as people share a common community existence.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-303",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the smallest positive prime number that is also an even integer?",
    "hint1": "It has exactly two factors: 1 and itself.",
    "hint2": "It is the only even prime number in all of mathematics.",
    "answer": "Two (2)",
    "acceptedKeywords": [
      "2",
      "two",
      "number 2"
    ],
    "explanation": "2 is the only even prime number; every subsequent even number is divisible by 2.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-304",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the transfer of heat through fluids caused by the upward movement of hotter, less dense material and the downward sinking of cooler, denser material. What thermal process am I?",
    "hint1": "It happens when water boils in a pot.",
    "hint2": "Not conduction or radiation.",
    "answer": "Convection",
    "acceptedKeywords": [
      "convection",
      "thermal convection"
    ],
    "explanation": "Convection is bulk heat transfer driven by density differences within fluid masses.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-305",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "Forward I am an action of looking or gazing, backward I am a small round spot on a garment or dice. What four-letter word am I?",
    "hint1": "Look at: P-E-E-K or S-P-O-T / T-O-P-S.",
    "hint2": "P-O-O-P or T-O-O-T.",
    "answer": "Tops / Spot (or Peek / Keep)",
    "acceptedKeywords": [
      "spot",
      "tops",
      "stop",
      "pots"
    ],
    "explanation": "Reversing 'spot' forms 'tops', while 'stop' reverses into 'pots'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-306",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A farmer has a rectangular garden measuring 20 metres by 10 metres. If he places a wooden fence post every 5 metres along the perimeter, how many fence posts does he need in total?",
    "hint1": "Calculate the perimeter first: 2 × (20 + 10) = 60 metres.",
    "hint2": "Divide 60 by 5.",
    "answer": "12 posts",
    "acceptedKeywords": [
      "12",
      "12 posts",
      "twelve",
      "twelve posts"
    ],
    "explanation": "In a closed loop, the number of posts equals the perimeter divided by spacing: 60 / 5 = 12.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-307",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an ancient salt-mining and trade oasis city on the edge of the Sahara, home to the historic Sankore University with thousands of ancient Islamic manuscripts. What city am I?",
    "hint1": "Located along the Niger River in Mali.",
    "hint2": "Famous across medieval trade routes.",
    "answer": "Timbuktu",
    "acceptedKeywords": [
      "timbuktu",
      "tombouctou"
    ],
    "explanation": "Timbuktu flourished as a world-renowned scholarly hub and trans-Saharan trading post in the Mali and Songhai Empires.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-308",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the muscular pump inside your chest with four chambers: two atria and two ventricles. I circulate blood continuously through arteries and veins. What organ am I?",
    "hint1": "Doctors listen to me with a stethoscope.",
    "hint2": "My rhythm beats around 70 times per minute.",
    "answer": "The heart",
    "acceptedKeywords": [
      "heart",
      "the heart",
      "human heart"
    ],
    "explanation": "The heart is the primary organ of the circulatory system, pumping deoxygenated blood to the lungs and oxygenated blood to the body.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-309",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the perimeter of an equilateral triangle whose individual sides each measure 15 centimetres?",
    "hint1": "An equilateral triangle has 3 sides of identical length.",
    "hint2": "Multiply 15 by 3.",
    "answer": "45 centimetres",
    "acceptedKeywords": [
      "45",
      "45 cm",
      "45 centimetres",
      "forty-five"
    ],
    "explanation": "15 + 15 + 15 = 45 cm.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-310",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What 5-letter English word becomes shorter when you add two more letters to it?",
    "hint1": "Look at the word 'short'.",
    "hint2": "Add '-er' to the end.",
    "answer": "Short",
    "acceptedKeywords": [
      "short",
      "the word short"
    ],
    "explanation": "Adding 'er' to 'short' spells 'shorter'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-311",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "Before Mount Everest was measured and surveyed by geographers, what was the highest mountain peak on Earth?",
    "hint1": "Did another mountain shrink?",
    "hint2": "The mountain was already physically there.",
    "answer": "Mount Everest",
    "acceptedKeywords": [
      "mount everest",
      "everest"
    ],
    "explanation": "Mount Everest was still the highest peak on Earth even before humans surveyed and named it.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-312",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the electrical device that steps up or steps down alternating current (AC) voltage via electromagnetic induction between two coils of wire. What am I?",
    "hint1": "You see me mounted on power poles in town.",
    "hint2": "My name starts with 'trans-'.",
    "answer": "A transformer",
    "acceptedKeywords": [
      "transformer",
      "a transformer",
      "electrical transformer"
    ],
    "explanation": "Transformers adjust voltage levels across electrical grids using Faraday's law of mutual electromagnetic induction.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-313",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am the famous Akan woman warrior and queen mother of Ejisu who led the War of the Golden Stool against British colonial forces in 1900. Who am I?",
    "hint1": "Famous for her rallying call to Ashanti men.",
    "hint2": "Her first name is Yaa.",
    "answer": "Nana Yaa Asantewaa",
    "acceptedKeywords": [
      "yaa asantewaa",
      "nana yaa asantewaa",
      "queen yaa asantewaa"
    ],
    "explanation": "Nana Yaa Asantewaa was the Queen Mother of Ejisu who commanded the Ashanti rebellion to defend the sacred Golden Stool in 1900.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-314",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "If you count from 1 to 100, how many times does the digit '7' appear in total?",
    "hint1": "Count: 7, 17, 27, 37, 47, 57, 67, 70-79, 87, 97.",
    "hint2": "Remember that 77 contains two sevens.",
    "answer": "20 times",
    "acceptedKeywords": [
      "20",
      "20 times",
      "twenty"
    ],
    "explanation": "Units position: 10 times (7, 17, 27... 97). Tens position: 10 times (70 through 79). 10 + 10 = 20.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-315",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What kind of room has no walls, no windows, no floor, and no door, but grows wild in damp forest shade?",
    "hint1": "It is an edible fungus.",
    "hint2": "Its name ends with 'room'.",
    "answer": "A mushroom",
    "acceptedKeywords": [
      "mushroom",
      "a mushroom",
      "mushrooms"
    ],
    "explanation": "A mushroom is the fruiting body of a fungus; its name contains the word 'room'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-301",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the constant speed of light in a vacuum, represented by the letter c. What is my approximate value in kilometres per second?",
    "hint1": "It takes about 8 minutes for sunlight to reach Earth.",
    "hint2": "Approximately 300,000 km/s.",
    "answer": "300,000 kilometres per second",
    "acceptedKeywords": [
      "300000 km/s",
      "300,000 km/s",
      "300000",
      "300,000 kilometres per second",
      "3x10^8 m/s"
    ],
    "explanation": "Light travels at exactly 299,792,458 m/s (approx 300,000 km/s) in a vacuum.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-302",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In algebra, what is the value of any non-zero real number raised to the power of zero (x⁰)?",
    "hint1": "Consider index laws: xⁿ / xⁿ = xⁿ⁻ⁿ.",
    "hint2": "Any number divided by itself equals...",
    "answer": "One (1)",
    "acceptedKeywords": [
      "1",
      "one"
    ],
    "explanation": "By exponent quotient rules: xᵃ / xᵃ = xᵃ⁻ᵃ = x⁰ = 1 for all x ≠ 0.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-303",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the organelle responsible for sorting, modifying, and packaging proteins synthesized by the rough endoplasmic reticulum into vesicles for secretion. What am I?",
    "hint1": "Named after an Italian biologist who stained it with silver nitrate.",
    "hint2": "Golgi...",
    "answer": "The Golgi apparatus (Golgi body)",
    "acceptedKeywords": [
      "golgi apparatus",
      "golgi body",
      "the golgi apparatus",
      "golgi complex"
    ],
    "explanation": "The Golgi apparatus modifies, sorts, and packages macromolecules for cellular secretion or delivery to lysosomes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-304",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I am the medieval West African empire founded by Sundiata Keita after the Battle of Kirina in 1235, codified under the Kurukan Fuga charter. What empire was I?",
    "hint1": "Mansa Musa later ruled over me.",
    "hint2": "Named after the modern nation of Mali.",
    "answer": "The Mali Empire",
    "acceptedKeywords": [
      "mali empire",
      "the mali empire",
      "mali"
    ],
    "explanation": "The Mali Empire was founded by Sundiata Keita, establishing an influential federation across West Africa.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-305",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A spherical ball of solid copper with a small hollow cavity in its center is heated evenly in a furnace. Does the volume of the internal cavity expand or shrink?",
    "answer": "The internal cavity expands in volume.",
    "explanation": "Thermal expansion occurs proportionally in all directions as if the hole were filled with copper.",
    "hint1": "Think about what happens to a photo when you enlarge it.",
    "hint2": "The material expands outward in every direction.",
    "acceptedKeywords": [
      "expands",
      "it expands",
      "expands in volume",
      "increases",
      "it gets bigger"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-306",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the type of chemical bond formed when two non-metal atoms share one or more pairs of valence electrons to achieve stable octet configurations. What bond am I?",
    "hint1": "Found in water (H₂O) and methane (CH₄).",
    "hint2": "Contrasted with ionic bonds.",
    "answer": "A covalent bond",
    "acceptedKeywords": [
      "covalent bond",
      "covalent",
      "a covalent bond",
      "covalent bonding"
    ],
    "explanation": "Covalent bonding involves the electrostatic attraction between shared pairs of electrons and the positive nuclei of non-metal atoms.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-307",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am an eight-letter word that contains only one vowel, yet I am what a person does when they move their shoulders upward in doubt. What word am I?",
    "hint1": "Spelled: S-H-R-U-G-G-E-D has two vowels.",
    "hint2": "Past tense of shrug: S-H-R-U-G-S has only 'U'.",
    "answer": "Shrugs (or Strengths)",
    "acceptedKeywords": [
      "strengths",
      "shrugs"
    ],
    "explanation": "'Strengths' is nine letters with only one vowel ('E'), making it the longest single-vowel common English word.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-308",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In coordinate geometry, what is the slope (gradient) of a completely horizontal line plotted on the Cartesian plane?",
    "hint1": "Gradient is change in y divided by change in x (Δy / Δx).",
    "hint2": "For a flat horizontal line, Δy = 0.",
    "answer": "Zero (0)",
    "acceptedKeywords": [
      "0",
      "zero",
      "slope of zero"
    ],
    "explanation": "Horizontal lines have a constant y-value; thus Δy = 0, yielding a gradient of m = 0 / Δx = 0.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-309",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "You have a 3-litre jug and a 5-litre jug with unlimited water from a tap. How do you measure out exactly 4 litres of water?",
    "answer": "Fill the 5L jug, pour into the 3L jug until full (leaving 2L in 5L jug), empty the 3L jug, pour the 2L into the 3L jug, fill the 5L jug again, and pour into 3L jug until full, leaving exactly 4L.",
    "explanation": "This classic problem relies on modular arithmetic: 5 - 3 = 2; transfer 2 to the 3L jug, then 5 - (3 - 2) = 4 litres remaining in the 5L jug.",
    "hint1": "Use the difference between the capacities of both containers.",
    "hint2": "Leaves 2 litres first, then transfer.",
    "acceptedKeywords": [
      "fill 5l pour into 3l",
      "fill 5 litre pour into 3 litre",
      "fill the 5l jug",
      "fill 5l",
      "4 litres"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-310",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am Newton's law of motion stating that for every action, there is an equal and opposite reaction force. Which law am I?",
    "hint1": "It explains rocket propulsion and recoil.",
    "hint2": "It is his third law.",
    "answer": "Newton's Third Law of Motion",
    "acceptedKeywords": [
      "newton's third law",
      "third law",
      "newton's 3rd law",
      "third law of motion"
    ],
    "explanation": "Newton's Third Law states that mutual forces of action and reaction between two bodies are equal in magnitude and opposite in direction.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-311",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I am the ancient trading empire located in present-day southeastern Mauritania and western Mali that was famed as the 'Land of Gold' before the rise of Mali. What was my indigenous Soninke name?",
    "hint1": "Known to Arab chroniclers as ancient Ghana.",
    "hint2": "Its capital was Koumbi Saleh; Soninke name Wagadou.",
    "answer": "Wagadou (Ancient Ghana Empire)",
    "acceptedKeywords": [
      "wagadou",
      "ancient ghana",
      "ghana empire",
      "ancient ghana empire"
    ],
    "explanation": "The ancient Wagadou Empire (Ghana Empire) controlled the trans-Saharan gold-salt trade routes between the 6th and 13th centuries.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-312",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "What is the sum of the interior angles of any planar four-sided polygon (quadrilateral)?",
    "hint1": "A quadrilateral can be split into two triangles.",
    "hint2": "Each triangle has interior angles summing to 180°.",
    "answer": "360 degrees",
    "acceptedKeywords": [
      "360",
      "360 degrees",
      "360°",
      "three hundred and sixty"
    ],
    "explanation": "Formula (n - 2) × 180°: for n = 4, (4 - 2) × 180° = 360°.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-313",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the scale ranging from 0 to 14 used to specify the acidity or basicity of an aqueous solution. Pure water at 25°C has a rating of 7 on me. What scale am I?",
    "hint1": "Values below 7 are acidic, above 7 are alkaline.",
    "hint2": "P stands for potential of hydrogen.",
    "answer": "The pH scale",
    "acceptedKeywords": [
      "ph scale",
      "ph",
      "the ph scale"
    ],
    "explanation": "pH is the negative logarithm of the hydrogen ion activity: pH = -log₁₀[H⁺].",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-314",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What English word has three consecutive double letters in a row?",
    "hint1": "Think of someone who manages financial ledger accounts.",
    "hint2": "B-O-O-K-K-E-E-P-E-R.",
    "answer": "Bookkeeper",
    "acceptedKeywords": [
      "bookkeeper",
      "bookkeeping"
    ],
    "explanation": "'Bookkeeper' (and 'bookkeeping') features consecutive double letters: 'oo', 'kk', and 'ee'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-315",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A hunter walks 1 kilometre due South, turns and walks 1 kilometre due East, and then walks 1 kilometre due North, ending up at the exact point he started. He shoots a bear. What color is the bear?",
    "hint1": "Where on Earth can you walk South, East, and North to return to your starting position?",
    "hint2": "Think of the Earth's geographic poles.",
    "answer": "White (a polar bear)",
    "acceptedKeywords": [
      "white",
      "polar bear",
      "it is white"
    ],
    "explanation": "The hunter started at the geographic North Pole, where polar bears are white.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-401",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have no voice, but I roar across the sky during the storm. My flash lights up the classroom window before my thunder arrives. What am I?",
    "hint1": "I am a flash of electrical energy in the sky.",
    "hint2": "Thunder is my loud partner.",
    "answer": "Lightning",
    "acceptedKeywords": [
      "lightning",
      "a lightning bolt",
      "lightning flash"
    ],
    "explanation": "Lightning is a massive electrostatic discharge between charged atmospheric regions or between the cloud and the ground.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-402",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am a flat round shape with no corners and no straight edges. Coins and car tires share my shape. What am I?",
    "hint1": "You use a pair of compasses to draw me.",
    "hint2": "I am perfectly round like the full moon.",
    "answer": "A circle",
    "acceptedKeywords": [
      "circle",
      "a circle"
    ],
    "explanation": "A circle is a 2D geometric shape consisting of all points equidistant from a central focal point.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-403",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have an open mouth that never speaks, but I swallow your feet every morning before you tie my laces. What am I?",
    "hint1": "You wear me on your feet to walk to school.",
    "hint2": "I have a sole and shoelaces.",
    "answer": "A shoe",
    "acceptedKeywords": [
      "shoe",
      "a shoe",
      "shoes",
      "sneaker",
      "sneakers"
    ],
    "explanation": "The opening where a foot enters footwear is called the shoe's throat or collar.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-404",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am green in the tree canopy, turning yellow and brown when I dry up and flutter down to the forest floor. Plants breathe through me. What am I?",
    "hint1": "Photosynthesis takes place within me.",
    "hint2": "Trees have thousands of me on their branches.",
    "answer": "A leaf",
    "acceptedKeywords": [
      "leaf",
      "a leaf",
      "leaves"
    ],
    "explanation": "Leaves are the primary photosynthetic and gas-exchange organs of vascular plants.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-405",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a traditional musical drum shaped like an hourglass. When drummers squeeze my leather strings under their arm, my pitch rises and mimics the human voice. What am I?",
    "hint1": "Called the talking drum.",
    "hint2": "Known in Akan as the Donno.",
    "answer": "A talking drum (Donno)",
    "acceptedKeywords": [
      "talking drum",
      "donno",
      "a talking drum",
      "dundun"
    ],
    "explanation": "The Donno (talking drum) changes pitch via string tension, allowing players to mimic tonal West African languages.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-406",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What has a zipper or buckle, carries exercise books and pencils upon your shoulders, but never reads a single word?",
    "hint1": "You strap me onto your back every morning.",
    "hint2": "I am your school bag.",
    "answer": "A school bag (backpack)",
    "acceptedKeywords": [
      "school bag",
      "backpack",
      "a school bag",
      "bag",
      "a backpack"
    ],
    "explanation": "A school backpack is designed with straps to haul books and school supplies.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-407",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have 3 straight sides and 3 pointed corners. If you count my interior angles, they always add up to 180°. What shape am I?",
    "hint1": "My name begins with 'Tri-'.",
    "hint2": "Tri means three.",
    "answer": "A triangle",
    "acceptedKeywords": [
      "triangle",
      "a triangle"
    ],
    "explanation": "A triangle is a 3-sided polygon whose interior angles sum to 180 degrees.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-408",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am the bright circular orb that shines in the night sky. Sometimes I am a thin silver crescent, and sometimes a round golden ball. What am I?",
    "hint1": "I orbit planet Earth once every month.",
    "hint2": "I reflect the light of the sun at night.",
    "answer": "The moon",
    "acceptedKeywords": [
      "moon",
      "the moon",
      "lunar"
    ],
    "explanation": "The moon is Earth's only natural satellite, exhibiting phases as its orbital angle to the sun shifts.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-409",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a head and a tail, but no body, legs, or eyes, and can be flipped into the air to make a decision?",
    "hint1": "It is made of stamped metal.",
    "hint2": "You spend it to buy snacks in the canteen.",
    "answer": "A coin",
    "acceptedKeywords": [
      "coin",
      "a coin",
      "pesewa",
      "pesewa coin"
    ],
    "explanation": "The obverse side of a coin is colloquially called 'heads' and the reverse side 'tails'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-410",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What can be heard by everyone across the compound, but can never be touched or held in your hand?",
    "hint1": "It travels through the air as acoustic sound waves.",
    "hint2": "Your voice produces it.",
    "answer": "A sound (or voice)",
    "acceptedKeywords": [
      "sound",
      "a sound",
      "voice",
      "a voice",
      "noise"
    ],
    "explanation": "Sound is acoustic mechanical vibration through matter; it is energy, not a tangible solid object.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-411",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Baked in iron pans from cassava and fermented corn dough, I am the popular street meal eaten with hot shito and fried fish along the coast of Ghana. What am I?",
    "hint1": "Ga people are famous for preparing me.",
    "hint2": "Wrapped in cornhusks.",
    "answer": "Kenkey",
    "acceptedKeywords": [
      "kenkey",
      "ga kenkey",
      "fante kenkey"
    ],
    "explanation": "Kenkey is a staple Ghanaian sourdough dumpling prepared from fermented white cornmeal wrapped in dried cornhusks.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-412",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "How many minutes are there in one complete hour?",
    "hint1": "It is five times twelve.",
    "hint2": "The minute hand makes one full circle in this time.",
    "answer": "60 minutes",
    "acceptedKeywords": [
      "60",
      "60 minutes",
      "sixty",
      "sixty minutes"
    ],
    "explanation": "One standard solar hour contains exactly 60 sexagesimal minutes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-413",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a feathered bird with a bright red comb on my head. I flap my wings and crow loudly at dawn to wake the whole village. What am I?",
    "hint1": "I am the male domestic fowl.",
    "hint2": "Cock-a-doodle-doo is my morning cry.",
    "answer": "A rooster (cock)",
    "acceptedKeywords": [
      "rooster",
      "a rooster",
      "cock",
      "a cock"
    ],
    "explanation": "A rooster is an adult male chicken (Gallus gallus domesticus) renowned for territorial dawn crowing.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-414",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What breaks the very second you speak its name out loud in a quiet room?",
    "hint1": "Libraries demand that you maintain it.",
    "hint2": "It is the total absence of noise.",
    "answer": "Silence",
    "acceptedKeywords": [
      "silence",
      "quiet",
      "quietness"
    ],
    "explanation": "The act of speaking generates sound vibrations, thereby breaking silence.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-415",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has hinges and a handle, opens to let you into the classroom, and shuts to keep the rain out?",
    "hint1": "You knock on it before entering.",
    "hint2": "It fits inside a door frame.",
    "answer": "A door",
    "acceptedKeywords": [
      "door",
      "a door",
      "classroom door"
    ],
    "explanation": "A door is a hinged barrier used to open and close an entranceway.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-401",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the biological system of vessels in vascular plants that transports water and dissolved mineral ions upward from the roots to the leaves. What tissue am I?",
    "hint1": "Phloem transports sugars; I transport water.",
    "hint2": "My name starts with the letter 'X'.",
    "answer": "Xylem",
    "acceptedKeywords": [
      "xylem",
      "xylem tissue",
      "xylem vessels"
    ],
    "explanation": "Xylem conducts water and inorganic ions upward through capillary action and transpirational suction.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-402",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a wooden comb, symbolizing feminine beauty, cleanliness, and gentle caring qualities. What symbol am I?",
    "hint1": "Duafe means wooden comb in Akan.",
    "hint2": "It represents love and grooming.",
    "answer": "Duafe",
    "acceptedKeywords": [
      "duafe",
      "the duafe",
      "wooden comb symbol"
    ],
    "explanation": "Duafe is the Adinkra symbol of the wooden comb, representing cleanliness, hygiene, and beauty.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-403",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the only geometric shape where every point along its perimeter boundary is located at the exact same distance from its center?",
    "hint1": "The distance is called the radius.",
    "hint2": "It is drawn using a compass.",
    "answer": "A circle",
    "acceptedKeywords": [
      "circle",
      "a circle"
    ],
    "explanation": "By definition, a circle is the locus of all coplanar points equidistant from a central origin.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-404",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the lowest temperature theoretically possible in the universe, where all thermal molecular motion ceases. What point am I on the Kelvin scale?",
    "hint1": "It corresponds to -273.15°C.",
    "hint2": "Zero Kelvin.",
    "answer": "Absolute zero (0 Kelvin)",
    "acceptedKeywords": [
      "absolute zero",
      "0 kelvin",
      "0 k",
      "zero kelvin"
    ],
    "explanation": "Absolute zero (0 K) is the thermodynamic limit where fundamental particles possess minimal zero-point vibrational energy.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-405",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am an English word of six letters. Remove one letter from me and twelve remain. What word am I?",
    "hint1": "Twelve items make a...",
    "hint2": "D-O-Z-E-N-S minus S is DOZEN.",
    "answer": "Dozens",
    "acceptedKeywords": [
      "dozens",
      "the word dozens"
    ],
    "explanation": "Removing the letter 's' from 'dozens' leaves 'dozen', which represents the number twelve.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-406",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A girl kicks a football across an empty field. Without bouncing off any wall, fence, or object, and without being kicked or caught by anyone, the ball rolls straight back to her feet. How?",
    "hint1": "Think about the angle she kicked it.",
    "hint2": "She kicked it straight up into the air.",
    "answer": "She kicked it straight up into the sky",
    "acceptedKeywords": [
      "kicked it up",
      "straight up",
      "up into the air",
      "kicked it upwards"
    ],
    "explanation": "Kicking the football straight up causes gravity to decelerate it and return it straight back down.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-407",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an ancient mud-and-stick mosque in the Savannah Region of Ghana, built in Sudanese architectural style with projecting timber stakes. What landmark am I?",
    "hint1": "Located in the West Gonja District.",
    "hint2": "Famous white mud mosque founded in the 17th century.",
    "answer": "Larabanga Mosque",
    "acceptedKeywords": [
      "larabanga mosque",
      "larabanga",
      "the larabanga mosque"
    ],
    "explanation": "Larabanga Mosque is Ghana's oldest mud-brick mosque, constructed in historic Sudanic architectural style.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-408",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the human sensory organ that contains the cochlea, auditory nerve, and three tiny bones: the malleus, incus, and stapes. What am I?",
    "hint1": "You use me to listen to spoken words.",
    "hint2": "I also maintain bodily balance.",
    "answer": "The ear",
    "acceptedKeywords": [
      "ear",
      "the ear",
      "human ear",
      "ears"
    ],
    "explanation": "The ear transduces acoustic pressure waves into electrical nerve impulses via the tympanic membrane and cochlea.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-409",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the area of a rectangular school vegetable plot that is 12 metres long and 8 metres wide?",
    "hint1": "Multiply length by width.",
    "hint2": "12 × 8.",
    "answer": "96 square metres",
    "acceptedKeywords": [
      "96",
      "96 square metres",
      "96 sq m",
      "96m2"
    ],
    "explanation": "Area = length × width = 12 × 8 = 96 m².",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-410",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a container that has no lock, lid, or key, yet golden treasure is kept safely inside my shell until you crack me in the frying pan. What am I?",
    "hint1": "Laid by hens.",
    "hint2": "Contains egg yolk and albumen.",
    "answer": "An egg",
    "acceptedKeywords": [
      "egg",
      "an egg",
      "hen egg",
      "bird egg"
    ],
    "explanation": "An egg encases its golden nutrient yolk within a brittle protective calcium carbonate shell.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-411",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man pushes his car up to a hotel and immediately shouts that he is completely bankrupt. He was not injured and his car has no mechanical fault. How is this possible?",
    "hint1": "He is playing a board game.",
    "hint2": "Monopoly.",
    "answer": "He is playing the board game Monopoly",
    "acceptedKeywords": [
      "monopoly",
      "playing monopoly",
      "board game monopoly"
    ],
    "explanation": "In the game of Monopoly, landing on an opponent's hotel property with your car token can cause financial bankruptcy.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-412",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the dense central core of an atom that contains protons and neutrons, packing nearly 99.9% of the atom's total mass. What am I?",
    "hint1": "Electrons orbit around me.",
    "hint2": "Discovered by Ernest Rutherford in the gold foil experiment.",
    "answer": "The nucleus",
    "acceptedKeywords": [
      "nucleus",
      "the nucleus",
      "atomic nucleus"
    ],
    "explanation": "The atomic nucleus is the positive, dense central core composed of bound nucleons.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-413",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am Ghana's largest and most famous wildlife protected area, located near Damongo, where wild elephants, roan antelopes, and baboons roam freely across the savanna. What national park am I?",
    "hint1": "Located in the Savannah Region.",
    "hint2": "Begins with the letter 'M'.",
    "answer": "Mole National Park",
    "acceptedKeywords": [
      "mole national park",
      "mole park",
      "mole"
    ],
    "explanation": "Mole National Park is Ghana's primary wildlife reserve, spanning over 4,500 square kilometers of savanna.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-414",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the average (arithmetic mean) of the numbers 10, 20, 30, 40, and 50?",
    "hint1": "Sum them up (150) and divide by 5.",
    "hint2": "It is the middle number of the symmetrical sequence.",
    "answer": "30",
    "acceptedKeywords": [
      "30",
      "thirty"
    ],
    "explanation": "(10 + 20 + 30 + 40 + 50) / 5 = 150 / 5 = 30.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-415",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has many rings around its body, but no fingers to wear jewelry? I am a planet in our solar system!",
    "hint1": "The sixth planet from the sun.",
    "hint2": "Famous for my icy ring system.",
    "answer": "Saturn",
    "acceptedKeywords": [
      "saturn",
      "planet saturn"
    ],
    "explanation": "Saturn is encircled by an extensive planetary ring system of ice particles, rocky debris, and dust.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-401",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the fundamental constant in physics representing the quantum of electromagnetic action, denoted by h. Max Planck introduced me in 1900. What constant am I?",
    "hint1": "Value is approx 6.626 × 10⁻³⁴ J·s.",
    "hint2": "Connects photon energy to frequency: E = hf.",
    "answer": "Planck's constant",
    "acceptedKeywords": [
      "planck's constant",
      "planck constant",
      "plancks constant"
    ],
    "explanation": "Planck's constant relates the energy of a photon to its wave frequency (E = hν).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-402",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In polynomial algebra, what is the discriminant formula for a quadratic equation ax² + bx + c = 0 that determines whether the roots are real or complex?",
    "hint1": "Found under the square root in the quadratic formula.",
    "hint2": "b² - 4ac.",
    "answer": "b squared minus 4ac",
    "acceptedKeywords": [
      "b^2 - 4ac",
      "b^2-4ac",
      "b squared minus 4ac",
      "discriminant"
    ],
    "explanation": "The discriminant Δ= b² - 4ac indicates two distinct real roots (Δ> 0), one repeated root (Δ= 0), or complex roots (Δ< 0).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-403",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Hard",
    "question": "I am the specialized cell division process that produces four haploid gamete sex cells (sperm or egg), each containing half the chromosomes of the parent cell. What am I?",
    "hint1": "Mitosis produces two diploid cells; I produce four haploid cells.",
    "hint2": "Involves crossing over during Prophase I.",
    "answer": "Meiosis",
    "acceptedKeywords": [
      "meiosis",
      "meiotic division"
    ],
    "explanation": "Meiosis reduces chromosome ploidy from diploid (2n) to haploid (n), introducing genetic variation via independent assortment and recombination.",
    "isCentral": true,
    "category": "Science & Nature"
  },
  {
    "id": "tt-riddle-sch-404",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 19th-century Ashanti scholar, diplomat, and statesman who represented the Kingdom in negotiations with British envoys and documented early administrative records. Who was I?",
    "hint1": "A famous Ashanti linguist and historian.",
    "hint2": "Worked closely with Asantehene Prempeh I.",
    "answer": "John Owusu-Ansa (or Okyeame Kwame Frimpon)",
    "acceptedKeywords": [
      "owusu-ansa",
      "john owusu ansa",
      "okyeame"
    ],
    "explanation": "Prince John Owusu-Ansa served as an influential Ashanti diplomatic envoy during Anglo-Ashanti negotiations in the late 19th century.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-405",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A lightbulb sits inside a closed, insulated wooden box. Outside are three toggle switches labeled 1, 2, and 3. Exactly one switch turns on the lightbulb. You may enter the room to inspect the bulb only ONCE. How do you identify the switch?",
    "answer": "Turn Switch 1 ON for 10 minutes, turn it OFF, turn Switch 2 ON, and enter immediately: if lit, it is 2; if dark but warm, it is 1; if dark and cold, it is 3.",
    "explanation": "Using heat as a second physical indicator isolates the three possibilities across a single visual entry test.",
    "hint1": "Lightbulbs produce both photons and thermal heat.",
    "hint2": "Use time to heat the filament before turning it off.",
    "acceptedKeywords": [
      "turn on switch 1 then switch 2",
      "turn switch 1 on feel heat",
      "heat",
      "feel the bulb",
      "bulb is warm"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-406",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the property of a fluid that represents its internal resistance to flow and shear deformation. Honey and motor oil have a high measure of me compared to water. What am I?",
    "hint1": "Measured in poise or pascal-seconds.",
    "hint2": "Informally called fluid thickness.",
    "answer": "Viscosity",
    "acceptedKeywords": [
      "viscosity",
      "fluid viscosity"
    ],
    "explanation": "Viscosity measures a fluid's internal friction resisting adjacent shearing layers from sliding past one another.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-407",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What 11-letter word begins with the letters 'D-E-C', ends with 'I-O-N', and refers to the scientific cognitive process of selecting between alternative options?",
    "hint1": "Judges make it in court.",
    "hint2": "Decision...",
    "answer": "Decision",
    "acceptedKeywords": [
      "decision",
      "decisions",
      "declaration"
    ],
    "explanation": "A decision is the cognitive conclusion reached after deliberating over available choices.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-408",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "What is the logarithm of 1,000 to the base 10 (log₁₀ 1000)?",
    "hint1": "What power must 10 be raised to in order to equal 1,000?",
    "hint2": "10³ = 1000.",
    "answer": "Three (3)",
    "acceptedKeywords": [
      "3",
      "three"
    ],
    "explanation": "Because 10³ = 1,000, log₁₀(1000) = 3.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-409",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A cylindrical glass beaker filled with water weighs 500 grams. When oil is added, it floats on top and the total weight is 650 grams. If the beaker and oil are dumped and filled entirely with oil, does it weigh more or less than 500 grams?",
    "answer": "It weighs less than 500 grams because oil is less dense than water.",
    "explanation": "Because oil floats on water, its density is lower (approx 0.8–0.9 g/cm³ compared to 1.0 g/cm³ for water). The identical volume of oil weighs less than that volume of water.",
    "hint1": "Why does oil float on top of water?",
    "hint2": "Density of oil is lower than water.",
    "acceptedKeywords": [
      "less",
      "less than 500 grams",
      "it weighs less",
      "weighs less"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-410",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the law of electrostatics stating that the electric force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them. What law am I?",
    "hint1": "Formula: F = k |q₁ q₂| / r².",
    "hint2": "Named after Charles-Augustin de...",
    "answer": "Coulomb's Law",
    "acceptedKeywords": [
      "coulomb's law",
      "coulombs law",
      "coulomb law"
    ],
    "explanation": "Coulomb's Law quantifies the electrostatic force of attraction or repulsion between electrical charges.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-411",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the first President of Ghana, spearheading national independence in 1957 and championing the formation of the Organization of African Unity (OAU). Who am I?",
    "hint1": "Founder of the Convention People's Party (CPP).",
    "hint2": "His mausoleum stands in downtown Accra.",
    "answer": "Dr. Kwame Nkrumah",
    "acceptedKeywords": [
      "kwame nkrumah",
      "dr kwame nkrumah",
      "nkrumah"
    ],
    "explanation": "Dr. Kwame Nkrumah led Ghana to sovereignty from British colonial rule on March 6, 1957, as the nation's inaugural Prime Minister and President.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-412",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In probability theory, what is the probability of rolling a total sum of 12 when rolling two standard six-sided dice?",
    "hint1": "There is only one roll that produces 12: (6, 6).",
    "hint2": "There are 36 total outcomes.",
    "answer": "1/36",
    "acceptedKeywords": [
      "1/36",
      "one out of 36",
      "1 in 36"
    ],
    "explanation": "Only one ordered pair (6,6) out of 36 possible outcomes yields a sum of 12, giving P = 1/36.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-413",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the gas that comprises approximately 78% of Earth's atmosphere by volume, diatomic in nature (N₂), and fixed into nitrates by soil rhizobia bacteria. What element am I?",
    "hint1": "Atomic number 7.",
    "hint2": "Chemical symbol N.",
    "answer": "Nitrogen",
    "acceptedKeywords": [
      "nitrogen",
      "nitrogen gas",
      "n2"
    ],
    "explanation": "Molecular nitrogen (N₂) forms 78.08% of Earth's air, requiring biological or industrial fixation to become bioavailable.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-414",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a 9-letter word in English that reads the exact same forward and backward. I describe a mechanical water vessel used to transport cars across a river. What palindrome am I?",
    "hint1": "Spelled: R-A-C-E-C-A-R has seven letters.",
    "hint2": "R-O-T-A-T-O-R has seven letters. Think of R-E-D-I-V-I-D-E-R.",
    "answer": "Redivider (or Racecar)",
    "acceptedKeywords": [
      "redivider",
      "rotator",
      "racecar"
    ],
    "explanation": "'Redivider' is a 9-letter palindrome that reads identically in both directions.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-415",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A metal cube with side length 3 cm is dipped into blue paint so all its exterior faces are coated. It is then sliced into 27 small 1-cm cubes. How many of the small cubes have zero paint on any face?",
    "hint1": "The small cubes in the very center have no exterior exposure.",
    "hint2": "(3 - 2)³.",
    "answer": "1 small cube",
    "acceptedKeywords": [
      "1",
      "one",
      "1 cube",
      "one cube",
      "1 small cube"
    ],
    "explanation": "Only the single core cube in the internal center (3-2) × (3-2) × (3-2) = 1 has zero contact with exterior paint.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-501",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a bright arc of seven colors painted across the sky when sunshine shines through falling rain. What am I?",
    "hint1": "Red, orange, yellow, green, blue, indigo, violet.",
    "hint2": "I appear during sunny rain showers.",
    "answer": "A rainbow",
    "acceptedKeywords": [
      "rainbow",
      "a rainbow"
    ],
    "explanation": "Rainbows form when sunlight undergoes refraction, internal reflection, and dispersion inside spherical raindrops.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-502",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am an oval geometric shape that looks like a flattened circle or an egg. What flat shape am I?",
    "hint1": "Think of an egg's silhouette.",
    "hint2": "Begins with the letter 'O'.",
    "answer": "An oval (or ellipse)",
    "acceptedKeywords": [
      "oval",
      "an oval",
      "ellipse",
      "an ellipse"
    ],
    "explanation": "An oval is an elongated closed curve resembling an egg or flattened circle.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-503",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has bristles at one end, visits your teeth twice every day with minty paste, and keeps your smile bright?",
    "hint1": "You hold its plastic handle every morning.",
    "hint2": "You brush your teeth with it.",
    "answer": "A toothbrush",
    "acceptedKeywords": [
      "toothbrush",
      "a toothbrush"
    ],
    "explanation": "A toothbrush is an oral hygiene instrument fitted with nylon bristles used to clean teeth.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-504",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a yellow insect that buzzes around flowering garden beds. I drink sweet nectar and help flowers make seeds. What am I?",
    "hint1": "I live in a colony and make golden honey.",
    "hint2": "I can sting if threatened.",
    "answer": "A honeybee",
    "acceptedKeywords": [
      "bee",
      "a bee",
      "honeybee",
      "a honeybee"
    ],
    "explanation": "Honeybees are flying hymenopteran insects that pollinate flowering plants and produce honey.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-505",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Carved from smooth wood, I have two deep parallel rows of small cups and use nickernut seeds for counting and capturing. What ancient West African game board am I?",
    "hint1": "Known as Mancala or Oware in Ghana.",
    "hint2": "Played with 48 seeds.",
    "answer": "Oware",
    "acceptedKeywords": [
      "oware",
      "mancala",
      "oware board",
      "awele"
    ],
    "explanation": "Oware is an ancient Ashanti pit-and-pebble abstract strategy game in the Mancala family.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-506",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I have a metal frame, two pedals, and two rubber wheels. I move forward when you pedal and keep your balance. What am I?",
    "hint1": "You ride me down the street.",
    "hint2": "Starts with 'Bi-'.",
    "answer": "A bicycle",
    "acceptedKeywords": [
      "bicycle",
      "a bicycle",
      "bike",
      "a bike"
    ],
    "explanation": "A bicycle is a pedal-driven, human-powered vehicle with two tandem wheels.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-507",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "If you have 12 fresh eggs in an egg crate and 5 are boiled for breakfast, how many raw eggs remain in the crate?",
    "hint1": "Subtract 5 from 12.",
    "hint2": "Count down: 12 minus 5.",
    "answer": "7 eggs",
    "acceptedKeywords": [
      "7",
      "seven",
      "7 eggs",
      "seven eggs"
    ],
    "explanation": "12 - 5 = 7. Seven raw eggs remain in the crate.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-508",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am an eight-legged weaver who spins silky, sticky webs between mango tree branches to catch flying flies. What creature am I?",
    "hint1": "Kweku Ananse takes my shape in stories.",
    "hint2": "I am an arachnid, not an insect.",
    "answer": "A spider",
    "acceptedKeywords": [
      "spider",
      "a spider",
      "ananse"
    ],
    "explanation": "Spiders are predatory arachnids that spin silk webs from abdominal spinnerets to trap prey.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-509",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has many teeth along a steel blade, cuts firewood with a push and pull, but never eats a single bite of food?",
    "hint1": "Carpenters use it to cut timber planks.",
    "hint2": "It makes a zipping sound through wood.",
    "answer": "A saw",
    "acceptedKeywords": [
      "saw",
      "a saw",
      "handsaw",
      "a handsaw"
    ],
    "explanation": "A saw is a cutting tool with a toothed metal edge designed to slice through lumber.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-510",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has a handle and bristles on its head, sweeps sand off the school veranda every morning, and rests behind the door?",
    "hint1": "You sweep the dirt with it.",
    "hint2": "Known in Akan as praye.",
    "answer": "A broom",
    "acceptedKeywords": [
      "broom",
      "a broom",
      "praye"
    ],
    "explanation": "A broom is a cleaning bundle of stiff fibers mounted to a handle for sweeping floors.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-511",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a golden-orange root crop with rough brown skin. When boiled and mashed with palm oil and boiled eggs, I become the beloved dish called Oto. What tuber am I?",
    "hint1": "I am a staple yam.",
    "hint2": "Water yam or sweet yam.",
    "answer": "Yam",
    "acceptedKeywords": [
      "yam",
      "a yam",
      "yams",
      "water yam"
    ],
    "explanation": "Yam (Dioscorea) is an essential West African agricultural tuber used in ceremonial dishes like Oto.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-512",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "How many individual months make up one full calendar year?",
    "hint1": "From January to December.",
    "hint2": "A dozen months.",
    "answer": "12 months",
    "acceptedKeywords": [
      "12",
      "twelve",
      "12 months",
      "twelve months"
    ],
    "explanation": "A standard Gregorian calendar year is divided into 12 months.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-513",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I hatch out of an egg with scales on my skin, no legs, and slither silently through garden grass. What reptile am I?",
    "hint1": "I flick my forked tongue to smell the air.",
    "hint2": "I hiss when alarmed.",
    "answer": "A snake",
    "acceptedKeywords": [
      "snake",
      "a snake",
      "serpent"
    ],
    "explanation": "Snakes are elongated, legless, carnivorous reptiles in the suborder Serpentes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-514",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a frame, hangs on the wall, and always shows you your own smiling face when you look at it?",
    "hint1": "You look at it while combing your hair.",
    "hint2": "It reflects light.",
    "answer": "A mirror",
    "acceptedKeywords": [
      "mirror",
      "a mirror",
      "looking glass"
    ],
    "explanation": "A mirror has a smooth reflective silver backing that specularly reflects light rays.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-515",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has a roof, walls, doors, and windows, and keeps a family safe and dry from night rain?",
    "hint1": "Where you return after school.",
    "hint2": "It is your home.",
    "answer": "A house (home)",
    "acceptedKeywords": [
      "house",
      "a house",
      "home",
      "a home"
    ],
    "explanation": "A house is a permanent residential building providing shelter and domestic space.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-501",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the vascular tissue in plants that transports synthesized organic sugars from the green leaves downward and throughout the plant. What tissue am I?",
    "hint1": "Xylem carries water upward; I carry sugars everywhere.",
    "hint2": "Starts with 'Ph-'.",
    "answer": "Phloem",
    "acceptedKeywords": [
      "phloem",
      "phloem tissue",
      "phloem vessels"
    ],
    "explanation": "Phloem is the living vascular tissue responsible for translocation of photoassimilates (soluble organic compounds) in plants.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-502",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a ram's horns, symbolizing strength of mind, humility, and courage. What symbol am I?",
    "hint1": "Called Dwennimmen in Akan.",
    "hint2": "Rams fight fiercely but submit quietly.",
    "answer": "Dwennimmen (Ram's Horns)",
    "acceptedKeywords": [
      "dwennimmen",
      "ram's horns",
      "dwennimen"
    ],
    "explanation": "Dwennimmen (Ram's Horns) symbolizes that even the strong must remain humble and self-restrained.",
    "isCentral": true,
    "category": "African Wisdom"
  },
  {
    "id": "tt-riddle-app-503",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the name of a polygon that possesses exactly eight straight sides and eight interior angles?",
    "hint1": "A stop sign has this shape.",
    "hint2": "Prefix 'Octa-' means eight.",
    "answer": "An octagon",
    "acceptedKeywords": [
      "octagon",
      "an octagon"
    ],
    "explanation": "An octagon is an eight-sided planar polygon with interior angles summing to 1080°.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-504",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the process by which a solid substance turns directly into a gas without melting into an intermediate liquid state first, like dry ice or mothballs. What physical change am I?",
    "hint1": "The opposite of deposition.",
    "hint2": "Starts with 'Sub-'.",
    "answer": "Sublimation",
    "acceptedKeywords": [
      "sublimation",
      "the sublimation"
    ],
    "explanation": "Sublimation is an endothermic phase transition where matter transitions directly from solid to gaseous state below its triple point.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-505",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What 8-letter English word contains the first six letters of the alphabet (A, B, C, D, E, F) and means helpful comments given to improve your work?",
    "hint1": "Teachers give this to you after marking your essay or project.",
    "hint2": "Starts with F-E-E-D and ends with B-A-C-K.",
    "answer": "Feedback",
    "acceptedKeywords": [
      "feedback",
      "the feedback"
    ],
    "explanation": "'Feedback' contains the initial alphabet sequence letters A, B, C, D, E, F within an 8-letter common word.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-506",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A grandfather, his son, and his grandson enter a tailor shop in Kumasi to buy trousers. Each person purchases one pair of trousers. The tailor sells exactly two pairs of trousers. How?",
    "answer": "The shopkeeper counted incorrectly, or one was a baby who needed no trousers; or only two people were actually present (father and son).",
    "explanation": "If there are three generations present, they must buy three pairs; for two pairs, the customer group consisted strictly of two people (a father and his son).",
    "hint1": "How many actual humans entered?",
    "hint2": "Two men were there: one father and one son.",
    "acceptedKeywords": [
      "only two people",
      "father and son",
      "two men"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-507",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am the coastal colonial fort in Cape Coast where thousands of enslaved Africans walked through the 'Door of No Return'. What historical castle am I?",
    "hint1": "Located in the Central Region.",
    "hint2": "Cape Coast...",
    "answer": "Cape Coast Castle",
    "acceptedKeywords": [
      "cape coast castle",
      "the cape coast castle"
    ],
    "explanation": "Cape Coast Castle is a UNESCO World Heritage site and monumental fortress central to transatlantic slave trade history.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-508",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the human respiratory organ where inhaled oxygen diffuses across microscopic alveoli sacs into red blood capillaries. What paired organ am I?",
    "hint1": "Located inside the ribcage.",
    "hint2": "You inhale air into me.",
    "answer": "The lungs",
    "acceptedKeywords": [
      "lungs",
      "the lungs",
      "lung"
    ],
    "explanation": "The lungs are primary respiratory organs facilitating gas exchange between alveolar air and pulmonary blood.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-509",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the volume of a rectangular wooden box that is 5 centimetres long, 4 centimetres wide, and 3 centimetres tall?",
    "hint1": "Multiply length × width × height.",
    "hint2": "5 × 4 × 3.",
    "answer": "60 cubic centimetres",
    "acceptedKeywords": [
      "60",
      "60 cubic centimetres",
      "60 cm3",
      "60 cm^3"
    ],
    "explanation": "Volume = l × w × h = 5 × 4 × 3 = 60 cm³.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-510",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am taken from a coal mine, shut up in a wooden pencil case, and never released, yet I am used by every student to write mathematics. What am I?",
    "hint1": "Pencil lead is made of me.",
    "hint2": "An allotrope of carbon starting with G.",
    "answer": "Graphite (pencil lead)",
    "acceptedKeywords": [
      "graphite",
      "pencil lead",
      "lead"
    ],
    "explanation": "Pencil cores are manufactured from powdered graphite mixed with clay binder.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-511",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "What can you catch with your hands, but can never throw back to anyone?",
    "hint1": "It makes your nose run.",
    "hint2": "A winter or rainy season illness.",
    "answer": "A cold",
    "acceptedKeywords": [
      "a cold",
      "cold",
      "common cold"
    ],
    "explanation": "To 'catch a cold' is an idiomatic phrase for contracting a viral rhinovirus infection.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-512",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the positively charged subatomic particle residing in the atomic nucleus, with a mass roughly 1,836 times that of an electron. What am I?",
    "hint1": "Atomic number equals the count of my particles.",
    "hint2": "Opposite of an electron.",
    "answer": "A proton",
    "acceptedKeywords": [
      "proton",
      "a proton",
      "protons"
    ],
    "explanation": "Protons are positively charged composite baryons composed of two up quarks and one down quark.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-513",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am Ghana's longest suspension canopy walkway, suspended over 30 metres above the tropical rainforest floor in the Central Region. What national park am I in?",
    "hint1": "Famous canopy walkway near Cape Coast.",
    "hint2": "Begins with K.",
    "answer": "Kakum National Park",
    "acceptedKeywords": [
      "kakum",
      "kakum national park",
      "kakum park"
    ],
    "explanation": "Kakum National Park features a famous 350-metre aerial canopy walkway traversing moist evergreen rainforest.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-514",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the median value of the numbers 7, 3, 9, 1, and 5?",
    "hint1": "Arrange them in order first: 1, 3, 5, 7, 9.",
    "hint2": "Find the middle value.",
    "answer": "5",
    "acceptedKeywords": [
      "5",
      "five"
    ],
    "explanation": "Ordering the dataset {1, 3, 5, 7, 9} identifies 5 as the middle median value.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-515",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can you hold in your right hand that you can never hold in your left hand?",
    "hint1": "Look down at your own body.",
    "hint2": "Your left hand itself.",
    "answer": "Your left hand (or left elbow)",
    "acceptedKeywords": [
      "left hand",
      "your left hand",
      "my left hand",
      "left elbow"
    ],
    "explanation": "A hand cannot physically grasp or hold itself as an external object.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-501",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the principle in fluid mechanics stating that any change in pressure applied to an enclosed incompressible fluid is transmitted undiminished throughout the fluid and to the walls of its container. What law am I?",
    "hint1": "It explains hydraulic car brakes and lifts.",
    "hint2": "Named after Blaise...",
    "answer": "Pascal's Principle (Pascal's Law)",
    "acceptedKeywords": [
      "pascal's law",
      "pascal's principle",
      "pascals law",
      "pascal law"
    ],
    "explanation": "Pascal's Principle dictates uniform transmission of hydrostatic pressure across enclosed fluid systems.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-502",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In Cartesian geometry, what is the distance between the origin point (0,0) and the coordinate point (6,8)?",
    "hint1": "Use the Pythagorean theorem: √(6² + 8²).",
    "hint2": "√(36 + 64) = √(100).",
    "answer": "10 units",
    "acceptedKeywords": [
      "10",
      "10 units",
      "ten"
    ],
    "explanation": "d = √((6-0)² + (8-0)²) = √(36 + 64) = √(100) = 10.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-503",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the organelle nicknamed the 'cellular suicide sac', containing hydrolytic digestive enzymes that break down cellular debris, foreign pathogens, and worn-out organelles. What am I?",
    "hint1": "Formed by the Golgi apparatus.",
    "hint2": "Starts with 'Lyso-'.",
    "answer": "A lysosome",
    "acceptedKeywords": [
      "lysosome",
      "a lysosome",
      "lysosomes"
    ],
    "explanation": "Lysosomes maintain an acidic internal pH to enzymatically hydrolyze biological polymers and catabolize waste.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-504",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the legendary 17th-century high priest and chief advisor to Asantehene Osei Tutu I, co-founding the Ashanti Kingdom and commanding the Golden Stool from the heavens. Who was I?",
    "hint1": "An unmovable sword planted by me remains in Kumasi Komfo Anokye Hospital grounds.",
    "hint2": "Okomfo...",
    "answer": "Okomfo Anokye",
    "acceptedKeywords": [
      "okomfo anokye",
      "anokye",
      "komfo anokye"
    ],
    "explanation": "Okomfo Anokye was the constitutional architect and spiritual co-founder of the Ashanti Empire in the late 17th century.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-505",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A man stands on a frozen lake where there is absolutely zero friction between his shoes and the ice. He has no pole, no wind blows, and nothing touches him. How can he propel himself off the ice to the shore?",
    "answer": "By taking off a shoe or heavy item and throwing it forcefully in the opposite direction.",
    "explanation": "By Newton's Third Law (conservation of linear momentum), hurling mass away produces an equal and opposite reaction force that slides him to shore.",
    "hint1": "Newton's Third Law of Motion.",
    "hint2": "Throw an object you are wearing away from the shore.",
    "acceptedKeywords": [
      "throw a shoe",
      "throw something",
      "throw an object",
      "throw his shoe",
      "blow air"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-506",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the empirical law of physics stating that the electric current through a conductor between two points is directly proportional to the voltage across the two points (V = IR). What law am I?",
    "hint1": "Named after Georg Simon...",
    "hint2": "Resistance is measured in ohms.",
    "answer": "Ohm's Law",
    "acceptedKeywords": [
      "ohm's law",
      "ohms law",
      "ohm law"
    ],
    "explanation": "Ohm's Law formulates the direct linear relationship between potential difference and current via ohmic resistance.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-507",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a fast-flying insect with two pairs of transparent wings that hovers over ponds. My compound name combines a mythical fire-breathing creature with a flying insect. What am I?",
    "hint1": "My first six letters name a mythical winged reptile.",
    "hint2": "My last three letters are F-L-Y.",
    "answer": "Dragonfly (or Firefly)",
    "acceptedKeywords": [
      "dragonfly",
      "firefly"
    ],
    "explanation": "A dragonfly or firefly combines insect prefixes with phonetic compounding.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-508",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In basic combinatorics, how many distinct ways can 4 students stand in a single straight queue line?",
    "hint1": "Calculate 4 factorial (4!).",
    "hint2": "4 × 3 × 2 × 1.",
    "answer": "24 ways",
    "acceptedKeywords": [
      "24",
      "24 ways",
      "twenty-four"
    ],
    "explanation": "4! = 4 × 3 × 2 × 1 = 24 distinct permutations.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-509",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A clock shows 3:15. What is the precise angle between the hour hand and the minute hand in degrees?",
    "answer": "7.5 degrees",
    "explanation": "At 3:15, the minute hand points at 90°. The hour hand has advanced 15/60 of a 30-degree sector (0.25 × 30° = 7.5°), yielding an angle of 7.5°.",
    "hint1": "Does the hour hand stay exactly on 3 when 15 minutes pass?",
    "hint2": "The hour hand advances by half a degree every minute.",
    "acceptedKeywords": [
      "7.5",
      "7.5 degrees",
      "7.5°",
      "7 and a half degrees"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-510",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the thermodynamic cycle in internal combustion engines or power plants that sets the theoretical maximum possible efficiency for converting heat into work. What ideal heat engine am I?",
    "hint1": "Formula: η = 1 - T_C / T_H.",
    "hint2": "Named after French physicist Sadi...",
    "answer": "The Carnot cycle (Carnot engine)",
    "acceptedKeywords": [
      "carnot cycle",
      "carnot engine",
      "carnot",
      "carnot heat engine"
    ],
    "explanation": "The Carnot cycle establishes the theoretical thermodynamic efficiency limit for any reversible engine operating between two thermal reservoirs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-511",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 19th-century Fante confederation treaty signed in Mankessim in 1871 that created an early democratic African constitution for self-governance and industrial education. What confederation was I?",
    "hint1": "Formed by Fante chiefs and educated elite.",
    "hint2": "Fante...",
    "answer": "The Fante Confederation",
    "acceptedKeywords": [
      "fante confederation",
      "the fante confederation"
    ],
    "explanation": "The Fante Confederation of 1871 was an early constitutional initiative for African modern statecraft, self-determination, and education.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-512",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In right-angled trigonometry, what is the sine of a 30-degree angle (sin 30°)?",
    "hint1": "It is exactly one half.",
    "hint2": "0.5.",
    "answer": "0.5 (or 1/2)",
    "acceptedKeywords": [
      "0.5",
      "1/2",
      "half",
      "one half"
    ],
    "explanation": "In a 30°-60°-90° triangle, the ratio of opposite side to hypotenuse yields sin 30° = 1/2.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-513",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the chemical process where glucose is partially broken down into pyruvate inside cell cytoplasm in the absence of oxygen, yielding a net 2 ATP molecules. What am I?",
    "hint1": "The initial pathway of cellular respiration.",
    "hint2": "Begins with 'Glyco-'.",
    "answer": "Glycolysis",
    "acceptedKeywords": [
      "glycolysis",
      "the glycolysis"
    ],
    "explanation": "Glycolysis is the anaerobic ten-step enzymatic metabolic pathway that converts glucose into pyruvate, yielding 2 ATP and 2 NADH.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-514",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What 5-letter word can follow 'sun', 'star', and 'fire' to form three compound words, and provides illumination?",
    "hint1": "Sun..., Star..., Fire...",
    "hint2": "Spelled L-I-G-H-T.",
    "answer": "Light (or Fish / Fly)",
    "acceptedKeywords": [
      "light",
      "fly"
    ],
    "explanation": "'Light' yields sunlight, starlight, and firelight; 'fly' yields firefly, etc.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-515",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A rope bridge across a gorge in the forest can support a maximum of 100 kg. A courier weighing 90 kg must carry two golden spheres weighing 6 kg each across in one continuous trip. How does he cross without breaking the bridge?",
    "answer": "He juggles the spheres while walking across, though physics shows the dynamic catching force still exceeds 100 kg, meaning he must roll one across or make two trips.",
    "explanation": "Real physics proves juggling creates downward impulse forces exceeding static weight (F > mg); thus he must roll one sphere ahead or make two sequential crossings.",
    "hint1": "Consider whether dynamic impact forces of catching exceed static weight.",
    "hint2": "Roll or slide one across the bridge first.",
    "acceptedKeywords": [
      "roll one",
      "make two trips",
      "roll one across",
      "juggle",
      "slide one"
    ],
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
  },
  {
    "id": "tt-debate-nov-201",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary schools should allow pupils to bring household pets into the classroom on Fridays.",
    "context": "Proponents argue that animal interactions teach compassion, reduce stress, and make biology lessons memorable. Opponents raise concerns about animal bites, hygiene issues, and severe allergic reactions among pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-202",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "All school learning tasks should take place through educational games rather than seated paper exercises.",
    "context": "Advocates claim active gameplay increases enthusiasm, problem-solving speed, and peer teamwork. Skeptics maintain that quiet individual desk work builds patience, handwriting stamina, and focused concentration.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-203",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School dining halls should completely stop serving processed sweets and sugary biscuits during break time.",
    "context": "Supporters emphasize preventing childhood tooth decay, sugar crashes, and poor dietary habits early in life. Opponents believe young children need quick energy and that teaching moderate self-control is better than outright bans.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-204",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be allowed to choose their own classroom desk seats instead of having teachers assign them.",
    "context": "Supporters argue that choosing seats boosts personal autonomy and lets students sit next to comfortable learning partners. Opponents caution that unassigned seating leads to noisy cliques, distractions, and isolation of quieter pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-205",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Daily outdoor physical sports should be compulsory for every single primary school pupil.",
    "context": "Advocates highlight the health benefits of cardiovascular fitness, bone strength, and reducing childhood obesity. Critics note that children have differing physical capabilities and should not be forced into activities that cause stress.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-201",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should install solar panels to generate all their own electricity instead of relying on the national grid.",
    "context": "Proponents argue that solar power provides clean, renewable energy and saves money while shielding schools from power outages. Opponents point out high initial battery installation costs and maintenance expenses during rainy seasons.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-202",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Every upper primary school in Ghana should maintain an active vegetable garden run entirely by students.",
    "context": "Advocates argue that hands-on farming instills respect for agriculture, teaches practical biology, and supplies fresh food. Opponents argue that farm labor can be physically exhausting and detract from preparation for academic assessments.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-203",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Printed paper currency should be phased out entirely in favor of mobile money and digital card payments.",
    "context": "Supporters emphasize faster accounting, reduced theft risk, and improved tracking of commerce. Opponents caution that digital networks suffer from connectivity drops and exclude unbanked rural populations lacking smartphones.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-204",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Basic 4 to 6 students should be allowed to use personal smartphones in class for educational research.",
    "context": "Supporters believe immediate access to online reference materials builds independent research skills. Opponents argue that smartphones introduce major distractions like games and social media while deepening inequality among pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-205",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should ban all competitive ranking of students by position (e.g., 1st, 2nd, 3rd) on terminal report cards.",
    "context": "Advocates claim rank ordering causes anxiety, low self-esteem, and counterproductive rivalry between children. Traditionalists argue that rankings motivate students to work harder and reflect real-world competitive benchmarks.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-201",
    "targetGroup": "Scholar (JHS)",
    "topic": "Mining concessions near major water bodies should be completely and permanently revoked across Ghana.",
    "context": "Environmentalists argue that river pollution by galamsey destroys drinking water, bioaccumulates mercury in fish, and devastates ecosystems. Economic advocates counter that mining contributes export revenue, foreign exchange, and essential mining-sector employment.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-202",
    "targetGroup": "Scholar (JHS)",
    "topic": "Public schools should replace all printed physical libraries with digital e-reader repositories.",
    "context": "Proponents point out that digital libraries store millions of titles at low unit cost and allow instant updating of science textbooks. Critics argue that screens cause ocular fatigue, require power and internet infrastructure, and lack the sensory focus of printed books.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-203",
    "targetGroup": "Scholar (JHS)",
    "topic": "African nations should implement a uniform single currency modeled on the West African Eco.",
    "context": "Economists suggest a common regional currency would boost cross-border trade, lower transaction friction, and integrate regional markets. Skeptics warn that countries would surrender independent monetary policy, making it harder to respond to local economic shocks.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-204",
    "targetGroup": "Scholar (JHS)",
    "topic": "Facial recognition AI surveillance systems should be installed across public transport stations in major cities.",
    "context": "Security experts contend that real-time biometric scanning deters violent crime and helps locate missing persons quickly. Civil liberties groups argue that mass biometric surveillance violates fundamental privacy and exhibits racial classification biases.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-205",
    "targetGroup": "Scholar (JHS)",
    "topic": "National governments should impose legal price caps on essential foodstuffs during inflationary surges.",
    "context": "Supporters argue price controls protect low-income households from malnutrition and prevent exploitative retail price gouging. Classical economists argue price ceilings create severe hoarding, black markets, and disincentivize farmers from producing crops.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-301",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be allowed to speak their local Ghanaian languages during all school play breaks.",
    "context": "Supporters believe speaking indigenous languages builds cultural pride and emotional communication among young children. Opponents argue that maintaining English immersion during school hours helps master the official language of instruction.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-302",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Classrooms should keep indoor live plants that pupils water every morning.",
    "context": "Advocates claim caring for classroom plants teaches daily responsibility and environmental appreciation. Critics argue that potting soil creates mess, attracts insects, and can trigger pollen allergies.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-303",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School bags should only contain books needed for that specific day rather than all subjects.",
    "context": "Proponents point out that heavy bags strain developing children's spines and cause postural fatigue. Opponents argue that carrying all books prevents forgotten supplies when class timetables change unexpectedly.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-304",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary schools should hold storytelling sessions instead of written grammar drills on Friday afternoons.",
    "context": "Advocates argue that oral storytelling sparks creativity, verbal confidence, and narrative understanding. Opponents argue that early reading and handwriting accuracy require consistent structured practice.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-305",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should replace plastic lunch bowls and cups with metal or calabash alternatives.",
    "context": "Supporters point out that reducing single-use and cheap plastics instills sustainable ecological habits early. Opponents note that metal cups can become uncomfortably hot with warm meals and traditional calabashes are fragile.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-301",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary students should be graded on group project teamwork rather than individual performance.",
    "context": "Advocates emphasize that collaboration mirrors real-world workplace problem solving and fosters interpersonal skills. Critics contend that group grading unfairly penalizes hard-working students when peers contribute unevenly.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-302",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "All school sports should be mixed-gender teams rather than separated by gender.",
    "context": "Proponents argue that mixed teams build mutual respect, dissolve gender stereotypes, and promote athletic camaraderie. Skeptics suggest that physical developmental variations create competitive imbalances and safety issues.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-303",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should mandate that all textbooks use open-source digital copies accessible on low-cost ereaders.",
    "context": "Supporters point out massive textbook cost savings for parents and rapid curriculum update cycles. Skeptics argue that device charging, screen breakage, and rural electricity unreliability disrupt schooling.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-304",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Basic 4 to 6 students should participate in community sanitation and tree planting for two hours each week.",
    "context": "Advocates assert that civic environmental service develops practical patriotism and cleans local ecosystems. Opponents argue that scheduled academic instructional hours should not be replaced by municipal labor.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-305",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Cursive handwriting should no longer be formally taught or graded in primary schools.",
    "context": "Supporters argue that digital typing and neat print handwriting are the only skills demanded by modern life. Opponents maintain that cursive develops fine motor neurological connections, reading fluency, and historical document literacy.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-301",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghana should enforce an immediate legal ban on the importation of second-hand electronic goods and clothing.",
    "context": "Environmentalists argue that imported e-waste and castoff textiles cause toxic fires at Agbogbloshie and stifle local textile manufacturing. Economists warn that bans would destroy livelihoods for thousands of small traders and raise prices for lower-income families.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-302",
    "targetGroup": "Scholar (JHS)",
    "topic": "JHS curricula should teach financial literacy and stock investing instead of Euclidean geometry.",
    "context": "Advocates argue that personal budgeting, inflation mitigation, and entrepreneurial investment prepare students directly for economic survival. Mathematicians maintain that Euclidean proofs instill deductive rigor, spatial logic, and structural abstraction vital for STEM engineering.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-303",
    "targetGroup": "Scholar (JHS)",
    "topic": "Standardized national high-stakes examinations like BECE should be abolished in favor of continuous district assessments.",
    "context": "Opponents of high-stakes testing cite exam malpractice, chronic psychological anxiety, and regional infrastructure disparities. Proponents counter that centralized standardized exams provide objective merit-based criteria unaffected by local school grading favoritism.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-304",
    "targetGroup": "Scholar (JHS)",
    "topic": "Autonomous generative AI systems should be granted intellectual property copyright over creative works they generate.",
    "context": "Proponents suggest recognizing AI authorship incentivizes algorithm investment and acknowledges novel machine creative synthesis. Critics argue that copyright is fundamentally a human economic right and that AI models rely on uncredited human training datasets.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-305",
    "targetGroup": "Scholar (JHS)",
    "topic": "African countries should prioritize space satellite programs over expanded rural road construction.",
    "context": "Supporters demonstrate that earth-observation satellites provide critical weather forecasting, telecommunication bandwidth, and precision agriculture monitoring across large regions. Critics maintain that physical all-weather farm-to-market roads address immediate food post-harvest losses and rural poverty far more effectively.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-401",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary schools should hold afternoon nap periods for all Basic 1 to 3 pupils.",
    "context": "Supporters argue that short daytime naps restore energy, improve afternoon attention, and enhance memory consolidation in young children. Opponents claim naps disrupt structured class instructional schedules and make evening bedtime routines difficult at home.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-402",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School libraries should prioritize visual comic books and illustrated graphic stories over plain text storybooks.",
    "context": "Advocates argue that graphic novels engage reluctant young readers, decode visual context cues, and foster enthusiasm for reading. Critics contend that plain text books build deeper imagination and stronger vocabulary acquisition without relying on visual crutches.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-403",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "All classroom art lessons should focus strictly on drawing real-life objects rather than abstract fantasy cartoons.",
    "context": "Proponents assert that observational drawing teaches discipline, spatial proportions, and botanical/biological awareness. Opponents argue that art should be an unconstrained outlet for childhood imagination, emotional expression, and creative freedom.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-404",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be required to greet every school teacher in their local Ghanaian mother tongue each morning.",
    "context": "Supporters believe indigenous greetings reinforce cultural respect, ancestral heritage, and communal bonding. Opponents worry this could alienate children from different linguistic backgrounds or conflict with English-medium immersion policies.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-405",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should completely replace chalkboards with dry-erase whiteboards in lower primary classrooms.",
    "context": "Advocates point out that whiteboards eliminate airborne calcium carbonate chalk dust that aggravates respiratory allergies in children. Opponents point out the higher cost of chemical markers and the recurring plastic waste from discarded markers.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-401",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Primary schools should implement a four-day school week with longer instructional hours each day.",
    "context": "Supporters claim a four-day week gives children more family time, reduces transportation costs, and provides teachers time for lesson preparation. Critics argue that longer daily hours cause severe mental fatigue in children and create child-care challenges for working parents on the fifth day.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-402",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary schools should prohibit parents from purchasing commercial homework assistance or extra evening classes.",
    "context": "Advocates argue that excessive evening tutoring creates educational inequality for poorer students and burns out young children after school hours. Opponents assert that parents have a fundamental right to invest in their children's academic reinforcement and competitive progress.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-403",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should teach practical trade skills like carpentry, masonry, and sewing alongside standard academic subjects.",
    "context": "Proponents point out that hands-on artisanal trades develop self-reliance, manual dexterity, and entrepreneurial career paths early in life. Skeptics argue that primary school hours must be protected to ensure complete mastery of foundational literacy, mathematics, and digital ICT skills.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-404",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Children under twelve years of age should be legally barred from appearing in commercial advertising and social media promotions.",
    "context": "Supporters argue that child advertising exploits minors, infringes upon their privacy rights, and disrupts normal psychological development. Opponents argue that commercial opportunities provide financial resources for families and help talented young performers develop public confidence.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-405",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "All school textbooks should be published exclusively in digital audio formats alongside written text.",
    "context": "Advocates emphasize that synchronized audiobooks assist students with dyslexia, support diverse auditory learning styles, and improve pronunciation. Opponents argue that listening can encourage passive comprehension and reduce deep silent reading focus and spelling retention.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-401",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghana should replace its current thermal power plants entirely with commercial nuclear power reactors.",
    "context": "Supporters argue nuclear energy provides continuous high-density zero-carbon baseload electricity that ends load-shedding and industrial power shortages. Opponents emphasize high construction capital expenditure, multi-decade debt, and the complex safety oversight needed for radioactive waste storage.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-402",
    "targetGroup": "Scholar (JHS)",
    "topic": "Social media companies should be legally held liable for psychological harm caused to teenage users by their algorithmic recommendation feeds.",
    "context": "Advocates argue platforms deliberately engineer dopamine-driven algorithmic loops that foster addictive behavior, depression, and body dysmorphia in adolescents. Opponents argue platforms merely host third-party content and that personal parental oversight and digital literacy are the proper remedies.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-403",
    "targetGroup": "Scholar (JHS)",
    "topic": "National governments should outlaw the production and commercial sale of artificial autonomous lethal weapons systems (AI combat drones).",
    "context": "Proponents argue that delegating life-and-death targeting decisions to software algorithms violates human dignity, international humanitarian law, and fails moral accountability. Opponents contend that autonomous systems react faster than human soldiers, reduce friendly military casualties, and achieve more precise surgical targeting.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-404",
    "targetGroup": "Scholar (JHS)",
    "topic": "Public high schools should eliminate tiered academic streaming (such as General Science vs. General Arts) in favor of a universal interdisciplinary curriculum.",
    "context": "Advocates maintain that rigid early streaming forces premature career specialisation and deprives STEM students of humanities ethics while denying Arts students scientific literacy. Opponents argue that specialized streaming is essential to master the deep technical prerequisites demanded by university STEM and medical faculties.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-405",
    "targetGroup": "Scholar (JHS)",
    "topic": "Developing nations should impose severe export tariffs on unprocessed raw minerals to force domestic refining and manufacturing.",
    "context": "Proponents argue that raw commodity export locks nations into the low-value resource curse, whereas domestic value addition creates industrial jobs and higher GDP. Economists caution that export tariffs can trigger retaliatory trade penalties, deter foreign capital investment, and fail if domestic infrastructure cannot refine the volumes.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-501",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Lower primary pupils should learn basic gardening skills instead of seated computing lessons.",
    "context": "Supporters argue that gardening provides tactile, outdoor motor skills and direct appreciation for plant biology. Opponents counter that digital computer literacy must start early to equip children for the modern digital era.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-502",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School singing and musical drumming should be practiced every single morning before academic lessons.",
    "context": "Advocates claim morning music relieves anxiety, enhances rhythmic cognitive skills, and builds community spirit. Critics argue that morning periods provide optimal mental focus for core reading and arithmetic and should not be shortened.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-503",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should replace plastic play toys with traditional wooden and clay crafts.",
    "context": "Proponents point out that wooden and clay crafts encourage tactile creativity, connect children to local heritage, and eliminate plastic pollution. Skeptics note that clay breaks easily and wooden toys can present splinters or higher replacement costs.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-504",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Teachers should award star stickers and badges rather than numerical marks for classwork.",
    "context": "Supporters believe symbolic praise builds positive self-esteem and avoids premature academic anxiety. Opponents maintain that clear numerical marks help parents identify learning weaknesses and prepare children for standardized progress.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-505",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be required to drink only plain water instead of sweetened juices during break time.",
    "context": "Advocates emphasize preventing dental cavities, reducing blood sugar spikes, and fostering healthy hydration. Opponents argue that occasional packaged fruit juices supply carbohydrates and essential vitamins for active children.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-501",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "All upper primary pupils should be required to learn basic financial accounting and petty bookkeeping.",
    "context": "Supporters argue that early accounting skills teach practical arithmetic, financial prudence, and entrepreneurial budgeting. Opponents claim that abstract bookkeeping is premature and takes away instructional time from core foundational mathematics.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-502",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should completely ban disposable single-use plastic water bottles on school property.",
    "context": "Advocates highlight severe plastic litter, clogged drainages, and the environmental urgency of encouraging reusable flasks. Opponents argue that bottled water provides essential hygienic security when school tap supplies are disrupted.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-503",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Students should be evaluated based on verbal presentations rather than written multiple-choice examinations.",
    "context": "Proponents argue that oral presentations develop public speaking poise, dynamic persuasion, and deep conceptual communication. Critics point out that verbal testing is subjective, time-intensive to grade, and disadvantages introverted pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-504",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Physical education and sports grades should count toward academic class rankings on terminal reports.",
    "context": "Supporters assert that physical fitness, teamwork, and motor health are as vital to child development as academic subjects. Opponents argue that athletic aptitude is largely genetic and should not penalize students aspiring toward academic scholarships.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-505",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary schools should replace printed wall maps with interactive digital satellite mapping tools.",
    "context": "Advocates point out that dynamic satellite software allows real-time exploration of global terrain, climate layers, and topography. Skeptics argue that physical wall maps offer permanent visual landmarks that build spatial retention without requiring electricity.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-501",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghana should phase out fossil fuel vehicle imports completely by 2035 in favor of electric mobility.",
    "context": "Environmentalists argue that rapid electrification reduces urban air pollution, lowers carbon emissions, and cuts petroleum import dependency. Critics highlight the absence of nationwide charging grid infrastructure, frequent power disruptions, and the high upfront cost of electric cars.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-502",
    "targetGroup": "Scholar (JHS)",
    "topic": "JHS curricula should replace the study of ancient world history with practical computer programming and data science.",
    "context": "Advocates argue that programming equips students with immediate technical employment skills for the 21st-century digital economy. Historians argue that historical understanding teaches critical civic analysis, philosophical perspective, and prevents societal repetition of past governance errors.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-503",
    "targetGroup": "Scholar (JHS)",
    "topic": "National governments should introduce mandatory biometric digital identity verification for internet access.",
    "context": "Supporters contend that verified digital identity eliminates online fraud, cyberbullying, bot manipulation, and financial scam operations. Civil liberties groups warn that mandatory identification destroys privacy, enables authoritarian surveillance, and chills free speech.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-504",
    "targetGroup": "Scholar (JHS)",
    "topic": "Public secondary and junior high school prefects should be elected strictly by secret student ballot without teacher vetting.",
    "context": "Proponents argue that unvetted student elections provide authentic democratic training, accountability, and student agency. School administrators counter that faculty vetting ensures candidates exhibit proven academic discipline and moral leadership.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-505",
    "targetGroup": "Scholar (JHS)",
    "topic": "Commercial farming corporations should be prohibited from patenting genetically modified crop seeds.",
    "context": "Advocates argue that seed patents trap smallholder farmers in corporate debt, undermine food sovereignty, and threaten seed biodiversity. Biotechnology companies argue that patent protection is essential to recoup billions invested in developing drought-resistant, pest-tolerant crop varieties.",
    "isCentral": true
  }
];
