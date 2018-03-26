# Ping DevKit module for COBI.bike

The Ping DevKit module allows users to send prefabricated SMS to their contacts on the fly.
Its part of a collection of Open Source [modules](https://cobi.bike/devkit) for the [COBI.bike](https://cobi.bike) system.

<img src="screenshot.png" width="500px" alt="COBI.bike Ping module">

## Quickstart: Interactive Demo

The quickest way to test the module:

[<img src="https://cdn.cobi.bike/static/devkit-assets/github/open_demo_button.png" width="170px" alt="Open demo button">](https://glitch.com/edit/#!/import/github/cobi-bike/Module-Ping)

## Installation and Setup

You can easily deploy the module on your own:

### Step 1: Clone repository

Clone this repository and install Node.js dependencies with:

``` bash
npm install
```  

### Step 2: Install COBI.bike DevKit Simulator

Follow the [instructions](https://github.com/cobi-bike/DevKit#-test-your-module) to install the COBI.bike Google Chrome Simulator and get familiar with the basics of module development on the COBI plattform.

### Step 3: Create a twilio account

This module relies on [twilio.com](https://www.twilio.com/) to send custom SMS from the Node.js backend. Create an account, setup »Programmable SMS« and retrieve your api credentials. For testing purposes consider using test credentials found in the General Settings.

### Step 4: Set environment variables

Set the environment variables `TWILIO_ACCOUNT_SID`,  `TWILIO_AUTH_TOKEN` and `TWILIO_FROM_NUMBER` with your twilio credentials.

Otherwise you may set them manually in `config.js`

### Step 5: Run Node.js server

The module is accessible under [localhost:3000](http://localhost:3000/) after starting the Node.js server with:
``` bash
node server.js
```  
The settings menu can be accessed with the [?state=edit](http://localhost:3000/?state=edit) suffix.

### Step 6: Spoof contact menu

The module accesses a native contact menu through a Cobi.js API bridge. To send a message anyway, we simply spoof the API function:
``` javascript
COBI.app.contact.read = function(callback) {
	var contact = {};
	contact.phone = '+49 1234 56789';
	callback(contact);
}
```

## Credits
This module uses Open Source components. You can find the source code of their open source projects along with license information below. We acknowledge and are grateful to these developers for their contributions to open source.

[Carousel Team](https://codepen.io/fixcl/pen/KwpKvb) by Marco Barría (MIT)

## Useful DevKit links

* [Debugging Tips & Tricks](https://github.com/cobi-bike/DevKit#debugging-tips--tricks)
* [Inspiration & Examples](https://github.com/cobi-bike/DevKit#inspiration--examples)
* [Interface Guidelines](https://github.com/cobi-bike/DevKit#interface-guidelines)
* [More DevKit Resources](https://github.com/cobi-bike/DevKit#inspiration--examples)
* [Other Tools & Resources](https://github.com/cobi-bike/DevKit#other-tools--resources)


## Contributing to this project

Anyone and everyone is welcome to contribute to this project, the [DevKit Simulator](https://github.com/cobi-bike/DevKit-Simulator) and the [COBI.bike DevKit UI Components](https://github.com/cobi-bike/DevKit-UI). Please take a moment to review the [guidelines for contributing](https://github.com/cobi-bike/DevKit/blob/master/CONTRIBUTING.md).

* [Bug reports](https://github.com/cobi-bike/DevKit/blob/master/CONTRIBUTING.md#bugs)
* [Feature requests](https://github.com/cobi-bike/DevKit/blob/master/CONTRIBUTING.md#features)
* [Pull requests](https://github.com/cobi-bike/DevKit/blob/master/CONTRIBUTING.md#pull-requests)

Copyright © 2018 COBI.bike GmbH
