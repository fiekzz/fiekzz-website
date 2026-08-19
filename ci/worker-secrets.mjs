// Emits only the vars the Worker reads at runtime (via $env/dynamic/private),
// as JSON for `wrangler secret bulk`. The whitelist is deliberate - see
// docs/ci-cd.md's "How secrets actually reach the app" table for which vars
// are build-time-only (compiled into the bundle, never need to be here) vs
// seed-script-only (never needed by the Worker at all).
const RUNTIME_KEYS = [
	'DATABASE_URL',
	'AUTHENTIK_BASE_URL',
	'AUTHENTIK_CLIENT_ID',
	'AUTHENTIK_CLIENT_SECRET',
	'AUTHENTIK_REDIRECT_URI',
	'AUTHENTIK_END_SESSION_URL',
	'OUTLINE_API_URL',
	'OUTLINE_API_TOKEN'
];

const out = {};
for (const key of RUNTIME_KEYS) {
	if (!process.env[key]) throw new Error(`missing ${key} in Infisical`);
	out[key] = process.env[key];
}
process.stdout.write(JSON.stringify(out));
