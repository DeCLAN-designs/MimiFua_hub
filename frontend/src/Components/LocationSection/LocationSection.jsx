import React from "react";
import "./LocationSection.css";

const LocationSection = () => {
  return (
    <section className="locations">
      <h2 className="locations-title">Our Business Hubs</h2>
      <div className="locations-grid">
        {/* Location 1 */}
        <div className="location-card">
          <h3 className="location-name">Westlands Branch</h3>
          <p className="location-address">
            123 Market Street, Westlands, Nairobi
          </p>
          <p className="location-phone">📞 +254 711 111111</p>
          <p className="location-email">✉️ westlands@mimifua.com</p>
          <p className="location-hours">⏰ Mon–Sun: 7:00 AM – 8:00 PM</p>
        </div>

        {/* Location 2 */}
        <div className="location-card">
          <h3 className="location-name">Kilimani Branch</h3>
          <p className="location-address">
            45 Dennis Pritt Road, Kilimani, Nairobi
          </p>
          <p className="location-phone">📞 +254 722 222222</p>
          <p className="location-email">✉️ kilimani@mimifua.com</p>
          <p className="location-hours">⏰ Mon–Sun: 7:00 AM – 8:00 PM</p>
        </div>

        {/* Location 3 */}
        <div className="location-card">
          <h3 className="location-name">CBD Branch</h3>
          <p className="location-address">12 Moi Avenue, Nairobi CBD</p>
          <p className="location-phone">📞 +254 733 333333</p>
          <p className="location-email">✉️ cbd@mimifua.com</p>
          <p className="location-hours">⏰ Mon–Sun: 7:00 AM – 8:00 PM</p>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
