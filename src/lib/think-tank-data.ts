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
  },
  {
    "id": "tt-paradox-nov-601",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you take a bite out of an apple, did the apple get bigger or smaller, and what happened to the total weight of the room?",
    "answer": "The apple became smaller, but the total weight of the room remained identical.",
    "explanation": "Moving apple matter from the fruit into your mouth transfers mass between objects inside the room without changing the room's total closed mass.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-602",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you look at your clean face in a flat mirror, your right hand appears to be the reflection's left hand. Why doesn't the mirror flip your head and feet instead?",
    "answer": "A mirror reverses front-to-back along the line of sight, which our brain interprets as a left-to-right swap.",
    "explanation": "Light bounces straight back toward you. Because your head points up and feet point down along the vertical axis, only the depth axis is inverted.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-603",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A traveler says: 'Every single statement written in this notebook is an error.' If that statement is written in the notebook, is it true?",
    "answer": "No, because if it were true, the statement itself would have to be an error.",
    "explanation": "Self-referential negative declarations contradict themselves when included within the set of items they claim to invalidate.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-604",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you build a toy tower out of 10 wooden blocks and then remove 10 blocks, how many blocks are left standing?",
    "answer": "Zero blocks are left standing.",
    "explanation": "Subtracting the exact quantity of components originally assembled (10 - 10 = 0) leaves nothing behind.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-605",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Why does a piece of dry tissue paper stay dry when crumpled inside the bottom of a cup and pushed completely underwater upside down?",
    "answer": "Air trapped inside the cup exerts pressure and blocks the water from entering.",
    "explanation": "Gases take up physical space. The pocket of air inside the inverted cup cannot escape, creating a barrier that keeps the tissue dry.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-606",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can you ever truly stand outside of every room in a building and still be indoors?",
    "answer": "Yes, by standing in an enclosed hallway or corridor.",
    "explanation": "A hallway is part of the interior building structure but is categorized as a transitional walkway rather than an individual room.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-607",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have two buckets of equal size, one filled with dry sand and one filled with water, which one has more empty air pockets between its particles?",
    "answer": "The bucket with sand has more air pockets.",
    "explanation": "Granular solid sand leaves irregular interstitial air gaps between particles, whereas liquid water forms a continuous fluid body.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-608",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you run fast on a sunny afternoon in Kumasi, why can you never outrun or jump over your own shadow?",
    "answer": "Your shadow is formed by your own body blocking sunlight in real time.",
    "explanation": "As long as you intercept incoming light, the shadow projection is created instantaneously at your exact relative position.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-609",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you cut a doughnut in half, how many circular holes do you have?",
    "answer": "Zero full circular holes remain.",
    "explanation": "A hole requires a continuous perimeter boundary. Slicing the doughnut destroys the closed loop, leaving two curved arcs.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-610",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A sign on a garden fence reads: 'Ignore this rule.' Can you obey the sign?",
    "answer": "No, because obeying it requires following the instruction you were told to ignore.",
    "explanation": "If you ignore the rule, you obey it, which violates the instruction to ignore; if you don't ignore it, you disobey it directly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-601",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A village drummer has a talking drum. Over ten years, he replaces the leather skin twice and all the tension cords three times. Is it still the same drum?",
    "answer": "It is functionally and culturally the same instrument, even though its constituent materials have been replaced.",
    "explanation": "This demonstrates functional continuity versus physical substrate continuity; tools retain their historical identity through form and purpose.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-602",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A storekeeper marks a school bag up by 20% and then puts it on sale for 20% off. Is the sale price equal to, higher than, or lower than the original price?",
    "answer": "The sale price is lower than the original price.",
    "explanation": "If the price is 100 Cedis, a 20% markup raises it to 120 Cedis. A 20% discount on 120 Cedis subtracts 24 Cedis (120 - 24 = 96 Cedis), which is less than 100.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-603",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You place an empty glass cup upside down in water and push it down until submerged. Is the buoyant force on the cup greater near the surface or deep down?",
    "answer": "The buoyant force is greater near the surface.",
    "explanation": "Higher hydrostatic pressure at greater depth compresses the trapped air pocket, decreasing displaced volume (F_b = ρ V g) and lowering buoyancy.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-604",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A farmer must transport a cabbage, a goat, and a wolf across a river in a small boat that holds only himself and one item. What must he avoid leaving alone?",
    "answer": "He must avoid leaving the goat alone with the cabbage, or the wolf alone with the goat.",
    "explanation": "Unsupervised predator-prey pairings result in consumption, requiring careful multi-step sequencing where the goat is ferried back and forth.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-605",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A snail at the bottom of an 8-meter pit climbs up 2 meters each day and slips back 1 meter each night. On which day does the snail escape?",
    "answer": "On the 7th day.",
    "explanation": "After 6 full 24-hour cycles, the snail reaches 6 meters. On day 7, it climbs 2 meters (6 + 2 = 8), reaching the lip and escaping before nightfall.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-606",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A metal washer with a round hole in the middle is heated in an oven. Does the diameter of the center hole expand or shrink?",
    "answer": "The diameter of the center hole expands.",
    "explanation": "Thermal expansion acts like a uniform photographic enlargement. Every linear dimension expands outward proportionally, widening the hole.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-607",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "Can a person legally marry their widow's sister in Ghana?",
    "answer": "No, because for a woman to be your widow, you must already be deceased.",
    "explanation": "The term 'widow' denotes a surviving spouse following the death of her partner, making legal marriage impossible for the deceased.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-608",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You drop a sheet of flat notebook paper and a crumpled paper ball of identical mass from the second floor. Why does the crumpled ball hit the ground first?",
    "answer": "The crumpled paper has a smaller surface area, experiencing significantly less air resistance.",
    "explanation": "While gravity accelerates both equally, aerodynamic drag opposes the flat sheet's motion more forcefully, lowering its terminal velocity.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-609",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If two painters can paint two classroom walls in two hours, how many hours does it take six painters to paint six classroom walls?",
    "answer": "It takes two hours.",
    "explanation": "Each painter paints one wall in two hours. Six painters working concurrently finish six walls in that exact same two-hour window.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-610",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A man in Accra was driving a black car with no headlights on a moonless night. A pedestrian in dark clothes stepped into the road, but the driver stopped in time. How did he see them?",
    "answer": "It was broad daylight during the afternoon.",
    "explanation": "The riddle relies on the assumption that headlights and moonlight are required, masking the reality of daytime driving.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-601",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Unexpected Exam Paradox, a teacher announces an exam will occur next week, but the day will be a total surprise. Why does backward induction fail to prevent the surprise?",
    "answer": "Eliminating Friday, Thursday, and so on logically assumes the exam cannot happen, making its eventual arrival a genuine epistemological surprise.",
    "explanation": "Logical deduction collapses under self-canceling premises: knowing you cannot be surprised renders the event surprising when it occurs.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-602",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Ship of Theseus with Reassembly, if replaced timber planks are preserved and assembled into a second ship, which vessel holds genuine legal ownership of the original identity?",
    "answer": "Neither has an exclusive claim; one preserves continuous spatiotemporal history, while the other preserves original material constituents.",
    "explanation": "Identity is not an intrinsic physical particle property, but an ontological label subject to definition criteria.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-603",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Monty Hall Problem, after choosing Door 1 of 3, the host opens Door 3 showing a goat and offers Door 2. Why does switching improve your win probability from 1/3 to 2/3?",
    "answer": "Your initial door has a fixed 1/3 probability, while the host's informed reveal concentrates the remaining 2/3 probability into the unopened door.",
    "explanation": "The host cannot pick randomly; their forced selection of a losing door leaks conditional probability into the remaining alternative.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-604",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In the Twin Paradox of Special Relativity, why does the traveling twin return biologically younger than the stay-at-home twin on Earth?",
    "answer": "The traveling twin undergoes physical acceleration and frame shifts, breaking reference frame symmetry.",
    "explanation": "Because the space twin accelerates to reverse course, their trajectory traces a shorter spacetime geodesic interval (proper time τ).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-605",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "If 'Statement A: Statement B is true' and 'Statement B: Statement A is false', what stable truth values can propositional logic assign?",
    "answer": "No stable classical truth values can be assigned; it forms an insoluble cyclic paradox.",
    "explanation": "If A is True, B is True, which forces A to be False. If A is False, B is False, forcing A to be True, causing infinite oscillation.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-606",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a group of 23 unrelated people in a classroom, why is there a greater than 50% probability that two people share the exact same birthday?",
    "answer": "The probability counts the combinations of all 253 distinct pairs rather than comparing individuals to a single date.",
    "explanation": "With n=23, there are C(23, 2) = 253 pairwise comparisons. The complementary probability of all distinct birthdays drops below 0.5.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-607",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In Olbers' Paradox, if the universe were static, infinite, and uniformly populated with stars, why is the night sky over Ghana dark instead of blindingly bright?",
    "answer": "The universe has a finite age and is expanding, limiting observable light and redshifting distant photons.",
    "explanation": "Distant starlight has not had enough cosmological time (13.8 billion years) to reach Earth, and metric expansion shifts radiation into invisible infrared.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-608",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Raven Paradox, why does observing a white piece of chalk logically count as confirmation for the hypothesis 'All ravens are black'?",
    "answer": "By contrapositive equivalence, observing a non-black non-raven confirms 'All non-black things are non-ravens'.",
    "explanation": "R → B is mathematically equivalent to ≠g B → ≠g R. Nicod's criterion implies confirmation applies to both forms, though the Bayesian degree of support is negligible.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-609",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Boy or Girl Paradox, a family has two children and at least one is a boy. What is the probability that both children are boys?",
    "answer": "The probability is 1/3 (approx 33.3%).",
    "explanation": "The sample space of pairs is {BB, BG, GB, GG}. Eliminating GG leaves three equally probable outcomes, only one of which is BB.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-610",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Fermi Paradox, given the billions of Sun-like stars and habitable planets in the Milky Way, why have we found zero conclusive radio or physical traces of extraterrestrial intelligence?",
    "answer": "It highlights the tension between high probabilistic estimates of life and the empirical absence of evidence.",
    "explanation": "Hypotheses resolving the gap include the Great Filter, extreme technological lifespan limits, interstellar communication challenges, or planetary rarity.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-701",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you blow air into a paper bag until it pops with a loud bang, did the paper get heavier right before it burst?",
    "answer": "Yes, because the extra air trapped inside has real physical mass.",
    "explanation": "Air is made of real matter with weight and volume. Compressing more air into the bag adds measurable mass before the burst.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-702",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you dip a dry white cotton handkerchief into clean water, it turns a darker shade of grey. Did darker paint get added to the cloth?",
    "answer": "No, water fills air spaces between fibers, allowing more light to pass through rather than bounce back.",
    "explanation": "Dry fabric scatters light in all directions, looking bright white. Wet fibers let light penetrate deeper, reducing reflection and making it look darker.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-703",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can a clock that is completely frozen and broken ever be more accurate than a clock that loses two minutes every single day?",
    "answer": "Yes, because the stopped clock is 100% exact twice a day, while the slow clock takes over a year to match the true time.",
    "explanation": "A stopped clock matches the real hour twice every 24 hours. A clock losing two minutes daily is incorrect at almost every instant for 360 days.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-704",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you pour water from a tall, thin glass into a short, wide calabash bowl, did you lose any water even though the height looks smaller?",
    "answer": "No, the total volume of water stays exactly the same.",
    "explanation": "Changing the shape or width of a container alters the liquid's height without altering its actual physical quantity.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-705",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you look through green tinted sunglasses at a bright red hibiscus flower, why does the petal appear almost black?",
    "answer": "The green lens blocks red light from passing through to reach your eye.",
    "explanation": "Red petals reflect only red light. A green filter absorbs red wavelengths, allowing virtually no light to pass through to your vision.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-706",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If someone whispers: 'I am not whispering right now', are they telling the truth?",
    "answer": "No, because the very action of whispering contradicts the claim.",
    "explanation": "Uttering a denial using the exact method you deny makes the statement instantly untrue upon delivery.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-707",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have a pile of five ripe oranges and take away three to share, how many oranges do you personally hold?",
    "answer": "You personally hold three oranges.",
    "explanation": "The question asks what you took and possess, not what remains on the table.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-708",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you put a drop of black ink into a bucket of water, it turns the whole bucket cloudy grey, but where did the solid black spot go?",
    "answer": "The ink particles spread apart and diffused evenly throughout the water.",
    "explanation": "Diffusion moves concentrated dye particles across fluid until they are distributed between water molecules.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-709",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Can you walk into an empty classroom past the door and still be in an empty classroom?",
    "answer": "No, because the moment you step inside, the room contains a person and is no longer empty.",
    "explanation": "Your physical presence supplies contents to the space, terminating its empty state.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-710",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If a signpost says 'Do not look at this post', can anyone follow the instruction successfully?",
    "answer": "No, because you must look at it to read the command.",
    "explanation": "Comprehending the instruction requires visually scanning the text, violating the instruction.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-701",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A basket weaver in Bolgatanga has a woven straw hat. If she replaces the crown one year and replaces the brim the next, does the wearer still own the original hat?",
    "answer": "Yes functionally and socially, though its physical material has completely turned over.",
    "explanation": "This demonstrates functional continuity versus material continuity; objects retain human identity through continuous purpose.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-702",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A market trader sells a radio for 120 Cedis, making a 20% profit on its cost price. What was the original wholesale cost?",
    "answer": "The original cost was 100 Cedis, not 96 Cedis.",
    "explanation": "Profit is calculated on cost (C × 1.20 = 120), meaning C = 120 / 1.20 = 100 Cedis. Subtracting 20% from the selling price is a common percentage error.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-703",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A balloon filled with helium floats in a sealed car with windows up. When the car brakes suddenly and stops, does the balloon lurch forward or drift backward?",
    "answer": "The helium balloon drifts backward.",
    "explanation": "Inertia forces denser air inside the cabin to rush forward, creating a forward pressure gradient that pushes the lighter helium balloon toward the rear.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-704",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A farmer has 15 sheep in an enclosure in Navrongo. A thunderstorm scares them, and all but 7 leap over the low fence. How many sheep stay in the pen?",
    "answer": "Exactly 7 sheep stay in the pen.",
    "explanation": "The phrase 'all but 7' identifies the remaining subset left inside.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-705",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "Two cars start at the exact same location in Kumasi and drive in opposite directions at 50 km/h each. How far apart are they after 30 minutes?",
    "answer": "They are 50 kilometers apart.",
    "explanation": "Each vehicle travels 25 km (50 × 0.5). Moving in opposite directions sums their physical separation to 25 + 25 = 50 km.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-706",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you hold a large iron pot at the bottom of Lake Bosomtwe and let go, it rests on the mud. Why does a hollow iron canoe carrying 10 people float on top?",
    "answer": "The hollow canoe encloses vast air volume, making its overall average density lower than water.",
    "explanation": "Archimedes' principle depends on average volumetric density. Hollow structures displace massive water volumes, generating buoyant force.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-707",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "How can a boy kick a soccer ball 5 meters away across a level school compound and have it return straight to his feet without touching anything?",
    "answer": "He kicks the soccer ball straight up into the air.",
    "explanation": "Kicking vertically sends the ball upward; gravitational acceleration brings it directly back down along the same vertical vector.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-708",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "When cold harmattan wind blows over wet skin, why does your arm feel significantly colder than dry skin exposed to the exact same wind?",
    "answer": "Evaporating water absorbs latent heat directly from skin tissue.",
    "explanation": "Phase change from liquid to vapor requires latent heat of vaporization, which is conducted away from skin, accelerating cooling.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-709",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If four tailors in Kejetia sew four school shirts in four hours, how many hours does it take eight tailors to sew eight school shirts?",
    "answer": "It takes four hours.",
    "explanation": "Each tailor sews one shirt every four hours. Eight tailors working in parallel complete eight shirts in that same four-hour span.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-710",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A man in Takoradi looks at a portrait and says: 'Brothers and sisters I have none, but this man's father is my father's son.' Who is in the picture?",
    "answer": "The man's own son.",
    "explanation": "'My father's son' refers to the speaker himself (since he has no siblings). Therefore, 'this man's father is myself', making the portrait his son.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-701",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Unexpected Examination Paradox, a teacher declares that an exam will occur next week on a day that is a complete surprise. Why does backward induction fail to protect students from surprise?",
    "answer": "Deductively proving that no day can be a surprise convinces students it cannot happen, making its arrival an empirical surprise.",
    "explanation": "The paradox exploits self-referential epistemic logic: logical certainty that an event is impossible recreates the exact surprise condition.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-702",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Monty Hall Problem, you select Door 1 of 3. The host reveals a goat behind Door 3 and offers Door 2. Why does switching give a 2/3 win chance?",
    "answer": "Your initial pick has a 1/3 probability, while the host's informed reveal shifts the remaining 2/3 probability into Door 2.",
    "explanation": "The host is constrained by knowing where the prize is and must never reveal it, which concentrates the probability into the unchosen alternative.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-703",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In the Twin Paradox of special relativity, if motion is relative, why is the astronaut twin genuinely younger than the Earth twin upon return?",
    "answer": "The astronaut twin underwent physical acceleration and frame shifts to reverse direction, breaking inertial symmetry.",
    "explanation": "Because the traveling twin turns around, their worldline changes inertial reference frames, tracing a shorter spacetime proper time interval (τ).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-704",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Olbers' Paradox, why is the night sky over Lake Volta dark if an infinite universe is filled uniformly with luminous stars?",
    "answer": "The universe has a finite age and is expanding, redshifting light and limiting the observable horizon.",
    "explanation": "Light from stars beyond 13.8 billion light-years has not had enough cosmological time to reach Earth, and expansion dims distant wavelengths.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-705",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "If 'Sentence A: Sentence B is true' and 'Sentence B: Sentence A is false', what classical truth values can formal logic assign?",
    "answer": "No stable classical truth values can be assigned; it forms an insoluble cyclic paradox.",
    "explanation": "If A is True, B is True, which forces A to be False. If A is False, B is False, which forces A to be True, oscillating infinitely.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-706",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a school cohort of 23 unrelated students, why is there a greater than 50% probability that two share the exact same birthday?",
    "answer": "The calculation evaluates 253 unique pairwise combinations rather than comparing individuals to a single fixed date.",
    "explanation": "With n=23, there are C(23, 2) = 253 possible pairings. The complementary probability that all 23 dates are distinct falls below 0.50.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-707",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Fermi's Paradox, given billions of stars older than the Sun and countless habitable exoplanets, why is there zero evidence of extraterrestrial civilization?",
    "answer": "It highlights the stark contradiction between high probabilistic estimates of intelligent life and the complete absence of observations.",
    "explanation": "Explanations include the Great Filter hypothesis, extreme spatial distances, technological self-destruction, or planetary rarity.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-708",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Raven Paradox (Hempel), why does observing a green mango logically confirm the hypothesis 'All ravens are black'?",
    "answer": "Because 'All ravens are black' is logically equivalent to its contrapositive 'All non-black things are non-ravens'.",
    "explanation": "A green mango is non-black and a non-raven, confirming ≠g B → ≠g R, though its Bayesian evidential weight is negligible.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-709",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "A family in Accra has two children. You are told at least one child is a girl. What is the probability that both children are girls?",
    "answer": "The probability is 1/3 (approx 33.3%).",
    "explanation": "The sample space of pairs is {BB, BG, GB, GG}. Eliminating BB leaves three equally likely outcomes, with only GG having two girls.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-710",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "According to quantum mechanics, if an unstable radioactive atom is measured and observed continuously with ultra-rapid laser pulses, does it decay?",
    "answer": "No, continuous observation freezes the quantum state and prevents decay (Quantum Zeno Effect).",
    "explanation": "Repeatedly collapsing the quantum wave function back to the initial undecayed state suppresses the transition probability to zero.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-801",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you blow air out through a tiny straw into a clear bottle, can you see the air inside the bottle?",
    "answer": "No, because the gases that make up air are transparent to human vision.",
    "explanation": "Air consists of microscopic molecules like nitrogen and oxygen that do not absorb or reflect visible light, making them invisible even though they fill the space.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-802",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you dip your thumb into thick palm oil, your skin feels slippery and warm. If you run tap water over it, why does the water slide right off without washing the oil away?",
    "answer": "Water and oil do not mix because oil molecules repel polar water molecules.",
    "explanation": "Water is a polar molecule and oil is non-polar. Water molecules cling tightly to each other rather than adhering to the oily skin surface.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-803",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If a sign on an empty classroom door reads: 'Only invisible pupils are inside', is the classroom truly empty?",
    "answer": "Yes, because invisible pupils do not physically exist in the real world.",
    "explanation": "Imaginary entities cannot fill physical space. The room contains zero real humans, leaving it completely unoccupied.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-804",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have a wooden toy train with four carriages and you detach two carriages from the rear, how many wheels are still rolling behind the engine?",
    "answer": "Only the wheels on the two attached carriages remain rolling behind the engine.",
    "explanation": "Detaching parts physically separates them from the moving locomotive system, leaving only the remaining connected carriages in tow.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-805",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you drop a dry palm kernel nut into a calabash of water, it sinks to the bottom. If you drop a whole dry coconut with its thick fibrous husk, it floats. Why?",
    "answer": "The coconut's thick fibrous husk traps large amounts of air, lowering its overall density.",
    "explanation": "Buoyancy depends on the average density of the object compared to water. Trapped air pockets in the coconut husk create enough upward buoyant force to keep it afloat.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-806",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A village bell-ringer says: 'I only ring the bell when nobody is listening.' Does anyone ever hear the bell ring on purpose?",
    "answer": "No, because the moment someone listens on purpose, the condition to ring the bell is broken.",
    "explanation": "The action's prerequisite explicitly requires the absence of any listeners, creating a rule that cancels itself upon detection.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-807",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If Kofi stands on one foot on a weighing scale and then puts both feet down, does the number on the scale double?",
    "answer": "No, the scale reading stays the exact same.",
    "explanation": "A scale measures the total downward gravitational force of your body mass. Shifting weight between one or two feet changes surface pressure, not total mass.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-808",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you breathe out onto a cold glass louvre window on a harmattan morning, why does a white foggy patch appear and then fade away?",
    "answer": "Warm water vapor from your breath condenses into tiny liquid droplets on the cold glass, then evaporates back into the air.",
    "explanation": "Chilled glass cools breath vapor below its dew point, forming micro-droplets of mist that soon evaporate as room heat returns.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-809",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you fold a long piece of kente ribbon in half and cut it right across the fold with scissors, how many separate pieces do you have?",
    "answer": "You have two separate pieces.",
    "explanation": "Cutting across the single folded midpoint divides the continuous ribbon into two equal distinct lengths.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-810",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can you ever truthfully say: 'I have never spoken a single word in my entire life'?",
    "answer": "No, because speaking that sentence instantly breaks the claim.",
    "explanation": "Uttering words directly contradicts the assertion that you have never spoken, making it self-refuting.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-801",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A carpenter in Kumasi builds a wooden stool out of Odum wood. If a termitaria mound degrades the legs and he carves four new legs out of Wawa wood, is it still an Odum stool?",
    "answer": "It is now a composite stool retaining an Odum seat with Wawa supports.",
    "explanation": "When an artifact's components are replaced with different materials, its material identity changes into a hybrid while its functional identity persists.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-802",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A vendor in Sunyani buys yams at 3 for 10 Cedis and sells them at 2 for 10 Cedis. How many yams must she sell to make a net profit of 50 Cedis?",
    "answer": "She must sell 30 yams.",
    "explanation": "Cost per yam is 10/3 Cedis, selling price is 5 Cedis (10/2). Profit per yam is 5 - 10/3 = 5/3 Cedis. To earn 50 Cedis profit: 50 / (5/3) = 30 yams.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-803",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A solid metal coin and a broad green plantain leaf are dropped inside a tall vacuum chamber where all air has been pumped out. Which lands first?",
    "answer": "Both land at the exact same instant.",
    "explanation": "In a vacuum, there is zero aerodynamic drag. Gravitational acceleration (g ≈ 9.8 m/s²) acts equally on all falling objects regardless of mass or shape.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-804",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A town chief decrees: 'No traveler may cross this bridge unless they first tell a truth.' A traveler steps up and says: 'I will be thrown into the river.' What must the guards do?",
    "answer": "The guards face a logical contradiction and cannot enforce the decree.",
    "explanation": "If they throw him in, his statement was true, meaning he should have crossed. If they let him cross, his statement was false, meaning he should have been thrown in.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-805",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A bus leaves Accra traveling at 60 km/h toward Kumasi (250 km away). Another bus leaves Kumasi at 40 km/h toward Accra along the same highway. After 2 hours, how far apart are they?",
    "answer": "They are 50 kilometers apart.",
    "explanation": "Bus 1 covers 60 × 2 = 120 km. Bus 2 covers 40 × 2 = 80 km. Together they have closed 120 + 80 = 200 km. The remaining distance is 250 - 200 = 50 km.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-806",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "You place a sealed glass flask containing cool air into a pot of boiling water. The glass doesn't crack, but what happens to the air pressure inside the flask?",
    "answer": "The air pressure inside the flask increases significantly.",
    "explanation": "According to Gay-Lussac's Law, when a gas in a rigid container of fixed volume is heated, its molecular kinetic energy increases, raising internal pressure proportionally.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-807",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A shepherd in the Upper West Region has to divide 17 cattle among 3 sons: 1/2 to the first, 1/3 to the second, and 1/9 to the third, without butchering any. How can this be done?",
    "answer": "Borrow 1 cow to make 18: the sons receive 9, 6, and 2 cows (9+6+2=17), and the borrowed cow is returned.",
    "explanation": "Because 1/2 + 1/3 + 1/9 = 17/18 (not a full whole 1), introducing a temporary common denominator unit resolves the fractional shares neatly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-808",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you connect two identical lightbulbs in series to a 6-volt battery, and then reconnect the same two bulbs in parallel to the same battery, which setup shines brighter?",
    "answer": "The parallel circuit shines significantly brighter.",
    "explanation": "In parallel, each bulb receives the full 6 volts and draws independent current, whereas in series, the bulbs split the voltage (3 volts each) and share higher total resistance.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-809",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If 6 weavers in Bonwire produce 6 yards of kente cloth in 6 days, how many yards of kente cloth will 12 weavers produce in 12 days?",
    "answer": "They will produce 24 yards of cloth.",
    "explanation": "Each weaver produces 1 yard per 6 days (1/6 yard per weaver per day). 12 weavers working for 12 days produce 12 × 12 × (1/6) = 24 yards.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-810",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A mother has two biological sons born at the exact same hospital, on the exact same date, hour, and year, but they are not fraternal or identical twins. How is this possible?",
    "answer": "They are two surviving babies from a set of triplets or quadruplets.",
    "explanation": "Being part of a higher-order multiple birth (such as triplets) means sharing the exact birth timing without being classified as twins.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-801",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Unexpected Tiger Paradox (a variant of the Surprise Hanging), if a traveler is told a tiger waits behind one of five closed doors that will surprise him, can logic eliminate Door 5?",
    "answer": "Deductively yes via backward induction, but the real-world execution still surprises the traveler when encountered.",
    "explanation": "Eliminating each door by assuming the traveler will know in advance relies on the premise that the statement is predictable, creating an epistemic contradiction.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-802",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Three Prisoners Problem, Prisoners A, B, and C are on death row. The warden randomly pardons one. If the warden secretly tells Prisoner A that Prisoner B will be executed, did A's survival odds increase?",
    "answer": "No, Prisoner A's survival probability remains 1/3, while Prisoner C's jumps to 2/3.",
    "explanation": "The warden can always name at least one doomed co-prisoner regardless of whether A lives. This is isomorphic to the Monty Hall problem: probability concentrates in C.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-803",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "According to General Relativity, if an observer in a rocket ship accelerates at 9.8 m/s² in deep empty space, how does an onboard physics experiment compare to one performed on Earth's surface?",
    "answer": "Every mechanical and optical experiment behaves identically due to the Equivalence Principle.",
    "explanation": "Einstein's Equivalence Principle dictates that inertial acceleration and gravitational mass effects are locally indistinguishable in a closed reference frame.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-804",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Bootstrap Paradox (causal loop), a time traveler takes a printed copy of Shakespeare's 'Hamlet' to 16th-century London and hands it to William Shakespeare, who copies it. Who composed the play?",
    "answer": "The information has no origin, existing within a closed causal loop.",
    "explanation": "Causal loops in closed timelike curves violate ontological causality: the literary information exists without ever undergoing creative inception.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-805",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In Arrow's Impossibility Theorem, can any ranked voting electoral system convert individual multi-candidate preferences into a fair community ranking without violating basic democratic axioms?",
    "answer": "No, Kenneth Arrow proved mathematically that no ranked voting system can satisfy all fair criteria simultaneously.",
    "explanation": "Criteria such as non-dictatorship, Pareto efficiency, and independence of irrelevant alternatives cannot mathematically coexist in ranked voting.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-806",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the St. Petersburg Paradox, a fair coin is flipped until Tails appears. If Tails appears on flip n, the payout is 2ⁿ Cedis. Why will rational players not pay 10,000 Cedis to play despite infinite mathematical expected value?",
    "answer": "Because expected monetary value diverges from subjective expected utility and finite human bankrolls.",
    "explanation": "The infinite mathematical expectation is dominated by minuscule probabilities of astronomical payouts (1/2³⁰ of winning a billion), which practical utility discounts.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-807",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In quantum mechanics, if a beam of light passes through two parallel slits, it forms an interference wave pattern on a screen. What happens if a detector is placed at one slit to see which slit each photon passes through?",
    "answer": "The wave interference pattern instantly collapses into two classical particle bands.",
    "explanation": "Measurement destroys the quantum phase coherence between alternative paths, collapsing the superposed wave function into localized particle behavior.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-808",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In Russell's Paradox, let R be the set of all sets that do not contain themselves. Does R contain itself?",
    "answer": "R contains itself if and only if it does not contain itself, exposing an inconsistency in naive set theory.",
    "explanation": "If R ∈ R, then by its own definition R ∉ R. If R ∉ R, then by definition R ∈ R. This contradiction necessitated Zermelo-Fraenkel axiomatic set theory.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-809",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You roll two fair six-sided dice. Given that at least one of the dice shows a 6, what is the probability that both dice show a 6?",
    "answer": "The probability is 1/11 (approx 9.09%), not 1/6.",
    "explanation": "Out of 36 dice outcomes, 11 contain at least one 6: {(1,6), (2,6), (3,6), (4,6), (5,6), (6,6), (6,1), (6,2), (6,3), (6,4), (6,5)}. Only (6,6) has both, giving 1/11.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-810",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Newcomb's Paradox, an infallible supercomputer predicts your choice between Box A (1,000 Cedis) and Box B (1,000,000 Cedis if predicted you take only B, or empty if predicted you take both). Which principle supports taking only Box B?",
    "answer": "The Principle of Expected Utility (One-boxing) supports taking only Box B.",
    "explanation": "One-boxers argue that an infallible predictor makes taking both yield only 1,000 Cedis, whereas two-boxers argue by Dominance that the money is already physically placed.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-901",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you take a lump of wet pottery clay and squash it completely flat like a pancake on a wooden board, did you end up with more clay, less clay, or the exact same amount?",
    "answer": "You have the exact same amount of clay.",
    "explanation": "Changing the physical shape or spreading out an object alters its surface dimensions, but the total mass and volume of matter remain conserved.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-902",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you look at a red hibiscus petal through a clear piece of red plastic, it looks bright red. When you look at a green leaf through the same red plastic, why does the leaf appear almost pitch black?",
    "answer": "The red plastic absorbs green light and only permits red light to pass through.",
    "explanation": "Colored transparent filters block all light wavelengths except their own. Since a green leaf reflects only green wavelengths, the red plastic filters them out completely.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-903",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If someone holds up a blank sheet of paper and says: 'Everything written on this paper is an absolute lie', are they telling the truth?",
    "answer": "No, because there are zero words written on the paper to evaluate.",
    "explanation": "A statement referencing non-existent text makes an invalid factual claim; you cannot evaluate the truth or falsehood of empty space.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-904",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you have a carton containing ten sweet oranges and you remove four oranges to wash them, how many oranges are currently in your hands?",
    "answer": "You currently hold four oranges.",
    "explanation": "The question asks what was physically taken into your possession, not what remained inside the carton.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-905",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "You place a solid iron nail in a bucket of water and it sinks immediately to the bottom. If you beat the same nail into a very thin, hollow metal cup, why can it float on top?",
    "answer": "Shaping it into a hollow bowl traps air and displaces a larger volume of water.",
    "explanation": "Buoyancy depends on the average density of the object. Increasing the total displaced volume without adding mass allows the buoyant force to support it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-906",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Can an accurate wall calendar ever truthfully tell you what tomorrow will feel like?",
    "answer": "No, because calendars record dates and days, not future feelings or weather sensations.",
    "explanation": "Calendars are static numerical timekeeping grids. Emotional or sensory experiences belong to living perception and cannot be contained in printed paper.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-907",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you blow air into an empty plastic bag, seal the top with string, and press down on it with your palms, why does it resist and push back against your hands?",
    "answer": "The trapped air molecules inside exert outward pressure against the bag walls.",
    "explanation": "Air is real matter composed of moving gas particles. Compressing them into a smaller volume increases collisions, generating outward pneumatic resistance.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-908",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you run past a row of wooden fence posts in the school field, why do nearby posts seem to zip backward quickly while distant mountain hills seem to barely move?",
    "answer": "Nearby objects cross your visual angle much faster than far-away objects.",
    "explanation": "This is optical parallax. As you travel, the line of sight to nearby landmarks rotates through a large angle rapidly, whereas distant hills change angle very slowly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-909",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "If you take two steps forward, three steps backward, and one step forward, are you ahead of or right at your original starting point?",
    "answer": "You are right at your original starting point.",
    "explanation": "Walking forward adds +2, walking backward subtracts -3, and walking forward adds +1. The net displacement calculation is 2 - 3 + 1 = 0.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-910",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "A village noticeboard displays a wooden board that says: 'Do not pay attention to any notice on this board.' Can any visitor obey that command?",
    "answer": "No, because reading and following it requires paying attention to the notice.",
    "explanation": "Comprehending the instruction forces the reader to violate the exact behavior prohibited by the command.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-901",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A traditional clay water cooler (ahinwa) cracks. The potter chips off the damaged base and fires a brand new base onto the upper neck. Does the cooler retain its original identity?",
    "answer": "It retains functional continuity, but its material substrate is now an assembled composite.",
    "explanation": "This variant of the Ship of Theseus shows that human utility and design continuity preserve an object's identity even when physical portions are replaced.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-902",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A vendor in Techiman buys a crate of garden eggs for 80 Cedis, sells it for 100 Cedis, buys it back for 110 Cedis, and sells it again for 130 Cedis. What is her net financial profit?",
    "answer": "Her total net profit is 40 Cedis.",
    "explanation": "Evaluate the two transactions independently: Transaction 1 yields +20 Cedis (100 - 80). Transaction 2 yields +20 Cedis (130 - 110). Net gain is 20 + 20 = 40 Cedis.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-903",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A metal toy boat carrying a lead fishing sinker floats in a plastic basin filled to the brim. If you pick the sinker out of the boat and let it sink to the basin bottom, does water overflow or recede?",
    "answer": "The water level drops slightly and does not overflow.",
    "explanation": "Floating, the sinker displaced a volume of water equal to its heavy weight. Submerged on the bottom, it displaces only a volume equal to its own small physical size.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-904",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A farmer must lead a fox, a hen, and a bag of grain across a narrow plank over a stream. He can carry only one at a time. The fox cannot be left with the hen, nor the hen with the grain. What is his first move?",
    "answer": "He must carry the hen across first.",
    "explanation": "Leaving the fox alone with the grain poses no danger because foxes do not eat grain. Carrying the hen first safely separates both conflicting pairs.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-905",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A water tank in Tamale has an inlet pipe that fills it in 3 hours and a drainage valve that empties it in 6 hours. If both are opened together when the tank is empty, how many hours will it take to fill?",
    "answer": "It will take 6 hours to fill completely.",
    "explanation": "In one hour, the inlet adds 1/3 and the drain removes 1/6. The net filling rate is 1/3 - 1/6 = 1/6 of the tank per hour, requiring 6 hours total.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-906",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you hold two sheets of paper vertically five centimeters apart in front of your mouth and blow air forcefully between them, why do the sheets pull inward toward each other instead of flying apart?",
    "answer": "Fast-moving air between the sheets lowers the air pressure, allowing outside atmospheric pressure to push them together.",
    "explanation": "Bernoulli's principle states that an increase in fluid velocity causes a decrease in static pressure. The higher ambient pressure outside forces the sheets inward.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-907",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A traveler reaches a junction where one road leads to Kumasi and the other into a swamp. A signpost was knocked down by a storm. Knowing only the town he just came from, how does he fix the signpost correctly?",
    "answer": "He turns the signpost so the pointer for the town he just left points directly back down the road he arrived on.",
    "explanation": "Because the relative geometric angles between all town arms are permanently fixed on the board, orienting the known origin automatically points the Kumasi arm correctly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-908",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A solid block of paraffin wax sinks in cooking oil but floats easily in clean water. What does this reveal about the relative densities of the three substances?",
    "answer": "Water is the densest, followed by paraffin wax, and cooking oil is the least dense.",
    "explanation": "An object floats when its density is lower than the liquid. Wax is less dense than water (so it floats) but denser than oil (so it sinks), establishing ρwater > ρwax > ρoil.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-909",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "If it takes 10 seamstresses 10 minutes to stitch 10 school badges, how many minutes will it take 50 seamstresses working at the same speed to stitch 50 school badges?",
    "answer": "It will take 10 minutes.",
    "explanation": "Each individual seamstress requires 10 minutes to stitch 1 badge. Fifty seamstresses working in parallel on 50 badges will all finish together in 10 minutes.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-910",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A doctor in Cape Coast hands a patient three pills and instructs her to swallow one pill every half hour starting right now. How many total minutes will pass before all three pills are taken?",
    "answer": "Exactly 60 minutes will pass.",
    "explanation": "Pill 1 is swallowed at minute 0, Pill 2 at minute 30, and Pill 3 at minute 60. The total elapsed duration across the three doses is 60 minutes (1 hour).",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-901",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Paradox of the Stone, can an omnipotent entity create a boulder so massive that the entity itself cannot lift it?",
    "answer": "The query presents a self-contradictory semantic impossibility rather than a genuine test of power.",
    "explanation": "Omnipotence encompasses the capacity to perform all logically coherent actions. Coupling 'can do everything' with 'a task that cannot be done' creates an internal linguistic contradiction.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-902",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Base Rate Fallacy, a medical diagnostic screening for a rare tropical fever that affects 1 in 10,000 individuals has a 99% accuracy rate (1% false positive). If a patient tests positive, why are their odds of truly having the disease below 10%?",
    "answer": "The vast number of healthy individuals generates far more total false positives than the tiny pool of true infections produces true positives.",
    "explanation": "In 100,000 people, 10 have the disease (roughly 10 test positive) and 99,990 are healthy (about 1,000 false positives). The true positive probability is 10 / (10 + 1000) ≈ 0.99%.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-903",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In Special Relativity, a 10-meter ladder moving at 90% the speed of light undergoes Lorentz length contraction to fit inside an 8-meter barn. Does the ladder fit inside from the ladder's reference frame?",
    "answer": "In the ladder's frame the barn contracted even shorter, but the front and back barn doors do not close simultaneously.",
    "explanation": "Relativity of simultaneity demonstrates that events simultaneous in one inertial frame are non-simultaneous in another. The barn doors close at different moments from the ladder's vantage point.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-904",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Grandfather Paradox, if a chrononaut travels 70 years into the past and alters events so their biological grandparents never meet, why does a causal loop occur?",
    "answer": "Preventing the grandparents from meeting erases the traveler's birth, removing the traveler who initiated the trip.",
    "explanation": "This causal loop demonstrates temporal contradiction in linear timelines: if the cause is dismantled, the effect (the time traveler) cannot exist to execute the cause.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-905",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Surprise Drill Paradox, a school headmaster announces that a fire drill will take place on a weekday next week, but on the morning of the drill, nobody will anticipate it. Can the drill occur on Friday?",
    "answer": "No, because if no drill has occurred by Thursday afternoon, Friday becomes completely certain and lacks surprise.",
    "explanation": "Backward induction eliminates Friday first. Once Friday is removed, Thursday becomes predictable, and iterative elimination threatens the entire logical premise.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-906",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In Simpson's Paradox, Drug A exhibits a higher recovery rate than Drug B in male patients and a higher recovery rate in female patients. Can Drug B show a higher total recovery rate when both genders are combined?",
    "answer": "Yes, if an unequal distribution of underlying case severity acts as a confounding variable across the cohorts.",
    "explanation": "When sample sizes within subgroups are severely unbalanced across confounding categories, aggregating the data can reverse the apparent statistical association.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-907",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In Gabriel's Horn, the geometric surface formed by rotating y = 1/x (for x ≥ 1) around the x-axis has a finite volume of π but an infinite surface area. Can the horn be filled with paint?",
    "answer": "Yes, filling the finite interior volume with π cubic units of paint coats its mathematically infinite inner surface area.",
    "explanation": "The volume integral converges via ∈t₁^∈fty π (1/x)² dx = π, whereas the surface area integral diverges to infinity via ∈t₁^∈fty 2π(1/x)dx = ∈fty.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-908",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Epimenides Paradox, an ancient philosopher declares: 'All philosophers from my hometown are perpetual liars.' If the speaker is from that hometown, is the declaration true or false?",
    "answer": "The statement cannot be consistently true, but in formal logic it can simply be a falsehood told by a liar.",
    "explanation": "If it were true, the speaker would be lying, causing a contradiction. If it is false, it merely means not all philosophers from that town are liars, avoiding a strict deadlock.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-909",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In Penney's Game, when flipping a fair coin repeatedly, why does the sequence Heads-Tails-Tails (HTT) beat the sequence Heads-Tails-Heads (HTH) in reaching its pattern first?",
    "answer": "HTH can overlap with itself and reset its own progress, making its mean waiting recurrence time longer.",
    "explanation": "Sequential pattern recognition exhibits non-transitive probabilities: the internal overlap of prefixes and suffixes makes HTT appear before HTH with a 2:1 probability advantage.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-910",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Braess's Paradox, urban civil engineers build a brand-new, high-speed bypass between two congested highway junctions in Accra. Why does overall commuter travel time get worse for everyone?",
    "answer": "Selfish individual route optimization (Nash equilibrium) funnels drivers into shared bottlenecks, degrading total network flow.",
    "explanation": "When individuals independently choose an apparent personal shortcut without coordination, traffic converges on common choke points, raising collective transit times.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2001",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When Maame roasts wet grated cassava in a hot iron pan to make gari, clouds of white steam rise up and the pan gets lighter, even though she didn't scoop any cassava out. Why did the pan get lighter?",
    "answer": "The heavy liquid water inside the cassava turned into invisible water vapor gas and floated away into the air.",
    "explanation": "Fresh cassava roots are mostly water by weight. Heating drives off water through evaporation, reducing the mass remaining in the roasting pan.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2002",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Kofi has 5 ripe mangoes in his woven basket. He gives 1 mango to each of his 5 friends, yet 1 mango is still sitting inside the basket. How is that possible?",
    "answer": "Kofi handed the fifth friend the woven basket with the last mango still sitting inside it.",
    "explanation": "Giving a fruit to a person does not require removing it from its container if the container itself is handed over with the fruit.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2003",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "If you pluck a tight nylon string on a homemade seperewa harp, it sings a high note. If you loosen the peg so the same string is slack, why does it sing a low, deep note?",
    "answer": "A tighter string vibrates back and forth much faster, and faster vibrations create higher-pitched sounds.",
    "explanation": "Sound pitch depends on vibration frequency. Increasing tension increases wave speed along the string, raising the frequency of the air vibrations.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2004",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "If a trotro mate shouts 'There is nobody standing at the bus stop!', and you see one person sitting on the bench at the bus stop, was the mate lying?",
    "answer": "No, because the person at the bus stop was sitting down, not standing up.",
    "explanation": "Literal wordplay distinguishes between the physical posture of standing and sitting, even when the speaker meant the stop was empty.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2005",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you dip only the very bottom tip of a dry cube of sugar into a cup of cocoa tea, why does the brown tea climb all the way up to the top of the sugar cube against gravity?",
    "answer": "Tiny narrow spaces between the sugar grains pull the liquid upward through capillary action.",
    "explanation": "Water molecules stick to sugar surfaces (adhesion) and pull neighboring water molecules along (cohesion), drawing liquid upward through microscopic pores.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2006",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "Ama and Esi stand back-to-back in the middle of the classroom. Ama walks 4 steps north and Esi walks 4 steps south, yet they are still looking at each other's faces. How?",
    "answer": "They walked backward without turning around, or they looked into mirrors held in front of them.",
    "explanation": "Walking in a direction describes movement of the feet, not which way the head is facing. Walking backward moves them apart while facing inward.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2007",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Why does a metal roofing sheet left in the afternoon sun in Tamale feel scorching hot to your fingers, while a wooden bench right beside it feels only warm, even though both are in the exact same sunlight?",
    "answer": "Metal conducts heat into your skin much faster than wood does.",
    "explanation": "Metal is a fast thermal conductor that dumps heat energy rapidly into your hand on contact, whereas wood is a thermal insulator that transfers heat slowly.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2008",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "Before Mount Afadja (Afadjato) was discovered and measured by surveyors, what was the highest mountain peak in Ghana?",
    "answer": "Mount Afadja was still the highest peak in Ghana, even before anyone measured or named it.",
    "explanation": "Physical geography exists independently of human discovery; measuring a mountain reveals its height rather than creating it.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2009",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Starter Logic",
    "question": "A tailor has a strip of kente cloth that is 6 meters long. Every day he cuts off a 1-meter piece. On which day will he make the final cut?",
    "answer": "He makes the final cut on the 5th day, because the 5th cut divides the remaining 2-meter piece into two 1-meter pieces.",
    "explanation": "Dividing a line into N segments always requires N - 1 cuts. Five cuts produce six separate 1-meter strips.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-2010",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "When you sprinkle dry salt onto slices of fresh green cucumber or unripe mango, little puddles of water soon appear on the fruit even though you didn't pour any water. Where did the water come from?",
    "answer": "The salt draws liquid water out from inside the fruit's cells through osmosis.",
    "explanation": "Water moves across plant cell membranes from areas of low salt concentration inside the fruit toward high salt concentration on the surface.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "On a bicycle, a large front chainring gear with 48 teeth is connected by a chain to a small rear wheel gear with 16 teeth. When the rider pedals the front gear around just once, how can the back wheel spin three full times?",
    "answer": "Every tooth pulled by the chain must match on both gears, so 48 front teeth force the 16-tooth rear gear to rotate 3 times (48 ÷ 16 = 3).",
    "explanation": "Gear ratios trade force for rotational speed. Because the chain links cannot slip, one rotation of the 48-tooth gear advances 48 links, turning the 16-tooth sprocket three full revolutions.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "There are 13 schools competing in a knockout football tournament in Kumasi where every match has one winner and the loser is eliminated. Without drawing a bracket, how can you know immediately that exactly 12 matches must be played to crown the champion?",
    "answer": "Every match eliminates exactly 1 team, and to leave 1 champion out of 13 teams, 12 teams must be eliminated.",
    "explanation": "Using an invariant simplifies the problem: since each game produces exactly one loser and no draws are allowed, N teams always require N - 1 games.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "In a school cupboard there are 10 blue socks and 10 white socks mixed in the dark. Why do you only need to pull out 3 socks—not 11—to be 100% certain you have a matching pair of the same color?",
    "answer": "With only 2 colors available, the Pigeonhole Principle guarantees that among 3 socks, at least 2 must share the same color.",
    "explanation": "If you have 2 categories (Blue and White) and pick 3 items, even if the first two are different (one Blue, one White), the third sock must match one of them.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A mechanic uses a long iron crowbar resting on a small stone near a heavy boulder. By pushing down with a gentle 100-Newton force on the long end, he lifts a 500-Newton boulder on the short end. Did the crowbar create extra energy out of nothing?",
    "answer": "No, the long end must move 5 times farther down than the short end lifts up, keeping total work (Force × Distance) equal.",
    "explanation": "A first-class lever multiplies force by trading distance. Conservation of energy dictates that Force₁ × Distance₁ = Force₂ × Distance₂.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "Three friends pay 10 Cedis each (30 Cedis total) for a 25-Cedi wooden carving at Aburi Gardens. The carver gives 5 Cedis change to his apprentice, who returns 1 Cedi to each friend and keeps 2 Cedis as a tip. Each friend paid 9 Cedis (9 × 3 = 27), plus 2 Cedis tip = 29 Cedis. Where is the missing 1 Cedi?",
    "answer": "Nowhere—adding the 2-Cedi tip to the 27 Cedis paid is an accounting trick; the 2 Cedis is already inside the 27 Cedis (25 to carver + 2 to apprentice = 27).",
    "explanation": "The 30 Cedis is accounted for by 25 Cedis (carver) + 2 Cedis (apprentice) + 3 Cedis (refunded). Adding the 2-Cedi expense to the 27-Cedi total outflow double-counts the tip.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A loaded timber barge on Lake Volta floats low in the freshwater lake. When a similar barge sails out of the Volta estuary into the salty Atlantic Ocean at Ada Foah, why does the barge rise higher out of the water?",
    "answer": "Seawater contains dissolved salt that makes it denser than freshwater, so the barge needs to displace a smaller volume of ocean water to support its weight.",
    "explanation": "By Archimedes' Principle, a floating vessel displaces a weight of water equal to its own weight. Since saltwater has higher mass per liter, less submerged volume is needed.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "Nine Pesewa coins sit on a table, all showing Heads up. You are allowed to flip any two coins at a time as many times as you wish. Why is it mathematically impossible to ever get all nine coins showing Tails up?",
    "answer": "Flipping two coins always changes the number of Heads by +2, 0, or -2, so an odd number of Heads (9) can never reach an even number of Heads (0).",
    "explanation": "This is a parity invariant. Because 9 is odd and every two-coin move preserves the odd parity of Heads, the state of 0 Heads (which is even) is unreachable.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "During a total solar eclipse visible in Ghana, the tiny Moon (diameter 3,474 km) completely covers the giant Sun (diameter 1,392,000 km). How can a small pebble-sized Moon hide a star 400 times wider?",
    "answer": "The Sun is roughly 400 times farther away from Earth than the Moon is, making both appear almost the exact same angular size (about 0.5°) in our sky.",
    "explanation": "Apparent angular diameter depends on the ratio of physical diameter to distance. Because 400 ÷ 400 = 1, the Moon's disk matches the Sun's disk from Earth's perspective.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2009",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A waterlily pad floating on Barekese Dam doubles the pond area it covers every single day. If it takes 30 days to cover the entire pond, on which day was the pond half-covered?",
    "answer": "On Day 29, the day right before the final day.",
    "explanation": "Exponential doubling means each day reaches twice the coverage of the previous day. Working backward from 100% on Day 30 gives 50% on Day 29.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-2010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "In a village of Truth-tellers (who always tell the truth) and Liars (who always lie), you meet Kofi and Yaw. Kofi says, 'At least one of us is a Liar.' Can you tell who is who?",
    "answer": "Kofi must be a Truth-teller and Yaw must be a Liar.",
    "explanation": "If Kofi were a Liar, then 'at least one of us is a Liar' would be true, contradicting his Liar nature. Therefore Kofi tells the truth, which forces Yaw to be the Liar.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2001",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "During World War II, engineers wanted to armor the wing and tail sections of returning aircraft that had the most bullet holes. Statistician Abraham Wald told them to armor the engines—where returning planes had ZERO bullet holes. Why was Wald right?",
    "answer": "Planes hit in the engines never returned to base to be counted, exposing a classic case of Survivorship Bias.",
    "explanation": "Survivorship bias occurs when analysts study only the survivors of a process and overlook the missing failures. Bullet holes on returning planes showed where a plane could be hit and still survive.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2002",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Cobra Effect (perverse incentive), a colonial administration offered a cash bounty for every dead venomous cobra brought to the office to reduce snake numbers. Why did the wild cobra population end up increasing instead?",
    "answer": "Enterprising citizens began secretly breeding cobras for the bounty, and when the government canceled the program, breeders released the worthless snakes into the wild.",
    "explanation": "Goodhart's Law and perverse incentives show that rewarding a proxy metric (dead snakes delivered) rather than the true goal (fewer wild snakes) incentivizes gaming the system.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2003",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "According to Benford's Law, if you inspect the leading (first) digit of the population sizes of all towns in Ghana, or the lengths of all rivers in Africa, which first digit appears most often: 1 or 9?",
    "answer": "The digit 1 leads roughly 30.1% of the time, while the digit 9 leads less than 4.6% of the time.",
    "explanation": "Real-world quantities that grow multiplicatively span logarithmic scales. Moving from 1 to 2 requires a 100% increase, whereas moving from 9 to 10 requires only an 11.1% increase.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2004",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In Berkson's Paradox, suppose academic talent and athletic talent are completely independent in the general student population. If an elite scholarship admits students who excel in at least one of the two, why will academic and athletic scores appear negatively correlated inside the scholarship group?",
    "answer": "Conditioning on a combined admission threshold (a collider variable) excludes students low in both, making high performance in one trait statistically compensate for lower performance in the other among admittees.",
    "explanation": "Inside the selected cohort, a student with a low academic score must have had a stellar athletic score to qualify, creating a spurious negative correlation.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2005",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In the Tragedy of the Commons, ten herders share a lush communal grazing pasture in the Northern Region. Every individual herder earns +10 Cedis profit by adding one extra cow to their herd, yet all ten herders end up bankrupt. Why?",
    "answer": "Each herder captures 100% of the benefit of their extra cow while sharing only 1/10th of the overgrazing cost, driving collective depletion of the pasture.",
    "explanation": "When individual marginal gain exceeds the individual share of communal environmental degradation, rational self-interest destroys the shared resource unless regulated.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2006",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "In the Mpemba Effect and evaporative cooling, why does water stored inside an unglazed porous clay pot (kuluu) in Bolgatanga become noticeably colder than the hot 38°C dry Harmattan air surrounding it?",
    "answer": "Water seeps through microscopic pores in the clay and evaporates into the dry air, absorbing latent heat of vaporization from the remaining water inside.",
    "explanation": "Phase transition from liquid to gas requires significant thermal energy (2,260 J/g). The highest-energy molecules escape into the dry Harmattan wind, lowering the average kinetic energy (temperature) of the water left behind.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2007",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "On a standard 8×8 draughts board (64 squares), if you saw off two diagonally opposite corner squares (leaving 62 squares), can you cover the remaining 62 squares completely using 31 dominoes that each cover 2 adjacent squares?",
    "answer": "No, it is mathematically impossible because opposite corners share the same color, leaving 32 squares of one color and only 30 of the other.",
    "explanation": "Each 1×2 domino must always cover one light square and one dark square. Therefore, 31 dominoes require exactly 31 light and 31 dark squares, which a 32-to-30 board violates.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2008",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In the Inspection Paradox (Waiting Time Paradox), buses arrive at Circle Station on average every 10 minutes, but with irregular gaps (sometimes 2 minutes, sometimes 18 minutes). If a passenger walks up at a random moment, why is their average wait longer than 5 minutes?",
    "answer": "A random arrival is statistically much more likely to land inside an 18-minute gap than a 2-minute gap because longer intervals occupy more of the timeline.",
    "explanation": "Length-biased sampling means the probability of arriving during a specific headway is proportional to that headway's duration, raising the expected wait time above half the mean interval.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2009",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "In Jevons Paradox, when engineers invent a charcoal stove that burns 50% less charcoal to cook the same pot of banku, why can total national charcoal consumption sometimes increase rather than decrease?",
    "answer": "Higher efficiency lowers the effective cost of cooking, prompting households and food vendors to cook more frequently and expand usage.",
    "explanation": "In resource economics, technological improvements that increase efficiency reduce the unit price of energy services, which can trigger elastic demand growth that outpaces the savings.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-2010",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "In the Muddy Children Puzzle, three pupils have mud on their foreheads. Each sees the others' foreheads but not their own. The teacher says, 'At least one of you has mud on your forehead. Step forward if you know you have mud.' Nobody steps forward on Round 1 or Round 2, then all three step forward together on Round 3. How did they know?",
    "answer": "Each child reasoned: 'If only 2 of us had mud, the muddy ones would have stepped forward on Round 2; since nobody moved on Round 2, I must be the third muddy person.'",
    "explanation": "Public announcement creates common knowledge. Each round of inaction eliminates the hypothesis of k = 1, then k = 2 muddy foreheads, allowing all three to deduce k = 3 on Round 3.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3001",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Kofi has a basket with 3 mangoes. He gives 2 mangoes to Ama, but the basket still has 3 mangoes in it. How can this be true?",
    "answer": "Kofi gave Ama 2 mangoes from the basket, but Ama put them back into the basket after saying thank you.",
    "explanation": "The basket still has 3 mangoes because the mangoes were returned. This shows that counting objects can change if things are added back.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3002",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "What gets wetter and wetter the more it dries?",
    "answer": "A towel.",
    "explanation": "A towel absorbs water and becomes wet while it dries you. The more it dries, the wetter it becomes.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3003",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Number Sense",
    "question": "If you have 5 oranges and you take away 3, how many oranges do you have?",
    "answer": "You have 3 oranges because you took them.",
    "explanation": "The question asks how many you have after taking, not how many are left behind. You took 3, so you have 3.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3004",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Ama looks at a picture and says, 'I have no brothers or sisters, but that person's mother is my mother's daughter.' Who is in the picture?",
    "answer": "Ama is looking at a picture of herself.",
    "explanation": "Ama's mother's daughter is Ama herself. So the person's mother is Ama, meaning the picture is of Ama.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3005",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Lateral Logic",
    "question": "What has hands but cannot clap?",
    "answer": "A clock.",
    "explanation": "A clock has hands (the pointers) but they cannot clap. This is a wordplay on the word 'hands'.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3006",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Kwame says he can see something that is far away but cannot see something that is close. What is he looking at?",
    "answer": "He is looking at the sky or a distant object while his hand is in front of his face.",
    "explanation": "If something is too close, it may block your view or be out of focus. Far objects can still be seen.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3007",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Wordplay Logic",
    "question": "What comes down but never goes up?",
    "answer": "Rain.",
    "explanation": "Rain falls down from the clouds but does not go back up. This is a simple observation of nature.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3008",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Number Sense",
    "question": "Adwoa has 2 brothers. Each brother has 1 sister. How many sisters are there in the family?",
    "answer": "There is 1 sister (Adwoa).",
    "explanation": "Both brothers share the same sister, Adwoa. So there is only one sister in the family.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3009",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Lateral Logic",
    "question": "What can you catch but not throw?",
    "answer": "A cold.",
    "explanation": "You can catch a cold (become sick) but you cannot throw a cold to someone else. This is wordplay.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-nov-3010",
    "targetGroup": "Novice (Basic 1-3)",
    "difficulty": "Observation",
    "question": "Yaa says she has a pet that has four legs but cannot walk. What could it be?",
    "answer": "A table or a chair.",
    "explanation": "Furniture like tables and chairs have four legs but cannot walk. They are not alive.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
    "answer": "9 sheep are left.",
    "explanation": "The phrase 'all but 9' means all except 9 ran away. So 9 sheep remain.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "A trotro driver drives 10 km north, then 10 km south, then 10 km east. How far is he from his starting point?",
    "answer": "10 km east.",
    "explanation": "The north and south trips cancel out. The only remaining displacement is 10 km east.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If a rooster lays an egg on top of a roof, which side does the egg roll down?",
    "answer": "Roosters do not lay eggs.",
    "explanation": "Only hens lay eggs. The premise is impossible, so there is no egg to roll.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A woman has 7 children, and half of them are boys. How is this possible?",
    "answer": "All 7 children are boys.",
    "explanation": "Half of 7 is 3.5, which is not a whole number. The only way half can be boys is if all are boys, so half (in a loose sense) are boys.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Probability Logic",
    "question": "You have a basket with 3 red balls and 2 blue balls. You pick one ball without looking. What is the probability of picking a red ball?",
    "answer": "3/5 or 60%.",
    "explanation": "There are 5 balls total, 3 are red. The probability is 3 out of 5.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "A cup of water has an ice cube floating in it. When the ice melts, does the water level rise, fall, or stay the same?",
    "answer": "The water level stays the same.",
    "explanation": "The ice cube displaces its own weight in water. When it melts, it becomes water of the same weight, so the level does not change.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Observation",
    "question": "A man pushes his car to a hotel and tells the owner he is bankrupt. Why?",
    "answer": "He is playing Monopoly.",
    "explanation": "In the board game Monopoly, you push a car token to a hotel and can go bankrupt. This is a classic lateral thinking puzzle.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Number Sense",
    "question": "What is the next number in the sequence: 2, 3, 5, 7, 11, ...?",
    "answer": "13.",
    "explanation": "These are prime numbers. The next prime after 11 is 13.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3009",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Lateral Logic",
    "question": "A man lives on the 10th floor of a building. Every day he takes the elevator down to the ground floor to go to work. When he returns, he takes the elevator to the 7th floor and walks up the stairs to the 10th floor. Why?",
    "answer": "He is short and can only reach the button for the 7th floor.",
    "explanation": "The man is too short to press the 10th floor button, so he takes the elevator to the 7th floor and walks the rest.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-app-3010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "difficulty": "Math & Physics",
    "question": "If you have a 3-liter jug and a 5-liter jug, how can you measure exactly 4 liters of water?",
    "answer": "Fill the 5-liter jug, pour into the 3-liter jug until full, empty the 3-liter jug, pour the remaining 2 liters into the 3-liter jug, fill the 5-liter jug again, and pour into the 3-liter jug until full. You now have 4 liters in the 5-liter jug.",
    "explanation": "This is a classic water jug problem. By transferring water between jugs, you can measure exact amounts.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3001",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "In a room of 23 people, what is the probability that at least two people share the same birthday?",
    "answer": "About 50.7%.",
    "explanation": "This is the birthday paradox. With 23 people, there are 253 possible pairs, making a shared birthday more likely than intuition suggests.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3002",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "A crocodile steals a child and promises to return the child if the parent correctly guesses what the crocodile will do. The parent guesses, 'You will not return my child.' What should the crocodile do?",
    "answer": "The crocodile is caught in a paradox: if it returns the child, the parent guessed wrong, so it should not return the child; if it does not return the child, the parent guessed right, so it must return the child.",
    "explanation": "This is a classic self-referential paradox. The crocodile's promise creates a logical contradiction.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3003",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "A train leaves Accra at 60 km/h. Another train leaves Kumasi at 80 km/h. The distance is 300 km. When they meet, which train is closer to Accra?",
    "answer": "They are at the same distance from Accra when they meet.",
    "explanation": "When two trains meet, they are at the same point. Therefore, they are equally close to Accra.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3004",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "A barber shaves all and only those men in town who do not shave themselves. Who shaves the barber?",
    "answer": "The barber cannot shave himself if he does not shave himself, and cannot not shave himself if he does. This is a paradox with no solution.",
    "explanation": "This is the barber paradox, a version of Russell's paradox. It shows that a set cannot contain itself as a member.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3005",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You flip a fair coin 10 times and get heads every time. What is the probability of getting heads on the 11th flip?",
    "answer": "50%.",
    "explanation": "Each coin flip is independent. The past results do not affect the next flip.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3006",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "A ship's planks are gradually replaced one by one until none of the original planks remain. Is it still the same ship?",
    "answer": "There is no definitive answer; it depends on whether identity is defined by material or by form/continuity.",
    "explanation": "This is the Ship of Theseus paradox. It questions what makes an object the same over time.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3007",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Deductive Logic",
    "question": "This sentence is false. Is it true or false?",
    "answer": "It is neither true nor false; it is a paradox.",
    "explanation": "This is the liar paradox. If it is true, it is false; if it is false, it is true.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3008",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Math & Physics",
    "question": "Achilles and the tortoise race. Achilles runs 10 times faster than the tortoise. The tortoise has a 100-meter head start. Can Achilles ever catch the tortoise?",
    "answer": "Yes, in finite time, because the sum of the distances is finite.",
    "explanation": "This is Zeno's paradox. The infinite series of distances converges to a finite value, so Achilles catches the tortoise.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3009",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Probability Logic",
    "question": "You are on a game show with 3 doors. One has a car, two have goats. You pick door 1. The host, who knows what is behind the doors, opens door 3 revealing a goat. Should you switch to door 2?",
    "answer": "Yes, switching gives a 2/3 chance of winning.",
    "explanation": "This is the Monty Hall problem. Switching doubles your chances because the host's action reveals information.",
    "isCentral": true
  },
  {
    "id": "tt-paradox-sch-3010",
    "targetGroup": "Scholar (JHS)",
    "difficulty": "Classic Paradox",
    "question": "If a tree falls in a forest and no one is around to hear it, does it make a sound?",
    "answer": "It depends on whether sound is defined as pressure waves or as the perception of those waves.",
    "explanation": "This is a philosophical paradox about observation and reality. It questions whether unobserved events have properties.",
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
      "Yaw’s statement about ice cream being the most delicious food",
      "Esi’s statement about ice melting in the sun",
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
      "A bird flying outside the window",
      "Kofi, who was reading upstairs in clean socks",
      "Dad, who was away at work",
      "Amina, who was playing in the muddy garden"
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
      "Both are Facts",
      "Sentence 1 is a Fact; Sentence 2 is an Opinion",
      "Both are Opinions",
      "Sentence 1 is an Opinion; Sentence 2 is a Fact"
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
      "Paint cannot spill on a table",
      "TVs do not work in the morning",
      "Art class only happens on Saturdays",
      "The noon news airs at 12:00 PM, not 10:00 AM"
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
      "School bells only ring at night",
      "He mixed up the cause (the loud bell) and the effect (the birds flying away)",
      "Birds cannot hear loud bells",
      "Mango trees do not have branches"
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
      "It hasn’t rained for a month",
      "The classroom roof is made of glass",
      "She went swimming with her umbrella",
      "It is raining outside"
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
      "Elephants use their trunks to drink water and pick up food",
      "Elephants are the cutest animals in the whole park",
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
      "Blue markers turn invisible at break time",
      "The marker vanished into thin air",
      "Mrs. Mensah only had 2 markers before break",
      "Kojo borrowed the 4th blue marker from Mrs. Mensah’s desk"
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
      "9 out of 10 is less than half",
      "Conflict of interest & biased sample: the soda company ran the survey at its own party",
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
      "Bookmarks cannot fit inside textbooks",
      "Libraries are never open on Saturdays",
      "Science textbooks only have 30 pages",
      "In standard books, odd page 45 is on the right and even page 46 is printed on the back of the exact same sheet!"
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
      "Newsletters cannot print percentages",
      "Her sample size (only 2 friends) is way too small to represent the whole school",
      "Her friends do not attend the school",
      "2 out of 2 is actually 50%"
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
      "Laptops glow brightly even when turned off",
      "ICT labs do not have doors",
      "Security guards do not work at night",
      "In total darkness without light, human eyes cannot distinguish colours like dark green and brown"
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
      "There is no bias at all",
      "Loaded / Leading Question: it uses emotional words (\"reckless, noisy\" vs \"peaceful, hardworking\") to push one answer",
      "Math error: it does not include numbers",
      "Time bias: break time is in the afternoon"
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
      "Someone threw the stone from outside in the garden",
      "Glass always falls toward the sun",
      "A strong wind sucked the glass through the wall",
      "The window was broken from the INSIDE pushing outward, not from outside"
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
      "Blue, Green, Yellow, Red",
      "Blue, Red, Green, Yellow",
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
      "Neither, because mosquitoes do not transmit malaria",
      "Source B, because voice notes are faster to listen to",
      "Both sources are equally reliable",
      "Source A, because it comes from verified medical experts backed by scientific research"
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
      "Accidents make people hungry for dessert",
      "Ice cream makes water heavier",
      "Hot weather: sunny, hot months cause more people to buy ice cream AND more people to go swimming",
      "Swimming pools sell all the ice cream in the city"
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
      "Freshwater algae only grow inside bronze statues",
      "Boots naturally produce pond algae when dry",
      "The Atlantic Ocean at Ada has no salt at night"
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
      "Going from 1 to 2 is actually a 500% increase",
      "Apps cannot track test scores",
      "It uses a relative percentage (100% increase) on a tiny baseline (1 point to 2 points) and a sample size of 1 to hide poor actual performance",
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
      "Screenshots automatically erase server logs",
      "Servers always record dates two days in the future",
      "Thursday comes before Tuesday"
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
      "Measuring the rainfall in Accra",
      "Asking the person who forwarded the photo",
      "Reverse image searching / provenance verification to expose recycled doctored imagery",
      "Counting the shark’s teeth"
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
      "His phone screen can only display titanium videos",
      "All scientists recently agreed the Moon is hollow",
      "Algorithmic filter bubble: recommendation algorithms feed him more of what he clicked on, not a balanced view of reality",
      "The internet deleted all astronomy textbooks"
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
      "Ad Hominem (attacking the opponent’s personal background)",
      "Appeal to Authority (citing a famous person)",
      "Circular Reasoning (assuming the conclusion in the premise)",
      "Strawman Fallacy (exaggerating and distorting the opponent’s actual proposal to make it easy to attack)"
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
      "Sunk Cost Fallacy (continuing because of past investment)",
      "Ad Hominem (attacking the person’s appearance/character instead of refuting their evidence)",
      "False Dilemma (presenting only two extremes)",
      "Post Hoc Ergo Propter Hoc (assuming sequence equals cause)"
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
      "Equivocation (shifting the meaning of a word mid-argument)",
      "Appeal to Ignorance (claiming something is true because it hasn’t been disproven)",
      "Bandwagon Fallacy (claiming it is true because it is popular)",
      "False Dilemma / False Dichotomy (forcing a choice between two extreme options while ignoring middle-ground solutions)"
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
      "99%, because the sensor is 99% accurate",
      "About 9% (1 true positive out of ~11 total positive alarms), NOT 99%!",
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
      "Appeal to Tradition (doing it because it is old)",
      "Confirmation Bias (only reading positive reviews)",
      "The Gambler’s Fallacy (believing a coin flip is due for heads)",
      "The Sunk Cost Fallacy (making poor future decisions to justify past unrecoverable spending)"
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
      "Tea cannot be served warm in a laboratory",
      "Lack of a blinded Placebo Control Group and reliance on subjective self-reporting instead of objective memory tests",
      "A week is 10 days long",
      "100 volunteers is an odd number"
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
      "Modus Ponens (valid deduction)",
      "Modus Tollens (valid contrapositive)",
      "Begging the Question",
      "Affirming the Consequent (If P then Q; Q is true; therefore P — ignoring that students outside Robotics can also know how to code)"
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
      "Standard deviation normalization",
      "P-Hacking / Cherry-Picking (testing many hypotheses and reporting only the random false positive while hiding negative trials)",
      "Double-blind randomization",
      "Peer review replication"
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
      "Plantain tastes much better when eaten with groundnuts.",
      "Roasted plantain is the tastiest snack in Ghana.",
      "Plantains grow on large herbaceous plants with broad leaves.",
      "Yellow ripe plantain is much prettier than green plantain."
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
      "A person wearing rubber-soled car-tire sandals (kyorkyor)",
      "A stray goat searching for dropped bread",
      "A domestic cat chasing a field mouse",
      "A barefoot pupil rushing to class"
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
      "Between 7:00 AM and 7:45 AM while packing her bag",
      "At 12:00 PM during lunch break",
      "After 9:00 AM during the spelling test",
      "Before 6:30 AM before waking up"
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
      "Honey is the most delicious food on earth.",
      "Yellow flowers are far friendlier than red flowers.",
      "Honeybees have six legs and two pairs of wings.",
      "Honeybees are scary creatures that should be avoided."
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
      "Kofi, who was helping his aunt sift cassava flour for fufu",
      "Kwame, who was painting green grass outside",
      "Yaw, who was carrying damp charcoal to the stove",
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
      "The pupils recited their multiplication tables too loudly.",
      "The wind blew through the open window.",
      "The chemical energy in its AA battery was fully depleted.",
      "The teacher closed her textbook on the front desk."
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
      "They emerged after the rain flooded their underground soil burrows.",
      "They climbed out before the rain started at 1:00 PM.",
      "The dry soil at 2:00 PM pushed them out.",
      "They wanted to sunbathe before sunset."
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
      "Swimming in the lake is much more exciting than walking around it.",
      "It is Ghana's only natural lake, formed in a meteorite impact crater.",
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
      "Cup B",
      "Cup D",
      "Cup A",
      "Cup C"
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
      "The entire township experienced a scheduled electrical blackout from 7:00 PM to 10:00 PM.",
      "The solar battery weighed 15 kilograms.",
      "His neighbor saw him drinking water at 6:00 PM.",
      "The ICT room door was locked with a brass key."
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
      "The customer",
      "A market security guard",
      "The shopkeeper"
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
      "Backyard soil contains too many minerals.",
      "Testing two plants is an insignificantly small sample size that cannot rule out natural variation.",
      "Maize only grows in the northern savannah.",
      "Organic fertilizer should never be applied to cereal crops."
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
      "The computer teacher wearing clean leather dress shoes",
      "A student who was sitting on the concrete assembly court",
      "The library prefect who spent the afternoon in the air-conditioned reading room",
      "A groundskeeper who spent the afternoon weeding by the red clay drainage ditch"
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
      "The laboratory thermometer contained colored alcohol instead of mercury.",
      "The football pitch was cut with a lawnmower on Saturday morning.",
      "Mansa owns a blue school uniform dress.",
      "The school weather station recorded torrential rain and thunder between 3:00 PM and 4:00 PM."
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
      "The canteen uses too much salt in the jollof rice.",
      "Personal familial bias and loyalty distorted his objective assessment.",
      "The survey was carried out on a Wednesday afternoon.",
      "The son has superior taste buds compared to all other pupils."
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
      "Confusing screen brightness with battery life.",
      "Ignoring the cost of shipping spare parts from Accra.",
      "Assuming touchscreens operate using heat rather than capacitance.",
      "Hasty generalization from an unrepresentative, minuscule sample."
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
      "The crime occurred inside an enclosed concrete basement.",
      "The owner of the handkerchief must be a licensed farmer.",
      "The handkerchief was exposed to blooming Baobab trees during that specific dry season window.",
      "Baobab trees cannot survive in the savanna regions of West Africa."
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
      "It does not list the Latin binomial botanical name for neem.",
      "It promotes consuming highly toxic corrosive substances alongside urgency and conspiracy tropes without medical peer review.",
      "It uses words from a local indigenous tree species.",
      "It was transmitted via a mobile messaging application."
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
      "Circular Reasoning, by repeating the premise as the conclusion",
      "Appeal to Ignorance, by demanding unprovable evidence",
      "Ad Hominem attack on Speaker A's ancestry",
      "Straw Man fallacy, by exaggerating and misrepresenting the original argument into an extreme stance"
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
      "The suspect recently washed his hands with clean distilled water.",
      "The suspect's hands contain high amounts of ammonia ions, directly contradicting his statement.",
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
      "Private schools are legally forbidden from calculating averages.",
      "They should have reported the salary in US Dollars.",
      "Nine teachers is an uneven number for calculating percentages.",
      "The extreme outlier (the owner's salary) severely skews the arithmetic mean upward, misrepresenting the median experience."
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
      "Equivocation",
      "Slippery Slope fallacy",
      "False Dilemma",
      "Red Herring fallacy"
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
      "Villages with clinics have diagnostic testing and record-keeping, whereas cases in remote villages go undiagnosed and unrecorded.",
      "Rural villagers without clinics have biological immunity to Plasmodium.",
      "Health clinics actively manufacture and release mosquitoes.",
      "Medical doctors attract malaria parasites to their offices."
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
      "Copper (Cu²⁺)",
      "Iron (Fe²⁺)",
      "Lead (Pb²⁺)",
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
      "Planting baobab trees is much more fun than planting mango trees.",
      "Baobab tree trunks store water to survive dry savanna seasons.",
      "Green leaves look friendlier than dry brown bark.",
      "The baobab seedling is the most beautiful plant in the school garden."
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
      "The workbook has a red plastic cover.",
      "Yellow ink matching the exact shade was used to highlight spelling words in that book."
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
      "The water turned into solid ice cubes.",
      "Solar heat caused liquid water molecules to evaporate into water vapor.",
      "The concrete table soaked all the water through the bottom of the bowl.",
      "The wind carried the plastic bowl away."
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
      "At 6:45 AM while eating porridge",
      "At 8:00 AM during morning assembly",
      "At 7:30 AM upon reaching school",
      "At 6:15 AM while brushing his teeth"
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
      "A local domestic dog whose claws leave distinct indentations",
      "A pet cat whose claws remain retracted when walking",
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
      "Laptops are nicer to carry than spiral notebooks.",
      "Keyboards with blue letters are much cooler than black ones.",
      "Playing computer games is more educational than reading storybooks.",
      "Computer monitors use electrical energy to display images."
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
      "The ground reacting to the student's running shoes.",
      "Vibrations created in the air column as forced air splits across the whistle edge.",
      "The whistle changing color due to air pressure.",
      "The plastic shell of the whistle absorbing sunlight."
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
      "They were frozen in ice.",
      "They had blown away into the stratosphere.",
      "They were soaked with rainwater because the storm was ongoing."
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
      "Kwabena was playing football in damp red mud.",
      "Kwabena had direct physical contact with the chalk around the time it broke.",
      "Kwabena was drinking milk in the cafeteria.",
      "Kwabena was sweeping leaves in the mango orchard."
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
      "Plantains should always be fried rather than boiled.",
      "Cocoyam leaves make the most delicious stew in West Africa.",
      "Fufu is far more enjoyable than banku."
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
      "The science store room has an iron padlock.",
      "The laboratory scale weighs 2.5 kilograms.",
      "Kofi borrowed a mathematics textbook on Wednesday morning.",
      "The librarian logged that the library was locked and closed all Thursday afternoon for pest fumigation."
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
      "After 11:00 AM while bread was in display glass",
      "Between 7:00 AM and 8:00 AM before mixing",
      "Between 8:00 AM and 9:30 AM while rising",
      "Between 9:30 AM and 10:15 AM during baking"
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
      "He failed to peel the orange with a kitchen knife.",
      "He assumed the quality of an entire regional harvest based on a single unrepresentative specimen.",
      "He tested an orange grown during the minor rainy season.",
      "He forgot that oranges contain citric acid."
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
      "A baboon troop",
      "A roan antelope",
      "An African bush elephant"
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
      "The sand along the beach grew hotter under the sun.",
      "Mangrove tree roots anchor shoreline sediment and absorb incoming wave energy.",
      "Mangrove leaves attract rainclouds from the Atlantic Ocean.",
      "Local fishermen caught fewer tilapia in the deep sea."
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
      "The beach in Cape Coast faces the Atlantic Ocean.",
      "Generators convert mechanical energy into electricity.",
      "Diesel fuel produces black exhaust fumes when burned.",
      "No solar eclipse occurred anywhere on Earth on that calendar date."
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
      "The headteacher should have surveyed teachers instead of students.",
      "Cabbage stew contains vitamin C and fiber.",
      "The survey took place before Friday sports afternoon.",
      "A sample of 2 out of 600 students (0.33%) is statistically inadequate to represent school-wide preferences."
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
      "The document was stored in a damp drawer.",
      "The writer was left-handed.",
      "The added text was written with a completely different ink formulation, confirming document forgery.",
      "The paper was manufactured from bamboo pulp."
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
      "Higher power consumption directly increases total bills under existing rates; the appliances consume power rather than setting utility rates.",
      "Household electricity meters measure kilowatt-hours.",
      "Air conditioners reduce humidity in tropical climates.",
      "Utility companies generate electricity using thermal power plants."
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
      "NASA employs astrophysicists and operates space telescopes.",
      "Asteroids orbit the Sun within the solar system.",
      "It uses hyperbolic apocalyptic claims, artificial urgency, and demands viral forwarding without links to NASA peer databases.",
      "It names a real lake located in the Eastern Region of Ghana."
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
      "Bromide (Br⁻)",
      "Iodide (I⁻)",
      "Chloride (Cl⁻)",
      "Sulfate (SO₄²⁻)"
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
      "Reporting percentages on an extremely small sample (N=2) conceals the lack of statistical power and high margin of error.",
      "Patients should never be given pharmaceutical placebos.",
      "Symptoms must be measured in numerical units.",
      "Clinical trials must be conducted in public university hospitals."
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
      "Appeal to Authority",
      "Genetic Fallacy",
      "False Dilemma (bifurcation, ignoring intermediate solutions)",
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
      "Infrared thermal imaging",
      "Standard high-definition video camera zoom",
      "Closed-circuit analog security recording"
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
      "Traffic delays cause rainfall from the atmosphere.",
      "Umbrellas create physical blockades on overhead highway ramps.",
      "Rainfall independently prompts pedestrians to carry umbrellas while slowing traffic due to wet roads and poor visibility.",
      "Pedestrians using umbrellas distract commercial minibus drivers."
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
      "Iron (Fe³⁺)",
      "Calcium (Ca²⁺)",
      "Sodium (Na⁺)",
      "Lead (Pb²⁺)"
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
      "Suspect D",
      "Suspect A",
      "Suspect C holds a leaking blue ballpoint pen",
      "Suspect B"
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
      "The cupboard door was made of timber wood.",
      "The seed wanted to sleep during the term.",
      "The sand was too clean to hold seeds."
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
      "Harmattan winds carry dry, dusty continental air from the Sahara Desert.",
      "Dust haze makes the sky look ugly.",
      "The harmattan wind is boring and dull.",
      "Mornings in harmattan feel much nicer than rainy mornings."
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
      "A stray sheep wandering from the field",
      "Someone wearing rubber sandals",
      "Someone walking barefoot with wet feet",
      "Someone wearing leather boots"
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
      "At 9:00 AM during math class",
      "At 6:30 AM while putting them on at home",
      "At 7:15 AM while walking through puddles",
      "At 8:00 AM during class registration"
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
      "A crow from the tree",
      "A grasshopper",
      "A barking dog"
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
      "Baby goats are cuter than baby chicks.",
      "Goats are stubborn and difficult to herd.",
      "Goat meat makes the best light soup.",
      "Goats are mammals that nurse their kids with milk."
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
      "The sports shed door was made of wooden boards.",
      "The European football leagues only kick off evening matches after 7:00 PM GMT.",
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
      "To increase corporate bread sales and boost profits through biased health claims.",
      "To encourage pupils to eat local cassava dishes.",
      "To teach children poetry recitation techniques.",
      "To help children improve their English exam marks."
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
      "Between 7:20 AM and 7:40 AM",
      "After 8:00 AM during lessons",
      "Between 7:05 AM and 7:20 AM",
      "Between 6:45 AM and 7:05 AM"
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
      "Testing a single battery on an overcast day is an insufficient sample size under poor charging conditions.",
      "Solar batteries only charge on Sundays.",
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
      "The shed was painted blue last year.",
      "The crowbar was manufactured in Germany.",
      "The crowbar with matching paint transferred residue during forceful contact with the latch.",
      "The padlock was damaged by rainwater rust."
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
      "Impermeable concrete prevents rain from infiltrating the soil, generating heavy surface runoff.",
      "Grass attracts more rainclouds from the Atlantic Ocean.",
      "The concrete made the air cooler.",
      "Concrete absorbs more rainwater than porous grass soil."
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
      "Trees lose their leaves during Friday mornings.",
      "In Cape Coast (Northern Hemisphere tropics), midday sun casts shadows toward the North, not the South.",
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
      "Rainwater harvesting is practiced in West Africa.",
      "Clay pots are made by shaping natural wet earth.",
      "Water tanks are installed on concrete platforms."
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
      "Households in Ghana often keep watchdogs.",
      "The survey was done on a Saturday afternoon.",
      "Extrapolating national demographic statistics from two local homes is a hasty generalization with an unrepresentative sample.",
      "Cats are carnivorous mammals."
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
      "Food vendors intentionally trip passing shoppers.",
      "Eating food while walking impairs inner-ear vestibular balance.",
      "Street food contains hot peppers that blind pedestrians.",
      "Dense commercial pedestrian activity attracts food stalls and naturally increases pedestrian congestion and exposure to traffic."
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
      "Appeal to Tradition",
      "Post Hoc Ergo Propter Hoc",
      "Straw Man Fallacy",
      "Ad Hominem (attacking Kwame's personal academic record instead of evaluating the funding proposal)"
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
      "It is a neutral hydrocarbon solvent.",
      "It is an acid producing aqueous hydronium (H⁺) ions that liberate carbon dioxide gas from carbonates.",
      "It is saturated sodium chloride solution.",
      "It is a strong base containing hydroxide ions."
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
      "Calculating the median rather than the mean.",
      "Plotting data using scatter diagrams.",
      "Using standard deviation without variance.",
      "Presenting a 100% relative percentage increase to obscure a negligible 1% absolute increase."
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
      "Slippery Slope",
      "Appeal to Ignorance (Argumentum ad Ignorantiam)",
      "False Analogy",
      "Circular Reasoning"
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
      "Rain clouds prevent tsunamis from striking land.",
      "Boats on Lake Volta travel at slow speeds.",
      "Freshwater cannot form waves of any height.",
      "Lake Volta is an artificial inland reservoir lacking the oceanic seismic subduction mechanisms that produce tsunamis."
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
      "The harmonic variance",
      "The standard deviation",
      "The maximum range",
      "The median, which is unaffected by extreme skewing outliers"
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
      "Copper (Cu²⁺)",
      "Barium (Ba²⁺)",
      "Sodium (Na⁺)",
      "Potassium (K⁺)"
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
      "Watching snails crawl is more relaxing than watching birds fly.",
      "Snails are the slimy and disgusting creatures of the forest.",
      "Snails move much too slowly to be interesting pets.",
      "The snail carries an exoskeleton spiral shell made of calcium carbonate."
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
      "Yaw, who was chewing sugarcane in the compound",
      "Madam Afua, who applied red cosmetic lipstick before assembly",
      "Esi, who was writing her spelling words with a green pencil",
      "Master Kwesi, the sports master wearing track shoes"
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
      "The kitchen counter absorbed green pigment from sunlight.",
      "The baker added green pepper powder into the dough.",
      "Microscopic fungal spores in the air landed on the moist bread and germinated into mold colonies."
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
      "Pupils were eating lunch during afternoon break",
      "Pupils were actively assembled at morning prayers under the mango tree",
      "English class had already begun inside the classroom",
      "The morning school bell had not yet rung"
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
      "Swimming in saltwater is more enjoyable than swimming in swimming pools.",
      "Seaside breezes smell far better than inland forest breezes.",
      "The ocean is much more frightening than Lake Volta.",
      "Ocean water has a high concentration of dissolved mineral salts like sodium chloride."
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
      "A domestic chicken with a toothless hard keratin beak",
      "A human or mammalian carnivore/omnivore mouth with incisors and prominent canine teeth",
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
      "Mineral oil chemically dissolves iron oxide overnight.",
      "Iron cannot form rust when submerged under any liquid.",
      "The test tube glass reflected away all ambient light.",
      "Boiling expelled dissolved oxygen, and the oil barrier prevented atmospheric oxygen from contacting the iron."
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
      "Between 12:00 PM and 12:20 PM",
      "Between 12:30 PM and 1:00 PM",
      "After 2:00 PM during closing assembly",
      "Between 11:30 AM and 12:00 PM"
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
      "The student was sleeping under a tree.",
      "The storage room floor was painted yellow.",
      "The mud was blown through the roof by the harmattan wind.",
      "The student with matching yellow mud walked through the storage room after walking in yellow mud."
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
      "Working with copper wires is much easier than drawing graphs.",
      "Copper looks far more elegant than aluminum metal.",
      "Copper is an electrical conductor that permits the free flow of electric charge.",
      "Electric circuits are the most thrilling science experiments to build."
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
      "The clinic doors were secured with steel bolts.",
      "In Ghana (near the equator), the sun sets between 5:45 PM and 6:30 PM, making a 9:00 PM sunset impossible.",
      "Solar lanterns convert sunlight into electrical potential energy.",
      "Navrongo is located in the Upper East Region of Ghana."
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
      "Plastic bags are synthesized from petrochemical polymers.",
      "Paper bags degrade naturally when exposed to soil moisture.",
      "The paper bags are manufactured in West Africa.",
      "Commercial vested interest bias aiming to protect plastic sales revenue against paper bag competition."
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
      "Fertilizers contain nitrogen, phosphorus, and potassium.",
      "Cowpea is an indigenous leguminous crop.",
      "Pot X was painted terracotta red.",
      "The tiny sample size of 3 plants failed to control for extraneous variables like insect pests."
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
      "The attic window was made of aluminum louvres.",
      "The suspect's clothing had direct physical contact with unrefined palm oil materials matching the crime scene.",
      "The suspect was painting classroom walls orange.",
      "The suspect purchased fresh plantains at the market."
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
      "Rainwater in the Eastern Region has a high acid content.",
      "Maize plants consume all the nitrogen in the soil.",
      "Removing deep tree root networks eliminated the physical reinforcement that bound the hillside soil together."
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
      "Spools of copper wire can be recycled.",
      "The North Star is only visible during the dark night, never at 1:00 PM in broad daylight.",
      "Copper is a ductile transition metal.",
      "Ho is the regional capital of the Volta Region."
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
      "Children inhale air through their respiratory passages.",
      "The laboratory had air conditioners installed.",
      "Tobacco contains the stimulant alkaloid nicotine.",
      "Funding bias and corporate conflict of interest intended to protect cigarette manufacturers from health liability."
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
      "A clear plastic headlamp lens cover.",
      "An antique hand mirror carried by a passenger.",
      "A glass soda bottle thrown from the roadside."
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
      "Higher life expectancy causes older citizens to buy smartphones.",
      "General economic development and household income independently increase access to modern healthcare and technology.",
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
      "Absurd chemical claims (water transmuting to gold), panic generation, military invasion tropes, and chain-forwarding demands.",
      "The audio file was transmitted via digital cellular networks.",
      "Lake Bosomtwe is a natural impact crater lake in the Ashanti Region.",
      "The World Health Organization focuses on international public health."
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
      "Straw Man Fallacy",
      "Appeal to Pity",
      "Begging the Question (Petitio Principii / Circular Reasoning)",
      "Post Hoc Ergo Propter Hoc"
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
      "Carbonate (CO₃²⁻)",
      "Sulfate (SO₄²⁻)",
      "Chloride (Cl⁻)",
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
      "Online platforms use secure hypertext transfer protocol.",
      "The survey was calculated using standard deviations.",
      "Selection bias (sampling only the most dedicated brand enthusiasts rather than a randomized cross-section of all purchasers).",
      "Percentages should only be reported for sample sizes under 50."
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
      "Hasty Generalization",
      "False Analogy",
      "Equivocation"
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
      "Kumasi Zoo is located in the Ashanti Region.",
      "Anatomical hallucination (six toes), texture smoothing, and repeating procedural patterns characteristic of AI diffusion generators.",
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
      "Paved roads directly cause rainfall levels to decrease.",
      "Bottled water is used by civil engineers to dilute asphalt bitumen.",
      "Asphalt fumes compel pedestrians to drink bottled water."
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
      "Using direct current voltage instead of alternating current.",
      "Failing to compute the geometric median.",
      "Using a massive relative percentage multiplier to disguise an operational lifespan difference of just 5 trivial minutes.",
      "Reporting runtime in minutes instead of seconds."
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
      "Albumin proteins in blood plasma.",
      "Iron (Fe²⁺) present within the heme group of hemoglobin.",
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
      "Listening to bees buzzing is very scary.",
      "Worker bees work much harder than queen bees.",
      "Bees are insects that possess an exoskeleton and segmented bodies.",
      "Honey produced by bees is the sweetest substance in the universe."
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
      "The air inside the freezer sucked the water out.",
      "The plastic bottle dissolved in cold air.",
      "Water expands in volume when it crystallizes from liquid into solid ice.",
      "The freezer motor chewed on the bottle."
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
      "Compound sweeping was starting",
      "Morning lessons were being taught",
      "The school gates were being locked"
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
      "Flowering hibiscus shrubs look much prettier than bougainvillea shrubs.",
      "Gardening is the most relaxing chore in school.",
      "Plant roots absorb water and dissolved minerals from surrounding soil.",
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
      "It belongs to the headteacher.",
      "It was kept in a sealed cupboard all morning.",
      "It is made of heavy metal iron."
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
      "The water was frightened by the sound.",
      "Static electricity drained all the liquid.",
      "The rapid mechanical vibrations of the tuning fork prongs transferred kinetic energy to the water.",
      "The metal tuning fork melted the water instantly."
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
      "Pen D",
      "Pen A",
      "Pen C",
      "Pen B"
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
      "Long afternoon shadows look spooky.",
      "Shadows are cast on the side opposite to the light source.",
      "Bright sunlight feels much nicer than gentle morning breeze.",
      "Playing with your shadow is much more fun than playing soccer."
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
      "Projectors require electrical wattage to operate.",
      "July is a month in the rainy season.",
      "Tema Harbour is a commercial deepwater seaport."
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
      "Fizzy drinks are sealed in aluminum cans.",
      "Carbon dioxide gas dissolves in water under pressure.",
      "Commercial profit bias making fraudulent health claims to conceal the erosive effects of dietary sugars and carbonic acid.",
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
      "Between 8:15 AM and 8:25 AM",
      "After 9:30 AM during morning break",
      "Between 7:30 AM and 8:00 AM",
      "Between 8:30 AM and 9:00 AM"
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
      "Smartwatches tell time using quartz crystal oscillations.",
      "The student wore the watch on her left wrist.",
      "Testing a single unit (N=1) under specific usage conditions fails to account for battery variance, display settings, and network load.",
      "Smartwatches contain microprocessors and optical sensors."
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
      "Fish need land plants to survive.",
      "The frog population decided to migrate upstream.",
      "Synthetic chemical pesticides dissolved in the water, poisoning cellular respiration and nervous systems in aquatic organisms.",
      "Water temperature dropped below zero degrees Celsius."
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
      "Market stalls operate under metal roofing sheets.",
      "Cash drawers contain coins and banknotes.",
      "Bolgatanga is the capital of the Upper East Region."
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
      "Day students walk to school every morning.",
      "Boarding schools have student dormitories.",
      "Financial commercial bias, as boarding schools charge significantly higher accommodation and tuition fees.",
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
      "Cocoa beans are fermented in plantain leaves.",
      "Cocoa was introduced by Tetteh Quarshie.",
      "Black pod is caused by Phytophthora species."
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
      "Burning the paper with a candle flame.",
      "Freezing the document in liquid nitrogen.",
      "Soaking the paper in hot palm oil.",
      "Electrostatic Detection Apparatus (ESDA) or oblique angled lighting to reveal indented impressions."
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
      "Fire trucks emit heat that ignites nearby wooden buildings.",
      "Larger, more devastating fires naturally require greater firefighter deployments and simultaneously cause greater property destruction.",
      "Spending money on fire departments directly causes structural fires.",
      "Firefighters start fires to justify annual municipal budget increases."
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
      "Cellular networks operate via base transceiver stations.",
      "Drones are unmanned aerial vehicles.",
      "SIM cards contain integrated circuit chips.",
      "Extreme apocalyptic threats, lack of official gazette verification, forced viral forward quotas, and urgent fear-mongering."
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
      "Post Hoc Ergo Propter Hoc",
      "Appeal to Tradition (Argumentum ad Antiquitatem)",
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
      "Carbonate (CO₃²⁻)",
      "Chloride (Cl⁻)",
      "Nitrate (NO₃⁻)",
      "Sulfate (SO₄²⁻)"
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
      "Fitness clubs require commercial trade licenses.",
      "The arithmetic mean was severely skewed by a single massive outlier, misrepresenting the typical member outcome of 1 kilogram.",
      "Ten members is an even integer.",
      "Kilograms should be converted to imperial pounds."
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
      "Circular Reasoning",
      "Slippery Slope",
      "Ad Hominem",
      "Genetic Fallacy / False Analogy (conflating historical misconceptions with rigorous empirical modern scientific consensus)"
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
      "Satellite thermal imaging",
      "Deepfake AI synthetic audiovisual generation",
      "Analog closed-circuit television recording",
      "High-definition optical zoom photography"
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
      "Reading books stimulates foot bone growth.",
      "Small shoes impair optical vision.",
      "Large shoes expand brain capacity.",
      "Student age and grade level: older students have physically larger feet and have received more years of reading instruction."
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
      "Converting degrees of a circle into radians.",
      "3D perspective distortion (exploding/angling slices) to visually exaggerate a smaller percentage share.",
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
      "An inert noble gas element.",
      "An alkane hydrocarbon forming carbon dioxide.",
      "A stable quaternary ammonium salt."
    ],
    "correctAnswer": "A primary or secondary alcohol group oxidized to an aldehyde, ketone, or carboxylic acid while reducing chromium(VI) to chromium(III).",
    "explanation": "Potassium dichromate oxidizes alcohols; in doing so, orange hexavalent Cr₆⁺ is reduced to green trivalent Cr³⁺ ions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-601",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Accra observe a tilapia fish swimming in a glass aquarium tank.",
    "question": "Which of these statements is an objective biological FACT?",
    "options": [
      "Tilapia are the prettiest freshwater fish in Ghana.",
      "Tilapia use gills to extract dissolved oxygen from water.",
      "Watching fish swim is much more boring than playing football.",
      "Small fish are happier than large fish."
    ],
    "correctAnswer": "Tilapia use gills to extract dissolved oxygen from water.",
    "explanation": "Fish respiration via gill filaments is an observable physiological fact; beauty and boredom are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-602",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective examines muddy footprints leading into the school canteen. The prints show a flat rubber sole with diamond-shaped grip patterns.",
    "question": "Which suspect left these prints?",
    "options": [
      "Esi, who is wearing sandals with parallel horizontal bar lines",
      "Ama, who is walking barefoot",
      "Kwame, who is wearing leather dress shoes with smooth flat soles",
      "Kweku, who is wearing shoes with diamond-patterned rubber soles"
    ],
    "correctAnswer": "Kweku, who is wearing shoes with diamond-patterned rubber soles",
    "explanation": "The diamond tread geometry directly matches the imprint left in the mud, excluding barefoot prints and linear tread soles.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-603",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil leaves a fresh slice of sweet mango on the veranda table for two hours on a warm afternoon. When she returns, hundreds of tiny black ants cover the slice.",
    "question": "What caused the ants to gather on the mango?",
    "options": [
      "Ants only walk on wooden veranda tables.",
      "The sweet sugary scent of the mango attracted foraging worker ants.",
      "The mango turned into ants.",
      "The mango fell from the tree onto the ant nest."
    ],
    "correctAnswer": "The sweet sugary scent of the mango attracted foraging worker ants.",
    "explanation": "Worker ants detect volatile organic sugar molecules using antennal chemoreceptors and lay pheromone trails for the colony.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-604",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Morning assembly ran from 7:30 AM to 8:00 AM. English class ran from 8:00 AM to 9:30 AM. Snack break ran from 9:30 AM to 10:00 AM. Abena bought a meat pie at 9:45 AM.",
    "question": "During which scheduled period did Abena buy the meat pie?",
    "options": [
      "During morning assembly",
      "During English class",
      "After school closing",
      "During snack break"
    ],
    "correctAnswer": "During snack break",
    "explanation": "9:45 AM falls directly within the designated snack break interval (9:30 AM to 10:00 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-605",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends talk about the weather during a heavy rainy season storm.",
    "question": "Which statement is an observational FACT?",
    "options": [
      "Cold rain feels unpleasant on the skin.",
      "Rainwater falls from clouds when condensed droplets become heavy enough.",
      "Thunderstorms are the scariest weather events in nature.",
      "Rainy days are much worse than sunny harmattan days."
    ],
    "correctAnswer": "Rainwater falls from clouds when condensed droplets become heavy enough.",
    "explanation": "Precipitation physics is an objective meteorological fact; fear and comfort assessments are personal feelings.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-606",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A desk drawer was opened without permission. A dusting of black charcoal dust is left on the brass handle.",
    "question": "Which suspect left this residue?",
    "options": [
      "Ama, who was reading an English storybook in the library",
      "Esi, who was cutting clean white paper shapes",
      "Kofi, who was washing clean water cups at the tap",
      "Yaw, who was carrying a bag of cooking charcoal to the school kitchen"
    ],
    "correctAnswer": "Yaw, who was carrying a bag of cooking charcoal to the school kitchen",
    "explanation": "Handling fuel charcoal transfers fine carbon residue to hands, matching the black powder found on the drawer pull.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-607",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil leaves an open glass bottle of water outdoors on a clear hot afternoon. By sunset, the water line inside the bottle has dropped by three centimeters.",
    "question": "What process reduced the water volume inside the bottle?",
    "options": [
      "The glass bottle absorbed the water into its walls.",
      "Solar heat caused liquid water molecules to evaporate into the air.",
      "Cold night air drank the water.",
      "The wind tipped the bottle over and set it back upright."
    ],
    "correctAnswer": "Solar heat caused liquid water molecules to evaporate into the air.",
    "explanation": "Thermal energy increases kinetic movement of water molecules, driving phase change into vapor through evaporation.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-608",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Kojo woke up at 6:00 AM, brushed his teeth at 6:15 AM, ate breakfast at 6:30 AM, and walked out the door at 7:00 AM. He dropped his toothpaste cap on the bathroom floor.",
    "question": "At what time was the toothpaste cap dropped?",
    "options": [
      "At 7:00 AM while leaving the house",
      "At 6:00 AM while waking up",
      "At 6:30 AM during breakfast",
      "At 6:15 AM during teeth brushing"
    ],
    "correctAnswer": "At 6:15 AM during teeth brushing",
    "explanation": "Toothpaste tubes are opened and used during dental hygiene at 6:15 AM, bounding the incident to that step.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-609",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A ripe pawpaw on a kitchen tray has three small triangular bird-peck indentations on its side.",
    "question": "What creature caused these marks?",
    "options": [
      "A human using a round spoon",
      "A wild bird with a sharp pointed beak",
      "A snail with a soft muscular foot",
      "A dog with flat molar teeth"
    ],
    "correctAnswer": "A wild bird with a sharp pointed beak",
    "explanation": "Pointed triangular gouges match the anatomical morphology of an avian keratinous bill.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-610",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi examine a green caterpillar crawling on a cocoyam leaf.",
    "question": "Which of these statements represents a verifiable biological FACT?",
    "options": [
      "Caterpillars are the larval stage of butterflies and moths.",
      "Caterpillars look much friendlier than earthworms.",
      "Touching hairy caterpillars is a silly thing to do.",
      "Butterflies are more important than caterpillars."
    ],
    "correctAnswer": "Caterpillars are the larval stage of butterflies and moths.",
    "explanation": "Lepidopteran life cycles are verified biological taxonomy; friendliness and importance are subjective evaluations.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-601",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A laptop charger was taken from an office in Sunyani on June 5 at 1:00 PM. Suspect Boateng claims he was outside looking at the stars in the night sky at that exact moment.",
    "question": "What astronomical fact disproves Boateng's alibi?",
    "options": [
      "Laptops require alternating current adapters to charge.",
      "Sunyani is the capital of the Bono Region.",
      "June is a month in the rainy season.",
      "At 1:00 PM in Sunyani, the sun is high in the sky and starlight is invisible to the human eye."
    ],
    "correctAnswer": "At 1:00 PM in Sunyani, the sun is high in the sky and starlight is invisible to the human eye.",
    "explanation": "Rayleigh scattering of solar irradiance floods the daytime sky, rendering celestial stars invisible at 1:00 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-602",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial dairy farm publishes a newsletter stating: 'Children must drink five glasses of cow milk daily to survive, and plant-based foods provide zero calcium.'",
    "question": "What bias should an apprentice investigator identify?",
    "options": [
      "Calcium is a chemical element.",
      "Commercial sales bias promoting dairy products while making demonstrably false claims about plant calcium sources.",
      "Cow milk contains lactose sugar.",
      "Green leafy vegetables grow in agricultural soil."
    ],
    "correctAnswer": "Commercial sales bias promoting dairy products while making demonstrably false claims about plant calcium sources.",
    "explanation": "The dairy producer has a financial incentive to drive sales; vegetables like kontomire (cocoyam leaves) and moringa provide rich plant calcium.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-603",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A loaf of dough was mixed at 6:00 AM, proofed until 7:30 AM, baked in an oven until 8:15 AM, and cooled on a rack until 9:00 AM. A power outage stopped the electric oven midway through baking.",
    "question": "Between what times did the power outage occur?",
    "options": [
      "Between 8:15 AM and 9:00 AM",
      "After 9:30 AM during morning sales",
      "Between 6:00 AM and 7:30 AM",
      "Between 7:30 AM and 8:15 AM"
    ],
    "correctAnswer": "Between 7:30 AM and 8:15 AM",
    "explanation": "The oven was actively operating solely during the baking window from 7:30 AM to 8:15 AM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-604",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A pupil asks two friends in his class what their favorite subject is. Both say Integrated Science. He announces: 'All 600 students in our school prefer Integrated Science over any other subject.'",
    "question": "What methodological error was committed?",
    "options": [
      "Integrated Science covers biology and chemistry.",
      "Hasty generalization based on an unrepresentative sample size of only two individuals.",
      "School classes contain both boys and girls.",
      "Surveys should only be conducted on Mondays."
    ],
    "correctAnswer": "Hasty generalization based on an unrepresentative sample size of only two individuals.",
    "explanation": "A sample size of N=2 (0.33% of the school) is statistically insignificant to infer population-wide preferences.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-605",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A wooden window frame was pried open during a burglary. Investigators recover blue paint chips with a thickness of 0.4 mm from the damaged sill that match paint chipped from the tip of a crowbar.",
    "question": "What conclusion does this physical evidence support?",
    "options": [
      "The window frame was built from cedar timber.",
      "The window was painted with water-based acrylic paint.",
      "The burglar wore leather gloves.",
      "The crowbar was in direct mechanical contact with the window sill during the forced entry."
    ],
    "correctAnswer": "The crowbar was in direct mechanical contact with the window sill during the forced entry.",
    "explanation": "Trace paint transfer matching color, layer structure, and thickness establishes physical tool-mark contact.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-606",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "After a community clear-cut all bamboo stands along the steep riverbank of the Pra River, heavy seasonal rains triggered severe bank collapses and siltation.",
    "question": "What caused the increased bank collapse?",
    "options": [
      "The river water turned alkaline.",
      "Removing the dense, interlocking bamboo root system destabilized the soil against hydraulic erosion.",
      "Fish in the river undermined the mud.",
      "Bamboo plants generate river water."
    ],
    "correctAnswer": "Removing the dense, interlocking bamboo root system destabilized the soil against hydraulic erosion.",
    "explanation": "Riparian root networks bind alluvial sediment; clearing vegetation leaves soil vulnerable to sheer stress from runoff.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-607",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A box of school chalk went missing from a staffroom in Koforidua on November 10 at 8:00 PM. Suspect Osei claims he was reading a book outside under natural sunlight with no artificial lights.",
    "question": "Why is Osei's alibi impossible?",
    "options": [
      "Staffrooms are secured with padlocks.",
      "Chalk is composed of calcium carbonate.",
      "Koforidua is surrounded by the Akuapem mountain range.",
      "In Ghana, natural sunlight ends by 6:30 PM, making reading under natural sunlight at 8:00 PM impossible."
    ],
    "correctAnswer": "In Ghana, natural sunlight ends by 6:30 PM, making reading under natural sunlight at 8:00 PM impossible.",
    "explanation": "Equatorial latitudes experience darkness by 6:30 PM year-round, disproving outdoor sunlight reading at 8:00 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-608",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A flashlight manufacturer issues a test report stating: 'Battery-powered torches are 100 times safer and brighter than all solar-powered lamps on the market.'",
    "question": "What bias should be flagged?",
    "options": [
      "Batteries undergo chemical redox reactions.",
      "Manufacturer conflict of interest designed to discourage competition from renewable solar lighting.",
      "Flashlights use light-emitting diodes.",
      "Solar panels absorb photons from sunlight."
    ],
    "correctAnswer": "Manufacturer conflict of interest designed to discourage competition from renewable solar lighting.",
    "explanation": "The manufacturer's financial interest in selling battery-powered lamps skews their comparative reporting.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-609",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A farmer inspects one ear of maize from a 10-acre farm, finds corn borers inside, and concludes: 'Every single ear of maize on all 10 acres is infested.'",
    "question": "What is the logical flaw in the farmer's conclusion?",
    "options": [
      "Maize is a staple cereal grain.",
      "Ten acres equals roughly 40,000 square meters.",
      "Corn borers are insect larvae.",
      "Hasty generalization from a single specimen (N=1) to thousands of plants across an entire plantation."
    ],
    "correctAnswer": "Hasty generalization from a single specimen (N=1) to thousands of plants across an entire plantation.",
    "explanation": "A single ear sample fails to reflect spatial pest variance or provide a representative pest density estimate.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-610",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A document written on paper exhibits microscopic ink feathering and fiber bleeding under a magnifying glass, along with wrinkled paper edges.",
    "question": "What environmental condition affected this document?",
    "options": [
      "The document was stored in a vacuum chamber.",
      "The writer used a mechanical pencil.",
      "High humidity or direct moisture exposure caused the paper fibers to expand and draw ink outward via capillary action.",
      "The paper was manufactured from pure synthetic plastic."
    ],
    "correctAnswer": "High humidity or direct moisture exposure caused the paper fibers to expand and draw ink outward via capillary action.",
    "explanation": "Moisture exposure causes paper cockling and promotes capillary diffusion of water-soluble inks along cellulose fibers.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-601",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A public health study across towns in Ghana finds that regions with more private pharmacies also report higher hospital admission rates for chronic diseases.",
    "question": "What is the true underlying explanation for this correlation?",
    "options": [
      "Higher population density and urban development attract both healthcare facilities and pharmacies while registering more medical cases.",
      "Hospital admissions compel pharmacies to relocate out of towns.",
      "People only buy medicine after being admitted to a hospital.",
      "Pharmacies sell medicines that directly cause chronic diseases in healthy residents."
    ],
    "correctAnswer": "Higher population density and urban development attract both healthcare facilities and pharmacies while registering more medical cases.",
    "explanation": "Population density and diagnostic infrastructure act as common confounding variables driving both pharmacy counts and hospital visits.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-602",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral post claims: 'Ministry of Health discovers that boiling used plastic bottles creates an elixir that immunizes against all bacterial infections! Forward to 20 WhatsApp groups!'",
    "question": "Which combination of elements proves this message is fraudulent disinformation?",
    "options": [
      "Plastic bottles are made of polyethylene terephthalate.",
      "Bacterial infections are treated with antibiotic compounds.",
      "Promotion of toxic practices (leaching plastic polymers), universal cure claims, lack of official gazette validation, and viral forward quotas.",
      "The Ministry of Health oversees national public hospitals."
    ],
    "correctAnswer": "Promotion of toxic practices (leaching plastic polymers), universal cure claims, lack of official gazette validation, and viral forward quotas.",
    "explanation": "Dangerous health claims involving chemical leaching, coupled with chain-sharing quotas and miracle cure tropes, identify malicious hoaxes.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-603",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "In a municipal assembly debate, a member argues: 'We cannot support Councilor Mensah's drainage construction proposal because his cousin was once arrested for petty theft!'",
    "question": "Which logical fallacy did the speaker commit?",
    "options": [
      "Guilt by Association / Ad Hominem",
      "Begging the Question",
      "Slippery Slope",
      "False Dilemma"
    ],
    "correctAnswer": "Guilt by Association / Ad Hominem",
    "explanation": "Attacking an argument based on the unrelated alleged misconduct of an associate or family member is guilt by association.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-604",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A suspect denies handling sulfur powder. Forensic analysts swab his fingers and add dilute nitric acid followed by barium nitrate solution (Ba(NO₃)₂), producing an insoluble dense white precipitate.",
    "question": "What chemical ion was confirmed by this test?",
    "options": [
      "Carbonate (CO₃²⁻)",
      "Sodium (Na⁺)",
      "Sulfate (SO₄²⁻)",
      "Chloride (Cl⁻)"
    ],
    "correctAnswer": "Sulfate (SO₄²⁻)",
    "explanation": "Barium ions react with sulfate ions to form insoluble barium sulfate (BaSO₄), which resists dissolution in dilute nitric acid.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-605",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A school advertises: 'Our average graduating student score increased by 300%!' An audit reveals their score rose from 1 point to 4 points out of a total possible score of 100.",
    "question": "What misleading statistical tactic was employed?",
    "options": [
      "Using a high relative percentage increase to mask an objectively poor absolute performance gain.",
      "Calculating the median instead of the arithmetic mean.",
      "Plotting data on a normal distribution curve.",
      "Using standard error instead of variance."
    ],
    "correctAnswer": "Using a high relative percentage increase to mask an objectively poor absolute performance gain.",
    "explanation": "Highlighting a 300% relative jump disguises the reality that 4/100 remains a failing absolute grade.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-606",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A debater asserts: 'Either we completely shut down all internet infrastructure nationwide, or every student will fail their BECE exams!'",
    "question": "Which logical fallacy is illustrated by this statement?",
    "options": [
      "Equivocation",
      "Appeal to Nature",
      "False Dilemma (Bifurcation)",
      "Straw Man"
    ],
    "correctAnswer": "False Dilemma (Bifurcation)",
    "explanation": "Artificially constraining a complex issue to two extreme either/or choices while ignoring moderate solutions is a false dilemma.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-607",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "An image online shows a volcanic eruption supposedly occurring in downtown Kumasi. Geologists note that Kumasi sits on a stable Precambrian metamorphic craton with zero active volcanic fault lines.",
    "question": "What geological fact refutes this viral image?",
    "options": [
      "The regional geology of Kumasi is a stable non-volcanic continental shield lacking active subduction or magma plumes.",
      "Kumasi has asphalt roads.",
      "Harmattan winds prevent volcanic activity.",
      "Volcanoes only erupt in ocean basins."
    ],
    "correctAnswer": "The regional geology of Kumasi is a stable non-volcanic continental shield lacking active subduction or magma plumes.",
    "explanation": "The West African Craton is tectonically stable with no active volcanic mechanisms, confirming the image is fabricated.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-608",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A regional transport survey shows that as street lighting installations increased along a highway, pedestrian night traffic also increased.",
    "question": "What is the true causal relationship?",
    "options": [
      "Pedestrians emit electromagnetic energy that powers street lighting.",
      "Street lighting causes pedestrian population growth.",
      "Illumination improved perceived and actual safety, encouraging more pedestrians to walk along the corridor at night.",
      "Night traffic causes lightbulbs to illuminate automatically."
    ],
    "correctAnswer": "Illumination improved perceived and actual safety, encouraging more pedestrians to walk along the corridor at night.",
    "explanation": "Enhanced visibility and security directly incentivize night pedestrian travel along illuminated corridors.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-609",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A company presents a line chart of sales with a vertical axis spanning only 99 to 101 Cedis, making a 0.5 Cedi fluctuation look like a catastrophic economic collapse.",
    "question": "What misleading graphic design technique is being used?",
    "options": [
      "A truncated axis (suppressed zero baseline) that exaggerates negligible numerical variations visually.",
      "Calculating moving averages.",
      "Plotting discrete variables as continuous data.",
      "Using metric currency units."
    ],
    "correctAnswer": "A truncated axis (suppressed zero baseline) that exaggerates negligible numerical variations visually.",
    "explanation": "Truncating the vertical axis to an ultra-narrow band inflates minor baseline variations into visually dramatic swings.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-610",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A forensic investigator recovers an unknown clear liquid from an illegal fuel depot. When tested with anhydrous copper(II) sulfate (CuSO₄), the white powder turns brilliant blue.",
    "question": "What chemical compound is positively identified by this hydration reaction?",
    "options": [
      "Pure ethanol",
      "Acetone solvent",
      "Diesel fuel hydrocarbons",
      "Water (H₂O)"
    ],
    "correctAnswer": "Water (H₂O)",
    "explanation": "Anhydrous copper(II) sulfate undergoes hydration upon contact with water, forming blue copper(II) sulfate pentahydrate (CuSO₄ · 5H₂O).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-701",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi examine a green chameleon resting on a garden hibiscus stem.",
    "question": "Which of these statements is an objective biological FACT?",
    "options": [
      "Chameleons possess eyes that can swivel independently in two directions.",
      "Green chameleons are prettier than brown chameleons.",
      "Chameleons look much scarier than wall geckos.",
      "Watching chameleons hunt is the most exciting activity in school."
    ],
    "correctAnswer": "Chameleons possess eyes that can swivel independently in two directions.",
    "explanation": "Independent eye motion and binocular depth perception are verifiable biological facts; fear and beauty are subjective feelings.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-702",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective inspects footprints left in soft red soil near the school library door. The tracks show alternating zigzag wave treads with a deep heel block.",
    "question": "Which footwear left this track pattern?",
    "options": [
      "A flat-soled leather school shoe with zero pattern",
      "A goat with two-toed split hooves",
      "A heavy hiking boot with molded zigzag rubber soles",
      "A pupil walking in bare feet with round heel pads"
    ],
    "correctAnswer": "A heavy hiking boot with molded zigzag rubber soles",
    "explanation": "Zigzag tread grooves and a raised heel block match molded lug soles, excluding flat leather footwear and bare feet.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-703",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil leaves a sealed metal tin of sweet biscuits outside on a rainy compound veranda for four weeks. When opened, red-brown powder covers the tin seams.",
    "question": "What chemical reaction created the red-brown powder?",
    "options": [
      "Iron in the metal tin reacted with rainwater and oxygen to form rust.",
      "Red termites chewed through the biscuit box.",
      "Sunlight bleached the paint into red powder.",
      "Sweet sugar leaked out and dried into powder."
    ],
    "correctAnswer": "Iron in the metal tin reacted with rainwater and oxygen to form rust.",
    "explanation": "Moisture and atmospheric oxygen oxidize elemental iron into hydrated iron(III) oxide (rust).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-704",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Morning assembly ran from 7:30 AM to 8:00 AM. Class cleaning took place from 8:00 AM to 8:30 AM. Reading time began at 8:30 AM and ended at 9:30 AM. Esi tore her notebook page at 8:15 AM.",
    "question": "What activity was underway when Esi tore her page?",
    "options": [
      "Afternoon closing prayers",
      "Morning assembly under the mango tree",
      "Class cleaning was actively taking place",
      "Quiet reading time"
    ],
    "correctAnswer": "Class cleaning was actively taking place",
    "explanation": "8:15 AM falls directly within the scheduled cleaning window (8:00 AM to 8:30 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-705",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends talk about a domestic goat grazing on grass behind the school cafeteria.",
    "question": "Which of these statements represents a verifiable agricultural FACT?",
    "options": [
      "Goats are ruminant herbivores with four-chambered stomachs.",
      "Baby goats are far cuter than baby piglets.",
      "Goat milk tastes much better than cow milk.",
      "Goats are the most stubborn animals in Ghana."
    ],
    "correctAnswer": "Goats are ruminant herbivores with four-chambered stomachs.",
    "explanation": "Ruminant digestive anatomy is an objective biological classification, unlike personality descriptors and taste preferences.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-706",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A desk drawer was opened without permission. Traces of yellow chalk dust coat the brass pull handle.",
    "question": "Which suspect left this trace clue?",
    "options": [
      "Yaw, who was sweeping leaves with a palm broom",
      "Ama, who was washing her hands with liquid soap",
      "Kwame, who was writing maths problems on the board with yellow chalk",
      "Esi, who was reading an English storybook with clean hands"
    ],
    "correctAnswer": "Kwame, who was writing maths problems on the board with yellow chalk",
    "explanation": "Handling yellow chalk transfers colored calcium carbonate powder to fingers, matching the residue on the handle.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-707",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil puts a clear glass bottle of cold water out under hot midday sun in Tamale. After one hour, tiny water droplets cover the outside glass surface.",
    "question": "Where did the external water droplets come from?",
    "options": [
      "Water vapor in the warm surrounding air cooled and condensed against the cold glass.",
      "Rain fell invisibly onto the bottle.",
      "Water leaked directly through the solid glass wall.",
      "The sun produced water droplets inside the glass."
    ],
    "correctAnswer": "Water vapor in the warm surrounding air cooled and condensed against the cold glass.",
    "explanation": "Warm ambient water vapor reaches dew point upon contacting the chilled bottle surface, condensing into liquid droplets.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-708",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "School started at 8:00 AM. Science class ran from 8:00 AM to 9:00 AM. Maths ran from 9:00 AM to 10:00 AM. Break ran from 10:00 AM to 10:30 AM. Kofi bought roasted groundnuts at 10:10 AM.",
    "question": "During which scheduled period did Kofi buy the groundnuts?",
    "options": [
      "During maths class",
      "Before school started",
      "During school break time",
      "During science class"
    ],
    "correctAnswer": "During school break time",
    "explanation": "10:10 AM falls directly within the scheduled break interval (10:00 AM to 10:30 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-709",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A slice of bread on the staffroom table has two narrow, flat chisel bite marks with no canine punctures.",
    "question": "What creature produced these tooth marks?",
    "options": [
      "A small rodent such as a house mouse with paired front incisors",
      "A hunting dog with sharp pointed canine teeth",
      "A domestic chicken using its beak",
      "A lizard with tiny uniform peg teeth"
    ],
    "correctAnswer": "A small rodent such as a house mouse with paired front incisors",
    "explanation": "Paired chisel-shaped upper and lower incisors without canine marks are diagnostic traces of rodent gnawing.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-710",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Sunyani discuss the cocoa tree growing in the agricultural garden.",
    "question": "Which of these statements is an indisputable agricultural FACT?",
    "options": [
      "Yellow cocoa pods look nicer than red cocoa pods.",
      "Cocoa farming is much harder work than maize farming.",
      "Chocolate made from cocoa is the most delicious food on Earth.",
      "Cocoa flowers grow directly on the tree trunk and mature branches (cauliflory)."
    ],
    "correctAnswer": "Cocoa flowers grow directly on the tree trunk and mature branches (cauliflory).",
    "explanation": "Cauliflory (flowering and fruiting directly on older woody trunks) is a documented botanical trait of Theobroma cacao.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-701",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A digital tablet disappeared from an ICT lab in Koforidua on August 20 at 2:00 PM. Suspect Kweku claims he was outside watching a total solar eclipse that turned the afternoon pitch dark.",
    "question": "What astronomical fact disproves Kweku's alibi?",
    "options": [
      "August is a month in the secondary rainy season.",
      "ICT tablets contain rechargeable lithium-ion battery cells.",
      "Astronomical records confirm zero solar eclipses occurred anywhere in West Africa on that date.",
      "Koforidua is the regional capital of the Eastern Region."
    ],
    "correctAnswer": "Astronomical records confirm zero solar eclipses occurred anywhere in West Africa on that date.",
    "explanation": "Solar eclipses are exact, astronomically mapped events; none occurred in Ghana on that date, refuting the claim.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-702",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial soft drink conglomerate releases a study concluding: 'Artificial sugar syrups strengthen tooth enamel and children should drink three sodas every afternoon.'",
    "question": "What primary bias must an investigator flag in this report?",
    "options": [
      "Commercial vested interest bias aiming to maximize beverage profits while ignoring dental science.",
      "Carbonic acid dissolves in water under pressure.",
      "Children have deciduous milk teeth.",
      "Soda drinks are packaged in aluminum cans."
    ],
    "correctAnswer": "Commercial vested interest bias aiming to maximize beverage profits while ignoring dental science.",
    "explanation": "The company has a financial conflict of interest that invalidates its claim that acidic, sugary syrup protects enamel.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-703",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A chemistry test tube solution was mixed at 9:00 AM, rested until 9:45 AM, heated over a burner from 9:45 AM to 10:15 AM, and cooled until 11:00 AM. A crack formed in the tube due to heat stress.",
    "question": "During which timeframe did the tube crack from heat?",
    "options": [
      "Between 9:00 AM and 9:45 AM",
      "Between 10:15 AM and 11:00 AM",
      "Between 9:45 AM and 10:15 AM",
      "After 11:30 AM during closing"
    ],
    "correctAnswer": "Between 9:45 AM and 10:15 AM",
    "explanation": "The burner was applied exclusively between 9:45 AM and 10:15 AM, restricting heat stress failure to that interval.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-704",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A pupil tests two batteries from a box of 200 units. Both power a flashlight for 10 hours. She concludes: 'All 200 batteries in the box are guaranteed to last exactly 10 hours.'",
    "question": "Why is her deduction statistically unsound?",
    "options": [
      "A sample size of two units (1%) is too small to account for manufacturing defects across 200 items.",
      "The test was performed on a Tuesday afternoon.",
      "Batteries produce direct electric current via redox chemistry.",
      "Flashlights contain light-emitting diodes."
    ],
    "correctAnswer": "A sample size of two units (1%) is too small to account for manufacturing defects across 200 items.",
    "explanation": "Sampling two items from a batch of 200 cannot reliably detect defect rates or establish consistent battery lifespan.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-705",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "Investigators examine a broken wooden louvre window at a school science store. Fine red clay mud containing crushed quartz fragments matches mud from a suspect's boot soles.",
    "question": "What does this geological soil evidence indicate?",
    "options": [
      "The science store window was constructed from mahogany timber.",
      "The suspect was washing hands at the tap.",
      "The suspect walked through the specific localized red clay trench surrounding the science store window.",
      "The suspect purchased new rubber boots in Accra."
    ],
    "correctAnswer": "The suspect walked through the specific localized red clay trench surrounding the science store window.",
    "explanation": "Mineralogical match of quartz fragments in red clay links the boot soil directly to the localized trench at the scene.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-706",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "After a community cleared all mangroves along an estuary near Keta, shoreline erosion surged and tidal waves destroyed several earthen footpaths.",
    "question": "Why did clearing the mangroves accelerate coastal erosion?",
    "options": [
      "Mangrove root networks anchor coastal sediments and dissipate wave energy before it hits land.",
      "Mangroves attract clouds that stop oceanic storm waves.",
      "The estuary water turned completely fresh.",
      "Fish in the lagoon dug up the shoreline soil."
    ],
    "correctAnswer": "Mangrove root networks anchor coastal sediments and dissipate wave energy before it hits land.",
    "explanation": "Mangrove stilt roots trap sediment and reduce wave velocity, protecting fragile shorelines from marine erosion.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-707",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A generator battery was stolen from a clinic in Ho on May 12 at 11:30 PM. Suspect Senyo claims he was reading a paperback novel outdoors under direct natural sunlight with no lamps.",
    "question": "What geographical fact destroys Senyo's alibi?",
    "options": [
      "Paperback books are bound with thermal glue.",
      "Clinics use diesel generators for emergency backup power.",
      "At 11:30 PM in Ghana, it is nighttime and natural solar illumination is absent.",
      "Ho is the capital of the Volta Region."
    ],
    "correctAnswer": "At 11:30 PM in Ghana, it is nighttime and natural solar illumination is absent.",
    "explanation": "Sunlight is impossible at 11:30 PM near the equator, proving the alibi was fabricated.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-708",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A plastic container manufacturer publishes a magazine article claiming: 'Traditional ceramic clay water pots harbor deadly bacteria, and plastic containers are the only healthy choice.'",
    "question": "What bias should an apprentice researcher flag?",
    "options": [
      "Commercial motive bias designed to discredit traditional potters and increase plastic tank sales.",
      "Plastic polymers are derived from refined crude oil.",
      "Pottery has been practiced in Ghana for centuries.",
      "Clay pots cool drinking water via evaporative pores."
    ],
    "correctAnswer": "Commercial motive bias designed to discredit traditional potters and increase plastic tank sales.",
    "explanation": "The plastic vendor has a direct commercial conflict of interest, making their health warning against clay pots biased.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-709",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A farmer inspects one tomato plant out of an acre of 2,000 plants, sees leaf curl virus, and declares: 'All 2,000 tomato plants on my farm are 100% infected and must be burned.'",
    "question": "What reasoning error did the farmer commit?",
    "options": [
      "Leaf curl is transmitted by whiteflies.",
      "Tomatoes belong to the Solanaceae nightshade family.",
      "Hasty generalization from a single plant (N=1) to an entire agricultural population.",
      "One acre contains roughly 4,047 square meters."
    ],
    "correctAnswer": "Hasty generalization from a single plant (N=1) to an entire agricultural population.",
    "explanation": "A single observation cannot establish population infection rates or justify destroying an entire crop.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-710",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A forensic document examiner inspects a suspicious check. Under ultraviolet lighting, altered ink strokes glow fluorescent yellow, while original entries remain dull black.",
    "question": "What does this optical fluorescence prove?",
    "options": [
      "The check was written on a rainy morning.",
      "The altered figures were written using a completely different ink formulation than the original text.",
      "The check paper was manufactured from bamboo pulp.",
      "The account holder was left-handed."
    ],
    "correctAnswer": "The altered figures were written using a completely different ink formulation than the original text.",
    "explanation": "Differential UV fluorescence confirms the presence of two distinct chemical ink formulations, proving alteration.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-701",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A survey across urban municipalities in Ghana finds that neighborhoods with higher concentrations of dental clinics report higher annual rates of heart disease.",
    "question": "What is the primary confounding variable explaining this relationship?",
    "options": [
      "Dental cleaning procedures directly cause arterial cardiovascular damage.",
      "Heart disease compels patients to visit dentists.",
      "Dentists intentionally target cardiovascular patients.",
      "Median resident age and urban density: older populations require more dental care and have higher baseline rates of cardiovascular disease."
    ],
    "correctAnswer": "Median resident age and urban density: older populations require more dental care and have higher baseline rates of cardiovascular disease.",
    "explanation": "Age is the common confounding factor driving both dental visits and cardiovascular disease prevalence.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-702",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral WhatsApp post claims: 'University researchers prove that inhaling crushed dry batteries completely destroys all viruses in human lungs! Share with 25 groups before authorities ban it!'",
    "question": "Which combination of factors confirms this post is dangerous disinformation?",
    "options": [
      "University departments operate research laboratories.",
      "Recommending toxic heavy metal inhalation, universal cure claims, suppression conspiracy framing, and viral share quotas.",
      "Batteries contain zinc, carbon, and manganese dioxide.",
      "Viral respiratory infections affect human pulmonary passages."
    ],
    "correctAnswer": "Recommending toxic heavy metal inhalation, universal cure claims, suppression conspiracy framing, and viral share quotas.",
    "explanation": "Promoting toxic chemical inhalation combined with conspiracy suppression claims and chain forwarding are markers of fake health news.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-703",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "In a municipal council debate, a member argues: 'We cannot support Engineer Mensah's drainage proposal because his brother was once convicted of tax evasion!'",
    "question": "Which logical fallacy did the speaker commit?",
    "options": [
      "Straw Man Fallacy",
      "Begging the Question",
      "Post Hoc Ergo Propter Hoc",
      "Guilt by Association (Ad Hominem)"
    ],
    "correctAnswer": "Guilt by Association (Ad Hominem)",
    "explanation": "Attacking an engineer's technical proposal based on the unrelated alleged crimes of a relative is guilt by association.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-704",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "An unlabelled white powder from a chemical warehouse is tested with dilute hydrochloric acid (HCl). It fizzes, releasing a colorless gas that turns clear limewater milky.",
    "question": "What chemical anion was positively identified by this reaction?",
    "options": [
      "Chloride (Cl⁻)",
      "Carbonate (CO₃²⁻)",
      "Sulfate (SO₄²⁻)",
      "Nitrate (NO₃⁻)"
    ],
    "correctAnswer": "Carbonate (CO₃²⁻)",
    "explanation": "Carbonate ions react with acid to liberate carbon dioxide gas (CO₂), which reacts with calcium hydroxide (limewater) to precipitate white CaCO₃.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-705",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "An academy advertises: 'Our graduating teacher average salary is 15,000 Cedis per month!' An audit reveals the director earns 110,000 Cedis while nine staff teachers earn 4,444 Cedis each.",
    "question": "What statistical distortion makes this claim deceptive?",
    "options": [
      "Private schools are legally barred from computing averages.",
      "Salaries should be converted to foreign currencies.",
      "Nine teachers is an odd number for percentage calculations.",
      "The arithmetic mean is distorted by an extreme high outlier, concealing the typical median salary of 4,444 Cedis."
    ],
    "correctAnswer": "The arithmetic mean is distorted by an extreme high outlier, concealing the typical median salary of 4,444 Cedis.",
    "explanation": "The mean ((110,000 + 9 × 4,444)/10 = 15,000) is skewed upward by the director's pay; the median accurately reflects staff earnings.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-706",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A student prefect argues: 'If we allow students to wear casual sandals on Friday, next term they will refuse uniforms entirely, destroying discipline and forcing the school to close permanently!'",
    "question": "Which logical fallacy does this argument illustrate?",
    "options": [
      "Circular Reasoning",
      "Slippery Slope Fallacy",
      "Appeal to Ignorance",
      "False Analogy"
    ],
    "correctAnswer": "Slippery Slope Fallacy",
    "explanation": "A Slippery Slope asserts without evidence that a minor initial step will trigger a catastrophic chain reaction.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-707",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral photo claims to show heavy snow covering Kejetia Market in Kumasi. A reverse image search reveals the photo was taken in Oslo, Norway in 2018.",
    "question": "What digital verification technique exposed this hoax?",
    "options": [
      "Audio waveform frequency analysis",
      "Smartphone screen brightness measurement",
      "Checking local mobile data network speeds",
      "Reverse image search verifying original image metadata and publication history"
    ],
    "correctAnswer": "Reverse image search verifying original image metadata and publication history",
    "explanation": "Reverse image search traces visual media back to earlier online sources, exposing recycled or mislabeled photos.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-708",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Public health records in the Northern Region show that villages with established medical clinics report higher total malaria cases than remote villages without clinics.",
    "question": "Why do villages with clinics register more malaria cases?",
    "options": [
      "Rural villagers without clinics have biological immunity.",
      "Villages with clinics have diagnostic testing and record-keeping, whereas cases in remote villages go undiagnosed and unrecorded.",
      "Medical clinics attract and breed Anopheles mosquitoes.",
      "Doctors introduce malaria parasites to patients."
    ],
    "correctAnswer": "Villages with clinics have diagnostic testing and record-keeping, whereas cases in remote villages go undiagnosed and unrecorded.",
    "explanation": "Diagnostic infrastructure increases case reporting (detection bias); the lack of clinics leads to underreporting, not lower actual disease rates.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-709",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A disinfectant company advertises: 'Our spray reduced classroom illness rates by 100%!' An audit reveals the school had only one absent pupil the previous term and zero this term.",
    "question": "What statistical manipulation makes this claim deceptive?",
    "options": [
      "Taking attendance on Mondays rather than Fridays.",
      "Disinfectants cannot kill airborne bacteria.",
      "Failing to convert percentages to decimal fractions.",
      "Using relative percentage reduction on a baseline of a single occurrence to exaggerate an insignificant absolute change."
    ],
    "correctAnswer": "Using relative percentage reduction on a baseline of a single occurrence to exaggerate an insignificant absolute change.",
    "explanation": "A 100% relative decrease masks the tiny absolute shift (from 1 to 0), misleading consumers about product impact.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-710",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A clear liquid recovered from a laboratory safe dissolves copper wire. Treating the solution with excess aqueous ammonia (NH₃) yields an intense deep-blue solution.",
    "question": "What metal cation is positively confirmed by this deep-blue coordination complex?",
    "options": [
      "Iron (Fe²⁺)",
      "Lead (Pb²⁺)",
      "Copper (Cu²⁺)",
      "Zinc (Zn²⁺)"
    ],
    "correctAnswer": "Copper (Cu²⁺)",
    "explanation": "Copper(II) ions react with excess aqueous ammonia to form the characteristic deep-blue tetraamminecopper(II) complex [Cu(NH₃)₄]²⁺.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-801",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Accra observe a flowering flamboyant tree growing near the assembly grounds.",
    "question": "Which of these statements is an objective botanical FACT?",
    "options": [
      "Sweeping flamboyant leaves off the compound is a terrible chore.",
      "Red flowers smell much sweeter than white flowers.",
      "The flamboyant tree is the most gorgeous shade tree in Ghana.",
      "Flamboyant tree flowers develop into long, woody seed pods."
    ],
    "correctAnswer": "Flamboyant tree flowers develop into long, woody seed pods.",
    "explanation": "Leguminous flower fertilization and woody pod development are verifiable botanical facts; aesthetic beauty and chore difficulty are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-802",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective examines footprints pressed into damp sand near the school water pump. The marks show a rounded bare heel with five small distinct toe depressions.",
    "question": "Who made these footprint tracks?",
    "options": [
      "A teacher wearing heavy leather dress shoes",
      "A pupil walking barefoot across the sand",
      "A stray sheep with two-toed split hooves",
      "A student wearing rubber sandals with tire-tread lines"
    ],
    "correctAnswer": "A pupil walking barefoot across the sand",
    "explanation": "Bare heel pads and five individual toe impressions confirm an unshod human foot, ruling out hooves and footwear.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-803",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A student blows up a latex balloon and rubs it vigorously against her dry woolen school sweater, then holds it above small bits of paper.",
    "question": "Why do the bits of paper jump up and stick to the balloon?",
    "options": [
      "The paper was magnetic metal.",
      "The balloon became sticky like tree sap.",
      "Warm air leaked out of the balloon and sucked up the paper.",
      "Friction transferred electrical charges, creating static electricity that attracts neutral paper bits."
    ],
    "correctAnswer": "Friction transferred electrical charges, creating static electricity that attracts neutral paper bits.",
    "explanation": "Triboelectric rubbing transfers electrons to the balloon, and the resulting electrostatic field induces dipole attraction in light paper scraps.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-804",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Morning assembly ran from 7:30 AM to 8:00 AM. English lesson ran from 8:00 AM to 9:00 AM. Physical Education ran from 9:00 AM to 10:00 AM. Kwame scraped his knee on the soccer pitch at 9:20 AM.",
    "question": "What class activity was Kwame participating in when he scraped his knee?",
    "options": [
      "Morning assembly under the trees",
      "Physical Education on the sports field",
      "Afternoon closing assembly",
      "English grammar inside the classroom"
    ],
    "correctAnswer": "Physical Education on the sports field",
    "explanation": "9:20 AM falls squarely inside the scheduled Physical Education interval (9:00 AM to 10:00 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-805",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends in Cape Coast describe an African grey parrot resting on an avocado branch.",
    "question": "Which of these statements represents a verifiable biological FACT?",
    "options": [
      "Parrots are the most intelligent birds in the animal kingdom.",
      "Grey parrots make much better pets than domestic pigeons.",
      "Listening to birds mimic words is hilarious.",
      "Parrots have zygodactyl feet with two toes facing forward and two toes facing backward."
    ],
    "correctAnswer": "Parrots have zygodactyl feet with two toes facing forward and two toes facing backward.",
    "explanation": "Zygodactyl avian anatomy is an objective biological trait; pet suitability and humor are personal opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-806",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A teacher discovers a dark green ink smear across an exam marking sheet on her desk.",
    "question": "Which suspect left this marking clue?",
    "options": [
      "Esi, who is using a red correction pen",
      "Kofi, who is writing with a leaking dark-green ballpoint pen",
      "Ama, who is sharpening a lead graphite pencil",
      "Yaw, who has dry white chalk dust on his fingers"
    ],
    "correctAnswer": "Kofi, who is writing with a leaking dark-green ballpoint pen",
    "explanation": "The leaking dark-green ballpoint pen provides the direct physical source matching the green ink smear.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-807",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil leaves a slice of ripe red watermelon on an open outdoor bench during afternoon recess. Within thirty minutes, dozens of tiny fruit flies hover over it.",
    "question": "What attracted the fruit flies to the watermelon?",
    "options": [
      "Watermelon skin reflects sunlight into the sky.",
      "The flies were trying to hide from the sun under the rind.",
      "The watermelon created flies out of its seeds.",
      "Volatile sweet sugar scents released by the sliced fruit attracted foraging flies."
    ],
    "correctAnswer": "Volatile sweet sugar scents released by the sliced fruit attracted foraging flies.",
    "explanation": "Fruit flies detect airborne ethanol and fructose vapors using antennal olfactory receptors to locate feeding and oviposition sites.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-808",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Breakfast was eaten at 6:45 AM, walking to school took from 7:00 AM to 7:30 AM, assembly ran from 7:30 AM to 8:00 AM, and handwriting began at 8:00 AM. Abena stained her fingers with blue ink at 8:15 AM.",
    "question": "What lesson was Abena engaged in when she stained her fingers?",
    "options": [
      "Walking along the road to school",
      "Handwriting class inside the classroom",
      "Eating breakfast at home",
      "Standing at morning assembly"
    ],
    "correctAnswer": "Handwriting class inside the classroom",
    "explanation": "Handwriting class began at 8:00 AM, which directly encompasses the 8:15 AM ink spill.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-809",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A clay bowl containing water on the kitchen porch was knocked over. The ground nearby displays split two-toed hooves with small dewclaw marks behind.",
    "question": "Which animal visited the porch and knocked over the bowl?",
    "options": [
      "A human wearing flat-soled sneakers",
      "A stray cat with padded claw paws",
      "A domestic chicken with three forward scaly toes",
      "A domestic pig or goat with cloven hooves"
    ],
    "correctAnswer": "A domestic pig or goat with cloven hooves",
    "explanation": "Cloven hooves with secondary dewclaw depressions are diagnostic anatomical imprints of artiodactyl ungulates.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-810",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils in Tamale examine shea nuts collected from a savanna shea tree.",
    "question": "Which statement represents a verifiable agricultural FACT?",
    "options": [
      "Collecting shea nuts in the savanna is the most fun weekend activity.",
      "Shea trees look far more majestic than baobab trees.",
      "Shea nuts contain vegetable fats that can be extracted to make shea butter.",
      "Shea butter smells much nicer than cocoa butter."
    ],
    "correctAnswer": "Shea nuts contain vegetable fats that can be extracted to make shea butter.",
    "explanation": "The lipid chemical composition of Vitellaria paradoxa kernels is an objective agricultural fact; smell and tree appearance are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-801",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A laboratory microscope disappeared from a secondary school prep room in Ho on October 14 at 1:30 PM. Suspect Dzifa claims she was outside stargazing and identifying the Orion constellation with her bare eyes at that exact time.",
    "question": "What astronomical fact disproves Dzifa's alibi?",
    "options": [
      "Ho is the administrative capital of the Volta Region.",
      "At 1:30 PM in Ho, the sun is high in the sky and atmospheric solar scattering obscures all distant stars.",
      "October is a month in the secondary rainy season.",
      "Microscopes use optical glass lenses to magnify specimens."
    ],
    "correctAnswer": "At 1:30 PM in Ho, the sun is high in the sky and atmospheric solar scattering obscures all distant stars.",
    "explanation": "Daytime solar irradiance washes out faint stellar emissions, making optical naked-eye stargazing impossible at 1:30 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-802",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial brand of imported breakfast cereal publishes a brochure claiming: 'Children who eat processed corn flakes score 40% higher on mathematics tests than children who eat traditional millet porridge.'",
    "question": "What fundamental bias should an apprentice analyst detect?",
    "options": [
      "Corn flakes are manufactured from milled maize kernels.",
      "Millet is an indigenous drought-resistant West African cereal grain.",
      "Mathematics tests evaluate arithmetic calculation skills.",
      "Commercial marketing bias designed to boost cereal sales while making unsupported health claims against local cereals."
    ],
    "correctAnswer": "Commercial marketing bias designed to boost cereal sales while making unsupported health claims against local cereals.",
    "explanation": "The commercial cereal manufacturer has a financial conflict of interest driving them to disparage traditional competing grains.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-803",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A baker mixed bread dough at 5:00 AM, let it ferment until 6:30 AM, baked it in an oven from 6:30 AM to 7:15 AM, and left loaves on cooling racks until 8:00 AM. A gas burner failure caused bread to come out doughy and underbaked.",
    "question": "During which operational interval did the gas burner fail?",
    "options": [
      "After 8:30 AM during morning sales",
      "Between 6:30 AM and 7:15 AM",
      "Between 5:00 AM and 6:30 AM",
      "Between 7:15 AM and 8:00 AM"
    ],
    "correctAnswer": "Between 6:30 AM and 7:15 AM",
    "explanation": "Baking thermal application occurred exclusively between 6:30 AM and 7:15 AM, restricting heat failure to that window.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-804",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A student measures the germination time of two bean seeds placed in sandy soil. Both sprout in exactly four days. He writes in his report: 'Every bean seed planted in sandy soil across Ghana germinates in exactly 96 hours.'",
    "question": "Why is the student's conclusion invalid?",
    "options": [
      "Sandy soil has large pore spaces and low water retention.",
      "The experiment was conducted during the third academic term.",
      "Bean seeds contain embryonic cotyledons and plumules.",
      "A sample size of two seeds (N=2) is statistically inadequate to represent natural biological variation across diverse seed batches."
    ],
    "correctAnswer": "A sample size of two seeds (N=2) is statistically inadequate to represent natural biological variation across diverse seed batches.",
    "explanation": "Generalizing national biological germination rates from two specimens fails statistical power requirements and ignores moisture and temperature variance.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-805",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A tool shed lock was cut with a mechanical hand tool. Forensic investigators recover metal shavings and observe striated shear marks angled at 45 degrees, matching the dual opposing blades of bolt cutters.",
    "question": "Which tool produced these mechanical marks on the lock shackle?",
    "options": [
      "A rotary angle grinder that creates melted abrasive slag burns",
      "A heavy pair of mechanical bolt cutters with opposing hardened blades",
      "A hand wood chisel with a single beveled flat blade",
      "A carpenter's claw hammer using blunt force"
    ],
    "correctAnswer": "A heavy pair of mechanical bolt cutters with opposing hardened blades",
    "explanation": "Opposing 45-degree shear facets with pinch-point ridges are characteristic forensic signatures of mechanical bolt cutter jaws.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-806",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "Following the total removal of riparian trees along the banks of the Densu River, local fishermen reported that river water temperatures rose and dissolved oxygen levels plummeted.",
    "question": "What caused the drop in dissolved oxygen?",
    "options": [
      "Trees pump oxygen into water through their submerged roots.",
      "The river water turned into solid ice.",
      "Fish began consuming all the oxygen because they grew larger.",
      "Loss of tree canopy exposed the river to direct solar heating, and warmer water holds significantly less dissolved oxygen gas."
    ],
    "correctAnswer": "Loss of tree canopy exposed the river to direct solar heating, and warmer water holds significantly less dissolved oxygen gas.",
    "explanation": "Gas solubility in water is inversely related to temperature; unshaded solar heating warms the water, driving dissolved oxygen out of solution.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-807",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A desktop computer was removed from a headmaster's office in Navrongo on December 15 at 10:00 PM. Suspect Akwasi claims he was sitting under a baobab tree watching the full moon rise at midday (12:00 PM) on that same date.",
    "question": "What astronomical fact dismantles Akwasi's alibi?",
    "options": [
      "Navrongo is situated in the Upper East Region.",
      "A full moon rises opposite the sun around sunset (approx 6:00 PM), never at 12:00 PM midday.",
      "Baobab trees store water in swollen trunk tissues.",
      "Desktop computers require alternating current electrical power."
    ],
    "correctAnswer": "A full moon rises opposite the sun around sunset (approx 6:00 PM), never at 12:00 PM midday.",
    "explanation": "A full moon is at 180° opposition to the sun and rises at dusk, making a midday full moon rise an astronomical impossibility.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-808",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial sports shoe brand sponsors a survey of 10 athletes on its payroll and announces: 'Our sneakers make runners 25% faster than any other brand on Earth.'",
    "question": "What critical bias undermines the study?",
    "options": [
      "Running shoes have synthetic foam soles.",
      "Sprinters run on rubberized asphalt tracks.",
      "The survey took place on an outdoor stadium track.",
      "Financial compensation creates self-interest bias, and the cherry-picked sample of paid athletes lacks independent verification."
    ],
    "correctAnswer": "Financial compensation creates self-interest bias, and the cherry-picked sample of paid athletes lacks independent verification.",
    "explanation": "Athletes under financial contract to a footwear company represent an obvious conflict of interest that invalidates unblinded claims.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-809",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A health worker interviews two patients in a town clinic who contracted malaria and finds neither used a mosquito net. She concludes: 'Zero residents in this entire district own mosquito nets.'",
    "question": "What logical fallacy did the health worker commit?",
    "options": [
      "The clinic was located in the Ashanti Region.",
      "Hasty generalization from a tiny, unrepresentative sample (N=2) to an entire municipal population.",
      "Malaria is caused by Plasmodium parasites.",
      "Mosquito nets are treated with pyrethroid insecticides."
    ],
    "correctAnswer": "Hasty generalization from a tiny, unrepresentative sample (N=2) to an entire municipal population.",
    "explanation": "Inferring district-wide bednet ownership from two self-selected symptomatic clinic patients is a severe hasty generalization.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-810",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A forged will written on legal paper displays an added clause. Chemical testing with thin-layer chromatography (TLC) reveals the added clause uses ballpoint ink with three dye components, while the original text uses gel ink with five dyes.",
    "question": "What does this chemical separation prove?",
    "options": [
      "The added clause was inscribed using a different writing instrument with distinct chemical ink formulation, proving document tampering.",
      "The paper was manufactured from unbleached wood pulp.",
      "The author was writing while sitting in a car.",
      "The document was stored inside an iron safe."
    ],
    "correctAnswer": "The added clause was inscribed using a different writing instrument with distinct chemical ink formulation, proving document tampering.",
    "explanation": "Thin-layer chromatography separates distinct ink dye formulations, confirming that the added text was inserted with a different pen.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-801",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A statistical study across coastal towns in the Western Region shows that as sales of sunglasses increase, reported emergency hospitalizations for marine jellyfish stings also rise.",
    "question": "What is the true underlying explanation for this correlation?",
    "options": [
      "Sunglass frames leach chemicals that stimulate jellyfish breeding.",
      "Wearing sunglasses attracts predatory jellyfish to swimmers.",
      "Sunny weather acts as a common confounding variable that independently increases both beach attendance and sunglass purchases.",
      "Jellyfish stings compel victims to buy dark eyewear."
    ],
    "correctAnswer": "Sunny weather acts as a common confounding variable that independently increases both beach attendance and sunglass purchases.",
    "explanation": "Solar irradiance drives beach recreation, concurrently raising eyewear sales and marine wildlife exposure without any direct causation.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-802",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A sensational TikTok video claims: 'NASA confirms the Earth will lose gravity for three hours next Friday at 2:00 PM; all citizens must tie themselves to trees! Share with 20 friends!'",
    "question": "Which combination of factors proves this video is viral clickbait misinformation?",
    "options": [
      "Physics impossibility (gravity cannot shut off), artificial apocalyptic panic, lack of institutional peer confirmation, and forced share quotas.",
      "Gravitational attraction depends on mass and distance (F = G m₁ m₂ / r²).",
      "TikTok transmits digital streaming video over cellular networks.",
      "NASA employs astrophysicists and space engineers."
    ],
    "correctAnswer": "Physics impossibility (gravity cannot shut off), artificial apocalyptic panic, lack of institutional peer confirmation, and forced share quotas.",
    "explanation": "Earth's mass generates invariant gravitational curvature; claims of gravity spontaneously deactivating are pseudoscience designed for viral engagement.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-803",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "During a debate on school uniform policy, Speaker A suggests: 'We should permit breathable cotton shirts during the hot dry harmattan season.' Speaker B responds: 'Speaker A wants our students to abandon uniforms and arrive in beachwear!'",
    "question": "Which logical fallacy did Speaker B commit?",
    "options": [
      "Ad Hominem",
      "Circular Reasoning",
      "Straw Man Fallacy (misrepresenting and exaggerating an opponent's argument to make it easier to attack)",
      "Appeal to Ignorance"
    ],
    "correctAnswer": "Straw Man Fallacy (misrepresenting and exaggerating an opponent's argument to make it easier to attack)",
    "explanation": "Distorting a moderate proposal for breathable cotton into an extreme call for beachwear is a classic straw man fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-804",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A forensic analyst tests an unknown white crystalline powder recovered from an illegal mining facility. Dissolving it in water and adding acidified barium chloride (BaCl₂) yields a dense, insoluble white precipitate.",
    "question": "What anion is positively identified by this barium sulfate precipitation reaction?",
    "options": [
      "Sulfate (SO₄²⁻)",
      "Carbonate (CO₃²⁻)",
      "Chloride (Cl⁻)",
      "Nitrate (NO₃⁻)"
    ],
    "correctAnswer": "Sulfate (SO₄²⁻)",
    "explanation": "Barium ions react selectively with sulfate ions to form insoluble barium sulfate (BaSO₄), which remains insoluble in dilute mineral acid.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-805",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A private tutoring academy advertises: 'Our average student score improved by 400%!' An independent audit reveals that student scores rose from 1 point to 5 points out of 100.",
    "question": "What deceptive statistical technique was used?",
    "options": [
      "Plotting data using scatter diagrams.",
      "Using standard deviation without variance.",
      "Reporting a large relative percentage increase to conceal an objectively poor absolute performance gain.",
      "Calculating the median rather than the arithmetic mean."
    ],
    "correctAnswer": "Reporting a large relative percentage increase to conceal an objectively poor absolute performance gain.",
    "explanation": "Touting a 400% relative jump masks the fact that an absolute score of 5/100 remains a severe failure.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-806",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A student prefect argues: 'We must not allow students to use mobile calculators during physics prep. If we do, students will forget all arithmetic, lose the ability to think, fail every national exam, and destroy Ghana's engineering future!'",
    "question": "Which logical fallacy is demonstrated by this argument?",
    "options": [
      "Slippery Slope Fallacy",
      "False Analogy",
      "Equivocation",
      "Red Herring"
    ],
    "correctAnswer": "Slippery Slope Fallacy",
    "explanation": "Asserting without evidentiary justification that allowing calculators will inevitably cause an apocalyptic chain of educational collapses is a slippery slope.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-807",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral social media post displays a photo of a polar bear standing on a sand dune labeled: 'Arctic polar bear discovered migrating wild in Mole National Park, Ghana!'",
    "question": "What biological and ecological reality disproves this image?",
    "options": [
      "Digital cameras record high-resolution pixel matrices.",
      "Mole National Park is situated in the Savannah Region of Ghana.",
      "Polar bears are hyper-specialized arctic marine mammals unable to survive savanna tropical heat or cross thousands of miles of tropical ocean.",
      "Sand dunes occur in arid desert environments."
    ],
    "correctAnswer": "Polar bears are hyper-specialized arctic marine mammals unable to survive savanna tropical heat or cross thousands of miles of tropical ocean.",
    "explanation": "Ursus maritimus is ecologically adapted strictly to arctic sea-ice biomes; physiological heat stress and vast geographic separation refute the claim.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-808",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Municipal data in Accra reveals that as the number of traffic police officers deployed on major intersections increased, the number of registered traffic citations also increased.",
    "question": "What is the true causal explanation for this relationship?",
    "options": [
      "Increased enforcement presence directly raised citation detection and issuance rates, rather than causing worse driving behavior.",
      "Traffic citations attract police officers to intersections.",
      "Intersections with police officers experience sudden brake failures.",
      "Traffic police officers compel drivers to break road regulations."
    ],
    "correctAnswer": "Increased enforcement presence directly raised citation detection and issuance rates, rather than causing worse driving behavior.",
    "explanation": "Detection bias explains the trend: more officers record a higher percentage of existing infractions that previously went unpenalized.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-809",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A company displays a bar chart comparing customer satisfaction between its product (51%) and a competitor's (49%). The Y-axis begins at 48% instead of 0%, making the 51% bar appear three times taller than the 49% bar.",
    "question": "What misleading graphic design technique is being used?",
    "options": [
      "Plotting discrete categorical variables as continuous data.",
      "Converting percentages into radians.",
      "A truncated axis (suppressed zero baseline) that visually exaggerates a minor 2% difference into a massive visual gap.",
      "Failing to compute the geometric mean."
    ],
    "correctAnswer": "A truncated axis (suppressed zero baseline) that visually exaggerates a minor 2% difference into a massive visual gap.",
    "explanation": "Truncating the vertical axis baseline distorts geometric area proportions, magnifying an insignificant 2% margin into a false visual landslide.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-810",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A forensic analyst tests an unknown metal seized at an illegal smelting shed. Treating the metal shavings with concentrated nitric acid produces a brown toxic gas (NO₂) and a bright blue-green solution that turns deep blue when aqueous ammonia is added.",
    "question": "What transition metal element was positively identified?",
    "options": [
      "Zinc (Zn)",
      "Copper (Cu)",
      "Iron (Fe)",
      "Lead (Pb)"
    ],
    "correctAnswer": "Copper (Cu)",
    "explanation": "Copper dissolves in nitric acid yielding nitrogen dioxide gas and aqueous Cu²⁺ ions, which form the deep blue [Cu(NH₃)₄]²⁺ complex in ammonia.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-901",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four pupils in Kumasi examine a green preying mantis perched on a cassava leaf in the school farm.",
    "question": "Which of these statements represents a verifiable biological FACT?",
    "options": [
      "The praying mantis is the creepiest insect on the farm.",
      "Watching insects hunt is far more exciting than drawing.",
      "The praying mantis has spiked forelegs adapted for grasping insect prey.",
      "Green insects are much friendlier than brown insects."
    ],
    "correctAnswer": "The praying mantis has spiked forelegs adapted for grasping insect prey.",
    "explanation": "Raptorial foreleg morphology is an observable anatomical fact, whereas creepiness and excitement are subjective emotional opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-902",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A detective examines wet footprints left on the veranda tiles. The prints show a flat sole imprint featuring narrow horizontal wavy ridges with no heel lift.",
    "question": "Which footwear produced these tracks?",
    "options": [
      "A pair of rubber bathroom flip-flops with horizontal wavy grooves",
      "A goat with two-toed split hooves",
      "A barefoot child with round heel prints and five toes",
      "A leather dress boot with a thick raised heel block"
    ],
    "correctAnswer": "A pair of rubber bathroom flip-flops with horizontal wavy grooves",
    "explanation": "Flat-soled continuous wavy horizontal ridges match lightweight rubber flip-flops, excluding barefoot marks and heeled boots.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-903",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A student leaves a piece of moist bread inside a dark wooden cupboard for twelve days during the warm rainy season. When inspected, it is covered in dark fuzzy patches.",
    "question": "What is the physical cause of these fuzzy patches?",
    "options": [
      "The wooden cupboard melted onto the bread.",
      "Bread naturally turns into black soot in the dark.",
      "Airborne fungal mold spores germinated and grew on the moist organic starch.",
      "Spiders painted the crust with dark silk threads."
    ],
    "correctAnswer": "Airborne fungal mold spores germinated and grew on the moist organic starch.",
    "explanation": "Warmth and moisture provide optimal environmental conditions for microscopic fungal spores to colonize and form visible mold mycelia.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-904",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Morning assembly ran from 7:30 AM to 8:00 AM. English lesson lasted from 8:00 AM to 9:15 AM. Mathematics ran from 9:15 AM to 10:15 AM. Break time was 10:15 AM to 10:45 AM. Kweku bought meat pie at 10:25 AM.",
    "question": "During which scheduled school activity did Kweku buy the meat pie?",
    "options": [
      "During the morning break time",
      "During English lesson",
      "During mathematics class",
      "During morning assembly"
    ],
    "correctAnswer": "During the morning break time",
    "explanation": "10:25 AM falls directly within the designated school break period (10:15 AM to 10:45 AM).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-905",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four friends talk about an African honey badger observed in a nature documentary.",
    "question": "Which statement about the honey badger is an objective scientific FACT?",
    "options": [
      "Wild animals with black and white fur are always fun to watch.",
      "The honey badger is the bravest animal in the entire world.",
      "The honey badger possesses thick, loose skin and sharp claws for digging.",
      "Honey badgers look much nicer than wild boars."
    ],
    "correctAnswer": "The honey badger possesses thick, loose skin and sharp claws for digging.",
    "explanation": "Anatomical traits like skin thickness and claw structure are verifiable zoological facts; bravery is a humanized characterization.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-906",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A desk drawer was opened without permission. Traces of purple dye residue coat the brass keyhole.",
    "question": "Which suspect left this trace clue?",
    "options": [
      "Ama, who was using a purple felt-tip marker that leaked on her fingers",
      "Yaw, who was sweeping dry brown dust from the floor",
      "Esi, who was cutting clean white cardboard with scissors",
      "Kofi, who was sharpening a black graphite pencil"
    ],
    "correctAnswer": "Ama, who was using a purple felt-tip marker that leaked on her fingers",
    "explanation": "Direct physical contact transfers residue: the purple ink on Ama's fingers matches the colored dye found on the keyhole.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-907",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A pupil leaves a metal spoon resting inside a bowl of steaming hot groundnut soup. Two minutes later, the handle of the spoon burns her fingers when touched.",
    "question": "What process made the spoon handle hot?",
    "options": [
      "The air in the room heated the handle from above.",
      "The soup gave off sparks that lit the spoon.",
      "Thermal conduction transferred heat energy through the metal spoon from the hot soup.",
      "Metal attracts sunlight to heat itself up."
    ],
    "correctAnswer": "Thermal conduction transferred heat energy through the metal spoon from the hot soup.",
    "explanation": "Metals have high thermal conductivity; kinetic energy transfers rapidly from molecule to molecule up through the solid spoon handle.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-908",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Kwame woke up at 6:00 AM, swept the family veranda at 6:30 AM, bathed at 7:00 AM, and walked to school at 7:30 AM. He scratched his hand on a dry palm frond broom at 6:35 AM.",
    "question": "What chore was Kwame doing when he scratched his hand?",
    "options": [
      "Sweeping the veranda with a palm broom",
      "Bathing in the bathhouse",
      "Walking along the road to school",
      "Waking up in his bedroom"
    ],
    "correctAnswer": "Sweeping the veranda with a palm broom",
    "explanation": "Sweeping occurred between 6:30 AM and 7:00 AM, directly containing the 6:35 AM scratch incident.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-909",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A ripe pawpaw sitting on an outdoor table has small, round, toothless peck marks where fruit flesh was scooped away.",
    "question": "What creature produced these feeding marks?",
    "options": [
      "A mouse with paired gnawing incisor teeth",
      "A person using a steel fork",
      "A wild garden bird using its hard beak to peck flesh",
      "A stray hunting dog with sharp pointed canine teeth"
    ],
    "correctAnswer": "A wild garden bird using its hard beak to peck flesh",
    "explanation": "Small, curved, toothless gouges without incisor or canine indentations match avian beak-pecking feeding behavior.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-910",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils in Sunyani discuss the oil palm tree growing behind the school fence.",
    "question": "Which of these statements represents an indisputable agricultural FACT?",
    "options": [
      "Palm nut soup is the most delicious soup in West Africa.",
      "Oil palm fruit bunches produce both palm oil from the pulp and palm kernel oil from the nut.",
      "Climbing tall palm trees looks much too frightening.",
      "Palm trees look far more graceful than mango trees."
    ],
    "correctAnswer": "Oil palm fruit bunches produce both palm oil from the pulp and palm kernel oil from the nut.",
    "explanation": "The lipid harvest of Elaeis guineensis yielding mesocarp oil and kernel oil is an established botanical and agricultural fact.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-901",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A box of solar multimeter tools disappeared from a laboratory in Koforidua on June 18 at 8:00 PM. Suspect Kofi claims he was sitting outdoors drawing a sketch of a tree shadow cast by the bright midday sun.",
    "question": "What astronomical fact destroys Kofi's alibi?",
    "options": [
      "In Ghana, the sun sets around 6:30 PM, making direct midday solar shadows impossible at 8:00 PM.",
      "Solar multimeters measure electrical voltage and current.",
      "Koforidua is the regional capital of the Eastern Region.",
      "Drawing trees requires graphite pencils and sketchbooks."
    ],
    "correctAnswer": "In Ghana, the sun sets around 6:30 PM, making direct midday solar shadows impossible at 8:00 PM.",
    "explanation": "Ghana sits near the equator where darkness falls reliably by 6:30 PM year-round, disproving outdoor sunlight shadows at 8:00 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-902",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial agrochemical company publishes a sponsored pamphlet stating: 'Synthetic chemical weedicides are completely harmless to all river fish and must be sprayed directly along all streams.'",
    "question": "What fundamental bias must an investigator identify in this publication?",
    "options": [
      "Streams flow into larger regional rivers.",
      "Weedicides are designed to kill invasive plant species.",
      "Commercial profit bias encouraging chemical sales while downplaying documented ecotoxicity to aquatic wildlife.",
      "Fish breathe using aquatic gill filaments."
    ],
    "correctAnswer": "Commercial profit bias encouraging chemical sales while downplaying documented ecotoxicity to aquatic wildlife.",
    "explanation": "The chemical manufacturer has a direct financial incentive to market high usage, masking known runoff toxicity to aquatic life.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-903",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A science beaker containing chemical reagents was mixed at 8:00 AM, heated on a burner from 8:30 AM to 9:15 AM, and left to cool from 9:15 AM to 10:00 AM. Thermal stress caused the beaker bottom to fracture.",
    "question": "In which timeframe did the thermal stress fracture occur?",
    "options": [
      "Between 8:30 AM and 9:15 AM",
      "Between 9:15 AM and 10:00 AM",
      "After 10:30 AM during morning break",
      "Between 8:00 AM and 8:30 AM"
    ],
    "correctAnswer": "Between 8:30 AM and 9:15 AM",
    "explanation": "Thermal energy from the burner was applied exclusively between 8:30 AM and 9:15 AM, bounding the thermal stress failure to that period.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-904",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A pupil tests the battery runtime of a single refurbished solar lantern on a rainy morning and finds it lasts 30 minutes. He writes: 'All 500 lanterns from this manufacturer fail after 30 minutes.'",
    "question": "Why is the pupil's conclusion invalid?",
    "options": [
      "Solar lanterns contain photovoltaic silicon cells.",
      "Rainy mornings have reduced solar irradiance.",
      "Testing a single unit under atypical weather is an unrepresentative sample that cannot establish batch reliability.",
      "Lanterns provide portable night illumination."
    ],
    "correctAnswer": "Testing a single unit under atypical weather is an unrepresentative sample that cannot establish batch reliability.",
    "explanation": "Generalizing across 500 units from an N=1 sample tested under sub-optimal charging conditions commits a hasty generalization.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-905",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "Investigators examine a broken wooden louvre window at a school science store. Red laterite mud containing distinctive crushed quartz pebbles matches residue extracted from a suspect's shoe treads.",
    "question": "What does this soil evidence indicate?",
    "options": [
      "The suspect walked through the localized trench directly beneath the broken science store window.",
      "The suspect was washing hands at the school tap.",
      "The suspect bought new running shoes in Kumasi.",
      "The science store window was constructed from timber wood."
    ],
    "correctAnswer": "The suspect walked through the localized trench directly beneath the broken science store window.",
    "explanation": "Matching mineralogical and grain-size profiles of soil trace evidence links the footwear directly to the specific crime scene location.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-906",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "Following the total removal of riverbank bamboo stands along the Birim River, local farmers reported that seasonal floods washed away their fertile topsoil.",
    "question": "What caused the increased topsoil loss?",
    "options": [
      "Bamboo plants generate underground river water.",
      "Fish in the river pushed the mud away.",
      "Removing the dense fibrous bamboo root network eliminated the mechanical barrier binding the bank soil.",
      "The river water changed into acid."
    ],
    "correctAnswer": "Removing the dense fibrous bamboo root network eliminated the mechanical barrier binding the bank soil.",
    "explanation": "Riparian root matrices bind alluvial soils; removing vegetation exposes loose soil to hydraulic shear forces during flooding.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-907",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A generator copper coil was stolen in Navrongo on December 20 at 11:30 PM. Suspect Salifu claims he was reading a printed newspaper outdoors under direct natural sunlight with zero artificial lights.",
    "question": "What geographical fact dismantles Salifu's alibi?",
    "options": [
      "At 11:30 PM in Ghana, it is nighttime and natural solar illumination is absent.",
      "Generators convert rotational kinetic energy into electricity.",
      "Navrongo is situated in the Upper East Region.",
      "Newspapers are printed on cellulose paper."
    ],
    "correctAnswer": "At 11:30 PM in Ghana, it is nighttime and natural solar illumination is absent.",
    "explanation": "Natural sunlight is impossible at 11:30 PM near the equator, proving the alibi was completely fabricated.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-908",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A commercial brand selling bottled spring water publishes an advertisement claiming: 'Tap water boiled in domestic kettles contains zero minerals and leads to severe bone weakness.'",
    "question": "What bias should an apprentice researcher flag?",
    "options": [
      "Bones require calcium and phosphorus minerals.",
      "Boiling water destroys pathogenic microorganisms.",
      "Commercial motive bias designed to frighten consumers away from affordable municipal tap water to buy bottled water.",
      "Bottled water is packaged in polyethylene containers."
    ],
    "correctAnswer": "Commercial motive bias designed to frighten consumers away from affordable municipal tap water to buy bottled water.",
    "explanation": "The bottled water seller has a financial conflict of interest driving them to fabricate false nutritional hazards about boiled tap water.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-909",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A gardener inspects two orange trees in an orchard of 600 trees, notices scale insects on their bark, and declares: 'All 600 trees in this orchard are 100% infested and must be cut down.'",
    "question": "What reasoning error did the gardener commit?",
    "options": [
      "Hasty generalization from a tiny sample (N=2) to an entire agricultural tree population.",
      "Citrus trees belong to the Rutaceae plant family.",
      "Orchards require weeding and seasonal irrigation.",
      "Scale insects feed on plant phloem sap."
    ],
    "correctAnswer": "Hasty generalization from a tiny sample (N=2) to an entire agricultural tree population.",
    "explanation": "Sampling two trees out of 600 cannot establish population-wide infestation rates or justify clearing an entire orchard.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-910",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A forensic document examiner inspects an altered invoice. Under infrared luminescence lighting, original text appears transparent while the added dollar figures glow brightly.",
    "question": "What does this optical test prove?",
    "options": [
      "The paper was manufactured from unbleached cotton.",
      "The accountant was wearing reading spectacles.",
      "The invoice was mailed in a paper envelope.",
      "The altered figures were written using a distinct chemical ink formula from the original text, confirming forgery."
    ],
    "correctAnswer": "The altered figures were written using a distinct chemical ink formula from the original text, confirming forgery.",
    "explanation": "Different chemical dye formulations absorb and emit infrared radiation differently, optically revealing added text.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-901",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A municipal data survey in Takoradi finds that neighborhoods with higher monthly sales of bottled water also report higher total foot-traffic pedestrian hospitalizations.",
    "question": "What is the primary lurking confounding variable driving both metrics?",
    "options": [
      "Pedestrian hospitalizations compel market shoppers to purchase bottled water.",
      "High-density commercial market zones concentrate heavy pedestrian volumes, which naturally drives beverage sales and increases vehicle collision risks.",
      "Bottled water vendors intentionally trip pedestrians along the sidewalk.",
      "Drinking bottled water causes dizziness that makes pedestrians walk into traffic."
    ],
    "correctAnswer": "High-density commercial market zones concentrate heavy pedestrian volumes, which naturally drives beverage sales and increases vehicle collision risks.",
    "explanation": "Urban foot-traffic density is the common confounding cause that simultaneously raises beverage demand and pedestrian exposure to traffic.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-902",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A trending social media post claims: 'WHO declares that boiling crushed charcoal in battery acid produces an herbal tea that kills 100% of all viruses! Share with 20 groups before the government censors this!'",
    "question": "Which combination of indicators confirms this post is dangerous disinformation?",
    "options": [
      "Charcoal contains elemental amorphous carbon.",
      "Sulfuric acid is used as electrolyte in lead-acid batteries.",
      "The World Health Organization is an international public health agency.",
      "Recommending consumption of corrosive toxins, universal miracle cure claims, suppression conspiracy framing, and viral share quotas."
    ],
    "correctAnswer": "Recommending consumption of corrosive toxins, universal miracle cure claims, suppression conspiracy framing, and viral share quotas.",
    "explanation": "Promoting consumption of lethal battery acid, coupled with conspiracy tropes and chain-forwarding quotas, is a clear marker of digital health hoaxes.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-903",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "During a debate on city transit in Accra, a transport advocate suggests: 'We should introduce bus rapid transit lanes.' An opponent retorts: 'How can we take advice from someone whose personal car broke down on the highway last month?'",
    "question": "Which logical fallacy did the opponent commit?",
    "options": [
      "Begging the Question",
      "Ad Hominem (attacking the person's private circumstance instead of evaluating the transit policy merit)",
      "Post Hoc Ergo Propter Hoc",
      "Straw Man Fallacy"
    ],
    "correctAnswer": "Ad Hominem (attacking the person's private circumstance instead of evaluating the transit policy merit)",
    "explanation": "Dismissing an urban transit proposal by attacking the speaker's personal vehicle maintenance issues is an ad hominem fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-904",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A clear liquid recovered from an illegal gold refining workshop turns blue litmus paper bright red and liberates dense brown toxic fumes (NO₂) when reacted with copper wire shavings.",
    "question": "What concentrated mineral acid is positively identified by this reaction?",
    "options": [
      "Sulfuric acid (H₂SO₄)",
      "Acetic acid (CH₃COOH)",
      "Hydrochloric acid (HCl)",
      "Nitric acid (HNO₃)"
    ],
    "correctAnswer": "Nitric acid (HNO₃)",
    "explanation": "Concentrated nitric acid oxidizes copper metal to form copper(II) nitrate while releasing characteristic reddish-brown nitrogen dioxide gas (NO₂).",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-905",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A private clinic reports: '50% of our clinical trial patients experienced complete symptom relief!' An audit reveals the clinic enrolled only 2 patients in total, and 1 recovered naturally without intervention.",
    "question": "Why is the clinic's published percentage deceptive?",
    "options": [
      "Clinical trials must be conducted in public teaching hospitals.",
      "Reporting percentages on an ultra-tiny sample (N=2) conceals the lack of statistical power and high margin of error.",
      "Symptoms must be measured in international metric units.",
      "Patients should never be enrolled in medical clinical studies."
    ],
    "correctAnswer": "Reporting percentages on an ultra-tiny sample (N=2) conceals the lack of statistical power and high margin of error.",
    "explanation": "Converting 1 out of 2 into 50% gives a misleading impression of clinical efficacy while obscuring an inadequate sample size.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-906",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A debater asserts: 'Either we completely shut down all school computer labs, or every single student will fail their BECE exams and become illiterate!'",
    "question": "What logical fallacy is illustrated by this statement?",
    "options": [
      "Equivocation",
      "Appeal to Authority",
      "Genetic Fallacy",
      "False Dilemma (bifurcation, ignoring balanced intermediate solutions)"
    ],
    "correctAnswer": "False Dilemma (bifurcation, ignoring balanced intermediate solutions)",
    "explanation": "Artificially constraining a complex educational discussion into two extreme polar outcomes while ignoring moderate approaches is a false dilemma.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-907",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A shared video shows a government minister announcing free laptop distributions to every citizen. Software analysis reveals unnatural facial boundary flickering, robotic phoneme pacing, and desynchronized teeth textures.",
    "question": "What technology was used to produce this deceptive media?",
    "options": [
      "Standard high-definition optical camera zoom",
      "Deepfake AI synthetic generative audiovisual manipulation",
      "Infrared thermal environmental imaging",
      "Analog closed-circuit security camera recording"
    ],
    "correctAnswer": "Deepfake AI synthetic generative audiovisual manipulation",
    "explanation": "Facial boundary blending artifacts, texture smoothing, and desynchronized phonemes are classic signs of AI deepfake generation.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-908",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Data from Accra reveals a strong positive correlation between the number of pedestrians carrying open umbrellas and the number of vehicular traffic accidents along the George Walker Bush Highway.",
    "question": "What underlying common factor accounts for this correlation?",
    "options": [
      "Open umbrellas emit electromagnetic interference that disrupts car steering.",
      "Traffic accidents compel pedestrians to deploy rain umbrellas.",
      "Pedestrians intentionally wave umbrellas to distract drivers.",
      "Heavy rainfall independently prompts pedestrians to carry umbrellas while creating slippery roads and poor visibility for drivers."
    ],
    "correctAnswer": "Heavy rainfall independently prompts pedestrians to carry umbrellas while creating slippery roads and poor visibility for drivers.",
    "explanation": "Rain is the common confounding meteorological variable that triggers umbrella use while causing wet road hazards.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-909",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "An energy company publishes a bar chart of solar output increasing from 48% to 50%. The vertical axis begins at 47% rather than 0%, making the 50% bar appear five times taller than the 48% bar.",
    "question": "What deceptive graphic technique was employed here?",
    "options": [
      "Failing to convert percentages to degrees of a circle.",
      "Truncated graph axis (suppressed zero baseline) to visually exaggerate minor numerical differences.",
      "Plotting discrete variables on a Cartesian plane.",
      "Using 3D drop shadows along bar borders."
    ],
    "correctAnswer": "Truncated graph axis (suppressed zero baseline) to visually exaggerate minor numerical differences.",
    "explanation": "Truncating the vertical axis baseline distorts geometric proportions, making a 2% change appear like a massive surge.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-910",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "Soil around an abandoned warehouse suspected of toxic battery dumping is acidified and treated with potassium iodide (KI). A brilliant canary-yellow precipitate forms that recrystallizes into sparkling golden crystals on cooling.",
    "question": "What toxic heavy metal cation is confirmed by this reaction?",
    "options": [
      "Lead (Pb²⁺)",
      "Sodium (Na⁺)",
      "Iron (Fe³⁺)",
      "Calcium (Ca²⁺)"
    ],
    "correctAnswer": "Lead (Pb²⁺)",
    "explanation": "Lead(II) ions react with iodide ions to form bright yellow lead(II) iodide (PbI₂), famous for forming shimmering 'golden rain' crystals upon cooling.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2001",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Four Basic 2 pupils visit a cocoa farm in Tafo and examine a ripe yellow cocoa pod cut open by the farmer.",
    "question": "Which pupil stated a verifiable scientific FACT?",
    "options": [
      "Cocoa pods look much prettier than pawpaw fruits.",
      "Cocoa beans inside the pod are covered in sweet white mucilage pulp.",
      "Chocolate is the most delicious snack in the entire world.",
      "Every child should drink hot cocoa three times a day."
    ],
    "correctAnswer": "Cocoa beans inside the pod are covered in sweet white mucilage pulp.",
    "explanation": "The white mucilaginous pulp surrounding fresh Theobroma cacao seeds is an observable botanical fact; beauty and taste preferences are opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2002",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A plate of fried plantain (kelewele) was eaten on the kitchen table. Fine white powdery flour dust is found on the table edge and on the cupboard handle.",
    "question": "Which suspect left this powdery clue?",
    "options": [
      "Esi, who was sweeping dry brown leaves in the yard",
      "Abena, who was washing ripe red tomatoes in a bowl of water",
      "Yaw, who was polishing black leather school shoes",
      "Kojo, who was kneading wheat flour dough for meat pies"
    ],
    "correctAnswer": "Kojo, who was kneading wheat flour dough for meat pies",
    "explanation": "White wheat flour on Kojo's hands directly matches the white powdery residue transferred onto the table edge and handle.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2003",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "Ama planted two identical cowpea seedlings in pots. She placed Pot A on the sunny veranda and locked Pot B inside a dark windowless storeroom, watering both equally. After two weeks, Pot B had pale yellow leaves and a weak, spindly stem.",
    "question": "Why did the seedling in Pot B turn pale yellow?",
    "options": [
      "Water turns plant leaves yellow when poured in the dark.",
      "Without sunlight, the plant could not produce green chlorophyll or perform photosynthesis.",
      "The clay pot absorbed the green color through the roots.",
      "The dark storeroom was full of invisible insects that ate the green color."
    ],
    "correctAnswer": "Without sunlight, the plant could not produce green chlorophyll or perform photosynthesis.",
    "explanation": "Plants require light energy to synthesize green chlorophyll pigment and manufacture sugars through photosynthesis (etiolation occurs in darkness).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2004",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "On Friday, Creative Arts ran from 10:30 AM to 11:30 AM, Twi Language ran from 11:30 AM to 12:30 PM, Lunch ran from 12:30 PM to 1:15 PM, and Story Time ran from 1:15 PM to 2:00 PM. Mensah spilled yellow poster paint on his shirt at 10:50 AM.",
    "question": "Which lesson was taking place when Mensah spilled the paint?",
    "options": [
      "Twi Language lesson",
      "Afternoon Lunch break",
      "Story Time session",
      "Creative Arts class"
    ],
    "correctAnswer": "Creative Arts class",
    "explanation": "10:50 AM falls directly inside the 10:30 AM to 11:30 AM Creative Arts period.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2005",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Wet tracks lead across the dry cement veranda from the garden Pond. Each footprint shows four long toes joined together by thin skin webs.",
    "question": "Which animal walked across the veranda?",
    "options": [
      "A nanny goat with split hard hooves",
      "A domestic duck with webbed swimming feet",
      "A speckled guinea fowl with unwebbed scratching toes",
      "A house cat with soft padded paws"
    ],
    "correctAnswer": "A domestic duck with webbed swimming feet",
    "explanation": "Webbed membranes between the toes are an aquatic adaptation characteristic of waterfowl like ducks.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2006",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "During the dry Harmattan season in January, Kofi hangs his wet school uniform shirt outside on the line. It dries in just 25 minutes, whereas in the rainy June season it took 2 hours.",
    "question": "Why did the shirt dry so much faster during Harmattan?",
    "options": [
      "The sun moves closer to Ghana in January than in June.",
      "Uniform shirts shrink and squeeze water out in January.",
      "Harmattan dust eats the water out of cotton cloth.",
      "Dry, windy Harmattan air has very low humidity, allowing liquid water to evaporate rapidly."
    ],
    "correctAnswer": "Dry, windy Harmattan air has very low humidity, allowing liquid water to evaporate rapidly.",
    "explanation": "Evaporation rate increases dramatically when ambient relative humidity is low and moving wind carries water vapor away from the fabric.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2007",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Pupils at Kakum National Park watch an African forest elephant using its trunk to pull bark off a tree.",
    "question": "Which statement is an objective zoological FACT?",
    "options": [
      "Elephants are the kindest animals in the forest.",
      "An elephant's trunk is a fusion of its nose and upper lip containing thousands of muscles and no bones.",
      "Watching elephants is much better than walking on the canopy walkway.",
      "Baby elephants are cuter than baby antelopes."
    ],
    "correctAnswer": "An elephant's trunk is a fusion of its nose and upper lip containing thousands of muscles and no bones.",
    "explanation": "Proboscis muscular anatomy without skeletal bone is a verifiable biological fact, while kindness and cuteness are subjective opinions.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2008",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Grandmother put the pot of yam on the coal pot fire at 4:00 PM. She boiled the yam from 4:00 PM to 4:35 PM, pounded the fufu from 4:35 PM to 5:00 PM, and served dinner at 5:05 PM. The neighbors heard loud rhythmic pounding at 4:45 PM.",
    "question": "What was Grandmother doing at 4:45 PM?",
    "options": [
      "Washing dishes after dinner",
      "Lighting the charcoal fire",
      "Peeling raw yam tubers",
      "Pounding fufu in the wooden mortar"
    ],
    "correctAnswer": "Pounding fufu in the wooden mortar",
    "explanation": "4:45 PM is squarely within the 4:35 PM to 5:00 PM fufu-pounding window.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2009",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Someone borrowed the class bell without asking. On the wooden handle of the bell, the prefect finds sticky orange-yellow oil stains that smell like ripe palm nuts.",
    "question": "Who touched the class bell?",
    "options": [
      "Fifi, who was erasing the chalkboard with a dry duster",
      "Adwoa, who just finished eating abe nkwan (palm nut soup) with her fingers",
      "Nana, who was folding clean white notebook paper",
      "Kwabena, who was drinking clear sachet water"
    ],
    "correctAnswer": "Adwoa, who just finished eating abe nkwan (palm nut soup) with her fingers",
    "explanation": "Reddish-orange carotenoid-rich oil with a palm aroma directly matches residue from palm nut soup.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-2010",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "When Yaw places a steel paperclip near a bar magnet, it jumps to the magnet. When he places a yellow plastic ruler near the same magnet, nothing happens.",
    "question": "Why does the paperclip jump while the plastic ruler stays still?",
    "options": [
      "The paperclip contains ferromagnetic iron, whereas plastic is a non-magnetic material.",
      "The plastic ruler is too heavy for the magnet to lift.",
      "Magnets only attract silver-colored objects.",
      "The paperclip was coated in invisible glue."
    ],
    "correctAnswer": "The paperclip contains ferromagnetic iron, whereas plastic is a non-magnetic material.",
    "explanation": "Magnetic fields align electron domains in ferromagnetic metals like iron, nickel, and cobalt, but do not attract polymers like plastic.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A solar battery inverter was taken from a community clinic in Wa at 3:00 PM on Wednesday. Suspectatah claims he was in London (which is on Greenwich Mean Time, UTC+0, the exact same time zone as Ghana in November) watching a live sunset at 11:00 AM local time.",
    "question": "What geographical and astronomical fact exposes his alibi as false?",
    "options": [
      "Solar inverters convert direct current (DC) into alternating current (AC).",
      "Wa is the regional capital of the Upper West Region.",
      "Ghana and London both lie near the Prime Meridian (0° longitude).",
      "The sun never sets at 11:00 AM before midday in either Ghana or London."
    ],
    "correctAnswer": "The sun never sets at 11:00 AM before midday in either Ghana or London.",
    "explanation": "At 11:00 AM local time, the sun is still ascending toward solar noon; sunset occurs in the late afternoon or evening.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A company that manufactures diesel generators releases a report claiming: 'Connecting homes to the national hydro-electric grid is unsafe; every family in Ghana should run a private diesel generator 24 hours a day.'",
    "question": "What source of bias makes this report untrustworthy?",
    "options": [
      "Diesel engines burn hydrocarbon fuel through compression ignition.",
      "Financial conflict of interest: the manufacturer profits directly from selling diesel generators and exaggerates grid hazards.",
      "The Akosombo Dam generates hydro-electric power on the Volta River.",
      "Generators produce exhaust fumes and mechanical noise."
    ],
    "correctAnswer": "Financial conflict of interest: the manufacturer profits directly from selling diesel generators and exaggerates grid hazards.",
    "explanation": "When a company stands to profit directly from the recommendation in its own report, commercial self-interest bias compromises objectivity.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "An apprentice carpenter tests 2 nails from a box of 5,000 nails, sees that neither is bent, and certifies: 'Zero nails in this entire 5,000-nail crate have manufacturing defects.'",
    "question": "Why is this quality-control guarantee unreliable?",
    "options": [
      "Nails can rust when exposed to oxygen and moisture.",
      "Iron nails are manufactured from drawn steel wire.",
      "Carpenters use hammers to drive nails into timber.",
      "Inspecting only 2 items out of 5,000 is far too small a sample to detect a 1% or 5% defect rate."
    ],
    "correctAnswer": "Inspecting only 2 items out of 5,000 is far too small a sample to detect a 1% or 5% defect rate.",
    "explanation": "A sample of N = 2 has virtually zero statistical power to detect defects across a batch of 5,000 items.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A bicycle was ridden away from the school shed across a muddy path toward the main gate. Investigators examine the overlapping tire tracks where the front and rear wheels turned a corner.",
    "question": "How can detectives tell which direction the bicycle was traveling?",
    "options": [
      "Mud is a mixture of clay, silt, and water.",
      "The rear wheel track cuts across and overwrites the front wheel track, and curves on a slightly tighter inner radius.",
      "All bicycles have exactly 36 spokes per wheel.",
      "Bicycle tires are inflated with compressed air."
    ],
    "correctAnswer": "The rear wheel track cuts across and overwrites the front wheel track, and curves on a slightly tighter inner radius.",
    "explanation": "Because the rear wheel trails behind the steering front wheel, its impression is laid down second (overprinting the front track) and follows a shorter turning arc.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "A fish farmer in Akosombo notices that on hot, cloudy, windless nights when green algae cover the pond surface, fish gasp at the water surface right before dawn (5:00 AM), but swim normally at 2:00 PM in the afternoon.",
    "question": "Why does dissolved oxygen drop to dangerous lows right before dawn?",
    "options": [
      "Fish only breathe oxygen before 6:00 AM.",
      "Sunlight turns water molecules into nitrogen gas at night.",
      "Algae sink to the bottom at night and push the fish upward.",
      "At night without sunlight, both the dense algae and the fish consume oxygen through cellular respiration without any photosynthesis producing oxygen."
    ],
    "correctAnswer": "At night without sunlight, both the dense algae and the fish consume oxygen through cellular respiration without any photosynthesis producing oxygen.",
    "explanation": "During the day, algal photosynthesis produces surplus oxygen; throughout the dark night, respiration by algae, bacteria, and fish steadily depletes dissolved O₂ until sunrise.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A cocoa farmer fermented beans under banana leaves from Monday 8:00 AM to Saturday 8:00 AM, sun-dried them on raised bamboo mats from Saturday 8:00 AM to Thursday 4:00 PM, and bagged them on Thursday at 5:00 PM. A sudden rainstorm soaked the beans while they were spread out on the bamboo mats.",
    "question": "During which stage of processing did the rainstorm strike?",
    "options": [
      "On Friday evening after the bags were sealed in the warehouse",
      "Between Saturday 8:00 AM and Thursday 4:00 PM during the sun-drying phase",
      "On Monday morning before fermentation started",
      "Between Monday and Friday while covered in fermentation heaps"
    ],
    "correctAnswer": "Between Saturday 8:00 AM and Thursday 4:00 PM during the sun-drying phase",
    "explanation": "The beans were spread on the raised bamboo drying mats exclusively between Saturday 8:00 AM and Thursday 4:00 PM.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Alibi Verification",
    "scenario": "A storehouse padlock in Tema was broken at 2:00 PM. Suspect Yao claims he was locked inside the walk-in freezer for three hours and that when he poured a cup of boiling water into a metal tray, it froze into solid ice in 10 seconds while the freezer thermometer read +15°C.",
    "question": "What physical contradiction proves Yao's story is fabricated?",
    "options": [
      "Tema is a major industrial port city in Greater Accra.",
      "Walk-in freezers have insulated walls.",
      "Metal trays conduct heat faster than plastic trays.",
      "Pure water freezes at 0°C at standard pressure; it cannot freeze into solid ice in an environment at +15°C."
    ],
    "correctAnswer": "Pure water freezes at 0°C at standard pressure; it cannot freeze into solid ice in an environment at +15°C.",
    "explanation": "At atmospheric pressure, liquid water cannot undergo phase change to solid ice when ambient temperature remains at +15°C.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A window pane in the ICT lab was shattered during the weekend. All the broken glass fragments are lying outside on the veranda pavement, and zero glass shards are inside the classroom.",
    "question": "What does the location of the glass fragments indicate?",
    "options": [
      "A bird flew into the window from outside in the yard.",
      "The force that broke the window came from inside the classroom pushing outward.",
      "Glass always falls toward the sun when broken.",
      "The window was made of tempered safety plastic."
    ],
    "correctAnswer": "The force that broke the window came from inside the classroom pushing outward.",
    "explanation": "Projectiles and blunt impacts propel the majority of broken glass shards forward in the direction of the applied force.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2009",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A school prefect wants to know whether students prefer football or basketball. He interviews only the 15 players standing on the basketball court after school and reports: '100% of students in our school prefer basketball!'",
    "question": "What sampling error ruined the prefect's survey?",
    "options": [
      "The survey was conducted in the afternoon instead of the morning.",
      "Basketballs are inflated to a higher pressure than footballs.",
      "Fifteen is an odd number.",
      "Selection bias: surveying only students actively playing on the basketball court guarantees a biased, non-random sample."
    ],
    "correctAnswer": "Selection bias: surveying only students actively playing on the basketball court guarantees a biased, non-random sample.",
    "explanation": "Sampling from a location directly tied to one of the survey choices introduces severe selection bias and excludes the rest of the student body.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-2010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "An electrician notices that when a 1,500-watt electric iron, a 2,000-watt kettle, and a 1,200-watt microwave are all plugged into a single 13-ampere extension board and switched on together, the circuit breaker immediately trips off.",
    "question": "Why did the circuit breaker trip?",
    "options": [
      "Electricity slows down when three plugs share one cord.",
      "The kettle boiled away the electrons in the wire.",
      "Connecting high-power appliances in parallel drew excessive total electric current that exceeded the safe limit of the circuit.",
      "The appliances cancelled out each other's magnetic fields."
    ],
    "correctAnswer": "Connecting high-power appliances in parallel drew excessive total electric current that exceeded the safe limit of the circuit.",
    "explanation": "In a parallel household circuit, total current is the sum of each appliance's current (4,700 W ÷ 230 V ≈ 20.4 A > 13 A), triggering the breaker to prevent wire overheating and fire.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2001",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "An auditor suspects a clerk of inventing fake daily expense receipts for a school canteen project. When the auditor plots the leading (first) digit of all 800 submitted receipts, digits 8 and 9 appear as the first digit on 65% of the receipts, while digit 1 appears on only 3%.",
    "question": "Which mathematical principle flags these receipts as likely fabricated?",
    "options": [
      "Newton's Third Law of Motion.",
      "Pythagoras's Theorem on right-angled triangles.",
      "Benford's Law (First-Digit Law), which states that in genuine financial datasets spanning multiple orders of magnitude, small leading digits like 1 and 2 occur far more often than 8 and 9.",
      "The Law of Conservation of Mass."
    ],
    "correctAnswer": "Benford's Law (First-Digit Law), which states that in genuine financial datasets spanning multiple orders of magnitude, small leading digits like 1 and 2 occur far more often than 8 and 9.",
    "explanation": "Human fabricators often cluster fake numbers just below reimbursement thresholds (e.g., 89 or 95 Cedis), violating Benford's logarithmic first-digit distribution.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2002",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A town committee has already spent 400,000 Cedis digging a borehole on solid granite rock where hydro-geologists have just proven there is zero underground water. A member argues: 'We must spend another 200,000 Cedis drilling deeper here, otherwise the first 400,000 Cedis was wasted!'",
    "question": "Which cognitive and logical fallacy is driving this argument?",
    "options": [
      "The Sunk Cost Fallacy (continuing a doomed endeavor because of unrecoverable past expenditures rather than future expected value)",
      "Appeal to Pity (Ad Misericordiam)",
      "False Cause (Post Hoc)",
      "Equivocation Fallacy"
    ],
    "correctAnswer": "The Sunk Cost Fallacy (continuing a doomed endeavor because of unrecoverable past expenditures rather than future expected value)",
    "explanation": "Past expenditures (sunk costs) cannot be recovered regardless of future action; rational decisions must evaluate only prospective costs and benefits.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2003",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "An environmental officer tests colorless gas bubbling from an improperly sealed biogas digester in Kumasi. Passing the gas through clear limewater (aqueous calcium hydroxide, Ca(OH)₂) turns the solution milky-white, and it extinguishes a burning splint.",
    "question": "Which gas is confirmed by the milky calcium carbonate (CaCO₃) precipitate?",
    "options": [
      "Oxygen (O₂)",
      "Hydrogen (H₂)",
      "Carbon dioxide (CO₂)",
      "Methane (CH₄)"
    ],
    "correctAnswer": "Carbon dioxide (CO₂)",
    "explanation": "Carbon dioxide reacts with aqueous calcium hydroxide to form insoluble white calcium carbonate (Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O).",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2004",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Epidemiological records from regional referral hospitals show that patients transported to the hospital by emergency ambulance have a higher mortality rate than patients who arrive on foot or by taxi.",
    "question": "Why is it an error to conclude that ambulances are dangerous to patients?",
    "options": [
      "Severity confounding (selection bias): critically injured or life-threatened patients are selectively transported by ambulance, whereas mild cases walk or take taxis.",
      "Hospitals treat taxi passengers before ambulance patients.",
      "Ambulance sirens raise patient blood pressure to fatal levels.",
      "Taxis travel faster than emergency ambulances."
    ],
    "correctAnswer": "Severity confounding (selection bias): critically injured or life-threatened patients are selectively transported by ambulance, whereas mild cases walk or take taxis.",
    "explanation": "Underlying condition severity is a confounding variable that determines both the mode of transport and survival probability.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2005",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A website with the URL 'ghana-education-ministry-free-grants.xyz' sends a WhatsApp link stating: 'All JHS students qualify for a 2,500-Cedi cash grant! Enter your mother's Mobile Money PIN within 10 minutes to claim!'",
    "question": "Which cybersecurity red flags identify this message as a phishing scam?",
    "options": [
      "WhatsApp uses end-to-end encryption for text messages.",
      "2,500 Cedis is an even number.",
      "Look-alike non-governmental domain (.xyz instead of .gov.gh), artificial time urgency, and requesting a secret Mobile Money PIN.",
      "The message mentions JHS students in Ghana."
    ],
    "correctAnswer": "Look-alike non-governmental domain (.xyz instead of .gov.gh), artificial time urgency, and requesting a secret Mobile Money PIN.",
    "explanation": "Legitimate government agencies in Ghana use '.gov.gh' domains and never request private Mobile Money PINs to disburse funds.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2006",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "After flipping a fair Pesewa coin 7 times in a row and getting Heads every time, a student bets his lunch money on Tails for the 8th flip, declaring: 'Tails is overdue so the coin is now 90% likely to land Tails!'",
    "question": "Which probability error did the student commit?",
    "options": [
      "The Gambler's Fallacy (believing independent random trials self-correct in the short run; a fair coin has no memory and remains 50% Heads, 50% Tails)",
      "Survivorship Bias",
      "Appeal to Authority",
      "Straw Man Fallacy"
    ],
    "correctAnswer": "The Gambler's Fallacy (believing independent random trials self-correct in the short run; a fair coin has no memory and remains 50% Heads, 50% Tails)",
    "explanation": "Coin tosses are statistically independent events; previous outcomes do not alter the 1/2 probability of the next toss.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2007",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A food safety inspector suspects a dishonest market vendor of adulterating palm oil with Sudan IV, a banned industrial textile dye, or starch thickeners. Adding a few drops of iodine solution to an aqueous extract of a food sample turns it an intense blue-black color.",
    "question": "Which macromolecule is confirmed by the blue-black iodine complex?",
    "options": [
      "Sodium chloride salt",
      "Simple reducing sugars like glucose",
      "Starch (amylose polysaccharide)",
      "Pure triglycerides (lipids)"
    ],
    "correctAnswer": "Starch (amylose polysaccharide)",
    "explanation": "Triiodide ions (I₃⁻) slip inside the helical coils of amylose starch molecules, forming a charge-transfer complex with an intense blue-black color.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2008",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A small workshop in Suame Magazine has 9 apprentices earning 1,000 Cedis per month each, and 1 workshop owner earning 91,000 Cedis per month. The owner boasts: 'The average worker here earns 10,000 Cedis a month!'",
    "question": "Why is the arithmetic mean misleading in this salary distribution?",
    "options": [
      "An extreme outlier (91,000 Cedis) skews the mean upward; the median salary of 1,000 Cedis accurately represents 90% of the workforce.",
      "Apprentices should not be counted as human beings.",
      "Monthly salaries cannot be measured in Ghana Cedis.",
      "100,000 divided by 10 was calculated incorrectly."
    ],
    "correctAnswer": "An extreme outlier (91,000 Cedis) skews the mean upward; the median salary of 1,000 Cedis accurately represents 90% of the workforce.",
    "explanation": "In heavily skewed distributions with extreme outliers, the arithmetic mean distorts typical values, whereas the median is robust against outliers.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2009",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "Kofi claims: 'No true Ghanaian dislikes fufu.' When Ama replies, 'My uncle was born in Accra, holds a Ghanaian passport, and prefers banku over fufu,' Kofi says: 'Well, then he isn't a TRUE Ghanaian!'",
    "question": "Which informal logical fallacy did Kofi commit?",
    "options": [
      "Slippery Slope Fallacy",
      "False Equivalence",
      "No True Scotsman Fallacy (redefining a category ad hoc to exclude a valid counterexample)",
      "Tu Quoque (Appeal to Hypocrisy)"
    ],
    "correctAnswer": "No True Scotsman Fallacy (redefining a category ad hoc to exclude a valid counterexample)",
    "explanation": "Shifting the definition of group membership arbitrarily to protect a universal claim from a clear counterexample is the No True Scotsman fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-2010",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Longitudinal school records across 50 districts show that basic school pupils with larger shoe sizes score significantly higher on standardized English reading comprehension tests than pupils with smaller shoe sizes.",
    "question": "What confounding variable explains this statistical correlation?",
    "options": [
      "Shoe manufacturers print vocabulary lists inside larger shoes.",
      "Child chronological age and grade level: older pupils naturally have larger feet and more years of reading instruction.",
      "Tight shoes restrict blood flow to the brain's language center.",
      "Reading English textbooks causes foot bones to grow faster."
    ],
    "correctAnswer": "Child chronological age and grade level: older pupils naturally have larger feet and more years of reading instruction.",
    "explanation": "Age is a confounding variable that independently drives physical growth (shoe size) and cumulative schooling (reading score).",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3001",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "Ama's lunch box is missing from her bag. She sees crumbs on Kofi's desk and a banana peel in the bin. Kofi says he did not take it.",
    "question": "What is the most likely clue that Kofi took the lunch?",
    "options": [
      "Kofi's denial",
      "Ama's empty bag",
      "The crumbs on Kofi's desk",
      "The banana peel in the bin"
    ],
    "correctAnswer": "The crumbs on Kofi's desk",
    "explanation": "Crumbs on Kofi's desk suggest he was eating something there. The banana peel could be from anyone, and denial is not evidence.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3002",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "The classroom floor is wet near the window. The window is open. It rained last night.",
    "question": "What is the most likely cause of the wet floor?",
    "options": [
      "Rain came through the open window",
      "A pipe burst",
      "Someone spilled water",
      "The floor is sweating"
    ],
    "correctAnswer": "Rain came through the open window",
    "explanation": "The open window and recent rain strongly suggest rain came in. Other options are less likely given the evidence.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3003",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Yaw says, 'Mangoes are the best fruit in the world.' Ama says, 'Mangoes are sweet.'",
    "question": "Which statement is an opinion?",
    "options": [
      "Mangoes are sweet.",
      "Mangoes are fruits.",
      "Mangoes are the best fruit in the world.",
      "Mangoes grow on trees."
    ],
    "correctAnswer": "Mangoes are the best fruit in the world.",
    "explanation": "'Best' is a matter of personal preference, so it is an opinion. 'Sweet' can be tested, so it is more factual.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3004",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Timeline Check",
    "scenario": "Kwame says he saw a rainbow at noon on a sunny day with no rain. His friend says that is impossible.",
    "question": "Why might Kwame's story be unlikely?",
    "options": [
      "Rainbows only appear after rain or with water droplets in the air",
      "Rainbows are always red",
      "Rainbows cannot be seen by children",
      "Rainbows only appear at night"
    ],
    "correctAnswer": "Rainbows only appear after rain or with water droplets in the air",
    "explanation": "Rainbows need water droplets and sunlight. On a sunny day with no rain, there may be no droplets to make a rainbow.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3005",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Alibi Verification",
    "scenario": "Adwoa says she was at the library all afternoon. The librarian says the library was closed all afternoon.",
    "question": "What does this tell us about Adwoa's alibi?",
    "options": [
      "Adwoa was at the library",
      "Her alibi is true",
      "Her alibi is false",
      "The librarian is lying"
    ],
    "correctAnswer": "Her alibi is false",
    "explanation": "If the library was closed, Adwoa could not have been there. Her alibi is contradicted by the librarian.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3006",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Bias Hunter",
    "scenario": "A advertisement says, 'All children love our new candy!'",
    "question": "Why is this claim biased?",
    "options": [
      "It makes a general claim without evidence",
      "It is too short",
      "It uses big words",
      "It is about candy"
    ],
    "correctAnswer": "It makes a general claim without evidence",
    "explanation": "Saying 'all children' is a sweeping statement that cannot be proven. It is biased because it is trying to sell a product.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3007",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Forensic Observation",
    "scenario": "A window is broken from the outside. Glass is found on the outside ground. The inside floor has no glass.",
    "question": "What does the glass pattern suggest?",
    "options": [
      "The window was not broken",
      "The glass was placed there",
      "The window was broken from the outside",
      "The window was broken from the inside"
    ],
    "correctAnswer": "The window was broken from the outside",
    "explanation": "When glass breaks, it falls on the side of the force. Glass outside means the force came from outside.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3008",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Cause & Effect",
    "scenario": "A plant near the window is leaning towards the window. The window lets in sunlight.",
    "question": "Why is the plant leaning?",
    "options": [
      "It is growing towards the light",
      "It is sick",
      "It is trying to escape",
      "The wind pushed it"
    ],
    "correctAnswer": "It is growing towards the light",
    "explanation": "Plants grow towards light, a process called phototropism. The plant leans towards the window to get more sunlight.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3009",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Fact vs. Opinion",
    "scenario": "Ama says, 'The sky is blue.' Kofi says, 'The sky is beautiful.'",
    "question": "Which is a fact?",
    "options": [
      "The sky is beautiful.",
      "The sky is the best.",
      "The sky is blue.",
      "The sky is boring."
    ],
    "correctAnswer": "The sky is blue.",
    "explanation": "The color of the sky can be observed and measured. Beauty is an opinion.",
    "isCentral": true
  },
  {
    "id": "tt-case-nov-3010",
    "targetGroup": "Novice (Basic 1-3)",
    "caseType": "Clue Observation",
    "scenario": "A teacher's pen is missing. She sees ink on Yaw's fingers and a pen cap under his chair.",
    "question": "What is the most likely clue that Yaw has the pen?",
    "options": [
      "The teacher is angry",
      "Ink on his fingers and a pen cap under his chair",
      "The pen is blue",
      "Yaw is sitting quietly"
    ],
    "correctAnswer": "Ink on his fingers and a pen cap under his chair",
    "explanation": "Ink on fingers and a pen cap nearby are strong physical clues linking Yaw to the pen.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Sample Size Trap",
    "scenario": "A company claims, '9 out of 10 dentists recommend our toothpaste!' The survey was given to 10 dentists at a company event.",
    "question": "What is the flaw in this claim?",
    "options": [
      "The sample size is too small",
      "Dentists do not use toothpaste",
      "The survey was too long",
      "The company is not real"
    ],
    "correctAnswer": "The sample size is too small",
    "explanation": "A sample of 10 is too small to represent all dentists. The result is not reliable.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Correlation vs. Causation",
    "scenario": "Ice cream sales and drowning incidents both increase in summer. A newspaper says ice cream causes drowning.",
    "question": "What is the error in this reasoning?",
    "options": [
      "Drowning is not real",
      "Summer does not exist",
      "Correlation does not imply causation",
      "Ice cream is dangerous"
    ],
    "correctAnswer": "Correlation does not imply causation",
    "explanation": "Both increase in summer because more people swim and eat ice cream. The heat is the underlying cause.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Fake News Spotter",
    "scenario": "A viral post says, 'Scientists discover that eating gari every day makes you taller.' The post has no source.",
    "question": "Why should you be suspicious of this post?",
    "options": [
      "It has no credible source or evidence",
      "Taller people do not eat gari",
      "Gari is not real",
      "Scientists do not exist"
    ],
    "correctAnswer": "It has no credible source or evidence",
    "explanation": "Claims without sources or evidence are often fake. Real scientific discoveries are published and reviewed.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Logical Fallacy",
    "scenario": "Kofi says, 'If you do not agree with me, you are stupid.'",
    "question": "What logical fallacy is Kofi using?",
    "options": [
      "False dilemma",
      "Slippery slope",
      "Ad hominem (attacking the person)",
      "Appeal to authority"
    ],
    "correctAnswer": "Ad hominem (attacking the person)",
    "explanation": "Kofi attacks the person instead of the argument. This is an ad hominem fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Forensic Observation",
    "scenario": "A footprint is found in soft mud near a broken window. The print is deep at the heel and shallow at the toe.",
    "question": "What does the footprint suggest about the person's movement?",
    "options": [
      "The person was running",
      "The person was walking backwards",
      "The person was crawling",
      "The person was standing still"
    ],
    "correctAnswer": "The person was running",
    "explanation": "A deeper heel print suggests the person was pushing off, which happens when running.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Timeline Check",
    "scenario": "A suspect says he was at a movie from 7 pm to 9 pm. The movie ticket shows 7 pm, but the cinema closed at 8 pm that day.",
    "question": "What is wrong with the suspect's alibi?",
    "options": [
      "The suspect was at home",
      "The movie was too short",
      "The cinema was closed before the movie ended",
      "The ticket is fake"
    ],
    "correctAnswer": "The cinema was closed before the movie ended",
    "explanation": "If the cinema closed at 8 pm, the suspect could not have been there until 9 pm. His alibi is false.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Bias Hunter",
    "scenario": "A news article says, 'Our city is the cleanest in Ghana!' The article is sponsored by the city's waste management company.",
    "question": "Why might this article be biased?",
    "options": [
      "The sponsor has a financial interest in the claim",
      "The article is too short",
      "The city is not real",
      "Waste management is not important"
    ],
    "correctAnswer": "The sponsor has a financial interest in the claim",
    "explanation": "The waste management company benefits from a positive image, so the claim may be exaggerated.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Misleading Statistics",
    "scenario": "A school claims, 'Our students score 20% higher on average!' But they only count students who passed the entrance exam.",
    "question": "What is misleading about this statistic?",
    "options": [
      "The exam was too easy",
      "The students did not study",
      "It only includes a select group of students",
      "The school is not real"
    ],
    "correctAnswer": "It only includes a select group of students",
    "explanation": "By only counting students who passed the entrance exam, the school excludes weaker students, making the average look better.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3009",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Cause & Effect",
    "scenario": "A village plants trees along the riverbank. The next year, the river is clearer and fish are more plentiful.",
    "question": "What is the most likely cause of the clearer river?",
    "options": [
      "The trees reduced soil erosion into the river",
      "The village stopped fishing",
      "The fish cleaned the river",
      "The river changed direction"
    ],
    "correctAnswer": "The trees reduced soil erosion into the river",
    "explanation": "Tree roots hold soil in place, preventing it from washing into the river. This keeps the water clearer.",
    "isCentral": true
  },
  {
    "id": "tt-case-app-3010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "caseType": "Logical Fallacy",
    "scenario": "Ama says, 'Everyone is buying this phone, so it must be the best.'",
    "question": "What fallacy is Ama using?",
    "options": [
      "False dilemma",
      "Straw man",
      "Slippery slope",
      "Bandwagon fallacy"
    ],
    "correctAnswer": "Bandwagon fallacy",
    "explanation": "Ama assumes that because many people do something, it is correct. This is the bandwagon fallacy.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3001",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Chemistry",
    "scenario": "A white powder is found at a crime scene. It dissolves in water and conducts electricity. When vinegar is added, bubbles form.",
    "question": "What type of substance is the powder most likely to be?",
    "options": [
      "An oil",
      "A sugar",
      "A metal",
      "A carbonate salt"
    ],
    "correctAnswer": "A carbonate salt",
    "explanation": "Carbonates react with acid (vinegar) to produce carbon dioxide bubbles. They also conduct electricity when dissolved.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3002",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Correlation vs. Causation",
    "scenario": "A study finds that students who eat breakfast get better grades. A school concludes that eating breakfast causes better grades.",
    "question": "What is a possible confounding variable?",
    "options": [
      "Breakfast is always healthy",
      "Students who eat breakfast may have more supportive home environments",
      "Grades are not important",
      "Students who skip breakfast are lazy"
    ],
    "correctAnswer": "Students who eat breakfast may have more supportive home environments",
    "explanation": "Supportive home environments could cause both breakfast eating and better grades. This is a confounding variable.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3003",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Misleading Statistics",
    "scenario": "A report says, 'Crime has doubled in our town!' The actual numbers went from 2 to 4 crimes per year.",
    "question": "Why is this statistic misleading?",
    "options": [
      "The town is too small",
      "The report is fake",
      "Crime is not real",
      "The absolute numbers are very small"
    ],
    "correctAnswer": "The absolute numbers are very small",
    "explanation": "While the rate doubled, the actual number of crimes is still very low. The percentage increase exaggerates the risk.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3004",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A politician says, 'Either you support my policy or you want the country to fail.'",
    "question": "What fallacy is this?",
    "options": [
      "Slippery slope",
      "False dilemma",
      "Ad hominem",
      "Appeal to authority"
    ],
    "correctAnswer": "False dilemma",
    "explanation": "The politician presents only two options when there are many other possibilities. This is a false dilemma.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3005",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Alibi Verification",
    "scenario": "A suspect claims he was in Kumasi at 3 pm. A photo on his phone shows a clock tower in Accra with a timestamp of 2:55 pm.",
    "question": "What does this evidence suggest?",
    "options": [
      "The suspect can travel very fast",
      "The photo is fake",
      "The clock tower is in Kumasi",
      "The suspect's alibi is false"
    ],
    "correctAnswer": "The suspect's alibi is false",
    "explanation": "If the photo shows Accra at 2:55 pm, the suspect could not be in Kumasi at 3 pm. His alibi is likely false.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3006",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Forensic Observation",
    "scenario": "A body is found in a room. Rigor mortis has set in completely. The room is warm.",
    "question": "What does rigor mortis suggest about the time of death?",
    "options": [
      "The person is still alive",
      "Death occurred several hours earlier",
      "The room temperature is irrelevant",
      "Death just occurred"
    ],
    "correctAnswer": "Death occurred several hours earlier",
    "explanation": "Rigor mortis takes several hours to fully develop. Its presence indicates the person died hours ago.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3007",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Sample Size Trap",
    "scenario": "A new drug is tested on 5 patients. All 5 recover. The company claims the drug is 100% effective.",
    "question": "Why is this claim unreliable?",
    "options": [
      "The company is not real",
      "The patients were not sick",
      "The drug is too expensive",
      "The sample size is too small"
    ],
    "correctAnswer": "The sample size is too small",
    "explanation": "A sample of 5 is too small to draw conclusions about effectiveness. Larger trials are needed.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3008",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Fake News Spotter",
    "scenario": "A news site reports that a local river has turned purple. The site has a history of posting sensational stories with no evidence.",
    "question": "What should you do before believing this story?",
    "options": [
      "Share it immediately",
      "Check for other credible sources",
      "Assume it is true",
      "Ignore all news"
    ],
    "correctAnswer": "Check for other credible sources",
    "explanation": "When a source has a history of sensationalism, you should verify the story with reliable sources before believing it.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3009",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Cause & Effect",
    "scenario": "A town installs streetlights. Reported crime rates drop by 30%. However, the town also hired more police at the same time.",
    "question": "What makes it difficult to conclude that streetlights caused the drop in crime?",
    "options": [
      "Crime is not real",
      "The town is too small",
      "Streetlights are expensive",
      "More police were also hired, which could be the cause"
    ],
    "correctAnswer": "More police were also hired, which could be the cause",
    "explanation": "The simultaneous hiring of more police is a confounding variable. It is unclear which factor caused the drop in crime.",
    "isCentral": true
  },
  {
    "id": "tt-case-sch-3010",
    "targetGroup": "Scholar (JHS)",
    "caseType": "Logical Fallacy",
    "scenario": "A student says, 'If we allow students to use phones in school, soon they will be playing games all day and no one will learn anything.'",
    "question": "What fallacy is the student using?",
    "options": [
      "False dilemma",
      "Ad hominem",
      "Slippery slope",
      "Bandwagon"
    ],
    "correctAnswer": "Slippery slope",
    "explanation": "The student assumes one action will lead to extreme consequences without evidence. This is a slippery slope fallacy.",
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
  },
  {
    "id": "tt-riddle-nov-601",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am bright yellow, warm the earth every day, and disappear into the west when bedtime arrives. What am I?",
    "hint1": "I shine in the blue sky.",
    "hint2": "Plants need my rays to grow.",
    "answer": "The sun",
    "acceptedKeywords": [
      "sun",
      "the sun",
      "sunlight"
    ],
    "explanation": "The sun is our solar system's central star, providing light and heat energy to Earth.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-602",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have 4 equal sides and 4 square corners. If you stretch me longer on two sides, I become a rectangle. What shape am I?",
    "hint1": "All my four sides have the same length.",
    "hint2": "A four-letter word.",
    "answer": "A square",
    "acceptedKeywords": [
      "square",
      "a square"
    ],
    "explanation": "A square is a regular quadrilateral with four equal sides and right angles.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-603",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has an eraser on its tail, graphite inside its wooden body, and writes spelling words in your exercise book?",
    "hint1": "You sharpen it when its point breaks.",
    "hint2": "It is made of wood.",
    "answer": "A pencil",
    "acceptedKeywords": [
      "pencil",
      "a pencil",
      "lead pencil"
    ],
    "explanation": "Pencils enclose graphite cores in wood casings used for writing and drawing.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-604",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am cold and solid, but if you leave me out in the hot afternoon sun, I melt into a puddle of liquid water. What am I?",
    "hint1": "I am kept in the freezer.",
    "hint2": "Frozen water.",
    "answer": "Ice",
    "acceptedKeywords": [
      "ice",
      "an ice cube",
      "ice cube"
    ],
    "explanation": "Ice is solid phase water that melts into liquid at temperatures above 0°C.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-605",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a heavy carved wooden stick. When paired with a wooden mortar, I pound boiled cassava and plantain into smooth fufu. What tool am I?",
    "hint1": "Held vertically with two hands.",
    "hint2": "Known in Akan as the Woma.",
    "answer": "A pestle (Woma)",
    "acceptedKeywords": [
      "pestle",
      "a pestle",
      "woma",
      "wooden pestle"
    ],
    "explanation": "A wooden pestle (woma) is paired with a mortar to pound boiled tubers into fufu.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-606",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What has teeth on a row, slides through your tangled hair after bathing, but never takes a single bite?",
    "hint1": "Found on the dressing table.",
    "hint2": "You groom your head with it.",
    "answer": "A comb",
    "acceptedKeywords": [
      "comb",
      "a comb",
      "hair comb"
    ],
    "explanation": "A comb uses a linear row of narrow teeth to detangle and groom hair.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-607",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "If Kofi has 8 mangoes and shares half of them with Ama, how many mangoes does Kofi keep?",
    "hint1": "Divide 8 by 2.",
    "hint2": "Half of 8.",
    "answer": "4 mangoes",
    "acceptedKeywords": [
      "4",
      "four",
      "4 mangoes",
      "four mangoes"
    ],
    "explanation": "8 / 2 = 4. Kofi retains four mangoes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-608",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I have roots deep underground, green leaves in the sky, and give shade to students on the compound. What am I?",
    "hint1": "Birds build nests in my branches.",
    "hint2": "I grow from a small seed.",
    "answer": "A tree",
    "acceptedKeywords": [
      "tree",
      "a tree",
      "trees"
    ],
    "explanation": "Trees are perennial woody vascular plants providing canopy shade and ecological habitat.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-609",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can you see in the middle of March and April that can never be seen at the beginning of either month?",
    "hint1": "Look at the letters spelling the words.",
    "hint2": "M-A-R-C-H and A-P-R-I-L.",
    "answer": "The letter R",
    "acceptedKeywords": [
      "r",
      "the letter r",
      "letter r"
    ],
    "explanation": "The letter 'R' sits in the interior of both 'March' and 'April'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-610",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has covers, pages full of stories, but cannot speak out loud until you read its words?",
    "hint1": "Kept in the library.",
    "hint2": "Made of paper sheets.",
    "answer": "A book",
    "acceptedKeywords": [
      "book",
      "a book",
      "storybook"
    ],
    "explanation": "A book binds printed or written paper pages between protective covers.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-611",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Wrapped in green plantain leaves, I am a steamed ball of fermented corn and cassava dough eaten with rich palm nut soup. What am I?",
    "hint1": "Popular across Ghanaian dining tables.",
    "hint2": "Begins with 'Ban-'.",
    "answer": "Banku",
    "acceptedKeywords": [
      "banku",
      "a ball of banku"
    ],
    "explanation": "Banku is a cooked fermented mixture of corn dough and cassava dough popular across Ghana.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-612",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "How many hours are there in one complete day and night cycle?",
    "hint1": "Twice twelve.",
    "hint2": "24.",
    "answer": "24 hours",
    "acceptedKeywords": [
      "24",
      "twenty-four",
      "24 hours",
      "twenty four hours"
    ],
    "explanation": "Earth's rotation completes one full solar cycle in 24 hours.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-613",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am an insect with colorful wings that drinks flower nectar. I began my life crawling as a hungry caterpillar. What am I?",
    "hint1": "I emerge from a chrysalis.",
    "hint2": "I fly from flower to flower.",
    "answer": "A butterfly",
    "acceptedKeywords": [
      "butterfly",
      "a butterfly"
    ],
    "explanation": "Butterflies are holometabolous insects undergoing complete metamorphosis from larval caterpillars.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-614",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What gets wetter the more it dries your wet hands after washing?",
    "hint1": "Made of cotton cloth.",
    "hint2": "Hung on the bathroom rail.",
    "answer": "A towel",
    "acceptedKeywords": [
      "towel",
      "a towel",
      "bath towel"
    ],
    "explanation": "Towels absorb water molecules from skin, increasing in moisture content as the user dries.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-615",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has four sturdy legs, a flat wooden seat, and lets you rest when you sit down at your school desk?",
    "hint1": "Pairs with a desk.",
    "hint2": "You sit on it.",
    "answer": "A chair",
    "acceptedKeywords": [
      "chair",
      "a chair",
      "stool",
      "a stool"
    ],
    "explanation": "A chair is a piece of furniture designed to support an individual in a seated position.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-601",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the green pigment located within plant chloroplasts that absorbs sunlight to drive the process of photosynthesis. What chemical pigment am I?",
    "hint1": "Gives plant leaves their green appearance.",
    "hint2": "Starts with 'Chloro-'.",
    "answer": "Chlorophyll",
    "acceptedKeywords": [
      "chlorophyll",
      "chlorophyll pigment"
    ],
    "explanation": "Chlorophyll absorbs blue and red wavelengths while reflecting green light during photosynthesis.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-602",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a fence, symbolizing security, safety, and the protective love of home. What Akan symbol am I?",
    "hint1": "Ban means fence or wall.",
    "hint2": "Eban.",
    "answer": "Eban",
    "acceptedKeywords": [
      "eban",
      "the eban symbol",
      "eban symbol"
    ],
    "explanation": "Eban (the fence) represents security, safety, and domestic harmony in Akan culture.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-603",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the name of a polygon that has exactly six straight sides and six interior angles?",
    "hint1": "Bees build honeycombs using this shape.",
    "hint2": "Prefix 'Hexa-' means six.",
    "answer": "A hexagon",
    "acceptedKeywords": [
      "hexagon",
      "a hexagon"
    ],
    "explanation": "A hexagon is a 6-sided polygon whose interior angles sum to 720 degrees.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-604",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the atmospheric gas layer in the stratosphere that absorbs harmful ultraviolet (UV) radiation from the sun, protecting life on Earth. What triatomic molecule am I?",
    "hint1": "Composed of three oxygen atoms (O₃).",
    "hint2": "Ozone...",
    "answer": "The ozone layer (Ozone)",
    "acceptedKeywords": [
      "ozone",
      "ozone layer",
      "the ozone layer",
      "o3"
    ],
    "explanation": "Stratospheric ozone (O₃) absorbs biologically damaging UVB radiation from the sun.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-605",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am an English word of 5 letters. If you remove my first letter, I become an organ of hearing. What word am I?",
    "hint1": "Hearing organ: EAR.",
    "hint2": "Starts with H and ends with D (H-E-A-R-D).",
    "answer": "Heard (or Heart)",
    "acceptedKeywords": [
      "heard",
      "heart"
    ],
    "explanation": "Removing the letter 'H' from 'HEARD' or 'HEART' leaves 'EAR' as a component base.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-606",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A father and son are in a vehicle accident. The father is unhurt, but the son needs immediate surgery. In the hospital theater, the surgeon exclaims: 'I cannot operate on this boy, he is my son!' Who is the surgeon?",
    "hint1": "Think about parental roles.",
    "hint2": "The surgeon is the boy's other parent.",
    "answer": "The boy's mother",
    "acceptedKeywords": [
      "his mother",
      "the mother",
      "mother",
      "the boy's mother"
    ],
    "explanation": "The surgeon is the boy's mother, challenging unconscious occupational gender stereotypes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-607",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am the sprawling, historic open-air market located in central Kumasi, known as one of the largest single market centers in West Africa. What market am I?",
    "hint1": "Located in the Ashanti Region.",
    "hint2": "Kejetia...",
    "answer": "Kejetia Market",
    "acceptedKeywords": [
      "kejetia",
      "kejetia market",
      "kumasi central market"
    ],
    "explanation": "Kejetia Market in Kumasi is a massive commercial trade hub in West Africa.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-608",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the organ in the human digestive system that secretes hydrochloric acid and gastric juices to digest proteins. What muscular organ am I?",
    "hint1": "Located between the esophagus and small intestine.",
    "hint2": "Food churns inside me.",
    "answer": "The stomach",
    "acceptedKeywords": [
      "stomach",
      "the stomach",
      "human stomach"
    ],
    "explanation": "The stomach breaks down food mechanically and enzymatically using pepsin and hydrochloric acid.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-609",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the perimeter of a regular square school garden whose side length is 15 meters?",
    "hint1": "Multiply side length by 4.",
    "hint2": "15 × 4.",
    "answer": "60 meters",
    "acceptedKeywords": [
      "60",
      "60 meters",
      "60m",
      "sixty meters"
    ],
    "explanation": "Perimeter = 4s = 4 × 15 = 60 meters.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-610",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What building has thousands of stories, but not a single human resident living inside?",
    "hint1": "Books contain written stories.",
    "hint2": "A place where you borrow books.",
    "answer": "A library",
    "acceptedKeywords": [
      "library",
      "a library",
      "bookstore"
    ],
    "explanation": "A library houses thousands of written literary stories on its shelves.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-611",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "What can travel all the way around the entire globe while remaining stuck in one tiny corner of an envelope?",
    "hint1": "You lick it and stick it on mail.",
    "hint2": "A postal item.",
    "answer": "A postage stamp",
    "acceptedKeywords": [
      "stamp",
      "a stamp",
      "postage stamp",
      "a postage stamp"
    ],
    "explanation": "A postage stamp stays affixed to an envelope's corner while circulating across the world.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-612",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the negatively charged subatomic particle that orbits outside the atomic nucleus in probabilistic electron clouds. What am I?",
    "hint1": "My electric flow produces electric current.",
    "hint2": "Discovered by J.J. Thomson.",
    "answer": "An electron",
    "acceptedKeywords": [
      "electron",
      "an electron",
      "electrons"
    ],
    "explanation": "Electrons are elementary leptons carrying negative charge that orbit atomic nuclei.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-613",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am the highest free-standing mountain peak in Ghana, located along the eastern border near the town of Liati Wote. What mountain peak am I?",
    "hint1": "Located in the Volta Region.",
    "hint2": "Mount Afad...",
    "answer": "Mount Afadja (Afadjato)",
    "acceptedKeywords": [
      "afadjato",
      "mount afadja",
      "mount afadjato",
      "afadja"
    ],
    "explanation": "Mount Afadjato stands 885 meters tall in the Agumatsa Range near the Togo border.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-614",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the mode of the numbers 4, 7, 4, 9, 2, 4, and 7?",
    "hint1": "The mode is the number that appears most frequently.",
    "hint2": "Count how many times 4 appears.",
    "answer": "4",
    "acceptedKeywords": [
      "4",
      "number 4",
      "four"
    ],
    "explanation": "The number 4 occurs three times, which is more frequent than any other value in the dataset.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-615",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has hands that wave continuously back and forth, but never has fingers or gloves?",
    "hint1": "Mounted on a car windshield.",
    "hint2": "Cleans rainwater off glass.",
    "answer": "Windshield wipers",
    "acceptedKeywords": [
      "windshield wipers",
      "wipers",
      "wiper"
    ],
    "explanation": "Windshield wipers use mechanical arms to clear rainwater off vehicle glass.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-601",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the SI base unit of electrical current, defined by taking the fixed numerical value of elementary charge e. What unit am I?",
    "hint1": "Named after André-Marie...",
    "hint2": "Symbolized by 'A'.",
    "answer": "The ampere (amp)",
    "acceptedKeywords": [
      "ampere",
      "amp",
      "amps",
      "the ampere"
    ],
    "explanation": "The ampere is the SI fundamental base unit for measuring electric current flow.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-602",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "What is the solution for x in the algebraic linear equation 3x + 15 = 45?",
    "hint1": "Subtract 15 from 45, then divide by 3.",
    "hint2": "3x = 30.",
    "answer": "10",
    "acceptedKeywords": [
      "10",
      "ten",
      "x = 10",
      "x=10"
    ],
    "explanation": "3x = 45 - 15 = 30, so x = 30 / 3 = 10.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-603",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the metabolic cycle taking place inside the mitochondrial matrix that oxidizes acetyl-CoA into carbon dioxide, generating NADH and FADH₂. What cycle am I?",
    "hint1": "Also known as the Citric Acid Cycle.",
    "hint2": "Named after Hans...",
    "answer": "The Krebs cycle (Citric Acid Cycle)",
    "acceptedKeywords": [
      "krebs cycle",
      "citric acid cycle",
      "krebs",
      "the krebs cycle"
    ],
    "explanation": "The Krebs cycle produces reducing equivalents that drive oxidative phosphorylation in aerobic organisms.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-604",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 19th-century Ashanti king who was exiled to Seychelles by British colonial forces in 1896 before returning to Kumasi in 1924. Who was I?",
    "hint1": "Ruler of the Ashanti nation.",
    "hint2": "Prempeh...",
    "answer": "Asantehene Prempeh I",
    "acceptedKeywords": [
      "prempeh i",
      "asantehene prempeh i",
      "king prempeh i",
      "prempeh"
    ],
    "explanation": "Otumfuo Prempeh I was exiled following the Anglo-Ashanti conflicts and repatriated to Kumasi in 1924.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-605",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "You have a balance scale and 9 identical-looking gold nuggets. One nugget is counterfeit and slightly heavier than the other 8. What is the minimum number of balance weighings to guarantee finding it?",
    "answer": "2 weighings",
    "explanation": "Divide the 9 nuggets into three groups of 3. Weigh group 1 against group 2 to isolate the heavy set of 3, then weigh one against another from that set.",
    "hint1": "Divide the 9 into three groups of 3.",
    "hint2": "Each balance test has three outcomes: left, right, or equal.",
    "acceptedKeywords": [
      "2",
      "two",
      "2 weighings",
      "two weighings"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-606",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the gas law stating that at constant temperature, the volume of a given mass of gas is inversely proportional to its pressure (P₁ V₁ = P₂ V₂). What law am I?",
    "hint1": "Named after Anglo-Irish chemist Robert...",
    "hint2": "Boyle's...",
    "answer": "Boyle's Law",
    "acceptedKeywords": [
      "boyle's law",
      "boyles law",
      "boyle law"
    ],
    "explanation": "Boyle's Law describes inverse pressure-volume relationships for ideal gases at constant temperature.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-607",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a 10-letter English word that can be typed using only the top row of letters on a standard QWERTY computer keyboard. I name a mechanical machine with keys that strike an inked ribbon onto paper. What word am I?",
    "hint1": "All 10 letters (T-Y-P-E-W-R-I-T-E-R) sit on the top Q-W-E-R-T-Y-U-I-O-P keyboard row.",
    "hint2": "Authors and secretaries typed letters on me before computers.",
    "answer": "Typewriter",
    "acceptedKeywords": [
      "typewriter",
      "a typewriter"
    ],
    "explanation": "'Typewriter' is the classic 10-letter English word formed entirely from letters on the top row of a QWERTY keyboard.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-608",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In right-angled trigonometry, what is the tangent of a 45-degree angle (tan 45°)?",
    "hint1": "The opposite side equals the adjacent side in an isosceles right triangle.",
    "hint2": "Any non-zero value divided by itself.",
    "answer": "1",
    "acceptedKeywords": [
      "1",
      "one"
    ],
    "explanation": "Because opposite and adjacent sides are identical in a 45°-45°-90° triangle, tan 45° = 1.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-609",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A container contains 100 liters of milk. 10 liters are removed and replaced with water. Then 10 liters of the mixture are removed and replaced with water. How many liters of pure milk remain?",
    "answer": "81 liters",
    "explanation": "First step leaves 90 L of milk. Second step removes 10% of remaining milk (9 L), leaving 90 - 9 = 81 liters.",
    "hint1": "The second removal draws from a diluted mixture.",
    "hint2": "100 × (0.9) × (0.9).",
    "acceptedKeywords": [
      "81",
      "81 liters",
      "81l",
      "eighty-one"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-610",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the thermodynamic law stating that energy cannot be created or destroyed, only transformed from one form into another. Which law of thermodynamics am I?",
    "hint1": "Conservation of energy.",
    "hint2": "It is the first law.",
    "answer": "The First Law of Thermodynamics",
    "acceptedKeywords": [
      "first law of thermodynamics",
      "first law",
      "1st law of thermodynamics",
      "law of conservation of energy"
    ],
    "explanation": "The First Law states that change in internal energy equals heat added minus work done (ΔU = Q - W).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-611",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 19th-century Ghanaian scholar and philosopher from Anomabu who declared: 'Only the best is good enough for Africa' and co-founded Achimota College. Who was I?",
    "hint1": "Known as the educational pioneer Dr. Kwegyir...",
    "hint2": "Aggrey of Africa.",
    "answer": "Dr. James Kwegyir Aggrey",
    "acceptedKeywords": [
      "james kwegyir aggrey",
      "kwegyir aggrey",
      "dr aggrey",
      "aggrey"
    ],
    "explanation": "Dr. James Kwegyir Aggrey was a pioneering Ghanaian educator who advocated higher education and racial harmony.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-612",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "What is the perimeter of a circle called in geometry, calculated by the formula 2π r?",
    "hint1": "The boundary distance around a circle.",
    "hint2": "Starts with 'Circum-'.",
    "answer": "The circumference",
    "acceptedKeywords": [
      "circumference",
      "the circumference"
    ],
    "explanation": "Circumference is the linear boundary distance enclosing a two-dimensional circular perimeter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-613",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the physiological process by which plants lose water vapor through microscopic stomata openings in their leaves. What process am I?",
    "hint1": "Creates a pulling tension drawing water up from roots.",
    "hint2": "Starts with 'Trans-'.",
    "answer": "Transpiration",
    "acceptedKeywords": [
      "transpiration",
      "evapotranspiration"
    ],
    "explanation": "Transpiration evaporates water through stomata, generating hydraulic tension that draws xylem sap from roots.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-614",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What single English word means 'to overlook or forgive an error' and also means 'to punish or officially penalize an action'?",
    "hint1": "Begins with 'San-'.",
    "hint2": "Trade embargoes are called this.",
    "answer": "Sanction",
    "acceptedKeywords": [
      "sanction",
      "sanctions"
    ],
    "explanation": "'Sanction' is a contronym meaning both to grant official authorization and to impose a penalty.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-615",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "You have a 4-minute hourglass and a 7-minute hourglass. How do you measure out exactly 9 minutes to time an experiment?",
    "answer": "Start both simultaneously; when the 4-minute glass drains, flip it (3 minutes remain in the 7-minute glass); when the 7-minute glass drains, flip it immediately, totaling 7 + 2 = 9 minutes when the 4-minute glass finishes its second run.",
    "explanation": "Start both (t=0). At t=4, flip the 4-min timer. At t=7, 1 minute remains in the 4-min timer; flip the 7-min timer immediately when the 4-min timer finishes at t=8 (having used 1 min), then flip the 7-min glass back for the remaining 1 minute, reaching 9 minutes total.",
    "hint1": "Track the difference remaining in the 7-minute glass when the 4-minute glass drains.",
    "hint2": "Flip timers when specific increments expire.",
    "acceptedKeywords": [
      "start both flip 4 min",
      "flip both at start",
      "hourglass combination",
      "9 minutes"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-701",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have no wings, but I drift across the blue sky. I weep when I grow heavy and water the farmer's crops. What am I?",
    "hint1": "I look like white or grey cotton wool above.",
    "hint2": "I bring rain when dark.",
    "answer": "A raincloud",
    "acceptedKeywords": [
      "raincloud",
      "cloud",
      "a cloud",
      "clouds",
      "rain cloud"
    ],
    "explanation": "Clouds collect condensed water vapor until precipitation falls as rain.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-702",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have two hands that point, but no fingers or arms. I have a round face with numbers from 1 to 12. What am I?",
    "hint1": "You look at me to check when break time begins.",
    "hint2": "I tick every second.",
    "answer": "A clock",
    "acceptedKeywords": [
      "clock",
      "a clock",
      "wall clock",
      "watch",
      "a watch"
    ],
    "explanation": "An analogue clock uses an hour hand, minute hand, and numbered dial to show time.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-703",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "The more you dry your wet hands with me after washing, the wetter and heavier I become. What am I?",
    "hint1": "Hung on the bathroom line to dry in the sun.",
    "hint2": "Made of soft cotton fabric.",
    "answer": "A towel",
    "acceptedKeywords": [
      "towel",
      "a towel",
      "bath towel"
    ],
    "explanation": "A towel absorbs moisture from your body; as you dry, the towel retains the water.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-704",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I sleep at night and rise in the east every morning. Without my warm rays, no plant can grow. What am I?",
    "hint1": "The brightest object in the daytime sky.",
    "hint2": "Provides light and warmth to Earth.",
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
    "id": "tt-riddle-nov-705",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "An ancient Ashanti riddle says: I follow your footsteps wherever the sun shines, but the moment you step into the dark room, I vanish. What am I?",
    "hint1": "A dark silhouette that mimics your movements.",
    "hint2": "Formed when your body blocks light.",
    "answer": "Your shadow",
    "acceptedKeywords": [
      "shadow",
      "a shadow",
      "my shadow",
      "the shadow"
    ],
    "explanation": "A shadow forms when an opaque object blocks light rays. In total darkness, no shadow can be cast.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-706",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am full of holes from top to bottom, yet I hold soapy water without spilling until you squeeze me. What am I?",
    "hint1": "Used for scrubbing during bath time.",
    "hint2": "Soft and porous.",
    "answer": "A sponge",
    "acceptedKeywords": [
      "sponge",
      "a sponge",
      "foam sponge"
    ],
    "explanation": "A porous sponge uses capillary action to hold liquid inside its air pockets.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-707",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "Feed me dry firewood and I grow bigger. Give me a drink of cool water and I die immediately. What am I?",
    "hint1": "Burns under cooking pots.",
    "hint2": "Hot, red, and yellow.",
    "answer": "Fire",
    "acceptedKeywords": [
      "fire",
      "a fire",
      "flame",
      "flames"
    ],
    "explanation": "Fire requires fuel, heat, and oxygen. Water cools the temperature below ignition and smothers the flame.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-708",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I carry my hard house on my back wherever I crawl. When danger comes, I pull in my head and four legs. What am I?",
    "hint1": "A slow-moving reptile.",
    "hint2": "Known in Akan as Akyekyede.",
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
    "id": "tt-riddle-nov-709",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "What is tall when it is young, but grows shorter and smaller as it works for you in the dark?",
    "hint1": "Has a cotton wick and wax body.",
    "hint2": "Melts down as it burns.",
    "answer": "A candle",
    "acceptedKeywords": [
      "candle",
      "a candle",
      "wax candle"
    ],
    "explanation": "A candle consumes wax as it burns, progressively reducing in height until extinguished.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-710",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have a spine, but no bones. I have many leaves, but no branches or roots. You open me to read. What am I?",
    "hint1": "Carried in your school bag.",
    "hint2": "Contains printed pages.",
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
    "id": "tt-riddle-nov-711",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I grow underground in pods. When roasted with salt, I am the traditional partner to roasted plantain (Kofi Brokeman). What seed am I?",
    "hint1": "Known also as peanut.",
    "hint2": "Nkate in Akan.",
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
    "id": "tt-riddle-nov-712",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "Forward I am a heavy metric weight of 1,000 kilograms, but backward I spell the word 'not'. What word am I?",
    "hint1": "A unit of mass.",
    "hint2": "Spell 'ton' in reverse.",
    "answer": "Ton",
    "acceptedKeywords": [
      "ton",
      "a ton"
    ],
    "explanation": "The word 'ton' spelled backward spells 'not'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-713",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I have no teeth to bite, but I eat away old iron gates left out in the rainy season. What reddish-brown flake am I?",
    "hint1": "Forms on wet iron.",
    "hint2": "Corrosion product.",
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
    "id": "tt-riddle-nov-714",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has one eye at its blunt end, cannot see a thing, and pulls thread through cloth?",
    "hint1": "Used by tailors.",
    "hint2": "Pointed steel needle.",
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
    "id": "tt-riddle-nov-715",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What begins with the letter 'P', ends with the letter 'E', and holds thousands of written letters inside?",
    "hint1": "A government facility for parcels.",
    "hint2": "Post Office.",
    "answer": "A post office",
    "acceptedKeywords": [
      "post office",
      "a post office",
      "post-office"
    ],
    "explanation": "The phrase 'Post Office' begins with P and ends with E, and the facility physically stores thousands of postal letters.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-701",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I expand when I freeze into solid form, unlike most other liquids that shrink. I float on my own liquid self. What substance am I?",
    "hint1": "Covers over 70% of Earth.",
    "hint2": "Chemical formula H₂O.",
    "answer": "Water",
    "acceptedKeywords": [
      "water",
      "ice",
      "liquid water",
      "h2o"
    ],
    "explanation": "Water expands upon freezing due to its open hexagonal hydrogen-bonded crystal lattice, making solid ice less dense than liquid water.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-702",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "An Akan proverb says: 'When the king of the forest falls, small birds make noise.' What mighty mammal with tusks roams Mole National Park?",
    "hint1": "The largest land mammal on Earth.",
    "hint2": "Esono in Akan.",
    "answer": "An elephant",
    "acceptedKeywords": [
      "elephant",
      "an elephant",
      "african elephant",
      "the elephant"
    ],
    "explanation": "The African bush elephant is the largest land mammal, holding keystone ecological dominance across savanna habitats.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-703",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am an odd number between 1 and 20. Remove one letter from my written name and I become completely even. What number am I?",
    "hint1": "Spell out 7.",
    "hint2": "Remove 'S' from 'SEVEN'.",
    "answer": "Seven",
    "acceptedKeywords": [
      "seven",
      "7",
      "number seven"
    ],
    "explanation": "The word 'SEVEN' minus the letter 'S' spells 'EVEN'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-704",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a silver transition metal that remains liquid at room temperature. Doctors once sealed me inside glass fever thermometers. What element am I?",
    "hint1": "Chemical symbol Hg.",
    "hint2": "Quicksilver.",
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
    "id": "tt-riddle-app-705",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What occurs once in every minute, twice in every moment, but never in one thousand years?",
    "hint1": "Look at the letters spelling the words.",
    "hint2": "The letter 'm'.",
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
    "id": "tt-riddle-app-706",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A farmer must cross the Volta River in a small canoe with a leopard, a goat, and cassava leaves. The canoe holds only the farmer and one item. What must he ferry across first?",
    "hint1": "The goat cannot be left alone with the leopard or the leaves.",
    "hint2": "Take the domestic animal across first.",
    "answer": "Take the goat across first",
    "acceptedKeywords": [
      "take the goat first",
      "take goat across first",
      "goat first",
      "the goat first"
    ],
    "explanation": "He crosses with the goat first, returns alone, takes the cassava across, brings the goat back, takes the leopard over, and returns to get the goat.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-707",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "In West African lore, I am the eight-legged master of wit, trickery, and web-spinning tales. What character am I?",
    "hint1": "My stories are called Anansesem.",
    "hint2": "Kweku...",
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
    "id": "tt-riddle-app-708",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the green pigment inside plant chloroplasts that traps light energy to power photosynthesis. What chemical pigment am I?",
    "hint1": "Reflects green wavelengths.",
    "hint2": "Starts with 'Chloro-'.",
    "answer": "Chlorophyll",
    "acceptedKeywords": [
      "chlorophyll",
      "chlorophil"
    ],
    "explanation": "Chlorophyll is the green pigment in chloroplasts that absorbs light energy to drive photosynthesis.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-709",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A snail at the bottom of a 10-meter pit climbs 3 meters up each day and slips 2 meters down each night. On which day does it reach the top?",
    "hint1": "Net gain is 1 meter per 24 hours.",
    "hint2": "On the final day, it climbs out before nightfall.",
    "answer": "The 8th day",
    "acceptedKeywords": [
      "8th day",
      "day 8",
      "8",
      "eight",
      "the 8th day"
    ],
    "explanation": "After 7 days and nights, it reaches 7 meters. On day 8, its 3-meter daytime climb reaches 10 meters, escaping before nightfall.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-710",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am pronounced as a single letter, written with three letters, and contain two identical vowels around a 'y'. I see all. What organ am I?",
    "hint1": "Organ of vision.",
    "hint2": "E-Y-E.",
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
    "id": "tt-riddle-app-711",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "Two mothers and two daughters sat down at a restaurant in Osu and ordered three bowls of jollof rice. Every person received their own full bowl. How was this possible?",
    "hint1": "Only three people were present.",
    "hint2": "Grandmother, mother, and daughter.",
    "answer": "A grandmother, mother, and daughter",
    "acceptedKeywords": [
      "grandmother mother daughter",
      "grandmother, mother and daughter",
      "three generations",
      "grandmother mother and daughter"
    ],
    "explanation": "The mother is both a daughter to the grandmother and a mother to the youngest girl, making two mothers and two daughters across three people.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-712",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the invisible geomagnetic shield around planet Earth that deflects charged solar wind particles into the polar auroras. What force field am I?",
    "hint1": "A magnetic compass needle aligns with my field lines.",
    "hint2": "Generated by swirling molten iron in the outer core.",
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
    "id": "tt-riddle-app-713",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Tetteh Quarshie brought my pods from Fernando Po to Mampong-Akuapem in 1879, founding Ghana's historic export industry. What tree crop am I?",
    "hint1": "Fermented beans make chocolate.",
    "hint2": "Kookoo in Akan.",
    "answer": "Cocoa",
    "acceptedKeywords": [
      "cocoa",
      "cacao",
      "cocoa bean",
      "cocoa tree"
    ],
    "explanation": "Tetteh Quarshie introduced cocoa pods to the Gold Coast in 1879, launching Ghana's cocoa sector.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-714",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "Which has more mass: one metric ton of dried cocoa beans or one metric ton of soft bird feathers?",
    "hint1": "Do not be distracted by density or size.",
    "hint2": "Both measure one metric ton.",
    "answer": "They weigh the exact same",
    "acceptedKeywords": [
      "same",
      "they weigh the same",
      "equal",
      "both weigh the same",
      "neither"
    ],
    "explanation": "Both quantities weigh exactly one metric ton (1,000 kilograms); mass is identical regardless of physical volume.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-715",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What runs continuously day and night without legs, murmurs without a tongue, and has a bed but never sleeps?",
    "hint1": "The Pra, Ankobra, and Volta are examples.",
    "hint2": "A natural freshwater waterway.",
    "answer": "A river",
    "acceptedKeywords": [
      "river",
      "a river",
      "stream",
      "a stream"
    ],
    "explanation": "A river has a riverbed and riverbanks, flows toward the sea, and makes natural rushing sounds.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-701",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the boundary surrounding a black hole where the escape velocity equals the speed of light. Cross me, and no photon can return. What am I?",
    "hint1": "Defined by the Schwarzschild radius.",
    "hint2": "Event...",
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
    "id": "tt-riddle-sch-702",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am an irrational mathematical constant. Divide any circle's circumference by its diameter, and you find me repeating endlessly without pattern. What am I?",
    "hint1": "Approximately 3.14159 or 22/7.",
    "hint2": "Represented by a Greek letter.",
    "answer": "Pi",
    "acceptedKeywords": [
      "pi",
      "π",
      "number pi"
    ],
    "explanation": "Pi (π) is the ratio of a circle's circumference to its diameter, proven to be a transcendental irrational number.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-703",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am an allotrope of pure carbon. Under high underground heat and pressure, my tetrahedral lattice became the hardest natural mineral on Mohs scale. What am I?",
    "hint1": "Rated a perfect 10 on Mohs scale.",
    "hint2": "Mined in places like Akwatia.",
    "answer": "Diamond",
    "acceptedKeywords": [
      "diamond",
      "a diamond",
      "diamonds"
    ],
    "explanation": "Diamond is composed of carbon bonded in a rigid tetrahedral lattice, making it the hardest natural mineral.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-704",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Carved from sacred Osese wood and encased in gold, Okomfo Anokye commanded me from the sky onto King Osei Tutu I's knees. What sacred royal throne am I?",
    "hint1": "Embodies the Sunsum of the Ashanti Kingdom.",
    "hint2": "Sika Dwa Kofi.",
    "answer": "The Golden Stool (Sika Dwa Kofi)",
    "acceptedKeywords": [
      "golden stool",
      "the golden stool",
      "sika dwa kofi",
      "sika dwa"
    ],
    "explanation": "Sika Dwa Kofi (The Golden Stool) is the sacred royal throne embodying the unified soul of the Ashanti Kingdom.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-705",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A boat floats in Tema Harbour with a rope ladder over the side. The rungs are 25 cm apart. At low tide, 4 rungs sit above the water. If high tide rises by 1 meter, how many rungs stay above water?",
    "hint1": "Does the floating boat rise with the tide?",
    "hint2": "Buoyancy keeps the relative position unchanged.",
    "answer": "Still 4 rungs",
    "acceptedKeywords": [
      "4",
      "4 rungs",
      "four",
      "four rungs",
      "still 4"
    ],
    "explanation": "Because the boat floats on the water's surface, it rises along with the tide. The relative position of the ladder rungs remains unchanged.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-706",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "Known as the powerhouse of eukaryotic cells, I generate ATP energy via the citric acid cycle and oxidative phosphorylation. What organelle am I?",
    "hint1": "Possesses its own circular DNA.",
    "hint2": "Mito...",
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
    "id": "tt-riddle-sch-707",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a five-letter word in English. If you remove my last four letters, I still sound exactly the same as my full name. What line of waiting people am I?",
    "hint1": "People wait in it at the bank.",
    "hint2": "Q-U-E-U-E.",
    "answer": "Queue",
    "acceptedKeywords": [
      "queue",
      "a queue"
    ],
    "explanation": "The word 'QUEUE' is pronounced identically to its initial letter 'Q'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-708",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In arithmetic, I am a natural number strictly greater than 1 that has no positive divisors other than 1 and myself. What type of number am I?",
    "hint1": "Examples: 2, 3, 5, 7, 11, 13.",
    "hint2": "Prime...",
    "answer": "A prime number",
    "acceptedKeywords": [
      "prime number",
      "prime",
      "a prime number",
      "primes"
    ],
    "explanation": "Prime numbers are integers greater than 1 whose only positive factors are 1 and the number itself.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-709",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A woman looks at a portrait on the wall and says: 'Brothers and sisters I have none, but this man's father is my father's son.' Whose portrait is she looking at?",
    "hint1": "Break down 'my father's son' when the speaker has no siblings.",
    "hint2": "The portrait depicts her child.",
    "answer": "Her son",
    "acceptedKeywords": [
      "her son",
      "son",
      "her own son"
    ],
    "explanation": "For an only child, 'my father's son' refers to the parent/speaker line, identifying the portrait as her son.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-710",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the quantum principle stating that one cannot simultaneously determine both the exact position and momentum of a subatomic particle. Whose principle am I?",
    "hint1": "Formulated by Werner...",
    "hint2": "Uncertainty principle.",
    "answer": "Heisenberg",
    "acceptedKeywords": [
      "heisenberg",
      "heisenberg's uncertainty principle",
      "werner heisenberg"
    ],
    "explanation": "Heisenberg's Uncertainty Principle sets a fundamental limit on the precision of simultaneous measurements of conjugate variables.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-711",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Built in 1965 to impound the Volta River, I formed the world's largest artificial reservoir by surface area and generate hydroelectricity for Ghana. What dam am I?",
    "hint1": "Located in the Eastern Region near Senchi.",
    "hint2": "Constructed under President Kwame Nkrumah.",
    "answer": "The Akosombo Dam",
    "acceptedKeywords": [
      "akosombo dam",
      "the akosombo dam",
      "akosombo",
      "volta dam"
    ],
    "explanation": "The Akosombo Dam impounds the Volta River, forming Lake Volta and generating hydroelectricity for Ghana.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-712",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "You have 12 identical-looking gold coins, but one is counterfeit with a slightly different weight. What is the minimum balance scale weighings needed to isolate it?",
    "hint1": "Divide into groups of 4 on the first weighing.",
    "hint2": "Each balance test provides 3 outcomes.",
    "answer": "3 weighings",
    "acceptedKeywords": [
      "3",
      "three",
      "3 weighings",
      "three weighings"
    ],
    "explanation": "With 3³ = 27 ternary decision paths, 3 weighings are sufficient to isolate the counterfeit coin and identify whether it is heavier or lighter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-713",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the physiological process where liquid water evaporates into water vapor through leaf stomata, generating transpirational pull from the roots. What am I?",
    "hint1": "Water loss through plant foliage.",
    "hint2": "Transpir...",
    "answer": "Transpiration",
    "acceptedKeywords": [
      "transpiration",
      "evapotranspiration"
    ],
    "explanation": "Transpiration is the evaporation of water from plant leaves through stomata, generating the transpirational pull that draws water from roots.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-714",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a 5-letter English word naming a lustrous gem formed inside an oyster shell. Remove my first and last letters and I become an organ of hearing. What word am I?",
    "hint1": "Formed inside oyster shells in the sea.",
    "hint2": "P-E-A-R-L contains E-A-R in the middle.",
    "answer": "Pearl",
    "acceptedKeywords": [
      "pearl",
      "a pearl"
    ],
    "explanation": "Removing 'P' and 'L' from 'PEARL' leaves 'EAR', the organ of hearing.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-715",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "Before two doors stand two guards: one always tells the truth, one always lies. You may ask ONE question to ONE guard to find the door to freedom. What do you ask?",
    "answer": "Ask which door the other guard would say leads to freedom",
    "hint1": "Force both guards to reference each other's response.",
    "hint2": "Choose the opposite door of what is named.",
    "acceptedKeywords": [
      "which door would the other guard say",
      "which door would the other guard choose",
      "what would the other guard say",
      "which door leads to freedom according to the other guard"
    ],
    "explanation": "Both guards will point to the prison door (the liar will lie about the truth-teller; the truth-teller will honestly report the lie). You take the opposite door.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-801",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a bright flash across the storm clouds. My light strikes the classroom window seconds before thunder rattles the roof. What am I?",
    "hint1": "Electrical discharge in the sky.",
    "hint2": "Thunder is my noisy partner.",
    "answer": "Lightning",
    "acceptedKeywords": [
      "lightning",
      "a lightning bolt",
      "lightning flash"
    ],
    "explanation": "Lightning is a massive electrostatic discharge between charged atmospheric regions or between a cloud and the ground.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-802",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am a perfectly round 2D shape with no corners and no straight edges. Coins, bicycle wheels, and the full moon share my shape. What am I?",
    "hint1": "Drawn using a pair of compasses.",
    "hint2": "All points are equal distance from my center.",
    "answer": "A circle",
    "acceptedKeywords": [
      "circle",
      "a circle"
    ],
    "explanation": "A circle is a 2D plane geometric curve consisting of all points equidistant from a central focal point.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-804",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am green in the tree canopy, turning yellow and brown when I dry up and flutter down to the soil. Plants breathe through my pores. What am I?",
    "hint1": "Photosynthesis takes place within me.",
    "hint2": "Branches carry thousands of me.",
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
    "id": "tt-riddle-nov-805",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a traditional drum shaped like an hourglass. When drummers squeeze my leather tension strings under their arm, my pitch rises and mimics the human voice. What am I?",
    "hint1": "Known as the talking drum.",
    "hint2": "Called Donno in Akan.",
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
    "id": "tt-riddle-nov-806",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What has zippers or buckles, carries exercise books and pencils upon your shoulders, but never reads a single word?",
    "hint1": "Strapped onto your back every morning.",
    "hint2": "School bag.",
    "answer": "A school bag (backpack)",
    "acceptedKeywords": [
      "school bag",
      "backpack",
      "a school bag",
      "bag",
      "a backpack"
    ],
    "explanation": "A school backpack is designed with straps to carry books and learning supplies.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-807",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have 3 straight sides and 3 pointed corners. If you measure my three inside angles, they always add up to 180 degrees. What shape am I?",
    "hint1": "Prefix 'Tri-' means three.",
    "hint2": "Triangle.",
    "answer": "A triangle",
    "acceptedKeywords": [
      "triangle",
      "a triangle"
    ],
    "explanation": "A triangle is a 3-sided polygon whose interior angles sum to 180 degrees.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-808",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am the bright orb in the night sky. Sometimes I am a thin silver crescent, and sometimes a round glowing ball. What am I?",
    "hint1": "Orbits planet Earth once every month.",
    "hint2": "Reflects sunlight at night.",
    "answer": "The moon",
    "acceptedKeywords": [
      "moon",
      "the moon",
      "lunar"
    ],
    "explanation": "The moon is Earth's only natural satellite, exhibiting cyclical phases as its illuminated hemisphere faces us.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-809",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a head and a tail, but no body, legs, or eyes, and can be flipped into the air to settle a decision?",
    "hint1": "Made of stamped metal.",
    "hint2": "A Pesewa coin.",
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
    "id": "tt-riddle-nov-810",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What can be heard by everyone across the compound, but can never be touched or picked up in your hand?",
    "hint1": "Acoustic sound vibrations.",
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
    "id": "tt-riddle-nov-811",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Prepared from fermented white corn dough and wrapped in dry cornhusks, I am the popular coastal meal eaten with hot pepper shito and fried fish. What am I?",
    "hint1": "Ga and Fante staple.",
    "hint2": "Kenkey.",
    "answer": "Kenkey",
    "acceptedKeywords": [
      "kenkey",
      "ga kenkey",
      "fante kenkey"
    ],
    "explanation": "Kenkey is a staple Ghanaian sourdough dumpling prepared from fermented cornmeal wrapped in dried cornhusks.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-813",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a feathered bird with a bright red comb upon my head. I flap my wings and crow loudly at dawn to wake the village. What am I?",
    "hint1": "Male domestic chicken.",
    "hint2": "Cock-a-doodle-doo.",
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
    "id": "tt-riddle-nov-814",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What breaks the very second you speak its name out loud in an empty classroom?",
    "hint1": "Libraries demand that you maintain it.",
    "hint2": "The total absence of sound.",
    "answer": "Silence",
    "acceptedKeywords": [
      "silence",
      "quiet",
      "quietness"
    ],
    "explanation": "The physical act of speaking generates sound vibrations, thereby breaking silence.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-815",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has hinges and a handle, swings open to let pupils into the classroom, and shuts to keep the rain out?",
    "hint1": "Knock on it before entering.",
    "hint2": "Fits inside a door frame.",
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
    "id": "tt-riddle-app-802",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a carved wooden comb, symbolizing feminine beauty, hygiene, and caring tenderness. What symbol am I?",
    "hint1": "Duafe in Akan.",
    "hint2": "Represents cleanliness and grooming.",
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
    "id": "tt-riddle-app-803",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the only 2D geometric shape where every point along its perimeter is at the exact same distance from its central point?",
    "hint1": "The fixed distance is called the radius.",
    "hint2": "Drawn with a compass.",
    "answer": "A circle",
    "acceptedKeywords": [
      "circle",
      "a circle"
    ],
    "explanation": "By definition, a circle is the locus of all coplanar points equidistant from a central origin.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-804",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the lowest temperature theoretically possible in the universe, where all thermal molecular kinetic motion ceases. What point am I on the Kelvin scale?",
    "hint1": "Corresponds to -273.15°C.",
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
    "id": "tt-riddle-app-805",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am an English word of six letters. Remove my final letter and twelve items remain. What word am I?",
    "hint1": "Twelve items make a dozen.",
    "hint2": "D-O-Z-E-N-S.",
    "answer": "Dozens",
    "acceptedKeywords": [
      "dozens",
      "the word dozens"
    ],
    "explanation": "Removing the letter 's' from 'dozens' leaves 'dozen', which represents the number twelve.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-806",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A girl kicks a football across a level compound. Without bouncing off any wall, fence, or obstacle, and without being touched by anyone, the ball rolls straight back to her feet. How?",
    "hint1": "Consider vertical trajectory.",
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
    "id": "tt-riddle-app-808",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the human sensory organ containing the cochlea, auditory nerve, and three tiny bones called the malleus, incus, and stapes. What am I?",
    "hint1": "Organ of hearing.",
    "hint2": "Maintains physical balance.",
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
    "id": "tt-riddle-app-809",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "What is the area of a rectangular school plot that measures 12 meters long and 8 meters wide?",
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
    "id": "tt-riddle-app-811",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man pushes his car up to a hotel in Accra and immediately shouts that he is completely bankrupt. He wasn't injured and his car works perfectly. How?",
    "answer": "He is playing the board game Monopoly",
    "explanation": "In the game of Monopoly, landing on an opponent's hotel property with your car token can cause financial bankruptcy.",
    "hint1": "Playing a board game with tokens.",
    "hint2": "Monopoly.",
    "acceptedKeywords": [
      "monopoly",
      "playing monopoly",
      "board game monopoly"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-812",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the dense core of an atom that contains protons and neutrons, packing nearly 99.9% of the atom's total mass. What am I?",
    "hint1": "Electrons orbit around me.",
    "hint2": "Discovered by Ernest Rutherford.",
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
    "id": "tt-riddle-app-813",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am Ghana's largest wildlife protected area, located near Damongo, where wild elephants, roan antelopes, and baboons roam the savanna. What national park am I?",
    "hint1": "Located in the Savannah Region.",
    "hint2": "Mole...",
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
    "id": "tt-riddle-app-815",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has planetary rings around its body, but no fingers to wear jewelry? I am a planet in our solar system!",
    "hint1": "Sixth planet from the sun.",
    "hint2": "Famous for icy rings.",
    "answer": "Saturn",
    "acceptedKeywords": [
      "saturn",
      "planet saturn"
    ],
    "explanation": "Saturn is encircled by an extensive planetary ring system of ice particles, rocky debris, and dust.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-801",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the constant in quantum physics relating a photon's energy to its electromagnetic wave frequency, denoted by h. What constant am I?",
    "hint1": "Value is approx 6.626 × 10⁻³⁴ J·s.",
    "hint2": "Planck's...",
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
    "id": "tt-riddle-sch-802",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In polynomial algebra, what is the discriminant formula for a quadratic equation ax² + bx + c = 0 that determines the nature of the roots?",
    "hint1": "Appears under the square root in the quadratic formula.",
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
    "id": "tt-riddle-sch-803",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the cellular reduction division that produces four genetically unique haploid gamete sex cells (sperm or egg). What cell division am I?",
    "hint1": "Mitosis produces two diploid cells; I produce four haploid cells.",
    "hint2": "Crossing over occurs in my Prophase I.",
    "answer": "Meiosis",
    "acceptedKeywords": [
      "meiosis",
      "meiotic division"
    ],
    "explanation": "Meiosis reduces chromosome ploidy from diploid (2n) to haploid (n), introducing genetic variation via independent assortment and recombination.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-804",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 19th-century Ashanti prince and diplomatic envoy who conducted sensitive negotiations with British envoys and documented early kingdom administrative treaties. Who was I?",
    "hint1": "A royal diplomat.",
    "hint2": "Prince John...",
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
    "id": "tt-riddle-sch-805",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A lightbulb sits inside a closed wooden box. Outside are three switches labeled 1, 2, and 3. Exactly one switch powers the bulb. You may open the box only ONCE. How do you find the switch?",
    "answer": "Turn Switch 1 ON for 10 minutes, turn it OFF, turn Switch 2 ON, and enter immediately: if lit, it is 2; if dark but warm, it is 1; if dark and cold, it is 3.",
    "hint1": "Lightbulbs generate both photons and thermal heat.",
    "hint2": "Leave one switch on long enough to heat the glass filament.",
    "acceptedKeywords": [
      "turn on switch 1 then switch 2",
      "turn switch 1 on feel heat",
      "heat",
      "feel the bulb",
      "bulb is warm"
    ],
    "explanation": "Using heat as a second physical indicator isolates the three possibilities across a single visual entry test.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-806",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the property of a fluid representing its internal resistance to shear flow and deformation. Honey has a high measure of me compared to water. What am I?",
    "hint1": "Measured in poise or pascal-seconds.",
    "hint2": "Colloquially called fluid thickness.",
    "answer": "Viscosity",
    "acceptedKeywords": [
      "viscosity",
      "fluid viscosity"
    ],
    "explanation": "Viscosity measures a fluid's internal friction resisting adjacent shearing layers from sliding past one another.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-807",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What 8-letter word begins with 'D-E-C', ends with 'I-O-N', and describes a cognitive conclusion reached after deliberating between options?",
    "hint1": "Judges deliver it.",
    "hint2": "D-E-C-I-S-I-O-N.",
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
    "id": "tt-riddle-sch-808",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "What is the logarithm of 10,000 to the base 10 (log₁₀ 10000)?",
    "hint1": "What power must 10 be raised to in order to equal 10,000?",
    "hint2": "10⁴ = 10000.",
    "answer": "4",
    "acceptedKeywords": [
      "4",
      "four"
    ],
    "explanation": "Because 10⁴ = 10,000, log₁₀(10000) = 4.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-809",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A beaker filled with water weighs 600 grams. When palm oil is added, it floats on top and total weight is 750 grams. If the beaker is dumped and filled entirely with palm oil, does it weigh more or less than 600 grams?",
    "answer": "It weighs less than 600 grams because oil is less dense than water.",
    "hint1": "Why does oil float on water?",
    "hint2": "Density of oil is approximately 0.9 g/cm³.",
    "acceptedKeywords": [
      "less",
      "less than 600 grams",
      "it weighs less",
      "weighs less"
    ],
    "explanation": "Because oil floats on water, its density is lower (approx 0.9 g/cm³ vs 1.0 g/cm³). The identical volume of oil weighs less than that volume of water.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-810",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the electrostatic law stating that the attractive or repulsive force between two charges is proportional to their product and inversely proportional to the square of their distance. What law am I?",
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
    "id": "tt-riddle-sch-811",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the first Prime Minister and President of Ghana who declared national independence in 1957 and co-founded the Organization of African Unity. Who was I?",
    "hint1": "Founder of the CPP.",
    "hint2": "His memorial park stands in Accra.",
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
    "id": "tt-riddle-sch-812",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In probability theory, what is the probability of rolling a total sum of 2 when rolling two standard six-sided dice?",
    "hint1": "Only one roll produces 2: (1, 1).",
    "hint2": "There are 36 total outcomes.",
    "answer": "1/36",
    "acceptedKeywords": [
      "1/36",
      "one out of 36",
      "1 in 36"
    ],
    "explanation": "Only one ordered pair (1,1) out of 36 possible outcomes yields a sum of 2, giving P = 1/36.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-813",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the gas that comprises roughly 78% of Earth's atmosphere by volume, diatomic in structure (N₂), and converted into nitrates by rhizobia bacteria in legume root nodules. What gas am I?",
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
    "id": "tt-riddle-sch-814",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a 7-letter English word that reads the exact same forward and backward, describing a fast racing vehicle. What palindrome am I?",
    "hint1": "Spelled: R-A-C-E-C-A-R.",
    "hint2": "Reverses to itself.",
    "answer": "Racecar",
    "acceptedKeywords": [
      "racecar",
      "a racecar"
    ],
    "explanation": "'Racecar' is a 7-letter palindrome that reads identically from left to right and right to left.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-815",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A wooden cube with side length 4 cm is painted red on all exterior faces, then cut into 64 small 1-cm cubes. How many of the small cubes have paint on exactly zero faces?",
    "answer": "8 small cubes",
    "explanation": "The unpainted interior core forms a smaller cube with dimensions (4 - 2) = 2 cm per side. Total unpainted cubes: 2³ = 8.",
    "hint1": "Calculate the dimensions of the unpainted inner core.",
    "hint2": "(4 - 2)³.",
    "acceptedKeywords": [
      "8",
      "8 cubes",
      "eight",
      "8 small cubes"
    ],
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-901",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I fall from storm clouds in millions of drops, but I never break a bone. I wash the dust off mango leaves and fill the rainwater barrel. What am I?",
    "hint1": "You hold an umbrella above your head when I arrive.",
    "hint2": "I am water falling from the sky.",
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
    "id": "tt-riddle-nov-902",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I have two steel legs joined at a hinge. One leg holds a pencil while the sharp metal point anchors down so I can spin and draw round circles. What am I?",
    "hint1": "Kept inside your geometry mathematical set.",
    "hint2": "Begins with the letter 'C'.",
    "answer": "A pair of compasses",
    "acceptedKeywords": [
      "compass",
      "a compass",
      "pair of compasses",
      "compasses",
      "drawing compass"
    ],
    "explanation": "A geometric compass consists of two hinged arms used to scribe circles and geometric arcs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-903",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has a row of teeth along its back, but never bites as it glides smoothly through your hair after a bath?",
    "hint1": "Used for grooming hair on the dressing table.",
    "hint2": "Made of plastic or carved wood.",
    "answer": "A comb",
    "acceptedKeywords": [
      "comb",
      "a comb",
      "hair comb"
    ],
    "explanation": "A comb uses a linear row of narrow teeth to detangle and groom hair without biting.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-904",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I have no wings, but I make leaves dance and dry clothes hung on the washing line. You can feel me against your cheeks, but you can never see me. What am I?",
    "hint1": "I turn the blades of wind turbines.",
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
    "id": "tt-riddle-nov-905",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "Carved from a solid tree trunk with a hollow heart, I pair with a heavy wooden pestle to pound boiled plantain and cassava into fufu. What am I?",
    "hint1": "Known in Akan as Waduro.",
    "hint2": "Pairs with a woma pestle.",
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
    "id": "tt-riddle-nov-906",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What gets wetter and wetter on its fabric canopy the more it protects you from a heavy tropical rainstorm?",
    "hint1": "You hold its curved handle above your head.",
    "hint2": "It opens and closes like a dome.",
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
    "id": "tt-riddle-nov-907",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am a 3D solid shape with 6 flat square faces, 8 sharp corners, and 12 straight edges. Roll me on a game board to play ludo! What am I?",
    "hint1": "Each of my faces has dots from 1 to 6.",
    "hint2": "A regular cube die.",
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
    "id": "tt-riddle-nov-908",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a yellow, crescent-shaped fruit with a soft peel. School pupils pack me for morning snack break, and my sweet white flesh has no seeds. What am I?",
    "hint1": "You peel my yellow skin before eating.",
    "hint2": "Grows in bunches called hands.",
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
    "id": "tt-riddle-nov-909",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can fill an entire school classroom from wall to wall without taking up a single centimeter of floor space?",
    "hint1": "Flip the electric switch on the wall.",
    "hint2": "The sun radiates it every morning.",
    "answer": "Light",
    "acceptedKeywords": [
      "light",
      "sunlight",
      "illumination",
      "electric light"
    ],
    "explanation": "Light radiates across an entire volume, illuminating the space without occupying mass or volume like physical matter.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-910",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I am tall when brand new on the teacher's table, but after writing many spelling words on the chalkboard, I am short and worn down. What am I?",
    "hint1": "Leaves white powder marks on black boards.",
    "hint2": "Made of soft mineral gypsum.",
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
    "id": "tt-riddle-nov-911",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Bound from dried palm branches, I sweep compound leaves and sand clean every morning when held in your hand. What broom am I?",
    "hint1": "Kept behind the door in Ghanaian homes.",
    "hint2": "Called Praye in Akan.",
    "answer": "A broom",
    "acceptedKeywords": [
      "broom",
      "a broom",
      "praye",
      "palm broom"
    ],
    "explanation": "Traditional brooms (praye) are assembled from bundles of dried palm-frond midribs to sweep dirt yards.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-912",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am the only number that cannot be represented by Roman numerals. When added to any number, that number stays exactly the same. What am I?",
    "hint1": "Represents having nothing.",
    "hint2": "Drawn as an oval ring.",
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
    "id": "tt-riddle-nov-913",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I live underground in garden soil, wriggling without eyes, bones, or legs. I swallow earth and turn it into rich compost for crops. What am I?",
    "hint1": "Surfaces on walking paths after rain.",
    "hint2": "Segmented garden annelid.",
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
    "id": "tt-riddle-nov-914",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has keys that cannot open a single wooden padlock, but can type letters and numbers onto a computer screen?",
    "hint1": "Used in the ICT computer lab.",
    "hint2": "Has a spacebar and enter key.",
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
    "id": "tt-riddle-app-901",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the biological transformation where an insect hatches from an egg as a caterpillar, enters a silent pupa stage, and emerges with colorful wings. What am I?",
    "hint1": "Experienced by butterflies and moths.",
    "hint2": "Begins with 'Meta-'.",
    "answer": "Metamorphosis",
    "acceptedKeywords": [
      "metamorphosis",
      "complete metamorphosis"
    ],
    "explanation": "Complete metamorphosis (holometabolism) is the four-stage developmental transition across insect life cycles.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-902",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Woven on narrow strip looms in Bonwire, Ashanti, my vibrant silk patterns of gold, green, and red were historically reserved for kings. What sacred cloth am I?",
    "hint1": "Traditional hand-woven strip textile.",
    "hint2": "Kente...",
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
    "id": "tt-riddle-app-903",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A basket holds 3 apples. How can they be divided equally among two fathers and two sons so that each person receives one whole apple?",
    "hint1": "Only three individuals are present.",
    "hint2": "Grandfather, father, and son.",
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
    "id": "tt-riddle-app-904",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a noble gas making up roughly 0.93% of Earth's atmosphere, making me more abundant than carbon dioxide. I react with virtually nothing. What element am I?",
    "hint1": "Atomic number 18.",
    "hint2": "Chemical symbol Ar.",
    "answer": "Argon",
    "acceptedKeywords": [
      "argon",
      "ar"
    ],
    "explanation": "Argon is the third most abundant gas in Earth's atmosphere (approx 0.934%), chemically inert with a complete valence shell.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-905",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a 5-letter word that sounds like a single letter. When you remove my last four letters, I still sound exactly the same. What waiting line am I?",
    "hint1": "People stand in me at the bank.",
    "hint2": "Q-U-E-U-E.",
    "answer": "Queue",
    "acceptedKeywords": [
      "queue",
      "a queue"
    ],
    "explanation": "The word 'QUEUE' is pronounced identically to its first letter 'Q'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-906",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A truck driver was driving down a one-way street the wrong direction in Kumasi. He passed three traffic police officers, but none of them stopped him. Why?",
    "hint1": "Was he operating the vehicle?",
    "hint2": "He was on foot.",
    "answer": "He was walking on foot",
    "acceptedKeywords": [
      "he was walking",
      "walking",
      "he was on foot",
      "on foot"
    ],
    "explanation": "One-way street vehicular restrictions apply to driving motor vehicles; pedestrians on foot may walk in either direction.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-907",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol depicting a mythical bird reaching backward to retrieve an egg from its tail. My proverb teaches: 'It is not a taboo to fetch that which you forgot.' What am I?",
    "hint1": "Symbol of historical learning.",
    "hint2": "Sankofa.",
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
    "id": "tt-riddle-app-908",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the paired organ in the human body that continuously filters metabolic urea and excess salts from blood to produce urine. What organ am I?",
    "hint1": "Shaped like kidney beans.",
    "hint2": "Contains nephron filtering units.",
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
    "id": "tt-riddle-app-909",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "If you multiply all the single-digit numbers together on the keypad of a standard mobile phone, what is the final numerical product?",
    "hint1": "Look at the digit at the bottom center of the keypad.",
    "hint2": "Any product multiplied by 0 equals...",
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
    "id": "tt-riddle-app-910",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "What English word retains the exact same pronunciation even when you take away four out of its five letters?",
    "hint1": "People stand in it at bus terminals.",
    "hint2": "Spelled: Q-U-E-U-E.",
    "answer": "Queue",
    "acceptedKeywords": [
      "queue",
      "a queue"
    ],
    "explanation": "Removing 'u-e-u-e' leaves the letter 'Q', maintaining the original phonetic sound.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-911",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "You walk into a pitch-dark room in Assin Foso during an electrical blackout with one matchstick. In the room is a kerosene lantern, a candle, and a wood stove. What must you ignite first?",
    "hint1": "You cannot light anything without flame.",
    "hint2": "What is in your hand?",
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
    "id": "tt-riddle-app-912",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the thick layer of semi-molten rock lying between the Earth's crust and outer core. Thermal convection currents within me slowly move tectonic plates. What am I?",
    "hint1": "Thickest geological layer of Earth.",
    "hint2": "Mantle.",
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
    "id": "tt-riddle-app-913",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Harvested from wild trees across the savanna in northern Ghana, my oily nuts are boiled, crushed, and churned into golden butter for cooking and skin moisturizing. What am I?",
    "hint1": "Known scientifically as Vitellaria paradoxa.",
    "hint2": "Nkuto in Akan.",
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
    "id": "tt-riddle-app-915",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has branches, leaves, and a trunk, but never drinks water or grows in soil? It illustrates your ancestral lineage!",
    "hint1": "Tracks grandparents, parents, and children.",
    "hint2": "Drawn on paper.",
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
    "id": "tt-riddle-sch-901",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the double-helix nucleic acid carrying genetic instructions in living cells, formed of four nucleotide bases: Adenine, Thymine, Guanine, and Cytosine. What am I?",
    "hint1": "Photo 51 by Rosalind Franklin helped reveal my structure.",
    "hint2": "DNA.",
    "answer": "DNA (Deoxyribonucleic acid)",
    "acceptedKeywords": [
      "dna",
      "deoxyribonucleic acid"
    ],
    "explanation": "DNA is the nucleic acid polymer that stores genetic instructions for development and functioning in living organisms.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-902",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "In right-angled triangle geometry, I state that the square of the hypotenuse equals the sum of the squares of the other two legs (a² + b² = c²). What theorem am I?",
    "hint1": "Named after an ancient Greek philosopher born on Samos.",
    "hint2": "Pythagoras...",
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
    "id": "tt-riddle-sch-903",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the thermodynamic measure of molecular disorder in a closed physical system. The Second Law of Thermodynamics states that I never decrease over time. What am I?",
    "hint1": "Symbolized by capital letter S.",
    "hint2": "ΔS ≥ 0.",
    "answer": "Entropy",
    "acceptedKeywords": [
      "entropy",
      "the entropy"
    ],
    "explanation": "Entropy represents the degree of unavailable thermodynamic energy and molecular disorder in a closed physical system.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-904",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I was the 14th-century ruler of the Mali Empire whose famous Hajj pilgrimage to Mecca in 1324 carried so much gold that it depreciated gold value in Cairo for a decade. Who was I?",
    "hint1": "Renowned as one of the wealthiest rulers in history.",
    "hint2": "Mansa...",
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
    "id": "tt-riddle-sch-905",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man walks five kilometers through Accra during a torrential downpour with no umbrella, hat, or coat. Every item of clothing was drenched, but not a single hair on his head got wet. How?",
    "hint1": "Look at the condition of his head.",
    "hint2": "He had no hair.",
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
    "id": "tt-riddle-sch-906",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the neutral subatomic nucleon with zero electric charge and a mass slightly greater than a proton. James Chadwick discovered me in 1932. What particle am I?",
    "hint1": "Resides with protons inside the atomic nucleus.",
    "hint2": "Neutron...",
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
    "id": "tt-riddle-sch-907",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "What 7-letter word contains thousands of written letters inside its belly?",
    "hint1": "Postal collection box.",
    "hint2": "M-A-I-L-B-O-X.",
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
    "id": "tt-riddle-sch-908",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a numerical sequence where each term is the sum of the two preceding terms: 0, 1, 1, 2, 3, 5, 8, 13... What mathematical sequence am I?",
    "hint1": "Ratio of consecutive terms approaches the Golden Ratio (1.618).",
    "hint2": "Fibonacci...",
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
    "id": "tt-riddle-sch-909",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A chemist in Tema was found dead next to a glass of water containing crushed ice cubes. The coroner found ingested poison, but the liquid water in the glass was completely non-toxic. How was the poison administered?",
    "hint1": "What happened to the ice as it melted?",
    "hint2": "The poison was frozen inside the ice cubes.",
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
    "id": "tt-riddle-sch-910",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the molecular process where messenger RNA codons are decoded by ribosomes to synthesize specific polypeptide chains of amino acids. What am I?",
    "hint1": "Follows transcription in protein synthesis.",
    "hint2": "Translation...",
    "answer": "Translation",
    "acceptedKeywords": [
      "translation",
      "protein translation"
    ],
    "explanation": "Translation is the molecular biological process whereby genetic code carried by mRNA directs peptide bond synthesis in ribosomes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-911",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Erected by Portuguese traders in 1482 as São Jorge da Mina, I am the oldest European building standing south of the Sahara, later serving as a central slave depot. What fortress am I?",
    "hint1": "Located on the coast of the Central Region.",
    "hint2": "Elmina Castle.",
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
    "id": "tt-riddle-sch-912",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "When rolling two standard six-sided dice, what is the most statistically probable sum of the two upward faces?",
    "hint1": "There are 36 possible outcomes.",
    "hint2": "Combinations (1,6), (2,5), (3,4) yield this value.",
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
    "id": "tt-riddle-sch-913",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the point on the Earth's surface directly above the underground subterranean hypocenter where an earthquake rupture initiates. What geological term am I?",
    "hint1": "Pinpointed by seismograph triangulation.",
    "hint2": "Epicenter...",
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
    "id": "tt-riddle-sch-914",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am a single English word that can mean 'to adhere firmly to something' and also mean 'to split or sever something apart'. What contronym am I?",
    "hint1": "Six letters starting with C.",
    "hint2": "A butcher's heavy knife is a cleaver.",
    "answer": "Cleave",
    "acceptedKeywords": [
      "cleave",
      "to cleave"
    ],
    "explanation": "'Cleave' is a classic contronym (auto-antonym) meaning both to adhere tightly and to divide/cut into parts.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-915",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A woman shoots her husband with a camera, dips him under liquid for five minutes, and hangs him up on a line. Ten minutes later, they go out together for dinner in Accra. How?",
    "hint1": "She is an artist working with film.",
    "hint2": "Developing a photographic print.",
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
    "id": "tt-riddle-nov-2001",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a colorful insect with four wide, powdery wings. Before I learned to fly from flower to flower sipping sweet nectar, I was a hungry caterpillar munching green leaves. What am I?",
    "hint1": "I rest inside a chrysalis pupa before getting my wings.",
    "hint2": "You see me fluttering in sunlit gardens.",
    "answer": "A butterfly",
    "acceptedKeywords": [
      "butterfly",
      "a butterfly",
      "butterflies"
    ],
    "explanation": "Butterflies undergo complete metamorphosis from egg to caterpillar larva, pupa (chrysalis), and winged adult.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2002",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a round, hollow gourd grown on a vine. When dried and hollowed out, I serve water, palm wine, or koko porridge in Ghanaian homes. What traditional bowl am I?",
    "hint1": "Cut in half from a dried gourd fruit.",
    "hint2": "Known as Koraa in Akan or Kpakpo.",
    "answer": "A calabash",
    "acceptedKeywords": [
      "calabash",
      "a calabash",
      "gourd",
      "koraa"
    ],
    "explanation": "The calabash gourd (Lagenaria siceraria) is dried and lignified to create lightweight, biodegradable bowls and musical rattles.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2003",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "I am a straight plastic tool living in your school bag. I have 30 centimeter marks along my edge, and I help you draw straight lines without wobbling. What am I?",
    "hint1": "Used to measure length in centimeters and millimeters.",
    "hint2": "Shares its name with a king or queen.",
    "answer": "A ruler",
    "acceptedKeywords": [
      "ruler",
      "a ruler",
      "measuring ruler"
    ],
    "explanation": "A school ruler is a straightedge calibrated in centimeters and millimeters for measuring length and drawing line segments.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2004",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I am made of rubber and sit at the tip of your pencil. I do not write a single letter, yet I make your spelling mistakes disappear by rubbing myself away. What am I?",
    "hint1": "Clears graphite pencil marks from paper.",
    "hint2": "Also called a rubber in Ghana.",
    "answer": "An eraser (rubber)",
    "acceptedKeywords": [
      "eraser",
      "an eraser",
      "rubber",
      "a rubber",
      "pencil eraser"
    ],
    "explanation": "Erasers lift graphite particles from paper fibers through friction and tackiness.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2005",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a tiny insect that carries a glowing yellow-green lantern on my belly at night. I flash in the dark bushes near the village stream without using any batteries. What am I?",
    "hint1": "Produces cold biological light called bioluminescence.",
    "hint2": "My name combines 'fire' and 'fly'.",
    "answer": "A firefly (lightning bug)",
    "acceptedKeywords": [
      "firefly",
      "a firefly",
      "lightning bug",
      "glowworm"
    ],
    "explanation": "Fireflies are beetles that produce light chemically in their lower abdomen using luciferin and luciferase enzymes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2006",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What belongs only to you from the day you are named, yet your teachers, friends, and parents use it far more often than you do?",
    "hint1": "People call it out when they want your attention.",
    "hint2": "Written on the cover of your exercise book.",
    "answer": "Your name",
    "acceptedKeywords": [
      "your name",
      "my name",
      "name",
      "a name"
    ],
    "explanation": "A person's given name belongs to them, but other people speak it aloud whenever addressing them.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2007",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a crunchy, golden-yellow grain roasted in a hot pan from grated cassava. Add cold water, sugar, and groundnuts to me for a quick student snack ('soakings')! What food am I?",
    "hint1": "Made by fermenting, pressing, and roasting cassava.",
    "hint2": "Four letters starting with G.",
    "answer": "Gari",
    "acceptedKeywords": [
      "gari",
      "garri",
      "roasted cassava"
    ],
    "explanation": "Gari is a shelf-stable West African staple made by fermenting, dewatering, and gelatinizing grated cassava mash over heat.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2008",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "If you count all the fingers on both of your hands and all the toes on both of your feet, what total number do you reach?",
    "hint1": "5 + 5 + 5 + 5.",
    "hint2": "Two tens.",
    "answer": "20",
    "acceptedKeywords": [
      "20",
      "twenty",
      "twenty digits"
    ],
    "explanation": "Humans typically have 5 digits on each of their 4 limbs: 4 × 5 = 20 digits in total.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2009",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have two sharp metal blades joined by a screw in the middle, and two finger loops for your thumb and fingers. I love to snip paper and cloth in Creative Arts class. What am I?",
    "hint1": "Never run while holding me.",
    "hint2": "A pair of...",
    "answer": "A pair of scissors",
    "acceptedKeywords": [
      "scissors",
      "a pair of scissors",
      "pair of scissors"
    ],
    "explanation": "Scissors operate as a pair of pivoted first-class levers with sharp shearing edges.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2010",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I carry my hard round house upon my back wherever I crawl. When danger comes near, I pull my head and soft foot right inside my shell. What garden creature am I?",
    "hint1": "Leaves a silvery trail on damp walls after rain.",
    "hint2": "Prized in Ghanaian soups as 'nwa'.",
    "answer": "A snail",
    "acceptedKeywords": [
      "snail",
      "a snail",
      "giant african snail",
      "tortoise"
    ],
    "explanation": "Snails are gastropod mollusks with a coiled calcium carbonate shell that protects their visceral mass from predators and drying out.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2011",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a neck and two sleeves, but no head and no arms, and goes to school with you every morning?",
    "hint1": "Buttoned up after you bathe.",
    "hint2": "Part of your school uniform.",
    "answer": "A shirt (school uniform)",
    "acceptedKeywords": [
      "shirt",
      "a shirt",
      "uniform shirt",
      "school shirt",
      "blouse"
    ],
    "explanation": "Garments like shirts are tailored with a collar neck opening and sleeves to cover human arms.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2012",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a lizard famous for changing the color of my skin to match green leaves or brown branches, and my two eyes can look in two different directions at the same time. What reptile am I?",
    "hint1": "Catches insects with a long, fast sticky tongue.",
    "hint2": "Starts with 'Cha-'.",
    "answer": "A chameleon",
    "acceptedKeywords": [
      "chameleon",
      "a chameleon"
    ],
    "explanation": "Chameleons adjust skin nanocrystal spacing to change color and possess independently rotating turret-like eyes.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2013",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Math & Logic",
    "difficulty": "Easy",
    "question": "How many days are there in two full weeks?",
    "hint1": "One week has 7 days.",
    "hint2": "Double the number 7.",
    "answer": "14 days",
    "acceptedKeywords": [
      "14",
      "14 days",
      "fourteen",
      "fourteen days"
    ],
    "explanation": "Since 1 week equals 7 days, 2 weeks equal 7 × 2 = 14 days (also called a fortnight).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2014",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a wooden board carved with two rows of six round pits. Two players scoop and sow smooth bonduc seeds ('ware' marbles) from pit to pit to capture their opponent's seeds. What traditional game am I?",
    "hint1": "Ghana's national mancala board game.",
    "hint2": "Five letters starting with O.",
    "answer": "Oware",
    "acceptedKeywords": [
      "oware",
      "mancala",
      "awalé",
      "ayo"
    ],
    "explanation": "Oware is an ancient strategy board game of the mancala family widely played across Ghana and West Africa, teaching mental arithmetic and foresight.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-2015",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I hang inside a woven net over your bed at night. I let fresh cool breeze blow right through, but I block buzzing mosquitoes from biting you. What am I?",
    "hint1": "Protects sleepers from malaria.",
    "hint2": "A treated bed...",
    "answer": "A mosquito net",
    "acceptedKeywords": [
      "mosquito net",
      "a mosquito net",
      "bed net",
      "net"
    ],
    "explanation": "Insecticide-treated mosquito nets provide a physical and chemical barrier against nocturnal Anopheles mosquitoes that transmit malaria.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a grooved wheel that spins on an axle with a rope running along my rim. Builders at construction sites pull down on my rope to hoist heavy buckets of cement upward. What simple machine am I?",
    "hint1": "Changes the direction of a pulling force.",
    "hint2": "Starts with the letter 'P'.",
    "answer": "A pulley",
    "acceptedKeywords": [
      "pulley",
      "a pulley",
      "pulley wheel"
    ],
    "explanation": "A pulley is a simple machine consisting of a grooved wheel and rope used to redirect force or gain mechanical advantage when lifting loads.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol showing two crocodiles joined at a single shared stomach. My proverb teaches that fighting over food is foolish when both mouths feed the same belly. What symbol am I?",
    "hint1": "Symbolizes unity in diversity and democracy.",
    "hint2": "Funtunfunefu...",
    "answer": "Funtunfunefu Denkyemfunefu (Siamese Crocodiles)",
    "acceptedKeywords": [
      "funtunfunefu",
      "denkyemfunefu",
      "siamese crocodiles",
      "conjoined crocodiles",
      "funtunfunefu denkyemfunefu"
    ],
    "explanation": "Funtunfunefu Denkyemfunefu depicts two conjoined crocodiles sharing one stomach, teaching that members of a community share a common destiny.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am the only even prime number in all of mathematics. Every other even number can be divided by me. What number am I?",
    "hint1": "Smallest prime number.",
    "hint2": "Comes right after 1.",
    "answer": "2",
    "acceptedKeywords": [
      "2",
      "two",
      "number 2"
    ],
    "explanation": "Two is the only even prime number because its only positive divisors are 1 and 2; all larger even numbers are multiples of 2.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the movement of water molecules across a selectively permeable membrane from a dilute solution to a more concentrated solution, helping plant roots absorb soil water. What biological process am I?",
    "hint1": "A special kind of diffusion involving water.",
    "hint2": "Starts with 'Os-'.",
    "answer": "Osmosis",
    "acceptedKeywords": [
      "osmosis",
      "water osmosis"
    ],
    "explanation": "Osmosis is the passive net movement of water molecules across a semi-permeable membrane down a water potential gradient.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a 5-letter English word for a seat without a backrest, carved by Ashanti craftsmen. Remove my first letter and I become a carpenter's hammer or saw. What word am I?",
    "hint1": "The Golden ___ is the sacred symbol of the Ashanti Nation.",
    "hint2": "S-T-O-O-L without 'S' becomes T-O-O-L.",
    "answer": "Stool",
    "acceptedKeywords": [
      "stool",
      "a stool",
      "wooden stool"
    ],
    "explanation": "Removing the first letter 'S' from 'STOOL' leaves 'TOOL', an instrument used by a craftsperson.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "Two mothers and two daughters board a trotro in Cape Coast. The mate charges 5 Cedis per passenger, and collects a total of 15 Cedis for the whole group without giving any discount. How?",
    "hint1": "Count how many generations are in the family.",
    "hint2": "Grandmother, mother, and daughter.",
    "answer": "There are only 3 passengers: a grandmother, her daughter (who is also a mother), and her granddaughter",
    "acceptedKeywords": [
      "3 people",
      "three people",
      "grandmother mother daughter",
      "grandmother, mother, and daughter",
      "three passengers"
    ],
    "explanation": "The middle woman is both a daughter to her mother and a mother to her daughter, so 3 people satisfy 'two mothers and two daughters'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Built across the Volta Gorge in 1965, my giant rock-fill wall holds back the largest artificial lake by surface area on Earth and spins hydroelectric turbines for Ghana. What dam am I?",
    "hint1": "Located in the Eastern Region.",
    "hint2": "Akosombo...",
    "answer": "The Akosombo Dam",
    "acceptedKeywords": [
      "akosombo dam",
      "akosombo",
      "the akosombo dam"
    ],
    "explanation": "The Akosombo Hydroelectric Dam impounds the Volta River to form Lake Volta and supplies clean hydroelectric power across Ghana and neighboring West African nations.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a dome-shaped sheet of muscle below your lungs. When I contract and flatten downward, your chest cavity expands and air rushes into your lungs. What muscle am I?",
    "hint1": "Separates the thorax from the abdomen.",
    "hint2": "Spasms in me cause hiccups!",
    "answer": "The diaphragm",
    "acceptedKeywords": [
      "diaphragm",
      "the diaphragm",
      "thoracic diaphragm"
    ],
    "explanation": "The diaphragm is the primary skeletal muscle of respiration; its contraction lowers intrathoracic pressure to draw air into the lungs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2009",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "In a class of 30 pupils in Sunyani, 18 pupils play football, 15 pupils play athletics, and every pupil plays at least one of the two sports. How many pupils play BOTH football and athletics?",
    "hint1": "Add 18 + 15 and subtract the total class size of 30.",
    "hint2": "Venn diagram intersection: 33 - 30.",
    "answer": "3 pupils",
    "acceptedKeywords": [
      "3",
      "three",
      "3 pupils",
      "3 students"
    ],
    "explanation": "By the Principle of Inclusion-Exclusion, |A ∩ B| = |A| + |B| - |A ∪ B| = 18 + 15 - 30 = 3 pupils.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a safety wire inside a 3-pin electrical plug with green-and-yellow striped insulation. If a live wire accidentally touches a metal kettle casing, I safely channel the fault current into the ground. What wire am I?",
    "hint1": "Connected to the top longest pin of a UK/Ghana 3-pin plug.",
    "hint2": "Named after our planet.",
    "answer": "The earth wire (ground wire)",
    "acceptedKeywords": [
      "earth wire",
      "the earth wire",
      "ground wire",
      "earthing wire"
    ],
    "explanation": "The earth wire provides a low-resistance path to ground, preventing dangerous electric shocks if a live conductor contacts a metal appliance body.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2011",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A farmer in Techiman has 4 heaps of yams in one corner of his barn and 3 heaps of yams in another corner. If he combines all of them into one big pile in the center, how many heaps of yams does he have now?",
    "hint1": "They are all together in the center.",
    "hint2": "4 heaps + 3 heaps merged into one.",
    "answer": "1 big heap",
    "acceptedKeywords": [
      "1",
      "one",
      "1 heap",
      "one heap",
      "1 big heap"
    ],
    "explanation": "Combining multiple separate piles of objects into a single location merges them into 1 unified heap.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2012",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "Suspended 30 meters high between giant emergent rainforest trees in the Central Region, my 350-meter rope-and-plank bridges let visitors walk among birds and monkeys. What famous attraction am I?",
    "hint1": "Located inside Kakum National Park.",
    "hint2": "Canopy...",
    "answer": "The Kakum Canopy Walkway",
    "acceptedKeywords": [
      "kakum canopy walkway",
      "canopy walkway",
      "kakum walkway"
    ],
    "explanation": "The Kakum Canopy Walkway consists of seven suspension bridges strung across the upper rainforest canopy in Kakum National Park.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2013",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am a 3-digit palindrome number (reading the same forward and backward). All three of my digits are odd primes, my middle digit is 7, and the sum of my three digits is 13. What number am I?",
    "hint1": "Since the middle digit is 7 and the sum is 13, the first and last digits must add up to 6.",
    "hint2": "Both outer digits are the same odd prime!",
    "answer": "373",
    "acceptedKeywords": [
      "373",
      "three hundred and seventy-three"
    ],
    "explanation": "A 3-digit palindrome has the form ABA. With B = 7 and A + 7 + A = 13, 2A = 6 so A = 3 (an odd prime), giving 373.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2014",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a 5-letter word for a shiny grain crop. Remove my first letter and I become thermal energy; remove one more letter and I become what you do at lunch. What word am I?",
    "hint1": "Milled into flour for bread.",
    "hint2": "W-H-E-A-T -> H-E-A-T -> E-A-T.",
    "answer": "Wheat",
    "acceptedKeywords": [
      "wheat",
      "the word wheat"
    ],
    "explanation": "Removing 'W' from 'WHEAT' leaves 'HEAT', and removing 'H' leaves 'EAT'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-2015",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am the seasonal dry and dusty trade wind that blows southwest from the Sahara Desert across West Africa between late November and mid-March. What wind am I?",
    "hint1": "Brings cool mornings, hazy skies, and chapped lips.",
    "hint2": "Starts with 'Har-'.",
    "answer": "The Harmattan",
    "acceptedKeywords": [
      "harmattan",
      "the harmattan",
      "harmattan wind"
    ],
    "explanation": "The Harmattan is a dry, dusty northeasterly trade wind blowing from the Sahara over West Africa into the Gulf of Guinea.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2001",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the electromagnetic induction law discovered by Michael Faraday stating that the direction of an induced electric current always opposes the magnetic flux change that produces it, conserving energy. Whose law am I?",
    "hint1": "Explains the minus sign in Faraday's Law of Induction.",
    "hint2": "Named after Heinrich...",
    "answer": "Lenz's Law",
    "acceptedKeywords": [
      "lenz's law",
      "lenz law",
      "lenzs law"
    ],
    "explanation": "Lenz's Law states that an induced electromotive force generates a current whose magnetic field opposes the original change in magnetic flux.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2002",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In a room of 367 JHS students (in a non-leap year of 365 days, or even a leap year of 366 days), what combinatorics principle guarantees with 100% certainty—not just high probability—that at least two students share the exact same birthday?",
    "hint1": "More pigeons than pigeonholes.",
    "hint2": "Formulated by Peter Gustav Lejeune Dirichlet.",
    "answer": "The Pigeonhole Principle",
    "acceptedKeywords": [
      "pigeonhole principle",
      "the pigeonhole principle",
      "dirichlet's box principle"
    ],
    "explanation": "The Pigeonhole Principle states that if n items are put into m containers with n > m, at least one container must contain more than one item (367 > 366).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2003",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Born in Axim in 1703, I earned a doctorate in philosophy in Germany and taught at the universities of Halle and Jena, writing a famous treatise critiquing René Descartes' mind-body dualism. Who was I?",
    "hint1": "Eighteenth-century Nzema philosopher.",
    "hint2": "Anton Wilhelm...",
    "answer": "Anton Wilhelm Amo",
    "acceptedKeywords": [
      "anton wilhelm amo",
      "amo",
      "dr anton wilhelm amo"
    ],
    "explanation": "Anton Wilhelm Amo (c. 1703–c. 1759), born near Axim in modern-day Ghana, became the first African known to have attended and taught at European universities in Germany.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2004",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a protein catalyst produced by living cells that speeds up biochemical reactions by lowering the activation energy without being consumed in the reaction. My name usually ends in '-ase'. What am I?",
    "hint1": "Amylase, pepsin, and catalase are examples of me.",
    "hint2": "Substrates bind to my active site like a lock and key.",
    "answer": "An enzyme",
    "acceptedKeywords": [
      "enzyme",
      "an enzyme",
      "enzymes",
      "biological catalyst"
    ],
    "explanation": "Enzymes are globular proteins that catalyze metabolic reactions by stabilizing the transition state and lowering activation energy.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2005",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "You have 8 identical-looking gold weights from an Ashanti brass-weight set, but 1 weight is slightly heavier than the other 7. Using a two-pan balance scale without numeric markings, what is the minimum number of weighings needed to guarantee finding the heavier weight?",
    "hint1": "Divide the weights into 3 groups (3, 3, and 2) instead of 2 groups of 4.",
    "hint2": "Each weighing has 3 possible outcomes: Left pan down, Right pan down, or Balanced.",
    "answer": "2 weighings",
    "acceptedKeywords": [
      "2",
      "two",
      "2 weighings",
      "two weighings"
    ],
    "explanation": "Weigh 3 against 3 first: if one pan sinks, weigh 1 vs 1 from those 3; if balanced, weigh 1 vs 1 from the remaining 2. Two weighings resolve up to 3² = 9 coins.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2006",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "In binary (base-2) arithmetic used by digital logic gates, what base-10 (decimal) number is represented by the 5-bit binary string 10101₂?",
    "hint1": "Place values from left to right are 16, 8, 4, 2, 1.",
    "hint2": "16 + 0 + 4 + 0 + 1.",
    "answer": "21",
    "acceptedKeywords": [
      "21",
      "twenty-one",
      "twenty one"
    ],
    "explanation": "In base 2, 10101₂ = (1 × 2⁴) + (0 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰) = 16 + 4 + 1 = 21.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2007",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am an allotrope of pure carbon where each carbon atom is covalently bonded to only three others in flat hexagonal sheets that slide easily over one another, allowing me to conduct electricity and write in pencil leads. What material am I?",
    "hint1": "Diamond is my hardest cousin; I am soft and slippery.",
    "hint2": "Contains delocalized pi electrons between layers.",
    "answer": "Graphite",
    "acceptedKeywords": [
      "graphite",
      "carbon graphite"
    ],
    "explanation": "Graphite consists of sp²-hybridized carbon sheets held by weak van der Waals forces, with one delocalized electron per carbon atom enabling electrical conductivity.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2008",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Hard",
    "question": "I am an 8-letter scientific word for a substance that speeds up a chemical reaction without being used up, starting with 'CAT-' and ending with '-LYST'. What word am I?",
    "hint1": "Manganese(IV) oxide acts as one when decomposing hydrogen peroxide.",
    "hint2": "C-A-T-A-L-Y-S-T.",
    "answer": "Catalyst",
    "acceptedKeywords": [
      "catalyst",
      "a catalyst"
    ],
    "explanation": "A catalyst increases the rate of a chemical reaction by providing an alternative pathway with lower activation energy without being chemically consumed.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2009",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "Founded in 1897 in Cape Coast by John Mensah Sarbah, J. E. Casely Hayford, and traditional rulers, I successfully campaigned against the colonial Crown Lands Bill to protect indigenous Ghanaian land ownership. What historic movement was I?",
    "hint1": "Abbreviation is ARPS.",
    "hint2": "Aborigines' Rights...",
    "answer": "The Gold Coast Aborigines' Rights Protection Society (ARPS)",
    "acceptedKeywords": [
      "aborigines rights protection society",
      "arps",
      "aborigines' rights protection society"
    ],
    "explanation": "The Gold Coast Aborigines' Rights Protection Society (ARPS), formed in 1897, united intellectuals and chiefs to prevent colonial appropriation of communal lands.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2010",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "You have an 8-liter jerrycan filled to the brim with palm oil, and two empty containers of 5 liters and 3 liters with no graduated markings. What is the exact volume of oil you can measure out to split the 8 liters into two equal halves?",
    "hint1": "Half of 8 liters is 4 liters.",
    "hint2": "Pour 8→5 (leaving 3), 5→3 (leaving 2 in the 5L), 3→8 (making 6), 2 into 3L, fill 5L from 8L, top up 3L from 5L.",
    "answer": "4 liters in the 8-liter can and 4 liters in the 5-liter can",
    "acceptedKeywords": [
      "4 liters",
      "4 litres",
      "4",
      "four liters",
      "four litres"
    ],
    "explanation": "Using modular state transitions across the (8, 5, 3) capacities reaches the state (4, 4, 0) in 7 pours.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2011",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the wave phenomenon where the observed pitch of an ambulance siren sounds higher as the vehicle speeds toward you and drops lower as it speeds away from you. What physical effect am I?",
    "hint1": "Also causes redshift in light from receding galaxies.",
    "hint2": "Named after Christian...",
    "answer": "The Doppler Effect",
    "acceptedKeywords": [
      "doppler effect",
      "the doppler effect",
      "doppler shift"
    ],
    "explanation": "The Doppler Effect is the change in observed wave frequency and wavelength caused by relative motion between the wave source and the observer.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2012",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "If the sum of the interior angles of a regular convex polygon is 1,080°, how many sides does the polygon have?",
    "hint1": "Use the formula (n - 2) × 180° = 1,080°.",
    "hint2": "1,080 ÷ 180 = 6, so n - 2 = 6.",
    "answer": "8 sides (an octagon)",
    "acceptedKeywords": [
      "8",
      "8 sides",
      "eight",
      "octagon",
      "an octagon"
    ],
    "explanation": "Solving (n - 2) × 180° = 1,080° gives n - 2 = 6, so n = 8 (an octagon).",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2013",
    "targetGroup": "Scholar (JHS)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am an 11-letter English word that every single pupil—even the brightest Scholar in Ghana—always spells 'incorrectly' when asked to spell me. What word am I?",
    "hint1": "Look closely at the word inside the quotation marks.",
    "hint2": "I-N-C-O-R-R-E-C-T-L-Y.",
    "answer": "Incorrectly",
    "acceptedKeywords": [
      "incorrectly",
      "the word incorrectly"
    ],
    "explanation": "The riddle is self-referential wordplay: the word 'incorrectly' is literally spelled I-N-C-O-R-R-E-C-T-L-Y.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2014",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am the symbiotic ecological relationship between nitrogen-fixing Rhizobium bacteria and the root nodules of cowpea or groundnut plants, in which BOTH organisms benefit. What type of symbiosis am I?",
    "hint1": "Parasitism harms one host; commensalism helps one; I help both.",
    "hint2": "Starts with 'Mutu-'.",
    "answer": "Mutualism",
    "acceptedKeywords": [
      "mutualism",
      "mutualistic symbiosis"
    ],
    "explanation": "In mutualism, the legume supplies carbohydrates to the Rhizobium bacteria, while the bacteria fix atmospheric N₂ into bioavailable ammonium for the plant.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-2015",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A river ferryman in Ada has a boat that can hold at most 100 kg. A mother weighs 100 kg, and her two twin sons each weigh 50 kg. All three know how to row. What is the minimum number of one-way river crossings needed to get all three across?",
    "hint1": "First the two 50 kg sons cross together (100 kg), and one son rows back.",
    "hint2": "Count each trip across or back as 1 crossing.",
    "answer": "5 crossings",
    "acceptedKeywords": [
      "5",
      "5 crossings",
      "five",
      "five crossings",
      "5 trips"
    ],
    "explanation": "1) Both sons cross; 2) Son A returns; 3) Mother crosses alone; 4) Son B returns; 5) Both sons cross together. Total = 5 crossings.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3001",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have a face and two hands, but no arms or legs. I tell you when to wake up. What am I?",
    "hint1": "I hang on the wall or sit on a table.",
    "hint2": "I have numbers from 1 to 12.",
    "answer": "A clock",
    "acceptedKeywords": [
      "clock",
      "wall clock",
      "alarm clock"
    ],
    "explanation": "A clock has a face and hands (the pointers) and helps you tell time.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3002",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am yellow and curved. I grow in bunches. Monkeys love me. What am I?",
    "hint1": "I am a fruit.",
    "hint2": "I am often eaten in Ghana and I have a peel.",
    "answer": "A banana",
    "acceptedKeywords": [
      "banana",
      "bananas",
      "plantain"
    ],
    "explanation": "Bananas are yellow, curved fruits that grow in bunches and are loved by monkeys.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3003",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has a head and a tail but no body?",
    "hint1": "You can flip me.",
    "hint2": "I am used in games and math.",
    "answer": "A coin",
    "acceptedKeywords": [
      "coin",
      "a coin",
      "money"
    ],
    "explanation": "A coin has a head side and a tail side, but no body.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3004",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I am full of holes but still hold water. What am I?",
    "hint1": "You use me in the kitchen.",
    "hint2": "I am used to wash rice or strain tea.",
    "answer": "A sponge",
    "acceptedKeywords": [
      "sponge",
      "a sponge",
      "foam"
    ],
    "explanation": "A sponge has many holes but can absorb and hold water.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3005",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am very big and hot. I give light and heat to the Earth. What am I?",
    "hint1": "You see me in the sky during the day.",
    "hint2": "I am a star.",
    "answer": "The Sun",
    "acceptedKeywords": [
      "sun",
      "the sun",
      "solar"
    ],
    "explanation": "The Sun is a star that provides light and heat to the Earth.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3006",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have keys but no locks. I have space but no room. I can enter but not go outside. What am I?",
    "hint1": "You use me to type.",
    "hint2": "I am part of a computer.",
    "answer": "A keyboard",
    "acceptedKeywords": [
      "keyboard",
      "computer keyboard",
      "key pad"
    ],
    "explanation": "A keyboard has keys but no locks, and a spacebar but no physical room.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3007",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am the largest living bird in Africa. I cannot fly in the sky, but my two strong legs can sprint faster than a horse across the savanna. What bird am I?",
    "hint1": "I am not an eagle.",
    "hint2": "I have long legs and a long neck.",
    "answer": "An ostrich",
    "acceptedKeywords": [
      "ostrich",
      "an ostrich",
      "ostriches"
    ],
    "explanation": "The ostrich is a large flightless bird that can run very fast.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3008",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What gets bigger the more you take away?",
    "hint1": "Think of a hole.",
    "hint2": "The more you dig, the bigger it gets.",
    "answer": "A hole",
    "acceptedKeywords": [
      "hole",
      "a hole",
      "pit"
    ],
    "explanation": "A hole gets bigger as you remove more soil from it.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3009",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a small animal with a long tail. I like cheese. I am a pet. What am I?",
    "hint1": "I am not a cat.",
    "hint2": "I squeak.",
    "answer": "A mouse",
    "acceptedKeywords": [
      "mouse",
      "a mouse",
      "mice"
    ],
    "explanation": "A mouse is a small animal with a long tail that likes cheese and is often kept as a pet.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3010",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "What has one eye but cannot see?",
    "hint1": "You use it to sew.",
    "hint2": "It has a sharp end.",
    "answer": "A needle",
    "acceptedKeywords": [
      "needle",
      "a needle",
      "sewing needle"
    ],
    "explanation": "A needle has an eye (the hole for thread) but cannot see.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3011",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What can you break even if you never pick it up?",
    "hint1": "You can make it.",
    "hint2": "It is a promise.",
    "answer": "A promise",
    "acceptedKeywords": [
      "promise",
      "a promise",
      "your word"
    ],
    "explanation": "You can break a promise without physically touching it.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3012",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Science & Nature",
    "difficulty": "Easy",
    "question": "I am a plant. I am yellow and tall. I have many seeds. What am I?",
    "hint1": "You can eat me.",
    "hint2": "I am often boiled or roasted.",
    "answer": "Maize",
    "acceptedKeywords": [
      "maize",
      "corn",
      "an ear of corn"
    ],
    "explanation": "Maize is a tall yellow plant with many seeds on a cob.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3013",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Word Riddle",
    "difficulty": "Easy",
    "question": "I have a neck but no head. I have a body but no legs. You wear me. What am I?",
    "hint1": "I am a piece of clothing.",
    "hint2": "I keep you warm.",
    "answer": "A shirt",
    "acceptedKeywords": [
      "shirt",
      "a shirt",
      "clothing"
    ],
    "explanation": "A shirt has a neck and body but no head or legs.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3014",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "African Wisdom",
    "difficulty": "Easy",
    "question": "I am a drum. I am tall and played with hands. I am used in traditional Ghanaian ceremonies. What am I?",
    "hint1": "I am not a piano.",
    "hint2": "My name starts with 'D'.",
    "answer": "A djembe",
    "acceptedKeywords": [
      "djembe",
      "jembe",
      "drum"
    ],
    "explanation": "The djembe is a tall West African drum played with the hands.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-nov-3015",
    "targetGroup": "Novice (Basic 1-3)",
    "category": "Lateral Thinking",
    "difficulty": "Easy",
    "question": "What has many teeth but cannot bite?",
    "hint1": "You use it to clean.",
    "hint2": "It is a tool.",
    "answer": "A comb",
    "acceptedKeywords": [
      "comb",
      "a comb",
      "hair comb"
    ],
    "explanation": "A comb has many teeth (the prongs) but cannot bite.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am a number. If you double me and add 6, you get 20. What number am I?",
    "hint1": "Work backwards from 20.",
    "hint2": "Half of 14 is 7.",
    "answer": "7",
    "acceptedKeywords": [
      "7",
      "seven"
    ],
    "explanation": "The equation is 2x + 6 = 20. Solving gives x = 7.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a force that pulls objects towards the Earth. I keep you on the ground. What am I?",
    "hint1": "I am related to weight.",
    "hint2": "Isaac Newton studied me.",
    "answer": "Gravity",
    "acceptedKeywords": [
      "gravity",
      "gravitational force",
      "gravitation"
    ],
    "explanation": "Gravity is the force that pulls objects towards the Earth.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man pushes his car to a hotel and tells the owner he is bankrupt. Why?",
    "hint1": "It is not a real hotel.",
    "hint2": "It is a board game.",
    "answer": "He is playing Monopoly",
    "acceptedKeywords": [
      "monopoly",
      "playing monopoly",
      "board game"
    ],
    "explanation": "In Monopoly, you push a car token to a hotel and can go bankrupt.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a word that becomes shorter when you add two letters to it. What am I?",
    "hint1": "The word is 'short'.",
    "hint2": "Adding 'er' makes it shorter.",
    "answer": "Short",
    "acceptedKeywords": [
      "short",
      "shorter"
    ],
    "explanation": "The word 'short' becomes 'shorter' when you add 'er', which means less long.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "A farmer has 17 sheep. All but 9 run away. How many are left?",
    "hint1": "Read the sentence carefully.",
    "hint2": "All but 9 means all except 9.",
    "answer": "9",
    "acceptedKeywords": [
      "9",
      "nine"
    ],
    "explanation": "All but 9 means 9 remain. The others ran away.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3006",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am a proverb: 'The child who is not embraced by the village will burn it down to feel its warmth.' What does this teach?",
    "hint1": "It is about community.",
    "hint2": "It teaches the importance of belonging.",
    "answer": "The importance of community and belonging",
    "acceptedKeywords": [
      "community",
      "belonging",
      "village",
      "embrace"
    ],
    "explanation": "The proverb teaches that neglect can lead to destructive behavior, and community support is essential.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3007",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a process where water turns into vapor. I happen when the sun heats water. What am I?",
    "hint1": "I am part of the water cycle.",
    "hint2": "I start with 'E'.",
    "answer": "Evaporation",
    "acceptedKeywords": [
      "evaporation",
      "evaporate",
      "water vapor"
    ],
    "explanation": "Evaporation is the process of water turning into vapor when heated.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3008",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "What can travel around the world while staying in a corner?",
    "hint1": "It is a small object.",
    "hint2": "You use it to send letters.",
    "answer": "A stamp",
    "acceptedKeywords": [
      "stamp",
      "postage stamp",
      "a stamp"
    ],
    "explanation": "A stamp stays in the corner of an envelope but travels around the world.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3010",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Word Riddle",
    "difficulty": "Medium",
    "question": "I am a 5-letter word for a decorative feather on a bird's head. Remove my last letter and I become a sweet purple or yellow stone fruit. What word am I?",
    "hint1": "Peacocks and ostriches have showy ones.",
    "hint2": "P-L-U-M-E without 'E' is P-L-U-M.",
    "answer": "Plume",
    "acceptedKeywords": [
      "plume",
      "a plume",
      "plum"
    ],
    "explanation": "Removing the final letter 'E' from 'PLUME' leaves 'PLUM', a sweet stone fruit.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3011",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a gas that plants take in during photosynthesis. I am also what humans breathe out. What am I?",
    "hint1": "I am a compound.",
    "hint2": "I have one carbon and two oxygen atoms.",
    "answer": "Carbon dioxide",
    "acceptedKeywords": [
      "carbon dioxide",
      "co2",
      "carbon dioxide gas"
    ],
    "explanation": "Carbon dioxide (CO₂) is taken in by plants during photosynthesis and exhaled by humans.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3012",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Lateral Thinking",
    "difficulty": "Medium",
    "question": "A man lives on the 10th floor. Every day he takes the elevator down to the ground floor. When he returns, he takes the elevator to the 7th floor and walks the rest. Why?",
    "hint1": "He is not exercising.",
    "hint2": "He is short.",
    "answer": "He is too short to reach the 10th floor button",
    "acceptedKeywords": [
      "short",
      "too short",
      "cannot reach"
    ],
    "explanation": "The man is too short to press the 10th floor button, so he presses 7 and walks.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3013",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Math & Logic",
    "difficulty": "Medium",
    "question": "I am a number. I am the only even prime number. What am I?",
    "hint1": "Prime numbers have only two factors.",
    "hint2": "I am the smallest prime.",
    "answer": "2",
    "acceptedKeywords": [
      "2",
      "two"
    ],
    "explanation": "2 is the only even prime number because it has only two factors: 1 and itself.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3014",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "African Wisdom",
    "difficulty": "Medium",
    "question": "I am an Adinkra symbol that looks like a bird with its head turned backwards. I mean 'return and fetch it' or learn from the past. What am I?",
    "hint1": "My name starts with 'S'.",
    "hint2": "I am Sankofa.",
    "answer": "Sankofa",
    "acceptedKeywords": [
      "sankofa",
      "sankofa bird",
      "adinkra"
    ],
    "explanation": "Sankofa is an Adinkra symbol of a bird looking backwards, meaning it is not wrong to go back for what you forgot.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-app-3015",
    "targetGroup": "Apprentice (Basic 4-6)",
    "category": "Science & Nature",
    "difficulty": "Medium",
    "question": "I am a simple machine with a wheel and a rope. I help lift heavy loads. What am I?",
    "hint1": "I am used in wells.",
    "hint2": "I start with 'P'.",
    "answer": "A pulley",
    "acceptedKeywords": [
      "pulley",
      "a pulley",
      "wheel and axle"
    ],
    "explanation": "A pulley is a simple machine that uses a wheel and rope to lift heavy loads.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3001",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a statement that is true if and only if it is false. What am I?",
    "hint1": "I am a famous paradox.",
    "hint2": "I am the liar paradox.",
    "answer": "The liar paradox",
    "acceptedKeywords": [
      "liar paradox",
      "liar",
      "this sentence is false"
    ],
    "explanation": "The liar paradox is a self-referential statement that cannot be consistently true or false.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3002",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a process by which plants lose water vapor through their leaves. I help pull water up from the roots. What am I?",
    "hint1": "I am related to evaporation.",
    "hint2": "I start with 'T'.",
    "answer": "Transpiration",
    "acceptedKeywords": [
      "transpiration",
      "transpire",
      "leaf water loss"
    ],
    "explanation": "Transpiration is the loss of water vapor from plant leaves, which helps pull water up from the roots.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3003",
    "targetGroup": "Scholar (JHS)",
    "category": "Lateral Thinking",
    "difficulty": "Hard",
    "question": "A woman has 7 children, and half of them are boys. How is this possible?",
    "hint1": "Half of 7 is 3.5.",
    "hint2": "All of them are boys.",
    "answer": "All 7 are boys",
    "acceptedKeywords": [
      "all boys",
      "all are boys",
      "7 boys"
    ],
    "explanation": "Half of 7 is not a whole number. The only way half can be boys is if all are boys.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3004",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I am a West African concept meaning 'the spirit of the community' or 'the common good'. I am often used in debates about cooperation. What am I?",
    "hint1": "I am a Swahili word.",
    "hint2": "I start with 'U'.",
    "answer": "Ubuntu",
    "acceptedKeywords": [
      "ubuntu",
      "spirit of community",
      "common good"
    ],
    "explanation": "Ubuntu is a Nguni Bantu term meaning 'humanity to others' or 'the common good'.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3005",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a sequence where each number is the sum of the two preceding ones. I start 1, 1, 2, 3, 5, 8... What am I?",
    "hint1": "I am named after an Italian mathematician.",
    "hint2": "I start with 'F'.",
    "answer": "Fibonacci sequence",
    "acceptedKeywords": [
      "fibonacci",
      "fibonacci sequence",
      "fibonacci series"
    ],
    "explanation": "The Fibonacci sequence is a series where each number is the sum of the two preceding ones.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3006",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a law that states that energy cannot be created or destroyed, only transformed. What am I?",
    "hint1": "I am a conservation law.",
    "hint2": "I start with 'C'.",
    "answer": "Conservation of energy",
    "acceptedKeywords": [
      "conservation of energy",
      "energy conservation",
      "first law of thermodynamics"
    ],
    "explanation": "The law of conservation of energy states that energy cannot be created or destroyed, only transformed.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3008",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a number. I am the sum of the first 10 positive integers. What am I?",
    "hint1": "Use the formula n(n+1)/2.",
    "hint2": "10 × 11 / 2 = 55.",
    "answer": "55",
    "acceptedKeywords": [
      "55",
      "fifty-five"
    ],
    "explanation": "The sum of the first 10 positive integers is 10 × 11 / 2 = 55.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3009",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I am a Ghanaian symbol of a bird with its head turned backwards. I mean 'go back and fetch it'. What am I?",
    "hint1": "I am an Adinkra symbol.",
    "hint2": "I am Sankofa.",
    "answer": "Sankofa",
    "acceptedKeywords": [
      "sankofa",
      "sankofa bird",
      "adinkra"
    ],
    "explanation": "Sankofa is an Adinkra symbol of a bird looking backwards, meaning it is not wrong to go back for what you forgot.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3010",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a subatomic particle with a negative charge. I orbit the nucleus. What am I?",
    "hint1": "I am not a proton.",
    "hint2": "I start with 'E'.",
    "answer": "An electron",
    "acceptedKeywords": [
      "electron",
      "an electron",
      "electrons"
    ],
    "explanation": "An electron is a negatively charged subatomic particle that orbits the nucleus.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3013",
    "targetGroup": "Scholar (JHS)",
    "category": "Math & Logic",
    "difficulty": "Hard",
    "question": "I am a theorem that states that in a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. What am I?",
    "hint1": "I am named after a Greek mathematician.",
    "hint2": "I start with 'P'.",
    "answer": "Pythagorean theorem",
    "acceptedKeywords": [
      "pythagorean theorem",
      "pythagoras theorem",
      "pythagorean"
    ],
    "explanation": "The Pythagorean theorem states that a² + b² = c² in a right-angled triangle.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3014",
    "targetGroup": "Scholar (JHS)",
    "category": "African Wisdom",
    "difficulty": "Hard",
    "question": "I am a Ghanaian proverb: 'The lizard that jumped from the high iroko tree said he would praise himself if no one else did.' What does this teach?",
    "hint1": "It is about self-confidence.",
    "hint2": "It teaches that you can be proud of your achievements.",
    "answer": "Self-confidence and self-praise",
    "acceptedKeywords": [
      "self-confidence",
      "self-praise",
      "pride",
      "achievement"
    ],
    "explanation": "The proverb teaches that it is okay to be proud of your achievements, especially when others do not acknowledge them.",
    "isCentral": true
  },
  {
    "id": "tt-riddle-sch-3015",
    "targetGroup": "Scholar (JHS)",
    "category": "Science & Nature",
    "difficulty": "Hard",
    "question": "I am a type of chemical bond where electrons are shared between atoms. I am very strong. What am I?",
    "hint1": "I am not ionic.",
    "hint2": "I start with 'C'.",
    "answer": "Covalent bond",
    "acceptedKeywords": [
      "covalent bond",
      "covalent",
      "electron sharing"
    ],
    "explanation": "A covalent bond is a chemical bond formed by the sharing of electrons between atoms.",
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
  },
  {
    "id": "tt-debate-nov-601",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Lower primary classrooms should replace plastic chairs with traditional woven cane chairs.",
    "context": "Supporters argue that cane furniture supports local artisans, uses renewable natural fibers, and is biodegradable. Opponents note that cane chairs can have sharp fibers and are less durable than plastic under heavy classroom use.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-602",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School breaks should be divided into three short play intervals rather than one long break.",
    "context": "Advocates claim frequent short pauses prevent cognitive fatigue and help young children reset attention spans. Critics contend that multiple short breaks disrupt instructional continuity and leave insufficient time for eating lunch.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-603",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every primary school pupil should be required to learn a musical instrument.",
    "context": "Proponents point out that musical training strengthens neural pathways for language acquisition, pattern recognition, and focus. Opponents argue that instrument instruction is resource-intensive and places pressure on children who lack interest in music.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-604",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be allowed to design their own class rules at the start of each academic term.",
    "context": "Supporters argue that self-governance builds democratic responsibility and increases compliance with rules. Opponents argue that young children lack the developmental maturity to anticipate safety risks and fair behavioral boundaries.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-605",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Classrooms should keep no physical books and teach reading entirely via interactive tablets.",
    "context": "Advocates highlight lightweight carrying, automated phonics pronunciation tools, and access to vast digital libraries. Skeptics note that screens cause eye strain, create device distractions, and deprive children of tactile book-handling motor skills.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-601",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary students should be required to pass a swimming and water-safety test to graduate.",
    "context": "Supporters argue that water safety prevents drowning accidents along coastal and riverine communities and develops physical fitness. Opponents point out that many rural schools lack access to chlorinated pools or safe swimming facilities.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-602",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should replace all printed report cards with automated online parent portal updates.",
    "context": "Advocates argue that digital tracking reduces paper waste, enables instant grade transparency, and prevents report tampering. Critics highlight that parents in rural communities without reliable smartphones or internet access would be excluded.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-603",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Students should be allowed to choose whether they attend religious education classes.",
    "context": "Proponents argue that freedom of conscience and religious autonomy should be respected in multi-faith democratic societies. Opponents argue that religious education teaches moral values, cultural understanding, and civic ethics.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-604",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Competitive examinations should be replaced entirely with cumulative portfolio projects.",
    "context": "Advocates claim portfolio assessments reflect continuous growth, reduce high-stakes anxiety, and reward creative application. Opponents maintain that standardized exams provide objective benchmarks resistant to teacher grading subjectivity.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-605",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Basic 4 to 6 students should participate in mandatory weekly community waste recycling patrols.",
    "context": "Supporters argue that hands-on recycling teaches environmental stewardship and civic responsibility. Opponents contend that civic sanitation is a municipal government obligation that should not take time away from instructional hours.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-601",
    "targetGroup": "Scholar (JHS)",
    "topic": "African countries should completely ban the import and domestic sale of gas-powered motorcycles.",
    "context": "Environmentalists emphasize eliminating dense tailpipe emissions and noise pollution while encouraging electric two-wheeler transport. Economists point out that commercial couriers and transport riders rely on affordable fuel infrastructure where charging grids are absent.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-602",
    "targetGroup": "Scholar (JHS)",
    "topic": "JHS curricula should make entrepreneurship and business bookkeeping compulsory subjects for all students.",
    "context": "Advocates argue that practical financial management prepares graduates for self-employment and micro-business creation. Academics caution that adding commercial coursework dilutes instructional depth in foundational sciences and humanities.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-603",
    "targetGroup": "Scholar (JHS)",
    "topic": "Public secondary schools should require all students to board rather than offering day student options.",
    "context": "Supporters contend that mandatory boarding equalizes learning environments, eliminates long commutes, and instills discipline. Opponents argue that boarding separation weakens family relationships and creates high fee burdens for low-income households.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-604",
    "targetGroup": "Scholar (JHS)",
    "topic": "National legislation should mandate that all public school textbooks be released under open-source licenses.",
    "context": "Proponents point out that open licensing enables free legal printing, reduces government procurement corruption, and allows local remixing. Educational publishers argue that commercial copyright incentives are necessary to finance professional authoring and editing.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-605",
    "targetGroup": "Scholar (JHS)",
    "topic": "Autonomous algorithmic artificial intelligence systems should be legally prohibited from grading student essays.",
    "context": "Advocates argue that evaluating prose requires human empathy, cultural context, and nuanced comprehension that statistical language models cannot provide. Proponents counter that automated scoring delivers instant feedback, eliminates personal teacher favoritism, and handles large student volumes.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-701",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should replace all paper textbooks with digital touchscreen tablets for Basic 1 to 3 pupils.",
    "context": "Supporters argue that tablets make learning interactive and reduce heavy school bag weights. Opponents contend that screen time harms young eyesight and paper books build better motor writing skills.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-702",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Homework exercises should be completely abolished for all primary school children.",
    "context": "Proponents claim children need free time for physical play, family bonding, and proper sleep. Opponents argue that daily homework reinforces what was learned in class and develops discipline.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-703",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School uniforms should be optional rather than compulsory in primary schools.",
    "context": "Advocates argue that letting pupils choose their clothes encourages individuality and self-expression. Opponents maintain that uniforms prevent peer pressure, reduce bullying, and create equality among students.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-705",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every primary school pupil should help sweep and clean their classroom every afternoon.",
    "context": "Proponents argue that classroom chores instill humility, responsibility, and civic duty from an early age. Opponents believe that cleaning duties take away from study time and should be handled by custodial staff.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-701",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Ghanaian indigenous languages should serve as the primary medium of instruction in science and mathematics classes.",
    "context": "Advocates claim that learning in a mother tongue improves conceptual understanding and preserves cultural heritage. Opponents argue that English is the international language of global STEM research and standardized examinations.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-702",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Single-use plastic water sachets should be banned across all school campuses in Ghana.",
    "context": "Supporters point out that plastic sachet waste clogs drains, causes urban flooding, and harms local wildlife. Opponents argue that sachets provide the most affordable, hygienic drinking water for working families and pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-703",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Computer programming and AI literacy should be mandatory for all Basic 4 to 6 students.",
    "context": "Proponents assert that computer programming prepares children for the digital economy and builds logical problem-solving skills. Opponents believe foundational reading, writing, and arithmetic should take priority in schools facing resource constraints.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-704",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Zoos and commercial wildlife reserves should not keep wild animals in enclosures for public entertainment.",
    "context": "Advocates maintain that wild animals experience stress and behavioral disorders when confined outside their natural habitats. Opponents argue that regulated reserves fund vital species conservation, research, and public ecological education.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-705",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Standard terminal examinations should be replaced entirely by project-based continuous assessments.",
    "context": "Supporters argue that projects reflect real-world problem-solving and reduce high-stakes exam anxiety. Opponents contend that timed examinations provide standardized, objective benchmarks that prevent grading favoritism.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-701",
    "targetGroup": "Scholar (JHS)",
    "topic": "Generative artificial intelligence tools should be banned from JHS homework and essay assignments.",
    "context": "Proponents argue that generative AI bypasses critical thinking, reading comprehension, and original writing development. Opponents argue that students must learn to use AI responsibly as a collaborative research tool for the future workforce.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-702",
    "targetGroup": "Scholar (JHS)",
    "topic": "African nations should prioritize commercial nuclear energy over solar power for baseload industrial electrification.",
    "context": "Supporters argue that nuclear reactors deliver massive, reliable, zero-carbon electricity unaffected by weather or day-night cycles. Opponents highlight high capital costs, long construction timelines, and severe nuclear waste disposal concerns relative to abundant solar resources.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-703",
    "targetGroup": "Scholar (JHS)",
    "topic": "Social media platforms should enforce strict age verification requiring users to be at least 16 years old.",
    "context": "Advocates point to mounting clinical evidence linking adolescent social media use to mental health issues, cyberbullying, and sleep deprivation. Opponents argue that age verification infringes upon digital privacy rights and cuts young people off from educational communities.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-704",
    "targetGroup": "Scholar (JHS)",
    "topic": "The voting age in national parliamentary elections should be lowered from 18 to 16 years old.",
    "context": "Supporters argue that 16-year-olds pay taxes on work and will live longest with climate, economic, and education policies. Opponents argue that neurological brain maturity and civic knowledge are still developing at 16, making youth vulnerable to political manipulation.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-705",
    "targetGroup": "Scholar (JHS)",
    "topic": "National governments should levy targeted excise taxes on sugary beverages and processed foods to fund national health care.",
    "context": "Proponents argue that public health taxes successfully reduce rates of diabetes, hypertension, and obesity while funding hospital care. Opponents argue that sin taxes disproportionately burden lower-income households and intrude on personal dietary freedom.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-801",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary schools should require pupils to take a mandatory 30-minute nap after afternoon lunch.",
    "context": "Supporters argue that daytime sleep restores cognitive alertness and improves memory retention in young children. Opponents claim naps disrupt structured school schedules and interfere with normal nighttime bedtimes.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-802",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Classrooms should prioritize graphic novels and comic books over text-only reading books.",
    "context": "Advocates claim comics engage struggling readers and decode visual contextual meaning. Critics argue that plain text storybooks build richer mental vocabulary and deeper imaginative focus.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-803",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Lower primary art classes should focus strictly on drawing realistic nature objects rather than cartoons.",
    "context": "Proponents argue that realistic drawing builds spatial discipline and botanical observational skills. Opponents argue that art should be an expressive space for unbounded childhood fantasy and emotional play.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-804",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be required to greet their school teachers in indigenous Ghanaian languages each morning.",
    "context": "Supporters believe mother-tongue greetings preserve ancestral cultural respect and linguistic pride. Opponents worry this may confuse students from diverse regional backgrounds or conflict with English language immersion policies.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-805",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should replace chalkboards with whiteboards and dry-erase markers in all classrooms.",
    "context": "Advocates point out that whiteboards eliminate airborne calcium carbonate chalk dust that aggravates respiratory allergies. Opponents emphasize the higher recurring cost and plastic waste of disposable chemical markers.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-801",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary schools should operate on a four-day school week with slightly extended daily hours.",
    "context": "Supporters argue that a four-day week lowers transit expenses, provides family time, and allows teachers better preparation time. Critics contend that longer school days induce severe child fatigue and strain working parents' childcare arrangements.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-802",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Commercial extra classes and private paid tutoring should be outlawed for primary school pupils.",
    "context": "Advocates argue that evening tutoring worsens socioeconomic educational inequality and causes childhood burnout. Opponents maintain that parents have a fundamental right to purchase academic reinforcement for their children.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-803",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Practical vocational trade skills like masonry and carpentry should be compulsory alongside academic subjects.",
    "context": "Proponents assert that manual trades develop entrepreneurial self-reliance, problem solving, and practical technical competence. Skeptics argue that primary school hours should remain dedicated to foundational STEM, numeracy, and digital literacy.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-804",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Children under 13 should be legally banned from appearing in commercial advertising and social media branding.",
    "context": "Supporters argue that commercial influencer work exploits child labor and invades minor privacy rights. Opponents argue that commercial opportunities provide financial security for families and build early performance confidence.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-805",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "All school textbooks should be distributed as synchronized digital audiobooks alongside printed text.",
    "context": "Advocates highlight that audio narration assists students with reading difficulties, aids pronunciation, and supports diverse learning styles. Opponents argue that passive listening reduces silent reading stamina and text orthography retention.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-801",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghana should replace its thermal fossil fuel plants entirely with commercial nuclear power reactors.",
    "context": "Supporters argue that nuclear energy delivers continuous, high-output zero-carbon baseload electricity that ends industrial blackouts. Opponents emphasize high capital construction costs, multi-decade debt, and the regulatory challenges of radioactive waste storage.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-802",
    "targetGroup": "Scholar (JHS)",
    "topic": "Social media companies should face legal liability for psychological and mental health harm caused to teen users.",
    "context": "Advocates argue that platforms deliberately engineer addictive algorithmic feedback loops that trigger adolescent depression and anxiety. Opponents maintain that platforms are neutral hosts and that parental oversight and personal digital literacy are the proper remedies.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-803",
    "targetGroup": "Scholar (JHS)",
    "topic": "National governments should outlaw the development and deployment of autonomous lethal AI combat weapons.",
    "context": "Proponents argue that delegating targeting and kill decisions to algorithms violates international humanitarian law and moral accountability. Opponents argue that autonomous defense drones react faster than humans, reducing friendly casualties and collateral error.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-804",
    "targetGroup": "Scholar (JHS)",
    "topic": "Secondary schools should replace tiered academic programs (General Science vs. General Arts) with an interdisciplinary curriculum.",
    "context": "Advocates argue that early streaming forces premature career choices and deprives humanities students of STEM literacy and vice versa. Opponents argue that early specialization is required to master the advanced prerequisites needed for university medicine and engineering.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-805",
    "targetGroup": "Scholar (JHS)",
    "topic": "Developing nations should place heavy export tariffs on raw mineral ores to force local industrial refining.",
    "context": "Proponents argue that unprocessed mineral exports perpetuate the resource curse, whereas domestic value addition creates industrial jobs. Economists caution that export taxes can deter foreign direct investment, violate trade treaties, and fail if domestic refining infrastructure is lacking.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-901",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary schools should allow pupils to bring domestic pets into class on Friday afternoons.",
    "context": "Proponents argue that animal interactions teach empathy, lower stress, and make biology lessons memorable. Opponents raise concerns about animal bites, hygiene issues, and severe allergic reactions among pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-902",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "All classroom academic learning should occur through interactive games rather than paper exercises.",
    "context": "Advocates claim active gameplay increases enthusiasm, problem-solving speed, and peer teamwork. Skeptics maintain that quiet individual desk work builds patience, handwriting stamina, and focused concentration.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-903",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School canteens should completely ban processed sweets and sugary snacks during break time.",
    "context": "Supporters emphasize preventing childhood tooth decay, sugar crashes, and poor dietary habits early in life. Opponents believe young children need quick energy and that teaching moderate self-control is better than outright bans.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-904",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Pupils should be allowed to choose their own classroom desk seating arrangements.",
    "context": "Supporters argue that choosing seats boosts personal autonomy and lets students sit next to comfortable learning partners. Opponents caution that unassigned seating leads to noisy cliques, distractions, and isolation of quieter pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-905",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Daily outdoor physical exercise should be mandatory for every single primary school pupil.",
    "context": "Advocates highlight the health benefits of cardiovascular fitness, bone strength, and reducing childhood obesity. Critics note that children have differing physical capabilities and should not be forced into activities that cause stress.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-901",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should install solar panels to generate all their own electricity off-grid.",
    "context": "Proponents argue that solar power provides clean, renewable energy and saves money while shielding schools from power outages. Opponents point out high initial battery installation costs and maintenance expenses during rainy seasons.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-902",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Every upper primary school in Ghana should manage an active vegetable farm plot run by pupils.",
    "context": "Advocates argue that hands-on farming instills respect for agriculture, teaches practical biology, and supplies fresh food. Opponents argue that farm labor can be physically exhausting and detract from preparation for academic assessments.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-903",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Paper currency notes should be phased out entirely in favor of mobile money payments.",
    "context": "Supporters emphasize faster accounting, reduced theft risk, and improved tracking of commerce. Opponents caution that digital networks suffer from connectivity drops and exclude unbanked rural populations lacking smartphones.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-904",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Basic 4 to 6 students should be permitted to use smartphones in class for academic research.",
    "context": "Supporters believe immediate access to online reference materials builds independent research skills. Opponents argue that smartphones introduce major distractions like games and social media while deepening inequality among pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-905",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should ban all competitive ranking of students by position on terminal report cards.",
    "context": "Advocates claim rank ordering causes anxiety, low self-esteem, and counterproductive rivalry between children. Traditionalists argue that rankings motivate students to work harder and reflect real-world competitive benchmarks.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-902",
    "targetGroup": "Scholar (JHS)",
    "topic": "Public schools should replace all physical printed textbooks with digital e-reader repositories.",
    "context": "Proponents point out that digital libraries store millions of titles at low unit cost and allow instant updating of science textbooks. Critics argue that screens cause ocular fatigue, require power and internet infrastructure, and lack the sensory focus of printed books.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2001",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every Basic 1 to 3 classroom should have a quiet reading corner with floor mats instead of only wooden desks.",
    "context": "Supporters argue that soft reading mats make storybooks welcoming and comfortable for young learners. Opponents argue that floor mats get dusty quickly and reduce space for proper handwriting posture at desks.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2002",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Primary school pupils should take turns serving as class prefect every week instead of electing one prefect for the whole term.",
    "context": "Advocates say rotating leadership gives every child confidence and teaches shared responsibility. Critics argue that a weekly rotation is confusing and prevents experienced prefects from maintaining steady order.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2003",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should teach traditional Ghanaian folktales (Ananse stories) every day before teaching foreign fairy tales.",
    "context": "Proponents believe Ananse stories preserve local moral wisdom, proverbs, and cultural identity. Opponents argue that children benefit most from reading a balanced mix of stories from all around the world.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2004",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Lower primary pupils should plant and care for their own potted flower or vegetable at school.",
    "context": "Supporters say caring for a living plant builds patience, responsibility, and observation skills. Opponents note that watering pots can create mud spills and attract insects near the classroom.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-2005",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Water bottles should be the only drink container allowed in school bags, replacing single-use plastic water sachets.",
    "context": "Advocates highlight that reusable bottles stop plastic sachet litter from choking school drains. Opponents point out that reusable bottles can be lost or broken, and sachet water is cheap and easy to replace.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "All upper primary pupils in Ghana should learn basic swimming and water safety as part of Physical Education.",
    "context": "Supporters argue that water safety saves lives near rivers, lakes, and beaches while providing full-body exercise. Opponents point out that most schools lack safe swimming pools and certified lifeguards.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Town assemblies should ban loud public address loudspeakers after 8:00 PM in residential neighborhoods.",
    "context": "Advocates contend that night noise pollution disrupts children's sleep, homework concentration, and health. Opponents argue that evening community gatherings, religious vigils, and cultural events are vital social traditions.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Basic schools should award marks for community service and environmental cleanliness on terminal report cards.",
    "context": "Proponents say grading civic responsibility encourages learners to keep their communities clean and help others. Critics argue that kindness and cleanliness are hard to measure fairly with exam numbers.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Every market in Ghana should require shoppers to bring reusable woven baskets instead of using black polythene bags.",
    "context": "Supporters argue that woven baskets support local weavers and eliminate non-biodegradable plastic pollution in soil and gutters. Opponents note that polythene bags are waterproof and convenient for carrying wet fish or meat.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-2005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Upper primary pupils should learn to repair simple household electronics and bicycles in Creative Arts & Design.",
    "context": "Advocates argue that hands-on repair skills reduce electronic waste and teach practical engineering early. Critics worry about safety hazards from sharp tools and soldering irons for 9-to-11-year-old pupils.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2001",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghanaian cities should dedicate 30% of urban road space exclusively to protected bicycle lanes and Bus Rapid Transit (BRT).",
    "context": "Supporters argue that dedicated transit and cycling corridors slash carbon emissions, reduce trotro commuter delays, and improve public health. Opponents contend that narrowing existing lanes for private cars and freight trucks will worsen immediate gridlock.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2002",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghana should mandate that at least 60% of all exported cocoa beans be processed into finished chocolate and cocoa products domestically.",
    "context": "Proponents argue that domestic value addition captures billions in retail revenue and creates skilled agro-industrial jobs. Economists caution that high tariffs in importing markets and cold-chain logistics costs make exporting finished chocolate challenging.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2003",
    "targetGroup": "Scholar (JHS)",
    "topic": "National examinations like the BECE should replace timed memory-recall papers with open-book analytical problem-solving assessments.",
    "context": "Advocates argue that in the age of information technology, real-world competence depends on critical synthesis and applying knowledge rather than rote memorization. Opponents argue that foundational facts must be committed to memory for rapid thinking and equitable testing.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2004",
    "targetGroup": "Scholar (JHS)",
    "topic": "Genetically modified drought-resistant crops should be widely adopted by smallholder farmers across northern Ghana.",
    "context": "Supporters argue that bioengineered seeds protect harvests against climate-change droughts and pests while boosting food security. Critics warn of seed patent dependency on multinational corporations and potential loss of indigenous heirloom crop biodiversity.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-2005",
    "targetGroup": "Scholar (JHS)",
    "topic": "Voting in national and district assembly elections should be legally compulsory for all eligible citizens over age 18.",
    "context": "Proponents argue that compulsory turnout ensures government legitimacy, reduces voter apathy, and forces politicians to serve all socioeconomic groups. Opponents contend that democratic freedom includes the right to abstain and that forced voting produces uninformed ballots.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3001",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "School children should be allowed to bring their own lunch from home instead of eating school food.",
    "context": "Supporters argue that home food is healthier and children know what they like. Opponents contend that school food ensures all children eat a balanced meal and reduces bullying.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3002",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Every classroom should have a pet animal.",
    "context": "Supporters argue that pets teach children responsibility and kindness. Opponents contend that some children are allergic, and pets need care that may not be available.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3003",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Children should have at least one hour of playtime every school day.",
    "context": "Supporters argue that play is important for health and social skills. Opponents contend that too much playtime takes away from learning.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3004",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Homework should be banned for Basic 1-3 students.",
    "context": "Supporters argue that young children need rest and family time. Opponents contend that homework builds good study habits early.",
    "isCentral": true
  },
  {
    "id": "tt-debate-nov-3005",
    "targetGroup": "Novice (Basic 1-3)",
    "topic": "Schools should give prizes for good behaviour, not just good grades.",
    "context": "Supporters argue that this encourages kindness and respect. Opponents contend that grades are the main measure of school success.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3001",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Ghanaian schools should ban plastic bags and use only paper or cloth bags.",
    "context": "Supporters argue that plastic pollution harms the environment. Opponents contend that plastic bags are cheap and convenient for families.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3002",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Students should be allowed to use mobile phones in school for learning.",
    "context": "Supporters argue that phones can help with research and learning apps. Opponents contend that phones cause distraction and cheating.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3003",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Every school should have a vegetable garden managed by students.",
    "context": "Supporters argue that gardens teach science and provide fresh food. Opponents contend that gardening takes time away from classes.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3004",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Children should be paid for getting good grades.",
    "context": "Supporters argue that rewards motivate students. Opponents contend that learning should be its own reward.",
    "isCentral": true
  },
  {
    "id": "tt-debate-app-3005",
    "targetGroup": "Apprentice (Basic 4-6)",
    "topic": "Schools should teach students how to manage money from a young age.",
    "context": "Supporters argue that financial skills are essential for life. Opponents contend that young children are too young to understand money.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3001",
    "targetGroup": "Scholar (JHS)",
    "topic": "Ghanaian cities should dedicate 30% of road space exclusively to bicycles and non-motorized transport.",
    "context": "Supporters argue that this reduces traffic and pollution. Opponents contend that roads are already congested and cycling infrastructure is expensive.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3002",
    "targetGroup": "Scholar (JHS)",
    "topic": "Artificial intelligence should be used to grade students' essays in Ghanaian schools.",
    "context": "Supporters argue that AI can grade faster and reduce teacher workload. Opponents contend that AI may not understand cultural context and can be biased.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3003",
    "targetGroup": "Scholar (JHS)",
    "topic": "Social media does more harm than good for Ghanaian teenagers.",
    "context": "Supporters argue that social media causes anxiety and cyberbullying. Opponents contend that it connects friends and provides learning opportunities.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3004",
    "targetGroup": "Scholar (JHS)",
    "topic": "The Ghanaian government should provide free Wi-Fi in all public schools.",
    "context": "Supporters argue that internet access is essential for modern education. Opponents contend that the cost is too high and content filtering is difficult.",
    "isCentral": true
  },
  {
    "id": "tt-debate-sch-3005",
    "targetGroup": "Scholar (JHS)",
    "topic": "Students should be allowed to choose their own subjects from Basic 7 instead of following a fixed curriculum.",
    "context": "Supporters argue that choice increases engagement and prepares students for careers. Opponents contend that a broad curriculum ensures all students learn essential skills.",
    "isCentral": true
  }
];
