const jwt = require("jsonwebtoken");

function generateToken(id) {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "60d"
        }
    );
}

module.exports = generateToken;