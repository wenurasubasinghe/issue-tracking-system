export function accessKeyModal() {
    fetch(chrome.runtime.getURL('enter-key-modal.html'))
    .then(response => response.text())
    .then(html => {
      const modal = document.createElement('div');
      modal.innerHTML = html;
      document.body.appendChild(modal);

        const accessKeyModal = document.getElementById('accessKeyModal');
        const accessKeyClose = document.getElementById('accessKeyClose');
        const confirmAccessKey = document.getElementById('confirmAccessKey');
        const accessKeyInput = document.getElementById('accessKeyInput');
    
        accessKeyClose.addEventListener('click', () => {
        accessKeyModal.style.display = 'none';
        document.body.removeChild(modal);
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
    })
    .catch(error => {
        alert('Error loading modal');
        console.log('Error loading modal',error);
    });
}