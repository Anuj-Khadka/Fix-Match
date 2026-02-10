import { Link } from "react-router-dom";
import {
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
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Plumbing", icon: Droplets, color: "bg-blue-50 text-blue-600" },
  { name: "Electrical", icon: Zap, color: "bg-amber-50 text-amber-600" },
  { name: "HVAC", icon: Wind, color: "bg-cyan-50 text-cyan-600" },
  { name: "Locksmith", icon: Key, color: "bg-purple-50 text-purple-600" },
  { name: "Cleaning", icon: Sparkles, color: "bg-emerald-50 text-emerald-600" },
  { name: "Pest Control", icon: Bug, color: "bg-red-50 text-red-600" },
  { name: "Appliance Repair", icon: Refrigerator, color: "bg-slate-100 text-slate-600" },
  { name: "Painting", icon: Paintbrush, color: "bg-pink-50 text-pink-600" },
  { name: "Carpentry", icon: Hammer, color: "bg-orange-50 text-orange-600" },
  { name: "Plumbing & Gas", icon: Wrench, color: "bg-teal-50 text-teal-600" },
  { name: "Landscaping", icon: Trees, color: "bg-green-50 text-green-600" },
  { name: "Security", icon: ShieldCheck, color: "bg-indigo-50 text-indigo-600" },
];

const ServiceCategories = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">Services We Cover</h2>
          <p className="mt-3 text-muted-foreground">
            From emergency repairs to routine maintenance — we've got you covered.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to={`/request?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
