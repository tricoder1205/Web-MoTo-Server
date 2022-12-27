import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Accessory from '../models/accessoryModel.js';
import multer from 'multer';
import mongoose from 'mongoose';

const accessoryRouter = express.Router();
// const upload = multer({ dest: 'images/products/' });
const path = '/images/products/'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/products/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

accessoryRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const products = await Accessory.find({})
    .populate('promotion_id')
    res.send({ data: products, success: true });
  })
);

accessoryRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Accessory.findById(req.params.id)
    .populate('promotion_id')
    if (product) {
      res.send({ data: product, success: true });
    }
    else {
      res.status(404).send({ message: 'Product Not Found', success: false });
    }
  })
);

accessoryRouter.put('/create', upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const {
        name,
        price,
        brand,
        type,
        description
      } = req.body
      const product = await Accessory({
        name,
        price,
        brand,
        type,
        description,
        img: path + req.file?.path.slice(16)
      });
  
      const create = await product.save({ session })
      if (!create) {
        return res.status(404).send({ error: 'Error saving product', success: false})
      }
      await session.commitTransaction()
      await session.endSession()
      return res.send({ data: create, success: true })
    } catch (e) {
        await session.abortTransaction()
        await session.endSession()
        return res.status(404).send({ error: e.message, success: false})
    }
  })
);


accessoryRouter.post('/update', upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const product = await Accessory.findById(req.body.id);
      if (!product) {
        return res.status(404).send({ message: 'Accessory Not Found', success: false });
      }
      const {
        name,
        price,
        brand,
        type,
        description
      } = req.body

      product.name = name || product.name
      product.price = price || product.price
      product.brand = brand || product.brand
      product.type = type || product.type
      product.img = path + req.file?.path.slice(16);
      product.description = description || product.description
  
      const update = await product.save({ session })
      if (!update) {
        return res.status(404).send({ error: 'Error saving product', success: false})
      }
      await session.commitTransaction()
      await session.endSession()
      return res.send({ data: update, success: true })
    } catch (e) {
        await session.abortTransaction()
        await session.endSession()
        return res.status(404).send({ error: e.message, success: false})
    }
  })
);

accessoryRouter.put('/updateAccessoryImage', upload.single('image'), expressAsyncHandler(async (req, res) => {
  const { id } = req.body
  const product = await Accessory.findById(id);
  if (!product) {
      return res.status(404).send({data: "Không tìm thấy sản phẩm", success: false})
  }
  product.img = path + req.file.path.slice(16);
  const updatedProduct = await product.save();
  if (!updatedProduct) {
      return res.status(404).send({data: "Không thể cập nhật", success: false})
  }
  return res.send({data: "Cập nhật thành công", success: true })
}));

accessoryRouter.delete('/deleteProduct/:id',
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Accessory.findOne({ _id: id })
    try {
        if (!product) {
            return res.status(404).send({ data: "Không tìm thấy sản phẩm", success: false});
        }
        product.deleteOne();
        return res.send({ data: "Xóa sản phẩm thành công", success: true});
        
    } catch (e) {
        return res.status(404).send({ data: "Server Error", success: false, error: e});
    }

})
);

export default accessoryRouter