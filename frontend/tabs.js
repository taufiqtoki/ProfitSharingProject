document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active-tab'));
      button.classList.add('active-tab');
      
      tabContents.forEach(content => {
        content.id === `${targetTab}-tab` ? content.classList.remove('hidden') : content.classList.add('hidden');
      });
    });
  });

  document.getElementById('pos-form').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('add-item').click();
    }
  });
});
