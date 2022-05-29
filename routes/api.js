const express = require('express');
const router = express.Router();
const DbInterface = require("../scripts/DbInterface");


//#region user

// get user
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

// new user
router.post('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// edit user
router.put('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// delete user
router.delete('/user/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region board

// get board
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

// get all boards, owned by user
router.get('/board/all/:user_id', function (req, res, next) {
    let user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
        res.status(404).send();
    }

    let boards = DbInterface.get_all_boards(user_id);
    return res.status(200).end(JSON.stringify(boards));
});

// new board
router.post('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// edit board
router.put('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// delete board
router.delete('/board/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion


//#region item

// get item
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

// get all items owned by board
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
    return res.status(501).end("This Route is not Implemented");
});

// edit item
router.put('/item/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

// delete id
router.delete('/item/:id', function (req, res, next) {
    return res.status(501).end("This Route is not Implemented");
});

//#endregion

module.exports = router;
