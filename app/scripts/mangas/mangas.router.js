'use strict';

angular.module('mrTracker.mangas')
    .config(routerConfig);

/* @ngInject */
function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/mangas');
    $stateProvider
        .state('mangas', {
            abstract: true,
            url: '/mangas',
            templateUrl: 'scripts/mangas/mangas.html'
        })
        .state('mangas.list', {
            url: '',
            views: {
                '': {
                    templateUrl: 'scripts/mangas/mangas.list.html',
                    controller: 'MangasCtrl',
                    controllerAs: 'mangas'
                },
                header: {
                    templateUrl: 'scripts/header/header.html',
                    controller: 'HeaderCtrl',
                    controllerAs: 'header'
                },
                notifications: {
                    templateUrl: 'scripts/notifications/notifications.list.html',
                    controller: 'NotificationsCtrl',
                    controllerAs: 'notifications'
                }
            }
        });
}
