// Initialize COBI.js
COBI.init('token');
COBI.devkit.overrideThumbControllerMapping.write(true);

// Check if where in main menu oder settings menu
if (COBI.parameters.context() == COBI.context.offRideSettings || COBI.parameters.context() == COBI.context.onRideSettings) {
  document.getElementById('experience').style.display = 'none';
} else {
  document.getElementById('edit').style.display = 'none';
  //Initinalize main menu carousel
  $(window).load(function() {
    'use strict';
    carousel.init();
  });
}

// Hook onto COBI subscriptions to gather position data

// Determine current location coordinates
var lastLocation = null;
COBI.mobile.location.subscribe(function(location) {
  lastLocation = location;
});

// Determine estimated time of arrival
var lastEta = null;
COBI.navigationService.eta.subscribe(function(value) {
  if (value && value > 0) {
    lastEta = new Date(value * 1000);
    console.log('ETA changed to ' + lastEta);
  } else {
    lastEta = null;
  }
});

// Listen for input from the external controler
COBI.hub.externalInterfaceAction.subscribe(function(action) {
  // Swipe carousel based on input
  if (action == 'UP' || action == 'RIGHT') carousel.next();
  if (action == 'DOWN' || action == 'LEFT') carousel.prev();
  if (action == 'SELECT') {
    // Present user with contact selection menu
    COBI.app.contact.read(function(contact) {
      // Send message to the selected contact
      sendMessage(contact.phone, carousel.current());
    });
  }
});

// Send message to phone number with text for a carousel item id
function sendMessage(phoneNumber, carouselItemId) {
  // Check if user exceeded daily limit
  if (isMessageQuotaExceeded()) {
    // Show error popup
    COBI.app.textToSpeech.write({ content: i18next.t('message-quota-exceeded-tts'), language: i18next.language });
    Materialize.toast(i18next.t('message-quota-exceeded'), 5 * 1000, 'rounded white');
    return;
  }

  var message = '';
  var username = getUsername();

  // Get text message based on selected carousel item
  switch (carouselItemId) {
    // On my way
    case 0:
      message = username + i18next.t('on-my-way-template');
      break;

    // Almost there
    case 1:
      message = username + i18next.t('almost-there-template');
      break;

    // Running late
    case 2:
      message = username + i18next.t('running-late-template');
      break;

    // I'm here
    case 3:
      message = username + i18next.t('im-here-template');
      break;

    // Love this place
    case 4:
      message = username + i18next.t('love-place-template');
      break;

    // Call me
    case 5:
      message = username + i18next.t('call-me-template');
      break;
  }

  // Append ETA if available
  if (lastEta != null) {
    message +=
      ' ' +
      i18next
        .t('eta')
        .replace('{ETA}', lastEta.toLocaleTimeString(i18next.language, { hour: '2-digit', minute: '2-digit' }));
  }

  // Append location if available and configured
  if (lastLocation != null && getAttachLocation()) {
    message +=
      ' ' + 'https://maps.google.com/?q=' + lastLocation.coordinate.latitude + ',' + lastLocation.coordinate.longitude;
  }

  // Append "Sent from COBI"
  message += '\n\n' + i18next.t('message-sent-from-cobi');

  // Send AJAX-call to server
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        COBI.app.textToSpeech.write({ content: i18next.t('message-sent-success-tts'), language: i18next.language });
        Materialize.toast(i18next.t('message-sent-success'), 5 * 1000, 'rounded white');
        incrementMessagesSent();
      } else {
        COBI.app.textToSpeech.write({ content: i18next.t('message-sent-failed-tts'), language: i18next.language });
        Materialize.toast(i18next.t('message-sent-failed'), 5 + 1000, 'rounded white');
      }
    }
  };

  var data = new FormData();
  data.append('message', message);
  data.append('recipient', phoneNumber);

  request.open('POST', 'text', true);
  request.send(data);
}
