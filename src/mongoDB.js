const moongose = require("mongoose")

moongose.connect("mongodb: //localhost:27017/---name of databse")
.then(()=>{
    console.log("mongoDb connected");
})
.catch(()=>{
    console.log("failed to connect");
})