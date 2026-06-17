# Nomichi Trip Desk

A web application for managing travel enquiries and trips for Nomichi, a community-led travel brand.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini for message drafting
- **Hosting**: Vercel

## Features

### Part 1: Public Enquiry Page
- Browse open trips with destination, dates, price, and description
- Submit enquiry form with validation
- Warm confirmation state

### Part 2: Team Admin (Mini-CRM)
- Authenticated admin area
- Lead list with search and filters
- Lead detail view with pipeline management
- Call log / touchpoints tracking
- Owner assignment

### Part 3: Trip Management
- Create and edit trips
- Open/closed trip status
- Automatic display on public page

### Additional Features
- Dashboard overview with key metrics
- AI-assisted WhatsApp message drafting
- Row-level security for owner-specific lead visibility
- CSV export for leads
- Activity timeline with visual design
- Seed data for immediate testing

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run Database Schema

1. Go to Supabase SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create tables and set up RLS policies

### 4. Seed the Database

1. In Supabase SQL Editor, run the contents of `supabase/seed.sql`
2. This will create 4 sample trips and 4 sample leads

### 5. Set Up OpenAI (Optional, for AI Feature)

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file as `OPENAI_API_KEY`
3. The AI feature will generate WhatsApp message drafts for leads
4. Without this key, the AI feature will show an error message

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
Trip-Desk/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin routes (protected)
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── supabase.ts       # Supabase client
│   └── types.ts          # TypeScript types
├── supabase/             # Database files
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
└── middleware.ts         # Auth middleware
```

## Brand Colors

- Rust: `#D55D27`
- Yellow: `#FFFE00`
- Ink: `#1C1B1A`
- Olive: `#45471D`
- Sand: `#D1B788`
- Cream: `#FFFBF5`

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The application will be live and ready to use.

## API Routes & AI Engine

- **API Routes**: Database interactions are direct via the Supabase client-side SDK utilizing SSR session sync.
- **Dual AI Engine**: Built a robust server-side backend supporting both **Groq (Llama 3 8B)** and **OpenAI (GPT-4o-mini)**. If `GROQ_API_KEY` is present, it uses Groq's high-speed Llama model; otherwise, it falls back to OpenAI. If neither key is configured, it operates gracefully using local heuristics-based fallback logic (no crashes).
- **AI Features**:
  1. *WhatsApp Message Draft*: Custom prompt generates a warm, still introduction in the Nomichi voice based on traveler vibe.
  2. *Vibe Fit Check*: Evaluates the traveler's hopes and month to suggest a match ("Fit", "Neutral", "Requires Call") with a one-line explanation.
  3. *Call Log Summarizer*: Condenses logged call logs and touchpoints into a single-line status summary.

## Security & Database Architecture

- **Row Level Security (RLS)**: Active on all tables (`trips`, `leads`, `call_logs`, `user_profiles`).
  - Added public SELECT policy on open trips, and authenticated select policy for admins to view all trips (including closed ones).
  - Configured public INSERT policy on leads to allow public enquiry submission.
  - Set owner-specific and authenticated-wide SELECT and UPDATE rules on leads.
- **Postgres Database Trigger**: Configured an automatic PostgreSQL trigger on `auth.users` (`on_auth_user_created`) to sync newly registered users into the `user_profiles` table instantly.
- **Self-attributing Call Logs**: Modified `call_logs` table schema to set `created_by` default to `auth.uid()`, attributing notes automatically to the logged-in team member.
- **Client-side Conflict Mitigation**: Updated the signup flow to use `.upsert` to avoid unique key conflicts with the trigger.

## Development & Typography Notes

- **Aesthetics & Branding**: Uses Nomichi brand colors (Rust `#D55D27`, Yellow `#FFFE00`, Ink `#1C1B1A`, Olive `#45471D`, Sand `#D1B788`, Cream `#FFFBF5`).
- **Typography**: Display typography uses **Playfair Display** (`font-display`) and body text uses **Poppins** (`font-sans`), fully mapped in `tailwind.config.ts`.
- **Editorial Voice**: Strict enforcement of the Nomichi brand voice rules (no exclamation marks, no em-dashes, no AI-isms like "unlock", "elevate", or "embark").

## Key Decisions

1. **Database Schema Integrity**: Leveraged PostgreSQL triggers and defaults (e.g. `auth.uid()`) rather than client-side values to secure the data integrity.
2. **Unified Cookie Auth**: Switched local storage auth clients to unified SSR cookie clients, allowing Next.js middleware and server routes to perform secure RLS queries.
3. **Typography & Brand Alignment**: Mapped Google Fonts variables straight to Tailwind theme config for clean editorial style.
4. **Resilient AI Mocking**: Configured standard local mocks for AI functions when keys are missing, allowing the codebase to build and run perfectly.
5. **Team Note Attribution**: Replaced generic note attribution badges with dynamic member lookup to provide a genuine CRM experience.

## Future Improvements

- Add email notification triggers on lead pipeline status changes (e.g., Vibe Check sent).
- Create lead scoring based on vibe responses.
- Implement live chat/WhatsApp webhook sync.
- Design advanced dashboards with charts and conversion funnel analysis.
