const User = require("../models/User");

const registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "user already exists with the same email or username",
            });
        }

        const user = await User.create({ email, username, password });

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({
                success: false,
                message: "something went wrong while registering",
            });
        }

        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: createdUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser };