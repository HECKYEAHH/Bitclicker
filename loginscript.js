document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('user-form');

  form.addEventListener('submit', function(event) {
      const userName = document.getElementById('user-name').value;
      if (!userName) {
          alert('Please enter your user-name.');
          event.preventDefault();
      }
  });
});
