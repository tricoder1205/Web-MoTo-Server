import mongoose from 'mongoose';
const { Schema } = mongoose;

const maintenanceCouponSchema = new Schema({
    startDate: { type: String },
    finishDate: { type: String },
    timeUsed: { type: String, default: '' },
    staff: { type: String, default: '' },
    description: { type: String, default: 'description' },
    status: { type: Number, default: 0 }
},
{
    timestamps: true,
});

const MaintenanceCoupon = mongoose.model('maintenance-coupon', maintenanceCouponSchema);
export default MaintenanceCoupon;
