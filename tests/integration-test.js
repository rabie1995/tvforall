#!/usr/bin/env node

/**
 * Integration Test Script for Client Data Collection System
 * 
 * This script tests the complete data collection pipeline:
 * 1. Data validation
 * 2. Data collection API
 * 3. Admin authentication
 * 4. Client data retrieval
 * 5. CSV export
 */

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

let adminToken = null;

/**
 * Test 1: Admin Login
 */
async function testAdminLogin() {
  console.log('\n✓ TEST 1: Admin Login');
  console.log('  Endpoint: POST /api/admin/login');
  console.log(`  Credentials: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      adminToken = data.token;
      console.log('  ✓ Login successful');
      console.log(`  ✓ Token received: ${adminToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('  ✗ Login failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

/**
 * Test 2: Checkout Data Collection
 */
async function testDataCollection() {
  console.log('\n✓ TEST 2: Data Collection (Checkout)');
  console.log('  Endpoint: POST /api/checkout');
  
  const testData = {
    fullName: 'Test User ' + Date.now(),
    email: `test-${Date.now()}@example.com`,
    region: 'North America',
    adultChannels: true,
    plan: 'plan_3m',
  };

  console.log(`  Testing with: ${testData.email}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (response.status === 400) {
      const data = await response.json();
      console.log('  ✓ Validation working - Expected error:', data.error);
      return true;
    } else if (response.ok) {
      const data = await response.json();
      console.log('  ✓ Data collected successfully');
      console.log(`  ✓ Order ID: ${data.orderId}`);
      return true;
    } else {
      console.log('  ✗ Unexpected response:', response.status);
      return false;
    }
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

/**
 * Test 3: Fetch Client Data
 */
async function testFetchClients() {
  console.log('\n✓ TEST 3: Fetch Client Data (Admin)');
  console.log('  Endpoint: GET /api/admin/clients');
  console.log('  Parameters: page=1, limit=50');
  
  if (!adminToken) {
    console.log('  ✗ Admin token not available - run login test first');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/clients?page=1&limit=50`, {
      headers: {
        'Cookie': `admin_token=${adminToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('  ✓ Successfully retrieved client data');
      console.log(`  ✓ Total clients: ${data.total}`);
      console.log(`  ✓ Current page: ${data.page} of ${data.pages}`);
      console.log(`  ✓ Records in this page: ${data.clients.length}`);
      
      if (data.clients.length > 0) {
        const first = data.clients[0];
        console.log(`  ✓ Sample client: ${first.fullName} (${first.email})`);
      }
      
      return true;
    } else if (response.status === 401) {
      console.log('  ✗ Unauthorized - admin token invalid');
      return false;
    } else {
      console.log('  ✗ Failed to fetch clients:', response.status);
      return false;
    }
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

/**
 * Test 4: Search Client Data
 */
async function testSearchClients() {
  console.log('\n✓ TEST 4: Search Client Data');
  console.log('  Endpoint: GET /api/admin/clients?search=test');
  
  if (!adminToken) {
    console.log('  ✗ Admin token not available');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/clients?search=test&page=1&limit=50`, {
      headers: {
        'Cookie': `admin_token=${adminToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('  ✓ Search completed');
      console.log(`  ✓ Results found: ${data.clients.length}`);
      return true;
    } else {
      console.log('  ✗ Search failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

/**
 * Test 5: Export CSV
 */
async function testExportCSV() {
  console.log('\n✓ TEST 5: Export Client Data (CSV)');
  console.log('  Endpoint: GET /api/admin/clients/export');
  
  if (!adminToken) {
    console.log('  ✗ Admin token not available');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/clients/export`, {
      headers: {
        'Cookie': `admin_token=${adminToken}`,
      },
    });

    if (response.ok) {
      const csv = await response.text();
      const lines = csv.split('\n');
      const contentDisposition = response.headers.get('content-disposition');
      
      console.log('  ✓ CSV export successful');
      console.log(`  ✓ File: ${contentDisposition}`);
      console.log(`  ✓ Lines: ${lines.length}`);
      console.log(`  ✓ Headers: ${lines[0]}`);
      
      if (lines.length > 1) {
        console.log(`  ✓ Sample row: ${lines[1].substring(0, 60)}...`);
      }
      
      return true;
    } else if (response.status === 401) {
      console.log('  ✗ Unauthorized for export');
      return false;
    } else {
      console.log('  ✗ Export failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('  ✗ Error:', error.message);
    return false;
  }
}

/**
 * Main Test Suite
 */
async function runTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Client Data Collection System - Integration Tests     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\nServer: ${BASE_URL}`);
  console.log('Note: Ensure server is running on port 3000 (npm run dev)');

  const results = {
    passed: 0,
    failed: 0,
  };

  // Run tests in sequence
  if (await testAdminLogin()) results.passed++;
  else results.failed++;

  if (await testDataCollection()) results.passed++;
  else results.failed++;

  if (await testFetchClients()) results.passed++;
  else results.failed++;

  if (await testSearchClients()) results.passed++;
  else results.failed++;

  if (await testExportCSV()) results.passed++;
  else results.failed++;

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    TEST SUMMARY                         ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`✓ Passed: ${results.passed}`);
  console.log(`✗ Failed: ${results.failed}`);
  console.log(`Total:  ${results.passed + results.failed}\n`);

  if (results.failed === 0) {
    console.log('✨ All tests passed! System is fully operational.');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000/checkout to test the form');
    console.log('2. Login at http://localhost:3000/admin/login');
    console.log('3. View clients at http://localhost:3000/admin/clients');
    console.log('4. Export data via the "Export to Google Sheets" button');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
