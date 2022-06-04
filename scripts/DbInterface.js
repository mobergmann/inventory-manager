const sqlite = require("better-sqlite3");
const User = require("./models/User");
const Board = require("./models/Board");
const Item = require("./models/Item");
const Project = require("./models/Project");

const dbName = "database.db";


class DbInterface {

    // // todo out of date
    // // static create_db() {
    // //     const db = new sqlite(dbName);
    // //
    // //     const user_table = `
    // //         CREATE TABLE "users" (
    // //             "id" INTEGER NOT NULL UNIQUE,
    // //             "name" TEXT NOT NULL UNIQUE,
    // //             "mail" TEXT NOT NULL UNIQUE,
    // //             "pw_hash" TEXT,
    // //             "registration_date" TEXT NOT NULL,
    // //             PRIMARY KEY("id" AUTOINCREMENT)
    // //         );`;
    // //
    // //     const item_table = `
    // //         CREATE TABLE "items" (
    // //             "id" INTEGER NOT NULL UNIQUE,
    // //             "name" TEXT NOT NULL UNIQUE,
    // //             "quantity" INTEGER NOT NULL,
    // //             "description" TEXT NOT NULL,
    // //             "notes" TEXT NOT NULL,
    // //             "board" INTEGER NOT NULL,
    // //             FOREIGN KEY("board") REFERENCES "boards"("id"),
    // //             PRIMARY KEY("id")
    // //         );`;
    // //
    // //     const board_table = `
    // //         CREATE TABLE "boards" (
    // //             "id" INTEGER NOT NULL UNIQUE,
    // //             "name" TEXT NOT NULL,
    // //             "money" INTEGER NOT NULL,
    // //             "owner" INTEGER NOT NULL,
    // //             "gamemaster" INTEGER NOT NULL,
    // //             FOREIGN KEY("gamemaster") REFERENCES "users"("id"),
    // //             FOREIGN KEY("owner") REFERENCES "users"("id")
    // //         );`;
    // //
    // //
    // //     db.exec(user_table);
    // //     db.exec(board_table);
    // //     db.exec(item_table);
    // // }
    //
    //
    // //#region user
    //
    // /**
    //  * Gets a user form the database, by a given id
    //  * @param id id of the user
    //  * @returns {User|undefined} A user object, if a user was found, undefined otherwise
    //  */
    // static get_user(id) {
    //     const db = new sqlite(dbName);
    //
    //     const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    //     if (row === undefined) {
    //         return undefined;
    //     }
    //
    //     return new User(row.id, row.name, row.mail, row.pw_hash, row.registration_date);
    // }
    //
    // /**
    //  * Gets a stripped user form the database, by a given id
    //  * @param id id of the user
    //  * @returns {User|undefined} A user object, if a user was found, undefined otherwise
    //  */
    // static get_stripped_user(id) {
    //     const db = new sqlite(dbName);
    //
    //     const row = db.prepare('SELECT id, name FROM users WHERE id = ?').get(id);
    //     if (row === undefined) {
    //         return undefined;
    //     }
    //
    //     return {id: row.id, name: row.name};
    // }
    //
    //
    // static edit_user(user) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // static delete_user(user) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // //#endregion
    //
    //
    // //#region project
    //
    // /**
    //  * Gets a project form the database, by a given id
    //  * @param id id of the project
    //  * @returns {Project|undefined} undefined if no project was found, object, if a project was found,
    //  */
    // static get_project(id) {
    //     const db = new sqlite(dbName);
    //
    //     const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    //     if (row === undefined) {
    //         return undefined;
    //     }
    //
    //     return new Project(row.id, row.name);
    // }
    //
    // /**
    //  * Gets all project, owned by a user
    //  * @param user_id id of the user
    //  * @returns {*[project]|undefined} list of projects, undefined if no project found
    //  */
    // static get_projects(user_id) {
    //     const db = new sqlite(dbName);
    //
    //     const rows = db.prepare('SELECT id FROM (players INNER JOIN projects) WHERE user = ?;').all(user_id);
    //
    //     let projects = [];
    //     rows.forEach(row => {
    //         let project_id = row.id;
    //
    //         let project = DbInterface.get_project(project_id); // todo extract data from joined table
    //         projects.push(project);
    //     });
    //
    //     return projects;
    // }
    //
    // /**
    //  * Gets all users, who are part of a project
    //  * @param project_id id of the user
    //  * @returns {*[project]|undefined} list of projects, undefined if no project found
    //  */
    // static get_all_user_by_project(project_id) {
    //     const db = new sqlite(dbName);
    //
    //     const rows = db.prepare('SELECT user FROM (players INNER JOIN inventories ON players.inventory = inventories.id) WHERE project = ?;').all(project_id);
    //
    //     let users = [];
    //     rows.forEach(row => {
    //         let user_id = row.user;
    //
    //         let user = DbInterface.get_stripped_user(user_id); // todo extract data from joined table
    //         users.push(user);
    //     });
    //
    //     return users;
    // }
    //
    // static edit_project(project) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // static delete_project(project) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // //#endregion
    //
    //
    // //#region inventory
    //
    // /**
    //  * Gets a board form the database, by a given id
    //  * @param id id of the board
    //  * @returns {Board|undefined} A board object, if a board was found, undefined otherwise
    //  */
    // static get_inventory(id) {
    //     const db = new sqlite(dbName);
    //
    //     const row = db.prepare('SELECT * FROM inventories WHERE id = ?').get(id);
    //     if (row === undefined) {
    //         return undefined;
    //     }
    //
    //     let project = DbInterface.get_project(row.project);
    //
    //     return new Board(row.id, row.name, row.money, project);
    // }
    //
    //
    // static edit_inventory(board) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // static delete_inventory(board) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // //#endregion
    //
    //
    // //#region item
    //
    // /**
    //  * Gets an item form the database, by a given id
    //  * @param id id of the item
    //  * @returns {Item|undefined} An item object, if an item was found, undefined otherwise
    //  */
    // static get_item(id) {
    //     const db = new sqlite(dbName);
    //
    //     const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    //     if (row === undefined) {
    //         return undefined;
    //     }
    //
    //     let board = DbInterface.get_inventory(row.board);
    //     return new Item(row.id, row.name, row.quantity, row.description, row.notes, board);
    // }
    //
    // /**
    //  * Gets all items, owned by a board
    //  * @param inventory_id id of the board
    //  * @returns {*[Board]|undefined} list of items, undefined if no items found
    //  */
    // static get_all_items(inventory_id) {
    //     const db = new sqlite(dbName);
    //
    //     const rows = db.prepare('SELECT id FROM items WHERE inventory = ?').all(inventory_id);
    //
    //     let items = [];
    //     rows.forEach(row => {
    //         let item = DbInterface.get_item(row.id);
    //         items.push(item);
    //     });
    //
    //     return items;
    // }
    //
    // static edit_item(item) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // static delete_item(item) {
    //     // todo
    //     throw "NotImplementedError";
    // }
    //
    // //#endregion
    //
    //
    // //#region players
    //
    // /**
    //  * Adds players with a certain role to a project.
    //  * The players, roles and boards list need to be symmetrical. This means that roles[i] references the players[i], which references the boards[i]
    //  * @param project id of the project
    //  * @param players list of player ids (needs to be symmetrical to the roles and boards list)
    //  * @param roles list of roles (needs to be symmetrical to the players and boards list)
    //  * @param boards list of boards (needs to be symmetrical to the players and roles list)
    //  */
    // static add_players_to_project(project, players, roles, boards) {
    //     if (players.length !== roles.length) {
    //         throw "players list and roles list length not equal";
    //     }
    //
    //     const db = new sqlite(dbName);
    //     const insert = db.prepare('INSERT INTO players (user, inventory) VALUES (@user, @inventory)');
    //
    //     const insertMany = db.transaction((list) => {
    //         for (const i of list) insert.run(i);
    //     });
    //
    //     // construct insertion list
    //     let dual_list = [];
    //     for (let i = 0; i < players.length; ++i) {
    //         dual_list[i] = {project, player: players[i], role: roles[i], board: boards[i]};
    //     }
    //
    //     insertMany(dual_list);
    // }
    //
    // /**
    //  * Removes a player for a project
    //  * @param project id of the project
    //  * @param user id of the user
    //  */
    // static remove_user_from_project(project, user) {
    //     const db = new sqlite(dbName);
    //
    //     const stmt = db.prepare('DELETE FROM players WHERE inventory = ? AND user = ?');
    //     const info = stmt.run(project, user);
    //
    //     throw "NotImplementedError";
    // }
    //
    // //#endregion


//#region get

