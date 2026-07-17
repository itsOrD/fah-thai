/**
 * Polls an environment's version.json until it serves the expected commit SHA.
 *
 *   tsx pipeline/wait-for-deploy.ts --url https://…/fah-thai/test/ --sha <sha> [--timeout-sec 360]
 *
 * GitHub Pages deploys are queued and propagate slowly — deploy-action
 * success does not mean the site is serving the new build (this repo's first
 * deploy 404'd for ~60s). Every smoke gate runs this first; cache-busting
 * query params defeat the ~10-minute Pages CDN cache headers.
 */
export {}; // top-level await needs module context

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (key?.startsWith('--') && value) args.set(key.slice(2), value);
}

const url = args.get('url');
const sha = args.get('sha');
const timeoutSec = Number(args.get('timeout-sec') ?? 360);
if (!url || !sha) {
  console.error('usage: wait-for-deploy --url <env base url> --sha <commit sha> [--timeout-sec 360]');
  process.exit(2);
}

const deadline = Date.now() + timeoutSec * 1000;
let attempt = 0;

while (Date.now() < deadline) {
  attempt += 1;
  try {
    const res = await fetch(`${url}version.json?cb=${Date.now()}`, {
      headers: { 'cache-control': 'no-cache' },
    });
    if (res.ok) {
      const body = (await res.json()) as { sha?: string };
      if (body.sha === sha) {
        console.log(`live after ${attempt} attempt(s): ${url} serves ${sha}`);
        process.exit(0);
      }
      console.log(`attempt ${attempt}: serving ${body.sha ?? '?'} (want ${sha})`);
    } else {
      console.log(`attempt ${attempt}: HTTP ${res.status}`);
    }
  } catch (err) {
    console.log(`attempt ${attempt}: ${err instanceof Error ? err.message : String(err)}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 15_000));
}

console.error(`timed out after ${timeoutSec}s waiting for ${url} to serve ${sha}`);
process.exit(1);
