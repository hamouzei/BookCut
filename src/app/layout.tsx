import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbershop Booking",
  description: "Book your perfect haircut online - Skip the wait, book your appointment instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
