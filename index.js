import express from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { connectionString } from './config/index.js';

import path from 'path';
import cors from 'cors';
import productRouter from './routes/productRouter.js';
import uploadRouter from './routes/upload.js';
import userRouter from './routes/userRouter.js';
import accessoryRouter from './routes/accessoryRouter.js';
import orderRouter from './routes/orderRouter.js';
import UserMoToRouter from './routes/userMoToRouter.js';
import PaymentRouter from './routes/paymentRouter.js';
import staffRouter from './routes/staffRouter.js';
import maintenanceServiceRouter from './routes/maintenanceServiceRouter.js';
import brandRouter from './routes/brandRouter.js';
import vehicleTypeRouter from './routes/vehicleTypeRouter.js';
import maintenanceCouponRouter from './routes/maintenanceCouponRouter.js';
import productReviewRouter from './routes/productReviewRouter.js';
import productCommentRouter from './routes/productCommentRouter.js';
import AccessoryTypeRouter from './routes/AccessoryTypeRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import orderMoToRouter from './routes/orderMoToRouter.js';
import vehicleRegistrationRouter from './routes/vehicleRegistationRouter.js';
import staffTimeServiceRouter from './routes/staffTimeServiceRouter.js';
import promotionRouter from './routes/promotionRouter.js';
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('server'));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/images', express.static('images'));

// connect mongodb database
mongoose.connect(connectionString || 'mongodb://localhost/motoStore', {});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.use('/api/products', productRouter);
app.use('/api/accessory', accessoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/staff', staffRouter);
app.use('/api/time-service', staffTimeServiceRouter);
app.use('/api/orders', orderRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/product-review', productReviewRouter);
app.use('/api/product-comment', productCommentRouter);
app.use('/api/order-moto', orderMoToRouter);
app.use('/api/vehicle-registration', vehicleRegistrationRouter);
app.use('/api/brand', brandRouter);
app.use('/api/accessory-type', AccessoryTypeRouter);
app.use('/api/vehicle-type', vehicleTypeRouter);
app.use('/api/my-mo-to', UserMoToRouter);
app.use('/api/maintenance-service', maintenanceServiceRouter);
app.use('/api/maintenance-coupon', maintenanceCouponRouter);
app.use('/api/promotion', promotionRouter);
app.use('/api/payment', PaymentRouter);

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
})
