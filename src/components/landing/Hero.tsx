import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";

const popularSearches = [
  "Plumbing repair",
  "Electrical issue",
  "HVAC repair",
  "Lockout",
  "Appliance repair",
];

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Detecting...");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Add location");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const postcode = data.address?.postcode;
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.suburb;
          setLocation(postcode || city || "Your location");
        } catch {
          setLocation("Your location");
        }
      },
      () => setLocation("Add location")
    );
  }, []);

  const handleSearch = (term?: string) => {
    const q = term ?? query;
    navigate(q.trim() ? `/request?q=${encodeURIComponent(q.trim())}` : "/request");
  };

  return (
    <section className="py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            className="font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get help when it matters most.
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-md text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Instantly matched with an available local professional — no searching, no waiting.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="relative mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex overflow-hidden rounded-xl border bg-background shadow-lg">
              <input
                ref={inputRef}
                type="text"
                placeholder="Describe your project or problem — be as detailed as you'd like!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex shrink-0 items-center gap-1.5 border-l px-4 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-semibold text-foreground">{location}</span>
              </div>
              <button
                onClick={() => handleSearch()}
                className="shrink-0 bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </div>

            {/* Popular searches dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border bg-background shadow-xl">
                <p className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular searches
                </p>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onMouseDown={() => handleSearch(term)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.p
            className="mt-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Available for urgent home services.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
