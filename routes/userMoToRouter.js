import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import UserMoTo from '../models/userMoToModels.js';

const UserMoToRouter = express.Router();

UserMoToRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const products = await UserMoTo.find({}).sort({ _id: -1 });    //get all products
    res.send({ data: products, success: true });
  })
);

UserMoToRouter.get('/user/:id',
  expressAsyncHandler(async (req, res) => {
    const userMoTo = await UserMoTo.find({ user: req.params.id })
    .populate('orderMoTo').sort({ _id: -1 });
    if (!userMoTo) {
      return res.status(404).send({ message: 'No user Mo To found', success: false });
    }
    return res.send({ data: userMoTo, success: true });
  })
);

UserMoToRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const MoTo = await UserMoTo.findById(req.params.id).populate('maintenanceTimes').populate('orderMoTo').sort({ _id: -1 });
    if (MoTo) {
      res.send({ data: MoTo, success: true });
    }
    else {
      res.status(404).send({ message: 'Product Not Found', success: false });
    }
  })
);


export default UserMoToRouter
