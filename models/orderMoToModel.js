import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderMoToSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, required: true},
    name: { type: Schema.Types.String },
    color: { type: Schema.Types.String },
    image: { type: Schema.Types.String },
    user: { type: Schema.Types.String, ref: 'User' },
    price: { type: Schema.Types.Number },
    listedPrice: { type: Schema.Types.Number },
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

const OrderMoTo = mongoose.model('order-mo-to', orderMoToSchema);
export default OrderMoTo;
