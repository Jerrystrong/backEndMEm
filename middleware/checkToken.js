const jwt=require('jsonwebtoken')
const checkToken=(req,res,next)=>{
    const {token}=req.cookies
    console.log(token)
    try{
        // verification token
        if(!token) return res.status(403).json({status:"failed",message:"session expirer,reconnecter"})
        //decoder le jwt 
        const decodedToken=jwt.verify(token,process.env.JWTOKEN)
        // console.log(decodedToken)
        if(!decodedToken) return res.status(401).json({status:"failed",message:"session expirer,reconnecter"})
        req.userId=decodedToken.user
        next()
    }catch(e){
        res.status(403).json({status:"failed",message:"session expirer,reconnecter"})
    }

}
module.exports=checkToken