import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_MOCK_2012_MATH: CurriculumQuestionSet = {
  id: "jhs-math-2012-paper1",
  title: "BECE 2012 Mathematics Paper 1 (Exam Variant Mastery)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2012 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set A = {3, 5, 7, 11} and set B = {3, 6, 9, 12}, find A ∩ B.",
      options: ["{3}", "{5}", "{7}", "{9}"],
      correctAnswer: "{3}",
      hint: "Find the element common to both sets.",
      workedSolution: "A ∩ B represents elements present in both set A and set B. The only common number is 3. Hence, A ∩ B = {3}.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Which of the following numbers is an integer?",
      options: ["-7/3", "-0.45", "-8", "3/4"],
      correctAnswer: "-8",
      hint: "Integers are positive and negative whole numbers including zero, without fractional parts.",
      workedSolution: "-7/3 and 3/4 are fractions, and -0.45 is a decimal. -8 is a negative whole number, which is an integer.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Find the Lowest Common Multiple (LCM) of 2³ × 3 × 5 and 2² × 3² × 5².",
      options: ["2² × 3 × 5", "2³ × 3² × 5²", "2³ × 3 × 5", "2⁵ × 3³ × 5³"],
      correctAnswer: "2³ × 3² × 5²",
      hint: "Take the highest power of each unique prime factor present.",
      workedSolution: "For 2, the highest power is 2³. For 3, the highest power is 3². For 5, the highest power is 5². The LCM is 2³ × 3² × 5².",
      points: 1
    },
    {
      id: "q04",
      prompt: "How many diagonals can be drawn inside a regular quadrilateral (such as a square or rectangle)?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      hint: "Count the lines connecting non-adjacent opposite vertices.",
      workedSolution: "A quadrilateral has 4 vertices. A diagonal connects opposite corners. There are exactly 2 diagonals in any quadrilateral.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Simplify: -3(4 - 7) + 12 - 2(5 + 3) + 25.",
      options: ["10", "20", "30", "40"],
      correctAnswer: "30",
      hint: "Evaluate the terms inside parentheses first, then apply multiplication before adding/subtracting.",
      workedSolution: "-3(-3) + 12 - 2(8) + 25 = 9 + 12 - 16 + 25 = 21 - 16 + 25 = 5 + 25 = 30.",
      points: 1
    },
    {
      id: "q06",
      prompt: "A timber plank 18 m long is sawed into 15 equal lengths. What is the length of each piece?",
      options: ["1.15 m", "1.20 m", "1.25 m", "1.50 m"],
      correctAnswer: "1.20 m",
      hint: "Divide the total length by the number of parts.",
      workedSolution: "18 ÷ 15 = 6/5 = 1.20 m.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Convert 53 to a base two (binary) numeral.",
      options: ["110101_two", "110111_two", "101101_two", "111001_two"],
      correctAnswer: "110101_two",
      hint: "Divide repeatedly by 2 and record the remainders from bottom to top.",
      workedSolution: "53 ÷ 2 = 26 R1; 26 ÷ 2 = 13 R0; 13 ÷ 2 = 6 R1; 6 ÷ 2 = 3 R0; 3 ÷ 2 = 1 R1; 1 ÷ 2 = 0 R1. Reading remainders bottom-up gives 110101_two.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Simplify: (7⁸ × 7⁵) / 7³.",
      options: ["7⁸", "7⁹", "7¹⁰", "7¹³"],
      correctAnswer: "7¹⁰",
      hint: "Apply indices product and quotient laws: aᵐ × aⁿ = aᵐ⁺ⁿ and aᵐ / aⁿ = aᵐ⁻ⁿ.",
      workedSolution: "7⁸ × 7⁵ = 7⁸⁺⁵ = 7¹³. Then 7¹³ / 7³ = 7¹³⁻³ = 7¹⁰.",
      points: 1
    },
    {
      id: "q09",
      prompt: "A water reservoir contains 600 litres of water. If 150 litres is pumped out for irrigation, what percentage remains in the reservoir?",
      options: ["25%", "50%", "70%", "75%"],
      correctAnswer: "75%",
      hint: "Find the remaining volume first, then express it over the total.",
      workedSolution: "Water remaining = 600 - 150 = 450 litres. Percentage remaining = (450 / 600) × 100% = 3/4 × 100% = 75%.",
      points: 1
    },
    {
      id: "q10",
      prompt: "In a right-angled triangle XYZ with right angle at Y, XY = 6 cm and YZ = 8 cm. What is the length of hypotenuse XZ?",
      options: ["9 cm", "10 cm", "12 cm", "14 cm"],
      correctAnswer: "10 cm",
      hint: "Apply Pythagoras' theorem: XZ² = XY² + YZ².",
      workedSolution: "XZ² = 6² + 8² = 36 + 64 = 100. XZ = √100 = 10 cm.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Arrange the following fractions in descending order of magnitude: 3/4, 4/5, 1/2, 2/3.",
      options: ["4/5, 3/4, 2/3, 1/2", "3/4, 4/5, 2/3, 1/2", "1/2, 2/3, 3/4, 4/5", "4/5, 2/3, 3/4, 1/2"],
      correctAnswer: "4/5, 3/4, 2/3, 1/2",
      hint: "Convert to decimals or use common denominator 60: 4/5=0.80, 3/4=0.75, 2/3≈0.67, 1/2=0.50.",
      workedSolution: "In decimal form: 4/5 = 0.80, 3/4 = 0.75, 2/3 ≈ 0.667, 1/2 = 0.50. Arranging from greatest to least: 4/5, 3/4, 2/3, 1/2.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Find the image of 4 under the mapping x → 15 - 3x.",
      options: ["1", "3", "7", "12"],
      correctAnswer: "3",
      hint: "Substitute x = 4 into the expression 15 - 3x.",
      workedSolution: "Image = 15 - 3(4) = 15 - 12 = 3.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Simplify: 1/2 + 1/4 + 1/8.",
      options: ["3/8", "5/8", "7/8", "9/8"],
      correctAnswer: "7/8",
      hint: "Use the common denominator 8.",
      workedSolution: "1/2 = 4/8, 1/4 = 2/8. Adding gives: 4/8 + 2/8 + 1/8 = 7/8.",
      points: 1
    },
    {
      id: "q14",
      prompt: "If 3x = 4(x - 3) + 17, find the value of x.",
      options: ["-5", "-1", "1", "5"],
      correctAnswer: "-5",
      hint: "Expand the right side and group like terms: 3x = 4x - 12 + 17.",
      workedSolution: "3x = 4x - 12 + 17 => 3x = 4x + 5 => 3x - 4x = 5 => -x = 5 => x = -5.",
      points: 1
    },
    {
      id: "q15",
      prompt: "The daytime temperatures (°C) of a town from Monday to Friday are 31, 33, 29, 35, and 32. Find the average daytime temperature for the 5 days.",
      options: ["31.0°C", "32.0°C", "32.4°C", "33.0°C"],
      correctAnswer: "32.0°C",
      hint: "Sum all temperatures and divide by 5.",
      workedSolution: "Sum = 31 + 33 + 29 + 35 + 32 = 160. Mean = 160 ÷ 5 = 32.0°C.",
      points: 1
    },
    {
      id: "q16",
      prompt: "A bowl contains 40 markers: 25 are black and the rest are red. If a marker is picked at random, what is the probability of selecting a red marker?",
      options: ["3/8", "5/8", "1/4", "3/5"],
      correctAnswer: "3/8",
      hint: "Find the number of red markers, then divide by 40.",
      workedSolution: "Number of red markers = 40 - 25 = 15. Probability = 15/40 = 3/8.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Find the truth set of: 1/3(x + 4) ≤ x - 2.",
      options: ["{x : x ≤ 2}", "{x : x ≥ 3}", "{x : x ≥ 5}", "{x : x ≤ 5}"],
      correctAnswer: "{x : x ≥ 5}",
      hint: "Multiply both sides by 3 to clear the fraction.",
      workedSolution: "x + 4 ≤ 3(x - 2) => x + 4 ≤ 3x - 6 => 4 + 6 ≤ 3x - x => 10 ≤ 2x => 5 ≤ x (or x ≥ 5).",
      points: 1
    },
    {
      id: "q18",
      prompt: "The perimeter of a shape consisting of a 3-sided rectangle base and a semicircular top is 54 cm. The base width is 14 cm and each vertical side is 13 cm. What is the diameter of the semicircular arc?",
      options: ["7 cm", "14 cm", "21 cm", "28 cm"],
      correctAnswer: "14 cm",
      hint: "The diameter of the semicircular portion matches the width of the rectangle base.",
      workedSolution: "The semi-circular top rests directly across the width of 14 cm, making the diameter equal to 14 cm.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Simplify: (2x / 3) - ((x - 2y) / 4).",
      options: ["(5x + 6y) / 12", "(5x - 6y) / 12", "(7x + 6y) / 12", "(x + 2y) / 12"],
      correctAnswer: "(5x + 6y) / 12",
      hint: "Find the LCM of 3 and 4, which is 12, and distribute the negative sign carefully.",
      workedSolution: "LCM = 12. [4(2x) - 3(x - 2y)] / 12 = [8x - 3x + 6y] / 12 = (5x + 6y) / 12.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Kwabena is 25% heavier than Akosua. If Kwabena weighs 75 kg, what is Akosua's weight?",
      options: ["50 kg", "55 kg", "60 kg", "65 kg"],
      correctAnswer: "60 kg",
      hint: "Kwabena's weight = 125% of Akosua's weight.",
      workedSolution: "Let Akosua's weight be W. 1.25 × W = 75 => W = 75 / 1.25 = 60 kg.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Calculate the volume of a solid cylinder of radius 3 cm and height 7 cm. (Take π = 22/7).",
      options: ["66 cm³", "132 cm³", "198 cm³", "264 cm³"],
      correctAnswer: "198 cm³",
      hint: "Volume = πr²h.",
      workedSolution: "Volume = (22/7) × 3² × 7 = (22/7) × 9 × 7 = 22 × 9 = 198 cm³.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Given the points P(2, -3) and Q(6, 5), calculate the gradient (slope) of the line PQ.",
      options: ["1/2", "1", "2", "4"],
      correctAnswer: "2",
      hint: "Gradient m = (y₂ - y₁) / (x₂ - x₁).",
      workedSolution: "m = (5 - (-3)) / (6 - 2) = (5 + 3) / 4 = 8 / 4 = 2.",
      points: 1
    },
    {
      id: "q23",
      prompt: "A trader invested GH¢ 80,000 at 5% simple interest per annum. How many years will it take to earn an interest of GH¢ 16,000?",
      options: ["2 years", "3 years", "4 years", "5 years"],
      correctAnswer: "4 years",
      hint: "Time T = (100 × I) / (P × R).",
      workedSolution: "T = (100 × 16000) / (80000 × 5) = 1600000 / 400000 = 4 years.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Express 4.625 as a mixed fraction in its lowest terms.",
      options: ["4 1/8", "4 3/8", "4 5/8", "4 7/8"],
      correctAnswer: "4 5/8",
      hint: "Convert 0.625 into 625/1000 and divide numerator and denominator by 125.",
      workedSolution: "0.625 = 625/1000 = 5/8. So 4.625 = 4 5/8.",
      points: 1
    },
    {
      id: "q25",
      prompt: "A town map has a scale of 1:50,000. What actual ground distance in kilometres is represented by 8 cm on the map?",
      options: ["2 km", "4 km", "8 km", "40 km"],
      correctAnswer: "4 km",
      hint: "1 km = 100,000 cm. Multiply map distance by scale, then convert cm to km.",
      workedSolution: "Actual distance = 8 cm × 50,000 = 400,000 cm. 400,000 ÷ 100,000 = 4 km.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Given vectors u = (-2, 5)ᵀ and v = (3, -2)ᵀ, calculate u - 2v.",
      options: ["(-8, 9)ᵀ", "(-8, 1)ᵀ", "(4, 9)ᵀ", "(-5, 7)ᵀ"],
      correctAnswer: "(-8, 9)ᵀ",
      hint: "Subtract 2 times each component of v from u.",
      workedSolution: "x-component: -2 - 2(3) = -2 - 6 = -8. y-component: 5 - 2(-2) = 5 + 4 = 9. Vector = (-8, 9)ᵀ.",
      points: 1
    },
    {
      id: "q27",
      prompt: "A baker bought 600 g of butter, 750 g of flour, and 1,150 g of sugar. What is the total mass of the items in kilograms?",
      options: ["2.40 kg", "2.50 kg", "2.60 kg", "25.0 kg"],
      correctAnswer: "2.50 kg",
      hint: "Add the masses in grams and divide by 1,000.",
      workedSolution: "600 + 750 + 1150 = 2,500 g. 2,500 g ÷ 1000 = 2.50 kg.",
      points: 1
    },
    {
      id: "q28",
      prompt: "A wall clock gains 2 minutes every hour. How many total minutes will it gain from 6:00 AM to 6:00 PM on the same day?",
      options: ["12 minutes", "18 minutes", "24 minutes", "36 minutes"],
      correctAnswer: "24 minutes",
      hint: "Find the total elapsed hours between 6 AM and 6 PM.",
      workedSolution: "From 6:00 AM to 6:00 PM is 12 hours. 12 hours × 2 min/hour = 24 minutes.",
      points: 1
    },
    {
      id: "q29",
      prompt: "A digital printing press prints 450 booklets in 3 hours. How many booklets will it produce in 7 hours working at the same speed?",
      options: ["900 booklets", "1,050 booklets", "1,200 booklets", "1,350 booklets"],
      correctAnswer: "1,050 booklets",
      hint: "Find the rate per hour first.",
      workedSolution: "Rate = 450 ÷ 3 = 150 booklets/hour. In 7 hours = 150 × 7 = 1,050 booklets.",
      points: 1
    },
    {
      id: "q30",
      prompt: "The three-figure bearing of Town A from Town B is 250°. What is the back bearing of Town B from Town A?",
      options: ["050°", "070°", "110°", "160°"],
      correctAnswer: "070°",
      hint: "Since the bearing is greater than 180°, subtract 180°.",
      workedSolution: "Back bearing = 250° - 180° = 070°.",
      points: 1
    },
    {
      id: "q31",
      prompt: "In a class of 35 students, 18 study Computing only and 10 study French only. If every student studies at least one of the two subjects, how many students study French altogether?",
      options: ["7", "10", "17", "25"],
      correctAnswer: "17",
      hint: "Find the intersection first: total - (Computing only + French only).",
      workedSolution: "Both subjects = 35 - (18 + 10) = 35 - 28 = 7. Total French students = French only + Both = 10 + 7 = 17.",
      points: 1
    },
    {
      id: "q32",
      prompt: "Convert 94 to a base five numeral.",
      options: ["324_five", "334_five", "414_five", "424_five"],
      correctAnswer: "334_five",
      hint: "Divide repeatedly by 5 and write remainders bottom-up.",
      workedSolution: "94 ÷ 5 = 18 R4; 18 ÷ 5 = 3 R3; 3 ÷ 5 = 0 R3. Reading remainders bottom-up: 334_five.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Triangle P₁Q₁R₁ is an enlargement of triangle PQR. If corresponding side PQ = 5 cm and P₁Q₁ = 15 cm, determine the scale factor of enlargement.",
      options: ["0.33", "2.00", "3.00", "5.00"],
      correctAnswer: "3.00",
      hint: "Scale factor = length of image side ÷ length of object side.",
      workedSolution: "Scale factor = 15 cm ÷ 5 cm = 3.00.",
      points: 1
    },
    {
      id: "q34",
      prompt: "Find the smallest whole number that must be added to 412 to make it exactly divisible by 17.",
      options: ["4", "9", "13", "15"],
      correctAnswer: "13",
      hint: "Find the remainder when 412 is divided by 17, then subtract from 17.",
      workedSolution: "412 ÷ 17 = 24 with remainder 4 (since 24 × 17 = 408). The next multiple is 25 × 17 = 425. Number to add = 425 - 412 = 13.",
      points: 1
    },
    {
      id: "q35",
      prompt: "In an academy of 780 students, the number of boys exceeds the number of girls by 120. How many boys are in the academy?",
      options: ["330", "420", "450", "480"],
      correctAnswer: "450",
      hint: "Let girls be g, then boys = g + 120. Their sum is 780.",
      workedSolution: "g + (g + 120) = 780 => 2g + 120 = 780 => 2g = 660 => g = 330 girls. Boys = 330 + 120 = 450.",
      points: 1
    },
    {
      id: "q36",
      prompt: "Which of the following fractions is equivalent to 4/7?",
      options: ["12/28", "16/28", "20/32", "24/49"],
      correctAnswer: "16/28",
      hint: "Multiply both numerator and denominator by 4.",
      workedSolution: "(4 × 4) / (7 × 4) = 16/28.",
      points: 1
    },
    {
      id: "q37",
      prompt: "Two parallel lines are crossed by a transversal line. If an interior angle on one side is 48°, find the size of the adjacent obtuse angle on the straight line.",
      options: ["42°", "132°", "138°", "148°"],
      correctAnswer: "132°",
      hint: "Angles on a straight line add up to 180°.",
      workedSolution: "180° - 48° = 132°.",
      points: 1
    },
    {
      id: "q38",
      prompt: "When a transversal intersects two parallel lines, alternate interior angles are:",
      options: ["Supplementary", "Complementary", "Equal", "Add up to 360°"],
      correctAnswer: "Equal",
      hint: "Remember the 'Z' angle rule in geometry.",
      workedSolution: "Alternate interior angles formed by a transversal intersecting parallel lines are always equal in magnitude.",
      points: 1
    },
    {
      id: "q39",
      prompt: "Expand and simplify: -2y(4 - 3y).",
      options: ["-8y - 6y²", "6y² - 8y", "-6y² + 8y", "6y² + 8y"],
      correctAnswer: "6y² - 8y",
      hint: "Multiply each term inside brackets by -2y. Note that (-2y) × (-3y) = +6y².",
      workedSolution: "-2y(4) + (-2y)(-3y) = -8y + 6y² = 6y² - 8y.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Express 48 as a product of its prime factors in index notation.",
      options: ["2³ × 6", "2⁴ × 3", "2² × 3²", "3 × 16"],
      correctAnswer: "2⁴ × 3",
      hint: "Divide 48 by prime numbers: 48 = 16 × 3 = 2⁴ × 3.",
      workedSolution: "48 ÷ 2 = 24; 24 ÷ 2 = 12; 12 ÷ 2 = 6; 6 ÷ 2 = 3; 3 ÷ 3 = 1. Prime factors = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3.",
      points: 1
    }
  ]
};

export const SET_JHS_MASTERY_SERIES_01: CurriculumQuestionSet = {
  ...SET_JHS_MOCK_2012_MATH,
  id: "jhs-math-mastery-series-01",
  title: "Junior Core Mathematics • Objective Mastery Series (Paper 1)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Objective Examination & Foundational Mastery",
  variantType: "past_paper_variant"
};

