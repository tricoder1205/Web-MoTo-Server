import { vnp_TmnCode, vnp_HashSecret, vnp_Url, host } from '../config/index.js';
import express from 'express';
import dateFormat from 'dateformat';
import querystring from 'qs';
import crypto from "crypto";     

const PaymentRouter = express.Router();

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

PaymentRouter.post('/create_payment_url', function (req, res, next) {
  var ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  var tmnCode = vnp_TmnCode;
  var secretKey = vnp_HashSecret;
  var vnpUrl = vnp_Url;
  var returnUrl = host + req.body.type;

  var date = new Date();
  var dueDate = date.setMinutes(date.getMinutes() + 15)
  var createDate = dateFormat(date, 'yyyymmddHHmmss');
  var expireDate = dateFormat(dueDate, 'yyyymmddHHmmss');
  var orderId = date.getTime();
  var amount = req.body.total; // tong tien
  var bankCode = req.body.bankCode; //NCB
  
  var orderInfo = req.body.orderDescription; // noi dung thanh toan
  var orderType = 'billpayment';
  var locale = 'vn';
  var currCode = 'VND';
  var vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params['vnp_ExpireDate'] = expireDate;
  vnp_Params['vnp_BankCode'] = bankCode || 'NCB';

  vnp_Params = sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  console.log(vnpUrl);
  res.send({ data: vnpUrl, success: true })
});

export default PaymentRouter
