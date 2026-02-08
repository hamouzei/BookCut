import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💈</span>
            <span className="text-xl font-bold text-slate-900">Barbershop</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/login" className="text-slate-600 hover:text-amber-600 transition-colors">Login</a>
            <Button size="sm">Book Now</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Book Your Perfect
            <span className="text-amber-600"> Haircut</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Skip the wait. Book your appointment online and get the style you deserve from our expert barbers.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Book Appointment</Button>
            <Button variant="outline" size="lg">View Services</Button>
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
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-300 mb-6">
            Book your first appointment today and experience the difference.
          </p>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
            Book Your Appointment
          </Button>
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
