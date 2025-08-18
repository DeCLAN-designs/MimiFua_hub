import React from "react";
import PageLayout from "../PageLayout/PageLayout";
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
    <PageLayout
      title="Opportunities"
      subtitle="Join us in revolutionizing urban convenience services"
    >
      <div className="opportunities-grid">
        {opportunities.map((opp, index) => (
          <div
            key={opp.id}
            className="opportunity-card"
            style={{
              "--index": index,
              "--delay": `${index * 0.1}s`,
            }}
          >
            <div className="opportunity-icon-container">
              <span
                className="opportunity-icon"
                role="img"
                aria-label={opp.type.toLowerCase()}
              >
                {opp.icon}
              </span>
            </div>
            <div className="opportunity-content">
              <span className="opportunity-type">{opp.type}</span>
              <h2 className="opportunity-title">{opp.title}</h2>
              <p className="opportunity-description">{opp.description}</p>
              <button
                className="opportunity-button"
                aria-label={`Learn more about ${opp.title}`}
              >
                Learn More
                <span aria-hidden="true">→</span>
              </button>
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
        <button
          className="application-button"
          aria-label="Submit general application"
          onClick={() => {
            // TODO: Implement application form modal or navigation
            console.log("General application clicked");
          }}
        >
          Submit General Application
          <span className="button-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </PageLayout>
  );
};

export default Opportunities;
