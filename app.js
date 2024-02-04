const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const hbs = require("hbs");
const path = require('path');

const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
var database

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
 



app.use(express.static(path.join(__dirname)));
mongoose.connect("mongodb://localhost:27017/hackathonDB");



const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
})

const complaintSchema = new mongoose.Schema({
    name: String,
    title: String,
    complaint: String,
    state: String,
    city: String,
    pincode: Number
})
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

const User = new mongoose.model("User", userSchema);
const Admin = new mongoose.model("Admin", adminSchema);
const Complaint = new mongoose.model("Complaint", complaintSchema);
const Contact = new mongoose.model("Contact", contactSchema);

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/home", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/userLanding", function (req, res) {
    res.render("userLanding");
});
app.get("/register", function (req, res) {
    res.render("register");
});
var database
app.get("/adminRegister", function (req, res) {
    res.render("adminRegister");
});
app.get("/adminLogin", function (req, res) {
    res.render("adminLogin");
})
app.get("/logout", function (req, res) {
    res.render("home");
})
app.get("/dashboard", async function (req, res) {
    try {
        const complaints = await Complaint.find({}).exec();
        res.render("dashboard.hbs", { data: complaints });
    } catch (err) {
        console.error(err);
        res.render("error"); // Handle errors appropriately
    }
});
app.get("/about", function (req, res) {
    res.render("about");
})
app.get("/contact", function (req, res) {
    res.render("contact");
})
 
app.get("/complaints", function (req, res) {
    res.render("complaints");
})

app.post("/complaints", function (req, res) {
    const complaint = new Complaint({
        name: req.body.userName,
        title: req.body.complaintTitle,
        complaint: req.body.complaint,
        state: req.body.state,
        city: req.body.city,
        pincode: req.body.pincode
    })

    complaint.save();

    res.send("Request published successfully!");
})
app.post("/contact", function(req,res){
    const contact = new Contact({
        name: req.body.name,
        email: req.body.title,
        subject: req.body.subject,
        message: req.body.message
    })

    contact.save();
    res.send("Your Message has been saved");
})
app.get("/complaints", function (req, res) {
    // Fetch all complaints from the database
    Complaint.find({}, function (err, complaints) {
        if (err) {
            console.log(err);
            res.render("error"); // Handle errors appropriately
        } else {``
            // Render the "complaints" template with the fetched data
            res.render("complaints", { complaints: complaints });
        }
    });
});



app.post("/dashboard", function (req, res) {
    res.render("dashboard")
})

app.post("/adminLogin", function (req, res) {
    const adminname = req.body.adminUsername;
    const adminpassword = req.body.adminPassword;

    Admin.findOne({ email: adminname }).then(function (foundUser) {
        try {
            if (foundUser.password === adminpassword) {
                res.redirect("dashboard");
            }
            else {
                res.render("adminLogin");
            }
        }
        catch (err) {
            res.render("adminLogin");
        }
    })
})

app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(function (foundUser) {
        try {
            if (foundUser.password === password) {
                res.render("userLanding");
            }
            else {
                res.render("login");
            }
        }
        catch (err) {
            res.render("login");
        }
    })
})
 
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function (err) {
        if (err) {
            console.log(err);
        }
        res.render("userLanding");
    })
})

app.delete('/delete/:itemId', async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const deletedItem = await Complaint.findByIdAndDelete(itemId);
  
      if (!deletedItem) {
        return res.json({ success: false, error: 'Item not found.' });
      }
  
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error deleting item.' });
    }
  });









app.listen(3000, function () {
    console.log("Server started on port 3000");
})