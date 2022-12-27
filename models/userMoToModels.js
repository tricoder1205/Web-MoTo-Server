import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserMoToSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    orderMoTo: { type: Schema.Types.ObjectId, ref: 'order-mo-to' },
    image: { type: Schema.Types.String },
    status: { type: Schema.Types.Number, default: 1},
    name: { type: Schema.Types.String, required: true },
    frameNumber: { type: Schema.Types.String, required: true },
    engineNumber: { type: Schema.Types.String, required: true },
    timeReceived: { type: String, required: true },
    maintenanceTimes: { type: Schema.Types.Array, ref: 'maintenance-coupon' }
}, {
    timestamps: true,
})

const UserMoTo = mongoose.model('user-mo-to', UserMoToSchema);

export default UserMoTo;