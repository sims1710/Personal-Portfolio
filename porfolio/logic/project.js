// Function to update project details
async function updateProject(index) {
    try {
        const projects = await fetchProjects();
        const project = projects[index];

        if (!project) {
            throw new Error('Invalid project index or project not found');
        }

        document.title = `Project: ${project.title}`;

        const projectTitleElement = document.querySelector('.window-header-title');
        if (projectTitleElement) {
            projectTitleElement.textContent = `Project: ${project.title}`;
        } else {
            console.error('Project title element not found');
        }

        document.getElementById('projectTitle').innerText = project.title;
        document.getElementById('projectDescription').innerText = project.monitordescription;

        const projectImageElement = document.querySelector('.project-img');
        const technologiesContainer = document.getElementById('technologiesContainer');
        technologiesContainer.innerHTML = '';

        if (projectImageElement) {
            projectImageElement.style.backgroundImage = `url(${project.image})`;
        } else {
            console.error('Project image element not found');
        }

        const techStackElement = document.querySelector('.tech-stack');
        const projectTitleContainer = document.querySelector('.project-title');

        if (techStackElement && projectTitleContainer) {
            const titleStyles = window.getComputedStyle(projectTitleContainer);
            const titleMaxHeight = titleStyles.getPropertyValue('max-height');
            
            // Check if max-height is greater than 3.2vh
            if (titleMaxHeight && parseFloat(titleMaxHeight) > 3.2 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
                const currentMarginTop = parseFloat(window.getComputedStyle(techStackElement).marginTop);
                const newMarginTop = currentMarginTop - 3 * parseFloat(getComputedStyle(document.documentElement).fontSize);
                techStackElement.style.marginTop = `${newMarginTop}px`;
            }
        } else {
            console.error('Tech stack element or project title container not found');
        }

        project.technologies.forEach(tech => {
            const techBox = document.createElement('div');
            techBox.classList.add('tech-box');
            techBox.textContent = tech;
            technologiesContainer.appendChild(techBox);
        });

        document.getElementById('projectLink').href = project.link;

    } catch (error) {
        console.error('Error updating project details:', error);
    }
}

// Function to fetch projects from JSON file
async function fetchProjects() {
    try {
        const response = await fetch("/projects.json");
        if (!response.ok) {
            throw new Error('Failed to fetch JSON');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
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
