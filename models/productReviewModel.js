import mongoose from 'mongoose';
const { Schema } = mongoose;

const productReviewSchema = new Schema({
    productId: { type: Schema.Types.String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    rate_number: { type: Schema.Types.Number, required: true },
    note: { type: Schema.Types.String },
},
{
    timestamps: true,
}
);

const ProductReview = mongoose.model('product_review', productReviewSchema);

export default ProductReview;