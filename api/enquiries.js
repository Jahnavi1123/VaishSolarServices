const { Pool } = require('pg');

let pool;

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

function text(value, field, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`Please provide a valid ${field}.`);
  }
  return value.trim();
}

function number(value, field, min, max) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < min || result > max) {
    throw new Error(`Please provide a valid ${field}.`);
  }
  return result;
}

async function ensureTable(database) {
  await database.query(`
    CREATE TABLE IF NOT EXISTS solar_enquiries (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      full_name VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      power_phase VARCHAR(12) NOT NULL,
      system_preference VARCHAR(12) NOT NULL,
      calculator_data JSONB NOT NULL
    )
  `);
}

module.exports = async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = request.body || {};
    const fullName = text(body.fullName, 'full name', 120);
    const phone = text(body.phone, 'phone number', 20);
    const address = text(body.address, 'installation address', 500);
    const powerPhase = body.powerPhase === 'single' || body.powerPhase === 'three' ? body.powerPhase : null;
    const systemPreference = body.systemPreference === 'on-grid' || body.systemPreference === 'off-grid' ? body.systemPreference : null;

    if (!powerPhase || !systemPreference) {
      throw new Error('Please select a valid power phase and system preference.');
    }

    const calculatorData = {
      tariffRate: number(body.tariffRate, 'tariff rate', 1, 100),
      billAmount: number(body.billAmount, 'monthly electricity bill', 1, 10000000),
      roofArea: number(body.roofArea, 'rooftop area', 1, 1000000),
      roofUnit: body.roofUnit === 'sqft' || body.roofUnit === 'sqm' ? body.roofUnit : null,
      sanctionedLoad: number(body.sanctionedLoad, 'sanctioned load', 0.1, 100000),
      onGridModel: body.onGridModel || {},
      offGridModel: body.offGridModel || {}
    };

    if (!calculatorData.roofUnit) {
      throw new Error('Please select a valid rooftop-area unit.');
    }

    if (systemPreference === 'off-grid') {
      calculatorData.offGridInputs = {
        criticalLoad: number(body.criticalLoad, 'critical load', 0.1, 100000),
        backupHours: number(body.backupHours, 'backup hours', 1, 72),
        acCount: number(body.acCount, 'number of AC units', 0, 100)
      };
    }

    const database = getPool();
    await ensureTable(database);
    const result = await database.query(
      `INSERT INTO solar_enquiries (full_name, phone, address, power_phase, system_preference, calculator_data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [fullName, phone, address, powerPhase, systemPreference, calculatorData]
    );

    return response.status(201).json({
      success: true,
      enquiryId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Unable to save solar enquiry', error);
    const isClientError = error.message.startsWith('Please provide') || error.message.startsWith('Please select');
    return response.status(isClientError ? 400 : 500).json({
      error: isClientError ? error.message : 'We could not save your enquiry. Please try again.'
    });
  }
};
