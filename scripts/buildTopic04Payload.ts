import * as fs from 'fs';
import * as path from 'path';

const originalPath = path.join(__dirname, 'payloads', 'topics', 'topic_ratio_proportion_financial.json');
const original = JSON.parse(fs.readFileSync(originalPath, 'utf-8'));

// 5-Pillar Scaffolded Pedagogical Notes & Worked Examples

const b7Notes = `### 1. Intuitive Hook: The Market Stall & Paint Mixing Dilemma

Imagine mixing a signature green paint for a school building in Tamale. The master painter combines $3\\text{ tins of yellow}$ with every $2\\text{ tins of blue}$. If an apprentice accidentally pours in $4\\text{ tins of blue}$, the shade turns dark teal, ruining the uniform finish! Similarly, when two traders, Ama and Kwesi, invest $\\text{GH¢ } 600.00$ and $\\text{GH¢ } 400.00$ to buy a sack of onions, splitting the profit $50-50$ would be unfair to Ama. 

Mathematics gives us **ratios** and **rates** to quantify relative proportions and distribute quantities fairly based on contributions.

---

### 2. The Mental Model: Ratios vs. Rates & Unit Homogenization

* **Ratio ($a : b$ or $\\frac{a}{b}$):** A direct comparison between two quantities of the **same physical dimension and units**. Because the units cancel out, a ratio is a pure, dimensionless number.
* **Rate ($\\frac{\\text{Quantity } A}{\\text{Quantity } B}$):** A comparison of two quantities measured in **different units** (e.g., speed in $\\text{km/h}$, consumption in $\\text{km/l}$, price rate in $\\text{GH¢/kg}$).

#### The Golden Unit Homogenization Rule
> **Rule:** Never simplify a ratio until all terms share the identical unit of measurement!
> * *Wrong:* $50\\text{ pesewas} : \\text{GH¢ } 2.00 = 50 : 2 = 25 : 1$ (Fatal error!).
> * *Correct:* Convert $\\text{GH¢ } 2.00$ to $200\\text{ pesewas}$. Ratio $= 50 : 200 = \\frac{50}{200} = \\mathbf{1 : 4}$.

<details>
<summary>🔍 <b>Self-Check Challenge: Fast Unit Homogenization</b> (Click to test yourself)</summary>

> **Question:** Express $45\\text{ minutes}$ to $2\\text{ hours}$ as a simplified ratio in lowest terms.
>
> **Step-by-Step Explanation:**
> 1. Harmonize units to minutes: $2\\text{ hours} = 2 \\times 60 = 120\\text{ minutes}$.
> 2. Formulate ratio: $45 : 120$.
> 3. Divide by $\\text{HCF}(45, 120) = 15$:
>    $$\\frac{45 \\div 15}{120 \\div 15} = \\frac{3}{8} = \\mathbf{3 : 8}$$
</details>

---

### 3. Step-by-Step Breakdown: Partitioning Quantities into Multi-Part Ratios

To divide a total quantity $T$ among entities in the ratio $a : b : c$:

1. **Step 1 (Find Total Parts):** Add all ratio terms together:
   $$S = a + b + c$$
2. **Step 2 (Determine Unit Value / 1 Part):** Divide total quantity by total parts:
   $$\\text{Value of } 1\\text{ Part} = \\frac{T}{S}$$
3. **Step 3 (Calculate Individual Shares):** Multiply each entity's ratio number by the unit value:
   $$\\text{Share } A = a \\times \\left(\\frac{T}{S}\\right), \\quad \\text{Share } B = b \\times \\left(\\frac{T}{S}\\right), \\quad \\text{Share } C = c \\times \\left(\\frac{T}{S}\\right)$$

<details>
<summary>⚠️ <b>Common Exam Trap: Difference Given vs Total Given</b> (Click to inspect)</summary>

> **The Trap:** When an exam problem states: *"Kofi and Ama shared money in the ratio $3 : 5$. Ama received $\\text{GH¢ } 40.00$ more than Kofi. Find the total money."*
> * **Common Mistake:** Learners divide $40$ by $3 + 5 = 8$. This is WRONG because $40$ is NOT the total sum!
> * **Correct Approach:** $\\text{Difference in parts} = 5 - 3 = 2\\text{ parts}$.
>   $$2\\text{ parts} = \\text{GH¢ } 40.00 \\implies 1\\text{ part} = \\frac{40}{2} = \\text{GH¢ } 20.00$$
>   $$\\text{Total money} = (3 + 5) \\times 20 = 8 \\times 20 = \\mathbf{\\text{GH¢ } 160.00}$$
</details>

---

### 4. Percentage as a Specialized Rate per Hundred

A percentage is simply a ratio whose denominator is fixed at $100$.
* **Discount Calculation:**
  $$\\text{Selling Price} = \\text{Marked Price} \\times \\left(1 - \\frac{\\text{Discount } \\%}{100}\\right)$$
* **Reverse Discount (Finding Marked Price):**
  $$\\text{Marked Price} = \\frac{\\text{Selling Price}}{1 - \\frac{\\text{Discount } \\%}{100}}$$`;

