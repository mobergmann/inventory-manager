function extract_new_user() {
    let name = document.getElementById("sign-up_username").value;
    let mail = document.getElementById("sign-up_mail").value;
    let password = document.getElementById("sign-up_password").value;

    return {
        name: name,
        mail: mail,
        password: password
    };
}

function extract_user() {
    let name = document.getElementById("sign-in_username").value;
    let password = document.getElementById("sign-in_password").value;

    return {
        name: name,
        password: password
    };
}


function sign_in() {
    window.location.replace("/board");
}

function sign_up() {
    alert("Sign Up successfully, now you need to Sign In.");
}


function _sign_in() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            sign_in();
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function() {
        alert("Network error occurred");
    }

    xhr.open('POST', "/auth/sign_in");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(extract_user()));
}

function _sign_up() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            sign_up();
        } else if (xhr.status === 404) {
            alert("404");
        }
        else {
            console.log(xhr.status);
        }

    }

    xhr.onerror = function() {
        alert("Network error occurred");
    }

    xhr.open('POST', "/auth/sign_up");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(extract_new_user()));
}
