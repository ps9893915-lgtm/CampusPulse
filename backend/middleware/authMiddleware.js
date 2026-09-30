const jwt = require("jsonwebtoken");


// ======================================
// AUTHENTICATE USER
// ======================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
}


// ======================================
// AUTHORIZE USER ROLE
// ======================================

function authorizeRoles(...roles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });

        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action."
            });

        }

        next();

    };
}


// ======================================
// EXPORT FUNCTIONS
// ======================================

module.exports = {
    authenticateToken,
    authorizeRoles
};