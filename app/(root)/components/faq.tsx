"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I get started with Rent Hub?",
    answer:
      "Getting started is simple. Sign up for a free account, add your fleet units, and you're ready to create your first booking. The entire onboarding process takes less than 10 minutes.",
  },
  {
    question: "Can I manage multiple units and vehicles?",
    answer:
      "Absolutely. Rent Hub is built to scale from a single unit to hundreds of vehicles. You can organize your fleet, monitor availability across all units, and manage bookings for each independently.",
  },
  {
    question: "How does payment tracking work?",
    answer:
      "When a booking is created, Rent Hub tracks the total price automatically. You can record individual payment transactions (cash, online banking, etc.) under each booking. The platform shows outstanding balances, partial payments, and full collection status in real time.",
  },
  {
    question: "Will Rent Hub prevent double-bookings?",
    answer:
      "Yes. The booking system validates unit availability based on date ranges. When editing or creating a booking, you'll see an alert if the selected dates overlap with an existing reservation for the same unit.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your data is protected with industry-standard security practices. Access is restricted by authenticated sessions, and all data is stored securely. Only authorized users can view and manage your business records.",
  },
  {
    question: "Can I mark bookings as completed or cancelled?",
    answer:
      "Yes. Bookings can be moved through status stages — Pending, Confirmed, In Progress, Completed, Cancelled, or No Show. The dashboard and booking table always reflect the current status of each rental.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="w-full py-20 md:py-28 bg-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center rounded-full border border-border/50 bg-background px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
            FAQ
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-4">
            Frequently asked{" "}
            <span className="bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have questions about Rent Hub? Here are answers to the most common ones.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-border/60 rounded-xl px-6 shadow-sm data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground text-left hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
