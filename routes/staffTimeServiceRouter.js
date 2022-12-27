import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import StaffTimeService from '../models/staffTimeServiceModel.js';
import mongoose from 'mongoose';
import Staff from '../models/staffModel.js';
import MaintenanceService from '../models/maintenanceServiceModel.js';

///
const staffTimeServiceRouter = express.Router();

staffTimeServiceRouter.post('/create',
    expressAsyncHandler(async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const {
                start,
                end,
                period
            } = req.body
            if (!start || !end || !period) {
                throw new Error('Vui lòng cung cấp đủ thông tin')
            }
            const dateStart = new Date(start)
            const dateEnd = new Date(end)
            let time
            do {
                time = new Date(dateStart.setMinutes(dateStart.getMinutes() + period))

                const staffTime = new StaffTimeService({
                    time: time.getHours() + 'h' + (time.getMinutes() ? time.getMinutes() : time.getMinutes() + '0') 
                })
                await staffTime.save()

            } while (time < dateEnd)

            await session.commitTransaction()
            await session.endSession()
            return res.send({ data: "Tạo mới thành công", success: true });
        } catch (err) {
            await session.abortTransaction()
            await session.endSession()
            console.log(err)
            return res.status(404).json(err);
        } 
    })
);

staffTimeServiceRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const timeService = await StaffTimeService.find({})
        if (!timeService) {
            return res.send({ success: false, message: "Server error" });
        }
        const staff = await Staff.find({ status: 0, isAdmin: false });
        if (!staff) {
            return res.status(404).send({ success: false, message: "Không tìm thấy nhân viên"});
        }
        const totalStaff = staff.length
        return res.send({ success: true, data: { timeService, totalStaff }});
    })
)

staffTimeServiceRouter.put('/remove-staff',
expressAsyncHandler(async (req, res) => {
    const { id, staff, user, maintenance } = req.body;
    try {
        const staffTimeService = await StaffTimeService.findOneAndUpdate({ _id: id },
            { $pull: { staff: { 
                staff,
                user
            }}})
        const maintenanceService = await MaintenanceService.findById(maintenance);
        if (!maintenanceService) {
            return res.status(404).send({ message: 'Không tìm thấy thông tin', success: false });
        }
  
      await maintenanceService.updateOne({ status })
        if (!staffTimeService) {
            return res.send({ success: false, message: 'Không tìm thấy lịch bảo dưỡng' });
        }
        return res.send({ success: true, data: 'Xóa người dùng thành công.'})
    } catch (err) {
        res.send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
    }
})
);

export default staffTimeServiceRouter;
