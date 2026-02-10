import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Star, MapPin, Shield, Clock, DollarSign, CheckCircle, Award, Loader2, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Provider = Tables<"providers">;
type Category = Tables<"service_categories">;

const ProviderProfile = () => {
  const { id } = useParams();
  const { user, profileId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data: prov } = await supabase.from("providers").select("*").eq("id", id).maybeSingle();
      setProvider(prov);

      const { data: services } = await supabase
        .from("provider_services")
        .select("category_id")
        .eq("provider_id", id);

      if (services && services.length > 0) {
        const { data: cats } = await supabase
          .from("service_categories")
          .select("*")
          .in("id", services.map((s) => s.category_id));
        setCategories(cats || []);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">Provider not found.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 font-display text-2xl font-bold text-primary">
              {provider.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{provider.name}</h1>
                {provider.is_verified && <Shield className="h-5 w-5 text-success" />}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {provider.rating} ({provider.review_count} reviews)
                </span>
                {provider.location_address && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{provider.location_address}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{provider.years_experience} years experience</span>
              </div>
            </div>
          </div>

          {provider.bio && (
            <Card className="mt-6">
              <CardContent className="p-5">
                <h3 className="font-display font-semibold">About</h3>
                <p className="mt-2 text-sm text-muted-foreground">{provider.bio}</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Hourly Rate</div>
                  <div className="font-semibold">${provider.hourly_rate_min}–${provider.hourly_rate_max}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-semibold">{provider.is_available ? "Available" : "Busy"}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {categories.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display font-semibold">Services</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {provider.is_verified && <Badge className="gap-1"><CheckCircle className="h-3 w-3" /> Verified</Badge>}
            <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" /> Licensed & Insured</Badge>
          </div>

          <Button className="mt-8 w-full font-semibold" size="lg" onClick={() => {
            if (!user) {
              toast({ title: "Sign in required", description: "Please sign in to book a provider." });
              navigate("/auth");
              return;
            }
            toast({ title: "Booking requested!", description: `We've notified ${provider.name}. They'll confirm shortly.` });
          }}>
            Book {provider.name}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderProfile;
