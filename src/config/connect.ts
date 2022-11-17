import mongoose from 'mongoose';
const url: string = process.env.URL || '';
function connectDB() {
	try {
		mongoose.connect(url);
		console.log(`OK: DB`);
	} catch (err) {
		console.log(err);
	}
}
export default connectDB;
