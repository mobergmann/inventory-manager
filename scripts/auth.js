const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
const DbInterface = require('./DbInterface');

// const saltRounds = 10;
// const myPlaintextPassword = "s0/\/\P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";


function auth(username, password) {
    let user = DbInterface.get_user(username);
    return bcrypt.compareSync(password, user.password);
}

module.exports = auth;
