# Real-Time Support Chat System - Implementation Guide

## Overview
A professional real-time support chat system has been implemented for the tvforall.store platform. Users can initiate support conversations from any page via a floating chat button, and admins can manage all conversations from the admin dashboard.

## Architecture

### Database Models (Prisma)
Two new models have been added to [prisma/schema.prisma](prisma/schema.prisma):

```typescript
model Conversation {
  id             String         @id @default(cuid())
  email          String         // User's email
  status         String         @default("open") // "open" or "closed"
  messages       Message[]      // Relationship to messages
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  @@index([email])
  @@index([status])
  @@index([createdAt])
}

model Message {
  id             String         @id @default(cuid())
  conversation   Conversation   @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId String
  sender         String         @default("user") // "user" or "admin"
  content        String         // Message text (max 5000 chars)
  createdAt      DateTime       @default(now())
  @@index([conversationId])
  @@index([sender])
  @@index([createdAt])
}
```

### Backend API Routes

#### User-Side Endpoints

**1. POST/GET `/api/chat/conversation`**
- **GET:** Fetch or create a conversation for a user
  ```
  GET /api/chat/conversation?email=user@example.com
  Response: { id, email, messages: [] }
  ```
- **POST:** Send a message from user
  ```
  POST /api/chat/conversation
  Body: { conversationId, sender: "user", content: "..." }
  Response: { id, sender: "user", content, createdAt }
  ```
- **Features:**
  - Auto-creates conversation if doesn't exist
  - Sanitizes message content (max 5000 chars)
  - No authentication required

**2. POST `/api/chat/close`**
- Close or delete a conversation
  ```
  POST /api/chat/close
  Body: { conversationId, adminClose: false }
  ```
- If `adminClose=true`: Admin closed, conversation is deleted
- If `adminClose=false`: User closed, conversation persists (admin can still see)

#### Admin-Side Endpoints

**3. GET `/api/admin/chat/conversations`**
- List all open conversations with last message
  ```
  GET /api/admin/chat/conversations (requires admin_token)
  Response: [
    {
      id: "conv_1",
      email: "user@example.com",
      status: "open",
      lastMessage: { id, sender, content, createdAt }
    }
  ]
  ```
- **Auth:** Requires valid `admin_token` cookie
- **Returns 401** if not authenticated

**4. GET/POST `/api/admin/chat/[conversationId]`**
- **GET:** Fetch full conversation history
  ```
  GET /api/admin/chat/conv_1
  Response: { id, email, status, messages: [...] }
  ```
- **POST:** Send admin reply
  ```
  POST /api/admin/chat/conv_1
  Body: { content: "How can we help?" }
  Response: { id, sender: "admin", content, createdAt }
  ```
- **Auth:** Requires valid `admin_token` cookie
- **Features:**
  - Message sanitization
  - Auto-updates conversation timestamp
  - Cascade delete on conversation close

### Frontend Components

#### 1. User-Side Chat (`components/SupportChat.tsx`)
A floating chat component included on all pages via [app/layout.tsx](app/layout.tsx).

**Features:**
- **Floating Button** - Fixed bottom-right position (teal color)
- **Email Modal** - First-time users enter email to start chat
- **Message Interface:**
  - User messages: Right-aligned, teal background
  - Admin messages: Left-aligned, gray background
  - Timestamps for each message
  - Auto-scroll to latest message
- **Polling** - Fetches new messages every 2 seconds
- **Close Button** - Clears local state, doesn't delete conversation on server

**Usage:**
```typescript
// Component is auto-integrated in layout
// No additional setup needed
```

#### 2. Admin Chat Panel (`components/AdminChatPanel.tsx`)
Integrated into the admin dashboard at [app/admin/page.tsx](app/admin/page.tsx).

**Features:**
- **Conversation List** (3-column grid layout)
  - Shows all open conversations
  - Displays last message and timestamp
  - Click to view full conversation
- **Message View**
  - Full conversation history
  - Admin and user message differentiation
  - Real-time updates (polls every 2 seconds)
- **Admin Reply Input**
  - Send messages to users
  - Message sanitization
- **Close Conversation**
  - Admin can permanently close conversations
  - Requires confirmation
  - Deleted from both user and admin view

**Tab Integration:**
The admin dashboard now has two tabs:
- **Orders** - Original order management
- **Support Chat** - New chat panel (with chat icon)

### Security & Authentication

1. **User-Side Chat** - No authentication
   - Identified by email only
   - Messages are sanitized (5000 char limit)
   - No sensitive data required

2. **Admin-Side Chat** - Cookie-based JWT auth
   - Requires `admin_token` cookie
   - Verified via [lib/auth.ts](lib/auth.ts)
   - Middleware protects `/admin/*` routes
   - Returns 401 if token is invalid/expired

