import express from 'express';
import Staff from '../models/staffModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

/// lay image
import multer from 'multer';
// vào images
// const upload = multer({ dest: './images/users/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/avatars/');
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

///
const staffRouter = express.Router();

staffRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        try {
            const users = await Staff.find({});
            if (!users) {
                return res.status(404).send({ success: false, message: "Không tìm thấy nhân viên"});
            }
            res.send({ success: true, data: users });
        } catch (e) {
            return res.status(404).send({ success: false, message: "Server error"});
        }
    })
);

staffRouter.get('/list',
    expressAsyncHandler(async (req, res) => {
        try {
            const users = await Staff.find({ status: {$ne: 3}, isAdmin: false });
            if (!users) {
                return res.status(404).send({ success: false, message: "Không tìm thấy nhân viên"});
            }
            res.send({ success: true, data: users });
        } catch (e) {
            return res.status(404).send({ success: false, message: "Server error"});
        }
    })
);

staffRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await Staff.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            return res.send({ data: user, success: true });
        }
        return res.send({ error: 'Email hoặc Mật khẩu không đúng !', success: false });
    }
    return res.status(404).send({ error: 'Email hoặc Mật khẩu không đúng !', success: false });
}));

staffRouter.post('/create', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        phone,
        address
    } = req.body
    const exists = await Staff.findOne({ email })
    if (!exists) {
        const user = new Staff({
            name,
            email,
            image: 'images\\avatars\\user.png',
            phone,
            password,
            address
        });
        const createdStaff = await user.save();
        if (createdStaff) {
            return res.send({ data: createdStaff, success: true });
        }
    }
    return res.send({ error: 'Email đã tồn tại', success: false });
})
);

staffRouter.post('/update', upload.single('image'), expressAsyncHandler(async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address
        } = req.body
        const exists = await Staff.findOne({ email })
        if (!exists) {
            return res.send({ data: 'Không tìm thấy người dùng', success: false });
        }
        exists.name = name,
        exists.email = email,
        exists.image = req.file?.path || exists.image,
        exists.phone = phone ,
        exists.address = address
    
        const createdStaff = await exists.save();
        if (createdStaff) {
            return res.send({ data: createdStaff, success: true });
        }
    } catch (err) {
        return res.send({ data: 'Server error ', success: false });
    }
    })
);

staffRouter.post(
    '/status',
    expressAsyncHandler(async (req, res) => {
       const { id, status } = req.body;
       const staff = Staff.findOne({ _id: id })
       if (!staff) {
         return res.send({ success: false, message: "Không tìm thấy nhân viên."})
       }
       await staff.updateOne({ status })
       return res.send({ success: true, message: "Cập nhật thành công"})
    })
);

staffRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await Staff.findById(req.params.id);
        if (user) {
            res.send({ data: user, success: true });
        }
        else {
            res.status(404).send({ success: false, message: 'Staff Not Found' });
        }
    })
);

staffRouter.delete('/deleteStaff/:id',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
            }
            const user = Staff.findOne({ _id: id })
            if (!user) {
                return res.status('404').send({ success: false, message: 'Không tìm thấy user' });
            }
            await user.deleteOne()
            return res.send({ success: true, message: 'Xóa người dùng thành công.'})
        } catch (err) {
            res.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
        }
    })
);

export default staffRouter;
