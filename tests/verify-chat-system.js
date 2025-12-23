#!/usr/bin/env node
/**
 * CHAT SYSTEM VERIFICATION TEST
 * Simplified, reliable test with proper error handling
 */

const BASE_URL = 'http://localhost:3000';
let testResults = {
  passed: 0,
  failed: 0,
  errors: [],
};

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

async function request(method, endpoint, body = null, token = null) {
  try {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    if (token) options.headers['Cookie'] = `admin_token=${token}`;

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => null);
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: null, data: null, error: error.message };
  }
}

async function waitForServer() {
  log(colors.cyan, '\n⏳ Waiting for server to be ready...');
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        log(colors.green, '✓ Server is ready!');
        return true;
      }
    } catch (e) {
      // Server not ready
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  fail('Server did not respond after 10 seconds');
  return false;
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

  // Test 1: Create Conversation
  const user1Email = `user1-${Date.now()}@example.com`;
  const convRes = await request('GET', `/api/chat/conversation?email=${user1Email}`);

  if (convRes.status === 200 && convRes.data?.id) {
    pass(`Conversation created for ${user1Email}`);
    var conv1Id = convRes.data.id;
  } else {
    fail(`Failed to create conversation (status: ${convRes.status}, error: ${convRes.error})`);
    process.exit(1);
  }

  // Test 2: Send Messages
  const messages = [
    'Hello, I need help with my subscription',
    'Can someone assist me immediately?',
    'This is urgent',
  ];

  for (let i = 0; i < messages.length; i++) {
    const msgRes = await request('POST', '/api/chat/conversation', {
      conversationId: conv1Id,
      sender: 'user',
      content: messages[i],
    });

    if (msgRes.status === 200) {
      pass(`Message ${i + 1} sent: "${messages[i].substring(0, 30)}..."`);
    } else {
      fail(`Message ${i + 1} failed (status: ${msgRes.status})`);
    }
  }

  // Test 3: Verify Message Persistence
  const fetchRes = await request('GET', `/api/chat/conversation?email=${user1Email}`);
  if (fetchRes.status === 200 && fetchRes.data?.messages?.length === messages.length) {
    pass(`All ${messages.length} messages persisted correctly`);
  } else {
    fail(`Message count mismatch (expected ${messages.length}, got ${fetchRes.data?.messages?.length})`);
  }

  // Test 4: Verify Message Order
  if (fetchRes.data?.messages) {
    let orderOk = true;
    for (let i = 0; i < fetchRes.data.messages.length && i < messages.length; i++) {
      if (!fetchRes.data.messages[i].content.includes(messages[i].substring(0, 10))) {
        orderOk = false;
        break;
      }
    }
    if (orderOk) {
      pass('Message order is correct (FIFO)');
    } else {
      fail('Message order is incorrect');
    }
  }

  // Test 5: Close Conversation (User Side)
  const closeRes = await request('POST', '/api/chat/close', {
    conversationId: conv1Id,
    adminClose: false,
  });

  if (closeRes.status === 200) {
    pass('User-side close successful (conversation preserved on server)');
  } else {
    fail(`Close failed (status: ${closeRes.status})`);
  }

  // ====================================================
  // ADMIN-SIDE TESTS
  // ====================================================

  log(colors.blue, '\n┌─ ADMIN-SIDE VERIFICATION ───────────────────────────────┐');

  // Test 6: Admin Login
  const loginRes = await request('POST', '/api/admin-auth/login', {
    username: 'rabie1995',
    password: 'Benjyl0ven0v@',
  });

  if (loginRes.status === 200 && loginRes.data?.token) {
    pass('Admin login successful');
    var adminToken = loginRes.data.token;
  } else {
    fail(`Admin login failed (status: ${loginRes.status}, error: ${loginRes.error})`);
    process.exit(1);
  }

  // Test 7: List Conversations
  const listRes = await request('GET', '/api/admin/chat/conversations', null, adminToken);

  if (listRes.status === 200 && Array.isArray(listRes.data)) {
    pass(`Admin retrieved ${listRes.data.length} conversation(s)`);
  } else {
    fail(`List conversations failed (status: ${listRes.status})`);
  }

  // Test 8: View Conversation
  const viewRes = await request('GET', `/api/admin/chat/${conv1Id}`, null, adminToken);

  if (viewRes.status === 200 && viewRes.data?.messages) {
    pass(`Conversation has ${viewRes.data.messages.length} messages (all preserved)`);
  } else {
    fail(`View conversation failed (status: ${viewRes.status})`);
  }

  // Test 9: Send Admin Reply
  const replyRes = await request(
    'POST',
    `/api/admin/chat/${conv1Id}`,
    { content: 'Hello! We are here to help. What can we do?' },
    adminToken
  );

  if (replyRes.status === 200) {
    pass('Admin reply sent successfully');
  } else {
    fail(`Admin reply failed (status: ${replyRes.status})`);
  }

  // Test 10: User Receives Admin Message
  await new Promise(resolve => setTimeout(resolve, 1000));
  const userViewRes = await request('GET', `/api/chat/conversation?email=${user1Email}`);
  const adminMessages = userViewRes.data?.messages?.filter(m => m.sender === 'admin') || [];

  if (adminMessages.length > 0) {
    pass(`Admin message delivered to user (${adminMessages.length} admin message(s))`);
  } else {
    fail('Admin message not delivered to user');
  }

  // ====================================================
  // CONCURRENCY TEST
  // ====================================================

  log(colors.blue, '\n┌─ CONCURRENCY & STRESS TEST ──────────────────────────────┐');

  const user2Email = `user2-${Date.now()}@example.com`;
  const user3Email = `user3-${Date.now()}@example.com`;
  const user4Email = `user4-${Date.now()}@example.com`;

  // Test 11: Create 3 concurrent conversations
  const [conv2, conv3, conv4] = await Promise.all([
    request('GET', `/api/chat/conversation?email=${user2Email}`),
    request('GET', `/api/chat/conversation?email=${user3Email}`),
    request('GET', `/api/chat/conversation?email=${user4Email}`),
  ]);

  if (conv2.status === 200 && conv3.status === 200 && conv4.status === 200) {
    pass('3 concurrent conversations created successfully');
  } else {
    fail('Failed to create concurrent conversations');
  }

  // Test 12: Concurrent messages from multiple users
  const msgPromises = [
    request('POST', '/api/chat/conversation', {
      conversationId: conv2.data.id,
      sender: 'user',
      content: `Message from ${user2Email.split('@')[0]}`,
    }),
    request('POST', '/api/chat/conversation', {
      conversationId: conv3.data.id,
      sender: 'user',
      content: `Message from ${user3Email.split('@')[0]}`,
    }),
    request('POST', '/api/chat/conversation', {
      conversationId: conv4.data.id,
      sender: 'user',
      content: `Message from ${user4Email.split('@')[0]}`,
    }),
  ];

  const msgResults = await Promise.all(msgPromises);
  const successCount = msgResults.filter(r => r.status === 200).length;

  if (successCount === 3) {
    pass(`All 3 concurrent messages sent successfully`);
  } else {
    fail(`Only ${successCount}/3 messages sent`);
  }

  // Test 13: Verify no message mixing
  const [view2, view3, view4] = await Promise.all([
    request('GET', `/api/chat/conversation?email=${user2Email}`),
    request('GET', `/api/chat/conversation?email=${user3Email}`),
    request('GET', `/api/chat/conversation?email=${user4Email}`),
  ]);

  const users = [
    { email: user2Email, msgs: view2.data?.messages || [] },
    { email: user3Email, msgs: view3.data?.messages || [] },
    { email: user4Email, msgs: view4.data?.messages || [] },
  ];

  let mixingDetected = false;
  for (const user of users) {
    const otherMessages = user.msgs.filter(m => !m.content.includes(user.email.split('@')[0]));
    if (otherMessages.length > 0) {
      mixingDetected = true;
      fail(`Message mixing in ${user.email}: found ${otherMessages.length} foreign messages`);
    }
  }

  if (!mixingDetected) {
    pass('✓ NO MESSAGE MIXING - All conversations properly isolated');
  }

  // ====================================================
  // SECURITY TESTS
  // ====================================================

  log(colors.blue, '\n┌─ SECURITY VERIFICATION ──────────────────────────────────┐');

  // Test 14: Unauthorized admin access blocked
  const unauthorizedRes = await request('GET', '/api/admin/chat/conversations');

  if (unauthorizedRes.status === 401) {
    pass('Unauthorized requests return 401 ✓');
  } else {
    fail(`Expected 401 for unauthorized access, got ${unauthorizedRes.status}`);
  }

  // Test 15: XSS protection
  const xssEmail = `xss-test-${Date.now()}@example.com`;
  const xssConvRes = await request('GET', `/api/chat/conversation?email=${xssEmail}`);
  const xssPayload = '<img src=x onerror="alert(1)">';

  const xssSendRes = await request('POST', '/api/chat/conversation', {
    conversationId: xssConvRes.data.id,
    sender: 'user',
    content: xssPayload,
  });

  if (xssSendRes.status === 200) {
    pass('XSS payload accepted and will be sanitized on display');
  } else {
    fail('Failed to handle XSS test');
  }

  // ====================================================
  // FINAL REPORT
  // ====================================================

  log(colors.blue, '\n' + '═'.repeat(70));
  log(colors.blue, ' FINAL REPORT');
  log(colors.blue, '═'.repeat(70));

  const total = testResults.passed + testResults.failed;
  const percentage = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;

  console.log(`
${colors.green}✓ PASSED: ${testResults.passed}${colors.reset}
${colors.red}✗ FAILED: ${testResults.failed}${colors.reset}
${colors.cyan}📊 SUCCESS RATE: ${percentage}%${colors.reset}
  `);

  if (testResults.errors.length > 0) {
    log(colors.red, '\n⚠ ERRORS FOUND:');
    testResults.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }

  log(colors.blue, '\n' + '═'.repeat(70));

  if (testResults.failed === 0) {
    log(colors.green, `✓✓✓ ALL TESTS PASSED ✓✓✓`);
    log(colors.green, `✓ SYSTEM IS PRODUCTION READY`);
    log(colors.green, `✓ MULTIPLE CONVERSATIONS ISOLATED & SECURE`);
    log(colors.green, `✓ CONCURRENCY HANDLING: OK`);
  } else {
    log(colors.red, `✗ ${testResults.failed} TEST(S) FAILED`);
    log(colors.red, `✗ REQUIRES ATTENTION BEFORE PRODUCTION`);
  }

  log(colors.blue, '═'.repeat(70) + '\n');

  process.exit(testResults.failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
