import Hero from "../components/Hero";
import Solutions from "../components/Solutions";
import PartnersSection from "../components/PartnersSection";
import WhyChooseUs from "../components/WhyChooseUs";
import ImpactStats from "../components/ImpactStats";
import ClientsSection from "../components/ClientsSection";
import HomeTestimonials from "../components/HomeTestimonials";
import LatestNews from "../components/LatestNews";
import FinalCTA from "../components/FinalCTA";
import ScrollProgress from "../components/ScrollProgress";

/**
 * Home route — best-practice landing flow:
 * Hero (value prop) → Solutions (what) → Partners (credibility) →
 * Why (differentiators) → Impact (proof) → Clients (social proof) →
 * News (activity) → Final CTA (conversion).
 */
const HomePage = () => (
  <>
    <ScrollProgress />
    <Hero />
    <Solutions />
    <PartnersSection />
    <WhyChooseUs />
    <ImpactStats />
    <ClientsSection />
    <HomeTestimonials />
    <LatestNews />
    <FinalCTA />
  </>
);

export default HomePage;
