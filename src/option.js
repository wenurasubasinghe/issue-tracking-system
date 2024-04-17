document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('popup-form');
    const closeButton = document.getElementById('popup-close');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const timeInput = document.getElementById('time-input');
      const dateInput = document.getElementById('date-input');
      const commentInput = document.getElementById('comment-input');
  
      const timeSpent = timeInput.value;
      const dateString = dateInput.value;
      const comment = commentInput.value;
  
      if (!timeSpent || !dateString) {
        alert('Please enter the time spent and date.');
        return;
      }
  
      chrome.runtime.sendMessage({
        action: 'saveTimeEntry',
        data: {
          timeSpent,
          dateString,
          comment
        }
      }, function(response) {
        if (response.success) {
          alert('Time entry saved successfully!');
          form.reset();
        } else {
          alert('Error saving time entry. Please try again.');
        }
      });
    });
  
    closeButton.addEventListener('click', function() {
      window.close();
    });
  });