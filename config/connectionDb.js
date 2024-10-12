const { cache } = require('ejs')
const mongoose=require('mongoose')
console.log("URI_MONGO: "+process.env.MONGODB_UI)
// mongoose.connect(process.env.MONGODB_UI)
// .then((success)=>{
//     console.log('connected to the data base')
// })
// .catch((e)=>{
//     console.log("Coonection Error: "+e)
// })

const connectionDb=async function(){
    try{
        await  mongoose.connect(process.env.MONGODB_UI)
        console.log("connected to the database")
    }catch(e){
        console.log("Connection to the database failed: "+e)
    }
}
module.exports=connectionDb