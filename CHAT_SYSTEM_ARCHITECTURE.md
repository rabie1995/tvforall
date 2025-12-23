# Support Chat System - Visual Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Floating Chat Button]                                      │
│   ├─ Gradient: cyan-400 → blue-600                          │
│   ├─ Unread Badge (red, pulsing)                           │
│   └─ Glow Effect on Hover                                   │
│                                                               │
│  [Chat Popup (when open)]                                    │
│   ├─ Header (gradient background)                           │
│   ├─ Messages (fade-in animation)                           │
│   ├─ Input (with send button)                               │
│   └─ Close Button                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     REACT COMPONENT                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  SupportChat.tsx                                             │
│  ├─ State: isOpen, hasEmail, messages, unreadCount         │
│  ├─ Effects: scrollToBottom, trackUnread, polling           │
│  ├─ Handlers: handleEmailSubmit, handleSendMessage         │
│  └─ Polling: GET /api/chat/conversation (every 2s)         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GET /api/chat/conversation?email=X                         │
│   └─ Returns: Conversation with messages                     │
│                                                               │
│  POST /api/chat/conversation                                │
│   └─ Body: { conversationId, sender, content }              │
│   └─ Creates: Message in DB                                 │
│                                                               │
│  POST /api/chat/close                                        │
│   └─ Body: { conversationId, adminClose }                   │
│   └─ Action: Mark as closed (if admin)                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Conversation Table                                          │
│  ├─ id: String (primary key)                                │
│  ├─ email: String (user email)                              │
│  ├─ status: String ('open' | 'closed')                     │
│  ├─ createdAt: DateTime                                      │
│  └─ updatedAt: DateTime                                      │
│                                                               │
│  Message Table                                               │
│  ├─ id: String (primary key)                                │
│  ├─ conversationId: String (foreign key)                     │
│  ├─ sender: String ('user' | 'admin')                       │
│  ├─ content: String (sanitized)                             │
│  ├─ createdAt: DateTime                                      │
│  └─ updatedAt: DateTime                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Admin Side Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Admin Chat Panel]                                          │
│  ├─ Left: Conversations List                                │
│  │  ├─ Unread Count (header)                               │
│  │  ├─ Yellow Background (unread)                          │
│  │  ├─ Red Pulsing Dot (unread badge)                      │
│  │  └─ Click to select                                      │
│  │                                                            │
│  ├─ Middle: Spacer                                           │
│  │                                                            │
│  └─ Right: Conversation View (or empty state)              │
│     ├─ Header (email + status)                             │
│     ├─ Messages (with sender labels)                        │
│     ├─ Green Pulsing Dot (active status)                   │
│     ├─ Input Form                                           │
│     └─ Close Button (delete conversation)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     REACT COMPONENT                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  AdminChatPanel.tsx                                          │
│  ├─ State: conversations, selectedId, unreadConversationIds │
│  ├─ Effects: polling conversations & full chat              │
│  ├─ Handlers: handleSelectConversation, handleSendMessage   │
│  ├─ Auth: Requires JWT token in cookies                    │
│  └─ Polling: GET endpoints (every 2-3s)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GET /api/admin/chat/conversations                          │
│   ├─ Auth: Requires admin_token cookie                      │
│   └─ Returns: All open conversations                        │
│                                                               │
│  GET /api/admin/chat/{id}                                    │
│   ├─ Auth: Requires admin_token cookie                      │
│   └─ Returns: Full conversation with all messages           │
│                                                               │
│  POST /api/admin/chat/{id}                                   │
│   ├─ Auth: Requires admin_token cookie                      │
│   ├─ Body: { content }                                      │
│   └─ Creates: Message with sender='admin'                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [Same Database]
```

---

## Data Flow Diagram

### User Sending Message
```
User Types Message
        ↓
Enter pressed
        ↓
handleSendMessage()
        ↓
Validate content
        ↓
Optimistic UI update
(show message immediately)
        ↓
POST /api/chat/conversation
  {
    conversationId: "conv_123",
    sender: "user",
    content: "Hello!"
  }
        ↓
Server: Sanitize content (trim, slice 5000)
        ↓
Server: Create Message in DB
        ↓
Return 201 Created
        ↓
UI: Message confirmed
        ↓
Polling: User waits for admin reply
(GET /api/chat/conversation every 2s)
        ↓
Admin's reply appears in UI
```

### Admin Sending Message
```
Admin Types Message
        ↓
