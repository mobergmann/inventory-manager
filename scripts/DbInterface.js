const sqlite = require("better-sqlite3");
const User = require("./models/User");
const Board = require("./models/Board");
const Item = require("./models/Item");

const dbName = "database.db";


class DbInterface {

    static create_db() {
        const db = new sqlite(dbName);

        const user_table = `
            CREATE TABLE "users" (
                "id" INTEGER NOT NULL UNIQUE,
                "name" TEXT NOT NULL UNIQUE,
                "mail" TEXT NOT NULL UNIQUE,
                "pw_hash" TEXT,
                "registration_date" TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`;

        const item_table = `
            CREATE TABLE "items" (
                "id" INTEGER NOT NULL UNIQUE,
                "name" TEXT NOT NULL UNIQUE,
                "quantity" INTEGER NOT NULL,
                "description" TEXT NOT NULL,
                "notes" TEXT NOT NULL,
                "board" INTEGER NOT NULL,
                FOREIGN KEY("board") REFERENCES "boards"("id"),
                PRIMARY KEY("id")
            );`;

        const board_table = `
            CREATE TABLE "boards" (
                "id" INTEGER NOT NULL UNIQUE,
                "name" TEXT NOT NULL,
                "owner" INTEGER NOT NULL,
                "gamemaster" INTEGER NOT NULL,
                FOREIGN KEY("gamemaster") REFERENCES "users"("id"),
                FOREIGN KEY("owner") REFERENCES "users"("id"),
                PRIMARY KEY("id" AUTOINCREMENT)
        );`;


        db.exec(user_table);
        db.exec(board_table);
        db.exec(item_table);
    }


    //#region user

    static get_user(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        return User(row.id, row.name, row.mail, row.pw_hash, row.registration_date);
    }

    static new_user(user) {
        // todo
        throw "NotImplementedError";
    }

    static edit_user(user) {
        // todo
        throw "NotImplementedError";
    }

    static delete_user(user) {
        // todo
        throw "NotImplementedError";
    }

    //#endregion


    //#region board

    static get_board(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        let owner = DbInterface.get_user(row.owner);
        let gamemaster = DbInterface.get_user(row.gamemaster);

        return Board(row.id, row.name, owner, gamemaster);
    }

    static get_all_boards(user_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare('SELECT * FROM boards WHERE owner = ?').all(user_id);
        if (!rows.length) {
            return undefined;
        }

        let boards = [];
        rows.forEach(row => {
            let owner = DbInterface.get_user(row.owner);
            let gamemaster = DbInterface.get_user(row.gamemaster);

            let board = Board(row.id, row.name, owner, gamemaster);
            boards.push(board);
        });

        return boards;
    }

    static new_board(board) {
        // todo
        throw "NotImplementedError";
    }

    static edit_board(board) {
        // todo
        throw "NotImplementedError";
    }

    static delete_board(board) {
        // todo
        throw "NotImplementedError";
    }

    //#endregion


    //#region item

    static get_item(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        let board = DbInterface.get_board(row.board);
        return Item(row.id, row.name, row.quantity, row.description, row.notes, board);
    }

    static get_all_items(user_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare('SELECT * FROM items WHERE id = ?').all(user_id);
        if (!rows.length) {
            return undefined;
        }

        let items = [];
        rows.forEach(row => {
            let board = DbInterface.get_board(row.board);
            items.push(Item(row.id, row.name, row.quantity, row.description, row.notes, board));
        });

        return items;
    }

    static new_item(item) {
        // todo
        throw "NotImplementedError";
    }

    static edit_item(item) {
        // todo
        throw "NotImplementedError";
    }

    static delete_item(item) {
        // todo
        throw "NotImplementedError";
    }

    //#endregion

}

module.exports = DbInterface;
