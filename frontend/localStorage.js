function saveSaleToLocalStorage(sale) {
  let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
  salesData.push(sale);
  localStorage.setItem('salesData', JSON.stringify(salesData));
  loadCustomerList();
  loadCommissionList();
  loadSalesHistory();
}

function loadCustomerList() {
  let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
  let customerData = {};

  salesData.forEach(sale => {
    const { customerName, customerPhone, items } = sale;
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalProfit = items.reduce((sum, item) => sum + (item.price - item.cost) * item.qty, 0);

    if (!customerData[customerPhone]) {
      customerData[customerPhone] = {
        name: customerName,
        totalSpent: 0,
        totalProfit: 0
      };
    }

    customerData[customerPhone].totalSpent += totalPrice;
    customerData[customerPhone].totalProfit += totalProfit;
  });

  const customerList = document.getElementById('customer-list');
  customerList.innerHTML = '';

  for (let phone in customerData) {
    const customer = customerData[phone];
    const div = document.createElement('div');
    div.className = 'p-2 border-b border-gray-200';
    div.innerHTML = `
      <div><strong>Name:</strong> ${customer.name}</div>
      <div><strong>Phone:</strong> ${phone}</div>
      <div><strong>Total Spent:</strong> $${customer.totalSpent.toFixed(2)}</div>
      <div><strong>Total Profit:</strong> $${customer.totalProfit.toFixed(2)}</div>
    `;
    customerList.appendChild(div);
  }
}

function loadCommissionList() {
  let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
  let refererData = {};

  salesData.forEach(sale => {
    const { refererName, refererPhone, items } = sale;
    const totalProfit = items.reduce((sum, item) => sum + (item.price - item.cost) * item.qty, 0);

    if (!refererData[refererPhone]) {
      refererData[refererPhone] = {
        name: refererName,
        totalCommission: 0
      };
    }

    refererData[refererPhone].totalCommission += totalProfit;
  });

  const commissionList = document.getElementById('commission-list');
  commissionList.innerHTML = '';

  for (let phone in refererData) {
    const referer = refererData[phone];
    const div = document.createElement('div');
    div.className = 'p-2 border-b border-gray-200';
    div.innerHTML = `
      <div><strong>Name:</strong> ${referer.name}</div>
      <div><strong>Phone:</strong> ${phone}</div>
      <div><strong>Total Commission:</strong> $${referer.totalCommission.toFixed(2)}</div>
    `;
    commissionList.appendChild(div);
  }
}

function loadSalesHistory() {
  let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
  let groupedSales = {};

  salesData.forEach(sale => {
    const saleDate = sale.date.split('T')[0];

    if (!groupedSales[saleDate]) {
      groupedSales[saleDate] = [];
    }

    groupedSales[saleDate].push(sale);
  });

  const salesHistoryList = document.getElementById('sales-history-list');
  salesHistoryList.innerHTML = '';

  let totalSalesMonth = 0;
  let totalProfitMonth = 0;
  let totalSales = 0;
  let totalProfit = 0;
  const currentMonth = new Date().toISOString().slice(0, 7);

  for (let date in groupedSales) {
    const salesOnDate = groupedSales[date];
    const dateDiv = document.createElement('div');
    dateDiv.className = 'p-2 border-b border-gray-200';
    dateDiv.innerHTML = `<strong>Date:</strong> ${date}`;
    const salesDiv = document.createElement('div');
    salesDiv.className = 'pl-4';

    salesOnDate.forEach(sale => {
      const { customerName, totalQty, totalPrice, items } = sale;
      const totalProfitSale = items.reduce((sum, item) => sum + (item.price - item.cost) * item.qty, 0);
      
      if (sale.date.startsWith(currentMonth)) {
        totalSalesMonth += totalPrice;
        totalProfitMonth += totalProfitSale;
      }

      totalSales += totalPrice;
      totalProfit += totalProfitSale;

      const saleDiv = document.createElement('div');
      saleDiv.innerHTML = `
        <div><strong>Customer:</strong> ${customerName}</div>
        <div><strong>Total Qty:</strong> ${totalQty}</div>
        <div><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</div>
        <div><strong>Total Profit:</strong> $${totalProfitSale.toFixed(2)}</div>
      `;
      salesDiv.appendChild(saleDiv);
    });

    dateDiv.appendChild(salesDiv);
    salesHistoryList.appendChild(dateDiv);
  }

  document.getElementById('monthly-sales').textContent = totalSalesMonth.toFixed(2);
  document.getElementById('monthly-profit').textContent = totalProfitMonth.toFixed(2);
  document.getElementById('total-sales').textContent = totalSales.toFixed(2);
  document.getElementById('total-profit').textContent = totalProfit.toFixed(2);
}

document.getElementById('clear-data').addEventListener('click', function () {
  localStorage.clear();
  loadCustomerList();
  loadCommissionList();
  loadSalesHistory();
    showToast('Data cleared successfully!', 'success');
  

  loadCustomerList();
  loadCommissions();
  loadSalesHistory();
});
