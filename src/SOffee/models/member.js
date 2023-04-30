import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const member = new Schema(
    {
        name: String,
        image: String,
        dob: String,
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
const Member = mongoose.model('Member', member);
export default Member;
