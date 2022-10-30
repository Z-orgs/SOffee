import mongoose from 'mongoose';
const url: string = process.env.URL || '';
function connectDB(): boolean {
    try {
        mongoose.connect(url);
        console.log(`OK: DB`);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
export default connectDB;
