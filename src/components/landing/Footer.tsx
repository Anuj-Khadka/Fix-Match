import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="border-t py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">FixMatch</span>
          </div>

          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
            {!user && (
              <Link to="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link>
            )}
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FixMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
