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
