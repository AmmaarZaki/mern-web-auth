import { mailTrapClient, sender } from "./mailtrap.config.js";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    ACCOUNT_DELETED_TEMPLATE,
    AUTOMATIC_ACCOUNT_DELETED_TEMPLATE
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, name, verificationToken) => {

    const recipient = [{ email }];

    try {

        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE
                .replace("{name}", name)
                .replace("{verificationToken}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending verification email.", error);

        throw new Error("Error sending verification email: " + error.message);

    }
};

export const sendWelcomeEmail = async (email, name) => {

    const recipient = [{ email }];

    try {

        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Web Auth",
            html: WELCOME_EMAIL_TEMPLATE
                .replace("{email}", email)
                .replace("{name}", name),
            category: "Welcome Email",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending welcome email.", error);

        throw new Error("Error sending welcome email: " + error.message);

    }
};

export const sendPasswordResetEmail = async (email, name, resetTokenURL) => {

    const recipient = [{ email }];

    try {

        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "User Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE
                .replace("{name}", name)
                .replace("{resetTokenURL}", resetTokenURL),
            category: "Password Reset",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending password reset email.", error);

        throw new Error("Error sending password reset email: " + error.message);
    }
};

export const sendPasswordResetSuccessEmail = async (email, name) => {

    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name),
            category: "Password Reset Success",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending password reset success email.", error);

        throw new Error("Error sending password reset success email: " + error.message);
    }
};

export const sendAccountDeletedSuccessEmail = async (email, name) => {

    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Account Deleted Successful",
            html: ACCOUNT_DELETED_TEMPLATE.replace("{name}", name),
            category: "Account Delete Success",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending account deleted success email.", error);

        throw new Error("Error sending account deleted success email: " + error.message);
    }
};

export const sendAutomaticAccountDeletedSuccessEmail = async (email, name) => {

    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Account Automatically Deleted",
            html: AUTOMATIC_ACCOUNT_DELETED_TEMPLATE.replace("{name}", name),
            category: "Account Delete Success",
        });

        console.log("Email sent successfully.", response);

    } catch (error) {

        console.error("Error sending account automatically deleted success email.", error);

        throw new Error("Error sending account automatically deleted success email: " + error.message);
    }
};