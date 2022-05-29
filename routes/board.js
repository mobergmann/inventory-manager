const express = require('express');
const router = express.Router();

function is_gm() {
    return false;
}

router.get('/', function (req, res, next) {
    res.render('board/index', {title: 'Board'});
});

router.get('/view/:id', function (req, res, next) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).send("Not found.");
    }


    let data = {
        id: id,
        name: "Müllnir",
        quantity: 12,
        description: "This is a description for this demo item...",
        notes: "These are the notes for this demo item..."
    };

    if (is_gm(id)) {
        res.render('board/view/gm', {title: 'Board', data: data});
    } else {
        res.render('board/view/player', {title: 'Board', data: data});
    }
});

module.exports = router;