import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");
    } catch (error) {
        console.log("Error connection to MongoDB:", error.message);
        process.exit(1);
    }
};