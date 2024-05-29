app.get('/pendingbalance', async (req, res) => {
    try {
      const customers = await Customer.find({ balance: { $gt: 0 } });
  
      const formattedCustomers = customers.map(customer => {
        return {
          name: customer.name,
          balance: customer.balance
        };
      });
  
      res.json({
        success: true,
        message: 'Customers with pending balance greater than zero',
        data: formattedCustomers
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error });
    }
  });