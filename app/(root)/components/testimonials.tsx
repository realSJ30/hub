import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Car Rental Owner, Manila",
    initials: "MS",
    color: "bg-primary/10 text-primary",
    rating: 5,
    quote:
      "Rent Hub completely transformed how we run our business. Tracking payments used to take hours every week — now it takes minutes. The booking calendar alone saved us from so many double-booking headaches.",
  },
  {
    name: "Jose Reyes",
    role: "Fleet Manager, Cebu",
    initials: "JR",
    color: "bg-violet-100 text-violet-600",
    rating: 5,
    quote:
      "I manage 30+ vehicles and Rent Hub gives me a full picture at all times. The dashboard shows exactly which units are available, which are booked, and which need attention. It's indispensable.",
  },
  {
    name: "Ana Lim",
    role: "Operations Head, Davao",
    initials: "AL",
    color: "bg-emerald-100 text-emerald-600",
    rating: 5,
    quote:
      "What I love most is the payment tracking. We can see exactly who still owes money, what bookings are partially paid, and quickly record new payments from any device. No more chasing customers blind.",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full py-20 md:py-28 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
            Customer Stories
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-4">
            Trusted by rental operators{" "}
            <span className="bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              across the country
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what rental business owners and fleet managers are saying about Rent Hub.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, initials, color, rating, quote }) => (
            <div
              key={name}
              className="bg-card border border-border/60 rounded-xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${color}`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
