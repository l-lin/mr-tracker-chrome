'use strict';

angular.module('mrTracker.notifications', [
        'mrTracker.constants',
        'ngResource'
    ])
    .factory('Notification', Notification)
    .controller('NotificationsCtrl', NotificationsCtrl);

/* @ngInject */
function Notification($resource, API_URL) {
    return $resource(API_URL + '/notifications/:notificationId', {
        notificationId: '@notificationId'
    }, {
        'delete': {
            method: 'DELETE'
        }
    });
}

/* @ngInject */
function NotificationsCtrl(Notification, $q) {
    var vm = this;
    // Map <link, [ids]>
    var mapLinkIds = {};
    vm.hasNotifications = false;
    vm.notifications = [];
    vm.openNotification = openNotification;
    vm.removeNotification = removeNotification;

//    Notification.query().$promise.then(function(notifications) {
//        notifications.forEach(function(notification) {
//            if (!mapLinkIds[notification.link]) {
//                vm.notifications.push(notification);
//                mapLinkIds[notification.link] = [];
//            }
//            mapLinkIds[notification.link].push(notification);
//        });
//        if (notifications.length > 0) {
//            vm.hasNotifications = true;
//        }
//    });

    function openNotification(link) {
        removeNotification(link);
        chrome.tabs.create({
            url: link
        });
    }

    function removeNotification(link) {
        // We are removing afterward, so instead of waiting, we set the flag immediately
        if (vm.notifications.length === 1) {
            vm.hasNotifications = false;
        }

        var promises = [];
        mapLinkIds[link].forEach(function(notification) {
            promises.push(Notification.delete({
                notificationId: notification.notificationId
            }).$promise);
        });
        $q.all(promises).then(function() {
            var index = 0;
            for (var i = 0; i < vm.notifications.length; i++) {
                if (vm.notifications[i].link === link) {
                    index = i;
                    break;
                }
            }
            vm.notifications.splice(index, 1);
            // Notify the background
            chrome.runtime.sendMessage({
                rerender: true
            });
        });
    }
}