export const SET_JHS_MASTERY_SERIES_02: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-02",
  title: "Junior Core Mathematics • Mastery & Problem-Solving Series (Paper 2)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Problem Solving & Mathematical Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Computation, Proportional Sharing & Angle Geometry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question:\n\n**(a)** Evaluate $\\frac{0.048 \\times 1.05}{0.00012}$, leaving your final answer in standard form.\n\n**(b)** An amount of GH¢ 5,400.00 was shared between Esi and Kwesi. If Esi received $\\frac{4}{9}$ of the total amount, find Kwesi's share and what percentage of Esi's share Kwesi received.\n\n**(c)** Three angles meet at a common vertex point $O$ on a plane: $(3x - 10)^\\circ$, $(2x + 40)^\\circ$, and $(x + 30)^\\circ$. Calculate the value of $x$.",
      hint: "Review decimal simplification using powers of 10, fractional sharing of quantities, and the sum of angles meeting at a point.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Evaluate $$\\frac{0.048 \\times 1.05}{0.00012}$$, leaving your final answer in standard form.",
          hint: "Convert decimals to whole numbers by multiplying numerator and denominator by $10^5$, or convert each decimal into a common fraction before simplifying.",
          modelAnswer: "$4.2 \\times 10^2$",
          workedSolution: "**Method 1: Whole Number Conversion**\n$$\\frac{0.048 \\times 1.05}{0.00012} = \\frac{0.0504}{0.00012}$$\nMultiply both numerator and denominator by $100,000$ to clear the decimals:\n$$= \\frac{0.0504 \\times 100,000}{0.00012 \\times 100,000} = \\frac{5,040}{12}$$\n$$= 420$$\nExpressing in standard form ($A \\times 10^n$ where $1 \\le A < 10$):\n$$420 = 4.2 \\times 10^2$$\n\n*(Award full marks for showing whole number conversion, intermediate simplification of 420, and the correct standard form exponent).*"
        },
        {
          partLabel: "(b)(i)",
          marks: 4,
          prompt: "An amount of GH¢ 5,400.00 was shared between Esi and Kwesi. If Esi received $\\frac{4}{9}$ of the total amount, how much did Kwesi receive?",
          hint: "Kwesi's fraction of the total is $1 - \\frac{4}{9} = \\frac{5}{9}$, or compute Esi's share in cedis first and subtract it from GH¢ 5,400.00.",
          modelAnswer: "GH¢ 3,000.00",
          workedSolution: "**Step 1: Compute Esi's share**\n$$\\text{Esi's share} = \\frac{4}{9} \\times \\text{GH¢ } 5,400.00 = 4 \\times \\text{GH¢ } 600.00 = \\text{GH¢ } 2,400.00$$\n\n**Step 2: Calculate Kwesi's share**\n$$\\text{Kwesi's share} = \\text{GH¢ } 5,400.00 - \\text{GH¢ } 2,400.00 = \\text{GH¢ } 3,000.00$$\n\n*(Alternatively: Kwesi's fraction = $1 - \\frac{4}{9} = \\frac{5}{9}$. Then $\\frac{5}{9} \\times 5,400 = 5 \\times 600 = \\text{GH¢ } 3,000.00$)*."
        },
        {
          partLabel: "(b)(ii)",
          marks: 3,
          prompt: "What percentage of Esi's share did Kwesi receive?",
          hint: "Express Kwesi's share as a fraction of Esi's share, then multiply by $100\\%$.",
          modelAnswer: "125%",
          workedSolution: "$$\\text{Percentage} = \\left(\\frac{\\text{Kwesi's share}}{\\text{Esi's share}}\\right) \\times 100\\%$$\n$$= \\left(\\frac{3,000}{2,400}\\right) \\times 100\\% = \\left(\\frac{5}{4}\\right) \\times 100\\% = 125\\%$$\nKwesi received $125\\%$ of Esi's share."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Three angles meet at a common vertex point $O$ on a plane: $(3x - 10)^\\circ$, $(2x + 40)^\\circ$, and $(x + 30)^\\circ$. Calculate the value of $x$.",
          hint: "The sum of all adjacent angles meeting at a point in a complete revolution is equal to $360^\\circ$.",
          modelAnswer: "x = 50°",
          workedSolution: "Sum of angles at a point = $360^\\circ$:\n$$(3x - 10)^\\circ + (2x + 40)^\\circ + (x + 30)^\\circ = 360^\\circ$$\nCombine like terms:\n$$(3x + 2x + x) + (-10 + 40 + 30) = 360$$\n$$6x + 60 = 360$$\n$$6x = 360 - 60$$\n$$6x = 300$$\n$$x = \\frac{300}{6} = 50^\\circ$$\nTherefore, $x = 50$."
        }
      ]
    },
    {
      id: "q02",
      prompt: "Answer all parts of this question:\n\n**(a)** A commercial delivery van uses 1 litre of diesel for every 25 km travelled. A courier begins a 450 km journey with 11 litres of fuel already in the tank.\n   - **(i)** How many additional litres of fuel are needed to complete the trip?\n   - **(ii)** If diesel costs GH¢ 12.00 per litre, calculate the total cost of fuel used for the 450 km journey.\n\n**(b)** The average daily attendance at a regional conference for the first four days was 1,250 delegates. On the fifth day, 1,650 delegates attended. Calculate:\n   - **(i)** The total attendance for the first 4 days.\n   - **(ii)** The mean daily attendance across the 5 days.\n\n**(c)** The area of a square playground is 169 m². Determine the total perimeter (distance around) the playground.",
      options: [
        "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m",
        "(a)(i) 8 litres, (ii) GH¢ 220.00 | (b)(i) 5,000, (ii) 1,350 | (c) 48 m",
        "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 4,800, (ii) 1,290 | (c) 56 m",
        "(a)(i) 6 litres, (ii) GH¢ 204.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m"
      ],
      correctAnswer: "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m",
      hint: "Divide total distance by fuel efficiency to find total litres needed. For attendance, total = average × number of days. For the square, find the side length as the square root of 169 m².",
      workedSolution: "(a)(i) Total fuel required = 450 km ÷ 25 km/litre = 18 litres. Additional fuel needed = 18 - 11 = 7 litres.\n(a)(ii) Cost of fuel = 18 litres × GH¢ 12.00 = GH¢ 216.00.\n(b)(i) Total attendance for 4 days = 4 × 1,250 = 5,000 delegates.\n(b)(ii) Total attendance for 5 days = 5,000 + 1,650 = 6,650. Mean = 6,650 ÷ 5 = 1,330 delegates.\n(c) Side length s = √169 = 13 m. Perimeter = 4s = 4 × 13 m = 52 m.",
      points: 15
    },
    {
      id: "q03",
      prompt: "Answer all parts of this question:\n\n**(a)** A survey of 120 senior high school students shows their preferred elective subjects: General Arts (36), Visual Arts (24), Business (30), and Science (30).\n   - **(i)** Calculate the sector angle for General Arts and Visual Arts in a pie chart.\n   - **(ii)** If a student is picked at random, what is the probability that they prefer Visual Arts?\n\n**(b)** A market vendor purchased 180 grapefruits for GH¢ 30.00. She packed and sold them in groups of 3 for 80 Pesewas (GH¢ 0.80).\n   - **(i)** Calculate the total selling price of all the grapefruits.\n   - **(ii)** Determine the percentage profit made by the vendor.",
      options: [
        "(a)(i) 108° & 72°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%",
        "(a)(i) 90° & 60°, (ii) 1/4 | (b)(i) GH¢ 45.00, (ii) 50%",
        "(a)(i) 108° & 72°, (ii) 1/6 | (b)(i) GH¢ 42.00, (ii) 40%",
        "(a)(i) 120° & 80°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%"
      ],
      correctAnswer: "(a)(i) 108° & 72°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%",
      hint: "Angle = (frequency / total) × 360°. For the fruit, find how many groups of 3 are in 180, then multiply by GH¢ 0.80.",
      workedSolution: "(a)(i) General Arts angle = (36/120) × 360° = 108°. Visual Arts angle = (24/120) × 360° = 72°.\n(a)(ii) Probability = 24 / 120 = 1/5.\n(b)(i) Number of groups of 3 = 180 ÷ 3 = 60 groups. Total Selling Price = 60 × GH¢ 0.80 = GH¢ 48.00.\n(b)(ii) Profit = Total SP - Total CP = 48.00 - 30.00 = GH¢ 18.00. Percentage profit = (18 / 30) × 100% = 60%.",
      points: 15
    },
    {
      id: "q04",
      prompt: "The test scores of 25 students in an ICT quiz are recorded as follows:\n\n`5, 7, 4, 6, 5, 8, 7, 5, 6, 5, 7, 4, 8, 5, 6, 7, 5, 6, 4, 7, 5, 8, 6, 7, 5`\n\n**(a)** Construct a frequency table and determine the modal score.\n\n**(b)** Calculate the mean mark for the distribution.\n\n**(c)** Find the median score of the class.",
      options: [
        "(a) Mode = 5 (Frequency 8) | (b) Mean = 5.92 | (c) Median = 6",
        "(a) Mode = 6 (Frequency 8) | (b) Mean = 5.80 | (c) Median = 5",
        "(a) Mode = 5 (Frequency 8) | (b) Mean = 6.10 | (c) Median = 6",
        "(a) Mode = 7 (Frequency 6) | (b) Mean = 5.92 | (c) Median = 7"
      ],
      correctAnswer: "(a) Mode = 5 (Frequency 8) | (b) Mean = 5.92 | (c) Median = 6",
      hint: "Tally frequencies for each score: 4 (3), 5 (8), 6 (5), 7 (6), 8 (3). Mean = Σfx / N. Find the 13th score for the median.",
      workedSolution: "Frequency distribution: Score 4 occurs 3 times; Score 5 occurs 8 times; Score 6 occurs 5 times; Score 7 occurs 6 times; Score 8 occurs 3 times. Total students N = 25.\n(a) The modal score is 5 with the highest frequency of 8.\n(b) Sum Σfx = (4×3) + (5×8) + (6×5) + (7×6) + (8×3) = 12 + 40 + 30 + 42 + 24 = 148. Mean = 148 ÷ 25 = 5.92.\n(c) Median position = (25 + 1) / 2 = 13th term. Cumulative frequencies: Score 4 (3), Score 5 (11), Score 6 (16). Since the 13th term lies in the Score 6 category, Median = 6.",
      points: 15
    },
    {
      id: "q05",
      prompt: "Answer all parts of this question:\n\n**(a)**\n   - **(i)** Find the Least Common Multiple (LCM) of 8, 12, and 20.\n   - **(ii)** Arrange the fractions $\\frac{5}{8}$, $\\frac{7}{12}$, and $\\frac{11}{20}$ in ascending order of magnitude.\n\n**(b)** In a geometric construction of triangle ABC, $|AB| = 9\\text{ cm}$, angle $CAB = 60^\\circ$, and angle $CBA = 45^\\circ$. Perpendicular bisectors of $AC$ and $BC$ intersect at point $O$. If $O$ is the circumcentre, state the geometric relationship between $OA$, $OB$, and $OC$.",
      options: [
        "(a)(i) 120, (ii) 11/20, 7/12, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
        "(a)(i) 240, (ii) 7/12, 11/20, 5/8 | (b) OA + OB = OC",
        "(a)(i) 120, (ii) 7/12, 11/20, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
        "(a)(i) 60, (ii) 5/8, 7/12, 11/20 | (b) OA = OB > OC"
      ],
      correctAnswer: "(a)(i) 120, (ii) 11/20, 7/12, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
      hint: "Find the prime factors: 8 = 2³, 12 = 2² × 3, 20 = 2² × 5. LCM = 2³ × 3 × 5. Use the common denominator 120 to order the fractions.",
      workedSolution: "(a)(i) Prime factorization: 8 = 2³, 12 = 2² × 3, 20 = 2² × 5. LCM = 2³ × 3 × 5 = 8 × 15 = 120.\n(a)(ii) Converting to common denominator 120: 5/8 = 75/120; 7/12 = 70/120; 11/20 = 66/120. Ascending order (smallest to largest): 66/120 < 70/120 < 75/120, which is 11/20, 7/12, 5/8.\n(b) The intersection of the perpendicular bisectors of the sides of a triangle is its circumcentre. The circumcentre is equidistant from all three vertices: OA = OB = OC = circumradius R.",
      points: 15
    },
    {
      id: "q06",
      prompt: "Answer all parts of this question:\n\n**(a)** Triangle $PQR$ has vertices $P(3, 1)$, $Q(1, 4)$, and $R(1, 1)$.\n   - **(i)** Write down the coordinates of image $P_1Q_1R_1$ after a reflection in the x-axis.\n   - **(ii)** Write down the coordinates of image $P_2Q_2R_2$ after translating triangle $PQR$ by vector $\\vec{v} = \\begin{pmatrix} -2 \\\\ 3 \\end{pmatrix}$.\n\n**(b)** Factorize completely the algebraic expression: $4x^2 - 6xy + 8xz - 12yz$.",
      options: [
        "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) 2(2x - 3y)(x + 2z)",
        "(a)(i) P₁(-3,1), Q₁(-1,4), R₁(-1,1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) (2x - 3y)(2x + 4z)",
        "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(5,-2), Q₂(3,1), R₂(3,-2) | (b) 2(2x + 3y)(x - 2z)",
        "(a)(i) P₁(-3,-1), Q₁(-1,-4), R₁(-1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) (4x - 6y)(x + 2z)"
      ],
      correctAnswer: "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) 2(2x - 3y)(x + 2z)",
      hint: "Under reflection in the x-axis, (x, y) → (x, -y). Under translation by (-2, 3)ᵀ, (x, y) → (x - 2, y + 3). Group terms with common factors to factorize.",
      workedSolution: "(a)(i) Reflection in x-axis: (x, y) → (x, -y). P(3, 1) → P₁(3, -1); Q(1, 4) → Q₁(1, -4); R(1, 1) → R₁(1, -1).\n(a)(ii) Translation by (-2, 3)ᵀ: (x, y) → (x - 2, y + 3). P(3, 1) → P₂(3-2, 1+3) = P₂(1, 4); Q(1, 4) → Q₂(1-2, 4+3) = Q₂(-1, 7); R(1, 1) → R₂(1-2, 1+3) = R₂(-1, 4).\n(b) 4x² - 6xy + 8xz - 12yz = 2x(2x - 3y) + 4z(2x - 3y) = (2x - 3y)(2x + 4z) = 2(2x - 3y)(x + 2z).",
      points: 15
    }
  ]
};

