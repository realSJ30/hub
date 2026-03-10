import { Car, Users, CheckCircle2, TrendingUp } from "lucide-react";

const stats = [
  { icon: Car, label: "Units Managed", value: "500+", color: "text-primary bg-primary/10" },
  { icon: Users, label: "Active Users", value: "1,200+", color: "text-violet-600 bg-violet-50" },
  { icon: CheckCircle2, label: "Bookings Processed", value: "15,000+", color: "text-emerald-600 bg-emerald-50" },
  { icon: TrendingUp, label: "Platform Uptime", value: "99.9%", color: "text-amber-600 bg-amber-50" },
];

const About = () => {
  return (
    <section id="about" className="w-full py-20 md:py-28 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground">
              About Rent Hub
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground leading-tight">
              Built for rental businesses that{" "}
              <span className="bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                demand more
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Rent Hub was built to solve the challenges faced by modern vehicle and equipment rental businesses.
              Managing bookings through spreadsheets, chasing payments manually, and losing track of fleet availability
              were all too common. We changed that.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform brings together booking management, payment tracking, calendar scheduling, and operational
              analytics into a single, intuitive workspace — so you can focus on growing your business, not managing it.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {["Booking Automation", "Payment Tracking", "Fleet Management", "Analytics"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className={`inline-flex p-2.5 rounded-lg mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
