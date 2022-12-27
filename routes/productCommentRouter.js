import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import ProductComment from '../models/productCommentModel.js';

const productCommentRouter = express.Router();

productCommentRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const comments = await ProductComment.find({ "productId": req.params.id }).populate('user')
        if (comments) {
            return res.send({ data: comments, success: true });
        }
        else {
            return res.status.apply(404).send({ message: 'No comments found', success: false });
        }
    })
)

productCommentRouter.post('/',
    expressAsyncHandler(async (req, res) => {
        const {
            productId,
            user,
            noi_dung
        } = req.body;
        try {
            const newComment = new ProductComment({
                productId,
                user,
                noi_dung
            });
            await newComment.save();
            return res.send({ data: "Bình luận thành công", success: true })
        } catch (e) {
            // console.log(e.message);
            return res.status(404).send({ message: 'No comments found', success: false });
        }
    })
);

productCommentRouter.post('/reply',
    expressAsyncHandler(async (req, res) => {
        const {
            id,
            user,
            noi_dung,
            dateTime
        } = req.body;
        try {
            const comment = await ProductComment.findOne({ _id: id })
            if(!comment) {
                return res.status(404).send({ message: 'No comments found', success: false });
            }
            comment.rep_comment.push({
                id,
                user,
                noi_dung,
                dateTime
            })
            await comment.save()
            return res.send({ data: "Bình luận thành công", success: true })
        } catch (e) {
            // console.log(e.message);
            return res.status(404).send({ message: 'No comments found', success: false });
        }
    })
);

productCommentRouter.delete('/:id',
    expressAsyncHandler(async (req, res) => {
        const comments = await ProductComment.findOne({ "productId": req.params.id })
        if (comments) {
            await comments.delete();
            return res.send({ data: 'Cập nhật thành công', success: true });
        }
        else {
            return res.status(404).send({ message: 'No comments found', success: false });
        }
    })
)

export default productCommentRouter;
