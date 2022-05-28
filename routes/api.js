const express = require('express');
const router = express.Router();
const DbInterface = require("../scripts/DbInterface");


//#region user

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
        return res.status(200).end(JSON.stringify(user));
    }
});

router.post('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.put('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.delete('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region board

router.get('/board/:id', function (req, res, next) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send();
    }

    let board = DbInterface.get_board(id);
    if (board === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(board));
    }
});

router.get('/board/all/:user_id', function (req, res, next) {
    let user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
        res.status(404).send();
    }

    let boards = DbInterface.get_all_boards(user_id);
    if (boards === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(boards));
    }
});

router.post('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.put('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.delete('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region item

router.get('/item/:id', function (req, res, next) {
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

router.get('/item/all/:user_id', function (req, res, next) {
    let user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
        res.status(404).send();
    }

    let items = DbInterface.get_all_items(user_id);
    if (items === undefined) {
        return res.status(404).end();
    }
    else {
        return res.status(200).end(JSON.stringify(items));
    }
});

router.post('/item/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.put('/item/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

router.delete('/item/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


module.exports = router;
