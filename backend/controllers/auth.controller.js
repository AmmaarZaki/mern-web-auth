import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utilities/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utilities/generateTokenAndSetCookies.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendAccountDeletedSuccessEmail
} from "../mailtrap/emails.js";

export const userSignup = async (req, res) => {

    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required for signup");
        }

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exist." });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        await generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(email, name, verificationToken);

        res.status(201).json({
            success: true,
            message: "User has successfully created.",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const userEmailVerification = async (req, res) => {

    const { verificationToken } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: verificationToken,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token."
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "User successfully verified.",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {

        console.log("Error verifying user email: ", error);

        res.status(500).json({
            success: false,
            message: `Error verifying user email: ${error.message}`
        });
    }
};

export const userLogin = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid user email address."
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid user password."
            });
        }

        await generateTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({
            success: true,
            message: "User successfully logged in.",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {

        console.log("Error logging in user: ", error);

        res.status(500).json({
            success: false,
            message: `Error logging in user: ${error.message}`
        });
    }
}

export const userLogout = async (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "User successfully logged out ."
    });
}

export const userForgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User email address ${email} is not registered to web auth.`
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(email, user.name, `${process.env.CLIENT_URL}/userResetPassword/${resetToken}`);

        res.status(200).json({
            success: true,
            message: `Password reset link sent to ${email}.`
        });

    } catch (error) {

        console.log("Error sending password reset email: ", error);

        res.status(500).json({
            success: false,
            message: `Error sending password reset email: ${error.message}`
        });
    }
};

export const userResetPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token."
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "User password successfully reset."
        });

    } catch (error) {

        console.log("Error resetting user password: ", error);

        res.status(500).json({
            success: false,
            message: `Error resetting user password: ${error.message}`
        });
    }
};

export const userDeleteAccount = async (req, res) => {

    const { password } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid user password."
            });
        }

        await User.deleteOne({ _id: user.id });

        res.clearCookie("token");

        await sendAccountDeletedSuccessEmail(user.email, user.name);

        return res.status(200).json({
            success: true,
            message: "User has been deleted."
        });
    } catch (error) {

        console.log("Error deleting user account: ", error);

        res.status(500).json({
            success: false,
            message: `Error deleting user account: ${error.message}`
        });
    }
};

export const checkUserAuth = async (req, res) => {

    try {

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "User is authenticated.",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {

        console.log("Error checking user authentication: ", error);

        res.status(500).json({
            success: false,
            message: `Error checking user authentication: ${error.message}`
        });
    }
};