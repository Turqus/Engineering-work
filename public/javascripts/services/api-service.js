// example use
// add ApiService in module dependencies
// call one of the ApiService functions
// ApiService.item.all().then(function (result) { console.log('items', result); })


angular.module('TodoListApp')
    .service('ApiService', ['$q', '$http', function ($q, $http) {

        var routes = {
            staff: '/users',
            profile: '/profile',
            board: '/board',
            card: '/card'
        };
        
        var api = {
            card: {
                deadline: function (data) {
                    return post({
                        url: routes.card + '/set-deadline',
                        data: data
                    });
                },
                deleteCard: function (data) {
                    return post({
                        url: routes.card + '/delete-card',
                        data: data
                    });
                },
                transferCard: function (data) {
                    return put({
                        url: routes.card + '/transfer-card',
                        data: data
                    });
                },
                copyCard: function (data) {
                    return put({
                        url: routes.card + '/copy-card',
                        data: data
                    });
                },
            },
            staff: {
                // all: function (query) {
                //     return get({
                //         url: routes.item + (query || '')
                //     });
                // },
                add: function (data) {
                    return post({
                        url: routes.staff + '/create/card',
                        data: data
                    });
                },
                addComment: function (data) {
                    return post({
                        url: routes.staff + '/add/comment',
                        data: data
                    });
                },
                addMemberBoard: function (data) {
                    return post({
                        url: routes.staff + '/add/member/board',
                        data: data
                    });
                },
                addMemberToCard: function (data) {
                    return post({
                        url: routes.staff + '/add/member',
                        data: data
                    });
                },
                addList: function (data) {
                    return post({
                        url: routes.staff + '/create/lists',
                        data: data
                    });
                },
                addBoard: function (data) {
                    return post({
                        url: routes.staff + '/create/board',
                        data: data
                    });
                },
                // list: function (params) {
                //     return get({
                //         url: routes.staff + '/lists',
                //         params: params

                //     });
                // },
                boards: function (params) {
                    return get({
                        url: routes.staff + '/boards',
                        params: params
                    });
                },
                selectedBoard: function (params) {
                    return get({
                        url: routes.staff + '/selected/board',
                        params: params
                    });
                },
                 usercards: function (params) {
                    return get({
                        url: routes.staff + '/usercards',
                        params: params
                    });
                },
                cards: function (params) {
                    return get({
                        url: routes.staff + '/cards',
                        params: params
                    });
                },
                update: function (data) {
                    return put({
                        url: routes.staff + '/updatecards',
                        data: data
                    });
                },
                addLabelToCard: function (data) {
                    return post({
                        url: routes.staff + '/add/label/card',
                        data: data
                    });
                },
                addLabelToBoard: function (data) {
                    return post({
                        url: routes.staff + '/add/label/board',
                        data: data
                    });
                },
                addDescrip: function (data) {
                    return post({
                        url: routes.staff + '/add/descrip/card',
                        data: data
                    });
                },
                deleteLabel: function (id) {
                    return remove({
                        url: routes.staff + '/label/delete/' + id
                    });
                },
                addListsOfTasks: function (data) {
                    return post({
                        url: routes.staff + '/add/lists/tasks',
                        data: data
                    });
                },
 
            },
            profile: {
                updateInformation: function (data) {
                    return post({
                        url: routes.profile + '/update/information',
                        data: data
                    });
                },
                updatePersonalInformation: function (data) {
                    return post({
                        url: routes.profile + '/update/personal/information',
                        data: data
                    });
                },
            },
            board: {
                changeBackground: function (data) {
                    return put({
                        url: routes.board + '/change/background',
                        data: data
                    });
                }
            }
        };

        function ajax(req) {
            var baseUrl = 'http://localhost:3000';
            var d = $q.defer();
            req.url = baseUrl + req.url;

            $http(req)
                .then(function handleSuccess(response) {
                    if (response.data.status == "error") {
                        return d.reject(response.data);
                    }
                    d.resolve(response.data);
                }, function handleError(response) {
                    d.reject(response.data);
                });
            return d.promise;
        }

        function get(req) {
            req.method = "GET";
            return ajax(req);
        }

        function post(req) {
            req.method = "POST";
            return ajax(req);
        }

        function remove(req) {
            req.method = "DELETE";
            return ajax(req);
        }

        function put(req) {
            req.method = "PUT";
            return ajax(req);
        }

        return api;
    }]);