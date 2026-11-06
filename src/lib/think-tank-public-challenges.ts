import type {
  ThinkTankDetectiveCaseItem,
  ThinkTankRiddleItem,
  ThinkTankDebateItem,
  ThinkTankTargetGroup,
} from '@/lib/think-tank-data';

export const THINK_TANK_PUBLIC_V2_VERSION = '20.0.0';

export type PublicDetectiveCase = {
  id: string;
  targetGroup: ThinkTankTargetGroup;
  caseType: string;
  scenario: string;
  question: string;
  options: string[];
  isCentral?: boolean;
};

export type PublicRiddle = {
  id: string;
  targetGroup: ThinkTankTargetGroup;
  category: ThinkTankRiddleItem['category'];
  difficulty: ThinkTankRiddleItem['difficulty'];
  question: string;
  hint1: string;
  hint2: string;
  isCentral?: boolean;
};

export type PublicDebate = {
  id: string;
  targetGroup: ThinkTankTargetGroup;
  topic: string;
  context: string;
  isCentral?: boolean;
};

export function toPublicDetectiveCase(
  item: ThinkTankDetectiveCaseItem
): PublicDetectiveCase {
  return {
    id: item.id,
    targetGroup: item.targetGroup,
    caseType: item.caseType,
    scenario: item.scenario,
    question: item.question,
    options: item.options.map((opt) => String(opt)),
    isCentral: Boolean(item.isCentral),
  };
}

export function toPublicDetectiveCases(
  items: ThinkTankDetectiveCaseItem[]
): PublicDetectiveCase[] {
  return items.map(toPublicDetectiveCase);
}

export function toPublicRiddle(
  item: ThinkTankRiddleItem
): PublicRiddle {
  return {
    id: item.id,
    targetGroup: item.targetGroup,
    category: item.category,
    difficulty: item.difficulty,
    question: item.question,
    hint1: item.hint1,
    hint2: item.hint2,
    isCentral: Boolean(item.isCentral),
  };
}

export function toPublicRiddles(
  items: ThinkTankRiddleItem[]
): PublicRiddle[] {
  return items.map(toPublicRiddle);
}

export function toPublicDebate(
  item: ThinkTankDebateItem
): PublicDebate {
  return {
    id: item.id,
    targetGroup: item.targetGroup,
    topic: item.topic,
    context: item.context,
    isCentral: Boolean(item.isCentral),
  };
}

export function toPublicDebates(
  items: ThinkTankDebateItem[]
): PublicDebate[] {
  return items.map(toPublicDebate);
}

