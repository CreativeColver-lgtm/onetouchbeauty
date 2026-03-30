// Deploy schema to Supabase using the service role key and the SQL API
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://cguyvppsppxbvstjqmje.supabase.co';
const SERVICE_ROLE_KEY = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
  .split('\n')
  .find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY='))
  ?.split('=')
  .slice(1)
  .join('=')
  .trim();

async function runSQL(sql, label) {
  console.log(`\n=== Running: ${label} ===`);
  
  // Use the Supabase pg-meta SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'x-supabase-service-role': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    // Try alternative endpoint
    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ sql }),
    });
    
    if (!res2.ok) {
      const text = await res.text();
      const text2 = await res2.text();
      console.error(`Failed: ${label}`);
      console.error(`  Endpoint 1: ${res.status} ${text.slice(0, 200)}`);
      console.error(`  Endpoint 2: ${res2.status} ${text2.slice(0, 200)}`);
      return false;
    }
    console.log(`✅ ${label} (via rpc)`);
    return true;
  }
  
  const data = await res.json();
  if (data.error) {
    console.error(`Error: ${data.error}`);
    return false;
  }
  console.log(`✅ ${label}`);
  return true;
}

// Try splitting into individual statements and running via PostgREST
async function runSQLStatements(sql, label) {
  console.log(`\n=== Running: ${label} ===`);
  
  // First try the whole thing
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  
  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text.slice(0, 500)}`);
  return res.ok;
}

async function main() {
  const schema = readFileSync(join(__dirname, '01-schema.sql'), 'utf8');
  const rls = readFileSync(join(__dirname, '02-rls.sql'), 'utf8');
  const seed = readFileSync(join(__dirname, '03-seed.sql'), 'utf8');

  // Try different API endpoints to find one that works
  console.log('Testing API endpoints...');
  
  // Test 1: pg/query
  const test1 = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: 'SELECT 1 as test' }),
  });
  console.log(`pg/query: ${test1.status} ${(await test1.text()).slice(0, 200)}`);
  
  // Test 2: graphql to check if we can introspect
  const test2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'GET',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  console.log(`rpc list: ${test2.status}`);

  // Test 3: Try the management API with project ref
  const projectRef = 'cguyvppsppxbvstjqmje';
  const test3 = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: 'SELECT 1' }),
  });
  console.log(`management API: ${test3.status} ${(await test3.text()).slice(0, 200)}`);

  // If pg/query worked, run our schemas
  if (test1.status === 200) {
    await runSQLStatements(schema, 'Schema');
    await runSQLStatements(rls, 'RLS Policies');
    await runSQLStatements(seed, 'Seed Data');
  } else {
    console.log('\nNo direct SQL endpoint available.');
    console.log('Falling back to individual REST API calls...');
  }
}

main().catch(console.error);
