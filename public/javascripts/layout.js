// #region logout

function _sign_out() {
    document.cookie = "connect.sid=; expires=passedDate";
    // on success redirect to home page
    window.location.replace("/");
}

function logout() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            _sign_out();
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('GET', "/auth/sign_out");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

}

// #endregion