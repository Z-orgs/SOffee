import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const product = new Schema(
	{
		name: String,
		image: String,
		price: Number,
		category: String,
		quantity: Number,
		sold: Number,
	},
	{
		collection: 'Product',
	}
);
const member = new Schema(
	{
		name: String,
		image: String,
		dob: Date,
		address: String,
		username: {
			type: String,
			unique: true,
		},
		password: String,
		star: Number,
		cart: [],
		tel: String,
	},
	{
		collection: 'Member',
	}
);
const guest = new Schema(
	{
		name: String,
		username: String,
		Address: String,
		cart: [],
		tel: String,
	},
	{
		collection: 'Guest',
	}
);
const bill = new Schema(
	{
		date: Date,
		totalMoney: Number,
		product: [],
		status: {
			confirm: {
				type: Boolean,
				default: false,
			},
			shipping: {
				type: Boolean,
				default: false,
			},
			finish: {
				type: Boolean,
				default: false,
			},
		},
		customer: {},
		shipTo: String,
		paymentMethod: {
			type: String,
			default: 'COD',
		},
		isSend: {
			type: Boolean,
			default: false,
		},
		tel: String,
	},
	{
		collection: 'Bill',
	}
);
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
	}
);
const message = new Schema(
	{
		username: String,
		email: String,
		subject: String,
		message: String,
	},
	{
		collection: 'Message',
	}
);
const Member = mongoose.model('Member', member);
const Product = mongoose.model('Product', product);
const Guest = mongoose.model('Guest', guest);
const Bill = mongoose.model('Bill', bill);
const Admin = mongoose.model('Admin', admin);
const Message = mongoose.model('Message', message);
export { Product, Member, Admin, Bill, Guest, Message };
