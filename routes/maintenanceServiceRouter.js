import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import MaintenanceService from '../models/maintenanceServiceModel.js';
import StaffTimeService from '../models/staffTimeServiceModel.js';

const maintenanceServiceRouter = express.Router();

maintenanceServiceRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const services = await MaintenanceService.find({})
    .populate('staff')
    .sort({ _id: -1 });
    //get all services
    res.send({ data: services, success: true });
  })
);

maintenanceServiceRouter.get('/user/:id',
  expressAsyncHandler(async (req, res) => {
    const userMaintenanceService = await MaintenanceService.find({ user: req.params.id })
        .populate('product')
        .populate('staff')
        .sort({ _id: -1 });
    if (!userMaintenanceService) {
      return res.status(404).send({ message: 'No user Mo To found', success: false });
    }
    return res.send({ data: userMaintenanceService, success: true });
  })
);

maintenanceServiceRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const MoTo = await MaintenanceService.findById(req.params.id)
    .populate('product')
    .populate('staff');
    if (MoTo) {
      res.send({ data: MoTo, success: true });
    }
    else {
      res.status(404).send({ message: 'Product Not Found', success: false });
    }
  })
);

maintenanceServiceRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const {
        name,
        phone,
        email,
        address,
        product,
        user,
        dateTime,
        staff,
        staff_name,
        timeServiceId,
        time
      } = req.body

      const Service = new MaintenanceService({
        name,
        phone,
        email,
        address,
        product,
        user,
        staff,
        dateTime,
        timeService: time,
        timeServiceId
      })

      const created = await Service.save({ session });
      if (!created) {
        return res.status(404).send({ success: false, message: "Server error"})
      }
      const timeService = await StaffTimeService.findOne({ _id: timeServiceId })
      timeService.staff.push({
        maintenance: created._id,
        user,
        user_name: name,
        staff,
        staff_name,
        time: dateTime
      })
      await timeService.save({ session });
      
      await session.commitTransaction()
      await session.endSession()
      return res.send({ success: true, data: "Đăng ký thành công."})
    } catch (err) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(404).send({ success: false, message: "Server error", error: err})
    }
  })
);

maintenanceServiceRouter.post('/update-info',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.body
    const maintenanceService = await MaintenanceService.findById(id);
    if (!maintenanceService) {
      return res.status(404).send({ message: 'Không tìm thấy thông tin', success: false });
    }
    try {
      const {staff,
      time,
      description} = req.body
      await maintenanceService.updateOne({
        staff,
        dateTime: time,
        description,
        status: 1
      })
      

      return res.send({ data: "Thành công", success: true });
    } catch (e) {
      return res.send({ data: "Server Error", success: false });
    }
  })
);


maintenanceServiceRouter.post('/status',
  expressAsyncHandler(async (req, res) => {
    const { id, status } = req.body
    const maintenanceService = await MaintenanceService.findById(id);
    if (!maintenanceService) {
      return res.status(404).send({ message: 'Không tìm thấy thông tin', success: false });
    }
    if(status === -1) {
      await StaffTimeService.findOneAndUpdate({ _id: maintenanceService.timeServiceId },
        { $pull: { staff: { 
            staff: maintenanceService.staff,
            user: maintenanceService.user
        }}})
    }

    await maintenanceService.updateOne({ status })
    return res.send({ data: "Thành công", success: true });
  })
);

maintenanceServiceRouter.delete('/:id',
  expressAsyncHandler(async (req, res) => {
    const main = await MaintenanceService.findById(req.params.id);
    if (!main) {
      return res.send({ data: user, success: false });
    }
    await main.delete()
    return res.send({ data: "Xóa thành công", success: true });
  })
)

export default maintenanceServiceRouter
