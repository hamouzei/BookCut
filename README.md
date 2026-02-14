<p align="center">
  <img src="public/image.svg" width="60" alt="BookCut Logo" />
</p>

<h1 align="center">BookCut</h1>

<p align="center">
  <strong>Modern barbershop booking, reimagined.</strong><br/>
  <sub>Next.js 16 · PostgreSQL · Better Auth · Resend</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-F5B700" alt="License" />
</p>

---

## ⚡ What is BookCut?

A full-stack, production-ready appointment booking system for barbershops. Customers book in seconds, barbers manage their schedule, admins run the show — all from one beautiful dark-themed UI.

```
🎨 Charcoal Black + Electric Gold design system
📱 Fully responsive — mobile, tablet, desktop
🔐 Google OAuth with role-based access
📧 Automated email confirmations & reminders
```

---

## 🖥️ Features

<table>
<tr>
<td width="50%">

### 📅 Booking Engine
- Smart availability calculation
- Conflict prevention & overlap detection
- Multi-barber support
- 5-step booking wizard

</td>
<td width="50%">

### 👥 Admin Dashboard
- Role-based access (Admin / Barber)
- CRUD for barbers & services
- Booking management with filters
- Schedule blocking (breaks, holidays)

</td>
</tr>
<tr>
<td width="50%">

### 🔔 Notifications
- Instant booking confirmations via Resend
- 24h advance reminders (cron-ready)
- Professional email templates

</td>
<td width="50%">

### 🎨 Classic Barber + Tech UI
- Charcoal Black `#0F172A`
- Electric Gold `#F5B700`
- Soft Gray `#E5E7EB`
- Gold glow animations & glassmorphism

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL via Neon Serverless |
| **Auth** | Better Auth (Google OAuth) |
| **Email** | Resend |
| **Dates** | date-fns |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech/) recommended)
- Google OAuth credentials
- [Resend](https://resend.com/) API key

### Setup

```bash
# Clone & install
git clone https://github.com/yourusername/barbershop-booking.git
cd barbershop-booking
npm install
```

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-generated-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email
RESEND_API_KEY="re_123456789"

# Cron
CRON_SECRET="your-secure-cron-secret"
```

```bash
# Initialize DB (run schema in your PostgreSQL)
# Schema located at: src/lib/db/schema.sql

# Start dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** ✨

---

## 📂 Architecture

```
src/
├── app/                    # App Router
│   ├── admin/              # 📊 Dashboard, Bookings, Services, Barbers, Schedule
│   ├── api/                # 🔌 REST endpoints (auth, bookings, barbers, services)
│   ├── book/               # 📅 5-step booking wizard
│   ├── bookings/           # 📋 User booking history & confirmations
│   └── (auth)/login/       # 🔐 Google OAuth login
├── components/
│   ├── booking/            # ServiceSelection, BarberSelection, DateCalendar, TimeSlotPicker
│   ├── layout/             # Header with mobile nav
│   └── ui/                 # Button, Card, Input (design system)
├── lib/
│   ├── auth/               # Better Auth config & client
│   ├── db/                 # Neon connection, queries (barbers, services, bookings)
│   ├── email/              # Resend templates
│   └── engine/             # Availability calculation engine
└── types/                  # TypeScript interfaces
```

---

## ⚙️ API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/barbers` | List active barbers |
| `POST` | `/api/barbers` | Create barber (admin) |
| `PUT` | `/api/barbers/:id` | Update barber (admin) |
| `DELETE` | `/api/barbers/:id` | Deactivate barber (admin) |
| `GET` | `/api/services` | List active services |
| `POST` | `/api/services` | Create service (admin) |
| `PUT` | `/api/services/:id` | Update service (admin) |
| `DELETE` | `/api/services/:id` | Deactivate service (admin) |
| `GET` | `/api/bookings` | List bookings (filtered) |
| `POST` | `/api/bookings` | Create booking |
| `PATCH` | `/api/bookings/:id` | Update booking status |
| `DELETE` | `/api/bookings/:id` | Delete booking |
| `GET` | `/api/availability` | Get available time slots |

---

## 🕐 Cron Jobs

Enable daily appointment reminders:

1. Set up a cron job (Vercel Cron, GitHub Actions, etc.)
2. Hit `GET /api/cron/reminders`
3. Pass header: `Authorization: Bearer <CRON_SECRET>`

---

## 📄 License

MIT — do whatever you want with it.

---

<p align="center">
  <sub>Built with ☕ and ✂️ by <strong>BookCut</strong></sub>
</p>
