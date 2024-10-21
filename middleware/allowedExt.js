const path=require('path')
/***
 * @param {Array} exts
 */
const allowedExt=function(exts){
    return (req,res,next)=>{
        const profils=req.files.userProfil
        const profilExt=path.extname(profils.name)
        if(!exts.includes(profilExt)) return res.status(422).json({'status':'error','message':'format of file not supported for profil image'})
        next()
    }
}
module.exports=allowedExt