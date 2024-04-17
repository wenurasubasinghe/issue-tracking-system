const apiBaseUrl = 'http://localhost:3010';
const authToken = 'eyJraWQiOiIyUGo2OFlRRkViRkhBMGIxdnR5TXpCSk5xelpyaVNLbXhqNGNVRmpoU3VRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMTczZGQyYS0yMDgxLTcwYTYtMWMyYS1hZGU1OTc0ZThhZDkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9reVlDWVNJa0IiLCJjb2duaXRvOnVzZXJuYW1lIjoiMTE3M2RkMmEtMjA4MS03MGE2LTFjMmEtYWRlNTk3NGU4YWQ5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3NobmlybythZG1pbkBnbWFpbC5jb20iLCJvcmlnaW5fanRpIjoiYTc3MDZlOTUtZDBkOS00Y2NlLTlhZmQtMTRhYmNlZDI2NGYxIiwiYXVkIjoiNHF0aHM2NGxta2VxZGZpaTMyNGRrcm9ka2QiLCJldmVudF9pZCI6ImRiNDFlYmFmLWI3ODUtNGNjZS04ZjYxLTIxYWY4MmRkYTNhMyIsImN1c3RvbTpwZXJtaXNzaW9uX2dyb3VwcyI6IjEyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTI3MjQwNjEsImN1c3RvbTp0ZW5hbnQiOiJsb2NhbGhvc3QiLCJleHAiOjE3MTMyNzM1MDIsImN1c3RvbTp1c2VyX3R5cGUiOiJBRE1JTiIsImlhdCI6MTcxMzI3MzIwMiwianRpIjoiYTdjMmMxODItODFiZC00OTUwLTlhZDYtMGI1Y2Y2Yjc1Y2U0IiwiZW1haWwiOiJzc2huaXJvK2FkbWluQGdtYWlsLmNvbSJ9.MB7xOay75-NbH5XjLk1MU9UwV8PSKTee_oa_P7_dZzdmhjMyuKhi-LO6TrJ7VwU7tZd6ON8CWgpaRqTmxL7BIgb1U8i9hYad_1LtxM-Eo2unZURayZk0w-NMxD427J38UIMdsFEMMS60FBUHKy4kBpmcRsJR0b4lgOHt9cNMk-by8RqDHFjgLF6Rwck9r4CLA_LQe2KBmBe6oMqsQBHXpkvOkNJlle8OyeRNHjDkLCcMyuSSXrTeLjNknAtKwu9XX19Yc9zDl1yGV6-wlVVwBaEFEvuWVKvERiJ06Xdvgzv5oDu-yaLsEyhOY8723kyhwPaEIKnzNn8DIP2U6ZzEpw';
let timerInterval;

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

        const editTimeButton = document.createElement('button');
        editTimeButton.classList.add('btn', 'btn-sm', 'ev-edit-time-anchor');
        editTimeButton.textContent = 'Edit Time';
        buttonsContainer.appendChild(editTimeButton);

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
  if (timerInterval) {
    console.log('Timer is already running.');
    return;
  }
  saveIssueId();

  fetch(`${apiBaseUrl}/employee-tracker/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'x-Tenant': 'localhost'
    },
    body: JSON.stringify({
      action: "START_ACTIVITY",
      activityTypeId: 2,
      employeeId: localStorage.getItem('githubIssueId'),
      id: null,
      state: null,
      timestamp: null,
    })
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('activityTypeId', data.activityTypeId);
      showTimer(buttonsContainer);
    })
    .catch(error => {
      console.error('Error starting timer:', error);
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

function getIssueIdFromUrl() {
  const url = window.location.href;
  const regex = /\/issues\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function saveIssueId() {
  const issueId = getIssueIdFromUrl();
  localStorage.setItem('githubIssueId', issueId);
}

function stopTimer(buttonsContainer) {
  fetch(`${apiBaseUrl}/employee-tracker/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'x-Tenant': 'localhost'
    },
    body: JSON.stringify({
      action: "END_ACTIVITY",
      activityTypeId: localStorage.getItem('activityTypeId'),
      employeeId: localStorage.getItem('githubIssueId'),
      id: null,
      state: null,
      timestamp: null,
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
      saveTimeEntry(entryData);
    })
    .catch(error => {
      console.error('Error stopping timer:', error);
    });
}

function saveTimeEntry(entryData) {
  console.log('Time entry saved:', entryData);
}