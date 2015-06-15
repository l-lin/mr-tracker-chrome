'use strict';

angular.module('mrTracker.mangas', [])
    .factory('Manga', Manga)
    .controller('ImportMangaFormCtrl', ImportMangaFormCtrl)
    .controller('RemoveMangaFormCtrl', RemoveMangaFormCtrl);

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
        // TODO: Send request to the server
        var toast = $mdToast.simple()
            .content('Mangas successfully imported!')
            .position('top left right')
            .action('OK')
            .hideDelay(2000);
        $mdToast.show(toast);
        $mdDialog.hide();
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
        // TODO: Send request to the server
        var toast = $mdToast.simple()
            .content('Mangas successfully removed!')
            .position('top left right')
            .action('OK')
            .hideDelay(2000);
        $mdToast.show(toast);
        $mdDialog.hide();
    }

    function cancel() {
        $mdDialog.cancel();
    }
}
