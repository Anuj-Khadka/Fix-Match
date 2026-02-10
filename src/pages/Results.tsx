import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Star, MapPin, Shield, Clock, DollarSign, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Provider = Tables<"providers">;

const Results = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const urgency = searchParams.get("urgency");

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      let query = supabase.from("providers").select("*").eq("is_available", true);

      if (categoryId) {
        // Get providers that serve this category
        const { data: providerIds } = await supabase
          .from("provider_services")
          .select("provider_id")
          .eq("category_id", categoryId);

        if (providerIds && providerIds.length > 0) {
          const ids = providerIds.map((p) => p.provider_id);
          query = query.in("id", ids);
        }
      }

      const { data } = await query;
      setProviders(data || []);
      setLoading(false);
    };

    fetchProviders();
  }, [categoryId]);

  const sorted = [...providers].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price") return (a.hourly_rate_min || 0) - (b.hourly_rate_min || 0);
    if (sortBy === "experience") return (b.years_experience || 0) - (a.years_experience || 0);
    return 0;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Available Providers</h1>
              <p className="text-sm text-muted-foreground">{providers.length} providers found</p>
            </div>
            <div className="flex items-center gap-2">
              {urgency && (
                <Badge variant={urgency === "now" ? "destructive" : urgency === "today" ? "default" : "secondary"}>
                  {urgency === "now" ? "Emergency" : urgency === "today" ? "Today" : "Flexible"}
                </Badge>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="mt-20 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="mt-20 text-center text-muted-foreground">
              <p>No providers found for this service.</p>
              <Link to="/request"><Button className="mt-4">Try Another Service</Button></Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sorted.map((provider) => (
                <Link key={provider.id} to={`/provider/${provider.id}`}>
                  <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-semibold">{provider.name}</h3>
                            {provider.is_verified && (
                              <Shield className="h-4 w-4 text-success" />
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                              {provider.rating} ({provider.review_count})
                            </span>
                            {provider.location_address && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {provider.location_address}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {provider.years_experience}yr exp
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {provider.hourly_rate_min && (
                          <span className="flex items-center gap-1 text-sm font-medium">
                            <DollarSign className="h-3.5 w-3.5" />
                            {provider.hourly_rate_min}–{provider.hourly_rate_max}/hr
                          </span>
                        )}
                        <Button size="sm">Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
