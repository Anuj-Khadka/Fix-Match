import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Describe the issue",
    description: "Tell us what you need and how urgent it is.",
  },
  {
    number: "2",
    title: "Get matched",
    description: "We instantly show available professionals near you.",
  },
  {
    number: "3",
    title: "Book with confidence",
    description: "See estimated response time and secure your service.",
  },
];

const HowItWorks = () => {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container">
        <motion.h2
          className="font-display text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          How FixMatch works
        </motion.h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground font-display text-sm font-bold text-background">
                {step.number}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
