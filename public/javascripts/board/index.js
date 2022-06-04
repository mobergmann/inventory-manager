const my_id = 1;

function display_no_projects_found() {
    alert("Not Implemented");
}

function display_project(project) {
    const template = document.getElementById("project-template");
    let clone = template.content.cloneNode(true);

    clone.querySelectorAll(".project-name")[0].value = project.name;
    clone.querySelectorAll(".project-link")[0].href = "/board/view/" + project.id;

    const projects_list = document.getElementById("projects-list");
    projects_list.append(clone);
}

function display_projects(projects) {
    projects.forEach(project => {
        display_project(project);
    });
}

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}


///////////////////////////////////////////////////////
// Get Projects

const xhr1 = new XMLHttpRequest();

xhr1.onload = function() {
    if (xhr1.status === 200) {
        let project = JSON.parse(xhr1.responseText);
        display_projects(project);
    } else if (xhr1.status === 404) {
        display_no_projects_found();
    }
}

xhr1.onerror = function() {
    alert("Network error occurred");
}

xhr1.open('GET', `/api/projects/${my_id}`);
// xhr.setRequestHeader("Content-Type", "application/json");
xhr1.send();



///////////////////////////////////////////////////////
// New Projects

function submit_item() {
    const xhr2 = new XMLHttpRequest();

    xhr2.onload = function() {
        if (xhr2.status === 200) {
            let projects = JSON.parse(xhr2.responseText);
            display_project(projects);
        } else if (xhr2.status === 404) {
            display_no_projects_found();
        }
    }

    xhr2.onerror = function() {
        alert("Network error occurred");
    }

    xhr2.open('POST', `/api/project`);
    xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr2.send(JSON.stringify({name: document.getElementById("new-name").value}));
}
