# Nomichi · Engineering Intern · Build Assignment

> **CONFIDENTIAL · FOR APPLICANTS ONLY**

---

## Role Details

| Field | Details |
|---|---|
| **Role** | Engineering Intern (Remote, 3 to 6 months) |
| **Stack** | Next.js · Supabase · PostgreSQL · Vercel · GitHub |
| **Time to Build** | 7 days from the day you receive this |
| **Send To** | tech@thenomichi.com |

---

## First, the Why — Welcome to the Build

Nomichi is a community-led travel brand. We design slow, offbeat, small-group journeys for people who want a trip to feel personal. Every trip is screened, curated and run end to end by our own team.

Here is the honest truth about how we work today. Leads come in from ads, Instagram and WhatsApp. A sales associate copies them into a Google Sheet, sends a first message, calls to qualify, runs a short "vibe check", and updates a status by hand. Trips and prices live in another sheet. Nothing talks to anything. Things fall through the cracks because the tools were never built for the job.

We want to fix that. This assignment is the first real piece of it. You are not building a toy. You are building the tool our team would use on Monday morning.

> **"We believe the future of engineering is AI native. The tool does the heavy lifting. You do the thinking.**
>
> That is exactly what we are testing here. AI is fully allowed. Judgement is not optional."

---

## What We Actually Test — Thinking Over Typing

We do not run DSA rounds, whiteboard puzzles or trick questions. They tell us almost nothing about whether you can build something real. We hire for product thinking, user experience and problem solving. That is what this assignment is here to surface.

### 01 · Product Thinking
You see the real problem behind the brief, make sharp calls on what to build and what to leave out, and can explain why.

### 02 · User Experience
You picture a real Nomichi associate using this on a busy morning, and you design for them. Calm, clear, no friction.

### 03 · Problem Solving
You turn a messy, open-ended, real-world problem into working software, and you ship it end to end.

### Use Every Tool You Have
Use any AI tool you like. **Claude, Cursor, v0, ChatGPT, Copilot,** whatever helps you move faster. We will never penalise you for it. Writing code is the easy part now, and the thinking is the job. We want to see your ideation, your instincts, the small touches, and the original way you turn this into a product people actually want to use. Build something we did not expect.

---

## The Problem Statement — The Nomichi Trip Desk

Build a working web app that lets a traveller send a trip enquiry, and lets the Nomichi team manage that enquiry from first contact to a confirmed seat, all in one place.

There are three parts. They are connected on purpose. A lead that comes in through the public form must show up, live, in the team's admin view.

---

### Part 1 · The Public Enquiry Page (Lead Capture)

A clean, public, mobile-first page where a traveller can browse open trips and send an enquiry. This is the only part an applicant-traveller sees.

- Shows the list of open trips with destination, dates, price including GST, and a short line about the trip.
- An enquiry form with the following fields:
  - Name
  - Phone (validated)
  - Email
  - The trip they are interested in
  - Group type (solo, friends, couple, family)
  - Preferred month
  - A free-text "what are you hoping this trip feels like" field
- On submit, the lead is saved to the database and the traveller sees a warm confirmation state.
- Handle validation and the empty, error and success states.

---

### Part 2 · The Team Admin (The Mini-CRM)

An authenticated area for the Nomichi team. This is the heart of the build.

- **Lead list** with search and filters (by status, by trip, by owner). Show enough at a glance to decide who to call next.
- **Lead detail view.** See everything the traveller sent. Move the lead through a clear pipeline:

  ```
  NEW → CONTACTED → QUALIFIED → VIBE CHECK SENT → CONFIRMED → NOT A FIT
  ```

- **Call log / touchpoints.** Add timestamped notes against a lead (what was said, the next action). Our team lives and dies by this.
- **Assign an owner** to a lead, so it is clear who is responsible.

---

### Part 3 · Trips as Content (The Part That Makes It Real)

The team must be able to create and edit the trips themselves, without touching code. This is the CMS-like piece.

- **Create a trip** with the following fields:
  - Name
  - Destination
  - Start and end date
  - Price including GST
  - Total seats
  - Status (open or closed)
  - Short description
- Open trips appear automatically on the public enquiry page. Closed trips do not.
- This is what connects everything: a trip created in admin is the trip a traveller can enquire about.

---

### A Small Dashboard

Add one simple overview screen for the team:

- Total leads
- A count by pipeline stage
- Leads per trip

Nothing fancy. Just the numbers a team lead would glance at each morning.

---

## One AI-Assisted Feature

AI is your everyday coding partner here, and we want to see you build an AI feature into the product itself, not just use AI to write code. Pick at least one of these (or propose your own). Keep it genuinely useful, not a gimmick.

- **Draft the first WhatsApp message** for a lead, using the trip details and what the traveller told you. Warm, short, in our voice.
- **Summarise the call log** on a lead into a one-line "where this stands and what to do next".
- **Read the vibe.** From the enquiry answers, suggest whether the traveller looks like a fit for slow, small-group travel, with a one-line reason. A suggestion only, never an automatic reject.

> **Be Safe With Keys:** Any AI or third-party call must run server-side. Never ship a secret key to the browser or commit it to the repo. Use environment variables.

---

## Scope — Must-Have vs Stretch

### Must-Have (Build These First)

