import express from 'express';
import data from '../data.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';

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
const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    await User.remove({});  //fix loi 
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
})
);

userRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({}).sort({ _id: -1 });    //get all products
        res.send({ data: users, success: true });
    })
);

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if (user) {
        return res.send({ data: user, success: true });
        // if (bcrypt.compareSync(password, user.password)) {
        // }
        // return res.send({ error: 'Mật khẩu không đúng !', success: false });
    }
    return res.status(404).send({ error: 'Không tìm thấy user!', success: false });
})
);

userRouter.post('/register', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const {
        name,
        email,
        phone,
        password,
        address
    } = req.body
    const exists = await User.findOne({ email })
    if (!exists) {
        const user = new User({
            name,
            email,
            image: req.file?.path.slice(7) || '\\images\\avatars\\user.png',
            phone,
            password,
            address
        });
        const createdUser = await user.save();
        if (createdUser) {
            return res.send({ data: createdUser, success: true });
        }
    }
    return res.send({ error: 'Email đã tồn tại', success: false });
    })
);

userRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send({ data: user, success: true });
        }
        else {
            res.status(404).send({ success: false, message: 'User Not Found' });
        }
    })
);

userRouter.post('/update', upload.single('image'), expressAsyncHandler(async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address
        } = req.body
        const exists = await User.findOne({ email })
        if (!exists) {
            return res.send({ data: 'Không tìm thấy người dùng', success: false });
        }
        exists.name = name,
        exists.email = email,
        exists.image = req.file?.path || exists.image,
        exists.phone = phone ,
        exists.address = address
    
        const createdUser = await exists.save();
        if (createdUser) {
            return res.send({ data: createdUser, success: true });
        }
    } catch (err) {
        return res.send({ data: 'Server error ', success: false });
    }
    })
);

userRouter.put('/profile', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        if (req.body.newPassword) {
            user.password = bcrypt.hashSync(req.body.newPassword, 8);
        }
        else {
            return res.status(401).send({ message: 'Nhập mật khẩu không chính xác !' });
        }
        const updatedUser = await user.save();

        return res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            idAdmin: updatedUser.isAdmin,
            image: updatedUser.image,
            password: updatedUser.password,
            token: generateToken(updatedUser),
        })
    }
    else {
        return res.status(401).send({ message: 'Nhập mật khẩu không chính xác !' });
    }
}
));

userRouter.put('/profileImage', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId);

    if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        // user.image = req.file.path.slice(7);
        if (req.body.newPassword) {
            user.password = bcrypt.hashSync(req.body.newPassword, 8);
        }
        else {
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            idAdmin: updatedUser.isAdmin,
            image: 'images\\avatars\\user.png',
            password: updatedUser.password,
            token: generateToken(updatedUser),
        })
    }
    else {
        res.status(401).send({ message: 'Nhập mật khẩu không chính xác !' });
    }
}
));


userRouter.put('/AdminUser', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        idAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
        password: updatedUser.password,
        token: generateToken(updatedUser),
    })

}));

userRouter.put('/AdminUserImage', upload.single('image'), expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId);

    user.name = req.body.name !== 'undefined' ? req.body.name : user.name;
    user.email = req.body.email !== 'undefined' ? req.body.email : user.email;
    user.phone = req.body.phone !== 'undefined' ? req.body.phone : user.phone;
    user.image = req.file.path.slice(7);

    const updatedUser = await user.save();

    res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        idAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
        password: updatedUser.password,
        token: generateToken(updatedUser),
    })

}
));

userRouter.delete('/deleteUser/:id',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            if (!id) {
                return req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
            }
            const user = User.findOne({ _id: id })
            if (!user) {
                return req.status('404').send({ success: false, message: 'Không tìm thấy user' });
            }
            await user.deleteOne()
            return res.send({ success: true, message: 'Xóa người dùng thành công.'})
        } catch (err) {
            req.status('404').send({ success: false, message: 'Không thể kết nối máy chủ', error: err });
        }
    })
);

export default userRouter;
