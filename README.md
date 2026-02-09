# 💈 Modern Barbershop Booking System

A premium, full-stack appointment booking application built with **Next.js 15**, **PostgreSQL**, and **Better Auth**. Designed for barbershops to manage services, staff, and customer bookings with a seamless user experience.

![Barbershop Booking System](https://raw.githubusercontent.com/placeholder/image.png)

## ✨ Features

### 📅 Advanced Booking Engine
- **Smart Availability Calculation**: Automatically calculates open slots based on barber working hours and existing appointments.
- **Conflict Prevention**: Built-in logic prevents double bookings and manages overlapping blocked times.
- **Multi-Barber Support**: Customers can select their preferred barber or get the "Any Professional" option.

### 👥 Admin Dashboard
- **Role-Based Access**: Secure admin panel accessible only to authorized staff.
- **Schedule Management**: Block off time for breaks, holidays, or personal leave.
- **Service Management**: Easily add, edit, or remove services and update pricing.
- **Team Management**: Manage barber profiles and working hours.
- **Booking Overview**: View, filter, and manage all customer appointments in one place.

### 🔔 Notification System
- **Instant Confirmations**: Automated emails sent via **Resend** upon successful booking.
- **Daily Reminders**: Cron job support to send appointment reminders 24 hours in advance.

### 🔐 Authentication & Security
- **Social Login**: Secure Google OAuth authentication via **Better Auth**.
- **Role Management**: Distinction between Customers, Barbers, and Admins.
- **Middleware Protection**: Route guards ensure unauthorized users cannot access sensitive areas.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) connection via `@neondatabase/serverless`
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Email**: [Resend](https://resend.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Neon Recommended)
- Google OAuth Credentials
- Resend API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/barbershop-booking.git
   cd barbershop-booking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="your-generated-secret"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email (Resend)
   RESEND_API_KEY="re_123456789"
   
   # Cron Secret (for reminders)
   CRON_SECRET="your-secure-cron-secret"
   ```

4. **Initialize Database:**
   Run the schema script in your PostgreSQL database (found in `src/lib/db/schema.sql`).

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/           # Admin dashboard routes
│   ├── api/             # API routes (Auth, Bookings, Availability)
│   ├── book/            # Booking wizard flow
│   └── bookings/        # User booking history
├── components/          # Reusable UI components
│   ├── booking/         # Booking-specific components
│   └── ui/              # Base UI elements (Button, Card, Input)
├── lib/                 # Core logic and utilities
│   ├── auth/            # Better Auth configuration
│   ├── db/              # Database connection and queries
│   ├── email/           # Email service and templates
│   └── engine/          # Booking availability calculation engine
└── types/               # TypeScript type definitions
```

---

### Cron Jobs
To enable daily reminders:
1. Set up a Cron Job (e.g., in Vercel or GitHub Actions) to hit the endpoint:
   `GET /api/cron/reminders`
2. Ensure you pass the `Authorization: Bearer <CRON_SECRET>` header.

---

## 📄 License

This project is licensed under the MIT License.
