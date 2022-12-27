import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: Schema.Types.String
    },
    content: {
        type: Schema.Types.String
    },
    price: {
        type: Schema.Types.Number
    },
    type: {
        type: Schema.Types.String
    },
    img: {
        type: Schema.Types.String
    },
    brand: {
        type: Schema.Types.String
    },
    total_sell: {
        type: Schema.Types.Number,
        default: 0,
     },
    power: {
        type: Schema.Types.Number
     },   
    background_img: {
        type: Schema.Types.String
     },
    link_youtube: {
        type: Schema.Types.String
     },
    description: {
        type: Schema.Types.String
     },
    color: {
        type: Schema.Types.Array,
        default: () => []
    },
    promotion_code: { type: Schema.Types.String, default: ''},
    promotion_id: { type: Schema.Types.ObjectId, default: null, ref: 'promotion' },
    dungtich: {
        type: Schema.Types.Number 
     },
     maluc: {
        type: Schema.Types.Number
     },
     momenxoan: {
        type: Schema.Types.Number
     },
     trongluong: {
        type: Schema.Types.Number
     },
     specifications: {
        type: Schema.Types.Object,
        default: () => { }
    }
}, {
    timestamps: true,
})

const Products = mongoose.model('products', ProductSchema);

export default Products;