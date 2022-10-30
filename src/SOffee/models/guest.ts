import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const guest = new Schema(
    {
        name: String,
        username: String,
        Address: String,
        cart: [],
        tel: String,
        date: String,
    },
    {
        collection: 'Guest',
    }
);
const Guest = mongoose.model('Guest', guest);
export default Guest;
