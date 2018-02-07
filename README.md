# »Ping«-App for COBI.bike

The »Ping«-App allows users to send prefabricated SMS to their contacts on the fly.
Its part of a collection of Open Source [modules](https://cobi.bike/devkit) for [COBI.bike](https://cobi.bike).

![COBI.bike Ping App](https://cobi.bike/sites/default/files/cobi-assets/cobi-devkit-demo-ping-small_0.jpg)

## Quickstart: Interactive Demo

The quickest way to test the app without any setup:

[<img src="https://raw.githubusercontent.com/cobi-bike/DevKit/master/resources/open-demo-btn.png" width="170px" alt="Open demo button">](https://codepen.io/cobi-bike/pen/.......)

## Installation and Setup

You can easily deploy the app on you own:

### Step 1: Clone repository

Clone this repository and install Node.js dependencies with:

``` bash
npm install
```  

### Step 2: Install COBI.bike DevKit

Follow the [instructions](https://github.com/cobi-bike/DevKit#-test-your-module) to install the COBI.bike Google Chrome Simulator and get familiar with the basics of app development on the COBI plattform.

### Step 3: Create a twilio account

This app relies on [twilio.com](https://www.twilio.com/) to send custom SMS from the Node.js backend. Create an account, setup »Programmable SMS« and retrieve your api credentials. For testing purposes consider using test credentials found in the General Settings.

### Step 4: Edit configuration file

Rename `config.js.EXAMPLE` in the root directory to `config.js` and fill in your twilio credentials. 

### Step 5: Run Node.js server

The app is accessible under [localhost:8888](http://localhost:8888/) after starting the Node.js server with:
``` bash
PORT=8888 node server.js
```  
The settings menu can be accessed with the [?state=edit](http://localhost:8888/?state=edit) suffix.


## Documentation

Let's take a deeper look to understand how the »Ping«-App works:

### File structure
```
├── config.js.EXAMPLE       Credential config (rename to config.js)
├── LICENSE
├── package.json
├── public
│   ├── appcache.manifest   Cache-File
│   ├── carousel.js         Carousel menu
│   ├── cobi-style.css
│   ├── config.js           i18-Translations
│   ├── edit.js             Settings menu
│   ├── index.js            Main menu
│   └── style.css
├── README.md
├── server.js               Entry point for Node.js backend
└── views
    └── index.html          Html to be served
```

### Application lifecycle
The Node.js backend serves index.html on request.  
On the client side index.js is the main entry point for the application's logic.

After intializing the COBI DevKit we firstly check if we're in main menu or settings menu mode:
``` javascript
// index.js

// Check if where in main menu oder settings menu
if (COBI.parameters.state() == COBI.state.edit) { 
  document.getElementById('experience').style.display = 'none';
} else {
  document.getElementById('edit').style.display = 'none';  
  //Initinalize main menu carousel
  $(window).load(function(){
    'use strict';
    carousel.init();
  });
}
```

#### Main menu
Secondly we hook onto the COBI api to request location information and input events:
``` javascript
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
    console.log("ETA changed to " + lastEta);
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
```
When an item is selected, we ask the user for a number in his contact list and send a AJAX-request containing the message to the Node.js backend.

#### Settings menu
If we're in settings menu instead, we read the user preferences and display a form with the current settings:
``` javascript
// edit.js

// Set initial state of settings and hook onto events
var senderInput = document.getElementById("senderInput");
senderInput.value = getUsername();
senderInput.addEventListener("input", function(event) {
  setUsername(senderInput.value)
});

var attachLocationToggle = document.getElementById("attachLocationToggle");
attachLocationToggle.checked = getAttachLocation();
attachLocationToggle.onchange = function() {
  setAttachLocation(attachLocationToggle.checked);
};
```
Settings will be stored in the browser's local storage. We then provide getter and setter functions, accessing the local storage entries. They will return default values, if the local storage is not set yet.

#### Node.js backend
The AJAX-request containing the message will be handled the Node.js backend.
After validating the request, we send the message via the twilio api:
``` javascript
// server.js

var client = new twilio.RestClient(
  config.twilio.account_sid,
  config.twilio.auth_token
);

var options = {
  to:  recipient,
  from: config.twilio.from_number,
  body: message,
  statusCallback: null
};

client.sendMessage(options, function(err, response) {
  if (err) {
    console.error(err);
    res.sendStatus(503);
  }
  else {
    console.log('Message (' + maskedMessage + ') sent to ' + maskedRecipient);
    res.sendStatus(200);
  }
});
```


---

## Useful DevKit links

### Debugging Tips & Tricks

* For seing javascript errors in the native App, activate the "Show module errors" option in the "Diagnostics" section
* To get better error messages when interacting with the `COBI.js` API, include `https://cdn.cobi.bike/cobi.js/0.34.1/cobi.dev.js` instead of the script mentioned above (**please note:** the dev version is considerably larger which has a big impact on the loading time)
* To show a native dialog when running inside the iOS App, just use a normal `alert("your messages")` (only for debugging)
* When developing in Chrome, use the phone button in the upper left corner of the Chrome Developer Tools and rotate it to landscape to see how it looks while riding 
* When using the Chrome Simulator, press the `Print state to console` button to print the current `COBI.js` state to the Chrome Developer Tools Console

### Inspiration & Examples

* Get inspired by our showcases on the [COBI.bike DevKit site](https://cobi.bike/devkit)
* Take a testride with one of our example modules in the COBI.bike iOS app. Requires registration as a developer on [my.cobi.bike](https://my.cobi.bike)
* Visit our [Showtime Developer Forum](https://forums.cobi.bike/c/showtime) for additional inspiration from the developer community

### Interface Guidelines

Read our [Interface Guidelines](interface-guidelines.md) to understand the unique challenges of developing software for bikes and to learn more about how the COBI.bike system and modules work.

### More DevKit Resources

- [FAQ](FAQ.md)
- [Developer Forums](https://forums.cobi.bike)
- [COBI.bike DevKit Chrome Extension on Chrome Web Store](https://chrome.google.com/webstore/detail/cobi-devkit-simulator/hpdhkapigojggienmiejhblkhenjdbno)
- [COBI.bike DevKit Chrome Extension on Github](https://github.com/cobi-bike/COBI.js-simulator)
- [COBI.bike DevKit UI Components](https://github.com/cobi-bike/DevKit-UI)
- [`COBI.js` reference](https://cobi-bike.github.io/COBI.js/)

### Other Tools & Resources

- [Glitch](https://glitch.com/) – friendly community where you'll build the app of your dreams
- [CodePen](https://codepen.io/) – social development environment for front-end designers and developers

## Contributing to this project

Anyone and everyone is welcome to contribute to this project, the [DevKit Simulator](https://github.com/cobi-bike/DevKit-Simulator) and the [COBI.bike DevKit UI Components](https://github.com/cobi-bike/DevKit-UI). Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

Copyright © 2018 COBI.bike GmbH