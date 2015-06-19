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
function NotificationsCtrl(Notification, $q, $http, API_URL) {
    var vm = this;
    // Map <url, [ids]>
    var mapLinkIds = {};
    vm.notifications = [];
    vm.notificationsNewManga = [];
    vm.openNotification = openNotification;
    vm.openNotificationNewManga = openMangaInNewTab;
    vm.removeNotification = removeNotification;

    _init();

    function openNotification(url) {
        removeNotification(url, openMangaInNewTab);
    }

    function openMangaInNewTab(url) {
        chrome.tabs.create({
            url: url
        });
    }

    function removeNotification(url, callback) {
        var promises = [];
        mapLinkIds[url].forEach(function(notification) {
            promises.push(Notification.delete({
                notificationId: notification.notificationId
            }).$promise);
        });
        $q.all(promises).then(function() {
            var index = 0;
            for (var i = 0; i < vm.notifications.length; i++) {
                if (vm.notifications[i].url === url) {
                    index = i;
                    break;
                }
            }
            vm.notifications.splice(index, 1);
            // Notify the background
            chrome.runtime.sendMessage({
                rerender: true
            });

            if (callback) {
                callback(url);
            }
        });
    }

    function _init() {
        Notification.query().$promise.then(function(notifications) {
            notifications.forEach(function(notification) {
                if (!mapLinkIds[notification.url]) {
                    vm.notifications.push(notification);
                    mapLinkIds[notification.url] = [];
                }
                mapLinkIds[notification.url].push(notification);
            });
        });

        $http.get(API_URL + '/newMangas')
            .success(function(notificationsNewManga) {
                vm.notificationsNewManga = notificationsNewManga;
            });
    }
}
