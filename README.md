# 🌍 Wanderlore — Destination Discovery & Cultural Experiences Platform

Wanderlore is a premium, GenAI-powered full-stack travel platform designed to help travelers discover destinations, find hidden local secrets, and connect with authentic living cultures in meaningful, respectful ways.

The application leverages the official **Google GenAI SDK (`@google/genai`)** with **Gemini 2.5 Flash** to power seven unique, interactive modules that transform basic trip planning into rich cultural narratives.

---

## 🌟 Core Features

1.  **🗺️ Destination Discovery**: Get custom destination recommendations tailored to your interests, budget, and travel style. Each suggestion includes a dedicated "Cultural Narrative" explaining *why* it fits you.
2.  **💎 Hidden Gems Finder**: Find local artisan shops, food spots, viewpoints, and neighborhood secrets. Skip the tourist traps and support sustainable community tourism.
3.  **📖 Cultural Storytelling**: Watch stories, legends, and historical epics stream live. Read immersive stories crafted around custom destinations.
4.  **🎭 Festival & Event Suggester**: Discover seasonal festivals, traditional celebrations, and essential etiquette guidelines to participate respectfully.
5.  **🏛️ Heritage Guides**: Explore architectural significance, timelines, historical importance, and expert photography tips for UNESCO locations and cultural landmarks.
6.  **🤖 AI Travel Companion**: Have a conversational dialog with Wanderlore, a helpful guide ready to translate, suggest dishes, or explain local customs 24/7.
7.  **📋 Smart Itinerary Planner**: Construct custom day-by-day schedules with geographic flows, meal recommendations, and packing lists.

---

## 🛠️ Technology Stack & Architecture

-   **Frontend**: Next.js 15 (App Router), React 19, TypeScript
-   **Styling**: Vanilla CSS with CSS Modules (Premium dark-first glassmorphism design)
-   **AI SDK**: `@google/genai` (Official Google GenAI SDK)
-   **Model**: `gemini-2.5-flash`
-   **Animations**: Framer Motion & CSS Micro-animations
-   **Icons**: Lucide React
-   **Caching**: In-Memory Cache with a 5-minute TTL to minimize token consumption
-   **Sanitization**: Regular-expression security filters to prevent prompt injection and HTML injection

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the project
```bash
git clone <repository-url>
cd destination-discovery-cultural-experiences
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## ⚙️ Prompt Engineering Strategy

All features utilize the **System Instruction** interface of the Gemini API to enforce strict role guidelines:
-   **Structured Outputs**: JSON schemas are enforced via `responseMimeType: "application/json"` to ensure reliability.
-   **Evocative Content**: The model is instructed to write in descriptive prose using sensory cues rather than boring bullet points.
-   **Specifics Guidelines**: Broad generalizations are prohibited. The model is forced to name actual markets, food items, streets, and artisan guilds.
-   **Etiquette Filters**: Prominently guides users on cultural safety, dress codes, and local guidelines.

---

## 🚀 Deployment Guide (Vercel)

Wanderlore is fully optimized for zero-config Vercel deployment:

1.  **Push your repository to GitHub/GitLab/Bitbucket.**
2.  **Import to Vercel**:
    -   Log in to [Vercel](https://vercel.com).
    -   Click **"Add New Project"** and import your repository.
3.  **Environment Variables**:
    -   In the "Environment Variables" section, add:
        -   Name: `GEMINI_API_KEY`
        -   Value: `<your_gemini_api_key>`
4.  **Deploy**:
    -   Click **"Deploy"**. Vercel will build the Next.js app and serve it at a public URL.

---

## 🛡️ Security & Performance

-   **Backend Decoupling**: Raw Gemini API calls are kept entirely on server-side Next.js route handlers.
-   **Inputs Validation**: All inputs (durations, categories, texts) are sanitized. Prompt injections are flagged and rejected.
-   **Response Caching**: Matching profiles retrieve answers from an in-memory cache to ensure speed and budget efficiency.
