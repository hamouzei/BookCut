import Link from 'next/link';
import { Button } from "@/components/ui";
import { ServicesShowcase } from '@/components/home/ServicesShowcase';
import { BarbersShowcase } from '@/components/home/BarbersShowcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-hidden">

      {/* Hero Section */}
      <main className="relative mx-auto px-4 py-16 sm:py-24">
        {/* Background glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F5B700]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[250px] h-[250px] bg-[#F5B700]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative text-center mb-16 sm:mb-24 max-w-6xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-[#1E293B] border border-[#F5B700]/20 rounded-full px-4 py-1.5 text-sm text-[#F5B700] mb-8">
            <span className="w-2 h-2 bg-[#F5B700] rounded-full animate-pulse" />
            Now accepting online bookings
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            Your Style,
            <br />
            <span className="text-[#F5B700]">Perfected.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-xl mx-auto mb-10 px-4 leading-relaxed">
            Book your next appointment in seconds. Premium cuts from expert barbers — no waiting, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto glow-gold text-base font-bold">
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
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: "⚡",
              title: "Instant Booking",
              description: "Select your service, choose your barber, and lock in your slot — all in under 30 seconds.",
            },
            {
              icon: "📊",
              title: "Live Availability",
              description: "Real-time calendar updates. See exactly what's open before you commit.",
            },
            {
              icon: "🔔",
              title: "Smart Reminders",
              description: "Automated email notifications keep you on schedule. Never miss a cut again.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-[#1E293B]/60 backdrop-blur-sm border border-[#F5B700]/8 rounded-2xl p-7 hover:border-[#F5B700]/25 transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,183,0,0.06)]"
            >
              <div className="text-2xl mb-4 w-12 h-12 bg-[#F5B700]/10 rounded-xl flex items-center justify-center group-hover:bg-[#F5B700]/20 transition-colors duration-300">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">{feature.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div id="services" className="max-w-6xl mx-auto py-16 sm:py-20 border-t border-[#1E293B]">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Choose from our premium selection of cuts and treatments.
            </p>
          </div>
          <ServicesShowcase />
        </div>

        {/* Barbers Section */}
        <div id="barbers" className="max-w-6xl mx-auto py-16 sm:py-20 border-t border-[#1E293B]">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Expert barbers dedicated to perfecting your look.
            </p>
          </div>
          <BarbersShowcase />
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#F5B700]/12 rounded-2xl p-8 sm:p-12 text-center overflow-hidden mb-16">
          {/* Decorative gold line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F5B700] to-transparent" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#F5B700]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-4">
              Ready for a fresh look?
            </h2>
            <p className="text-[#94A3B8] mb-8 max-w-md mx-auto">
              Join hundreds of satisfied clients. Book your first appointment today.
            </p>
            <Link href="/book">
              <Button size="lg" className="glow-gold w-full sm:w-auto font-bold">
                Get Started →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] text-[#94A3B8] py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2024 <span className="text-[#F5B700]">BookCut</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
