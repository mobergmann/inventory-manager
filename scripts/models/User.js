class User {

    constructor(id, name, mail, pw_hash, registration_date) {
        this.id = id;
        this.name = name;
        this.mail = mail;
        this.pw_hash = pw_hash;
        this.registration_date = registration_date;
    }

}

module.exports = User;
