const { default: mongoose } = require("mongoose");
const moongose = require("mongoose")

moongose.connect("mongodb://localhost:27017/SignUpDB")
.then(()=>{
    console.log("mongoDb connected");
})
.catch(()=>{
    console.log("failed to connect");
})
const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        requird:true
    },
    password:{
        type:String,
        required:true
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0, 
    },
})


const collection= new moongose.model("Collection1",LogInSchema)
module.exports=collection