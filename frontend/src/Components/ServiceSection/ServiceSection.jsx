import React from "react";
import "./ServiceSection.css";

const ServiceSection = () => {
  return (
    <section className="services">
      <h2 className="services-title">Our Services</h2>
      <div className="services-grid">
        <div className="service-card">Web Design</div>
        <div className="service-card">App Development</div>
        <div className="service-card">Cybersecurity</div>
      </div>
    </section>
  );
};

export default ServiceSection;
