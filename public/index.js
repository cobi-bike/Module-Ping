// COBI.js Initialization

COBI.init('token');
COBI.devkit.overrideThumbControllerMapping.write(true);

var lastLocation = null;
var lastEta = null;

// Manage Token

var token = localStorage.getItem(localStorageKeyToken);
if (token == null || token == '') {
  token = generateGuid();
  localStorage.setItem(localStorageKeyToken, token);
}

// Init Slider if needed

if (COBI.parameters.state() != COBI.state.edit) { 
  $(window).load(function(){
    'use strict';
    carousel.init();
  });
}

// COBI Subscriptions

COBI.mobile.location.subscribe(function(location) {
  lastLocation = location;
});

COBI.navigationService.eta.subscribe(function(value) {
  if (value && value > 0) {
    lastEta = new Date(value * 1000);
    console.log("ETA changed to " + lastEta);
  } else {
    lastEta = null;
  }
});

COBI.hub.externalInterfaceAction.subscribe(function(action) {
  if (action == 'UP' || action == 'RIGHT') carousel.next();
  if (action == 'DOWN' || action == 'LEFT') carousel.prev();
  if (action == 'SELECT') {
   COBI.app.contact.read(function(contact) {
     sendMessage(contact.phone);
   });
  }
});

// Helper methods

function sendMessage(phoneNumber) {
  
    // Can send SMS?
    if (getMessageQuotaExceeded()) {
      COBI.app.textToSpeech.write({"content" : i18next.t('message-quota-exceeded-tts'), "language" : i18next.language})
      Materialize.toast(i18next.t('message-quota-exceeded'), 5000, 'rounded white');
      return;
    }
  
    var message = '';
  
    switch (carousel.current()) {
         // On my way
        case 0: message = userName + i18next.t('on-my-way-template');
            break;

        // Almost there
        case 1: message = userName + i18next.t('almost-there-template');
            break;
           
        // Running late
        case 2: message = userName + i18next.t('running-late-template');
            break;
        
        // I'm here
        case 3: message = userName + i18next.t('im-here-template');
            break;                    
        
        // Love this place
        case 4: message = userName + i18next.t('love-place-template');
            break; 
        
        // Call me
        case 5: message = userName + i18next.t('call-me-template');
            break;          
    }
  
    // Append ETA if available
    if (lastEta != null) {
      message += ' ' + i18next.t('eta').replace('{ETA}', lastEta.toLocaleTimeString(i18next.language, {hour:'2-digit', minute:'2-digit'}));
    }
  
    // Append location if available and configured
    if (lastLocation != null && getAttachLocationSetting()) {
      message += ' ' + 'https://maps.google.com/?q=' + lastLocation.coordinate.latitude + ',' + lastLocation.coordinate.longitude;  
    }
  
    // Append "Sent from COBI"
    message += '\n\n' + i18next.t('message-sent-from-cobi');  
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          COBI.app.textToSpeech.write({"content" : i18next.t('message-sent-success-tts'), "language" : i18next.language})
          Materialize.toast(i18next.t('message-sent-success'), 5000, 'rounded white');
          incrementMessagesSent();
        } else {
          COBI.app.textToSpeech.write({"content" : i18next.t('message-sent-failed-tts'), "language" : i18next.language})
          Materialize.toast(i18next.t('message-sent-failed'), 5000, 'rounded white');
        }
      }
    };

    var data = new FormData();
    data.append('message', message);
    data.append('recipient', phoneNumber);
    data.append('token', token);

    request.open("POST", "text", true);
    request.send(data);
}

function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
