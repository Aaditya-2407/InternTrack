const User = require("../models/User");
const jwt = require("jsonwebtoken");



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

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            });
        }

        const isPasswordCorrect = await user.comparePassword(password); 
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            });
        }

        const accessToken = generateAccessToken(user);

        const loggedInUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            success: true,
            message: "logged in successfully",
            user: loggedInUser,
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { registerUser , login};