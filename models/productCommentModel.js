import mongoose from 'mongoose';
const { Schema } = mongoose;

// const replyInterface = {
//     user_reply: { type: Schema.Types.String },
//     comment: { type: Schema.Types.String, default: ''},
//     name: { type: Schema.Types.String },
//     image: { type: Schema.Types.String },
//     time: { type: Schema.Types.String }
// }

const productCommentsSchema = new Schema({
    productId: { type: Schema.Types.String, required: true },
    user: { type: Schema.Types.String, required: true, ref: 'User' },
    noi_dung: { type: Schema.Types.String, default: ''},
    rep_comment: {
        type: Schema.Types.Array,
        default: []
    },
},
{
    timestamps: true,
}
);

const ProductComment = mongoose.model('product_comment', productCommentsSchema);

export default ProductComment;
