const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function protect(req, res, next) {

    let token;

    try {

        // CHECK TOKEN
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];

            // VERIFY TOKEN
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // GET USER
            req.user = await User.findById(decoded.id)
                .select("-password");

            if (!req.user) {

                return res.status(401).json({
                    message: "User not found"
                });
            }

            next();

        } else {

            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

    } catch (error) {

        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
}

module.exports = protect;