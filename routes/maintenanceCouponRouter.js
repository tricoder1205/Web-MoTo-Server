import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import MaintenanceCoupon from '../models/maintenanceCouponModel.js';

const maintenanceCouponRouter = express.Router();

maintenanceCouponRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const services = await MaintenanceCoupon.find({}); 
    res.send({ data: services, success: true });
  })
);

maintenanceCouponRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const coupon = await MaintenanceCoupon.findById(req.params.id);
    if (coupon) {
      res.send({ data: coupon, success: true });
    }
    else {
      res.status(404).send({ message: 'Product Not Found', success: false });
    }
  })
);

maintenanceCouponRouter.post('/update',
  expressAsyncHandler(async (req, res) => {
    const coupon = await MaintenanceCoupon.findById(req.body.id);
    if (!coupon) {
      return res.status(404).send({ data: 'Không tìm thấy phiếu', success: false });
    }
    try {
      const {
        time,
        staff,
        description
      } = req.body
      coupon.timeUsed = time
      coupon.staff = staff
      coupon.description = description
      coupon.status = 1
      coupon.save()
      const couponNext = await MaintenanceCoupon.findById(req.body.nextMaintenance);
      await  couponNext.updateOne({status: 2})
      return res.send({ data: coupon, success: true });
    } catch (e) {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);



maintenanceCouponRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        name,
        phone,
        email,
        address,
        product,
        user,
        dateTime,
        staff
      } = req.body
      const Service = new MaintenanceCoupon({
        name,
        phone,
        email,
        address,
        product,
        user,
        staff,
        dateTime
      })
      const created = await Service.save();
      if (!created) {
        return res.status(404).send({ success: false, message: "Server error"})
      }
      return res.send({ success: true, data: "Đăng ký thành công."})
    } catch (err) {
      return res.status(404).send({ success: false, message: "Server error", error: err})
    }
  })
);

maintenanceCouponRouter.post('/status',
  expressAsyncHandler(async (req, res) => {
    const { id, status } = req.body
    const maintenanceService = await MaintenanceCoupon.findById(id);
    if (!maintenanceService) {
      return res.status(404).send({ message: 'Không tìm thấy thông tin', success: false });
    }
    await maintenanceService.updateOne({ status })
    return res.send({ data: "Thành công", success: true });
  })
);

export default maintenanceCouponRouter
