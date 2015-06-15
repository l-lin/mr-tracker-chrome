'use strict';

angular.module('mrTracker.header', ['mrTracker.constants', 'mrTracker.mangas'])
    .controller('HeaderCtrl', HeaderCtrl);

/* @ngInject */
function HeaderCtrl($http, API_URL, $mdSidenav, $mdUtil, $mdDialog, MR_URL) {
    var vm = this;
    vm.displayOptions = displayOptions();
    vm.signOut = signOut;
    vm.isMangaTracked = false;
    vm.isMangaTrackedMessage = vm.isMangaTracked ? 'Untrack manga' : 'Track manga';
    vm.importMangas = importMangas;
    vm.removeMangas = removeMangas;
    vm.exportMangas = exportMangas;
    vm.showSwitch = false;

    _init();

    function displayOptions() {
        return $mdUtil.debounce(function () {
            $mdSidenav('options')
                .toggle();
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

    function importMangas() {
        $mdDialog.show({
            controller: ImportMangaFormCtrl,
            controllerAs: 'form',
            templateUrl: 'scripts/mangas/import.form.html'
        });
    }

    function removeMangas() {
        $mdDialog.show({
            controller: RemoveMangaFormCtrl,
            controllerAs: 'form',
            templateUrl: 'scripts/mangas/remove.form.html'
        });
    }

    function exportMangas() {
        // TODO: Download file
    }

    function _init() {
        chrome.tabs.query({active: true}, function (tab) {
            if (tab[0].url.indexOf(MR_URL) === 0) {
                vm.showSwitch = true;
            }
        });
    }
}
