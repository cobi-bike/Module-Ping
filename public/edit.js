// Init constants
var localStorageKeyToken = 'ping-utoken';
var localStorageKeyUsername = 'ping-uname';
var localStorageKeyMessageQuota = 'ping-quota';
var localStorageKeyAttachLocation = 'ping-attachlocation';
var defaultUsername = i18next.t('default-sender');
var dailyMessageQuota = 3;

// Set initial state of settings and hook onto events
var senderInput = document.getElementById('senderInput');
senderInput.value = getUsername();
senderInput.addEventListener('input', function(event) {
  setUsername(senderInput.value);
});

var attachLocationToggle = document.getElementById('attachLocationToggle');
attachLocationToggle.checked = getAttachLocation();
attachLocationToggle.onchange = function() {
  setAttachLocation(attachLocationToggle.checked);
};

// Provide getters and setters for settings

// Returns username from local storage or default username
function getUsername() {
  var username = localStorage.getItem(localStorageKeyUsername);
  if (username == null || username == '') {
    return defaultUsername;
  } else {
    return username;
  }
}

// Sets username on local storage
function setUsername(username) {
  localStorage.setItem(localStorageKeyUsername, username);
}

// Returns, if location should be attached to message
function getAttachLocation() {
  var attachLocation = JSON.parse(localStorage.getItem(localStorageKeyAttachLocation));
  if (attachLocation == null) {
    return true;
  } else {
    return attachLocation;
  }
}

// Sets, if location should be attached to message
function setAttachLocation(checked) {
  localStorage.setItem(localStorageKeyAttachLocation, JSON.stringify(checked));
}

// Returns array of messages sent on each day
function getMessagesSent() {
  var messages = JSON.parse(localStorage.getItem(localStorageKeyMessageQuota));
  if (messages == null) {
    return {};
  } else {
    return messages;
  }
}

// Returns messages sent today
function getMessagesSentCount() {
  var messages = getMessagesSent();
  var qId = getQuotaId();
  return messages[qId] == null ? 0 : messages[qId];
}

// Increments messages sent today
function incrementMessagesSent() {
  var messages = getMessagesSent();
  var qId = getQuotaId();
  messages[qId] = getMessagesSentCount() + 1;
  localStorage.setItem(localStorageKeyMessageQuota, JSON.stringify(messages));
}

// Returns if message limit per day is reached
function isMessageQuotaExceeded() {
  return getMessagesSentCount() >= dailyMessageQuota;
}

// Returns id of current day
function getQuotaId() {
  return new Date().toISOString().slice(0, 10);
}

// Returns user token from local storage or generates a new one
function getToken() {
  var token = localStorage.getItem(localStorageKeyToken);
  if (token == null || token == '') {
    token = generateGuid();
    localStorage.setItem(localStorageKeyToken, token);
  }
  return token;
}

// Returns random token id
function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
