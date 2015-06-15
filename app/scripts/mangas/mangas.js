'use strict';

angular.module('mrTracker.mangas', [])
    .factory('Manga', Manga)
    .controller('ImportMangaFormCtrl', ImportMangaFormCtrl)
    .controller('RemoveMangaFormCtrl', RemoveMangaFormCtrl)
    .controller('ExportMangaFormCtrl', ExportMangaFormCtrl);
/* @ngInject */
function Manga($resource, API_URL) {
    return $resource(API_URL + '/manga/:mangaId', {
        mangaId: '@mangaId'
    }, {
        update: {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}

/* @ngInject */
function ImportMangaFormCtrl($mdDialog, $mdToast) {
    var vm = this;
    vm.mangas = '';
    vm.importMangas = importMangas;
    vm.cancel = cancel;

    function importMangas() {
        $http.get(API_URL + '/manga/import')
            .success(function () {
                var toast = $mdToast.simple()
                    .content('Mangas successfully imported!')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            })
            .error(function (data, status) {
                console.error(data, status);
                var toast = $mdToast.simple()
                    .content('Could not import the mangas... :(')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            });
    }

    function cancel() {
        $mdDialog.cancel();
    }
}

/* @ngInject */
function RemoveMangaFormCtrl($mdDialog, $mdToast) {
    var vm = this;
    vm.mangas = '';
    vm.removeMangas = removeMangas;
    vm.cancel = cancel;

    function removeMangas() {
        $http.get(API_URL + '/manga/remove')
            .success(function () {
                var toast = $mdToast.simple()
                    .content('Mangas successfully removed!')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            })
            .error(function (data, status) {
                console.error(data, status);
                var toast = $mdToast.simple()
                    .content('Could not remove the mangas... :(')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            });
    }

    function cancel() {
        $mdDialog.cancel();
    }
}

/* @ngInject */
function ExportMangaFormCtrl($mdDialog, Manga) {
    var vm = this;
    vm.mangas = '';
    vm.cancel = cancel;

    _init();

    function cancel() {
        $mdDialog.cancel();
    }

    function _init() {
        Manga.get().$promise.then(function(mangas) {
            vm.mangas = mangas;
        });
    }
}
