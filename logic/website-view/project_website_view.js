// Function to fetch projects from JSON file
async function fetchProjects() {
    try {
        const response = await fetch("/projects.json"); 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return []; 
    }
}

// Function to update project details
async function updateProject(index) {
    const projects = await fetchProjects();
    if (index >= 0 && index < projects.length) {
        const project = projects[index];
        document.getElementById('projectTitle').innerText = project.title;
        document.getElementById('projectDescription').innerText = project.description;
        document.getElementById('projectTechnologies').innerText = `Technologies Used: ${project.technologies.join(', ')}`;
        document.getElementById('projectImage').src = project.image;
        document.getElementById('projectVideo').src = project.video;
        document.getElementById('projectLink').href = project.link;
    } else {
        console.error('Invalid project index');
    }
}

// Get the project index from the query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectIndex = parseInt(urlParams.get('index'));

// Update project details on page load
window.onload = () => {
    updateProject(projectIndex);
};
