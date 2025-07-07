import React from "react";
import "./AboutUs.css";
import visionImg from "../../assets/Images/visionImg.png";
import missionImg from "../../assets/Images/missionImg.jpg";

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
    <div className="about-page">
      {/* Why Us Section */}
      <section className="why-us-section">
        <h1>Why Choose MiMi Fua?</h1>
        <p>
          We combine affordability, convenience, and innovation to deliver
          high-quality services across our laundromat café and multi-service
          business hub. With an unwavering commitment to cleanliness, comfort,
          and customer satisfaction, MiMi Fua is your all-in-one destination.
        </p>
      </section>

      {/* Core Values with Emojis */}
      <section className="core-values-section">
        <h2>Our Core Values</h2>

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
          <img src={visionImg} alt="Our Vision" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-image">
          <img src={missionImg} alt="Our Mission" />
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
    </div>
  );
};

export default AboutUs;
