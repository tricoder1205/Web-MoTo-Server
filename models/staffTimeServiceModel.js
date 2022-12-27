import mongoose from 'mongoose';
const { Schema } = mongoose;

const staffTimeServiceModel = new Schema({
    staff: { type: Schema.Types.Array, default: []},
    time: { type: Schema.Types.String }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const StaffTimeService = mongoose.model('staff-time-service', staffTimeServiceModel);
export default StaffTimeService;
