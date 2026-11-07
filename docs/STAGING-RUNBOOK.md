# Staging runbook (isolated from production, synthetic data only)

**Status: prepared, NOT executed.** Creating a Firebase project needs your Google account; nothing here has been created.

## What needs your approval first
1. **Billing.** Per Firebase's [Storage FAQ](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024), a new project cannot create a Cloud Storage bucket on the free Spark plan — it needs the **Blaze (pay-as-you-go)** plan. Storage rules cannot be tested for real without a bucket. Blaze includes a no-cost tier for a bucket in `us-central1`/`us-east1`/`us-west1` ("Always Free" regions). Our synthetic test data (a few small files) would normally cost nothing, but it **does require attaching a billing account** — your decision.
   - Cost controls if you approve: create the project in `us-central1`; set a **budget alert at a small amount** (e.g. $1) in Cloud Billing; do not enable any other paid service; delete the project when finished.
   - If you decline billing: staging can still cover **Firestore + Auth** on Spark; **Storage rules** remain covered only by the emulator tests in CI (already green) and cannot be verified in a real project.
2. **IAM / account-level.** Publishing Storage rules that read Firestore (`firestore.get/exists`) triggers a one-time prompt to grant the Storage service account the *Firebase Rules Firestore Service Agent* role **on the staging project only**. Needs project Owner (you).
3. **Credentials.** A staging service-account key (or you run the commands yourself). I have no credentials in this sandbox and will not use production ones.

## Isolation rules
- Project id **must** start with `gamedu-staging` (the seed script refuses anything else, and refuses production `gamedu-69888475-f5783`).
- Separate Firebase project, Auth, Firestore, Storage bucket. No production keys in staging config. The staging web app uses its own `NEXT_PUBLIC_FIREBASE_*` env values (a local `.env.staging`, never committed).
- No real student, parent or financial data: only the synthetic accounts below.

## Steps (you, or me with your credentials)
1. Console → create project `gamedu-staging-<suffix>` (region `us-central1`); upgrade to Blaze only if you approve; set the budget alert.
2. Enable Authentication (Email/Password), Firestore (production mode), Storage.
3. Create the 10 synthetic logins (password: any strong throw-away):
   `director.a@`, `registrar.a@`, `teacher.a@`, `accountant.a@`, `pupil.a@`, `parent.a@`, `director.b@`, `teacher.b@`, `pupil.b@`, `parent.b@` — all `@staging.example`.
4. `FIREBASE_PROJECT_ID=gamedu-staging-<suffix> npx tsx scripts/staging/seed-synthetic.ts` → writes two synthetic schools and links each login's profile documents (`users/staff/students/parents`).
5. Deploy the rules **to staging only**: `firebase deploy --only storage,firestore:rules --project gamedu-staging-<suffix>` (from the branch under test; the production `.firebaserc` default is never used).
6. Run the app locally against staging and walk the matrix below. Record pass/fail.
7. Delete the project (or disable billing) when done.

## Workflow matrix (each = upload, download/view, delete; run as the roles listed; A = own school, B = other school)
| Workflow (Storage path) | Must work | Must be denied |
|---|---|---|
| School logo (`schools/{id}/assets/…`) | director.a uploads/replaces/deletes; all A roles view | teacher.a / pupil.a write; anyone in B read/write |
| Website media (`…/website/…`) | director.a, registrar.a manage; A roles view | teacher/pupil/parent write; B any |
| Pupil photo (`…/students/{pupil}/profile_pic`) | registrar/director/teacher.a upload; pupil.a and parent.a (own child) view | parent.a write; B any; pupil.a viewing another pupil |
| Pupil timeline attachments | teacher.a upload/view/delete own | parent write; B any |
| Assignment submission (`…/submissions/{asg}/{pupil}/…`) | pupil.a uploads/replaces own; teacher.a views; | pupil.a writing in another pupil's folder; B any |
| Learning materials | teacher.a upload; pupil.a, parent.a view | pupil write; B any |
| Chat attachments (`…/chats/{chat}/…`) | chat participants upload/view | non-participants; B any |
| Signatures (`signatures/{id}/{uid}/…`) | owner uploads own; admins view | other users write |
| Staff clock-in selfie (server-written) | teacher.a clocks in (server); director views | teacher reading a colleague's |
| Story Spark cover (`…/junior_stories/…`) | teacher.a saves cover; A roles view | pupil.a write; teacher.b writing into A |
| **Firestore (hardening branch)** | | |
| POS (`pos_transactions`) | accountant.a creates/reads own school | pupil/parent/teacher.b read |
| Assignments / submissions / grading | teacher.a creates & grades; pupil.a submits own | teacher.b grades A; pupil.a sets grade |
| Receipt / student counters | accountant.a / registrar.a issue numbers | rewinding; B counters |
| Class stories | teacher.a posts; parent.a likes & comments | parent.a edits; B any |
| Direct messages | any two users chat; lists show only own chats | listing others' chats |
| Absence alerts (`notification_queue`) | teacher.a takes register → queue entry | pupil/parent write; B read |
| Audit log | director.a reads school log; staff write own entries | forging another user's entry; pupil/parent read |
