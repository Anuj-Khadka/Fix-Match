import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="border-t py-24">
      <div className="container">
        <motion.div
          className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Ready when you are.
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/request">
              <Button size="lg" className="rounded-full gap-2 px-8 text-base font-semibold">
                Get Help Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="rounded-full text-base">
                Become a Provider
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
