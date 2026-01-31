import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const policyLinks = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/cookies", label: "Cookie Policy" },
    { to: "/gdpr", label: "GDPR" },
  ];

  return (
    <footer className="footer">
  <div className="footer-container">
    <div className="footer-section">
      <h3>Mockneto</h3>
      <p>Your personal AI coach to master real-world interviews with confidence. Transform your interview skills with our cutting-edge AI technology.</p>
      <div className="social-icons">
        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
      </div>
    </div>

    <div className="footer-section">
      <h4>Quick Links</h4>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Practice Interview</Link></li>
        <li><Link to="/interviewtips">Interview Tips</Link></li>
        <li><Link to="/interviewsetup">Mock Interview</Link></li>
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/contactus">Contact</Link></li>
      </ul>
    </div>

    <div className="footer-section">
      <h4>Interview Tips</h4>
      <ul>
        <li><Link to="/interviewtips">Communication Skills</Link></li>
        <li><Link to="/interviewtips">Leadership Skills</Link></li>
        <li><Link to="/interviewtips">Problem Solving</Link></li>
        <li><Link to="/interviewtips">Body Language</Link></li>
        <li><Link to="/interviewtips">Creativity</Link></li>
        <li><Link to="/question">Practice Questions</Link></li>
      </ul>
    </div>

    <div className="footer-section">
      <h4>Stay Updated</h4>
      <p>Subscribe to our newsletter for the latest interview tips and AI updates.</p>
      <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" autoComplete="email" />
        <button type="submit">Subscribe</button>
      </form>
      <div className="footer-contact">
        <div className="contact-item"><FaEnvelope aria-hidden="true" /> <span>support@mockneto.com</span></div>
        <div className="contact-item"><FaPhoneAlt aria-hidden="true" /> <span>+91 8282828282</span></div>
        <div className="contact-item"><FaMapMarkerAlt aria-hidden="true" /> <span>Bharat</span></div>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <div className="footer-bottom-inner">
      <p>&copy; 2025 Mockneto. All rights reserved.</p>
      <nav className="policy-links" aria-label="Legal">
        {policyLinks.map((item) => (
          <Link key={item.to} to={item.to}>{item.label}</Link>
        ))}
      </nav>
    </div>
  </div>
</footer>
  );
};

export default Footer;