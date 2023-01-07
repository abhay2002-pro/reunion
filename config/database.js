import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        mongoose.set("strictQuery", false);
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected with ${connection.host}`);
    } catch(err){
        console.log(`Some error occured. Error message: ${err}`);
    }
};
