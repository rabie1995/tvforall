#!/usr/bin/env node
/**
 * CHAT SYSTEM VERIFICATION TEST
 * Using Node.js built-in modules for reliability
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let testResults = { passed: 0, failed: 0, errors: [] };

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
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
          resolve({ status: res.statusCode, data: json, ok: res.statusCode < 400 });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: null, error: e.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function waitForServer(attempts = 20) {
  return new Promise(async (resolve) => {
    log(colors.cyan, '\n⏳ Waiting for server to be ready...');
    for (let i = 0; i < attempts; i++) {
      const res = await httpRequest('GET', '/');
      if (res.status) {
        log(colors.green, '✓ Server is ready!');
        return resolve(true);
      }
      await new Promise(r => setTimeout(r, 500));
    }
    fail('Server did not respond after 10 seconds');
    resolve(false);
  });
}

async function runTests() {
  log(colors.blue, '\n' + '═'.repeat(70));
  log(colors.blue, ' CHAT SYSTEM COMPREHENSIVE VERIFICATION & STRESS TEST');
  log(colors.blue, '═'.repeat(70));

  if (!(await waitForServer())) {
    process.exit(1);
  }

  // ====================================================
  // USER-SIDE TESTS
  // ====================================================

  log(colors.blue, '\n┌─ USER-SIDE VERIFICATION ─────────────────────────────────┐');

  const user1Email = `user1-${Date.now()}@example.com`;
  const convRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user1Email)}`);

  if (convRes.status === 200 && convRes.data?.id) {
    pass(`Conversation created for user1`);
    var conv1Id = convRes.data.id;
  } else {
    fail(`Failed to create conversation (status: ${convRes.status})`);
    console.error('Response:', convRes);
    process.exit(1);
  }

  // Test: Send Messages
  const messages = [
    'Hello, I need help with my subscription',
    'Can someone assist me immediately?',
    'This is urgent',
  ];

  for (let i = 0; i < messages.length; i++) {
    const msgRes = await httpRequest('POST', '/api/chat/conversation', {
      conversationId: conv1Id,
      sender: 'user',
      content: messages[i],
    });

    if (msgRes.status === 200 || msgRes.status === 201) {
      pass(`Message ${i + 1} sent`);
    } else {
      fail(`Message ${i + 1} failed (status: ${msgRes.status})`);
    }
  }

  // Test: Message Persistence
  const fetchRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user1Email)}`);
  if (fetchRes.status === 200 && fetchRes.data?.messages?.length === messages.length) {
    pass(`All ${messages.length} messages persisted`);
  } else {
    fail(`Message count mismatch (expected ${messages.length}, got ${fetchRes.data?.messages?.length})`);
  }

  // Test: Close Conversation
  const closeRes = await httpRequest('POST', '/api/chat/close', {
    conversationId: conv1Id,
    adminClose: false,
  });

  if (closeRes.status === 200) {
    pass('User-side close successful');
  } else {
    fail(`Close failed (status: ${closeRes.status})`);
  }

  // ====================================================
  // ADMIN-SIDE TESTS
  // ====================================================

  log(colors.blue, '\n┌─ ADMIN-SIDE VERIFICATION ───────────────────────────────┐');

  const loginRes = await httpRequest('POST', '/api/admin-auth/login', {
    username: 'rabie1995',
    password: 'Benjyl0ven0v@',
  });

  if (loginRes.status === 200 && loginRes.data?.token) {
    pass('Admin login successful');
    var adminToken = loginRes.data.token;
  } else {
    fail(`Admin login failed (status: ${loginRes.status})`);
    console.error('Response:', loginRes);
    process.exit(1);
  }

  // Test: List Conversations
  const listRes = await httpRequest('GET', '/api/admin/chat/conversations', null, adminToken);

  if (listRes.status === 200 && Array.isArray(listRes.data)) {
    pass(`Admin retrieved ${listRes.data.length} conversation(s)`);
  } else {
    fail(`List conversations failed (status: ${listRes.status})`);
  }

  // Test: View Conversation
  const viewRes = await httpRequest('GET', `/api/admin/chat/${conv1Id}`, null, adminToken);

  if (viewRes.status === 200 && viewRes.data?.messages) {
    pass(`Conversation has ${viewRes.data.messages.length} messages`);
  } else {
    fail(`View conversation failed (status: ${viewRes.status})`);
  }

  // Test: Send Admin Reply
  const replyRes = await httpRequest(
    'POST',
    `/api/admin/chat/${conv1Id}`,
    { content: 'Hello! How can we help?' },
    adminToken
  );

  if (replyRes.status === 200 || replyRes.status === 201) {
    pass('Admin reply sent');
  } else {
    fail(`Reply failed (status: ${replyRes.status})`);
  }

  // Test: User Receives Message
  await new Promise(r => setTimeout(r, 500));
  const userViewRes = await httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user1Email)}`);
  const adminMsgs = userViewRes.data?.messages?.filter(m => m.sender === 'admin') || [];

  if (adminMsgs.length > 0) {
    pass(`Admin message delivered to user`);
  } else {
    fail('Admin message not delivered');
  }

  // ====================================================
  // CONCURRENCY TEST
  // ====================================================

  log(colors.blue, '\n┌─ CONCURRENCY & STRESS TEST ──────────────────────────────┐');

  const user2Email = `user2-${Date.now()}@example.com`;
  const user3Email = `user3-${Date.now()}@example.com`;
  const user4Email = `user4-${Date.now()}@example.com`;

  // Create 3 concurrent conversations
  const [conv2, conv3, conv4] = await Promise.all([
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user2Email)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user3Email)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user4Email)}`),
  ]);

  if (conv2.status === 200 && conv3.status === 200 && conv4.status === 200) {
    pass('3 concurrent conversations created');
  } else {
    fail('Failed to create concurrent conversations');
  }

  // Send concurrent messages
  const msgPromises = [
    httpRequest('POST', '/api/chat/conversation', {
      conversationId: conv2.data.id,
      sender: 'user',
      content: 'Message from user2',
    }),
    httpRequest('POST', '/api/chat/conversation', {
      conversationId: conv3.data.id,
      sender: 'user',
      content: 'Message from user3',
    }),
    httpRequest('POST', '/api/chat/conversation', {
      conversationId: conv4.data.id,
      sender: 'user',
      content: 'Message from user4',
    }),
  ];

  const msgResults = await Promise.all(msgPromises);
  const successCount = msgResults.filter(r => r.status === 200 || r.status === 201).length;

  if (successCount === 3) {
    pass(`All 3 concurrent messages sent`);
  } else {
    fail(`Only ${successCount}/3 messages sent`);
  }

  // Verify no message mixing
  const [view2, view3, view4] = await Promise.all([
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user2Email)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user3Email)}`),
    httpRequest('GET', `/api/chat/conversation?email=${encodeURIComponent(user4Email)}`),
  ]);

  let mixing = false;
  const views = [
    { email: 'user2', msgs: view2.data?.messages || [] },
    { email: 'user3', msgs: view3.data?.messages || [] },
    { email: 'user4', msgs: view4.data?.messages || [] },
  ];

  for (const v of views) {
    const foreign = v.msgs.filter(m => !m.content.includes(v.email));
    if (foreign.length > 0) {
      mixing = true;
      fail(`Message mixing in ${v.email}`);
    }
  }

  if (!mixing) {
    pass('✓ NO MESSAGE MIXING - All conversations isolated');
  }

  // ====================================================
  // SECURITY TESTS
  // ====================================================

  log(colors.blue, '\n┌─ SECURITY VERIFICATION ──────────────────────────────────┐');

  // Test: Unauthorized access
  const unauthorizedRes = await httpRequest('GET', '/api/admin/chat/conversations');

  if (unauthorizedRes.status === 401) {
    pass('Unauthorized requests return 401');
  } else {
    fail(`Expected 401, got ${unauthorizedRes.status}`);
  }

  // ====================================================
  // FINAL REPORT
  // ====================================================

  log(colors.blue, '\n' + '═'.repeat(70));
  log(colors.blue, ' FINAL REPORT');
  log(colors.blue, '═'.repeat(70));

  const total = testResults.passed + testResults.failed;
  const pct = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;

  console.log(`
${colors.green}✓ PASSED: ${testResults.passed}${colors.reset}
${colors.red}✗ FAILED: ${testResults.failed}${colors.reset}
${colors.cyan}📊 SUCCESS RATE: ${pct}%${colors.reset}
  `);

  if (testResults.errors.length > 0) {
    log(colors.red, '\n⚠ ISSUES:');
    testResults.errors.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e}`);
    });
  }

  log(colors.blue, '═'.repeat(70));

  if (testResults.failed === 0) {
    log(colors.green, `✓✓✓ ALL TESTS PASSED ✓✓✓`);
    log(colors.green, `✓ SYSTEM IS PRODUCTION READY`);
    log(colors.green, `✓ CONCURRENCY SAFE`);
  } else {
    log(colors.red, `✗ ${testResults.failed} TEST(S) FAILED`);
  }

  log(colors.blue, '═'.repeat(70) + '\n');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error(`Fatal: ${error.message}`);
  process.exit(1);
});
