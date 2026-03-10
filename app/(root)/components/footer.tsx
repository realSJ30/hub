import Link from "next/link";
import { Car } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "FAQ", href: "#faq" },
  ],
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Bookings", href: "/bookings" },
    { label: "Units", href: "/units" },
    { label: "Payments", href: "/payments" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Sign Up", href: "/signup" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-black text-lg text-foreground">RentHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              The all-in-one platform for modern rental businesses. Manage bookings, track payments, and grow with confidence.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">{section}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} RentHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for rental businesses that move fast.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
