import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import MaintenanceCoupon from '../models/maintenanceCouponModel.js';
import OrderAccessory from '../models/orderAccessoryModel.js';
import Order from '../models/orderModel.js';
import OrderMoTo from '../models/orderMoToModel.js';
import UserMoTo from '../models/userMoToModels.js';
import Product from '../models/productModels.js';
import User from '../models/userModel.js';

const orderRouter = express.Router();

orderRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        try {
            const order = await Order.findOne({ "_id": req.params.id })
            .populate('orderMoTo')
            .populate('orderAccessory')
            .sort({ _id: -1 });
            if (!order) {
                return res.status(404).send({ message: 'Order not found', success: false });
            }
            return res.send({ data: order, success: true });
        }
        catch (err) {
            return res.status(404).send({ message: err.message, success: false });
        }
    })
);

orderRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({})
        .populate('user')
        .sort({ _id: -1 });
        if (!orders) {
            return res.status(404).send({ message: 'Order not found', success: false });
        }
        res.send({ data: orders, success: true });
    })
);

orderRouter.get('/user/:id',
    expressAsyncHandler(async (req, res) => {
        try {
            const orders = await Order.find({ user: req.params.id })
            .populate('orderMoTo')
            .populate('orderAccessory')
            if (orders) {
                return res.send({ data: orders, success: true });
            }
            else {
                return res.status(404).send({ message: 'order Not Found', success: false });
            }
        } catch (err) { console.log(err); }
    })
);

orderRouter.post(
    '/add',
    expressAsyncHandler(async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            let listMoToId = []
            let listAccessoryId = []
            const {
                totalPrice,
                totalEstimate,
                user,
                city,
                district,
                ward,
                address,
                fee,
                discount,
                payment
            } = req.body
            const {cartMoto, cartAccessory } = req.body.orderItems
            if (!req.body.orderItems) {
                return res.status(404).send({ message: "Cart is empty!" });
            }
            if (!cartMoto && !cartAccessory) {
                return res.status(404).send({ message: "Nothing to save!", success: false  });
            }
            if (Array.isArray(cartMoto) && cartMoto.length) {
                await Promise.all(cartMoto.map(async (item) => {
                    const orderMoto = new OrderMoTo({
                        ...item,
                        user
                    })
                    orderMoto.save()
                    listMoToId.push(orderMoto._id)
                }));
            }
            if (Array.isArray(cartAccessory) && cartAccessory.length) {
                await Promise.all(cartAccessory.map(async (item) => {
                    const orderAccessory = new OrderAccessory({
                        ...item,
                        user
                    })
                    orderAccessory.save()
                    listAccessoryId.push(orderAccessory._id)
                }));
            }

            const order = new Order({
                totalPrice,
                totalEstimate,
                orderMoTo: listMoToId,
                orderAccessory: listAccessoryId,
                user,
                city,
                district,
                ward,
                address,
                fee,
                discount,
                payment
            });
            const orderSave = await order.save();
            if (!orderSave) {
                return res.status(404).send({ message: "Server Error", success: false  });
            }
            await session.commitTransaction()
            await session.endSession()
            return res.send({ data: orderSave, success: true });
        } catch (err) {
            await session.abortTransaction()
            await session.endSession()
            console.log(err)
            return res.status(404).json(err);
        } 
    })
);

orderRouter.post(
    '/status',
    expressAsyncHandler(async (req, res) => {
        const { id, status } = req.body
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send({ data: 'Không tìm thấy đơn hàng', success: false });
        }
        if (status === order.status) {
          return res.status(403).send({ data: 'Trạng thái không được trùng lặp', success: false });
        }
        if (status === -1) {
            order.orderMoTo.map(async (item) => {
                const item1 = await OrderMoTo.findById(item);
                if (!item1) {
                  return res.status(404).send({ data: 'Không tìm thấy đơn hàng!', success: false });
                }
                await item1.update({ status: 3 })
            })
        }
        await order.updateOne({ status })
        return res.send({ data: "Cập nhật thành công", success: true });
      })
);

