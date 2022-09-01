import mongoose from 'mongoose';
import 'dotenv/config';
async function connectDB() {
    try {
        await mongoose.connect(process.env.URLDB);
        console.log(`OK: DB`);
    } catch(err) {
        console.log(err);
    }
}
export default connectDB;
