import { Search, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Select Your Service",
    description: "Choose the service you need and set your urgency level. It takes just seconds.",
  },
  {
    icon: Users,
    title: "Get Matched",
    description: "We instantly find available, verified providers near you sorted by proximity and rating.",
  },
  {
    icon: CheckCircle,
    title: "Problem Resolved",
    description: "Book your provider and track the request from start to finish. Simple.",
  },
];

const HowItWorks = () => {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">How FixMatch Works</h2>
          <p className="mt-3 text-muted-foreground">
            Three steps to getting the help you need — fast.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-5xl font-bold text-primary/10">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
