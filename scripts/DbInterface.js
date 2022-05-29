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
                "money" INTEGER NOT NULL,
                "owner" INTEGER NOT NULL,
                "gamemaster" INTEGER NOT NULL,
                FOREIGN KEY("gamemaster") REFERENCES "users"("id"),
                FOREIGN KEY("owner") REFERENCES "users"("id")
            );`;


        db.exec(user_table);
        db.exec(board_table);
        db.exec(item_table);
    }


    //#region user

    /**
     * Gets a user form the database, by a given id
     * @param id id of the user
     * @returns {User|undefined} A user object, if a user was found, undefined otherwise
     */
    static get_user(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        return new User(row.id, row.name, row.mail, row.pw_hash, row.registration_date);
    }

    /**
     * Inserts a given user into the database
     * @param user user object (ignoring the id filed)
     * @returns {int} id of the inserted user
     */
    static new_user(user) {
        const db = new sqlite(dbName);
        const stmt = db.prepare('INSERT INTO users (name, mail, pw_hash, registration_date) VALUES (?, ?, ?, ?)');
        const info = stmt.run(user.name, user.mail, user.pw_hash, user.registration_date);

        return info.lastInsertRowid;
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

    /**
     * Gets a user form the database, by a given id
     * @param id id of the board
     * @returns {Board|undefined} A board object, if a board was found, undefined otherwise
     */
    static get_board(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        let owner = DbInterface.get_user(row.owner);
        let gamemaster = DbInterface.get_user(row.gamemaster);

        return new Board(row.id, row.name, row.money, owner, gamemaster);
    }

    /**
     * Gets all boards, owned by a user
     * @param user_id id of the user
     * @returns {*[User]|undefined} list of boards, undefined if no boards found
     */
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
            boards.push(new Board(row.id, row.name, row.money, owner, gamemaster));
        });

        return boards;
    }

    /**
     * Inserts a given board into the database
     * @param board board object (ignoring the id filed)
     * @returns {int} id of the inserted board
     */
    static new_board(board) {
        const db = new sqlite(dbName);
        const stmt = db.prepare('INSERT INTO boards (name, money, owner, gamemaster) VALUES (?, ?, ?, ?)');
        const info = stmt.run(board.name, board.money, board.owner, board.gamemaster);

        return info.lastInsertRowid;
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

    /**
     * Gets an item form the database, by a given id
     * @param id id of the item
     * @returns {Item|undefined} An item object, if an item was found, undefined otherwise
     */
    static get_item(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        let board = DbInterface.get_board(row.board);
        return new Item(row.id, row.name, row.quantity, row.description, row.notes, board);
    }

    /**
     * Gets all items, owned by a board
     * @param board_id id of the board
     * @returns {*[Board]|undefined} list of items, undefined if no items found
     */
    static get_all_items(board_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare('SELECT * FROM items WHERE board = ?').all(board_id);
        if (!rows.length) {
            return undefined;
        }

        let items = [];
        rows.forEach(row => {
            let board = DbInterface.get_board(row.board);
            items.push(new Item(row.id, row.name, row.quantity, row.description, row.notes, board));
        });

        return items;
    }

    /**
     * Inserts a given item into the database
     * @param item item object (ignoring the id filed)
     * @returns {int} id of the inserted item
     */
    static new_item(item) {
        const db = new sqlite(dbName);
        const stmt = db.prepare('INSERT INTO items (name, quantity, description, description, notes, board) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(item.name, item.quantity, item.description, item.description, item.notes, item.board);

        return info.lastInsertRowid;
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
