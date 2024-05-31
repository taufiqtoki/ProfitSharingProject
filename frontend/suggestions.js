document.addEventListener('DOMContentLoaded', () => {
  const customerPhoneInput = document.getElementById('customer-phone');
  const refererPhoneInput = document.getElementById('referer-phone');
  const itemNameInputs = document.querySelectorAll('.item-name');

  customerPhoneInput.addEventListener('input', () => showSuggestions(customerPhoneInput, 'customers'));
  refererPhoneInput.addEventListener('input', () => showSuggestions(refererPhoneInput, 'referers'));
  itemNameInputs.forEach(input => input.addEventListener('input', () => showSuggestions(input, 'items')));

  function showSuggestions(input, type) {
    const value = input.value.toLowerCase();
    const suggestionsDropdown = createSuggestionsDropdown(input);
    suggestionsDropdown.innerHTML = '';

    let suggestions = [];
    if (type === 'customers' || type === 'referers') {
      const data = JSON.parse(localStorage.getItem(type)) || [];
      suggestions = data.filter(item => item.phone.toLowerCase().includes(value));
    } else if (type === 'items') {
      const items = JSON.parse(localStorage.getItem('items')) || [];
      suggestions = items.filter(item => item.name.toLowerCase().includes(value));
    }

    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      if (type === 'customers' || type === 'referers') {
        li.textContent = `${suggestion.phone} (${suggestion.name})`;
        li.addEventListener('click', () => {
          input.value = suggestion.phone;
          if (type === 'customers') {
            document.getElementById('customer-name').value = suggestion.name;
          } else {
            document.getElementById('referer-name').value = suggestion.name;
          }
          suggestionsDropdown.remove();
        });
      } else if (type === 'items') {
        li.textContent = `${suggestion.name} ($${suggestion.price})`;
        li.addEventListener('click', () => {
          input.value = suggestion.name;
          const row = input.closest('tr');
          row.querySelector('.item-price').value = suggestion.price;
          suggestionsDropdown.remove();
        });
      }
      suggestionsDropdown.appendChild(li);
    });
  }

  function createSuggestionsDropdown(input) {
    let suggestionsDropdown = input.nextElementSibling;
    if (suggestionsDropdown && suggestionsDropdown.classList.contains('suggestions-dropdown')) {
      suggestionsDropdown.remove();
    }
    suggestionsDropdown = document.createElement('ul');
    suggestionsDropdown.className = 'suggestions-dropdown';
    input.parentNode.appendChild(suggestionsDropdown);
    return suggestionsDropdown;
  }
});
