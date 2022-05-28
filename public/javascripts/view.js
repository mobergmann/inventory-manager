const item_list = document.getElementById("item-list");


class Item {

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

}

function display_item(item) {
    let dom = item.to_dom();
    item_list.append(dom);
}
