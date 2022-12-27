import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import multer from 'multer';
import Products from '../models/productModels.js';

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

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    console.log('body', req.body)
    console.log(req.file)
    const image = req.file.path
    res.send(image)
  }))

uploadRouter.post('/create', upload.single('image'), expressAsyncHandler(async (req, res) => {

  const product = new Products.findOne({ _id: '630a2d20a69c5e920a6db0f0' })
  product.img = req.file.path

  const createProduct = await product.save();

  res.send({
    img: createProduct.img
  })

}));
export default uploadRouter;
