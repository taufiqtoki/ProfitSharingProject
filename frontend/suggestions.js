function getSuggestions(query) {
  const data = JSON.parse(localStorage.getItem('items')) || [];
  return data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
}

function attachSuggestions(input) {
  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'suggestion-box absolute bg-white shadow-md rounded z-10';
  suggestionBox.style.display = 'none';
  document.body.appendChild(suggestionBox);

  input.addEventListener('input', function () {
    const query = input.value.trim();
    const suggestions = getSuggestions(query);
    suggestionBox.innerHTML = '';
    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item p-2 cursor-pointer hover:bg-gray-200';
      suggestionItem.textContent = suggestion.name;
      suggestionItem.addEventListener('click', function () {
        input.value = suggestion.name;
        suggestionBox.style.display = 'none';
      });
      suggestionBox.appendChild(suggestionItem);
    });

    if (suggestions.length > 0) {
      suggestionBox.style.display = 'block';
    } else {
      suggestionBox.style.display = 'none';
    }

    const rect = input.getBoundingClientRect();
    suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionBox.style.left = `${rect.left + window.scrollX}px`;
    suggestionBox.style.width = `${rect.width}px`;
  });

  document.addEventListener('click', function (event) {
    if (!suggestionBox.contains(event.target) && event.target !== input) {
      suggestionBox.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.item-name').forEach(input => {
    attachSuggestions(input);
  });
});
