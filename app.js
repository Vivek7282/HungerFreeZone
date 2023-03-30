const express = require("express");
const bodyParser= require("body-parser")
const mongoose = require('mongoose');
const config = require('./config');
const app= express();
const flash = require('connect-flash');
const axios = require('axios');
const multer = require('multer');

const fs = require('fs');


  
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('assets'))

mongoose.set("strictQuery", false);
mongoose.connect(config.url, config.options)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));
app.get("/", function(req, res){
    console.log("Ok");
    res.render('index');
});
app.get("/Contact_Form_with_Fancy_Header_and_Footer.ejs", function(req, res){
    res.render("Contact_Form_with_Fancy_Header_and_Footer.ejs");
});
app.get("/Contact_Form_with_Fancy_Header_and_Footer1.ejs", function(req, res){
    res.render("Contact_Form_with_Fancy_Header_and_Footer1.ejs");
});
app.get("/Contact_Form_with_Fancy_Header_and_Footer2.ejs", function(req, res){
    res.render("Contact_Form_with_Fancy_Header_and_Footer2.ejs");
});
app.get("/admin.ejs", function(req, res){
    res.render("admin.ejs");
});


const memberSchema= new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    contact: String,
    LocationL: String,
    LocationA: String
  });
  
  // create a model for the data
  const Member = mongoose.model("Member", memberSchema,);
  
  // parse incoming form data
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // handle form submission
  app.post('/submit1', (req, res) => {
    if (!req.body.name || !req.body.email) {
      return res.status(400).send('Name and email are required');
    }
    // create a new message object
    const member = new Member({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      contact: req.body.contact,
      LocationL: req.body.L,
      LocationA: req.body.A
    });
    // save the message to the database
    member.save()
 .then(item => {
 res.redirect('/');
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
  });
 
  



  const helpSchema = new mongoose.Schema({
    name: String,
    address: String,
    contact: String,
    // photo: Buffer, // Change the data type to Buffer
    LocationL: String,
    LocationA: String
  });
  
  // create a model for the data
  const Help = mongoose.model("Help", helpSchema,);
  
  // parse incoming form data
  app.use(bodyParser.urlencoded({ extended: false }));

  
  
  // handle form submission
  app.post('/submit2', (req, res) => {
    // read the photo file as binary data
    // const photoData = fs.readFileSync(req.body.photo);
  
    const help = new Help({
      name: req.body.name,
      address: req.body.address,
    //   photo: photoData, // assign the binary data to the photo field
      contact: req.body.contact,
      LocationL: req.body.Lo,
      LocationA: req.body.La
    });
  
    // save the message to the database
    help.save()
      .then(item => {
        res.redirect('/');
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  });
  





  const donateSchema = new mongoose.Schema({
    name: String,
    address: String,
    contact: String,
    item:String,
    // photo: Buffer, // Change the data type to Buffer
    LocationL: String,
    LocationA: String
  });
  
  // create a model for the data
  const Donate = mongoose.model("Donate", donateSchema,);
  
  // parse incoming form data
  app.use(bodyParser.urlencoded({ extended: false }));

  
  
  // handle form submission
  app.post('/submit3', (req, res) => {
    // read the photo file as binary data
    // const photoData = fs.readFileSync(req.body.photo);
  
    const donate = new Donate({
      name: req.body.name,
      address: req.body.address,
      item: req.body.item,
    //   photo: photoData, // assign the binary data to the photo field
      contact: req.body.contact,
      LocationL: req.body.Lo,
      LocationA: req.body.La
    });
  
    // save the message to the database
    donate.save()
      .then(item => {
        res.redirect('/');
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  });
  







app.listen(3000, function(){
    console.log("Server is started on port : 3000");
})