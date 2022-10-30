'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const Schema = mongoose_1.default.Schema;
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
const Bill = mongoose_1.default.model('Bill', bill);
exports.default = Bill;
