document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  function showTab(tabName) {
    tabContents.forEach(content => {
      content.classList.toggle('hidden', content.id !== `${tabName}-tab`);
    });
    tabButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.tab === tabName);
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      showTab(this.dataset.tab);
    });
  });

  showTab('pos'); // Show POS tab by default
});
