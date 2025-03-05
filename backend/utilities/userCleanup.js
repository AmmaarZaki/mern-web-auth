import nodeCron from "node-cron";
import { User } from "../models/user.model.js";
import { sendAutomaticAccountDeletedSuccessEmail } from "../mailtrap/emails.js";

export const scheduleUserCleanup = () => {

    nodeCron.schedule('*/13 * * * *', async () => {
        try {
            console.log("Running user account cleanup...");

            const accountExpireTime = new Date();
            accountExpireTime.setMinutes(accountExpireTime.getMinutes() - 13);

            const inactiveUsers = await User.find({ lastLogin: { $lt: accountExpireTime } });

            if (inactiveUsers.length > 0) {

                for (const user of inactiveUsers) {

                    await sendAutomaticAccountDeletedSuccessEmail(user.email, user.name);
                    await User.deleteOne({ _id: user._id });

                    console.log(`User Deleted: ${user.name}`);
                }
            } else {
                console.log("No inactive users found");
            }

        } catch (error) {
            console.error("Error during user cleanup:", error);
        }
    });
};