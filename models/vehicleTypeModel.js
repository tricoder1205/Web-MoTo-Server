import mongoose from 'mongoose';
const { Schema } = mongoose;

const vehicleTypeModel = new Schema({
    name: { type: Schema.Types.String }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const VehicleType = mongoose.model('vehicle-type', vehicleTypeModel);
export default VehicleType;
