import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * Header component for the top navigation of the website.
 * Displays the site branding (StoryPath) and a navigation link to the "Projects" page.
 * The header remains consistent across different pages.
 * 
 * @returns {JSX.Element} The rendered Header component.
 */
function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">STORYPATH</Link>
        <Link to="/project" className="nav-link">PROJECTS</Link>
      </nav>
    </header>
  );
}

export default Header;

