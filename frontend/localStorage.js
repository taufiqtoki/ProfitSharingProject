document.addEventListener('DOMContentLoaded', () => {
  const clearDataButton = document.getElementById('clear-data');
  
  clearDataButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data?')) {
      localStorage.clear();
      showToast('Data cleared successfully');
      loadCustomerList();
      loadRefererList();
      loadSalesHistory();
    }
  });

  loadCustomerList();
  loadRefererList();
  loadSalesHistory();

  function loadCustomerList() {
    const customerList = document.getElementById('customer-list');
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    customerList.innerHTML = '';
    customers.forEach(customer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${customer.name}</td>
        <td class="border px-4 py-2">${customer.phone}</td>
        <td class="border px-4 py-2">$${customer.totalPurchased.toFixed(2)}</td>
        <td class="border px-4 py-2">$${customer.totalProfit.toFixed(2)}</td>
      `;
      customerList.appendChild(row);
    });
  }

  function loadRefererList() {
    const refererList = document.getElementById('referer-list');
    const referers = JSON.parse(localStorage.getItem('referers')) || [];
    refererList.innerHTML = '';
    referers.forEach(referer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${referer.name}</td>
        <td class="border px-4 py-2">${referer.phone}</td>
        <td class="border px-4 py-2">$${referer.commission.toFixed(2)}</td>
      `;
      refererList.appendChild(row);
    });
  }

  function loadSalesHistory() {
    const salesHistoryList = document.getElementById('sales-history-list');
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    salesHistoryList.innerHTML = '';
    salesHistory.forEach((sale, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${sale.date}</td>
        <td class="border px-4 py-2">${index + 1}</td>
        <td class="border px-4 py-2">${sale.customer}</td>
        <td class="border px-4 py-2">$${sale.totalSales.toFixed(2)}</td>
        <td class="border px-4 py-2">$${sale.totalProfit.toFixed(2)}</td>
        <td class="border px-4 py-2"><button class="view-details" data-id="${sale.orderId}">View Details</button></td>
      `;
      salesHistoryList.appendChild(row);
    });

    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', (e) => {
        const orderId = e.target.dataset.id;
        const sale = salesHistory.find(s => s.orderId === orderId);
        if (sale) {
          showModal(sale);
        }
      });
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function showModal(sale) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center';
    modal.innerHTML = `
      <div class="bg-white rounded p-4">
        <h2 class="text-xl mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> ${sale.orderId}</p>
        <p><strong>Date:</strong> ${sale.date}</p>
        <p><strong>Customer:</strong> ${sale.customer}</p>
        <p><strong>Referer:</strong> ${sale.referer}</p>
        <p><strong>Total Sales:</strong> $${sale.totalSales.toFixed(2)}</p>
        <p><strong>Total Profit:</strong> $${sale.totalProfit.toFixed(2)}</p>
        <h3 class="text-lg mt-4">Items</h3>
        <ul>
          ${sale.items.map(item => `
            <li>${item.name} - $${item.price} x ${item.qty} = $${item.total}</li>
          `).join('')}
        </ul>
        <button class="mt-4 px-4 py-2 bg-red-500 text-white rounded close-modal">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
  }
});
