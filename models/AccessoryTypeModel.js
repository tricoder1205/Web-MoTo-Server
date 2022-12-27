import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccessoryTypeModel = new Schema({
    name: { type: Schema.Types.String }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const AccessoryType = mongoose.model('accessory-type', AccessoryTypeModel);
export default AccessoryType;