    // /**
    //  * returns a project
    //  * @param project_id
    //  */
    // static get_project(project_id) {
    //     const db = new sqlite(dbName);
    //
    //     const rows = db.prepare("SELECT * FROM projects WHERE id = ?;").get(project_id);
    //
    //     let projects = [];
    //     rows.forEach(row => {
    //         let project = {id: row.id, name: row.name};
    //         projects.push(project);
    //     });
    //
    //     return projects;
    // }

    /**
     * returns a list of projects
     * @param user_id
     */
    static get_projects(user_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare(`
            SELECT DISTINCT projects.id, name
            FROM (players JOIN inventories on players.inventory = inventories.id) AS m1
                     JOIN projects ON m1.project = projects.id
            WHERE user = @user_id
            UNION
            SELECT id, name
            FROM projects
            WHERE gamemaster = @user_id;`
        ).all({user_id: user_id});

        let projects = [];
        rows.forEach(row => {
            let project = {id: row.id, name: row.name};
            projects.push(project);
        });

        return projects;
    }

    /**
     * returns a list of users in a project
     * @param project_id
     */
    static get_users(project_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare(`
            SELECT DISTINCT merge.id, name, mail, registration_date
            FROM ((users JOIN players on users.id = players.user) AS merge
                JOIN inventories ON merge.inventory = inventories.id)
            WHERE project = ?;`).all(project_id);

        let users = [];
        rows.forEach(row => {
            let user = {id: row.id, name: row.name, registration_date: row.registration_date};
            users.push(user);
        });

        return users;
    }

