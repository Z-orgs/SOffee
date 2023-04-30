import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const admin = new Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		password: String,
	},
	{
		collection: 'Admin',
	},
);
const Admin = mongoose.model('Admin', admin);
export default Admin;