const b7WorkedExamples = [
  {
    id: "we_b7_01",
    title: "Simplifying Unit Rates in Production & Baking",
    indicator: "B7.1.4.1.2",
    problem: "A bakery in Kumasi uses $750\\text{ grams}$ of margarine and $1.5\\text{ kilograms}$ of flour to bake a batch of butter bread. (a) Express the ratio of margarine to flour in lowest terms. (b) Find the unit rate of flour required per kilogram of margarine.",
    steps: [
      "Step 1 (Why we do this: Homogenize units to grams so that terms are directly comparable): Convert $1.5\\text{ kg}$ to grams: $1.5 \\times 1000\\text{ g} = 1500\\text{ g}$.",
      "Step 2 (Why we do this: Form the ratio and divide by the Highest Common Factor): Write $\\frac{750}{1500}$. Divide both numerator and denominator by $\\text{HCF} = 750$:\n  $$\\frac{750 \\div 750}{1500 \\div 750} = \\frac{1}{2} = 1 : 2$$",
      "Step 3 (Why we do this: Calculate unit rate of flour per unit of margarine): Divide total flour by total margarine in kilograms:\n  $$\\text{Unit Rate} = \\frac{1.5\\text{ kg flour}}{0.75\\text{ kg margarine}} = \\frac{1.5 \\times 4}{3} = 2\\text{ kg of flour per kg of margarine}$$"
    ],
    finalAnswer: "(a) $$1 : 2$$, \\quad (b) $$2\\text{ kg of flour per kg of margarine}$$"
  },
  {
    id: "we_b7_02",
    title: "Multi-Person Ratio Sharing with Unknown Total",
    indicator: "B7.1.4.1.3",
    problem: "Three siblings, Esi, Kojo, and Adwoa, shared an inheritance from their grandmother in the ratio $3 : 5 : 7$. If Adwoa received $\\text{GH¢ } 1,600.00$ more than Esi, calculate: (a) the value of one ratio part, (b) Kojo's share, and (c) the total amount shared.",
    steps: [
      "Step 1 (Why we do this: Relate the given monetary difference to the difference in ratio parts): Compare Adwoa's parts (7) with Esi's parts (3):\n  $$\\text{Difference in parts} = 7 - 3 = 4\\text{ parts}$$",
      "Step 2 (Why we do this: Find the value of 1 ratio part by dividing the excess amount by the excess parts): \n  $$4\\text{ parts} = \\text{GH¢ } 1,600.00 \\implies 1\\text{ part} = \\frac{1600}{4} = \\text{GH¢ } 400.00$$",
      "Step 3 (Why we do this: Compute Kojo's share using his allocated 5 parts): \n  $$\\text{Kojo's Share} = 5 \\times 400 = \\text{GH¢ } 2,000.00$$",
      "Step 4 (Why we do this: Sum all parts to find the total estate value): Total parts $= 3 + 5 + 7 = 15\\text{ parts}$.\n  $$\\text{Total Estate} = 15 \\times 400 = \\text{GH¢ } 6,000.00$$"
    ],
    finalAnswer: "(a) $$\\text{GH¢ } 400.00$$, \\quad (b) $$\\text{GH¢ } 2,000.00$$, \\quad (c) $$\\text{GH¢ } 6,000.00$$"
  },
  {
    id: "we_b7_03",
    title: "Reverse Percentage Discount & Cost Reconstruction",
    indicator: "B7.1.4.1.5",
    problem: "During an end-of-year clearance sale at a boutique in Accra, a student bought a school blazer for $\\text{GH¢ } 240.00$ after a $20\\%$ discount was deducted from the marked price. Determine the original marked price of the blazer.",
    steps: [
      "Step 1 (Why we do this: Determine what percentage of the original price the customer actually paid): \n  $$\\text{Paid Percentage} = 100\\% - 20\\% = 80\\%$$",
      "Step 2 (Why we do this: Set up a linear algebraic proportion where 80% corresponds to GH¢ 240.00): \n  $$0.80 \\times M = 240 \\quad \\text{or} \\quad \\frac{80}{100} \\times M = 240$$",
      "Step 3 (Why we do this: Solve for the unknown Marked Price M using reciprocal multiplication): \n  $$M = 240 \\times \\frac{100}{80} = 240 \\times \\frac{5}{4} = 60 \\times 5 = \\text{GH¢ } 300.00$$"
    ],
    finalAnswer: "$$\\text{Original Marked Price} = \\text{GH¢ } 300.00$$"
  }
];

