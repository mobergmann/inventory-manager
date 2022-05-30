const my_id = 1;

function display_no_projects_found() {
    alert("Not Implemented");
}

function display_projects(projects) {
    const projects_list = document.getElementById("projects-list");

    projects.forEach(project => {
        let d = `
            <a href="board/view/${project.id}">
                <li class="list-group-item">
                    <div class="name">${project.name}</div>
                    <div class="delete btn btn-outline-dark">
                        <span class="material-icons">delete</span></div>
                    <div class="edit btn btn-outline-dark">
                        <span class="material-icons">mode_edit</span>
                    </div>
                </li>
            </a>`;

        projects_list.innerHTML += d;
    });
}

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}



const xhr = new XMLHttpRequest();

xhr.onload = function() {
    if (xhr.status === 200) {
        let projects = JSON.parse(xhr.responseText);
        display_projects(projects);
    } else if (xhr.status === 404) {
        display_no_projects_found();
    }
}

xhr.onerror = function() {
    alert("Network error occurred");
}

xhr.open('GET', `/api/project/all/${my_id}`);
// xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();
