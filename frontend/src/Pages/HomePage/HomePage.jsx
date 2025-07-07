import React from "react";
import "./HomePage.css";
import Hero from "../../Components/Hero/Hero";
import LocationSection from "../../Components/LocationSection/LocationSection";

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero/>
      <LocationSection />
    </div>
  );
};

export default HomePage;
