# API Documentation

## 1. Local Backend APIs
**Base URL:** `http://localhost:5001` (configured via `VITE_API_URL`)
**Technologies:** Express, Socket.io
**Authentication:** Custom JWT-based (headers: `Authorization: Bearer <token>`), but currently mocked/limited in the local server.

### REST Endpoints
| Method | Endpoint | Description | Auth Required | Status in Local Server |
|--------|----------|-------------|---------------|------------------------|
| `GET` | `/api/posts` | Get list of posts | No | ✅ Implemented (Mock Data) |
| `POST` | `/api/posts` | Create a new post | No | ✅ Implemented |
| `GET` | `/api/posts/:id` | Get post details | No | ✅ Implemented |
| `GET` | `/api/users/profile/:id` | Get user profile | Yes | ❌ Missing |
| `PUT` | `/api/users/profile` | Update profile | Yes | ❌ Missing |
| `POST` | `/api/friends/request/:id` | Send friend request | Yes | ❌ Missing |
| `GET` | `/api/chat/messages/:id` | Get chat history | Yes | ❌ Missing |
| `POST` | `/api/chat/send` | Send chat message | Yes | ❌ Missing |

> **Note:** Many social features (Friends, Chat History, Profile Updates) have frontend API calls defined in `src/api/` but are **not implemented** in the current `signaling-server/server.js`. They will likely return 404 errors locally.

---

## 2. Real-Time (Socket.io)
**URL:** `http://localhost:5001`
**Events:**

| Event Name | Direction | Payload | Description |
|------------|-----------|---------|-------------|
| `connection` | Client -> Server | - | User connects |
| `find-match` | Client -> Server | `{ interest, mode }` | Request a random chat partner |
| `match-found` | Server -> Client | `{ partnerId, roomId }` | Partner found |
| `webrtc-offer` | Bidirectional | `{ offer, to/from }` | WebRTC signaling |
| `webrtc-answer` | Bidirectional | `{ answer, to/from }` | WebRTC signaling |
| `webrtc-ice-candidate` | Bidirectional | `{ candidate }` | WebRTC signaling |
| `chat-message` | Bidirectional | `{ message }` | Real-time text chat |
| `typing` | Bidirectional | `{ to/from }` | Typing indicator |

---

## 3. Supabase (BaaS)
Used for Authentication and specific data features.
**Project URL:** `VITE_SUPABASE_URL`
**Anon Key:** `VITE_SUPABASE_ANON_KEY`

### Tables
| Table Name | Operations Used | Description |
|------------|----------------|-------------|
| `banners` | SELECT, INSERT, UPDATE, DELETE | Home screen banners. Fallback to `localStorage`. |

### Storage Buckets
| Bucket Name | Usage |
|-------------|-------|
| `banners` | Storing uploaded banner images/videos. |

---

## 4. External 3rd Party APIs

### A. YouTube Data API v3
*   **Purpose:** Search and display videos in the "YouTube" section.
*   **Key:** `VITE_YT_API_KEY` (or admin key from localStorage).
*   **Endpoints Used:**
    *   `GET https://www.googleapis.com/youtube/v3/search`
    *   Parameters: `part=snippet`, `q=...`, `type=video`, `eventType=live` (optional)

### B. AI (LLM)
*   **Purpose:** AI Chat Assistant.
*   **Providers (Fallback Chain):**
    1.  **OpenAI:** `https://api.openai.com/v1/chat/completions`
        *   Key: `VITE_OPENAI_API_KEY`
    2.  **GitHub AI (Azure):** `https://models.inference.ai.azure.com/chat/completions`
        *   Token: `VITE_GITHUB_AI_TOKEN`
*   **Model:** `gpt-4o-mini`

### C. News Aggregation
*   **Purpose:** News Feed.
*   **Providers:** Uses a waterfall strategy (tries Primary -> Fallback -> RSS).
*   **Keys:** `VITE_NEWSAPI_ORG_KEY`, `VITE_GNEWS_API_KEY`, etc.
*   **Endpoints:**
    *   `https://gnews.io/api/v4/search`
    *   `https://newsapi.org/v2/everything`
    *   `https://news.google.com/rss` (RSS XML via `corsproxy.io`)

---

## 5. Environment Variables
Required `.env` Application Keys:

```ini
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_OPENAI_API_KEY=... (Optional, for AI)
VITE_YT_API_KEY=... (Required for YouTube page)
VITE_NEWSAPI_ORG_KEY=... (Optional, for News)
VITE_GNEWS_API_KEY=... (Optional, for News)
VITE_API_URL=http://localhost:5001/api
```
