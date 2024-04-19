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
        alert('Access key saved successfully');
      } else {
        alert('Please enter your access key.');
      }
    });
  });