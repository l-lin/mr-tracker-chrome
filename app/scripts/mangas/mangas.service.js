'use strict';

angular.module('mrTracker.mangas')
    .factory('Manga', Manga);

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
