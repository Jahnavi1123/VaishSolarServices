const crypto = require('crypto');

function send(response, status, body) {
  return response.status(status).json(body);
}

function passwordMatches(value, expected) {
  if (typeof value !== 'string' || !expected) return false;
  const supplied = Buffer.from(value);
  const configured = Buffer.from(expected);
  return supplied.length === configured.length && crypto.timingSafeEqual(supplied, configured);
}

function makeToken(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

module.exports = async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return send(response, 405, { error: 'Method not allowed.' });
  }

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    return send(response, 503, { error: 'Admin access has not been configured.' });
  }

  if (!passwordMatches(request.body && request.body.password, password)) {
    return send(response, 401, { error: 'Incorrect password.' });
  }

  return send(response, 200, { token: makeToken(secret), expiresIn: 8 * 60 * 60 });
};
