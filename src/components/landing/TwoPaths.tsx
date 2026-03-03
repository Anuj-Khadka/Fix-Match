import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TwoPaths = () => {
  return (
    <section className="grid md:grid-cols-2">
      {/* Left — For Customers */}
      <motion.div
        className="flex flex-col justify-center bg-foreground px-8 py-20 md:px-16 lg:px-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-white/50">For Customers</p>
        <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
          Need help fast?
        </h2>
        <p className="mt-4 max-w-sm text-base text-white/70">
          Tell us what's wrong. We match you with a nearby available professional in minutes.
        </p>
        <div className="mt-8">
          <Link to="/request">
            <Button size="lg" variant="secondary" className="rounded-full gap-2 font-semibold">
              Request Service
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Right — For Providers */}
      <motion.div
        className="flex flex-col justify-center border-l px-8 py-20 md:px-16 lg:px-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">For Providers</p>
        <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
          Ready to get real customers?
        </h2>
        <p className="mt-4 max-w-sm text-base text-muted-foreground">
          Receive high&#8209;intent requests and respond instantly.
        </p>
        <div className="mt-8">
          <Link to="/auth">
            <Button size="lg" className="rounded-full gap-2 font-semibold">
              Join as a Provider
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default TwoPaths;
