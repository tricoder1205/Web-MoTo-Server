import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';

const brandRouter = express.Router();

brandRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.find({});    //get all brand
    res.send({ data: brand, success: true });
  })
);
brandRouter.get('/:type',
  expressAsyncHandler(async (req, res) => {
    if(req.params.type === 'moto') {
      const brand = await Brand.find({ type: 0})
      return res.send({ data: brand, success: true });
    }
    else if(req.params.type === 'accessory') {
      const brand = await Brand.find({ type: 1});
      return res.send({ data: brand, success: true });
    } else {
      return res.send({ data: 'NOT FOUND!!!', success: false });
    }
  })
);

brandRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      return res.send({ data: brand, success: true });
    }else {
      return res.status(404).send({ success: false });
    }
  })
);

brandRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, type } = req.body
      const brand = new Brand({
        name,
        type
      });
      brand.save()
      return res.send({ data: brand, success: true });
    } catch {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);

brandRouter.post('/edit',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id, name, type } = req.body
      const brand = await Brand.findById(id)
      if (!brand) {
        return res.send({ data: 'Không tìm thấy thương hiệu', success: false });
      }
      brand.name = name
      brand.type = type
      brand.save()
      return res.send({ data: brand, success: true });
    } catch {
      return res.send({ data: 'Server Error', success: false });
    }
  })
);

brandRouter.delete('/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
        }
        const brand = Brand.findOne({ _id: id })
        if (!brand) {
            return req.status('404').send({ success: false, message: 'Không tìm thấy thương hiệu' });
        }
        await brand.deleteOne()
        return res.send({ success: true, message: 'Xóa thương hiệu thành công.'})
    } catch (err) {
        req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
    }
  })
);

export default brandRouter;
