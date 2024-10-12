const nodeMailer=require('nodemailer')
const dotEnv=require('dotenv')
dotEnv.config()
const transporter= nodeMailer.createTransport({
    host:process.env.EMAIL_SMTP,
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_ADRESS,
        pass:"ltgk yuxk fnea gdnh"
    }
})
module.exports=transporter