const b8Notes = `### 1. Intuitive Hook: The Fuel Economy & Architectural Blueprints

When driving from Accra to Cape Coast ($150\\text{ km}$), a private vehicle consumes $12.5\\text{ litres}$ of petrol. If the driver continues onward to Takoradi ($225\\text{ km}$), does the car require more or less fuel? Of course, more! If distance is multiplied by $1.5$, the fuel needed is also multiplied by $1.5$. This is **direct proportion**: two variables increase or decrease by the exact same multiplier.

Similarly, an architect drawing a plan for a hospital cannot fit a $40\\text{ metre}$ building on an A4 sheet. She scales the dimensions down uniformly using a **scale factor** ($1 : 200$), ensuring every wall and doorway retains its exact proportional geometry.

---

### 2. The Mental Model: Constant of Proportionality ($k$)

When two variables $y$ and $x$ are directly proportional ($y \\propto x$):
1. **The Algebraic Relation:**
   $$y = kx \\quad \\iff \\quad k = \\frac{y}{x}$$
   where $k$ is a non-zero fixed numerical constant called the **constant of proportionality**.
2. **The Graphical Invariance:**
   The Cartesian graph of any direct proportion is **strictly a straight line passing through the origin $(0, 0)$**. The gradient/slope of the line is precisely equal to $k$.

<details>
<summary>🔍 <b>Self-Check Challenge: Finding k & Predicting Values</b> (Click to test yourself)</summary>

> **Question:** If the cost $C$ of rice is directly proportional to weight $w$, and $8\\text{ kg}$ costs $\\text{GH¢ } 72.00$, find: (a) the constant $k$, and (b) the cost of $15\\text{ kg}$.
>
> **Step-by-Step Explanation:**
> 1. Calculate constant $k$: $k = \\frac{C}{w} = \\frac{72}{8} = \\mathbf{9}$ (The unit price is $\\text{GH¢ } 9.00\\text{ per kg}$).
> 2. Form formula: $C = 9w$.
> 3. Predict for $w = 15\\text{ kg}$: $C = 9 \\times 15 = \\mathbf{\\text{GH¢ } 135.00}$.
</details>

---

### 3. Map Scales & Linear vs. Area Scale Factor

A representative fraction (map scale) $1 : n$ means that **$1\\text{ unit on the map}$ corresponds to $n\\text{ units on the actual ground}$**.

* **Metric Length Conversion Bridge:**
  $$\\text{Centimetres (cm)} \\xrightarrow{\\div 100} \\text{Metres (m)} \\xrightarrow{\\div 1000} \\text{Kilometres (km)}$$
  $$\\text{Direct Shortcut: } 1\\text{ km} = 100,000\\text{ cm} \\implies \\text{Divide by } 100,000$$

<details>
<summary>⚠️ <b>Common Exam Trap: The Area Scale Factor Square Trap</b> (Click to inspect)</summary>

> **The Trap:** On a map with scale $1 : 50,000$, a forest reserve has an area of $4\\text{ cm}^2$. What is its actual ground area in $\\text{km}^2$?
> * **Common Mistake:** Students multiply $4$ by $50,000$ or convert $50,000\\text{ cm}$ to $0.5\\text{ km}$ and multiply $4 \\times 0.5 = 2\\text{ km}^2$. This is FATAL!
> * **The Mathematical Rule:** Linear Scale Factor $= k \\implies \\text{Area Scale Factor} = \\mathbf{k^2}$!
> * **Correct Solution:**
>   - $1\\text{ cm on map} = 50,000\\text{ cm} = 0.5\\text{ km}$ on ground.
>   - Square both sides: $1\\text{ cm}^2\\text{ on map} = (0.5\\text{ km})^2 = \\mathbf{0.25\\text{ km}^2}$.
>   - $\\text{Actual ground area} = 4 \\times 0.25 = \\mathbf{1.0\\text{ km}^2}$.
</details>

---

### 4. Travel Graphs: Distance-Time & Speed Kinematics

$$\\text{Average Speed} = \\frac{\\text{Total Distance Covered}}{\\text{Total Time Taken}}$$

* **Slope / Gradient:** On a Distance-Time graph, $\\text{Gradient} = \\frac{\\Delta \\text{Distance}}{\\Delta \\text{Time}} = \\mathbf{\\text{Speed}}$.
* **Flat Horizontal Line:** Indicates that time is passing while distance remains unchanged $\\implies$ **The vehicle is stationary / resting**.`;

