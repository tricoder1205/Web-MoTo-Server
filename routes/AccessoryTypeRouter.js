import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import AccessoryType from '../models/AccessoryTypeModel.js';

const AccessoryTypeRouter = express.Router();

AccessoryTypeRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const vehicle = await AccessoryType.find({});    //get all vehicle
    res.send({ data: vehicle, success: true });
  })
);

AccessoryTypeRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const vehicle = await AccessoryType.findById(req.params.id);
    if (vehicle) {
      return res.send({ data: vehicle, success: true });
    }else {
      return res.status(404).send({ success: false });
    }
  })
);

AccessoryTypeRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    try {
      const { name } = req.body
      const vehicle = new AccessoryType({
        name
      });
      vehicle.save()
      return res.send({ data: vehicle, success: true });
    } catch {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);

AccessoryTypeRouter.post('/edit',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id, name } = req.body
      const vehicle = await AccessoryType.findById(id)
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

AccessoryTypeRouter.delete('/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
        }
        const brand = AccessoryType.findOne({ _id: id })
        if (!brand) {
            return req.status('404').send({ success: false, message: 'Không tìm thấy loại xe' });
        }
        await brand.deleteOne()
        return res.send({ success: true, message: 'Xóa loại xe thành công.'})
    } catch (err) {
        req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
    }
  })
);

export default AccessoryTypeRouter;
