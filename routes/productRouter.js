import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModels.js';
import multer from 'multer';
import mongoose from 'mongoose';

const productRouter = express.Router();
const path = '/images/products/'
// const upload = multer({ dest: 'images/products/' });

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

productRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const products = await Product.find({})
        .populate('promotion_id')
        .sort({ _id: -1 });    //get all products
        res.send(products);
    })
);


productRouter.get('/top-sale',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.find()
        .sort({
            "total_sell": -1
        })
        .limit(3);
        const newProducts = product.map((item) => ({
            _id: item._id,
            img: item.img,
            name: item.name,
            price: item.price,
        }))
        if (product) {
            return res.send({ data: newProducts, success: true });
        }
        else {
            return res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.get('/hight-price',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.find()
        .sort({
            "price": -1
        })
        .limit(3);
        const newProducts = product.map((item) => ({
            _id: item._id,
            img: item.img,
            name: item.name,
            price: item.price,
        }))
        if (product) {
            return res.send({ data: newProducts, success: true });
        }
        else {
            return res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.get('/short-price',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.find()
        .sort({
            "price": 1
        })
        .limit(3);
        const newProducts = product.map((item) => ({
            _id: item._id,
            img: item.img,
            name: item.name,
            price: item.price,
        }))
        if (product) {
            return res.send({ data: newProducts, success: true });
        }
        else {
            return res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id)
        .populate('promotion_id');
        if (product) {
            res.send({data: product, success: true});
        }
        else {
            res.status(404).send({ message: 'Product Not Found', success: false});
        }
    })
);

productRouter.get('/config/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        const productConfig = product.specifications ? product.specifications : {}
        if (product) {
            res.send({data: productConfig, success: true});
        }
        else {
            res.status(404).send({ message: 'Product Not Found', success: false});
        }
    })
);

productRouter.put('/config/update/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        product.specifications = req.body
        await product.save();
        return res.send({data: '', success: true});
    })
);

productRouter.put('/updateProductImage', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const { id, type } = req.body
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send({data: "Không tìm thấy sản phẩm", success: false})
    }
    if (type === 'img') {
      product.img = path + req.file.path.slice(16);
    } 
    if (type === 'background') {
      product.background_img = path + req.file.path.slice(16);
    }
    const updatedProduct = await product.save();
    if (!updatedProduct) {
        return res.status(404).send({data: "Không thể cập nhật", success: false})
    }
    return res.send({data: "Cập nhật thành công", success: true })
}));

productRouter.put('/add-color', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const { id, name } = req.body
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send({data: "Không tìm thấy sản phẩm", success: false})
    }
    const newColor = {
        url: '\\' + req.file.path,
        name_color: name
    }
    product.color.push(newColor);

    const updatedProduct = await product.save();
    if (!updatedProduct) {
        return res.status(404).send({data: "Không thể cập nhật", success: false})
    }
    return res.send({data: "Cập nhật thành công", success: true })
}));

productRouter.put('/remove-color',  expressAsyncHandler(async (req, res) => {
    const { id, name, url } = req.body
    const product = await Product.findOneAndUpdate({ _id: id },
        { $pull: { color: { name_color: name, url } } }
    );
    if (!product) {
        return res.status(404).send({data: "Không tìm thấy sản phẩm", success: false})
    }
    product.update({ },{
        $remove: {
            "color": {
                $elemMatch: {
                    name_color:  name
                }
            },
        },
        }
    );
    return res.send({data: "Cập nhật thành công", success: true })
}));

productRouter.post('/find-products',
    expressAsyncHandler(async (req, res) => {
        try {
            const { key, limit } = req.body
            if (key) {
                const products = await Product.find({
                    $or:[
                        { name: { $regex: key, $options:"i" } },
                        { brand: { $regex: key, $options:"i" } },
                        { description: { $regex: key, $options:"i" } },
                        { type: { $regex: key, $options:"i" } }
                    ]
                }).limit(limit);
                if (products) {
                    return res.send({ data: products, success: true})
                }
                return res.send({ error: "Không tìm thấy sản phẩm", success: false, message: "Không tìm thấy." })
            }
            return res.send({ error: "Server error", success: false, message: "" })
        } catch (e) {
            return res.send({ error: "Unprocess", success: false, message: "Server error" })
        }
    })
);

productRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        const {
          name,
          price,
          brand,
          type,
          power,
          link_youtube,
          description,
          maluc,
          trongluong,
          momenxoan,
          dungtich
        } = req.body
        const product = new Product({
            name,
            price,
            brand,
            type,
            power,
            link_youtube,
            description,
            maluc,
            trongluong,
            momenxoan,
            dungtich
        });

        const createNew = await product.save({ session })
        if (!createNew) {
          return res.status(404).send({ error: 'Error saving product', success: false})
        }
        await session.commitTransaction()
        await session.endSession()
        return res.send({ data: createNew._id, success: true })
      } catch (e) {
          await session.abortTransaction()
          await session.endSession()
          return res.status(404).send({ error: e.message, success: false})
      }
  })
);

productRouter.post('/update',
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.body.id);
      if (!product) {
        return res.status(404).send({ message: 'Product Not Found', success: false });
      }
      const session = await mongoose.startSession()
      session.startTransaction()
      const {
        name,
        price,
        brand,
        type,
        power,
        link_youtube,
        description,
        maluc,
        trongluong,
        momenxoan,
        dungtich,
        promotion_id
      } = req.body

      product.name = name || product.name
      product.price = price || product.price
      product.brand = brand || product.brand
      product.type = type || product.type
      product.power = power || product.power
      product.maluc = maluc || product.maluc
      product.description = description || product.description
      product.link_youtube = link_youtube || product.link_youtube
      product.trongluong = trongluong || product.trongluong
      product.momenxoan = momenxoan || product.momenxoan
      product.dungtich = dungtich || product.dungtich
      product.promotion_id = promotion_id || product.promotion_id
  
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

productRouter.delete('/deleteProduct/:id',
    expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id })
        try {
            if (!product) {
                return res.status(404).send({ data: "Không tìm thấy sản phẩm", success: false});
            }
            product.deleteOne();
            return res.status(404).send({ data: "Xóa sản phẩm thành công", success: true});
            
        } catch (e) {
            return res.status(404).send({ data: "Server Error", success: false, error: e});
        }

    })
);

export default productRouter;