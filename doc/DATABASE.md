# README

This is the readme/ documentation for the database.
Here the information for the Database will be stored.

## Acronyms
- `PK` stands for Primary Key. The Type should always be Int.
- `FK` stands for Foreign Key. The FK is given in brackets.

## Structure
- users
    - id: PK
    - name: String
    - mail: String
    - pw_hash: String
    - registration_date: Date
- projects
    - id: PK
    - name: String
    - gamemaster: FK(users->id)
- inventories
    - id: PK
    - money: Int
    - project: FK(projects->id)
- items
    - id: PK
    - name: String
    - quantity: Int
    - description: String
    - notes: String
    - inventory: FK(inventories->id)
- players
  - user: FK(users->id)
  - inventory: FK(inventories->id)
