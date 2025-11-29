"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showEvent, setShowEvent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const message = formData.get("message")?.trim();
    let valid = true;
    const errors = { name: "", email: "", message: "" };

    if (!name) {
      errors.name = "Please enter your name.";
      valid = false;
    }
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }
    if (!message) {
      errors.message = "Please add a short message.";
      valid = false;
    }

    form.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    Object.entries(errors).forEach(([field, msg]) => {
      if (msg) {
        const target = form.querySelector(`[data-error="${field}"]`);
        if (target) target.textContent = msg;
      }
    });

    if (!valid) return;
    setStatus({
      type: "success",
      message:
        "Thank you for reaching out. Your message is on its way, and I will respond as soon as I can.",
    });
    form.reset();
    setShowEvent(false);
  };

  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Contact</h1>
          <p className="body-large">
            I would love to hear from you. Whether you are interested in having me speak at your event or just want to say hi, fill out the form below and I will get back to you as soon as I can.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container quote-block contact-form-wrapper">
          {status.type === "success" && <div className="success">{status.message}</div>}
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your full name" required />
              <div className="error" data-error="name"></div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
              <div className="helper">I will only use this to reply to your message.</div>
              <div className="error" data-error="email"></div>
            </div>

            <div>
              <label htmlFor="reason">How can I help?</label>
              <select
                id="reason"
                name="reason"
                onChange={(e) => setShowEvent(e.target.value === "Book Lizi to speak")}
              >
                <option>Book Lizi to speak</option>
                <option>Ask a question</option>
                <option>Share a story</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="org">Organization or church (optional)</label>
              <input id="org" name="org" type="text" placeholder="Name of your group, church, or event" />
            </div>

            {showEvent && (
              <div>
                <label htmlFor="event">Event details</label>
                <textarea
                  id="event"
                  name="event"
                  placeholder="Date, location, type of event, and an approximate size of your group."
                ></textarea>
                <div className="helper">Share as much as you know so far, even if details are still flexible.</div>
              </div>
            )}

            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="What would you like to share or ask?" required></textarea>
              <div className="error" data-error="message"></div>
            </div>

            <button type="submit" className="btn primary">
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