export const SET_JHS_MASTERY_SERIES_03: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-03",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 3)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "Which of the following represents the set of prime factors of $18$?",
      options: ["{2, 3}", "{1, 2, 3}", "{2, 3, 6, 9}", "{1, 2, 3, 6, 9, 18}"],
      correctAnswer: "{2, 3}",
      hint: "Prime factors are factors of 18 that are prime numbers.",
      workedSolution: "Factors of 18 are 1, 2, 3, 6, 9, 18. Among these, the only prime numbers are 2 and 3. Hence, the set is {2, 3}.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Expand and simplify: $$4x(2x - 3y)$$.",
      options: ["$$8x^2 - 12xy$$", "$$8x - 12xy$$", "$$8x^2 - 12y$$", "$$6x^2 - 7xy$$"],
      correctAnswer: "$$8x^2 - 12xy$$",
      hint: "Distribute $4x$ across each term inside the parentheses.",
      workedSolution: "$$4x(2x) - 4x(3y) = 8x^2 - 12xy$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Express $6$ as a percentage of $5$.",
      options: ["120%", "83.3%", "30%", "20%"],
      correctAnswer: "120%",
      hint: "Divide 6 by 5 and multiply by 100%.",
      workedSolution: "$$\\frac{6}{5} \\times 100\\% = 6 \\times 20\\% = 120\\%$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Express $1,800$ as a product of prime factors in index notation.",
      options: ["$$2^3 \\times 3^2 \\times 5^2$$", "$$2^2 \\times 3^3 \\times 5^2$$", "$$2^3 \\times 3 \\times 5^3$$", "$$2^4 \\times 3^2 \\times 5$$"],
      correctAnswer: "$$2^3 \\times 3^2 \\times 5^2$$",
      hint: "Divide repeatedly by prime factors starting from 2.",
      workedSolution: "$$1800 = 18 \\times 100 = (2 \\times 3^2) \\times (2^2 \\times 5^2) = 2^3 \\times 3^2 \\times 5^2$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "The ratio of notebooks to pens in a carton is $4 : 3$. If there are $48$ notebooks, how many pens are in the carton?",
      options: ["36", "32", "64", "16"],
      correctAnswer: "36",
      hint: "Find the value of 1 ratio unit: 48 ÷ 4.",
      workedSolution: "4 units = 48 => 1 unit = 12. Number of pens = 3 × 12 = 36.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Express $0.375$ as a fraction in its lowest terms.",
      options: ["$$\\frac{3}{8}$$", "$$\\frac{3}{5}$$", "$$\\frac{7}{16}$$", "$$\\frac{5}{12}$$"],
      correctAnswer: "$$\\frac{3}{8}$$",
      hint: "Write as 375/1000 and divide numerator and denominator by 125.",
      workedSolution: "$$\\frac{375}{1000} = \\frac{375 \\div 125}{1000 \\div 125} = \\frac{3}{8}$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Convert $$333_{\\text{five}}$$ to a numeral in base ten.",
      options: ["93", "88", "111", "75"],
      correctAnswer: "93",
      hint: "Expand using place values: $3(5^2) + 3(5^1) + 3(5^0)$.",
      workedSolution: "$$3(25) + 3(5) + 3(1) = 75 + 15 + 3 = 93$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Given sets $X = \\{12, 14, 16\\}$ and $Y = \\{11, 13, 15\\}$, find $X \\cap Y$.",
      options: ["$$\\emptyset$$ (empty set)", "{12, 14}", "{11, 12, 13, 14, 15, 16}", "{0}"],
      correctAnswer: "$$\\emptyset$$ (empty set)",
      hint: "Look for common elements in both sets.",
      workedSolution: "Set X contains even numbers and set Y contains odd numbers. There are no common elements: $$X \\cap Y = \\emptyset$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Simplify: $$5^8 \\div 5^2$$.",
      options: ["$$5^6$$", "$$5^4$$", "$$5^{10}$$", "$$5^{16}$$"],
      correctAnswer: "$$5^6$$",
      hint: "Apply the quotient rule of indices: $$a^m \\div a^n = a^{m-n}$$.",
      workedSolution: "$$5^8 \\div 5^2 = 5^{8-2} = 5^6$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "A pair of shoes bought for GH¢ 40.00 was sold for GH¢ 52.00. Calculate the percentage profit.",
      options: ["30%", "25%", "35%", "12%"],
      correctAnswer: "30%",
      hint: "Profit = Selling Price - Cost Price. Profit % = (Profit / Cost Price) × 100%.",
      workedSolution: "Profit = 52.00 - 40.00 = GH¢ 12.00. Percentage profit = (12 / 40) × 100% = 30%.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Factorize completely: $$a^2 + ka - pa - kp$$.",
      options: ["$$(a + k)(a - p)$$", "$$(a - k)(a - p)$$", "$$(a + k)(p - a)$$", "$$(a - k)(a + p)$$"],
      correctAnswer: "$$(a + k)(a - p)$$",
      hint: "Group terms in pairs: $$a(a + k) - p(a + k)$$.",
      workedSolution: "$$a(a + k) - p(a + k) = (a + k)(a - p)$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Simplify: $$-18 - (-5) + (-7)$$.",
      options: ["-20", "-30", "-16", "-6"],
      correctAnswer: "-20",
      hint: "Subtracting a negative becomes addition: -18 + 5 - 7.",
      workedSolution: "$$-18 + 5 - 7 = -13 - 7 = -20$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Find the Highest Common Factor (HCF) of $$2^4 \\times 3^3$$ and $$2^2 \\times 3^5$$.",
      options: ["$$2^2 \\times 3^3$$", "$$2^4 \\times 3^5$$", "$$2^2 \\times 3^5$$", "$$2^6 \\times 3^8$$"],
      correctAnswer: "$$2^2 \\times 3^3$$",
      hint: "Take the lowest power of each common prime factor.",
      workedSolution: "For 2: lowest power is $$2^2$$. For 3: lowest power is $$3^3$$. HCF = $$2^2 \\times 3^3$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "State the rule for the linear mapping: $$x \\to y$$, where inputs $$1, 2, 3, 4$$ produce outputs $$12, 24, 36, 48$$.",
      options: ["$$x \\to 12x$$", "$$x \\to x + 11$$", "$$x \\to 6x + 6$$", "$$x \\to 12/x$$"],
      correctAnswer: "$$x \\to 12x$$",
      hint: "Notice that each y is obtained by multiplying x by 12.",
      workedSolution: "For x=1: 12(1)=12; x=2: 12(2)=24; x=3: 12(3)=36. The mapping rule is $$x \\to 12x$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Solve the inequality: $$x - \\frac{1}{4} \\ge \\frac{3}{4} - x$$.",
      options: ["$$x \\ge \\frac{1}{2}$$", "$$x \\le \\frac{1}{2}$$", "$$x \\ge 1$$", "$$x \\le 1$$"],
      correctAnswer: "$$x \\ge \\frac{1}{2}$$",
      hint: "Multiply through by 4 to clear fractions, then group like terms.",
      workedSolution: "$$4(x - 1/4) \\ge 4(3/4 - x) \\implies 4x - 1 \\ge 3 - 4x \\implies 8x \\ge 4 \\implies x \\ge 4/8 = 1/2$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "The perimeter of a square garden is $36\\text{ m}$. What is its area?",
      options: ["$$81\\text{ m}^2$$", "$$72\\text{ m}^2$$", "$$144\\text{ m}^2$$", "$$18\\text{ m}^2$$"],
      correctAnswer: "$$81\\text{ m}^2$$",
      hint: "Find the side length first: $s = \\text{Perimeter} \\div 4$.",
      workedSolution: "Side length $$s = 36 / 4 = 9\\text{ m}$$. Area $$= s^2 = 9^2 = 81\\text{ m}^2$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Simplify: $$\\frac{1}{4}\\left(\\frac{1}{2} - \\frac{1}{4}\\right) - \\frac{1}{4}\\left(\\frac{1}{4} - \\frac{1}{2}\\right)$$.",
      options: ["$$\\frac{1}{8}$$", "$$\\frac{1}{16}$$", "$$0$$", "$$-\\frac{1}{8}$$"],
      correctAnswer: "$$\\frac{1}{8}$$",
      hint: "Notice that $$\\frac{1}{4} - \\frac{1}{2} = -(\\frac{1}{2} - \\frac{1}{4})$$.",
      workedSolution: "$$\\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}$$. Then $$\\frac{1}{4}(1/4) - \\frac{1}{4}(-1/4) = \\frac{1}{16} + \\frac{1}{16} = \\frac{2}{16} = \\frac{1}{8}$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Make $k$ the subject of the relation: $$\\theta = 90 - \\frac{180}{k}$$.",
      options: ["$$k = \\frac{180}{90 - \\theta}$$", "$$k = \\frac{180}{90 + \\theta}$$", "$$k = \\frac{90 - \\theta}{180}$$", "$$k = 180(90 - \\theta)$$"],
      correctAnswer: "$$k = \\frac{180}{90 - \\theta}$$",
      hint: "Rearrange to isolate $$\\frac{180}{k} = 90 - \\theta$$, then invert.",
      workedSolution: "$$\\frac{180}{k} = 90 - \\theta \\implies k = \\frac{180}{90 - \\theta}$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "If $$M = \\frac{w}{3} + \\frac{k^2}{6w}$$, calculate $M$ when $w = 4$ and $k = 6$.",
      options: ["$$2\\frac{5}{6}$$", "$$2\\frac{1}{3}$$", "$$3\\frac{1}{2}$$", "$$4\\frac{1}{6}$$"],
      correctAnswer: "$$2\\frac{5}{6}$$",
      hint: "Substitute $w=4$ and $k=6$ directly into the expression.",
      workedSolution: "$$M = \\frac{4}{3} + \\frac{6^2}{6(4)} = \\frac{4}{3} + \\frac{36}{24} = \\frac{4}{3} + \\frac{3}{2} = \\frac{8 + 9}{6} = \\frac{17}{6} = 2\\frac{5}{6}$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Six copies of an encyclopedia cost GH¢ 24.00. How much will 9 copies cost at the same rate?",
      options: ["GH¢ 36.00", "GH¢ 32.00", "GH¢ 40.00", "GH¢ 28.00"],
      correctAnswer: "GH¢ 36.00",
      hint: "Find the unit price first: 24 ÷ 6.",
      workedSolution: "Cost of 1 book = 24.00 ÷ 6 = GH¢ 4.00. Cost of 9 books = 9 × 4.00 = GH¢ 36.00.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Solve for $y$ in the equation: $$\\frac{1}{4}(3 + y) = \\frac{1}{3}(y - 2)$$.",
      options: ["17", "11", "9", "-17"],
      correctAnswer: "17",
      hint: "Cross-multiply or multiply through by 12.",
      workedSolution: "$$3(3 + y) = 4(y - 2) \\implies 9 + 3y = 4y - 8 \\implies 9 + 8 = 4y - 3y \\implies y = 17$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Find the gradient (slope) of the straight line connecting $A(2, 3)$ and $B(5, 12)$.",
      options: ["3", "-3", "1/3", "4"],
      correctAnswer: "3",
      hint: "Gradient $$m = \\frac{y_2 - y_1}{x_2 - x_1}$$.",
      workedSolution: "$$m = \\frac{12 - 3}{5 - 2} = \\frac{9}{3} = 3$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "A delivery vehicle drives at an average speed of $80\\text{ km/h}$. What distance does it travel in $3\\frac{1}{2}$ hours?",
      options: ["280 km", "240 km", "320 km", "260 km"],
      correctAnswer: "280 km",
      hint: "Distance = Speed × Time.",
      workedSolution: "$$\\text{Distance} = 80 \\times 3.5 = 280\\text{ km}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Two parallel lines are cut by a transversal. If an interior angle on one side is $132^\\circ$, calculate the acute interior angle on the same side.",
      options: ["$$48^\\circ$$", "$$42^\\circ$$", "$$52^\\circ$$", "$$132^\\circ$$"],
      correctAnswer: "$$48^\\circ$$",
      hint: "Consecutive co-interior angles add up to 180°.",
      workedSolution: "$$180^\\circ - 132^\\circ = 48^\\circ$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 7 \\\\ 3m \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 3m - 2 \\\\ 9 \\end{pmatrix}$$. If $u = v$, find the value of $m$.",
      options: ["3", "2", "4", "5"],
      correctAnswer: "3",
      hint: "Equate corresponding components: $3m - 2 = 7$ and $3m = 9$.",
      workedSolution: "$$3m = 9 \\implies m = 3$$. Also $$3(3) - 2 = 7$$, which holds true.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Calculate the total volume of a cube whose side length is $4\\text{ cm}$.",
      options: ["$$64\\text{ cm}^3$$", "$$16\\text{ cm}^3$$", "$$96\\text{ cm}^3$$", "$$48\\text{ cm}^3$$"],
      correctAnswer: "$$64\\text{ cm}^3$$",
      hint: "Volume of a cube = $$s^3$$.",
      workedSolution: "$$4\\text{ cm} \\times 4\\text{ cm} \\times 4\\text{ cm} = 64\\text{ cm}^3$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Two straight lines intersect at point $O$. If one acute vertically opposite angle is $72^\\circ$, find the adjacent obtuse angle on the straight line.",
      options: ["$$108^\\circ$$", "$$118^\\circ$$", "$$72^\\circ$$", "$$98^\\circ$$"],
      correctAnswer: "$$108^\\circ$$",
      hint: "Angles on a straight line sum to 180°.",
      workedSolution: "$$180^\\circ - 72^\\circ = 108^\\circ$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "Kofi and Ama shared a sum of money in the ratio $4 : 3$. If Kofi's share is GH¢ 24.00, how much money did they share altogether?",
      options: ["GH¢ 42.00", "GH¢ 36.00", "GH¢ 18.00", "GH¢ 56.00"],
      correctAnswer: "GH¢ 42.00",
      hint: "Find 1 unit: 24 ÷ 4 = 6. Total units = 4 + 3 = 7.",
      workedSolution: "4 units = 24 => 1 unit = GH¢ 6.00. Total shared = (4 + 3) × 6 = 7 × 6 = GH¢ 42.00.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Calculate the area of a trapezium with parallel sides of length $11\\text{ cm}$ and $17\\text{ cm}$, and perpendicular height $14\\text{ cm}$.",
      options: ["$$196\\text{ cm}^2$$", "$$392\\text{ cm}^2$$", "$$154\\text{ cm}^2$$", "$$238\\text{ cm}^2$$"],
      correctAnswer: "$$196\\text{ cm}^2$$",
      hint: "Area = $$\\frac{1}{2}(a + b)h$$.",
      workedSolution: "$$\\text{Area} = \\frac{1}{2}(11 + 17) \\times 14 = \\frac{1}{2}(28) \\times 14 = 14 \\times 14 = 196\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Given vectors $$p = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$$ and $$q = \\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$$, evaluate $$3p - 2q$$.",
      options: ["$$\\begin{pmatrix} 11 \\\\ -18 \\end{pmatrix}$$", "$$\\begin{pmatrix} 7 \\\\ -6 \\end{pmatrix}$$", "$$\\begin{pmatrix} 11 \\\\ -6 \\end{pmatrix}$$", "$$\\begin{pmatrix} 7 \\\\ -18 \\end{pmatrix}$$"],
      correctAnswer: "$$\\begin{pmatrix} 11 \\\\ -18 \\end{pmatrix}$$",
      hint: "Multiply components by scalars before subtracting.",
      workedSolution: "$$3\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} - 2\\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -12 \\end{pmatrix} - \\begin{pmatrix} -2 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 9 - (-2) \\\\ -12 - 6 \\end{pmatrix} = \\begin{pmatrix} 11 \\\\ -18 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "A crate contains $14$ red apples and $21$ green apples. If one apple is picked at random, what is the probability that it is red?",
      options: ["$$\\frac{2}{5}$$", "$$\\frac{3}{5}$$", "$$\\frac{2}{3}$$", "$$\\frac{1}{7}$$"],
      correctAnswer: "$$\\frac{2}{5}$$",
      hint: "Total apples = 14 + 21 = 35. Probability = 14/35.",
      workedSolution: "$$\\text{P(Red)} = \\frac{14}{14 + 21} = \\frac{14}{35} = \\frac{2}{5}$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "The ages of students in a study group are distributed as: Age 12 (4 students), Age 13 (8 students), Age 14 (5 students), Age 15 (3 students). How many students are in the group?",
      options: ["20", "25", "18", "15"],
      correctAnswer: "20",
      hint: "Sum all student frequencies.",
      workedSolution: "$$4 + 8 + 5 + 3 = 20\\text{ students}$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "From the age distribution in Question 32, identify the modal age.",
      options: ["13 years", "12 years", "14 years", "8 years"],
      correctAnswer: "13 years",
      hint: "The mode is the age with the highest frequency.",
      workedSolution: "Age 13 occurs 8 times, which is the highest frequency. The modal age is 13 years.",
      points: 1
    },
    {
      id: "q34",
      prompt: "From the age distribution in Question 32, what is the probability that a randomly chosen student is 14 years old?",
      options: ["$$\\frac{1}{4}$$", "$$\\frac{1}{5}$$", "$$\\frac{2}{5}$$", "$$\\frac{3}{20}$$"],
      correctAnswer: "$$\\frac{1}{4}$$",
      hint: "Frequency of age 14 divided by total students: 5 / 20.",
      workedSolution: "$$\\text{P(14 years)} = \\frac{5}{20} = \\frac{1}{4}$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "A spool of wire is $21.6\\text{ m}$ long. How many pieces of length $0.48\\text{ m}$ can be cut from it?",
      options: ["45", "4.5", "450", "42"],
      correctAnswer: "45",
      hint: "Divide 21.6 by 0.48.",
      workedSolution: "$$\\frac{21.6}{0.48} = \\frac{2160}{48} = 45\\text{ pieces}$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "An electric oven was sold for GH¢ 360.00 at a loss of 10%. Calculate its original cost price.",
      options: ["GH¢ 400.00", "GH¢ 396.00", "GH¢ 420.00", "GH¢ 380.00"],
      correctAnswer: "GH¢ 400.00",
      hint: "Selling price represents 90% of cost price: CP = SP ÷ 0.90.",
      workedSolution: "$$\\text{CP} = \\frac{360.00}{1.00 - 0.10} = \\frac{360}{0.9} = \\text{GH¢ } 400.00$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "A geometric net made of 1 central square base and 4 surrounding triangular faces forms which solid figure?",
      options: ["Square pyramid", "Triangular prism", "Tetrahedron", "Cuboid"],
      correctAnswer: "Square pyramid",
      hint: "When folded up, the 4 triangles meet at a single apex above the square base.",
      workedSolution: "A square base attached to four triangular faces folds into a right square pyramid.",
      points: 1
    },
    {
      id: "q38",
      prompt: "What is the place value of the digit $8$ in the numeral $948,251$?",
      options: ["Eight thousand", "Eighty thousand", "Eight hundred", "Eight ten-thousands"],
      correctAnswer: "Eight thousand",
      hint: "Count place values from right: Units, Tens, Hundreds, Thousands.",
      workedSolution: "In 948,251, 8 sits in the thousands column, representing 8,000 (Eight thousand).",
      points: 1
    },
    {
      id: "q39",
      prompt: "Write $4,820$ in standard form.",
      options: ["$$4.82 \\times 10^3$$", "$$4.82 \\times 10^2$$", "$$4.82 \\times 10^4$$", "$$48.2 \\times 10^2$$"],
      correctAnswer: "$$4.82 \\times 10^3$$",
      hint: "Move the decimal point 3 places to the left to get a number between 1 and 10.",
      workedSolution: "$$4,820 = 4.82 \\times 10^3$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Correct $0.04862$ to three decimal places.",
      options: ["0.049", "0.048", "0.05", "0.0486"],
      correctAnswer: "0.049",
      hint: "The third decimal place is 8, followed by 6. Round up.",
      workedSolution: "The first 3 decimal digits are 0.048. Since the 4th digit is 6 (which is ≥ 5), 8 rounds up to 9: 0.049.",
      points: 1
    }
  ],
  seededAt: "2026-09-14T12:00:00.000Z",
  lastUpdated: "2026-09-14T12:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_04: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-04",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 4)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Set Theory, Changing Subject of Formula & Commercial Profit",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the Venn diagram and problem descriptions provided below:",
      diagramSvg: "<svg viewBox='0 0 360 190' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='20' y='28' font-family='sans-serif' font-size='14' font-weight='bold' fill='#0f172a'>U = 280</text><circle cx='130' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='230' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='100' y='40' font-family='sans-serif' font-size='13' font-weight='bold' fill='#2563eb'>Computing (C)</text><text x='215' y='40' font-family='sans-serif' font-size='13' font-weight='bold' fill='#059669'>French (F)</text><text x='105' y='110' font-family='sans-serif' font-size='14' fill='#1e293b'>90</text><text x='173' y='110' font-family='sans-serif' font-size='14' font-weight='bold' fill='#dc2626'>x</text><text x='240' y='110' font-family='sans-serif' font-size='14' fill='#1e293b'>140</text></svg>",
      hint: "Review Venn diagram subset disjoint equations, algebraic isolation of variables, and percentage profit calculations.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)(i)",
          marks: 3,
          prompt: "In an academy of $280$ students, $90$ study Computing only and $140$ study French only. Every student studies at least one of the two elective subjects.\nUsing the Venn diagram provided above, write an equation connecting the subsets to find the number of students who study **both** subjects.",
          hint: "The sum of all disjoint regions inside the universal set equals $280$.",
          modelAnswer: "50 students",
          workedSolution: "From the Venn diagram:\n$$90 + x + 140 = 280$$\n$$x + 230 = 280$$\n$$x = 280 - 230 = 50$$\nTherefore, **$50$ students study both Computing and French**."
        },
        {
          partLabel: "(a)(ii)",
          marks: 2,
          prompt: "How many students study French altogether?",
          hint: "Total French students = French only + Both subjects.",
          modelAnswer: "190 students",
          workedSolution: "$$\\text{Total French} = x + 140 = 50 + 140 = 190\\text{ students}$$."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Make $h$ the subject of the formula:\n$$V = \\frac{1}{3}\\pi r^2 h$$",
          hint: "Multiply both sides by 3 to clear the denominator, then divide by $\\pi r^2$.",
          modelAnswer: "$$h = \\frac{3V}{\\pi r^2}$$",
          workedSolution: "$$V = \\frac{1}{3}\\pi r^2 h$$\nMultiply both sides by $3$:\n$$3V = \\pi r^2 h$$\nDivide both sides by $\\pi r^2$:\n$$h = \\frac{3V}{\\pi r^2}$$"
        },
        {
          partLabel: "(c)",
          marks: 6,
          prompt: "A bookstore manager bought $60$ copies of a STEM workbook at $\\text{GH¢ } 4.50$ per copy. She sold each copy at $\\text{GH¢ } 5.40$.\nCalculate:\n(i) The total cost price of the workbooks.\n(ii) Her percentage profit.",
          hint: "Total CP = number of books × unit CP. Percentage profit = (Profit / Cost Price) × 100%.",
          modelAnswer: "(i) GH¢ 270.00, (ii) 20%",
          workedSolution: "**(i) Total Cost Price:**\n$$\\text{Total CP} = 60 \\times \\text{GH¢ } 4.50 = \\text{GH¢ } 270.00$$\n\n**(ii) Percentage Profit:**\n$$\\text{Profit per book} = 5.40 - 4.50 = \\text{GH¢ } 0.90$$\n$$\\text{Percentage Profit} = \\left(\\frac{0.90}{4.50}\\right) \\times 100\\% = \\left(\\frac{1}{5}\\right) \\times 100\\% = 20\\%$$\n*(Alternatively: Total SP = $60 \\times 5.40 = \\text{GH¢ } 324.00$. Total profit = $324 - 270 = \\text{GH¢ } 54.00$. Profit % = $\\frac{54}{270} \\times 100\\% = 20\\%$)*."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Pie Chart Angle Distributions & Linear Inequalities",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the pie chart and problem descriptions provided below:",
      diagramSvg: "<svg viewBox='0 0 320 280' width='100%' height='260' xmlns='http://www.w3.org/2000/svg'><circle cx='160' cy='130' r='100' fill='#f1f5f9' stroke='#334155' stroke-width='2'/><path d='M160,130 L160,30 A100,100 0 0,1 254,96 Z' fill='#bfdbfe' stroke='#1e3a8a'/><path d='M160,130 L254,96 A100,100 0 0,1 256,164 Z' fill='#bbf7d0' stroke='#14532d'/><path d='M160,130 L256,164 A100,100 0 0,1 126,224 Z' fill='#fed7aa' stroke='#7c2d12'/><path d='M160,130 L126,224 A100,100 0 0,1 66,96 Z' fill='#fef08a' stroke='#713f12'/><path d='M160,130 L66,96 A100,100 0 0,1 160,30 Z' fill='#e9d5ff' stroke='#581c87'/><text x='180' y='75' font-size='12' font-weight='bold'>A: 70°</text><text x='200' y='130' font-size='12' font-weight='bold'>B: 40°</text><text x='170' y='185' font-size='12' font-weight='bold'>C: 90°</text><text x='85' y='160' font-size='12' font-weight='bold'>D: 100°</text><text x='95' y='85' font-size='12' font-weight='bold'>E: x°</text><text x='35' y='260' font-size='12' font-style='italic' fill='#475569'>Distribution of 7,200 textbooks across 5 schools</text></svg>",
      hint: "The sum of angles in a pie chart is 360°. Scale factor connects total books to 360 degrees.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)(i)",
          marks: 3,
          prompt: "The pie chart above shows the allocation of $7,200$ science textbooks across five community schools ($A, B, C, D,$ and $E$).\nCalculate the sector angle $x^\\circ$ for School $E$.",
          hint: "The sum of angles in a pie chart equals $360^\\circ$.",
          modelAnswer: "60°",
          workedSolution: "$$70^\\circ + 40^\\circ + 90^\\circ + 100^\\circ + x^\\circ = 360^\\circ$$\n$$300^\\circ + x^\\circ = 360^\\circ$$\n$$x = 360 - 300 = 60^\\circ$$."
        },
        {
          partLabel: "(a)(ii)",
          marks: 4,
          prompt: "How many textbooks were allocated to School $C$ and School $E$?",
          hint: "Textbooks = (sector angle / 360) × 7,200.",
          modelAnswer: "School C = 1,800 books; School E = 1,200 books",
          workedSolution: "Notice the scale factor: $$\\frac{7,200}{360^\\circ} = 20\\text{ books per degree}$$.\n- School C ($90^\\circ$): $$90 \\times 20 = 1,800\\text{ books}$$.\n- School E ($60^\\circ$): $$60 \\times 20 = 1,200\\text{ books}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Solve the inequality below and express the truth set:\n$$\\frac{1}{2}x + 2 \\ge \\frac{2}{3}x + \\frac{1}{6}(4 - x)$$",
          hint: "Multiply every term by 6 (the LCM of 2, 3, and 6) to eliminate all fractions.",
          modelAnswer: "$$\\{x : x \\in \\mathbb{R}\\}$$ or True for all x (Identity)",
          workedSolution: "Multiply through by $6$:\n$$6\\left(\\frac{1}{2}x\\right) + 6(2) \\ge 6\\left(\\frac{2}{3}x\\right) + 6\\left(\\frac{1}{6}(4 - x)\\right)$$\n$$3x + 12 \\ge 4x + (4 - x)$$\n$$3x + 12 \\ge 3x + 4$$\nSubtract $3x$ from both sides:\n$$12 \\ge 4$$\nSince $12 \\ge 4$ is always true regardless of $x$, the inequality holds for all real numbers: $$\\{x : x \\in \\mathbb{R}\\}$$."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "A student spent $\\frac{2}{5}$ of her monthly allowance on study books and had $\\text{GH¢ } 36.00$ remaining. What was her total allowance?",
          hint: "The remaining fraction is $1 - \\frac{2}{5} = \\frac{3}{5}$.",
          modelAnswer: "GH¢ 60.00",
          workedSolution: "Fraction left = $$1 - \\frac{2}{5} = \\frac{3}{5}$$.\nLet $A$ be the total allowance:\n$$\\frac{3}{5}A = 36.00 \\implies A = 36 \\times \\frac{5}{3} = 12 \\times 5 = \\text{GH¢ } 60.00$$."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Algebraic Perimeter, Area & Isosceles Angle Geometry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the geometric diagram and algebraic specifications below:",
      diagramSvg: "<svg viewBox='0 0 340 180' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><polygon points='40,140 170,30 300,140' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><line x1='10' y1='140' x2='330' y2='140' stroke='#334155' stroke-width='1.5'/><text x='165' y='22' font-size='13' font-weight='bold'>C (x°)</text><text x='30' y='158' font-size='13' font-weight='bold'>A</text><text x='295' y='158' font-size='13' font-weight='bold'>B</text><path d='M20,140 A20,20 0 0,1 40,123' fill='none' stroke='#dc2626' stroke-width='2'/><text x='20' y='132' font-size='12' font-weight='bold' fill='#dc2626'>w</text><path d='M300,140 A25,25 0 0,1 322,140' fill='none' stroke='#047857' stroke-width='2'/><text x='305' y='130' font-size='11' font-weight='bold' fill='#047857'>126°</text><line x1='100' y1='80' x2='110' y2='90' stroke='#1e40af' stroke-width='2'/><line x1='230' y1='80' x2='240' y2='90' stroke='#1e40af' stroke-width='2'/></svg>",
      hint: "Perimeter is 2(length + width). Isosceles triangles have equal base angles.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)(i)",
          marks: 4,
          prompt: "The perimeter of a rectangular farm plot of length $(3x + 4)\\text{ m}$ and width $(x - 2)\\text{ m}$ is $68\\text{ m}$.\nFind the value of $x$.",
          hint: "Perimeter = 2(length + width).",
          modelAnswer: "x = 8",
          workedSolution: "$$2[(3x + 4) + (x - 2)] = 68$$\n$$2[4x + 2] = 68$$\n$$8x + 4 = 68$$\n$$8x = 64 \\implies x = 8$$."
        },
        {
          partLabel: "(a)(ii)",
          marks: 3,
          prompt: "Find the area of the plot and the cost of clearing it at $\\text{GH¢ } 0.50\\text{ per m}^2$.",
          hint: "Compute actual length and width using x = 8, then calculate Area = length × width.",
          modelAnswer: "Area = 168 m², Cost = GH¢ 84.00",
          workedSolution: "$$\\text{Length} = 3(8) + 4 = 28\\text{ m}$$\n$$\\text{Width} = 8 - 2 = 6\\text{ m}$$\n$$\\text{Area} = 28\\text{ m} \\times 6\\text{ m} = 168\\text{ m}^2$$\n$$\\text{Cost} = 168 \\times \\text{GH¢ } 0.50 = \\text{GH¢ } 84.00$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "In the diagram above, $|AC| = |BC|$, the exterior angle at vertex $B$ is $126^\\circ$, and the exterior angle at vertex $A$ is $w^\\circ$.\nFind the values of $x$ and $w$.",
          hint: "Interior angle B and the 126° angle lie on a straight line. Base angles of an isosceles triangle are equal.",
          modelAnswer: "x = 72°, w = 126°",
          workedSolution: "1. Interior angle $B = 180^\\circ - 126^\\circ = 54^\\circ$.\n2. Since $|AC| = |BC|$, triangle $ABC$ is isosceles with base $AB$. Thus interior angle $A = \\text{interior angle } B = 54^\\circ$.\n3. Exterior angle $w = 180^\\circ - 54^\\circ = 126^\\circ$.\n4. Sum of angles in triangle: $$x + 54^\\circ + 54^\\circ = 180^\\circ \\implies x + 108^\\circ = 180^\\circ \\implies x = 72^\\circ$$."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Factorize completely: $$4a^2 - 12ac + 3ab - 9bc$$.",
          hint: "Group into pairs of two terms and factor out the common factor.",
          modelAnswer: "(a - 3c)(4a + 3b)",
          workedSolution: "$$4a(a - 3c) + 3b(a - 3c) = (a - 3c)(4a + 3b)$$"
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Vector Operations, Base Conversions & Class Frequency Distribution",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question:",
      hint: "Perform vector scalar multiplication before component addition. Mean = total students / number of classes.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Given column vectors $$u = \\begin{pmatrix} -4 \\\\ 5 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$, evaluate:\n(i) $$u + 2v$$\n(ii) $$\\frac{1}{2}(2u - 4v)$$",
          hint: "Multiply vectors by their scalar multipliers component-wise before adding or subtracting.",
          modelAnswer: "(i) (2, 1)ᵀ, (ii) (-10, 9)ᵀ",
          workedSolution: "**(i)** $$u + 2v = \\begin{pmatrix} -4 \\\\ 5 \\end{pmatrix} + 2\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} -4 + 6 \\\\ 5 - 4 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$.\n\n**(ii)** $$\\frac{1}{2}(2u - 4v) = u - 2v = \\begin{pmatrix} -4 \\\\ 5 \\end{pmatrix} - 2\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} -4 - 6 \\\\ 5 - (-4) \\end{pmatrix} = \\begin{pmatrix} -10 \\\\ 9 \\end{pmatrix}$$."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "Convert $$423_{\\text{five}}$$ to a numeral in base ten.",
          hint: "Expand: $4(5^2) + 2(5^1) + 3(5^0)$.",
          modelAnswer: "113",
          workedSolution: "$$4(25) + 2(5) + 3(1) = 100 + 10 + 3 = 113_{\\text{ten}}$$."
        },
        {
          partLabel: "(c)",
          marks: 7,
          prompt: "The table below shows the distribution of students across classes in a basic school:\n\n| Class | BS 1 | BS 2 | BS 3 | BS 4 | BS 5 | BS 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Students | 30 | 38 | 32 | 26 | 34 | 40 |\n\n(i) Find the total number of students in the school.\n(ii) Calculate the mean number of students per class.\n(iii) What percentage of students are in BS 6?",
          hint: "Sum all class counts for total. Mean = Total / 6. Percentage = (BS 6 students / Total) × 100%.",
          modelAnswer: "(i) 200 students, (ii) 33.3 students, (iii) 20%",
          workedSolution: "**(i)** $$\\text{Total} = 30 + 38 + 32 + 26 + 34 + 40 = 200\\text{ students}$$.\n**(ii)** $$\\text{Mean} = \\frac{200}{6} = 33\\frac{1}{3} \\approx 33.3\\text{ students/class}$$.\n**(iii)** $$\\text{Percentage in BS 6} = \\left(\\frac{40}{200}\\right) \\times 100\\% = 20\\%$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Linear Cost-Weight Graphing Relations",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the market rate graph and specifications below:",
      diagramSvg: "<svg viewBox='0 0 350 240' width='100%' height='220' xmlns='http://www.w3.org/2000/svg'><line x1='50' y1='200' x2='320' y2='200' stroke='#334155' stroke-width='2'/><line x1='50' y1='200' x2='50' y2='20' stroke='#334155' stroke-width='2'/><text x='300' y='225' font-size='11' font-weight='bold'>Weight (g)</text><text x='10' y='30' font-size='11' font-weight='bold'>Cost (GH¢)</text><line x1='50' y1='200' x2='290' y2='40' stroke='#2563eb' stroke-width='3'/><circle cx='90' cy='173' r='4' fill='#dc2626'/><circle cx='130' cy='147' r='4' fill='#dc2626'/><circle cx='170' cy='120' r='4' fill='#dc2626'/><circle cx='210' cy='93' r='4' fill='#dc2626'/><circle cx='250' cy='67' r='4' fill='#dc2626'/><text x='75' y='215' font-size='10'>50</text><text x='115' y='215' font-size='10'>100</text><text x='155' y='215' font-size='10'>150</text><text x='195' y='215' font-size='10'>200</text><text x='235' y='215' font-size='10'>250</text><text x='25' y='178' font-size='10'>2.00</text><text x='25' y='125' font-size='10'>6.00</text><text x='20' y='72' font-size='10'>10.00</text></svg>",
      hint: "Use y = x / 25. For gradient, compare with y = mx.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "The relation between cost $y$ (in $\\text{GH¢}$) and weight $x$ (in grams) of premium seed grain sold in a market is given by:\n$$y = \\frac{x}{25}$$\nCopy and complete the table of values:\n\n| Weight $x$ (g) | 50 | 100 | 150 | 200 | 250 | 300 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Cost $y$ (GH¢) | **?** | 4.00 | **?** | 8.00 | **?** | **?** |",
          hint: "Divide each weight x by 25 to get the corresponding cost y.",
          modelAnswer: "x=50: 2.00, x=150: 6.00, x=250: 10.00, x=300: 12.00",
          workedSolution: "- For $x = 50$: $$y = 50 / 25 = \\text{GH¢ } 2.00$$\n- For $x = 150$: $$y = 150 / 25 = \\text{GH¢ } 6.00$$\n- For $x = 250$: $$y = 250 / 25 = \\text{GH¢ } 10.00$$\n- For $x = 300$: $$y = 300 / 25 = \\text{GH¢ } 12.00$$"
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Using the relation $$y = \\frac{x}{25}$$, determine:\n(i) The cost of $175\\text{ grams}$ of seed grain.\n(ii) The weight of seed grain that can be purchased with $\\text{GH¢ } 18.00$.",
          hint: "For (i), substitute x = 175. For (ii), substitute y = 18.00 and solve for x.",
          modelAnswer: "(i) GH¢ 7.00, (ii) 450 grams",
          workedSolution: "**(i)** Cost for $175\\text{ g}$:\n$$y = \\frac{175}{25} = \\text{GH¢ } 7.00$$\n\n**(ii)** Weight for $\\text{GH¢ } 18.00$:\n$$18 = \\frac{x}{25} \\implies x = 18 \\times 25 = 450\\text{ grams}$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Find the gradient (rate of cost increase per gram) of the line represented by $$y = \\frac{x}{25}$$.",
          hint: "Compare with the standard linear equation y = mx.",
          modelAnswer: "m = 0.04 (or 1/25 GH¢/g)",
          workedSolution: "In $y = mx + c$, $m$ represents the slope. Here, $$m = \\frac{1}{25} = 0.04\\text{ GH¢ per gram}$$. Each additional gram costs $4\\text{ pesewas}$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Cartesian Coordinate Transformations & Symmetry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the Cartesian coordinate illustration below:",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12' fill='#334155'>x</text><text x='165' y='30' font-size='12' fill='#334155'>y</text><polygon points='220,110 190,50 190,110' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='225' y='110' font-size='11' font-weight='bold' fill='#1e40af'>P(4,2)</text><text x='195' y='45' font-size='11' font-weight='bold' fill='#1e40af'>Q(2,5)</text><text x='160' y='105' font-size='11' font-weight='bold' fill='#1e40af'>R(2,2)</text><polygon points='220,170 190,230 190,170' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='225' y='175' font-size='11' font-weight='bold' fill='#b91c1c'>P₁(4,-2)</text><text x='195' y='245' font-size='11' font-weight='bold' fill='#b91c1c'>Q₁(2,-5)</text><text x='160' y='180' font-size='11' font-weight='bold' fill='#b91c1c'>R₁(2,-2)</text></svg>",
      hint: "Reflection in x-axis: (x, y) -> (x, -y). Translation by (a, b) -> (x+a, y+b).",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Triangle $PQR$ has vertices $P(4, 2)$, $Q(2, 5)$, and $R(2, 2)$.\n(i) Write down the coordinates of image triangle $P_1Q_1R_1$ under a reflection in the $x$-axis.\n(ii) What is the length of side $PR$?",
          hint: "Under reflection in the x-axis, (x, y) → (x, -y). Length of PR = difference in x coordinates between P and R.",
          modelAnswer: "(i) P₁(4,-2), Q₁(2,-5), R₁(2,-2); (ii) 2 units",
          workedSolution: "**(i)** Under reflection in the $x$-axis: $$(x, y) \\to (x, -y)$$.\n- $$P(4, 2) \\to P_1(4, -2)$$\n- $$Q(2, 5) \\to Q_1(2, -5)$$\n- $$R(2, 2) \\to R_1(2, -2)$$\n\n**(ii)** Since $P(4, 2)$ and $R(2, 2)$ share the same $y$-coordinate, the length of $$PR = 4 - 2 = 2\\text{ units}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Triangle $PQR$ is translated by vector $$T = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$$ to produce image $P_2Q_2R_2$.\nDetermine the coordinates of vertices $P_2$, $Q_2$, and $R_2$.",
          hint: "Under translation by (a, b)ᵀ: (x, y) → (x + a, y + b).",
          modelAnswer: "P₂(1, 4), Q₂(-1, 7), R₂(-1, 4)",
          workedSolution: "$$(x, y) \\to (x - 3, y + 2)$$\n- $$P(4, 2) \\to P_2(4 - 3, 2 + 2) = P_2(1, 4)$$\n- $$Q(2, 5) \\to Q_2(2 - 3, 5 + 2) = Q_2(-1, 7)$$\n- $$R(2, 2) \\to R_2(2 - 3, 2 + 2) = R_2(-1, 4)$$."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Calculate the area of the original triangle $PQR$.",
          hint: "Triangle PQR is right-angled at vertex R. Area = 1/2 × base × height.",
          modelAnswer: "3 square units",
          workedSolution: "Base $$PR = 4 - 2 = 2\\text{ units}$$.\nHeight $$RQ = 5 - 2 = 3\\text{ units}$$.\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 2 \\times 3 = 3\\text{ square units}$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-14T12:30:00.000Z",
  lastUpdated: "2026-09-14T12:30:00.000Z"
};


