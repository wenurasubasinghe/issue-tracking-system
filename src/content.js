import { accessKeyModal } from "./enter-key-modal";

const apiBaseUrl = 'http://localhost:3010/external-intergrations/employee-tracker';
let timerInterval;
let isFirstClick = true;

export const activityTypes = {
  'Lunch': 1,
  'Meeting': 2
};

const activityDetails = {
  startTime: null,
  endTime: null
};

function renderButtons() {
  setTimeout(() => {
    const sidebarContainer = document.querySelector('#partial-discussion-sidebar');

    if (sidebarContainer) {
      const assigneesSidebarItem = sidebarContainer.querySelector('.sidebar-assignee');

      if (assigneesSidebarItem) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('discussion-sidebar-item', 'timetracker-buttons');

        const labelHeader = document.createElement('h3');
        labelHeader.textContent = 'Time Tracker';
        labelHeader.classList.add('discussion-sidebar-heading', 'discussion-sidebar-toggle');
        buttonsContainer.appendChild(labelHeader);

        const startButton = document.createElement('button');
        startButton.classList.add('btn', 'btn-sm', 'ev-btn-start', 'btn-primary', 'mr-1');
        startButton.textContent = 'Start Timer';
        startButton.addEventListener('click', () => startTimer(buttonsContainer));
        buttonsContainer.appendChild(startButton);

        const stopTimeButton = document.createElement('button');
        stopTimeButton.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1');
        stopTimeButton.textContent = 'Stop Time';
        stopTimeButton.addEventListener('click', () => stopTimer(buttonsContainer));
        buttonsContainer.appendChild(stopTimeButton);

        assigneesSidebarItem.parentNode.insertBefore(buttonsContainer, assigneesSidebarItem.nextSibling);
      }
    }
  }, 500);
}

function isGitHubIssuePage() {
  const issueDetailsElement = document.querySelector('.gh-header-show');
  return !!issueDetailsElement;
}

if (isGitHubIssuePage()) {
  renderButtons();
}

let currentUrl = window.location.href;
const urlChangeObserver = new MutationObserver(() => {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    currentUrl = newUrl;
    renderButtons();
  }
});

urlChangeObserver.observe(document.body, { childList: true, subtree: true });

function startTimer(buttonsContainer) {
  if (isFirstClick) {
    showActivityModal(buttonsContainer);
    return;
  }

  if (timerInterval) {
    console.log('Timer is already running.');
    return;
  }
  const activityId = getIdFromUrl();
  localStorage.setItem('activityID', activityId);
  const taskDescription = prompt('Enter your task description');
  localStorage.setItem('taskDescription', taskDescription);

  fetch(`${apiBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Key': `${localStorage.getItem('accessKey')}`
    },
    body: JSON.stringify({
      action: "START_ACTIVITY",
      activityTypeId: localStorage.getItem('selectedActivityTypeId'),
      employeeId: null,
      additionalTaskDetails: {
        taskId: activityId,
        description: taskDescription,
        timeSpent: null
      }
    })
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('entryData', data);
      activityDetails.startTime = new Date().toISOString();
      showTimer(buttonsContainer);
    })
    .catch(error => {
      console.error('Error starting timer:', error);
      isFirstClick=true;
    });
}

function showTimer(buttonsContainer) {
  const startButton = buttonsContainer.querySelector('.ev-btn-start');
  if (startButton) {
    let seconds = 0;
    timerInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const timerText = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      startButton.textContent = `Timer: ${timerText}`;
    }, 1000);
  } else {
    console.error('Start Timer button not found');
  }
}

function stopTimer(buttonsContainer) {
  activityDetails.endTime = new Date().toISOString();
  const duration = calculateDuration(activityDetails);

  fetch(`${apiBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'Access-Key': `${localStorage.getItem('accessKey')}`
    },
    body: JSON.stringify({
      action: "START_ACTIVITY",
      activityTypeId: localStorage.getItem('selectedActivityTypeId'),
      employeeId: null,
      additionalTaskDetails: {
        taskId: localStorage.getItem('activityID'),
        description: "Implement GitHub issue time tracker feature",
        timeSpent: duration
      }
    })
  })
    .then(response => response.json())
    .then(data => {
      const entryData = data;
      clearInterval(timerInterval);
      timerInterval = null;
      const startButton = buttonsContainer.querySelector('.ev-btn-start');
      if (startButton) {
        startButton.textContent = 'Start Timer';
      }
    })
    .catch(error => {
      console.error('Error stopping timer:', error);
    });
    isFirstClick = true;
}

function showActivityModal(buttonsContainer) {
  fetch(chrome.runtime.getURL('activity-modal.html'))
    .then(response => response.text())
    .then(html => {
      const modal = document.createElement('div');
      modal.innerHTML = html;
      document.body.appendChild(modal);

      const activityModal = document.getElementById('activityModal');
      const closeBtn = activityModal.querySelector('.close');
      const selectActivityBtn = document.getElementById('selectActivityBtn');
      const activityTypeSelect = document.getElementById('activityTypeSelect');

      const defaultOption = document.createElement('option');
      defaultOption.value = "";
      defaultOption.textContent = "Select option";
      activityTypeSelect.appendChild(defaultOption);

      Object.entries(activityTypes).forEach(([activity, typeId]) => {
        const option = document.createElement('option');
        option.value = typeId;
        option.textContent = activity;
        activityTypeSelect.appendChild(option);
      });

      activityModal.style.display = 'block';

      closeBtn.addEventListener('click', () => {
        activityModal.style.display = 'none';
        document.body.removeChild(modal);
      });

      selectActivityBtn.addEventListener('click', () => {
        const activityTypeSelect = document.getElementById('activityTypeSelect');
        const selectedActivityTypeId = activityTypeSelect.value;
        localStorage.setItem('selectedActivityTypeId', selectedActivityTypeId);
        activityModal.style.display = 'none';
        document.body.removeChild(modal);
        isFirstClick = false;
        startTimer(buttonsContainer);
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error saving time entry. Please try again.'
      });
      console.error('Error loading activity modal:', error);
    });
}

function calculateDuration(timePeriods) {
  const start = new Date(timePeriods.startTime);
    const end = new Date(timePeriods.endTime);
    const diffInMilliseconds = end.getTime() - start.getTime();
    return diffInMilliseconds;
}

function getIdFromUrl() {
  const url = window.location.href;
  const issueRegex = /\/issues\/(\d+)/;
  const pullRequestRegex = /\/pull\/(\d+)/;
  const issueMatch = url.match(issueRegex);
  const pullRequestMatch = url.match(pullRequestRegex);
  
  if (issueMatch) {
    return issueMatch[1];
  } else if (pullRequestMatch) {
    return pullRequestMatch[1];
  } else {
    return null;
  }
}