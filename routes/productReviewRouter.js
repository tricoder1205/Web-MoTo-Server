import express from "express";
import expressAsyncHandler from "express-async-handler";
import ProductReview from "../models/productReviewModel.js";
import OrderAccessory from '../models/orderAccessoryModel.js';
import OrderMoTo from '../models/orderMoToModel.js';
import mongoose from "mongoose";

const productReviewRouter = express.Router();

productReviewRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const reviews = await ProductReview.find({ "productId": req.params.id }).populate('user');
        if (reviews) {
            return res.send({data: reviews, success: true});
        }
        else {
            res.status(404).send({ message: 'Rating Not Found' });
        }
    })
);

productReviewRouter.post('/add',
    expressAsyncHandler(async (req, res) => {
        const {
            id,
            productId,
            noi_dung,
            point,
            type,
            user
        } = req.body;
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            if (type === 'moto') {
                const MoTo = await OrderMoTo.findOne({ _id: id })
                if (!MoTo) {
                    return res.status(404).send({ data: 'Không tìm thấy đơn hàng', success: false});
                }
                await MoTo.updateOne({ rating: 1})
            }
            if (type === 'accessory') {
                const accessory = await  OrderAccessory.findOne({ _id: id })
                if (!accessory) {
                    return res.status(404).send({ data: 'Không tìm thấy đơn hàng', success: false});
                }
                await accessory.updateOne({ rating: 1})
            }
            const review = new ProductReview({
                productId,
                user,
                rate_number: point,
                note: noi_dung
            });
            await review.save({ session });
            await session.commitTransaction()
            await session.endSession()
            return res.send({ data: 'Đánh giá thành công', success: true});
        } catch (e) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(404).send({ data: 'Server Error!!!', success: false});
        }
    })
);

export default productReviewRouter;
