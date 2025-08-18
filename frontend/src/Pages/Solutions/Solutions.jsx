import React, { Suspense } from "react";
import PageLayout from "../PageLayout/PageLayout";
import "./Solutions.css";
import SolutionCard from "./SolutionCard/"

// Lazy load the SolutionCard component
// const SolutionCard = React.lazy(() => import("../../Pages/Solutions/SolutionCard/SolutionCard"));

const services = [
  {
    icon: "🧺",
    title: "Coin-Operated Laundry Machines",
    description:
      "Quick and easy laundry using coin-operated washers and dryers.",
  },
  {
    icon: "🧼",
    title: "Self-Service Wash & Dry",
    description: "Do your own laundry with our self-service machines.",
  },
  {
    icon: "☕",
    title: "Lounge & Cafe Area",
    description: "Relax and enjoy refreshments while waiting.",
  },
  {
    icon: "🚗",
    title: "Car Wash",
    description: "Professional car wash services with high-quality detailing.",
  },
  {
    icon: "🧹",
    title: "Carpet Cleaning",
    description: "Deep cleaning for all types of carpets and rugs.",
  },
  {
    icon: "✂️",
    title: "Barber & Nail Spa",
    description: "Grooming and spa services for men and women.",
  },
  {
    icon: "👕",
    title: "Laundry Services",
    description: "Affordable wash, dry, and fold options for all garments.",
  },
  {
    icon: "💧",
    title: "Water Refilling Station",
    description: "Clean, purified water refills for all container sizes.",
  },
  {
    icon: "💻",
    title: "Cyber Services",
    description: "Internet access, printing, scanning, and more.",
  },
  {
    icon: "💰",
    title: "M-Pesa Agency",
    description: "Secure mobile money transactions and withdrawals.",
  },
  {
    icon: "🛒",
    title: "Mini-Mart",
    description: "Convenience store for daily essentials under one roof.",
  },
  {
    icon: "🍽️",
    title: "Eatery",
    description: "Tasty meals and snacks served hot and fresh.",
  },
];

const Solutions = () => {
  return (
    <PageLayout 
      title="Our Solutions"
      subtitle="Discover our comprehensive range of services designed to make your life easier"
    >
      <div className="solutions-grid">
        <Suspense fallback={<div className="loading">Loading solutions...</div>}>
          {services.map((service, index) => (
            <div key={index} style={{ '--i': index }}>
              <SolutionCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </div>
          ))}
        </Suspense>
      </div>
    </PageLayout>
  );
};

export default Solutions;
