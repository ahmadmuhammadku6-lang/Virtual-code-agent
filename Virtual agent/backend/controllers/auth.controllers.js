import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import User from "../models/user.model.js";
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false, // Set to true if using HTTPS
        });

        const { password: _password, ...safeUser } = user.toObject();
        return res.status(201).json(safeUser);
    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}
export const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }


        const token = await genToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false, // Set to true if using HTTPS
        });

        const { password: _password, ...safeUser } = existingUser.toObject();
        return res.status(200).json(safeUser);
    } catch (error) {
        res.status(500).json({ message: `Internal login error: ${error.message}` });
    }
} 
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });   
    } catch (error) {
        res.status(500).json({ message: `Internal logout error: ${error.message}` });
    }
};