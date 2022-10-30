import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const product = new Schema(
    {
        name: String,
        image: String,
        price: { type: Number, default: 0 },
        category: String,
        quantity: Number,
        sold: {
            type: Number,
            default: 0,
        },
        date: String,
    },
    {
        collection: 'Product',
    }
);
const Product = mongoose.model('Product', product);
export default Product;