const b8WorkedExamples = [
  {
    id: "we_b8_01",
    title: "Direct Proportionality Formula & Predictive Modeling",
    indicator: "B8.1.4.1.2",
    problem: "The electrical resistance $R$ of a copper wire is directly proportional to its length $L$. A wire of length $40\\text{ metres}$ has a resistance of $6.4\\text{ ohms}$. (a) Find the constant of proportionality and the formula connecting $R$ and $L$. (b) Calculate the resistance of a $125\\text{ metre}$ wire of the same type.",
    steps: [
      "Step 1 (Why we do this: State the proportionality relationship algebraically): Write $R = kL$, where $k$ is the constant of proportionality.",
      "Step 2 (Why we do this: Substitute known boundary conditions to isolate k): \n  $$6.4 = k \\times 40 \\implies k = \\frac{6.4}{40} = \\frac{64}{400} = 0.16\\text{ ohms/metre}$$",
      "Step 3 (Why we do this: State the formal governing predictive equation): \n  $$R = 0.16L$$",
      "Step 4 (Why we do this: Use the formula to predict the value for L = 125 m): \n  $$R = 0.16 \\times 125 = \\frac{16}{100} \\times 125 = \\frac{4}{25} \\times 125 = 4 \\times 5 = 20\\text{ ohms}$$"
    ],
    finalAnswer: "(a) $$k = 0.16, \\quad R = 0.16L$$, \\quad (b) $$R = 20\\text{ ohms}$$"
  },
  {
    id: "we_b8_02",
    title: "Map Scale Ground Distance & Regional Area Calculation",
    indicator: "B8.1.4.1.4",
    problem: "A survey map of the Greater Accra Region is drawn to a scale of $1 : 50,000$. (a) If the distance between two highway junctions on the map is $18.4\\text{ cm}$, find the actual ground distance in kilometres. (b) A community sports complex occupies $6\\text{ cm}^2$ on this map. Calculate its real ground area in square kilometres.",
    steps: [
      "Step 1 (Why we do this: Calculate real ground length in centimetres): Multiply map distance by the scale ratio:\n  $$\\text{Ground Distance} = 18.4 \\times 50,000 = 920,000\\text{ cm}$$",
      "Step 2 (Why we do this: Convert centimetres directly to kilometres by dividing by 100,000): \n  $$\\text{Distance in km} = \\frac{920,000}{100,000} = 9.2\\text{ km}$$",
      "Step 3 (Why we do this: Apply the Area Scale Factor k^2 to avoid linear conversion errors): \n  $$1\\text{ cm} = 0.5\\text{ km} \\implies 1\\text{ cm}^2 = (0.5\\text{ km})^2 = 0.25\\text{ km}^2$$",
      "Step 4 (Why we do this: Compute total ground area): \n  $$\\text{Real Area} = 6 \\times 0.25\\text{ km}^2 = 1.5\\text{ km}^2$$"
    ],
    finalAnswer: "(a) $$9.2\\text{ km}$$, \\quad (b) $$1.5\\text{ km}^2$$"
  },
  {
    id: "we_b8_03",
    title: "Multi-Stage Journey Average Speed & Travel Graph Analysis",
    indicator: "B8.1.4.1.5",
    problem: "A delivery van departed from a depot and traveled $90\\text{ km}$ in $1\\text{ hour } 30\\text{ minutes}$. The driver rested for $30\\text{ minutes}$ to unload packages, and then drove another $60\\text{ km}$ in $1\\text{ hour}$. Calculate: (a) the speed of the van during the first stage, and (b) the overall average speed for the entire journey including the rest stop.",
    steps: [
      "Step 1 (Why we do this: Convert time intervals into decimal hours for rigorous rate arithmetic): \n  * Stage 1 Time: $1\\text{ h } 30\\text{ min} = 1.5\\text{ hours}$.\n  * Rest Stop Time: $30\\text{ min} = 0.5\\text{ hours}$.\n  * Stage 2 Time: $1.0\\text{ hour}$.",
      "Step 2 (Why we do this: Compute stage 1 cruising speed): \n  $$\\text{Speed}_1 = \\frac{\\text{Distance}_1}{\\text{Time}_1} = \\frac{90}{1.5} = 60\\text{ km/h}$$",
      "Step 3 (Why we do this: Determine aggregate journey metrics for total average speed): \n  $$\\text{Total Distance} = 90 + 0 + 60 = 150\\text{ km}$$\n  $$\\text{Total Journey Duration} = 1.5 + 0.5 + 1.0 = 3.0\\text{ hours}$$",
      "Step 4 (Why we do this: Divide total distance by total elapsed time): \n  $$\\text{Overall Average Speed} = \\frac{150\\text{ km}}{3.0\\text{ hours}} = 50\\text{ km/h}$$"
    ],
    finalAnswer: "(a) $$60\\text{ km/h}$$, \\quad (b) $$50\\text{ km/h}$$"
  }
];

