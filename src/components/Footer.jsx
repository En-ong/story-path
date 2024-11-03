import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * Footer component for displaying the footer content of the website.
 * It includes navigation links to other pages (About Us, Contact, Privacy Policy)
 * and displays the current year with the copyright notice.
 * 
 * @returns {JSX.Element} The rendered Footer component.
 */
function Footer() {
  // Get the current year dynamically to display in the footer
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
        <p>&copy; {currentYear} StoryPath. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

