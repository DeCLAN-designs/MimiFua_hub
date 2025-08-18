import React from "react";
import PageLayout from "../PageLayout/PageLayout";
import "./AboutUs.css";
// Image URLs for vision and mission sections
const visionImageUrl = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop";
const missionImageUrl = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop";

const AboutUs = () => {
  // Emojis for core values
  const coreValueEmojis = {
    integrity: "🤝", // Handshake emoji
    innovation: "💡", // Lightbulb emoji
    excellence: "🏆", // Trophy emoji
    community: "👥", // People together emoji
    sustainability: "🌱", // Plant emoji
    customerFocus: "❤️", // Heart emoji
  };

  return (
    <PageLayout 
      title="About MiMi Fua"
      subtitle="Transforming urban convenience with innovative multi-service solutions"
    >
      {/* Why Us Section */}
      <section className="why-us-section">
        <h2>Why Choose MiMi Fua?</h2>
        <p className="intro-text">
          We combine affordability, convenience, and innovation to deliver
          high-quality services across our laundromat café and multi-service
          business hub. With an unwavering commitment to cleanliness, comfort,
          and customer satisfaction, MiMi Fua is your all-in-one destination.
        </p>
      </section>

      {/* Core Values with Emojis */}
      <section className="core-values-section">
        <h2 className="core-values-title">Our Core Values</h2>

        <div className="values-container">
          {/* Integrity Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Integrity"
            >
              {coreValueEmojis.integrity}
            </div>
            <div className="value-content">
              <h3>Integrity</h3>
              <p>
                We deliver what we promise — consistently and transparently.
              </p>
            </div>
          </div>

          {/* Innovation Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Innovation"
            >
              {coreValueEmojis.innovation}
            </div>
            <div className="value-content">
              <h3>Innovation</h3>
              <p>
                We embrace creativity to improve service delivery and customer
                experience.
              </p>
            </div>
          </div>

          {/* Excellence Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Excellence"
            >
              {coreValueEmojis.excellence}
            </div>
            <div className="value-content">
              <h3>Excellence</h3>
              <p>We strive for top-tier standards in everything we do.</p>
            </div>
          </div>

          {/* Community Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Community"
            >
              {coreValueEmojis.community}
            </div>
            <div className="value-content">
              <h3>Community</h3>
              <p>We build trust by uplifting those we serve.</p>
            </div>
          </div>

          {/* Sustainability Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Sustainability"
            >
              {coreValueEmojis.sustainability}
            </div>
            <div className="value-content">
              <h3>Sustainability</h3>
              <p>
                We commit to eco-friendly practices that protect our
                environment.
              </p>
            </div>
          </div>

          {/* Customer Focus Value */}
          <div className="value-card">
            <div
              className="value-emoji-container"
              role="img"
              aria-label="Customer Focus"
            >
              {coreValueEmojis.customerFocus}
            </div>
            <div className="value-content">
              <h3>Customer Focus</h3>
              <p>Your needs and satisfaction drive every decision we make.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-text">
          <h2>Our Vision</h2>
          <p>
            To revolutionize urban convenience by creating a unified space where
            communities access essential lifestyle services with ease, quality,
            and hospitality.
          </p>
        </div>
        <div className="vision-image">
          <img 
            src={visionImageUrl} 
            alt="Modern urban vision concept" 
            loading="lazy"
            className="vision-image-content"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-image">
          <img 
            src={missionImageUrl} 
            alt="Team collaboration and mission" 
            loading="lazy"
            className="mission-image-content"
          />
        </div>
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            To provide reliable, affordable, and accessible services that
            improve everyday life, empower small communities, and foster
            economic growth — all under one roof.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutUs;