    /**
     * returns an inventory
     * @param inventory_id
     */
    static get_inventory(inventory_id) {
        const db = new sqlite(dbName);

        const row = db.prepare("SELECT * FROM inventories WHERE id = ?;").get(inventory_id);
        return {id: row.id, money: row.money, project: row.project};
    }

    /**
     * returns all inventories of a project, joined with users
     * @param project_id
     */
    static get_inventories(project_id) {
        const db = new sqlite(dbName);

        // const rows = db.prepare("SELECT * FROM inventories WHERE project = ?;").all(project_id);

        // const rows = db.prepare(`
        //     SELECT i1.*, u1.id AS user_id, u1.name, u1.registration_date
        //     FROM -- players
        //          ((players p1 JOIN users u1 ON p1.user = u1.id)
        //              JOIN inventories i1 ON p1.inventory = i1.id)
        //     WHERE project = @project_id
        //     UNION
        //     SELECT i2.*, u2.id, u2.name, u2.registration_date
        //     FROM -- gamemaster
        //          ((inventories i2 JOIN projects p2 ON i2.project = p2.id)
        //              JOIN users u2 ON p2.gamemaster = u2.id)
        //     WHERE project = @project_id;`).all({project_id: project_id});
        const rows = db.prepare(`
            SELECT * -- i1.*, u1.id AS user_id, u1.name, u1.registration_date
            FROM -- players
                 ((players p1 join users u1 on p1.user = u1.id)
                     JOIN inventories i1 on p1.inventory = i1.id)
            WHERE i1.project = @project_id;`).all({project_id: project_id});

        let inventories_and_owners = [];
        rows.forEach(row => {
            let inventory_and_owner = {
                inventory: {id: row.id, money: row.money, project: row.project},
                owner: {id: row.user_id, name: row.name, registration_date: row.registration_date}
            };
            inventories_and_owners.push(inventory_and_owner);
        });

        return inventories_and_owners;
    }

    /**
     * returns a list of items, which are part of an inventory
     * @param inventory_id
     */
    static get_items(inventory_id) {
        const db = new sqlite(dbName);

        const rows = db.prepare("SELECT * FROM items WHERE inventory = ?;").all(inventory_id);

        let items = [];
        rows.forEach(row => {
            let item = {
                id: row.id,
                name: row.name,
                quantity: row.quantity,
                description: row.description,
                notes: row.notes,
                inventory: row.inventory
            };
            items.push(item);
        });

        return items;
    }

//#endregion


//#region new

