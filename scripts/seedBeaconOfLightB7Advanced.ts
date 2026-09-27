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
    "title": "Basic 7 Literature Diagnostic Lab - Advanced Tier",
    "curriculum": "NaCCA Common Core Programme (CCP) / WAEC BECE Standard",
    "target_level": "BS 7 (JHS 1)",
    "tier": "Advanced",
    "total_questions": 44,
    "breakdown": {
      "section_a_objectives": 40,
      "section_b_theory_extracts": 4
    },
    "prescribed_texts": [
      "Kissiwaa \u2013 The Heroine (Joshlyn Yayra Diabo)",
      "A Medal from Grandpa (Adam Ankrah)",
      "Fly Like an Eagle",
      "The Family That Cared (Lucas Zanyoh)"
    ]
  },
  "objectives": [
    {
      "item_number": 1,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Critical Synthesis & Philosophy",
      "question": "How does Old Soldier's insistence on proper decorum under the Nyamedua tree reinforce the indigenous concept of 'Hlonipha' (mutual respect and dignity)?",
      "options": {
        "A": "By punishing spectators who fail to bet on Kissiwaa",
        "B": "By demanding that competitive intellectual spaces honor sacred community values rather than degrading taunts",
        "C": "By forcing Bediako to forfeit without completing his moves",
        "D": "By establishing a military garrison in Asempayetia square"
      },
      "correct_answer": "B",
      "explanation": "Hlonipha commands deep civic respect, reverent conduct, and mutual dignity, which Old Soldier enforces by forbidding vulgar insults around the sacred board."
    },
    {
      "item_number": 2,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Narrative Perspective & Irony",
      "question": "What critical advantage does the Third-Person Omniscient perspective provide when presenting Jerry's reading failure?",
      "options": {
        "A": "It enables the narrator to mock Jerry's poor vocabulary directly",
        "B": "It contrasts Jerry's external bravado with his concealed panic, making Samuel's quiet grace more poignant",
        "C": "It proves that Mrs. Adjei was unaware of the teasing happening in her classroom",
        "D": "It confines the scene strictly to Abigail's personal impressions"
      },
      "correct_answer": "B",
      "explanation": "Omniscience reveals the hidden interior vulnerability and embarrassment behind Jerry's defense mechanisms, intensifying the impact of Samuel's forgiveness."
    },
    {
      "item_number": 3,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Thematic Synthesis",
      "question": "In 'Fly Like an Eagle', how do the sub-themes of individuality and mentorship intersect to generate academic empowerment?",
      "options": {
        "A": "Mrs. Owusu forces Maame Tutuwa to abandon her personal interests in nature",
        "B": "Empathetic guides (Akua and Mrs. Owusu) validate Tutuwa's unique nature, giving her the emotional safety to overcome anxiety",
        "C": "Maame Tutuwa succeeds only after rejecting all forms of adult advice",
        "D": "Auntie Ama advises her to focus on domestic chores rather than schooling"
      },
      "correct_answer": "B",
      "explanation": "True mentorship nurtures personal identity rather than suppressing it; Akua and Mrs. Owusu channel Tutuwa's reflective spirit into academic resilience."
    },
    {
      "item_number": 4,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Sociological Critique",
      "question": "What socio-environmental critique does the narrative present through the community's initial tolerance of trash on Titanic Beach?",
      "options": {
        "A": "A critique of civic apathy, showing how public spaces degrade when citizens wait for external municipal intervention",
        "B": "An argument that marine pollution is caused entirely by international shipping vessels",
        "C": "A celebration of modern packaging industries in Ghanaian cities",
        "D": "Proof that youth are incapable of organizing municipal cleanups"
      },
      "correct_answer": "A",
      "explanation": "The polluted shore reflects collective neglect and passivity, proving that ecological breakdown continues until grassroots citizen initiative takes ownership."
    },
    {
      "item_number": 5,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Structural Foil & Arc",
      "question": "In what way is Bediako's character transformation essential to the thematic resolution of the story?",
      "options": {
        "A": "His departure from the village proves that men cannot coexist with educated women",
        "B": "His shift from boastful chauvinism to quiet humility demonstrates that patriarchal prejudice can be dismantled through intellectual merit",
        "C": "His immediate challenge to Old Soldier creates a tragic ending for Asempayetia",
        "D": "His victory preserves the ancient traditions of male dominance"
      },
      "correct_answer": "B",
      "explanation": "As a dynamic foil, Bediako's eventual acceptance of defeat symbolizes society's capacity to outgrow entrenched gender prejudices."
    },
    {
      "item_number": 6,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Pedagogical Sub-Text",
      "question": "How does Mrs. Adjei's literature lesson serve as an objective correlative for the classroom's moral atmosphere?",
      "options": {
        "A": "It shows that fictional literature has no connection to real adolescent dilemmas",
        "B": "The thematic principles within the story 'The Family That Cared' materialize directly in the students' practical treatment of Samuel",
        "C": "It proves that rote memorization is superior to emotional discussion in English class",
        "D": "It distracts the students from noticing Samuel's poverty"
      },
      "correct_answer": "B",
      "explanation": "The literature text functions as a moral mirror; the empathy discussed theoretically in the lesson is immediately tested and realized through their actions."
    },
    {
      "item_number": 7,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Literary Mechanics & Tropes",
      "question": "Why is the transition from Maame Tutuwa's 'dark cloud of loneliness' to her 'radiant smile' considered an extended symbolic motif?",
      "options": {
        "A": "It denotes a sudden meteorological shift in the local Ghanaian weather",
        "B": "It traces her internal psychological journey from paralyzing isolation to enlightened self-worth using light and shadow imagery",
        "C": "It warns the reader that academic success is only temporary",
        "D": "It shows that she prefers evening classes to morning lessons"
      },
      "correct_answer": "B",
      "explanation": "The motif connects darkness to self-doubt/isolation and light to intellectual awakening and emotional liberation."
    },
    {
      "item_number": 8,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Intertextual Symbolism",
      "question": "How does Grandpa's medal differ in symbolic value from a conventional academic or sports trophy?",
      "options": {
        "A": "It has monetary resale value to support the family during famine",
        "B": "It represents inherited generational integrity, moral duty, and selfless civic stewardship rather than competitive vanity",
        "C": "It is an official state medal issued directly by the Ghanaian Parliament",
        "D": "It proves that Grandpa was a champion athlete in his youth"
      },
      "correct_answer": "B",
      "explanation": "Trophies celebrate individual conquest over rivals, whereas Grandpa's medal embodies enduring character, familial pride, and service to community."
    },
    {
      "item_number": 9,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Linguistic Diction & Register",
      "question": "What is the strategic literary purpose of integrating indigenous terms such as 'Obunumankoma' and 'Nyamedua' into the English narrative?",
      "options": {
        "A": "To demonstrate that the characters are unable to communicate in standard English",
        "B": "To ground the narrative in authentic Akan philosophy, ancestral memory, and communal space",
        "C": "To create confusion for non-Ghanaian examination candidates",
        "D": "To show that draughts is an exclusively religious ritual"
      },
      "correct_answer": "B",
      "explanation": "Indigenous nomenclature provides authentic cultural texture, linking contemporary themes of gender equality to ancestral wisdom traditions."
    },
    {
      "item_number": 10,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Character Psychology",
      "question": "Why is Abigail's defense of Samuel characterized as 'courageous vulnerability' in the critical commentary?",
      "options": {
        "A": "She risks her own social status and re-opens her past emotional trauma to protect a marginalized peer",
        "B": "She challenges Mrs. Adjei to a public debate regarding school rules",
        "C": "She offers to pay Samuel's school fees with her personal lunch allowance",
        "D": "She physically threatens the boys laughing at Samuel's gari"
      },
      "correct_answer": "A",
      "explanation": "By intervening, Abigail risks becoming a target of peer ridicule herself and exposes her own painful background of poverty to stand in solidarity."
    },
    {
      "item_number": 11,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Narrative Structure",
      "question": "How does the episodic structure of 'Fly Like an Eagle' mirror Maame Tutuwa's cognitive growth?",
      "options": {
        "A": "Disjointed scenes prove that her mind was perpetually disorganized",
        "B": "Each discrete event (bookstore encounter, domestic reflections, classroom tension) builds cumulative emotional scaffolding for her climax",
        "C": "The story jumps backward in time to show her early childhood infancy",
        "D": "It presents competing storylines involving other classmates' families"
      },
      "correct_answer": "B",
      "explanation": "Her development is not an instantaneous miracle; episodic milestones systematically scaffold her confidence until she is ready for the chalkboard test."
    },
    {
      "item_number": 12,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Rhetorical Devices",
      "question": "When the narrator observes that 'the sea breeze carried the scent of freedom', what synesthetic imagery is achieved?",
      "options": {
        "A": "Tactile heat combined with auditory thunder",
        "B": "Olfactory sensation blending physical marine freshness with an abstract state of emotional liberation",
        "C": "Visual darkness combined with bitter taste",
        "D": "Kinetic movement conflicting with physical paralysis"
      },
      "correct_answer": "B",
      "explanation": "Synesthesia blends sensory modalities; linking physical marine air (olfactory/tactile) with 'freedom' elevates physical sensation into emotional epiphany."
    },
    {
      "item_number": 13,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Cultural Institutions",
      "question": "How does the author utilize the crowd around the draughts board to illustrate shifting societal consensus?",
      "options": {
        "A": "The crowd begins with open chauvinistic mockery, transitions into tense silence, and ends in unified applause for female intellect",
        "B": "The crowd attacks Old Soldier and burns the draughts board",
        "C": "The spectators abandon the match to attend a political rally",
        "D": "The crowd refuses to accept Kissiwaa's victory and crowns Bediako champion"
      },
      "correct_answer": "A",
      "explanation": "The crowd operates as a chorus reflecting communal transformation: moving from ingrained prejudice to astonishment, and finally to progressive acceptance."
    },
    {
      "item_number": 14,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Structural Irony & Theme",
      "question": "In 'The Family That Cared', how does situational irony serve as an instrument of moral correction?",
      "options": {
        "A": "By showing that teachers can make spelling errors during examinations",
        "B": "By placing the chief mocker in need of compassion, instantly demonstrating that vulnerability is a universal human condition",
        "C": "By having Samuel discover a bag of money under the tree",
        "D": "By causing the headteacher to cancel literature lessons entirely"
      },
      "correct_answer": "B",
      "explanation": "Jerry's reading blunder strips him of his false superiority, teaching the entire class that everyone is susceptible to weakness and needs support."
    },
    {
      "item_number": 15,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Figurative Analysis",
      "question": "In 'The book transported her to vast savannas...', how does the vehicle of the metaphor operate?",
      "options": {
        "A": "It claims the pages of the book literally transformed into a motor vehicle",
        "B": "It depicts imaginative literature as an expansive vessel that liberates the mind from the physical confines of domestic isolation",
        "C": "It criticizes the cost of purchasing foreign storybooks in Ghana",
        "D": "It proves that Maame Tutuwa wished to move away from her family"
      },
      "correct_answer": "B",
      "explanation": "The metaphor uses geographic transport to show how literature broadens horizons, empowering the reader to visualize worlds beyond current limits."
    },
    {
      "item_number": 16,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Narrative Arc & Resolution",
      "question": "What is the thematic function of concluding the story inside the home rather than at the cleaned beach?",
      "options": {
        "A": "It shows that the beach cleanup was ultimately unsuccessful",
        "B": "It shifts focus from the external public achievement to the internal consolidation of values and intergenerational legacy",
        "C": "It proves that the protagonist was afraid of community fame",
        "D": "It indicates that Grandpa disapproved of public sanitation campaigns"
      },
      "correct_answer": "B",
      "explanation": "The narrative resolution confirms that external achievements gain their true moral meaning through domestic validation and family values."
    },
    {
      "item_number": 17,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Thematic Intersections",
      "question": "How does the story 'Kissiwaa \u2013 The Heroine' redefine the traditional concept of a 'heroine' in junior high literature?",
      "options": {
        "A": "By substituting physical battlefield violence with moral courage, intellectual discipline, and strategic mastery",
        "B": "By portraying a character who rejects all Ghanaian cultural traditions",
        "C": "By showing that a heroine must possess supernatural magical powers",
        "D": "By arguing that only wealthy individuals can effect social change"
      },
      "correct_answer": "A",
      "explanation": "Her heroism is not martial or physical; it is an intellectual triumph achieved through self-control, tactical excellence, and quiet dignity."
    },
    {
      "item_number": 18,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Symbolic Resonance",
      "question": "What dual symbolic function does the 'tree' perform in 'The Family That Cared'?",
      "options": {
        "A": "It represents academic competition and physical punishment",
        "B": "It offers physical protection from natural elements (sun) while providing emotional sanctuary from social cruelty",
        "C": "It symbolizes the dividing line between junior and senior students",
        "D": "It denotes agricultural backwardness within an urban school"
      },
      "correct_answer": "B",
      "explanation": "The sprawling tree serves as both a literal shield from the scorching tropical sun and a psychological safe haven for vulnerable connection."
    },
    {
      "item_number": 19,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Psychological Characterization",
      "question": "Why is Maame Tutuwa's mathematical anxiety depicted as a physical sensation in the narrative?",
      "options": {
        "A": "To suggest she was suffering from an infectious biological illness",
        "B": "To accurately capture how intense fear and emotional intimidation manifest as visceral bodily reactions in young learners",
        "C": "To prove that the classroom lacked proper ventilation",
        "D": "To show that her teacher was physically aggressive"
      },
      "correct_answer": "B",
      "explanation": "Trembling fingers and a tight chest reflect how academic anxiety is experienced physically by students facing fear of public failure."
    },
    {
      "item_number": 20,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Civic Stewardship",
      "question": "How does the protagonist's strategy of rallying students into clubs ensure sustainable impact?",
      "options": {
        "A": "It converts a temporary emotional reaction into a permanent institutional culture of environmental care",
        "B": "It allows the protagonist to charge membership fees to his classmates",
        "C": "It transfers all cleanup duties away from students to the municipal assembly",
        "D": "It ensures that only top academic students are permitted on the beach"
      },
      "correct_answer": "A",
      "explanation": "Institutionalizing efforts through school clubs ensures that ecological stewardship becomes an ongoing, sustainable civic habit."
    },
    {
      "item_number": 21,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "What primary motive drives Kissiwaa to step forward and challenge the reigning draughts champion?",
      "options": {
        "A": "A desire to win the cash purse and leave Asempayetia",
        "B": "An inner conviction to prove that intellectual skill is not a gendered monopoly, vindicating her rigorous self-training",
        "C": "A personal vendetta to humiliate Bediako's family publicly",
        "D": "Direct orders from the village chief to disrupt the tournament"
      },
      "correct_answer": "B",
      "explanation": "Her motivation stems from quiet self-belief and a refusal to let arbitrary gender lines limit intellectual participation."
    },
    {
      "item_number": 22,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Thematic Intersections",
      "question": "How does 'The Family That Cared' illustrate that small individual choices have systemic ripple effects?",
      "options": {
        "A": "Abigail's decision to share lunch leads to a total ban on cafeteria food",
        "B": "A single act of quiet solidarity inspires Jerry's empathy, transforming an entire antagonistic class into a caring surrogate family",
        "C": "Samuel's silence leads to the expulsion of several classmates",
        "D": "Mrs. Adjei cancels examinations to reward the students"
      },
      "correct_answer": "B",
      "explanation": "The narrative tracks the ripple effect: Abigail's empathy disarms Jerry, whose change in turn influences the collective class culture."
    },
    {
      "item_number": 23,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Symbolic Resonance",
      "question": "Why does the author specifically select the eagle rather than a domestic bird to guide Maame Tutuwa's breakthrough?",
      "options": {
        "A": "Domestic birds are considered unlucky in Ghanaian folklore",
        "B": "The eagle embodies solitary strength, soaring above atmospheric storms rather than fleeing from them",
        "C": "Eagles are easier to train as domestic pets in urban Ghana",
        "D": "The school curriculum required students to write essays on birds of prey"
      },
      "correct_answer": "B",
      "explanation": "The eagle's capacity to rise above fierce weather and hunt with patient focus serves as the ideal metaphor for transcending intimidation."
    },
    {
      "item_number": 24,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Figure of Speech Integration",
      "question": "What is the critical effect of personifying the ocean as having 'a heavy, sorrowful sigh' before the cleanup?",
      "options": {
        "A": "It shows that the ocean was dangerous for recreational fishing",
        "B": "It endows nature with emotional sentience, making human environmental pollution feel like a moral crime against a living entity",
        "C": "It proves that the story belongs to the fantasy genre",
        "D": "It suggests the tides were caused by wind speed"
      },
      "correct_answer": "B",
      "explanation": "Personifying nature frames environmental degradation as an ethical violation against a living ecosystem."
    },
    {
      "item_number": 25,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Cultural Ethics",
      "question": "How does the resolution of 'Kissiwaa \u2013 The Heroine' reflect the African philosophy of 'Unhu' (virtue, character, and moral goodness)?",
      "options": {
        "A": "Kissiwaa uses her triumph to mock Bediako and demand tribute from his supporters",
        "B": "Kissiwaa accepts her victory with measured modesty, choosing reconciliation and communal elevation over petty retaliation",
        "C": "The village elders ban men from ever playing draughts again",
        "D": "Bediako refuses to shake hands and leaves the community permanently"
      },
      "correct_answer": "B",
      "explanation": "Unhu is demonstrated when victory is accompanied by humility, gentleness, and civic grace rather than arrogant gloating."
    },
    {
      "item_number": 26,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Pedagogical Analysis",
      "question": "What does Mrs. Adjei's pedagogical style reveal about the broader purpose of literature education in junior high school?",
      "options": {
        "A": "Literature exists solely to drill candidates on grammatical spelling rules",
        "B": "Literature serves as a transformative moral tool to cultivate empathy, interrogate social bias, and develop communal character",
        "C": "Literature should be taught without allowing students to share personal reflections",
        "D": "Literature lessons must focus exclusively on foreign international stories"
      },
      "correct_answer": "B",
      "explanation": "Her lesson demonstrates that literature is not an abstract academic exercise, but a vehicle for moral awakening and character development."
    },
    {
      "item_number": 27,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Diction & Register",
      "question": "In the climactic classroom scene, the author's diction shifts from words of 'paralysis' to words of 'flight'. What does this shift signal?",
      "options": {
        "A": "That the lesson has finished and students are running out to play",
        "B": "The cognitive liberation of Maame Tutuwa as her mind breaks free from fear into fluid, decisive problem-solving",
        "C": "The teacher's sudden anger at the class's poor discipline",
        "D": "The arrival of migratory birds outside the classroom window"
      },
      "correct_answer": "B",
      "explanation": "Diction mirrors internal psychological reality: transitioning from heavy, suffocating imagery to soaring verbs marks intellectual release."
    },
    {
      "item_number": 28,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Setting Function",
      "question": "How does Titanic Beach function as both a literal arena and a symbolic canvas throughout the narrative?",
      "options": {
        "A": "Literally a dumpsite that becomes clean; symbolically an emblem of how civic despair can be converted into communal hope through leadership",
        "B": "Literally a resort for foreign tourists; symbolically an emblem of economic wealth",
        "C": "Literally a sports venue; symbolically a sign of academic competition",
        "D": "Literally an unpopulated desert; symbolically an emblem of total defeat"
      },
      "correct_answer": "A",
      "explanation": "The shoreline is both a physical ecological zone and an extended symbol of community rebirth through youth agency."
    },
    {
      "item_number": 29,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Character Dynamics",
      "question": "Why does Ababio's mocking sneer represent structural rather than merely personal prejudice?",
      "options": {
        "A": "Ababio was paid money by Bediako to distract Kissiwaa",
        "B": "His sneer echoes the wider societal assumption that intellectual strategy is a male prerogative, giving voice to systemic bias",
        "C": "Ababio is the village priest performing a traditional challenge",
        "D": "His words were meant as a joke that everyone misunderstood"
      },
      "correct_answer": "B",
      "explanation": "Ababio's hostility represents the voice of patriarchal hegemony, seeking to police gender boundaries through public ridicule."
    },
    {
      "item_number": 30,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Comparative Dynamics",
      "question": "In the commentary notes, how does Abigail's communication style contrast with Samuel's when processing emotional pain?",
      "options": {
        "A": "Abigail expresses pain through visible tears and emotional release, while Samuel relies on quiet, gentle words and inward stoicism",
        "B": "Abigail becomes physically aggressive, while Samuel runs away from home",
        "C": "Abigail laughs sarcastically, while Samuel complains to school authorities",
        "D": "Abigail remains entirely emotionless, while Samuel shouts at his peers"
      },
      "correct_answer": "A",
      "explanation": "The commentary notes that Abigail's pain surfaces through tears and outward vulnerability, whereas Samuel processes distress through gentle speech and quiet acceptance."
    },
    {
      "item_number": 31,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Character Evolution",
      "question": "What is the broader curricular significance of Maame Tutuwa's mathematical triumph over a social/athletic triumph?",
      "options": {
        "A": "It shows that girls should focus only on STEM subjects and ignore the humanities",
        "B": "It reinforces academic resilience in subjects that often produce gendered anxiety, modeling intellectual self-efficacy for young readers",
        "C": "It proves that athletic activities are unimportant for junior high students",
        "D": "It suggests that classroom exams are more valuable than personal character"
      },
      "correct_answer": "B",
      "explanation": "Placing the turning point in mathematics directly challenges stereotypes regarding female academic anxiety in quantitative disciplines."
    },
    {
      "item_number": 32,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Thematic Interconnections",
      "question": "How does 'A Medal from Grandpa' dismantle the myth that young citizens must wait for adulthood to effect civic change?",
      "options": {
        "A": "By showing the protagonist elected to political office as a child",
        "B": "By illustrating how a student's observation and structured initiative mobilized teachers, schools, and community elders to restore an ecosystem",
        "C": "By proving that children should disobey adult authority figures",
        "D": "By arguing that modern environmental laws are completely useless"
      },
      "correct_answer": "B",
      "explanation": "The narrative demonstrates youth leadership: a young student identifies an issue, devises a solution, and mobilizes the adult community."
    },
    {
      "item_number": 33,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Figure of Speech Interpretation",
      "question": "When the crowd's reaction is described as 'a collective gasp that seemed to inhale the afternoon heat', what device is employed?",
      "options": {
        "A": "Hyperbole and Personification",
        "B": "Oxymoron and Pun",
        "C": "Understatement and Irony",
        "D": "Euphemism and Apostrophe"
      },
      "correct_answer": "A",
      "explanation": "Exaggerating the gasp to 'inhale the afternoon heat' is hyperbole; depicting the heat as swallowed by the breath contains personification."
    },
    {
      "item_number": 34,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Narrative Climax",
      "question": "Why is the climax of 'The Family That Cared' classified as a communal rather than an individual resolution?",
      "options": {
        "A": "The headteacher awards a scholarship to the entire school",
        "B": "The emotional turning point reconciles the entire peer group, transforming the whole classroom into a supportive sanctuary",
        "C": "The story ends with a community feast outside the school walls",
        "D": "Jerry and Samuel win an inter-school quiz competition together"
      },
      "correct_answer": "B",
      "explanation": "The climax does not simply resolve Samuel's hunger; it dismantles schoolyard bullying and elevates the collective moral culture of the entire class."
    },
    {
      "item_number": 35,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Sensory Diction",
      "question": "What is the thematic purpose of juxtaposing the classroom's 'suffocating silence' with the domestic 'warm glow of lanterns'?",
      "options": {
        "A": "To prove that schools should install better lighting fixtures",
        "B": "To accentuate the emotional contrast between the stressful trial of public academic performance and the psychological safety of domestic roots",
        "C": "To indicate that Maame Tutuwa suffered from poor eyesight",
        "D": "To show that Ghanaian homes are free of any daily challenges"
      },
      "correct_answer": "B",
      "explanation": "Sensory juxtaposition reinforces the psychological tension between the intimidating public school arena and the restorative domestic sanctuary."
    },
    {
      "item_number": 36,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Character Motivation",
      "question": "What separates the protagonist's motivation from that of a superficial recognition-seeker?",
      "options": {
        "A": "The protagonist began the cleanup before any newspaper journalist or public reward was contemplated",
        "B": "The protagonist refused to accept the brass medal from Grandpa",
        "C": "The protagonist demanded to be paid by the municipal council",
        "D": "The protagonist kept the cleanup campaign an absolute secret from classmates"
      },
      "correct_answer": "A",
      "explanation": "Authentic civic leadership is self-directed and driven by moral distress at environmental neglect, not by a quest for publicity."
    },
    {
      "item_number": 37,
      "text": "Kissiwaa \u2013 The Heroine",
      "strand": "Prose",
      "sub_strand": "Socio-Cultural Synthesis",
      "question": "How does the draughts board 'Obunumankoma' function as a microcosm of democratic equity in the narrative?",
      "options": {
        "A": "Only the chief's family members are permitted to play on it",
        "B": "The board operates strictly by mathematical logic and rules where status, gender, and age yield entirely to intellectual merit",
        "C": "The pieces can be moved randomly without strategy",
        "D": "It can be played only during political elections"
      },
      "correct_answer": "B",
      "explanation": "The board functions as a social leveler: its rules apply identically to everyone, proving that intellectual capability is blind to social hierarchies."
    },
    {
      "item_number": 38,
      "text": "The Family That Cared",
      "strand": "Prose",
      "sub_strand": "Critical Synthesis",
      "question": "Why is the metaphor 'threads of joy and sorrow' essential to the author's definition of true family?",
      "options": {
        "A": "It shows that families must engage in weaving cloth to survive economically",
        "B": "It asserts that authentic belonging is forged through supporting one another through shared pain, not merely celebrating painless moments",
        "C": "It proves that biological families always fall apart under financial stress",
        "D": "It indicates that joy and sorrow cannot exist in the same environment"
      },
      "correct_answer": "B",
      "explanation": "True solidarity requires shared vulnerability; a compassionate community binds together by holding each other's grief as well as joy."
    },
    {
      "item_number": 39,
      "text": "Fly Like an Eagle",
      "strand": "Prose",
      "sub_strand": "Thematic Intersections",
      "question": "What does Maame Tutuwa's desire to visit the school library immediately after her breakthrough indicate about her growth?",
      "options": {
        "A": "That she intends to hide from her classmates until school closes",
        "B": "That her breakthrough unlocked an active, self-sustaining thirst for intellectual exploration rather than a momentary triumph",
        "C": "That she forgot her personal possessions in the library",
        "D": "That she was ordered to do detention by Mrs. Owusu"
      },
      "correct_answer": "B",
      "explanation": "Heading eagerly to the library proves her transformation is permanent: overcoming fear replaces anxiety with intellectual curiosity."
    },
    {
      "item_number": 40,
      "text": "A Medal from Grandpa",
      "strand": "Prose",
      "sub_strand": "Thematic Resolution",
      "question": "In the final analysis, what does the 'restored beach' signify for Ghanaian national development?",
      "options": {
        "A": "That civic renewal and environmental health are achievable when local communities take moral ownership of their public spaces",
        "B": "That the nation should rely exclusively on foreign environmental funding",
        "C": "That natural resources cannot be conserved without closing public beaches",
        "D": "That youth culture is completely incompatible with traditional wisdom"
      },
      "correct_answer": "A",
      "explanation": "The restored shore stands as a national parable: grassroots community initiative and intergenerational values can reverse societal degradation."
    }
  ],
  "theory": [
    {
      "item_number": 41,
      "text": "Kissiwaa \u2013 The Heroine (Joshlyn Yayra Diabo)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "The crowd under the Nyamedua held its breath. Bediako's fingers hovered over his king piece, trembling with an uncertainty no one had ever witnessed before. Across the board, Kissiwaa sat unmoving, her eyes fixed on the Obunumankoma with the cold, calm discipline of a master strategist. When her hand finally descended, it was not with a flourish of arrogance, but with the quiet finality of truth.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Contrast the psychological states of Bediako and Kissiwaa as revealed through their physical actions in this extract.",
          "marks": 2,
          "expected_answer": "Bediako is gripped by psychological panic, hesitation, and visible vulnerability (demonstrated by his trembling fingers and hovering hand). In contrast, Kissiwaa exhibits absolute self-command, calm composure, and disciplined focus (sitting unmoving with her gaze locked on the board)."
        },
        {
          "label": "(b)",
          "question": "Explain the symbolic significance of Kissiwaa moving her piece 'not with a flourish of arrogance, but with the quiet finality of truth.'",
          "marks": 3,
          "expected_answer": "This line highlights the core ethical theme of Unhu/virtue. Her victory is an assertion of intellectual truth and dignity rather than self-glorifying vanity. By rejecting arrogant posturing, she proves her moral superiority over Bediako's earlier chauvinism."
        },
        {
          "label": "(c)",
          "question": "Analyze how the setting of the Nyamedua tree elevates this moment beyond an ordinary game of draughts.",
          "marks": 2,
          "expected_answer": "The Nyamedua (God's tree) frames the contest under divine and ancestral witness in the village square. It transforms a casual game into a sacred moral reckoning for the whole community, demonstrating that justice, merit, and equality prevail in the sight of God and society."
        },
        {
          "label": "(d)",
          "question": "Identify two core moral lessons highlighted in the official commentary that this scene brings to completion.",
          "marks": 3,
          "expected_answer": "1. Determination and self-belief overcome entrenched societal prejudice. 2. Humility in triumph: True greatness is characterized by dignified composure and respect rather than gloating or vengeance."
        }
      ]
    },
    {
      "item_number": 42,
      "text": "A Medal from Grandpa (Adam Ankrah)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "Grandpa ran his calloused thumb over the tarnished surface of the brass medal before placing it into my hands. 'A clean beach is not just about cleared plastics, my child,' his voice was low, carrying the gravity of an elder who had seen eras pass. 'It is proof that you refused to let your conscience be buried beneath other people's waste.'",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "What is the deeper philosophical meaning of Grandpa's assertion that a clean beach is 'not just about cleared plastics'?",
          "marks": 3,
          "expected_answer": "Grandpa means that physical environmental cleanliness is an outward reflection of internal moral integrity and civic conscience. The real achievement is awakening social responsibility and overcoming the spiritual apathy of accepting community rot."
        },
        {
          "label": "(b)",
          "question": "Identify the metaphor in the phrase 'refused to let your conscience be buried beneath other people's waste.'",
          "marks": 2,
          "expected_answer": "The phrase metaphorically equates moral apathy and loss of ethical agency to being physically suffocated and buried beneath discarded rubbish."
        },
        {
          "label": "(c)",
          "question": "How does Grandpa's role embody the concept of intergenerational mentorship in Ghanaian community life?",
          "marks": 2,
          "expected_answer": "Grandpa connects past generational endurance with current youth civic action. He does not dictate or dismiss modern youth initiatives; instead, he validates, frames, and spiritually rewards them using ancestral wisdom and family legacy."
        },
        {
          "label": "(d)",
          "question": "Explain how the narrative structure (moving from the degraded Titanic Beach to this quiet domestic dialogue) reinforces the central theme.",
          "marks": 3,
          "expected_answer": "The structural progression demonstrates that public civic accomplishments find their lasting validation and moral grounding in family values and personal introspection. The outward transformation of nature is anchored in inward character formation."
        }
      ]
    },
    {
      "item_number": 43,
      "text": "Fly Like an Eagle",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "As she chalked the final integer onto the board, the classroom seemed to tilt. The laughter that had haunted her steps since primary school dissolved into a stunned, breathless stillness. Mrs. Owusu stepped forward, her eyes bright with pride, but Maame Tutuwa was not looking at her teacher. Her gaze was directed out through the louvres toward the open sky, where a lone bird banked against the wind, rising effortlessly.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify two figures of speech used in the extract to convey emotional impact.",
          "marks": 2,
          "expected_answer": "1. Personification / Metaphor: 'laughter that had haunted her steps'. 2. Hyperbole / Metaphor: 'the classroom seemed to tilt'."
        },
        {
          "label": "(b)",
          "question": "What is the dramatic significance of the classmates' laughter dissolving into 'a stunned, breathless stillness'?",
          "marks": 2,
          "expected_answer": "It signals the complete deflation of peer intimidation and mockery. Her indisputable academic competence commands instant respect, permanently reversing the social hierarchy that had marginalized her."
        },
        {
          "label": "(c)",
          "question": "Analyze the symbolic connection between the final integer on the chalkboard and the lone bird outside banking against the wind.",
          "marks": 3,
          "expected_answer": "The solved mathematical equation represents her conquered obstacle; the soaring bird banking against the wind symbolizes her intellectual and emotional liberation. Just as the eagle uses adverse wind currents to rise higher, she has used the trial of self-doubt to ascend into confidence."
        },
        {
          "label": "(d)",
          "question": "How does this scene fulfill the author's primary message regarding self-discovery and resilience?",
          "marks": 3,
          "expected_answer": "It demonstrates that genuine empowerment is discovered internally. By refusing to internalize defeat and finding strength in her own unique gifts, an individual can overcome intense academic barriers and realize their true potential."
        }
      ]
    },
    {
      "item_number": 44,
      "text": "The Family That Cared (Lucas Zanyoh)",
      "strand": "Prose Extract & Advanced Appreciation",
      "extract": "Mrs. Adjei closed the textbook gently, letting the silence settle over the room like morning mist. 'A family,' she spoke softly, looking across the rows at Samuel, Jerry, and Abigail, 'is not defined by whose blood runs in your veins. It is defined by who stands beside you when your hands are empty and your spirit is broken.' In that moment, the schoolyard walls seemed to vanish, leaving only a circle of shared humanity.",
      "total_marks": 10,
      "sub_questions": [
        {
          "label": "(a)",
          "question": "Identify the simile and the metaphor used in the extract.",
          "marks": 2,
          "expected_answer": "Simile: 'letting the silence settle over the room like morning mist'. Metaphor: 'a circle of shared humanity' (or schoolyard walls vanishing)."
        },
        {
          "label": "(b)",
          "question": "Explain how Mrs. Adjei's spoken definition of family challenges traditional social hierarchies in the school.",
          "marks": 3,
          "expected_answer": "It dismantles divisions based on socioeconomic class, peer cliques, and background. By redefining family as mutual care and protective solidarity in moments of vulnerability, she elevates the classroom from an arena of competition to a covenant of equality."
        },
        {
          "label": "(c)",
          "question": "How does this extract reveal both the surface level and the deeper layer of the narrative as outlined in the commentary?",
          "marks": 3,
          "expected_answer": "On the surface level, it is a heartwarming school story about classmates becoming kind friends. On the deeper level, it is an exploration of trauma, economic deprivation (poverty and hunger), and the ethical duty of human communities to shelter the vulnerable."
        },
        {
          "label": "(d)",
          "question": "State two specific criteria from the official teacher rubric used to evaluate student presentations on this story.",
          "marks": 2,
          "expected_answer": "1. Understanding and articulation of the concept of belonging and inclusion. 2. Analysis of the transformative ripple effects of kindness and compassion in breaking down social barriers."
        }
      ]
    }
  ]
};

