const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")

const templatePath = path.join(__dirname,'../templates')

app.use(express.json())
app.set("view engiine","hbs")
app.set("view",templatePath)

app.get("/",(req,res)=>{
    res.render("logIn")
})
app.get("/signUp",(req,res)=>{
    res.render("signUp")
})

app.listen(3000, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log("Port Connected Successfully");
    }
});