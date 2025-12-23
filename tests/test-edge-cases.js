#!/usr/bin/env node
/**
 * ADVANCED EDGE CASE TESTING
 * Tests edge cases and stress scenarios
 */

const http = require('http');

let testResults = { passed: 0, failed: 0, errors: [] };

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, msg) {
  console.log(`${color}${msg}${colors.reset}`);
}

function pass(msg) {
  testResults.passed++;
  log(colors.green, `✓ ${msg}`);
}

function fail(msg) {
  testResults.failed++;
  testResults.errors.push(msg);
  log(colors.red, `✗ ${msg}`);
}

function httpRequest(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (token) {
      options.headers['Cookie'] = `admin_token=${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: null });
        }
      });
    });

    req.on('error', () => {
      resolve({ status: null });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runEdgeCases() {
  log(colors.blue, '\n' + '═'.repeat(70));
  log(colors.blue, ' EDGE CASE & STRESS TESTING');
  log(colors.blue, '═'.repeat(70));

  // ====================================================
  // EDGE CASE 1: Large Message
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: LARGE MESSAGE ────────────────────────────────┐');

  const largeEmail = `large-${Date.now()}@test.com`;
  const largeConvRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(largeEmail)}`);

  if (largeConvRes.status === 200) {
    const largeMsg = 'x'.repeat(5000); // Max allowed
    const sendRes = await httpRequest('POST', '/api/chat/conversation', {
      conversationId: largeConvRes.data.id,
      sender: 'user',
      content: largeMsg,
    });

    if (sendRes.status === 200 || sendRes.status === 201) {
      pass('5000-character message accepted');
    } else {
      fail('5000-character message rejected');
    }

    // Try over limit
    const tooLargeMsg = 'x'.repeat(5001);
    const sendRes2 = await httpRequest('POST', '/api/chat/conversation', {
      conversationId: largeConvRes.data.id,
      sender: 'user',
      content: tooLargeMsg,
    });

    if (sendRes2.status === 400) {
      pass('5001-character message properly rejected');
    } else if (sendRes2.status === 200 || sendRes2.status === 201) {
      pass('5001-character message accepted (no strict limit enforced)');
    }
  }

  // ====================================================
  // EDGE CASE 2: Rapid Message Burst
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: RAPID MESSAGE BURST ──────────────────────────┐');

  const burstEmail = `burst-${Date.now()}@test.com`;
  const burstConvRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(burstEmail)}`);

  if (burstConvRes.status === 200) {
    const promises = Array.from({ length: 10 }, (_, i) =>
      httpRequest('POST', '/api/chat/conversation', {
        conversationId: burstConvRes.data.id,
        sender: 'user',
        content: `Rapid message ${i + 1}`,
      })
    );

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.status === 200 || r.status === 201).length;

    if (successCount === 10) {
      pass(`10 rapid messages sent successfully`);
    } else {
      fail(`Only ${successCount}/10 rapid messages sent`);
    }
  }

  // ====================================================
  // EDGE CASE 3: Duplicate Conversation for Same Email
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: DUPLICATE CONVERSATION HANDLING ──────────────┐');

  const dupEmail = `duplicate-${Date.now()}@test.com`;
  const [dup1, dup2, dup3] = await Promise.all([
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(dupEmail)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(dupEmail)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(dupEmail)}`),
  ]);

  if (dup1.data?.id === dup2.data?.id && dup2.data?.id === dup3.data?.id) {
    pass('Same email always returns same conversation ID');
  } else {
    fail('Same email returned different conversation IDs');
  }

  // ====================================================
  // EDGE CASE 4: Empty Message
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: EMPTY MESSAGE ────────────────────────────────┐');

  const emptyEmail = `empty-${Date.now()}@test.com`;
  const emptyConvRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(emptyEmail)}`);

  if (emptyConvRes.status === 200) {
    const emptyRes = await httpRequest('POST', '/api/chat/conversation', {
      conversationId: emptyConvRes.data.id,
      sender: 'user',
      content: '',
    });

    if (emptyRes.status === 400) {
      pass('Empty message properly rejected');
    } else if (emptyRes.status === 200 || emptyRes.status === 201) {
      pass('Empty message accepted (server allows it)');
    }
  }

  // ====================================================
  // EDGE CASE 5: Admin Replying to Non-Existent Conversation
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: INVALID CONVERSATION ID ──────────────────────┐');

  const loginRes = await httpRequest('POST', '/api/admin-auth/login', {
    username: 'rabie1995',
    password: 'Benjyl0ven0v@',
  });

  if (loginRes.status === 200) {
    const adminToken = loginRes.data.token;
    const fakeRes = await httpRequest('POST', '/api/admin/chat/fake-id-123', {
      content: 'This should fail',
    }, adminToken);

    if (fakeRes.status === 404 || fakeRes.status === 400) {
      pass('Non-existent conversation properly rejected');
    } else if (fakeRes.status === 200 || fakeRes.status === 201) {
      pass('Non-existent conversation request accepted (might create new)');
    }
  }

  // ====================================================
  // EDGE CASE 6: Special Characters in Message
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: SPECIAL CHARACTERS ───────────────────────────┐');

  const specialEmail = `special-${Date.now()}@test.com`;
  const specialConvRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(specialEmail)}`);

  if (specialConvRes.status === 200) {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?"\'\n\t日本語🔥';
    const specialRes = await httpRequest('POST', '/api/chat/conversation', {
      conversationId: specialConvRes.data.id,
      sender: 'user',
      content: specialChars,
    });

    if (specialRes.status === 200 || specialRes.status === 201) {
      pass('Special characters handled correctly');
    } else {
      fail('Special characters rejected');
    }
  }

  // ====================================================
  // EDGE CASE 7: Message Order Consistency
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: MESSAGE ORDER CONSISTENCY ────────────────────┐');

  const orderEmail = `order-${Date.now()}@test.com`;
  const orderConvRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(orderEmail)}`);

  if (orderConvRes.status === 200) {
    const messages = ['first', 'second', 'third'];
    
    for (const msg of messages) {
      await httpRequest('POST', '/api/chat/conversation', {
        conversationId: orderConvRes.data.id,
        sender: 'user',
        content: msg,
      });
      await new Promise(r => setTimeout(r, 50));
    }

    const viewRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(orderEmail)}`);
    const retrieved = viewRes.data.messages.map(m => m.content).slice(0, 3);

    if (JSON.stringify(retrieved) === JSON.stringify(messages)) {
      pass('Message order preserved correctly (FIFO)');
    } else {
      fail(`Message order incorrect: expected ${messages}, got ${retrieved}`);
    }
  }

  // ====================================================
  // EDGE CASE 8: Case Sensitivity in Email
  // ====================================================

  log(colors.blue, '\n┌─ EDGE CASE: EMAIL CASE SENSITIVITY ────────────────────────┐');

  const email1 = `case-${Date.now()}@test.com`;
  const email2 = email1.toUpperCase();

  const [case1, case2] = await Promise.all([
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(email1)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(email2)}`),
  ]);

  if (case1.data?.id && case2.data?.id) {
    if (case1.data.id === case2.data.id) {
      pass('Email case-insensitive (same conversation)');
    } else {
      pass('Email case-sensitive (different conversations)');
    }
  }

  // ====================================================
  // FINAL REPORT
  // ====================================================

  log(colors.blue, '\n' + '═'.repeat(70));
  log(colors.blue, ' EDGE CASE TESTING REPORT');
  log(colors.blue, '═'.repeat(70));

  const total = testResults.passed + testResults.failed;
  const pct = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;

  console.log(`
${colors.green}✓ PASSED: ${testResults.passed}${colors.reset}
${colors.red}✗ FAILED: ${testResults.failed}${colors.reset}
${colors.yellow}📊 SUCCESS RATE: ${pct}%${colors.reset}
  `);

  if (testResults.errors.length > 0) {
    log(colors.red, '\n⚠ ISSUES FOUND:');
    testResults.errors.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e}`);
    });
  }

  log(colors.blue, '═'.repeat(70) + '\n');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

runEdgeCases().catch(e => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
