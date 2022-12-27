import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import OrderMoTo from '../models/orderMoToModel.js';

const orderMoToRouter = express.Router();

orderMoToRouter.get('/',
  expressAsyncHandler((req, res, next) => {
    const orderMoTo = OrderMoTo.find({});
    if(orderMoTo) {
      return res.send({ data: orderMoTo, success: true })
    }
    return  res.status(502).send({ data: "SERVER ERROR", success: false })
}))

orderMoToRouter.get('/user/:id',
  expressAsyncHandler(async (req, res, next) => {
    const orderMoTo = await OrderMoTo.find({ user: req.params.id })
    if(orderMoTo) {
      return res.send({ data: orderMoTo, success: true })
    }
    return  res.status(502).send({ data: "SERVER ERROR", success: false })
  })
)

orderMoToRouter.get('/user/register/:id',
  expressAsyncHandler(async (req, res, next) => {
    const orderMoTo = await OrderMoTo.find({ user: req.params.id, status: 0})
    if(orderMoTo) {
      return res.send({ data: orderMoTo, success: true })
    }
    return  res.status(502).send({ data: "SERVER ERROR", success: false })
  })
)


export default orderMoToRouter;