const b9Notes = `### 1. Intuitive Hook: The Building Site & Financial Reality

Suppose 6 masons can lay the foundation blocks for a community clinic in 10 days. If the project manager hires 6 more masons (making 12 workers of equal skill), will the job take 20 days? Absolutely not! More hands finish the job faster, so 12 workers will finish in 5 days! 

When one quantity doubles and the other halves, their relationship is **inverse proportion**.

In commercial life, money also changes value over time. If you deposit $\\text{GH¢ } 5,000.00$ in a bank savings bond, you earn **simple interest** for lending your capital. Conversely, when purchasing equipment or vehicles, their market worth diminishes annually through **compound depreciation**, and every formal invoice includes national development levies (**VAT**, **NHIL**, and **GETFund**).

---

### 2. The Mental Model: Inverse Proportion & The Invariant Product ($k$)

When two quantities $x$ and $y$ vary inversely ($y \\propto \\frac{1}{x}$):
1. **The Invariant Constant Product Rule:**
   $$y = \\frac{k}{x} \\quad \\iff \\quad x \\times y = k$$
   As $x$ increases, $y$ decreases proportionately such that **their product is always constant**.
2. **Two-State Equivalence Formula:**
   $$x_1 y_1 = x_2 y_2$$
3. **The Worker-Day (Man-Day) Conservation Principle:**
   $$\\text{Total Workload} = \\text{Number of Workers} \\times \\text{Number of Days} = \\text{Constant Worker-Days}$$

<details>
<summary>🔍 <b>Self-Check Challenge: Worker-Day Rapid Calculation</b> (Click to test yourself)</summary>

> **Question:** If 8 excavators can clear an access road in 15 days, how many days will 10 excavators take working at the same pace?
>
> **Step-by-Step Explanation:**
> 1. Calculate total machine-days required: $8 \\times 15 = 120\\text{ machine-days}$.
> 2. Let $D$ be the required days for 10 excavators: $10 \\times D = 120$.
> 3. Solve for $D$: $D = \\frac{120}{10} = \\mathbf{12\\text{ days}}$.
</details>

<details>
<summary>⚠️ <b>Common Exam Trap: Direct vs. Inverse Cross-Multiplication</b> (Click to inspect)</summary>

> **The Trap:** In an inverse problem, cross-multiplying directly leads to a backwards answer!
> * *Wrong:* $\\frac{8}{15} = \\frac{10}{D} \\implies D = \\frac{15 \\times 10}{8} = 18.75\\text{ days}$ (Adding more excavators took longer!).
> * *Correct:* Set product equal: $8 \\times 15 = 10 \\times D \\implies D = \\mathbf{12\\text{ days}}$.
</details>

---

### 3. Simple Interest & Capital Financing

$$I = \\frac{P \\times R \\times T}{100}, \\qquad A = P + I = P\\left(1 + \\frac{RT}{100}\\right)$$

* $P = \\text{Principal (Initial capital deposited or borrowed)}$
* $R = \\text{Annual rate of interest (\\%)}$
* $T = \\text{Time in YEARS}$
  > **Crucial Rule:** If time is given in months, divide by $12$: $T = \\frac{\\text{months}}{12}$. If given in days, $T = \\frac{\\text{days}}{365}$.

---

### 4. Commercial Mathematics: VAT, Levies & Compound Depreciation

* **Statutory Taxes on Invoices:**
  $$\\text{Total Tax} = \\text{Net Value} \\times (\\text{VAT}\\% + \\text{NHIL}\\% + \\text{GETFund}\\%)$$
  $$\\text{Gross Amount Payable} = \\text{Net Value} + \\text{Total Tax}$$
* **Compound Depreciation Formula:**
  When an asset depreciates at an annual rate of $r\\%$ over $n$ years:
  $$V_n = P\\left(1 - \\frac{r}{100}\\right)^n$$`;

