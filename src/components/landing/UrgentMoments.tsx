import { motion } from "framer-motion";

const services = [
  "Plumbing emergencies",
  "Electrical outages",
  "HVAC failures",
  "Lockouts",
];

const UrgentMoments = () => {
  return (
    <section className="border-t bg-foreground py-20 text-background">
      <div className="container">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Built for urgent moments
            </h2>
            <p className="mt-5 max-w-sm text-lg text-white/70">
              When something breaks, you don't need options. You need answers.
            </p>
            <p className="mt-3 text-sm font-medium text-white/50 uppercase tracking-widest">
              Fast response matters.
            </p>
          </motion.div>

          <motion.ul
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="font-display text-lg font-medium">{service}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default UrgentMoments;
