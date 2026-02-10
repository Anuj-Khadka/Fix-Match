

# FixMatch — Urgent Service Matching Platform

## Overview
A professional, trust-focused platform that helps users quickly find available home service providers based on urgency and location. Built with a full Supabase backend for real data, authentication, and matching.

---

## Pages & Features

### 1. Landing Page
- Hero section with a clear value proposition: "Get help fast when things break"
- Trust signals: badges, stats (e.g., "500+ verified providers"), and testimonials
- Prominent "Get Matched Now" CTA button
- How it works section (3 steps: Select → Match → Resolve)

### 2. Service Request Flow (Core Feature)
A guided multi-step form:
- **Step 1 — Select Service Category**: Visual grid of categories (Plumbing, Electrical, HVAC, Locksmith, Cleaning, Pest Control, Appliance Repair, Painting)
- **Step 2 — Describe the Problem**: Brief text input + optional photo upload
- **Step 3 — Set Urgency**: Three clear options — Now (emergency), Today, Flexible
- **Step 4 — Confirm Location**: Auto-detect via browser geolocation with manual override option
- **Step 5 — Review & Submit**

### 3. Results / Matched Providers Page
- List of available providers sorted by proximity and availability
- Each card shows: provider name, rating, distance, estimated arrival time, price range, and a "Book Now" button
- Filter/sort options (distance, rating, price)
- Urgency badge displayed prominently

### 4. Provider Profile Page
- Provider details: bio, services offered, ratings & reviews, availability status
- Trust badges (verified, insured, licensed)
- Contact / Book action

### 5. User Authentication
- Sign up / Log in (email-based via Supabase Auth)
- User profile with request history

### 6. Request Tracking
- Status updates for active requests (Submitted → Provider Assigned → In Progress → Completed)
- Simple timeline view

---

## Backend (Supabase / Lovable Cloud)

- **Users & Auth**: Supabase authentication with user profiles
- **Service Categories Table**: Pre-populated list of service types
- **Service Requests Table**: Stores user requests with urgency, location, status
- **Providers Table**: Provider profiles with services, location, availability, ratings
- **Bookings Table**: Links requests to providers with status tracking
- **Storage**: For problem photos uploaded by users
- **RLS Policies**: Users see only their own requests; providers see relevant requests

---

## Design Direction
- Professional and trustworthy aesthetic with a blue/navy primary palette
- Clean typography, generous whitespace
- Trust-building elements throughout (verification badges, star ratings, review counts)
- Mobile-first responsive design for urgent on-the-go use
- Fast, minimal-click flow optimized to reduce decision fatigue

