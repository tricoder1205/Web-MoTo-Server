import bcrypt from "bcrypt";
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { generateToken } from '../utils.js';
const userSchema = new Schema(
    {
        name: { type: Schema.Types.String, required: true },
        email: { type: Schema.Types.String, required: true, unique: true },
        password: { type: Schema.Types.String, required: true },
        image: { type: Schema.Types.String, required: false, default: '\\images\\avatars\\user.png' },
        phone: { type: Schema.Types.Number, required: false },
        address: { type: Schema.Types.String, required: false },
        cccd: { type: Schema.Types.Number, required: false },
        cccd_date: { type: Schema.Types.Number, required: false },
        cccd_address: { type: Schema.Types.Number, required: false },
        token: { type: Schema.Types.String, required: false },
        total_vehicle: { type: Schema.Types.Number, default: 0 },
    },
    {
        timestamps: true,   // this will add createdAt and updatedAt timestamps
    }
);

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8)
    this.token = generateToken(this)
})

const User = mongoose.model('User', userSchema);

export default User;