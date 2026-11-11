import { redirect } from 'next/navigation';

/**
 * The old "Learning Resources" list is retired. It kept links in a separate collection that had no school
 * on it and that ordinary school accounts could not read, so it only ever worked for the platform owner.
 * Everything now lives in Learning Materials, which is organised by school, class and subject.
 */
export default function ResourcesPage() {
  redirect('/dashboard/academics/learning-materials');
}
