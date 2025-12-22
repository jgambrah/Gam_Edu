
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase'; 
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database, BookCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Default data structure for JHS 1
const JHS1_DATA = {
  id: 'jhs1',
  title: 'JHS 1',
  level: 1,
  units: [
    {
      id: 'unit1-intro',
      title: 'Introduction to Integrated Science',
      number: 1,
      lessons: [
        {
          order: 1,
          title: 'The Nature of Science',
          introduction: 'Science is the systematic study of the structure and behavior of the physical and natural world through observation and experiment. This lesson introduces the scientific method, the cornerstone of all scientific inquiry.',
          content_blocks: [
            { type: 'text', body: 'The scientific method is a process for experimentation that is used to explore observations and answer questions. It involves making observations, forming a hypothesis, conducting an experiment, analyzing the data, and drawing a conclusion.' },
            { type: 'concept', body: 'A key principle is that a hypothesis must be testable and falsifiable. You must be able to prove it wrong.'},
          ],
          practice_problems: [{ question: "What is the first step of the scientific method?", answer: "Observation" }]
        }
      ]
    },
    {
      id: 'unit2-matter',
      title: 'Diversity of Matter',
      number: 2,
      lessons: [
        {
          order: 1,
          title: 'States of Matter',
          introduction: 'Everything around us is made of matter, which can exist in different states. The three most common states are solid, liquid, and gas. This lesson explores their properties and how they change.',
          content_blocks: [
            { type: 'text', body: 'Particles in a solid are tightly packed and vibrate in place. In a liquid, they are close together but can move past one another. In a gas, particles are far apart and move freely.' },
            { type: 'interactive', materialId: 'tancp5df', label: 'States of Matter Simulation' },
            { type: 'concept', body: 'The state of matter is determined by factors like temperature and pressure. Adding energy (heat) can cause a substance to change from solid to liquid (melting) or liquid to gas (boiling).'}
          ],
          practice_problems: [{ question: "What state of matter has particles that are far apart and move freely?", answer: "Gas" }]
        }
      ]
    }
  ]
};

export default function CurriculumSeeder({ onSeedComplete }: { onSeedComplete: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not connected.' });
      return;
    }
    setLoading(true);
    
    try {
      const batch = writeBatch(firestore);

      // --- SEED JHS 1 ---
      const gradeRef = doc(firestore, 'curriculum', JHS1_DATA.id);
      batch.set(gradeRef, { title: JHS1_DATA.title, level: JHS1_DATA.level });

      for (const unit of JHS1_DATA.units) {
        const unitRef = doc(firestore, `curriculum/${JHS1_DATA.id}/units`, unit.id);
        batch.set(unitRef, { title: unit.title, number: unit.number });

        for (const lesson of unit.lessons) {
          const lessonRef = doc(collection(firestore, `curriculum/${JHS1_DATA.id}/units/${unit.id}/lessons`));
          batch.set(lessonRef, lesson);
        }
      }

      await batch.commit();
      toast({ title: 'Database Seeded!', description: 'Curriculum data has been successfully created.' });
      onSeedComplete();
    } catch (error: any) {
      console.error("Seeding Error:", error);
      toast({ variant: 'destructive', title: 'Seeding Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
      <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
        <BookCopy className="h-4 w-4"/> Curriculum Setup
      </h3>
      <p className="text-sm text-blue-700 mb-3">
        The "Open and Go" database is empty. Click here to create default Grade Levels and sample lessons.
      </p>
      <Button onClick={seedData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full">
        {loading ? <Loader2 className="animate-spin mr-2"/> : <Database className="mr-2 h-4 w-4" />}
        Initialize Curriculum
      </Button>
    </div>
  );
}
