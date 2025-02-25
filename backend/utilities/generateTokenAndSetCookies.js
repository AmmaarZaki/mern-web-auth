import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = async (res, userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.JWT_SECRET === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    return token;
};