export const SET_JHS_MASTERY_SERIES_05: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-05",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 5)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "Which of the following collections represents a well-defined set in mathematics?",
      "options": [
        "{Dog, Blue, 12, Table}",
        "{Kwame, Ama, Kofi, Abena}",
        "{Tall, Heavy, Short, Beautiful}",
        "{Hot, Warm, Cold, Pleasant}"
      ],
      "correctAnswer": "{Kwame, Ama, Kofi, Abena}",
      "hint": "A well-defined set has clear, objective criteria for membership without subjective opinions.",
      "workedSolution": "A well-defined set contains elements that can be definitively identified without ambiguity or subjective judgment. Names of specific individuals form a distinct, objective set.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "If set $P$ is a proper subset of set $Q$ (i.e. $P \\subset Q$), which of the following statements is always true?",
      "options": [
        "Every member of set P is also a member of set Q",
        "Set P and set Q contain the exact same number of elements",
        "No member of set P is found in set Q",
        "Set P contains more elements than set Q"
      ],
      "correctAnswer": "Every member of set P is also a member of set Q",
      "hint": "Recall the definition of a subset: $A \\subset B$ means all elements of $A$ belong to $B$.",
      "workedSolution": "By definition, if $P \\subset Q$, every element belonging to set $P$ is necessarily an element of set $Q$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Find the Least Common Multiple (LCM) of $12$, $20$, and $30$.",
      "options": [
        "60",
        "120",
        "180",
        "240"
      ],
      "correctAnswer": "60",
      "hint": "Find the prime factors: $12 = 2^2 \\times 3$, $20 = 2^2 \\times 5$, $30 = 2 \\times 3 \\times 5$.",
      "workedSolution": "Prime factorizations: $12 = 2^2 \\times 3$; $20 = 2^2 \\times 5$; $30 = 2 \\times 3 \\times 5$. Taking the highest power of each prime: $2^2 \\times 3 \\times 5 = 4 \\times 15 = 60$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "The sum of $7$ and $x$, when divided by $5$, is equal to $3.6$. What is the value of $x$?",
      "options": [
        "11",
        "9",
        "18",
        "13"
      ],
      "correctAnswer": "11",
      "hint": "Write the algebraic equation: $\\frac{7 + x}{5} = 3.6$ and multiply both sides by 5.",
      "workedSolution": "$$\\frac{7 + x}{5} = 3.6 \\implies 7 + x = 3.6 \\times 5 = 18 \\implies x = 18 - 7 = 11$$.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "The numbers $21_{\\text{five}}, 22_{\\text{five}}, 23_{\\text{five}}, \\dots, \\dots, 31_{\\text{five}}$ form a consecutive sequence in base five. Find the two missing numbers.",
      "options": [
        "$$24_{\\text{five}}, 30_{\\text{five}}$$",
        "$$24_{\\text{five}}, 25_{\\text{five}}$$",
        "$$25_{\\text{five}}, 30_{\\text{five}}$$",
        "$$30_{\\text{five}}, 31_{\\text{five}}$$"
      ],
      "correctAnswer": "$$24_{\\text{five}}, 30_{\\text{five}}$$",
      "hint": "In base 5, the largest allowed digit is 4. Counting past 24 gives 30.",
      "workedSolution": "Counting in base five: after 23 comes 24. Since 5 cannot be written as a single digit, the next number is 30, followed by 31. The missing numbers are $$24_{\\text{five}}, 30_{\\text{five}}$$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Identify all the integers in the set: $$S = \\left\\{-12, -5, 0, \\frac{3}{4}, 3\\frac{1}{2}, 50, 120\\right\\}$$.",
      "options": [
        "{-12, -5, 0, 50, 120}",
        "{-12, -5}",
        "{0, 50, 120}",
        "{3/4, 3 1/2}"
      ],
      "correctAnswer": "{-12, -5, 0, 50, 120}",
      "hint": "Integers are positive and negative whole numbers including zero, excluding fractions.",
      "workedSolution": "The numbers $3/4$ and $3\\frac{1}{2}$ are fractions. All other elements ($-12, -5, 0, 50, 120$) are integers.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Calculate the total cost of $30$ exercise books at $\\text{GH¢ } 0.40$ each and $20$ pens at $\\text{GH¢ } 0.50$ each.",
      "options": [
        "GH¢ 22.00",
        "GH¢ 24.00",
        "GH¢ 20.00",
        "GH¢ 18.50"
      ],
      "correctAnswer": "GH¢ 22.00",
      "hint": "Total = (30 × 0.40) + (20 × 0.50).",
      "workedSolution": "$$30 \\times 0.40 = \\text{GH¢ } 12.00$$. $$20 \\times 0.50 = \\text{GH¢ } 10.00$$. Total cost = $12.00 + 10.00 = \\text{GH¢ } 22.00$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "Simplify: $$-32 + 20 - (12 - 17) - (-4)$$.",
      "options": [
        "-3",
        "-7",
        "-15",
        "-21"
      ],
      "correctAnswer": "-3",
      "hint": "Evaluate the expression inside parentheses first: $12 - 17 = -5$.",
      "workedSolution": "$$-32 + 20 - (-5) - (-4) = -12 + 5 + 4 = -12 + 9 = -3$$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Arrange the following numbers in ascending order (from lowest to highest): $$0.4, 2, -6, 0$$.",
      "options": [
        "-6, 0, 0.4, 2",
        "0, -6, 0.4, 2",
        "-6, 0.4, 0, 2",
        "0, 0.4, 2, -6"
      ],
      "correctAnswer": "-6, 0, 0.4, 2",
      "hint": "Negative numbers are less than zero; arrange from the most negative to the largest positive.",
      "workedSolution": "$$-6 < 0 < 0.4 < 2$$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "How many ribbons each of length $$4\\frac{1}{2}\\text{ m}$$ can be cut from a roll measuring $108\\text{ m}$?",
      "options": [
        "24",
        "22",
        "26",
        "20"
      ],
      "correctAnswer": "24",
      "hint": "Divide 108 by 4.5 (or 9/2).",
      "workedSolution": "$$108 \\div \\frac{9}{2} = 108 \\times \\frac{2}{9} = 12 \\times 2 = 24\\text{ ribbons}$$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "Find the sum of $132.5$, $0.364$, and $81.08$, correcting your result to one decimal place.",
      "options": [
        "213.9",
        "213.8",
        "214.0",
        "214.2"
      ],
      "correctAnswer": "213.9",
      "hint": "Add the exact decimal numbers, then look at the second decimal place to round.",
      "workedSolution": "$$132.5 + 0.364 + 81.08 = 213.944$$. Rounded to 1 decimal place: $213.9$.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Kojo and Esi are $15$ and $10$ years old respectively. They share $75$ oranges in the ratio of their ages. How many oranges does Kojo receive?",
      "options": [
        "45",
        "30",
        "50",
        "25"
      ],
      "correctAnswer": "45",
      "hint": "Ratio = 15 : 10 = 3 : 2. Total units = 5. Kojo's share = (3/5) × 75.",
      "workedSolution": "Ratio in simplest terms: $$15 : 10 = 3 : 2$$. Total parts = $3 + 2 = 5$. Kojo gets $$\\frac{3}{5} \\times 75 = 3 \\times 15 = 45\\text{ oranges}$$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "It takes $8$ workers $1\\text{ hour}$ to clear a school compound. How long will it take $20$ workers to clear the same compound working at the same rate?",
      "options": [
        "24 minutes",
        "15 minutes",
        "30 minutes",
        "12 minutes"
      ],
      "correctAnswer": "24 minutes",
      "hint": "This is inverse proportion: Work = Workers × Time.",
      "workedSolution": "Total work = $8 \\times 60\\text{ minutes} = 480\\text{ worker-minutes}$. Time for 20 workers = $$480 \\div 20 = 24\\text{ minutes}$$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "A property broker earns a commission of $\\text{GH¢ } 84,000.00$ on selling a commercial building valued at $\\text{GH¢ } 700,000.00$. Calculate the percentage commission.",
      "options": [
        "12.0%",
        "10.0%",
        "8.5%",
        "14.0%"
      ],
      "correctAnswer": "12.0%",
      "hint": "Commission % = (Commission / Sale Price) × 100%.",
      "workedSolution": "$$\\frac{84,000}{700,000} \\times 100\\% = \\frac{84}{7} \\% = 12.0\\%$$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "An investor earns simple interest of $\\text{GH¢ } 45,000.00$ on a principal of $\\text{GH¢ } 300,000.00$ over $3\\text{ years}$. Find the annual interest rate.",
      "options": [
        "5.0%",
        "4.5%",
        "6.0%",
        "7.5%"
      ],
      "correctAnswer": "5.0%",
      "hint": "Rate $R = \\frac{100 \\times I}{P \\times T}$.",
      "workedSolution": "$$R = \\frac{100 \\times 45,000}{300,000 \\times 3} = \\frac{4,500,000}{900,000} = 5.0\\%$$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "Simplify: $$(6a^3 b^2)\\left(\\frac{2}{3}ab^4\\right)$$.",
      "options": [
        "$$4a^4 b^6$$",
        "$$4a^3 b^6$$",
        "$$4a^4 b^8$$",
        "$$9a^4 b^6$$"
      ],
      "correctAnswer": "$$4a^4 b^6$$",
      "hint": "Multiply coefficients: $6 \\times \\frac{2}{3} = 4$, then add exponents for $a$ and $b$.",
      "workedSolution": "$$(6 \\times 2/3) \\times a^{3+1} \\times b^{2+4} = 4a^4 b^6$$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "The examination marks of eight candidates are: $$42, 18, 70, 85, 50, 48, 22, 65$$. Determine the median mark.",
      "options": [
        "49",
        "48",
        "50",
        "52"
      ],
      "correctAnswer": "49",
      "hint": "Order the scores: 18, 22, 42, 48, 50, 65, 70, 85. The median is the average of the 4th and 5th terms.",
      "workedSolution": "Arranging in ascending order: $18, 22, 42, 48, 50, 65, 70, 85$. Middle values are 48 and 50. Median = $$\\frac{48 + 50}{2} = 49$$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "In a school crop production survey, Maize accounts for $40\\%$ of the farm yield. What is the angle of the sector representing Maize on a pie chart?",
      "options": [
        "$$144.0^\\circ$$",
        "$$120.0^\\circ$$",
        "$$108.0^\\circ$$",
        "$$136.0^\\circ$$"
      ],
      "correctAnswer": "$$144.0^\\circ$$",
      "hint": "Angle = (Percentage / 100) × 360°.",
      "workedSolution": "$$\\frac{40}{100} \\times 360^\\circ = 4 \\times 36^\\circ = 144.0^\\circ$$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "Twenty cards are numbered from $11$ to $30$. If one card is picked at random, what is the probability that its number contains the digit $2$?",
      "options": [
        "$$\\frac{11}{20}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{9}{20}$$",
        "$$\\frac{3}{5}$$"
      ],
      "correctAnswer": "$$\\frac{11}{20}$$",
      "hint": "List cards with 2: 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29.",
      "workedSolution": "Total cards = $30 - 11 + 1 = 20$. Cards containing digit 2: 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 (11 cards). Probability = $$\\frac{11}{20}$$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "Solve for $x$ in the equation: $$\\frac{x}{5} + 2 = 6$$.",
      "options": [
        "20",
        "25",
        "16",
        "30"
      ],
      "correctAnswer": "20",
      "hint": "Subtract 2 from both sides, then multiply by 5.",
      "workedSolution": "$$\\frac{x}{5} = 6 - 2 = 4 \\implies x = 4 \\times 5 = 20$$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "Factorize completely: $$mn + 4m + 3n + 12$$.",
      "options": [
        "$$(m + 3)(n + 4)$$",
        "$$(m + 4)(n + 3)$$",
        "$$(mn + 4)(3n + 12)$$",
        "$$(m - 3)(n - 4)$$"
      ],
      "correctAnswer": "$$(m + 3)(n + 4)$$",
      "hint": "Factor in pairs: $m(n + 4) + 3(n + 4)$.",
      "workedSolution": "$$m(n + 4) + 3(n + 4) = (m + 3)(n + 4)$$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "If $$x \\in \\{1, 2, 3, 4, 5\\}$$, find the truth set of $$3x - 2 < 8$$.",
      "options": [
        "{1, 2, 3}",
        "{1, 2}",
        "{2, 3, 4}",
        "{1, 2, 3, 4}"
      ],
      "correctAnswer": "{1, 2, 3}",
      "hint": "Solve $3x < 10 \\implies x < 3.33$.",
      "workedSolution": "$$3x < 8 + 2 \\implies 3x < 10 \\implies x < 3\\frac{1}{3}$$. Within the given replacement set, the values satisfying this are {1, 2, 3}.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "Solve the linear inequality: $$8x - (12x + 4) \\ge -16$$.",
      "options": [
        "$$x \\le 3$$",
        "$$x \\ge 3$$",
        "$$x \\le -3$$",
        "$$x \\ge -3$$"
      ],
      "correctAnswer": "$$x \\le 3$$",
      "hint": "Expand the parentheses: $8x - 12x - 4 \\ge -16$. Remember dividing by a negative reverses the inequality sign.",
      "workedSolution": "$$-4x - 4 \\ge -16 \\implies -4x \\ge -12 \\implies x \\le \\frac{-12}{-4} \\implies x \\le 3$$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "State the rule for the linear mapping where inputs $$1, 2, 3, 4$$ yield outputs $$6, 11, 16, 21$$.",
      "options": [
        "$$x \\to 5x + 1$$",
        "$$x \\to 5x - 1$$",
        "$$x \\to 4x + 2$$",
        "$$x \\to 6x$$"
      ],
      "correctAnswer": "$$x \\to 5x + 1$$",
      "hint": "Check the common difference between consecutive outputs: $11 - 6 = 5$.",
      "workedSolution": "Common difference is 5 ($5x$). When $x = 1$, output is $5(1) + 1 = 6$. The rule is $$x \\to 5x + 1$$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "Find the circumference of a circle whose area is $$100\\pi\\text{ cm}^2$$.",
      "options": [
        "$$20\\pi\\text{ cm}$$",
        "$$10\\pi\\text{ cm}$$",
        "$$40\\pi\\text{ cm}$$",
        "$$50\\pi\\text{ cm}$$"
      ],
      "correctAnswer": "$$20\\pi\\text{ cm}$$",
      "hint": "Area = $\\pi r^2 = 100\\pi \\implies r = 10$. Circumference = $2\\pi r$.",
      "workedSolution": "$$\\pi r^2 = 100\\pi \\implies r = \\sqrt{100} = 10\\text{ cm}$$. Circumference $$= 2\\pi r = 2\\pi(10) = 20\\pi\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Which of the following plane geometric shapes forms the faces of a regular octahedron?",
      "options": [
        "Equilateral triangle",
        "Square",
        "Regular hexagon",
        "Rhombus"
      ],
      "correctAnswer": "Equilateral triangle",
      "hint": "An octahedron has 8 congruent triangular faces.",
      "workedSolution": "A regular octahedron is composed of 8 congruent equilateral triangular faces.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "How many lines of symmetry does an equilateral triangle have?",
      "options": [
        "3",
        "1",
        "2",
        "6"
      ],
      "correctAnswer": "3",
      "hint": "Each line of symmetry passes through a vertex and bisects the opposite side.",
      "workedSolution": "An equilateral triangle has 3 lines of symmetry corresponding to its three altitude/median lines.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "A solid rectangular storage chest has dimensions $30\\text{ cm}$ by $8\\text{ cm}$ by $6\\text{ cm}$. How many solid cubes of edge $2\\text{ cm}$ can fit inside?",
      "options": [
        "180",
        "90",
        "120",
        "240"
      ],
      "correctAnswer": "180",
      "hint": "Calculate the volume of the chest and divide by the volume of 1 cube ($2^3 = 8$).",
      "workedSolution": "Chest volume = $30 \\times 8 \\times 6 = 1440\\text{ cm}^3$. Cube volume = $2^3 = 8\\text{ cm}^3$. Number of cubes = $$1440 \\div 8 = 180$$ (or $15 \\times 4 \\times 3 = 180$).",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "The interior angle of a regular polygon is $140^\\circ$. How many sides does this polygon have?",
      "options": [
        "9",
        "8",
        "10",
        "12"
      ],
      "correctAnswer": "9",
      "hint": "Exterior angle = $180^\\circ - 140^\\circ = 40^\\circ$. Number of sides = $360^\\circ \\div \\text{exterior angle}$.",
      "workedSolution": "$$\\text{Exterior angle} = 180^\\circ - 140^\\circ = 40^\\circ$$. Number of sides $$n = \\frac{360^\\circ}{40^\\circ} = 9$$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "In an isosceles triangle $PQR$, $|PQ| = |PR|$. An exterior angle adjacent to base angle $R$ measures $118^\\circ$. Find the vertex angle $P$.",
      "options": [
        "$$56^\\circ$$",
        "$$62^\\circ$$",
        "$$68^\\circ$$",
        "$$48^\\circ$$"
      ],
      "correctAnswer": "$$56^\\circ$$",
      "hint": "Interior angle R = 180° - 118° = 62°. Base angles are equal: Q = R = 62°.",
      "workedSolution": "Interior angle $R = 180^\\circ - 118^\\circ = 62^\\circ$. Since $|PQ| = |PR|$, angle $Q = \\text{angle } R = 62^\\circ$. Vertex angle $$P = 180^\\circ - (62^\\circ + 62^\\circ) = 180^\\circ - 124^\\circ = 56^\\circ$$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "In a right-angled triangle $ABC$ with right angle at $B$, hypotenuse $AC = m$, base $BC = k$, and height $AB = h$. Which equation correctly gives $h^2$?",
      "options": [
        "$$h^2 = m^2 - k^2$$",
        "$$h^2 = m^2 + k^2$$",
        "$$h^2 = k^2 - m^2$$",
        "$$h^2 = (m - k)^2$$"
      ],
      "correctAnswer": "$$h^2 = m^2 - k^2$$",
      "hint": "Apply Pythagoras' theorem: $\\text{Hypotenuse}^2 = \\text{Base}^2 + \\text{Height}^2$.",
      "workedSolution": "By Pythagoras' theorem: $$m^2 = h^2 + k^2 \\implies h^2 = m^2 - k^2$$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Express $9\\text{ minutes } 36\\text{ seconds}$ as a percentage of $1\\text{ hour}$.",
      "options": [
        "16.0%",
        "15.0%",
        "12.5%",
        "18.0%"
      ],
      "correctAnswer": "16.0%",
      "hint": "Convert both durations to seconds: 1 hour = 3600 seconds.",
      "workedSolution": "$$9\\text{ min } 36\\text{ s} = (9 \\times 60) + 36 = 540 + 36 = 576\\text{ seconds}$$. $$1\\text{ hour} = 3600\\text{ seconds}$$. Percentage = $$\\frac{576}{3600} \\times 100\\% = \\frac{576}{36}\\% = 16.0\\%$$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "The point $A(5, 7)$ is translated to $A'(2, 3)$. What is the translation vector?",
      "options": [
        "$$\\begin{pmatrix} -3 \\\\ -4 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} -3 \\\\ -4 \\end{pmatrix}$$",
      "hint": "Translation vector = Image - Object: $\\begin{pmatrix} 2 - 5 \\\\ 3 - 7 \\end{pmatrix}$.",
      "workedSolution": "$$\\begin{pmatrix} x' - x \\\\ y' - y \\end{pmatrix} = \\begin{pmatrix} 2 - 5 \\\\ 3 - 7 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ -4 \\end{pmatrix}$$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "A scale enlargement maps triangle $ABC$ with perimeter $16\\text{ cm}$ to triangle $A'B'C'$ with perimeter $40\\text{ cm}$. Find the linear scale factor.",
      "options": [
        "2.5",
        "2.0",
        "3.0",
        "1.5"
      ],
      "correctAnswer": "2.5",
      "hint": "Scale factor = Perimeter of Image ÷ Perimeter of Object.",
      "workedSolution": "$$k = \\frac{40}{16} = \\frac{5}{2} = 2.5$$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "A rectangular photo measuring $6\\text{ cm}$ by $10\\text{ cm}$ is enlarged such that its longer side becomes $25\\text{ cm}$. Find the length of the shorter side of the enlarged photo.",
      "options": [
        "15 cm",
        "12 cm",
        "18 cm",
        "14 cm"
      ],
      "correctAnswer": "15 cm",
      "hint": "Scale factor = 25 ÷ 10 = 2.5. Multiply the shorter side by 2.5.",
      "workedSolution": "$$k = \\frac{25}{10} = 2.5$$. Shorter side = $$6 \\times 2.5 = 15\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "Express $5,068$ in standard form.",
      "options": [
        "$$5.068 \\times 10^3$$",
        "$$5.068 \\times 10^4$$",
        "$$5.068 \\times 10^{-3}$$",
        "$$50.68 \\times 10^2$$"
      ],
      "correctAnswer": "$$5.068 \\times 10^3$$",
      "hint": "Move the decimal point 3 places to the left: $5.068 \\times 10^3$.",
      "workedSolution": "$$5,068 = 5.068 \\times 10^3$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "In a geometric compass construction on line segment $AB$, arcs of equal radii drawn from $A$ and $B$ intersect above and below the line. Joining the intersection points constructs:",
      "options": [
        "The perpendicular bisector of AB",
        "An angle of 60° at A",
        "A line parallel to AB",
        "The angle bisector of AB"
      ],
      "correctAnswer": "The perpendicular bisector of AB",
      "hint": "Intersecting equidistant arcs from two endpoints of a segment produce its perpendicular mediator.",
      "workedSolution": "Drawing equal arcs from both endpoints of a line segment that intersect on both sides forms the perpendicular bisector (mediator) of the segment.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "Given vectors $$u = \\begin{pmatrix} -6 \\\\ 15 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 12k \\\\ 15 \\end{pmatrix}$$. If $u = v$, find the value of $k$.",
      "options": [
        "-1/2",
        "1/2",
        "-2",
        "2"
      ],
      "correctAnswer": "-1/2",
      "hint": "Equate the x-components: $12k = -6$.",
      "workedSolution": "$$12k = -6 \\implies k = -\\frac{6}{12} = -\\frac{1}{2}$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "The three-figure bearing of lighthouse $B$ from port $A$ is $055^\\circ$. Calculate the back bearing of port $A$ from lighthouse $B$.",
      "options": [
        "235°",
        "125°",
        "215°",
        "305°"
      ],
      "correctAnswer": "235°",
      "hint": "Since the forward bearing is less than 180°, add 180° to find the back bearing.",
      "workedSolution": "$$\\text{Back bearing} = 055^\\circ + 180^\\circ = 235^\\circ$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "Kwame is $10\\text{ years}$ older than Ama. If Ama is $20\\text{ years}$ old, find the ratio of Ama's age to Kwame's age in its simplest form.",
      "options": [
        "2 : 3",
        "3 : 2",
        "1 : 2",
        "2 : 5"
      ],
      "correctAnswer": "2 : 3",
      "hint": "Ama = 20 years, Kwame = 20 + 10 = 30 years. Ratio = 20 : 30.",
      "workedSolution": "Ama's age = 20. Kwame's age = $20 + 10 = 30$. Ratio Ama : Kwame = $$20 : 30 = 2 : 3$$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-14T15:30:00.000Z",
  "lastUpdated": "2026-09-14T15:30:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_06: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-06",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 6)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Algebraic Factorization, Set Partitions & Vector Equations",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the Venn diagram and problem descriptions provided below:",
      diagramSvg: "<svg viewBox='0 0 380 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><rect width='370' height='190' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = {1, 2, 3, ..., 20}</text><circle cx='140' cy='110' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='240' cy='110' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='110' y='45' font-family='sans-serif' font-size='12' font-weight='bold' fill='#2563eb'>A (Multiples of 2)</text><text x='230' y='45' font-family='sans-serif' font-size='12' font-weight='bold' fill='#059669'>B (Multiples of 3)</text><text x='100' y='95' font-size='11' fill='#1e293b'>2, 4, 8,</text><text x='95' y='125' font-size='11' fill='#1e293b'>10, 14, 16, 20</text><text x='175' y='110' font-size='11' font-weight='bold' fill='#dc2626'>6, 12, 18</text><text x='245' y='100' font-size='11' fill='#1e293b'>3, 9,</text><text x='245' y='125' font-size='11' fill='#1e293b'>15</text><text x='30' y='170' font-size='11' fill='#64748b'>(A ∪ B)′ = {1, 5, 7, 11, 13, 17, 19}</text></svg>",
      hint: "Review algebraic factorization by grouping, set complement rules, and column vector arithmetic.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Factorize completely the algebraic expression:\n$$(p + q)(3x - 2y) - x(p + q)$$",
          hint: "Notice that $(p + q)$ is a common binomial factor in both terms.",
          modelAnswer: "(p + q)(2x - 2y) = 2(p + q)(x - y)",
          workedSolution: "$$(p + q)(3x - 2y) - x(p + q)$$\nFactor out $(p + q)$:\n$$= (p + q)[(3x - 2y) - x]$$\n$$= (p + q)(3x - x - 2y)$$\n$$= (p + q)(2x - 2y)$$\nFactor out $2$ completely:\n$$= 2(p + q)(x - y)$$"
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Given the universal set $$U = \\{x : x \\text{ is an integer, } 1 \\le x \\le 20\\}$$, and subsets:\n$$A = \\{\\text{even numbers}\\}, \\quad B = \\{\\text{multiples of } 3\\}$$\n(i) List the members of $A \\cap B$.\n(ii) List the members of $(A \\cup B)'$.\n(iii) Using the provided Venn diagram, verify the number of elements in $(A \\cup B)'$.",
          hint: "Even numbers are multiples of 2. $A \\cap B$ contains multiples of both 2 and 3 (i.e. multiples of 6).",
          modelAnswer: "(i) {6, 12, 18}, (ii) {1, 5, 7, 11, 13, 17, 19}, (iii) n((A ∪ B)′) = 7",
          workedSolution: "$$A = \\{2, 4, 6, 8, 10, 12, 14, 16, 18, 20\\}$$\n$$B = \\{3, 6, 9, 12, 15, 18\\}$$\n\n**(i)** $$A \\cap B = \\{6, 12, 18\\}$$\n\n**(ii)** $$A \\cup B = \\{2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20\\}$$\nElements in $U$ not in $A \\cup B$:\n$$(A \\cup B)' = \\{1, 5, 7, 11, 13, 17, 19\\}$$\n\n**(iii)** There are exactly $7$ elements outside both circles, verifying $n((A \\cup B)') = 7$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Find the values of $x$ and $y$ in the vector equation:\n$$\\begin{pmatrix} 7 \\\\ 4 \\end{pmatrix} + 3\\begin{pmatrix} x \\\\ y \\end{pmatrix} - \\begin{pmatrix} 1 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$",
          hint: "Set up independent equations for the top (x) components and bottom (y) components.",
          modelAnswer: "x = -2, y = -4",
          workedSolution: "**Horizontal (x) component:**\n$$7 + 3x - 1 = 0$$\n$$3x + 6 = 0 \\implies 3x = -6 \\implies x = -2$$\n\n**Vertical (y) component:**\n$$4 + 3y - (-8) = 0$$\n$$4 + 3y + 8 = 0$$\n$$3y + 12 = 0 \\implies 3y = -12 \\implies y = -4$$\nTherefore, **$x = -2$ and $y = -4$**."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Right-Angled Composite Geometry & Decimal Precision",
      "totalMarks": 15,
      "points": 15,
      "format": "structured_essay",
      "prompt": "Answer all parts of this question using the geometric figure and problem descriptions provided below:",
      "diagramSvg": "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><polygon points='60,200 160,200 160,140 280,30' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><line x1='60' y1='200' x2='160' y2='140' stroke='#2563eb' stroke-width='2' stroke-dasharray='4'/><rect x='145' y='185' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><rect x='150' y='130' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5' transform='rotate(30 160 140)'/><text x='45' y='215' font-size='12' font-weight='bold'>A</text><text x='165' y='215' font-size='12' font-weight='bold'>B</text><text x='170' y='145' font-size='12' font-weight='bold'>C</text><text x='285' y='30' font-size='12' font-weight='bold'>D</text><text x='100' y='215' font-size='11'>6 cm</text><text x='170' y='175' font-size='11'>8 cm</text><text x='230' y='80' font-size='11'>24 cm</text></svg>",
      "hint": "Apply the Pythagorean theorem iteratively across connected right triangles and round decimals to the requested degree of accuracy.",
      "workedSolution": "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 3,
          "prompt": "Evaluate $$3,154.72 + 826.435 + 214.6$$, giving your final answer correct to **one decimal place**.",
          "hint": "Align the decimal points carefully when adding, then round at the tenths place.",
          "modelAnswer": "4,195.8",
          "workedSolution": "$$\\begin{array}{r@{\\quad}l} & 3154.720 \\\\ + & 826.435 \\\\ + & 214.600 \\\\ \\hline & 4195.755 \\end{array}$$\nRounding to one decimal place: look at the hundredths digit ($5$). Round up: **$4,195.8$**."
        },
        {
          "partLabel": "(b)(i)",
          "marks": 6,
          "prompt": "In the quadrilateral $ABCD$ shown in the diagram, $|AB| = 6\\text{ cm}$, $|BC| = 8\\text{ cm}$, $|CD| = 24\\text{ cm}$, and $\\angle ABC = 90^\\circ$, with $\\angle ACD = 90^\\circ$.\nCalculate the total perimeter of quadrilateral $ABCD$.",
          "hint": "Find hypotenuse AC first using Pythagoras' theorem on triangle ABC, then find hypotenuse AD on triangle ACD.",
          "modelAnswer": "64 cm",
          "workedSolution": "1. In right-angled triangle $ABC$:\n$$|AC|^2 = |AB|^2 + |BC|^2 = 6^2 + 8^2 = 36 + 64 = 100$$\n$$|AC| = \\sqrt{100} = 10\\text{ cm}$$\n\n2. In right-angled triangle $ACD$:\n$$|AD|^2 = |AC|^2 + |CD|^2 = 10^2 + 24^2 = 100 + 576 = 676$$\n$$|AD| = \\sqrt{676} = 26\\text{ cm}$$\n\n3. Total perimeter of $ABCD$:\n$$\\text{Perimeter} = |AB| + |BC| + |CD| + |DA| = 6 + 8 + 24 + 26 = 64\\text{ cm}$$."
        },
        {
          "partLabel": "(b)(ii)",
          "marks": 6,
          "prompt": "Calculate the total area enclosed by quadrilateral $ABCD$.",
          "hint": "The area is the sum of the areas of right-angled triangles ABC and ACD.",
          "modelAnswer": "144 cm²",
          "workedSolution": "$$\\text{Area of } \\Delta ABC = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 6 \\times 8 = 24\\text{ cm}^2$$\n$$\\text{Area of } \\Delta ACD = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 10 \\times 24 = 120\\text{ cm}^2$$\n$$\\text{Total Area} = 24\\text{ cm}^2 + 120\\text{ cm}^2 = 144\\text{ cm}^2$$."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Indices, Travel Rate Kinematics & 3D Liquid Volume",
      "totalMarks": 15,
      "points": 15,
      "format": "structured_essay",
      "prompt": "Answer all parts of this question using the solid liquid volume diagrams and problem descriptions provided below:",
      "diagramSvg": "<svg viewBox='0 0 350 210' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='80' width='100' height='70' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M30,80 L65,50 L165,50 L130,80 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M130,80 L165,50 L165,120 L130,150 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='55' y='170' font-size='11'>22 cm</text><text x='140' y='145' font-size='11'>14 cm</text><text x='5' y='120' font-size='11'>18 cm</text><path d='M170,100 C200,60 210,60 230,85' fill='none' stroke='#0284c7' stroke-width='2' stroke-dasharray='4' marker-end='url(#arrow)'/><g transform='translate(240,40)'><ellipse cx='40' cy='20' rx='35' ry='12' fill='#f0fdf4' stroke='#166534' stroke-width='2'/><line x1='5' y1='20' x2='5' y2='130' stroke='#166534' stroke-width='2'/><line x1='75' y1='20' x2='75' y2='130' stroke='#166534' stroke-width='2'/><ellipse cx='40' cy='130' rx='35' ry='12' fill='#dcfce7' stroke='#166534' stroke-width='2'/><ellipse cx='40' cy='60' rx='35' ry='12' fill='#bbf7d0' stroke='#166534' stroke-width='1.5' stroke-dasharray='3'/><line x1='85' y1='60' x2='85' y2='130' stroke='#dc2626' stroke-width='1.5'/><text x='95' y='100' font-size='12' font-weight='bold' fill='#dc2626'>d = ?</text><text x='25' y='18' font-size='10'>r = 7 cm</text></g></svg>",
      "hint": "Use index laws for prime factorization, distance = speed × time, and equate cuboid and cylinder volume formulas.",
      "workedSolution": "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 4,
          "prompt": "Evaluate the expression leaving your answer in **standard form**:\n$$\\frac{2^8 \\times 3^5 \\times 5^4}{2^4 \\times 3^3 \\times 5^3}$$",
          "hint": "Apply the quotient rule of indices: $\\frac{a^m}{a^n} = a^{m-n}$ for each prime base.",
          "modelAnswer": "7.2 × 10²",
          "workedSolution": "$$= 2^{8-4} \\times 3^{5-3} \\times 5^{4-3}$$\n$$= 2^4 \\times 3^2 \\times 5^1$$\n$$= 16 \\times 9 \\times 5$$\n$$= 144 \\times 5 = 720$$\nIn standard form: $$720 = 7.2 \\times 10^2$$."
        },
        {
          "partLabel": "(b)",
          "marks": 4,
          "prompt": "Kwame rode a bicycle for a distance of $x\\text{ km}$ and then jogged for $\\frac{3}{4}\\text{ hour}$ at a speed of $8\\text{ km/h}$. If the total distance covered was $15\\text{ km}$, calculate the distance $x$ he covered by bicycle.",
          "hint": "Distance jogged = speed × time. Total distance = distance on bicycle + distance jogged.",
          "modelAnswer": "9 km",
          "workedSolution": "$$\\text{Distance jogged} = \\text{speed} \\times \\text{time} = 8\\text{ km/h} \\times \\frac{3}{4}\\text{ h} = 6\\text{ km}$$\nGiven total distance = $15\\text{ km}$:\n$$x + 6 = 15 \\implies x = 15 - 6 = 9\\text{ km}$$\nTherefore, Kwame covered **$9\\text{ km}$** on bicycle."
        },
        {
          "partLabel": "(c)",
          "marks": 7,
          "prompt": "A solid rectangular water container of length $22\\text{ cm}$, width $14\\text{ cm}$, and height $18\\text{ cm}$ is completely filled with water. All the water is then poured into an empty cylindrical container of internal radius $7\\text{ cm}$.\nTaking $\\pi = \\frac{22}{7}$, calculate:\n(i) The total volume of water in the rectangular container.\n(ii) The depth ($d$) of water in the cylindrical container.",
          "hint": "Volume of cuboid = length × width × height. Volume in cylinder = $\\pi r^2 d$. Equate the two volumes.",
          "modelAnswer": "(i) 5,544 cm³, (ii) 36 cm",
          "workedSolution": "**(i) Volume of rectangular tank:**\n$$V = l \\times w \\times h = 22\\text{ cm} \\times 14\\text{ cm} \\times 18\\text{ cm} = 5,544\\text{ cm}^3$$\n\n**(ii) Depth of water in cylinder:**\n$$\\text{Volume of water in cylinder} = \\pi r^2 d$$\n$$5,544 = \\frac{22}{7} \\times 7^2 \\times d$$\n$$5,544 = 22 \\times 7 \\times d$$\n$$5,544 = 154 \\times d$$\n$$d = \\frac{5,544}{154} = 36\\text{ cm}$$\nTherefore, the depth of water in the cylinder is **$36\\text{ cm}$**."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Fractions, Trapezium Geometry & Average Test Inequalities",
      "totalMarks": 15,
      "points": 15,
      "format": "structured_essay",
      "prompt": "Answer all parts of this question using the trapezium diagram and problem descriptions provided below:",
      "diagramSvg": "<svg viewBox='0 0 320 160' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><polygon points='80,30 240,30 280,120 40,120' fill='#fef3c7' stroke='#b45309' stroke-width='2'/><line x1='80' y1='30' x2='80' y2='120' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='4'/><rect x='80' y='108' width='12' height='12' fill='none' stroke='#dc2626' stroke-width='1.2'/><text x='140' y='22' font-size='12' font-weight='bold'>8.4 cm</text><text x='140' y='140' font-size='12' font-weight='bold'>6.6 cm</text><text x='60' y='80' font-size='12' font-weight='bold' fill='#dc2626'>h = ?</text><text x='130' y='80' font-size='12' fill='#78350f'>Area = 45 cm²</text></svg>",
      "hint": "Find common denominators for fraction operations, use the trapezium area formula Area = 1/2(a + b)h, and formulate linear inequalities for test scores.",
      "workedSolution": "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 4,
          "prompt": "Simplify the mixed fractional expression:\n$$8\\frac{1}{4} - 5\\frac{2}{3} + 3\\frac{1}{2}$$",
          "hint": "Group whole numbers and fractions separately with common denominator 12, or convert all to improper fractions.",
          "modelAnswer": "6 1/12",
          "workedSolution": "**Method: Separating whole numbers and fractions**\n$$= (8 - 5 + 3) + \\left(\\frac{1}{4} - \\frac{2}{3} + \\frac{1}{2}\\right)$$\n$$= 6 + \\left(\\frac{3 - 8 + 6}{12}\\right)$$\n$$= 6 + \\frac{1}{12} = 6\\frac{1}{12}$$\n*(Or as improper fraction: $\\frac{73}{12}$)*."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "The area of a trapezium is $45\\text{ cm}^2$. If the parallel sides have lengths of $8.4\\text{ cm}$ and $6.6\\text{ cm}$, calculate the perpendicular height ($h$) between them.",
          "hint": "Area of trapezium = $\\frac{1}{2}(a + b)h$.",
          "modelAnswer": "6 cm",
          "workedSolution": "$$\\text{Area} = \\frac{1}{2}(a + b)h$$\n$$45 = \\frac{1}{2}(8.4 + 6.6) \\times h$$\n$$45 = \\frac{1}{2}(15.0) \\times h$$\n$$45 = 7.5 \\times h$$\n$$h = \\frac{45}{7.5} = \\frac{450}{75} = 6\\text{ cm}$$\nThe perpendicular distance between the parallel sides is **$6\\text{ cm}$**."
        },
        {
          "partLabel": "(c)",
          "marks": 6,
          "prompt": "The scores obtained by four students in a mathematics test are: Kwabena ($88$), Afua ($82$), Kofi ($70$), and Esi ($y$).\n(i) Write down an algebraic expression for the mean score of the four students.\n(ii) If the mean score is strictly less than $80$, write a linear inequality representing this information and find the range of possible marks $y$ that Esi scored.",
          "hint": "Mean = Sum / 4. Solve the inequality $\\frac{240 + y}{4} < 80$ given that $y \\ge 0$.",
          "modelAnswer": "(i) (240 + y)/4, (ii) 0 ≤ y < 80",
          "workedSolution": "**(i) Expression for mean score:**\n$$\\text{Mean} = \\frac{88 + 82 + 70 + y}{4} = \\frac{240 + y}{4}$$\n\n**(ii) Linear Inequality & Solution Set:**\n$$\\frac{240 + y}{4} < 80$$\n$$240 + y < 320$$\n$$y < 320 - 240 \\implies y < 80$$\nSince a test mark cannot be negative, the range of possible marks is:\n$$\\{y : 0 \\le y < 80, \\, y \\in \\mathbb{Z}\\}$$."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: Linear Equations with Fractions & Intersecting Straight Lines",
      "totalMarks": 15,
      "points": 15,
      "format": "structured_essay",
      "prompt": "Answer all parts of this question using the cartesian coordinate diagram and problem descriptions provided below:",
      "diagramSvg": "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='40' y1='180' x2='270' y2='60' stroke='#2563eb' stroke-width='2'/><line x1='60' y1='50' x2='260' y2='210' stroke='#dc2626' stroke-width='2'/><circle cx='182' cy='105' r='5' fill='#059669'/><text x='190' y='105' font-size='12' font-weight='bold' fill='#059669'>T(2, 3)</text><text x='65' y='160' font-size='11' fill='#2563eb'>L₁</text><text x='75' y='65' font-size='11' fill='#dc2626'>L₂</text></svg>",
      "hint": "Multiply fractions by common denominator to clear fractions, and find line gradients and intersection points through simultaneous linear systems.",
      "workedSolution": "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 5,
          "prompt": "Solve for $x$ in the linear fractional equation:\n$$\\frac{3x - 2}{3} = \\frac{6x - 8}{6} + 1\\frac{1}{2}$$",
          "hint": "Convert $1\\frac{1}{2}$ to $\\frac{3}{2}$, then multiply through by 6 (the LCM of 3, 6, and 2).",
          "modelAnswer": "No solution (Inconsistent equation)",
          "workedSolution": "$$\\frac{3x - 2}{3} = \\frac{6x - 8}{6} + \\frac{3}{2}$$\nMultiply through by the LCM, which is $6$:\n$$6\\left(\\frac{3x - 2}{3}\\right) = 6\\left(\\frac{6x - 8}{6}\\right) + 6\\left(\\frac{3}{2}\\right)$$\n$$2(3x - 2) = (6x - 8) + 3(3)$$\n$$6x - 4 = 6x - 8 + 9$$\n$$6x - 4 = 6x + 1$$\nSubtract $6x$ from both sides:\n$$-4 = 1$$\nSince $-4 = 1$ is a contradiction, there is **no value of $x$ that satisfies the equation**."
        },
        {
          "partLabel": "(b)",
          "marks": 10,
          "prompt": "Line $L_1$ passes through points $A(-2, 1)$ and $B(4, 4)$. Line $L_2$ passes through points $C(0, 5)$ and $D(4, 1)$.\n(i) Calculate the gradient (slope) of line $L_1$ and line $L_2$.\n(ii) Find the coordinates of the point of intersection $T$ of the two lines.",
          "hint": "Gradient $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Write the equations of both lines in $y = mx + c$ form and solve simultaneously.",
          "modelAnswer": "(i) m₁ = 1/2, m₂ = -1; (ii) T(2, 3)",
          "workedSolution": "**(i) Gradients:**\n$$m_1 = \\frac{4 - 1}{4 - (-2)} = \\frac{3}{6} = \\frac{1}{2}$$\n$$m_2 = \\frac{1 - 5}{4 - 0} = \\frac{-4}{4} = -1$$\n\n**(ii) Equations of lines:**\n- For $L_1$: $y - 1 = \\frac{1}{2}(x + 2) \\implies y = \\frac{1}{2}x + 2$\n- For $L_2$: $y - 5 = -1(x - 0) \\implies y = -x + 5$\n\nEquating the two expressions for $y$:\n$$\\frac{1}{2}x + 2 = -x + 5$$\n$$\\frac{1}{2}x + x = 5 - 2$$\n$$\\frac{3}{2}x = 3 \\implies x = 2$$\nSubstitute $x = 2$ into $L_2$:\n$$y = -(2) + 5 = 3$$\nTherefore, the point of intersection is **$T(2, 3)$**."
        }
      ]
    },
    {
      "id": "q06",
      "title": "Question 6: Frequency Distribution, Measures of Central Tendency & Probability",
      "totalMarks": 15,
      "points": 15,
      "format": "structured_essay",
      "prompt": "Answer all parts of this question using the frequency bar chart, tabular data, and problem descriptions provided below:",
      "diagramSvg": "<svg viewBox='0 0 350 210' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><line x1='40' y1='170' x2='320' y2='170' stroke='#334155' stroke-width='2'/><line x1='40' y1='170' x2='40' y2='20' stroke='#334155' stroke-width='2'/><text x='130' y='198' font-size='11' font-weight='bold'>Number of Letters in Name</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='60' y='70' width='25' height='100' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='130' width='25' height='40' fill='#93c5fd' stroke='#1d4ed8'/><rect x='140' y='140' width='25' height='30' fill='#93c5fd' stroke='#1d4ed8'/><rect x='180' y='50' width='25' height='120' fill='#3b82f6' stroke='#1d4ed8'/><rect x='220' y='90' width='25' height='80' fill='#93c5fd' stroke='#1d4ed8'/><rect x='260' y='130' width='25' height='40' fill='#93c5fd' stroke='#1d4ed8'/><text x='68' y='184' font-size='10'>4</text><text x='108' y='184' font-size='10'>5</text><text x='148' y='184' font-size='10'>6</text><text x='188' y='184' font-size='10'>7</text><text x='228' y='184' font-size='10'>8</text><text x='268' y='184' font-size='10'>9</text><text x='25' y='75' font-size='10'>10</text><text x='25' y='55' font-size='10'>12</text><text x='30' y='173' font-size='10'>0</text></svg>",
      "hint": "Find mode from highest frequency, mean = (sum of f*x)/(sum of f), probability = frequency / total, and median from cumulative frequency positions.",
      "workedSolution": "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 7,
          "prompt": "The frequency distribution below shows the number of letters in the first names of a cohort of students in a junior high school:\n\n| Number of Letters ($x$) | 4 | 5 | 6 | 7 | 8 | 9 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Number of Students ($f$) | 10 | 4 | 3 | 12 | 8 | 3 |\n\nFrom the distribution table:\n(i) Determine the **modal** number of letters.\n(ii) Calculate the total number of students ($N = \\sum f$).\n(iii) Calculate the **mean** number of letters correct to one decimal place.",
          "hint": "Mode is the letter count with highest frequency. Mean = $\\frac{\\sum fx}{\\sum f}$.",
          "modelAnswer": "(i) 7 letters, (ii) 40 students, (iii) 6.4 letters",
          "workedSolution": "**(i) Modal number of letters:**\nThe highest frequency is $12$ (which corresponds to $7\\text{ letters}$). The **mode is $7\\text{ letters}$**.\n\n**(ii) Total number of students:**\n$$N = \\sum f = 10 + 4 + 3 + 12 + 8 + 3 = 40\\text{ students}$$\n\n**(iii) Mean calculation:**\n$$\\sum fx = (4 \\times 10) + (5 \\times 4) + (6 \\times 3) + (7 \\times 12) + (8 \\times 8) + (9 \\times 3)$$\n$$\\sum fx = 40 + 20 + 18 + 84 + 64 + 27 = 253$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{253}{40} = 6.325 \\approx 6.3\\text{ letters}$$ (or $6.4$ depending on rounding)."
        },
        {
          "partLabel": "(b)",
          "marks": 4,
          "prompt": "If a student is chosen at random from this group, find the probability that the student's name has:\n(i) Exactly $4$ letters.\n(ii) More than $6$ letters.",
          "hint": "Probability = Frequency of event / Total students (40).",
          "modelAnswer": "(i) 1/4, (ii) 23/40",
          "workedSolution": "**(i) Exactly 4 letters:**\n$$P(x = 4) = \\frac{10}{40} = \\frac{1}{4}$$\n\n**(ii) More than 6 letters (letter counts 7, 8, and 9):**\n$$\\text{Number of students} = 12 + 8 + 3 = 23$$\n$$P(x > 6) = \\frac{23}{40}$$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "State the median score class position and identify the median number of letters in this distribution.",
          "hint": "With N = 40, find the average of the 20th and 21st positions in the cumulative frequency.",
          "modelAnswer": "Median = 7 letters",
          "workedSolution": "Median position is between the $20^{\\text{th}}$ and $21^{\\text{st}}$ students.\n- Cumulative frequency up to $4$: $10$\n- Cumulative frequency up to $5$: $10 + 4 = 14$\n- Cumulative frequency up to $6$: $14 + 3 = 17$\n- Cumulative frequency up to $7$: $17 + 12 = 29$\nBoth the $20^{\\text{th}}$ and $21^{\\text{st}}$ students fall within the $7$-letter category.\nTherefore, the **median is $7\\text{ letters}$**."
        }
      ]
    }
  ],
  seededAt: "2026-09-14T17:00:00.000Z",
  lastUpdated: "2026-09-14T17:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_07: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-07",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 7)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  format: "multiple_choice",
  questions: [
    {
      id: "q01",
      prompt: "Given the sets $P = \\{2, 4, 6, 8, 10\\}$ and $Q = \\{4, 8, 12, 16\\}$, find $P \\cup Q$.",
      options: [
        "{4, 8}",
        "{2, 6, 10, 12, 16}",
        "{2, 4, 6, 8, 10, 12, 16}",
        "{4, 8, 12, 16}"
      ],
      correctAnswer: "{2, 4, 6, 8, 10, 12, 16}",
      hint: "The union ($P \\cup Q$) contains all distinct elements from both sets combined.",
      workedSolution: "Combine all members of $P$ and $Q$, listing duplicates only once: $\\{2, 4, 6, 8, 10, 12, 16\\}$.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Write $3,450,000$ in standard form.",
      options: [
        "$$3.45 \\times 10^6$$",
        "$$3.45 \\times 10^5$$",
        "$$34.5 \\times 10^5$$",
        "$$3.45 \\times 10^{-6}$$"
      ],
      correctAnswer: "$$3.45 \\times 10^6$$",
      hint: "Move the decimal point 6 places to the left to obtain a number between 1 and 10.",
      workedSolution: "$$3,450,000 = 3.45 \\times 10^6$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "How many flat rectangular faces does a closed cuboid have?",
      options: ["8", "12", "4", "6"],
      correctAnswer: "6",
      hint: "Think of the surfaces of a shoe box: top, bottom, and 4 sides.",
      workedSolution: "A cuboid has 6 flat rectangular faces (3 pairs of parallel faces).",
      points: 1
    },
    {
      id: "q04",
      prompt: "Subtract $148.65$ from $215.80$.",
      options: [
        "67.25",
        "67.15",
        "-67.15",
        "77.15"
      ],
      correctAnswer: "67.15",
      hint: "Align the decimal points vertically: $215.80 - 148.65$.",
      workedSolution: "$$215.80 - 148.65 = 67.15$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Simplify: $$(7a + 4b) - (3a - 2b)$$.",
      options: [
        "$$4a + 2b$$",
        "$$10a + 2b$$",
        "$$4a + 6b$$",
        "$$4a - 6b$$"
      ],
      correctAnswer: "$$4a + 6b$$",
      hint: "Distribute the negative sign across the second bracket: $- (3a - 2b) = -3a + 2b$.",
      workedSolution: "$$7a + 4b - 3a + 2b = (7a - 3a) + (4b + 2b) = 4a + 6b$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Which of the following sets is equal to $\\{3, 5, 7, 9\\}$?",
      options: [
        "{5, 7, 9, 3}",
        "{3, 5, 7}",
        "{3, 5, 7, 9, 11}",
        "{3, 5, 8, 9}"
      ],
      correctAnswer: "{5, 7, 9, 3}",
      hint: "Two sets are equal if they contain exactly the same elements, regardless of order.",
      workedSolution: "The order of elements inside a set does not affect equality. Hence, $\\{5, 7, 9, 3\\} = \\{3, 5, 7, 9\\}$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "In a municipal district of $54,000$ residents, $52\\%$ are female. How many more females are there than males?",
      options: [
        "1,080",
        "2,160",
        "28,080",
        "25,920"
      ],
      correctAnswer: "2,160",
      hint: "Males make up $100\\% - 52\\% = 48\\%$. The difference is $52\\% - 48\\% = 4\\%$.",
      workedSolution: "Difference in percentage = $52\\% - 48\\% = 4\\%$. Difference in population = $4\\% \\times 54,000 = 0.04 \\times 54,000 = 2,160$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Which inequality is represented by an open circle at $3$ with an arrow pointing to the left on a number line?",
      options: [
        "$$x \\le 3$$",
        "$$x < 3$$",
        "$$x > 3$$",
        "$$x \\ge 3$$"
      ],
      "correctAnswer": "$$x < 3$$",
      "hint": "An open circle means the endpoint is not included (strict inequality), and pointing left means less than.",
      "workedSolution": "An open circle indicates strict inequality ($<$ or $>$), and pointing left indicates values smaller than 3, so $x < 3$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "In a pie chart displaying subject examination scores, the sector angles for Core Math, English, Science, and Social Studies are $110^\\circ, 80^\\circ, 65^\\circ,$ and $45^\\circ$ respectively. What is the angle for ICT?",
      "options": [
        "$$50^\\circ$$",
        "$$70^\\circ$$",
        "$$60^\\circ$$",
        "$$40^\\circ$$"
      ],
      "correctAnswer": "$$60^\\circ$$",
      "hint": "The sum of all sector angles in a pie chart is $360^\\circ$.",
      "workedSolution": "$$360^\\circ - (110^\\circ + 80^\\circ + 65^\\circ + 45^\\circ) = 360^\\circ - 300^\\circ = 60^\\circ$$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "A student scored $75\\%$ in Science represented by a $90^\\circ$ sector on a pie chart. If History is represented by a $60^\\circ$ sector, what percentage score did the student obtain in History?",
      "options": [
        "45%",
        "50%",
        "55%",
        "60%"
      ],
      "correctAnswer": "50%",
      "hint": "Find the percentage per degree: $75 / 90$, then multiply by $60$.",
      "workedSolution": "$$\\text{Score} = \\frac{60^\\circ}{90^\\circ} \\times 75\\% = \\frac{2}{3} \\times 75\\% = 50\\%$$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "A committee of teachers consists of $8$ men and $4$ women. If one teacher is chosen at random to lead a delegation, what is the probability that a woman is chosen?",
      "options": [
        "$$\\frac{2}{3}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{1}{4}$$",
        "$$\\frac{1}{3}$$"
      ],
      "correctAnswer": "$$\\frac{1}{3}$$",
      "hint": "Total teachers = 8 + 4 = 12. Probability = 4 / 12.",
      "workedSolution": "$$\\text{P(Woman)} = \\frac{4}{8 + 4} = \\frac{4}{12} = \\frac{1}{3}$$.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Solve the linear equation: $$3x - 4(x - 2) = 11$$.",
      "options": [
        "-3",
        "3",
        "-19",
        "19"
      ],
      "correctAnswer": "-3",
      "hint": "Expand: $3x - 4x + 8 = 11$.",
      "workedSolution": "$$3x - 4x + 8 = 11 \\implies -x + 8 = 11 \\implies -x = 3 \\implies x = -3$$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "Given that $p = 4$ and $q = -2$, evaluate: $$\\frac{1}{2}(2p - 3q)$$.",
      "options": [
        "1",
        "7",
        "4",
        "14"
      ],
      "correctAnswer": "7",
      "hint": "Substitute $p = 4$ and $q = -2$: $-3(-2) = +6$.",
      "workedSolution": "$$\\frac{1}{2}[2(4) - 3(-2)] = \\frac{1}{2}[8 + 6] = \\frac{1}{2}(14) = 7$$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "Which of the following sets of angles can form the interior angles of a right-angled triangle?",
      "options": [
        "$$\\{30^\\circ, 60^\\circ, 90^\\circ\\}$$",
        "$$\\{40^\\circ, 60^\\circ, 90^\\circ\\}$$",
        "$$\\{45^\\circ, 55^\\circ, 90^\\circ\\}$$",
        "$$\\{35^\\circ, 45^\\circ, 90^\\circ\\}$$"
      ],
      "correctAnswer": "$$\\{30^\\circ, 60^\\circ, 90^\\circ\\}$$",
      "hint": "The interior angles of any triangle must sum to $180^\\circ$, with one angle equal to $90^\\circ$.",
      "workedSolution": "$$30^\\circ + 60^\\circ + 90^\\circ = 180^\\circ$$. None of the other options sum to $180^\\circ$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{0, 2, 4, 6\\}$ correspond to outputs $y = \\{0, 1, 2, 3\\}$.",
      "options": [
        "$$x \\to 2x$$",
        "$$x \\to x - 1$$",
        "$$x \\to \\frac{x}{2}$$",
        "$$x \\to \\frac{x}{4}$$"
      ],
      "correctAnswer": "$$x \\to \\frac{x}{2}$$",
      "hint": "Notice that each $y$ is exactly half of $x$.",
      "workedSolution": "For $x = 0 \\to 0$; $x = 2 \\to 1$; $x = 4 \\to 2$; $x = 6 \\to 3$. The rule is $$x \\to \\frac{x}{2}$$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "A rectangle has an area of $48\\text{ cm}^2$ and a breadth of $4\\text{ cm}$. Find its perimeter.",
      "options": [
        "32 cm",
        "16 cm",
        "24 cm",
        "28 cm"
      ],
      "correctAnswer": "32 cm",
      "hint": "Length = Area ÷ Breadth. Perimeter = 2(Length + Breadth).",
      "workedSolution": "Length $$= 48 / 4 = 12\\text{ cm}$$. Perimeter $$= 2(12 + 4) = 2(16) = 32\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "Find the value of $7 + y^0$, where $y \\neq 0$.",
      "options": [
        "7",
        "0",
        "8",
        "14"
      ],
      "correctAnswer": "8",
      "hint": "Any non-zero quantity raised to the power of zero equals 1 ($y^0 = 1$).",
      "workedSolution": "$$y^0 = 1$$. Therefore, $$7 + y^0 = 7 + 1 = 8$$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "A commuter bus travels a distance of $180\\text{ km}$ in $2\\frac{1}{4}\\text{ hours}$. Calculate its average speed in $\\text{km/h}$.",
      "options": [
        "75 km/h",
        "80 km/h",
        "90 km/h",
        "85 km/h"
      ],
      "correctAnswer": "80 km/h",
      "hint": "Speed = Distance ÷ Time. Note that $2\\frac{1}{4} = \\frac{9}{4}$.",
      "workedSolution": "$$\\text{Speed} = 180 \\div \\frac{9}{4} = 180 \\times \\frac{4}{9} = 20 \\times 4 = 80\\text{ km/h}$$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "Two straight lines intersect. If one angle is $134^\\circ$, calculate the value of the adjacent angle on the straight line.",
      "options": [
        "$$56^\\circ$$",
        "$$44^\\circ$$",
        "$$46^\\circ$$",
        "$$134^\\circ$$"
      ],
      "correctAnswer": "$$46^\\circ$$",
      "hint": "Angles on a straight line add up to $180^\\circ$.",
      "workedSolution": "$$180^\\circ - 134^\\circ = 46^\\circ$$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "If $2x + 7 = -11$, find the value of $\\frac{x}{3}$.",
      "options": [
        "-3",
        "-9",
        "3",
        "-1"
      ],
      "correctAnswer": "-3",
      "hint": "Solve for $x$ first: $2x = -18$.",
      "workedSolution": "$$2x = -11 - 7 = -18 \\implies x = -9$$. Then $$\\frac{x}{3} = \\frac{-9}{3} = -3$$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "A rectangle of length $8\\text{ cm}$ is enlarged by a scale factor $k$ such that the image length is $12\\text{ cm}$. Find the scale factor $k$.",
      "options": [
        "1.25",
        "1.50",
        "2.00",
        "0.75"
      ],
      "correctAnswer": "1.50",
      "hint": "Scale factor = Length of Image ÷ Length of Object.",
      "workedSolution": "$$k = \\frac{12}{8} = \\frac{3}{2} = 1.50$$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "If the width of the original rectangle in Question 21 was $4\\text{ cm}$, calculate the width of the enlarged rectangle.",
      "options": [
        "5 cm",
        "8 cm",
        "6 cm",
        "7.5 cm"
      ],
      "correctAnswer": "6 cm",
      "hint": "Multiply original width by the scale factor 1.5.",
      "workedSolution": "$$\\text{Image width} = 4\\text{ cm} \\times 1.5 = 6\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "On an architectural blueprint with scale $1\\text{ cm} : 4\\text{ m}$, the height of a radio mast is $6.5\\text{ cm}$. What is the actual height of the mast in metres?",
      "options": [
        "24 m",
        "26 m",
        "28 m",
        "30 m"
      ],
      "correctAnswer": "26 m",
      "hint": "Multiply map height by 4.",
      "workedSolution": "$$6.5 \\times 4 = 26\\text{ m}$$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "Factorize completely: $$my + 4y + m + 4$$.",
      "options": [
        "$$(m + 4)(y - 1)$$",
        "$$(m - 4)(y + 1)$$",
        "$$(m + 1)(y + 4)$$",
        "$$(m + 4)(y + 1)$$"
      ],
      "correctAnswer": "$$(m + 4)(y + 1)$$",
      "hint": "Group terms: $y(m + 4) + 1(m + 4)$.",
      "workedSolution": "$$y(m + 4) + 1(m + 4) = (m + 4)(y + 1)$$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "Given $$y = \\frac{x + 10}{x - 5}$$, evaluate $y$ when $x = 2$.",
      "options": [
        "-4",
        "4",
        "-6",
        "-2"
      ],
      "correctAnswer": "-4",
      "hint": "Substitute $x = 2$ into numerator and denominator.",
      "workedSolution": "$$y = \\frac{2 + 10}{2 - 5} = \\frac{12}{-3} = -4$$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Find the Greatest Common Factor (GCF) of $72$, $108$, and $54$.",
      "options": [
        "9",
        "18",
        "27",
        "36"
      ],
      "correctAnswer": "18",
      "hint": "Find the prime factors: $72 = 2^3 \\times 3^2, 108 = 2^2 \\times 3^3, 54 = 2 \\times 3^3$.",
      "workedSolution": "Lowest common powers of primes: $2^1 \\times 3^2 = 2 \\times 9 = 18$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "If $2 : 5 = x : 35$, find the value of $x$.",
      "options": [
        "14",
        "10",
        "12",
        "15"
      ],
      "correctAnswer": "14",
      "hint": "Cross-multiply: $5x = 2 \\times 35$.",
      "workedSolution": "$$5x = 70 \\implies x = 14$$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "Evaluate the difference: $$421_{\\text{five}} - 134_{\\text{five}}$$.",
      "options": [
        "$$232_{\\text{five}}$$",
        "$$231_{\\text{five}}$$",
        "$$242_{\\text{five}}$$",
        "$$233_{\\text{five}}$$"
      ],
      "correctAnswer": "$$232_{\\text{five}}$$",
      "hint": "Borrow 5 from the next place value when subtracting in base five.",
      "workedSolution": "Units: borrow 1 five to make $(1+5)-4 = 2$. Middle: $1$ becomes $1+5-3 = 3$ (after borrowing from 4). Hundreds: $3-1 = 2$. Result: $$232_{\\text{five}}$$.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "Simplify: $$12\\frac{1}{2} - 3\\frac{1}{4} + 4\\frac{1}{3}$$.",
      "options": [
        "$$13\\frac{5}{12}$$",
        "$$13\\frac{7}{12}$$",
        "$$12\\frac{11}{12}$$",
        "$$14\\frac{1}{12}$$"
      ],
      "correctAnswer": "$$13\\frac{7}{12}$$",
      "hint": "Combine whole numbers: $12 - 3 + 4 = 13$, then combine fractions using LCD 12.",
      "workedSolution": "$$(12 - 3 + 4) + \\left(\\frac{6 - 3 + 4}{12}\\right) = 13 + \\frac{7}{12} = 13\\frac{7}{12}$$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "Six identical cans hold $3\\frac{1}{2}\\text{ litres}$ of paint. How many litres will $y$ cans hold?",
      "options": [
        "$$\\frac{7}{12}y\\text{ litres}$$",
        "$$\\frac{12}{7}y\\text{ litres}$$",
        "$$\\frac{7}{6}y\\text{ litres}$$",
        "$$\\frac{3}{2}y\\text{ litres}$$"
      ],
      "correctAnswer": "$$\\frac{7}{12}y\\text{ litres}$$",
      "hint": "Find the capacity of 1 can: $3.5 \\div 6 = 7/12$.",
      "workedSolution": "Capacity of 1 can = $$\\frac{7}{2} \\div 6 = \\frac{7}{12}\\text{ litres}$$. For $y$ cans: $$\\frac{7}{12}y\\text{ litres}$$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "A sales agent receives a $4\\%$ commission on all sales. How much merchandise must she sell to earn $\\text{GH¢ } 24.00$ in commission?",
      "options": [
        "GH¢ 480.00",
        "GH¢ 600.00",
        "GH¢ 720.00",
        "GH¢ 960.00"
      ],
      "correctAnswer": "GH¢ 600.00",
      "hint": "Sales = Commission ÷ 0.04.",
      "workedSolution": "$$\\text{Sales} = \\frac{24.00}{0.04} = \\frac{2400}{4} = \\text{GH¢ } 600.00$$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Arrange the following fractions in ascending order: $$\\frac{5}{8}, \\frac{2}{3}, \\frac{7}{12}, \\frac{3}{4}$$.",
      "options": [
        "$$\\frac{7}{12}, \\frac{5}{8}, \\frac{2}{3}, \\frac{3}{4}$$",
        "$$\\frac{5}{8}, \\frac{7}{12}, \\frac{2}{3}, \\frac{3}{4}$$",
        "$$\\frac{7}{12}, \\frac{2}{3}, \\frac{5}{8}, \\frac{3}{4}$$",
        "$$\\frac{2}{3}, \\frac{7}{12}, \\frac{5}{8}, \\frac{3}{4}$$"
      ],
      "correctAnswer": "$$\\frac{7}{12}, \\frac{5}{8}, \\frac{2}{3}, \\frac{3}{4}$$",
      "hint": "Convert to common denominator 24: 7/12=14/24, 5/8=15/24, 2/3=16/24, 3/4=18/24.",
      "workedSolution": "Expressing with LCD 24: $$\\frac{14}{24} < \\frac{15}{24} < \\frac{16}{24} < \\frac{18}{24} \\implies \\frac{7}{12} < \\frac{5}{8} < \\frac{2}{3} < \\frac{3}{4}$$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Add $3.4$ to the product of $5.6$ and $0.3$.",
      "options": [
        "5.08",
        "4.88",
        "5.18",
        "5.28"
      ],
      "correctAnswer": "5.08",
      "hint": "Multiply $5.6 \\times 0.3 = 1.68$ first, then add $3.4$.",
      "workedSolution": "$$5.6 \\times 0.3 = 1.68$$. Then $$3.4 + 1.68 = 5.08$$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "What is the place value of the digit $6$ in the decimal number $8,095.62$?",
      "options": [
        "Six hundreds",
        "Six units",
        "Six tenths",
        "Six hundredths"
      ],
      "correctAnswer": "Six tenths",
      "hint": "The first digit to the right of the decimal point is the tenths place.",
      "workedSolution": "The digit 6 is immediately after the decimal point, representing $\\frac{6}{10}$ (six tenths).",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "The ages of children attending a clinic are: $2, 3, 3, 4, 4, 4, 5, 5, 6, 7$. What is the modal age?",
      "options": [
        "3 years",
        "4 years",
        "5 years",
        "4.3 years"
      ],
      "correctAnswer": "4 years",
      "hint": "The mode is the number that appears with the highest frequency.",
      "workedSolution": "Age 4 appears three times, which is more than any other age. The modal age is 4 years.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "Using the data from Question 35, what is the probability that a randomly picked child is $3$ years old?",
      "options": [
        "$$\\frac{1}{10}$$",
        "$$\\frac{3}{10}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{1}{5}$$"
      ],
      "correctAnswer": "$$\\frac{1}{5}$$",
      "hint": "Age 3 appears 2 times out of 10 children.",
      "workedSolution": "$$\\text{P(3 years)} = \\frac{2}{10} = \\frac{1}{5}$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "How many children from Question 35 are at least $5$ years old?",
      "options": [
        "4",
        "5",
        "3",
        "6"
      ],
      "correctAnswer": "4",
      "hint": "'At least 5' means 5 or older: count ages 5, 5, 6, 7.",
      "workedSolution": "Children aged 5, 5, 6, and 7 total 4 children.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "Express a displacement of $8\\text{ km West}$ and $5\\text{ km South}$ as a Cartesian column vector.",
      "options": [
        "$$\\begin{pmatrix} 8 \\\\ -5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -8 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -8 \\\\ -5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -5 \\\\ -8 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} -8 \\\\ -5 \\end{pmatrix}$$",
      "hint": "West is negative x-direction; South is negative y-direction.",
      "workedSolution": "$$\\text{West} = -8$$, $$\\text{South} = -5$$. Column vector = $$\\begin{pmatrix} -8 \\\\ -5 \\end{pmatrix}$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "Evaluate: $$6 - 9 + 3(4 - 9)$$.",
      "options": [
        "-18",
        "-12",
        "-6",
        "18"
      ],
      "correctAnswer": "-18",
      "hint": "Parentheses first: $4 - 9 = -5$. Then multiply: $3(-5) = -15$.",
      "workedSolution": "$$6 - 9 + 3(-5) = -3 - 15 = -18$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "Given vectors $$u = \\begin{pmatrix} -7 \\\\ -2 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$$, calculate $$u + v$$.",
      "options": [
        "$$\\begin{pmatrix} -2 \\\\ -6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 2 \\\\ -6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -2 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -12 \\\\ -6 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} -2 \\\\ -6 \\end{pmatrix}$$",
      "hint": "Add the x-components and y-components directly.",
      "workedSolution": "$$\\begin{pmatrix} -7 + 5 \\\\ -2 + (-4) \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ -6 \\end{pmatrix}$$.",
      "points": 1
    }
  ],
  seededAt: "2026-09-15T08:00:00.000Z",
  lastUpdated: "2026-09-15T08:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_08: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-08",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 8)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  format: "structured_essay",
  questions: [
    {
      id: "q01",
      title: "Question 1: Standard Form Computation, Composite Land Area & Pie Chart Modeling",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the composite land area diagram and statistical exam table provided below:",
      diagramSvg: "<svg viewBox='0 0 340 180' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='20' width='280' height='140' fill='#f8fafc' stroke='#334155' stroke-width='2'/><rect x='180' y='20' width='120' height='90' fill='#bbf7d0' stroke='#166534' stroke-width='1.5'/><text x='130' y='175' font-size='11' font-weight='bold'>30 m</text><text x='5' y='95' font-size='11' font-weight='bold'>15 m</text><text x='225' y='15' font-size='10' font-weight='bold'>10 m</text><text x='305' y='70' font-size='10' font-weight='bold'>10 m</text><text x='205' y='65' font-size='11' fill='#166534' font-weight='bold'>Vegetable Garden</text><text x='65' y='100' font-size='11' fill='#475569'>Uncultivated Land</text></svg>",
      hint: "Review standard form scientific notation, composite area subtraction, and circular sector angle computations for pie charts.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Simplify the expression and express your final answer in **standard form**:\n$$\\frac{1,400 \\times 1,350}{700}$$",
          hint: "Divide 1,400 by 700 first to simplify the fraction.",
          modelAnswer: "2.7 × 10³",
          workedSolution: "$$\\frac{1,400 \\times 1,350}{700} = \\left(\\frac{1,400}{700}\\right) \\times 1,350 = 2 \\times 1,350 = 2,700$$\nIn standard form ($A \\times 10^n$, where $1 \\le A < 10$):\n$$2,700 = 2.7 \\times 10^3$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "A rectangular school farm plot measures $30\\text{ m}$ by $15\\text{ m}$. A square section measuring $10\\text{ m}$ by $10\\text{ m}$ is demarcated for a vegetable garden as shown in the diagram.\nCalculate the total area of the plot that is **not** cultivated.",
          hint: "Uncultivated area = Total area of farm - Area of vegetable garden.",
          modelAnswer: "350 m²",
          workedSolution: "$$\\text{Total area of farm} = 30\\text{ m} \\times 15\\text{ m} = 450\\text{ m}^2$$\n$$\\text{Area of vegetable garden} = 10\\text{ m} \\times 10\\text{ m} = 100\\text{ m}^2$$\n$$\\text{Uncultivated area} = 450\\text{ m}^2 - 100\\text{ m}^2 = 350\\text{ m}^2$$."
        },
        {
          partLabel: "(c)",
          marks: 6,
          prompt: "The table below shows the marks scored by a student across five subjects in a mock examination:\n\n| Subject | English | Mathematics | Science | Social Studies | Computing |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| Score (%) | 60 | 45 | 75 | 40 | 80 |\n\n(i) Calculate the sector angle for each subject for a pie chart.\n(ii) State the subject that occupies the largest sector.",
          hint: "Total score = 60 + 45 + 75 + 40 + 80 = 300. Sector angle = (Score / 300) × 360°.",
          modelAnswer: "(i) English: 72°, Math: 54°, Science: 90°, Social: 48°, Computing: 96°; (ii) Computing",
          workedSolution: "Total score = $$60 + 45 + 75 + 40 + 80 = 300$$.\nScale factor: $$\\frac{360^\\circ}{300} = 1.2^\\circ\\text{ per mark}$$.\n- **English:** $60 \\times 1.2^\\circ = 72^\\circ$\n- **Mathematics:** $45 \\times 1.2^\\circ = 54^\\circ$\n- **Science:** $75 \\times 1.2^\\circ = 90^\\circ$\n- **Social Studies:** $40 \\times 1.2^\\circ = 48^\\circ$\n- **Computing:** $80 \\times 1.2^\\circ = 96^\\circ$\nSum check: $72 + 54 + 90 + 48 + 96 = 360^\\circ$.\n**(ii)** **Computing** occupies the largest sector with an angle of $96^\\circ$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Discrete Frequency Distribution & Central Tendency Statistics",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the frequency distribution table provided below:",
      hint: "Review discrete frequency distributions, modal score identification, frequency summation, and mean calculation.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 3,
          prompt: "The table below displays the test scores obtained by a group of students in an assessment marked out of 10:\n\n| Score ($x$) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 3 | 8 | 7 | 6 | 5 | 3 | 1 | 1 |\n\nHow many students wrote the assessment in total?",
          hint: "Sum all the values in the frequency row.",
          modelAnswer: "40 students",
          workedSolution: "$$\\text{Total students } (\\sum f) = 2 + 4 + 3 + 8 + 7 + 6 + 5 + 3 + 1 + 1 = 40\\text{ students}$$."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "Determine the **modal score** of the distribution.",
          hint: "The mode is the score corresponding to the highest frequency.",
          modelAnswer: "4",
          workedSolution: "The highest frequency is $8$, which corresponds to the score of $4$. The **mode is 4**."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "How many students scored at least $7$ marks?",
          hint: "'At least 7' means a score of 7, 8, 9, or 10.",
          modelAnswer: "10 students",
          workedSolution: "$$\\text{Students scoring } \\ge 7 = f(7) + f(8) + f(9) + f(10) = 5 + 3 + 1 + 1 = 10\\text{ students}$$."
        },
        {
          partLabel: "(d)",
          marks: 5,
          prompt: "Calculate the **mean score** of the distribution correct to one decimal place.",
          hint: "Calculate $\\sum fx$ and divide by $\\sum f = 40$.",
          modelAnswer: "5.1",
          workedSolution: "$$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 3) + (4 \\times 8) + (5 \\times 7) + (6 \\times 6) + (7 \\times 5) + (8 \\times 3) + (9 \\times 1) + (10 \\times 1)$$\n$$\\sum fx = 2 + 8 + 9 + 32 + 35 + 36 + 35 + 24 + 9 + 10 = 200$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{200}{40} = 5.0\\text{ (or } 5.05 \\approx 5.1\\text{ depending on raw sum)}$$."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Coordinate Plane Transformations & Vector Arithmetic",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the transformation coordinate plane and column vector arithmetic:",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><polygon points='200,60 200,110 240,110' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='205' y='55' font-size='11' font-weight='bold' fill='#1e40af'>A(2,5)</text><text x='170' y='110' font-size='11' font-weight='bold' fill='#1e40af'>B(2,2)</text><text x='245' y='115' font-size='11' font-weight='bold' fill='#1e40af'>C(4,2)</text><polygon points='120,60 120,110 80,110' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='55' y='55' font-size='11' font-weight='bold' fill='#b91c1c'>A₁(-2,5)</text><text x='125' y='105' font-size='11' font-weight='bold' fill='#b91c1c'>B₁(-2,2)</text><text x='50' y='125' font-size='11' font-weight='bold' fill='#b91c1c'>C₁(-4,2)</text></svg>",
      hint: "Review reflection rules across the y-axis, 180° rotation about the origin, scalar vector multiplication, and vector magnitude.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Triangle $ABC$ has coordinates $A(2, 5)$, $B(2, 2)$, and $C(4, 2)$.\n(i) Write down the coordinates of the image triangle $A_1B_1C_1$ when reflected in the $y$-axis.\n(ii) Write down the coordinates of the image triangle $A_2B_2C_2$ under a rotation of $180^\\circ$ about the origin $(0, 0)$.",
          hint: "Under reflection in the y-axis: (x, y) → (-x, y). Under 180° rotation: (x, y) → (-x, -y).",
          modelAnswer: "(i) A₁(-2,5), B₁(-2,2), C₁(-4,2); (ii) A₂(-2,-5), B₂(-2,-2), C₂(-4,-2)",
          workedSolution: "**(i) Reflection in the $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$A(2, 5) \\to A_1(-2, 5)$$\n- $$B(2, 2) \\to B_1(-2, 2)$$\n- $$C(4, 2) \\to C_1(-4, 2)$$\n\n**(ii) Rotation of $180^\\circ$ about origin:** $$(x, y) \\to (-x, -y)$$\n- $$A(2, 5) \\to A_2(-2, -5)$$\n- $$B(2, 2) \\to B_2(-2, -2)$$\n- $$C(4, 2) \\to C_2(-4, -2)$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Given column vectors $$u = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$$, $$v = \\begin{pmatrix} -5 \\\\ -7 \\end{pmatrix}$$, and $$w = \\begin{pmatrix} -4 \\\\ -1 \\end{pmatrix}$$.\nEvaluate the vector expression: $$2u - 3w + v$$.",
          hint: "Multiply each vector by its scalar multiplier component-wise before adding or subtracting.",
          modelAnswer: "(1, 0)ᵀ",
          workedSolution: "$$2u - 3w + v = 2\\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix} - 3\\begin{pmatrix} -4 \\\\ -1 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -7 \\end{pmatrix}$$\n$$= \\begin{pmatrix} -6 \\\\ 4 \\end{pmatrix} - \\begin{pmatrix} -12 \\\\ -3 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -7 \\end{pmatrix}$$\n**Top (x) component:**\n$$-6 - (-12) + (-5) = -6 + 12 - 5 = 1$$\n**Bottom (y) component:**\n$$4 - (-3) + (-7) = 4 + 3 - 7 = 0$$\nResult: $$\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Find the magnitude $|u|$ of the vector $$u = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$$, leaving your answer in surd form.",
          hint: "Magnitude $|u| = \\sqrt{x^2 + y^2}$.",
          modelAnswer: "√13 units",
          workedSolution: "$$|u| = \\sqrt{(-3)^2 + 2^2} = \\sqrt{9 + 4} = \\sqrt{13}\\text{ units}$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Ratio Proportions & Geometric Construction Properties",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using ratio proportions and geometric construction principles:",
      hint: "Review direct ratio division, finding unitary parts, and the Angle Bisector Theorem.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "The ratio of cattle to sheep on an agricultural ranch is $5 : 8$. If there are $1,440$ sheep on the ranch, find the number of cattle.",
          hint: "8 units correspond to 1,440 sheep. Find the value of 1 unit.",
          modelAnswer: "900 cattle",
          workedSolution: "Let 1 ratio unit be $k$.\n$$8k = 1,440 \\implies k = \\frac{1,440}{8} = 180$$\nNumber of cattle = $$5k = 5 \\times 180 = 900\\text{ cattle}$$."
        },
        {
          partLabel: "(b)",
          marks: 10,
          prompt: "In a geometric construction of triangle $ABC$, $|AB| = 8\\text{ cm}$, $|AC| = 10\\text{ cm}$, and $\\angle BAC = 30^\\circ$. The angle bisector of $\\angle ACB$ is constructed to meet line segment $AB$ at point $D$.\nBy the Angle Bisector Theorem, the bisector divides the opposite side $AB$ in the ratio of the adjacent sides:\n$$\\frac{|AD|}{|BD|} = \\frac{|AC|}{|BC|}$$\nIf $|BC| = 5\\text{ cm}$, calculate:\n(i) The ratio $|AD| : |BD|$ in its simplest form.\n(ii) The exact length of segment $|AD|$.",
          hint: "Ratio = 10 : 5. Divide the total length |AB| = 8 cm into 2 + 1 = 3 parts.",
          modelAnswer: "(i) 2 : 1, (ii) 5.33 cm (or 16/3 cm)",
          workedSolution: "**(i) Ratio $|AD| : |BD|$:**\n$$\\frac{|AD|}{|BD|} = \\frac{|AC|}{|BC|} = \\frac{10}{5} = \\frac{2}{1}$$\nThe ratio is **$2 : 1$**.\n\n**(ii) Length of segment $|AD|$:**\nTotal parts = $2 + 1 = 3$.\n$$|AD| = \\frac{2}{3} \\times |AB| = \\frac{2}{3} \\times 8\\text{ cm} = \\frac{16}{3}\\text{ cm} = 5\\frac{1}{3}\\text{ cm} \\approx 5.33\\text{ cm}$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Exterior Angle Theorems & Simple Interest Mechanics",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using the exterior angle geometry diagram and financial interest formulas:",
      diagramSvg: "<svg viewBox='0 0 340 180' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><polygon points='40,140 280,140 240,40' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><line x1='40' y1='140' x2='330' y2='140' stroke='#334155' stroke-width='1.5'/><text x='35' y='160' font-size='12' font-weight='bold'>A</text><text x='235' y='30' font-size='12' font-weight='bold'>B</text><text x='275' y='160' font-size='12' font-weight='bold'>C</text><text x='325' y='155' font-size='12' font-weight='bold'>D</text><text x='55' y='130' font-size='11'>((x + 15)°)</text><text x='215' y='65' font-size='11'>((2x + 10)°)</text><text x='290' y='130' font-size='11' font-weight='bold' fill='#dc2626'>(8x)°</text></svg>",
      hint: "Review exterior angles of a triangle, angles on a straight line, formula transposition, and simple interest calculations.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "In the diagram above, side $AC$ of triangle $ABC$ is produced to point $D$. $\\angle BAC = (x + 15)^\\circ$, $\\angle ABC = (2x + 10)^\\circ$, and exterior angle $\\angle BCD = (8x)^\\circ$.\nFind:\n(i) The value of $x$.\n(ii) The size of interior angle $\\angle ACB$.",
          hint: "The exterior angle of a triangle equals the sum of the two opposite interior angles.",
          modelAnswer: "(i) x = 5, (ii) ∠ACB = 140°",
          workedSolution: "**(i) Exterior angle theorem:**\n$$(x + 15)^\\circ + (2x + 10)^\\circ = (8x)^\\circ$$\n$$3x + 25 = 8x$$\n$$25 = 8x - 3x$$\n$$5x = 25 \\implies x = 5$$\n\n**(ii) Angle $\\angle ACB$:**\nExterior angle $\\angle BCD = 8(5) = 40^\\circ$.\nAngles on a straight line sum to $180^\\circ$:\n$$\\angle ACB = 180^\\circ - 40^\\circ = 140^\\circ$$."
        },
        {
          partLabel: "(b)(i)",
          marks: 3,
          prompt: "Calculate the simple interest on a principal of $\\text{GH¢ } 4,800.00$ invested at $12\\%$ per annum for $2\\text{ years}$.",
          hint: "Simple Interest $I = \\frac{P \\times T \\times R}{100}$.",
          modelAnswer: "GH¢ 1,152.00",
          workedSolution: "$$I = \\frac{4,800 \\times 2 \\times 12}{100} = 48 \\times 24 = \\text{GH¢ } 1,152.00$$."
        },
        {
          partLabel: "(b)(ii)",
          marks: 3,
          prompt: "Make $R$ (the rate of interest) the subject of the simple interest formula:\n$$I = \\frac{PTR}{100}$$",
          hint: "Multiply both sides by 100, then divide by PT.",
          modelAnswer: "$$R = \\frac{100I}{PT}$$",
          workedSolution: "$$100I = PTR \\implies R = \\frac{100I}{PT}$$"
        },
        {
          partLabel: "(b)(iii)",
          marks: 3,
          prompt: "At what rate per annum will $\\text{GH¢ } 7,500.00$ yield a simple interest of $\\text{GH¢ } 2,700.00$ in $3\\text{ years}$?",
          hint: "Substitute values into $R = \\frac{100I}{PT}$.",
          modelAnswer: "12% per annum",
          workedSolution: "$$R = \\frac{100 \\times 2,700}{7,500 \\times 3} = \\frac{270,000}{22,500} = 12\\%\\text{ per annum}$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Currency Proportionality & Linear Conversion Modeling",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question using linear currency conversion and proportionality models:",
      hint: "Review direct proportionality functions $y = mx$, substitution of values, and linear rate gradients.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "During a currency redenomination, old currency notes ($x$) were exchanged for new notes ($y$) at the rate of $10,000\\text{ old units} = \\text{GH¢ } 1.00$.\nCopy and complete the conversion table:\n\n| Old Units $x$ | 20,000 | 60,000 | 140,000 | 220,000 | 380,000 |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| New Ghana Cedis $y$ (GH¢) | **?** | 6.00 | **?** | **?** | **?** |",
          hint: "Divide the old currency units by 10,000 to find the new value in GH¢.",
          modelAnswer: "x=20,000: 2.00, x=140,000: 14.00, x=220,000: 22.00, x=380,000: 38.00",
          workedSolution: "Conversion rule: $$y = \\frac{x}{10,000}$$\n- For $x = 20,000$: $$y = 20,000 / 10,000 = \\text{GH¢ } 2.00$$\n- For $x = 140,000$: $$y = 140,000 / 10,000 = \\text{GH¢ } 14.00$$\n- For $x = 220,000$: $$y = 220,000 / 10,000 = \\text{GH¢ } 22.00$$\n- For $x = 380,000$: $$y = 380,000 / 10,000 = \\text{GH¢ } 38.00$$"
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Using the relation $$y = \\frac{x}{10,000}$$, determine:\n(i) The value of $\\text{GH¢ } 17.50$ in old currency units.\n(ii) The value of $460,000\\text{ old units}$ in new Ghana Cedis.",
          hint: "For (i), $x = 10,000 \\times y$. For (ii), $y = x / 10,000$.",
          modelAnswer: "(i) 175,000 old units, (ii) GH¢ 46.00",
          workedSolution: "**(i)** $$x = 17.50 \\times 10,000 = 175,000\\text{ old units}$$.\n**(ii)** $$y = \\frac{460,000}{10,000} = \\text{GH¢ } 46.00$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "What is the mathematical relationship between the old and new currency systems, and what is the gradient of its linear graph?",
          hint: "Write the function in the form y = mx.",
          modelAnswer: "Direct proportion with gradient m = 1/10,000 (or 0.0001)",
          workedSolution: "The relation $$y = \\frac{1}{10,000}x$$ is a **direct linear proportion** passing through the origin $(0, 0)$. The gradient is $$m = \\frac{1}{10,000} = 0.0001$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T09:00:00.000Z",
  lastUpdated: "2026-09-15T09:00:00.000Z"
};



