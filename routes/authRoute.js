const express=require('express')
const authControler=require('../controlleur/authControler')
const checkToken=require('../middleware/checkToken')
const router=express.Router()
router.post('/singin',authControler.singin)
router.post('/singup',authControler.singup)
router.post('/logout',authControler.logout)
router.post('/app/:id/parametre',authControler.pameter)
router.post('/app/:id/live',authControler.live)
router.post('/app/:id/historique',authControler.historique)
router.post('/verificationAccount',authControler.verication)
router.get('/checkRoute',checkToken,authControler.checkAuotisation)

module.exports=router