import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">FixMatch</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/request">
            <Button size="sm" className="font-semibold">Get Matched</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
