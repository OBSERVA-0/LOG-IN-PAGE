// const express = require("express")
// const app = express()
// const path = require("path")
// const hbs = require("hbs")
// const collection = require("./mongoDB")

// const templatePath = path.join(__dirname,'../templates')

// app.use(express.json())
// app.set("view engine","hbs")
// app.set("views",templatePath)
// app.use(express.urlencoded({extended:false}))

// app.get("/",(req,res)=>{
//     res.render("logIn")
// })
// app.get("/signUp",(req,res)=>{
//     res.render("signUp")
// })

// app.post("/signUp",async(req,res)=>{
//     const data={
//         name:req.body.name,
//         password:req.body.password
//     }
//     await collection.insertMany([data])
//     res.render("home")
// })

// app.listen(3000, (err) => {
//     if (err) {
//         console.error("Error starting server:", err);
//     } else {
//         console.log("Port Connected Successfully");
//     }
// });

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongoDB"); // MongoDB connection

const templatePath = path.join(__dirname, "../templates");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up Handlebars
app.set("view engine", "hbs");
app.set("views", templatePath);

// Routes
app.get("/", (req, res) => {
    res.render("logIn"); // Render the login page
});

// app.get("/signUp", (req, res) => {
//     const error = req.query.error;
//     res.render("signUp"); // Render the signup page
// });

app.post("/logIn", async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await collection.findOne({ name, password });

        if (user) {
            // If user exists, render the home page
            res.render("home", { name: user.name });
        } else {
            // If user does not exist, redirect to signup with an error message
            res.redirect("/signUp?error=Account not found. Please sign up for a new account.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/signUp", (req, res) => {
    const error = req.query.error; // Extract error message from query parameters
    // console.log("Error message:", error); // Debugging log
    res.render("signUp", { error }); // Pass error to template
});



app.post("/signUp", async (req, res) => {
    const { name, password } = req.body;

    try {
        // Insert the new user into the database
        const data = { name, password };
        await collection.insertMany([data]);

        // Render the home page after successful signup
        res.render("home", { name });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(3000, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log("Server running at http://localhost:3000");
    }
});
