import * as admin from 'firebase-admin';
import * as fs from 'fs';

if (!admin.apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();

interface LinkedExamQuestion {
  setId: string;
  year: number;
  paper: number;
  questionNumber: number | string;
  promptSnippet: string;
}

const TOPIC_2026_LINKS: Record<string, LinkedExamQuestion[]> = {
  topic_numbers_and_numeration: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 2, promptSnippet: "Mr. Mensah left his house at 9:45 am and reached his village at 4:15 pm." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 7, promptSnippet: "Write 0.000437 in standard form." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 9, promptSnippet: "Simplify: √75 - √18 - √3 + √2." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 20, promptSnippet: "Which of the following is NOT a composite number?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 21, promptSnippet: "Kofi had 150 birds. He sold 26 of them and kept the rest equally in 4 cages." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 24, promptSnippet: "If 2^(2m) = 8, find the value of m." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 39, promptSnippet: "The product of three numbers is 90. Two are 6 and 3, find the third." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "4(a)", promptSnippet: "Calculate yearly incomes of Aku, Brako, and Dagadu and income differences." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "5(a)", promptSnippet: "Simplify √72 / (√18 - √12) leaving answer in the form a + b√c." }
  ],
  topic_sets_and_venn_diagrams: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 23, promptSnippet: "Given μ = {1, 2, ..., 10} and M = {2, 3, 5, 7}, list members in μ not in M." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 26, promptSnippet: "Two sets which have the same number of members are ________ sets." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "1(a)", promptSnippet: "Given K = {1..11}, list primes and find probability of selecting non-prime." }
  ],
  topic_fractions_decimals_percentages: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 1, promptSnippet: "Arrange in descending order: 3/4, 5/8, 0.8, 0.65." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 3, promptSnippet: "In a test, 2/3 passed. If 69 failed, how many passed?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 14, promptSnippet: "Antwi has 20 mangoes and 20% are rotten. How many are not rotten?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 25, promptSnippet: "A boy spends 1/4 of pocket money on books and 1/3 on pens. What fraction remains?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 27, promptSnippet: "Change 25% to a fraction in its lowest form." }
  ],
  topic_ratio_proportion_financial: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 6, promptSnippet: "A trader sold an article for GH¢ 126.00 making a profit of 20%. Find cost price." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 8, promptSnippet: "Mary receives a commission of 15% on articles sold in a week." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 15, promptSnippet: "A class of 42 shared oranges each getting 11. How many will 22 get?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 18, promptSnippet: "Kofi paid simple interest of GH¢ 30.00 on a 4-year loan at 3% p.a." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 19, promptSnippet: "Cyclist at 20 km/h covered distance in 35 mins. Time taken at 28 km/h?" },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 35, promptSnippet: "Ivy and Abbey share GH¢ 30.00 in ratio 3 : 2. Find Abbey's share." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "1(c)", promptSnippet: "A typist charges GH¢ 68.00 for first 8 sheets and GH¢ 11.00 for each additional." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "2(b)", promptSnippet: "Joyce and Richard partnership profit sharing (one-third manager fee)." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "3(a)", promptSnippet: "Asana cashew-fruit collecting daily wage increased by 10% for 30 days." }
  ],
  topic_algebraic_expressions: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 4, promptSnippet: "Factorize completely: 3a²b - 9ab²." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 16, promptSnippet: "Make y the subject of the relation: p = (r - 4y) / 3." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 31, promptSnippet: "Given arithmetic sequence -9, -5, m, 3, 7, 11, find m." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 34, promptSnippet: "Evaluate p²(q - 1) when p = 2 and q = 3/4." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 40, promptSnippet: "Simplify: x - 5(3 - 2x) - 12x + 7." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "1(b)", promptSnippet: "Factorize completely: (x + y)(2m - n) - m(x + y)." }
  ],
  topic_equations_inequalities_graphs: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 13, promptSnippet: "Solve: 7 - 2x > 15 - 4x." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 22, promptSnippet: "If (x + 2) : (x - 2) = 1 : 2, find the value of x." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 28, promptSnippet: "Find the rule for the mapping x -> y: 1->3, 2->6, 3->9." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 38, promptSnippet: "If (3/4)x = 2 + 1/4, find the value of x." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "5(b)", promptSnippet: "Solve: (1/2)(2x + 1) >= (1/3)x + 1(9/10)." }
  ],
  topic_geometry_and_trigonometry: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 5, promptSnippet: "Find the volume of a cube with side 5 m." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 11, promptSnippet: "Image of (2, -3) under translation (x, y) -> (x, y - 2)." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 12, promptSnippet: "Square of area 144 cm² has same perimeter as equilateral triangle." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 29, promptSnippet: "Find circumference of circle whose area is 100π cm²." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 30, promptSnippet: "Find value of y in isosceles triangle between parallel lines (base angle 56°)." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 33, promptSnippet: "If a = (3, 1) and b = (-2, 1), evaluate 6b + 2a." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "2(a)", promptSnippet: "Translation vector r mapping P(2, 5) to (-3, 8), and image of Q(-4, -6)." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "3(b)", promptSnippet: "L-shaped room floor perimeter, area, and cost of carpeting." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "4(b)", promptSnippet: "Ladder leaning against building at 60° angle, foot 5m from building." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "5(c)", promptSnippet: "Athlete runs 4 times round circular track of radius 70 m." }
  ],
  topic_data_handling_probability: [
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 10, promptSnippet: "Probability of selecting letter P from HAPPY." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 17, promptSnippet: "Probability number chosen from {1..10} is greater than 3." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 32, promptSnippet: "Modal mark from 2, 5, 5, 6, 7, 7, 8, 8, 8, 9, 10." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 36, promptSnippet: "Median mark from test frequency distribution table." },
    { setId: "bece-2026-paper", year: 2026, paper: 1, questionNumber: 37, promptSnippet: "Probability learner scored 2 marks from frequency table." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "6(a)", promptSnippet: "Construct frequency distribution table for 30 learners shoe sizes." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "6(b)", promptSnippet: "Deduce most and least purchased shoe sizes based on modal frequency." },
    { setId: "bece-2026-paper", year: 2026, paper: 2, questionNumber: "6(c)", promptSnippet: "Calculate mean shoe size to nearest whole number." }
  ]
};

