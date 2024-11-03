// import fetch from "node-fetch";

// Base URL for the Storypath RESTful API
const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api";

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NTg0MzcifQ.tVZg4IB7r-pOTjJRhopZfnbSnjpmFSenuYaM9SAEY_A";

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = "s4758437";

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
export async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      "Content-Type": "application/json", // Indicate that we are sending JSON data
      Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === "POST" || method === "PATCH" || method === "DELETE") {
    options.headers["Prefer"] = "return=representation";
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Make the API request and check if the response is OK
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return the response as a JSON object
  return response.json();
}

/**
 * Function to insert a new project into the database.
 *
 * @param {object} project - The project data to insert.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
export async function createProject(project) {
  return apiRequest("/project", "POST", project);
}

export async function createLocation(location) {
  return apiRequest("/location", "POST", location);
}

/**
 * Function to list all projects associated with the current user.
 *
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getProjects() {
  return apiRequest("/project");
}

export async function getLocations() {
  return apiRequest("/location");
}

/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

export async function getLocation(id) {
  return apiRequest(`/location?id=eq.${id}`);
}

// Function to delete a project by ID
export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, "DELETE");
}

export async function deleteLocation(id) {
  return apiRequest(`/location?id=eq.${id}`, "DELETE");
}

export async function updateProject(id, project) {
  return apiRequest(`/project?id=eq.${id}`, "PATCH", project);
}

export async function updateLocation(id, project) {
  return apiRequest(`/location?id=eq.${id}`, "PATCH", project);
}

export async function getLocationsByProjectId(projectId) {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

/**
 * Main function to demonstrate API usage.
 *
 * Creates a new project, lists all projects, and retrieves a single project by ID.
 */
async function main() {
  try {
    // Create a new project with specific details
    const newProject = {
      title: "My first Tour",
      description: "Description ....",
      instructions: "Follow these instructions",
      initial_clue: "First clue",
      homescreen_display: "Display initial clue",
      is_published: false, // The project is not published initially
      participant_scoring: "Not Scored", // Scoring method for participants
    };
    const createdProject = await createProject(newProject);
    console.log("Created Project:", createdProject);

    // Retrieve and list all projects associated with the current user
    const allProjects = await getProjects();
    console.log("All Projects:", allProjects);

    // If there are projects, retrieve the first one by its ID
    if (allProjects.length > 0) {
      const singleProject = await getProject(allProjects[0].id);
      console.log("Single Project:", singleProject);
    }

    // Further functionality for other endpoints like /location can be added here...
  } catch (error) {
    console.error("Error:", error.message); // Log any errors that occur
  }
}

// Execute the main function
//main();
