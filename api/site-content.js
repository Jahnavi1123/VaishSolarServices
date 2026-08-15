const { Pool } = require('pg');
const crypto = require('crypto');

let pool;
const MAX_CONTENT_BYTES = 3 * 1024 * 1024;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('The database connection has not been configured.');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function ensureTable(database) {
  await database.query(`
    CREATE TABLE IF NOT EXISTS site_content_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content JSONB NOT NULL DEFAULT '{"version": 1, "pages": {}}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function send(response, status, body) {
  return response.status(status).json(body);
}

function verifyToken(request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!secret || !token || token.indexOf('.') === -1) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, providedSignature] = parts;
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const supplied = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(decoded.exp) && decoded.exp > Date.now();
  } catch (error) {
    return false;
  }
}

function validContent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!value.pages || typeof value.pages !== 'object' || Array.isArray(value.pages)) return false;
  try {
    return Buffer.byteLength(JSON.stringify(value), 'utf8') <= MAX_CONTENT_BYTES;
  } catch (error) {
    return false;
  }
}

module.exports = async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'GET, PUT, OPTIONS');
    return response.status(204).end();
  }

  if (request.method !== 'GET' && request.method !== 'PUT') {
    response.setHeader('Allow', 'GET, PUT, OPTIONS');
    return send(response, 405, { error: 'Method not allowed.' });
  }

  try {
    if (request.method === 'PUT' && !verifyToken(request)) {
      return send(response, 401, { error: 'Your admin session has expired. Please sign in again.' });
    }

    const database = getPool();
    await ensureTable(database);

    if (request.method === 'GET') {
      const result = await database.query('SELECT content, updated_at FROM site_content_settings WHERE id = 1');
      const row = result.rows[0];
      return send(response, 200, row ? { ...row.content, updatedAt: row.updated_at } : { version: 1, pages: {} });
    }

    const content = request.body;
    if (!validContent(content)) {
      return send(response, 400, { error: 'Invalid content payload. Image uploads must keep the saved content below 3 MB.' });
    }

    const result = await database.query(
      `INSERT INTO site_content_settings (id, content, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING updated_at`,
      [content]
    );
    return send(response, 200, { success: true, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    console.error('Unable to manage site content', error);
    return send(response, 500, { error: 'The content service is unavailable. Please try again.' });
  }
};
