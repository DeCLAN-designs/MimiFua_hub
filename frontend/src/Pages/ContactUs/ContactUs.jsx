import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Get In Touch</h1>
        <p>
          We’d love to hear from you! Send us a message and we’ll respond as
          soon as possible.
        </p>
      </header>

      <div className="contact-container">
        {/* Info Cards */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email Us</h3>
            <p>info@mimifua.com</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Call Us</h3>
            <p>+254 700 123456</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>123 Service Plaza, Nairobi, Kenya</p>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            {["name", "email", "subject"].map((field) => (
              <div className="form-group floating" key={field}>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                <label htmlFor={field}>
                  {field === "name"
                    ? "Your Name"
                    : field === "email"
                    ? "Email Address"
                    : "Subject"}
                </label>
                <div className="underline"></div>
              </div>
            ))}

            <div className="form-group floating">
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <label htmlFor="message">Your Message</label>
              <div className="underline"></div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

            {submitStatus === "success" && (
              <div className="success-message">
                <span>✓</span> Your message has been sent successfully!
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="contact-map">
        <iframe
          title="MimiFua Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3446.6841452440513!2d36.74102266796912!3d-1.3859947242632173!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05d959380e57%3A0x97a10395699272e8!2sMiMi%20Fua%20Business%20Hub!5e0!3m2!1sen!2ske!4v1750226865455!5m2!1sen!2ske"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ContactUs;
