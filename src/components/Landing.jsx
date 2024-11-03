import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * Landing component for displaying the homepage of the website.
 * 
 * @returns {JSX.Element} The rendered Landing component.
 */
function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-text">
        <h1>Welcome to StoryPath</h1>
        <p>Create engaging tours, hunts, and adventures!</p>
        <hr />
        <ul>
          <li>Museum Tours</li>
          <li>Campus Tours</li>
          <li>Treasure Hunts</li>
          <li>And more!</li>
        </ul>
        <Link to="/project">
          <button type="button" className="btn btn-primary">Get Started</button>
        </Link>
      </div>
      
      <div className="landing-image">
        <img src="src/assets/landing_pic.png" alt="alternatetext" />
      </div>
    </div>
  );
}

export default Landing;
