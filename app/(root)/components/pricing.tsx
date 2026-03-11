import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="w-full py-20 md:py-28 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground mb-4 backdrop-blur-sm">
            Pricing
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-4">
            Simple, transparent <span className="text-primary">pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choose the clear, simple plan that best fits your business needs. Upgrade anytime as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col p-8 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Free Plan</h3>
              <p className="text-sm text-muted-foreground mt-1.5">For individuals just getting started.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">$0</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-muted-foreground">Manage up to <strong>1 unit</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-muted-foreground"><strong>1 account</strong> holder</span>
              </li>
              <li className="flex items-start gap-3 opacity-60">
                <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-muted-foreground line-through decoration-1">Revenue Overview dashboard</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full h-12 text-base font-semibold border-border/60 hover:bg-neutral-50 transition-colors">
              Get Started
            </Button>
          </div>

          {/* Paid Plan */}
          <div className="relative flex flex-col p-8 rounded-2xl bg-card border-2 border-primary shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-shadow">
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                Recommended
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Pro Plan</h3>
              <p className="text-sm text-muted-foreground mt-1.5">For growing rental businesses and fleets.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">$5</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-muted-foreground">Manage <strong>unlimited units</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-muted-foreground">Add <strong>multiple account holders</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-muted-foreground"><strong>Full Revenue Overview</strong> enabled</span>
              </li>
            </ul>
            
            <Button className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
