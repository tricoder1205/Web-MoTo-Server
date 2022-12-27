import mongoose from 'mongoose';
const { Schema } = mongoose;

const maintenanceServiceSchema = new Schema({
  name: { type: Schema.Types.String , required: true},
  phone: { type: Schema.Types.Number , required: true},
  email: { type: Schema.Types.String , required: true},
  address: { type: Schema.Types.String , required: true},
  product: { type: Schema.Types.ObjectId , required: true, ref: 'user-mo-to' },
  user: { type: Schema.Types.String , required: true, ref: 'User'},
  staff: { type: Schema.Types.String , required: true, ref: 'Staff'},
  dateTime: { type: Schema.Types.String },
  timeService: { type: Schema.Types.String },
  timeServiceId: { type: Schema.Types.String },
  description: { type: Schema.Types.String, default: '', },
  status: { type: Schema.Types.Number , default: 0 }
},
{
    timestamps: true,   // this will add createdAt and updatedAt timestamps
});

const MaintenanceService = mongoose.model('maintenance-service', maintenanceServiceSchema);
export default MaintenanceService;
