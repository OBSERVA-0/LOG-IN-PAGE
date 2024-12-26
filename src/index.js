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


const bcrypt = require('bcrypt');

app.post("/logIn", async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await collection.findOne({ name:name.toLowerCase() });

        if (!user) {
            return res.render("signUp", { 
                error: "Account not found. Please sign up for a new account." 
            });
        }

        if (user.loginAttempts > 5) {
            return res.render("resetpassword", { 
                error: "You have attempted to log in too many times. Please reset your password." 
            });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);

        // if (isMatch) {
        //     await collection.updateOne({ name.toLowerCase()}, { $set: { loginAttempts: 0 } });
        //     return res.render("home", { name });
        // }
        if (isMatch) {
            await collection.updateOne(
                 { name: name.toLowerCase()},  // Match case-insensitive username
                 { $set: {loginAttempts: 0 } }
             );    
                return res.render("home", { name });
         }

        // Handle wrong password
        const newAttempts = user.loginAttempts + 1;
        await collection.updateOne({ name:name.toLowerCase() }, { $set: { loginAttempts: newAttempts } });
        
        res.render("logIn", { 
            error: `Wrong password. You have ${5 - newAttempts} tries remaining.` 
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/signUp", async (req, res) => {
    const { name, password } = req.body;
    
    // if (!name || !password) {
    //     return res.render("signUp", {
    //         error: "Both username/email and password are required.",
    //     });
    // }

    try {
        // Check if user already exists
        const existingUser = await collection.findOne({ name });
        if (existingUser) {
            return res.render("signUp", { 
                error: "Username already exists. Please choose a different one." 
            });
        }

        // Hash password before storing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user with hashed password
        await collection.insertMany({ 
            name: name.toLowerCase(),  // Ensure the field is consistent
            password: hashedPassword,
            loginAttempts: 0 
        });

        res.render("home", { name });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/resetpassword", async (req, res) => {
    const { name, newPassword } = req.body;

    if (!name || !newPassword) {
        return res.render("resetpassword", {
            error: "Both username/email and new password are required.",
        });
    }

    try {
        // console.log("Request body:", { name, passwordLength: newPassword?.length });
        
        const user = await collection.findOne({ name });
        // console.log("User found:", !!user);
        
        if (!user) {
            return res.render("signUp", {
                error: "Account not found. Please sign up for a new account.",
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // console.log("Password hashed successfully");

        const updateResult = await collection.updateOne(
            { name: name.toLowerCase()},  // Match case-insensitive username
            { $set: { password: hashedPassword, loginAttempts: 0 } }
        );
        // console.log("Update result:", updateResult);

        res.render("logIn", {
            error: "Password reset successful. Please log in with your updated password.",
        });
    } catch (error) {
        console.error("Detailed error:", error.message);
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
