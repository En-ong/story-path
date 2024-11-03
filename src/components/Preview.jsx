import React, { useState, useEffect } from 'react';
import { getProjects, getLocations } from '../api';

/**
 * Preview component for testing and simulating the project.
 * Allows users to preview project instructions, locations, scoring, and location content.
 * Users can switch between different locations to simulate visiting locations.
 * 
 * @returns {JSX.Element} The rendered Preview component.
 */
const Preview = () => {
  // State variables to store project, locations, current location, visited locations, and score
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [score, setScore] = useState(0);

  // Fetch project and location data on component mount
  useEffect(() => {
    // Fetch project data
    const fetchProject = async () => {
      const projectData = await getProjects(); // Fetch project data
      setProject(projectData[0]); // Set the first project as the active project
    };

    // Fetch locations data
    const fetchLocations = async () => {
      const locationsData = await getLocations(); // Get all locations for the project
      setLocations(locationsData);
      setCurrentLocation(locationsData[0]); // Set the first location as the default
    };

    // Call the fetch functions
    fetchProject();
    fetchLocations();
  }, []);

  /**
   * handleLocationChange updates the current location based on the selected location.
   * It also tracks the location visit to ensure scoring and visited locations are updated accordingly.
   * 
   * @param {string} locationId - The ID of the selected location.
   */
  const handleLocationChange = (locationId) => {
    const selectedLocation = locations.find(location => location.id === locationId); // Find the selected location
    setCurrentLocation(selectedLocation); // Update the current location
    trackVisit(selectedLocation); // Track the visit for scoring and history
  };

  /**
   * trackVisit handles the logic for tracking which locations have been visited.
   * Updates the score based on the project's participant scoring method.
   * 
   * @param {object} location - The location object of the current location.
   */
  const trackVisit = (location) => {
    // If the location has not been visited yet, track the visit and update the score
    if (!visitedLocations.includes(location.id)) {
      setVisitedLocations([...visitedLocations, location.id]); // Add location to visited locations

      // Update score based on the project's participant scoring method
      if (project.participant_scoring === 'Number of Scanned QR Codes') {
        setScore(score + 1); // Increment score by 1 for each scan
      } else if (project.participant_scoring === 'Number of Locations Entered') {
        setScore(score + location.score_points); // Add location-specific points to the score
      }
    }
  };

  /**
   * renderHomescreen renders the project's home screen, showing the title, instructions,
   * initial clue (if set to display), or all locations if "Display all locations" is selected.
   * 
   * @returns {JSX.Element} The rendered home screen for the project.
   */
  const renderHomescreen = () => {
    return (
      <div>
        <h2>{project.title}</h2>
        <p>{project.instructions}</p>
        {project.homescreen_display === 'Display initial clue' ? (
          <p><strong>Initial Clue:</strong> {project.initial_clue}</p>
        ) : (
          <div>
            <strong>All Locations:</strong>
            <ul>
              {locations.map(location => (
                <li key={location.id}>{location.location_name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  /**
   * renderLocationContent renders the content of the current location.
   * Displays location-specific details such as name, trigger, position, and any clue if available.
   * 
   * @returns {JSX.Element | null} The rendered content for the current location.
   */
  const renderLocationContent = () => {
    if (!currentLocation) return null; // If no location is selected, return nothing

    return (
      <div>
        <h3>{currentLocation.location_name}</h3>
        <p><strong>Location Trigger:</strong> {currentLocation.location_trigger}</p>
        <p><strong>Position:</strong> {currentLocation.location_position}</p>
        {currentLocation.clue && (
          <p><strong>Clue:</strong> {currentLocation.clue}</p>
        )}

        <div dangerouslySetInnerHTML={{ __html: currentLocation.location_content }} />
      </div>
    );
  };

  // Show loading message until project and locations are fetched
  if (!project || locations.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="preview-container" style={{ width: '375px', border: '1px solid #ccc', padding: '10px', margin: 'auto' }}>
      <h1>{project.title} - Preview</h1>

      <div className="location-dropdown mb-3">
        <label htmlFor="location-select">Change Locations to Test Scoring:</label>
        <select
          id="location-select"
          value={currentLocation ? currentLocation.id : ''}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>

      <div className="homescreen p-3 border rounded">
        <h2>{project.title}</h2>
        <p><strong>Instructions:</strong>{project.instructions}</p>
        {project.homescreen_display === 'Display initial clue' && (
          <p><strong>Initial Clue:</strong> {project.initial_clue}</p>
        )}

        <p><strong>Points:</strong> {score}</p>
        <p><strong>Locations Visited:</strong> {visitedLocations.length}/{locations.length}</p>

        {renderLocationContent()}
      </div>
    </div>
  );
};

export default Preview;
