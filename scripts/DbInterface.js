const sqlite = require("better-sqlite3");
const User = require("./models/User");
const Board = require("./models/Board");
const Item = require("./models/Item");
const Project = require("./models/Project");

const dbName = "database.db";


class DbInterface {

    // todo out of date
    // static create_db() {
    //     const db = new sqlite(dbName);
    //
    //     const user_table = `
    //         CREATE TABLE "users" (
    //             "id" INTEGER NOT NULL UNIQUE,
    //             "name" TEXT NOT NULL UNIQUE,
    //             "mail" TEXT NOT NULL UNIQUE,
    //             "pw_hash" TEXT,
    //             "registration_date" TEXT NOT NULL,
    //             PRIMARY KEY("id" AUTOINCREMENT)
    //         );`;
    //
    //     const item_table = `
    //         CREATE TABLE "items" (
    //             "id" INTEGER NOT NULL UNIQUE,
    //             "name" TEXT NOT NULL UNIQUE,
    //             "quantity" INTEGER NOT NULL,
    //             "description" TEXT NOT NULL,
    //             "notes" TEXT NOT NULL,
    //             "board" INTEGER NOT NULL,
    //             FOREIGN KEY("board") REFERENCES "boards"("id"),
    //             PRIMARY KEY("id")
    //         );`;
    //
    //     const board_table = `
    //         CREATE TABLE "boards" (
    //             "id" INTEGER NOT NULL UNIQUE,
    //             "name" TEXT NOT NULL,
    //             "money" INTEGER NOT NULL,
    //             "owner" INTEGER NOT NULL,
    //             "gamemaster" INTEGER NOT NULL,
    //             FOREIGN KEY("gamemaster") REFERENCES "users"("id"),
    //             FOREIGN KEY("owner") REFERENCES "users"("id")
    //         );`;
    //
    //
    //     db.exec(user_table);
    //     db.exec(board_table);
    //     db.exec(item_table);
    // }


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


    //#region project

    /**
     * Gets a project form the database, by a given id
     * @param id id of the project
     * @returns {Project|undefined} undefined if no project was found, object, if a project was found,
     */
    static get_project(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        return new Project(row.id, row.name);
    }

    /**
     * Gets all project, owned by a user
     * @param user_id id of the user
     * @returns {*[project]|undefined} list of projects, undefined if no project found
     */
    static get_all_projects_by_user(user_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare('SELECT * FROM players WHERE user = ?').all(user_id);

        let projects = [];
        rows.forEach(row => {
            let project_id = row.project;

            let project = DbInterface.get_project(project_id);
            projects.push(project);
        });

        return projects;
    }

    /**
     * Gets all project, owned by a user
     * @param project_id id of the user
     * @returns {*[project]|undefined} list of projects, undefined if no project found
     */
    static get_all_user_by_project(project_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare('SELECT * FROM players WHERE project = ?').all(project_id);

        let projects = [];
        rows.forEach(row => {
            projects.push(new Project(row.id, row.name));
        });

        return projects;
    }

    /**
     * Inserts a given project into the database
     * @param project project object (ignoring the id filed)
     * @returns {int} id of the inserted project
     */
    static new_project(project) {
        const db = new sqlite(dbName);

        const stmt = db.prepare('INSERT INTO projects (name) VALUES (?)');
        const info = stmt.run(project.name);

        return info.lastInsertRowid;
    }

    static edit_project(project) {
        // todo
        throw "NotImplementedError";
    }

    static delete_project(project) {
        // todo
        throw "NotImplementedError";
    }

    //#endregion


    //#region board

    /**
     * Gets a board form the database, by a given id
     * @param id id of the board
     * @returns {Board|undefined} A board object, if a board was found, undefined otherwise
     */
    static get_board(id) {
        const db = new sqlite(dbName);

        const row = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
        if (row === undefined) {
            return undefined;
        }

        let project = DbInterface.get_project(row.project);

        return new Board(row.id, row.name, row.money, project);
    }

    /**
     * Inserts a given board into the database
     * @param board board object (ignoring the id filed)
     * @returns {int} id of the inserted board
     */
    static new_board(board) {
        const db = new sqlite(dbName);

        const stmt = db.prepare('INSERT INTO boards (name, money, project) VALUES (?, ?, ?)');
        const info = stmt.run(board.name, board.money, board.project);

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
        const stmt = db.prepare('INSERT INTO items (name, quantity, description, notes, board) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(item.name, item.quantity, item.description, item.notes, item.board);

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


    //#region players

    /**
     * Adds players with a certain role to a project.
     * The players and roles list need to be symmetrical. This means that roles[i] references the player[i].
     * @param project id of the project
     * @param players list of player ids (needs to be symmetrical to the roles list)
     * @param roles list of roles (needs to be symmetrical to the players list)
     */
    static add_players_to_project(project, players, roles) {
        if (players.length !== roles.length) {
            throw "players list and roles list length not equal";
        }

        const db = new sqlite(dbName);
        const insert = db.prepare('INSERT INTO players (project, user, role) VALUES (@project, @player, @user)');

        const insertMany = db.transaction((list) => {
            for (const i of list) insert.run(i);
        });

        // construct insertion list
        let dual_list = [];
        for (let i = 0; i < players.length; ++i) {
            dual_list[i] = {project, player: players[i], role: roles[i]};
        }

        insertMany(dual_list);
    }

    /**
     * Removes a player for the database
     * @param project id of the project
     * @param user id of the user
     */
    static remove_user_from_project(project, user) {
        const db = new sqlite(dbName);

        const stmt = db.prepare(' DELETE FROM players WHERE project = ? AND user = ?');
        const info = stmt.run(project, user);
    }

    //#endregion

}

module.exports = DbInterface;
