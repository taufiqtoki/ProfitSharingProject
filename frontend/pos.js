document.addEventListener('DOMContentLoaded', function () {
  const posItemsTableBody = document.getElementById('pos-items');
  const addItemButton = document.getElementById('add-item');
  const removeItemButton = document.getElementById('remove-item');
  const totalQtyElement = document.getElementById('products-total');
  const totalPriceElement = document.getElementById('total-price');

  function addItem() {
    const rowCount = posItemsTableBody.rows.length + 1;
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="item-number p-2 border border-gray-300">${rowCount}</td>
      <td class="p-2 border border-gray-300"><input type="text" class="item-name w-full border p-2 rounded"></td>
      <td class="p-2 border border-gray-300"><input type="number" class="item-price w-full border p-2 rounded" step="0.01"></td>
      <td class="p-2 border border-gray-300"><input type="number" class="item-qty w-full border p-2 rounded" value="1" step="1"></td>
      <td class="p-2 border border-gray-300"><input type="number" class="item-cost w-full border p-2 rounded" step="0.01"></td>
      <td class="p-2 border border-gray-300"><input type="number" class="item-total-price w-full border p-2 rounded" readonly></td>
    `;

    posItemsTableBody.appendChild(row);

    row.querySelector('.item-price').addEventListener('input', calculateRowTotal);
    row.querySelector('.item-qty').addEventListener('input', calculateRowTotal);
    row.querySelector('.item-cost').addEventListener('input', calculateRowTotal);

    attachSuggestions(row.querySelector('.item-name'));
    updateTotals();
  }

  function removeItem() {
    if (posItemsTableBody.rows.length > 0) {
      posItemsTableBody.deleteRow(posItemsTableBody.rows.length - 1);
      updateTotals();
    }
  }
  
  function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
  }, 3000)}
  

  function calculateRowTotal(event) {
    const row = event.target.closest('tr');
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const qty = parseInt(row.querySelector('.item-qty').value) || 1;
    const total = price * qty;

    row.querySelector('.item-total-price').value = total.toFixed(2);
    updateTotals();
  }

  function updateTotals() {
    let totalQty = 0;
    let totalPrice = 0;

    posItemsTableBody.querySelectorAll('tr').forEach(row => {
      const qty = parseInt(row.querySelector('.item-qty').value) || 1;
      const total = parseFloat(row.querySelector('.item-total-price').value) || 0;

      totalQty += qty;
      totalPrice += total;
    });

    totalQtyElement.textContent = totalQty;
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }

  function resetForm() {
    document.getElementById('customer-form').reset();
    posItemsTableBody.innerHTML = '';
    addItem(); // Add initial row
    updateTotals();
  }

  addItemButton.addEventListener('click', addItem);
  removeItemButton.addEventListener('click', removeItem);
  document.getElementById('customer-form').addEventListener('submit', function (event) {
    event.preventDefault();
    saveSale();
    resetForm();
  });

  function saveSale() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const refererName = document.getElementById('referer-name').value.trim();
    const refererPhone = document.getElementById('referer-phone').value.trim();

    const items = [];
    posItemsTableBody.querySelectorAll('tr').forEach(row => {
      const itemName = row.querySelector('.item-name').value.trim();
      const itemPrice = parseFloat(row.querySelector('.item-price').value) || 0;
      const itemQty = parseInt(row.querySelector('.item-qty').value) || 1;
      const itemCost = parseFloat(row.querySelector('.item-cost').value) || 0;
      const itemTotalPrice = parseFloat(row.querySelector('.item-total-price').value) || 0;

      items.push({
        name: itemName,
        price: itemPrice,
        qty: itemQty,
        cost: itemCost,
        totalPrice: itemTotalPrice
      });
    });

    const sale = {
      customerName,
      customerPhone,
      refererName,
      refererPhone,
      items,
      totalQty: parseInt(totalQtyElement.textContent),
      totalPrice: parseFloat(totalPriceElement.textContent),
      date: new Date().toISOString()
    };

    saveSaleToLocalStorage(sale);
    showToast('Sale recorded successfully', 'success');
  }

  addItem(); // Add initial row

  // Handle delete row using keyboard
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete' && document.activeElement.tagName !== 'INPUT') {
      removeItem();
    }
  });
});
