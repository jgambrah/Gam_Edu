/**
 * Firestore-emulator backend for the seeder. EMULATOR ONLY.
 *
 * Deliberately does NOT import src/lib/firebaseAdmin.ts: that module falls back to real credentials. This one builds
 * its own isolated app, and only after `assertEmulatorOnly` has refused anything that could reach production.
 */
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { assertEmulatorOnly } from './guard';
import { TransientError, type Doc, type PutResult, type SeedBackend, type Tx } from './types';

/** gRPC codes worth retrying: ABORTED (contention), DEADLINE_EXCEEDED, UNAVAILABLE, RESOURCE_EXHAUSTED. */
const RETRYABLE = new Set([4, 8, 10, 14]);
const asTransient = (e: unknown): never => {
  const code = (e as { code?: number }).code;
  if (typeof code === 'number' && RETRYABLE.has(code)) throw new TransientError(`firestore code ${code}: ${(e as Error).message}`);
  throw e;
};

export interface ObjectStore {
  putIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha256: string): Promise<PutResult>;
  get(path: string): Promise<Uint8Array | undefined>;
  has(path: string): Promise<boolean>;
  /** Create-only server-side copy. */
  copyIfAbsent(from: string, to: string, contentType: string): Promise<PutResult>;
}

/** Objects kept in memory (default for Firestore-only emulator runs). */
export class MemoryObjectStore implements ObjectStore {
  objects = new Map<string, { size: number; sha: string; bytes: Uint8Array }>();
  async putIfAbsent(path: string, bytes: Uint8Array, _ct: string, sha: string): Promise<PutResult> {
    const e = this.objects.get(path);
    if (e) return e.sha === sha ? 'exists_same' : 'exists_different';
    this.objects.set(path, { size: bytes.length, sha, bytes: Uint8Array.from(bytes) });
    return 'created';
  }
  async get(path: string) { const o = this.objects.get(path); return o ? Uint8Array.from(o.bytes) : undefined; }
  async has(path: string) { return this.objects.has(path); }
  async copyIfAbsent(from: string, to: string): Promise<PutResult> {
    const src = this.objects.get(from); if (!src) throw new Error(`copy source missing: ${from}`);
    const e = this.objects.get(to);
    if (e) return e.sha === src.sha ? 'exists_same' : 'exists_different';
    this.objects.set(to, { ...src, bytes: Uint8Array.from(src.bytes) });
    return 'created';
  }
}

/** Create-only upload into the Storage EMULATOR (generation precondition = 0, so an existing object is never overwritten). */
export class StorageEmulatorObjectStore implements ObjectStore {
  constructor(private bucket: ReturnType<ReturnType<typeof getStorage>['bucket']>) {}
  async putIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha: string): Promise<PutResult> {
    const file = this.bucket.file(path);
    const [already] = await file.exists();
    if (already) {
      const [meta] = await file.getMetadata();
      return meta.metadata?.sha256 === sha ? 'exists_same' : 'exists_different';
    }
    try {
      await file.save(Buffer.from(bytes), {
        resumable: false,
        contentType,
        metadata: { metadata: { sha256: sha } },
        preconditionOpts: { ifGenerationMatch: 0 },
      });
      return 'created';
    } catch (e) {
      const code = (e as { code?: number }).code;
      if (code !== 412) throw e;
      const [meta] = await file.getMetadata();
      return meta.metadata?.sha256 === sha ? 'exists_same' : 'exists_different';
    }
  }
  async get(path: string) {
    const f = this.bucket.file(path);
    const [ok] = await f.exists();
    if (!ok) return undefined;
    const [buf] = await f.download();
    return new Uint8Array(buf);
  }
  async has(path: string) { const [ok] = await this.bucket.file(path).exists(); return ok; }
  async copyIfAbsent(from: string, to: string, contentType: string): Promise<PutResult> {
    const src = this.bucket.file(from);
    const [srcOk] = await src.exists();
    if (!srcOk) throw new Error(`copy source missing: ${from}`);
    const [srcMeta] = await src.getMetadata();
    const sha = srcMeta.metadata?.sha256 as string | undefined;
    const dst = this.bucket.file(to);
    const [dstOk] = await dst.exists();
    if (dstOk) { const [m] = await dst.getMetadata(); return m.metadata?.sha256 === sha ? 'exists_same' : 'exists_different'; }
    try {
      await src.copy(dst, { preconditionOpts: { ifGenerationMatch: 0 }, contentType, metadata: { metadata: { sha256: sha } } } as never);
      return 'created';
    } catch (e) {
      if ((e as { code?: number }).code !== 412) throw e;
      const [m] = await dst.getMetadata(); return m.metadata?.sha256 === sha ? 'exists_same' : 'exists_different';
    }
  }
}

export class FirestoreBackend implements SeedBackend {
  constructor(private db: Firestore, private objects: ObjectStore) {}
  now() { return Date.now(); }
  putObjectIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha256: string) {
    return this.objects.putIfAbsent(path, bytes, contentType, sha256);
  }
  getObject(path: string) { return this.objects.get(path); }
  hasObject(path: string) { return this.objects.has(path); }
  copyObjectIfAbsent(from: string, to: string, contentType: string) { return this.objects.copyIfAbsent(from, to, contentType); }
  transact<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    return this.db.runTransaction(async (t) => {
      const tx: Tx = {
        get: async (path) => { const s = await t.get(this.db.doc(path)); return s.exists ? (s.data() as Doc) : undefined; },
        set: (path, data) => { t.set(this.db.doc(path), data); },
        delete: (path) => { t.delete(this.db.doc(path)); },
      };
      return fn(tx);
    }).catch(asTransient);
  }
  async listDocs(collectionPath: string) {
    const snap = await this.db.collection(collectionPath).get().catch(asTransient);
    return snap.docs.map((d) => ({ id: d.id, data: d.data() as Doc }));
  }
}

export interface EmulatorBackend {
  backend: FirestoreBackend;
  db: Firestore;
  objects: ObjectStore;
  close(): Promise<void>;
}

/** Build a backend against the emulators, or throw `SeederGuardError`. */
export function createEmulatorBackend(projectId: string, opts: { useStorageEmulator?: boolean; env?: NodeJS.ProcessEnv; appName?: string } = {}): EmulatorBackend {
  const env = opts.env ?? process.env;
  assertEmulatorOnly(projectId, env, { needStorage: !!opts.useStorageEmulator });
  const app: App = initializeApp({ projectId, storageBucket: `${projectId}.appspot.com` }, opts.appName ?? `seeder-${projectId}-${Date.now()}`);
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  const objects: ObjectStore = opts.useStorageEmulator ? new StorageEmulatorObjectStore(getStorage(app).bucket()) : new MemoryObjectStore();
  return { backend: new FirestoreBackend(db, objects), db, objects, close: () => deleteApp(app) };
}
