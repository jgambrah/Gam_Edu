/**
 * Timetable checks shared by the AI scheduler (server) and the manual lesson dialog (browser).
 * Pure functions — no Firebase — so the same rules apply everywhere and can be tested.
 *
 * The AI is only asked to PROPOSE lessons; everything it returns passes through `TimetableValidator`,
 * which guarantees what the screen promises: no teacher in two places at once, no class double-booked,
 * no lessons in breaks, and no subject more often than its weekly periods.
 */

export type SlotLike = { id: string; day: string; startTime: string; endTime: string; type?: string | null; classId?: string | null };

export function toMinutes(t?: string | null): number {
    const m = String(t || '').match(/^(\d{1,2}):(\d{2})/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
}

export function isLessonSlot(s: SlotLike): boolean {
    return !s.type || s.type === 'Lesson';
}

/** Same day and the times overlap (08:00–08:45 and 08:30–09:15 overlap; 08:00–08:45 and 08:45–09:30 do not). */
export function slotsOverlap(a: SlotLike, b: SlotLike): boolean {
    if (!a || !b || a.day !== b.day) return false;
    const as = toMinutes(a.startTime), ae = toMinutes(a.endTime), bs = toMinutes(b.startTime), be = toMinutes(b.endTime);
    if ([as, ae, bs, be].some(Number.isNaN)) return a.startTime === b.startTime;
    return as < be && bs < ae;
}

/** A slot with no classId applies to every class; otherwise only to its own class. */
export function slotAppliesToClass(s: SlotLike, classId: string): boolean {
    return !s.classId || s.classId === classId;
}

export function timetableEntryId(schoolId: string, classId: string, timeSlotId: string): string {
    return `${schoolId}-${classId}-${timeSlotId}`;
}

type Ctx = {
    schoolId: string;
    classes: Array<{ id: string; name?: string; homeRoomId?: string | null; classTeacherId?: string | null }>;
    subjects: Array<{ id: string; name?: string; weeklyPeriods?: number; targetClasses?: string[]; allowedTeacherIds?: string[] }>;
    teachers: Array<{ id: string; name?: string }>;
    rooms: Array<{ id: string; name?: string }>;
    timeSlots: SlotLike[];
};

export type ValidatedEntry = {
    id: string; schoolId: string; classId: string; timeSlotId: string;
    day: string; startTime: string; endTime: string;
    subjectId: string; subjectName: string;
    teacherId: string; teacherName: string;
    roomId: string; roomName: string;
};

export class TimetableValidator {
    private slotById = new Map<string, SlotLike>();
    private classById = new Map<string, Ctx['classes'][number]>();
    private subjectById = new Map<string, Ctx['subjects'][number]>();
    private teacherById = new Map<string, Ctx['teachers'][number]>();
    private roomById = new Map<string, Ctx['rooms'][number]>();
    private taken = new Set<string>();                       // classId|slotId
    private classBusy = new Map<string, SlotLike[]>();        // classId → slots (a class's own slot and a global one can overlap)
    private perWeek = new Map<string, number>();              // classId|subjectId → count
    private teacherBusy = new Map<string, SlotLike[]>();      // teacherId → slots
    private roomBusy = new Map<string, Array<{ slot: SlotLike; classId: string }>>();
    readonly accepted: ValidatedEntry[] = [];
    readonly issues: Record<string, number> = {};

    constructor(private ctx: Ctx) {
        ctx.timeSlots.forEach(s => this.slotById.set(s.id, s));
        ctx.classes.forEach(c => this.classById.set(c.id, c));
        ctx.subjects.forEach(s => this.subjectById.set(s.id, s));
        ctx.teachers.forEach(t => this.teacherById.set(t.id, t));
        ctx.rooms.forEach(r => this.roomById.set(r.id, r));
    }

    private note(reason: string) { this.issues[reason] = (this.issues[reason] || 0) + 1; }

    /** Weekly counts so far, for the next AI prompt ("classId_subjectId": n). */
    scheduledCounts(): Record<string, number> {
        const out: Record<string, number> = {};
        this.perWeek.forEach((n, k) => { out[k.replace('|', '_')] = n; });
        return out;
    }

    /** Checks one proposed lesson; returns it (cleaned) when accepted. */
    add(raw: any): ValidatedEntry | null {
        const classId = String(raw?.classId || '');
        const slot = this.slotById.get(String(raw?.timeSlotId || ''));
        const subjectId = raw?.subjectId ? String(raw.subjectId) : '';
        const cls = this.classById.get(classId);
        if (!subjectId) { this.note('free periods left empty'); return null; }
        if (!cls) { this.note('unknown class'); return null; }
        if (!slot) { this.note('unknown time slot'); return null; }
        if (!isLessonSlot(slot)) { this.note('lessons placed in a break/lunch/worship slot'); return null; }
        if (!slotAppliesToClass(slot, classId)) { this.note("lessons placed in another class's slot"); return null; }
        const subject = this.subjectById.get(subjectId);
        if (!subject) { this.note('unknown subject'); return null; }
        if (Array.isArray(subject.targetClasses) && subject.targetClasses.length > 0) {
            const name = String(cls.name || '').toLowerCase();
            const ok = subject.targetClasses.some(t => t === classId || String(t || '').toLowerCase() === name);
            if (!ok) { this.note('subjects placed in a class that does not take them'); return null; }
        }
        const classSlotKey = `${classId}|${slot.id}`;
        if (this.taken.has(classSlotKey) || (this.classBusy.get(classId) || []).some(b => slotsOverlap(b, slot))) { this.note('double-booked class periods'); return null; }
        const weekKey = `${classId}|${subjectId}`;
        const limit = Number(subject.weeklyPeriods) > 0 ? Number(subject.weeklyPeriods) : 3;
        if ((this.perWeek.get(weekKey) || 0) >= limit) { this.note('lessons beyond the weekly periods'); return null; }

        // Teacher: must be a real teacher of the school (or one allowed for the subject / the class teacher).
        let teacherId = raw?.teacherId && raw.teacherId !== 'TBA' ? String(raw.teacherId) : '';
        const allowed = new Set<string>([...(subject.allowedTeacherIds || []), ...(cls.classTeacherId ? [cls.classTeacherId] : [])]);
        if (teacherId && !this.teacherById.has(teacherId)) { this.note('unknown teachers removed'); teacherId = ''; }
        if (teacherId && (subject.allowedTeacherIds || []).length > 0 && !allowed.has(teacherId)) { this.note('teachers not assigned to the subject removed'); teacherId = ''; }
        if (teacherId) {
            const busy = this.teacherBusy.get(teacherId) || [];
            if (busy.some(b => slotsOverlap(b, slot))) { this.note('teacher clashes (same teacher, same time)'); return null; }
        }

        // Room: real room, not used by another class at the same time; otherwise the class's home room / none.
        let roomId = raw?.roomId && raw.roomId !== 'TBA' ? String(raw.roomId) : '';
        if (roomId && !this.roomById.has(roomId)) roomId = '';
        const roomFree = (rid: string) => !(this.roomBusy.get(rid) || []).some(b => b.classId !== classId && slotsOverlap(b.slot, slot));
        if (roomId && !roomFree(roomId)) { this.note('room clashes (room changed)'); roomId = ''; }
        if (!roomId && cls.homeRoomId && this.roomById.has(cls.homeRoomId) && roomFree(cls.homeRoomId)) roomId = cls.homeRoomId;

        this.taken.add(classSlotKey);
        this.classBusy.set(classId, [...(this.classBusy.get(classId) || []), slot]);
        this.perWeek.set(weekKey, (this.perWeek.get(weekKey) || 0) + 1);
        if (teacherId) this.teacherBusy.set(teacherId, [...(this.teacherBusy.get(teacherId) || []), slot]);
        if (roomId) this.roomBusy.set(roomId, [...(this.roomBusy.get(roomId) || []), { slot, classId }]);

        const entry: ValidatedEntry = {
            id: timetableEntryId(this.ctx.schoolId, classId, slot.id),
            schoolId: this.ctx.schoolId,
            classId,
            timeSlotId: slot.id,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            subjectId,
            subjectName: subject.name || '',
            teacherId,
            teacherName: teacherId ? (this.teacherById.get(teacherId)?.name || '') : '',
            roomId,
            roomName: roomId ? (this.roomById.get(roomId)?.name || '') : '',
        };
        this.accepted.push(entry);
        return entry;
    }
}

/**
 * Checks for the manual "Assign lesson" dialog. Returns a message describing the clash, or null when fine.
 * `entries` are the school's current lessons; `ignoreId` is the lesson being edited.
 */
export function findManualClash(args: {
    entries: Array<{ id: string; classId: string; timeSlotId: string; teacherId?: string; roomId?: string; day?: string; startTime?: string; endTime?: string }>;
    slots: SlotLike[];
    classId: string; timeSlotId: string; teacherId: string; roomId?: string; ignoreId?: string;
    describeClass?: (id: string) => string;
}): string | null {
    const slotById = new Map(args.slots.map(s => [s.id, s]));
    const target = slotById.get(args.timeSlotId);
    if (!target) return 'That time slot no longer exists.';
    const slotOf = (e: any): SlotLike | undefined =>
        slotById.get(e.timeSlotId) || (e.day && e.startTime ? { id: e.timeSlotId, day: e.day, startTime: e.startTime, endTime: e.endTime || e.startTime } : undefined);
    const name = (id: string) => (args.describeClass ? args.describeClass(id) : id);
    for (const e of args.entries) {
        if (e.id === args.ignoreId) continue;
        const s = slotOf(e);
        if (!s || !slotsOverlap(s, target)) continue;
        if (e.classId === args.classId) return `This class already has a lesson at ${s.day} ${s.startTime}. Edit that lesson instead.`;
        if (args.teacherId && e.teacherId === args.teacherId) return `This teacher is already teaching ${name(e.classId)} at ${s.day} ${s.startTime}.`;
        if (args.roomId && e.roomId === args.roomId) return `This room is already used by ${name(e.classId)} at ${s.day} ${s.startTime}.`;
    }
    return null;
}
