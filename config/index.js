const dbHost = 'cluster0'
const dbUsername = 'minhtristore2022'
const dbPassword = 'minhtri'
const dbReplicaSet = 'MotoStore-0'
const connectionString = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}.xhg659n.mongodb.net/motoshop`

const vnp_TmnCode = "83WANYLH"
const vnp_HashSecret = "VHHXPZBRRCFSQBWSGHQSIQYVIHSMABKX"
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
const host =  "http://localhost:3000/"


export {
  dbHost,
  dbUsername,
  dbPassword,
  dbReplicaSet,
  connectionString,
  vnp_TmnCode,
  vnp_HashSecret,
  vnp_Url,
  host
}
