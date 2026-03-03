import { motion } from "framer-motion";

const pillars = [
  {
    title: "Reliable Professionals",
    description: "Verified service providers.",
  },
  {
    title: "Clear Expectations",
    description: "Transparent price ranges and estimated arrival times.",
  },
  {
    title: "You're in control",
    description: "Track your request in real time.",
  },
];

const TrustSection = () => {
  return (
    <section className="border-t py-20">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="border-l-2 border-primary pl-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <h3 className="font-display text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
