const transporter=require('../mail/configMail')

const User=require('../model/User')
const main=async (userEmail,verificationToken)=>{
    // console.log(user)
    const infoSend=await transporter.sendMail({
        from:"SecureAIOp <not reply>",
        to:userEmail,
        subject:"Email Validation",
        html:`<h1>${verificationToken}</h1>`
    })
    console.log("Message sent: %s", infoSend.messageId);
}
module.exports=main