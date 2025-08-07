// src/UI/EmployeesModal.jsx

import React from "react";
import "./EmployeesModal.css";

const EmployeesModal = ({ children, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default EmployeesModal;
