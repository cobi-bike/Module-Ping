// Init Constants

const localStorageKeyToken = 'ping-utoken';
const localStorageKeyUserName = 'ping-uname';
const localStorageKeyMessageQuota = 'ping-quota';
const localStorageKeyAttachLocation = 'ping-attachlocation';

const defaultUserName = i18next.t('default-sender');
const dailyMessageQuota = 3;

// Manage Settings

if (COBI.parameters.state() == COBI.state.edit) {
  document.getElementById('experience').style.display = 'none';
} else {
  document.getElementById('edit').style.display = 'none';  
}

// Defaults

if (!localStorage.getItem(localStorageKeyAttachLocation)) localStorage.setItem(localStorageKeyAttachLocation, JSON.stringify(true));
if (!localStorage.getItem(localStorageKeyMessageQuota)) localStorage.setItem(localStorageKeyMessageQuota, JSON.stringify({}));

// Setting: User Name

var userName = localStorage.getItem(localStorageKeyUserName);
if (userName == null || userName == '') {
  userName = defaultUserName;
}

var senderInput = document.getElementById("senderInput");
senderInput.value = userName;
senderInput.addEventListener("input", function(event) {
  localStorage.setItem(localStorageKeyUserName, senderInput.value);
});

// Setting: Attach Location

var attachLocationToggle = document.getElementById("attachLocationToggle");
attachLocationToggle.checked = getAttachLocationSetting();
attachLocationToggle.onchange = function() {
  localStorage.setItem(localStorageKeyAttachLocation, JSON.stringify(attachLocationToggle.checked));
};

function getAttachLocationSetting() {
  return JSON.parse(localStorage.getItem(localStorageKeyAttachLocation));
}

// Quota

function getMessagesSent() {
  var messages = JSON.parse(localStorage.getItem(localStorageKeyMessageQuota));
  var qId = getQuotaId();
  return (messages[qId] == null) ? 0 : messages[qId];
}

function incrementMessagesSent() {
  var messages = JSON.parse(localStorage.getItem(localStorageKeyMessageQuota));
  var qId = getQuotaId();
  messages[qId] = getMessagesSent() + 1;
  localStorage.setItem(localStorageKeyMessageQuota, JSON.stringify(messages));
}

function getMessageQuotaExceeded() {
  return getMessagesSent() >= dailyMessageQuota;
}

function getQuotaId() {
  return new Date().toISOString().slice(0, 10);
}