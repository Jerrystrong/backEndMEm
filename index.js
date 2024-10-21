const express=require('express')
const dotEnv=require('dotenv')
const Cors=require('cors')
const path=require('path')
const connectionDb=require('./config/connectionDb')
const authRouter=require('./routes/authRoute')
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload')
const app=express()
const Port=process.env.PORT||4005
const User=require('./model/User')
const bcrypt=require('bcrypt')
const authControler=require('./controlleur/authControler')
const checkToken=require('./middleware/checkToken')
const fileLimit=require('./middleware/fileLimit')
const noFile=require('./middleware/noFile')
const allowedExt=require('./middleware/allowedExt')
dotEnv.config()
// configurer cors(Cross-Origin Resource Sharing (CORS)) pour la communication client serveur pour proteger notre api contre le requete des autres plateformCORS, ou Cross-Origin Resource Sharing, est un mécanisme de sécurité mis en œuvre par les navigateurs web pour restreindre l'accès aux ressources provenant de domaines différents. Son objectif principal est de prévenir des attaques malveillantes telles que le cross-site scripting (XSS) et le cross-site request forgery (CSRF)
const allowedOrigins=['https://unrivaled-crostata-6fb029.netlify.app','http://localhost:5173','http://localhost:4005']
const corsOption={
    origin:function(origin,callback){
        if(!origin||allowedOrigins.indexOf(origin)!==-1){
            callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    // origin:'https://unrivaled-crostata-6fb029.netlify.app/',
    credentials: true,
    optionsSuccessStatus:200
}
connectionDb()
// all middleware
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'controlleur/files')))
app.use(Cors(corsOption))
app.use(express.json())
// app.use(express.urlencoded({extended:false}))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
// app.use(fileupload)
app.use(authRouter)
app.post('/singup',fileUpload({ createParentPath: true }),noFile,fileLimit,allowedExt(['.jpg','.jpeg','.png','.gif']),authControler.singup)
app.post('/login', async (req, res) => {
    const { userEmail, userPw } = req.body;
    console.log(`${userEmail} ${userPw}`);

    try {
        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "Compte n'existe pas"
            });
        }

        const matchUser = await bcrypt.compare(userPw, user.userPw);
        if (!matchUser) {
            return res.status(401).json({
                status: "failed",
                message: "Le mot de passe ne correspond à aucun compte"
            });
        }

        // Génération du token et des cookies
        generateTokenAndcookie(res, user._id);

        return res.status(200).json({
            status: 'success',
            data: {
                ...user._doc,
                userPw: null // Ne pas renvoyer le mot de passe
            },
            state: 'waiting for confirmation'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Une erreur est survenue lors de la connexion.'
        });
    }
});
app.all('*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'/views','/404.html'))
})
app.listen(Port,()=>{
    console.log(`App is listening to ${Port} developpedd by ${process.env.AUTHOR_NAME}`)
})