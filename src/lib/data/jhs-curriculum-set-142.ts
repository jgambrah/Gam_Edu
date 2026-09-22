/**
 * SET 142: BECE Integrated Science Mock 11 (Electricity, Electronics & Applied Technology Mastery)
 * Full Mock Examination Suite (Paper 1 Objective CBT + Paper 2 Theory & Practical)
 * Proprietary calibrated content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

const balancedMock11P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following electrical meters must be connected in series with an electrical component to measure the current flowing through it?",
    "options": [
      "Voltmeter",
      "Ammeter",
      "Ohmmeter",
      "Galvanometer"
    ],
    "correctAnswer": "Ammeter",
    "hint": "Has very low internal resistance so it does not restrict current flow.",
    "workedSolution": "An ammeter measures electric current in Amperes and must be connected in series so all current flows through it.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "An electric water heater rated at 2,400 W is connected across a 240 V mains supply. Calculate the electric current drawn by the heater.",
    "options": [
      "0.1 A",
      "10.0 A",
      "24.0 A",
      "100.0 A"
    ],
    "correctAnswer": "10.0 A",
    "hint": "Current I = Power / Voltage.",
    "workedSolution": "Current I = Power / Voltage = 2,400 W / 240 V = 10.0 Amperes.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Two identical 6.0 Ω resistors are connected in parallel across an electric circuit. What is their effective (combined) resistance?",
    "options": [
      "1.0 Ω",
      "3.0 Ω",
      "6.0 Ω",
      "12.0 Ω"
    ],
    "correctAnswer": "3.0 Ω",
    "hint": "For two equal parallel resistors: R_total = R / 2.",
    "workedSolution": "1/R_total = 1/6 + 1/6 = 2/6 = 1/3, meaning R_total = 3.0 Ω.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "In a modern domestic three-pin plug, what is the official international color of the protective Earth wire?",
    "options": [
      "Brown",
      "Green and yellow",
      "Blue",
      "Black"
    ],
    "correctAnswer": "Green and yellow",
    "hint": "Striped conductor connecting appliance chassis to ground.",
    "workedSolution": "The Earth wire is color-coded Green with Yellow stripes. Brown is Live and Blue is Neutral.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "An electronic component that stores electrical energy in the form of an electrostatic field between two conducting plates is a",
    "options": [
      "capacitor.",
      "resistor.",
      "inductor.",
      "diode."
    ],
    "correctAnswer": "capacitor.",
    "hint": "Consists of parallel metal plates separated by an insulator (dielectric).",
    "workedSolution": "A capacitor stores electric charge and electrostatic energy across its plates separated by a dielectric material.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "What happens to the electrical resistance of a Light Dependent Resistor (LDR) when bright sunlight falls on its active surface?",
    "options": [
      "It increases sharply.",
      "It decreases significantly.",
      "It drops to zero and stays zero.",
      "It remains completely unchanged."
    ],
    "correctAnswer": "It decreases significantly.",
    "hint": "Photons release charge carriers in cadmium sulfide material.",
    "workedSolution": "In an LDR, absorbed light energy excites charge carriers, dramatically lowering its electrical resistance.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "A television rated at 100 W is watched for 5 hours each evening. Calculate the electrical energy consumed over a 30-day month in kilowatt-hours (kWh).",
    "options": [
      "0.5 kWh",
      "5.0 kWh",
      "15.0 kWh",
      "150.0 kWh"
    ],
    "correctAnswer": "15.0 kWh",
    "hint": "Power = 0.1 kW; Daily energy = 0.5 kWh; Multiply by 30 days.",
    "workedSolution": "Power = 0.1 kW. Daily energy = 0.1 kW x 5 h = 0.5 kWh. Monthly energy = 0.5 kWh/day x 30 days = 15.0 kWh.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following practices is a dangerous consequence of illegal electrical connections in residential communities in Ghana?",
    "options": [
      "Automatic stabilization of neighborhood mains voltage",
      "Immediate reduction in overall household electricity consumption",
      "Frequent local transformer overload and fire outbreaks",
      "Elimination of power surges and lightning damage"
    ],
    "correctAnswer": "Frequent local transformer overload and fire outbreaks",
    "hint": "Unmetered excess current overheats distribution transformers and substandard cables.",
    "workedSolution": "Illegal connections draw unregulated, excessive current that overloads distribution transformers and causes insulation melting and fires.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "In an N-P-N transistor circuit symbol, the lead marked with an outward-pointing arrow is the",
    "options": [
      "collector.",
      "base.",
      "gate.",
      "emitter."
    ],
    "correctAnswer": "emitter.",
    "hint": "Emits majority charge carriers into the base.",
    "workedSolution": "In an N-P-N transistor symbol, the arrow is always placed on the emitter terminal, pointing outward in the direction of conventional current.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Why are domestic household lighting bulbs connected in parallel rather than in series?",
    "options": [
      "Each bulb operates independently at full mains voltage",
      "The total current in the circuit drops to zero",
      "If one bulb burns out, all other bulbs extinguish immediately",
      "The combined resistance of the home increases greatly"
    ],
    "correctAnswer": "Each bulb operates independently at full mains voltage",
    "hint": "Independent switching and constant 240 V potential difference.",
    "workedSolution": "Parallel wiring provides each branch with the full 240 V mains voltage and allows independent switching; if one bulb fails, others remain lit.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "A Light Emitting Diode (LED) connected to a direct-current battery lights up only when its longer terminal (anode) is connected to the",
    "options": [
      "positive terminal.",
      "negative terminal.",
      "earthed chassis.",
      "neutral wire."
    ],
    "correctAnswer": "positive terminal.",
    "hint": "Forward biasing requires anode to positive and cathode to negative.",
    "workedSolution": "An LED conducts and emits light only when forward-biased, meaning its longer lead (anode) connects to the positive terminal.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "What is the primary function of a fuse connected in the Live wire of an appliance plug?",
    "options": [
      "To melt and disconnect the circuit when current is excessive",
      "To step down supply voltage from 240 V to 12 V",
      "To convert alternating current into direct current",
      "To prevent electric current from flowing to the ground"
    ],
    "correctAnswer": "To melt and disconnect the circuit when current is excessive",
    "hint": "Contains an alloy wire that melts under overcurrent.",
    "workedSolution": "A fuse contains a low-melting-point wire that melts when current exceeds its rating, opening the circuit to prevent electrical fires.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "When electroplating an iron spoon with copper, the iron spoon must be connected as the",
    "options": [
      "anode (positive terminal).",
      "electrolyte solution.",
      "inert salt bridge.",
      "cathode (negative terminal)."
    ],
    "correctAnswer": "cathode (negative terminal).",
    "hint": "Positively charged copper cations (Cu²⁺) migrate to the negative electrode.",
    "workedSolution": "In electroplating, the object to be coated is made the cathode (negative electrode) so positive metal ions deposit evenly on its surface.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following electronic components is widely used in automatic street lighting systems to turn lights on at dusk?",
    "options": [
      "Light Dependent Resistor",
      "Step-up transformer",
      "Electrolytic capacitor",
      "Variable inductor"
    ],
    "correctAnswer": "Light Dependent Resistor",
    "hint": "An LDR whose high resistance in darkness triggers a transistor switch.",
    "workedSolution": "An LDR increases resistance in darkness, creating a voltage drop that switches on a transistor to activate streetlights automatically.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "An electric immersion heater of resistance 40 Ω draws a current of 5 A from the mains. Calculate the potential difference across the heater.",
    "options": [
      "8 V",
      "45 V",
      "200 V",
      "1000 V"
    ],
    "correctAnswer": "200 V",
    "hint": "Ohm's Law: V = I x R = 5 x 40.",
    "workedSolution": "By Ohm's Law: Potential difference V = I x R = 5 A x 40 Ω = 200 Volts.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which heavy metal found in discarded cathode ray tubes (CRT) and computer monitors poses a severe poisoning risk to soil and groundwater?",
    "options": [
      "Lead",
      "Iron",
      "Magnesium",
      "Potassium"
    ],
    "correctAnswer": "Lead",
    "hint": "A toxic heavy metal (Pb) used in radiation-shielding glass.",
    "workedSolution": "Old CRT monitors contain up to 2 kg of lead in their glass. When dumped in landfills, lead leaches into topsoil and water bodies.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "What is the S.I. base unit used for measuring electrical current?",
    "options": [
      "Volt",
      "Ampere",
      "Ohm",
      "Watt"
    ],
    "correctAnswer": "Ampere",
    "hint": "Symbolized as A and measured with an ammeter.",
    "workedSolution": "The Ampere (A) is the S.I. base unit of electric current. Volt measures potential difference, Ohm measures resistance, and Watt measures power.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which of the following electrical appliances converts electrical energy primarily into mechanical kinetic energy?",
    "options": [
      "Electric blender",
      "Electric toaster",
      "Electric kettle",
      "Filament bulb"
    ],
    "correctAnswer": "Electric blender",
    "hint": "Uses an electric motor to rotate sharp cutting blades.",
    "workedSolution": "An electric blender uses an electric motor to convert electrical energy into rotating mechanical kinetic energy. Toasters and kettles produce heat.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Why is a fixed resistor connected in series with an LED in a direct-current circuit?",
    "options": [
      "To increase the brightness of the LED indefinitely",
      "To reverse the polarity of the power supply",
      "To convert direct current into alternating current",
      "To limit current and protect the LED from burning out"
    ],
    "correctAnswer": "To limit current and protect the LED from burning out",
    "hint": "Prevents excessive current from destroying the semiconductor junction.",
    "workedSolution": "LEDs have very low internal resistance once conducting. A series resistor drops excess voltage and restricts current to safe levels (~20 mA).",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "In Ghana, what is the nominal root-mean-square mains alternating voltage supplied to domestic households by ECG?",
    "options": [
      "12 V",
      "110 V",
      "230 V",
      "415 V"
    ],
    "correctAnswer": "230 V",
    "hint": "Standard nominal single-phase voltage (standardized around 230 V to 240 V).",
    "workedSolution": "The standard domestic single-phase alternating supply in Ghana is nominally 230 V (ranging between 220 V and 240 V) at a frequency of 50 Hz.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which of the following actions demonstrates effective conservation of electrical energy in a home?",
    "options": [
      "Leaving electric water heaters on continuously day and night",
      "Replacing incandescent filament bulbs with energy-saving LED lamps",
      "Keeping refrigerator doors ajar to cool the kitchen air",
      "Using air conditioners with all room windows opened"
    ],
    "correctAnswer": "Replacing incandescent filament bulbs with energy-saving LED lamps",
    "hint": "LEDs convert over 80% of energy to light, whereas filaments waste 90% as heat.",
    "workedSolution": "LED lamps consume roughly 80% less electrical energy than incandescent filament bulbs for the same luminous output, saving power.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "A circuit has two resistors of 4.0 Ω and 6.0 Ω connected in series. What is the total effective resistance of the combination?",
    "options": [
      "2.4 Ω",
      "5.0 Ω",
      "10.0 Ω",
      "24.0 Ω"
    ],
    "correctAnswer": "10.0 Ω",
    "hint": "In series: R_total = R1 + R2.",
    "workedSolution": "In a series circuit, resistances add directly: R_total = 4.0 Ω + 6.0 Ω = 10.0 Ω.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which of the following liquids is a good conductor of electricity due to the presence of free mobile ions?",
    "options": [
      "Dilute sulfuric acid",
      "Pure distilled water",
      "Liquid kerosene",
      "Liquid ethanol"
    ],
    "correctAnswer": "Dilute sulfuric acid",
    "hint": "An aqueous electrolyte that dissociates into H⁺ and SO₄²⁻ ions.",
    "workedSolution": "Dilute sulfuric acid dissociates into mobile hydrogen and sulfate ions that carry electric current. Distilled water, kerosene, and ethanol lack free ions.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "An electric clothes iron rated at 1,500 W operates on a 240 V supply. Which of the following standard fuses is most appropriate for this appliance?",
    "options": [
      "3 A",
      "5 A",
      "10 A",
      "13 A"
    ],
    "correctAnswer": "10 A",
    "hint": "Operating current I = 1500 / 240 = 6.25 A. Choose the next rating above 6.25 A.",
    "workedSolution": "Operating current = 1500 W / 240 V = 6.25 A. A 5 A fuse would blow during normal use, making the 10 A fuse the correct rating.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which component of an electronic circuit is used to smoothly adjust or vary the volume of sound in an audio amplifier?",
    "options": [
      "Step-down transformer",
      "Potentiometer (variable resistor)",
      "Fixed ceramic capacitor",
      "Semiconductor diode"
    ],
    "correctAnswer": "Potentiometer (variable resistor)",
    "hint": "A three-terminal variable resistor with a rotary contact.",
    "workedSolution": "A potentiometer acts as an adjustable potential divider, allowing smooth variation of signal voltage and volume.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "In a domestic electrical wiring circuit, which conductor is maintained at zero electrical potential relative to the earth?",
    "options": [
      "Live wire",
      "Phase wire",
      "Switch line",
      "Neutral wire"
    ],
    "correctAnswer": "Neutral wire",
    "hint": "Earthed at the local distribution transformer.",
    "workedSolution": "The Neutral wire completes the circuit back to the substation and is earthed at the transformer, maintaining it near zero volts potential.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which of the following devices transforms radiant light energy from the Sun directly into direct-current electricity?",
    "options": [
      "Solar photovoltaic cell",
      "Solar thermal collector",
      "Wind turbine generator",
      "Dry electrochemical cell"
    ],
    "correctAnswer": "Solar photovoltaic cell",
    "hint": "Made of doped semiconductor silicon wafers.",
    "workedSolution": "A photovoltaic (PV) solar cell uses the photoelectric effect in semiconductor silicon to convert sunlight photons directly into DC electricity.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "What is the primary purpose of connecting the Earth wire to the metal casing of an electric cooker?",
    "options": [
      "To provide the return current path under normal operation",
      "To step down mains voltage from 240 V to 12 V",
      "To prevent the heating element from overheating",
      "To safely channel leakage fault current into the ground"
    ],
    "correctAnswer": "To safely channel leakage fault current into the ground",
    "hint": "Prevents the metal body from becoming live and delivering fatal shocks.",
    "workedSolution": "The Earth wire grounds the metal casing. If a loose live wire touches the casing, current flows to ground, blowing the fuse and protecting users.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "When a closed circuit containing a 9 V battery, an uncharged electrolytic capacitor, and an LED is switched on, what is observed?",
    "options": [
      "The LED stays permanently on with constant brightness",
      "The LED never lights up at any point in time",
      "The LED blinks continuously at regular intervals",
      "The LED flashes brightly and then fades completely off"
    ],
    "correctAnswer": "The LED flashes brightly and then fades completely off",
    "hint": "Current flows only while the capacitor is charging; once charged, it blocks DC.",
    "workedSolution": "Charging current flows initially, lighting the LED. Once the capacitor charges to battery voltage, current ceases, extinguishing the LED.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following materials is classified as a semi-metal (metalloid) widely used in manufacturing computer microchips?",
    "options": [
      "Copper",
      "Sulfur",
      "Silicon",
      "Aluminum"
    ],
    "correctAnswer": "Silicon",
    "hint": "Group 14 element with 4 valence electrons.",
    "workedSolution": "Silicon is a semiconductor metalloid whose electrical conductivity can be precisely controlled by doping, making it the basis of microchips.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "The rate at which electrical energy is transformed or consumed in an electric circuit is termed",
    "options": [
      "electrical power.",
      "potential difference.",
      "electrical resistance.",
      "electromotive force."
    ],
    "correctAnswer": "electrical power.",
    "hint": "Measured in Joules per second or Watts.",
    "workedSolution": "Electrical power is the rate of doing work or transferring electrical energy ($P = \\frac{E}{t} = IV$), measured in Watts.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which electrical safety device found on modern distribution consumer units trips and breaks a circuit automatically during an overload?",
    "options": [
      "Variable rheostat",
      "Step-down transformer",
      "Miniature Circuit Breaker (MCB)",
      "Galvanometer"
    ],
    "correctAnswer": "Miniature Circuit Breaker (MCB)",
    "hint": "An electromagnetic switch that flips off and can be reset without replacing wires.",
    "workedSolution": "An MCB automatically trips when current exceeds safety thresholds and can be reset after clearing the fault, replacing traditional wire fuses.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "If the cost of electricity is 80 pesewas per kWh, calculate the cost of operating a 2.5 kW air conditioner for 4 hours.",
    "options": [
      "GHS 2.00",
      "GHS 8.00",
      "GHS 10.00",
      "GHS 80.00"
    ],
    "correctAnswer": "GHS 8.00",
    "hint": "Energy = 2.5 kW x 4 h = 10 kWh. Cost = 10 kWh x 0.80 GHS.",
    "workedSolution": "Energy = 2.5 kW x 4 h = 10.0 kWh. Cost = 10.0 kWh x GHS 0.80 = GHS 8.00.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which of the following components in a simple electronic circuit acts as a current-controlled electronic switch or signal amplifier?",
    "options": [
      "Fixed carbon resistor",
      "Electrolytic capacitor",
      "Bipolar junction transistor",
      "Step-up transformer"
    ],
    "correctAnswer": "Bipolar junction transistor",
    "hint": "A three-terminal semiconductor device (N-P-N or P-N-P).",
    "workedSolution": "A transistor uses a small base current to switch or amplify a much larger collector-emitter current.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "In an electric circuit, an instrument connected in parallel across two points to measure potential difference without drawing significant current is a",
    "options": [
      "ammeter.",
      "barometer.",
      "hydrometer.",
      "voltmeter."
    ],
    "correctAnswer": "voltmeter.",
    "hint": "Has very high internal resistance and reads in Volts.",
    "workedSolution": "A voltmeter has high internal resistance and is connected in parallel across components to measure voltage without altering circuit current.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following methods of electricity generation in Ghana uses renewable energy?",
    "options": [
      "Thermal power at Aboadze using light crude",
      "Diesel generator sets at mining sites",
      "Coal-fired thermal power stations",
      "Hydroelectric power at Akosombo"
    ],
    "correctAnswer": "Hydroelectric power at Akosombo",
    "hint": "Powered by the gravitational flow of water in Lake Volta.",
    "workedSolution": "Hydroelectric power harnesses the renewable kinetic energy of falling water in rivers and reservoirs without depleting finite fuels.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "What happens to the brightness of two identical bulbs connected in series when a third identical bulb is added in series to the loop?",
    "options": [
      "All bulbs become noticeably brighter",
      "The brightness of the original bulbs remains unchanged",
      "The first bulb burns out immediately",
      "All bulbs become dimmer"
    ],
    "correctAnswer": "All bulbs become dimmer",
    "hint": "Total circuit resistance increases, reducing total circuit current.",
    "workedSolution": "Adding bulbs in series increases total circuit resistance ($R_{\\text{total}} = R_1 + R_2 + R_3$). Circuit current decreases, making all bulbs dimmer.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which of the following agricultural technologies uses solar electricity to automate the watering of vegetable beds?",
    "options": [
      "Manual watering can",
      "Hand-operated bucket sprinkler",
      "Diesel-powered water bowser",
      "Solar photovoltaic drip irrigation pump"
    ],
    "correctAnswer": "Solar photovoltaic drip irrigation pump",
    "hint": "Uses solar panels to drive a submersible DC pump delivering water through drip pipes.",
    "workedSolution": "Solar PV drip irrigation uses solar panels to power DC water pumps that supply water to crop roots efficiently.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "What is the primary function of the collector terminal in an N-P-N bipolar junction transistor?",
    "options": [
      "To trigger the initial activation current",
      "To emit electrons into the external circuit",
      "To collect charge carriers emitted by the emitter",
      "To insulate the transistor from thermal heat"
    ],
    "correctAnswer": "To collect charge carriers emitted by the emitter",
    "hint": "Connected to the positive terminal of the power supply in N-P-N circuits.",
    "workedSolution": "In an N-P-N transistor, the collector collects electrons that pass from the emitter through the base region.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Which of the following electronic waste (e-waste) components can be collected and chemically processed to recover precious metallic gold and copper?",
    "options": [
      "Plastic computer casings",
      "Printed circuit boards (motherboards)",
      "Rubber mouse mats",
      "Glass scanner covers"
    ],
    "correctAnswer": "Printed circuit boards (motherboards)",
    "hint": "Electronic boards with gold-plated pins and copper traces.",
    "workedSolution": "Printed circuit boards contain high concentrations of valuable metals (gold, silver, copper) that can be recovered through recycling.",
    "points": 1
  }
];

const paper2Mock11Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an electrical experiment set up to determine the resistance of an unknown resistor R, with the readings on the ammeter and voltmeter shown on the magnified dials:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 420 250' width='100%' height='240' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Circuit Loop on Left --><g transform='translate(20, 25)'><!-- Battery of Cells I --><line x1='30' y1='40' x2='70' y2='40' stroke='#38bdf8' stroke-width='2'/><line x1='70' y1='30' x2='70' y2='50' stroke='#38bdf8' stroke-width='3.5'/><line x1='78' y1='35' x2='78' y2='45' stroke='#38bdf8' stroke-width='2'/><line x1='86' y1='30' x2='86' y2='50' stroke='#38bdf8' stroke-width='3.5'/><line x1='94' y1='35' x2='94' y2='45' stroke='#38bdf8' stroke-width='2'/><line x1='94' y1='40' x2='150' y2='40' stroke='#38bdf8' stroke-width='2'/><circle cx='82' cy='18' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='82' y='21' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><!-- Key / Switch II --><line x1='150' y1='40' x2='180' y2='40' stroke='#38bdf8' stroke-width='2'/><circle cx='180' cy='40' r='3' fill='#cbd5e1'/><circle cx='205' cy='40' r='3' fill='#cbd5e1'/><line x1='180' y1='40' x2='202' y2='28' stroke='#f59e0b' stroke-width='2'/><circle cx='192' cy='18' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='192' y='21' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><line x1='205' y1='40' x2='230' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- Right Downward Wire to Rheostat III --><line x1='230' y1='40' x2='230' y2='100' stroke='#38bdf8' stroke-width='2'/><!-- Rheostat / Variable Resistor III --><rect x='215' y='100' width='30' height='45' rx='2' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><line x1='205' y1='145' x2='250' y2='100' stroke='#f59e0b' stroke-width='1.8'/><polygon points='250,100 242,102 248,108' fill='#f59e0b'/><circle cx='260' cy='122' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='260' y='125' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>III</text><line x1='230' y1='145' x2='230' y2='190' stroke='#38bdf8' stroke-width='2'/><!-- Bottom Wire through Ammeter IV --><line x1='230' y1='190' x2='160' y2='190' stroke='#38bdf8' stroke-width='2'/><!-- Ammeter IV in Series --><circle cx='140' cy='190' r='14' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/><text x='140' y='194' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>A</text><circle cx='140' cy='214' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='140' y='217' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>IV</text><line x1='126' y1='190' x2='90' y2='190' stroke='#38bdf8' stroke-width='2'/><!-- Unknown Resistor R (Label V) --><rect x='50' y='180' width='40' height='20' rx='2' fill='#1e293b' stroke='#38bdf8' stroke-width='1.8'/><text x='70' y='193' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>R</text><circle cx='70' cy='214' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='70' y='217' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text><line x1='50' y1='190' x2='30' y2='190' stroke='#38bdf8' stroke-width='2'/><line x1='30' y1='190' x2='30' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- Voltmeter VI in Parallel across R --><line x1='40' y1='190' x2='40' y2='140' stroke='#10b981' stroke-width='1.5'/><line x1='40' y1='140' x2='60' y2='140' stroke='#10b981' stroke-width='1.5'/><circle cx='75' cy='140' r='14' fill='#1e293b' stroke='#10b981' stroke-width='1.8'/><text x='75' y='144' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>V</text><circle cx='75' cy='118' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='75' y='121' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>VI</text><line x1='90' y1='140' x2='100' y2='140' stroke='#10b981' stroke-width='1.5'/><line x1='100' y1='140' x2='100' y2='190' stroke='#10b981' stroke-width='1.5'/></g><!-- Twin Meter Dials Magnified on Right --><!-- Ammeter Dial Dial A --><g transform='translate(295, 30)'><rect x='0' y='0' width='105' height='85' rx='6' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><path d='M 15 65 A 45 45 0 0 1 90 65' fill='none' stroke='#cbd5e1' stroke-width='1.5'/><!-- Ticks 0, 0.5, 1.0 A --><line x1='22' y1='60' x2='27' y2='56' stroke='#ffffff' stroke-width='1.5'/><text x='20' y='72' font-size='7' fill='#cbd5e1'>0</text><line x1='52' y1='40' x2='52' y2='34' stroke='#ffffff' stroke-width='1.5'/><text x='48' y='32' font-size='7' fill='#cbd5e1'>0.5</text><line x1='83' y1='60' x2='78' y2='56' stroke='#ffffff' stroke-width='1.5'/><text x='82' y='72' font-size='7' fill='#cbd5e1'>1.0</text><!-- Pointer pointing to 0.8 A --><line x1='52' y1='65' x2='76' y2='45' stroke='#ef4444' stroke-width='2'/><circle cx='52' cy='65' r='3' fill='#cbd5e1'/><text x='52' y='78' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>Ammeter Dial</text></g><!-- Voltmeter Dial Dial V --><g transform='translate(295, 130)'><rect x='0' y='0' width='105' height='85' rx='6' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><path d='M 15 65 A 45 45 0 0 1 90 65' fill='none' stroke='#cbd5e1' stroke-width='1.5'/><!-- Ticks 0, 1.5, 3.0 V --><line x1='22' y1='60' x2='27' y2='56' stroke='#ffffff' stroke-width='1.5'/><text x='20' y='72' font-size='7' fill='#cbd5e1'>0</text><line x1='52' y1='40' x2='52' y2='34' stroke='#ffffff' stroke-width='1.5'/><text x='48' y='32' font-size='7' fill='#cbd5e1'>1.5</text><line x1='83' y1='60' x2='78' y2='56' stroke='#ffffff' stroke-width='1.5'/><text x='82' y='72' font-size='7' fill='#cbd5e1'>3.0</text><!-- Pointer pointing to 2.4 V --><line x1='52' y1='65' x2='77' y2='47' stroke='#10b981' stroke-width='2'/><circle cx='52' cy='65' r='3' fill='#cbd5e1'/><text x='52' y='78' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>Voltmeter Dial</text></g><text x='210' y='235' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DIRECT-CURRENT RESISTANCE EXPERIMENT: READ AMMETER & VOLTMETER DIALS</text></svg></div>\n\n(i) Name each of the circuit components labelled I, II, III, IV, V, and VI.\n(ii) State the connection mode of:\n  (α) Ammeter IV relative to resistor R;\n  (β) Voltmeter VI relative to resistor R.\n(iii) Read and record the values indicated on:\n  (α) The ammeter dial in Amperes (A);\n  (β) The voltmeter dial in Volts (V).\n(iv) Use your readings in (iii) to calculate the resistance of the unknown resistor R.\n(v) State one observation made in the circuit when the contact slider on rheostat III is moved to decrease the circuit resistance.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Battery of cells (DC power supply)**\n• Part II: **Switch (key)**\n• Part III: **Rheostat (variable resistor)**\n• Part IV: **Ammeter**\n• Part V: **Unknown resistor R**\n• Part VI: **Voltmeter**\n\n(ii) Connection modes:\n• (α) Ammeter IV: Connected in **series** with resistor R.\n• (β) Voltmeter VI: Connected in **parallel** across resistor R.\n\n(iii) Meter readings:\n• (α) Ammeter reading: **0.8 A**\n• (β) Voltmeter reading: **2.4 V**\n\n(iv) Resistance calculation:\nBy Ohm's Law:\n$$R = \\frac{V}{I}$$\nSubstitute recorded values:\n$$R = \\frac{2.4\\text{ V}}{0.8\\text{ A}} = 3.0\\ \\Omega$$\nAnswer: The resistance of resistor R is **$3.0\\ \\Omega$**.\n\n(v) Observation:\nThe pointer on the ammeter moves to a **higher current reading** (the ammeter reading increases).",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates an electronic circuit assembled by a JHS STEM club to demonstrate capacitor charging and LED illumination:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(50, 20)'><!-- Battery Power Supply I --><line x1='20' y1='40' x2='50' y2='40' stroke='#38bdf8' stroke-width='2'/><line x1='50' y1='28' x2='50' y2='52' stroke='#38bdf8' stroke-width='3.5'/><line x1='58' y1='34' x2='58' y2='46' stroke='#38bdf8' stroke-width='2'/><line x1='58' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2'/><circle cx='54' cy='18' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='54' y='21' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><!-- Push Button Switch II --><circle cx='120' cy='40' r='3' fill='#cbd5e1'/><circle cx='150' cy='40' r='3' fill='#cbd5e1'/><line x1='120' y1='40' x2='148' y2='30' stroke='#f59e0b' stroke-width='2'/><circle cx='135' cy='18' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='135' y='21' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><line x1='150' y1='40' x2='220' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- Electrolytic Capacitor III in Right Branch --><line x1='220' y1='40' x2='220' y2='70' stroke='#38bdf8' stroke-width='2'/><!-- Parallel Plates --><line x1='205' y1='70' x2='235' y2='70' stroke='#a855f7' stroke-width='3'/><line x1='205' y1='78' x2='235' y2='78' stroke='#a855f7' stroke-width='3'/><text x='195' y='68' font-size='8' font-weight='bold' fill='#a855f7'>+</text><circle cx='250' cy='74' r='8' fill='#1e293b' stroke='#a855f7' stroke-width='1.5'/><text x='250' y='77' font-size='8' font-weight='bold' fill='#a855f7' text-anchor='middle'>III</text><line x1='220' y1='78' x2='220' y2='110' stroke='#38bdf8' stroke-width='2'/><!-- Protective Resistor IV --><rect x='208' y='110' width='24' height='30' rx='2' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><circle cx='245' cy='125' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='245' y='128' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text><line x1='220' y1='140' x2='220' y2='160' stroke='#38bdf8' stroke-width='2'/><!-- Bottom Wire through LED V --><line x1='220' y1='160' x2='135' y2='160' stroke='#38bdf8' stroke-width='2'/><!-- Light Emitting Diode V --><g transform='translate(115, 160)'><polygon points='0,-8 16,0 0,8' fill='#ef4444' stroke='#ef4444' stroke-width='1.2'/><line x1='16' y1='-8' x2='16' y2='8' stroke='#ef4444' stroke-width='2'/><!-- Light emission arrows --><line x1='10' y1='-9' x2='16' y2='-16' stroke='#f59e0b' stroke-width='1.5'/><polygon points='16,-16 11,-15 15,-12' fill='#f59e0b'/><line x1='4' y1='-9' x2='10' y2='-16' stroke='#f59e0b' stroke-width='1.5'/><polygon points='10,-16 5,-15 9,-12' fill='#f59e0b'/><circle cx='8' cy='20' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='8' y='23' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>V</text></g><line x1='115' y1='160' x2='20' y2='160' stroke='#38bdf8' stroke-width='2'/><line x1='20' y1='160' x2='20' y2='40' stroke='#38bdf8' stroke-width='2'/></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>CAPACITOR CHARGING & LED FLASHING CIRCUIT: IDENTIFY COMPONENTS I TO V</text></svg></div>\n\n(i) Name each of the electronic components labelled I, II, III, IV, and V.\n(ii) Describe what is observed on LED V immediately when push switch II is closed.\n(iii) State what happens to LED V after a few seconds while switch II remains closed, giving a reason for this occurrence.\n(iv) State the specific purpose of resistor IV in this circuit.\n(v) Name one everyday domestic electronic device that utilizes a capacitor in its circuitry.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Battery of cells (DC source)**\n• Part II: **Push button switch**\n• Part III: **Electrolytic capacitor**\n• Part IV: **Fixed protective resistor**\n• Part V: **Light Emitting Diode (LED)**\n\n(ii) Immediate observation:\nThe LED V **flashes on brightly**.\n\n(iii) Observation after a few seconds:\nThe LED V **fades out and goes completely off**.\n• *Reason:* Electric current flows into the capacitor only while it is charging. Once capacitor III charges to the full battery voltage, it blocks direct current (DC), causing current to stop and the LED to extinguish.\n\n(iv) Purpose of resistor IV:\nActs as a current-limiting resistor to protect LED V from burning out due to excessive current.\n\n(v) Everyday devices using capacitors:\n**Camera electronic flash unit** *(or Radio receiver tuning circuit, Computer power supply smoothing unit, Electric fan starter)*.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates a solar photovoltaic irrigation system installed on a school farm in Ghana:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 210' width='100%' height='190' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Solar PV Array Panel I on Left --><g transform='translate(35, 30)'><!-- Tilted Solar Panel --><polygon points='10,45 65,25 75,65 20,85' fill='#1e3a8a' stroke='#38bdf8' stroke-width='2'/><line x1='28' y1='38' x2='38' y2='78' stroke='#38bdf8' stroke-width='1'/><line x1='46' y1='32' x2='56' y2='72' stroke='#38bdf8' stroke-width='1'/><line x1='15' y1='65' x2='70' y2='45' stroke='#38bdf8' stroke-width='1'/><!-- Stand --><line x1='42' y1='75' x2='42' y2='125' stroke='#94a3b8' stroke-width='3'/><!-- Neutral Label I --><circle cx='42' cy='145' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='42' y='148' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text></g><!-- Solar Inverter / Controller Box II --><g transform='translate(130, 75)'><rect x='0' y='0' width='35' height='50' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><circle cx='10' cy='12' r='2' fill='#22c55e'/><circle cx='10' cy='20' r='2' fill='#ef4444'/><circle cx='17' cy='65' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='17' y='68' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><!-- Cable from PV to Controller --><path d='M -53 10 Q -20 5 -5 15' stroke='#f59e0b' stroke-width='1.5' fill='none'/></g><!-- Borehole / Water Well with Submersible Pump III --><g transform='translate(200, 95)'><!-- Ground well casing --><rect x='0' y='0' width='25' height='75' fill='#334155' stroke='#64748b' stroke-width='1.5'/><rect x='2' y='30' width='21' height='43' fill='#0284c7' opacity='0.5'/><!-- Submersible DC Pump III at bottom --><rect x='4' y='45' width='17' height='25' rx='2' fill='#10b981' stroke='#059669' stroke-width='1.2'/><circle cx='38' cy='58' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='38' y='61' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>III</text><!-- Cable from Controller to Pump --><path d='M -35 15 Q -10 15 12 45' stroke='#10b981' stroke-width='1.5' fill='none'/></g><!-- Elevated Reservoir Tank IV on Right --><g transform='translate(290, 25)'><!-- Stilt Legs --><line x1='15' y1='75' x2='15' y2='145' stroke='#64748b' stroke-width='2.5'/><line x1='55' y1='75' x2='55' y2='145' stroke='#64748b' stroke-width='2.5'/><line x1='15' y1='110' x2='55' y2='110' stroke='#64748b' stroke-width='1.5'/><!-- Water Storage Tank IV --><rect x='5' y='15' width='60' height='60' rx='5' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='2'/><rect x='7' y='35' width='56' height='38' fill='#0284c7' opacity='0.6'/><circle cx='35' cy='-2' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='35' y='1' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV</text><!-- Water lift pipe from pump to tank --><path d='M -78 120 L -78 25 L 5 25' stroke='#38bdf8' stroke-width='2.5' fill='none'/></g><text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SOLAR PHOTOVOLTAIC IRRIGATION INSTALLATION: IDENTIFY COMPONENTS I, II, III, AND IV</text></svg></div>\n\n(i) Name each of the parts labelled I, II, III, and IV.\n(ii) State the energy transformation that takes place in solar panel I when sunlight shines on it.\n(iii) State the function of component II in this solar-powered installation.\n(iv) State two advantages of using this solar irrigation system over a petrol-powered generator pump on a farm.",
        "workedSolution": "(i) Identification of parts:\n• Part I: **Solar photovoltaic (PV) panel array**\n• Part II: **Charge controller / Inverter unit**\n• Part III: **Submersible DC water pump**\n• Part IV: **Elevated water storage tank (reservoir)**\n\n(ii) Energy transformation in panel I:\n**Light energy (radiant solar energy) $\\to$ Electrical energy (direct current, DC)**.\n\n(iii) Function of component II:\nRegulates voltage and current from the solar panels, prevents electrical overloads, and powers the pump smoothly.\n\n(iv) Advantages of solar irrigation over petrol pumps:\n1. **Zero Fuel Costs:** Runs on free solar energy, eliminating fuel and oil expenses.\n2. **Environmentally Friendly:** Operates without exhaust emissions ($\\text{CO}_2$, smoke) or noise pollution.\n3. **Low Maintenance:** Has fewer moving parts, reducing breakdowns and servicing costs.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates common electronic waste (e-waste) items A, B, and C discarded at an informal scrap dump:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Item A: Broken CRT Glass Monitor (Lead Hazard) --><g transform='translate(40, 30)'><text x='50' y='12' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>E-Waste Item A</text><rect x='15' y='25' width='70' height='55' rx='4' fill='#334155' stroke='#64748b' stroke-width='1.8'/><!-- Cracked glass screen --><polygon points='22,32 78,32 78,72 22,72' fill='#0284c7' opacity='0.2'/><line x1='28' y1='38' x2='50' y2='52' stroke='#ffffff' stroke-width='1.5'/><line x1='50' y1='52' x2='68' y2='44' stroke='#ffffff' stroke-width='1.5'/><circle cx='50' cy='105' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='50' y='108' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><!-- Item B: Discarded Phone Lithium Battery (Fire / Acid Hazard) --><g transform='translate(150, 30)'><text x='40' y='12' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>E-Waste Item B</text><rect x='15' y='28' width='50' height='65' rx='3' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.8'/><rect x='25' y='22' width='10' height='6' fill='#f59e0b'/><rect x='45' y='22' width='10' height='6' fill='#f59e0b'/><text x='40' y='65' font-size='7' font-weight='bold' fill='#ef4444' text-anchor='middle'>Li-ion 3.7V</text><circle cx='40' cy='105' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='40' y='108' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><!-- Item C: Printed Circuit Board (Recyclable Gold & Copper) --><g transform='translate(255, 30)'><text x='45' y='12' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>E-Waste Item C</text><rect x='10' y='25' width='70' height='55' rx='3' fill='#14532d' stroke='#22c55e' stroke-width='1.8'/><!-- Copper conductive tracks --><line x1='18' y1='35' x2='35' y2='35' stroke='#f59e0b' stroke-width='1.5'/><line x1='35' y1='35' x2='35' y2='55' stroke='#f59e0b' stroke-width='1.5'/><line x1='35' y1='55' x2='60' y2='55' stroke='#f59e0b' stroke-width='1.5'/><rect x='45' y='62' width='12' height='10' fill='#0f172a' stroke='#cbd5e1' stroke-width='1'/><circle cx='45' cy='105' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='45' y='108' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>C</text></g><!-- Toxic Heavy Metal Ground Pollution Arrow below --><text x='190' y='160' font-size='7' font-weight='bold' fill='#f43f5e' text-anchor='middle'>Soil Leaching Hazard: Lead (Pb), Cadmium (Cd), Mercury (Hg)</text><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ELECTRONIC WASTE HAZARDS & RECYCLING: IDENTIFY ITEMS A, B, AND C</text></svg></div>\n\n(i) Identify each of the discarded electronic waste items labelled A, B, and C.\n(ii) Name one toxic heavy metal found in item A that threatens soil and groundwater when dismantled improperly.\n(iii) State one hazardous risk associated with the improper burning of lithium batteries (item B) at dump sites.\n(iv) Name two valuable metals that can be safely recovered and recycled from circuit boards (item C).\n(v) State two safe practices for managing electronic waste in municipal communities in Ghana.",
        "workedSolution": "(i) Identification of items:\n• Item A: **Cathode Ray Tube (CRT) computer/television monitor**\n• Item B: **Mobile phone lithium-ion battery**\n• Item C: **Printed Circuit Board (PCB / motherboard)**\n\n(ii) Toxic heavy metal in item A:\n**Lead [Pb]** *(or Cadmium / Mercury)*.\n\n(iii) Hazardous risk of burning item B:\nReleases toxic chemical fumes and carries a high risk of **explosions or chemical fires**.\n\n(iv) Valuable metals recovered from item C:\n**Copper [Cu]** and **Gold [Au]** *(or Silver [Ag])* (cite: 1).\n\n(v) Safe management practices for e-waste:\n1. Taking discarded electronics to formal e-waste collection centers (such as the Agbogbloshie technical recycling facility) rather than open burning.\n2. Promoting repair and reuse of electronics to extend product lifespans before disposal.\n3. Prohibiting open-air burning of cables and components to protect air, soil, and human health.",
        "maxMarks": 10
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State two advantages of connecting domestic electrical appliances in parallel rather than in series.\n(ii) In a circuit, two resistors of values $3.0\\ \\Omega$ and $6.0\\ \\Omega$ are connected in parallel. Calculate their combined effective resistance.",
        "workedSolution": "(i) Advantages of parallel connection:\n1. **Independent Operation:** Each appliance can be switched on or off independently; if one fails, others continue operating normally.\n2. **Full Mains Voltage:** Each appliance receives the full mains potential difference ($230\\text{ V}$ to $240\\text{ V}$) regardless of how many appliances are running.\n\n(ii) Parallel resistance calculation:\nFormula:\n$$\\frac{1}{R_{\\text{total}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$$\n$$\\frac{1}{R_{\\text{total}}} = \\frac{1}{3.0} + \\frac{1}{6.0} = \\frac{2 + 1}{6.0} = \\frac{3}{6.0} = \\frac{1}{2.0}$$\n$$R_{\\text{total}} = 2.0\\ \\Omega$$\nAnswer: The combined effective resistance is **$2.0\\ \\Omega$**.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) An electric toaster rated at $1,200.0\\text{ W}$ operates from a $240.0\\text{ V}$ mains supply. Calculate:\n  (α) The electric current drawn by the toaster;\n  (β) The appropriate fuse rating (choose from $3\\text{ A}, 5\\text{ A}, 10\\text{ A}$, or $13\\text{ A}$) to protect this toaster.\n(ii) State the function of the Earth wire in a domestic 3-pin plug.",
        "workedSolution": "(i) Calculations:\n• (α) Current ($I$):\n$$I = \\frac{P}{V} = \\frac{1,200.0\\text{ W}}{240.0\\text{ V}} = 5.0\\text{ Amperes (A)}$$\nAnswer: The operating current is **$5.0\\text{ A}$**.\n\n• (β) Fuse rating:\nThe fuse must be rated slightly above normal operating current to prevent blowing during normal usage.\nAnswer: The **$10\\text{ A}$ fuse** is the most appropriate rating (a $5\\text{ A}$ fuse would blow under normal operation).\n\n(ii) Function of the Earth wire:\nChannels leakage current safely into the ground if a live wire faults onto the appliance's metal casing, blowing the fuse and protecting users from electric shock.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three hazards associated with illegal connections of electricity in residential communities in Ghana.",
        "workedSolution": "1. **Transformer Overload and Power Tripping:** Unmetered power draws exceed local transformer capacities, causing frequent blackouts and transformer explosions (cite: 1).\n2. **Electrical Fire Outbreaks:** Substandard, exposed wiring overheats and sparks, igniting wooden structures and market stalls (cite: 1).\n3. **Electrocution Hazards:** Sagging, uninsulated live wires pose severe electric shock risks to pedestrians and children.\n4. **Appliance Damage:** Severe voltage fluctuations and brownouts damage household electrical appliances (cite: 1).",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Draw the circuit symbol for:\n  (α) A Light Dependent Resistor (LDR);\n  (β) An N-P-N bipolar junction transistor.\n(ii) Explain what happens to the electrical resistance of an LDR when darkness falls.",
        "workedSolution": "(i) Circuit Symbols:\n• (α) Light Dependent Resistor (LDR): [A fixed resistor rectangle or zigzag inside a circle, with two arrows pointing inward toward the resistor body representing incident light rays].\n• (β) N-P-N Transistor: [A circle containing a vertical Base bar on the left, an angled Collector line to the top right, and an angled Emitter line with an arrow pointing outward to the bottom right].\n\n(ii) Resistance of LDR in darkness:\nWhen darkness falls, absence of light reduces free charge carriers, causing its resistance to **increase significantly** (from hundreds of ohms in sunlight to several mega-ohms in darkness).",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Name the three terminals of an N-P-N transistor.\n(ii) In a simple transistor automatic night-switch circuit, explain the relationship between the base current and the collector-emitter current.",
        "workedSolution": "(i) Three terminals of a transistor:\n1. **Base (B)**\n2. **Collector (C)**\n3. **Emitter (E)**\n\n(ii) Current relationship:\nA very small input current entering the **base** controls and switches on a much larger current flowing from the **collector to the emitter**. When base current is zero, the transistor is off; when a small base current flows, the transistor turns on to power loads like relays or lamps.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State two differences between an energy-efficient Light Emitting Diode (LED) bulb and an incandescent filament bulb in terms of energy efficiency and operational lifespan.",
        "workedSolution": "1. **Energy Efficiency:** LED lamps convert up to $80\\%$ of input electrical energy into useful light (wasting only $20\\%$ as heat), whereas incandescent bulbs convert only $10\\%$ to light, wasting $90\\%$ as heat.\n2. **Operational Lifespan:** An LED bulb lasts between $15,000$ and $50,000$ operating hours, whereas an incandescent filament bulb typically burns out after roughly $1,000$ hours.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What is meant by the chemical effect of electric current (electrolysis)?\n(ii) During the electrolysis of water acidified with dilute sulfuric acid:\n  (α) Name the gas liberated at the anode (positive electrode);\n  (β) Name the gas liberated at the cathode (negative electrode);\n  (γ) State the ratio of the volume of gas collected at the cathode to that at the anode.",
        "workedSolution": "(i) Chemical effect of electric current (Electrolysis):\nThe decomposition of a chemical compound or liquid electrolyte into its constituent elements by the passage of direct electric current through it.\n\n(ii) Electrolysis of acidified water:\n• (α) Gas at anode (+): **Oxygen gas [$\\text{O}_2$]**\n• (β) Gas at cathode (-): **Hydrogen gas [$\\text{H}_2$]**\n• (γ) Volume ratio (Cathode to Anode): **$2 : 1$** (two volumes of hydrogen to one volume of oxygen, matching $\text{H}_2\text{O}$).",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Describe briefly how an iron spoon can be electroplated with copper in a school laboratory.\n(ii) State two industrial reasons why metallic objects are electroplated.",
        "workedSolution": "(i) Electroplating an iron spoon with copper:\n1. Thoroughly clean the iron spoon with sandpaper and acid to remove grease and oxides.\n2. Connect the iron spoon to the **negative terminal (cathode)** of a DC battery and immerse it in an electrolyte solution of **copper(II) sulfate [$\\text{CuSO}_4$]**.\n3. Connect a pure strip of copper to the **positive terminal (anode)** and immerse it in the same solution.\n4. Pass direct current through the electrolyte. Copper ions ($\text{Cu}^{2+}$) migrate to the spoon cathode, gaining electrons to deposit a smooth, reddish copper coating.\n\n(ii) Reasons for electroplating:\n1. **Corrosion Prevention:** Protects reactive base metals (like iron or steel) from rusting when exposed to moisture and air.\n2. **Decorative Enhancement:** Improves cosmetic appearance and shine (e.g., gold-plating jewelry, chrome-plating car bumpers).",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Explain briefly how the illegal mining practice known as \"galamsey\" in Ghana destroys water bodies and aquatic life through chemical pollution.",
        "workedSolution": "1. **Heavy Metal Contamination:** Illegal miners use toxic liquid mercury and cyanide to extract gold, discharging wash effluents directly into rivers (e.g., Pra, Ankobra, Birim).\n2. **Destruction of Aquatic Respiration:** Silt and heavy mud choke river channels, blocking sunlight needed by aquatic plants and clogging the delicate gill filaments of fish, causing suffocation.\n3. **Bioaccumulation in Food Chains:** Toxic mercury accumulates in fish tissues and biomagnifies up the food chain, poisoning humans who consume local river fish.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Name the primary natural energy resource used to generate electricity at:\n  (α) The Akosombo Generating Station;\n  (β) The Kpone Thermal Power Station;\n  (c) The Kaleo Power Plant in the Upper West Region.\n(ii) State two environmental impacts of burning fossil fuels in thermal power plants.",
        "workedSolution": "(i) Natural energy resources:\n• (α) Akosombo Station: **Water [Hydraulic energy / Falling water in Lake Volta]**\n• (β) Kpone Station: **Natural gas / Light crude oil [Fossil fuels]**\n• (γ) Kaleo Plant: **Sunlight [Solar radiant energy]**\n\n(ii) Environmental impacts of thermal power generation:\n1. **Greenhouse Gas Emissions:** Releases large volumes of carbon dioxide ($\text{CO}_2$), accelerating global climate change.\n2. **Air Pollution & Acid Rain:** Emits sulfur dioxide ($\text{SO}_2$) and nitrogen oxides ($\text{NO}_x$) that form acid rain, damaging soils and corroding infrastructure.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "A household in Kumasi uses the following electrical appliances daily:\n• Four 15 W LED lamps operated for 6 hours each;\n• One 120 W refrigerator running for a cumulative 10 hours;\n• One 1,000 W pressing iron used for 30 minutes.\n(i) Calculate the total daily electrical energy consumed by the household in kilowatt-hours (kWh).\n(ii) If electricity costs 75 pesewas per kWh, calculate the cost of operating these appliances for a 30-day month.",
        "workedSolution": "(i) Daily energy calculation:\n• *Lamps:* $4 \\times 15\\text{ W} = 60\\text{ W} = 0.06\\text{ kW}$.\n  $$\\text{Energy} = 0.06\\text{ kW} \\times 6\\text{ h} = 0.36\\text{ kWh}$$\n• *Refrigerator:* $120\\text{ W} = 0.12\\text{ kW}$.\n  $$\\text{Energy} = 0.12\\text{ kW} \\times 10\\text{ h} = 1.20\\text{ kWh}$$\n• *Iron:* $1,000\\text{ W} = 1.0\\text{ kW}$; $30\\text{ min} = 0.5\\text{ h}$.\n  $$\\text{Energy} = 1.0\\text{ kW} \\times 0.5\\text{ h} = 0.50\\text{ kWh}$$\n• *Total Daily Energy:*\n$$\\text{Total} = 0.36 + 1.20 + 0.50 = 2.06\\text{ kWh/day}$$\nAnswer: Total daily energy consumed is **$2.06\\text{ kWh}$**.\n\n(ii) Monthly cost calculation:\n$$\\text{Monthly Energy} = 2.06\\text{ kWh/day} \\times 30\\text{ days} = 61.8\\text{ kWh}$$\n$$\\text{Cost} = 61.8\\text{ kWh} \\times 0.75\\text{ GHS} = 46.35\\text{ GHS (or 4,635 pesewas)}$$\nAnswer: The monthly cost is **GHS 46.35**.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three practical energy-saving audits a family can conduct to reduce electricity bills during harmattan seasons in Ghana.",
        "workedSolution": "1. Defrosting refrigerators regularly and ensuring door rubber gaskets seal tightly to prevent compressor overwork.\n2. Unplugging mobile phone chargers, sound systems, and TV decoders from wall sockets when not in use to avoid phantom standby power drain.\n3. Ironing clothes in large batches once a week rather than heating the iron daily.\n4. Keeping windows and curtains open during the day to maximize natural lighting and cross-ventilation, reducing the need for fans and bulbs.",
        "maxMarks": 6
      }
    ]
  }
];

export const SET_BECE_MOCK_11_SCIENCE_P1 = {
  title: "Paper 1: Objective Test (Mock 11)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock11P1
};

export const SET_BECE_MOCK_11_SCIENCE_P2 = {
  title: "Paper 2: Practical & Theory Essay (Mock 11)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock11Questions
};

export const SET_BECE_MOCK_11_SCIENCE_COMPLETE = {
  id: "mock_11",
  setNumber: 142,
  subject: "Integrated Science",
  title: "BECE Integrated Science Mock 11 (Electricity, Electronics & Applied Technology Mastery)",
  totalDurationMinutes: 150,
  paper1: SET_BECE_MOCK_11_SCIENCE_P1,
  paper2: SET_BECE_MOCK_11_SCIENCE_P2,
  metadata: {
    isMock: true,
    isMockExam: true,
    setNumber: 142,
    version: "NaCCA JHS Standards-Compliant",
    totalMarks: 140,
    sanitized: true,
    optionsBalanced: true,
    specialtyDomain: "Electricity, Electronics & Energy Systems",
    vectorGraphicsCount: 4,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
