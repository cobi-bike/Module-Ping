// Init Localization

i18next.init(
  {
    lng: COBI.parameters.language(),
    resources: {
      en: {
        translation: {
          'default-sender': 'Anonymous cyclist',
          'name-placeholder': 'Your name',
          'on-my-way': 'On my way',
          'on-my-way-template': ' is on the way 🚴💨',
          'almost-there': 'Almost there',
          'almost-there-template': ' is almost there 🏁 🚴💨',
          'running-late': 'Running late',
          'running-late-template': ' is running late 😳 – but on the way 🚴💨',
          'im-here': "I'm here",
          'im-here-template': ' is here 🚴💨',
          'call-me': 'Call me',
          'call-me-template': ' asks to 📞 back at your convenience 🚴',
          'love-place': 'Love this place',
          'love-place-template': ' ❤️ this place 🚴',
          eta: 'ETA: {ETA}',
          'message-sent-from-cobi': 'Sent via COBI.bike',
          'message-sent-success': 'Successful 👌',
          'message-sent-success-tts': 'Your text message was sent successfully.',
          'message-sent-failed': 'Failed 👎',
          'message-sent-failed-tts': 'There was a problem sending your text message. Please try again later.',
          'message-quota-exceeded': 'Quota exceeded ⛔',
          'message-quota-exceeded-tts': 'Daily message quota exceeded, please try again later'
        }
      },
      de: {
        translation: {
          'default-sender': 'Anonymer Fahrradfahrer',
          'name-placeholder': 'Dein Name',
          'on-my-way': 'Unterwegs',
          'on-my-way-template': ' ist unterwegs 🚴💨',
          'almost-there': 'Gleich da',
          'almost-there-template': ' ist gleich da 🏁 🚴💨',
          'running-late': 'Spät dran',
          'running-late-template': ' ist spät dran 😳 – aber unterwegs 🚴💨',
          'im-here': 'Bin hier',
          'im-here-template': ' ist hier 🚴💨',
          'call-me': 'Rückruf',
          'call-me-template': ' bittet um 📞 Rückruf 🚴',
          'love-place': 'Schön hier',
          'love-place-template': ' ❤️ gefällt es hier 🚴',
          eta: 'Ankunft gegen {ETA}',
          'message-sent-from-cobi': 'Via COBI.bike gesendet',
          'message-sent-success': 'Erfolgreich 👌',
          'message-sent-success-tts': 'Deine Nachricht wurde erfolgreich versendet.',
          'message-sent-failed': 'Fehlgeschlagen 👎',
          'message-sent-failed-tts':
            'Beim Versand deiner Nachricht ist ein Problem aufgetreten. Bitte probiere es später nochmal.',
          'message-quota-exceeded': 'SMS Kontingent aufgebraucht ⛔',
          'message-quota-exceeded-tts': 'Du hast dein tägliches SMS Volumen erreicht. Bitte probiere es später nochmal.'
        }
      }
    }
  },
  function(err, t) {
    document.getElementById('on-my-way').innerHTML = i18next.t('on-my-way');
    document.getElementById('almost-there').innerHTML = i18next.t('almost-there');
    document.getElementById('running-late').innerHTML = i18next.t('running-late');
    document.getElementById('im-here').innerHTML = i18next.t('im-here');
    document.getElementById('call-me').innerHTML = i18next.t('call-me');
    document.getElementById('love-place').innerHTML = i18next.t('love-place');
  }
);
