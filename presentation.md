# Wanderlore — AI-Powered Cultural Discovery & Travel Platform
<!-- slide -->

## 1. The Vision & The Problem

### Overtourism vs. Meaningful Travel
* **The Problem**: Traditional travel apps direct millions to identical "tourist traps", contributing to local cultural degradation and environmental strain.
* **The Opportunity**: Travelers want authentic, respectful, and sustainable local immersion, but lack the regional knowledge and custom advice.
* **Our Solution**: **Wanderlore** is a GenAI travel platform that uses Gemini 2.5 Flash to connect explorers with local secrets, history, and living heritage respectfully.

---
<!-- slide -->

## 2. Platform Architecture

```
                                 ┌────────────────────────┐
                                 │   Next.js 16 Client    │
                                 └───────────┬────────────┘
                                             │ fetch POST
                                             ▼
                                 ┌────────────────────────┐
                                 │  IP Rate-Limit Guard   │
                                 └───────────┬────────────┘
                                             │ OK
                                             ▼
                                 ┌────────────────────────┐
                                 │ Input Sanitization     │
                                 └───────────┬────────────┘
                                             │
                                             ▼
       ┌───────────────────┐    No (Miss)┌────────────────────────┐
       │   Gemini API      │◄────────────┤  In-Memory TTL Cache   │
       │ (2.5 Flash Model) │             └───────────┬────────────┘
       └─────────┬─────────┘                         │
                 │ JSON / Stream                     │ Yes (Hit)
                 ▼                                   ▼
       ┌───────────────────┐             ┌────────────────────────┐
       │ Safe HTML Render  │◄────────────┤     Cached Payload     │
       └───────────────────┘             └────────────────────────┘
```

---
<!-- slide -->

## 3. Seven AI-Powered Core Modules

1. **Destination Discovery**: Custom recommendations matching specific traveler interests, travel styles, and budgets.
2. **Hidden Gems Finder**: Uncovers neighborhood secret viewpoints, local food spots, and artisan crafts.
3. **Cultural Storytelling**: Streams regional epics, historical sagas, and legends in real-time.
4. **Festival Suggester**: Indexes seasonal cultural festivals along with required dress codes and respect protocols.
5. **Heritage Guides**: Deep architectural timelines, historical importance, and expert photography tips.
6. **AI Travel Companion**: Streaming chat companion that manages context, translates phrases, and guides on customs.
7. **Smart Itinerary Planner**: Schedules balanced geographic routes, regional meals, and custom packing tips.

---
<!-- slide -->

## 4. Prompt Engineering Strategy

### Structured JSON Engineering
* Enforces `responseMimeType: "application/json"` for all factual data endpoints.
* Prompts specify rigid schemas ensuring matching interfaces on the frontend.

### Specificity Enforcement
* Explicitly forbids generalities. Enforces naming of real local street markets, specific traditional dishes, and active local artisan guilds.

### Role-Based Persona
* Uses System Instructions to anchor the model as a highly respectful, warm, and culturally-fluent local guide.

---
<!-- slide -->

## 5. Security & Resource Protection

### Server-Side Protection
* Gemini API Key is held securely in server-side Next.js route handlers (`process.env.GEMINI_API_KEY`) and never leaked to the client.

### Input Sanitization & Jailbreak Guards
* String parsing filters strip HTML tags and collapses spaces.
* Active regex checker blocks prompt injection jailbreaks (e.g. "ignore previous instructions").

### IP Rate Limiter
* Limits callers to 20 requests per minute per IP, protecting the API quota from automated script abuse.

---
<!-- slide -->

## 6. Performance & Optimizations

### Smart In-Memory Caching
* Cache keys sorted by parameter keys so ordering doesn't bypass cache.
* 5-minute Time-To-Live (TTL) prevents stale recommendations.
* 100-entry capacity limit with automatic oldest-key eviction to prevent memory leak vulnerabilities.

### Tree-Shakeable Icon Registry
* Replaced wildcard imports with a static map of strictly imported Lucide React icons.
* Shaved over **200KB of unused JavaScript** from the production bundle size.

### Safe HTML Rendering
* Input stream text is escaped at the character level before parsing markdown, blocking any XSS injections into `dangerouslySetInnerHTML`.

---
## 7. QA, Testing, & Production Build

### Automated Test Suite (32 Passing Assertions)
* **Validators**: Validates sanitization rules, bad input values, out-of-range days, and prompt injections.
* **Cache**: Tests order-independent cache key generation, TTL evictions, and maximum storage capacity limits.
* **Rate Limiter**: Asserts client request allowances, request blocking, and time-window resets.

### Production Compile
* Runs under Next.js 16 Turbopack compiler.
* Static page pre-rendering builds successfully with **0 compilation errors**.
