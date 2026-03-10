import {
  CalendarCheck,
  CreditCard,
  Car,
  BarChart3,
  Bell,
  FileText,
} from "lucide-react";

const services = [
  {
    icon: CalendarCheck,
    title: "Booking Management",
    description:
      "Create, edit, and track bookings effortlessly. Manage customer details, rental schedules, and booking statuses from a unified interface.",
    color: "text-primary bg-primary/10 group-hover:bg-primary/20",
  },
  {
    icon: CalendarCheck,
    title: "Calendar Scheduling",
    description:
      "Visualize your entire fleet's availability with an interactive calendar. Prevent double-bookings and optimize unit utilization at a glance.",
    color: "text-violet-600 bg-violet-50 group-hover:bg-violet-100",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description:
      "Record payments, track outstanding balances, and generate payment histories. Know exactly who has paid and what remains due.",
    color: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100",
  },
  {
    icon: Car,
    title: "Fleet Overview",
    description:
      "Monitor every unit in your fleet — operational status, current booking, next availability, and maintenance flags all in one place.",
    color: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Make data-driven decisions with real-time charts on revenue trends, booking status distribution, and collection rates.",
    color: "text-blue-600 bg-blue-50 group-hover:bg-blue-100",
  },
  {
    icon: Bell,
    title: "Status Automation",
    description:
      "Automatically update booking statuses based on date progression. Mark bookings in-progress, flag overdue payments, and complete rentals on schedule.",
    color: "text-rose-600 bg-rose-50 group-hover:bg-rose-100",
  },
];

const Services = () => {
  return (
    <section id="services" className="w-full py-20 md:py-28 bg-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-border/50 bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
            What We Offer
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-4">
            Everything you need to run a{" "}
            <span className="bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              rental business
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Rent Hub gives you a complete suite of tools designed around how rental businesses actually operate.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group cursor-default"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-200 ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
