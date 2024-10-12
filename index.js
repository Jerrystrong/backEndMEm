const express=require('express')
const dotEnv=require('dotenv')
const Cors=require('cors')
const path=require('path')
const connectionDb=require('./config/connectionDb')
const authRouter=require('./routes/authRoute')
const cookieParser = require('cookie-parser')
const app=express()
const Port=process.env.PORT||4005
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
    optionsSuccessStatus:200
}
connectionDb()
// all middleware
app.use(express.static(path.join(__dirname,'public')))
app.use(Cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({extends:false}))
app.use(cookieParser())
app.use(authRouter)
app.all('*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'/views','/404.html'))
})
app.listen(Port,()=>{
    console.log(`App is listening to ${Port} developpedd by ${process.env.AUTHOR_NAME}`)
})