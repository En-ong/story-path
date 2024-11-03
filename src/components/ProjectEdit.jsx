import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProject, createProject, updateProject } from '../api';

/**
 * AddEditProject component for creating or editing a project.
 * The form allows users to input project details such as title, description, instructions, 
 * initial clue, homescreen display options, participant scoring methods, and published status.
 * The form dynamically loads existing project details if an `id` is provided for editing.
 * 
 * @returns {JSX.Element} The rendered AddEditProject component.
 */
const AddEditProject = () => {
  // State variables to store form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [initClue, setInitClue] = useState('');
  const [homeDisplay, setHomeDisplay] = useState('');
  const [participantScoring, setParticipantScoring] = useState('');
  const [published, setPublished] = useState(false);

  // Get the project ID from the URL parameters
  const { id } = useParams();

  // Hook to navigate the user after form submission
  const navigate = useNavigate();

  // Effect hook to load project data if editing an existing project (i.e., if an ID is present)
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const project = await getProject(id); // Fetch project by ID
        // Populate form fields with project data
        setTitle(project[0].title);
        setDescription(project[0].description);
        setInstructions(project[0].instructions);
        setInitClue(project[0].initial_clue);
        setHomeDisplay(project[0].homescreen_display);
        setParticipantScoring(project[0].participant_scoring);
        setPublished(project[0].is_published);
      };
      fetchProject(); // Fetch project details for editing
    }
  }, [id]);

  /**
   * handleSubmit handles the form submission to either create or update a project.
   * If the `id` exists, it updates the project, otherwise, it creates a new project.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare project data for submission
    const project = {
      title: title,
      description: description,
      instructions: instructions,
      initial_clue: initClue,
      homescreen_display: homeDisplay,
      participant_scoring: participantScoring,
      is_published: published,
    };

    try {
      // If an ID exists, update the project, otherwise create a new one
      if (id) {
        await updateProject(id, project);
      } else {
        await createProject(project);
      }
      // Navigate to the projects list after successful submission
      navigate('/project');
    } catch (error) {
      console.error("Failed to save the project:", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">

          <h2 className="mb-4">{id ? "Edit Project" : "Add New Project"}</h2>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <label htmlFor="title">Title (The name of your project)</label>
              <div className="col-sm">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="description">Description (Provide a brief description of your project. This is not displayed to participants.)</label>
              <div className="col-sm">
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'both' }} // Allow users to resize the textarea
                />
              </div>

              <label htmlFor="instructions">Instructions (Instructions for participants, explaining how to engage with the project.)</label>
              <div className="col-sm">
                <textarea
                  className="form-control"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{ resize: 'both' }} // Allow users to resize the textarea
                />
              </div>

              <label htmlFor="initClue">Initial Clue (The first clue to start the project. This is optional)</label>
              <div className="col-sm">
                <textarea
                  className="form-control"
                  value={initClue}
                  onChange={(e) => setInitClue(e.target.value)}
                  style={{ resize: 'both' }} // Allow users to resize the textarea
                />
              </div>

              <label htmlFor="homeDisplay">Homescreen Display (Choose what to display on the homescreen of the project.)</label>
              <div className="col-sm">
                <select
                  className="form-control"
                  value={homeDisplay}
                  onChange={(e) => setHomeDisplay(e.target.value)}
                  required
                >
                  <option value="">Select Homescreen Display</option>
                  <option value="Display initial clue">Display initial clue</option>
                  <option value="Display all locations">Display all locations</option>
                </select>
              </div>

              <label htmlFor="participantScoring">Participant Scoring (Select how participants will be scored in this project.)</label>
              <div className="col-sm">
                <select
                  className="form-control"
                  value={participantScoring}
                  onChange={(e) => setParticipantScoring(e.target.value)}
                  required
                >
                  <option value="">Select Scoring Method</option>
                  <option value="Not Scored">Not Scored</option>
                  <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
                  <option value="Number of Locations Entered">Number of Locations Entered</option>
                </select>
              </div>

              <label htmlFor="published">Published</label>
              <div className="col-sm">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              </div>

              <div className="col-sm">
                {/* Submit button to save the project */}
                <button type="submit" className="btn btn-primary w-100">Save Project</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProject;
