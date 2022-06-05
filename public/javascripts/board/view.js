//#region
//#endregion


//#region Global Values

let tmp1 = window.location.href.split('/');
let tmp2 = tmp1[tmp1.length - 1];
const project_id = Number(tmp2);

let inventory_id; // = Number(2);

//#endregion


//#region Helper Functions

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}

//#endregion


//#region Inventory

function change_inv_stats() {
    //  money
    load_money(()=> {
        //  items
        load_items();
    });
}

function load_inventory(inventory_id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            change_inv_stats(response);
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    // xhr.open('GET', `/api/project/users/${project_id}`);
    xhr.open('GET', `/api/inventory/${inventory_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function change_inventory(_inventory_id) {
    inventory_id = _inventory_id;
    load_inventory(inventory_id);
}

//#region GET

function display_inventory(inventory, owner) {
    const template = document.getElementById("inventory-template");
    let clone = template.content.cloneNode(true);

    clone.childNodes[0].id = "inventory-" + inventory.id;

    clone.querySelectorAll(".inventory-name")[0].value = owner.name;
    clone.querySelectorAll(".inventory-remove-button")[0].setAttribute("inventoryid", inventory.id);
    clone.querySelectorAll(".inventory-view-button")[0].setAttribute("inventoryid", inventory.id);

    const players_list = document.getElementById("players-list");
    players_list.append(clone);
}

function display_inventories(response) {
    document.getElementById("players-list").innerHTML = "";

    response.forEach(r => {
        display_inventory(r.inventory, r.owner);
    });
}

function load_inventories(next = ()=>{}) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            // set default value for current inventory id
            if (response.length > 0) {
                inventory_id = response[0].inventory.id;
            }
            display_inventories(response);

            next();
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    // xhr.open('GET', `/api/project/users/${project_id}`);
    xhr.open('GET', `/api/inventories/${project_id}`);
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
            load_inventories();
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

//#region DELETE

function remove_inventory(inventory_id) {
    const elem = document.getElementById("inventory-" + inventory_id);
    elem.remove();
}

function delete_inventory(inventory_id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            remove_inventory(inventory_id);
        } else if (xhr.status === 404) {
            alert("404");
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('DELETE', `/api/inventory/${inventory_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
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
    const item_list = document.getElementById("items-list");
    item_list.innerHTML = "";

    items.forEach(item => {
        let i = new Item(item.id, item.name, item.quantity, item.description, item.notes);
        i.display();
    });
}

function load_items(next = ()=>{}) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let items = JSON.parse(xhr.responseText);
            display_items(items);

            next();
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


//#region Money

function display_money(money) {
    const elem = document.getElementById("money-out");
    elem.value = money;
}


function load_money(next = ()=>{}) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            let inventory = JSON.parse(xhr.responseText);
            display_money(inventory.money);

            next();
        } else if (xhr.status === 404) {
            alert("404");
        }
        else {
            console.log(xhr.status);
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('GET', `/api/inventory/${inventory_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}



function submit_money(is_negative) {
    let new_money = Number(document.getElementById("money-in").value);
    if (is_negative) {
        new_money *= -1;
    }

    let old_money = Number(document.getElementById("money-out").value);

    let money = old_money + new_money;

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            display_money(money);
        } else if (xhr.status === 404) {
            alert("404")
        }
    }

    xhr.onerror = function () {
        alert("Network error occurred");
    }

    xhr.open('PUT', `/api/money/${inventory_id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({money: new_money}));
}

//#endregion


//#region main

load_inventories(() => {
    load_items(() => {
        load_money();
    });
});

//#endregion
