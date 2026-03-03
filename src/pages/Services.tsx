import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Wrench,
  Zap,
  Wind,
  Key,
  Sparkles,
  Bug,
  Refrigerator,
  Paintbrush,
  Hammer,
  Droplets,
  Trees,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";

const categories = [
  {
    name: "Plumbing",
    description: "Leaks, clogs, pipe repairs, and urgent water issues.",
    icon: Droplets,
  },
  {
    name: "Electrical",
    description: "Power faults, fittings, wiring checks, and circuit issues.",
    icon: Zap,
  },
  {
    name: "HVAC",
    description: "Heating and cooling repairs, tune-ups, and diagnostics.",
    icon: Wind,
  },
  {
    name: "Locksmith",
    description: "Lockouts, lock replacement, rekeying, and access support.",
    icon: Key,
  },
  {
    name: "Cleaning",
    description: "General cleaning, deep cleaning, and move-in/move-out help.",
    icon: Sparkles,
  },
  {
    name: "Pest Control",
    description: "Inspection, treatment, and prevention for common pests.",
    icon: Bug,
  },
  {
    name: "Appliance Repair",
    description: "Fridge, washer, oven, and other household appliance fixes.",
    icon: Refrigerator,
  },
  {
    name: "Painting",
    description: "Interior and exterior touch-ups, repainting, and prep work.",
    icon: Paintbrush,
  },
  {
    name: "Carpentry",
    description: "Custom woodwork, repairs, fittings, and installations.",
    icon: Hammer,
  },
  {
    name: "Plumbing & Gas",
    description: "Combined water and gas line maintenance and repair work.",
    icon: Wrench,
  },
  {
    name: "Landscaping",
    description: "Yard maintenance, cleanup, and outdoor improvement tasks.",
    icon: Trees,
  },
  {
    name: "Security",
    description: "Home security hardware setup and related safety upgrades.",
    icon: ShieldCheck,
  },
];

const serviceHighlights = [
  {
    title: "Urgent and scheduled requests",
    description:
      "Choose emergency or routine timing and get matched based on real availability.",
    icon: Clock,
  },
  {
    title: "Local provider matching",
    description:
      "Location-aware matching helps surface nearby professionals for faster turnaround.",
    icon: MapPin,
  },
  {
    title: "Verified categories",
    description:
      "Providers are listed under the services they actually offer, so matching stays relevant.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Can I request more than one service?",
    answer:
      "Submit one request per primary service for the best matching accuracy. You can create another request immediately after.",
  },
  {
    question: "Which categories are best for emergencies?",
    answer:
      "Plumbing, electrical, locksmith, and HVAC are commonly urgent. Set your urgency level so available providers are prioritized.",
  },
  {
    question: "How do I choose the right category?",
    answer:
      "Pick the category closest to your main issue and add details in the description. This helps providers assess the request quickly.",
  },
  {
    question: "What if my service need is not listed?",
    answer:
      "Choose the closest matching category and include specifics in your request note. Providers can clarify scope before booking.",
  },
];

const ServicesPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b bg-muted/30 py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1.5 text-sm font-medium">
                <Wrench className="h-3.5 w-3.5" />
                Service coverage across your home needs
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Services on FixMatch
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore the most requested service categories and get matched with verified local professionals in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/request">
                  <Button size="lg" className="gap-2 px-8 text-base font-semibold">
                    Start a Request
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="text-base">
                    View How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold">Service categories</h2>
              <p className="mt-3 text-muted-foreground">
                Pick a category to begin your request with the right context from the start.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/request?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <Card className="h-full border-border/70 transition-colors group-hover:border-primary/40">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <category.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="font-display text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold">How services are matched</h2>
              <p className="mt-3 text-muted-foreground">
                Matching is designed to prioritize relevance, speed, and confidence.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
              {serviceHighlights.map((highlight) => (
                <Card key={highlight.title}>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <highlight.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{highlight.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{highlight.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold">Frequently asked questions</h2>
                <p className="mt-3 text-muted-foreground">
                  Answers to common questions about category selection and service requests.
                </p>
              </div>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((item, i) => (
                      <AccordionItem key={item.question} value={`item-${i}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="container">
            <Card className="mx-auto max-w-4xl bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-10">
                <h2 className="font-display text-3xl font-bold">Ready to book a provider?</h2>
                <p className="max-w-2xl text-primary-foreground/90">
                  Start your request and get matched with professionals for the service you need.
                </p>
                <Link to="/request">
                  <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold">
                    Get Matched Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;