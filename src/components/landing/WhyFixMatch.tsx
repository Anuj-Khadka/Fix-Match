import { motion } from "framer-motion";

const benefits = [
  {
    number: "01",
    title: "Speed First",
    description:
      "We prioritize real‑time availability and response time — not endless browsing.",
  },
  {
    number: "02",
    title: "Less Stress",
    description: "No calling five providers. No waiting hours for replies.",
  },
  {
    number: "03",
    title: "Smart Matching",
    description:
      "We connect you to the right professional based on urgency, location, and reliability.",
  },
];

const WhyFixMatch = () => {
  return (
    <section className="border-t py-20">
      <div className="container">
        <motion.h2
          className="font-display text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Stop searching. Start solving.
        </motion.h2>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span className="font-display text-5xl font-bold text-muted/60 md:text-6xl">
                {b.number}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-muted-foreground">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFixMatch;
