import mongoose from 'mongoose';
const { Schema } = mongoose;

const promotionSchema = new Schema({
  code: { type: Schema.Types.String, required: true },
  items: { type: Schema.Types.Array, default: [] },
  content: { type: Schema.Types.String, default: '' },
  dateStart: { type: Schema.Types.String, default: ''},
  dateEnd: { type: Schema.Types.String, default: ''},
  status: { type: Schema.Types.Number, default: 0},
  rate: { type: Schema.Types.Number, default: 0},
},
{
    timestamps: true,
})

const Promotion = mongoose.model('promotion', promotionSchema);
export default Promotion;
