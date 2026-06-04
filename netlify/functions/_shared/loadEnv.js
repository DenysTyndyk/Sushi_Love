'use strict';

const fs = require('fs');
const path = require('path');

let loaded = false;

/** Load root `.env` for local `functions:serve` (Netlify injects env in production). */
function loadLocalEnv() {
  if (loaded) return;
  loaded = true;
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) return;

  const envPath = path.resolve(__dirname, '../../../.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

module.exports = { loadLocalEnv };
