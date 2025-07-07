// components/Solutions.jsx
import React, { Suspense } from "react";
import "./Solutions.css";

// Lazy load the SolutionCard component
const SolutionCard = React.lazy(() => import("./SolutionCard"));

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
    <section className="solutions-page">
      <div className="solutions-header">
        <h1 className="solutions-title">Our Solutions</h1>
        <p className="solutions-subtitle">
          Discover our comprehensive range of services designed to make your
          life easier
        </p>
      </div>

      <div className="solutions-grid">
        <Suspense fallback={<p>Loading solutions...</p>}>
          {services.map((service, index) => (
            <SolutionCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </Suspense>
      </div>
    </section>
  );
};

export default Solutions;
