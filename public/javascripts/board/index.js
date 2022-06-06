function display_no_projects_found() {
    alert("Not Implemented");
}

function display_project(project) {
    const template = document.getElementById("project-template");
    let clone = template.content.cloneNode(true);

    clone.childNodes[0].id = "project-" + project.id;

    clone.querySelectorAll(".project-name")[0].value = project.name;
    clone.querySelectorAll(".project-link")[0].href = "/board/view/" + project.id;
    clone.querySelectorAll(".inventory-remove-button")[0].setAttribute("projectid", project.id);

    const projects_list = document.getElementById("projects-list");
    projects_list.append(clone);
}

function display_projects(projects) {
    projects.forEach(project => {
        display_project(project);
    });
}

function load_projects() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            let project = JSON.parse(xhr.responseText);
            display_projects(project);
        } else if (xhr.status === 404) {
            display_no_projects_found();
        }
    }

    xhr.onerror = function() {
        alert("Network error occurred");
    }

    xhr.open('GET', "/api/projects");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

///////////////////////////////////////////////////////
// New Project

function submit_project() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            let projects = JSON.parse(xhr.responseText);
            display_project(projects);
        } else if (xhr.status === 404) {
            display_no_projects_found();
        }
    }

    xhr.onerror = function() {
        alert("Network error occurred");
    }

    xhr.open('POST', `/api/project`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({name: document.getElementById("new-name").value}));
}


///////////////////////////////////////////////////////
// Delete Project

function remove_project(project_id) {
    document.getElementById("project-" + project_id).remove();
}

function delete_project(project_id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            // let projects = JSON.parse(xhr.responseText);
            remove_project(project_id);
        } else if (xhr.status === 404) {
            display_no_projects_found();
        }
    }

    xhr.onerror = function() {
        alert("Network error occurred");
    }

    xhr.open('DELETE', `/api/project/${project_id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({name: document.getElementById("new-name").value}));
}


///////////////////////////////////////////////////////
// Main

load_projects();