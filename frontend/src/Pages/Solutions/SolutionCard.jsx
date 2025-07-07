// components/SolutionCard.jsx
import React from "react";
import PropTypes from "prop-types";
import "./SolutionCard.css"; // Separate CSS just for the card

const SolutionCard = ({ icon, title, description }) => {
  return (
    <div className="solution-card">
      <div className="solution-icon-container" role="img" aria-label={title}>
        <span className="solution-icon">{icon}</span>
      </div>
      <div className="solution-content">
        <h2 className="solution-title">{title}</h2>
        <p className="solution-description">{description}</p>
      </div>
    </div>
  );
};

SolutionCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default SolutionCard;
