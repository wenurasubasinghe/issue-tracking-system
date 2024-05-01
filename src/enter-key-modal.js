document.addEventListener('DOMContentLoaded', () => {
    const accessKeyModal = document.getElementById('accessKeyModal');
    const accessKeyClose = document.getElementById('accessKeyClose');
    const confirmAccessKey = document.getElementById('confirmAccessKey');
    const accessKeyInput = document.getElementById('accessKeyInput');
  
    accessKeyClose.addEventListener('click', () => {
      accessKeyModal.style.display = 'none';
    });
  
    accessKeyModal.style.display = 'block';
  
    confirmAccessKey.addEventListener('click', () => {
      const accessKey = accessKeyInput.value.trim();
      if (accessKey !== '') {
        localStorage.setItem('accessKey', accessKey);
        accessKeyModal.style.display = 'none';
        showNotification('Access key saved successfully', 'success');
      } else {
        showNotification('Please enter your access key.', 'error');
      }
    });
  });