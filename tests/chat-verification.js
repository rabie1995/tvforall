#!/usr/bin/env node
/**
 * Chat System API Verification Script
 * Tests all chat endpoints to verify functionality
 */

const BASE_URL = 'http://localhost:3000';
let conversationId = null;
let adminToken = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function request(method, endpoint, body = null, isAdmin = false) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    if (isAdmin && adminToken) {
      options.headers['Authorization'] = `Bearer ${adminToken}`;
      options.headers['Cookie'] = `admin_token=${adminToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json().catch(() => null);

    return { status: response.status, data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

async function runTests() {
  log(colors.blue, '🧪 Chat System API Verification\n');

  // Test 1: Create/Get Conversation
  log(colors.yellow, '📝 Test 1: Create Conversation');
  const convRes = await request('GET', '/api/chat/conversation?email=testuser@example.com');
  
  if (convRes.status === 200 && convRes.data?.id) {
    conversationId = convRes.data.id;
    log(colors.green, `✓ Conversation created: ${conversationId}`);
  } else {
    log(colors.red, `✗ Failed to create conversation: ${convRes.status}`);
    return;
  }

  // Test 2: Send User Message
  log(colors.yellow, '\n💬 Test 2: Send User Message');
  const msgRes = await request('POST', '/api/chat/conversation', {
    conversationId,
    sender: 'user',
    content: 'This is a test message from the user',
  });

  if (msgRes.status === 200) {
    log(colors.green, `✓ Message sent successfully`);
  } else {
    log(colors.red, `✗ Failed to send message: ${msgRes.status}`);
  }

  // Test 3: List Conversations (Admin) - Should fail without token
  log(colors.yellow, '\n👤 Test 3: Admin Auth - List Conversations (No Token)');
  const listRes = await request('GET', '/api/admin/chat/conversations');
  
  if (listRes.status === 401) {
    log(colors.green, `✓ Properly rejected unauthenticated request`);
  } else {
    log(colors.red, `✗ Should return 401 without token: ${listRes.status}`);
  }

  // Test 4: Admin Login (using hardcoded credentials for testing)
  log(colors.yellow, '\n🔐 Test 4: Admin Login');
  const loginRes = await request('POST', '/api/admin-auth/login', {
    username: 'rabie1995',
    password: 'Benjyl0ven0v@',
  });

  if (loginRes.status === 200 && loginRes.data?.token) {
    adminToken = loginRes.data.token;
    log(colors.green, `✓ Admin logged in successfully`);
    log(colors.green, `  Token: ${adminToken.substring(0, 20)}...`);
  } else {
    log(colors.red, `✗ Login failed: ${loginRes.status}`);
    log(colors.red, `  Response: ${JSON.stringify(loginRes.data)}`);
  }

  // Test 5: List Conversations (Admin) - With Token
  log(colors.yellow, '\n📋 Test 5: Admin - List Conversations');
  const adminListRes = await request('GET', '/api/admin/chat/conversations', null, true);
  
  if (adminListRes.status === 200 && Array.isArray(adminListRes.data)) {
    log(colors.green, `✓ Retrieved ${adminListRes.data.length} conversation(s)`);
    if (adminListRes.data.length > 0) {
      const conv = adminListRes.data[0];
      log(colors.green, `  First: ${conv.email} (${conv.status})`);
    }
  } else {
    log(colors.red, `✗ Failed to list conversations: ${adminListRes.status}`);
  }

  // Test 6: View Conversation Details
  if (conversationId) {
    log(colors.yellow, '\n🔍 Test 6: Admin - View Conversation');
    const viewRes = await request('GET', `/api/admin/chat/${conversationId}`, null, true);
    
    if (viewRes.status === 200) {
      log(colors.green, `✓ Retrieved conversation details`);
      log(colors.green, `  Messages: ${viewRes.data.messages?.length || 0}`);
    } else {
      log(colors.red, `✗ Failed to view conversation: ${viewRes.status}`);
    }

    // Test 7: Send Admin Reply
    log(colors.yellow, '\n💬 Test 7: Admin - Send Reply');
    const replyRes = await request('POST', `/api/admin/chat/${conversationId}`, {
      content: 'This is a test reply from the admin',
    }, true);

    if (replyRes.status === 200) {
      log(colors.green, `✓ Admin reply sent successfully`);
    } else {
      log(colors.red, `✗ Failed to send admin reply: ${replyRes.status}`);
    }

    // Test 8: Fetch Updated Messages
    log(colors.yellow, '\n🔄 Test 8: Fetch Updated Conversation');
    const updateRes = await request('GET', `/api/chat/conversation?email=testuser@example.com`);
    
    if (updateRes.status === 200) {
      const messages = updateRes.data.messages || [];
      log(colors.green, `✓ Retrieved updated messages: ${messages.length} total`);
      messages.forEach((msg, i) => {
        const sender = msg.sender === 'user' ? '👤' : '👨‍💼';
        log(colors.green, `  ${i + 1}. [${sender} ${msg.sender}] ${msg.content.substring(0, 40)}...`);
      });
    } else {
      log(colors.red, `✗ Failed to fetch updated messages: ${updateRes.status}`);
    }

    // Test 9: Close Conversation
    log(colors.yellow, '\n🔒 Test 9: Close Conversation');
    const closeRes = await request('POST', '/api/chat/close', {
      conversationId,
      adminClose: true,
    });

    if (closeRes.status === 200) {
      log(colors.green, `✓ Conversation closed successfully`);
    } else {
      log(colors.red, `✗ Failed to close conversation: ${closeRes.status}`);
    }
  }

  // Summary
  log(colors.blue, '\n' + '='.repeat(50));
  log(colors.green, '✓ API Verification Complete!');
  log(colors.blue, '='.repeat(50));
  
  console.log('\n📚 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Click the floating chat button (bottom-right)');
  console.log('3. Enter your email and send a message');
  console.log('4. Login to admin at /admin/login');
  console.log('5. Click "Support Chat" tab to view conversations');
  console.log('6. Reply to messages and test functionality\n');
}

runTests().catch(error => {
  log(colors.red, `\n❌ Script error: ${error.message}`);
  process.exit(1);
});
