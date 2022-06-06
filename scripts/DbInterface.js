const sqlite = require("better-sqlite3");
const User = require("./models/User");
const Board = require("./models/Board");
const Item = require("./models/Item");
const Project = require("./models/Project");

const dbName = "database.db";


class DbInterface {

//#region get

    static get_user(username) {
        const db = new sqlite(dbName);
        return db.prepare(`SELECT * FROM users WHERE name = ?;`).get(username);
    }

    static get_user_by_id(id) {
        const db = new sqlite(dbName);
        return db.prepare(`SELECT * FROM users WHERE id = ?;`).get(id);
    }

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

    static add_money(inventory_id, money) {
        const db = new sqlite(dbName);
        db.prepare(`update inventories
            set money = ((select money from inventories where inventories.id = @inventory_id) + @money)
        where inventories.id = @inventory_id;
        `).run({inventory_id: inventory_id, money: money});
    }

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

            let inventories = this.get_inventories(project_id);
            inventories.forEach(inventory => {
                this.delete_inventory(inventory);
            });
            db.prepare("DELETE FROM projects WHERE id = ?").run(project_id);

            db.prepare("COMMIT").run();
        } finally {
            if (db.inTransaction) {
                db.prepare("ROLLBACK");
            }
        }
    }

    // static remove_user_from_project(inventory_id, user_id) {
    //     const db = new sqlite(dbName);
    //
    //     db.prepare("DELETE FROM players WHERE user = @user_id AND inventory = @inventory_id")
    //         .run(user_id, inventory_id);
    // }

    // static delete_user(user_id) {
    //     const db = new sqlite(dbName);
    //
    //     db.prepare("BEGIN").run();
    //     try {
    //         let projects = this.get_projects(user_id);
    //         projects.forEach(project => {
    //             if (project.gamemaster) {
    //                 this.delete_project(project);
    //             }
    //             else {
    //                 DbInterface.remove_user_from_project(project, user_id);
    //             }
    //
    //         });
    //         db.prepare("DELETE FROM projects WHERE id = ?").run(project_id);
    //
    //         db.prepare("COMMIT").run();
    //     } finally {
    //         if (db.inTransaction) {
    //             db.prepare("ROLLBACK");
    //         }
    //     }
    // }

//#endregion

}

module.exports = DbInterface;
