'use strict';

angular.module('mrTracker.header', ['mrTracker.constants', 'mrTracker.mangas'])
    .controller('HeaderCtrl', HeaderCtrl);

/* @ngInject */
function HeaderCtrl($http, API_URL, $mdSidenav, $mdUtil, $mdDialog, MR_URL, Manga) {
    var vm = this;
    vm.displayOptions = displayOptions();
    vm.signOut = signOut;
    vm.isMangaTracked = false;
    vm.isMangaTrackedMessage = vm.isMangaTracked ? 'Untrack manga' : 'Track manga';
    vm.importMangas = importMangas;
    vm.removeMangas = removeMangas;
    vm.exportMangas = exportMangas;
    vm.showSwitch = false;
    vm.changeStatus = changeStatus;
    vm.mangaId = '';

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
            controller: 'ImportMangaFormCtrl',
            controllerAs: 'form',
            templateUrl: 'scripts/mangas/import.form.html'
        });
    }

    function removeMangas() {
        $mdDialog.show({
            controller: 'RemoveMangaFormCtrl',
            controllerAs: 'form',
            templateUrl: 'scripts/mangas/remove.form.html'
        });
    }

    function exportMangas() {
        $mdDialog.show({
            controller: 'ExportMangaFormCtrl',
            controllerAs: 'form',
            templateUrl: 'scripts/mangas/export.form.html'
        });
    }

    function changeStatus(mangaId, isMangaTracked) {
        if (isMangaTracked) {
            // It is set to true => create the manga
            var manga = new Manga({
                id: mangaId
            });
            manga.$save();
        } else {
            Manga.delete({
                id: mangaId
            })
        }
    }

    function _init() {
        chrome.tabs.query({active: true}, function (tab) {
            // FIXME: tab[0] is the first tab of your first chrome window. So if you have multiple chromes, it will not work...
            if (_isInMangaReader(tab[0].url)) {
                vm.mangaId = _fetchMangaTitle(tab[0].url);
                if (vm.mangaId !== '') {
                    vm.showSwitch = true;
                    Manga.get({id: mangaId}).$promise.then(function () {
                        vm.isMangaTracked = true;
                    }, function() {
                        // Manga not found => not tracked
                        vm.isMangaTracked = false;
                    });
                }
            }
        });
    }

    function _isInMangaReader(url) {
        return url.indexOf(MR_URL) === 0;
    }

    function _fetchMangaTitle(url) {
        var mangaId = url.replace('http://www.mangareader.net/', '');
        if (mangaId.length > 0) {
            var slugMatch = mangaId.match(/\/([^\.\/]+)\.html/i);
            if (slugMatch) {
                mangaId = slugMatch[1];
            }
            return mangaId;
        }
        return '';
    }
}
