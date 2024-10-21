const fileLimit=async(req,res,next)=>{
    const userProfil=req.files.userProfil
    const MAX_LIMIT=500000000
    console.log(userProfil)
    if(userProfil.size>MAX_LIMIT) return res.status(403).json({status:'failled','message':'fichier volumine'})

    next()
}
module.exports=fileLimit