const b9WorkedExamples = [
  {
    id: "we_b9_01",
    title: "Worker-Day Inverse Allocation with Early Resignation",
    indicator: "B9.1.4.1.1",
    problem: "A contractor engaged 15 artisans to renovate a school block in 12 days. After working together for 4 days, 5 artisans left for another project. How many additional days will the remaining artisans take to complete the renovation?",
    steps: [
      "Step 1 (Why we do this: Compute the total work budget in man-days): \n  $$\\text{Total Project Budget} = 15 \\times 12 = 180\\text{ man-days}$$",
      "Step 2 (Why we do this: Calculate work accomplished during the first 4 days): \n  $$\\text{Work Completed} = 15\\text{ artisans} \\times 4\\text{ days} = 60\\text{ man-days}$$",
      "Step 3 (Why we do this: Determine remaining deficit of work): \n  $$\\text{Remaining Work} = 180 - 60 = 120\\text{ man-days}$$",
      "Step 4 (Why we do this: Determine active labor force count): \n  $$\\text{Remaining Artisans} = 15 - 5 = 10\\text{ artisans}$$",
      "Step 5 (Why we do this: Divide remaining work by active workforce to find required extra days): \n  $$\\text{Additional Days } D = \\frac{120\\text{ man-days}}{10\\text{ artisans}} = 12\\text{ days}$$"
    ],
    finalAnswer: "$$\\text{Additional Days Required} = 12\\text{ days}$$"
  },
  {
    id: "we_b9_02",
    title: "Simple Interest Loan Repayment & Reverse Principal Finding",
    indicator: "B9.1.4.1.2",
    problem: "A farmer secured a seasonal agricultural loan at an annual simple interest rate of $12\\%$. At the end of $2\\text{ years and } 6\\text{ months}$, he repaid a total amount of $\\text{GH¢ } 10,400.00$ to clear both the principal and accrued interest. Calculate: (a) the original principal borrowed, and (b) the total interest paid.",
    steps: [
      "Step 1 (Why we do this: Convert mixed time interval strictly into years): \n  $$T = 2\\text{ years} + \\frac{6}{12}\\text{ year} = 2.5\\text{ years}$$",
      "Step 2 (Why we do this: Express total repayment amount A as a linear function of principal P): \n  $$A = P + I = P + \\frac{P \\times R \\times T}{100} = P\\left(1 + \\frac{12 \\times 2.5}{100}\\right)$$",
      "Step 3 (Why we do this: Evaluate the interest multiplier): \n  $$12 \\times 2.5 = 30 \\implies A = P\\left(1 + \\frac{30}{100}\\right) = 1.30 P$$",
      "Step 4 (Why we do this: Equate to the actual cash repayment of GH¢ 10,400.00 and solve for P): \n  $$1.30 P = 10,400 \\implies P = \\frac{10,400}{1.30} = \\frac{104,000}{13} = \\text{GH¢ } 8,000.00$$",
      "Step 5 (Why we do this: Subtract principal from total amount to isolate interest): \n  $$I = 10,400 - 8,000 = \\text{GH¢ } 2,400.00$$"
    ],
    finalAnswer: "(a) $$\\text{Principal } P = \\text{GH¢ } 8,000.00$$, \\quad (b) $$\\text{Interest } I = \\text{GH¢ } 2,400.00$$"
  },
  {
    id: "we_b9_03",
    title: "Commercial Invoice with VAT, Levies & Compound Depreciation",
    indicator: "B9.1.4.1.3",
    problem: "A school purchased an institutional printer. The supplier quoted a net price of $\\text{GH¢ } 16,000.00$ before statutory taxes: VAT at $15\\%$, NHIL at $2.5\\%$, and GETFund at $2.5\\%$. (a) Calculate the total gross amount paid on the invoice. (b) If the printer depreciates at a compound rate of $10\\%$ per annum, calculate its residual book value after $2\\text{ years}$.",
    steps: [
      "Step 1 (Why we do this: Sum the effective tax rates applied to the net taxable supply): \n  $$\\text{Total Tax Rate} = 15\\% + 2.5\\% + 2.5\\% = 20\\%$$",
      "Step 2 (Why we do this: Compute the total tax levy): \n  $$\\text{Tax Amount} = 0.20 \\times 16,000 = \\text{GH¢ } 3,200.00$$",
      "Step 3 (Why we do this: Add tax to net supply to get gross invoice price): \n  $$\\text{Gross Invoice} = 16,000 + 3,200 = \\text{GH¢ } 19,200.00$$",
      "Step 4 (Why we do this: Apply the compound depreciation formula on the purchase price over 2 years): \n  $$V_2 = P\\left(1 - \\frac{r}{100}\\right)^2 = 16,000 \\times (1 - 0.10)^2 = 16,000 \\times (0.90)^2$$\n  $$V_2 = 16,000 \\times 0.81 = \\text{GH¢ } 12,960.00$$"
    ],
    finalAnswer: "(a) $$\\text{Gross Invoice} = \\text{GH¢ } 19,200.00$$, \\quad (b) $$\\text{Book Value after 2 years} = \\text{GH¢ } 12,960.00$$"
  }
];

