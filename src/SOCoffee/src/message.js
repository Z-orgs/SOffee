import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const message = new Schema(
	{
		username: String,
		email: String,
		subject: String,
		message: String,
	},
	{
		collection: 'Message',
	},
);
const Message = mongoose.model('Message', message);
export default Message;
