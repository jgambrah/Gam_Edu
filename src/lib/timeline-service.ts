import { collection, doc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export type TimelineCategory =
  | 'admission'
  | 'promotion'
  | 'academic'
  | 'awards'
  | 'leadership'
  | 'activity'
  | 'project'
  | 'attendance'
  | 'behavior'
  | 'health'
  | 'meeting'
  | 'financial'
  | 'certificate'
  | 'graduation';

export interface TimelineEventInput {
  studentId: string;
  title: string;
  description: string;
  category: TimelineCategory;
  academicYear?: string;
  term?: string;
  classId?: string | null;
  className?: string | null;
  recordedBy?: string;
  recordedById?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  date?: Date;
  schoolId: string;
}

export class TimelineService {
  /**
   * Logs a student timeline event.
   */
  public static async logEvent(firestore: any, event: TimelineEventInput) {
    try {
      if (!firestore) throw new Error('Firestore instance is required.');
      const timelineRef = collection(firestore, 'students', event.studentId, 'timeline');
      const docRef = doc(timelineRef);
      
      const eventData = {
        id: docRef.id,
        studentId: event.studentId,
        title: event.title,
        description: event.description,
        category: event.category,
        academicYear: event.academicYear || '',
        term: event.term || '',
        classId: event.classId || null,
        className: event.className || null,
        recordedBy: event.recordedBy || 'System',
        recordedById: event.recordedById || 'system',
        attachments: event.attachments || [],
        metadata: event.metadata || {},
        date: event.date ? Timestamp.fromDate(event.date) : serverTimestamp(),
        createdAt: serverTimestamp(),
        schoolId: event.schoolId
      };
      
      await addDoc(timelineRef, eventData);
      
      // Notify parents asynchronously
      try {
        const { notifyParents } = await import('@/app/actions/notifications');
        await notifyParents(
          [event.studentId],
          `✨ Journey Update: ${event.title}`,
          `${event.description}. Open child profile to view their journey timeline.`,
          `/dashboard/my-children`
        );
      } catch (err) {
        console.error('Failed to notify parents of timeline event:', err);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error logging timeline event:', error);
      throw error;
    }
  }

  /**
   * Appends a timeline write operation to an existing write batch.
   */
  public static logEventBatch(firestore: any, batch: any, event: TimelineEventInput) {
    if (!firestore || !batch) return;
    const timelineRef = collection(firestore, 'students', event.studentId, 'timeline');
    const docRef = doc(timelineRef);
    
    const eventData = {
      id: docRef.id,
      studentId: event.studentId,
      title: event.title,
      description: event.description,
      category: event.category,
      academicYear: event.academicYear || '',
      term: event.term || '',
      classId: event.classId || null,
      className: event.className || null,
      recordedBy: event.recordedBy || 'System',
      recordedById: event.recordedById || 'system',
      attachments: event.attachments || [],
      metadata: event.metadata || {},
      date: event.date ? Timestamp.fromDate(event.date) : serverTimestamp(),
      createdAt: serverTimestamp(),
      schoolId: event.schoolId
    };
    
    batch.set(docRef, eventData);
    return docRef.id;
  }

  /**
   * Logs a verified micro-credential badge to the student's timeline & portfolio.
   */
  public static async logMicroCredential(
    firestore: any,
    studentId: string,
    schoolId: string,
    title: string,
    description: string,
    skillCategory: 'STEM' | 'Literacy' | 'Arts' | 'Sports' | 'Leadership' | 'Character',
    issuedBy: string,
    evidenceUrl?: string
  ) {
    return this.logEvent(firestore, {
      studentId,
      schoolId,
      title: `🎖️ Micro-Credential: ${title}`,
      description,
      category: 'certificate',
      attachments: evidenceUrl ? [evidenceUrl] : [],
      metadata: {
        isMicroCredential: true,
        skillCategory,
        issuedBy,
        evidenceUrl: evidenceUrl || '',
        verified: true
      }
    });
  }
}
