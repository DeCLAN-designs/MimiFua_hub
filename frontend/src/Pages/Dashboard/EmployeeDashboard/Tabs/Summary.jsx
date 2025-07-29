import React from "react";

const Summary = ({ user }) => {
  return (
    <div>
      <h3>📦 Inventory Overview</h3>
      <p>Welcome {user.name}, this is your summary dashboard.</p>
      {/* You can extract and reuse inventory/sales from props or context if needed */}
    </div>
  );
};

export default Summary;