async function link2026ToTopics() {
  console.log('Linking 2026 BECE questions into 8 topic documents...');

  for (const [topicKey, questionsToLink] of Object.entries(TOPIC_2026_LINKS)) {
    // Topic doc IDs to update (including alias for topic 8)
    const docIds = [topicKey];
    if (topicKey === 'topic_data_handling_probability') {
      docIds.push('topic_data_handling_and_probability');
    }

    for (const docId of docIds) {
      const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${docId}`);
      const snap = await docRef.get();
      if (!snap.exists) {
        console.warn(`Doc ${docId} does not exist in Firestore, skipping.`);
        continue;
      }

      const data = snap.data()!;
      let existingLinks: LinkedExamQuestion[] = data.linkedExamQuestions || [];

      // Filter out existing 2026 questions to prevent duplicates
      existingLinks = existingLinks.filter(q => q.year !== 2026);
      existingLinks.push(...questionsToLink);

      await docRef.update({
        linkedExamQuestions: existingLinks,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Linked ${questionsToLink.length} questions into ${docId}`);
    }

    // Also update local JSON files
    const localFiles = [
      `scripts/payloads/${topicKey}.json`,
      `scripts/payloads/topics/${topicKey}.json`
    ];

    for (const f of localFiles) {
      if (fs.existsSync(f)) {
        try {
          const content = JSON.parse(fs.readFileSync(f, 'utf-8'));
          let links: LinkedExamQuestion[] = content.linkedExamQuestions || [];
          links = links.filter(q => q.year !== 2026);
          links.push(...questionsToLink);
          content.linkedExamQuestions = links;
          fs.writeFileSync(f, JSON.stringify(content, null, 2), 'utf-8');
          console.log(`  ✓ Updated local payload: ${f}`);
        } catch (err) {
          console.warn(`  ⚠️ Could not update ${f}:`, err);
        }
      }
    }
  }

  console.log('\n🎉 Successfully linked all 2026 BECE questions to the 8 curriculum topics!');
}

link2026ToTopics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Linking failed:', err);
    process.exit(1);
  });
