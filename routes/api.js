const express = require('express');
const router = express.Router();
const DbInterface = require("../scripts/DbInterface");


//#region user

/**
 * get user
 */
router.get('/user/full/:id', function (req, res, next) {
    // todo is admin or is same user

    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let user = DbInterface.get_user(id);
    if (user === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(user));
    }
});

/**
 * get (stripped version of) user
 */
router.get('/user/:id', function (req, res, next) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let user = DbInterface.get_user(id);
    if (user === undefined) {
        return res.status(404).end();
    }
    else {
        let stripped_user = {id: user.id, name: user.name};
        return res.status(200).end(JSON.stringify(stripped_user));
    }
});

/**
 * new user
 */
router.post('/user/:id', function (req, res, next) {
    // todo is admin
    return res.status(501).end("This Route is not Implemented");
});

/**
 * edit user
 */
router.put('/user/:id', function (req, res, next) {
    // todo is admin or same user
    return res.status(501).end("This Route is not Implemented");
});

/**
 * delete user
 */
router.delete('/user/:id', function (req, res, next) {
    // todo is admin or same user
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region project

/**
 * get project
 */
router.get('/project/:id', function (req, res, next) {
    // todo is user part of project

    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let project = DbInterface.get_project(id);
    if (project === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(project));
    }
});

/**
 * get all projects, available for user
 */
router.get('/project/all/:user_id', function (req, res, next) {
    let user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
        res.status(404).send();
    }

    let projects = DbInterface.get_all_projects_by_user(user_id);
    return res.status(200).end(JSON.stringify(projects));
});

router.post('/project/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.put('/project/:id', function (req, res, next) {
    // todo is gamemaster of project
    return res.status(501).end("This Route is not Implemented");
});

router.delete('/project/:id', function (req, res, next) {
    // todo is gamemaster of project
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region inventory

// get inventory
router.get('/inventory/:id', function (req, res, next) {
    // todo is gamemaster or player of inventory
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let inventory = DbInterface.get_inventory(id);
    if (inventory === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(inventory));
    }
});

// get all inventories, owned by user
router.get('/inventory/all/:user_id', function (req, res, next) {
    let user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
        res.status(404).send();
    }

    let inventories = DbInterface.get_all_boards(user_id);
    return res.status(200).end(JSON.stringify(inventories));
});

// new inventory
router.post('/inventory/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// edit inventory
router.put('/inventory/:id', function (req, res, next) {
    // todo is
    return res.status(501).end("This Route is not Implemented");
});

// delete inventory
router.delete('/inventory/:id', function (req, res, next) {
    // todo is gamemaster
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region item

// get item
router.get('/item/:id', function (req, res, next) {
    // todo hash access to project
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let item = DbInterface.get_item(id);
    if (item === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(item));
    }
});

// get all items owned by inventory
router.get('/item/all/:board_id', function (req, res, next) {
    let board_id = Number(req.params.board_id);
    if (isNaN(board_id)) {
        res.status(404).send();
    }

    let items = DbInterface.get_all_items(board_id);
    return res.status(200).end(JSON.stringify(items));
});

// new item
router.post('/item/:id', function (req, res, next) {
    // todo is gm or is owner of inventory
    return res.status(501).end("This Route is not Implemented");
});

// edit item
router.put('/item/:id', function (req, res, next) {
    // todo is gm or is owner of inventory
    return res.status(501).end("This Route is not Implemented");
});

// delete id
router.delete('/item/:id', function (req, res, next) {
    // todo is gm or is owner of inventory
    return res.status(501).end("This Route is not Implemented");
});

//#endregion

module.exports = router;
