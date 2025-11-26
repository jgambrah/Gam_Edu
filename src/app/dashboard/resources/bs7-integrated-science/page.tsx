'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const scienceContent = [
  {
    strand: 'STRAND 1: DIVERSITY OF MATTER',
    subStrands: [
      {
        title: 'Sub-strand 1: Materials',
        content: `
### Introduction to Matter
Matter is anything that has mass and takes up space. Everything around us, from the air we breathe to the chair we sit on, is made of matter. Matter exists in three main states: solid, liquid, and gas.

### Properties of Materials
- **Physical Properties:** These are characteristics we can observe without changing the substance into something new. Examples include color, hardness, density, and boiling point.
- **Chemical Properties:** These describe how a substance reacts with other substances. Examples include flammability (ability to burn) and reactivity with acids.

### Classification of Materials
Materials can be classified in many ways:
1.  **Based on Origin:** Natural (e.g., wood, cotton) vs. Man-made/Synthetic (e.g., plastic, nylon).
2.  **Based on State:** Solid, Liquid, Gas.
3.  **Based on Properties:** Metals vs. Non-metals, Conductors vs. Insulators.

### Metals and Non-Metals
- **Metals:** Generally shiny, hard, and good conductors of heat and electricity. They are malleable (can be beaten into sheets) and ductile (can be drawn into wires). Examples: Iron, Copper, Gold.
- **Non-Metals:** Generally dull, brittle, and poor conductors. Examples: Carbon, Sulfur, Oxygen.
        `,
      },
      {
        title: 'Sub-Strand 2: Living Cells',
        content: `
### The Cell as the Basic Unit of Life
A cell is the smallest, most basic unit of life. All living organisms are made up of one or more cells.

### Plant and Animal Cells
- **Animal Cell:** Typically has a cell membrane, cytoplasm, a nucleus, mitochondria, and vacuoles.
- **Plant Cell:** Has all the parts of an animal cell, plus a rigid **cell wall** outside the cell membrane, **chloroplasts** for photosynthesis, and a large central vacuole.

### Key Organelles and Their Functions
- **Nucleus:** The "control center" of the cell, containing DNA (genetic material).
- **Cell Membrane:** Controls what enters and leaves the cell.
- **Cytoplasm:** A jelly-like substance that fills the cell and holds the organelles.
- **Mitochondria:** The "powerhouse" of the cell, where energy is produced.
- **Cell Wall (Plants only):** Provides structural support and protection.
- **Chloroplasts (Plants only):** Site of photosynthesis, where the plant makes its food.
- **Vacuole:** Stores water, food, and waste. It is very large in plant cells.
        `,
      },
    ],
  },
  {
    strand: 'STRAND 2: CYCLE',
    subStrands: [
        {
            title: 'Sub-strand 1: Earth Science',
            content: `
### The Water Cycle
The water cycle is the continuous movement of water on, above, and below the surface of the Earth.
1.  **Evaporation:** The sun heats water in rivers, lakes, and oceans, turning it into vapor or steam.
2.  **Condensation:** The water vapor in the air gets cold and changes back into liquid, forming clouds.
3.  **Precipitation:** When so much water has condensed that the air cannot hold it anymore, it falls back to the Earth as rain, hail, or snow.
4.  **Collection:** Water collects in oceans, lakes, and rivers, or soaks into the ground, starting the cycle over again.

### The Carbon Cycle
The carbon cycle is the process where carbon atoms continuously travel from the atmosphere to the Earth and then back into the atmosphere. Key processes include photosynthesis (plants take in CO2), respiration (animals and plants release CO2), decomposition, and the burning of fossil fuels.
        `,
        },
        {
            title: 'Sub-strand 2: Life Cycle of Organisms',
            content: `
### Life Cycle of a Flowering Plant
1.  **Seed:** The life cycle begins with a seed.
2.  **Germination:** The seed sprouts, and a young plant (seedling) emerges.
3.  **Growth:** The seedling grows into a mature plant with leaves, stems, and roots.
4.  **Flowering:** The mature plant produces flowers.
5.  **Pollination & Fertilization:** Pollen is transferred to the flower, leading to the fertilization of ovules.
6.  **Seed Dispersal:** The fertilized ovules develop into seeds, which are then scattered to grow new plants.

### Life Cycle of an Insect (e.g., Butterfly)
This is an example of complete metamorphosis.
1.  **Egg:** The female butterfly lays eggs.
2.  **Larva (Caterpillar):** The egg hatches into a larva, which eats and grows.
3.  **Pupa (Chrysalis):** The larva forms a protective casing around itself.
4.  **Adult:** An adult butterfly emerges from the pupa, ready to reproduce.
        `,
        },
        {
            title: 'Sub-strand 3: Crop Production',
            content: `
### Introduction to Crop Production
Crop production is the branch of agriculture that deals with the cultivation of plants for food, fiber, and other human uses.

### Main Stages of Crop Production
1.  **Land Preparation:** Clearing the land and tilling the soil to make it suitable for planting.
2.  **Sowing:** Planting the seeds or seedlings in the prepared soil.
3.  **Manuring/Fertilizing:** Adding manure and fertilizers to the soil to enrich it with nutrients.
4.  **Irrigation:** Supplying water to the crops at regular intervals.
5.  **Weeding:** Removing unwanted plants (weeds) that compete with the crops.
6.  **Harvesting:** Cutting and gathering the mature crop.
7.  **Storage:** Storing the harvested grains or produce safely.
        `,
        },
        {
            title: 'Sub-strand 4: Animal Production',
            content: `
### Introduction to Animal Production
Animal production (or animal husbandry) is the agricultural practice of breeding and raising livestock such as cattle, sheep, goats, pigs, and poultry for meat, milk, eggs, or wool.

### Types of Animal Production
- **Poultry Farming:** Raising domesticated birds like chickens, ducks, and turkeys.
- **Cattle Rearing:** Raising cattle for milk (dairy) or meat (beef).
- **Aquaculture:** Farming of fish and other aquatic organisms.
- **Apiculture (Beekeeping):** Keeping honey bees to collect honey and beeswax.

### Basic Practices in Animal Care
- **Proper Feeding:** Providing balanced and nutritious feed.
- **Housing:** Ensuring clean, safe, and comfortable shelter.
- **Hygiene:** Maintaining cleanliness to prevent diseases.
- **Healthcare:** Regular check-ups, vaccination, and treatment of sick animals.
        `,
        },
    ],
  },
  {
    strand: 'STRAND 3: SYSTEMS',
    subStrands: [
        {
            title: 'Sub-strand 1: The Human Body System',
            content: `
### The Digestive System
Breaks down food into nutrients the body can use.
- **Organs:** Mouth, esophagus, stomach, small intestine, large intestine.

### The Respiratory System
Responsible for taking in oxygen and expelling carbon dioxide.
- **Organs:** Nose, trachea (windpipe), lungs.

### The Circulatory System
Transports oxygen, nutrients, and hormones to cells, and removes waste products.
- **Organs:** Heart, blood vessels (arteries, veins, capillaries), blood.

### The Nervous System
The body's command center, controlling all actions and functions.
- **Organs:** Brain, spinal cord, nerves.
        `,
        },
        {
            title: 'Sub-strand 2: Solar System',
            content: `
### Introduction to the Solar System
The Solar System consists of the Sun and everything that orbits it, including planets, moons, asteroids, and comets.

### The Sun
The Sun is a star at the center of our Solar System. It is a huge ball of hot gas that produces light and heat.

### The Planets
There are eight planets in our Solar System. In order from the Sun, they are:
1.  **Mercury**
2.  **Venus**
3.  **Earth**
4.  **Mars**
5.  **Jupiter**
6.  **Saturn**
7.  **Uranus**
8.  **Neptune**

*My Very Educated Mother Just Served Us Noodles* is a popular mnemonic to remember the order.
        `,
        },
        {
            title: 'Sub-strand 3: Ecosystem',
            content: `
### What is an Ecosystem?
An ecosystem includes all the living things (biotic factors) in a given area, interacting with each other, and also with their non-living (abiotic) environments.

### Components of an Ecosystem
- **Biotic Factors:** All living or once-living parts, such as plants, animals, fungi, and bacteria.
- **Abiotic Factors:** Non-living parts, such as sunlight, soil, water, temperature, and air.

### Types of Organisms in an Ecosystem
- **Producers:** Organisms that make their own food, usually through photosynthesis (e.g., plants).
- **Consumers:** Organisms that get energy by eating other organisms.
  - **Herbivores:** Eat only plants.
  - **Carnivores:** Eat only animals.
  - **Omnivores:** Eat both plants and animals.
- **Decomposers:** Organisms that break down dead organic matter (e.g., bacteria, fungi).

### Food Chains and Food Webs
A **food chain** shows how energy is transferred from one living organism to another. A **food web** consists of many interconnected food chains.
        `,
        },
        {
            title: 'Sub-strand 4: Farming System',
            content: `
### Introduction to Farming Systems
A farming system is a way of organizing and managing a farm. It involves the combination of different farm enterprises like crops and livestock.

### Types of Farming Systems
- **Mixed Farming:** Both crops and livestock are raised on the same farm. Animal waste is used as manure for crops, and crop residue can be used as animal feed.
- **Monocropping:** Growing only one type of crop on a piece of land year after year.
- **Crop Rotation:** Growing different crops in succession on the same piece of land to improve soil health and control pests.
- **Pastoral Farming:** Rearing animals on large areas of land (pastures).
        `,
        },
    ],
  },
  {
    strand: 'STRAND 4: FORCES AND ENERGY',
    subStrands: [
        {
            title: 'Sub-strand 1: Energy',
            content: `
### What is Energy?
Energy is the ability to do work. It exists in various forms.

### Forms of Energy
- **Potential Energy:** Stored energy (e.g., a stretched rubber band, water at the top of a dam).
- **Kinetic Energy:** The energy of motion (e.g., a moving car, a rolling ball).
- **Chemical Energy:** Energy stored in the bonds of chemical compounds (e.g., in food, batteries, fuel).
- **Heat Energy:** The energy of moving particles in a substance.
- **Light Energy:** Energy that we can see.
- **Electrical Energy:** The energy of moving electrons.

### Sources of Energy
- **Renewable Sources:** Can be replenished naturally (e.g., solar, wind, hydro).
- **Non-Renewable Sources:** Cannot be easily replenished (e.g., fossil fuels like coal, oil, and natural gas).
        `,
        },
        {
            title: 'Sub-Strand 2: Electricity and Electronics',
            content: `
### Electric Current
An electric current is a flow of electric charge (electrons) through a conductor, like a wire.

### Simple Electric Circuit
A simple circuit needs three basic components:
1.  **An Energy Source:** Such as a battery or cell.
2.  **A Conductor:** A wire through which the current can flow.
3.  **A Load:** A device that uses the electricity, like a light bulb.
A **switch** can be added to open or close the circuit.

### Conductors and Insulators
- **Conductors:** Materials that allow electricity to pass through them easily (e.g., metals like copper and aluminum).
- **Insulators:** Materials that do not allow electricity to pass through them easily (e.g., plastic, rubber, wood).
        `,
        },
        {
            title: 'Sub-strand 3: Conversion and Conservation of Energy',
            content: `
### The Law of Conservation of Energy
Energy cannot be created or destroyed; it can only be changed from one form to another.

### Examples of Energy Conversion
- **A light bulb:** Electrical energy is converted into light energy and heat energy.
- **A moving car:** Chemical energy in fuel is converted into heat energy, then into kinetic energy (motion).
- **Photosynthesis:** Light energy from the sun is converted into chemical energy in plants.
- **A hydroelectric dam:** Potential energy of the stored water is converted into kinetic energy as it flows, which then turns a turbine to generate electrical energy.
        `,
        },
        {
            title: 'Sub-strand 4: Force and Motion',
            content: `
### What is a Force?
A force is a push or a pull on an object. It can cause an object to start moving, stop moving, change direction, or change shape.

### Types of Forces
- **Gravitational Force:** The force of attraction between two objects with mass. It's what keeps us on the ground.
- **Frictional Force:** A force that opposes motion between two surfaces in contact.
- **Magnetic Force:** The push or pull exerted by magnets.
- **Tension Force:** The force transmitted through a string, rope, or wire when it is pulled tight.

### Motion
Motion is a change in the position of an object over time. Key concepts include:
- **Speed:** How fast an object is moving.
- **Velocity:** Speed in a given direction.
- **Acceleration:** The rate of change of velocity.
        `,
        },
        {
            title: 'Sub-strand 5: Agricultural Tools',
            content: `
### Basic Agricultural Tools
These are simple hand tools used in farming.
- **Cutlass/Machete:** Used for clearing bushes and cutting weeds.
- **Hoe:** Used for tilling the soil, making ridges, and removing weeds.
- **Rake:** Used for leveling the soil and gathering leaves or debris.
- **Spade/Shovel:** Used for digging, lifting, and moving soil or other materials.
- **Watering Can:** Used for watering plants.
- **Wheelbarrow:** Used for transporting farm inputs and produce.
        `,
        },
    ],
  },
  {
    strand: 'STRAND 5: HUMAN AND THE ENVIRONMENT',
    subStrands: [
        {
            title: 'Sub-strand 1: Waste Management',
            content: `
### What is Waste?
Waste refers to unwanted or unusable materials.

### Types of Waste
- **Solid Waste:** Garbage, refuse, sludge from a wastewater treatment plant.
- **Liquid Waste:** Wastewater, fats, oils, or grease.
- **Gaseous Waste:** Gases from industries and vehicles.
- **Biodegradable Waste:** Waste that can be broken down by microorganisms (e.g., food scraps, paper).
- **Non-biodegradable Waste:** Waste that cannot be broken down easily (e.g., plastics, metals, glass).

### The 3 R's of Waste Management
1.  **Reduce:** Use less. Avoid disposable items.
2.  **Reuse:** Use items again for the same or a different purpose.
3.  **Recycle:** Convert waste materials into new products.
Proper disposal of waste, such as through landfilling or incineration, is crucial to prevent pollution.
        `,
        },
        {
            title: 'Sub-strand 2: Human Health',
            content: `
### What is Health?
Health is a state of complete physical, mental, and social well-being, not just the absence of disease.

### Common Diseases
A disease is a condition that impairs the normal functioning of the body.
- **Communicable Diseases:** Can be spread from one person to another (e.g., Malaria, COVID-19, Common Cold). They are caused by pathogens like bacteria, viruses, and fungi.
- **Non-communicable Diseases:** Cannot be spread from person to person (e.g., Diabetes, Heart Disease, Cancer). They are often related to lifestyle and genetics.

### Maintaining Good Health
- **Balanced Diet:** Eating a variety of foods from all food groups.
- **Regular Exercise:** Being physically active.
- **Personal Hygiene:** Keeping your body and surroundings clean.
- **Adequate Rest:** Getting enough sleep.
- **Avoiding Harmful Substances:** Such as tobacco and excessive alcohol.
        `,
        },
        {
            title: 'Sub-strand 3: Science and Industry',
            content: `
### Role of Science in Industry
Science provides the foundation for technological advancements that drive industries.

### Examples of Science in Local Industries
- **Food Processing:** Scientific principles of preservation (like canning, drying, and refrigeration) are used to process foods like fish, fruits, and vegetables.
- **Textile Industry:** Chemistry is used to create dyes and treat fabrics.
- **Agriculture:** Biology and genetics are used to develop improved crop varieties and animal breeds.
- **Construction:** Physics and engineering principles are used to build strong and safe structures.

### Impact of Industrial Activities on the Environment
- **Pollution:** Industries can release harmful substances into the air, water, and soil.
- **Deforestation:** Clearing forests for industrial expansion.
- **Resource Depletion:** Using up natural resources like minerals and water.
It is important for industries to adopt sustainable practices to minimize their negative impact on the environment.
        `,
        },
    ],
  },
];

export default function BS7IntegratedSciencePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen />
            BS7 (JHS 1) Integrated Science
          </CardTitle>
          <CardDescription>
            Course notes and materials for BS7 Integrated Science. Click on a strand to expand its topics.
          </CardDescription>
        </CardHeader>
      </Card>

      {scienceContent.map((strand) => (
        <Card key={strand.strand}>
          <CardHeader>
            <CardTitle>{strand.strand}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {strand.subStrands.map((sub, index) => (
                <AccordionItem value={`item-${index}`} key={sub.title}>
                  <AccordionTrigger>{sub.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sub.content }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
