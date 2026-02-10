import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Zap,
  Clock,
  Calendar,
  CheckCircle,
  Loader2,
  Droplets,
  Wind,
  Key,
  Sparkles,
  Bug,
  Refrigerator,
  Paintbrush,
  Hammer,
  Wrench,
  Trees,
  ShieldCheck,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  droplets: Droplets,
  zap: Zap,
  wind: Wind,
  key: Key,
  sparkles: Sparkles,
  bug: Bug,
  refrigerator: Refrigerator,
  paintbrush: Paintbrush,
  hammer: Hammer,
  wrench: Wrench,
  trees: Trees,
  "shield-check": ShieldCheck,
};

type Category = { id: string; name: string; slug: string; description: string | null; icon: string | null };

const urgencyOptions = [
  { value: "now" as const, label: "Now", sublabel: "Emergency — ASAP", icon: Zap, color: "border-urgent text-urgent" },
  { value: "today" as const, label: "Today", sublabel: "Within a few hours", icon: Clock, color: "border-accent text-accent" },
  { value: "flexible" as const, label: "Flexible", sublabel: "This week is fine", icon: Calendar, color: "border-primary text-primary" },
];

const ServiceRequest = () => {
  const [searchParams] = useSearchParams();
  const { user, profileId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"now" | "today" | "flexible">("today");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("service_categories").select("*").order("name").then(({ data }) => {
      if (data) {
        setCategories(data);
        const preselect = searchParams.get("category");
        if (preselect) {
          const found = data.find((c) => c.name === preselect);
          if (found) {
            setSelectedCategory(found.id);
            setStep(2);
          }
        }
      }
    });
  }, [searchParams]);

  const detectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationLat(pos.coords.latitude);
          setLocationLng(pos.coords.longitude);
          setLocationAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setDetectingLocation(false);
        },
        () => {
          setDetectingLocation(false);
          toast({ title: "Location unavailable", description: "Please enter your address manually.", variant: "destructive" });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!user || !profileId) {
      toast({ title: "Please sign in", description: "You need to be logged in to submit a request." });
      navigate("/auth");
      return;
    }
    if (!selectedCategory) return;
    setSubmitting(true);

    const { data, error } = await supabase.from("service_requests").insert({
      user_id: profileId,
      category_id: selectedCategory,
      description,
      urgency,
      location_lat: locationLat,
      location_lng: locationLng,
      location_address: locationAddress,
    }).select("id").single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    navigate(`/results?request=${data.id}&category=${selectedCategory}&urgency=${urgency}`);
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl">
          {/* Progress */}
          <div className="mb-8 flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
                {s < 5 && <div className={`hidden h-0.5 w-8 sm:block ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold">What do you need help with?</h2>
              <p className="mt-1 text-muted-foreground">Select a service category</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon || ""] || Wrench;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:border-primary/40 hover:shadow-sm ${selectedCategory === cat.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card"}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <Button disabled={!selectedCategory} onClick={() => setStep(2)} className="gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold">Describe the problem</h2>
              <p className="mt-1 text-muted-foreground">A brief description helps providers prepare</p>
              <Textarea
                className="mt-6"
                placeholder="e.g., Kitchen sink is leaking from the pipe under the cabinet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(3)} className="gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Urgency */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold">How urgent is this?</h2>
              <p className="mt-1 text-muted-foreground">We'll prioritize providers based on urgency</p>
              <div className="mt-6 space-y-3">
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUrgency(opt.value)}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${urgency === opt.value ? opt.color + " bg-card shadow-sm" : "border-border bg-card hover:border-muted-foreground/30"}`}
                  >
                    <opt.icon className="h-6 w-6" />
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-sm text-muted-foreground">{opt.sublabel}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(4)} className="gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold">Where do you need service?</h2>
              <p className="mt-1 text-muted-foreground">We'll find providers near you</p>
              <div className="mt-6 space-y-4">
                <Button variant="outline" onClick={detectLocation} disabled={detectingLocation} className="w-full gap-2">
                  {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  {detectingLocation ? "Detecting..." : "Use My Location"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                  <p className="relative mx-auto w-fit bg-background px-3 text-xs text-muted-foreground">or enter manually</p>
                </div>
                <Input
                  placeholder="Enter your address..."
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                />
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button disabled={!locationAddress} onClick={() => setStep(5)} className="gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="font-display text-2xl font-bold">Review your request</h2>
              <p className="mt-1 text-muted-foreground">Make sure everything looks right</p>
              <Card className="mt-6">
                <CardContent className="space-y-4 p-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Service</span>
                    <span className="font-medium">{selectedCat?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Urgency</span>
                    <Badge variant={urgency === "now" ? "destructive" : urgency === "today" ? "default" : "secondary"}>
                      {urgency === "now" ? "Emergency" : urgency === "today" ? "Today" : "Flexible"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-right font-medium">{locationAddress || "Not set"}</span>
                  </div>
                  {description && (
                    <div>
                      <span className="text-sm text-muted-foreground">Description</span>
                      <p className="mt-1 text-sm">{description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {!user && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  You'll need to <button onClick={() => navigate("/auth")} className="font-medium text-primary hover:underline">sign in</button> to submit.
                </p>
              )}
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={handleSubmit} disabled={submitting} className="gap-2 font-semibold">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? "Submitting..." : "Find Providers"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRequest;
