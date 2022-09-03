import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
	},
);
const Bill = mongoose.model('Bill', bill);
export default Bill;
