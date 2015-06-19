'use strict';

angular.module('mrTracker.mangas', [])
    .factory('Manga', Manga)
    .controller('ImportMangaFormCtrl', ImportMangaFormCtrl)
    .controller('RemoveMangaFormCtrl', RemoveMangaFormCtrl)
    .controller('ExportMangaFormCtrl', ExportMangaFormCtrl);

/* @ngInject */
function Manga($resource, API_URL) {
    return $resource(API_URL + '/mangas/:mangaId', {
        mangaId: '@mangaId'
    });
}

/* @ngInject */
function ImportMangaFormCtrl($mdDialog, $mdToast, $http, API_URL) {
    var vm = this;
    vm.mangas = '';
    vm.importMangas = importMangas;
    vm.cancel = cancel;

    function importMangas(mangas) {
        $http.post(API_URL + '/mangas/import', mangas)
            .success(function() {
                var toast = $mdToast.simple()
                    .content('Mangas successfully imported!')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            })
            .error(function(data, status) {
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
function RemoveMangaFormCtrl($mdDialog, $mdToast, $http, API_URL) {
    var vm = this;
    vm.mangas = '';
    vm.removeMangas = removeMangas;
    vm.cancel = cancel;

    function removeMangas(mangas) {
        $http.delete(API_URL + '/mangas', {
                data: mangas
            })
            .success(function() {
                var toast = $mdToast.simple()
                    .content('Mangas successfully removed!')
                    .position('top left right')
                    .action('OK')
                    .hideDelay(2000);
                $mdToast.show(toast);
                $mdDialog.hide();
            })
            .error(function(data, status) {
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
function ExportMangaFormCtrl($mdDialog, $http, API_URL) {
    var vm = this;
    vm.mangas = '';
    vm.cancel = cancel;

    _init();

    function cancel() {
        $mdDialog.cancel();
    }

    function _init() {
        $http.get(API_URL + '/mangas')
            .success(function(mangaList) {
                var mangas = '';
                for (var i = 0; i < mangaList.length; i++) {
                    mangas += mangaList[i].mangaId;
                    if (i < mangaList.length - 1) {
                        mangas += ',';
                    }
                }
                vm.mangas = mangas;
            });
    }
}
