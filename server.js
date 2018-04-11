
var express = require('express');
var app = express();
var twilio = require('twilio');
var formidable = require('formidable');
var requestIp = require('request-ip');

// init in-memory db for quotas
var db = {};
var db_timestamp = Date.now();
var db_lifetime = 24 * 60 * 60 * 1000; // 24 hours in ms
var quota = 5; // messages per day


// Set port from environment variable or default
var port = process.env.PORT || 3000;

// Set environment variables
var account_sid = process.env.TWILIO_ACCOUNT_SID;
var auth_token = process.env.TWILIO_AUTH_TOKEN;
var from_number = process.env.TWILIO_FROM_NUMBER;

// If env variables are not set, quit application with error exit code
if (!account_sid || !auth_token || !from_number) {
  console.log("Error: Missing environment variables")
  process.exit(1);
}

app.use(requestIp.mw());
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/text', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var message = fields.message;
    var recipient = fields.recipient;

    // Clear database if lifetime is exceeded
    if (Date.now() - db_timestamp > db_lifetime) {
      db_timestamp = Date.now();
      db = {};
    }

    // Increase access counter by one
    var ip = req.clientIp;
    console.log(ip);
    if (db[ip] == null) {
      db[ip] = 1;
    } else {
      db[ip]++;
    }

    // Check if quota is exceeded
    if (db[ip] > quota) {
      console.log('Exceeded Quota.');
      res.sendStatus(429);
      return;
    }

    // Guard invalid requests
    if (message == null || message.length < 10) {
      console.log('Invalid request: No message provided.');
      res.sendStatus(422);
      return;
    }

    // Guard invalid recipient
    if (recipient == null || recipient.length < 6) {
      console.log('Invalid request: No recipient provided.');
      res.sendStatus(422);
      return;
    }

    // Data masking
    var maskedMessage = message.substr(0, 10) + '...';
    var maskedRecipient = recipient.substr(0, recipient.length - 5) + '*****';

    // Prepare to send message
    console.log('Sending message ' + maskedMessage + ' to ' + maskedRecipient + ' from ip ' + ip);

    var client = new twilio.RestClient(account_sid, auth_token);

    var options = {
      to: recipient,
      from: from_number,
      body: message,
      statusCallback: null
    };

    client.sendMessage(options, function(err, response) {
      if (err) {
        console.error(err);
        res.sendStatus(503);
      } else {
        console.log('Message (' + maskedMessage + ') sent to ' + maskedRecipient);
        res.sendStatus(200);
      }
    });
  });
});

// listen for requests :)
var listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