3. **Message Sanitization**
   - Content trimmed and limited to 5000 characters
   - SQL injection prevention via Prisma ORM

### Data Flow

#### User Initiates Chat
```
1. User clicks floating chat button
2. Enters email → POST /api/chat/conversation?email=...
3. Conversation created on server
4. User types message → POST /api/chat/conversation
5. Message stored in database
6. Polling fetches messages every 2s
```

#### Admin Views & Replies
```
1. Admin logs in → /admin
2. Clicks "Support Chat" tab → GET /api/admin/chat/conversations
3. List of open conversations displayed
4. Clicks conversation → GET /api/admin/chat/[id]
5. Full history displayed
6. Admin replies → POST /api/admin/chat/[id]
7. Polling updates client every 2s
8. Admin closes → POST /api/chat/close (adminClose: true)
9. Conversation deleted for both user and admin
```

### File Structure

```
app/
├── layout.tsx                          # Includes SupportChat component
├── api/
│   └── chat/
│       ├── conversation/route.ts       # User chat endpoints (GET/POST)
│       └── close/route.ts              # Close conversation (POST)
│   └── admin/
│       └── chat/
│           ├── conversations/route.ts  # List conversations (GET)
│           └── [id]/route.ts           # View & reply (GET/POST)
├── admin/
│   └── page.tsx                        # Admin dashboard with chat tab
components/
├── SupportChat.tsx                     # User-side floating chat
└── AdminChatPanel.tsx                  # Admin-side chat management
prisma/
└── schema.prisma                       # Conversation & Message models
lib/
└── auth.ts                             # Admin authentication
```

## Deployment Notes

### Environment Variables
No new environment variables required. Chat system uses existing:
- `DATABASE_URL` - SQLite connection
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Admin auth

### Database Migration
Schema already synced. To manually migrate:
```bash
npx prisma generate
npx prisma db push
```

### Runtime Requirements
- **Node.js Runtime**: All chat routes require `export const runtime = 'nodejs'` (bcryptjs compatibility)
- **Edge Runtime**: Not compatible with crypto operations

## Testing the Chat System

### For Users
1. Go to `http://localhost:3000`
2. Click the floating teal chat button (bottom-right)
3. Enter your email
4. Send a test message
5. Message appears with timestamp

### For Admins
1. Login at `http://localhost:3000/admin/login`
   - Username: `rabie1995`
   - Password: `Benjyl0ven0v@`
2. Click "Support Chat" tab
3. View incoming conversations
4. Click a conversation to see full history
5. Type and send admin reply
6. User sees reply in real-time

## Performance Considerations

1. **Polling vs WebSockets**: Currently uses 2-3 second polling for simplicity
   - User-side: Polls `/api/chat/conversation` every 2s
   - Admin-side: Polls both conversations list and active conversation
   - **Optimization**: Can upgrade to WebSockets for real-time updates

2. **Database Indices**:
   - Email index on Conversation (fast lookups by user)
   - Status index on Conversation (fast open/closed filtering)
   - ConversationId index on Message (cascade delete performance)

3. **Message Size Limit**: 5000 characters enforced client-side and server-side

## Future Enhancements

1. **Real-Time Updates**
   - Replace polling with WebSockets
   - Use Socket.IO or Pusher for live notifications

2. **Admin Features**
   - Typing indicators
   - Message read receipts
   - Canned responses / quick replies
   - Conversation search
   - Conversation history export

3. **User Features**
   - Avatar/name display
   - Estimated response time
   - Chat history for returning users
   - File/image sharing

4. **Analytics**
   - Response time metrics
   - Conversation duration tracking
   - Common questions/issues
   - Customer satisfaction ratings

## Troubleshooting

### Chat Button Not Appearing
- Check that [components/SupportChat.tsx](components/SupportChat.tsx) is imported in [app/layout.tsx](app/layout.tsx)
- Clear browser cache
- Ensure `'use client'` is at the top of both files

### Messages Not Sending
- Check browser console for errors
- Verify API route exists: `/api/chat/conversation`
- Check Prisma Client is regenerated: `npx prisma generate`
- Ensure database is synced: `npx prisma db push`

### Admin Can't See Conversations
- Login required - verify `admin_token` cookie is set
- Check admin authentication at `/api/admin-auth/verify`
- Ensure admin route access is not blocked by middleware

### Conversations Not Persisting
- Verify DATABASE_URL points to correct SQLite file
- Check that Conversation and Message models exist in schema
- Confirm Prisma migrations applied: `npx prisma db push`

## Support & Documentation

For more details, see:
- [Architecture Guide](.github/copilot-instructions.md)
- [Admin Auth System](SECURE_ADMIN_SYSTEM.md)
- [Prisma Schema](prisma/schema.prisma)
- [API Routes](app/api)