async function seedBeaconOfLightB7Advanced() {
  console.log("Seeding Basic 7 Advanced Practice Lab for The Beacon of Light Anthology...");
  const db = await getFirestoreDb();

  const allItems: any[] = [];

  // Generate balanced target positions for 40 objective questions (10 A, 10 B, 10 C, 10 D)
  const targetPositions: number[] = [];
  for (let i = 0; i < 10; i++) targetPositions.push(0);
  for (let i = 0; i < 10; i++) targetPositions.push(1);
  for (let i = 0; i < 10; i++) targetPositions.push(2);
  for (let i = 0; i < 10; i++) targetPositions.push(3);
  const shuffledTargetPositions = shuffleArray(targetPositions);

  // 1. Process Section A: 40 Objectives
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

    const qNumStr = qNum < 10 ? "0" + qNum : "" + qNum;
    allItems.push({
      id: `B7_BL_A_OBJ_${qNumStr}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "advanced",
      category: "Prose Analysis",
      text: item.text,
      strand: item.strand,
      subStrand: item.sub_strand,
      passageText: `Prescribed Text: ${item.text} [${item.strand} • ${item.sub_strand}]`,
      prompt: `📖 PRESCRIBED TEXT: ${item.text}\n[${item.strand} • ${item.sub_strand}]\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: correctOptionText,
      hint: `Apply advanced critical evaluation and literary analysis to '${item.text}' in relation to ${item.sub_strand.toLowerCase()}.`,
      workedSolution: item.explanation,
      points: 1,
      competencyTarget: `${item.strand}: ${item.sub_strand}`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Demonstrate advanced critical appreciation of prescribed The Beacon of Light prose texts (${item.text}), analyzing philosophical undertones, character psychology, narrative motifs, synesthesia, and sociological sub-texts.`
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
  console.log(`   📊 Shuffled Option Distribution (40 Items): A: ${dist.A}, B: ${dist.B}, C: ${dist.C}, D: ${dist.D}`);

  // 2. Process Section B: 4 Theory Extracts (Items 41, 42, 43, 44)
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

    const promptText = `📖 PRESCRIBED TEXT EXTRACT:\n"${item.extract}"\n— ${item.text}\n\n❓ CRITICAL ADVANCED APPRECIATION QUESTIONS (Total: ${item.total_marks} Marks):${subQuestionsFormatted}`;

    allItems.push({
      id: `B7_BL_A_TH_${qNum}`,
      section: "theory",
      questionNumber: qNum,
      theoryIndex: theoryIdx,
      type: "structured_essay",
      format: "structured_essay",
      level: "B7",
      difficulty: "advanced",
      category: "Prose Extract & Advanced Appreciation",
      title: `${item.text} - Critical Prose Appreciation`,
      shortSummary: `In-depth extract appreciation, philosophical decoding, and advanced character analysis for '${item.text}' (10 Marks).`,
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
            displayName: "Philosophical & Critical Textual Synthesis",
            maxMarks: 5,
            scoringGuidelines: item.sub_questions.map((sq: any) => `${sq.label} ${sq.question} (${sq.marks}m)`),
            diagnosticChecklist: item.sub_questions.map((sq: any) => `Provides thorough critical insight for sub-question ${sq.label}`)
          },
          expression: {
            name: "expression",
            displayName: "Advanced Literary Rhetoric & Register",
            maxMarks: 5,
            scoringGuidelines: ["Sophisticated mastery of literary vocabulary (objective correlative, synesthesia, Hlonipha/Unhu philosophy, structural irony)"],
            diagnosticChecklist: ["Flawless critical syntax and scholarly analytical depth"]
          }
        }
      },
      modelAnswer: `MODEL ANSWER BREAKDOWN (${item.total_marks} MARKS):${modelAnswerFormatted}`,
      workedSolution: `SCORING GUIDE & EXPLANATION:${modelAnswerFormatted}`,
      hint: `Deeply analyze the extract from '${item.text}' exploring sub-text, symbolic motifs, and philosophical depth.`,
      competencyTarget: `${item.strand} Appreciation: Critical Extract Analysis & Philosophical Synthesis`,
      learningCompetency: `B7.2.2.1 / B7.2.3.1: Critically analyze prose extracts from The Beacon of Light, evaluating thematic architecture, character transformation, symbolic resonance, and societal sub-texts.`
    });
  });

  console.log(`Total Practice Lab items assembled: ${allItems.length} (40 Objective + 4 Theory Extracts)`);

  const labPayload = {
    level: "B7",
    difficulty: "advanced",
    title: "Basic 7 Literature Diagnostic Lab: The Beacon of Light Anthology (Advanced Tier)",
    totalItemsCount: allItems.length,
    objectiveDrillsCount: 40,
    structuredEssaysCount: 4,
    sections: {
      objective: {
        startIndex: 0,
        endIndex: 39,
        count: 40,
        format: "multiple_choice"
      },
      theory: {
        startIndex: 40,
        endIndex: 43,
        count: 4,
        format: "structured_essay",
        allowsDirectTopicFlipping: true,
        topicList: ASSESSMENT_DATA.theory.map((t: any, idx: number) => ({
          questionNumber: t.item_number,
          theoryIndex: idx + 1,
          id: `B7_BL_A_TH_${t.item_number}`,
          title: `${t.text} - Critical Prose Appreciation`,
          category: "Prose Extract & Advanced Appreciation",
          shortSummary: `Critical extract appreciation and analysis of ${t.text}`
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
    'cockcrow_literary_devices'
  ];
  const targetCols = ['topical', 'topics', 'topical_units'];

  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const labRef = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}/practice_labs/B7_advanced`);
      await labRef.set(labPayload);
      console.log(`   ✅ Deployed Practice Lab to: ${labRef.path}`);
    }
  }

  // Update parent doc practice pool for B7 hard/advanced
  for (const docId of targetDocIds) {
    for (const col of targetCols) {
      const mainTopicDoc = db.doc(`global_curriculum/jhs/subjects/english/${col}/${docId}`);
      await mainTopicDoc.set({
        levels: {
          b7: {
            practicePool: {
              hard: allItems.map(item => ({
                id: item.id,
                section: item.section,
                type: item.type,
                format: item.format,
                category: item.category,
                points: item.points
              }))
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool to: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Successfully deployed all 44 items for The Beacon of Light B7 Advanced Lab!`);
}

seedBeaconOfLightB7Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Advanced Lab:", err);
    process.exit(1);
  });
