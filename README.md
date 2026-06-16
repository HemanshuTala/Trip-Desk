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

## API Routes

All database operations use Supabase client-side SDK. Server-side operations use the service role key for admin actions.

## Security

- Row Level Security (RLS) enabled on all tables
- Admin routes protected by middleware
- Service role key never exposed to client
- Environment variables for all secrets

## Development Notes

- The app uses Nomichi's brand voice: warm, honest, specific, still
- No exclamation marks or em-dashes in product copy
- Mobile-first design approach
- AI features run server-side for security

## What I Built

This is a complete trip desk application that:
- Allows travellers to browse trips and submit enquiries
- Provides a full CRM for the Nomichi team to manage leads
- Includes trip management as a CMS
- Has a dashboard for quick overview
- Includes AI-assisted WhatsApp message drafting
- Is fully deployed and seeded with sample data

## Key Decisions

1. **Database Schema**: Used proper relationships with foreign keys and RLS for security
2. **Pipeline Status**: Implemented the exact pipeline stages specified in the brief
3. **Brand Consistency**: Used exact brand colors and typography guidelines
4. **AI Feature**: Chose WhatsApp message drafting as it provides immediate value
5. **Seed Data**: Included realistic trips and leads for immediate testing

## Future Improvements

With more time, I would:
- Add row-level security for owner-specific lead visibility
- Implement CSV export for leads
- Add activity timeline per lead
- Enhance the dashboard with more metrics
- Add email notifications for lead updates
