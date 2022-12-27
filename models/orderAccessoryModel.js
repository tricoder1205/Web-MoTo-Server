import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderAccessoryModel = new Schema({
    productId: { type: Schema.Types.ObjectId, required: true},
    name: { type: Schema.Types.String },
    image: { type: Schema.Types.String },
    price: { type: Schema.Types.Number },
    rating: { type: Schema.Types.Number, default: 0},
    quantity: { type: Schema.Types.Number },
    type: { type: Schema.Types.String },
    brand: { type: Schema.Types.String },
    promotion_id: { type: Schema.Types.Object },
    promotion_code: { type: Schema.Types.String, default: '' },
    status: { type: Schema.Types.Number , default: 0}
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const OrderAccessory = mongoose.model('order-accessory', orderAccessoryModel);
export default OrderAccessory;
