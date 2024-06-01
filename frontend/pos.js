document.addEventListener('DOMContentLoaded', () => {
  const posForm = document.getElementById('pos-form');
  const posItems = document.getElementById('pos-items');
  const addItemButton = document.getElementById('add-item');
  const removeItemButton = document.getElementById('remove-item');
  const productsTotal = document.getElementById('products-total');
  const totalPrice = document.getElementById('total-price');
  let itemIndex = 1;

  addItemButton.addEventListener('click', addItem);
  posForm.addEventListener('submit', submitSale);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addItem();
    }
    if (event.key === 'Delete') {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.closest('tr')) {
        focusedElement.closest('tr').remove();
        reSequenceItems();
        recalculateTotals();
      }
    }
  });

  function addItem() {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border px-4 py-2 item-number">${itemIndex++}</td>
      <td class="border px-4 py-2"><input type="text" class="item-name w-full p-2 border rounded" data-type="items"></td>
      <td class="border px-4 py-2"><input type="number" class="item-price w-full p-2 border rounded"></td>
      <td class="border px-4 py-2"><input type="number" class="item-qty w-full p-2 border rounded" value="1"></td>
      <td class="border px-4 py-2"><input type="number" class="item-cpp w-full p-2 border rounded"></td>
      <td class="border px-4 py-2"><input type="number" class="item-total w-full p-2 border rounded" readonly></td>
      <td class="border px-4 py-2"><button type="button" class="remove-row bg-red-500 text-white px-2 py-1 rounded">Delete</button></td>
    `;
    posItems.appendChild(row);

    row.querySelector('.item-name').addEventListener('input', showSuggestions);
    row.querySelector('.item-qty').addEventListener('input', calculateTotal);
    row.querySelector('.item-price').addEventListener('input', calculateTotal);
    row.querySelector('.item-cpp').addEventListener('input', calculateTotal);
    row.querySelector('.remove-row').addEventListener('click', () => {
      row.remove();
      reSequenceItems();
      recalculateTotals();
    });

    row.querySelector('.item-qty').addEventListener('input', calculateTotal);
    row.querySelector('.item-price').addEventListener('input', calculateTotal);
    row.querySelector('.item-cpp').addEventListener('input', calculateTotal);
  }

  function reSequenceItems() {
    itemIndex = 1;
    posItems.querySelectorAll('tr').forEach(row => {
      row.querySelector('.item-number').textContent = itemIndex++;
    });
  }

  function calculateTotal(event) {
    const row = event.target.closest('tr');
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const cpp = parseFloat(row.querySelector('.item-cpp').value) || 0;
    const total = price * qty;
    const profit = total - (cpp * qty);
    row.querySelector('.item-total').value = total.toFixed(2);
    recalculateTotals();
  }

  function recalculateTotals() {
    let totalItems = 0;
    let totalAmount = 0;

    posItems.querySelectorAll('tr').forEach(row => {
      const total = parseFloat(row.querySelector('.item-total').value) || 0;
      totalItems++;
      totalAmount += total;
    });

    productsTotal.textContent = totalItems;
    totalPrice.textContent = totalAmount.toFixed(2);
  }

  function submitSale(event) {
    event.preventDefault();
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const refererName = document.getElementById('referer-name').value.trim();
    const refererPhone = document.getElementById('referer-phone').value.trim();

    if (!customerName || !customerPhone) {
      showToast('Customer details are required.', 'error');
      return;
    }

    const items = [];
    posItems.querySelectorAll('tr').forEach(row => {
      const itemName = row.querySelector('.item-name').value.trim();
      const itemPrice = parseFloat(row.querySelector('.item-price').value) || 0;
      const itemQty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const itemCpp = parseFloat(row.querySelector('.item-cpp').value) || 0;
      const itemTotal = parseFloat(row.querySelector('.item-total').value) || 0;
      if (itemName && itemPrice && itemQty) {
        items.push({
          name: itemName,
          price: itemPrice,
          qty: itemQty,
          cpp: itemCpp,
          total: itemTotal
        });
      }
    });

    if (items.length === 0) {
      showToast('At least one item is required.', 'error');
      return;
    }

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const orderId = Date.now().toString();
    const date = new Date().toISOString().split('T')[0];
    const totalSales = items.reduce((acc, item) => acc + item.total, 0);
    const totalProfit = items.reduce((acc, item) => acc + (item.total - (item.qty * item.cpp)), 0);

    salesHistory.push({
      orderId,
      date,
      customer: customerName,
      referer: refererName,
      totalSales,
      totalProfit,
      items
    });
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    updateCustomer(customerName, customerPhone, totalSales, totalProfit);
    updateReferer(refererName, refererPhone, totalSales);

    showToast('Sale submitted successfully', 'success');
    posForm.reset();
    posItems.innerHTML = '';
    itemIndex = 1;
    recalculateTotals();
    loadSalesHistory();
  }

  function updateCustomer(name, phone, totalPurchased, totalProfit) {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
      customer.totalPurchased += totalPurchased;
      customer.totalProfit += totalProfit;
    } else {
      customers.push({ name, phone, totalPurchased, totalProfit });
    }
    localStorage.setItem('customers', JSON.stringify(customers));
    loadCustomerList();
  }

  function updateReferer(name, phone, commission) {
    const referers = JSON.parse(localStorage.getItem('referers')) || [];
    const referer = referers.find(r => r.phone === phone);
    if (referer) {
      referer.commission += commission;
    } else {
      referers.push({ name, phone, commission });
    }
    localStorage.setItem('referers', JSON.stringify(referers));
    loadRefererList();
  }

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function showSuggestions(event) {
    // Implement suggestions dropdown logic
  }

  function loadSalesHistory() {
    // Implement loading sales history logic
  }

  function loadCustomerList() {
    // Implement loading customer list logic
  }

  function loadRefererList() {
    // Implement loading referer list logic
  }

  addItem(); // Add one row by default when the page loads
});
