class Item {
    static item_list = document.getElementById("item-list");

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
        let clone = template.cloneNode(true);

        clone.querySelectorAll('.ref1')[0].id = "item-heading-" + id;
        clone.querySelectorAll('.ref2')[0].setAttribute("data-bs-target", "#item-collapse-" + id);
        clone.querySelectorAll('.ref2')[0].setAttribute("aria-controls", "#item-collapse-" + id);
        clone.querySelectorAll('.ref3')[0].id = "item-collapse-" + id;
        clone.querySelectorAll('.ref3')[0].setAttribute("aria-labelledby", "item-heading-" + id)

        clone.querySelectorAll('.item-id')[0].value = this.id;
        clone.querySelectorAll('.item-name')[0].value = this.name;
        clone.querySelectorAll('.item-quantity')[0].value = this.quantity;
        clone.querySelectorAll('.item-description')[0].value = this.description;
        clone.querySelectorAll('.item-notes')[0].value = this.notes;

        return clone;
    }

    display() {
        let dom = this.to_dom();
        Item.item_list.append(dom);
    }

}

function reset_item_form() {
    let item_form = document.getElementById("mew-item-form");
    item_form.reset();
}

function submit_item() {
    console.log("Hi");
    reset_item_form();
}



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

function display_error(error) {
    alert("Not Implemented\n\n" + error);
}


let tmp1 = window.location.href.split('/');
let tmp2 = tmp1[tmp1.length-1];
const project_id = Number(tmp2);

const xhr = new XMLHttpRequest();

xhr.onload = function() {
    if (xhr.status === 200) {
        let users = JSON.parse(xhr.responseText);
        display_users(users);
    } else if (xhr.status === 404) {
        display_no_users_found();
    }
}

xhr.onerror = function() {
    alert("Network error occurred");
}

xhr.open('GET', `/api/project/users/${project_id}`);
// xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();
