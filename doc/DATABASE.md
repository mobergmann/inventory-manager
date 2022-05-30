# README
This is the readme/ documentation for the database.
Here the information for the Database will be stored.

## Acronyms
- `PK` stands for Primary Key. The Type should always be Int.
- `FK()` stands for Foreign Key. The FK location is given in brackets.
- `U` stands for Unique
- `NN` stands for Not Null
- `D` stands for Default

## Structure
- users
    - id: PK
    - name: String (U, NN)
    - mail: String (U, NN)
    - pw_hash: String (NN)
    - registration_date: Date (NN)
- projects
    - id: PK
    - name: String (U, NN)
    - gamemaster: FK(users->id) (U, NN)
- inventories
    - id: PK
    - money: Int (D: 0)
    - project: FK(projects->id) (NN)
- items
    - id: PK
    - name: String (NN)
    - quantity: Int (D: 1, NN)
    - description: String (D: "")
    - notes: String (D: "")
    - inventory: FK(inventories->id) (NN)
- players (1:n)
    - inventory: FK(inventories->id) (U, NN)
    - user: FK(users->id) (NN)
