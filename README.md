<div align="center">

# 🧭 YatraMitra AI

### 🌏 "Discover Better. Travel Smarter. Support Local."

**An AI-powered, personalized and sustainable tourism ecosystem for India**

🏆 Built for **Smart India Hackathon 2026**

<br>

<!-- Tech stack stickers -->
<p>
<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
</p>
<p>
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white">
<img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">
</p>

<!-- Status / meta stickers -->
<p>
<img src="https://img.shields.io/badge/Status-Active-success?style=flat-square">
<img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4-red?style=flat-square">
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square">
<img src="https://img.shields.io/badge/PS%20ID-26204-blue?style=flat-square">
<img src="https://img.shields.io/badge/Theme-Travel%20%26%20Tourism-orange?style=flat-square">
<img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square">
</p>

### 🔗 [Overview](#-1-project-overview) · [Features](#-3-features-implemented) · [Architecture](#-4-architecture) · [Workflow](#-5-project-workflow) · [Setup](#-7-installation) · [API](#-11-api-reference) · [Roadmap](#-16-roadmap--future-scope)

</div>

<br>

| 🏷️ | Details |
|---|---|
| **Problem Statement ID** | `26204` |
| **Title** | Student Innovation — a solution/idea that can boost the current situation of the tourism industries including hotels, travel and others |
| **Organization** | AICTE |
| **Department** | AICTE, MIC — Student Innovation |
| **Category** | 💻 Software |
| **Theme** | ✈️ Travel & Tourism |

<br>

## 📑 Table of Contents

