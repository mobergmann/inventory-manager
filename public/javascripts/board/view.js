//#region
//#endregion


//#region Global Values

let tmp1 = window.location.href.split('/');
let tmp2 = tmp1[tmp1.length - 1];
const project_id = Number(tmp2);

const inventory_id = Number(1);

//#endregion


//#region Helper Functions

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}

//#endregion


//#region Inventory

//#region GET

function display_user(user) {
    const players_list = document.getElementById("players-list");

    let tmp = `
        <ul class="list-group">
            <li class="list-group-item">
                ${user.name}
                <div class="kick btn btn-outline-danger">
                    <span class="material-icons">cancel</span>
                </div>
                <!-- div.view(class="btn btn-outline-dark")-->
                <!--     <span class="material-icons">visibility</span>-->
                <!-- div.view(class="btn btn-outline-dark")-->
                <!--     <span class="material-icons">visibility_off</span>-->
            </li>
        </ul>`;

    players_list.innerHTML += tmp;
}

function display_users(players) {
    document.getElementById("players-list").innerHTML = "";

    players.forEach(player => {
        display_user(player);
    });
}

function load_users() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let users = JSON.parse(xhr.responseText);
            display_users(users);
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('GET', `/api/project/users/${project_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

//#endregion

//#region POST

function submit_inventory() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let inventory = JSON.parse(xhr.responseText);
            load_users();
        } else if (xhr.status === 404) {
            display_error();
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('POST', `/api/inventory`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
            money: 0,
            project: 1, // todo get project id
            user: parseInt(document.getElementById('new-inventory-for-user').value)
        }
    ));
}

//#endregion

//#endregion


//#region Item

class Item {
    static item_list = document.getElementById("items-list");

    constructor(id, name, quantity, description, notes) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        this.notes = notes;
    }

    static from_dom(item_id) {
        let item = new Item();

        const dom = document.getElementById(item_id);

        // get text attributes of the product contained by the card
        item.id = parseInt(dom.querySelectorAll('.item-id')[0].value);
        item.name = dom.querySelectorAll('.item-name')[0].value;
        item.quantity = parseInt(dom.querySelectorAll('.item-quantity')[0].value);
        item.description = dom.querySelectorAll('.item-description')[0].value;
        item.notes = dom.querySelectorAll('.item-notes')[0].value;

        return item;
    }

    to_dom() {
        const template = document.getElementById("item-template");
        let clone = template.content.cloneNode(true);

        clone.childNodes[0].id = "item-" + this.id;

        clone.querySelectorAll('.ref1')[0].id = "item-heading-" + this.id;
        clone.querySelectorAll('.ref2')[0].setAttribute("data-bs-target", "#item-collapse-" + this.id);
        clone.querySelectorAll('.ref2')[0].setAttribute("aria-controls", "#item-collapse-" + this.id);
        clone.querySelectorAll('.ref3')[0].id = "item-collapse-" + this.id;
        clone.querySelectorAll('.ref3')[0].setAttribute("aria-labelledby", "item-heading-" + this.id)

        clone.querySelectorAll('.item-id')[0].innerHTML = this.id;
        clone.querySelectorAll('.item-name')[0].innerHTML = this.name;
        clone.querySelectorAll('.item-quantity')[0].innerHTML = this.quantity;
        clone.querySelectorAll('.item-description')[0].innerHTML = this.description;
        clone.querySelectorAll('.item-notes')[0].innerHTML = this.notes;

        clone.querySelectorAll('.item-delete')[0].setAttribute("itemid", this.id);

        return clone;
    }

    display() {
        let dom = this.to_dom();
        Item.item_list.append(dom);
    }

}

//#region GET

function display_items(items) {
    items.forEach(item => {
        let i = new Item(item.id, item.name, item.quantity, item.description, item.notes);
        i.display();
    });
}

function load_items() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let items = JSON.parse(xhr.responseText);
            display_items(items);
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('GET', `/api/inventory/items/${inventory_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

//#endregion

//#region POST

function reset_item_form() {
    let item_form = document.getElementById("mew-item-form");
    item_form.reset();
}

function submit_item() {
    let item = {
        name: document.getElementById("new-item-name").value,
        quantity: Number(document.getElementById("new-item-quantity").value),
        description: document.getElementById("new-item-description").value,
        notes: document.getElementById("new-item-notes").value,
        inventory: inventory_id
    }

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let item = JSON.parse(xhr.responseText);
            let i = new Item(item.id, item.name, item.quantity, item.description, item.notes);
            i.display();
            reset_item_form();
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('POST', `/api/item`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
}

//#endregion

//#region DELETE

function remove_item(item_id) {
    let elem = document.getElementById("item-" + item_id);
    elem.remove();
}

function delete_item(item_id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            // let item_id = JSON.parse(xhr.responseText);
            remove_item(item_id);
        } else if (xhr.status === 404) {
            alert("404")
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('DELETE', `/api/item/${item_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

//#endregion

//#endregion


//#region main

load_users();
load_items();

//#endregion
