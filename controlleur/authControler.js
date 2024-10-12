const User=require('../model/User')
const bcrypt=require('bcrypt')
const generateTokenAndcookie=require('../util/generateTokenAndcookie')
const sendMail=require('../mail/sendMail')
const singUp=require('./singUp')
module.exports.singin=(req,res)=>{
    res.send('singin')
}
module.exports.singup= singUp
module.exports.logout=(req,res)=>{
    res.send('logout')
}
module.exports.pameter=(req,res)=>{
    res.send('parameter'+req.params.id)
}
module.exports.live=(req,res)=>{
    res.send('live')
}
module.exports.historique=(req,res)=>{
    res.send('historique')
}
module.exports.verication=async (req,res)=>{
    const {code}=req.body
    const user=await User.findOne({verificationToken:code,verificationExpireAt:{$gt:Date.now()}})
    // console.log(user)
    // res.send(user._id)
    if(user){
        user.isVerify=true
        user.verificationToken=null
        user.verificationExpireAt=null
        await user.save()
        res.status(200).json({
            status:"success",
            data:{
                ...User,
                userPw:null
            },
            state:"validate"
        })    
    }else{
        res.status(400).json({
            status:"failed",
            message:"code de verification invalide ou déjà expiré"
        })  
    }
}