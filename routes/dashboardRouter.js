import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js'
import OrderMoTo from '../models/orderMoToModel.js';
import OrderAccessory from '../models/orderAccessoryModel.js';
import Product from '../models/productModels.js';
import User from '../models/userModel.js';
import dayjs from 'dayjs'
import MaintenanceService from '../models/maintenanceServiceModel.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/summary',
  expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({ status: 1 })
    let total_product = 0
    let total_accessory = 0
    let total_revenue = 0
    let total_invoice = 0

    orders.map((order) => {
      total_revenue += order.totalEstimate
      total_invoice += 1 
      if(order.orderMoTo.length) {
        Promise.all(order.orderMoTo.map((item)=>{
          total_product += 1
        }))
      }
      if(order.orderAccessory.length) {
        Promise.all(order.orderAccessory.map(async (item)=>{
          const accessory = await OrderAccessory.findById(item);
          total_accessory += accessory.quantity
        }))
      }
    })
    const user = await User.aggregate([
      {$group: {
        '_id': null,
        'count': { $sum: 1 } 
      }}
    ])
    const product = await Product.aggregate([
      {$group: {
        '_id': null,
        'count': { $sum: 1 } 
      }}
    ])
    const data = {
      total_revenue: total_revenue,
      total_invoice: total_invoice,
      total_sell: product[0]['count'],
      total_user: user[0]['count']
    }
    return res.send({ data, success: true});
  })
);

dashboardRouter.post('/chart',
  expressAsyncHandler(async(req, res) => {
    const { step, dateStar, dateEnd } = req.body;
    let end = dateStar
    let branches = [];
    do {
      let start = end;
      switch (step) {
        case 'day':
            end = dayjs(end).endOf('day');
            break;
        case 'week':
            end = dayjs(end).endOf('week').endOf('day');
            break;
        case 'month':
            end = dayjs(end).endOf('month').endOf('day');
            break;
        case 'year':
            end = dayjs(end).endOf('year').endOf('day');
            break;
        default:
          return res.status(502).send('ASD', 422);
      }
      if (end > dayjs(dateEnd)) {
        end = dateEnd;
      }
      const groupKey = dayjs(start).format() 
      branches.push({
        'case': {
          $lte: ['$createdAt', new Date(dayjs(end).valueOf())]
        }, 'then': groupKey
      })
      switch (step) {
        case 'day':
            end = dayjs(end).add(1, 'day').startOf('day');
            break;
        case 'week':
            end = dayjs(end).add(7, 'day').startOf('day');
            break;
        case 'month':
            end = dayjs(end).add(28, 'day').startOf('month').startOf('day');
            break;
        case 'year':
            end = dayjs(end).add(365, 'day').startOf('year').startOf('day');
            break;
        default:
            return res.status(422).send('ASD', 422);
      }
    } while (end <= dayjs(dateEnd));
    const orderAgg = await Order.aggregate([
      {$match: {
        'status': 1
      }},
      {$group: {
      '_id': {
          $switch: {
            'branches': branches,
            'default': ''
          }
        },
        'total_sell': {$sum: '$totalEstimate'}
      }},
      {$sort: { '_id': 1 }}
    ])
    const data = [];
    Promise.all(orderAgg.map(item => {
      data.push({
        name: dayjs(item._id).format('DD/MM/YYYY'),
        total: item.total_sell
      })
    }))
    return res.send({ data, success: true })
  }
))


dashboardRouter.get('/table',
  expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({ status: { $nin: [1, -1] }}).limit(10).sort({ _id: -1 }).populate('user')
    if (!orders) {
      return res.status(422).send('ASD', 422);
    }
    const maintenance = await MaintenanceService.find({ status: { $ne: 1 }}).limit(10).sort({ _id: -1 })
    if (!maintenance) {
      return res.status(422).send('ASD', 422);
    }
    return res.send({ data: { orders, maintenance }, success: true})
  })
)


export default dashboardRouter;
// const orderAgg = await Order.aggregate([
//   {$match: {
//     'status': 1
//   }},
//   {$group: {
//     '_id': null,
//     'total_sell': {$sum: '$totalEstimate'},
//     'total_invoice': {$sum: 1}
//   }}
// ])