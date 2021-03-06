const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const DbInterface = require("../scripts/DbInterface");
const bcrypt = require("bcrypt");


const user_validation = [
    // body("id").isInt({min: 1}),
    body("name").isLength({min: 3}),
    body("mail").isEmail(),
    body("pw_hash").notEmpty(),
    body("registration_date").isDate({format: "%Y-%m-%d %H:%M:%S"})
];
const project_validation = [
    // body("id").isInt({min: 1}),
    body("name").isLength({min: 3}),
    body("gamemaster").isInt({min: 1})
];
const item_validation = [
    // body("id").isInt({min: 1}),
    body("name").notEmpty(),
    body("quantity").isDecimal(),
    // body("description").,
    // body("notes").,
    body("board").isInt({min: 1})
];
const inventory_validation = [
    body("money").isInt(),
    body("user").isInt({min: 1})
];


//#region GET

/**
 * get all projects visible to the given user
 */
router.get("/users/:project_id", function (req, res, next) {
    let project_id = Number(req.params.project_id);
    if (isNaN(project_id)) {
        res.status(404).send();
    }

    let users = DbInterface.get_users(project_id);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(users));
});

/**
 * get a project
 */
router.get("/project/:project_id", function (req, res, next) {
    let project_id = Number(req.params.project_id);
    if (isNaN(project_id)) {
        res.status(404).send();
    }

    let project = DbInterface.get_project(project_id);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(project));
});

/**
 * get all projects visible to the given user
 */
router.get("/projects", function (req, res, next) {
    let user_id = req.user.id;

    let projects = DbInterface.get_projects(user_id);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(projects));
});

/**
 * Get all users in a project
 */
router.get("/project/users/:project_id", function (req, res, next) {
    let project_id = Number(req.params.project_id);
    if (isNaN(project_id)) {
        res.status(404).send();
    }

    let users = DbInterface.get_users(project_id);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(users));
});

/**
 * Get inventories joined with users, of a certain project
 */
router.get("/inventories/:project_id", function (req, res, next) {
    let project_id = Number(req.params.project_id);
    if (isNaN(project_id)) {
        res.status(404).send();
    }

    let inventories = DbInterface.get_inventories(project_id);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(inventories));
});

// /**
//  * Get inventories joined with users, of a certain project
//  */
// router.get("/user/inventory/:inventory_id", function (req, res, next) {
//     let inventory_id = Number(req.params.inventory_id);
//     if (isNaN(inventory_id)) {
//         res.status(404).send();
//     }
//
//     let user = DbInterface.get_user_by_inventory(inventory_id);
//     res.setHeader('Content-Type', 'application/json');
//     return res.status(200).end(JSON.stringify(user));
// });

/**
 * Get inventory
 */
router.get("/inventory/:inventory_id", function (req, res, next) {
    let inventory_id = Number(req.params.inventory_id);
    if (isNaN(inventory_id)) {
        res.status(404).send();
    }

    let inventory = DbInterface.get_inventory(inventory_id);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(inventory));
});

/**
 * Get all items in inventory
 */
router.get("/inventory/items/:inventory_id", function (req, res, next) {
    let inventory_id = Number(req.params.inventory_id);
    if (isNaN(inventory_id)) {
        res.status(404).send();
    }

    let items = DbInterface.get_items(inventory_id);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(items));
});

//#endregion


//#region POST

// user post is in app.js

/**
 * inserts a new project into the database and returns the inserted project
 */
router.post("/project", project_validation, function (req, res, next) {
    let user_id = req.user.id;

    let project = {
        name: req.body.name,
        gamemaster: user_id
    };

    let _project = DbInterface.new_project(project);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(_project));
});

/**
 * inserts a new inventory into the database and returns the inserted inventory
 */
router.post("/inventory", inventory_validation, function (req, res, next) {
    let inventory = {
        money: req.body.money,
        project: req.body.project
    };
    let owner = req.body.user;

    let _inventory = DbInterface.new_inventory(inventory, owner);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(_inventory));
});

/**
 * inserts a new item into the database and returns the inserted item
 */
router.post("/item", item_validation, function (req, res, next) {
    let item = {
        name: req.body.name,
        quantity: req.body.quantity,
        description: req.body.description,
        notes: req.body.notes,
        inventory: req.body.inventory
    };

    let _item = DbInterface.new_item(item);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(_item));
});

//#endregion


//#region PUT

router.put("/money/:inventory_id", body("money").isInt(), function (req, res, next) {
    let inventory_id = Number(req.params.inventory_id);
    if (isNaN(inventory_id)) {
        res.status(404).send();
    }

    let money = req.body.money;
    DbInterface.add_money(inventory_id, money);
    res.status(200).send();
});

//#endregion


//#region DELETE

router.delete("/item/:item_id", function (req, res, next) {
    let item_id = Number(req.params.item_id);
    if (isNaN(item_id)) {
        res.status(404).send();
    }

    DbInterface.delete_item(item_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(item_id));
});

router.delete("/inventory/:inventory_id", function (req, res, next) {
    let inventory_id = Number(req.params.inventory_id);
    if (isNaN(inventory_id)) {
        res.status(404).send();
    }

    DbInterface.delete_inventory(inventory_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(inventory_id));
});

router.delete("/project/:project_id", function (req, res, next) {
    let project_id = Number(req.params.project_id);
    if (isNaN(project_id)) {
        res.status(404).send();
    }

    DbInterface.delete_project(project_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(project_id));
});

// router.delete("/user/:user_id", function (req, res, next) {
//     let user_id = Number(req.params.user_id);
//     if (isNaN(user_id)) {
//         res.status(404).send();
//     }
//
//     DbInterface.delete_user(user_id);
//
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).send(JSON.stringify(user_id));
// });

//#endregion

module.exports = router;
