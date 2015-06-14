(function(chrome) {
    'use strict';

    //var URL = 'https://api-mrtracker.herokuapp.com';
    var URL = 'http://localhost:3000';

    var xhr = (function() {
        var xhr = new XMLHttpRequest();
        return function(method, url, callback) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    callback(xhr.responseText, xhr.status);
                }
            };
            xhr.open(method, url);
            xhr.send();
        };
    })();

    function notificationsCount(callback) {
        xhr('GET', URL + '/notifications', function(data, status) {
            if (status >= 400) {
                callback(-1);
                return;
            }
            var count = _countNotifications(data);
            callback(count);
        });
    }

    function render(badge, color, title) {
        chrome.browserAction.setBadgeText({
            text: '' + badge
        });

        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });

        chrome.browserAction.setTitle({
            title: title
        });
    }

    function update() {
        notificationsCount(function(count) {
            if (count < 0) {
                var text;
                if (count === -1) {
                    text = 'You have to be connected to the internet and logged into Google';
                } else if (count === -2) {
                    text = 'Unable to find count on page';
                }
                window.hasNotifications = false;
                render('?', [166, 41, 41, 255], text);
            } else {
                if (count > 999) {
                    count = '∞';
                }
                var badge = count !== 0 ? count : '';
                window.hasNotifications = count !== 0;
                render(badge, [65, 131, 196, 255], 'Manga reader tracker');
            }
        });
    }

    chrome.alarms.create({
        periodInMinutes: 1
    });
    chrome.alarms.onAlarm.addListener(update);
    chrome.runtime.onMessage.addListener(update);

    update();

    function _countNotifications(data) {
        var count = 0;
        var notifications = JSON.parse(data);
        if (notifications && notifications.length > 0) {
            var alreadyDone = {};
            notifications.forEach(function(notification) {
                if (!alreadyDone[notification.link]) {
                    count++;
                    alreadyDone[notification.link] = true;
                }
            });
        }
        return count;
    }
})(chrome);
