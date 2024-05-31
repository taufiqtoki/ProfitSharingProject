const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('frontend'));

let database = {
  customers: [],
  referers: [],
  orders: [],
  items: []
};

// Load existing data if available
if (fs.existsSync('data.json')) {
  const data = fs.readFileSync('data.json');
  database = JSON.parse(data);
}

// Utility function to convert string to camel case
function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ''; // remove spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

// Save database to data.json
function saveDatabase() {
  fs.writeFileSync('data.json', JSON.stringify(database, null, 2));
}

app.post('/api/sale', (req, res) => {
  const sale = req.body;

  // Process customer
  let customer = database.customers.find(c => c.phone === sale.customerPhone);
  if (!customer) {
    customer = {
      id: database.customers.length + 1,
      name: toCamelCase(sale.customerName),
      phone: sale.customerPhone,
      totalSpent: 0,
      totalProfit: 0
    };
    database.customers.push(customer);
  }

  // Process referer
  let referer = database.referers.find(r => r.phone === sale.refererPhone);
  if (!referer) {
    referer = {
      id: database.referers.length + 1,
      name: toCamelCase(sale.refererName),
      phone: sale.refererPhone,
      totalProfitFromReferrals: 0,
      balance: 0
    };
    database.referers.push(referer);
  }

  // Calculate total order price and total profit for this order
  let totalOrderPrice = 0;
  let totalOrderProfit = 0;
  sale.items.forEach(item => {
    const itemPrice = parseFloat(item.itemPrice);
    const itemQty = parseFloat(item.itemQty);
    const itemCost = parseFloat(item.itemCost);
    totalOrderPrice += itemPrice * itemQty;
    totalOrderProfit += (itemPrice - itemCost) * itemQty;

    // Process item
    let existingItem = database.items.find(i => i.name === toCamelCase(item.itemName));
    if (!existingItem) {
      existingItem = {
        id: database.items.length + 1,
        name: toCamelCase(item.itemName),
        sellingPrice: itemPrice,
        costPrice: itemCost
      };
      database.items.push(existingItem);
    } else {
      existingItem.sellingPrice = itemPrice;
      existingItem.costPrice = itemCost;
    }
  });

  // Create order
  const order = {
    id: database.orders.length + 1,
    customerName: toCamelCase(sale.customerName),
    customerPhone: sale.customerPhone,
    totalPrice: totalOrderPrice,
    totalProfit: totalOrderProfit,
    items: sale.items.map(item => ({
      name: toCamelCase(item.itemName),
      price: parseFloat(item.itemPrice),
      qty: parseFloat(item.itemQty),
      cost: parseFloat(item.itemCost)
    }))
  };
  database.orders.push(order);

  // Update customer and referer details
  customer.totalSpent += totalOrderPrice;
  customer.totalProfit += totalOrderProfit;
  referer.totalProfitFromReferrals += totalOrderProfit;
  referer.balance += totalOrderProfit;

  // Save database
  saveDatabase();

  res.send('Sale recorded');
});

app.get('/api/sales', (req, res) => {
  res.json(database.orders);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
