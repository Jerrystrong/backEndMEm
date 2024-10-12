const jwt=require('jsonwebtoken')
// const cookieParser=require('cookie-parser')

const generateTokenAndcookie=async (res,user)=>{
    const token= jwt.sign(
        {user},
        process.env.JWTOKEN,
        {expiresIn:"5d"}
    )
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:"strict",
        maxAge:5*24*60*60*1000
    })
    return token

    
}
module.exports=generateTokenAndcookie