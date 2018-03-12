var config = {};

config.twilio = {};
// Twilio api credentials from dashbord
config.twilio.account_sid = process.env.TWILIO_ACCOUNT_SID;
config.twilio.auth_token = process.env.TWILIO_AUTH_TOKEN;
// Twilio sender number
config.twilio.from_number = process.env.TWILIO_FROM_NUMBER;

module.exports = config;
