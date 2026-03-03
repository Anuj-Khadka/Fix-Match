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
  Search,
  FileText,
  Users,
  MessageSquare,
  CheckCircle,
  Shield,
  Clock,
  MapPin,
  Star,
} from "lucide-react";

const flowSteps = [
  {
    title: "Choose your service",
    description:
      "Select what you need help with and add a short description so providers understand the job.",
    icon: FileText,
  },
  {
    title: "Set urgency and location",
    description:
      "Tell us how urgent it is and where you need service, so we can prioritize nearby availability.",
    icon: MapPin,
  },
  {
    title: "Get matched instantly",
    description:
      "FixMatch filters by category, distance, availability, and quality signals to show relevant pros first.",
    icon: Search,
  },
  {
    title: "Review providers",
    description:
      "Compare ratings, response readiness, experience, and pricing to pick the right professional.",
    icon: Users,
  },
  {
    title: "Book and resolve",
    description:
      "Connect with your chosen provider, confirm details, and get your issue fixed quickly.",
    icon: CheckCircle,
  },
];

const trustHighlights = [
  {
    title: "Verified provider profiles",
    description: "Provider identity and profile details are reviewed before visibility in results.",
    icon: Shield,
  },
  {
    title: "Fast matching logic",
    description: "Urgency-aware matching helps surface available providers without long delays.",
    icon: Clock,
  },
  {
    title: "Location-aware results",
    description: "Nearby professionals are prioritized to improve speed and convenience.",
    icon: MapPin,
  },
  {
    title: "Transparent social proof",
    description: "Ratings and review counts help you choose with confidence.",
    icon: Star,
  },
];

const faqs = [
  {
    question: "How long does matching usually take?",
    answer:
      "Most requests are matched quickly, often in just a few minutes. Exact timing depends on service type, urgency, and local provider availability.",
  },
  {
    question: "Do I need an account to request service?",
    answer:
      "You can start the request flow immediately. You'll be prompted to sign in before final submission so your request is saved and trackable.",
  },
  {
    question: "How are providers ranked in results?",
    answer:
      "Results are prioritized using availability, relevance to your service category, proximity, and quality signals like ratings and experience.",
  },
  {
    question: "Can I change request details after starting?",
    answer:
      "Yes. During the request flow, you can go back and update category, urgency, location, or description before submitting.",
  },
  {
    question: "What if no provider is available right now?",
    answer:
      "If instant availability is limited, try adjusting urgency or category details and resubmit. Availability can change quickly as providers come online.",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b bg-muted/30 py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1.5 text-sm font-medium">
                <MessageSquare className="h-3.5 w-3.5" />
                Simple request, smart matching
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                How FixMatch Works
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                From request to resolution, FixMatch helps you find verified local providers quickly with a guided, five-step flow.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/request">
                  <Button size="lg" className="gap-2 px-8 text-base font-semibold">
                    Start a Request
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="text-base">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold">Step-by-step process</h2>
              <p className="mt-3 text-muted-foreground">
                Every request follows the same clear path so you always know what happens next.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
              {flowSteps.map((step, index) => (
                <Card key={step.title} className="border-border/70">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-sm font-semibold text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold">Why users trust FixMatch</h2>
              <p className="mt-3 text-muted-foreground">
                Built to reduce uncertainty and help you make confident provider choices.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {trustHighlights.map((highlight) => (
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
                  Quick answers about the request and matching experience.
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
                <h2 className="font-display text-3xl font-bold">Need help right now?</h2>
                <p className="max-w-2xl text-primary-foreground/90">
                  Start your request in under a minute and get matched with local professionals based on urgency and availability.
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

export default HowItWorksPage;