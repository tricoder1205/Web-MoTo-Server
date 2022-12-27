import bcrypt from 'bcryptjs';
const data = {

    users: [
        {
            name: 'adminexample',
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            image: '/images/avatars/tri.jpg',
        },
        {
            name: 'tuanhung',
            email: 'tuanhung@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
            image: '/images/avatars/tri.jpg',
        }
    ],
    productRating: [
        {
            productId: '61737089dbbefe69882e26cc',
            userName: 'Minh Hiếu',
            note: 'Máy mượt học online tốt',
            dateTime: "14/08/2021 13:44",
            ratingStar: 5,
        },
        {
            productId: '61737089dbbefe69882e26cd',
            userName: 'Thanh',
            note: 'Máy mượt học online tốt',
            dateTime: "14/08/2021 13:44",
            ratingStar: 4,
        },
        {
            productId: '61737089dbbefe69882e26cd',
            userName: 'Trâm Nguyễn',
            note: 'Máy mượt học online tốt',
            dateTime: "14/08/2021 13:44",
            ratingStar: 5,
        },
        {
            productId: '61737089dbbefe69882e26cc',
            userName: 'Thanh',
            note: 'Máy mượt học online tốt',
            dateTime: "14/08/2021 13:44",
            ratingStar: 4,
        },
        {
            productId: '61737089dbbefe69882e26cc',
            userName: 'Trâm Nguyễn',
            note: 'Máy mượt học online tốt',
            dateTime: "14/08/2021 13:44",
            ratingStar: 5,
        },

    ],

}

export default data;