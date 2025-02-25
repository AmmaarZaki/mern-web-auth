import express from "express";
import { 
    userSignup, 
    userLogin, 
    userLogout, 
    userEmailVerification, 
    userForgotPassword,
    userResetPassword,
    userDeleteAccount,
    checkUserAuth
 } from "../controllers/auth.controller.js";
 import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/userSignup", userSignup);
router.post("/userEmailVerification", userEmailVerification);
router.post("/userLogin", userLogin);
router.post("/userLogout", userLogout);
router.post("/userForgotPassword", userForgotPassword);
router.post("/userResetPassword/:token", userResetPassword);
router.post("/userDeleteAccount", verifyToken, userDeleteAccount);

router.get("/checkUserAuth", verifyToken, checkUserAuth);

export default router;