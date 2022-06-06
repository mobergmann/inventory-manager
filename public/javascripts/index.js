function sign_in() {
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

function sign_up() {
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

    xhr.open('POST', "/auth/projects");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function sign_out() {
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