- [ ] Public enquiry page reading live trips
- [ ] Enquiry form that saves to Supabase with validation
- [ ] Authenticated admin with a real login
- [ ] Lead list with search and at least one filter
- [ ] Lead detail with status changes and a call log
- [ ] Create and edit trips from admin
- [ ] Deployed live on Vercel, with seed data

### Stretch (Only After Must-Haves Work)

- [ ] The AI feature above
- [ ] The dashboard overview
- [ ] Row-level security so an owner sees their own leads
- [ ] CSV export of leads
- [ ] Basic activity timeline per lead
- [ ] Anything you think we genuinely need

> A working small thing beats a broken big thing. We would rather see the must-haves done well than ten half-built features.
>
> **Surprise us with judgement, not scope.**

---

## Tech and Constraints

| Area | What We Expect |
|---|---|
| **Framework** | Next.js (App Router). TypeScript preferred. |
| **Database & Auth** | Supabase. Real Postgres tables, real auth for the admin. Model the data thoughtfully. |
| **Hosting** | Deployed on Vercel. The live URL must work when we open it. |
| **Code** | One public GitHub repo (or invite tech@thenomichi.com). Commit history should tell the story of how you built it. |
| **Secrets** | Environment variables only. No keys in the repo. Include a `.env.example`. |
| **Seed Data** | Ship 3 to 4 example trips and a handful of leads so we can use it the moment it loads. |
| **AI Tools** | Fully allowed and encouraged, for writing code and inside the product. Use whatever helps you ship. |

---

## How We Score It

| Criteria | Weight | What Good Looks Like |
|---|---|---|
| **Product thinking & decisions** | 25% | You understood the real problem, made sensible calls on a messy brief, and can defend them. |
| **Functionality & completeness** | 25% | The core flow works end to end. A lead can be created and moved to confirmed without breaking. |
| **Code quality & data model** | 20% | Readable, sensibly structured, a clean schema with the right relationships. Not over-engineered. |
| **UX & brand** | 15% | Easy to use, handles empty and error states, and feels like Nomichi (see the brand notes). |
| **Shipping & reliability** | 10% | Actually deployed, seeded, no dead links, no crashes on first load. |
| **Communication** | 5% | A README that explains what you built, your decisions, and what you would do with more time. |

### The One-Hour Interview

Shortlisted candidates get a single one-hour conversation. We will open your live app, walk through your code together, ask why you made certain decisions, and may ask you to make a small change live. There is nothing to memorise. If you built it and understood it, you will be ready.

---

## Do and Don't

### Do
- Make decisions and write them down. A messy brief is the point.
- Ship the must-haves first, then polish.
- Handle real-world mess: bad phone numbers, empty lists, long notes.
- Commit often, with clear messages.
- Use AI freely, and understand everything it gives you.
- Keep the UI calm, warm and in our voice.

### Don't
- Send a repo that does not run, or a Vercel link that is down.
- Commit secrets or `.env` files.
- Gold-plate one feature while the core flow is broken.
- Copy a template you cannot explain in the interview.
- Use exclamation marks or em-dashes in the product copy. That is our house style.
- Build a generic CRM. Build the Nomichi one.

---

## Brand to Follow — Make It Feel Like Us

Part of the UX score is whether the app feels like Nomichi. You do not need to be a designer. Use our colours, keep it clean, and write in our voice.

### Colour Palette

| Name | Hex |
|---|---|
| Rust | `#D55D27` |
| Yellow | `#FFFE00` |
| Ink | `#1C1B1A` |
| Olive | `#45471D` |
| Sand | `#D1B788` |
| Cream | `#FFFBF5` |

### Typography
Headlines in a bold display face. Body in **Poppins**. Keep it readable and generous with space.

### Voice
Warm, honest, specific, still. Second person. Short sentences. No exclamation marks (except festival joy), no em-dashes, no AI-isms like "unlock", "elevate" or "embark on a journey". Prefer a concrete detail over an abstract feeling.

Our line is: **Travel that finds you.**

---

## How to Submit

You have **7 days** from the day you receive this brief. Send one email to **tech@thenomichi.com** with the subject line **Nomichi Intern Build · Your Name**, containing:

1. **The live Vercel URL.** Open it yourself first, on your phone, in a fresh browser. If it loads and works, you are good.
2. **The GitHub repo link.** Public, or invite tech@thenomichi.com. Include the README.
3. **Admin login details** we can use to sign in, or a clear note on how to create an account.
4. **A short note (under 200 words):** what you built, the two or three decisions you are most proud of, and what you would do with another week.
5. **Optional, a 2 to 3 minute Loom** walking us through the app. Not required, and it will not earn or cost you points on its own.

### Deadline

You have 7 days from the day you receive this brief, until end of day IST on day 7. If something real comes up, tell us early. We value honest communication over a silent miss.

---

## What Happens Next

1. **We review.** We open your app and read your code against the rubric above, within a few working days of your submission.
2. **We shortlist** and invite you to one 60-minute interview. We walk your build together and talk through your thinking.
3. **We decide,** and you hear back from us either way. We will not leave you guessing.

We care more about builders than resumes. Show us how you turn a real, messy problem into working software, and you will stand out.

---

**WANDER · CONNECT · BELONG**

Nomichi Explorers Private Limited · thenomichi.com · @thenomichi

*Questions about the assignment? Write to tech@thenomichi.com. This brief is confidential and intended only for applicants to the Nomichi Engineering Intern role.*
