import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GradeBracket {
  minScore: number;
  maxScore: number;
  grade: string;
  remark: string;
}

export const DEFAULT_GRADING_SYSTEM: GradeBracket[] = [
  { minScore: 80, maxScore: 100, grade: 'A', remark: 'Excellent' },
  { minScore: 70, maxScore: 79, grade: 'B', remark: 'Very Good' },
  { minScore: 60, maxScore: 69, grade: 'C', remark: 'Good' },
  { minScore: 50, maxScore: 59, grade: 'D', remark: 'Credit' },
  { minScore: 40, maxScore: 49, grade: 'E', remark: 'Pass' },
  { minScore: 0, maxScore: 39, grade: 'F', remark: 'Fail' }
];

export function getGradeFromScale(score: number, gradingScale?: GradeBracket[]) {
  if (score <= 0) {
    return { grade: 'N/A', remark: '', autoRemark: '' };
  }
  const scale = gradingScale && gradingScale.length > 0 ? gradingScale : DEFAULT_GRADING_SYSTEM;
  const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);
  for (const bracket of sortedScale) {
    if (score >= bracket.minScore) {
      return { 
        grade: bracket.grade, 
        remark: bracket.remark, 
        autoRemark: bracket.remark 
      };
    }
  }
  const lowestBracket = sortedScale[sortedScale.length - 1];
  return { 
    grade: lowestBracket?.grade || 'F', 
    remark: lowestBracket?.remark || 'Fail', 
    autoRemark: lowestBracket?.remark || 'Fail' 
  };
}

export const COST_CENTERS = [
  { id: 'General', name: 'General / Admin' },
  { id: 'Academics', name: 'Academics' },
  { id: 'Sports', name: 'Sports & Athletics' },
  { id: 'Transport', name: 'Transport & Fleet' },
  { id: 'Catering', name: 'Boarding & Catering' },
  { id: 'Maintenance', name: 'Maintenance & Utilities' }
];

export function getCostCenters(schoolSettings?: any) {
  if (schoolSettings?.customCostCenters && Array.isArray(schoolSettings.customCostCenters)) {
    const all = [...COST_CENTERS];
    schoolSettings.customCostCenters.forEach((cc: any) => {
      const id = typeof cc === 'string' ? cc : cc.id;
      const name = typeof cc === 'string' ? cc : cc.name;
      if (id && !all.some(item => item.id === id)) {
        all.push({ id, name });
      }
    });
    return all;
  }
  return COST_CENTERS;
}

