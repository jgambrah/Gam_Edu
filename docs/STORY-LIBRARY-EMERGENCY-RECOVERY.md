# Story Library: emergency recovery procedure — design

Status: **design for approval. Not built, not deployed, no cloud resources created.**

## Principle

Super admins stay central publishers and follow the **same independent approval workflow** as everyone else (Stage 1 rules, now enforced:
the super-admin blanket write rule excludes the four library collections). Ordinary client writes can never bypass publication approval.

Emergencies still happen (a wrong-licence story is live, a harmful page slipped through, a bad publish broke the catalogue). So there is
**one separate, server-side, audited procedure**, designed around a deliberate asymmetry: **taking content down is fast; putting content up is never an emergency action.**

## What the procedure can do (and cannot)

| Action | Allowed in an emergency | Effect |
|---|---|---|
| Emergency unpublish of a story | yes | catalogue entry → `archived` tombstone, `library_meta.catalogueVersion` bumped; clients drop it on their next session start |
| Roll the catalogue back to the previous catalogue version | yes | restores the prior set of published entries from the immutable package history (packages are immutable and versioned, so nothing is rebuilt) |
| Disable a school's access (`storyLibraryEnabled: false`) or a licence | yes | catalogue hidden immediately; protected-file revocation follows the access-control proposal (R ≈ 11 min for licensed content) |
| Publish new or edited content | **no** | always the normal four-eyes workflow |
| Edit the content of an approved/published story | **no** | publish a new version through the workflow |
| Delete audit records | **no** | – |

## How it is run

* **Server-side only**, with the Admin SDK: a small, separately deployed callable or a CLI run from a controlled machine. Never reachable from the web app's client SDK; Firestore rules still deny client writes to every library collection.
* **Two named people**: a *requester* and an *approver*, both authorised central publishers, **not the same person**. Both authenticate; the approver's confirmation is bound to the exact action (story id / school id / target version) and expires in 30 minutes.
* **Mandatory fields**: reason (free text), incident or ticket reference, and the exact action. No wildcard actions: one story, one school, or one catalogue rollback per execution.
* **Rate limit**: at most 10 actions per hour; more requires a second approval round.
* **Idempotent and reversible**: an unpublish is an archive tombstone, not a delete; the reverse is an ordinary `archived → review → approved → published` workflow run by humans.

## Audit

* Every attempt (allowed or refused) appends a record to `library_audit/{autoId}`: who requested, who approved, action, target, reason, ticket, before/after status, timestamp, result.
  Rules: publishers read; **no client writes** (Admin SDK only).
* The same record is written to Cloud Logging; a log sink to a retention-locked bucket gives an audit trail the application itself cannot alter. *(Creating the sink and bucket is a cloud resource: needs your approval.)*
* Each use raises an alert to the platform owners. Reviewed monthly even when nothing happened.

## Recovery of damaged data (separate from takedown)

Deleted or corrupted data is restored from backup, not by this procedure: Firestore point-in-time recovery and scheduled backups, and Storage object versioning for the `published/` prefix.
Both are billed features that are **not enabled** and need your approval before anyone relies on them. Until then the protection is: published content is never deleted by design (archive only), packages are immutable and content-addressed, and Stage 1 rules refuse client deletes of anything past draft.

## Test plan (emulator-first, when approved)

1. Same-person request/approve refused. 2. Approver outside the publisher set refused. 3. Expired approval refused. 4. Each allowed action leaves exactly one audit record, even when the action fails. 5. The procedure cannot publish, edit content, or touch `library_audit` records. 6. Rules: no client (publisher or super admin) can write `library_audit` or the library collections outside the normal workflow. 7. Unpublish then verify `catalogueVersion` moved and clients drop the story (catalogue-client delta test).

## Decision requested

Approve the design in principle; build in a later stage, emulator-first. Cloud resources (log sink, retention bucket, backups/PITR, a deployed callable) need separate approval.