orderRouter.post(
    '/mo-to/status',
    expressAsyncHandler(async (req, res) => {
        const { id, status } = req.body;
        const order = Order.findOne({ _id: id })
        if (!order) {
            return res.status(404).send({ success: false, message: "Không tìm thấy đơn hàng."})
        }
        const orderMoto = OrderMoTo.findOne({ _id: order.orderMoto})
        if (!orderMoto) {
            return res.status(404).send({ success: false, message: "Không tìm thấy đơn hàng."})
        }
       orderMoto.updateOne({ status })
    })
);

orderRouter.post(
    '/accessory/status',
    expressAsyncHandler(async (req, res) => {
       const { id, status } = req.body;
       const order = Order.findOne({ _id: id })
       if (!order) {
         return res.status(404).send({ success: false, message: "Không tìm thấy đơn hàng."})
       }
       const orderAccessory = OrderAccessory.findOne({ _id: order.orderAccessory})
        if (!orderAccessory) {
            return res.status(404).send({ success: false, message: "Không tìm thấy đơn hàng."})
        }
        orderAccessory.updateOne({ status })
    })
);

orderRouter.post(
    '/mo-to/received',
    expressAsyncHandler(async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const {
                orderId,
                orderMoTo,
                frameNumber,
                engineNumber,
                timeReceived
            } = req.body;
            const order = await Order.findOne({ _id: orderId }).session(session)
            if (!order) {
                throw new Error("Không tìm thấy đơn hàng." )
            }
            const orderMotoFrame = await UserMoTo.findOne({ frameNumber })
            if(orderMotoFrame) {
                throw new Error("Số khung xe không được trùng lặp!")
            }
            const orderMotoEngine = await UserMoTo.findOne({ engineNumber })
            if(orderMotoEngine) {
                throw new Error("Số máy không được trùng lặp!")
            }
            await order.updateOne({ status: 1 }).session(session)
            const orderMoto = await OrderMoTo.findOne({ _id: orderMoTo })
            if (!orderMoto) {
                throw new Error("Không tìm thấy đơn hàng." )
            }
            await orderMoto.updateOne({ status: 1 }).session(session)
            const product = await Product.findOne({ _id: orderMoto.productId }).session(session)
            if (product) {
                product.total_sell = product.total_sell + 1;
            }
            await product.save();
            let maintenanceTimes = []
            let startDate, finishDate
            const dateMaintenanceCoupon = new Date(timeReceived)
            for (let i = 0; i < 9; i++) {
                startDate = i === 0 ? dateMaintenanceCoupon.getTime() : finishDate.setDate(finishDate.getDate() + 1)
                finishDate = new Date(startDate)
                finishDate.setMonth(finishDate.getMonth() + 4)
    
                const newMaintenanceCoupon = new MaintenanceCoupon({
                    startDate,
                    finishDate,
                    status: i === 0 ? 2 : 0
                })
                const maintenanceSave = await newMaintenanceCoupon.save({ session })
    
                if (maintenanceSave) {
                    maintenanceTimes.push(maintenanceSave._id)
                }
            }
            const frameNumberExist = await UserMoTo.findOne({ frameNumber }).session(session)
            if (frameNumberExist) {
                throw new Error("Mã khung xe đã tồn tại")
            }
            const user = await User.findOne({_id: order.user}).session(session)
            user.total_vehicle += 1
            await user.save({ session })
            const userMoTo = new UserMoTo({
                user: order.user,
                orderMoTo,
                name: orderMoto.name,
                frameNumber,
                engineNumber,
                timeReceived,
                maintenanceTimes
            })
            const newUserMoTo = await userMoTo.save({ session })
            if (!newUserMoTo) {
                throw new Error("Không thể kết nối với Server")
            }
            await session.commitTransaction()
            await session.endSession()
            return res.send({ success: true, message: "Cập nhật đơn hàng thành công"})
        } catch (err) {
            await session.abortTransaction()
            await session.endSession()
            return res.send({ success: false, message: err.message, err })
        }
    })
);

orderRouter.delete('/remove/:id',
    expressAsyncHandler(async (req, res) => {
        const id = req.params.id;
        const order = await Order.findOne({ _id: id })
        try {
            if (!order) {
                return res.status(404).send({ data: "Không tìm thấy đơn hàng", success: false});
            }
            order.deleteOne();
            return res.send({ data: "Xóa đơn hàng thành công", success: true});
            
        } catch (e) {
            return res.status(404).send({ data: "Server Error", success: false, error: e});
        }

    })
);

export default orderRouter;