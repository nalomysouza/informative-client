var notifier = require('node-notifier'), path = require('path');

    var createNotification = function(title, message) {
        notifier.notify({
            title: title,
            message: message,
            icon: path.join(__dirname, 'assets/favicon.png'),
            sound: true,
            wait: true
        },
        function(err, response) {
            console.log(response, err);
        });
    };

    notifier.on('click', function(notifierObject, options) {
        // Triggers if `wait: true` and user clicks notification
      });
      
    notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
    });