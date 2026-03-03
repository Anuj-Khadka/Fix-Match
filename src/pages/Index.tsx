import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TwoPaths from "@/components/landing/TwoPaths";
import WhyFixMatch from "@/components/landing/WhyFixMatch";
import HowItWorks from "@/components/landing/HowItWorks";
import UrgentMoments from "@/components/landing/UrgentMoments";
import TrustSection from "@/components/landing/TrustSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TwoPaths />
        <WhyFixMatch />
        <HowItWorks />
        <UrgentMoments />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
