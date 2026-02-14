import Link from 'next/link';
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
            Book Your Perfect
            <span className="text-amber-600"> Haircut</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Skip the wait. Book your appointment online and get the style you deserve from our expert barbers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Book Appointment</Button>
            </Link>
            <Link href="/#services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">View Services</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "📅",
              title: "Easy Booking",
              description: "Select your service, choose a barber, and book in seconds",
            },
            {
              icon: "⏰",
              title: "Real-Time Availability",
              description: "See available slots instantly, no more phone calls",
            },
            {
              icon: "🔔",
              title: "Reminders",
              description: "Get email reminders so you never miss your appointment",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Book your first appointment today and experience the difference.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 w-full sm:w-auto">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2024 Barbershop Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