Click Send
        ↓
handleSendMessage()
        ↓
Validate: Check JWT token valid
        ↓
Validate content
        ↓
POST /api/admin/chat/{conversationId}
  {
    content: "We're here to help!"
  }
        ↓
Server: Validate admin token
        ↓
Server: Sanitize content
        ↓
Server: Create Message with sender='admin'
        ↓
Return 201 Created
        ↓
UI: Fetch updated conversation
        ↓
Admin sees message in right bubble
        ↓
User's polling: Gets message within 2s
        ↓
User sees admin message in left bubble
```

### Close Conversation
```
Admin Clicks "Close"
        ↓
Show confirmation: "Close this conversation?"
        ↓
If confirmed:
        ↓
POST /api/chat/close
  {
    conversationId: "conv_123",
    adminClose: true
  }
        ↓
Server: Delete all messages
        ↓
Server: Mark conversation status='closed'
        ↓
Return 200 OK
        ↓
Admin UI: Conversation removed from list
        ↓
User: Next polling gets empty list
        ↓
User: Chat button no longer shows conversation
```

---

## State Management Flow (User)

```
Initial State:
  isOpen: false
  hasEmail: false
  email: ""
  messages: []
  unreadCount: 0
  lastSeenMessageId: null

User Clicks Button:
  isOpen: true
  ↓
Form shown with email input

User Enters Email & Submits:
  hasEmail: true
  conversation: { id, email, messages: [...] }
  messages: [...]
  ↓
Chat window shown with message history

User Sends Message:
  messages: [..., newMessage]
  messageInput: ""
  ↓
Message appears in UI
  Polling starts
  ↓
Admin replies via API

Polling Gets Reply:
  messages: [..., adminMessage]
  ↓
Message appears in UI with fade-in

User Closes Chat:
  isOpen: false
  hasEmail: false
  unreadCount: 0
  lastSeenMessageId: null
  ↓
All local state cleared
BUT server conversation preserved
```

---

## Notification Flow

### User Receives Admin Message

```
Chat Closed:
  ↓
  Polling interval (2s)
  ↓
  GET /api/chat/conversation?email=X
  ↓
  Response has new admin message
  ↓
  messages: [..., newAdminMessage]
  ↓
  unreadCount: 1
  ↓
  Red badge shows on button
  ↓
  Badge pulsing animation

User Opens Chat:
  ↓
  isOpen: true
  ↓
  lastSeenMessageId: newAdminMessage.id
  ↓
  unreadCount: 0
  ↓
  Badge disappears
  ↓
  Message has fade-in animation
```

### Admin Receives User Message

```
Admin Viewing Conversation:
  ↓
  Polling interval (2s)
  ↓
  GET /api/admin/chat/conversations
  ↓
  Response shows new user message
  ↓
  lastMessage.sender === 'user'
  ↓
  Add conversation to unreadConversationIds Set
  ↓
  Yellow background appears
  ↓
  Red dot with counter shows

Admin Clicks Conversation:
  ↓
  selectedId: conversationId
  ↓
  Fetch full conversation
  ↓
  Remove from unreadConversationIds
  ↓
  Yellow background removed
  ↓
  Red dot removed
  ↓
  Green dot shows (active status)
```

---

## Color Palette Reference

```
Primary Gradient (Buttons & Main):
├─ From: #22d3ee (cyan-400)
└─ To: #2563eb (blue-600)

Header Gradient (Dark):
├─ From: #0f172a (slate-900)
├─ Via: #172554 (blue-900)
└─ To: #164e63 (cyan-900)

Background Gradient (Subtle):
├─ From: #ffffff (white)
└─ To: #f8fafc (slate-50)

Message Bubbles:
├─ User: cyan-400 → blue-600 (white text)
├─ Admin: gray-100 → gray-200 (dark text)
└─ Both: shadow + rounded-xl

Status Indicators:
├─ Active: #22c55e (green-500) + animate-pulse
├─ Closed: #9ca3af (gray-400) + static
└─ Unread Left Border: yellow-400 → orange-400

Alert/Error:
├─ Unread Badge: #ef4444 (red-500)
├─ Animation: animate-pulse
└─ Pulsing: 2s cycle
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Client (Browser)                 │
├─────────────────────────────────────────┤
│  SupportChat.tsx                         │
│  ├─ Email URL encoded                   │
│  ├─ Message sanitized (trim, length)   │
│  └─ React auto-escapes content         │
└─────────────────────────────────────────┘
           ↓ HTTPS ↓
