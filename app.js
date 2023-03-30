const express = require("express");
const bodyParser= require("body-parser")
const mongoose = require('mongoose');
const config = require('./config');
const app= express();
const flash = require('connect-flash');
const axios = require('axios');
const multer = require('multer');
const request = require('request');
const ObjectId = require('mongoose').Types.ObjectId;

// Correct usage with `new` keyword

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

app.get("/listofteam.ejs", function(req, res){
    res.render("listofteam.ejs");
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







  
//   // parse incoming form data
//   app.use(bodyParser.urlencoded({ extended: false }));



//   const Member1 = mongoose.model('Member');
//   const membersCollection = Member1.collection;

// //   const membersCollection = mongoose.connection.db.collection('members');

//   app.get('/getlist', (req, res) => {
//     membersCollection.find().toArray(function(err, members) {
//       if (err) throw err;
  
//       const addresses = [];
  
//       members.forEach(member => {
//         const api_url = `https://api.tomtom.com/search/2/reverseGeocode/${member.LocationL},${member.LocationA}.json?key=FINkRW9vyyAfiAXdcsM62UKl64oS17Qj&radius=100`;
  
//         fetch(api_url)
//           .then(response => response.json())
//           .then(data => {
//             const address = data.address.freeformAddress;
//             console.log(address);
//             member.address = address;
  
//             // Save the updated member object to the database
//             membersCollection.save(member);
  
//             // Add the address to the list
//             addresses.push(address);
  
//             // If all addresses have been retrieved, send the response
//             if (addresses.length === members.length) {
//               res.send(addresses);
//             }
//           })
//           .catch(error => console.log(error));
//       });
//     });
//   });
  




const fetch = require('node-fetch');

const membersCollection = mongoose.connection.collection('members');
app.get('/getlist', async (req, res) => {
    try {
      // Retrieve all documents from the members collection
      const members = await membersCollection.find().toArray();
  
      // Loop over each document and make a request to the TomTom API
      const memberAddresses = [];
      for (const member of members) {
        const lat = member.LocationL;
        const lon = member.LocationA;
        const apiKey = 'FINkRW9vyyAfiAXdcsM62UKl64oS17Qj';
        const radius = 100;
      
        const apiUrl = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${apiKey}&radius=${radius}`;
  
        // Make the API request and add the address to the memberAddresses array
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!data.addresses || data.addresses.length === 0) {
          console.log('No address found for', lat, lon);
        } else {
          const address = data.addresses[0].address.freeformAddress;
          memberAddresses.push({ name: member.name, email: member.email,contact: member.contact, address: address });
        }
      }
  
      // Render the HTML template with the memberAddresses array passed as data
      res.render('getlist', { memberAddresses: memberAddresses });
    } catch (error) {
      console.log(error);
      res.send('An error occurred');
    }
  });
  









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