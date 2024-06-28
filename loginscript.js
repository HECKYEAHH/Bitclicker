document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('user-form');

  form.addEventListener('submit', function(event) {
      event.preventDefault();
      const userName = document.getElementById('user-name').value;
      if (!userName) {
          alert('Please enter your user-name.');
      } else {
          localStorage.setItem('username', userName);
          window.location.href = 'idle.html'; // Redirect to the BitClicker game page
      }
  });
});
