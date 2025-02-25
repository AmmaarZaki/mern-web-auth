import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token not found."
        });
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        req.userId = decodedToken.userId;
        next();

    } catch (error) {

        console.log("Error verifying token: ", error);

        return res.status(500).json({
            success: false,
            message: `Error verifying token: ${error.message}`
        });
    }
};