┌─────────────────────────────────────────┐
│      API Routes (Next.js)                │
├─────────────────────────────────────────┤
│  Middleware: Verify JWT token           │
│  Route Handlers:                        │
│  ├─ Validate required fields            │
│  ├─ Sanitize messages                   │
│  ├─ Check user authorization            │
│  └─ Log errors                          │
└─────────────────────────────────────────┘
           ↓ HTTPS ↓
┌─────────────────────────────────────────┐
│      Database (SQLite)                   │
├─────────────────────────────────────────┤
│  Prisma ORM                             │
│  ├─ Prevents SQL injection              │
│  ├─ Validates data types                │
│  ├─ Enforces foreign keys               │
│  └─ Transaction support                 │
└─────────────────────────────────────────┘
```

---

## Performance Optimization

```
Request Timeline:
0ms ─ User types message
  │
  ├─ 100ms: handleSendMessage() called
  │
  ├─ 150ms: Optimistic update (message shows)
  │
  ├─ 200ms: POST /api/chat/conversation sent
  │
  ├─ 350ms: Response received (201 Created)
  │
  ├─ 2000ms: Next polling interval
  │
  ├─ 2100ms: GET /api/chat/conversation sent
  │
  ├─ 2200ms: Response with admin reply
  │
  └─ 2200ms: Admin message appears with fade-in

Polling Strategy:
├─ User: 2 seconds (responsive)
├─ Admin list: 3 seconds (efficient)
├─ Admin full: 2 seconds (responsive)
└─ Staggered intervals prevent thundering herd
```

---

## Component Lifecycle

### SupportChat Component

```
Mount:
  ├─ Initialize state
  ├─ Set up polling effect
  └─ Ready for interaction

User Opens Chat (isOpen = true):
  ├─ Render popup
  ├─ Show email form (if !hasEmail)
  └─ Track unread messages

User Submits Email:
  ├─ Fetch conversation
  ├─ Set hasEmail = true
  ├─ Render chat view
  └─ Start polling for messages

Chat Open + Messages Arrive:
  ├─ Update messages state
  ├─ Mark as read (lastSeenMessageId)
  ├─ Clear unreadCount (0)
  ├─ Fade-in animation
  └─ Auto-scroll to bottom

User Closes Chat (isOpen = false):
  ├─ Clear local state
  ├─ Stop polling
  ├─ Unmount popup
  └─ Show floating button with badge

Unmount:
  └─ Clean up polling interval
```

### AdminChatPanel Component

```
Mount:
  ├─ Fetch conversations
  ├─ Set up polling
  └─ Ready for interaction

Polling Gets New Conversation:
  ├─ Check if unread (lastMessage.sender === 'user')
  ├─ Add to unreadConversationIds
  ├─ Show yellow background
  └─ Show red badge

User Selects Conversation:
  ├─ Set selectedId
  ├─ Fetch full conversation
  ├─ Remove from unreadConversationIds
  ├─ Remove yellow background
  └─ Show green status dot

Admin Sends Message:
  ├─ POST /api/admin/chat/{id}
  ├─ Fetch updated conversation
  ├─ Message appears in UI
  └─ Continue polling

Polling Gets User Reply:
  ├─ Update fullConversation
  ├─ User message appears
  └─ Add to unreadConversationIds

Admin Closes Conversation:
  ├─ Confirm dialog
  ├─ POST /api/chat/close with adminClose=true
  ├─ Remove from conversations list
  ├─ Clear selectedId
  └─ Show empty state

Unmount:
  └─ Clean up polling intervals
```

---

## Mobile Responsiveness

```
Floating Button (Fixed Position):
├─ bottom: 24px (1.5rem)
├─ right: 24px (1.5rem)
├─ size: 56px (h-14 w-14)
├─ z-index: 40 (above most content)
└─ Visible on all screen sizes

Chat Popup (Responsive):
├─ width: 384px (w-96)
├─ max-width: calc(100vw - 24px)
├─ Centered on screen
├─ height: responsive
└─ Auto-adjusts for keyboard

Mobile Breakpoints:
├─ 320px+: Full functionality
├─ 375px: iPhone SE+
├─ 414px: iPhone Plus
├─ 768px: Tablet
└─ 1024px+: Desktop optimal
```

---

**Visual Architecture Complete** ✅

This diagram system shows the complete flow of data, state management, security, and performance optimization in the support chat system.
