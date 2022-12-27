import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import VehicleRegistration from '../models/vehicleRegistrationModel.js';

const vehicleRegistrationRouter = express.Router();

vehicleRegistrationRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const vehicle = await VehicleRegistration.find({}).sort({_id: -1});    //get all vehicle
    res.send({ data: vehicle, success: true });
  })
);

vehicleRegistrationRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const vehicle = await VehicleRegistration.findById(req.params.id).populate('product').populate('user');
    if (vehicle) {
      return res.send({ data: vehicle, success: true });
    }else {
      return res.status(404).send({ success: false });
    }
  })
);

vehicleRegistrationRouter.get('/user/:id',
  expressAsyncHandler(async (req, res) => {
    const vehicle = await VehicleRegistration.find({ user: req.params.id }).populate('product').sort({_id: -1});
    if (vehicle) {
      return res.send({ data: vehicle, success: true });
    }else {
      return res.status(404).send({ success: false });
    }
  })
);

vehicleRegistrationRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    try {
      const vehicle = new VehicleRegistration({
       ...req.body,
       payment: 1
      });
      await vehicle.save()
      return res.send({ data: vehicle, success: true });
    } catch {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);

vehicleRegistrationRouter.post('/edit',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id, name } = req.body
      const vehicle = await VehicleRegistration.findById(id)
      if (!vehicle) {
        return res.send({ data: 'Không tìm thấy dòng xe', success: false });
      }
      vehicle.name = name
      vehicle.save()
      return res.send({ data: vehicle, success: true });
    } catch {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);

vehicleRegistrationRouter.delete('/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
        }
        const brand = VehicleRegistration.findOne({ _id: id })
        if (!brand) {
            return req.status('404').send({ success: false, message: 'Không tìm thấy đơn đăng ký' });
        }
        await brand.deleteOne()
        return res.send({ success: true, message: 'Xóa đơn đăng ký thành công.'})
    } catch (err) {
        req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
    }
  })
);

vehicleRegistrationRouter.post('/status',
  expressAsyncHandler(async (req, res) => {
    const { id, status } = req.body
    const maintenanceService = await VehicleRegistration.findById(id);
    if (!maintenanceService) {
      return res.status(404).send({ message: 'Không tìm thấy thông tin', success: false });
    }
    await maintenanceService.updateOne({ status })
    return res.send({ data: "Thành công", success: true });
  })
);

export default vehicleRegistrationRouter;
