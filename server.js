// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var twilio = require('twilio');
var formidable = require("formidable");

// init in-memory db for quotas 
var db = {};

// Quota of 1 message á 5 secs
// Practical max. limit is 5 mins due to server sleepcycle
var quotaFreezeInMs = (5 * 1000); 

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/text', function(req, res, next) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
      var message = fields.message;
      var recipient = fields.recipient;
      var token = fields.token;
    
      // Guard invalid tokens
      if (token == null || token.length < 36) {
        console.log('Invalid token: No token provided.');
        res.sendStatus(422);
        return
      }
    
      // Guard freeze periods
      var now = new Date();

      if (db[token] == null || (now - db[token]) > quotaFreezeInMs) {
        console.log('Valid token: Quota check successful');    
        db[token] = now;
      }
      else 
      {
        console.log('Token Exceeded Quota.');
        res.sendStatus(429);
        return
      }

      // Guard invalid requests
      if (message == null || message.length < 10) {
        console.log('Invalid request: No message provided.');
        res.sendStatus(422);
        return
      }

      // Guard invalid recipient
      if (recipient == null || recipient.length < 6) {
        console.log('Invalid request: No recipient provided.');
        res.sendStatus(422);
        return
      }
    
      // Data masking
      var maskedMessage = message.substr(0, 10) + '...';
      var maskedRecipient = recipient.substr(0, recipient.length - 5) + '*****';
    
      // Prepare to send message
      console.log('Sending message ' + maskedMessage + ' to ' + maskedRecipient + ' with token ' + token);
    
      var client = new twilio.RestClient(
        '***REMOVED***',
        '***REMOVED***'
      );

      var options = {
        to:  recipient,
        from: '***REMOVED***',
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
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
