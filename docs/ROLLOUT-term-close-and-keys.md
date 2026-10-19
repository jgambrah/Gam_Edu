# Rollout: term close, ledgers, academic close, secret keys

Schools are live, so roll out in this order. Every step can be repeated safely.

1. **Deploy the web app** (push to Vercel). It reads keys from the new secure store *and* the old locations, so payments, SMS and WhatsApp keep working before the migration.
2. **Deploy database rules and functions**: `cd functions && npm run build`, then `firebase deploy --only firestore:rules,functions`.
3. **Test with a teacher account**: mark attendance, enter marks, save a report card. If a teacher is blocked, their account is missing a `staff` document or role; fix the account (or roll back the rules from git) before continuing.
4. **Move the keys out of public documents**: `cd functions && node migrate-school-secrets.js` (report only), then `node migrate-school-secrets.js --apply`.
5. **Replace the keys** (the old ones were readable): new Paystack secret key, new SMS API key, new UltraMsg token. Enter them in Admin > School Profile and save.
6. **Stamp terms on existing bills**: `node backfill-term-stamps.js` (report only), then `--apply`.
7. **At the end of each term**: Finance Settings > End of Term (dry run, check, close), then Report Cards > Close Term (Academics) (choose the term, dry run, check, close).
