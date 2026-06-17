# Nomichi Trip Desk

Nomichi is a community-led, slow-travel brand that organizes intimate, small-group journeys across India. This repository contains the Trip Desk — a bespoke platform comprising both the public-facing landing page and a team admin dashboard (mini-CRM) to manage leads, trips, and customer communications.

---

## Technical Architecture

* **Framework**: Next.js 15 (App Router, React 19)
* **Language**: TypeScript
* **Database & Auth**: Supabase (Postgres) with Row-Level Security (RLS)
* **Styling**: Tailwind CSS & Vanilla CSS (using variables like `--ink`, `--cream`, `--rust`)
* **Animations**: Framer Motion & GSAP (for smooth parallax scrolls and spring-based entrances)
* **AI Engine**: Flexible routing supporting Groq (Llama 3 8B), OpenAI (GPT-4o-mini), and local fallback heuristics.

---

## Core Features

### 1. Public Journey Hub & Booking Request
* **Curated Travel Feed**: Shows open, upcoming journeys dynamically fetched from the database.
* **Resilient Layout Typing**: A responsive typing animation in the hero section ("Travel that stays with you.") designed to prevent layout shifts across viewports.
* **Enquiry Portal**: Allows prospective travelers to submit detailed booking inquiries. Supports validation and Chrome-compatible select elements.

### 2. Admin Workspace (Mini-CRM)
* **CRM Dashboard**: Real-time stats, dynamic visual progress charts, and active leads logs.
* **Modularized Directory**: Optimized CRM codebases split into independent visual chunks like `LeadInfoCard`, `TouchpointsLog`, and `PipelineStepper`.
* **Lead Tracking**: Fast inline owner assignment, status changes, and activity logs.
* **Self-attributing Logs**: Automatically assigns user ID tags (`auth.uid()`) to note creations.
* **CSV Exports**: Quick-action lead sheet exports.

### 3. Integrated AI Features
* **WhatsApp Draft System**: Builds highly personalized, brand-voice-compliant introduction messages based on the customer's travel style.
* **Vibe Fit Check**: Automatically grades traveller input ("Fit", "Neutral", "Requires Call") against our trip philosophy.
* **Timeline Summarizer**: Condenses long-running touchpoint logs into single-line summaries.
* **Local Heuristic Mode**: Instantly switches to local mock engines if API keys are missing to guarantee a seamless build.

---

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_optional_openai_key
GROQ_API_KEY=your_optional_groq_key
```

### 3. Prepare Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Execute the schema script located in [supabase/schema.sql](file:///e:/Internship%20Assignments/Trip-Desk/supabase/schema.sql) in the SQL Editor.
3. Seed test data using [supabase/seed.sql](file:///e:/Internship%20Assignments/Trip-Desk/supabase/seed.sql).
4. Make sure your database trigger `on_auth_user_created` is correctly mapped to catch new user registrations and sync them into `user_profiles`.

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to preview.

---

## Design and Editorial Alignment
* **Editorial Rules**: All copy avoids exclamation marks and em-dashes (`—`) to maintain Nomichi's calm, deliberate tone.
* **Typography**: Clean header font styling using **Playfair Display** (`font-display`) and crisp numeric/content typography via **Poppins** (`font-sans`).
* **Performance**: Replaced custom font link wrappers with optimized Google Fonts preloading to prevent flickering or layout shifts.
