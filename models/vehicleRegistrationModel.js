import mongoose from 'mongoose';
const { Schema } = mongoose;

const vehicleRegistrationModel = new Schema({
    user: { type: Schema.Types.String,  ref: 'User' },
    name: { type: Schema.Types.String },
    phone: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    cccd: { type: Schema.Types.String },
    cccd_date: { type: Schema.Types.String },
    cccd_address: { type: Schema.Types.String },
    product: { type: Schema.Types.String, ref: 'order-mo-to'},
    city: { type: Schema.Types.String },
    district: { type: Schema.Types.String },
    ward: { type: Schema.Types.String },
    totalPrice: { type: Schema.Types.Number },
    address: { type: Schema.Types.String },
    payment: { type: Schema.Types.Number, default: 0 },
    status: { type: Schema.Types.Number, default: 0 },
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const vehicleRegistration = mongoose.model('vehicle-registration', vehicleRegistrationModel);
export default vehicleRegistration;
