const User=require('../model/User')
const bcrypt=require('bcrypt')
const path=require('path')
const generateTokenAndcookie=require('../util/generateTokenAndcookie')
const sendMail=require('../mail/sendMail')
const singUp=async (req,res)=>{
    const {userEmail,userNom,userGenre,userAge,userAccountType,userName,userPw,userPwConf}=req.body 
    const {userProfil}=req.files
    const userProfill=userProfil.name
    const userProfilType=userProfil.mimetype
    if(!userEmail||!userNom||!userGenre||!userAccountType||!userName||!userPw||!userPwConf){
        res.status(400).json({status:"failed",message:"Tout les champs doivent etre ramplie"})
    }
    else{
        try{
            const userExist= await User.findOne({userEmail})
            // verification du compte existant
            if(userExist){
                throw new Error("User already existe")
            }
            else{
                // verification du mot de passe avec la confirmation
                if(userPw!==userPwConf) res.status(400).json({message:"le mot de passe ou la confirmation n'est pas correct"})
                const genSalt=await bcrypt.genSalt(10)
                const hashPw=await bcrypt.hash(userPw,genSalt)
                const verificationToken= Math.floor(10000+Math.random()*90000).toString()
                const verificationExpireAt=Date.now()+10*60*1000
                const user= new User({
                    userEmail,
                    userNom,
                    userGenre,
                    userAge,
                    userAccountType,
                    userName,
                    userPw:hashPw,
                    userProfil:userProfill,
                    verificationToken,
                    verificationExpireAt
                })
                await user.save()
                generateTokenAndcookie(res,user._id)
                sendMail(user.userEmail,user.verificationToken).catch(e=>{
                    console.log("sending email Error"+e)
                })
                const patht=path.join(__dirname,'files',userProfil.name)
                userProfil.mv(patht,(err)=>{
                    if(err) return res.status(500).json({status:'error',message:err})
                })
                res.status(201).json({
                    status:'success',
                    Data:{
                        ...user._doc,
                        userPw:null
                    },
                    state:'waiting for confirmation'
                })
            }
        }
        catch(e){
            return res.status(400).json({status:"failed",message:e.message})
        }
    }
    
}
module.exports=singUp