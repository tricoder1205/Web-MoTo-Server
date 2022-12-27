import express from 'express';
import Promotion from '../models/promotionModel.js';
import Product from '../models/productModels.js';
import Accessory from '../models/accessoryModel.js';
import { generatePromotionCode } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const promotionRouter = express.Router();

promotionRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const promotion = await Promotion.find({})
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    return res.send({ data: promotion, success: true })
  })
)

promotionRouter.post('/detail',
  expressAsyncHandler(async (req, res) => {
    const { code } = req.body
    const promotion = await Promotion.findOne({ code })
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    const products = await Product.find({ promotion_code: code })
    const newProducts = products.map((item) => ({
      id: item._id,
      img: item.img,
      name: item.name
    }))
    const accessories = await Accessory.find({ promotion_code: code })
    const newAccessories = accessories.map((item) => ({
      id: item._id,
      img: item.img,
      name: item.name
    }))
    return res.send({ data: {promotion, products: [...newProducts, ...newAccessories]}, success: true })
  })
)

promotionRouter.post('/product/list',
  expressAsyncHandler(async (req, res) => {
    const { type } = req.body
    if (type === 'accessory') {
      const accessories = await Accessory.find({})
      const newAcc = accessories.map((item) => ({
        id: item._id,
        img: item.img,
        name: item.name,
        promotion_id: item.promotion_id,
        promotion_code: item.promotion_code
      }))
      return res.send({ data: newAcc, success: true })
    } else {
      const products = await Product.find({})
      const newPro = products.map((item) => ({
        id: item._id,
        img: item.img,
        name: item.name,
        promotion_id: item.promotion_id,
        promotion_code: item.promotion_code
      }))
      return res.send({ data: newPro, success: true })
    }
  })
)

promotionRouter.post('/update/product-code',
  expressAsyncHandler(async (req, res) => {
      const session = await mongoose.startSession()
      session.startTransaction()
    try {
      const { code, ids, type, del = false } = req.body
      if (!code || !type) {
        throw new Error('')
      }
      const promotion = await Promotion.findOne({ code })
      if (type === 'accessory') {
        Promise.all(ids.map(async (id) => {
          await Accessory.findOneAndUpdate({ _id: id }, {
            promotion_id: del ? null : promotion._id,
            promotion_code: del ? '' : promotion.code,
          })
        }))
      } else {
        Promise.all(ids.map(async (id) => {
          await Product.findOneAndUpdate({ _id: id }, {
            promotion_id: del ? null : promotion._id,
            promotion_code: del ? '' : promotion.code,
          })
        }))
      }
      await session.commitTransaction()
      await session.endSession()
      return res.send({ data: 'Cập nhật thành công', success: true })
    } catch (e) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(404).send({ error: e.message, success: false})
    }
  })
)

promotionRouter.post('/create',
  expressAsyncHandler(async (req, res) => {
    let i = 0;
    let code = ''
    do {
      code = generatePromotionCode(6);
      const promotionTemp = await Promotion.findOne({ code })
      if (!promotionTemp) {
        i++;
      }
    } while (i === 1)
    const {
      items,
      content,
      dateStart,
      dateEnd,
      rate
    } = req.body;
    const promotion = new Promotion({
      code,
      items,
      content,
      dateStart,
      dateEnd,
      rate
    })
    await promotion.save()
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    return res.send({ data: promotion, success: true })
  })
)

promotionRouter.post('/status',
  expressAsyncHandler(async (req, res) => {
    const { status, code  } = req.body
    const promotion = await Promotion.findOne({ code })
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    await promotion.updateOne({ status })
    return res.send({ data: promotion, success: true })
  })
)

promotionRouter.post('/update',
  expressAsyncHandler(async (req, res) => {
    const {
      code,
      items,
      content,
      dateStart,
      dateEnd,
      rate,
    } = req.body
    const promotion = await Promotion.findOne({ code })
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    promotion.items = items
    promotion.content = content
    promotion.dateStart = dateStart
    promotion.dateEnd = dateEnd
    promotion.rate = rate
    await promotion.save()
    return res.send({ data: promotion, success: true })
  })
)

promotionRouter.delete('/:code',
  expressAsyncHandler(async (req, res) => {
    const { code } = req.body
    const promotion = await Promotion.findOne({ code: req.params.code })
    if (!promotion) {
      return res.send({ data: '', success: false })
    }
    await promotion.deleteOne()
    return res.send({ data: promotion, success: true })
  })
)

export default promotionRouter;
