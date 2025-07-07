import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to MiMi Fua</h1>
          <p className="hero-subtitle">
            Experience convenience, cleanliness, and community all under one
            roof.
          </p>
          <a href="/solutions" className="hero-cta">
            Explore Our Solutions
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
