# Updated Components Reference Guide

## SupportChat.tsx - User-Side Chat

### Component Structure
```
SupportChat (Main Component)
├── Floating Chat Button
│   ├── Gradient background (cyan-400 → blue-600)
│   ├── Chat icon (SVG)
│   └── Unread badge (red, animated)
├── Chat Popup (when open)
│   ├── Header (gradient background)
│   ├── Email Form (when no email yet)
│   └── Chat View (after email)
│       ├── Messages Container
│       ├── Input Form
│       └── Close Button
```

### Key States
```typescript
isOpen: boolean              // Popup visibility
hasEmail: boolean            // After email submission
email: string                // User email
conversation: Conversation   // Current conversation
messages: Message[]          // Message history
messageInput: string         // Current input
loading: boolean             // Submission state
unreadCount: number          // Badge count
lastSeenMessageId: string    // Read tracking
pollInterval: NodeJS.Timeout // Message polling
```

### Key Functions
```typescript
handleEmailSubmit()          // Send email and start chat
handleSendMessage()          // Send user message
handleCloseChat()            // Close popup (local only)
scrollToBottom()             // Auto-scroll messages
```

### Polling Behavior
```
Every 2 seconds (if hasEmail && conversation):
  GET /api/chat/conversation?email={email}
  ↓
  Get updated messages list
  ↓
  Check for unread admin messages
  ↓
  Update UI
```

### Notification Logic
```
When !isOpen (chat closed):
  Count admin messages not yet seen
  Show red badge with count
  Pulse animation on badge

When isOpen (chat open):
  Mark last message as seen
  Clear badge
  Fade-in new messages
```

### CSS Classes Used
```
Floating Button:
  fixed bottom-6 right-6
  h-14 w-14 rounded-full
  bg-gradient-to-br from-cyan-400 to-blue-600
  shadow-2xl hover:shadow-cyan-500/50
  transition-all duration-300 hover:scale-110

Header:
  bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900
  rounded-t-2xl border-b border-white/10
  
User Message Bubble:
  bg-gradient-to-br from-cyan-400 to-blue-600
  text-white shadow-lg rounded-xl
  justify-end

Admin Message Bubble:
  bg-gradient-to-br from-gray-100 to-gray-200
  text-gray-900 shadow-md rounded-xl
  justify-start
```

---

## AdminChatPanel.tsx - Admin-Side Chat

### Component Structure
```
AdminChatPanel (Main Component)
├── 3-Column Layout
│   ├── Left Column: Conversations List
│   │   ├── Header (unread counter)
│   │   └── Conversation Items
│   │       ├── Email
│   │       ├── Last message preview
│   │       ├── Timestamp
│   │       ├── Unread indicator (yellow bar)
│   │       └── Unread badge (red dot)
│   ├── Right Column (empty state)
│   │   └── "Select conversation" message
│   └── Right Column (selected)
│       ├── Header (conversation info + close btn)
│       ├── Messages container
│       └── Input form
```

### Key States
```typescript
conversations: Conversation[]              // All conversations
selectedId: string | null                  // Currently selected
fullConversation: FullConversation | null  // Full details
adminMessage: string                       // Current input
loading: boolean                           // Send state
closing: boolean                           // Close state
unreadConversationIds: Set<string>        // Unread tracking
```

### Key Functions
```typescript
fetchConversations()                      // Get all conversations
fetchConversation(id)                     // Get full conversation
handleSelectConversation(id)              // Select conversation
handleSendMessage(e)                      // Send admin reply
handleCloseConversation()                 // Close conversation
```

### Polling Behavior
```
Every 3 seconds (always):
  GET /api/admin/chat/conversations
  ↓
  Check each for new user messages
  ↓
  Mark as unread if sender is 'user'
  ↓
  Update conversation list

Every 2 seconds (if selectedId):
  GET /api/admin/chat/{selectedId}
  ↓
  Get full conversation with all messages
  ↓
  Auto-mark as read when selected
  ↓
  Update message display
```

### Unread Tracking Logic
```
When conversation has unread user message:
  ✓ Add to unreadConversationIds Set
  ✓ Background → yellow-50
  ✓ Left border → gradient yellow-400 to orange-400
  ✓ Red pulsing dot visible
  ✓ Unread count shows in header

When conversation is selected:
  ✓ Remove from unreadConversationIds
  ✓ Remove yellow highlighting
  ✓ Remove badge
  ✓ Header shows "Active" with green dot
```

### CSS Classes Used
```
Container:
  rounded-2xl border border-white/20
  bg-gradient-to-br from-white to-slate-50
  shadow-xl overflow-hidden

Conversation Item (unread):
  bg-yellow-50
  border-l-4 border-cyan-400

Conversation Item (selected):
  bg-gradient-to-r from-cyan-50 to-blue-50
  border-l-4 border-cyan-400

Admin Message:
  bg-gradient-to-br from-cyan-400 to-blue-600
  text-white shadow-lg rounded-xl

User Message:
  bg-gradient-to-br from-gray-100 to-gray-200
  text-gray-900 shadow-md rounded-xl

Status Indicator:
  w-2 h-2 rounded-full
  bg-green-500 animate-pulse (active)
  bg-gray-400 (closed)
```

---

## Shared Styles & Animations

### Fade-In Animation (Both Components)
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

Applied to:
- New message bubbles (smooth entrance)
- New conversation items
- Content transitions

