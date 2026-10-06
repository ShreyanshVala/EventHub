import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <span>GET IN TOUCH</span>

        <h1>
          We'd Love to
          <strong> Hear From You</strong>
        </h1>

        <p>
          Have a question, suggestion or need help?
          Send us a message and we'll get back to you.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section">

        {/* Contact Info */}
        <div className="contact-info">

          <span className="section-label">
            CONTACT US
          </span>

          <h2>
            Let's Start a
            <span> Conversation</span>
          </h2>

          <p className="contact-description">
            Whether you have a question about an event,
            booking or anything else, our team is ready
            to help.
          </p>

          <div className="contact-item">
            <div className="contact-icon">📧</div>

            <div>
              <h3>Email</h3>
              <p>support@eventhub.com</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📞</div>

            <div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📍</div>

            <div>
              <h3>Address</h3>
              <p>Ahmedabad, Gujarat, India</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">🕒</div>

            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="contact-form-card">

          <h2>Send Us a Message</h2>

          <p>
            Fill out the form and we'll get back to you.
          </p>

          {submitted && (
            <div className="contact-success">
              ✓ Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-row">

              <div className="input-group">
                <label>Your Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="input-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Message</label>

              <textarea
                name="message"
                rows="6"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit">
              Send Message →
            </button>

          </form>
        </div>

      </section>

    </div>
  );
};

export default Contact;