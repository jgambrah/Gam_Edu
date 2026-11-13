import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Measured, engaging voice suited for JHS learners; pause briefly after key scientific and moral insights.',
): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Strictly no text, letters, numbers, or signage anywhere in the artwork. Keep a calm, uncluttered area for text.`,
  narration,
});

interface Guide {
  overview: string;
  lessonMinutes: number;
  goals: string[];
  subjects: Array<[string, string]>;
  before: string[];
  during: string[];
  after: string[];
  discussion: string[];
  reflection: string[];
  maths?: Array<{ task: string; answer: string }>;
  support: string[];
  stretch: string[];
  localise: string[];
  discoveryStatus?: NonNullable<PilotStory['teacherGuide']>['discoveryStatus'];
  investigation?: NonNullable<PilotStory['teacherGuide']>['investigation'];
  factCheck?: NonNullable<PilotStory['teacherGuide']>['factCheck'];
}

interface Spec {
  key: string;
  title: string;
  summary: string;
  classIds: Classification['classIds'];
  ageMin: number;
  ageMax: number;
  readingLevel: Classification['readingLevel'];
  difficulty: number;
  genres: Classification['genres'];
  themes: Classification['themes'];
  objectives: Classification['objectives'];
  ghanaianContext: Classification['ghanaianContext'];
  culturalTags?: string[];
  wpm: number;
  paceWord: string;
  palette: [string, string];
  voice: string;
  characters: string[];
  music: string;
  pages: Page[];
  activities: Acts;
  glossary: PilotStory['glossary'];
  culturalNotes: string[];
  reviewQuestions: string[];
  guide: Guide;
}

const words = (pages: Page[]) => pages.reduce((n, p) => n + p.text.trim().split(/\s+/).length, 0);

const mk = (s: Spec): PilotStory => {
  const speakingSec = (words(s.pages) / s.wpm) * 60;
  const g = s.guide;
  const classification: Classification = {
    schemaVersion: CLASSIFICATION_VERSION,
    language: 'en',
    narrationLocale: 'en-GH',
    classIds: s.classIds,
    ageMin: s.ageMin,
    ageMax: s.ageMax,
    readingLevel: s.readingLevel,
    difficulty: s.difficulty,
    genres: s.genres,
    themes: s.themes,
    objectives: s.objectives,
    ghanaianContext: s.ghanaianContext,
    ...(s.culturalTags ? { culturalTags: s.culturalTags } : {}),
    estimatedDurationSec: Math.max(60, Math.round((speakingSec * 1.6) / 10) * 10),
  };
  return {
    key: s.key,
    set: 'extension',
    title: s.title,
    summary: s.summary,
    classification,
    palette: s.palette,
    characters: s.characters,
    narrationPlan: {
      voice: s.voice,
      pace: `${s.paceWord} (about ${s.wpm} words per minute)`,
      notes: [
        'Read dialogue with distinct, natural voices for each JHS student, teacher, and community specialist.',
        'Pause for two seconds at each comprehension check so learners can reason before answering.',
        'Never rush the final page: let the scientific and moral synthesis settle clearly.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
      'Is anything here scientifically inaccurate, stereotyped, or unsafe for adolescents?',
      ...s.reviewQuestions,
    ],
    pages: s.pages,
    activities: s.activities,
    glossary: s.glossary,
    teacherGuide: {
      overview: g.overview,
      lessonMinutes: g.lessonMinutes,
      learningGoals: g.goals,
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'approved' as const })),
      beforeReading: g.before,
      whileReading: g.during,
      afterReading: g.after,
      discussion: g.discussion,
      reflection: g.reflection,
      mathsExtension: g.maths ?? [],
      differentiation: { support: g.support, stretch: g.stretch },
      culturalNotes: s.culturalNotes,
      localiseThis: g.localise,
      ...(g.discoveryStatus ? { discoveryStatus: g.discoveryStatus } : {}),
      ...(g.investigation ? { investigation: g.investigation } : {}),
      ...(g.factCheck ? { factCheck: g.factCheck } : {}),
    },
  };
};

/**
 * Batch 37: Integrated Junior High School (Basic 7 to Basic 9 / JHS 1 to 3) Stories 2 to 8.
 * Mapped to the official 2020/2021 NaCCA Common Core Programme (CCP) standards across
 * Integrated Science, Social Studies, and Religious and Moral Education (RME).
 */
export const BATCH_37_STORIES: PilotStory[] = [
  // 1 (Story 2 of the 8-story JHS series)
  mk({
    key: 'the-finish-line-choice',
    title: 'The Finish-Line Choice',
    summary:
      'Before the circuit athletics trials, thirteen-year-old Kofi feels small beside taller JHS 3 sprinters and is pressured to drink an unlabelled “booster”. Guided by human physiology, assertive refusal skills, and moral integrity, he chooses real nutrition and honest effort.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'school-life', 'educational'],
    themes: ['school', 'health-and-wellbeing', 'friendship', 'peer-pressure'],
    objectives: ['reasoning', 'responsibility', 'emotional-intelligence', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'school-sports', 'moral-values'],
    wpm: 125,
    paceWord: 'Steady, relatable, and resolute',
    palette: ['#15803d', '#d97706'],
    voice:
      'Relatable teen voices for Kofi, Esi, and Ibrahim; pressured older-boy voice for Baffour; calm guidance voice for Madam Mensah',
    characters: [
      'Kofi: a thirteen-year-old Ghanaian JHS 2 sprinter in a green sports vest, lean and observant.',
      'Esi: his fourteen-year-old classmate and 400-metre runner, confident and scientifically sharp.',
      'Ibrahim: Kofi’s relay teammate and close friend, principled and calm.',
      'Baffour: a taller sixteen-year-old JHS 3 student holding an unlabelled dark plastic bottle.',
      'Madam Mensah: the school Guidance and Counselling Coordinator and Social Studies teacher.',
    ],
    music: 'Rhythmic heartbeat percussion with warm acoustic guitar notes, building quietly to an uplifting finish (placeholder)',
    pages: [
      pg(
        '🏃',
        'Two days before the circuit inter-schools athletics trials, Kofi stood beside the 200-metre track feeling unusually small. Several JHS 3 boys had shot up over the past year, their shoulders broader and their voices deeper. Kofi’s own growth spurt had barely begun. Behind the sports pavilion, Baffour held out a dark plastic bottle. “Drink half of this before Friday’s heats,” he whispered. “Energy drink, with a painkiller tablet crushed inside. You will not feel tired at all. Everyone chasing a medal uses a booster.” Kofi looked at the bottle. He badly wanted to keep up with the big boys. For a moment, his hand almost moved.',
        'Behind a school sports pavilion, a taller older student offers an unlabelled dark plastic bottle to thirteen-year-old Kofi in a green athletics vest.',
      ),
      pg(
        '🧠',
        'Then Kofi stepped back and walked over to Esi and Ibrahim under the neem tree. Esi frowned. “That bottle cannot give you energy, Kofi. We learned why in Science. Your muscles get energy from cellular respiration: cells break down glucose from food, and they release the most energy when they use oxygen. Caffeine itself provides no nutritional energy. It stimulates the brain mainly by blocking adenosine, a chemical that helps us feel sleepy. That can increase alertness and reduce the feeling of fatigue, but it may also cause a racing heartbeat, anxiety or sleep problems, especially in excess. And nobody knows what that tablet is. If it is a strong painkiller such as tramadol, it is worse: it dulls the pain signals that warn you. You could tear a muscle, collapse from the heat, or even have a seizure before you feel anything wrong.”',
        'Under a shady neem tree, Esi sketches a clear notebook diagram showing muscle cellular respiration contrasted against racing heartbeats and blocked brain pain signals.',
      ),
      pg(
        '🗣️',
        'Later that morning in Social Studies, Madam Mensah taught a lesson on adolescent development and peer pressure. “During puberty, hormones such as testosterone in boys and oestrogen in girls trigger growth spurts,” she explained. “Each body follows its own normal timetable. Comparing yourself with an older classmate makes you feel insecure for no good reason—and negative peer pressure feeds on that insecurity.” Assertiveness, she said, means holding your ground calmly. On the board she wrote three steps: say a firm “No” without apologising, state the harm plainly, and walk away towards supportive friends or a trusted adult.',
        'Madam Mensah teaching a JHS class beside a chalkboard showing normal adolescent growth curves and three numbered assertive refusal steps.',
      ),
      pg(
        '⚖️',
        'In the last period, RME, the class discussed how moral choices test character when no referee is watching. Ibrahim raised his hand. “In Islam, life and a clear mind are sacred trusts. Anything that intoxicates the mind or harms the body is forbidden, whatever nickname people give it.” Esi agreed. “Christians are taught that our bodies belong to God, so we should practise self-control and win honestly.” Kofi remembered what his grandmother often said in Twi about suban pa—good character. It outlasts every trophy won by cheating.',
        'Bright JHS classroom scene where Ibrahim, Esi, and Kofi contribute thoughtfully during an RME discussion on bodily integrity and honest competition.',
      ),
      pg(
        '🛑',
        'After closing, Baffour blocked Kofi near the school gate. “Are you scared, small boy? Or do you want our school to lose?” Kofi steadied his breathing and used Madam Mensah’s steps. “No, Baffour. I do not know what is in that bottle. Unknown tablets mixed with energy drinks can harm the heart and the nervous system. I am not putting that into my body.” This was assertiveness, not anger. He did not argue or trade insults. He walked straight with Ibrahim to Madam Mensah’s office and quietly reported the bottle, so that nobody would collapse on Friday.',
        'At the school gate, Kofi stands upright with a calm, firm open hand refusing the dark bottle while Ibrahim stands supportively at his side.',
      ),
      pg(
        '🏅',
        'Madam Mensah and the Physical Education master acted quietly before race day. They confiscated the mixture and arranged health counselling for Baffour, without shaming him in public. On Friday, Kofi ran on boiled yam and kontomire stew from the evening before, clean water, and eight hours of sleep. He took the curve of the 200 metres smoothly and finished a proud second—enough to make the circuit team for the district games. Crossing the white line strong and clear-headed, he knew his real victory had been won two days earlier.',
        'Kofi sprinting cleanly across a white chalk finish line on a sunny Ghanaian school grass track while classmates cheer from the touchline.',
      ),
    ],
    activities: [
      {
        id: 'fc-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is it scientifically wrong to call caffeine mixed with an unprescribed painkiller an "energy booster"?',
        options: [
          'Caffeine provides the same energy as glucose and slows the heartbeat',
          'Painkillers convert directly into protein and water inside leg muscles',
          'Muscles need food glucose for energy; caffeine only stimulates alertness',
        ],
        correctIndex: 2,
      },
      {
        id: 'fc-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why had several JHS 3 boys developed broader shoulders and deeper voices earlier than Kofi?',
        options: [
          'Pubertal hormones trigger normal growth spurts at different ages in adolescents',
          'Younger students do not carry out cellular respiration until JHS 3',
          'Only athletes who take supplements experience puberty',
        ],
        correctIndex: 0,
      },
      {
        id: 'fc-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Which action demonstrates assertive refusal when facing negative peer pressure?',
        options: [
          'Shouting insults and starting a fight behind the sports pavilion',
          'Say a firm No, name the risk plainly, walk away, and alert a trusted adult',
          'Accepting the bottle to avoid teasing and hiding it in a schoolbag',
        ],
        correctIndex: 1,
      },
      {
        id: 'fc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: The night before an exam, a classmate offers Ama an unlabelled "brain tablet" to stay awake. What is the best response?',
        options: [
          'Refuse firmly, decline unknown tablets, and stick to her revision plan',
          'Take half a tablet to be polite',
          'Accept it and keep it in her bag for later',
        ],
        correctIndex: 0,
      },
      {
        id: 'fc-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put Kofi’s responsible decision-making steps in chronological order.',
        items: [
          'Baffour pressures Kofi to drink an unlabelled concoction with painkillers.',
          'Esi explains that cellular respiration, not stimulants, gives real energy.',
          'Kofi recalls refusal skills, self-control, and the value of suban pa.',
          'Kofi calmly refuses the bottle and alerts Madam Mensah confidentially.',
        ],
      },
      {
        id: 'fc-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'assertiveness',
        definition: 'Expressing one’s values, rights, and boundaries calmly and firmly without aggression or passive surrender.',
        distractors: [
          'Bullying younger students into following orders',
          'Agreeing silently with unsafe behaviour to fit into a group',
        ],
      },
    ],
    glossary: [
      {
        word: 'respiration',
        definition: 'The biochemical process inside cells that breaks down glucose (with oxygen in aerobic respiration) to release usable energy.',
        pages: [2],
      },
      {
        word: 'adenosine',
        definition: 'A naturally occurring chemical messenger involved in sleepiness; caffeine blocks some of its receptors and can temporarily increase alertness.',
        pages: [2],
      },
      {
        word: 'puberty',
        definition: 'The developmental stage during adolescence when hormones trigger rapid growth and reproductive maturity.',
        pages: [3],
      },
      {
        word: 'assertiveness',
        definition: 'Communicating a clear, respectful "No" or personal boundary firmly without hostility or apology.',
        pages: [3, 5],
      },
      {
        word: 'character',
        definition: 'An Akan concept meaning upright character, self-discipline, and honourable conduct.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B8.3.1.1 / B9.3.1.1 & B8.5.2.1: Human body systems, cellular respiration, and dangers of drug/substance abuse), Social Studies (B7.2.1.1 / B8.2.1.1: Strand 2, Sub-strand 1: Adolescent Reproductive Health, puberty, body image, and peer pressure), and RME (B8.5.1.1 / B9.5.1.1: Strand 5: Ethics & Moral Life—moral decision-making, self-control, and substance abuse prevention).',
      'FDA Ghana & GES SHEP Relevance: Addresses high-caffeine drinks and the risks of unknown or unprescribed medicines; the story does not identify the unknown tablet as tramadol.',
      'Safety Guardrail: The text deliberately gives no quantities or preparation detail for the mixture; do not add any when localising.',
      'Science note: a 200-metre sprint relies heavily on anaerobic respiration, so the story says cells release the most energy with oxygen, not only with oxygen.',
    ],
    reviewQuestions: [
      'Confirm physiological accuracy distinguishing aerobic respiration from CNS opioid analgesia and stimulant tachycardia.',
      'Ensure puberty timing differences are framed positively to reassure early and late maturers alike.',
    ],
    guide: {
      overview:
        'Equips JHS students to resist substance abuse and peer pressure by combining accurate human biology, puberty reassurance, practical refusal language, and interfaith moral ethics.',
      lessonMinutes: 45,
      goals: [
        'Contrast genuine cellular energy release (respiration) with stimulant and opioid effects on the heart and brain.',
        'Explain why adolescent growth spurts occur on varied biological schedules.',
        'Practise the three-step assertive refusal technique.',
        'Relate Christian, Islamic, and traditional Ghanaian teachings on self-control to real adolescent choices.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.3.1.1 / B9.3.1.1 & B8.5.2.1)', 'Respiration, nervous/endocrine systems, and substance abuse'],
        ['Social Studies (NaCCA CCP B7.2.1.1 / B8.2.1.1)', 'Adolescent health, self-identity, and peer pressure'],
        ['Religious & Moral Education (NaCCA CCP B8.5.1.1 / B9.5.1.1)', 'Moral decision-making and avoiding drugs'],
      ],
      before: ['Ask: An energy drink contains sugar and caffeine. Which of the two can muscles actually use in respiration, and what does the other one do?'],
      during: ['Pause on Page 5 and examine why Kofi stays calm rather than arguing with Baffour.'],
      after: ['Role-play assertive refusal in pairs for sports boosters, exam leakage, and unsafe outings.'],
      discussion: ['Why are pain signals essential for protecting muscles and organs during sport?'],
      reflection: ['Which personal goal or family value helps you stand firm against crowd pressure?'],
      maths: [
        {
          task: 'Kofi’s resting pulse is 72 bpm. A gentle warm-up raises it by 50%. Find his warm-up heart rate. A student who misused a stimulant recorded a pulse 150% above the same resting value while sitting still. Find that heart rate and explain why it is alarming at rest.',
          answer: '108 bpm (warm-up). 180 bpm while sitting still. A pulse of 180 bpm while sitting still is an urgent warning sign requiring prompt medical assessment; exercise heart rates vary by age and individual.',
        },
      ],
      support: ['Provide printed refusal sentence starters for pair practice.'],
      stretch: ['Research FDA Ghana regulations on prescription analgesics and caffeine labelling.'],
      localise: ['Introduce your school’s actual SHEP coordinator and safe local pre-match meals.'],
      factCheck: [
        {
          claim: 'Caffeine and unprescribed painkillers do not provide cellular energy, and combining them masks physiological warning signals.',
          explanation: 'Cells derive metabolic energy from glucose via cellular respiration. Stimulants only block adenosine receptors to mask fatigue, while analgesics blunt nociceptive pain signals, risking severe tissue damage.',
          reference: 'NaCCA CCP Integrated Science B8.3.1.1 / B9.3.1.1 & FDA Ghana public health advisories.',
        },
      ],
    },
  }),

  // 2 (Story 3 of the 8-story JHS series)
  mk({
    key: 'the-hidden-kilowatts',
    title: 'The Hidden Kilowatts',
    summary:
      'When compound-house prepaid electricity credits vanish in days and a neighbour proposes an illegal meter bypass, JHS 2 classmates Mansa and Tetteh audit appliance wattage, uncover a faulty fridge seal and overloaded socket, and prove why conservation and honesty beat power theft.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'family'],
    themes: ['technology', 'community', 'family'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'urban-compound-life', 'civic-honesty'],
    wpm: 125,
    paceWord: 'Practical, investigative, and clear',
    palette: ['#eab308', '#1e3a8a'],
    voice:
      'Sharp, curious teen voices for Mansa and Tetteh; anxious tenant voice for Uncle Nii; calm, principled electrician voice for Master Owusu',
    characters: [
      'Mansa: a fourteen-year-old Ghanaian JHS 2 student holding a notebook and calculator, observant and methodical.',
      'Tetteh: her thirteen-year-old cousin in the same compound house, keen on physics and electronics.',
      'Uncle Nii: a frustrated compound-house tenant staring at a beeping prepaid electricity meter.',
      'Master Owusu: an Energy Commission-certified electrician in insulated boots, carrying a multimeter.',
    ],
    music: 'Crisp acoustic plucking with a steady rhythmic tick like a meter pulse, resolving warmly (placeholder)',
    pages: [
      pg(
        '⚡',
        'Every Thursday evening in Asafo, the prepaid electricity meter on the compound-house wall began its sharp warning beep—credit almost finished again. Tenants blamed one another around the courtyard. Uncle Nii lowered his voice: “A man at the lorry park offered to connect our heavy sockets so that they bypass the meter, for a small fee, so our credits stop draining.” Mansa exchanged a worried look with her cousin Tetteh. “Before anyone touches illegal wires, Uncle,” Mansa asked respectfully, “may Tetteh and I calculate where the kilowatt-hours are actually going?”',
        'In a Ghanaian compound-house courtyard at dusk, tenants gather anxiously beneath a wall-mounted prepaid electricity meter flashing a red low-credit light while Mansa holds up her science notebook.',
      ),
      pg(
        '📊',
        'Mansa and Tetteh read the rating plate on every appliance—never touching live wires—and recorded each power rating in watts (W). “Electrical power is voltage multiplied by current: P = V × I,” Tetteh said. “But the meter charges us for energy. Energy is power in kilowatts multiplied by time in hours, E = P × t, measured in kilowatt-hours (kWh).” They began to calculate. The compound’s ten old 60-watt filament bulbs, burning five hours a night, used 3.0 kWh; ten 9-watt LEDs would need only 0.45 kWh. The 1,500-watt pressing iron, used for two hours, took another 3.0 kWh. And Auntie Akweley’s secondhand refrigerator had a torn rubber door seal, so its 300-watt compressor ran non-stop, day and night.',
        'Mansa and Tetteh inspecting the metal wattage rating label on the back of an unplugged pressing iron and checking a torn rubber door gasket on an old refrigerator, recording figures in a table.',
      ),
      pg(
        '🔥',
        'On Saturday, licensed electrician Master Owusu came to inspect the courtyard wiring. He praised the audit, then pointed to a sharper danger. Three tenants had plugged a kettle, a hotplate, and a television into one cheap extension board. Its plastic casing had turned brown and brittle. “Too much current through a thin cable makes it heat up until the insulation melts,” he warned. “A proper circuit breaker or fuse cuts the current before that happens. An illegal bypass is often done with the wrong cable, and it can leave the wiring without that protection. That is how compound-house fires and fatal electric shocks start.”',
        'Electrician Master Owusu holds up a melted multi-socket adapter for compound tenants, pointing to a proper wall distribution board with circuit breakers.',
      ),
      pg(
        '🏛️',
        'Tetteh shared what the class had learned in Social Studies. “Uncle Nii, please, stolen power is not free,” he said gently. “When people bypass meters, the power company loses the money it needs to maintain transformers and cables. Unmetered loads can also overload a local transformer until it trips, and then the whole neighbourhood sits in darkness. Honest customers can end up paying higher tariffs to cover the losses. And tampering with a meter is a criminal offence in Ghana.”',
        'Split illustration showing a sparking overloaded pole transformer in darkness beside well-maintained lines serving a lit clinic and school.',
      ),
      pg(
        '⚖️',
        'Uncle Nii rubbed his chin. Auntie Akweley spoke quietly. “Whether in church, at the mosque, or by family custom, taking what you have not paid for is theft—even when the wire is hidden inside the wall. My Muslim neighbours call it a breach of amanah, trust. My pastor says integrity means doing right in secret just as in public. And our elders say a good name is better than riches.” Uncle Nii took out his phone and deleted the wireman’s number on the spot.',
        'Compound-house neighbours nodding in agreement around a wooden table in the courtyard as Uncle Nii deletes a contact on his phone with relief and resolve.',
      ),
      pg(
        '💡',
        'Together, the tenants replaced the torn refrigerator gasket so cold air stopped escaping. They swapped the old filament bulbs for 9-watt LEDs, reduced ironing from two hours each day to one three-hour session per week, and threw out the scorched extension board. Two weeks later, their prepaid credit lasted nearly twice as long—legally and safely. Pinning the wattage chart on the veranda wall, Mansa smiled. “Physics showed us the leak, civic duty protects our transformer, and honesty lets every room sleep safely.”',
        'Bright, tidy compound veranda with cool white LED bulbs, a neatly sealed refrigerator, and Mansa pinning a colourful household Energy Conservation Chart beside a green-lit prepaid meter.',
      ),
    ],
    activities: [
      {
        id: 'hk-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'A 2,000 W (2 kW) electric kettle boils water for a total of 0.5 hours across a day. How much electrical energy does it consume?',
        options: [
          '4,000 kilowatt-hours (kWh)',
          '1.0 kilowatt-hour (kWh)',
          '0.025 kilowatt-hours (kWh)',
        ],
        correctIndex: 1,
      },
      {
        id: 'hk-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does plugging high-wattage appliances like a hotplate and kettle into one thin extension cord create a severe fire risk?',
        options: [
          'Together they draw large current that overheats cables and melts insulation',
          'Voltage disappears completely whenever two plugs share a socket',
          'LED bulbs send cold air back down the extension cable',
        ],
        correctIndex: 0,
      },
      {
        id: 'hk-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How does illegal meter bypassing harm the wider Ghanaian community?',
        options: [
          'It lowers the wattage rating of old refrigerators',
          'It increases hydro dam water levels at Akosombo automatically',
          'It can overload transformers, create fire hazards, and hurt power supply',
        ],
        correctIndex: 2,
      },
      {
        id: 'hk-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A shop runs a 100 W fan for 10 hours and a 1,000 W heater for 30 minutes. Which uses more energy?',
        options: [
          'The heater, because its power rating is higher',
          'They use exactly the same energy',
          'The fan: 1.0 kWh against 0.5 kWh for the heater',
        ],
        correctIndex: 2,
      },
      {
        id: 'hk-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the compound house’s problem-solving journey in chronological order.',
        items: [
          'Rapidly draining prepaid credits tempt a tenant to consider a meter bypass.',
          'Mansa and Tetteh audit appliance wattages and hours to calculate kWh used.',
          'Master Owusu shows how overloaded extension sockets create fire hazards.',
          'Tenants mend the fridge seal, batch-iron clothes, and switch to LED bulbs.',
        ],
      },
      {
        id: 'hk-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'meter',
        definition: 'A unit of electrical energy equal to one kilowatt (1,000 watts) of power used steadily for one hour.',
        distractors: [
          'The speed at which electrons travel through a copper wire in one second',
          'A safety switch that melts when current becomes too small',
        ],
      },
    ],
    glossary: [
      {
        word: 'power',
        definition: 'The rate at which electrical energy is transferred by an appliance, measured in watts (W) or kilowatts (kW), where P = V × I.',
        pages: [2],
      },
      {
        word: 'meter',
        definition: 'An instrument measuring total electrical energy consumed in kilowatt-hours (kWh).',
        pages: [1, 2],
      },
      {
        word: 'fuse',
        definition: 'An automatic safety switch designed to cut off electrical current when an overload or short circuit occurs.',
        pages: [3],
      },
      {
        word: 'tariffs',
        definition: 'The official schedule of rates or prices charged per unit for public utilities such as electricity or water.',
        pages: [4],
      },
      {
        word: 'integrity',
        definition: 'Steadfast honesty and adherence to moral principles even when wrongdoing could be hidden from authorities.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B8.4.2.1 / B9.4.2.1 & B8.4.3.1: Electricity and electronics—power P = VI, energy in kWh, fuses, earthing, circuit breakers, and energy conservation), Social Studies (B7.1.1.2 & B8.4.1.1: Civic responsibility, protecting public utilities, and energy conservation), and RME (B8.6.1.1 / B9.6.1.1: Strand 6: Religion and Economic Life—money, honesty, integrity, and anti-corruption).',
      'BECE Physics Clarity: Distinguishes clearly between Power (rate in watts/kilowatts) and Energy (total consumption in kilowatt-hours = kW × h)—one of the most frequently tested and confused JHS calculations.',
      'Safety Guardrail: Students only read manufacturer rating plates on unplugged appliances; all wiring inspection is performed by an Energy Commission-certified electrician.',
      'Illustrative usage assumptions behind “nearly twice as long”: before, about 18.2 kWh/day; after, about 9.09 kWh/day. These are modelled values; actual savings depend on appliance cycling and usage habits.',
    ],
    reviewQuestions: [
      'Check all P = VI and E = Pt calculations for exact dimensional accuracy (W to kW division by 1,000).',
      'Confirm electrical safety descriptions match ECG / NEDCo and Ghana National Fire Service domestic safety advice.',
    ],
    guide: {
      overview:
        'Turns a familiar Ghanaian compound-house dispute over prepaid meter credit into a hands-on physics, civic citizenship, and moral integrity lesson.',
      lessonMinutes: 45,
      goals: [
        'Calculate electrical power (P = V × I) and domestic electrical energy in kilowatt-hours (E = P × t).',
        'Explain how damaged fridge seals, heating elements, and overloaded sockets waste energy and cause fires.',
        'Analyse the economic and infrastructure damage caused by illegal electricity connections.',
        'Apply RME principles of honesty and trustworthiness to shared utility use.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.4.2.1 / B9.4.2.1 & B8.4.3.1)', 'Electrical power, kWh energy calculations, and domestic safety'],
        ['Social Studies (NaCCA CCP B7.1.1.2 & B8.4.1.1)', 'Civic responsibility and safeguarding national infrastructure'],
        ['Religious & Moral Education (NaCCA CCP B8.6.1.1 / B9.6.1.1)', 'Honesty, integrity, and anti-corruption in daily life'],
      ],
      before: ['Show an unplugged 9 W LED bulb box and an unplugged 1,500 W iron rating plate: roughly how many LED bulbs draw the same power as one iron? (About 167.)'],
      during: ['Pause on Page 2 to verify why 300 W running 24 hours (7.2 kWh/day) beats brief lighting use.'],
      after: ['Conduct a safe home rating-plate survey (unplugged appliances only) and rank top three energy users.'],
      discussion: ['Why do heating and cooling appliances use far more kWh than radios or LEDs?'],
      reflection: ['Which single energy-wasting habit can you help fix in your home or classroom today?'],
      maths: [
        {
          task: 'A 300 W refrigerator with a torn seal runs its compressor continuously for 24 hours. How many kWh does it use in one day, and how much is saved daily if fixing the seal cuts compressor run-time to 10 hours?',
          answer: 'Faulty: 0.3 kW × 24 h = 7.2 kWh/day. Repaired: 0.3 kW × 10 h = 3.0 kWh/day. Daily saving = 4.2 kWh.',
        },
        {
          task: 'At Ghana’s 230 V domestic mains supply, what current (I) does a 2,070 W electric kettle draw? Which standard fuse rating (3 A, 5 A, or 13 A) is appropriate?',
          answer: 'I = P ÷ V = 2,070 ÷ 230 = 9 A. Of the listed ratings, 13 A is the suitable plug-fuse choice for a compatible appliance and plug; the correct protection must also follow the manufacturer’s instructions and applicable electrical standards.',
        },
      ],
      support: ['Provide a conversion triangle card: divide watts by 1,000 first to get kilowatts before multiplying by hours.'],
      stretch: ['Research Energy Commission Ghana star-rating labels (1-star to 5-star) on refrigerators and air conditioners.'],
      localise: ['Reference ECG or NEDCo prepaid/postpaid meters depending on whether your school is in southern or northern Ghana.'],
      factCheck: [
        {
          claim: 'Electrical energy consumed equals power in kilowatts multiplied by time in hours (E = P × t).',
          explanation: 'Meters measure kilowatt-hours (kWh). Overloaded thin extension cords overheat by Joule heating (I²R), causing insulation failure and fire risks.',
          reference: 'NaCCA CCP Integrated Science B8.4.2.1 / B9.4.2.1 & Energy Commission Ghana domestic wiring guidelines.',
        },
      ],
    },
  }),

  // 3 (Story 4 of the 8-story JHS series)
  mk({
    key: 'when-the-drain-pushed-back',
    title: 'When the Drain Pushed Back',
    summary:
      'After an intense downpour floods their market junction and malaria absences follow weeks later, JHS classmates Kukua, Selorm, and Fauzia connect extreme rainfall, the carbon cycle, plastic-choked drains, and Anopheles mosquito breeding to lead a waste-sorting and tree-planting drive.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['weather', 'community', 'health-and-wellbeing'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'sanitation', 'climate-action'],
    wpm: 125,
    paceWord: 'Vivid, analytical, and community-minded',
    palette: ['#0f766e', '#ea580c'],
    voice:
      'Engaged teen voices for Kukua, Selorm, and Fauzia; clear environmental-health voice for Madam Korkor',
    characters: [
      'Kukua: a fourteen-year-old Ghanaian JHS 3 student in uniform, observant and practical.',
      'Selorm: her classmate who loves life-cycle diagrams and environmental science.',
      'Fauzia: their classmate whose mother runs a fabric stall near the market storm drain.',
      'Madam Korkor: a Municipal Environmental Health Officer wearing neat field gear and carrying a clipboard.',
    ],
    music: 'Raindrop kalimba notes clearing into a warm, purposeful highlife guitar groove (placeholder)',
    pages: [
      pg(
        '🌧️',
        'The downpour lasted barely ninety minutes, yet brown floodwater surged over the concrete culvert at Zongo Junction. It soaked three bales of wax print in the stall of Fauzia’s mother. Five weeks later, five students at the school—Selorm’s younger sister among them—were absent with confirmed malaria. “It is the gutter smell that made them sick,” a trader insisted. Kukua was not sure. From the paved walkway she pointed to a tangled dam of sachet-water rubbers, takeaway packs, and silt wedged across the drain mouth. “People blame only the heavy rain,” Fauzia said quietly, “but look at what held the water back.”',
        'Three JHS students standing safely on a dry raised walkway inspecting a concrete roadside storm drain choked with clear plastic water sachets, foam packs, and silt after a flood.',
      ),
      pg(
        '🌍',
        'In Integrated Science, the class took the problem in two halves. “First, why are heavy storms becoming more common?” their teacher asked, sketching the carbon cycle. “Green plants absorb carbon dioxide during photosynthesis and lock the carbon into wood and soil. When we burn fossil fuels, tyres, and heaps of plastic, and cut down trees, extra greenhouse gases build up. They trap heat in Earth’s atmosphere. No one can blame a single storm on climate change, but a warmer atmosphere makes heavy downpours and heatwaves more likely. Second, most plastics are non-biodegradable. Decomposers in the soil cannot break them down, so a sachet can last for decades, blocking drains and leaving pools of stagnant water.”',
        'Chalkboard diagram showing trees absorbing CO₂ vs waste burning releasing greenhouse gases, beside plastic blocking stormwater runoff.',
      ),
      pg(
        '🦟',
        'On Thursday, Municipal Environmental Health Officer Madam Korkor visited to clear up a dangerous misconception. “A choked gutter smells bad, but its smell cannot give you malaria. Neither can drinking dirty water,” she said firmly. “Malaria is caused by a microscopic parasite called Plasmodium. It is spread to people by the bite of an infected female Anopheles mosquito. The mosquito is the vector: it carries the parasite from person to person. Now, where does Anopheles breed? In suitable standing-water habitats, which vary among Anopheles species. Not every puddle suits them, but blocked drains can leave standing pools where some mosquitoes may breed. There the eggs hatch into larvae, the larvae become pupae, and adult mosquitoes emerge within one to two weeks.”',
        'Madam Korkor pointing to a four-stage biological chart of the Anopheles mosquito life cycle beside a stagnant puddle trapped behind plastic bottles.',
      ),
      pg(
        '🏘️',
        'In Social Studies, Fauzia mapped why dumping persisted around the market. Many people tossed empty sachets into gutters, assuming the rain would wash them “away”. Paved compounds left no bare soil or shade trees to slow the runoff. “There is no ‘away’ in a drainage basin,” Selorm told the class. “Every sachet dropped uphill becomes somebody’s flooded stall and mosquito pool downhill. And clearing silted drains costs the municipal assembly money that could have equipped clinics and school laboratories.”',
        'JHS classroom drainage-basin poster tracing a single discarded water sachet rolling down a paved street into a market culvert, causing flood backflow and stagnant mosquito pools.',
      ),
      pg(
        '🤲',
        'In RME, the trio prepared an appeal for Friday mosque announcements, Sunday church notices, and Saturday communal labour. Fauzia began with her mother’s spoiled cloth. Then she quoted the Islamic teaching that cleanliness is part of faith, and that removing a harmful thing from the public path is an act of charity, sadaqah. Kukua added the Christian call to love your neighbour in deed—never dumping waste that floods a neighbour’s home. Selorm ended with Ghanaian communal tradition: keeping compounds and waterways clean honours both the elders and children not yet born.',
        'Fauzia, Kukua, and Selorm presenting neat bilingual sanitation posters to market queens and religious leaders under a market canopy.',
      ),
      pg(
        '♻️',
        'The students did not burn the collected plastic, because burning releases toxic fumes and greenhouse gases. Instead, the school partnered with the market queens and a local plastic buy-back recycler. Students placed colour-coded bins at the lorry stops: green for biodegradable food peels to compost in the school garden, and yellow mesh cages for non-biodegradable sachets and bottles to sell for recycling. They also planted shade trees along the school boundary to absorb carbon dioxide and slow the runoff. When the next heavy rain fell, the cleared culvert flowed freely, and far fewer stagnant pools were left behind.',
        'Vibrant market-junction scene showing separate green compost bins and yellow mesh plastic-sachet recycling cages, newly planted street trees, and rainwater flowing smoothly through a clean drain.',
      ),
    ],
    activities: [
      {
        id: 'wd-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How do deforestation and open burning of waste disrupt the carbon cycle and worsen climate extremes?',
        options: [
          'Fewer trees absorb CO₂, while burning releases heat-trapping greenhouse gases',
          'Trees release plastic polymers into clouds during photosynthesis',
          'Burning plastics destroys carbon atoms completely so they vanish from Earth',
        ],
        correctIndex: 0,
      },
      {
        id: 'wd-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is the exact scientific relationship between choked gutters, mosquitoes, and malaria?',
        options: [
          'Breathing foul air from gutters puts malaria parasites into the lungs',
          'Plasmodium parasites spread through Anopheles mosquitoes in stagnant water',
          'Male houseflies carry malaria from unwashed mangoes into drinking water',
        ],
        correctIndex: 1,
      },
      {
        id: 'wd-c3',
        type: 'comprehension',
        afterPage: 6,
        question: 'Why did the students separate plastics for recycling rather than burning them in an open pit?',
        options: [
          'Burning plastics increases oxygen levels in classroom air',
          'Plastic sachets turn into fertile garden compost within two days if buried',
          'Burning plastics releases toxic smoke; recycling keeps drains clear safely',
        ],
        correctIndex: 2,
      },
      {
        id: 'wd-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate says, "I slept near a smelly gutter, so I will get malaria." Which reply is scientifically correct?',
        options: [
          'Yes, the smell carries Plasmodium into the lungs',
          'Infected female Anopheles mosquitoes spread it; use nets and clear water',
          'No, malaria comes only from drinking dirty water',
        ],
        correctIndex: 1,
      },
      {
        id: 'wd-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the four stages of complete metamorphosis in the mosquito life cycle in the correct biological order.',
        items: [
          'Egg laid on stagnant water',
          'Larva feeding beneath the water surface',
          'Pupa transforming just below the surface',
          'Adult winged mosquito emerging into the air',
        ],
      },
      {
        id: 'wd-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'non-biodegradable',
        definition: 'Unable to be broken down naturally into harmless substances by decomposers such as bacteria and fungi.',
        distractors: [
          'Able to rot quickly into rich compost within a few weeks',
          'Capable of absorbing carbon dioxide through green chlorophyll',
        ],
      },
    ],
    glossary: [
      {
        word: 'photosynthesis',
        definition: 'The continuous natural movement of carbon among the atmosphere, plants, animals, soil, oceans, and fuels.',
        pages: [2],
      },
      {
        word: 'non-biodegradable',
        definition: 'Describing materials such as polythene plastics that microorganisms cannot break down in any useful time, so they persist for decades.',
        pages: [2, 6],
      },
      {
        word: 'Plasmodium',
        definition: 'The single-celled protozoan parasite that causes malaria in humans.',
        pages: [3],
      },
      {
        word: 'vector',
        definition: 'An organism—such as the female Anopheles mosquito in malaria—that transmits a pathogen from one host to another.',
        pages: [3],
      },
      {
        word: 'compost',
        definition: 'Nutrient-rich soil conditioner produced when decomposers break down biodegradable organic waste such as plant peels.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B8.2.1.1: Carbon Cycle, B8.2.2.1: Mosquito Life Cycle, B8.5.1.1: Waste Management, B8.5.4.1: Climate Change), Social Studies (B7.1.1.1 / B8.1.1.1: Environmental degradation and sanitation), and RME (B7.5.1.1 / B8.5.1.1: Cleanliness, neighbourly love, sadaqah, and communal responsibility).',
      'Timing note: malaria cases follow flooding by roughly four to six weeks (mosquito breeding, parasite development inside the mosquito, then incubation in the person).',
      'Critical BECE Science Distinction: Students often lose marks by writing "mosquitoes cause malaria" or "stagnant water causes malaria". Page 3 explicitly distinguishes the causative agent/pathogen (Plasmodium protozoan), the vector (female Anopheles mosquito), and the breeding habitat (stagnant water).',
    ],
    reviewQuestions: [
      'Verify pathogen (Plasmodium) vs vector (female Anopheles) terminology and the 4-stage complete metamorphosis sequence (egg → larva → pupa → adult).',
      'Check that students do not enter flooded storm drains directly; clean-up focuses on source segregation, recycling cages, and dry-ground tree planting.',
    ],
    guide: {
      overview:
        'Unites climate science (carbon cycle & greenhouse gases), vector biology (Plasmodium vs female Anopheles life cycle), municipal sanitation economics, and interfaith civic ethics in a practical Ghanaian market setting.',
      lessonMinutes: 45,
      goals: [
        'Explain how photosynthesis, combustion, and deforestation affect atmospheric carbon dioxide and rainfall extremes.',
        'Distinguish accurately between the malaria pathogen (Plasmodium), vector (female Anopheles mosquito), and breeding site.',
        'Contrast biodegradable organic waste with non-biodegradable plastics and explain why open plastic burning is harmful.',
        'Connect Islamic, Christian, and traditional Ghanaian teachings on cleanliness to source waste segregation.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.2.1.1, B8.2.2.1, B8.5.1.1 & B8.5.4.1)', 'Carbon cycle, mosquito life cycle, waste management, and climate change'],
        ['Social Studies (NaCCA CCP B7.1.1.1 / B8.1.1.1)', 'Sanitation, urban flooding, and sustainable waste management'],
        ['Religious & Moral Education (NaCCA CCP B7.5.1.1 / B8.5.1.1)', 'Cleanliness, communal service, and protecting neighbours'],
      ],
      before: ['Ask: What is the difference between the organism that causes malaria and the insect that carries it?'],
      during: ['Pause on Page 3 to lock in: Pathogen = Plasmodium; Vector = infected female Anopheles; Habitat = stagnant water.'],
      after: ['Set up a two-bin classroom waste-sorting trial (biodegradable paper/peels vs clean recyclable plastics) for one week.'],
      discussion: ['Why does burning plastic heaps solve visual litter for one hour while worsening health and climate problems long-term?'],
      reflection: ['Where did the last empty water sachet or wrapper in your hand end up?'],
      maths: [
        {
          task: 'If 450 students at a JHS each drop 2 empty water sachets a day on 5 school days, how many sachets enter drains weekly? If about 500 empty sachets weigh one kilogram, how many kilograms of plastic could be recycled instead over a 12-week term?',
          answer: '4,500 sachets per week (450 × 2 × 5). Over 12 weeks = 54,000 sachets ≈ 108 kg of recyclable plastic (54,000 ÷ 500).',
        },
      ],
      support: ['Provide flash-cards separating "Pathogen (Plasmodium)", "Vector (female Anopheles)", and "Prevention (insecticide-treated nets + drain clearing)".'],
      stretch: ['Research how environmental health officers control mosquito larvae safely with biological controls, and why pouring oil on water is discouraged.'],
      localise: ['Connect to National Sanitation Day / communal labour practices and local sachet-plastic buy-back collectors in your district.'],
      factCheck: [
        {
          claim: 'Malaria is caused by the Plasmodium protozoan transmitted by female Anopheles mosquitoes, which breed in suitable stagnant water.',
          explanation: 'Foul odours from drains do not transmit malaria. Uncollected plastic waste obstructs storm drains, producing stagnant pools where mosquitoes breed.',
          reference: 'NaCCA CCP Integrated Science B8.2.2.1 & WHO Malaria Fact Sheet.',
        },
      ],
    },
  }),

  // 4 (Story 5 of the 8-story JHS series)
  mk({
    key: 'ash-lime-and-the-tired-soil',
    title: 'Ash, Lime, and the Tired Soil',
    summary:
      'When their school maize plot turns stunted and yellowish despite rainfall, JHS classmates Akua, Yaw, and Rashida test soil pH, discover how years of ammonium fertiliser made the topsoil acidic, and restore it with agricultural lime, cowpea crop rotation, and mulching instead of bush burning.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['farm-and-garden', 'community', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'sustainable-farming', 'food-security'],
    wpm: 125,
    paceWord: 'Grounded, observant, and methodical',
    palette: ['#15803d', '#92400e'],
    voice:
      'Curious teen voices for Akua, Yaw, and Rashida; warm, knowledgeable agriculturalist voice for Madam Agyeiwaa',
    characters: [
      'Akua: a fourteen-year-old Ghanaian JHS 2 student in a school uniform and garden boots, holding universal indicator strips.',
      'Yaw: her thirteen-year-old classmate carrying a hand trowel and field notebook.',
      'Rashida: their fourteen-year-old classmate whose family farms maize and cowpea.',
      'Madam Agyeiwaa: a District Agricultural Extension Officer in khaki field attire with a soil-testing kit.',
    ],
    music: 'Warm xylophone and gentle shaker rhythm evoking early morning farm work (placeholder)',
    pages: [
      pg(
        '🌽',
        'For four years in a row, the JHS school farm had grown only maize. This term the rains were steady, and the class had added plenty of sulphate of ammonia fertiliser. Still, the young maize leaves turned pale yellow-green with purplish edges, and the stalks stayed thin. Yaw sighed beside the fence. “Let us clear the bush behind the football field, burn it, and start a fresh farm. The ash will feed the crops.” Akua shook her head. “Before we burn any bush, let us find out why this soil is tired.”',
        'Three JHS students in uniform and boots standing beside a plot of stunted, yellowish-leaved maize plants, holding notebooks thoughtfully.',
      ),
      pg(
        '🧪',
        'Madam Agyeiwaa, the District Agricultural Extension Officer, showed the class a simple test. They took soil from three spots on the plot, stirred each sample into distilled water, and let the soil settle. Then they dipped test papers into the liquid. Blue litmus paper turned red. The universal indicator matched 4.8 on the pH scale—strongly acidic. “Most crops prefer soil that is only slightly acidic or nearly neutral,” Madam Agyeiwaa explained. “Heavy rain washes calcium and magnesium down out of reach of the roots. Using a lot of ammonium fertiliser year after year also makes soil more acidic. In acidic soil, roots struggle to take up nutrients such as phosphorus.”',
        'Close-up gouache scene at a wooden garden bench showing clear jars of settled soil and water, blue litmus paper turning red, and a colour pH chart pointing to pH 4.8.',
      ),
      pg(
        '⚗️',
        '“Shall we add more fertiliser to force the maize to grow?” Yaw asked. “No. That would make the soil more acidic and waste money,” Madam Agyeiwaa replied. “When an acid meets a base, they react. We call this neutralisation. Agricultural lime contains calcium carbonate, a base, so it reduces soil acidity. But test first, then apply only the amount an extension officer advises. And never mix lime directly with ammonium fertiliser. They can react and release ammonia gas, so the nitrogen escapes into the air. Wood ash is also a base, Yaw, but nobody can measure its strength by eye. It is no substitute for tested lime.”',
        'Madam Agyeiwaa drawing a clear chalkboard equation of neutralisation beside bags labelled Agricultural Lime and Compost, with a warning cross over mixing lime directly with ammonium fertiliser.',
      ),
      pg(
        '🌱',
        'Next, Rashida gently dug up a healthy cowpea plant from the border bed. Tiny round swellings dotted its roots. “Root nodules,” she said, smiling. “My father showed me these on our farm. Legumes such as cowpea, groundnut, and soya bean keep helpful bacteria called Rhizobium inside them.” Madam Agyeiwaa nodded. “Those bacteria take nitrogen gas from the air in the soil and change it into a form the plant can use to make proteins. This is nitrogen fixation. Grow a legume after maize, leave its roots and leaves in the soil, and the soil slowly becomes richer. Crop rotation also breaks the life cycle of some pests.”',
        'Rashida holding up a carefully uprooted cowpea plant with clean, clearly visible round pink-brown root nodules while Akua and Yaw examine it through a hand lens.',
      ),
      pg(
        '🔥',
        'That week, Social Studies and RME turned to bush burning. Burning gives the soil one quick dose of ash. But repeated burning destroys the organic matter in the soil and kills earthworms and other useful organisms. It leaves the topsoil bare, so rain washes it away. A fire can also escape and destroy a neighbour’s cocoa farm. “Our elders say the land belongs to the ancestors, the living, and those not yet born,” Yaw said slowly. Rashida added, “Christian and Islamic teaching both warn against wasteful destruction. If we hand tired, eroded soil to the next class, we have broken their trust.”',
        'Split educational illustration contrasting dark, earthworm-rich mulched soil holding moisture on the left against cracked, scorched, eroding bare soil after bush burning on the right.',
      ),
      pg(
        '🌾',
        'Guided by Madam Agyeiwaa, the students ran a fair test. They spread the advised amount of agricultural lime on half of the plot before planting and left the other half untreated for comparison. They tried mulching too, covering the beds with dry grass to hold moisture and add humus as it rotted. Then they planned a four-bed crop rotation: maize, cowpea, tomatoes, and cassava. By the end of term, the cowpea was thriving, and the maize on the limed half looked greener than the rest. The class recorded every change. “Testing the soil gave us a better answer than burning more land,” Akua said. Yaw grinned. “And it cost us no bush.”',
        'Lush, well-organised four-bed school demonstration farm with labelled wooden signs, thick straw mulch between rows, and proud JHS students measuring tall green plants.',
      ),
    ],
    activities: [
      {
        id: 'al-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Blue litmus paper turned red and the indicator showed pH 4.8. What did this reveal about the soil in the maize plot?',
        options: [
          'The soil contained pure distilled water with zero minerals',
          'The soil was strongly alkaline with pH above 9.0',
          'The soil was strongly acidic, preventing the maize from absorbing nutrients',
        ],
        correctIndex: 2,
      },
      {
        id: 'al-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why should farmers NOT mix lime (a base) directly with ammonium fertiliser?',
        options: [
          'Lime turns ammonium fertiliser into solid granite rock instantly',
          'They can react and release ammonia gas, so valuable nitrogen is lost to the air',
          'Calcium carbonate kills Rhizobium bacteria from five kilometres away',
        ],
        correctIndex: 1,
      },
      {
        id: 'al-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How do leguminous crops such as cowpea and groundnut naturally enrich exhausted farm soil?',
        options: [
          'Bacteria in their root nodules convert nitrogen gas into plant nutrients',
          'Their leaves drip hydrochloric acid onto weeds during the night',
          'They remove all organic humus and earthworms from topsoil',
        ],
        correctIndex: 0,
      },
      {
        id: 'al-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A farmer notices yellow maize leaves. What should the farmer do before adding more fertiliser?',
        options: [
          'Add extra fertiliser immediately without checking the soil',
          'Test the soil and ask an agricultural extension officer for advice',
          'Burn the entire field to make the soil look clean',
        ],
        correctIndex: 1,
      },
      {
        id: 'al-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the steps for restoring the tired soil in the correct order.',
        items: [
          'Test the soil with an indicator to discover that it is strongly acidic.',
          'Apply the recommended amount of agricultural lime before planting.',
          'Rotate maize with nitrogen-fixing cowpeas and protect soil with mulch.',
          'Record how the crops respond and compare the limed and untreated halves.',
        ],
      },
      {
        id: 'al-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'neutralisation',
        definition: 'A reaction between an acid and a base that reduces acidity or alkalinity. The products depend on the substances used.',
        distractors: [
          'The washing away of fertile topsoil by heavy rainwater runoff',
          'The burning of dry weeds to clear farmland before the rainy season',
        ],
      },
    ],
    glossary: [
      {
        word: 'indicator',
        definition: 'A numerical scale from 0 to 14 measuring how acidic (below 7), neutral (7), or alkaline/basic (above 7) a substance is.',
        pages: [2],
      },
      {
        word: 'neutralisation',
        definition: 'A reaction between an acid and a base. With some bases, such as carbonates, carbon dioxide is also released.',
        pages: [3],
      },
      {
        word: 'legumes',
        definition: 'The conversion of nitrogen gas into ammonia by certain bacteria, including those living in the root nodules of legumes.',
        pages: [4],
      },
      {
        word: 'rotation',
        definition: 'Growing different types of crops in a planned sequence on the same land across seasons.',
        pages: [4, 6],
      },
      {
        word: 'mulching',
        definition: 'Covering topsoil around plants with dry leaves, straw, or grass clippings to conserve moisture, suppress weeds, prevent erosion, and add humus as it decays.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B9.1.1.1: Acids, Bases & Salts; B9.2.1.1: Nitrogen Cycle; B8.3.4.1: Farming Systems / Crop Rotation), Social Studies (B8.1.1.1 & B8.5.1: Agricultural productivity and environmental stewardship), and RME (B8.1.1: Intergenerational land stewardship across Ghanaian tradition, Christianity, and Islam).',
      'Crucial BECE Chemistry & Agriculture Link: Explicitly teaches two classic WAEC questions—(1) using agricultural lime (calcium carbonate) to correct soil acidity, and (2) why lime must never be mixed simultaneously with ammonium sulphate fertiliser (loss of volatile ammonia gas, NH₃).',
      'Fair-test note: on Page 6 the untreated half of the plot is the control, so learners can compare like with like.',
    ],
    reviewQuestions: [
      'Verify litmus colour change (blue litmus turns red in acid) and the risk of ammonia loss when alkaline materials are mixed directly with ammonium fertilisers.',
      'Confirm the 4-crop rotation includes a legume (cowpea), a cereal (maize), a fruit/vegetable (tomato), and a root tuber (cassava).',
    ],
    guide: {
      overview:
        'Connects classroom acid-base chemistry directly to sustainable Ghanaian agriculture, showing JHS learners how pH testing, liming, nitrogen-fixing legumes, and mulching outperform destructive slash-and-burn farming.',
      lessonMinutes: 45,
      goals: [
        'Interpret litmus and universal indicator results on the 0–14 pH scale and explain soil neutralisation with agricultural lime.',
        'Explain why mixing alkaline lime directly with ammonium fertilisers wastes nitrogen as ammonia gas.',
        'Describe symbiotic nitrogen fixation in legume root nodules and design a four-plot crop rotation.',
        'Evaluate the ecological and moral harms of indiscriminate bush burning against intergenerational land stewardship.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B9.1.1.1, B9.2.1.1 & B8.3.4.1)', 'Acids, bases, soil pH, nitrogen cycle, and crop rotation'],
        ['Social Studies (NaCCA CCP B8.1.1.1 & B8.5.1)', 'Sustainable agriculture, bushfire prevention, and food security'],
        ['Religious & Moral Education (NaCCA CCP B8.1.1)', 'Stewardship of land for living and unborn generations'],
      ],
      before: ['Test safe household lemon juice (acid) and wood-ash solution or baking soda (base) with red and blue litmus paper.'],
      during: ['Pause on Page 3 to write the word equation: Acid + Base → Salt + Water, and explain the ammonia-loss warning.'],
      after: ['With a teacher’s permission, gently lift a mature cowpea or groundnut plant from the school compound to inspect real root nodules with hand lenses.'],
      discussion: ['Why do bushfires make a farm look clean on day one yet leave farmers poorer by year three?'],
      reflection: ['What does the Ghanaian saying that land belongs to the ancestors, the living, and the unborn ask of our generation?'],
      maths: [
        {
          task: 'An extension officer recommends 200 g of agricultural lime per square metre for an acidic school bed measuring 8 m by 5 m. How many kilograms of lime are required in total?',
          answer: 'Area = 8 m × 5 m = 40 m². Lime needed = 40 × 200 g = 8,000 g = 8 kg.',
        },
      ],
      support: ['Provide a colour-coded pH number line (0–6.9 Acidic, 7.0 Neutral, 7.1–14 Alkaline) and root-nodule diagram.'],
      stretch: ['Write the balanced symbol equation for calcium hydroxide reacting with ammonium sulphate.'],
      localise: ['Adapt crop examples to local staples—e.g., groundnut/millet/sorghum in northern Ghana or cowpea/maize/cassava in southern Ghana.'],
      factCheck: [
        {
          claim: 'Agricultural lime neutralises acidic soil (pH < 5.5), whereas mixing lime directly with ammonium fertiliser volatilises ammonia gas.',
          explanation: 'Calcium carbonate raises soil pH via acid-base neutralisation. Strong bases displace ammonia from ammonium salts (NH₄⁺ + OH⁻ → NH₃↑ + H₂O), causing nitrogen loss.',
          reference: 'NaCCA CCP Integrated Science B9.1.1.1, B9.2.1.1 & Ministry of Food and Agriculture (MoFA) Ghana crop advisory.',
        },
      ],
    },
  }),

  // 5 (Story 6 of the 8-story JHS series)
  mk({
    key: 'stopping-distance-on-wet-tar',
    title: 'Stopping Distance on Wet Tar',
    summary:
      'After a speeding, overloaded minibus skids past their school zebra crossing in the rain, JHS classmates Eyram, Kojo, and Abdulai investigate friction, momentum, tyre tread, and pressure (P = F ÷ A), then campaign for a safer road and patient driving.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['technology', 'community', 'health-and-wellbeing'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'road-safety', 'civic-responsibility'],
    wpm: 125,
    paceWord: 'Crisp, urgent, and analytical',
    palette: ['#dc2626', '#334155'],
    voice:
      'Alert teen voices for Eyram, Kojo, and Abdulai; steady, authoritative voice for MTTD Corporal Adjei',
    characters: [
      'Eyram: a fourteen-year-old Ghanaian JHS 3 prefect in a reflective road-warden sash over her uniform.',
      'Kojo: her classmate holding a spring balance, wooden block, and ruler for physics tests.',
      'Abdulai: their classmate whose uncle drives a commercial trotro minibus responsibly.',
      'Corporal Adjei: a Ghana Police Motor Traffic and Transport Department (MTTD) officer in crisp uniform.',
    ],
    music: 'Steady rhythmic percussion with rain ambience resolving into calm, confident acoustic chords (placeholder)',
    pages: [
      pg(
        '🚦',
        'Rain still glistened on the trunk road outside the school. At the zebra crossing, Eyram raised her red STOP sign and kept her classmates well back on the pavement. A trotro came towards them, overloaded and far too fast. The driver braked hard. The worn tyres slid on the wet tar, and the minibus skidded right past the white stripes before it shuddered to a stop. Nobody was hurt, because the students had waited until the wheels stopped turning. Kojo stared at a smooth, bald rear tyre. “Why could the brakes not stop it on the line?”',
        'Standing well back on a raised school pavement in light rain, Eyram holds a red STOP sign keeping younger pupils safe while a heavily loaded minibus skids across wet white zebra stripes.',
      ),
      pg(
        '⚙️',
        'In Integrated Science, the teacher turned the near-miss into an investigation. Kojo hooked a spring balance to a loaded wooden block and pulled it across three surfaces: dry sandpaper, dry wood, and smooth wet plastic. On the wet plastic, the reading fell sharply. There was far less friction. “Brakes do not work by magic,” the teacher said. “Brake fluid carries pressure to the brakes. They slow the wheels and turn the vehicle’s kinetic energy—its movement energy—into heat. But the tyres must still grip the road. The grooves in a tyre push water out of the way. A worn tyre cannot do that, so on a wet road it slides.”',
        'JHS lab table showing Kojo pulling weighted wooden blocks with a Newton spring balance across rough sandpaper versus smooth wet plastic, beside a cross-section diagram of grooved vs bald tyre treads.',
      ),
      pg(
        '📐',
        '“Why does overloading matter?” Eyram asked. The teacher wrote on the board. “First, more mass moving at the same speed means more momentum and more kinetic energy. So an overloaded vehicle needs a longer distance to stop. Second, heavy goods piled on the roof rack raise the centre of gravity, and the bus can topple on a bend. Third, think about pressure. Pressure is force divided by area: P = F ÷ A. It is measured in pascals, or newtons per square metre. A wide seatbelt spreads the stopping force over a large area of the chest and hips, so the pressure on the body is low. A thin rope would cut in.”',
        'Chalkboard diagram showing Pressure = Force / Area (wide seatbelt strap vs thin cord) and high roof loads raising vehicle centre of gravity.',
      ),
      pg(
        '🏥',
        'On Wednesday, Corporal Adjei of the police Motor Traffic and Transport Department (MTTD) spoke at a Social Studies road-safety forum. “Do not call road crashes ‘accidents’ that nobody could prevent,” he said. “Most begin with a choice: speeding through town, overtaking on a bend or a hill, driving tired or drunk, ignoring seatbelts and crash helmets, or running on worn tyres. Every crash drains hospital blood banks. It can leave children without parents and families without a breadwinner. And it costs Ghana millions of cedis in repairs and emergency care.”',
        'MTTD officer Corporal Adjei standing beside road-safety traffic signs speaking to attentive JHS students and local commercial drivers.',
      ),
      pg(
        '🕊️',
        'In RME, Abdulai shared a talk he had with his uncle, a trotro driver, at the lorry station. “My uncle says every passenger is somebody’s whole world,” Abdulai told the class. “In Islam, protecting life is a duty, called hifz al-nafs. A driver who uses bald tyres or overtakes carelessly breaks that duty. Christians are commanded not to take life and to love their neighbour, and that applies behind a steering wheel too. And our elders teach boasetɔ, patience. It is far better to arrive ten minutes late than never to arrive at all.”',
        'At a busy Ghanaian lorry station canopy, Abdulai and his uncle inspect deep grooves on a new tyre and check passenger seatbelts while a station master nods approvingly.',
      ),
      pg(
        '🛣️',
        'The school did not stop at talk. Together with the Parent-Teacher Association, the municipal roads engineer, and Corporal Adjei, it petitioned the assembly. Soon there were speed humps, rumble strips, and clear warning signs near the school gate. Eyram’s road wardens also taught the primary pupils the crossing rule. Stop at the kerb. Look left, look right, and look left again. Make sure drivers have seen you. Obey the crossing guard. Cross only when traffic has stopped in every lane—above all on wet tar, where physics never bends for impatient feet.',
        'Sunny morning outside the JHS gate showing newly built speed humps, clear warning signs, a slowed trotro halted cleanly before the zebra crossing, and Eyram guiding younger pupils safely across.',
      ),
    ],
    activities: [
      {
        id: 'sd-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the minibus with worn tyres skid past the crossing even though the driver braked?',
        options: [
          'Rainwater increased friction ten times so the wheels spun faster forward',
          'Water reduced friction between smooth tyres and the road, causing skidding',
          'Pressing hydraulic brakes destroys gravity underneath a moving minibus',
        ],
        correctIndex: 1,
      },
      {
        id: 'sd-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Using Pressure = Force ÷ Area, why is a wide flat seatbelt safer than a thin cord during sudden braking?',
        options: [
          'A larger area spreads the stopping force, so the pressure on the body is lower',
          'A wide seatbelt increases pressure so sharply that it cuts through clothing',
          'Increasing surface area multiplies total force by a thousand',
        ],
        correctIndex: 0,
      },
      {
        id: 'sd-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'How does stacking heavy cargo high on a vehicle’s roof rack affect its stability on a sharp bend?',
        options: [
          'It removes all mass and momentum from the moving vehicle',
          'It lowers the centre of gravity beneath the road surface',
          'It raises vehicle centre of gravity, making it unstable and prone to overturn',
        ],
        correctIndex: 2,
      },
      {
        id: 'sd-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You are waiting at a zebra crossing during rain. What is the safest action?',
        options: [
          'Step out as soon as a driver waves, without checking the other lane',
          'Wait on the pavement, check both ways, and cross only when traffic stops',
          'Run across because wet roads help cars stop faster',
        ],
        correctIndex: 1,
      },
      {
        id: 'sd-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the steps for crossing a road safely in the correct order.',
        items: [
          'Stand back from the kerb, observing vehicle speeds and wet road conditions.',
          'Look left, right, and left again, watching drivers before stepping out.',
          'Cross only when vehicles have stopped or all lanes are completely clear.',
          'Walk briskly straight across, still watching the traffic.',
        ],
      },
      {
        id: 'sd-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'friction',
        definition: 'A force that opposes motion between two surfaces that are touching.',
        distractors: [
          'A non-contact magnetic force pulling iron filings through empty space',
          'The upward buoyant push of water on a floating canoe',
        ],
      },
    ],
    glossary: [
      {
        word: 'friction',
        definition: 'The force opposing motion between two surfaces in contact; grooved tyre treads preserve friction on wet roads.',
        pages: [2],
      },
      {
        word: 'momentum',
        definition: 'The product of a vehicle mass and velocity, determining the force required to bring it to a stop.',
        pages: [3],
      },
      {
        word: 'pressure',
        definition: 'The perpendicular force acting per unit area of a surface (P = F ÷ A), measured in pascals (Pa) or newtons per square metre (N/m²).',
        pages: [3],
      },
      {
        word: 'gravity',
        definition: 'The single point through which the entire weight of a body appears to act; keeping it low and over a wide base increases stability.',
        pages: [3],
      },
      {
        word: 'boasetɔ',
        definition: 'An Akan virtue meaning patience, restraint, and calm self-mastery—vital for safe driving and peaceful civic life.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B8.4.4.1 / B9.4.4.1: Strand 4, Sub-strand 4: Force and Motion—friction, momentum, pressure P = F/A, centre of gravity and stability), Social Studies (B8.4.1.1 / B9.4.1.1: Strand 4: Law and Order—road safety regulations and causes of crashes), and RME (B7.5.1.1 / B8.5.1.1: Sanctity of human life, patience, and civic responsibility).',
      'Ghana Traffic Convention: Ghana drives on the RIGHT-hand side (since 1974), so traffic in the nearest lane approaches from the LEFT. Learners look left, right, and left again, and must wait on the kerb until vehicles reach a complete standstill.',
    ],
    reviewQuestions: [
      'Verify P = F ÷ A calculations and units (N, m², Pa) and centre-of-gravity stability rules against NaCCA B8/B9 Science.',
      'Ensure pedestrian crossing advice emphasises waiting on the kerb until vehicles come to a complete standstill.',
    ],
    guide: {
      overview:
        'Uses a vivid rainy-day school-crossing near-miss to teach core BECE mechanics (friction, kinetic energy, pressure P = F/A, and centre of gravity/stability) alongside National Road Safety Authority rules and moral respect for human life.',
      lessonMinutes: 45,
      goals: [
        'Explain how road wetness, tyre tread depth, speed, and vehicle mass affect friction and braking distance.',
        'Calculate pressure using P = F ÷ A and apply it to seatbelts, sharp tools, and tyres.',
        'Explain how high roof-rack loading raises centre of gravity and reduces vehicle stability.',
        'Connect civic traffic laws with religious and traditional moral duties to preserve human life.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.4.4.1 / B9.4.4.1)', 'Friction, pressure (P = F/A), stability, and road mechanics'],
        ['Social Studies (NaCCA CCP B8.4.1.1 / B9.4.1.1)', 'Road safety, traffic law obedience, and crash prevention'],
        ['Religious & Moral Education (NaCCA CCP B7.5.1.1 / B8.5.1.1)', 'Sanctity of life, patience, and public responsibility'],
      ],
      before: ['Rub dry palms briskly together (feel heat from friction), then rub soapy wet palms—how does grip change?'],
      during: ['Pause on Page 3 to solve a quick board calculation comparing pressure from a narrow strap vs a wide seatbelt.'],
      after: ['Measure friction across dry desk wood, rough concrete, and wet plastic tray using a spring balance and weighted block.'],
      discussion: ['Which road risks can drivers and passengers identify and prevent before a crash happens?'],
      reflection: ['As a passenger, what polite, firm words can you use if a driver speeds or overtakes blindly on a hill?'],
      maths: [
        {
          task: 'During sudden braking, a forward force of 1,200 N acts against a passenger’s seatbelt. Compare the pressure exerted by a proper wide seatbelt of contact area 0.06 m² versus a twisted thin strap of area 0.01 m².',
          answer: 'Wide seatbelt: P = 1,200 N ÷ 0.06 m² = 20,000 Pa (20 kPa). Twisted thin strap: P = 1,200 N ÷ 0.01 m² = 120,000 Pa (120 kPa)—six times as much bruising pressure!',
        },
      ],
      support: ['Use two matchboxes—one weighted at the bottom and one weighted on top—tilted slowly on a book to demonstrate centre of gravity.'],
      stretch: ['Explain Pascal’s Principle in hydraulic braking systems and why air bubbles cause spongy brakes.'],
      localise: ['Invite a local MTTD officer or NRSA representative to inspect the crossing outside your school compound.'],
      factCheck: [
        {
          claim: 'Water films reduce road-tyre friction, requiring grooved treads to evacuate water, while braking distance increases with vehicle mass and speed squared.',
          explanation: 'Hydroplaning occurs when fluid pressure lifts the tyre off the road surface. Overloading raises kinetic energy (½mv²) and elevates centre of gravity, increasing overturning risk on curves.',
          reference: 'NaCCA CCP Integrated Science B8.4.4.1 / B9.4.4.1 & National Road Safety Authority (NRSA) Ghana.',
        },
      ],
    },
  }),

  // 6 (Story 7 of the 8-story JHS series)
  mk({
    key: 'written-in-the-genes-not-a-curse',
    title: 'Written in the Genes, Not a Curse',
    summary:
      'When rumours spread about their brilliant classmate Sena’s stay in hospital during the cold rains, JHS 3 students Ama, Fiifi, and Rahma learn how sickle cell disease is inherited (HbSS and HbAS carriers), reject stigma, and build a kind, inclusive classroom.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'school-life', 'educational'],
    themes: ['health-and-wellbeing', 'school', 'friendship'],
    objectives: ['scientific-curiosity', 'reasoning', 'kindness', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'health-literacy', 'inclusion'],
    wpm: 125,
    paceWord: 'Empathetic, lucid, and reassuring',
    palette: ['#be123c', '#0284c7'],
    voice:
      'Warm, supportive teen voices for Ama, Fiifi, Rahma, and Sena; clear, compassionate clinical voice for Dr Quansah',
    characters: [
      'Sena: a bright fourteen-year-old Ghanaian JHS 3 Maths quiz champion returning to class with a warm cardigan and water bottle.',
      'Ama: Sena’s loyal desk-mate, empathetic and eager to replace rumours with real science.',
      'Fiifi: a curious classmate initially confused by neighbourhood myths.',
      'Rahma: class prefect, thoughtful and fair-minded.',
      'Dr Quansah: a friendly district hospital medical officer visiting for School Health Week.',
    ],
    music: 'Soft, warm piano and acoustic guitar melody expressing friendship, clarity, and dignity (placeholder)',
    pages: [
      pg(
        '🏥',
        'Sena missed four days of school during the cold July rains. He was in hospital with severe joint pain. Sena had never hidden that he lives with sickle cell disease, but near the canteen the rumours began. Fiifi lowered his voice. “Someone in my lane says that kind of bone pain comes from a family curse. And that you can catch it by sharing a desk.” Ama frowned. “Fiifi, Sena won the district Maths quiz last month. Rumours like that hurt people. Dr Quansah is here for School Health Week. Let us ask her for the facts.”',
        'In a JHS corridor during rainy weather, Ama speaks firmly and kindly to Fiifi to stop rumours, pointing toward a School Health Week banner outside the assembly hall.',
      ),
      pg(
        '🩸',
        'In the science laboratory, Dr Quansah drew two red blood cells on the board. “Sickle cell disease is not an infection,” she said. “No germ causes it, so you cannot catch it by sitting together, hugging, or sharing a plate. It is inherited. It affects haemoglobin, the protein in red blood cells that carries oxygen. With normal haemoglobin, HbA, red blood cells are round and flexible, and they slip easily through the tiniest blood vessels. With sickle haemoglobin, HbS, the cells can turn stiff and curved like a sickle. This happens more when the body is cold, short of water, or short of oxygen. The stiff cells block small blood vessels, and that causes severe pain.”',
        'Dr Quansah illustrates round flexible red blood cells gliding through a vessel versus stiff crescent-shaped cells jamming at a narrow vessel junction.',
      ),
      pg(
        '🧬',
        'Fiifi raised his hand. “Doctor, if both parents look healthy, how can their child have it?” Dr Quansah drew a square with four boxes. “This is heredity. Every child receives one haemoglobin gene from the mother and one from the father. The pair you receive is your genotype. A person with the genotype HbAS is a carrier. Carriers have sickle cell trait, and most live healthy lives. Now suppose both parents are HbAS. In each pregnancy there is a 25% chance of HbAA, a 50% chance of HbAS, and a 25% chance of HbSS. HbSS is sickle cell disease. The chances start afresh with every pregnancy, like tossing a coin again.”',
        'Close-up clear educational illustration of a genetic Punnett square crossing Mother (HbAS) and Father (HbAS), showing resulting boxes HbAA (25%), HbAS (50%), and HbSS (25%).',
      ),
      pg(
        '💑',
        'In Social Studies, the teacher linked the science to family life. “Sadly, when a child is born with HbSS, some families blame the mother or accuse an elder of witchcraft,” he said. “That stigma is unfair, and it is false. Heredity shows that the father and the mother each passed on one HbS gene. That is why young adults are encouraged to know their genotype. A simple blood test and genetic counselling help a couple understand their results before they plan a family. The aim is never to blame or reject anyone. It is to help people make informed choices and get good care.”',
        'A warm clinic counselling scene showing a health counsellor explaining haemoglobin genotype test cards calmly to an engaged young Ghanaian couple.',
      ),
      pg(
        '🤍',
        'In RME, Rahma led a reflection on dignity and compassion. “Blaming a sick child or a mother for inherited genes is false, and it is wrong,” she said. “Christians believe every person is wonderfully made in God’s image, and they are told to carry one another’s burdens. Muslims are taught never to mock the sick, and that caring for them earns reward from Allah. And in our Ghanaian tradition, a person stands strong when the community stands beside them. Stigma has no place in this class.” Fiifi looked at his desk. Then he asked quietly, “Can I copy the notes for Sena?”',
        'Rahma addressing her JHS 3 classmates warmly while students prepare a welcoming revision-notes folder and a hydration reminder chart for their classroom.',
      ),
      pg(
        '🌟',
        'When Sena came back on Monday, Fiifi was the first to greet him. He handed over neat notes from every lesson Sena had missed. With their class teacher, the students agreed a few simple rules that were good for everyone. Water bottles were allowed on desks. Cardigans were allowed on cold, rainy mornings. And anyone who felt unwell could rest without being forced out into the heat. Sena walked to the board and solved the hardest simultaneous equation in two minutes flat. A genetic condition may shape the care a person needs. It never decides how bright they are, or how far they will go.',
        'Bright JHS 3 classroom scene where Sena, wearing a neat cardigan over his uniform with a water bottle on his desk, confidently solves an algebra equation on the board while classmates applaud warmly.',
      ),
    ],
    activities: [
      {
        id: 'wg-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why can you not "catch" sickle cell disease by sitting beside a classmate or sharing food?',
        options: [
          'It is inherited from parents through genes, not caused by germ infections',
          'Only mosquitoes transmit sickle haemoglobin during the dry season',
          'Boiling drinking water removes haemoglobin genes before lunch',
        ],
        correctIndex: 0,
      },
      {
        id: 'wg-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'If both parents are healthy carriers with genotype HbAS, what is the probability in each pregnancy that their child will inherit HbSS?',
        options: [
          '0% because healthy parents cannot pass on HbS',
          '100% (4 in 4)',
          '25% (1 in 4)',
        ],
        correctIndex: 2,
      },
      {
        id: 'wg-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why is blaming only the mother when a child has Sickle Cell Disease HbSS scientifically false?',
        options: [
          'Haemoglobin genes are inherited exclusively from grandfathers',
          'A child with HbSS received one HbS gene from the father and one from the mother',
          'Diet during primary school changes a child’s genotype from HbAA to HbSS',
        ],
        correctIndex: 1,
      },
      {
        id: 'wg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: On a cold morning during PE, a classmate who has sickle cell disease says pain is starting in his legs. What is the best thing to do?',
        options: [
          'Move away from him so that you do not catch it',
          'Tell him to run harder so that the pain goes away',
          'Tell the teacher at once and help him rest, keep warm, and drink water',
        ],
        correctIndex: 2,
      },
      {
        id: 'wg-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the steps that explain a sickle cell pain episode and its care in the correct order.',
        items: [
          'A child inherits one HbS gene from each parent, resulting in genotype HbSS.',
          'Dehydration, cold, or low oxygen triggers red cells to sickle and stiffen.',
          'Stiff sickled cells clog small capillaries, causing tissue pain and crisis.',
          'Prompt hydration, pain relief, and clinic care help the crisis subside.',
        ],
      },
      {
        id: 'wg-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'heredity',
        definition: 'The biological passing on of genetic traits and characteristics from parents to their offspring through genes.',
        distractors: [
          'The spreading of bacterial or viral infections through coughing and sneezing',
          'The digestion of iron-rich leafy vegetables inside the small intestine',
        ],
      },
    ],
    glossary: [
      {
        word: 'haemoglobin',
        definition: 'The iron-containing protein inside red blood cells that binds oxygen in the lungs and transports it to body tissues.',
        pages: [2],
      },
      {
        word: 'heredity',
        definition: 'The transmission of genetic traits (such as blood group or haemoglobin genotype) from parents to offspring.',
        pages: [3, 4],
      },
      {
        word: 'genotype',
        definition: 'The specific genetic makeup of an individual for a particular trait, such as HbAA, HbAS, HbAC, HbSC, or HbSS.',
        pages: [3, 4],
      },
      {
        word: 'carrier',
        definition: 'An individual (such as someone with HbAS) who possesses one recessive allele for a condition without having the disease, yet can pass that allele to offspring.',
        pages: [3],
      },
      {
        word: 'stigma',
        definition: 'Unfair social disapproval, shame, or discrimination directed at someone because of a health condition or difference.',
        pages: [4, 5],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B9.3.1.1: Circulatory system and blood functions; B8.5.2.1 / B9.5.2.1: Non-communicable inherited conditions vs communicable diseases), Social Studies (B8.2.2.1 / B9.2.2.1: Strand 2: The Family—genetic counselling before marriage, dispelling superstitions), and RME (B7.5.1.1 / B8.5.1.1: Human dignity, empathy for the sick, and anti-discrimination). Note: The HbAS × HbAS Punnett square serves as a visual enrichment bridge to SHS 1 Genetics.',
      'Dignity note: Page 1 states that Sena himself is open about his condition, so the health talk does not disclose private medical information. Never use this story to single out a real learner.',
    ],
    reviewQuestions: [
      'Verify the HbAS × HbAS Punnett-square ratios (25% HbAA, 50% HbAS, 25% HbSS) and confirm clear distinction between blood group and haemoglobin genotype.',
      'Ensure Sena is portrayed with full agency, high capability, and dignity—never fragility or pity.',
    ],
    guide: {
      overview:
        'Replaces harmful superstitions around Sickle Cell Disease with crystal-clear JHS Mendelian genetics (HbAS × HbAS), circulatory biology, pre-marital genetic counselling literacy, and genuine classroom empathy.',
      lessonMinutes: 45,
      goals: [
        'Distinguish clearly between communicable (infectious) diseases and non-communicable inherited genetic conditions.',
        'Construct and interpret a Punnett square for two HbAS carrier parents (1 HbAA : 2 HbAS : 1 HbSS).',
        'Explain why both parents contribute equally to a child’s genotype and state the role of genetic counselling.',
        'Practise practical, stigma-free classroom support (hydration, warmth in cold rain, shared notes, anti-teasing).',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B9.3.1.1 & B8.5.2.1 / B9.5.2.1)', 'Circulatory blood cells, heredity, and genetic inheritance'],
        ['Social Studies (NaCCA CCP B8.2.2.1 / B9.2.2.1)', 'Responsible family planning, genetic counselling, and ending superstitions'],
        ['Religious & Moral Education (NaCCA CCP B7.5.1.1 / B8.5.1.1)', 'Empathy, human dignity, and caring for others'],
      ],
      before: ['Clarify an everyday confusion first: ABO Blood Group (O+, A+, B+) is NOT the same test as Haemoglobin Genotype (HbAA, HbAS, HbSS)!'],
      during: ['Pause on Page 3 and have every student draw the 2×2 Punnett square for Mother (A, S) × Father (A, S) in their exercise book.'],
      after: ['Work out two more Punnett squares in pairs: (a) HbAA × HbAS, and (b) HbAA × HbSS, recording % probabilities for each box.'],
      discussion: ['How does understanding recessive inheritance protect mothers and families from unfair blame and broken marriages?'],
      reflection: ['How can our class make sure any student managing asthma, sickle cell, epilepsy, or a disability feels respected and fully included?'],
      maths: [
        {
          task: 'In a Punnett square cross between HbAA and HbAS parents, what fraction and percentage of pregnancies are expected to be HbAA, HbAS, and HbSS?',
          answer: 'HbAA = 2/4 (50%), HbAS = 2/4 (50%), and HbSS = 0/4 (0%).',
        },
      ],
      support: ['Use two colours of bottle tops (e.g., blue = HbA, red = HbS) to model parent gene pairs physically before writing letters.'],
      stretch: ['Research Ghana’s National Newborn Screening Programme for Sickle Cell Disease and why HbAS carriers historically had partial survival protection against severe malaria.'],
      localise: ['Connect respectfully with a Ghana Health Service nurse or Sickle Cell Foundation of Ghana educational leaflet.'],
      factCheck: [
        {
          claim: 'Sickle cell disease is an inherited non-communicable autosomal recessive haemoglobinopathy (HbSS), not an infection or a spiritual curse.',
          explanation: 'When two HbAS carriers reproduce, Mendelian segregation gives each pregnancy a 25% chance of HbAA, 50% chance of HbAS, and 25% chance of HbSS, independent of birth order.',
          reference: 'NaCCA CCP Integrated Science B9.3.1.1, B8.5.2.1 & Ghana Health Service Sickle Cell Management Guidelines.',
        },
      ],
    },
  }),

  // 7 (Story 8 of the 8-story JHS series)
  mk({
    key: 'sunlight-on-the-cold-store-roof',
    title: 'Sunlight on the Cold-Store Roof',
    summary:
      'When daytime power cuts spoil harvested tomatoes at their town’s cooperative market, JHS 3 classmates Naana, Bawa, and Edem learn how solar photovoltaic panels, charge controllers, batteries, and inverters work together—linking renewable energy, enterprise, and honest work.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'family'],
    themes: ['technology', 'community', 'food'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'entrepreneurship', 'renewable-energy'],
    wpm: 125,
    paceWord: 'Forward-looking, clear, and enterprising',
    palette: ['#f59e0b', '#0369a1'],
    voice:
      'Energetic, enterprising teen voices for Naana, Bawa, and Edem; inspiring female technician voice for Engineer Maame Efua',
    characters: [
      'Naana: a fifteen-year-old Ghanaian JHS 3 Career Technology and Science enthusiast holding a circuit sketch.',
      'Bawa: her fourteen-year-old classmate whose mother trades fresh tomatoes from Bono East.',
      'Edem: their classmate interested in bookkeeping, pricing, and cooperative business.',
      'Engineer Maame Efua: a certified young Ghanaian solar technician in a safety helmet and tool belt.',
    ],
    music: 'Bright, optimistic highlife guitar and marimba pulse conveying innovation and honest enterprise (placeholder)',
    pages: [
      pg(
        '🍅',
        'Every harvest season, Bawa watched his mother’s tomatoes soften and rot behind the market shed. Whenever a daytime power cut shut down the traders’ small cold room, they had to sell cheaply before everything spoiled. “Farmers sweat for months, and then post-harvest loss eats their profit,” Naana said. She pointed up. “Meanwhile the sun beats on that zinc roof all afternoon.” So when a solar technician, Engineer Maame Efua, arrived to install a solar-powered cold room for the market cooperative, the three friends asked to follow the energy at every stage.',
        'Outside a sunny Ghanaian market cooperative shed, crates of red tomatoes sit in shade while JHS students watch Engineer Maame Efua unload gleaming blue-black solar panels beside the corrugated roof.',
      ),
      pg(
        '☀️',
        'Engineer Maame Efua sketched a block diagram in chalk. “First, do not confuse two things,” she said. “A solar water heater uses sunlight to heat water. These are photovoltaic panels, or PV for short. Their silicon cells change light energy directly into electrical energy, as direct current (DC). The panels must be tilted towards the sun and kept clean. Harmattan dust or bird droppings block the light. From the panels, the current flows to a charge controller, which protects the batteries from overcharging. Then an inverter changes the DC into 230-volt alternating current (AC), the kind that runs the cold-room motor.”',
        'Clear, labelled four-stage gouache diagram alongside the market wall: (1) Angled Solar PV Panels, (2) Charge Controller, (3) Battery Bank, and (4) Inverter powering a cold room.',
      ),
      pg(
        '🔋',
        'Edem wrote the energy chain in his notebook. “So in bright sunshine, the photovoltaic cells change light energy into electrical energy. Some runs the cold room at once. The rest is stored in the batteries as chemical energy and changed back into electrical energy after sunset.” “Exactly,” said Engineer Maame Efua, impressed. “Compare that with a petrol generator. It gives off carbon monoxide and soot, it is noisy, and it needs fuel every single day. A solar system costs a lot to install. After that the sunshine is free. But it still needs care, and one day the batteries must be replaced.”',
        'Side-by-side comparison scene showing a noisy, smoky petrol generator burning fuel versus a silent rooftop solar PV array charging clean indoor battery cabinets.',
      ),
      pg(
        '📈',
        'In Social Studies, Edem and Bawa studied how the cooperative paid for it all. Twenty-five market women had saved together every week through their credit union. Now each trader paid a small cooling fee per crate. The fees went into a separate account for cleaning the panels and, one day, replacing the batteries. “This is entrepreneurship,” their teacher said. “They saw a real need and organised to meet it. Cutting post-harvest loss raises incomes for farmers and traders and keeps food prices steadier for families. It also creates skilled jobs for technicians like Maame Efua.”',
        'Edem and Bawa reviewing a neat cooperative ledger book with market women showing crate fees, savings growth, and fewer spoiled tomato crates.',
      ),
      pg(
        '🛠️',
        'In RME, the class talked about honest work. “Some young people are tempted by internet fraud or betting, because they think skilled work is too slow,” Naana said. “But Christians are taught that hard work brings dignity, and that whoever is faithful with a little can be trusted with much. Islam honours halal earnings: money gained through honest labour, fair weights, and kept promises. And our elders praise adwuma pa—good, honest work.” Edem thought of the cooperative’s ledger. “That is why the women record every cedi,” he said. “Trust is part of the business.”',
        'Naana, Bawa, and Edem in Career Technology aprons assembling a small low-voltage 6-volt solar-LED lantern kit on their workbench while Engineer Maame Efua coaches them.',
      ),
      pg(
        '🌟',
        'The project gave the Science and Career Technology Club an idea. Under their teacher’s supervision, the members built a safe 6-volt solar lantern for the reading corner of the school library. They wrote a rota for checking the small panel for dust and wiping it, with an adult, when it was cool. At the market, Bawa’s mother was now selling firm, fresh tomatoes three days after harvest. Far fewer crates were going to waste. The three friends could see it clearly: science, enterprise, and honest character had turned ordinary sunlight into lasting gain.',
        'Warm early-evening scene showing Bawa’s mother smiling beside fresh red tomatoes at the solar-lit cooperative stall while Naana, Edem, and Bawa test their school library solar lantern nearby.',
      ),
    ],
    activities: [
      {
        id: 'sc-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What do the charge controller and the inverter do in a solar PV system?',
        options: [
          'The inverter makes diesel fuel, while the charge controller heats water',
          'The controller guards batteries; the inverter turns DC into 230 V AC power',
          'Both devices block electrons completely so batteries never store chemical energy',
        ],
        correctIndex: 1,
      },
      {
        id: 'sc-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which sequence correctly traces the energy transformations when solar panels charge a battery by day to run a light at night?',
        options: [
          'Chemical energy in dust → Heat energy → Magnetic energy',
          'Nuclear energy in glass → Sound energy → Kinetic energy → Potential energy',
          'Light energy → Electrical energy → Chemical energy → Electrical energy',
        ],
        correctIndex: 2,
      },
      {
        id: 'sc-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How does solar-powered cold storage strengthen Ghana’s agricultural economy?',
        options: [
          'It cuts crop loss, stabilizes trader incomes, and saves generator fuel costs',
          'It forces farmers to throw away half their harvest on day one',
          'It increases exhaust smoke and noise inside food markets',
        ],
        correctIndex: 0,
      },
      {
        id: 'sc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A solar cold room is losing power during Harmattan. What is the best first step?',
        options: [
          'Ask students to open the high-voltage inverter cabinet',
          'Have a certified technician inspect panels, wiring, and battery safety',
          'Assume solar panels cannot work during Harmattan',
        ],
        correctIndex: 1,
      },
      {
        id: 'sc-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the flow of energy in a solar cold-room system in the correct order, from sunlight to appliance.',
        items: [
          'Solar PV cells on the clean rooftop absorb sunlight and produce DC power.',
          'A charge controller regulates DC voltage to safeguard storage batteries.',
          'Chemical energy is stored in batteries to maintain steady backup power.',
          'An inverter transforms DC into 230 V AC to run the cold-room refrigeration.',
        ],
      },
      {
        id: 'sc-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'photovoltaic',
        definition: 'Relating to the direct conversion of light energy into electrical energy using semiconductor materials such as silicon.',
        distractors: [
          'Generating power by burning diesel fuel inside a noisy generator engine',
          'Preserving fresh tomatoes by boiling them in concentrated salt solution',
        ],
      },
    ],
    glossary: [
      {
        word: 'photovoltaic',
        definition: 'Technology (PV) in which semiconductor solar cells convert sunlight directly into direct-current (DC) electricity.',
        pages: [2, 3],
      },
      {
        word: 'current',
        definition: 'Electric current (DC) in which charges flow steadily in one direction, as produced by solar cells and batteries.',
        pages: [2],
      },
      {
        word: 'inverter',
        definition: 'An electronic device that converts direct current (DC) from solar panels or batteries into alternating current (AC) for standard appliances.',
        pages: [2],
      },
      {
        word: 'cooperative',
        definition: 'The spoilage, damage, or waste of farm produce between harvesting and human consumption due to poor storage, transport, or processing.',
        pages: [1, 4],
      },
      {
        word: 'entrepreneurship',
        definition: 'Identifying a real community need, organising resources responsibly, and bearing calculated risk to create sustainable value.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'NaCCA CCP Alignment: Integrated Science (B8.4.1.1, B8.4.3.1 & B9.4.2.1: Energy transformations, solar PV cells, DC vs AC, storage batteries, and electronics), Social Studies (B8.5.1 / B9.5.1: Strand 5: Socio-Economic Development—entrepreneurship, cooperatives, reducing post-harvest losses, TVET careers), and RME (B7.6.1.1: Strand 6: Work, Entrepreneurship and Social Security—dignity of labour, halal enterprise, honest work adwuma pa).',
      'Food-science note: tomatoes are chilled in a cold room (roughly 10 to 13 °C), not frozen; freezers suit fish and meat.',
      'Practical Maintenance Insight for Ghana: Harmattan dust can reduce the sunlight reaching solar panels. Cleaning should follow manufacturer safety instructions.',
    ],
    reviewQuestions: [
      'Verify accurate distinction between DC (panels/batteries) and AC (mains/inverter output) and the exact sequence of energy transformations.',
      'Ensure student hands-on building is strictly limited to safe 5 V–6 V low-voltage educational kits, while 230 V inverter installations are handled solely by certified technicians.',
    ],
    guide: {
      overview:
        'Connects BECE energy transformations and solar electronics (PV cells, DC/AC, charge controllers, inverters) to solving Ghana’s agricultural post-harvest losses through cooperative entrepreneurship and honest work ethics.',
      lessonMinutes: 45,
      goals: [
        'Trace energy transformations accurately in a solar photovoltaic and battery-storage system.',
        'State the distinct functions of a PV panel, charge controller, battery bank, and DC-to-AC inverter.',
        'Explain how cold-chain storage reduces post-harvest agricultural losses and supports rural incomes.',
        'Contrast diligent, skilled entrepreneurship and financial accountability with dishonest get-rich-quick schemes.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.4.1.1, B8.4.3.1 & B9.4.2.1)', 'Energy transformations, solar PV cells, DC vs AC, and electronics'],
        ['Social Studies (NaCCA CCP B8.5.1 / B9.5.1)', 'Entrepreneurship, cooperative savings, and post-harvest loss reduction'],
        ['Religious & Moral Education (NaCCA CCP B7.6.1.1)', 'Work ethics, dignity of labour, and honest wealth creation'],
      ],
      before: ['Bring a small solar-powered calculator or solar garden torch to class: cover the dark PV strip with a thumb and watch what happens!'],
      during: ['Pause on Page 2 to draw the 4-block system diagram (PV Panel → Charge Controller → Battery → Inverter → AC Load) in notebooks.'],
      after: ['Compare total 3-year costs of a petrol generator vs a solar PV unit (initial purchase cost + 1,000 days of fuel/maintenance).'],
      discussion: ['Why do many bright enterprises collapse when members neglect maintenance savings or honest bookkeeping—and how did the women’s cooperative prevent that?'],
      reflection: ['What real problem in your town or school could technical skill and honest teamwork turn into a useful enterprise?'],
      maths: [
        {
          task: 'Four 400 W rooftop solar panels receive 5 peak sun-hours in a day. What is their ideal daily energy output (in kWh), ignoring system losses? If Harmattan dust cuts output by 20%, how much energy is lost each day until cleaned?',
          answer: 'Ideal output: Total power = 4 × 400 W = 1,600 W = 1.6 kW. Daily energy = 1.6 kW × 5 h = 8.0 kWh. Dust loss (20% of 8.0 kWh) = 1.6 kWh lost per day (leaving 6.4 kWh).',
        },
      ],
      support: ['Provide cut-out cards of the 4 solar components for learners to arrange in sequence with arrows labelled "DC" and "AC".'],
      stretch: ['Investigate why solar panels in Ghana are mounted at a gentle southward tilt for optimal year-round sunlight and rain-clearing.'],
      localise: ['Adapt the perishable commodity to your district—e.g., fresh marine/Volta fish, tomatoes, mangoes, plantain, or fresh milk.'],
      factCheck: [
        {
          claim: 'Solar photovoltaic (PV) cells convert light energy directly into DC electricity, which charge controllers and inverters condition for battery storage and AC loads.',
          explanation: 'Silicon semiconductor PN junctions exhibit the photovoltaic effect under solar irradiance. Direct current (DC) is converted to alternating current (AC) via an inverter to run inductive compressor loads.',
          reference: 'NaCCA CCP Integrated Science B8.4.1.1, B9.4.2.1 & Energy Commission Ghana renewable energy standards.',
        },
      ],
    },
  }),
];
