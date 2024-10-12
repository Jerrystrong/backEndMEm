const timespan = require('jsonwebtoken/lib/timespan')
const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    userEmail:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    userNom:{
        type:String,
        required:true
    },
    userGenre:{
        type:String,
        required:true
    },userAge:String,
    userAccountType:String,
    userName:{
        type:String,
        required:true,
    },
    userPw:{
        type:String,
        required:true,
        unique:true
    },
    userProfil:String,
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpireAt:Date,
    verificationToken:String,
    verificationExpireAt:Date,
    userDevices:[],
    famillyMember:[]
},{timestamps:true})
const user=mongoose.model('User',userSchema)
module.exports=user