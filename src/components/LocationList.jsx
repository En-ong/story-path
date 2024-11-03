import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLocationsByProjectId, deleteLocation, getProject } from '../api';
import QRCode from 'react-qr-code';
import './styles.css'; 

/**
 * LocationList component for displaying a list of locations associated with a specific project.
 * The component fetches the locations and project details based on the project ID from the URL.
 * It allows users to view locations, add a new location, preview the project, edit, or delete locations.
 *
 * @returns {JSX.Element} The rendered LocationList component.
 */
const LocationList = () => {
  const { projectId } = useParams(); // Extract project ID from URL parameters
  const [locations, setLocations] = useState([]);
  const [projectName, setProjectName] = useState(''); // To store the project name
  const [error, setError] = useState(null);
  const [qrCodeLocation, setQrCodeLocation] = useState(null); // To store the location for which the QR code is generated

  // Fetch locations and project details on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await getLocationsByProjectId(projectId); // Fetch locations by project ID
        setLocations(locationData);
      } catch (err) {
        setError('Failed to load locations.');
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const projectData = await getProject(projectId); // Fetch project details by project ID
        setProjectName(projectData[0].title); // Set the project name
      } catch (err) {
        setError('Failed to load project details.');
      }
    };

    fetchLocations(); // Fetch locations for the project
    fetchProjectDetails(); // Fetch project name
  }, [projectId]);

  // Function to handle deleting a location
  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter(location => location.id !== id));
    } catch (err) {
      setError('Failed to delete location.');
    }
  };

  // Function to show the QR code for a location
  const handlePrintQRCode = (location) => {
    setQrCodeLocation(location); // Store the location to generate its QR code
  };

  return (
    <div className="location-list-container container mt-5">

      <h2 className="text-center">{projectName} - Locations</h2>

      <div className="action-buttons mb-4">
        <Link to="/editlocations" className="btn btn-primary me-2">
          Add Location
        </Link>
        <Link to="/preview" className="btn btn-secondary">
          Preview
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="location-list">
        {locations.map((location) => (
          <div key={location.id} className="location-box mb-4 p-3">
            <h3 className="location-name">{location.location_name}</h3>
            <p><strong>Trigger:</strong> {location.location_trigger}</p>
            <p><strong>Position:</strong> {location.location_position}</p>
            <p><strong>Points:</strong> {location.score_points}</p>
            <div className="actions">
              <Link to={`/edit-location/${location.id}`} className="btn btn-primary me-2">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(location.id)}
                className="btn btn-danger me-2"
              >
                Delete
              </button>
              {/* Print QR Code button */}
              <button
                className="btn btn-success"
                onClick={() => handlePrintQRCode(location)}
              >
                Print QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {qrCodeLocation && (
        <div className="qr-code-section mt-4 text-center">
          <h3>QR Code for {qrCodeLocation.location_name}</h3>

          <QRCode value={`Location ID: ${qrCodeLocation.id}`} size={150} />
          <button
            className="btn btn-secondary mt-2"
            onClick={() => setQrCodeLocation(null)} // Close the QR code
          >
            Close QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