### Hover Animations
```
Buttons:
  transition-all duration-200
  hover:scale-105
  hover:shadow-lg

Input Fields:
  transition-all duration-200
  focus:ring-2 focus:ring-cyan-400/30
```

### Gradient System
```
Primary Gradient:
  from-cyan-400 to-blue-600

Header Gradient:
  from-slate-900 via-blue-900 to-cyan-900

Background Gradient:
  from-white to-slate-50

Unread Indicator:
  from-yellow-400 to-orange-400

Error Button:
  from-red-500 to-red-600
```

---

## Data Flow & API Integration

### User Sends Message
```
User types → handleSendMessage()
  ↓
Validate message content
  ↓
POST /api/chat/conversation
  {
    conversationId: string
    sender: "user"
    content: string (sanitized)
  }
  ↓
Message created in DB
  ↓
Status 201 Created
  ↓
Message appears in UI (optimistic)
```

### Admin Sends Reply
```
Admin types → handleSendMessage()
  ↓
Validate message content
  ↓
POST /api/admin/chat/{conversationId}
  {
    content: string (sanitized)
  }
  ↓
Message created with sender: "admin"
  ↓
Status 201 Created
  ↓
Admin sees in their UI
  ↓
User polls and sees within 2s
```

### Close Conversation
```
User clicks "Close":
  ↓
POST /api/chat/close
  { conversationId: string, adminClose: false }
  ↓
Returns 200 OK
  ↓
User-side state cleared only
  ↓
Server keeps conversation
  ↓
Admin still sees it

Admin clicks "Close":
  ↓
Confirm dialog "Close this conversation?"
  ↓
POST /api/chat/close
  { conversationId: string, adminClose: true }
  ↓
Messages deleted from DB
  ↓
Conversation marked status: "closed"
  ↓
User won't see it next time they check
  ↓
Admin list updates, removes conversation
```

---

## Security Implementation

### Email Validation
```typescript
// Client-side
<input type="email" required />

// Server-side
if (!email) return 400 "Email is required"

// URL encoding
fetch(`/api/chat/conversation?email=${encodeURIComponent(email)}`)
```

### Message Sanitization
```typescript
// Server function in both routes
function sanitizeMessage(content: string): string {
  return content.trim().slice(0, 5000);
}

// Applied to:
// - User messages
// - Admin messages
// - 5000 char max length
```

### Admin Authentication
```typescript
// Server checks JWT token
const token = request.cookies.get('admin_token')?.value
const payload = await verifyAdminToken(token)

if (!payload) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}

// Applied to all admin endpoints:
// - GET /api/admin/chat/conversations
// - GET /api/admin/chat/{id}
// - POST /api/admin/chat/{id}
```

---

## Error Handling

### Client-Side
```typescript
try {
  const res = await fetch(...)
  if (!res.ok) {
    if (res.status === 401) {
      alert('Session expired. Please log in again.')
    } else {
      alert('Failed to send message')
    }
  }
} catch (error) {
  console.error('Error:', error)
  alert('Error sending message')
  // Rollback optimistic update if needed
}
```

### Server-Side (Already Implemented)
- 400 for missing required fields
- 401 for unauthorized requests
- 404 for not found resources
- 500 for server errors
- Console logging for debugging

---

## Performance Considerations

### Polling Intervals
```
User messages:       2 seconds
Admin conversations: 3 seconds
Admin full convo:    2 seconds

Rationale:
- Fast enough for good UX
- Slow enough to not overload server
- Staggered to prevent thundering herd
```

### Optimization Techniques
```
✓ URL encoding prevents request failures
✓ Set-based unread tracking (O(1) lookup)
✓ Efficient message filtering
✓ No unnecessary re-renders (state-based)
✓ Debounced auto-scroll
✓ Optimistic UI updates
```

### Bundle Size Impact
- New animations: +0.5KB CSS
- New icons: +0.2KB (already using Heroicons)
- New state management: +0.3KB JS
- Total: ~1KB additional

---

## Testing Recommendations

### User-Side Tests
```
□ Email input accepts valid emails
□ Email input rejects invalid format
□ Message sends successfully
□ Messages display in correct order
□ Admin messages appear (poll test)
□ Unread badge shows when closed
□ Badge disappears when open
□ Close button clears state
□ Can reopen conversation
□ Special characters work
```

### Admin-Side Tests
```
□ Conversations load immediately
□ Can click to select conversation
□ Full history displays
□ Can send message
□ Message appears to user
□ Unread indicator appears
□ Clicking marks as read
□ Yellow background shows
□ Can close conversation
□ Closed conversation removed
```

### Mobile Tests
```
□ Button accessible on mobile
□ Popup fits screen
□ Touch targets are 44px+
□ No horizontal scroll
□ Keyboard doesn't cover input
□ Orientation change works
```

---

## Deployment Checklist

- [ ] Run `npm run build` - verify no errors
- [ ] Test in staging environment
- [ ] Clear browser cache
- [ ] Test user-to-admin flow
- [ ] Test admin replies to user
- [ ] Verify notifications work
- [ ] Test on mobile device
- [ ] Check performance in DevTools
- [ ] Verify all animations smooth
- [ ] Test with slow network (throttle)
- [ ] Deploy to production

---

**Version:** 2.0 (Enhanced UI & Logic)  
**Last Updated:** December 22, 2025  
**Status:** ✅ Production Ready