| | | |
|---|---|---|
| 1️⃣ [Project Overview](#-1-project-overview) | 2️⃣ [Problem → Solution → Impact](#-2-problem--solution--impact) | 3️⃣ [Features Implemented](#-3-features-implemented) |
| 4️⃣ [Architecture](#-4-architecture) | 5️⃣ [Project Workflow](#-5-project-workflow) | 6️⃣ [Tech Stack](#-6-tech-stack) |
| 7️⃣ [Installation](#-7-installation) | 8️⃣ [Environment Variables](#-8-environment-variables) | 9️⃣ [Seeding & Running](#-9-seeding--running) |
| 🔟 [Available Scripts](#-10-available-scripts) | 1️⃣1️⃣ [API Reference](#-11-api-reference) | 1️⃣2️⃣ [Badges System](#-12-gamification--badges) |
| 1️⃣3️⃣ [Security](#-13-security) | 1️⃣4️⃣ [The AI Layer](#-14-the-ai-layer--local-engine--optional-llm) | 1️⃣5️⃣ [Known Limitations](#-15-known-limitations) |
| 1️⃣6️⃣ [Roadmap](#-16-roadmap--future-scope) | 1️⃣7️⃣ [Production Checklist](#-17-production-checklist) | 1️⃣8️⃣ [Contributing](#-18-contributing) |
| 1️⃣9️⃣ [License](#-19-license) | | |

---

## 🌍 1. Project Overview

> YatraMitra AI is **not** a static booking website. It's a full-stack platform that fuses an **AI trip planner** 🤖, a **hidden-gem discovery engine** 💎, and a **marketplace for local guides, homestays & experience hosts** 🏘️ — aimed straight at the fragmentation, over-tourism, and low local-business visibility called out in the problem statement.

It understands a traveller's **budget 💰 · interests 🎯 · duration 📅 · group size 👥 · travel style 🧳** to generate a grounded, day-by-day itinerary — while nudging demand toward under-visited destinations and the local businesses around them.

## ⚖️ 2. Problem → Solution → Impact

```mermaid
flowchart LR
    subgraph P ["❌ PROBLEM"]
        direction TB
        P1["📵 Services scattered across apps & word-of-mouth"]
        P2["📋 Planning is generic, same checklist for everyone"]
        P3["🏙️ Popular spots overcrowded, hidden gems undiscovered"]
        P4["👻 Local guides & homestays have zero digital visibility"]
    end
    subgraph S ["✅ SOLUTION"]
        direction TB
        S1["🤖 AI planner builds a real day-by-day itinerary"]
        S2["💎 Engine surfaces hidden-gem alternatives"]
        S3["🏪 Local business marketplace + provider dashboard"]
        S4["🌱 Sustainability score on every destination"]
    end
    subgraph I ["🚀 IMPACT"]
        direction TB
        I1["🗺️ Tourism spreads beyond the same dozen hotspots"]
        I2["💵 Real income visibility for local operators"]
        I3["✨ Personalized plans, not generic top-10 lists"]
    end
    P --> S --> I
```

## ✨ 3. Features Implemented

### 🧭 Planning & Discovery
- ✅ **AI Trip Planner** — multi-step wizard → day-by-day itinerary with per-slot costs, hotel tier & local tips
- ✅ **Save · Regenerate · Share · Export to PDF** (native browser print)
- ✅ **Explainable recommendation engine** — scores by interest overlap, budget fit, seasonality & sustainability, works fully offline
- ✅ **Floating AI chat assistant** grounded in the real destination catalog
- ✅ **Hidden-gem discovery** flags & surfaces under-visited alternatives
- ✅ **Explore / Search / Filter** with weather, attractions & accessibility notes
- ✅ **Hotels & Experiences** discovery + a side-by-side **compare view**

### 🏪 Local Business Ecosystem
- ✅ Public business directory + provider dashboard (add/edit/delete, inquiries, analytics)
- ✅ 💬 One-tap **WhatsApp inquiry** button — no Business API needed
- ✅ 💳 **Razorpay test-mode** payments with automatic WhatsApp fallback

### 👤 Accounts & Platform
- ✅ 🔐 Full JWT auth — register / login / logout, role-based access (`traveler` · `provider` · `admin`)
- ✅ 📊 Admin dashboard — stats, 6-month growth chart, top destinations, business moderation
- ✅ ⭐ Real reviews & ratings, **recalculated live** — never a static seed number
- ✅ 🏅 Gamified badges computed live from real user activity — nothing hardcoded
- ✅ 🌗 Light / dark theme, persisted & system-aware
- ✅ 🌐 **6 languages** — English, हिन्दी, मराठी, বাংলা, தமிழ், తెలుగు
- ✅ 🎙️ Voice input (Web Speech API) in chat & search
- ✅ 🔔 Native browser notifications for key actions
- ✅ 📱 Fully responsive, with skeletons, empty/error states & toasts

### ⚡ Offline & Performance
- ✅ 📲 Installable PWA with app-shell precaching
- ✅ 🔄 Network-first caching for recent API content + runtime photo caching
- ✅ 📡 Built-in offline indicator
- ✅ 🚀 Route-based lazy loading & vendor chunk splitting

## 🏗️ 4. Architecture

### 🗺️ Complete System Flowchart

```mermaid
flowchart TD
    A(["👤 USER START<br/>Open YatraMitra AI<br/>(Web / Mobile App)"]) --> B["📝 USER INPUT<br/>Search / Preferences / Destination / Dates / Budget"]

    B --> D1["📍 Destinations<br/>Attractions, Places, Images, Guides"]
    B --> D2["🏨 Hotels<br/>Availability, Prices, Amenities, Reviews"]
    B --> D3["🚶 Activities<br/>Tours, Adventure, Tickets, Events"]
    B --> D4["🚌 Transport & Routes<br/>Flights, Trains, Buses, Travel Time"]
    B --> D5["🌦️ Weather<br/>Live Weather, Forecast"]
    B --> D6["🏪 Local Businesses<br/>Restaurants, Shops, Services, Guides"]

    subgraph PLATFORM["🧭 YatraMitra AI Platform — Integrated System"]
        F1["🔍 Search<br/>Smart Search & Filters"]
        F2["📅 Itinerary<br/>AI Itinerary Planner"]
        F3["🧠 Recommendation<br/>AI-Based Recommendations"]
        F4["⭐ Reviews<br/>Ratings & Reviews"]
        F5["💬 Chat Assistant<br/>AI Travel Assistant"]
        F6["💳 Booking & Payment<br/>Secure Booking & Payments"]
        F7["🌐 Multi-Language<br/>Support for Indian Languages"]
    end

    D1 --> PLATFORM
    D2 --> PLATFORM
    D3 --> PLATFORM
    D4 --> PLATFORM
    D5 --> PLATFORM
    D6 --> PLATFORM

    subgraph ENGINE["🧠 AI Engine (YatraMitra AI)"]
        E1["• Understands user preferences<br/>• Analyzes real-time data<br/>• Generates personalized itinerary"]
        E2["• Predicts best options<br/>• Suggests sustainable & local experiences"]
    end

    PLATFORM --> ENGINE

    ENGINE --> G["🗺️ Personalized Travel Plan<br/>✓ Day-wise Itinerary &nbsp; ✓ Activities & Experiences<br/>✓ Places to Visit &nbsp; ✓ Route & Transport<br/>✓ Hotels & Stay &nbsp; ✓ Estimated Budget"]

    G --> H["👤 User Action<br/>Review Plan → Customize → Book → Pay<br/>Save Trip / Share Trip"]

    H --> I1["😊 User Benefits<br/>One Platform · Easy Planning<br/>Time & Money Saving · Personalized"]
    H --> I2["🏘️ Local Community<br/>More Visibility · More Tourists<br/>Higher Income · Sustainable Growth"]
    H --> I3["📈 Tourism Benefits<br/>Balanced Tourism · Reduced Overcrowding<br/>Better Resource Use · Eco-Friendly"]
    H --> I4["💼 Business Benefits<br/>More Customers · Higher Bookings<br/>Better Management · Data Insights"]
    H --> I5["🏛️ Admin / Government<br/>Tourism Analytics · Data-Driven Decisions<br/>Infrastructure Planning · Policy Support"]

    I1 --> J(["🏆 Smarter Travel – Better Experiences – Sustainable Tourism<br/>YatraMitra AI – Your AI Travel Companion ❤️"])
    I2 --> J
    I3 --> J
    I4 --> J
    I5 --> J

    style A fill:#4f46e5,color:#fff
    style J fill:#22c55e,color:#000
    style PLATFORM fill:#eef2ff,color:#000,stroke:#4f46e5
    style ENGINE fill:#e0f2fe,color:#000,stroke:#0ea5e9
```

> This mirrors the project's system-flowchart poster: a single user input fans out across six data domains, all of which feed the integrated platform and its AI engine, producing one personalized plan that benefits travellers, local communities, businesses, tourism at large, and government/admin stakeholders alike.

### ⚙️ Service-Level Architecture (Technical View)

```mermaid
flowchart TD
    U([👤 Traveller]) --> C["💻 React + Vite PWA"]

    C --> EX["🗺️ Explore / Hotels / Experiences / Businesses"]
    C --> PL["🤖 AI Planner / Chat"]

    PL --> DEC{"🔑 AI key configured?"}
    DEC -- Yes --> EXT["☁️ Anthropic / OpenAI / Gemini"]
    DEC -- No --> LOC["🧠 Local Explainable Engine"]
    EXT -- "fails / invalid / timeout" --> LOC

    C --> WX["🌦️ Open-Meteo Weather"]
    C --> RT["🛣️ OSRM Live Routing"]
    C --> MAP["📍 Google Maps Deep Link"]

    C --> API["🔒 Express API + Helmet + Rate Limits"]
    API --> DB[("🗄️ MongoDB")]
    API --> PAY["💳 Razorpay (optional)"]
    API --> RES["⭐ Reviews · 🧳 Trips · 🔖 Saved · 🛠️ Admin"]

    style U fill:#4f46e5,color:#fff
    style DEC fill:#f59e0b,color:#000
    style DB fill:#47A248,color:#fff
    style EXT fill:#0ea5e9,color:#fff
    style LOC fill:#22c55e,color:#fff
```

### 📁 Folder Structure

```text
YATRAMITRA-SIH2026/
├── client/                      # ⚛️ React + Vite frontend
│   └── src/
│       ├── components/          # 🧩 common/, cards/, layout/, ai/, visuals/
│       ├── pages/                # 📄 one file per route (+ provider/, admin/)
│       ├── layouts/              # 🖼️ MainLayout, AuthLayout, DashboardLayout...
│       ├── store/                 # 🗂️ zustand: authStore, plannerStore
│       ├── services/               # 🔌 axios API client
│       ├── hooks/                   # 🪝 useVoiceInput, useNotifications
│       ├── context/                  # 🧵 shared React context providers
│       ├── i18n/                      # 🌐 i18next + locales/ (6 languages)
│       ├── animations/                 # 🎞️ Framer Motion variants
│       ├── data/                        # 📦 static fallback/demo data
│       └── utils/                        # 🛠️ constants, badges, image helpers
│
└── server/                      # 🟢 Node + Express backend
    ├── config/                   # ⚙️ DB connection & app config
    ├── controllers/               # 🎮 one per resource
    ├── routes/                     # 🛣️ one per resource
    ├── models/                      # 🗃️ Mongoose schemas
    ├── middleware/                    # 🛡️ JWT guard, error handling
    ├── services/                       # 🧠 AI, recommendations, payments, live travel
    ├── data/                             # 🌱 destinations.js dataset + seed.js
    └── utils/                             # 🔑 token generation & helpers
```

## 🔁 5. Project Workflow

### 🧑‍💻 End-to-End Traveller Journey

```mermaid
flowchart TD
    A(["🏁 Open YatraMitra"]) --> B["🔎 Explore or Login / Register"]
    B --> C["🧾 Enter preferences\n(budget · interests · dates · style)"]
    C --> D["🤖 AI recommendations generated"]
    D --> E["📍 Select a destination"]
    E --> F["📖 View destination details\n(attractions, season, sustainability)"]
    F --> G["🏨 Browse hotels"]
    G --> H["🎈 Explore experiences"]
    H --> I["🏪 Check local businesses / guides"]
    I --> J["🗓️ Generate day-wise itinerary"]
    J --> K["💰 Review estimated trip cost"]
    K --> L["💾 Save / Create trip"]
    L --> M["🧳 Manage trip in dashboard"]
    M --> N["🌦️ Use live weather & route info"]
    N --> O(["⭐ Rate & review after the trip"])

    style A fill:#4f46e5,color:#fff
    style O fill:#4f46e5,color:#fff
    style D fill:#22c55e,color:#000
    style J fill:#22c55e,color:#000
```

### ⚙️ Request Flow — How a Planner Request Is Handled

```mermaid
sequenceDiagram
    actor U as 👤 Traveller
    participant FE as 💻 React Frontend
    participant API as 🔒 Express API
    participant DB as 🗄️ MongoDB
    participant AI as 🧠 Recommendation / AI Engine

    U->>FE: Enter trip preferences
    FE->>API: POST /api/ai/plan-trip
    API->>DB: Fetch matching destination data
    DB-->>API: Destination records
    API->>AI: Send context + preferences
    alt AI provider key configured & responds validly
        AI-->>API: Structured day-wise itinerary
    else No key / timeout / invalid response
        API->>API: Fall back to local deterministic engine
        API-->>API: Build itinerary from scoring rules
    end
    API->>API: Validate itinerary shape (days, slots, cost)
    API-->>FE: Validated itinerary + estimated cost
    FE-->>U: Render day-wise plan
    U->>FE: Save trip
    FE->>API: POST /api/trips
    API->>DB: Persist trip
```

### 🗂️ Step-by-Step Summary

| # | Step | What Happens |
|---|---|---|
| 1 | **Discover** | User explores destinations or logs in / registers |
| 2 | **Input Preferences** | Budget, interests, travel dates, group size, travel style |
| 3 | **AI Recommendation** | Rule-based engine scores destinations (interest, budget, season, sustainability, hidden-gem bonus) |
| 4 | **Destination Deep-Dive** | User reviews attractions, accessibility & sustainability info |
| 5 | **Cross-Explore** | Hotels, experiences and local businesses for that destination |
| 6 | **Itinerary Generation** | External LLM (Claude/OpenAI/Gemini) attempts a day-wise plan; local engine is the automatic fallback |
| 7 | **Validation** | Backend checks day count, morning/afternoon/evening structure & JSON shape before trusting AI output |
| 8 | **Cost Estimate** | Planner calculates an estimated trip cost from hotel tier + experiences |
| 9 | **Save & Manage** | Trip is stored (`generatedBy: local-engine \| external-ai`) and manageable from the dashboard |
| 10 | **Live Utilities** | Weather (Open-Meteo) and routing (OSRM) support the trip in real time |
| 11 | **Post-Trip Feedback** | Reviews/ratings feed back into the platform, recalculated live |

## 🛠️ 6. Tech Stack

| Layer | Stack |
|---|---|
| 🎨 **Frontend** | React 19 · Vite 8 · Tailwind CSS 3 · Framer Motion · Zustand · React Router · i18next · Recharts · lucide-react · react-hot-toast |
| 🟢 **Backend** | Node.js · Express 4 · MongoDB + Mongoose 8 · JWT · bcryptjs · express-rate-limit |
| 🤖 **AI Providers** | Anthropic Claude · OpenAI · Google Gemini *(pluggable, server-side only)* |
| 🌐 **External APIs** | Open-Meteo (weather) · OSRM (routing) · Google Maps · Razorpay |
| 📲 **PWA/Offline** | vite-plugin-pwa · service worker caching |

## 🚀 7. Installation

**Requirements:** 🟢 Node.js 18+ · 📦 npm · 🍃 a running MongoDB instance (local or Atlas)

```bash
git clone <your-repository-url>
cd YATRAMITRA-SIH2026
npm run install:all
```

## 🔑 8. Environment Variables

**Server** → copy `server/.env.example` ➜ `server/.env`

| Variable | Required | What it does |
|---|:---:|---|
| `PORT` | – | API port (default `5000`) |
| `NODE_ENV` | – | `development` / `production` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Auth token signing secret |
| `JWT_EXPIRES_IN` | – | Auth token lifetime (default `7d`) |
| `COOKIE_SECRET` | ✅ | Cookie signing secret |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` | – | Set **one** to unlock live AI ✨ |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | – | Enables 💳 payments (use test keys) |
| `SENTRY_DSN` | – | Reserved for future error monitoring |

> 💡 **No AI key? No problem.** The local engine keeps everything working end to end.

**Client** → copy `client/.env.example` ➜ `client/.env`

| Variable | Required | What it does |
|---|:---:|---|
| `VITE_API_URL` | ✅ | Backend base URL |

## 🌱 9. Seeding & Running

```bash
npm run seed          # 🌱 populate MongoDB with the destination catalog
```

```bash
# Terminal 1
npm run dev:server    # 🔧 API on :5000

# Terminal 2
npm run dev:client    # ⚡ frontend on :5173
```

🎉 Open **http://localhost:5173**

## 📜 10. Available Scripts

| Command | What it does |
|---|---|
| `npm run install:all` | 📦 Installs client + server dependencies |
| `npm run seed` | 🌱 Seeds the database |
| `npm run dev:server` | 🔧 API with auto-reload |
| `npm run dev:client` | ⚡ Vite dev server |
| `npm run build:client` | 🏗️ Production frontend build |
| `npm start` *(server/)* | 🚀 Production API |
| `npm run lint` *(client/)* | 🧹 Lint with oxlint |

## 🔌 11. API Reference

> 🔒 = login required · 🔐 = specific role required — all routes prefixed with `/api`

| 📦 Resource | Endpoint(s) | Method | What it does |
|---|---|---|---|
| 🔐 Auth | `/auth/register` `/login` `/logout`🔒 `/me`🔒 `/profile`🔒 | — | Registration & session |
| 📍 Destinations | `/destinations` `/destinations/:id` | GET | Browse catalog |
| 🏨 Hotels | `/hotels` `/hotels/:id` | GET | Browse hotels |
| 🎈 Experiences | `/experiences` `/experiences/:id` | GET | Browse experiences |
| 🏪 Businesses | `/businesses` `/businesses/mine`🔐 `/businesses/:id`🔐 | GET/POST/PUT/DELETE | Directory + listings |
| 💬 Inquiries | `/businesses/:id/inquiries` | POST | Contact a business |
| 🧳 Trips | `/trips` `/trips/:id` 🔒 | GET/POST/PUT/DELETE | Manage trips |
| 🔖 Saved | `/saved` `/saved/:id` 🔒 | GET/POST/DELETE | Save/unsave items |
| ⭐ Reviews | `/reviews` `/reviews/mine`🔒 `/reviews/:id`🔒 | GET/POST/PUT/DELETE | Reviews + live ratings |
| 🤖 AI | `/ai/plan-trip` `/ai/recommend` `/ai/chat` | POST | Planner & chat |
| 📈 AI Eval | `/ai/evaluation` | GET | Synthetic P/R/F1 benchmark |
| 🌦️ Live | `/live/destination/:id` `/live/route/:id` | GET | Weather & routing |
| 💳 Payments | `/payments/status` `/create-order`🔒 `/verify`🔒 | GET/POST | Razorpay test flow |
| 🌱 Impact | `/impact` | GET | Sustainability indicators |
| 🛠️ Admin | `/admin/stats` `/users` `/businesses` `/businesses/:id/status` 🔐 | GET/PUT | Platform admin |
| ❤️ Health | `/health` | GET | Health check |

## 🏅 12. Gamification & Badges

> Computed **live** from real trips/saved items — never stored, never hardcoded.

| Sticker | Badge | Earned when |
|:---:|---|---|
| 🧭 | **First Journey** | You plan your first trip |
| 📍 | **Explorer** | You plan 3+ trips |
| 💎 | **Hidden Gem Explorer** | You plan/save a hidden-gem destination |
| 🌿 | **Sustainability Champion** | Your destinations average an 80+ sustainability score |
| 👛 | **Budget Master** | You plan a budget-tier trip |
| 🔖 | **Curator** | You save 5+ places |
| ✨ | **AI Pioneer** | You generate an LLM-enhanced itinerary |

## 🔒 13. Security

- 🛡️ Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS in prod) on every response
- 🌐 CORS locked to a single `CLIENT_URL` origin, credentials-enabled
- 🚦 Global rate limiting + a stricter limiter on `/api/ai`
- 📦 JSON body capped at 2 MB
- 🔑 bcrypt password hashing + signed JWT in HTTP-only cookies
- 👥 Role-based access control (`traveler` / `provider` / `admin`)
- 🙈 Stack traces hidden in production

## 🧠 14. The AI Layer — Local Engine + Optional LLM

```mermaid
flowchart TD
    A(["📨 Plan-Trip / Chat Request"]) --> B{"🔑 Provider key set?"}
    B -- "No" --> L["🧠 Local Deterministic Engine\n(interest • budget • season • sustainability)"]
    B -- "Yes" --> C["☁️ Call Anthropic → OpenAI → Gemini"]
    C --> D{"⏱️ Valid & on-time response?"}
    D -- "No (timeout/invalid/error)" --> L
    D -- "Yes" --> E["✅ Use AI-generated itinerary"]
    L --> F(["📬 Response to Traveller"])
    E --> F

    style A fill:#4f46e5,color:#fff
    style F fill:#4f46e5,color:#fff
    style E fill:#22c55e,color:#000
    style L fill:#22c55e,color:#000
    style C fill:#0ea5e9,color:#fff
    style B fill:#f59e0b,color:#000
    style D fill:#f59e0b,color:#000
```

- 🧩 The prompt is grounded in the real destination record (attractions, cost, season, safety notes) — no invented places.
- ✅ Every AI response is **shape-validated** before it's trusted.
- 🔁 Trips store `generatedBy: "local-engine" | "external-ai"` so it's always clear which path answered.
- ⚙️ **To enable live AI:** set `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` and restart the backend — zero frontend changes needed.

## ⚠️ 15. Known Limitations

- 🧠 Local engine is the default by design (works with zero API keys) — test the live-AI path with your own key before a demo
- 💳 Razorpay integration is complete but untested against a **live** account — use test-mode keys
- 🔕 Browser notifications only fire while the tab is open (no closed-app push yet)
- 🏨 No real-time hotel booking/availability
- ✉️ Contact & Forgot Password forms simulate submission client-side (no email provider wired up)
- 📊 `/api/ai/evaluation` and `/api/impact` are engineering demo metrics, not field-study claims
- 🛰️ `SENTRY_DSN` is a forward-looking hook — monitoring isn't wired into code yet

## 🗺️ 16. Roadmap / Future Scope

- [ ] 🏨 Real hotel/flight booking API integration
- [ ] 💬 Real-time chat with human local guides
- [ ] 🔔 True closed-app push notifications (Firebase Cloud Messaging or similar)
- [ ] 🛰️ Wire up Sentry for real production error monitoring
- [ ] 👥 Community-reported live crowd levels
- [ ] 🖱️ Drag-and-drop itinerary day reordering
- [ ] 📱 Native mobile app
- [ ] 📈 Real, consented, user-labelled AI evaluation dataset

## ✅ 17. Production Checklist

- [ ] 🍃 MongoDB Atlas or another managed, backed-up deployment
- [ ] 🔐 `NODE_ENV=production` + strong random `JWT_SECRET` / `COOKIE_SECRET`
- [ ] 🌐 `CLIENT_URL` restricted to the exact deployed origin
- [ ] 🔑 AI & Razorpay secrets stay server-side only
- [ ] 💳 Razorpay test-mode keys unless a real merchant account is intended
- [ ] 🔒 API served behind HTTPS via reverse proxy/load balancer
- [ ] 🛰️ Sentry (or equivalent) implemented and configured
- [ ] 📊 Synthetic AI benchmark replaced with real evaluation data

## 🤝 18. Contributing

1. 🍴 Fork the repo & create a feature branch
2. 🧑‍💻 Make your changes, following the existing code style
3. 📬 Open a PR with a clear description

Please open an issue first to discuss significant changes. PRs welcome! 💚

## 📄 19. License

This project is licensed under the **MIT License** — see [`LICENSE`](./LICENSE) for the full text.

In short: you're free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided the copyright notice and permission notice are kept. The software is provided **"as is"**, without warranty of any kind.

---

<div align="center">

### 🏆 Built for AICTE Problem Statement 26204 · Smart India Hackathon 2026

⭐ **If YatraMitra helped you, drop a star!** ⭐

</div>
