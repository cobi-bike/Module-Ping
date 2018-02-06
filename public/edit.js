// Init Constants

var localStorageKeyToken = 'ping-utoken';
var localStorageKeyUsername = 'ping-uname';
var localStorageKeyMessageQuota = 'ping-quota';
var localStorageKeyAttachLocation = 'ping-attachlocation';
var defaultUsername = i18next.t('default-sender');
var dailyMessageQuota = 3;

// Manage Settings


// Defaults


// Manage Token



var senderInput = document.getElementById("senderInput");
senderInput.value = getUsername();
senderInput.addEventListener("input", function(event) {
  setUsername(senderInput.value)
});

// Setting: Attach Location

var attachLocationToggle = document.getElementById("attachLocationToggle");
attachLocationToggle.checked = getAttachLocation();
attachLocationToggle.onchange = function() {
  setAttachLocation(attachLocationToggle.checked);
};

function getUsername() {
  var username = localStorage.getItem(localStorageKeyUsername);
  if (username == null || username == '') {
    return defaultUsername;
  } else {
    return username;
  }
}

function setUsername(username) {
  localStorage.setItem(localStorageKeyUsername, username);
}

function getAttachLocation() {
  attachLocation = JSON.parse(localStorage.getItem(localStorageKeyAttachLocation));
  if (attachLocation == null) {
    return true;
  } else {
    return attachLocation;
  }
}

function setAttachLocation(checked) {
  localStorage.setItem(localStorageKeyAttachLocation, JSON.stringify(checked));
}


// Quota

function getMessagesSent() {
  var messages = JSON.parse(localStorage.getItem(localStorageKeyMessageQuota));
  if (messages == null) {
    return {};
  } else {
    return messages;
  }
}

function getMessagesSentCount() {
  var messages = getMessagesSent();
  var qId = getQuotaId();
  return (messages[qId] == null) ? 0 : messages[qId];
}

function incrementMessagesSent() {
  var messages = getMessagesSent();
  var qId = getQuotaId();
  messages[qId] = getMessagesSentCount() + 1;
  localStorage.setItem(localStorageKeyMessageQuota, JSON.stringify(messages));
}

function isMessageQuotaExceeded() {
  return getMessagesSentCount() >= dailyMessageQuota;
}

function getQuotaId() {
  return new Date().toISOString().slice(0, 10);
}

function getToken() {
  var token = localStorage.getItem(localStorageKeyToken);
  if (token == null || token == '') {
    token = generateGuid();
    localStorage.setItem(localStorageKeyToken, token);
  }
  return token;
}

function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
