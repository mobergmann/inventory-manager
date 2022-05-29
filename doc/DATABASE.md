# README

This is the readme/ documentation for the database.
Here the information for the Database will be stored.

## Acronyms
- `PK` stands for Primary Key
- `FK` stands for Foreign Key


## Structure

- user (1*n)
    - id: PK
    - name: String
    - mail: String
    - pw_hash: String
    - registration_date: Date
- project (1*n)
    - id: PK
    - name: String
- board (1*n)
    - id: PK
    - name: String
    - money: Int
- item (1*n)
    - id: PK
    - name: String
    - quantity: Int
    - description: String
    - notes: String
    - board: FK
- players (n*m)
    - project: FK
    - user: FK
    - board: FK
    - role: ("player" | "gamemaster")
