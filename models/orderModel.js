import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderItems: Object,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderMoTo: { type: Schema.Types.Array, ref: 'order-mo-to' },
    orderAccessory: { type: Schema.Types.Array, ref: 'order-accessory' },
    city: { type: Schema.Types.String, required: true },
    district: { type: Schema.Types.String, required: true },
    ward: { type: Schema.Types.String, required: true },
    address: { type: Schema.Types.String, required: true },
    fee: { type: Schema.Types.Number, default: 0 },
    discount: { type: Schema.Types.Number, default: 0 },
    totalPrice: { type: Schema.Types.Number, required: true },
    totalEstimate: { type: Schema.Types.Number, required: true },
    status: { type: Schema.Types.Number, default: 0 },
    type: { type: Schema.Types.Number, default: 0 },
    payment: { type: Schema.Types.Number, default: 0 }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
