const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const hostname = '0.0.0.0';


// Middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.json());

var up = '';

// MongoDB setup
mongoose.connect('mongodb+srv://sanchitbajaj2003:root@cluster0.n0euieh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Customer schema with updated fields for date and time
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    frame: String,
    glasses: String,
    contactlens: String,
    remark: String,
    prescription: {
        right: {
            sph: String,
            cyl: String,
            axis: String,
            prism: String
        },
        left: {
            sph: String,
            cyl: String,
            axis: String,
            prism: String
        }
    },
    dateAdded: String, // Store date when customer is added
    timeAdded: String  // Store time when customer is added
});

const Customer = mongoose.model('Customer', customerSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.post('/update', (req, res) => {
    const { name } = req.body;
    // Use the name to perform further operations, such as fetching the customer's details from the database
    console.log('Received customer name:', name);
    up = name;
    console.log(up);
    res.redirect('/update');
});

app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, 'update.html'));
});

app.post('/add-customer', async (req, res) => {
    console.log(req.body); // Log the entire request body to check if the prescription data is present
    const currentDate = new Date();
    var date=currentDate.toLocaleDateString()
    // Extract data from request body
    const { name, phone, frame, glasses, contactlens, remark, 'right-sph': rightSph, 'right-cyl': rightCyl, 'right-axis': rightAxis, 'right-prism': rightPrism, 'left-sph': leftSph, 'left-cyl': leftCyl, 'left-axis': leftAxis, 'left-prism': leftPrism } = req.body;

    // Create a new customer object
    const newCustomer = new Customer({
        name,
        phone,
        frame,
        glasses,
        contactlens,
        remark,
        prescription: {
            right: { sph: rightSph, cyl: rightCyl, axis: rightAxis, prism: rightPrism },
            left: { sph: leftSph, cyl: leftCyl, axis: leftAxis, prism: leftPrism }
        },
         dateAdded:date ,
         timeAdded: currentDate.toLocaleTimeString(),
    });
    
    // Set the current date and time

    
    // Save the new customer to the database
    await newCustomer.save();
    res.status(201).send('Customer added');
});

app.get('/customers', async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
});

app.get('/get-customer', async (req, res) => {
    try {
        const customer = await Customer.findOne({ name: up });
        if (customer) {
            console.log(customer);
            res.json(customer);
        } else {
            res.status(404).send('Customer not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const server = app.listen(process.env.PORT || 3000, hostname, () => {
    console.log("listening");
});