    /**
     * Inserts a user into the database
     * @param user {{name, mail, pw_hash, registration_date}}
     * @returns {{id, name, mail, registration_date}} id of the inserted user
     */
    static new_user(user) {
        const db = new sqlite(dbName);

        const stmt = db.prepare('INSERT INTO users (name, mail, pw_hash, registration_date) VALUES (?, ?, ?, ?)');
        const info = stmt.run(user.name, user.mail, user.pw_hash, user.registration_date);

        const row = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
        return {
            id: row.id,
            name: row.name,
            mail: row.mail,
            pw_hash: row.pw_hash,
            registration_date: row.registration_date
        };
    }

    /**
     * Inserts a project into the database
     * @param project {{name, gamemaster}}
     * @returns {{id, name, gamemaster}}
     */
    static new_project(project) {
        const db = new sqlite(dbName);

        const stmt = db.prepare('INSERT INTO projects (name, gamemaster) VALUES (?, ?)');
        const info = stmt.run(project.name, project.gamemaster);

        const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
        return {
            id: row.id,
            name: row.name,
            gamemaster: row.gamemaster
        };
    }

    /**
     * Inserts an inventory into the database
     * @param inventory {{money, project}}
     * @param owner_id id of the user, who owns the inventory
     * @returns {{id, money, project}}
     */
    static new_inventory(inventory, owner_id) {
        const db = new sqlite(dbName);

        db.prepare("BEGIN").run();

        try {
            // inventories
            const stmt = db.prepare("INSERT INTO inventories (money, project) VALUES (?, ?)");
            const info = stmt.run(inventory.money, inventory.project);
            let new_project_id = info.lastInsertRowid;
            // players
            db.prepare("INSERT INTO players (user, inventory) VALUES (?, ?)").run(owner_id, new_project_id);
            db.prepare("COMMIT").run();

            const row = db.prepare('SELECT * FROM inventories WHERE id = ?').get(new_project_id);

            return {
                id: row.id,
                money: row.money,
                project: row.project
            };
        } finally {
            if (db.inTransaction) {
                db.prepare("ROLLBACK");
            }
        }
    }

    /**
     * Inserts an item into the database
     * @param item {{name, quantity, description, notes, inventory}}
     * @returns {{id, name, quantity, description, notes, inventory}}
     */
    static new_item(item) {
        const db = new sqlite(dbName);

        const stmt = db.prepare('INSERT INTO items (name, quantity, description, notes, inventory) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(item.name, item.quantity, item.description, item.notes, item.inventory);

        const row = db.prepare('SELECT * FROM items WHERE id = ?').get(info.lastInsertRowid);
        return {
            id: row.id,
            name: row.name,
            quantity: row.quantity,
            description: row.description,
            notes: row.notes,
            inventory: row.inventory
        };
    }

//#endregion


//#region edit
//#endregion


//#region delete

    static delete_item(item_id) {
        const db = new sqlite(dbName);
        db.prepare("DELETE FROM items WHERE id = ?").run(item_id);
    }

    static delete_inventory(inventory_id) {
        const db = new sqlite(dbName);

        db.prepare("BEGIN").run();
        try {
            db.prepare("DELETE FROM items WHERE inventory = ?").run(inventory_id);
            db.prepare("DELETE FROM players WHERE inventory = ?").run(inventory_id);
            db.prepare("DELETE FROM inventories WHERE id = ?").run(inventory_id);
            db.prepare("COMMIT").run();
        } finally {
            if (db.inTransaction) {
                db.prepare("ROLLBACK");
            }
        }
    }

    static delete_project(project_id) {
        const db = new sqlite(dbName);

        db.prepare("BEGIN").run();
        try {
            db.prepare("DELETE FROM items WHERE inventory = ?").run(inventory_id);
            db.prepare("DELETE FROM inventories WHERE id = ?").run(inventory_id);
            db.prepare("COMMIT").run();


            // for each inventory
            //      delete items
            //      delete inventory

            // delete project
            db.prepare("DELETE FROM projects WHERE id = ?").run(project_id);
        } finally {
            if (db.inTransaction) {
                db.prepare("ROLLBACK");
            }
        }
    }

    static delete_user(user_id) {
        const db = new sqlite(dbName);

        db.prepare("BEGIN").run();
        try {
            // for each project
            //      for each inventory
            //          delete items
            //          delete inventory

            // delete project
            db.prepare("DELETE FROM users WHERE id = ?").run(user_id);
        } finally {
            if (db.inTransaction) {
                db.prepare("ROLLBACK");
            }
        }
    }

//#endregion

}

module.exports = DbInterface;
