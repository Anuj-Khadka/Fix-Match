import { Shield, Users, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "500+", label: "Verified Providers" },
  { icon: Star, value: "4.8", label: "Average Rating" },
  { icon: Clock, value: "<2 min", label: "Avg Match Time" },
  { icon: Shield, value: "100%", label: "Licensed & Insured" },
];

const TrustSection = () => {
  return (
    <section className="border-t bg-primary py-16 text-primary-foreground">
      <div className="container">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <stat.icon className="mx-auto mb-3 h-6 w-6 opacity-80" />
              <div className="font-display text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
