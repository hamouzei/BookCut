import Link from 'next/link';
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F8FAFC] overflow-hidden">

      {/* Hero Section */}
      <main className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3FFFD9]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-[#3FFFD9]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#1C2541] border border-[#3FFFD9]/20 rounded-full px-4 py-1.5 text-sm text-[#3FFFD9] mb-6">
            <span className="w-2 h-2 bg-[#3FFFD9] rounded-full animate-pulse" />
            Now accepting online bookings
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Book Your Perfect
            <br />
            <span className="text-[#3FFFD9]">Haircut</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#8B9DC3] max-w-2xl mx-auto mb-8 px-4 leading-relaxed">
            Skip the wait. Book your appointment online and get the style you deserve from our expert barbers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto glow-teal text-base">
                Book Appointment →
              </Button>
            </Link>
            <Link href="/#services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                View Services
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="services" className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: "⚡",
              title: "Instant Booking",
              description: "Select your service, choose a barber, and book in seconds — no calls needed.",
            },
            {
              icon: "📊",
              title: "Real-Time Availability",
              description: "See live available slots, updated instantly as bookings come in.",
            },
            {
              icon: "🔔",
              title: "Smart Reminders",
              description: "Get automated email reminders so you never miss your appointment.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-[#1C2541]/60 backdrop-blur-sm border border-[#3FFFD9]/10 rounded-2xl p-6 hover:border-[#3FFFD9]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(63,255,217,0.08)]"
            >
              <div className="text-3xl mb-4 w-12 h-12 bg-[#3FFFD9]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3FFFD9]/20 transition-colors">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{feature.title}</h3>
              <p className="text-[#8B9DC3] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-[#1C2541] to-[#0B132B] border border-[#3FFFD9]/15 rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#3FFFD9]/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-4">
              Ready to get started?
            </h2>
            <p className="text-[#8B9DC3] mb-6 max-w-md mx-auto">
              Book your first appointment today and experience the difference.
            </p>
            <Link href="/book">
              <Button size="lg" className="glow-teal w-full sm:w-auto">
                Book Your Appointment →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C2541] text-[#6B7A99] py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2024 BookCut. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
