import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocation, createLocation, updateLocation, getProjects } from '../api';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import './styles.css'; 

/**
 * EditLocation component for creating or editing a location.
 * This component allows users to fill in or update a location's details, 
 * including the name, trigger, position, points, and rich text content.
 */
const EditLocation = () => {
  // State variables to manage the form fields
  const [locationName, setLocationName] = useState('');
  const [locationTrigger, setLocationTrigger] = useState('');
  const [locationPosition, setLocationPosition] = useState('');
  const [scorePoints, setScorePoints] = useState(0);
  const [clue, setClue] = useState('');
  const [locationContent, setLocationContent] = useState('');
  const [projectId, setProjectId] = useState(null);

  // Get the location ID from the URL params
  const { id } = useParams();
  const navigate = useNavigate();

  // Effect hook to load location or project data when component mounts or `id` changes
  useEffect(() => {
    if (id) {
      // If an ID exists, fetch the location details for editing
      const fetchLocation = async () => {
        const location = await getLocation(id);
        // Set form fields with the fetched location data
        setLocationName(location[0].location_name);
        setLocationTrigger(location[0].location_trigger);
        setLocationPosition(location[0].location_position);
        setScorePoints(location[0].score_points);
        setClue(location[0].clue);
        setLocationContent(location[0].location_content);
        setProjectId(location[0].project_id);
      };
      fetchLocation();
    } else {
      // If no ID, assume this is a new location; fetch the project ID
      const fetchProject = async () => {
        const project = await getProjects();
        setProjectId(project[0].id); 
      };
      fetchProject();
    }
  }, [id]);

  /**
   * Quill rich text editor configuration for the toolbar.
   * We use useMemo to ensure the toolbar configuration is memoized.
   */
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'], // Link tool
      ['clean'] // Remove formatting
    ]
  }), []);

  /**
   * handleSubmit handles the form submission.
   * It prepares the location data and sends it to the API to create or update the location.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!projectId) {
      console.error("Project ID is missing!"); // Ensure a valid project ID
      return;
    }

    // Prepare the location data object
    const locationData = {
      project_id: projectId,
      location_name: locationName,
      location_trigger: locationTrigger,
      location_position: locationPosition,
      score_points: scorePoints,
      clue: clue,
      location_content: locationContent
    };

    try {
      // If ID exists, update the location; otherwise, create a new location
      if (id) {
        await updateLocation(id, locationData);
      } else {
        await createLocation(locationData);
      }
      // Navigate to the locations list after successful save
      navigate(`/project/${projectId}/locations`);
    } catch (error) {
      console.error("Failed to save location:", error.message); // Handle API errors
    }
  };

  return (
    <div className="edit-location-container container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">{id ? "Edit Location" : "Add New Location"}</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <label htmlFor="locationName" className="form-label">Location Name</label>
              <div className="col-sm">
                <input
                  type="text"
                  className="form-control"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="locationTrigger" className="form-label">Location Trigger</label>
              <div className="col-sm">
                <select
                  className="form-control"
                  value={locationTrigger}
                  onChange={(e) => setLocationTrigger(e.target.value)}
                  required
                >
                  <option value="">Select Trigger</option>
                  <option value="Location Entry">Location Entry</option>
                  <option value="QR Code Scan">QR Code Scan</option>
                  <option value="Both Location Entry and QR Code Scan">Both</option>
                </select>
              </div>

              <label htmlFor="locationPosition" className="form-label">Location Position (lat, long)</label>
              <div className="col-sm">
                <input
                  type="text"
                  className="form-control"
                  value={locationPosition}
                  onChange={(e) => setLocationPosition(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="scorePoints" className="form-label">Points for Reaching Location</label>
              <div className="col-sm">
                <input
                  type="number"
                  className="form-control"
                  value={scorePoints}
                  onChange={(e) => setScorePoints(parseInt(e.target.value))}
                  required
                />
              </div>

              <label htmlFor="clue" className="form-label">Clue</label>
              <div className="col-sm">
                <textarea
                  className="form-control"
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                />
              </div>

              <label htmlFor="locationContent" className="form-label">Location Content</label>
              <div className="col-sm">
                <ReactQuill
                  value={locationContent}
                  onChange={setLocationContent}
                  theme="snow"
                  modules={modules}
                  placeholder="Enter location content..."
                />
              </div>

              <div className="col-sm">
                <button type="submit" className="btn btn-primary w-100">Save Location</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLocation;
