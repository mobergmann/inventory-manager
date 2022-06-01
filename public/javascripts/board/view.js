function reset_item_form() {
    let item_form = document.getElementById("mew-item-form");
    item_form.reset();
}

function submit_item() {
    console.log("Hi");
    reset_item_form();
}



///////////////////////////////////////////////////////
// Global Values

let tmp1 = window.location.href.split('/');
let tmp2 = tmp1[tmp1.length-1];
const project_id = Number(tmp2);

const inventory_id = Number(4);


///////////////////////////////////////////////////////
// Helper Functions

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}


///////////////////////////////////////////////////////
// User List

function display_no_users_found() {
    alert("Not Implemented");
}

function display_users(players) {
    const players_list = document.getElementById("players-list");

    players.forEach(player => {
        let tmp = `
            <ul class="list-group">
                <li class="list-group-item">
                    ${player.name}
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
    });
}

const xhr1 = new XMLHttpRequest();

xhr1.onload = function() {
    if (xhr1.status === 200) {
        let users = JSON.parse(xhr1.responseText);
        display_users(users);
    } else if (xhr1.status === 404) {
        display_no_users_found();
    }
}

xhr1.onerror = function() {
    alert("Network error occurred");
}

xhr1.open('GET', `/api/project/users/${project_id}`);
xhr1.setRequestHeader("Content-Type", "application/json");
xhr1.send();



///////////////////////////////////////////////////////
// Item List

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

        return clone;
    }

    display() {
        let dom = this.to_dom();
        Item.item_list.append(dom);
    }

}

function display_no_items_found() {
    alert("Not Implemented");
}

function display_items(items) {
    items.forEach(item => {
        let i = new Item(item.id, item.name, item.quantity, item.description, item.notes);
        i.display();
    });
}


const xhr2 = new XMLHttpRequest();

xhr2.onload = function() {
    if (xhr2.status === 200) {
        let items = JSON.parse(xhr2.responseText);
        display_items(items);
    } else if (xhr2.status === 404) {
        display_no_items_found();
    }
}

xhr2.onerror = function() {
    alert("Network error occurred");
}

xhr2.open('GET', `/api/inventory/items/${inventory_id}`);
xhr2.setRequestHeader("Content-Type", "application/json");
xhr2.send();



///////////////////////////////////////////////////////
// Money

function add_money(subtract = false) {
    // todo lock money buttons

    let money_in = Number(document.getElementById("money-in").value);
    if (subtract) {
        money_in *= -1;
    }


    const xhr3 = new XMLHttpRequest();

    xhr3.onload = function() {
        if (xhr2.status === 200) {
            let inventory = JSON.parse(xhr2.responseText);

            const money_dom = document.getElementById("money-out");
            money_dom.value = inventory.money;
        } else if (xhr2.status === 404) {
            display_no_items_found();
        }
    }

    xhr3.onerror = function() {
        alert("Network error occurred");
    }

    xhr3.open('GET', `/api/item/all/${inventory_id}`);
    xhr3.setRequestHeader("Content-Type", "application/json");
    xhr3.send();
}
