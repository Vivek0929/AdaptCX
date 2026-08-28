# AdaptCX — AI Website Content Personalization SaaS

> **Hackathon Theme:** AI for Customer Experience  
> **Core Mission:** Make any business's website feel personally written for whoever is visiting it.

---

## 🌟 Overview

Most B2B websites show the exact same generic copy to every visitor, even though a "Healthcare Clinic" and a "Fintech Startup" care about completely different pain points.

**AdaptCX** solves this by letting a business:
1. **Describe its product once** and list the distinct target use cases (visitor personas) it serves along with their pain points.
2. **Generate AI-tailored content** for all 7 key website blocks (`hero_headline`, `hero_subheadline`, `feature_1`, `feature_2`, `feature_3`, `cta_text`, `testimonial`) using **Google Gemini** (with automatic **OpenAI** failover).
3. **Embed the widget** via a lightweight 1-line script tag with `data-adaptcx` HTML attributes on target elements.
4. **Track visitor interaction** (quiz completion, page views, and personalized CTA conversion events) in real-time.

---

## 🚀 Key Features

### 🏢 Multi-Tenant Business Dashboard
- **JWT Authentication & Onboarding:** Secure password hashing (bcrypt), multi-tenant data isolation, industry & brand tone capture.
- **Target Use Cases Management:** CRUD for visitor personas with custom pain points and quiz sort ordering.
- **Baseline Copy Editor:** Manage default generic copy for all 7 website blocks.
- **AI Content Studio:** 1-Click AI generation, matrix comparison table (Use Case × Block Key), in-place editing, and publish/unpublish toggles.
- **Live Simulator:** Preview website copy in real-time with an interactive persona dropdown switcher in desktop and mobile viewports.
- **Embed Center:** Copyable 1-line `<script>` tag and HTML data attribute guide (`data-adaptcx="..."`) for Webflow, WordPress, Framer, and custom sites.
- **Performance Insights & Analytics:** Recharts bar chart comparing quiz completions, CTA clicks, and conversion rates per use case.

### 🌐 Visitor-Facing Experience (`/site/:businessId`)
- Public demo landing page representing a live customer website.
- Floating / modal quiz overlay on first visit.
- Instant zero-reload copy swapping to the AI-tailored variant.
- Persistent session memory (localStorage) to remember visitor choices on return visits.
- Interactive personalized CTA button that tracks conversion events back to the dashboard.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Recharts, Axios |
| **Backend** | Node.js, Express.js, JWT, BcryptJS, Zod, Helmet, CORS, Express-Rate-Limit |
| **Database** | PostgreSQL / Supabase with Row Level Security (RLS) & local persistent fallback adapter |
| **AI Engine** | Anthropic Claude SDK (`claude-3-5-sonnet` / `claude-sonnet-4-6`) + Google Gemini SDK fallback (`gemini-1.5-flash`) |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_long_random_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=/api
```

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Database Migration (Optional for Supabase)
If using Supabase, paste `backend/src/db/schema.sql` into the Supabase SQL Editor.  
*(Note: If Supabase credentials are not set, AdaptCX automatically uses its integrated local persistent storage for zero-friction testing!)*

### 3. Start Backend Server
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

### 4. Start Frontend Application
```bash
cd frontend
npm run dev
# App runs at http://localhost:5173
```

### 5. Run Automated End-to-End Tests
```bash
cd backend
node src/db/testE2E.js
```

---

## 📦 Standalone Widget Embed Usage

Include this single script tag on any external website:

```html
<!-- AdaptCX Personalization Widget -->
<script src="https://your-backend-domain.com/embed.js" data-business-id="YOUR_BUSINESS_ID" async></script>

<!-- Tagged Website HTML Elements -->
<h1 data-adaptcx="hero_headline">Default Headline</h1>
<p data-adaptcx="hero_subheadline">Default Subheadline</p>
<button data-adaptcx="cta_text">Get Started</button>
<div data-adaptcx="feature_1">Default Feature 1</div>
<div data-adaptcx="feature_2">Default Feature 2</div>
<div data-adaptcx="feature_3">Default Feature 3</div>
<blockquote data-adaptcx="testimonial">Default Testimonial Quote</blockquote>
```

---

## 🚀 Production Deployment

### 1. Backend (Render / Railway / Fly.io)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Set environment variables (`JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `FRONTEND_ORIGIN`).

### 2. Frontend (Vercel / Netlify)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable: `VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api`

---

## 🛡️ Security & Tenant Isolation

- **Tenant Scoping:** All database queries strictly enforce `WHERE business_id = req.businessId` verified from JWT.
- **LLM Key Protection:** AI API keys are stored exclusively in backend server memory and never sent to clients.
- **Rate Limiting:** Public quiz and event submission endpoints are protected by IP rate limiters.
- **Input Sanitization:** Every API endpoint is validated with strict Zod schemas.
