document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('popup-form');
    const closeButton = document.getElementById('popup-close');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const keyInput = document.getElementById('key-input');
  
      const accessKey = keyInput.value.trim();
  
      if (accessKey != null) {
        localStorage.setItem('accessKey', accessKey);
        form.style.display = 'none';
        alert('Access key saved successfully');
      } else {
        alert('Please enter your access key.');
      }
    });
  
    closeButton.addEventListener('click', function() {
      window.close();
    });
  });