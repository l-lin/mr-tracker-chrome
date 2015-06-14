'use strict';

angular.module('mrTracker.header', [])
    .controller('HeaderCtrl', HeaderCtrl)
    .controller('HeaderOptionsCtrl', HeaderOptionsCtrl);

/* @ngInject */
function HeaderCtrl($http, API_URL, $mdSidenav, $mdUtil) {
    var vm = this;
    vm.displayOptions = displayOptions();
    vm.signOut = signOut;

    function displayOptions() {
        return $mdUtil.debounce(function () {
            $mdSidenav('options')
                .toggle()
                .then(function () {});
        }, 300);
    }

    function signOut() {
        $http.get(API_URL + '/signout')
            .success(function () {
                // Notify the background
                chrome.runtime.sendMessage({
                    rerender: true
                });
                // Refresh the popup
                window.location.href = 'popup.html';
            })
            .error(function (data, status) {
                console.error(data, status);
            });
    }
}

/* @ngInject */
function HeaderOptionsCtrl() {

}