// Update payload
const updated = {
  ...original,
  id: "topic_ratio_proportion_financial",
  topicId: "ratio_proportion_financial",
  topicSlug: "ratio_proportion_financial",
  title: "Ratio, Proportion & Financial Math",
  version: 3,
  updatedAt: new Date().toISOString(),
  levels: {
    ...original.levels,
    b7: {
      ...original.levels.b7,
      notes: b7Notes,
      workedExamples: b7WorkedExamples,
    },
    b8: {
      ...original.levels.b8,
      notes: b8Notes,
      workedExamples: b8WorkedExamples,
    },
    b9: {
      ...original.levels.b9,
      notes: b9Notes,
      workedExamples: b9WorkedExamples,
    },
  }
};

// Mirror dual-level compatibility
updated.levels.jhs1 = updated.levels.b7;
updated.levels.jhs2 = updated.levels.b8;
updated.levels.jhs3 = updated.levels.b9;

// Save to both payload locations
const dest1 = path.join(__dirname, 'payloads', 'topic_ratio_proportion_financial.json');
const dest2 = path.join(__dirname, 'payloads', 'topics', 'topic_ratio_proportion_financial.json');

fs.writeFileSync(dest1, JSON.stringify(updated, null, 2), 'utf-8');
fs.writeFileSync(dest2, JSON.stringify(updated, null, 2), 'utf-8');

console.log('✅ Successfully built scaffolded Topic 04 payload to:');
console.log(' -', dest1);
console.log(' -', dest2);

const bytes = Buffer.byteLength(JSON.stringify(updated), 'utf8');
console.log(`Document Size: ${bytes} bytes (${(bytes / 1024).toFixed(2)} KB), ${(bytes / 1048576 * 100).toFixed(2)}% of 1 MiB cap.`);
