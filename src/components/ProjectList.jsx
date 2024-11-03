import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '../api.js';
import { Link } from 'react-router-dom';

/**
 * ProjectList component displays a list of projects that the user has created.
 * Allows users to add new projects, edit existing ones, view locations for a project, or delete a project.
 *
 * @returns {JSX.Element} The rendered ProjectList component.
 */
const ProjectList = () => {
  // State for the list of projects
  const [projectList, setProjectList] = useState([]);

  /**
   * useEffect hook to fetch the list of projects when the component mounts.
   * Fetches the project data and updates the state.
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects(); // Fetch projects from the API
        setProjectList(projects); // Set the fetched projects in the state
      } catch (error) {
        console.error('Failed to fetch projects:', error.message); // Log an error if fetching fails
      }
    };

    fetchProjects(); // Fetch projects when the component mounts
  }, []);

  /**
   * handleRemove deletes a project by its ID and removes it from the list of projects.
   * 
   * @param {string} id - The ID of the project to remove.
   * @param {number} index - The index of the project in the list.
   */
  const handleRemove = async (id, index) => {
    try {
      await deleteProject(id); // Call API to delete the project by ID
      const newList = [...projectList]; // Create a copy of the project list
      newList.splice(index, 1); // Remove the project from the list using index
      setProjectList(newList); // Update the state with the new list
    } catch (error) {
      console.error('Failed to delete project:', error.message); // Log an error if deleting fails
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Projects</h4>

      <Link to="/edit">
        <button type="button">Add Project</button>
      </Link>

      {projectList.length === 0 ? (
        <p className="text-center text-muted">Your project list is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>Project</th>
                <th>Description</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.title}</td>
                  <td>{entry.description}</td>
                  <td>{entry.is_published.toString()}</td>

                  <td>
                    <Link to={`/edit/${entry.id}`} className="btn btn-secondary">
                      Edit
                    </Link>
                  </td>

                  <td>
                    <Link to={`/project/${entry.id}/locations`} className="btn btn-secondary">
                      View Locations
                    </Link>
                  </td>

                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(entry.id, index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
