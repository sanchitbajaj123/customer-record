const express = require('express');
const path = require('path');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;


// Middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.json());

var up=0




// MongoDB setup
mongoose.connect('mongodb://localhost:27017/misha_eye_care', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
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
    up=name
    console.log(up)

    // Send a response as needed
});
app.get('/update',(req,res)=>{
    res.sendFile(path.join(__dirname, 'update.html'));
});

app.post('/add-customer', async (req, res) => {
    const { name, email, phone } = req.body;
    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();

    res.status(201).send('Customer added');
});



app.get('/customers', async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
});
app.get('/get-customer', async (req, res) => {
    const { name } = up;
    try {
        const customer = await Customer.findOne({ name });
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send('Customer not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
