import React from 'react';
import { useApp } from '../../context/AppContext';
import './Contact.css';

export default function Contact() {
  const { navigate } = useApp();
  return (
    <div className="contact-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Contact Us</span>
      </div>
      <div className="contact-wrap">
        <h1 className="contact-title">Get in <em>Touch</em></h1>
        <p className="contact-sub">We'd love to hear from you. Reach us through any of the channels below.</p>
        <div className="contact-cards">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <p className="contact-label">Email</p>
            <a href="mailto:vashanth.tup@gmail.com" className="contact-value">vashanth.tup@gmail.com</a>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📱</div>
            <p className="contact-label">Phone</p>
            <a href="tel:+919999999999" className="contact-value">+91 99999 99999</a>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📸</div>
            <p className="contact-label">Instagram</p>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-value">@lumierebeauty</a>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🕐</div>
            <p className="contact-label">Support Hours</p>
            <p className="contact-value">Mon–Sat, 9AM – 6PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
