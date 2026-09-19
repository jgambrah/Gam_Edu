import { NACCA_JHS_SCIENCE_TOPICAL_UNITS } from '../src/lib/data/jhs-science-curriculum';
import { SET_JHS_SCIENCE_SAMPLE_P1 } from '../src/lib/data/jhs-curriculum-set-70';
import { SET_JHS_SCIENCE_SAMPLE_P2 } from '../src/lib/data/jhs-curriculum-set-71';
import { DEFAULT_JHS_SCIENCE_MANIFEST, fetchSubjectTopicsManifest } from '../src/lib/services/topicalLabService';
import { COMPREHENSIVE_QUESTION_CATALOG } from '../src/lib/data/curriculumCatalog';
import { SAMPLE_GLOBAL_QUESTION_SETS } from '../src/lib/global-curriculum-service';

console.log('--- INTEGRATION AUDIT ---');
console.log('1. JHS Science Curriculum Units:', NACCA_JHS_SCIENCE_TOPICAL_UNITS.length);
console.log('2. Set 70 Questions Count:', SET_JHS_SCIENCE_SAMPLE_P1.questions.length);
console.log('3. Set 71 Questions Count:', SET_JHS_SCIENCE_SAMPLE_P2.questions.length);
console.log('4. Default Science Manifest Topics:', DEFAULT_JHS_SCIENCE_MANIFEST.topics.length);
const catalogHasP1 = COMPREHENSIVE_QUESTION_CATALOG.some(c => c.id === 'paper_nacca_sample_variant_p1');
const catalogHasP2 = COMPREHENSIVE_QUESTION_CATALOG.some(c => c.id === 'paper_nacca_sample_variant_p2');
console.log('5. Catalog has Set 70 (P1):', catalogHasP1);
console.log('6. Catalog has Set 71 (P2):', catalogHasP2);
const globalHasP1 = (SAMPLE_GLOBAL_QUESTION_SETS['jhs'] || []).some(s => s.questionSet.id === 'paper_nacca_sample_variant_p1');
const globalHasP2 = (SAMPLE_GLOBAL_QUESTION_SETS['jhs'] || []).some(s => s.questionSet.id === 'paper_nacca_sample_variant_p2');
console.log('7. Global Curriculum has Set 70 (P1):', globalHasP1);
console.log('8. Global Curriculum has Set 71 (P2):', globalHasP2);

if (catalogHasP1 && catalogHasP2 && globalHasP1 && globalHasP2 && NACCA_JHS_SCIENCE_TOPICAL_UNITS.length > 0) {
  console.log('🎉 ALL INTEGRATION CRITERIA VERIFIED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error('❌ Integration check failed.');
  process.exit(1);
}
