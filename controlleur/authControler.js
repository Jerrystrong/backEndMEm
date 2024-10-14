const User=require('../model/User')
const bcrypt=require('bcrypt')
const generateTokenAndcookie=require('../util/generateTokenAndcookie')
const sendMail=require('../mail/sendMail')
const singUp=require('./singUp')
module.exports.singin=async (req,res)=>{
    const {userEmail,userPw}=req.body
    console.log(`${userEmail} ${userPw}`)
    const user=await User.findOne({userEmail})
    if(!userEmail || !userPw) return res.status(404).json({
        status:"failled",
        message:"Tout les champs doivent etre remplis"
    })
    if(!user) return res.status(404).json({
        status:"failled",
        message:"Compte n'existe pas"
    })

    const matchUser= await bcrypt.compare(userPw,user.userPw)
    if(!matchUser) return res.status(401).json({
        status:"failed",
        message:"Le mot de passe ne correspond à aucun compte"
    })
    generateTokenAndcookie(res,user._id)
    res.status(200).json({
        status:'success',
        Data:{
            ...user._doc,
            userPw:null
        }
    })
}
module.exports.singup= singUp
module.exports.logout=(req,res)=>{
    res.clearCookie("token")
    res.json({
        status:"success",
        message:"User loged out"
    })
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
            Data:{
                ...user._doc,
                userPw:null
            },
        })    
    }else{
        res.status(400).json({
            status:"failed",
            message:"code de verification invalide ou déjà expiré"
        })  
    }
}
module.exports.checkAuotisation=async(req,res)=>{
    console.log(req.userId)
    try{
        const user=await User.findById(req.userId).select("-userPw")
        // console.log(user)
        if(!user) return res.status(404).json({
            status:"failed",
            message:"invalid credential"
        })
        res.status(200).json({
            status:"success",
            data:{
                ...user._doc
            }
        })
    
    }catch(e){
        res.status(404).json({
            status:"failed",
            message:"invalid credential error"
        })
    }
}