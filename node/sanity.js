const FULL_NAME_PATTERN = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

function isValidUser(user) {
    return FULL_NAME_PATTERN.test(user);
}

module.exports = {
    isValidUser,
}
