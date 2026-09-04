const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "unauthorized request",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded?.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "invalid user",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "something went wrong, invalid or expired token",
        });
    }
};

module.exports = { protect };