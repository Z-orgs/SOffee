'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const Schema = mongoose_1.default.Schema;
const product = new Schema(
	{
		name: String,
		image: String,
		price: Number,
		category: String,
		quantity: Number,
		sold: {
			type: Number,
			default: 0,
		},
		date: Date,
	},
	{
		collection: 'Product',
	},
);
const Product = mongoose_1.default.model('Product', product);
exports.default = Product;
