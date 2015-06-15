'use strict';

angular.module('mrTracker', [
        'mrTracker.constants',
        'mrTracker.header',
        'mrTracker.notifications',

        'ngResource',
        'ngMaterial'
    ])
    .config(mdConfig)
    .controller('TrackerCtrl', TrackerCtrl);

/* @ngInject */
function mdConfig($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-blue')
        .accentPalette('light-green');
}

/* @ngInject */
function TrackerCtrl($http, API_URL) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.signIn = signIn;

    $http.get(API_URL + '/authTest')
        .success(function() {
            vm.isAuthenticated = true;
            // Notify the background
            chrome.runtime.sendMessage({
                rerender: true
            });
        })
        .error(function(data, status) {
            console.log(status);
            vm.isAuthenticated = false;
        });

    function signIn() {
        chrome.tabs.create({
            url: API_URL + '/signin'
        });
    }
}
