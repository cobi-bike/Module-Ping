// COBI.js Initialization

COBI.init('token');
COBI.devkit.overrideThumbControllerMapping.write(true);


// Init Slider if needed

if (COBI.parameters.state() == COBI.state.edit) { 
  document.getElementById('experience').style.display = 'none';
} else {
  document.getElementById('edit').style.display = 'none';  
  $(window).load(function(){
    'use strict';
    carousel.init();
  });
}

// COBI Subscriptions

var lastLocation = null;
COBI.mobile.location.subscribe(function(location) {
  lastLocation = location;
});

var lastEta = null;
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
     sendMessage(contact.phone, carousel.current());
   });
  }
});

// Helper methods

function sendMessage(phoneNumber, carouselItemId) {
  
    // Can send SMS?
    if (isMessageQuotaExceeded()) {
      COBI.app.textToSpeech.write({"content" : i18next.t('message-quota-exceeded-tts'), "language" : i18next.language})
      Materialize.toast(i18next.t('message-quota-exceeded'), 5000, 'rounded white');
      return;
    }
  
    var message = '';
    var username = getUsername();
  
    switch (carouselItemId) {
         // On my way
        case 0: message = username + i18next.t('on-my-way-template');
            break;

        // Almost there
        case 1: message = username + i18next.t('almost-there-template');
            break;
           
        // Running late
        case 2: message = username + i18next.t('running-late-template');
            break;
        
        // I'm here
        case 3: message = username + i18next.t('im-here-template');
            break;                    
        
        // Love this place
        case 4: message = username + i18next.t('love-place-template');
            break; 
        
        // Call me
        case 5: message = username + i18next.t('call-me-template');
            break;          
    }
  
    // Append ETA if available
    if (lastEta != null) {
      message += ' ' + i18next.t('eta').replace('{ETA}', lastEta.toLocaleTimeString(i18next.language, {hour:'2-digit', minute:'2-digit'}));
    }
  
    // Append location if available and configured
    if (lastLocation != null && getAttachLocation()) {
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
    data.append('token', getToken());

    request.open("POST", "text", true);
    request.send(data);
}
