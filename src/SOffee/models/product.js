import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
const Product = mongoose.model('Product', product);
export default Product;
