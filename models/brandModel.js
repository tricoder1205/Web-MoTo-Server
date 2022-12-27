import mongoose from 'mongoose';
const { Schema } = mongoose;

const brandModel = new Schema({
    name: { type: Schema.Types.String },
    type: { type: Schema.Types.Number, default: 0}
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const Brand = mongoose.model('brand', brandModel);
export default Brand;
