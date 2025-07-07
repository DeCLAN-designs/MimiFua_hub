import React from "react";
import "./Opportunities.css";

const opportunities = [
  {
    id: 1,
    title: "Franchise Opportunities",
    description:
      "Join our growing network of multi-service hubs with our proven business model",
    type: "Business",
    icon: "🏢",
  },
  {
    id: 2,
    title: "Career Openings",
    description: "Exciting job positions in our expanding locations",
    type: "Employment",
    icon: "💼",
  },
  {
    id: 3,
    title: "Vendor Partnerships",
    description: "Collaborate with us as a supplier or service provider",
    type: "Partnership",
    icon: "🤝",
  },
  {
    id: 4,
    title: "Community Programs",
    description: "Get involved with our local community initiatives",
    type: "Community",
    icon: "🌱",
  },
  {
    id: 5,
    title: "Investor Relations",
    description: "Learn about investment opportunities in our business",
    type: "Investment",
    icon: "📈",
  },
  {
    id: 6,
    title: "Student Internships",
    description:
      "Gain practical experience in multi-service business management",
    type: "Education",
    icon: "🎓",
  },
];

const Opportunities = () => {
  return (
    <section className="opportunities-page">
      <div className="opportunities-header">
        <h1 className="opportunities-title">Opportunities</h1>
        <p className="opportunities-subtitle">
          Join us in revolutionizing urban convenience services
        </p>
      </div>

      <div className="opportunities-grid">
        {opportunities.map((opp) => (
          <div key={opp.id} className="opportunity-card">
            <div className="opportunity-icon-container">
              <span className="opportunity-icon">{opp.icon}</span>
            </div>
            <div className="opportunity-content">
              <span className="opportunity-type">{opp.type}</span>
              <h2 className="opportunity-title">{opp.title}</h2>
              <p className="opportunity-description">{opp.description}</p>
              <button className="opportunity-button">Learn More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="general-application">
        <h2>Don't see what you're looking for?</h2>
        <p>
          We're always interested in connecting with talented individuals and
          potential partners
        </p>
        <button className="application-button">
          Submit General Application
        </button>
      </div>
    </section>
  );
};

export default Opportunities;
