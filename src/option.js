import './notification.css';
import { showNotification } from './notification';

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
        showNotification('Access key saved successfully', 'success');
      } else {
        showNotification('Please enter your access key.', 'error');
      }
    });
  
    closeButton.addEventListener('click', function() {
      window.close();
    });
  });