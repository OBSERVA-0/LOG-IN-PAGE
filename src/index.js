const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongoDB"); // MongoDB connection

const templatePath = path.join(__dirname, "../templates");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


// Set up Handlebars
app.set("view engine", "hbs");
app.set("views", templatePath);

// Routes
app.get("/", (req, res) => {
    res.render("logIn"); // Render the login page
});
app.get("/logIn", (req, res) => {
    res.render("logIn"); // Render the login page
});

app.get("/signUp", (req, res) => {
    const error = req.query.error; // Extract error message from query parameters
    // console.log("Error message:", error); // Debugging log
    res.render("signUp", { error }); // Pass error to template
});
app.get("/resetpassword", (req, res) => {
    const error = req.query.error; // Extract error message from query parameters
    // console.log("Error message:", error); // Debugging log
    res.render("resetpassword", { error }); // Pass error to template
});


app.post("/logIn", async (req, res) => {
    const { name, password } = req.body;
    let count=5;

    try {
        const user = await collection.findOne({ name });

        if (user) {
            if (user.password === password) {
                res.render("home", { name: user.name });
            } else {
                res.render("logIn", { error: "Wrong password. Please try again. You have"+ count + "tries remaining" });
                count--;
            }
            if(count === 0){{
                res.render("resetpassword",{error: "Please reset your password to continue"})

            }}
        } else {
            res.render("logIn", { error: "Account not found. Please sign up for a new account." });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
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

app.post("/resetpassword",async (req,res) =>{
    const { name, password } = req.body;
    const getuser = collection.await
    
})

// Start the server
app.listen(3000, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log("Server running at http://localhost:3000");
    }
});
