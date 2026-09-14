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
