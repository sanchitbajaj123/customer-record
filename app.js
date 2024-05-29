const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const hostname = '0.0.0.0';
const moment = require('moment-timezone');

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
    phone: String,
    frame: String,
    glasses: String,
    contactlens: String,
    remark: String,
    prescription: {
        right: {
            sphDV: String,
            cylDV: String,
            axisDV: String,
            prismDV: String,
            sphNV: String,
            cylNV: String,
            axisNV: String,
            prismNV: String,
            add: String
        },
        left: {
            sphDV: String,
            cylDV: String,
            axisDV: String,
            prismDV: String,
            sphNV: String,
            cylNV: String,
            axisNV: String,
            prismNV: String,
            add: String
        }
    },
    total: Number,
    advance: Number,
    balance: Number,
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
    console.log('Received customer id:', name);
    up = name;
    console.log(up);
    res.redirect('/update');
});

app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, 'update.html'));
});

app.post('/add-customer', async (req, res) => {
    console.log(req.body); // Log the entire request body to check if the prescription data is present
    const currentDate = moment().tz('Asia/Kolkata'); // Set to India time zone
    const date = currentDate.format('DD/MM/YYYY'); // Format date as needed
    const time = currentDate.format('HH:mm:ss'); // Format time as needed
    // Extract data from request body
    const { name, phone, frame, glasses, contactlens, remark, 'right-sph-dv': rightSphDV, 'right-cyl-dv': rightCylDV, 'right-axis-dv': rightAxisDV, 'right-prism-dv': rightPrismDV, 'right-sph-nv': rightSphNV, 'right-cyl-nv': rightCylNV, 'right-axis-nv': rightAxisNV, 'right-prism-nv': rightPrismNV, 'right-add': rightAdd, 'left-sph-dv': leftSphDV, 'left-cyl-dv': leftCylDV, 'left-axis-dv': leftAxisDV, 'left-prism-dv': leftPrismDV, 'left-sph-nv': leftSphNV, 'left-cyl-nv': leftCylNV, 'left-axis-nv': leftAxisNV, 'left-prism-nv': leftPrismNV, 'left-add': leftAdd, total, advance, balance } = req.body;

    // Create a new customer object
    const newCustomer = new Customer({
        name,
        phone,
        frame,
        glasses,
        contactlens,
        remark,
        prescription: {
            right: {
                sphDV: rightSphDV,
                cylDV: rightCylDV,
                axisDV: rightAxisDV,
                prismDV: rightPrismDV,
                sphNV: rightSphNV,
                cylNV: rightCylNV,
                axisNV: rightAxisNV,
                prismNV: rightPrismNV,
                add: rightAdd
            },
            left: {
                sphDV: leftSphDV,
                cylDV: leftCylDV,
                axisDV: leftAxisDV,
                prismDV: leftPrismDV,
                sphNV: leftSphNV,
                cylNV: leftCylNV,
                axisNV: leftAxisNV,
                prismNV: leftPrismNV,
                add: leftAdd
            }
        },
        total,
        advance,
        balance,
        dateAdded: date,
        timeAdded: time,
    });

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
        const customer = await Customer.findOne({ _id: up });
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
app.get('/delete', async (req, res) => {
    console.log("delete")
    console.log(up)
    try {
            await Customer.deleteOne({ _id: up });
            
            res.redirect('/home')
  
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/balanceclear',async (req, res) => {
    const currentDate = moment().tz('Asia/Kolkata'); // Set to India time zone
    const date = currentDate.format('DD/MM/YYYY'); // Format date as needed
    const customer = await Customer.findOne({ _id: up })
    customer.remark = "Balance("+customer.balance +") cleared successfully on "+date
    customer.balance = 0;
    await customer.save();
    res.redirect('/home')
});
app.get('/pendingbalance', async (req, res) => {
    try {
      const customers = await Customer.find({ balance: { $gt: 0 } });
        res.json(customers);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error });
    }
  });
  app.get('/pending',(req, res) => {
    res.sendFile(path.join(__dirname, 'pending.html'));
 
})
  
const server = app.listen(process.env.PORT || 3000, hostname, () => {
    console.log("listening");
});
