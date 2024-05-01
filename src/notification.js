export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
  
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('notification-progress');
  
    const progressBar = document.createElement('div');
    progressBar.classList.add('notification-progress-bar');
    progressContainer.appendChild(progressBar);
  
    notification.appendChild(progressContainer);
  
    const container = document.createElement('div');
    container.classList.add('notification-container');
    container.appendChild(notification);
  
    document.body.appendChild(container);
  
    setTimeout(() => {
      container.remove();
    }, 3000);
  }