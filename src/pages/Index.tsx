import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ServiceCategories from "@/components/landing/ServiceCategories";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustSection />
        <HowItWorks />
        <ServiceCategories />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
