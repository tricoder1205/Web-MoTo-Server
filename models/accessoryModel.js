import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccessorySchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  price: { type: Schema.Types.Number, default: 0 },
  img: { type: Schema.Types.String, default: '' },
  type: { type: Schema.Types.String, default: '' },
  brand: { type: Schema.Types.String, default: '' },
  promotion_code: { type: Schema.Types.String, default: ''},
  promotion_id: { type: Schema.Types.ObjectId, default: null, ref: 'promotion' },
  description: { type: Schema.Types.String, default: '' }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
})


const Accessory = mongoose.model('accessories', AccessorySchema);

export default Accessory;
